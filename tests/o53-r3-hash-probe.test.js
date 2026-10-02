const path = require('path');

(async () => {
  const root = path.resolve(__dirname, '..');
  const gate = await import('../archive/tools/review-evidence-gate.mjs');
  const report = gate.validatePhysicalEvidence({
    examFile: path.join(root, 'archive/exams/original/middle/m3/2final/25_왕운중_2학기_기말_중3_기출.js'),
    evidenceFile: path.join(root, 'archive/data/r2e-intake/m3/25_왕운중_2학기_기말_중3_기출.r3-authority.physical-evidence.json'),
    stage: 'R3'
  });
  console.log('O53_CANONICAL_GATE_REPORT=' + JSON.stringify(report));
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
