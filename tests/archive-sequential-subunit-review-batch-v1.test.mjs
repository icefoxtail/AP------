import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSequentialSubunitReviewBatchV1 } from '../archive/tools/intelligence/build-sequential-subunit-review-batch-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-review-batch-001-v1.json');
const report = buildSequentialSubunitReviewBatchV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-subunit-review-batch-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.batchNumber, 1);
assert.equal(report.totals.records, 300);
assert.equal(report.totals.sourceJoinFailures, 0);
assert.equal(report.totals.missingSourceContent, 0);
assert.equal(report.records[0].sequenceOrder, 1);
assert.equal(report.records.at(-1).sequenceOrder, 300);
assert.ok(report.records.every(record => record.source && typeof record.source.content === 'string'));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals, first: report.records[0] }, null, 2));
