import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adjudicateSequentialBatch003781800V1 } from '../archive/tools/intelligence/adjudicate-sequential-batch-003-781-800-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-003-781-800-adjudication-v1.json');
const report = adjudicateSequentialBatch003781800V1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-batch-003-781-800-adjudication-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.records, 20);
assert.equal(report.totals.answerRecheckConfirmed, 15);
assert.equal(report.totals.wordingReviewRequired, 5);
assert.equal(report.totals.status.DRAFT_TAXONOMY_HOLD, 15);
assert.equal(report.totals.status.ANSWER_SOURCE_DEFECT_HOLD, 5);
assert.equal(report.records[0].sequenceOrder, 781);
assert.equal(report.records.at(-1).sequenceOrder, 800);
assert.equal(report.records.filter(record => record.answerVerification === 'ANSWER_SOURCE_DEFECT_HOLD').length, 5);
console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
