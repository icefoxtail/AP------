import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const bundle = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v2-artifact-only-bundle.json'));
const items = Object.fromEntries(bundle.items.map((item) => [item.questionUid, { ...item, firstPassEvidenceFrozen: true }]));
const output = { evidenceVersion: 'V2_ARTIFACT_ONLY_EVIDENCE_v1', coverageCount: Object.keys(items).length, observedArtifactCount: Object.values(items).filter((item) => item.artifactExists).length, items, evidenceSha: sha256(items) };
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v2-evidence-freeze.json'), output);
console.log(JSON.stringify({ coverageCount: output.coverageCount, observedArtifactCount: output.observedArtifactCount, evidenceSha: output.evidenceSha }, null, 2));
