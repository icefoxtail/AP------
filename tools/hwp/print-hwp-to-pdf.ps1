[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)] [string] $JobFile,
  [Parameter(Mandatory = $true)] [string] $SecurityDll
)

$ErrorActionPreference = 'Stop'
$job = Get-Content -LiteralPath $JobFile -Raw -Encoding utf8 | ConvertFrom-Json
$Source = [string]$job.source
$OutputPdf = [string]$job.outputPdf
$ManifestPath = [string]$job.manifestPath
$result = [ordered]@{
  schemaVersion = 1
  status = 'FAILED'
  method = 'HwpObject.CreateAction(Print)'
  source = $Source
  outputPdf = $OutputPdf
  startedAt = (Get-Date).ToString('o')
  opened = $false
  printed = $false
  error = $null
}

function Write-Result {
  $parent = Split-Path -Parent $ManifestPath
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
  $result | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $ManifestPath -Encoding utf8
}

$hwp = $null
try {
  if ([IntPtr]::Size -ne 4) { throw 'This converter must run under 32-bit Windows PowerShell.' }
  if (!(Test-Path -LiteralPath $Source -PathType Leaf)) { throw "Source does not exist: $Source" }
  if (!(Test-Path -LiteralPath $SecurityDll -PathType Leaf)) { throw "Security DLL does not exist: $SecurityDll" }
  $outParent = Split-Path -Parent $OutputPdf
  New-Item -ItemType Directory -Path $outParent -Force | Out-Null
  $staged = Join-Path $outParent (Split-Path -Leaf $Source)
  Copy-Item -LiteralPath $Source -Destination $staged -Force
  $hwp = New-Object -ComObject HWPFrame.HwpObject
  try { $hwp.XHwpWindows.Item(0).Visible = $false } catch { }
  [void]$hwp.SetMessageBoxMode(0x00001000)
  try { [void]$hwp.RegisterModule('FilePathCheckDLL', 'FilePathCheckerModuleExample') } catch { }
  $result.opened = [bool]$hwp.Open($staged, '', 'lock:false;forceopen:true;suspendpassword:true;versionwarning:false;skipcomment:true;')
  if (!$result.opened) { throw 'HwpObject.Open returned false.' }
  $action = $hwp.CreateAction('Print')
  if ($null -eq $action) { throw 'CreateAction(Print) returned null.' }
  $option = $action.CreateSet()
  $action.GetDefault($option)
  $option.SetItem('Device', 3)
  $option.SetItem('FileName', $OutputPdf)
  $result.printed = [bool]$action.Execute($option)
  if (!$result.printed) { throw 'Print action returned false.' }
  Start-Sleep -Seconds 2
  if (!(Test-Path -LiteralPath $OutputPdf -PathType Leaf)) { throw 'Print action returned but PDF was not created.' }
  if ((Get-Item -LiteralPath $OutputPdf).Length -le 0) { throw 'Print action created an empty PDF.' }
  $result.status = 'DONE'
}
catch { $result.error = $_.Exception.ToString() }
finally {
  if ($null -ne $hwp) {
    try { [void]$hwp.Clear(1) } catch { }
    try { [void]$hwp.Quit() } catch { }
  }
  $result.finishedAt = (Get-Date).ToString('o')
  Write-Result
}
if ($result.status -ne 'DONE') { exit 1 }
exit 0
