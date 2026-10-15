import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { loadRecoveryManifest, restoreRecoveryPaths } from '../tools/archive-analysis-recovery.mjs';

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
