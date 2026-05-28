$ErrorActionPreference = "Stop"

# Apply from project root: C:\Users\USER\Desktop\AP------
# This patch updates EIE Round 1 closeout files only.

$root = Get-Location
$patchRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

$files = @(
  "eie\js\views\eie-dashboard.js",
  "eie\js\views\eie-import.js",
  "apmath\worker-backup\worker\routes\eie.js",
  "docs\EIE_WORKING_RULEBOOK.md",
  "docs\EIE_TIMETABLE_DATA_MODEL.md",
  "docs\proposals\eie\20260528_eie_round0_proposal.sql"
)

foreach ($file in $files) {
  $src = Join-Path $patchRoot $file
  $dest = Join-Path $root $file
  if (-not (Test-Path $src)) { throw "Missing patch file: $file" }
  New-Item -ItemType Directory -Force (Split-Path $dest -Parent) | Out-Null
  Copy-Item $src $dest -Force
}

$oldMigration = Join-Path $root "apmath\worker-backup\worker\migrations\20260528_eie_round0_proposal.sql"
if (Test-Path $oldMigration) {
  Remove-Item $oldMigration -Force
}

Write-Host "EIE Round 1 fix patch applied."
Write-Host "Moved proposal SQL to docs\proposals\eie and removed executable migration proposal path if present."
