const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validateStageEvidence } = await import('../archive/tools/archive-stage-validator.mjs');
  const report = validateStageEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1final/22_연향중_1학기_기말_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r3-intake/m2/22_연향중_1학기_기말_중2_기출.r3-r32.physical-evidence.json'),
    stage: 'R3',
  });
  console.log('M2_O34_R3_CANONICAL_REPORT=' + JSON.stringify(report));
  assert.equal(report.validatorMode, 'FULL', JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.stage, 'R3', JSON.stringify(report));
  assert.equal(report.questionCount, 24, JSON.stringify(report));
  assert.equal(report.questionEvidenceRows, 24, JSON.stringify(report));
  assert.equal(report.metaEvidenceRows, 24, JSON.stringify(report));
  assert.equal(report.itemHoldCount, 0, JSON.stringify(report));
  assert.deepEqual(report.itemHoldQids, [], JSON.stringify(report));
  assert.equal(report.disposition, 'PASS', JSON.stringify(report));
  assert.deepEqual(report.issues, [], JSON.stringify(report));
})().catch(error => { throw error; });
