[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)] [string] $ManifestPath,
  [Parameter(Mandatory = $true)] [string] $ConverterPath,
  [Parameter(Mandatory = $true)] [string] $SecurityDll,
  [Parameter(Mandatory = $false)] [int] $TimeoutSeconds = 90
)

$ErrorActionPreference = 'Stop'
$ps32 = Join-Path $env:WINDIR 'SysWOW64\WindowsPowerShell\v1.0\powershell.exe'
if (!(Test-Path -LiteralPath $ps32)) { throw "32-bit Windows PowerShell not found: $ps32" }
$items = Get-Content -LiteralPath $ManifestPath -Raw -Encoding utf8 | ConvertFrom-Json
$batch = [ordered]@{
  schemaVersion = 1
  converter = $ConverterPath
  securityDll = $SecurityDll
  timeoutSeconds = $TimeoutSeconds
  startedAt = (Get-Date).ToString('o')
  results = @()
}

foreach ($item in $items) {
  $jobPath = Join-Path (Split-Path -Parent $ManifestPath) ('job_' + [string]$item.key + '.json')
  [ordered]@{
    source = [string]$item.source
    outputPdf = [string]$item.outputPdf
    manifestPath = [string]$item.manifestPath
    securityDll = $SecurityDll
  } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $jobPath -Encoding utf8
  $before = @(Get-CimInstance Win32_Process -Filter "Name='Hwp.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match '-Automation -Embedding' } | Select-Object -ExpandProperty ProcessId)
  $args = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $ConverterPath, '-JobFile', $jobPath)
  $child = Start-Process -FilePath $ps32 -ArgumentList $args -PassThru -WindowStyle Hidden
  $finished = $false
  for ($second = 0; $second -lt $TimeoutSeconds; $second++) {
    Start-Sleep -Seconds 1
    if ($child.HasExited) { $finished = $true; break }
  }
  if (!$finished) {
    Stop-Process -Id $child.Id -Force -ErrorAction SilentlyContinue
    $after = @(Get-CimInstance Win32_Process -Filter "Name='Hwp.exe'" -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match '-Automation -Embedding' } | Select-Object -ExpandProperty ProcessId)
    foreach ($hwpPid in $after) { if ($before -notcontains $hwpPid) { Stop-Process -Id $hwpPid -Force -ErrorAction SilentlyContinue } }
    $batch.results += [ordered]@{ key = $item.key; status = 'TIMEOUT'; childPid = $child.Id; manifestPath = $item.manifestPath }
  }
  else {
    $childResult = $null
    if (Test-Path -LiteralPath $item.manifestPath) {
      try { $childResult = Get-Content -LiteralPath $item.manifestPath -Raw -Encoding utf8 | ConvertFrom-Json } catch { }
    }
    if ($null -eq $childResult) {
      $batch.results += [ordered]@{ key = $item.key; status = 'NO_MANIFEST'; exitCode = $child.ExitCode; manifestPath = $item.manifestPath }
    }
    else {
      $batch.results += [ordered]@{ key = $item.key; status = [string]$childResult.status; exitCode = $child.ExitCode; manifestPath = $item.manifestPath; outputPdf = [string]$childResult.outputPdf; outputSha256 = [string]$childResult.outputSha256; error = [string]$childResult.error }
    }
  }
}

$batch.finishedAt = (Get-Date).ToString('o')
$batch | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath ($ManifestPath + '.result.json') -Encoding utf8
