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
import { EVIDENCE_AUTHORITY_SCHEMA } from '../archive/tools/evidence-authority-v1.mjs';
import { FULLPATH_INDEX_SCHEMA, PACK_MANIFEST_SCHEMA, ROOT_RECEIPT_SCHEMA } from '../tools/archive-cold-evidence.mjs';

const repoRoot = path.resolve(import.meta.dirname, '..');
const originalManifest = JSON.parse(fs.readFileSync(path.join(repoRoot, 'tools/archive-analysis-recovery-manifest.v1.json'), 'utf8'));
const sourceReceipt = JSON.parse(fs.readFileSync(path.join(repoRoot, 'archive/data/archive-analysis-drive-root-receipt.v1.json'), 'utf8'));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');

function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
  }
  return (value ^ 0xffffffff) >>> 0;
}

function makeStoredZip(entries) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  for (const { name, bytes } of entries) {
    const nameBytes = Buffer.from(name, 'utf8');
    const crc = crc32(bytes);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(bytes.length, 18);
    local.writeUInt32LE(bytes.length, 22);
    local.writeUInt16LE(nameBytes.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, nameBytes, bytes);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(bytes.length, 20);
    central.writeUInt32LE(bytes.length, 24);
    central.writeUInt16LE(nameBytes.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(localOffset, 42);
    centralParts.push(central, nameBytes);
    localOffset += local.length + nameBytes.length + bytes.length;
  }
  const centralBytes = Buffer.concat(centralParts);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBytes.length, 12);
  eocd.writeUInt32LE(localOffset, 16);
  return Buffer.concat([...localParts, centralBytes, eocd]);
}

function tempDirectory(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `archive-analysis-recovery-${label}-`));
}

function removeOwnedTempDirectory(directory) {
  const tempRoot = fs.realpathSync(os.tmpdir());
  const resolved = fs.realpathSync(directory);
  assert.equal(path.dirname(resolved), tempRoot);
  assert.ok(path.basename(resolved).startsWith('archive-analysis-recovery-'));
  fs.rmSync(resolved, { recursive: true, force: true });
}

function writeJson(root, relativePath, value) {
  const destination = path.join(root, ...relativePath.split('/'));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(value, null, 2)}\n`);
  return destination;
}

function buildOfflineFixture() {
  const root = tempDirectory('offline-drive-fixture');
  const manifest = structuredClone(originalManifest);
  const rawByEntry = new Map();
  const blobGroups = new Map();
  const filesByPath = new Map();
  for (const [ordinal, entry] of manifest.entries.entries()) {
    const groupKey = entry.gitBlobSha1;
    let raw = rawByEntry.get(groupKey);
    if (!raw) {
      raw = Buffer.from(`synthetic recovery payload ${ordinal}:${groupKey}\n`, 'utf8');
      rawByEntry.set(groupKey, raw);
    }
    entry.gitBlobSha1 = gitBlobSha1(raw);
    entry.sha256 = sha256(raw);
    entry.sizeBytes = raw.length;
    const group = blobGroups.get(entry.gitBlobSha1) || { raw, paths: new Set() };
    group.paths.add(entry.originalPath);
    group.paths.add(entry.retainedIdenticalPath);
    blobGroups.set(entry.gitBlobSha1, group);
    for (const repoPath of [entry.originalPath, entry.retainedIdenticalPath]) {
      const previous = filesByPath.get(repoPath);
      if (previous && !previous.raw.equals(raw)) throw new Error(`FIXTURE_PATH_BLOB_CONFLICT:${repoPath}`);
      filesByPath.set(repoPath, { repoPath, raw, blob: entry.gitBlobSha1 });
    }
  }

  const referenceBytes = new Map();
  const sharedReferenceBytes = Buffer.from('synthetic historical reference\n', 'utf8');
  for (const entry of manifest.entries) for (const reference of entry.historicalReferenceFiles) {
    if (!referenceBytes.has(reference)) referenceBytes.set(reference, sharedReferenceBytes);
  }
  for (const [reference, raw] of referenceBytes) {
    const blob = gitBlobSha1(raw);
    const group = blobGroups.get(blob) || { raw, paths: new Set() };
    group.paths.add(reference);
    blobGroups.set(blob, group);
    filesByPath.set(reference, { repoPath: reference, raw, blob });
  }

  manifest.scope.headCheckoutBytesReduced = manifest.entries.reduce((sum, entry) => sum + entry.sizeBytes, 0);
  manifest.scope.removedPathCount = manifest.entries.length;
  manifest.scope.historicalReferenceFileCount = referenceBytes.size;
  manifest.scope.historicalReferenceMentionCount = manifest.entries.reduce((sum, entry) => sum + entry.historicalReferenceFiles.length, 0);
  manifest.scope.baselineArchiveAnalysisPathCount = filesByPath.size;
  manifest.scope.baselineArchiveAnalysisPathBytes = [...filesByPath.values()].reduce((sum, item) => sum + item.raw.length, 0);
  const manifestPath = writeJson(root, 'tools/archive-analysis-recovery-manifest.v1.json', manifest);

  const packName = 'archive-analysis-recovery-fixture.zip';
  const indexFiles = [];
  for (const [blob, group] of blobGroups) {
    const member = `objects/${blob}`;
    const aliases = [...group.paths].sort();
    const row = {
      member,
      memberSha256: sha256(group.raw),
      memberBytes: group.raw.length,
      gitBlobSha1: blob,
      sha256: sha256(group.raw),
      sizeBytes: group.raw.length,
      chunkIndex: 0,
      chunkCount: 1,
      startByte: 0,
      endByteExclusive: group.raw.length,
      originalPaths: aliases
    };
    for (const originalPath of aliases) {
      indexFiles.push({
        originalPath,
        gitBlobSha1: blob,
        sha256: row.sha256,
        sizeBytes: row.sizeBytes,
        classification: 'cold-evidence',
        objectPacks: [{
          pack: packName,
          member,
          memberSha256: row.memberSha256,
          memberBytes: row.memberBytes,
          chunkIndex: 0,
          chunkCount: 1,
          startByte: 0,
          endByteExclusive: group.raw.length
        }]
      });
    }
    group.packManifestRow = row;
  }
  const packManifest = {
    schemaVersion: PACK_MANIFEST_SCHEMA,
    pack: packName,
    cohort: 'archive-analysis-recovery-fixture',
    baselineCommit: manifest.baselineCommit,
    baselineAnalysisTreeSha: manifest.baselineArchiveAnalysisTreeSha,
    objects: [...blobGroups.values()].map(group => group.packManifestRow)
  };
  const zipEntries = [{ name: 'MANIFEST.json', bytes: Buffer.from(`${JSON.stringify(packManifest)}\n`) }];
  for (const group of blobGroups.values()) zipEntries.push({ name: `objects/${group.packManifestRow.gitBlobSha1}`, bytes: group.raw });
  const zipBytes = makeStoredZip(zipEntries);

  const allowedRoots = ['archive/analysis/'];
  const index = {
    schemaVersion: FULLPATH_INDEX_SCHEMA,
    cohort: 'archive-analysis-recovery-fixture',
    baselineCommit: manifest.baselineCommit,
    baselineAnalysisTreeSha: manifest.baselineArchiveAnalysisTreeSha,
    allowedRoots,
    pathCount: indexFiles.length,
    uniqueBlobCount: blobGroups.size,
    pathBytes: indexFiles.reduce((sum, item) => sum + item.sizeBytes, 0),
    uniqueRawBytes: [...blobGroups.values()].reduce((sum, group) => sum + group.raw.length, 0),
    files: indexFiles
  };
  const indexBytes = Buffer.from(`${JSON.stringify(index)}\n`);
  const indexFile = path.join(root, 'downloads', 'fullpath-index.json');
  fs.mkdirSync(path.dirname(indexFile), { recursive: true });
  fs.writeFileSync(indexFile, indexBytes);
  const packDirectory = path.join(root, 'downloads', 'packs');
  fs.mkdirSync(packDirectory, { recursive: true });
  fs.writeFileSync(path.join(packDirectory, packName), zipBytes);

  const parentId = 'fixture-vault-parent';
  const modifiedTime = '2026-10-15T20:00:00.000Z';
  const driveRow = (name, mimeType, bytes, id) => ({
    name,
    sizeBytes: bytes.length,
    sha256: sha256(bytes),
    driveFileId: id,
    driveParentId: parentId,
    driveName: name,
    driveMimeType: mimeType,
    driveSizeBytes: bytes.length,
    driveReadback: {
      status: 'FULL_BYTES_VERIFIED',
      sha256: sha256(bytes),
      sizeBytes: bytes.length,
      verifiedAtUtc: modifiedTime,
      method: 'fixture authenticated readback'
    },
    sourceVersion: { id, parentIds: [parentId], observedModifiedTime: modifiedTime }
  });
  const hotIndex = {
    schemaVersion: EVIDENCE_AUTHORITY_SCHEMA,
    status: 'EXACT_BYTES_MATERIALIZED_NO_QUALITY_GATE_CHANGE',
    baselineCommit: manifest.baselineCommit,
    entries: []
  };
  const hotIndexPath = writeJson(root, 'archive/data/evidence-authority/v1/index.json', hotIndex);
  const hotBytes = fs.readFileSync(hotIndexPath);
  const indexRow = driveRow('archive-analysis-recovery-fixture-index.json', 'application/json', indexBytes, 'fixture-index-id');
  const packRow = { ...driveRow(packName, 'application/zip', zipBytes, 'fixture-pack-id'), cohort: index.cohort, objectUnits: blobGroups.size, pathAliases: indexFiles.length };
  const receipt = {
    schemaVersion: ROOT_RECEIPT_SCHEMA,
    status: 'FULL_BYTES_VERIFIED',
    method: 'fixture: every decompressed raw object/alias verified against original Git blobs',
    verifiedAtUtc: modifiedTime,
    cohort: index.cohort,
    baselineCommit: manifest.baselineCommit,
    baselineAnalysisTreeSha: manifest.baselineArchiveAnalysisTreeSha,
    baselineRootTreeShas: { 'archive/analysis': manifest.baselineArchiveAnalysisTreeSha },
    allowedRoots,
    pathCount: index.pathCount,
    uniqueBlobCount: index.uniqueBlobCount,
    pathBytes: index.pathBytes,
    uniqueRawBytes: index.uniqueRawBytes,
    preservationSummary: {
      analysisBaselinePathCount: manifest.scope.baselineArchiveAnalysisPathCount,
      analysisBaselinePathBytes: manifest.scope.baselineArchiveAnalysisPathBytes
    },
    trackingRemovalSummary: {
      currentHead: sourceReceipt.trackingRemovalSummary.currentHead,
      status: 'EXACT_INDEX_ONLY_REMOVAL_VERIFIED',
      pathCount: index.pathCount,
      pathBytes: index.pathBytes,
      previouslyRemovedAliasCount: manifest.entries.length,
      previouslyRemovedAliasBytes: manifest.scope.headCheckoutBytesReduced
    },
    historyRewrite: false,
    historicalGitStorageBytesReduced: 0,
    indexSizeBytes: indexBytes.length,
    indexSha256: sha256(indexBytes),
    index: indexRow,
    packCount: 1,
    packBytes: zipBytes.length,
    packs: [packRow],
    sourceManifests: [],
    hotAuthorityExclusion: {
      sourcePath: 'archive/data/evidence-authority/v1/index.json',
      indexSha256: sha256(hotBytes),
      entryCount: 0,
      excludedPathBytes: 0
    }
  };
  const receiptPath = writeJson(root, 'archive/data/archive-analysis-drive-root-receipt.v1.json', receipt);
  const output = path.join(root, 'restored-output');
  fs.mkdirSync(output);
  return { root, manifest, manifestPath, receiptPath, indexFile, packDirectory, output, filesByPath };
}

test('all 11 catalog paths restore from only local verified Drive packs and refuse overwrite', async () => {
  const fixture = buildOfflineFixture();
  try {
    const paths = fixture.manifest.entries.map(entry => entry.originalPath);
    const restored = await restoreRecoveryPaths({
      root: fixture.root,
      paths,
      destinationRoot: fixture.output,
      manifestPath: fixture.manifestPath,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    });
    assert.equal(restored.restored.length, 11);
    assert.equal(restored.status, 'DRIVE_VERIFIED_OFFLINE');
    assert.equal(restored.technicalOnly, true);
    assert.equal(restored.baselineAvailable, false);
    assert.equal(restored.restored.reduce((total, entry) => total + entry.sizeBytes, 0), fixture.manifest.scope.headCheckoutBytesReduced);
    for (const entry of fixture.manifest.entries) {
      const restoredPath = path.join(fixture.output, ...entry.originalPath.split('/'));
      const bytes = fs.readFileSync(restoredPath);
      assert.equal(bytes.length, entry.sizeBytes, `${entry.originalPath} byte count`);
      assert.equal(sha256(bytes), entry.sha256, `${entry.originalPath} SHA-256`);
      assert.equal(gitBlobSha1(bytes), entry.gitBlobSha1, `${entry.originalPath} Git blob`);
    }

    const first = fixture.manifest.entries[0];
    const restoredPath = path.join(fixture.output, ...first.originalPath.split('/'));
    const before = fs.readFileSync(restoredPath);
    await assert.rejects(restoreRecoveryPaths({
      root: fixture.root,
      paths: [first.originalPath],
      destinationRoot: fixture.output,
      manifestPath: fixture.manifestPath,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    }), /RECOVERY_TARGET_EXISTS/);
    assert.deepEqual(fs.readFileSync(restoredPath), before);
  } finally {
    removeOwnedTempDirectory(fixture.root);
  }
});

test('check verifies Drive packs offline without requiring D305 or 276 Git objects', async () => {
  const trackedManifest = loadRecoveryManifest(repoRoot);
  assert.equal(trackedManifest.manifest.entries.length, 11);
  assert.equal(trackedManifest.totalBytes, 326_839_777);
  const fixture = buildOfflineFixture();
  try {
    assert.equal(fs.existsSync(path.join(fixture.root, '.git')), false, 'fixture intentionally has no Git history');
    const report = await checkRecoveryManifest({
      root: fixture.root,
      manifestPath: fixture.manifestPath,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    });
    assert.equal(report.status, 'DRIVE_VERIFIED_OFFLINE');
    assert.equal(report.technicalOnly, true);
    assert.equal(report.baselineAvailable, false);
    assert.equal(report.missingHeadReferenceCount, 25);
    assert.equal(report.baselineArchiveAnalysisPathCount, fixture.manifest.scope.baselineArchiveAnalysisPathCount);
    assert.equal(report.baselineArchiveAnalysisBytes, fixture.manifest.scope.baselineArchiveAnalysisPathBytes);
    assert.equal(report.driveRootReceiptPath, 'archive/data/archive-analysis-drive-root-receipt.v1.json');
    assert.match(report.driveIndexSha256, /^[0-9a-f]{64}$/);
  } finally {
    removeOwnedTempDirectory(fixture.root);
  }
});

test('current/index reference parity still rejects drift without historical baseline objects', async () => {
  const reference = 'archive/analysis/example/historical-reference.json';
  const baselineObject = '1'.repeat(40);
  assert.equal(assertHistoricalReferenceParity(reference, { baselineObject, headObject: baselineObject }), 'unchanged');
  assert.equal(assertHistoricalReferenceParity(reference, { baselineObject, headObject: null }), 'archived-baseline');
  assert.throws(
    () => assertHistoricalReferenceParity(reference, { baselineObject, headObject: '2'.repeat(40) }),
    /RECOVERY_HISTORICAL_REFERENCE_CHANGED/
  );
  assert.throws(
    () => assertHistoricalReferenceParity(reference, { baselineObject, headObject: null, committedHeadObject: '2'.repeat(40) }),
    /RECOVERY_HISTORICAL_REFERENCE_CHANGED/
  );

  const fixture = buildOfflineFixture();
  try {
    const changedReference = fixture.manifest.entries[0].historicalReferenceFiles[0];
    const changedBytes = Buffer.from('current Git history was changed\n');
    const target = path.join(fixture.root, ...changedReference.split('/'));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, changedBytes);
    execFileSync('git', ['init', '--quiet'], { cwd: fixture.root });
    execFileSync('git', ['config', 'user.email', 'recovery-fixture@example.invalid'], { cwd: fixture.root });
    execFileSync('git', ['config', 'user.name', 'Recovery Fixture'], { cwd: fixture.root });
    execFileSync('git', ['add', '--', changedReference], { cwd: fixture.root });
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture current reference'], { cwd: fixture.root });
    await assert.rejects(checkRecoveryManifest({
      root: fixture.root,
      manifestPath: fixture.manifestPath,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    }), /RECOVERY_HISTORICAL_REFERENCE_CHANGED/);
  } finally {
    removeOwnedTempDirectory(fixture.root);
  }
});

test('check without downloaded sidecar/packs remains unavailable and gives migration instructions', async () => {
  const fixture = buildOfflineFixture();
  try {
    await assert.rejects(checkRecoveryManifest({ root: fixture.root, manifestPath: fixture.manifestPath, receiptPath: fixture.receiptPath }), /MIGRATED_TO_DRIVE/);
    const packPath = path.join(fixture.packDirectory, 'archive-analysis-recovery-fixture.zip');
    fs.unlinkSync(packPath);
    await assert.rejects(checkRecoveryManifest({
      root: fixture.root,
      manifestPath: fixture.manifestPath,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    }), /MIGRATED_TO_DRIVE/);
  } finally {
    removeOwnedTempDirectory(fixture.root);
  }
});

test('recovery rejects traversal and a changed manifest SHA before writing', async () => {
  const fixture = buildOfflineFixture();
  try {
    await assert.rejects(restoreRecoveryPaths({
      root: fixture.root,
      paths: ['archive/analysis/../../outside.json'],
      destinationRoot: fixture.output,
      manifestPath: fixture.manifestPath,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    }), /RECOVERY_PATH_INVALID/);

    const manifest = structuredClone(fixture.manifest);
    const entry = manifest.entries[0];
    entry.sha256 = '0'.repeat(64);
    const alteredManifest = writeJson(fixture.root, 'tools/altered-manifest.json', manifest);
    await assert.rejects(restoreRecoveryPaths({
      root: fixture.root,
      paths: [entry.originalPath],
      destinationRoot: fixture.output,
      manifestPath: alteredManifest,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    }), /RECOVERY_DRIVE_MANIFEST_BINDING_MISMATCH/);
    assert.equal(fs.existsSync(path.join(fixture.output, ...entry.originalPath.split('/'))), false);
  } finally {
    removeOwnedTempDirectory(fixture.root);
  }
});

test('recovery rejects a symlinked parent component before writing', async t => {
  const fixture = buildOfflineFixture();
  const outside = tempDirectory('outside');
  try {
    try { fs.symlinkSync(outside, path.join(fixture.output, 'archive'), 'junction'); }
    catch (error) {
      if (['EPERM', 'EACCES', 'ENOTSUP'].includes(error.code)) return t.skip('symlink creation is unavailable on this host');
      throw error;
    }
    const entry = fixture.manifest.entries[0];
    await assert.rejects(restoreRecoveryPaths({
      root: fixture.root,
      paths: [entry.originalPath],
      destinationRoot: fixture.output,
      manifestPath: fixture.manifestPath,
      receiptPath: fixture.receiptPath,
      indexFile: fixture.indexFile,
      packDirectory: fixture.packDirectory
    }), /RECOVERY_PARENT_NOT_DIRECTORY/);
    assert.equal(fs.readdirSync(outside).length, 0);
  } finally {
    removeOwnedTempDirectory(fixture.root);
    removeOwnedTempDirectory(outside);
  }
});
