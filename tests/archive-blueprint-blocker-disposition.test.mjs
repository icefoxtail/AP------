import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'archive/tools/intelligence/build-archive-blueprint-blocker-disposition.mjs');
const dryRun = path.join(root, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-after-mixed-identity-v1.json');
const postAudit = path.join(root, 'archive/_generated/intelligence/phase2/archive-blueprint-post-audit-after-mixed-identity-v3.json');

if (fs.existsSync(dryRun) && fs.existsSync(postAudit)) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-blueprint-disposition-'));
  const out = path.join(tempDir, 'report.json');
  execFileSync(process.execPath, [tool, '--dry-run', dryRun, '--post-audit', postAudit, '--out', out], { cwd: root, stdio: 'pipe' });
  const report = JSON.parse(fs.readFileSync(out, 'utf8'));
  assert.equal(report.status, 'DISPOSITION_REQUIRED');
  assert.equal(report.summary.sourceMissingFiles, 3);
  assert.equal(report.summary.sourceMissingRows, 72);
  assert.equal(report.summary.orphanRows, 4);
  assert.equal(report.phase3Gate.allowed, false);
}
