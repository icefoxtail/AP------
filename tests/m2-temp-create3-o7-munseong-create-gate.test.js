const assert = require('node:assert/strict');
const path = require('node:path');

(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const exam = 'archive/exams/original/middle/m2/1mid/24_문성중_1학기_중간_중2_기출.js';
  const evidence = 'archive/data/r2e-intake/m2/24_문성중_1학기_중간_중2_기출.create.physical-evidence.json';
  const report = validatePhysicalEvidence({ examFile: path.resolve(exam), evidenceFile: path.resolve(evidence), stage: 'CREATE' });
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.equal(report.questionCount, 23);
  assert.deepEqual(report.itemHoldQids, []);
  console.log('M2 o7 CREATE canonical gate PASS');
})().catch(error => { console.error(error); process.exitCode = 1; });
