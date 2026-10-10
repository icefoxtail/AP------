$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$r3 = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/r3-20261011-codex'
$render = 'archive/analysis/24_매산여고_1학기_중간_고2_수학I/render/r3-q21-revision2'
$node = 'C:\Users\USER\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$proofs = @(
  "$render/machine-capture.json",
  "$render/exam-desktop.png", "$render/exam-mobile.png",
  "$render/sol-desktop.png", "$render/sol-mobile.png",
  "$render/ans-desktop.png", "$render/ans-mobile.png",
  "$render/R3.capture-review.json", "$render/R3.render-receipt.json", "$render/durable-rebind-parity.json",
  "$r3/R3.evidence.durable.json", "$r3/R3.validator.durable.raw.json",
  "$r3/R3.evidence.revision2.json", "$r3/R3.validator.revision2.raw.json",
  "$r3/R3.validator.raw.json", "$r3/R3.capture-review.revision2.json",
  "$r3/R3.capture-review.json", "$r3/R3.completion.sealed.revision2.json",
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
  '--evidence', "$r3/R3.evidence.durable.json", '--report', "$r3/R3.validator.durable.raw.json",
  '--asset-root', 'archive', '--next-roster', '24_매산여고_1학기_중간_고2_확률과통계',
  '--output', "$r3/R3.completion.sealed.durable.json"
)
foreach ($proof in $proofs) { $argvList += @('--proof', $proof) }
$output = & $node @argvList 2>&1
$exit = $LASTEXITCODE
$output | Set-Content -LiteralPath "$r3/R3.seal.durable.stdout-stderr.raw.txt" -Encoding utf8
Set-Content -LiteralPath "$r3/R3.seal.durable.exit-code.txt" -Value $exit -NoNewline
Get-Content -Raw "$r3/R3.seal.durable.stdout-stderr.raw.txt"
Write-Output "exit=$exit"
