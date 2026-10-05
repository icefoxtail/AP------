import { jsonResponse } from '../helpers/response.js';
import { normalizeBranch } from '../helpers/branch.js';
import { isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';
import { buildClassTimeSlotPreviewRows, getMathLessonDurationMinutes } from '../helpers/time.js';

async function previewFoundationSync(env) {
  const [classStudentsRes, classesRes, studentsRes, enrollmentsRes, slotsRes] = await Promise.all([
    env.DB.prepare('SELECT class_id, student_id FROM class_students').all(),
    env.DB.prepare('SELECT id, name, grade, subject, teacher_name, schedule_days, day_group, time_label, is_active FROM classes').all(),
    env.DB.prepare('SELECT id, status FROM students').all(),
    env.DB.prepare("SELECT student_id, class_id, branch FROM student_enrollments WHERE branch = 'apmath'").all(),
    env.DB.prepare('SELECT class_id, day_of_week, start_time, end_time FROM class_time_slots').all()
  ]);
  const classStudents = classStudentsRes.results || [];
  const classes = classesRes.results || [];
  const students = new Map((studentsRes.results || []).map(s => [String(s.id), s]));
  const existingEnrollments = new Set((enrollmentsRes.results || []).map(r => `${r.student_id}|${r.class_id}|${normalizeBranch(r.branch)}`));
  const existingSlots = new Set((slotsRes.results || []).map(r => `${r.class_id}|${r.day_of_week}|${r.start_time}|${r.end_time}`));
  const pendingEnrollments = new Set();
  const pendingSlots = new Set();
  const skippedDetails = [];
  const enrollmentRows = [];
  const timeSlotRows = [];
  const timeSlotPreviewDetails = [];
  let enrollmentsSkipped = 0;
  let timeSlotsSkipped = 0;

  for (const row of classStudents) {
    const key = `${row.student_id}|${row.class_id}|apmath`;
    if (!row.student_id || !row.class_id) {
      enrollmentsSkipped++;
      skippedDetails.push({ type: 'enrollment', reason: 'missing student_id or class_id', row });
      continue;
    }
    if (existingEnrollments.has(key) || pendingEnrollments.has(key)) {
      enrollmentsSkipped++;
      skippedDetails.push({ type: 'enrollment', reason: 'duplicate student_id/class_id/branch', student_id: row.student_id, class_id: row.class_id });
      continue;
    }
    pendingEnrollments.add(key);
    const studentStatus = String(students.get(String(row.student_id))?.status || '').trim();
    enrollmentRows.push({
      id: makeId('enr'),
      student_id: row.student_id,
      class_id: row.class_id,
      branch: 'apmath',
      status: studentStatus === '재원' || studentStatus === 'active' ? 'active' : 'ended',
      start_date: null,
      end_date: null,
      tuition_amount: null,
      memo: 'foundation sync from class_students'
    });
  }

  for (const cls of classes) {
    const previewRows = buildClassTimeSlotPreviewRows(cls, existingSlots);
    for (const skipped of previewRows.skipped) {
      timeSlotsSkipped++;
      skippedDetails.push({ type: 'time_slot', ...skipped });
      if (timeSlotPreviewDetails.length < 200) {
        timeSlotPreviewDetails.push({
          class_id: skipped.class_id || cls.id,
          class_name: skipped.class_name || cls.name || '',
          grade: skipped.grade || cls.grade || '',
          source: skipped.source || cls.time_label || '',
          day_of_week: null,
          start_time: null,
          end_time: null,
          duration_minutes: getMathLessonDurationMinutes(cls),
          reason: skipped.reason
        });
      }
    }
    for (const built of previewRows.rows) {
      const row = built.row;
      const key = `${row.class_id}|${row.day_of_week}|${row.start_time}|${row.end_time}`;
      if (existingSlots.has(key) || pendingSlots.has(key)) {
        timeSlotsSkipped++;
        skippedDetails.push({ type: 'time_slot', reason: 'duplicate class/day/time', class_id: row.class_id, day_of_week: row.day_of_week });
        if (timeSlotPreviewDetails.length < 200) timeSlotPreviewDetails.push({ ...built.detail, reason: 'duplicate class/day/time' });
        continue;
      }
      pendingSlots.add(key);
      timeSlotRows.push(row);
      if (timeSlotPreviewDetails.length < 200) timeSlotPreviewDetails.push(built.detail);
    }
  }

  return {
    success: true,
    dry_run: true,
    enrollments: { insertable: enrollmentRows.length, skipped: enrollmentsSkipped },
    time_slots: { insertable: timeSlotRows.length, skipped: timeSlotsSkipped },
    skipped_details: skippedDetails,
    time_slot_preview_details: timeSlotPreviewDetails,
    _rows: { enrollments: enrollmentRows, time_slots: timeSlotRows }
  };
}

async function insertFoundationSyncLog(env, teacher, result, dryRun) {
  const id = makeId('fsl');
  const enrollments = result.enrollments || {};
  const timeSlots = result.time_slots || {};
  const insertedCount = Number(enrollments.inserted || 0) + Number(timeSlots.inserted || 0);
  const skippedCount = Number(enrollments.skipped || 0) + Number(timeSlots.skipped || 0);
  const summary = { enrollments, time_slots: timeSlots, skipped_details: result.skipped_details || [] };
  await env.DB.prepare(`
    INSERT INTO foundation_sync_logs
    (id, sync_type, status, dry_run, inserted_count, skipped_count, updated_count, error_count, summary_json, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(id, 'foundation_phase2', result.success ? 'success' : 'failed', dryRun ? 1 : 0, insertedCount, skippedCount, 0, 0, JSON.stringify(summary), teacher?.id || null).run();
  return id;
}

async function runFoundationSync(env, teacher, options = {}) {
  const syncEnrollments = options.sync_enrollments !== false;
  const syncTimeSlots = options.sync_time_slots === true;
  const preview = await previewFoundationSync(env);
  const enrollmentRows = syncEnrollments ? preview._rows.enrollments : [];
  const timeSlotRows = syncTimeSlots ? preview._rows.time_slots : [];
  const stmts = [];

  for (const row of enrollmentRows) {
    stmts.push(env.DB.prepare(`
      INSERT INTO student_enrollments
      (id, student_id, branch, class_id, status, start_date, end_date, tuition_amount, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(row.id, row.student_id, row.branch, row.class_id, row.status, row.start_date, row.end_date, row.tuition_amount, row.memo));
  }

  for (const row of timeSlotRows) {
    stmts.push(env.DB.prepare(`
      INSERT INTO class_time_slots
      (id, class_id, day_of_week, start_time, end_time, room_name, memo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(row.id, row.class_id, row.day_of_week, row.start_time, row.end_time, row.room_name, row.memo));
  }

  if (stmts.length) await env.DB.batch(stmts);
  const result = {
    success: true,
    dry_run: false,
    enrollments: {
      inserted: enrollmentRows.length,
      skipped: syncEnrollments ? preview.enrollments.skipped : preview.enrollments.insertable + preview.enrollments.skipped
    },
    time_slots: {
      inserted: timeSlotRows.length,
      skipped: syncTimeSlots ? preview.time_slots.skipped : preview.time_slots.insertable + preview.time_slots.skipped
    },
    skipped_details: preview.skipped_details
  };
  result.log_id = await insertFoundationSyncLog(env, teacher, result, false);
  return result;
}

export async function handleFoundationSync(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const id = path[2];
  if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
  if (method === 'GET' && id === 'preview') {
    const preview = await previewFoundationSync(env);
    delete preview._rows;
    return jsonResponse(preview);
  }
  if (method === 'POST' && id === 'run') {
    const result = await runFoundationSync(env, teacher, body || {});
    delete result.skipped_details;
    return jsonResponse(result);
  }
  if (method === 'GET' && id === 'logs') {
    const logs = await safeAll(env, 'SELECT * FROM foundation_sync_logs ORDER BY created_at DESC LIMIT 50');
    return jsonResponse({ success: true, logs });
  }
  return null;
}
