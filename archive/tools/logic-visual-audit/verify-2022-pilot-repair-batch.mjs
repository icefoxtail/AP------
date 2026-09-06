import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadExamFile } from './lib/source.mjs';
import { sha256 } from './lib/io.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const targets = [
  {
    sourceJsPath: 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js',
    qid: 17,
    expectedAction: 'REBUILD_EXISTING',
    requiredMarkers: ['(1,20)', '(2,19)', '(3,18)', '(4,17)', '(5,16)', '(6,15)', '(7,14)', '(8,13)', '(9,12)', '(10,11)', '|B₂₁|=10', 'α=20', '41'],
    forbiddenMarkers: [],
    notes: '실제 10개 중복쌍, 출력값, |B₂₁|, α, 최종값을 모두 보여야 한다.'
  },
  {
    sourceJsPath: 'archive/exams/original/high/h1/2mid/22_팔마고_2학기_중간_고1_기출.js',
    qid: 14,
    expectedAction: 'REBUILD_EXISTING',
    requiredMarkers: ['U={a,b,c,d,e,f}', 'A♥B', 'A△B', 'A∩B', 'A만', 'B만', 'ㄱ, ㄴ만 참', '2⁶=64'],
    forbiddenMarkers: ['U 밖'],
    notes: 'A♥B=(A△B)ᶜ의 네 영역을 U 내부의 명시적 경계와 함께 설명해야 한다.'
  },
  {
    sourceJsPath: 'archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js',
    qid: 20,
    expectedAction: 'REBUILD_EXISTING',
    requiredMarkers: ['(5,{1,9})', '(5,{2,8})', '(5,{3,7})', '(5,{4,6})', '(10,{1,8})', '(10,{2,7})', '(10,{3,6})', '(10,{4,5})', '(5,{1,2,7})', '(5,{1,3,6})', '(10,{1,2,6})', '(10,{1,3,5})', '(10,{2,3,4})', '8×2²=8×4=32', '5×2³=5×8=40', '32+40=72'],
    forbiddenMarkers: [],
    notes: '|S|=2와 |S|=3의 후보를 실제로 나누고 32+40=72까지 닫아야 한다.'
  }
];

function checkTarget(target) {
  const absoluteSource = path.join(ROOT, target.sourceJsPath.replaceAll('/', path.sep));
  const exam = loadExamFile(absoluteSource);
  const question = exam.questions.find((item) => Number(item.id) === target.qid);
  const issues = [];
  if (!question) return { questionUid: `${target.sourceJsPath}|${target.qid}`, status: 'FAIL', issues: ['questionMissing'] };
  const imagePath = question.solutionImage;
  if (typeof imagePath !== 'string' || !imagePath) issues.push('solutionImageMissing');
  const absoluteImage = imagePath ? path.join(ROOT, 'archive', imagePath) : null;
  if (!absoluteImage || !fs.existsSync(absoluteImage)) issues.push('solutionImageFileMissing');
  const svg = absoluteImage && fs.existsSync(absoluteImage) ? fs.readFileSync(absoluteImage, 'utf8') : '';
  for (const marker of target.requiredMarkers) if (!svg.includes(marker)) issues.push(`missingSvgMarker:${marker}`);
  for (const marker of target.forbiddenMarkers) if (svg.includes(marker)) issues.push(`forbiddenSvgMarker:${marker}`);
  if (!/<svg\b[^>]*\bviewBox=["'][^"']+["']/i.test(svg)) issues.push('viewBoxMissing');
  if (!/<title\b[^>]*>[\s\S]*?<\/title>/i.test(svg)) issues.push('titleMissing');
  if (!/<desc\b[^>]*>[\s\S]*?<\/desc>/i.test(svg)) issues.push('descMissing');
  if (/<(script|foreignObject|iframe|object|embed)\b/i.test(svg)) issues.push('unsafeSvgNode');
  if (/(?:href|xlink:href)=["'](?!#)[^"']+["']/i.test(svg)) issues.push('externalSvgReference');
  if (typeof question.solution !== 'string' || !question.solution.includes('[시각자료 읽기]')) issues.push('solutionVisualReadingSectionMissing');
  if (typeof question.solutionImageAlt !== 'string' || question.solutionImageAlt.length < 20) issues.push('specificAltMissing');
  if (typeof question.solutionImageCaption !== 'string' || question.solutionImageCaption.length < 20) issues.push('specificCaptionMissing');
  if (target.qid === 14) {
    if (!/stroke-dasharray=["'][^"']+["']/i.test(svg) || !/\bU\b/.test(svg)) issues.push('universeBoundaryNotExplicit');
  }
  return {
    questionUid: `${target.sourceJsPath}|${exam.title}|${target.qid}`,
    examId: exam.title,
    qid: target.qid,
    expectedAction: target.expectedAction,
    status: issues.length ? 'FAIL' : 'PASS',
    issues,
    solutionImage: imagePath,
    assetSha: absoluteImage && fs.existsSync(absoluteImage) ? sha256(fs.readFileSync(absoluteImage)) : null,
    visualSpecificity: issues.some((issue) => issue.includes('Marker') || issue.includes('specific')) ? 'FAIL' : 'CHECKED',
    notes: target.notes
  };
}

const results = targets.map(checkTarget);
const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_2022_SET_PILOT_REPAIR_BATCH_01',
  status: results.every((result) => result.status === 'PASS') ? 'PASS' : 'FAIL',
  productionMutationCount: 0,
  reviewMode: 'STATIC_SOURCE_SOLUTION_ASSET_PARITY; existing worktree edits reviewed, not overwritten',
  qualificationRenderStatus: 'NOT_TESTED_LOCAL_BROWSER_FILE_URL_BLOCKED',
  commonCoreDStatus: 'SEPARATE_AUTHORITY_NOT_GRANTED',
  results,
  reportSha: sha256(results)
};
fs.writeFileSync(path.join(OUT, 'phase2_2022_pilot_repair_batch_01.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const markdown = [
  '# 2022 집합 Phase 2 repair batch 01',
  '',
  `- 상태: **${output.status}**`,
  `- 대상: **${results.length}건**`,
  `- production mutation count: **${output.productionMutationCount}**`,
  `- qualification render: **${output.qualificationRenderStatus}**`,
  `- Common Core D: **${output.commonCoreDStatus}**`,
  `- report SHA: \`${output.reportSha}\``,
  '',
  ...results.map((result) => `- ${result.examId ?? result.questionUid} q${result.qid ?? ''}: **${result.status}**${result.issues?.length ? ` — ${result.issues.join(', ')}` : ''}`),
  '',
  '이 batch는 기존 작업트리의 3건을 덮어쓰지 않고 source/solution/asset parity와 SVG 정적 계약을 확인한다.',
  '정적 PASS는 독립 V1/V2/V3 semantic PASS 또는 Common Core D 실렌더 PASS를 의미하지 않는다.',
  ''
].join('\n');
fs.writeFileSync(path.join(OUT, 'phase2_2022_pilot_repair_batch_01.md'), markdown, 'utf8');
console.log(JSON.stringify({ status: output.status, resultCount: results.length, failed: results.filter((result) => result.status !== 'PASS').length, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS') process.exitCode = 1;
