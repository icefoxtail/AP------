import { jsonResponse } from '../helpers/response.js';
import { normalizeBranch } from '../helpers/branch.js';
import { foundationInsert, foundationPatch, foundationSelect, getAllowedClassIds, isAdminUser, makeId, safeAll } from '../helpers/foundation-db.js';

export async function handleBillingFoundation(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const sub = path[2];
  const subId = path[3];

  if (sub === 'templates') {
    if (method === 'GET') return jsonResponse({ success: true, templates: await foundationSelect(env, 'billing_templates', [], [], 'branch ASC, name ASC') });
    if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    if (method === 'POST') return jsonResponse({ success: true, template: await foundationInsert(env, 'billing_templates', { id: makeId('bt'), branch: normalizeBranch(body.branch), class_id: body.class_id || null, name: String(body.name || '').trim(), default_amount: Number(body.default_amount || 0), item_type: body.item_type || null, is_active: body.is_active ?? 1, memo: body.memo || null }) });
    if (method === 'PATCH' && subId) return jsonResponse({ success: true, template: await foundationPatch(env, 'billing_templates', subId, { ...body, branch: body.branch ? normalizeBranch(body.branch) : undefined }, ['branch', 'class_id', 'name', 'default_amount', 'item_type', 'is_active', 'memo']) });
  }

  if (sub === 'payments') {
    if (method === 'GET') {
      if (isAdminUser(teacher)) return jsonResponse({ success: true, payments: await foundationSelect(env, 'payments', [], [], 'year DESC, month DESC, created_at DESC') });
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.length) return jsonResponse({ success: true, payments: [] });
      const cMarkers = classIds.map(() => '?').join(',');
      const payments = await safeAll(env, `SELECT * FROM payments WHERE student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})) ORDER BY year DESC, month DESC, created_at DESC`, classIds);
      return jsonResponse({ success: true, payments });
    }
    if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    if (method === 'POST') return jsonResponse({ success: true, payment: await foundationInsert(env, 'payments', { id: makeId('pay'), student_id: body.student_id, billing_run_id: body.billing_run_id || null, year: Number(body.year), month: Number(body.month), total_amount: Number(body.total_amount || 0), paid_amount: Number(body.paid_amount || 0), due_date: body.due_date || null, paid_date: body.paid_date || null, status: body.status || 'unpaid', payment_method: body.payment_method || null, note: body.note || null, invoice_sent_at: body.invoice_sent_at || null, receipt_sent_at: body.receipt_sent_at || null }) });
    if (method === 'PATCH' && subId) return jsonResponse({ success: true, payment: await foundationPatch(env, 'payments', subId, body, ['billing_run_id', 'year', 'month', 'total_amount', 'paid_amount', 'due_date', 'paid_date', 'status', 'payment_method', 'note', 'invoice_sent_at', 'receipt_sent_at']) });
  }

  if (sub === 'runs') {
    if (method === 'GET') return jsonResponse({ success: true, runs: await foundationSelect(env, 'billing_runs', [], [], 'year DESC, month DESC, created_at DESC') });
    if (!isAdminUser(teacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    if (method === 'POST') return jsonResponse({ success: true, run: await foundationInsert(env, 'billing_runs', { id: makeId('br'), year: Number(body.year), month: Number(body.month), branch: body.branch || 'all', status: body.status || 'draft', total_amount: Number(body.total_amount || 0), issued_count: Number(body.issued_count || 0), created_by: teacher.id, issued_at: body.issued_at || null }) });
  }

  return null;
}
