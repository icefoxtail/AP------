import { jsonResponse } from '../helpers/response.js';
import { isAdminUser, makeId } from '../helpers/foundation-db.js';
import { isTimeOverlap, overlapRange, uniqSortedPair } from '../helpers/time.js';

const EDITABLE_STATUSES = new Set(['draft', 'scheduled']);
const PATCHABLE_STATUSES = new Set(['draft', 'scheduled', 'cancelled']);

function forbidden() {
  return jsonResponse({ success: false, error: 'Forbidden' }, 403);
}

function currentSchoolYear() {
  return new Date().getFullYear();
}

function normalizeSchoolYear(value, fallback = currentSchoolYear()) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 2000 || n > 2100) return fallback;
  return Math.floor(n);
}

function rowFromBody(body, allowedKeys) {
  const row = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(body, key) && body[key] !== undefined) {
      row[key] = body[key] === '' ? null : body[key];
    }
  }
  return row;
}

function normalizeSlotRows(versionId, classId, slots) {
  return slots.map(slot => ({
    id: makeId('tvs'),
    version_id: versionId,
    class_id: classId,
    day_of_week: String(slot.day_of_week || '').trim(),
    start_time: String(slot.start_time || '').trim(),
    end_time: String(slot.end_time || '').trim(),
    room_name: slot.room_name || null,
    memo: slot.memo || null
  }));
}

async function getVersion(env, id) {
  return env.DB.prepare('SELECT * FROM timetable_versions WHERE id = ?').bind(id).first();
}

async function listSlots(env, versionId, classId = null) {
  const where = ['version_id = ?'];
  const params = [versionId];
  if (classId) {
    where.push('class_id = ?');
    params.push(classId);
  }
  const res = await env.DB.prepare(`
    SELECT *
    FROM timetable_version_slots
    WHERE ${where.join(' AND ')}
    ORDER BY day_of_week ASC, start_time ASC, class_id ASC
  `).bind(...params).all();
  return res.results || [];
}

async function copyClassTimeSlotsToVersion(env, versionId) {
  const countRow = await env.DB.prepare('SELECT COUNT(*) AS count FROM class_time_slots').first();
  await env.DB.prepare(`
    INSERT INTO timetable_version_slots
      (id, version_id, class_id, day_of_week, start_time, end_time, room_name, memo)
    SELECT
      'tvs_' || unixepoch('now') || '_' || lower(hex(randomblob(4))),
      ?,
      class_id,
      day_of_week,
      start_time,
      end_time,
      room_name,
      memo
    FROM class_time_slots
  `).bind(versionId).run();
  return Number(countRow?.count || 0);
}

async function copyVersionSlots(env, sourceVersionId, targetVersionId) {
  const countRow = await env.DB.prepare('SELECT COUNT(*) AS count FROM timetable_version_slots WHERE version_id = ?').bind(sourceVersionId).first();
  await env.DB.prepare(`
    INSERT INTO timetable_version_slots
      (id, version_id, class_id, day_of_week, start_time, end_time, room_name, memo)
    SELECT
      'tvs_' || unixepoch('now') || '_' || lower(hex(randomblob(4))),
      ?,
      class_id,
      day_of_week,
      start_time,
      end_time,
      room_name,
      memo
    FROM timetable_version_slots
    WHERE version_id = ?
  `).bind(targetVersionId, sourceVersionId).run();
  return Number(countRow?.count || 0);
}

async function ensureActiveVersion(env, teacher, body = {}) {
  const existing = await env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first();
  if (existing) return { created: false, timetable_version: existing, copied_slots: 0 };

  const schoolYear = normalizeSchoolYear(body.school_year);
  const version = {
    id: makeId('ttv'),
    school_year: schoolYear,
    title: String(body.title || `${schoolYear} 운영 시간표`).trim(),
    status: 'active',
    source_version_id: null,
    effective_from: body.effective_from || `${schoolYear}-01-01`,
    effective_to: body.effective_to || null,
    created_by: teacher?.id || null,
    memo: body.memo || null
  };

  await env.DB.prepare(`
    INSERT INTO timetable_versions
      (id, school_year, title, status, source_version_id, effective_from, effective_to, created_by, memo, activated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    version.id,
    version.school_year,
    version.title,
    version.status,
    version.source_version_id,
    version.effective_from,
    version.effective_to,
    version.created_by,
    version.memo
  ).run();
  const copiedSlots = await copyClassTimeSlotsToVersion(env, version.id);
  return { created: true, timetable_version: await getVersion(env, version.id), copied_slots: copiedSlots };
}

function pushPreviewConflict(conflicts, type, targetId, classA, classB, dayOfWeek, start, end) {
  const [classAId, classBId] = uniqSortedPair(classA, classB);
  conflicts.push({
    conflict_type: type,
    target_id: targetId || '',
    class_a_id: classAId,
    class_b_id: classBId,
    day_of_week: dayOfWeek,
    overlap_start: start,
    overlap_end: end,
    severity: 'warning',
    status: 'preview'
  });
}

async function scanPreview(env, versionId) {
  const [slotsRes, enrollmentsRes, classesRes] = await Promise.all([
    env.DB.prepare('SELECT * FROM timetable_version_slots WHERE version_id = ? ORDER BY day_of_week, start_time').bind(versionId).all(),
    env.DB.prepare("SELECT * FROM student_enrollments WHERE status = 'active'").all(),
    env.DB.prepare('SELECT id, teacher_name FROM classes').all()
  ]);
  const slots = slotsRes.results || [];
  const enrollments = enrollmentsRes.results || [];
  const classes = classesRes.results || [];
  const classMap = new Map(classes.map(cls => [cls.id, cls]));
  const slotsByClass = new Map();
  const enrollmentsByStudent = new Map();
  const conflicts = [];

  for (const slot of slots) {
    const list = slotsByClass.get(slot.class_id) || [];
    list.push(slot);
    slotsByClass.set(slot.class_id, list);
  }

  for (const enrollment of enrollments) {
    const list = enrollmentsByStudent.get(enrollment.student_id) || [];
    list.push(enrollment);
    enrollmentsByStudent.set(enrollment.student_id, list);
  }

  for (const [studentId, list] of enrollmentsByStudent.entries()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        for (const a of (slotsByClass.get(list[i].class_id) || [])) {
          for (const b of (slotsByClass.get(list[j].class_id) || [])) {
            if (a.day_of_week !== b.day_of_week || !isTimeOverlap(a.start_time, a.end_time, b.start_time, b.end_time)) continue;
            const range = overlapRange(a, b);
            pushPreviewConflict(conflicts, 'student', studentId, a.class_id, b.class_id, a.day_of_week, range.start, range.end);
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
        pushPreviewConflict(conflicts, 'teacher', teacherA, a.class_id, b.class_id, a.day_of_week, range.start, range.end);
      }
      if (a.room_name && a.room_name === b.room_name) {
        pushPreviewConflict(conflicts, 'room', a.room_name, a.class_id, b.class_id, a.day_of_week, range.start, range.end);
      }
    }
  }

  const counts = { student: 0, teacher: 0, room: 0, total: conflicts.length };
  for (const conflict of conflicts) {
    if (Object.prototype.hasOwnProperty.call(counts, conflict.conflict_type)) counts[conflict.conflict_type] += 1;
  }
  return { conflicts, counts };
}

export async function handleTimetableVersions(request, env, teacher, path, url, body = {}) {
  if (!isAdminUser(teacher)) return forbidden();

  const method = request.method;
  const id = path[2];
  const action = path[3];
  const subAction = path[4];

  if (method === 'GET' && !id) {
    const where = [];
    const params = [];
    const status = url.searchParams.get('status');
    const schoolYear = url.searchParams.get('school_year');
    if (status) {
      where.push('status = ?');
      params.push(status);
    }
    if (schoolYear) {
      where.push('school_year = ?');
      params.push(normalizeSchoolYear(schoolYear));
    }
    const res = await env.DB.prepare(`
      SELECT *
      FROM timetable_versions
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY school_year DESC, created_at DESC
    `).bind(...params).all();
    return jsonResponse({ success: true, timetable_versions: res.results || [] });
  }

  if (method === 'POST' && id === 'ensure-active') {
    const result = await ensureActiveVersion(env, teacher, body);
    return jsonResponse({ success: true, ...result });
  }

  if (method === 'POST' && id === 'create-next-draft') {
    const schoolYear = normalizeSchoolYear(body.school_year, currentSchoolYear() + 1);
    const existingDraft = await env.DB.prepare(`
      SELECT id FROM timetable_versions
      WHERE school_year = ? AND status IN ('draft', 'scheduled')
      LIMIT 1
    `).bind(schoolYear).first();
    if (existingDraft) return jsonResponse({ success: false, error: 'draft or scheduled version already exists' }, 409);

    let sourceVersion = null;
    if (body.source_version_id) {
      sourceVersion = await getVersion(env, String(body.source_version_id));
      if (!sourceVersion) return jsonResponse({ success: false, error: 'source version not found' }, 404);
    }
    if (!sourceVersion) {
      sourceVersion = await env.DB.prepare("SELECT * FROM timetable_versions WHERE status = 'active' ORDER BY created_at DESC LIMIT 1").first();
    }
    if (!sourceVersion) {
      const ensured = await ensureActiveVersion(env, teacher, { school_year: currentSchoolYear() });
      sourceVersion = ensured.timetable_version;
    }
    if (!sourceVersion) return jsonResponse({ success: false, error: 'source version not found' }, 404);

    const versionId = makeId('ttv');
    await env.DB.prepare(`
      INSERT INTO timetable_versions
        (id, school_year, title, status, source_version_id, effective_from, effective_to, created_by, memo)
      VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)
    `).bind(
      versionId,
      schoolYear,
      String(body.title || `${schoolYear}년 1월 개편 초안`).trim(),
      sourceVersion.id,
      body.effective_from || `${schoolYear}-01-01`,
      body.effective_to || null,
      teacher?.id || null,
      body.memo || null
    ).run();
    const copiedSlots = await copyVersionSlots(env, sourceVersion.id, versionId);
    return jsonResponse({ success: true, timetable_version: await getVersion(env, versionId), copied_slots: copiedSlots });
  }

  if (method === 'GET' && id && !action) {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    return jsonResponse({
      success: true,
      timetable_version: version,
      timetable_version_slots: await listSlots(env, id)
    });
  }

  if (method === 'PATCH' && id && !action) {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    if (body.status && !PATCHABLE_STATUSES.has(String(body.status))) {
      return jsonResponse({ success: false, error: 'active/archived status transition is not implemented' }, 400);
    }
    if (version.status === 'active' && body.status && body.status !== 'active') {
      return jsonResponse({ success: false, error: 'active version status cannot be changed here' }, 400);
    }
    const row = rowFromBody(body, ['title', 'status', 'effective_from', 'effective_to', 'memo']);
    if (row.status === 'cancelled') row.cancelled_at = new Date().toISOString();
    row.updated_at = new Date().toISOString();
    const keys = Object.keys(row);
    if (keys.length) {
      await env.DB.prepare(`UPDATE timetable_versions SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`).bind(...keys.map(key => row[key]), id).run();
    }
    return jsonResponse({ success: true, timetable_version: await getVersion(env, id) });
  }

  if (method === 'GET' && id && action === 'slots') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    return jsonResponse({ success: true, timetable_version_slots: await listSlots(env, id, url.searchParams.get('class_id')) });
  }

  if (method === 'POST' && id && action === 'slots' && subAction === 'replace-class-slots') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    if (!EDITABLE_STATUSES.has(version.status)) return jsonResponse({ success: false, error: 'version is not editable' }, 400);
    const classId = String(body.class_id || '').trim();
    const slots = Array.isArray(body.slots) ? body.slots : [];
    if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
    const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ?').bind(classId).first();
    if (!cls) return jsonResponse({ success: false, error: 'class not found' }, 404);
    const rows = normalizeSlotRows(id, classId, slots);
    if (rows.some(row => !row.day_of_week || !row.start_time || !row.end_time)) {
      return jsonResponse({ success: false, error: 'day_of_week, start_time, end_time required' }, 400);
    }

    const statements = [
      env.DB.prepare('DELETE FROM timetable_version_slots WHERE version_id = ? AND class_id = ?').bind(id, classId),
      ...rows.map(row => env.DB.prepare(`
        INSERT INTO timetable_version_slots
          (id, version_id, class_id, day_of_week, start_time, end_time, room_name, memo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(row.id, row.version_id, row.class_id, row.day_of_week, row.start_time, row.end_time, row.room_name, row.memo))
    ];
    await env.DB.batch(statements);
    return jsonResponse({
      success: true,
      version_id: id,
      class_id: classId,
      timetable_version_slots: await listSlots(env, id, classId)
    });
  }

  if (method === 'POST' && id && action === 'scan-preview') {
    const version = await getVersion(env, id);
    if (!version) return jsonResponse({ success: false, error: 'Not found' }, 404);
    const result = await scanPreview(env, id);
    return jsonResponse({ success: true, version_id: id, conflicts: result.conflicts, counts: result.counts });
  }

  return null;
}
