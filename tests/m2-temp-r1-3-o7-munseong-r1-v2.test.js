const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const { validateR1Evidence } = await import('../archive/tools/archive-stage-validator-r1-v2.mjs');
  const evidencePath = path.resolve('archive/data/r2e-intake/m2/24_문성중_1학기_중간_중2_기출.review1.r1-v2-evidence.json');
  const evidence = JSON.parse(fs.readFileSync(evidencePath, 'utf8'));
  const expectedQids = Array.from({ length: 23 }, (_, index) => index + 1);
  const report = validateR1Evidence({
    examUid: 'M2-1-24-MUNSUNG-1MID',
    artifactSha: '96df17151a3215e8995082b20933bf12da0e429e',
    actualArtifactSha: '96df17151a3215e8995082b20933bf12da0e429e',
    evidenceRef: 'archive/data/r2e-intake/m2/24_문성중_1학기_중간_중2_기출.review1.r1-v2-evidence.json',
    evidence,
    expectedQids,
  });
  console.log('M2_O7_TEMP_R1_3_R1_V2_REPORT=' + JSON.stringify(report));
  assert.equal(report.ok, true, JSON.stringify(report));
  assert.equal(report.disposition, 'PASS');
  assert.equal(report.denominator, 23);
  assert.equal(report.rowCount, 23);
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
