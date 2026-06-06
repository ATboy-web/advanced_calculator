@echo off
echo === Advanced Calculator - WPF ===
echo.
echo Checking .NET SDK...
dotnet --version
echo.
echo Building and running...
cd /d "%~dp0"
dotnet run
pause
