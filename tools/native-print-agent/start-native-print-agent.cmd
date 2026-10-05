@echo off
setlocal
set "AGENT_DIR=%~dp0"
set "CSC=%WINDIR%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC%" set "CSC=%WINDIR%\Microsoft.NET\Framework\v4.0.30319\csc.exe"
if not exist "%CSC%" (
  echo .NET Framework C# compiler was not found.
  exit /b 1
)
"%CSC%" /nologo /target:exe /reference:System.Drawing.dll /out:"%AGENT_DIR%native-print-agent.exe" "%AGENT_DIR%Program.cs"
if errorlevel 1 exit /b 1
"%AGENT_DIR%native-print-agent.exe" --printer "SINDOH N500 Series PCL"
endlocal
