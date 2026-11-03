'use strict';
/**
 * Whole-file digests of a shared RPM crosswalk file that earlier, already sealed evidence recorded.
 *
 * The crosswalk files only grow (rows for other questions are added or updated), so approved Meta that pinned the
 * whole-file sha256 of its time can no longer equal the current digest. A pinned digest is accepted when it is
 *   - the current digest, or
 *   - a digest that was sealed for the very same file path, either by a committed, sealed receipt (SEALED_RECEIPTS) or
 *     by an entry of the append-only registry (REGISTRY_REL) that every registration tool writes in the same write
 *     as the Meta that pins the digest.
 * Any other digest is refused. A seal is evidence that the digest was a real version of that file, not an exemption:
 * accepting a digest never replaces the row-level checks, callers must still verify that the record named by the Meta
 * agrees with the CURRENT crosswalk (unit, labels, difficulty, ...).
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const SEALED_RECEIPTS = [
  // [receipt path, field holding { path, sha256 } of the crosswalk file]
  ['archive/data/generated-lite-consumer/v1/meta-browse-alias-receipt-20261009.json', 'rpmCrosswalk'],
  ['archive/data/generated-lite-consumer/v1/legacy-meta-evidence-323.json', 'crosswalk']
];
const CROSSWALK_DIR = 'archive/data/meta-foundation/crosswalks/';
const REGISTRY_REL = `${CROSSWALK_DIR}sealed-digests.v1.json`;
const REGISTRY_SCHEMA = 'CROSSWALK_SEALED_DIGESTS_V1';
const ENTRY_KEYS = ['path', 'sha256', 'gitBlobSha1', 'sealedAt', 'sealedBy', 'reason'];
const SHA64 = /^[a-f0-9]{64}$/i;
const SHA64_LOWER = /^[a-f0-9]{64}$/;
const SHA40_LOWER = /^[a-f0-9]{40}$/;
const NOT_SEALED = 'CROSSWALK_DIGEST_NOT_SEALED';

const sha256Bytes = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gitBlobSha1 = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const nonEmptyString = value => typeof value === 'string' && value.trim() !== '' && value === value.trim();

function crosswalkPathIssue(rel) {
  if (!nonEmptyString(rel)) return 'PATH_INVALID';
  if (rel.includes('\\') || rel.split('/').some(part => part === '' || part === '.' || part === '..')) return 'PATH_NOT_NORMALIZED';
  if (!rel.startsWith(CROSSWALK_DIR) || !rel.endsWith('.json')) return 'PATH_NOT_UNDER_CROSSWALKS';
  if (rel === REGISTRY_REL) return 'PATH_IS_REGISTRY';
  return null;
}

/** Validate the entries of the registry. Returns a list of issue strings (empty when valid). */
function validateRegistryEntries(entries) {
  const issues = [];
  if (!Array.isArray(entries)) return ['ENTRIES_NOT_ARRAY'];
  const seen = new Set();
  entries.forEach((entry, index) => {
    const at = `entries[${index}]`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) { issues.push(`${at}:NOT_OBJECT`); return; }
    const extra = Object.keys(entry).filter(key => !ENTRY_KEYS.includes(key));
    if (extra.length) issues.push(`${at}:UNKNOWN_KEYS:${extra.join(',')}`);
    const pathIssue = crosswalkPathIssue(entry.path);
    if (pathIssue) issues.push(`${at}:${pathIssue}`);
    if (typeof entry.sha256 !== 'string' || !SHA64_LOWER.test(entry.sha256)) issues.push(`${at}:SHA256_INVALID`);
    if (typeof entry.gitBlobSha1 !== 'string' || !SHA40_LOWER.test(entry.gitBlobSha1)) issues.push(`${at}:GIT_BLOB_SHA1_INVALID`);
    if (typeof entry.sealedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(entry.sealedAt) || Number.isNaN(Date.parse(entry.sealedAt))) issues.push(`${at}:SEALED_AT_INVALID`);
    if (!nonEmptyString(entry.sealedBy)) issues.push(`${at}:SEALED_BY_INVALID`);
    if (!nonEmptyString(entry.reason)) issues.push(`${at}:REASON_INVALID`);
    if (typeof entry.path === 'string' && typeof entry.sha256 === 'string') {
      const key = `${entry.path}\0${entry.sha256.toLowerCase()}`;
      if (seen.has(key)) issues.push(`${at}:DUPLICATE_PATH_SHA256`);
      seen.add(key);
    }
  });
  return issues;
}

/** Parse and validate registry bytes. Throws SEALED_DIGEST_REGISTRY_INVALID:<issues> when malformed. */
function parseRegistry(bytes) {
  let doc;
  try { doc = JSON.parse(Buffer.from(bytes).toString('utf8')); }
  catch (error) { throw new Error(`SEALED_DIGEST_REGISTRY_INVALID:JSON_PARSE:${error.message}`); }
  const issues = [];
  if (!doc || typeof doc !== 'object' || Array.isArray(doc)) issues.push('DOCUMENT_NOT_OBJECT');
  else {
    if (doc.schemaVersion !== REGISTRY_SCHEMA) issues.push('SCHEMA_VERSION_INVALID');
    issues.push(...validateRegistryEntries(doc.entries));
  }
  if (issues.length) throw new Error(`SEALED_DIGEST_REGISTRY_INVALID:${issues.slice(0, 8).join('|')}`);
  return doc.entries;
}

/** Deterministic registry bytes: one entry per line so concurrent appends diff and merge line by line. */
function serializeRegistry(entries) {
  const rows = entries.map(entry => `    ${JSON.stringify(Object.fromEntries(ENTRY_KEYS.map(key => [key, entry[key]])))}`);
  return Buffer.from(`{\n  "schemaVersion": ${JSON.stringify(REGISTRY_SCHEMA)},\n  "appendOnly": true,\n  "entries": [\n${rows.join(',\n')}\n  ]\n}\n`, 'utf8');
}

const registryCache = new Map();
/** Entries of the registry of `root`; a missing file is an empty registry, a malformed file throws. */
function readRegistryEntries(root) {
  const file = path.join(root, REGISTRY_REL);
  if (!fs.existsSync(file)) return [];
  const bytes = fs.readFileSync(file);
  const text = bytes.toString('utf8');
  const cached = registryCache.get(file);
  if (cached && cached.text === text) return cached.entries;
  const entries = parseRegistry(bytes);
  registryCache.set(file, { text, entries });
  return entries;
}

const receiptCache = new Map();
function readReceiptRef(root, receiptRel, field) {
  const file = path.join(root, receiptRel);
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, 'utf8');
  let cached = receiptCache.get(file);
  if (!cached || cached.text !== text) {
    cached = { text, doc: JSON.parse(text) };
    receiptCache.set(file, cached);
  }
  return cached.doc[field];
}

function sealedCrosswalkDigests(root, crosswalkRel) {
  const digests = new Set();
  for (const [receiptRel, field] of SEALED_RECEIPTS) {
    const ref = readReceiptRef(root, receiptRel, field);
    if (ref && ref.path === crosswalkRel && SHA64.test(ref.sha256 || '')) digests.add(ref.sha256.toLowerCase());
  }
  for (const entry of readRegistryEntries(root)) if (entry.path === crosswalkRel) digests.add(entry.sha256.toLowerCase());
  return digests;
}

/** 'CURRENT' | 'SEALED' | 'NOT_SEALED' | 'MALFORMED' for a digest pinned to crosswalkRel. */
function crosswalkDigestStatus(root, crosswalkRel, pinnedSha256, currentSha256) {
  if (!SHA64.test(pinnedSha256 || '')) return 'MALFORMED';
  const pinned = pinnedSha256.toLowerCase();
  if (pinned === String(currentSha256).toLowerCase()) return 'CURRENT';
  return sealedCrosswalkDigests(root, crosswalkRel).has(pinned) ? 'SEALED' : 'NOT_SEALED';
}

function crosswalkDigestAccepted(root, crosswalkRel, pinnedSha256, currentSha256) {
  const status = crosswalkDigestStatus(root, crosswalkRel, pinnedSha256, currentSha256);
  return status === 'CURRENT' || status === 'SEALED';
}

/** True when (path, sha256) is in a receipt or the registry, whether or not it is the current digest. */
function crosswalkDigestIsSealed(root, crosswalkRel, sha256) {
  return SHA64.test(sha256 || '') && sealedCrosswalkDigests(root, crosswalkRel).has(sha256.toLowerCase());
}

/**
 * Plan an idempotent append of the crosswalk bytes a tool actually read. Nothing is written; callers either write
 * `after` together with their own files (CAS on `before`) or call sealCrosswalkDigest.
 */
function planSeal(root, { path: crosswalkRel, bytes, sealedBy, reason, now = new Date() }) {
  const entry = {
    path: crosswalkRel,
    sha256: sha256Bytes(bytes),
    gitBlobSha1: gitBlobSha1(bytes),
    sealedAt: new Date(now).toISOString(),
    sealedBy,
    reason
  };
  const issues = validateRegistryEntries([entry]);
  if (issues.length) throw new Error(`SEALED_DIGEST_ENTRY_INVALID:${issues.join('|')}`);
  const file = path.join(root, REGISTRY_REL);
  const before = fs.existsSync(file) ? fs.readFileSync(file) : null;
  const entries = before ? parseRegistry(before) : [];
  const existing = entries.find(row => row.path === entry.path && row.sha256 === entry.sha256);
  if (existing) return { changed: false, entry: existing, file, before, after: before };
  return { changed: true, entry, file, before, after: serializeRegistry([...entries, entry]) };
}

/** Append the seal now (temp file + rename, compare-and-swap on the bytes planned against). */
function sealCrosswalkDigest(root, options) {
  const plan = planSeal(root, options);
  if (!plan.changed) return plan;
  const current = fs.existsSync(plan.file) ? fs.readFileSync(plan.file) : null;
  if ((current === null) !== (plan.before === null) || (current && !current.equals(plan.before))) throw new Error('SEALED_DIGEST_REGISTRY_CAS_CONFLICT');
  fs.mkdirSync(path.dirname(plan.file), { recursive: true });
  const temp = `${plan.file}.tmp-${process.pid}-${crypto.randomBytes(6).toString('hex')}`;
  fs.writeFileSync(temp, plan.after, { flag: 'wx' });
  fs.renameSync(temp, plan.file);
  return plan;
}

module.exports = {
  REGISTRY_REL, REGISTRY_SCHEMA, CROSSWALK_DIR, SEALED_RECEIPTS, NOT_SEALED,
  sealedCrosswalkDigests, crosswalkDigestAccepted, crosswalkDigestStatus, crosswalkDigestIsSealed,
  validateRegistryEntries, parseRegistry, serializeRegistry, readRegistryEntries, planSeal, sealCrosswalkDigest
};
