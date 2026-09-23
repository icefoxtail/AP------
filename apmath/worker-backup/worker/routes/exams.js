import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, canAccessStudent, getAllowedClassIds, isAdminUser, isStaffUser } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';
import { createAssignmentPdfDownloadResponse, ensureAssignmentPdf } from './exam-pdf.js';
import { handleArchive2 } from './archive2.js';

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

const ASSIGNMENT_META_COLUMNS = ['pack_id', 'grade_label', 'pack_hash', 'assignment_batch_id', 'target_scope', 'subject', 'pdf_qpp'];
const ASSIGNMENT_MIXED_PAYLOAD_COLUMN = 'mixed_payload_json';
const EXAM_SESSION_META_COLUMNS = ['assignment_id', 'pack_id', 'result_hash', 'analysis_status'];
const BLUEPRINT_META_COLUMNS = ['assessment_pack_id', 'type_key', 'difficulty'];
const BLUEPRINT_ARCHIVE_METADATA_COLUMNS = ['sub_unit_key', 'template_key', 'metadata_revision', 'metadata_hash'];
const BLUEPRINT_IDENTITY_COLUMNS = ['source_question_uid', 'source_question_ordinal'];
const ARCHIVE_METADATA_REVISION = 'archive-metadata-v1';
const QUESTION_REVIEW_META_COLUMNS = ['concept', 'error_tag', 'difficulty', 'question_type'];
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

function normalizeOptionalPositiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function normalizeAssignmentPdfQpp(value) {
  const parsed = Number.parseInt(value, 10);
  return [1, 2, 4, 6, 8].includes(parsed) ? parsed : 4;
}

function normalizeMixedAssignmentPayload(value, archiveFile) {
  if (!String(archiveFile || '').startsWith('MIXED:')) return null;
  if (typeof value !== 'string' || !value.trim() || value.length > 900000) return null;
  try {
    const parsed = JSON.parse(value);
    if (!parsed || !Array.isArray(parsed.questions) || !parsed.questions.length) return null;
    return JSON.stringify({
      questions: parsed.questions,
      meta: parsed.meta && typeof parsed.meta === 'object' ? parsed.meta : {}
    });
  } catch (e) {
    return null;
  }
}

function extractQuestionReviewMeta(reviewText) {
  const raw = String(reviewText || '').trim();
  if (!raw || !raw.startsWith('{')) {
    return { concept: null, error_tag: null, difficulty: null, question_type: null };
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('review_text JSON is not an object');
    return {
      concept: normalizeOptionalText(parsed.concept),
      error_tag: normalizeOptionalText(parsed.tag || parsed.error_tag || parsed.errorTag),
      difficulty: normalizeOptionalText(parsed.level || parsed.difficulty),
      question_type: normalizeOptionalText(parsed.type || parsed.question_type || parsed.questionType)
    };
  } catch (e) {
    return { concept: null, error_tag: null, difficulty: null, question_type: null };
  }
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

function normalizeSourceFileForQuestionUid(value) {
  return normalizeAssignmentArchiveFile(value)
    .replace(/^exams\//, '')
    .normalize('NFC')
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .trim();
}

async function makeCanonicalQuestionUid(sourceArchiveFile, sourceOrdinal) {
  const ordinal = normalizeOptionalPositiveInteger(sourceOrdinal);
  const sourceFile = normalizeSourceFileForQuestionUid(sourceArchiveFile);
  if (!sourceFile || !ordinal) return null;
  return `qid_v1_${await sha256hex(`${sourceFile}#${ordinal}`)}`;
}

function firstArchiveMetadataValue(question, names) {
  for (const name of names) {
    const value = question?.[name];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return null;
}

function normalizeArchiveMetadataTags(value) {
  if (!Array.isArray(value)) return [];
  return value.map(item => String(item || '').trim()).filter(Boolean);
}

function buildArchiveQuestionMetadata(question) {
  return {
    standardUnitKey: firstArchiveMetadataValue(question, ['standardUnitKey', 'standard_unit_key']),
    standardUnit: firstArchiveMetadataValue(question, ['standardUnit', 'standard_unit']),
    standardCourse: firstArchiveMetadataValue(question, ['standardCourse', 'standard_course']),
    subUnitKey: firstArchiveMetadataValue(question, ['subUnitKey', 'sub_unit_key']),
    conceptClusterKey: firstArchiveMetadataValue(question, ['conceptClusterKey', 'concept_cluster_key', 'conceptCluster', 'conceptKey', 'concept_key']),
    typeKey: firstArchiveMetadataValue(question, ['problemTypeKey', 'problem_type_key', 'typeKey', 'type_key']),
    templateKey: firstArchiveMetadataValue(question, ['templateKey', 'template_key']),
    difficulty: firstArchiveMetadataValue(question, ['difficultyBucket', 'difficulty_bucket', 'difficulty', 'level']),
    tags: normalizeArchiveMetadataTags(question?.tags),
    metadataRevision: String(firstArchiveMetadataValue(question, ['metadataRevision', 'metadata_revision']) || ARCHIVE_METADATA_REVISION).trim()
  };
}

async function buildArchiveMetadataHash(metadata) {
  const payload = JSON.stringify({
    standardUnitKey: metadata.standardUnitKey || null,
    standardUnit: metadata.standardUnit || null,
    standardCourse: metadata.standardCourse || null,
    subUnitKey: metadata.subUnitKey || null,
    conceptClusterKey: metadata.conceptClusterKey || null,
    typeKey: metadata.typeKey || null,
    templateKey: metadata.templateKey || null,
    difficulty: metadata.difficulty || null,
    tags: metadata.tags || [],
    metadataRevision: metadata.metadataRevision || ARCHIVE_METADATA_REVISION
  });
  return sha256hex(payload);
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

// Archive metadata revision/hash가 같을 때만 기존 blueprint 동기화를 건너뛴다.
// Phase 2A migration 전 원격 DB도 계속 읽을 수 있도록 신규 컬럼은 동적으로 감지한다.
async function syncExamBlueprintsFromArchive(env, archiveFile) {
  const file = normalizeAssignmentArchiveFile(archiveFile);
  if (!file || file.startsWith('MIXED:') || /^https?:\/\//i.test(file)) return;
  try {
    const url = EXAM_ARCHIVE_BASE_URL + file.split('/').map(encodeURIComponent).join('/');
    const res = env.ARCHIVE2_ASSETS ? await env.ARCHIVE2_ASSETS.fetch(url) : await fetch(url);
    if (!res.ok) return;
    const jsText = await res.text();
    const bank = extractQuestionBankFromArchiveText(jsText);
    if (!bank.length) return;

    const blueprintColumns = await getTableColumnSet(env, 'exam_blueprints');
    const blueprintIdentityColumns = pickExistingColumns(blueprintColumns, BLUEPRINT_IDENTITY_COLUMNS);
    const blueprintMetaColumns = pickExistingColumns(blueprintColumns, BLUEPRINT_META_COLUMNS);
    const blueprintArchiveMetadataColumns = pickExistingColumns(blueprintColumns, BLUEPRINT_ARCHIVE_METADATA_COLUMNS);
    const canCompareMetadata = blueprintColumns.has('metadata_revision') && blueprintColumns.has('metadata_hash');
    const existingSelect = ['question_no'];
    if (blueprintIdentityColumns.includes('source_question_ordinal')) existingSelect.push('source_question_ordinal');
    if (canCompareMetadata) existingSelect.push('metadata_revision', 'metadata_hash');
    const existingResult = await env.DB.prepare(
      `SELECT ${existingSelect.join(', ')} FROM exam_blueprints WHERE archive_file = ?`
    ).bind(file).all();
    const existingRows = existingResult.results || [];

    const metadataRows = await Promise.all(bank.map(async (q, index) => {
      const metadata = buildArchiveQuestionMetadata(q);
      return {
        sourceOrdinal: index + 1,
        questionNo: Number(String(q?.id ?? '').match(/\d+/)?.[0] || 0),
        metadata,
        metadataHash: await buildArchiveMetadataHash(metadata)
      };
    }));

    if (canCompareMetadata && existingRows.length === metadataRows.length) {
      const existingByOrdinal = new Map(
        existingRows
          .filter(row => Number(row.source_question_ordinal) > 0)
          .map(row => [Number(row.source_question_ordinal), row])
      );
      const existingByQuestionNo = new Map(existingRows.map(row => [Number(row.question_no), row]));
      const unchanged = metadataRows.every(row => {
        const existing = existingByOrdinal.get(row.sourceOrdinal) || existingByQuestionNo.get(row.questionNo);
        return existing &&
          String(existing.metadata_revision || '') === String(row.metadata.metadataRevision || '') &&
          String(existing.metadata_hash || '') === String(row.metadataHash || '');
      });
      if (unchanged) return;
    } else if (!canCompareMetadata && existingRows.length > 0) {
      // Before Phase 2A is applied remotely, preserve the legacy one-time sync behavior.
      return;
    }

    const stmts = (await Promise.all(bank.map(async (q, index) => {
      const questionNo = Number(String(q?.id ?? '').match(/\d+/)?.[0] || 0);
      if (!questionNo) return null;
      const sourceOrdinal = index + 1;
      const sourceQuestionUid = blueprintIdentityColumns.includes('source_question_uid')
        ? await makeCanonicalQuestionUid(file, sourceOrdinal)
        : null;
      const metadataRow = metadataRows[index];
      const metadata = metadataRow.metadata;
      const columns = [
        'archive_file', 'question_no', 'source_archive_file', 'source_question_no',
        'standard_unit_key', 'standard_unit', 'standard_course', 'concept_cluster_key',
        ...blueprintIdentityColumns,
        ...blueprintMetaColumns,
        ...blueprintArchiveMetadataColumns,
        'updated_at'
      ];
      const values = [
        file, questionNo, file, questionNo,
        metadata.standardUnitKey || null, metadata.standardUnit || null, metadata.standardCourse || null, metadata.conceptClusterKey || null
      ];
      for (const column of blueprintIdentityColumns) {
        values.push(column === 'source_question_uid' ? sourceQuestionUid : sourceOrdinal);
      }
      for (const column of blueprintMetaColumns) {
        if (column === 'assessment_pack_id') values.push(null);
        else if (column === 'type_key') values.push(metadata.typeKey || null);
        else if (column === 'difficulty') values.push(metadata.difficulty || null);
      }
      for (const column of blueprintArchiveMetadataColumns) {
        if (column === 'sub_unit_key') values.push(metadata.subUnitKey || null);
        else if (column === 'template_key') values.push(metadata.templateKey || null);
        else if (column === 'metadata_revision') values.push(metadata.metadataRevision || ARCHIVE_METADATA_REVISION);
        else if (column === 'metadata_hash') values.push(metadataRow.metadataHash || null);
      }
      const updateSets = [
        'source_archive_file = excluded.source_archive_file',
        'source_question_no = excluded.source_question_no',
        'standard_unit_key = excluded.standard_unit_key',
        'standard_unit = excluded.standard_unit',
        'standard_course = excluded.standard_course',
        'concept_cluster_key = excluded.concept_cluster_key',
        ...blueprintIdentityColumns.map(column => `${column} = excluded.${column}`),
        ...blueprintMetaColumns.map(column => `${column} = excluded.${column}`),
        ...blueprintArchiveMetadataColumns.map(column => `${column} = excluded.${column}`),
        "updated_at = DATETIME('now')"
      ];
      return env.DB.prepare(`
        INSERT INTO exam_blueprints (
          ${columns.join(', ')}
        ) VALUES (${values.map(() => '?').join(', ')}, DATETIME('now'))
        ON CONFLICT(archive_file, question_no) DO UPDATE SET
          ${updateSets.join(',\n          ')}
      `).bind(...values);
    }))).filter(Boolean);

    if (stmts.length) await env.DB.batch(stmts);
  } catch (e) {
    console.warn('[exams] archive blueprint sync failed:', archiveFile, e);
  }
}

function normalizeExamTitleKey(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function buildAssignmentIdentityKey(row = {}) {
  const assignmentId = String(row.id || '').trim();
  if (assignmentId) return `ASSIGNMENT||${assignmentId}`;
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

async function hasClassExamAssignmentRecipients(env) {
  const columns = await getTableColumnSet(env, 'class_exam_assignment_recipients');
  return columns.has('assignment_id') && columns.has('student_id');
}

async function snapshotClassExamAssignmentRecipients(env, assignment) {
  if (!assignment?.id || !assignment?.class_id) return;
  if (!(await hasClassExamAssignmentRecipients(env))) {
    throw new Error('class exam assignment recipients table is unavailable');
  }
  await env.DB.prepare(`
    INSERT OR IGNORE INTO class_exam_assignment_recipients (assignment_id, student_id)
    SELECT ?, cs.student_id
    FROM class_students cs
    WHERE cs.class_id = ?
  `).bind(assignment.id, assignment.class_id).run();
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
    subject: normalizeOptionalText(input.subject),
    pdf_qpp: normalizeAssignmentPdfQpp(input.pdf_qpp ?? input.qpp)
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

  const assignment = (await loadClassExamAssignmentById(env, assignmentId)) || (await resolveAssignmentRow(env, {
    class_id: classId,
    exam_title: examTitle,
    exam_date: examDate,
    archive_file: archiveFile
  }));
  await snapshotClassExamAssignmentRecipients(env, assignment);
  return assignment;
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

async function cleanupAssignmentIfNoTargets(env, assignment) {
  if (!assignment?.id || !assignment?.class_id) return false;
  if (!(await hasClassExamAssignmentExclusions(env))) return false;

  try {
    const recipientSnapshotExists = await hasClassExamAssignmentRecipients(env);
    const remainingTargets = await env.DB.prepare(`
      SELECT COUNT(*) AS count
      FROM ${recipientSnapshotExists ? 'class_exam_assignment_recipients ar' : 'class_students cs'}
      WHERE ${recipientSnapshotExists ? 'ar.assignment_id = ?' : 'cs.class_id = ?'}
        AND NOT EXISTS (
          SELECT 1
          FROM class_exam_assignment_exclusions ex
          WHERE ex.assignment_id = ? AND ex.student_id = ${recipientSnapshotExists ? 'ar.student_id' : 'cs.student_id'}
        )
    `).bind(recipientSnapshotExists ? assignment.id : assignment.class_id, assignment.id).first();
    if (Number(remainingTargets?.count || 0) > 0) return false;

    const sessionColumns = await getTableColumnSet(env, 'exam_sessions');
    let remainingSessions = null;
    if (sessionColumns.has('assignment_id')) {
      remainingSessions = await env.DB.prepare(`
        SELECT COUNT(*) AS count
        FROM exam_sessions
        WHERE assignment_id = ?
          AND student_id IN (
            SELECT student_id
            FROM ${recipientSnapshotExists ? 'class_exam_assignment_recipients' : 'class_students'}
            WHERE ${recipientSnapshotExists ? 'assignment_id = ?' : 'class_id = ?'}
          )
      `).bind(assignment.id, recipientSnapshotExists ? assignment.id : assignment.class_id).first();
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
      ...(recipientSnapshotExists ? [env.DB.prepare('DELETE FROM class_exam_assignment_recipients WHERE assignment_id = ?').bind(assignment.id)] : []),
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

  const recipientSnapshotExists = await hasClassExamAssignmentRecipients(env);
  const member = await env.DB.prepare(recipientSnapshotExists ? `
    SELECT 1
    FROM class_exam_assignment_recipients
    WHERE assignment_id = ? AND student_id = ?
    LIMIT 1
  ` : `
    SELECT 1
    FROM class_students
    WHERE class_id = ? AND student_id = ?
    LIMIT 1
  `).bind(recipientSnapshotExists ? assignment.id : classId, studentId).first();
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