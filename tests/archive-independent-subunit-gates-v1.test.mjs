import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkIndependentSubunitGatesV1 } from '../archive/tools/intelligence/check-independent-subunit-gates-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'independent-subunit-gates', 'archive-independent-subunit-gates-v1.json');
const report = checkIndependentSubunitGatesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-independent-subunit-gates-v1');
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.totals, { pairs: 3, passedAiCandidates: 0, failedClosed: 3 });
assert.ok(report.pairs.every(pair => pair.gateStatus === 'FAIL_CLOSED_INDEPENDENT_BOUNDARY'));
assert.ok(report.pairs.every(pair => pair.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
