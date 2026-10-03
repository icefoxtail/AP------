const path = require('path');
(async () => {
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const examFile = path.resolve('archive/exams/original/middle/m2/1final/25_왕의중_1학기_기말_중2_기출.js');
  for (const [stage, evidence] of [
    ['R1', 'archive/data/r2e-intake/m2/25_왕의중_1학기_기말_중2_기출.review1.physical-evidence.json'],
    ['R2', 'archive/data/r2e-intake/m2/25_왕의중_1학기_기말_중2_기출.review2.physical-evidence.json']
  ]) {
    const report = validatePhysicalEvidence({
      examFile,
      evidenceFile: path.resolve(evidence),
      stage
    });
    console.log('M2_O22_' + stage + '_CANONICAL_GATE_REPORT');
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 1;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
