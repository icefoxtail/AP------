import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const REPAIRS = JSON.parse(fs.readFileSync(path.join(REPORT, '36_approved_source_repair_plan_r8.json'), 'utf8'));
const BANKS = JSON.parse(fs.readFileSync(path.join(REPORT, '41_approved_candidate_bank_manifest_r9.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '50_source_repairs_applied_r9.json');

const allowed = new Map([
  ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js|13', ['content', 'solution']],
  ['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js|17', ['choices', 'answer', 'solution']],
  ['archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js|19', ['answer', 'solution']],
  ['archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js|9', ['answer', 'solution']],
  ['archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js|15', ['answer', 'solution']]
]);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function loadCode(code, filename) { const context = { window: {} }; vm.createContext(context); vm.runInContext(code, context, { filename, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function load(relative) { return loadCode(fs.readFileSync(path.join(ROOT, relative), 'utf8'), relative); }
function beforeLoad(relative) { const code = execFileSync('git', ['show', `HEAD:${relative}`], { cwd: ROOT }); return { bytes: code, bank: loadCode(code.toString('utf8'), `HEAD:${relative}`) }; }
function fieldEqual(left, right) { return JSON.stringify(left) === JSON.stringify(right); }
function qkey(sourcePath, id) { return `${sourcePath}|${id}`; }

function main() {
  const files = [...new Set([...allowed.keys()].map(key => key.split('|')[0]))];
  const fileRows = []; const questionRows = []; const errors = [];
  for (const sourcePath of files) {
    const before = beforeLoad(sourcePath); const afterBytes = fs.readFileSync(path.join(ROOT, sourcePath)); const after = load(sourcePath);
    const targetIds = [...allowed.keys()].filter(key => key.startsWith(`${sourcePath}|`)).map(key => Number(key.split('|').at(-1)));
    const beforeById = new Map(before.bank.questionBank.map(q => [Number(q.id), q])); const afterById = new Map(after.questionBank.map(q => [Number(q.id), q]));
    const changedIds = [];
    for (const id of beforeById.keys()) {
      const oldQ = beforeById.get(id); const newQ = afterById.get(id); const key = qkey(sourcePath, id); const fields = allowed.get(key) ?? [];
      if (!newQ) { errors.push(`QUESTION_MISSING:${key}`); continue; }
      const differences = [];
      for (const field of new Set([...Object.keys(oldQ), ...Object.keys(newQ)])) if (!fieldEqual(oldQ[field], newQ[field])) differences.push(field);
      if (differences.length) changedIds.push(id);
      if (fields.length === 0 && differences.length) errors.push(`UNAPPROVED_SOURCE_CHANGE:${key}:${differences.join('|')}`);
      if (fields.length && JSON.stringify(differences.sort()) !== JSON.stringify([...fields].sort())) errors.push(`SOURCE_FIELD_SCOPE_MISMATCH:${key}:${differences.join('|')}`);
    }
    if (JSON.stringify(changedIds.sort((a, b) => a - b)) !== JSON.stringify(targetIds.sort((a, b) => a - b))) errors.push(`SOURCE_CHANGED_ID_SCOPE_MISMATCH:${sourcePath}`);
    fileRows.push({ sourceJsPath: sourcePath, beforeFileSha256: sha(before.bytes), afterFileSha256: sha(afterBytes), beforeQuestionCount: before.bank.questionBank.length, afterQuestionCount: after.questionBank.length, changedQuestionIds: changedIds, status: 'SOURCE_FILE_REPAIRED_ON_APPROVED_BRANCH' });
  }
  for (const [key, fields] of allowed) {
    const [sourcePath, idText] = [key.slice(0, key.lastIndexOf('|')), key.slice(key.lastIndexOf('|') + 1)]; const id = Number(idText);
    const after = load(sourcePath); const candidateFile = BANKS.candidateFiles.find(file => file.sourcePath === sourcePath); const candidate = load(candidateFile.candidatePath);
    const sourceQ = after.questionBank.find(q => Number(q.id) === id); const candidateQ = candidate.questionBank.find(q => Number(q.id) === id);
    const parityFields = ['content', 'choices', 'answer', 'solution'];
    const parityFailures = parityFields.filter(field => !fieldEqual(sourceQ[field], candidateQ[field]));
    if (parityFailures.length) errors.push(`SOURCE_CANDIDATE_PARITY:${key}:${parityFailures.join('|')}`);
    questionRows.push({ questionUid: `${sourcePath}|${path.basename(sourcePath, '.js')}|${id}`, sourceJsPath: sourcePath, id, approvedFields: fields, sourceCandidateParity: parityFailures.length === 0, status: parityFailures.length ? 'PARITY_FAIL' : 'PARITY_RECHECKED' });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_SOURCE_REPAIRS_APPLIED_R9', status: errors.length ? 'SOURCE_REPAIR_APPLY_VALIDATION_FAIL' : 'SOURCE_REPAIRS_APPLIED_ON_APPROVED_BRANCH_NO_FINAL_PASS', productionAuthorized: false, userApproval: '2026-09-08 user instruction to modify five source holds; q13 condition k≠0 explicitly requested', productionSourceMutationOnThisBranch: true, modifiedSourceFileCount: fileRows.length, modifiedQuestionCount: questionRows.length, fileRows, questionRows, errors, candidateParity: questionRows.every(row => row.sourceCandidateParity), note: 'Approved correctness repairs are now present in the separate branch source JS. This does not promote SVGs to production or close current provider-attested FINAL_AUDIT.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, modifiedSourceFileCount: output.modifiedSourceFileCount, modifiedQuestionCount: output.modifiedQuestionCount, candidateParity: output.candidateParity, errors: errors.length }, null, 2));
}
main();
