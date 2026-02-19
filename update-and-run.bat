@echo off
echo ========================================
echo  UPDATING AI RANKING SYSTEM
echo  Adding Overqualification Detection
echo ========================================
echo.

echo [1/4] Updating Database Schema...
cd backend
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Database push failed!
    pause
    exit /b 1
)
echo.

echo [2/4] Regenerating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo.

echo [3/4] Stopping any running servers...
taskkill /F /IM node.exe 2>nul
echo.

echo [4/4] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  DATABASE UPDATED SUCCESSFULLY!
echo ========================================
echo.
echo Next Steps:
echo 1. Backend server is starting...
echo 2. Open a new terminal and run: cd frontend ^&^& npm run dev
echo 3. Test the system at http://localhost:3000
echo.
echo New Features:
echo  - Real-time ranking (updates on page refresh)
echo  - 4-level tie-breaking system
echo  - Overqualification detection and penalty
echo  - Fair ranking for entry-level positions
echo.
pause
