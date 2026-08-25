import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expandArchiveSemanticV1 } from '../archive/tools/intelligence/expand-archive-semantic-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase2', 'semantic-expansion', 'archive-semantic-expansion-v1.json');
const report = expandArchiveSemanticV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest, 'semantic expansion output is deterministic');
assert.equal(report.totals.inputRecords, 10498);
assert.equal(report.totals.status.review_candidate, 296);
assert.equal(report.totals.status.unresolved, 10190);
assert.equal(report.totals.status.promote_candidate ?? 0, 0);
assert.equal(report.totals.status.standard_candidate, 12);
assert.equal(report.totals.semanticCandidates, 308);
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.records.length, 10498);
assert.equal(new Set(report.records.map(record => record.questionUid)).size, 10498);
assert.ok(report.records.every(record => !['promote_candidate'].includes(record.semanticExpansion.status)));

console.log(JSON.stringify({
    ok: true,
    digest: report.digest,
    totals: report.totals
}, null, 2));
