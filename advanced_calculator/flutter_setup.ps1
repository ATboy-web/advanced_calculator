# Flutter Advanced Calculator - Build Script
$ErrorActionPreference = "Continue"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Advanced Calculator - Flutter Build" -ForegroundColor Cyan
Write-Host "  Windows / Web / Android" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Set Chinese mirrors
$env:PUB_HOSTED_URL = "https://pub.flutter-io.cn"
$env:FLUTTER_STORAGE_BASE_URL = "https://storage.flutter-io.cn"
[Environment]::SetEnvironmentVariable("PUB_HOSTED_URL", "https://pub.flutter-io.cn", "User")
[Environment]::SetEnvironmentVariable("FLUTTER_STORAGE_BASE_URL", "https://storage.flutter-io.cn", "User")

# Step 1: Check Flutter
Write-Host "[1/5] Checking Flutter SDK..." -ForegroundColor Yellow
$flutterInstalled = $false
try {
    $fv = & C:\flutter\bin\flutter.bat --version 2>&1 | Out-String
    if ($fv -match "Flutter (\d+\.\d+\.\d+)") {
        Write-Host "  Flutter SDK found: $($Matches[1])" -ForegroundColor Green
        $flutterInstalled = $true
    }
} catch {}

if (-not $flutterInstalled) {
    Write-Host "  Flutter not found. Please install manually." -ForegroundColor Red
    Write-Host "  Download: https://flutter.cn/docs/get-started/install/windows" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

# Step 2: Set project directory
Write-Host ""
Write-Host "[2/5] Preparing project..." -ForegroundColor Yellow
$projectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDir
Remove-Item "C:\flutter\bin\cache\flutter.bat.lock" -Force -ErrorAction SilentlyContinue

# Step 3: Get dependencies
Write-Host ""
Write-Host "[3/5] Downloading dependencies (Chinese mirror)..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes..." -ForegroundColor Gray

$maxRetries = 3
$retryCount = 0
$success = $false

while (-not $success -and $retryCount -lt $maxRetries) {
    $retryCount++
    if ($retryCount -gt 1) {
        Write-Host "  Attempt $retryCount..." -ForegroundColor Yellow
        Remove-Item "C:\flutter\bin\cache\flutter.bat.lock" -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 5
    }
    
    $proc = Start-Process -FilePath "C:\flutter\bin\flutter.bat" -ArgumentList "pub","get" `
        -WorkingDirectory $projectDir -NoNewWindow -PassThru -RedirectStandardOutput "$env:TEMP\flutter_pub_out.txt" `
        -RedirectStandardError "$env:TEMP\flutter_pub_err.txt"
    
    if ($proc.WaitForExit(300000)) {
        if ($proc.ExitCode -eq 0) {
            $success = $true
        } else {
            Write-Host "  flutter pub get failed (Exit: $($proc.ExitCode))" -ForegroundColor Red
        }
    } else {
        Write-Host "  Timeout, killing process..." -ForegroundColor Red
        $proc.Kill()
    }
}

if (-not $success) {
    Write-Host ""
    Write-Host "  Dependency download failed!" -ForegroundColor Red
    Write-Host "  Possible causes:" -ForegroundColor Yellow
    Write-Host "  1. Network connection issue" -ForegroundColor Yellow
    Write-Host "  2. Firewall blocking connection" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  Try: Close VPN/proxy and retry" -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "  Dependencies downloaded!" -ForegroundColor Green

# Step 4: Choose target
Write-Host ""
Write-Host "[4/5] Choose build target:" -ForegroundColor Yellow
Write-Host "  [1] Windows Desktop (.exe)" -ForegroundColor White
Write-Host "  [2] Web App (Chrome)" -ForegroundColor White
Write-Host "  [3] Android APK" -ForegroundColor White
Write-Host "  [4] Build All" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Choose (1-4, default 1)"

if ([string]::IsNullOrEmpty($choice)) { $choice = "1" }

# Step 5: Build and run
Write-Host ""

switch ($choice) {
    "1" {
        Write-Host "[5/5] Building Windows app..." -ForegroundColor Yellow
        & C:\flutter\bin\flutter.bat build windows --release
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Build success!" -ForegroundColor Green
            $exePath = "build\windows\x64\runner\Release\advanced_calculator.exe"
            if (Test-Path $exePath) {
                Write-Host "  Starting app..." -ForegroundColor Yellow
                Start-Process $exePath
            }
        }
    }
    "2" {
        Write-Host "[5/5] Building Web app..." -ForegroundColor Yellow
        & C:\flutter\bin\flutter.bat build web --release
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  Build success!" -ForegroundColor Green
            & C:\flutter\bin\flutter.bat run -d chrome --release
        }
    }
    "3" {
        Write-Host "[5/5] Building Android APK..." -ForegroundColor Yellow
        & C:\flutter\bin\flutter.bat build apk --release
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  APK build success!" -ForegroundColor Green
            Write-Host "  APK: build\app\outputs\flutter-apk\app-release.apk" -ForegroundColor Cyan
        }
    }
    "4" {
        Write-Host "[5/5] Building all platforms..." -ForegroundColor Yellow
        
        Write-Host "  Building Windows..." -ForegroundColor Gray
        & C:\flutter\bin\flutter.bat build windows --release
        
        Write-Host "  Building Web..." -ForegroundColor Gray
        & C:\flutter\bin\flutter.bat build web --release
        
        Write-Host ""
        Write-Host "  All builds complete!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Done!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
