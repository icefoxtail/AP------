// wangji-eie-os — EIE 전용 최소 Worker
// APMS 라우트 없음. /api/eie, /api/eie/* 만 처리.

import { handleEie } from './routes/eie.js';

const TEACHER_SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const TEACHER_SESSION_TOKEN_BYTES = 32;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...CORS_HEADERS,
      ...extraHeaders
    }
  });
}

function getBearerToken(request) {
  const auth = request.headers.get('Authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

async function readJson(request) {
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

function makeSessionToken() {
  const bytes = new Uint8Array(TEACHER_SESSION_TOKEN_BYTES);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

function makeSessionId() {
  return `ts_${Date.now()}_${crypto.randomUUID ? crypto.randomUUID() : makeSessionToken().slice(0, 16)}`;
}

function getSessionExpiryDate() {
  return new Date(Date.now() + (TEACHER_SESSION_TTL_SECONDS * 1000)).toISOString();
}

async function createTeacherSession(env, teacher) {
  const sessionToken = makeSessionToken();
  const expiresAt = getSessionExpiryDate();
  await env.DB.prepare(`
    INSERT INTO teacher_sessions (id, teacher_id, login_id, session_token, expires_at, created_at, last_used_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(makeSessionId(), teacher.id, teacher.login_id || null, sessionToken, expiresAt).run();
  return { session_token: sessionToken, expires_at: expiresAt };
}

async function revokeTeacherSession(env, token) {
  if (!token) return;
  await env.DB.prepare(`
    UPDATE teacher_sessions
    SET revoked_at = CURRENT_TIMESTAMP
    WHERE session_token = ? AND revoked_at IS NULL
  `).bind(token).run();
}

async function verifyTeacher(request, env) {
  const token = getBearerToken(request);
  if (!token) return null;
  const now = new Date().toISOString();
  const session = await env.DB.prepare(`
    SELECT ts.id AS session_id, t.id, t.login_id, t.name, t.role
    FROM teacher_sessions ts
    JOIN teachers t ON t.id = ts.teacher_id
    WHERE ts.session_token = ?
      AND ts.revoked_at IS NULL
      AND ts.expires_at > ?
    LIMIT 1
  `).bind(token, now).first().catch(() => null);
  if (!session) return null;
  env.DB.prepare('UPDATE teacher_sessions SET last_used_at = CURRENT_TIMESTAMP WHERE session_token = ?')
    .bind(token).run().catch(() => {});
  if (String(session.role || '').toLowerCase() === 'owner') {
    return { ...session, original_role: session.role, role: 'admin' };
  }
  return session;
}

function isEieApiPath(pathname) {
  return pathname === '/api/eie' || pathname.startsWith('/api/eie/');
}

function isDisabledRole(role) {
  return ['disabled', 'archived'].includes(String(role || '').toLowerCase());
}

async function handleAuthLogin(request, env) {
  const body = await readJson(request);
  const loginId = String(body?.login_id || '').trim();
  const password = String(body?.password || '');

  if (!loginId || !password) {
    return jsonResponse({ success: false, error: 'login_id and password are required' }, 400);
  }

  const hash = await sha256hex(password);
  const teacher = await env.DB.prepare(`
    SELECT id, login_id, name, role
    FROM teachers
    WHERE login_id = ? AND password_hash = ?
    LIMIT 1
  `).bind(loginId, hash).first();

  if (!teacher) {
    return jsonResponse({ success: false, error: 'invalid credentials' }, 401);
  }

  if (isDisabledRole(teacher.role)) {
    return jsonResponse({ success: false, error: 'teacher account is disabled' }, 403);
  }

  const session = await createTeacherSession(env, teacher);
  return jsonResponse({
    success: true,
    session_token: session.session_token,
    expires_at: session.expires_at,
    login_id: teacher.login_id,
    id: teacher.id,
    name: teacher.name,
    role: teacher.role
  });
}

async function handleAuthLogout(request, env) {
  const token = getBearerToken(request);
  if (token) {
    await revokeTeacherSession(env, token).catch(() => {});
  }
  return jsonResponse({ success: true });
}

async function handleAuth(request, env, url) {
  if (url.pathname === '/api/auth/login' && request.method === 'POST') {
    return handleAuthLogin(request, env);
  }

  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    return handleAuthLogout(request, env);
  }

  if (url.pathname === '/api/auth/login' || url.pathname === '/api/auth/logout') {
    return jsonResponse({ success: false, error: 'method not allowed' }, 405);
  }

  return null;
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.split('/').filter(Boolean);

    const authResponse = await handleAuth(request, env, url);
    if (authResponse) return authResponse;

    if (isEieApiPath(url.pathname)) {
      const teacher = await verifyTeacher(request, env).catch(() => null);
      return handleEie(request, env, teacher, path, url);
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      return jsonResponse({
        success: true,
        service: 'wangji-eie-os',
        scope: 'eie-only',
        routes: ['/api/auth/login', '/api/auth/logout', '/api/eie']
      });
    }

    return jsonResponse({
      success: false,
      error: 'not found',
      service: 'wangji-eie-os'
    }, 404);
  }
};
