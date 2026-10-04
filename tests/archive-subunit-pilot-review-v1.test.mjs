import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewSubunitPilotV1 } from '../archive/tools/intelligence/review-subunit-pilot-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-review', 'archive-subunit-pilot-review-v1.json');
const report = reviewSubunitPilotV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.reviewedEntries, 14);
assert.equal(report.totals.approvedCandidates, 2);
assert.equal(report.totals.taxonomyConflicts, 12);
assert.equal(report.totals.reviewRequired, 0);
assert.deepEqual(report.reviews.filter(item => item.reviewStatus === 'APPROVED_CANDIDATE').map(item => item.subUnitKey), [
    'M2-01-REPEATING_DECIMAL',
    'M2-06-PARALLEL_LENGTH_RATIO'
]);
assert.ok(report.reviews.every(item => item.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
