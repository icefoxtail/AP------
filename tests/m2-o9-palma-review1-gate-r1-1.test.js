const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const examFile = path.resolve('archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js');
  const physicalEvidenceFile = path.resolve('archive/data/r2e-intake/m2/21_팔마중_1학기_중간_중2_기출.review1.physical-evidence.json');
  const stageEvidenceFile = path.resolve('archive/data/r2e-intake/m2/21_팔마중_1학기_중간_중2_기출.review1.stage-evidence.v2.json');

  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const physical = validatePhysicalEvidence({ examFile, evidenceFile: physicalEvidenceFile, stage: 'R1' });
  console.log('M2_O9_R1_PHYSICAL_CANONICAL_REPORT=' + JSON.stringify(physical));
  assert.equal(physical.ok, true, JSON.stringify(physical));
  assert.equal(physical.disposition, 'PASS');
  assert.deepEqual(physical.itemHoldQids, []);

  const { validateStageEvidence } = await import('../archive/tools/archive-stage-validator.mjs');
  const stage = validateStageEvidence({ examFile, evidenceFile: stageEvidenceFile, stage: 'R1' });
  console.log('M2_O9_R1_V2_CANONICAL_REPORT=' + JSON.stringify(stage));
  assert.equal(stage.ok, true, JSON.stringify(stage));
  assert.equal(stage.validatorMode, 'R1_V2');
  assert.equal(stage.denominator, 24);
  assert.equal(stage.rowCount, 24);
  assert.equal(stage.disposition, 'PASS');
  assert.deepEqual(stage.issues, []);
})().catch(error => { throw error; });
