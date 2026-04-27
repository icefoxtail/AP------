/**
 * AP Math OS v26.1.2 [IRONCLAD - 5F COMPLETE]
 * Cloudflare Worker 통합 API 엔진 - 인증, 성적 구조 개편 및 보안 강화
 */

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// [5F] SHA-256 헬퍼
async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// [5F] Basic Auth 파싱 및 검증
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

// [5F] admin 전용 권한 체크
function requireAdmin(teacher) {
  return teacher?.role === 'admin';
}

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

        // [5F] 로그인 검증
        if (resource === 'auth' && path[2] === 'login' && method === 'POST') {
          const { login_id, password } = await request.json();
          const hash = await sha256hex(password);
          const teacher = await env.DB.prepare(
            'SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?'
          ).bind(login_id, hash).first();
          if (!teacher) return new Response(JSON.stringify({ success: false, message: '아이디 또는 비밀번호 오류' }), { status: 401, headers });
          return new Response(JSON.stringify({ success: true, id: teacher.id, name: teacher.name, role: teacher.role }), { headers });
        }

        // [5F] 비밀번호 변경
        if (resource === 'auth' && path[2] === 'change-password' && method === 'POST') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const { new_password } = await request.json();
          const hash = await sha256hex(new_password);
          await env.DB.prepare('UPDATE teachers SET password_hash = ? WHERE id = ?').bind(hash, teacher.id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // [5F 보안 강화] PIN 검증 전용 엔드포인트
        if (resource === 'check-pin' && method === 'POST') {
          const { student_id, pin } = await request.json();
          const student = await env.DB.prepare('SELECT student_pin FROM students WHERE id = ?').bind(student_id).first();
          // PIN이 미설정인 경우 통과시키거나 특정 규칙 적용 가능. 여기선 입력값과 DB값 직접 비교.
          if (!student?.student_pin || student.student_pin === String(pin)) {
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          return new Response(JSON.stringify({ success: false, message: 'PIN 번호가 일치하지 않습니다.' }), { status: 401, headers });
        }

        if (resource === 'check-init' && method === 'GET') {
          const classId = url.searchParams.get('class');
          const examTitle = url.searchParams.get('exam') || '';
          const examDate = url.searchParams.get('date') || '';
          if (!classId) return new Response(JSON.stringify({ students: [], submitted_sessions: [] }), { headers });
          const todayKST = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];
          const targetDate = examDate || todayKST;
          const [clsInfo, stds, sessions] = await Promise.all([
            env.DB.prepare('SELECT name FROM classes WHERE id = ?').bind(classId).first(),
            // [5F 보안 강화] student_pin은 결과에서 제외
            env.DB.prepare("SELECT id, name, school_name, grade FROM students WHERE id IN (SELECT student_id FROM class_students WHERE class_id = ?) AND status = '재원'").bind(classId).all(),
            env.DB.prepare("SELECT id, student_id, exam_title, exam_date, score FROM exam_sessions WHERE exam_title = ? AND exam_date = ? AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(examTitle, targetDate, classId).all()
          ]);
          return new Response(JSON.stringify({ class_id: classId, class_name: clsInfo?.name || '알 수 없는 반', students: stds.results, submitted_sessions: sessions.results, exam_title: examTitle, exam_date: targetDate }), { headers });
        }

        if (resource === 'initial-data') {
          const [stds, clss, map, att, hw, exs, wrs, attHis, hwHis, cns, opm, exS] = await Promise.all([
            env.DB.prepare('SELECT * FROM students').all(),
            env.DB.prepare('SELECT * FROM classes').all(),
            env.DB.prepare('SELECT * FROM class_students').all(),
            env.DB.prepare("SELECT * FROM attendance WHERE date = DATE('now', '+9 hours')").all(),
            env.DB.prepare("SELECT * FROM homework WHERE date = DATE('now', '+9 hours')").all(),
            env.DB.prepare('SELECT * FROM exam_sessions ORDER BY exam_date DESC LIMIT 200').all(),
            env.DB.prepare('SELECT * FROM wrong_answers').all(),
            env.DB.prepare("SELECT * FROM attendance WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 500").all(),
            env.DB.prepare("SELECT * FROM homework WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 500").all(),
            env.DB.prepare('SELECT * FROM consultations ORDER BY date DESC, created_at DESC').all(),
            env.DB.prepare('SELECT * FROM operation_memos ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').all(),
            env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all()
          ]);
          return new Response(JSON.stringify({
            students: stds.results, classes: clss.results, class_students: map.results,
            attendance: att.results, homework: hw.results, exam_sessions: exs.results,
            wrong_answers: wrs.results, attendance_history: attHis.results, homework_history: hwHis.results,
            consultations: cns.results, operation_memos: opm.results, exam_schedules: exS.results
          }), { headers });
        }

        if (resource === 'attendance-history' && method === 'GET') {
          const date = url.searchParams.get('date') || new Date().toLocaleDateString('sv-SE');
          const [att, hw] = await Promise.all([
            env.DB.prepare('SELECT * FROM attendance WHERE date = ?').bind(date).all(),
            env.DB.prepare('SELECT * FROM homework WHERE date = ?').bind(date).all()
          ]);
          return new Response(JSON.stringify({ attendance: att.results, homework: hw.results, date }), { headers });
        }

        if (resource === 'attendance-batch' && method === 'POST') {
          const data = await request.json();
          const stmts = (data.entries || []).map(({ studentId, status, date }) => env.DB.prepare("INSERT INTO attendance (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(`${studentId}_${date}`, studentId, status, date));
          if (stmts.length) await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (resource === 'homework-batch' && method === 'POST') {
          const data = await request.json();
          const stmts = (data.entries || []).map(({ studentId, status, date }) => env.DB.prepare("INSERT INTO homework (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(`${studentId}_${date}`, studentId, status, date));
          if (stmts.length) await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // [5F] student_pin 설정
        if (resource === 'students' && path[3] === 'pin' && method === 'PATCH') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const { pin } = await request.json();
          if (!/^\d{4}$/.test(pin)) return new Response(JSON.stringify({ error: 'PIN은 4자리 숫자' }), { status: 400, headers });
          await env.DB.prepare('UPDATE students SET student_pin = ? WHERE id = ?').bind(pin, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (resource === 'students' && method === 'POST') {
          const data = await request.json();
          const sid = `s_${Date.now()}`;
          const stmts = [env.DB.prepare("INSERT INTO students (id, name, school_name, grade, status, memo, guardian_name, guardian_relation, student_phone, parent_phone, student_pin, created_at, updated_at) VALUES (?, ?, ?, ?, '재원', ?, '', ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))").bind(sid, data.name, data.school_name, data.grade, data.memo || '', data.guardian_relation || '', data.student_phone || '', data.parent_phone || '', data.student_pin || '')];
          if (data.class_id) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(data.class_id, sid));
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true, id: sid }), { headers });
        }

        if (resource === 'students' && method === 'PATCH') {
          if (path[3] === 'restore') { await env.DB.prepare("UPDATE students SET status = '재원', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
          const data = await request.json();
          const stmts = [env.DB.prepare("UPDATE students SET name=?, school_name=?, grade=?, memo=?, guardian_name='', guardian_relation=?, student_phone=?, parent_phone=?, student_pin=?, updated_at=DATETIME('now') WHERE id=?").bind(data.name, data.school_name, data.grade, data.memo || '', data.guardian_relation || '', data.student_phone || '', data.parent_phone || '', data.student_pin || '', id)];
          if (data.class_id !== undefined) { stmts.push(env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id)); if (data.class_id) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(data.class_id, id)); }
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (resource === 'students' && method === 'DELETE') { await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }

        if (resource === 'exam-sessions') {
          // [5F] 반/시험 단위 제출 현황 조회
          if (method === 'GET' && id === 'by-class') {
            const classId = url.searchParams.get('class');
            const examTitle = url.searchParams.get('exam') || null;
            if (!classId) return new Response(JSON.stringify({ error: 'class required' }), { status: 400, headers });

            const studentIds = await env.DB.prepare("SELECT student_id FROM class_students WHERE class_id = ?").bind(classId).all();
            const sIds = studentIds.results.map(r => r.student_id);
            if (!sIds.length) return new Response(JSON.stringify({ sessions: [], students: [] }), { headers });

            const placeholders = sIds.map(() => '?').join(',');
            const [students, sessions, wrongs] = await Promise.all([
              env.DB.prepare(`SELECT id, name, school_name, grade FROM students WHERE id IN (${placeholders}) AND status='재원'`).bind(...sIds).all(),
              examTitle
                ? env.DB.prepare(`SELECT * FROM exam_sessions WHERE class_id = ? AND exam_title = ? ORDER BY exam_date DESC`).bind(classId, examTitle).all()
                : env.DB.prepare(`SELECT * FROM exam_sessions WHERE class_id = ? ORDER BY exam_date DESC LIMIT 200`).bind(classId).all(),
              env.DB.prepare(`SELECT * FROM wrong_answers WHERE student_id IN (${placeholders})`).bind(...sIds).all()
            ]);
            return new Response(JSON.stringify({ students: students.results, sessions: sessions.results, wrong_answers: wrongs.results }), { headers });
          }

          if (method === 'PATCH') {
            const data = await request.json();
            const sid = id === 'new' ? `ex_${Date.now()}` : id;
            const stmts = [
              env.DB.prepare("INSERT INTO exam_sessions (id, student_id, exam_title, score, exam_date, question_count, class_id, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET score=excluded.score, question_count=excluded.question_count, class_id=excluded.class_id, updated_at=excluded.updated_at")
                .bind(sid, data.student_id, data.exam_title, data.score, data.exam_date, data.question_count || 0, data.class_id || null),
              env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(sid)
            ];
            for (const qId of (data.wrong_ids || [])) {
              stmts.push(env.DB.prepare('INSERT INTO wrong_answers (session_id, question_id, student_id) VALUES (?, ?, ?)').bind(sid, qId, data.student_id));
            }
            await env.DB.batch(stmts);
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }
          if (method === 'DELETE') {
            await env.DB.batch([env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id), env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(id)]);
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        if (method === 'PATCH' && (resource === 'attendance' || resource === 'homework')) {
          const data = await request.json();
          if (resource === 'attendance') { await env.DB.prepare("INSERT INTO attendance (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(`${data.studentId}_${data.date}`, data.studentId, data.status, data.date).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
          if (resource === 'homework') { await env.DB.prepare("INSERT INTO homework (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status").bind(`${data.studentId}_${data.date}`, data.studentId, data.status, data.date).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
        }

        if (resource === 'consultations') {
          if (method === 'POST') {
            const data = await request.json();
            const cid = `cns_${Date.now()}`;
            await env.DB.prepare("INSERT INTO consultations (id, student_id, date, type, content, next_action) VALUES (?, ?, ?, ?, ?, ?)").bind(cid, data.studentId, data.date, data.type, data.content, data.nextAction || '').run();
            return new Response(JSON.stringify({ success: true, id: cid }), { headers });
          }
          if (method === 'GET') {
            const sid = url.searchParams.get('studentId');
            if (sid) { const res = await env.DB.prepare('SELECT * FROM consultations WHERE student_id = ? ORDER BY date DESC, created_at DESC').bind(sid).all(); return new Response(JSON.stringify({ success: true, data: res.results }), { headers }); }
          }
          if (method === 'PATCH' && id) {
            const data = await request.json();
            await env.DB.prepare("UPDATE consultations SET date = ?, type = ?, content = ?, next_action = ? WHERE id = ?").bind(data.date, data.type, data.content, data.nextAction || '', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) { await env.DB.prepare('DELETE FROM consultations WHERE id = ?').bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
        }

        if (resource === 'ai' && path[2] === 'student-report' && method === 'POST') {
          const payload = await request.json();
          const { type, student, today: td } = payload;
          const examStr = td?.exam ? `${td.exam.title} ${td.exam.score}점` : '없음';
          let fallbackMessage = type === 'parent' ? `[AP Math] ${student.name} 학생 오늘 수업 안내\n출결: ${td.att}\n숙제: ${td.hw}\n성적: ${examStr}` : type === 'student' ? `${student.name}아 수고했어!` : `상담메모: ${student.name}`;
          return new Response(JSON.stringify({ success: true, message: fallbackMessage, source: 'fallback' }), { headers });
        }

        if (resource === 'classes' && method === 'POST') {
          const data = await request.json();
          const cid = `cls_${Date.now()}`;
          await env.DB.prepare("INSERT INTO classes (id, name, grade, subject, teacher_name, schedule_days, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)").bind(cid, data.name, data.grade, data.subject || '수학', data.teacher_name || '박준성', data.schedule_days || '').run();
          return new Response(JSON.stringify({ success: true, id: cid }), { headers });
        }
        if (resource === 'classes' && method === 'PATCH' && id) {
          const data = await request.json();
          await env.DB.prepare("UPDATE classes SET name = ?, grade = ?, subject = ?, teacher_name = ?, schedule_days = ?, is_active = ? WHERE id = ?").bind(data.name, data.grade, data.subject, data.teacher_name, data.schedule_days || '', data.is_active !== undefined ? data.is_active : 1, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (resource === 'operation-memos') {
          if (method === 'GET') {
            const res = await env.DB.prepare('SELECT * FROM operation_memos ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').all();
            return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
          }
          if (method === 'POST') {
            const data = await request.json();
            const mid = `m_${Date.now()}`;
            await env.DB.prepare("INSERT INTO operation_memos (id, memo_date, content, is_pinned, is_done) VALUES (?, ?, ?, ?, 0)").bind(mid, data.memoDate, data.content, data.isPinned ? 1 : 0).run();
            return new Response(JSON.stringify({ success: true, id: mid }), { headers });
          }
          if (method === 'PATCH' && id) {
            const data = await request.json();
            await env.DB.prepare("UPDATE operation_memos SET memo_date=?, content=?, is_pinned=?, is_done=? WHERE id=?").bind(data.memoDate, data.content, data.isPinned ? 1 : 0, data.isDone ? 1 : 0, id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) {
            await env.DB.prepare("DELETE FROM operation_memos WHERE id=?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        if (resource === 'exam-schedules') {
          if (method === 'GET') {
            const res = await env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all();
            return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
          }
          if (method === 'POST') {
            const data = await request.json();
            const eid = `exs_${Date.now()}`;
            await env.DB.prepare("INSERT INTO exam_schedules (id, school_name, grade, exam_name, exam_date, memo) VALUES (?, ?, ?, ?, ?, ?)").bind(eid, data.schoolName, data.grade, data.examName, data.examDate, data.memo || '').run();
            return new Response(JSON.stringify({ success: true, id: eid }), { headers });
          }
          if (method === 'PATCH' && id) {
            const data = await request.json();
            await env.DB.prepare("UPDATE exam_schedules SET school_name=?, grade=?, exam_name=?, exam_date=?, memo=? WHERE id=?").bind(data.schoolName, data.grade, data.examName, data.examDate, data.memo || '', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) {
            await env.DB.prepare("DELETE FROM exam_schedules WHERE id=?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // [5F] teachers 조회 (admin only)
        if (resource === 'teachers' && method === 'GET') {
          const teacher = await verifyAuth(request, env);
          if (!requireAdmin(teacher)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const res = await env.DB.prepare('SELECT id, name, login_id, role FROM teachers ORDER BY role DESC').all();
          const map = await env.DB.prepare('SELECT * FROM teacher_classes').all();
          return new Response(JSON.stringify({ teachers: res.results, teacher_classes: map.results }), { headers });
        }

        // [5F] teacher_classes 담당반 설정
        if (resource === 'teacher-classes' && method === 'POST') {
          const teacher = await verifyAuth(request, env);
          if (!requireAdmin(teacher)) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const { teacher_id, class_ids } = await request.json();
          const stmts = [env.DB.prepare('DELETE FROM teacher_classes WHERE teacher_id = ?').bind(teacher_id)];
          for (const cid of (class_ids || [])) {
            stmts.push(env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(teacher_id, cid));
          }
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }
      return new Response(JSON.stringify({ error: 'API Endpoint Not Found' }), { status: 404, headers });
    } catch (err) { return new Response(JSON.stringify({ error: err.message }), { status: 500, headers }); }
  }
};