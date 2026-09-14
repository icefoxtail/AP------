import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

import { bytesSha, canonicalJson } from '../../pipeline-core/canonical.mjs';
import { canonicalExamIdentity, parseExamPdfMetadata, sameCanonicalExamIdentity } from './exam-id.mjs';

export const CANONICAL_EXAM_IDENTITY_FIELDS = Object.freeze(['year', 'school', 'grade', 'semester', 'examType', 'course']);
const CANONICAL_EXAM_IDENTITY_BASE_FIELDS = Object.freeze(CANONICAL_EXAM_IDENTITY_FIELDS.filter(field => field !== 'course'));

function loadDatabase(file) {
  if (!fs.existsSync(file)) return [];
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file, timeout: 3000 });
  return Array.isArray(context.window.mainDB?.exams) ? context.window.mainDB.exams : [];
}

function normalizeProductionFile(value) {
  return String(value || '')
    .replaceAll('\\', '/')
    .replace(/^archive\/exams\//, '')
    .replace(/^exams\//, '')
    .replace(/^\/+/, '');
}

function identityKey(identity) {
  return canonicalJson(canonicalExamIdentity(identity));
}

function baseIdentityKey(identity) {
  const canonical = canonicalExamIdentity(identity);
  return canonicalJson(Object.fromEntries(CANONICAL_EXAM_IDENTITY_BASE_FIELDS.map(field => [field, canonical[field]])));
}

function identityComplete(identity) {
  return CANONICAL_EXAM_IDENTITY_FIELDS.every(field => Boolean(identity?.[field]));
}

function inside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

function productionFileFor(archive, relative) {
  const root = path.resolve(archive, 'exams');
  const file = path.resolve(root, relative);
  return inside(root, file) ? file : null;
}

function mergeCandidate(existing, candidate) {
  if (!existing) return candidate;
  const identities = [...(existing.identityCandidates || [existing.identity]), candidate.identity].filter(Boolean);
  const preferredIdentity = [existing.identity, candidate.identity].sort((left, right) => Number(identityComplete(right)) - Number(identityComplete(left)))[0];
  return {
    ...existing,
    identity: preferredIdentity,
    identityCandidates: identities.filter((item, index, all) => all.findIndex(other => sameCanonicalExamIdentity(item, other)) === index),
    discovery: existing.discovery === candidate.discovery ? existing.discovery : 'DATABASE_AND_FILESYSTEM',
    dbEntry: existing.dbEntry || candidate.dbEntry,
    sha256: candidate.sha256 || existing.sha256,
  };
}

function candidateFromFile(archive, file, identity, { discovery, examId = null, dbEntry = null } = {}) {
  const relative = path.relative(path.resolve(archive, 'exams'), file).split(path.sep).join('/');
  const bytes = fs.readFileSync(file);
  return {
    examId: examId || identity.examId || path.basename(relative, path.extname(relative)),
    file: relative,
    identity: canonicalExamIdentity(identity),
    discovery,
    dbEntry,
    bytes: bytes.length,
    sha256: bytesSha(bytes),
  };
}

export function scanProductionCandidates({ archiveRoot, dbEntries = null, onScan = null } = {}) {
  const archive = path.resolve(archiveRoot || 'archive');
  const entries = dbEntries || loadDatabase(path.join(archive, 'db.js'));
  const candidatesByFile = new Map();
  for (const entry of entries) {
    const relative = normalizeProductionFile(entry?.file);
    const file = relative ? productionFileFor(archive, relative) : null;
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
    const candidate = candidateFromFile(archive, file, entry, { discovery: 'DATABASE', examId: entry.examId || null, dbEntry: entry });
    candidatesByFile.set(relative, mergeCandidate(candidatesByFile.get(relative), candidate));
  }

  const originalRoot = path.join(archive, 'exams', 'original');
  const files = [];
  const walk = directory => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.js')) files.push(file);
    }
  };
  walk(originalRoot);
  for (const file of files.sort()) {
    const parsed = parseExamPdfMetadata(file, archive);
    const relative = path.relative(path.resolve(archive, 'exams'), file).split(path.sep).join('/');
    const candidate = candidateFromFile(archive, file, parsed, { discovery: 'STRUCTURED_PRODUCTION_SCAN', examId: parsed.examId || null });
    candidatesByFile.set(relative, mergeCandidate(candidatesByFile.get(relative), candidate));
  }
  const candidates = [...candidatesByFile.values()].sort((left, right) => left.file.localeCompare(right.file));
  onScan?.({ archiveRoot: archive, fileCount: files.length, candidateCount: candidates.length });
  return { archiveRoot: archive, candidates, scannedFileCount: files.length };
}

export function indexProductionCandidates(candidates = []) {
  const exact = new Map();
  const base = new Map();
  for (const candidate of candidates) {
    const exactKey = identityKey(candidate.identity);
    const exactRows = exact.get(exactKey) || [];
    exactRows.push(candidate);
    exact.set(exactKey, exactRows);
    const baseKey = baseIdentityKey(candidate.identity);
    const baseRows = base.get(baseKey) || [];
    baseRows.push(candidate);
    base.set(baseKey, baseRows);
  }
  return { candidates: [...candidates], exact, base };
}

function revalidateCandidate(archive, target, candidate) {
  const file = productionFileFor(archive, candidate.file);
  if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) return { ...candidate, status: 'STALE' };
  const bytes = fs.readFileSync(file);
  const currentSha = bytesSha(bytes);
  if (candidate.sha256 && candidate.sha256 !== currentSha) return { ...candidate, status: 'STALE', currentSha256: currentSha };
  const parsed = parseExamPdfMetadata(file, archive);
  const parsedIdentity = canonicalExamIdentity(parsed);
  if (candidate.discovery === 'STRUCTURED_PRODUCTION_SCAN' && identityComplete(target) && !sameCanonicalExamIdentity(target, parsedIdentity)) return { ...candidate, status: 'STALE', parsedIdentity };
  return { ...candidate, bytes: bytes.length, sha256: currentSha, identity: candidate.identity, parsedIdentity };
}

export function findExistingProductionExam({ archiveRoot, examIdentity, dbEntries = null, productionIndex = null, productionCandidates = null } = {}) {
  const archive = path.resolve(archiveRoot || 'archive');
  const target = canonicalExamIdentity(examIdentity);
  if (!identityComplete(target)) return { status: 'INCOMPLETE', candidates: [], identity: target };
  const index = productionIndex || indexProductionCandidates(productionCandidates || scanProductionCandidates({ archiveRoot: archive, dbEntries }).candidates);
  const exact = [...(index.exact.get(identityKey(target)) || [])];
  const incomplete = [...(index.base.get(baseIdentityKey(target)) || [])].filter(candidate => !candidate.identity.course);
  if (incomplete.length) return { status: 'INCOMPLETE', candidates: incomplete.map(candidate => revalidateCandidate(archive, target, candidate)), identity: target };
  const revalidated = exact.map(candidate => revalidateCandidate(archive, target, candidate));
  const stale = revalidated.filter(candidate => candidate.status === 'STALE');
  if (stale.length) return { status: 'STALE', candidates: stale, identity: target };
  if (revalidated.length === 0) return null;
  if (revalidated.length > 1) return { status: 'AMBIGUOUS', candidates: revalidated, identity: target };
  const candidate = revalidated[0];
  return { examId: candidate.examId || path.basename(candidate.file, '.js'), file: candidate.file, identity: target, discovery: candidate.discovery, sha256: candidate.sha256, bytes: candidate.bytes };
}

export function existingExamPreflight({ archiveRoot, examIdentity, forceExisting = false, dbEntries = null, productionIndex = null, productionCandidates = null } = {}) {
  const identity = canonicalExamIdentity(examIdentity);
  const missingIdentityFields = CANONICAL_EXAM_IDENTITY_FIELDS.filter(field => !identity[field]);
  if (missingIdentityFields.length) return { status: 'HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE', skip: false, hold: true, identity, missingIdentityFields };
  if (forceExisting) return { status: 'FORCE_EXISTING_EXAM', skip: false, identity, existing: null };
  const existing = findExistingProductionExam({ archiveRoot, examIdentity: identity, dbEntries, productionIndex, productionCandidates });
  if (!existing) return { status: 'NEW_EXAM', skip: false, identity, existing: null };
  if (existing.status === 'AMBIGUOUS') return { status: 'HOLD_EXISTING_EXAM_AMBIGUOUS', skip: false, hold: true, identity, candidates: existing.candidates };
  if (existing.status === 'INCOMPLETE') return { status: 'HOLD_EXISTING_EXAM_IDENTITY_INCOMPLETE', skip: false, hold: true, identity, missingIdentityFields: ['course'], candidates: existing.candidates };
  if (existing.status === 'STALE') return { status: 'HOLD_EXISTING_EXAM_STALE', skip: false, hold: true, identity, candidates: existing.candidates };
  return { status: 'SKIP_EXISTING_EXAM', skip: true, identity, existing };
}

export function loadExistingExamEntries(archiveRoot) {
  return loadDatabase(path.join(path.resolve(archiveRoot || 'archive'), 'db.js'));
}
