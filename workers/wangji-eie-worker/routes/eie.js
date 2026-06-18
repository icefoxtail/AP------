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

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
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

function normalizeEieGrade(value) {
  const raw = safeText(value).replace(/\s+/g, '');
  const aliases = {
    초1: '초1', 초등1: '초1', 초등1학년: '초1', 초등학교1: '초1', 초등학교1학년: '초1',
    초2: '초2', 초등2: '초2', 초등2학년: '초2', 초등학교2: '초2', 초등학교2학년: '초2',
    초3: '초3', 초등3: '초3', 초등3학년: '초3', 초등학교3: '초3', 초등학교3학년: '초3',
    초4: '초4', 초등4: '초4', 초등4학년: '초4', 초등학교4: '초4', 초등학교4학년: '초4',
    초5: '초5', 초등5: '초5', 초등5학년: '초5', 초등학교5: '초5', 초등학교5학년: '초5',
    초6: '초6', 초등6: '초6', 초등6학년: '초6', 초등학교6: '초6', 초등학교6학년: '초6',
    중1: '중1', 중학교1: '중1', 중학교1학년: '중1', 중등1: '중1', 중등1학년: '중1',
    중2: '중2', 중학교2: '중2', 중학교2학년: '중2', 중등2: '중2', 중등2학년: '중2',
    중3: '중3', 중학교3: '중3', 중학교3학년: '중3', 중등3: '중3', 중등3학년: '중3',
    고1: '고1', 고등1: '고1', 고등1학년: '고1', 고등학교1: '고1', 고등학교1학년: '고1',
    고2: '고2', 고등2: '고2', 고등2학년: '고2', 고등학교2: '고2', 고등학교2학년: '고2',
    고3: '고3', 고등3: '고3', 고등3학년: '고3', 고등학교3: '고3', 고등학교3학년: '고3'
  };
  if (aliases[raw]) return aliases[raw];
  const elementary = raw.match(/^초(?:등|등학교)?([1-6])(?:학년)?$/);
  if (elementary) return `초${elementary[1]}`;
  const middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
  if (middle) return `중${middle[1]}`;
  const high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
  if (high) return `고${high[1]}`;
  return '';
}

const EIE_EXAM_CATEGORIES = new Set(['month_end', 'vocab', 'grammar', 'material', 'reading', 'listening', 'free']);

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
  const teacherNames = normalizeTeacherNames(body?.teacher_names || body?.teachers || body?.teacher_name);
  const rawMeta = parseRawMeta(body?.raw_meta_json);
  if (teacherNames.length) rawMeta.teacher_names = teacherNames;
  if (!rawMeta.source_type) rawMeta.source_type = 'manual';
  const rawLane = Number(body?.slot_lane);
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
    teacher_name_raw: safeText(body?.teacher_name_raw) || teacherNames[0] || '',
    room_raw: safeText(body?.room_raw),
    column_index: Number.isFinite(Number(body?.column_index)) ? Number(body.column_index) : null,
    student_count: Number.isFinite(Number(body?.student_count)) ? Number(body.student_count) : 0,
    status: safeStatus(body?.status, 'active'),
    memo: safeText(body?.memo),
    raw_meta_json: rawMeta,
    slot_lane: (Number.isFinite(rawLane) && rawLane >= 1 && rawLane <= 2) ? rawLane : 1
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

async function checkSlotLaneDuplicate(env, cell) {
  try {
    const row = await env.DB.prepare(`
      SELECT id FROM eie_timetable_cells
      WHERE import_session_id = ?
        AND COALESCE(day_label, '') = COALESCE(?, '')
        AND period_label = ?
        AND column_index = ?
        AND slot_lane = ?
      LIMIT 1
    `).bind(cell.import_session_id, cell.day_label, cell.period_label, cell.column_index, cell.slot_lane).first();
    return row || null;
  } catch (error) {
    return null;
  }
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
      return await attachCellTeachers(env, result.results || []);
    }

    const statuses = options.statuses || ['active', 'imported', 'needs_review'];
    const placeholders = statuses.map(() => '?').join(', ');
    const result = await env.DB.prepare(`
      SELECT *
      FROM eie_timetable_cells
      WHERE status IN (${placeholders})
      ORDER BY ${orderBySql()}
    `).bind(...statuses).all();
    return await attachCellTeachers(env, result.results || []);
  } catch (error) {
    if (isEieBaseTableMissing(error)) return [];
    throw error;
  }
}

async function getTimetableCell(env, cellId) {
  const cell = await env.DB.prepare(`
    SELECT *
    FROM eie_timetable_cells
    WHERE id = ?
    LIMIT 1
  `).bind(cellId).first();
  if (!cell) return null;
  const rows = await attachCellTeachers(env, [cell]);
  return rows[0] || cell;
}

async function attachCellTeachers(env, rows) {
  const cells = Array.isArray(rows) ? rows : [];
  const ids = cells.map(row => safeText(row.id)).filter(Boolean);
  if (!ids.length) return cells;
  try {
    const placeholders = ids.map(() => '?').join(', ');
    const result = await env.DB.prepare(`
      SELECT timetable_cell_id, teacher_name, sort_order
      FROM eie_timetable_cell_teachers
      WHERE timetable_cell_id IN (${placeholders})
      ORDER BY sort_order ASC, teacher_name ASC
    `).bind(...ids).all();
    const byCell = new Map();
    for (const row of (result.results || [])) {
      const list = byCell.get(row.timetable_cell_id) || [];
      list.push(safeText(row.teacher_name));
      byCell.set(row.timetable_cell_id, list);
    }
    return cells.map(cell => {
      const teacherNames = normalizeTeacherNames(byCell.get(cell.id) || parseRawMeta(cell.raw_meta_json).teacher_names || cell.teacher_name_raw);
      return { ...cell, teacher_names: teacherNames };
    });
  } catch (error) {
    if (isRound6TableMissing(error)) {
      return cells.map(cell => ({
        ...cell,
        teacher_names: normalizeTeacherNames(parseRawMeta(cell.raw_meta_json).teacher_names || cell.teacher_name_raw)
      }));
    }
    throw error;
  }
}


function parseRawMeta(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try { return JSON.parse(value); }
  catch (error) { return {}; }
}

function normalizeName(value) {
  return safeText(value).replace(/\s+/g, '');
}

function normalizePhone(value) {
  return safeText(value).replace(/[^\d]/g, '');
}

function flagsOf(value) {
  return Array.isArray(value) ? value.filter(Boolean).map(item => safeText(item)).filter(Boolean) : [];
}

function uniqueFlags(flags) {
  return Array.from(new Set(flagsOf(flags)));
}

function withCellContext(candidate, cell, index) {
  const flags = uniqueFlags(candidate.flags);
  const normalizedName = candidate.normalized_name || normalizeName(candidate.name || candidate.student_name_raw);
  const normalizedPhone = candidate.normalized_phone || normalizePhone(candidate.phone_raw);
  if (!normalizedPhone && !flags.includes('missing_phone')) flags.push('missing_phone');
  if (flags.length && !flags.includes('needs_review')) flags.push('needs_review');
  return {
    id: `${cell.id || 'cell'}_${index}`,
    candidate_index: index,
    import_session_id: cell.import_session_id || '',
    cell_id: cell.id || '',
    source_type: cell.source_type || 'import',
    day_label: cell.day_label || '',
    period_label: cell.period_label || '',
    period_order: cell.period_order,
    start_time: cell.start_time || '',
    end_time: cell.end_time || '',
    class_name_raw: cell.class_name_raw || '',
    teacher_name_raw: cell.teacher_name_raw || '',
    column_index: cell.column_index,
    student_name_raw: candidate.student_name_raw || candidate.name || '',
    name: candidate.name || candidate.student_name_raw || '',
    normalized_name: normalizedName,
    grade_raw: candidate.grade_raw || '',
    phone_raw: candidate.phone_raw || '',
    normalized_phone: normalizedPhone,
    memo_raw: candidate.memo_raw || '',
    source_row: candidate.source_row || parseRawMeta(cell.raw_meta_json).source_row || '',
    source_col: candidate.source_col || parseRawMeta(cell.raw_meta_json).source_col || '',
    cell_context: candidate.cell_context || [cell.day_label, cell.period_label, cell.class_name_raw].filter(Boolean).join(' '),
    match_status: candidate.match_status || (flags.includes('needs_review') ? 'needs_review' : 'candidate'),
    flags
  };
}

function extractStudentCandidatesFromCell(cell) {
  const meta = parseRawMeta(cell.raw_meta_json);
  const rawCandidates = Array.isArray(meta.student_candidates) ? meta.student_candidates : [];
  if (rawCandidates.length) return rawCandidates.map((candidate, index) => withCellContext(candidate || {}, cell, index));

  const names = Array.isArray(meta.student_names) ? meta.student_names : [];
  return names.map((name, index) => withCellContext({
    student_name_raw: safeText(name),
    name: safeText(name),
    normalized_name: normalizeName(name),
    match_status: 'needs_review',
    flags: ['needs_review']
  }, cell, index)).filter(row => row.normalized_name);
}

function markDuplicatePhonesAsNamesake(rows) {
  const counts = new Map();
  for (const row of rows) {
    if (!row.normalized_phone) continue;
    counts.set(row.normalized_phone, (counts.get(row.normalized_phone) || 0) + 1);
  }
  return rows.map(row => {
    const flags = uniqueFlags(row.flags);
    if (row.normalized_phone && counts.get(row.normalized_phone) > 1 && !flags.includes('duplicate_name')) flags.push('duplicate_name');
    if (flags.length && !flags.includes('needs_review')) flags.push('needs_review');
    return {
      ...row,
      flags,
      match_status: flags.includes('needs_review') ? 'needs_review' : (row.match_status || 'candidate')
    };
  });
}

function buildStudentSeedRows(cells) {
  return markDuplicatePhonesAsNamesake((cells || []).flatMap(extractStudentCandidatesFromCell));
}

function buildContactSeedRows(cells) {
  return buildStudentSeedRows(cells)
    .filter(row => row.normalized_phone)
    .map(row => ({
      id: `${row.id}_contact`,
      import_session_id: row.import_session_id,
      cell_id: row.cell_id,
      day_label: row.day_label,
      period_label: row.period_label,
      period_order: row.period_order,
      start_time: row.start_time,
      end_time: row.end_time,
      class_name_raw: row.class_name_raw,
      teacher_name_raw: row.teacher_name_raw,
      column_index: row.column_index,
      student_name_raw: row.student_name_raw,
      name: row.name,
      normalized_name: row.normalized_name,
      phone_raw: row.phone_raw,
      normalized_phone: row.normalized_phone,
      source_row: row.source_row,
      source_col: row.source_col,
      cell_context: row.cell_context,
      match_status: row.match_status,
      flags: row.flags
    }));
}

function buildNeedsReviewRows(cells) {
  const seedRows = buildStudentSeedRows(cells).filter(row => row.flags.includes('needs_review') || row.match_status === 'needs_review');
  const timetableRows = (cells || []).filter(row => row.status === 'needs_review').map(row => ({
    id: row.id,
    cell_id: row.id,
    import_session_id: row.import_session_id || '',
    day_label: row.day_label || '',
    period_label: row.period_label || '',
    start_time: row.start_time || '',
    end_time: row.end_time || '',
    class_name_raw: row.class_name_raw || '',
    teacher_name_raw: row.teacher_name_raw || '',
    match_status: 'needs_review',
    flags: uniqueFlags(['needs_review', ...(parseRawMeta(row.raw_meta_json).needs_review_reasons || [])]),
    memo_raw: row.memo || '',
    cell_context: [row.day_label, row.period_label, row.class_name_raw].filter(Boolean).join(' ')
  }));
  return [...timetableRows, ...seedRows];
}


function isRound6TableMissing(error) {
  const text = String(error?.message || error || '').toLowerCase();
  return text.includes('no such table') || text.includes('eie_students') || text.includes('eie_student_contacts') || text.includes('eie_student_schedule_assignments') || text.includes('eie_student_teachers') || text.includes('eie_timetable_cell_teachers');
}

function isEieBaseTableMissing(error) {
  const text = String(error?.message || error || '').toLowerCase();
  return text.includes('no such table') && (
    text.includes('eie_import_sessions') ||
    text.includes('eie_timetable_cells')
  );
}

function isEieOwner(teacher) {
  return String(teacher?.role || '').toLowerCase() === 'admin';
}

function requireEieOwner(teacher) {
  if (isEieOwner(teacher)) return null;
  return jsonResponse({ success: false, error: 'EIE management is owner only' }, 403);
}

function round6MigrationRequiredResponse() {
  return jsonResponse({
    success: false,
    error: 'EIE Round 6 migration is required',
    message: 'EIE 학생·연락처·수업배정 확정 테이블을 먼저 적용해야 합니다.'
  }, 409);
}

function normalizeConfirmedStatus(value, fallback = 'active') {
  const status = safeText(value || fallback);
  if (['active', 'needs_review', 'inactive', 'archived'].includes(status)) return status;
  return fallback;
}

const DIRECT_STUDENT_STATUSES = ['active', 'inactive', 'archived', 'needs_review', 'withdrawn'];

function normalizeDirectStudentStatus(value, fallback = 'active') {
  const status = safeText(value || '');
  if (DIRECT_STUDENT_STATUSES.includes(status)) return status;
  return fallback;
}

function candidateDisplayName(candidate) {
  return safeText(candidate?.name || candidate?.student_name_raw || candidate?.studentName || '');
}

function pickCandidateByKey(candidates, key) {
  const rows = Array.isArray(candidates) ? candidates : [];
  const raw = key == null ? '' : String(key);
  const index = Number(raw);
  if (Number.isInteger(index) && index >= 0 && rows[index]) return rows[index];
  return rows.find(row => String(row?.normalized_name || row?.name || row?.student_name_raw || '') === raw) || null;
}

async function findConfirmedStudent(env, candidate) {
  const normalizedName = normalizeName(candidateDisplayName(candidate));
  const normalizedPhone = normalizePhone(candidate?.normalized_phone || candidate?.phone_raw);

  if (!normalizedName || !normalizedPhone) return null;

  const row = await env.DB.prepare(`
    SELECT s.*
    FROM eie_students s
    JOIN eie_student_contacts c ON c.student_id = s.id
    WHERE s.normalized_name = ?
      AND c.normalized_phone = ?
      AND COALESCE(s.status, 'active') != 'archived'
    ORDER BY s.created_at ASC
    LIMIT 1
  `).bind(normalizedName, normalizedPhone).first();

  return row || null;
}

async function createConfirmedStudent(env, candidate, teacher) {
  const id = makeId('eie_student');
  const displayName = candidateDisplayName(candidate);
  const normalizedName = normalizeName(displayName);
  await env.DB.prepare(`
    INSERT INTO eie_students
    (id, display_name, normalized_name, grade, status, source_type, source_import_session_id, source_cell_id, memo, raw_meta_json, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    id,
    displayName,
    normalizedName,
    normalizeEieGrade(candidate?.grade || candidate?.grade_raw),
    normalizeConfirmedStatus(candidate?.flags?.includes('needs_review') ? 'needs_review' : 'active'),
    candidate?.source_type || 'candidate',
    candidate?.import_session_id || '',
    candidate?.cell_id || '',
    safeText(candidate?.memo_raw),
    toJsonText(candidate),
    teacher?.id || null
  ).run();
  return env.DB.prepare('SELECT * FROM eie_students WHERE id = ?').bind(id).first();
}

async function ensureConfirmedContact(env, studentId, candidate, teacher) {
  const normalizedPhone = normalizePhone(candidate?.normalized_phone || candidate?.phone_raw);
  if (!normalizedPhone) return null;
  const existing = await env.DB.prepare(`
    SELECT *
    FROM eie_student_contacts
    WHERE student_id = ? AND normalized_phone = ?
    LIMIT 1
  `).bind(studentId, normalizedPhone).first();
  if (existing) return existing;
  const id = makeId('eie_contact');
  await env.DB.prepare(`
    INSERT INTO eie_student_contacts
    (id, student_id, phone, normalized_phone, contact_label, is_primary, source_type, source_import_session_id, source_cell_id, memo, raw_meta_json, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    id,
    studentId,
    safeText(candidate?.phone_raw || candidate?.normalized_phone),
    normalizedPhone,
    safeText(candidate?.contact_label || '대표'),
    candidate?.source_type || 'candidate',
    candidate?.import_session_id || '',
    candidate?.cell_id || '',
    safeText(candidate?.memo_raw),
    toJsonText(candidate),
    teacher?.id || null
  ).run();
  return env.DB.prepare('SELECT * FROM eie_student_contacts WHERE id = ?').bind(id).first();
}

async function ensureScheduleAssignment(env, studentId, candidate, teacher) {
  const cellId = safeText(candidate?.cell_id);
  if (!cellId) return null;
  const existing = await env.DB.prepare(`
    SELECT *
    FROM eie_student_schedule_assignments
    WHERE student_id = ? AND timetable_cell_id = ?
    LIMIT 1
  `).bind(studentId, cellId).first();
  if (existing) return existing;
  const id = makeId('eie_assign');
  await env.DB.prepare(`
    INSERT INTO eie_student_schedule_assignments
    (id, student_id, timetable_cell_id, status, source_type, source_import_session_id, memo, raw_meta_json, created_by, created_at, updated_at)
    VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    id,
    studentId,
    cellId,
    candidate?.source_type || 'candidate',
    candidate?.import_session_id || '',
    safeText(candidate?.memo_raw),
    toJsonText(candidate),
    teacher?.id || null
  ).run();
  return env.DB.prepare('SELECT * FROM eie_student_schedule_assignments WHERE id = ?').bind(id).first();
}

async function findExistingCandidateConfirmation(env, cell, candidateIndex) {
  const meta = parseRawMeta(cell?.raw_meta_json);
  const confirmed = Array.isArray(meta.confirmed_student_candidates) ? meta.confirmed_student_candidates : [];
  const row = confirmed.find(item => String(item?.candidate_index) === String(candidateIndex));
  if (!row) return null;

  const studentId = safeText(row.student_id);
  if (!studentId) {
    return { incomplete: true, reason: 'confirmed metadata has no student_id' };
  }

  const student = await env.DB.prepare('SELECT * FROM eie_students WHERE id = ? LIMIT 1').bind(studentId).first();
  if (!student) {
    return { incomplete: true, reason: 'confirmed student not found', student_id: studentId };
  }

  const contactId = safeText(row.contact_id);
  const assignmentId = safeText(row.assignment_id);
  const contact = contactId
    ? await env.DB.prepare('SELECT * FROM eie_student_contacts WHERE id = ? LIMIT 1').bind(contactId).first()
    : null;
  const assignment = assignmentId
    ? await env.DB.prepare('SELECT * FROM eie_student_schedule_assignments WHERE id = ? LIMIT 1').bind(assignmentId).first()
    : await env.DB.prepare(`
        SELECT *
        FROM eie_student_schedule_assignments
        WHERE student_id = ? AND timetable_cell_id = ?
        LIMIT 1
      `).bind(studentId, cell.id).first();

  return {
    student,
    contact: contact || null,
    assignment: assignment || null,
    created_student: false,
    already_confirmed: true,
    confirmed_at: row.confirmed_at || ''
  };
}

function buildConfirmedMeta(cell, candidate, result) {
  const meta = parseRawMeta(cell.raw_meta_json);
  const confirmed = Array.isArray(meta.confirmed_student_candidates) ? meta.confirmed_student_candidates : [];
  const row = {
    candidate_index: candidate?.candidate_index,
    student_id: result?.student?.id || '',
    contact_id: result?.contact?.id || '',
    assignment_id: result?.assignment?.id || '',
    confirmed_at: new Date().toISOString()
  };
  const nextConfirmed = confirmed.filter(item => String(item?.candidate_index) !== String(row.candidate_index));
  nextConfirmed.push(row);
  return {
    ...meta,
    confirmed_student_candidates: nextConfirmed
  };
}

async function markCandidateConfirmed(env, cell, candidate, result) {
  const nextMeta = buildConfirmedMeta(cell, candidate, result);
  await env.DB.prepare(`
    UPDATE eie_timetable_cells
    SET raw_meta_json = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(toJsonText(nextMeta), cell.id).run();
}

async function queryConfirmedStudents(env) {
  // 1. 학생 목록 (counts 포함, 이름 ASC 정렬)
  const studentsResult = await env.DB.prepare(`
    SELECT s.*
    FROM eie_students s
    ORDER BY s.display_name ASC, s.created_at ASC
  `).all();
  const students = await attachStudentTeachers(env, studentsResult.results || []);
  if (!students.length) return students;

  // 2. 연락처 전체 (is_primary DESC, created_at ASC)
  let contactRows = [];
  try {
    const contactsResult = await env.DB.prepare(`
      SELECT id, student_id, phone, normalized_phone, contact_label, is_primary, created_at
      FROM eie_student_contacts
      ORDER BY COALESCE(is_primary, 1) DESC, created_at ASC
    `).all();
    contactRows = contactsResult.results || [];
  } catch (error) {
    contactRows = [];
  }

  // 3. 수업 배정 전체 (timetable cell 정보 포함)
  let assignmentRows = [];
  try {
    const assignmentsResult = await env.DB.prepare(`
      SELECT a.id AS assignment_id, a.student_id, a.timetable_cell_id,
             COALESCE(a.status, 'active') AS status,
             t.class_name_raw, t.teacher_name_raw, t.period_label,
             t.period_order, t.start_time, t.end_time, t.day_label, t.column_index
      FROM eie_student_schedule_assignments a
      LEFT JOIN eie_timetable_cells t ON t.id = a.timetable_cell_id
      WHERE COALESCE(a.status, 'active') != 'archived'
      ORDER BY COALESCE(t.period_order, 999) ASC, COALESCE(t.column_index, 999) ASC, a.created_at ASC
    `).all();
    assignmentRows = assignmentsResult.results || [];
  } catch (error) {
    assignmentRows = [];
  }

  // 4. student_id별 그룹핑
  const contactsByStudent = new Map();
  for (const c of contactRows) {
    const list = contactsByStudent.get(c.student_id) || [];
    list.push(c);
    contactsByStudent.set(c.student_id, list);
  }
  const assignmentsByStudent = new Map();
  for (const a of assignmentRows) {
    const list = assignmentsByStudent.get(a.student_id) || [];
    list.push(a);
    assignmentsByStudent.set(a.student_id, list);
  }

  // 5. 학생 row에 phone/contacts/assignments 첨부
  return students.map(s => {
    const cts = contactsByStudent.get(s.id) || [];
    const assignmentList = assignmentsByStudent.get(s.id) || [];
    const primary = cts[0] || null;
    const phoneRaw = primary ? safeText(primary.phone) : '';
    const normPhone = primary ? safeText(primary.normalized_phone) : '';
    return {
      ...s,
      phone_raw: phoneRaw,
      phone: phoneRaw,
      normalized_phone: normPhone,
      primary_phone: phoneRaw,
      teacher_names: Array.isArray(s.teacher_names) ? s.teacher_names : normalizeTeacherNames(s.teacher_names),
      contact_count: cts.length,
      assignment_count: assignmentList.length,
      contacts: cts.map(c => ({
        id: c.id,
        phone: safeText(c.phone),
        phone_raw: safeText(c.phone),
        normalized_phone: safeText(c.normalized_phone),
        contact_label: safeText(c.contact_label) || '대표',
        is_primary: c.is_primary != null ? c.is_primary : 1
      })),
      assignments: assignmentList.map(a => ({
        assignment_id: a.assignment_id,
        timetable_cell_id: a.timetable_cell_id,
        class_name_raw: safeText(a.class_name_raw),
        teacher_name_raw: safeText(a.teacher_name_raw),
        period_label: safeText(a.period_label),
        start_time: safeText(a.start_time),
        end_time: safeText(a.end_time),
        day_label: safeText(a.day_label),
        status: safeText(a.status)
      }))
    };
  });
}

async function queryConfirmedContacts(env) {
  const result = await env.DB.prepare(`
    SELECT c.*, s.display_name, s.normalized_name, s.grade
    FROM eie_student_contacts c
    LEFT JOIN eie_students s ON s.id = c.student_id
    ORDER BY c.updated_at DESC, c.created_at DESC
  `).all();
  return result.results || [];
}

async function queryStudentContacts(env, studentId) {
  const result = await env.DB.prepare(`
    SELECT id, student_id, phone, normalized_phone, contact_label, is_primary, memo, raw_meta_json, created_at, updated_at
    FROM eie_student_contacts
    WHERE student_id = ?
    ORDER BY COALESCE(is_primary, 0) DESC, updated_at DESC, created_at ASC
  `).bind(studentId).all();
  return result.results || [];
}

async function getStudentContact(env, contactId) {
  return env.DB.prepare(`
    SELECT id, student_id, phone, normalized_phone, contact_label, is_primary, memo, raw_meta_json, created_at, updated_at
    FROM eie_student_contacts
    WHERE id = ?
    LIMIT 1
  `).bind(contactId).first();
}

async function handleGetStudentContacts(env, studentId) {
  const student = await getStudentById(env, studentId);
  if (!student) return jsonResponse({ success: false, error: 'student not found' }, 404);
  const contacts = await queryStudentContacts(env, studentId);
  return jsonResponse({ success: true, data: contacts, contacts });
}

async function handlePostStudentContact(request, env, teacher, studentId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const student = await getStudentById(env, studentId);
  if (!student) return jsonResponse({ success: false, error: 'student not found' }, 404);

  const phone = safeText(body.phone || body.phone_raw);
  const normalizedPhone = normalizePhone(phone);
  if (!phone || !normalizedPhone) return jsonResponse({ success: false, error: 'phone is required' }, 400);

  const existing = await env.DB.prepare(`
    SELECT id, student_id, phone, normalized_phone, contact_label, is_primary, memo, raw_meta_json, created_at, updated_at
    FROM eie_student_contacts
    WHERE student_id = ? AND normalized_phone = ?
    LIMIT 1
  `).bind(studentId, normalizedPhone).first();
  if (existing) return jsonResponse({ success: true, data: existing, contact: existing, duplicate_ignored: true });

  const isPrimary = body.is_primary === true || body.is_primary === 1 || body.is_primary === '1';
  if (isPrimary) {
    await env.DB.prepare('UPDATE eie_student_contacts SET is_primary = 0, updated_at = CURRENT_TIMESTAMP WHERE student_id = ?')
      .bind(studentId).run();
  }

  const id = makeId('eie_contact');
  await env.DB.prepare(`
    INSERT INTO eie_student_contacts
    (id, student_id, phone, normalized_phone, contact_label, is_primary, source_type, memo, raw_meta_json, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, 'manual', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    id,
    studentId,
    phone,
    normalizedPhone,
    safeText(body.contact_label || body.relation || '연락처'),
    isPrimary ? 1 : 0,
    safeText(body.memo),
    toJsonText({ relation: safeText(body.relation), source: 'student-management' }),
    teacher?.id || null
  ).run();
  const contact = await getStudentContact(env, id);
  return jsonResponse({ success: true, data: contact, contact, contacts: await queryStudentContacts(env, studentId) });
}

async function handlePatchStudentContact(request, env, contactId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const existing = await getStudentContact(env, contactId);
  if (!existing) return jsonResponse({ success: false, error: 'contact not found' }, 404);

  const sets = [];
  const binds = [];
  if (body.phone !== undefined || body.phone_raw !== undefined) {
    const phone = safeText(body.phone || body.phone_raw);
    const normalizedPhone = normalizePhone(phone);
    if (!phone || !normalizedPhone) return jsonResponse({ success: false, error: 'phone is required' }, 400);
    sets.push('phone = ?', 'normalized_phone = ?');
    binds.push(phone, normalizedPhone);
  }
  if (body.contact_label !== undefined || body.relation !== undefined) {
    sets.push('contact_label = ?');
    binds.push(safeText(body.contact_label || body.relation));
  }
  if (body.memo !== undefined) {
    sets.push('memo = ?');
    binds.push(safeText(body.memo));
  }
  if (body.is_primary !== undefined) {
    const isPrimary = body.is_primary === true || body.is_primary === 1 || body.is_primary === '1';
    if (isPrimary) {
      await env.DB.prepare('UPDATE eie_student_contacts SET is_primary = 0, updated_at = CURRENT_TIMESTAMP WHERE student_id = ? AND id != ?')
        .bind(existing.student_id, contactId).run();
    }
    sets.push('is_primary = ?');
    binds.push(isPrimary ? 1 : 0);
  }

  if (!sets.length) return jsonResponse({ success: false, error: 'no fields to update' }, 400);
  sets.push('updated_at = CURRENT_TIMESTAMP');
  binds.push(contactId);
  try {
    await env.DB.prepare(`UPDATE eie_student_contacts SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run();
  } catch (error) {
    if (isUniqueConflict(error)) return jsonResponse({ success: false, error: 'duplicate contact phone' }, 409);
    throw error;
  }
  const contact = await getStudentContact(env, contactId);
  return jsonResponse({ success: true, data: contact, contact, contacts: await queryStudentContacts(env, contact.student_id) });
}

function contactDeleteDeferredResponse() {
  return jsonResponse({
    success: false,
    error: 'contact archive is not available',
    code: 'EIE_NOT_IMPLEMENTED',
    message: 'eie_student_contacts has no status/deleted_at column; physical delete is disabled.'
  }, 409);
}

async function queryConsultations(env, studentId) {
  if (studentId) {
    const result = await env.DB.prepare(`
      SELECT id, student_id, date, type, content, next_action, created_at
      FROM consultations
      WHERE student_id = ?
      ORDER BY date DESC, created_at DESC
    `).bind(studentId).all();
    return result.results || [];
  }
  const result = await env.DB.prepare(`
    SELECT id, student_id, date, type, content, next_action, created_at
    FROM consultations
    ORDER BY date DESC, created_at DESC
  `).all();
  return result.results || [];
}

async function getConsultation(env, id) {
  return env.DB.prepare(`
    SELECT id, student_id, date, type, content, next_action, created_at
    FROM consultations
    WHERE id = ?
    LIMIT 1
  `).bind(id).first();
}

async function handleGetConsultations(env, url) {
  const studentId = safeText(url.searchParams.get('student_id'));
  const rows = await queryConsultations(env, studentId || null);
  return jsonResponse({ success: true, data: rows, consultations: rows });
}

function parseEieExamPayloadJson(value) {
  if (value == null || value === '') return { ok: true, value: null };
  if (typeof value === 'string') {
    try {
      JSON.parse(value);
      return { ok: true, value };
    } catch (error) {
      return { ok: false, error: 'payload_json must be valid JSON' };
    }
  }
  try {
    return { ok: true, value: JSON.stringify(value) };
  } catch (error) {
    return { ok: false, error: 'payload_json must be valid JSON' };
  }
}

function parseEieExamPayloadObject(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (error) {
    return {};
  }
}

function eieExamLogicalMeta(row) {
  const payloadMeta = parseEieExamPayloadObject(row?.payload_json || row?.payloadJson);
  const rawMeta = parseEieExamPayloadObject(row?.raw_meta_json || row?.rawMetaJson);
  const monthFromDate = safeText(row?.exam_date || row?.examDate).slice(0, 7);
  return {
    class_id: safeText(payloadMeta.class_id || rawMeta.class_id || row?.class_id || row?.classId || row?.timetable_cell_id || row?.cell_id || row?.cellId),
    month_key: safeText(payloadMeta.month_key || rawMeta.month_key || row?.month_key || row?.monthKey || monthFromDate),
    test_id: safeText(payloadMeta.test_id || rawMeta.test_id || row?.test_id || row?.column_id || row?.columnId || row?.category),
    payloadMeta
  };
}

function normalizeEieExamCategory(value) {
  const category = safeText(value);
  return EIE_EXAM_CATEGORIES.has(category) ? category : '';
}

function nullableNumber(value) {
  if (value == null || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeEieExamRecordInput(body, defaults = {}) {
  const studentId = safeText(body?.student_id || body?.studentId || defaults.student_id || defaults.studentId);
  const category = normalizeEieExamCategory(body?.category || defaults.category);
  const examDate = safeText(body?.exam_date || body?.examDate || defaults.exam_date || defaults.examDate);
  const payload = parseEieExamPayloadJson(
    body?.payload_json !== undefined ? body.payload_json
      : body?.payloadJson !== undefined ? body.payloadJson
        : defaults.payload_json !== undefined ? defaults.payload_json
          : defaults.payloadJson
  );
  if (!studentId) return { error: 'student_id is required' };
  if (!category) return { error: 'category is invalid' };
  if (!examDate) return { error: 'exam_date is required' };
  if (!payload.ok) return { error: payload.error };
  return {
    student_id: studentId,
    timetable_cell_id: safeText(body?.timetable_cell_id || body?.cell_id || body?.cellId || defaults.timetable_cell_id || defaults.cell_id || defaults.cellId) || null,
    exam_date: examDate,
    category,
    title: safeText(body?.title || defaults.title) || null,
    score: nullableNumber(body?.score),
    max_score: nullableNumber(body?.max_score !== undefined ? body.max_score : body?.maxScore !== undefined ? body.maxScore : defaults.max_score !== undefined ? defaults.max_score : defaults.maxScore),
    level: safeText(body?.level || defaults.level) || null,
    memo: safeText(body?.memo || defaults.memo) || null,
    payload_json: payload.value,
    status: safeStatus(body?.status || defaults.status || 'active'),
  };
}

async function queryEieExamRecords(env, filters = {}) {
  const where = ["COALESCE(status, 'active') = 'active'"];
  const binds = [];
  const studentId = safeText(filters.student_id || filters.studentId);
  const cellId = safeText(filters.timetable_cell_id || filters.cell_id || filters.cellId);
  const month = safeText(filters.month);
  const category = normalizeEieExamCategory(filters.category);
  if (studentId) { where.push('student_id = ?'); binds.push(studentId); }
  if (cellId) { where.push('timetable_cell_id = ?'); binds.push(cellId); }
  if (category) { where.push('category = ?'); binds.push(category); }
  if (/^\d{4}-\d{2}$/.test(month)) {
    where.push('exam_date >= ? AND exam_date <= ?');
    binds.push(`${month}-01`, `${month}-31`);
  }
  const result = await env.DB.prepare(`
    SELECT *
    FROM eie_exam_records
    WHERE ${where.join(' AND ')}
    ORDER BY exam_date DESC, updated_at DESC
  `).bind(...binds).all();
  return result.results || [];
}

async function handleGetEieExamRecords(env, url) {
  try {
    const rows = await queryEieExamRecords(env, {
      student_id: url.searchParams.get('student_id'),
      timetable_cell_id: url.searchParams.get('timetable_cell_id') || url.searchParams.get('cell_id'),
      month: url.searchParams.get('month'),
      category: url.searchParams.get('category')
    });
    return jsonResponse({ success: true, data: rows, exam_records: rows });
  } catch (error) {
    return jsonResponse({ success: false, error: 'eie_exam_records table is not ready', code: 'EIE_EXAM_RECORDS_NOT_READY' }, 409);
  }
}

function insertEieExamRecordStatement(env, item, teacherId) {
  const id = item.id || makeId('eie_exam');
  item.id = id;
  return env.DB.prepare(`
    INSERT INTO eie_exam_records
      (id, student_id, timetable_cell_id, exam_date, category, title, score, max_score, level, memo, payload_json, status, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(
    id,
    item.student_id,
    item.timetable_cell_id,
    item.exam_date,
    item.category,
    item.title,
    item.score,
    item.max_score,
    item.level,
    item.memo,
    item.payload_json,
    item.status || 'active',
    teacherId || null
  );
}

async function handlePostEieExamRecord(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const item = normalizeEieExamRecordInput(body);
  if (item.error) return jsonResponse({ success: false, error: item.error }, 400);
  await insertEieExamRecordStatement(env, item, teacher?.id).run();
  const rows = await queryEieExamRecords(env, { student_id: item.student_id });
  const record = rows.find(row => String(row.id) === String(item.id)) || rows[0] || null;
  return jsonResponse({ success: true, data: record, exam_record: record, exam_records: rows });
}

async function handlePatchEieExamRecord(request, env, recordId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const existing = await env.DB.prepare("SELECT * FROM eie_exam_records WHERE id = ? AND COALESCE(status, 'active') = 'active' LIMIT 1").bind(recordId).first();
  if (!existing) return jsonResponse({ success: false, error: 'exam record not found' }, 404);
  const item = normalizeEieExamRecordInput({ ...existing, ...body }, existing);
  if (item.error) return jsonResponse({ success: false, error: item.error }, 400);
  await env.DB.prepare(`
    UPDATE eie_exam_records
    SET student_id = ?, timetable_cell_id = ?, exam_date = ?, category = ?, title = ?, score = ?,
        max_score = ?, level = ?, memo = ?, payload_json = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    item.student_id,
    item.timetable_cell_id,
    item.exam_date,
    item.category,
    item.title,
    item.score,
    item.max_score,
    item.level,
    item.memo,
    item.payload_json,
    item.status || 'active',
    recordId
  ).run();
  const record = await env.DB.prepare('SELECT * FROM eie_exam_records WHERE id = ? LIMIT 1').bind(recordId).first();
  const rows = await queryEieExamRecords(env, { student_id: record.student_id });
  return jsonResponse({ success: true, data: record, exam_record: record, exam_records: rows });
}

async function handleDeleteEieExamRecord(env, recordId) {
  const existing = await env.DB.prepare("SELECT * FROM eie_exam_records WHERE id = ? AND COALESCE(status, 'active') = 'active' LIMIT 1").bind(recordId).first();
  if (!existing) return jsonResponse({ success: false, error: 'exam record not found' }, 404);
  await env.DB.prepare("UPDATE eie_exam_records SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(recordId).run();
  const rows = await queryEieExamRecords(env, { student_id: existing.student_id });
  return jsonResponse({ success: true, archived: true, data: null, exam_record: null, exam_records: rows });
}

async function handleBatchEieExamRecords(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const records = Array.isArray(body.records) ? body.records : Array.isArray(body.students) ? body.students : [];
  if (!records.length) return jsonResponse({ success: false, error: 'records are required' }, 400);
  const defaults = {
    timetable_cell_id: body.timetable_cell_id || body.cell_id || body.cellId,
    exam_date: body.exam_date || body.examDate,
    category: body.category,
    title: body.title,
    max_score: body.max_score !== undefined ? body.max_score : body.maxScore,
    payload_json: body.payload_json !== undefined ? body.payload_json : body.payloadJson
  };
  const items = [];
  for (const row of records) {
    const item = normalizeEieExamRecordInput(row, defaults);
    if (item.error) return jsonResponse({ success: false, error: item.error }, 400);
    items.push(item);
  }
  const statements = [];
  for (const item of items) {
    const existing = await findExistingEieExamRecord(env, item);
    if (existing?.id) {
      statements.push(env.DB.prepare(`
        UPDATE eie_exam_records
        SET exam_date = ?, category = ?, title = ?, score = ?, max_score = ?, level = ?,
            memo = ?, payload_json = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        item.exam_date,
        item.category,
        item.title,
        item.score,
        item.max_score,
        item.level,
        item.memo,
        item.payload_json,
        item.status || 'active',
        existing.id
      ));
    } else {
      statements.push(insertEieExamRecordStatement(env, item, teacher?.id));
    }
  }
  await env.DB.batch(statements);
  const rows = await queryEieExamRecords(env, {
    timetable_cell_id: defaults.timetable_cell_id,
    month: safeText(defaults.exam_date).slice(0, 7),
    category: defaults.category
  });
  return jsonResponse({ success: true, data: rows, exam_records: rows, saved_count: items.length });
}

async function findExistingEieExamRecord(env, item) {
  const target = eieExamLogicalMeta(item);
  const month = target.month_key || safeText(item.exam_date).slice(0, 7);
  const start = month ? `${month}-01` : safeText(item.exam_date).slice(0, 10);
  const end = month ? `${month}-31` : safeText(item.exam_date).slice(0, 10);
  const result = await env.DB.prepare(`
    SELECT *
    FROM eie_exam_records
    WHERE student_id = ?
      AND COALESCE(status, 'active') = 'active'
      AND exam_date >= ? AND exam_date <= ?
      AND (timetable_cell_id = ? OR timetable_cell_id IS NULL OR timetable_cell_id = '')
    ORDER BY updated_at DESC
  `).bind(item.student_id, start, end, item.timetable_cell_id || '').all();
  return (result.results || []).find(row => {
    const rowMeta = eieExamLogicalMeta(row);
    const rowClass = safeText(rowMeta.class_id);
    const targetClass = safeText(target.class_id);
    const sameClass = !targetClass || rowClass === targetClass || safeText(row.timetable_cell_id) === targetClass;
    return sameClass
      && rowMeta.month_key === month
      && rowMeta.test_id === target.test_id;
  }) || null;
}

function normalizeEieSchoolGradeRecordInput(body, defaults = {}) {
  const studentId = safeText(body?.student_id || body?.studentId || defaults.student_id || defaults.studentId);
  const examYear = Number(body?.exam_year || body?.examYear || defaults.exam_year || defaults.examYear);
  const semester = safeText(body?.semester || defaults.semester);
  const examType = safeText(body?.exam_type || body?.examType || defaults.exam_type || defaults.examType);
  if (!studentId) return { error: 'student_id is required' };
  if (!Number.isFinite(examYear)) return { error: 'exam_year is required' };
  if (!semester) return { error: 'semester is required' };
  if (!examType) return { error: 'exam_type is required' };
  return {
    student_id: studentId,
    class_id: safeText(body?.class_id || body?.classId || defaults.class_id || defaults.classId) || null,
    teacher_id: safeText(body?.teacher_id || body?.teacherId || defaults.teacher_id || defaults.teacherId) || null,
    school_name: safeText(body?.school_name || body?.schoolName || defaults.school_name || defaults.schoolName) || null,
    grade_level: safeText(body?.grade_level || body?.gradeLevel || defaults.grade_level || defaults.gradeLevel) || null,
    exam_year: examYear,
    semester,
    exam_type: examType,
    subject: safeText(body?.subject || defaults.subject || 'english') || 'english',
    score: nullableNumber(body?.score),
    max_score: nullableNumber(body?.max_score !== undefined ? body.max_score : body?.maxScore !== undefined ? body.maxScore : defaults.max_score !== undefined ? defaults.max_score : defaults.maxScore),
    achievement: safeText(body?.achievement || defaults.achievement) || null,
    memo: safeText(body?.memo || defaults.memo) || null,
    status: safeStatus(body?.status || defaults.status || 'active')
  };
}

async function queryEieSchoolGradeRecords(env, filters = {}) {
  const where = ["COALESCE(status, 'active') = 'active'"];
  const binds = [];
  const studentId = safeText(filters.student_id || filters.studentId);
  const classId = safeText(filters.class_id || filters.classId);
  const teacherId = safeText(filters.teacher_id || filters.teacherId);
  const examYear = safeText(filters.exam_year || filters.examYear);
  if (studentId) { where.push('student_id = ?'); binds.push(studentId); }
  if (classId) { where.push('class_id = ?'); binds.push(classId); }
  if (teacherId) { where.push('teacher_id = ?'); binds.push(teacherId); }
  if (examYear) { where.push('exam_year = ?'); binds.push(Number(examYear)); }
  const result = await env.DB.prepare(`
    SELECT *
    FROM eie_school_grade_records
    WHERE ${where.join(' AND ')}
    ORDER BY exam_year DESC, student_id ASC, semester ASC, exam_type ASC
  `).bind(...binds).all();
  return result.results || [];
}

async function handleGetEieSchoolGradeRecords(env, url) {
  try {
    const rows = await queryEieSchoolGradeRecords(env, {
      student_id: url.searchParams.get('student_id'),
      class_id: url.searchParams.get('class_id'),
      teacher_id: url.searchParams.get('teacher_id'),
      exam_year: url.searchParams.get('exam_year')
    });
    return jsonResponse({ success: true, data: rows, school_grade_records: rows });
  } catch (error) {
    return jsonResponse({ success: false, error: 'eie_school_grade_records table is not ready', code: 'EIE_SCHOOL_GRADE_RECORDS_NOT_READY' }, 409);
  }
}

async function handleBatchEieSchoolGradeRecords(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const records = Array.isArray(body.records) ? body.records : [];
  if (!records.length) return jsonResponse({ success: false, error: 'records are required' }, 400);
  const defaults = {
    exam_year: body.exam_year || body.examYear,
    semester: body.semester,
    exam_type: body.exam_type || body.examType,
    subject: body.subject || 'english',
    class_id: body.class_id || body.classId,
    teacher_id: body.teacher_id || body.teacherId
  };
  const items = [];
  for (const row of records) {
    const item = normalizeEieSchoolGradeRecordInput(row, defaults);
    if (item.error) return jsonResponse({ success: false, error: item.error }, 400);
    items.push(item);
  }
  const statements = items.map(item => env.DB.prepare(`
    INSERT INTO eie_school_grade_records
      (id, student_id, class_id, teacher_id, school_name, grade_level, exam_year, semester, exam_type, subject, score, max_score, achievement, memo, status, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(student_id, exam_year, semester, exam_type, subject) DO UPDATE SET
      class_id = excluded.class_id,
      teacher_id = excluded.teacher_id,
      school_name = excluded.school_name,
      grade_level = excluded.grade_level,
      score = excluded.score,
      max_score = excluded.max_score,
      achievement = excluded.achievement,
      memo = excluded.memo,
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    makeId('eie_school_grade'),
    item.student_id,
    item.class_id,
    item.teacher_id,
    item.school_name,
    item.grade_level,
    item.exam_year,
    item.semester,
    item.exam_type,
    item.subject,
    item.score,
    item.max_score,
    item.achievement,
    item.memo,
    item.status || 'active',
    teacher?.id || null
  ));
  await env.DB.batch(statements);
  const rows = await queryEieSchoolGradeRecords(env, { class_id: defaults.class_id, exam_year: defaults.exam_year });
  return jsonResponse({ success: true, data: rows, school_grade_records: rows, saved_count: items.length });
}

async function handlePatchEieSchoolGradeRecord(request, env, recordId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const existing = await env.DB.prepare("SELECT * FROM eie_school_grade_records WHERE id = ? AND COALESCE(status, 'active') = 'active' LIMIT 1").bind(recordId).first();
  if (!existing) return jsonResponse({ success: false, error: 'school grade record not found' }, 404);
  const item = normalizeEieSchoolGradeRecordInput({ ...existing, ...body }, existing);
  if (item.error) return jsonResponse({ success: false, error: item.error }, 400);
  await env.DB.prepare(`
    UPDATE eie_school_grade_records
    SET class_id = ?, teacher_id = ?, school_name = ?, grade_level = ?, exam_year = ?, semester = ?,
        exam_type = ?, subject = ?, score = ?, max_score = ?, achievement = ?, memo = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    item.class_id, item.teacher_id, item.school_name, item.grade_level, item.exam_year, item.semester,
    item.exam_type, item.subject, item.score, item.max_score, item.achievement, item.memo, item.status, recordId
  ).run();
  const row = await env.DB.prepare('SELECT * FROM eie_school_grade_records WHERE id = ? LIMIT 1').bind(recordId).first();
  return jsonResponse({ success: true, data: row, school_grade_record: row });
}

async function handleDeleteEieSchoolGradeRecord(env, recordId) {
  const existing = await env.DB.prepare("SELECT * FROM eie_school_grade_records WHERE id = ? AND COALESCE(status, 'active') = 'active' LIMIT 1").bind(recordId).first();
  if (!existing) return jsonResponse({ success: false, error: 'school grade record not found' }, 404);
  await env.DB.prepare("UPDATE eie_school_grade_records SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(recordId).run();
  return jsonResponse({ success: true, archived: true, data: null, school_grade_record: null });
}

async function queryEieGradeSheets(env, filters = {}) {
  const where = ["COALESCE(status, 'active') = 'active'"];
  const binds = [];
  const classId = safeText(filters.class_id || filters.classId);
  const teacherId = safeText(filters.teacher_id || filters.teacherId);
  const monthKey = safeText(filters.month_key || filters.monthKey);
  const sheetType = safeText(filters.sheet_type || filters.sheetType);
  if (classId) { where.push('class_id = ?'); binds.push(classId); }
  if (teacherId) { where.push('teacher_id = ?'); binds.push(teacherId); }
  if (monthKey) { where.push('month_key = ?'); binds.push(monthKey); }
  if (sheetType) { where.push('sheet_type = ?'); binds.push(sheetType); }
  const result = await env.DB.prepare(`
    SELECT *
    FROM eie_grade_sheets
    WHERE ${where.join(' AND ')}
    ORDER BY month_key DESC, updated_at DESC
  `).bind(...binds).all();
  return result.results || [];
}

async function handleGetEieGradeSheets(env, url) {
  try {
    const rows = await queryEieGradeSheets(env, {
      class_id: url.searchParams.get('class_id'),
      teacher_id: url.searchParams.get('teacher_id'),
      month_key: url.searchParams.get('month_key'),
      sheet_type: url.searchParams.get('sheet_type')
    });
    return jsonResponse({ success: true, data: rows, grade_sheets: rows });
  } catch (error) {
    return jsonResponse({ success: false, error: 'eie_grade_sheets table is not ready', code: 'EIE_GRADE_SHEETS_NOT_READY' }, 409);
  }
}

async function handleSaveEieGradeSheet(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const classId = safeText(body.class_id || body.classId);
  const monthKey = safeText(body.month_key || body.monthKey);
  const sheetType = safeText(body.sheet_type || body.sheetType || 'academy') || 'academy';
  if (!classId) return jsonResponse({ success: false, error: 'class_id is required' }, 400);
  if (!/^\d{4}-\d{2}$/.test(monthKey)) return jsonResponse({ success: false, error: 'month_key is required' }, 400);
  const items = Array.isArray(body.tests) ? body.tests : Array.isArray(body.items) ? body.items : [];
  const id = makeId('eie_grade_sheet');
  await env.DB.prepare(`
    INSERT INTO eie_grade_sheets
      (id, teacher_id, class_id, month_key, sheet_type, title, columns_json, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(class_id, month_key, sheet_type) DO UPDATE SET
      teacher_id = excluded.teacher_id,
      title = excluded.title,
      columns_json = excluded.columns_json,
      status = excluded.status,
      updated_at = CURRENT_TIMESTAMP
  `).bind(
    id,
    safeText(body.teacher_id || body.teacherId) || teacher?.id || null,
    classId,
    monthKey,
    sheetType,
    safeText(body.title || '원내평가') || '원내평가',
    toJsonText(items),
    safeStatus(body.status || 'active')
  ).run();
  const rows = await queryEieGradeSheets(env, { class_id: classId, month_key: monthKey, sheet_type: sheetType });
  return jsonResponse({ success: true, data: rows[0] || null, grade_sheet: rows[0] || null, grade_sheets: rows });
}

async function handlePostConsultation(request, env) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const studentId = safeText(body.student_id);
  const content = safeText(body.content);
  if (!studentId) return jsonResponse({ success: false, error: 'student_id is required' }, 400);
  if (!content) return jsonResponse({ success: false, error: 'content is required' }, 400);
  const id = makeId('eie_cns');
  await env.DB.prepare(`
    INSERT INTO consultations (id, student_id, date, type, content, next_action, created_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    id,
    studentId,
    safeText(body.date) || new Date().toISOString().slice(0, 10),
    safeText(body.type || '상담'),
    content,
    safeText(body.next_action)
  ).run();
  const consultation = await getConsultation(env, id);
  return jsonResponse({ success: true, data: consultation, consultation, consultations: await queryConsultations(env, studentId) });
}

async function handlePatchConsultation(request, env, id) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const existing = await getConsultation(env, id);
  if (!existing) return jsonResponse({ success: false, error: 'consultation not found' }, 404);
  const sets = [];
  const binds = [];
  if (body.date !== undefined) { sets.push('date = ?'); binds.push(safeText(body.date)); }
  if (body.type !== undefined) { sets.push('type = ?'); binds.push(safeText(body.type)); }
  if (body.content !== undefined) {
    const content = safeText(body.content);
    if (!content) return jsonResponse({ success: false, error: 'content is required' }, 400);
    sets.push('content = ?');
    binds.push(content);
  }
  if (body.next_action !== undefined) { sets.push('next_action = ?'); binds.push(safeText(body.next_action)); }
  if (!sets.length) return jsonResponse({ success: false, error: 'no fields to update' }, 400);
  binds.push(id);
  await env.DB.prepare(`UPDATE consultations SET ${sets.join(', ')} WHERE id = ?`).bind(...binds).run();
  const consultation = await getConsultation(env, id);
  return jsonResponse({ success: true, data: consultation, consultation, consultations: await queryConsultations(env, consultation.student_id) });
}

async function handleDeleteConsultation(env, id) {
  const existing = await getConsultation(env, id);
  if (!existing) return jsonResponse({ success: false, error: 'consultation not found' }, 404);
  await env.DB.prepare('DELETE FROM consultations WHERE id = ?').bind(id).run();
  return jsonResponse({
    success: true,
    deleted: true,
    id,
    data: null,
    consultation: null,
    consultations: await queryConsultations(env, existing.student_id)
  });
}

// Attendance status vocabulary is Korean across worker/frontend/API:
//   '등원' = present(○), '결석' = absent(×), '' = blank(공란/no mark).
// Auxiliary marks live in `tags`: '상담'(★), '보강'(■), '지각'(▲).
function normalizeAttendanceStatus(value) {
  const status = safeText(value);
  if (status === '') return '';
  if (['등원', '결석', '수업 없음', '지각', '조퇴', '보강', '미정'].includes(status)) return status;
  if (/^(blank|none|empty|공란|빈값)$/i.test(status)) return '';
  if (/absent|missing/i.test(status)) return '결석';
  if (/late/i.test(status)) return '지각';
  if (/present|attended|done/i.test(status)) return '등원';
  return status;
}

const EIE_ATTENDANCE_TAGS = ['상담', '보강', '지각'];

function normalizeAttendanceTags(value) {
  const list = Array.isArray(value)
    ? value
    : safeText(value).split(',');
  const seen = new Set();
  const out = [];
  list.map(item => safeText(item)).forEach(tag => {
    let key = tag;
    if (/^counsel/i.test(tag) || tag === '상담') key = '상담';
    else if (/^makeup|make-up/i.test(tag) || tag === '보강') key = '보강';
    else if (/^late|tardy/i.test(tag) || tag === '지각') key = '지각';
    if (EIE_ATTENDANCE_TAGS.includes(key) && !seen.has(key)) {
      seen.add(key);
      out.push(key);
    }
  });
  return out.join(',');
}

async function queryAttendanceRecords(env, filters = {}) {
  const studentId = safeText(filters.student_id || filters.studentId);
  const date = safeText(filters.date);
  const cellId = safeText(filters.timetable_cell_id || filters.cell_id || filters.cellId);
  const month = safeText(filters.month);
  const where = [];
  const binds = [];
  if (studentId) { where.push('student_id = ?'); binds.push(studentId); }
  if (date) { where.push('date = ?'); binds.push(date); }
  if (cellId) { where.push('timetable_cell_id = ?'); binds.push(cellId); }
  if (!date && /^\d{4}-\d{2}$/.test(month)) {
    where.push('date >= ? AND date <= ?');
    binds.push(`${month}-01`, `${month}-31`);
  }
  const sql = `
    SELECT *
    FROM eie_attendance_records
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY date DESC, updated_at DESC
  `;
  const result = await env.DB.prepare(sql).bind(...binds).all();
  return result.results || [];
}

async function handleGetAttendanceRecords(env, url) {
  const records = await queryAttendanceRecords(env, {
    student_id: url.searchParams.get('student_id'),
    date: url.searchParams.get('date'),
    month: url.searchParams.get('month'),
    timetable_cell_id: url.searchParams.get('timetable_cell_id') || url.searchParams.get('cell_id')
  });
  return jsonResponse({ success: true, data: records, attendance: records, attendance_records: records });
}

// Look up by (student_id, date, timetable_cell_id) so the same student can hold
// independent records for every class they attend on a given day.
async function findAttendanceRecordId(env, studentId, date, cellId) {
  const row = cellId
    ? await env.DB.prepare(`
        SELECT id FROM eie_attendance_records
        WHERE student_id = ? AND date = ? AND timetable_cell_id = ? LIMIT 1
      `).bind(studentId, date, cellId).first()
    : await env.DB.prepare(`
        SELECT id FROM eie_attendance_records
        WHERE student_id = ? AND date = ? AND timetable_cell_id IS NULL LIMIT 1
      `).bind(studentId, date).first();
  return row?.id || '';
}

function upsertAttendanceStatement(env, { id, studentId, cellId, date, status, tags, memo, rawMeta, createdBy }) {
  return env.DB.prepare(`
    INSERT INTO eie_attendance_records
      (id, student_id, timetable_cell_id, date, status, tags, memo, raw_meta_json, created_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(student_id, date, timetable_cell_id) DO UPDATE SET
      status = excluded.status,
      tags = excluded.tags,
      memo = excluded.memo,
      raw_meta_json = excluded.raw_meta_json,
      updated_at = CURRENT_TIMESTAMP
  `).bind(id, studentId, cellId || null, date, status, tags, memo, rawMeta, createdBy || null);
}

// 학생별 출석 저장(실제 입력 단위). 저장 단위는 date + timetable_cell_id + student_id.
// 공란(상태/태그 모두 없음)이면 해당 학생의 그 수업·날짜 레코드를 삭제해 표시를 없앤다.
// 셀(수업) 전체 학생에 같은 값을 일괄 적용하는 구조는 쓰지 않는다.
async function handlePostAttendanceRecord(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const studentId = safeText(body.student_id || body.studentId);
  if (!studentId) return jsonResponse({ success: false, error: 'student_id is required' }, 400);
  const date = safeText(body.date) || new Date().toISOString().slice(0, 10);
  const cellId = safeText(body.timetable_cell_id || body.cell_id || body.cellId);
  // 출석은 반드시 수업(셀) 단위로 기록한다. student_id + date 만으로는 저장 금지.
  if (!cellId) return jsonResponse({ success: false, error: 'timetable_cell_id is required' }, 400);
  const status = normalizeAttendanceStatus(body.status);
  const tags = (status === '결석' || status === '수업 없음') ? '' : normalizeAttendanceTags(body.tags);
  const memo = safeText(body.memo);
  const rawMeta = toJsonText(body.raw_meta_json || body.raw_meta || null);
  const isBlank = status === '' && tags === '';

  const existingId = await findAttendanceRecordId(env, studentId, date, cellId);

  if (isBlank) {
    if (existingId) {
      await env.DB.prepare('DELETE FROM eie_attendance_records WHERE id = ?').bind(existingId).run();
    }
    const records = await queryAttendanceRecords(env, { student_id: studentId });
    return jsonResponse({ success: true, deleted: true, data: null, attendance_record: null, attendance_records: records, attendance: records });
  }

  const id = existingId || makeId('eie_att');
  await upsertAttendanceStatement(env, {
    id, studentId, cellId, date, status, tags, memo, rawMeta, createdBy: teacher?.id
  }).run();

  const record = await env.DB.prepare('SELECT * FROM eie_attendance_records WHERE id = ?').bind(id).first();
  const records = await queryAttendanceRecords(env, { student_id: studentId });
  return jsonResponse({ success: true, data: record, attendance_record: record, attendance_records: records, attendance: records });
}

async function queryScheduleAssignments(env) {
  const result = await env.DB.prepare(`
    SELECT a.*, s.display_name, s.normalized_name, s.grade,
           t.day_label, t.period_label, t.start_time, t.end_time, t.class_name_raw, t.teacher_name_raw, t.room_raw
    FROM eie_student_schedule_assignments a
    LEFT JOIN eie_students s ON s.id = a.student_id
    LEFT JOIN eie_timetable_cells t ON t.id = a.timetable_cell_id
    WHERE COALESCE(a.status, 'active') != 'archived'
    ORDER BY t.day_label, t.period_order, t.column_index, s.display_name
  `).all();
  return result.results || [];
}

async function handlePostConfirmCandidate(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const cellId = safeText(body.cell_id || body.timetable_cell_id);
  if (!cellId) return jsonResponse({ success: false, error: 'cell_id is required' }, 400);
  const cell = await getTimetableCell(env, cellId);
  if (!cell) return jsonResponse({ success: false, error: 'timetable cell not found' }, 404);

  const candidates = extractStudentCandidatesFromCell(cell);
  const selected = pickCandidateByKey(candidates, body.candidate_index ?? body.candidate_key ?? 0);
  if (!selected) return jsonResponse({ success: false, error: 'student candidate not found' }, 404);

  const candidateIndex = Number.isInteger(Number(selected.candidate_index))
    ? Number(selected.candidate_index)
    : Number(body.candidate_index ?? 0);
  const candidate = withCellContext(selected, cell, candidateIndex);
  if (!candidateDisplayName(candidate)) return jsonResponse({ success: false, error: 'student name is required' }, 400);

  try {
    const existingConfirmation = await findExistingCandidateConfirmation(env, cell, candidateIndex);
    if (existingConfirmation?.incomplete) {
      return jsonResponse({
        success: false,
        error: 'candidate is already confirmed but its target record is incomplete',
        detail: existingConfirmation.reason || '',
        student_id: existingConfirmation.student_id || ''
      }, 409);
    }
    if (existingConfirmation) {
      return jsonResponse({
        success: true,
        data: existingConfirmation,
        confirmed: existingConfirmation,
        already_confirmed: true,
        message: '이미 확정된 EIE 학생 후보입니다.'
      });
    }

    let student = await findConfirmedStudent(env, candidate);
    const createdStudent = !student;
    if (!student) student = await createConfirmedStudent(env, candidate, teacher);
    const contact = await ensureConfirmedContact(env, student.id, candidate, teacher);
    const assignment = await ensureScheduleAssignment(env, student.id, candidate, teacher);
    const result = { student, contact, assignment, created_student: createdStudent, already_confirmed: false };
    await markCandidateConfirmed(env, cell, candidate, result);
    return jsonResponse({
      success: true,
      data: result,
      confirmed: result,
      message: 'EIE 학생·연락처·수업배정을 확정했습니다.'
    });
  } catch (error) {
    if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
    throw error;
  }
}

async function queryCandidateCells(env, importId) {
  if (importId) return queryTimetableCells(env, importId);
  return queryTimetableCells(env, '', { statuses: ['active', 'imported', 'needs_review', 'hidden', 'archived'] });
}


function parseAssignmentCandidateIndex(row) {
  const meta = parseRawMeta(row?.assignment_raw_meta_json);
  const index = Number(meta?.candidate_index);
  return Number.isInteger(index) && index >= 0 ? index : null;
}

function assignedStudentSortKey(student) {
  const index = Number(student?.candidate_index);
  if (Number.isInteger(index) && index >= 0) return index;
  return 9999;
}

async function attachAssignedStudents(env, rows) {
  const timetableRows = Array.isArray(rows) ? rows : [];
  if (!timetableRows.length) return timetableRows;

  const cellIds = timetableRows.map(row => safeText(row.id)).filter(Boolean);
  if (!cellIds.length) return timetableRows;

  try {
    const placeholders = cellIds.map(() => '?').join(', ');
    const result = await env.DB.prepare(`
      SELECT a.timetable_cell_id,
             a.id AS assignment_id,
             a.status AS assignment_status,
             a.source_type AS assignment_source_type,
             a.source_import_session_id AS assignment_source_import_session_id,
             a.memo AS assignment_memo,
             a.raw_meta_json AS assignment_raw_meta_json,
             s.id AS student_id,
             s.display_name,
             s.normalized_name,
             s.grade,
             s.school_name,
             s.student_phone,
             s.parent_phone,
             s.guardian_relation,
             s.student_address,
             s.vehicle_info,
             s.student_pin,
             s.student_type,
             s.status AS student_status,
             s.withdrawn_at,
             s.raw_meta_json AS student_raw_meta_json,
             c.id AS contact_id,
             c.phone,
             c.normalized_phone,
             c.contact_label
      FROM eie_student_schedule_assignments a
      JOIN eie_students s ON s.id = a.student_id
      LEFT JOIN eie_student_contacts c ON c.student_id = s.id AND COALESCE(c.is_primary, 1) = 1
      WHERE COALESCE(a.status, 'active') != 'archived'
        AND (
          COALESCE(s.status, 'active') NOT IN ('inactive', 'archived', 'withdrawn', 'left', '퇴원')
          OR (s.withdrawn_at IS NOT NULL AND DATE(s.withdrawn_at) >= DATE('now', '+9 hours', '-2 months'))
        )
        AND a.timetable_cell_id IN (${placeholders})
      ORDER BY a.created_at ASC, s.display_name ASC, c.created_at ASC
    `).bind(...cellIds).all();

    const byCell = new Map();
    for (const row of (result.results || [])) {
      const list = byCell.get(row.timetable_cell_id) || [];
      if (!list.some(item => item.assignment_id === row.assignment_id)) {
        const assignmentMeta = parseRawMeta(row.assignment_raw_meta_json);
        const studentMeta = parseRawMeta(row.student_raw_meta_json);
        const candidateIndex = parseAssignmentCandidateIndex(row);
        list.push({
          source_kind: 'assigned',
          id: row.assignment_id || row.student_id,
          assignment_id: row.assignment_id,
          assignment_status: row.assignment_status || 'active',
          student_id: row.student_id,
          name: row.display_name || '',
          display_name: row.display_name || '',
          student_name_raw: assignmentMeta.student_name_raw || row.display_name || '',
          normalized_name: row.normalized_name || '',
          grade_raw: row.grade || '',
          school_name: row.school_name || '',
          student_phone: row.student_phone || row.phone || '',
          parent_phone: row.parent_phone || '',
          guardian_relation: row.guardian_relation || '',
          student_address: row.student_address || '',
          vehicle_info: row.vehicle_info || '',
          student_pin: row.student_pin || '',
          student_type: row.student_type || studentMeta.student_type || '일반',
          status: row.student_status || 'active',
          student_status: row.student_status || 'active',
          enrollment_date: studentMeta.enrollment_date || '',
          first_attendance_date: studentMeta.first_attendance_date || '',
          first_attended_at: studentMeta.first_attended_at || '',
          withdrawn_at: row.withdrawn_at || studentMeta.withdrawn_at || '',
          raw_meta_json: row.student_raw_meta_json || {},
          phone_raw: row.phone || '',
          normalized_phone: row.normalized_phone || '',
          contact_id: row.contact_id || '',
          contact_label: row.contact_label || '',
          candidate_index: candidateIndex,
          source_row: assignmentMeta.source_row || '',
          source_col: assignmentMeta.source_col || '',
          memo_raw: assignmentMeta.memo_raw || row.assignment_memo || '',
          match_status: 'confirmed',
          flags: [],
          is_confirmed: true
        });
      }
      byCell.set(row.timetable_cell_id, list);
    }

    for (const [cellId, list] of byCell.entries()) {
      list.sort((a, b) => {
        const diff = assignedStudentSortKey(a) - assignedStudentSortKey(b);
        if (diff !== 0) return diff;
        return safeText(a.display_name).localeCompare(safeText(b.display_name), 'ko');
      });
      byCell.set(cellId, list);
    }

    return timetableRows.map(row => ({
      ...row,
      assigned_students: byCell.get(row.id) || []
    }));
  } catch (error) {
    if (isRound6TableMissing(error)) {
      return timetableRows.map(row => ({ ...row, assigned_students: [] }));
    }
    throw error;
  }
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
    const rows = buildStudentSeedRows(await queryCandidateCells(env, action));
    return jsonResponse({ success: true, data: rows, student_seeds: rows, stub: rows.length === 0 });
  }

  if (section === 'import' && action && tail === 'contact-seeds') {
    const rows = buildContactSeedRows(await queryCandidateCells(env, action));
    return jsonResponse({ success: true, data: rows, contact_seeds: rows, stub: rows.length === 0 });
  }

  if (section === 'import' && action && tail === 'needs-review') {
    const rows = buildNeedsReviewRows(await queryCandidateCells(env, action));
    return jsonResponse({ success: true, data: rows, needs_review: rows, stub: rows.length === 0 });
  }

  if (section === 'confirmed-students') {
    try {
      const rows = await queryConfirmedStudents(env);
      return jsonResponse({ success: true, data: rows, students: rows, confirmed_students: rows, stub: false });
    } catch (error) {
      if (isRound6TableMissing(error)) {
        const rows = [];
        return jsonResponse({ success: true, data: rows, students: rows, confirmed_students: rows, stub: false });
      }
      throw error;
    }
  }

  if (section === 'confirmed-contacts') {
    try {
      const rows = await queryConfirmedContacts(env);
      return jsonResponse({ success: true, data: rows, contacts: rows, confirmed_contacts: rows, stub: rows.length === 0 });
    } catch (error) {
      if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
      throw error;
    }
  }

  if (section === 'students' && action && tail === 'contacts') {
    try {
      return await handleGetStudentContacts(env, action);
    } catch (error) {
      if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
      throw error;
    }
  }

  if (section === 'consultations') {
    try {
      return await handleGetConsultations(env, url);
    } catch (error) {
      return jsonResponse({ success: false, error: 'consultations table is not ready', code: 'EIE_NOT_IMPLEMENTED' }, 409);
    }
  }

  if (section === 'schedule-assignments') {
    try {
      const rows = await queryScheduleAssignments(env);
      return jsonResponse({ success: true, data: rows, assignments: rows, schedule_assignments: rows, stub: rows.length === 0 });
    } catch (error) {
      if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
      throw error;
    }
  }

  if (section === 'timetable') {
    const rows = await attachAssignedStudents(env, await queryTimetableCells(env, '', { statuses: buildStatusFilter(url) }));
    return jsonResponse({ success: true, data: rows, timetable_cells: rows, stub: rows.length === 0 });
  }

  if (section === 'student-seeds') {
    const rows = buildStudentSeedRows(await queryCandidateCells(env, ''));
    return jsonResponse({ success: true, data: rows, student_seeds: rows, stub: rows.length === 0 });
  }

  if (section === 'contact-seeds') {
    const rows = buildContactSeedRows(await queryCandidateCells(env, ''));
    return jsonResponse({ success: true, data: rows, contact_seeds: rows, stub: rows.length === 0 });
  }

  if (section === 'needs-review') {
    const rows = buildNeedsReviewRows(await queryCandidateCells(env, ''));
    return jsonResponse({ success: true, data: rows, needs_review: rows, stub: rows.length === 0 });
  }

  return jsonResponse({ success: false, error: 'not found' }, 404);
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
  if (!Number.isFinite(Number(cell.column_index))) {
    cell.column_index = await nextColumnIndex(env, cell);
  }
  const conflict = await checkSlotLaneDuplicate(env, cell);
  if (conflict) return uniqueCellConflictResponse();
  try {
    await env.DB.prepare(`
      INSERT INTO eie_timetable_cells (
        id, import_session_id, source_type, source_import_session_id, day_label, period_label, period_order, start_time, end_time,
        class_name_raw, teacher_name_raw, room_raw, column_index, student_count, status, memo,
        raw_meta_json, slot_lane, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
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
      toJsonText(cell.raw_meta_json),
      cell.slot_lane
    ).run();
  } catch (error) {
    if (isUniqueConflict(error)) return uniqueCellConflictResponse();
    throw error;
  }
  await syncCellTeachers(env, cell.id, cell.raw_meta_json?.teacher_names || cell.teacher_name_raw);
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
    const teacherNames = normalizeTeacherNames(body.teacher_names || body.teachers || body.teacher_name);
    const rawMeta = parseRawMeta(body.raw_meta_json !== undefined ? body.raw_meta_json : existing.raw_meta_json);
    if (body.teacher_names !== undefined || body.teachers !== undefined || body.teacher_name !== undefined) {
      rawMeta.teacher_names = teacherNames;
    }
    const rawPatchLane = Number(body.slot_lane);
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
      teacher_name_raw: body.teacher_name_raw == null ? (teacherNames[0] || existing.teacher_name_raw) : safeText(body.teacher_name_raw),
      room_raw: body.room_raw == null ? existing.room_raw : safeText(body.room_raw),
      student_count: body.student_count == null ? existing.student_count : Number(body.student_count || 0),
      status: body.status == null ? safeStatus(existing.status, 'active') : safeStatus(body.status, 'active'),
      memo: body.memo == null ? existing.memo : safeText(body.memo),
      raw_meta_json: toJsonText(rawMeta),
      slot_lane: (body.slot_lane != null && Number.isFinite(rawPatchLane) && rawPatchLane >= 1 && rawPatchLane <= 2)
        ? rawPatchLane
        : (Number(existing.slot_lane) || 1)
    };
    const validationError = validateTimetableCell(next);
    if (validationError) return jsonResponse({ success: false, error: validationError }, 400);
    try {
      await env.DB.prepare(`
        UPDATE eie_timetable_cells
        SET day_label = ?, period_label = ?, period_order = ?, start_time = ?, end_time = ?,
            class_name_raw = ?, teacher_name_raw = ?, room_raw = ?, student_count = ?, status = ?, memo = ?,
            raw_meta_json = ?, slot_lane = ?, updated_at = CURRENT_TIMESTAMP
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
        next.raw_meta_json,
        next.slot_lane,
        cellId
      ).run();
      if (body.teacher_names !== undefined || body.teachers !== undefined || body.teacher_name !== undefined || body.teacher_name_raw !== undefined) {
        await syncCellTeachers(env, cellId, rawMeta.teacher_names || next.teacher_name_raw);
      }
    } catch (error) {
      if (isUniqueConflict(error)) return uniqueCellConflictResponse();
      throw error;
    }
  }

  const saved = await getTimetableCell(env, cellId);
  return jsonResponse({ success: true, data: saved, timetable_cell: saved });
}

// ── 학생 직접 등록 ────────────────────────────────────────────────────
async function handlePostStudent(request, env, teacher) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);

  const name = safeText(body.display_name || body.name || '');
  if (!name) return jsonResponse({ success: false, error: 'name is required' }, 400);

  const studentId = makeId('eie_student');
  const now = new Date().toISOString();
  const grade = normalizeEieGrade(body.grade || body.grade_raw);
  const memo = safeText(body.memo || '');
  const status = normalizeDirectStudentStatus(body.status, 'active');
  const normalizedName = normalizeName(name);
  const rawMeta = {};
  const school = safeText(body.school_name || body.school || '');
  const studentPhone = safeText(body.student_phone || body.phone || body.phone_raw || body.contact_phone || '');
  const parentPhone = safeText(body.parent_phone || '');
  const guardianRelation = safeText(body.guardian_relation || '');
  const studentAddress = safeText(body.student_address || '');
  const vehicleInfo = safeText(body.vehicle_info || '');
  const studentPin = safeText(body.student_pin || body.pin || '');
  const studentType = safeText(body.student_type || '일반') || '일반';
  const withdrawnAt = safeText(body.withdrawn_at || body.withdrawal_date || '');
  if (school) {
    rawMeta.school_name = school;
    rawMeta.school = school;
  }
  const teacherNames = normalizeTeacherNames(body.teacher_names || body.teachers || body.teacher_name);
  if (teacherNames.length) rawMeta.teacher_names = teacherNames;
  applyStudentMetaFields(rawMeta, body);
  const rawMetaJson = Object.keys(rawMeta).length ? toJsonText(rawMeta) : null;

  try {
    await env.DB.prepare(`
      INSERT INTO eie_students (
        id, display_name, normalized_name, grade, school_name, student_phone, parent_phone,
        guardian_relation, student_address, vehicle_info, student_pin, student_type,
        status, withdrawn_at, source_type, memo, raw_meta_json, created_by, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'manual', ?, ?, ?, ?, ?)
    `).bind(
      studentId, name, normalizedName, grade, school, studentPhone, parentPhone,
      guardianRelation, studentAddress, vehicleInfo, studentPin, studentType,
      status, withdrawnAt, memo, rawMetaJson, teacher?.id || null, now, now
    ).run();
    await syncStudentTeachers(env, studentId, teacherNames);

    const warnings = [];
    const phone = studentPhone || safeText(body.parent_phone || '');
    const normalizedPhone = phone ? normalizePhone(phone) : '';
    if (normalizedPhone) {
      const contactId = makeId('eie_contact');
      try {
        await env.DB.prepare(`
          INSERT OR IGNORE INTO eie_student_contacts
            (id, student_id, phone, normalized_phone, contact_label, is_primary, source_type, created_by, created_at, updated_at)
          VALUES (?, ?, ?, ?, '대표', 1, 'manual', ?, ?, ?)
        `).bind(contactId, studentId, phone, normalizedPhone, teacher?.id || null, now, now).run();
      } catch (err) {
        warnings.push('contact save failed: ' + safeText(err?.message || String(err)));
      }
    }

    const student = await getStudentWithContacts(env, studentId);
    return jsonResponse({ success: true, student_id: studentId, student, data: student, contacts: student?.contacts || [], warnings });
  } catch (error) {
    if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
    return jsonResponse({ success: false, error: String(error?.message || error) }, 500);
  }
}

function normalizeTeacherNames(value) {
  const source = Array.isArray(value) ? value : safeText(value).split(',');
  const seen = new Set();
  return source.map(item => safeText(typeof item === 'string' ? item : item?.name)).filter(name => {
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function syncStudentTeachers(env, studentId, teacherNames) {
  const sid = safeText(studentId);
  if (!sid) return;
  const names = normalizeTeacherNames(teacherNames);
  try {
    await env.DB.prepare('DELETE FROM eie_student_teachers WHERE student_id = ?').bind(sid).run();
    for (let index = 0; index < names.length; index += 1) {
      await env.DB.prepare(`
        INSERT OR IGNORE INTO eie_student_teachers
          (id, student_id, teacher_name, sort_order, source_type, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(makeId('eie_st'), sid, names[index], index).run();
    }
  } catch (error) {
    if (!isRound6TableMissing(error)) throw error;
  }
}

async function syncCellTeachers(env, cellId, teacherNames) {
  const cid = safeText(cellId);
  if (!cid) return;
  const names = normalizeTeacherNames(teacherNames);
  try {
    await env.DB.prepare('DELETE FROM eie_timetable_cell_teachers WHERE timetable_cell_id = ?').bind(cid).run();
    for (let index = 0; index < names.length; index += 1) {
      await env.DB.prepare(`
        INSERT OR IGNORE INTO eie_timetable_cell_teachers
          (id, timetable_cell_id, teacher_name, sort_order, source_type, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(makeId('eie_ct'), cid, names[index], index).run();
    }
  } catch (error) {
    if (!isRound6TableMissing(error)) throw error;
  }
}

async function attachStudentTeachers(env, rows) {
  const students = Array.isArray(rows) ? rows : [];
  const ids = students.map(row => safeText(row.id || row.student_id)).filter(Boolean);
  if (!ids.length) {
    return students.map(student => ({
      ...student,
      teacher_names: normalizeTeacherNames(parseRawMeta(student.raw_meta_json).teacher_names || student.teacher_name)
    }));
  }
  try {
    const placeholders = ids.map(() => '?').join(', ');
    const result = await env.DB.prepare(`
      SELECT student_id, teacher_name, sort_order
      FROM eie_student_teachers
      WHERE student_id IN (${placeholders})
      ORDER BY sort_order ASC, teacher_name ASC
    `).bind(...ids).all();
    const byStudent = new Map();
    for (const row of (result.results || [])) {
      const list = byStudent.get(row.student_id) || [];
      list.push(safeText(row.teacher_name));
      byStudent.set(row.student_id, list);
    }
    return students.map(student => ({
      ...student,
      teacher_names: normalizeTeacherNames(byStudent.get(student.id || student.student_id) || parseRawMeta(student.raw_meta_json).teacher_names || student.teacher_name)
    }));
  } catch (error) {
    return students.map(student => ({
      ...student,
      teacher_names: normalizeTeacherNames(parseRawMeta(student.raw_meta_json).teacher_names || student.teacher_name)
    }));
  }
}

const STUDENT_META_FIELDS = [
  'student_phone',
  'parent_phone',
  'guardian_relation',
  'student_address',
  'vehicle_info',
  'student_pin',
  'student_type',
  'enrollment_date',
  'first_attendance_date',
  'first_attended_at',
  'withdrawn_at'
];

function applyStudentMetaFields(rawMeta, body) {
  let changed = false;
  STUDENT_META_FIELDS.forEach(field => {
    if (body[field] !== undefined) {
      rawMeta[field] = safeText(body[field]);
      changed = true;
    }
  });
  if (body.pin !== undefined && body.student_pin === undefined) {
    rawMeta.student_pin = safeText(body.pin);
    changed = true;
  }
  return changed;
}

// ── 학생 정보 수정 ────────────────────────────────────────────────────
async function handlePatchStudent(request, env, teacher, studentId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);

  const existingStudent = await getStudentById(env, studentId);
  if (!existingStudent) return jsonResponse({ success: false, error: 'student not found' }, 404);

  const sets = [];
  const binds = [];
  const ignoredFields = [];

  if (body.display_name !== undefined || body.name !== undefined) {
    const name = safeText(body.display_name || body.name);
    if (!name) return jsonResponse({ success: false, error: 'name is required' }, 400);
    sets.push('display_name = ?');
    binds.push(name);
    sets.push('normalized_name = ?');
    binds.push(normalizeName(name));
  }
  if (body.grade !== undefined || body.grade_raw !== undefined) {
    sets.push('grade = ?');
    binds.push(normalizeEieGrade(body.grade || body.grade_raw));
  }
  if (body.school_name !== undefined || body.school !== undefined) {
    sets.push('school_name = ?');
    binds.push(safeText(body.school_name || body.school || ''));
  }
  if (body.student_phone !== undefined || body.phone !== undefined || body.phone_raw !== undefined) {
    sets.push('student_phone = ?');
    binds.push(safeText(body.student_phone || body.phone || body.phone_raw || ''));
  }
  if (body.parent_phone !== undefined) {
    sets.push('parent_phone = ?');
    binds.push(safeText(body.parent_phone));
  }
  if (body.guardian_relation !== undefined) {
    sets.push('guardian_relation = ?');
    binds.push(safeText(body.guardian_relation));
  }
  if (body.student_address !== undefined) {
    sets.push('student_address = ?');
    binds.push(safeText(body.student_address));
  }
  if (body.vehicle_info !== undefined) {
    sets.push('vehicle_info = ?');
    binds.push(safeText(body.vehicle_info));
  }
  if (body.student_pin !== undefined || body.pin !== undefined) {
    sets.push('student_pin = ?');
    binds.push(safeText(body.student_pin || body.pin));
  }
  if (body.student_type !== undefined) {
    sets.push('student_type = ?');
    binds.push(safeText(body.student_type) || '일반');
  }
  if (body.memo !== undefined || body.note !== undefined) {
    sets.push('memo = ?');
    binds.push(safeText(body.memo || body.note));
  }
  if (body.status !== undefined) {
    const s = normalizeDirectStudentStatus(body.status, '');
    if (!s) return jsonResponse({ success: false, error: 'invalid status' }, 400);
    sets.push('status = ?');
    binds.push(s);
    if (['inactive', 'archived', 'withdrawn'].includes(s) && body.withdrawn_at === undefined && body.withdrawal_date === undefined && !safeText(existingStudent.withdrawn_at)) {
      sets.push('withdrawn_at = ?');
      binds.push(new Date().toISOString());
    }
  }
  if (body.withdrawn_at !== undefined || body.withdrawal_date !== undefined) {
    sets.push('withdrawn_at = ?');
    binds.push(safeText(body.withdrawn_at || body.withdrawal_date || ''));
  }
  const rawMeta = parseRawMeta(existingStudent.raw_meta_json);
  const school = safeText(body.school_name || body.school || '');
  let rawMetaChanged = false;
  if (body.school_name !== undefined || body.school !== undefined) {
    rawMeta.school_name = school;
    rawMeta.school = school;
    rawMetaChanged = true;
  }
  if (body.teacher_names !== undefined || body.teachers !== undefined || body.teacher_name !== undefined) {
    rawMeta.teacher_names = normalizeTeacherNames(body.teacher_names || body.teachers || body.teacher_name);
    rawMetaChanged = true;
  }
  if (applyStudentMetaFields(rawMeta, body)) rawMetaChanged = true;
  if (rawMetaChanged) {
    sets.push('raw_meta_json = ?');
    binds.push(toJsonText(rawMeta));
  }

  ['student_name_raw'].forEach(field => {
    if (body[field] !== undefined) ignoredFields.push(field + ' (not in schema)');
  });

  const phoneRaw = safeText(body.student_phone || body.phone || body.phone_raw);
  const normalizedPhone = phoneRaw ? normalizePhone(phoneRaw) : '';
  const hasPhoneUpdate = body.student_phone !== undefined || body.phone !== undefined || body.phone_raw !== undefined;

  if (!sets.length && !hasPhoneUpdate) return jsonResponse({ success: false, error: 'no valid fields to update', ignored_fields: ignoredFields }, 400);

  if (sets.length) {
    sets.push('updated_at = ?');
    binds.push(new Date().toISOString());
    binds.push(studentId);

    try {
      await env.DB.prepare(
        `UPDATE eie_students SET ${sets.join(', ')} WHERE id = ?`
      ).bind(...binds).run();
    } catch (error) {
      if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
      return jsonResponse({ success: false, error: String(error?.message || error) }, 500);
    }
  }

  const warnings = [];
  if (hasPhoneUpdate) {
    const now = new Date().toISOString();
    try {
      const existing = await env.DB.prepare(
        `SELECT id FROM eie_student_contacts WHERE student_id = ? AND COALESCE(is_primary, 1) = 1 ORDER BY created_at ASC LIMIT 1`
      ).bind(studentId).first();

      if (existing) {
        await env.DB.prepare(
          `UPDATE eie_student_contacts SET phone = ?, normalized_phone = ?, updated_at = ? WHERE id = ?`
        ).bind(phoneRaw, normalizedPhone, now, existing.id).run();
      } else if (normalizedPhone) {
        const contactId = makeId('eie_contact');
        await env.DB.prepare(`
          INSERT OR IGNORE INTO eie_student_contacts
            (id, student_id, phone, normalized_phone, contact_label, is_primary, source_type, created_by, created_at, updated_at)
          VALUES (?, ?, ?, ?, '대표', 1, 'manual', ?, ?, ?)
        `).bind(contactId, studentId, phoneRaw, normalizedPhone, teacher?.id || null, now, now).run();
      }
    } catch (error) {
      warnings.push('contact update failed: ' + safeText(error?.message || String(error)));
    }
  }
  if (body.teacher_names !== undefined || body.teachers !== undefined || body.teacher_name !== undefined) {
    await syncStudentTeachers(env, studentId, body.teacher_names || body.teachers || body.teacher_name);
  }

  const student = await getStudentWithContacts(env, studentId);
  const response = { success: true, student, data: student, contacts: student?.contacts || [], warnings };
  if (ignoredFields.length) response.ignored_fields = ignoredFields;
  return jsonResponse(response);
}

// ── 학생 상태 변경 ────────────────────────────────────────────────────
async function handlePatchStudentStatus(request, env, teacher, studentId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const status = normalizeDirectStudentStatus(body.status, '');
  if (!status) return jsonResponse({ success: false, error: 'invalid status' }, 400);

  const existing = await getStudentById(env, studentId);
  if (!existing) return jsonResponse({ success: false, error: 'student not found' }, 404);

  try {
    const now = new Date().toISOString();
    const updates = ['status = ?', 'updated_at = ?'];
    const binds = [status, now];
    if (['inactive', 'archived', 'withdrawn'].includes(status)) {
      updates.push('withdrawn_at = COALESCE(withdrawn_at, ?)');
      binds.push(safeText(body.withdrawn_at || body.withdrawal_date || '') || now);
    } else if (body.withdrawn_at !== undefined || body.withdrawal_date !== undefined) {
      updates.push('withdrawn_at = ?');
      binds.push(safeText(body.withdrawn_at || body.withdrawal_date || ''));
    }
    binds.push(studentId);
    await env.DB.prepare(
      `UPDATE eie_students SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...binds).run();
    const student = await getStudentWithContacts(env, studentId);
    return jsonResponse({ success: true, student, data: student, contacts: student?.contacts || [], warnings: [] });
  } catch (error) {
    if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
    return jsonResponse({ success: false, error: String(error?.message || error) }, 500);
  }
}

// ── 학생 조회 헬퍼 ───────────────────────────────────────────────────
async function getStudentById(env, studentId) {
  return env.DB.prepare('SELECT * FROM eie_students WHERE id = ? LIMIT 1').bind(studentId).first();
}

async function getStudentWithContacts(env, studentId) {
  const rawStudent = await getStudentById(env, studentId);
  if (!rawStudent) return null;
  const studentRows = await attachStudentTeachers(env, [rawStudent]);
  const student = studentRows[0] || rawStudent;
  const result = await env.DB.prepare(`
    SELECT id, student_id, phone, normalized_phone, contact_label, is_primary, created_at
    FROM eie_student_contacts
    WHERE student_id = ?
    ORDER BY COALESCE(is_primary, 1) DESC, created_at ASC
  `).bind(studentId).all();
  const contacts = result.results || [];
  const primary = contacts[0] || null;
  return {
    ...student,
    phone: primary ? safeText(primary.phone) : '',
    phone_raw: primary ? safeText(primary.phone) : '',
    normalized_phone: primary ? safeText(primary.normalized_phone) : '',
    primary_phone: primary ? safeText(primary.phone) : '',
    contacts
  };
}

// ── 학생 soft delete ──────────────────────────────────────────────────
async function handleDeleteStudent(request, env, studentId) {
  const existing = await getStudentById(env, studentId);
  if (!existing) return jsonResponse({ success: false, error: '학생을 찾을 수 없습니다.' }, 404);

  try {
    await env.DB.prepare(
      `UPDATE eie_students SET status = 'archived', withdrawn_at = COALESCE(withdrawn_at, CURRENT_TIMESTAMP), updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(studentId).run();
  } catch (error) {
    if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
    return jsonResponse({ success: false, error: String(error?.message || error) }, 500);
  }

  const student = await getStudentWithContacts(env, studentId);
  return jsonResponse({
    success: true,
    student,
    data: student,
    soft_deleted: true,
    archived: true,
    contacts: student?.contacts || [],
    warnings: []
  });
}

// ── 수업에 학생 배정 ─────────────────────────────────────────────────
async function handlePostCellStudent(request, env, teacher, cellId) {
  const body = await readJsonBody(request);
  const studentId = safeText(body?.student_id || '');
  if (!studentId) return jsonResponse({ success: false, error: 'student_id가 필요합니다.' }, 400);

  const assignmentId = makeId('eie_assign');
  const now = new Date().toISOString();

  try {
    await env.DB.prepare(`
      INSERT OR IGNORE INTO eie_student_schedule_assignments
        (id, student_id, timetable_cell_id, status, source_type, created_by, created_at, updated_at)
      VALUES (?, ?, ?, 'active', 'manual', ?, ?, ?)
    `).bind(assignmentId, studentId, cellId, teacher.id, now, now).run();
    return jsonResponse({ success: true, assignment_id: assignmentId, message: '학생이 배정되었습니다.' });
  } catch (error) {
    if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
    return jsonResponse({ success: false, error: '배정하지 못했습니다.' }, 500);
  }
}

// ── 수업 배정 해제 (soft delete) ─────────────────────────────────────
async function handleDeleteCellStudent(request, env, teacher, cellId, studentId) {
  try {
    const result = await env.DB.prepare(`
      UPDATE eie_student_schedule_assignments
      SET status = 'archived', updated_at = ?
      WHERE timetable_cell_id = ? AND student_id = ? AND COALESCE(status, 'active') != 'archived'
    `).bind(new Date().toISOString(), cellId, studentId).run();

    if ((result.meta?.changes || 0) === 0) {
      return jsonResponse({ success: false, error: '배정 기록을 찾을 수 없습니다.' }, 404);
    }
    return jsonResponse({ success: true, message: '배정이 해제되었습니다.' });
  } catch (error) {
    if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
    return jsonResponse({ success: false, error: '처리하지 못했습니다.' }, 500);
  }
}

// ── 수업 배정/해제 일괄 처리 ─────────────────────────────────────────
// body: { assign: [...], remove: [...] }
// 항목은 studentId 문자열(경로의 cellId 사용) 또는 { student_id, cell_id } 객체(셀 지정).
// 단건 POST/DELETE를 학생/셀 수만큼 반복 호출하던 것을 D1 batch 한 번으로 처리한다.
// 응답에 영향받은 셀들의 활성 배정 목록을 돌려줘서 프론트가 전체 시간표를 재조회하지 않아도 된다.
async function handleBatchCellStudents(request, env, teacher, cellId) {
  const body = await readJsonBody(request);
  const normalizeOps = list => {
    const out = [];
    const seen = new Set();
    for (const item of (Array.isArray(list) ? list : [])) {
      const isObj = item && typeof item === 'object';
      const studentId = safeText(isObj ? item.student_id : item);
      const targetCellId = safeText((isObj && item.cell_id) || cellId);
      if (!studentId || !targetCellId) continue;
      const key = `${targetCellId}::${studentId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ studentId, cellId: targetCellId });
    }
    return out;
  };
  const assign = normalizeOps(body?.assign);
  const remove = normalizeOps(body?.remove);
  if (!assign.length && !remove.length) {
    return jsonResponse({ success: false, error: 'assign 또는 remove 학생 목록이 필요합니다.' }, 400);
  }

  const now = new Date().toISOString();
  const stmts = [];
  for (const op of assign) {
    stmts.push(env.DB.prepare(`
      INSERT INTO eie_student_schedule_assignments
        (id, student_id, timetable_cell_id, status, source_type, created_by, created_at, updated_at)
      VALUES (?, ?, ?, 'active', 'manual', ?, ?, ?)
      ON CONFLICT(student_id, timetable_cell_id)
      DO UPDATE SET status = 'active', updated_at = excluded.updated_at
    `).bind(makeId('eie_assign'), op.studentId, op.cellId, teacher.id, now, now));
  }
  for (const op of remove) {
    stmts.push(env.DB.prepare(`
      UPDATE eie_student_schedule_assignments
      SET status = 'archived', updated_at = ?
      WHERE timetable_cell_id = ? AND student_id = ? AND COALESCE(status, 'active') != 'archived'
    `).bind(now, op.cellId, op.studentId));
  }

  try {
    await env.DB.batch(stmts);
    const affectedCellIds = Array.from(new Set([...assign, ...remove].map(op => op.cellId)));
    const placeholders = affectedCellIds.map(() => '?').join(', ');
    const result = await env.DB.prepare(`
      SELECT id, student_id, timetable_cell_id, status, updated_at
      FROM eie_student_schedule_assignments
      WHERE timetable_cell_id IN (${placeholders}) AND COALESCE(status, 'active') != 'archived'
    `).bind(...affectedCellIds).all();
    const assignments = result.results || [];
    return jsonResponse({
      success: true,
      cell_id: cellId,
      cell_ids: affectedCellIds,
      assigned_count: assign.length,
      removed_count: remove.length,
      assignments,
      data: assignments
    });
  } catch (error) {
    if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
    return jsonResponse({ success: false, error: '일괄 배정을 처리하지 못했습니다.' }, 500);
  }
}

function normalizeTeacherRole(value) {
  const role = safeText(value || 'teacher').toLowerCase();
  if (role === 'admin' || role === 'owner') return 'admin';
  if (role === 'disabled' || role === 'archived') return 'disabled';
  return 'teacher';
}

async function handleGetTeachers(env) {
  const result = await env.DB.prepare(`
    SELECT id, name, login_id, role, created_at
    FROM teachers
    ORDER BY CASE WHEN role IN ('admin', 'owner') THEN 0 WHEN role = 'disabled' THEN 2 ELSE 1 END, name ASC
  `).all();
  const teachers = result.results || [];
  return jsonResponse({ success: true, teachers, data: teachers });
}

async function handlePostTeacher(request, env) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const name = safeText(body.name);
  const loginId = safeText(body.login_id);
  const password = String(body.password || '').trim();
  const role = normalizeTeacherRole(body.role);
  if (!name || !loginId || !password) return jsonResponse({ success: false, error: 'name, login_id, password are required' }, 400);
  if (password.length < 4) return jsonResponse({ success: false, error: 'password must be at least 4 characters' }, 400);
  const existing = await env.DB.prepare('SELECT id FROM teachers WHERE login_id = ? LIMIT 1').bind(loginId).first();
  if (existing) return jsonResponse({ success: false, error: 'login_id already exists' }, 409);
  const id = makeId('eie_teacher');
  const hash = await sha256hex(password);
  await env.DB.prepare(`
    INSERT INTO teachers (id, name, login_id, password_hash, role, created_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(id, name, loginId, hash, role).run();
  const teacher = await env.DB.prepare('SELECT id, name, login_id, role, created_at FROM teachers WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, teacher, data: teacher });
}

const DEFAULT_EIE_TEACHERS = [
  { name: 'Carmen', login_id: 'carmen' },
  { name: 'IVY', login_id: 'ivy' },
  { name: 'Lily', login_id: 'lily' },
  { name: 'Stacy', login_id: 'stacy' },
  { name: 'Zoe', login_id: 'zoe' },
  { name: 'Laura', login_id: 'laura' }
];

async function handleSeedDefaultTeachers(env) {
  const passwordHash = await sha256hex('eie1234');
  const rows = [];
  for (const item of DEFAULT_EIE_TEACHERS) {
    const existing = await env.DB.prepare('SELECT id FROM teachers WHERE login_id = ? LIMIT 1').bind(item.login_id).first();
    if (existing && existing.id) {
      await env.DB.prepare(`
        UPDATE teachers
        SET name = ?, password_hash = ?, role = CASE WHEN role = 'disabled' THEN 'teacher' ELSE role END
        WHERE id = ?
      `).bind(item.name, passwordHash, existing.id).run();
      const teacher = await env.DB.prepare('SELECT id, name, login_id, role, created_at FROM teachers WHERE id = ?').bind(existing.id).first();
      rows.push({ ...teacher, seeded: 'updated' });
    } else {
      const id = makeId('eie_teacher');
      await env.DB.prepare(`
        INSERT INTO teachers (id, name, login_id, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, 'teacher', CURRENT_TIMESTAMP)
      `).bind(id, item.name, item.login_id, passwordHash).run();
      const teacher = await env.DB.prepare('SELECT id, name, login_id, role, created_at FROM teachers WHERE id = ?').bind(id).first();
      rows.push({ ...teacher, seeded: 'inserted' });
    }
  }
  return jsonResponse({ success: true, password: 'eie1234', teachers: rows, data: rows });
}

async function handlePatchTeacher(request, env, teacherId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const existing = await env.DB.prepare('SELECT id FROM teachers WHERE id = ? LIMIT 1').bind(teacherId).first();
  if (!existing) return jsonResponse({ success: false, error: 'teacher not found' }, 404);
  const name = safeText(body.name);
  if (!name) return jsonResponse({ success: false, error: 'name is required' }, 400);
  const role = normalizeTeacherRole(body.role);
  await env.DB.prepare('UPDATE teachers SET name = ?, role = ? WHERE id = ?').bind(name, role, teacherId).run();
  const teacher = await env.DB.prepare('SELECT id, name, login_id, role, created_at FROM teachers WHERE id = ?').bind(teacherId).first();
  return jsonResponse({ success: true, teacher, data: teacher });
}

async function handleResetTeacherPassword(request, env, teacherId) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'invalid json body' }, 400);
  const newPassword = String(body.new_password || body.password || '').trim();
  if (newPassword.length < 4) return jsonResponse({ success: false, error: 'new_password must be at least 4 characters' }, 400);
  const existing = await env.DB.prepare('SELECT id FROM teachers WHERE id = ? LIMIT 1').bind(teacherId).first();
  if (!existing) return jsonResponse({ success: false, error: 'teacher not found' }, 404);
  const hash = await sha256hex(newPassword);
  await env.DB.prepare('UPDATE teachers SET password_hash = ? WHERE id = ?').bind(hash, teacherId).run();
  await env.DB.prepare('UPDATE teacher_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE teacher_id = ? AND revoked_at IS NULL').bind(teacherId).run().catch(() => {});
  return jsonResponse({ success: true });
}

async function handleDeleteTeacher(request, env, teacherId) {
  const existing = await env.DB.prepare('SELECT id FROM teachers WHERE id = ? LIMIT 1').bind(teacherId).first();
  if (!existing) return jsonResponse({ success: false, error: 'teacher not found' }, 404);
  await env.DB.prepare("UPDATE teachers SET role = 'disabled' WHERE id = ?").bind(teacherId).run();
  await env.DB.prepare('UPDATE teacher_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE teacher_id = ? AND revoked_at IS NULL').bind(teacherId).run().catch(() => {});
  const teacher = await env.DB.prepare('SELECT id, name, login_id, role, created_at FROM teachers WHERE id = ?').bind(teacherId).first();
  return jsonResponse({ success: true, teacher, data: teacher });
}

export async function handleEie(request, env, teacher, path, url) {
  if (!teacher || !teacher.id) return jsonResponse({ success: false, error: 'unauthorized' }, 401);

  const method = request.method;

  if (method === 'GET' && path[2] === 'teachers' && !path[3]) {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handleGetTeachers(env);
  }

  if (method === 'GET' && path[2] === 'attendance-records' && !path[3]) {
    return handleGetAttendanceRecords(env, url);
  }

  if (method === 'GET' && path[2] === 'exam-records' && !path[3]) {
    return handleGetEieExamRecords(env, url);
  }

  if (method === 'GET' && path[2] === 'school-grade-records' && !path[3]) {
    return handleGetEieSchoolGradeRecords(env, url);
  }

  if (method === 'GET' && path[2] === 'grade-sheets' && !path[3]) {
    return handleGetEieGradeSheets(env, url);
  }

  if (method === 'GET') {
    return handleGet(request, env, path, url);
  }

  if (method === 'POST' && path[2] === 'import' && !path[3]) {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handlePostImport(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'confirm-candidate' && !path[3]) {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handlePostConfirmCandidate(request, env, teacher);
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

  // ── 학생 직접 등록/수정 ──────────────────────────────────────────────
  if (method === 'POST' && path[2] === 'students' && !path[3]) {
    return handlePostStudent(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'students' && path[3] && path[4] === 'contacts' && !path[5]) {
    return handlePostStudentContact(request, env, teacher, path[3]);
  }

  if (method === 'PATCH' && path[2] === 'students' && path[3] && !path[4]) {
    return handlePatchStudent(request, env, teacher, path[3]);
  }

  if (method === 'PATCH' && path[2] === 'students' && path[3] && path[4] === 'status') {
    return handlePatchStudentStatus(request, env, teacher, path[3]);
  }

  if (method === 'DELETE' && path[2] === 'students' && path[3] && !path[4]) {
    return handleDeleteStudent(request, env, path[3]);
  }

  if (method === 'POST' && path[2] === 'teachers' && path[3] === 'seed-defaults' && !path[4]) {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handleSeedDefaultTeachers(env);
  }

  if (method === 'POST' && path[2] === 'teachers' && !path[3]) {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handlePostTeacher(request, env);
  }

  if (method === 'PATCH' && path[2] === 'teachers' && path[3] && path[4] === 'reset-password') {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handleResetTeacherPassword(request, env, path[3]);
  }

  if (method === 'PATCH' && path[2] === 'teachers' && path[3] && !path[4]) {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handlePatchTeacher(request, env, path[3]);
  }

  if (method === 'DELETE' && path[2] === 'teachers' && path[3] && !path[4]) {
    const ownerOnly = requireEieOwner(teacher); if (ownerOnly) return ownerOnly;
    return handleDeleteTeacher(request, env, path[3]);
  }

  if (method === 'PATCH' && path[2] === 'student-contacts' && path[3] && !path[4]) {
    return handlePatchStudentContact(request, env, path[3]);
  }

  if (method === 'DELETE' && path[2] === 'student-contacts' && path[3] && !path[4]) {
    return contactDeleteDeferredResponse();
  }

  if (method === 'POST' && path[2] === 'consultations' && !path[3]) {
    return handlePostConsultation(request, env);
  }

  if (method === 'PATCH' && path[2] === 'consultations' && path[3] && !path[4]) {
    return handlePatchConsultation(request, env, path[3]);
  }

  if (method === 'DELETE' && path[2] === 'consultations' && path[3] && !path[4]) {
    return handleDeleteConsultation(env, path[3]);
  }

  // ── 수업 배정/해제 ───────────────────────────────────────────────────
  if (method === 'POST' && path[2] === 'attendance-records' && !path[3]) {
    return handlePostAttendanceRecord(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'exam-records' && path[3] === 'batch' && !path[4]) {
    return handleBatchEieExamRecords(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'school-grade-records' && path[3] === 'batch' && !path[4]) {
    return handleBatchEieSchoolGradeRecords(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'grade-sheets' && !path[3]) {
    return handleSaveEieGradeSheet(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'exam-records' && !path[3]) {
    return handlePostEieExamRecord(request, env, teacher);
  }

  if (method === 'PATCH' && path[2] === 'exam-records' && path[3] && !path[4]) {
    return handlePatchEieExamRecord(request, env, path[3]);
  }

  if (method === 'DELETE' && path[2] === 'exam-records' && path[3] && !path[4]) {
    return handleDeleteEieExamRecord(env, path[3]);
  }

  if (method === 'PATCH' && path[2] === 'school-grade-records' && path[3] && !path[4]) {
    return handlePatchEieSchoolGradeRecord(request, env, path[3]);
  }

  if (method === 'DELETE' && path[2] === 'school-grade-records' && path[3] && !path[4]) {
    return handleDeleteEieSchoolGradeRecord(env, path[3]);
  }

  if (method === 'POST' && path[2] === 'timetable-cells' && path[3] && path[4] === 'students' && path[5] === 'batch' && !path[6]) {
    return handleBatchCellStudents(request, env, teacher, path[3]);
  }

  if (method === 'POST' && path[2] === 'timetable-cells' && path[3] && path[4] === 'students' && !path[5]) {
    return handlePostCellStudent(request, env, teacher, path[3]);
  }

  if (method === 'DELETE' && path[2] === 'timetable-cells' && path[3] && path[4] === 'students' && path[5]) {
    return handleDeleteCellStudent(request, env, teacher, path[3], path[5]);
  }

  return jsonResponse({ success: false, error: 'method not allowed' }, 405);
}
