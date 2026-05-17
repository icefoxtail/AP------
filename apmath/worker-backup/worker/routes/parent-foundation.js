import { jsonResponse } from '../helpers/response.js';
import { normalizeBranch } from '../helpers/branch.js';
import { canAccessStudent, foundationInsert, foundationPatch, getAllowedClassIds, isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';

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
const CONSENT_TYPES = new Set(['attendance', 'payment', 'notice', 'report', 'marketing', 'consultation', 'homework', 'exam']);
const LEGACY_CONSENT_FIELDS = {
  attendance: 'receive_attendance',
  payment: 'receive_payment',
  notice: 'receive_notice',
  report: 'receive_report',
  marketing: 'receive_marketing',
  consultation: 'receive_notice',
  homework: 'receive_notice',
  exam: 'receive_notice'
};

function parseLimit(url, fallback = null, max = 1000) {
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

function addOptionalFlag(url, where, params, queryKey, column = queryKey) {
  const value = url.searchParams.get(queryKey);
  if (value === null || value === '') return;
  const n = Number(value);
  if (!Number.isFinite(n)) return;
  where.push(`${column} = ?`);
  params.push(n ? 1 : 0);
}

function appendLimit(sql, limit) {
  return Number.isFinite(limit) ? `${sql} LIMIT ${limit}` : sql;
}

function normalizeFoundationLogChannel(value) {
  const channel = String(value || 'log').trim().toLowerCase();
  return FOUNDATION_LOG_CHANNELS.has(channel) ? channel : 'log';
}

function normalizeConsentType(value) {
  const type = String(value || '').trim().toLowerCase();
  return CONSENT_TYPES.has(type) ? type : '';
}

function normalizeConsentBranch(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw || raw === 'all') return 'all';
  return normalizeBranch(raw);
}

function normalizeBooleanFlag(value, fallback = 1) {
  if (value === undefined || value === null || value === '') return fallback ? 1 : 0;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const text = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on', 'allowed'].includes(text)) return 1;
  if (['0', 'false', 'no', 'n', 'off', 'denied'].includes(text)) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? (n ? 1 : 0) : (fallback ? 1 : 0);
}

async function findParentContact(env, contactId) {
  const id = String(contactId || '').trim();
  if (!id) return null;
  return await env.DB.prepare('SELECT * FROM parent_contacts WHERE id = ? LIMIT 1').bind(id).first();
}

async function findParentConsent(env, consentId) {
  const id = String(consentId || '').trim();
  if (!id) return null;
  return await env.DB.prepare('SELECT * FROM parent_contact_consents WHERE id = ? LIMIT 1').bind(id).first();
}

async function assertCanAccessParentContact(env, teacher, contactId) {
  const contact = await findParentContact(env, contactId);
  if (!contact) return { error: jsonResponse({ error: 'Contact not found' }, 404) };
  if (!(await canAccessStudent(teacher, contact.student_id, env))) {
    return { error: jsonResponse({ error: 'Forbidden' }, 403) };
  }
  return { contact };
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
      parent_contact_id: contact.id,
      contact
    };
  }

  if (bodyStudentId) {
    if (!(await canAccessStudent(teacher, bodyStudentId, env))) {
      return { error: jsonResponse({ error: 'Forbidden' }, 403) };
    }
    return {
      student_id: bodyStudentId,
      parent_contact_id: null,
      contact: null
    };
  }

  if (isAdminUser(teacher)) {
    return {
      student_id: null,
      parent_contact_id: null,
      contact: null
    };
  }

  return { error: jsonResponse({ error: 'student_id or parent_contact_id required' }, 400) };
}

function getLegacyConsentValue(contact, consentType) {
  const field = LEGACY_CONSENT_FIELDS[consentType] || 'receive_notice';
  return normalizeBooleanFlag(contact?.[field], 1);
}

async function getScopedConsent(env, contact, branch, consentType) {
  if (!contact?.id || !consentType) {
    return { is_allowed: 1, source: 'none', row: null };
  }
  const rows = await safeAll(env, `
    SELECT * FROM parent_contact_consents
    WHERE parent_contact_id = ?
      AND student_id = ?
      AND consent_type = ?
      AND branch IN (?, 'all')
    ORDER BY CASE WHEN branch = ? THEN 0 ELSE 1 END, updated_at DESC, created_at DESC
    LIMIT 2
  `, [contact.id, contact.student_id, consentType, branch, branch]);
  const exact = rows.find(row => String(row.branch || 'all') === branch);
  const all = rows.find(row => String(row.branch || 'all') === 'all');
  const picked = exact || all;
  if (picked) {
    return {
      is_allowed: normalizeBooleanFlag(picked.is_allowed, 1),
      source: exact ? 'scoped' : 'all',
      row: picked
    };
  }
  return {
    is_allowed: getLegacyConsentValue(contact, consentType),
    source: 'legacy',
    row: null
  };
}

async function listParentConsents(env, teacher, url) {
  const where = [];
  const params = [];
  const parentContactId = String(url.searchParams.get('parent_contact_id') || '').trim();
  const studentId = String(url.searchParams.get('student_id') || '').trim();
  const rawBranch = String(url.searchParams.get('branch') || '').trim();
  const rawConsentType = String(url.searchParams.get('consent_type') || '').trim();
  const consentType = rawConsentType ? normalizeConsentType(rawConsentType) : '';

  if (rawConsentType && !consentType) return { error: jsonResponse({ error: 'Invalid consent_type' }, 400) };

  if (parentContactId) {
    const contact = await findParentContact(env, parentContactId);
    if (!contact) return { error: jsonResponse({ error: 'Contact not found' }, 404) };
    if (!(await canAccessStudent(teacher, contact.student_id, env))) return { error: jsonResponse({ error: 'Forbidden' }, 403) };
    where.push('parent_contact_id = ?');
    params.push(parentContactId);
  }

  if (studentId) {
    if (!(await canAccessStudent(teacher, studentId, env))) return { error: jsonResponse({ error: 'Forbidden' }, 403) };
    where.push('student_id = ?');
    params.push(studentId);
  }

  if (rawBranch) {
    where.push('branch = ?');
    params.push(normalizeConsentBranch(rawBranch));
  }

  if (consentType) {
    where.push('consent_type = ?');
    params.push(consentType);
  }

  if (!isAdminUser(teacher)) {
    const classIds = await getAllowedClassIds(env, teacher);
    if (!classIds?.length) return { consents: [] };
    const cMarkers = classIds.map(() => '?').join(',');
    where.push(`student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers}))`);
    params.push(...classIds);
  }

  const limit = parseLimit(url, null, 1000);
  const sql = appendLimit(`
    SELECT * FROM parent_contact_consents
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY updated_at DESC, created_at DESC
  `, limit);
  return { consents: await safeAll(env, sql, params) };
}

async function upsertParentConsent(env, teacher, body = {}) {
  const parentContactId = String(body.parent_contact_id || '').trim();
  const contact = await findParentContact(env, parentContactId);
  if (!contact) return { error: jsonResponse({ error: 'Contact not found' }, 404) };
  if (!(await canAccessStudent(teacher, contact.student_id, env))) return { error: jsonResponse({ error: 'Forbidden' }, 403) };

  const bodyStudentId = String(body.student_id || '').trim();
  if (bodyStudentId && bodyStudentId !== String(contact.student_id || '')) {
    return { error: jsonResponse({ error: 'student_id does not match parent_contact_id' }, 400) };
  }

  const consentType = normalizeConsentType(body.consent_type);
  if (!consentType) return { error: jsonResponse({ error: 'Invalid consent_type' }, 400) };

  const branch = normalizeConsentBranch(body.branch);
  const isAllowed = normalizeBooleanFlag(body.is_allowed, 1);
  const memo = body.memo === undefined ? null : String(body.memo || '').trim() || null;
  const existing = await env.DB.prepare(`
    SELECT * FROM parent_contact_consents
    WHERE parent_contact_id = ? AND student_id = ? AND branch = ? AND consent_type = ?
    LIMIT 1
  `).bind(parentContactId, contact.student_id, branch, consentType).first();

  if (existing?.id) {
    await env.DB.prepare(`
      UPDATE parent_contact_consents
      SET is_allowed = ?, changed_by = ?, memo = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(isAllowed, teacher?.id || null, memo, existing.id).run();
    return {
      consent: {
        ...existing,
        is_allowed: isAllowed,
        changed_by: teacher?.id || null,
        memo,
        updated_at: new Date().toISOString()
      },
      updated_existing: true
    };
  }

  const consent = {
    id: makeId('pcc'),
    parent_contact_id: parentContactId,
    student_id: contact.student_id,
    branch,
    consent_type: consentType,
    is_allowed: isAllowed,
    changed_by: teacher?.id || null,
    memo
  };

  await env.DB.prepare(`
    INSERT INTO parent_contact_consents
    (id, parent_contact_id, student_id, branch, consent_type, is_allowed, changed_by, memo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(consent.id, consent.parent_contact_id, consent.student_id, consent.branch, consent.consent_type, consent.is_allowed, consent.changed_by, consent.memo).run();

  return { consent, updated_existing: false };
}

async function patchParentConsent(env, teacher, consentId, body = {}) {
  const consent = await findParentConsent(env, consentId);
  if (!consent) return { error: jsonResponse({ error: 'Consent not found' }, 404) };
  if (!(await canAccessStudent(teacher, consent.student_id, env))) return { error: jsonResponse({ error: 'Forbidden' }, 403) };

  const patch = {
    is_allowed: normalizeBooleanFlag(body.is_allowed, Number(consent.is_allowed || 0)),
    changed_by: teacher?.id || null,
    memo: body.memo === undefined ? consent.memo || null : String(body.memo || '').trim() || null,
    updated_at: new Date().toISOString()
  };

  await env.DB.prepare(`
    UPDATE parent_contact_consents
    SET is_allowed = ?, changed_by = ?, memo = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(patch.is_allowed, patch.changed_by, patch.memo, consent.id).run();

  return { consent: { ...consent, ...patch } };
}

async function buildMessagePreview(env, teacher, body = {}) {
  const consentType = normalizeConsentType(body.consent_type || body.message_type || 'notice');
  if (!consentType) return { error: jsonResponse({ error: 'Invalid consent_type' }, 400) };

  const branch = normalizeConsentBranch(body.branch);
  const classId = String(body.class_id || '').trim();
  const requestedStudentIds = Array.isArray(body.student_ids)
    ? [...new Set(body.student_ids.map(v => String(v || '').trim()).filter(Boolean))]
    : [];

  const where = [];
  const params = [];

  if (classId) {
    if (!isAdminUser(teacher)) {
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.includes(classId)) return { error: jsonResponse({ error: 'Forbidden' }, 403) };
    }
    where.push('pc.student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)');
    params.push(classId);
  }

  if (requestedStudentIds.length) {
    for (const studentId of requestedStudentIds) {
      if (!(await canAccessStudent(teacher, studentId, env))) return { error: jsonResponse({ error: 'Forbidden' }, 403) };
    }
    const markers = requestedStudentIds.map(() => '?').join(',');
    where.push(`pc.student_id IN (${markers})`);
    params.push(...requestedStudentIds);
  }

  if (!classId && !requestedStudentIds.length && !isAdminUser(teacher)) {
    const classIds = await getAllowedClassIds(env, teacher);
    if (!classIds?.length) return { preview: { candidates: [], included: [], excluded: [], summary: { total: 0, included: 0, excluded: 0 } } };
    const cMarkers = classIds.map(() => '?').join(',');
    where.push(`pc.student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers}))`);
    params.push(...classIds);
  }

  const contacts = await safeAll(env, `
    SELECT pc.*, s.name AS student_name, s.grade AS student_grade, s.school_name AS student_school_name
    FROM parent_contacts pc
    LEFT JOIN students s ON s.id = pc.student_id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY pc.is_primary DESC, pc.created_at DESC
  `, params);

  if (!contacts.length) {
    return { preview: { candidates: [], included: [], excluded: [], summary: { total: 0, included: 0, excluded: 0 } } };
  }

  const seenPhones = new Set();
  const candidates = [];

  for (const contact of contacts) {
    const scoped = await getScopedConsent(env, contact, branch, consentType);
    const phone = String(contact.phone || '').trim();
    const normalizedPhone = phone.replace(/[^0-9]/g, '');
    const reasons = [];
    if (!phone) reasons.push('missing_phone');
    if (!scoped.is_allowed) reasons.push('consent_denied');
    if (normalizedPhone && seenPhones.has(normalizedPhone)) reasons.push('duplicate_phone');
    if (normalizedPhone && !seenPhones.has(normalizedPhone)) seenPhones.add(normalizedPhone);

    candidates.push({
      student_id: contact.student_id || null,
      student_name: contact.student_name || null,
      parent_contact_id: contact.id,
      parent_name: contact.name || null,
      relation: contact.relation || null,
      phone,
      branch,
      consent_type: consentType,
      is_allowed: scoped.is_allowed,
      consent_source: scoped.source,
      excluded: reasons.length > 0,
      exclude_reasons: reasons
    });
  }

  const included = candidates.filter(row => !row.excluded);
  const excluded = candidates.filter(row => row.excluded);
  return {
    preview: {
      message_type: String(body.message_type || consentType || 'notice'),
      channel: normalizeFoundationLogChannel(body.channel),
      branch,
      consent_type: consentType,
      candidates,
      included,
      excluded,
      summary: {
        total: candidates.length,
        included: included.length,
        excluded: excluded.length
      }
    }
  };
}

async function buildMessageLogSnapshot(env, contact, branch, consentType) {
  if (!contact) {
    return {
      recipient_phone_snapshot: null,
      recipient_name_snapshot: null,
      relation_snapshot: null,
      consent_snapshot_json: null
    };
  }

  const scoped = await getScopedConsent(env, contact, branch, consentType);
  return {
    recipient_phone_snapshot: String(contact.phone || '').trim() || null,
    recipient_name_snapshot: contact.name || null,
    relation_snapshot: contact.relation || null,
    consent_snapshot_json: JSON.stringify({
      parent_contact_id: contact.id,
      student_id: contact.student_id || null,
      branch,
      consent_type: consentType,
      is_allowed: scoped.is_allowed,
      source: scoped.source,
      captured_at: new Date().toISOString()
    })
  };
}

export async function handleParentFoundation(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const sub = path[2];
  const subId = path[3];

  if (sub === 'contacts') {
    if (method === 'GET') {
      const where = [];
      const params = [];
      addOptionalEquals(url, where, params, 'student_id');
      addOptionalFlag(url, where, params, 'is_primary');
      addOptionalFlag(url, where, params, 'receive_attendance');
      addOptionalFlag(url, where, params, 'receive_payment');
      addOptionalFlag(url, where, params, 'receive_notice');
      addOptionalFlag(url, where, params, 'receive_report');
      addOptionalFlag(url, where, params, 'receive_marketing');

      if (!isAdminUser(teacher)) {
        const classIds = await getAllowedClassIds(env, teacher);
        if (!classIds?.length) return jsonResponse({ success: true, contacts: [] });
        const cMarkers = classIds.map(() => '?').join(',');
        where.push(`student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers}))`);
        params.push(...classIds);
      }

      const limit = parseLimit(url, null, 1000);
      const sql = appendLimit(`SELECT * FROM parent_contacts${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC`, limit);
      const contacts = await safeAll(env, sql, params);
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

  if (sub === 'consents') {
    if (method === 'GET') {
      const result = await listParentConsents(env, teacher, url);
      if (result.error) return result.error;
      return jsonResponse({ success: true, consents: result.consents });
    }

    if (method === 'POST') {
      const result = await upsertParentConsent(env, teacher, body);
      if (result.error) return result.error;
      return jsonResponse({ success: true, consent: result.consent, updated_existing: result.updated_existing });
    }

    if (method === 'PATCH' && subId) {
      const result = await patchParentConsent(env, teacher, subId, body);
      if (result.error) return result.error;
      return jsonResponse({ success: true, consent: result.consent });
    }
  }

  if (sub === 'message-preview') {
    if (method === 'POST') {
      const result = await buildMessagePreview(env, teacher, body);
      if (result.error) return result.error;
      return jsonResponse({ success: true, preview: result.preview });
    }
  }

  if (sub === 'messages') {
    if (method === 'GET') {
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
        if (!classIds?.length) return jsonResponse({ success: true, messages: [] });
        const cMarkers = classIds.map(() => '?').join(',');
        where.push(`student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers}))`);
        params.push(...classIds);
      }

      const limit = parseLimit(url, isAdminUser(teacher) ? 1000 : 500, 1000);
      const sql = appendLimit(`SELECT * FROM message_logs${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY created_at DESC`, limit);
      const messages = await safeAll(env, sql, params);
      return jsonResponse({ success: true, messages });
    }

    if (method === 'POST') {
      const scope = await resolveMessageScope(env, teacher, body);
      if (scope.error) return scope.error;
      const branch = body.branch ? normalizeBranch(body.branch) : null;
      const consentType = normalizeConsentType(body.consent_type || body.message_type || 'notice') || 'notice';
      const snapshot = await buildMessageLogSnapshot(env, scope.contact, normalizeConsentBranch(branch), consentType);
      return jsonResponse({
        success: true,
        message: await foundationInsert(env, 'message_logs', {
          id: makeId('msg'),
          student_id: scope.student_id,
          parent_contact_id: scope.parent_contact_id,
          branch,
          message_type: body.message_type || 'manual',
          channel: normalizeFoundationLogChannel(body.channel),
          title: body.title || null,
          content: body.content || null,
          status: 'pending',
          provider_message_id: null,
          error_message: null,
          sent_at: null,
          recipient_phone_snapshot: snapshot.recipient_phone_snapshot,
          recipient_name_snapshot: snapshot.recipient_name_snapshot,
          relation_snapshot: snapshot.relation_snapshot,
          consent_snapshot_json: snapshot.consent_snapshot_json,
          template_key: body.template_key || null,
          provider: null,
          preview_batch_id: body.preview_batch_id || null,
          queued_at: null,
          delivered_at: null,
          failed_at: null,
          retry_of: null
        })
      });
    }
  }

  return null;
}
