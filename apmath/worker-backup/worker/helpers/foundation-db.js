const FOUNDATION_TABLES = new Set([
  'student_enrollments',
  'class_time_slots',
  'timetable_conflict_logs',
  'timetable_conflict_overrides',
  'billing_templates',
  'payments',
  'payment_items',
  'billing_adjustments',
  'billing_runs',
  'parent_contacts',
  'message_logs',
  'student_status_history',
  'class_transfer_history',
  'staff_permissions',
  'audit_logs',
  'privacy_access_logs'
]);

export function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isAdminUser(teacher) {
  return teacher?.role === 'admin';
}

export function isStaffUser(user) {
  const role = String(user?.role || '').toLowerCase();
  return role === 'admin' || role === 'teacher';
}

export async function safeAll(env, sql, params = []) {
  try {
    const res = await env.DB.prepare(sql).bind(...params).all();
    return res.results || [];
  } catch (e) {
    return [];
  }
}

function assertFoundationTable(table) {
  if (!FOUNDATION_TABLES.has(table)) throw new Error(`Unsupported foundation table: ${table}`);
}

export async function getAllowedClassIds(env, teacher) {
  if (isAdminUser(teacher)) return null;
  const res = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
  return (res.results || []).map(r => String(r.class_id));
}

export async function canAccessStudent(teacher, studentId, env) {
  if (isAdminUser(teacher)) return true;
  const row = await env.DB.prepare(`
    SELECT 1 FROM class_students cs
    JOIN teacher_classes tc ON tc.class_id = cs.class_id
    WHERE cs.student_id = ? AND tc.teacher_id = ?
    LIMIT 1
  `).bind(studentId, teacher.id).first();
  return !!row;
}

export async function canAccessClass(teacher, classId, env) {
  if (isAdminUser(teacher)) return true;
  const row = await env.DB.prepare(`
    SELECT 1 FROM teacher_classes
    WHERE teacher_id = ? AND class_id = ?
  `).bind(teacher.id, classId).first();
  return !!row;
}

export async function foundationSelect(env, table, where = [], params = [], order = 'created_at DESC') {
  assertFoundationTable(table);
  const sql = `SELECT * FROM ${table}${where.length ? ` WHERE ${where.join(' AND ')}` : ''}${order ? ` ORDER BY ${order}` : ''}`;
  const res = await env.DB.prepare(sql).bind(...params).all();
  return res.results || [];
}

export async function foundationInsert(env, table, row) {
  assertFoundationTable(table);
  const keys = Object.keys(row);
  const placeholders = keys.map(() => '?').join(', ');
  await env.DB.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`).bind(...keys.map(k => row[k])).run();
  return row;
}

export async function foundationPatch(env, table, id, data, allowedKeys) {
  assertFoundationTable(table);
  const row = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== undefined) row[key] = data[key];
  }
  row.updated_at = new Date().toISOString();
  const keys = Object.keys(row);
  if (!keys.length) return null;
  await env.DB.prepare(`UPDATE ${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE id = ?`).bind(...keys.map(k => row[k]), id).run();
  return { id, ...row };
}
