const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1mid/24_문성중_1학기_중간_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m2/24_문성중_1학기_중간_중2_기출.review1.physical-evidence.json'),
    stage: 'R1',
  });
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS_WITH_ITEM_HOLDS');
  assert.deepEqual(report.itemHoldQids, [7]);
})().catch(error => { throw error; });
