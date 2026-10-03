const path = require('path');

(async () => {
  const mod = await import('../archive/tools/review-evidence-gate.mjs');
  const report = mod.validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m3/2final/22_풍덕중_2학기_기말_중3_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m3/22_풍덕중_2학기_기말_중3_기출.review2.physical-evidence.json'),
    stage: 'R2'
  });
  console.log('O65_R2_CONTEXT_TOLERANT_CANONICAL_GATE');
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
