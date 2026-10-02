const path = require('path');
(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m3/22_신흥중_2학기_기말_중3_기출.review1.r11-fresh2.physical-evidence.json'),
    stage: 'R1'
  });
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
