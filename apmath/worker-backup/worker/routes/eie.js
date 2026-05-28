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
    if (isEieBaseTableMissing(error)) return [];
    throw error;
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
  return text.includes('no such table') || text.includes('eie_students') || text.includes('eie_student_contacts') || text.includes('eie_student_schedule_assignments');
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
    safeText(candidate?.grade_raw),
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
  const result = await env.DB.prepare(`
    SELECT s.*,
           COUNT(DISTINCT c.id) AS contact_count,
           COUNT(DISTINCT a.id) AS assignment_count
    FROM eie_students s
    LEFT JOIN eie_student_contacts c ON c.student_id = s.id
    LEFT JOIN eie_student_schedule_assignments a ON a.student_id = s.id AND COALESCE(a.status, 'active') != 'archived'
    GROUP BY s.id
    ORDER BY s.updated_at DESC, s.created_at DESC
  `).all();
  return result.results || [];
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
             s.status AS student_status,
             c.id AS contact_id,
             c.phone,
             c.normalized_phone,
             c.contact_label
      FROM eie_student_schedule_assignments a
      JOIN eie_students s ON s.id = a.student_id
      LEFT JOIN eie_student_contacts c ON c.student_id = s.id AND COALESCE(c.is_primary, 1) = 1
      WHERE COALESCE(a.status, 'active') != 'archived'
        AND COALESCE(s.status, 'active') != 'archived'
        AND a.timetable_cell_id IN (${placeholders})
      ORDER BY a.created_at ASC, s.display_name ASC, c.created_at ASC
    `).bind(...cellIds).all();

    const byCell = new Map();
    for (const row of (result.results || [])) {
      const list = byCell.get(row.timetable_cell_id) || [];
      if (!list.some(item => item.assignment_id === row.assignment_id)) {
        const assignmentMeta = parseRawMeta(row.assignment_raw_meta_json);
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
      return jsonResponse({ success: true, data: rows, students: rows, confirmed_students: rows, stub: rows.length === 0 });
    } catch (error) {
      if (isRound6TableMissing(error)) return round6MigrationRequiredResponse();
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
  if (!teacher) return jsonResponse({ success: false, error: 'Unauthorized' }, 401);
  if (!isEieOwner(teacher)) return jsonResponse({ success: false, error: 'EIE management is owner only' }, 403);

  const method = request.method;

  if (method === 'GET') {
    return handleGet(request, env, path, url);
  }

  if (method === 'POST' && path[2] === 'import' && !path[3]) {
    return handlePostImport(request, env, teacher);
  }

  if (method === 'POST' && path[2] === 'confirm-candidate' && !path[3]) {
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

  return jsonResponse({ success: false, error: 'method not allowed' }, 405);
}
