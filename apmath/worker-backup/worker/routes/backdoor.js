import { isAdminUser } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

function clampNumber(value, fallback, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(Math.floor(n), max));
}

function parseLimit(url, fallback = 50, max = 50) {
  return clampNumber(url.searchParams.get('limit'), fallback, 1, max);
}

function parseOffset(url) {
  return clampNumber(url.searchParams.get('offset'), 0, 0, 100000);
}

function normalizeBranch(value, fallback = 'apmath') {
  const raw = String(value || '').trim().toLowerCase();
  if (['all', 'apmath', 'cmath', 'eie'].includes(raw)) return raw;
  if (raw === 'ap' || raw === 'ap_math' || raw === 'ap-math') return 'apmath';
  if (raw === 'cms' || raw === 'cma' || raw === 'cmath-elementary') return 'cmath';
  return fallback;
}

function addBranchFilter(where, params, column, branch) {
  if (!branch || branch === 'all') return;
  where.push(`COALESCE(${column}, 'apmath') = ?`);
  params.push(branch);
}

function todaySeoul() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function addLikeFilter(where, params, columns, keyword) {
  const q = String(keyword || '').trim();
  if (!q) return;
  where.push(`(${columns.map(column => `${column} LIKE ?`).join(' OR ')})`);
  params.push(...columns.map(() => `%${q}%`));
}

async function all(env, sql, params = []) {
  const res = params.length
    ? await env.DB.prepare(sql).bind(...params).all()
    : await env.DB.prepare(sql).all();
  return res.results || [];
}

async function first(env, sql, params = []) {
  return params.length
    ? await env.DB.prepare(sql).bind(...params).first()
    : await env.DB.prepare(sql).first();
}

async function handleOverview(env, url) {
  const today = url.searchParams.get('date') || todaySeoul();
  const limit = parseLimit(url, 20, 50);
  const upcomingTo = url.searchParams.get('to') || '';

  const [
    studentTotal,
    studentStatus,
    classTotal,
    activeClassTotal,
    teacherTotal,
    todayAttendance,
    todayHomework,
    openMemos,
    upcomingSchedules,
    recentStudents
  ] = await Promise.all([
    first(env, 'SELECT COUNT(*) AS count FROM students'),
    all(env, `
      SELECT COALESCE(NULLIF(TRIM(status), ''), 'unknown') AS status, COUNT(*) AS count
      FROM students
      GROUP BY COALESCE(NULLIF(TRIM(status), ''), 'unknown')
      ORDER BY count DESC
    `),
    first(env, 'SELECT COUNT(*) AS count FROM classes'),
    first(env, 'SELECT COUNT(*) AS count FROM classes WHERE is_active != 0 OR is_active IS NULL'),
    first(env, 'SELECT COUNT(*) AS count FROM teachers'),
    all(env, `
      SELECT status, COUNT(*) AS count
      FROM attendance
      WHERE date = ?
      GROUP BY status
      ORDER BY status ASC
    `, [today]),
    all(env, `
      SELECT status, COUNT(*) AS count
      FROM homework
      WHERE date = ?
      GROUP BY status
      ORDER BY status ASC
    `, [today]),
    first(env, 'SELECT COUNT(*) AS count FROM operation_memos WHERE COALESCE(is_done, 0) = 0'),
    all(env, `
      SELECT id, schedule_type, title, schedule_date, start_time, end_time, target_scope, student_id, teacher_name, is_closed
      FROM academy_schedules
      WHERE is_deleted = 0
        AND schedule_date >= ?
        ${upcomingTo ? 'AND schedule_date <= ?' : ''}
      ORDER BY schedule_date ASC, start_time ASC
      LIMIT ?
    `, upcomingTo ? [today, upcomingTo, limit] : [today, limit]),
    all(env, `
      SELECT id, name, school_name, grade, status
      FROM students
      ORDER BY id DESC
      LIMIT ?
    `, [limit])
  ]);

  return jsonResponse({
    success: true,
    date: today,
    counts: {
      students: studentTotal?.count || 0,
      classes: classTotal?.count || 0,
      active_classes: activeClassTotal?.count || 0,
      teachers: teacherTotal?.count || 0,
      open_operation_memos: openMemos?.count || 0
    },
    student_status: studentStatus,
    today_attendance: todayAttendance,
    today_homework: todayHomework,
    upcoming_schedules: upcomingSchedules,
    recent_students: recentStudents
  });
}

async function handleStudents(env, url) {
  const limit = parseLimit(url, 50, 50);
  const offset = parseOffset(url);
  const where = [];
  const params = [];

  const status = String(url.searchParams.get('status') || '').trim();
  if (status) {
    where.push('s.status = ?');
    params.push(status);
  }

  const classId = String(url.searchParams.get('class_id') || '').trim();
  if (classId) {
    where.push('cs.class_id = ?');
    params.push(classId);
  }

  addLikeFilter(where, params, ['s.name', 's.school_name', 's.grade'], url.searchParams.get('q'));

  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const total = await first(env, `
    SELECT COUNT(DISTINCT s.id) AS count
    FROM students s
    LEFT JOIN class_students cs ON cs.student_id = s.id
    ${whereSql}
  `, params);
  const rows = await all(env, `
    SELECT
      s.id, s.name, s.school_name, s.grade, s.status, s.target_score,
      cs.class_id, c.name AS class_name, c.teacher_name
    FROM students s
    LEFT JOIN class_students cs ON cs.student_id = s.id
    LEFT JOIN classes c ON c.id = cs.class_id
    ${whereSql}
    ORDER BY s.grade ASC, s.name ASC, s.id ASC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

  return jsonResponse({ success: true, total: total?.count || 0, limit, offset, students: rows });
}

async function handleClasses(env, url) {
  const limit = parseLimit(url, 50, 50);
  const offset = parseOffset(url);
  const activeOnly = url.searchParams.get('active') !== '0';
  const where = activeOnly ? 'WHERE c.is_active != 0 OR c.is_active IS NULL' : '';
  const [total, rows] = await Promise.all([
    first(env, `SELECT COUNT(*) AS count FROM classes c ${where}`),
    all(env, `
      SELECT
        c.id, c.name, c.grade, c.subject, c.teacher_name, c.schedule_days, c.time_label, c.is_active,
        COUNT(cs.student_id) AS student_count
      FROM classes c
      LEFT JOIN class_students cs ON cs.class_id = c.id
      ${where}
      GROUP BY c.id
      ORDER BY c.grade ASC, c.name ASC
      LIMIT ? OFFSET ?
    `, [limit, offset])
  ]);
  return jsonResponse({ success: true, total: total?.count || 0, limit, offset, classes: rows });
}

async function handleToday(env, url) {
  const date = url.searchParams.get('date') || todaySeoul();
  const limit = parseLimit(url, 50, 50);
  const [attendance, homework, schedules] = await Promise.all([
    all(env, `
      SELECT a.id, a.student_id, a.status, a.date, s.name AS student_name, s.grade
      FROM attendance a
      LEFT JOIN students s ON s.id = a.student_id
      WHERE a.date = ?
      ORDER BY s.grade ASC, s.name ASC
      LIMIT ?
    `, [date, limit]),
    all(env, `
      SELECT h.id, h.student_id, h.status, h.date, s.name AS student_name, s.grade
      FROM homework h
      LEFT JOIN students s ON s.id = h.student_id
      WHERE h.date = ?
      ORDER BY s.grade ASC, s.name ASC
      LIMIT ?
    `, [date, limit]),
    all(env, `
      SELECT id, schedule_type, title, schedule_date, start_time, end_time, target_scope, student_id, teacher_name, is_closed
      FROM academy_schedules
      WHERE is_deleted = 0 AND schedule_date = ?
      ORDER BY start_time ASC, title ASC
      LIMIT ?
    `, [date, limit])
  ]);
  return jsonResponse({ success: true, date, attendance, homework, schedules });
}

async function handleTimetable(env, url) {
  const branch = normalizeBranch(url.searchParams.get('branch'), 'apmath');
  const day = String(url.searchParams.get('day') || '').trim();
  const limit = parseLimit(url, 50, 50);
  const where = ['(c.is_active != 0 OR c.is_active IS NULL)'];
  const params = [];
  if (day) {
    where.push('cts.day_of_week = ?');
    params.push(day);
  }

  const slots = await all(env, `
    SELECT
      cts.id, cts.class_id, cts.day_of_week, cts.start_time, cts.end_time, cts.room_name,
      c.id AS class_id, c.name AS class_name, c.grade, c.subject, c.teacher_name,
      COUNT(DISTINCT se.student_id) AS active_student_count
    FROM class_time_slots cts
    JOIN classes c ON c.id = cts.class_id
    LEFT JOIN student_enrollments se
      ON se.class_id = c.id
      AND se.status = 'active'
      AND (? = 'all' OR COALESCE(se.branch, 'apmath') = ?)
    WHERE ${where.join(' AND ')}
    GROUP BY cts.id
    ORDER BY cts.day_of_week ASC, cts.start_time ASC, c.name ASC
    LIMIT ?
  `, [branch, branch, ...params, limit]);

  const [slotCount, classCount, enrollmentCount] = await Promise.all([
    first(env, `
      SELECT COUNT(*) AS count
      FROM class_time_slots cts
      JOIN classes c ON c.id = cts.class_id
      WHERE ${where.join(' AND ')}
    `, params),
    first(env, "SELECT COUNT(*) AS count FROM classes WHERE is_active != 0 OR is_active IS NULL"),
    first(env, `
      SELECT COUNT(*) AS count
      FROM student_enrollments
      WHERE status = 'active' AND (? = 'all' OR COALESCE(branch, 'apmath') = ?)
    `, [branch, branch])
  ]);

  return jsonResponse({
    success: true,
    branch,
    day: day || null,
    counts: {
      slots: slotCount?.count || 0,
      active_classes: classCount?.count || 0,
      active_enrollments: enrollmentCount?.count || 0
    },
    limit,
    slots
  });
}

async function handleBillingSummary(env, url) {
  const branch = normalizeBranch(url.searchParams.get('branch'), 'apmath');
  const today = todaySeoul();
  const [yearText, monthText] = today.split('-');
  const year = clampNumber(url.searchParams.get('year'), Number(yearText), 2000, 2100);
  const month = clampNumber(url.searchParams.get('month'), Number(monthText), 1, 12);
  const limit = parseLimit(url, 20, 50);

  const itemWhere = ['p.year = ?', 'p.month = ?'];
  const itemParams = [year, month];
  addBranchFilter(itemWhere, itemParams, 'pi.branch', branch);

  const txWhere = ['SUBSTR(pt.transaction_date, 1, 7) = ?'];
  const txParams = [`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`];
  addBranchFilter(txWhere, txParams, 'pt.branch', branch);

  const refundWhere = ['SUBSTR(rr.refund_date, 1, 7) = ?'];
  const refundParams = [`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`];
  addBranchFilter(refundWhere, refundParams, 'rr.branch', branch);

  const cashbookWhere = ['SUBSTR(ce.entry_date, 1, 7) = ?'];
  const cashbookParams = [`${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`];
  addBranchFilter(cashbookWhere, cashbookParams, 'ce.branch', branch);

  const [
    billed,
    paymentStatus,
    paidByMethod,
    refunded,
    cashbookByType,
    recentTransactions,
    recentRefunds
  ] = await Promise.all([
    first(env, `
      SELECT COUNT(DISTINCT p.id) AS payment_count, COALESCE(SUM(pi.amount), 0) AS total_billed
      FROM payment_items pi
      JOIN payments p ON p.id = pi.payment_id
      WHERE ${itemWhere.join(' AND ')}
    `, itemParams),
    all(env, `
      SELECT COALESCE(NULLIF(TRIM(p.status), ''), 'unknown') AS status, COUNT(DISTINCT p.id) AS count
      FROM payments p
      WHERE p.year = ? AND p.month = ?
        AND EXISTS (
          SELECT 1
          FROM payment_items pi
          WHERE pi.payment_id = p.id
            AND (? = 'all' OR COALESCE(pi.branch, 'apmath') = ?)
        )
      GROUP BY COALESCE(NULLIF(TRIM(p.status), ''), 'unknown')
      ORDER BY status ASC
    `, [year, month, branch, branch]),
    all(env, `
      SELECT pt.method_key, COUNT(*) AS count, COALESCE(SUM(pt.amount), 0) AS total_paid
      FROM payment_transactions pt
      WHERE ${txWhere.join(' AND ')}
        AND pt.status = 'completed'
      GROUP BY pt.method_key
      ORDER BY total_paid DESC
    `, txParams),
    first(env, `
      SELECT COUNT(*) AS count, COALESCE(SUM(rr.refund_amount), 0) AS total_refunded
      FROM refund_records rr
      WHERE ${refundWhere.join(' AND ')}
        AND rr.status = 'completed'
    `, refundParams),
    all(env, `
      SELECT ce.entry_type, COUNT(*) AS count, COALESCE(SUM(ce.amount), 0) AS amount
      FROM cashbook_entries ce
      WHERE ${cashbookWhere.join(' AND ')}
        AND COALESCE(ce.is_active, 1) = 1
        AND COALESCE(ce.status, 'active') != 'cancelled'
      GROUP BY ce.entry_type
      ORDER BY ce.entry_type ASC
    `, cashbookParams),
    all(env, `
      SELECT pt.id, pt.student_id, s.name AS student_name, pt.branch, pt.transaction_type, pt.method_key, pt.amount, pt.transaction_date, pt.status
      FROM payment_transactions pt
      LEFT JOIN students s ON s.id = pt.student_id
      WHERE ${txWhere.join(' AND ')}
      ORDER BY pt.transaction_date DESC, pt.id DESC
      LIMIT ?
    `, [...txParams, limit]),
    all(env, `
      SELECT rr.id, rr.student_id, s.name AS student_name, rr.branch, rr.refund_amount, rr.refund_method_key, rr.refund_date, rr.status
      FROM refund_records rr
      LEFT JOIN students s ON s.id = rr.student_id
      WHERE ${refundWhere.join(' AND ')}
      ORDER BY rr.refund_date DESC, rr.id DESC
      LIMIT ?
    `, [...refundParams, limit])
  ]);

  const totalPaid = paidByMethod.reduce((sum, row) => sum + Number(row.total_paid || 0), 0);
  const totalBilled = Number(billed?.total_billed || 0);
  const totalRefunded = Number(refunded?.total_refunded || 0);

  return jsonResponse({
    success: true,
    branch,
    year,
    month,
    totals: {
      payment_count: billed?.payment_count || 0,
      total_billed: totalBilled,
      total_paid: totalPaid,
      total_refunded: totalRefunded,
      estimated_outstanding: Math.max(0, totalBilled - totalPaid + totalRefunded)
    },
    payment_status: paymentStatus,
    paid_by_method: paidByMethod,
    cashbook_by_type: cashbookByType,
    recent_transactions: recentTransactions,
    recent_refunds: recentRefunds
  });
}

async function handleSearch(env, url) {
  const q = String(url.searchParams.get('q') || '').trim();
  const branch = normalizeBranch(url.searchParams.get('branch'), 'apmath');
  const limit = parseLimit(url, 20, 50);
  if (!q) {
    return jsonResponse({
      success: true,
      query: '',
      branch,
      students: [],
      classes: [],
      teachers: []
    });
  }

  const like = `%${q}%`;
  const [students, classes, teachers] = await Promise.all([
    all(env, `
      SELECT DISTINCT
        s.id, s.name, s.school_name, s.grade, s.status,
        c.id AS class_id, c.name AS class_name, c.teacher_name
      FROM students s
      LEFT JOIN class_students cs ON cs.student_id = s.id
      LEFT JOIN classes c ON c.id = cs.class_id
      LEFT JOIN student_enrollments se
        ON se.student_id = s.id
        AND se.status = 'active'
        AND (? = 'all' OR COALESCE(se.branch, 'apmath') = ?)
      WHERE (
        s.name LIKE ?
        OR s.school_name LIKE ?
        OR s.grade LIKE ?
      )
        AND (? = 'all' OR se.id IS NOT NULL)
      ORDER BY s.grade ASC, s.name ASC
      LIMIT ?
    `, [branch, branch, like, like, like, branch, limit]),
    all(env, `
      SELECT
        c.id, c.name, c.grade, c.subject, c.teacher_name, c.schedule_days, c.time_label,
        COUNT(DISTINCT se.student_id) AS active_student_count
      FROM classes c
      LEFT JOIN student_enrollments se
        ON se.class_id = c.id
        AND se.status = 'active'
        AND (? = 'all' OR COALESCE(se.branch, 'apmath') = ?)
      WHERE (c.is_active != 0 OR c.is_active IS NULL)
        AND (
          c.name LIKE ?
          OR c.grade LIKE ?
          OR c.subject LIKE ?
          OR c.teacher_name LIKE ?
        )
      GROUP BY c.id
      ORDER BY c.grade ASC, c.name ASC
      LIMIT ?
    `, [branch, branch, like, like, like, like, limit]),
    all(env, `
      SELECT id, name, login_id, role
      FROM teachers
      WHERE name LIKE ? OR login_id LIKE ? OR role LIKE ?
      ORDER BY role ASC, name ASC
      LIMIT ?
    `, [like, like, like, limit])
  ]);

  return jsonResponse({
    success: true,
    query: q,
    branch,
    limit,
    students,
    classes,
    teachers
  });
}

async function handleStudentDetail(env, url, studentId) {
  const today = todaySeoul();
  const student = await first(env, `
    SELECT id, name, school_name, grade, status, target_score, memo
    FROM students
    WHERE id = ?
  `, [studentId]);

  if (!student) return jsonResponse({ error: 'Student Not Found' }, 404);

  const [classRows, recentAttCount] = await Promise.all([
    all(env, `
      SELECT cs.class_id, c.name AS class_name, c.is_active
      FROM class_students cs
      JOIN classes c ON c.id = cs.class_id
      WHERE cs.student_id = ?
      ORDER BY c.is_active DESC, c.name ASC
    `, [studentId]),
    first(env, `
      SELECT COUNT(*) AS count
      FROM attendance
      WHERE student_id = ?
        AND date >= DATE(?, '-14 days')
        AND date <= ?
    `, [studentId, today, today])
  ]);

  const activeClassCount = classRows.filter(r => Number(r.is_active) !== 0).length;

  return jsonResponse({
    success: true,
    student: {
      id: student.id,
      name: student.name,
      school_name: student.school_name,
      grade: student.grade,
      status: student.status,
      target_score: student.target_score,
      memo: student.memo ? String(student.memo).slice(0, 100) : null
    },
    class_count: classRows.length,
    active_class_count: activeClassCount,
    class_names: classRows.map(r => r.class_name),
    recent_attendance_count: recentAttCount?.count || 0
  });
}

async function handleStudentClasses(env, url, studentId) {
  const rows = await all(env, `
    SELECT
      cs.class_id, c.name AS class_name, c.grade, c.subject,
      c.teacher_name, c.schedule_days, c.time_label, c.is_active,
      se.status AS enrollment_status, se.branch
    FROM class_students cs
    JOIN classes c ON c.id = cs.class_id
    LEFT JOIN student_enrollments se
      ON se.student_id = cs.student_id AND se.class_id = cs.class_id
    WHERE cs.student_id = ?
    ORDER BY c.is_active DESC, c.grade ASC, c.name ASC
  `, [studentId]);

  return jsonResponse({
    success: true,
    student_id: studentId,
    classes: rows.map(r => ({
      class_id: r.class_id,
      class_name: r.class_name,
      grade: r.grade,
      subject: r.subject,
      teacher_name: r.teacher_name,
      schedule_days: r.schedule_days,
      time_label: r.time_label,
      is_active: r.is_active,
      enrollment_status: r.enrollment_status || null,
      branch: r.branch || null
    }))
  });
}

async function handleStudentAttendanceSummary(env, url, studentId) {
  const limit = clampNumber(url.searchParams.get('limit'), 20, 1, 50);
  const today = todaySeoul();
  const fromParam = String(url.searchParams.get('from') || '').slice(0, 10);
  const to = String(url.searchParams.get('to') || today).slice(0, 10);
  const effectiveFrom = fromParam || (() => {
    const parts = today.split('-').map(Number);
    const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    d.setUTCDate(d.getUTCDate() - 30);
    return d.toISOString().slice(0, 10);
  })();

  const [summary, recent] = await Promise.all([
    all(env, `
      SELECT COALESCE(NULLIF(TRIM(status), ''), 'unknown') AS status, COUNT(*) AS count
      FROM attendance
      WHERE student_id = ? AND date >= ? AND date <= ?
      GROUP BY status
      ORDER BY status ASC
    `, [studentId, effectiveFrom, to]),
    all(env, `
      SELECT
        a.date,
        COALESCE(NULLIF(TRIM(a.status), ''), 'unknown') AS status,
        (SELECT cs2.class_id FROM class_students cs2 WHERE cs2.student_id = a.student_id LIMIT 1) AS class_id,
        (SELECT c2.name FROM class_students cs2 JOIN classes c2 ON c2.id = cs2.class_id WHERE cs2.student_id = a.student_id LIMIT 1) AS class_name
      FROM attendance a
      WHERE a.student_id = ? AND a.date >= ? AND a.date <= ?
      ORDER BY a.date DESC
      LIMIT ?
    `, [studentId, effectiveFrom, to, limit])
  ]);

  return jsonResponse({
    success: true,
    student_id: studentId,
    from: effectiveFrom,
    to,
    limit,
    summary,
    recent
  });
}

async function handleStudentExamSummary(env, url, studentId) {
  const limit = clampNumber(url.searchParams.get('limit'), 10, 1, 30);

  const rows = await all(env, `
    SELECT id, exam_title, exam_date, score, question_count, class_id
    FROM exam_sessions
    WHERE student_id = ?
    ORDER BY exam_date DESC, id DESC
    LIMIT ?
  `, [studentId, limit]);

  const scores = rows
    .map(r => Number(r.score))
    .filter(n => Number.isFinite(n) && n >= 0);
  const averageScore = scores.length
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : null;

  return jsonResponse({
    success: true,
    student_id: studentId,
    limit,
    summary: {
      exam_count: rows.length,
      average_score: averageScore,
      latest_score: scores.length ? scores[0] : null
    },
    recent: rows
  });
}

async function handleStudentConsultations(env, url, studentId) {
  const limit = clampNumber(url.searchParams.get('limit'), 10, 1, 30);

  const rows = await all(env, `
    SELECT
      id,
      date,
      COALESCE(NULLIF(TRIM(type), ''), '상담') AS type,
      CASE WHEN TRIM(COALESCE(content, '')) != ''
           THEN SUBSTR(TRIM(content), 1, 200)
           ELSE NULL END AS content_preview,
      next_action
    FROM consultations
    WHERE student_id = ?
    ORDER BY date DESC, id DESC
    LIMIT ?
  `, [studentId, limit]);

  return jsonResponse({
    success: true,
    student_id: studentId,
    limit,
    count: rows.length,
    consultations: rows
  });
}

export async function handleBackdoor(request, env, teacher, path, url) {
  if (!teacher) return jsonResponse({ error: 'Unauthorized' }, 401);
  if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
  if (request.method !== 'GET') return jsonResponse({ error: 'Method Not Allowed' }, 405);

  const sub = path[2] || 'overview';
  if (sub === 'overview') return handleOverview(env, url);
  if (sub === 'students') {
    const studentId = String(path[3] || '').trim();
    if (!studentId) return handleStudents(env, url);
    const subResource = String(path[4] || '').trim();
    if (!subResource) return handleStudentDetail(env, url, studentId);
    if (subResource === 'classes') return handleStudentClasses(env, url, studentId);
    if (subResource === 'attendance-summary') return handleStudentAttendanceSummary(env, url, studentId);
    if (subResource === 'exam-summary') return handleStudentExamSummary(env, url, studentId);
    if (subResource === 'consultations') return handleStudentConsultations(env, url, studentId);
    return jsonResponse({ error: 'API Endpoint Not Found' }, 404);
  }
  if (sub === 'classes') return handleClasses(env, url);
  if (sub === 'today') return handleToday(env, url);
  if (sub === 'timetable') return handleTimetable(env, url);
  if (sub === 'billing-summary') return handleBillingSummary(env, url);
  if (sub === 'search') return handleSearch(env, url);

  return jsonResponse({ error: 'API Endpoint Not Found' }, 404);
}
