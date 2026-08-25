import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditSubunitFallbackSafetyV1 } from '../archive/tools/intelligence/audit-subunit-fallback-safety-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'fallback-safety-audit', 'archive-subunit-fallback-safety-audit-v1.json');
const overlayPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'fallback-safety-audit', 'archive-subunit-fallback-overlay-v1.json');
const report = auditSubunitFallbackSafetyV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
const overlay = JSON.parse(fs.readFileSync(overlayPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-subunit-fallback-safety-audit-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.status, 'VIOLATION_REQUIRES_OVERLAY');
assert.equal(report.totals.blockedSubUnitKeys, 12);
assert.equal(report.totals.blockedAssignments, 28);
assert.equal(overlay.productionWriteAllowed, false);
assert.equal(overlay.entries.length, 28);
assert.ok(overlay.entries.every(entry => entry.action === 'FALLBACK_TO_STANDARD_UNIT'));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
