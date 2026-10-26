// Student-accessible source provenance for recommended clinic follow-ups (slice A/A0).
//
// Scope:
//  - reads only the frozen per-recipient provenance the teacher-confirmed plan
//    wrote into meta.clinicRecommendationAssessment.sourceProvenance,
//  - re-authorizes every referenced node against stored assignment, recipient,
//    exclusion and session evidence before exposing a title/ID/link,
//  - never infers a parent from titles, UIDs, source_type or the current
//    Blueprint, and never backfills legacy markers: a marker without provenance
//    is reported as "관계 확인 불가" instead of being reconstructed,
//  - keeps the packet (printed wrong-clinic) path and the scored assessment path
//    separate: this helper only reads scored assignments.
//
// All reads are bounded and parameterized. A read failure degrades to an
// explicit 'unavailable' state and is never reported as "no relation".

import { sha256hex } from './admin-db.js';

export const CLINIC_LINEAGE_CONTRACT = 'apms-clinic-lineage-read-v1';
export const CLINIC_SOURCE_PROVENANCE_SCHEMA = 'clinic-source-provenance-v1';
// One /exams response is capped at 150 rows; source nodes are capped again so a
// single read never fans out unbounded.
export const CLINIC_LINEAGE_MAX_NODES = 48;

const SHA256_HEX = /^[0-9a-f]{64}$/i;
const ASSIGNMENT_ID = /^[A-Za-z0-9_:.\-]{1,80}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_TITLE = 200;
const MAX_ARCHIVE_FILE = 300;
const RELATION_KINDS = ['same_uid', 'similar_uid', 'ordinary_transfer'];

const schemaCacheByEnv = new WeakMap();

function text(value) {
  return String(value == null ? '' : value).trim();
}

function plainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function unique(values) {
  return Array.from(new Set((Array.isArray(values) ? values : []).map(text).filter(Boolean)));
}

function parseJsonObject(raw) {
  if (plainObject(raw)) return raw;
  if (typeof raw !== 'string' || !raw.trim()) return null;
  try {
    const value = JSON.parse(raw);
    return plainObject(value) ? value : null;
  } catch {
    return null;
  }
}

// Cheap prefilter: most assignment snapshots are plain originals/mixed papers.
// Avoid parsing every (up to ~900KB) payload on a 150-row portal read.
function mayCarryClinicMarker(raw) {
  if (plainObject(raw)) return Boolean(raw.meta?.clinicRecommendationAssessment);
  return typeof raw === 'string' && raw.includes('"clinicRecommendationAssessment"');
}

function schemaCache(env) {
  let cache = schemaCacheByEnv.get(env);
  if (!cache) {
    cache = { tables: new Map(), columns: new Map() };
    schemaCacheByEnv.set(env, cache);
  }
  return cache;
}

async function tableExists(env, tableName) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(String(tableName))) return false;
  const cache = schemaCache(env);
  if (cache.tables.has(tableName)) return cache.tables.get(tableName);
  let exists = false;
  try {
    const row = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    ).bind(tableName).first();
    exists = Boolean(row?.name);
  } catch {
    exists = false;
  }
  // Only positive results are cached so a later migration is observed.
  if (exists) cache.tables.set(tableName, true);
  return exists;
}

// A schema probe must never be confused with a genuinely absent legacy table:
// a failed PRAGMA is an unavailable read, not "no columns". Callers that gate
// recipient/exclusion authorization distinguish present/absent/error.
async function probeColumns(env, tableName) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(String(tableName))) return { state: 'error', columns: new Set() };
  const cache = schemaCache(env);
  if (cache.columns.has(tableName)) return { state: 'present', columns: cache.columns.get(tableName) };
  try {
    const res = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
    const columns = new Set((res.results || []).map(row => text(row.name)).filter(Boolean));
    if (!columns.size) return { state: 'absent', columns };
    cache.columns.set(tableName, columns);
    return { state: 'present', columns };
  } catch {
    return { state: 'error', columns: new Set() };
  }
}

async function tableColumns(env, tableName) {
  return (await probeColumns(env, tableName)).columns;
}

function normalizeScope(raw) {
  const value = plainObject(raw) ? raw : null;
  if (!value) return null;
  const pathKey = text(value.pathKey);
  if (!pathKey || pathKey.length > 400) return null;
  let parsed = null;
  try { parsed = JSON.parse(pathKey); } catch { parsed = null; }
  if (!Array.isArray(parsed) || parsed.length < 4 || parsed.length > 6 ||
      parsed.some(part => typeof part !== 'string' || !part)) return null;
  const bucket = value.difficultyBucket == null ? null : Number(value.difficultyBucket);
  if (bucket !== null && (!Number.isInteger(bucket) || bucket < 1 || bucket > 5)) return null;
  const targetUidCount = Number(value.targetUidCount);
  return {
    pathKey,
    pathDepth: parsed.length,
    difficultyBucket: bucket,
    targetUidCount: Number.isInteger(targetUidCount) && targetUidCount >= 0 ? targetUidCount : 0,
  };
}

function normalizeProvenanceEntry(raw) {
  if (!plainObject(raw)) return null;
  const studentId = text(raw.studentId);
  const classId = text(raw.classId);
  const sourceAssignmentId = text(raw.sourceAssignmentId);
  if (!studentId || !classId || !ASSIGNMENT_ID.test(sourceAssignmentId)) return null;
  const sourceSessionId = text(raw.sourceSessionId);
  if (sourceSessionId && !ASSIGNMENT_ID.test(sourceSessionId)) return null;
  const sourceSavedPaperId = text(raw.sourceSavedPaperId);
  if (sourceSavedPaperId && !ASSIGNMENT_ID.test(sourceSavedPaperId)) return null;
  const sourceExamTitle = text(raw.sourceExamTitle);
  const sourceExamDate = text(raw.sourceExamDate);
  const sourceQuestionCount = Number(raw.sourceQuestionCount);
  const sourceArchiveFile = text(raw.sourceArchiveFile);
  const sourceIdentityHash = text(raw.sourceIdentityHash);
  const resultSignatureHash = text(raw.resultSignatureHash);
  if (!sourceExamTitle || sourceExamTitle.length > MAX_TITLE || !DATE.test(sourceExamDate) ||
      !Number.isInteger(sourceQuestionCount) || sourceQuestionCount < 1 || sourceQuestionCount > 80 ||
      sourceArchiveFile.length > MAX_ARCHIVE_FILE) return null;
  if (sourceIdentityHash && !SHA256_HEX.test(sourceIdentityHash)) return null;
  if (resultSignatureHash && !SHA256_HEX.test(resultSignatureHash)) return null;
  return {
    studentId,
    classId,
    sourceAssignmentId,
    sourceSessionId,
    sourceSavedPaperId,
    sourceExamTitle,
    sourceExamDate,
    sourceQuestionCount,
    sourceArchiveFile,
    sourceIdentityHash: sourceIdentityHash.toLowerCase(),
    resultSignatureHash: resultSignatureHash.toLowerCase(),
    targetScope: normalizeScope(raw.targetScope),
  };
}

export function readClinicSourceProvenance(mixedPayloadJson) {
  const payload = parseJsonObject(mixedPayloadJson);
  const marker = plainObject(payload?.meta?.clinicRecommendationAssessment)
    ? payload.meta.clinicRecommendationAssessment
    : null;
  if (!marker) return { marker: null, provenance: null };
  const provenance = plainObject(marker.sourceProvenance) &&
    text(marker.sourceProvenance.schema) === CLINIC_SOURCE_PROVENANCE_SCHEMA
    ? marker.sourceProvenance : null;
  const recipients = provenance && Array.isArray(provenance.recipients)
    ? provenance.recipients.map(normalizeProvenanceEntry).filter(Boolean)
    : [];
  const relationKind = text(provenance?.relationKind).toLowerCase();
  return {
    marker: {
      kind: text(marker.kind).toUpperCase(),
      recommendationMode: text(marker.recommendationMode).toLowerCase(),
      operationId: text(marker.operationId),
      signature: text(marker.signature).toLowerCase(),
    },
    provenance: provenance && recipients.length && RELATION_KINDS.includes(relationKind)
      ? { relationKind, recipients }
      : null,
  };
}

function identityTuple(node) {
  // Must stay byte-identical to the client tuple in clinic-assessment.js
  // (sourceIdentityFields). A mismatch only ever yields "unverified".
  return [
    node.assignmentId,
    node.classId,
    node.examTitle,
    node.examDate,
    node.questionCount,
    node.archiveFile,
    node.savedPaperId,
  ];
}

async function loadSourceEvidence(env, { studentId, assignmentIds }) {
  const ids = unique(assignmentIds).filter(id => ASSIGNMENT_ID.test(id));
  const evidence = new Map();
  if (!ids.length) return evidence;
  const placeholders = ids.map(() => '?').join(',');

  const assignmentColumns = await tableColumns(env, 'class_exam_assignments');
  if (!assignmentColumns.size) throw new Error('ASSIGNMENT_TABLE_UNAVAILABLE');
  const select = ['id', 'class_id', 'exam_title', 'exam_date', 'question_count', 'archive_file'];
  if (assignmentColumns.has('saved_paper_id')) select.push('saved_paper_id');
  if (assignmentColumns.has('cancelled_at')) select.push('cancelled_at');
  let assignmentRows = [];
  try {
    const res = await env.DB.prepare(
      `SELECT ${select.join(',')} FROM class_exam_assignments WHERE id IN (${placeholders})`,
    ).bind(...ids).all();
    assignmentRows = res.results || [];
  } catch {
    throw new Error('ASSIGNMENT_QUERY_FAILED');
  }

  // Recipient authorization: the student must still be a recipient snapshot of
  // the source assignment. Without this the relation is never shown as verified.
  let recipientSet = new Set();
  try {
    const recipientProbe = await probeColumns(env, 'class_exam_assignment_recipients');
    if (recipientProbe.state === 'error') {
      // Fail closed: unread recipient evidence is never class-membership proof.
      throw new Error('RECIPIENT_TABLE_UNAVAILABLE');
    }
    if (recipientProbe.state === 'present') {
      const { columns } = recipientProbe;
      if (!columns.has('assignment_id') || !columns.has('student_id')) {
        // A present table without the expected columns cannot authorize this
        // read; the legacy fallback is reserved for a positively absent table.
        throw new Error('RECIPIENT_SHAPE_UNSUPPORTED');
      }
      const res = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_recipients
         WHERE student_id = ? AND assignment_id IN (${placeholders})`,
      ).bind(studentId, ...ids).all();
      recipientSet = new Set((res.results || []).map(row => text(row.assignment_id)).filter(Boolean));
    } else {
      // Legacy tables: recipient snapshot genuinely absent.
      const res = await env.DB.prepare(
        `SELECT cea.id FROM class_exam_assignments cea
         JOIN class_students cs ON cs.class_id = cea.class_id AND cs.student_id = ?
         WHERE cea.id IN (${placeholders})`,
      ).bind(studentId, ...ids).all();
      recipientSet = new Set((res.results || []).map(row => text(row.id)).filter(Boolean));
    }
  } catch {
    throw new Error('RECIPIENT_QUERY_FAILED');
  }

  // When the source assignment was issued from an immutable Saved Paper, the
  // frozen saved paper row is re-checked too. A deleted/missing/mismatched
  // source paper is reported as unverified instead of silently trusted.
  const savedPaperIds = unique(assignmentRows.map(row => text(row.saved_paper_id)));
  const savedPapers = new Map();
  let savedPaperState = savedPaperIds.length ? 'ok' : 'not_applicable';
  if (savedPaperIds.length) {
    const savedPaperColumns = await tableColumns(env, 'archive_saved_papers');
    if (!savedPaperColumns.size) {
      savedPaperState = 'unavailable';
    } else {
      const savedSelect = ['id', 'question_count'];
      if (savedPaperColumns.has('deleted_at')) savedSelect.push('deleted_at');
      try {
        const res = await env.DB.prepare(
          `SELECT ${savedSelect.join(',')} FROM archive_saved_papers
           WHERE id IN (${savedPaperIds.map(() => '?').join(',')})`,
        ).bind(...savedPaperIds).all();
        for (const row of res.results || []) {
          savedPapers.set(text(row.id), {
            id: text(row.id),
            questionCount: Number(row.question_count || 0),
            deleted: Boolean(text(row.deleted_at)),
          });
        }
      } catch {
        savedPaperState = 'unavailable';
      }
    }
  }

  let excludedSet = new Set();
  const exclusionProbe = await probeColumns(env, 'class_exam_assignment_exclusions');
  if (exclusionProbe.state === 'error') {
    // An unread exclusion table must not silently authorize a source.
    throw new Error('EXCLUSION_TABLE_UNAVAILABLE');
  }
  if (exclusionProbe.state === 'present') {
    if (!exclusionProbe.columns.has('assignment_id') || !exclusionProbe.columns.has('student_id')) {
      throw new Error('EXCLUSION_SHAPE_UNSUPPORTED');
    }
    try {
      const res = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_exclusions
         WHERE student_id = ? AND assignment_id IN (${placeholders})`,
      ).bind(studentId, ...ids).all();
      excludedSet = new Set((res.results || []).map(row => text(row.assignment_id)).filter(Boolean));
    } catch {
      throw new Error('EXCLUSION_QUERY_FAILED');
    }
  }

  let sessionState = 'unavailable';
  const sessionById = new Map();
  const latestByAssignment = new Map();
  const sessionColumns = await tableColumns(env, 'exam_sessions');
  if (sessionColumns.size && sessionColumns.has('assignment_id')) {
    const sessionSelect = ['id', 'student_id', 'assignment_id', 'exam_date', 'score', 'question_count'];
    if (sessionColumns.has('is_submitted')) sessionSelect.push('is_submitted');
    if (sessionColumns.has('updated_at')) sessionSelect.push('updated_at');
    if (sessionColumns.has('created_at')) sessionSelect.push('created_at');
    const orderSql = sessionColumns.has('updated_at')
      ? 'ORDER BY updated_at DESC, exam_date DESC'
      : 'ORDER BY exam_date DESC';
    try {
      const res = await env.DB.prepare(
        `SELECT ${sessionSelect.join(',')} FROM exam_sessions
         WHERE student_id = ? AND assignment_id IN (${placeholders}) ${orderSql}`,
      ).bind(studentId, ...ids).all();
      for (const row of res.results || []) {
        const sessionId = text(row.id);
        if (!sessionId) continue;
        if (!sessionById.has(sessionId)) sessionById.set(sessionId, row);
        const assignmentId = text(row.assignment_id);
        if (assignmentId && !latestByAssignment.has(assignmentId)) latestByAssignment.set(assignmentId, row);
      }
      sessionState = 'ok';
    } catch {
      sessionState = 'unavailable';
    }
  }

  for (const row of assignmentRows) {
    const assignmentId = text(row.id);
    if (!assignmentId) continue;
    evidence.set(assignmentId, {
      assignmentId,
      classId: text(row.class_id),
      examTitle: text(row.exam_title),
      examDate: text(row.exam_date),
      questionCount: Number(row.question_count || 0),
      savedPaperId: text(row.saved_paper_id),
      archiveFile: text(row.archive_file),
      cancelled: Boolean(text(row.cancelled_at)),
      recipient: recipientSet.has(assignmentId),
      excluded: excludedSet.has(assignmentId),
      latestSession: latestByAssignment.get(assignmentId) || null,
      sessionById,
      sessionState,
      savedPaper: savedPapers.get(text(row.saved_paper_id)) || null,
      savedPaperState,
    });
  }
  return evidence;
}

function submissionStatusOf(session) {
  const raw = session?.is_submitted;
  const value = text(raw).toLowerCase();
  if (value === 'true' || value === '1') return 'submitted';
  if (value === 'false' || value === '0') return 'unsubmitted';
  return 'not_reported';
}

function attemptOf(session) {
  if (!session) return null;
  const score = session.score === null || session.score === undefined || text(session.score) === ''
    ? null : Number(session.score);
  return {
    sessionId: text(session.id),
    examDate: text(session.exam_date),
    submittedAt: text(session.updated_at || session.created_at),
    score: Number.isFinite(score) ? score : null,
    scoreAvailable: Number.isFinite(score),
    submissionStatus: submissionStatusOf(session),
  };
}

// Public shape stays deliberately small: exact existing assignment ID, the
// frozen title/date the student already sees, availability and attempt state.
// Saved-paper IDs, identity digests, target type keys and plan payloads are
// never returned.
function baseLineage(relation) {
  return {
    contractVersion: CLINIC_LINEAGE_CONTRACT,
    relation: relation.relationKind === 'same_uid' ? 'follow_up_same_uid'
      : relation.relationKind === 'similar_uid' ? 'follow_up_similar_uid' : 'ordinary_transfer',
    mode: relation.relationKind,
    status: 'unverified',
    reason: '',
    source: null,
    sourceAttempt: null,
    sourceAttemptState: 'unavailable',
    // The teacher screen asserted the source; the server never treats the
    // client-side result digest as proof of a recorded result.
    signatureAuthority: 'client_asserted',
    derivedAssignments: [],
  };
}

/**
 * Fail-closed placeholder used only when the lineage read itself throws.
 * Rows that really carry a clinic marker must never look like "no relation".
 */
export function unavailableClinicLineage(assignments, reason = 'LINEAGE_READ_FAILED') {
  const byAssignmentId = new Map();
  const rows = Array.isArray(assignments) ? assignments : [];
  for (const row of rows) {
    const assignmentId = text(row?.assignment_id || row?.id);
    if (!assignmentId || !mayCarryClinicMarker(row?.mixed_payload_json)) continue;
    const parsed = readClinicSourceProvenance(row?.mixed_payload_json);
    if (!parsed.marker) continue;
    byAssignmentId.set(assignmentId, {
      contractVersion: CLINIC_LINEAGE_CONTRACT,
      relation: parsed.marker.kind === 'TRANSFER' ? 'ordinary_transfer' : 'follow_up',
      mode: parsed.marker.recommendationMode,
      status: 'unavailable',
      reason,
      source: null,
      sourceAttempt: null,
      sourceAttemptState: 'unavailable',
      signatureAuthority: 'none',
      derivedAssignments: [],
    });
  }
  return {
    byAssignmentId,
    coverage: {
      contractVersion: CLINIC_LINEAGE_CONTRACT,
      status: byAssignmentId.size ? 'unavailable' : 'none',
      rowsInspected: rows.length,
      relationCount: 0,
      verifiedCount: 0,
      unverifiedCount: 0,
      unknownCount: 0,
      sourceNodeLimit: CLINIC_LINEAGE_MAX_NODES,
      sourceNodeCount: 0,
      reason,
    },
  };
}

/**
 * Builds the per-assignment lineage read model for one authorized student.
 *
 * @param {object} env Worker environment (D1 binding).
 * @param {object} options
 * @param {string} options.studentId Verified student id (token or teacher preview).
 * @param {Array<object>} options.assignments Already authorized, already loaded
 *        assignment rows for this student (max 150).
 * @param {string[]|null} options.allowedClassIds Teacher preview class scope, or
 *        null for the student's own token.
 * @returns {{byAssignmentId: Map<string, object>, coverage: object}}
 */
export async function buildStudentClinicLineage(env, options = {}) {
  const studentId = text(options.studentId);
  const rows = Array.isArray(options.assignments) ? options.assignments : [];
  const allowedClassIds = Array.isArray(options.allowedClassIds)
    ? unique(options.allowedClassIds) : null;
  const coverage = {
    contractVersion: CLINIC_LINEAGE_CONTRACT,
    status: 'none',
    rowsInspected: 0,
    relationCount: 0,
    verifiedCount: 0,
    unverifiedCount: 0,
    unknownCount: 0,
    sourceNodeLimit: CLINIC_LINEAGE_MAX_NODES,
    sourceNodeCount: 0,
    reason: '',
  };
  const byAssignmentId = new Map();
  if (!studentId || !rows.length) return { byAssignmentId, coverage };

  const parsedRows = [];
  for (const row of rows) {
    const assignmentId = text(row?.assignment_id || row?.id);
    if (!assignmentId) continue;
    coverage.rowsInspected += 1;
    if (!mayCarryClinicMarker(row?.mixed_payload_json)) continue;
    const parsed = readClinicSourceProvenance(row?.mixed_payload_json);
    parsedRows.push({ assignmentId, row, marker: parsed.marker, provenance: parsed.provenance });
  }

  const relations = [];
  for (const item of parsedRows) {
    if (!item.marker) continue;
    if (!item.provenance) {
      byAssignmentId.set(item.assignmentId, {
        contractVersion: CLINIC_LINEAGE_CONTRACT,
        relation: item.marker.kind === 'TRANSFER' ? 'ordinary_transfer' : 'follow_up',
        mode: item.marker.recommendationMode,
        status: 'unknown',
        reason: 'SOURCE_PROVENANCE_ABSENT',
        source: null,
        sourceAttempt: null,
        sourceAttemptState: 'unknown',
        signatureAuthority: 'none',
        derivedAssignments: [],
      });
      coverage.unknownCount += 1;
      continue;
    }
    // Cohort/multi-paper follow-ups carry one entry per recipient; only this
    // student's own entry is ever used. If the stored relation does not name
    // this recipient, the relation is unknown for this student - it is never
    // inferred from titles, UIDs or the paper itself.
    const entry = item.provenance.recipients.find(candidate => candidate.studentId === studentId);
    if (!entry) {
      byAssignmentId.set(item.assignmentId, {
        contractVersion: CLINIC_LINEAGE_CONTRACT,
        relation: item.marker.kind === 'TRANSFER' ? 'ordinary_transfer' : 'follow_up',
        mode: item.marker.recommendationMode,
        status: 'unknown',
        reason: 'SOURCE_RECIPIENT_NOT_LISTED',
        source: null,
        sourceAttempt: null,
        sourceAttemptState: 'unknown',
        signatureAuthority: 'none',
        derivedAssignments: [],
      });
      coverage.unknownCount += 1;
      continue;
    }
    relations.push({
      assignmentId: item.assignmentId,
      row: item.row,
      entry,
      relationKind: item.provenance.relationKind,
    });
  }
  coverage.relationCount = relations.length;

  const rowByAssignment = new Map();
  for (const relation of relations) rowByAssignment.set(relation.assignmentId, relation.row);

  if (!relations.length) {
    coverage.status = coverage.unknownCount ? 'unknown' : 'none';
    return { byAssignmentId, coverage };
  }

  const orderedSourceIds = unique(relations.map(relation => relation.entry.sourceAssignmentId));
  const cappedSourceIds = orderedSourceIds.slice(0, CLINIC_LINEAGE_MAX_NODES);
  const overflow = new Set(orderedSourceIds.slice(CLINIC_LINEAGE_MAX_NODES));
  coverage.sourceNodeCount = cappedSourceIds.length;

  let evidence;
  try {
    evidence = await loadSourceEvidence(env, { studentId, assignmentIds: cappedSourceIds });
  } catch (error) {
    coverage.status = 'unavailable';
    coverage.reason = text(error?.message) || 'SOURCE_EVIDENCE_UNAVAILABLE';
    for (const relation of relations) {
      const lineage = baseLineage(relation);
      lineage.status = 'unavailable';
      lineage.reason = coverage.reason;
      byAssignmentId.set(relation.assignmentId, lineage);
    }
    return { byAssignmentId, coverage };
  }

  for (const relation of relations) {
    const entry = relation.entry;
    const lineage = baseLineage(relation);
    if (overflow.has(entry.sourceAssignmentId)) {
      lineage.reason = 'SOURCE_NODE_LIMIT_EXCEEDED';
      coverage.unverifiedCount += 1;
      byAssignmentId.set(relation.assignmentId, lineage);
      continue;
    }
    const node = evidence.get(entry.sourceAssignmentId);
    if (!node) {
      lineage.reason = 'SOURCE_ASSIGNMENT_NOT_FOUND';
      coverage.unverifiedCount += 1;
      byAssignmentId.set(relation.assignmentId, lineage);
      continue;
    }
    if (!node.recipient) {
      lineage.reason = 'SOURCE_RECIPIENT_NOT_CONFIRMED';
      coverage.unverifiedCount += 1;
      byAssignmentId.set(relation.assignmentId, lineage);
      continue;
    }
    if (allowedClassIds !== null && !allowedClassIds.includes(node.classId)) {
      lineage.reason = 'SOURCE_CLASS_OUT_OF_SCOPE';
      coverage.unverifiedCount += 1;
      byAssignmentId.set(relation.assignmentId, lineage);
      continue;
    }
    if (entry.sourceSavedPaperId) {
      const savedPaperReason = node.savedPaperState === 'unavailable'
        ? 'SOURCE_SAVED_PAPER_UNAVAILABLE'
        : !node.savedPaper
          ? 'SOURCE_SAVED_PAPER_MISSING'
          : node.savedPaper.deleted
            ? 'SOURCE_SAVED_PAPER_DELETED'
            : Number(node.savedPaper.questionCount) !== Number(node.questionCount)
              ? 'SOURCE_SAVED_PAPER_MISMATCH'
              : '';
      if (savedPaperReason) {
        lineage.reason = savedPaperReason;
        coverage.unverifiedCount += 1;
        byAssignmentId.set(relation.assignmentId, lineage);
        continue;
      }
    }
    // Authoritative comparison uses stored rows; the client hash is only a
    // secondary consistency check, never the proof itself.
    const serverIdentityHash = await sha256hex(JSON.stringify(identityTuple(node)));
    const claimedHash = text(entry.sourceIdentityHash).toLowerCase();
    const identityVerified = (!claimedHash || claimedHash === serverIdentityHash) &&
      entry.classId === node.classId &&
      entry.sourceExamTitle === node.examTitle &&
      entry.sourceExamDate === node.examDate &&
      Number(entry.sourceQuestionCount) === Number(node.questionCount) &&
      entry.sourceArchiveFile === node.archiveFile &&
      entry.sourceSavedPaperId === node.savedPaperId;
    if (!identityVerified) {
      lineage.reason = 'SOURCE_IDENTITY_MISMATCH';
      coverage.unverifiedCount += 1;
      byAssignmentId.set(relation.assignmentId, lineage);
      continue;
    }

    let session = node.latestSession;
    if (entry.sourceSessionId) {
      const claimed = node.sessionState === 'ok' ? node.sessionById.get(entry.sourceSessionId) : null;
      if (!claimed) {
        lineage.reason = node.sessionState === 'ok'
          ? 'SOURCE_SESSION_MISMATCH' : 'SOURCE_SESSION_UNAVAILABLE';
        lineage.sourceAttemptState = node.sessionState === 'ok' ? 'no_attempt' : 'unavailable';
        coverage.unverifiedCount += 1;
        byAssignmentId.set(relation.assignmentId, lineage);
        continue;
      }
      session = claimed;
    }

    lineage.status = 'verified';
    lineage.reason = '';
    lineage.source = {
      assignmentId: node.assignmentId,
      examTitle: node.examTitle,
      examDate: node.examDate,
      questionCount: node.questionCount,
      availability: node.cancelled ? 'cancelled' : node.excluded ? 'excluded' : 'open',
      identityVerified: true,
    };
    lineage.sourceAttempt = attemptOf(session);
    lineage.sourceAttemptState = node.sessionState !== 'ok'
      ? 'unavailable'
      : session ? 'recorded' : 'no_attempt';
    coverage.verifiedCount += 1;
    byAssignmentId.set(relation.assignmentId, lineage);
  }

  coverage.status = coverage.unverifiedCount || coverage.unknownCount ? 'partial' : 'complete';
  // Reverse edges are derived only from relations that actually verified, so a
  // source card never claims an unverified child and an unverified follow-up
  // never advertises a parent it could not prove.
  const derivedBySource = new Map();
  for (const [assignmentId, lineage] of byAssignmentId) {
    const sourceId = lineage.status === 'verified' ? text(lineage.source?.assignmentId) : '';
    if (!sourceId) continue;
    const row = rowByAssignment.get(assignmentId);
    const list = derivedBySource.get(sourceId) || [];
    list.push({
      assignmentId,
      examTitle: text(row?.exam_title).slice(0, MAX_TITLE),
      examDate: text(row?.exam_date),
      mode: lineage.mode,
    });
    derivedBySource.set(sourceId, list);
  }
  for (const [assignmentId, lineage] of byAssignmentId) {
    // Only a row that is itself the proven source of a verified follow-up gets
    // the reverse list. A child row never advertises its siblings as its own.
    const own = derivedBySource.get(assignmentId) || [];
    if (own.length) lineage.derivedAssignments = own;
  }
  // A source assessment the student also received gets the reverse list too.
  // Entries for rows outside this response are never exposed by the route.
  for (const [assignmentId, derived] of derivedBySource) {
    if (!derived.length) continue;
    const existing = byAssignmentId.get(assignmentId);
    if (existing) {
      // Only rows that are not themselves a verified child of another source.
      if (!existing.source && !existing.derivedAssignments.length) {
        existing.derivedAssignments = derived.slice(0, CLINIC_LINEAGE_MAX_NODES);
      }
      continue;
    }
    byAssignmentId.set(assignmentId, {
      contractVersion: CLINIC_LINEAGE_CONTRACT,
      relation: 'source_of_follow_up',
      mode: '',
      status: 'verified',
      reason: '',
      source: null,
      sourceAttempt: null,
      sourceAttemptState: 'not_applicable',
      signatureAuthority: 'none',
      derivedAssignments: derived.slice(0, CLINIC_LINEAGE_MAX_NODES),
    });
  }
  return { byAssignmentId, coverage };
}
