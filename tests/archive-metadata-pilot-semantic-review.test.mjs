import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewHighConfidencePilotCandidates } from '../archive/tools/intelligence/review-metadata-pilot-high-confidence.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reviewPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase1', 'pilot', 'review', 'high-confidence-semantic-review.json');
const review = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));

assert.equal(review.schemaVersion, 'phase1-pilot-high-confidence-review-v1');
assert.equal(review.productionWriteAllowed, false);
assert.equal(review.totals.highConfidenceCandidates, 11);
assert.equal(review.totals.reviewedHighConfidence, 11);
assert.equal(review.totals.remainingPending, 389);
assert.deepEqual(review.totals.dispositions, {
  corrected_candidate_pending_master: 1,
  partial_manual_review: 5,
  reviewed_pass: 5,
});
assert.equal(new Set(review.reviews.map(item => item.questionUid)).size, 11);
assert.equal(review.digest, reviewHighConfidencePilotCandidates().digest, 'high-confidence review ledger must be deterministic');

console.log(JSON.stringify({
  digest: review.digest,
  reviewed: review.totals.reviewedHighConfidence,
  remainingPending: review.totals.remainingPending,
  status: 'PASS',
}, null, 2));
