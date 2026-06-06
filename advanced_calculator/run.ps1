# 高级计算器 - Flutter 项目启动脚本
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    高级计算器 - Flutter 项目启动器" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 设置环境变量
$env:Path = "C:\flutter\bin;" + $env:Path

# 切换到项目目录
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "[1/3] 检查 Flutter 环境..." -ForegroundColor Yellow
try {
    $flutterVersion = & flutter --version 2>&1 | Select-Object -First 1
    Write-Host "  $flutterVersion" -ForegroundColor Green
} catch {
    Write-Host "  Flutter 未安装或配置错误！" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""
Write-Host "[2/3] 安装项目依赖..." -ForegroundColor Yellow
& flutter pub get
if ($LASTEXITCODE -ne 0) {
    Write-Host "  依赖安装失败！" -ForegroundColor Red
    Read-Host "按 Enter 键退出"
    exit 1
}

Write-Host ""
Write-Host "[3/3] 启动应用..." -ForegroundColor Yellow
Write-Host "选择运行平台:" -ForegroundColor Cyan
Write-Host "  1. Chrome (Web)" -ForegroundColor White
Write-Host "  2. Windows (桌面)" -ForegroundColor White
Write-Host "  3. Edge (Web)" -ForegroundColor White
Write-Host ""
$choice = Read-Host "请输入选项 (1-3)"

switch ($choice) {
    "1" {
        Write-Host "正在启动 Chrome..." -ForegroundColor Green
        & flutter run -d chrome
    }
    "2" {
        Write-Host "正在启动 Windows 桌面应用..." -ForegroundColor Green
        & flutter run -d windows
    }
    "3" {
        Write-Host "正在启动 Edge..." -ForegroundColor Green
        & flutter run -d edge
    }
    default {
        Write-Host "无效选项，默认启动 Chrome..." -ForegroundColor Yellow
        & flutter run -d chrome
    }
}

Read-Host "按 Enter 键退出"