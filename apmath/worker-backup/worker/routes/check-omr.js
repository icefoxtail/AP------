import { sha256hex } from '../helpers/admin-db.js';
import { isAdminUser } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

const columnCacheByEnv = new WeakMap();

async function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Basic ')) return null;
  try {
    const [loginId, password] = atob(auth.slice(6)).split(':');
    const hash = await sha256hex(password);
    const authTeacher = await env.DB.prepare(
      'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(loginId, hash).first();
    return authTeacher || null;
  } catch (e) {
    return null;
  }
}

function todayKstDateString() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
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

function getAssignmentArchiveCandidates(value) {
  const raw = String(value || '').trim();
  const normalized = normalizeAssignmentArchiveFile(raw);
  return [...new Set([raw, normalized].filter(Boolean))];
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
    console.warn('[check-omr] column check failed:', tableName, e);
    return new Set();
  }
}

async function hasClassExamAssignmentExclusions(env) {
  const columns = await getTableColumnSet(env, 'class_exam_assignment_exclusions');
  return columns.has('assignment_id') && columns.has('student_id');
}

async function resolveCheckOmrAssignment(env, classId, examTitle, examDate, archiveFile) {
  try {
    const archiveCandidates = getAssignmentArchiveCandidates(archiveFile);
    if (archiveCandidates.length) {
      const markers = archiveCandidates.map(() => '?').join(',');
      const row = await env.DB.prepare(`
        SELECT id
        FROM class_exam_assignments
        WHERE class_id = ?
          AND exam_date = ?
          AND archive_file IN (${markers})
        ORDER BY updated_at DESC
        LIMIT 1
      `).bind(classId, examDate, ...archiveCandidates).first();
      if (row?.id) return row;
    }
    if (examTitle) {
      return await env.DB.prepare(`
        SELECT id
        FROM class_exam_assignments
        WHERE class_id = ?
          AND exam_date = ?
          AND exam_title = ?
        ORDER BY updated_at DESC
        LIMIT 1
      `).bind(classId, examDate, examTitle).first();
    }
  } catch (e) {
    console.warn('[check-omr] assignment lookup failed:', e);
  }
  return null;
}

async function handleQrClasses(request, env, teacher, url) {
  const currentTeacher = teacher || await verifyAuth(request, env);
  if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

  const res = await env.DB.prepare(
    'SELECT id, name, grade, teacher_name FROM classes WHERE is_active != 0 OR is_active IS NULL ORDER BY grade, name'
  ).all();
  return jsonResponse({ success: true, classes: res.results });
}

export async function handleCheckOmr(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];

  if (resource === 'check-pin' && method === 'POST') {
    const { student_id, pin } = await request.json();
    const student = await env.DB.prepare('SELECT student_pin FROM students WHERE id = ?').bind(student_id).first();
    if (!student?.student_pin || student.student_pin === String(pin)) {
      return jsonResponse({ success: true });
    }
    return jsonResponse({ success: false, message: 'PIN 번호가 일치하지 않습니다.' }, 401);
  }

  if (resource === 'check-init' && method === 'GET') {
    const classId = url.searchParams.get('class');
    const examTitle = url.searchParams.get('exam') || '';
    const examDate = url.searchParams.get('date') || '';
    const qCount = parseInt(url.searchParams.get('q')) || 0;

    const archiveFile =
      url.searchParams.get('archiveFile') ||
      url.searchParams.get('archive_file') ||
      url.searchParams.get('archive') ||
      '';

    if (!classId) {
      return jsonResponse({ error: 'class required', students: [], submitted_sessions: [] }, 400);
    }

    const todayKST = todayKstDateString();
    const targetDate = examDate || todayKST;
    const assignment = await resolveCheckOmrAssignment(env, classId, examTitle, targetDate, archiveFile);
    const canFilterExclusions = !!(assignment?.id && await hasClassExamAssignmentExclusions(env));

    const [clsInfo, stds, sessions] = await Promise.all([
      env.DB.prepare('SELECT name FROM classes WHERE id = ?').bind(classId).first(),
      env.DB.prepare("SELECT id, name, school_name, grade, student_pin FROM students WHERE id IN (SELECT student_id FROM class_students WHERE class_id = ?) AND status = '재원'").bind(classId).all(),
      env.DB.prepare("SELECT id, student_id, exam_title, exam_date, score FROM exam_sessions WHERE exam_title = ? AND exam_date = ? AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(examTitle, targetDate, classId).all()
    ]);

    if (assignment?.id && canFilterExclusions && Array.isArray(stds.results) && stds.results.length) {
      try {
        const studentIds = stds.results.map(row => row.id).filter(Boolean);
        if (studentIds.length) {
          const markers = studentIds.map(() => '?').join(',');
          const excluded = await env.DB.prepare(`
            SELECT student_id
            FROM class_exam_assignment_exclusions
            WHERE assignment_id = ?
              AND student_id IN (${markers})
          `).bind(assignment.id, ...studentIds).all();
          const excludedIds = new Set((excluded.results || []).map(row => String(row.student_id || '')));
          stds.results = stds.results.filter(row => !excludedIds.has(String(row.id || '')));
        }
      } catch (e) {
        console.warn('[check-omr] exclusion filter failed:', e);
      }
    }

    return jsonResponse({
      success: true,
      class_id: classId,
      class_name: clsInfo?.name || '알 수 없는 반',
      exam_title: examTitle,
      exam_date: targetDate,
      question_count: qCount,
      archive_file: archiveFile,
      students: stds.results,
      submitted_sessions: sessions.results
    });
  }

  if (resource === 'qr-classes' && method === 'GET') {
    return handleQrClasses(request, env, teacher, url);
  }

  return null;
}
