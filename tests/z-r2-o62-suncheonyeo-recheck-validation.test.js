const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const exam = 'archive/exams/original/middle/m3/2final/23_순천여중_2학기_기말_중3_기출.js';
const evidence = 'archive/data/r2e-intake/m3/23_순천여중_2학기_기말_중3_기출.review2.meta-v2.physical-evidence.json';
const snapshot = 'archive/data/r2e-intake/m3/23_순천여중_2학기_기말_중3_기출.review2.recheck-decision.active-v2.20261003-0844.json';
const q6svg = 'archive/assets/images/23_순천여중_2학기_기말_중3_기출/q6-solution.svg';
const sha256 = p => 'sha256:' + crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');

const hashes = { exam: sha256(exam), evidence: sha256(evidence), snapshot: sha256(snapshot), q6svg: sha256(q6svg) };
console.log('O62_R2_BINDING_HASHES');
console.log(JSON.stringify(hashes, null, 2));
if (hashes.snapshot !== 'sha256:fe30b02d5d75279050af880e07c41cbea84f9f5e96efd6856f503a0e3c04cbd9') {
  console.error('snapshot SHA mismatch');
  process.exit(1);
}
if (hashes.q6svg !== 'sha256:f757ff9b1ff7c5152ff611fd1662d68942a46315eb77b95a5433ffb65e39bcb4') {
  console.error('q6 SVG SHA mismatch');
  process.exit(1);
}

const preflight = spawnSync(process.execPath, [
  'archive/tools/solution-calibration-gate.mjs',
  '--exam', exam,
  '--evidence', evidence,
  '--stage', 'R2',
  '--preflight',
  '--json'
], { cwd: process.cwd(), encoding: 'utf8' });
console.log('O62_R2_CALIBRATION_PREFLIGHT');
if (preflight.stdout) process.stdout.write(preflight.stdout);
if (preflight.stderr) process.stderr.write(preflight.stderr);
if (preflight.status !== 0) process.exit(preflight.status || 1);

(async () => {
  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve(exam),
    evidenceFile: path.resolve(evidence),
    stage: 'R2'
  });
  console.log('O62_R2_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
