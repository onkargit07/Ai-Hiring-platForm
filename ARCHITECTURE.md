# 🏗️ System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React 18 + TypeScript                   │   │
│  │  ┌──────────┐  ┌───────────┐  ┌─────────────┐     │   │
│  │  │  Pages   │  │ Components│  │   Store     │     │   │
│  │  │ (Router) │  │   (UI)    │  │  (Zustand)  │     │   │
│  │  └──────────┘  └───────────┘  └─────────────┘     │   │
│  │                                                      │   │
│  │  ┌──────────────────────────────────────────┐     │   │
│  │  │      Services (API Clients)              │     │   │
│  │  │  • authService • jobService              │     │   │
│  │  │  • applicationService                    │     │   │
│  │  └──────────────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/REST (Axios)
                      │ JWT Bearer Token
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     NGINX (Production)                       │
│              Reverse Proxy + Static Files                    │
│                  Gzip Compression + Security Headers         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Express.js + TypeScript                    │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │         Middleware Stack                   │    │   │
│  │  │  • Helmet (Security Headers)               │    │   │
│  │  │  • CORS                                    │    │   │
│  │  │  • Rate Limiting                           │    │   │
│  │  │  • Input Sanitization                      │    │   │
│  │  │  • Morgan Logger                           │    │   │
│  │  │  • JWT Auth                                │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │              Routes                        │    │   │
│  │  │  /api/auth    → Authentication             │    │   │
│  │  │  /api/jobs    → Job Management             │    │   │
│  │  │  /api/applications → Application System    │    │   │
│  │  │  /api-docs    → Swagger UI                 │    │   │
│  │  │  /api/health  → Health Check               │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │            Controllers                     │    │   │
│  │  │  • authController                          │    │   │
│  │  │  • jobController                           │    │   │
│  │  │  • applicationController                   │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │             Services                       │    │   │
│  │  │  • AI Service (OpenAI GPT-4)               │    │   │
│  │  │  • Email Service (Nodemailer)              │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  │                                                      │   │
│  │  ┌────────────────────────────────────────────┐    │   │
│  │  │          Utilities                         │    │   │
│  │  │  • Logger (Winston)                        │    │   │
│  │  │  • Validation (Zod)                        │    │   │
│  │  │  • Error Classes                           │    │   │
│  │  │  • File Utils                              │    │   │
│  │  │  • Pagination                              │    │   │
│  │  └────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────┬──────────────────┬─────────────────────┬────────┘
           │                  │                     │
           ▼                  ▼                     ▼
    ┌──────────────┐  ┌──────────────┐    ┌──────────────┐
    │  PostgreSQL  │  │    Redis     │    │   OpenAI     │
    │   Database   │  │ (Rate Limit) │    │     API      │
    │              │  │   (Optional)  │    │  (Optional)  │
    │  • Users     │  └──────────────┘    └──────────────┘
    │  • Jobs      │
    │  • Apps      │          │
    │              │          ▼
    └──────┬───────┘  ┌──────────────┐
           │          │ SMTP Server  │
           │          │   (Email)    │
           │          │  (Optional)  │
           │          └──────────────┘
           ▼
    ┌──────────────┐
    │  File System │
    │   (Uploads)  │
    │   • Resumes  │
    └──────────────┘
```

---

## Request Flow

### 1. User Registration
```
User → Frontend → POST /api/auth/register
  ↓
Backend receives request
  ↓
[Middleware]
  • Rate Limiter: Check 5 req/15min limit
  • Body Parser: Parse JSON
  • Input Sanitizer: Clean XSS
  • Validator: Zod schema check
  ↓
[Controller: authController.register]
  • Hash password (Bcrypt)
  • Create user in DB (Prisma)
  • Generate JWT token
  ↓
[Email Service]
  • Send welcome email (Nodemailer)
  ↓
Response → Frontend
  • 201 Created
  • { user, token }
  ↓
Frontend
  • Save token to localStorage
  • Redirect to dashboard
```

### 2. Job Application
```
Candidate → Frontend → POST /api/applications
  • Form data + Resume file
  ↓
Backend receives multipart/form-data
  ↓
[Middleware]
  • Rate Limiter: Check upload limit
  • JWT Auth: Verify token & user
  • Multer: Handle file upload
  • File Validator: Check type/size/content
  ↓
[Controller: applicationController.submit]
  • Save application to DB
  • Trigger AI scoring
  ↓
[AI Service]
  • Call OpenAI GPT-4 API
  • Parse candidate vs job match
  • Calculate 0-100 score
  • Fallback algorithm if API fails
  ↓
[Email Service - Parallel]
  • Email candidate: "Application received"
  • Email recruiter: "New application"
  ↓
Response → Frontend
  • 201 Created
  • { application, aiScore }
  ↓
Frontend
  • Show success message
  • Redirect to application status
```

### 3. AI Scoring Process
```
Application Data
  ↓
Extract: Skills, Experience, Education
  ↓
Format Prompt for GPT-4
  ↓
OpenAI API Call
  ├─ Success: Parse JSON response
  │   • skillsMatch: 30%
  │   • experienceMatch: 30%
  │   • educationMatch: 20%
  │   • overallFit: 20%
  │   → Total Score: 0-100
  │
  └─ Failure: Fallback Algorithm
      • Count matching skills
      • Compare experience years
      • Match education level
      • Calculate weighted average
  ↓
Store Score in Database
  ↓
Return to Controller
```

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│           Layer 1: Network                  │
│  • HTTPS/TLS encryption                     │
│  • Firewall rules                           │
│  • DDoS protection (CDN)                    │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│           Layer 2: Server                   │
│  • Nginx reverse proxy                      │
│  • Rate limiting (Redis-backed)             │
│  • Request size limits                      │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│           Layer 3: Application              │
│  • Helmet security headers                  │
│  • CORS configuration                       │
│  • Input sanitization (XSS)                 │
│  • NoSQL injection prevention               │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│           Layer 4: Authentication           │
│  • JWT token validation                     │
│  • Token expiration (7 days)                │
│  • Role-based access control                │
│  • Password hashing (Bcrypt)                │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│           Layer 5: Validation               │
│  • Zod schema validation                    │
│  • File type verification                   │
│  • Content scanning                         │
│  • Business logic validation                │
└────────────────┬────────────────────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│           Layer 6: Database                 │
│  • Parameterized queries (Prisma)           │
│  • Connection pooling                       │
│  • Row-level permissions (future)           │
│  • Encrypted connections                    │
└─────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    User Actions                          │
├──────────┬──────────┬──────────┬────────────┬───────────┤
│ Register │  Login   │ Post Job │ Apply Job  │ Update    │
└──────┬───┴────┬─────┴─────┬────┴──────┬─────┴─────┬─────┘
       │        │           │           │           │
       ▼        ▼           ▼           ▼           ▼
    ┌─────────────────────────────────────────────────┐
    │              API Gateway (Express)              │
    │  • Authentication • Rate Limiting • Logging     │
    └────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ┌────────┐    ┌──────────┐    ┌──────────┐
    │  Auth  │    │   Jobs   │    │   Apps   │
    │ Service│    │ Service  │    │ Service  │
    └───┬────┘    └────┬─────┘    └────┬─────┘
        │              │               │
        ▼              ▼               ▼
    ┌──────────────────────────────────────┐
    │          Prisma ORM Layer            │
    │     (Type-safe Database Access)      │
    └─────────────────┬────────────────────┘
                      ▼
         ┌────────────────────────┐
         │   PostgreSQL Database  │
         │                        │
         │  ┌──────────────────┐ │
         │  │  users           │ │
         │  │  ┌──────────────┐│ │
         │  │  │ jobPosts     ││ │
         │  │  │ ┌───────────┐││ │
         │  │  │ │applications│││ │
         │  │  │ └───────────┘││ │
         │  │  └──────────────┘│ │
         │  └──────────────────┘ │
         └────────────────────────┘
```

---

## Deployment Architecture

### Development
```
┌─────────────────────┐    ┌─────────────────────┐
│  localhost:5173     │───▶│  localhost:5000     │
│  (Vite Dev Server)  │    │  (Express Server)   │
│     Frontend        │    │      Backend        │
└─────────────────────┘    └──────────┬──────────┘
                                      │
                                      ▼
                           ┌────────────────────┐
                           │ localhost:5432     │
                           │ PostgreSQL         │
                           └────────────────────┘
```

### Docker Compose (Local Production)
```
┌──────────────────────────────────────────────────┐
│              Docker Network                      │
│                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │  Frontend   │  │  Backend    │  │  Redis  ││
│  │  (Nginx)    │  │  (Node)     │  │  :6379  ││
│  │  :80        │  │  :5000      │  └─────────┘│
│  └──────┬──────┘  └──────┬──────┘             │
│         │                │                     │
│         └────────┬───────┘                     │
│                  │                             │
│                  ▼                             │
│         ┌─────────────────┐                    │
│         │  PostgreSQL     │                    │
│         │  :5432          │                    │
│         └─────────────────┘                    │
└──────────────────────────────────────────────────┘
         │
         ▼ Port Mapping
    Host Machine
    - Frontend: localhost:3000
    - Backend: localhost:5000
```

### Cloud Production (AWS Example)
```
                    Internet
                       │
                       ▼
              ┌───────────────┐
              │  CloudFlare   │
              │   CDN + WAF   │
              └───────┬───────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
  ┌───────────────┐      ┌───────────────┐
  │   S3 Bucket   │      │  AWS ALB      │
  │  (Frontend)   │      │ Load Balancer │
  └───────────────┘      └───────┬───────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │  EC2/ECS │ │  EC2/ECS │ │  EC2/ECS │
              │ Backend  │ │ Backend  │ │ Backend  │
              └─────┬────┘ └─────┬────┘ └─────┬────┘
                    └───────┬────┴────────────┘
                            │
                    ┌───────┴────────┐
                    ▼                ▼
           ┌─────────────┐  ┌──────────────┐
           │  RDS         │  │ ElastiCache  │
           │ PostgreSQL   │  │   Redis      │
           └─────────────┘  └──────────────┘
```

---

## File Storage Architecture

```
Backend Server
  │
  ├─ uploads/
  │   ├─ candidate_{id}_timestamp_random.pdf
  │   ├─ candidate_{id}_timestamp_random.docx
  │   └─ ...
  │
  └─ logs/
      ├─ error.log      (Error-level only)
      ├─ combined.log   (All logs)
      └─ ...

Database (PostgreSQL)
  │
  └─ applications
      └─ resumePath: "/uploads/candidate_123_1234567890_abc123.pdf"

File Access Flow:
  1. User uploads resume
  2. Multer saves to /uploads
  3. Filename sanitized & made unique
  4. Path stored in database
  5. File served via /uploads/:filename
  6. (Production: Use S3/CloudFront)
```

---

## Error Handling Flow

```
Request → Controller
    │
    ├─ Try Block
    │   └─ Business Logic
    │       ├─ Success → Response
    │       └─ Validation Error → throw ValidationError
    │
    └─ Catch Block
        └─ next(error)
            │
            ▼
    Global Error Handler Middleware
        │
        ├─ ApiError? → Use statusCode & message
        ├─ ZodError? → Format validation errors
        ├─ PrismaError? → Database error message
        ├─ JWTError? → Authentication error
        └─ Unknown? → 500 Internal Server Error
            │
            ▼
        Winston Logger
            ├─ Log to console
            ├─ Log to error.log
            └─ Log to combined.log
            │
            ▼
        JSON Response
            {
              "success": false,
              "message": "Error message",
              "errors": [...],
              "stack": "..." (dev only)
            }
```

---

## CI/CD Pipeline

```
Developer
    │
    └─ git push → GitHub
                    │
                    ▼
            GitHub Actions Triggered
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Backend     Frontend    Linting
    Tests       Tests       Checks
        │           │           │
        └───────────┴───────────┘
                    │
            All Tests Pass?
                │
        ┌───────┴───────┐
        ▼               ▼
       No              Yes
        │               │
    Fail Build      Build Docker
    Notify Dev      Images
                        │
                        ▼
                Push to Registry
                (Docker Hub/ECR)
                        │
                        ▼
                SSH to Server
                        │
                        ▼
                docker-compose pull
                docker-compose up -d
                        │
                        ▼
                Run Migrations
                        │
                        ▼
                Smoke Tests
                        │
                        ▼
                Success! 🎉
```

---

## Monitoring & Observability

```
Application
    │
    ├─ Winston Logger → Log Files
    │                    └─ Log Aggregation (ELK/Splunk)
    │
    ├─ Morgan HTTP    → Access Logs
    │                    └─ Analytics
    │
    ├─ Error Handler  → Error Tracking (Sentry)
    │
    └─ Health Check   → Monitoring (Uptime Robot)
                         └─ /api/health endpoint

Metrics to Track:
  • API Response Times
  • Error Rates
  • Database Query Performance
  • Memory Usage
  • CPU Usage
  • Active Users
  • Application Success Rate
```

---

## Tech Stack Decisions

| Decision | Choice | Why? | Alternative |
|----------|--------|------|-------------|
| Backend Framework | Express.js | Mature, flexible, huge ecosystem | Fastify, NestJS |
| Database | PostgreSQL | ACID, relations, mature | MongoDB, MySQL |
| ORM | Prisma | Type-safe, migrations, DX | TypeORM, Sequelize |
| Auth | JWT | Stateless, scalable | Sessions, OAuth |
| Frontend | React | Component-based, huge community | Vue, Angular |
| State | Zustand | Simple, lightweight | Redux, Context |
| Styling | TailwindCSS | Utility-first, fast | CSS-in-JS, SASS |
| Build Tool | Vite | Fast HMR, modern | Webpack, Parcel |
| Testing | Jest | Feature-rich, mature | Vitest, Mocha |
| Logging | Winston | Production-grade, transports | Pino, Bunyan |
| Validation | Zod | Type inference, runtime checks | Joi, Yup |
| Email | Nodemailer | SMTP support, flexible | SendGrid SDK, AWS SES |

---

**This architecture is designed for scalability, maintainability, and professional production deployment.**
