// wangji-eie-os — EIE 전용 최소 Worker
// APMS 라우트 없음. /api/eie, /api/eie/* 만 처리.

import { handleEie } from './routes/eie.js';

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
  return session;
}

function isEieApiPath(pathname) {
  return pathname === '/api/eie' || pathname.startsWith('/api/eie/');
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.split('/').filter(Boolean);

    if (isEieApiPath(url.pathname)) {
      const teacher = await verifyTeacher(request, env).catch(() => null);
      return handleEie(request, env, teacher, path, url);
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      return jsonResponse({
        success: true,
        service: 'wangji-eie-os',
        scope: 'eie-only',
        routes: ['/api/eie']
      });
    }

    return jsonResponse({
      success: false,
      error: 'not found',
      service: 'wangji-eie-os'
    }, 404);
  }
};
