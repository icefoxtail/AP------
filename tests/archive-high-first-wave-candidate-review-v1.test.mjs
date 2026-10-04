import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewHighFirstWaveCandidatesV1 } from '../archive/tools/intelligence/review-high-first-wave-candidates-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'high-first-wave-candidate-review', 'archive-high-first-wave-candidate-review-v1.json');
const report = reviewHighFirstWaveCandidatesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-high-first-wave-candidate-review-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.domains, 8);
assert.equal(report.totals.candidates, 28);
assert.ok(report.domains.every(domain => domain.productionUsable === false));
assert.ok(report.domains.every(domain => ['REVIEW_CANDIDATE', 'CONFLICT_OR_SHORTFALL'].includes(domain.reviewStatus)));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
