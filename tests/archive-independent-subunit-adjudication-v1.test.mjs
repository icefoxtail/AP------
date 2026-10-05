import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adjudicateIndependentSubunitGoalsV1 } from '../archive/tools/intelligence/adjudicate-independent-subunit-goals-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'independent-subunit-adjudication', 'archive-independent-subunit-adjudication-v1.json');
const report = adjudicateIndependentSubunitGoalsV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-independent-subunit-adjudication-v1');
assert.equal(report.status, 'AI_ADJUDICATION_CANDIDATE');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.candidatePairs, 3);
assert.equal(report.totals.confirmed + report.totals.reviewRequired, report.totals.samples);
assert.ok(report.pairs.every(pair => pair.samples.every(sample => sample.productionUsable === false)));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
