import { jsonResponse } from '../helpers/response.js';
import { canAccessClass, getAllowedClassIds, isAdminUser, isStaffUser } from '../helpers/foundation-db.js';
import { findTeacherByAlias } from '../helpers/admin-db.js';

function normalizeClassPayload(d = {}, current = {}, teacher = null) {
  return {
    name: String(d.name ?? current.name ?? '').trim(),
    grade: String(d.grade ?? current.grade ?? '').trim(),
    subject: String(d.subject ?? current.subject ?? '수학').trim() || '수학',
    teacherName: String(d.teacher_name ?? d.teacherName ?? current.teacher_name ?? teacher?.name ?? '박준성').trim() || '박준성',
    scheduleDays: String(d.schedule_days ?? d.scheduleDays ?? current.schedule_days ?? '').trim(),
    textbook: String(d.textbook ?? current.textbook ?? '').trim(),
    isActive: d.is_active !== undefined ? Number(d.is_active) : (current.is_active !== undefined ? Number(current.is_active) : 1),
    dayGroup: String(d.day_group ?? d.dayGroup ?? d.schedule_group ?? d.scheduleGroup ?? current.day_group ?? '').trim(),
    timeLabel: String(d.time_label ?? d.timeLabel ?? d.schedule_time ?? d.scheduleTime ?? current.time_label ?? '').trim()
  };
}

async function syncTeacherClassMapping(env, classId, teacherName) {
  if (!classId) return false;
  const matched = await findTeacherByAlias(env, teacherName);
  if (!matched) return false;
  await env.DB.batch([
    env.DB.prepare('DELETE FROM teacher_classes WHERE class_id = ?').bind(classId),
    env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(matched.id, classId)
  ]);
  return true;
}

export async function handleClasses(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource !== 'classes') return null;
  if (!isStaffUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);

  if (method === 'GET' && !id) {
    if (isAdminUser(teacher)) {
      const res = await env.DB.prepare('SELECT * FROM classes WHERE is_active != 0 OR is_active IS NULL ORDER BY grade, name').all();
      return jsonResponse({ success: true, classes: res.results || [] });
    }
    const classIds = await getAllowedClassIds(env, teacher);
    if (!classIds?.length) return jsonResponse({ success: true, classes: [] });
    const markers = classIds.map(() => '?').join(',');
    const res = await env.DB.prepare(`
      SELECT *
      FROM classes
      WHERE id IN (${markers})
        AND (is_active != 0 OR is_active IS NULL)
      ORDER BY grade, name
    `).bind(...classIds).all();
    return jsonResponse({ success: true, classes: res.results || [] });
  }

  if (method === 'POST') {
    const d = normalizeClassPayload(body, {}, teacher);
    if (!d.name) return jsonResponse({ error: 'name required' }, 400);
    const cid = `cls_${Date.now()}`;
    await env.DB.prepare('INSERT INTO classes (id, name, grade, subject, teacher_name, schedule_days, textbook, is_active, day_group, time_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(cid, d.name, d.grade, d.subject, d.teacherName, d.scheduleDays, d.textbook, d.isActive, d.dayGroup, d.timeLabel).run();
    const mappingUpdated = await syncTeacherClassMapping(env, cid, d.teacherName);
    return jsonResponse({ success: true, id: cid, mappingUpdated });
  }

  if (method === 'PATCH' && id) {
    const current = await env.DB.prepare('SELECT * FROM classes WHERE id = ?').bind(id).first();
    if (!current) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const d = normalizeClassPayload(body, current, teacher);
    if (!d.name) return jsonResponse({ error: 'name required' }, 400);
    await env.DB.prepare('UPDATE classes SET name = ?, grade = ?, subject = ?, teacher_name = ?, schedule_days = ?, textbook = ?, is_active = ?, day_group = ?, time_label = ? WHERE id = ?').bind(d.name, d.grade, d.subject, d.teacherName, d.scheduleDays, d.textbook, d.isActive, d.dayGroup, d.timeLabel, id).run();
    const mappingUpdated = await syncTeacherClassMapping(env, id, d.teacherName);
    return jsonResponse({ success: true, mappingUpdated });
  }

  if (method === 'DELETE' && id) {
    const classId = String(id || '').trim();
    if (!classId) return jsonResponse({ error: 'class id required' }, 400);
    const current = await env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(classId).first();
    if (!current) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

    const countRows = async (table) => {
      const row = await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE class_id = ?`).bind(classId).first();
      return Number(row?.count || 0);
    };
    const deleted = {
      class_students: await countRows('class_students'),
      teacher_classes: await countRows('teacher_classes'),
      class_textbooks: await countRows('class_textbooks'),
      class_daily_records: await countRows('class_daily_records'),
      class_daily_progress: await countRows('class_daily_progress'),
      class_exam_assignments: await countRows('class_exam_assignments'),
      exam_sessions: await countRows('exam_sessions'),
      school_exam_records: await countRows('school_exam_records'),
      classes: 1
    };

    const sessionRes = await env.DB.prepare('SELECT id FROM exam_sessions WHERE class_id = ?').bind(classId).all();
    const sessionIds = (sessionRes.results || []).map(r => String(r.id || '').trim()).filter(Boolean);
    const wrongAnswerDelete = sessionIds.length
      ? [env.DB.prepare(`DELETE FROM wrong_answers WHERE session_id IN (${sessionIds.map(() => '?').join(',')})`).bind(...sessionIds)]
      : [];

    await env.DB.batch([
      ...wrongAnswerDelete,
      env.DB.prepare('DELETE FROM teacher_classes WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM class_students WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM class_textbooks WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM class_daily_progress WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM class_daily_records WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM class_exam_assignments WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM exam_sessions WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM school_exam_records WHERE class_id = ?').bind(classId),
      env.DB.prepare('DELETE FROM classes WHERE id = ?').bind(classId)
    ]);
    return jsonResponse({ success: true, mode: 'deleted', deleted });
  }

  return null;
}
