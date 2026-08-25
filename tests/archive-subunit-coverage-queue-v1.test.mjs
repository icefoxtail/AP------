import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSubunitCoverageQueueV1 } from '../archive/tools/intelligence/build-subunit-coverage-queue-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'coverage-queue', 'archive-subunit-coverage-queue-v1.json');
const report = buildSubunitCoverageQueueV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-coverage-queue-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.batchSize, 300);
assert.equal(report.coverage.effectiveRecords, 10498);
assert.equal(report.coverage.detailedRecords, 290);
assert.equal(report.coverage.unresolvedRecords, 10208);
assert.equal(report.coverage.semanticCandidatesInQueue, 201);
assert.equal(report.coverage.queueByReason.standard_unit_only, 9728);
assert.equal(report.coverage.queueByReason.unmapped_standard_unit, 480);
assert.equal(new Set(report.records.map(record => record.questionUid)).size, report.records.length);
assert.equal(report.records[0].reviewBatch, 1);
assert.equal(report.records[0].semanticStatus, 'standard_candidate');
assert.ok(report.records.every(record => record.reviewBatch === Math.floor((record.reviewOrder - 1) / report.batchSize) + 1));

console.log(JSON.stringify({ ok: true, digest: report.digest, coverage: report.coverage }, null, 2));
