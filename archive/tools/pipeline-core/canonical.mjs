import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export const HASH_PATTERN = /^sha256:[0-9a-f]{64}$/;
export const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
export const nonempty = value => typeof value === 'string' && value.trim().length > 0;

// Never reinterpret mathematics here. Arrays remain ordered; typed SET fields
// are sorted by their schema adapter, not by a global property-name heuristic.
export function canonicalJson(value) {
  const fail = (code, pathValue, item) => {
    const error = new Error(code);
    error.code = code;
    error.path = pathValue;
    error.valueType = item === null ? 'null' : typeof item === 'object' ? Object.prototype.toString.call(item).slice(8, -1) : typeof item;
    throw error;
  };
  function visit(item, pathValue) {
    if (item === null || typeof item === 'boolean') return item;
    if (typeof item === 'number') {
      if (!Number.isFinite(item) || Math.abs(item) > Number.MAX_SAFE_INTEGER) fail('NON_CANONICAL_NUMBER', pathValue, item);
      return Object.is(item, -0) ? 0 : item;
    }
    if (typeof item === 'string') return item.normalize('NFC');
    if (Array.isArray(item)) return item.map((child, index) => visit(child, pathValue + '[' + index + ']'));
    if (!isObject(item) || Object.getPrototypeOf(item) !== Object.prototype) fail('NON_JSON_VALUE', pathValue, item);
    const keys = Object.keys(item).sort();
    const normalized = keys.map(key => key.normalize('NFC'));
    if (new Set(normalized).size !== keys.length) fail('NORMALIZED_KEY_COLLISION', pathValue, item);
    return Object.fromEntries(keys.map(key => [key.normalize('NFC'), visit(item[key], pathValue + '.' + key)]));
  }
  return JSON.stringify(visit(value, '$'));
}
export const bytesSha = bytes => {
  if (!Buffer.isBuffer(bytes) && !(bytes instanceof Uint8Array)) throw new Error('RAW_BYTES_REQUIRED');
  return `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
};
export const objectSha = value => bytesSha(Buffer.from(canonicalJson(value), 'utf8'));
export const uidSet = uids => {
  if (!Array.isArray(uids) || uids.some(uid => !nonempty(uid)) || new Set(uids).size !== uids.length) throw new Error('INVALID_UID_SET');
  return [...uids].sort();
};
export const uidSetSha = uids => objectSha(uidSet(uids));

export function safePath(root, relative, { mustExist = true } = {}) {
  if (!nonempty(relative) || relative.includes('\\') || relative.includes('\0') || path.posix.isAbsolute(relative) || /^[a-z]:/i.test(relative) || relative.split('/').some(p => ['', '.', '..'].includes(p))) throw new Error('NON_CANONICAL_PATH');
  const base = fs.realpathSync(root);
  const target = path.resolve(base, relative);
  const contained = p => p.startsWith(`${base}${path.sep}`);
  if (!contained(target)) throw new Error('PATH_ESCAPE');
  if (mustExist) {
    if (!contained(fs.realpathSync(target))) throw new Error('SYMLINK_ESCAPE');
  } else {
    let parent = path.dirname(target);
    while (!fs.existsSync(parent)) parent = path.dirname(parent);
    if (parent !== base && !contained(fs.realpathSync(parent))) throw new Error('SYMLINK_ESCAPE');
  }
  return target;
}

export function fileRef(root, relative) {
  const file = safePath(root, relative);
  if (!fs.statSync(file).isFile()) throw new Error('NOT_A_FILE');
  const bytes = fs.readFileSync(file);
  return { path: relative, bytes: bytes.length, sha256: bytesSha(bytes) };
}

export function readBoundFile(root, ref) {
  if (!isObject(ref) || !HASH_PATTERN.test(ref.sha256) || !Number.isSafeInteger(ref.bytes) || ref.bytes < 0) throw new Error('INVALID_FILE_REF');
  const file = safePath(root, ref.path);
  if (!fs.statSync(file).isFile()) throw new Error('NOT_A_FILE');
  const bytes = fs.readFileSync(file);
  if (bytes.length !== ref.bytes || bytesSha(bytes) !== ref.sha256) throw new Error(`STALE_FILE:${ref.path}`);
  return bytes;
}

export function writeNewJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // Reports and first-pass evidence are append-only; new attempts use new paths.
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
}
