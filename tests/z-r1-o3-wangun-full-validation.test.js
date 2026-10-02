const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m3/25_왕운중_1학기_중간_중3_기출.review1.meta-v2.physical-evidence.json'),
    stage: 'R1',
  });
  console.log('O3_R1_TARGET_REPORT=' + JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
})().catch(error => {
  console.error(error);
  process.exit(1);
});
