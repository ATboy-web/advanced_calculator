# Advanced Calculator - 自动安装和编译脚本
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  高级计算器 - 自动安装编译脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 .NET SDK
Write-Host "[1/4] 检查 .NET SDK..." -ForegroundColor Yellow
$dotnetInstalled = $false
try {
    $version = & dotnet --version 2>&1
    if ($version -match "(\d+\.\d+\.\d+)") {
        Write-Host "  已安装 .NET SDK: $version" -ForegroundColor Green
        $dotnetInstalled = $true
    }
} catch {}

if (-not $dotnetInstalled) {
    Write-Host "  未检测到 .NET SDK，正在下载安装..." -ForegroundColor Yellow
    
    # 下载 .NET 8 SDK
    $dotnetUrl = "https://download.visualstudio.microsoft.com/download/pr/2e3a7e4e-3a3e-4a3e-8a3e-1a3e3a3e3a3e/dotnet-sdk-8.0.404-win-x64.exe"
    $installerPath = "$env:TEMP\dotnet-sdk-8.0-win-x64.exe"
    
    # 使用官方安装脚本
    Write-Host "  正在通过官方脚本安装 .NET 8 SDK..." -ForegroundColor Yellow
    try {
        Invoke-WebRequest -Uri "https://dot.net/v1/dotnet-install.ps1" -OutFile "$env:TEMP\dotnet-install.ps1"
        & "$env:TEMP\dotnet-install.ps1" -Channel 8.0 -InstallDir "C:\dotnet"
        $env:PATH = "C:\dotnet;$env:PATH"
        [Environment]::SetEnvironmentVariable("PATH", "C:\dotnet;" + [Environment]::GetEnvironmentVariable("PATH", "User"), "User")
        Write-Host "  .NET SDK 安装完成!" -ForegroundColor Green
        $dotnetInstalled = $true
    } catch {
        Write-Host "  自动安装失败，请手动安装 .NET 8 SDK" -ForegroundColor Red
        Write-Host "  下载地址: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "  安装完成后重新运行此脚本" -ForegroundColor Yellow
        Read-Host "按回车键退出"
        exit 1
    }
}

Write-Host ""
Write-Host "[2/4] 还原依赖包..." -ForegroundColor Yellow
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir
& dotnet restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "  依赖还原失败!" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  依赖还原完成!" -ForegroundColor Green

Write-Host ""
Write-Host "[3/4] 编译项目..." -ForegroundColor Yellow
& dotnet build -c Release --no-restore
if ($LASTEXITCODE -ne 0) {
    Write-Host "  编译失败!" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}
Write-Host "  编译成功!" -ForegroundColor Green

Write-Host ""
Write-Host "[4/4] 启动应用程序..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 运行应用
& dotnet run -c Release --no-build
