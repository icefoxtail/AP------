import { jsonResponse } from '../helpers/response.js';
import { normalizeBranch } from '../helpers/branch.js';
import { canAccessStudent, foundationInsert, foundationPatch, foundationSelect, getAllowedClassIds, isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';

export async function handleParentFoundation(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const sub = path[2];
  const subId = path[3];

  if (sub === 'contacts') {
    if (method === 'GET') {
      if (isAdminUser(teacher)) return jsonResponse({ success: true, contacts: await foundationSelect(env, 'parent_contacts') });
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.length) return jsonResponse({ success: true, contacts: [] });
      const cMarkers = classIds.map(() => '?').join(',');
      const contacts = await safeAll(env, `SELECT * FROM parent_contacts WHERE student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})) ORDER BY created_at DESC`, classIds);
      return jsonResponse({ success: true, contacts });
    }
    if (method === 'POST') {
      if (!(await canAccessStudent(teacher, body.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      return jsonResponse({ success: true, contact: await foundationInsert(env, 'parent_contacts', { id: makeId('pc'), student_id: body.student_id, name: body.name || null, relation: body.relation || null, phone: String(body.phone || '').trim(), is_primary: body.is_primary ?? 1, receive_attendance: body.receive_attendance ?? 1, receive_payment: body.receive_payment ?? 1, receive_notice: body.receive_notice ?? 1, receive_report: body.receive_report ?? 1, receive_marketing: body.receive_marketing ?? 0, memo: body.memo || null }) });
    }
    if (method === 'PATCH' && subId) return jsonResponse({ success: true, contact: await foundationPatch(env, 'parent_contacts', subId, body, ['name', 'relation', 'phone', 'is_primary', 'receive_attendance', 'receive_payment', 'receive_notice', 'receive_report', 'receive_marketing', 'memo']) });
    if (method === 'DELETE' && subId) return jsonResponse({ success: false, error: 'DELETE not implemented for parent contacts in phase1' }, 405);
  }

  if (sub === 'messages') {
    if (method === 'GET') {
      if (isAdminUser(teacher)) return jsonResponse({ success: true, messages: await foundationSelect(env, 'message_logs') });
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.length) return jsonResponse({ success: true, messages: [] });
      const cMarkers = classIds.map(() => '?').join(',');
      const messages = await safeAll(env, `SELECT * FROM message_logs WHERE student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})) ORDER BY created_at DESC`, classIds);
      return jsonResponse({ success: true, messages });
    }
    if (method === 'POST') return jsonResponse({ success: true, message: await foundationInsert(env, 'message_logs', { id: makeId('msg'), student_id: body.student_id || null, parent_contact_id: body.parent_contact_id || null, branch: body.branch ? normalizeBranch(body.branch) : null, message_type: body.message_type || 'manual', channel: body.channel || 'log', title: body.title || null, content: body.content || null, status: body.status || 'pending', provider_message_id: body.provider_message_id || null, error_message: body.error_message || null, sent_at: body.sent_at || null }) });
  }

  return null;
}
