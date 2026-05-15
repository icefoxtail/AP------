import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass } from '../helpers/foundation-db.js';
import { headers } from '../helpers/response.js';

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

function makeHomeworkPhotoId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function responseJson(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers });
}

function getHomeworkPhotoBaseUrl(url, path) {
  const origin = url.origin;
  const apiIdx = path.indexOf('api');
  const baseParts = apiIdx > 0 ? path.slice(0, apiIdx) : [];
  const basePath = baseParts.length ? `/${baseParts.join('/')}/` : '/';
  return `${origin}${basePath}homework/`;
}

function buildHomeworkPhotoLink(url, path, assignmentId, studentId) {
  return `${getHomeworkPhotoBaseUrl(url, path)}?assignment_id=${encodeURIComponent(assignmentId)}&student_id=${encodeURIComponent(studentId)}`;
}

function normalizeHomeworkPhotoDate(value) {
  const str = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(str) ? str : '';
}

function normalizeHomeworkPhotoTime(value) {
  const str = String(value || '').trim();
  return /^\d{2}:\d{2}$/.test(str) ? str : '';
}

function buildHomeworkPhotoStatusStatements(env, studentId, date, status) {
  const sid = String(studentId || '').trim();
  const safeDate = normalizeHomeworkPhotoDate(date);
  const safeStatus = String(status || '').trim();
  if (!sid || !safeDate || !safeStatus) return [];

  return [
    env.DB.prepare(`
      DELETE FROM homework
      WHERE student_id = ? AND date = ?
    `).bind(sid, safeDate),
    env.DB.prepare(`
      INSERT INTO homework (id, student_id, status, date, created_at)
      VALUES (?, ?, ?, ?, DATETIME('now'))
    `).bind(`${sid}_${safeDate}`, sid, safeStatus, safeDate)
  ];
}

async function syncHomeworkPhotoStatus(env, studentId, date, status) {
  const stmts = buildHomeworkPhotoStatusStatements(env, studentId, date, status);
  if (stmts.length) await env.DB.batch(stmts);
}

function getHomeworkPhotoAssignment(env, assignmentId) {
  return env.DB.prepare(`
    SELECT hpa.*, c.name AS class_name
    FROM homework_photo_assignments hpa
    LEFT JOIN classes c ON c.id = hpa.class_id
    WHERE hpa.id = ? AND hpa.status != 'deleted'
  `).bind(assignmentId).first();
}

async function checkHomeworkPhotoStudent(env, assignmentId, studentId, pin = '') {
  const row = await env.DB.prepare(`
    SELECT
      hpa.id AS assignment_id,
      hpa.class_id,
      hpa.title,
      hpa.description,
      hpa.due_date,
      hpa.due_time,
      hpa.status AS assignment_status,
      c.name AS class_name,
      hps.id AS submission_id,
      hps.is_submitted,
      hps.submitted_at,
      s.name AS student_name,
      s.student_pin,
      s.status AS student_status
    FROM homework_photo_assignments hpa
    JOIN homework_photo_submissions hps ON hps.assignment_id = hpa.id
    JOIN students s ON s.id = hps.student_id
    LEFT JOIN classes c ON c.id = hpa.class_id
    WHERE hpa.id = ? AND hps.student_id = ? AND hpa.status != 'deleted'
  `).bind(assignmentId, studentId).first();

  if (!row) return { authorized: false, status: 404, error: 'Not found' };
  if (row.student_status !== '재원') return { authorized: false, status: 403, error: 'Not active student' };
  if (row.student_pin && String(row.student_pin) !== String(pin || '').trim()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { authorized: false, status: 401, error: 'PIN mismatch' };
  }
  return { authorized: true, row };
}

async function checkHomeworkPhotoStudentToken(env, studentId, token = '') {
  const sid = String(studentId || '').trim();
  const safeToken = String(token || '').trim();
  if (!sid || !safeToken) return false;
  const student = await env.DB.prepare(`
    SELECT id, student_pin, status
    FROM students
    WHERE id = ?
  `).bind(sid).first();
  if (!student || student.status !== '재원') return false;
  const expectedToken = await sha256hex(`${student.id}:${student.student_pin || ''}:student-portal:v1`);
  return safeToken === expectedToken;
}

export async function handleHomeworkPhoto(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource !== 'homework-photo') return null;

  if (method === 'POST' && id === 'assignments') {
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (!currentTeacher) return responseJson({ error: 'Unauthorized' }, 401);

    const d = await request.json();
    const classId = String(d.class_id || d.classId || '').trim();
    const title = String(d.title || '').trim();
    const description = String(d.description || '').trim();
    const dueDate = normalizeHomeworkPhotoDate(d.due_date || d.dueDate);
    const dueTime = normalizeHomeworkPhotoTime(d.due_time || d.dueTime);

    if (!classId || !title || !dueDate) {
      return responseJson({ success: false, error: 'class_id, title, due_date required' }, 400);
    }
    if (!(await canAccessClass(currentTeacher, classId, env))) {
      return responseJson({ error: 'Forbidden' }, 403);
    }

    const students = await env.DB.prepare(`
      SELECT id, name
      FROM students
      WHERE status = '재원'
        AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)
      ORDER BY name ASC
    `).bind(classId).all();
    const studentList = students.results || [];
    const assignmentId = makeHomeworkPhotoId('hpa');
    const stmts = [
      env.DB.prepare(`
        INSERT INTO homework_photo_assignments (
          id, class_id, teacher_id, title, description, due_date, due_time, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', DATETIME('now'), DATETIME('now'))
      `).bind(assignmentId, classId, currentTeacher.id, title, description, dueDate, dueTime)
    ];

    for (const s of studentList) {
      stmts.push(env.DB.prepare(`
        INSERT OR IGNORE INTO homework_photo_submissions (
          id, assignment_id, student_id, is_submitted, created_at, updated_at
        ) VALUES (?, ?, ?, 0, DATETIME('now'), DATETIME('now'))
      `).bind(makeHomeworkPhotoId('hps'), assignmentId, s.id));
    }
    await env.DB.batch(stmts);

    const links = studentList.map(s => ({
      student_id: s.id,
      name: s.name,
      url: buildHomeworkPhotoLink(url, path, assignmentId, s.id)
    }));

    return responseJson({ success: true, assignment_id: assignmentId, links });
  }

  if (method === 'DELETE' && id && id !== 'assignments' && id !== 'overview' && id !== 'student-links' && id !== 'assignment' && id !== 'auth' && id !== 'submit' && id !== 'cancel') {
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (!currentTeacher) return responseJson({ error: 'Unauthorized' }, 401);

    const assignmentId = String(id || '').trim();
    const assignment = await getHomeworkPhotoAssignment(env, assignmentId);
    if (!assignment) return responseJson({ success: false, error: 'Not found' }, 404);
    if (!(await canAccessClass(currentTeacher, assignment.class_id, env))) {
      return responseJson({ error: 'Forbidden' }, 403);
    }

    await env.DB.prepare(`
      UPDATE homework_photo_assignments
      SET status = 'deleted',
          updated_at = DATETIME('now')
      WHERE id = ?
    `).bind(assignmentId).run();

    return responseJson({ success: true, deleted_id: assignmentId });
  }

  if (method === 'PATCH' && id && id !== 'assignments' && id !== 'overview' && id !== 'student-links' && id !== 'assignment' && id !== 'auth' && id !== 'submit' && id !== 'cancel' && path[3] !== 'close') {
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (!currentTeacher) return responseJson({ error: 'Unauthorized' }, 401);

    const assignmentId = String(id || '').trim();
    const assignment = await getHomeworkPhotoAssignment(env, assignmentId);
    if (!assignment) return responseJson({ success: false, error: 'Not found' }, 404);
    if (!(await canAccessClass(currentTeacher, assignment.class_id, env))) {
      return responseJson({ error: 'Forbidden' }, 403);
    }

    const d = await request.json();
    const title = String(d.title || '').trim();
    const description = String(d.description || '').trim();
    const dueDate = normalizeHomeworkPhotoDate(d.due_date || d.dueDate);
    const dueTime = normalizeHomeworkPhotoTime(d.due_time || d.dueTime);

    if (!title || !dueDate) {
      return responseJson({ success: false, error: 'title, due_date required' }, 400);
    }

    await env.DB.prepare(`
      UPDATE homework_photo_assignments
      SET title = ?,
          description = ?,
          due_date = ?,
          due_time = ?,
          updated_at = DATETIME('now')
      WHERE id = ?
    `).bind(title, description, dueDate, dueTime, assignmentId).run();

    const updated = await getHomeworkPhotoAssignment(env, assignmentId);
    return responseJson({ success: true, assignment: updated });
  }

  if (method === 'GET' && id === 'assignments') {
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (!currentTeacher) return responseJson({ error: 'Unauthorized' }, 401);

    const classId = String(url.searchParams.get('class_id') || '').trim();
    if (!classId) return responseJson({ success: false, error: 'class_id required' }, 400);
    if (!(await canAccessClass(currentTeacher, classId, env))) return responseJson({ error: 'Forbidden' }, 403);

    const res = await env.DB.prepare(`
      SELECT hpa.*,
             COUNT(hps.id) AS total,
             SUM(CASE WHEN hps.is_submitted = 1 THEN 1 ELSE 0 END) AS submitted
      FROM homework_photo_assignments hpa
      LEFT JOIN homework_photo_submissions hps ON hps.assignment_id = hpa.id
      WHERE hpa.class_id = ? AND hpa.status != 'deleted'
      GROUP BY hpa.id
      ORDER BY hpa.due_date DESC, hpa.created_at DESC
      LIMIT 30
    `).bind(classId).all();

    return responseJson({ success: true, assignments: res.results || [] });
  }

  if (method === 'GET' && id === 'overview') {
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (!currentTeacher) return responseJson({ error: 'Unauthorized' }, 401);

    const assignmentId = String(url.searchParams.get('assignment_id') || '').trim();
    if (!assignmentId) return responseJson({ success: false, error: 'assignment_id required' }, 400);

    const assignment = await getHomeworkPhotoAssignment(env, assignmentId);
    if (!assignment) return responseJson({ success: false, error: 'Not found' }, 404);
    if (!(await canAccessClass(currentTeacher, assignment.class_id, env))) return responseJson({ error: 'Forbidden' }, 403);

    const rows = await env.DB.prepare(`
      SELECT
        hps.id AS submission_id,
        hps.student_id,
        hps.is_submitted,
        hps.submitted_at,
        hps.synced_homework_status,
        s.name,
        s.parent_phone,
        s.guardian_name,
        COUNT(hpf.id) AS file_count
      FROM homework_photo_submissions hps
      JOIN students s ON s.id = hps.student_id
      LEFT JOIN homework_photo_files hpf
        ON hpf.submission_id = hps.id AND hpf.deleted_at IS NULL
      WHERE hps.assignment_id = ?
      GROUP BY hps.id
      ORDER BY s.name ASC
    `).bind(assignmentId).all();

    const students = (rows.results || []).map(r => ({
      ...r,
      url: buildHomeworkPhotoLink(url, path, assignmentId, r.student_id)
    }));
    return responseJson({ success: true, assignment, students });
  }

  if (method === 'GET' && id === 'student-links') {
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (!currentTeacher) return responseJson({ error: 'Unauthorized' }, 401);

    const assignmentId = String(url.searchParams.get('assignment_id') || '').trim();
    const assignment = await getHomeworkPhotoAssignment(env, assignmentId);
    if (!assignment) return responseJson({ success: false, error: 'Not found' }, 404);
    if (!(await canAccessClass(currentTeacher, assignment.class_id, env))) return responseJson({ error: 'Forbidden' }, 403);

    const rows = await env.DB.prepare(`
      SELECT hps.student_id, s.name
      FROM homework_photo_submissions hps
      JOIN students s ON s.id = hps.student_id
      WHERE hps.assignment_id = ?
      ORDER BY s.name ASC
    `).bind(assignmentId).all();
    const links = (rows.results || []).map(s => ({
      student_id: s.student_id,
      name: s.name,
      url: buildHomeworkPhotoLink(url, path, assignmentId, s.student_id)
    }));
    return responseJson({ success: true, assignment, links });
  }

  if (method === 'GET' && id === 'assignment') {
    const assignmentId = String(url.searchParams.get('assignment_id') || '').trim();
    const studentId = String(url.searchParams.get('student_id') || '').trim();
    if (!assignmentId || !studentId) {
      return responseJson({ success: false, error: 'assignment_id, student_id required' }, 400);
    }

    const row = await env.DB.prepare(`
      SELECT
        hpa.id AS assignment_id,
        hpa.class_id,
        hpa.title,
        hpa.description,
        hpa.due_date,
        hpa.due_time,
        hpa.status AS assignment_status,
        c.name AS class_name,
        hps.id AS submission_id,
        hps.is_submitted,
        hps.submitted_at,
        s.name AS student_name,
        s.status AS student_status
      FROM homework_photo_assignments hpa
      JOIN homework_photo_submissions hps ON hps.assignment_id = hpa.id
      JOIN students s ON s.id = hps.student_id
      LEFT JOIN classes c ON c.id = hpa.class_id
      WHERE hpa.id = ? AND hps.student_id = ? AND hpa.status != 'deleted'
    `).bind(assignmentId, studentId).first();

    if (!row) return responseJson({ success: false, error: 'Not found' }, 404);
    if (row.student_status !== '재원') return responseJson({ success: false, error: 'Not active student' }, 403);

    return responseJson({
      success: true,
      assignment: {
        id: row.assignment_id,
        class_id: row.class_id,
        class_name: row.class_name,
        title: row.title,
        description: row.description,
        due_date: row.due_date,
        due_time: row.due_time,
        status: row.assignment_status
      },
      student: {
        id: studentId,
        name: row.student_name
      },
      submission: {
        id: row.submission_id,
        is_submitted: row.is_submitted,
        submitted_at: row.submitted_at
      }
    });
  }

  if (method === 'POST' && id === 'auth') {
    const d = await request.json();
    const assignmentId = String(d.assignment_id || '').trim();
    const studentId = String(d.student_id || '').trim();
    const pin = String(d.pin || '').trim();
    const auth = await checkHomeworkPhotoStudent(env, assignmentId, studentId, pin);
    if (!auth.authorized) {
      return responseJson({ success: false, error: auth.error }, auth.status || 403);
    }
    return responseJson({ success: true });
  }

  if (method === 'POST' && id === 'submit') {
    const d = await request.json();
    const assignmentId = String(d.assignment_id || '').trim();
    const studentId = String(d.student_id || '').trim();
    const pin = String(d.pin || '').trim();
    const auth = await checkHomeworkPhotoStudent(env, assignmentId, studentId, pin);
    if (!auth.authorized) {
      return responseJson({ success: false, error: auth.error }, auth.status || 403);
    }

    const row = auth.row;
    await env.DB.prepare(`
      UPDATE homework_photo_submissions
      SET is_submitted = 1,
          submitted_at = COALESCE(submitted_at, DATETIME('now')),
          synced_homework_date = ?,
          synced_homework_status = '완료',
          updated_at = DATETIME('now')
      WHERE id = ?
    `).bind(row.due_date, row.submission_id).run();
    await syncHomeworkPhotoStatus(env, studentId, row.due_date, '완료');

    return responseJson({ success: true });
  }

  if (method === 'POST' && id === 'cancel') {
    const d = await request.json();
    const assignmentId = String(d.assignment_id || d.assignmentId || '').trim();
    const studentId = String(d.student_id || d.studentId || '').trim();
    const pin = String(d.pin || '').trim();
    const studentToken = String(d.student_token || d.studentToken || d.token || request.headers.get('X-Student-Token') || '').trim();

    if (!assignmentId || !studentId) {
      return responseJson({ success: false, error: 'assignment_id, student_id required' }, 400);
    }

    const assignment = await getHomeworkPhotoAssignment(env, assignmentId);
    if (!assignment) return responseJson({ success: false, error: 'Not found' }, 404);

    let authorized = false;
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (currentTeacher) {
      authorized = await canAccessClass(currentTeacher, assignment.class_id, env);
    }

    if (!authorized && studentToken) {
      authorized = await checkHomeworkPhotoStudentToken(env, studentId, studentToken);
    }

    if (!authorized) {
      const auth = await checkHomeworkPhotoStudent(env, assignmentId, studentId, pin);
      authorized = !!auth.authorized;
    }

    if (!authorized) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return responseJson({ success: false, error: 'Unauthorized' }, 401);
    }

    const submission = await env.DB.prepare(`
      SELECT id
      FROM homework_photo_submissions
      WHERE assignment_id = ? AND student_id = ?
    `).bind(assignmentId, studentId).first();

    if (!submission) {
      return responseJson({ success: false, error: 'Submission not found' }, 404);
    }

    await env.DB.prepare(`
      UPDATE homework_photo_submissions
      SET is_submitted = 0,
          submitted_at = NULL,
          synced_homework_date = ?,
          synced_homework_status = '미완료',
          updated_at = DATETIME('now')
      WHERE id = ?
    `).bind(assignment.due_date, submission.id).run();

    await syncHomeworkPhotoStatus(env, studentId, assignment.due_date, '미완료');

    return responseJson({ success: true, is_submitted: 0, status: '미제출' });
  }

  if (method === 'PATCH' && path[3] === 'close') {
    const currentTeacher = teacher || await verifyAuth(request, env);
    if (!currentTeacher) return responseJson({ error: 'Unauthorized' }, 401);
    const assignmentId = String(id || '').trim();
    const assignment = await getHomeworkPhotoAssignment(env, assignmentId);
    if (!assignment) return responseJson({ success: false, error: 'Not found' }, 404);
    if (!(await canAccessClass(currentTeacher, assignment.class_id, env))) return responseJson({ error: 'Forbidden' }, 403);

    const pending = await env.DB.prepare(`
      SELECT id, student_id
      FROM homework_photo_submissions
      WHERE assignment_id = ? AND is_submitted = 0
    `).bind(assignmentId).all();
    const stmts = [
      env.DB.prepare("UPDATE homework_photo_assignments SET status = 'closed', updated_at = DATETIME('now') WHERE id = ?").bind(assignmentId)
    ];
    for (const s of (pending.results || [])) {
      stmts.push(env.DB.prepare(`
        UPDATE homework_photo_submissions
        SET synced_homework_date = ?,
            synced_homework_status = '미완료',
            updated_at = DATETIME('now')
        WHERE id = ?
      `).bind(assignment.due_date, s.id));
      stmts.push(...buildHomeworkPhotoStatusStatements(env, s.student_id, assignment.due_date, '미완료'));
    }
    await env.DB.batch(stmts);
    return responseJson({ success: true, closed_count: (pending.results || []).length });
  }

  return null;
}
