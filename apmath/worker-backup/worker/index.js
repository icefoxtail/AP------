/**
 * AP Math OS v26.1.2 [IRONCLAD]
 * Cloudflare Worker 통합 API 엔진 - QR 3차 (check-init 통합본)
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

        // 1. [신규] 학생용 초기화 API (보안 및 데이터 최소화)
        if (resource === 'check-init' && method === 'GET') {
          const classId = url.searchParams.get('class');
          const examTitle = url.searchParams.get('exam') || '';
          const examDate = url.searchParams.get('date') || '';
          
          if (!classId) {
            return new Response(JSON.stringify({ students: [], submitted_sessions: [] }), { headers });
          }

          // 오늘 KST 날짜 계산
          const todayKST = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];
          const targetDate = examDate || todayKST;

          const [clsInfo, stds, sessions] = await Promise.all([
            env.DB.prepare('SELECT name FROM classes WHERE id = ?').bind(classId).first(),
            env.DB.prepare(`
              SELECT id, name, school_name, grade FROM students 
              WHERE id IN (SELECT student_id FROM class_students WHERE class_id = ?) 
              AND status = '재원'
            `).bind(classId).all(),
            env.DB.prepare(`
              SELECT id, student_id, exam_title, exam_date, score FROM exam_sessions 
              WHERE exam_title = ? AND exam_date = ? 
              AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
            `).bind(examTitle, targetDate, classId).all()
          ]);

          return new Response(JSON.stringify({
            class_id: classId,
            class_name: clsInfo?.name || '알 수 없는 반',
            students: stds.results,
            submitted_sessions: sessions.results,
            exam_title: examTitle,
            exam_date: targetDate
          }), { headers });
        }

        // 2. 관리자용 초기 데이터 로드 (운영 관제센터 1.1 반영)
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
            // 최근 14일 이력 (운영 관제센터 누적 위험도 계산용)
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

        // 3. 출결/숙제 날짜별 이력 조회 API
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

        // 4. 출결/숙제 일괄 처리 (Batch)
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

        // 5. 학생 관리 (CUD)
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
            stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(data.class_id, sid));
          }
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true, id: sid }), { headers });
        }

        if (resource === 'students' && method === 'PATCH') {
          // 재원 복구
          if (path[2] && path[3] === 'restore') {
            await env.DB.prepare("UPDATE students SET status = '재원', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          // 정보 수정
          const data = await request.json();
          const stmts = [
            env.DB.prepare("UPDATE students SET name=?, school_name=?, grade=?, updated_at=DATETIME('now') WHERE id=?").bind(data.name, data.school_name, data.grade, id)
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

        if (resource === 'students' && method === 'DELETE') {
          await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // 6. 시험 세션 및 오답 처리 (PATCH/DELETE)
        if (resource === 'exam-sessions') {
          if (method === 'PATCH') {
            const data = await request.json();
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
              stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(sid, qId, data.student_id));
            }

            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }

          if (method === 'DELETE') {
            await env.DB.batch([
              env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id),
              env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(id)
            ]);
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // 7. 개별 출결/숙제 PATCH
        if (method === 'PATCH') {
          const data = await request.json();
          if (resource === 'attendance') {
            const aid = `${data.studentId}_${data.date}`;
            await env.DB.prepare("INSERT INTO attendance (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(aid, data.studentId, data.status, data.date).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (resource === 'homework') {
            const hid = `${data.studentId}_${data.date}`;
            await env.DB.prepare("INSERT INTO homework (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(hid, data.studentId, data.status, data.date).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // 8. AI 보고 문구 생성 (4D-1)
        if (resource === 'ai' && path[2] === 'student-report' && method === 'POST') {
          const payload = await request.json();
          const { type, student, today: td } = payload;

          const examStr = td?.exam
            ? `${td.exam.title} ${td.exam.score}점${td.exam.wrongs?.length ? ` (오답: ${td.exam.wrongs.join(',')})` : ''}`
            : '없음';
          const avgStr = td?.avg !== null && td?.avg !== undefined ? `${td.avg}점` : '데이터 없음';

          let fallbackMessage = '';
          if (type === 'parent') {
            fallbackMessage =
              `[AP Math] ${student.name} 학생 오늘 수업 안내\n` +
              `출결: ${td.att}\n` +
              `숙제: ${td.hw}\n` +
              `오늘 성적: ${examStr}\n` +
              `최근 3회 평균: ${avgStr}`;
          } else if (type === 'student') {
            fallbackMessage =
              `${student.name}아, 오늘 수고 많았어! 😊\n` +
              `숙제 잊지 말고, 다음 시간에 또 보자!`;
          } else {
            fallbackMessage =
              `[상담 메모] ${student.name} (${student.school} ${student.grade})\n` +
              `출결: ${td.att} / 숙제: ${td.hw}\n` +
              `금일 성적: ${examStr}\n` +
              `최근 평균: ${avgStr}`;
          }

          const AI_KEY = env.AI_API_KEY || '';
          if (!AI_KEY) {
            return new Response(JSON.stringify({
              success: true,
              message: fallbackMessage,
              source: 'fallback'
            }), { headers });
          }

          try {
            // TODO: AI provider 연결
            // API 키가 준비되면 이 위치에서 AI provider를 호출한다.
            // 프론트에는 API 키를 절대 노출하지 않는다.
            return new Response(JSON.stringify({
              success: true,
              message: fallbackMessage,
              source: 'fallback'
            }), { headers });
          } catch (aiErr) {
            return new Response(JSON.stringify({
              success: false,
              error: aiErr.message
            }), { headers });
          }
        }
      }

      return new Response(JSON.stringify({ error: 'API Endpoint Not Found' }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};