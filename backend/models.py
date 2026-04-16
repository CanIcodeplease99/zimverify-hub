from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
import uuid
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    CUSTOMS = "customs"
    POLICE = "police"
    PUBLIC = "public"
    INTERPOL = "interpol"

class VehicleStatus(str, Enum):
    IMPORTED = "imported"
    ACTIVE = "active"
    TRANSFERRED = "transferred"
    FLAGGED = "flagged"
    STOLEN = "stolen"

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    hashed_password: str
    full_name: str
    role: UserRole
    organization: Optional[str] = None
    badge_number: Optional[str] = None  # For police/customs
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole
    organization: Optional[str] = None
    badge_number: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    organization: Optional[str] = None
    badge_number: Optional[str] = None
    is_active: bool
    created_at: datetime

class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vin: str  # Vehicle Identification Number
    registration_number: Optional[str] = None
    make: str
    model: str
    year: int
    color: str
    engine_number: Optional[str] = None
    chassis_number: Optional[str] = None
    
    # Import Information
    import_date: datetime
    port_of_entry: str
    country_of_origin: str
    customs_entry_number: str
    importer_name: str
    importer_id: Optional[str] = None
    
    # Current Information
    current_owner_name: Optional[str] = None
    current_owner_id: Optional[str] = None
    status: VehicleStatus = VehicleStatus.IMPORTED
    
    # Flags
    interpol_flag: bool = False
    interpol_flag_reason: Optional[str] = None
    interpol_flag_date: Optional[datetime] = None
    
    # Metadata
    created_by: str  # User ID of customs officer
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
class VehicleCreate(BaseModel):
    vin: str
    registration_number: Optional[str] = None
    make: str
    model: str
    year: int
    color: str
    engine_number: Optional[str] = None
    chassis_number: Optional[str] = None
    import_date: datetime
    port_of_entry: str
    country_of_origin: str
    customs_entry_number: str
    importer_name: str
    importer_id: Optional[str] = None
    current_owner_name: Optional[str] = None
    current_owner_id: Optional[str] = None

class VehicleUpdate(BaseModel):
    registration_number: Optional[str] = None
    current_owner_name: Optional[str] = None
    current_owner_id: Optional[str] = None
    status: Optional[VehicleStatus] = None
    color: Optional[str] = None

class VehicleResponse(BaseModel):
    id: str
    vin: str
    registration_number: Optional[str]
    make: str
    model: str
    year: int
    color: str
    engine_number: Optional[str]
    chassis_number: Optional[str]
    import_date: datetime
    port_of_entry: str
    country_of_origin: str
    customs_entry_number: str
    importer_name: str
    current_owner_name: Optional[str]
    status: VehicleStatus
    interpol_flag: bool
    interpol_flag_reason: Optional[str]
    created_at: datetime
    updated_at: datetime

class InterpolFlag(BaseModel):
    vehicle_id: str
    reason: str

class AuditLog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    user_role: UserRole
    action: str  # e.g., "VEHICLE_SEARCH", "VEHICLE_VIEW", "VEHICLE_CREATE"
    resource_type: str  # e.g., "vehicle", "user"
    resource_id: Optional[str] = None
    details: Optional[dict] = None
    ip_address: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AuditLogCreate(BaseModel):
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[dict] = None

class VehicleSearchQuery(BaseModel):
    vin: Optional[str] = None
    registration_number: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    customs_entry_number: Optional[str] = None
    interpol_flag: Optional[bool] = None
