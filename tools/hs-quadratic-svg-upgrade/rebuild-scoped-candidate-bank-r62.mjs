import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const BASE = JSON.parse(fs.readFileSync(path.join(REPORT, '735_scoped_candidate_bank_manifest_r49.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r62-scoped-rebased', 'exams');
const OUTPUT = path.join(REPORT, '773_rebased_scoped_candidate_bank_manifest_r62.json');

function load(relativePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'), context, { filename: relativePath, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function protectedHash(question) { return sha(JSON.stringify({ id: question.id ?? null, content: question.content ?? null, choices: question.choices ?? null, answer: question.answer ?? null, image: question.image ?? null })); }

const candidateFiles = [];
const visualRows = [];
const errors = [];
let visualCount = 0;
let candidateQuestionCount = 0;
fs.mkdirSync(OUT, { recursive: true });

for (let index = 0; index < BASE.candidateFiles.length; index += 1) {
  const file = BASE.candidateFiles[index];
  const source = load(file.sourcePath);
  const previous = load(file.candidatePath);
  const sourceById = new Map(source.questionBank.map((question) => [Number(question.id), question]));
  const targetIds = previous.questionBank.map((question) => Number(question.id));
  const candidateQuestions = [];
  for (const id of targetIds) {
    const sourceQuestion = sourceById.get(id);
    const old = previous.questionBank.find((question) => Number(question.id) === id);
    if (!sourceQuestion || !old) {
      errors.push(`TARGET_ROW_MISSING:${file.sourcePath}|${id}`);
      continue;
    }
    const question = { ...sourceQuestion };
    if (old.solutionImage) {
      question.solutionImage = old.solutionImage;
      question.solutionImageAlt = old.solutionImageAlt ?? '문항의 핵심 함수·부등식·기하 관계를 나타낸 후보 해설 시각자료';
      question.solutionImageCaption = old.solutionImageCaption ?? '후보 SVG: 독립 검산으로 확정한 관계를 그림에서 확인한다.';
      question.solutionImageSize = old.solutionImageSize ?? 'full';
      visualCount += 1;
      visualRows.push({ sourceJsPath: file.sourcePath, id, assetPath: question.solutionImage, sourceProtectedHash: protectedHash(question), status: 'CURRENT_SOURCE_SOLUTION_REBASED_SCOPED_CANDIDATE_NO_PASS' });
    }
    if (protectedHash(question) !== protectedHash(old)) errors.push(`SOURCE_PROTECTED_DRIFT:${file.sourcePath}|${id}`);
    candidateQuestions.push(question);
  }
  candidateQuestionCount += candidateQuestions.length;
  const name = `${String(index + 1).padStart(3, '0')}-${path.basename(file.sourcePath)}`;
  const output = path.join(OUT, name);
  fs.writeFileSync(output, `window.examTitle = ${JSON.stringify(source.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidateQuestions, null, 2)};\n`, 'utf8');
  candidateFiles.push({ sourcePath: file.sourcePath, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r62-scoped-rebased/exams/${name}`, sourceQuestionCount: source.questionBank.length, targetQuestionCount: candidateQuestions.length, candidateFileSha256: sha(fs.readFileSync(output)) });
}

if (candidateQuestionCount !== 430) errors.push(`TARGET_QUESTION_COUNT:${candidateQuestionCount}`);
if (visualCount !== 387) errors.push(`SCOPED_VISUAL_COUNT:${visualCount}`);
const output = {
  schemaVersion: 'HS_QUADRATIC_REBASED_SCOPED_CANDIDATE_BANK_MANIFEST_R62',
  status: errors.length ? 'REBASED_SCOPED_CANDIDATE_BANK_FAIL' : 'REBASED_SCOPED_CANDIDATE_BANK_READY_NO_PASS',
  productionAuthorized: false,
  supersedes: 'reports/hs-quadratic-svg-upgrade-20260908/764_rebased_candidate_bank_manifest_r60.json',
  baseScopedCandidateManifest: 'reports/hs-quadratic-svg-upgrade-20260908/735_scoped_candidate_bank_manifest_r49.json',
  sourceSolutionAudit: 'reports/hs-quadratic-svg-upgrade-20260908/742_current_source_solution_static_audit_r49.json',
  targetQuestionCount: candidateQuestionCount,
  sourceFileCount: candidateFiles.length,
  candidateQuestionCount,
  visualBindingCount: visualCount,
  candidateFiles,
  visualRows,
  errors,
  note: 'Correct target-scoped rebase: each candidate file contains only the 430 rows already present in the r49 scoped candidate bank. The prior r60 attempt expanded each file to its full source bank and is retained only as a superseded diagnostic artifact.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.targetQuestionCount, sourceFileCount: output.sourceFileCount, visualBindingCount: output.visualBindingCount, errors: output.errors.length }, null, 2));
