import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildSequentialSubunitResolutionV1 } from '../archive/tools/intelligence/build-sequential-subunit-resolution-v1.mjs';

test('sequential subunit resolution ledger is complete and non-production', () => {
  const report = buildSequentialSubunitResolutionV1();
  assert.equal(report.schemaVersion, 'archive-sequential-subunit-resolution-v1');
  assert.equal(report.productionWriteAllowed, false);
  assert.deepEqual(report.scope, {
    totalRecords: 10498,
    queueRecords: 10208,
    existingSubunitRecords: 290,
    queueFirstReviewOrder: 1,
    queueLastReviewOrder: 10208,
    queueBatchCount: 35
  });
  assert.equal(report.gates.queueSequenceContiguous, true);
  assert.equal(report.gates.allBatchesPresent, true);
  assert.equal(report.gates.queueIdentityUnique, true);
  assert.equal(report.gates.totalIdentityUnique, true);
  assert.equal(report.gates.everyRecordHasResolution, true);
  assert.equal(report.gates.existingSubunitDepthValid, true);
  assert.equal(report.gates.productionWrites, false);
  assert.deepEqual(report.totals, {
    totalRecords: 10498,
    queueRecords: 10208,
    existingSubunitRetained: 290,
    pilotCandidatesObserved: 1057,
    candidateSubunitAssignedNonproduction: 1054,
    candidateNotesRetainedOnUnmapped: 3,
    fallbackOrHoldRecords: 9154,
    unmappedStandardUnitFallback: 480,
    resolutionStatus: {
      EXISTING_SUBUNIT_RETAINED: 290,
      STANDARD_UNIT_FALLBACK: 4261,
      STANDARD_UNIT_FALLBACK_EVIDENCE_MISSING: 1431,
      STANDARD_UNIT_FALLBACK_REVIEW_REQUIRED: 2982,
      SUBUNIT_CANDIDATE_NONPRODUCTION: 1054,
      UNMAPPED_STANDARD_UNIT_FALLBACK: 480
    },
    resolutionOutcome: {
      CANDIDATE_RETAINED_NONPRODUCTION: 1054,
      EXISTING_SUBUNIT_RETAINED: 290,
      STANDARD_UNIT_FALLBACK: 8674,
      UNMAPPED_STANDARD_UNIT: 480
    },
    disposition: {
      EVIDENCE_MISSING_HOLD: 1519,
      PILOT_CANDIDATE: 1057,
      PILOT_REVIEW_REQUIRED: 2999,
      STANDARD_UNIT_FALLBACK: 4633
    }
  });
  assert.equal(report.sequenceGaps.length, 0);
  assert.equal(new Set(report.records.map(record => record.questionUid)).size, 10498);
  assert.ok(report.records.every(record => record.resolutionStatus && record.resolutionOutcome));
  const saved = JSON.parse(fs.readFileSync('archive/_generated/intelligence/phase3/sequential-subunit-resolution/archive-sequential-subunit-resolution-v1.json', 'utf8'));
  assert.equal(saved.digest, report.digest);
});
