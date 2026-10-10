'use strict';
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const uid = '22_매산고_1학기_중간_고1_기출';
const fixture = path.join(root, 'archive', 'gpt2-validation', 'H1_GPT2_20261006', 'C', 'C8');
const args = [
  path.join(root, 'archive', 'tools', 'archive-stage-validator.mjs'),
  '--quality-contract', 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  '--execution-line', 'GPT_SCHEDULED',
  '--campaign-id', 'H1_GPT2_20261006',
  '--stream', 'C',
  '--stage', 'R2',
  '--exam', path.join(fixture, uid + '.js'),
  '--evidence', path.join(fixture, 'R2_EVIDENCE.json'),
  '--asset-root', path.join(root, 'archive'),
  '--json'
];
const result = spawnSync(process.execPath, args, { encoding: 'utf8', maxBuffer: 3 * 1024 * 1024 });
console.log('H1_C8_R2_OFFICIAL_CLI_EXIT:', result.status);
console.log('H1_C8_R2_OFFICIAL_CLI_STDOUT:', result.stdout);
if (result.stderr) console.error('H1_C8_R2_OFFICIAL_CLI_STDERR:', result.stderr);
assert.equal(result.status, 0, 'Official R2 V2 CLI must exit 0');
const report = JSON.parse(result.stdout);
assert.equal(report.ok, true, JSON.stringify(report.issues));
assert.equal(report.validatorMode, 'R2_V2');
assert.equal(report.artifactContract?.active, true);
assert.deepEqual(report.issues, []);
assert.equal(report.artifactSha, 'a34a2e79ce80c134759320d9c960733d899964b3');
console.log('H1_C8_R2_NATIVE_V2_ACTIVE_ARTIFACT_GATE_PASS');
