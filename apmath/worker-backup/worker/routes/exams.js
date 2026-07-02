import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, canAccessStudent, isAdminUser, isStaffUser } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

async function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Basic ')) return null;
  try {
    const [loginId, password] = atob(auth.slice(6)).split(':');
    const hash = await sha256hex(password);
    const teacher = await env.DB.prepare(
      'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(loginId, hash).first();
    return teacher || null;
  } catch (e) {
    return null;
  }
}

async function requireTeacher(request, env, teacher) {
  return teacher || await verifyAuth(request, env);
}

const ASSIGNMENT_META_COLUMNS = ['pack_id', 'grade_label', 'pack_hash', 'assignment_batch_id', 'target_scope', 'subject'];
const EXAM_SESSION_META_COLUMNS = ['assignment_id', 'pack_id', 'result_hash', 'analysis_status'];
const BLUEPRINT_META_COLUMNS = ['assessment_pack_id', 'type_key', 'difficulty'];
const RESULT_ITEM_COLUMNS = [
  'session_id', 'assignment_id', 'pack_id', 'student_id', 'class_id', 'order_no', 'question_no',
  'result_status', 'is_correct', 'student_answer', 'correct_answer', 'score', 'max_score',
  'source_archive_file', 'source_question_no', 'standard_unit_key', 'standard_unit',
  'concept_cluster_key', 'type_key', 'difficulty', 'analysis_note'
];
const TARGET_SCOPE_VALUES = new Set(['class', 'grade', 'teacher_grade']);
const ANALYSIS_STATUS_VALUES = new Set(['none', 'basic_ready', 'premium_ready', 'stale']);
const columnCacheByEnv = new WeakMap();

function normalizeOptionalText(value) {
  const text = String(value ?? '').trim();
  return text || null;
}

function normalizeAssignmentArchiveFile(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (raw.startsWith('MIXED:')) return raw;
  if (/^https?:\/\//i.test(raw)) return raw;

  let path = raw
    .replace(/^archive\//, '')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '');

  if (!path) return '';
  if (/^(exams|assets|data)\//.test(path)) return path;
  if (!path.endsWith('.js')) path += '.js';
  return `exams/${path}`;
}

function normalizeAssignmentSubject(raw) {
  let text = String(raw || '').trim();
  if (!text) return null;
  text = text.replace(/\s+/g, '');
  text = text.replace(/^기출/i, '');
  text = text.replace(/^[Cc]/, '').replace(/[Cc]$/, '');
  text = text.trim();
  if (!text) return null;

  const directMap = new Map([
    ['대수', '대수'],
    ['미적분Ⅱ', '미적분Ⅱ'],
    ['미적분II', '미적분Ⅱ'],
    ['미적분2', '미적분Ⅱ'],
    ['확률과통계', '확률과통계'],
    ['확통', '확률과통계'],
    ['미적분Ⅰ', '미적분Ⅰ'],
    ['미적분I', '미적분Ⅰ'],
    ['미적분1', '미적분Ⅰ'],
    ['기하', '기하'],
    ['기하와벡터', '기하'],
    ['기하벡터', '기하'],
    ['기벡', '기하']
  ]);

  if (directMap.has(text)) return directMap.get(text);
  if (/^공통수학[12]$/.test(text)) return null;
  if (/^수학[12IⅡII]*$/.test(text)) return null;
  return null;
}

function parseStudentHighSubjects(value) {
  let raw = value;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch (e) {
      raw = raw.split(/[,\s/]+/);
    }
  }
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw.map(normalizeAssignmentSubject).filter(Boolean)));
}

function getAssignmentArchiveCandidates(value) {
  const raw = String(value || '').trim();
  const normalized = normalizeAssignmentArchiveFile(raw);
  return [...new Set([raw, normalized].filter(Boolean))];
}

// 아카이브 원본 문항(standardUnitKey 등, 카멜케이스)을 exam_blueprints(스네이크케이스)로 옮겨 담는 동기화.
// 아카이브는 GitHub Pages 정적 URL이라 워커에서 바로 fetch 가능하다.
const EXAM_ARCHIVE_BASE_URL = 'https://icefoxtail.github.io/AP------/archive/';

function extractQuestionBankFromArchiveText(jsText) {
  const sandboxWindow = { questionBank: null, __questionBank: null };
  const sandboxDocument = {
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, innerHTML: '' }),
    head: { appendChild() {} },
    body: { appendChild() {} },
    addEventListener() {},
    querySelector: () => null,
    querySelectorAll: () => []
  };
  try {
    const fn = new Function('window', 'document', `${jsText}\n;return window.questionBank || window.__questionBank || (typeof questionBank !== 'undefined' ? questionBank : null);`);
    const bank = fn(sandboxWindow, sandboxDocument);
    return Array.isArray(bank) ? bank : [];
  } catch (e) {
    console.warn('[exams] archive questionBank parse failed:', e);
    return [];
  }
}

// archiveFile 하나당 한 번만 동기화한다(이미 blueprint 행이 있으면 건너뜀). 실패해도 시험 배정 자체는 막지 않는다.
async function syncExamBlueprintsFromArchive(env, archiveFile) {
  const file = normalizeAssignmentArchiveFile(archiveFile);
  if (!file || file.startsWith('MIXED:') || /^https?:\/\//i.test(file)) return;
  try {
    const already = await env.DB.prepare('SELECT 1 FROM exam_blueprints WHERE archive_file = ? LIMIT 1').bind(file).first();
    if (already) return;

    const url = EXAM_ARCHIVE_BASE_URL + file.split('/').map(encodeURIComponent).join('/');
    const res = await fetch(url);
    if (!res.ok) return;
    const jsText = await res.text();
    const bank = extractQuestionBankFromArchiveText(jsText);
    if (!bank.length) return;

    const stmts = bank.map(q => {
      const questionNo = Number(String(q?.id ?? '').match(/\d+/)?.[0] || 0);
      if (!questionNo) return null;
      return env.DB.prepare(`
        INSERT INTO exam_blueprints (
          archive_file, question_no, source_archive_file, source_question_no,
          standard_unit_key, standard_unit, standard_course, concept_cluster_key, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
        ON CONFLICT(archive_file, question_no) DO UPDATE SET
          standard_unit_key = excluded.standard_unit_key,
          standard_unit = excluded.standard_unit,
          standard_course = excluded.standard_course,
          concept_cluster_key = excluded.concept_cluster_key,
          updated_at = DATETIME('now')
      `).bind(
        file,
        questionNo,
        file,
        questionNo,
        q?.standardUnitKey || null,
        q?.standardUnit || null,
        q?.standardCourse || null,
        q?.conceptClusterKey || null
      );
    }).filter(Boolean);

    if (stmts.length) await env.DB.batch(stmts);
  } catch (e) {
    console.warn('[exams] archive blueprint sync failed:', archiveFile, e);
  }
}

function normalizeExamTitleKey(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function buildAssignmentIdentityKey(row = {}) {
  const classId = String(row.class_id || '').trim();
  const examDate = String(row.exam_date || '').trim();
  const packId = String(row.pack_id || '').trim();
  const packHash = String(row.pack_hash || '').trim();
  if (classId && examDate && packId && packHash) return `${classId}||${examDate}||PACK||${packId}||${packHash}`;
  const archiveFile = normalizeAssignmentArchiveFile(row.archive_file || '');
  if (classId && examDate && archiveFile) return `${classId}||${examDate}||${archiveFile}`;
  return `${classId}||${normalizeExamTitleKey(row.exam_title)}||${examDate}`;
}

function dedupeClassExamAssignments(rows = []) {
  const seen = new Set();
  const deduped = [];
  for (const row of rows || []) {
    const key = buildAssignmentIdentityKey(row);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    deduped.push(row);
  }
  return deduped;
}

function normalizeBoardGrade(value) {
  return String(value || '').replace(/\s+/g, '').trim();
}

function normalizeBoardDate(value) {
  const text = String(value || '').trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : '';
}

function getBoardDateOffset(dateText, delta) {
  const base = normalizeBoardDate(dateText) || new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const date = new Date(`${base}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + delta);
  return date.toISOString().slice(0, 10);
}

function normalizeTargetScope(value) {
  const text = String(value || '').trim();
  return TARGET_SCOPE_VALUES.has(text) ? text : null;
}

function normalizeAnalysisStatus(value) {
  const text = String(value || '').trim();
  return ANALYSIS_STATUS_VALUES.has(text) ? text : 'none';
}

function normalizeWrongIds(values, questionCount) {
  const source = Array.isArray(values)
    ? values
    : (typeof values === 'string' ? values.split(/[\s,]+/) : []);
  return Array.from(new Set(source
    .map(v => String(v).trim())
    .filter(v => /^\d+$/.test(v))
    .map(v => parseInt(v, 10))
    .filter(v => v >= 1 && v <= questionCount)
    .sort((a, b) => a - b)
    .map(v => String(v))));
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value ?? null);
}

function deterministicHash(input) {
  const text = stableJson(input);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a_${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function buildResultHash(input) {
  return deterministicHash({
    student_id: input.student_id || null,
    class_id: input.class_id || null,
    exam_title: input.exam_title || '',
    exam_date: input.exam_date || '',
    archive_file: input.archive_file || '',
    question_count: Number(input.question_count || 0),
    score: Number(input.score || 0),
    wrong_ids: Array.isArray(input.wrong_ids) ? [...input.wrong_ids].sort((a, b) => Number(a) - Number(b)) : [],
    pack_id: input.pack_id || null,
    assignment_id: input.assignment_id || null
  });
}

function resolveNextAnalysisStatus(existingSession, nextResultHash) {
  const current = normalizeAnalysisStatus(existingSession?.analysis_status);
  const oldResultHash = normalizeOptionalText(existingSession?.result_hash);
  if (current === 'stale') return 'stale';
  if ((current === 'basic_ready' || current === 'premium_ready') && oldResultHash && nextResultHash && oldResultHash !== nextResultHash) {
    return 'stale';
  }
  return current || 'none';
}

async function getTableColumnSet(env, tableName) {
  let cache = columnCacheByEnv.get(env);
  if (!cache) {
    cache = {};
    columnCacheByEnv.set(env, cache);
  }
  if (cache[tableName]) return cache[tableName];
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) return new Set();
  try {
    const res = await env.DB.prepare(`PRAGMA table_info(${tableName})`).all();
    const set = new Set((res.results || []).map(row => row.name).filter(Boolean));
    cache[tableName] = set;
    return set;
  } catch (e) {
    console.warn('[assessment-meta] column check failed:', tableName, e);
    return new Set();
  }
}

async function hasClassExamAssignmentExclusions(env) {
  const columns = await getTableColumnSet(env, 'class_exam_assignment_exclusions');
  return columns.has('assignment_id') && columns.has('student_id');
}

async function isStudentExcludedFromAssignment(env, assignmentId, studentId) {
  if (!assignmentId || !studentId) return false;
  if (!(await hasClassExamAssignmentExclusions(env))) return false;
  try {
    const row = await env.DB.prepare(`
      SELECT 1
      FROM class_exam_assignment_exclusions
      WHERE assignment_id = ? AND student_id = ?
      LIMIT 1
    `).bind(assignmentId, studentId).first();
    return !!row;
  } catch (e) {
    console.warn('[assignment-exclusions] lookup failed:', e);
    return false;
  }
}

async function loadClassExamAssignmentById(env, assignmentId) {
  const id = normalizeOptionalText(assignmentId);
  if (!id) return null;
  try {
    return await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE id = ? LIMIT 1').bind(id).first();
  } catch (e) {
    console.warn('[assignment-exclusions] assignment lookup failed:', e);
    return null;
  }
}

async function ensureClassExamAssignmentForExclusion(env, input) {
  const direct = await loadClassExamAssignmentById(env, input.assignment_id);
  if (direct?.id) return direct;

  const meta = await resolveExamAssignmentMeta(env, input);
  const resolved = await loadClassExamAssignmentById(env, meta.assignment_id);
  if (resolved?.id) return resolved;

  const classId = normalizeOptionalText(input.class_id);
  const examTitle = normalizeOptionalText(input.exam_title);
  const examDate = normalizeOptionalText(input.exam_date);
  if (!classId || !examTitle || !examDate) return null;

  const archiveFile = normalizeAssignmentArchiveFile(input.archive_file || '');
  const assignmentColumns = await getTableColumnSet(env, 'class_exam_assignments');
  const assignmentMetaColumns = pickExistingColumns(assignmentColumns, ASSIGNMENT_META_COLUMNS);
  const assignmentMeta = {
    pack_id: normalizeOptionalText(input.pack_id),
    grade_label: normalizeOptionalText(input.grade_label),
    pack_hash: normalizeOptionalText(input.pack_hash),
    assignment_batch_id: normalizeOptionalText(input.assignment_batch_id),
    target_scope: normalizeTargetScope(input.target_scope),
    subject: normalizeOptionalText(input.subject)
  };
  const assignmentId = crypto.randomUUID();
  const insertColumns = [
    'id', 'class_id', 'exam_title', 'exam_date', 'question_count', 'archive_file', 'source_type',
    ...assignmentMetaColumns,
    'created_at', 'updated_at'
  ];
  const insertValues = [assignmentId, classId, examTitle, examDate, input.question_count || 0, archiveFile, input.source_type || 'archive'];
  for (const col of assignmentMetaColumns) insertValues.push(assignmentMeta[col]);

  await env.DB.prepare(`
    INSERT INTO class_exam_assignments (${insertColumns.join(', ')})
    VALUES (${insertValues.map(() => '?').join(', ')}, DATETIME('now'), DATETIME('now'))
    ON CONFLICT(class_id, exam_title, exam_date, archive_file) DO UPDATE SET
      question_count = COALESCE(excluded.question_count, class_exam_assignments.question_count),
      source_type = COALESCE(excluded.source_type, class_exam_assignments.source_type),
      ${assignmentMetaColumns.map(col => `${col} = COALESCE(excluded.${col}, class_exam_assignments.${col})`).join(',\n      ')}${assignmentMetaColumns.length ? ',' : ''}
      updated_at = DATETIME('now')
  `).bind(...insertValues).run();

  return (await loadClassExamAssignmentById(env, assignmentId)) || (await resolveAssignmentRow(env, {
    class_id: classId,
    exam_title: examTitle,
    exam_date: examDate,
    archive_file: archiveFile
  }));
}

async function resolveAssignmentRow(env, input) {
  const meta = await resolveExamAssignmentMeta(env, input);
  return await loadClassExamAssignmentById(env, meta.assignment_id);
}

async function loadClassAssignmentExclusions(env, assignmentIds) {
  const ids = Array.from(new Set((assignmentIds || []).map(id => String(id || '').trim()).filter(Boolean)));
  if (!ids.length || !(await hasClassExamAssignmentExclusions(env))) return [];
  try {
    const markers = ids.map(() => '?').join(',');
    const res = await env.DB.prepare(`
      SELECT assignment_id, student_id, reason
      FROM class_exam_assignment_exclusions
      WHERE assignment_id IN (${markers})
    `).bind(...ids).all();
    return res.results || [];
  } catch (e) {
    console.warn('[assignment-exclusions] list failed:', e);
    return [];
  }
}

async function refreshSubjectMismatchExclusions(env, assignment) {
  if (!assignment?.id || !assignment?.class_id) return;
  if (!(await hasClassExamAssignmentExclusions(env))) return;

  try {
    await env.DB.prepare(`
      DELETE FROM class_exam_assignment_exclusions
      WHERE assignment_id = ? AND reason = 'subject_mismatch'
    `).bind(assignment.id).run();

    const subject = normalizeAssignmentSubject(assignment.subject);
    if (!subject) return;

    const students = await env.DB.prepare(`
      SELECT s.id, s.high_subjects
      FROM students s
      JOIN class_students cs ON cs.student_id = s.id
      WHERE cs.class_id = ?
        AND s.status = '재원'
    `).bind(assignment.class_id).all();

    const stmts = [];
    for (const student of students.results || []) {
      const highSubjects = parseStudentHighSubjects(student.high_subjects);
      if (!highSubjects.length) continue;
      if (highSubjects.includes(subject)) continue;
      stmts.push(env.DB.prepare(`
        INSERT OR IGNORE INTO class_exam_assignment_exclusions (assignment_id, student_id, reason)
        VALUES (?, ?, 'subject_mismatch')
      `).bind(assignment.id, student.id));
    }
    if (stmts.length) await env.DB.batch(stmts);
  } catch (e) {
    console.warn('[assignment-exclusions] refresh failed:', e);
  }
}

async function cleanupAssignmentIfNoTargets(env, assignment) {
  if (!assignment?.id || !assignment?.class_id) return false;
  if (!(await hasClassExamAssignmentExclusions(env))) return false;

  try {
    const remainingTargets = await env.DB.prepare(`
      SELECT COUNT(*) AS count
      FROM class_students cs
      WHERE cs.class_id = ?
        AND NOT EXISTS (
          SELECT 1
          FROM class_exam_assignment_exclusions ex
          WHERE ex.assignment_id = ? AND ex.student_id = cs.student_id
        )
    `).bind(assignment.class_id, assignment.id).first();
    if (Number(remainingTargets?.count || 0) > 0) return false;

    const sessionColumns = await getTableColumnSet(env, 'exam_sessions');
    let remainingSessions = null;
    if (sessionColumns.has('assignment_id')) {
      remainingSessions = await env.DB.prepare(`
        SELECT COUNT(*) AS count
        FROM exam_sessions
        WHERE assignment_id = ?
          AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
      `).bind(assignment.id, assignment.class_id).first();
    }

    if (!remainingSessions) {
      const archiveCandidates = getAssignmentArchiveCandidates(assignment.archive_file || '');
      remainingSessions = archiveCandidates.length
        ? await env.DB.prepare(`
          SELECT COUNT(*) AS count
          FROM exam_sessions
          WHERE exam_date = ?
            AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
            AND archive_file IN (${archiveCandidates.map(() => '?').join(',')})
        `).bind(assignment.exam_date, assignment.class_id, ...archiveCandidates).first()
        : await env.DB.prepare(`
          SELECT COUNT(*) AS count
          FROM exam_sessions
          WHERE exam_title = ?
            AND exam_date = ?
            AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
        `).bind(assignment.exam_title, assignment.exam_date, assignment.class_id).first();
    }
    if (Number(remainingSessions?.count || 0) > 0) return false;

    await env.DB.batch([
      env.DB.prepare('DELETE FROM class_exam_assignment_exclusions WHERE assignment_id = ?').bind(assignment.id),
      env.DB.prepare('DELETE FROM class_exam_assignments WHERE id = ?').bind(assignment.id)
    ]);
    return true;
  } catch (e) {
    console.warn('[assignment-exclusions] empty assignment cleanup failed:', e);
    return false;
  }
}

function pickExistingColumns(columnSet, candidates) {
  return candidates.filter(name => columnSet.has(name));
}

async function resolveExamAssignmentMeta(env, input) {
  const assignmentId = normalizeOptionalText(input.assignment_id);
  const payloadPackId = normalizeOptionalText(input.pack_id);

  try {
    if (assignmentId) {
      const row = await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE id = ? LIMIT 1').bind(assignmentId).first();
      return { assignment_id: assignmentId, pack_id: payloadPackId || normalizeOptionalText(row?.pack_id) };
    }

    const classId = normalizeOptionalText(input.class_id);
    const examTitle = normalizeOptionalText(input.exam_title);
    const examDate = normalizeOptionalText(input.exam_date);
    const archiveFile = normalizeAssignmentArchiveFile(input.archive_file || '');
    if (!classId || !examDate || (!examTitle && !archiveFile)) {
      return { assignment_id: null, pack_id: payloadPackId };
    }

    let row = null;
    const archiveCandidates = getAssignmentArchiveCandidates(input.archive_file || archiveFile);
    if (archiveCandidates.length) {
      const markers = archiveCandidates.map(() => '?').join(',');
      row = await env.DB.prepare(`
        SELECT *
        FROM class_exam_assignments
        WHERE class_id = ?
          AND exam_date = ?
          AND archive_file IN (${markers})
        ORDER BY updated_at DESC
        LIMIT 1
      `).bind(classId, examDate, ...archiveCandidates).first();
    }

    if (!row && examTitle) {
      row = await env.DB.prepare(`
        SELECT *
        FROM class_exam_assignments
        WHERE class_id = ?
          AND exam_title = ?
          AND exam_date = ?
          AND archive_file = ?
        ORDER BY updated_at DESC
        LIMIT 1
      `).bind(classId, examTitle, examDate, archiveFile).first();
    }

    return {
      assignment_id: normalizeOptionalText(row?.id),
      pack_id: payloadPackId || normalizeOptionalText(row?.pack_id)
    };
  } catch (e) {
    console.warn('[assessment-meta] assignment lookup failed:', e);
    return { assignment_id: assignmentId, pack_id: payloadPackId };
  }
}

function buildExamSessionUpsert(env, sessionColumns, row) {
  const metaColumns = pickExistingColumns(sessionColumns, EXAM_SESSION_META_COLUMNS);
  const columns = [
    'id', 'student_id', 'exam_title', 'score', 'exam_date', 'question_count', 'class_id', 'archive_file',
    ...metaColumns,
    'updated_at'
  ];
  const values = [
    row.sessionId,
    row.studentId,
    row.examTitle,
    row.score,
    row.examDate,
    row.questionCount || 0,
    row.classId || null,
    row.archiveFile || null
  ];
  for (const col of metaColumns) {
    if (col === 'assignment_id') values.push(row.assignmentId || null);
    else if (col === 'pack_id') values.push(row.packId || null);
    else if (col === 'result_hash') values.push(row.resultHash || null);
    else if (col === 'analysis_status') values.push(normalizeAnalysisStatus(row.analysisStatus));
  }
  const updateSets = [
    'exam_title=excluded.exam_title',
    'score=excluded.score',
    'exam_date=excluded.exam_date',
    'question_count=excluded.question_count',
    'class_id=excluded.class_id',
    'archive_file=COALESCE(excluded.archive_file, exam_sessions.archive_file)'
  ];
  if (metaColumns.includes('assignment_id')) updateSets.push('assignment_id=COALESCE(excluded.assignment_id, exam_sessions.assignment_id)');
  if (metaColumns.includes('pack_id')) updateSets.push('pack_id=COALESCE(excluded.pack_id, exam_sessions.pack_id)');
  if (metaColumns.includes('result_hash')) updateSets.push('result_hash=excluded.result_hash');
  if (metaColumns.includes('analysis_status')) updateSets.push("analysis_status=COALESCE(excluded.analysis_status, exam_sessions.analysis_status, 'none')");
  updateSets.push('updated_at=excluded.updated_at');

  return env.DB.prepare(`
    INSERT INTO exam_sessions (${columns.join(', ')})
    VALUES (${values.map(() => '?').join(', ')}, DATETIME('now'))
    ON CONFLICT(id) DO UPDATE SET
      ${updateSets.join(',\n      ')}
  `).bind(...values);
}

async function loadExistingExamSession(env, sessionColumns, sessionId) {
  if (!sessionId || (!sessionColumns.has('result_hash') && !sessionColumns.has('analysis_status'))) return null;
  const columns = ['id'];
  if (sessionColumns.has('result_hash')) columns.push('result_hash');
  if (sessionColumns.has('analysis_status')) columns.push('analysis_status');
  try {
    return await env.DB.prepare(`SELECT ${columns.join(', ')} FROM exam_sessions WHERE id = ? LIMIT 1`).bind(sessionId).first();
  } catch (e) {
    console.warn('[assessment-meta] existing session lookup failed:', e);
    return null;
  }
}

async function findExistingExamSessionByIdentity(env, input = {}) {
  const studentId = normalizeOptionalText(input.student_id);
  const examTitle = normalizeOptionalText(input.exam_title);
  const examDate = normalizeOptionalText(input.exam_date);
  const archiveFile = normalizeAssignmentArchiveFile(input.archive_file || '');
  const questionCount = Math.max(0, Math.min(100, parseInt(input.question_count, 10) || 0));
  if (!studentId || !examDate) return null;

  try {
    if (archiveFile) {
      const archiveCandidates = getAssignmentArchiveCandidates(input.archive_file || archiveFile);
      if (archiveCandidates.length) {
        const markers = archiveCandidates.map(() => '?').join(',');
        const row = await env.DB.prepare(`
          SELECT *
          FROM exam_sessions
          WHERE student_id = ?
            AND exam_date = ?
            AND archive_file IN (${markers})
          ORDER BY updated_at DESC, created_at DESC
          LIMIT 1
        `).bind(studentId, examDate, ...archiveCandidates).first();
        if (row?.id) return row;
      }

      if (examTitle && questionCount) {
        const legacy = await env.DB.prepare(`
          SELECT *
          FROM exam_sessions
          WHERE student_id = ?
            AND exam_title = ?
            AND exam_date = ?
            AND COALESCE(question_count, 0) = ?
            AND TRIM(COALESCE(archive_file, '')) = ''
          ORDER BY updated_at DESC, created_at DESC
          LIMIT 1
        `).bind(studentId, examTitle, examDate, questionCount).first();
        if (legacy?.id) return legacy;
      }
    }

    if (!archiveFile && examTitle) {
      return await env.DB.prepare(`
        SELECT *
        FROM exam_sessions
        WHERE student_id = ?
          AND exam_title = ?
          AND exam_date = ?
          AND TRIM(COALESCE(archive_file, '')) = ''
        ORDER BY updated_at DESC, created_at DESC
        LIMIT 1
      `).bind(studentId, examTitle, examDate).first();
    }
  } catch (e) {
    console.warn('[exam-session-identity] existing session lookup failed:', e);
  }

  return null;
}

async function saveAssessmentResultItems(env, input) {
  const questionCount = Math.max(0, Math.min(100, parseInt(input.question_count, 10) || 0));
  if (!questionCount) return { skipped: true, reason: 'question_count_empty' };

  const resultColumns = await getTableColumnSet(env, 'assessment_result_items');
  if (!resultColumns.has('session_id') || !resultColumns.has('order_no')) {
    return { skipped: true, reason: 'assessment_result_items_unavailable' };
  }

  const archiveFile = String(input.archive_file || '').trim();
  const blueprintMap = new Map();
  if (archiveFile) {
    try {
      const res = await env.DB.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ?').bind(archiveFile).all();
      for (const bp of (res.results || [])) {
        const no = Number(bp.question_no || 0);
        if (no > 0) blueprintMap.set(no, bp);
      }
    } catch (e) {
      console.warn('[assessment-result-items] blueprint lookup failed:', e);
    }
  }

  const wrongIds = normalizeWrongIds(input.wrong_ids, questionCount);
  const wrongSet = new Set(wrongIds.map(v => Number(v)));
  const stmts = [
    env.DB.prepare('DELETE FROM assessment_result_items WHERE session_id = ? AND order_no > ?').bind(input.session_id, questionCount)
  ];

  for (let orderNo = 1; orderNo <= questionCount; orderNo++) {
    const blueprint = blueprintMap.get(orderNo) || {};
    const item = {
      session_id: input.session_id,
      assignment_id: input.assignment_id || null,
      pack_id: input.pack_id || blueprint.assessment_pack_id || null,
      student_id: input.student_id || null,
      class_id: input.class_id || null,
      order_no: orderNo,
      question_no: orderNo,
      result_status: wrongSet.has(orderNo) ? 'wrong' : 'correct',
      is_correct: wrongSet.has(orderNo) ? 0 : 1,
      student_answer: null,
      correct_answer: null,
      score: null,
      max_score: null,
      source_archive_file: blueprint.source_archive_file || null,
      source_question_no: blueprint.source_question_no || null,
      standard_unit_key: blueprint.standard_unit_key || null,
      standard_unit: blueprint.standard_unit || null,
      concept_cluster_key: blueprint.concept_cluster_key || null,
      type_key: blueprint.type_key || null,
      difficulty: blueprint.difficulty || null,
      analysis_note: null
    };

    const columns = RESULT_ITEM_COLUMNS.filter(col => resultColumns.has(col));
    const values = columns.map(col => item[col]);
    const updateColumns = columns.filter(col => !['session_id', 'order_no'].includes(col));

    stmts.push(env.DB.prepare(`
      INSERT INTO assessment_result_items (${columns.join(', ')}, created_at, updated_at)
      VALUES (${values.map(() => '?').join(', ')}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(session_id, order_no) DO UPDATE SET
        ${updateColumns.map(col => `${col} = excluded.${col}`).join(',\n        ')},
        updated_at = CURRENT_TIMESTAMP
    `).bind(...values));
  }

  if (stmts.length) await env.DB.batch(stmts);
  return { saved: stmts.length };
}

async function performExcludeStudent(env, currentTeacher, { classId, studentId, examTitle, examDate, archiveFile, rawInput }) {
  if (!classId || !studentId || !examTitle || !examDate) {
    return { success: false, student_id: studentId, error: 'class_id, student_id, exam_title, exam_date required', status: 400 };
  }
  if (!(await canAccessClass(currentTeacher, classId, env))) {
    return { success: false, student_id: studentId, error: 'Forbidden', status: 403 };
  }
  if (!(await canAccessStudent(currentTeacher, studentId, env))) {
    return { success: false, student_id: studentId, error: 'Forbidden', status: 403 };
  }
  if (!(await hasClassExamAssignmentExclusions(env))) {
    return { success: false, student_id: studentId, error: 'assignment exclusions table not available', status: 503 };
  }

  const assignment = await ensureClassExamAssignmentForExclusion(env, {
    ...rawInput,
    class_id: classId,
    student_id: studentId,
    exam_title: examTitle,
    exam_date: examDate,
    archive_file: archiveFile
  });
  if (!assignment?.id) {
    return { success: false, student_id: studentId, error: 'assignment not found', status: 404 };
  }
  if (String(assignment.class_id || '') !== classId) {
    return { success: false, student_id: studentId, error: 'assignment class mismatch', status: 400 };
  }

  const member = await env.DB.prepare(`
    SELECT 1
    FROM class_students
    WHERE class_id = ? AND student_id = ?
    LIMIT 1
  `).bind(classId, studentId).first();
  if (!member) {
    return { success: false, student_id: studentId, error: 'student is not in class', status: 400 };
  }

  const targets = archiveFile
    ? await env.DB.prepare(`
      SELECT id
      FROM exam_sessions
      WHERE exam_date = ?
        AND student_id = ?
        AND (archive_file = ? OR (COALESCE(archive_file, '') = '' AND exam_title = ?))
    `).bind(examDate, studentId, archiveFile, examTitle).all()
    : await env.DB.prepare(`
      SELECT id
      FROM exam_sessions
      WHERE exam_title = ?
        AND exam_date = ?
        AND student_id = ?
    `).bind(examTitle, examDate, studentId).all();

  const sessionIds = (targets.results || []).map(r => r.id).filter(Boolean);
  const stmts = [
    env.DB.prepare(`
      INSERT INTO class_exam_assignment_exclusions (assignment_id, student_id, reason)
      VALUES (?, ?, 'manual')
      ON CONFLICT(assignment_id, student_id) DO UPDATE SET reason = 'manual'
    `).bind(assignment.id, studentId)
  ];
  for (const sessionId of sessionIds) {
    stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sessionId));
    stmts.push(env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(sessionId));
  }
  await env.DB.batch(stmts);
  const assignment_deleted = await cleanupAssignmentIfNoTargets(env, assignment);

  return {
    success: true,
    student_id: studentId,
    assignment_id: assignment.id,
    deleted_session: sessionIds.length > 0,
    assignment_deleted
  };
}

export async function handleExams(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource === 'exam-blueprints') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      const d = await request.json();
      if (!d.archive_file) return jsonResponse({ error: 'archive_file required' }, 400);
      if (!Array.isArray(d.items)) return jsonResponse({ error: 'items must be an array' }, 400);

      const blueprintColumns = await getTableColumnSet(env, 'exam_blueprints');
      const blueprintMetaColumns = pickExistingColumns(blueprintColumns, BLUEPRINT_META_COLUMNS);
      const stmts = [];
      for (const item of d.items) {
        if (!item.question_no) continue;

        const src_archive_file = item.source_archive_file || d.archive_file;
        const src_question_no = item.source_question_no || item.question_no;
        const columns = [
          'archive_file', 'question_no', 'source_archive_file', 'source_question_no',
          'standard_unit_key', 'standard_unit', 'standard_course', 'concept_cluster_key',
          ...blueprintMetaColumns,
          'created_at', 'updated_at'
        ];
        const values = [
          d.archive_file, item.question_no, src_archive_file, src_question_no,
          item.standard_unit_key || null, item.standard_unit || null, item.standard_course || null, item.concept_cluster_key || null
        ];
        for (const col of blueprintMetaColumns) {
          if (col === 'assessment_pack_id') values.push(normalizeOptionalText(item.assessment_pack_id || d.assessment_pack_id));
          else values.push(normalizeOptionalText(item[col]));
        }
        const updateSets = [
          'source_archive_file=excluded.source_archive_file',
          'source_question_no=excluded.source_question_no',
          'standard_unit_key=excluded.standard_unit_key',
          'standard_unit=excluded.standard_unit',
          'standard_course=excluded.standard_course',
          'concept_cluster_key=excluded.concept_cluster_key',
          ...blueprintMetaColumns.map(col => `${col}=excluded.${col}`),
          "updated_at=DATETIME('now')"
        ];

        stmts.push(env.DB.prepare(`
          INSERT INTO exam_blueprints (
            ${columns.join(', ')}
          ) VALUES (${values.map(() => '?').join(', ')}, DATETIME('now'), DATETIME('now'))
          ON CONFLICT(archive_file, question_no) DO UPDATE SET
            ${updateSets.join(',\n            ')}
        `).bind(...values));
      }

      if (stmts.length > 0) {
        await env.DB.batch(stmts);
      }
      return jsonResponse({ success: true, count: stmts.length });
    }

    if (method === 'GET') {
      const file = url.searchParams.get('file');
      if (!file) return jsonResponse({ error: 'file parameter required' }, 400);

      const res = await env.DB.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ? ORDER BY question_no ASC').bind(file).all();
      return jsonResponse({ success: true, archive_file: file, items: res.results });
    }
  }

  if (resource === 'exam-analysis') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const archiveFile = normalizeAssignmentArchiveFile(url.searchParams.get('archive_file') || url.searchParams.get('file') || '');
      if (!archiveFile) return jsonResponse({ error: 'archive_file required' }, 400);
      const reviews = await env.DB.prepare(`
        SELECT *
        FROM exam_question_reviews
        WHERE archive_file = ?
        ORDER BY CAST(question_no AS INTEGER), question_no
      `).bind(archiveFile).all();
      const meta = await env.DB.prepare('SELECT * FROM exam_analysis_meta WHERE archive_file = ?').bind(archiveFile).first();
      return jsonResponse({
        success: true,
        archive_file: archiveFile,
        reviews: reviews.results || [],
        meta: meta || null
      });
    }

    if (method === 'POST') {
      const d = await request.json();
      const archiveFile = normalizeAssignmentArchiveFile(d.archive_file || d.file || '');
      if (!archiveFile) return jsonResponse({ error: 'archive_file required' }, 400);
      const updatedBy = currentTeacher.id || currentTeacher.name || 'teacher';
      const stmts = [];

      const metaPatch = d.meta && typeof d.meta === 'object' ? d.meta : d;
      if (Object.prototype.hasOwnProperty.call(metaPatch, 'overview_text')) {
        stmts.push(env.DB.prepare(`
          INSERT INTO exam_analysis_meta (archive_file, overview_text, updated_at, updated_by)
          VALUES (?, ?, datetime('now'), ?)
          ON CONFLICT(archive_file) DO UPDATE SET
            overview_text=excluded.overview_text,
            updated_at=datetime('now'),
            updated_by=excluded.updated_by
        `).bind(archiveFile, normalizeOptionalText(metaPatch.overview_text), updatedBy));
      }

      const reviewItems = Array.isArray(d.reviews) ? d.reviews : (d.question_no || d.questionNo ? [d] : []);
      for (const item of reviewItems) {
        const questionNo = String(item.question_no ?? item.questionNo ?? '').trim();
        if (!questionNo) continue;
        stmts.push(env.DB.prepare(`
          INSERT INTO exam_question_reviews (archive_file, question_no, review_text, answer, updated_at, updated_by)
          VALUES (?, ?, ?, ?, datetime('now'), ?)
          ON CONFLICT(archive_file, question_no) DO UPDATE SET
            review_text=excluded.review_text,
            answer=excluded.answer,
            updated_at=datetime('now'),
            updated_by=excluded.updated_by
        `).bind(
          archiveFile,
          questionNo,
          normalizeOptionalText(item.review_text ?? item.reviewText),
          normalizeOptionalText(item.answer),
          updatedBy
        ));
      }

      if (stmts.length) await env.DB.batch(stmts);
      return jsonResponse({ success: true, archive_file: archiveFile, count: stmts.length });
    }
  }

  if (resource === 'class-exam-assignments') {
    if (method === 'POST' && id === 'exclude-student') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const d = await request.json();
      const result = await performExcludeStudent(env, currentTeacher, {
        classId: normalizeOptionalText(d.class_id),
        studentId: normalizeOptionalText(d.student_id),
        examTitle: normalizeOptionalText(d.exam_title),
        examDate: normalizeOptionalText(d.exam_date),
        archiveFile: normalizeAssignmentArchiveFile(d.archive_file || ''),
        rawInput: d
      });
      const { status, ...body } = result;
      return jsonResponse(body, result.success ? 200 : (status || 400));
    }

    if (method === 'POST' && id === 'exclude-students') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const d = await request.json();
      const classId = normalizeOptionalText(d.class_id);
      const examTitle = normalizeOptionalText(d.exam_title);
      const examDate = normalizeOptionalText(d.exam_date);
      const archiveFile = normalizeAssignmentArchiveFile(d.archive_file || '');
      const studentIds = Array.from(new Set(
        (Array.isArray(d.student_ids) ? d.student_ids : [])
          .map(v => normalizeOptionalText(v))
          .filter(Boolean)
      ));

      if (!classId || !examTitle || !examDate || !studentIds.length) {
        return jsonResponse({ success: false, error: 'class_id, student_ids, exam_title, exam_date required' }, 400);
      }
      if (studentIds.length > 200) {
        return jsonResponse({ success: false, error: 'too many students in one request (max 200)' }, 400);
      }

      const results = [];
      for (const studentId of studentIds) {
        results.push(await performExcludeStudent(env, currentTeacher, {
          classId, studentId, examTitle, examDate, archiveFile, rawInput: d
        }));
      }

      return jsonResponse({
        success: results.every(r => r.success),
        results: results.map(({ status, ...rest }) => rest)
      });
    }

    if (method === 'GET' && id === 'roster') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const classId = normalizeOptionalText(url.searchParams.get('class_id'));
      if (!classId) return jsonResponse({ success: false, error: 'class_id required' }, 400);
      if (!(await canAccessClass(currentTeacher, classId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const examTitle = normalizeOptionalText(url.searchParams.get('exam_title')) || '';
      const examDate = normalizeOptionalText(url.searchParams.get('exam_date')) || '';
      const anchorDate = examDate || getBoardDateOffset('', 0);
      const absentFrom = getBoardDateOffset(anchorDate, -7);

      const res = await env.DB.prepare(`
        SELECT s.id, s.name, s.school_name,
          EXISTS(
            SELECT 1 FROM attendance a
            WHERE a.student_id = s.id AND a.status = '결석' AND a.date BETWEEN ? AND ?
          ) AS recently_absent,
          EXISTS(
            SELECT 1 FROM exam_sessions es
            WHERE es.student_id = s.id AND es.exam_title = ? AND es.exam_date = ?
          ) AS already_submitted
        FROM students s
        WHERE s.id IN (SELECT student_id FROM class_students WHERE class_id = ?)
          AND s.status = '재원'
        ORDER BY s.name COLLATE NOCASE
      `).bind(absentFrom, anchorDate, examTitle, examDate, classId).all();

      const students = (res.results || []).map(r => ({
        id: r.id,
        name: r.name,
        school_name: r.school_name,
        recently_absent: !!r.recently_absent,
        already_submitted: !!r.already_submitted
      }));

      return jsonResponse({ success: true, class_id: classId, students });
    }

    if (method === 'GET' && id === 'board') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const grade = normalizeBoardGrade(url.searchParams.get('grade') || '');
      if (!grade) return jsonResponse({ success: false, error: 'grade required' }, 400);

      const to = normalizeBoardDate(url.searchParams.get('to')) || getBoardDateOffset('', 0);
      const from = normalizeBoardDate(url.searchParams.get('from')) || getBoardDateOffset(to, -30);
      const mineKey = normalizeBoardGrade(currentTeacher.name || '');

      const res = await env.DB.prepare(`
        SELECT
          a.*,
          c.name AS class_name,
          c.grade AS class_grade,
          c.teacher_name AS class_teacher_name
        FROM class_exam_assignments a
        JOIN classes c ON c.id = a.class_id
        WHERE (c.is_active != 0 OR c.is_active IS NULL)
          AND REPLACE(COALESCE(c.grade, ''), ' ', '') = ?
          AND SUBSTR(COALESCE(a.exam_date, ''), 1, 10) BETWEEN ? AND ?
        ORDER BY a.exam_date DESC, c.teacher_name ASC, c.name ASC, a.updated_at DESC
        LIMIT 1000
      `).bind(grade, from, to).all();

      const rows = dedupeClassExamAssignments(res.results || []).map(row => {
        const ownerName = String(row.class_teacher_name || row.teacher_name || '').trim();
        const ownerKey = normalizeBoardGrade(ownerName);
        return {
          ...row,
          teacher_name: ownerName,
          owner_name: ownerName,
          is_mine: !!(mineKey && ownerKey && mineKey === ownerKey),
          can_manage: isAdminUser(currentTeacher) || !!(mineKey && ownerKey && mineKey === ownerKey)
        };
      });

      return jsonResponse({ success: true, from, to, grade, assignments: rows });
    }

    if (method === 'POST') {
      const d = await request.json();
      if (!d.class_id || !d.exam_title || !d.exam_date) {
        return jsonResponse({ success: false, error: 'class_id, exam_title, exam_date required' }, 400);
      }

      const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ? LIMIT 1').bind(d.class_id).first();
      if (!cls) {
        return jsonResponse({ success: false, error: 'class not found' }, 404);
      }

      const archive_file = normalizeAssignmentArchiveFile(d.archive_file || '');
      const source_type = d.source_type || 'archive';
      const aid = crypto.randomUUID();
      const assignmentColumns = await getTableColumnSet(env, 'class_exam_assignments');
      const assignmentMetaColumns = pickExistingColumns(assignmentColumns, ASSIGNMENT_META_COLUMNS);
      const assignmentMeta = {
        pack_id: normalizeOptionalText(d.pack_id),
        grade_label: normalizeOptionalText(d.grade_label),
        pack_hash: normalizeOptionalText(d.pack_hash),
        assignment_batch_id: normalizeOptionalText(d.assignment_batch_id),
        target_scope: normalizeTargetScope(d.target_scope),
        subject: normalizeOptionalText(d.subject)
      };
      const subjectInputProvided = Object.prototype.hasOwnProperty.call(d, 'subject') && String(d.subject ?? '').trim();
      const updateSets = [
        'exam_title = ?',
        'question_count = ?',
        'archive_file = ?',
        'source_type = ?',
        ...assignmentMetaColumns.map(col => `${col} = COALESCE(?, ${col})`),
        "updated_at = DATETIME('now')"
      ];

      let existing = null;
      const archiveCandidates = getAssignmentArchiveCandidates(d.archive_file || archive_file);
      if (archiveCandidates.length) {
        const markers = archiveCandidates.map(() => '?').join(',');
        existing = await env.DB.prepare(`
          SELECT *
          FROM class_exam_assignments
          WHERE class_id = ?
            AND exam_date = ?
            AND archive_file IN (${markers})
          ORDER BY updated_at DESC
          LIMIT 1
        `).bind(d.class_id, d.exam_date, ...archiveCandidates).first();
      }

      if (
        !existing &&
        assignmentColumns.has('pack_id') &&
        assignmentColumns.has('pack_hash') &&
        assignmentMeta.pack_id &&
        assignmentMeta.pack_hash
      ) {
        existing = await env.DB.prepare(`
          SELECT *
          FROM class_exam_assignments
          WHERE class_id = ?
            AND exam_date = ?
            AND pack_id = ?
            AND pack_hash = ?
          ORDER BY updated_at DESC
          LIMIT 1
        `).bind(d.class_id, d.exam_date, assignmentMeta.pack_id, assignmentMeta.pack_hash).first();
      }

      if (!existing && !archive_file) {
        existing = await env.DB.prepare(`
          SELECT *
          FROM class_exam_assignments
          WHERE class_id = ?
            AND exam_title = ?
            AND exam_date = ?
            AND TRIM(COALESCE(archive_file, '')) = ''
          ORDER BY updated_at DESC
          LIMIT 1
        `).bind(d.class_id, d.exam_title, d.exam_date).first();
      }

      if (existing?.id) {
        await env.DB.prepare(`
          UPDATE class_exam_assignments
          SET ${updateSets.join(',\n              ')}
          WHERE id = ?
        `).bind(
          d.exam_title,
          d.question_count || 0,
          archive_file,
          source_type,
          ...assignmentMetaColumns.map(col => assignmentMeta[col]),
          existing.id
        ).run();

        const assignment = await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE id = ? LIMIT 1')
          .bind(existing.id).first();
        if (subjectInputProvided) await refreshSubjectMismatchExclusions(env, assignment);
        if (archive_file) await syncExamBlueprintsFromArchive(env, archive_file);
        return jsonResponse({ success: true, assignment });
      }

      const insertColumns = [
        'id', 'class_id', 'exam_title', 'exam_date', 'question_count', 'archive_file', 'source_type',
        ...assignmentMetaColumns,
        'created_at', 'updated_at'
      ];
      const insertValues = [aid, d.class_id, d.exam_title, d.exam_date, d.question_count || 0, archive_file, source_type];
      for (const col of assignmentMetaColumns) insertValues.push(assignmentMeta[col]);
      const conflictUpdateSets = [
        'question_count = excluded.question_count',
        'source_type = excluded.source_type',
        ...assignmentMetaColumns.map(col => `${col} = COALESCE(excluded.${col}, class_exam_assignments.${col})`),
        "updated_at = DATETIME('now')"
      ];

      await env.DB.prepare(`
        INSERT INTO class_exam_assignments (${insertColumns.join(', ')})
        VALUES (${insertValues.map(() => '?').join(', ')}, DATETIME('now'), DATETIME('now'))
        ON CONFLICT(class_id, exam_title, exam_date, archive_file) DO UPDATE SET
          ${conflictUpdateSets.join(',\n          ')}
      `).bind(...insertValues).run();

      let assignment = await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE id = ? LIMIT 1')
        .bind(aid).first();

      if (!assignment && archive_file) {
        assignment = await env.DB.prepare(`
          SELECT *
          FROM class_exam_assignments
          WHERE class_id = ?
            AND exam_date = ?
            AND archive_file = ?
          ORDER BY updated_at DESC
          LIMIT 1
        `).bind(d.class_id, d.exam_date, archive_file).first();
      }

      if (
        !assignment &&
        assignmentColumns.has('pack_id') &&
        assignmentColumns.has('pack_hash') &&
        assignmentMeta.pack_id &&
        assignmentMeta.pack_hash
      ) {
        assignment = await env.DB.prepare(`
          SELECT *
          FROM class_exam_assignments
          WHERE class_id = ?
            AND exam_date = ?
            AND pack_id = ?
            AND pack_hash = ?
          ORDER BY updated_at DESC
          LIMIT 1
        `).bind(d.class_id, d.exam_date, assignmentMeta.pack_id, assignmentMeta.pack_hash).first();
      }

      if (!assignment) {
        assignment = await env.DB.prepare(`
          SELECT *
          FROM class_exam_assignments
          WHERE class_id = ?
            AND exam_title = ?
            AND exam_date = ?
            AND TRIM(COALESCE(archive_file, '')) = ?
          ORDER BY updated_at DESC
          LIMIT 1
        `).bind(d.class_id, d.exam_title, d.exam_date, archive_file).first();
      }

      if (assignment && assignmentMeta.subject) await refreshSubjectMismatchExclusions(env, assignment);
      if (archive_file) await syncExamBlueprintsFromArchive(env, archive_file);
      return jsonResponse({ success: true, assignment });
    }

    if (method === 'GET') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const classId = url.searchParams.get('class');
      if (!classId) return jsonResponse({ success: false, error: 'classId required' }, 400);
      if (!(await canAccessClass(currentTeacher, classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

      const res = await env.DB.prepare(`
        SELECT * FROM class_exam_assignments
        WHERE class_id = ?
        ORDER BY exam_date DESC, updated_at DESC
      `).bind(classId).all();

      const assignments = dedupeClassExamAssignments(res.results || []);
      const exclusions = await loadClassAssignmentExclusions(env, assignments.map(a => a.id));
      // 이 시험이 배정된 시점에 blueprint 동기화가 안 됐던 옛 데이터를 여기서 한 번만 소급 채운다
      // (이미 동기화된 archive_file은 syncExamBlueprintsFromArchive 내부에서 즉시 스킵되므로 이후 요청은 거의 비용이 없다).
      const archiveFilesToSync = [...new Set(assignments.map(a => a.archive_file).filter(Boolean))];
      await Promise.all(archiveFilesToSync.map(file => syncExamBlueprintsFromArchive(env, file)));
      return jsonResponse({ success: true, assignments, exclusions });
    }
  }

  if (resource === 'exam-sessions') {
    if (method === 'DELETE' && id === 'by-exam') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const classId = url.searchParams.get('class') || '';
      const examTitle = url.searchParams.get('exam') || '';
      const examDate = url.searchParams.get('date') || '';
      const archiveFile = normalizeAssignmentArchiveFile(url.searchParams.get('archive') || '');
      const assignmentId = normalizeOptionalText(url.searchParams.get('assignment'));

      if (!classId || !examTitle || !examDate) {
        return jsonResponse({ success: false, error: 'class, exam, date required' }, 400);
      }
      if (!(await canAccessClass(currentTeacher, classId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const sessionColumns = await getTableColumnSet(env, 'exam_sessions');
      const archiveCandidates = getAssignmentArchiveCandidates(url.searchParams.get('archive') || archiveFile);
      let targets = { results: [] };
      if (assignmentId && sessionColumns.has('assignment_id')) {
        targets = await env.DB.prepare(`
          SELECT id
          FROM exam_sessions
          WHERE assignment_id = ?
            AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
        `).bind(assignmentId, classId).all();
      }
      if (!(targets.results || []).length) {
        targets = archiveCandidates.length
          ? await env.DB.prepare(`
            SELECT id
            FROM exam_sessions
            WHERE exam_date = ?
              AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
              AND (archive_file IN (${archiveCandidates.map(() => '?').join(',')}) OR (COALESCE(archive_file, '') = '' AND exam_title = ?))
          `).bind(examDate, classId, ...archiveCandidates, examTitle).all()
          : await env.DB.prepare(`
            SELECT id
            FROM exam_sessions
            WHERE exam_title = ?
              AND exam_date = ?
              AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
          `).bind(examTitle, examDate, classId).all();
      }

      const sessionIds = (targets.results || []).map(r => r.id).filter(Boolean);
      const stmts = [];

      for (const sessionId of sessionIds) {
        stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sessionId));
        stmts.push(env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(sessionId));
      }

      let assignmentTargets = { results: [] };
      if (assignmentId) {
        assignmentTargets = await env.DB.prepare(`
          SELECT id
          FROM class_exam_assignments
          WHERE id = ? AND class_id = ?
        `).bind(assignmentId, classId).all();
      }
      if (!(assignmentTargets.results || []).length) {
        assignmentTargets = archiveCandidates.length
          ? await env.DB.prepare(`
            SELECT id
            FROM class_exam_assignments
            WHERE class_id = ? AND exam_date = ? AND archive_file IN (${archiveCandidates.map(() => '?').join(',')})
          `).bind(classId, examDate, ...archiveCandidates).all()
          : await env.DB.prepare(`
            SELECT id
            FROM class_exam_assignments
            WHERE class_id = ? AND exam_title = ? AND exam_date = ?
          `).bind(classId, examTitle, examDate).all();
      }
      const assignmentIds = (assignmentTargets.results || []).map(r => r.id).filter(Boolean);
      if (assignmentIds.length && await hasClassExamAssignmentExclusions(env)) {
        const assignmentMarkers = assignmentIds.map(() => '?').join(',');
        stmts.push(env.DB.prepare(`
          DELETE FROM class_exam_assignment_exclusions
          WHERE assignment_id IN (${assignmentMarkers})
        `).bind(...assignmentIds));
      }

      if (assignmentIds.length) {
        const assignmentMarkers = assignmentIds.map(() => '?').join(',');
        stmts.push(env.DB.prepare(`DELETE FROM class_exam_assignments WHERE id IN (${assignmentMarkers})`).bind(...assignmentIds));
      }

      if (stmts.length > 0) {
        await env.DB.batch(stmts);
      }

      return jsonResponse({ success: true, deleted: sessionIds.length });
    }

    if (method === 'GET' && id === 'by-class') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
      const classId = url.searchParams.get('class');
      const examTitle = url.searchParams.get('exam') || null;
      if (!classId) return jsonResponse({ error: 'class required', students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [], exclusions: [] }, 400);
      if (!(await canAccessClass(currentTeacher, classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

      const studentIds = await env.DB.prepare('SELECT student_id FROM class_students WHERE class_id = ?').bind(classId).all();
      const sIds = studentIds.results.map(r => r.student_id);
      if (!sIds.length) return jsonResponse({ students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [], exclusions: [] });

      const p = sIds.map(() => '?').join(',');
      const [students, sessions, wrongs, assignments] = await Promise.all([
        env.DB.prepare(`SELECT id, name, school_name, grade FROM students WHERE id IN (${p}) AND status='재원'`).bind(...sIds).all(),
        examTitle ? env.DB.prepare('SELECT * FROM exam_sessions WHERE class_id = ? AND exam_title = ? ORDER BY exam_date DESC').bind(classId, examTitle).all() : env.DB.prepare('SELECT * FROM exam_sessions WHERE class_id = ? ORDER BY exam_date DESC LIMIT 200').bind(classId).all(),
        env.DB.prepare(`SELECT * FROM wrong_answers WHERE student_id IN (${p})`).bind(...sIds).all(),
        env.DB.prepare('SELECT * FROM class_exam_assignments WHERE class_id = ? ORDER BY exam_date DESC, updated_at DESC').bind(classId).all()
      ]);

      const archiveFiles = [...new Set(
        (sessions.results || [])
          .map(s => s.archive_file)
          .filter(v => v && String(v).trim())
      )];

      let blueprints = { results: [] };
      if (archiveFiles.length > 0) {
        const bpMarkers = archiveFiles.map(() => '?').join(',');
        blueprints = await env.DB.prepare(`
          SELECT *
          FROM exam_blueprints
          WHERE archive_file IN (${bpMarkers})
          ORDER BY archive_file ASC, question_no ASC
        `).bind(...archiveFiles).all();
      }

      const dedupedAssignments = dedupeClassExamAssignments(assignments.results || []);
      const exclusions = await loadClassAssignmentExclusions(env, dedupedAssignments.map(a => a.id));

      return jsonResponse({
        students: students.results,
        sessions: sessions.results,
        wrong_answers: wrongs.results,
        blueprints: blueprints.results,
        assignments: dedupedAssignments,
        exclusions
      });
    }

    if (method === 'GET' && id === 'by-grade') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
      if (!isStaffUser(currentTeacher)) return jsonResponse({ error: 'Forbidden' }, 403);

      const baseClassId = normalizeOptionalText(url.searchParams.get('class') || url.searchParams.get('class_id'));
      const from = normalizeBoardDate(url.searchParams.get('from')) || '2026-06-01';
      const to = normalizeBoardDate(url.searchParams.get('to')) || getBoardDateOffset('', 0);
      if (!baseClassId) {
        return jsonResponse({ error: 'class required', classes: [], class_students: [], students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [], exclusions: [] }, 400);
      }
      if (!(await canAccessClass(currentTeacher, baseClassId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const baseClass = await env.DB.prepare('SELECT id, grade FROM classes WHERE id = ? LIMIT 1').bind(baseClassId).first();
      if (!baseClass) {
        return jsonResponse({ error: 'class not found', classes: [], class_students: [], students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [], exclusions: [] }, 404);
      }
      const grade = normalizeBoardGrade(baseClass.grade || '');
      if (!grade) {
        return jsonResponse({ error: 'grade required', classes: [], class_students: [], students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [], exclusions: [] }, 400);
      }

      const classRes = await env.DB.prepare(`
        SELECT *
        FROM classes
        WHERE (is_active != 0 OR is_active IS NULL)
          AND REPLACE(COALESCE(grade, ''), ' ', '') = ?
        ORDER BY teacher_name ASC, name ASC
      `).bind(grade).all();
      const classes = classRes.results || [];
      const classIds = classes.map(row => String(row.id || '').trim()).filter(Boolean);
      if (!classIds.length) {
        return jsonResponse({ success: true, grade, from, to, classes: [], class_students: [], students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [], exclusions: [] });
      }

      const classMarkers = classIds.map(() => '?').join(',');
      const [classStudentsRes, assignmentsRes, sessionsRes] = await Promise.all([
        env.DB.prepare(`
          SELECT *
          FROM class_students
          WHERE class_id IN (${classMarkers})
        `).bind(...classIds).all(),
        env.DB.prepare(`
          SELECT *
          FROM class_exam_assignments
          WHERE class_id IN (${classMarkers})
            AND SUBSTR(COALESCE(exam_date, created_at, updated_at, ''), 1, 10) BETWEEN ? AND ?
          ORDER BY exam_date DESC, updated_at DESC
        `).bind(...classIds, from, to).all(),
        env.DB.prepare(`
          SELECT *
          FROM exam_sessions
          WHERE class_id IN (${classMarkers})
            AND SUBSTR(COALESCE(exam_date, created_at, updated_at, ''), 1, 10) BETWEEN ? AND ?
          ORDER BY exam_date DESC, id DESC
          LIMIT 2000
        `).bind(...classIds, from, to).all()
      ]);

      const classStudents = classStudentsRes.results || [];
      const studentIds = [...new Set(classStudents.map(row => String(row.student_id || '').trim()).filter(Boolean))];
      let students = { results: [] };
      if (studentIds.length) {
        const studentMarkers = studentIds.map(() => '?').join(',');
        students = await env.DB.prepare(`
          SELECT id, name, school_name, grade, status
          FROM students
          WHERE id IN (${studentMarkers})
            AND COALESCE(status, '재원') IN ('재원', 'active')
        `).bind(...studentIds).all();
      }

      const sessionIds = [...new Set((sessionsRes.results || []).map(row => String(row.id || '').trim()).filter(Boolean))];
      let wrongs = { results: [] };
      if (sessionIds.length) {
        const sessionMarkers = sessionIds.map(() => '?').join(',');
        wrongs = await env.DB.prepare(`
          SELECT *
          FROM wrong_answers
          WHERE session_id IN (${sessionMarkers})
        `).bind(...sessionIds).all();
      }

      const archiveFiles = [...new Set([
        ...(sessionsRes.results || []).map(row => row.archive_file),
        ...(assignmentsRes.results || []).map(row => row.archive_file)
      ].map(value => normalizeAssignmentArchiveFile(value || '')).filter(Boolean))];

      // 옛 데이터 소급 동기화(이미 동기화된 archive_file은 즉시 스킵됨).
      await Promise.all(archiveFiles.map(file => syncExamBlueprintsFromArchive(env, file)));

      let blueprints = { results: [] };
      if (archiveFiles.length > 0) {
        const bpMarkers = archiveFiles.map(() => '?').join(',');
        blueprints = await env.DB.prepare(`
          SELECT *
          FROM exam_blueprints
          WHERE archive_file IN (${bpMarkers})
          ORDER BY archive_file ASC, question_no ASC
        `).bind(...archiveFiles).all();
      }

      const dedupedAssignments = dedupeClassExamAssignments(assignmentsRes.results || []);
      const exclusions = await loadClassAssignmentExclusions(env, dedupedAssignments.map(a => a.id));

      return jsonResponse({
        success: true,
        grade,
        from,
        to,
        classes,
        class_students: classStudents,
        students: students.results || [],
        sessions: sessionsRes.results || [],
        wrong_answers: wrongs.results || [],
        blueprints: blueprints.results || [],
        assignments: dedupedAssignments,
        exclusions
      });
    }

    if (method === 'POST' && id === 'bulk-omr') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const d = await request.json();
      const examTitle = String(d.exam_title || '').trim();
      const examDate = String(d.exam_date || '').trim();
      const questionCount = Math.max(1, Math.min(80, parseInt(d.question_count, 10) || 0));
      const archiveFile = normalizeAssignmentArchiveFile(d.archive_file || '');
      const rows = Array.isArray(d.rows) ? d.rows : [];
      const sessionColumns = await getTableColumnSet(env, 'exam_sessions');

      if (!examTitle || !examDate || !questionCount) {
        return jsonResponse({ success: false, error: 'exam_title, exam_date, question_count required' }, 400);
      }
      if (!rows.length) {
        return jsonResponse({ success: false, error: 'rows required' }, 400);
      }

      const sessionRows = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] || {};
        const studentId = String(row.student_id || '').trim();
        if (!studentId) continue;

        if (!(await canAccessStudent(currentTeacher, studentId, env))) {
          return jsonResponse({ error: 'Forbidden', student_id: studentId }, 403);
        }

        const classId = String(row.class_id || '').trim() || null;
        if (classId && !(await canAccessClass(currentTeacher, classId, env))) {
          return jsonResponse({ error: 'Forbidden', class_id: classId }, 403);
        }

        const wrongIds = normalizeWrongIds(row.wrong_ids, questionCount);

        const existing = await findExistingExamSessionByIdentity(env, {
          student_id: studentId,
          exam_title: examTitle,
          exam_date: examDate,
          question_count: questionCount,
          archive_file: d.archive_file || archiveFile
        });

        const sessionId = existing?.id || `ex_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`;
        const score = Math.round(((questionCount - wrongIds.length) / questionCount) * 100);
        const existingSession = existing?.id ? await loadExistingExamSession(env, sessionColumns, existing.id) : null;
        const assignmentMeta = await resolveExamAssignmentMeta(env, {
          assignment_id: row.assignment_id || d.assignment_id,
          pack_id: row.pack_id || d.pack_id,
          class_id: classId,
          exam_title: examTitle,
          exam_date: examDate,
          archive_file: archiveFile
        });
        const resultHash = row.result_hash || d.result_hash || buildResultHash({
          student_id: studentId,
          class_id: classId,
          exam_title: examTitle,
          exam_date: examDate,
          archive_file: archiveFile,
          question_count: questionCount,
          score,
          wrong_ids: wrongIds,
          pack_id: assignmentMeta.pack_id,
          assignment_id: assignmentMeta.assignment_id
        });
        sessionRows.push({
          sessionId,
          studentId,
          classId,
          wrongIds,
          score,
          assignmentId: assignmentMeta.assignment_id,
          packId: assignmentMeta.pack_id,
          resultHash,
          analysisStatus: resolveNextAnalysisStatus(existingSession, resultHash)
        });
      }

      if (!sessionRows.length) {
        return jsonResponse({ success: false, error: 'valid rows required' }, 400);
      }

      const stmts = [];
      for (const row of sessionRows) {
        stmts.push(buildExamSessionUpsert(env, sessionColumns, {
          ...row,
          examTitle,
          examDate,
          questionCount,
          archiveFile
        }));
        stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(row.sessionId));
        for (const qId of row.wrongIds) {
          stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(row.sessionId, qId, row.studentId));
        }
      }

      await env.DB.batch(stmts);
      for (const row of sessionRows) {
        await saveAssessmentResultItems(env, {
          session_id: row.sessionId,
          assignment_id: row.assignmentId,
          pack_id: row.packId,
          student_id: row.studentId,
          class_id: row.classId,
          exam_title: examTitle,
          exam_date: examDate,
          archive_file: archiveFile,
          question_count: questionCount,
          score: row.score,
          wrong_ids: row.wrongIds,
          result_hash: row.resultHash
        });
      }
      return jsonResponse({ success: true, saved: sessionRows.length });
    }

    if (method === 'PATCH') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
      const d = await request.json();
      if (!(await canAccessStudent(currentTeacher, d.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      const sessionColumns = await getTableColumnSet(env, 'exam_sessions');
      const questionCount = d.question_count || 0;
      const wrongIds = normalizeWrongIds(d.wrong_ids, Math.max(1, Math.min(80, parseInt(questionCount, 10) || 80)));
      const archiveFile = normalizeAssignmentArchiveFile(d.archive_file || '');
      const existingByIdentity = id === 'new' ? await findExistingExamSessionByIdentity(env, {
        student_id: d.student_id,
        exam_title: d.exam_title,
        exam_date: d.exam_date,
        question_count: questionCount,
        archive_file: d.archive_file || archiveFile
      }) : null;
      const sid = id === 'new' ? (existingByIdentity?.id || `ex_${Date.now()}`) : id;
      const existingSession = existingByIdentity?.id
        ? await loadExistingExamSession(env, sessionColumns, existingByIdentity.id)
        : (id === 'new' ? null : await loadExistingExamSession(env, sessionColumns, sid));
      const assignmentMeta = await resolveExamAssignmentMeta(env, {
        assignment_id: d.assignment_id,
        pack_id: d.pack_id,
        class_id: d.class_id || null,
        exam_title: d.exam_title,
        exam_date: d.exam_date,
        archive_file: archiveFile
      });
      if (assignmentMeta.assignment_id && await isStudentExcludedFromAssignment(env, assignmentMeta.assignment_id, d.student_id)) {
        return jsonResponse({ success: false, error: 'assignment excluded for student' }, 403);
      }
      const resultHash = d.result_hash || buildResultHash({
        student_id: d.student_id,
        class_id: d.class_id || null,
        exam_title: d.exam_title,
        exam_date: d.exam_date,
        archive_file: archiveFile,
        question_count: questionCount,
        score: d.score,
        wrong_ids: wrongIds,
        pack_id: assignmentMeta.pack_id,
        assignment_id: assignmentMeta.assignment_id
      });
      const analysisStatus = resolveNextAnalysisStatus(existingSession, resultHash);
      const stmts = [
        buildExamSessionUpsert(env, sessionColumns, {
          sessionId: sid,
          studentId: d.student_id,
          examTitle: d.exam_title,
          score: d.score,
          examDate: d.exam_date,
          questionCount,
          classId: d.class_id || null,
          archiveFile,
          assignmentId: assignmentMeta.assignment_id,
          packId: assignmentMeta.pack_id,
          resultHash,
          analysisStatus
        }),
        env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sid)
      ];
      for (const qId of wrongIds) stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(sid, qId, d.student_id));
      await env.DB.batch(stmts);
      await saveAssessmentResultItems(env, {
        session_id: sid,
        assignment_id: assignmentMeta.assignment_id,
        pack_id: assignmentMeta.pack_id,
        student_id: d.student_id,
        class_id: d.class_id || null,
        exam_title: d.exam_title,
        exam_date: d.exam_date,
        archive_file: archiveFile,
        question_count: questionCount,
        score: d.score,
        wrong_ids: wrongIds,
        result_hash: resultHash
      });
      return jsonResponse({ success: true, id: sid });
    }

    if (method === 'DELETE' && path[3] === 'wrongs') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
      if (!session) return jsonResponse({ success: false, error: 'session not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, session.student_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      await env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id).run();
      return jsonResponse({ success: true });
    }

    if (method === 'DELETE') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
      if (!session) return jsonResponse({ success: false, error: 'session not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, session.student_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      await env.DB.batch([
        env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id),
        env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(id)
      ]);
      return jsonResponse({ success: true });
    }
  }

  return null;
}
