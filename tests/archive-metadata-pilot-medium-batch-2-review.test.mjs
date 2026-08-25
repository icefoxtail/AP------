import assert from 'node:assert/strict';
import { reviewMediumPilotBatchTwo } from '../archive/tools/intelligence/review-metadata-pilot-medium-batch-2.mjs';

const report = reviewMediumPilotBatchTwo();

assert.equal(report.schemaVersion, 'phase1-pilot-medium-batch-2-review-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.autoMediumCandidates, 70);
assert.equal(report.totals.reviewedBatchRecords, 19);
assert.equal(report.totals.remainingAutoMedium, 32);
assert.equal(report.totals.totalPilotReviewed, 49);
assert.equal(report.totals.remainingPending, 351);
assert.deepEqual(report.totals.dispositions, {
    partial_manual_review: 11,
    reviewed_pass: 8
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
assert.equal(report.digest, 'aa8e584c6ab93d25eade451b8f7e7bd5b287488dc44b1245d05c18054a2eaac8');

console.log(JSON.stringify({ digest: report.digest, reviewed: report.totals.reviewedBatchRecords, remainingPending: report.totals.remainingPending, status: 'PASS' }, null, 2));
