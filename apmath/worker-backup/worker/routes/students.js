import { jsonResponse } from '../helpers/response.js';
import { canAccessClass, canAccessStudent, getAllowedClassIds, isAdminUser, isStaffUser, makeId } from '../helpers/foundation-db.js';
import { normalizeBranch } from '../helpers/branch.js';
import {
  buildStudentIdentityKey,
  generateUniqueStudentPin,
  isStudentIdentityUniqueError,
  isStudentPinUniqueError,
  normalizeHighSubjects,
  normalizeStudentIdentityPayload,
  normalizeTargetScore
} from '../helpers/admin-db.js';

const DUPLICATE_MESSAGE = '이미 등록 처리된 학생입니다.';
const PIN_CONFLICT_MESSAGE = '이미 사용 중인 PIN입니다.';
function normalizeStudentStatus(value, fallback = '재원') {
  const status = String(value ?? '').trim();
  if (status === '제적' || status === '퇴원' || status === 'withdrawn' || status === 'withdraw') return '퇴원';
  if (status === '숨김' || status === 'hidden') return '숨김';
  if (status === '휴원' || status === 'paused') return '휴원';
  if (status === '재원' || status === 'active') return '재원';
  const fallbackStatus = String(fallback ?? '재원').trim();
  if (fallbackStatus === '제적' || fallbackStatus === '퇴원' || fallbackStatus === 'withdrawn' || fallbackStatus === 'withdraw') return '퇴원';
  if (fallbackStatus === '숨김' || fallbackStatus === 'hidden') return '숨김';
  if (fallbackStatus === '휴원' || fallbackStatus === 'paused') return '휴원';
  if (fallbackStatus === '재원' || fallbackStatus === 'active') return '재원';
  return '재원';
}

function isHiddenStudentStatus(value) {
  return normalizeStudentStatus(value, '') === '숨김';
}

function isValidIsoDate(value) {
  const text = String(value || '').trim();
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;
  const date = new Date(`${text}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime())
    && date.getUTCFullYear() === Number(match[1])
    && date.getUTCMonth() + 1 === Number(match[2])
    && date.getUTCDate() === Number(match[3]);
}

function normalizeStudentRowForResponse(row) {
  if (!row || typeof row !== 'object') return row;
  return { ...row, status: normalizeStudentStatus(row.status, '재원') };
}

function normalizeStudentPayload(d = {}, current = {}) {
  return {
    name: String(d.name ?? current.name ?? '').trim(),
    schoolName: String(d.school_name ?? d.schoolName ?? current.school_name ?? '').trim(),
    grade: String(d.grade ?? current.grade ?? '').trim(),
    targetScore: d.target_score ?? d.targetScore ?? current.target_score ?? null,
    memo: String(d.memo ?? current.memo ?? '').trim(),
    guardianRelation: String(d.guardian_relation ?? d.guardianRelation ?? current.guardian_relation ?? '').trim(),
    studentPhone: String(d.student_phone ?? d.studentPhone ?? current.student_phone ?? '').trim(),
    parentPhone: String(d.parent_phone ?? d.parentPhone ?? current.parent_phone ?? '').trim(),
    studentAddress: String(d.student_address ?? d.studentAddress ?? current.student_address ?? '').trim(),
    vehicleInfo: String(d.vehicle_info ?? d.vehicleInfo ?? current.vehicle_info ?? '').trim(),
    onboardingStartedAt: String(d.onboarding_started_at ?? d.onboardingStartedAt ?? current.onboarding_started_at ?? '').trim(),
    studentPin: String(d.student_pin ?? d.studentPin ?? current.student_pin ?? '').trim(),
    highSubjects: normalizeHighSubjects(d.high_subjects ?? d.highSubjects ?? current.high_subjects ?? '[]'),
    status: d.status !== undefined || d.student_status !== undefined || d.studentStatus !== undefined
      ? normalizeStudentStatus(d.status ?? d.student_status ?? d.studentStatus, current.status || '재원')
      : undefined,
    classId: d.class_id !== undefined || d.classId !== undefined ? String(d.class_id ?? d.classId ?? '').trim() : undefined
  };
}

function identityFromStudentRow(row = {}, classId = '') {
  return normalizeStudentIdentityPayload({
    name: row.name,
    school_name: row.school_name,
    grade: row.grade,
    student_phone: row.student_phone,
    parent_phone: row.parent_phone,
    guardian_relation: row.guardian_relation,
    student_address: row.student_address,
    vehicle_info: row.vehicle_info,
    class_id: classId
  });
}

function sameIdentityExceptClass(a, b) {
  return a.name === b.name &&
    a.school_name === b.school_name &&
    a.grade === b.grade &&
    a.student_phone === b.student_phone &&
    a.parent_phone === b.parent_phone &&
    a.guardian_relation === b.guardian_relation &&
    a.student_address === b.student_address &&
    a.vehicle_info === b.vehicle_info;
}

async function getStudentMutationBundle(env, studentId) {
  const sid = String(studentId || '').trim();
  if (!sid) return { student: null, class_student: null };
  const [student, classStudent] = await Promise.all([
    env.DB.prepare('SELECT * FROM students WHERE id = ? LIMIT 1').bind(sid).first(),
    env.DB.prepare('SELECT * FROM class_students WHERE student_id = ? ORDER BY class_id ASC LIMIT 1').bind(sid).first()
  ]);
  return { student: normalizeStudentRowForResponse(student) || null, class_student: classStudent || null };
}

async function findDuplicateStudentByIdentity(env, identityKey) {
  const key = String(identityKey || '').trim();
  if (!key) return null;
  return env.DB.prepare(`
    SELECT *
    FROM students
    WHERE student_identity_key = ?
    ORDER BY created_at ASC
    LIMIT 1
  `).bind(key).first();
}

async function findFallbackDuplicateStudent(env, d) {
  const requested = normalizeStudentIdentityPayload({ ...d, class_id: d.classId || '' });
  const rows = await env.DB.prepare(`
    SELECT s.*, cs.class_id AS mapped_class_id
    FROM students s
    LEFT JOIN class_students cs ON cs.student_id = s.id
    WHERE (s.student_identity_key IS NULL OR TRIM(s.student_identity_key) = '')
    ORDER BY
      CASE WHEN cs.class_id = ? THEN 0 WHEN cs.class_id IS NULL THEN 1 ELSE 2 END,
      s.created_at ASC
  `).bind(d.classId || '').all();

  let classlessStrongCandidate = null;
  for (const row of (rows.results || [])) {
    const mappedClassId = String(row.mapped_class_id || '').trim();
    const existing = identityFromStudentRow(row, mappedClassId);
    if (sameIdentityExceptClass(existing, requested) && existing.class_id === requested.class_id) {
      return row;
    }
    const hasStrongPhone = !!(requested.student_phone || requested.parent_phone);
    if (!classlessStrongCandidate && !mappedClassId && requested.class_id && hasStrongPhone && sameIdentityExceptClass(existing, requested)) {
      classlessStrongCandidate = row;
    }
  }
  return classlessStrongCandidate;
}

async function backfillStudentIdentityKey(env, studentId, identityKey) {
  try {
    await env.DB.prepare(`
      UPDATE students
      SET student_identity_key = ?, updated_at = DATETIME('now')
      WHERE id = ?
        AND (student_identity_key IS NULL OR TRIM(student_identity_key) = '')
    `).bind(identityKey, studentId).run();
  } catch (err) {
    if (!isStudentIdentityUniqueError(err)) throw err;
  }
}

async function returnDuplicateStudent(env, studentId, identityKey = '') {
  if (identityKey) await backfillStudentIdentityKey(env, studentId, identityKey);
  const bundle = await getStudentMutationBundle(env, studentId);
  return jsonResponse({
    success: true,
    id: studentId,
    student: bundle.student,
    class_student: bundle.class_student,
    duplicate_ignored: true,
    message: DUPLICATE_MESSAGE
  });
}

async function insertStudentWithAutoPin(env, d, sid, identityKey, targetScore) {
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const pin = d.studentPin || await generateUniqueStudentPin(d.grade, env, { maxAttempts });
    const stmts = [
      env.DB.prepare(`
        INSERT INTO students (
          id, name, school_name, grade, target_score, status, memo, guardian_relation,
          student_phone, parent_phone, student_address, vehicle_info, onboarding_started_at, student_pin,
          high_subjects, student_identity_key, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, '재원', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
      `).bind(
        sid,
        d.name,
        d.schoolName,
        d.grade,
        targetScore,
        d.memo,
        d.guardianRelation,
        d.studentPhone,
        d.parentPhone,
        d.studentAddress,
        d.vehicleInfo,
        d.onboardingStartedAt,
        pin,
        d.highSubjects,
        identityKey
      )
    ];
    if (d.classId) {
      stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.classId, sid));
      stmts.push(env.DB.prepare(`
        INSERT INTO student_enrollments
          (id, student_id, branch, class_id, status, start_date, memo)
        VALUES (?, ?, 'apmath', ?, 'active', COALESCE(NULLIF(?, ''), DATE('now', '+9 hours')), ?)
      `).bind(`enr_${sid}`, sid, d.classId, d.onboardingStartedAt, 'student create'));
    }

    try {
      await env.DB.batch(stmts);
      return { pin };
    } catch (err) {
      if (isStudentIdentityUniqueError(err)) throw err;
      if (isStudentPinUniqueError(err) && !d.studentPin) continue;
      throw err;
    }
  }
  throw new Error('AUTO_PIN_RETRY_EXHAUSTED');
}

async function assignUniqueStudentPin(env, studentId, grade, reservedPins = new Set(), maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const pin = await generateUniqueStudentPin(grade, env, { reservedPins, maxAttempts });
    try {
      await env.DB.prepare('UPDATE students SET student_pin = ?, updated_at = DATETIME(\'now\') WHERE id = ?').bind(pin, studentId).run();
      reservedPins.add(pin);
      return pin;
    } catch (err) {
      if (isStudentPinUniqueError(err)) {
        reservedPins.add(pin);
        continue;
      }
      throw err;
    }
  }
  throw new Error('AUTO_PIN_RETRY_EXHAUSTED');
}

async function handleCreateStudent(env, teacher, body) {
  const d = normalizeStudentPayload(body);
  if (!isAdminUser(teacher)) {
    if (!d.classId) return jsonResponse({ error: 'Class ID required' }, 403);
    if (!(await canAccessClass(teacher, d.classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
  }
  if (!d.name) return jsonResponse({ error: 'name required' }, 400);

  const studentIdentityKey = await buildStudentIdentityKey({ ...d, class_id: d.classId || '' });
  const keyedDuplicate = await findDuplicateStudentByIdentity(env, studentIdentityKey);
  if (keyedDuplicate?.id) return returnDuplicateStudent(env, keyedDuplicate.id, studentIdentityKey);

  const fallbackDuplicate = await findFallbackDuplicateStudent(env, d);
  if (fallbackDuplicate?.id) return returnDuplicateStudent(env, fallbackDuplicate.id, studentIdentityKey);

  if (d.studentPin) {
    const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ?').bind(d.studentPin).first();
    if (exist) return jsonResponse({ message: PIN_CONFLICT_MESSAGE }, 409);
  }

  const sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const targetScore = normalizeTargetScore(d.targetScore);
  try {
    await insertStudentWithAutoPin(env, d, sid, studentIdentityKey, targetScore);
    const bundle = await getStudentMutationBundle(env, sid);
    return jsonResponse({
      success: true,
      id: sid,
      student: bundle.student,
      class_student: bundle.class_student,
      duplicate_ignored: false
    });
  } catch (err) {
    if (isStudentIdentityUniqueError(err)) {
      const existing = await findDuplicateStudentByIdentity(env, studentIdentityKey);
      if (existing?.id) return returnDuplicateStudent(env, existing.id, studentIdentityKey);
    }
    if (isStudentPinUniqueError(err)) return jsonResponse({ message: PIN_CONFLICT_MESSAGE }, 409);
    throw err;
  }
}

async function handleUpdateStudent(env, teacher, id, body) {
  if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
  const current = await env.DB.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
  if (!current) return jsonResponse({ error: 'Not found' }, 404);
  const d = normalizeStudentPayload(body, current);
  if (d.classId !== undefined && d.classId && !(await canAccessClass(teacher, d.classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
  if (d.studentPin) {
    const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ? AND id != ?').bind(d.studentPin, id).first();
    if (exist) return jsonResponse({ message: PIN_CONFLICT_MESSAGE }, 409);
  }
  if (!d.name) return jsonResponse({ error: 'name required' }, 400);

  const currentBundle = await getStudentMutationBundle(env, id);
  const currentClassId = String(currentBundle.class_student?.class_id || '').trim();
  const nextClassId = d.classId !== undefined ? d.classId : currentBundle.class_student?.class_id || '';
  const classChanged = d.classId !== undefined && String(nextClassId || '') !== currentClassId;
  const activeEnrollmentsRes = classChanged
    ? await env.DB.prepare("SELECT * FROM student_enrollments WHERE student_id = ? AND status = 'active' ORDER BY created_at DESC").bind(id).all()
    : { results: [] };
  const activeEnrollments = activeEnrollmentsRes.results || [];
  const sourceEnrollment = activeEnrollments.find(row => String(row.class_id || '') === currentClassId) || activeEnrollments[0] || null;
  const targetEnrollment = activeEnrollments.find(row => String(row.class_id || '') === String(nextClassId || '')) || null;
  const studentIdentityKey = await buildStudentIdentityKey({ ...d, class_id: nextClassId });
  const targetScore = normalizeTargetScore(d.targetScore);
  const nextStatus = d.status !== undefined ? d.status : normalizeStudentStatus(current.status, '재원');
  const stmts = [
    env.DB.prepare(`
      UPDATE students
      SET name = ?, school_name = ?, grade = ?, target_score = ?, memo = ?,
          guardian_relation = ?, student_phone = ?, parent_phone = ?,
          student_address = ?, vehicle_info = ?, onboarding_started_at = ?, student_pin = ?, high_subjects = ?,
          status = ?, student_identity_key = ?, updated_at = DATETIME('now')
      WHERE id = ?
    `).bind(
      d.name,
      d.schoolName,
      d.grade,
      targetScore,
      d.memo,
      d.guardianRelation,
      d.studentPhone,
      d.parentPhone,
      d.studentAddress,
      d.vehicleInfo,
      d.onboardingStartedAt,
      d.studentPin,
      d.highSubjects,
      nextStatus,
      studentIdentityKey,
      id
    )
  ];
  if (String(nextStatus || '') !== String(current.status || '')) {
    stmts.push(env.DB.prepare(`
      INSERT INTO student_status_history
        (id, student_id, old_status, new_status, reason, changed_by, changed_at)
      VALUES (?, ?, ?, ?, ?, ?, DATETIME('now', '+9 hours'))
    `).bind(makeId('ssh'), id, current.status || '', nextStatus, 'student detail edit', teacher?.id || teacher?.name || ''));
  }
  if (d.classId !== undefined) {
    stmts.push(env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id));
    if (d.classId) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.classId, id));
  }
  if (classChanged) {
    if (nextClassId) {
      stmts.push(env.DB.prepare(`
        UPDATE student_enrollments
        SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND status = 'active' AND class_id != ?
      `).bind(id, nextClassId));
      if (!targetEnrollment) {
        stmts.push(env.DB.prepare(`
          INSERT INTO student_enrollments
            (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount, memo)
          VALUES (?, ?, ?, ?, 'active', DATE('now', '+9 hours'), NULL, ?, 'student detail class transfer')
        `).bind(makeId('enr'), id, normalizeBranch(sourceEnrollment?.branch || 'apmath'), nextClassId, sourceEnrollment?.tuition_amount ?? null));
      }
    } else {
      stmts.push(env.DB.prepare(`
        UPDATE student_enrollments
        SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND status = 'active'
      `).bind(id));
    }
    stmts.push(env.DB.prepare(`
      INSERT INTO class_transfer_history
        (id, student_id, from_class_id, to_class_id, reason, changed_by, changed_at)
      VALUES (?, ?, ?, ?, 'student detail class edit', ?, DATETIME('now', '+9 hours'))
    `).bind(makeId('ctr'), id, currentClassId || null, nextClassId || null, teacher?.id || teacher?.login_id || teacher?.name || ''));
  }

  try {
    await env.DB.batch(stmts);
    const bundle = await getStudentMutationBundle(env, id);
    const [enrollmentsRes, transferHistoryRes] = classChanged
      ? await Promise.all([
          env.DB.prepare('SELECT * FROM student_enrollments WHERE student_id = ? ORDER BY created_at DESC').bind(id).all(),
          env.DB.prepare(`
            SELECT cth.*, from_cls.name AS from_class_name, to_cls.name AS to_class_name
            FROM class_transfer_history cth
            LEFT JOIN classes from_cls ON from_cls.id = cth.from_class_id
            LEFT JOIN classes to_cls ON to_cls.id = cth.to_class_id
            WHERE cth.student_id = ?
            ORDER BY cth.changed_at DESC, cth.id DESC
          `).bind(id).all()
        ])
      : [{ results: [] }, { results: [] }];
    return jsonResponse({
      success: true,
      student: bundle.student,
      class_student: bundle.class_student,
      class_changed: classChanged,
      student_enrollments: classChanged ? (enrollmentsRes.results || []) : undefined,
      class_transfer_history: classChanged ? (transferHistoryRes.results || []) : undefined
    });
  } catch (err) {
    if (isStudentPinUniqueError(err)) return jsonResponse({ message: PIN_CONFLICT_MESSAGE }, 409);
    if (isStudentIdentityUniqueError(err)) return jsonResponse({ message: DUPLICATE_MESSAGE }, 409);
    throw err;
  }
}

export async function handleStudents(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const id = path[2];

  if (method === 'GET' && !id) {
    if (isAdminUser(teacher)) {
      const res = await env.DB.prepare('SELECT * FROM students ORDER BY grade, name').all();
      return jsonResponse({ success: true, students: (res.results || []).map(normalizeStudentRowForResponse) });
    }
    const classIds = await getAllowedClassIds(env, teacher);
    if (!classIds?.length) return jsonResponse({ success: true, students: [] });
    const markers = classIds.map(() => '?').join(',');
    const res = await env.DB.prepare(`
      SELECT *
      FROM students
      WHERE id IN (SELECT student_id FROM class_students WHERE class_id IN (${markers}))
      ORDER BY grade, name
    `).bind(...classIds).all();
    return jsonResponse({ success: true, students: (res.results || []).map(normalizeStudentRowForResponse) });
  }

  if (method === 'GET' && id && path[3] === 'timetable-detail') {
    if (!isStaffUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    const studentId = String(id || '').trim();
    const [student, classStudent] = await Promise.all([
      env.DB.prepare('SELECT * FROM students WHERE id = ? LIMIT 1').bind(studentId).first(),
      env.DB.prepare('SELECT class_id, student_id FROM class_students WHERE student_id = ? ORDER BY class_id ASC LIMIT 1').bind(studentId).first()
    ]);
    if (!student) return jsonResponse({ error: 'Not found' }, 404);
    if (!classStudent) return jsonResponse({ error: 'student_not_on_timetable', message: '현재 시간표에 배정된 학생이 아닙니다.' }, 404);
    const [
      examSessionsRes,
      consultationsRes,
      classRecordsRes,
      attendanceRes,
      homeworkRes,
      wrongAnswersRes,
      schoolExamRecordsRes,
      enrollmentsRes,
      parentContactsRes,
      parentConsentsRes,
      messageLogsRes,
      statusHistoryRes,
      transferHistoryRes,
      canEdit
    ] = await Promise.all([
      env.DB.prepare('SELECT * FROM exam_sessions WHERE student_id = ? ORDER BY exam_date DESC, created_at DESC LIMIT 50').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM consultations WHERE student_id = ? ORDER BY date DESC, created_at DESC LIMIT 50').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? ORDER BY date DESC, created_at DESC LIMIT 30').bind(classStudent.class_id).all(),
      env.DB.prepare('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC, created_at DESC LIMIT 500').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM homework WHERE student_id = ? ORDER BY date DESC, created_at DESC LIMIT 500').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM wrong_answers WHERE student_id = ? ORDER BY id DESC LIMIT 1000').bind(studentId).all(),
      env.DB.prepare("SELECT * FROM school_exam_records WHERE student_id = ? AND COALESCE(is_deleted, 0) = 0 ORDER BY exam_year DESC, semester DESC, created_at DESC LIMIT 200").bind(studentId).all(),
      env.DB.prepare('SELECT * FROM student_enrollments WHERE student_id = ? ORDER BY created_at DESC LIMIT 200').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM parent_contacts WHERE student_id = ? ORDER BY is_primary DESC, created_at DESC, id DESC LIMIT 200').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM parent_contact_consents WHERE student_id = ? ORDER BY updated_at DESC, id DESC LIMIT 500').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM message_logs WHERE student_id = ? ORDER BY created_at DESC, id DESC LIMIT 500').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM student_status_history WHERE student_id = ? ORDER BY changed_at DESC, id DESC LIMIT 500').bind(studentId).all(),
      env.DB.prepare(`
        SELECT cth.*, from_cls.name AS from_class_name, to_cls.name AS to_class_name
        FROM class_transfer_history cth
        LEFT JOIN classes from_cls ON from_cls.id = cth.from_class_id
        LEFT JOIN classes to_cls ON to_cls.id = cth.to_class_id
        WHERE cth.student_id = ?
        ORDER BY cth.changed_at DESC, cth.id DESC
        LIMIT 500
      `).bind(studentId).all(),
      canAccessStudent(teacher, studentId, env)
    ]);
    await env.DB.prepare(`
      INSERT INTO privacy_access_logs (id, actor_id, student_id, access_type)
      VALUES (?, ?, ?, 'timetable_student_detail')
    `).bind(makeId('pal'), teacher?.id || '', studentId).run();
    return jsonResponse({
      success: true,
      student: { ...normalizeStudentRowForResponse(student), timetable_can_edit: !!canEdit },
      class_student: classStudent,
      exam_sessions: examSessionsRes.results || [],
      consultations: consultationsRes.results || [],
      class_daily_records: classRecordsRes.results || [],
      attendance: attendanceRes.results || [],
      homework: homeworkRes.results || [],
      wrong_answers: wrongAnswersRes.results || [],
      school_exam_records: schoolExamRecordsRes.results || [],
      student_enrollments: enrollmentsRes.results || [],
      parent_contacts: parentContactsRes.results || [],
      parent_contact_consents: parentConsentsRes.results || [],
      message_logs: messageLogsRes.results || [],
      student_status_history: statusHistoryRes.results || [],
      class_transfer_history: transferHistoryRes.results || [],
      can_edit: !!canEdit
    });
  }

  if (method === 'GET' && id && path[3] === 'detail-data') {
    const studentId = String(id || '').trim();
    if (!studentId) return jsonResponse({ success: false, error: 'student_id required' }, 400);
    const student = await env.DB.prepare('SELECT id FROM students WHERE id = ? LIMIT 1').bind(studentId).first();
    if (!student) return jsonResponse({ success: false, error: 'Not found' }, 404);
    if (!(await canAccessStudent(teacher, studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const [parentContactsRes, statusHistoryRes, transferHistoryRes] = await Promise.all([
      env.DB.prepare('SELECT * FROM parent_contacts WHERE student_id = ? ORDER BY is_primary DESC, created_at DESC, id DESC').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM student_status_history WHERE student_id = ? ORDER BY changed_at DESC, id DESC').bind(studentId).all(),
      env.DB.prepare(`
        SELECT cth.*, from_cls.name AS from_class_name, to_cls.name AS to_class_name
        FROM class_transfer_history cth
        LEFT JOIN classes from_cls ON from_cls.id = cth.from_class_id
        LEFT JOIN classes to_cls ON to_cls.id = cth.to_class_id
        WHERE cth.student_id = ?
        ORDER BY cth.changed_at DESC, cth.id DESC
      `).bind(studentId).all()
    ]);
    return jsonResponse({
      success: true,
      student_id: studentId,
      parent_contacts: parentContactsRes.results || [],
      student_status_history: statusHistoryRes.results || [],
      class_transfer_history: transferHistoryRes.results || []
    });
  }

  if (method === 'POST' && id === 'batch-pins') {
    const { class_id } = body;
    if (!class_id && !isAdminUser(teacher)) return jsonResponse({ error: 'Class ID required' }, 403);
    if (class_id && !(await canAccessClass(teacher, class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const targets = class_id
      ? await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND COALESCE(NULLIF(TRIM(status), ''), '재원') IN ('재원', 'active') AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(class_id).all()
      : await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND COALESCE(NULLIF(TRIM(status), ''), '재원') IN ('재원', 'active')").all();
    let count = 0;
    let skipped = 0;
    const details = [];
    const reservedPins = new Set();
    for (const s of targets.results || []) {
      try {
        const pin = await assignUniqueStudentPin(env, s.id, s.grade, reservedPins);
        count += 1;
        details.push({ id: s.id, pin });
      } catch (err) {
        skipped += 1;
        details.push({ id: s.id, skipped: true, error: err?.message || 'pin_retry_failed' });
      }
    }
    return jsonResponse({ success: true, count, skipped, details });
  }

  if (method === 'POST' && path[3] === 'auto-pin') {
    if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const student = await env.DB.prepare('SELECT grade, student_pin FROM students WHERE id = ?').bind(id).first();
    if (!student) return jsonResponse({ error: 'Not found' }, 404);
    const reset = body.reset === true || body.reset === 1 || body.reset === '1' || body.reset === 'true';
    if (student.student_pin && reset) {
      const pin = await assignUniqueStudentPin(env, id, student.grade);
      return jsonResponse({ success: true, pin, student_pin: pin, reset: true });
    }
    if (student.student_pin) return jsonResponse({ message: '이미 PIN이 설정된 학생입니다.' }, 400);
    const pin = await assignUniqueStudentPin(env, id, student.grade);
    return jsonResponse({ success: true, pin, student_pin: pin, reset: false });
  }

  if (method === 'POST' && !id) return handleCreateStudent(env, teacher, body);

  if (method === 'PATCH' && id) {
    if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    if (path[3] === 'restore') {
      if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      const [current, currentClassMap, todayRow, activeEnrollmentsRes, lastWithdrawal] = await Promise.all([
        env.DB.prepare('SELECT * FROM students WHERE id = ? LIMIT 1').bind(id).first(),
        env.DB.prepare('SELECT class_id, student_id FROM class_students WHERE student_id = ? ORDER BY class_id ASC LIMIT 1').bind(id).first(),
        env.DB.prepare("SELECT DATE('now', '+9 hours') AS today").first(),
        env.DB.prepare("SELECT * FROM student_enrollments WHERE student_id = ? AND status = 'active' ORDER BY created_at DESC").bind(id).all(),
        env.DB.prepare("SELECT id, changed_at FROM student_status_history WHERE student_id = ? AND new_status IN ('퇴원', '제적', 'withdrawn', 'withdraw') ORDER BY changed_at DESC, id DESC LIMIT 1").bind(id).first()
      ]);
      if (!current) return jsonResponse({ error: 'Not found' }, 404);
      if (!['퇴원', '숨김'].includes(normalizeStudentStatus(current.status, ''))) {
        return jsonResponse({ success: false, error: 'student_not_withdrawn', message: '퇴원 또는 숨김 학생만 재등원할 수 있습니다.' }, 409);
      }

      const requestedClassId = String(body.class_id ?? body.classId ?? currentClassMap?.class_id ?? '').trim();
      if (!requestedClassId) return jsonResponse({ success: false, error: 'class_id required', message: '재등원할 반을 선택해 주세요.' }, 400);
      const targetClass = await env.DB.prepare('SELECT id, is_active FROM classes WHERE id = ? LIMIT 1').bind(requestedClassId).first();
      if (!targetClass) return jsonResponse({ success: false, error: 'class not found', message: '선택한 반을 찾을 수 없습니다.' }, 404);
      if (Number(targetClass.is_active) === 0) return jsonResponse({ success: false, error: 'class inactive', message: '활성 반을 선택해 주세요.' }, 409);

      const requestedDate = String(body.reenrollment_date ?? body.reenrollmentDate ?? '').trim();
      if (requestedDate && !isValidIsoDate(requestedDate)) {
        return jsonResponse({ success: false, error: 'invalid reenrollment_date', message: '재등원일 형식이 올바르지 않습니다.' }, 400);
      }
      const reenrollmentDate = requestedDate || String(todayRow?.today || '').trim();
      const currentClassId = String(currentClassMap?.class_id || '').trim();
      const activeEnrollments = activeEnrollmentsRes.results || [];
      const sourceEnrollment = activeEnrollments.find(row => String(row.class_id || '') === currentClassId)
        || activeEnrollments[0]
        || await env.DB.prepare('SELECT * FROM student_enrollments WHERE student_id = ? ORDER BY created_at DESC LIMIT 1').bind(id).first();
      const withdrawalDate = /^\d{4}-\d{2}-\d{2}/.test(String(lastWithdrawal?.changed_at || ''))
        ? String(lastWithdrawal.changed_at).slice(0, 10)
        : reenrollmentDate;
      if (!isValidIsoDate(reenrollmentDate) || reenrollmentDate > String(todayRow?.today || '')) {
        return jsonResponse({ success: false, error: 'reenrollment_date_in_future', message: '재등원일은 오늘 또는 이전 날짜로 선택해 주세요.' }, 400);
      }
      if (isValidIsoDate(withdrawalDate) && reenrollmentDate < withdrawalDate) {
        return jsonResponse({ success: false, error: 'reenrollment_date_before_withdrawal', message: '재등원일은 마지막 퇴원일보다 빠를 수 없습니다.' }, 400);
      }
      const studentIdentityKey = await buildStudentIdentityKey(identityFromStudentRow(current, requestedClassId));
      const restoreTransitionToken = String(lastWithdrawal?.id || `${id}_${current.updated_at || current.created_at || 'legacy'}`)
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      const reenrollmentId = `enr_re_${restoreTransitionToken}`;
      const stmts = [
        env.DB.prepare(`
          UPDATE student_enrollments
          SET status = 'ended',
              end_date = CASE WHEN end_date IS NULL OR end_date > ? THEN ? ELSE end_date END,
              updated_at = CURRENT_TIMESTAMP
          WHERE student_id = ? AND status = 'active'
            AND EXISTS (
              SELECT 1 FROM students
              WHERE id = ? AND status IN ('퇴원', '제적', 'withdrawn', 'withdraw', '숨김', 'hidden')
            )
        `).bind(withdrawalDate, withdrawalDate, id, id),
        env.DB.prepare(`
          UPDATE students
          SET status = '재원', student_identity_key = ?, updated_at = DATETIME('now')
          WHERE id = ? AND status IN ('퇴원', '제적', 'withdrawn', 'withdraw', '숨김', 'hidden')
        `).bind(studentIdentityKey, id),
        env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id),
        env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(requestedClassId, id),
        env.DB.prepare(`
          INSERT INTO student_enrollments
            (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount, memo)
          VALUES (?, ?, ?, ?, 'active', ?, NULL, ?, 'student reenrollment')
        `).bind(reenrollmentId, id, normalizeBranch(sourceEnrollment?.branch || 'apmath'), requestedClassId, reenrollmentDate, sourceEnrollment?.tuition_amount ?? null),
        env.DB.prepare(`
          INSERT INTO student_status_history
            (id, student_id, old_status, new_status, reason, changed_by, changed_at)
          VALUES (?, ?, ?, '재원', 'student reenrollment', ?, DATETIME('now', '+9 hours'))
        `).bind(makeId('ssh'), id, current.status || '', teacher?.id || teacher?.login_id || teacher?.name || '')
      ];
      if (currentClassId && currentClassId !== requestedClassId) {
        stmts.push(env.DB.prepare(`
          INSERT INTO class_transfer_history
            (id, student_id, from_class_id, to_class_id, reason, changed_by, changed_at)
          VALUES (?, ?, ?, ?, 'student reenrollment class change', ?, DATETIME('now', '+9 hours'))
        `).bind(makeId('ctr'), id, currentClassId, requestedClassId, teacher?.id || teacher?.login_id || teacher?.name || ''));
      }
      try {
        await env.DB.batch(stmts);
      } catch (err) {
        if (isStudentIdentityUniqueError(err)) return jsonResponse({ message: DUPLICATE_MESSAGE }, 409);
        const errorText = String(err?.message || err || '').toLowerCase();
        if (errorText.includes('unique') && errorText.includes('student_enrollments')) {
          return jsonResponse({ success: false, error: 'student_already_reenrolled', message: '이미 재등원 처리된 학생입니다.' }, 409);
        }
        throw err;
      }
      const bundle = await getStudentMutationBundle(env, id);
      const enrollmentsRes = await env.DB.prepare('SELECT * FROM student_enrollments WHERE student_id = ? ORDER BY created_at DESC').bind(id).all();
      return jsonResponse({
        success: true,
        student: bundle.student,
        class_student: bundle.class_student,
        student_enrollments: enrollmentsRes.results || [],
        reenrollment_date: reenrollmentDate
      });
    }
    if (path[3] === 'hide') {
      if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      const current = await env.DB.prepare('SELECT status FROM students WHERE id = ? LIMIT 1').bind(id).first();
      if (!current) return jsonResponse({ error: 'Not found' }, 404);
      if (normalizeStudentStatus(current.status, '') !== '퇴원') {
        return jsonResponse({ success: false, error: 'only_withdrawn_students_can_be_hidden', message: '퇴원 학생만 숨김 처리할 수 있습니다.' }, 409);
      }
      await env.DB.prepare("UPDATE students SET status = '숨김', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
      const bundle = await getStudentMutationBundle(env, id);
      return jsonResponse({ success: true, student: bundle.student, class_student: bundle.class_student });
    }
    return handleUpdateStudent(env, teacher, id, body);
  }

  if (method === 'DELETE' && id && path[3] === 'purge') {
    if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    const current = await env.DB.prepare('SELECT id, status FROM students WHERE id = ?').bind(id).first();
    if (!current) return jsonResponse({ error: 'Not found' }, 404);
    if (!isHiddenStudentStatus(current.status)) {
      return jsonResponse({ success: false, error: 'only_hidden_students_can_be_deleted', message: '숨김 처리된 학생만 완전 삭제할 수 있습니다.' }, 409);
    }
    const blockingChecks = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) AS count FROM attendance WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM homework WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM exam_sessions WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM consultations WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM school_exam_records WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM payments WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM payment_transactions WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM refund_records WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM carryover_records WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM student_material_submissions WHERE student_id = ?').bind(id).first(),
      env.DB.prepare('SELECT COUNT(*) AS count FROM student_material_wrong_answers WHERE student_id = ?').bind(id).first()
    ]);
    const blockingCount = blockingChecks.reduce((sum, row) => sum + Number(row?.count || 0), 0);
    if (blockingCount > 0) {
      return jsonResponse({
        success: false,
        error: 'student_has_records',
        message: '운영 기록이 있는 학생은 완전 삭제할 수 없습니다. 숨김 상태로 보관해 주세요.'
      }, 409);
    }
    await env.DB.batch([
      env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM parent_contact_consents WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM message_logs WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM parent_contacts WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM student_status_history WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM class_transfer_history WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM student_enrollments WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM privacy_access_logs WHERE student_id = ?').bind(id),
      env.DB.prepare('DELETE FROM students WHERE id = ?').bind(id)
    ]);
    return jsonResponse({ success: true, deleted: true });
  }

  if (method === 'DELETE' && id) {
    if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const current = await env.DB.prepare('SELECT status FROM students WHERE id = ? LIMIT 1').bind(id).first();
    if (!current) return jsonResponse({ error: 'Not found' }, 404);
    if (normalizeStudentStatus(current.status, '') === '퇴원') {
      return jsonResponse({ success: false, error: 'student_already_withdrawn', message: '이미 퇴원 처리된 학생입니다.' }, 409);
    }
    await env.DB.batch([
      env.DB.prepare("UPDATE students SET status = '퇴원', updated_at = DATETIME('now') WHERE id = ?").bind(id),
      env.DB.prepare(`
        UPDATE student_enrollments
        SET status = 'ended',
            end_date = CASE
              WHEN end_date IS NULL OR end_date > DATE('now', '+9 hours') THEN DATE('now', '+9 hours')
              ELSE end_date
            END,
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND status = 'active'
      `).bind(id),
      env.DB.prepare(`
        INSERT INTO student_status_history
          (id, student_id, old_status, new_status, reason, changed_by, changed_at)
        VALUES (?, ?, ?, '퇴원', 'student withdrawn', ?, DATETIME('now', '+9 hours'))
      `).bind(makeId('ssh'), id, current?.status || '', teacher?.id || teacher?.name || '')
    ]);
    const bundle = await getStudentMutationBundle(env, id);
    const enrollmentsRes = await env.DB.prepare('SELECT * FROM student_enrollments WHERE student_id = ? ORDER BY created_at DESC').bind(id).all();
    return jsonResponse({ success: true, student: bundle.student, class_student: bundle.class_student, student_enrollments: enrollmentsRes.results || [] });
  }

  return null;
}
