
$ErrorActionPreference = 'Stop'
$Root = (Get-Location).Path
$StudentRoute = Join-Path $Root 'apmath\worker-backup\worker\routes\students.js'
$backup = Get-ChildItem "$StudentRoute.bak_onboarding_update_patch3_*" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (!$backup) { throw "No patch3 backup found for $StudentRoute" }
Copy-Item $backup.FullName $StudentRoute -Force
Write-Host "[rollback] restored $($backup.FullName) -> $StudentRoute"
node --check $StudentRoute
