import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { validatePhysicalEvidence } from '../archive/tools/review-evidence-gate.mjs';

test('o3 R1 full physical evidence gate', () => {
  const report = validatePhysicalEvidence({
    examFile: path.resolve('archive/exams/original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js'),
    evidenceFile: path.resolve('archive/data/r2e-intake/m3/25_왕운중_1학기_중간_중3_기출.review1.meta-v2.physical-evidence.json'),
    stage: 'R1',
  });
  assert.equal(report.ok, true, JSON.stringify(report));
});
