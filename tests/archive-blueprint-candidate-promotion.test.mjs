import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'archive/tools/intelligence/promote-archive-blueprint-candidate-sources.mjs');
const dbSql = path.join(root, 'archive/_generated/intelligence/phase2/exam-blueprints-after-mixed-identity-20260824.sql');

if (fs.existsSync(dbSql)) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-blueprint-candidate-promotion-'));
  const reportPath = path.join(tempDir, 'report.json');
  const sqlPath = path.join(tempDir, 'plan.sql');
  execFileSync(process.execPath, [tool, '--db-sql', dbSql, '--out', reportPath, '--sql-out', sqlPath], { cwd: root, stdio: 'pipe' });
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert.equal(report.status, 'CANDIDATE_PROMOTION_READY');
  assert.equal(report.summary.promotedRows, 72);
  assert.equal(report.summary.errors, 0);
  const plan = fs.readFileSync(sqlPath, 'utf8');
  assert.equal((plan.match(/^UPDATE exam_blueprints SET/gm) || []).length, 72);
  assert.equal((plan.match(/^WHERE archive_file=/gm) || []).length, 72);
  assert.equal((plan.match(/\b(?:DROP|DELETE|ALTER|TRUNCATE)\b/gi) || []).length, 0);
}
