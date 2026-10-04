import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { auditSequentialCodeificationV1 } from '../archive/tools/intelligence/audit-sequential-codeification-v1.mjs';

test('final sequential audit reconciles every eligible record without production writes', () => {
  const report = auditSequentialCodeificationV1();
  assert.equal(report.productionWriteAllowed, false);
  assert.deepEqual(report.scope, { frozenBaselineFiles: 432, frozenBaselineQuestions: 10552, excludedPostCheckpointFiles: 2, excludedPostCheckpointQuestions: 44, eligibleQueueRecords: 10498, adjudicatedRecords: 10498 });
  assert.deepEqual(report.gates, { baselineIdentityFailures: 0, sequenceContinuity: true, allBatchesComplete: true, productionWrites: false });
  assert.equal(report.sequenceGaps.length, 0);
  assert.equal(report.totals.taxonomyHoldRecords, 10093);
  const saved = JSON.parse(fs.readFileSync('archive/_generated/intelligence/phase3/sequential-review/archive-sequential-codeification-final-audit-v1.json', 'utf8'));
  assert.equal(saved.digest, report.digest);
});
