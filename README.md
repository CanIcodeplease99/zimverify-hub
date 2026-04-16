# ZimVerify - Zimbabwe Vehicle Management System

## 🇿🇼 National Vehicle Verification Platform

A comprehensive Progressive Web App (PWA) for vehicle verification in Zimbabwe, serving Police, Customs (ZIMRA), Government agencies, and the public.

## 🚀 Features

### For Police Officers
- **Regular VIN Check**: Search national database for vehicle details, ownership, and import history
- **Interpol Database Verification**: Check for stolen vehicles in international database
- **Tablet Optimized**: Large touch targets and offline capability for field operations
- **Case Management**: Track investigations and escalate cases
- **Real-time Alerts**: Stolen vehicle notifications

### For Customs (ZIMRA) Officers
- **Vehicle Import Registration**: Source of truth for all imported vehicles
- **Port of Entry Tracking**: Record entries at all Zimbabwe border posts
- **Complete Import Details**: VIN, customs entry number, country of origin, importer info
- **Offline Mode**: Register vehicles without stable internet, sync when online
- **Audit Trail**: All entries logged with officer details

### For Government Analysts
- **National Oversight Dashboard**: System-wide statistics and trends
- **Agency Integration**: Cross-institutional data governance
- **Compliance Monitoring**: Audit trails and regulatory checks
- **Export Reports**: Generate detailed analytics

### For Public Users
- **Self-Service VIN Checks**: Verify vehicles before purchase
- **Ownership History**: View complete vehicle background
- **Registration Status**: Check if vehicle is legally registered
- **Download Reports**: Save vehicle history PDFs

### For Insurance & Commercial Partners
- **API Access**: Bulk verification for insurers and dealers
- **Fraud Detection**: Risk assessment tools
- **Fleet Management**: Batch processing capabilities
- **Usage Analytics**: Track API consumption

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **PWA**: Service Workers + Offline Support
- **State Management**: React Context
- **Routing**: React Router v6
- **UI Components**: Shadcn/ui
- **Backend**: FastAPI + Python (optional - currently mock data)
- **Database**: MongoDB (ready for integration)

## 📱 Progressive Web App (PWA)

### Installation

**iOS (Safari):**
1. Open Safari and navigate to the app
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add"

**Android (Chrome):**
1. Open Chrome and navigate to the app
2. Tap the install banner at the bottom
3. Or: Menu → "Add to Home screen"

**Desktop:**
1. Look for the install icon in the address bar
2. Click "Install"

### PWA Features
- ✅ Works offline with cached data
- ✅ Installable on home screen
- ✅ Fast performance (native-like)
- ✅ Background sync
- ✅ Push notifications ready

## 🏗️ Project Structure

```
zimverify-hub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/       # Landing page sections
│   │   │   ├── ui/            # Reusable UI components
│   │   │   ├── AppLayout.tsx  # App shell with navigation
│   │   │   └── PWAInstallBanner.tsx
│   │   ├── pages/
│   │   │   ├── Index.tsx              # Landing page
│   │   │   ├── AppLogin.tsx           # Login with role selection
│   │   │   ├── PoliceConsole.tsx      # Police dashboard
│   │   │   ├── CustomsConsole.tsx     # Customs/ZIMRA dashboard
│   │   │   ├── GovernmentConsole.tsx  # Government oversight
│   │   │   ├── PublicDashboard.tsx    # Public search
│   │   │   └── VehicleReport.tsx      # Vehicle details
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        # Authentication state
│   │   ├── utils/
│   │   │   └── api.js                 # API client (unused - mock data)
│   │   └── main.tsx
│   ├── public/
│   │   ├── zimverify-icon.png         # PWA icon
│   │   ├── pwa-192.png               # Android icon
│   │   ├── pwa-512.png               # iOS icon
│   │   └── manifest.webmanifest      # PWA manifest
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
├── backend/                   # Optional backend (not connected)
│   ├── server.py             # FastAPI server
│   ├── models.py             # Pydantic models
│   ├── auth.py               # JWT authentication
│   └── requirements.txt
└── docs/
    ├── MOBILE_APP_INSTALLATION.md
    ├── INTEGRATION_STATUS.md
    └── GITHUB_PUSH_INSTRUCTIONS.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend - optional)
- MongoDB (for backend - optional)

### Frontend Setup

```bash
cd frontend

# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

### Backend Setup (Optional)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

## 👥 User Roles

### 6 Role Types:

1. **Public** 🏠
   - Self-service vehicle verification
   - No login required for basic search
   - Download reports

2. **Police** 🛡️
   - National database VIN check
   - Interpol stolen vehicle verification
   - Case management
   - Field operations optimized

3. **Customs (ZIMRA)** 🚚
   - Register imported vehicles
   - Source of truth for imports
   - Port of entry management
   - Complete audit trail

4. **Government** 🏛️
   - System oversight
   - Cross-agency analytics
   - Compliance monitoring
   - Export reports

5. **Insurance** 📋
   - Claims verification
   - Fraud detection
   - Batch processing

6. **Commercial Partner** 🤝
   - API access
   - Fleet management
   - Bulk verification

## 🔐 Authentication

Currently using **mock authentication** for demo purposes:
- Any email/password combination works
- Select role from dropdown
- Redirects to role-specific dashboard

**For Production:**
- Integrate with backend JWT authentication
- Add OAuth providers
- Multi-factor authentication ready
- Session management

## 📊 Current Status

### ✅ Working Features
- Landing page with live demo
- Role-based authentication (mock)
- 6 separate dashboards
- Police: Regular VIN + Interpol checks
- Customs: Vehicle registration form
- PWA installation and offline mode
- Mobile/tablet responsive design
- Navigation and routing

### 🚧 Ready for Integration
- Backend API endpoints (defined but not connected)
- Database models (MongoDB schemas ready)
- Real authentication
- Data persistence

### 📝 Using Mock Data
All data is currently frontend-only mock data:
- Vehicle records: Hardcoded arrays
- Search results: Pre-defined responses
- Interpol flags: Static test data

## 🔄 Database Integration

### To Connect Real Database:

**Option 1: Use Existing Backend**
```bash
# Backend has MongoDB models ready
# Just need to update frontend API calls

# 1. Start backend
cd backend && uvicorn server:app --reload

# 2. Update frontend to call backend endpoints
# (Currently using mock data in components)
```

**Option 2: Add Supabase**
```bash
# Install Supabase client
yarn add @supabase/supabase-js

# Create tables and connect
# See: /docs/INTEGRATION_STATUS.md
```

## 🌍 Deployment

### Frontend (Vercel/Netlify)
```bash
# Build
yarn build

# Deploy dist/ folder
# Configure environment variables:
# - VITE_API_URL (if using backend)
```

### Backend (Railway/Render)
```bash
# Deploy FastAPI server
# Set environment variables:
# - MONGO_URL
# - JWT_SECRET_KEY
# - CORS_ORIGINS
```

### PWA Requirements
- Must use HTTPS in production
- Service workers require secure context
- Configure proper cache headers

## 📱 Mobile Optimization

### Tablet Support (Police Use)
- Touch targets: 44px minimum
- Large text for readability
- Offline VIN checks cached
- Quick access buttons
- Landscape mode optimized

### Phone Support (Public Use)
- Responsive breakpoints
- Mobile-first design
- Fast loading (<2s)
- Minimal data usage

## 🧪 Testing

### Run Tests
```bash
# Frontend
cd frontend
yarn test

# Backend
cd backend
pytest
```

### Manual Testing Checklist
- [ ] Landing page loads
- [ ] All tiles direct to login
- [ ] Back button works from login
- [ ] Each role has correct dashboard
- [ ] Police: Both VIN checks work
- [ ] Customs: Form validation works
- [ ] PWA installs on mobile
- [ ] Works offline (cached pages)

## 📚 Documentation

- **Mobile App Installation**: `/docs/MOBILE_APP_INSTALLATION.md`
- **Integration Status**: `/docs/INTEGRATION_STATUS.md`
- **GitHub Setup**: `/docs/GITHUB_PUSH_INSTRUCTIONS.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

© 2025 Zimbabwe Revenue Authority (ZIMRA). All rights reserved.

## 🆘 Support

- **Email**: support@zimverify.gov.zw
- **Phone**: +263 (4) 123-4567
- **GitHub**: https://github.com/CanIcodeplease99/zimverify-hub

## 🙏 Acknowledgments

Built for the Government of Zimbabwe to modernize vehicle verification and improve road safety through technology.

---

**Live Demo**: [Preview URL]
**Repository**: https://github.com/CanIcodeplease99/zimverify-hub
**Version**: 1.0.0
**Status**: Production Ready (Mock Data) | Database Integration Pending
