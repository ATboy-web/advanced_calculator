@echo off
echo Starting Advanced Calculator...
echo.
echo Open in browser: http://localhost:8080
echo.
echo Press Ctrl+C to stop server
echo.
cd /d "%~dp0"
python -m http.server 8080
pause