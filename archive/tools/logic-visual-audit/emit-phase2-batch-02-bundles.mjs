import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const targets = [
  { sourceJsPath: 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js', qid: 13 },
  { sourceJsPath: 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js', qid: 16 },
  { sourceJsPath: 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js', qid: 6 }
];
const sha256 = (value) => `sha256:${crypto.createHash('sha256').update(Buffer.isBuffer(value) || value instanceof Uint8Array ? value : typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const rows = targets.map((target) => {
  const absolute = path.join(ROOT, target.sourceJsPath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(absolute, 'utf8'), context, { timeout: 5000 });
  const question = context.window.questionBank.find((item) => Number(item.id) === target.qid);
  const examId = context.window.examTitle;
  const questionUid = `${target.sourceJsPath}|${examId}|${target.qid}`;
  return { questionUid, examId, qid: target.qid, sourceJsPath: target.sourceJsPath, content: question.content ?? '', choices: question.choices ?? [], problemImageRefs: ['problemImage', 'problemImageRef', 'image', 'imageRef', 'originalProblemImage'].map((key) => question[key]).filter((value) => typeof value === 'string' && value), solutionImage: question.solutionImage ?? null };
});
const v1Items = rows.map(({ solutionImage, ...sourceOnly }) => sourceOnly);
const v2Items = rows.map((row) => {
  const absolute = path.join(ROOT, 'archive', row.solutionImage.replaceAll('/', path.sep));
  const bytes = fs.readFileSync(absolute);
  return { questionUid: row.questionUid, artifactPath: row.solutionImage, artifactExists: true, artifactSha256: sha256(bytes), mimeType: 'image/svg+xml' };
});
const v1 = { bundleType: 'V1_SOURCE_ONLY_LOGIC_VISUAL_PHASE2_BATCH_02', contractVersion: 'v1', priorReviewVisibility: 'NONE', visibility: { answer: false, solution: false, solutionImage: false, alt: false, caption: false, builderMetadata: false, previousVerdict: false }, items: v1Items, bundleSha: sha256(v1Items) };
const v2 = { bundleType: 'V2_ARTIFACT_ONLY_LOGIC_VISUAL_PHASE2_BATCH_02', contractVersion: 'v1', priorReviewVisibility: 'NONE', visibility: { question: false, choices: false, answer: false, solution: false, expectedFact: false, alt: false, caption: false, builderMetadata: false, previousVerdict: false }, items: v2Items, bundleSha: sha256(v2Items) };
fs.writeFileSync(path.join(OUT, 'phase2_v1_source_only_batch_02.json'), JSON.stringify(v1, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(OUT, 'phase2_v2_artifact_only_batch_02.json'), JSON.stringify(v2, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'BATCH_02_BLIND_BUNDLES_READY', count: rows.length, v1BundleSha: v1.bundleSha, v2BundleSha: v2.bundleSha, uids: rows.map((row) => row.questionUid) }, null, 2));
