import assert from 'node:assert/strict';
import { reviewLowPilotBatchOne } from '../archive/tools/intelligence/review-metadata-pilot-low-batch-1.mjs';

const report = reviewLowPilotBatchOne();

assert.equal(report.schemaVersion, 'phase1-pilot-low-batch-1-review-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.eligibleAutoLowCandidates, 306);
assert.equal(report.totals.reviewedBatchRecords, 16);
assert.equal(report.totals.excludedPilotRecords, 0);
assert.equal(report.totals.totalPilotReviewed, 97);
assert.equal(report.totals.remainingPending, 303);
assert.deepEqual(report.totals.dispositions, { manual_classification_pending_master: 16 });
assert.equal(new Set(report.reviews.map(item => item.questionUid)).size, 16);
assert.equal(report.reviews.every(item => item.review.proposedReviewLabel), true);
assert.equal(report.digest, '8278fbe49e42bc30801d61983657588433a5b867838656e6726113c8bf4f40e3');

console.log(JSON.stringify({ digest: report.digest, reviewed: report.totals.reviewedBatchRecords, remainingPending: report.totals.remainingPending, status: 'PASS' }, null, 2));
