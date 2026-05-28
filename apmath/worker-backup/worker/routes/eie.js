import { jsonResponse } from '../helpers/response.js';

const MANUAL_IMPORT_SESSION_ID = 'eie_manual_operation';

function stubResponse(data) {
  return jsonResponse({
    success: true,
    stub: true,
    ...data,
    generated_at: new Date().toISOString()
  });
}

function makeId(prefix) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${id}`;
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

function toJsonText(value) {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value); }
  catch (error) { return JSON.stringify({ raw: String(value) }); }
}

function safeText(value) {
  return String(value == null ? '' : value).trim();
}

function safeStatus(value, fallback = 'active') {
  const status = safeText(value || fallback);
  if (['active', 'imported', 'needs_review', 'hidden', 'archived'].includes(status)) return status === 'imported' ? 'active' : status;
  return fallback;
}

function normalizeImportPayload(body) {
  const session = body?.import_session || {};
  const cells = Array.isArray(body?.timetable_cells) ? body.timetable_cells : [];
  return {
    overwrite: body?.overwrite === true,
    session: {
      id: session.id || makeId('eie_import'),
      file_name: safeText(session.file_name || body?.file_name),
      sheet_name: safeText(session.sheet_name || body?.sheet_name),
      source_month: safeText(session.source_month || body?.source_month),
      status: session.status === 'parsed' ? 'imported' : safeText(session.status || 'imported'),
      raw_meta_json: session.raw_meta_json || body?.raw_meta_json || null
    },
    cells
  };
}

function validateImportPayload(payload) {
  if (!payload.session.file_name) return 'file_name is required';
  if (!payload.session.sheet_name) return 'sheet_name is required';
  if (!payload.session.source_month) return 'source_month is required';
  if (!Array.isArray(payload.cells) || payload.cells.length === 0) return 'timetable_cells are required';
  return '';
}

function normalizeCell(cell, importSessionId, index) {
  return {
    id: cell.id || makeId('eie_cell'),
    import_session_id: importSessionId,
    source_type: cell.source_type === 'manual' ? 'manual' : 'import',
    source_import_session_id: cell.source_import_session_id || importSessionId,
    day_label: safeText(cell.day_label),
    period_label: safeText(cell.period_label),
    period_order: Number.isFinite(Number(cell.period_order)) ? Number(cell.period_order) : null,
    start_time: safeText(cell.start_time),
    end_time: safeText(cell.end_time),
    class_name_raw: safeText(cell.class_name_raw),
    teacher_name_raw: safeText(cell.teacher_name_raw),
    room_raw: safeText(cell.room_raw),
    column_index: Number.isFinite(Number(cell.column_index)) ? Number(cell.column_index) : index,
    student_count: Number.isFinite(Number(cell.student_count)) ? Number(cell.student_count) : 0,
    status: cell.status === 'needs_review' ? 'needs_review' : 'active',
    memo: safeText(cell.memo),
    raw_meta_json: cell.raw_meta_json || null
  };
}

function normalizeManualCell(body) {
  return {
    id: body?.id || makeId('eie_cell'),
    import_session_id: MANUAL_IMPORT_SESSION_ID,
    source_type: 'manual',
    source_import_session_id: null,
    day_label: safeText(body?.day_label),
    period_label: safeText(body?.period_label),
    period_order: Number.isFinite(Number(body?.period_order)) ? Number(body.period_order) : periodOrderFromLabel(body?.period_label),
    start_time: safeText(body?.start_time),
    end_time: safeText(body?.end_time),
    class_name_raw: safeText(body?.class_name_raw),
    teacher_name_raw: safeText(body?.teacher_name_raw),
    room_raw: safeText(body?.room_raw),
    column_index: Number.isFinite(Number(body?.column_index)) ? Number(body.column_index) : null,
    student_count: Number.isFinite(Number(body?.student_count)) ? Number(body.student_count) : 0,
    status: safeStatus(body?.status, 'active'),
    memo: safeText(body?.memo),
    raw_meta_json: body?.raw_meta_json || { source_type: 'manual' }
  };
}

function periodOrderFromLabel(value) {
  const match = safeText(value).match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function validateTimetableCell(cell) {
  if (!cell.period_label) return 'period_label is required';
  if (!cell.class_name_raw) return 'class_name_raw is required';
  return '';
}

function isUniqueConflict(error) {
  const text = String(error?.message || error || '').toLowerCase();
  return text.includes('unique') || text.includes('constraint');
}

function uniqueCellConflictResponse() {
  return jsonResponse({
    success: false,
    error: 'duplicate timetable cell',
    message: '같은 요일·교시·컬럼의 수업 셀이 이미 있습니다.'
  }, 409);
}

async function ensureManualImportSession(env) {
  await env.DB.prepare(`
    INSERT OR IGNORE INTO eie_import_sessions (id, file_name, sheet_name, source_month, imported_at, status, raw_meta_json, created_at, updated_at)
    VALUES (?, 'manual', 'manual', 'manual', CURRENT_TIMESTAMP, 'manual', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(MANUAL_IMPORT_SESSION_ID, JSON.stringify({ source_type: 'manual' })).run();
}

async function nextColumnIndex(env, cell) {
  if (Number.isFinite(Number(cell.column_index))) return Number(cell.column_index);
  const row = await env.DB.prepare(`
    SELECT COALESCE(MAX(column_index), 0) + 1 AS next_column_index
    FROM eie_timetable_cells
    WHERE COALESCE(day_label, '') = COALESCE(?, '') AND period_label = ?
  `).bind(cell.day_label, cell.period_label).first();
  return Number(row?.next_column_index || 1);
}

async function queryLatestImport(env) {
  try {
    const row = await env.DB.prepare(`
      SELECT id, file_name, sheet_name, source_month, imported_at, status, raw_meta_json, created_at, updated_at
      FROM eie_import_sessions
      WHERE id != ?
      ORDER BY COALESCE(imported_at, created_at) DESC
      LIMIT 1
    `).bind(MANUAL_IMPORT_SESSION_ID).first();
    return row || null;
  } catch (error) {
    return null;
  }
}

function orderBySql() {
  return `
    CASE COALESCE(day_label, '')
      WHEN '월' THEN 1 WHEN '화' THEN 2 WHEN '수' THEN 3 WHEN '목' THEN 4 WHEN '금' THEN 5 WHEN '토' THEN 6 WHEN '일' THEN 7 ELSE 99 END,
    period_order,
    period_label,
    column_index
  `;
}

function buildStatusFilter(url) {
  const raw = url?.searchParams?.get('status') || 'active,imported,needs_review';
  const statuses = raw.split(',').map(item => safeStatus(item, '')).filter(Boolean);
  return statuses.length ? statuses : ['active', 'imported', 'needs_review'];
}

async function queryTimetableCells(env, importId, options = {}) {
  try {
    if (importId) {
      const result = await env.DB.prepare(`
        SELECT *
        FROM eie_timetable_cells
        WHERE import_session_id = ?
        ORDER BY ${orderBySql()}
      `).bind(importId).all();
      return result.results || [];
    }

    const statuses = options.statuses || ['active', 'imported', 'needs_review'];
    const placeholders = statuses.map(() => '?').join(', ');
    const result = await env.DB.prepare(`
      SELECT *
      FROM eie_timetable_cells
      WHERE status IN (${placeholders})
      ORDER BY ${orderBySql()}
    `).bind(...statuses).all();
    return result.results || [];
  } catch (error) {
    return [];
  }
}

async function getTimetableCell(env, cellId) {
  return env.DB.prepare(`
    SELECT *
    FROM eie_timetable_cells
    WHERE id = ?
    LIMIT 1
  `).bind(cellId).first();
}

async function handleGet(request, env, path, url) {
  const section = path[2] || '';
  const action = path[3] || '';
  const tail = path[4] || '';

  if (section === 'import' && action === 'latest') {
    const latest = await queryLatestImport(env);
    return jsonResponse({
      success: true,
      stub: !latest,
      data: latest,
      latest_import: latest,
      message: latest ? 'EIE latest import loaded.' : 'EIE latest import endpoint is ready. No import_session found.'
    });
  }

  if (section === 'import' && action && !tail) {
    try {
      const row = await env.DB.prepare(`
        SELECT id, file_name, sheet_name, source_month, imported_at, status, raw_meta_json, created_at, updated_at
        FROM eie_import_sessions
        WHERE id = ?
        LIMIT 1
      `).bind(action).first();
      if (!row) return jsonResponse({ success: false, error: 'import not found' }, 404);
      return jsonResponse({ success: true, data: row, import_session: row });
    } catch (error) {
      return jsonResponse({ success: false, error: 'EIE import table is not ready' }, 409);
    }
  }

  if (section === 'import' && action && tail === 'timetable-cells') {
    const rows = await queryTimetableCells(env, action);
    return jsonResponse({ success: true, data: rows, timetable_cells: rows });
  }

  if (section === 'import' && action && tail === 'student-seeds') {
    return stubResponse({ data: [], student_seeds: [], message: 'student seed review is deferred.' });
  }

  if (section === 'import' && action && tail === 'contact-seeds') {
    return stubResponse({ data: [], contact_seeds: [], message: 'contact seed review is deferred.' });
  }

  if (section === 'import' && action && tail === 'needs-review') {
    const rows = (await queryTimetableCells(env, action)).filter(row => row.status === 'needs_review');
    return jsonResponse({ success: true, data: rows, needs_review: rows });
  }

  if (section === 'timetable') {
    const rows = await queryTimetableCells(env, '', { statuses: buildStatusFilter(url) });
    return jsonResponse({ success: true, data: rows, timetable_cells: rows, stub: rows.length === 0 });
  }

  if (section === 'student-seeds') {
    return stubResponse({ data: [], student_seeds: [], message: 'EIE student seed endpoint is reserved for a later round.' });
  }

  if (section === 'contact-seeds') {
    return stubResponse({ data: [], contact_seeds: [], message: 'EIE contact seed endpoint is reserved for a later round.' });
  }

  if (section === 'needs-review') {
    return stubResponse({ data: [], needs_review: [], message: 'EIE needs_review endpoint is reserved for import-specific checks.' });
  }

  return null;
}

async function handlePostImport(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);

  const payload = normalizeImportPayload(body);
  const validationError = validateImportPayload(payload);
  if (validationError) return jsonResponse({ success: false, error: validationError }, 400);

  const existing = await env.DB.prepare(`
    SELECT id, status
    FROM eie_import_sessions
    WHERE sheet_name = ? AND source_month = ?
    LIMIT 1
  `).bind(payload.session.sheet_name, payload.session.source_month).first().catch(error => {
    throw new Error('EIE import tables are not ready. Apply the Round 2 import-core migration first.');
  });

  const importId = existing?.id || payload.session.id;
  if (existing && !payload.overwrite) {
    return jsonResponse({
      success: false,
      error: 'duplicate import_session',
      message: 'same sheet_name and source_month already exists',
      import_session_id: existing.id
    }, 409);
  }

  if (existing && payload.overwrite) {
    await env.DB.prepare(`
      DELETE FROM eie_timetable_cells
      WHERE import_session_id = ? AND status != 'confirmed'
    `).bind(importId).run();
    await env.DB.prepare(`
      UPDATE eie_import_sessions
      SET file_name = ?, imported_at = CURRENT_TIMESTAMP, status = ?, raw_meta_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      payload.session.file_name,
      payload.session.status,
      toJsonText(payload.session.raw_meta_json),
      importId
    ).run();
  } else {
    await env.DB.prepare(`
      INSERT INTO eie_import_sessions (id, file_name, sheet_name, source_month, imported_at, status, raw_meta_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      importId,
      payload.session.file_name,
      payload.session.sheet_name,
      payload.session.source_month,
      payload.session.status,
      toJsonText(payload.session.raw_meta_json)
    ).run();
  }

  const normalizedCells = payload.cells.map((cell, index) => normalizeCell(cell, importId, index));
  for (const cell of normalizedCells) {
    await env.DB.prepare(`
      INSERT INTO eie_timetable_cells (
        id, import_session_id, source_type, source_import_session_id, day_label, period_label, period_order, start_time, end_time,
        class_name_raw, teacher_name_raw, room_raw, column_index, student_count, status, memo,
        raw_meta_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      cell.id,
      cell.import_session_id,
      cell.source_type,
      cell.source_import_session_id,
      cell.day_label,
      cell.period_label,
      cell.period_order,
      cell.start_time,
      cell.end_time,
      cell.class_name_raw,
      cell.teacher_name_raw,
      cell.room_raw,
      cell.column_index,
      cell.student_count,
      cell.status,
      cell.memo,
      toJsonText(cell.raw_meta_json)
    ).run();
  }

  return jsonResponse({
    success: true,
    data: {
      id: importId,
      file_name: payload.session.file_name,
      sheet_name: payload.session.sheet_name,
      source_month: payload.session.source_month,
      status: payload.session.status
    },
    latest_import: {
      id: importId,
      file_name: payload.session.file_name,
      sheet_name: payload.session.sheet_name,
      source_month: payload.session.source_month,
      status: payload.session.status
    },
    timetable_cells: normalizedCells,
    inserted_timetable_cell_count: normalizedCells.length,
    message: 'EIE import_session and timetable_cells saved. Student/contact/classroom data was not created.'
  });
}

async function handlePostTimetableCell(request, env) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const cell = normalizeManualCell(body);
  const validationError = validateTimetableCell(cell);
  if (validationError) return jsonResponse({ success: false, error: validationError }, 400);
  await ensureManualImportSession(env);
  cell.column_index = await nextColumnIndex(env, cell);
  try {
    await env.DB.prepare(`
      INSERT INTO eie_timetable_cells (
        id, import_session_id, source_type, source_import_session_id, day_label, period_label, period_order, start_time, end_time,
        class_name_raw, teacher_name_raw, room_raw, column_index, student_count, status, memo,
        raw_meta_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      cell.id,
      cell.import_session_id,
      cell.source_type,
      cell.source_import_session_id,
      cell.day_label,
      cell.period_label,
      cell.period_order,
      cell.start_time,
      cell.end_time,
      cell.class_name_raw,
      cell.teacher_name_raw,
      cell.room_raw,
      cell.column_index,
      cell.student_count,
      cell.status,
      cell.memo,
      toJsonText(cell.raw_meta_json)
    ).run();
  } catch (error) {
    if (isUniqueConflict(error)) return uniqueCellConflictResponse();
    throw error;
  }
  const saved = await getTimetableCell(env, cell.id);
  return jsonResponse({ success: true, data: saved, timetable_cell: saved });
}

async function handlePatchTimetableCell(request, env, cellId, statusOnly = false) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const existing = await getTimetableCell(env, cellId);
  if (!existing) return jsonResponse({ success: false, error: 'timetable cell not found' }, 404);

  if (statusOnly) {
    const status = safeStatus(body.status, existing.status || 'active');
    await env.DB.prepare(`
      UPDATE eie_timetable_cells
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(status, cellId).run();
  } else {
    const next = {
      day_label: body.day_label == null ? existing.day_label : safeText(body.day_label),
      period_label: body.period_label == null ? existing.period_label : safeText(body.period_label),
      period_order: body.period_order != null
        ? Number(body.period_order)
        : body.period_label != null
          ? (periodOrderFromLabel(body.period_label) ?? existing.period_order)
          : existing.period_order,
      start_time: body.start_time == null ? existing.start_time : safeText(body.start_time),
      end_time: body.end_time == null ? existing.end_time : safeText(body.end_time),
      class_name_raw: body.class_name_raw == null ? existing.class_name_raw : safeText(body.class_name_raw),
      teacher_name_raw: body.teacher_name_raw == null ? existing.teacher_name_raw : safeText(body.teacher_name_raw),
      room_raw: body.room_raw == null ? existing.room_raw : safeText(body.room_raw),
      student_count: body.student_count == null ? existing.student_count : Number(body.student_count || 0),
      status: body.status == null ? safeStatus(existing.status, 'active') : safeStatus(body.status, 'active'),
      memo: body.memo == null ? existing.memo : safeText(body.memo)
    };
    const validationError = validateTimetableCell(next);
    if (validationError) return jsonResponse({ success: false, error: validationError }, 400);
    try {
      await env.DB.prepare(`
        UPDATE eie_timetable_cells
        SET day_label = ?, period_label = ?, period_order = ?, start_time = ?, end_time = ?,
            class_name_raw = ?, teacher_name_raw = ?, room_raw = ?, student_count = ?, status = ?, memo = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        next.day_label,
        next.period_label,
        next.period_order,
        next.start_time,
        next.end_time,
        next.class_name_raw,
        next.teacher_name_raw,
        next.room_raw,
        next.student_count,
        next.status,
        next.memo,
        cellId
      ).run();
    } catch (error) {
      if (isUniqueConflict(error)) return uniqueCellConflictResponse();
      throw error;
    }
  }

  const saved = await getTimetableCell(env, cellId);
  return jsonResponse({ success: true, data: saved, timetable_cell: saved });
}

export async function handleEie(request, env, teacher, path, url) {
  void teacher;
  const method = request.method;

  if (method === 'GET') {
    return handleGet(request, env, path, url);
  }

  if (method === 'POST' && path[2] === 'import' && !path[3]) {
    return handlePostImport(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'timetable-cells' && !path[3]) {
    return handlePostTimetableCell(request, env);
  }

  if (method === 'PATCH' && path[2] === 'timetable-cells' && path[3] && !path[4]) {
    return handlePatchTimetableCell(request, env, path[3], false);
  }

  if (method === 'PATCH' && path[2] === 'timetable-cells' && path[3] && path[4] === 'status') {
    return handlePatchTimetableCell(request, env, path[3], true);
  }

  return jsonResponse({ success: false, error: 'method not allowed' }, 405);
}
