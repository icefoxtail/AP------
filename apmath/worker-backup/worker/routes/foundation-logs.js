import { jsonResponse } from '../helpers/response.js';
import { foundationInsert, foundationSelect, getAllowedClassIds, isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';

export async function handleFoundationLogs(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const sub = path[2];
  const tables = { 'status-history': 'student_status_history', 'class-transfers': 'class_transfer_history', audit: 'audit_logs', privacy: 'privacy_access_logs' };
  const table = tables[sub];
  if (!table) return jsonResponse({ error: 'API Endpoint Not Found' }, 404);

  if (method === 'GET') {
    if (isAdminUser(teacher) || sub === 'audit' || sub === 'privacy') {
      return jsonResponse({ success: true, data: isAdminUser(teacher) ? await foundationSelect(env, table) : [] });
    }
    const classIds = await getAllowedClassIds(env, teacher);
    if (!classIds?.length) return jsonResponse({ success: true, data: [] });
    const cMarkers = classIds.map(() => '?').join(',');
    const data = await safeAll(env, `SELECT * FROM ${table} WHERE student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})) ORDER BY changed_at DESC`, classIds);
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
