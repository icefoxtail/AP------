import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifySequentialSubunitCandidatesV1 } from '../archive/tools/intelligence/classify-sequential-subunit-candidates-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'sequential-review', 'archive-sequential-subunit-candidate-classification-v1.json');
const report = classifySequentialSubunitCandidatesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-sequential-subunit-candidate-classification-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.records, 300);
assert.equal(report.totals.independentReviewPending, 300);
assert.equal(report.records.length, 300);
assert.ok(report.records.every(record => ['CANDIDATE_REVIEW', 'CONFLICT_REVIEW', 'UNRESOLVED'].includes(record.candidateStatus)));
assert.ok(report.records.every(record => record.candidateStatus !== 'CANDIDATE_REVIEW' || record.candidateSubUnitKey));
assert.ok(report.records.every(record => record.candidateStatus !== 'CONFLICT_REVIEW' || !record.candidateSubUnitKey));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
