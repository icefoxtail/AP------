import { sha256hex } from '../helpers/admin-db.js';
import { jsonResponse } from '../helpers/response.js';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function pickStudentPortalToken(url, request) {
  return String(
    url.searchParams.get('token') ||
    request.headers.get('X-Student-Token') ||
    ''
  ).trim();
}

async function buildStudentPortalToken(studentId, studentPin) {
  return sha256hex(`${studentId}:${studentPin || ''}:student-portal:v1`);
}

async function verifyStudentPortalSession(env, studentId, studentToken) {
  if (!studentId || !studentToken) {
    return { error: jsonResponse({ success: false, message: '학생 로그인이 필요합니다.' }, 401) };
  }

  const student = await env.DB.prepare(`
    SELECT id, name, grade, school_name, student_pin, status
    FROM students
    WHERE id = ?
  `).bind(studentId).first();

  if (!student || !['?ъ썝', '재원', 'active'].includes(String(student.status || ''))) {
    return { error: jsonResponse({ success: false, message: '학생 정보를 확인할 수 없습니다.' }, 404) };
  }

  const expectedToken = await buildStudentPortalToken(student.id, student.student_pin);
  if (studentToken !== expectedToken) {
    await sleep(800);
    return { error: jsonResponse({ success: false, message: '학생 로그인이 만료되었습니다.' }, 401) };
  }

  return { student };
}

function normalizeWrongIds(values, questionCount) {
  const source = Array.isArray(values)
    ? values
    : (typeof values === 'string' ? values.split(/[\s,]+/) : []);
  return Array.from(new Set(source
    .map(v => String(v).trim())
    .filter(v => /^\d+$/.test(v))
    .map(v => parseInt(v, 10))
    .filter(v => v >= 1 && v <= questionCount)))
    .sort((a, b) => a - b);
}

function buildOmrSessionKey(row = {}) {
  return [
    String(row.exam_title || '').trim(),
    String(row.exam_date || '').trim(),
    String(Number(row.question_count || 0) || ''),
    String(row.archive_file || '').trim()
  ].join('|');
}

function buildAssignmentDedupeKey(row = {}) {
  const classId = String(row.class_id || '').trim();
  const examDate = String(row.exam_date || '').trim();
  const archiveFile = String(row.archive_file || '').trim();
  if (archiveFile) return [classId, examDate, archiveFile].join('|');
  return [
    classId,
    examDate,
    String(row.exam_title || '').trim().replace(/\s+/g, ' '),
    String(Number(row.question_count || 0) || '')
  ].join('|');
}

function dedupeClassExamAssignments(rows = [], sessionByAssignment = new Map()) {
  const byExam = new Map();
  rows.forEach(row => {
    const key = buildAssignmentDedupeKey(row);
    if (!key || !key.replace(/\|/g, '')) return;
    if (!byExam.has(key)) {
      byExam.set(key, row);
      return;
    }
    const current = byExam.get(key);
    const rowHasSession = sessionByAssignment.has(String(row.id || ''));
    const currentHasSession = sessionByAssignment.has(String(current?.id || ''));
    if (rowHasSession && !currentHasSession) byExam.set(key, row);
  });
  return Array.from(byExam.values());
}

async function loadStudentClassExamAssignments(env, studentId, limit = 100) {
  const safeLimit = Math.max(1, Math.min(200, parseInt(limit, 10) || 100));
  const [assignments, sessions] = await Promise.all([
    env.DB.prepare(`
      SELECT
        cea.*,
        c.name AS class_name
      FROM class_exam_assignments cea
      JOIN class_students cs ON cs.class_id = cea.class_id
      LEFT JOIN classes c ON c.id = cea.class_id
      WHERE cs.student_id = ?
      ORDER BY cea.exam_date DESC, cea.updated_at DESC, cea.created_at DESC
      LIMIT ?
    `).bind(studentId, safeLimit).all(),
    env.DB.prepare(`
      SELECT *
      FROM exam_sessions
      WHERE student_id = ?
      ORDER BY exam_date DESC, updated_at DESC
      LIMIT 300
    `).bind(studentId).all()
  ]);

  const sessionByAssignment = new Map();
  const sessionByExam = new Map();
  (sessions.results || []).forEach(row => {
    if (row.assignment_id) sessionByAssignment.set(String(row.assignment_id), row);
    const key = buildOmrSessionKey(row);
    if (!sessionByExam.has(key)) sessionByExam.set(key, row);
  });

  return dedupeClassExamAssignments(assignments.results || [], sessionByAssignment).map(row => {
    const session = sessionByAssignment.get(String(row.id || '')) || sessionByExam.get(buildOmrSessionKey(row)) || null;
    return {
      assignment_id: row.id,
      class_id: row.class_id,
      class_name: row.class_name || '',
      exam_title: row.exam_title || '',
      exam_date: row.exam_date || '',
      question_count: Number(row.question_count || 0),
      archive_file: row.archive_file || '',
      source_type: row.source_type || '',
      pack_id: row.pack_id || null,
      grade_label: row.grade_label || null,
      created_at: row.created_at || '',
      updated_at: row.updated_at || '',
      is_submitted: session ? 1 : 0,
      session_id: session?.id || null,
      score: session?.score ?? null,
      submitted_at: session?.updated_at || session?.created_at || null,
      wrong_ids: normalizeWrongIds(session?.wrong_ids || [], Number(row.question_count || session?.question_count || 0))
    };
  });
}

export async function handleStudentPortal(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource !== 'student-portal') return null;

  if (method === 'POST' && id === 'auth') {
    const d = await request.json();
    const name = String(d.name || '').trim();
    const pin = String(d.pin || '').trim();

    if (!name || !pin) {
      return jsonResponse({
        success: false,
        message: '이름 또는 PIN을 확인하세요.'
      }, 400);
    }

    const found = await env.DB.prepare(`
      SELECT id, name, grade, school_name, student_pin, status
      FROM students
      WHERE TRIM(name) = ?
        AND student_pin = ?
        AND status = '재원'
    `).bind(name, pin).all();

    const rows = found.results || [];
    if (!rows.length) {
      await sleep(800);
      return jsonResponse({
        success: false,
        message: '이름 또는 PIN을 확인하세요.'
      }, 401);
    }

    if (rows.length > 1) {
      return jsonResponse({
        success: false,
        message: '동명이인 정보가 있습니다. 선생님께 문의하세요.'
      }, 409);
    }

    const student = rows[0];
    const studentToken = await buildStudentPortalToken(student.id, student.student_pin);

    return jsonResponse({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        grade: student.grade,
        school_name: student.school_name
      },
      student_token: studentToken
    });
  }

  if (method === 'GET' && id === 'home') {
    const studentId = String(url.searchParams.get('student_id') || '').trim();
    const studentToken = pickStudentPortalToken(url, request);

    if (!studentId || !studentToken) {
      return jsonResponse({
        success: false,
        message: '학생 로그인이 필요합니다.'
      }, 401);
    }

    const student = await env.DB.prepare(`
      SELECT id, name, grade, school_name, student_pin, status
      FROM students
      WHERE id = ?
    `).bind(studentId).first();

    if (!student || student.status !== '재원') {
      return jsonResponse({
        success: false,
        message: '학생 정보를 확인할 수 없습니다.'
      }, 404);
    }

    const expectedToken = await buildStudentPortalToken(student.id, student.student_pin);
    if (studentToken !== expectedToken) {
      await sleep(800);
      return jsonResponse({
        success: false,
        message: '학생 로그인이 만료되었습니다.'
      }, 401);
    }

    const [assignments, classExamAssignments] = await Promise.all([
      env.DB.prepare(`
      SELECT
        hpa.id AS assignment_id,
        hpa.title,
        hpa.description,
        hpa.class_id,
        c.name AS class_name,
        hpa.due_date,
        hpa.due_time,
        COALESCE(hpa.status, 'active') AS status,
        COALESCE(hps.is_submitted, 0) AS is_submitted,
        hps.submitted_at
      FROM homework_photo_submissions hps
      JOIN homework_photo_assignments hpa ON hpa.id = hps.assignment_id
      LEFT JOIN classes c ON c.id = hpa.class_id
      WHERE hps.student_id = ?
        AND COALESCE(hpa.status, 'active') != 'deleted'
      ORDER BY
        CASE WHEN COALESCE(hps.is_submitted, 0) = 1 THEN 1 ELSE 0 END ASC,
        hpa.due_date ASC,
        hpa.created_at DESC
      LIMIT 30
      `).bind(studentId).all(),
      loadStudentClassExamAssignments(env, studentId, 100)
    ]);

    return jsonResponse({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        grade: student.grade,
        school_name: student.school_name
      },
      assignments: (assignments.results || []).map(row => ({
        assignment_id: row.assignment_id,
        title: row.title,
        description: row.description || '',
        class_id: row.class_id,
        class_name: row.class_name,
        due_date: row.due_date,
        due_time: row.due_time,
        status: row.status,
        is_submitted: Number(row.is_submitted || 0),
        submitted_at: row.submitted_at || null
      })),
      planner: {
        enabled: true,
        url: `/apmath/planner/?student_id=${encodeURIComponent(student.id)}`
      },
      omr: {
        enabled: true,
        status: 'ready'
      },
      class_exam_assignments: classExamAssignments
    });
  }

  if (method === 'GET' && id === 'exams') {
    const studentId = String(url.searchParams.get('student_id') || '').trim();
    const studentToken = pickStudentPortalToken(url, request);
    const verified = await verifyStudentPortalSession(env, studentId, studentToken);
    if (verified.error) return verified.error;

    const exams = await loadStudentClassExamAssignments(env, verified.student.id, 150);
    return jsonResponse({ success: true, exams });
  }

  if (method === 'POST' && id === 'omr-submit') {
    const d = await request.json();
    const studentId = String(d.student_id || '').trim();
    const studentToken = String(d.student_token || '').trim();
    const verified = await verifyStudentPortalSession(env, studentId, studentToken);
    if (verified.error) return verified.error;

    const assignmentId = String(d.assignment_id || '').trim();
    if (!assignmentId) {
      return jsonResponse({ success: false, message: 'assignment_id required' }, 400);
    }

    const assignment = await env.DB.prepare(`
      SELECT cea.*, c.name AS class_name
      FROM class_exam_assignments cea
      JOIN class_students cs ON cs.class_id = cea.class_id AND cs.student_id = ?
      LEFT JOIN classes c ON c.id = cea.class_id
      WHERE cea.id = ?
      LIMIT 1
    `).bind(verified.student.id, assignmentId).first();

    if (!assignment) {
      return jsonResponse({ success: false, message: '시험지를 찾을 수 없습니다.' }, 404);
    }

    const questionCount = Math.max(1, Math.min(80, parseInt(assignment.question_count, 10) || 0));
    const wrongIds = normalizeWrongIds(d.wrong_ids, questionCount);
    const score = Math.round(((questionCount - wrongIds.length) / questionCount) * 100);

    const existing = await env.DB.prepare(`
      SELECT *
      FROM exam_sessions
      WHERE student_id = ?
        AND exam_title = ?
        AND exam_date = ?
        AND COALESCE(archive_file, '') = COALESCE(?, '')
      ORDER BY updated_at DESC
      LIMIT 1
    `).bind(verified.student.id, assignment.exam_title || '', assignment.exam_date || '', assignment.archive_file || '').first();

    const sessionId = existing?.id || `ex_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await env.DB.batch([
      env.DB.prepare(`
        INSERT INTO exam_sessions (
          id, student_id, exam_title, score, exam_date, question_count,
          class_id, archive_file, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
        ON CONFLICT(id) DO UPDATE SET
          score = excluded.score,
          question_count = excluded.question_count,
          class_id = excluded.class_id,
          archive_file = excluded.archive_file,
          updated_at = DATETIME('now')
      `).bind(
        sessionId,
        verified.student.id,
        assignment.exam_title || '',
        score,
        assignment.exam_date || '',
        questionCount,
        assignment.class_id || '',
        assignment.archive_file || ''
      ),
      env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sessionId),
      ...wrongIds.map(qId => env.DB.prepare(
        'INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)'
      ).bind(sessionId, String(qId), verified.student.id))
    ]);

    return jsonResponse({
      success: true,
      session: {
        id: sessionId,
        student_id: verified.student.id,
        assignment_id: assignmentId,
        exam_title: assignment.exam_title || '',
        exam_date: assignment.exam_date || '',
        question_count: questionCount,
        score,
        wrong_ids: wrongIds
      }
    });
  }

  return null;
}
