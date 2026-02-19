# Getting Started - Complete Guide

Welcome to the AI Hiring Platform! This guide will walk you through everything you need to know.

## 📋 Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Running the Application](#running-the-application)
4. [Using the Platform](#using-the-platform)
5. [Testing with Sample Data](#testing-with-sample-data)
6. [Common Workflows](#common-workflows)
7. [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

Before you begin, ensure you have installed:

1. **Node.js (v18+)**
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL (v14+)**
   - Download from: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

3. **OpenAI API Key**
   - Sign up at: https://platform.openai.com/
   - Create API key: https://platform.openai.com/api-keys

### Quick Install (Recommended)

Open PowerShell in the project directory:

```powershell
# Run automated setup
.\setup.ps1
```

This will:
- ✅ Check Node.js installation
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Create .env file

### Manual Install

If you prefer manual installation:

```powershell
# Backend
cd backend
npm install

# Frontend
cd ..\frontend
npm install
```

## Configuration

### Step 1: Database Setup

Create a PostgreSQL database:

```sql
-- Option A: Using psql command line
psql -U postgres
CREATE DATABASE ai_hiring_platform;
\q

-- Option B: Using pgAdmin GUI
-- Create new database named "ai_hiring_platform"
```

### Step 2: Environment Variables

Edit `backend\.env`:

```env
# Database - Update with your credentials
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ai_hiring_platform"

# JWT - Generate a random secret
JWT_SECRET="your-super-secret-key-change-this-to-random-string"
JWT_EXPIRES_IN="7d"

# OpenAI - Add your API key
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Server
PORT=5000
NODE_ENV="development"

# Uploads
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880
```

**To generate a secure JWT_SECRET:**
```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

### Step 3: Database Migration

```powershell
cd backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Verify with Prisma Studio (optional)
npm run prisma:studio
```

## Running the Application

### Development Mode

Open **TWO** PowerShell terminals:

**Terminal 1 - Backend:**
```powershell
cd e:\projectlinkedin\backend
npm run dev
```
✅ Backend running on http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd e:\projectlinkedin\frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

### Verify Installation

Open browser to http://localhost:3000

You should see:
- ✅ Landing page loads
- ✅ "Get Started" button visible
- ✅ No console errors (F12)

## Using the Platform

### First Time Setup

#### 1. Create Recruiter Account

1. Click **"Get Started"** or **"Register"**
2. Select **"Recruiter"** role
3. Fill in details:
   ```
   Full Name: John Recruiter
   Email: recruiter@test.com
   Password: password123
   ```
4. Click **"Create account"**
5. You'll be redirected to Recruiter Dashboard

#### 2. Create Your First Job

1. Click **"Create New Job"**
2. Fill in job details:
   ```
   Job Title: Senior React Developer
   Description: We're looking for an experienced React developer...
   
   Skills (add one by one, press Enter):
   - React
   - TypeScript
   - Node.js
   - PostgreSQL
   
   Location: New York, NY
   Experience Level: Senior
   Remote: ✓ (checked)
   
   Min Salary: 100000
   Max Salary: 150000
   
   Education: Bachelor's degree in Computer Science
   
   Custom Questions (optional):
   - What is your experience with React Hooks?
   - Describe a complex project you've worked on
   ```
3. Click **"Create Job Post"**
4. ✅ Job created!

#### 3. Create Candidate Account

1. Open **new incognito/private browser window** (to avoid logout)
2. Go to http://localhost:3000
3. Click **"Register"**
4. Select **"Candidate"** role
5. Fill in details:
   ```
   Full Name: Jane Candidate
   Email: candidate@test.com
   Password: password123
   ```
6. Click **"Create account"**

#### 4. Apply to a Job

1. Click **"Browse Jobs"** from candidate dashboard
2. You should see the job you created
3. Click **"View Details"**
4. Review job requirements
5. Click **"Apply for this Position"**
6. Fill application form:
   ```
   Skills (add each then click Add):
   - React
   - TypeScript
   - JavaScript
   - HTML
   - CSS
   
   Experience:
   5 years of frontend development with focus on React.
   Built multiple production applications...
   
   Education Level: Bachelor's Degree
   
   Portfolio: https://github.com/yourprofile
   
   Cover Letter:
   I am excited about this opportunity...
   
   Resume: Upload any PDF file (for testing)
   ```
7. Click **"Submit Application"**
8. ✅ Application submitted! AI is scoring...

#### 5. View AI Rankings (Switch to Recruiter)

1. Go back to recruiter browser window
2. Go to Dashboard (if not already there)
3. Click **"View Applications"** on your job
4. You'll see:
   - Candidate name and email
   - **AI Suitability Score** (0-100)
   - Rank (#1, #2, etc.)
   - Top 10 candidates highlighted with ⭐
   - Skills, experience details
   - Download resume button
5. Update status:
   - Click **"Mark as Viewed"**
   - Click **"Shortlist"** for good candidates
   - Click **"Reject"** or **"Select"** as needed

#### 6. Track Application Status (Candidate)

1. Switch to candidate browser window
2. Go to **"Track Applications"** or Dashboard
3. You'll see:
   - Application status (Applied/Viewed/Shortlisted/etc.)
   - Your AI suitability score
   - Application date
   - Job details

## Testing with Sample Data

Want to test with realistic data? Use the seed script:

```powershell
cd backend
npm run seed
```

This creates:
- ✅ 2 Recruiters with accounts
- ✅ 3 Candidates with accounts
- ✅ 4 Job postings (various roles)
- ✅ 4 Sample applications with AI scores

**Login Credentials After Seeding:**

Recruiters:
- `recruiter@example.com` / `password123`
- `hr@techcorp.com` / `password123`

Candidates:
- `candidate1@example.com` / `password123`
- `candidate2@example.com` / `password123`
- `candidate3@example.com` / `password123`

Now you can:
1. Login as recruiter and see existing jobs
2. View applications with AI rankings
3. Login as candidate and browse jobs
4. Test all features with realistic data

## Common Workflows

### Workflow 1: Hiring Process (Recruiter)

```
1. Login → Recruiter Dashboard
2. Create Job Post
3. Wait for applications
4. View Applications (sorted by AI score)
5. Review top candidates
6. Mark as "Viewed"
7. Shortlist best candidates
8. Interview
9. Mark as "Selected"
```

### Workflow 2: Job Search (Candidate)

```
1. Login → Candidate Dashboard
2. Browse Jobs
3. Filter by location/skills
4. View Job Details
5. Apply with resume
6. Track Application Status
7. Check AI Score
8. Wait for updates
```

### Workflow 3: Bulk Application Review (Recruiter)

```
1. Go to Job Applications page
2. Sort by AI score (automatic)
3. Focus on top 10 (⭐ marked)
4. Download resumes
5. Shortlist 3-5 candidates
6. Reject weak matches
7. Schedule interviews with shortlisted
```

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
```powershell
# Check if PostgreSQL is running
# Windows: Check Services app

# Verify DATABASE_URL in backend\.env
# Make sure credentials are correct

# Reset database
cd backend
npm run prisma:migrate
```

### Issue: "OpenAI API error"

**Solution:**
```powershell
# Check OPENAI_API_KEY in backend\.env

# Verify API key is active:
# Go to https://platform.openai.com/api-keys

# Check billing:
# Go to https://platform.openai.com/account/billing

# Note: Fallback scoring activates if API fails
```

### Issue: "Port already in use"

**Solution:**
```powershell
# Backend (port 5000)
# Edit backend\.env: PORT=5001

# Frontend (port 3000)
# Edit frontend\vite.config.ts: port: 3001
```

### Issue: "Resume upload fails"

**Solution:**
```powershell
# Check file size (max 5MB)
# Check file type (PDF or DOC only)

# Ensure uploads folder exists:
cd backend
mkdir uploads

# Check MAX_FILE_SIZE in .env
```

### Issue: "Module not found"

**Solution:**
```powershell
# Reinstall dependencies
cd backend
rm -r node_modules
npm install

cd ..\frontend
rm -r node_modules
npm install
```

### Issue: "AI score not showing"

**Possible causes:**
1. OpenAI API key invalid → Check backend logs
2. API quota exceeded → Check OpenAI dashboard
3. Network issue → Check internet connection

**Solution:** Fallback scoring will still provide basic scores

### Issue: "Page not loading"

**Solution:**
```powershell
# Clear browser cache (Ctrl+Shift+Delete)
# Check both terminals are running
# Check for errors in terminal output
# Verify ports 3000 and 5000 are free
```

## Advanced Features

### Prisma Studio (Database GUI)

View and edit database directly:
```powershell
cd backend
npm run prisma:studio
```

Opens at http://localhost:5555

### API Testing with Postman

Test API endpoints directly:

1. **Register User:**
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "email": "test@example.com",
     "password": "password123",
     "fullName": "Test User",
     "role": "CANDIDATE"
   }
   ```

2. **Login:**
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

3. **Get Jobs:**
   ```
   GET http://localhost:5000/api/jobs
   ```

### View Logs

**Backend logs:**
Check the terminal running `npm run dev`

**Frontend logs:**
Open browser console (F12) → Console tab

**Database logs:**
Use Prisma Studio or pgAdmin

## Production Deployment

When ready to deploy:

1. Read `DEPLOYMENT.md` for detailed instructions
2. Update environment variables for production
3. Set up proper database backups
4. Enable HTTPS
5. Configure domain name
6. Set up monitoring

## Getting Help

If you're stuck:

1. **Check Documentation:**
   - README.md - Complete reference
   - QUICKSTART.md - Fast setup
   - AI_SCORING_GUIDE.md - AI system details
   - DEPLOYMENT.md - Production deploy

2. **Review Logs:**
   - Backend terminal for API errors
   - Browser console for frontend errors
   - Prisma Studio for database issues

3. **Common Solutions:**
   - Restart both servers
   - Clear browser cache
   - Reinstall dependencies
   - Reset database

## Next Steps

Now that you're up and running:

1. ✅ Test all features thoroughly
2. ✅ Customize branding and colors
3. ✅ Add more job postings
4. ✅ Test with multiple applications
5. ✅ Review AI scoring results
6. ✅ Prepare for deployment

## Tips for Success

**For Testing:**
- Use incognito windows for multiple accounts
- Create applications with varying skill levels
- Test all application statuses
- Try different search filters

**For Development:**
- Use Prisma Studio to inspect data
- Check browser console regularly
- Monitor backend terminal for errors
- Use seed data for quick testing

**For Customization:**
- Colors: `frontend/tailwind.config.js`
- Logo: `frontend/src/pages/LandingPage.tsx`
- AI prompt: `backend/src/services/ai.service.ts`
- Database: `backend/prisma/schema.prisma`

---

**You're all set! Enjoy building with the AI Hiring Platform! 🚀**

For questions or issues, refer to the documentation files or check the troubleshooting section.
