import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, canAccessStudent } from '../helpers/foundation-db.js';
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

export async function handleExams(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource === 'exam-blueprints') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      const d = await request.json();
      if (!d.archive_file) return jsonResponse({ error: 'archive_file required' }, 400);
      if (!Array.isArray(d.items)) return jsonResponse({ error: 'items must be an array' }, 400);

      const stmts = [];
      for (const item of d.items) {
        if (!item.question_no) continue;

        const src_archive_file = item.source_archive_file || d.archive_file;
        const src_question_no = item.source_question_no || item.question_no;

        stmts.push(env.DB.prepare(`
          INSERT INTO exam_blueprints (
            archive_file, question_no, source_archive_file, source_question_no,
            standard_unit_key, standard_unit, standard_course, concept_cluster_key,
            created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
          ON CONFLICT(archive_file, question_no) DO UPDATE SET
            source_archive_file=excluded.source_archive_file,
            source_question_no=excluded.source_question_no,
            standard_unit_key=excluded.standard_unit_key,
            standard_unit=excluded.standard_unit,
            standard_course=excluded.standard_course,
            concept_cluster_key=excluded.concept_cluster_key,
            updated_at=DATETIME('now')
        `).bind(
          d.archive_file, item.question_no, src_archive_file, src_question_no,
          item.standard_unit_key || null, item.standard_unit || null, item.standard_course || null, item.concept_cluster_key || null
        ));
      }

      if (stmts.length > 0) {
        await env.DB.batch(stmts);
      }
      return jsonResponse({ success: true, count: stmts.length });
    }

    if (method === 'GET') {
      const file = url.searchParams.get('file');
      if (!file) return jsonResponse({ error: 'file parameter required' }, 400);

      const res = await env.DB.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ? ORDER BY question_no ASC').bind(file).all();
      return jsonResponse({ success: true, archive_file: file, items: res.results });
    }
  }

  if (resource === 'class-exam-assignments') {
    if (method === 'POST') {
      const d = await request.json();
      if (!d.class_id || !d.exam_title || !d.exam_date) {
        return jsonResponse({ success: false, error: 'class_id, exam_title, exam_date required' }, 400);
      }

      const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ? LIMIT 1').bind(d.class_id).first();
      if (!cls) {
        return jsonResponse({ success: false, error: 'class not found' }, 404);
      }

      const archive_file = d.archive_file || '';
      const source_type = d.source_type || 'archive';
      const aid = crypto.randomUUID();

      await env.DB.prepare(`
        INSERT INTO class_exam_assignments (id, class_id, exam_title, exam_date, question_count, archive_file, source_type, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
        ON CONFLICT(class_id, exam_title, exam_date, archive_file) DO UPDATE SET
          question_count = excluded.question_count,
          source_type = excluded.source_type,
          updated_at = DATETIME('now')
      `).bind(aid, d.class_id, d.exam_title, d.exam_date, d.question_count || 0, archive_file, source_type).run();

      const assignment = await env.DB.prepare('SELECT * FROM class_exam_assignments WHERE class_id = ? AND exam_title = ? AND exam_date = ? AND archive_file = ?')
        .bind(d.class_id, d.exam_title, d.exam_date, archive_file).first();

      return jsonResponse({ success: true, assignment });
    }

    if (method === 'GET') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const classId = url.searchParams.get('class');
      if (!classId) return jsonResponse({ success: false, error: 'classId required' }, 400);
      if (!(await canAccessClass(currentTeacher, classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

      const res = await env.DB.prepare(`
        SELECT * FROM class_exam_assignments
        WHERE class_id = ?
        ORDER BY exam_date DESC, updated_at DESC
      `).bind(classId).all();

      return jsonResponse({ success: true, assignments: res.results });
    }
  }

  if (resource === 'exam-sessions') {
    if (method === 'DELETE' && id === 'by-exam') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const classId = url.searchParams.get('class') || '';
      const examTitle = url.searchParams.get('exam') || '';
      const examDate = url.searchParams.get('date') || '';

      if (!classId || !examTitle || !examDate) {
        return jsonResponse({ success: false, error: 'class, exam, date required' }, 400);
      }
      if (!(await canAccessClass(currentTeacher, classId, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      const targets = await env.DB.prepare(`
        SELECT id
        FROM exam_sessions
        WHERE exam_title = ?
          AND exam_date = ?
          AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
      `).bind(examTitle, examDate, classId).all();

      const sessionIds = (targets.results || []).map(r => r.id).filter(Boolean);
      const stmts = [];

      for (const sessionId of sessionIds) {
        stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sessionId));
        stmts.push(env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(sessionId));
      }

      stmts.push(env.DB.prepare('DELETE FROM class_exam_assignments WHERE class_id = ? AND exam_title = ? AND exam_date = ?').bind(classId, examTitle, examDate));

      if (stmts.length > 0) {
        await env.DB.batch(stmts);
      }

      return jsonResponse({ success: true, deleted: sessionIds.length });
    }

    if (method === 'GET' && id === 'by-class') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
      const classId = url.searchParams.get('class');
      const examTitle = url.searchParams.get('exam') || null;
      if (!classId) return jsonResponse({ error: 'class required', students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] }, 400);
      if (!(await canAccessClass(currentTeacher, classId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

      const studentIds = await env.DB.prepare('SELECT student_id FROM class_students WHERE class_id = ?').bind(classId).all();
      const sIds = studentIds.results.map(r => r.student_id);
      if (!sIds.length) return jsonResponse({ students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] });

      const p = sIds.map(() => '?').join(',');
      const [students, sessions, wrongs, assignments] = await Promise.all([
        env.DB.prepare(`SELECT id, name, school_name, grade FROM students WHERE id IN (${p}) AND status='재원'`).bind(...sIds).all(),
        examTitle ? env.DB.prepare('SELECT * FROM exam_sessions WHERE class_id = ? AND exam_title = ? ORDER BY exam_date DESC').bind(classId, examTitle).all() : env.DB.prepare('SELECT * FROM exam_sessions WHERE class_id = ? ORDER BY exam_date DESC LIMIT 200').bind(classId).all(),
        env.DB.prepare(`SELECT * FROM wrong_answers WHERE student_id IN (${p})`).bind(...sIds).all(),
        env.DB.prepare('SELECT * FROM class_exam_assignments WHERE class_id = ? ORDER BY exam_date DESC, updated_at DESC').bind(classId).all()
      ]);

      const archiveFiles = [...new Set(
        (sessions.results || [])
          .map(s => s.archive_file)
          .filter(v => v && String(v).trim())
      )];

      let blueprints = { results: [] };
      if (archiveFiles.length > 0) {
        const bpMarkers = archiveFiles.map(() => '?').join(',');
        blueprints = await env.DB.prepare(`
          SELECT *
          FROM exam_blueprints
          WHERE archive_file IN (${bpMarkers})
          ORDER BY archive_file ASC, question_no ASC
        `).bind(...archiveFiles).all();
      }

      return jsonResponse({
        students: students.results,
        sessions: sessions.results,
        wrong_answers: wrongs.results,
        blueprints: blueprints.results,
        assignments: assignments.results
      });
    }

    if (method === 'POST' && id === 'bulk-omr') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const d = await request.json();
      const examTitle = String(d.exam_title || '').trim();
      const examDate = String(d.exam_date || '').trim();
      const questionCount = Math.max(1, Math.min(80, parseInt(d.question_count, 10) || 0));
      const archiveFile = String(d.archive_file || '').trim();
      const rows = Array.isArray(d.rows) ? d.rows : [];

      if (!examTitle || !examDate || !questionCount) {
        return jsonResponse({ success: false, error: 'exam_title, exam_date, question_count required' }, 400);
      }
      if (!rows.length) {
        return jsonResponse({ success: false, error: 'rows required' }, 400);
      }

      const sessionRows = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] || {};
        const studentId = String(row.student_id || '').trim();
        if (!studentId) continue;

        if (!(await canAccessStudent(currentTeacher, studentId, env))) {
          return jsonResponse({ error: 'Forbidden', student_id: studentId }, 403);
        }

        const classId = String(row.class_id || '').trim() || null;
        if (classId && !(await canAccessClass(currentTeacher, classId, env))) {
          return jsonResponse({ error: 'Forbidden', class_id: classId }, 403);
        }

        const wrongIds = Array.from(new Set((Array.isArray(row.wrong_ids) ? row.wrong_ids : [])
          .map(v => String(v).trim())
          .filter(v => /^\d+$/.test(v))
          .map(v => parseInt(v, 10))
          .filter(v => v >= 1 && v <= questionCount)
          .sort((a, b) => a - b)
          .map(v => String(v))));

        const existing = await env.DB.prepare(`
          SELECT id
          FROM exam_sessions
          WHERE student_id = ?
            AND exam_title = ?
            AND exam_date = ?
          LIMIT 1
        `).bind(studentId, examTitle, examDate).first();

        const sessionId = existing?.id || `ex_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`;
        const score = Math.round(((questionCount - wrongIds.length) / questionCount) * 100);
        sessionRows.push({ sessionId, studentId, classId, wrongIds, score });
      }

      if (!sessionRows.length) {
        return jsonResponse({ success: false, error: 'valid rows required' }, 400);
      }

      const stmts = [];
      for (const row of sessionRows) {
        stmts.push(env.DB.prepare(`
          INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date, question_count, class_id, archive_file, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
          ON CONFLICT(id) DO UPDATE SET
            exam_title=excluded.exam_title,
            score=excluded.score,
            exam_date=excluded.exam_date,
            question_count=excluded.question_count,
            class_id=excluded.class_id,
            archive_file=COALESCE(excluded.archive_file, exam_sessions.archive_file),
            updated_at=excluded.updated_at
        `).bind(row.sessionId, row.studentId, examTitle, row.score, examDate, questionCount, row.classId, archiveFile || null));
        stmts.push(env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(row.sessionId));
        for (const qId of row.wrongIds) {
          stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(row.sessionId, qId, row.studentId));
        }
      }

      await env.DB.batch(stmts);
      return jsonResponse({ success: true, saved: sessionRows.length });
    }

    if (method === 'PATCH') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
      const d = await request.json();
      if (!(await canAccessStudent(currentTeacher, d.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      const sid = id === 'new' ? `ex_${Date.now()}` : id;
      const stmts = [
        env.DB.prepare(`
          INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date, question_count, class_id, archive_file, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATETIME('now'))
          ON CONFLICT(id) DO UPDATE SET
            score=excluded.score,
            question_count=excluded.question_count,
            class_id=excluded.class_id,
            archive_file=COALESCE(excluded.archive_file, exam_sessions.archive_file),
            updated_at=excluded.updated_at
        `).bind(sid, d.student_id, d.exam_title, d.score, d.exam_date, d.question_count || 0, d.class_id || null, d.archive_file || null),
        env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sid)
      ];
      for (const qId of (d.wrong_ids || [])) stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(sid, qId, d.student_id));
      await env.DB.batch(stmts);
      return jsonResponse({ success: true, id: sid });
    }

    if (method === 'DELETE' && path[3] === 'wrongs') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
      if (!session) return jsonResponse({ success: false, error: 'session not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, session.student_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      await env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id).run();
      return jsonResponse({ success: true });
    }

    if (method === 'DELETE') {
      const currentTeacher = await requireTeacher(request, env, teacher);
      if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

      const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
      if (!session) return jsonResponse({ success: false, error: 'session not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, session.student_id, env))) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      await env.DB.batch([
        env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id),
        env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(id)
      ]);
      return jsonResponse({ success: true });
    }
  }

  return null;
}
