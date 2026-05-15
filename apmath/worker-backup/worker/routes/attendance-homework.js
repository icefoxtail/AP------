import { jsonResponse } from '../helpers/response.js';
import { canAccessStudent, isAdminUser } from '../helpers/foundation-db.js';

function todayKstDateString() {
  return new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];
}

async function getTeacherStudentIds(env, teacher) {
  const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
  const classIds = (tcls.results || []).map(r => r.class_id);
  if (!classIds.length) return { classIds, studentIds: [] };
  const cMarkers = classIds.map(() => '?').join(',');
  const map = await env.DB.prepare(`SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})`).bind(...classIds).all();
  return {
    classIds,
    studentIds: [...new Set((map.results || []).map(r => r.student_id))]
  };
}

function normalizeText(value) {
  if (Array.isArray(value)) {
    return value.map(v => String(v || '').trim()).filter(Boolean).join(',');
  }
  return String(value ?? '').trim();
}

async function handleAttendanceHistory(env, teacher, url) {
  const date = url.searchParams.get('date') || todayKstDateString();

  if (isAdminUser(teacher)) {
    const [att, hw] = await Promise.all([
      env.DB.prepare('SELECT * FROM attendance WHERE date = ?').bind(date).all(),
      env.DB.prepare('SELECT * FROM homework WHERE date = ?').bind(date).all()
    ]);
    return jsonResponse({ attendance: att.results, homework: hw.results, date });
  }

  const { studentIds } = await getTeacherStudentIds(env, teacher);
  if (!studentIds.length) return jsonResponse({ attendance: [], homework: [], date });
  const sMarkers = studentIds.map(() => '?').join(',');
  const [att, hw] = await Promise.all([
    env.DB.prepare(`SELECT * FROM attendance WHERE date = ? AND student_id IN (${sMarkers})`).bind(date, ...studentIds).all(),
    env.DB.prepare(`SELECT * FROM homework WHERE date = ? AND student_id IN (${sMarkers})`).bind(date, ...studentIds).all()
  ]);
  return jsonResponse({ attendance: att.results, homework: hw.results, date });
}

async function handleAttendanceMonth(env, teacher, url) {
  const month = String(url.searchParams.get('month') || '').trim();
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return jsonResponse({ success: false, message: 'month must be YYYY-MM' }, 400);
  }

  const [year, monthNo] = month.split('-').map(Number);
  const endDay = new Date(year, monthNo, 0).getDate();
  const startDate = `${month}-01`;
  const endDate = `${month}-${String(endDay).padStart(2, '0')}`;

  if (isAdminUser(teacher)) {
    const [att, hw, acs] = await Promise.all([
      env.DB.prepare('SELECT * FROM attendance WHERE date BETWEEN ? AND ? ORDER BY date ASC').bind(startDate, endDate).all(),
      env.DB.prepare('SELECT * FROM homework WHERE date BETWEEN ? AND ? ORDER BY date ASC').bind(startDate, endDate).all(),
      env.DB.prepare('SELECT * FROM academy_schedules WHERE is_deleted = 0 AND schedule_date BETWEEN ? AND ? ORDER BY schedule_date ASC, start_time ASC, created_at ASC').bind(startDate, endDate).all()
    ]);
    return jsonResponse({ success: true, month, attendance: att.results, homework: hw.results, academy_schedules: acs.results });
  }

  const { classIds, studentIds } = await getTeacherStudentIds(env, teacher);
  if (!classIds.length || !studentIds.length) {
    const acs = await env.DB.prepare(`SELECT * FROM academy_schedules WHERE is_deleted = 0 AND schedule_date BETWEEN ? AND ? AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?)) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`).bind(startDate, endDate, teacher.name).all();
    return jsonResponse({ success: true, month, attendance: [], homework: [], academy_schedules: acs.results });
  }

  const sMarkers = studentIds.map(() => '?').join(',');
  const [att, hw, acsForTeacher] = await Promise.all([
    env.DB.prepare(`SELECT * FROM attendance WHERE date BETWEEN ? AND ? AND student_id IN (${sMarkers}) ORDER BY date ASC`).bind(startDate, endDate, ...studentIds).all(),
    env.DB.prepare(`SELECT * FROM homework WHERE date BETWEEN ? AND ? AND student_id IN (${sMarkers}) ORDER BY date ASC`).bind(startDate, endDate, ...studentIds).all(),
    env.DB.prepare(`SELECT * FROM academy_schedules WHERE is_deleted = 0 AND schedule_date BETWEEN ? AND ? AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?) OR (target_scope = 'student' AND student_id IN (${sMarkers}))) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`).bind(startDate, endDate, teacher.name, ...studentIds).all()
  ]);
  return jsonResponse({ success: true, month, attendance: att.results, homework: hw.results, academy_schedules: acsForTeacher.results });
}

async function handleAttendanceBatch(env, teacher, body) {
  const entries = Array.isArray(body.entries) ? body.entries : [];
  for (const { studentId } of entries) {
    if (!(await canAccessStudent(teacher, studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
  }
  const stmts = entries.map(({ studentId, status, date }) =>
    env.DB.prepare(`
      INSERT INTO attendance (id, student_id, status, date, created_at, updated_at)
      VALUES (?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        updated_at = DATETIME('now')
    `).bind(`${studentId}_${date}`, studentId, status, date)
  );
  if (stmts.length) await env.DB.batch(stmts);
  return jsonResponse({ success: true });
}

async function handleHomeworkBatch(env, teacher, body) {
  const entries = Array.isArray(body.entries) ? body.entries : [];
  for (const { studentId } of entries) {
    if (!(await canAccessStudent(teacher, studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
  }
  const stmts = entries.map(({ studentId, status, date }) =>
    env.DB.prepare("INSERT INTO homework (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status")
      .bind(`${studentId}_${date}`, studentId, status, date)
  );
  if (stmts.length) await env.DB.batch(stmts);
  return jsonResponse({ success: true });
}

async function handleAttendancePatch(env, teacher, body) {
  const studentId = body.studentId;
  const date = body.date;
  if (!studentId || !date) return jsonResponse({ success: false, message: 'studentId and date are required' }, 400);
  if (!(await canAccessStudent(teacher, studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

  const hasStatus = Object.prototype.hasOwnProperty.call(body, 'status');
  const hasTags = Object.prototype.hasOwnProperty.call(body, 'tags');
  const hasMemo = Object.prototype.hasOwnProperty.call(body, 'memo');
  if (!hasStatus && !hasTags && !hasMemo) return jsonResponse({ success: false, message: 'status, tags, or memo is required' }, 400);

  const id = `${studentId}_${date}`;
  const existing = await env.DB.prepare('SELECT id FROM attendance WHERE id = ?').bind(id).first();
  if (!existing) {
    await env.DB.prepare(`
      INSERT INTO attendance (id, student_id, status, date, tags, memo, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
    `).bind(
      id,
      studentId,
      hasStatus ? normalizeText(body.status) : '\uBBF8\uAE30\uB85D',
      date,
      hasTags ? normalizeText(body.tags) : '',
      hasMemo ? normalizeText(body.memo) : ''
    ).run();
    return jsonResponse({ success: true });
  }

  const sets = [];
  const binds = [];
  if (hasStatus) { sets.push('status = ?'); binds.push(normalizeText(body.status)); }
  if (hasTags) { sets.push('tags = ?'); binds.push(normalizeText(body.tags)); }
  if (hasMemo) { sets.push('memo = ?'); binds.push(normalizeText(body.memo)); }
  sets.push("updated_at = DATETIME('now')");
  binds.push(id);
  await env.DB.prepare(`UPDATE attendance SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run();
  return jsonResponse({ success: true });
}

async function handleHomeworkPatch(env, teacher, body) {
  if (!(await canAccessStudent(teacher, body.studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
  await env.DB.prepare(`
    INSERT INTO homework (id, student_id, status, date, created_at)
    VALUES (?, ?, ?, ?, DATETIME('now'))
    ON CONFLICT(id) DO UPDATE SET status = excluded.status
  `).bind(`${body.studentId}_${body.date}`, body.studentId, body.status, body.date).run();
  return jsonResponse({ success: true });
}

export async function handleAttendanceHomework(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const resource = path[1];

  if (resource === 'attendance-history' && method === 'GET') return handleAttendanceHistory(env, teacher, url);
  if (resource === 'attendance-month' && method === 'GET') return handleAttendanceMonth(env, teacher, url);
  if (resource === 'attendance-batch' && method === 'POST') return handleAttendanceBatch(env, teacher, body);
  if (resource === 'homework-batch' && method === 'POST') return handleHomeworkBatch(env, teacher, body);
  if (resource === 'attendance' && method === 'PATCH') return handleAttendancePatch(env, teacher, body);
  if (resource === 'homework' && method === 'PATCH') return handleHomeworkPatch(env, teacher, body);

  return null;
}
