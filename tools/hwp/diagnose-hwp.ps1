[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)] [string] $JobFile,
  [Parameter(Mandatory = $true)] [string] $SecurityDll,
  [Parameter(Mandatory = $true)] [string] $LogPath
)
$ErrorActionPreference = 'Stop'
$job=Get-Content -LiteralPath $JobFile -Raw -Encoding utf8|ConvertFrom-Json
$src=[string]$job.source
$out=[string]$job.outputPdf
function Log($s){ Add-Content -LiteralPath $LogPath -Value ((Get-Date -Format o)+' '+$s) -Encoding utf8 }
Set-Content -LiteralPath $LogPath -Value ((Get-Date -Format o)+' START') -Encoding utf8
$hwp=$null
try {
  Log ('bitness '+([IntPtr]::Size*8))
  $parent=Split-Path -Parent $out;New-Item -ItemType Directory -Path $parent -Force|Out-Null
  $staged=Join-Path $parent (Split-Path -Leaf $src);Copy-Item -LiteralPath $src -Destination $staged -Force;Log ('staged '+$staged)
  $hwp=New-Object -ComObject HWPFrame.HwpObject;Log 'COM_OK'
  try{$hwp.XHwpWindows.Item(0).Visible=$false}catch{};Log 'VISIBLE_FALSE'
  [void]$hwp.SetMessageBoxMode(0x00001000);Log 'MESSAGE_MODE'
  try{$r=$hwp.RegisterModule('FilePathCheckDLL','FilePathCheckerModuleExample');Log ('REGISTER '+$r)}catch{Log ('REGISTER_ERR '+$_.Exception.Message)}
  Log 'BEFORE_OPEN';$o=$hwp.Open($staged,'','lock:false;forceopen:true;suspendpassword:true;versionwarning:false;skipcomment:true;');Log ('AFTER_OPEN '+$o)
  Log 'BEFORE_SAVEAS';$s=$hwp.SaveAs($out,'PDF','');Log ('AFTER_SAVEAS '+$s)
  Log 'BEFORE_PRINT';$a=$hwp.CreateAction('Print');Log ('ACTION '+($null -ne $a));$set=$a.CreateSet();$a.GetDefault($set);$set.SetItem('Device',3);$set.SetItem('FileName',$out);Log 'BEFORE_EXECUTE';$e=$a.Execute($set);Log ('AFTER_EXECUTE '+$e)
}catch{Log ('ERROR '+$_.Exception.ToString())}
finally{if($null -ne $hwp){Log 'BEFORE_CLEAR';try{[void]$hwp.Clear(1)}catch{Log ('CLEAR_ERR '+$_.Exception.Message)};Log 'BEFORE_QUIT';try{[void]$hwp.Quit()}catch{Log ('QUIT_ERR '+$_.Exception.Message)};Log 'AFTER_QUIT'}}
