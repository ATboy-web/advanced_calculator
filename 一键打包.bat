@echo off
chcp 65001 >nul 2>&1
echo ==========================================
echo  一键打包 - 高级计算器
echo ==========================================
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

echo [1/5] 检查 Node.js...
node --version
if errorlevel 1 (
    echo 错误: Node.js 未安装
    pause
    exit /b 1
)

echo.
echo [2/5] 检查 Flutter...
where flutter >nul 2>&1
if errorlevel 1 (
    echo 警告: Flutter 未安装，将跳过 APK 打包
    echo 请从 https://flutter.dev/ 安装 Flutter SDK
    set "SKIP_FLUTTER=1"
) else (
    echo Flutter 已找到
    flutter --version
    set "SKIP_FLUTTER=0"
)

echo.
echo ==========================================
echo  第一部分: 打包 Electron Windows 应用程序
echo ==========================================
echo.

cd /d "%~dp0electron-calculator"

echo [3/5] 安装 Electron 依赖...
if not exist "node_modules\electron" (
    echo 首次安装 Electron，可能需要几分钟...
    set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
    set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
    call npm install
    if errorlevel 1 (
        echo npm install 失败，尝试使用 cnpm...
        call npm install -g cnpm --registry=https://registry.npmmirror.com
        call cnpm install
    )
) else (
    echo Electron 已安装
)

echo.
echo [4/5] 构建 Windows 可执行文件...
echo 这可能需要几分钟，请耐心等待...
call npm run build:win
if errorlevel 1 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  Windows 应用程序打包完成!
echo ==========================================
echo.
echo 可执行文件位置:
echo   electron-calculator\dist\高级计算器 Setup.exe
echo.

if "%SKIP_FLUTTER%"=="1" goto :skip_flutter

echo.
echo ==========================================
echo  第二部分: 打包 Flutter APK
echo ==========================================
echo.

cd /d "%~dp0advanced_calculator"

echo [5/5] 构建 Android APK...
echo 检查 Flutter 项目结构...
if not exist "android" (
    echo 生成 Android 平台目录...
    call flutter create --platforms android,ios .
    if errorlevel 1 (
        echo 生成平台目录失败！
        pause
        exit /b 1
    )
)

echo 获取依赖...
call flutter pub get
if errorlevel 1 (
    echo 获取依赖失败！
    pause
    exit /b 1
)

echo 构建 APK...
call flutter build apk --release
if errorlevel 1 (
    echo APK 构建失败！
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  APK 打包完成!
echo ==========================================
echo.
echo APK 文件位置:
echo   advanced_calculator\build\app\outputs\flutter-apk\app-release.apk
echo.

:skip_flutter

echo.
echo ==========================================
echo  打包全部完成!
echo ==========================================
echo.
echo Windows 应用程序: electron-calculator\dist\高级计算器 Setup.exe
if not "%SKIP_FLUTTER%"=="1" (
    echo Android APK: advanced_calculator\build\app\outputs\flutter-apk\app-release.apk
)
echo.
echo 提示:
echo - Windows 程序可以直接运行安装
echo - APK 文件可以传到手机上安装
echo.
pause
