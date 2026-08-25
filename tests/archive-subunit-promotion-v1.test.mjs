import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promoteSubunitStagesV1 } from '../archive/tools/intelligence/promote-subunit-stages-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-promotion', 'archive-subunit-promotion-v1.json');
const report = promoteSubunitStagesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.promotionOrder, ['middle-m1', 'middle-m2', 'middle-m3', 'high-first-wave']);
assert.equal(report.totals.pilotStages, 4);
assert.equal(report.totals.draftStages, 0);
assert.equal(report.totals.pilotEntries, 55);
assert.equal(report.totals.proposedHighEntries, 8);
for (const stage of report.stages.slice(0, 3)) {
    assert.equal(stage.status, 'PILOT');
    assert.ok(stage.sampleQuestionCount > 0);
    assert.ok(stage.entries.every(entry => entry.status === 'PILOT'));
}
const high = report.stages[3];
assert.equal(high.status, 'PILOT');
assert.ok(high.entries.every(entry => entry.subUnitKeyStatus === 'PROPOSED' && entry.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
