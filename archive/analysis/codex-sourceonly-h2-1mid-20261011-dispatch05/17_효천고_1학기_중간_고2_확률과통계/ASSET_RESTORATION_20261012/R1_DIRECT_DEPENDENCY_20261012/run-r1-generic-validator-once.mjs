import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const dir = path.resolve(root, 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012');
const js = path.resolve(root, 'archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js');
const evidence = path.join(dir, 'R1.evidence.asset-restoration.bound.json');
const stdout = path.join(dir, 'R1.generic.raw.stdout.json');
const stderr = path.join(dir, 'R1.generic.raw.stderr.txt');
const exit = path.join(dir, 'R1.generic.raw.exit.txt');
const receipt = path.join(dir, 'R1.generic.process.receipt.json');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for (const file of [stdout, stderr, exit, receipt]) if (fs.existsSync(file)) throw new Error(`OUTPUT_EXISTS:${file}`);

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
  evidence: { path: evidence, sha256: sha(evidence) },
  assetRootAbsolute: path.resolve(root, 'archive'),
  stdout: { path: stdout, sha256: crypto.createHash('sha256').update(outBytes).digest('hex'), byteLength: outBytes.length },
  stderr: { path: stderr, sha256: crypto.createHash('sha256').update(errBytes).digest('hex'), byteLength: errBytes.length },
  exitFile: { path: exit, sha256: sha(exit) }
};
fs.writeFileSync(receipt, `${JSON.stringify(processReceipt, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(processReceipt, null, 2));
if (exitCode !== 0) process.exitCode = exitCode;
