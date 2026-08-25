import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resampleSubunitConflictsV1 } from '../archive/tools/intelligence/resample-subunit-conflicts-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-conflict-resamples', 'archive-subunit-conflict-resamples-v1.json');
const report = resampleSubunitConflictsV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-conflict-resamples-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.ruleCount, 12);
assert.equal(report.totals.rulesWithStrongShortfall, 5);
assert.equal(report.totals.rulesWithBoundarySamples, 12);
assert.equal(report.samples.length, 12);
assert.ok(report.samples.every(item => item.actualCounts.boundary > 0));
assert.ok(report.samples.some(item => item.actualCounts.strong < item.samplePlan.strong));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
