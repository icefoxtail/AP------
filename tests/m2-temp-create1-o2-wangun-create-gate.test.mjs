import assert from 'node:assert/strict';
import path from 'node:path';
import { validatePhysicalEvidence } from '../archive/tools/review-evidence-gate.mjs';

const exam = 'archive/exams/original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js';
const evidence = 'archive/data/r2e-intake/m2/25_왕운중_1학기_중간_중2_기출.create.physical-evidence.json';
const report = validatePhysicalEvidence({
  examFile: path.resolve(exam),
  evidenceFile: path.resolve(evidence),
  stage: 'CREATE',
});

assert.equal(report.ok, true, JSON.stringify(report));
assert.equal(report.disposition, 'PASS_WITH_ITEM_HOLDS');
assert.equal(report.questionCount, 23);
assert.deepEqual(report.itemHoldQids, [1, 3, 6, 9, 11, 14, 15]);
console.log('M2 o2 CREATE canonical gate PASS_WITH_ITEM_HOLDS');
