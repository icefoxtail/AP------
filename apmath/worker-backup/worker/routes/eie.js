import { jsonResponse } from '../helpers/response.js';

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

function normalizeImportPayload(body) {
  const session = body?.import_session || {};
  const cells = Array.isArray(body?.timetable_cells) ? body.timetable_cells : [];
  return {
    overwrite: body?.overwrite === true,
    session: {
      id: session.id || makeId('eie_import'),
      file_name: String(session.file_name || body?.file_name || '').trim(),
      sheet_name: String(session.sheet_name || body?.sheet_name || '').trim(),
      source_month: String(session.source_month || body?.source_month || '').trim(),
      status: session.status === 'parsed' ? 'imported' : String(session.status || 'imported'),
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
    day_label: String(cell.day_label || '').trim(),
    period_label: String(cell.period_label || '').trim(),
    period_order: Number.isFinite(Number(cell.period_order)) ? Number(cell.period_order) : null,
    start_time: String(cell.start_time || '').trim(),
    end_time: String(cell.end_time || '').trim(),
    class_name_raw: String(cell.class_name_raw || '').trim(),
    teacher_name_raw: String(cell.teacher_name_raw || '').trim(),
    room_raw: String(cell.room_raw || '').trim(),
    column_index: Number.isFinite(Number(cell.column_index)) ? Number(cell.column_index) : index,
    student_count: Number.isFinite(Number(cell.student_count)) ? Number(cell.student_count) : 0,
    status: cell.status === 'needs_review' ? 'needs_review' : 'imported',
    raw_meta_json: cell.raw_meta_json || null
  };
}

async function queryLatestImport(env) {
  try {
    const row = await env.DB.prepare(`
      SELECT id, file_name, sheet_name, source_month, imported_at, status, raw_meta_json, created_at, updated_at
      FROM eie_import_sessions
      ORDER BY COALESCE(imported_at, created_at) DESC
      LIMIT 1
    `).first();
    return row || null;
  } catch (error) {
    return null;
  }
}

async function queryTimetableCells(env, importId) {
  try {
    const stmt = importId
      ? env.DB.prepare(`
          SELECT *
          FROM eie_timetable_cells
          WHERE import_session_id = ?
          ORDER BY period_order, column_index
        `).bind(importId)
      : env.DB.prepare(`
          SELECT c.*
          FROM eie_timetable_cells c
          JOIN (
            SELECT id
            FROM eie_import_sessions
            ORDER BY COALESCE(imported_at, created_at) DESC
            LIMIT 1
          ) latest ON latest.id = c.import_session_id
          ORDER BY c.period_order, c.column_index
        `);
    const result = await stmt.all();
    return result.results || [];
  } catch (error) {
    return [];
  }
}

async function handleGet(request, env, path) {
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
    const rows = await queryTimetableCells(env, '');
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
        id, import_session_id, day_label, period_label, period_order, start_time, end_time,
        class_name_raw, teacher_name_raw, room_raw, column_index, student_count, status,
        raw_meta_json, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      cell.id,
      cell.import_session_id,
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

export async function handleEie(request, env, teacher, path, url) {
  void teacher;
  void url;
  const method = request.method;

  if (method === 'GET') {
    return handleGet(request, env, path);
  }

  if (method === 'POST' && path[2] === 'import' && !path[3]) {
    return handlePostImport(request, env, teacher);
  }

  return jsonResponse({ success: false, error: 'method not allowed' }, 405);
}
