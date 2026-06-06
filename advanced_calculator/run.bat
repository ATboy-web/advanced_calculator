@echo off
echo ========================================
echo    高级计算器 - Flutter 项目启动器
echo ========================================
echo.

set PATH=C:\flutter\bin;%PATH%
cd /d "%~dp0"

echo [1/3] 检查 Flutter 环境...
flutter --version
if errorlevel 1 (
    echo Flutter 未安装或配置错误！
    pause
    exit /b 1
)

echo.
echo [2/3] 安装项目依赖...
flutter pub get
if errorlevel 1 (
    echo 依赖安装失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 启动应用...
echo 选择运行平台:
echo   1. Chrome (Web)
echo   2. Windows (桌面)
echo   3. Edge (Web)
echo.
set /p choice=请输入选项 (1-3): 

if "%choice%"=="1" (
    echo 正在启动 Chrome...
    flutter run -d chrome
) else if "%choice%"=="2" (
    echo 正在启动 Windows 桌面应用...
    flutter run -d windows
) else if "%choice%"=="3" (
    echo 正在启动 Edge...
    flutter run -d edge
) else (
    echo 无效选项，默认启动 Chrome...
    flutter run -d chrome
)

pause