import { jsonResponse } from '../helpers/response.js';
import { canAccessClass, foundationInsert, foundationPatch, foundationSelect, getAllowedClassIds, isAdminUser, makeId } from '../helpers/foundation-db.js';

export async function handleClassTimeSlots(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const id = path[2];
  if (method === 'GET') {
    const where = [];
    const params = [];
    if (url.searchParams.get('class_id')) { where.push('class_id = ?'); params.push(url.searchParams.get('class_id')); }
    if (!isAdminUser(teacher)) {
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.length) return jsonResponse({ success: true, class_time_slots: [] });
      where.push(`class_id IN (${classIds.map(() => '?').join(',')})`);
      params.push(...classIds);
    }
    return jsonResponse({ success: true, class_time_slots: await foundationSelect(env, 'class_time_slots', where, params, 'day_of_week ASC, start_time ASC') });
  }
  if (method === 'POST') {
    if (!(await canAccessClass(teacher, body.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const row = {
      id: makeId('cts'),
      class_id: String(body.class_id || '').trim(),
      day_of_week: String(body.day_of_week || '').trim(),
      start_time: String(body.start_time || '').trim(),
      end_time: String(body.end_time || '').trim(),
      room_name: body.room_name || null,
      memo: body.memo || null
    };
    if (!row.class_id || !row.day_of_week || !row.start_time || !row.end_time) return jsonResponse({ success: false, error: 'class_id, day_of_week, start_time, end_time required' }, 400);
    return jsonResponse({ success: true, class_time_slot: await foundationInsert(env, 'class_time_slots', row) });
  }
  if (method === 'PATCH' && id) {
    const existing = await env.DB.prepare('SELECT * FROM class_time_slots WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, existing.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    if (body.class_id && !(await canAccessClass(teacher, body.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    return jsonResponse({ success: true, class_time_slot: await foundationPatch(env, 'class_time_slots', id, body, ['class_id', 'day_of_week', 'start_time', 'end_time', 'room_name', 'memo']) });
  }
  if (method === 'DELETE' && id) {
    const existing = await env.DB.prepare('SELECT * FROM class_time_slots WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, existing.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    await env.DB.prepare('DELETE FROM class_time_slots WHERE id = ?').bind(id).run();
    return jsonResponse({ success: true });
  }
  return null;
}
