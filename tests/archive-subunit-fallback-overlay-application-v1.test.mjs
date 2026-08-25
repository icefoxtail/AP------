import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applySubunitFallbackOverlayV1 } from '../archive/tools/intelligence/apply-subunit-fallback-overlay-v1.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase3', 'fallback-safety-audit', 'archive-hierarchical-classification-with-fallback-overlay-v1.json');
const report = applySubunitFallbackOverlayV1();
const saved = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

assert.equal(report.digest, saved.digest);
assert.equal(report.schemaVersion, 'archive-hierarchical-classification-with-fallback-overlay-v1');
assert.equal(report.productionWriteAllowed, false);
assert.equal(report.overlayApplied, 28);
assert.equal(report.totals.classifiedRecords, 10498);
assert.equal(report.totals.identityFailures, 0);
assert.equal(report.totals.blockedSubUnitAssignments, 0);
assert.ok(report.records.every(record => record.classification.recommendationEligible ? record.classification.subUnitKey !== '' : true));

console.log(JSON.stringify({ ok: true, digest: report.digest, totals: report.totals }, null, 2));
