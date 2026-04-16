from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

from models import (
    User, UserCreate, UserLogin, UserResponse, UserRole,
    Vehicle, VehicleCreate, VehicleUpdate, VehicleResponse, VehicleStatus, VehicleSearchQuery,
    AuditLog, AuditLogCreate, InterpolFlag
)
from auth import (
    get_password_hash, verify_password, create_access_token, 
    get_current_user, require_role
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Zimbabwe Vehicle Management System")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Dependency to pass db to auth functions
async def get_db():
    return db

# Create indexes on startup
@app.on_event("startup")
async def startup_event():
    # Create indexes for faster queries
    await db.users.create_index("email", unique=True)
    await db.vehicles.create_index("vin", unique=True)
    await db.vehicles.create_index("registration_number")
    await db.vehicles.create_index("customs_entry_number")
    await db.audit_logs.create_index("timestamp")
    
    # Create default admin user if not exists
    admin_exists = await db.users.find_one({"role": "admin"})
    if not admin_exists:
        admin_user = User(
            email="admin@zimra.gov.zw",
            hashed_password=get_password_hash("Admin@123"),
            full_name="System Administrator",
            role=UserRole.ADMIN,
            organization="ZIMRA"
        )
        await db.users.insert_one(admin_user.dict())
        logging.info("Default admin user created: admin@zimra.gov.zw / Admin@123")

# Helper function to log audit
async def log_audit(user: User, action: str, resource_type: str, resource_id: Optional[str] = None, details: Optional[dict] = None):
    audit_log = AuditLog(
        user_id=user.id,
        user_email=user.email,
        user_role=user.role,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details
    )
    await db.audit_logs.insert_one(audit_log.dict())

# Auth Endpoints
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate, current_user: User = Depends(require_role([UserRole.ADMIN]))):
    """Only admins can register new users"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        role=user_data.role,
        organization=user_data.organization,
        badge_number=user_data.badge_number
    )
    
    await db.users.insert_one(user.dict())
    await log_audit(current_user, "USER_CREATE", "user", user.id, {"email": user.email, "role": user.role})
    
    return UserResponse(**user.dict())

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user_dict = await db.users.find_one({"email": credentials.email})
    if not user_dict:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(**user_dict)
    
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.id, "role": user.role})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user.dict()).dict()
    }

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(lambda creds=Depends(get_current_user): get_current_user(creds, db))):
    return UserResponse(**current_user.dict())

# Vehicle Endpoints
@api_router.post("/vehicles", response_model=VehicleResponse)
async def create_vehicle(
    vehicle_data: VehicleCreate,
    current_user: User = Depends(lambda creds: get_current_user(creds, db))
):
    """Customs officers create vehicle records for imported cars"""
    if current_user.role not in [UserRole.CUSTOMS, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Only Customs officers can add vehicles")
    
    # Check if VIN already exists
    existing = await db.vehicles.find_one({"vin": vehicle_data.vin})
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle with this VIN already exists")
    
    # Create vehicle
    vehicle = Vehicle(
        **vehicle_data.dict(),
        created_by=current_user.id,
        status=VehicleStatus.IMPORTED
    )
    
    await db.vehicles.insert_one(vehicle.dict())
    await log_audit(current_user, "VEHICLE_CREATE", "vehicle", vehicle.id, {"vin": vehicle.vin})
    
    return VehicleResponse(**vehicle.dict())

@api_router.get("/vehicles/search", response_model=List[VehicleResponse])
async def search_vehicles(
    vin: Optional[str] = None,
    registration_number: Optional[str] = None,
    make: Optional[str] = None,
    model: Optional[str] = None,
    year: Optional[int] = None,
    customs_entry_number: Optional[str] = None,
    interpol_flag: Optional[bool] = None,
    current_user: User = Depends(lambda creds: get_current_user(creds, db))
):
    """Search vehicles - all authenticated users can search"""
    query = {}
    
    if vin:
        query["vin"] = {"$regex": vin, "$options": "i"}
    if registration_number:
        query["registration_number"] = {"$regex": registration_number, "$options": "i"}
    if make:
        query["make"] = {"$regex": make, "$options": "i"}
    if model:
        query["model"] = {"$regex": model, "$options": "i"}
    if year:
        query["year"] = year
    if customs_entry_number:
        query["customs_entry_number"] = {"$regex": customs_entry_number, "$options": "i"}
    if interpol_flag is not None:
        query["interpol_flag"] = interpol_flag
    
    # Interpol users only see flagged vehicles
    if current_user.role == UserRole.INTERPOL:
        query["interpol_flag"] = True
    
    vehicles = await db.vehicles.find(query).limit(100).to_list(100)
    
    # Log search audit
    await log_audit(current_user, "VEHICLE_SEARCH", "vehicle", None, query)
    
    return [VehicleResponse(**v) for v in vehicles]

@api_router.get("/vehicles/{vehicle_id}", response_model=VehicleResponse)
async def get_vehicle(
    vehicle_id: str,
    current_user: User = Depends(lambda creds: get_current_user(creds, db))
):
    """Get vehicle details by ID"""
    vehicle_dict = await db.vehicles.find_one({"id": vehicle_id})
    if not vehicle_dict:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    vehicle = Vehicle(**vehicle_dict)
    
    # Interpol can only view flagged vehicles
    if current_user.role == UserRole.INTERPOL and not vehicle.interpol_flag:
        raise HTTPException(status_code=403, detail="Access denied")
    
    await log_audit(current_user, "VEHICLE_VIEW", "vehicle", vehicle_id)
    
    return VehicleResponse(**vehicle.dict())

@api_router.put("/vehicles/{vehicle_id}", response_model=VehicleResponse)
async def update_vehicle(
    vehicle_id: str,
    vehicle_data: VehicleUpdate,
    current_user: User = Depends(lambda creds: get_current_user(creds, db))
):
    """Update vehicle details - Customs and Admin only"""
    if current_user.role not in [UserRole.CUSTOMS, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    vehicle_dict = await db.vehicles.find_one({"id": vehicle_id})
    if not vehicle_dict:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    update_data = {k: v for k, v in vehicle_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.vehicles.update_one(
        {"id": vehicle_id},
        {"$set": update_data}
    )
    
    await log_audit(current_user, "VEHICLE_UPDATE", "vehicle", vehicle_id, update_data)
    
    updated_vehicle = await db.vehicles.find_one({"id": vehicle_id})
    return VehicleResponse(**updated_vehicle)

@api_router.post("/vehicles/{vehicle_id}/interpol-flag")
async def flag_vehicle_interpol(
    vehicle_id: str,
    flag_data: InterpolFlag,
    current_user: User = Depends(lambda creds: get_current_user(creds, db))
):
    """Flag a vehicle for Interpol - Admin and Interpol only"""
    if current_user.role not in [UserRole.ADMIN, UserRole.INTERPOL]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    vehicle_dict = await db.vehicles.find_one({"id": vehicle_id})
    if not vehicle_dict:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    await db.vehicles.update_one(
        {"id": vehicle_id},
        {"$set": {
            "interpol_flag": True,
            "interpol_flag_reason": flag_data.reason,
            "interpol_flag_date": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }}
    )
    
    await log_audit(current_user, "INTERPOL_FLAG", "vehicle", vehicle_id, {"reason": flag_data.reason})
    
    return {"message": "Vehicle flagged successfully"}

@api_router.delete("/vehicles/{vehicle_id}/interpol-flag")
async def unflag_vehicle_interpol(
    vehicle_id: str,
    current_user: User = Depends(lambda creds: get_current_user(creds, db))
):
    """Remove Interpol flag - Admin and Interpol only"""
    if current_user.role not in [UserRole.ADMIN, UserRole.INTERPOL]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    await db.vehicles.update_one(
        {"id": vehicle_id},
        {"$set": {
            "interpol_flag": False,
            "interpol_flag_reason": None,
            "interpol_flag_date": None,
            "updated_at": datetime.utcnow()
        }}
    )
    
    await log_audit(current_user, "INTERPOL_UNFLAG", "vehicle", vehicle_id)
    
    return {"message": "Interpol flag removed successfully"}

# Audit Logs
@api_router.get("/audit-logs", response_model=List[AuditLog])
async def get_audit_logs(
    resource_id: Optional[str] = None,
    user_id: Optional[str] = None,
    action: Optional[str] = None,
    limit: int = 100,
    current_user: User = Depends(lambda creds: get_current_user(creds, db))
):
    """Get audit logs - Admin only"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    query = {}
    if resource_id:
        query["resource_id"] = resource_id
    if user_id:
        query["user_id"] = user_id
    if action:
        query["action"] = action
    
    logs = await db.audit_logs.find(query).sort("timestamp", -1).limit(limit).to_list(limit)
    return [AuditLog(**log) for log in logs]

# Stats endpoint
@api_router.get("/stats")
async def get_stats(current_user: User = Depends(lambda creds: get_current_user(creds, db))):
    """Get system statistics"""
    total_vehicles = await db.vehicles.count_documents({})
    flagged_vehicles = await db.vehicles.count_documents({"interpol_flag": True})
    
    # Recent imports (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_imports = await db.vehicles.count_documents({
        "import_date": {"$gte": thirty_days_ago}
    })
    
    stats = {
        "total_vehicles": total_vehicles,
        "flagged_vehicles": flagged_vehicles,
        "recent_imports": recent_imports
    }
    
    # Admin gets more stats
    if current_user.role == UserRole.ADMIN:
        total_users = await db.users.count_documents({})
        stats["total_users"] = total_users
    
    return stats

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
