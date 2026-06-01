import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, canAccessStudent } from '../helpers/foundation-db.js';
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

const ASSIGNMENT_META_COLUMNS = ['pack_id', 'grade_label', 'pack_hash', 'assignment_batch_id', 'target_scope'];
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
    const archiveFile = String(input.archive_file || '').trim();
    if (!classId || !examTitle || !examDate || !archiveFile) {
      return { assignment_id: null, pack_id: payloadPackId };
    }

    const row = await env.DB.prepare(`
      SELECT *
      FROM class_exam_assignments
      WHERE class_id = ?
        AND exam_title = ?
        AND exam_date = ?
        AND archive_file = ?
      ORDER BY updated_at DESC
      LIMIT 1
    `).bind(classId, examTitle, examDate, archiveFile).first();

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

  if (resource === 'class-exam-assignments') {
    if (method === 'POST') {
      const d = await request.json();
      if (!d.class_id || !d.exam_title || !d.exam_date) {
        return jsonResponse({ success: false, error: 'class_id, exam_title, exam_date required' }, 400);
      }

      const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ? LIMIT 1').bind(d.class_id).first();
      if (!cls) {
        return jsonResponse({ success: false, error: 'class not found' }, 404);
      }

      const archive_file = d.archive_file || '';
      const source_type = d.source_type || 'archive';
      const aid = crypto.randomUUID();
      const assignmentColumns = await getTableColumnSet(env, 'class_exam_assignments');
      const assignmentMetaColumns = pickExistingColumns(assignmentColumns, ASSIGNMENT_META_COLUMNS);
      const assignmentMeta = {
        pack_id: normalizeOptionalText(d.pack_id),
        grade_label: normalizeOptionalText(d.grade_label),
        pack_hash: normalizeOptionalText(d.pack_hash),
        assignment_batch_id: normalizeOptionalText(d.assignment_batch_id),
        target_scope: normalizeTargetScope(d.target_scope)
      };
      const insertColumns = [
        'id', 'class_id', 'exam_title', 'exam_date', 'question_count', 'archive_file', 'source_type',
        ...assignmentMetaColumns,
        'created_at', 'updated_at'
      ];
      const insertValues = [aid, d.class_id, d.exam_title, d.exam_date, d.question_count || 0, archive_file, source_type];
      for (const col of assignmentMetaColumns) insertValues.push(assignmentMeta[col]);
      const updateSets = [
        'question_count = excluded.question_count',
        'source_type = excluded.source_type',
        ...assignmentMetaColumns.map(col => `${col} = COALESCE(excluded.${col}, class_exam_assignments.${col})`),
        "updated_at = DATETIME('now')"
      ];

      await env.DB.prepare(`
        INSERT INTO class_exam_assignments (${insertColumns.join(', ')})
        VALUES (${insertValues.map(() => '?').join(', ')}, DATETIME('now'), DATETIME('now'))
        ON CONFLICT(class_id, exam_title, exam_date, archive_file) DO UPDATE SET
          ${updateSets.join(',\n          ')}
      `).bind(...insertValues).run();

      const assignment = await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE class_id = ? AND exam_title = ? AND exam_date = ? AND archive_file = ?')
        .bind(d.class_id, d.exam_title, d.exam_date, archive_file).first();

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

      return jsonResponse({ success: true, assignments: res.results });
    }
  }

  if (resource === 'exam-sessions') {
    if (method === 'DELETE' && id === 'by-exam') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const classId = url.searchParams.get('class') || '';
      const examTitle = url.searchParams.get('exam') || '';
      const examDate = url.searchParams.get('date') || '';

      if (!classId || !examTitle || !examDate) {
        return jsonResponse({ success: false, error: 'class, exam, date required' }, 400);
      }
      if (!(await canAccessClass(currentTeacher, classId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const targets = await env.DB.prepare(`
        SELECT id
        FROM exam_sessions
        WHERE exam_title = ?
          AND exam_date = ?
          AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
      `).bind(examTitle, examDate, classId).all();

      const sessionIds = (targets.results || []).map(r => r.id).filter(Boolean);
      const stmts = [];

      for (const sessionId of sessionIds) {
        stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sessionId));
        stmts.push(env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(sessionId));
      }

      stmts.push(env.DB.prepare('DELETE FROM class_exam_assignments WHERE class_id = ? AND exam_title = ? AND exam_date = ?').bind(classId, examTitle, examDate));

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
      if (!classId) return jsonResponse({ error: 'class required', students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] }, 400);
      if (!(await canAccessClass(currentTeacher, classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

      const studentIds = await env.DB.prepare('SELECT student_id FROM class_students WHERE class_id = ?').bind(classId).all();
      const sIds = studentIds.results.map(r => r.student_id);
      if (!sIds.length) return jsonResponse({ students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] });

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

      return jsonResponse({
        students: students.results,
        sessions: sessions.results,
        wrong_answers: wrongs.results,
        blueprints: blueprints.results,
        assignments: assignments.results
      });
    }

    if (method === 'POST' && id === 'bulk-omr') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const d = await request.json();
      const examTitle = String(d.exam_title || '').trim();
      const examDate = String(d.exam_date || '').trim();
      const questionCount = Math.max(1, Math.min(80, parseInt(d.question_count, 10) || 0));
      const archiveFile = String(d.archive_file || '').trim();
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

        const existing = await env.DB.prepare(`
          SELECT id
          FROM exam_sessions
          WHERE student_id = ?
            AND exam_title = ?
            AND exam_date = ?
          LIMIT 1
        `).bind(studentId, examTitle, examDate).first();

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
      const sid = id === 'new' ? `ex_${Date.now()}` : id;
      const sessionColumns = await getTableColumnSet(env, 'exam_sessions');
      const existingSession = id === 'new' ? null : await loadExistingExamSession(env, sessionColumns, sid);
      const questionCount = d.question_count || 0;
      const wrongIds = normalizeWrongIds(d.wrong_ids, Math.max(1, Math.min(80, parseInt(questionCount, 10) || 80)));
      const archiveFile = String(d.archive_file || '').trim();
      const assignmentMeta = await resolveExamAssignmentMeta(env, {
        assignment_id: d.assignment_id,
        pack_id: d.pack_id,
        class_id: d.class_id || null,
        exam_title: d.exam_title,
        exam_date: d.exam_date,
        archive_file: archiveFile
      });
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
