import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Compatibility entry point retained for callers of the old S15 command.
// Counts are read from the current tracked evidence pack; this command never
// manufactures a PASS from hard-coded historical totals.
const root = process.cwd();
const evidenceDir = path.join(root, 'docs', 'evidence', 'high1-geometry-equation');
const read = (name) => JSON.parse(fs.readFileSync(path.join(evidenceDir, name), 'utf8'));
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const target = read('final_target_manifest.json');
const a = read('a_math_education_summary.json');
const b = read('b_semantic_svg_summary.json');
const c = read('c_browser_summary.json');
const parity = read('production_parity_summary.json');
const diffLock = read('diff_lock_summary.json');
const agents = read('independent_agent_reviews.json');
const assetExpected = new Set(target.rows.map((row) => row.solutionImageRef).filter(Boolean)).size;
const assetObserved = b.observedAssetCount;
const gates = {
  targetScope: target.targetCountObserved === target.targetCountExpected,
  A: a.status === 'PASS' && agents.A?.status === 'PASS',
  B: b.status === 'PASS' && assetObserved === assetExpected,
  C: c.status === 'PASS',
  productionParity: parity.status === 'PASS',
  diffLock: diffLock.status === 'PASS',
};
const geometryPass = Object.values(gates).every(Boolean);
const final = {
  schemaVersion: 'MOTHER_FINAL_SEAL_DYNAMIC_V2_3',
  status: geometryPass ? 'GEOMETRY PASS / GLOBAL_CI_BLOCKED_UNRELATED' : 'FINAL_SEAL_HOLD',
  targetCount: target.targetCountObserved,
  expectedTargetCount: target.targetCountExpected,
  assetCount: assetObserved,
  expectedAssetCount: assetExpected,
  gates,
  releaseArtifactSha: read('release_artifact.json').releaseArtifactSha,
  reviewEvidenceSha: read('review_evidence_sha.json').REVIEW_EVIDENCE_SHA,
  sealBundleSha: read('seal_bundle_sha.json').SEAL_BUNDLE_SHA,
  globalCi: parity.globalCi,
  evidenceDigest: sha(JSON.stringify({ target, a, b, c, parity, agents })),
};
fs.writeFileSync(path.join(evidenceDir, 'mother_final_seal.json'), JSON.stringify(final, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(evidenceDir, 'mother_final_seal.md'), `# Mother Final Seal — 고1 도형의 방정식 v2.3\n\n- 상태: **${final.status}**\n- 대상: ${final.targetCount}/${final.expectedTargetCount}\n- SVG: ${final.assetCount}/${final.expectedAssetCount}\n- RELEASE_ARTIFACT_SHA: \`${final.releaseArtifactSha}\`\n- REVIEW_EVIDENCE_SHA: \`${final.reviewEvidenceSha}\`\n- SEAL_BUNDLE_SHA: \`${final.sealBundleSha}\`\n- global CI: ${final.globalCi.status}\n`, 'utf8');
console.log(JSON.stringify(final, null, 2));
