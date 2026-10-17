@echo off
title VITXplore - Stop All Services
echo Stopping all VITXplore services...

:: Kill node processes running backend
taskkill /f /im node.exe >nul 2>&1

:: Kill python processes running bert_service or http.server
taskkill /f /im python.exe >nul 2>&1

echo All services stopped cleanly.
timeout /t 2 /nobreak >nul
exit
