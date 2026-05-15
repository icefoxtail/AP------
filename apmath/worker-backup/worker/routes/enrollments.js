import { jsonResponse } from '../helpers/response.js';
import { normalizeBranch } from '../helpers/branch.js';
import { canAccessClass, canAccessStudent, foundationInsert, foundationPatch, foundationSelect, getAllowedClassIds, isAdminUser, makeId } from '../helpers/foundation-db.js';

export async function handleEnrollments(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const id = path[2];
  if (method === 'GET') {
    const where = [];
    const params = [];
    if (url.searchParams.get('student_id')) { where.push('student_id = ?'); params.push(url.searchParams.get('student_id')); }
    if (url.searchParams.get('class_id')) { where.push('class_id = ?'); params.push(url.searchParams.get('class_id')); }
    if (!isAdminUser(teacher)) {
      const classIds = await getAllowedClassIds(env, teacher);
      if (!classIds?.length) return jsonResponse({ success: true, enrollments: [] });
      where.push(`class_id IN (${classIds.map(() => '?').join(',')})`);
      params.push(...classIds);
    }
    return jsonResponse({ success: true, enrollments: await foundationSelect(env, 'student_enrollments', where, params) });
  }
  if (method === 'POST') {
    if (!(await canAccessStudent(teacher, body.student_id, env)) || !(await canAccessClass(teacher, body.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const row = {
      id: makeId('enr'),
      student_id: String(body.student_id || '').trim(),
      branch: normalizeBranch(body.branch),
      class_id: String(body.class_id || '').trim(),
      status: String(body.status || 'active').trim(),
      start_date: body.start_date || null,
      end_date: null,
      tuition_amount: Number.isFinite(Number(body.tuition_amount)) ? Number(body.tuition_amount) : null,
      memo: body.memo || null
    };
    if (!row.student_id || !row.class_id) return jsonResponse({ success: false, error: 'student_id and class_id required' }, 400);
    row.end_date = body.end_date || null;
    return jsonResponse({ success: true, enrollment: await foundationInsert(env, 'student_enrollments', row) });
  }
  if (method === 'PATCH' && id) {
    const existing = await env.DB.prepare('SELECT * FROM student_enrollments WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, existing.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    if (body.class_id && !(await canAccessClass(teacher, body.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    const changed = await foundationPatch(env, 'student_enrollments', id, { ...body, branch: body.branch ? normalizeBranch(body.branch) : undefined }, ['student_id', 'branch', 'class_id', 'status', 'start_date', 'end_date', 'tuition_amount', 'memo']);
    return jsonResponse({ success: true, enrollment: changed });
  }
  if (method === 'DELETE' && id) {
    const existing = await env.DB.prepare('SELECT * FROM student_enrollments WHERE id = ?').bind(id).first();
    if (!existing) return jsonResponse({ error: 'Not found' }, 404);
    if (!(await canAccessClass(teacher, existing.class_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
    await env.DB.prepare("UPDATE student_enrollments SET status = 'ended', end_date = COALESCE(end_date, DATE('now', '+9 hours')), updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run();
    return jsonResponse({ success: true });
  }
  return null;
}
