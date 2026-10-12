import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const dir = path.resolve(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1_Q10_SOLUTION_VISUAL_REVIEW_20261012');
const js = path.resolve(root, 'archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const evidence = path.join(dir, 'R1.evidence.q10-solution-visual.bound.rev1.json');
const priorFailedEvidence = path.resolve(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.evidence.asset-restoration.bound.json');
const priorFailedReport = path.resolve(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.generic.raw.stdout.json');
const priorGoldenPass = path.resolve(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1.generic.raw.golden-refresh.stdout.json');
const priorQ10Pass = path.resolve(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1_Q10_SOLUTION_VISUAL_REVIEW_20261012/R1.generic.raw.q10-solution.stdout.json');
const stdout = path.join(dir, 'R1.generic.raw.q10-solution-durable.stdout.json');
const stderr = path.join(dir, 'R1.generic.raw.q10-solution-durable.stderr.txt');
const exit = path.join(dir, 'R1.generic.raw.q10-solution-durable.exit.txt');
const receipt = path.join(dir, 'R1.generic.process.q10-solution-durable.receipt.json');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const file of [stdout, stderr, exit, receipt]) if (fs.existsSync(file)) throw new Error(`OUTPUT_EXISTS:${file}`);
if (sha(js) !== 'eb1c15e5b1cf316bb6d521735b7a8ef879e62460bfbdc89852db52e1c1325690') throw new Error('CURRENT_SOURCE_SHA_MISMATCH');
if (sha(priorFailedEvidence) !== 'f516fdd3bca0fd55e55b5c856b3a344d3356c14a23603f7c7185e855e3c83e29') throw new Error('PRIOR_FAILED_EVIDENCE_MUTATED');
if (sha(priorFailedReport) !== '6040be9d8be0e4f85896045eda3147d6513ba6e11864afeb14bce8cbe67e021f') throw new Error('PRIOR_FAILED_REPORT_MUTATED');
if (sha(priorGoldenPass) !== '85ef8d94ee4949db5a1f19fefe53469ecdc76584102f877577b4f455860bc983') throw new Error('PRIOR_GOLDEN_REPAIR_PASS_MUTATED');
if (sha(priorQ10Pass) !== '71055479a959787483c39cd304d4091606cd1374d7a4d9ee3563c4e83e5951e1') throw new Error('PRIOR_Q10_PASS_MUTATED');

const argv = [
  'archive/tools/archive-stage-validator.mjs',
  '--exam', js,
  '--evidence', evidence,
  '--stage', 'R1',
  '--quality-contract', 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  '--execution-line', 'CODEX',
  '--asset-root', path.resolve(root, 'archive'),
  '--json'
];
const result = spawnSync(process.execPath, argv, { cwd: root, encoding: null, windowsHide: true });
const outBytes = Buffer.isBuffer(result.stdout) ? result.stdout : Buffer.from(result.stdout || '');
const errBytes = Buffer.isBuffer(result.stderr) ? result.stderr : Buffer.from(result.stderr || '');
fs.writeFileSync(stdout, outBytes, { flag: 'wx' });
fs.writeFileSync(stderr, errBytes, { flag: 'wx' });
const exitCode = result.status ?? (result.signal ? -1 : 1);
fs.writeFileSync(exit, `${exitCode}\n`, { flag: 'wx' });
const processReceipt = {
  schemaVersion: 'JS_ARCHIVE_CODEX_GENERIC_VALIDATOR_PROCESS_RECEIPT_V1',
  actualValidatorInvocation: true,
  executable: process.execPath,
  cwd: root,
  argv,
  exitCode,
  signal: result.signal || null,
  currentSourceSha256: sha(js),
  priorFailedEvidence: { path: priorFailedEvidence, sha256: sha(priorFailedEvidence) },
  priorFailedReport: { path: priorFailedReport, sha256: sha(priorFailedReport) },
  priorGoldenRepairPass: { path: priorGoldenPass, sha256: sha(priorGoldenPass) },
  priorQ10Pass: { path: priorQ10Pass, sha256: sha(priorQ10Pass) },
  evidence: { path: evidence, sha256: sha(evidence) },
  assetRootAbsolute: path.resolve(root, 'archive'),
  stdout: { path: stdout, sha256: crypto.createHash('sha256').update(outBytes).digest('hex'), byteLength: outBytes.length },
  stderr: { path: stderr, sha256: crypto.createHash('sha256').update(errBytes).digest('hex'), byteLength: errBytes.length },
  exitFile: { path: exit, sha256: sha(exit) }
};
fs.writeFileSync(receipt, `${JSON.stringify(processReceipt, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(processReceipt, null, 2));
if (exitCode !== 0) process.exitCode = exitCode;
