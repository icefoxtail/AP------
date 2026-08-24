import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'archive/tools/intelligence/validate-archive-blueprint-backfill-plan.mjs');
const dryRun = path.join(root, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-v1.json');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-blueprint-plan-validation-'));
const report = path.join(tempRoot, 'report.json');
const plan = path.join(tempRoot, 'plan.sql');
const out = path.join(tempRoot, 'validation.json');

try {
  const blockedStdout = execFileSync(process.execPath, [tool, '--report', dryRun, '--out', out], { cwd: root, encoding: 'utf8' });
  const blocked = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.equal(blocked.status, 'BLOCKED_SCHEMA_MISSING', 'stale dry-run must block batch review');
  assert.equal(JSON.parse(blockedStdout).status, blocked.status);

  const readyReport = {
    status: 'READY_FOR_SAMPLE_REVIEW',
    sqlPlan: { statements: 1 }
  };
  fs.writeFileSync(report, `${JSON.stringify(readyReport)}\n`, 'utf8');
  fs.writeFileSync(plan, '-- review only; not executed\nINSERT INTO exam_blueprints (archive_file, question_no) VALUES (\'exams/x.js\', 1)\nON CONFLICT(archive_file, question_no) DO UPDATE SET source_question_no=excluded.source_question_no;\n', 'utf8');
  execFileSync(process.execPath, [tool, '--report', report, '--sql-plan', plan, '--out', out], { cwd: root, encoding: 'utf8' });
  const ready = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.equal(ready.status, 'READY_FOR_BATCH_REVIEW', 'safe deterministic plan must pass validation');
  assert.equal(ready.statementCount, 1);

  fs.writeFileSync(plan, 'DELETE FROM exam_blueprints;\n', 'utf8');
  execFileSync(process.execPath, [tool, '--report', report, '--sql-plan', plan, '--out', out], { cwd: root, encoding: 'utf8' });
  const rejected = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.equal(rejected.status, 'REVIEW_REQUIRED', 'destructive plan must be rejected');
  console.log('archive blueprint backfill plan validation checks passed');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
