import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const ARCHIVE = path.join(ROOT, 'archive');
const STAGING_ARCHIVE = path.join(REPORTS, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function shaFile(filePath) { return sha(fs.readFileSync(filePath)); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n').trim();
  return value ?? null;
}
function hashJson(value) { return sha(JSON.stringify(stable(value))); }
function readBank(sourceJsPath) {
  const filePath = path.join(STAGING_ARCHIVE, 'exams', sourceJsPath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 4000 });
  return { filePath, bank: context.window.questionBank || [] };
}
function makeProtectedPayload(question, sourceJsPath) {
  return { content: question.content || '', choices: question.choices || [], answer: question.answer || '', image: question.image || null, id: question.id, displayNo: question.displayNo || question.id, sourceIdentity: { sourceJsPath, id: question.id } };
}
function csvEscape(value) {
  const text = Array.isArray(value) ? value.join('|') : value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function writeCsv(fileName, rows) {
  const filePath = path.join(REPORTS, fileName);
  const keys = Object.keys(rows[0] || {});
  const lines = [keys.join(',')];
  for (const row of rows) lines.push(keys.map((key) => csvEscape(row[key])).join(','));
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

const sourcePaths = [...new Set(manifest.rows.map((row) => row.sourceJsPath))].sort();
const sourceBanks = new Map();
const allQuestions = new Map();
for (const sourceJsPath of sourcePaths) {
  const loaded = readBank(sourceJsPath);
  sourceBanks.set(sourceJsPath, loaded);
  for (const question of loaded.bank) allQuestions.set(`${sourceJsPath}_${question.id}`, question);
}

const targetBySource = new Map();
for (const row of manifest.rows) {
  if (!targetBySource.has(row.sourceJsPath)) targetBySource.set(row.sourceJsPath, new Set());
  targetBySource.get(row.sourceJsPath).add(row.id);
}

const dependencyRows = [];
const renderRows = [];
const protectionRows = [];
const enrichedRows = [];
for (const sourceJsPath of sourcePaths) {
  const source = sourceBanks.get(sourceJsPath);
  const targetIds = targetBySource.get(sourceJsPath) || new Set();
  const targetRows = manifest.rows.filter((row) => row.sourceJsPath === sourceJsPath);
  const imageGroups = new Map();
  for (const question of source.bank) {
    const ref = String(question.image || '').trim();
    if (ref) { if (!imageGroups.has(ref)) imageGroups.set(ref, []); imageGroups.get(ref).push(question.id); }
  }
  const sourceTargetUids = targetRows.map((row) => row.questionUid).sort();
  const protectedUids = source.bank.filter((question) => !targetIds.has(question.id)).map((question) => `${sourceJsPath}_${question.id}`).sort();
  const protectedPayload = source.bank.filter((question) => !targetIds.has(question.id)).map((question) => ({ questionUid: `${sourceJsPath}_${question.id}`, ...makeProtectedPayload(question, sourceJsPath) }));
  const outOfScopeHash = hashJson(protectedPayload);
  const sourceSha = shaFile(source.filePath);
  for (const row of targetRows) {
    const question = allQuestions.get(row.qKey);
    const imageRef = String(question?.image || '').trim();
    const sharedIds = imageRef && (imageGroups.get(imageRef) || []).length > 1 ? imageGroups.get(imageRef) : [];
    const dependencyQuestionUids = sharedIds.filter((id) => id !== question.id).map((id) => `${sourceJsPath}_${id}`).sort();
    const dependencyStatus = dependencyQuestionUids.length ? 'CLOSED_SHARED_IMAGE_DEPENDENCY' : 'CLOSED_NO_SHARED_MATERIAL_FOUND';
    dependencyRows.push({ questionUid: row.questionUid, examId: row.examId, sourceJsPath, id: row.id, groupUid: dependencyQuestionUids.length ? `${sourceJsPath}#image:${imageRef}` : `${sourceJsPath}#question:${row.id}`, sharedMaterialUid: dependencyQuestionUids.length ? imageRef : '', sharedMaterialRole: dependencyQuestionUids.length ? 'SHARED_IMAGE' : 'NONE', dependencyQuestionUids, renderSequence: source.bank.map((item) => item.id).join('|'), dependencyClosureStatus: dependencyStatus });
    enrichedRows.push({ ...row, groupUid: dependencyQuestionUids.length ? `${sourceJsPath}#image:${imageRef}` : `${sourceJsPath}#question:${row.id}`, sharedMaterialUid: dependencyQuestionUids.length ? imageRef : '', sharedMaterialRole: dependencyQuestionUids.length ? 'SHARED_IMAGE' : 'NONE', dependencyQuestionUids, renderSequence: source.bank.map((item) => item.id), dependencyClosureStatus: dependencyStatus, baselineJsSha256: sourceSha, baselineContentHash: row.contentHash, baselineQuestionHash: row.baselineQuestionHash, ORIGINAL_PROTECTED_HASH: row.protectedCoreHash, EFFECTIVE_PROTECTED_HASH: row.protectedCoreHash, problemImageRef: imageRef, solutionImageRef: question.solutionImage || '', solutionImageStatus: row.solutionImageStatus, TARGET_QUESTION_UIDS: sourceTargetUids, PROTECTED_QUESTION_UIDS: protectedUids, OUT_OF_SCOPE_BASELINE_HASH: outOfScopeHash, OUT_OF_SCOPE_FINAL_HASH: outOfScopeHash, stagingBaselineSha: null, currentReleaseArtifactSha: null, finalReleaseArtifactSha: null, reviewEvidenceSha: null, presealBundleSha: null, promotionEvidenceSha: null, sealBundleSha: null, productionPromotionStatus: 'NOT_STARTED', productionParityStatus: 'NOT_STARTED' });
  }
  renderRows.push({ examId: targetRows[0]?.examId || sourceJsPath, sourceJsPath, targetCount: targetRows.length, targetQuestionUids: sourceTargetUids, dependencyExamCount: 1, dependencyClosureStatus: 'CLOSED', renderRequired: true });
  protectionRows.push({ examId: targetRows[0]?.examId || sourceJsPath, sourceJsPath, targetQuestionUids: sourceTargetUids, protectedQuestionUids: protectedUids, outOfScopeBaselineHash: outOfScopeHash, outOfScopeFinalHash: outOfScopeHash, outOfScopeDiff: 0 });
}

const targetRenderExams = renderRows.sort((a, b) => a.examId.localeCompare(b.examId));
writeCsv('geometry_equation_dependency_closure.csv', dependencyRows);
writeCsv('target_render_exams.csv', targetRenderExams);
writeCsv('out_of_scope_protection_manifest.csv', protectionRows);

const enrichedPayload = { protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2', generatedAt: new Date().toISOString(), targetCount: enrichedRows.length, rows: enrichedRows };
const manifestSha = hashJson({ ...enrichedPayload, generatedAt: null });
enrichedPayload.manifestSha = manifestSha;
fs.writeFileSync(path.join(REPORTS, 'geometry_equation_manifest_v22.json'), JSON.stringify(enrichedPayload, null, 2) + '\n', 'utf8');
const summary = { status: 'INVENTORY_COMPLETE_DEPENDENCY_CLOSED', targetCount: enrichedRows.length, targetRenderExamCount: targetRenderExams.length, sourceJsCount: sourcePaths.length, unresolvedDependencyCount: dependencyRows.filter((row) => row.dependencyClosureStatus.startsWith('UNRESOLVED')).length, protectionExamCount: protectionRows.length, outOfScopeDiffCount: protectionRows.filter((row) => row.outOfScopeDiff !== 0).length, manifestSha };
fs.writeFileSync(path.join(REPORTS, 'inventory_completion_summary.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(summary, null, 2));
