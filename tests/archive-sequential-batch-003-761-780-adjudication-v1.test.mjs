import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adjudicateSequentialBatch003761780V1 } from '../archive/tools/intelligence/adjudicate-sequential-batch-003-761-780-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-003-761-780-adjudication-v1.json');
const report = adjudicateSequentialBatch003761780V1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-batch-003-761-780-adjudication-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.records, 20);
assert.equal(report.totals.answerRecheckConfirmed, 19);
assert.equal(report.totals.wordingReviewRequired, 1);
assert.equal(report.totals.status.ANSWER_SOURCE_DEFECT_HOLD, 1);
assert.equal(report.records.find(record => record.sequenceOrder === 765)?.answerVerification, 'ANSWER_SOURCE_DEFECT_HOLD');
assert.equal(report.records[0].sequenceOrder, 761);
assert.equal(report.records.at(-1).sequenceOrder, 780);
console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
