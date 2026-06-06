@echo off
echo ========================================
echo    Advanced Calculator - Local Server
echo ========================================
echo.
echo Starting local server...
echo.
echo Please open browser and visit:
echo http://localhost:8080
echo.
echo Press Ctrl+C to stop server
echo ========================================
echo.
cd /d "%~dp0"
python -m http.server 8080
pause