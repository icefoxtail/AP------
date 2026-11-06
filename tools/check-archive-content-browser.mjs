#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readScope } from './ci/archive-ci-scope.mjs';
import { loadSource } from '../archive/tools/verify-archive-content-scope.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [flag, file] = process.argv.slice(2);
if (flag !== '--scope' || !file) throw new Error('usage: check-archive-content-browser.mjs --scope <plan>');
const scope = readScope(file, root);
if (scope.mode !== 'archive-content' || !scope.sources.length) throw new Error('Archive content scope required');
const results = [];
let failed = false;
for (const source of scope.sources) {
  const { questions, sourceSha256 } = loadSource(root, source);
  const modes = questions.some(question => question.solution || question.solutionImage || question.solutionImageRef) ? ['exam', 'sol'] : ['exam'];
  for (const mode of modes) {
    const started = Date.now();
    const result = spawnSync(process.execPath, ['tests/archive-original-exam-access.browser.cjs'], {
      cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 2 * 1024 * 1024,
      env: { ...process.env, ARCHIVE_EXAM_ACCESS_ROOT: root, ARCHIVE_ORIGINAL_EXAM: source.slice('archive/exams/'.length), ARCHIVE_OUTPUT_MODE: mode },
    });
    const passed = !result.error && result.status === 0;
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) console.error(result.error.message);
    results.push({ source, sourceSha256, mode, status: passed ? 'PASS' : 'FAIL', durationMs: Date.now() - started });
    failed ||= !passed;
  }
}
const report = { headSha: scope.headSha, baseSha: scope.baseSha, status: failed ? 'FAIL' : 'PASS', results, mathematicalReview: 'NOT_RUN' };
console.log(JSON.stringify(report, null, 2));
if (process.env.ARCHIVE_SOLUTION_REPORT_DIR) {
  fs.mkdirSync(process.env.ARCHIVE_SOLUTION_REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(process.env.ARCHIVE_SOLUTION_REPORT_DIR, 'changed-original-output.json'), JSON.stringify(report, null, 2) + '\n');
}
if (failed) process.exitCode = 1;
