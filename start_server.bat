@echo off
echo Starting Nexor University Backend Server...
cd /d "%~dp0"
if exist node_modules (
    echo Node modules found. Starting server...
    node backend/server.js
) else (
    echo Node modules not found. Please install Node.js and run 'npm install' manually if needed.
    pause
    exit
)
pause
