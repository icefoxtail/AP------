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

    const assignments = await env.DB.prepare(`
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
    `).bind(studentId).all();

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
        status: 'coming_soon'
      }
    });
  }

  return null;
}
