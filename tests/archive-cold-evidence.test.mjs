import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { deflateRawSync } from 'node:zlib';
import test from 'node:test';

import {
  COLD_EVIDENCE_CACHE,
  FULLPATH_INDEX_SCHEMA,
  PACK_MANIFEST_SCHEMA,
  ROOT_RECEIPT_SCHEMA,
  readVerifiedZipMembers,
  resolveColdEvidenceFromPack
} from '../tools/archive-cold-evidence.mjs';
import { readHotEvidenceAuthority } from '../archive/tools/evidence-authority-v1.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const baselineCommit = 'a'.repeat(40);
const baselineAnalysisTreeSha = 'b'.repeat(40);
const originalPath = 'archive/analysis/cohort/R1.evidence.json';
const ROOT = path.resolve(import.meta.dirname, '..');

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < table.length; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    table[index] = value >>> 0;
  }
  return table;
})();
function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = CRC_TABLE[(value ^ byte) & 0xff] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

function zipBytes(entries) {
  const localParts = [];
  const centralParts = [];
  let localOffset = 0;
  for (const entry of entries) {
    const name = Buffer.from(entry.name, 'ascii');
    const raw = Buffer.from(entry.bytes);
    const compressed = deflateRawSync(raw);
    const checksum = crc32(raw);
    const local = Buffer.alloc(30 + name.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    name.copy(local, 30);
    localParts.push(local, compressed);

    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE((3 << 8) | 20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(entry.symlink ? 0xa1ff0000 : 0x81a40000, 38);
    central.writeUInt32LE(localOffset, 42);
    name.copy(central, 46);
    centralParts.push(central);
    localOffset += local.length + compressed.length;
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

function packReceiptAndIndex(raw, { chunks = 1, maliciousClassification = false, manifestAliases = [], hotOnly = null } = {}) {
  const blobSha = gitBlobSha1(raw);
  const digest = sha256(raw);
  const cohort = 'fixture-cold-evidence';
  const packNames = Array.from({ length: chunks }, (_, index) => `${cohort}-${String(index + 1).padStart(4, '0')}.zip`);
  const packBlobs = [];
  const objectPacks = [];
  const packRows = [];
  let offset = 0;

  for (let part = 0; part < chunks; part += 1) {
    const startByte = chunks === 1 ? 0 : offset;
    const endByteExclusive = chunks === 1 ? raw.length : Math.floor(raw.length * (part + 1) / chunks);
    const payload = raw.subarray(startByte, endByteExclusive);
    const member = chunks === 1 ? `objects/${blobSha}` : `objects/${blobSha}.part-${String(part + 1).padStart(4, '0')}-of-${String(chunks).padStart(4, '0')}`;
    const objectRow = {
      gitBlobSha1: blobSha,
      sha256: digest,
      sizeBytes: raw.length,
      member,
      memberSha256: sha256(payload),
      memberBytes: payload.length,
      chunkIndex: chunks === 1 ? 0 : part + 1,
      chunkCount: chunks,
      startByte,
      endByteExclusive,
      originalPaths: [originalPath, ...manifestAliases]
    };
    const packName = packNames[part];
    const objectRows = [objectRow];
    const zipObjects = [{ name: member, bytes: payload }];
    if (hotOnly && chunks === 1) {
      const hotBytes = Buffer.from(hotOnly.bytes);
      const hotBlob = gitBlobSha1(hotBytes);
      const hotMember = `objects/${hotBlob}`;
      objectRows.push({
        gitBlobSha1: hotBlob,
        sha256: sha256(hotBytes),
        sizeBytes: hotBytes.length,
        member: hotMember,
        memberSha256: sha256(hotBytes),
        memberBytes: hotBytes.length,
        chunkIndex: 0,
        chunkCount: 1,
        startByte: 0,
        endByteExclusive: hotBytes.length,
        originalPaths: [hotOnly.originalPath]
      });
      zipObjects.push({ name: hotMember, bytes: hotBytes });
    }
    const manifest = {
      schemaVersion: PACK_MANIFEST_SCHEMA,
      cohort,
      baselineCommit,
      baselineAnalysisTreeSha,
      pack: packName,
      objects: objectRows
    };
    const bytes = zipBytes([
      ...zipObjects,
      { name: 'MANIFEST.json', bytes: Buffer.from(JSON.stringify(manifest), 'utf8') }
    ]);
    packBlobs.push(bytes);
    const driveFileId = `drive_pack_${part + 1}`;
    objectPacks.push({
      pack: packName,
      member,
      chunkIndex: objectRow.chunkIndex,
      chunkCount: chunks,
      memberSha256: objectRow.memberSha256,
      memberBytes: objectRow.memberBytes
    });
    packRows.push({
      cohort,
      name: packName,
      sizeBytes: bytes.length,
      sha256: sha256(bytes),
      objectUnits: 1,
      pathAliases: 1,
      driveFileId,
      driveName: packName,
      driveParentId: 'drive_vault_root',
      driveMimeType: 'application/zip',
      driveSizeBytes: bytes.length,
      driveReadback: { status: 'FULL_BYTES_VERIFIED', sha256: sha256(bytes), sizeBytes: bytes.length, verifiedAtUtc: '2026-10-16T00:00:00Z', method: 'MCP_DOWNLOAD_AND_SHA256' },
      sourceVersion: { id: driveFileId, parentIds: ['drive_vault_root'], observedModifiedTime: '2026-10-15T23:00:00Z' }
    });
    offset = endByteExclusive;
  }

  const index = {
    schemaVersion: FULLPATH_INDEX_SCHEMA,
    allowedRoots: ['archive/analysis/'],
    cohort,
    baselineCommit,
    baselineAnalysisTreeSha,
    pathCount: 1,
    uniqueBlobCount: 1,
    pathBytes: raw.length,
    uniqueRawBytes: raw.length,
    files: [{
      originalPath,
      gitBlobSha1: blobSha,
      sha256: digest,
      sizeBytes: raw.length,
      classification: maliciousClassification ? 'hot-authority' : 'cold-evidence',
      objectPacks
    }]
  };
  const indexBytes = Buffer.from(`${JSON.stringify(index)}\n`, 'utf8');
  const hotIndexBytes = fs.readFileSync(path.join(ROOT, 'archive/data/evidence-authority/v1/index.json'));
  const hotIndex = JSON.parse(hotIndexBytes.toString('utf8'));
  const receipt = {
    schemaVersion: ROOT_RECEIPT_SCHEMA,
    status: 'FULL_BYTES_VERIFIED',
    method: 'MCP metadata + authenticated streamed raw download + local full SHA-256',
    verifiedAtUtc: '2026-10-16T01:00:00Z',
    allowedRoots: ['archive/analysis/'],
    cohort,
    baselineCommit,
    baselineAnalysisTreeSha,
    packCount: packRows.length,
    pathCount: 1,
    uniqueBlobCount: 1,
    pathBytes: raw.length,
    uniqueRawBytes: raw.length,
    packBytes: packRows.reduce((sum, row) => sum + row.sizeBytes, 0),
    baselineRootTreeShas: { 'archive/analysis': baselineAnalysisTreeSha },
    hotAuthorityExclusion: {
      sourcePath: 'archive/data/evidence-authority/v1/index.json',
      indexSha256: sha256(hotIndexBytes),
      entryCount: hotIndex.entries.length,
      excludedPathBytes: hotIndex.entries.reduce((sum, entry) => sum + entry.sizeBytes, 0)
    },
    indexPath: `${cohort}.index.json`,
    indexSizeBytes: indexBytes.length,
    indexSha256: sha256(indexBytes),
    index: {
      name: `${cohort}.index.json`,
      sizeBytes: indexBytes.length,
      sha256: sha256(indexBytes),
      driveFileId: 'drive_index_123',
      driveParentId: 'drive_vault_root',
      driveName: `${cohort}.index.json`,
      driveMimeType: 'application/json',
      driveSizeBytes: indexBytes.length,
      driveReadback: { status: 'FULL_BYTES_VERIFIED', sha256: sha256(indexBytes), sizeBytes: indexBytes.length, verifiedAtUtc: '2026-10-16T00:00:00Z', method: 'MCP_DOWNLOAD_AND_SHA256' },
      sourceVersion: { id: 'drive_index_123', parentIds: ['drive_vault_root'], observedModifiedTime: '2026-10-15T23:00:00Z' }
    },
    packs: packRows
  };
  return { raw, blobSha, digest, cohort, packBlobs, indexBytes, index, receipt, indexDownloadMetadata: {
    id: 'drive_index_123', file_name: `${cohort}.index.json`, mime_type: 'application/json', file_size_bytes: indexBytes.length,
    parent_ids: ['drive_vault_root'], modified_time: '2026-10-15T23:00:00Z', bytes: indexBytes
  } };
}

function makeRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cold-pack-hydration-'));
  fs.mkdirSync(path.join(root, '.codex'), { recursive: true });
  fs.writeFileSync(path.join(root, '.gitignore'), `${COLD_EVIDENCE_CACHE}/\n`);
  execFileSync('git', ['init', '--quiet'], { cwd: root, stdio: 'ignore' });
  const hotIndex = 'archive/data/evidence-authority/v1/index.json';
  const canonicalManifest = 'archive/data/archive2-canonical-input-manifest.json';
  for (const relative of [hotIndex, canonicalManifest]) {
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(ROOT, relative), destination);
  }
  return root;
}

function rewriteIndexFixture(fixture, mutate) {
  const index = JSON.parse(fixture.indexBytes.toString('utf8'));
  mutate(index);
  const bytes = Buffer.from(`${JSON.stringify(index)}\n`, 'utf8');
  fixture.index = index;
  fixture.indexBytes = bytes;
  fixture.receipt.cohort = index.cohort;
  fixture.receipt.allowedRoots = [...index.allowedRoots];
  fixture.receipt.indexSizeBytes = bytes.length;
  fixture.receipt.indexSha256 = sha256(bytes);
  Object.assign(fixture.receipt.index, { sizeBytes: bytes.length, sha256: sha256(bytes), driveSizeBytes: bytes.length });
  Object.assign(fixture.receipt.index.driveReadback, { sizeBytes: bytes.length, sha256: sha256(bytes) });
  Object.assign(fixture.indexDownloadMetadata, { file_size_bytes: bytes.length, bytes });
  return fixture;
}

function driveAdapter(fixture, wrongIdFor = null) {
  let calls = 0;
  const downloadDrivePack = async driveFileId => {
    calls += 1;
    const index = fixture.receipt.packs.findIndex(pack => pack.driveFileId === driveFileId);
    const pack = fixture.receipt.packs[index];
    return {
      id: wrongIdFor === driveFileId ? 'wrong_drive_file' : driveFileId,
      file_name: pack.driveName,
      mime_type: pack.driveMimeType,
      file_size_bytes: pack.sizeBytes,
      parent_ids: [pack.driveParentId],
      modified_time: pack.sourceVersion.observedModifiedTime,
      bytes: fixture.packBlobs[index]
    };
  };
  return { downloadDrivePack, calls: () => calls };
}

test('hydrates an exact Drive pack object to an ignored cache and reuses it offline', async () => {
  const root = makeRoot();
  try {
    const fixture = packReceiptAndIndex(Buffer.from('{"review":"REVIEWED","items":[1,2]}\n'));
    rewriteIndexFixture(fixture, index => { index.cohort = 'merged-cold-index'; });
    const adapter = driveAdapter(fixture);
    const first = await resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes, fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: adapter.downloadDrivePack });
    assert.equal(first.source, 'verified-drive-pack');
    assert.deepEqual(first.bytes, fixture.raw);
    assert.equal(first.gitBlobSha1, fixture.blobSha);
    assert.equal(first.sha256, fixture.digest);
    assert.doesNotThrow(() => execFileSync('git', ['check-ignore', '-q', '--', first.cachePath], { cwd: root, stdio: 'ignore' }));

    let indexFetchCount = 0;
    const second = await resolveColdEvidenceFromPack({
      root, originalPath, receipt: fixture.receipt,
      downloadDriveIndex: async driveFileId => {
        indexFetchCount += 1;
        assert.equal(driveFileId, 'drive_index_123');
        return fixture.indexDownloadMetadata;
      }
    });
    assert.equal(second.source, 'verified-local-cache');
    assert.deepEqual(second.bytes, fixture.raw);
    assert.equal(adapter.calls(), 1);
    assert.equal(indexFetchCount, 1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('reconstructs chunked objects across packs before checking full raw hashes', async () => {
  const root = makeRoot();
  try {
    const fixture = packReceiptAndIndex(Buffer.from('abcdefghij'.repeat(500)), { chunks: 2 });
    const adapter = driveAdapter(fixture);
    const result = await resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes, fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: adapter.downloadDrivePack });
    assert.deepEqual(result.bytes, fixture.raw);
    assert.equal(result.bytes.length, fixture.raw.length);
    assert.equal(result.gitBlobSha1, fixture.blobSha);
    assert.equal(adapter.calls(), 2);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('permits only verified hot aliases in full-vault ZIP manifests while resolving a cold alias', async () => {
  const root = makeRoot();
  try {
    const hotPath = 'archive/analysis/palma-mock-builder-20261010/Q23_VISUAL/finalQ23_VISUAL_MANIFEST.json';
    const raw = readHotEvidenceAuthority({ root: ROOT, originalPath: hotPath }).bytes;
    const fixture = packReceiptAndIndex(raw, { manifestAliases: [hotPath] });
    const adapter = driveAdapter(fixture);
    const result = await resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes,
      fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: adapter.downloadDrivePack });
    assert.deepEqual(result.bytes, raw);
    assert.equal(result.source, 'verified-drive-pack');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('permits hot-only objects embedded in a preservation pack only when every alias is hot', async () => {
  const root = makeRoot();
  try {
    const hotPath = 'archive/analysis/palma-mock-builder-20261010/Q23_VISUAL/finalQ23_VISUAL_MANIFEST.json';
    const hotBytes = readHotEvidenceAuthority({ root: ROOT, originalPath: hotPath }).bytes;
    const fixture = packReceiptAndIndex(Buffer.from('cold object in the same full-preservation pack'), { hotOnly: { originalPath: hotPath, bytes: hotBytes } });
    const adapter = driveAdapter(fixture);
    const result = await resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes,
      fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: adapter.downloadDrivePack });
    assert.deepEqual(result.bytes, fixture.raw);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('downloads the connector file_uri without persisting or echoing its signed URL', async () => {
  const root = makeRoot();
  const originalFetch = global.fetch;
  try {
    const fixture = packReceiptAndIndex(Buffer.from('connector materialized bytes'));
    const pack = fixture.receipt.packs[0];
    const adapter = async driveFileId => ({
      id: driveFileId,
      file_name: pack.driveName,
      mime_type: pack.driveMimeType,
      file_size_bytes: pack.sizeBytes,
      parent_ids: [pack.driveParentId],
      modified_time: pack.sourceVersion.observedModifiedTime,
      file_uri: { download_url: 'https://files.oaiusercontent.com/short-lived-test-token' }
    });
    global.fetch = async url => {
      assert.equal(new URL(url).hostname, 'files.oaiusercontent.com');
      return new Response(fixture.packBlobs[0], { status: 200 });
    };
    const result = await resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes, fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: adapter });
    assert.deepEqual(result.bytes, fixture.raw);
  } finally {
    global.fetch = originalFetch;
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('rejects an oversized streamed Drive response before reading or buffering it', async () => {
  const root = makeRoot();
  const originalFetch = global.fetch;
  try {
    const fixture = packReceiptAndIndex(Buffer.from('must not be downloaded'));
    const pack = fixture.receipt.packs[0];
    let cancelled = false;
    let readerRequested = false;
    const adapter = async driveFileId => ({
      id: driveFileId,
      file_name: pack.driveName,
      mime_type: pack.driveMimeType,
      file_size_bytes: pack.driveSizeBytes,
      parent_ids: [pack.driveParentId],
      modified_time: pack.sourceVersion.observedModifiedTime,
      file_uri: { download_url: 'https://files.oaiusercontent.com/oversized-test-token' }
    });
    global.fetch = async () => ({
      ok: true,
      headers: { get: name => name.toLowerCase() === 'content-length' ? String(64 * 1024 * 1024 + 1) : null },
      body: {
        cancel: async () => { cancelled = true; },
        getReader: () => { readerRequested = true; throw new Error('must not read oversized body'); }
      }
    });
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes,
      fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: adapter }), /FILE_TOO_LARGE/);
    assert.equal(cancelled, true);
    assert.equal(readerRequested, false);
  } finally {
    global.fetch = originalFetch;
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('hydrates aliases from separate roots and pack cohorts when Git blob bytes match', async () => {
  const root = makeRoot();
  try {
    const fixture = packReceiptAndIndex(Buffer.from('same blob in two cold cohorts'));
    const aliasPath = 'reports/archive-readiness/same-evidence.json';
    const packName = 'fixture-additional-cold-roots-0001.zip';
    const member = `objects/${fixture.blobSha}`;
    const manifestRow = {
      gitBlobSha1: fixture.blobSha,
      sha256: fixture.digest,
      sizeBytes: fixture.raw.length,
      member,
      memberSha256: fixture.digest,
      memberBytes: fixture.raw.length,
      chunkIndex: 0,
      chunkCount: 1,
      startByte: 0,
      endByteExclusive: fixture.raw.length,
      originalPaths: [aliasPath]
    };
    const manifest = {
      schemaVersion: PACK_MANIFEST_SCHEMA,
      cohort: 'fixture-additional-cold-roots',
      baselineCommit,
      baselineAnalysisTreeSha,
      pack: packName,
      objects: [manifestRow]
    };
    const secondPackBytes = zipBytes([
      { name: member, bytes: fixture.raw },
      { name: 'MANIFEST.json', bytes: Buffer.from(JSON.stringify(manifest), 'utf8') }
    ]);
    const secondPackSha = sha256(secondPackBytes);
    const secondDriveId = 'drive_pack_additional_1';
    const timestamp = '2026-10-15T23:00:00Z';
    fixture.index.allowedRoots = ['archive/analysis/', 'reports/'];
    fixture.index.files.push({
      originalPath: aliasPath,
      gitBlobSha1: fixture.blobSha,
      sha256: fixture.digest,
      sizeBytes: fixture.raw.length,
      classification: 'cold-evidence',
      objectPacks: [{ pack: packName, member, chunkIndex: 0, chunkCount: 1,
        memberSha256: fixture.digest, memberBytes: fixture.raw.length }]
    });
    fixture.index.pathCount = 2;
    fixture.index.pathBytes = fixture.raw.length * 2;
    fixture.receipt.allowedRoots = [...fixture.index.allowedRoots];
    fixture.receipt.pathCount = 2;
    fixture.receipt.pathBytes = fixture.raw.length * 2;
    fixture.receipt.packs.push({
      cohort: 'fixture-additional-cold-roots',
      name: packName,
      sizeBytes: secondPackBytes.length,
      sha256: secondPackSha,
      objectUnits: 1,
      pathAliases: 1,
      driveFileId: secondDriveId,
      driveName: packName,
      driveParentId: 'drive_vault_root',
      driveMimeType: 'application/zip',
      driveSizeBytes: secondPackBytes.length,
      driveReadback: { status: 'FULL_BYTES_VERIFIED', sha256: secondPackSha, sizeBytes: secondPackBytes.length,
        verifiedAtUtc: '2026-10-16T00:00:00Z', method: 'MCP_DOWNLOAD_AND_SHA256' },
      sourceVersion: { id: secondDriveId, parentIds: ['drive_vault_root'], observedModifiedTime: timestamp }
    });
    fixture.receipt.packCount += 1;
    fixture.receipt.packBytes += secondPackBytes.length;
    fixture.packBlobs.push(secondPackBytes);
    const bytes = Buffer.from(`${JSON.stringify(fixture.index)}\n`, 'utf8');
    fixture.indexBytes = bytes;
    fixture.receipt.indexSizeBytes = bytes.length;
    fixture.receipt.indexSha256 = sha256(bytes);
    Object.assign(fixture.receipt.index, { sizeBytes: bytes.length, sha256: sha256(bytes), driveSizeBytes: bytes.length });
    Object.assign(fixture.receipt.index.driveReadback, { sizeBytes: bytes.length, sha256: sha256(bytes) });
    Object.assign(fixture.indexDownloadMetadata, { file_size_bytes: bytes.length, bytes });

    const downloadDrivePack = async driveFileId => {
      const row = fixture.receipt.packs.find(pack => pack.driveFileId === driveFileId);
      const index = fixture.receipt.packs.indexOf(row);
      return {
        id: driveFileId,
        file_name: row.driveName,
        mime_type: row.driveMimeType,
        file_size_bytes: row.driveSizeBytes,
        parent_ids: [row.driveParentId],
        modified_time: row.sourceVersion.observedModifiedTime,
        bytes: fixture.packBlobs[index]
      };
    };
    for (const requestedPath of [originalPath, aliasPath]) {
      const result = await resolveColdEvidenceFromPack({ root, originalPath: requestedPath,
        fullPathIndexBytes: fixture.indexBytes, fullPathIndexMetadata: fixture.indexDownloadMetadata,
        receipt: fixture.receipt, downloadDrivePack });
      assert.deepEqual(result.bytes, fixture.raw);
      assert.equal(result.gitBlobSha1, fixture.blobSha);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('fails closed on Drive ID mismatch, corrupt pack, tampered index, and hot index rows', async () => {
  const root = makeRoot();
  try {
    const fixture = packReceiptAndIndex(Buffer.from('expected cold proof'));
    const wrongId = driveAdapter(fixture, fixture.receipt.packs[0].driveFileId);
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes, fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: wrongId.downloadDrivePack }), /DRIVE_ID_MISMATCH/);

    const corrupt = driveAdapter({ ...fixture, packBlobs: [Buffer.from('corrupt zip')] });
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: fixture.indexBytes, fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: corrupt.downloadDrivePack }), /PACK_SHA_OR_SIZE_MISMATCH/);

    const tamperedIndex = Buffer.from(fixture.indexBytes);
    tamperedIndex[0] ^= 1;
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: tamperedIndex, fullPathIndexMetadata: fixture.indexDownloadMetadata, receipt: fixture.receipt, downloadDrivePack: driveAdapter(fixture).downloadDrivePack }), /INDEX_READBACK_MISMATCH/);

    const hot = packReceiptAndIndex(fixture.raw, { maliciousClassification: true });
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath, fullPathIndexBytes: hot.indexBytes, fullPathIndexMetadata: hot.indexDownloadMetadata, receipt: hot.receipt }), /NOT_CLASSIFIED_COLD/);

    const hotAlias = rewriteIndexFixture(packReceiptAndIndex(fixture.raw), index => {
      index.files[0].originalPath = 'archive/analysis/palma-mock-builder-20261010/Q23_VISUAL/finalQ23_VISUAL_MANIFEST.json';
    });
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath: hotAlias.index.files[0].originalPath,
      fullPathIndexBytes: hotAlias.indexBytes, fullPathIndexMetadata: hotAlias.indexDownloadMetadata, receipt: hotAlias.receipt }), /PROTECTED_HOT_PATH/);

    const published = rewriteIndexFixture(packReceiptAndIndex(fixture.raw), index => {
      index.allowedRoots = ['archive/_generated/'];
      index.files[0].originalPath = 'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_CANONICAL_MAPPING.json';
    });
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath: published.index.files[0].originalPath,
      fullPathIndexBytes: published.indexBytes, fullPathIndexMetadata: published.indexDownloadMetadata, receipt: published.receipt }), /PROTECTED_HOT_PATH/);

    const disallowed = rewriteIndexFixture(packReceiptAndIndex(fixture.raw), index => {
      index.allowedRoots = ['archive/data/evidence-authority/v1/'];
      index.files[0].originalPath = 'archive/data/evidence-authority/v1/published.json';
    });
    await assert.rejects(resolveColdEvidenceFromPack({ root, originalPath: disallowed.index.files[0].originalPath,
      fullPathIndexBytes: disallowed.indexBytes, fullPathIndexMetadata: disallowed.indexDownloadMetadata, receipt: disallowed.receipt }), /ALLOWED_ROOTS_INVALID/);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('ZIP reader rejects duplicate, traversal, and symlink members', () => {
  const payload = Buffer.from('x');
  assert.throws(() => readVerifiedZipMembers(zipBytes([{ name: 'objects/one', bytes: payload }, { name: 'objects/one', bytes: payload }])), /DUPLICATE_MEMBER/);
  assert.throws(() => readVerifiedZipMembers(zipBytes([{ name: 'objects/../escape', bytes: payload }])), /MEMBER_PATH_INVALID/);
  assert.throws(() => readVerifiedZipMembers(zipBytes([{ name: 'objects/link', bytes: payload, symlink: true }])), /SYMLINK_REJECTED/);
});
