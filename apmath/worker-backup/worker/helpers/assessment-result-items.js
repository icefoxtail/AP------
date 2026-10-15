import { sha256hex } from './admin-db.js';

const RESULT_ITEM_COLUMNS = [
  'session_id', 'assignment_id', 'pack_id', 'student_id', 'class_id', 'order_no', 'question_no',
  'result_status', 'is_correct', 'student_answer', 'correct_answer', 'score', 'max_score',
  'source_archive_file', 'source_question_no', 'source_question_ordinal', 'source_question_uid',
  'source_fingerprint', 'source_identity_status', 'metadata_revision', 'metadata_hash', 'metadata_json',
  'metadata_snapshot_status', 'standard_unit_key', 'standard_unit', 'concept_cluster_key', 'type_key',
  'difficulty', 'analysis_note'
];

const RESULT_SNAPSHOT_COLUMNS = new Set([
  'source_archive_file', 'source_question_no', 'source_question_ordinal', 'source_question_uid',
  'source_fingerprint', 'source_identity_status', 'metadata_revision', 'metadata_hash', 'metadata_json',
  'metadata_snapshot_status', 'standard_unit_key', 'standard_unit', 'concept_cluster_key', 'type_key',
  'difficulty'
]);

const columnCacheByEnv = new WeakMap();

async function getTableColumnSet(env, tableName) {
  let cache = columnCacheByEnv.get(env);
  if (!cache) {
    cache = new Map();
    columnCacheByEnv.set(env, cache);
  }
  if (cache.has(tableName)) return cache.get(tableName);
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) return new Set();
  try {
    const result = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
    const columns = new Set((result.results || []).map(row => row.name).filter(Boolean));
    cache.set(tableName, columns);
    return columns;
  } catch (error) {
    console.warn('[assessment-result-items] column check failed:', tableName, error);
    const columns = new Set();
    cache.set(tableName, columns);
    return columns;
  }
}

function normalizeIdentityStatus(value) {
  const status = String(value || '').trim().toUpperCase();
  return ['VERIFIED', 'LEGACY_INFERRED', 'UNRESOLVED'].includes(status) ? status : 'UNRESOLVED';
}

function readMetadataJson(value) {
  if (!value) return {};
  try {
    const parsed = JSON.parse(String(value));
    return parsed?.archiveMetadata && typeof parsed.archiveMetadata === 'object'
      ? parsed.archiveMetadata
      : parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function readMetadataSnapshotScope(value) {
  if (!value) return '';
  try {
    const parsed = JSON.parse(String(value));
    return String(parsed?.snapshotScope || '').trim().toUpperCase();
  } catch {
    return '';
  }
}

function normalizeSourceFileForUid(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\\/g, '/')
    .replace(/^\.?\/?archive\/exams\//, '')
    .replace(/^\.?\/?exams\//, '')
    .replace(/^\/+/, '')
    .replace(/[?#].*$/, '')
    .trim();
}

async function snapshotForOrder(bridgeByOrder, orderNo) {
  const bridge = bridgeByOrder.get(orderNo);
  if (!bridge) {
    return {
      source_archive_file: null,
      source_question_no: null,
      source_question_ordinal: null,
      source_question_uid: null,
      source_fingerprint: null,
      source_identity_status: 'UNRESOLVED',
      metadata_revision: null,
      metadata_hash: null,
      metadata_json: null,
      metadata_snapshot_status: 'UNRESOLVED',
      standard_unit_key: null,
      standard_unit: null,
      concept_cluster_key: null,
      type_key: null,
      difficulty: null
    };
  }

  const metadataRevision = String(bridge.metadata_revision || '').trim() || null;
  const metadataHash = String(bridge.metadata_hash || '').trim() || null;
  const metadataJson = String(bridge.metadata_json || '').trim() || null;
  const metadata = readMetadataJson(metadataJson);
  const metadataSnapshotStatus = readMetadataSnapshotScope(metadataJson) === 'BLUEPRINT_FIELDS_ONLY'
    ? 'PARTIAL'
    : (metadataRevision && metadataHash && metadataJson
      ? 'CAPTURED'
      : (metadataRevision || metadataHash || metadataJson ? 'PARTIAL' : 'UNRESOLVED'));
  let sourceIdentityStatus = normalizeIdentityStatus(bridge.resolution_status);
  const sourceArchiveFile = String(bridge.source_archive_file || '').trim() || null;
  const normalizedSourceArchiveFile = normalizeSourceFileForUid(sourceArchiveFile);
  const sourceQuestionOrdinal = Number(bridge.source_question_ordinal) > 0 ? Number(bridge.source_question_ordinal) : null;
  const sourceQuestionUid = String(bridge.question_uid || '').trim();
  if (sourceIdentityStatus === 'UNRESOLVED' || !normalizedSourceArchiveFile || !sourceQuestionOrdinal || !/^qid_v1_[a-f0-9]{64}$/.test(sourceQuestionUid)) {
    sourceIdentityStatus = 'UNRESOLVED';
  } else {
    const expectedUid = `qid_v1_${await sha256hex(`${normalizedSourceArchiveFile}#${sourceQuestionOrdinal}`)}`;
    if (expectedUid !== sourceQuestionUid) sourceIdentityStatus = 'UNRESOLVED';
  }
  return {
    source_archive_file: sourceArchiveFile || null,
    source_question_no: bridge.source_question_no || null,
    source_question_ordinal: sourceQuestionOrdinal,
    source_question_uid: sourceIdentityStatus === 'UNRESOLVED' ? null : sourceQuestionUid,
    source_fingerprint: bridge.source_fingerprint || null,
    source_identity_status: sourceIdentityStatus,
    metadata_revision: metadataRevision,
    metadata_hash: metadataHash,
    metadata_json: metadataJson,
    metadata_snapshot_status: metadataSnapshotStatus,
    standard_unit_key: bridge.standard_unit_key || metadata.standardUnitKey || metadata.standard_unit_key || null,
    standard_unit: metadata.standardUnit || metadata.standard_unit || null,
    concept_cluster_key: metadata.conceptClusterKey || metadata.concept_cluster_key || null,
    type_key: metadata.typeKey || metadata.problemTypeKey || metadata.type_key || null,
    difficulty: bridge.difficulty_at_assignment || metadata.difficulty || metadata.difficultyBucket || null
  };
}

async function loadFrozenAssignmentQuestions(env, assignmentId) {
  const assignmentIdText = String(assignmentId || '').trim();
  if (!assignmentIdText) return new Map();
  const columns = await getTableColumnSet(env, 'class_exam_assignment_questions');
  if (!columns.has('assignment_id') || !columns.has('order_no')) return new Map();
  try {
    const result = await env.DB.prepare(`
      SELECT *
      FROM class_exam_assignment_questions
      WHERE assignment_id = ?
      ORDER BY order_no
    `).bind(assignmentIdText).all();
    return new Map((result.results || []).map(row => [Number(row.order_no), row]).filter(([orderNo]) => orderNo > 0));
  } catch (error) {
    console.warn('[assessment-result-items] assignment snapshot lookup failed:', assignmentIdText, error);
    return new Map();
  }
}

// Store result-order rows against the frozen assignment bridge. A missing/legacy
// bridge remains nullable and unresolved; current blueprints are never used to
// backfill a historical assignment or re-write an existing result snapshot.
export async function saveAssessmentResultItems(env, input = {}) {
  const questionCount = Math.max(0, Math.min(100, parseInt(input.question_count, 10) || 0));
  if (!questionCount) return { skipped: true, reason: 'question_count_empty' };

  const resultColumns = await getTableColumnSet(env, 'assessment_result_items');
  if (!resultColumns.has('session_id') || !resultColumns.has('order_no')) {
    return { skipped: true, reason: 'assessment_result_items_unavailable' };
  }

  const assignmentId = String(input.assignment_id || '').trim();
  const bridgeByOrder = await loadFrozenAssignmentQuestions(env, assignmentId);
  const wrongIds = new Set((Array.isArray(input.wrong_ids) ? input.wrong_ids : [])
    .map(value => Number(value)).filter(value => Number.isInteger(value) && value > 0 && value <= questionCount));
  const columns = RESULT_ITEM_COLUMNS.filter(column => resultColumns.has(column));
  const hasCreatedAt = resultColumns.has('created_at');
  const hasUpdatedAt = resultColumns.has('updated_at');
  const statements = [];

  for (let orderNo = 1; orderNo <= questionCount; orderNo++) {
    const snapshot = await snapshotForOrder(bridgeByOrder, orderNo);
    const isWrong = wrongIds.has(orderNo);
    const item = {
      session_id: input.session_id,
      assignment_id: assignmentId || null,
      pack_id: input.pack_id || null,
      student_id: input.student_id || null,
      class_id: input.class_id || null,
      order_no: orderNo,
      question_no: orderNo,
      result_status: isWrong ? 'wrong' : 'correct',
      is_correct: isWrong ? 0 : 1,
      student_answer: null,
      correct_answer: null,
      score: null,
      max_score: null,
      ...snapshot,
      analysis_note: null
    };
    const values = columns.map(column => item[column]);
    const updates = columns
      .filter(column => !['session_id', 'order_no'].includes(column) && !RESULT_SNAPSHOT_COLUMNS.has(column))
      .map(column => column === 'pack_id'
        ? 'pack_id = COALESCE(excluded.pack_id, assessment_result_items.pack_id)'
        : `${column} = excluded.${column}`);
    if (hasUpdatedAt) updates.push('updated_at = CURRENT_TIMESTAMP');
    const timestampColumns = [hasCreatedAt ? 'created_at' : null, hasUpdatedAt ? 'updated_at' : null].filter(Boolean);
    const timestampValues = timestampColumns.map(() => 'CURRENT_TIMESTAMP');
    const insertColumns = [...columns, ...timestampColumns];
    const insertValues = [...values, ...timestampValues];
    const conflictAction = updates.length
      ? `DO UPDATE SET ${updates.join(',\n        ')}`
      : 'DO NOTHING';
    statements.push(env.DB.prepare(`
      INSERT INTO assessment_result_items (${insertColumns.join(', ')})
      VALUES (${insertValues.map(value => value === 'CURRENT_TIMESTAMP' ? value : '?').join(', ')})
      ON CONFLICT(session_id, order_no) ${conflictAction}
    `).bind(...values));
  }

  if (statements.length) await env.DB.batch(statements);
  return { saved: statements.length };
}

export async function loadAssessmentResultItemSnapshots(env, sessionIds = []) {
  const ids = Array.from(new Set((sessionIds || []).map(value => String(value || '').trim()).filter(Boolean)));
  if (!ids.length) return [];
  const columns = await getTableColumnSet(env, 'assessment_result_items');
  const selected = [
    'session_id', 'assignment_id', 'order_no', 'question_no', 'source_archive_file',
    'source_question_no', 'source_question_ordinal', 'source_question_uid', 'source_fingerprint',
    'source_identity_status', 'metadata_revision', 'metadata_hash', 'metadata_json',
    'metadata_snapshot_status', 'standard_unit_key', 'standard_unit', 'concept_cluster_key',
    'type_key', 'difficulty'
  ].filter(column => columns.has(column));
  if (!columns.has('session_id') || !columns.has('order_no')) return [];

  const rows = [];
  for (let offset = 0; offset < ids.length; offset += 80) {
    const part = ids.slice(offset, offset + 80);
    const result = await env.DB.prepare(`
      SELECT ${selected.join(', ')}
      FROM assessment_result_items
      WHERE session_id IN (${part.map(() => '?').join(',')})
      ORDER BY session_id, order_no
    `).bind(...part).all();
    rows.push(...(result.results || []));
  }
  return rows;
}

export async function loadAssignmentQuestionSnapshots(env, assignmentIds = []) {
  const ids = Array.from(new Set((assignmentIds || []).map(value => String(value || '').trim()).filter(Boolean)));
  if (!ids.length) return [];
  const columns = await getTableColumnSet(env, 'class_exam_assignment_questions');
  const selected = [
    'assignment_id', 'order_no', 'question_uid', 'source_archive_file', 'source_question_no',
    'source_question_ordinal', 'source_fingerprint', 'standard_unit_key', 'difficulty_at_assignment',
    'metadata_revision', 'metadata_hash', 'metadata_json', 'resolution_status'
  ].filter(column => columns.has(column));
  if (!columns.has('assignment_id') || !columns.has('order_no')) return [];

  const rows = [];
  for (let offset = 0; offset < ids.length; offset += 80) {
    const part = ids.slice(offset, offset + 80);
    const result = await env.DB.prepare(`
      SELECT ${selected.join(', ')}
      FROM class_exam_assignment_questions
      WHERE assignment_id IN (${part.map(() => '?').join(',')})
      ORDER BY assignment_id, order_no
    `).bind(...part).all();
    rows.push(...(result.results || []));
  }
  return rows;
}
