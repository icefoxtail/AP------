# D1 daily backup: exports all wangji D1 databases to local SQL dumps.
# Registered in Windows Task Scheduler as "WangjiD1Backup" (daily).
# Requires: wrangler OAuth login (npx wrangler login) on this machine.

$ErrorActionPreference = 'Continue'

$Databases   = @('ap-math-os', 'wangji-eie-os', 'wangji-common-os')
$BackupRoot  = 'C:\Users\USER\Documents\wangji-db-backups'
$RetentionDays = 30
$WorkDir     = 'C:\Users\USER\Desktop\AP------'

$stamp   = Get-Date -Format 'yyyy-MM-dd'
$destDir = Join-Path $BackupRoot $stamp
New-Item -ItemType Directory -Force -Path $destDir | Out-Null
$logFile = Join-Path $BackupRoot 'backup.log'

function Log([string]$msg) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg"
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

Log "=== backup start ($stamp) ==="
Set-Location $WorkDir

$failed = @()
foreach ($db in $Databases) {
    $outFile = Join-Path $destDir "$db.sql"
    Log "exporting $db ..."
    & npx wrangler d1 export $db --remote --output $outFile 2>&1 | Out-Null
    if ((Test-Path $outFile) -and ((Get-Item $outFile).Length -gt 1024)) {
        $sizeKb = [math]::Round((Get-Item $outFile).Length / 1KB)
        Log "OK $db -> $outFile (${sizeKb} KB)"
    } else {
        $failed += $db
        Log "FAIL $db (missing or suspiciously small output)"
    }
}

# Retention: remove dated folders older than $RetentionDays
Get-ChildItem -Path $BackupRoot -Directory | Where-Object {
    $_.Name -match '^\d{4}-\d{2}-\d{2}$' -and
    ([datetime]::ParseExact($_.Name, 'yyyy-MM-dd', $null) -lt (Get-Date).AddDays(-$RetentionDays))
} | ForEach-Object {
    Log "retention: removing $($_.FullName)"
    Remove-Item -Recurse -Force $_.FullName
}

if ($failed.Count -gt 0) {
    Log "=== backup finished with FAILURES: $($failed -join ', ') ==="
    exit 1
}
Log "=== backup finished OK ==="
exit 0
