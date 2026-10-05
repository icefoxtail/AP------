import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { annotateSubunitGoalsV1 } from '../archive/tools/intelligence/annotate-subunit-goals-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-goal-annotations', 'archive-subunit-goal-annotations-v1.json');
const report = annotateSubunitGoalsV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-goal-annotations-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.candidatePairs, 3);
assert.equal(report.totals.samples, 54);
assert.equal(report.totals.autoPrimaryGoalCandidates + report.totals.reviewRequired, report.totals.samples);
assert.ok(report.pairs.every(pair => pair.samples.every(sample => sample.adjudication === 'PENDING_REVIEW')));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
