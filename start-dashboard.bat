@echo off
echo ===================================================
echo    Ad Analytics Dashboard Launcher
echo ===================================================
echo.

echo Starting Next.js development server...
echo To stop, press Ctrl+C
echo ===================================================

:: First, try opening the browser
start http://localhost:3000

:: Then run the development server
npm run dev

:: This line will only be reached if the server stops
echo.
echo Server has stopped. Press any key to exit.
pause > nul 