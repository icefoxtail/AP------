const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validateStageEvidence } = await import('../archive/tools/archive-stage-validator.mjs');
  const examFile = path.resolve('archive/fixtures/stage-validator-pilot/o6-r2-full-target.js');
  const evidenceFile = path.resolve('archive/fixtures/stage-validator-pilot/o6-r2-full-evidence.json');
  const report = validateStageEvidence({ examFile, evidenceFile, stage: 'R2' });
  console.log('M2_O6_FULL_R2=' + JSON.stringify(report));
  assert.equal(report.validatorMode, 'FULL');
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.questionCount, 23);
  assert.equal(report.itemHoldCount, 0);
  console.log('M2_O6_FULL_R2_CANONICAL_VALIDATOR_PASS');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
