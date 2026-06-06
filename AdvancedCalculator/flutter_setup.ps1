# Flutter 高级计算器 - 完整安装构建脚本
$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  高级计算器 Flutter 版 - 三端构建脚本" -ForegroundColor Cyan
Write-Host "  支持: Windows桌面 / Web网页 / Android APK" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 设置中国镜像
$env:PUB_HOSTED_URL = "https://pub.flutter-io.cn"
$env:FLUTTER_STORAGE_BASE_URL = "https://storage.flutter-io.cn"
[Environment]::SetEnvironmentVariable("PUB_HOSTED_URL", "https://pub.flutter-io.cn", "User")
[Environment]::SetEnvironmentVariable("FLUTTER_STORAGE_BASE_URL", "https://storage.flutter-io.cn", "User")

# Step 1: 检查 Flutter
Write-Host "[1/6] 检查 Flutter SDK..." -ForegroundColor Yellow
$flutterInstalled = $false
try {
    $fv = & C:\flutter\bin\flutter.bat --version 2>&1 | Out-String
    if ($fv -match "Flutter (\d+\.\d+\.\d+)") {
        Write-Host "  Flutter SDK 已安装: $($Matches[1])" -ForegroundColor Green
        $flutterInstalled = $true
    }
} catch {}

if (-not $flutterInstalled) {
    Write-Host "  Flutter 未安装，正在下载..." -ForegroundColor Yellow
    $flutterZip = "$env:TEMP\flutter.zip"
    $flutterUrl = "https://storage.flutter-io.cn/flutter_infra_release/releases/stable/windows/flutter_windows_3.29.3-stable.zip"
    
    try {
        Invoke-WebRequest -Uri $flutterUrl -OutFile $flutterZip -UseBasicParsing
        Write-Host "  解压 Flutter SDK..." -ForegroundColor Yellow
        Expand-Archive -Path $flutterZip -DestinationPath "C:\" -Force
        Remove-Item $flutterZip -Force -ErrorAction SilentlyContinue
        
        # 添加到 PATH
        $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        if ($currentPath -notlike "*C:\flutter\bin*") {
            [Environment]::SetEnvironmentVariable("PATH", "C:\flutter\bin;$currentPath", "User")
            $env:PATH = "C:\flutter\bin;$env:PATH"
        }
        Write-Host "  Flutter SDK 安装完成!" -ForegroundColor Green
        $flutterInstalled = $true
    } catch {
        Write-Host "  下载失败，请手动安装 Flutter" -ForegroundColor Red
        Write-Host "  访问: https://flutter.cn/docs/get-started/install/windows" -ForegroundColor Cyan
        Read-Host "按回车退出"
        exit 1
    }
}

# Step 2: 创建项目目录
Write-Host ""
Write-Host "[2/6] 准备项目..." -ForegroundColor Yellow
$projectDir = "c:\Users\Administrator\CodeBuddy\20260605103648\advanced_calculator"
Set-Location $projectDir

# 删除旧的锁文件
Remove-Item "C:\flutter\bin\cache\flutter.bat.lock" -Force -ErrorAction SilentlyContinue

# Step 3: 获取依赖
Write-Host ""
Write-Host "[3/6] 下载依赖 (使用中国镜像)..." -ForegroundColor Yellow
Write-Host "  这可能需要几分钟，请耐心等待..." -ForegroundColor Gray

$maxRetries = 3
$retryCount = 0
$success = $false

while (-not $success -and $retryCount -lt $maxRetries) {
    $retryCount++
    if ($retryCount -gt 1) {
        Write-Host "  第 $retryCount 次尝试..." -ForegroundColor Yellow
        # 清理锁文件
        Remove-Item "C:\flutter\bin\cache\flutter.bat.lock" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 5
    }
    
    # 运行 flutter pub get，设置超时
    $proc = Start-Process -FilePath "C:\flutter\bin\flutter.bat" -ArgumentList "pub","get" `
        -WorkingDirectory $projectDir -NoNewWindow -PassThru -RedirectStandardOutput "$env:TEMP\flutter_pub_out.txt" `
        -RedirectStandardError "$env:TEMP\flutter_pub_err.txt"
    
    # 等待最多5分钟
    if ($proc.WaitForExit(300000)) {
        if ($proc.ExitCode -eq 0) {
            $success = $true
        } else {
            Write-Host "  flutter pub get 失败 (Exit: $($proc.ExitCode))" -ForegroundColor Red
            $err = Get-Content "$env:TEMP\flutter_pub_err.txt" -ErrorAction SilentlyContinue
            if ($err) { Write-Host "  错误: $err" -ForegroundColor Red }
        }
    } else {
        Write-Host "  超时，终止进程..." -ForegroundColor Red
        $proc.Kill()
    }
}

if (-not $success) {
    Write-Host ""
    Write-Host "  依赖下载失败。可能原因:" -ForegroundColor Red
    Write-Host "  1. 网络连接问题" -ForegroundColor Yellow
    Write-Host "  2. 防火墙阻止了连接" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  请尝试以下解决方案:" -ForegroundColor Cyan
    Write-Host "  - 关闭 VPN/代理后重试" -ForegroundColor White
    Write-Host "  - 使用手机热点网络" -ForegroundColor White
    Write-Host "  - 手动运行: set PUB_HOSTED_URL=https://pub.flutter-io.cn && flutter pub get" -ForegroundColor White
    Read-Host "按回车退出"
    exit 1
}

Write-Host "  依赖下载完成!" -ForegroundColor Green

# Step 4: 选择构建目标
Write-Host ""
Write-Host "[4/6] 选择构建目标:" -ForegroundColor Yellow
Write-Host "  [1] Windows 桌面应用 (推荐)" -ForegroundColor White
Write-Host "  [2] Web 网页应用" -ForegroundColor White
Write-Host "  [3] Android APK" -ForegroundColor White
Write-Host "  [4] 全部构建" -ForegroundColor White
Write-Host ""
$choice = Read-Host "请选择 (1-4，默认1)"

if ([string]::IsNullOrEmpty($choice)) { $choice = "1" }

# Step 5 & 6: 构建和运行
Write-Host ""

switch ($choice) {
    "1" {
        Write-Host "[5/6] 构建 Windows 桌面应用..." -ForegroundColor Yellow
        & C:\flutter\bin\flutter.bat build windows --release
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  构建成功!" -ForegroundColor Green
            Write-Host ""
            Write-Host "[6/6] 启动应用..." -ForegroundColor Yellow
            $exePath = "build\windows\x64\runner\Release\advanced_calculator.exe"
            if (Test-Path $exePath) {
                Write-Host "  可执行文件: $projectDir\$exePath" -ForegroundColor Cyan
                Start-Process $exePath
            }
        }
    }
    "2" {
        Write-Host "[5/6] 构建 Web 应用..." -ForegroundColor Yellow
        & C:\flutter\bin\flutter.bat build web --release
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  构建成功!" -ForegroundColor Green
            Write-Host ""
            Write-Host "[6/6] 启动 Web 服务器..." -ForegroundColor Yellow
            & C:\flutter\bin\flutter.bat run -d chrome --release
        }
    }
    "3" {
        Write-Host "[5/6] 构建 Android APK..." -ForegroundColor Yellow
        Write-Host "  需要 Android SDK，请确保已安装 Android Studio" -ForegroundColor Gray
        & C:\flutter\bin\flutter.bat build apk --release
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  APK 构建成功!" -ForegroundColor Green
            $apkPath = "build\app\outputs\flutter-apk\app-release.apk"
            Write-Host "  APK 文件: $projectDir\$apkPath" -ForegroundColor Cyan
        }
    }
    "4" {
        Write-Host "[5/6] 构建全部平台..." -ForegroundColor Yellow
        
        Write-Host "  构建 Windows..." -ForegroundColor Gray
        & C:\flutter\bin\flutter.bat build windows --release
        
        Write-Host "  构建 Web..." -ForegroundColor Gray
        & C:\flutter\bin\flutter.bat build web --release
        
        Write-Host ""
        Write-Host "[6/6] 构建完成!" -ForegroundColor Green
        Write-Host "  Windows: build\windows\x64\runner\Release\" -ForegroundColor Cyan
        Write-Host "  Web: build\web\" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  完成!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Read-Host "按回车退出"
