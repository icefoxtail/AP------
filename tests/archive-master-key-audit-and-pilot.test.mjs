import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditMasterKeyIntegrity } from '../archive/tools/intelligence/audit-master-key-integrity.mjs';
import { buildMetadataPilot } from '../archive/tools/intelligence/build-metadata-pilot.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const auditPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase1', 'master-audit', 'master-key-integrity-report.json');
const pilotPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase1', 'pilot', 'metadata-pilot-20260820.json');
const exclusionsPath = path.join(root, 'archive', '_generated', 'intelligence', 'phase1', 'pilot', 'source-exclusions.json');
const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const pilot = JSON.parse(fs.readFileSync(pilotPath, 'utf8'));

assert.equal(audit.schemaVersion, 'phase1-master-key-audit-v1');
assert.equal(audit.totals.documentedStandardKeys, 142);
assert.equal(audit.totals.usedOfficialKeys, 106);
assert.equal(audit.unknownUsedOfficialKeys.length, 0);
assert.equal(audit.totals.conceptMapMissingForUsed, 0);
assert.equal(audit.gateReady, true);
assert.equal(audit.digest, auditMasterKeyIntegrity().digest, 'master audit must be deterministic');

assert.equal(pilot.schemaVersion, 'phase1-metadata-pilot-v1');
assert.equal(pilot.reviewOnly, true);
assert.equal(pilot.items.length, 400);
assert.equal(new Set(pilot.items.map(item => item.questionUid)).size, 400);
assert.deepEqual(pilot.cohortCounts, {
  advanced: 50,
  subjective: 50,
  track_h1: 50,
  track_h2: 50,
  track_m1: 50,
  track_m2: 50,
  track_m3: 50,
  visual: 50,
});
assert(pilot.items.every(item => item.review.status === 'pending'));
assert(pilot.items.every(item => item.sourceContext && typeof item.sourceContext.content === 'string'));
if (fs.existsSync(exclusionsPath)) {
  const exclusions = JSON.parse(fs.readFileSync(exclusionsPath, 'utf8'));
  assert.equal(exclusions.pilotDigest, pilot.digest, 'source exclusions must name this frozen pilot');
  const excludedFiles = new Set(exclusions.excludedSourceArchiveFiles.map(item => item.sourceArchiveFile));
  assert.equal(pilot.items.some(item => excludedFiles.has(item.sourceArchiveFile)), false, 'excluded source files must not participate in the frozen pilot');
} else {
  assert.equal(pilot.digest, buildMetadataPilot().digest, 'pilot selection must be deterministic');
}

console.log(JSON.stringify({
  masterAuditDigest: audit.digest,
  pilotDigest: pilot.digest,
  pilotRecords: pilot.items.length,
  status: 'PASS',
}, null, 2));
