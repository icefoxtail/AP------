import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  assertHistoricalReferenceParity,
  checkRecoveryManifest,
  loadRecoveryManifest,
  restoreRecoveryPaths
} from '../tools/archive-analysis-recovery.mjs';

const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  cwd: path.resolve(import.meta.dirname, '..'),
  encoding: 'utf8'
}).trim();

function removeOwnedTempDirectory(directory) {
  const tempRoot = fs.realpathSync(os.tmpdir());
  const resolved = fs.realpathSync(directory);
  assert.equal(path.dirname(resolved), tempRoot);
  assert.ok(path.basename(resolved).startsWith('archive-analysis-recovery-'));
  fs.rmSync(resolved, { recursive: true, force: true });
}

test('all 11 removed catalog paths rehydrate to their recorded bytes and refuse overwrite', () => {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-analysis-recovery-'));
  try {
    const { manifest } = loadRecoveryManifest(repoRoot);
    const paths = manifest.entries.map(entry => entry.originalPath);
    const restored = restoreRecoveryPaths({ root: repoRoot, paths, destinationRoot: destination });

    assert.equal(restored.restored.length, 11);
    assert.equal(restored.status, 'ARCHIVED_BASELINE_BOUND');
    assert.equal(restored.technicalOnly, true);
    assert.equal(restored.missingHeadReferenceCount, 25);
    assert.equal(restored.restored.reduce((total, entry) => total + entry.sizeBytes, 0), 326839777);
    for (const entry of manifest.entries) {
      const restoredPath = path.join(destination, ...entry.originalPath.split('/'));
      const bytes = fs.readFileSync(restoredPath);
      assert.equal(bytes.length, entry.sizeBytes, `${entry.originalPath} byte count`);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), entry.sha256, `${entry.originalPath} SHA-256`);
    }

    const first = manifest.entries[0];
    const restoredPath = path.join(destination, ...first.originalPath.split('/'));
    const before = fs.readFileSync(restoredPath);
    assert.throws(
      () => restoreRecoveryPaths({ root: repoRoot, paths: [first.originalPath], destinationRoot: destination }),
      /RECOVERY_TARGET_EXISTS/
    );
    assert.deepEqual(fs.readFileSync(restoredPath), before);
  } finally {
    removeOwnedTempDirectory(destination);
  }
});

test('post-migration HEAD binds absent history references to the verified Drive root receipt', () => {
  const report = checkRecoveryManifest({ root: repoRoot });
  assert.equal(report.status, 'ARCHIVED_BASELINE_BOUND');
  assert.equal(report.technicalOnly, true);
  assert.equal(report.baselineAvailable, true);
  assert.equal(report.missingHeadReferenceCount, 25);
  assert.equal(report.baselineArchiveAnalysisPathCount, 19548);
  assert.equal(report.baselineArchiveAnalysisBytes, 5396870829);
  assert.equal(report.driveRootReceiptPath, 'archive/data/archive-analysis-drive-root-receipt.v1.json');
  assert.match(report.driveIndexSha256, /^[0-9a-f]{64}$/);

  assert.throws(
    () => checkRecoveryManifest({
      root: repoRoot,
      receiptPath: path.join(repoRoot, 'archive/data/missing-drive-root-receipt.json')
    }),
    /RECOVERY_DRIVE_ROOT_RECEIPT_MISSING/
  );
});

test('a changed existing historical reference still rejects against the baseline Git blob', () => {
  const reference = 'archive/analysis/example/historical-reference.json';
  const baselineObject = '1'.repeat(40);
  assert.equal(assertHistoricalReferenceParity(reference, { baselineObject, headObject: baselineObject }), 'unchanged');
  assert.equal(assertHistoricalReferenceParity(reference, { baselineObject, headObject: null }), 'archived-baseline');
  assert.throws(
    () => assertHistoricalReferenceParity(reference, { baselineObject, headObject: '2'.repeat(40) }),
    /RECOVERY_HISTORICAL_REFERENCE_CHANGED/
  );
  assert.throws(
    () => assertHistoricalReferenceParity(reference, {
      baselineObject,
      headObject: null,
      committedHeadObject: '2'.repeat(40)
    }),
    /RECOVERY_HISTORICAL_REFERENCE_CHANGED/
  );
});

test('a shallow checkout without baseline or retained HEAD objects returns a migration message', () => {
  const shallowRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-analysis-recovery-'));
  try {
    const manifestFile = path.join(repoRoot, 'tools/archive-analysis-recovery-manifest.v1.json');
    const localManifest = path.join(shallowRoot, 'archive-analysis-recovery-manifest.v1.json');
    fs.copyFileSync(manifestFile, localManifest);
    assert.throws(
      () => checkRecoveryManifest({ root: shallowRoot, manifestPath: localManifest }),
      /MIGRATED_TO_DRIVE:.*tools\/archive-cold-evidence\.mjs/
    );
  } finally {
    removeOwnedTempDirectory(shallowRoot);
  }
});

test('recovery rejects traversal and an edited SHA-256 before writing any file', () => {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-analysis-recovery-'));
  try {
    assert.throws(
      () => restoreRecoveryPaths({
        root: repoRoot,
        paths: ['archive/analysis/../../outside.json'],
        destinationRoot: destination
      }),
      /RECOVERY_PATH_INVALID/
    );

    const { manifest } = loadRecoveryManifest(repoRoot);
    const entry = manifest.entries[0];
    entry.sha256 = '0'.repeat(64);
    const alteredManifest = path.join(destination, 'altered-manifest.json');
    fs.writeFileSync(alteredManifest, `${JSON.stringify(manifest)}\n`);

    assert.throws(
      () => restoreRecoveryPaths({
        root: repoRoot,
        paths: [entry.originalPath],
        destinationRoot: destination,
        manifestPath: alteredManifest
      }),
      /RECOVERY_RAW_SHA256_MISMATCH/
    );
    assert.equal(fs.existsSync(path.join(destination, ...entry.originalPath.split('/'))), false);
  } finally {
    removeOwnedTempDirectory(destination);
  }
});

test('recovery rejects a symlinked parent component before writing', () => {
  const destination = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-analysis-recovery-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-analysis-recovery-outside-'));
  try {
    try {
      fs.symlinkSync(outside, path.join(destination, 'archive'), 'junction');
    } catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return;
      throw error;
    }
    const { manifest } = loadRecoveryManifest(repoRoot);
    const entry = manifest.entries[0];
    assert.throws(
      () => restoreRecoveryPaths({ root: repoRoot, paths: [entry.originalPath], destinationRoot: destination }),
      /RECOVERY_PARENT_NOT_DIRECTORY/
    );
    assert.equal(fs.readdirSync(outside).length, 0);
  } finally {
    removeOwnedTempDirectory(destination);
    removeOwnedTempDirectory(outside);
  }
});
