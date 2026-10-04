import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reviewSubunitConflictBoundariesV1 } from '../archive/tools/intelligence/review-subunit-conflict-boundaries-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-conflict-review', 'archive-subunit-conflict-review-v1.json');
const report = reviewSubunitConflictBoundariesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-conflict-review-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.ruleCount, 12);
assert.equal(report.totals.boundarySamples, 156);
assert.equal(report.totals.disagreementSamples, 112);
assert.equal(report.totals.pendingAdjudications, 268);
assert.ok(report.entries.every(entry => entry.boundary.every(item => item.adjudication === 'PENDING_REVIEW')));
assert.ok(report.entries.every(entry => entry.boundary.every(item => item.contentExcerpt.length > 0)));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
