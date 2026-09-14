import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { fileRef } from '../canonical.mjs';
import { evaluateCanonicalAuditOnce } from '../canonical-audit-authority.mjs';

test('canonical audit evaluation persists once and reuses only an exact immutable snapshot', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-canonical-audit-'));
  try {
    const sha = value => 'sha256:' + value.repeat(64).slice(0, 64);
    const run = { runId: 'run', revision: 1, inputSha: sha('a'), evidence: [], sourceAuthority: { sourceTruthBundleSha: sha('b') }, uidAuthority: { sourceExamIdRegistryEntrySha: sha('c') }, renderRuntime: { bundleSha: sha('d') }, questionQualityClosureSetRef: { path: 'quality.json', bytes: 1, sha256: sha('e') }, examReleaseClosureRef: { path: 'release.json', bytes: 1, sha256: sha('f') } };
    const audit = { schemaVersion: 'APMATH_PIPELINE_AUDIT_v2', runId: 'run', revision: 1, inputSha: run.inputSha, status: 'PASS', productionAuthorized: false, freshness: [] };
    let calls = 0;
    const first = evaluateCanonicalAuditOnce(root, run, { outputPath: 'snapshots/run.json', evaluator: () => { calls += 1; return audit; } });
    assert.equal(first.status, 'FRESH');
    const second = evaluateCanonicalAuditOnce(root, run, { snapshotRef: first.snapshotRef, evaluator: () => { calls += 1; return audit; } });
    assert.equal(second.status, 'REUSED');
    assert.equal(calls, 1);
    const tamperedPath = path.join(root, 'snapshots/tampered.json');
    fs.writeFileSync(tamperedPath, JSON.stringify({ ...first.snapshot, audit: { ...audit, status: 'BLOCKED' } }));
    const tampered = evaluateCanonicalAuditOnce(root, run, { snapshotRef: fileRef(root, 'snapshots/tampered.json'), evaluator: () => { calls += 1; return audit; } });
    assert.equal(tampered.status, 'FRESH');
    assert.equal(calls, 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
