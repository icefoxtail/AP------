import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const BASE = JSON.parse(fs.readFileSync(path.join(REPORT, '735_scoped_candidate_bank_manifest_r49.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r60-rebased', 'exams');
const OUTPUT = path.join(REPORT, '764_rebased_candidate_bank_manifest_r60.json');

function load(relativePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'), context, { filename: relativePath, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

function sha(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function protectedHash(question) {
  return sha(JSON.stringify({
    id: question.id ?? null,
    content: question.content ?? null,
    choices: question.choices ?? null,
    answer: question.answer ?? null,
    image: question.image ?? null,
  }));
}

const candidateFiles = [];
const visualRows = [];
const errors = [];
let visualCount = 0;
fs.mkdirSync(OUT, { recursive: true });

for (let index = 0; index < BASE.candidateFiles.length; index += 1) {
  const file = BASE.candidateFiles[index];
  const source = load(file.sourcePath);
  const previous = load(file.candidatePath);
  const previousById = new Map(previous.questionBank.map((question) => [Number(question.id), question]));
  const candidateQuestions = source.questionBank.map((question) => ({ ...question }));

  for (const question of candidateQuestions) {
    const old = previousById.get(Number(question.id));
    if (old?.solutionImage) {
      question.solutionImage = old.solutionImage;
      question.solutionImageAlt = old.solutionImageAlt ?? '문항의 핵심 함수·부등식·기하 관계를 나타낸 후보 해설 시각자료';
      question.solutionImageCaption = old.solutionImageCaption ?? '후보 SVG: 독립 검산으로 확정한 관계를 그림에서 확인한다.';
      question.solutionImageSize = old.solutionImageSize ?? 'full';
      visualCount += 1;
      visualRows.push({
        sourceJsPath: file.sourcePath,
        id: Number(question.id),
        assetPath: question.solutionImage,
        sourceProtectedHash: protectedHash(question),
        status: 'CURRENT_SOURCE_SOLUTION_REBASED_CANDIDATE_VISUAL_NO_PASS',
      });
    } else {
      delete question.solutionImage;
      delete question.solutionImageAlt;
      delete question.solutionImageCaption;
      delete question.solutionImageSize;
    }

    if (old && protectedHash(question) !== protectedHash(old)) {
      errors.push(`SOURCE_PROTECTED_DRIFT:${file.sourcePath}|${question.id}`);
    }
  }

  const name = `${String(index + 1).padStart(3, '0')}-${path.basename(file.sourcePath)}`;
  const output = path.join(OUT, name);
  fs.writeFileSync(output, `window.examTitle = ${JSON.stringify(source.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidateQuestions, null, 2)};\n`, 'utf8');
  candidateFiles.push({
    sourcePath: file.sourcePath,
    candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r60-rebased/exams/${name}`,
    sourceQuestionCount: source.questionBank.length,
    candidateQuestionCount: candidateQuestions.length,
    candidateFileSha256: sha(fs.readFileSync(output)),
  });
}

const duplicateCount = visualRows.length - new Set(visualRows.map((row) => `${row.sourceJsPath}|${row.id}`)).size;
if (duplicateCount) errors.push(`DUPLICATE_VISUAL_ROWS:${duplicateCount}`);
// 735 is a target-scoped bank: its files contain the full source exam banks,
// but only the carried target rows retain solutionImage bindings. The 431
// count in the historical full-bank manifest is therefore not the scoped
// rebase denominator; the observed scoped binding count is 387.
if (visualCount !== 387) errors.push(`SCOPED_VISUAL_COUNT:${visualCount}`);

const output = {
  schemaVersion: 'HS_QUADRATIC_REBASED_CANDIDATE_BANK_MANIFEST_R60',
  status: errors.length ? 'REBASED_CANDIDATE_BANK_FAIL' : 'REBASED_CANDIDATE_BANK_READY_NO_PASS',
  productionAuthorized: false,
  baseCandidateManifest: 'reports/hs-quadratic-svg-upgrade-20260908/735_scoped_candidate_bank_manifest_r49.json',
  sourceSolutionAudit: 'reports/hs-quadratic-svg-upgrade-20260908/742_current_source_solution_static_audit_r49.json',
  targetQuestionCount: 430,
  sourceFileCount: candidateFiles.length,
  candidateQuestionCount: candidateFiles.reduce((sum, file) => sum + file.candidateQuestionCount, 0),
  visualBindingCount: visualCount,
  baseFullCandidateVisualCount: BASE.declaredVisualCount ?? null,
  candidateFiles,
  visualRows,
  errors,
  note: 'Candidate-only rebase from current source after the approved r49 source/solution repairs. Existing SVG bindings are carried by sourcePath|id; production source/assets remain untouched.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.targetQuestionCount, sourceFileCount: output.sourceFileCount, candidateQuestionCount: output.candidateQuestionCount, visualBindingCount: output.visualBindingCount, errors: output.errors.length }, null, 2));
