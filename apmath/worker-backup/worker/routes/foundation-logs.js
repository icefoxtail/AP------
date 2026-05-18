import { jsonResponse } from '../helpers/response.js';
import { foundationInsert, getAllowedClassIds, isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';

function parseLimit(url, fallback = 500, max = 1000) {
  const raw = url.searchParams.get('limit');
  if (raw === null || raw === '') return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.min(Math.floor(n), max);
}

function addOptionalEquals(url, where, params, queryKey, column = queryKey) {
  const value = url.searchParams.get(queryKey);
  if (value === null || value === '') return;
  where.push(`${column} = ?`);
  params.push(value);
}

function addOptionalDateRange(url, where, params) {
  const from = url.searchParams.get('changed_from');
  const to = url.searchParams.get('changed_to');
  if (from) {
    where.push('changed_at >= ?');
    params.push(from);
  }
  if (to) {
    where.push('changed_at <= ?');
    params.push(to);
  }
}

export async function handleFoundationLogs(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const sub = path[2];
  const tables = { messages: 'message_logs', 'status-history': 'student_status_history', 'class-transfers': 'class_transfer_history', audit: 'audit_logs', privacy: 'privacy_access_logs' };
  const table = tables[sub];
  if (!table) return jsonResponse({ error: 'API Endpoint Not Found' }, 404);

  if (method === 'GET') {
    if (sub === 'audit' || sub === 'privacy') {
      if (!isAdminUser(teacher)) return jsonResponse({ success: true, data: [] });
      const limit = parseLimit(url, 1000, 1000);
      const data = await safeAll(env, `SELECT * FROM ${table} ORDER BY created_at DESC LIMIT ${limit}`);
      return jsonResponse({ success: true, data });
    }

    if (sub === 'messages') {
      const where = [];
      const params = [];
      addOptionalEquals(url, where, params, 'student_id');
      addOptionalEquals(url, where, params, 'parent_contact_id');
      addOptionalEquals(url, where, params, 'branch');
      addOptionalEquals(url, where, params, 'message_type');
      addOptionalEquals(url, where, params, 'channel');
      addOptionalEquals(url, where, params, 'status');

      if (!isAdminUser(teacher)) {
        const classIds = await getAllowedClassIds(env, teacher);
        if (!classIds?.length) return jsonResponse({ success: true, data: [] });
        const cMarkers = classIds.map(() => '?').join(',');
        where.push(`student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers}))`);
        params.push(...classIds);
      }

      const limit = parseLimit(url, isAdminUser(teacher) ? 1000 : 500, 1000);
      const data = await safeAll(env, `SELECT * FROM ${table}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC LIMIT ${limit}`, params);
      return jsonResponse({ success: true, data });
    }

    const where = [];
    const params = [];
    addOptionalEquals(url, where, params, 'student_id');
    addOptionalDateRange(url, where, params);

    if (sub === 'class-transfers') {
      const classId = url.searchParams.get('class_id');
      if (classId) {
        where.push('(from_class_id = ? OR to_class_id = ?)');
        params.push(classId, classId);
      }
    }

    if (!isAdminUser(teacher)) {
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.length) return jsonResponse({ success: true, data: [] });
      const cMarkers = classIds.map(() => '?').join(',');
      where.push(`student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers}))`);
      params.push(...classIds);
    }

    const limit = parseLimit(url, isAdminUser(teacher) ? 1000 : 500, 1000);
    const data = await safeAll(env, `SELECT * FROM ${table}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY changed_at DESC LIMIT ${limit}`, params);
    return jsonResponse({ success: true, data });
  }

  if (method === 'POST' && sub === 'audit') {
    if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    return jsonResponse({ success: true, log: await foundationInsert(env, 'audit_logs', { id: makeId('aud'), actor_id: teacher.id, actor_role: teacher.role, action: body.action, target_type: body.target_type || null, target_id: body.target_id || null, before_json: body.before_json || null, after_json: body.after_json || null, ip_address: request.headers.get('CF-Connecting-IP') || null }) });
  }

  if (method === 'POST' && sub === 'privacy') {
    if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    return jsonResponse({ success: true, log: await foundationInsert(env, 'privacy_access_logs', { id: makeId('pal'), actor_id: teacher.id, student_id: body.student_id || null, access_type: body.access_type || 'manual' }) });
  }

  return null;
}
