import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resampleIndependentHighCandidatesV1 } from '../archive/tools/intelligence/resample-independent-high-candidates-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'independent-high-candidate-resamples', 'archive-independent-high-candidate-resamples-v1.json');
const report = resampleIndependentHighCandidatesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-independent-high-candidate-resamples-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.domains, 8);
assert.equal(report.totals.independentReady + report.totals.independentShortfall, 8);
assert.ok(report.domains.every(domain => domain.samples.length <= 50));
assert.ok(report.domains.every(domain => domain.samples.every(sample => sample.adjudication === 'PENDING_REVIEW')));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
