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

async function listSlots(env, versionId, classId = null) {
  const where = ['version_id = ?'];
  const params = [versionId];
  if (classId) {
    where.push('class_id = ?');
    params.push(classId);
  }
  const res = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_slots
    WHERE ${where.join(' AND ')}
    ORDER BY day_of_week ASC, start_time ASC, class_id ASC
  `).bind(...params).all();
  return res.results || [];
}


async function listStudentAssignments(env, versionId, classId = null) {
  const where = ['version_id = ?'];
  const params = [versionId];
  if (classId) {
    where.push('class_id = ?');
    params.push(classId);
  }
  const res = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_student_assignments
    WHERE ${where.join(' AND ')}
    ORDER BY class_id ASC, student_name_snapshot ASC, student_id ASC
  `).bind(...params).all();
  return res.results || [];
}

async function copyClassStudentsToVersion(env, versionId) {
  const countRow = await env.DB.prepare('SELECT COUNT(*) AS count FROM class_students').first();
  await env.DB.prepare(`
    INSERT OR IGNORE INTO timetable_version_student_assignments
      (id, version_id, class_id, student_id, student_name_snapshot, memo)
    SELECT
      'tvsa_' || unixepoch('now') || '_' || lower(hex(randomblob(4))),
      ?,
      cs.class_id,
      cs.student_id,
      s.name,
      'copied from active class_students'
    FROM class_students cs
    JOIN students s ON s.id = cs.student_id
  `).bind(versionId).run();
  return Number(countRow?.count || 0);
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

  const classId = makeId('cls');
  const normalizedSlots = normalizeSlotRows(versionId, classId, slots);
  if (normalizedSlots.some(slot => !slot.day_of_week || !slot.start_time || !slot.end_time)) {
    return jsonResponse({ success: false, error: 'day_of_week, start_time, end_time required' }, 400);
  }

  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO classes
        (id, name, grade, subject, teacher_name, schedule_days, textbook, is_active, day_group, time_label, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(classId, row.name, row.grade, row.subject, row.teacher_name, row.schedule_days, row.textbook, row.day_group, row.time_label),
    ...normalizedSlots.map(slot => env.DB.prepare(`
      INSERT INTO timetable_version_slots
        (id, version_id, class_id, day_of_week, start_time, end_time, room_name, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(slot.id, slot.version_id, slot.class_id, slot.day_of_week, slot.start_time, slot.end_time, slot.room_name, slot.memo || 'draft class placement'))
  ]);

  const cls = await env.DB.prepare('SELECT * FROM classes WHERE id = ?').bind(classId).first();
  return jsonResponse({
    success: true,
    timetable_version: checked.version,
    class: cls,
    timetable_version_slots: await listSlots(env, versionId, classId),
    timetable_version_student_assignments: await listStudentAssignments(env, versionId, classId)
  });
}

async function assignDraftStudent(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;

  const studentId = String(body.student_id || body.studentId || '').trim();
  const targetClassId = String(body.target_class_id || body.targetClassId || body.class_id || body.classId || '').trim();
  const sourceClassId = String(body.source_class_id || body.sourceClassId || '').trim();
  if (!studentId || !targetClassId) return jsonResponse({ success: false, error: 'student_id and target_class_id required' }, 400);

  const [student, cls] = await Promise.all([
    env.DB.prepare('SELECT id, name FROM students WHERE id = ?').bind(studentId).first(),
    env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(targetClassId).first()
  ]);
  if (!student) return jsonResponse({ success: false, error: 'student not found' }, 404);
  if (!cls) return jsonResponse({ success: false, error: 'class not found' }, 404);

  const id = makeId('tvsa');
  await env.DB.batch([
    env.DB.prepare('DELETE FROM timetable_version_student_assignments WHERE version_id = ? AND student_id = ?').bind(versionId, studentId),
    env.DB.prepare(`
      INSERT INTO timetable_version_student_assignments
        (id, version_id, class_id, student_id, student_name_snapshot, source_class_id, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(id, versionId, targetClassId, studentId, student.name || null, sourceClassId || null, body.memo || null)
  ]);

  return jsonResponse({
    success: true,
    version_id: versionId,
    student_id: studentId,
    source_class_id: sourceClassId || null,
    target_class_id: targetClassId,
    timetable_version_student_assignments: await listStudentAssignments(env, versionId)
  });
}

async function createDraftStudent(env, versionId, body) {
  const checked = await assertEditableVersion(env, versionId);
  if (checked.error) return checked.error;

  const classId = String(body.class_id || body.classId || '').trim();
  if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
  const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(classId).first();
  if (!cls) return jsonResponse({ success: false, error: 'class not found' }, 404);

  const d = normalizeDraftStudentPayload(body);
  if (!d.name) return jsonResponse({ success: false, error: 'name required' }, 400);
  const pin = d.student_pin || await generateStudentPin(d.grade, env);
  const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ?').bind(pin).first();
  if (exist) return jsonResponse({ success: false, message: '이미 사용 중인 PIN입니다.' }, 409);

  const studentId = makeId('s');
  const assignmentId = makeId('tvsa');
  const memo = [d.memo, '#새학기'].filter(Boolean).join(' ').trim();
  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO students
        (id, name, school_name, grade, target_score, status, memo, guardian_relation, student_phone, parent_phone, student_pin, high_subjects, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, '입학예정', ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(studentId, d.name, d.school_name, d.grade, d.target_score, memo, d.guardian_relation, d.student_phone, d.parent_phone, pin, d.high_subjects),
    env.DB.prepare(`
      INSERT INTO timetable_version_student_assignments
        (id, version_id, class_id, student_id, student_name_snapshot, source_class_id, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NULL, 'draft new student', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(assignmentId, versionId, classId, studentId, d.name)
  ]);

  const student = await env.DB.prepare('SELECT * FROM students WHERE id = ?').bind(studentId).first();
  return jsonResponse({
    success: true,
    version_id: versionId,
    student,
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
  const [slotRows, assignmentRows, activeVersion, oldClassRows] = await Promise.all([
    listSlots(env, versionId),
    listStudentAssignments(env, versionId),
    env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first(),
    env.DB.prepare('SELECT class_id, student_id FROM class_students').all()
  ]);

  const classIds = [...new Set([...uniqueValues(slotRows, 'class_id'), ...uniqueValues(assignmentRows, 'class_id')])];
  const studentIds = uniqueValues(assignmentRows, 'student_id');
  if (!classIds.length) return jsonResponse({ success: false, error: 'version has no classes' }, 400);

  await env.DB.prepare('DELETE FROM class_time_slots').run();
  for (const slot of slotRows) {
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
    copied_slot_count: slotRows.length
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
  const countRow = await env.DB.prepare('SELECT COUNT(*) AS count FROM timetable_version_slots WHERE version_id = ?').bind(sourceVersionId).first();
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
    FROM timetable_version_slots
    WHERE version_id = ?
  `).bind(targetVersionId, sourceVersionId).run();
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
  const [slotsRes, assignmentsRes, classesRes] = await Promise.all([
    env.DB.prepare('SELECT * FROM timetable_version_slots WHERE version_id = ? ORDER BY day_of_week, start_time').bind(versionId).all(),
    env.DB.prepare('SELECT * FROM timetable_version_student_assignments WHERE version_id = ?').bind(versionId).all(),
    env.DB.prepare('SELECT id, teacher_name FROM classes').all()
  ]);
  const slots = slotsRes.results || [];
  const assignments = assignmentsRes.results || [];
  const classes = classesRes.results || [];
  const classMap = new Map(classes.map(cls => [cls.id, cls]));
  const slotsByClass = new Map();
  const assignmentsByStudent = new Map();
  const conflicts = [];

  for (const slot of slots) {
    const list = slotsByClass.get(slot.class_id) || [];
    list.push(slot);
    slotsByClass.set(slot.class_id, list);
  }

  for (const assignment of assignments) {
    const list = assignmentsByStudent.get(assignment.student_id) || [];
    list.push(assignment);
    assignmentsByStudent.set(assignment.student_id, list);
  }

  for (const [studentId, list] of assignmentsByStudent.entries()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (const a of (slotsByClass.get(list[i].class_id) || [])) {
          for (const b of (slotsByClass.get(list[j].class_id) || [])) {
            if (a.day_of_week !== b.day_of_week || !isTimeOverlap(a.start_time, a.end_time, b.start_time, b.end_time)) continue;
            const range = overlapRange(a, b);
            pushPreviewConflict(conflicts, 'student', studentId, a.class_id, b.class_id, a.day_of_week, range.start, range.end);
          }
        }
      }
    }
  }

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (a.class_id === b.class_id || a.day_of_week !== b.day_of_week || !isTimeOverlap(a.start_time, a.end_time, b.start_time, b.end_time)) continue;
      const range = overlapRange(a, b);
      const teacherA = String(classMap.get(a.class_id)?.teacher_name || '').trim();
      const teacherB = String(classMap.get(b.class_id)?.teacher_name || '').trim();
      if (teacherA && teacherA === teacherB) {
        pushPreviewConflict(conflicts, 'teacher', teacherA, a.class_id, b.class_id, a.day_of_week, range.start, range.end);
      }
      if (a.room_name && a.room_name === b.room_name) {
        pushPreviewConflict(conflicts, 'room', a.room_name, a.class_id, b.class_id, a.day_of_week, range.start, range.end);
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
    const copiedSlots = await copyVersionSlots(env, sourceVersion.id, versionId);
    const copiedStudentAssignments = await copyClassStudentsToVersion(env, versionId);
    return jsonResponse({ success: true, timetable_version: await getVersion(env, versionId), copied_slots: copiedSlots, copied_student_assignments: copiedStudentAssignments });
  }

  if (method === 'GET' && id && !action) {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    return jsonResponse({
      success: true,
      timetable_version: version,
      timetable_version_slots: await listSlots(env, id),
      timetable_version_student_assignments: await listStudentAssignments(env, id)
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
    return jsonResponse({ success: true, timetable_version_slots: await listSlots(env, id, url.searchParams.get('class_id')) });
  }

  if (method === 'POST' && id && action === 'slots' && subAction === 'replace-class-slots') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    if (!EDITABLE_STATUSES.has(version.status)) return jsonResponse({ success: false, error: 'version is not editable' }, 400);
    const classId = String(body.class_id || '').trim();
    const slots = Array.isArray(body.slots) ? body.slots : [];
    if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
    const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(classId).first();
    if (!cls) return jsonResponse({ success: false, error: 'class not found' }, 404);
    const rows = normalizeSlotRows(id, classId, slots);
    if (rows.some(row => !row.day_of_week || !row.start_time || !row.end_time)) {
      return jsonResponse({ success: false, error: 'day_of_week, start_time, end_time required' }, 400);
    }

    const statements = [
      env.DB.prepare('DELETE FROM timetable_version_slots WHERE version_id = ? AND class_id = ?').bind(id, classId),
      ...rows.map(row => env.DB.prepare(`
        INSERT INTO timetable_version_slots
          (id, version_id, class_id, day_of_week, start_time, end_time, room_name, memo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(row.id, row.version_id, row.class_id, row.day_of_week, row.start_time, row.end_time, row.room_name, row.memo))
    ];
    await env.DB.batch(statements);
    return jsonResponse({
      success: true,
      version_id: id,
      class_id: classId,
      timetable_version_slots: await listSlots(env, id, classId)
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
