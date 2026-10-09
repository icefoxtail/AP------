import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { forbiddenExamChange } from './exam-workspace-policy.mjs';

export function auditExamChanges({ root = process.cwd(), base = '', staged = false } = {}) {
  const args = staged ? ['--cached'] : [base];
  if (!staged && !base) throw new Error('BASE_OR_STAGED_REQUIRED');
  const paths = execFileSync('git', ['-C', root, 'diff', '--name-only', '-z', '--diff-filter=ACMRT', ...args, '--'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  return paths.filter(forbiddenExamChange).map(value => `EXAM_WORKSPACE_PUBLICATION_FORBIDDEN:${value}`);
}

if (import.meta.url === (process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '')) {
  const baseIndex = process.argv.indexOf('--base');
  const errors = auditExamChanges({ staged: process.argv.includes('--staged'), base: baseIndex < 0 ? '' : process.argv[baseIndex + 1] });
  process.stdout.write(`${JSON.stringify({ status: errors.length ? 'FAIL' : 'PASS', errors })}\n`);
  process.exitCode = errors.length ? 1 : 0;
}
