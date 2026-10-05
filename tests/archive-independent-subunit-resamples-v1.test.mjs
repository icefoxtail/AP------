import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resampleIndependentSubunitGoalsV1 } from '../archive/tools/intelligence/resample-independent-subunit-goals-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'independent-subunit-resamples', 'archive-independent-subunit-resamples-v1.json');
const report = resampleIndependentSubunitGoalsV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-independent-subunit-resamples-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.candidatePairs, 3);
for (const pair of report.pairs) {
    const roles = [...Object.values(pair.strongByGoal), pair.boundary, pair.disagreement];
    for (const role of roles) {
        assert.equal(new Set(role.map(sample => sample.questionUid)).size, role.length);
        assert.ok(role.every(sample => sample.adjudication === 'PENDING_REVIEW'));
    }
}
assert.equal(report.totals.uniqueSamples, new Set(report.pairs.flatMap(pair => [...Object.values(pair.strongByGoal).flat(), ...pair.boundary, ...pair.disagreement]).map(sample => sample.questionUid)).size);

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
