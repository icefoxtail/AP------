param(
  [string]$InputDir = "$PSScriptRoot\..\samples",
  [string]$OutputDir = "$PSScriptRoot\..\outputs",
  [string]$TexBin = "C:\Users\USER\AppData\Local\Programs\TeXLive\2026\bin\windows"
)
$ErrorActionPreference = 'Stop'
$generator = Join-Path $PSScriptRoot 'generate.py'
$python = 'C:\Python314\python.exe'
$xelatex = Join-Path $TexBin 'xelatex.exe'
$dvisvgm = Join-Path $TexBin 'dvisvgm.exe'
if (!(Test-Path $python) -or !(Test-Path $xelatex) -or !(Test-Path $dvisvgm)) { throw 'GOLD_PILOT_TOOLCHAIN_MISSING' }
New-Item -ItemType Directory -Force $OutputDir | Out-Null
$results = @()
Get-ChildItem $InputDir -Filter '*.json' | Sort-Object Name | ForEach-Object {
  $id = $_.BaseName
  $itemOut = Join-Path $OutputDir $id
  New-Item -ItemType Directory -Force $itemOut | Out-Null
  $tex = Join-Path $itemOut "$id.tex"
  $witness = Join-Path $itemOut "$id.witness.json"
  & $python $generator $_.FullName --tex $tex --witness $witness
  if ($LASTEXITCODE -ne 0) { throw "GENERATOR_FAILED:$id" }
  Push-Location $itemOut
  try {
    & $xelatex -no-pdf -interaction=nonstopmode -halt-on-error "$id.tex" *> "$id.xelatex.log"
    $texExit = $LASTEXITCODE
    if ($texExit -ne 0) { throw "XELATEX_FAILED:$id" }
    & $dvisvgm --no-fonts --exact --output="$id.svg" "$id.xdv" *> "$id.dvisvgm.log"
    $svgExit = $LASTEXITCODE
    if ($svgExit -ne 0) { throw "DVISVGM_FAILED:$id" }
  } finally { Pop-Location }
  $results += [pscustomobject]@{ id = $id; texExit = $texExit; dvisvgmExit = $svgExit; svg = "$itemOut\$id.svg" }
}
$results | ConvertTo-Json -Depth 4 | Set-Content (Join-Path $OutputDir 'build-results.json') -Encoding utf8
