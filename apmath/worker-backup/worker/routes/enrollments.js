import { jsonResponse } from '../helpers/response.js';
import { normalizeBranch } from '../helpers/branch.js';
import { canAccessClass, canAccessStudent, foundationInsert, foundationPatch, foundationSelect, getAllowedClassIds, isAdminUser, makeId } from '../helpers/foundation-db.js';

export async function handleEnrollments(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const id = path[2];
  if (method === 'POST' && id === 'transfer') {
    if (!isAdminUser(teacher)) return jsonResponse({ success: false, error: 'admin only' }, 403);

    const studentId = String(body.student_id || body.studentId || '').trim();
    const sourceClassId = String(body.source_class_id || body.sourceClassId || '').trim();
    const targetClassId = String(body.target_class_id || body.targetClassId || '').trim();
    const memo = String(body.memo || '전체시간표 드래그 전반').trim() || '전체시간표 드래그 전반';

    if (!studentId || !sourceClassId || !targetClassId) {
      return jsonResponse({ success: false, error: 'student_id, source_class_id and target_class_id required' }, 400);
    }
    if (sourceClassId === targetClassId) {
      return jsonResponse({ success: false, error: 'source and target class are same' }, 400);
    }

    const [student, sourceClass, targetClass, sourceMap, targetMap, sourceEnrollment, targetEnrollment] = await Promise.all([
      env.DB.prepare('SELECT id FROM students WHERE id = ?').bind(studentId).first(),
      env.DB.prepare('SELECT id, name FROM classes WHERE id = ?').bind(sourceClassId).first(),
      env.DB.prepare('SELECT id, name FROM classes WHERE id = ?').bind(targetClassId).first(),
      env.DB.prepare('SELECT class_id, student_id FROM class_students WHERE class_id = ? AND student_id = ?').bind(sourceClassId, studentId).first(),
      env.DB.prepare('SELECT class_id, student_id FROM class_students WHERE class_id = ? AND student_id = ?').bind(targetClassId, studentId).first(),
      env.DB.prepare("SELECT * FROM student_enrollments WHERE student_id = ? AND class_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1").bind(studentId, sourceClassId).first(),
      env.DB.prepare("SELECT * FROM student_enrollments WHERE student_id = ? AND class_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 1").bind(studentId, targetClassId).first()
    ]);

    if (!student) return jsonResponse({ success: false, error: 'student not found' }, 404);
    if (!sourceClass) return jsonResponse({ success: false, error: 'source class not found' }, 404);
    if (!targetClass) return jsonResponse({ success: false, error: 'target class not found' }, 404);
    if (!sourceMap) return jsonResponse({ success: false, error: 'student is not assigned to source class' }, 400);

    const transferHistoryId = makeId('ctr');
    const activeEnrollmentId = targetEnrollment?.id || makeId('enr');
    const branch = normalizeBranch(sourceEnrollment?.branch || targetEnrollment?.branch || 'apmath');
    const stmts = [
      env.DB.prepare('DELETE FROM class_students WHERE class_id = ? AND student_id = ?').bind(sourceClassId, studentId)
    ];

    if (!targetMap) {
      stmts.push(env.DB.prepare('INSERT OR IGNORE INTO class_students (class_id, student_id) VALUES (?, ?)').bind(targetClassId, studentId));
    }

    if (sourceEnrollment?.id) {
      stmts.push(env.DB.prepare("UPDATE student_enrollments SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(sourceEnrollment.id));
    }

    if (!targetEnrollment?.id) {
      stmts.push(env.DB.prepare(`
        INSERT INTO student_enrollments
        (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount, memo)
        VALUES (?, ?, ?, ?, 'active', DATE('now', '+9 hours'), NULL, NULL, ?)
      `).bind(activeEnrollmentId, studentId, branch, targetClassId, memo));
    }

    stmts.push(env.DB.prepare(`
      INSERT INTO class_transfer_history
      (id, student_id, from_class_id, to_class_id, reason, changed_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(transferHistoryId, studentId, sourceClassId, targetClassId, memo, teacher.id || teacher.login_id || teacher.name || null));

    await env.DB.batch(stmts);

    const [classStudentsRes, enrollmentsRes] = await Promise.all([
      env.DB.prepare('SELECT class_id, student_id FROM class_students WHERE student_id = ?').bind(studentId).all(),
      env.DB.prepare('SELECT * FROM student_enrollments WHERE student_id = ? ORDER BY created_at DESC').bind(studentId).all()
    ]);

    return jsonResponse({
      success: true,
      student_id: studentId,
      source_class_id: sourceClassId,
      target_class_id: targetClassId,
      class_transfer_history_id: transferHistoryId,
      ended_enrollment_id: sourceEnrollment?.id || null,
      active_enrollment_id: activeEnrollmentId,
      class_students: classStudentsRes.results || [],
      student_enrollments: enrollmentsRes.results || []
    });
  }

  if (method === 'GET') {
    const where = [];
    const params = [];
    if (url.searchParams.get('student_id')) { where.push('student_id = ?'); params.push(url.searchParams.get('student_id')); }
    if (url.searchParams.get('class_id')) { where.push('class_id = ?'); params.push(url.searchParams.get('class_id')); }
    if (!isAdminUser(teacher)) {
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.length) return jsonResponse({ success: true, enrollments: [] });
      where.push(`class_id IN (${classIds.map(() => '?').join(',')})`);
      params.push(...classIds);
    }
    return jsonResponse({ success: true, enrollments: await foundationSelect(env, 'student_enrollments', where, params) });
  }
  if (method === 'POST') {
    if (!(await canAccessStudent(teacher, body.student_id, env)) || !(await canAccessClass(teacher, body.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const row = {
      id: makeId('enr'),
      student_id: String(body.student_id || '').trim(),
      branch: normalizeBranch(body.branch),
      class_id: String(body.class_id || '').trim(),
      status: String(body.status || 'active').trim(),
      start_date: body.start_date || null,
      end_date: null,
      tuition_amount: Number.isFinite(Number(body.tuition_amount)) ? Number(body.tuition_amount) : null,
      memo: body.memo || null
    };
    if (!row.student_id || !row.class_id) return jsonResponse({ success: false, error: 'student_id and class_id required' }, 400);
    row.end_date = body.end_date || null;
    return jsonResponse({ success: true, enrollment: await foundationInsert(env, 'student_enrollments', row) });
  }
  if (method === 'PATCH' && id) {
    const existing = await env.DB.prepare('SELECT * FROM student_enrollments WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, existing.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    if (body.class_id && !(await canAccessClass(teacher, body.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const changed = await foundationPatch(env, 'student_enrollments', id, { ...body, branch: body.branch ? normalizeBranch(body.branch) : undefined }, ['student_id', 'branch', 'class_id', 'status', 'start_date', 'end_date', 'tuition_amount', 'memo']);
    return jsonResponse({ success: true, enrollment: changed });
  }
  if (method === 'DELETE' && id) {
    const existing = await env.DB.prepare('SELECT * FROM student_enrollments WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, existing.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    await env.DB.prepare("UPDATE student_enrollments SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
    return jsonResponse({ success: true });
  }
  return null;
}
