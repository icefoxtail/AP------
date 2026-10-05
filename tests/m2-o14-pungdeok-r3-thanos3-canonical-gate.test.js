const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validateStageEvidence } = await import('../archive/tools/archive-stage-validator.mjs');
  const report = validateStageEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r3-intake/m2/20_풍덕중_1학기_중간_중2_기출.r3-current.evidence-v2.json'),
    stage: 'R3',
  });
  console.log('M2_O14_R3_CANONICAL_REPORT=' + JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.validatorMode, 'R3_V2');
  assert.equal(report.disposition, 'PASS');
  assert.equal(report.scopeCount, 1);
  assert.equal(report.rowCount, 1);
})().catch(error => { throw error; });
