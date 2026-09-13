import fs from 'node:fs';
import path from 'node:path';

import { HASH_PATTERN, bytesSha, canonicalJson, objectSha } from '../../pipeline-core/canonical.mjs';

export const PRODUCTION_ROOTS = Object.freeze([
  'archive/exams',
  'archive/assets',
  'archive/db.js',
  'archive/question-index.js',
]);

export const PROMOTION_TRANSIENT_FIELDS = Object.freeze([
  'answerSource',
  'solutionSource',
  'answerStatus',
  'solutionStatus',
  'contentSource',
  'choicesSource',
  'extractionStatus',
  'reviewStatus',
  'reviewReason',
  'contentConfidence',
  'choicesConfidence',
  'tagConfidence',
  'tagStatus',
  'fullPageImagePath',
  'fullPageImageRelPath',
  'sourceFile',
  'cropPath',
  'visualAssetStatus',
  'visualAssetType',
]);

const TRANSIENT_FIELD_SET = new Set(PROMOTION_TRANSIENT_FIELDS);
const TRANSIENT_VALUE = /(?:generated_pending|builder_complete_pending_final_audit|(?:^|[\\/])_generated(?:[\\/]|$)|(?:^|[\\/])alive[\\/]runtime(?:[\\/]|$)|^[A-Za-z]:[\\/])/;

function absolute(root, value) {
  const text = String(value || '');
  return path.isAbsolute(text) ? path.resolve(text) : path.resolve(root, text);
}

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

export function productionPath(root, value) {
  const candidate = absolute(root, value);
  for (const relative of PRODUCTION_ROOTS) {
    const base = path.resolve(root, relative);
    if (inside(base, candidate)) return relative;
  }
  return null;
}

export function assertStagingOutput(root, target, code = 'UNAUTHORIZED_PRODUCTION_WRITE') {
  const base = path.resolve(root);
  const resolved = absolute(base, target);
  if (!inside(base, resolved)) throw new Error(code + ':path escapes repository root');
  const hit = productionPath(base, resolved);
  if (hit) throw new Error(code + ':staging output resolves inside ' + hit);
  return resolved;
}

export function assertNoProductionWrite(root, changedPaths, operation = 'BUILD') {
  const hits = (changedPaths || []).filter(value => productionPath(root, value));
  if (hits.length) throw new Error('UNAUTHORIZED_PRODUCTION_WRITE:' + operation + ':' + hits.join(','));
  return { status: 'PASS', protectedChanges: [] };
}

function allowlisted(root, value, allowed) {
  const candidate = absolute(root, value);
  return allowed.some(entry => inside(absolute(root, entry), candidate));
}

export function assertPromotionWriteScope(root, changedPaths, { targetProductionJs, targetAssetRoot } = {}) {
  if (!targetProductionJs || !targetAssetRoot) throw new Error('PROMOTION_WRITE_ALLOWLIST_REQUIRED');
  const allowed = [targetProductionJs, targetAssetRoot];
  const protectedChanges = (changedPaths || []).filter(value => productionPath(root, value));
  const unexpected = protectedChanges.filter(value => !allowlisted(root, value, allowed));
  if (unexpected.length) throw new Error('UNEXPECTED_PRODUCTION_WRITE_SCOPE:' + unexpected.join(','));
  const forbiddenDatabase = protectedChanges.filter(value => {
    const kind = productionPath(root, value);
    return kind === 'archive/db.js' || kind === 'archive/question-index.js';
  });
  if (forbiddenDatabase.length) throw new Error('UNEXPECTED_PRODUCTION_WRITE_SCOPE:' + forbiddenDatabase.join(','));
  return { status: 'PASS', protectedChanges, allowed };
}

export function assertRegistrationWriteScope(root, changedPaths, { dbPath, indexPath = null } = {}) {
  if (!dbPath) throw new Error('DB_WRITE_ALLOWLIST_REQUIRED');
  const allowed = [dbPath, ...(indexPath ? [indexPath] : [])];
  const protectedChanges = (changedPaths || []).filter(value => productionPath(root, value));
  const unexpected = protectedChanges.filter(value => !allowlisted(root, value, allowed));
  if (unexpected.length) throw new Error('UNEXPECTED_PRODUCTION_WRITE_SCOPE:' + unexpected.join(','));
  return { status: 'PASS', protectedChanges, allowed };
}

function walkTransient(value, location, found) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkTransient(item, location + '[' + index + ']', found));
    return;
  }
  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && TRANSIENT_VALUE.test(value)) found.push({ path: location, reason: 'TRANSIENT_PATH_OR_STATUS' });
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const childPath = location + '.' + key;
    if (TRANSIENT_FIELD_SET.has(key)) found.push({ path: childPath, reason: 'TRANSIENT_FIELD' });
    walkTransient(child, childPath, found);
  }
}

export function productionPayloadIssues(payload) {
  const found = [];
  walkTransient(payload, '$', found);
  return found;
}

export function assertProductionPayloadClean(payload) {
  const issues = productionPayloadIssues(payload);
  if (issues.length) throw new Error('TRANSIENT_PRODUCTION_METADATA:' + issues.map(item => item.path + ':' + item.reason).join(','));
  return { status: 'PASS', issues: [] };
}

export function stripTransientProductionFields(payload) {
  const clone = structuredClone(payload);
  const strip = value => {
    if (Array.isArray(value)) return value.map(strip);
    if (!value || typeof value !== 'object') return value;
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => !TRANSIENT_FIELD_SET.has(key))
      .map(([key, child]) => [key, strip(child)]));
  };
  return strip(clone);
}

export function assertSha(value, code = 'SHA_REQUIRED') {
  if (!HASH_PATTERN.test(String(value || ''))) throw new Error(code);
  return value;
}

export function assetSetSha(assetRefs = []) {
  const normalized = assetRefs.map(ref => {
    if (!ref?.path || !Number.isSafeInteger(ref.bytes) || !HASH_PATTERN.test(ref.sha256 || '')) throw new Error('ASSET_REF_INVALID');
    return { path: String(ref.path).replaceAll('\\', '/'), bytes: ref.bytes, sha256: ref.sha256 };
  }).sort((a, b) => a.path.localeCompare(b.path));
  const unique = new Map();
  for (const ref of normalized) {
    const previous = unique.get(ref.path);
    if (previous && canonicalJson(previous) !== canonicalJson(ref)) throw new Error('ASSET_REF_CONFLICT:' + ref.path);
    unique.set(ref.path, ref);
  }
  return objectSha([...unique.values()]);
}

export function readActualRef(root, ref) {
  if (!ref?.path) throw new Error('FILE_REF_REQUIRED');
  const base = path.resolve(root);
  const file = absolute(base, ref.path);
  if (!inside(base, file)) throw new Error('FILE_REF_ESCAPE:' + ref.path);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error('FILE_REF_MISSING:' + ref.path);
  if (!inside(base, fs.realpathSync(file))) throw new Error('FILE_REF_SYMLINK_ESCAPE:' + ref.path);
  const bytes = fs.readFileSync(file);
  return { path: ref.path, bytes: bytes.length, sha256: bytesSha(bytes) };
}
