import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'final-validation.rev3');
fs.mkdirSync(outDir, { recursive: true });
const checks = [
  ['r1-basic-source-link-compiler', 'node', ['archive/tools/compile-r1-basic-assignment-source-links.mjs', '--manifest', 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/registration/basic-parent-source-link-compile-manifest.rev1.json', '--receipt', 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/registration/basic-parent-source-link-compile.check.receipt.rev2.json', '--check']],
  ['basic-scope-parent-links', 'node', ['archive/tools/build-basic-scope-parent-links.mjs', '--check']],
  ['archive2-catalog', 'node', ['archive/tools/build-archive2-catalog.mjs', '--check']],
  ['target-basic-eligibility', 'node', ['archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch03/registration/verify-target-basic-eligibility.mjs']],
  ['archive-registration', 'node', ['archive/tools/verify-archive-registration.mjs']],
  ['identity-contract', 'node', ['tests/archive-question-identity-contract.test.mjs']],
  ['identity-runtime', 'node', ['tests/archive-question-identity-runtime.test.mjs']],
  ['archive2-runtime-guard', 'node', ['tools/check-archive2-runtime.cjs']],
  ['git-diff-check', 'git', ['diff', '--check']],
];
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const rows = [];
for (const [name, command, args] of checks) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 32 * 1024 * 1024 });
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const stdoutPath = path.join(outDir, `${name}.stdout.txt`);
  const stderrPath = path.join(outDir, `${name}.stderr.txt`);
  fs.writeFileSync(stdoutPath, stdout, 'utf8');
  fs.writeFileSync(stderrPath, stderr, 'utf8');
  const pass = result.status === 0 && !result.error;
  rows.push({ name, command: [command, ...args].join(' '), status: pass ? 'PASS' : 'FAIL', exitCode: result.status, error: result.error?.message || '', stdoutPath: path.relative(root, stdoutPath).split(path.sep).join('/'), stdoutSha256: digest(Buffer.from(stdout, 'utf8')), stderrPath: path.relative(root, stderrPath).split(path.sep).join('/'), stderrSha256: digest(Buffer.from(stderr, 'utf8')) });
  if (!pass) break;
}
const receipt = {
  schemaVersion: 'JS_ARCHIVE_REGISTRATION_FINAL_VALIDATION_RECEIPT_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  createdAt: new Date().toISOString(),
  checks: rows,
  allPassed: rows.length === checks.length && rows.every(row => row.status === 'PASS'),
};
fs.writeFileSync(path.join(outDir, 'ROOT.registration-final-checks.receipt.json'), `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(receipt, null, 2));
if (!receipt.allPassed) process.exitCode = 1;
