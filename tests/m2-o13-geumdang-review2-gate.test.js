const assert = require('node:assert/strict');
const path = require('node:path');
(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m2/21_금당중_1학기_중간_중2_기출.review2.physical-evidence.json'),
    stage: 'R2',
  });
  console.log('M2_O13_R2_CANONICAL_REPORT=' + JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.equal(report.questionCount, 26);
  assert.deepEqual(report.itemHoldQids, []);
})().catch(error => { throw error; });
