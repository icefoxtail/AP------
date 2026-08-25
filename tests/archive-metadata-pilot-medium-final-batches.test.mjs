import assert from 'node:assert/strict';
import { reviewMediumPilotBatchThree } from '../archive/tools/intelligence/review-metadata-pilot-medium-batch-3.mjs';
import { reviewMediumPilotBatchFour } from '../archive/tools/intelligence/review-metadata-pilot-medium-batch-4.mjs';

const batchThree = reviewMediumPilotBatchThree();
assert.equal(batchThree.productionWriteAllowed, false);
assert.equal(batchThree.totals.reviewedBatchRecords, 16);
assert.equal(batchThree.totals.remainingAutoMedium, 16);
assert.equal(batchThree.totals.totalPilotReviewed, 65);
assert.equal(batchThree.totals.remainingPending, 335);
assert.deepEqual(batchThree.totals.dispositions, { partial_manual_review: 10, reviewed_pass: 6 });
assert.equal(batchThree.digest, '23d9ecdfdd129c091debd075c30957da5fd8f7587fdf2296d144be36bb3c7c44');

const batchFour = reviewMediumPilotBatchFour();
assert.equal(batchFour.productionWriteAllowed, false);
assert.equal(batchFour.totals.autoMediumCandidates, 70);
assert.equal(batchFour.totals.reviewedBatchRecords, 16);
assert.equal(batchFour.totals.totalAutoMediumReviewed, 70);
assert.equal(batchFour.totals.remainingAutoMedium, 0);
assert.equal(batchFour.totals.totalPilotReviewed, 81);
assert.equal(batchFour.totals.remainingPending, 319);
assert.deepEqual(batchFour.totals.dispositions, { partial_manual_review: 11, reviewed_pass: 5 });
assert.equal(batchFour.digest, '8bdd5945eee88224fca211b8bcc81df70f039456313d48e307fb52d565533699');

console.log(JSON.stringify({ batchThree: batchThree.digest, batchFour: batchFour.digest, totalAutoMediumReviewed: batchFour.totals.totalAutoMediumReviewed, status: 'PASS' }, null, 2));
