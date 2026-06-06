@echo off
chcp 65001 >nul 2>&1
echo ==========================================
echo  安装 Electron - 高级计算器
echo ==========================================
cd /d "%~dp0"

echo.
echo [1/4] 检查 Node.js 安装...
set "NODE_PATH="

REM 尝试多种方式找到 Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    set "NODE_CMD=node"
    goto :found_node
)

REM 检查常见安装路径
if exist "C:\Program Files\nodejs\node.exe" (
    set "NODE_CMD=C:\Program Files\nodejs\node.exe"
    set "PATH=C:\Program Files\nodejs;%PATH%"
    goto :found_node
)

if exist "C:\Program Files (x86)\nodejs\node.exe" (
    set "NODE_CMD=C:\Program Files (x86)\nodejs\node.exe"
    set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
    goto :found_node
)

REM 检查用户目录
if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" (
    set "NODE_CMD=%LOCALAPPDATA%\Programs\nodejs\node.exe"
    set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"
    goto :found_node
)

echo.
echo 错误: 未找到 Node.js！
echo.
echo 请先安装 Node.js:
echo 1. 访问 https://nodejs.org/
echo 2. 下载 LTS 版本并安装
echo 3. 安装时勾选 "Add to PATH" 选项
echo 4. 安装完成后重新运行此脚本
echo.
pause
exit /b 1

:found_node
echo 找到 Node.js:
%NODE_CMD% --version
echo.

echo [2/4] 检查 npm...
set "NPM_CMD=npm"

where npm >nul 2>&1
if %errorlevel% neq 0 (
    REM 尝试从 Node.js 目录找 npm
    for %%i in ("%NODE_CMD%") do set "NODE_DIR=%%~dpi"
    if exist "%NODE_DIR%npm.cmd" (
        set "NPM_CMD=%NODE_DIR%npm.cmd"
    ) else if exist "%NODE_DIR%npm" (
        set "NPM_CMD=%NODE_DIR%npm"
    ) else (
        echo.
        echo 警告: npm 未找到，尝试使用 npx...
        set "NPM_CMD=%NODE_CMD% --run"
    )
)

echo 使用 npm: %NPM_CMD%
%NPM_CMD% --version
echo.

echo [3/4] 清理旧的 electron 模块...
if exist "node_modules\electron" (
    rmdir /s /q "node_modules\electron"
    echo 已清理。
) else (
    echo 无需清理。
)
echo.

echo [4/4] 安装 electron（使用国内镜像）...
echo 这可能需要几分钟，请耐心等待...
echo.

set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

call %NPM_CMD% install electron --save-dev
if %errorlevel% neq 0 (
    echo.
    echo ==========================================
    echo  安装失败！尝试备用方案...
    echo ==========================================
    echo.
    
    echo 尝试使用 cnpm...
    call %NPM_CMD% install -g cnpm --registry=https://registry.npmmirror.com
    if %errorlevel% equ 0 (
        call cnpm install electron --save-dev
    )
    
    if %errorlevel% neq 0 (
        echo.
        echo 尝试使用 yarn...
        call %NPM_CMD% install -g yarn
        if %errorlevel% equ 0 (
            call yarn add electron --dev
        )
    )
    
    if %errorlevel% neq 0 (
        echo.
        echo ==========================================
        echo  所有安装方式均失败
        echo ==========================================
        echo.
        echo 可能的解决方案:
        echo 1. 检查网络连接
        echo 2. 以管理员身份运行此脚本
        echo 3. 手动运行: npm config set registry https://registry.npmmirror.com
        echo 4. 然后运行: npm install electron --save-dev
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ==========================================
echo  安装完成！
echo ==========================================
echo.
echo 现在可以运行 run.bat 启动计算器了。
echo.
pause
