import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { reconcileArchiveBaselineV1 } from '../archive/tools/intelligence/reconcile-archive-baseline-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'baseline-reconciliation', 'archive-baseline-reconciliation-v1.json');
const exclusionsPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'baseline-reconciliation', 'archive-source-exclusions-v2.json');
const report = reconcileArchiveBaselineV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const exclusions = JSON.parse(fs.readFileSync(exclusionsPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-baseline-reconciliation-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.decision, 'EXCLUDE_POST_CHECKPOINT_FILES_UNTIL_REBASELINE');
assert.deepEqual(report.totals, {
    currentScannedFiles: 446,
    currentScannedQuestions: 10868,
    postCheckpointFiles: 8,
    postCheckpointQuestions: 178,
    reconciledScannedFiles: 438,
    reconciledScannedQuestions: 10690,
    reconciledIdentityFailures: 0
});
assert.equal(exclusions.excludedSourceArchiveFiles.length, 8);
assert.equal(exclusions.productionWriteAllowed, false);

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
