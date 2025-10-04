@echo off
echo Starting Expense Management System...
echo.

echo Installing dependencies...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
)

cd ..\frontend\astro-expense-hub\astro-expense-hub
if not exist node_modules (
    echo Installing frontend dependencies...
    npm install
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd ..\..\..\backend && npm start"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo Test Page: http://localhost:5173/test
echo.
echo Press any key to exit...
pause > nul
