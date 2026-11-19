import { jsonResponse } from '../helpers/response.js';
import { isAdminUser, makeId } from '../helpers/foundation-db.js';
import { findTeacherByAlias, generateStudentPin, normalizeHighSubjects, normalizeTargetScore } from '../helpers/admin-db.js';
import { isTimeOverlap, overlapRange, uniqSortedPair } from '../helpers/time.js';

const EDITABLE_STATUSES = new Set(['draft', 'scheduled']);
const PATCHABLE_STATUSES = new Set(['draft', 'scheduled', 'cancelled']);
// 초안에서 반이 없는 학생(미배정)을 저장하는 표식. 스키마를 바꾸지 않고 기존 행·컬럼만 쓴다.
const UNASSIGNED_CLASS_ID = '__unassigned__';
const UNASSIGNED_REASON = 'unassigned';
// 반 상태: removed = 개편안에서 삭제한 반(운영 반에서 온 것). excluded 계열은 졸업 반 처리.
const NON_RENDERABLE_CLASS_STATUSES = ['excluded', 'graduating_excluded', 'removed'];
const NON_RENDERABLE_SQL_LIST = NON_RENDERABLE_CLASS_STATUSES.map(v => `'${v}'`).join(', ');
// 원장이 손대지 않은 학생 배치의 memo.note 값. 운영 반 이동을 따라갈지 판정하는 데 쓴다.
const COPY_NOTE = 'copied from active class_students';
const SYNC_NOTE = 'roster sync';
const UNTOUCHED_NOTES = new Set([COPY_NOTE, SYNC_NOTE]);
const WITHDRAWN_STUDENT_STATUSES = ['퇴원', '제적', 'inactive', 'archived', 'withdrawn', 'left'];

export function isWithdrawnStudentStatus(value) {
  return WITHDRAWN_STUDENT_STATUSES.includes(String(value || '').trim().toLowerCase());
}

function forbidden() {
  return jsonResponse({ success: false, error: 'Forbidden' }, 403);
}

function currentSchoolYear() {
  return new Date().getFullYear();
}

function normalizeSchoolYear(value, fallback = currentSchoolYear()) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 2000 || n > 2100) return fallback;
  return Math.floor(n);
}

function rowFromBody(body, allowedKeys) {
  const row = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      row[key] = body[key] === '' ? null : body[key];
    }
  }
  return row;
}

function normalizeSlotRows(versionId, classId, slots) {
  return slots.map(slot => ({
    id: makeId('tvs'),
    version_id: versionId,
    class_id: classId,
    day_of_week: String(slot.day_of_week || '').trim(),
    start_time: String(slot.start_time || '').trim(),
    end_time: String(slot.end_time || '').trim(),
    room_name: slot.room_name || null,
    memo: slot.memo || null
  }));
}

async function getVersion(env, id) {
  return env.DB.prepare('SELECT * FROM timetable_versions WHERE id = ?').bind(id).first();
}

async function listVersionClasses(env, versionId, options = {}) {
  const where = ['version_id = ?'];
  const params = [versionId];
  if (options.classId) {
    where.push('(id = ? OR source_class_id = ?)');
    params.push(String(options.classId), String(options.classId));
  }
  if (options.renderableOnly) {
    where.push(`COALESCE(status, 'draft') NOT IN (${NON_RENDERABLE_SQL_LIST})`);
  }
  const res = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_classes
    WHERE ${where.join(' AND ')}
    ORDER BY sort_order ASC, name_snapshot ASC, id ASC
  `).bind(...params).all();
  return res.results || [];
}

async function listSlots(env, versionId, classId = null, options = {}) {
  const where = ['tvs.version_id = ?'];
  const params = [versionId];
  if (classId) {
    where.push('(tvs.class_id = ? OR tvs.version_class_id = ? OR tvs.source_class_id = ?)');
    params.push(String(classId), String(classId), String(classId));
  }
  if (options.renderableOnly) {
    where.push(`(tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN (${NON_RENDERABLE_SQL_LIST}))`);
  }
  const res = await env.DB.prepare(`
    SELECT tvs.*
    FROM timetable_version_slots tvs
    LEFT JOIN timetable_version_classes tvc ON tvc.id = tvs.version_class_id
    WHERE ${where.join(' AND ')}
    ORDER BY tvs.day_of_week ASC, tvs.start_time ASC, COALESCE(tvs.version_class_id, tvs.class_id) ASC
  `).bind(...params).all();
  return res.results || [];
}

async function listStudentAssignments(env, versionId, classId = null, options = {}) {
  const where = ['a.version_id = ?'];
  const params = [versionId];
  if (classId) {
    if (options.includeSourceClassId) {
      where.push('(a.class_id = ? OR a.version_class_id = ? OR a.source_class_id = ?)');
      params.push(String(classId), String(classId), String(classId));
    } else {
      where.push('(a.class_id = ? OR a.version_class_id = ?)');
      params.push(String(classId), String(classId));
    }
  }
  if (options.renderableOnly) {
    where.push(`(tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN (${NON_RENDERABLE_SQL_LIST}))`);
    where.push("COALESCE(a.excluded_reason, '') = ''");
  }
  const res = await env.DB.prepare(`
    SELECT a.*
    FROM timetable_version_student_assignments a
    LEFT JOIN timetable_version_classes tvc ON tvc.id = a.version_class_id
    WHERE ${where.join(' AND ')}
    ORDER BY COALESCE(a.version_class_id, a.class_id) ASC, a.student_name_snapshot ASC, a.student_id ASC
  `).bind(...params).all();
  return res.results || [];
}

function normalizeGradeLabel(value) {
  const text = String(value || '').trim();
  if (/중\s*1|중1|예비\s*중\s*1/.test(text)) return '중1';
  if (/중\s*2|중2|예비\s*중\s*2/.test(text)) return '중2';
  if (/중\s*3|중3|예비\s*중\s*3/.test(text)) return '중3';
  if (/고\s*1|고1|예비\s*고\s*1/.test(text)) return '고1';
  if (/고\s*2|고2|예비\s*고\s*2/.test(text)) return '고2';
  if (/고\s*3|고3|예비\s*고\s*3/.test(text)) return '고3';
  return text;
}

function getNextSemesterGrade(sourceGrade) {
  const grade = normalizeGradeLabel(sourceGrade);
  const map = {
    '중1': '중2',
    '중2': '중3',
    '고1': '고2',
    '고2': '고3'
  };
  return map[grade] || grade;
}

function isGraduatingMiddleSourceGrade(sourceGrade) {
  return normalizeGradeLabel(sourceGrade) === '중3';
}

function safeParseMemoJson(value, context = 'assignment memo') {
  if (!value) return {};
  if (typeof value === 'object') return value;
  if (typeof value !== 'string') return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    console.warn(`[${context}] invalid JSON ignored`);
    return {};
  }
}

function buildDraftStudentAssignmentMemo(sourceGrade, nextGrade, extra = '', snapshotName = '') {
  return JSON.stringify({
    source_grade: sourceGrade || null,
    next_grade: nextGrade || null,
    student_name_snapshot: snapshotName || null,
    excluded_reason: null,
    note: extra || 'copied from active class_students'
  });
}

// [New semester staging foundation]
// Step 1 helper/stub layer only. Existing API response shapes are not changed in this step.
function normalizeTimetableGrade(value) {
  return normalizeGradeLabel(value);
}

function isGraduationSourceGrade(value) {
  return isGraduatingMiddleSourceGrade(value);
}

function getClassSnapshotGrade(cls = {}) {
  return normalizeTimetableGrade(cls.grade || cls.name || cls.source_grade || '');
}

function buildVersionClassSnapshotFromClass(cls = {}, options = {}) {
  const sourceGrade = getClassSnapshotGrade(cls);
  const nextGrade = getNextSemesterGrade(sourceGrade);
  const isGraduationTarget = isGraduationSourceGrade(sourceGrade);
  const isNew = Number(options.is_new || options.isNew || 0) === 1;
  const status = isGraduationTarget ? 'excluded' : (isNew ? 'new' : 'draft');

  return {
    id: options.id || makeId('tvc'),
    academy_id: options.academy_id || options.academyId || 'apmath',
    version_id: options.version_id || options.versionId || null,
    source_class_id: cls.id || options.source_class_id || options.sourceClassId || null,
    name_snapshot: options.name_snapshot || cls.name || null,
    source_name: cls.name || options.source_name || null,
    grade_snapshot: options.grade_snapshot || cls.grade || null,
    source_grade: sourceGrade || null,
    next_grade: isGraduationTarget ? null : (nextGrade || null),
    teacher_name_snapshot: options.teacher_name_snapshot || cls.teacher_name || null,
    subject_snapshot: options.subject_snapshot || cls.subject || null,
    schedule_days_snapshot: options.schedule_days_snapshot || cls.schedule_days || null,
    time_label_snapshot: options.time_label_snapshot || cls.time_label || null,
    status,
    excluded_reason: isGraduationTarget ? 'middle_school_graduation' : null,
    is_new: isNew ? 1 : 0,
    sort_order: Number.isFinite(Number(options.sort_order)) ? Number(options.sort_order) : 0,
    memo: options.memo || null
  };
}

function buildVersionClassRows(classes = [], versionId, options = {}) {
  if (!Array.isArray(classes)) return [];
  return classes.map((cls, index) => buildVersionClassSnapshotFromClass(cls, {
    ...options,
    version_id: versionId,
    sort_order: index
  }));
}

function mapSourceClassToVersionClass(versionClasses = []) {
  const map = new Map();
  for (const row of Array.isArray(versionClasses) ? versionClasses : []) {
    const sourceClassId = String(row?.source_class_id || '').trim();
    if (sourceClassId && !map.has(sourceClassId)) map.set(sourceClassId, row);
  }
  return map;
}

function buildApplyLogPayload(versionId, status, options = {}) {
  return {
    id: options.id || makeId('tval'),
    academy_id: options.academy_id || options.academyId || 'apmath',
    version_id: versionId,
    status: String(status || 'started'),
    started_at: options.started_at || options.startedAt || new Date().toISOString(),
    finished_at: options.finished_at || options.finishedAt || null,
    error_message: options.error_message || options.errorMessage || null,
    summary_json: options.summary_json || options.summaryJson || null
  };
}

function safeVersionClassIdPart(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]+/g, '_') || 'none';
}

// 64비트 FNV-1a 두 개를 이어 붙인 16자리 16진수. 같은 입력이면 항상 같은 값(결정적).
function hashIdParts(text) {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193 ^ 0x9e3779b9;
  const input = String(text || '');
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ code, 0x85ebca6b) >>> 0;
    h2 = (h2 ^ (h2 >>> 13)) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

// 적용할 때마다 운영 반 id가 이전 id를 품고 길어지면, 세대가 이어질 때 앞부분만 같은 서로 다른 반이 같은 id가 된다.
// 그래서 입력이 길면 전체 입력의 해시로 고정 길이 id를 만든다. 짧은 입력(이미 저장된 기존 초안)은 예전과 같은 값이다.
const VERSION_CLASS_ID_PART_MAX = 80;
const APPLIED_CLASS_ID_MAX = 120;

function makeSourceVersionClassId(versionId, sourceClassId) {
  const ver = safeVersionClassIdPart(versionId);
  const src = safeVersionClassIdPart(sourceClassId);
  if (ver.length <= VERSION_CLASS_ID_PART_MAX && src.length <= VERSION_CLASS_ID_PART_MAX) return `tvc_${ver}_${src}`;
  return `tvc_${hashIdParts(`${ver}|${src}`)}`;
}

function buildPromotedClassName(sourceName, sourceGrade, nextGrade) {
  const name = String(sourceName || '').trim();
  const src = normalizeTimetableGrade(sourceGrade);
  const next = normalizeTimetableGrade(nextGrade);
  if (!name || !src || !next || src === next) return name;
  const compactSrc = src.replace(/\s+/g, '');
  const compactNext = next.replace(/\s+/g, '');
  if (name.includes(src)) return name.replace(src, next);
  if (name.includes(compactSrc)) return name.replace(compactSrc, compactNext);
  return name;
}

function versionClassCompatClassRow(row = {}) {
  const sourceId = String(row.source_class_id || '').trim();
  const versionClassId = String(row.id || '').trim();
  return {
    id: sourceId || versionClassId,
    version_class_id: versionClassId,
    source_class_id: sourceId || null,
    name: row.name_snapshot || row.source_name || '',
    grade: row.next_grade || row.grade_snapshot || row.source_grade || '',
    subject: row.subject_snapshot || '',
    teacher_name: row.teacher_name_snapshot || '',
    schedule_days: row.schedule_days_snapshot || '',
    time_label: row.time_label_snapshot || '',
    is_active: String(row.status || '') === 'excluded' ? 0 : 1,
    timetable_version_status: row.status || 'draft',
    timetable_version_excluded_reason: row.excluded_reason || null,
    __timetable_version_class: 1
  };
}

function getVersionClassCompatClassId(versionClass = {}) {
  return String(versionClass.source_class_id || versionClass.id || '').trim();
}

function isRenderableVersionClass(row = {}) {
  const status = String(row.status || 'draft').trim().toLowerCase();
  return !NON_RENDERABLE_CLASS_STATUSES.includes(status);
}

async function getVersionClassByAnyId(env, versionId, classId) {
  const cid = String(classId || '').trim();
  if (!cid) return null;
  return env.DB.prepare(`
    SELECT *
    FROM timetable_version_classes
    WHERE version_id = ? AND (id = ? OR source_class_id = ?)
    LIMIT 1
  `).bind(versionId, cid, cid).first();
}

// 운영 반 -> 개편안 반 행. 처음 초안을 만들 때와 운영에서 새로 연 반을 가져올 때 같은 규칙을 쓴다
// (학년 승급 이름, 중3 졸업 대상은 excluded).
function buildSeedVersionClassRows(versionId, sourceClasses, academyId = 'apmath', sortBase = 0) {
  return buildVersionClassRows(sourceClasses, versionId, { academy_id: academyId })
    .map((row, index) => {
      const sourceClassId = String(row.source_class_id || '').trim();
      const promotedName = buildPromotedClassName(row.name_snapshot, row.source_grade, row.next_grade);
      return {
        ...row,
        id: sourceClassId ? makeSourceVersionClassId(versionId, sourceClassId) : row.id,
        name_snapshot: promotedName || row.name_snapshot,
        sort_order: sortBase + index
      };
    });
}

function buildVersionClassInsertStatements(env, rows) {
  return rows.map(row => env.DB.prepare(`
    INSERT OR IGNORE INTO timetable_version_classes
      (id, academy_id, version_id, source_class_id, name_snapshot, source_name, grade_snapshot, source_grade, next_grade,
       teacher_name_snapshot, subject_snapshot, schedule_days_snapshot, time_label_snapshot, status, excluded_reason, is_new, sort_order, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    row.id,
    row.academy_id || 'apmath',
    row.version_id,
    row.source_class_id,
    row.name_snapshot,
    row.source_name,
    row.grade_snapshot,
    row.source_grade,
    row.next_grade,
    row.teacher_name_snapshot,
    row.subject_snapshot,
    row.schedule_days_snapshot,
    row.time_label_snapshot,
    row.status,
    row.excluded_reason,
    row.is_new,
    row.sort_order,
    row.memo
  ));
}

async function ensureVersionClassesSeeded(env, version, options = {}) {
  if (!version?.id) return [];
  const existing = await listVersionClasses(env, version.id);
  if (existing.length) return existing;

  const activeClassRes = await env.DB.prepare(`
    SELECT *
    FROM classes
    WHERE COALESCE(is_active, 1) != 0
    ORDER BY grade ASC, name ASC, id ASC
  `).all();
  const rows = buildSeedVersionClassRows(version.id, activeClassRes.results || [], options.academy_id || 'apmath');
  if (!rows.length) return [];
  await env.DB.batch(buildVersionClassInsertStatements(env, rows));
  return listVersionClasses(env, version.id);
}

async function ensureVersionSlotsMapped(env, version) {
  if (!version?.id) return 0;
  const versionClasses = await ensureVersionClassesSeeded(env, version);
  const map = mapSourceClassToVersionClass(versionClasses);
  const slotRows = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_slots
    WHERE version_id = ? AND (version_class_id IS NULL OR version_class_id = '')
  `).bind(version.id).all();
  let updated = 0;
  for (const slot of (slotRows.results || [])) {
    const sourceClassId = String(slot.source_class_id || slot.class_id || '').trim();
    const versionClass = map.get(sourceClassId);
    if (!versionClass) continue;
    const result = await env.DB.prepare(`
      UPDATE timetable_version_slots
      SET version_class_id = ?, source_class_id = COALESCE(source_class_id, ?), updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(versionClass.id, sourceClassId, slot.id).run();
    updated += Number(result.meta?.changes || 0);
  }
  return updated;
}

async function ensureVersionAssignmentsMapped(env, version) {
  if (!version?.id) return 0;
  const versionClasses = await ensureVersionClassesSeeded(env, version);
  const map = mapSourceClassToVersionClass(versionClasses);
  const assignmentRows = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_student_assignments
    WHERE version_id = ? AND (version_class_id IS NULL OR version_class_id = '')
  `).bind(version.id).all();
  let updated = 0;
  for (const row of (assignmentRows.results || [])) {
    const sourceClassId = String(row.source_class_id || row.class_id || '').trim();
    const versionClass = map.get(sourceClassId);
    if (!versionClass) continue;
    if (String(versionClass.status || '').trim().toLowerCase() === 'removed') {
      const moved = await env.DB.prepare(`
        UPDATE timetable_version_student_assignments
        SET class_id = ?, version_class_id = ?, excluded_reason = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(UNASSIGNED_CLASS_ID, UNASSIGNED_CLASS_ID, UNASSIGNED_REASON, row.id).run();
      updated += Number(moved.meta?.changes || 0);
      continue;
    }
    const memoInfo = safeParseMemoJson(row.memo, 'ensureVersionAssignmentsMapped memo');
    const sourceGrade = row.source_grade || memoInfo.source_grade || versionClass.source_grade || null;
    const nextGrade = row.next_grade || memoInfo.next_grade || versionClass.next_grade || null;
    const excludedReason = !isRenderableVersionClass(versionClass) ? (versionClass.excluded_reason || 'excluded_class') : (row.excluded_reason || null);
    const result = await env.DB.prepare(`
      UPDATE timetable_version_student_assignments
      SET version_class_id = ?,
          source_class_id = COALESCE(source_class_id, ?),
          source_grade = COALESCE(source_grade, ?),
          next_grade = COALESCE(next_grade, ?),
          excluded_reason = COALESCE(excluded_reason, ?),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(versionClass.id, sourceClassId, sourceGrade, nextGrade, excludedReason, row.id).run();
    updated += Number(result.meta?.changes || 0);
  }
  return updated;
}

async function copyClassStudentsToVersion(env, version) {
  const versionId = typeof version === 'string' ? version : version?.id;
  if (!versionId) return 0;
  const versionRow = typeof version === 'string' ? await getVersion(env, versionId) : version;
  const versionClasses = await ensureVersionClassesSeeded(env, versionRow || { id: versionId, status: 'draft' });
  const map = mapSourceClassToVersionClass(versionClasses);
  const res = await env.DB.prepare(`
    SELECT
      cs.class_id,
      cs.student_id,
      s.name AS student_name,
      s.status AS student_status,
      s.grade AS student_grade,
      c.grade AS class_grade,
      c.name AS class_name
    FROM class_students cs
    JOIN students s ON s.id = cs.student_id
    LEFT JOIN classes c ON c.id = cs.class_id
    ORDER BY cs.class_id ASC, cs.student_id ASC
  `).all();
  let copied = 0;
  for (const row of (res.results || [])) {
    // 퇴원·제적 학생은 새 개편안에 복사하지 않는다.
    if (isWithdrawnStudentStatus(row.student_status)) continue;
    const sourceClassId = String(row.class_id || '').trim();
    const versionClass = map.get(sourceClassId);
    if (!versionClass || !isRenderableVersionClass(versionClass)) continue;
    const sourceGrade = normalizeGradeLabel(versionClass.source_grade || row.class_grade || row.student_grade || row.class_name || '');
    const nextGrade = normalizeGradeLabel(versionClass.next_grade || getNextSemesterGrade(sourceGrade));
    const result = await env.DB.prepare(`
      INSERT OR IGNORE INTO timetable_version_student_assignments
        (id, version_id, class_id, version_class_id, student_id, student_name_snapshot, source_class_id, source_grade, next_grade, excluded_reason, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
    `).bind(
      makeId('tvsa'),
      versionId,
      getVersionClassCompatClassId(versionClass),
      versionClass.id,
      row.student_id,
      row.student_name || null,
      sourceClassId,
      sourceGrade,
      nextGrade,
      buildDraftStudentAssignmentMemo(sourceGrade, nextGrade, COPY_NOTE, row.student_name || '')
    ).run();
    copied += Number(result.meta?.changes || 0);
  }
  return copied;
}

async function ensureDraftStudentAssignmentsSeeded(env, version) {
  if (!version || !EDITABLE_STATUSES.has(String(version.status || ''))) return 0;
  try {
    await ensureVersionClassesSeeded(env, version);
    await ensureVersionSlotsMapped(env, version);
    await ensureVersionAssignmentsMapped(env, version);
    const countRow = await env.DB.prepare('SELECT COUNT(*) AS count FROM timetable_version_student_assignments WHERE version_id = ?').bind(version.id).first();
    if (Number(countRow?.count || 0) > 0) return 0;
    return copyClassStudentsToVersion(env, version);
  } catch (error) {
    console.error('[ensureDraftStudentAssignmentsSeeded] seed skipped:', error);
    return 0;
  }
}

function normalizeDraftClassPayload(body = {}) {
  return {
    name: String(body.name || '').trim(),
    grade: String(body.grade || '중1').trim() || '중1',
    subject: String(body.subject || '수학').trim() || '수학',
    teacher_name: String(body.teacher_name || body.teacherName || '').trim(),
    schedule_days: String(body.schedule_days || body.scheduleDays || '').trim(),
    textbook: String(body.textbook || '').trim(),
    day_group: String(body.day_group || body.dayGroup || '').trim(),
    time_label: String(body.time_label || body.timeLabel || '').trim()
  };
}

function normalizeDraftStudentPayload(body = {}) {
  return {
    name: String(body.name || '').trim(),
    school_name: String(body.school_name || body.schoolName || '').trim(),
    grade: String(body.grade || '중1').trim() || '중1',
    target_score: normalizeTargetScore(body.target_score ?? body.targetScore ?? null),
    memo: String(body.memo || '').trim(),
    guardian_relation: String(body.guardian_relation || body.guardianRelation || '').trim(),
    student_phone: String(body.student_phone || body.studentPhone || '').trim(),
    parent_phone: String(body.parent_phone || body.parentPhone || '').trim(),
    student_pin: String(body.student_pin || body.studentPin || '').trim(),
    high_subjects: normalizeHighSubjects(body.high_subjects ?? body.highSubjects ?? '[]')
  };
}

async function assertEditableVersion(env, versionId) {
  const version = await getVersion(env, versionId);
  if (!version) return { error: jsonResponse({ success: false, error: 'Not found' }, 404) };
  if (!EDITABLE_STATUSES.has(String(version.status || ''))) {
    return { error: jsonResponse({ success: false, error: 'version is not editable' }, 400) };
  }
  return { version };
}

async function createDraftClass(env, versionId, teacher, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;

  const row = normalizeDraftClassPayload(body);
  const slots = Array.isArray(body.slots) ? body.slots : [];
  if (!row.name) return jsonResponse({ success: false, error: 'name required' }, 400);
  if (!slots.length) return jsonResponse({ success: false, error: 'slots required' }, 400);

  const versionClass = buildVersionClassSnapshotFromClass({
    id: null,
    name: row.name,
    grade: row.grade,
    subject: row.subject,
    teacher_name: row.teacher_name,
    schedule_days: row.schedule_days,
    time_label: row.time_label
  }, {
    academy_id: 'apmath',
    version_id: versionId,
    is_new: 1,
    source_class_id: null,
    sourceClassId: null,
    name_snapshot: row.name,
    grade_snapshot: row.grade,
    sort_order: Date.now(),
    memo: row.textbook ? JSON.stringify({ textbook: row.textbook, day_group: row.day_group }) : null
  });
  versionClass.source_class_id = null;
  versionClass.status = 'new';
  versionClass.is_new = 1;
  versionClass.next_grade = normalizeTimetableGrade(row.grade);

  const normalizedSlots = normalizeSlotRows(versionId, versionClass.id, slots);
  if (normalizedSlots.some(slot => !slot.day_of_week || !slot.start_time || !slot.end_time)) {
    return jsonResponse({ success: false, error: 'day_of_week, start_time, end_time required' }, 400);
  }

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO timetable_version_classes
        (id, academy_id, version_id, source_class_id, name_snapshot, source_name, grade_snapshot, source_grade, next_grade,
         teacher_name_snapshot, subject_snapshot, schedule_days_snapshot, time_label_snapshot, status, excluded_reason, is_new, sort_order, memo)
      VALUES (?, ?, ?, NULL, ?, NULL, ?, NULL, ?, ?, ?, ?, ?, 'new', NULL, 1, ?, ?)
    `).bind(
      versionClass.id,
      versionClass.academy_id || 'apmath',
      versionId,
      versionClass.name_snapshot,
      versionClass.grade_snapshot,
      versionClass.next_grade,
      versionClass.teacher_name_snapshot,
      versionClass.subject_snapshot,
      versionClass.schedule_days_snapshot,
      versionClass.time_label_snapshot,
      versionClass.sort_order,
      versionClass.memo
    ),
    ...normalizedSlots.map(slot => env.DB.prepare(`
      INSERT INTO timetable_version_slots
        (id, version_id, class_id, version_class_id, source_class_id, day_of_week, start_time, end_time, room_name, memo)
      VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?)
    `).bind(slot.id, slot.version_id, versionClass.id, versionClass.id, slot.day_of_week, slot.start_time, slot.end_time, slot.room_name, slot.memo || 'draft class placement'))
  ]);

  const savedVersionClass = await env.DB.prepare('SELECT * FROM timetable_version_classes WHERE id = ?').bind(versionClass.id).first();
  return jsonResponse({
    success: true,
    timetable_version: checked.version,
    timetable_version_class: savedVersionClass,
    class: versionClassCompatClassRow(savedVersionClass),
    timetable_version_slots: await listSlots(env, versionId, versionClass.id),
    timetable_version_student_assignments: await listStudentAssignments(env, versionId, versionClass.id)
  });
}

async function assignDraftStudent(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;

  await ensureVersionClassesSeeded(env, checked.version);
  const studentId = String(body.student_id || body.studentId || body.temp_student_id || body.tempStudentId || '').trim();
  const targetClassId = String(body.target_class_id || body.targetClassId || body.class_id || body.classId || body.version_class_id || body.versionClassId || '').trim();
  const sourceClassId = String(body.source_class_id || body.sourceClassId || '').trim();
  if (!studentId || !targetClassId) return jsonResponse({ success: false, error: 'student_id and target_class_id required' }, 400);

  const versionClass = await getVersionClassByAnyId(env, versionId, targetClassId);
  if (!versionClass || !isRenderableVersionClass(versionClass)) return jsonResponse({ success: false, error: 'draft class not found' }, 404);

  const existingAssignment = await env.DB.prepare(`
    SELECT memo, source_class_id, source_grade, next_grade, student_name_snapshot, student_snapshot, temp_student_id
    FROM timetable_version_student_assignments
    WHERE version_id = ? AND (student_id = ? OR temp_student_id = ?)
    ORDER BY updated_at DESC, created_at DESC
    LIMIT 1
  `).bind(versionId, studentId, studentId).first();

  const student = await env.DB.prepare('SELECT id, name, grade FROM students WHERE id = ?').bind(studentId).first();
  const snapshot = safeParseMemoJson(existingAssignment?.student_snapshot, 'assignDraftStudent student_snapshot');
  const studentName = String(student?.name || snapshot.name || existingAssignment?.student_name_snapshot || '').trim();
  if (!student && !studentName) return jsonResponse({ success: false, error: 'student not found' }, 404);

  const isTempStudent = !!(existingAssignment?.temp_student_id || (!student && studentName));
  const sourceGrade = normalizeGradeLabel(existingAssignment?.source_grade || versionClass.source_grade || student?.grade || snapshot.grade || '');
  const nextGrade = normalizeGradeLabel(existingAssignment?.next_grade || versionClass.next_grade || getNextSemesterGrade(sourceGrade));
  const memoInfo = safeParseMemoJson(existingAssignment?.memo, 'assignDraftStudent memo');
  const memo = buildDraftStudentAssignmentMemo(
    memoInfo.source_grade || sourceGrade,
    memoInfo.next_grade || nextGrade,
    body.memo || 'draft student reassigned',
    memoInfo.student_name_snapshot || studentName || ''
  );
  const id = makeId('tvsa');
  const compatClassId = getVersionClassCompatClassId(versionClass);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM timetable_version_student_assignments WHERE version_id = ? AND (student_id = ? OR temp_student_id = ?)').bind(versionId, studentId, studentId),
    env.DB.prepare(`
      INSERT INTO timetable_version_student_assignments
        (id, version_id, class_id, version_class_id, student_id, student_name_snapshot, source_class_id, source_grade, next_grade, excluded_reason, temp_student_id, student_snapshot, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      id,
      versionId,
      compatClassId,
      versionClass.id,
      studentId,
      studentName || null,
      existingAssignment?.source_class_id || sourceClassId || versionClass.source_class_id || null,
      sourceGrade || null,
      nextGrade || null,
      isTempStudent ? studentId : null,
      existingAssignment?.student_snapshot || null,
      memo
    )
  ]);

  return jsonResponse({
    success: true,
    version_id: versionId,
    student_id: studentId,
    source_class_id: sourceClassId || null,
    target_class_id: compatClassId,
    version_class_id: versionClass.id,
    ...(await buildDraftListsPayload(env, versionId))
  });
}

async function createDraftStudent(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;

  await ensureVersionClassesSeeded(env, checked.version);
  const classId = String(body.class_id || body.classId || body.version_class_id || body.versionClassId || '').trim();
  if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
  const versionClass = await getVersionClassByAnyId(env, versionId, classId);
  if (!versionClass || !isRenderableVersionClass(versionClass)) return jsonResponse({ success: false, error: 'draft class not found' }, 404);

  const d = normalizeDraftStudentPayload(body);
  if (!d.name) return jsonResponse({ success: false, error: 'name required' }, 400);

  const tempStudentId = makeId('tmp_s');
  const newStudentId = makeId('tvns');
  const assignmentId = makeId('tvsa');
  const nextGrade = normalizeGradeLabel(d.grade || versionClass.next_grade || '중1');
  const studentSnapshot = JSON.stringify({
    name: d.name,
    school_name: d.school_name || null,
    grade: d.grade || null,
    target_score: d.target_score || null,
    memo: d.memo || null,
    guardian_relation: d.guardian_relation || null,
    student_phone: d.student_phone || null,
    parent_phone: d.parent_phone || null,
    student_pin: d.student_pin || null,
    high_subjects: d.high_subjects || '[]'
  });
  const assignmentMemo = buildDraftStudentAssignmentMemo(null, nextGrade, 'draft new student', d.name);
  const compatClassId = getVersionClassCompatClassId(versionClass);

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO timetable_version_new_students
        (id, academy_id, version_id, version_class_id, temp_student_id, name_snapshot, school_name_snapshot, grade_snapshot, next_grade, phone_snapshot, memo, status)
      VALUES (?, 'apmath', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')
    `).bind(newStudentId, versionId, versionClass.id, tempStudentId, d.name, d.school_name || null, d.grade || null, nextGrade, d.student_phone || d.parent_phone || null, studentSnapshot),
    env.DB.prepare(`
      INSERT INTO timetable_version_student_assignments
        (id, version_id, class_id, version_class_id, student_id, student_name_snapshot, source_class_id, source_grade, next_grade, excluded_reason, temp_student_id, student_snapshot, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?, NULL, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(assignmentId, versionId, compatClassId, versionClass.id, tempStudentId, d.name, nextGrade, tempStudentId, studentSnapshot, assignmentMemo)
  ]);

  const student = {
    id: tempStudentId,
    name: d.name,
    school_name: d.school_name,
    grade: d.grade || nextGrade,
    status: '입학예정',
    student_pin: d.student_pin || '',
    __timetable_version_new_student: 1
  };
  return jsonResponse({
    success: true,
    version_id: versionId,
    student,
    timetable_version_new_student: await env.DB.prepare('SELECT * FROM timetable_version_new_students WHERE id = ?').bind(newStudentId).first(),
    timetable_version_student_assignments: await listStudentAssignments(env, versionId, classId)
  });
}

function uniqueValues(rows, key) {
  return [...new Set((rows || []).map(row => String(row?.[key] || '').trim()).filter(Boolean))];
}


function makeAppliedClassId(versionId, versionClassId) {
  const ver = safeVersionClassIdPart(versionId);
  const vc = safeVersionClassIdPart(versionClassId);
  const full = `cls_${ver}_${vc}`;
  if (full.length <= APPLIED_CLASS_ID_MAX) return full;
  return `cls_${hashIdParts(`${ver}|${vc}`)}`;
}

function getVersionClassTextbookInfo(versionClass = {}) {
  const memo = safeParseMemoJson(versionClass.memo, 'version class memo');
  return {
    textbook: memo.textbook || '',
    day_group: memo.day_group || null
  };
}

function getAppliedClassName(versionClass = {}) {
  return String(versionClass.name_snapshot || versionClass.source_name || '').trim();
}

function getAppliedClassGrade(versionClass = {}) {
  return normalizeGradeLabel(versionClass.next_grade || versionClass.grade_snapshot || versionClass.source_grade || '');
}

async function loadVersionNewStudentRows(env, versionId) {
  const res = await env.DB.prepare('SELECT * FROM timetable_version_new_students WHERE version_id = ?').bind(versionId).all();
  const map = new Map();
  for (const row of (res.results || [])) {
    const tempId = String(row.temp_student_id || '').trim();
    if (tempId && !map.has(tempId)) map.set(tempId, row);
  }
  return map;
}

function normalizeAssignmentStudentKey(row = {}) {
  return String(row.student_id || row.temp_student_id || '').trim();
}

async function activateVersionClassBased(env, versionId, teacher, version) {
  const startedLogId = makeId('tval');
  await env.DB.prepare(`
    INSERT INTO timetable_version_apply_logs
      (id, academy_id, version_id, status, started_at, summary_json, created_at)
    VALUES (?, 'apmath', ?, 'started', CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)
  `).bind(startedLogId, versionId, JSON.stringify({ step: 'activateVersionClassBased' })).run();

  try {
    await ensureVersionClassesSeeded(env, version);
    await ensureVersionSlotsMapped(env, version);
    await ensureVersionAssignmentsMapped(env, version);

    const versionClasses = await listVersionClasses(env, versionId, { renderableOnly: true });
    if (!versionClasses.length) return jsonResponse({ success: false, error: 'version has no classes' }, 400);

    const slots = await listSlots(env, versionId, null, { renderableOnly: true });
    const rawAssignments = await listStudentAssignments(env, versionId, null, { renderableOnly: true });
    const newStudentMap = await loadVersionNewStudentRows(env, versionId);
    const activeVersion = await env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first();
    const oldClassRows = await env.DB.prepare('SELECT class_id, student_id FROM class_students').all();
    const allocatedPins = new Set();
    async function allocateStudentPin(grade, preferredPin) {
      const preferred = String(preferredPin || '').trim();
      if (preferred && !allocatedPins.has(preferred)) {
        allocatedPins.add(preferred);
        return preferred;
      }
      let pin = await generateStudentPin(grade, env);
      while (allocatedPins.has(pin)) {
        const n = Number(pin);
        pin = Number.isFinite(n) ? String(n + 1).padStart(pin.length, '0') : `${pin}_${allocatedPins.size + 1}`;
      }
      allocatedPins.add(pin);
      return pin;
    }

    const versionClassById = new Map(versionClasses.map(row => [String(row.id), row]));
    const appliedClassByVersionClassId = new Map();
    const statements = [];
    const teacherClassRows = [];

    for (const vc of versionClasses) {
      const versionClassId = String(vc.id || '').trim();
      if (!versionClassId) continue;
      const appliedClassId = makeAppliedClassId(versionId, versionClassId);
      appliedClassByVersionClassId.set(versionClassId, appliedClassId);
      const textbookInfo = getVersionClassTextbookInfo(vc);
      statements.push(env.DB.prepare(`
        INSERT INTO classes
          (id, name, grade, subject, teacher_name, schedule_days, textbook, is_active, day_group, time_label, parent_class_id, promotion_version_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
      `).bind(
        appliedClassId,
        getAppliedClassName(vc),
        getAppliedClassGrade(vc) || null,
        vc.subject_snapshot || null,
        vc.teacher_name_snapshot || null,
        vc.schedule_days_snapshot || null,
        textbookInfo.textbook || '',
        textbookInfo.day_group || null,
        vc.time_label_snapshot || null,
        vc.source_class_id || null,
        versionId
      ));
      const matchedTeacher = await findTeacherByAlias(env, vc.teacher_name_snapshot);
      if (matchedTeacher?.id) teacherClassRows.push({ teacher_id: matchedTeacher.id, class_id: appliedClassId });
    }

    // 개편안에서 삭제한(removed) 반의 원래 운영 반도 함께 닫는다. 안 그러면 삭제한 반이 운영에 그대로 남는다.
    const removedClasses = await listRemovedClasses(env, versionId);
    const removedSourceClassIds = removedClasses.map(row => String(row.source_class_id || '').trim()).filter(Boolean);
    const unassignedCountRow = await env.DB.prepare(`
      SELECT COUNT(*) AS count FROM timetable_version_student_assignments
      WHERE version_id = ? AND COALESCE(excluded_reason, '') = ?
    `).bind(versionId, UNASSIGNED_REASON).first();
    const unassignedStudentCount = Number(unassignedCountRow?.count || 0);

    const sourceClassIds = Array.from(new Set(versionClasses.map(row => String(row.source_class_id || '').trim()).concat(removedSourceClassIds).filter(Boolean)));
    if (sourceClassIds.length) {
      const sourceClassMarkers = sourceClassIds.map(() => '?').join(',');
      statements.push(env.DB.prepare(`UPDATE classes SET is_active = 0 WHERE id IN (${sourceClassMarkers})`).bind(...sourceClassIds));
      statements.push(env.DB.prepare(`DELETE FROM class_students WHERE class_id IN (${sourceClassMarkers})`).bind(...sourceClassIds));
    }

    const teacherMappingClassIds = Array.from(new Set([...sourceClassIds, ...appliedClassByVersionClassId.values()].map(id => String(id || '').trim()).filter(Boolean)));
    if (teacherMappingClassIds.length) {
      const teacherMappingMarkers = teacherMappingClassIds.map(() => '?').join(',');
      statements.push(env.DB.prepare(`DELETE FROM teacher_classes WHERE class_id IN (${teacherMappingMarkers})`).bind(...teacherMappingClassIds));
    }

    for (const row of teacherClassRows) {
      statements.push(env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(row.teacher_id, row.class_id));
    }

    for (const slot of slots) {
      const versionClassId = String(slot.version_class_id || '').trim();
      const appliedClassId = appliedClassByVersionClassId.get(versionClassId);
      if (!appliedClassId) continue;
      statements.push(env.DB.prepare(`
        INSERT INTO class_time_slots
          (id, class_id, day_of_week, start_time, end_time, room_name, memo, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(makeId('cts'), appliedClassId, slot.day_of_week, slot.start_time, slot.end_time, slot.room_name || null, slot.memo || '새학기 시간표 적용'));
    }

    const finalAssignments = new Map();
    for (const row of rawAssignments) {
      const key = normalizeAssignmentStudentKey(row);
      const versionClassId = String(row.version_class_id || '').trim();
      if (!key || !versionClassId || !appliedClassByVersionClassId.has(versionClassId)) continue;
      finalAssignments.set(key, row);
    }

    const tempToRealStudentId = new Map();
    for (const [studentKey, row] of finalAssignments.entries()) {
      const tempId = String(row.temp_student_id || '').trim();
      if (!tempId) continue;
      const newRow = newStudentMap.get(tempId) || {};
      const snapshot = safeParseMemoJson(row.student_snapshot || newRow.memo, 'activate new student snapshot');
      const grade = normalizeGradeLabel(newRow.next_grade || snapshot.grade || row.next_grade || '중1');
      const realStudentId = makeId('stu');
      tempToRealStudentId.set(tempId, realStudentId);
      const pin = await allocateStudentPin(grade, snapshot.student_pin);
      statements.push(env.DB.prepare(`
        INSERT INTO students
          (id, name, school_name, grade, target_score, status, memo, guardian_relation, student_phone, parent_phone, student_pin, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, '재원', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        realStudentId,
        newRow.name_snapshot || snapshot.name || row.student_name_snapshot || '이름 없음',
        newRow.school_name_snapshot || snapshot.school_name || null,
        grade || null,
        normalizeTargetScore(snapshot.target_score ?? null),
        snapshot.memo || '새학기 시간표 적용으로 등록',
        snapshot.guardian_relation || null,
        snapshot.student_phone || null,
        snapshot.parent_phone || newRow.phone_snapshot || null,
        pin
      ));
      statements.push(env.DB.prepare("UPDATE timetable_version_new_students SET status = 'applied', updated_at = CURRENT_TIMESTAMP WHERE temp_student_id = ? AND version_id = ?").bind(tempId, versionId));
    }

    const existingStudentIds = [];
    const appliedAssignments = [];
    for (const [studentKey, row] of finalAssignments.entries()) {
      const tempId = String(row.temp_student_id || '').trim();
      const realStudentId = tempId ? tempToRealStudentId.get(tempId) : String(row.student_id || '').trim();
      const appliedClassId = appliedClassByVersionClassId.get(String(row.version_class_id || '').trim());
      if (!realStudentId || !appliedClassId) continue;
      appliedAssignments.push({ student_id: realStudentId, class_id: appliedClassId, source_student_id: String(row.student_id || '').trim() });
      if (!tempId) existingStudentIds.push(realStudentId);
    }

    const sourceClassIdSet = new Set(sourceClassIds);
    const oldSourceStudentIds = Array.from(new Set((oldClassRows.results || [])
      .filter(row => sourceClassIdSet.has(String(row.class_id || '').trim()))
      .map(row => String(row.student_id || '').trim())
      .filter(Boolean)));
    const enrollmentEndStudentIds = Array.from(new Set(existingStudentIds.concat(oldSourceStudentIds)));
    if (enrollmentEndStudentIds.length) {
      const markers = enrollmentEndStudentIds.map(() => '?').join(',');
      statements.push(env.DB.prepare(`
        UPDATE student_enrollments
        SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP
        WHERE status = 'active' AND branch = 'apmath' AND student_id IN (${markers})
      `).bind(...enrollmentEndStudentIds));
    }
    if (existingStudentIds.length) {
      const markers = existingStudentIds.map(() => '?').join(',');
      statements.push(env.DB.prepare(`UPDATE students SET status = '재원', updated_at = CURRENT_TIMESTAMP WHERE id IN (${markers}) AND status = '입학예정'`).bind(...existingStudentIds));
    }

    for (const row of appliedAssignments) {
      statements.push(env.DB.prepare('INSERT OR IGNORE INTO class_students (class_id, student_id) VALUES (?, ?)').bind(row.class_id, row.student_id));
      statements.push(env.DB.prepare(`
        INSERT INTO student_enrollments
          (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount, memo)
        VALUES (?, ?, 'apmath', ?, 'active', DATE('now', '+9 hours'), NULL, NULL, ?)
      `).bind(makeId('enr'), row.student_id, row.class_id, '새학기 시간표 적용'));
    }

    const oldByStudent = new Map();
    for (const row of (oldClassRows.results || [])) {
      if (!oldByStudent.has(String(row.student_id))) oldByStudent.set(String(row.student_id), String(row.class_id));
    }
    for (const row of appliedAssignments) {
      const oldClassId = oldByStudent.get(String(row.source_student_id || row.student_id)) || null;
      if (oldClassId && oldClassId !== String(row.class_id)) {
        statements.push(env.DB.prepare(`
          INSERT INTO class_transfer_history
            (id, student_id, from_class_id, to_class_id, reason, changed_by)
          VALUES (?, ?, ?, ?, ?, ?)
        `).bind(makeId('ctr'), row.student_id, oldClassId, row.class_id, '새학기 시간표 적용', teacher?.id || teacher?.login_id || teacher?.name || null));
      }
    }

    if (activeVersion?.id && activeVersion.id !== versionId) {
      statements.push(env.DB.prepare(`UPDATE timetable_versions SET status = 'archived', effective_to = COALESCE(effective_to, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(activeVersion.id));
    }
    statements.push(env.DB.prepare(`
      UPDATE timetable_versions
      SET status = 'active', activated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, memo = COALESCE(memo, '')
      WHERE id = ?
    `).bind(versionId));
    statements.push(env.DB.prepare(`
      INSERT INTO timetable_version_apply_logs
        (id, academy_id, version_id, status, started_at, finished_at, summary_json, created_at)
      VALUES (?, 'apmath', ?, 'success', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)
    `).bind(makeId('tval'), versionId, JSON.stringify({ class_count: appliedClassByVersionClassId.size, assignment_count: appliedAssignments.length, slot_count: slots.length, removed_class_count: removedClasses.length, unassigned_student_count: unassignedStudentCount })));

    if (!statements.length) return jsonResponse({ success: false, error: 'no statements to apply' }, 400);
    await env.DB.batch(statements);

    return jsonResponse({
      success: true,
      timetable_version: await getVersion(env, versionId),
      activated_class_count: appliedClassByVersionClassId.size,
      activated_student_assignment_count: appliedAssignments.length,
      copied_slot_count: slots.length,
      removed_class_count: removedClasses.length,
      unassigned_student_count: unassignedStudentCount
    });
  } catch (error) {
    console.error('[activateVersionClassBased] failed:', error);
    await env.DB.prepare(`
      INSERT INTO timetable_version_apply_logs
        (id, academy_id, version_id, status, started_at, finished_at, error_message, created_at)
      VALUES (?, 'apmath', ?, 'failed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP)
    `).bind(makeId('tval'), versionId, String(error?.message || error).slice(0, 1000)).run();
    return jsonResponse({ success: false, error: 'timetable version activation failed' }, 500);
  }
}

async function buildTeacherClassMappingStmts(env, classIds) {
  if (!classIds.length) return [];
  const markers = classIds.map(() => '?').join(',');
  const classes = await env.DB.prepare(`SELECT id, teacher_name FROM classes WHERE id IN (${markers})`).bind(...classIds).all();
  const stmts = [
    env.DB.prepare(`DELETE FROM teacher_classes WHERE class_id IN (${markers})`).bind(...classIds)
  ];
  for (const cls of (classes.results || [])) {
    const matched = await findTeacherByAlias(env, cls.teacher_name);
    if (!matched) continue;
    stmts.push(env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(matched.id, cls.id));
  }
  return stmts;
}

async function activateVersion(env, versionId, teacher) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;
  const version = checked.version;
  const versionClassCount = await env.DB.prepare('SELECT COUNT(*) AS count FROM timetable_version_classes WHERE version_id = ?').bind(versionId).first();
  if (Number(versionClassCount?.count || 0) > 0) {
    // 안전장치: 초안이 현재 운영 명단과 다르면 적용하지 않는다.
    // (신입이 어느 반에도 못 들어가거나 퇴원생이 되살아나는 일을 막는다. 미배정 학생은 막지 않는다.)
    const diff = await loadRosterDiff(env, version);
    if (!diff.in_sync) {
      return jsonResponse({
        success: false,
        error: 'roster_mismatch',
        message: '개편안의 명단이 현재 운영 명단과 다릅니다. 먼저 현재 명단과 맞춰 주세요.',
        roster_diff: diff
      }, 409);
    }
    return activateVersionClassBased(env, versionId, teacher, version);
  }
  const [slotRows, assignmentRows, activeVersion, oldClassRows] = await Promise.all([
    listSlots(env, versionId),
    listStudentAssignments(env, versionId),
    env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first(),
    env.DB.prepare('SELECT class_id, student_id FROM class_students').all()
  ]);

  const assignmentClassIds = new Set(uniqueValues(assignmentRows, 'class_id'));
  const slotClassIds = uniqueValues(slotRows, 'class_id');
  const slotClassMarkers = slotClassIds.map(() => '?').join(',');
  let classById = new Map();
  if (slotClassIds.length) {
    const classRows = await env.DB.prepare(`SELECT id, name, grade, is_active FROM classes WHERE id IN (${slotClassMarkers})`).bind(...slotClassIds).all();
    classById = new Map((classRows.results || []).map(row => [String(row.id), row]));
  }
  const activeSlotRows = slotRows.filter(slot => {
    const classId = String(slot.class_id || '');
    if (assignmentClassIds.has(classId)) return true;
    const cls = classById.get(classId) || {};
    if (Number(cls.is_active) === 0) return true;
    return !isGraduatingMiddleSourceGrade(normalizeGradeLabel(cls.grade || cls.name || ''));
  });
  const classIds = [...new Set([...uniqueValues(activeSlotRows, 'class_id'), ...uniqueValues(assignmentRows, 'class_id')])];
  const studentIds = uniqueValues(assignmentRows, 'student_id');
  if (!classIds.length) return jsonResponse({ success: false, error: 'version has no classes' }, 400);

  // class_time_slots 전체 삭제 후 재삽입하는 구조이므로, 중간 실패 시 시간표가
  // 유실되지 않도록 모든 쓰기를 단일 batch(원자적 트랜잭션)로 모아 한 번에 실행한다.
  const teacherClassStmts = await buildTeacherClassMappingStmts(env, classIds);
  const classMarkers = classIds.map(() => '?').join(',');
  const stmts = [];

  stmts.push(env.DB.prepare('DELETE FROM class_time_slots'));
  for (const slot of activeSlotRows) {
    stmts.push(env.DB.prepare(`
      INSERT INTO class_time_slots
        (id, class_id, day_of_week, start_time, end_time, room_name, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(makeId('cts'), slot.class_id, slot.day_of_week, slot.start_time, slot.end_time, slot.room_name || null, slot.memo || 'activated from timetable version'));
  }

  stmts.push(env.DB.prepare(`UPDATE classes SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id IN (${classMarkers})`).bind(...classIds));
  stmts.push(...teacherClassStmts);

  if (assignmentRows.length) {
    stmts.push(env.DB.prepare(`DELETE FROM class_students WHERE class_id IN (${classMarkers})`).bind(...classIds));
    for (const row of assignmentRows) {
      stmts.push(env.DB.prepare('INSERT OR IGNORE INTO class_students (class_id, student_id) VALUES (?, ?)').bind(row.class_id, row.student_id));
    }
  }

  if (studentIds.length) {
    const studentMarkers = studentIds.map(() => '?').join(',');
    stmts.push(env.DB.prepare(`UPDATE students SET status = '재원', updated_at = CURRENT_TIMESTAMP WHERE id IN (${studentMarkers}) AND status = '입학예정'`).bind(...studentIds));
    stmts.push(env.DB.prepare(`
      UPDATE student_enrollments
      SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP
      WHERE status = 'active' AND branch = 'apmath' AND student_id IN (${studentMarkers})
    `).bind(...studentIds));

    for (const row of assignmentRows) {
      stmts.push(env.DB.prepare(`
        INSERT INTO student_enrollments
          (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount, memo)
        VALUES (?, ?, 'apmath', ?, 'active', DATE('now', '+9 hours'), NULL, NULL, ?)
      `).bind(makeId('enr'), row.student_id, row.class_id, '새학기 시간표 적용'));
    }
  }

  const oldByStudent = new Map();
  for (const row of (oldClassRows.results || [])) {
    if (!oldByStudent.has(String(row.student_id))) oldByStudent.set(String(row.student_id), String(row.class_id));
  }
  for (const row of assignmentRows) {
    const oldClassId = oldByStudent.get(String(row.student_id)) || null;
    if (oldClassId && oldClassId !== String(row.class_id)) {
      stmts.push(env.DB.prepare(`
        INSERT INTO class_transfer_history
          (id, student_id, from_class_id, to_class_id, reason, changed_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(makeId('ctr'), row.student_id, oldClassId, row.class_id, '새학기 시간표 적용', teacher?.id || teacher?.login_id || teacher?.name || null));
    }
  }

  if (activeVersion?.id && activeVersion.id !== versionId) {
    stmts.push(env.DB.prepare(`UPDATE timetable_versions SET status = 'archived', effective_to = COALESCE(effective_to, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(activeVersion.id));
  }
  stmts.push(env.DB.prepare(`
    UPDATE timetable_versions
    SET status = 'active', activated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, memo = COALESCE(memo, '')
    WHERE id = ?
  `).bind(versionId));

  await env.DB.batch(stmts);

  return jsonResponse({
    success: true,
    timetable_version: await getVersion(env, versionId),
    activated_class_count: classIds.length,
    activated_student_assignment_count: assignmentRows.length,
    copied_slot_count: activeSlotRows.length
  });
}

async function copyClassTimeSlotsToVersion(env, versionId) {
  const countRow = await env.DB.prepare('SELECT COUNT(*) AS count FROM class_time_slots').first();
  await env.DB.prepare(`
    INSERT INTO timetable_version_slots
      (id, version_id, class_id, day_of_week, start_time, end_time, room_name, memo)
    SELECT
      'tvs_' || unixepoch('now') || '_' || lower(hex(randomblob(4))),
      ?,
      class_id,
      day_of_week,
      start_time,
      end_time,
      room_name,
      memo
    FROM class_time_slots
  `).bind(versionId).run();
  return Number(countRow?.count || 0);
}

async function ensureActiveVersion(env, teacher, body = {}) {
  const existing = await env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first();
  if (existing) return { created: false, timetable_version: existing, copied_slots: 0 };

  const schoolYear = normalizeSchoolYear(body.school_year);
  const version = {
    id: makeId('ttv'),
    school_year: schoolYear,
    title: String(body.title || `${schoolYear} 운영 시간표`).trim(),
    status: 'active',
    source_version_id: null,
    effective_from: body.effective_from || `${schoolYear}-01-01`,
    effective_to: body.effective_to || null,
    created_by: teacher?.id || null,
    memo: body.memo || null
  };

  await env.DB.prepare(`
    INSERT INTO timetable_versions
      (id, school_year, title, status, source_version_id, effective_from, effective_to, created_by, memo, activated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    version.id,
    version.school_year,
    version.title,
    version.status,
    version.source_version_id,
    version.effective_from,
    version.effective_to,
    version.created_by,
    version.memo
  ).run();
  const copiedSlots = await copyClassTimeSlotsToVersion(env, version.id);
  return { created: true, timetable_version: await getVersion(env, version.id), copied_slots: copiedSlots };
}

function pushPreviewConflict(conflicts, type, targetId, classA, classB, dayOfWeek, start, end) {
  const [classAId, classBId] = uniqSortedPair(classA, classB);
  conflicts.push({
    conflict_type: type,
    target_id: targetId || '',
    class_a_id: classAId,
    class_b_id: classBId,
    day_of_week: dayOfWeek,
    overlap_start: start,
    overlap_end: end,
    severity: 'warning',
    status: 'preview'
  });
}

async function scanPreview(env, versionId) {
  const version = await getVersion(env, versionId);
  if (version) {
    await ensureVersionClassesSeeded(env, version);
    await ensureVersionSlotsMapped(env, version);
    await ensureVersionAssignmentsMapped(env, version);
  }
  const [slotsRes, assignmentsRes, versionClassesRes] = await Promise.all([
    env.DB.prepare(`
      SELECT tvs.*
      FROM timetable_version_slots tvs
      LEFT JOIN timetable_version_classes tvc ON tvc.id = tvs.version_class_id
      WHERE tvs.version_id = ?
        AND (tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN ('excluded', 'graduating_excluded', 'removed'))
      ORDER BY tvs.day_of_week, tvs.start_time
    `).bind(versionId).all(),
    env.DB.prepare(`
      SELECT a.*
      FROM timetable_version_student_assignments a
      LEFT JOIN timetable_version_classes tvc ON tvc.id = a.version_class_id
      WHERE a.version_id = ?
        AND (tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN ('excluded', 'graduating_excluded', 'removed'))
        AND COALESCE(a.excluded_reason, '') = ''
    `).bind(versionId).all(),
    env.DB.prepare('SELECT id, source_class_id, teacher_name_snapshot FROM timetable_version_classes WHERE version_id = ?').bind(versionId).all()
  ]);
  const slots = slotsRes.results || [];
  const assignments = assignmentsRes.results || [];
  const versionClasses = versionClassesRes.results || [];
  const classMap = new Map();
  for (const cls of versionClasses) {
    if (cls.id) classMap.set(String(cls.id), cls);
    if (cls.source_class_id) classMap.set(String(cls.source_class_id), cls);
  }
  const slotsByClass = new Map();
  const assignmentsByStudent = new Map();
  const conflicts = [];

  const getSlotClassKey = (slot) => String(slot.version_class_id || slot.class_id || '');
  const getAssignmentClassKey = (assignment) => String(assignment.version_class_id || assignment.class_id || '');

  for (const slot of slots) {
    const classKey = getSlotClassKey(slot);
    if (!classKey) continue;
    const list = slotsByClass.get(classKey) || [];
    list.push(slot);
    slotsByClass.set(classKey, list);
  }

  for (const assignment of assignments) {
    const studentKey = String(assignment.student_id || assignment.temp_student_id || '');
    if (!studentKey) continue;
    const list = assignmentsByStudent.get(studentKey) || [];
    list.push(assignment);
    assignmentsByStudent.set(studentKey, list);
  }

  for (const [studentId, list] of assignmentsByStudent.entries()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (const a of (slotsByClass.get(getAssignmentClassKey(list[i])) || [])) {
          for (const b of (slotsByClass.get(getAssignmentClassKey(list[j])) || [])) {
            if (a.day_of_week !== b.day_of_week || !isTimeOverlap(a.start_time, a.end_time, b.start_time, b.end_time)) continue;
            const range = overlapRange(a, b);
            pushPreviewConflict(conflicts, 'student', studentId, getSlotClassKey(a), getSlotClassKey(b), a.day_of_week, range.start, range.end);
          }
        }
      }
    }
  }

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      const classAKey = getSlotClassKey(a);
      const classBKey = getSlotClassKey(b);
      if (!classAKey || !classBKey || classAKey === classBKey || a.day_of_week !== b.day_of_week || !isTimeOverlap(a.start_time, a.end_time, b.start_time, b.end_time)) continue;
      const range = overlapRange(a, b);
      const teacherA = String(classMap.get(classAKey)?.teacher_name_snapshot || '').trim();
      const teacherB = String(classMap.get(classBKey)?.teacher_name_snapshot || '').trim();
      if (teacherA && teacherA === teacherB) {
        pushPreviewConflict(conflicts, 'teacher', teacherA, classAKey, classBKey, a.day_of_week, range.start, range.end);
      }
      if (a.room_name && a.room_name === b.room_name) {
        pushPreviewConflict(conflicts, 'room', a.room_name, classAKey, classBKey, a.day_of_week, range.start, range.end);
      }
    }
  }

  const counts = { student: 0, teacher: 0, room: 0, total: conflicts.length };
  for (const conflict of conflicts) {
    if (Object.prototype.hasOwnProperty.call(counts, conflict.conflict_type)) counts[conflict.conflict_type] += 1;
  }
  return { conflicts, counts };
}

// ───────────────────────── 현재 명단과 맞추기 (roster) ─────────────────────────
// 초안은 만든 시점의 운영 명단을 복사해 두므로 시간이 지나면 낡는다.
// computeRosterDiff는 DB 호출 없이 "초안"과 "현재 운영"을 비교하는 순수 함수이고,
// roster-diff(조회)·roster-sync(반영)·activate(적용 전 차단)가 모두 이 결과 하나를 쓴다.
function rosterKey(value) {
  return String(value ?? '').trim();
}

function rosterClassLabel(vc) {
  return rosterKey(vc?.name_snapshot || vc?.source_name || vc?.id);
}

function compareRosterNames(a, b) {
  return String(a.student_name || '').localeCompare(String(b.student_name || ''), 'ko') || String(a.student_id).localeCompare(String(b.student_id));
}

function isGraduationExcludedStatus(vc) {
  const status = rosterKey(vc?.status || 'draft').toLowerCase();
  return status === 'excluded' || status === 'graduating_excluded';
}

export function isUntouchedDraftAssignment(row = {}, vcBySource = new Map()) {
  if (rosterKey(row.temp_student_id)) return false;
  if (rosterKey(row.excluded_reason)) return false;
  const note = safeParseMemoJson(row.memo, 'roster untouched memo').note;
  if (!UNTOUCHED_NOTES.has(String(note || ''))) return false;
  const sourceVc = vcBySource.get(rosterKey(row.source_class_id));
  // 원장이 다른 반으로 옮겼다면 version_class_id가 원래 소속 반과 달라진다.
  return !!sourceVc && rosterKey(sourceVc.id) === rosterKey(row.version_class_id);
}

export function computeRosterDiff({ versionClasses = [], assignments = [], memberships = [], students = [], opsClasses = null } = {}) {
  const vcById = new Map();
  const vcBySource = new Map();
  for (const vc of versionClasses) {
    vcById.set(rosterKey(vc.id), vc);
    const src = rosterKey(vc.source_class_id);
    if (src && !vcBySource.has(src)) vcBySource.set(src, vc);
  }
  const studentMap = new Map(students.map(st => [rosterKey(st.id), st]));
  const assignmentByStudent = new Map();
  for (const row of assignments) {
    if (rosterKey(row.temp_student_id)) continue;
    const sid = rosterKey(row.student_id);
    if (sid) assignmentByStudent.set(sid, row);
  }

  // (2) 초안에 있는데 지금은 퇴원·제적(또는 학생 기록 자체가 없는) 학생
  const withdrawn = [];
  for (const [sid, row] of assignmentByStudent.entries()) {
    const st = studentMap.get(sid);
    const gone = !st;
    if (!gone && !isWithdrawnStudentStatus(st.status)) continue;
    const vc = vcById.get(rosterKey(row.version_class_id));
    withdrawn.push({
      student_id: sid,
      student_name: rosterKey(st?.name || row.student_name_snapshot) || sid,
      status: gone ? 'missing' : rosterKey(st.status),
      class_name: vc ? rosterClassLabel(vc) : '미배정',
      version_class_id: rosterKey(row.version_class_id) || null
    });
  }

  const membershipsByStudent = new Map();
  for (const m of memberships) {
    const sid = rosterKey(m.student_id);
    if (!sid) continue;
    if (!membershipsByStudent.has(sid)) membershipsByStudent.set(sid, []);
    membershipsByStudent.get(sid).push(m);
  }

  const newcomers = [];
  const moves = [];
  const multiClass = [];
  for (const [sid, list] of membershipsByStudent.entries()) {
    const st = studentMap.get(sid);
    if (!st || isWithdrawnStudentStatus(st.status)) continue;
    const seen = new Set();
    const mapped = [];
    for (const m of list) {
      const cid = rosterKey(m.class_id);
      if (!cid || seen.has(cid)) continue;
      seen.add(cid);
      mapped.push({ cid, name: rosterKey(m.class_name), vc: vcBySource.get(cid) || null });
    }
    // 졸업(중3) 반만 듣는 학생은 개편안에 일부러 없는 것이므로 누락으로 보지 않는다.
    const candidates = mapped.filter(x => !(x.vc && isGraduationExcludedStatus(x.vc)));
    if (!candidates.length) continue;
    const renderableMapped = candidates.filter(x => x.vc && isRenderableVersionClass(x.vc));

    // (3) 두 반 이상 수강: 초안은 학생당 반 하나만 저장하므로 알려 주기만 한다.
    const countable = candidates.filter(x => !x.vc || isRenderableVersionClass(x.vc));
    if (countable.length >= 2) {
      multiClass.push({ student_id: sid, student_name: rosterKey(st.name) || sid, class_names: countable.map(x => x.name) });
    }

    const row = assignmentByStudent.get(sid);
    if (!row) {
      // (1) 운영에는 재원인데 초안에는 없는 학생(신입·재등록). 미배정 행이 있으면 "초안에 있는 학생"이므로 여기 오지 않는다.
      const target = renderableMapped[0] || null;
      newcomers.push({
        student_id: sid,
        student_name: rosterKey(st.name) || sid,
        grade: rosterKey(st.grade),
        ops_class_id: (target || candidates[0]).cid,
        ops_class_names: candidates.map(x => x.name),
        target_version_class_id: target ? rosterKey(target.vc.id) : null,
        target_class_name: target ? rosterClassLabel(target.vc) : null
      });
      continue;
    }
    // 운영에서 반을 옮겼고 원장이 초안에서 손대지 않은 학생만 새 반을 따라간다.
    if (isUntouchedDraftAssignment(row, vcBySource) && renderableMapped.length) {
      const currentId = rosterKey(row.version_class_id);
      if (!renderableMapped.some(x => rosterKey(x.vc.id) === currentId)) {
        const to = renderableMapped[0];
        const from = vcById.get(currentId);
        moves.push({
          student_id: sid,
          student_name: rosterKey(st.name) || sid,
          from_version_class_id: currentId,
          from_class_name: from ? rosterClassLabel(from) : '',
          to_version_class_id: rosterKey(to.vc.id),
          to_class_name: rosterClassLabel(to.vc),
          ops_class_id: to.cid
        });
      }
    }
  }
  // (4) 개편안을 만든 뒤 운영에서 새로 연 활성 반: 어떤 개편안 반과도 source_class_id가 맞지 않는 반.
  // 개편안에서 삭제한(removed) 반이나 졸업(excluded) 반은 source 행이 남아 있어 여기에 걸리지 않는다.
  const newClasses = (Array.isArray(opsClasses) ? opsClasses : [])
    .filter(c => rosterKey(c.id) && !vcBySource.has(rosterKey(c.id)))
    .map(c => ({ ops_class_id: rosterKey(c.id), name: rosterKey(c.name) }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ko') || a.ops_class_id.localeCompare(b.ops_class_id));
  // (5) 개편안을 만든 뒤 운영에서 닫힌(is_active=0) 반이 개편안에 남아 있으면 적용 때 활성 반으로 되살아난다.
  // 원장이 되살린 반(memo.restored_by_director)은 다시 지우지 않는다. opsClasses를 안 넘긴 호출에서는 판정하지 않는다.
  let closedClasses = [];
  if (Array.isArray(opsClasses)) {
    const activeIds = new Set(opsClasses.map(c => rosterKey(c.id)));
    closedClasses = versionClasses
      .filter(vc => rosterKey(vc.source_class_id) && isRenderableVersionClass(vc) && !activeIds.has(rosterKey(vc.source_class_id)))
      .filter(vc => !safeParseMemoJson(vc.memo, 'roster closed memo').restored_by_director)
      .map(vc => ({ version_class_id: rosterKey(vc.id), ops_class_id: rosterKey(vc.source_class_id), name: rosterClassLabel(vc) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko') || a.version_class_id.localeCompare(b.version_class_id));
  }
  newcomers.sort(compareRosterNames);
  withdrawn.sort(compareRosterNames);
  moves.sort(compareRosterNames);
  multiClass.sort(compareRosterNames);
  return {
    newcomers,
    withdrawn,
    moves,
    multi_class: multiClass,
    new_classes: newClasses,
    closed_classes: closedClasses,
    in_sync: !newcomers.length && !withdrawn.length && !moves.length && !newClasses.length && !closedClasses.length
  };
}

async function loadRosterInputs(env, version) {
  await ensureVersionClassesSeeded(env, version);
  await ensureVersionAssignmentsMapped(env, version);
  const [versionClasses, assignRes, memberRes, studentRes, opsClassRes] = await Promise.all([
    listVersionClasses(env, version.id),
    env.DB.prepare('SELECT * FROM timetable_version_student_assignments WHERE version_id = ?').bind(version.id).all(),
    env.DB.prepare(`
      SELECT cs.class_id, cs.student_id, c.name AS class_name
      FROM class_students cs
      JOIN classes c ON c.id = cs.class_id
      WHERE COALESCE(c.is_active, 1) != 0
      ORDER BY cs.class_id ASC, cs.student_id ASC
    `).all(),
    env.DB.prepare('SELECT id, name, status, grade FROM students').all(),
    env.DB.prepare('SELECT * FROM classes WHERE COALESCE(is_active, 1) != 0 ORDER BY grade ASC, name ASC, id ASC').all()
  ]);
  return {
    versionClasses,
    assignments: assignRes.results || [],
    memberships: memberRes.results || [],
    students: studentRes.results || [],
    opsClasses: opsClassRes.results || []
  };
}

function summarizeRosterSync(diff, importedClasses = []) {
  const added = diff.newcomers.map(n => ({
    student_id: n.student_id,
    student_name: n.student_name,
    class_name: n.target_class_name,
    unassigned: !n.target_version_class_id,
    ops_class_names: n.ops_class_names
  }));
  const removed = diff.withdrawn.map(w => ({ student_id: w.student_id, student_name: w.student_name, status: w.status, class_name: w.class_name }));
  const moved = diff.moves.map(m => ({ student_id: m.student_id, student_name: m.student_name, from_class_name: m.from_class_name, to_class_name: m.to_class_name }));
  const addedClasses = importedClasses.map(c => ({ class_id: c.id, name: c.name_snapshot || c.source_name || '' }));
  const closedClasses = (diff.closed_classes || []).map(c => ({ class_id: c.version_class_id, name: c.name }));
  return {
    added,
    removed,
    moved,
    added_classes: addedClasses,
    closed_classes: closedClasses,
    changed: added.length + removed.length + moved.length + addedClasses.length + closedClasses.length
  };
}

function buildRosterSyncStatements(env, versionId, diff, inputs) {
  const vcById = new Map(inputs.versionClasses.map(vc => [rosterKey(vc.id), vc]));
  const studentMap = new Map(inputs.students.map(st => [rosterKey(st.id), st]));
  const statements = [];

  for (const w of diff.withdrawn) {
    statements.push(env.DB.prepare(`
      DELETE FROM timetable_version_student_assignments
      WHERE version_id = ? AND student_id = ? AND (temp_student_id IS NULL OR temp_student_id = '')
    `).bind(versionId, w.student_id));
  }

  for (const n of diff.newcomers) {
    const st = studentMap.get(n.student_id) || {};
    const vc = n.target_version_class_id ? vcById.get(n.target_version_class_id) : null;
    const sourceGrade = normalizeGradeLabel((vc && vc.source_grade) || st.grade || '');
    const nextGrade = normalizeGradeLabel((vc && vc.next_grade) || getNextSemesterGrade(sourceGrade));
    const classId = vc ? getVersionClassCompatClassId(vc) : UNASSIGNED_CLASS_ID;
    statements.push(env.DB.prepare(`
      INSERT OR IGNORE INTO timetable_version_student_assignments
        (id, version_id, class_id, version_class_id, student_id, student_name_snapshot, source_class_id, source_grade, next_grade, excluded_reason, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      makeId('tvsa'),
      versionId,
      classId,
      vc ? vc.id : UNASSIGNED_CLASS_ID,
      n.student_id,
      n.student_name || null,
      n.ops_class_id || null,
      sourceGrade || null,
      nextGrade || null,
      vc ? null : UNASSIGNED_REASON,
      buildDraftStudentAssignmentMemo(sourceGrade, nextGrade, SYNC_NOTE, n.student_name || '')
    ));
  }

  for (const m of diff.moves) {
    const vc = vcById.get(m.to_version_class_id);
    if (!vc) continue;
    statements.push(env.DB.prepare(`
      UPDATE timetable_version_student_assignments
      SET class_id = ?, version_class_id = ?, source_class_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE version_id = ? AND student_id = ? AND (temp_student_id IS NULL OR temp_student_id = '')
    `).bind(getVersionClassCompatClassId(vc), vc.id, m.ops_class_id, versionId, m.student_id));
  }

  // 운영에서 닫힌 반은 removed로 바꾸고 남은 학생은 미배정으로 보낸다(위 이동이 먼저 실행되므로 옮겨 간 학생은 영향 없음).
  for (const c of (diff.closed_classes || [])) {
    statements.push(env.DB.prepare(`
      UPDATE timetable_version_student_assignments
      SET class_id = ?, version_class_id = ?, excluded_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE version_id = ? AND version_class_id = ?
    `).bind(UNASSIGNED_CLASS_ID, UNASSIGNED_CLASS_ID, UNASSIGNED_REASON, versionId, c.version_class_id));
    statements.push(env.DB.prepare("UPDATE timetable_version_classes SET status = 'removed', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND version_id = ?").bind(c.version_class_id, versionId));
  }
  return statements;
}

async function loadRosterDiff(env, version) {
  return computeRosterDiff(await loadRosterInputs(env, version));
}

// 여러 번 실행해도 결과가 같다(멱등): 두 번째부터는 바꿀 것이 없다.
async function importNewOperationalClasses(env, version, inputs, newClasses) {
  const wanted = new Set(newClasses.map(c => c.ops_class_id));
  const sources = inputs.opsClasses.filter(c => wanted.has(rosterKey(c.id)));
  if (!sources.length) return [];
  const sortBase = inputs.versionClasses.reduce((max, vc) => Math.max(max, Number(vc.sort_order) || 0), 0) + 1;
  const rows = buildSeedVersionClassRows(version.id, sources, 'apmath', sortBase);
  const slotStatements = await buildOperationalSlotStatements(env, version.id, rows, wanted);
  // 반과 슬롯은 한 번에 넣는다. 중간에 끊겨도 다음 갱신이 이어서 가져온다.
  await env.DB.batch(buildVersionClassInsertStatements(env, rows).concat(slotStatements));
  return rows;
}

// 여러 번 실행해도 결과가 같다(멱등): 두 번째부터는 바꿀 것이 없다.
async function syncDraftRoster(env, version) {
  let inputs = await loadRosterInputs(env, version);
  let diff = computeRosterDiff(inputs);
  let importedClasses = [];
  if (diff.new_classes.length) {
    importedClasses = await importNewOperationalClasses(env, version, inputs, diff.new_classes);
    // 새 반이 들어왔으니 학생 비교를 다시 한다(그 반 학생은 미배정이 아니라 그 반으로 들어간다).
    inputs = await loadRosterInputs(env, version);
    diff = computeRosterDiff(inputs);
  }
  const statements = buildRosterSyncStatements(env, version.id, diff, inputs);
  if (statements.length) await env.DB.batch(statements);
  return { roster_sync: summarizeRosterSync(diff, importedClasses), roster_multi_class: diff.multi_class };
}

// ───────────────────────── 미배정 · 반 삭제/복원 · 반 수정 ─────────────────────────
async function listUnassignedStudents(env, versionId) {
  const res = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_student_assignments
    WHERE version_id = ? AND COALESCE(excluded_reason, '') = ? AND version_class_id = ?
    ORDER BY student_name_snapshot ASC, student_id ASC
  `).bind(versionId, UNASSIGNED_REASON, UNASSIGNED_CLASS_ID).all();
  return res.results || [];
}

async function listRemovedClasses(env, versionId) {
  const rows = await listVersionClasses(env, versionId);
  return rows.filter(row => String(row.status || '').trim().toLowerCase() === 'removed');
}

async function buildDraftListsPayload(env, versionId) {
  return {
    timetable_version_student_assignments: await listStudentAssignments(env, versionId, null, { renderableOnly: true }),
    timetable_version_unassigned_students: await listUnassignedStudents(env, versionId),
    timetable_version_removed_classes: await listRemovedClasses(env, versionId)
  };
}

async function unassignDraftStudent(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;
  const studentId = String(body.student_id || body.studentId || body.temp_student_id || body.tempStudentId || '').trim();
  if (!studentId) return jsonResponse({ success: false, error: 'student_id required' }, 400);
  const row = await env.DB.prepare(`
    SELECT * FROM timetable_version_student_assignments
    WHERE version_id = ? AND (student_id = ? OR temp_student_id = ?)
    LIMIT 1
  `).bind(versionId, studentId, studentId).first();
  if (!row) return jsonResponse({ success: false, error: 'student not in draft' }, 404);
  const memo = JSON.stringify({ ...safeParseMemoJson(row.memo, 'unassignDraftStudent memo'), note: 'draft student unassigned' });
  await env.DB.prepare(`
    UPDATE timetable_version_student_assignments
    SET class_id = ?, version_class_id = ?, excluded_reason = ?, memo = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(UNASSIGNED_CLASS_ID, UNASSIGNED_CLASS_ID, UNASSIGNED_REASON, memo, row.id).run();
  return jsonResponse({ success: true, version_id: versionId, student_id: studentId, ...(await buildDraftListsPayload(env, versionId)) });
}

async function removeDraftClass(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;
  await ensureVersionClassesSeeded(env, checked.version);
  const classId = String(body.class_id || body.classId || body.version_class_id || body.versionClassId || '').trim();
  if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
  const versionClass = await getVersionClassByAnyId(env, versionId, classId);
  if (!versionClass || !isRenderableVersionClass(versionClass)) return jsonResponse({ success: false, error: 'draft class not found' }, 404);

  const countRow = await env.DB.prepare(`
    SELECT COUNT(*) AS count FROM timetable_version_student_assignments WHERE version_id = ? AND version_class_id = ?
  `).bind(versionId, versionClass.id).first();
  const statements = [
    env.DB.prepare(`
      UPDATE timetable_version_student_assignments
      SET class_id = ?, version_class_id = ?, excluded_reason = ?, updated_at = CURRENT_TIMESTAMP
      WHERE version_id = ? AND version_class_id = ?
    `).bind(UNASSIGNED_CLASS_ID, UNASSIGNED_CLASS_ID, UNASSIGNED_REASON, versionId, versionClass.id)
  ];
  const brandNew = !String(versionClass.source_class_id || '').trim();
  if (brandNew) {
    // 초안에서 새로 만든 반은 운영에 원본이 없으므로 행과 슬롯을 지운다.
    statements.push(env.DB.prepare('DELETE FROM timetable_version_slots WHERE version_id = ? AND (version_class_id = ? OR class_id = ?)').bind(versionId, versionClass.id, versionClass.id));
    statements.push(env.DB.prepare('DELETE FROM timetable_version_classes WHERE id = ? AND version_id = ?').bind(versionClass.id, versionId));
  } else {
    // 운영 반에서 온 반은 removed로 두어야 적용 때 원래 운영 반을 닫을 수 있다.
    statements.push(env.DB.prepare("UPDATE timetable_version_classes SET status = 'removed', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND version_id = ?").bind(versionClass.id, versionId));
  }
  await env.DB.batch(statements);
  return jsonResponse({
    success: true,
    version_id: versionId,
    class_id: getVersionClassCompatClassId(versionClass),
    version_class_id: versionClass.id,
    deleted: brandNew,
    unassigned_count: Number(countRow?.count || 0),
    ...(await buildDraftListsPayload(env, versionId))
  });
}

async function restoreDraftClass(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;
  const classId = String(body.class_id || body.classId || body.version_class_id || body.versionClassId || '').trim();
  if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
  const versionClass = await getVersionClassByAnyId(env, versionId, classId);
  if (!versionClass || String(versionClass.status || '').trim().toLowerCase() !== 'removed') {
    return jsonResponse({ success: false, error: 'removed class not found' }, 404);
  }
  const restoredStatus = Number(versionClass.is_new || 0) === 1 ? 'new' : 'draft';
  // 원장이 직접 되살린 반은 표시를 남겨, 운영에서 닫힌 반이라도 다음 명단 갱신이 다시 지우지 않게 한다.
  const restoredMemo = JSON.stringify({ ...safeParseMemoJson(versionClass.memo, 'restoreDraftClass memo'), restored_by_director: true });
  await env.DB.prepare('UPDATE timetable_version_classes SET status = ?, memo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(restoredStatus, restoredMemo, versionClass.id).run();
  const restored = await env.DB.prepare('SELECT * FROM timetable_version_classes WHERE id = ?').bind(versionClass.id).first();
  return jsonResponse({
    success: true,
    version_id: versionId,
    timetable_version_class: restored,
    class: versionClassCompatClassRow(restored),
    timetable_version_slots: await listSlots(env, versionId, restored.id),
    ...(await buildDraftListsPayload(env, versionId))
  });
}

async function updateDraftClass(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;
  const classId = String(body.class_id || body.classId || body.version_class_id || body.versionClassId || '').trim();
  if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
  const versionClass = await getVersionClassByAnyId(env, versionId, classId);
  if (!versionClass || !isRenderableVersionClass(versionClass)) return jsonResponse({ success: false, error: 'draft class not found' }, 404);

  const has = key => Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined;
  const sets = [];
  const params = [];
  if (has('name')) {
    const name = String(body.name || '').trim();
    if (!name) return jsonResponse({ success: false, error: 'name required' }, 400);
    sets.push('name_snapshot = ?');
    params.push(name);
  }
  if (has('grade')) {
    const grade = normalizeTimetableGrade(body.grade);
    // 화면과 적용은 next_grade를 먼저 쓴다. 초안에서 새로 만든 반은 원본 학년이 없으므로 같이 맞춘다.
    sets.push('next_grade = ?');
    params.push(grade || null);
    if (!String(versionClass.source_class_id || '').trim()) {
      sets.push('grade_snapshot = ?');
      params.push(grade || null);
    }
  }
  if (has('teacher_name') || has('teacherName')) {
    sets.push('teacher_name_snapshot = ?');
    params.push(String(body.teacher_name ?? body.teacherName ?? '').trim() || null);
  }
  if (has('subject')) {
    sets.push('subject_snapshot = ?');
    params.push(String(body.subject || '').trim() || null);
  }
  if (has('textbook')) {
    const memo = safeParseMemoJson(versionClass.memo, 'updateDraftClass memo');
    const textbook = String(body.textbook || '').trim();
    if (textbook) memo.textbook = textbook; else delete memo.textbook;
    sets.push('memo = ?');
    params.push(Object.keys(memo).length ? JSON.stringify(memo) : null);
  }
  if (!sets.length) return jsonResponse({ success: false, error: 'nothing to update' }, 400);
  sets.push('updated_at = CURRENT_TIMESTAMP');
  await env.DB.prepare(`UPDATE timetable_version_classes SET ${sets.join(', ')} WHERE id = ?`).bind(...params, versionClass.id).run();
  const saved = await env.DB.prepare('SELECT * FROM timetable_version_classes WHERE id = ?').bind(versionClass.id).first();
  return jsonResponse({
    success: true,
    version_id: versionId,
    timetable_version_class: saved,
    class: versionClassCompatClassRow(saved)
  });
}

// ───────────────────────── 새 초안 만들기 (운영 기준) ─────────────────────────
// 반의 요일·시간은 직전 버전 슬롯이 아니라 "현재 운영 class_time_slots"에서 복사한다.
// 운영에서 직접 고친 시간이 초안에 반영되려면 이쪽이 맞다.
async function buildOperationalSlotStatements(env, versionId, versionClasses, onlySourceClassIds = null) {
  const map = mapSourceClassToVersionClass(versionClasses);
  const res = await env.DB.prepare('SELECT * FROM class_time_slots ORDER BY day_of_week ASC, start_time ASC, class_id ASC').all();
  const statements = [];
  for (const slot of (res.results || [])) {
    const sourceClassId = String(slot.class_id || '').trim();
    if (onlySourceClassIds && !onlySourceClassIds.has(sourceClassId)) continue;
    const versionClass = map.get(sourceClassId);
    if (!versionClass || !isRenderableVersionClass(versionClass)) continue;
    statements.push(env.DB.prepare(`
      INSERT INTO timetable_version_slots
        (id, version_id, class_id, version_class_id, source_class_id, day_of_week, start_time, end_time, room_name, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      makeId('tvs'),
      versionId,
      getVersionClassCompatClassId(versionClass),
      versionClass.id,
      sourceClassId,
      slot.day_of_week,
      slot.start_time,
      slot.end_time,
      slot.room_name || null,
      slot.memo || null
    ));
  }
  return statements;
}

async function copyOperationalSlotsToVersion(env, version) {
  const versionClasses = await ensureVersionClassesSeeded(env, version);
  const statements = await buildOperationalSlotStatements(env, version.id, versionClasses);
  if (statements.length) await env.DB.batch(statements);
  return statements.length;
}

async function seedDraftFromOperations(env, versionId) {
  const createdVersion = await getVersion(env, versionId);
  const versionClasses = await ensureVersionClassesSeeded(env, createdVersion);
  const copiedSlots = await copyOperationalSlotsToVersion(env, createdVersion);
  const copiedStudentAssignments = await copyClassStudentsToVersion(env, createdVersion);
  return {
    success: true,
    timetable_version: await getVersion(env, versionId),
    timetable_version_classes: await listVersionClasses(env, versionId),
    timetable_classes: versionClasses.filter(isRenderableVersionClass).map(versionClassCompatClassRow),
    copied_version_classes: versionClasses.length,
    copied_slots: copiedSlots,
    copied_student_assignments: copiedStudentAssignments
  };
}

async function findLineageSourceVersion(env, teacher) {
  let sourceVersion = await env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first();
  if (!sourceVersion) {
    const ensured = await ensureActiveVersion(env, teacher, { school_year: currentSchoolYear() });
    sourceVersion = ensured.timetable_version;
  }
  return sourceVersion;
}

async function restartDraftVersion(env, teacher, id) {
  const old = await getVersion(env, id);
  if (!old) return jsonResponse({ success: false, error: 'Not found' }, 404);
  if (!EDITABLE_STATUSES.has(String(old.status || ''))) {
    return jsonResponse({ success: false, error: 'only draft or scheduled version can be restarted' }, 400);
  }
  const sourceVersion = (old.source_version_id && await getVersion(env, old.source_version_id)) || await findLineageSourceVersion(env, teacher);
  const versionId = makeId('ttv');
  const nowIso = new Date().toISOString();
  // 이전 초안 취소와 새 초안 생성은 한 번에: 중간에 끊겨도 초안이 둘 다 열려 있거나 둘 다 없는 상태가 되지 않는다.
  await env.DB.batch([
    env.DB.prepare("UPDATE timetable_versions SET status = 'cancelled', cancelled_at = ?, updated_at = ? WHERE id = ?").bind(nowIso, nowIso, id),
    env.DB.prepare(`
      INSERT INTO timetable_versions
        (id, school_year, title, status, source_version_id, effective_from, effective_to, created_by, memo)
      VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)
    `).bind(versionId, old.school_year, old.title, sourceVersion?.id || old.source_version_id || null, old.effective_from || null, old.effective_to || null, teacher?.id || null, old.memo || null)
  ]);
  const seeded = await seedDraftFromOperations(env, versionId);
  return jsonResponse({ ...seeded, restarted_from_version_id: id });
}

// ───────────────────────── 적용 예약 · 적용일 자동 반영 ─────────────────────────
// 한국 시간(KST, UTC+9) 기준 날짜 YYYY-MM-DD. cron은 UTC 15:05(= KST 0:05)에 돌므로 UTC 날짜로 보면 하루 어긋난다.
export function kstDateString(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

const AUTO_APPLY_ACTOR = { id: 'system-scheduler', login_id: 'system-scheduler', name: '자동 적용', role: 'admin' };
const AUTO_APPLY_LOG_STATUSES = ['auto_success', 'auto_failed'];

async function writeAutoApplyLog(env, version, status, summary) {
  const id = makeId('tval');
  await env.DB.prepare(`
    INSERT INTO timetable_version_apply_logs
      (id, academy_id, version_id, status, started_at, finished_at, error_message, summary_json, created_at)
    VALUES (?, 'apmath', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, CURRENT_TIMESTAMP)
  `).bind(id, version.id, status, summary.error ? String(summary.error).slice(0, 1000) : null, JSON.stringify(summary)).run();
  return id;
}

function summarizeRosterSyncForLog(result) {
  const sync = result?.roster_sync || {};
  return {
    changed: Number(sync.changed || 0),
    added: (sync.added || []).map(r => ({ name: r.student_name, class_name: r.class_name || null, unassigned: !!r.unassigned })),
    removed: (sync.removed || []).map(r => r.student_name),
    moved: (sync.moved || []).map(r => r.student_name),
    added_classes: (sync.added_classes || []).map(r => r.name),
    closed_classes: (sync.closed_classes || []).map(r => r.name)
  };
}

async function autoApplyScheduledVersion(env, versionId, today) {
  // 다시 읽어서 아직 예약 상태일 때만 진행한다(그 사이 원장이 직접 적용·취소했으면 건너뜀 → 중복 적용 없음).
  const version = await getVersion(env, versionId);
  if (!version || version.status !== 'scheduled') return { version_id: versionId, skipped: true };
  const summary = { source: 'scheduled', applied_on: today, title: version.title, effective_from: version.effective_from };
  try {
    // 짜는 동안 바뀐 명단을 먼저 맞춘다. 맞추지 못하면 낡은 명단으로 적용하지 않는다.
    const syncResult = await syncDraftRoster(env, version);
    summary.roster_sync = summarizeRosterSyncForLog(syncResult);
    const unassigned = await listUnassignedStudents(env, versionId);
    summary.unassigned_students = unassigned.map(row => String(row.student_name_snapshot || row.student_id || '').trim()).filter(Boolean);
    const response = await activateVersion(env, versionId, AUTO_APPLY_ACTOR);
    const body = await response.json().catch(() => ({}));
    if (response.status !== 200 || body.success === false) {
      summary.error = String(body.error || `activate status ${response.status}`);
      await writeAutoApplyLog(env, version, 'auto_failed', summary);
      return { version_id: versionId, success: false, error: summary.error };
    }
    summary.class_count = Number(body.activated_class_count || 0);
    summary.student_count = Number(body.activated_student_assignment_count || 0);
    summary.removed_class_count = Number(body.removed_class_count || 0);
    summary.unassigned_student_count = Number(body.unassigned_student_count || 0);
    await writeAutoApplyLog(env, version, 'auto_success', summary);
    return { version_id: versionId, success: true, ...summary };
  } catch (error) {
    console.error('[timetable auto apply] failed:', error);
    summary.error = String(error?.message || error);
    try { await writeAutoApplyLog(env, version, 'auto_failed', summary); } catch (logError) { console.error('[timetable auto apply] log failed:', logError); }
    return { version_id: versionId, success: false, error: summary.error };
  }
}

// 매일 KST 0:05 cron에서 호출한다. status가 scheduled이고 적용일이 오늘 이전(포함)인 개편안만 적용한다.
// draft는 날짜가 지나도 적용하지 않는다(기본 적용일이 다음 해 1월 1일이라, 짜다 만 개편안이 올라가는 사고를 막기 위해).
// 실패하면 status가 scheduled로 남아(적용은 한 번의 batch라 중간 상태 없음) 다음 날 cron이 다시 시도한다.
export async function runScheduledTimetableActivation(env, scheduledAt = new Date()) {
  const today = kstDateString(scheduledAt);
  const due = await env.DB.prepare(`
    SELECT id FROM timetable_versions
    WHERE status = 'scheduled' AND effective_from IS NOT NULL AND effective_from != '' AND effective_from <= ?
    ORDER BY effective_from ASC, created_at ASC
  `).bind(today).all();
  const results = [];
  for (const row of (due.results || [])) {
    results.push(await autoApplyScheduledVersion(env, row.id, today));
  }
  return { today, due_count: results.length, results };
}

async function getLatestAutoApplyResult(env) {
  const row = await env.DB.prepare(`
    SELECT l.id, l.version_id, l.status, l.created_at, l.error_message, l.summary_json
    FROM timetable_version_apply_logs l
    WHERE l.status IN (${AUTO_APPLY_LOG_STATUSES.map(v => `'${v}'`).join(', ')})
    ORDER BY l.created_at DESC, l.id DESC
    LIMIT 1
  `).first();
  if (!row) return null;
  return { ...row, summary: safeParseMemoJson(row.summary_json, 'auto apply summary') };
}

export async function handleTimetableVersions(request, env, teacher, path, url, body = {}) {
  if (!isAdminUser(teacher)) return forbidden();

  const method = request.method;
  const id = path[2];
  const action = path[3];
  const subAction = path[4];

  if (method === 'GET' && !id) {
    const where = [];
    const params = [];
    const status = url.searchParams.get('status');
    const schoolYear = url.searchParams.get('school_year');
    if (status) {
      where.push('status = ?');
      params.push(status);
    }
    if (schoolYear) {
      where.push('school_year = ?');
      params.push(normalizeSchoolYear(schoolYear));
    }
    const res = await env.DB.prepare(`
      SELECT *
      FROM timetable_versions
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY school_year DESC, created_at DESC
    `).bind(...params).all();
    return jsonResponse({ success: true, timetable_versions: res.results || [] });
  }

  if (method === 'POST' && id === 'ensure-active') {
    const result = await ensureActiveVersion(env, teacher, body);
    return jsonResponse({ success: true, ...result });
  }

  if (method === 'POST' && id === 'create-next-draft') {
    const schoolYear = normalizeSchoolYear(body.school_year, currentSchoolYear() + 1);
    const existingDraft = await env.DB.prepare(`
      SELECT id FROM timetable_versions
      WHERE school_year = ? AND status IN ('draft', 'scheduled')
      LIMIT 1
    `).bind(schoolYear).first();
    if (existingDraft) return jsonResponse({ success: false, error: 'draft or scheduled version already exists' }, 409);

    let sourceVersion = null;
    if (body.source_version_id) {
      sourceVersion = await getVersion(env, String(body.source_version_id));
      if (!sourceVersion) return jsonResponse({ success: false, error: 'source version not found' }, 404);
    }
    if (!sourceVersion) {
      sourceVersion = await env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first();
    }
    if (!sourceVersion) {
      const ensured = await ensureActiveVersion(env, teacher, { school_year: currentSchoolYear() });
      sourceVersion = ensured.timetable_version;
    }
    if (!sourceVersion) return jsonResponse({ success: false, error: 'source version not found' }, 404);

    const versionId = makeId('ttv');
    await env.DB.prepare(`
      INSERT INTO timetable_versions
        (id, school_year, title, status, source_version_id, effective_from, effective_to, created_by, memo)
      VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)
    `).bind(
      versionId,
      schoolYear,
      String(body.title || `${schoolYear}년 1월 개편 초안`).trim(),
      sourceVersion.id,
      body.effective_from || `${schoolYear}-01-01`,
      body.effective_to || null,
      teacher?.id || null,
      body.memo || null
    ).run();
    return jsonResponse(await seedDraftFromOperations(env, versionId));
  }

  if (method === 'GET' && id === 'auto-apply-latest') {
    return jsonResponse({ success: true, auto_apply: await getLatestAutoApplyResult(env) });
  }

  if (method === 'GET' && id && !action) {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    const versionClasses = await ensureVersionClassesSeeded(env, version);
    const repairedSlots = await ensureVersionSlotsMapped(env, version);
    const repairedAssignments = await ensureVersionAssignmentsMapped(env, version);
    const repairedStudentAssignments = await ensureDraftStudentAssignmentsSeeded(env, version);
    // 개편안은 며칠에 걸쳐 짜므로 열 때마다 현재 운영 명단으로 자동 갱신한다(멱등). 실패해도 화면은 열린다.
    let rosterResult = { roster_sync: { added: [], removed: [], moved: [], changed: 0 }, roster_multi_class: [] };
    if (EDITABLE_STATUSES.has(String(version.status || ''))) {
      try {
        rosterResult = await syncDraftRoster(env, version);
      } catch (error) {
        console.error('[timetable-versions GET] roster sync skipped:', error);
        rosterResult.roster_sync.error = true;
      }
    }
    const renderableVersionClasses = (await listVersionClasses(env, id, { renderableOnly: true }));
    return jsonResponse({
      success: true,
      timetable_version: version,
      timetable_version_classes: versionClasses,
      timetable_classes: renderableVersionClasses.map(versionClassCompatClassRow),
      timetable_version_slots: await listSlots(env, id, null, { renderableOnly: true }),
      timetable_version_student_assignments: await listStudentAssignments(env, id, null, { renderableOnly: true }),
      timetable_version_unassigned_students: await listUnassignedStudents(env, id),
      timetable_version_removed_classes: await listRemovedClasses(env, id),
      ...rosterResult,
      repaired_version_slots: repairedSlots,
      repaired_version_assignments: repairedAssignments,
      repaired_student_assignments: repairedStudentAssignments
    });
  }

  if (method === 'PATCH' && id && !action) {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    if (body.status && !PATCHABLE_STATUSES.has(String(body.status))) {
      return jsonResponse({ success: false, error: 'active/archived status transition is not implemented' }, 400);
    }
    if (version.status === 'active' && body.status && body.status !== 'active') {
      return jsonResponse({ success: false, error: 'active version status cannot be changed here' }, 400);
    }
    const row = rowFromBody(body, ['title', 'status', 'effective_from', 'effective_to', 'memo']);
    // 적용 예약(scheduled)은 적용일이 오늘보다 뒤여야 한다. 오늘 0:05 cron은 이미 지났으므로 오늘 이전·당일은 즉시 적용을 쓴다.
    const nextStatus = String(row.status || version.status || '');
    if (nextStatus === 'scheduled' && ('status' in row || 'effective_from' in row)) {
      const nextEffective = String(('effective_from' in row ? row.effective_from : version.effective_from) || '').trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(nextEffective)) {
        return jsonResponse({ success: false, error: 'effective_from required for scheduled version' }, 400);
      }
      if (nextEffective <= kstDateString(new Date())) {
        return jsonResponse({ success: false, error: 'effective_from must be after today for scheduled version' }, 400);
      }
    }
    if (row.status === 'cancelled') row.cancelled_at = new Date().toISOString();
    row.updated_at = new Date().toISOString();
    const keys = Object.keys(row);
    if (keys.length) {
      await env.DB.prepare(`UPDATE timetable_versions SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`).bind(...keys.map(key => row[key]), id).run();
    }
    return jsonResponse({ success: true, timetable_version: await getVersion(env, id) });
  }

  if (method === 'GET' && id && action === 'slots') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    await ensureVersionClassesSeeded(env, version);
    await ensureVersionSlotsMapped(env, version);
    return jsonResponse({ success: true, timetable_version_slots: await listSlots(env, id, url.searchParams.get('class_id'), { renderableOnly: true }) });
  }

  if (method === 'POST' && id && action === 'slots' && subAction === 'replace-class-slots') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    if (!EDITABLE_STATUSES.has(version.status)) return jsonResponse({ success: false, error: 'version is not editable' }, 400);
    await ensureVersionClassesSeeded(env, version);
    const classId = String(body.class_id || body.version_class_id || body.versionClassId || '').trim();
    const slots = Array.isArray(body.slots) ? body.slots : [];
    if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
    const versionClass = await getVersionClassByAnyId(env, id, classId);
    if (!versionClass || !isRenderableVersionClass(versionClass)) return jsonResponse({ success: false, error: 'draft class not found' }, 404);
    const compatClassId = getVersionClassCompatClassId(versionClass);
    const rows = normalizeSlotRows(id, compatClassId, slots);
    if (rows.some(row => !row.day_of_week || !row.start_time || !row.end_time)) {
      return jsonResponse({ success: false, error: 'day_of_week, start_time, end_time required' }, 400);
    }

    const statements = [
      env.DB.prepare('DELETE FROM timetable_version_slots WHERE version_id = ? AND (class_id = ? OR version_class_id = ? OR source_class_id = ?)').bind(id, compatClassId, versionClass.id, compatClassId),
      ...rows.map(row => env.DB.prepare(`
        INSERT INTO timetable_version_slots
          (id, version_id, class_id, version_class_id, source_class_id, day_of_week, start_time, end_time, room_name, memo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(row.id, row.version_id, compatClassId, versionClass.id, versionClass.source_class_id || null, row.day_of_week, row.start_time, row.end_time, row.room_name, row.memo))
    ];
    await env.DB.batch(statements);
    return jsonResponse({
      success: true,
      version_id: id,
      class_id: compatClassId,
      version_class_id: versionClass.id,
      timetable_version_slots: await listSlots(env, id, versionClass.id)
    });
  }

  if (method === 'POST' && id && action === 'classes' && subAction === 'draft-create') {
    return createDraftClass(env, id, teacher, body);
  }

  if (method === 'POST' && id && action === 'students' && subAction === 'assign') {
    return assignDraftStudent(env, id, body);
  }

  if (method === 'POST' && id && action === 'students' && subAction === 'draft-create') {
    return createDraftStudent(env, id, body);
  }

  if (method === 'POST' && id && action === 'students' && subAction === 'unassign') {
    return unassignDraftStudent(env, id, body);
  }

  if (method === 'POST' && id && action === 'classes' && subAction === 'remove') {
    return removeDraftClass(env, id, body);
  }

  if (method === 'POST' && id && action === 'classes' && subAction === 'restore') {
    return restoreDraftClass(env, id, body);
  }

  if (method === 'POST' && id && action === 'classes' && subAction === 'update') {
    return updateDraftClass(env, id, body);
  }

  if (method === 'POST' && id && action === 'restart') {
    return restartDraftVersion(env, teacher, id);
  }

  if (method === 'GET' && id && action === 'roster-diff') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    return jsonResponse({ success: true, version_id: id, roster_diff: await loadRosterDiff(env, version) });
  }

  if (method === 'POST' && id && action === 'roster-sync') {
    const checked = await assertEditableVersion(env, id);
    if (checked.error) return checked.error;
    return jsonResponse({ success: true, version_id: id, ...(await syncDraftRoster(env, checked.version)) });
  }

  if (method === 'POST' && id && action === 'activate') {
    return activateVersion(env, id, teacher);
  }

  if (method === 'POST' && id && action === 'scan-preview') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    const result = await scanPreview(env, id);
    return jsonResponse({ success: true, version_id: id, conflicts: result.conflicts, counts: result.counts });
  }

  return null;
}
