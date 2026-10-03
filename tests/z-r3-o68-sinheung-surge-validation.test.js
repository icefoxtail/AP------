const path = require('path');
(async () => {
  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m3/2final/22_신흥중_2학기_기말_중3_기출.js'),
    evidenceFile: path.resolve('archive/data/r3-intake/m3/22_신흥중_2학기_기말_중3_기출.r3-surge.physical-evidence-v3.json'),
    stage: 'R3'
  });
  console.log('O68_R3_SURGE_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (report.ok) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
