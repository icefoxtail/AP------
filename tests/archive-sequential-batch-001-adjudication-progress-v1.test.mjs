import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { summarizeSequentialBatch001AdjudicationV1 } from '../archive/tools/intelligence/summarize-sequential-batch-001-adjudication-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-adjudication-progress-v1.json');
const report = summarizeSequentialBatch001AdjudicationV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-batch-001-adjudication-progress-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.batchRecords, 300);
assert.equal(report.totals.adjudicatedRecords, 300);
assert.equal(report.totals.pendingRecords, 0);
assert.equal(report.totals.answerRecheckConfirmed, 299);
assert.equal(report.records[0].sequenceOrder, 1);
assert.equal(report.records.at(-1).sequenceOrder, 300);

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
