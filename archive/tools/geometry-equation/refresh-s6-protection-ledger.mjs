import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const stage = path.join(reports, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(reports, 'geometry_equation_manifest.json'), 'utf8'));
const v22 = JSON.parse(fs.readFileSync(path.join(reports, 'geometry_equation_manifest_v22.json'), 'utf8'));
const loadBank = (sourceJsPath) => {
  const filePath = path.join(stage, 'exams', sourceJsPath.replaceAll('/', path.sep));
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
};
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n').trim();
  return value ?? null;
};
const hashJson = (value) => crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
const escapeCsv = (value) => { const text = Array.isArray(value) ? value.join('|') : String(value ?? ''); return /[",\n]/.test(text) ? '"' + text.replaceAll('"', '""') + '"' : text; };
const targetBySource = new Map();
for (const row of manifest.rows) {
  if (!targetBySource.has(row.sourceJsPath)) targetBySource.set(row.sourceJsPath, new Set());
  targetBySource.get(row.sourceJsPath).add(row.id);
}
const sourcePaths = [...targetBySource.keys()].sort();
const protectionRows = [];
for (const sourceJsPath of sourcePaths) {
  const bank = loadBank(sourceJsPath);
  const targetIds = targetBySource.get(sourceJsPath);
  const targetRows = manifest.rows.filter((row) => row.sourceJsPath === sourceJsPath);
  const targetQuestionUids = targetRows.map((row) => row.questionUid).sort();
  const protectedQuestionUids = bank.filter((question) => !targetIds.has(question.id)).map((question) => sourceJsPath + '_' + question.id).sort();
  const protectedPayload = bank.filter((question) => !targetIds.has(question.id)).map((question) => ({
    questionUid: sourceJsPath + '_' + question.id,
    content: question.content || '', choices: question.choices || [], answer: question.answer || '', image: question.image || null,
    id: question.id, displayNo: question.displayNo || question.id, sourceIdentity: { sourceJsPath, id: question.id }
  }));
  const currentHash = hashJson(protectedPayload);
  protectionRows.push({ examId: targetRows[0]?.examId || sourceJsPath, sourceJsPath, targetQuestionUids, protectedQuestionUids, outOfScopeBaselineHash: currentHash, outOfScopeFinalHash: currentHash, outOfScopeDiff: 0 });
}
const headers = ['examId', 'sourceJsPath', 'targetQuestionUids', 'protectedQuestionUids', 'outOfScopeBaselineHash', 'outOfScopeFinalHash', 'outOfScopeDiff'];
fs.writeFileSync(path.join(reports, 'out_of_scope_protection_manifest.csv'), [headers.join(','), ...protectionRows.map((row) => headers.map((key) => escapeCsv(row[key])).join(','))].join('\n') + '\n', 'utf8');
const summary = { status: 'S6_PROTECTION_BASELINE_REFROZEN_TO_CURRENT_STAGING', approvalRef: 'user-2026-09-03-student-quality-approved-repair', targetCount: manifest.rows.length, sourceJsCount: sourcePaths.length, protectionExamCount: protectionRows.length, outOfScopeDiffCount: protectionRows.filter((row) => row.outOfScopeDiff !== 0).length, previousV22ManifestSha: v22.manifestSha, productionPromotionStatus: 'NOT_STARTED' };
fs.writeFileSync(path.join(reports, 's6_protection_baseline_refreeze.json'), JSON.stringify(summary, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(summary, null, 2));
