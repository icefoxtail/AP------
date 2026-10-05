import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '330_current_candidate_bank_manifest_r25.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '342_current_candidate_bank_validation_r25.json');
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
const errors = [];
let questionCount = 0;
let visualCount = 0;
const rows = [];
for (const file of MANIFEST.candidateFiles) {
  const source = load(file.sourcePath);
  const candidate = load(file.candidatePath);
  questionCount += candidate.questionBank.length;
  if (source.questionBank.length !== candidate.questionBank.length) errors.push(`COUNT:${file.sourcePath}`);
  for (let index = 0; index < source.questionBank.length; index += 1) {
    const a = source.questionBank[index];
    const b = candidate.questionBank[index];
    const rowErrors = [];
    if (a.id !== b.id) rowErrors.push('ORDER');
    for (const field of ['content', 'choices', 'answer', 'image', 'solution']) if (JSON.stringify(a[field] ?? null) !== JSON.stringify(b[field] ?? null)) rowErrors.push(`FIELD_DRIFT:${field}`);
    if (b.solutionImage) { visualCount += 1; if (!fs.existsSync(path.join(ROOT, b.solutionImage))) rowErrors.push('MISSING_VISUAL_ASSET'); }
    if (rowErrors.length) errors.push(`${file.sourcePath}|${a.id}:${rowErrors.join(',')}`);
    rows.push({ sourceJsPath: file.sourcePath, id: Number(a.id), visualBound: Boolean(b.solutionImage), errors: rowErrors, status: rowErrors.length ? 'FAIL' : 'PARITY_PASS' });
  }
}
if (questionCount !== MANIFEST.candidateQuestionCount) errors.push(`QUESTION_COUNT:${questionCount}`);
if (visualCount !== MANIFEST.visualBindingCount) errors.push(`VISUAL_COUNT:${visualCount}`);
const output = { schemaVersion: 'HS_QUADRATIC_CURRENT_CANDIDATE_BANK_VALIDATION_R25', status: errors.length ? 'CURRENT_CANDIDATE_BANK_VALIDATION_FAIL' : 'CURRENT_CANDIDATE_BANK_VALIDATED_NO_PASS', productionAuthorized: false, sourceFileCount: MANIFEST.sourceFileCount, candidateQuestionCount: questionCount, candidateVisualCount: visualCount, declaredCandidateVisualCount: MANIFEST.visualBindingCount, sourceSolutionAudit: 'reports/hs-quadratic-svg-upgrade-20260908/328_current_source_solution_static_audit_post_r24.json', candidateSolutionAudit: 'reports/hs-quadratic-svg-upgrade-20260908/331_current_candidate_solution_static_audit_r25.json', errors, rows, note: 'Current source/candidate content, choices, answer, image, solution, ordering and visual asset existence parity after source solution repair.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, sourceFileCount: output.sourceFileCount, candidateQuestionCount: output.candidateQuestionCount, candidateVisualCount: output.candidateVisualCount, errors: output.errors.length }, null, 2));
