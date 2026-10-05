import assert from 'node:assert/strict';
import { reviewMediumPilotBatchOne } from '../archive/tools/intelligence/review-metadata-pilot-medium-batch-1.mjs';

const report = reviewMediumPilotBatchOne();

assert.equal(report.schemaVersion, 'phase1-pilot-medium-batch-1-review-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.autoMediumCandidates, 70);
assert.equal(report.totals.reviewedBatchRecords, 19);
assert.equal(report.totals.remainingAutoMedium, 51);
assert.equal(report.totals.totalPilotReviewed, 30);
assert.equal(report.totals.remainingPending, 370);
assert.deepEqual(report.totals.dispositions, {
    partial_manual_review: 10,
    reviewed_pass: 9
});
assert.deepEqual(report.totals.cohorts, {
    advanced: 3,
    subjective: 3,
    track_h1: 3,
    track_h2: 2,
    track_m2: 3,
    track_m3: 2,
    visual: 3
});
assert.equal(new Set(report.reviews.map(item => item.questionUid)).size, 19);
assert.equal(report.digest, 'd02d1df5121a022b4891e762c95c23b9fe30142f9409da5571cd56403dd61ddc');

console.log(JSON.stringify({
    digest: report.digest,
    reviewed: report.totals.reviewedBatchRecords,
    remainingPending: report.totals.remainingPending,
    status: 'PASS'
}, null, 2));
