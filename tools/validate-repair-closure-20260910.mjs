import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve('archive/_generated/nightly-h1-2sem/20260908/packages');
const reportRoot = path.resolve('archive/_generated/nightly-h1-2sem/20260908/audits');
const packageRows = [];
const issues = [];
const controlPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/;
for (const dir of fs.readdirSync(root).filter(name => name.endsWith('_EXTERNAL_REVIEW') || name.endsWith('_EXTERNAL_REVIEW_v2'))) {
  const packageRoot = path.join(root, dir);
  const js = fs.readdirSync(packageRoot).find(name => name.endsWith('.js'));
  const context = { window: {} };
  try { vm.runInNewContext(fs.readFileSync(path.join(packageRoot, js), 'utf8'), context, { timeout: 5000 }); } catch (error) { issues.push({ package: dir, kind: 'VM_LOAD', error: String(error) }); continue; }
  const bank = context.window.questionBank || [];
  const sourceIds = bank.map(q => q.sourceQuestionNo).filter(value => value != null);
  const duplicateSourceIds = sourceIds.filter((value, index) => sourceIds.indexOf(value) !== index);
  const duplicateIds = bank.map(q => q.id).filter((value, index, values) => values.indexOf(value) !== index);
  if (duplicateSourceIds.length) issues.push({ package: dir, kind: 'DUPLICATE_SOURCE_UID', values: [...new Set(duplicateSourceIds)] });
  if (duplicateIds.length) issues.push({ package: dir, kind: 'DUPLICATE_ID', values: [...new Set(duplicateIds)] });
  const bQuestions = bank.filter(q => q.variantClass === 'B');
  for (const q of bank) {
    if (q.questionType === '객관식' && q.choices.length !== 5) issues.push({ package: dir, kind: 'CHOICE_COUNT', source: q.sourceQuestionNo, count: q.choices.length });
    const text = [q.content, ...(q.choices || []), q.answer, q.solution].filter(value => typeof value === 'string').join('\n');
    if (controlPattern.test(text)) issues.push({ package: dir, kind: 'CONTROL_CHAR', source: q.sourceQuestionNo });
    if ((text.match(/\$/g) || []).length % 2) issues.push({ package: dir, kind: 'ODD_DOLLAR', source: q.sourceQuestionNo });
    if (/Source question .*unresolved|retained for full-page review/i.test(text)) issues.push({ package: dir, kind: 'PLACEHOLDER', source: q.sourceQuestionNo });
  }
  for (const q of bQuestions) {
    const authorizedPromotion = q.productionAdoptionStatus === 'AUTHORIZED_BY_USER_REQUEST'
      && q.reviewStatus === 'B_DERIVED_EXAM_PROMOTED';
    const reviewOnly = q.productionAdoptionStatus === 'NOT_AUTHORIZED';
    const reviewOnlyLegacyLineage = reviewOnly && q.sourceOriginalPreserved
      && Array.isArray(q.sourceDefectTypes) && q.sourceDefectTypes.length > 0;
    if ((!q.recoveredQuestionUid && !reviewOnlyLegacyLineage) || !q.sourceOriginalPreserved || (!authorizedPromotion && !reviewOnly)) {
      issues.push({ package: dir, kind: 'B_LINEAGE_FIELDS', source: q.sourceQuestionNo });
    }
  }
  packageRows.push({ package: dir, questionCount: bank.length, sourceIdentityCount: sourceIds.length, bReplacementCount: bQuestions.length, idsUnique: duplicateIds.length === 0, sourceUidsUnique: duplicateSourceIds.length === 0 });
}
const result = { schemaVersion: 'H1_2SEM_REPAIR_CLOSURE_AUDIT_v1', packageCount: packageRows.length, packageRows, issues, status: issues.length ? 'FAIL' : 'PASS' };
fs.mkdirSync(reportRoot, { recursive: true });
fs.writeFileSync(path.join(reportRoot, 'repair-closure-audit-20260910.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, packageCount: result.packageCount, issues: result.issues.length, bReplacementCount: packageRows.reduce((sum, row) => sum + row.bReplacementCount, 0) }, null, 2));
if (issues.length) process.exit(1);
