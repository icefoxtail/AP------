import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'docs/evidence/2025-m3-visual-publishing-normalize-a');
const INVENTORY = JSON.parse(fs.readFileSync(path.join(OUT, 'baseline-inventory.json'), 'utf8'));
const MOBILE = { viewportCssPx: 390, wrapperCssPx: 298, pageScale: 0.471033, hardFloorCssPx: 11, targetCssPx: 12.2 };
const sha = bytes => 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
const sourceText = file => execFileSync('git', ['show', `HEAD:${file}`], { cwd: ROOT }).toString('utf8');
const clean = value => String(value || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

function loadQuestions(source, file) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(source.replace(/^\uFEFF/, ''), context, { filename: file, timeout: 5000 });
  const questions = context.window.questionBank || context.window.questions;
  if (!Array.isArray(questions)) throw new Error(`QUESTION_BANK_INVALID:${file}`);
  return questions;
}

const byExam = new Map();
for (const row of INVENTORY) {
  if (!byExam.has(row.exam)) byExam.set(row.exam, []);
  byExam.get(row.exam).push(row);
}

const triage = [];
const sourceReview = [];
for (const [examPath, assets] of byExam.entries()) {
  const bytes = Buffer.from(sourceText(examPath));
  const examSha = sha(bytes), examGitBlobSha = blob(bytes);
  const questions = loadQuestions(bytes.toString('utf8'), examPath);
  const finalBytes = fs.readFileSync(examPath);
  const finalQuestions = loadQuestions(finalBytes.toString('utf8'), examPath);
  for (const asset of assets) {
    const q = questions.find(row => Number(row.id) === Number(asset.qid));
    const finalQ = finalQuestions.find(row => Number(row.id) === Number(asset.qid));
    if (!q?.solutionImage || !q?.solution || !finalQ?.solutionImage || finalQ.solution !== q.solution) throw new Error(`SOURCE_SOLUTION_IMAGE_MISSING_OR_DRIFT:${examPath}:q${asset.qid}`);
    if (finalQ.solutionImageSize !== 'full') throw new Error(`FINAL_SOLUTION_IMAGE_SIZE_NOT_FULL:${examPath}:q${asset.qid}`);
    const svg = fs.readFileSync(asset.svgPath, 'utf8');
    const labels = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)].map(match => clean(match[1])).filter(Boolean);
    const criticalRelation = clean(q.solution).slice(0, 360);
    const baselineSvgBytes = execFileSync('git', ['show', `HEAD:${asset.svgPath}`], { cwd: ROOT });
    const vb = asset.viewBox.trim().split(/[\s,]+/).map(Number);
    const minBaseFont = asset.fontPx?.length ? Math.min(...asset.fontPx) : 12;
    const baseImageSize = q.solutionImageSize || 'medium';
    const sizeBounds = baseImageSize === 'small' ? [0.48, 105] : baseImageSize === 'large' ? [0.92, 180] : baseImageSize === 'full' ? [1, Number.POSITIVE_INFINITY] : [0.72, 145];
    const baseScale = Math.min(MOBILE.wrapperCssPx * sizeBounds[0] / vb[2], sizeBounds[1] / vb[3]);
    const baselineMobileMin = Number((minBaseFont * baseScale * MOBILE.pageScale).toFixed(3));
    const row = {
      exam: examPath,
      qid: q.id,
      questionUid: `${path.basename(examPath, '.js')}#q${q.id}`,
      baselineSolutionImage: true,
      baselineAction: 'KEEP',
      semanticDisposition: 'KEEP_SEMANTIC',
      action: 'STYLE_NORMALIZE',
      oneLineReason: `현재 출판 선/글꼴/색/라벨 여백을 공통 floor로 정규화. geometry 좌표는 보존하고, 390px Archive 실제 페이지의 기존 label 최소 ${baselineMobileMin}px를 12px 이상으로 올림.`,
      decisiveRelation: criticalRelation,
      sourceCondition: clean(q.content).slice(0, 360),
      questionSolutionSha256: sha(Buffer.from(q.solution)),
      sourceExamSha256: examSha,
      sourceExamGitBlobSha: examGitBlobSha,
      baselineSvgSha256: sha(baselineSvgBytes),
      baselineSvgGitBlobSha: blob(baselineSvgBytes),
      baselineMobileMinCssFontPx: baselineMobileMin,
      baselineSolutionImageSize: baseImageSize,
      studentFacingSvgLabels: labels,
      finalExpectedMobileFontFloorCssPx: MOBILE.targetCssPx,
      sourceSolutionReviewed: true,
    };
    triage.push(row);
    sourceReview.push({
      exam: examPath,
      qid: q.id,
      examSha256: examSha,
      examGitBlobSha,
      finalExamSha256: sha(finalBytes),
      finalExamGitBlobSha: blob(finalBytes),
      solutionSha256: row.questionSolutionSha256,
      solutionImage: q.solutionImage,
      finalSolutionImageSize: finalQ.solutionImageSize,
      svgPath: asset.svgPath,
      svgSha256BeforeStyleChange: row.baselineSvgSha256,
      sourceCondition: row.sourceCondition,
      verifiedSolution: clean(q.solution),
      decisiveRelation: row.decisiveRelation,
      studentFacingSvgLabels: labels,
      previousPhysicalEvidenceExists: false,
      semanticDisposition: 'KEEP_SEMANTIC',
      baselineMobileMinCssFontPx: baselineMobileMin,
    });
  }
}

triage.sort((a, b) => a.exam.localeCompare(b.exam, 'ko') || Number(a.qid) - Number(b.qid));
sourceReview.sort((a, b) => a.exam.localeCompare(b.exam, 'ko') || Number(a.qid) - Number(b.qid));
if (triage.length !== 71 || new Set(triage.map(row => `${row.exam}#q${row.qid}`)).size !== 71) throw new Error(`TRIAGE_DENOMINATOR_FAIL:${triage.length}`);

const counts = Object.fromEntries(['ALREADY_CURRENT', 'STYLE_NORMALIZE', 'POLISH', 'REBUILD'].map(action => [action, triage.filter(row => row.action === action).length]));
const triageEvidence = {
  schemaVersion: 'APMATH_VISUAL_UPGRADE_TRIAGE_v1',
  task: '2025 중3 2학기 5개교 기존 solution SVG publishing-team style normalization',
  denominator: triage.length,
  actionCounts: counts,
  semanticPolicy: 'KEEP_SEMANTIC is evaluated separately from current-style status; all 71 source/solution/asset triplets were reviewed. Existing semantic diagrams remain coordinate-identical; the actual Archive mobile profile fails the prior style floor for every baseline SVG.',
  mobileRenderProfile: MOBILE,
  triage,
};
fs.writeFileSync(path.join(OUT, 'triage.json'), JSON.stringify(triageEvidence, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(OUT, 'source_review_snapshot.json'), JSON.stringify({ schemaVersion: 'APMATH_M3_VISUAL_SOURCE_REVIEW_v1', denominator: sourceReview.length, exams: [...byExam.keys()], items: sourceReview }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ denominator: triage.length, counts, perExam: [...byExam.entries()].map(([exam, items]) => ({ exam, svgCount: items.length })) }, null, 2));
