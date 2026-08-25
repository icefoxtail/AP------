import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { adjudicateSubunitConflictsV1 } from '../archive/tools/intelligence/adjudicate-subunit-conflicts-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-conflict-adjudication', 'archive-subunit-conflict-adjudication-v1.json');
const report = adjudicateSubunitConflictsV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-conflict-adjudication-v1');
assert.equal(report.status, 'RECOMMENDATION_ONLY');
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.totals, { conflictPairs: 6, separateCandidates: 3, heldAtStandardUnit: 3 });
assert.deepEqual(report.recommendations.map(item => item.recommendation), [
    'SEPARATE_CANDIDATE_WITH_PRIMARY_GOAL_GUARD',
    'SEPARATE_CANDIDATE_WITH_PRIMARY_GOAL_GUARD',
    'HOLD_AT_STANDARD_UNIT',
    'SEPARATE_CANDIDATE_WITH_PRIMARY_GOAL_GUARD',
    'HOLD_AT_STANDARD_UNIT',
    'HOLD_AT_STANDARD_UNIT'
]);
assert.ok(report.recommendations.every(item => item.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
