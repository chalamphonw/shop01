# Start All Services Script
Write-Host "=== Starting E-Commerce System ===" -ForegroundColor Cyan

# Kill existing processes
Write-Host "`nKilling existing processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null
taskkill /F /IM mongod.exe 2>$null
Start-Sleep -Seconds 3

# Start MongoDB
Write-Host "`nStarting MongoDB..." -ForegroundColor Green
$mongoExe = "C:\mongodb\mongodb-win32-x86_64-windows-6.0.15\bin\mongod.exe"
$mongoConfig = "C:\mongodb\mongod.conf"
Start-Process -FilePath $mongoExe -ArgumentList "--config", $mongoConfig -WindowStyle Hidden
Start-Sleep -Seconds 3

# Start Backend
Write-Host "Starting Backend on port 5001..." -ForegroundColor Green
$backendPath = "C:\Users\ifone\OneDrive\เดสก์ท็อป\New folder (2)\555\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend on port 3000..." -ForegroundColor Green
$frontendPath = "C:\Users\ifone\OneDrive\เดสก์ท็อป\New folder (2)\555\frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start" -WindowStyle Normal
Start-Sleep -Seconds 3

# Start Admin
Write-Host "Starting Admin on port 3001..." -ForegroundColor Green
$adminPath = "C:\Users\ifone\OneDrive\เดสก์ท็อป\New folder (2)\555\admin"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$adminPath'; npm start" -WindowStyle Normal

Write-Host "`n=== All services starting ===" -ForegroundColor Cyan
Write-Host "Waiting 10 seconds for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test backend API
Write-Host "`nTesting Backend API..." -ForegroundColor Yellow
try {
    $body = '{"email":"admin@example.com","password":"Admin@123456"}'
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/auth/login" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5
    Write-Host "✅ Backend API: WORKING (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend API: NOT RESPONDING" -ForegroundColor Red
}

# Check ports
Write-Host "`nChecking ports..." -ForegroundColor Yellow
$ports = netstat -ano | Select-String "LISTENING" | Select-String "3000|3001|5001"
if ($ports) {
    Write-Host "✅ Ports are listening:" -ForegroundColor Green
    $ports | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "❌ No ports listening" -ForegroundColor Red
}

Write-Host "`n=== System Status ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Admin Panel: http://localhost:3001" -ForegroundColor White
Write-Host "Backend API: http://localhost:5001" -ForegroundColor White
Write-Host "`nLogin Credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@example.com" -ForegroundColor White
Write-Host "Password: Admin@123456" -ForegroundColor White

# Open admin in browser
Write-Host "`nOpening Admin Panel in browser..." -ForegroundColor Green
Start-Sleep -Seconds 5
Start-Process "http://localhost:3001"

Write-Host "`n✅ System started successfully!" -ForegroundColor Green
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
