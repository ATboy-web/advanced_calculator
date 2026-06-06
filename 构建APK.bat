@echo off
chcp 65001 >nul 2>&1
echo ==========================================
echo  构建 Android APK - 高级计算器
echo ==========================================
echo.

set "PROJECT_DIR=%~dp0android-apk"
set "JAVA_HOME="
set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"

REM 查找 Java
for /d %%i in ("C:\Program Files\Java\jdk-*") do set "JAVA_HOME=%%i"
for /d %%i in ("C:\Program Files\Java\jre-*") do set "JAVA_HOME=%%i"
for /d %%i in ("C:\Program Files\Microsoft\jdk-*") do set "JAVA_HOME=%%i"
if exist "%JAVA_HOME%\bin\java.exe" goto :found_java

REM 尝试 Android Studio 自带的 JBR
for /d %%i in ("C:\Program Files\Android\Android Studio\jbr") do set "JAVA_HOME=%%i"
for /d %%i in ("%LOCALAPPDATA%\Programs\Android Studio\jbr") do set "JAVA_HOME=%%i"
if exist "%JAVA_HOME%\bin\java.exe" goto :found_java

echo 错误: 未找到 Java/JDK
echo 请安装 JDK 17: https://adoptium.net/
pause
exit /b 1

:found_java
echo 找到 Java: %JAVA_HOME%
"%JAVA_HOME%\bin\java.exe" -version
echo.

cd /d "%PROJECT_DIR%"

REM 下载 gradle-wrapper.jar
if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo 下载 Gradle Wrapper...
    powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/gradle/gradle/v8.4.0/gradle/wrapper/gradle-wrapper.jar' -OutFile 'gradle\wrapper\gradle-wrapper.jar'"
    if not exist "gradle\wrapper\gradle-wrapper.jar" (
        echo 备用下载...
        powershell -Command "Invoke-WebRequest -Uri 'https://github.com/nicjansma/gradle-wrapper/raw/master/gradle/wrapper/gradle-wrapper.jar' -OutFile 'gradle\wrapper\gradle-wrapper.jar'"
    )
)

if not exist "gradle\wrapper\gradle-wrapper.jar" (
    echo 无法下载 gradle-wrapper.jar
    echo 请手动从 https://gradle.org/releases/ 下载
    pause
    exit /b 1
)

echo.
echo 开始构建 APK...
echo 首次构建需要下载 Gradle 和依赖，请耐心等待...
echo.

set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"

call gradlew.bat assembleRelease --no-daemon --stacktrace
if errorlevel 1 (
    echo.
    echo 构建失败，尝试 Debug 模式...
    call gradlew.bat assembleDebug --no-daemon --stacktrace
    if errorlevel 1 (
        echo 构建失败！
        pause
        exit /b 1
    )
    set "APK_PATH=app\build\outputs\apk\debug\app-debug.apk"
    set "APK_TYPE=Debug"
) else (
    set "APK_PATH=app\build\outputs\apk\release\app-release-unsigned.apk"
    set "APK_TYPE=Release (未签名)"
)

echo.
echo ==========================================
echo  APK 构建完成!
echo ==========================================
echo.
echo 类型: %APK_TYPE%
echo 文件: %PROJECT_DIR%\%APK_PATH%
echo.
echo 注意: Release 版本需要签名才能安装到手机
echo Debug 版本可以直接安装（需开启USB调试）
echo.
pause
