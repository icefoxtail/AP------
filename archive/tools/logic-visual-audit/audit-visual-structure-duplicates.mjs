import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, 'v2_artifact_only_manifest.json'), 'utf8'));
const structure = new Map();
for (const entry of manifest.entries.filter((item) => item.artifactCount > 0)) {
  const fingerprint = sha256(entry.artifacts.map((artifact) => ({ mimeType: artifact.mimeType, artifactSha256: artifact.sha256 })));
  if (!structure.has(fingerprint)) structure.set(fingerprint, []);
  structure.get(fingerprint).push(entry.questionUid);
}
const duplicateGroups = [...structure.entries()].filter(([, uids]) => uids.length > 1).map(([fingerprint, questionUids]) => ({ fingerprint, questionUids, status: 'REVIEW_REQUIRED_UNTIL_EXPECTED_SEMANTIC_EQUIVALENCE_PROVEN' }));
const result = { generatedAtKst: '2026-09-05', targetCount: manifest.targetCount, artifactBundleCount: manifest.artifactBundleCount, fingerprintCount: structure.size, duplicateGroupCount: duplicateGroups.length, duplicateGroups, status: duplicateGroups.length ? 'REVIEW_REQUIRED' : 'PASS_NO_IDENTICAL_ARTIFACT_DUPLICATES' };
fs.writeFileSync(path.join(OUT, 'visual_structure_duplicate_audit.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, fingerprintCount: result.fingerprintCount, duplicateGroupCount: result.duplicateGroupCount }, null, 2));
