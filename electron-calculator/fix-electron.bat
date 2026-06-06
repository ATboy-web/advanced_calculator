@echo off
echo ==========================================
echo  Fixing Electron Installation
echo ==========================================
cd /d "%~dp0"

echo.
echo [1/3] Checking Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Node.js not found in PATH!
    echo.
    echo Please do the following:
    echo 1. Make sure Node.js is installed (download from https://nodejs.org/)
    echo 2. Add Node.js to your system PATH:
    echo    - Right-click "This PC" -^> Properties -^> Advanced system settings
    echo    - Click "Environment Variables"
    echo    - Under "System variables", find "Path" and click "Edit"
    echo    - Add: C:\Program Files\nodejs\
    echo    - Click OK and restart this script
    echo.
    echo Or try running this script from a new command prompt window.
    echo.
    pause
    exit /b 1
)
node --version
echo.

echo [2/3] Removing old electron module...
if exist "node_modules\electron" rmdir /s /q "node_modules\electron"
echo Done.
echo.

echo [3/3] Reinstalling electron with Chinese mirror...
echo This may take a few minutes, please wait...

set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

call npm install electron --save-dev
if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed!
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Try running as administrator
    echo 3. Try: npm config set registry https://registry.npmmirror.com
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Done! Now run: run.bat
echo ==========================================
pause
