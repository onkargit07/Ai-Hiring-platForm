# ✅ Setup Checklist

Use this checklist to ensure your AI Hiring Platform is fully configured and ready to use.

## 📦 Prerequisites Installation

- [ ] **Node.js v18+** installed
  - Run: `node --version`
  - Should show: v18.x.x or higher
  
- [ ] **npm** installed
  - Run: `npm --version`
  - Should show: 9.x.x or higher
  
- [ ] **PostgreSQL v14+** installed and running
  - Run: `psql --version`
  - Should show: psql (PostgreSQL) 14.x or higher
  
- [ ] **PostgreSQL service** is running
  - Windows: Check "Services" app
  - Should see "postgresql" service running
  
- [ ] **OpenAI API Key** obtained
  - Sign up at: https://platform.openai.com/
  - Create key at: https://platform.openai.com/api-keys
  - Save the key (starts with sk-...)

## 🔧 Project Setup

- [ ] **Run setup script**
  ```powershell
  .\setup.ps1
  ```
  - Should complete without errors
  - Should show "✅ Setup Complete!"

- [ ] **Backend dependencies** installed
  - Check: `backend\node_modules` folder exists
  - Size: ~200MB

- [ ] **Frontend dependencies** installed
  - Check: `frontend\node_modules` folder exists
  - Size: ~400MB

- [ ] **Environment file** created
  - Check: `backend\.env` file exists
  - Should contain all required variables

## ⚙️ Configuration

- [ ] **Database created**
  - Database name: `ai_hiring_platform`
  - Test connection in pgAdmin or psql

- [ ] **Database URL** configured in backend\.env
  ```env
  DATABASE_URL="postgresql://username:password@localhost:5432/ai_hiring_platform"
  ```
  - Replace `username` with your PostgreSQL username
  - Replace `password` with your PostgreSQL password

- [ ] **JWT Secret** set in backend\.env
  ```env
  JWT_SECRET="your-random-secret-key"
  ```
  - Should be a long random string
  - NEVER use default value in production

- [ ] **OpenAI API Key** set in backend\.env
  ```env
  OPENAI_API_KEY="sk-your-key-here"
  ```
  - Paste your actual OpenAI API key
  - Verify it's active on platform.openai.com

- [ ] **Other environment variables** configured
  ```env
  PORT=5000
  NODE_ENV="development"
  JWT_EXPIRES_IN="7d"
  UPLOAD_DIR="./uploads"
  MAX_FILE_SIZE=5242880
  ```

## 🗄️ Database Setup

- [ ] **Prisma Client** generated
  ```powershell
  cd backend
  npm run prisma:generate
  ```
  - Should complete without errors

- [ ] **Database migrations** run
  ```powershell
  npm run prisma:migrate
  ```
  - Should create all tables
  - Check: "Migration applied successfully"

- [ ] **Prisma Studio** opens (optional test)
  ```powershell
  npm run prisma:studio
  ```
  - Opens at http://localhost:5555
  - Can view empty tables

- [ ] **Uploads directory** exists
  - Check: `backend\uploads` folder exists
  - If not, create it: `mkdir uploads`

## 🚀 Running the Application

- [ ] **Backend starts** successfully
  ```powershell
  cd backend
  npm run dev
  ```
  - No errors in terminal
  - Shows: "🚀 Server is running on port 5000"
  - Shows: "📊 Environment: development"

- [ ] **Frontend starts** successfully
  ```powershell
  cd frontend
  npm run dev
  ```
  - No errors in terminal
  - Shows: "Local: http://localhost:3000/"

- [ ] **Landing page loads**
  - Open: http://localhost:3000
  - Page loads completely
  - No errors in browser console (F12)
  - "AI Hiring Platform" title visible

- [ ] **API health check** responds
  - Open: http://localhost:5000/api/health
  - Should see: `{"status":"ok","message":"AI Hiring Platform API is running"}`

## 🧪 Basic Testing

- [ ] **Registration works** (Recruiter)
  - Click "Get Started" or "Register"
  - Select "Recruiter" role
  - Fill form and submit
  - Redirects to Recruiter Dashboard
  - No errors

- [ ] **Login works**
  - Logout from dashboard
  - Login with same credentials
  - Successfully logged in

- [ ] **Registration works** (Candidate)
  - Open incognito window
  - Register as "Candidate"
  - Redirects to Candidate Dashboard

- [ ] **Job creation works**
  - Login as recruiter
  - Click "Create New Job"
  - Fill all required fields
  - Add at least 3 skills
  - Submit form
  - Job appears in dashboard

- [ ] **Job browsing works**
  - Login as candidate
  - Click "Browse Jobs"
  - Created job is visible
  - Can view job details

- [ ] **Application submission works**
  - As candidate, apply to a job
  - Fill application form
  - Add skills
  - Upload a PDF file (any PDF)
  - Submit application
  - Success message appears

- [ ] **AI scoring works**
  - As recruiter, view job applications
  - Application shows AI score (0-100)
  - Application has rank number
  - No errors in backend terminal

- [ ] **Status updates work**
  - As recruiter, update application status
  - Change to "Viewed"
  - Change to "Shortlisted"
  - Success message appears

- [ ] **Status tracking works**
  - As candidate, view applications
  - Status shows updated status
  - AI score is visible

## 📊 Optional: Sample Data

- [ ] **Seed data loaded** (optional)
  ```powershell
  cd backend
  npm run seed
  ```
  - Creates 2 recruiters, 3 candidates
  - Creates 4 jobs, 4 applications
  - Can login with: recruiter@example.com / password123

- [ ] **Seed data visible**
  - Login with seeded credentials
  - Jobs visible in dashboard
  - Applications visible with scores

## 🔍 Verification

- [ ] **No console errors**
  - Frontend: Open browser console (F12)
  - Should have no red errors

- [ ] **No backend errors**
  - Check backend terminal
  - Should have no error messages

- [ ] **Database has data**
  ```powershell
  cd backend
  npm run prisma:studio
  ```
  - Open http://localhost:5555
  - `users` table has entries
  - `job_posts` table has entries
  - `applications` table has entries

- [ ] **Resume uploads work**
  - Check `backend\uploads` folder
  - Should contain uploaded files

- [ ] **AI API responds**
  - Check backend logs when applying
  - Should NOT show OpenAI errors
  - If errors, verify API key and quota

## 🎨 Optional Customization

- [ ] **Brand colors updated** (optional)
  - Edit: `frontend\tailwind.config.js`
  - Change primary colors

- [ ] **Landing page customized** (optional)
  - Edit: `frontend\src\pages\LandingPage.tsx`
  - Update company name, description

- [ ] **AI prompt customized** (optional)
  - Edit: `backend\src\services\ai.service.ts`
  - Adjust scoring criteria

## 📚 Documentation Review

- [ ] **README.md** reviewed
  - Understand project structure
  - Know available API endpoints

- [ ] **QUICKSTART.md** reviewed
  - Quick reference guide
  - Common commands documented

- [ ] **AI_SCORING_GUIDE.md** reviewed
  - Understand how AI scoring works
  - Know scoring criteria

- [ ] **GETTING_STARTED.md** reviewed
  - Detailed setup instructions
  - Troubleshooting guide

## 🐛 Troubleshooting (If Needed)

If any checklist item fails:

- [ ] **Check error messages**
  - Read terminal output carefully
  - Note exact error message

- [ ] **Verify prerequisites**
  - Node.js version correct
  - PostgreSQL running
  - Database created

- [ ] **Check configuration**
  - `.env` file exists
  - All values filled in
  - No typos in DATABASE_URL

- [ ] **Reinstall dependencies**
  ```powershell
  cd backend
  rm -r node_modules
  npm install
  ```

- [ ] **Reset database**
  ```powershell
  cd backend
  npm run prisma:migrate reset
  npm run prisma:migrate
  ```

- [ ] **Check ports**
  - Port 5000 not in use (backend)
  - Port 3000 not in use (frontend)
  - Port 5432 not in use (PostgreSQL)

- [ ] **Review troubleshooting guide**
  - See GETTING_STARTED.md
  - Check common issues section

## ✅ Final Verification

- [ ] **All features work**
  - Registration ✓
  - Login ✓
  - Job creation ✓
  - Job browsing ✓
  - Application submission ✓
  - AI scoring ✓
  - Status updates ✓
  - Application tracking ✓

- [ ] **Performance acceptable**
  - Pages load quickly (< 2 seconds)
  - No lag when interacting
  - AI scoring completes (< 5 seconds)

- [ ] **Ready for use**
  - Can create multiple accounts
  - Can post multiple jobs
  - Can submit multiple applications
  - Can manage hiring process

## 🎉 Success!

If all items are checked:

✅ **Your AI Hiring Platform is fully operational!**

You can now:
- Create recruiter and candidate accounts
- Post jobs and receive applications
- Use AI-powered candidate ranking
- Manage the entire hiring process

## 📌 Quick Reference

**Start Application:**
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Database GUI: http://localhost:5555 (prisma studio)

**Test Accounts (after seeding):**
- Recruiter: recruiter@example.com / password123
- Candidate: candidate1@example.com / password123

## 📞 Need Help?

If you encounter issues:

1. Check GETTING_STARTED.md troubleshooting section
2. Review error messages carefully
3. Verify all prerequisites are met
4. Try reinstalling dependencies
5. Reset database if needed

---

**Last Updated:** Use this checklist before deploying or demonstrating the platform.

**Note:** Print this checklist or keep it open while setting up the platform for the first time.
