/**
 * AP Math OS v26.1.2 [IRONCLAD]
 * Cloudflare Worker 통합 API 엔진 - D1 스키마 및 트랜잭션 완결판
 */

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.split('/').filter(Boolean);
    const method = request.method;

    if (method === 'OPTIONS') return new Response(null, { headers });

    try {
      if (path[0] === 'api') {
        const resource = path[1];
        const id = path[2];

        if (resource === 'initial-data') {
          const [stds, clss, map, att, hw, exs, wrs] = await Promise.all([
            env.DB.prepare('SELECT * FROM students').all(),
            env.DB.prepare('SELECT * FROM classes').all(),
            env.DB.prepare('SELECT * FROM class_students').all(),
            env.DB.prepare('SELECT * FROM attendance WHERE date = CURRENT_DATE').all(),
            env.DB.prepare('SELECT * FROM homework WHERE date = CURRENT_DATE').all(),
            env.DB.prepare('SELECT * FROM exam_sessions ORDER BY exam_date DESC LIMIT 100').all(),
            env.DB.prepare('SELECT * FROM wrong_answers').all()
          ]);

          return new Response(JSON.stringify({
            students: stds.results,
            classes: clss.results,
            class_students: map.results,
            attendance: att.results,
            homework: hw.results,
            exam_sessions: exs.results,
            wrong_answers: wrs.results
          }), { headers });
        }

        if (method === 'PATCH') {
          const data = await request.json();

          if (resource === 'attendance') {
            const aid = `${data.studentId}_${data.date}`;
            await env.DB.prepare(`
              INSERT INTO attendance (id, student_id, status, date, created_at)
              VALUES (?, ?, ?, ?, DATETIME('now'))
              ON CONFLICT(id) DO UPDATE SET status=excluded.status
            `).bind(aid, data.studentId, data.status, data.date).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (resource === 'homework') {
            const hid = `${data.studentId}_${data.date}`;
            await env.DB.prepare(`
              INSERT INTO homework (id, student_id, status, date, created_at)
              VALUES (?, ?, ?, ?, DATETIME('now'))
              ON CONFLICT(id) DO UPDATE SET status=excluded.status
            `).bind(hid, data.studentId, data.status, data.date).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (resource === 'exam-sessions') {
            const sid = id === 'new' ? `ex_${Date.now()}` : id;
            const stmts = [
              env.DB.prepare(`
                INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date, updated_at)
                VALUES (?, ?, ?, ?, ?, DATETIME('now'))
                ON CONFLICT(id) DO UPDATE SET score=excluded.score, updated_at=excluded.updated_at
              `).bind(sid, data.student_id, data.exam_title, data.score, data.exam_date),
              env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sid)
            ];

            for (const qId of (data.wrong_ids || [])) {
              stmts.push(
                env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)')
                  .bind(sid, qId, data.student_id)
              );
            }

            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }
        }

        if (resource === 'students' && method === 'DELETE') {
          await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?")
            .bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (resource === 'questions') {
          if (id === 'resource') {
            const qId = url.searchParams.get('qId');
            const item = await env.DB.prepare('SELECT * FROM questions WHERE id = ?').bind(qId).first();
            return new Response(JSON.stringify(item || {}), { headers });
          }
          if (id === 'similar') {
            const qId = url.searchParams.get('qId');
            const src = await env.DB.prepare('SELECT standard_unit, difficulty FROM questions WHERE id = ?').bind(qId).first();
            if (!src) return new Response(JSON.stringify([]), { headers });

            const diffMap = { '최하': 1, '하': 2, '중': 3, '상': 4, '최상': 5 };
            const target = diffMap[src.difficulty] || 3;
            const wSQL = "(CASE difficulty WHEN '최하' THEN 1 WHEN '하' THEN 2 WHEN '중' THEN 3 WHEN '상' THEN 4 WHEN '최상' THEN 5 ELSE 3 END)";
            const sim = await env.DB.prepare(`
              SELECT * FROM questions
              WHERE standard_unit = ? AND id != ?
              ORDER BY ABS(${wSQL} - ?) ASC, RANDOM() LIMIT 3
            `).bind(src.standard_unit, qId, target).all();
            return new Response(JSON.stringify(sim.results), { headers });
          }
        }
      }

      return new Response(JSON.stringify({ error: 'API Endpoint Not Found' }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};