const path = require('path');
(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m2/26_팔마중_1학기_기말_중2_기출.review1.physical-evidence.json'),
    stage: 'R1'
  });
  console.log('M2_O17_R1_CANONICAL_GATE_REPORT');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
