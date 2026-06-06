@echo off
echo ========================================
echo    Building Advanced Calculator for Windows
echo ========================================
echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found.
echo.

echo Checking if electron is installed...
if not exist "node_modules\electron" (
    echo WARNING: electron module not found!
    echo Please run fix-electron.bat first to install electron.
    echo.
    choice /C YN /M "Run fix-electron.bat now?"
    if errorlevel 2 goto :end
    call fix-electron.bat
)

echo.
echo Building Windows executable...
call npm run build:win
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Build completed successfully!
echo ========================================
echo.
echo Executable file is located at:
echo dist\高级计算器 Setup.exe
echo.
echo You can now distribute this file to users.
echo.
:end
pause