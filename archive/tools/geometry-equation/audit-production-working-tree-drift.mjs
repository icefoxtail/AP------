import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const stageRoot = path.join(reports, 'staging', 'archive');
const manifest = JSON.parse(fs.readFileSync(path.join(reports, 'geometry_equation_manifest_v22.json'), 'utf8'));
const sourcePaths = [...new Set(manifest.rows.map((row) => row.sourceJsPath))].sort();
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const loadBank = (filePath) => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 5000 });
  return context.window.questionBank || [];
};
const loadHeadBank = (relativePath) => {
  const result = spawnSync('git', ['show', 'HEAD:' + relativePath], { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  if (result.status !== 0) return { error: result.stderr.trim(), bank: [] };
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(result.stdout, context, { filename: relativePath, timeout: 5000 });
  return { error: null, bank: context.window.questionBank || [] };
};
const protectedKeys = ['content', 'choices', 'answer', 'image'];
const changedFiles = [];
const changedQuestions = [];
for (const sourceJsPath of sourcePaths) {
  const relative = 'archive/exams/' + sourceJsPath;
  const currentPath = path.join(root, relative.replaceAll('/', path.sep));
  const head = loadHeadBank(relative);
  if (!fs.existsSync(currentPath) || head.error) {
    changedFiles.push({ sourceJsPath, currentSha: fs.existsSync(currentPath) ? sha(fs.readFileSync(currentPath)) : null, headError: head.error });
    continue;
  }
  const current = loadBank(currentPath);
  const headById = new Map(head.bank.map((question) => [Number(question.id), question]));
  const currentById = new Map(current.map((question) => [Number(question.id), question]));
  const fieldChanges = [];
  for (const [id, question] of currentById) {
    const original = headById.get(id);
    if (!original) { fieldChanges.push({ id, field: 'question_added' }); continue; }
    for (const key of Object.keys(question).filter((candidate) => candidate !== 'solution' && !candidate.startsWith('solutionImage'))) {
      if (JSON.stringify(question[key] ?? null) !== JSON.stringify(original[key] ?? null)) fieldChanges.push({ id, field: key });
    }
    for (const key of ['solution', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']) {
      if (JSON.stringify(question[key] ?? null) !== JSON.stringify(original[key] ?? null)) fieldChanges.push({ id, field: key });
    }
  }
  if (fieldChanges.length) changedFiles.push({ sourceJsPath, currentSha: sha(fs.readFileSync(currentPath)), headSha: sha(Buffer.from(spawnSync('git', ['show', 'HEAD:' + relative], { cwd: root, encoding: 'buffer' }).stdout)), fieldChanges });
  for (const change of fieldChanges) changedQuestions.push({ sourceJsPath, ...change, protected: protectedKeys.includes(change.field) });
}
const statusLines = spawnSync('git', ['status', '--short', '--', 'archive/exams/original/high/h1'], { cwd: root, encoding: 'utf8' }).stdout.trim().split(/\r?\n/).filter(Boolean);
const targetProtectedDiff = changedQuestions.filter((row) => row.protected && manifest.rows.some((manifestRow) => manifestRow.sourceJsPath === row.sourceJsPath && Number(manifestRow.id) === Number(row.id)));
const outOfScopeProtectedDiff = changedQuestions.filter((row) => row.protected && !manifest.rows.some((manifestRow) => manifestRow.sourceJsPath === row.sourceJsPath && Number(manifestRow.id) === Number(row.id)));
const output = {
  status: targetProtectedDiff.length === 0 && outOfScopeProtectedDiff.length === 0 ? 'PRODUCTION_WORKTREE_DRIFT_SOLUTION_OR_METADATA_ONLY' : 'PRODUCTION_WORKTREE_DRIFT_PROTECTED_FIELD',
  generatedAt: new Date().toISOString(),
  currentHead: spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim(),
  sourceJsScope: sourcePaths.length,
  modifiedSourceFilesInScope: changedFiles.length,
  gitStatusLines: statusLines,
  changedQuestionFieldCount: changedQuestions.length,
  targetProtectedFieldChanges: targetProtectedDiff,
  outOfScopeProtectedFieldChanges: outOfScopeProtectedDiff,
  changedFiles,
  stagingCurrentProductionProtectedPayload: '41/41 equal per out_of_scope_baseline_reconciliation_S5.json',
  productionModifiedByThisAudit: false,
  disposition: targetProtectedDiff.length === 0 && outOfScopeProtectedDiff.length === 0 ? 'record external production working-tree drift; do not reset or overwrite; promotion remains prohibited until baseline decision' : 'protected production drift requires immediate hold and user direction'
};
fs.writeFileSync(path.join(reports, 'production_working_tree_drift_current.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const md = [
  '# Current production working-tree drift — S5', '',
  '- 상태: **' + output.status + '**',
  '- HEAD: ' + output.currentHead,
  '- scope source JS: ' + output.sourceJsScope,
  '- modified source files in scope: ' + output.modifiedSourceFilesInScope,
  '- changed question fields: ' + output.changedQuestionFieldCount,
  '- target protected field changes: ' + output.targetProtectedFieldChanges.length,
  '- out-of-scope protected field changes: ' + output.outOfScopeProtectedFieldChanges.length,
  '- current staging/production protected payload: 41/41 equal', '',
  ...changedQuestions.slice(0, 120).map((row) => '- ' + row.sourceJsPath + ' q' + row.id + ' field=' + row.field + ' protected=' + row.protected),
  '',
  'This audit is read-only. It records externally changed production files without resetting, overwriting, or promoting them.'
].join('\n') + '\n';
fs.writeFileSync(path.join(reports, 'production_working_tree_drift_current.md'), md, 'utf8');
console.log(JSON.stringify({ status: output.status, currentHead: output.currentHead, modifiedSourceFilesInScope: output.modifiedSourceFilesInScope, changedQuestionFieldCount: output.changedQuestionFieldCount, targetProtectedFieldChanges: output.targetProtectedFieldChanges.length, outOfScopeProtectedFieldChanges: output.outOfScopeProtectedFieldChanges.length }, null, 2));
