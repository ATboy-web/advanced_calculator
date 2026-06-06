@echo off
chcp 65001 >nul 2>&1
echo ==========================================
echo  打包 Android APK - 高级计算器
echo ==========================================
echo.

set "FLUTTER=C:\flutter\bin\flutter.bat"
set "PROJECT_DIR=%~dp0advanced_calculator"

if not exist "%FLUTTER%" (
    echo 错误: 未找到 Flutter SDK
    echo 请确认 C:\flutter\bin\flutter.bat 存在
    pause
    exit /b 1
)

cd /d "%PROJECT_DIR%"

echo [1/4] 检查 Flutter 版本...
call "%FLUTTER%" --version
echo.

echo [2/4] 生成 Android 平台目录...
if not exist "android" (
    call "%FLUTTER%" create --platforms android --org com.advanced --project-name advanced_calculator .
    if errorlevel 1 (
        echo 生成 Android 目录失败！
        pause
        exit /b 1
    )
) else (
    echo Android 目录已存在
)
echo.

echo [3/4] 获取依赖...
call "%FLUTTER%" pub get
if errorlevel 1 (
    echo 获取依赖失败！
    pause
    exit /b 1
)
echo.

echo [4/4] 构建 APK（Release 模式）...
echo 这可能需要几分钟，请耐心等待...
call "%FLUTTER%" build apk --release
if errorlevel 1 (
    echo APK 构建失败！
    echo.
    echo 可能原因:
    echo 1. 未安装 Android SDK / Android Studio
    echo 2. 未接受 Android 许可证: flutter doctor --android-licenses
    echo 3. 请运行 flutter doctor 检查环境
    pause
    exit /b 1
)

echo.
echo ==========================================
echo  APK 打包完成!
echo ==========================================
echo.
echo APK 文件位置:
echo   %PROJECT_DIR%\build\app\outputs\flutter-apk\app-release.apk
echo.
echo 文件大小:
for %%F in ("%PROJECT_DIR%\build\app\outputs\flutter-apk\app-release.apk") do echo   %%~zF bytes
echo.
echo 可以将此 APK 文件传到 Android 手机上安装使用。
echo.
pause
