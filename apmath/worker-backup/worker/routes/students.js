import { jsonResponse } from '../helpers/response.js';
import { canAccessClass, canAccessStudent, getAllowedClassIds, isAdminUser } from '../helpers/foundation-db.js';
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
  return { student: student || null, class_student: classStudent || null };
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
  const nextClassId = d.classId !== undefined ? d.classId : currentBundle.class_student?.class_id || '';
  const studentIdentityKey = await buildStudentIdentityKey({ ...d, class_id: nextClassId });
  const targetScore = normalizeTargetScore(d.targetScore);
  const stmts = [
    env.DB.prepare(`
      UPDATE students
      SET name = ?, school_name = ?, grade = ?, target_score = ?, memo = ?,
          guardian_relation = ?, student_phone = ?, parent_phone = ?,
          student_address = ?, vehicle_info = ?, onboarding_started_at = ?, student_pin = ?, high_subjects = ?,
          student_identity_key = ?, updated_at = DATETIME('now')
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
      studentIdentityKey,
      id
    )
  ];
  if (d.classId !== undefined) {
    stmts.push(env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id));
    if (d.classId) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.classId, id));
  }

  try {
    await env.DB.batch(stmts);
    const bundle = await getStudentMutationBundle(env, id);
    return jsonResponse({ success: true, student: bundle.student, class_student: bundle.class_student });
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
      return jsonResponse({ success: true, students: res.results || [] });
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
    return jsonResponse({ success: true, students: res.results || [] });
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
      ? await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND status = '재원' AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(class_id).all()
      : await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND status = '재원'").all();
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
    if (student.student_pin) return jsonResponse({ message: '이미 PIN이 설정된 학생입니다.' }, 400);
    const pin = await assignUniqueStudentPin(env, id, student.grade);
    return jsonResponse({ success: true, pin });
  }

  if (method === 'POST' && !id) return handleCreateStudent(env, teacher, body);

  if (method === 'PATCH' && id) {
    if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    if (path[3] === 'restore') {
      await env.DB.prepare("UPDATE students SET status = '재원', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
      const bundle = await getStudentMutationBundle(env, id);
      return jsonResponse({ success: true, student: bundle.student, class_student: bundle.class_student });
    }
    if (path[3] === 'hide') {
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
    if (String(current.status || '') !== '숨김') {
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
    await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
    const bundle = await getStudentMutationBundle(env, id);
    return jsonResponse({ success: true, student: bundle.student, class_student: bundle.class_student });
  }

  return null;
}
