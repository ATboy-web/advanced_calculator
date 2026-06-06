@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   Advanced Calculator - Flutter Build
echo   Windows / Web / Android
echo ============================================
echo.
cd /d "%~dp0"
echo Starting build script...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0flutter_setup.ps1"
pause
