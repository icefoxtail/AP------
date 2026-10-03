const path = require('path');
(async () => {
  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m3/2mid/25_금당중_2학기_중간_중3_수학.js'),
    evidenceFile: path.resolve('archive/data/r3-intake/m3/25_금당중_2학기_중간_중3_수학.r3-r31.physical-evidence.json'),
    stage: 'R3'
  });
  console.log('O43_R3_RECHECK_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
