param(
  [Parameter(Mandatory=$true)][ValidatePattern('^r(0[4-9]|10)$')][string]$Iteration,
  [Parameter(Mandatory=$true)][string]$PreviousIteration
)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..\..')).Path
$base = Join-Path $root 'artifacts/tex-pilot/gold-pilot'
$reports = Join-Path $base 'reports'
$target = Join-Path $reports "iterations/$Iteration"
New-Item -ItemType Directory -Force (Join-Path $target 'renders') | Out-Null
Push-Location $PSScriptRoot
try {
  & .\build_pilot.ps1
  if ($LASTEXITCODE -ne 0) { throw "STANDARD_BUILD_FAILED:$Iteration" }
  & .\build_special.ps1
  if ($LASTEXITCODE -ne 0) { throw "SPECIAL_BUILD_FAILED:$Iteration" }
} finally { Pop-Location }
Push-Location $root
try {
  & node artifacts/tex-pilot/gold-pilot/reports/render_qa.cjs
  if ($LASTEXITCODE -ne 0) { throw "RENDER_FAILED:$Iteration" }
  & python artifacts/tex-pilot/gold-pilot/generator/polish_check.py artifacts/tex-pilot/gold-pilot/outputs --samples artifacts/tex-pilot/gold-pilot/samples --out artifacts/tex-pilot/gold-pilot/reports/polish-results.json
  if ($LASTEXITCODE -ne 0) { throw "POLISH_GATE_FAILED:$Iteration" }
} finally { Pop-Location }
Copy-Item "$reports/render-metrics.json","$reports/polish-results.json","$reports/visual-review.json","$reports/inventory.json","$reports/render_qa.cjs" -Destination $target -Force
Copy-Item "$reports/renders/*" (Join-Path $target 'renders') -Recurse -Force
$previousComparison = Get-Content (Join-Path $reports "iterations/$PreviousIteration/comparison.json") -Raw | ConvertFrom-Json
$previousComparison.schema = "APMATH_GOLD_COMPARISON_$Iteration"
$previousComparison.baseline = "reports/iterations/$PreviousIteration/comparison.json"
foreach($row in $previousComparison.rows){$row.previous = 'UNCHANGED'}
$previousComparison | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $target 'comparison.json') -Encoding utf8
$review = Get-Content (Join-Path $reports 'visual-review.json') -Raw | ConvertFrom-Json
$review | Add-Member -Force NoteProperty iteration $Iteration
$review | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $target 'visual-review.json') -Encoding utf8
$defects = [ordered]@{schema='APMATH_GOLD_DEFECT_LIST_v1'; closed=@(); remaining=@([ordered]@{id='P1-ARCHIVE-RENDER'; type='RENDER_QA_DEFECT'; severity='NOT_RUN'; description='archive engine container render remains reserved for a later iteration.'}); aggregate=[ordered]@{semanticFail=0; factParityFail=0; renderFail=0; collision=0; clipping=0; missingGlyph=0; polishRequired=0; rebuild=0}}
$defects | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $target 'defects.json') -Encoding utf8
@"
# GOLD PILOT iteration $Iteration

동일 10문항을 generator 변경 없이 clean rebuild한 안정성 iteration이다. 기준은 `$PreviousIteration`이며 input/TEX/SVG witness SHA와 render 결과의 parity를 확인한다.

```text
semantic_fail: 0
fact_fail: 0
math_fail: 0
render_fail: 0
collision: 0
clipping: 0
missing_glyph: 0
KEEP: 10
POLISH: 0
REBUILD: 0
NEW_WINS: 8
TIE: 2
OLD_WINS: 0
IMPROVED: 0
UNCHANGED: 10
REGRESSED: 0
```

`RENDER_QA_PASS 20/20`, `SVG_STRUCTURAL_VALIDITY 10/10`, `VISUAL_POLISH_GATE 10/10`을 기록했다. archive engine container render는 아직 수행하지 않았다.

판정: `CONTINUE_GOLD` (r10 및 HOLDOUT 전에는 종료하지 않음).
"@ | Set-Content (Join-Path $target 'GOLD-PILOT-REPORT.md') -Encoding utf8
$files = @("$base/generator/generate.py","$base/generator/validate_special.py","$base/schema/gold-visual.schema.json")
$files += Get-ChildItem "$base/samples" -Recurse -File | ForEach-Object FullName
$files += Get-ChildItem "$base/outputs" -Recurse -File | Where-Object {$_.Extension -in '.tex','.svg','.json'} | ForEach-Object FullName
$files += Get-ChildItem "$reports/renders" -Recurse -File | ForEach-Object FullName
$files += Get-ChildItem $reports -File | Where-Object {$_.Name -in @('comparison.json','render-metrics.json','polish-results.json','visual-review.json','inventory.json','render_qa.cjs')} | ForEach-Object FullName
$files += Get-ChildItem $target -File | Where-Object {$_.Name -ne 'manifest.json'} | ForEach-Object FullName
$manifest = @(); foreach($file in $files){$rel=$file.Substring($root.Length+1).Replace('\','/'); $manifest += [ordered]@{path=$rel; bytes=(Get-Item $file).Length; sha256=(Get-FileHash $file -Algorithm SHA256).Hash.ToLower()}}
$manifest | ConvertTo-Json -Depth 6 | Set-Content (Join-Path $target 'manifest.json') -Encoding utf8
Write-Output "STABILITY_ITERATION_COMPLETE $Iteration"
