const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validateStageEvidence } = await import('../archive/tools/archive-stage-validator.mjs');
  const report = validateStageEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js'),
    evidenceFile: path.resolve('archive/data/r3-intake/m2/24_신흥중_1학기_중간_중2_기출c.r3-r31.physical-evidence.json'),
    stage: 'R3',
  });
  console.log('M2_O6_R3_CANONICAL_REPORT=' + JSON.stringify(report));
  assert.equal(report.validatorMode, 'FULL', JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.stage, 'R3', JSON.stringify(report));
  assert.equal(report.questionCount, 23, JSON.stringify(report));
  assert.equal(report.questionEvidenceRows, 23, JSON.stringify(report));
  assert.equal(report.metaEvidenceRows, 23, JSON.stringify(report));
  assert.equal(report.itemHoldCount, 0, JSON.stringify(report));
  assert.deepEqual(report.itemHoldQids, [], JSON.stringify(report));
  assert.equal(report.disposition, 'PASS', JSON.stringify(report));
  assert.deepEqual(report.issues, [], JSON.stringify(report));
})().catch(error => { throw error; });
