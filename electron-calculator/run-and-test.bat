@echo off
echo Starting Advanced Calculator with all features...
echo.
echo Features:
echo 1. Basic/Scientific Calculator
echo 2. Function Graphing
echo 3. Equation Solver
echo 4. Matrix Calculator
echo 5. Geometry Tools
echo 6. 3D Calculator
echo 7. Fun Calculators (Relative, Loan, Interest, Currency, BMI, Tax, etc.)
echo 8. Unit Converter
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
    goto :end
)

echo Starting application...
call npm start
:end
pause