const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const examFile = path.resolve('archive/exams/original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js');
  const evidenceFile = path.resolve('archive/data/r2e-intake/m2/24_신흥중_1학기_중간_중2_기출c.review2.physical-evidence.json');
  const report = validatePhysicalEvidence({ examFile, evidenceFile, stage: 'R2' });
  console.log('M2_O6_R2_FULL=' + JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.equal(report.questionCount, 23);
  assert.equal(report.questionEvidenceRows, 23);
  assert.equal(report.metaEvidenceRows, 23);
  assert.equal(report.itemHoldCount, 0);
  console.log('M2_O6_R2_FULL_REVIEW_EVIDENCE_PASS');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
