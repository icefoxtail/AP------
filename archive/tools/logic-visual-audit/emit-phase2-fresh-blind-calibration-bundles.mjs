import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const BUNDLE = path.join(OUT, 'phase2_calibration_01_blind');
fs.mkdirSync(BUNDLE, { recursive: true });
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const inventory = read('phase2_2022_set_pilot_inventory.json');
const selectedKeys = new Set([
  '22_복성고_2학기_중간_고1_기출|9',
  '22_팔마고_2학기_중간_고1_기출|18',
  '22_효천고_2학기_중간_고1_기출|10',
  '22_효천고_2학기_중간_고1_기출|11',
  '22_효천고_2학기_중간_고1_기출|12'
]);
const rows = inventory.rows.filter((row) => selectedKeys.has(`${row.examId}|${row.qid}`));
if (rows.length !== 5) throw new Error(`Calibration scope drift: ${rows.length}`);
const v1Items = rows.map((row) => ({ questionUid: row.questionUid, content: row.content, choices: row.choices, problemImageRefs: row.problemImageRefs, visibility: { answer: false, solution: false, solutionImage: false, alt: false, caption: false, previousVerdict: false, expectedFact: false } }));
const v2Items = rows.map((row) => {
  const context = { window: {} };
  const source = path.join(ROOT, row.sourceJsPath.replaceAll('/', path.sep));
  vm.runInNewContext(fs.readFileSync(source, 'utf8'), context, { timeout: 5000 });
  const question = context.window.questionBank.find((candidate) => Number(candidate.id) === Number(row.qid));
  const assetPath = question.solutionImage;
  const absolute = assetPath ? path.join(ROOT, 'archive', assetPath.replaceAll('/', path.sep)) : null;
  const bytes = absolute && fs.existsSync(absolute) ? fs.readFileSync(absolute) : null;
  return { questionUid: row.questionUid, artifactPath: assetPath, artifactExists: Boolean(bytes), artifactSha256: bytes ? sha(bytes) : null, mimeType: assetPath?.endsWith('.svg') ? 'image/svg+xml' : null, visibility: { question: false, choices: false, answer: false, solution: false, expectedFact: false, alt: false, caption: false, previousVerdict: false } };
});
const v1 = { bundleType: 'V1_SOURCE_ONLY_FRESH_BLIND_CALIBRATION', batchId: 'phase2-calibration-01', reviewerRole: 'V1_EXPECTED', priorReviewVisibility: 'NONE', items: v1Items, bundleSha: sha(v1Items) };
const v2 = { bundleType: 'V2_ARTIFACT_ONLY_FRESH_BLIND_CALIBRATION', batchId: 'phase2-calibration-01', reviewerRole: 'V2_OBSERVED', priorReviewVisibility: 'NONE', items: v2Items, bundleSha: sha(v2Items) };
fs.writeFileSync(path.join(BUNDLE, 'v1_source_only.json'), JSON.stringify(v1, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(BUNDLE, 'v2_artifact_only.json'), JSON.stringify(v2, null, 2) + '\n', 'utf8');
const manifest = { generatedAtKst: '2026-09-06', batchId: 'phase2-calibration-01', revision: 1, riskProfile: 'HIGH_RISK', plannedSize: 5, questionUids: rows.map((row) => row.questionUid), v1Bundle: 'phase2_calibration_01_blind/v1_source_only.json', v2Bundle: 'phase2_calibration_01_blind/v2_artifact_only.json', v1BundleSha: v1.bundleSha, v2BundleSha: v2.bundleSha, priorReviewVisibility: 'NONE', expectedFactProvidedToV1: false, observedFactProvidedToV2: false, status: 'READY_FOR_EXTERNAL_FRESH_BLIND_REVIEW' };
manifest.manifestSha = sha(manifest);
fs.writeFileSync(path.join(OUT, 'phase2_calibration_01_blind_bundle_manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: manifest.status, batchId: manifest.batchId, plannedSize: manifest.plannedSize, v1BundleSha: manifest.v1BundleSha, v2BundleSha: manifest.v2BundleSha, manifestSha: manifest.manifestSha }, null, 2));
