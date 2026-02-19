# Quick Start Guide

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js v18+ installed
- ✅ PostgreSQL installed and running
- ✅ OpenAI API key (get from https://platform.openai.com/api-keys)

## Step-by-Step Setup (5 minutes)

### 1. Backend Setup

Open a PowerShell terminal in the backend folder:

```powershell
cd e:\projectlinkedin\backend

# Install dependencies
npm install

# Create .env file from example
Copy-Item .env.example .env

# Edit .env file - Update these values:
# - DATABASE_URL with your PostgreSQL connection
# - JWT_SECRET with a random secret key
# - OPENAI_API_KEY with your OpenAI key
notepad .env

# Setup database
npm run prisma:generate
npm run prisma:migrate

# Start backend server
npm run dev
```

Backend should now be running on http://localhost:5000

### 2. Frontend Setup

Open a NEW PowerShell terminal in the frontend folder:

```powershell
cd e:\projectlinkedin\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend should now be running on http://localhost:3000

## First Time Usage

### Create Recruiter Account
1. Open http://localhost:3000
2. Click "Get Started" or "Register"
3. Select "Recruiter" role
4. Fill in your details
5. You'll be redirected to Recruiter Dashboard

### Create Job Posting
1. Click "Create New Job"
2. Fill in job details:
   - Title: "Senior Full Stack Developer"
   - Description: "We are looking for an experienced developer..."
   - Add skills: React, Node.js, TypeScript (press Enter after each)
   - Experience Level: Senior
   - Location: New York, NY
   - Check "Remote" if applicable
3. Click "Create Job Post"

### Create Candidate Account
1. Open new incognito/private browser window
2. Go to http://localhost:3000
3. Click "Register"
4. Select "Candidate" role
5. Fill in your details

### Apply to Jobs
1. Click "Browse Jobs"
2. Find the job you created
3. Click "View Details"
4. Click "Apply for this Position"
5. Fill the application form:
   - Add your skills
   - Describe your experience
   - Upload a resume (PDF/DOC)
   - Add portfolio URL (optional)
   - Write cover letter (optional)
6. Click "Submit Application"

### View AI Rankings (as Recruiter)
1. Switch back to recruiter browser window
2. Go to Recruiter Dashboard
3. Click "View Applications" on your job
4. See candidates sorted by AI score (0-100)
5. Top 10 candidates are highlighted with a star
6. Update application status (Viewed/Shortlisted/Rejected/Selected)

## Common Issues & Solutions

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env is correct
- Run: `npm run prisma:migrate`

### "OpenAI API error"
- Verify OPENAI_API_KEY in backend/.env
- Check you have API credits at https://platform.openai.com/account/billing
- Fallback scoring will be used if AI fails

### Port already in use
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/vite.config.ts

### Resume upload fails
- Check MAX_FILE_SIZE in .env (default 5MB)
- Ensure file is PDF or DOC format
- Verify uploads folder exists in backend directory

## Testing the AI Features

To see AI ranking in action:

1. **Create multiple test candidates**:
   - Create 5+ candidate accounts
   - Apply with different skill sets

2. **Vary the applications**:
   - Candidate 1: Exact skill matches
   - Candidate 2: Partial skill matches
   - Candidate 3: Different experience level
   - Candidate 4: Weak match
   - Candidate 5: Strong match with great cover letter

3. **Check AI scores**:
   - Login as recruiter
   - View applications
   - Observe scoring (best candidates at top)
   - Top 10 marked with ⭐ icon

## Database Management

```powershell
# View database in browser
cd backend
npm run prisma:studio

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Create new migration after schema changes
npx prisma migrate dev --name description_of_changes
```

## Production Build

```powershell
# Build backend
cd backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
npm run preview
```

## Need Help?

Check the main README.md for:
- Complete API documentation
- Detailed project structure
- Environment variables reference
- Security features
- Troubleshooting guide

---

**🎉 You're all set! Start hiring with AI!**
