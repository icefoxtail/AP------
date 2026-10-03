const path = require('path');
(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m2/26_신흥중_1학기_기말_중2_기출.review2.physical-evidence.json'),
    stage: 'R2'
  });
  console.log('O20_R2_CANONICAL_GATE', JSON.stringify(report, null, 2));
  if (!report.ok) throw new Error('M2_O20_R2_GATE_FAIL:' + report.issues.join(','));
})();
