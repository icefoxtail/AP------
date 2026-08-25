import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkSubunitConflictGatesV2 } from '../archive/tools/intelligence/check-subunit-conflict-gates-v2.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-conflict-gates', 'archive-subunit-conflict-gates-v2.json');
const report = checkSubunitConflictGatesV2();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-conflict-gates-v2');
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.totals, { pairs: 3, passedAiCandidates: 0, failedClosed: 3 });
assert.ok(report.pairs.every(pair => pair.gateStatus === 'FAIL_CLOSED_INSUFFICIENT_GOLD_COVERAGE'));
assert.ok(report.pairs.every(pair => pair.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
