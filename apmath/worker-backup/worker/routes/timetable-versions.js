import { jsonResponse } from '../helpers/response.js';
import { isAdminUser, makeId } from '../helpers/foundation-db.js';
import { findTeacherByAlias, generateStudentPin, normalizeHighSubjects, normalizeTargetScore } from '../helpers/admin-db.js';
import { isTimeOverlap, overlapRange, uniqSortedPair } from '../helpers/time.js';

const EDITABLE_STATUSES = new Set(['draft', 'scheduled']);
const PATCHABLE_STATUSES = new Set(['draft', 'scheduled', 'cancelled']);

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
    where.push("COALESCE(status, 'draft') NOT IN ('excluded', 'graduating_excluded')");
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
    where.push("(tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN ('excluded', 'graduating_excluded'))");
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
    where.push('(a.class_id = ? OR a.version_class_id = ? OR a.source_class_id = ?)');
    params.push(String(classId), String(classId), String(classId));
  }
  if (options.renderableOnly) {
    where.push("(tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN ('excluded', 'graduating_excluded'))");
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
  return String(value || '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .slice(0, 80) || 'none';
}

function makeSourceVersionClassId(versionId, sourceClassId) {
  return `tvc_${safeVersionClassIdPart(versionId)}_${safeVersionClassIdPart(sourceClassId)}`;
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
  return status !== 'excluded' && status !== 'graduating_excluded';
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
  const sourceClasses = activeClassRes.results || [];
  const rows = buildVersionClassRows(sourceClasses, version.id, { academy_id: options.academy_id || 'apmath' })
    .map(row => {
      const sourceClassId = String(row.source_class_id || '').trim();
      const promotedName = buildPromotedClassName(row.name_snapshot, row.source_grade, row.next_grade);
      return {
        ...row,
        id: sourceClassId ? makeSourceVersionClassId(version.id, sourceClassId) : row.id,
        name_snapshot: promotedName || row.name_snapshot
      };
    });

  if (!rows.length) return [];
  await env.DB.batch(rows.map(row => env.DB.prepare(`
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
  )));
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
      s.grade AS student_grade,
      c.grade AS class_grade,
      c.name AS class_name
    FROM class_students cs
    JOIN students s ON s.id = cs.student_id
    LEFT JOIN classes c ON c.id = cs.class_id
  `).all();
  let copied = 0;
  for (const row of (res.results || [])) {
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
      buildDraftStudentAssignmentMemo(sourceGrade, nextGrade, 'copied from active class_students', row.student_name || '')
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
  const studentId = String(body.student_id || body.studentId || '').trim();
  const targetClassId = String(body.target_class_id || body.targetClassId || body.class_id || body.classId || body.version_class_id || body.versionClassId || '').trim();
  const sourceClassId = String(body.source_class_id || body.sourceClassId || '').trim();
  if (!studentId || !targetClassId) return jsonResponse({ success: false, error: 'student_id and target_class_id required' }, 400);

  const versionClass = await getVersionClassByAnyId(env, versionId, targetClassId);
  if (!versionClass || !isRenderableVersionClass(versionClass)) return jsonResponse({ success: false, error: 'draft class not found' }, 404);
  const student = await env.DB.prepare('SELECT id, name, grade FROM students WHERE id = ?').bind(studentId).first();
  if (!student) return jsonResponse({ success: false, error: 'student not found' }, 404);

  const existingAssignment = await env.DB.prepare(`
    SELECT memo, source_class_id, source_grade, next_grade
    FROM timetable_version_student_assignments
    WHERE version_id = ? AND student_id = ?
  `).bind(versionId, studentId).first();
  const sourceGrade = normalizeGradeLabel(existingAssignment?.source_grade || versionClass.source_grade || student.grade || '');
  const nextGrade = normalizeGradeLabel(existingAssignment?.next_grade || versionClass.next_grade || getNextSemesterGrade(sourceGrade));
  const memoInfo = safeParseMemoJson(existingAssignment?.memo, 'assignDraftStudent memo');
  const memo = buildDraftStudentAssignmentMemo(
    memoInfo.source_grade || sourceGrade,
    memoInfo.next_grade || nextGrade,
    memoInfo.note || body.memo || 'draft student reassigned',
    memoInfo.student_name_snapshot || student.name || ''
  );
  const id = makeId('tvsa');
  const compatClassId = getVersionClassCompatClassId(versionClass);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM timetable_version_student_assignments WHERE version_id = ? AND student_id = ?').bind(versionId, studentId),
    env.DB.prepare(`
      INSERT INTO timetable_version_student_assignments
        (id, version_id, class_id, version_class_id, student_id, student_name_snapshot, source_class_id, source_grade, next_grade, excluded_reason, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(id, versionId, compatClassId, versionClass.id, studentId, student.name || null, sourceClassId || existingAssignment?.source_class_id || versionClass.source_class_id || null, sourceGrade, nextGrade, memo)
  ]);

  return jsonResponse({
    success: true,
    version_id: versionId,
    student_id: studentId,
    source_class_id: sourceClassId || null,
    target_class_id: compatClassId,
    version_class_id: versionClass.id,
    timetable_version_student_assignments: await listStudentAssignments(env, versionId, null, { renderableOnly: true })
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

async function insertTeacherClassMappingsForClasses(env, classIds) {
  if (!classIds.length) return 0;
  const markers = classIds.map(() => '?').join(',');
  const classes = await env.DB.prepare(`SELECT id, teacher_name FROM classes WHERE id IN (${markers})`).bind(...classIds).all();
  let count = 0;
  for (const cls of (classes.results || [])) {
    const matched = await findTeacherByAlias(env, cls.teacher_name);
    if (!matched) continue;
    await env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(matched.id, cls.id).run();
    count += 1;
  }
  return count;
}

async function activateVersion(env, versionId, teacher) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;
  const version = checked.version;
  const versionClassCount = await env.DB.prepare('SELECT COUNT(*) AS count FROM timetable_version_classes WHERE version_id = ?').bind(versionId).first();
  if (Number(versionClassCount?.count || 0) > 0) {
    return jsonResponse({ success: false, error: 'version_class activation is not implemented in this step' }, 400);
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

  await env.DB.prepare('DELETE FROM class_time_slots').run();
  for (const slot of activeSlotRows) {
    await env.DB.prepare(`
      INSERT INTO class_time_slots
        (id, class_id, day_of_week, start_time, end_time, room_name, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(makeId('cts'), slot.class_id, slot.day_of_week, slot.start_time, slot.end_time, slot.room_name || null, slot.memo || 'activated from timetable version').run();
  }

  const classMarkers = classIds.map(() => '?').join(',');
  await env.DB.prepare(`UPDATE classes SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id IN (${classMarkers})`).bind(...classIds).run();
  await insertTeacherClassMappingsForClasses(env, classIds);

  if (assignmentRows.length) {
    await env.DB.prepare(`DELETE FROM class_students WHERE class_id IN (${classMarkers})`).bind(...classIds).run();
    for (const row of assignmentRows) {
      await env.DB.prepare('INSERT OR IGNORE INTO class_students (class_id, student_id) VALUES (?, ?)').bind(row.class_id, row.student_id).run();
    }
  }

  if (studentIds.length) {
    const studentMarkers = studentIds.map(() => '?').join(',');
    await env.DB.prepare(`UPDATE students SET status = '재원', updated_at = CURRENT_TIMESTAMP WHERE id IN (${studentMarkers}) AND status = '입학예정'`).bind(...studentIds).run();
    await env.DB.prepare(`
      UPDATE student_enrollments
      SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP
      WHERE status = 'active' AND branch = 'apmath' AND student_id IN (${studentMarkers})
    `).bind(...studentIds).run();

    for (const row of assignmentRows) {
      await env.DB.prepare(`
        INSERT INTO student_enrollments
          (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount, memo)
        VALUES (?, ?, 'apmath', ?, 'active', DATE('now', '+9 hours'), NULL, NULL, ?)
      `).bind(makeId('enr'), row.student_id, row.class_id, '새학기 시간표 적용').run();
    }
  }

  const oldByStudent = new Map();
  for (const row of (oldClassRows.results || [])) {
    if (!oldByStudent.has(String(row.student_id))) oldByStudent.set(String(row.student_id), String(row.class_id));
  }
  for (const row of assignmentRows) {
    const oldClassId = oldByStudent.get(String(row.student_id)) || null;
    if (oldClassId && oldClassId !== String(row.class_id)) {
      await env.DB.prepare(`
        INSERT INTO class_transfer_history
          (id, student_id, from_class_id, to_class_id, reason, changed_by)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(makeId('ctr'), row.student_id, oldClassId, row.class_id, '새학기 시간표 적용', teacher?.id || teacher?.login_id || teacher?.name || null).run();
    }
  }

  if (activeVersion?.id && activeVersion.id !== versionId) {
    await env.DB.prepare(`UPDATE timetable_versions SET status = 'archived', effective_to = COALESCE(effective_to, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(activeVersion.id).run();
  }
  await env.DB.prepare(`
    UPDATE timetable_versions
    SET status = 'active', activated_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP, memo = COALESCE(memo, '')
    WHERE id = ?
  `).bind(versionId).run();

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

async function copyVersionSlots(env, sourceVersionId, targetVersionId) {
  const targetVersion = await getVersion(env, targetVersionId) || { id: targetVersionId, status: 'draft' };
  const versionClasses = await ensureVersionClassesSeeded(env, targetVersion);
  const map = mapSourceClassToVersionClass(versionClasses);
  const sourceSlots = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_slots
    WHERE version_id = ?
    ORDER BY day_of_week ASC, start_time ASC, class_id ASC
  `).bind(sourceVersionId).all();

  const statements = [];
  let copied = 0;
  for (const slot of (sourceSlots.results || [])) {
    const sourceClassId = String(slot.source_class_id || slot.class_id || '').trim();
    const versionClass = map.get(sourceClassId);
    if (!versionClass || !isRenderableVersionClass(versionClass)) continue;
    statements.push(env.DB.prepare(`
      INSERT INTO timetable_version_slots
        (id, version_id, class_id, version_class_id, source_class_id, day_of_week, start_time, end_time, room_name, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      makeId('tvs'),
      targetVersionId,
      getVersionClassCompatClassId(versionClass),
      versionClass.id,
      sourceClassId,
      slot.day_of_week,
      slot.start_time,
      slot.end_time,
      slot.room_name || null,
      slot.memo || null
    ));
    copied += 1;
  }
  if (statements.length) await env.DB.batch(statements);
  return copied;
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
        AND (tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN ('excluded', 'graduating_excluded'))
      ORDER BY tvs.day_of_week, tvs.start_time
    `).bind(versionId).all(),
    env.DB.prepare(`
      SELECT a.*
      FROM timetable_version_student_assignments a
      LEFT JOIN timetable_version_classes tvc ON tvc.id = a.version_class_id
      WHERE a.version_id = ?
        AND (tvc.id IS NULL OR COALESCE(tvc.status, 'draft') NOT IN ('excluded', 'graduating_excluded'))
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
    const createdVersion = await getVersion(env, versionId);
    const versionClasses = await ensureVersionClassesSeeded(env, createdVersion);
    const copiedSlots = await copyVersionSlots(env, sourceVersion.id, versionId);
    const copiedStudentAssignments = await copyClassStudentsToVersion(env, createdVersion);
    return jsonResponse({
      success: true,
      timetable_version: await getVersion(env, versionId),
      timetable_version_classes: await listVersionClasses(env, versionId),
      timetable_classes: versionClasses.filter(isRenderableVersionClass).map(versionClassCompatClassRow),
      copied_version_classes: versionClasses.length,
      copied_slots: copiedSlots,
      copied_student_assignments: copiedStudentAssignments
    });
  }

  if (method === 'GET' && id && !action) {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    const versionClasses = await ensureVersionClassesSeeded(env, version);
    const repairedSlots = await ensureVersionSlotsMapped(env, version);
    const repairedAssignments = await ensureVersionAssignmentsMapped(env, version);
    const repairedStudentAssignments = await ensureDraftStudentAssignmentsSeeded(env, version);
    const renderableVersionClasses = (await listVersionClasses(env, id, { renderableOnly: true }));
    return jsonResponse({
      success: true,
      timetable_version: version,
      timetable_version_classes: versionClasses,
      timetable_classes: renderableVersionClasses.map(versionClassCompatClassRow),
      timetable_version_slots: await listSlots(env, id, null, { renderableOnly: true }),
      timetable_version_student_assignments: await listStudentAssignments(env, id, null, { renderableOnly: true }),
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
