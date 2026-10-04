import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export function stableStringify(value) {
  return JSON.stringify(sortValue(value));
}

function sortValue(value) {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortValue(value[key])]));
  }
  return value;
}

export function sha256(value) {
  const input = Buffer.isBuffer(value) ? value : Buffer.from(typeof value === 'string' ? value : stableStringify(value));
  return crypto.createHash('sha256').update(input).digest('hex');
}

export function fileSha256(filePath) {
  return sha256(fs.readFileSync(filePath));
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

export function canonicalUidSet(uids) {
  return [...new Set(uids)].sort();
}

export function repoPath(repoRoot, relativePath) {
  return path.resolve(repoRoot, relativePath);
}

export function relativeRepoPath(repoRoot, absolutePath) {
  return path.relative(repoRoot, absolutePath).replaceAll('\\', '/');
}
