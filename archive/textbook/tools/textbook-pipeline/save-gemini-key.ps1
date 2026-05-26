$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$EnvFile = Join-Path $Root ".env.local"

$secure = Read-Host "GEMINI_API_KEY" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
try {
  $key = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
} finally {
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}

if ([string]::IsNullOrWhiteSpace($key) -or $key.Length -lt 20 -or $key -eq "put_your_key_here" -or $key -eq "*") {
  throw "GEMINI_API_KEY looks invalid. Paste the full key, not the masked asterisk shown by the prompt."
}

Set-Content -LiteralPath $EnvFile -Value "GEMINI_API_KEY=$key" -Encoding UTF8
Write-Host "Saved GEMINI_API_KEY to $EnvFile"
