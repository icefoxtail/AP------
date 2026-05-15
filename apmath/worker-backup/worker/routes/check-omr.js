import { sha256hex } from '../helpers/admin-db.js';
import { isAdminUser } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

async function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Basic ')) return null;
  try {
    const [loginId, password] = atob(auth.slice(6)).split(':');
    const hash = await sha256hex(password);
    const authTeacher = await env.DB.prepare(
      'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(loginId, hash).first();
    return authTeacher || null;
  } catch (e) {
    return null;
  }
}

function todayKstDateString() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function handleQrClasses(request, env, teacher, url) {
  const currentTeacher = teacher || await verifyAuth(request, env);
  if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

  let query;
  const params = [];
  if (isAdminUser(currentTeacher)) {
    query = 'SELECT id, name, grade, teacher_name FROM classes WHERE is_active != 0 OR is_active IS NULL ORDER BY grade, name';
  } else {
    query = `
      SELECT c.id, c.name, c.grade, c.teacher_name
      FROM classes c
      JOIN teacher_classes tc ON tc.class_id = c.id
      WHERE tc.teacher_id = ? AND (c.is_active != 0 OR c.is_active IS NULL)
      ORDER BY c.grade, c.name`;
    params.push(currentTeacher.id);
  }
  const res = await env.DB.prepare(query).bind(...params).all();
  return jsonResponse({ success: true, classes: res.results });
}

export async function handleCheckOmr(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];

  if (resource === 'check-pin' && method === 'POST') {
    const { student_id, pin } = await request.json();
    const student = await env.DB.prepare('SELECT student_pin FROM students WHERE id = ?').bind(student_id).first();
    if (!student?.student_pin || student.student_pin === String(pin)) {
      return jsonResponse({ success: true });
    }
    return jsonResponse({ success: false, message: 'PIN 번호가 일치하지 않습니다.' }, 401);
  }

  if (resource === 'check-init' && method === 'GET') {
    const classId = url.searchParams.get('class');
    const examTitle = url.searchParams.get('exam') || '';
    const examDate = url.searchParams.get('date') || '';
    const qCount = parseInt(url.searchParams.get('q')) || 0;

    const archiveFile =
      url.searchParams.get('archiveFile') ||
      url.searchParams.get('archive_file') ||
      url.searchParams.get('archive') ||
      '';

    if (!classId) {
      return jsonResponse({ error: 'class required', students: [], submitted_sessions: [] }, 400);
    }

    const todayKST = todayKstDateString();
    const targetDate = examDate || todayKST;

    const [clsInfo, stds, sessions] = await Promise.all([
      env.DB.prepare('SELECT name FROM classes WHERE id = ?').bind(classId).first(),
      env.DB.prepare("SELECT id, name, school_name, grade, student_pin FROM students WHERE id IN (SELECT student_id FROM class_students WHERE class_id = ?) AND status = '재원'").bind(classId).all(),
      env.DB.prepare("SELECT id, student_id, exam_title, exam_date, score FROM exam_sessions WHERE exam_title = ? AND exam_date = ? AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(examTitle, targetDate, classId).all()
    ]);

    return jsonResponse({
      success: true,
      class_id: classId,
      class_name: clsInfo?.name || '알 수 없는 반',
      exam_title: examTitle,
      exam_date: targetDate,
      question_count: qCount,
      archive_file: archiveFile,
      students: stds.results,
      submitted_sessions: sessions.results
    });
  }

  if (resource === 'qr-classes' && method === 'GET') {
    return handleQrClasses(request, env, teacher, url);
  }

  return null;
}
