import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePhysicalEvidence } from '../archive/tools/review-evidence-gate.mjs';

test('o3 canonical R3 gate rejects exact frozen Meta scope', () => {
  const report = validatePhysicalEvidence({
    examFile: 'archive/exams/original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js',
    evidenceFile: 'archive/data/r3-intake/m3/25_왕운중_1학기_중간_중3_기출.r3.physical-evidence.json',
    stage: 'R3',
  });
  console.log(JSON.stringify({ targetCanonicalR3Gate: report }));
  assert.equal(report.ok, false);
  assert.deepEqual(report.itemHoldQids, [1,2,4,6,7,8,9,11,12,17,18,22]);
  assert.ok(report.issues.includes('R3_ITEM_HOLD_FORBIDDEN:1,2,4,6,7,8,9,11,12,17,18,22'));
});
