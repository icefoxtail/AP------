[CmdletBinding()]
param(
  [Parameter(Mandatory = $false)] [string] $Source = '',
  [Parameter(Mandatory = $false)] [string] $OutputPdf = '',
  [Parameter(Mandatory = $false)] [string] $ManifestPath = '',
  [Parameter(Mandatory = $false)] [string] $JobFile = '',
  [Parameter(Mandatory = $false)] [string] $SecurityDll = ''
)

$ErrorActionPreference = 'Stop'

function Get-Sha256 {
  param([string] $Path)
  $sha = [System.Security.Cryptography.SHA256]::Create()
  $stream = [System.IO.File]::OpenRead($Path)
  try { $bytes = $sha.ComputeHash($stream) }
  finally { $stream.Dispose(); $sha.Dispose() }
  return (([System.BitConverter]::ToString($bytes)) -replace '-', '').ToLowerInvariant()
}

if ($JobFile) {
  $job = Get-Content -LiteralPath $JobFile -Raw -Encoding utf8 | ConvertFrom-Json
  $Source = [string]$job.source
  $OutputPdf = [string]$job.outputPdf
  $ManifestPath = [string]$job.manifestPath
  if (!$SecurityDll -and $job.securityDll) { $SecurityDll = [string]$job.securityDll }
}
if (!$Source -or !$OutputPdf -or !$ManifestPath) { throw 'Source, OutputPdf, and ManifestPath are required (directly or through JobFile).' }

function Write-Manifest {
  param([hashtable] $Value)
  $parent = Split-Path -Parent $ManifestPath
  if ($parent) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  $Value | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $ManifestPath -Encoding utf8
}

$result = [ordered]@{
  schemaVersion = 1
  status = 'FAILED'
  source = $Source
  outputPdf = $OutputPdf
  stagedSource = $null
  stagedSourceSha256 = $null
  startedAt = (Get-Date).ToString('o')
  powershellBitness = [IntPtr]::Size * 8
  hwpProgId = 'HWPFrame.HwpObject'
  securityModule = $null
  registered = $false
  opened = $false
  saved = $false
  sourceSha256 = $null
  outputSha256 = $null
  outputBytes = $null
  error = $null
}

$hwp = $null
try {
  if ([IntPtr]::Size -ne 4) {
    throw 'This converter must run under 32-bit Windows PowerShell because installed Hwp.exe is 32-bit.'
  }
  if (!(Test-Path -LiteralPath $Source -PathType Leaf)) { throw "Source does not exist: $Source" }
  $result.sourceSha256 = Get-Sha256 -Path $Source

  if ($SecurityDll) {
    if (!(Test-Path -LiteralPath $SecurityDll -PathType Leaf)) { throw "Security DLL does not exist: $SecurityDll" }
    $regKey = 'HKCU:\Software\HNC\HwpAutomation\Modules'
    New-Item -Path $regKey -Force | Out-Null
    New-ItemProperty -Path $regKey -Name 'FilePathCheckerModuleExample' -PropertyType String -Value $SecurityDll -Force | Out-Null
    $usesKey = Join-Path $regKey 'Uses'
    New-Item -Path $usesKey -Force | Out-Null
    New-ItemProperty -Path $usesKey -Name 'FilePathCheckerModuleExample' -PropertyType DWord -Value 1 -Force | Out-Null
    $result.securityModule = [ordered]@{
      name = 'FilePathCheckerModuleExample'
      path = $SecurityDll
      sha256 = Get-Sha256 -Path $SecurityDll
    }
  }

  $outParent = Split-Path -Parent $OutputPdf
  if ($outParent) { New-Item -ItemType Directory -Path $outParent -Force | Out-Null }

  # Hwp.exe may show an access prompt for a source on a different volume even
  # when the automation module is installed. Stage an exact byte-for-byte copy
  # beside the derived PDF and open that local copy. The original source stays
  # read-only; both hashes are recorded for provenance.
  $stagedSource = Join-Path $outParent (Split-Path -Leaf $Source)
  Copy-Item -LiteralPath $Source -Destination $stagedSource -Force
  $result.stagedSource = $stagedSource
  $result.stagedSourceSha256 = Get-Sha256 -Path $stagedSource
  if ($result.sourceSha256 -ne $result.stagedSourceSha256) { throw 'Staged HWP hash differs from source HWP hash.' }

  $hwp = New-Object -ComObject HWPFrame.HwpObject
  try { $hwp.XHwpWindows.Item(0).Visible = $false } catch { }
  [void]$hwp.SetMessageBoxMode(0x00001000)
  try { $result.registered = [bool]$hwp.RegisterModule('FilePathCheckDLL', 'FilePathCheckerModuleExample') } catch { $result.registered = $false }

  $result.opened = [bool]$hwp.Open($stagedSource, '', 'lock:false;forceopen:true;suspendpassword:true;versionwarning:false;skipcomment:true;')
  if (!$result.opened) { throw 'HwpObject.Open returned false.' }
  $result.saved = [bool]$hwp.SaveAs($OutputPdf, 'PDF', '')
  if (!$result.saved) { throw 'HwpObject.SaveAs(PDF) returned false.' }
  if (!(Test-Path -LiteralPath $OutputPdf -PathType Leaf)) { throw 'SaveAs returned true but output PDF was not created.' }
  $outInfo = Get-Item -LiteralPath $OutputPdf
  if ($outInfo.Length -le 0) { throw 'Output PDF is empty.' }
  $result.outputBytes = $outInfo.Length
  $result.outputSha256 = Get-Sha256 -Path $OutputPdf
  $result.status = 'DONE'
}
catch {
  $result.error = $_.Exception.ToString()
}
finally {
  if ($null -ne $hwp) {
    try { [void]$hwp.Clear(1) } catch { }
    try { [void]$hwp.Quit() } catch { }
  }
  $result.finishedAt = (Get-Date).ToString('o')
  Write-Manifest -Value $result
}

if ($result.status -ne 'DONE') { exit 1 }
exit 0
