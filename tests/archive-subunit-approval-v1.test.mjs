import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { approveSubunitCandidatesV1 } from '../archive/tools/intelligence/approve-subunit-candidates-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'subunit-approval', 'archive-subunit-approval-v1.json');
const report = approveSubunitCandidatesV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.productionWriteAllowed, false);
assert.deepEqual(report.approvals.map(item => item.subUnitKey), ['M2-01-REPEATING_DECIMAL', 'M2-06-PARALLEL_LENGTH_RATIO']);
assert.equal(report.totals.approved, 2);
assert.equal(report.totals.missingFromMaster, 0);
assert.ok(report.approvals.every(item => item.status === 'APPROVED' && item.alreadyInProductionMaster));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
