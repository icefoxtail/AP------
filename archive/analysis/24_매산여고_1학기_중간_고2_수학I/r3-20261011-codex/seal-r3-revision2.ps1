$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$dir = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r3-20261011-codex'
$node = 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$proofs = @(
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/machine-capture.json',
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/exam-desktop.png',
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/exam-mobile.png',
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/sol-desktop.png',
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/sol-mobile.png',
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/ans-desktop.png',
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-02/ans-mobile.png',
  "$dir/R3.capture-review.revision2.json",
  "$dir/R3.render-receipt.revision2.json",
  "$dir/R3.evidence.final.json",
  "$dir/R3.validator.raw.json",
  "$dir/R3.capture-review.json",
  '.tmp/archive/h2-1mid-20261011/24_매산여고_1학기_중간_고2_수학I/r3-capture-01/machine-capture.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-fresh-q21-20261011/r1-final-evidence.revision2.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-fresh-q21-20261011/r1-stage-validator.revision2.raw.v2.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r1-fresh-q21-20261011/r1-completion.sealed.revision2.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r2-fresh-q21-20261011/r2-final-evidence.current.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r2-fresh-q21-20261011/r2-stage-validator.raw.v2.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r2-fresh-q21-20261011/r2-completion.current.sealed.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-recovery-closure.json',
  'archive/analysis/24_매산여고_1학기_중간_고2_수학I/ITEM_RECOVERY_20261011_CODEX_CLEAN/q21-visual-geometry-evidence.json'
)
foreach ($proof in $proofs) { if (-not (Test-Path -LiteralPath $proof)) { throw "PROOF_NOT_FOUND:$proof" } }
$argvList = @(
  'archive/tools/archive-codex-stage-kit.mjs', 'seal', '--root', $root, '--stage', 'R3', '--reviewer', 'r3_maesan_math1',
  '--exam', 'archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js',
  '--evidence', "$dir/R3.evidence.revision2.json", '--report', "$dir/R3.validator.revision2.raw.json",
  '--asset-root', 'archive', '--next-roster', '24_매산여고_1학기_중간_고2_확률과통계',
  '--output', "$dir/R3.completion.sealed.revision2.json"
)
foreach ($proof in $proofs) { $argvList += @('--proof', $proof) }
$output = & $node @argvList 2>&1
$exit = $LASTEXITCODE
$output | Set-Content -LiteralPath "$dir/R3.seal.stdout-stderr.raw.txt" -Encoding utf8
Set-Content -LiteralPath "$dir/R3.seal.exit-code.txt" -Value $exit -NoNewline
Get-Content -Raw "$dir/R3.seal.stdout-stderr.raw.txt"
Write-Output "exit=$exit"
