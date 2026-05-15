import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, canAccessStudent, isAdminUser, isStaffUser, makeId } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

const ROUTES = new Set([
  'study-materials',
  'material-unit-ranges',
  'material-question-tags',
  'class-material-assignments',
  'material-omr',
  'material-wrongs',
  'material-review'
]);

function text(value, fallback = '') {
  const raw = value === undefined || value === null ? fallback : value;
  return String(raw ?? '').trim();
}

function intOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function ok(data = {}) {
  return jsonResponse({ success: true, ...data });
}

function fail(message, status = 400, extra = {}) {
  return jsonResponse({ success: false, message, ...extra }, status);
}

function today() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function nowIso() {
  return new Date().toISOString();
}

async function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Basic ')) return null;
  try {
    const [loginId, password] = atob(auth.slice(6)).split(':');
    const hash = await sha256hex(password);
    return await env.DB.prepare(
      'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(loginId, hash).first();
  } catch (e) {
    return null;
  }
}

async function requireTeacher(request, env, teacher) {
  const user = teacher || await verifyAuth(request, env);
  return isStaffUser(user) ? user : null;
}

function pickStudentToken(request, url, body = {}) {
  return text(body.token || url.searchParams.get('token') || request.headers.get('X-Student-Token'));
}

async function buildStudentPortalToken(studentId, studentPin) {
  return sha256hex(`${studentId}:${studentPin || ''}:student-portal:v1`);
}

async function verifyStudentToken(request, env, url, body = {}) {
  const studentId = text(body.student_id || url.searchParams.get('student_id'));
  const token = pickStudentToken(request, url, body);
  if (!studentId || !token) return null;
  const student = await env.DB.prepare(`
    SELECT id, name, grade, school_name, student_pin, status
    FROM students
    WHERE id = ?
  `).bind(studentId).first();
  if (!student) return null;
  const expected = await buildStudentPortalToken(student.id, student.student_pin);
  return token === expected ? student : null;
}

function materialPublic(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    material_type: row.material_type,
    grade: row.grade,
    semester: row.semester,
    numbering_type: row.numbering_type || 'global',
    number_start: row.number_start,
    number_end: row.number_end
  };
}

async function listMaterials(env, url) {
  const where = [];
  const params = [];
  const status = text(url.searchParams.get('status'));
  if (status) {
    where.push('status = ?');
    params.push(status);
  } else {
    where.push("COALESCE(status, 'active') != 'deleted'");
  }
  for (const key of ['grade', 'semester', 'material_type']) {
    const v = text(url.searchParams.get(key));
    if (v) {
      where.push(`${key} = ?`);
      params.push(v);
    }
  }
  const q = text(url.searchParams.get('q'));
  if (q) {
    where.push('title LIKE ?');
    params.push(`%${q}%`);
  }
  const res = await env.DB.prepare(`
    SELECT *
    FROM study_materials
    WHERE ${where.join(' AND ')}
    ORDER BY updated_at DESC, created_at DESC
  `).bind(...params).all();
  return ok({ items: res.results || [] });
}

async function upsertUnitRange(env, materialId, item, teacherId, errors) {
  const startNo = intOrNull(item.start_no);
  const endNo = intOrNull(item.end_no);
  const unitText = text(item.unit_text);
  if (!unitText || !Number.isFinite(startNo) || !Number.isFinite(endNo) || startNo > endNo) {
    errors.push({ item, message: 'unit_text/start_no/end_no required' });
    return 'skipped';
  }
  const overlap = await env.DB.prepare(`
    SELECT id, start_no, end_no
    FROM material_unit_ranges
    WHERE material_id = ?
      AND NOT (end_no < ? OR start_no > ?)
      AND NOT (start_no = ? AND end_no = ?)
    LIMIT 1
  `).bind(materialId, startNo, endNo, startNo, endNo).first();
  if (overlap) {
    errors.push({ item, message: `range overlaps ${overlap.start_no}-${overlap.end_no}` });
    return 'skipped';
  }
  const existing = await env.DB.prepare(`
    SELECT id FROM material_unit_ranges
    WHERE material_id = ? AND start_no = ? AND end_no = ?
  `).bind(materialId, startNo, endNo).first();
  if (existing) {
    await env.DB.prepare(`
      UPDATE material_unit_ranges
      SET unit_order = ?, unit_text = ?, subunit_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(intOrNull(item.unit_order) || 0, unitText, text(item.subunit_text), existing.id).run();
    return 'updated';
  }
  await env.DB.prepare(`
    INSERT INTO material_unit_ranges
      (id, material_id, unit_order, unit_text, subunit_text, start_no, end_no)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(makeId('mur'), materialId, intOrNull(item.unit_order) || 0, unitText, text(item.subunit_text), startNo, endNo).run();
  return 'inserted';
}

async function getMaterialWithAssignment(env, assignmentId) {
  return env.DB.prepare(`
    SELECT
      cma.*,
      COALESCE(cma.assignment_title, sm.title) AS title,
      sm.title AS material_title,
      sm.material_type,
      sm.grade AS material_grade,
      sm.semester,
      sm.numbering_type,
      sm.number_start,
      sm.number_end,
      c.name AS class_name,
      c.grade AS class_grade,
      c.teacher_name
    FROM class_material_assignments cma
    JOIN study_materials sm ON sm.id = cma.material_id
    LEFT JOIN classes c ON c.id = cma.class_id
    WHERE cma.id = ?
  `).bind(assignmentId).first();
}

async function findAssignmentTeacherId(env, assignment) {
  if (!assignment?.class_id) return null;
  const mapped = await env.DB.prepare(`
    SELECT teacher_id
    FROM teacher_classes
    WHERE class_id = ?
    ORDER BY teacher_id
    LIMIT 1
  `).bind(assignment.class_id).first();
  if (mapped?.teacher_id) return mapped.teacher_id;
  if (!assignment.teacher_name) return null;
  const teacher = await env.DB.prepare(`
    SELECT id
    FROM teachers
    WHERE TRIM(name) = TRIM(?)
    LIMIT 1
  `).bind(assignment.teacher_name).first();
  return teacher?.id || null;
}

function normalizeWrongNumbers(values, startNo, endNo) {
  const nums = Array.isArray(values) ? values : [];
  const out = [];
  const seen = new Set();
  for (const value of nums) {
    const n = intOrNull(value);
    if (!Number.isFinite(n)) throw new Error('wrong_numbers must be numbers');
    if (Number.isFinite(startNo) && n < startNo) throw new Error('wrong number out of range');
    if (Number.isFinite(endNo) && n > endNo) throw new Error('wrong number out of range');
    if (!seen.has(n)) {
      seen.add(n);
      out.push(n);
    }
  }
  return out.sort((a, b) => a - b);
}

async function replaceSubmissionWrongs(env, assignment, submission, student, wrongNumbers, isNoWrong, teacherId = null) {
  const submittedAt = nowIso();
  const stmts = [
    env.DB.prepare(`
      UPDATE student_material_submissions
      SET is_submitted = 1, is_no_wrong = ?, submitted_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(isNoWrong ? 1 : 0, submittedAt, submission.id),
    env.DB.prepare(`
      UPDATE student_material_wrong_answers
      SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE submission_id = ? AND COALESCE(status, 'active') != 'deleted'
    `).bind(submission.id)
  ];
  for (const no of wrongNumbers) {
    stmts.push(env.DB.prepare(`
      INSERT INTO student_material_wrong_answers
        (id, submission_id, assignment_id, material_id, student_id, class_id, teacher_id, grade, wrong_date, question_no)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      makeId('smw'),
      submission.id,
      assignment.id,
      assignment.material_id,
      student.id || student.student_id,
      assignment.class_id,
      teacherId,
      student.grade || assignment.class_grade || assignment.material_grade || null,
      today(),
      no
    ));
  }
  await env.DB.batch(stmts);
  return { submitted_at: submittedAt, wrong_count: wrongNumbers.length };
}

async function getLatestAssignmentForClassMaterial(env, classId, materialId) {
  return env.DB.prepare(`
    SELECT
      cma.*,
      COALESCE(cma.assignment_title, sm.title) AS title,
      sm.title AS material_title,
      sm.material_type,
      sm.grade AS material_grade,
      sm.semester,
      sm.numbering_type,
      sm.number_start,
      sm.number_end,
      c.name AS class_name,
      c.grade AS class_grade,
      c.teacher_name
    FROM class_material_assignments cma
    JOIN study_materials sm ON sm.id = cma.material_id
    LEFT JOIN classes c ON c.id = cma.class_id
    WHERE cma.class_id = ?
      AND cma.material_id = ?
      AND COALESCE(cma.status, 'active') = 'active'
      AND COALESCE(sm.status, 'active') = 'active'
    ORDER BY cma.assigned_date DESC, cma.created_at DESC
    LIMIT 1
  `).bind(classId, materialId).first();
}

function parseWrongNumbersCsv(value) {
  return text(value).split(',').map(Number).filter(Number.isFinite).sort((a, b) => a - b);
}

async function attachQuestionMeta(env, materialId, wrongRows) {
  const numbers = [...new Set(wrongRows.map(r => Number(r.question_no)).filter(Number.isFinite))];
  if (!numbers.length) return wrongRows.map(r => ({ ...r, unit_text: '', type_text: '', tags: '' }));
  const tagRes = await env.DB.prepare(`
    SELECT *
    FROM material_question_tags
    WHERE material_id = ?
  `).bind(materialId).all();
  const rangeRes = await env.DB.prepare(`
    SELECT *
    FROM material_unit_ranges
    WHERE material_id = ?
    ORDER BY unit_order ASC, start_no ASC
  `).bind(materialId).all();
  const tagMap = new Map((tagRes.results || []).map(t => [Number(t.question_no), t]));
  const ranges = rangeRes.results || [];
  return wrongRows.map(row => {
    const no = Number(row.question_no);
    const tag = tagMap.get(no);
    const range = ranges.find(r => no >= Number(r.start_no) && no <= Number(r.end_no));
    return {
      ...row,
      unit_text: tag?.unit_text || range?.unit_text || '',
      subunit_text: tag?.subunit_text || range?.subunit_text || '',
      type_text: tag?.type_text || '',
      tags: tag?.tags || '',
      difficulty: tag?.difficulty || '',
      page_no: tag?.page_no || '',
      memo: tag?.memo || ''
    };
  });
}

function buildUnitCounts(rows) {
  const map = new Map();
  for (const row of rows) {
    const key = row.unit_text || '단원 미지정';
    map.set(key, (map.get(key) || 0) + 1);
  }
  return [...map.entries()].map(([unit_text, count]) => ({ unit_text, count })).sort((a, b) => b.count - a.count);
}

async function materialReviewRows(env, filters) {
  const where = ["sma.status != 'deleted'"];
  const params = [];
  if (filters.student_id) {
    where.push('sma.student_id = ?');
    params.push(filters.student_id);
  }
  if (filters.class_id) {
    where.push('sma.class_id = ?');
    params.push(filters.class_id);
  }
  if (filters.material_id) {
    where.push('sma.material_id = ?');
    params.push(filters.material_id);
  }
  const res = await env.DB.prepare(`
    SELECT
      sma.question_no,
      sma.material_id,
      sma.student_id,
      s.name AS student_name,
      sm.title AS material_title,
      c.name AS class_name
    FROM student_material_wrong_answers sma
    LEFT JOIN students s ON s.id = sma.student_id
    LEFT JOIN study_materials sm ON sm.id = sma.material_id
    LEFT JOIN classes c ON c.id = sma.class_id
    WHERE ${where.join(' AND ')}
    ORDER BY s.name ASC, sma.question_no ASC
  `).bind(...params).all();
  const rows = res.results || [];
  const byMaterial = new Map();
  for (const row of rows) {
    const list = byMaterial.get(row.material_id) || [];
    list.push(row);
    byMaterial.set(row.material_id, list);
  }
  const merged = [];
  for (const [materialId, list] of byMaterial) {
    merged.push(...await attachQuestionMeta(env, materialId, list));
  }
  return merged.map(row => ({
    ...row,
    review_guide: '번호만 다시 풀고, 풀이 과정을 표시한 뒤 다음 수업에서 선생님과 확인합니다.'
  }));
}

function buildScope(url) {
  const scope = {
    grade: text(url.searchParams.get('grade')),
    class_id: text(url.searchParams.get('class_id')),
    student_id: text(url.searchParams.get('student_id')),
    material_id: text(url.searchParams.get('material_id'))
  };
  scope.type = scope.student_id ? 'student' : scope.class_id ? 'class' : scope.grade ? 'grade' : '';
  return scope;
}

async function enrichScopeLabel(env, scope) {
  const parts = [];
  if (scope.grade) parts.push(scope.grade);
  if (scope.class_id) {
    const row = await env.DB.prepare('SELECT name FROM classes WHERE id = ?').bind(scope.class_id).first();
    parts.push(row?.name || scope.class_id);
  }
  if (scope.student_id) {
    const row = await env.DB.prepare('SELECT name FROM students WHERE id = ?').bind(scope.student_id).first();
    parts.push(row?.name || scope.student_id);
  }
  if (scope.material_id) {
    const row = await env.DB.prepare('SELECT title FROM study_materials WHERE id = ?').bind(scope.material_id).first();
    parts.push(row?.title || scope.material_id);
  }
  return { ...scope, label: parts.join(' / ') };
}

async function scopedWrongRows(env, user, scope) {
  if (!scope.type) return { forbidden: false, rows: [], scope };

  const where = ["COALESCE(sma.status, 'active') != 'deleted'"];
  const params = [];

  if (scope.student_id) {
    if (!(await canAccessStudent(user, scope.student_id, env))) return { forbidden: true, rows: [], scope };
    where.push('sma.student_id = ?');
    params.push(scope.student_id);
  } else if (scope.class_id) {
    if (!(await canAccessClass(user, scope.class_id, env))) return { forbidden: true, rows: [], scope };
    where.push('sma.class_id = ?');
    params.push(scope.class_id);
  } else if (scope.grade) {
    where.push('sma.grade = ?');
    params.push(scope.grade);
    if (!isAdminUser(user)) {
      const allowed = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(user.id).all();
      const classIds = (allowed.results || []).map(r => String(r.class_id || '')).filter(Boolean);
      if (!classIds.length) return { forbidden: false, rows: [], scope };
      where.push(`sma.class_id IN (${classIds.map(() => '?').join(',')})`);
      params.push(...classIds);
    }
  }

  if (scope.material_id) {
    where.push('sma.material_id = ?');
    params.push(scope.material_id);
  }

  const res = await env.DB.prepare(`
    SELECT
      sma.*,
      sm.title AS material_title,
      s.name AS student_name,
      c.name AS class_name
    FROM student_material_wrong_answers sma
    LEFT JOIN study_materials sm ON sm.id = sma.material_id
    LEFT JOIN students s ON s.id = sma.student_id
    LEFT JOIN classes c ON c.id = sma.class_id
    WHERE ${where.join(' AND ')}
    ORDER BY s.name ASC, sm.title ASC, sma.question_no ASC
  `).bind(...params).all();

  const grouped = new Map();
  for (const row of (res.results || [])) {
    const materialId = row.material_id || '';
    const list = grouped.get(materialId) || [];
    list.push(row);
    grouped.set(materialId, list);
  }

  const rows = [];
  for (const [materialId, list] of grouped.entries()) {
    rows.push(...await attachQuestionMeta(env, materialId, list));
  }
  return { forbidden: false, rows, scope };
}

function scopedWrongPayload(scope, rows, submissions = []) {
  const qMap = new Map();
  const sMap = new Map();
  for (const row of rows) {
    const no = Number(row.question_no);
    if (Number.isFinite(no)) qMap.set(no, (qMap.get(no) || 0) + 1);
    const key = row.student_id || '';
    const item = sMap.get(key) || { student_id: row.student_id, student_name: row.student_name || '', wrong_numbers: [] };
    if (Number.isFinite(no)) item.wrong_numbers.push(no);
    sMap.set(key, item);
  }
  for (const sub of submissions) {
    if (!sMap.has(sub.student_id) && Number(sub.is_submitted || 0) === 1) {
      sMap.set(sub.student_id, { student_id: sub.student_id, student_name: sub.student_name || '', wrong_numbers: parseWrongNumbersCsv(sub.wrong_numbers_csv) });
    }
  }
  return {
    scope,
    submissions: submissions.map(row => ({
      student_id: row.student_id,
      student_name: row.student_name,
      is_submitted: Number(row.is_submitted || 0),
      is_no_wrong: Number(row.is_no_wrong || 0),
      status: Number(row.is_submitted || 0) !== 1 ? '-' : Number(row.is_no_wrong || 0) === 1 ? 'O' : parseWrongNumbersCsv(row.wrong_numbers_csv).length ? 'X' : '제출',
      wrong_numbers: parseWrongNumbersCsv(row.wrong_numbers_csv)
    })),
    items: scope.type === 'student' ? rows : [],
    top_wrong_numbers: [...qMap.entries()]
      .map(([question_no, count]) => ({ question_no: Number(question_no), count }))
      .sort((a, b) => b.count - a.count || a.question_no - b.question_no)
      .slice(0, 10),
    student_wrongs: [...sMap.values()].map(row => ({
      ...row,
      wrong_numbers: [...new Set(row.wrong_numbers)].sort((a, b) => a - b)
    })),
    unit_counts: buildUnitCounts(rows)
  };
}

async function scopedSubmissionRows(env, user, scope) {
  const where = ["COALESCE(sms.status, 'active') != 'deleted'"];
  const params = [];
  if (scope.student_id) {
    if (!(await canAccessStudent(user, scope.student_id, env))) return { forbidden: true, rows: [] };
    where.push('sms.student_id = ?');
    params.push(scope.student_id);
  } else if (scope.class_id) {
    if (!(await canAccessClass(user, scope.class_id, env))) return { forbidden: true, rows: [] };
    where.push('cma.class_id = ?');
    params.push(scope.class_id);
  } else if (scope.grade) {
    where.push('(s.grade = ? OR c.grade = ? OR sm.grade = ?)');
    params.push(scope.grade, scope.grade, scope.grade);
    if (!isAdminUser(user)) {
      const allowed = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(user.id).all();
      const classIds = (allowed.results || []).map(r => String(r.class_id || '')).filter(Boolean);
      if (!classIds.length) return { forbidden: false, rows: [] };
      where.push(`cma.class_id IN (${classIds.map(() => '?').join(',')})`);
      params.push(...classIds);
    }
  }
  if (scope.material_id) {
    where.push('cma.material_id = ?');
    params.push(scope.material_id);
  }
  const res = await env.DB.prepare(`
    SELECT
      sms.*,
      s.name AS student_name,
      GROUP_CONCAT(CASE WHEN COALESCE(sma.status, 'active') != 'deleted' THEN sma.question_no END) AS wrong_numbers_csv
    FROM student_material_submissions sms
    JOIN class_material_assignments cma ON cma.id = sms.assignment_id
    JOIN study_materials sm ON sm.id = cma.material_id
    JOIN students s ON s.id = sms.student_id
    LEFT JOIN classes c ON c.id = cma.class_id
    LEFT JOIN student_material_wrong_answers sma ON sma.submission_id = sms.id
    WHERE ${where.join(' AND ')}
    GROUP BY sms.id
    ORDER BY s.name ASC
  `).bind(...params).all();
  return { forbidden: false, rows: res.results || [] };
}

export async function handleStudyMaterialWrongs(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];
  const action = path[3];
  if (!ROUTES.has(resource)) return null;

  if (resource === 'material-omr' && method === 'GET' && id === 'student-assignments') {
    const student = await verifyStudentToken(request, env, url, body);
    if (!student) return fail('Student login required', 401);
    const res = await env.DB.prepare(`
      SELECT
        cma.id AS assignment_id,
        COALESCE(cma.assignment_title, sm.title) AS assignment_title,
        cma.assigned_date,
        cma.class_id,
        c.name AS class_name,
        sm.id AS material_id,
        sm.title AS material_title,
        sm.material_type,
        sms.id AS submission_id,
        COALESCE(sms.is_submitted, 0) AS is_submitted,
        COALESCE(sms.is_no_wrong, 0) AS is_no_wrong,
        sms.submitted_at
      FROM student_material_submissions sms
      JOIN class_material_assignments cma ON cma.id = sms.assignment_id
      JOIN study_materials sm ON sm.id = cma.material_id
      LEFT JOIN classes c ON c.id = cma.class_id
      WHERE sms.student_id = ?
        AND COALESCE(sms.status, 'active') != 'deleted'
        AND COALESCE(cma.status, 'active') = 'active'
        AND COALESCE(sm.status, 'active') = 'active'
      ORDER BY COALESCE(sms.is_submitted, 0) ASC, cma.assigned_date DESC, cma.created_at DESC
    `).bind(student.id).all();
    return ok({ items: res.results || [] });
  }

  if (resource === 'material-omr' && method === 'GET' && id === 'assignment') {
    const student = await verifyStudentToken(request, env, url, body);
    if (!student) return fail('Student login required', 401);
    const assignmentId = text(url.searchParams.get('assignment_id'));
    if (!assignmentId) return fail('assignment_id required');
    const assignment = await getMaterialWithAssignment(env, assignmentId);
    if (!assignment) return fail('Assignment not found', 404);
    const submission = await env.DB.prepare(`
      SELECT *
      FROM student_material_submissions
      WHERE assignment_id = ? AND student_id = ?
    `).bind(assignmentId, student.id).first();
    if (!submission) return fail('Submission not found', 404);
    const wrongs = await env.DB.prepare(`
      SELECT question_no
      FROM student_material_wrong_answers
      WHERE submission_id = ? AND status != 'deleted'
      ORDER BY question_no ASC
    `).bind(submission.id).all();
    return ok({
      assignment: {
        id: assignment.id,
        title: assignment.title,
        assigned_date: assignment.assigned_date,
        class_id: assignment.class_id
      },
      material: materialPublic({
        id: assignment.material_id,
        title: assignment.material_title,
        material_type: assignment.material_type,
        grade: assignment.material_grade,
        semester: assignment.semester,
        numbering_type: assignment.numbering_type,
        number_start: assignment.number_start,
        number_end: assignment.number_end
      }),
      submission: {
        id: submission.id,
        is_submitted: Number(submission.is_submitted || 0),
        is_no_wrong: Number(submission.is_no_wrong || 0),
        submitted_at: submission.submitted_at || null,
        wrong_numbers: (wrongs.results || []).map(r => Number(r.question_no)),
        can_submit: true
      }
    });
  }

  if (resource === 'material-omr' && method === 'POST' && id === 'submit') {
    const student = await verifyStudentToken(request, env, url, body);
    if (!student) return fail('Student login required', 401);
    const assignmentId = text(body.assignment_id);
    if (!assignmentId) return fail('assignment_id required');
    const assignment = await getMaterialWithAssignment(env, assignmentId);
    if (!assignment) return fail('Assignment not found', 404);
    const submission = await env.DB.prepare(`
      SELECT *
      FROM student_material_submissions
      WHERE assignment_id = ? AND student_id = ?
    `).bind(assignmentId, student.id).first();
    if (!submission) return fail('Submission not found', 404);
    const isNoWrong = Number(body.is_no_wrong || 0) === 1 ? 1 : 0;
    let wrongNumbers;
    try {
      wrongNumbers = isNoWrong ? [] : normalizeWrongNumbers(body.wrong_numbers, intOrNull(assignment.number_start), intOrNull(assignment.number_end));
    } catch (e) {
      return fail(e.message || 'Invalid wrong_numbers');
    }
    const teacherId = await findAssignmentTeacherId(env, assignment);
    const saved = await replaceSubmissionWrongs(env, assignment, submission, student, wrongNumbers, isNoWrong, teacherId);
    return ok({ submitted: true, wrong_count: saved.wrong_count, submitted_at: saved.submitted_at });
  }

  const user = await requireTeacher(request, env, teacher);
  if (!user) return fail('Unauthorized', 401);

  if (resource === 'material-omr' && method === 'GET' && id === 'entry-sheet') {
    const classId = text(url.searchParams.get('class_id'));
    const materialId = text(url.searchParams.get('material_id'));
    if (!classId || !materialId) return fail('class_id/material_id required');
    if (!(await canAccessClass(user, classId, env))) return fail('Forbidden', 403);
    const assignment = await getLatestAssignmentForClassMaterial(env, classId, materialId);
    if (!assignment) return fail('Assignment not found', 404);
    const rows = await env.DB.prepare(`
      SELECT
        s.id AS student_id,
        s.name AS student_name,
        s.grade,
        sms.id AS submission_id,
        COALESCE(sms.is_submitted, 0) AS is_submitted,
        COALESCE(sms.is_no_wrong, 0) AS is_no_wrong,
        sms.submitted_at,
        GROUP_CONCAT(CASE WHEN COALESCE(sma.status, 'active') != 'deleted' THEN sma.question_no END) AS wrong_numbers_csv
      FROM class_students cs
      JOIN students s ON s.id = cs.student_id
      LEFT JOIN student_material_submissions sms ON sms.student_id = s.id AND sms.assignment_id = ?
      LEFT JOIN student_material_wrong_answers sma ON sma.submission_id = sms.id
      WHERE cs.class_id = ?
        AND COALESCE(s.status, '재원') = '재원'
      GROUP BY s.id
      ORDER BY s.name ASC
    `).bind(assignment.id, classId).all();
    return ok({
      assignment: {
        id: assignment.id,
        class_id: assignment.class_id,
        material_id: assignment.material_id,
        title: assignment.title
      },
      material: materialPublic({
        id: assignment.material_id,
        title: assignment.material_title,
        material_type: assignment.material_type,
        grade: assignment.material_grade,
        semester: assignment.semester,
        numbering_type: assignment.numbering_type,
        number_start: assignment.number_start,
        number_end: assignment.number_end
      }),
      students: (rows.results || []).map(row => ({
        student_id: row.student_id,
        student_name: row.student_name,
        submission_id: row.submission_id || null,
        is_submitted: Number(row.is_submitted || 0),
        is_no_wrong: Number(row.is_no_wrong || 0),
        submitted_at: row.submitted_at || '',
        wrong_numbers: parseWrongNumbersCsv(row.wrong_numbers_csv)
      }))
    });
  }

  if (resource === 'material-omr' && method === 'POST' && id === 'teacher-batch-save') {
    const assignmentId = text(body.assignment_id);
    const rows = Array.isArray(body.rows) ? body.rows : [];
    if (!assignmentId || !rows.length) return fail('assignment_id/rows required');
    const assignment = await getMaterialWithAssignment(env, assignmentId);
    if (!assignment) return fail('Assignment not found', 404);
    if (!(await canAccessClass(user, assignment.class_id, env))) return fail('Forbidden', 403);
    const teacherId = await findAssignmentTeacherId(env, assignment) || user.id;
    let saved = 0;
    let skippedEmpty = 0;
    for (const row of rows) {
      const studentId = text(row.student_id);
      if (!studentId) { skippedEmpty += 1; continue; }
      const student = await env.DB.prepare('SELECT id, name, grade FROM students WHERE id = ?').bind(studentId).first();
      if (!student) { skippedEmpty += 1; continue; }
      const isNoWrong = Number(row.is_no_wrong || 0) === 1 ? 1 : 0;
      let wrongNumbers;
      try {
        wrongNumbers = isNoWrong ? [] : normalizeWrongNumbers(row.wrong_numbers, intOrNull(assignment.number_start), intOrNull(assignment.number_end));
      } catch (e) {
        return fail(e.message || 'Invalid wrong_numbers');
      }
      if (!isNoWrong && !wrongNumbers.length) { skippedEmpty += 1; continue; }
      let submission = await env.DB.prepare(`
        SELECT *
        FROM student_material_submissions
        WHERE assignment_id = ? AND student_id = ?
      `).bind(assignmentId, studentId).first();
      if (!submission) {
        submission = { id: makeId('sms'), assignment_id: assignmentId, student_id: studentId };
        await env.DB.prepare(`
          INSERT INTO student_material_submissions (id, assignment_id, student_id)
          VALUES (?, ?, ?)
        `).bind(submission.id, assignmentId, studentId).run();
      }
      await replaceSubmissionWrongs(env, assignment, submission, student, wrongNumbers, isNoWrong, teacherId);
      saved += 1;
    }
    return ok({ saved, skipped_empty: skippedEmpty });
  }

  if (resource === 'material-wrongs' && method === 'GET' && id === 'scope') {
    const rawScope = buildScope(url);
    if (!rawScope.type) return fail('grade/class/student required');
    const scope = await enrichScopeLabel(env, rawScope);
    const scoped = await scopedWrongRows(env, user, scope);
    if (scoped.forbidden) return fail('Forbidden', 403);
    const submissions = await scopedSubmissionRows(env, user, scope);
    if (submissions.forbidden) return fail('Forbidden', 403);
    return ok(scopedWrongPayload(scope, scoped.rows, submissions.rows));
  }

  if (resource === 'material-review' && method === 'GET' && id === 'scope') {
    const rawScope = buildScope(url);
    if (!rawScope.type) return fail('grade/class/student required');
    const scope = await enrichScopeLabel(env, rawScope);
    const scoped = await scopedWrongRows(env, user, scope);
    if (scoped.forbidden) return fail('Forbidden', 403);
    return ok({
      scope,
      items: scoped.rows.map(row => ({
        ...row,
        review_guide: '위 번호만 다시 풀고, 풀이 과정을 표시한 뒤 다음 수업 때 확인합니다.'
      }))
    });
  }

  if (resource === 'study-materials') {
    if (method === 'GET' && !id) return listMaterials(env, url);
    if (method === 'POST') {
      const materialType = text(body.material_type);
      const title = text(body.title);
      if (!materialType || !title) return fail('material_type and title required');
      const item = {
        id: makeId('sm'),
        material_type: materialType,
        title,
        grade: text(body.grade),
        semester: text(body.semester),
        subject: text(body.subject, '수학') || '수학',
        numbering_type: text(body.numbering_type, 'global') || 'global',
        number_start: intOrNull(body.number_start),
        number_end: intOrNull(body.number_end),
        status: text(body.status, 'active') || 'active',
        created_by: user.id
      };
      await env.DB.prepare(`
        INSERT INTO study_materials
          (id, material_type, title, grade, semester, subject, numbering_type, number_start, number_end, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(item.id, item.material_type, item.title, item.grade, item.semester, item.subject, item.numbering_type, item.number_start, item.number_end, item.status, item.created_by).run();
      return ok({ item });
    }
    if (method === 'PATCH' && id && action === 'disable') {
      await env.DB.prepare("UPDATE study_materials SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
      return ok({ id, status: 'inactive' });
    }
    if (method === 'PATCH' && id) {
      const allowed = ['material_type', 'title', 'grade', 'semester', 'subject', 'numbering_type', 'number_start', 'number_end', 'status'];
      const row = {};
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(body, key)) {
          row[key] = key === 'number_start' || key === 'number_end' ? intOrNull(body[key]) : text(body[key]);
        }
      }
      const keys = Object.keys(row);
      if (!keys.length) return fail('No fields to update');
      await env.DB.prepare(`
        UPDATE study_materials
        SET ${keys.map(k => `${k} = ?`).join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(...keys.map(k => row[k]), id).run();
      return ok({ id, item: { id, ...row } });
    }
  }

  if (resource === 'material-unit-ranges') {
    if (method === 'GET') {
      const materialId = text(url.searchParams.get('material_id'));
      if (!materialId) return fail('material_id required');
      const res = await env.DB.prepare(`
        SELECT *
        FROM material_unit_ranges
        WHERE material_id = ?
        ORDER BY unit_order ASC, start_no ASC
      `).bind(materialId).all();
      return ok({ items: res.results || [] });
    }
    if (method === 'POST' && id === 'import') {
      const materialId = text(body.material_id);
      const items = Array.isArray(body.items) ? body.items : [];
      if (!materialId || !items.length) return fail('material_id and items required');
      const result = { inserted: 0, updated: 0, skipped: 0, errors: [] };
      for (const item of items) {
        const status = await upsertUnitRange(env, materialId, item, user.id, result.errors);
        result[status] += 1;
      }
      return ok(result);
    }
    if (method === 'PATCH' && id) {
      const current = await env.DB.prepare('SELECT * FROM material_unit_ranges WHERE id = ?').bind(id).first();
      if (!current) return fail('Not found', 404);
      const next = {
        unit_order: Object.prototype.hasOwnProperty.call(body, 'unit_order') ? intOrNull(body.unit_order) || 0 : current.unit_order,
        unit_text: Object.prototype.hasOwnProperty.call(body, 'unit_text') ? text(body.unit_text) : current.unit_text,
        subunit_text: Object.prototype.hasOwnProperty.call(body, 'subunit_text') ? text(body.subunit_text) : current.subunit_text,
        start_no: Object.prototype.hasOwnProperty.call(body, 'start_no') ? intOrNull(body.start_no) : current.start_no,
        end_no: Object.prototype.hasOwnProperty.call(body, 'end_no') ? intOrNull(body.end_no) : current.end_no
      };
      if (!next.unit_text || !Number.isFinite(Number(next.start_no)) || !Number.isFinite(Number(next.end_no)) || Number(next.start_no) > Number(next.end_no)) return fail('invalid range');
      const overlap = await env.DB.prepare(`
        SELECT id
        FROM material_unit_ranges
        WHERE material_id = ?
          AND id != ?
          AND NOT (end_no < ? OR start_no > ?)
        LIMIT 1
      `).bind(current.material_id, id, next.start_no, next.end_no).first();
      if (overlap) return fail('range overlaps existing item', 409);
      await env.DB.prepare(`
        UPDATE material_unit_ranges
        SET unit_order = ?, unit_text = ?, subunit_text = ?, start_no = ?, end_no = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(next.unit_order, next.unit_text, next.subunit_text, next.start_no, next.end_no, id).run();
      return ok({ id, item: { id, ...next } });
    }
  }

  if (resource === 'material-question-tags') {
    if (method === 'GET') {
      const materialId = text(url.searchParams.get('material_id'));
      if (!materialId) return fail('material_id required');
      const res = await env.DB.prepare(`
        SELECT *
        FROM material_question_tags
        WHERE material_id = ?
        ORDER BY question_no ASC
      `).bind(materialId).all();
      return ok({ items: res.results || [] });
    }
    if (method === 'POST' && id === 'import') {
      const materialId = text(body.material_id);
      const items = Array.isArray(body.items) ? body.items : [];
      if (!materialId || !items.length) return fail('material_id and items required');
      let inserted = 0;
      let updated = 0;
      const errors = [];
      for (const item of items) {
        const questionNo = intOrNull(item.question_no);
        if (!Number.isFinite(questionNo)) {
          errors.push({ item, message: 'question_no required' });
          continue;
        }
        const existing = await env.DB.prepare('SELECT id FROM material_question_tags WHERE material_id = ? AND question_no = ?').bind(materialId, questionNo).first();
        const payload = [
          text(item.unit_text),
          text(item.type_text),
          text(item.tags),
          text(item.difficulty),
          text(item.page_no),
          text(item.memo),
          Number(item.needs_review || 0) ? 1 : 0
        ];
        if (existing) {
          await env.DB.prepare(`
            UPDATE material_question_tags
            SET unit_text = ?, type_text = ?, tags = ?, difficulty = ?, page_no = ?, memo = ?, needs_review = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).bind(...payload, existing.id).run();
          updated += 1;
        } else {
          await env.DB.prepare(`
            INSERT INTO material_question_tags
              (id, material_id, question_no, unit_text, type_text, tags, difficulty, page_no, memo, needs_review)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(makeId('mqt'), materialId, questionNo, ...payload).run();
          inserted += 1;
        }
      }
      return ok({ inserted, updated, skipped: errors.length, errors });
    }
  }

  if (resource === 'class-material-assignments') {
    if (method === 'POST') {
      const classId = text(body.class_id);
      const materialId = text(body.material_id);
      const assignedDate = text(body.assigned_date);
      if (!classId || !materialId || !assignedDate) return fail('class_id/material_id/assigned_date required');
      if (!(await canAccessClass(user, classId, env))) return fail('Forbidden', 403);
      const material = await env.DB.prepare('SELECT * FROM study_materials WHERE id = ?').bind(materialId).first();
      if (!material) return fail('Material not found', 404);
      const assignment = {
        id: makeId('cma'),
        class_id: classId,
        material_id: materialId,
        assignment_title: text(body.assignment_title, `${material.title} 오답 입력`) || `${material.title} 오답 입력`,
        assigned_date: assignedDate,
        status: 'active',
        created_by: user.id
      };
      await env.DB.prepare(`
        INSERT INTO class_material_assignments
          (id, class_id, material_id, assignment_title, assigned_date, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(assignment.id, assignment.class_id, assignment.material_id, assignment.assignment_title, assignment.assigned_date, assignment.status, assignment.created_by).run();
      const students = await env.DB.prepare(`
        SELECT s.id
        FROM class_students cs
        JOIN students s ON s.id = cs.student_id
        WHERE cs.class_id = ?
          AND COALESCE(s.status, '재원') = '재원'
      `).bind(classId).all();
      const stmts = [];
      for (const student of (students.results || [])) {
        stmts.push(env.DB.prepare(`
          INSERT OR IGNORE INTO student_material_submissions
            (id, assignment_id, student_id)
          VALUES (?, ?, ?)
        `).bind(makeId('sms'), assignment.id, student.id));
      }
      if (stmts.length) await env.DB.batch(stmts);
      return ok({ assignment, created_submissions: stmts.length });
    }
    if (method === 'GET') {
      const where = ["COALESCE(cma.status, 'active') != 'deleted'"];
      const params = [];
      const classId = text(url.searchParams.get('class_id'));
      if (classId) {
        if (!(await canAccessClass(user, classId, env))) return fail('Forbidden', 403);
        where.push('cma.class_id = ?');
        params.push(classId);
      } else if (!isAdminUser(user)) {
        const cls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(user.id).all();
        const ids = (cls.results || []).map(r => r.class_id);
        if (!ids.length) return ok({ items: [] });
        where.push(`cma.class_id IN (${ids.map(() => '?').join(',')})`);
        params.push(...ids);
      }
      for (const key of ['material_id', 'status']) {
        const v = text(url.searchParams.get(key));
        if (v) {
          where.push(`cma.${key} = ?`);
          params.push(v);
        }
      }
      const res = await env.DB.prepare(`
        SELECT cma.*, sm.title AS material_title, c.name AS class_name
        FROM class_material_assignments cma
        LEFT JOIN study_materials sm ON sm.id = cma.material_id
        LEFT JOIN classes c ON c.id = cma.class_id
        WHERE ${where.join(' AND ')}
        ORDER BY cma.assigned_date DESC, cma.created_at DESC
      `).bind(...params).all();
      return ok({ items: res.results || [] });
    }
    if (method === 'PATCH' && id && action === 'disable') {
      const assignment = await env.DB.prepare('SELECT class_id FROM class_material_assignments WHERE id = ?').bind(id).first();
      if (!assignment) return fail('Not found', 404);
      if (!(await canAccessClass(user, assignment.class_id, env))) return fail('Forbidden', 403);
      await env.DB.prepare("UPDATE class_material_assignments SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
      return ok({ id, status: 'inactive' });
    }
  }

  if (resource === 'material-omr' && method === 'GET' && id === 'overview') {
    const assignmentId = text(url.searchParams.get('assignment_id'));
    const assignment = await getMaterialWithAssignment(env, assignmentId);
    if (!assignment) return fail('Assignment not found', 404);
    if (!(await canAccessClass(user, assignment.class_id, env))) return fail('Forbidden', 403);
    const rows = await env.DB.prepare(`
      SELECT
        sms.*,
        s.name AS student_name,
        GROUP_CONCAT(sma.question_no) AS wrong_numbers_csv
      FROM student_material_submissions sms
      JOIN students s ON s.id = sms.student_id
      LEFT JOIN student_material_wrong_answers sma ON sma.submission_id = sms.id AND sma.status != 'deleted'
      WHERE sms.assignment_id = ?
      GROUP BY sms.id
      ORDER BY s.name ASC
    `).bind(assignmentId).all();
    return ok({
      assignment,
      material: materialPublic({
        id: assignment.material_id,
        title: assignment.material_title,
        material_type: assignment.material_type,
        grade: assignment.material_grade,
        semester: assignment.semester,
        numbering_type: assignment.numbering_type,
        number_start: assignment.number_start,
        number_end: assignment.number_end
      }),
      students: (rows.results || []).map(row => {
        const wrongNumbers = text(row.wrong_numbers_csv).split(',').map(Number).filter(Number.isFinite).sort((a, b) => a - b);
        const submitted = Number(row.is_submitted || 0) === 1;
        const noWrong = Number(row.is_no_wrong || 0) === 1;
        return {
          student_id: row.student_id,
          student_name: row.student_name,
          status: submitted ? (noWrong ? '오답 없음' : '제출 완료') : '미제출',
          is_submitted: Number(row.is_submitted || 0),
          is_no_wrong: Number(row.is_no_wrong || 0),
          submitted_at: row.submitted_at || '',
          wrong_numbers: wrongNumbers
        };
      })
    });
  }

  if (resource === 'material-wrongs' && method === 'GET') {
    if (id === 'student') {
      const studentId = text(url.searchParams.get('student_id'));
      const materialId = text(url.searchParams.get('material_id'));
      if (!studentId || !materialId) return fail('student_id/material_id required');
      if (!(await canAccessStudent(user, studentId, env))) return fail('Forbidden', 403);
      const res = await env.DB.prepare(`
        SELECT *
        FROM student_material_wrong_answers
        WHERE student_id = ? AND material_id = ? AND status != 'deleted'
        ORDER BY wrong_date DESC, question_no ASC
      `).bind(studentId, materialId).all();
      const items = await attachQuestionMeta(env, materialId, res.results || []);
      return ok({ items, unit_counts: buildUnitCounts(items) });
    }
    if (id === 'class' || id === 'grade') {
      const materialId = text(url.searchParams.get('material_id'));
      if (!materialId) return fail('material_id required');
      const where = ['material_id = ?', "status != 'deleted'"];
      const params = [materialId];
      if (id === 'class') {
        const classId = text(url.searchParams.get('class_id'));
        if (!classId) return fail('class_id required');
        if (!(await canAccessClass(user, classId, env))) return fail('Forbidden', 403);
        where.push('class_id = ?');
        params.push(classId);
      } else {
        const grade = text(url.searchParams.get('grade'));
        if (!grade) return fail('grade required');
        where.push('grade = ?');
        params.push(grade);
      }
      const res = await env.DB.prepare(`
        SELECT *
        FROM student_material_wrong_answers
        WHERE ${where.join(' AND ')}
        ORDER BY question_no ASC
      `).bind(...params).all();
      const rows = await attachQuestionMeta(env, materialId, res.results || []);
      const qMap = new Map();
      const sMap = new Map();
      for (const row of rows) {
        qMap.set(row.question_no, (qMap.get(row.question_no) || 0) + 1);
        const list = sMap.get(row.student_id) || [];
        list.push(row.question_no);
        sMap.set(row.student_id, list);
      }
      return ok({
        top_wrong_numbers: [...qMap.entries()].map(([question_no, count]) => ({ question_no: Number(question_no), count })).sort((a, b) => b.count - a.count || a.question_no - b.question_no).slice(0, 10),
        student_wrongs: [...sMap.entries()].map(([student_id, wrong_numbers]) => ({ student_id, wrong_numbers: wrong_numbers.sort((a, b) => a - b) })),
        unit_counts: buildUnitCounts(rows)
      });
    }
  }

  if (resource === 'material-review' && method === 'GET') {
    if (id === 'student') {
      const studentId = text(url.searchParams.get('student_id'));
      const materialId = text(url.searchParams.get('material_id'));
      if (!studentId || !materialId) return fail('student_id/material_id required');
      if (!(await canAccessStudent(user, studentId, env))) return fail('Forbidden', 403);
      return ok({ items: await materialReviewRows(env, { student_id: studentId, material_id: materialId }) });
    }
    if (id === 'class') {
      const classId = text(url.searchParams.get('class_id'));
      const materialId = text(url.searchParams.get('material_id'));
      if (!classId || !materialId) return fail('class_id/material_id required');
      if (!(await canAccessClass(user, classId, env))) return fail('Forbidden', 403);
      return ok({ items: await materialReviewRows(env, { class_id: classId, material_id: materialId }) });
    }
  }

  return null;
}
