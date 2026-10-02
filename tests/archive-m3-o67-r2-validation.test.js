const assert = require('assert');
const { spawnSync } = require('child_process');

const exam = 'archive/exams/original/middle/m3/2final/22_연향중_2학기_기말_중3_기출.js';
const evidence = 'archive/data/r2e-intake/m3/22_연향중_2학기_기말_중3_기출.review2.meta-v2.physical-evidence.json';

const run = spawnSync(process.execPath, [
  'archive/tools/review-evidence-gate.mjs',
  '--exam', exam,
  '--evidence', evidence,
  '--stage', 'R2',
  '--json'
], { encoding: 'utf8' });

if (run.stdout) process.stdout.write(run.stdout);
if (run.stderr) process.stderr.write(run.stderr);
assert.equal(run.status, 0, 'canonical R2 review-evidence gate must PASS for o67');
const report = JSON.parse(run.stdout);
assert.equal(report.ok, true);
assert.equal(report.stage, 'R2');
assert.equal(report.questionCount, 21);
assert.equal(report.questionEvidenceRows, 21);
assert.equal(report.linkedSolutionVisualCount, 0);
assert.equal(report.visualEvidenceRows, 0);
assert.equal(report.metaEvidenceRows, 21);
assert.equal(report.itemHoldCount, 0);
assert.deepEqual(report.issues, []);
console.log('O67_R2_TARGETED_CANONICAL_GATE_PASS');
