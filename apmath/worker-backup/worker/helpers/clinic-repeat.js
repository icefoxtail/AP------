// Teacher-confirmed repeat operations for recommended clinic follow-ups.
//
// This module is intentionally narrow:
//  - it stores a policy and a frozen per-round reservation,
//  - it evaluates evidence from existing assignment/session/result rows,
//  - it never creates an exam, never selects candidates and never infers mastery.
//
// All reads are bounded and parameterized. Nothing here creates tables; the
// route reports FEATURE_UNAVAILABLE until the additive migration is applied.

import { sha256hex } from './admin-db.js';
import {
  canAccessClass,
  canAccessStudent,
  isStaffUser,
} from './foundation-db.js';

export const CLINIC_REPEAT_CONTRACT = 'apms-clinic-repeat-v1';
export const CLINIC_REPEAT_SETTINGS_SCHEMA = 'apms-clinic-repeat-settings-v1';
export const CLINIC_REPEAT_EVIDENCE_SCHEMA = 'apms-clinic-repeat-evidence-v1';

export const POLICY_STATUS = Object.freeze({ ACTIVE: 'ACTIVE', CLOSED: 'CLOSED' });
export const ROUND_STATUS = Object.freeze({
  RESERVED: 'RESERVED',
  UNRESOLVED: 'UNRESOLVED',
  ISSUED: 'ISSUED',
  RELEASED: 'RELEASED',
});
export const EVALUATION_STATE = Object.freeze({
  NEEDS_CHECK: 'NEEDS_CHECK',
  WAITING_CADENCE: 'WAITING_CADENCE',
  CONFIRMATION_NEEDED: 'CONFIRMATION_NEEDED',
  CLOSED: 'CLOSED',
});
export const CLOSE_REASONS = Object.freeze(['MANUAL_STOP', 'SOURCE_INELIGIBLE']);
export const UNRESOLVED_REASONS = Object.freeze([
  'ISSUE_OUTCOME_UNKNOWN',
  'PARTIAL_ISSUE',
  'CLIENT_TIMEOUT',
  'OTHER',
]);

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SHA256_HEX = /^[0-9a-f]{64}$/i;
const SETTINGS_KEYS = new Set([
  'cadenceDays',
  'maxRounds',
  'stopOnCompleteNoObservedWrongs',
  'questionCount',
  'difficultyBuckets',
  'includeSeenQuestionUids',
  'note',
]);
const CANDIDATE_KEYS = new Set([
  'questionCount',
  'difficultyBuckets',
  'includeSeenQuestionUids',
  'mode',
  'note',
]);
const MAX_ROUNDS_LIMIT = 50;
const MAX_CADENCE_DAYS = 365;
const MAX_QUESTIONS_PER_STUDENT = 400;
const MAX_PAPERS_PER_ROUND = 8;
const MAX_ROUNDS_LISTED = MAX_ROUNDS_LIMIT;
const MAX_POLICIES_EVALUATED = 5;
const MAX_POLICIES_LISTED = 50;
// Union bound of the status list: recent window (5) + open-round policies
// (LIMIT 50) + ACTIVE policies (LIMIT 50) can be disjoint, so 5 + 50 + 50 = 105.
// The bound is a row cap, not a query multiplier.
const MAX_STATUS_POLICIES = MAX_POLICIES_LISTED * 2 + MAX_POLICIES_EVALUATED;
const DAY_MS = 86400000;

const REASON_LABELS = Object.freeze({
  SETTINGS_INVALID: '반복 설정을 확인할 수 없습니다. 설정을 다시 저장하세요.',
  MANUAL_STOP: '선생님이 반복 운영을 종료했습니다.',
  SOURCE_INELIGIBLE: '대상 학생의 배정 자격이 없어 종료했습니다.',
  MAX_ROUNDS: '설정한 최대 회차에 도달했습니다.',
  NO_OBSERVED_WRONGS: '관측 오답 0 — 숙련 완료로 판정하지 않습니다.',
  OPEN_ROUND_RESERVED: '회차 배정 확인이 필요합니다. 기존 배정 절차에서 배정을 완료하세요.',
  ROUND_OUTCOME_UNRESOLVED: '회차 배정 결과가 미확정입니다. 기존 배정을 확인하세요.',
  ROUND_ATTEMPT_NOT_SUBMITTED: '학생의 회차 응시가 아직 제출되지 않았습니다.',
  ROUND_ATTEMPT_PARTIAL: '회차 응시 결과가 일부만 확인됩니다.',
  ROUND_ATTEMPT_INELIGIBLE: '회차 배정이 취소·제외되어 결과를 확인할 수 없습니다.',
  ROUND_ATTEMPT_MISSING: '회차 배정을 찾을 수 없습니다.',
  ROUND_ATTEMPT_UNAVAILABLE: '회차 결과 조회에 실패했습니다. 다시 확인하세요.',
  SOURCE_NOT_SUBMITTED: '기준 시험 응시가 아직 제출되지 않았습니다.',
  SOURCE_PARTIAL: '기준 시험 결과가 일부만 확인됩니다.',
  SOURCE_LEGACY: '기준 시험 결과를 문항 단위로 확인할 수 없습니다.',
  SOURCE_CANCELLED: '기준 시험 배정이 취소되었습니다.',
  SOURCE_EXCLUDED: '기준 시험에서 학생이 제외되었습니다.',
  SOURCE_NOT_RECIPIENT: '기준 시험의 수신 학생이 아닙니다.',
  SOURCE_MISSING: '기준 시험 배정을 찾을 수 없습니다.',
  SOURCE_UNAVAILABLE: '기준 시험 결과 조회에 실패했습니다. 다시 확인하세요.',
  WAITING_CADENCE: '다음 추천 가능 시점 전입니다.',
  CONFIRMATION_NEEDED: '선생님 확인 후 다음 회차를 준비할 수 있습니다.',
});

const SOURCE_STATUS_REASON = Object.freeze({
  MISSING: 'SOURCE_MISSING',
  CANCELLED: 'SOURCE_CANCELLED',
  EXCLUDED: 'SOURCE_EXCLUDED',
  NOT_RECIPIENT: 'SOURCE_NOT_RECIPIENT',
  NOT_SUBMITTED: 'SOURCE_NOT_SUBMITTED',
  LEGACY_NO_RESULT_ITEMS: 'SOURCE_LEGACY',
  PARTIAL: 'SOURCE_PARTIAL',
  UNAVAILABLE: 'SOURCE_UNAVAILABLE',
});

const ROUND_STATUS_REASON = Object.freeze({
  MISSING: 'ROUND_ATTEMPT_MISSING',
  CANCELLED: 'ROUND_ATTEMPT_INELIGIBLE',
  EXCLUDED: 'ROUND_ATTEMPT_INELIGIBLE',
  NOT_RECIPIENT: 'ROUND_ATTEMPT_INELIGIBLE',
  NOT_SUBMITTED: 'ROUND_ATTEMPT_NOT_SUBMITTED',
  LEGACY_NO_RESULT_ITEMS: 'ROUND_ATTEMPT_PARTIAL',
  PARTIAL: 'ROUND_ATTEMPT_PARTIAL',
  UNAVAILABLE: 'ROUND_ATTEMPT_UNAVAILABLE',
});

function text(value) {
  return String(value == null ? '' : value).trim();
}

function unique(values) {
  return Array.from(new Set((Array.isArray(values) ? values : []).map(text).filter(Boolean)));
}

function plainObject(value) {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function parseJsonObject(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(String(value));
    return plainObject(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function parseJsonArray(value) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(String(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function nowIso() {
  return new Date().toISOString();
}

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (plainObject(value)) {
    return `{${Object.keys(value).sort()
      .map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

export function clinicRepeatError(code, message, status = 400, extra = {}) {
  const error = new Error(message);
  error.name = 'ClinicRepeatError';
  error.code = code;
  error.status = status;
  error.extra = extra;
  return error;
}

export function isClinicRepeatError(error) {
  return Boolean(error && error.name === 'ClinicRepeatError');
}

function invalid(message, code = 'INVALID_INPUT') {
  return clinicRepeatError(code, message, 400);
}

function integerInRange(value, min, max) {
  const number = Number(value);
  return Number.isInteger(number) && number >= min && number <= max ? number : null;
}

// ---------------------------------------------------------------------------
// Schema availability (read-only; never creates tables)
// ---------------------------------------------------------------------------

const schemaCacheByEnv = new WeakMap();

function schemaCache(env) {
  let cache = schemaCacheByEnv.get(env);
  if (!cache) {
    cache = { tables: new Map(), columns: new Map() };
    schemaCacheByEnv.set(env, cache);
  }
  return cache;
}

const PROBE_PRESENT = 'present';
const PROBE_ABSENT = 'absent';
const PROBE_ERROR = 'error';

async function probeTable(env, tableName) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(String(tableName))) return PROBE_ERROR;
  const cache = schemaCache(env);
  if (cache.tables.has(tableName)) return PROBE_PRESENT;
  try {
    const row = await env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    ).bind(tableName).first();
    if (row?.name) {
      // Only positive results are cached so a later migration is observed.
      cache.tables.set(tableName, true);
      return PROBE_PRESENT;
    }
    return PROBE_ABSENT;
  } catch {
    // A failed probe is an unavailable read, never a genuine absence.
    return PROBE_ERROR;
  }
}

async function tableExists(env, tableName) {
  return (await probeTable(env, tableName)) === PROBE_PRESENT;
}

// Present / absent / probe-error for a PRAGMA read. Empty columns never mean
// "absent" on their own; only a successful PRAGMA may report absence.
async function probeColumns(env, tableName) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(String(tableName))) return { state: PROBE_ERROR, columns: new Set() };
  const cache = schemaCache(env);
  if (cache.columns.has(tableName)) return { state: PROBE_PRESENT, columns: cache.columns.get(tableName) };
  try {
    const result = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
    const columns = new Set((result.results || []).map(row => String(row.name || '')).filter(Boolean));
    if (!columns.size) return { state: PROBE_ABSENT, columns };
    cache.columns.set(tableName, columns);
    return { state: PROBE_PRESENT, columns };
  } catch {
    return { state: PROBE_ERROR, columns: new Set() };
  }
}

async function tableColumns(env, tableName) {
  return (await probeColumns(env, tableName)).columns;
}

export async function loadClinicRepeatAvailability(env) {
  const [policies, rounds] = await Promise.all([
    tableExists(env, 'clinic_repeat_policies'),
    tableExists(env, 'clinic_repeat_rounds'),
  ]);
  const missing = [];
  if (!policies) missing.push('clinic_repeat_policies');
  if (!rounds) missing.push('clinic_repeat_rounds');
  return { available: missing.length === 0, missing };
}

// ---------------------------------------------------------------------------
// Settings (explicit teacher choices only; no silent defaults)
// ---------------------------------------------------------------------------

function readDifficultyBuckets(input) {
  if (!Array.isArray(input) || !input.length) {
    throw invalid('난이도는 1~5 중 하나 이상 선택하세요.', 'INVALID_DIFFICULTY_BUCKETS');
  }
  const buckets = [];
  for (const value of input) {
    const bucket = integerInRange(value, 1, 5);
    if (bucket === null) throw invalid('난이도는 1~5 중에서 선택하세요.', 'INVALID_DIFFICULTY_BUCKETS');
    buckets.push(bucket);
  }
  const sorted = [...new Set(buckets)].sort((a, b) => a - b);
  if (sorted.length !== buckets.length) {
    throw invalid('난이도 선택에 중복된 값이 있습니다.', 'INVALID_DIFFICULTY_BUCKETS');
  }
  return sorted;
}

function readNote(input) {
  const note = text(input);
  if (note.length > 500) throw invalid('메모는 500자 이내로 입력하세요.', 'INVALID_NOTE');
  return note;
}

export function validateClinicRepeatSettings(input) {
  if (!plainObject(input)) throw invalid('반복 설정이 필요합니다.', 'SETTINGS_REQUIRED');
  for (const key of Object.keys(input)) {
    if (!SETTINGS_KEYS.has(key)) throw invalid(`허용되지 않은 설정 항목입니다: ${key}`, 'SETTINGS_UNKNOWN_KEY');
  }
  const cadenceDays = integerInRange(input.cadenceDays, 1, MAX_CADENCE_DAYS);
  if (cadenceDays === null) {
    throw invalid(`재추천 간격은 1~${MAX_CADENCE_DAYS}일 사이 정수로 직접 선택하세요.`, 'INVALID_CADENCE_DAYS');
  }
  const maxRounds = integerInRange(input.maxRounds, 1, MAX_ROUNDS_LIMIT);
  if (maxRounds === null) {
    throw invalid(`최대 회차는 1~${MAX_ROUNDS_LIMIT} 사이 정수로 직접 선택하세요.`, 'INVALID_MAX_ROUNDS');
  }
  if (typeof input.stopOnCompleteNoObservedWrongs !== 'boolean') {
    throw invalid('관측 오답 0일 때 종료할지 직접 선택하세요.', 'INVALID_STOP_ON_NO_WRONGS');
  }
  const settings = {
    schemaVersion: CLINIC_REPEAT_SETTINGS_SCHEMA,
    cadenceDays,
    maxRounds,
    stopOnCompleteNoObservedWrongs: input.stopOnCompleteNoObservedWrongs,
  };
  if (input.questionCount !== undefined) {
    const questionCount = integerInRange(input.questionCount, 1, MAX_QUESTIONS_PER_STUDENT);
    if (questionCount === null) {
      throw invalid(`문항 수는 1~${MAX_QUESTIONS_PER_STUDENT} 사이 정수로 입력하세요.`, 'INVALID_QUESTION_COUNT');
    }
    settings.questionCount = questionCount;
  }
  if (input.difficultyBuckets !== undefined) {
    settings.difficultyBuckets = readDifficultyBuckets(input.difficultyBuckets);
  }
  if (input.includeSeenQuestionUids !== undefined) {
    if (typeof input.includeSeenQuestionUids !== 'boolean') {
      throw invalid('이미 푼 문항 포함 여부를 직접 선택하세요.', 'INVALID_INCLUDE_SEEN');
    }
    settings.includeSeenQuestionUids = input.includeSeenQuestionUids;
  }
  if (input.note !== undefined) {
    const note = readNote(input.note);
    if (note) settings.note = note;
  }
  return Object.freeze(settings);
}

export function validateClinicRepeatCandidate(input) {
  if (input === undefined || input === null) return Object.freeze({});
  if (!plainObject(input)) throw invalid('회차 후보 조건이 올바르지 않습니다.', 'INVALID_CANDIDATE');
  for (const key of Object.keys(input)) {
    if (!CANDIDATE_KEYS.has(key)) throw invalid(`허용되지 않은 후보 항목입니다: ${key}`, 'CANDIDATE_UNKNOWN_KEY');
  }
  const candidate = {};
  if (input.questionCount !== undefined) {
    const questionCount = integerInRange(input.questionCount, 1, MAX_QUESTIONS_PER_STUDENT);
    if (questionCount === null) {
      throw invalid(`문항 수는 1~${MAX_QUESTIONS_PER_STUDENT} 사이 정수로 입력하세요.`, 'INVALID_QUESTION_COUNT');
    }
    candidate.questionCount = questionCount;
  }
  if (input.difficultyBuckets !== undefined) {
    candidate.difficultyBuckets = readDifficultyBuckets(input.difficultyBuckets);
  }
  if (input.includeSeenQuestionUids !== undefined) {
    if (typeof input.includeSeenQuestionUids !== 'boolean') {
      throw invalid('이미 푼 문항 포함 여부를 직접 선택하세요.', 'INVALID_INCLUDE_SEEN');
    }
    candidate.includeSeenQuestionUids = input.includeSeenQuestionUids;
  }
  if (input.mode !== undefined) {
    const mode = text(input.mode).toLowerCase();
    if (mode !== 'same_uid' && mode !== 'similar_uid') {
      throw invalid('회차 후속 방식을 선택하세요.', 'INVALID_CANDIDATE_MODE');
    }
    candidate.mode = mode;
  }
  if (input.note !== undefined) {
    const note = readNote(input.note);
    if (note) candidate.note = note;
  }
  return Object.freeze(candidate);
}

function storedSettings(policy) {
  const raw = policy?.settings_json ?? policy?.settingsJson;
  const parsed = parseJsonObject(raw);
  if (!parsed || parsed.schemaVersion !== CLINIC_REPEAT_SETTINGS_SCHEMA) return null;
  try {
    const { schemaVersion, ...rest } = parsed;
    return validateClinicRepeatSettings(rest);
  } catch {
    return null;
  }
}

export function settingsEqual(a, b) {
  return stableStringify(a || null) === stableStringify(b || null);
}

// ---------------------------------------------------------------------------
// Authorization
// ---------------------------------------------------------------------------

export async function isClassStudent(env, classId, studentId) {
  if (!classId || !studentId) return false;
  try {
    const row = await env.DB.prepare(
      'SELECT 1 FROM class_students WHERE class_id = ? AND student_id = ? LIMIT 1',
    ).bind(classId, studentId).first();
    return Boolean(row);
  } catch {
    return false;
  }
}

export async function authorizeClinicRepeatScope(env, teacher, classId, studentId) {
  if (!isStaffUser(teacher)) {
    return { error: { status: 403, code: 'FORBIDDEN', message: '선생님 권한이 필요합니다.' } };
  }
  if (!classId) {
    return { error: { status: 400, code: 'CLASS_REQUIRED', message: '반을 선택하세요.' } };
  }
  if (!(await canAccessClass(teacher, classId, env))) {
    return { error: { status: 403, code: 'CLASS_FORBIDDEN', message: '이 반을 확인할 권한이 없습니다.' } };
  }
  if (studentId) {
    if (!(await canAccessStudent(teacher, studentId, env))) {
      return { error: { status: 403, code: 'STUDENT_FORBIDDEN', message: '이 학생을 확인할 권한이 없습니다.' } };
    }
    if (!(await isClassStudent(env, classId, studentId))) {
      return { error: { status: 409, code: 'STUDENT_NOT_IN_CLASS', message: '현재 이 반에 소속된 학생이 아닙니다.' } };
    }
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Assignment evidence (existing rows only; no inference from titles/UIDs)
// ---------------------------------------------------------------------------

export function parseAssignmentMarker(mixedPayloadJson) {
  const payload = parseJsonObject(mixedPayloadJson);
  const marker = payload && plainObject(payload.meta?.clinicRecommendationAssessment)
    ? payload.meta.clinicRecommendationAssessment
    : null;
  if (!marker) return null;
  const kind = text(marker.kind).toUpperCase();
  const recommendationMode = text(marker.recommendationMode).toLowerCase();
  const questionUids = Array.isArray(marker.questionUids) ? marker.questionUids.map(text) : [];
  if (kind !== 'FOLLOW_UP') return null;
  if (!['same_uid', 'similar_uid'].includes(recommendationMode)) return null;
  if (!UUID_V4.test(text(marker.operationId))) return null;
  if (!SHA256_HEX.test(text(marker.signature))) return null;
  if (!questionUids.length || questionUids.some(uid => !/^qid_v1_[a-f0-9]{64}$/.test(uid))) return null;
  return {
    kind,
    recommendationMode,
    operationId: text(marker.operationId),
    signature: text(marker.signature).toLowerCase(),
    cohortIndex: Number(marker.cohortIndex),
    paperIndex: Number(marker.paperIndex),
    paperCount: Number(marker.paperCount),
    questionUids,
  };
}

function emptyEvidence(assignmentId, status, reason) {
  return {
    assignmentId,
    classId: '',
    examTitle: '',
    examDate: '',
    questionCount: 0,
    savedPaperId: null,
    archiveFile: '',
    cancelled: false,
    recipient: false,
    excluded: false,
    sessionId: null,
    sessionScore: null,
    sessionQuestionCount: 0,
    resultItemCount: 0,
    correctCount: 0,
    wrongCount: 0,
    minOrder: null,
    maxOrder: null,
    complete: false,
    observedWrongCount: null,
    status,
    reason,
    marker: null,
  };
}

function countExpression(columns) {
  const hasIsCorrect = columns.has('is_correct');
  const hasResultStatus = columns.has('result_status');
  const wrong = hasIsCorrect && hasResultStatus
    ? "CASE WHEN COALESCE(result_status,'') = 'wrong' OR COALESCE(is_correct,1) = 0 THEN 1 ELSE 0 END"
    : hasIsCorrect
      ? 'CASE WHEN COALESCE(is_correct,1) = 0 THEN 1 ELSE 0 END'
      : hasResultStatus
        ? "CASE WHEN COALESCE(result_status,'') = 'wrong' THEN 1 ELSE 0 END"
        : '0';
  const correct = hasIsCorrect && hasResultStatus
    ? "CASE WHEN COALESCE(result_status,'') = 'correct' OR COALESCE(is_correct,0) = 1 THEN 1 ELSE 0 END"
    : hasIsCorrect
      ? 'CASE WHEN COALESCE(is_correct,0) = 1 THEN 1 ELSE 0 END'
      : hasResultStatus
        ? "CASE WHEN COALESCE(result_status,'') = 'correct' THEN 1 ELSE 0 END"
        : '0';
  return { wrong, correct };
}

export async function loadAssignmentEvidenceBatch(env, {
  classId,
  studentId,
  assignmentIds,
  strict = false,
}) {
  const ids = unique(assignmentIds);
  if (!ids.length) return [];
  if (!classId || !studentId) throw invalid('반과 학생을 확인하세요.');

  const assignmentColumns = await tableColumns(env, 'class_exam_assignments');
  if (!assignmentColumns.size) {
    if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '시험 배정 조회를 사용할 수 없습니다.', 503);
    return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'ASSIGNMENT_TABLE_UNAVAILABLE'));
  }
  const select = ['id', 'class_id', 'exam_title', 'exam_date', 'question_count', 'archive_file'];
  if (assignmentColumns.has('saved_paper_id')) select.push('saved_paper_id');
  if (assignmentColumns.has('cancelled_at')) select.push('cancelled_at');
  if (assignmentColumns.has('mixed_payload_json')) select.push('mixed_payload_json');

  const placeholders = ids.map(() => '?').join(',');
  let assignmentRows = [];
  try {
    const result = await env.DB.prepare(
      `SELECT ${select.join(',')} FROM class_exam_assignments WHERE id IN (${placeholders})`,
    ).bind(...ids).all();
    assignmentRows = result.results || [];
  } catch (error) {
    if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '시험 배정 조회에 실패했습니다.', 503);
    return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'ASSIGNMENT_QUERY_FAILED'));
  }
  const byId = new Map(assignmentRows.map(row => [text(row.id), row]));

  const recipientProbe = await probeTable(env, 'class_exam_assignment_recipients');
  if (recipientProbe === PROBE_ERROR) {
    if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '수신 학생 근거를 확인할 수 없습니다.', 503);
    return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'RECIPIENT_PROBE_FAILED'));
  }
  let recipientSet = new Set();
  if (recipientProbe === PROBE_PRESENT) {
    try {
      const result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_recipients
         WHERE assignment_id IN (${placeholders}) AND student_id = ?`,
      ).bind(...ids, studentId).all();
      recipientSet = new Set((result.results || []).map(row => text(row.assignment_id)));
    } catch (error) {
      if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '수신 학생 조회에 실패했습니다.', 503);
      return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'RECIPIENT_QUERY_FAILED'));
    }
  } else {
    const member = await isClassStudent(env, classId, studentId);
    if (member) recipientSet = new Set(ids);
  }

  const exclusionProbe = await probeTable(env, 'class_exam_assignment_exclusions');
  if (exclusionProbe === PROBE_ERROR) {
    // Never substitute an empty exclusion set for an unread table.
    if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '배제 근거를 확인할 수 없습니다.', 503);
    return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'EXCLUSION_PROBE_FAILED'));
  }
  let excludedSet = new Set();
  if (exclusionProbe === PROBE_PRESENT) {
    try {
      const result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_exclusions
         WHERE assignment_id IN (${placeholders}) AND student_id = ?`,
      ).bind(...ids, studentId).all();
      excludedSet = new Set((result.results || []).map(row => text(row.assignment_id)));
    } catch {
      if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '배제 근거 조회에 실패했습니다.', 503);
      return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'EXCLUSION_QUERY_FAILED'));
    }
  }

  const sessionColumns = await tableColumns(env, 'exam_sessions');
  const sessionByAssignment = new Map();
  if (sessionColumns.size) {
    const sessionSelect = ['id', 'student_id', 'exam_title', 'exam_date', 'score', 'question_count'];
    if (sessionColumns.has('assignment_id')) sessionSelect.push('assignment_id');
    if (sessionColumns.has('archive_file')) sessionSelect.push('archive_file');
    if (sessionColumns.has('updated_at')) sessionSelect.push('updated_at');
    if (sessionColumns.has('created_at')) sessionSelect.push('created_at');
    const sessionOrder = [
      sessionColumns.has('updated_at') ? 'updated_at DESC' : '',
      sessionColumns.has('created_at') ? 'created_at DESC' : '',
    ].filter(Boolean).join(', ');
    const orderSql = sessionOrder ? ` ORDER BY ${sessionOrder}` : '';
    try {
      if (sessionColumns.has('assignment_id')) {
        const result = await env.DB.prepare(
          `SELECT ${sessionSelect.join(',')} FROM exam_sessions
           WHERE student_id = ? AND assignment_id IN (${placeholders})${orderSql}`,
        ).bind(studentId, ...ids).all();
        for (const row of result.results || []) {
          const key = text(row.assignment_id);
          if (key && !sessionByAssignment.has(key)) sessionByAssignment.set(key, row);
        }
      } else {
        const candidates = assignmentRows
          .map(row => ({ id: text(row.id), title: text(row.exam_title), date: text(row.exam_date), file: text(row.archive_file) }))
          .filter(row => row.title && row.date);
        if (candidates.length) {
          const result = await env.DB.prepare(
            `SELECT ${sessionSelect.join(',')} FROM exam_sessions
             WHERE student_id = ? AND exam_date IN (${candidates.map(() => '?').join(',')})${orderSql}`,
          ).bind(studentId, ...unique(candidates.map(row => row.date))).all();
          for (const row of result.results || []) {
            const match = candidates.find(candidate => candidate.title === text(row.exam_title) &&
              candidate.date === text(row.exam_date) &&
              candidate.file === text(row.archive_file));
            if (match && !sessionByAssignment.has(match.id)) sessionByAssignment.set(match.id, row);
          }
        }
      }
    } catch (error) {
      if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '응시 기록 조회에 실패했습니다.', 503);
      return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'SESSION_QUERY_FAILED'));
    }
  }

  const hasResultTable = await tableExists(env, 'assessment_result_items');
  const resultColumns = hasResultTable ? await tableColumns(env, 'assessment_result_items') : new Set();
  const aggregateBySession = new Map();
  const sessionIds = unique([...sessionByAssignment.values()].map(row => text(row.id)));
  if (hasResultTable && resultColumns.has('session_id') && resultColumns.has('order_no') && sessionIds.length) {
    const { wrong, correct } = countExpression(resultColumns);
    try {
      const result = await env.DB.prepare(
        `SELECT session_id,
                COUNT(*) AS total,
                COUNT(DISTINCT order_no) AS distinct_orders,
                MIN(order_no) AS min_order,
                MAX(order_no) AS max_order,
                SUM(${wrong}) AS wrong_count,
                SUM(${correct}) AS correct_count
         FROM assessment_result_items
         WHERE session_id IN (${sessionIds.map(() => '?').join(',')})
         GROUP BY session_id`,
      ).bind(...sessionIds).all();
      for (const row of result.results || []) {
        aggregateBySession.set(text(row.session_id), row);
      }
    } catch (error) {
      if (strict) throw clinicRepeatError('EVIDENCE_UNAVAILABLE', '응시 결과 조회에 실패했습니다.', 503);
      return ids.map(id => emptyEvidence(id, 'UNAVAILABLE', 'RESULT_QUERY_FAILED'));
    }
  }

  return assembleAssignmentEvidence({
    ids,
    byId,
    recipientSet,
    excludedSet,
    sessionByAssignment,
    aggregateBySession,
    classId,
  });
}

// Pure row mapping shared by the per-id batch read and the status bulk read so
// both paths can never disagree about what a stored row means.
function assembleAssignmentEvidence({
  ids,
  byId,
  recipientSet,
  excludedSet,
  sessionByAssignment,
  aggregateBySession,
  classId,
}) {
  return ids.map(assignmentId => {
    const row = byId.get(assignmentId);
    if (!row) return emptyEvidence(assignmentId, 'MISSING', 'ASSIGNMENT_NOT_FOUND');
    const evidence = emptyEvidence(assignmentId, 'MISSING', '');
    evidence.classId = text(row.class_id);
    evidence.examTitle = text(row.exam_title);
    evidence.examDate = text(row.exam_date);
    evidence.questionCount = Number(row.question_count || 0);
    evidence.savedPaperId = text(row.saved_paper_id) || null;
    evidence.archiveFile = text(row.archive_file);
    evidence.marker = parseAssignmentMarker(row.mixed_payload_json);
    if (evidence.classId !== text(classId)) {
      evidence.status = 'MISSING';
      evidence.reason = 'CLASS_MISMATCH';
      return evidence;
    }
    if (row.cancelled_at) {
      evidence.cancelled = true;
      evidence.status = 'CANCELLED';
      evidence.reason = 'ASSIGNMENT_CANCELLED';
      return evidence;
    }
    evidence.recipient = recipientSet.has(assignmentId);
    if (!evidence.recipient) {
      evidence.status = 'NOT_RECIPIENT';
      evidence.reason = 'STUDENT_NOT_RECIPIENT';
      return evidence;
    }
    if (excludedSet.has(assignmentId)) {
      evidence.excluded = true;
      evidence.status = 'EXCLUDED';
      evidence.reason = 'STUDENT_EXCLUDED';
      return evidence;
    }
    const session = sessionByAssignment.get(assignmentId);
    if (!session) {
      evidence.status = 'NOT_SUBMITTED';
      evidence.reason = 'NO_SESSION';
      return evidence;
    }
    evidence.sessionId = text(session.id) || null;
    evidence.sessionScore = session.score === null || session.score === undefined ? null : Number(session.score);
    evidence.sessionQuestionCount = Number(session.question_count || 0);
    const expected = evidence.questionCount || evidence.sessionQuestionCount;
    if (!expected || expected > MAX_QUESTIONS_PER_STUDENT) {
      evidence.status = 'PARTIAL';
      evidence.reason = 'UNKNOWN_QUESTION_COUNT';
      return evidence;
    }
    evidence.questionCount = expected;
    const aggregate = aggregateBySession.get(text(session.id));
    if (!aggregate) {
      evidence.status = 'LEGACY_NO_RESULT_ITEMS';
      evidence.reason = 'NO_RESULT_ITEMS';
      return evidence;
    }
    evidence.resultItemCount = Number(aggregate.total || 0);
    evidence.correctCount = Number(aggregate.correct_count || 0);
    evidence.wrongCount = Number(aggregate.wrong_count || 0);
    evidence.minOrder = aggregate.min_order === null || aggregate.min_order === undefined ? null : Number(aggregate.min_order);
    evidence.maxOrder = aggregate.max_order === null || aggregate.max_order === undefined ? null : Number(aggregate.max_order);
    const distinctOrders = Number(aggregate.distinct_orders || 0);
    const complete = evidence.resultItemCount === expected &&
      distinctOrders === expected &&
      evidence.minOrder === 1 &&
      evidence.maxOrder === expected &&
      evidence.wrongCount + evidence.correctCount === evidence.resultItemCount;
    if (!complete) {
      evidence.status = 'PARTIAL';
      evidence.reason = 'RESULT_ITEMS_INCOMPLETE';
      return evidence;
    }
    evidence.complete = true;
    evidence.observedWrongCount = evidence.wrongCount;
    evidence.status = 'COMPLETE';
    evidence.reason = 'COMPLETE';
    return evidence;
  });
}

export async function loadAssignmentEvidence(env, options = {}) {
  const rows = await loadAssignmentEvidenceBatch(env, {
    classId: options.classId,
    studentId: options.studentId,
    assignmentIds: [options.assignmentId],
    strict: options.strict === true,
  });
  return rows[0] || emptyEvidence(text(options.assignmentId), 'MISSING', 'ASSIGNMENT_NOT_FOUND');
}

export function compactEvidence(evidence) {
  if (!evidence) return null;
  return {
    assignmentId: text(evidence.assignmentId),
    status: text(evidence.status),
    complete: evidence.complete === true,
    questionCount: Number(evidence.questionCount || 0),
    resultItemCount: Number(evidence.resultItemCount || 0),
    wrongCount: Number(evidence.wrongCount || 0),
    observedWrongCount: evidence.observedWrongCount === null || evidence.observedWrongCount === undefined
      ? null
      : Number(evidence.observedWrongCount),
    sessionId: text(evidence.sessionId) || null,
    sessionScore: evidence.sessionScore === null || evidence.sessionScore === undefined ? null : Number(evidence.sessionScore),
    examDate: text(evidence.examDate),
    savedPaperId: text(evidence.savedPaperId) || null,
    cancelled: evidence.cancelled === true,
    recipient: evidence.recipient === true,
    excluded: evidence.excluded === true,
    reason: text(evidence.reason),
  };
}

export function aggregateRoundEvidence(evidenceRows) {
  const rows = Array.isArray(evidenceRows) ? evidenceRows : [];
  const statuses = rows.map(row => row.status);
  const firstOf = (...candidates) => rows.find(row => candidates.includes(row.status)) || null;
  let status = 'COMPLETE';
  if (!rows.length) status = 'MISSING';
  else if (statuses.includes('UNAVAILABLE')) status = 'UNAVAILABLE';
  else if (statuses.includes('MISSING')) status = 'MISSING';
  else if (statuses.includes('CANCELLED')) status = 'CANCELLED';
  else if (statuses.includes('EXCLUDED')) status = 'EXCLUDED';
  else if (statuses.includes('NOT_RECIPIENT')) status = 'NOT_RECIPIENT';
  else if (statuses.includes('NOT_SUBMITTED')) status = 'NOT_SUBMITTED';
  else if (statuses.includes('LEGACY_NO_RESULT_ITEMS')) status = 'LEGACY_NO_RESULT_ITEMS';
  else if (statuses.includes('PARTIAL')) status = 'PARTIAL';
  const complete = status === 'COMPLETE';
  return {
    status,
    complete,
    assignmentIds: rows.map(row => text(row.assignmentId)),
    questionCount: rows.reduce((sum, row) => sum + Number(row.questionCount || 0), 0),
    resultItemCount: rows.reduce((sum, row) => sum + Number(row.resultItemCount || 0), 0),
    wrongCount: rows.reduce((sum, row) => sum + Number(row.wrongCount || 0), 0),
    observedWrongCount: complete
      ? rows.reduce((sum, row) => sum + Number(row.observedWrongCount || 0), 0)
      : null,
    sessionIds: unique(rows.map(row => row.sessionId)),
    firstProblem: firstOf('UNAVAILABLE', 'MISSING', 'CANCELLED', 'EXCLUDED', 'NOT_RECIPIENT', 'NOT_SUBMITTED', 'LEGACY_NO_RESULT_ITEMS', 'PARTIAL'),
    rows: rows.map(compactEvidence),
  };
}

export function sourceIdentityFor(assignmentId, sessionId) {
  const assignment = text(assignmentId);
  const session = text(sessionId);
  return session ? `assignment:${assignment}|session:${session}` : `assignment:${assignment}`;
}

// ---------------------------------------------------------------------------
// Policy / round persistence helpers
// ---------------------------------------------------------------------------

export function mapPolicyRow(row) {
  if (!row) return null;
  return {
    policyId: text(row.id),
    classId: text(row.class_id),
    studentId: text(row.student_id),
    sourceAssignmentId: text(row.source_assignment_id),
    sourceSessionId: text(row.source_session_id) || null,
    status: text(row.status),
    revision: Number(row.revision || 1),
    settingsJson: text(row.settings_json),
    createdByTeacherId: text(row.created_by_teacher_id),
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
    closedAt: text(row.closed_at) || null,
    closedReason: text(row.closed_reason) || null,
    closedByTeacherId: text(row.closed_by_teacher_id) || null,
  };
}

export async function loadPolicyById(env, policyId) {
  if (!UUID_V4.test(text(policyId)) && !/^[A-Za-z0-9_-]{8,80}$/.test(text(policyId))) {
    throw invalid('정책 번호를 확인할 수 없습니다.', 'INVALID_POLICY_ID');
  }
  const row = await env.DB.prepare(
    'SELECT * FROM clinic_repeat_policies WHERE id = ? LIMIT 1',
  ).bind(policyId).first();
  return mapPolicyRow(row);
}

export async function findPolicyForSource(env, classId, studentId, sourceAssignmentId) {
  const row = await env.DB.prepare(
    `SELECT * FROM clinic_repeat_policies
     WHERE class_id = ? AND student_id = ? AND source_assignment_id = ?
     LIMIT 1`,
  ).bind(classId, studentId, sourceAssignmentId).first();
  return mapPolicyRow(row);
}

export function mapRoundRow(row) {
  if (!row) return null;
  return {
    roundId: text(row.id),
    policyId: text(row.policy_id),
    classId: text(row.class_id),
    studentId: text(row.student_id),
    roundNo: Number(row.round_no || 0),
    policyRevision: Number(row.policy_revision || 0),
    operationId: text(row.operation_id),
    status: text(row.status),
    settingsSnapshot: parseJsonObject(row.settings_snapshot_json),
    sourceEvidence: parseJsonObject(row.source_evidence_json),
    evidenceSignature: text(row.evidence_signature),
    candidateSummary: parseJsonObject(row.candidate_summary_json) || {},
    assignmentIds: parseJsonArray(row.assignment_ids_json).map(text).filter(Boolean),
    savedPaperIds: parseJsonArray(row.saved_paper_ids_json).map(text).filter(Boolean),
    attemptEvidence: parseJsonArray(row.attempt_evidence_json),
    confirmedByTeacherId: text(row.confirmed_by_teacher_id),
    confirmedAt: text(row.confirmed_at),
    reconciledAt: text(row.reconciled_at) || null,
    releasedAt: text(row.released_at) || null,
    statusReason: text(row.status_reason) || null,
    createdAt: text(row.created_at),
    updatedAt: text(row.updated_at),
  };
}

export async function loadRounds(env, policyId, limit = MAX_ROUNDS_LISTED) {
  const result = await env.DB.prepare(
    `SELECT * FROM clinic_repeat_rounds
     WHERE policy_id = ?
     ORDER BY round_no DESC
     LIMIT ?`,
  ).bind(policyId, Math.max(1, Math.min(MAX_ROUNDS_LISTED, Number(limit) || MAX_ROUNDS_LISTED))).all();
  return (result.results || []).map(mapRoundRow);
}

export async function loadRoundById(env, roundId) {
  const row = await env.DB.prepare(
    'SELECT * FROM clinic_repeat_rounds WHERE id = ? LIMIT 1',
  ).bind(roundId).first();
  return mapRoundRow(row);
}

export async function loadRoundByOperationId(env, operationId) {
  const row = await env.DB.prepare(
    'SELECT * FROM clinic_repeat_rounds WHERE operation_id = ? LIMIT 1',
  ).bind(operationId).first();
  return mapRoundRow(row);
}

export async function loadPoliciesForStudent(env, classId, studentId, limit = MAX_POLICIES_EVALUATED) {
  const result = await env.DB.prepare(
    `SELECT * FROM clinic_repeat_policies
     WHERE class_id = ? AND student_id = ?
     ORDER BY updated_at DESC, id DESC
     LIMIT ?`,
  ).bind(classId, studentId, Math.max(1, Math.min(MAX_POLICIES_EVALUATED, Number(limit) || MAX_POLICIES_EVALUATED))).all();
  return (result.results || []).map(mapPolicyRow);
}

export async function listPoliciesLight(env, classId, studentId) {
  const result = await env.DB.prepare(
    `SELECT p.*,
            (SELECT COUNT(*) FROM clinic_repeat_rounds r
              WHERE r.policy_id = p.id AND r.status <> 'RELEASED') AS rounds_used,
            (SELECT r.status FROM clinic_repeat_rounds r
              WHERE r.policy_id = p.id ORDER BY r.round_no DESC LIMIT 1) AS latest_round_status,
            (SELECT r.round_no FROM clinic_repeat_rounds r
              WHERE r.policy_id = p.id ORDER BY r.round_no DESC LIMIT 1) AS latest_round_no
     FROM clinic_repeat_policies p
     WHERE p.class_id = ? AND p.student_id = ?
     ORDER BY p.updated_at DESC, p.id DESC
     LIMIT ?`,
  ).bind(classId, studentId, MAX_POLICIES_LISTED).all();
  return (result.results || []).map(row => {
    const policy = mapPolicyRow(row);
    return {
      ...policy,
      sourceIdentity: sourceIdentityFor(policy.sourceAssignmentId, policy.sourceSessionId),
      settings: storedSettings(row),
      roundsUsed: Number(row.rounds_used || 0),
      latestRoundStatus: text(row.latest_round_status) || null,
      latestRoundNo: row.latest_round_no === null || row.latest_round_no === undefined
        ? null
        : Number(row.latest_round_no),
    };
  });
}

// ---------------------------------------------------------------------------
// Evaluation (teacher GET only; never a write, never a mastery claim)
// ---------------------------------------------------------------------------

// Status must never silently hide an older policy that still owns an open round.
// The supported evaluation set is the union of:
//  - the most recently updated policies (the historical 5-policy window),
//  - every policy with a RESERVED/UNRESOLVED round,
//  - active policies (bounded by MAX_POLICIES_LISTED).
// Truncation is reported so the UI can warn and refuse new policy creation.
export async function loadStatusPoliciesForStudent(env, classId, studentId) {
  const merged = new Map();
  const recent = await loadPoliciesForStudent(env, classId, studentId, MAX_POLICIES_EVALUATED);
  for (const policy of recent) merged.set(policy.policyId, policy);

  let openRoundPolicyIds = [];
  let openTruncated = false;
  try {
    const openRows = await env.DB.prepare(
      `SELECT DISTINCT p.* FROM clinic_repeat_rounds r
       JOIN clinic_repeat_policies p ON p.id = r.policy_id
       WHERE r.class_id = ? AND r.student_id = ?
         AND r.status IN ('RESERVED', 'UNRESOLVED')
       ORDER BY p.updated_at DESC, p.id DESC
       LIMIT ?`,
    ).bind(classId, studentId, MAX_POLICIES_LISTED).all();
    const rows = (openRows.results || []).map(mapPolicyRow);
    openRoundPolicyIds = rows.map(policy => policy.policyId);
    openTruncated = rows.length >= MAX_POLICIES_LISTED;
    for (const policy of rows) merged.set(policy.policyId, policy);
  } catch {
    // The runtime table is guaranteed by loadClinicRepeatAvailability, so a
    // read failure here must surface as a failed status read, not a short list.
    throw clinicRepeatError('STATUS_UNAVAILABLE', '열린 회차 정책을 확인할 수 없습니다. 잠시 후 다시 시도하세요.', 503);
  }

  let activeTruncated = false;
  try {
    const activeRows = await env.DB.prepare(
      `SELECT * FROM clinic_repeat_policies
       WHERE class_id = ? AND student_id = ? AND status = 'ACTIVE'
       ORDER BY updated_at DESC, id DESC
       LIMIT ?`,
    ).bind(classId, studentId, MAX_POLICIES_LISTED).all();
    const rows = (activeRows.results || []).map(mapPolicyRow);
    activeTruncated = rows.length >= MAX_POLICIES_LISTED;
    for (const policy of rows) merged.set(policy.policyId, policy);
  } catch {
    throw clinicRepeatError('STATUS_UNAVAILABLE', '반복 정책을 확인할 수 없습니다. 잠시 후 다시 시도하세요.', 503);
  }

  const policies = [...merged.values()].sort((a, b) =>
    String(b.updatedAt).localeCompare(String(a.updatedAt)) || String(b.policyId).localeCompare(String(a.policyId)));
  return {
    policies,
    truncated: openTruncated || activeTruncated,
    openRoundPolicyIds,
  };
}

// ---------------------------------------------------------------------------
// Status bulk evidence read (fixed D1 query count)
// ---------------------------------------------------------------------------
//
// GET /status used to run one rounds read plus up to three evidence batches for
// every listed policy: O(policies) D1 statements, which on the Free plan (50
// queries per invocation) fails as soon as a student owns a few policies. This
// read collects rounds for the listed policies with safe bind chunks and reads
// evidence for every referenced assignment with a fixed set of queries. Row
// meaning is produced by the same assembleAssignmentEvidence() used by the
// per-id batch path, so recipient/exclusion/session/result semantics (and their
// absent-vs-error distinction) are unchanged. Mutations never use this path.

const STATUS_ROUND_POLICY_CHUNK = 50;

const STATUS_RELEVANT_ASSIGNMENTS_SQL = `(
  SELECT rel.id FROM class_exam_assignments rel
  WHERE rel.class_id = ?
    AND (
      rel.id IN (
        SELECT p.source_assignment_id FROM clinic_repeat_policies p
        WHERE p.class_id = ? AND p.student_id = ?
      )
      OR rel.id IN (
        SELECT je.value FROM clinic_repeat_rounds r,
             json_each(CASE WHEN json_valid(r.assignment_ids_json) THEN r.assignment_ids_json ELSE '[]' END) je
        WHERE r.class_id = ? AND r.student_id = ?
          AND r.status IN ('RESERVED', 'UNRESOLVED', 'ISSUED')
      )
    )
)`;

function statusRelevantBinds(classId, studentId) {
  return [classId, classId, studentId, classId, studentId];
}

async function loadStatusRounds(env, policies) {
  const ids = unique(policies.map(policy => policy.policyId));
  const byPolicy = new Map();
  if (!ids.length) return byPolicy;
  const wanted = new Set(ids);
  for (let offset = 0; offset < ids.length; offset += STATUS_ROUND_POLICY_CHUNK) {
    const chunk = ids.slice(offset, offset + STATUS_ROUND_POLICY_CHUNK);
    let rows = [];
    try {
      const result = await env.DB.prepare(
        `SELECT * FROM clinic_repeat_rounds
         WHERE policy_id IN (${chunk.map(() => '?').join(',')})
         ORDER BY policy_id ASC, round_no DESC`,
      ).bind(...chunk).all();
      rows = result.results || [];
    } catch {
      throw clinicRepeatError('STATUS_UNAVAILABLE', '반복 회차를 확인할 수 없습니다. 잠시 후 다시 시도하세요.', 503);
    }
    for (const row of rows) {
      const round = mapRoundRow(row);
      if (!round || !wanted.has(round.policyId)) continue;
      const list = byPolicy.get(round.policyId) || [];
      if (list.length >= MAX_ROUNDS_LISTED) continue; // same cap as loadRounds()
      list.push(round);
      byPolicy.set(round.policyId, list);
    }
  }
  return byPolicy;
}

async function loadStatusEvidenceMap(env, { classId, studentId, assignmentIds }) {
  const ids = unique(assignmentIds);
  const unavailable = reason => new Map(ids.map(id => [id, emptyEvidence(id, 'UNAVAILABLE', reason)]));
  if (!ids.length) return new Map();

  const assignmentColumns = await tableColumns(env, 'class_exam_assignments');
  if (!assignmentColumns.size) return unavailable('ASSIGNMENT_TABLE_UNAVAILABLE');
  const select = ['id', 'class_id', 'exam_title', 'exam_date', 'question_count', 'archive_file']
    .map(column => `a.${column}`);
  if (assignmentColumns.has('saved_paper_id')) select.push('a.saved_paper_id');
  if (assignmentColumns.has('cancelled_at')) select.push('a.cancelled_at');
  if (assignmentColumns.has('mixed_payload_json')) select.push('a.mixed_payload_json');

  let assignmentRows = [];
  try {
    const result = await env.DB.prepare(
      `SELECT ${select.join(',')} FROM class_exam_assignments a
       WHERE a.id IN ${STATUS_RELEVANT_ASSIGNMENTS_SQL}`,
    ).bind(...statusRelevantBinds(classId, studentId)).all();
    assignmentRows = result.results || [];
  } catch {
    return unavailable('ASSIGNMENT_QUERY_FAILED');
  }
  const byId = new Map(assignmentRows.map(row => [text(row.id), row]));

  const recipientProbe = await probeTable(env, 'class_exam_assignment_recipients');
  if (recipientProbe === PROBE_ERROR) return unavailable('RECIPIENT_PROBE_FAILED');
  let recipientSet = new Set();
  if (recipientProbe === PROBE_PRESENT) {
    try {
      const result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_recipients
         WHERE student_id = ? AND assignment_id IN ${STATUS_RELEVANT_ASSIGNMENTS_SQL}`,
      ).bind(studentId, ...statusRelevantBinds(classId, studentId)).all();
      recipientSet = new Set((result.results || []).map(row => text(row.assignment_id)));
    } catch {
      return unavailable('RECIPIENT_QUERY_FAILED');
    }
  } else if (await isClassStudent(env, classId, studentId)) {
    for (const id of byId.keys()) recipientSet.add(id);
  }

  const exclusionProbe = await probeTable(env, 'class_exam_assignment_exclusions');
  if (exclusionProbe === PROBE_ERROR) return unavailable('EXCLUSION_PROBE_FAILED');
  let excludedSet = new Set();
  if (exclusionProbe === PROBE_PRESENT) {
    try {
      const result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_exclusions
         WHERE student_id = ? AND assignment_id IN ${STATUS_RELEVANT_ASSIGNMENTS_SQL}`,
      ).bind(studentId, ...statusRelevantBinds(classId, studentId)).all();
      excludedSet = new Set((result.results || []).map(row => text(row.assignment_id)));
    } catch {
      return unavailable('EXCLUSION_QUERY_FAILED');
    }
  }

  const sessionColumns = await tableColumns(env, 'exam_sessions');
  const sessionByAssignment = new Map();
  if (sessionColumns.size) {
    const sessionSelect = ['id', 'student_id', 'exam_title', 'exam_date', 'score', 'question_count'];
    if (sessionColumns.has('assignment_id')) sessionSelect.push('assignment_id');
    if (sessionColumns.has('archive_file')) sessionSelect.push('archive_file');
    if (sessionColumns.has('updated_at')) sessionSelect.push('updated_at');
    if (sessionColumns.has('created_at')) sessionSelect.push('created_at');
    const sessionOrder = [
      sessionColumns.has('updated_at') ? 'updated_at DESC' : '',
      sessionColumns.has('created_at') ? 'created_at DESC' : '',
    ].filter(Boolean).join(', ');
    const orderSql = sessionOrder ? ` ORDER BY ${sessionOrder}` : '';
    try {
      if (sessionColumns.has('assignment_id')) {
        const result = await env.DB.prepare(
          `SELECT ${sessionSelect.join(',')} FROM exam_sessions
           WHERE student_id = ? AND assignment_id IN ${STATUS_RELEVANT_ASSIGNMENTS_SQL}${orderSql}`,
        ).bind(studentId, ...statusRelevantBinds(classId, studentId)).all();
        for (const row of result.results || []) {
          const key = text(row.assignment_id);
          if (key && !sessionByAssignment.has(key)) sessionByAssignment.set(key, row);
        }
      } else {
        // Legacy schema: one student-scoped read superset is matched in JS by
        // title/date/archive file, exactly like the per-id batch fallback.
        const candidates = assignmentRows
          .map(row => ({ id: text(row.id), title: text(row.exam_title), date: text(row.exam_date), file: text(row.archive_file) }))
          .filter(row => row.title && row.date);
        const result = await env.DB.prepare(
          `SELECT ${sessionSelect.join(',')} FROM exam_sessions
           WHERE student_id = ?${orderSql}`,
        ).bind(studentId).all();
        for (const row of result.results || []) {
          const match = candidates.find(candidate => candidate.title === text(row.exam_title) &&
            candidate.date === text(row.exam_date) &&
            candidate.file === text(row.archive_file));
          if (match && !sessionByAssignment.has(match.id)) sessionByAssignment.set(match.id, row);
        }
      }
    } catch {
      return unavailable('SESSION_QUERY_FAILED');
    }
  }

  const hasResultTable = await tableExists(env, 'assessment_result_items');
  const resultColumns = hasResultTable ? await tableColumns(env, 'assessment_result_items') : new Set();
  const aggregateBySession = new Map();
  if (hasResultTable && resultColumns.has('session_id') && resultColumns.has('order_no') && sessionByAssignment.size) {
    const { wrong, correct } = countExpression(resultColumns);
    const sessionScope = sessionColumns.has('assignment_id')
      ? `SELECT id FROM exam_sessions WHERE student_id = ? AND assignment_id IN ${STATUS_RELEVANT_ASSIGNMENTS_SQL}`
      : 'SELECT id FROM exam_sessions WHERE student_id = ?';
    const binds = sessionColumns.has('assignment_id')
      ? [studentId, ...statusRelevantBinds(classId, studentId)]
      : [studentId];
    try {
      const result = await env.DB.prepare(
        `SELECT session_id,
                COUNT(*) AS total,
                COUNT(DISTINCT order_no) AS distinct_orders,
                MIN(order_no) AS min_order,
                MAX(order_no) AS max_order,
                SUM(${wrong}) AS wrong_count,
                SUM(${correct}) AS correct_count
         FROM assessment_result_items
         WHERE session_id IN (${sessionScope})
         GROUP BY session_id`,
      ).bind(...binds).all();
      for (const row of result.results || []) {
        aggregateBySession.set(text(row.session_id), row);
      }
    } catch {
      return unavailable('RESULT_QUERY_FAILED');
    }
  }

  const assembled = assembleAssignmentEvidence({
    ids,
    byId,
    recipientSet,
    excludedSet,
    sessionByAssignment,
    aggregateBySession,
    classId,
  });
  return new Map(assembled.map(row => [row.assignmentId, row]));
}

// Status evaluates every listed policy with set-based evidence reads. A single
// policy keeps the exact per-policy read path that mutations use.
export async function evaluateClinicRepeatPoliciesForStatus(env, policies, options = {}) {
  const list = (Array.isArray(policies) ? policies : []).filter(policy => policy && text(policy.policyId));
  if (!list.length) return [];
  const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  if (list.length === 1) {
    return [await evaluateClinicRepeatPolicy(env, list[0], { strict: false, nowMs })];
  }
  const classId = text(options.classId) || text(list[0].classId);
  const studentId = text(options.studentId) || text(list[0].studentId);
  if (!classId || !studentId) {
    throw clinicRepeatError('STATUS_UNAVAILABLE', '반복 정책 범위를 확인할 수 없습니다. 잠시 후 다시 시도하세요.', 503);
  }

  const roundsByPolicy = await loadStatusRounds(env, list);
  const requested = new Set();
  for (const policy of list) {
    const rounds = roundsByPolicy.get(policy.policyId) || [];
    if (storedSettings(policy)) {
      const sourceId = text(policy.sourceAssignmentId);
      if (sourceId) requested.add(sourceId);
    }
    const openRound = rounds.find(round => round.status === ROUND_STATUS.RESERVED || round.status === ROUND_STATUS.UNRESOLVED) || null;
    const latestIssued = rounds.find(round => round.status === ROUND_STATUS.ISSUED) || null;
    for (const round of [openRound, latestIssued]) {
      if (!round) continue;
      for (const id of round.assignmentIds) requested.add(id);
    }
  }
  const evidenceMap = await loadStatusEvidenceMap(env, {
    classId,
    studentId,
    assignmentIds: [...requested],
  });

  const evaluated = [];
  for (const policy of list) {
    evaluated.push(await evaluateClinicRepeatPolicy(env, policy, {
      strict: false,
      nowMs,
      rounds: roundsByPolicy.get(policy.policyId) || [],
      evidenceMap,
    }));
  }
  return evaluated;
}

function cadenceAnchor(policy, rounds) {
  const issued = rounds.find(round => round.status === ROUND_STATUS.ISSUED);
  const anchor = issued?.confirmedAt || policy.createdAt;
  const parsed = Date.parse(anchor);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function nextEligibleIso(policy, rounds, settings) {
  const anchorMs = cadenceAnchor(policy, rounds);
  return new Date(anchorMs + settings.cadenceDays * DAY_MS).toISOString();
}

function closedEvaluation(reasonCode, extra = {}) {
  return {
    state: EVALUATION_STATE.CLOSED,
    reasonCode,
    label: REASON_LABELS[reasonCode] || REASON_LABELS.MANUAL_STOP,
    canReserve: false,
    nextEligibleAt: null,
    allowedActions: extra.allowedActions || ['REOPEN_POLICY'],
    ...extra,
  };
}

function needsCheck(reasonCode, extra = {}) {
  return {
    state: EVALUATION_STATE.NEEDS_CHECK,
    reasonCode,
    label: REASON_LABELS[reasonCode] || REASON_LABELS.SOURCE_UNAVAILABLE,
    canReserve: false,
    nextEligibleAt: null,
    allowedActions: extra.allowedActions || ['EDIT_SETTINGS', 'CLOSE_MANUALLY'],
    ...extra,
  };
}

export async function evaluateClinicRepeatPolicy(env, policy, options = {}) {
  const nowMs = Number.isFinite(options.nowMs) ? options.nowMs : Date.now();
  const strict = options.strict === true;
  const settings = storedSettings(policy);
  // Status may pass preloaded rounds/evidence so the whole list is evaluated
  // without a per-policy D1 read. Mutations never pass these options.
  const rounds = Array.isArray(options.rounds) ? options.rounds : await loadRounds(env, policy.policyId);
  const evidenceMap = options.evidenceMap instanceof Map ? options.evidenceMap : null;
  const preloadedEvidence = assignmentId => {
    const key = text(assignmentId);
    return evidenceMap && evidenceMap.has(key)
      ? evidenceMap.get(key)
      : emptyEvidence(key, 'MISSING', 'ASSIGNMENT_NOT_FOUND');
  };
  const preloadedRoundEvidence = assignmentIds => aggregateRoundEvidence(assignmentIds.map(preloadedEvidence));
  const roundsUsed = rounds.filter(round => round.status !== ROUND_STATUS.RELEASED).length;
  const openRound = rounds.find(round => round.status === ROUND_STATUS.RESERVED || round.status === ROUND_STATUS.UNRESOLVED) || null;
  const latestIssued = rounds.find(round => round.status === ROUND_STATUS.ISSUED) || null;

  const [sourceEvidence, openRoundEvidence, latestIssuedEvidence] = await Promise.all([
    settings
      ? (evidenceMap
        ? Promise.resolve(preloadedEvidence(policy.sourceAssignmentId))
        : loadAssignmentEvidence(env, {
          classId: policy.classId,
          studentId: policy.studentId,
          assignmentId: policy.sourceAssignmentId,
          strict,
        }))
      : Promise.resolve(null),
    openRound && openRound.assignmentIds.length
      ? (evidenceMap
        ? Promise.resolve(preloadedRoundEvidence(openRound.assignmentIds))
        : loadAssignmentEvidenceBatch(env, {
          classId: policy.classId,
          studentId: policy.studentId,
          assignmentIds: openRound.assignmentIds,
          strict,
        }).then(aggregateRoundEvidence))
      : Promise.resolve(null),
    latestIssued && latestIssued.assignmentIds.length
      ? (evidenceMap
        ? Promise.resolve(preloadedRoundEvidence(latestIssued.assignmentIds))
        : loadAssignmentEvidenceBatch(env, {
          classId: policy.classId,
          studentId: policy.studentId,
          assignmentIds: latestIssued.assignmentIds,
          strict,
        }).then(aggregateRoundEvidence))
      : Promise.resolve(null),
  ]);

  let evaluation;
  let relevant = 'SOURCE';

  if (!settings) {
    evaluation = needsCheck('SETTINGS_INVALID', {
      allowedActions: policy.status === POLICY_STATUS.CLOSED ? ['REOPEN_POLICY'] : ['EDIT_SETTINGS', 'CLOSE_MANUALLY'],
    });
  } else if (policy.status === POLICY_STATUS.CLOSED) {
    evaluation = closedEvaluation(policy.closedReason || 'MANUAL_STOP');
    if (openRound) {
      // A legacy/edge state: a closed policy still owns an open round. Keep it
      // visible and actionable instead of hiding recovery until reopen.
      evaluation.openRound = compactRound(openRound);
      evaluation.openRoundEvidence = openRoundEvidence ? compactRoundEvidence(openRoundEvidence) : null;
      evaluation.allowedActions = ['RECONCILE_ROUND', 'MARK_ROUND_UNRESOLVED', 'RELEASE_ROUND', 'REOPEN_POLICY'];
      evaluation.openRoundNotice = 'CLOSED_POLICY_OPEN_ROUND';
    }
  } else if (openRound) {
    const roundReason = openRound.status === ROUND_STATUS.RESERVED
      ? 'OPEN_ROUND_RESERVED'
      : 'ROUND_OUTCOME_UNRESOLVED';
    evaluation = needsCheck(roundReason, {
      allowedActions: openRound.status === ROUND_STATUS.RESERVED
        ? ['RECONCILE_ROUND', 'MARK_ROUND_UNRESOLVED', 'RELEASE_ROUND']
        : ['RECONCILE_ROUND'],
      openRound: compactRound(openRound),
      openRoundEvidence: openRoundEvidence ? compactRoundEvidence(openRoundEvidence) : null,
    });
  } else {
    if (latestIssued) {
      relevant = 'ROUND';
      if (!latestIssuedEvidence || latestIssuedEvidence.status !== 'COMPLETE') {
        const status = latestIssuedEvidence?.status || 'MISSING';
        evaluation = needsCheck(ROUND_STATUS_REASON[status] || 'ROUND_ATTEMPT_UNAVAILABLE', {
          allowedActions: ['EDIT_SETTINGS', 'CLOSE_MANUALLY'],
          latestRound: compactRound(latestIssued),
        });
      } else if (settings.stopOnCompleteNoObservedWrongs && latestIssuedEvidence.observedWrongCount === 0) {
        evaluation = closedEvaluation('NO_OBSERVED_WRONGS', {
          allowedActions: ['EDIT_SETTINGS', 'CLOSE_MANUALLY'],
          closureEvidence: compactRoundEvidence(latestIssuedEvidence),
          closureNote: '관측 오답 0은 숙련 완료 판정이 아닙니다.',
        });
      }
    } else if (!sourceEvidence || sourceEvidence.status !== 'COMPLETE') {
      const status = sourceEvidence?.status || 'MISSING';
      evaluation = needsCheck(SOURCE_STATUS_REASON[status] || 'SOURCE_UNAVAILABLE');
    } else if (settings.stopOnCompleteNoObservedWrongs && sourceEvidence.observedWrongCount === 0) {
      evaluation = closedEvaluation('NO_OBSERVED_WRONGS', {
        allowedActions: ['EDIT_SETTINGS', 'CLOSE_MANUALLY'],
        closureEvidence: compactEvidence(sourceEvidence),
        closureNote: '관측 오답 0은 숙련 완료 판정이 아닙니다.',
      });
    }

    if (!evaluation) {
      if (roundsUsed >= settings.maxRounds) {
        evaluation = closedEvaluation('MAX_ROUNDS', {
          // Not persisted: raising maxRounds in settings reopens the policy.
          allowedActions: ['EDIT_SETTINGS', 'CLOSE_MANUALLY'],
          roundsUsed,
          maxRounds: settings.maxRounds,
        });
      } else {
        const nextEligibleAt = nextEligibleIso(policy, rounds, settings);
        if (nowMs < Date.parse(nextEligibleAt)) {
          evaluation = {
            state: EVALUATION_STATE.WAITING_CADENCE,
            reasonCode: 'WAITING_CADENCE',
            label: REASON_LABELS.WAITING_CADENCE,
            canReserve: false,
            nextEligibleAt,
            roundsUsed,
            maxRounds: settings.maxRounds,
            allowedActions: ['EDIT_SETTINGS', 'CLOSE_MANUALLY'],
          };
        } else {
          evaluation = {
            state: EVALUATION_STATE.CONFIRMATION_NEEDED,
            reasonCode: 'CONFIRMATION_NEEDED',
            label: REASON_LABELS.CONFIRMATION_NEEDED,
            canReserve: true,
            nextEligibleAt,
            roundsUsed,
            maxRounds: settings.maxRounds,
            allowedActions: ['RESERVE_ROUND', 'EDIT_SETTINGS', 'CLOSE_MANUALLY'],
          };
        }
      }
    }
  }

  const evidencePayload = {
    schema: CLINIC_REPEAT_EVIDENCE_SCHEMA,
    policyId: policy.policyId,
    revision: policy.revision,
    sourceAssignmentId: policy.sourceAssignmentId,
    settings,
    relevant,
    source: compactEvidence(sourceEvidence),
    openRound: openRound ? {
      roundNo: openRound.roundNo,
      status: openRound.status,
      operationId: openRound.operationId,
      assignmentIds: openRound.assignmentIds,
      evidence: openRoundEvidence ? compactRoundEvidence(openRoundEvidence) : null,
    } : null,
    latestIssued: latestIssued ? {
      roundNo: latestIssued.roundNo,
      operationId: latestIssued.operationId,
      assignmentIds: latestIssued.assignmentIds,
      confirmedAt: latestIssued.confirmedAt,
      evidence: latestIssuedEvidence ? compactRoundEvidence(latestIssuedEvidence) : null,
    } : null,
    roundsUsed,
  };
  const evidenceSignature = await sha256hex(stableStringify(evidencePayload));

  return {
    contractVersion: CLINIC_REPEAT_CONTRACT,
    policy: {
      ...policy,
      sourceIdentity: sourceIdentityFor(policy.sourceAssignmentId, policy.sourceSessionId),
      settings,
    },
    rounds: rounds.map(compactRound),
    evaluation: {
      ...evaluation,
      roundsUsed,
      maxRounds: settings?.maxRounds ?? null,
      evidenceSignature,
      relevant,
      source: compactEvidence(sourceEvidence),
      openRound: openRound ? compactRound(openRound) : null,
      latestRound: latestIssued ? compactRound(latestIssued) : null,
    },
  };
}

function compactRound(round) {
  if (!round) return null;
  return {
    roundId: round.roundId,
    roundNo: round.roundNo,
    status: round.status,
    operationId: round.operationId,
    policyRevision: round.policyRevision,
    assignmentIds: round.assignmentIds,
    savedPaperIds: round.savedPaperIds,
    confirmedAt: round.confirmedAt,
    reconciledAt: round.reconciledAt,
    releasedAt: round.releasedAt,
    statusReason: round.statusReason,
    candidateSummary: round.candidateSummary,
  };
}

function compactRoundEvidence(aggregate) {
  if (!aggregate) return null;
  return {
    status: aggregate.status,
    complete: aggregate.complete,
    assignmentIds: aggregate.assignmentIds,
    questionCount: aggregate.questionCount,
    resultItemCount: aggregate.resultItemCount,
    wrongCount: aggregate.wrongCount,
    observedWrongCount: aggregate.observedWrongCount,
    sessionIds: aggregate.sessionIds,
    rows: aggregate.rows,
  };
}

// ---------------------------------------------------------------------------
// Round reservation (explicit teacher confirmation only)
// ---------------------------------------------------------------------------

export function validateOperationId(value) {
  const operationId = text(value);
  if (!UUID_V4.test(operationId)) throw invalid('회차 작업 번호가 올바르지 않습니다.', 'INVALID_OPERATION_ID');
  return operationId;
}

export function validateExpectedRevision(value) {
  const revision = integerInRange(value, 1, Number.MAX_SAFE_INTEGER);
  if (revision === null) throw invalid('정책 revision을 확인할 수 없습니다.', 'INVALID_REVISION');
  return revision;
}

export function validateEvidenceSignature(value) {
  const signature = text(value).toLowerCase();
  if (!SHA256_HEX.test(signature)) throw invalid('확인할 결과 서명이 없습니다.', 'INVALID_EVIDENCE_SIGNATURE');
  return signature;
}

// ---------------------------------------------------------------------------
// Issued assignment verification (server rows are the only authority)
// ---------------------------------------------------------------------------

function extractAssignmentBatchId(archiveFile, savedPaperId) {
  const prefix = `MIXED:archive2-saved-${savedPaperId}-`;
  const file = text(archiveFile);
  if (!file.startsWith(prefix)) return null;
  const batchId = file.slice(prefix.length);
  return batchId ? batchId : null;
}

export async function verifyIssuedRoundAssignments(env, {
  teacher,
  policy,
  round,
  assignmentIds,
}) {
  const ids = unique(assignmentIds);
  if (!ids.length || ids.length > MAX_PAPERS_PER_ROUND) {
    throw clinicRepeatError('INVALID_ASSIGNMENT_LIST', `배정은 1~${MAX_PAPERS_PER_ROUND}개까지 연결할 수 있습니다.`, 400);
  }
  if (ids.includes(policy.sourceAssignmentId)) {
    throw clinicRepeatError('SELF_REFERENCE', '기준 시험 자체를 반복 회차로 연결할 수 없습니다.', 409);
  }

  const assignmentColumns = await tableColumns(env, 'class_exam_assignments');
  if (!assignmentColumns.size || !assignmentColumns.has('saved_paper_id')) {
    throw clinicRepeatError('RECONCILE_UNSUPPORTED', '배정 출처를 확인할 수 없는 환경입니다.', 409);
  }
  const select = ['id', 'class_id', 'exam_title', 'exam_date', 'question_count', 'archive_file', 'saved_paper_id'];
  if (assignmentColumns.has('cancelled_at')) select.push('cancelled_at');
  if (assignmentColumns.has('mixed_payload_json')) select.push('mixed_payload_json');
  if (!assignmentColumns.has('mixed_payload_json')) {
    throw clinicRepeatError('RECONCILE_UNSUPPORTED', '배정 출처 표시를 확인할 수 없는 환경입니다.', 409);
  }

  let assignmentRows = [];
  try {
    const result = await env.DB.prepare(
      `SELECT ${select.join(',')} FROM class_exam_assignments WHERE id IN (${ids.map(() => '?').join(',')})`,
    ).bind(...ids).all();
    assignmentRows = result.results || [];
  } catch {
    throw clinicRepeatError('RECONCILE_UNAVAILABLE', '배정 확인에 실패했습니다. 잠시 후 다시 확인하세요.', 503);
  }
  if (assignmentRows.length !== ids.length) {
    throw clinicRepeatError('ASSIGNMENT_NOT_FOUND', '연결할 배정을 찾을 수 없습니다.', 409, { assignmentIds: ids });
  }
  const byId = new Map(assignmentRows.map(row => [text(row.id), row]));

  const recipientProbe = await probeTable(env, 'class_exam_assignment_recipients');
  if (recipientProbe === PROBE_ERROR) {
    throw clinicRepeatError('RECONCILE_UNAVAILABLE', '수신 학생 근거를 확인할 수 없습니다. 잠시 후 다시 확인하세요.', 503);
  }
  const recipientSet = new Set();
  if (recipientProbe === PROBE_PRESENT) {
    let result;
    try {
      result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_recipients
         WHERE assignment_id IN (${ids.map(() => '?').join(',')}) AND student_id = ?`,
      ).bind(...ids, policy.studentId).all();
    } catch {
      throw clinicRepeatError('RECONCILE_UNAVAILABLE', '수신 학생 조회에 실패했습니다. 잠시 후 다시 확인하세요.', 503);
    }
    for (const row of result.results || []) recipientSet.add(text(row.assignment_id));
  } else if (await isClassStudent(env, policy.classId, policy.studentId)) {
    ids.forEach(id => recipientSet.add(id));
  }

  const exclusionProbe = await probeTable(env, 'class_exam_assignment_exclusions');
  if (exclusionProbe === PROBE_ERROR) {
    throw clinicRepeatError('RECONCILE_UNAVAILABLE', '배제 근거를 확인할 수 없습니다. 잠시 후 다시 확인하세요.', 503);
  }
  const excludedSet = new Set();
  if (exclusionProbe === PROBE_PRESENT) {
    let result;
    try {
      result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_exclusions
         WHERE assignment_id IN (${ids.map(() => '?').join(',')}) AND student_id = ?`,
      ).bind(...ids, policy.studentId).all();
    } catch {
      throw clinicRepeatError('RECONCILE_UNAVAILABLE', '배제 근거 조회에 실패했습니다. 잠시 후 다시 확인하세요.', 503);
    }
    for (const row of result.results || []) excludedSet.add(text(row.assignment_id));
  }

  const savedPaperColumns = await tableColumns(env, 'archive_saved_papers');
  if (!savedPaperColumns.size) {
    throw clinicRepeatError('RECONCILE_UNSUPPORTED', '저장 시험지를 확인할 수 없는 환경입니다.', 409);
  }
  const savedPaperIds = unique(assignmentRows.map(row => text(row.saved_paper_id)));
  if (!savedPaperIds.length || savedPaperIds.some(id => !id)) {
    throw clinicRepeatError('ASSIGNMENT_SOURCE_MISSING', '배정의 저장 시험지 출처를 확인할 수 없습니다.', 409);
  }
  let savedPaperRows = [];
  try {
    const result = await env.DB.prepare(
      `SELECT id, owner_teacher_id, part_index, part_count, title, question_count, snapshot_json, snapshot_hash
       FROM archive_saved_papers
       WHERE id IN (${savedPaperIds.map(() => '?').join(',')})`,
    ).bind(...savedPaperIds).all();
    savedPaperRows = result.results || [];
  } catch {
    throw clinicRepeatError('RECONCILE_UNAVAILABLE', '저장 시험지 확인에 실패했습니다.', 503);
  }
  if (savedPaperRows.length !== savedPaperIds.length) {
    throw clinicRepeatError('SAVED_PAPER_NOT_FOUND', '연결된 저장 시험지를 찾을 수 없습니다.', 409);
  }
  const savedPaperById = new Map(savedPaperRows.map(row => [text(row.id), row]));

  // A saved paper is usable by its owner, an admin, or any teacher who currently
  // teaches the policy class. The class scope is re-checked here so a saved paper
  // cannot be pulled in from an unrelated class even if the id leaks.
  let teacherCanUseClassPapers = false;
  try {
    teacherCanUseClassPapers = await canAccessClass(teacher, policy.classId, env);
  } catch {
    teacherCanUseClassPapers = false;
  }

  const markers = [];
  const examDates = new Set();
  const titles = new Set();
  for (const assignmentId of ids) {
    const row = byId.get(assignmentId);
    if (text(row.class_id) !== policy.classId) {
      throw clinicRepeatError('ASSIGNMENT_CLASS_MISMATCH', '다른 반의 배정은 연결할 수 없습니다.', 409, { assignmentId });
    }
    if (row.cancelled_at) {
      throw clinicRepeatError('ASSIGNMENT_CANCELLED', '취소된 배정은 회차로 연결할 수 없습니다.', 409, { assignmentId });
    }
    if (!recipientSet.has(assignmentId)) {
      throw clinicRepeatError('STUDENT_NOT_RECIPIENT', '이 학생에게 배정된 시험이 아닙니다.', 409, { assignmentId });
    }
    if (excludedSet.has(assignmentId)) {
      throw clinicRepeatError('STUDENT_EXCLUDED', '이 학생이 제외된 배정은 연결할 수 없습니다.', 409, { assignmentId });
    }
    const savedPaperId = text(row.saved_paper_id);
    const savedPaper = savedPaperById.get(savedPaperId);
    if (!savedPaper) {
      throw clinicRepeatError('SAVED_PAPER_NOT_FOUND', '연결된 저장 시험지를 찾을 수 없습니다.', 409, { assignmentId });
    }
    if (text(savedPaper.owner_teacher_id) !== text(teacher?.id) && !teacherCanUseClassPapers) {
      throw clinicRepeatError('SAVED_PAPER_OWNER_MISMATCH', '이 반에서 사용할 수 없는 저장 시험지입니다.', 409, { assignmentId });
    }
    if (!extractAssignmentBatchId(row.archive_file, savedPaperId)) {
      throw clinicRepeatError('ASSIGNMENT_SOURCE_MISMATCH', '배정의 저장 시험지 출처가 일치하지 않습니다.', 409, { assignmentId });
    }
    const marker = parseAssignmentMarker(row.mixed_payload_json);
    if (!marker) {
      throw clinicRepeatError('ASSIGNMENT_MARKER_MISSING', '추천 보충시험 출처 표시가 없는 배정입니다.', 409, { assignmentId });
    }
    const snapshot = parseJsonObject(savedPaper.snapshot_json);
    const snapshotMarker = snapshot && plainObject(snapshot.meta?.clinicRecommendationAssessment)
      ? snapshot.meta.clinicRecommendationAssessment
      : null;
    if (!snapshotMarker) {
      throw clinicRepeatError('SAVED_PAPER_MARKER_MISSING', '저장 시험지의 추천 출처 표시를 확인할 수 없습니다.', 409, { assignmentId });
    }
    const snapshotUids = Array.isArray(snapshotMarker.questionUids) ? snapshotMarker.questionUids.map(text) : [];
    if (stableStringify(snapshotUids) !== stableStringify(marker.questionUids) ||
        text(snapshotMarker.operationId) !== marker.operationId ||
        text(snapshotMarker.signature).toLowerCase() !== marker.signature ||
        text(snapshotMarker.recommendationMode).toLowerCase() !== marker.recommendationMode ||
        Number(snapshotMarker.cohortIndex) !== marker.cohortIndex ||
        Number(snapshotMarker.paperIndex) !== marker.paperIndex ||
        Number(snapshotMarker.paperCount) !== marker.paperCount) {
      throw clinicRepeatError('ASSIGNMENT_MARKER_MISMATCH', '배정과 저장 시험지의 출처가 일치하지 않습니다.', 409, { assignmentId });
    }
    if (marker.operationId !== round.operationId) {
      throw clinicRepeatError('FOREIGN_OPERATION', '다른 회차 작업의 배정은 연결할 수 없습니다.', 409, { assignmentId });
    }
    if (Number(row.question_count) !== marker.questionUids.length ||
        Number(savedPaper.question_count) !== marker.questionUids.length) {
      throw clinicRepeatError('ASSIGNMENT_QUESTION_COUNT_MISMATCH', '배정 문항 수와 출처 문항 수가 일치하지 않습니다.', 409, { assignmentId });
    }
    examDates.add(text(row.exam_date));
    titles.add(text(row.exam_title));
    markers.push({ assignmentId, savedPaperId, marker, row, savedPaper });
  }

  if (examDates.size !== 1) {
    throw clinicRepeatError('ASSIGNMENT_DATE_MISMATCH', '같은 회차 배정의 시험 날짜가 서로 다릅니다.', 409);
  }
  const paperCounts = new Set(markers.map(entry => entry.marker.paperCount));
  const cohortIndexes = new Set(markers.map(entry => entry.marker.cohortIndex));
  const signatures = new Set(markers.map(entry => entry.marker.signature));
  if (paperCounts.size !== 1 || cohortIndexes.size !== 1 || signatures.size !== 1) {
    throw clinicRepeatError('ASSIGNMENT_GROUP_MISMATCH', '같은 회차로 묶을 수 없는 배정이 섞여 있습니다.', 409);
  }
  const paperCount = [...paperCounts][0];
  if (!Number.isInteger(paperCount) || paperCount < 1 || paperCount > MAX_PAPERS_PER_ROUND || paperCount !== ids.length) {
    throw clinicRepeatError('ASSIGNMENT_GROUP_INCOMPLETE', '분권 배정이 모두 연결되지 않았습니다.', 409, {
      expectedPaperCount: paperCount,
      providedPaperCount: ids.length,
    });
  }
  const paperIndexes = markers.map(entry => entry.marker.paperIndex).sort((a, b) => a - b);
  for (let index = 0; index < paperIndexes.length; index++) {
    if (paperIndexes[index] !== index + 1) {
      throw clinicRepeatError('ASSIGNMENT_GROUP_INCOMPLETE', '분권 배정 번호가 연속되지 않습니다.', 409);
    }
  }
  const totalQuestions = markers.reduce((sum, entry) => sum + entry.marker.questionUids.length, 0);
  if (totalQuestions < 1 || totalQuestions > MAX_QUESTIONS_PER_STUDENT) {
    throw clinicRepeatError('ASSIGNMENT_QUESTION_COUNT_MISMATCH', '회차 문항 수를 확인할 수 없습니다.', 409);
  }
  // Policy question count is the round's recorded setting. The issue flow is
  // already constrained to it, so verify it here and report any discrepancy
  // instead of confirming a policy-violating group silently.
  const policyQuestionCount = Number(round?.candidateSummary?.questionCount);
  const policyQuestionCountMismatch = Number.isInteger(policyQuestionCount) && policyQuestionCount > 0 &&
    totalQuestions > policyQuestionCount;

  // Optional frozen question bridge: when the bridge table exists it must be
  // readable and must match the marker. A failed read is not "no bridge".
  const bridgeProbe = await probeColumns(env, 'class_exam_assignment_questions');
  if (bridgeProbe.state === PROBE_ERROR) {
    throw clinicRepeatError('RECONCILE_UNAVAILABLE', '배정 문항 연결을 확인할 수 없습니다. 잠시 후 다시 확인하세요.', 503);
  }
  if (bridgeProbe.state === PROBE_PRESENT) {
    const columns = bridgeProbe.columns;
    if (!columns.has('assignment_id') || !columns.has('order_no') || !columns.has('question_uid')) {
      throw clinicRepeatError('RECONCILE_UNSUPPORTED', '배정 문항 연결 구조를 확인할 수 없는 환경입니다.', 409);
    }
    let questionRows = [];
    try {
      const result = await env.DB.prepare(
        `SELECT assignment_id, order_no, question_uid FROM class_exam_assignment_questions
         WHERE assignment_id IN (${ids.map(() => '?').join(',')}) ORDER BY assignment_id, order_no`,
      ).bind(...ids).all();
      questionRows = result.results || [];
    } catch {
      throw clinicRepeatError('RECONCILE_UNAVAILABLE', '배정 문항 연결 조회에 실패했습니다. 잠시 후 다시 확인하세요.', 503);
    }
    if (questionRows.length) {
      for (const entry of markers) {
        const rows = questionRows.filter(row => text(row.assignment_id) === entry.assignmentId);
        if (rows.length !== entry.marker.questionUids.length) {
          throw clinicRepeatError('ASSIGNMENT_QUESTION_BRIDGE_MISMATCH', '배정 문항 목록이 출처와 일치하지 않습니다.', 409, {
            assignmentId: entry.assignmentId,
          });
        }
        const uids = rows.sort((a, b) => Number(a.order_no) - Number(b.order_no)).map(row => text(row.question_uid));
        if (stableStringify(uids) !== stableStringify(entry.marker.questionUids)) {
          throw clinicRepeatError('ASSIGNMENT_QUESTION_BRIDGE_MISMATCH', '배정 문항 목록이 출처와 일치하지 않습니다.', 409, {
            assignmentId: entry.assignmentId,
          });
        }
      }
    }
  }

  return {
    assignmentIds: markers.map(entry => entry.assignmentId),
    savedPaperIds: unique(markers.map(entry => entry.savedPaperId)),
    assignmentBatchIds: unique(markers.map(entry => extractAssignmentBatchId(entry.row.archive_file, entry.savedPaperId))),
    paperCount,
    cohortIndex: [...cohortIndexes][0],
    operationSignature: [...signatures][0],
    examDate: [...examDates][0],
    examTitles: [...titles],
    questionCount: totalQuestions,
    recommendationMode: markers[0].marker.recommendationMode,
    policyQuestionCount: Number.isInteger(policyQuestionCount) && policyQuestionCount > 0 ? policyQuestionCount : null,
    policyQuestionCountMismatch,
    assignments: markers.map(entry => ({
      assignmentId: entry.assignmentId,
      savedPaperId: entry.savedPaperId,
      paperIndex: entry.marker.paperIndex,
      paperCount: entry.marker.paperCount,
      questionCount: entry.marker.questionUids.length,
      examTitle: text(entry.row.exam_title),
      examDate: text(entry.row.exam_date),
    })),
  };
}

// ---------------------------------------------------------------------------
// Release safety
// ---------------------------------------------------------------------------

export async function findAssignmentsForOperation(env, classId, operationId) {
  const columns = await tableColumns(env, 'class_exam_assignments');
  if (!columns.size || !columns.has('mixed_payload_json')) return { supported: false, assignmentIds: [] };
  try {
    const result = await env.DB.prepare(
      `SELECT id FROM class_exam_assignments
       WHERE class_id = ?
         AND json_valid(mixed_payload_json)
         AND json_extract(mixed_payload_json, '$.meta.clinicRecommendationAssessment.operationId') = ?
       LIMIT ?`,
    ).bind(classId, operationId, MAX_PAPERS_PER_ROUND + 1).all();
    return { supported: true, assignmentIds: (result.results || []).map(row => text(row.id)) };
  } catch {
    return { supported: false, assignmentIds: [] };
  }
}

// Recovery view for a teacher whose page was refreshed mid-flow: it re-discovers
// the assignments already carrying this round's operationId and reports which
// group is complete. It never issues anything and never writes.
export async function loadOperationAssignmentCandidates(env, { classId, studentId, operationId }) {
  const empty = { supported: false, candidates: [], groups: [], suggestedAssignmentIds: [] };
  if (!classId || !studentId || !operationId) return empty;
  const columns = await tableColumns(env, 'class_exam_assignments');
  if (!columns.size || !columns.has('mixed_payload_json')) return empty;

  const select = ['id', 'exam_title', 'exam_date', 'question_count', 'archive_file'];
  if (columns.has('saved_paper_id')) select.push('saved_paper_id');
  if (columns.has('cancelled_at')) select.push('cancelled_at');
  select.push('mixed_payload_json');

  let rows = [];
  try {
    const result = await env.DB.prepare(
      `SELECT ${select.join(',')} FROM class_exam_assignments
       WHERE class_id = ?
         AND json_valid(mixed_payload_json)
         AND json_extract(mixed_payload_json, '$.meta.clinicRecommendationAssessment.operationId') = ?
       ORDER BY id
       LIMIT ?`,
    ).bind(classId, operationId, MAX_PAPERS_PER_ROUND * 2).all();
    rows = result.results || [];
  } catch {
    return empty;
  }
  if (!rows.length) return { supported: true, candidates: [], groups: [], suggestedAssignmentIds: [] };

  const ids = rows.map(row => text(row.id));
  const placeholders = ids.map(() => '?').join(',');

  const recipientProbe = await probeTable(env, 'class_exam_assignment_recipients');
  if (recipientProbe === PROBE_ERROR) {
    return { ...empty, supported: false, error: 'RECIPIENT_PROBE_FAILED' };
  }
  const recipientSet = new Set();
  if (recipientProbe === PROBE_PRESENT) {
    try {
      const result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_recipients
         WHERE assignment_id IN (${placeholders}) AND student_id = ?`,
      ).bind(...ids, studentId).all();
      for (const row of result.results || []) recipientSet.add(text(row.assignment_id));
    } catch {
      return { ...empty, supported: false, error: 'RECIPIENT_QUERY_FAILED' };
    }
  } else if (await isClassStudent(env, classId, studentId)) {
    ids.forEach(id => recipientSet.add(id));
  }

  const exclusionProbe = await probeTable(env, 'class_exam_assignment_exclusions');
  if (exclusionProbe === PROBE_ERROR) {
    return { ...empty, supported: false, error: 'EXCLUSION_PROBE_FAILED' };
  }
  const excludedSet = new Set();
  if (exclusionProbe === PROBE_PRESENT) {
    try {
      const result = await env.DB.prepare(
        `SELECT assignment_id FROM class_exam_assignment_exclusions
         WHERE assignment_id IN (${placeholders}) AND student_id = ?`,
      ).bind(...ids, studentId).all();
      for (const row of result.results || []) excludedSet.add(text(row.assignment_id));
    } catch {
      return { ...empty, supported: false, error: 'EXCLUSION_QUERY_FAILED' };
    }
  }

  const candidates = [];
  for (const row of rows) {
    const assignmentId = text(row.id);
    const marker = parseAssignmentMarker(row.mixed_payload_json);
    const questionCount = Number(row.question_count || 0);
    const recipient = recipientSet.has(assignmentId);
    const excluded = excludedSet.has(assignmentId);
    const cancelled = Boolean(row.cancelled_at);
    const questionCountMatches = Boolean(marker) && questionCount === marker.questionUids.length;
    candidates.push({
      assignmentId,
      savedPaperId: text(row.saved_paper_id) || null,
      examTitle: text(row.exam_title),
      examDate: text(row.exam_date),
      questionCount,
      paperIndex: marker ? marker.paperIndex : null,
      paperCount: marker ? marker.paperCount : null,
      cohortIndex: marker ? marker.cohortIndex : null,
      signature: marker ? marker.signature : null,
      recipient,
      excluded,
      cancelled,
      markerValid: Boolean(marker),
      questionCountMatches,
      linkable: Boolean(marker) && questionCountMatches && recipient && !excluded && !cancelled,
      blockedReason: !marker
        ? 'ASSIGNMENT_MARKER_MISSING'
        : !questionCountMatches
          ? 'ASSIGNMENT_QUESTION_COUNT_MISMATCH'
          : cancelled
            ? 'ASSIGNMENT_CANCELLED'
            : !recipient
              ? 'STUDENT_NOT_RECIPIENT'
              : excluded
                ? 'STUDENT_EXCLUDED'
                : null,
    });
  }

  const groupMap = new Map();
  for (const candidate of candidates) {
    if (!candidate.markerValid) continue;
    const key = `${candidate.signature}|${candidate.cohortIndex}|${candidate.paperCount}`;
    if (!groupMap.has(key)) groupMap.set(key, []);
    groupMap.get(key).push(candidate);
  }
  const groups = [...groupMap.values()].map(group => {
    const paperIndexes = group.map(entry => entry.paperIndex).sort((a, b) => a - b);
    const paperCount = group[0].paperCount;
    const contiguous = paperIndexes.every((value, index) => value === index + 1);
    const complete = contiguous && paperCount === group.length;
    return {
      signature: group[0].signature,
      cohortIndex: group[0].cohortIndex,
      paperCount,
      assignmentIds: group.map(entry => entry.assignmentId),
      paperIndexes,
      complete,
      allLinkable: group.every(entry => entry.linkable),
    };
  }).sort((a, b) => Number(b.complete) - Number(a.complete) || a.cohortIndex - b.cohortIndex);

  const usable = groups.find(group => group.complete && group.allLinkable) || null;
  return {
    supported: true,
    candidates,
    groups,
    suggestedAssignmentIds: usable ? usable.assignmentIds : [],
  };
}

export { MAX_PAPERS_PER_ROUND, MAX_QUESTIONS_PER_STUDENT, MAX_POLICIES_EVALUATED, MAX_STATUS_POLICIES, MAX_ROUNDS_LIMIT, MAX_CADENCE_DAYS, nowIso };
