import { jsonResponse } from '../helpers/response.js';
import { foundationInsert, foundationPatch, foundationSelect, getAllowedClassIds, isAdminUser, isStaffUser, makeId, safeAll } from '../helpers/foundation-db.js';
import { buildConflictKey, getTeacherConflictExceptionReason, isTimeOverlap, overlapRange, uniqSortedPair } from '../helpers/time.js';
import { normalizeBranch } from '../helpers/branch.js';

function pushConflict(conflicts, type, targetId, classA, classB, branchPair, dayOfWeek, start, end) {
  const [a, b] = uniqSortedPair(classA, classB);
  conflicts.push({
    conflict_type: type,
    target_id: targetId || '',
    branch_pair: branchPair || '',
    class_a_id: a,
    class_b_id: b,
    day_of_week: dayOfWeek,
    overlap_start: start,
    overlap_end: end,
    severity: 'warning',
    status: 'open'
  });
}

async function scanTimetableConflicts(env) {
  const [slotsRes, enrollmentsRes, classesRes] = await Promise.all([
    env.DB.prepare('SELECT * FROM class_time_slots ORDER BY day_of_week, start_time').all(),
    env.DB.prepare("SELECT * FROM student_enrollments WHERE status = 'active'").all(),
    env.DB.prepare('SELECT id, name, grade, subject, teacher_name, day_group, schedule_days, time_label FROM classes').all()
  ]);
  const slots = slotsRes.results || [];
  const enrollments = enrollmentsRes.results || [];
  const classes = classesRes.results || [];
  const classMap = new Map(classes.map(c => [c.id, c]));
  const slotsByClass = new Map();
  const conflicts = [];
  const ignoredTeacherConflicts = [];

  for (const slot of slots) {
    const list = slotsByClass.get(slot.class_id) || [];
    list.push(slot);
    slotsByClass.set(slot.class_id, list);
  }

  const enrollmentsByStudent = new Map();
  for (const en of enrollments) {
    const list = enrollmentsByStudent.get(en.student_id) || [];
    list.push(en);
    enrollmentsByStudent.set(en.student_id, list);
  }

  for (const [studentId, list] of enrollmentsByStudent.entries()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (const a of (slotsByClass.get(list[i].class_id) || [])) {
          for (const b of (slotsByClass.get(list[j].class_id) || [])) {
            if (a.day_of_week !== b.day_of_week || !isTimeOverlap(a.start_time, a.end_time, b.start_time, b.end_time)) continue;
            const r = overlapRange(a, b);
            const branches = uniqSortedPair(normalizeBranch(list[i].branch), normalizeBranch(list[j].branch)).join('+');
            pushConflict(conflicts, 'student', studentId, a.class_id, b.class_id, branches, a.day_of_week, r.start, r.end);
          }
        }
      }
    }
  }

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i];
      const b = slots[j];
      if (a.class_id === b.class_id || a.day_of_week !== b.day_of_week || !isTimeOverlap(a.start_time, a.end_time, b.start_time, b.end_time)) continue;
      const range = overlapRange(a, b);
      const teacherA = String(classMap.get(a.class_id)?.teacher_name || '').trim();
      const teacherB = String(classMap.get(b.class_id)?.teacher_name || '').trim();
      if (teacherA && teacherA === teacherB) {
        const exceptionReason = getTeacherConflictExceptionReason(classMap.get(a.class_id), classMap.get(b.class_id), a.day_of_week);
        if (exceptionReason) {
          const [classAId, classBId] = uniqSortedPair(a.class_id, b.class_id);
          ignoredTeacherConflicts.push({
            conflict_type: 'teacher',
            target_id: teacherA,
            class_a_id: classAId,
            class_b_id: classBId,
            day_of_week: a.day_of_week,
            overlap_start: range.start,
            overlap_end: range.end,
            severity: 'info',
            status: 'ignored',
            reason: exceptionReason
          });
        } else {
          pushConflict(conflicts, 'teacher', teacherA, a.class_id, b.class_id, '', a.day_of_week, range.start, range.end);
        }
      }
      if (a.room_name && a.room_name === b.room_name) pushConflict(conflicts, 'room', a.room_name, a.class_id, b.class_id, '', a.day_of_week, range.start, range.end);
    }
  }

  const existingRows = await safeAll(env, "SELECT id, memo FROM timetable_conflict_logs WHERE status = 'open'");
  const existing = new Map(existingRows.map(r => [String(r.memo || ''), r.id]));
  const stmts = [];

  for (const conflict of conflicts) {
    const key = buildConflictKey(conflict);
    if (existing.has(key)) {
      stmts.push(env.DB.prepare('UPDATE timetable_conflict_logs SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(existing.get(key)));
    } else {
      stmts.push(env.DB.prepare(`
        INSERT INTO timetable_conflict_logs
        (id, conflict_type, target_id, branch_pair, class_a_id, class_b_id, day_of_week, overlap_start, overlap_end, severity, status, memo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(makeId('tcl'), conflict.conflict_type, conflict.target_id, conflict.branch_pair, conflict.class_a_id, conflict.class_b_id, conflict.day_of_week, conflict.overlap_start, conflict.overlap_end, conflict.severity, conflict.status, key));
    }
  }

  for (const ignored of ignoredTeacherConflicts) {
    const key = buildConflictKey(ignored);
    if (existing.has(key)) {
      stmts.push(env.DB.prepare(`
        UPDATE timetable_conflict_logs
        SET severity = 'info', status = 'ignored', memo = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(ignored.reason, existing.get(key)));
    }
  }

  if (stmts.length) await env.DB.batch(stmts);
  return { conflicts, ignored_teacher_conflicts: ignoredTeacherConflicts };
}

export async function handleTimetableConflicts(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource === 'timetable-conflicts') {
    if (method === 'GET') {
      const where = [];
      const params = [];
      if (url.searchParams.get('status')) { where.push('status = ?'); params.push(url.searchParams.get('status')); }
      if (!isAdminUser(teacher)) {
        const classIds = await getAllowedClassIds(env, teacher);
        if (!classIds?.length) return jsonResponse({ success: true, conflicts: [] });
        const markers = classIds.map(() => '?').join(',');
        where.push(`(class_a_id IN (${markers}) OR class_b_id IN (${markers}))`);
        params.push(...classIds, ...classIds);
      }
      return jsonResponse({ success: true, conflicts: await foundationSelect(env, 'timetable_conflict_logs', where, params) });
    }
    if (method === 'POST' && id === 'scan') {
      if (!isStaffUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      const result = await scanTimetableConflicts(env);
      return jsonResponse({
        success: true,
        conflicts: result.conflicts,
        count: result.conflicts.length,
        ignored_teacher_conflicts: result.ignored_teacher_conflicts,
        ignored_teacher_count: result.ignored_teacher_conflicts.length
      });
    }
    if (method === 'PATCH' && id) {
      const row = await foundationPatch(env, 'timetable_conflict_logs', id, body, ['severity', 'status', 'resolved_by', 'resolved_at', 'memo']);
      return jsonResponse({ success: true, conflict: row });
    }
  }

  if (resource === 'timetable-conflict-overrides') {
    const overrideId = path[2];
    if (method === 'GET') return jsonResponse({ success: true, overrides: await foundationSelect(env, 'timetable_conflict_overrides') });
    if (method === 'POST') {
      if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      const row = {
        id: makeId('tco'),
        conflict_type: String(body.conflict_type || '').trim(),
        target_id: body.target_id || null,
        conflict_key: String(body.conflict_key || '').trim(),
        reason: body.reason || null,
        allowed_by: teacher.id,
        expires_at: body.expires_at || null
      };
      if (!row.conflict_type || !row.conflict_key) return jsonResponse({ success: false, error: 'conflict_type and conflict_key required' }, 400);
      return jsonResponse({ success: true, override: await foundationInsert(env, 'timetable_conflict_overrides', row) });
    }
    if (method === 'DELETE' && overrideId) {
      if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      await env.DB.prepare('DELETE FROM timetable_conflict_overrides WHERE id = ?').bind(overrideId).run();
      return jsonResponse({ success: true });
    }
  }
  return null;
}
