import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileSha256, relativeRepoPath, sha256, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const roots = [
  { kind: 'original', root: path.join(repoRoot, 'archive/exams/original/high/h1') },
  { kind: 'similar', root: path.join(repoRoot, 'archive/exams/similar/high/h1') }
];
const targetKeys = new Set(['H15-SB-02', 'H22-C2-06']);
const reverseCue = /명제|대우|역명제|이명제|필요조건|충분조건|필요충분|반례|진리집합|귀류법|양화사|전칭|존재명제|명제의 부정|조건의 부정|부등식의 증명/;
const files = roots.flatMap(({ kind, root }) => listJs(root).map((absolutePath) => ({ kind, absolutePath }))).sort((a, b) => a.absolutePath.localeCompare(b.absolutePath));
const items = [];
for (const { kind, absolutePath } of files) {
  const window = {};
  let parseError = null;
  try {
    vm.runInNewContext(fs.readFileSync(absolutePath, 'utf8'), { window }, { filename: absolutePath, timeout: 5000 });
  } catch (error) {
    parseError = String(error?.message ?? error);
  }
  if (parseError || !Array.isArray(window.questionBank)) continue;
  for (const question of window.questionBank) {
    const sourceText = [question.standardUnit, question.originalCategory, question.category, question.subUnit, ...(question.tags ?? []), question.content, question.solution].filter(Boolean).join(' ');
    const forward = targetKeys.has(question.standardUnitKey);
    const reverseCueMatch = reverseCue.test(sourceText);
    if (!forward && !reverseCueMatch) continue;
    items.push({
      questionUid: `${window.examTitle ?? path.basename(absolutePath, '.js')}:q${String(question.id).padStart(2, '0')}`,
      kind,
      sourceFile: relativeRepoPath(repoRoot, absolutePath),
      sourceFileSha: fileSha256(absolutePath),
      qid: question.id,
      standardUnitKey: question.standardUnitKey ?? null,
      standardUnit: question.standardUnit ?? null,
      originalCategory: question.originalCategory ?? null,
      category: question.category ?? null,
      subUnitKey: question.subUnitKey ?? null,
      forwardTarget: forward,
      reverseCue: reverseCueMatch,
      studentFacing: !/fixture|textbook|generator/i.test(relativeRepoPath(repoRoot, absolutePath)),
      hasSolution: typeof question.solution === 'string' && question.solution.trim().length > 0,
      hasSolutionImage: typeof question.solutionImage === 'string',
      contentPreview: String(question.content ?? '').slice(0, 240)
    });
  }
}
const targetItems = items.filter((item) => item.forwardTarget && item.studentFacing);
const reverseOnly = items.filter((item) => !item.forwardTarget && item.reverseCue && item.studentFacing);
const gitStatus = execFileSync('git', ['status', '--porcelain=v1'], { cwd: repoRoot, encoding: 'utf8' });
const dirtyLines = gitStatus.split(/\r?\n/).filter(Boolean);
const report = {
  reportVersion: 'proposition-production-phase0-inventory-v1',
  targetKeys: [...targetKeys],
  scanRoots: roots.map(({ kind, root }) => ({ kind, root: relativeRepoPath(repoRoot, root) })),
  scannedFileCount: files.length,
  forwardTargetCount: targetItems.length,
  reverseCueCount: items.filter((item) => item.reverseCue && item.studentFacing).length,
  reverseOnlyCandidateCount: reverseOnly.length,
  forwardReverseScopeMismatchCount: reverseOnly.length,
  countsByKindAndUnit: targetItems.reduce((acc, item) => { const key = `${item.kind}:${item.standardUnitKey}`; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {}),
  countsBySourceFile: targetItems.reduce((acc, item) => { acc[item.sourceFile] = (acc[item.sourceFile] ?? 0) + 1; return acc; }, {}),
  targetItems,
  reverseOnly,
  worktree: { dirty: dirtyLines.length > 0, porcelainLineCount: dirtyLines.length, sample: dirtyLines.slice(0, 20) },
  phase0Status: dirtyLines.length > 0 || reverseOnly.length > 0 ? 'BLOCKED_BEFORE_PRODUCTION_WRITE' : 'READY_FOR_SOURCE_REPAIR'
};
report.inventorySha = sha256(report);
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/proposition-phase0-inventory.json'), report);
console.log(JSON.stringify({ scannedFileCount: report.scannedFileCount, forwardTargetCount: report.forwardTargetCount, reverseCueCount: report.reverseCueCount, reverseOnlyCandidateCount: report.reverseOnlyCandidateCount, countsByKindAndUnit: report.countsByKindAndUnit, worktreeDirty: report.worktree.dirty, phase0Status: report.phase0Status, inventorySha: report.inventorySha }, null, 2));

function listJs(root) {
  if (!fs.existsSync(root)) return [];
  const result = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...listJs(absolute));
    else if (entry.isFile() && entry.name.endsWith('.js')) result.push(absolute);
  }
  return result;
}
