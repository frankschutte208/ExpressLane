@echo off
echo Killing processes on ports 3000-3006...

for /l %%i in (3000,1,3006) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%i ^| findstr LISTENING') do (
        taskkill /F /PID %%a
        echo Killed process on port %%i
    )
)

echo Starting the application...
set PORT=3005
set API_PORT=3006
start cmd /k "npm run start"
start cmd /k "node server.js"

echo Application is starting...
echo React app will be available at http://localhost:3005
echo API server will be available at http://localhost:3006 