import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = path.join(repoDir, 'archive/_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-operational-qa-v1.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

test('complete subunit operational QA gates pass except explicitly documented invalid source key', () => {
  assert.equal(report.productionQuestionCount, 10690);
  assert.equal(report.classificationQuestionCount, report.productionQuestionCount);
  assert.equal(report.gates.classificationNoEmptySubUnits, true);
  assert.equal(report.gates.classificationNoDefaultFallbacks, true);
  assert.equal(report.gates.productionQuestionCountMatches, true);
  assert.equal(report.gates.productionSubunitFieldsMatch, true);
  assert.equal(report.gates.rawAndUnmappedExplicitlyIsolated, true);
  assert.equal(report.gates.candidateMappedFilesByteEqual, true);
  assert.equal(report.gates.indexRegenerated, true);
  assert.equal(report.gates.noCommitOrPush, true);
  assert.deepEqual(report.masterGaps.invalidFormal, []);
});
