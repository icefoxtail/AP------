import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const BASE = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const input = JSON.parse(fs.readFileSync(path.join(OUT, 'target_inventory.json'), 'utf8'));
const internal = JSON.parse(fs.readFileSync(path.join(BASE, 'inventory_internal.json'), 'utf8'));
const bundles = path.join(OUT, 'v2-artifact-only'); fs.mkdirSync(bundles, { recursive: true });
const resolve = (rel) => { const candidates = [path.join(ROOT, rel.replaceAll('/', path.sep)), path.join(ROOT, 'archive', rel.replace(/^archive[\\/]/, '').replaceAll('/', path.sep))]; return candidates.find((candidate) => fs.existsSync(candidate)); };
const entries = [];
for (const row of input.rows) {
  const inv = internal.allRows.find((item) => item.questionUid === row.questionUid);
  const refs = (inv?.assetRefs || []).filter((ref) => ref.exists && (ref.field === 'solutionImage' || ref.field === 'image'));
  const artifacts = refs.map((ref) => { const file = resolve(ref.resolvedPath); const bytes = fs.readFileSync(file); return { field: ref.field, artifactPath: ref.resolvedPath, artifactSha256: `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`, byteCount: bytes.length, mimeType: path.extname(file).toLowerCase() === '.svg' ? 'image/svg+xml' : 'image/png' }; });
  const bundle = { bundleVersion: 'V2_ARTIFACT_ONLY_LOGIC_VISUAL_v1', questionUid: row.questionUid, artifacts, visibility: { question: false, answer: false, solution: false, expectedFact: false, alt: false, caption: false, builderMetadata: false } };
  fs.writeFileSync(path.join(bundles, `${row.questionUid.replaceAll(/[^\p{L}\p{N}_-]+/gu, '_')}.json`), JSON.stringify(bundle, null, 2) + '\n', 'utf8');
  entries.push({ questionUid: row.questionUid, artifactCount: artifacts.length, artifacts: artifacts.map((artifact) => ({ field: artifact.field, artifactPath: artifact.artifactPath, sha256: artifact.artifactSha256, mimeType: artifact.mimeType })) });
}
fs.writeFileSync(path.join(OUT, 'v2_artifact_only_manifest.json'), JSON.stringify({ generatedAtKst: '2026-09-05', targetCount: input.finalTargetCount, artifactBundleCount: entries.filter((entry) => entry.artifactCount > 0).length, entries, manifestSha: sha256(entries) }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ targetCount: input.finalTargetCount, artifactBundleCount: entries.filter((entry) => entry.artifactCount > 0).length, manifestSha: sha256(entries) }, null, 2));
