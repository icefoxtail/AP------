import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '01_calibration_v1_source_only.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r3', 'exams');
const ASSET_ROOT = 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r3/assets';

function loadBank(sourcePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, sourcePath), 'utf8'), context, { filename: sourcePath, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

function protectedHash(question) {
  return crypto.createHash('sha256').update(JSON.stringify({ id: question.id ?? null, content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null })).digest('hex');
}

function caseIdFor(question) {
  if (question.id === 20 && question.sourceJsPath.includes('금당고')) return 'hs-q20-parabola-intersection';
  if (question.id === 22) return 'hs-q22-parabola-domain';
  if (question.id === 5) return 'hs-q5-parabola-minimum';
  if (question.id === 2) return 'hs-q2-absolute-inequality-number-line';
  return 'hs-q4-compound-inequality-number-line';
}

function cleanInlineSvg(solution) {
  return String(solution || '').replace(/\s*<svg\b[\s\S]*?<\/svg>\s*/gi, '\n').replace(/\n{3,}/g, '\n\n').trim();
}

function build() {
  fs.mkdirSync(OUT, { recursive: true });
  const bySource = new Map();
  for (const item of FACTS.questions) {
    if (!bySource.has(item.sourceJsPath)) bySource.set(item.sourceJsPath, []);
    bySource.get(item.sourceJsPath).push(item);
  }
  const rows = [];
  for (const [sourceJsPath, items] of bySource) {
    const source = loadBank(sourceJsPath);
    const candidate = source.questionBank.map((question) => ({ ...question }));
    for (const item of items) {
      const question = candidate.find((row) => Number(row.id) === Number(item.id));
      if (!question) throw new Error(`candidate question missing: ${sourceJsPath} q${item.id}`);
      const before = protectedHash(question);
      const caseId = caseIdFor({ id: item.id, sourceJsPath });
      question.solution = cleanInlineSvg(question.solution);
      question.solutionImage = `${ASSET_ROOT}/${caseId}.svg`;
      question.solutionImageAlt = item.expectedVisualType === 'number-line' ? '부등식 해집합의 열린 끝점과 수직선' : '이차함수의 축과 꼭짓점·교점 관계를 나타낸 해설 그래프';
      question.solutionImageCaption = item.expectedVisualType === 'number-line' ? '수직선에서 열린 끝점과 해집합의 범위를 확인한다.' : '그래프에서 축·꼭짓점·교점과 정의역 구간의 관계를 확인한다.';
      question.solutionImageSize = 'full';
      if (item.id === 20 && sourceJsPath.includes('금당고')) question.solution = question.solution.replace('이차항의 계수가 음수이므로 위로 볼록한 포물선', '이차항의 계수가 음수이므로 아래로 볼록한 포물선');
      if (item.id === 22) question.solution = question.solution.replace('이차항의 계수가 양수이므로 아래로 볼록한 포물선', '이차항의 계수가 양수이므로 위로 볼록한 포물선');
      const after = protectedHash(question);
      if (before !== after) throw new Error(`protected candidate mutation: ${sourceJsPath} q${item.id}`);
      rows.push({ questionUid: item.questionUid, sourceJsPath, id: item.id, caseId, assetPath: `${ASSET_ROOT}/${caseId}.svg`, protectedHashBefore: before, protectedHashAfter: after, status: 'CANDIDATE_ATTACHED_NO_PASS' });
    }
    const outputName = `${String(rows.length).padStart(2, '0')}-${path.basename(sourceJsPath)}`;
    const outputPath = path.join(OUT, outputName);
    fs.writeFileSync(outputPath, `window.examTitle = ${JSON.stringify(source.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate, null, 2)};\n`, 'utf8');
    rows.filter((row) => row.sourceJsPath === sourceJsPath).forEach((row) => { row.candidatePath = `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r3/exams/${outputName}`; });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_CANDIDATE_BANK_MANIFEST_V1', status: 'CANDIDATE_BANK_BUILT_NO_PASS', productionAuthorized: false, rows, note: 'Candidate banks contain only calibration attachments and two wording corrections. Production source JS is unchanged.' };
  fs.writeFileSync(path.join(REPORT, '06_calibration_candidate_bank_manifest_r3.json'), `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(output, null, 2));
}

build();
