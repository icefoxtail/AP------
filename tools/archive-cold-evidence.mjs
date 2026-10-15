import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { EVIDENCE_AUTHORITY_INDEX_PATH, loadEvidenceAuthorityIndex } from '../archive/tools/evidence-authority-v1.mjs';

export const COLD_EVIDENCE_CACHE = '.codex/archive-analysis-drive-cache';
export const FULLPATH_INDEX_SCHEMA = 'archive-analysis-fullpath-index/v1';
export const ROOT_RECEIPT_SCHEMA = 'archive-analysis-drive-root-receipt/v1';
export const PACK_MANIFEST_SCHEMA = 'archive-analysis-pack/v1';

const HEX40 = /^[a-f0-9]{40}$/i;
const HEX64 = /^[a-f0-9]{64}$/i;
const MAX_PACK_BYTES = 64 * 1024 * 1024;
const MAX_INDEX_BYTES = 32 * 1024 * 1024;
const MAX_ZIP_MEMBER_COUNT = 10_000;
const MAX_PACK_EXPANDED_BYTES = 256 * 1024 * 1024;
export const PERMITTED_COLD_ROOTS = Object.freeze([
  'archive/analysis/',
  'archive/_generated/',
  'reports/',
  'render_review/',
  'artifacts/',
  'archive-work/',
  'evidence/',
  'archive/evidence/',
  'output/',
  '스캔_인테이크_산출물/'
]);
const GIT_PRODUCTION_PREFIXES = Object.freeze([
  'archive/assets/', 'archive/exams/', 'archive/generated/', 'archive/data/', 'archive/tools/',
  'alive/', 'tools/', 'docs/', '.github/', 'apmath/', 'workers/', 'eie/', 'shared/'
]);

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

const PUBLISHED_GENERATED_BASELINE = Object.freeze([
  'archive/_generated/intelligence/meta-foundation/h2-math2-continuity/STAGE6_FINAL_FOUNDATION.json',
  'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_CANONICAL_MAPPING.json',
  'archive/_generated/intelligence/phase1/middle1-foundation/global/B01_B16_SOURCE_NORMALIZATION_RECEIPT.json'
]);

function protectedColdPaths(root) {
  const protectedPaths = new Set(PUBLISHED_GENERATED_BASELINE);
  const hotIndex = loadEvidenceAuthorityIndex(root);
  for (const entry of hotIndex.entries) protectedPaths.add(entry.originalPath);
  const manifestPath = path.join(root, 'archive/data/archive2-canonical-input-manifest.json');
  if (!fs.existsSync(manifestPath)) return protectedPaths;
  const stat = fs.lstatSync(manifestPath);
  if (stat.isSymbolicLink() || !stat.isFile() || stat.size > 64 * 1024 * 1024) throw new Error('COLD_EVIDENCE_CANONICAL_INPUT_MANIFEST_FILE_INVALID');
  const resolvedRoot = fs.realpathSync(root), resolvedManifest = fs.realpathSync(manifestPath);
  const relativeManifest = path.relative(resolvedRoot, resolvedManifest);
  if (relativeManifest.startsWith(`..${path.sep}`) || relativeManifest === '..' || path.isAbsolute(relativeManifest)) {
    throw new Error('COLD_EVIDENCE_CANONICAL_INPUT_MANIFEST_PATH_ESCAPE');
  }
  let manifest;
  try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
  catch { throw new Error('COLD_EVIDENCE_CANONICAL_INPUT_MANIFEST_INVALID'); }
  if (manifest.schemaVersion !== 'archive2-canonical-input-manifest-v1' || !Array.isArray(manifest.files)) {
    throw new Error('COLD_EVIDENCE_CANONICAL_INPUT_MANIFEST_INVALID');
  }
  for (const input of manifest.files) {
    if (typeof input?.path !== 'string') throw new Error('COLD_EVIDENCE_CANONICAL_INPUT_PATH_INVALID');
    const archiveRelative = path.posix.normalize(path.posix.join('archive', input.path));
    if (archiveRelative.startsWith('archive/_generated/') && !archiveRelative.split('/').includes('..')) protectedPaths.add(archiveRelative);
  }
  return protectedPaths;
}

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

function validateRepoPath(value, label, allowedRoots) {
  if (typeof value !== 'string' || !Array.isArray(allowedRoots) || !allowedRoots.some(root => value.startsWith(root))
      || value.includes('\\') || value.includes('\0') || path.posix.isAbsolute(value)
      || value.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`COLD_EVIDENCE_PATH_INVALID:${label}`);
  }
  if (GIT_PRODUCTION_PREFIXES.some(prefix => value.startsWith(prefix))) throw new Error(`COLD_EVIDENCE_PROTECTED_PRODUCTION_PATH:${label}`);
  return value;
}

function validateAllowedRoots(value, label) {
  if (!Array.isArray(value) || value.length === 0 || value.some(root => !PERMITTED_COLD_ROOTS.includes(root))) {
    throw new Error(`COLD_EVIDENCE_ALLOWED_ROOTS_INVALID:${label}`);
  }
  if (new Set(value).size !== value.length) throw new Error(`COLD_EVIDENCE_ALLOWED_ROOTS_DUPLICATE:${label}`);
  return value;
}

function parseIndex(indexBytes, receipt, root) {
  if (!Buffer.isBuffer(indexBytes)) throw new Error('COLD_EVIDENCE_INDEX_BYTES_REQUIRED');
  if (indexBytes.length !== receipt.indexSizeBytes || sha256(indexBytes) !== String(receipt.indexSha256).toLowerCase()) {
    throw new Error('COLD_EVIDENCE_INDEX_READBACK_MISMATCH');
  }
  let index;
  try { index = JSON.parse(indexBytes.toString('utf8')); }
  catch { throw new Error('COLD_EVIDENCE_INDEX_JSON_INVALID'); }
  if (index.schemaVersion !== FULLPATH_INDEX_SCHEMA || index.cohort !== receipt.cohort || index.baselineCommit !== receipt.baselineCommit
      || index.baselineAnalysisTreeSha !== receipt.baselineAnalysisTreeSha || !Array.isArray(index.files)) {
    throw new Error('COLD_EVIDENCE_INDEX_SCHEMA_OR_BASELINE_MISMATCH');
  }
  const receiptRoots = validateAllowedRoots(receipt.allowedRoots, 'receipt');
  const indexRoots = validateAllowedRoots(index.allowedRoots, 'index');
  if (JSON.stringify(receiptRoots) !== JSON.stringify(indexRoots)) throw new Error('COLD_EVIDENCE_ALLOWED_ROOTS_MISMATCH');
  const seenPaths = new Set();
  const seenPacks = new Map();
  const protectedPaths = protectedColdPaths(root);
  for (const entry of index.files) {
    validateRepoPath(entry.originalPath, 'index.originalPath', indexRoots);
    if (protectedPaths.has(entry.originalPath)) throw new Error(`COLD_EVIDENCE_PROTECTED_HOT_PATH:${entry.originalPath}`);
    if (entry.classification !== 'cold-evidence') throw new Error(`COLD_EVIDENCE_NOT_CLASSIFIED_COLD:${entry.originalPath}`);
    if (!HEX40.test(entry.gitBlobSha1 ?? '') || !HEX64.test(entry.sha256 ?? '')
        || !Number.isSafeInteger(entry.sizeBytes) || entry.sizeBytes < 0 || !Array.isArray(entry.objectPacks) || !entry.objectPacks.length) {
      throw new Error(`COLD_EVIDENCE_INDEX_ENTRY_INVALID:${entry.originalPath}`);
    }
    if (seenPaths.has(entry.originalPath)) throw new Error(`COLD_EVIDENCE_INDEX_PATH_DUPLICATE:${entry.originalPath}`);
    seenPaths.add(entry.originalPath);
    for (const objectPack of entry.objectPacks) {
      validatePackMemberName(objectPack.member);
      if (typeof objectPack.pack !== 'string' || !objectPack.pack || !HEX64.test(objectPack.memberSha256 ?? '')
          || !Number.isSafeInteger(objectPack.memberBytes) || objectPack.memberBytes < 0
          || !Number.isInteger(objectPack.chunkIndex) || !Number.isInteger(objectPack.chunkCount)
          || objectPack.chunkCount < 1 || objectPack.chunkIndex < 0 || objectPack.chunkIndex > objectPack.chunkCount) {
        throw new Error(`COLD_EVIDENCE_INDEX_OBJECT_PACK_INVALID:${entry.originalPath}`);
      }
      const signature = `${objectPack.pack}\0${objectPack.member}`;
      const prior = seenPacks.get(signature);
      if (prior && (prior.gitBlobSha1 !== entry.gitBlobSha1 || prior.sha256 !== entry.sha256)) {
        throw new Error(`COLD_EVIDENCE_PACK_MEMBER_CONFLICT:${objectPack.pack}:${objectPack.member}`);
      }
      seenPacks.set(signature, { gitBlobSha1: entry.gitBlobSha1, sha256: entry.sha256 });
    }
  }
  return index;
}

function validatePackMemberName(name) {
  if (typeof name !== 'string' || !name.startsWith('objects/') || name.includes('\\') || name.includes('\0')
      || path.posix.isAbsolute(name) || name.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`COLD_EVIDENCE_ZIP_MEMBER_PATH_INVALID:${name}`);
  }
  return name;
}

function readU16(bytes, offset) {
  if (offset < 0 || offset + 2 > bytes.length) throw new Error('COLD_EVIDENCE_ZIP_TRUNCATED');
  return bytes.readUInt16LE(offset);
}

function readU32(bytes, offset) {
  if (offset < 0 || offset + 4 > bytes.length) throw new Error('COLD_EVIDENCE_ZIP_TRUNCATED');
  return bytes.readUInt32LE(offset);
}

function zipName(bytes, utf8) {
  const name = bytes.toString(utf8 ? 'utf8' : 'ascii');
  if (name.includes('\uFFFD') || !Buffer.from(name, utf8 ? 'utf8' : 'ascii').equals(bytes)) throw new Error('COLD_EVIDENCE_ZIP_FILENAME_ENCODING_INVALID');
  return name;
}

/** Parse a deliberately small ZIP subset: single-disk, non-ZIP64, file entries only. */
export function readVerifiedZipMembers(zipBytes) {
  if (!Buffer.isBuffer(zipBytes) || zipBytes.length < 22) throw new Error('COLD_EVIDENCE_ZIP_REQUIRED');
  const minimum = Math.max(0, zipBytes.length - 22 - 0xffff);
  let eocd = -1;
  for (let offset = zipBytes.length - 22; offset >= minimum; offset -= 1) {
    if (readU32(zipBytes, offset) === 0x06054b50) { eocd = offset; break; }
  }
  if (eocd < 0) throw new Error('COLD_EVIDENCE_ZIP_EOCD_MISSING');
  const commentLength = readU16(zipBytes, eocd + 20);
  if (eocd + 22 + commentLength !== zipBytes.length) throw new Error('COLD_EVIDENCE_ZIP_TRAILING_DATA');
  const diskNumber = readU16(zipBytes, eocd + 4);
  const directoryDisk = readU16(zipBytes, eocd + 6);
  const diskEntries = readU16(zipBytes, eocd + 8);
  const totalEntries = readU16(zipBytes, eocd + 10);
  const directorySize = readU32(zipBytes, eocd + 12);
  const directoryOffset = readU32(zipBytes, eocd + 16);
  if (diskNumber || directoryDisk || diskEntries !== totalEntries) throw new Error('COLD_EVIDENCE_ZIP_MULTIDISK_UNSUPPORTED');
  if (diskEntries === 0xffff || totalEntries === 0xffff || directorySize === 0xffffffff || directoryOffset === 0xffffffff) {
    throw new Error('COLD_EVIDENCE_ZIP64_UNSUPPORTED');
  }
  if (totalEntries > MAX_ZIP_MEMBER_COUNT) throw new Error('COLD_EVIDENCE_ZIP_MEMBER_COUNT_LIMIT');
  if (directoryOffset + directorySize !== eocd) throw new Error('COLD_EVIDENCE_ZIP_DIRECTORY_RANGE_INVALID');

  const members = new Map();
  let cursor = directoryOffset;
  const ranges = [];
  for (let index = 0; index < totalEntries; index += 1) {
    if (readU32(zipBytes, cursor) !== 0x02014b50) throw new Error('COLD_EVIDENCE_ZIP_CENTRAL_ENTRY_INVALID');
    const madeBy = readU16(zipBytes, cursor + 4);
    const flags = readU16(zipBytes, cursor + 8);
    const method = readU16(zipBytes, cursor + 10);
    const expectedCrc = readU32(zipBytes, cursor + 16);
    const compressedBytes = readU32(zipBytes, cursor + 20);
    const memberBytes = readU32(zipBytes, cursor + 24);
    const nameBytes = readU16(zipBytes, cursor + 28);
    const extraBytes = readU16(zipBytes, cursor + 30);
    const memberCommentBytes = readU16(zipBytes, cursor + 32);
    const diskStart = readU16(zipBytes, cursor + 34);
    const externalAttributes = readU32(zipBytes, cursor + 38);
    const localOffset = readU32(zipBytes, cursor + 42);
    if (flags & 1) throw new Error('COLD_EVIDENCE_ZIP_ENCRYPTED_MEMBER');
    if (method !== 0 && method !== 8) throw new Error(`COLD_EVIDENCE_ZIP_COMPRESSION_UNSUPPORTED:${method}`);
    if (diskStart !== 0 || compressedBytes === 0xffffffff || memberBytes === 0xffffffff || localOffset === 0xffffffff) {
      throw new Error('COLD_EVIDENCE_ZIP64_OR_MULTI_DISK_MEMBER_UNSUPPORTED');
    }
    const nameStart = cursor + 46;
    const nameEnd = nameStart + nameBytes;
    const next = nameEnd + extraBytes + memberCommentBytes;
    if (next > eocd || nameEnd > zipBytes.length) throw new Error('COLD_EVIDENCE_ZIP_CENTRAL_ENTRY_TRUNCATED');
    const name = zipName(zipBytes.subarray(nameStart, nameEnd), Boolean(flags & 0x800));
    if (name !== 'MANIFEST.json') validatePackMemberName(name);
    if (members.has(name)) throw new Error(`COLD_EVIDENCE_ZIP_DUPLICATE_MEMBER:${name}`);
    if (name.endsWith('/')) throw new Error(`COLD_EVIDENCE_ZIP_DIRECTORY_MEMBER_REJECTED:${name}`);
    const platform = madeBy >>> 8;
    const unixMode = (externalAttributes >>> 16) & 0xf000;
    if (platform === 3 && unixMode === 0xa000) throw new Error(`COLD_EVIDENCE_ZIP_SYMLINK_REJECTED:${name}`);
    if (localOffset >= directoryOffset || readU32(zipBytes, localOffset) !== 0x04034b50) throw new Error(`COLD_EVIDENCE_ZIP_LOCAL_HEADER_INVALID:${name}`);

    const localFlags = readU16(zipBytes, localOffset + 6);
    const localMethod = readU16(zipBytes, localOffset + 8);
    const localNameBytes = readU16(zipBytes, localOffset + 26);
    const localExtraBytes = readU16(zipBytes, localOffset + 28);
    if ((localFlags & 1) || localMethod !== method || ((localFlags ^ flags) & 0x0809)) throw new Error(`COLD_EVIDENCE_ZIP_LOCAL_CENTRAL_MISMATCH:${name}`);
    const localNameStart = localOffset + 30;
    const localNameEnd = localNameStart + localNameBytes;
    const dataStart = localNameEnd + localExtraBytes;
    const dataEnd = dataStart + compressedBytes;
    if (dataEnd > directoryOffset || localNameEnd > zipBytes.length) throw new Error(`COLD_EVIDENCE_ZIP_MEMBER_RANGE_INVALID:${name}`);
    if (zipName(zipBytes.subarray(localNameStart, localNameEnd), Boolean(localFlags & 0x800)) !== name) {
      throw new Error(`COLD_EVIDENCE_ZIP_LOCAL_NAME_MISMATCH:${name}`);
    }
    if (!(flags & 8)) {
      if (readU32(zipBytes, localOffset + 14) !== expectedCrc
          || readU32(zipBytes, localOffset + 18) !== compressedBytes
          || readU32(zipBytes, localOffset + 22) !== memberBytes) throw new Error(`COLD_EVIDENCE_ZIP_LOCAL_SIZE_MISMATCH:${name}`);
    }
    ranges.push([localOffset, dataEnd, name]);
    members.set(name, { name, method, expectedCrc, compressedBytes, memberBytes, dataStart, dataEnd });
    if (memberBytes > MAX_PACK_EXPANDED_BYTES) throw new Error(`COLD_EVIDENCE_ZIP_MEMBER_EXPANSION_LIMIT:${name}`);
    cursor = next;
  }
  if (cursor !== directoryOffset + directorySize) throw new Error('COLD_EVIDENCE_ZIP_DIRECTORY_SIZE_MISMATCH');
  const expandedBytes = [...members.values()].reduce((sum, member) => sum + member.memberBytes, 0);
  if (expandedBytes > MAX_PACK_EXPANDED_BYTES) throw new Error('COLD_EVIDENCE_ZIP_EXPANSION_LIMIT');
  ranges.sort((a, b) => a[0] - b[0]);
  for (let index = 1; index < ranges.length; index += 1) {
    if (ranges[index][0] < ranges[index - 1][1]) throw new Error(`COLD_EVIDENCE_ZIP_MEMBER_OVERLAP:${ranges[index][2]}`);
  }
  return members;
}

function extractZipMember(zipBytes, member) {
  const compressed = zipBytes.subarray(member.dataStart, member.dataEnd);
  let raw;
  try { raw = member.method === 0 ? Buffer.from(compressed) : inflateRawSync(compressed, { maxOutputLength: member.memberBytes || 1 }); }
  catch { throw new Error(`COLD_EVIDENCE_ZIP_DEFLATE_INVALID:${member.name}`); }
  if (raw.length !== member.memberBytes || crc32(raw) !== member.expectedCrc) throw new Error(`COLD_EVIDENCE_ZIP_CRC_OR_SIZE_MISMATCH:${member.name}`);
  return raw;
}

function validateReceipt(receipt, root) {
  if (!receipt || receipt.schemaVersion !== ROOT_RECEIPT_SCHEMA || receipt.status !== 'FULL_BYTES_VERIFIED'
      || typeof receipt.method !== 'string' || !receipt.method
      || typeof receipt.verifiedAtUtc !== 'string' || !Number.isFinite(Date.parse(receipt.verifiedAtUtc))
      || !Array.isArray(receipt.packs)
      || !HEX40.test(receipt.baselineCommit ?? '') || !HEX40.test(receipt.baselineAnalysisTreeSha ?? '')
      || !Number.isSafeInteger(receipt.indexSizeBytes) || receipt.indexSizeBytes <= 0 || !HEX64.test(receipt.indexSha256 ?? '')
      || receipt.indexSizeBytes > MAX_INDEX_BYTES || receipt.packCount !== receipt.packs.length
      || !Number.isSafeInteger(receipt.packBytes) || receipt.packBytes < 0 || !receipt.index || typeof receipt.index !== 'object') {
    throw new Error('COLD_EVIDENCE_PACK_RECEIPT_INVALID');
  }
  if (!receipt.baselineRootTreeShas || typeof receipt.baselineRootTreeShas !== 'object' || Array.isArray(receipt.baselineRootTreeShas)
      || Object.values(receipt.baselineRootTreeShas).some(value => !HEX40.test(value))) throw new Error('COLD_EVIDENCE_BASELINE_ROOT_TREES_INVALID');
  const hotExclusion = receipt.hotAuthorityExclusion;
  const hotIndexPath = hotExclusion?.sourcePath ?? hotExclusion?.indexPath;
  const hotRawBytes = hotExclusion?.excludedPathBytes ?? hotExclusion?.rawBytes;
  if (!hotExclusion || hotIndexPath !== EVIDENCE_AUTHORITY_INDEX_PATH
      || !HEX64.test(hotExclusion.indexSha256 ?? '')
      || !Number.isSafeInteger(hotExclusion.entryCount) || !Number.isSafeInteger(hotRawBytes)) {
    throw new Error('COLD_EVIDENCE_HOT_AUTHORITY_EXCLUSION_REQUIRED');
  }
  const actualHotIndexPath = path.join(root, ...EVIDENCE_AUTHORITY_INDEX_PATH.split('/'));
  const actualHotIndex = loadEvidenceAuthorityIndex(root);
  const actualHotIndexBytes = fs.readFileSync(actualHotIndexPath);
  if (sha256(actualHotIndexBytes) !== hotExclusion.indexSha256
      || actualHotIndex.entries.length !== hotExclusion.entryCount
      || actualHotIndex.entries.reduce((sum, entry) => sum + entry.sizeBytes, 0) !== hotRawBytes) {
    throw new Error('COLD_EVIDENCE_HOT_AUTHORITY_INDEX_MISMATCH');
  }
  validateDriveBinding(receipt.index, 'index');
  if (receipt.index.sha256 !== receipt.indexSha256 || receipt.index.sizeBytes !== receipt.indexSizeBytes
      || receipt.index.driveSizeBytes !== receipt.indexSizeBytes) throw new Error('COLD_EVIDENCE_INDEX_RECEIPT_BINDING_MISMATCH');
  const seen = new Set();
  for (const pack of receipt.packs) {
    if (!pack || typeof pack.name !== 'string' || !pack.name.endsWith('.zip') || path.posix.basename(pack.name) !== pack.name
        || (pack.cohort !== undefined && (typeof pack.cohort !== 'string' || !pack.cohort))
        || !HEX64.test(pack.sha256 ?? '') || !Number.isSafeInteger(pack.sizeBytes) || pack.sizeBytes < 22 || pack.sizeBytes > MAX_PACK_BYTES
        || !/^[A-Za-z0-9_-]+$/.test(pack.driveFileId ?? '') || typeof pack.driveParentId !== 'string' || !pack.driveParentId
        || typeof pack.driveName !== 'string' || typeof pack.driveMimeType !== 'string'
        || !Number.isSafeInteger(pack.driveSizeBytes) || pack.driveSizeBytes !== pack.sizeBytes) {
      throw new Error('COLD_EVIDENCE_PACK_METADATA_INVALID');
    }
    if (seen.has(pack.name)) throw new Error(`COLD_EVIDENCE_PACK_NAME_DUPLICATE:${pack.name}`);
    seen.add(pack.name);
    validateDriveBinding(pack, `pack:${pack.name}`);
  }
  if (receipt.packs.reduce((sum, pack) => sum + pack.sizeBytes, 0) !== receipt.packBytes) throw new Error('COLD_EVIDENCE_PACK_RECEIPT_TOTAL_MISMATCH');
}

function validateDriveBinding(row, label) {
  const readback = row?.driveReadback;
  const sourceVersion = row?.sourceVersion;
  const expectedSha = String(row?.sha256 ?? '').toLowerCase();
  if (!/^[A-Za-z0-9_-]+$/.test(row?.driveFileId ?? '') || typeof row?.driveParentId !== 'string' || !row.driveParentId
      || typeof row?.driveName !== 'string' || !row.driveName || typeof row?.driveMimeType !== 'string' || !row.driveMimeType
      || !Number.isSafeInteger(row?.sizeBytes) || !HEX64.test(expectedSha) || row?.driveSizeBytes !== row.sizeBytes
      || !readback || readback.status !== 'FULL_BYTES_VERIFIED' || readback.sha256 !== expectedSha
      || readback.sizeBytes !== row.sizeBytes || typeof readback.method !== 'string' || !readback.method
      || typeof readback.verifiedAtUtc !== 'string' || !Number.isFinite(Date.parse(readback.verifiedAtUtc))
      || !sourceVersion || sourceVersion.id !== row.driveFileId
      || !Array.isArray(sourceVersion.parentIds) || !sourceVersion.parentIds.includes(row.driveParentId)
      || typeof sourceVersion.observedModifiedTime !== 'string' || !Number.isFinite(Date.parse(sourceVersion.observedModifiedTime))) {
    throw new Error(`COLD_EVIDENCE_DRIVE_READBACK_REQUIRED:${label}`);
  }
}

function safeCachePath(root, relative) {
  const absoluteRoot = fs.realpathSync(root);
  const absolute = path.resolve(absoluteRoot, ...relative.split('/'));
  const rel = path.relative(absoluteRoot, absolute);
  if (!rel || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) throw new Error('COLD_EVIDENCE_CACHE_PATH_INVALID');
  let current = absoluteRoot;
  for (const [index, segment] of rel.split(path.sep).entries()) {
    current = path.join(current, segment);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink()) throw new Error('COLD_EVIDENCE_CACHE_SYMLINK_REJECTED');
      if (index < rel.split(path.sep).length - 1 && !stat.isDirectory()) throw new Error('COLD_EVIDENCE_CACHE_PARENT_INVALID');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return absolute;
}

function ensureCacheDirectory(root, relativeDirectory) {
  const absoluteRoot = fs.realpathSync(root);
  let current = absoluteRoot;
  for (const segment of relativeDirectory.split('/').filter(Boolean)) {
    current = path.join(current, segment);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error('COLD_EVIDENCE_CACHE_DIRECTORY_INVALID');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      fs.mkdirSync(current);
    }
  }
}

function readCache(root, relative, check) {
  const full = safeCachePath(root, relative);
  try {
    const stat = fs.lstatSync(full);
    if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('COLD_EVIDENCE_CACHE_FILE_INVALID');
    const bytes = fs.readFileSync(full);
    if (check(bytes)) return bytes;
    fs.unlinkSync(full);
    return null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    if (error.message === 'COLD_EVIDENCE_CACHE_FILE_INVALID') throw error;
    if (error.message.startsWith('COLD_EVIDENCE_CACHE_')) throw error;
    fs.unlinkSync(full);
    return null;
  }
}

function writeCache(root, relative, bytes) {
  const full = safeCachePath(root, relative);
  ensureCacheDirectory(root, path.posix.dirname(relative));
  const temporary = `${full}.${process.pid}.${Math.random().toString(16).slice(2)}.tmp`;
  try {
    fs.writeFileSync(temporary, bytes, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, full);
  } catch (error) {
    if (error.code !== 'EEXIST' && error.code !== 'EPERM') throw error;
    if (!fs.existsSync(full) || !fs.readFileSync(full).equals(bytes)) throw error;
  } finally {
    try { fs.unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}

function parsePackManifest(zipBytes, packRow, allowedRoots) {
  const zipMembers = readVerifiedZipMembers(zipBytes);
  const manifestMember = zipMembers.get('MANIFEST.json');
  if (!manifestMember) throw new Error(`COLD_EVIDENCE_PACK_MANIFEST_MISSING:${packRow.name}`);
  let manifest;
  try { manifest = JSON.parse(extractZipMember(zipBytes, manifestMember).toString('utf8')); }
  catch (error) { if (error.message.startsWith('COLD_EVIDENCE_')) throw error; throw new Error('COLD_EVIDENCE_PACK_MANIFEST_JSON_INVALID'); }
  if (manifest.schemaVersion !== PACK_MANIFEST_SCHEMA || manifest.pack !== packRow.name
      || !Array.isArray(manifest.objects)) throw new Error(`COLD_EVIDENCE_PACK_MANIFEST_INVALID:${packRow.name}`);
  const manifestMembers = new Set();
  for (const row of manifest.objects) {
    validatePackMemberName(row.member);
    if (manifestMembers.has(row.member)) throw new Error(`COLD_EVIDENCE_PACK_MANIFEST_MEMBER_DUPLICATE:${row.member}`);
    manifestMembers.add(row.member);
    const member = zipMembers.get(row.member);
    if (!member || member.memberBytes !== row.memberBytes || !HEX64.test(row.memberSha256 ?? '')
        || !HEX40.test(row.gitBlobSha1 ?? '') || !HEX64.test(row.sha256 ?? '')
        || !Number.isSafeInteger(row.sizeBytes) || !Number.isInteger(row.chunkIndex) || !Number.isInteger(row.chunkCount)
        || !Number.isSafeInteger(row.startByte) || !Number.isSafeInteger(row.endByteExclusive)
        || !Array.isArray(row.originalPaths) || row.originalPaths.length === 0) {
      throw new Error(`COLD_EVIDENCE_PACK_MANIFEST_ROW_INVALID:${row.member}`);
    }
    if (member.memberBytes !== row.memberBytes) throw new Error(`COLD_EVIDENCE_PACK_MEMBER_SIZE_MISMATCH:${row.member}`);
    for (const originalPath of row.originalPaths) validateRepoPath(originalPath, 'manifest.originalPaths', allowedRoots);
  }
  for (const name of zipMembers.keys()) {
    if (name !== 'MANIFEST.json' && !manifestMembers.has(name)) throw new Error(`COLD_EVIDENCE_ZIP_MEMBER_NOT_IN_MANIFEST:${name}`);
  }
  if (manifestMembers.size + 1 !== zipMembers.size) throw new Error(`COLD_EVIDENCE_PACK_MEMBER_SET_MISMATCH:${packRow.name}`);
  return { manifest, zipMembers };
}

function verifyPackMetadata(index, receipt, packRow, packBytes, root) {
  if (packBytes.length !== packRow.sizeBytes || sha256(packBytes) !== packRow.sha256.toLowerCase()) {
    throw new Error(`COLD_EVIDENCE_PACK_SHA_OR_SIZE_MISMATCH:${packRow.name}`);
  }
  const parsed = parsePackManifest(packBytes, packRow, index.allowedRoots);
  const { manifest } = parsed;
  if (manifest.cohort !== (packRow.cohort || receipt.cohort) || manifest.baselineCommit !== receipt.baselineCommit
      || manifest.baselineAnalysisTreeSha !== receipt.baselineAnalysisTreeSha) {
    throw new Error(`COLD_EVIDENCE_PACK_BASELINE_MISMATCH:${packRow.name}`);
  }
  const indexByBlob = new Map();
  const indexByPath = new Map();
  const aliasesByPackMember = new Map();
  for (const entry of index.files) {
    const prior = indexByBlob.get(entry.gitBlobSha1);
    if (prior && (prior.sha256 !== entry.sha256 || prior.sizeBytes !== entry.sizeBytes)) throw new Error(`COLD_EVIDENCE_INDEX_BLOB_CONFLICT:${entry.gitBlobSha1}`);
    if (!prior) indexByBlob.set(entry.gitBlobSha1, { sha256: entry.sha256, sizeBytes: entry.sizeBytes, paths: new Set() });
    indexByBlob.get(entry.gitBlobSha1).paths.add(entry.originalPath);
    indexByPath.set(entry.originalPath, entry);
    for (const objectPack of entry.objectPacks) {
      const key = `${objectPack.pack}\0${objectPack.member}`;
      if (!aliasesByPackMember.has(key)) aliasesByPackMember.set(key, new Set());
      aliasesByPackMember.get(key).add(entry.originalPath);
    }
  }
  const hotByPath = new Map(loadEvidenceAuthorityIndex(root).entries.map(entry => [entry.originalPath, entry]));
  for (const row of manifest.objects) {
    const indexed = indexByBlob.get(row.gitBlobSha1);
    const manifestPaths = new Set(row.originalPaths);
    const packMemberPaths = aliasesByPackMember.get(`${packRow.name}\0${row.member}`) ?? new Set();
    const missingColdAliases = [...packMemberPaths].filter(originalPath => !manifestPaths.has(originalPath));
    const extraAliases = [...manifestPaths].filter(originalPath => !packMemberPaths.has(originalPath));
    const extraHotAliases = extraAliases.filter(originalPath => hotByPath.has(originalPath));
    const unauditedAliases = extraAliases.filter(originalPath => !hotByPath.has(originalPath));
    const hotMetadataMismatch = [...manifestPaths].filter(originalPath => hotByPath.has(originalPath)).some(originalPath => {
      const hot = hotByPath.get(originalPath);
      return hot.gitBlobSha1 !== row.gitBlobSha1 || hot.sha256 !== row.sha256 || hot.sizeBytes !== row.sizeBytes;
    });
    const coldMetadataMismatch = [...manifestPaths].filter(originalPath => indexByPath.has(originalPath)).some(originalPath => {
      const cold = indexByPath.get(originalPath);
      return cold.gitBlobSha1 !== row.gitBlobSha1 || cold.sha256 !== row.sha256 || cold.sizeBytes !== row.sizeBytes;
    });
    if (manifestPaths.size !== row.originalPaths.length || unauditedAliases.length || hotMetadataMismatch || coldMetadataMismatch
        || (indexed && (row.sha256 !== indexed.sha256 || row.sizeBytes !== indexed.sizeBytes || missingColdAliases.length))
        || (!indexed && extraHotAliases.length !== manifestPaths.size)) {
      throw new Error(`COLD_EVIDENCE_PACK_INDEX_ALIAS_MISMATCH:${row.gitBlobSha1}`);
    }
    const member = parsed.zipMembers.get(row.member);
    const rawPart = extractZipMember(packBytes, member);
    if (sha256(rawPart) !== row.memberSha256.toLowerCase()) throw new Error(`COLD_EVIDENCE_PACK_MEMBER_SHA_MISMATCH:${row.member}`);
  }
  return parsed;
}

function checkReturnedDriveMetadata(result, packRow) {
  if (!result || result.id !== packRow.driveFileId) throw new Error(`COLD_EVIDENCE_DRIVE_ID_MISMATCH:${packRow.name}`);
  if (result.file_name !== packRow.driveName) throw new Error(`COLD_EVIDENCE_DRIVE_NAME_MISMATCH:${packRow.name}`);
  if (result.mime_type !== packRow.driveMimeType) throw new Error(`COLD_EVIDENCE_DRIVE_MIME_MISMATCH:${packRow.name}`);
  if (result.file_size_bytes !== packRow.driveSizeBytes) throw new Error(`COLD_EVIDENCE_DRIVE_SIZE_MISMATCH:${packRow.name}`);
  if (!Array.isArray(result.parent_ids) || !result.parent_ids.includes(packRow.driveParentId)) throw new Error(`COLD_EVIDENCE_DRIVE_PARENT_MISMATCH:${packRow.name}`);
  if (result.modified_time !== packRow.sourceVersion?.observedModifiedTime) throw new Error(`COLD_EVIDENCE_DRIVE_TIME_MISMATCH:${packRow.name}`);
}

async function downloadMcpFile(result, driveRow, { maxBytes, label }) {
  checkReturnedDriveMetadata(result, driveRow);
  if (Buffer.isBuffer(result.bytes) || result.bytes instanceof Uint8Array) {
    const bytes = Buffer.from(result.bytes);
    if (bytes.length > maxBytes) throw new Error(`COLD_EVIDENCE_DRIVE_FILE_TOO_LARGE:${label}`);
    return bytes;
  }
  if (typeof result.localPath === 'string') {
    const stat = fs.lstatSync(result.localPath);
    if (stat.isSymbolicLink() || !stat.isFile() || stat.size > maxBytes) throw new Error(`COLD_EVIDENCE_DRIVE_LOCAL_FILE_INVALID:${label}`);
    return fs.readFileSync(result.localPath);
  }
  const urlValue = result.file_uri?.download_url;
  if (typeof urlValue !== 'string') throw new Error(`COLD_EVIDENCE_DRIVE_FILE_URI_REQUIRED:${label}`);
  let url;
  try { url = new URL(urlValue); } catch { throw new Error(`COLD_EVIDENCE_DRIVE_DOWNLOAD_URL_INVALID:${label}`); }
  if (url.protocol !== 'https:' || !(url.hostname === 'oaiusercontent.com' || url.hostname.endsWith('.oaiusercontent.com'))) {
    throw new Error(`COLD_EVIDENCE_DRIVE_DOWNLOAD_HOST_INVALID:${label}`);
  }
  let response;
  try { response = await fetch(url); }
  catch { throw new Error(`COLD_EVIDENCE_DRIVE_DOWNLOAD_FAILED:${label}`); }
  if (!response.ok) throw new Error(`COLD_EVIDENCE_DRIVE_DOWNLOAD_HTTP_STATUS:${label}:${response.status}`);
  const headerLength = response.headers?.get?.('content-length');
  if (headerLength && /^\d+$/.test(headerLength) && Number(headerLength) > maxBytes) {
    try { await response.body?.cancel?.(); } catch {}
    throw new Error(`COLD_EVIDENCE_DRIVE_FILE_TOO_LARGE:${label}`);
  }
  if (!response.body?.getReader) throw new Error(`COLD_EVIDENCE_DRIVE_DOWNLOAD_STREAM_REQUIRED:${label}`);
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error(`COLD_EVIDENCE_DRIVE_FILE_TOO_LARGE:${label}`);
      }
      chunks.push(Buffer.from(value));
    }
  } catch (error) {
    if (error.message.startsWith('COLD_EVIDENCE_')) throw error;
    throw new Error(`COLD_EVIDENCE_DRIVE_DOWNLOAD_FAILED:${label}`);
  }
  return Buffer.concat(chunks, size);
}

async function loadVerifiedPack({ root, packRow, downloadDrivePack }) {
  const cacheRel = `${COLD_EVIDENCE_CACHE}/packs/${packRow.sha256}.zip`;
  const cached = readCache(root, cacheRel, bytes => bytes.length === packRow.sizeBytes && sha256(bytes) === packRow.sha256.toLowerCase());
  if (cached) return cached;
  if (typeof downloadDrivePack !== 'function') throw new Error(`COLD_EVIDENCE_DRIVE_ADAPTER_REQUIRED:${packRow.name}`);
  let result;
  try { result = await downloadDrivePack(packRow.driveFileId, packRow); }
  catch { throw new Error(`COLD_EVIDENCE_DRIVE_FETCH_FAILED:${packRow.name}`); }
  const bytes = await downloadMcpFile(result, packRow, { maxBytes: MAX_PACK_BYTES, label: packRow.name });
  if (bytes.length !== packRow.sizeBytes || sha256(bytes) !== packRow.sha256.toLowerCase()) {
    throw new Error(`COLD_EVIDENCE_PACK_SHA_OR_SIZE_MISMATCH:${packRow.name}`);
  }
  writeCache(root, cacheRel, bytes);
  return bytes;
}

async function loadFullPathIndexBytes({ receipt, fullPathIndexBytes, fullPathIndexMetadata, downloadDriveIndex }) {
  let metadata = fullPathIndexMetadata;
  let bytes = fullPathIndexBytes;
  if ((!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) || !metadata) {
    if (typeof downloadDriveIndex !== 'function') throw new Error('COLD_EVIDENCE_INDEX_DRIVE_ADAPTER_REQUIRED');
    try { metadata = await downloadDriveIndex(receipt.index.driveFileId, receipt.index); }
    catch { throw new Error('COLD_EVIDENCE_INDEX_DRIVE_FETCH_FAILED'); }
    bytes = null;
  }
  checkReturnedDriveMetadata(metadata, receipt.index);
  if (!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) {
    bytes = await downloadMcpFile(metadata, receipt.index, { maxBytes: MAX_INDEX_BYTES, label: 'fullpath-index' });
  } else {
    bytes = Buffer.from(bytes);
    if (bytes.length > MAX_INDEX_BYTES) throw new Error('COLD_EVIDENCE_INDEX_TOO_LARGE');
  }
  if (bytes.length !== receipt.index.sizeBytes || sha256(bytes) !== receipt.index.sha256.toLowerCase()) {
    throw new Error('COLD_EVIDENCE_INDEX_READBACK_MISMATCH');
  }
  return bytes;
}

function verifyIndexedPackMember(fullPathEntry, objectPack, packManifestRow) {
  for (const field of ['gitBlobSha1', 'sha256', 'sizeBytes']) {
    if (String(fullPathEntry[field]) !== String(packManifestRow[field])) throw new Error(`COLD_EVIDENCE_INDEX_PACK_MEMBER_MISMATCH:${fullPathEntry.originalPath}:${field}`);
  }
  const fields = ['member', 'memberSha256', 'memberBytes', 'chunkIndex', 'chunkCount'];
  for (const field of fields) {
    if (String(objectPack[field]) !== String(packManifestRow[field])) throw new Error(`COLD_EVIDENCE_INDEX_PACK_MEMBER_MISMATCH:${fullPathEntry.originalPath}:${field}`);
  }
  if (objectPack.startByte !== undefined && objectPack.startByte !== packManifestRow.startByte) throw new Error(`COLD_EVIDENCE_INDEX_PACK_RANGE_MISMATCH:${fullPathEntry.originalPath}`);
  if (objectPack.endByteExclusive !== undefined && objectPack.endByteExclusive !== packManifestRow.endByteExclusive) throw new Error(`COLD_EVIDENCE_INDEX_PACK_RANGE_MISMATCH:${fullPathEntry.originalPath}`);
  if (!packManifestRow.originalPaths.includes(fullPathEntry.originalPath)) throw new Error(`COLD_EVIDENCE_INDEX_PATH_ALIAS_MISMATCH:${fullPathEntry.originalPath}`);
}

/**
 * Resolve one cold analysis object from Drive packs already authorized by the
 * compact ROOT receipt. The caller supplies raw sidecar bytes and an adapter
 * that returns the Drive object metadata/file_uri for its exact ID.
 */
export async function resolveColdEvidenceFromPack({
  root,
  originalPath,
  fullPathIndexBytes,
  fullPathIndexMetadata,
  receipt,
  downloadDriveIndex,
  downloadDrivePack
} = {}) {
  if (typeof root !== 'string' || !root) throw new Error('COLD_EVIDENCE_ROOT_REQUIRED');
  validateReceipt(receipt, root);
  const indexBytes = await loadFullPathIndexBytes({ receipt, fullPathIndexBytes, fullPathIndexMetadata, downloadDriveIndex });
  const index = parseIndex(indexBytes, receipt, root);
  validateRepoPath(originalPath, 'requestPath', index.allowedRoots);
  if (receipt.pathCount !== index.pathCount || receipt.uniqueBlobCount !== index.uniqueBlobCount
      || receipt.pathBytes !== index.pathBytes || receipt.uniqueRawBytes !== index.uniqueRawBytes) {
    throw new Error('COLD_EVIDENCE_INDEX_RECEIPT_SCOPE_MISMATCH');
  }
  const matches = index.files.filter(entry => entry.originalPath === originalPath);
  if (matches.length !== 1) throw new Error(`COLD_EVIDENCE_INDEX_PATH_NOT_UNIQUE:${originalPath}`);
  const entry = matches[0];
  if (!HEX40.test(entry.gitBlobSha1) || !HEX64.test(entry.sha256)) throw new Error(`COLD_EVIDENCE_OBJECT_ID_INVALID:${originalPath}`);
  const cacheRel = `${COLD_EVIDENCE_CACHE}/raw/${entry.sha256.toLowerCase()}.bin`;
  const checkObject = bytes => bytes.length === entry.sizeBytes && sha256(bytes) === entry.sha256.toLowerCase() && gitBlobSha1(bytes) === entry.gitBlobSha1.toLowerCase();
  const cached = readCache(root, cacheRel, checkObject);
  if (cached) return { originalPath, gitBlobSha1: entry.gitBlobSha1, sha256: entry.sha256, sizeBytes: entry.sizeBytes, bytes: cached, source: 'verified-local-cache', cachePath: cacheRel };

  const byChunk = new Map();
  for (const objectPack of entry.objectPacks) {
    const packRow = receipt.packs.find(row => row.name === objectPack.pack);
    if (!packRow) throw new Error(`COLD_EVIDENCE_PACK_NOT_IN_ROOT_RECEIPT:${objectPack.pack}`);
    const packBytes = await loadVerifiedPack({ root, packRow, downloadDrivePack });
    const { manifest, zipMembers } = verifyPackMetadata(index, receipt, packRow, packBytes, root);
    const manifestRow = manifest.objects.find(row => row.member === objectPack.member);
    if (!manifestRow) throw new Error(`COLD_EVIDENCE_PACK_OBJECT_MISSING:${objectPack.member}`);
    verifyIndexedPackMember(entry, objectPack, manifestRow);
    const member = zipMembers.get(objectPack.member);
    const bytes = extractZipMember(packBytes, member);
    if (sha256(bytes) !== manifestRow.memberSha256.toLowerCase() || bytes.length !== manifestRow.memberBytes) {
      throw new Error(`COLD_EVIDENCE_PACK_CHUNK_VERIFY_FAILED:${objectPack.member}`);
    }
    if (byChunk.has(manifestRow.chunkIndex)) throw new Error(`COLD_EVIDENCE_CHUNK_DUPLICATE:${originalPath}`);
    byChunk.set(manifestRow.chunkIndex, { row: manifestRow, bytes });
  }

  const firstRow = byChunk.values().next().value?.row;
  if (!firstRow || firstRow.chunkCount !== byChunk.size) throw new Error(`COLD_EVIDENCE_CHUNK_SET_INCOMPLETE:${originalPath}`);
  let raw;
  if (firstRow.chunkCount === 1) {
    if (firstRow.chunkIndex !== 0 || firstRow.startByte !== 0 || firstRow.endByteExclusive !== entry.sizeBytes) throw new Error(`COLD_EVIDENCE_SINGLE_CHUNK_RANGE_INVALID:${originalPath}`);
    raw = byChunk.get(0).bytes;
  } else {
    const chunks = [];
    let offset = 0;
    for (let indexNumber = 1; indexNumber <= firstRow.chunkCount; indexNumber += 1) {
      const item = byChunk.get(indexNumber);
      if (!item || item.row.chunkCount !== firstRow.chunkCount || item.row.startByte !== offset
          || item.row.endByteExclusive - item.row.startByte !== item.bytes.length) {
        throw new Error(`COLD_EVIDENCE_CHUNK_RANGE_INVALID:${originalPath}`);
      }
      chunks.push(item.bytes);
      offset = item.row.endByteExclusive;
    }
    if (offset !== entry.sizeBytes) throw new Error(`COLD_EVIDENCE_CHUNK_TOTAL_SIZE_MISMATCH:${originalPath}`);
    raw = Buffer.concat(chunks, entry.sizeBytes);
  }
  if (!checkObject(raw)) throw new Error(`COLD_EVIDENCE_RAW_OBJECT_VERIFY_FAILED:${originalPath}`);
  writeCache(root, cacheRel, raw);
  return { originalPath, gitBlobSha1: entry.gitBlobSha1, sha256: entry.sha256, sizeBytes: entry.sizeBytes, bytes: raw, source: 'verified-drive-pack', cachePath: cacheRel };
}

function parseCliArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') result.help = true;
    else if (['--receipt', '--index-file', '--pack-dir', '--original-path', '--root'].includes(arg)) {
      const value = argv[index + 1];
      if (!value) throw new Error(`COLD_EVIDENCE_CLI_VALUE_REQUIRED:${arg}`);
      result[arg.slice(2).replaceAll('-', '')] = value;
      index += 1;
    } else throw new Error(`COLD_EVIDENCE_CLI_ARGUMENT_UNKNOWN:${arg}`);
  }
  return result;
}

function readRegularFile(filePath, label, maxBytes) {
  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink() || !stat.isFile() || stat.size > maxBytes) throw new Error(`COLD_EVIDENCE_CLI_FILE_INVALID:${label}`);
  return fs.readFileSync(filePath);
}

async function main() {
  const args = parseCliArgs(process.argv.slice(2));
  if (args.help) {
    process.stdout.write('Usage: node tools/archive-cold-evidence.mjs --receipt <git-root-receipt.json> --index-file <downloaded-index.json> --pack-dir <downloaded-pack-directory> --original-path <archive-path> [--root <repo-root>]\n');
    return 0;
  }
  for (const key of ['receipt', 'indexfile', 'packdir', 'originalpath']) {
    if (typeof args[key] !== 'string') throw new Error(`COLD_EVIDENCE_CLI_ARGUMENT_REQUIRED:--${key}`);
  }
  const root = path.resolve(args.root ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
  const receiptBytes = readRegularFile(path.resolve(args.receipt), 'root-receipt', 2 * 1024 * 1024);
  const receipt = JSON.parse(receiptBytes.toString('utf8'));
  const indexFile = path.resolve(args.indexfile);
  const indexBytes = readRegularFile(indexFile, 'fullpath-index', MAX_INDEX_BYTES);
  const indexMetadata = {
    id: receipt.index?.driveFileId,
    file_name: receipt.index?.driveName,
    mime_type: receipt.index?.driveMimeType,
    file_size_bytes: receipt.index?.driveSizeBytes,
    parent_ids: receipt.index?.sourceVersion?.parentIds,
    modified_time: receipt.index?.sourceVersion?.observedModifiedTime,
    bytes: indexBytes
  };
  const packDirectory = path.resolve(args.packdir);
  const directoryInfo = fs.lstatSync(packDirectory);
  if (directoryInfo.isSymbolicLink() || !directoryInfo.isDirectory()) throw new Error('COLD_EVIDENCE_CLI_PACK_DIRECTORY_INVALID');
  const result = await resolveColdEvidenceFromPack({
    root,
    originalPath: args.originalpath,
    fullPathIndexBytes: indexBytes,
    fullPathIndexMetadata: indexMetadata,
    receipt,
    downloadDrivePack: async driveFileId => {
      const pack = receipt.packs.find(row => row.driveFileId === driveFileId);
      if (!pack) throw new Error('COLD_EVIDENCE_CLI_PACK_ID_NOT_IN_RECEIPT');
      const file = path.join(packDirectory, pack.name);
      return {
        id: pack.driveFileId,
        file_name: pack.driveName,
        mime_type: pack.driveMimeType,
        file_size_bytes: pack.driveSizeBytes,
        parent_ids: pack.sourceVersion.parentIds,
        modified_time: pack.sourceVersion.observedModifiedTime,
        localPath: file
      };
    }
  });
  process.stdout.write(`${JSON.stringify({
    schemaVersion: 'archive-cold-evidence-materialization/v1',
    status: 'RAW_BYTES_HASH_VERIFIED',
    originalPath: result.originalPath,
    sha256: result.sha256,
    gitBlobSha1: result.gitBlobSha1,
    sizeBytes: result.sizeBytes,
    cachePath: result.cachePath,
    source: result.source,
    reviewStatus: 'UNCHANGED_BY_MATERIALIZER'
  }, null, 2)}\n`);
  return 0;
}

const entrypoint = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (import.meta.url === entrypoint) {
  try { process.exitCode = await main(); }
  catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
