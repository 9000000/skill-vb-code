@echo off
node "%~dp0scripts\publish.js" %*
if %errorlevel% neq 0 (
    echo.
    pause
)
