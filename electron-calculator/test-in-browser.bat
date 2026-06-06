@echo off
chcp 65001 >nul 2>&1
echo ==========================================
echo  在浏览器中测试计算器
echo ==========================================
echo.
echo 即将在浏览器中打开计算器...
echo 如果没有自动打开，请手动打开 index.html 文件
echo.

cd /d "%~dp0"

REM 尝试使用默认浏览器打开
start "" "%~dp0index.html"

echo 提示:
echo - 这是纯浏览器版本，所有功能都可正常使用
echo - 如需完整 Electron 桌面版，请运行 install-electron.bat
echo.
pause
