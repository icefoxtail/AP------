import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'archive/tools/intelligence/audit-archive-blueprint-mixed-identity.mjs');
const dbSql = path.join(root, 'archive/_generated/intelligence/phase2/exam-blueprints-after-backfill-20260824.sql');

if (fs.existsSync(dbSql)) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-mixed-identity-'));
  const report = path.join(tempDir, 'audit.json');
  const sql = path.join(tempDir, 'plan.sql');
  execFileSync(process.execPath, [tool, '--db-sql', dbSql, '--out', report, '--sql-out', sql], { cwd: root, stdio: 'pipe' });
  const parsed = JSON.parse(fs.readFileSync(report, 'utf8'));
  assert.equal(parsed.status, 'MIXED_IDENTITY_CANDIDATES_READY');
  assert.equal(parsed.summary.mixedRows, 343);
  assert.equal(parsed.summary.identityCandidateReady, 343);
  assert.equal(parsed.summary.sourceFileMissing, 0);
  assert.equal(parsed.summary.sourceQuestionMissing, 0);
  assert.equal(parsed.summary.identityMismatch, 0);
  assert.equal(parsed.summary.parseError, 0);
  const plan = fs.readFileSync(sql, 'utf8');
  assert.equal((plan.match(/^UPDATE exam_blueprints SET/gm) || []).length, 343);
  assert.equal((plan.match(/^WHERE archive_file=/gm) || []).length, 343);
  assert.equal((plan.match(/\b(?:DROP|DELETE|ALTER|TRUNCATE)\b/gi) || []).length, 0);
}
