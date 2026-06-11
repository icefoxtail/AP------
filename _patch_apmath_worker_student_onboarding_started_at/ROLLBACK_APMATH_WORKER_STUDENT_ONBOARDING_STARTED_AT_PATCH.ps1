param(
  [string]$BackupPath = ''
)

$ErrorActionPreference = 'Stop'
$Root = (Get-Location).Path
$StudentRoute = Join-Path $Root 'apmath\worker-backup\worker\routes\students.js'

if (!$BackupPath) {
  $candidates = Get-ChildItem -Path (Split-Path $StudentRoute) -Filter 'students.js.bak_apmath_onboarding_started_at_*' | Sort-Object LastWriteTime -Descending
  if (!$candidates -or !$candidates.Length) {
    throw "백업 파일을 찾지 못했습니다. BackupPath를 직접 지정하세요."
  }
  $BackupPath = $candidates[0].FullName
}

if (!(Test-Path $BackupPath)) {
  throw "백업 파일 없음: $BackupPath"
}

Copy-Item $BackupPath $StudentRoute -Force
Write-Host "[rollback] restored $StudentRoute from $BackupPath"
node --check $StudentRoute
