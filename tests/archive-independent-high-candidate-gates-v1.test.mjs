import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkIndependentHighCandidateGatesV1 } from '../archive/tools/intelligence/check-independent-high-candidate-gates-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'independent-high-candidate-gates', 'archive-independent-high-candidate-gates-v1.json');
const report = checkIndependentHighCandidateGatesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-independent-high-candidate-gates-v1');
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.totals, { domains: 8, passedAiCandidates: 0, failedClosed: 8 });
assert.ok(report.domains.every(domain => domain.gateStatus === 'FAIL_CLOSED_INDEPENDENT_HIGH'));
assert.ok(report.domains.every(domain => domain.productionUsable === false));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
