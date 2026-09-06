import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit');
const OUT = path.join(TOOL, 'reports');
const inventory = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_set_pilot_inventory.json'), 'utf8'));
const batchUids = new Set(JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_pilot_repair_batch_01.json'), 'utf8')).results.map((row) => row.questionUid));
const rows = inventory.rows.filter((row) => batchUids.has(row.questionUid));
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;

const v1Items = rows.map((row) => ({
  questionUid: row.questionUid,
  examId: row.examId,
  qid: row.qid,
  content: row.content,
  choices: row.choices,
  problemImageRefs: row.problemImageRefs,
  sharedProblemMaterial: null
}));
const v1 = {
  bundleType: 'V1_SOURCE_ONLY_LOGIC_VISUAL_PHASE2_BATCH',
  contractVersion: 'v1',
  priorReviewVisibility: 'NONE',
  visibility: { answer: false, solution: false, solutionImage: false, solutionImageAlt: false, solutionImageCaption: false, builderMetadata: false, previousVerdict: false },
  items: v1Items,
  bundleSha: sha256(JSON.stringify(v1Items))
};

const v2Items = rows.map((row) => {
  const assetPath = row.solutionImage;
  const absolute = assetPath ? path.join(ROOT, 'archive', assetPath.replaceAll('/', path.sep)) : null;
  const bytes = absolute && fs.existsSync(absolute) ? fs.readFileSync(absolute) : null;
  return {
    questionUid: row.questionUid,
    artifactPath: assetPath,
    artifactExists: Boolean(bytes),
    artifactSha256: bytes ? sha256(bytes) : null,
    mimeType: assetPath?.toLowerCase().endsWith('.svg') ? 'image/svg+xml' : 'image/png'
  };
});
const v2 = {
  bundleType: 'V2_ARTIFACT_ONLY_LOGIC_VISUAL_PHASE2_BATCH',
  contractVersion: 'v1',
  priorReviewVisibility: 'NONE',
  visibility: { question: false, choices: false, answer: false, solution: false, expectedFact: false, solutionImageAlt: false, solutionImageCaption: false, builderMetadata: false, previousVerdict: false },
  items: v2Items,
  bundleSha: sha256(JSON.stringify(v2Items))
};

fs.writeFileSync(path.join(OUT, 'phase2_v1_source_only_batch_01.json'), JSON.stringify(v1, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(OUT, 'phase2_v2_artifact_only_batch_01.json'), JSON.stringify(v2, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ v1Count: v1Items.length, v1BundleSha: v1.bundleSha, v2Count: v2Items.length, v2BundleSha: v2.bundleSha, status: 'BLIND_BATCH_BUNDLES_READY' }, null, 2));
