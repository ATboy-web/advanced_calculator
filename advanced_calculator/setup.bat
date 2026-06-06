@echo off
set PUB_HOSTED_URL=https://pub.flutter-io.cn
set FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
echo Running flutter pub get with Chinese mirrors...
C:\flutter\bin\flutter.bat pub get
echo.
echo Done! Exit code: %ERRORLEVEL%
pause