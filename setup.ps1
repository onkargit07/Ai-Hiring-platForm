# AI Hiring Platform - Automated Setup Script
# Run this script from the project root: .\setup.ps1

Write-Host "🚀 AI Hiring Platform - Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js v18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing Backend Dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "⚙️  Setting up environment files..." -ForegroundColor Yellow
Set-Location ../backend
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✅ Created .env file from .env.example" -ForegroundColor Green
    Write-Host "⚠️  Please edit backend/.env with your database and API keys" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Edit backend/.env with your configuration:" -ForegroundColor White
Write-Host "   - DATABASE_URL (PostgreSQL connection)" -ForegroundColor Gray
Write-Host "   - JWT_SECRET (random secret key)" -ForegroundColor Gray
Write-Host "   - OPENAI_API_KEY (from OpenAI platform)" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Setup database:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run prisma:generate" -ForegroundColor Gray
Write-Host "   npm run prisma:migrate" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start the application:" -ForegroundColor White
Write-Host "   Backend:  cd backend && npm run dev" -ForegroundColor Gray
Write-Host "   Frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed instructions, see QUICKSTART.md" -ForegroundColor Cyan
Write-Host ""

Set-Location ..
