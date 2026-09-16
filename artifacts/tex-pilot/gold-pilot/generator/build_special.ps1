param(
  [string]$InputDir = "$PSScriptRoot\..\samples\special",
  [string]$OutputDir = "$PSScriptRoot\..\outputs",
  [string]$TexBin = "C:\Users\USER\AppData\Local\Programs\TeXLive\2026\bin\windows"
)
$ErrorActionPreference = 'Stop'
$python = 'C:\Python314\python.exe'
$validator = Join-Path $PSScriptRoot 'validate_special.py'
$xelatex = Join-Path $TexBin 'xelatex.exe'
$dvisvgm = Join-Path $TexBin 'dvisvgm.exe'
if (!(Test-Path $python) -or !(Test-Path $validator) -or !(Test-Path $xelatex) -or !(Test-Path $dvisvgm)) { throw 'GOLD_PILOT_TOOLCHAIN_MISSING' }
Get-ChildItem $InputDir -Filter '*.tex' | Sort-Object Name | ForEach-Object {
  $id = $_.BaseName
  $itemOut = Join-Path $OutputDir $id
  New-Item -ItemType Directory -Force $itemOut | Out-Null
  Copy-Item $_.FullName (Join-Path $itemOut "$id.tex") -Force
  $facts = Join-Path $InputDir "$id.facts.json"
  & $python $validator $facts (Join-Path $itemOut "$id.tex") --witness (Join-Path $itemOut "$id.special-witness.json")
  if ($LASTEXITCODE -ne 0) { throw "SPECIAL_FACTS_FAILED:$id" }
  Push-Location $itemOut
  try {
    & $xelatex -no-pdf -interaction=nonstopmode -halt-on-error "$id.tex" *> "$id.xelatex.log"
    if ($LASTEXITCODE -ne 0) { throw "XELATEX_FAILED:$id" }
    & $dvisvgm --no-fonts --exact --output="$id.svg" "$id.xdv" *> "$id.dvisvgm.log"
    if ($LASTEXITCODE -ne 0) { throw "DVISVGM_FAILED:$id" }
  } finally { Pop-Location }
}
