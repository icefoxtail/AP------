import { jsonResponse } from '../helpers/response.js';
import { isAdminUser, makeId } from '../helpers/foundation-db.js';

function forbidden() {
  return jsonResponse({ success: false, error: 'Forbidden' }, 403);
}

function monthKeyFromDate(date = new Date()) {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return `${kst.getUTCFullYear()}-${String(kst.getUTCMonth() + 1).padStart(2, '0')}`;
}

function monthEndDate(monthKey) {
  const match = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
  if (!match) return '';
  const year = Number(match[1]);
  const month = Number(match[2]);
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
}

function normalizeMonthKey(value) {
  const text = String(value || '').trim();
  return /^\d{4}-\d{2}$/.test(text) ? text : monthKeyFromDate();
}

function normalizeSnapshotDate(value, monthKey) {
  const text = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : monthEndDate(monthKey);
}

function readRawMeta(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); } catch (error) { return {}; }
}

function jsonText(value) {
  try { return JSON.stringify(value || {}); } catch (error) { return '{}'; }
}

export function normalizeNameKey(row) {
  const sourceId = String(row.source_student_id || '').trim();
  if (sourceId) return `id:${sourceId}`;
  return [
    String(row.display_name || '').replace(/\s+/g, ''),
    row.grade || '',
    row.school_name || ''
  ].join('::');
}

export function positionKey(row) {
  return [
    row.source_class_id || '',
    row.source_cell_id || '',
    row.day_label || '',
    row.period_label || '',
    row.start_time || '',
    row.end_time || '',
    row.class_name || '',
    row.teacher_name || ''
  ].join(' / ');
}

function sortedUnique(values) {
  return Array.from(new Set((values || []).filter(Boolean))).sort();
}

function setDiff(a, b) {
  const bSet = new Set(b);
  return a.filter(value => !bSet.has(value));
}

function sameSet(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function buildSnapshotChangeSet(previous, current) {
  const previousRows = Array.isArray(previous?.students) ? previous.students : [];
  const currentRows = Array.isArray(current?.students) ? current.students : [];
  const previousCells = new Map((previous?.timetable_cells || []).map(row => [row.id, row]));
  const currentCells = new Map((current?.timetable_cells || []).map(row => [row.id, row]));
  const prevByKey = new Map();
  const curByKey = new Map();

  for (const row of previousRows) {
    const key = normalizeNameKey(row);
    const list = prevByKey.get(key) || [];
    list.push(row);
    prevByKey.set(key, list);
  }
  for (const row of currentRows) {
    const key = normalizeNameKey(row);
    const list = curByKey.get(key) || [];
    list.push(row);
    curByKey.set(key, list);
  }

  const joined = [];
  const left = [];
  const moved = [];
  for (const [key, rows] of curByKey.entries()) {
    if (!prevByKey.has(key)) {
      joined.push({ student: rows[0], rows, positions: sortedUnique(rows.map(row => positionKey(currentCells.get(row.snapshot_cell_id) || {}))) });
    }
  }
  for (const [key, rows] of prevByKey.entries()) {
    if (!curByKey.has(key)) {
      left.push({ student: rows[0], rows, positions: sortedUnique(rows.map(row => positionKey(previousCells.get(row.snapshot_cell_id) || {}))) });
    }
  }
  for (const [key, currentList] of curByKey.entries()) {
    const previousList = prevByKey.get(key);
    if (!previousList) continue;
    const beforePositions = sortedUnique(previousList.map(row => positionKey(previousCells.get(row.snapshot_cell_id) || {})));
    const afterPositions = sortedUnique(currentList.map(row => positionKey(currentCells.get(row.snapshot_cell_id) || {})));
    if (!sameSet(beforePositions, afterPositions)) {
      moved.push({
        student: currentList[0],
        before: previousList[0],
        rows: currentList,
        before_rows: previousList,
        before_positions: beforePositions,
        after_positions: afterPositions,
        removed_positions: setDiff(beforePositions, afterPositions),
        added_positions: setDiff(afterPositions, beforePositions),
        before_position: beforePositions.join(' | '),
        after_position: afterPositions.join(' | ')
      });
    }
  }
  return { joined, left, moved };
}

async function listSnapshots(env) {
  const res = await env.DB.prepare(`
    SELECT s.*, COUNT(c.id) AS cell_count, COALESCE(SUM(c.student_count), 0) AS student_count
    FROM ap_timetable_month_snapshots s
    LEFT JOIN ap_timetable_month_snapshot_cells c ON c.snapshot_id = s.id
    GROUP BY s.id
    ORDER BY s.month_key DESC, s.snapshot_date DESC
  `).all();
  return res.results || [];
}

async function loadSnapshot(env, monthKey) {
  const snapshot = await env.DB.prepare(`
    SELECT *
    FROM ap_timetable_month_snapshots
    WHERE month_key = ?
    ORDER BY snapshot_date DESC, created_at DESC
    LIMIT 1
  `).bind(monthKey).first();
  if (!snapshot) return null;
  const [cellsRes, studentsRes] = await Promise.all([
    env.DB.prepare(`
      SELECT *
      FROM ap_timetable_month_snapshot_cells
      WHERE snapshot_id = ?
      ORDER BY sort_order ASC, day_label ASC, period_order ASC, class_name ASC
    `).bind(snapshot.id).all(),
    env.DB.prepare(`
      SELECT *
      FROM ap_timetable_month_snapshot_students
      WHERE snapshot_id = ?
      ORDER BY sort_order ASC, display_name ASC
    `).bind(snapshot.id).all()
  ]);
  const cells = cellsRes.results || [];
  const students = studentsRes.results || [];
  const byCell = new Map();
  for (const row of students) {
    const list = byCell.get(row.snapshot_cell_id) || [];
    list.push(row);
    byCell.set(row.snapshot_cell_id, list);
  }
  return {
    snapshot,
    timetable_cells: cells.map(cell => ({ ...cell, assigned_students: byCell.get(cell.id) || [] })),
    students
  };
}

async function buildCurrentSnapshotRows(env) {
  const [classRes, slotRes, mapRes, studentRes] = await Promise.all([
    env.DB.prepare(`
      SELECT id, name, grade, subject, teacher_name, schedule_days, day_group, time_label, textbook, is_active
      FROM classes
      WHERE is_active != 0 OR is_active IS NULL
      ORDER BY grade ASC, name ASC
    `).all(),
    env.DB.prepare(`
      SELECT *
      FROM class_time_slots
      ORDER BY day_of_week ASC, start_time ASC, class_id ASC
    `).all().catch(() => ({ results: [] })),
    env.DB.prepare('SELECT * FROM class_students ORDER BY class_id ASC, student_id ASC').all(),
    env.DB.prepare('SELECT id, name, grade, school, school_name, status, onboarding_started_at FROM students').all()
  ]);
  const classes = classRes.results || [];
  const slots = slotRes.results || [];
  const mappings = mapRes.results || [];
  const students = studentRes.results || [];
  const studentsById = new Map(students.map(row => [String(row.id), row]));
  const mapsByClass = new Map();
  for (const row of mappings) {
    const list = mapsByClass.get(String(row.class_id)) || [];
    list.push(row);
    mapsByClass.set(String(row.class_id), list);
  }
  const slotsByClass = new Map();
  for (const row of slots) {
    const list = slotsByClass.get(String(row.class_id)) || [];
    list.push(row);
    slotsByClass.set(String(row.class_id), list);
  }

  const cells = [];
  const studentRows = [];
  classes.forEach((cls, classIndex) => {
    const classSlots = slotsByClass.get(String(cls.id)) || [];
    const baseSlots = classSlots.length ? classSlots : [{
      id: '',
      class_id: cls.id,
      day_of_week: cls.day_group || cls.schedule_days || '',
      start_time: '',
      end_time: '',
      room_name: '',
      memo: cls.time_label || ''
    }];
    baseSlots.forEach((slot, slotIndex) => {
      const cellId = makeId('ap_tmc');
      const order = classIndex * 100 + slotIndex;
      const assigned = mapsByClass.get(String(cls.id)) || [];
      cells.push({
        id: cellId,
        source_cell_id: slot.id || null,
        source_class_id: cls.id,
        day_label: slot.day_of_week || cls.day_group || cls.schedule_days || '',
        period_label: cls.time_label || slot.start_time || '',
        period_order: order,
        start_time: slot.start_time || '',
        end_time: slot.end_time || '',
        class_name: cls.name || '',
        teacher_id: null,
        teacher_name: cls.teacher_name || '',
        room: slot.room_name || '',
        subject: cls.subject || '',
        grade: cls.grade || '',
        student_count: assigned.length,
        memo: slot.memo || '',
        raw_meta_json: jsonText({ class: cls, slot }),
        sort_order: order
      });
      assigned.forEach((map, studentIndex) => {
        const student = studentsById.get(String(map.student_id)) || {};
        studentRows.push({
          id: makeId('ap_tms'),
          snapshot_cell_id: cellId,
          source_student_id: map.student_id || '',
          source_class_id: cls.id,
          display_name: student.name || '',
          grade: student.grade || cls.grade || '',
          school_name: student.school_name || student.school || '',
          student_status: student.status || '',
          enrollment_date: student.onboarding_started_at || '',
          discharged_at: '',
          raw_meta_json: jsonText({ class_student: map, student }),
          sort_order: order * 1000 + studentIndex
        });
      });
    });
  });
  return { cells, students: studentRows };
}

async function createSnapshot(request, env, teacher, body = {}) {
  if (!isAdminUser(teacher)) return forbidden();
  const monthKey = normalizeMonthKey(body.month_key || body.monthKey);
  const snapshotDate = normalizeSnapshotDate(body.snapshot_date || body.snapshotDate, monthKey);
  const mode = body.mode === 'upsert' ? 'upsert' : 'insert';
  const existing = await env.DB.prepare(`
    SELECT id FROM ap_timetable_month_snapshots
    WHERE month_key = ? AND snapshot_date = ?
    LIMIT 1
  `).bind(monthKey, snapshotDate).first();
  if (existing && mode !== 'upsert') {
    return jsonResponse({ success: false, error: 'snapshot already exists' }, 409);
  }
  if (existing) {
    await env.DB.prepare('DELETE FROM ap_timetable_month_snapshots WHERE id = ?').bind(existing.id).run();
  }

  const snapshotId = makeId('ap_tmsnap');
  const rows = await buildCurrentSnapshotRows(env);
  await env.DB.prepare(`
    INSERT INTO ap_timetable_month_snapshots
      (id, month_key, snapshot_date, title, status, source_type, source_hash, memo, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    snapshotId,
    monthKey,
    snapshotDate,
    body.title || `${monthKey} AP Math timetable`,
    body.source_type || body.sourceType || 'manual',
    await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(rows))).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')),
    body.memo || '',
    teacher?.id || null
  ).run();

  const stmts = [];
  for (const cell of rows.cells) {
    stmts.push(env.DB.prepare(`
      INSERT INTO ap_timetable_month_snapshot_cells
        (id, snapshot_id, source_cell_id, source_class_id, day_label, period_label, period_order, start_time, end_time,
         class_name, teacher_id, teacher_name, room, subject, grade, student_count, memo, raw_meta_json, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      cell.id, snapshotId, cell.source_cell_id, cell.source_class_id, cell.day_label, cell.period_label, cell.period_order,
      cell.start_time, cell.end_time, cell.class_name, cell.teacher_id, cell.teacher_name, cell.room, cell.subject,
      cell.grade, cell.student_count, cell.memo, cell.raw_meta_json, cell.sort_order
    ));
  }
  for (const student of rows.students) {
    stmts.push(env.DB.prepare(`
      INSERT INTO ap_timetable_month_snapshot_students
        (id, snapshot_id, snapshot_cell_id, source_student_id, source_class_id, display_name, grade, school_name,
         student_status, enrollment_date, discharged_at, raw_meta_json, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      student.id, snapshotId, student.snapshot_cell_id, student.source_student_id, student.source_class_id,
      student.display_name, student.grade, student.school_name, student.student_status, student.enrollment_date,
      student.discharged_at, student.raw_meta_json, student.sort_order
    ));
  }
  if (stmts.length) await env.DB.batch(stmts);
  const loaded = await loadSnapshot(env, monthKey);
  return jsonResponse({ success: true, ...loaded, data: loaded });
}

async function compareSnapshots(env, monthKey, compareMonthKey) {
  const current = await loadSnapshot(env, monthKey);
  const previous = await loadSnapshot(env, compareMonthKey);
  if (!current || !previous) return { current, previous, joined: [], left: [], moved: [] };
  return { current, previous, ...buildSnapshotChangeSet(previous, current) };
}

export async function handleTimetableMonths(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const monthKey = path[2] || '';
  const action = path[3] || '';
  if (method === 'GET' && !monthKey) {
    const months = await listSnapshots(env);
    return jsonResponse({ success: true, data: months, months });
  }
  if (method === 'GET' && monthKey && action === 'changes') {
    const compare = normalizeMonthKey(url.searchParams.get('compare'));
    const changes = await compareSnapshots(env, normalizeMonthKey(monthKey), compare);
    return jsonResponse({ success: true, ...changes, data: changes });
  }
  if (method === 'GET' && monthKey && !action) {
    const loaded = await loadSnapshot(env, normalizeMonthKey(monthKey));
    if (!loaded) return jsonResponse({ success: false, error: 'snapshot not found' }, 404);
    return jsonResponse({ success: true, ...loaded, data: loaded });
  }
  if (method === 'POST' && monthKey === 'snapshot') {
    return createSnapshot(request, env, teacher, body);
  }
  return null;
}
