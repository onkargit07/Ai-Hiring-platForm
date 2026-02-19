# 🔧 Environment Setup Guide

## Quick Setup for Development

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or Neon)
- Google Gemini API key

---

## 🚀 Quick Start (5 Minutes)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-hiring-platform.git
cd ai-hiring-platform
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL (your PostgreSQL connection)
# - JWT_SECRET (any random string, min 32 chars)
# - GEMINI_API_KEY (from https://makersuite.google.com/app/apikey)
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npm run seed
```

### 4. Start Backend
```bash
npm run dev
# Backend running on http://localhost:5000
```

### 5. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
# Frontend running on http://localhost:3000
```

### 6. Test Application
- Open http://localhost:3000
- Register as recruiter or candidate
- Test job posting and applications

---

## 🔑 Required Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ai_hiring?schema=public"
JWT_SECRET="your-secret-key-minimum-32-characters-long"
GEMINI_API_KEY="AIzaSy..."  # Get from Google AI Studio
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

### Get Gemini API Key
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy and paste into .env

---

## 🗄️ Database Options

### Option A: Local PostgreSQL
```bash
# Install PostgreSQL
# macOS: brew install postgresql
# Windows: Download from postgresql.org
# Linux: sudo apt install postgresql

# Start PostgreSQL
# macOS: brew services start postgresql
# Windows: Start from Services
# Linux: sudo service postgresql start

# Create database
createdb ai_hiring_platform

# Connection string
DATABASE_URL="postgresql://localhost:5432/ai_hiring_platform?schema=public"
```

### Option B: Neon (Cloud PostgreSQL - Recommended)
1. Go to https://neon.tech
2. Sign up for free
3. Create new project
4. Copy connection string
5. Paste into .env

---

## ✅ Verification

### Test Backend
```bash
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"AI Hiring Platform API is running"}
```

### Test Frontend
Open http://localhost:3000 - should see landing page

### Test AI Ranking
```bash
cd backend
ts-node scripts/test-ranking.ts
# Should show AI analysis results
```

---

## 🐛 Common Issues

### Issue: "Cannot find module '@prisma/client'"
```bash
cd backend
npx prisma generate
```

### Issue: "GEMINI_API_KEY is not defined"
- Check .env file exists in backend/
- Verify GEMINI_API_KEY is set
- Restart backend server

### Issue: "Database connection failed"
- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Try `npx prisma studio` to test connection

### Issue: Port already in use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in .env
```

---

## 📦 Package Manager

This project uses **npm**. If you prefer yarn/pnpm:
```bash
# Delete package-lock.json and node_modules first
rm -rf package-lock.json node_modules
yarn install  # or pnpm install
```

---

## 🔄 Development Workflow

1. Make changes to code
2. Backend auto-reloads (nodemon)
3. Frontend auto-reloads (Vite HMR)
4. Test in browser
5. Commit changes

---

**Setup Time:** ~5 minutes  
**Last Updated:** February 19, 2026
