import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  EVIDENCE_AUTHORITY_SCHEMA,
  loadEvidenceAuthorityIndex,
  readHotEvidenceAuthority
} from '../archive/tools/evidence-authority-v1.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');

test('versioned offline authority lane holds exact bytes for all current hot consumers', () => {
  const index = loadEvidenceAuthorityIndex(ROOT);
  assert.equal(index.schemaVersion, EVIDENCE_AUTHORITY_SCHEMA);
  assert.equal(index.baselineCommit, 'd305af51b01b15e09d37839538ef3baaa269bd55');
  assert.equal(index.scope.originalPathCount, 65);
  assert.equal(index.scope.rawPayloadBytes, 2_800_702);
  assert.equal(index.scope.visualProofCount, 45);
  assert.equal(index.scope.visualManifestCount, 2);
  assert.equal(index.scope.visualAccessibilityParityReceiptCount, 1);
  assert.equal(index.scope.sourceSnapshotCount, 6);

  for (const entry of index.entries) {
    const result = readHotEvidenceAuthority({ root: ROOT, originalPath: entry.originalPath });
    assert.equal(result.bytes.length, entry.sizeBytes, entry.originalPath);
    assert.equal(result.sha256, entry.sha256, entry.originalPath);
    assert.equal(result.gitBlobSha1, entry.gitBlobSha1, entry.originalPath);
  }
});

test('authority payloads have Git text conversion disabled', () => {
  const attribute = execFileSync('git', ['check-attr', 'text', '--', 'archive/data/evidence-authority/v1/index.json'], { cwd: ROOT, encoding: 'utf8' });
  assert.match(attribute, /archive\/data\/evidence-authority\/v1\/index\.json: text: unset/);
});

test('authority reader works when only the new lane exists and rejects changed bytes', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-authority-'));
  try {
    const originalPath = 'archive/analysis/legacy/proof.json';
    const authorityPath = 'archive/data/evidence-authority/v1/legacy/proof.json';
    const bytes = Buffer.from('{"status":"REVIEWED"}\n');
    fs.mkdirSync(path.dirname(path.join(temp, authorityPath)), { recursive: true });
    fs.mkdirSync(path.dirname(path.join(temp, 'archive/data/evidence-authority/v1/index.json')), { recursive: true });
    fs.writeFileSync(path.join(temp, authorityPath), bytes);
    const index = {
      schemaVersion: EVIDENCE_AUTHORITY_SCHEMA,
      baselineCommit: 'a'.repeat(40),
      entries: [{
        originalPath, authorityPath, baselineCommit: 'a'.repeat(40), baselinePath: originalPath,
        gitBlobSha1: gitBlobSha1(bytes), sha256: sha256(bytes), sizeBytes: bytes.length,
        classification: 'hot-authority', evidenceRole: 'fixture-proof', currentConsumers: ['fixture-consumer']
      }]
    };
    fs.writeFileSync(path.join(temp, 'archive/data/evidence-authority/v1/index.json'), JSON.stringify(index));

    assert.deepEqual(readHotEvidenceAuthority({ root: temp, originalPath }).bytes, bytes);
    fs.writeFileSync(path.join(temp, authorityPath), Buffer.from('changed'));
    assert.throws(() => readHotEvidenceAuthority({ root: temp, originalPath }), /SIZE_MISMATCH|SHA256_MISMATCH/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('authority reader rejects symlinked index or authority parents', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-authority-symlink-'));
  let outside;
  try {
    outside = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-authority-outside-'));
    const linked = path.join(temp, 'archive/data/evidence-authority/v1/linked');
    fs.mkdirSync(path.dirname(linked), { recursive: true });
    fs.writeFileSync(path.join(outside, 'proof.json'), 'outside');
    try { fs.symlinkSync(outside, linked, 'junction'); }
    catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return t.skip('symlink creation is unavailable on this host');
      throw error;
    }
    const index = {
      schemaVersion: EVIDENCE_AUTHORITY_SCHEMA,
      entries: [{ originalPath: 'archive/analysis/legacy/proof.json', authorityPath: 'archive/data/evidence-authority/v1/linked/proof.json',
        gitBlobSha1: 'a'.repeat(40), sha256: 'b'.repeat(64), sizeBytes: 7, classification: 'hot-authority', evidenceRole: 'fixture-proof', currentConsumers: ['fixture'] }]
    };
    fs.writeFileSync(path.join(temp, 'archive/data/evidence-authority/v1/index.json'), JSON.stringify(index));
    assert.throws(() => readHotEvidenceAuthority({ root: temp, originalPath: 'archive/analysis/legacy/proof.json' }), /SYMLINK_REJECTED/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
    if (outside) fs.rmSync(outside, { recursive: true, force: true });
  }
});

test('authority reader rejects traversal in index paths', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-authority-traversal-'));
  try {
    const indexPath = path.join(temp, 'archive/data/evidence-authority/v1/index.json');
    fs.mkdirSync(path.dirname(indexPath), { recursive: true });
    fs.writeFileSync(indexPath, JSON.stringify({
      schemaVersion: EVIDENCE_AUTHORITY_SCHEMA,
      entries: [{ originalPath: 'archive/analysis/../outside.json', authorityPath: 'archive/data/evidence-authority/v1/proof.json',
        gitBlobSha1: 'a'.repeat(40), sha256: 'b'.repeat(64), sizeBytes: 1, classification: 'hot-authority', evidenceRole: 'fixture', currentConsumers: ['fixture'] }]
    }));
    assert.throws(() => readHotEvidenceAuthority({ root: temp, originalPath: 'archive/analysis/../outside.json' }), /PATH_INVALID/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('authority index cannot be redirected through a symlink or junctioned parent', t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-authority-index-link-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'evidence-authority-index-outside-'));
  try {
    const authorityParent = path.join(temp, 'archive/data/evidence-authority');
    const linkedIndexDirectory = path.join(authorityParent, 'v1');
    fs.mkdirSync(authorityParent, { recursive: true });
    fs.writeFileSync(path.join(outside, 'index.json'), JSON.stringify({ schemaVersion: EVIDENCE_AUTHORITY_SCHEMA, entries: [] }));
    try { fs.symlinkSync(outside, linkedIndexDirectory, 'junction'); }
    catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return t.skip('symlink creation is unavailable on this host');
      throw error;
    }
    assert.throws(() => readHotEvidenceAuthority({ root: temp, originalPath: 'archive/analysis/legacy/proof.json' }), /SYMLINK_REJECTED/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
    fs.rmSync(outside, { recursive: true, force: true });
  }
});

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
