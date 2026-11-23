// Student self-study records ("오답 다시 풀기" / "유사 문항 풀어보기").
// One row per (student, assignment, kind). The student saves it from the portal
// and teachers read it back through the existing by-class / detail-data reads.
//
// This module never reads or writes exam_sessions, wrong_answers or
// assessment_result_items. The table comes from an additive migration
// (migrations/20261123_student_self_study_sets.sql); until that is applied every
// caller gets FEATURE_UNAVAILABLE / empty data instead of a per-request CREATE.

export const SELF_STUDY_TABLE = 'student_self_study_sets';
export const SELF_STUDY_KINDS = ['wrong', 'similar'];
export const SELF_STUDY_RESULTS = ['c', 'w', 'u'];
export const SELF_STUDY_WHY = ['calc', 'misread', 'concept', 'method', 'guess'];
export const SELF_STUDY_MAX_REQUEST_ITEMS = 200;
// Union of what a student saved over time. The per-request cap alone would let
// a set grow without bound, so the stored set has its own ceiling.
export const SELF_STUDY_MAX_STORED_ITEMS = 400;
export const SELF_STUDY_MAX_KEY_LENGTH = 200;
export const SELF_STUDY_MAX_BODY_BYTES = 64 * 1024;

const SET_COLUMNS = `student_id, assignment_id, kind, class_id, total, correct, wrong,
  started_at, updated_at, completed_at`;

export function selfStudyUnavailableBody() {
  return {
    ok: false,
    success: false,
    code: 'FEATURE_UNAVAILABLE',
    message: '자습 기록 기능이 아직 준비되지 않았습니다. 이 기기에만 저장됩니다.',
  };
}

// Read-only existence check. A failed probe counts as unavailable; negative
// answers are never cached so a later migration is picked up immediately.
export async function selfStudyTableExists(env) {
  try {
    const row = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    ).bind(SELF_STUDY_TABLE).first();
    return !!row?.name;
  } catch {
    return false;
  }
}

function invalid(message) {
  return { error: message };
}

function isInteger(value) {
  return typeof value === 'number' && Number.isInteger(value);
}

function parseTime(value) {
  const ms = Date.parse(String(value || ''));
  return Number.isFinite(ms) ? ms : null;
}

// Validates one request/stored element. Returns { item } or { error }.
function normalizeItem(raw, nowIso) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return invalid('items 항목 형식이 올바르지 않습니다.');
  const k = raw.k;
  if (typeof k !== 'string' || !k.trim() || k.length > SELF_STUDY_MAX_KEY_LENGTH) {
    return invalid('문항 키(k)는 1~200자 문자열이어야 합니다.');
  }
  let u = null;
  if (raw.u !== undefined && raw.u !== null) {
    if (typeof raw.u !== 'string' || raw.u.length > SELF_STUDY_MAX_KEY_LENGTH) return invalid('u 형식이 올바르지 않습니다.');
    u = raw.u || null;
  }
  let src = null;
  if (raw.src !== undefined && raw.src !== null) {
    if (!isInteger(raw.src) || raw.src < 0 || raw.src > 100000) return invalid('src는 정수여야 합니다.');
    src = raw.src;
  }
  let r = null;
  if (raw.r !== undefined && raw.r !== null) {
    if (!SELF_STUDY_RESULTS.includes(raw.r)) return invalid('r 값이 올바르지 않습니다.');
    r = raw.r;
  }
  let why = null;
  if (raw.why !== undefined && raw.why !== null) {
    if (!SELF_STUDY_WHY.includes(raw.why)) return invalid('why 값이 올바르지 않습니다.');
    why = raw.why;
  }
  let n = 0;
  if (raw.n !== undefined && raw.n !== null) {
    if (!isInteger(raw.n) || raw.n < 0 || raw.n > 100000) return invalid('n은 정수여야 합니다.');
    n = raw.n;
  }
  let t = nowIso;
  if (raw.t !== undefined && raw.t !== null) {
    if (typeof raw.t !== 'string' || raw.t.length > 40 || parseTime(raw.t) === null) return invalid('t는 ISO 시각이어야 합니다.');
    t = raw.t;
  }
  return { item: { k, u, src, r, why, n, t } };
}

export function normalizeSelfStudyItems(items, nowIso) {
  if (!Array.isArray(items)) return invalid('items는 배열이어야 합니다.');
  if (items.length > SELF_STUDY_MAX_REQUEST_ITEMS) return invalid(`items는 최대 ${SELF_STUDY_MAX_REQUEST_ITEMS}개입니다.`);
  const out = [];
  for (const raw of items) {
    const normalized = normalizeItem(raw, nowIso);
    if (normalized.error) return normalized;
    out.push(normalized.item);
  }
  return { items: out };
}

// Same k: the later t wins (a tie goes to the incoming value). A k that only
// the server has is kept.
export function mergeSelfStudyItems(existing, incoming) {
  const merged = new Map();
  for (const item of existing) merged.set(item.k, item);
  for (const item of incoming) {
    const current = merged.get(item.k);
    if (!current || (parseTime(item.t) ?? 0) >= (parseTime(current.t) ?? 0)) merged.set(item.k, item);
  }
  return [...merged.values()];
}

export function summarizeSelfStudyItems(items) {
  let correct = 0;
  let wrong = 0;
  let pending = 0;
  for (const item of items) {
    if (item.r === 'c') correct += 1;
    else if (item.r === 'w' || item.r === 'u') wrong += 1;
    else pending += 1;
  }
  return { total: items.length, correct, wrong, complete: items.length > 0 && pending === 0 };
}

function parseStoredItems(json) {
  try {
    const parsed = JSON.parse(String(json || '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Counts the still-wrong items (r 'w' or 'u') per reason code. Items without a reason are not counted.
// A broken items_json counts as no items, so one bad row never fails a whole response.
export function whyCountsFromItems(items) {
  const counts = Object.fromEntries(SELF_STUDY_WHY.map(code => [code, 0]));
  for (const item of Array.isArray(items) ? items : []) {
    if (!item || typeof item !== 'object') continue;
    if (item.r !== 'w' && item.r !== 'u') continue;
    if (SELF_STUDY_WHY.includes(item.why)) counts[item.why] += 1;
  }
  return counts;
}

function shapeSet(row, includeItems, includeWhyCounts = false) {
  const set = {
    student_id: row.student_id,
    assignment_id: row.assignment_id,
    kind: row.kind,
    class_id: row.class_id || null,
    total: Number(row.total || 0),
    correct: Number(row.correct || 0),
    wrong: Number(row.wrong || 0),
    started_at: row.started_at || null,
    updated_at: row.updated_at || null,
    completed_at: row.completed_at || null,
  };
  if (includeItems) set.items = parseStoredItems(row.items_json);
  if (includeWhyCounts) set.why_counts = whyCountsFromItems(includeItems ? set.items : parseStoredItems(row.items_json));
  return set;
}

export async function upsertSelfStudySet(env, { studentId, assignmentId, kind, classId, items }) {
  const nowIso = new Date().toISOString();
  const existingRow = await env.DB.prepare(
    `SELECT items_json FROM ${SELF_STUDY_TABLE} WHERE student_id = ? AND assignment_id = ? AND kind = ? LIMIT 1`,
  ).bind(studentId, assignmentId, kind).first();
  const existingItems = existingRow ? parseStoredItems(existingRow.items_json) : [];
  const merged = mergeSelfStudyItems(existingItems, items);
  if (merged.length > SELF_STUDY_MAX_STORED_ITEMS) {
    return invalid(`한 세트에 저장할 수 있는 문항은 최대 ${SELF_STUDY_MAX_STORED_ITEMS}개입니다.`);
  }
  const summary = summarizeSelfStudyItems(merged);
  await env.DB.prepare(`
    INSERT INTO ${SELF_STUDY_TABLE} (
      student_id, assignment_id, kind, class_id, total, correct, wrong,
      items_json, started_at, updated_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(student_id, assignment_id, kind) DO UPDATE SET
      class_id = excluded.class_id,
      total = excluded.total,
      correct = excluded.correct,
      wrong = excluded.wrong,
      items_json = excluded.items_json,
      started_at = COALESCE(${SELF_STUDY_TABLE}.started_at, excluded.started_at),
      updated_at = excluded.updated_at,
      completed_at = COALESCE(${SELF_STUDY_TABLE}.completed_at, excluded.completed_at)
  `).bind(
    studentId, assignmentId, kind, classId || null,
    summary.total, summary.correct, summary.wrong,
    JSON.stringify(merged), nowIso, nowIso, summary.complete ? nowIso : null,
  ).run();
  const row = await env.DB.prepare(
    `SELECT ${SET_COLUMNS}, items_json FROM ${SELF_STUDY_TABLE}
     WHERE student_id = ? AND assignment_id = ? AND kind = ? LIMIT 1`,
  ).bind(studentId, assignmentId, kind).first();
  return { set: shapeSet(row, true) };
}

// One student's sets. Without an assignment id only the aggregates come back;
// classScope (an array of class ids, or null for no restriction) limits what a
// teacher preview may see.
export async function listSelfStudySetsForStudent(env, studentId, { assignmentId = '', classScope = null, withWhyCounts = false } = {}) {
  const where = ['student_id = ?'];
  const binds = [studentId];
  if (assignmentId) {
    where.push('assignment_id = ?');
    binds.push(assignmentId);
  }
  if (Array.isArray(classScope)) {
    if (!classScope.length) return [];
    where.push(`class_id IN (${classScope.map(() => '?').join(',')})`);
    binds.push(...classScope);
  }
  const includeItems = !!assignmentId;
  const result = await env.DB.prepare(`
    SELECT ${SET_COLUMNS}${includeItems || withWhyCounts ? ', items_json' : ''}
    FROM ${SELF_STUDY_TABLE}
    WHERE ${where.join(' AND ')}
    ORDER BY updated_at DESC, assignment_id, kind
    LIMIT 500
  `).bind(...binds).all();
  return (result.results || []).map(row => shapeSet(row, includeItems, withWhyCounts));
}

// Teacher reads. Both return { available, rows } and never throw: a missing or
// unreadable table is an empty list with available:false.
export async function loadSelfStudyForAssignment(env, assignmentId, classId) {
  if (!(await selfStudyTableExists(env))) return { available: false, rows: [] };
  try {
    const result = await env.DB.prepare(`
      SELECT ${SET_COLUMNS}, items_json
      FROM ${SELF_STUDY_TABLE}
      WHERE assignment_id = ? AND class_id = ?
      ORDER BY student_id, kind
    `).bind(assignmentId, classId).all();
    return { available: true, rows: (result.results || []).map(row => shapeSet(row, true)) };
  } catch {
    return { available: false, rows: [] };
  }
}

export async function loadSelfStudySummaryForStudent(env, studentId) {
  if (!(await selfStudyTableExists(env))) return { available: false, rows: [] };
  try {
    // why_counts is the reason tally per set (the items themselves stay out of the aggregate list).
    return { available: true, rows: await listSelfStudySetsForStudent(env, studentId, { withWhyCounts: true }) };
  } catch {
    return { available: false, rows: [] };
  }
}

// Teacher exam list: how many students solved something, per assignment of one class, in a single query.
// Returns { available, counts: { [assignmentId]: n } }. Never throws; a missing table is available:false.
// A set that was only opened (correct + wrong = 0) does not count.
export async function loadSelfStudyStudentCountsForClass(env, classId) {
  if (!classId || !(await selfStudyTableExists(env))) return { available: false, counts: {} };
  try {
    const result = await env.DB.prepare(`
      SELECT assignment_id, COUNT(DISTINCT student_id) AS students
      FROM ${SELF_STUDY_TABLE}
      WHERE class_id = ? AND (COALESCE(correct, 0) + COALESCE(wrong, 0)) > 0
      GROUP BY assignment_id
    `).bind(classId).all();
    const counts = {};
    for (const row of result.results || []) counts[String(row.assignment_id)] = Number(row.students || 0);
    return { available: true, counts };
  } catch {
    return { available: false, counts: {} };
  }
}
