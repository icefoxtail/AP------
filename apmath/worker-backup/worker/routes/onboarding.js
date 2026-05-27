import { canAccessClass, canAccessStudent, isAdminUser, makeId } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

const TASK_TYPES = [
  { type: 'intro', order: 0, visibleOffset: 0, dueOffset: 0 },
  { type: 'week1', order: 1, visibleOffset: 5, dueOffset: 7 },
  { type: 'month1', order: 2, visibleOffset: 25, dueOffset: 30 }
];

const CONSULTATION_TYPES = {
  intro: '담임 인사',
  week1: '1주차 적응 확인',
  month1: '1개월 정착 상담'
};

const TERMINAL_STATUSES = new Set(['completed', 'skipped']);

function pickText(value, fallback = '') {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function todayKstDateString() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function nowIso() {
  return new Date().toISOString();
}

function addDays(dateText, days) {
  const base = /^\d{4}-\d{2}-\d{2}$/.test(String(dateText || '')) ? String(dateText) : todayKstDateString();
  const date = new Date(`${base}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

function getChangeCount(result) {
  return Number(result?.meta?.changes ?? result?.changes ?? 0);
}

function normalizeTeacherName(name) {
  return String(name || '').trim().replace(/\s+/g, '').replace(/선생님$/g, '');
}

async function findTeacherForClass(env, classId) {
  if (!classId) return null;
  const cls = await env.DB.prepare('SELECT id, teacher_name FROM classes WHERE id = ?').bind(classId).first();
  if (!cls?.teacher_name) return null;
  const teachers = await env.DB.prepare('SELECT id, name, role FROM teachers').all();
  const target = normalizeTeacherName(cls.teacher_name);
  return (teachers.results || []).find(t => normalizeTeacherName(t.name) === target) || null;
}

async function canTeacherHandleClass(env, teacherId, classId) {
  if (!teacherId || !classId) return false;
  const row = await env.DB.prepare('SELECT 1 FROM teacher_classes WHERE teacher_id = ? AND class_id = ? LIMIT 1')
    .bind(teacherId, classId)
    .first();
  return !!row;
}

async function resolveTaskTeacherId(env, actor, resolvedClassId, requestedTeacherId) {
  const requested = pickText(requestedTeacherId);
  if (requested && isAdminUser(actor)) {
    if (!resolvedClassId) return actor.id || null;
    const requestedTeacher = await env.DB.prepare('SELECT id, name, role FROM teachers WHERE id = ?')
      .bind(requested)
      .first();
    if (!requestedTeacher) return { response: jsonResponse({ success: false, error: 'teacher not found' }, 404) };
    if (!(await canTeacherHandleClass(env, requestedTeacher.id, resolvedClassId))) {
      return { response: jsonResponse({ success: false, error: 'teacher not assigned to class' }, 403) };
    }
    return requestedTeacher.id;
  }

  const classTeacher = await findTeacherForClass(env, resolvedClassId);
  return classTeacher?.id || actor.id || null;
}

async function resolveBootstrapContext(env, teacher, studentId, classId, enrollmentId) {
  const student = await env.DB.prepare('SELECT id FROM students WHERE id = ?').bind(studentId).first();
  if (!student) return { response: jsonResponse({ success: false, error: 'student not found' }, 404) };

  let resolvedClassId = classId || null;
  if (resolvedClassId) {
    const classRow = await env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(resolvedClassId).first();
    if (!classRow) return { response: jsonResponse({ success: false, error: 'class not found' }, 404) };
  }

  if (enrollmentId) {
    const enrollment = await env.DB.prepare('SELECT id, student_id, class_id, status FROM student_enrollments WHERE id = ?')
      .bind(enrollmentId)
      .first();
    if (!enrollment) return { response: jsonResponse({ success: false, error: 'enrollment not found' }, 404) };
    if (String(enrollment.status || '') !== 'active') {
      return { response: jsonResponse({ success: false, error: 'inactive enrollment' }, 409) };
    }
    if (String(enrollment.student_id) !== String(studentId)) {
      return { response: jsonResponse({ success: false, error: 'invalid enrollment/class relation' }, 400) };
    }
    if (resolvedClassId && String(enrollment.class_id || '') !== String(resolvedClassId)) {
      return { response: jsonResponse({ success: false, error: 'invalid enrollment/class relation' }, 400) };
    }
    resolvedClassId = resolvedClassId || enrollment.class_id || null;
  }

  if (resolvedClassId) {
    const classStudent = await env.DB.prepare('SELECT 1 FROM class_students WHERE student_id = ? AND class_id = ? LIMIT 1')
      .bind(studentId, resolvedClassId)
      .first();
    const activeEnrollment = classStudent ? null : await env.DB.prepare(`
      SELECT 1 FROM student_enrollments
      WHERE student_id = ? AND class_id = ? AND status = 'active'
      LIMIT 1
    `).bind(studentId, resolvedClassId).first();
    if (!classStudent && !activeEnrollment && !enrollmentId) {
      return { response: jsonResponse({ success: false, error: 'invalid enrollment/class relation' }, 400) };
    }
    if (!(await canAccessClass(teacher, resolvedClassId, env))) return { response: jsonResponse({ error: 'Forbidden' }, 403) };
  } else if (!(await canAccessStudent(teacher, studentId, env))) {
    return { response: jsonResponse({ error: 'Forbidden' }, 403) };
  }

  return { classId: resolvedClassId };
}

async function getTask(env, id) {
  return env.DB.prepare('SELECT * FROM onboarding_tasks WHERE id = ?').bind(id).first();
}

async function ensureTaskAccess(env, teacher, task) {
  if (!teacher || !task) return false;
  if (isAdminUser(teacher)) return true;
  if (task.teacher_id && String(task.teacher_id) === String(teacher.id)) return true;
  if (task.student_id && await canAccessStudent(teacher, task.student_id, env)) return true;
  if (task.class_id && await canAccessClass(teacher, task.class_id, env)) return true;
  return false;
}

async function loadTaskForWrite(env, teacher, id, allowClosed = false) {
  const task = await getTask(env, id);
  if (!task) return { response: jsonResponse({ error: 'Not found' }, 404) };
  if (!(await ensureTaskAccess(env, teacher, task))) return { response: jsonResponse({ error: 'Forbidden' }, 403) };
  if (!allowClosed && TERMINAL_STATUSES.has(task.status)) {
    return { response: jsonResponse({ success: false, error: 'Task already closed' }, 409) };
  }
  return { task };
}

function appendNote(existing, addition) {
  const before = pickText(existing);
  const after = pickText(addition);
  if (!before) return after || null;
  if (!after) return before;
  return `${before}\n${after}`;
}

function buildConsultationContent(task, body) {
  const lines = [];
  const content = pickText(body.content);
  const notes = pickText(body.notes);
  if (content) lines.push(content);
  if (notes) lines.push(notes);
  if (task.task_type === 'week1') {
    lines.push(`수업 적응 상태: ${pickText(body.lesson_adaptation_status)}`);
    lines.push(`숙제 적응 상태: ${pickText(body.homework_adaptation_status)}`);
  }
  if (task.task_type === 'month1') {
    lines.push(`한 달 적응 요약: ${pickText(body.month_summary)}`);
    lines.push(`다음 달 공부 방향: ${pickText(body.next_month_plan)}`);
  }
  return lines.filter(Boolean).join('\n') || `${CONSULTATION_TYPES[task.task_type] || task.task_type} completed`;
}

function validateCompletePayload(task, body) {
  if (task.task_type === 'week1') {
    if (!pickText(body.lesson_adaptation_status) || !pickText(body.homework_adaptation_status)) {
      return 'lesson_adaptation_status and homework_adaptation_status required';
    }
  }
  if (task.task_type === 'month1') {
    if (!pickText(body.month_summary) || !pickText(body.next_month_plan)) {
      return 'month_summary and next_month_plan required';
    }
  }
  return '';
}

async function listTasks(env, teacher) {
  const today = todayKstDateString();
  let params = [today, today, today, today, teacher.id, teacher.id, teacher.id];
  let scopeClause = '(ot.teacher_id = ? OR ot.created_teacher_id = ? OR ot.student_id IN (SELECT cs.student_id FROM class_students cs JOIN teacher_classes tc ON tc.class_id = cs.class_id WHERE tc.teacher_id = ?))';

  if (!isAdminUser(teacher)) {
    scopeClause = '(ot.teacher_id = ? OR ot.student_id IN (SELECT cs.student_id FROM class_students cs JOIN teacher_classes tc ON tc.class_id = cs.class_id WHERE tc.teacher_id = ?))';
    params = [today, today, today, today, teacher.id, teacher.id];
  }

  const res = await env.DB.prepare(`
    SELECT ot.*,
           s.name AS student_name,
           c.name AS class_name,
           t.name AS teacher_name,
           CASE
             WHEN ot.status = 'deferred' AND ot.deferred_until IS NOT NULL AND ot.deferred_until <= ? THEN 'needs_action'
             WHEN ot.status = 'pending' AND ot.visible_from <= ? THEN 'needs_action'
             ELSE ot.status
           END AS effective_status
    FROM onboarding_tasks ot
    LEFT JOIN students s ON s.id = ot.student_id
    LEFT JOIN classes c ON c.id = ot.class_id
    LEFT JOIN teachers t ON t.id = ot.teacher_id
    WHERE ot.status NOT IN ('completed', 'skipped')
      AND ot.visible_from <= ?
      AND (
        ot.status != 'deferred'
        OR ot.deferred_until IS NULL
        OR ot.deferred_until = ''
        OR ot.deferred_until <= ?
      )
      AND ${scopeClause}
    ORDER BY ot.due_date ASC, ot.task_order ASC, s.name ASC
  `).bind(...params).all();

  return jsonResponse({ success: true, tasks: res.results || [] });
}

async function bootstrapTasks(env, teacher, body) {
  const studentId = pickText(body.student_id || body.studentId);
  const classId = pickText(body.class_id || body.classId);
  const enrollmentId = pickText(body.enrollment_id || body.enrollmentId) || null;
  const startedAt = pickText(body.onboarding_started_at || body.onboardingStartedAt, todayKstDateString());
  if (!studentId) return jsonResponse({ success: false, error: 'student_id required' }, 400);

  const resolved = await resolveBootstrapContext(env, teacher, studentId, classId, enrollmentId);
  if (resolved.response) return resolved.response;
  const resolvedClassId = resolved.classId;

  const teacherId = await resolveTaskTeacherId(env, teacher, resolvedClassId, body.teacher_id || body.teacherId);
  if (teacherId?.response) return teacherId.response;
  if (!teacherId) return jsonResponse({ success: false, error: 'teacher_id required' }, 400);

  let createdCount = 0;
  let skippedCount = 0;

  for (const spec of TASK_TYPES) {
    const duplicate = await env.DB.prepare(`
      SELECT id
      FROM onboarding_tasks
      WHERE student_id = ?
        AND IFNULL(class_id, '') = IFNULL(?, '')
        AND IFNULL(enrollment_id, '') = IFNULL(?, '')
        AND task_type = ?
      LIMIT 1
    `).bind(studentId, resolvedClassId || null, enrollmentId || null, spec.type).first();
    if (duplicate?.id) {
      skippedCount++;
      continue;
    }

    await env.DB.prepare(`
      INSERT INTO onboarding_tasks (
        id, student_id, class_id, enrollment_id, teacher_id, created_teacher_id,
        task_type, task_order, status, onboarding_started_at, visible_from, due_date,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?, DATETIME('now'), DATETIME('now'))
    `).bind(
      makeId('ot'),
      studentId,
      resolvedClassId || null,
      enrollmentId || null,
      teacherId,
      teacher.id,
      spec.type,
      spec.order,
      startedAt,
      addDays(startedAt, spec.visibleOffset),
      addDays(startedAt, spec.dueOffset)
    ).run();
    createdCount++;
  }

  return jsonResponse({ success: true, created_count: createdCount, skipped_count: skippedCount });
}

async function patchTask(env, teacher, id, body) {
  const loaded = await loadTaskForWrite(env, teacher, id);
  if (loaded.response) return loaded.response;
  const task = loaded.task;
  const fields = [];
  const values = [];

  if (Object.prototype.hasOwnProperty.call(body, 'notes')) {
    fields.push('notes = ?');
    values.push(pickText(body.notes) || null);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'contact_method')) {
    fields.push('contact_method = ?');
    values.push(pickText(body.contact_method) || null);
  }
  if (Object.prototype.hasOwnProperty.call(body, 'contactMethod')) {
    fields.push('contact_method = ?');
    values.push(pickText(body.contactMethod) || null);
  }
  if (!fields.length) return jsonResponse({ success: true, task });

  fields.push('updated_at = DATETIME(\'now\')');
  const updateResult = await env.DB.prepare(`
    UPDATE onboarding_tasks
    SET ${fields.join(', ')}
    WHERE id = ? AND status NOT IN ('completed', 'skipped')
  `).bind(...values, id).run();
  if (getChangeCount(updateResult) === 0) {
    return jsonResponse({ success: false, error: 'Task already closed' }, 409);
  }
  return jsonResponse({ success: true });
}

async function completeTask(env, teacher, id, body) {
  const loaded = await loadTaskForWrite(env, teacher, id);
  if (loaded.response) return loaded.response;
  const task = loaded.task;
  const validation = validateCompletePayload(task, body);
  if (validation) return jsonResponse({ success: false, error: validation }, 400);

  const completedAt = nowIso();
  const updateResult = await env.DB.prepare(`
    UPDATE onboarding_tasks
    SET status = 'completed',
        completed_at = ?,
        completed_by = ?,
        notes = ?,
        updated_at = DATETIME('now')
    WHERE id = ? AND status NOT IN ('completed', 'skipped')
  `).bind(completedAt, teacher.id, appendNote(task.notes, body.notes), id).run();
  if (getChangeCount(updateResult) === 0) {
    return jsonResponse({ success: false, error: 'Task already closed' }, 409);
  }

  const consultationId = makeId('cns');
  await env.DB.prepare(`
    INSERT INTO consultations (id, student_id, date, type, content, next_action, created_at)
    VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
  `).bind(
    consultationId,
    task.student_id,
    todayKstDateString(),
    CONSULTATION_TYPES[task.task_type] || task.task_type,
    buildConsultationContent(task, body),
    pickText(body.next_action || body.nextAction) || null
  ).run();

  await env.DB.prepare(`
    UPDATE onboarding_tasks
    SET completed_consultation_id = ?, updated_at = DATETIME('now')
    WHERE id = ?
  `).bind(consultationId, id).run();

  return jsonResponse({ success: true, consultation_id: consultationId });
}

async function contactTask(env, teacher, id, body) {
  const loaded = await loadTaskForWrite(env, teacher, id);
  if (loaded.response) return loaded.response;
  const task = loaded.task;
  const updateResult = await env.DB.prepare(`
    UPDATE onboarding_tasks
    SET status = 'contacted',
        contact_method = ?,
        last_contact_at = ?,
        notes = ?,
        updated_at = DATETIME('now')
    WHERE id = ? AND status NOT IN ('completed', 'skipped')
  `).bind(
    pickText(body.contact_method || body.contactMethod) || task.contact_method || null,
    nowIso(),
    appendNote(task.notes, body.notes),
    id
  ).run();
  if (getChangeCount(updateResult) === 0) {
    return jsonResponse({ success: false, error: 'Task already closed' }, 409);
  }
  return jsonResponse({ success: true });
}

async function deferTask(env, teacher, id, body) {
  const loaded = await loadTaskForWrite(env, teacher, id);
  if (loaded.response) return loaded.response;
  const task = loaded.task;
  const deferredUntil = pickText(body.deferred_until || body.deferredUntil) || addDays(todayKstDateString(), 1);
  const updateResult = await env.DB.prepare(`
    UPDATE onboarding_tasks
    SET status = 'deferred',
        deferred_until = ?,
        notes = ?,
        updated_at = DATETIME('now')
    WHERE id = ? AND status NOT IN ('completed', 'skipped')
  `).bind(deferredUntil, appendNote(task.notes, body.notes), id).run();
  if (getChangeCount(updateResult) === 0) {
    return jsonResponse({ success: false, error: 'Task already closed' }, 409);
  }
  return jsonResponse({ success: true });
}

async function skipTask(env, teacher, id, body) {
  const loaded = await loadTaskForWrite(env, teacher, id);
  if (loaded.response) return loaded.response;
  const task = loaded.task;
  const updateResult = await env.DB.prepare(`
    UPDATE onboarding_tasks
    SET status = 'skipped',
        notes = ?,
        updated_at = DATETIME('now')
    WHERE id = ? AND status NOT IN ('completed', 'skipped')
  `).bind(appendNote(task.notes, body.notes), id).run();
  if (getChangeCount(updateResult) === 0) {
    return jsonResponse({ success: false, error: 'Task already closed' }, 409);
  }
  return jsonResponse({ success: true });
}

export async function handleOnboarding(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  if (method === 'GET' && path[2] === 'tasks') return listTasks(env, teacher);
  if (method === 'POST' && path[2] === 'tasks' && path[3] === 'bootstrap') return bootstrapTasks(env, teacher, body);
  if (path[2] === 'tasks' && path[3] && method === 'PATCH') return patchTask(env, teacher, path[3], body);
  if (path[2] === 'tasks' && path[3] && method === 'POST' && path[4] === 'complete') return completeTask(env, teacher, path[3], body);
  if (path[2] === 'tasks' && path[3] && method === 'POST' && path[4] === 'contact') return contactTask(env, teacher, path[3], body);
  if (path[2] === 'tasks' && path[3] && method === 'POST' && path[4] === 'defer') return deferTask(env, teacher, path[3], body);
  if (path[2] === 'tasks' && path[3] && method === 'POST' && path[4] === 'skip') return skipTask(env, teacher, path[3], body);
  return null;
}
