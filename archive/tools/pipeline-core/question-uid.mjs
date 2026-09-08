import { HASH_PATTERN, isObject, nonempty, objectSha, uidSet } from './canonical.mjs';

export const QUESTION_UID_VERSION = 'QUESTION_UID_v2';
export const SOURCE_EXAM_ID_REGISTRY_VERSION = 'SOURCE_EXAM_ID_REGISTRY_v1';
export const UID_MIGRATION_EVIDENCE_VERSION = 'UID_MIGRATION_EVIDENCE_v1';

function requirePositiveOrdinal(value) {
  if (!Number.isSafeInteger(value) || value < 1) throw new Error('QUESTION_ORDINAL_INVALID');
  return value;
}

export function questionUidV2(sourceExamId, sourceQuestionOrdinal) {
  if (!nonempty(sourceExamId) || sourceExamId.includes('|')) throw new Error('SOURCE_EXAM_ID_INVALID');
  return `${sourceExamId.normalize('NFC')}|${requirePositiveOrdinal(sourceQuestionOrdinal)}`;
}

export function legacyQuestionUid(sourcePath, examId, qid) {
  if (!nonempty(sourcePath) || !nonempty(examId)) throw new Error('LEGACY_SOURCE_IDENTITY_INVALID');
  return `${sourcePath}|${examId}|${requirePositiveOrdinal(qid)}`;
}

export function parseQuestionUidV2(value) {
  if (!nonempty(value)) throw new Error('QUESTION_UID_MISSING');
  const separator = value.lastIndexOf('|');
  if (separator <= 0 || separator === value.length - 1) throw new Error('QUESTION_UID_V2_INVALID');
  const sourceExamId = value.slice(0, separator);
  const sourceQuestionOrdinal = Number(value.slice(separator + 1));
  if (questionUidV2(sourceExamId, sourceQuestionOrdinal) !== value) throw new Error('QUESTION_UID_V2_INVALID');
  return { sourceExamId, sourceQuestionOrdinal };
}

export function questionIdentityFromRecord(record, { registry = null } = {}) {
  if (!isObject(record)) throw new Error('QUESTION_RECORD_INVALID');
  if (nonempty(record.questionUidV2)) {
    const parsed = parseQuestionUidV2(record.questionUidV2);
    return { ...parsed, questionUidV2: record.questionUidV2, legacyQuestionUid: record.questionUid || null };
  }
  if (nonempty(record.sourceExamId) && record.sourceQuestionOrdinal !== undefined) {
    const questionUid = questionUidV2(record.sourceExamId, record.sourceQuestionOrdinal);
    return { sourceExamId: record.sourceExamId, sourceQuestionOrdinal: record.sourceQuestionOrdinal, questionUidV2: questionUid, legacyQuestionUid: record.questionUid || null };
  }
  if (registry && nonempty(record.questionUid)) {
    const match = registry.entries.find(entry => entry.legacyQuestionUid === record.questionUid || entry.questionUidV2 === record.questionUid);
    if (match) return { sourceExamId: match.sourceExamId, sourceQuestionOrdinal: match.sourceQuestionOrdinal, questionUidV2: match.questionUidV2, legacyQuestionUid: match.legacyQuestionUid || null };
  }
  throw new Error('QUESTION_UID_V2_MIGRATION_REQUIRED');
}

export function normalizeSourceExamIdRegistry(registry) {
  const entries = Array.isArray(registry) ? registry : registry?.entries;
  if (!Array.isArray(entries) || entries.length === 0) throw new Error('SOURCE_EXAM_ID_REGISTRY_MISSING');
  const normalized = entries.map(entry => {
    if (!isObject(entry) || !nonempty(entry.sourceExamId) || !nonempty(entry.questionUidV2)) throw new Error('SOURCE_EXAM_ID_REGISTRY_ENTRY_INVALID');
    const parsed = parseQuestionUidV2(entry.questionUidV2);
    if (parsed.sourceExamId !== entry.sourceExamId || (entry.sourceQuestionOrdinal !== undefined && parsed.sourceQuestionOrdinal !== entry.sourceQuestionOrdinal)) throw new Error('SOURCE_EXAM_ID_REGISTRY_UID_MISMATCH');
    if (entry.sourceSha256 !== undefined && !HASH_PATTERN.test(entry.sourceSha256)) throw new Error('SOURCE_EXAM_ID_REGISTRY_SHA_INVALID');
    return {
      canonicalSourceExamId: entry.canonicalSourceExamId,
      sourceIdentityKey: entry.sourceIdentityKey,
      status: entry.status,
      sourceExamId: entry.sourceExamId.normalize('NFC'),
      sourceQuestionOrdinal: parsed.sourceQuestionOrdinal,
      questionUidV2: entry.questionUidV2,
      legacyQuestionUid: entry.legacyQuestionUid || null,
      sourcePath: entry.sourcePath || null,
      sourceSha256: entry.sourceSha256 || null
    };
  }).sort((a, b) => a.questionUidV2.localeCompare(b.questionUidV2));
  const ids = uidSet(normalized.map(entry => entry.questionUidV2));
  const active = new Map(), reverse = new Map(), paths = new Map();
  for (const entry of normalized) {
    if (!nonempty(entry.sourceIdentityKey) || entry.canonicalSourceExamId !== entry.sourceExamId || !['ACTIVE', 'RETIRED'].includes(entry.status)) throw new Error('STABLE_SOURCE_AUTHORITY_REQUIRED');
    if (entry.status === 'ACTIVE') {
      const existing = active.get(entry.sourceIdentityKey);
      if (existing && existing !== entry.canonicalSourceExamId) throw new Error('MULTIPLE_ACTIVE_SOURCE_EXAM_IDS');
      active.set(entry.sourceIdentityKey, entry.canonicalSourceExamId);
      if (reverse.has(entry.canonicalSourceExamId) && reverse.get(entry.canonicalSourceExamId) !== entry.sourceIdentityKey) throw new Error('SOURCE_ID_MULTIPLE_IDENTITIES');
      reverse.set(entry.canonicalSourceExamId, entry.sourceIdentityKey);
      if (!nonempty(entry.sourcePath) || paths.has(entry.sourcePath) && paths.get(entry.sourcePath) !== entry.canonicalSourceExamId) throw new Error('SOURCE_PATH_MULTIPLE_IDS');
      paths.set(entry.sourcePath, entry.canonicalSourceExamId);
    }
  }
  if (ids.length !== normalized.length) throw new Error('SOURCE_EXAM_ID_REGISTRY_DUPLICATE');
  return { schemaVersion: SOURCE_EXAM_ID_REGISTRY_VERSION, entries: normalized };
}

export function sourceExamIdRegistrySha(registry) {
  return objectSha(normalizeSourceExamIdRegistry(registry));
}

export function createUidMigrationEvidence({ legacyQuestionUid: legacyUid, sourceExamId, sourceQuestionOrdinal, questionUidV2: uid, sourcePath = null, sourceSha256 = null, status = 'PASS', reason = 'CANONICAL_SOURCE_ID_MIGRATION' }) {
  const questionUidV2Value = uid || questionUidV2(sourceExamId, sourceQuestionOrdinal);
  const parsed = parseQuestionUidV2(questionUidV2Value);
  if (parsed.sourceExamId !== sourceExamId || parsed.sourceQuestionOrdinal !== sourceQuestionOrdinal) throw new Error('UID_MIGRATION_MAPPING_INVALID');
  if (legacyUid !== null && legacyUid !== undefined && !nonempty(legacyUid)) throw new Error('LEGACY_UID_INVALID');
  if (sourceSha256 !== null && !HASH_PATTERN.test(sourceSha256)) throw new Error('SOURCE_SHA_INVALID');
  if (!['PASS', 'FAIL'].includes(status)) throw new Error('UID_MIGRATION_STATUS_INVALID');
  return { schemaVersion: UID_MIGRATION_EVIDENCE_VERSION, legacyQuestionUid: legacyUid || null, questionUidV2: questionUidV2Value, sourceExamId, sourceQuestionOrdinal, sourcePath, sourceSha256, status, reason };
}

export function validateUidMigrationEvidence(evidence, expected = {}) {
  const errors = [];
  try {
    if (evidence?.schemaVersion !== UID_MIGRATION_EVIDENCE_VERSION) errors.push('UID_MIGRATION_SCHEMA_INVALID');
    if (evidence?.status !== 'PASS') errors.push('UID_MIGRATION_NOT_APPROVED');
    const mapped = createUidMigrationEvidence(evidence || {});
    for (const [key, expectedValue] of Object.entries(expected)) if (expectedValue !== undefined && mapped[key] !== expectedValue) errors.push(`UID_MIGRATION_${key.toUpperCase()}_MISMATCH`);
  } catch (error) { errors.push(error.message); }
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}
