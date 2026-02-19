# 🤖 AI Hiring Platform - Smart Recruitment with Gemini AI

A full-stack web application that revolutionizes hiring using **Google Gemini AI** to intelligently rank candidates based on skills, experience, and project complexity.

## ✨ Key Features

### 🎯 For Recruiters
- **Create Job Postings** with custom requirements and screening questions
- **AI-Powered Ranking** - Gemini AI analyzes and scores candidates (0-100)
- **Project Complexity Analysis** - Evaluates technical depth, innovation, scalability
- **Overqualification Detection** - Prevents seniors from dominating entry-level jobs
- **Multi-Level Tie-Breaking** - Score → Complexity → Experience → Timestamp
- **Top 10 Auto-Highlight** - Best candidates automatically identified
- **Delete Job Posts** - Full job management control
- **Application Dashboard** - Track all applications with detailed AI insights

### 💼 For Candidates
- **Advanced Job Search** - Filter by location, experience, salary, work type
- **Drag-and-Drop Resume Upload** - PDF/DOC with instant validation
- **Real-time Filtering** - Live search with active filter badges
- **Location Selector** - 11 Indian cities + Remote option
- **Application Tracking** - Monitor status in real-time
- **Suitability Scores** - See your AI match score for each job
- **Portfolio Integration** - Showcase your work

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** (Neon Cloud Database)
- **Prisma ORM** for database management
- **Google Gemini AI 1.5 Pro** - Advanced candidate analysis
- **JWT** authentication with bcrypt
- **Multer** for file uploads
- **Helmet** + rate limiting + CORS security

### Frontend
- **React 18** + **TypeScript**
- **Vite** for fast development
- **React Router** for routing
- **Zustand** for state management
- **TailwindCSS** for styling
- **Axios** for API calls
- **React Hook Form** for form handling

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- OpenAI API Key

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
cd e:\projectlinkedin
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env
```

Edit `.env` file with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_hiring_platform"
JWT_SECRET="your-secret-key-change-this"
JWT_EXPIRES_IN="7d"
OPENAI_API_KEY="your-openai-api-key"
PORT=5000
NODE_ENV="development"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

### 3. Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
projectlinkedin/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   ├── job.controller.ts
│   │   │   └── application.controller.ts
│   │   ├── middleware/            # Auth & file upload
│   │   │   ├── auth.middleware.ts
│   │   │   └── upload.middleware.ts
│   │   ├── routes/                # API routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── job.routes.ts
│   │   │   └── application.routes.ts
│   │   ├── services/              # Business logic
│   │   │   └── ai.service.ts      # AI scoring logic
│   │   └── server.ts              # Entry point
│   ├── uploads/                   # Resume storage
│   ├── .env                       # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/                 # Page components
    │   │   ├── recruiter/
    │   │   │   ├── RecruiterDashboard.tsx
    │   │   │   ├── CreateJobPage.tsx
    │   │   │   └── JobApplicationsPage.tsx
    │   │   ├── candidate/
    │   │   │   ├── CandidateDashboard.tsx
    │   │   │   ├── JobListingsPage.tsx
    │   │   │   ├── JobDetailPage.tsx
    │   │   │   ├── ApplyJobPage.tsx
    │   │   │   └── ApplicationStatusPage.tsx
    │   │   ├── LandingPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   └── RegisterPage.tsx
    │   ├── services/              # API service layer
    │   │   ├── authService.ts
    │   │   ├── jobService.ts
    │   │   └── applicationService.ts
    │   ├── store/                 # State management
    │   │   └── authStore.ts
    │   ├── lib/
    │   │   └── api.ts             # Axios configuration
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Jobs (Recruiter)
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - Get all active jobs
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications/apply` - Submit application
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter)
- `GET /api/applications/my-applications` - Get candidate applications
- `PATCH /api/applications/:id/status` - Update application status

## 🤖 AI Scoring System

The platform uses OpenAI's GPT-4 to analyze candidates:

**Scoring Criteria:**
- **Skills Match** (30%): Matches candidate skills with job requirements
- **Experience Match** (30%): Evaluates experience level compatibility
- **Education Match** (20%): Assesses education requirements
- **Overall Fit** (20%): Analyzes cover letter and portfolio

**Output:**
- Suitability Score (0-100)
- Strengths & Weaknesses
- Recommendation for recruiter

## 🎨 User Workflows

### Recruiter Workflow
1. Register/Login as Recruiter
2. Create Job Posting with requirements
3. View AI-sorted applications (best-fit first)
4. Review candidate profiles and scores
5. Update application status (Viewed/Shortlisted/Rejected/Selected)

### Candidate Workflow
1. Register/Login as Candidate
2. Browse available jobs with filters
3. View job details and requirements
4. Submit application with resume
5. Track application status in dashboard
6. View AI suitability scores

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration time | `7d` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `PORT` | Backend server port | `5000` |
| `UPLOAD_DIR` | Resume upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Maximum file size (bytes) | `5242880` |

## 🧪 Testing the Application

1. **Register as Recruiter**:
   - Create account with role "Recruiter"
   - Create 2-3 job postings with different requirements

2. **Register as Candidate**:
   - Create account with role "Candidate"
   - Browse jobs and apply to multiple positions
   - Upload resume and fill application forms

3. **Test AI Ranking**:
   - Login as Recruiter
   - View applications for a job
   - Check AI scores and rankings
   - Update application statuses

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Protected API routes
- File upload validation
- SQL injection prevention (Prisma)

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
# Verify DATABASE_URL in .env
npm run prisma:migrate
```

### OpenAI API Error
```bash
# Verify OPENAI_API_KEY in .env
# Check API quota and billing
```

### File Upload Error
```bash
# Ensure uploads directory exists
mkdir uploads
# Check MAX_FILE_SIZE setting
```

## 📈 Future Enhancements

- [ ] Email notifications for status updates
- [ ] Video interview scheduling
- [ ] Advanced analytics dashboard
- [ ] Bulk application actions
- [ ] Resume parsing
- [ ] Job recommendations for candidates
- [ ] Company profiles
- [ ] Multi-language support

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👥 Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ using AI-powered technology**
