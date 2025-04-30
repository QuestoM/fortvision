@echo off
title Ad Analytics Dashboard
color 0A
cls

echo ===================================================
echo    Ad Analytics Dashboard Launcher
echo ===================================================
echo.

:: Check if port 3000 is already in use
netstat -an | find ":3000" | find "LISTENING" > nul
if %ERRORLEVEL% EQU 0 (
    echo Port 3000 is already in use.
    echo This may be another instance of the dashboard or a different application.
    echo.
    set /p KILL_PORT="Do you want to free port 3000? (y/n): "
    if /i "%KILL_PORT%" EQU "y" (
        for /f "tokens=5" %%a in ('netstat -ano ^| find ":3000" ^| find "LISTENING"') do (
            echo Terminating process with PID: %%a
            taskkill /F /PID %%a
        )
    ) else (
        echo Cannot start server while port 3000 is in use.
        pause
        exit /b 1
    )
)

:: First, try opening the browser (with slight delay to ensure server starts first)
start cmd /c "timeout /t 3 > nul && start http://localhost:3000"

:: Then run the development server
echo Starting Next.js development server...
echo Server logs will appear below. To stop, press Ctrl+C
echo ===================================================
echo.

npm run dev

:: This line will only be reached if the server stops
echo.
echo Server has stopped. Press any key to exit.
pause > nul 