import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const EVIDENCE_AUTHORITY_INDEX_PATH = 'archive/data/evidence-authority/v1/index.json';
export const EVIDENCE_AUTHORITY_SCHEMA = 'archive-analysis-hot-authorities/v1';

const HEX40 = /^[a-f0-9]{40}$/i;
const HEX64 = /^[a-f0-9]{64}$/i;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');

function safeRepoPath(root, relative, label) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.includes('\0')
      || path.posix.isAbsolute(relative) || relative.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`EVIDENCE_AUTHORITY_PATH_INVALID:${label}`);
  }
  let absoluteRoot;
  try { absoluteRoot = fs.realpathSync(root); }
  catch { throw new Error(`EVIDENCE_AUTHORITY_ROOT_INVALID:${label}`); }
  const absolute = path.resolve(absoluteRoot, ...relative.split('/'));
  const fromRoot = path.relative(absoluteRoot, absolute);
  if (!fromRoot || fromRoot === '..' || fromRoot.startsWith(`..${path.sep}`) || path.isAbsolute(fromRoot)) {
    throw new Error(`EVIDENCE_AUTHORITY_PATH_OUTSIDE_ROOT:${label}`);
  }
  let current = absoluteRoot;
  const segments = fromRoot.split(path.sep);
  for (let index = 0; index < segments.length; index += 1) {
    current = path.join(current, segments[index]);
    let stat;
    try { stat = fs.lstatSync(current); }
    catch (error) {
      if (error.code === 'ENOENT') throw new Error(`EVIDENCE_AUTHORITY_PATH_MISSING:${label}`);
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error(`EVIDENCE_AUTHORITY_SYMLINK_REJECTED:${label}`);
    if (index < segments.length - 1 && !stat.isDirectory()) throw new Error(`EVIDENCE_AUTHORITY_PARENT_INVALID:${label}`);
    if (index === segments.length - 1 && !stat.isFile()) throw new Error(`EVIDENCE_AUTHORITY_FILE_INVALID:${label}`);
  }
  return absolute;
}

function validateIndexPath(value, prefix, label) {
  if (typeof value !== 'string' || !value.startsWith(prefix) || value.includes('\\') || value.includes('\0')
      || path.posix.isAbsolute(value) || value.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error(`EVIDENCE_AUTHORITY_PATH_INVALID:${label}`);
  }
  return value;
}

function validateIndex(index) {
  if (!index || index.schemaVersion !== EVIDENCE_AUTHORITY_SCHEMA || !Array.isArray(index.entries)) {
    throw new Error('EVIDENCE_AUTHORITY_INDEX_SCHEMA_INVALID');
  }
  const paths = new Set();
  const authorities = new Set();
  for (const entry of index.entries) {
    if (!entry || typeof entry !== 'object' || entry.classification !== 'hot-authority'
        || !HEX40.test(entry.gitBlobSha1 ?? '') || !HEX64.test(entry.sha256 ?? '')
        || !Number.isSafeInteger(entry.sizeBytes) || entry.sizeBytes <= 0
        || typeof entry.evidenceRole !== 'string' || !entry.evidenceRole.trim()
        || !Array.isArray(entry.currentConsumers) || entry.currentConsumers.length === 0) {
      throw new Error('EVIDENCE_AUTHORITY_ENTRY_INVALID');
    }
    validateIndexPath(entry.originalPath, 'archive/analysis/', 'originalPath');
    validateIndexPath(entry.authorityPath, 'archive/data/evidence-authority/v1/', 'authorityPath');
    if (paths.has(entry.originalPath)) throw new Error(`EVIDENCE_AUTHORITY_ORIGINAL_PATH_DUPLICATE:${entry.originalPath}`);
    if (authorities.has(entry.authorityPath)) throw new Error(`EVIDENCE_AUTHORITY_DESTINATION_DUPLICATE:${entry.authorityPath}`);
    paths.add(entry.originalPath);
    authorities.add(entry.authorityPath);
  }
  return index;
}

export function loadEvidenceAuthorityIndex(root, indexPath = EVIDENCE_AUTHORITY_INDEX_PATH) {
  const absolute = safeRepoPath(root, indexPath, 'indexPath');
  let index;
  try { index = JSON.parse(fs.readFileSync(absolute, 'utf8')); }
  catch (error) { throw new Error(`EVIDENCE_AUTHORITY_INDEX_READ_FAILED:${error.message}`); }
  return validateIndex(index);
}

export function readHotEvidenceAuthority({ root, originalPath, indexPath } = {}) {
  const normalized = validateIndexPath(originalPath, 'archive/analysis/', 'requestPath');
  const index = loadEvidenceAuthorityIndex(root, indexPath);
  const entries = index.entries.filter(entry => entry.originalPath === normalized);
  if (entries.length !== 1) throw new Error(`EVIDENCE_AUTHORITY_NOT_UNIQUE:${normalized}`);
  const entry = entries[0];
  const file = safeRepoPath(root, entry.authorityPath, 'authorityPath');
  const bytes = fs.readFileSync(file);
  const actualSha = sha256(bytes);
  if (bytes.length !== entry.sizeBytes) throw new Error(`EVIDENCE_AUTHORITY_SIZE_MISMATCH:${normalized}`);
  if (actualSha !== entry.sha256.toLowerCase()) throw new Error(`EVIDENCE_AUTHORITY_SHA256_MISMATCH:${normalized}`);
  const actualBlob = gitBlobSha1(bytes);
  if (actualBlob !== entry.gitBlobSha1.toLowerCase()) throw new Error(`EVIDENCE_AUTHORITY_GIT_BLOB_MISMATCH:${normalized}`);
  return { entry, bytes, sha256: actualSha, gitBlobSha1: actualBlob };
}

export function validateEvidenceAuthorityBytes(entry, bytes) {
  if (!entry || !Buffer.isBuffer(bytes)) throw new Error('EVIDENCE_AUTHORITY_BYTES_REQUIRED');
  if (bytes.length !== entry.sizeBytes) throw new Error(`EVIDENCE_AUTHORITY_SIZE_MISMATCH:${entry.originalPath}`);
  if (sha256(bytes) !== String(entry.sha256).toLowerCase()) throw new Error(`EVIDENCE_AUTHORITY_SHA256_MISMATCH:${entry.originalPath}`);
  if (gitBlobSha1(bytes) !== String(entry.gitBlobSha1).toLowerCase()) throw new Error(`EVIDENCE_AUTHORITY_GIT_BLOB_MISMATCH:${entry.originalPath}`);
  return bytes;
}

export function evidenceAuthorityRepoRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
}
