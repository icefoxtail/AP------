@echo off
setlocal

set "INSTALL_DIR=%LOCALAPPDATA%\APMath\NativePrintAgent"
set "SOURCE_URL=https://raw.githubusercontent.com/icefoxtail/AP------/main/tools/native-print-agent/Program.cs"
set "CSC=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC%" set "CSC=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe"

if not exist "%CSC%" (
  echo .NET Framework compiler was not found on this computer.
  echo Install the current Windows .NET Framework and run this installer again.
  pause
  exit /b 1
)

if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if errorlevel 1 goto :failed

echo Downloading AP Math print agent source...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -UseBasicParsing -Uri '%SOURCE_URL%' -OutFile '%INSTALL_DIR%\Program.cs'"
if errorlevel 1 goto :failed

echo Installing the local print agent...
"%CSC%" /nologo /target:winexe /reference:System.Drawing.dll /out:"%INSTALL_DIR%\native-print-agent.exe" "%INSTALL_DIR%\Program.cs"
if errorlevel 1 goto :failed

del /q "%INSTALL_DIR%\Program.cs" >nul 2>&1

echo Registering automatic startup for this Windows user...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$run='HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'; New-Item -Path $run -Force | Out-Null; $q=[char]34; $value=$q + '%INSTALL_DIR%\native-print-agent.exe' + $q + ' --printer ' + $q + 'SINDOH N500 Series PCL' + $q; Set-ItemProperty -Path $run -Name 'APMathPrintAgent' -Value $value"
if errorlevel 1 goto :failed

echo Starting AP Math print agent...
start "AP Math Print Agent" /b "%INSTALL_DIR%\native-print-agent.exe" --printer "SINDOH N500 Series PCL"
echo.
echo Installation complete. You can close this window.
echo The agent will start automatically when this Windows user logs in.
pause
exit /b 0

:failed
echo.
echo Installation failed. Check the printer driver, internet connection, and permissions.
pause
exit /b 1
