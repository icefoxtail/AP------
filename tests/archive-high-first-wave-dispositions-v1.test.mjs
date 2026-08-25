import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { finalizeHighFirstWaveDispositionsV1 } from '../archive/tools/intelligence/finalize-high-first-wave-dispositions-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'high-first-wave-dispositions', 'archive-high-first-wave-dispositions-v1.json');
const report = finalizeHighFirstWaveDispositionsV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-high-first-wave-dispositions-v1');
assert.equal(report.status, 'FALLBACK_LOCKED');
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.totals, { domains: 8, proposedOnlyFallback: 8, productionUsable: 0 });
assert.ok(report.domains.every(domain => domain.runtimeTagging === 'STANDARD_UNIT_FALLBACK'));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
