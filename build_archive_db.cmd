@echo off
setlocal
cd /d "%~dp0"

set "PYTHON_EXE=%LocalAppData%\Programs\Python\Python312\python.exe"

if not exist "%PYTHON_EXE%" (
    echo [ERROR] Python executable not found:
    echo %PYTHON_EXE%
    echo.
    pause
    exit /b 1
)

"%PYTHON_EXE%" "%~dp0archive\build_db.py"
set "EXIT_CODE=%ERRORLEVEL%"

echo.
if not "%EXIT_CODE%"=="0" (
    echo [ERROR] Archive DB build failed. Exit code: %EXIT_CODE%
) else (
    echo [OK] Archive DB build finished.
)

pause
exit /b %EXIT_CODE%
