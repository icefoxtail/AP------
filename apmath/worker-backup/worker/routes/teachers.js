import { jsonResponse } from '../helpers/response.js';
import { isAdminUser } from '../helpers/foundation-db.js';
import { sha256hex } from '../helpers/admin-db.js';

export async function handleTeachers(request, env, teacher, path, url, body = {}) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (!isAdminUser(teacher)) return jsonResponse({ error: 'Unauthorized' }, 401);

  if (resource === 'teachers' && method === 'GET') {
    const res = await env.DB.prepare('SELECT id, name, login_id, role FROM teachers ORDER BY role DESC').all();
    const map = await env.DB.prepare('SELECT * FROM teacher_classes').all();
    return jsonResponse({ teachers: res.results, teacher_classes: map.results });
  }

  if (resource === 'teacher-classes' && method === 'POST') {
    const { teacher_id, class_ids } = body;
    const stmts = [env.DB.prepare('DELETE FROM teacher_classes WHERE teacher_id = ?').bind(teacher_id)];
    for (const cid of (class_ids || [])) stmts.push(env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(teacher_id, cid));
    await env.DB.batch(stmts);
    return jsonResponse({ success: true });
  }

  if (resource === 'teachers' && method === 'POST') {
    const loginId = String(body.login_id || '').trim();
    const password = String(body.password || '').trim();
    const name = String(body.name || '').trim();
    const role = body.role === 'admin' ? 'admin' : 'teacher';
    if (!loginId || !password || !name) return jsonResponse({ error: 'Required fields: login_id, password, name' }, 400);
    const existing = await env.DB.prepare('SELECT 1 FROM teachers WHERE login_id = ?').bind(loginId).first();
    if (existing) return jsonResponse({ error: '이미 사용 중인 아이디입니다.' }, 409);
    const hash = await sha256hex(password);
    const tid = `t_${Date.now()}`;
    await env.DB.prepare('INSERT INTO teachers (id, name, login_id, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, DATETIME(\'now\'))').bind(tid, name, loginId, hash, role).run();
    return jsonResponse({ success: true, id: tid });
  }

  if (resource === 'teachers' && method === 'PATCH' && id) {
    if (path[3] === 'reset-password') {
      const newPass = String(body.new_password || '').trim();
      if (!newPass) return jsonResponse({ error: 'new_password required' }, 400);
      const hash = await sha256hex(newPass);
      await env.DB.prepare('UPDATE teachers SET password_hash = ? WHERE id = ?').bind(hash, id).run();
      return jsonResponse({ success: true });
    }
    const name = String(body.name || '').trim();
    if (!name) return jsonResponse({ error: 'name required' }, 400);
    const role = body.role === 'admin' ? 'admin' : 'teacher';
    await env.DB.prepare('UPDATE teachers SET name = ?, role = ? WHERE id = ?').bind(name, role, id).run();
    return jsonResponse({ success: true });
  }

  return null;
}
