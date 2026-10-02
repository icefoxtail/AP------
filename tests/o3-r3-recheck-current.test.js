const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');

(async () => {
  const examPath = 'archive/exams/original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js';
  const evidencePath = 'archive/data/r3-intake/m3/25_왕운중_1학기_중간_중3_기출.r3.physical-evidence.json';
  const code = fs.readFileSync(examPath, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { filename: examPath });
  const bank = sandbox.window.questionBank;
  assert.equal(Array.isArray(bank), true);
  assert.equal(bank.length, 24);
  const runtimeDoubleEscapeQids = [];
  for (const q of bank) {
    const vals = [q.content, q.answer, q.solution, ...(Array.isArray(q.choices) ? q.choices : [])];
    if (vals.some(v => typeof v === 'string' && v.includes('\\\\'))) runtimeDoubleEscapeQids.push(q.id);
    assert.ok(typeof q.solution === 'string' && q.solution.trim().length > 0, 'missing solution q' + q.id);
  }
  assert.deepEqual(runtimeDoubleEscapeQids, []);
  const { validatePhysicalEvidence } = await import('../archive/tools/review-evidence-gate.mjs');
  const report = validatePhysicalEvidence({ examFile: examPath, evidenceFile: evidencePath, stage: 'R3' });
  console.log(JSON.stringify({ target:'m3/o3', runtimeQuestionCount:bank.length, runtimeDoubleEscapeQids, canonicalR3Gate:report }));
  assert.equal(report.ok, false);
  assert.deepEqual(report.itemHoldQids, [1,2,4,6,7,8,9,11,12,17,18,22]);
  assert.ok(report.issues.includes('R3_ITEM_HOLD_FORBIDDEN:1,2,4,6,7,8,9,11,12,17,18,22'));
})().catch(err => { console.error(err); process.exit(1); });
