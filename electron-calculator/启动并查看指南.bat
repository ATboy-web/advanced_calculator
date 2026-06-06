@echo off
echo Opening User Guide and Starting Calculator...
echo.
start "" "%~dp0使用指南.txt"
timeout /t 2 /nobreak >nul
call "%~dp0run.bat"