import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, isAdminUser } from '../helpers/foundation-db.js';
import { jsonResponse } from '../helpers/response.js';

async function verifyAuth(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Basic ')) return null;
  try {
    const [loginId, password] = atob(auth.slice(6)).split(':');
    const hash = await sha256hex(password);
    const teacher = await env.DB.prepare(
      'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
    ).bind(loginId, hash).first();
    return teacher || null;
  } catch (e) {
    return null;
  }
}

async function requireTeacher(request, env, teacher) {
  return teacher || await verifyAuth(request, env);
}

function todayKstDateString() {
  return new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];
}

export async function handleClassDaily(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource === 'class-textbooks') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const classId = url.searchParams.get('class') || '';
      const status = url.searchParams.get('status') || '';

      if (classId) {
        if (!(await canAccessClass(currentTeacher, classId, env))) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        let query = 'SELECT * FROM class_textbooks WHERE class_id = ?';
        const params = [classId];

        if (status) {
          query += ' AND status = ?';
          params.push(status);
        }

        query += ' ORDER BY sort_order ASC, created_at ASC';

        const res = await env.DB.prepare(query).bind(...params).all();
        return jsonResponse({ success: true, items: res.results });
      }

      if (isAdminUser(currentTeacher)) {
        const res = await env.DB.prepare('SELECT * FROM class_textbooks ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC').all();
        return jsonResponse({ success: true, items: res.results });
      }

      const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(currentTeacher.id).all();
      const classIds = tcls.results.map(r => r.class_id);

      if (!classIds.length) {
        return jsonResponse({ success: true, items: [] });
      }

      const markers = classIds.map(() => '?').join(',');
      const res = await env.DB.prepare(`SELECT * FROM class_textbooks WHERE class_id IN (${markers}) ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC`).bind(...classIds).all();
      return jsonResponse({ success: true, items: res.results });
    }

    if (method === 'POST') {
      const d = await request.json();

      if (!d.class_id || !String(d.title || '').trim()) {
        return jsonResponse({ success: false, error: 'class_id and title required' }, 400);
      }

      if (!(await canAccessClass(currentTeacher, d.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const tid = `tx_${crypto.randomUUID()}`;
      const startDate = d.start_date || todayKstDateString();

      await env.DB.prepare(`
        INSERT INTO class_textbooks (
          id, class_id, title, status, start_date, end_date, sort_order, created_at, updated_at
        ) VALUES (?, ?, ?, 'active', ?, NULL, ?, DATETIME('now'), DATETIME('now'))
      `).bind(
        tid,
        d.class_id,
        String(d.title).trim(),
        startDate,
        Number(d.sort_order || 0)
      ).run();

      const item = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(tid).first();
      return jsonResponse({ success: true, item });
    }

    if (method === 'PATCH' && id) {
      const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

      if (!current) {
        return jsonResponse({ success: false, error: 'not found' }, 404);
      }

      if (!(await canAccessClass(currentTeacher, current.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const d = await request.json();
      const nextStatus = d.status || current.status || 'active';
      const today = todayKstDateString();

      let nextEndDate = d.end_date !== undefined ? d.end_date : current.end_date;
      if (nextStatus === 'completed' && !nextEndDate) nextEndDate = today;
      if (nextStatus === 'active' && d.clear_end_date === true) nextEndDate = null;

      await env.DB.prepare(`
        UPDATE class_textbooks
        SET title = ?,
            status = ?,
            start_date = ?,
            end_date = ?,
            sort_order = ?,
            updated_at = DATETIME('now')
        WHERE id = ?
      `).bind(
        String(d.title !== undefined ? d.title : current.title).trim(),
        nextStatus,
        d.start_date !== undefined ? d.start_date : current.start_date,
        nextEndDate,
        d.sort_order !== undefined ? Number(d.sort_order || 0) : Number(current.sort_order || 0),
        id
      ).run();

      const item = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();
      return jsonResponse({ success: true, item });
    }

    if (method === 'DELETE' && id) {
      const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

      if (!current) {
        return jsonResponse({ success: false, error: 'not found' }, 404);
      }

      if (!(await canAccessClass(currentTeacher, current.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      await env.DB.prepare('DELETE FROM class_textbooks WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true });
    }
  }

  if (resource === 'class-daily-records') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const classId = url.searchParams.get('class') || '';
      const date = url.searchParams.get('date') || todayKstDateString();

      if (classId) {
        if (!(await canAccessClass(currentTeacher, classId, env))) {
          return jsonResponse({ error: 'Forbidden' }, 403);
        }

        const records = await env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? AND date = ? ORDER BY created_at ASC').bind(classId, date).all();
        const progress = await env.DB.prepare(`
          SELECT *
          FROM class_daily_progress
          WHERE class_id = ?
            AND record_id IN (
              SELECT id FROM class_daily_records WHERE class_id = ? AND date = ?
            )
          ORDER BY created_at ASC
        `).bind(classId, classId, date).all();

        return jsonResponse({
          success: true,
          date,
          records: records.results,
          progress: progress.results
        });
      }

      let classIds = [];
      if (isAdminUser(currentTeacher)) {
        const allClasses = await env.DB.prepare('SELECT id FROM classes WHERE is_active != 0 OR is_active IS NULL').all();
        classIds = allClasses.results.map(r => r.id);
      } else {
        const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(currentTeacher.id).all();
        classIds = tcls.results.map(r => r.class_id);
      }

      if (!classIds.length) {
        return jsonResponse({ success: true, date, records: [], progress: [] });
      }

      const markers = classIds.map(() => '?').join(',');
      const records = await env.DB.prepare(`SELECT * FROM class_daily_records WHERE date = ? AND class_id IN (${markers}) ORDER BY class_id ASC, created_at ASC`).bind(date, ...classIds).all();
      const progress = await env.DB.prepare(`SELECT * FROM class_daily_progress WHERE record_id IN (SELECT id FROM class_daily_records WHERE date = ? AND class_id IN (${markers})) ORDER BY created_at ASC`).bind(date, ...classIds).all();

      return jsonResponse({
        success: true,
        date,
        records: records.results,
        progress: progress.results
      });
    }

    if (method === 'POST') {
      const d = await request.json();

      if (!d.class_id || !d.date) {
        return jsonResponse({ success: false, error: 'class_id and date required' }, 400);
      }

      if (!(await canAccessClass(currentTeacher, d.class_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const existing = await env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? AND date = ?').bind(d.class_id, d.date).first();
      const recordId = existing?.id || `cdr_${crypto.randomUUID()}`;
      const teacherName = d.teacher_name || currentTeacher.name || '';
      const specialNote = d.special_note || '';

      const stmts = [];

      if (existing) {
        stmts.push(env.DB.prepare(`
          UPDATE class_daily_records
          SET teacher_name = ?,
              special_note = ?,
              updated_at = DATETIME('now')
          WHERE id = ?
        `).bind(teacherName, specialNote, recordId));
      } else {
        stmts.push(env.DB.prepare(`
          INSERT INTO class_daily_records (
            id, class_id, date, teacher_name, special_note, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
        `).bind(recordId, d.class_id, d.date, teacherName, specialNote));
      }

      stmts.push(env.DB.prepare('DELETE FROM class_daily_progress WHERE record_id = ?').bind(recordId));

      const progressItems = Array.isArray(d.progress) ? d.progress : [];

      for (const item of progressItems) {
        const textbookId = item.textbook_id || '';
        const progressText = String(item.progress_text || '').trim();

        if (!textbookId && !String(item.textbook_title_snapshot || '').trim()) continue;

        let titleSnapshot = String(item.textbook_title_snapshot || '').trim();

        if (textbookId) {
          const textbook = await env.DB.prepare('SELECT title FROM class_textbooks WHERE id = ? AND class_id = ?').bind(textbookId, d.class_id).first();
          if (textbook?.title) titleSnapshot = textbook.title;
        }

        if (!titleSnapshot) continue;

        stmts.push(env.DB.prepare(`
          INSERT INTO class_daily_progress (
            id, record_id, class_id, textbook_id, textbook_title_snapshot, progress_text, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, DATETIME('now'))
        `).bind(
          `cdp_${crypto.randomUUID()}`,
          recordId,
          d.class_id,
          textbookId || null,
          titleSnapshot,
          progressText
        ));
      }

      await env.DB.batch(stmts);

      const record = await env.DB.prepare('SELECT * FROM class_daily_records WHERE id = ?').bind(recordId).first();
      const progress = await env.DB.prepare('SELECT * FROM class_daily_progress WHERE record_id = ? ORDER BY created_at ASC').bind(recordId).all();

      return jsonResponse({
        success: true,
        record,
        progress: progress.results
      });
    }
  }

  return null;
}
