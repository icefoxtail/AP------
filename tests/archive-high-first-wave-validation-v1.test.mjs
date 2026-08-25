import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateHighFirstWavePilotV1 } from '../archive/tools/intelligence/validate-high-first-wave-pilot-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'high-first-wave-validation', 'archive-high-first-wave-validation-v1.json');
const report = validateHighFirstWavePilotV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-high-first-wave-validation-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.totals.domains, 8);
assert.equal(report.totals.coverageReady + report.totals.coverageShortfall, 8);
assert.ok(report.domains.every(domain => domain.candidateReviewStatus === 'NOT_STARTED'));
assert.ok(report.domains.every(domain => domain.productionUsable === false));
assert.ok(report.domains.every(domain => domain.samples.length <= 100));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
