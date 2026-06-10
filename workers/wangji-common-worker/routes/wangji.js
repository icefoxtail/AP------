// wangji-common-worker: overlay/link/index API 본문.
// 이 워커는 wangji-common-os(overlay DB)에만 write 한다.
// AP(ap-math-os)/EIE(wangji-eie-os) 원본 DB에는 어떤 write도 하지 않는다.
import { jsonResponse, readJsonBody } from '../helpers/response.js';

function makeId(prefix) {
  const id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${id}`;
}

function safeText(v) {
  return String(v == null ? '' : v).trim();
}

async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function audit(env, actor, action, targetTable, targetId, summary) {
  try {
    await env.DB.prepare(
      'INSERT INTO wangji_audit_logs (id, actor, action, target_table, target_id, payload_summary) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(makeId('audit'), actor || '', action, targetTable || '', targetId || '', safeText(summary).slice(0, 500)).run();
  } catch (error) {
    // audit 실패가 본 동작을 막지 않는다 (단, 콘솔 기록)
    console.error('audit failed', error);
  }
}

// ---------------------------------------------------------------------
// 인증: 공통 Worker 자체 admin 세션
// ---------------------------------------------------------------------
async function handleLogin(request, env) {
  const body = await readJsonBody(request);
  const loginId = safeText(body?.login_id);
  const password = safeText(body?.password);
  if (!loginId || !password) return jsonResponse({ success: false, error: 'login_id and password are required' }, 400);

  const expectedId = safeText(env.WANGJI_ADMIN_ID || 'admin');
  const expectedHash = safeText(env.WANGJI_ADMIN_PASSWORD_SHA256 || '');
  if (!expectedHash) return jsonResponse({ success: false, error: 'admin credential is not configured' }, 503);

  const givenHash = await sha256hex(password);
  if (loginId !== expectedId || givenHash !== expectedHash) {
    return jsonResponse({ success: false, error: 'invalid credentials' }, 401);
  }

  const token = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)) + (crypto.randomUUID ? crypto.randomUUID() : '');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(); // 12h
  await env.DB.prepare(
    'INSERT INTO wangji_admin_sessions (id, login_id, session_token, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(makeId('wsess'), loginId, token, expiresAt).run();
  await audit(env, loginId, 'login', 'wangji_admin_sessions', '', 'admin login');
  return jsonResponse({ success: true, session_token: token, expires_at: expiresAt });
}

export async function verifyAdmin(request, env) {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return null;
  const row = await env.DB.prepare(
    'SELECT id, login_id, expires_at, revoked_at FROM wangji_admin_sessions WHERE session_token = ? LIMIT 1'
  ).bind(token).first();
  if (!row || row.revoked_at) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  await env.DB.prepare('UPDATE wangji_admin_sessions SET last_used_at = CURRENT_TIMESTAMP WHERE id = ?').bind(row.id).run();
  return { login_id: row.login_id };
}

// ---------------------------------------------------------------------
// students (공통 anchor — 원본 복사 아님)
// ---------------------------------------------------------------------
const STUDENT_FIELDS = ['display_name', 'school_name_snapshot', 'grade_snapshot', 'primary_phone_snapshot', 'status', 'memo'];

async function listStudents(env, url) {
  const q = safeText(url.searchParams.get('q'));
  let sql = 'SELECT * FROM wangji_students WHERE is_deleted = 0';
  const binds = [];
  if (q) {
    sql += ' AND (display_name LIKE ? OR school_name_snapshot LIKE ? OR primary_phone_snapshot LIKE ?)';
    binds.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  sql += ' ORDER BY display_name LIMIT 500';
  const res = await env.DB.prepare(sql).bind(...binds).all();
  return jsonResponse({ success: true, students: res.results || [] });
}

async function createStudent(request, env, admin) {
  const body = await readJsonBody(request);
  const name = safeText(body?.display_name);
  if (!name) return jsonResponse({ success: false, error: 'display_name is required' }, 400);
  const id = makeId('wstu');
  await env.DB.prepare(
    `INSERT INTO wangji_students (id, display_name, school_name_snapshot, grade_snapshot, primary_phone_snapshot, status, memo)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, name, safeText(body?.school_name_snapshot), safeText(body?.grade_snapshot),
         safeText(body?.primary_phone_snapshot), safeText(body?.status) || 'active', safeText(body?.memo)).run();
  await audit(env, admin.login_id, 'create', 'wangji_students', id, name);
  const row = await env.DB.prepare('SELECT * FROM wangji_students WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, student: row });
}

async function patchStudent(request, env, admin, id) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'body is required' }, 400);
  const sets = [];
  const binds = [];
  for (const f of STUDENT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, f)) {
      sets.push(`${f} = ?`);
      binds.push(safeText(body[f]));
    }
  }
  if (!sets.length) return jsonResponse({ success: false, error: 'no updatable fields' }, 400);
  binds.push(id);
  const res = await env.DB.prepare(
    `UPDATE wangji_students SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0`
  ).bind(...binds).run();
  if (!res.meta || res.meta.changes === 0) return jsonResponse({ success: false, error: 'student not found' }, 404);
  await audit(env, admin.login_id, 'update', 'wangji_students', id, sets.join(','));
  const row = await env.DB.prepare('SELECT * FROM wangji_students WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, student: row });
}

async function deleteStudent(env, admin, id) {
  const res = await env.DB.prepare(
    'UPDATE wangji_students SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0'
  ).bind(id).run();
  if (!res.meta || res.meta.changes === 0) return jsonResponse({ success: false, error: 'student not found' }, 404);
  await audit(env, admin.login_id, 'delete', 'wangji_students', id, 'soft delete');
  return jsonResponse({ success: true });
}

// ---------------------------------------------------------------------
// links (candidate 강제 — 자동 확정 차단을 서버에서 보장)
// ---------------------------------------------------------------------
const LINK_STATUSES = ['candidate', 'active', 'rejected', 'archived'];

async function listLinks(env, studentId) {
  const res = await env.DB.prepare(
    'SELECT * FROM wangji_student_links WHERE wangji_student_id = ? AND is_deleted = 0 ORDER BY created_at DESC'
  ).bind(studentId).all();
  return jsonResponse({ success: true, links: res.results || [] });
}

async function listLinksByStatus(env, url) {
  const status = safeText(url.searchParams.get('status'));
  let sql = 'SELECT * FROM wangji_student_links WHERE is_deleted = 0';
  const binds = [];
  if (status && LINK_STATUSES.includes(status)) { sql += ' AND link_status = ?'; binds.push(status); }
  sql += ' ORDER BY created_at DESC LIMIT 500';
  const res = await env.DB.prepare(sql).bind(...binds).all();
  return jsonResponse({ success: true, links: res.results || [] });
}

async function createLink(request, env, admin) {
  const body = await readJsonBody(request);
  const wangjiStudentId = safeText(body?.wangji_student_id);
  const sourceApp = safeText(body?.source_app).toUpperCase();
  const sourceStudentId = safeText(body?.source_student_id);
  if (!wangjiStudentId || !sourceStudentId) return jsonResponse({ success: false, error: 'wangji_student_id and source_student_id are required' }, 400);
  if (sourceApp !== 'AP' && sourceApp !== 'EIE') return jsonResponse({ success: false, error: 'source_app must be AP or EIE' }, 400);

  const id = makeId('wlink');
  try {
    // link_status는 요청값과 무관하게 candidate로 강제한다. (자동 병합/자동 확정 금지)
    await env.DB.prepare(
      `INSERT INTO wangji_student_links
       (id, wangji_student_id, source_app, source_student_id,
        source_display_name_snapshot, source_school_snapshot, source_grade_snapshot, source_phone_snapshot,
        link_status, confidence_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'candidate', ?)`
    ).bind(id, wangjiStudentId, sourceApp, sourceStudentId,
           safeText(body?.source_display_name_snapshot), safeText(body?.source_school_snapshot),
           safeText(body?.source_grade_snapshot), safeText(body?.source_phone_snapshot),
           safeText(body?.confidence_reason)).run();
  } catch (error) {
    if (String(error && error.message).includes('UNIQUE')) {
      return jsonResponse({ success: false, error: 'this source student is already linked' }, 409);
    }
    throw error;
  }
  await audit(env, admin.login_id, 'create', 'wangji_student_links', id, `${sourceApp}:${sourceStudentId} candidate`);
  const row = await env.DB.prepare('SELECT * FROM wangji_student_links WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, link: row });
}

async function patchLinkStatus(request, env, admin, id) {
  const body = await readJsonBody(request);
  const next = safeText(body?.link_status);
  if (!LINK_STATUSES.includes(next)) return jsonResponse({ success: false, error: 'invalid link_status' }, 400);
  const row = await env.DB.prepare('SELECT * FROM wangji_student_links WHERE id = ? AND is_deleted = 0').bind(id).first();
  if (!row) return jsonResponse({ success: false, error: 'link not found' }, 404);

  // active 전환은 관리자 확정 기록 필수
  if (next === 'active') {
    await env.DB.prepare(
      `UPDATE wangji_student_links SET link_status = 'active', confirmed_by = ?, confirmed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(admin.login_id, id).run();
  } else {
    await env.DB.prepare(
      'UPDATE wangji_student_links SET link_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(next, id).run();
  }
  await audit(env, admin.login_id, 'status_change', 'wangji_student_links', id, `${row.link_status} -> ${next}`);
  const updated = await env.DB.prepare('SELECT * FROM wangji_student_links WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, link: updated });
}

// ---------------------------------------------------------------------
// consultations (공통 상담 — overlay DB에만 저장)
// ---------------------------------------------------------------------
const CONSULT_FIELDS = ['source_scope', 'source_app', 'source_student_id', 'consultation_date',
                        'category', 'content', 'next_action', 'followup_status', 'visibility'];

async function listConsultations(env, studentId) {
  const res = await env.DB.prepare(
    'SELECT * FROM wangji_consultations WHERE wangji_student_id = ? AND is_deleted = 0 ORDER BY consultation_date DESC, created_at DESC'
  ).bind(studentId).all();
  return jsonResponse({ success: true, consultations: res.results || [] });
}

async function createConsultation(request, env, admin) {
  const body = await readJsonBody(request);
  const studentId = safeText(body?.wangji_student_id);
  const content = safeText(body?.content);
  if (!studentId || !content) return jsonResponse({ success: false, error: 'wangji_student_id and content are required' }, 400);
  const scope = ['COMMON', 'AP', 'EIE'].includes(safeText(body?.source_scope)) ? safeText(body?.source_scope) : 'COMMON';
  const id = makeId('wcns');
  await env.DB.prepare(
    `INSERT INTO wangji_consultations
     (id, wangji_student_id, source_scope, source_app, source_student_id, consultation_date,
      category, content, next_action, followup_status, visibility, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, studentId, scope, safeText(body?.source_app), safeText(body?.source_student_id),
         safeText(body?.consultation_date) || new Date().toISOString().slice(0, 10),
         safeText(body?.category), content, safeText(body?.next_action),
         safeText(body?.followup_status) || 'none', safeText(body?.visibility) || 'staff',
         admin.login_id).run();
  await audit(env, admin.login_id, 'create', 'wangji_consultations', id, scope);
  const row = await env.DB.prepare('SELECT * FROM wangji_consultations WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, consultation: row });
}

async function patchConsultation(request, env, admin, id) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'body is required' }, 400);
  const sets = [];
  const binds = [];
  for (const f of CONSULT_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, f)) { sets.push(`${f} = ?`); binds.push(safeText(body[f])); }
  }
  if (!sets.length) return jsonResponse({ success: false, error: 'no updatable fields' }, 400);
  binds.push(id);
  const res = await env.DB.prepare(
    `UPDATE wangji_consultations SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0`
  ).bind(...binds).run();
  if (!res.meta || res.meta.changes === 0) return jsonResponse({ success: false, error: 'consultation not found' }, 404);
  await audit(env, admin.login_id, 'update', 'wangji_consultations', id, sets.join(','));
  const row = await env.DB.prepare('SELECT * FROM wangji_consultations WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, consultation: row });
}

async function deleteConsultation(env, admin, id) {
  const res = await env.DB.prepare(
    'UPDATE wangji_consultations SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0'
  ).bind(id).run();
  if (!res.meta || res.meta.changes === 0) return jsonResponse({ success: false, error: 'consultation not found' }, 404);
  await audit(env, admin.login_id, 'delete', 'wangji_consultations', id, 'soft delete');
  return jsonResponse({ success: true });
}

// ---------------------------------------------------------------------
// memos (공통 메모)
// ---------------------------------------------------------------------
const MEMO_FIELDS = ['title', 'content', 'importance', 'tags'];

async function listMemos(env, studentId) {
  const res = await env.DB.prepare(
    'SELECT * FROM wangji_memos WHERE wangji_student_id = ? AND is_deleted = 0 ORDER BY created_at DESC'
  ).bind(studentId).all();
  return jsonResponse({ success: true, memos: res.results || [] });
}

async function createMemo(request, env, admin) {
  const body = await readJsonBody(request);
  const studentId = safeText(body?.wangji_student_id);
  const content = safeText(body?.content);
  if (!studentId || !content) return jsonResponse({ success: false, error: 'wangji_student_id and content are required' }, 400);
  const id = makeId('wmemo');
  await env.DB.prepare(
    'INSERT INTO wangji_memos (id, wangji_student_id, title, content, importance, tags, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, studentId, safeText(body?.title), content,
         safeText(body?.importance) || 'normal', safeText(body?.tags), admin.login_id).run();
  await audit(env, admin.login_id, 'create', 'wangji_memos', id, safeText(body?.title));
  const row = await env.DB.prepare('SELECT * FROM wangji_memos WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, memo: row });
}

async function patchMemo(request, env, admin, id) {
  const body = await readJsonBody(request);
  if (!body) return jsonResponse({ success: false, error: 'body is required' }, 400);
  const sets = [];
  const binds = [];
  for (const f of MEMO_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, f)) { sets.push(`${f} = ?`); binds.push(safeText(body[f])); }
  }
  if (!sets.length) return jsonResponse({ success: false, error: 'no updatable fields' }, 400);
  binds.push(id);
  const res = await env.DB.prepare(
    `UPDATE wangji_memos SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0`
  ).bind(...binds).run();
  if (!res.meta || res.meta.changes === 0) return jsonResponse({ success: false, error: 'memo not found' }, 404);
  await audit(env, admin.login_id, 'update', 'wangji_memos', id, sets.join(','));
  const row = await env.DB.prepare('SELECT * FROM wangji_memos WHERE id = ?').bind(id).first();
  return jsonResponse({ success: true, memo: row });
}

async function deleteMemo(env, admin, id) {
  const res = await env.DB.prepare(
    'UPDATE wangji_memos SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_deleted = 0'
  ).bind(id).run();
  if (!res.meta || res.meta.changes === 0) return jsonResponse({ success: false, error: 'memo not found' }, 404);
  await audit(env, admin.login_id, 'delete', 'wangji_memos', id, 'soft delete');
  return jsonResponse({ success: true });
}

// ---------------------------------------------------------------------
// 라우팅: /api/wangji/...
// ---------------------------------------------------------------------
export async function handleWangji(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '').split('/'); // ['', 'api', 'wangji', ...]
  const method = request.method.toUpperCase();
  const section = path[3] || '';
  const id = path[4] || '';
  const tail = path[5] || '';

  // health/status: 인증 불필요
  if (method === 'GET' && section === 'status') {
    return jsonResponse({ success: true, service: 'wangji-common-worker', overlay: 'connected' });
  }
  if (method === 'POST' && section === 'auth' && id === 'login') {
    return handleLogin(request, env);
  }

  const admin = await verifyAdmin(request, env);
  if (!admin) return jsonResponse({ success: false, error: 'unauthorized' }, 401);

  if (section === 'students') {
    if (method === 'GET' && !id) return listStudents(env, url);
    if (method === 'POST' && !id) return createStudent(request, env, admin);
    if (method === 'GET' && id && tail === 'links') return listLinks(env, id);
    if (method === 'GET' && id && tail === 'consultations') return listConsultations(env, id);
    if (method === 'GET' && id && tail === 'memos') return listMemos(env, id);
    if (method === 'PATCH' && id && !tail) return patchStudent(request, env, admin, id);
    if (method === 'DELETE' && id && !tail) return deleteStudent(env, admin, id);
  }

  if (section === 'links') {
    if (method === 'GET' && !id) return listLinksByStatus(env, url);
    if (method === 'POST' && !id) return createLink(request, env, admin);
    if (method === 'PATCH' && id && tail === 'status') return patchLinkStatus(request, env, admin, id);
  }

  if (section === 'consultations') {
    if (method === 'POST' && !id) return createConsultation(request, env, admin);
    if (method === 'PATCH' && id && !tail) return patchConsultation(request, env, admin, id);
    if (method === 'DELETE' && id && !tail) return deleteConsultation(env, admin, id);
  }

  if (section === 'memos') {
    if (method === 'POST' && !id) return createMemo(request, env, admin);
    if (method === 'PATCH' && id && !tail) return patchMemo(request, env, admin, id);
    if (method === 'DELETE' && id && !tail) return deleteMemo(env, admin, id);
  }

  return jsonResponse({ success: false, error: 'not found' }, 404);
}
