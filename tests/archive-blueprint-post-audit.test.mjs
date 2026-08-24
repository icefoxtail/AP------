import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'archive/tools/intelligence/audit-archive-blueprint-backfill.mjs');
const dryRun = path.join(root, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-v1.json');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-blueprint-post-audit-'));
const out = path.join(tempRoot, 'audit.json');

try {
  const stdout = execFileSync(process.execPath, [tool, '--dry-run-report', dryRun, '--out', out], { cwd: root, encoding: 'utf8' });
  const result = JSON.parse(stdout);
  const report = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.equal(report.readOnly, true, 'post-audit must be read-only');
  assert.equal(report.postBackfill, true, 'post-audit report must be marked post-backfill');
  assert.equal(report.status, 'BLOCKED_SCHEMA_MISSING', 'stale export must remain blocked');
  assert.equal(report.checks.metadataDiffZero, false, 'stale export must not claim zero diff');
  assert.equal(result.status, report.status);

  const readyDryRun = path.join(tempRoot, 'ready-dry-run.json');
  fs.writeFileSync(readyDryRun, `${JSON.stringify({
    status: 'READY_FOR_SAMPLE_REVIEW',
    source: { schemaReady: true },
    summary: { dbRows: 1, files: 1, sourceQuestions: 1, updateRequired: 0, insertRequired: 0, sourceQuestionMissing: 0, unmatchedDbRows: 0 },
    fileSummaries: [{ status: 'UNCHANGED' }]
  })}\n`, 'utf8');
  execFileSync(process.execPath, [tool, '--dry-run-report', readyDryRun, '--out', out], { cwd: root, encoding: 'utf8' });
  const pass = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.equal(pass.status, 'POST_AUDIT_PASS', 'zero-diff schema-ready report must pass post-audit');
  assert.equal(pass.checks.unmatchedDbRowsZero, true, 'zero-diff schema-ready report must have no unmatched blueprint rows');
  console.log('archive blueprint post-audit checks passed');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
