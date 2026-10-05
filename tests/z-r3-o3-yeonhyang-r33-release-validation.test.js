const path = require('path');
(async () => {
  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r3-intake/m2/25_연향중_1학기_중간_중2_기출.r3-r33.physical-evidence.json'),
    stage: 'R3'
  });
  console.log('O3_R3_R33_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
