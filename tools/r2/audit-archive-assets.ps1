param(
  [string]$Root = "archive/assets/images",
  [string]$ManifestPath = "_tmp/r2-archive-assets-manifest.json"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Root -PathType Container)) {
  throw "Archive asset image root not found: $Root"
}

$resolvedRoot = (Resolve-Path -LiteralPath $Root).Path
$manifestDir = Split-Path -Parent $ManifestPath

if ($manifestDir -and -not (Test-Path -LiteralPath $manifestDir -PathType Container)) {
  New-Item -ItemType Directory -Force -Path $manifestDir | Out-Null
}

$extensions = @(".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg")
$files = Get-ChildItem -LiteralPath $resolvedRoot -File -Recurse |
  Where-Object { $extensions -contains $_.Extension.ToLowerInvariant() } |
  Sort-Object FullName

$items = foreach ($file in $files) {
  $relative = $file.FullName.Substring($resolvedRoot.Length).TrimStart("\", "/").Replace("\", "/")
  $hash = Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256

  [pscustomobject]@{
    key = $relative
    bytes = $file.Length
    sha256 = $hash.Hash.ToLowerInvariant()
  }
}

$totalBytes = ($items | Measure-Object -Property bytes -Sum).Sum
if ($null -eq $totalBytes) {
  $totalBytes = 0
}

$largest = @($items | Sort-Object bytes -Descending | Select-Object -First 20)

$summary = [pscustomobject]@{
  generatedAt = (Get-Date).ToUniversalTime().ToString("o")
  root = $Root
  count = @($items).Count
  totalBytes = [int64]$totalBytes
  totalMB = [math]::Round(($totalBytes / 1MB), 2)
  largest = $largest
  items = @($items)
}

$summary | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $ManifestPath -Encoding UTF8

Write-Host "Asset count: $($summary.count)"
Write-Host "Total MB: $($summary.totalMB)"
Write-Host "Manifest: $ManifestPath"
Write-Host "Largest files:"

if ($largest.Count -eq 0) {
  Write-Host "  (none)"
} else {
  foreach ($item in $largest) {
    $mb = [math]::Round(($item.bytes / 1MB), 2)
    Write-Host ("  {0} MB  {1}" -f $mb, $item.key)
  }
}
