const path = require('path');
(async () => {
  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r3-intake/m2/26_팔마중_1학기_기말_중2_기출.r3-r31.physical-evidence.json'),
    stage: 'R3'
  });
  console.log('O17_R3_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
