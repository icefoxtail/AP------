import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adjudicateSequentialBatch003841860V1 } from '../archive/tools/intelligence/adjudicate-sequential-batch-003-841-860-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-batch-003-841-860-adjudication-v1.json');
const report = adjudicateSequentialBatch003841860V1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-batch-003-841-860-adjudication-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.records, 20);
assert.equal(report.totals.answerRecheckConfirmed, 19);
assert.equal(report.totals.wordingReviewRequired, 1);
assert.equal(report.totals.status.DRAFT_TAXONOMY_HOLD, 19);
assert.equal(report.totals.status.EVIDENCE_MISSING_HOLD, 1);
assert.equal(report.records.find(record => record.sequenceOrder === 850)?.answerVerification, 'EVIDENCE_MISSING_HOLD');
assert.equal(report.records[0].sequenceOrder, 841);
assert.equal(report.records.at(-1).sequenceOrder, 860);
console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
