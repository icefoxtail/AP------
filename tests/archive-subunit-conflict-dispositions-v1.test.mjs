import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { finalizeSubunitConflictDispositionsV1 } from '../archive/tools/intelligence/finalize-subunit-conflict-dispositions-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-conflict-dispositions', 'archive-subunit-conflict-dispositions-v1.json');
const report = finalizeSubunitConflictDispositionsV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-conflict-dispositions-v1');
assert.equal(report.status, 'FALLBACK_LOCKED');
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.totals, { conflictPairs: 6, draftRetainedFallback: 3, standardUnitOnly: 3, productionUsable: 0 });
assert.ok(report.dispositions.every(item => item.runtimeTagging === 'STANDARD_UNIT_FALLBACK'));
assert.ok(report.dispositions.every(item => item.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
