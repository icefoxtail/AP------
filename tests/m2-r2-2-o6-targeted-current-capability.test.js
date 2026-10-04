const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validateStageEvidence } = await import('../archive/tools/archive-stage-validator.mjs');
  const exam = 'archive/exams/original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js';
  const evidence = 'archive/data/r2e-intake/m2/24_신흥중_1학기_중간_중2_기출c.review2.targeted-evidence.r2-2-20261005-0143.json';
  const report = validateStageEvidence({
    examFile: path.resolve(exam),
    evidenceFile: path.resolve(evidence),
    stage: 'R2',
  });
  console.log('M2_O6_R2_TARGETED_CURRENT_REPORT=' + JSON.stringify(report));
  assert.equal(report.validatorMode, 'TARGETED', JSON.stringify(report));
  assert.equal(report.ok, false, 'non-empty targeted R2 scope unexpectedly closed');
  assert.equal(report.scopeCount, 2, JSON.stringify(report));
  assert.deepEqual(report.issues, ['R2_TARGETED_NONEMPTY_SCOPE_NOT_YET_SUPPORTED'], JSON.stringify(report));
  console.log('M2_O6_R2_TARGETED_CURRENT_CAPABILITY_GAP_CONFIRMED');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
