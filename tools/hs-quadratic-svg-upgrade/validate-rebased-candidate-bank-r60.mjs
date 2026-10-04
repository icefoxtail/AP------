import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '764_rebased_candidate_bank_manifest_r60.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '765_rebased_candidate_bank_validation_r60.json');

function load(relativePath) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'), context, { filename: relativePath, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

const errors = [];
let bankRows = 0;
let visualCount = 0;
let solutionDrift = 0;
for (const file of MANIFEST.candidateFiles) {
  const source = load(file.sourcePath);
  const candidate = load(file.candidatePath);
  bankRows += candidate.questionBank.length;
  if (source.questionBank.length !== candidate.questionBank.length) errors.push(`COUNT:${file.sourcePath}`);
  for (let index = 0; index < source.questionBank.length; index += 1) {
    const sourceQuestion = source.questionBank[index];
    const candidateQuestion = candidate.questionBank[index];
    if (sourceQuestion.id !== candidateQuestion.id) errors.push(`ORDER:${file.sourcePath}`);
    for (const field of ['content', 'choices', 'answer', 'image']) {
      if (JSON.stringify(sourceQuestion[field] ?? null) !== JSON.stringify(candidateQuestion[field] ?? null)) {
        errors.push(`SOURCE_FIELD_DRIFT:${file.sourcePath}|${sourceQuestion.id}:${field}`);
      }
    }
    if (String(sourceQuestion.solution ?? '') !== String(candidateQuestion.solution ?? '')) solutionDrift += 1;
    if (candidateQuestion.solutionImage) {
      visualCount += 1;
      if (!fs.existsSync(path.join(ROOT, candidateQuestion.solutionImage))) errors.push(`MISSING_VISUAL_ASSET:${file.sourcePath}|${candidateQuestion.id}`);
    }
  }
}
if (visualCount !== MANIFEST.visualBindingCount) errors.push(`VISUAL_COUNT:${visualCount}`);

const output = {
  schemaVersion: 'HS_QUADRATIC_REBASED_CANDIDATE_BANK_VALIDATION_R60',
  status: errors.length ? 'REBASED_CANDIDATE_BANK_VALIDATION_FAIL' : 'REBASED_CANDIDATE_BANK_VALIDATED_NO_PASS',
  productionAuthorized: false,
  sourceFileCount: MANIFEST.candidateFiles.length,
  candidateBankQuestionCount: bankRows,
  candidateVisualCount: visualCount,
  declaredCandidateVisualCount: MANIFEST.visualBindingCount,
  solutionDriftFromCurrentSource: solutionDrift,
  errors,
  note: 'Validates current-source content/choices/answer/image parity, current solution parity, row order/count, and candidate asset existence for the rebased candidate bank only.',
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, sourceFileCount: output.sourceFileCount, candidateBankQuestionCount: output.candidateBankQuestionCount, candidateVisualCount: output.candidateVisualCount, solutionDriftFromCurrentSource: output.solutionDriftFromCurrentSource, errors: output.errors.length }, null, 2));
