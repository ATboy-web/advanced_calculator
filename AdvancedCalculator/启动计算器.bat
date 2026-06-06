@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   高级计算器 - 三端构建 (Windows/Web/Android)
echo ============================================
echo.
echo 正在启动构建脚本...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0flutter_setup.ps1"
pause
