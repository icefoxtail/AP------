import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { adjudicateSubunitCoverageBatch001V1 } from '../archive/tools/intelligence/adjudicate-subunit-coverage-batch-001-v1.mjs';

test('coverage batch 001 produces bounded PILOT candidates without production writes', () => {
  const report = adjudicateSubunitCoverageBatch001V1();
  assert.equal(report.productionWriteAllowed, false);
  assert.equal(report.totals.records, 300);
  assert.ok(report.totals.pilotCandidates > 0);
  assert.equal(report.records.length, 300);
  assert.equal(new Set(report.records.map(record => record.reviewOrder)).size, 300);
  assert.ok(report.records.some(record => record.proposedSubUnitKey === 'M3-03-QUADRATIC_EQUATION' && record.disposition === 'PILOT_CANDIDATE'));
  assert.ok(report.records.some(record => record.disposition === 'PILOT_REVIEW_REQUIRED'));
  const saved = JSON.parse(fs.readFileSync('archive/_generated/intelligence/phase3/coverage-queue/archive-subunit-coverage-batch-001-adjudication-v1.json', 'utf8'));
  assert.equal(saved.digest, report.digest);
});
