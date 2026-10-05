import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tool = path.join(root, 'archive/tools/intelligence/review-archive-blueprint-backfill-sample.mjs');
const dryRun = path.join(root, 'archive/_generated/intelligence/phase2/archive-blueprint-backfill-dry-run-v1.json');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-blueprint-sample-review-'));
const out = path.join(tempRoot, 'sample.json');

try {
  const stdout = execFileSync(process.execPath, [tool, '--report', dryRun, '--out', out, '--limit', '300'], {
    cwd: root,
    encoding: 'utf8'
  });
  const result = JSON.parse(stdout);
  const report = JSON.parse(fs.readFileSync(out, 'utf8'));

  assert.equal(report.readOnly, true, 'sample review must be read-only');
  assert.equal(report.status, 'BLOCKED_SCHEMA_MISSING', 'stale dry-run schema block must propagate');
  assert(report.summary.sampleSize <= 300, 'sample size must respect limit');
  assert((report.summary.SOURCE_HASH_STABLE || 0) > 0, 'sample must independently confirm source hash stability');
  assert.equal(result.status, report.status, 'CLI summary must match review report');
  assert.equal(report.source.source, 'local archive JS only; no D1 access');
  console.log('archive blueprint backfill sample review checks passed');
} finally {
  fs.rmSync(tempRoot, { recursive: true, force: true });
}
