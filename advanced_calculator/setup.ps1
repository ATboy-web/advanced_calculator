$env:PUB_HOSTED_URL = "https://pub.flutter-io.cn"
$env:FLUTTER_STORAGE_BASE_URL = "https://storage.flutter-io.cn"

Write-Host "PUB_HOSTED_URL: $env:PUB_HOSTED_URL"
Write-Host "FLUTTER_STORAGE_BASE_URL: $env:FLUTTER_STORAGE_BASE_URL"
Write-Host "Running flutter pub get..."

$process = Start-Process -FilePath "C:\flutter\bin\flutter.bat" -ArgumentList "pub","get" -WorkingDirectory "c:\Users\Administrator\CodeBuddy\20260605103648\advanced_calculator" -NoNewWindow -Wait -PassThru
Write-Host "Exit code: $($process.ExitCode)"

if (Test-Path "c:\Users\Administrator\CodeBuddy\20260605103648\advanced_calculator\pubspec.lock") {
    Write-Host "SUCCESS: pubspec.lock created!"
} else {
    Write-Host "FAILED: pubspec.lock not found"
}
