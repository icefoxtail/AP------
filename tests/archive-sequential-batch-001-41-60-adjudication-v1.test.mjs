import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adjudicateSequentialBatch0014160V1 } from '../archive/tools/intelligence/adjudicate-sequential-batch-001-41-60-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-001-41-60-adjudication-v1.json');
const report = adjudicateSequentialBatch0014160V1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-batch-001-41-60-adjudication-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.records, 20);
assert.equal(report.totals.answerRecheckConfirmed, 19);
assert.equal(report.totals.wordingReviewRequired, 1);
assert.equal(report.totals.status.CONFIRMED_DRAFT_CANDIDATE, 15);
assert.equal(report.totals.status.DRAFT_TAXONOMY_HOLD, 4);
assert.equal(report.totals.status.ANSWER_WORDING_HOLD, 1);
assert.equal(report.records[0].sequenceOrder, 41);
assert.equal(report.records.at(-1).sequenceOrder, 60);

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
