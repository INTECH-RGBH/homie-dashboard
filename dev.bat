@echo off

where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo npm not found!
  exit /b 1
)

if not defined MOSQUITTO_DIR (
  echo mosquitto not found!
  exit /b 1
)

echo Starting MQTT broker (RED)
start cmd /k "color 4F && "%MOSQUITTO_DIR%\mosquitto" -v"
echo Starting development server (BLUE)
start cmd /k "color 1F && npm run server-dev"
REM echo Starting emulator (GREEN)
REM start cmd /k "color 2F && npm run emulator-start"
echo Starting development web app (PURPLE)
start cmd /k "color 5F && npm run app-dev"

echo Success
