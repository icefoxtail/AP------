import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3');
const outputPath = path.join(outputDir, 'archive-empty-solution-inventory-v1.json');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function normalize(value) {
  return String(value || '').replaceAll('\\', '/').replace(/^archive\/exams\//, '').trim();
}

function scopeOf(file) {
  if (file.startsWith('original/')) return 'original';
  if (file.startsWith('types/')) return 'types';
  if (file.startsWith('similar/')) return 'similar';
  return 'other';
}

function loadQuestions(filePath) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { timeout: 10000, filename: filePath });
  return Array.isArray(context.window.questionBank) ? context.window.questionBank : [];
}

function trackedExamFiles() {
  return execFileSync('git', ['-C', repoRoot, 'ls-files', '-z', '--', 'archive/exams/*.js'], {
    maxBuffer: 64 * 1024 * 1024
  }).toString('utf8').split('\0').filter(Boolean).map(normalize);
}

export function auditEmptySolutionsV1() {
  const rows = [];
  const errors = [];
  for (const file of trackedExamFiles()) {
    const fullPath = path.join(archiveDir, 'exams', ...file.split('/'));
    try {
      const questions = loadQuestions(fullPath);
      const emptyQuestionIds = questions
        .filter(question => !String(question?.solution || '').trim())
        .map(question => question?.id)
        .filter(id => id !== undefined && id !== null);
      if (emptyQuestionIds.length) {
        rows.push({
          file,
          scope: scopeOf(file),
          questionCount: questions.length,
          emptySolutionCount: emptyQuestionIds.length,
          emptyQuestionIds
        });
      }
    } catch (error) {
      errors.push({ file, error: error?.message || String(error) });
    }
  }
  rows.sort((a, b) => a.file.localeCompare(b.file, 'en'));
  const totalQuestionCount = rows.reduce((sum, row) => sum + row.questionCount, 0);
  const emptySolutionQuestions = rows.reduce((sum, row) => sum + row.emptySolutionCount, 0);
  const byScope = Object.fromEntries(['original', 'types', 'similar', 'other'].map(scope => {
    const scoped = rows.filter(row => row.scope === scope);
    return [scope, {
      filesWithEmptySolutions: scoped.length,
      emptySolutionQuestions: scoped.reduce((sum, row) => sum + row.emptySolutionCount, 0)
    }];
  }));
  const report = {
    schemaVersion: 'archive-empty-solution-inventory-v1',
    generatedAt: new Date().toISOString(),
    scope: 'git-tracked archive/exams production and auxiliary JS',
    policy: '빈 해설을 자동 생성하거나 정답만 복사하지 않고, 문항 ID 단위 작업대장만 생성',
    totals: {
      trackedExamFiles: trackedExamFiles().length,
      filesWithEmptySolutions: rows.length,
      emptySolutionQuestions,
      questionsInAffectedFiles: totalQuestionCount,
      loadErrors: errors.length
    },
    byScope,
    rows,
    errors,
    gates: {
      noLoadErrors: errors.length === 0,
      noEmptySolutions: rows.length === 0,
      reportOnlyNoWrites: true,
      commitOrPush: false
    }
  };
  return { ...report, digest: sha256(JSON.stringify(report)) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = auditEmptySolutionsV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, byScope: report.byScope, gates: report.gates }, null, 2));
}
