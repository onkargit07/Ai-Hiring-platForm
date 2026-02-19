# 🚀 Deployment Guide - GitHub & Vercel

## 📋 Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [GitHub Setup](#github-setup)
- [Database Setup (Neon PostgreSQL)](#database-setup)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Deployment Checklist

### Backend Verification
- [x] All TypeScript compiles without errors
- [x] Gemini AI service configured
- [x] Database schema up to date (Prisma)
- [x] Environment variables documented
- [x] Security middleware enabled
- [x] API routes tested
- [x] File upload configured

### Frontend Verification
- [x] All components render without errors
- [x] Routing configured correctly
- [x] API proxy configured in vite.config.ts
- [x] Authentication flow working
- [x] Responsive design verified

### Features Implemented
- [x] AI-powered candidate ranking (Gemini AI)
- [x] Resume upload with drag-drop
- [x] Multi-level tie-breaking algorithm
- [x] Overqualification detection
- [x] Job search and filtering
- [x] Application status tracking
- [x] Recruiter dashboard
- [x] Job post deletion

---

## 📦 GitHub Setup

### 1. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: AI Hiring Platform with Gemini AI"

# Create GitHub repository (via GitHub website)
# Then connect local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/ai-hiring-platform.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Repository Settings
- Add repository description: "AI-powered hiring platform with smart candidate ranking using Google Gemini AI"
- Add topics: `ai`, `hiring`, `recruitment`, `gemini-ai`, `nodejs`, `react`, `typescript`, `prisma`
- Update README.md with project details

---

## 🗄️ Database Setup (Neon PostgreSQL)

### 1. Create Neon Account and Database
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create new project: "ai-hiring-platform"
4. Copy the PostgreSQL connection string

### 2. Update DATABASE_URL
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

### 3. Run Migrations
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

---

## 🌐 Vercel Deployment

### Option A: Deploy via Vercel CLI

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# From project root
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: ai-hiring-platform
# - Directory: ./
# - Override settings? No
```

#### 4. Set Environment Variables
```bash
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add GEMINI_API_KEY
vercel env add FRONTEND_URL
```

#### 5. Deploy to Production
```bash
vercel --prod
```

---

### Option B: Deploy via Vercel Dashboard

#### 1. Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select "ai-hiring-platform"

#### 2. Configure Build Settings

**Root Directory:** `.` (leave empty)

**Framework Preset:** Other

**Build Command:**
```bash
cd frontend && npm install && npm run build && cd ../backend && npm install && npm run build
```

**Output Directory:** `frontend/dist`

**Install Command:**
```bash
npm install
```

#### 3. Add Environment Variables

Go to Project Settings → Environment Variables and add:

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Google Gemini AI
GEMINI_API_KEY=AIzaSyAUxabBWe5MZsJFTrCQzMFMsogfabRjVNE

# Server
PORT=5000
NODE_ENV=production

# Frontend URL (will be your Vercel URL)
FRONTEND_URL=https://your-app.vercel.app

# Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

#### 4. Deploy
Click "Deploy" button

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Google Gemini AI (Production Key)
GEMINI_API_KEY="your-gemini-api-key"

# Server
PORT=5000
NODE_ENV="production"
FRONTEND_URL="https://your-vercel-app.vercel.app"

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### Security Notes
- ❌ Never commit .env files to GitHub
- ✅ Use strong JWT_SECRET (min 32 characters)
- ✅ Rotate API keys regularly
- ✅ Use environment-specific keys (dev vs prod)

---

## ✅ Post-Deployment

### 1. Verify Deployment
```bash
# Check health endpoint
curl https://your-app.vercel.app/api/health

# Expected response:
{
  "status": "ok",
  "message": "AI Hiring Platform API is running",
  "timestamp": "2026-02-19T...",
  "environment": "production"
}
```

### 2. Test Key Features
- [ ] User Registration
- [ ] User Login
- [ ] Job Creation (Recruiter)
- [ ] Job Browsing (Candidate)
- [ ] Resume Upload
- [ ] Job Application
- [ ] AI Scoring
- [ ] Application Ranking
- [ ] Job Deletion

### 3. Monitor Logs
```bash
# Vercel logs
vercel logs

# Or via Vercel Dashboard:
# Project → Deployments → Select deployment → Logs
```

---

## 🔧 Troubleshooting

### Issue: Database Connection Failed
**Solution:**
- Verify DATABASE_URL is correct
- Check Neon database is active
- Ensure `?sslmode=require` is in connection string
- Run migrations: `npx prisma migrate deploy`

### Issue: API Routes Return 404
**Solution:**
- Verify vercel.json routing configuration
- Check backend is built: `cd backend && npm run build`
- Ensure environment variables are set in Vercel

### Issue: Gemini API Key Invalid
**Solution:**
- Verify GEMINI_API_KEY in Vercel environment variables
- Test key with: `curl https://generativelanguage.googleapis.com/v1/models?key=YOUR_KEY`
- Generate new key at: https://makersuite.google.com/app/apikey

### Issue: Resume Upload Fails
**Solution:**
- Vercel has limitations on serverless file uploads
- Consider using cloud storage (AWS S3, Cloudinary)
- Or use Vercel Blob: https://vercel.com/docs/storage/vercel-blob

### Issue: Build Fails
**Solution:**
```bash
# Clean install locally
rm -rf node_modules package-lock.json
npm install

# Test build locally
cd frontend && npm run build
cd backend && npm run build

# Check TypeScript errors
npm run lint
```

---

## 📱 Alternative: Railway Deployment

If Vercel doesn't work, try Railway.app:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up

# Add environment variables via Railway dashboard
```

---

## 🎯 Production Checklist

Before going live:
- [ ] Enable HTTPS only
- [ ] Set up error monitoring (Sentry)
- [ ] Configure rate limiting
- [ ] Enable CORS for production domain only
- [ ] Set up database backups
- [ ] Add analytics (Google Analytics)
- [ ] Test on multiple devices
- [ ] Load testing completed
- [ ] Security audit performed
- [ ] Documentation updated

---

## 📞 Support

If issues persist:
1. Check Vercel deployment logs
2. Verify all environment variables
3. Test API endpoints individually
4. Review GitHub Actions (if configured)
5. Contact support: [email/discord/slack]

---

**Deployment Version:** 1.0.0  
**Last Updated:** February 19, 2026  
**Deployed Services:** Vercel (Frontend + Backend), Neon (Database)
