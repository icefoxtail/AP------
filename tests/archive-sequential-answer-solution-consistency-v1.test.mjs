import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifySequentialAnswerSolutionConsistencyV1 } from '../archive/tools/intelligence/verify-sequential-answer-solution-consistency-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-answer-solution-consistency-v1.json');
const report = verifySequentialAnswerSolutionConsistencyV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-answer-solution-consistency-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.records, 300);
assert.equal(report.totals.status.MATCH, 227);
assert.equal(report.totals.status.NO_EXPLICIT_CONCLUSION, 73);
assert.equal(report.totals.status.MISMATCH ?? 0, 0);
assert.equal(report.totals.status.MISSING_SOURCE_FIELD ?? 0, 0);
assert.ok(report.records.every(record => record.independentSolveRequired));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
