import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const STAGING = path.join(REPORTS, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const groups = new Map();
for (const row of manifest.rows) {
  if (!groups.has(row.sourceJsPath)) groups.set(row.sourceJsPath, { examId: row.examId, sourceJsPath: row.sourceJsPath, targetQuestionUids: [], targetCount: 0 });
  const group = groups.get(row.sourceJsPath); group.targetQuestionUids.push(row.questionUid); group.targetCount += 1;
}
const rows = [];
for (const item of groups.values()) {
  const filePath = path.join(STAGING, 'exams', item.sourceJsPath.replaceAll('/', path.sep));
  const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 4000 });
  const bank = context.window.questionBank || [];
  rows.push({ ...item, questionCount: bank.length, sourceFileSha256: crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'), targetQuestionUids: item.targetQuestionUids.sort() });
}
rows.sort((a, b) => a.examId.localeCompare(b.examId));
const result = { status: 'TARGET_RENDER_MATRIX_INPUT_FROZEN', manifestSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'))).digest('hex'), targetRenderExamCount: rows.length, rows };
fs.writeFileSync(path.join(REPORTS, 'render_matrix_input.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
const headers = ['examId', 'sourceJsPath', 'questionCount', 'targetCount', 'sourceFileSha256', 'targetQuestionUids'];
const csv = [headers.join(',')];
for (const row of rows) csv.push(headers.map((key) => { const value = Array.isArray(row[key]) ? row[key].join('|') : String(row[key] ?? ''); return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value; }).join(','));
fs.writeFileSync(path.join(REPORTS, 'render_matrix_input.csv'), `${csv.join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ status: result.status, targetRenderExamCount: rows.length, totalQuestionCount: rows.reduce((sum, row) => sum + row.questionCount, 0), totalTargetCount: rows.reduce((sum, row) => sum + row.targetCount, 0) }, null, 2));
