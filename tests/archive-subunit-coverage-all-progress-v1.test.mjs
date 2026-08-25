import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { summarizeSubunitCoverageAllV1 } from '../archive/tools/intelligence/summarize-subunit-coverage-all-v1.mjs';

test('all coverage batches 001-035 are reconciled', () => {
  const report = summarizeSubunitCoverageAllV1();
  assert.equal(report.productionWriteAllowed, false);
  assert.deepEqual(report.scope, { queueRecords: 10208, processedRecords: 10208, firstReviewOrder: 1, lastReviewOrder: 10208, batchCount: 35 });
  assert.deepEqual(report.gates, { sequenceContinuity: true, allBatchesPresent: true, productionWrites: false });
  assert.deepEqual(report.totals, { disposition: { EVIDENCE_MISSING_HOLD: 1519, PILOT_CANDIDATE: 1057, PILOT_REVIEW_REQUIRED: 2999, STANDARD_UNIT_FALLBACK: 4633 }, pilotCandidates: 1057, reviewRequired: 4518, fallbackRecords: 4633 });
  assert.equal(report.sequenceGaps.length, 0);
  const saved = JSON.parse(fs.readFileSync('archive/_generated/intelligence/phase3/coverage-queue/archive-subunit-coverage-all-progress-v1.json', 'utf8'));
  assert.equal(saved.digest, report.digest);
});
