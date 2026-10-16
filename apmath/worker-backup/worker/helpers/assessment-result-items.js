import { sha256hex } from './admin-db.js';
import {
  buildBlueprintMetadataSnapshot,
  loadBlueprintCanonicalMetadata,
  loadBlueprintSourceVerification,
} from './archive2-questions.js';

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
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
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
  const metadataSnapshot = readMetadataJson(metadataJson);
  const hasBlueprintEnvelope = metadataSnapshot.schemaVersion === 'apms-blueprint-meta-snapshot-v1';
  const metadata = metadataSnapshot.archiveMetadata && typeof metadataSnapshot.archiveMetadata === 'object'
    ? metadataSnapshot.archiveMetadata
    : hasBlueprintEnvelope ? {} : metadataSnapshot;
  const metadataSnapshotScope = readMetadataSnapshotScope(metadataJson);
  const authoredFidelity = String(metadataSnapshot.authoredFidelity || '').trim().toUpperCase();
  const capturedSnapshot = Boolean(metadataJson && metadataSnapshot.snapshotHash &&
    metadataSnapshot.schemaVersion === 'apms-blueprint-meta-snapshot-v1');
  const metadataSnapshotStatus = metadataSnapshotScope === 'BLUEPRINT_FIELDS_ONLY' ||
      authoredFidelity === 'UNKNOWN' || metadataSnapshot.captureStatus === 'PARTIAL'
    ? 'PARTIAL'
    : (capturedSnapshot || (metadataRevision && metadataHash && metadataJson)
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
    standard_unit_key: bridge.standard_unit_key || metadata.standardUnitKey || metadata.standard_unit_key || metadataSnapshot.standard_unit_key || null,
    standard_unit: metadata.standardUnit || metadata.standard_unit || metadataSnapshot.standard_unit || null,
    concept_cluster_key: metadata.conceptClusterKey || metadata.concept_cluster_key || metadataSnapshot.concept_cluster_key || null,
    type_key: metadata.typeKey || metadata.problemTypeKey || metadata.type_key || metadataSnapshot.type_key || null,
    difficulty: bridge.difficulty_at_assignment || metadata.difficulty ||
      (!hasBlueprintEnvelope ? metadata.difficultyBucket : null) || null
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

function normalizedBlueprintArchiveFile(value) {
  return String(value || '')
    .normalize('NFC')
    .replace(/\\/g, '/')
    .replace(/^archive\//, '')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .trim();
}

async function loadNewUnassignedBlueprintSnapshots(env, input, questionCount) {
  const archiveFile = normalizedBlueprintArchiveFile(input.archive_file);
  if (!archiveFile) return new Map();
  const blueprintColumns = await getTableColumnSet(env, 'exam_blueprints');
  if (!blueprintColumns.has('archive_file') || !blueprintColumns.has('question_no')) return new Map();
  let rows = [];
  try {
    const result = await env.DB.prepare(`
      SELECT * FROM exam_blueprints WHERE archive_file = ?
      ORDER BY CAST(question_no AS INTEGER), question_no
    `).bind(archiveFile).all();
    rows = result.results || [];
  } catch (error) {
    console.warn('[assessment-result-items] new-session blueprint lookup failed:', archiveFile, error);
    return new Map();
  }
  const mixed = archiveFile.startsWith('MIXED:');
  let directSourceRecords = new Map();
  let directSourceProjectionVersion = null;
  if (!rows.length && !mixed) {
    try {
      const sourceBundle = await loadBlueprintSourceVerification(env, archiveFile);
      if (!sourceBundle.legacyManifest &&
          Number(sourceBundle.shard?.exam?.qCount) === questionCount &&
          Array.isArray(sourceBundle.shard?.records) &&
          sourceBundle.shard.records.length === questionCount) {
        directSourceProjectionVersion = sourceBundle.projectionVersion || null;
        directSourceRecords = new Map(sourceBundle.shard.records
          .map(record => [Number(record.sourceOrdinal), record]));
        rows = sourceBundle.shard.records.map((record, index) => ({
          question_no: index + 1,
          source_archive_file: archiveFile,
          source_question_no: record.sourceQuestionNo ?? null,
          source_question_uid: record.identityStatus === 'VERIFIED' ? record.questionUid : null,
          source_question_ordinal: record.sourceOrdinal,
          source_fingerprint: record.sourceFingerprint || null,
          metadata_json: null,
        }));
      }
    } catch (error) {
      console.warn('[assessment-result-items] direct source snapshot unavailable:', error?.message || error);
    }
  }
  if (!rows.length) return new Map();

  const ordinalAvailable = !mixed && rows.some(row => Number(row.source_question_ordinal) > 0);
  const sequentialDisplayOrder = !mixed && !ordinalAvailable && rows.length === questionCount &&
    rows.every((row, index) => Number(row.question_no) === index + 1);
  const byOrder = new Map();
  const ambiguous = new Set();
  for (const row of rows) {
    const orderNo = mixed || sequentialDisplayOrder
      ? Number(row.question_no)
      : ordinalAvailable
        ? Number(row.source_question_ordinal)
        : 0;
    if (!(orderNo > 0) || orderNo > questionCount) continue;
    if (byOrder.has(orderNo)) ambiguous.add(orderNo);
    else byOrder.set(orderNo, row);
  }
  for (const orderNo of ambiguous) byOrder.delete(orderNo);

  if (!mixed && byOrder.size < questionCount) {
    try {
      const sourceBundle = await loadBlueprintSourceVerification(env, archiveFile);
      if (!sourceBundle.legacyManifest &&
          Number(sourceBundle.shard?.exam?.qCount) === questionCount &&
          Array.isArray(sourceBundle.shard?.records) &&
          sourceBundle.shard.records.length === questionCount) {
        directSourceProjectionVersion = sourceBundle.projectionVersion || null;
        for (const record of sourceBundle.shard.records) {
          const orderNo = Number(record.sourceOrdinal);
          if (!(orderNo > 0) || orderNo > questionCount || byOrder.has(orderNo) || ambiguous.has(orderNo)) continue;
          const row = {
            question_no: orderNo,
            source_archive_file: archiveFile,
            source_question_no: record.sourceQuestionNo ?? null,
            source_question_uid: record.identityStatus === 'VERIFIED' ? record.questionUid : null,
            source_question_ordinal: record.sourceOrdinal,
            source_fingerprint: record.sourceFingerprint || null,
            metadata_json: null,
          };
          byOrder.set(orderNo, row);
          directSourceRecords.set(orderNo, record);
        }
      }
    } catch (error) {
      console.warn('[assessment-result-items] missing source-order snapshot unavailable:', error?.message || error);
    }
  }

  const metadataByOrder = new Map([...directSourceRecords.entries()].map(([orderNo, record]) => [
    orderNo,
    { record, projectionVersion: directSourceProjectionVersion, identityStatus: record.identityStatus || 'UNRESOLVED' },
  ]));
  const refs = [];
  for (const [orderNo, row] of byOrder) {
    if (String(row.metadata_json || '').trim()) continue;
    if (directSourceRecords.has(orderNo)) continue;
    refs.push({
      index: orderNo,
      sourceFile: row.source_archive_file || (mixed ? '' : archiveFile),
      sourceQuestionUid: row.source_question_uid,
      sourceOrdinal: row.source_question_ordinal,
      sourceQuestionNo: row.source_question_no,
    });
  }
  if (refs.length) {
    try {
      const loaded = await loadBlueprintCanonicalMetadata(env, refs);
      for (const [orderNo, capture] of loaded) metadataByOrder.set(orderNo, capture);
    } catch (error) {
      console.warn('[assessment-result-items] current source Meta lookup unavailable:', error?.message || error);
    }
  }

  const snapshots = new Map();
  for (const [orderNo, row] of byOrder) {
    const capture = metadataByOrder.get(orderNo) || null;
    const canonicalRecord = capture?.record || null;
    const sourceArchiveFile = String(row.source_archive_file || (mixed ? '' : archiveFile)).trim() || null;
    const normalizedSourceFile = normalizeSourceFileForUid(sourceArchiveFile);
    let sourceQuestionOrdinal = Number(row.source_question_ordinal) > 0
      ? Number(row.source_question_ordinal)
      : null;
    if (!sourceQuestionOrdinal && canonicalRecord &&
        String(row.source_question_no ?? '') === String(canonicalRecord.sourceQuestionNo ?? ''))
      sourceQuestionOrdinal = Number(canonicalRecord.sourceOrdinal) || null;
    const storedUid = String(row.source_question_uid || '').trim();
    let identityStatus = 'UNRESOLVED';
    if (storedUid && normalizedSourceFile && sourceQuestionOrdinal) {
      const expectedUid = `qid_v1_${await sha256hex(`${normalizedSourceFile}#${sourceQuestionOrdinal}`)}`;
      if (expectedUid === storedUid) {
        identityStatus = canonicalRecord?.identityStatus === 'VERIFIED' &&
          String(canonicalRecord.questionUid || '') === storedUid &&
          normalizeSourceFileForUid(canonicalRecord.sourceFile) === normalizedSourceFile &&
          Number(canonicalRecord.sourceOrdinal) === sourceQuestionOrdinal
          ? 'VERIFIED'
          : 'LEGACY_INFERRED';
      }
    }
    const archiveMetadata = directSourceRecords.has(orderNo) ? null : {
      standardUnitKey: row.standard_unit_key ?? null,
      standardUnit: row.standard_unit ?? null,
      standardCourse: row.standard_course ?? null,
      subUnitKey: row.sub_unit_key ?? null,
      conceptClusterKey: row.concept_cluster_key ?? null,
      typeKey: row.type_key ?? null,
      templateKey: row.template_key ?? null,
      difficulty: row.difficulty ?? null,
      tags: [],
      metadataRevision: row.metadata_revision ?? null,
    };
    const existingSnapshot = typeof row.metadata_json === 'string' && row.metadata_json.trim()
      ? row.metadata_json
      : null;
    const metadataJson = existingSnapshot || await buildBlueprintMetadataSnapshot({
      sourceArchiveFile,
      sourceQuestionUid: storedUid || null,
      sourceQuestionOrdinal,
      sourceQuestionNo: row.source_question_no ?? null,
      sourceFingerprint: canonicalRecord?.sourceFingerprint || row.source_fingerprint || null,
    }, null, {
      archiveMetadata,
      canonicalRecord,
      sourceIdentityStatus: identityStatus,
      sourceArchiveFile,
      sourceQuestionUid: storedUid || null,
      sourceQuestionOrdinal,
      sourceQuestionNo: row.source_question_no ?? null,
      sourceFingerprint: canonicalRecord?.sourceFingerprint || row.source_fingerprint || null,
      projectionVersion: capture?.projectionVersion || null,
      captureSource: canonicalRecord ? 'CURRENT_SOURCE_AT_NEW_SESSION' : 'BLUEPRINT_FIELDS_AT_NEW_SESSION',
      archiveMetadataSource: archiveMetadata ? 'EXISTING_BLUEPRINT_ROW' : 'NOT_CAPTURED',
      authoredFidelity: directSourceRecords.has(orderNo) ? 'SOURCE_AT_NEW_SESSION' : 'UNKNOWN',
      captureStatus: directSourceRecords.has(orderNo) ? 'CAPTURED' : 'PARTIAL',
    });
    const bridge = {
      order_no: orderNo,
      question_uid: identityStatus === 'UNRESOLVED' ? null : storedUid,
      source_archive_file: sourceArchiveFile,
      source_question_no: row.source_question_no ?? null,
      source_question_ordinal: sourceQuestionOrdinal,
      source_fingerprint: canonicalRecord?.sourceFingerprint || row.source_fingerprint || null,
      resolution_status: identityStatus,
      metadata_revision: row.metadata_revision ??
        (directSourceRecords.has(orderNo) ? canonicalRecord?.metadataRevision ?? null : null),
      metadata_hash: row.metadata_hash ?? null,
      metadata_json: metadataJson,
      standard_unit_key: row.standard_unit_key ?? null,
      standard_unit: row.standard_unit ?? null,
      concept_cluster_key: row.concept_cluster_key ?? null,
      type_key: row.type_key ?? null,
      difficulty_at_assignment: row.difficulty ?? null,
    };
    snapshots.set(orderNo, bridge);
  }
  return snapshots;
}

// Store result-order rows against the frozen assignment bridge. A missing/legacy
// bridge remains nullable and unresolved; current blueprints are never used to
// backfill a historical assignment or re-write an existing result snapshot.
export async function saveAssessmentResultItems(env, input = {}, internalOptions = {}) {
  const questionCount = Math.max(0, Math.min(100, parseInt(input.question_count, 10) || 0));
  if (!questionCount) return { skipped: true, reason: 'question_count_empty' };

  const resultColumns = await getTableColumnSet(env, 'assessment_result_items');
  if (!resultColumns.has('session_id') || !resultColumns.has('order_no')) {
    return { skipped: true, reason: 'assessment_result_items_unavailable' };
  }

  const assignmentId = String(input.assignment_id || '').trim();
  let bridgeByOrder = new Map();
  if (assignmentId) {
    bridgeByOrder = await loadFrozenAssignmentQuestions(env, assignmentId);
  } else if (input.allowBlueprintSnapshot === true) {
    const cache = internalOptions.blueprintSnapshotCache;
    const cacheKey = JSON.stringify([normalizedBlueprintArchiveFile(input.archive_file), questionCount]);
    if (cache instanceof Map && cache.has(cacheKey)) {
      bridgeByOrder = await cache.get(cacheKey);
    } else {
      const pending = loadNewUnassignedBlueprintSnapshots(env, input, questionCount);
      if (cache instanceof Map) cache.set(cacheKey, pending);
      try {
        bridgeByOrder = await pending;
      } catch (error) {
        if (cache instanceof Map && cache.get(cacheKey) === pending) cache.delete(cacheKey);
        throw error;
      }
    }
  }
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
    'session_id', 'assignment_id', 'order_no', 'question_no', 'result_status', 'is_correct', 'source_archive_file',
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
