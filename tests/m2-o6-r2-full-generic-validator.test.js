const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const { validateCompatibilityEvidence } = await import('../archive/tools/archive-stage-validator-compat-v1.mjs');
  const examFile = path.resolve('archive/exams/original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js');
  const evidenceFile = path.resolve('archive/data/r2e-intake/m2/24_신흥중_1학기_중간_중2_기출c.review2.physical-evidence.json');
  const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
  const report = validateCompatibilityEvidence({ evidence, evidenceFile, examFile, stage: 'R2' });
  console.log('M2_O6_R2_GENERIC=' + JSON.stringify(report));
  assert.equal(report.validatorMode, 'FULL');
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.deepEqual(report.issues, []);
  console.log('M2_O6_R2_GENERIC_VALIDATOR_PASS');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
