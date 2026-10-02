const test = require('node:test');
const assert = require('node:assert/strict');

test('o67 canonical R1 physical evidence passes', async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: 'archive/exams/original/middle/m3/2final/22_연향중_2학기_기말_중3_기출.js',
    evidenceFile: 'archive/data/r2e-intake/m3/22_연향중_2학기_기말_중3_기출.r1-active-v2.physical-evidence.json',
    stage: 'R1'
  });
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.deepEqual(report.issues, []);
  assert.equal(report.disposition, 'PASS');
});
