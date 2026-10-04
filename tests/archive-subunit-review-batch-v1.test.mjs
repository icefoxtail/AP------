import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSubunitReviewBatchV1 } from '../archive/tools/intelligence/build-subunit-review-batch-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'coverage-queue', 'archive-subunit-review-batch-001-v1.json');
const report = buildSubunitReviewBatchV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-review-batch-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.batchNumber, 1);
assert.equal(report.totals.records, 300);
assert.equal(report.totals.sourceJoinFailures, 0);
assert.equal(report.totals.missingSourceContent, 0);
assert.ok(report.records.every(record => record.reviewStatus === 'PENDING_INDEPENDENT_REVIEW'));
assert.ok(report.records.every(record => record.source && typeof record.source.content === 'string'));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
