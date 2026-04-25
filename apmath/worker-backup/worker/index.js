/**
 * AP Math OS v26.1.2 [IRONCLAD]
 * Cloudflare Worker 통합 API 엔진 - 운영 관제센터 1.1 (KST 기준 이력 추가)
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

        // 3차 보정: attendance-history 조회 API
        if (resource === 'attendance-history' && method === 'GET') {
            const date = url.searchParams.get('date') || new Date().toLocaleDateString('sv-SE');
            const [att, hw] = await Promise.all([
                env.DB.prepare('SELECT * FROM attendance WHERE date = ?').bind(date).all(),
                env.DB.prepare('SELECT * FROM homework WHERE date = ?').bind(date).all()
            ]);
            return new Response(JSON.stringify({
                attendance: att.results,
                homework: hw.results,
                date
            }), { headers });
        }

        // 출결 일괄 처리
        if (resource === 'attendance-batch' && method === 'POST') {
            const data = await request.json();
            const stmts = (data.entries || []).map(({ studentId, status, date }) => {
                const aid = `${studentId}_${date}`;
                return env.DB.prepare(`
                    INSERT INTO attendance (id, student_id, status, date, created_at)
                    VALUES (?, ?, ?, ?, DATETIME('now'))
                    ON CONFLICT(id) DO UPDATE SET status=excluded.status
                `).bind(aid, studentId, status, date);
            });
            if (stmts.length) await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true }), { headers });
        }

        // 숙제 일괄 처리
        if (resource === 'homework-batch' && method === 'POST') {
            const data = await request.json();
            const stmts = (data.entries || []).map(({ studentId, status, date }) => {
                const hid = `${studentId}_${date}`;
                return env.DB.prepare(`
                    INSERT INTO homework (id, student_id, status, date, created_at)
                    VALUES (?, ?, ?, ?, DATETIME('now'))
                    ON CONFLICT(id) DO UPDATE SET status=excluded.status
                `).bind(hid, studentId, status, date);
            });
            if (stmts.length) await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true }), { headers });
        }

        // 초기 데이터 로드 (운영 관제센터 1.1: 14일치 이력 및 KST 보정)
        if (resource === 'initial-data') {
          const [stds, clss, map, att, hw, exs, wrs, attHis, hwHis] = await Promise.all([
            env.DB.prepare('SELECT * FROM students').all(),
            env.DB.prepare('SELECT * FROM classes').all(),
            env.DB.prepare('SELECT * FROM class_students').all(),
            // 오늘 데이터 (KST 기준)
            env.DB.prepare("SELECT * FROM attendance WHERE date = DATE('now', '+9 hours')").all(),
            env.DB.prepare("SELECT * FROM homework WHERE date = DATE('now', '+9 hours')").all(),
            env.DB.prepare('SELECT * FROM exam_sessions ORDER BY exam_date DESC LIMIT 100').all(),
            env.DB.prepare('SELECT * FROM wrong_answers').all(),
            // 최근 14일 이력 (누적 위험도 계산용)
            env.DB.prepare("SELECT * FROM attendance WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 500").all(),
            env.DB.prepare("SELECT * FROM homework WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 500").all()
          ]);

          return new Response(JSON.stringify({
            students: stds.results,
            classes: clss.results,
            class_students: map.results,
            attendance: att.results,
            homework: hw.results,
            exam_sessions: exs.results,
            wrong_answers: wrs.results,
            attendance_history: attHis.results,
            homework_history: hwHis.results
          }), { headers });
        }

        // 학생 추가
        if (resource === 'students' && method === 'POST') {
            const data = await request.json();
            const sid = `s_${Date.now()}`;
            const stmts = [
                env.DB.prepare(`
                    INSERT INTO students (id, name, school_name, grade, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, '재원', DATETIME('now'), DATETIME('now'))
                `).bind(sid, data.name, data.school_name, data.grade)
            ];
            if (data.class_id) {
                stmts.push(
                    env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)')
                        .bind(data.class_id, sid)
                );
            }
            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
        }

        // 재원 복구
        if (resource === 'students' && method === 'PATCH' && path[3] === 'restore') {
            await env.DB.prepare(`
                UPDATE students SET status = '재원', updated_at = DATETIME('now') WHERE id = ?
            `).bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
        }

        // 학생 정보 수정
        if (resource === 'students' && method === 'PATCH' && !path[3]) {
            const data = await request.json();
            const stmts = [
                env.DB.prepare(`
                    UPDATE students SET name=?, school_name=?, grade=?, updated_at=DATETIME('now') WHERE id=?
                `).bind(data.name, data.school_name, data.grade, id)
            ];
            if (data.class_id !== undefined) {
                stmts.push(env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id));
                if (data.class_id) {
                    stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(data.class_id, id));
                }
            }
            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true }), { headers });
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

        // 시험 삭제
        if (resource === 'exam-sessions' && method === 'DELETE') {
            await env.DB.batch([
                env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id),
                env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(id)
            ]);
            return new Response(JSON.stringify({ success: true }), { headers });
        }

        // 제적 처리
        if (resource === 'students' && method === 'DELETE') {
          await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?")
            .bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }

      return new Response(JSON.stringify({ error: 'API Endpoint Not Found' }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};