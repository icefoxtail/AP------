import { jsonResponse } from '../helpers/response.js';
import { canAccessClass, canAccessStudent, getAllowedClassIds, isAdminUser } from '../helpers/foundation-db.js';
import { generateStudentPin, normalizeHighSubjects, normalizeTargetScore } from '../helpers/admin-db.js';

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
    studentPin: String(d.student_pin ?? d.studentPin ?? current.student_pin ?? '').trim(),
    highSubjects: normalizeHighSubjects(d.high_subjects ?? d.highSubjects ?? current.high_subjects ?? '[]'),
    classId: d.class_id !== undefined || d.classId !== undefined ? String(d.class_id ?? d.classId ?? '').trim() : undefined
  };
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
      WHERE id IN (
        SELECT student_id FROM class_students WHERE class_id IN (${markers})
      )
      ORDER BY grade, name
    `).bind(...classIds).all();
    return jsonResponse({ success: true, students: res.results || [] });
  }

  if (method === 'POST' && id === 'batch-pins') {
    const { class_id } = body;
    if (!class_id && !isAdminUser(teacher)) return jsonResponse({ error: 'Class ID required' }, 403);
    if (class_id && !(await canAccessClass(teacher, class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const targets = class_id
      ? await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND status = '재원' AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(class_id).all()
      : await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND status = '재원'").all();
    let count = 0;
    for (const s of targets.results) {
      const newPin = await generateStudentPin(s.grade, env);
      await env.DB.prepare('UPDATE students SET student_pin = ? WHERE id = ?').bind(newPin, s.id).run();
      count++;
    }
    return jsonResponse({ success: true, count });
  }

  if (method === 'POST' && path[3] === 'auto-pin') {
    if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const student = await env.DB.prepare('SELECT grade, student_pin FROM students WHERE id = ?').bind(id).first();
    if (!student) return jsonResponse({ error: 'Not found' }, 404);
    if (student.student_pin) return jsonResponse({ message: '이미 PIN이 설정된 학생입니다.' }, 400);
    const newPin = await generateStudentPin(student.grade, env);
    await env.DB.prepare('UPDATE students SET student_pin = ? WHERE id = ?').bind(newPin, id).run();
    return jsonResponse({ success: true, pin: newPin });
  }

  if (method === 'POST' && !id) {
    const d = normalizeStudentPayload(body);
    if (!isAdminUser(teacher)) {
      if (!d.classId) return jsonResponse({ error: 'Class ID required' }, 403);
      if (!(await canAccessClass(teacher, d.classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    }
    if (!d.name) return jsonResponse({ error: 'name required' }, 400);
    const pin = d.studentPin || await generateStudentPin(d.grade, env);
    const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ?').bind(pin).first();
    if (exist) return jsonResponse({ message: '이미 사용 중인 PIN입니다.' }, 409);

    const sid = `s_${Date.now()}`;
    const targetScore = normalizeTargetScore(d.targetScore);
    const stmts = [env.DB.prepare("INSERT INTO students (id, name, school_name, grade, target_score, status, memo, guardian_relation, student_phone, parent_phone, student_pin, high_subjects, created_at, updated_at) VALUES (?, ?, ?, ?, ?, '\uC7AC\uC6D0', ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))").bind(sid, d.name, d.schoolName, d.grade, targetScore, d.memo, d.guardianRelation, d.studentPhone, d.parentPhone, pin, d.highSubjects)];
    if (d.classId) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.classId, sid));
    try {
      await env.DB.batch(stmts);
      return jsonResponse({ success: true, id: sid });
    } catch (err) {
      if (err.message.includes('UNIQUE')) return jsonResponse({ message: '이미 사용 중인 PIN입니다.' }, 409);
      throw err;
    }
  }

  if (method === 'PATCH' && id) {
    if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    if (path[3] === 'restore') {
      await env.DB.prepare("UPDATE students SET status = '재원', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
      return jsonResponse({ success: true });
    }
    if (path[3] === 'hide') {
      await env.DB.prepare("UPDATE students SET status = '숨김', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
      return jsonResponse({ success: true });
    }
    const current = await env.DB.prepare('SELECT * FROM students WHERE id = ?').bind(id).first();
    if (!current) return jsonResponse({ error: 'Not found' }, 404);
    const d = normalizeStudentPayload(body, current);
    if (d.classId !== undefined && d.classId && !(await canAccessClass(teacher, d.classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    if (d.studentPin) {
      const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ? AND id != ?').bind(d.studentPin, id).first();
      if (exist) return jsonResponse({ message: '이미 사용 중인 PIN입니다.' }, 409);
    }
    if (!d.name) return jsonResponse({ error: 'name required' }, 400);
    const targetScore = normalizeTargetScore(d.targetScore);
    const stmts = [env.DB.prepare('UPDATE students SET name=?, school_name=?, grade=?, target_score=?, memo=?, guardian_relation=?, student_phone=?, parent_phone=?, student_pin=?, high_subjects=?, updated_at=DATETIME(\'now\') WHERE id=?').bind(d.name, d.schoolName, d.grade, targetScore, d.memo, d.guardianRelation, d.studentPhone, d.parentPhone, d.studentPin, d.highSubjects, id)];
    if (d.classId !== undefined) {
      stmts.push(env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id));
      if (d.classId) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.classId, id));
    }
    try {
      await env.DB.batch(stmts);
      return jsonResponse({ success: true });
    } catch (err) {
      if (err.message.includes('UNIQUE')) return jsonResponse({ message: '이미 사용 중인 PIN입니다.' }, 409);
      throw err;
    }
  }

  if (method === 'DELETE' && id) {
    if (!(await canAccessStudent(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
    return jsonResponse({ success: true });
  }

  return null;
}
