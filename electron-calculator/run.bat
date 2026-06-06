@echo off
chcp 65001 >nul 2>&1
echo 启动高级计算器...
echo.
cd /d "%~dp0"

echo [1/3] 检查 Node.js...
set "NODE_CMD=node"

where node >nul 2>&1
if %errorlevel% neq 0 (
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_CMD=C:\Program Files\nodejs\node.exe"
        set "PATH=C:\Program Files\nodejs;%PATH%"
    ) else if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
        set "NODE_CMD=%LOCALAPPDATA%\Programs\nodejs\node.exe"
        set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
    ) else (
        echo 错误: 未找到 Node.js
        echo 请先安装 Node.js: https://nodejs.org/
        pause
        exit /b 1
    )
)
%NODE_CMD% --version
echo.

echo [2/3] 检查 Electron...
if not exist "node_modules\electron" (
    echo 警告: Electron 未安装！
    echo.
    choice /C YN /M "是否立即安装 Electron？"
    if errorlevel 2 goto :end
    call install-electron.bat
    if not exist "node_modules\electron" (
        echo 安装未完成，请手动运行 install-electron.bat
        pause
        exit /b 1
    )
)
echo Electron 已就绪。
echo.

echo [3/3] 启动应用程序...
call npx electron .
if %errorlevel% neq 0 (
    echo.
    echo 启动失败，尝试使用 npm start...
    call npm start
)

:end
pause
