import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adjudicateIndependentHighCandidatesV1 } from '../archive/tools/intelligence/adjudicate-independent-high-candidates-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'independent-high-candidate-adjudication', 'archive-independent-high-candidate-adjudication-v1.json');
const report = adjudicateIndependentHighCandidatesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-independent-high-candidate-adjudication-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.domains, 8);
assert.equal(report.totals.confirmed + report.totals.reviewRequired, report.totals.samples);
assert.ok(report.domains.every(domain => domain.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
