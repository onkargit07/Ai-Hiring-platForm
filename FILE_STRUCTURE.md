# 📁 Project File Structure

Complete overview of all files and directories in the AI Hiring Platform.

```
e:\projectlinkedin/
│
├── 📄 README.md                          # Main documentation
├── 📄 QUICKSTART.md                      # Quick setup guide
├── 📄 GETTING_STARTED.md                 # Detailed setup guide
├── 📄 AI_SCORING_GUIDE.md                # AI system documentation
├── 📄 DEPLOYMENT.md                      # Production deployment guide
├── 📄 PROJECT_SUMMARY.md                 # Project overview
├── 📄 CHECKLIST.md                       # Setup verification checklist
├── 📄 FILE_STRUCTURE.md                  # This file
├── 📄 setup.ps1                          # Automated setup script
│
├── 📁 backend/                           # Backend API (Node.js + Express)
│   │
│   ├── 📁 prisma/                        # Database configuration
│   │   ├── 📄 schema.prisma             # Database schema definition
│   │   └── 📄 seed.ts                   # Sample data generator
│   │
│   ├── 📁 src/                           # Source code
│   │   │
│   │   ├── 📁 controllers/              # Request handlers
│   │   │   ├── 📄 auth.controller.ts    # Registration & login logic
│   │   │   ├── 📄 job.controller.ts     # Job CRUD operations
│   │   │   └── 📄 application.controller.ts # Application handling
│   │   │
│   │   ├── 📁 middleware/               # Express middleware
│   │   │   ├── 📄 auth.middleware.ts    # JWT authentication
│   │   │   └── 📄 upload.middleware.ts  # File upload handling
│   │   │
│   │   ├── 📁 routes/                   # API route definitions
│   │   │   ├── 📄 auth.routes.ts        # /api/auth routes
│   │   │   ├── 📄 job.routes.ts         # /api/jobs routes
│   │   │   └── 📄 application.routes.ts # /api/applications routes
│   │   │
│   │   ├── 📁 services/                 # Business logic
│   │   │   └── 📄 ai.service.ts         # OpenAI integration & scoring
│   │   │
│   │   └── 📄 server.ts                 # Express app entry point
│   │
│   ├── 📁 uploads/                       # Resume file storage
│   │   └── (uploaded files)
│   │
│   ├── 📄 package.json                   # Dependencies & scripts
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   ├── 📄 nodemon.json                   # Development server config
│   ├── 📄 .env.example                   # Environment variables template
│   ├── 📄 .env                           # Environment variables (create this)
│   └── 📄 .gitignore                     # Git ignore rules
│
└── 📁 frontend/                          # Frontend UI (React + Vite)
    │
    ├── 📁 src/                           # Source code
    │   │
    │   ├── 📁 pages/                     # Page components
    │   │   │
    │   │   ├── 📁 recruiter/            # Recruiter-specific pages
    │   │   │   ├── 📄 RecruiterDashboard.tsx    # Main dashboard
    │   │   │   ├── 📄 CreateJobPage.tsx         # Job creation form
    │   │   │   └── 📄 JobApplicationsPage.tsx   # View applications
    │   │   │
    │   │   ├── 📁 candidate/            # Candidate-specific pages
    │   │   │   ├── 📄 CandidateDashboard.tsx    # Main dashboard
    │   │   │   ├── 📄 JobListingsPage.tsx       # Browse jobs
    │   │   │   ├── 📄 JobDetailPage.tsx         # Job details
    │   │   │   ├── 📄 ApplyJobPage.tsx          # Application form
    │   │   │   └── 📄 ApplicationStatusPage.tsx # Track applications
    │   │   │
    │   │   ├── 📄 LandingPage.tsx       # Public landing page
    │   │   ├── 📄 LoginPage.tsx         # Login form
    │   │   └── 📄 RegisterPage.tsx      # Registration form
    │   │
    │   ├── 📁 services/                  # API integration layer
    │   │   ├── 📄 authService.ts        # Auth API calls
    │   │   ├── 📄 jobService.ts         # Job API calls
    │   │   └── 📄 applicationService.ts # Application API calls
    │   │
    │   ├── 📁 store/                     # State management
    │   │   └── 📄 authStore.ts          # Authentication state
    │   │
    │   ├── 📁 lib/                       # Utilities
    │   │   └── 📄 api.ts                # Axios configuration
    │   │
    │   ├── 📄 App.tsx                    # Root component & routing
    │   ├── 📄 main.tsx                   # React entry point
    │   └── 📄 index.css                  # Global styles
    │
    ├── 📄 index.html                     # HTML template
    ├── 📄 package.json                   # Dependencies & scripts
    ├── 📄 tsconfig.json                  # TypeScript configuration
    ├── 📄 tsconfig.node.json            # Node TypeScript config
    ├── 📄 vite.config.ts                # Vite configuration
    ├── 📄 tailwind.config.js            # TailwindCSS configuration
    ├── 📄 postcss.config.js             # PostCSS configuration
    └── 📄 .gitignore                    # Git ignore rules
```

## 📊 Key Files Explained

### Documentation Files (Root)

| File | Purpose | When to Use |
|------|---------|-------------|
| **README.md** | Complete project documentation | Reference for all features and APIs |
| **QUICKSTART.md** | Fast 5-minute setup | First time installation |
| **GETTING_STARTED.md** | Detailed step-by-step guide | Comprehensive setup instructions |
| **AI_SCORING_GUIDE.md** | AI system deep dive | Understanding candidate ranking |
| **DEPLOYMENT.md** | Production deployment | Deploying to live server |
| **PROJECT_SUMMARY.md** | High-level overview | Project introduction |
| **CHECKLIST.md** | Setup verification | Ensure everything works |
| **setup.ps1** | Automated installer | Quick dependency installation |

### Backend Files

#### Core Files
| File | Purpose | Key Content |
|------|---------|-------------|
| **server.ts** | Express app initialization | Routes, middleware, error handling |
| **schema.prisma** | Database structure | Tables: users, job_posts, applications |
| **.env** | Configuration | Database URL, API keys, secrets |

#### Controllers (Business Logic)
| File | Handles | Key Functions |
|------|---------|---------------|
| **auth.controller.ts** | User authentication | register(), login() |
| **job.controller.ts** | Job management | createJob(), getAllJobs(), getJobById() |
| **application.controller.ts** | Applications | applyToJob(), getJobApplications() |

#### Services (External Integration)
| File | Purpose | Integration |
|------|---------|-------------|
| **ai.service.ts** | Candidate scoring | OpenAI GPT-4 API, fallback algorithm |

#### Routes (API Endpoints)
| File | Endpoints | Protected |
|------|-----------|-----------|
| **auth.routes.ts** | /api/auth/register, /api/auth/login | No |
| **job.routes.ts** | /api/jobs/* | Some endpoints |
| **application.routes.ts** | /api/applications/* | Yes (all) |

#### Middleware
| File | Purpose | Used For |
|------|---------|----------|
| **auth.middleware.ts** | JWT verification | Protecting routes |
| **upload.middleware.ts** | File uploads | Resume handling |

### Frontend Files

#### Pages (UI Components)

**Public Pages:**
| File | Route | Purpose |
|------|-------|---------|
| **LandingPage.tsx** | / | Marketing page |
| **LoginPage.tsx** | /login | User login |
| **RegisterPage.tsx** | /register | User registration |

**Recruiter Pages:**
| File | Route | Purpose |
|------|-------|---------|
| **RecruiterDashboard.tsx** | /recruiter/dashboard | Main dashboard |
| **CreateJobPage.tsx** | /recruiter/jobs/create | Create job form |
| **JobApplicationsPage.tsx** | /recruiter/jobs/:id/applications | View & rank candidates |

**Candidate Pages:**
| File | Route | Purpose |
|------|-------|---------|
| **CandidateDashboard.tsx** | /candidate/dashboard | Main dashboard |
| **JobListingsPage.tsx** | /candidate/jobs | Browse jobs |
| **JobDetailPage.tsx** | /candidate/jobs/:id | Job details |
| **ApplyJobPage.tsx** | /candidate/jobs/:id/apply | Application form |
| **ApplicationStatusPage.tsx** | /candidate/applications | Track status |

#### Services (API Layer)
| File | Purpose | Functions |
|------|---------|-----------|
| **authService.ts** | Authentication API | register(), login() |
| **jobService.ts** | Job API | getAllJobs(), createJob(), etc. |
| **applicationService.ts** | Application API | applyToJob(), getApplications() |

#### State & Config
| File | Purpose | Content |
|------|---------|---------|
| **authStore.ts** | Global auth state | User info, token, login status |
| **api.ts** | Axios setup | Base URL, interceptors |
| **App.tsx** | Routing | All route definitions |
| **index.css** | Styles | TailwindCSS utilities |

## 🔍 File Relationships

### Authentication Flow
```
RegisterPage.tsx
  ↓ calls
authService.register()
  ↓ POST /api/auth/register
auth.routes.ts
  ↓ handles
auth.controller.register()
  ↓ saves to
Database (users table)
  ↓ returns
JWT token
  ↓ stored in
authStore.ts
```

### Job Application Flow
```
ApplyJobPage.tsx
  ↓ uploads resume & data
applicationService.applyToJob()
  ↓ POST /api/applications/apply
application.routes.ts
  ↓ uses
upload.middleware.ts (saves file)
  ↓ then
application.controller.applyToJob()
  ↓ calls
ai.service.scoreCandidate()
  ↓ OpenAI API
  ↓ returns score
  ↓ saves to
Database (applications table)
```

### View Applications Flow
```
JobApplicationsPage.tsx
  ↓ fetches
applicationService.getJobApplications()
  ↓ GET /api/applications/job/:id
application.routes.ts
  ↓ uses
auth.middleware.ts (verify recruiter)
  ↓ then
application.controller.getJobApplications()
  ↓ queries
Database (sorted by AI score)
  ↓ returns
Ranked applications
  ↓ displays
Top 10 highlighted with ⭐
```

## 📦 Dependencies

### Backend (package.json)
```json
{
  "dependencies": {
    "@prisma/client": "Database ORM client",
    "bcryptjs": "Password hashing",
    "cors": "Cross-origin requests",
    "dotenv": "Environment variables",
    "express": "Web framework",
    "express-validator": "Input validation",
    "jsonwebtoken": "JWT authentication",
    "multer": "File uploads",
    "openai": "AI integration"
  },
  "devDependencies": {
    "typescript": "TypeScript compiler",
    "prisma": "Database toolkit",
    "ts-node": "TypeScript execution",
    "nodemon": "Auto-reload server"
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "UI library",
    "react-dom": "React rendering",
    "react-router-dom": "Routing",
    "axios": "HTTP client",
    "react-hook-form": "Form handling",
    "react-hot-toast": "Notifications",
    "lucide-react": "Icons",
    "zustand": "State management"
  },
  "devDependencies": {
    "vite": "Build tool",
    "typescript": "TypeScript",
    "tailwindcss": "CSS framework",
    "@vitejs/plugin-react": "React support"
  }
}
```

## 🎯 Important Directories

### Must Create/Maintain:
- ✅ **backend/uploads/** - Resume storage (gitignored)
- ✅ **backend/node_modules/** - Dependencies (gitignored)
- ✅ **frontend/node_modules/** - Dependencies (gitignored)
- ✅ **backend/.env** - Environment config (gitignored)

### Auto-Generated:
- **backend/dist/** - Compiled TypeScript (production)
- **frontend/dist/** - Built frontend (production)
- **node_modules/** - Package dependencies

### Don't Edit:
- **prisma/migrations/** - Database migration history
- **node_modules/** - Third-party code

## 📝 File Size Reference

Approximate sizes after installation:

```
Total Project: ~800 MB

backend/
├── node_modules/  ~200 MB
├── uploads/       ~varies
├── src/          ~50 KB
└── Other         ~5 MB

frontend/
├── node_modules/  ~400 MB
├── src/          ~100 KB
└── Other         ~5 MB
```

## 🔧 Configuration Files

| File | Purpose | Edit When |
|------|---------|-----------|
| **backend/.env** | Runtime config | Always (required) |
| **backend/tsconfig.json** | TypeScript settings | Rarely |
| **frontend/vite.config.ts** | Build config | Port changes |
| **frontend/tailwind.config.js** | Styles config | Color customization |
| **prisma/schema.prisma** | Database schema | Adding features |

## 📚 Where to Find Things

**Need to...**
- **Add new API endpoint**: backend/src/routes/
- **Create new page**: frontend/src/pages/
- **Modify database**: backend/prisma/schema.prisma
- **Change AI logic**: backend/src/services/ai.service.ts
- **Update styles**: frontend/src/index.css or tailwind.config.js
- **Fix auth issues**: backend/src/middleware/auth.middleware.ts
- **Add validation**: backend/src/controllers/ (use express-validator)

---

**Tip:** Use this file structure reference when navigating the project or planning modifications.
