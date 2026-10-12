import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const resolve = value => path.resolve(root, value);
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeFresh = (file, value) => {
  const absolute = resolve(file);
  if (fs.existsSync(absolute)) throw new Error(`OUTPUT_EXISTS:${file}`);
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
  return { path: absolute, sha256: sha(absolute) };
};

const dir = 'archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1_Q10_SOLUTION_VISUAL_REVIEW_20261012';
const priorEvidenceFile = resolve('archive/analysis/codex-sourceonly-h2-1mid-20261011-dispatch05/17_효천고_1학기_중간_고2_확률과통계/ASSET_RESTORATION_20261012/R1_DIRECT_DEPENDENCY_20261012/R1_Q10_SOLUTION_VISUAL_REVIEW_20261012/R1.evidence.q10-solution-visual.bound.json');
const reviewFile = resolve(`${dir}/R1.q10.solution-visual-review.rev1.json`);
const evidence = readJson(priorEvidenceFile);
const reviewSha = sha(reviewFile);
if (sha(priorEvidenceFile) !== 'd6df5dea398907e7268b1578436df3aee573c08377e92bbd798b379455aae5fc') throw new Error('PRIOR_BOUND_R1_EVIDENCE_SHA_MISMATCH');
if (reviewSha !== '7203ac851e09faa368a6f071690cb418a92ab91cc36c39c045f4c2cc9a06e2a8') throw new Error('DURABLE_Q10_REVIEW_SHA_MISMATCH');

const row = evidence.rows.find(entry => Number(entry.qid) === 10);
if (!row) throw new Error('Q10_ROW_REQUIRED');
const ref = { path: reviewFile, sha256: reviewSha };
row.axisEvidence.SOLUTION_LAYOUT.visualReview = ref;
row.axisEvidence.VISUAL_SVG.visualReview = { ...ref, disposition: 'PASS_STATIC_TRIAGE' };
row.visualEvidence = { ...ref, renderStatus: 'NOT_RUN_R1_R3_OWNS_RENDER' };
row.solutionVisualReview = { ...ref, disposition: 'PASS_STATIC_AFTER_REPAIR' };
evidence.qualityReview.q10VisualReview = { ...ref, solutionLayout: 'PASS_STATIC', visualSvg: 'STATIC_TRIAGE_REVIEWED', renderPassClaimed: false };
const out = writeFresh(`${dir}/R1.evidence.q10-solution-visual.draft.rev1.json`, evidence);
console.log(JSON.stringify({ path: out.path, sha256: out.sha256, qidScope: [10], durableCaptureReview: ref }, null, 2));
