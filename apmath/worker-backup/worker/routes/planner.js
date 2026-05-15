export async function handlePlanner(request, env, ctx = {}) {
  const {
    headers,
    path = [],
    url,
    method = request.method,
    helpers = {}
  } = ctx;
  const {
    sha256hex,
    verifyAuth,
    canAccessStudent,
    canAccessClass,
    todayKstDateString
  } = helpers;

  const resource = path[1];
  const id = path[2];

  if (
    resource !== 'planner' &&
    resource !== 'planner-auth' &&
    resource !== 'planner-auth-by-name'
  ) {
    return null;
  }

  const respond = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  if (resource === 'planner-auth-by-name' && method === 'POST') {
    const d = await request.json();
    const name = String(d.name || '').trim();
    const pin = String(d.pin || '').trim();

    if (!name || !pin) {
      return respond({
        success: false,
        message: '이름 또는 PIN을 확인하세요.'
      }, 400);
    }

    const found = await env.DB.prepare(`
      SELECT id, name, school_name, grade, status
      FROM students
      WHERE TRIM(name) = ?
        AND student_pin = ?
        AND status = '재원'
    `).bind(name, pin).all();

    const rows = found.results || [];
    if (!rows.length) {
      await sleep(800);
      return respond({
        success: false,
        message: '이름 또는 PIN을 확인하세요.'
      }, 401);
    }

    if (rows.length > 1) {
      return respond({
        success: false,
        message: '동명이인 정보가 있습니다. 선생님께 문의하세요.'
      }, 409);
    }

    const student = rows[0];
    return respond({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        school_name: student.school_name,
        grade: student.grade
      }
    });
  }

  if (resource === 'planner-auth' && method === 'GET') {
    const studentId = String(url.searchParams.get('student_id') || '').trim();
    const pin = String(url.searchParams.get('pin') || '').trim();

    if (!studentId) {
      return respond({ success: false, error: 'student_id required' }, 400);
    }

    const student = await env.DB.prepare(`
      SELECT id, name, school_name, grade, student_pin, status
      FROM students
      WHERE id = ?
    `).bind(studentId).first();

    if (!student) {
      return respond({ success: false, error: 'Student not found' }, 404);
    }

    if (student.status !== '재원') {
      return respond({ success: false, error: 'Not active student' }, 403);
    }

    if (student.student_pin && String(student.student_pin) !== pin) {
      await sleep(1000);
      return respond({ success: false, error: 'PIN mismatch' }, 401);
    }

    return respond({
      success: true,
      student: {
        id: student.id,
        name: student.name,
        school_name: student.school_name,
        grade: student.grade
      }
    });
  }

  if (resource !== 'planner') return null;

  const checkPlannerAccess = async (req, studentId, pin, expectedStudentId = null) => {
    const sid = String(studentId || '').trim();
    const expected = expectedStudentId === null || expectedStudentId === undefined ? '' : String(expectedStudentId || '').trim();

    if (!sid) return { authorized: false, status: 400, error: 'student_id required' };
    if (expected && sid !== expected) return { authorized: false, status: 403, error: 'student mismatch' };

    const teacher = await verifyAuth(req, env);
    if (teacher) {
      if (await canAccessStudent(teacher, sid, env)) return { authorized: true, teacher };
      return { authorized: false, status: 403, error: 'Forbidden' };
    }

    const student = await env.DB.prepare(`
      SELECT student_pin, status
      FROM students
      WHERE id = ?
    `).bind(sid).first();

    if (!student) return { authorized: false, status: 404, error: 'Student not found' };
    if (student.status !== '재원') return { authorized: false, status: 403, error: 'Not active student' };

    const studentToken = String(req.headers.get('X-Student-Token') || '').trim();
    if (studentToken) {
      const expectedToken = await sha256hex(`${sid}:${student.student_pin || ''}:student-portal:v1`);
      if (studentToken === expectedToken) return { authorized: true, student: true, portal: true };
      await sleep(800);
      return { authorized: false, status: 401, error: 'Student token mismatch' };
    }

    if (student.student_pin && String(student.student_pin) !== String(pin || '').trim()) {
      await sleep(1000);
      return { authorized: false, status: 401, error: 'PIN mismatch' };
    }

    return { authorized: true, student: true };
  };

  const formatPlannerDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const parsePlannerDate = (value) => {
    const str = String(value || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
    const [y, m, d] = str.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (!Number.isFinite(date.getTime())) return null;
    if (formatPlannerDate(date) !== str) return null;
    return date;
  };

  if (method === 'POST' && id === 'feedback') {
    const teacher = await verifyAuth(request, env);
    if (!teacher) {
      return respond({ error: 'Unauthorized' }, 401);
    }

    const d = await request.json();
    const studentId = String(d.student_id || '').trim();
    const feedbackDate = String(d.feedback_date || '').trim();

    if (!studentId || !feedbackDate) {
      return respond({ success: false, error: 'student_id, feedback_date required' }, 400);
    }

    if (!(await canAccessStudent(teacher, studentId, env))) {
      return respond({ error: 'Forbidden' }, 403);
    }

    const completionRate = Math.max(0, Math.min(100, Math.round(Number(d.completion_rate || 0) || 0)));
    const existing = await env.DB.prepare(`
      SELECT id
      FROM planner_feedback
      WHERE student_id = ? AND feedback_date = ?
    `).bind(studentId, feedbackDate).first();

    if (existing) {
      await env.DB.prepare(`
        UPDATE planner_feedback
        SET teacher_comment = ?,
            badge = ?,
            completion_rate = ?,
            updated_at = DATETIME('now')
        WHERE id = ?
      `).bind(
        String(d.teacher_comment || '').trim(),
        String(d.badge || '').trim(),
        completionRate,
        existing.id
      ).run();
    } else {
      await env.DB.prepare(`
        INSERT INTO planner_feedback (
          id, student_id, feedback_date, teacher_comment, badge, completion_rate, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
      `).bind(
        `pfb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        studentId,
        feedbackDate,
        String(d.teacher_comment || '').trim(),
        String(d.badge || '').trim(),
        completionRate
      ).run();
    }

    return respond({ success: true });
  }

  if (method === 'GET' && id === 'overview') {
    const teacher = await verifyAuth(request, env);
    if (!teacher) {
      return respond({ error: 'Unauthorized' }, 401);
    }

    const classId = String(url.searchParams.get('class_id') || '').trim();
    const date = String(url.searchParams.get('date') || '').trim();

    if (!classId || !date) {
      return respond({ success: false, error: 'class_id, date required' }, 400);
    }

    if (!(await canAccessClass(teacher, classId, env))) {
      return respond({ error: 'Forbidden' }, 403);
    }

    const stds = await env.DB.prepare(`
      SELECT id, name
      FROM students
      WHERE status = '재원'
        AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)
      ORDER BY name ASC
    `).bind(classId).all();

    const studentList = stds.results || [];
    if (!studentList.length) {
      return respond({ success: true, students: [] });
    }

    const studentIds = studentList.map(s => s.id);
    const markers = studentIds.map(() => '?').join(',');

    const [plans, feedbacks] = await Promise.all([
      env.DB.prepare(`
        SELECT student_id, is_done
        FROM student_plans
        WHERE plan_date = ? AND student_id IN (${markers})
      `).bind(date, ...studentIds).all(),
      env.DB.prepare(`
        SELECT *
        FROM planner_feedback
        WHERE feedback_date = ? AND student_id IN (${markers})
      `).bind(date, ...studentIds).all()
    ]);

    const feedbackMap = new Map((feedbacks.results || []).map(f => [String(f.student_id), f]));
    const planGroups = {};

    for (const p of (plans.results || [])) {
      const sid = String(p.student_id);
      if (!planGroups[sid]) planGroups[sid] = { total: 0, done: 0 };
      planGroups[sid].total += 1;
      if (Number(p.is_done || 0) === 1) planGroups[sid].done += 1;
    }

    const students = studentList.map(s => {
      const group = planGroups[String(s.id)] || { total: 0, done: 0 };
      const rate = group.total > 0 ? Math.round((group.done / group.total) * 100) : 0;
      return {
        student_id: s.id,
        name: s.name,
        total: group.total,
        done: group.done,
        rate,
        feedback: feedbackMap.get(String(s.id)) || null
      };
    });

    return respond({ success: true, students });
  }

  if (method === 'GET' && !id) {
    const studentId = String(url.searchParams.get('student_id') || '').trim();
    const from = String(url.searchParams.get('from') || '').trim();
    const to = String(url.searchParams.get('to') || '').trim();
    const pin = String(url.searchParams.get('pin') || '').trim();

    if (!studentId || !from || !to) {
      return respond({ success: false, error: 'student_id, from, to required' }, 400);
    }

    const auth = await checkPlannerAccess(request, studentId, pin);
    if (!auth.authorized) {
      return respond({ success: false, error: auth.error }, auth.status || 403);
    }

    const [plans, feedback] = await Promise.all([
      env.DB.prepare(`
        SELECT *
        FROM student_plans
        WHERE student_id = ? AND plan_date BETWEEN ? AND ?
        ORDER BY plan_date ASC, created_at ASC
      `).bind(studentId, from, to).all(),
      env.DB.prepare(`
        SELECT *
        FROM planner_feedback
        WHERE student_id = ? AND feedback_date BETWEEN ? AND ?
        ORDER BY feedback_date ASC
      `).bind(studentId, from, to).all()
    ]);

    return respond({
      success: true,
      plans: plans.results,
      feedback: feedback.results
    });
  }

  if (method === 'POST' && !id) {
    const d = await request.json();
    const studentId = String(d.student_id || '').trim();
    const planDate = String(d.plan_date || '').trim();
    const title = String(d.title || '').trim();
    const subject = String(d.subject || '').trim();
    const rule = String(d.repeat_rule || '').trim() || null;

    if (!studentId || !planDate || !title) {
      return respond({ success: false, error: 'student_id, plan_date, title required' }, 400);
    }

    const auth = await checkPlannerAccess(request, studentId, d.pin);
    if (!auth.authorized) {
      return respond({ success: false, error: auth.error }, auth.status || 403);
    }

    const startDate = parsePlannerDate(planDate);
    if (!startDate) {
      return respond({ success: false, error: 'invalid plan_date' }, 400);
    }

    let endDate = startDate;
    if (rule === 'daily' || rule === 'weekly') {
      if (d.exam_date) {
        const parsedEnd = parsePlannerDate(d.exam_date);
        if (!parsedEnd) {
          return respond({ success: false, error: 'invalid exam_date' }, 400);
        }
        const today = parsePlannerDate(todayKstDateString());
        if (today && parsedEnd < today) {
          return respond({ success: false, error: 'exam_date is in the past' }, 400);
        }
        if (parsedEnd < startDate) {
          return respond({ success: false, error: 'exam_date must be after plan_date' }, 400);
        }
        endDate = parsedEnd;
      }
    }

    const stmts = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let count = 0;

    while (current <= endDate && count < 100) {
      const currentDate = formatPlannerDate(current);
      stmts.push(env.DB.prepare(`
        INSERT INTO student_plans (
          id, student_id, plan_date, title, subject, is_done, repeat_rule, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, 0, ?, DATETIME('now'), DATETIME('now'))
      `).bind(
        `plan_${Date.now()}_${count}_${Math.random().toString(36).slice(2, 8)}`,
        studentId,
        currentDate,
        title,
        subject,
        rule
      ));

      if (rule === 'daily') current.setDate(current.getDate() + 1);
      else if (rule === 'weekly') current.setDate(current.getDate() + 7);
      else break;

      count += 1;
    }

    if (stmts.length) await env.DB.batch(stmts);
    return respond({ success: true, count: stmts.length });
  }

  if (method === 'PATCH' && id === 'settings') {
    const d = await request.json();
    const studentId = String(d.student_id || '').trim();
    const pin = String(d.pin || '').trim();
    const examDateStr = String(d.planner_exam_date || '').trim();

    if (!studentId || !examDateStr) {
      return respond({ success: false, error: 'student_id, planner_exam_date required' }, 400);
    }

    const parsedExamDate = parsePlannerDate(examDateStr);
    if (!parsedExamDate) {
      return respond({ success: false, error: 'planner_exam_date must be YYYY-MM-DD' }, 400);
    }

    const today = parsePlannerDate(todayKstDateString());
    if (today && parsedExamDate < today) {
      return respond({ success: false, error: 'planner_exam_date must be today or later' }, 400);
    }

    const auth = await checkPlannerAccess(request, studentId, pin);
    if (!auth.authorized) {
      return respond({ success: false, error: auth.error }, auth.status || 403);
    }

    await env.DB.prepare(`
      UPDATE students
      SET planner_exam_date = ?
      WHERE id = ?
    `).bind(examDateStr, studentId).run();

    return respond({ success: true });
  }

  if (method === 'PATCH' && id) {
    const d = await request.json();
    const existing = await env.DB.prepare(`
      SELECT id, student_id, updated_at
      FROM student_plans
      WHERE id = ?
    `).bind(id).first();

    if (!existing) {
      return respond({ success: false, error: 'Not found' }, 404);
    }

    const auth = await checkPlannerAccess(request, existing.student_id, d.pin, d.student_id || existing.student_id);
    if (!auth.authorized) {
      return respond({ success: false, error: auth.error }, auth.status || 403);
    }

    if (d.updated_at && existing.updated_at) {
      const existingTime = new Date(String(existing.updated_at).replace(' ', 'T')).getTime();
      const requestTime = new Date(String(d.updated_at).replace(' ', 'T')).getTime();

      if (Number.isFinite(existingTime) && Number.isFinite(requestTime) && existingTime > requestTime) {
        return respond({ success: false, error: 'Conflict: Data modified elsewhere' }, 409);
      }
    }

    await env.DB.prepare(`
      UPDATE student_plans
      SET title = COALESCE(?, title),
          subject = COALESCE(?, subject),
          plan_date = COALESCE(?, plan_date),
          is_done = COALESCE(?, is_done),
          updated_at = DATETIME('now')
      WHERE id = ?
    `).bind(
      d.title !== undefined ? String(d.title).trim() : null,
      d.subject !== undefined ? String(d.subject).trim() : null,
      d.plan_date !== undefined ? String(d.plan_date).trim() : null,
      d.is_done !== undefined ? (d.is_done ? 1 : 0) : null,
      id
    ).run();

    return respond({ success: true });
  }

  if (method === 'DELETE' && id) {
    const studentId = String(url.searchParams.get('student_id') || '').trim();
    const pin = String(url.searchParams.get('pin') || '').trim();

    const existing = await env.DB.prepare(`
      SELECT id, student_id
      FROM student_plans
      WHERE id = ?
    `).bind(id).first();

    if (!existing) {
      return respond({ success: false, error: 'Not found' }, 404);
    }

    const auth = await checkPlannerAccess(request, existing.student_id, pin, studentId || existing.student_id);
    if (!auth.authorized) {
      return respond({ success: false, error: auth.error }, auth.status || 403);
    }

    await env.DB.prepare('DELETE FROM student_plans WHERE id = ?').bind(id).run();
    return respond({ success: true });
  }

  return null;
}
