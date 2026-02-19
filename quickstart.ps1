# Quick Start Script - AI Hiring Platform

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🚀 AI Hiring Platform - Quick Start" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Function to check if PostgreSQL is running
function Test-PostgreSQL {
    try {
        $env:PGPASSWORD = "postgres"
        $result = psql -U postgres -h localhost -c "SELECT 1;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
    }
    catch {}
    return $false
}

# Check if dependencies are installed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow

if (!(Test-Path "backend\node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
}

if (!(Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
}

Write-Host "✅ Dependencies installed`n" -ForegroundColor Green

# Check PostgreSQL
Write-Host "🔍 Checking PostgreSQL connection..." -ForegroundColor Yellow

$dbPassword = "postgres"
$dbUrl = "postgresql://postgres:${dbPassword}@localhost:5432/ai_hiring_platform?schema=public"

# Try to connect
$psqlAvailable = Test-PostgreSQL

if (!$psqlAvailable) {
    Write-Host "⚠️  Cannot connect to PostgreSQL" -ForegroundColor Yellow
    Write-Host "`nPlease ensure:" -ForegroundColor White
    Write-Host "1. PostgreSQL is installed and running" -ForegroundColor White
    Write-Host "2. Username: postgres" -ForegroundColor White
    Write-Host "3. Password: postgres (or update backend\.env)" -ForegroundColor White
    Write-Host "`nOpen pgAdmin and verify your connection settings`n" -ForegroundColor White
    
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne 'y') {
        exit
    }
}
else {
    Write-Host "✅ PostgreSQL connected`n" -ForegroundColor Green
    
    # Create database if it doesn't exist
    Write-Host "📊 Setting up database..." -ForegroundColor Yellow
    $env:PGPASSWORD = $dbPassword
    $dbExists = psql -U postgres -h localhost -lqt 2>&1 | Select-String -Pattern "ai_hiring_platform"
    
    if (!$dbExists) {
        Write-Host "Creating database..." -ForegroundColor Yellow
        psql -U postgres -h localhost -c "CREATE DATABASE ai_hiring_platform;" 2>&1 | Out-Null
    }
    
    # Run migrations
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    cd backend
    npm run prisma:generate | Out-Null
    $migrationResult = npm run prisma:migrate 2>&1
    cd ..
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database ready`n" -ForegroundColor Green
        
        # Ask about sample data
        $seedData = Read-Host "Would you like to add sample data? (y/n)"
        if ($seedData -eq 'y') {
            Write-Host "Adding sample data..." -ForegroundColor Yellow
            cd backend
            npm run seed
            cd ..
            Write-Host "✅ Sample data added`n" -ForegroundColor Green
        }
    }
    else {
        Write-Host "⚠️  Database migration failed" -ForegroundColor Yellow
        Write-Host "Check your database credentials in backend\.env`n" -ForegroundColor Yellow
    }
}

# Check .env configuration
Write-Host "⚙️  Configuration check..." -ForegroundColor Yellow
$envContent = Get-Content "backend\.env" -Raw

if ($envContent -match 'OPENAI_API_KEY="your-openai-api-key"' -or $envContent -match 'OPENAI_API_KEY=""') {
    Write-Host "⚠️  OpenAI API key not configured (AI scoring will use fallback algorithm)" -ForegroundColor Yellow
}
else {
    Write-Host "✅ OpenAI API configured" -ForegroundColor Green
}

if ($envContent -match '#\s*SMTP' -or $envContent -notmatch 'SMTP_HOST=') {
    Write-Host "⚠️  Email notifications not configured (optional)" -ForegroundColor Yellow
}
else {
    Write-Host "✅ Email notifications configured" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "To start the application:`n" -ForegroundColor White
Write-Host "1. Start Backend:" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor White

Write-Host "2. Start Frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor White

Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   API Docs: http://localhost:5000/api-docs" -ForegroundColor Cyan
Write-Host "   DB Admin: npm run prisma:studio (in backend folder)`n" -ForegroundColor Cyan

Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "   • README.md - Overview" -ForegroundColor White
Write-Host "   • PRODUCTION_GUIDE.md - Professional features & deployment" -ForegroundColor White
Write-Host "   • QUICKSTART.md - Getting started guide`n" -ForegroundColor White

$startNow = Read-Host "Would you like to start the servers now? (y/n)"

if ($startNow -eq 'y') {
    Write-Host "`nStarting servers...`n" -ForegroundColor Green
    
    # Start backend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host 'Starting Backend Server...' -ForegroundColor Cyan; npm run dev"
    
    Start-Sleep -Seconds 3
    
    # Start frontend
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Starting Frontend Server...' -ForegroundColor Cyan; npm run dev"
    
    Write-Host "✅ Servers starting in new terminal windows`n" -ForegroundColor Green
    Write-Host "Wait a few seconds, then open http://localhost:5173`n" -ForegroundColor Cyan
}
else {
    Write-Host "`nRun the servers manually when ready.`n" -ForegroundColor White
}

Write-Host "Happy coding! 🚀`n" -ForegroundColor Green
