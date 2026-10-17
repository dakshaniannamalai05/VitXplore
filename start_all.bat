@echo off
title VITXplore - 1-Click Launcher
echo ========================================================
echo         Launching VITXplore Services...
echo ========================================================
echo.

:: 1. Start Python BERT Abuse Detection Service (Port 5050)
echo [1/3] Starting Python BERT AI Service on port 5050...
start "VITXplore - Python AI (Port 5050)" cmd /k "cd /d "%~dp0vit-auth-secure-5 change\vit-auth-secure-5\models-service" && python bert_service.py"

:: Give Python a moment to load
timeout /t 2 /nobreak >nul

:: 2. Start Node.js Backend Server (Port 5000)
echo [2/3] Starting Node.js Backend Server on port 5000...
start "VITXplore - Backend Server (Port 5000)" cmd /k "cd /d "%~dp0vit-auth-secure-5 change\vit-auth-secure-5" && npm start"

:: 3. Start Frontend Web Server (Port 5500)
echo [3/3] Starting Frontend Web Server on port 5500...
start "VITXplore - Frontend Server (Port 5500)" cmd /k "cd /d "%~dp0The_real_VITXPLORE-change\The_real_VITXPLORE-chat\The_real_VITXPLORE-5\vit_ui_demo\vit_ui_demo" && python -m http.server 5500 --bind 127.0.0.1"

echo.
echo ========================================================
echo   All 3 services are starting!
echo   Opening VITXplore in your browser in 3 seconds...
echo ========================================================

timeout /t 3 /nobreak >nul
start http://127.0.0.1:5500/login.html

exit
