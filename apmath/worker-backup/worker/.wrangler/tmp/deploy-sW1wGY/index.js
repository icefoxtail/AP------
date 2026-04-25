// index.js
var headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.split("/").filter(Boolean);
    const method = request.method;
    if (method === "OPTIONS") return new Response(null, { headers });
    try {
      if (path[0] === "api") {
        const resource = path[1];
        const id = path[2];
        if (resource === "check-init" && method === "GET") {
          const classId = url.searchParams.get("class");
          const examTitle = url.searchParams.get("exam") || "";
          const examDate = url.searchParams.get("date") || "";
          if (!classId) {
            return new Response(JSON.stringify({ students: [], submitted_sessions: [] }), { headers });
          }
          const todayKST = new Date((/* @__PURE__ */ new Date()).getTime() + 9 * 60 * 60 * 1e3).toISOString().split("T")[0];
          const targetDate = examDate || todayKST;
          const [clsInfo, stds, sessions] = await Promise.all([
            env.DB.prepare("SELECT name FROM classes WHERE id = ?").bind(classId).first(),
            env.DB.prepare(`
              SELECT id, name, school_name, grade FROM students 
              WHERE id IN (SELECT student_id FROM class_students WHERE class_id = ?) 
              AND status = '\uC7AC\uC6D0'
            `).bind(classId).all(),
            env.DB.prepare(`
              SELECT id, student_id, exam_title, exam_date, score FROM exam_sessions 
              WHERE exam_title = ? AND exam_date = ? 
              AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)
            `).bind(examTitle, targetDate, classId).all()
          ]);
          return new Response(JSON.stringify({
            class_id: classId,
            class_name: clsInfo?.name || "\uC54C \uC218 \uC5C6\uB294 \uBC18",
            students: stds.results,
            submitted_sessions: sessions.results,
            exam_title: examTitle,
            exam_date: targetDate
          }), { headers });
        }
        if (resource === "initial-data") {
          const [stds, clss, map, att, hw, exs, wrs, attHis, hwHis] = await Promise.all([
            env.DB.prepare("SELECT * FROM students").all(),
            env.DB.prepare("SELECT * FROM classes").all(),
            env.DB.prepare("SELECT * FROM class_students").all(),
            // 오늘 데이터 (KST 기준)
            env.DB.prepare("SELECT * FROM attendance WHERE date = DATE('now', '+9 hours')").all(),
            env.DB.prepare("SELECT * FROM homework WHERE date = DATE('now', '+9 hours')").all(),
            env.DB.prepare("SELECT * FROM exam_sessions ORDER BY exam_date DESC LIMIT 100").all(),
            env.DB.prepare("SELECT * FROM wrong_answers").all(),
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
        if (resource === "attendance-history" && method === "GET") {
          const date = url.searchParams.get("date") || (/* @__PURE__ */ new Date()).toLocaleDateString("sv-SE");
          const [att, hw] = await Promise.all([
            env.DB.prepare("SELECT * FROM attendance WHERE date = ?").bind(date).all(),
            env.DB.prepare("SELECT * FROM homework WHERE date = ?").bind(date).all()
          ]);
          return new Response(JSON.stringify({
            attendance: att.results,
            homework: hw.results,
            date
          }), { headers });
        }
        if (resource === "attendance-batch" && method === "POST") {
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
        if (resource === "homework-batch" && method === "POST") {
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
        if (resource === "students" && method === "POST") {
          const data = await request.json();
          const sid = `s_${Date.now()}`;
          const stmts = [
            env.DB.prepare(`
              INSERT INTO students (id, name, school_name, grade, status, created_at, updated_at)
              VALUES (?, ?, ?, ?, '\uC7AC\uC6D0', DATETIME('now'), DATETIME('now'))
            `).bind(sid, data.name, data.school_name, data.grade)
          ];
          if (data.class_id) {
            stmts.push(env.DB.prepare("INSERT INTO class_students (class_id, student_id) VALUES (?, ?)").bind(data.class_id, sid));
          }
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true, id: sid }), { headers });
        }
        if (resource === "students" && method === "PATCH") {
          if (path[2] && path[3] === "restore") {
            await env.DB.prepare("UPDATE students SET status = '\uC7AC\uC6D0', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          const data = await request.json();
          const stmts = [
            env.DB.prepare("UPDATE students SET name=?, school_name=?, grade=?, updated_at=DATETIME('now') WHERE id=?").bind(data.name, data.school_name, data.grade, id)
          ];
          if (data.class_id !== void 0) {
            stmts.push(env.DB.prepare("DELETE FROM class_students WHERE student_id = ?").bind(id));
            if (data.class_id) {
              stmts.push(env.DB.prepare("INSERT INTO class_students (class_id, student_id) VALUES (?, ?)").bind(data.class_id, id));
            }
          }
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (resource === "students" && method === "DELETE") {
          await env.DB.prepare("UPDATE students SET status = '\uC81C\uC801', updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (resource === "exam-sessions") {
          if (method === "PATCH") {
            const data = await request.json();
            const sid = id === "new" ? `ex_${Date.now()}` : id;
            const stmts = [
              env.DB.prepare(`
                INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date, updated_at)
                VALUES (?, ?, ?, ?, ?, DATETIME('now'))
                ON CONFLICT(id) DO UPDATE SET score=excluded.score, updated_at=excluded.updated_at
              `).bind(sid, data.student_id, data.exam_title, data.score, data.exam_date),
              env.DB.prepare("DELETE FROM wrong_answers WHERE session_id = ?").bind(sid)
            ];
            for (const qId of data.wrong_ids || []) {
              stmts.push(env.DB.prepare("INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)").bind(sid, qId, data.student_id));
            }
            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }
          if (method === "DELETE") {
            await env.DB.batch([
              env.DB.prepare("DELETE FROM wrong_answers WHERE session_id = ?").bind(id),
              env.DB.prepare("DELETE FROM exam_sessions WHERE id = ?").bind(id)
            ]);
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
        if (method === "PATCH") {
          const data = await request.json();
          if (resource === "attendance") {
            const aid = `${data.studentId}_${data.date}`;
            await env.DB.prepare("INSERT INTO attendance (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(aid, data.studentId, data.status, data.date).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (resource === "homework") {
            const hid = `${data.studentId}_${data.date}`;
            await env.DB.prepare("INSERT INTO homework (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(hid, data.studentId, data.status, data.date).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }
      return new Response(JSON.stringify({ error: "API Endpoint Not Found" }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
