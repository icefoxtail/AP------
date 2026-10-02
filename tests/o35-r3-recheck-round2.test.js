const assert = require('assert/strict');

(async () => {
  const examPath = 'archive/exams/original/middle/m3/1final/22_팔마중_1학기_기말_중3_기출c.js';
  const evidencePath = 'archive/data/r3-intake/m3/22_팔마중_1학기_기말_중3_기출c.r3-recheck-round2.physical-evidence.json';
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({ examFile: examPath, evidenceFile: evidencePath, stage: 'R3' });
  console.log(JSON.stringify({ target:'m3/o35', canonicalR3Gate:report }));
  assert.equal(report.ok, true);
  assert.deepEqual(report.itemHoldQids, []);
  assert.equal(report.disposition, 'PASS');
})().catch(err => { console.error(err); process.exit(1); });
