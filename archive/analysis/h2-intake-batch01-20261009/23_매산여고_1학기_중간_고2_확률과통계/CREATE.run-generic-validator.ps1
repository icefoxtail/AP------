$ErrorActionPreference='Stop'
$root='C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------'
$exam='C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------\.tmp\archive\h2-intake-batch01-20261009\23_매산여고_1학기_중간_고2_확률과통계\23_매산여고_1학기_중간_고2_확률과통계.js'
$evidence='C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------\archive\analysis\h2-intake-batch01-20261009\23_매산여고_1학기_중간_고2_확률과통계\CREATE.evidence.revision3.bound.json'
$assetRoot='C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------\.tmp\archive\h2-intake-batch01-20261009\23_매산여고_1학기_중간_고2_확률과통계'
$evidenceRoot='C:\Users\USER\Desktop\AP-worktrees\h2-intake-batch01\AP------\archive\analysis\h2-intake-batch01-20261009\23_매산여고_1학기_중간_고2_확률과통계'
$stdoutPath=Join-Path $evidenceRoot 'CREATE.generic-validator.revision2.final.stdout.json'
$stderrPath=Join-Path $evidenceRoot 'CREATE.generic-validator.revision2.final.stderr.txt'
$capturePath=Join-Path $evidenceRoot 'CREATE.generic-validator.revision2.final.process.json'
$node=(Get-Command node).Source
$validatorArgv=[string[]]@('archive/tools/archive-stage-validator.mjs','--exam',$exam,'--evidence',$evidence,'--stage','CREATE','--quality-contract','JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006','--execution-line','CODEX','--asset-root',$assetRoot,'--json')
$psi=[System.Diagnostics.ProcessStartInfo]::new()
$psi.FileName=$node
$psi.WorkingDirectory=$root
$psi.UseShellExecute=$false
$psi.RedirectStandardOutput=$true
$psi.RedirectStandardError=$true
$psi.StandardOutputEncoding=[System.Text.UTF8Encoding]::new($false)
$psi.StandardErrorEncoding=[System.Text.UTF8Encoding]::new($false)
foreach($arg in $validatorArgv){$psi.ArgumentList.Add($arg)}
$proc=[System.Diagnostics.Process]::new()
$proc.StartInfo=$psi
$startedAt=(Get-Date).ToUniversalTime().ToString('o')
if(-not $proc.Start()){throw 'GENERIC_VALIDATOR_START_FAILED'}
$stdoutStream=[System.IO.MemoryStream]::new()
$stderrStream=[System.IO.MemoryStream]::new()
$stdoutTask=$proc.StandardOutput.BaseStream.CopyToAsync($stdoutStream)
$stderrTask=$proc.StandardError.BaseStream.CopyToAsync($stderrStream)
$proc.WaitForExit()
[System.Threading.Tasks.Task]::WaitAll([System.Threading.Tasks.Task[]]@($stdoutTask,$stderrTask))
[System.IO.File]::WriteAllBytes($stdoutPath,$stdoutStream.ToArray())
[System.IO.File]::WriteAllBytes($stderrPath,$stderrStream.ToArray())
$capture=[ordered]@{schemaVersion='JS_ARCHIVE_CODEX_GENERIC_VALIDATOR_PROCESS_V1';qualityContractVersion='JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';executionLine='CODEX';argv=@($node)+$validatorArgv;startedAt=$startedAt;finishedAt=(Get-Date).ToUniversalTime().ToString('o');exitCode=$proc.ExitCode;stdoutPath=$stdoutPath;stderrPath=$stderrPath;reportPath=$stdoutPath;captureMethod='PROCESS_BASESTREAM_BYTES'}
$capture | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $capturePath -Encoding utf8
Write-Output (Get-Content -Raw -LiteralPath $capturePath)


