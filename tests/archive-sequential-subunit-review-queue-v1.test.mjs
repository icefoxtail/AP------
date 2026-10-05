import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSequentialSubunitReviewQueueV1 } from '../archive/tools/intelligence/build-sequential-subunit-review-queue-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-review-queue-v1.json');
const report = buildSequentialSubunitReviewQueueV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-subunit-review-queue-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.scope.reconciledFiles, 432);
assert.equal(report.scope.reconciledQuestions, 10552);
assert.equal(report.scope.eligibleRecords, 10498);
assert.equal(report.scope.explicitExcludedRecords, 54);
assert.equal(report.scope.postCheckpointRecords, 44);
assert.equal(report.progress.detailedRecords, 290);
assert.equal(report.progress.pendingRecords, 10208);
assert.equal(report.progress.firstPendingSequence, 1);
assert.equal(report.records.length, 10498);
assert.equal(report.records[0].sequenceOrder, 1);
assert.equal(report.records.at(-1).sequenceOrder, 10498);
assert.ok(report.records.every((record, index) => record.sequenceOrder === index + 1));
assert.ok(report.records.every(record => record.reviewBatch === Math.floor((record.sequenceOrder - 1) / report.batchSize) + 1));
assert.equal(new Set(report.records.map(record => record.questionUid)).size, report.records.length);

console.log(JSON.stringify({ ok: true, digest: report.digest, scope: report.scope, progress: report.progress }, null, 2));
