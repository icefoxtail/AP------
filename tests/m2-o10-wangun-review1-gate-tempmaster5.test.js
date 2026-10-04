const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m2/21_왕운중_1학기_중간_중2_기출.review1.physical-evidence.json'),
    stage: 'R1',
  });
  console.log('M2_O10_R1_CANONICAL_REPORT=' + JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.deepEqual(report.itemHoldQids, []);
})().catch(error => { console.error(error); process.exitCode = 1; });
