$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$EnvFile = Join-Path $Root ".env.local"

$key = (Get-Clipboard -Raw).Trim()

if ([string]::IsNullOrWhiteSpace($key) -or $key.Length -lt 20 -or $key -eq "put_your_key_here" -or $key -eq "*") {
  throw "Clipboard does not look like a valid GEMINI_API_KEY. Copy the full key first, then run this script."
}

Set-Content -LiteralPath $EnvFile -Value "GEMINI_API_KEY=$key" -Encoding UTF8
Write-Host "Saved GEMINI_API_KEY to $EnvFile"
Write-Host "Key length:" $key.Length
