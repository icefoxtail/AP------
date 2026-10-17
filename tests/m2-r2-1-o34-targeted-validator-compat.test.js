const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const exam = 'archive/exams/original/middle/m2/1final/22_연향중_1학기_기말_중2_기출.js';
  const evidence = 'archive/data/r2e-intake/m2/22_연향중_1학기_기말_중2_기출.review2.targeted-evidence.r2-1-20261004-2208.json';
  const report = validatePhysicalEvidence({
    examFile: path.resolve(exam),
    evidenceFile: path.resolve(evidence),
    stage: 'R2',
  });
  console.log('M2_O34_R2_TARGETED_COMPAT_REPORT=' + JSON.stringify(report));
  assert.equal(report.ok, false, 'current full-denominator validator unexpectedly accepted targeted R2 evidence');
  assert.ok(report.issues.includes('EVIDENCE_SCHEMA_INVALID'), JSON.stringify(report));
  assert.ok(report.issues.includes('QUESTION_ROW_MISSING:q1'), JSON.stringify(report));
  assert.ok(report.issues.includes('META_ROW_MISSING:q1'), JSON.stringify(report));
  console.log('M2_O34_R2_TARGETED_VALIDATOR_GAP_CONFIRMED');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
