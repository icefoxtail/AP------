// Student learning-history observation helper (plan B1 + B2).
//
// Scope: read-only, page-bounded observation summary of ONE already-verified
// student.  This module never authenticates.  Callers must resolve the student
// with the existing student-portal guards
// (verifyStudentPortalReadAccess(env, teacher, studentId, studentToken, options)
//  -> verified.student.id,
//  teacherPreviewAllowedClassIds(env, teacher, verified.accessMode)
//  -> null (admin, unscoped) or string[] (fail-closed when empty))
// and pass those values in.
//
// Everything returned here is "observed" evidence: counts over the rows that
// were actually read for the requested page.  No mastery, recovery, predicted
// score or whole-period claim is derived.
//
// The numeric defaults are implementation cost/latency limits, not education
// policy.

import { sha256hex } from './admin-db.js';

export const STUDENT_LEARNING_HISTORY_VERSION = 'student-learning-history-v1';

export const STUDENT_LEARNING_HISTORY_DEFAULTS = Object.freeze({
  version: STUDENT_LEARNING_HISTORY_VERSION,
  // Preset windows only. An arbitrary caller-supplied width is never accepted.
  periodPresets: Object.freeze({ '30d': 30, '90d': 90, '180d': 180, '365d': 365 }),
  defaultPeriod: '90d',
  maxPeriodDays: 366,
  defaultPageSize: 20,
  maxPageSize: 50,
  // Hard bound on frozen result rows inspected for one page.
  maxItemsAnalyzed: 1500,
  // D1 rejects statements with too many bound parameters. The page query binds
  // one class id each plus 8 fixed parameters, so the scope guard must trip
  // before the driver limit, otherwise a wide scope degrades to 503.
  maxClassScopeIds: 80,
  maxTypeGroups: 20,
  maxEvidencePerType: 3,
  // Academy calendar days ('YYYY-MM-DD') are KST based.
  kstOffsetMinutes: 540,
  cursorVersion: 1,
  filters: Object.freeze(['all', 'wrong', 'unchecked']),
  defaultFilter: 'all'
});

const FILTER_SET = new Set(STUDENT_LEARNING_HISTORY_DEFAULTS.filters);
const PERIOD_SET = new Set(Object.keys(STUDENT_LEARNING_HISTORY_DEFAULTS.periodPresets));
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SQLITE_DATETIME_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
const LOADED_PAGE_LABEL = '현재 불러온 기록 기준';
const UNCLASSIFIED_LABEL = '유형 미분류';

const columnCacheByEnv = new WeakMap();

function text(value) {
  return String(value ?? '').trim();
}

function fail(status, code, message) {
  return { ok: false, status, code, message };
}

// Returns the table's column set, or null when the probe itself failed.
// A failed probe is NEVER cached as an empty set: caching it for the isolate
// lifetime would silently turn every later request into a legacy/zero-row
// answer instead of a visible error.
async function getColumnSet(env, tableName) {
  let cache = columnCacheByEnv.get(env);
  if (!cache) {
    cache = new Map();
    columnCacheByEnv.set(env, cache);
  }
  if (cache.has(tableName)) return cache.get(tableName);
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    const empty = new Set();
    cache.set(tableName, empty);
    return empty;
  }
  try {
    const result = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
    const columns = new Set((result.results || []).map(row => row.name).filter(Boolean));
    cache.set(tableName, columns);
    return columns;
  } catch (error) {
    console.warn('[student-learning-history] column check failed:', tableName, error?.message || error);
    return null;
  }
}

function hasColumns(columnSet, names) {
  return Boolean(columnSet) && names.every(name => columnSet.has(name));
}

function kstDateString(dateMs) {
  const shifted = new Date(dateMs + STUDENT_LEARNING_HISTORY_DEFAULTS.kstOffsetMinutes * 60000);
  return shifted.toISOString().slice(0, 10);
}

function shiftDateString(dateString, days) {
  const base = Date.parse(`${dateString}T00:00:00Z`);
  if (!Number.isFinite(base)) return '';
  return new Date(base + days * 86400000).toISOString().slice(0, 10);
}

export function toSqliteUtcString(dateMs) {
  return new Date(dateMs).toISOString().slice(0, 19).replace('T', ' ');
}

function b64urlEncode(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(token) {
  const normalized = String(token).replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, ch => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function readPositiveInteger(value, fallback, max) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(parsed, max);
}

function normalizeClassScope(allowedClassIds) {
  if (allowedClassIds === null || allowedClassIds === undefined) {
    return { classScoped: false, ids: null, invalid: false };
  }
  if (!Array.isArray(allowedClassIds)) return { classScoped: true, ids: [], invalid: true };
  const ids = Array.from(new Set(allowedClassIds.map(value => text(value)).filter(Boolean))).sort();
  return { classScoped: true, ids, invalid: false };
}

function classScopeKey(classIds) {
  return classIds === null ? '*' : classIds.join(',');
}

async function buildScopeHash(studentId, classIds, period, filter) {
  return sha256hex(`${studentId}\u0000${classScopeKey(classIds)}\u0000${period}\u0000${filter}`);
}

// The cursor is unsigned navigation data, never authorization.  It is bound to
// the verified student/scope/period/filter and its cutoff is clamped to the
// server clock; d/i stay inside the already-scoped, already-windowed query.
function parseCursor(token, expected) {
  if (typeof atob !== 'function' || typeof btoa !== 'function') {
    return {
      error: fail(503, 'CURSOR_CODEC_UNAVAILABLE', '페이지 위치를 확인할 수 없습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  let payload;
  try {
    payload = JSON.parse(b64urlDecode(token));
  } catch {
    return {
      error: fail(400, 'INVALID_CURSOR', '페이지 위치 정보가 올바르지 않습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      error: fail(400, 'INVALID_CURSOR', '페이지 위치 정보가 올바르지 않습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  if (Number(payload.v) !== STUDENT_LEARNING_HISTORY_DEFAULTS.cursorVersion) {
    return {
      error: fail(409, 'CURSOR_VERSION_MISMATCH', '조회 방식이 갱신되었습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  const effDate = text(payload.d);
  const sessionId = text(payload.i);
  const cutoff = text(payload.cu);
  if (!DATE_RE.test(effDate) || !sessionId || sessionId.length > 128 ||
      /[\u0000-\u001f\u007f]/.test(sessionId) || !SQLITE_DATETIME_RE.test(cutoff)) {
    return {
      error: fail(400, 'INVALID_CURSOR', '페이지 위치 정보가 올바르지 않습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  // A forged future cutoff would disable the stable asOf boundary entirely.
  if (cutoff > expected.nowCutoff) {
    return {
      error: fail(400, 'INVALID_CURSOR', '페이지 위치 정보가 올바르지 않습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  // A forged keyset outside the requested window cannot widen the query, but it
  // would silently skip/repeat pages; treat it as malformed navigation.
  if (effDate < expected.windowFrom || effDate > expected.windowTo) {
    return {
      error: fail(400, 'INVALID_CURSOR', '페이지 위치 정보가 올바르지 않습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  if (text(payload.st) !== expected.studentHash || text(payload.sc) !== expected.scopeHash ||
      text(payload.per) !== expected.period || text(payload.fi) !== expected.filter) {
    return {
      error: fail(409, 'CURSOR_SCOPE_MISMATCH', '조회 조건이 바뀌었습니다. 처음부터 다시 조회해 주세요.')
    };
  }
  return { value: { effDate, sessionId, cutoff } };
}

function buildCursorToken(payload) {
  return b64urlEncode(JSON.stringify(payload));
}

function readFrozenMetadata(rawValue) {
  const result = { state: 'UNRESOLVED', canonical: {}, legacy: {}, top: {}, archive: {} };
  if (!rawValue) return result;
  let parsed;
  try {
    parsed = JSON.parse(String(rawValue));
  } catch {
    return result;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return result;

  result.top = parsed;
  result.canonical = parsed.canonicalMeta && typeof parsed.canonicalMeta === 'object' ? parsed.canonicalMeta : {};
  result.legacy = parsed.legacyDifficulty && typeof parsed.legacyDifficulty === 'object' ? parsed.legacyDifficulty : {};
  result.archive = parsed.archiveMetadata && typeof parsed.archiveMetadata === 'object' ? parsed.archiveMetadata : {};

  if (parsed.schemaVersion !== 'apms-blueprint-meta-snapshot-v1') result.state = 'UNRESOLVED';
  else if (parsed.captureStatus === 'CAPTURED') result.state = 'CAPTURED';
  else if (parsed.captureStatus === 'PARTIAL') result.state = 'PARTIAL';
  else result.state = 'UNRESOLVED';
  return result;
}

function normalizeSnapshotState(columnStatus, parsedState) {
  const fromColumn = text(columnStatus).toUpperCase();
  if (fromColumn === 'CAPTURED' || fromColumn === 'PARTIAL' || fromColumn === 'UNRESOLVED') return fromColumn;
  return parsedState || 'UNRESOLVED';
}

// The envelope spreads canonicalMeta at the top level, so a plain (non-envelope)
// snapshot can still carry difficultyBucket there.
function readCanonicalField(parsed, field) {
  const direct = parsed.canonical?.[field];
  if (direct !== undefined && direct !== null && direct !== '') return direct;
  const top = parsed.top?.[field];
  if (top !== undefined && top !== null && top !== '') return top;
  const authoring = parsed.top?.authoringMeta?.[field];
  if (authoring !== undefined && authoring !== null && authoring !== '') return authoring;
  return null;
}

function bucketFromValue(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const bucket = Number(value);
  return Number.isInteger(bucket) && bucket >= 1 && bucket <= 5 ? bucket : null;
}

function readCanonicalDifficultyBucket(parsed, item) {
  const fromMeta = bucketFromValue(readCanonicalField(parsed, 'difficultyBucket'));
  if (fromMeta) return fromMeta;
  // assessment-result-items.js writes difficulty_at_assignment (String(bucket)
  // or 'UNKNOWN'); a 1..5 numeric string is canonical, never a legacy label.
  const raw = text(item.difficulty);
  if (/^[1-5]$/.test(raw)) return Number(raw);
  return null;
}

function readLegacyDifficultyLabel(parsed, item) {
  const candidates = [
    parsed.legacy?.difficulty,
    parsed.archive?.difficulty,
    item.difficulty && !/^[1-5]$/.test(text(item.difficulty)) ? item.difficulty : null
  ];
  for (const candidate of candidates) {
    const label = text(candidate);
    if (!label) continue;
    if (label.toUpperCase() === 'UNKNOWN') continue;
    return label;
  }
  return '';
}

function itemStatusOf(row) {
  const status = text(row.result_status).toLowerCase();
  if (status === 'correct' || status === 'wrong' || status === 'partial' || status === 'unchecked') return status;
  if (row.is_correct === 1) return 'correct';
  if (row.is_correct === 0) return 'wrong';
  return 'unchecked';
}

function emptyCounts() {
  return { observed: 0, correct: 0, wrong: 0, partial: 0, unchecked: 0 };
}

function addCounts(target, source) {
  target.observed += source.observed;
  target.correct += source.correct;
  target.wrong += source.wrong;
  target.partial += source.partial;
  target.unchecked += source.unchecked;
  return target;
}

function emptyDifficulty() {
  return { canonicalBuckets: {}, legacyLabels: {}, unknown: 0 };
}

async function loadLegacyWrongCounts(env, sessionIds) {
  const counts = new Map();
  if (!sessionIds.length) return counts;
  const columns = await getColumnSet(env, 'wrong_answers');
  if (columns === null) throw new Error('wrong_answers probe failed');
  if (!columns.has('session_id') || !columns.has('question_id')) return counts;
  for (let offset = 0; offset < sessionIds.length; offset += 80) {
    const part = sessionIds.slice(offset, offset + 80);
    const result = await env.DB.prepare(`
      SELECT session_id, COUNT(*) AS wrong_count
      FROM wrong_answers
      WHERE session_id IN (${part.map(() => '?').join(',')})
      GROUP BY session_id
    `).bind(...part).all();
    (result.results || []).forEach(row => {
      const id = text(row.session_id);
      if (id) counts.set(id, Number(row.wrong_count || 0));
    });
  }
  return counts;
}

// Frozen result items are read with an explicit LIMIT.  A separate, bounded
// existence query distinguishes "no frozen rows at all" (legacy fallback) from
// "frozen rows exist but sit beyond the analysis cap" (unknown, never legacy).
function buildItemColumnList(columns) {
  const wanted = [
    'session_id', 'order_no', 'assignment_id', 'question_no', 'result_status', 'is_correct',
    'source_question_uid', 'source_identity_status', 'metadata_json', 'metadata_snapshot_status',
    'standard_unit_key', 'standard_unit', 'concept_cluster_key', 'type_key', 'difficulty'
  ];
  return wanted.filter(column => columns.has(column));
}

async function loadResultItemExistence(env, sessionIds) {
  const found = new Set();
  if (!sessionIds.length) return found;
  for (let offset = 0; offset < sessionIds.length; offset += 80) {
    const part = sessionIds.slice(offset, offset + 80);
    const result = await env.DB.prepare(`
      SELECT DISTINCT session_id
      FROM assessment_result_items
      WHERE session_id IN (${part.map(() => '?').join(',')})
    `).bind(...part).all();
    (result.results || []).forEach(row => {
      const id = text(row.session_id);
      if (id) found.add(id);
    });
  }
  return found;
}

async function loadBoundedResultItems(env, sessionIds, selectColumns, limit) {
  const rows = [];
  const max = Math.max(1, Number(limit) || 1);
  for (let offset = 0; offset < sessionIds.length && rows.length < max; offset += 80) {
    const part = sessionIds.slice(offset, offset + 80);
    const remaining = max - rows.length;
    const result = await env.DB.prepare(`
      SELECT ${selectColumns.join(', ')}
      FROM assessment_result_items
      WHERE session_id IN (${part.map(() => '?').join(',')})
      ORDER BY session_id, order_no
      LIMIT ${remaining}
    `).bind(...part).all();
    rows.push(...(result.results || []));
  }
  return rows;
}

// The page query is one bounded query: student sessions (the student's own
// evidence) left-joined to their assignment for scope/state columns.
// When the runtime has no exam_sessions.assignment_id column the join is
// disabled with `ON 1 = 0`, and the response reports assignedLinkage:
// 'unavailable' instead of pretending the linkage exists.
function buildPageSqlParts(context) {
  const {
    classIds, hasAssignmentId, hasExclusions, hasCancellation, hasRecipients
  } = context;

  const assignmentJoin = hasAssignmentId
    ? 'LEFT JOIN class_exam_assignments cea ON cea.id = s.assignment_id'
    : 'LEFT JOIN class_exam_assignments cea ON 1 = 0';
  const effectiveDateExpr = `COALESCE(
    NULLIF(TRIM(s.exam_date), ''),
    NULLIF(TRIM(cea.exam_date), ''),
    SUBSTR(COALESCE(s.created_at, ''), 1, 10)
  )`;
  const cancelledExpr = hasCancellation
    ? "CASE WHEN TRIM(COALESCE(cea.cancelled_at, '')) != '' THEN 1 ELSE 0 END"
    : '0';
  const excludedExpr = hasExclusions
    ? `CASE WHEN EXISTS (
        SELECT 1 FROM class_exam_assignment_exclusions ex
        WHERE ex.assignment_id = cea.id AND ex.student_id = ?
      ) THEN 1 ELSE 0 END`
    : '0';
  const recipientExpr = hasRecipients
    ? `CASE WHEN cea.id IS NULL THEN NULL WHEN EXISTS (
        SELECT 1 FROM class_exam_assignment_recipients ar
        WHERE ar.assignment_id = cea.id AND ar.student_id = ?
      ) THEN 1 ELSE 0 END`
    : 'NULL';

  // A single IN list keeps the statement under the D1 bound-parameter ceiling,
  // so CLASS_SCOPE_TOO_WIDE fires before the driver rejects the query.
  let scopeSql = '';
  if (classIds !== null) {
    scopeSql = classIds.length
      ? `AND COALESCE(cea.class_id, s.class_id) IN (${classIds.map(() => '?').join(',')})`
      : 'AND 1 = 0';
  }

  return { assignmentJoin, effectiveDateExpr, cancelledExpr, excludedExpr, recipientExpr, scopeSql };
}

function buildFilterSql(filter, context) {
  const { hasResultItems, hasLegacyWrongs } = context;
  const resultWrongSql = hasResultItems
    ? `EXISTS (SELECT 1 FROM assessment_result_items ari
        WHERE ari.session_id = s.id
          AND COALESCE(NULLIF(LOWER(TRIM(ari.result_status)), ''), 'unchecked') IN ('wrong', 'partial'))`
    : null;
  // Legacy wrong rows are only used when the session has no result rows at
  // all, mirroring the per-row classification rule.
  const legacyWrongSql = hasLegacyWrongs
    ? `(${hasResultItems
      ? 'NOT EXISTS (SELECT 1 FROM assessment_result_items ari WHERE ari.session_id = s.id) AND '
      : ''}EXISTS (SELECT 1 FROM wrong_answers wa WHERE wa.session_id = s.id))`
    : null;

  if (filter === 'wrong') {
    // 'wrong' is explicitly "not fully correct": wrong OR partially scored
    // items (or a legacy wrong row).  State and filter therefore agree.
    const parts = [resultWrongSql, legacyWrongSql].filter(Boolean);
    return parts.length ? `AND (${parts.join(' OR ')})` : 'AND 1 = 0';
  }
  if (filter === 'unchecked') {
    // 'unchecked' means explicitly unscored items only; 'partial' is surfaced
    // separately in counts/state and is reachable through the 'wrong' filter.
    if (!hasResultItems) return 'AND 1 = 0';
    return `AND EXISTS (SELECT 1 FROM assessment_result_items ari
      WHERE ari.session_id = s.id
        AND COALESCE(NULLIF(LOWER(TRIM(ari.result_status)), ''), 'unchecked') = 'unchecked')`;
  }
  return '';
}

export async function loadStudentLearningHistory(env, input = {}) {
  const studentId = text(input.studentId ?? input.student_id);
  if (!studentId) return fail(400, 'STUDENT_REQUIRED', '학생 정보를 확인할 수 없습니다.');
  if (studentId.length > 128 || /[\u0000-\u001f\u007f]/.test(studentId)) {
    return fail(400, 'STUDENT_INVALID', '학생 정보를 확인할 수 없습니다.');
  }
  if (!env || !env.DB || typeof env.DB.prepare !== 'function') {
    return fail(503, 'DB_UNAVAILABLE', '학습 기록을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.');
  }

  const periodKey = text(input.period) || STUDENT_LEARNING_HISTORY_DEFAULTS.defaultPeriod;
  if (!PERIOD_SET.has(periodKey)) return fail(400, 'INVALID_PERIOD', '조회 기간을 다시 선택해 주세요.');
  const periodDays = STUDENT_LEARNING_HISTORY_DEFAULTS.periodPresets[periodKey];
  if (!Number.isFinite(periodDays) || periodDays <= 0 ||
      periodDays > STUDENT_LEARNING_HISTORY_DEFAULTS.maxPeriodDays) {
    return fail(400, 'INVALID_PERIOD', '조회 기간을 다시 선택해 주세요.');
  }

  const filter = text(input.filter) || STUDENT_LEARNING_HISTORY_DEFAULTS.defaultFilter;
  if (!FILTER_SET.has(filter)) return fail(400, 'INVALID_FILTER', '조회 조건을 다시 선택해 주세요.');

  const pageSize = readPositiveInteger(
    input.pageSize ?? input.page_size,
    STUDENT_LEARNING_HISTORY_DEFAULTS.defaultPageSize,
    STUDENT_LEARNING_HISTORY_DEFAULTS.maxPageSize
  );

  const classScope = normalizeClassScope(input.allowedClassIds ?? input.allowed_class_ids);
  if (classScope.invalid ||
      (classScope.classScoped && classScope.ids.length > STUDENT_LEARNING_HISTORY_DEFAULTS.maxClassScopeIds)) {
    return fail(403, 'CLASS_SCOPE_TOO_WIDE', '이 기록을 조회할 권한 범위를 확인할 수 없습니다.');
  }

  const nowMs = Number.isFinite(Number(input.nowMs)) ? Number(input.nowMs) : Date.now();
  const todayKst = kstDateString(nowMs);
  const windowFrom = shiftDateString(todayKst, -(periodDays - 1));
  const windowTo = todayKst;
  const asOf = new Date(nowMs).toISOString();
  const nowCutoff = toSqliteUtcString(nowMs);

  const studentHash = await sha256hex(`student\u0000${studentId}`);
  const scopeHash = await buildScopeHash(studentId, classScope.ids, periodKey, filter);
  const cursorToken = text(input.cursor);

  const sessionColumns = await getColumnSet(env, 'exam_sessions');
  if (sessionColumns === null) {
    return fail(503, 'HISTORY_UNAVAILABLE', '학습 기록을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.');
  }
  if (!sessionColumns.has('id') || !sessionColumns.has('student_id')) {
    return fail(503, 'HISTORY_UNAVAILABLE', '학습 기록을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.');
  }
  const assignmentColumns = await getColumnSet(env, 'class_exam_assignments');
  const recipientColumns = await getColumnSet(env, 'class_exam_assignment_recipients');
  const exclusionColumns = await getColumnSet(env, 'class_exam_assignment_exclusions');
  const resultItemColumns = await getColumnSet(env, 'assessment_result_items');
  const legacyWrongColumns = await getColumnSet(env, 'wrong_answers');
  if (assignmentColumns === null || recipientColumns === null || exclusionColumns === null ||
      resultItemColumns === null || legacyWrongColumns === null) {
    // A failed probe is a database failure, not "the table/column is absent".
    return fail(503, 'HISTORY_UNAVAILABLE', '학습 기록을 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.');
  }

  const hasAssignmentId = sessionColumns.has('assignment_id') && assignmentColumns.has('id');
  const hasRecipients = recipientColumns.has('assignment_id') && recipientColumns.has('student_id');
  const hasExclusions = exclusionColumns.has('assignment_id') && exclusionColumns.has('student_id');
  const hasCancellation = assignmentColumns.has('cancelled_at');
  const hasResultItems = hasColumns(resultItemColumns, ['session_id', 'order_no']);
  const hasResultItemSessions = resultItemColumns.has('session_id');
  const hasLegacyWrongs = hasColumns(legacyWrongColumns, ['session_id', 'question_id']);

  let keyset = null;
  if (cursorToken) {
    const parsed = parseCursor(cursorToken, {
      studentHash, scopeHash, period: periodKey, filter, nowCutoff, windowFrom, windowTo
    });
    if (parsed.error) return parsed.error;
    keyset = parsed.value;
  }
  const cutoff = keyset?.cutoff || nowCutoff;

  const sqlParts = buildPageSqlParts({
    classIds: classScope.classScoped ? classScope.ids : null,
    hasAssignmentId,
    hasExclusions,
    hasCancellation,
    hasRecipients
  });
  const filterSql = buildFilterSql(filter, { hasResultItems, hasLegacyWrongs });

  const binds = [];
  if (hasExclusions) binds.push(studentId);
  if (hasRecipients) binds.push(studentId);
  binds.push(studentId);
  binds.push(cutoff);
  binds.push(windowFrom, windowTo);
  if (classScope.classScoped) binds.push(...classScope.ids);
  if (keyset) binds.push(keyset.effDate, keyset.effDate, keyset.sessionId);
  binds.push(pageSize + 1);

  let pageRows = [];
  try {
    const result = await env.DB.prepare(`
      SELECT
        s.id AS session_id,
        s.exam_title AS session_exam_title,
        s.exam_date AS session_exam_date,
        s.question_count AS session_question_count,
        s.score AS session_score,
        s.class_id AS session_class_id,
        s.created_at AS session_created_at,
        s.updated_at AS session_updated_at,
        cea.id AS assignment_id,
        cea.exam_title AS assignment_exam_title,
        cea.exam_date AS assignment_exam_date,
        cea.question_count AS assignment_question_count,
        cea.class_id AS assignment_class_id,
        cea.source_type AS assignment_source_type,
        c.name AS class_name,
        cs.name AS session_class_name,
        ${sqlParts.cancelledExpr} AS assignment_cancelled,
        ${sqlParts.excludedExpr} AS assignment_excluded,
        ${sqlParts.recipientExpr} AS assignment_recipient_recorded,
        ${sqlParts.effectiveDateExpr} AS effective_date
      FROM exam_sessions s
      ${sqlParts.assignmentJoin}
      LEFT JOIN classes c ON c.id = cea.class_id
      LEFT JOIN classes cs ON cs.id = s.class_id
      WHERE s.student_id = ?
        AND datetime(COALESCE(NULLIF(TRIM(s.created_at), ''), '1970-01-01 00:00:00')) <= datetime(?)
        AND ${sqlParts.effectiveDateExpr} >= ?
        AND ${sqlParts.effectiveDateExpr} <= ?
        ${sqlParts.scopeSql}
        ${filterSql}
        ${keyset ? `AND (${sqlParts.effectiveDateExpr} < ? OR (${sqlParts.effectiveDateExpr} = ? AND s.id < ?))` : ''}
      ORDER BY effective_date DESC, s.id DESC
      LIMIT ?
    `).bind(...binds).all();
    pageRows = result.results || [];
  } catch (error) {
    console.warn('[student-learning-history] page query failed:', error?.message || error);
    return fail(503, 'HISTORY_QUERY_FAILED', '학습 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }

  const hasMore = pageRows.length > pageSize;
  const rowsRaw = hasMore ? pageRows.slice(0, pageSize) : pageRows;
  const sessionIds = rowsRaw.map(row => text(row.session_id)).filter(Boolean);

  let itemRows = [];
  let sessionsWithResultRows = new Set();
  let itemQueryFailed = false;
  if (hasResultItemSessions && sessionIds.length) {
    const selectColumns = buildItemColumnList(resultItemColumns);
    try {
      sessionsWithResultRows = await loadResultItemExistence(env, sessionIds);
      if (hasResultItems) {
        itemRows = await loadBoundedResultItems(
          env,
          sessionIds,
          selectColumns,
          STUDENT_LEARNING_HISTORY_DEFAULTS.maxItemsAnalyzed + 1
        );
      }
    } catch (error) {
      console.warn('[student-learning-history] result item lookup failed:', error?.message || error);
      itemQueryFailed = true;
    }
  }
  if (itemQueryFailed) {
    // Never downgrade a failed frozen-item read to "this session had no result
    // rows"; that would silently replace real statuses with legacy wrong counts.
    return fail(503, 'HISTORY_QUERY_FAILED', '학습 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
  }

  const itemsTruncated = itemRows.length > STUDENT_LEARNING_HISTORY_DEFAULTS.maxItemsAnalyzed;
  const analyzedItems = itemsTruncated
    ? itemRows.slice(0, STUDENT_LEARNING_HISTORY_DEFAULTS.maxItemsAnalyzed)
    : itemRows;
  const extraItem = itemsTruncated ? itemRows[STUDENT_LEARNING_HISTORY_DEFAULTS.maxItemsAnalyzed] : null;

  const itemsBySession = new Map();
  analyzedItems.forEach(row => {
    const sessionId = text(row.session_id);
    if (!sessionId) return;
    if (!itemsBySession.has(sessionId)) itemsBySession.set(sessionId, []);
    itemsBySession.get(sessionId).push(row);
  });
  const lastAnalyzedSessionId = analyzedItems.length
    ? text(analyzedItems[analyzedItems.length - 1].session_id)
    : '';
  // Only a session cut in the MIDDLE is itself truncated.  If the cap landed on
  // a session boundary, the remaining sessions are simply not inspected yet.
  const capCutSessionId = extraItem && text(extraItem.session_id) === lastAnalyzedSessionId
    ? lastAnalyzedSessionId
    : '';

  const legacySessionIds = sessionIds.filter(id => !sessionsWithResultRows.has(id));
  let legacyWrongCounts = new Map();
  if (legacySessionIds.length) {
    try {
      legacyWrongCounts = await loadLegacyWrongCounts(env, legacySessionIds);
    } catch (error) {
      console.warn('[student-learning-history] legacy wrong lookup failed:', error?.message || error);
      return fail(503, 'HISTORY_QUERY_FAILED', '학습 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }

  const summaryCounts = emptyCounts();
  const attempts = {
    loaded: 0, complete: 0, partial: 0, unknown: 0, legacy: 0,
    reviewOnly: 0, repeatAttempts: 0, notInspected: 0
  };
  const difficulty = emptyDifficulty();
  const typeGroups = new Map();
  const assignmentSeen = new Map();
  const rows = [];
  const confirmedUidSeen = new Set();
  const unverifiedUidSeen = new Set();
  const truncatedSessionIds = new Set();
  let partialMetaItemCount = 0;
  let unresolvedMetaItemCount = 0;
  let typeUngroupedItemCount = 0;
  let unverifiedUidAppearances = 0;
  let confirmedUidAppearances = 0;
  let legacyWrongTotal = 0;
  let legacySessionCount = 0;
  let missingItemSessionCount = 0;
  let partialItemSessionCount = 0;

  rowsRaw.forEach(raw => {
    const sessionId = text(raw.session_id);
    const assignmentId = text(raw.assignment_id) || null;
    const items = itemsBySession.get(sessionId) || [];
    const hasFrozenRows = sessionsWithResultRows.has(sessionId);
    const itemsNotInspected = hasFrozenRows && items.length === 0;
    const legacyFallback = !hasFrozenRows;
    const capCut = capCutSessionId === sessionId;
    const reviewOnly = Number(raw.assignment_cancelled || 0) === 1 || Number(raw.assignment_excluded || 0) === 1;
    const sessionDeclared = Number(raw.session_question_count || 0);
    const assignmentDeclared = Number(raw.assignment_question_count || 0);
    const declaredQuestionCount = sessionDeclared > 0 ? sessionDeclared : assignmentDeclared;
    const counts = emptyCounts();
    const rowDifficulty = emptyDifficulty();

    if (legacyFallback) {
      // Legacy fallback is restricted to sessions WITHOUT frozen result rows, so
      // the same attempt is never counted twice.  The wrong count is kept out of
      // questions.observed/correct and reported through unclassified.legacyWrongs.
      const wrongCount = legacyWrongCounts.get(sessionId) || 0;
      counts.wrong = wrongCount;
      legacyWrongTotal += wrongCount;
      legacySessionCount += 1;
    } else {
      items.forEach(item => {
        const status = itemStatusOf(item);
        counts.observed += 1;
        if (status === 'correct') counts.correct += 1;
        else if (status === 'wrong') counts.wrong += 1;
        else if (status === 'partial') counts.partial += 1;
        else counts.unchecked += 1;

        const parsed = readFrozenMetadata(item.metadata_json);
        const snapshotState = normalizeSnapshotState(item.metadata_snapshot_status, parsed.state);
        if (snapshotState === 'PARTIAL') partialMetaItemCount += 1;
        else if (snapshotState === 'UNRESOLVED') unresolvedMetaItemCount += 1;

        const bucket = readCanonicalDifficultyBucket(parsed, item);
        if (bucket) {
          const bucketKey = String(bucket);
          rowDifficulty.canonicalBuckets[bucketKey] = (rowDifficulty.canonicalBuckets[bucketKey] || 0) + 1;
          difficulty.canonicalBuckets[bucketKey] = (difficulty.canonicalBuckets[bucketKey] || 0) + 1;
        } else {
          const legacyLabel = readLegacyDifficultyLabel(parsed, item);
          if (legacyLabel) {
            rowDifficulty.legacyLabels[legacyLabel] = (rowDifficulty.legacyLabels[legacyLabel] || 0) + 1;
            difficulty.legacyLabels[legacyLabel] = (difficulty.legacyLabels[legacyLabel] || 0) + 1;
          } else {
            rowDifficulty.unknown += 1;
            difficulty.unknown += 1;
          }
        }

        const rawUid = text(item.source_question_uid);
        const identityStatus = text(item.source_identity_status).toUpperCase();
        const confirmedUid = Boolean(rawUid) && identityStatus === 'VERIFIED';
        if (confirmedUid) {
          confirmedUidAppearances += 1;
          confirmedUidSeen.add(rawUid);
        } else {
          unverifiedUidAppearances += 1;
          if (rawUid) unverifiedUidSeen.add(rawUid);
        }

        const l3 = text(readCanonicalField(parsed, 'L3'));
        const l4 = text(readCanonicalField(parsed, 'L4'));
        const standardUnitLabel = text(item.standard_unit) || text(parsed.archive?.standardUnit) ||
          text(parsed.top?.authoringMeta?.standardUnit);
        let groupKey;
        let groupLabel;
        let depth;
        let classified;
        if (l4 || l3) {
          const typeLabel = l4 || l3;
          depth = l4 ? 'L4' : 'L3';
          groupKey = `type\u0000${standardUnitLabel}\u0000${typeLabel}`;
          groupLabel = standardUnitLabel ? `${standardUnitLabel} · ${typeLabel}` : typeLabel;
          classified = true;
        } else if (standardUnitLabel) {
          depth = 'unit';
          groupKey = `unit\u0000${standardUnitLabel}`;
          groupLabel = standardUnitLabel;
          classified = true;
        } else {
          // Key-bearing rows without a display label collapse into ONE
          // unclassified bucket instead of several identical '유형 미분류' rows.
          depth = 'unclassified';
          groupKey = 'unclassified\u0000';
          groupLabel = UNCLASSIFIED_LABEL;
          classified = false;
          typeUngroupedItemCount += 1;
        }
        if (!typeGroups.has(groupKey)) {
          typeGroups.set(groupKey, {
            label: groupLabel,
            classified,
            depth,
            l3: l3 || null,
            l4: l4 || null,
            parentUnit: standardUnitLabel || null,
            counts: emptyCounts(),
            uniqueUidSet: new Set(),
            unverifiedUidSet: new Set(),
            unverifiedAppearances: 0,
            evidence: []
          });
        }
        const group = typeGroups.get(groupKey);
        group.counts.observed += 1;
        if (status === 'correct') group.counts.correct += 1;
        else if (status === 'wrong') group.counts.wrong += 1;
        else if (status === 'partial') group.counts.partial += 1;
        else group.counts.unchecked += 1;
        if (confirmedUid) group.uniqueUidSet.add(rawUid);
        else {
          group.unverifiedAppearances += 1;
          if (rawUid) group.unverifiedUidSet.add(rawUid);
        }
        const evidenceKey = `${sessionId}\u0000${assignmentId || ''}`;
        if (status !== 'correct' &&
            group.evidence.length < STUDENT_LEARNING_HISTORY_DEFAULTS.maxEvidencePerType &&
            !group.evidence.some(entry => entry.key === evidenceKey)) {
          group.evidence.push({ key: evidenceKey, sessionId, assignmentId });
        }
      });
    }

    const truncatedRow = capCut;
    const missingItems = !legacyFallback && !itemsNotInspected && declaredQuestionCount > 0 &&
      counts.observed < declaredQuestionCount;
    if (truncatedRow) truncatedSessionIds.add(sessionId);
    if (itemsNotInspected) {
      missingItemSessionCount += 1;
    } else if (missingItems) {
      partialItemSessionCount += 1;
    }

    if (!legacyFallback) addCounts(summaryCounts, counts);
    const state = legacyFallback
      ? 'legacy'
      : itemsNotInspected || counts.observed === 0
        ? 'unknown'
        : counts.unchecked > 0 || counts.partial > 0 || truncatedRow || missingItems
          ? 'partial'
          : 'complete';

    attempts.loaded += 1;
    attempts[state] += 1;
    if (itemsNotInspected) attempts.notInspected += 1;
    if (reviewOnly) attempts.reviewOnly += 1;
    if (assignmentId) {
      const seen = assignmentSeen.get(assignmentId) || 0;
      if (seen > 0) attempts.repeatAttempts += 1;
      assignmentSeen.set(assignmentId, seen + 1);
    }

    // Frozen session values win over the mutable assignment row, so editing an
    // assignment later cannot rewrite already-observed history.
    const questionCount = declaredQuestionCount > 0 ? declaredQuestionCount : counts.observed;
    const questionCountBasis = sessionDeclared > 0
      ? 'frozen_session'
      : assignmentDeclared > 0
        ? 'assignment_fallback'
        : 'observed_items';
    const rawScore = raw.session_score;
    const scoreValue = rawScore === null || rawScore === undefined || rawScore === '' ? null : Number(rawScore);
    const recipientRecorded = raw.assignment_recipient_recorded === null ||
      raw.assignment_recipient_recorded === undefined
      ? null
      : Number(raw.assignment_recipient_recorded) === 1;

    rows.push({
      sessionId,
      assignmentId,
      classId: text(raw.assignment_class_id) || text(raw.session_class_id) || null,
      className: text(raw.class_name) || text(raw.session_class_name) || '',
      title: text(raw.session_exam_title) || text(raw.assignment_exam_title) || '',
      examDate: text(raw.effective_date),
      submittedAt: text(raw.session_updated_at) || text(raw.session_created_at),
      questionCount,
      questionCountBasis,
      score: Number.isFinite(scoreValue) ? scoreValue : null,
      state,
      legacyFallback,
      itemsNotInspected,
      itemsTruncated: truncatedRow,
      itemsMissing: missingItems,
      reviewOnly,
      recipientRecorded,
      counts,
      uniqueUidCount: new Set(items
        .filter(item => text(item.source_identity_status).toUpperCase() === 'VERIFIED')
        .map(item => text(item.source_question_uid))
        .filter(Boolean)).size,
      difficulty: rowDifficulty,
      // Navigation is decided by the existing portal through an approved
      // callback; this helper never emits URLs or HTML.
      sourceRefs: {
        kind: assignmentId ? 'assignment' : 'session',
        assignmentId,
        sessionId
      }
    });
  });

  const sortedTypes = Array.from(typeGroups.values())
    .sort((a, b) => (b.counts.wrong - a.counts.wrong) ||
      (b.counts.observed - a.counts.observed) ||
      a.label.localeCompare(b.label, 'ko'));
  const typesTruncated = sortedTypes.length > STUDENT_LEARNING_HISTORY_DEFAULTS.maxTypeGroups;
  const typesByDepth = { L4: 0, L3: 0, unit: 0, unclassified: 0 };
  sortedTypes.forEach(group => {
    if (typesByDepth[group.depth] !== undefined) typesByDepth[group.depth] += 1;
  });
  const types = (typesTruncated ? sortedTypes.slice(0, STUDENT_LEARNING_HISTORY_DEFAULTS.maxTypeGroups) : sortedTypes)
    .map(group => ({
      label: group.label,
      classified: group.classified,
      depth: group.depth,
      l3: group.l3,
      l4: group.l4,
      parentUnit: group.parentUnit,
      observed: group.counts.observed,
      correct: group.counts.correct,
      wrong: group.counts.wrong,
      partial: group.counts.partial,
      unchecked: group.counts.unchecked,
      uniqueUid: group.uniqueUidSet.size,
      unverifiedUid: group.unverifiedUidSet.size,
      unverifiedAppearances: group.unverifiedAppearances,
      evidence: group.evidence.map(entry => ({ sessionId: entry.sessionId, assignmentId: entry.assignmentId }))
    }));

  const lastRow = rows.length ? rows[rows.length - 1] : null;
  const nextCursor = hasMore && lastRow
    ? buildCursorToken({
      v: STUDENT_LEARNING_HISTORY_DEFAULTS.cursorVersion,
      st: studentHash,
      sc: scopeHash,
      per: periodKey,
      fi: filter,
      d: lastRow.examDate,
      i: lastRow.sessionId,
      cu: cutoff
    })
    : null;

  const notices = [`${LOADED_PAGE_LABEL}입니다.`];
  if (!hasAssignmentId) {
    notices.push('이 환경에는 배정 연결 정보가 없어 배정·취소·제외 여부는 표시하지 않습니다.');
  }
  if (attempts.reviewOnly > 0) notices.push('취소·제외된 배정의 응시 기록은 참고용으로 표시했습니다.');
  if (partialMetaItemCount + unresolvedMetaItemCount > 0) {
    notices.push('일부 문항은 유형·난이도 정보가 없어 미분류로 집계했습니다.');
  }
  if (attempts.legacy > 0) notices.push('일부 기록은 정답 단위 정보가 없어 오답 수만 집계했습니다.');
  if (itemsTruncated) notices.push('한 번에 확인하는 문항 수를 넘어 일부 문항은 집계에서 제외했습니다.');
  if (attempts.notInspected > 0) notices.push('일부 응시는 문항 정보를 확인하지 못해 관측 수치에서 제외했습니다.');
  if (partialItemSessionCount > 0) notices.push('일부 응시는 기록된 문항 수보다 확인된 문항 수가 적습니다.');
  if (typesTruncated) notices.push('유형 그룹이 많아 일부 유형만 표시했습니다.');
  if (hasMore) notices.push('다음 기록이 더 있습니다.');

  return {
    ok: true,
    helperVersion: STUDENT_LEARNING_HISTORY_VERSION,
    mode: 'observed_history',
    asOf,
    assignedLinkage: hasAssignmentId ? 'available' : 'unavailable',
    requested: {
      period: periodKey,
      filter,
      pageSize,
      classScoped: classScope.classScoped,
      requestedClassCount: classScope.classScoped ? classScope.ids.length : null,
      cursorProvided: Boolean(cursorToken)
    },
    observed: {
      period: periodKey,
      periodDays,
      from: windowFrom,
      to: windowTo,
      filter,
      classScoped: classScope.classScoped,
      classCount: classScope.classScoped ? classScope.ids.length : null,
      assignedLinkage: hasAssignmentId ? 'available' : 'unavailable',
      stableCutoff: cutoff,
      sessionsLoaded: rows.length,
      itemsInspected: analyzedItems.length,
      itemsTruncated,
      itemsTruncatedSessions: truncatedSessionIds.size,
      sessionsNotInspected: missingItemSessionCount,
      sessionsPartialItems: partialItemSessionCount,
      // 'partial' never means "data is fine": it flags that some observed rows
      // were only partially readable for this page.
      partial: itemsTruncated || attempts.notInspected > 0 || attempts.partial > 0,
      unknown: attempts.unknown,
      legacy: attempts.legacy
    },
    coverage: {
      basis: 'loaded_page',
      label: LOADED_PAGE_LABEL,
      wholePeriod: false
    },
    page: {
      limit: pageSize,
      returned: rows.length,
      hasMore,
      truncated: hasMore,
      nextCursor
    },
    summary: {
      basis: 'loaded_page',
      pageScope: 'current_page',
      label: LOADED_PAGE_LABEL,
      attempts,
      questions: summaryCounts,
      uniqueQuestion: {
        confirmed: confirmedUidSeen.size,
        unverified: unverifiedUidSeen.size,
        unverifiedAppearances: unverifiedUidAppearances,
        duplicateAppearances: Math.max(0, confirmedUidAppearances - confirmedUidSeen.size),
        totalAppearances: confirmedUidAppearances + unverifiedUidAppearances
      },
      difficulty,
      unclassified: {
        legacyWrongs: legacyWrongTotal,
        legacySessions: legacySessionCount,
        unresolvedMetaItems: unresolvedMetaItemCount,
        partialMetaItems: partialMetaItemCount,
        typeUngroupedItems: typeUngroupedItemCount,
        sessionsWithoutItems: legacySessionCount,
        sessionsNotInspected: attempts.notInspected,
        sessionsMissingItems: partialItemSessionCount
      },
      typeGroups: sortedTypes.length,
      typesByDepth,
      typesTruncated
    },
    types,
    rows,
    notices,
    limits: {
      defaultPeriod: STUDENT_LEARNING_HISTORY_DEFAULTS.defaultPeriod,
      maxPageSize: STUDENT_LEARNING_HISTORY_DEFAULTS.maxPageSize,
      maxItemsAnalyzed: STUDENT_LEARNING_HISTORY_DEFAULTS.maxItemsAnalyzed,
      maxClassScopeIds: STUDENT_LEARNING_HISTORY_DEFAULTS.maxClassScopeIds,
      maxTypeGroups: STUDENT_LEARNING_HISTORY_DEFAULTS.maxTypeGroups,
      cursorSigned: false
    }
  };
}
