import { jsonResponse } from '../helpers/response.js';
import { normalizeBranch } from '../helpers/branch.js';
import { canAccessStudent, foundationInsert, foundationPatch, foundationSelect, getAllowedClassIds, isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';

const CONTACT_PATCH_KEYS = [
  'name',
  'relation',
  'phone',
  'is_primary',
  'receive_attendance',
  'receive_payment',
  'receive_notice',
  'receive_report',
  'receive_marketing',
  'memo'
];

const FOUNDATION_LOG_CHANNELS = new Set(['log', 'internal', 'memo']);

async function findParentContact(env, contactId) {
  const id = String(contactId || '').trim();
  if (!id) return null;
  return await env.DB.prepare('SELECT * FROM parent_contacts WHERE id = ? LIMIT 1').bind(id).first();
}

async function assertCanAccessParentContact(env, teacher, contactId) {
  const contact = await findParentContact(env, contactId);
  if (!contact) return { error: jsonResponse({ error: 'Contact not found' }, 404) };
  if (!(await canAccessStudent(teacher, contact.student_id, env))) {
    return { error: jsonResponse({ error: 'Forbidden' }, 403) };
  }
  return { contact };
}

function normalizeFoundationLogChannel(value) {
  const channel = String(value || 'log').trim().toLowerCase();
  return FOUNDATION_LOG_CHANNELS.has(channel) ? channel : 'log';
}

async function resolveMessageScope(env, teacher, body = {}) {
  const parentContactId = String(body.parent_contact_id || '').trim();
  const bodyStudentId = String(body.student_id || '').trim();

  if (parentContactId) {
    const contact = await findParentContact(env, parentContactId);
    if (!contact) return { error: jsonResponse({ error: 'Contact not found' }, 404) };
    if (!(await canAccessStudent(teacher, contact.student_id, env))) {
      return { error: jsonResponse({ error: 'Forbidden' }, 403) };
    }
    if (bodyStudentId && String(contact.student_id || '') !== bodyStudentId) {
      return { error: jsonResponse({ error: 'student_id does not match parent_contact_id' }, 400) };
    }
    return {
      student_id: contact.student_id || null,
      parent_contact_id: contact.id
    };
  }

  if (bodyStudentId) {
    if (!(await canAccessStudent(teacher, bodyStudentId, env))) {
      return { error: jsonResponse({ error: 'Forbidden' }, 403) };
    }
    return {
      student_id: bodyStudentId,
      parent_contact_id: null
    };
  }

  if (isAdminUser(teacher)) {
    return {
      student_id: null,
      parent_contact_id: null
    };
  }

  return { error: jsonResponse({ error: 'student_id or parent_contact_id required' }, 400) };
}

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
      return jsonResponse({
        success: true,
        contact: await foundationInsert(env, 'parent_contacts', {
          id: makeId('pc'),
          student_id: body.student_id,
          name: body.name || null,
          relation: body.relation || null,
          phone: String(body.phone || '').trim(),
          is_primary: body.is_primary ?? 1,
          receive_attendance: body.receive_attendance ?? 1,
          receive_payment: body.receive_payment ?? 1,
          receive_notice: body.receive_notice ?? 1,
          receive_report: body.receive_report ?? 1,
          receive_marketing: body.receive_marketing ?? 0,
          memo: body.memo || null
        })
      });
    }

    if (method === 'PATCH' && subId) {
      const access = await assertCanAccessParentContact(env, teacher, subId);
      if (access.error) return access.error;
      return jsonResponse({ success: true, contact: await foundationPatch(env, 'parent_contacts', subId, body, CONTACT_PATCH_KEYS) });
    }

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

    if (method === 'POST') {
      const scope = await resolveMessageScope(env, teacher, body);
      if (scope.error) return scope.error;
      return jsonResponse({
        success: true,
        message: await foundationInsert(env, 'message_logs', {
          id: makeId('msg'),
          student_id: scope.student_id,
          parent_contact_id: scope.parent_contact_id,
          branch: body.branch ? normalizeBranch(body.branch) : null,
          message_type: body.message_type || 'manual',
          channel: normalizeFoundationLogChannel(body.channel),
          title: body.title || null,
          content: body.content || null,
          status: 'pending',
          provider_message_id: null,
          error_message: null,
          sent_at: null
        })
      });
    }
  }

  return null;
}
