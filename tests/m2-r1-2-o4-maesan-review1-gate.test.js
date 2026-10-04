const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m2/25_매산중_1학기_중간_중2_기출.review1.physical-evidence.json'),
    stage: 'R1',
  });
  console.log('M2_O4_R1_CANONICAL_REPORT=' + JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.deepEqual(report.itemHoldQids, []);
})().catch(error => { throw error; });
