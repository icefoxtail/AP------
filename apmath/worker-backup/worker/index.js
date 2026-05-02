/**
 * AP Math OS v26.1.2 [IRONCLAD - Phase 4/5 FINAL RECOVERY]
 * Cloudflare Worker 통합 API 엔진 - 절대 축약 없음, 모든 기존 API 복구 완료본
 * Phase 4/5 Add-on: class_textbooks / class_daily_records / class_daily_progress API 추가
 */

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// SHA-256 헬퍼
async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Basic Auth 파싱 및 검증
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
  } catch (e) { return null; }
}

// 권한 검증 헬퍼: 특정 학생에 접근 가능한가?
async function canAccessStudent(teacher, studentId, env) {
  if (teacher.role === 'admin') return true;
  const row = await env.DB.prepare(`
    SELECT 1 FROM class_students cs
    JOIN teacher_classes tc ON tc.class_id = cs.class_id
    WHERE cs.student_id = ? AND tc.teacher_id = ?
    LIMIT 1
  `).bind(studentId, teacher.id).first();
  return !!row;
}

// 권한 검증 헬퍼: 특정 반에 접근 가능한가?
async function canAccessClass(teacher, classId, env) {
  if (teacher.role === 'admin') return true;
  const row = await env.DB.prepare(`
    SELECT 1 FROM teacher_classes
    WHERE teacher_id = ? AND class_id = ?
  `).bind(teacher.id, classId).first();
  return !!row;
}

// 학년별 PIN 자동 채번 함수
async function generateStudentPin(grade, env) {
  const prefixes = { '중1': '11', '중2': '12', '중3': '13', '고1': '21', '고2': '22', '고3': '23' };
  const prefix = prefixes[grade] || '99';
  const res = await env.DB.prepare(`SELECT student_pin FROM students WHERE student_pin LIKE ? ORDER BY student_pin DESC LIMIT 1`).bind(prefix + '%').first();
  
  if (res && res.student_pin) {
    const currentNum = parseInt(res.student_pin, 10);
    return String(currentNum + 1).padStart(4, '0');
  } else {
    return prefix + '01';
  }
}

function todayKstDateString() {
  return new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString().split('T')[0];
}

function normalizeTargetScore(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.max(0, Math.min(100, Math.round(n)));
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

        // --- 1. 인증 및 계정 관리 ---
        if (resource === 'auth' && path[2] === 'login' && method === 'POST') {
          const { login_id, password } = await request.json();
          const hash = await sha256hex(password);
          const teacher = await env.DB.prepare('SELECT id, name, role FROM teachers WHERE login_id = ? AND password_hash = ?').bind(login_id, hash).first();
          if (!teacher) return new Response(JSON.stringify({ success: false, message: '아이디 또는 비밀번호 오류' }), { status: 401, headers });
          return new Response(JSON.stringify({ success: true, id: teacher.id, name: teacher.name, role: teacher.role }), { headers });
        }

        if (resource === 'auth' && path[2] === 'change-password' && method === 'POST') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const { new_password } = await request.json();
          const hash = await sha256hex(new_password);
          await env.DB.prepare('UPDATE teachers SET password_hash = ? WHERE id = ?').bind(hash, teacher.id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // --- 2. 학생용 QR 인증 및 초기화 (check-pin / check-init) ---
        if (resource === 'check-pin' && method === 'POST') {
          const { student_id, pin } = await request.json();
          const student = await env.DB.prepare('SELECT student_pin FROM students WHERE id = ?').bind(student_id).first();
          if (!student?.student_pin || student.student_pin === String(pin)) {
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          return new Response(JSON.stringify({ success: false, message: 'PIN 번호가 일치하지 않습니다.' }), { status: 401, headers });
        }

        if (resource === 'check-init' && method === 'GET') {
          const classId = url.searchParams.get('class');
          const examTitle = url.searchParams.get('exam') || '';
          const examDate = url.searchParams.get('date') || '';
          const qCount = parseInt(url.searchParams.get('q')) || 0;
          
          const archiveFile = 
            url.searchParams.get('archiveFile') || 
            url.searchParams.get('archive_file') || 
            url.searchParams.get('archive') || 
            '';

          if (!classId) return new Response(JSON.stringify({ error: 'class required', students: [], submitted_sessions: [] }), { status: 400, headers });

          const todayKST = todayKstDateString();
          const targetDate = examDate || todayKST;

          const [clsInfo, stds, sessions] = await Promise.all([
            env.DB.prepare('SELECT name FROM classes WHERE id = ?').bind(classId).first(),
            env.DB.prepare("SELECT id, name, school_name, grade, student_pin FROM students WHERE id IN (SELECT student_id FROM class_students WHERE class_id = ?) AND status = '재원'").bind(classId).all(),
            env.DB.prepare("SELECT id, student_id, exam_title, exam_date, score FROM exam_sessions WHERE exam_title = ? AND exam_date = ? AND student_id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(examTitle, targetDate, classId).all()
          ]);

          return new Response(JSON.stringify({ 
            success: true,
            class_id: classId, 
            class_name: clsInfo?.name || '알 수 없는 반', 
            exam_title: examTitle, 
            exam_date: targetDate,
            question_count: qCount,
            archive_file: archiveFile,
            students: stds.results, 
            submitted_sessions: sessions.results 
          }), { headers });
        }

        // --- 3. QR 출제용 반 목록 ---
        if (resource === 'qr-classes' && method === 'GET') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          let query, params = [];
          if (teacher.role === 'admin') {
            query = `SELECT id, name, grade, teacher_name FROM classes WHERE is_active != 0 OR is_active IS NULL ORDER BY grade, name`;
          } else {
            query = `
              SELECT c.id, c.name, c.grade, c.teacher_name 
              FROM classes c
              JOIN teacher_classes tc ON tc.class_id = c.id
              WHERE tc.teacher_id = ? AND (c.is_active != 0 OR c.is_active IS NULL)
              ORDER BY c.grade, c.name`;
            params.push(teacher.id);
          }
          const res = await env.DB.prepare(query).bind(...params).all();
          return new Response(JSON.stringify({ success: true, classes: res.results }), { headers });
        }

        // --- 4. 메인 데이터 로드 (initial-data) ---
        if (resource === 'initial-data') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          let stds, clss, map, att, hw, exs, wrs, attHis, hwHis, cns, opm, exS, acs, jou, txt, cdr, cdp;

          if (teacher.role === 'admin') {
            [stds, clss, map, att, hw, exs, wrs, attHis, hwHis, cns, opm, exS, acs, jou, txt, cdr, cdp] = await Promise.all([
              env.DB.prepare('SELECT * FROM students').all(),
              env.DB.prepare('SELECT * FROM classes').all(),
              env.DB.prepare('SELECT * FROM class_students').all(),
              env.DB.prepare("SELECT * FROM attendance WHERE date = DATE('now', '+9 hours')").all(),
              env.DB.prepare("SELECT * FROM homework WHERE date = DATE('now', '+9 hours')").all(),
              env.DB.prepare('SELECT * FROM exam_sessions ORDER BY exam_date DESC LIMIT 500').all(),
              env.DB.prepare('SELECT * FROM wrong_answers').all(),
              env.DB.prepare("SELECT * FROM attendance WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 1000").all(),
              env.DB.prepare("SELECT * FROM homework WHERE date >= DATE('now', '+9 hours', '-14 days') LIMIT 1000").all(),
              env.DB.prepare('SELECT * FROM consultations ORDER BY date DESC, created_at DESC').all(),
              env.DB.prepare('SELECT * FROM operation_memos ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').all(),
              env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all(),
              env.DB.prepare('SELECT * FROM academy_schedules WHERE is_deleted = 0 ORDER BY schedule_date ASC, start_time ASC, created_at ASC').all(),
              env.DB.prepare('SELECT * FROM daily_journals ORDER BY date DESC, created_at DESC').all(),
              env.DB.prepare('SELECT * FROM class_textbooks ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC').all(),
              env.DB.prepare('SELECT * FROM class_daily_records ORDER BY date DESC, created_at DESC LIMIT 1000').all(),
              env.DB.prepare('SELECT * FROM class_daily_progress ORDER BY created_at ASC LIMIT 3000').all()
            ]);
          } else {
            const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
            const classIds = tcls.results.map(r => r.class_id);
            
            opm = await env.DB.prepare('SELECT * FROM operation_memos ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').all();
            exS = await env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all();
            acs = await env.DB.prepare('SELECT * FROM academy_schedules WHERE is_deleted = 0 ORDER BY schedule_date ASC, start_time ASC, created_at ASC').all();
            jou = await env.DB.prepare('SELECT * FROM daily_journals WHERE teacher_name = ? ORDER BY date DESC').bind(teacher.name).all();

            if (!classIds.length) {
              return new Response(JSON.stringify({
                students: [],
                classes: [],
                class_students: [],
                attendance: [],
                homework: [],
                exam_sessions: [],
                wrong_answers: [],
                attendance_history: [],
                homework_history: [],
                consultations: [],
                operation_memos: opm.results,
                exam_schedules: exS.results,
                academy_schedules: acs.results,
                journals: jou.results,
                class_textbooks: [],
                class_daily_records: [],
                class_daily_progress: []
              }), { headers });
            }
            
            const cMarkers = classIds.map(() => '?').join(',');
            [clss, map, txt, cdr, cdp] = await Promise.all([
              env.DB.prepare(`SELECT * FROM classes WHERE id IN (${cMarkers})`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_students WHERE class_id IN (${cMarkers})`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_textbooks WHERE class_id IN (${cMarkers}) ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_daily_records WHERE class_id IN (${cMarkers}) ORDER BY date DESC, created_at DESC LIMIT 1000`).bind(...classIds).all(),
              env.DB.prepare(`SELECT * FROM class_daily_progress WHERE class_id IN (${cMarkers}) ORDER BY created_at ASC LIMIT 3000`).bind(...classIds).all()
            ]);

            const studentIds = map.results.map(r => r.student_id);
            if (studentIds.length > 0) {
              const sMarkers = studentIds.map(() => '?').join(',');
              [stds, att, hw, exs, wrs, attHis, hwHis, cns] = await Promise.all([
                env.DB.prepare(`SELECT * FROM students WHERE id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM attendance WHERE date = DATE('now', '+9 hours') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM homework WHERE date = DATE('now', '+9 hours') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM exam_sessions WHERE student_id IN (${sMarkers}) ORDER BY exam_date DESC LIMIT 300`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM wrong_answers WHERE student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM attendance WHERE date >= DATE('now', '+9 hours', '-14 days') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM homework WHERE date >= DATE('now', '+9 hours', '-14 days') AND student_id IN (${sMarkers})`).bind(...studentIds).all(),
                env.DB.prepare(`SELECT * FROM consultations WHERE student_id IN (${sMarkers}) ORDER BY date DESC, created_at DESC`).bind(...studentIds).all()
              ]);
            } else {
              stds = { results: [] };
              att = { results: [] };
              hw = { results: [] };
              exs = { results: [] };
              wrs = { results: [] };
              attHis = { results: [] };
              hwHis = { results: [] };
              cns = { results: [] };
            }
          }

          return new Response(JSON.stringify({
            students: stds.results,
            classes: clss.results,
            class_students: map.results,
            attendance: att.results,
            homework: hw.results,
            exam_sessions: exs.results,
            wrong_answers: wrs.results,
            attendance_history: attHis.results,
            homework_history: hwHis.results,
            consultations: cns.results,
            operation_memos: opm.results,
            exam_schedules: exS.results,
            academy_schedules: acs.results,
            journals: jou.results,
            class_textbooks: txt.results,
            class_daily_records: cdr.results,
            class_daily_progress: cdp.results
          }), { headers });
        }

        // --- 5. 학생 관리 ---
        if (resource === 'students') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'POST' && id === 'batch-pins') {
            const { class_id } = await request.json();
            if (!class_id && teacher.role !== 'admin') return new Response(JSON.stringify({ error: 'Class ID required' }), { status: 403, headers });
            if (class_id && !(await canAccessClass(teacher, class_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const targets = await env.DB.prepare("SELECT id, grade FROM students WHERE (student_pin IS NULL OR student_pin = '') AND status = '재원' AND id IN (SELECT student_id FROM class_students WHERE class_id = ?)").bind(class_id).all();
            let count = 0;
            for (const s of targets.results) {
              const newPin = await generateStudentPin(s.grade, env);
              await env.DB.prepare('UPDATE students SET student_pin = ? WHERE id = ?').bind(newPin, s.id).run();
              count++;
            }
            return new Response(JSON.stringify({ success: true, count }), { headers });
          }

          if (method === 'POST' && path[3] === 'auto-pin') {
            if (!(await canAccessStudent(teacher, id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            const student = await env.DB.prepare('SELECT grade, student_pin FROM students WHERE id = ?').bind(id).first();
            if (!student) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
            if (student.student_pin) return new Response(JSON.stringify({ message: '이미 PIN이 설정된 학생입니다.' }), { status: 400, headers });
            const newPin = await generateStudentPin(student.grade, env);
            await env.DB.prepare('UPDATE students SET student_pin = ? WHERE id = ?').bind(newPin, id).run();
            return new Response(JSON.stringify({ success: true, pin: newPin }), { headers });
          }

          if (method === 'POST' && !id) {
            const d = await request.json();
            if (teacher.role !== 'admin') {
              if (!d.class_id) return new Response(JSON.stringify({ error: 'Class ID required' }), { status: 403, headers });
              if (!(await canAccessClass(teacher, d.class_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }
            let pin = d.student_pin || await generateStudentPin(d.grade, env);
            const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ?').bind(pin).first();
            if (exist) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers });

            const sid = `s_${Date.now()}`;
            const targetScore = normalizeTargetScore(d.target_score);
            const stmts = [env.DB.prepare("INSERT INTO students (id, name, school_name, grade, target_score, status, memo, guardian_relation, student_phone, parent_phone, student_pin, created_at, updated_at) VALUES (?, ?, ?, ?, ?, '\uC7AC\uC6D0', ?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))").bind(sid, d.name, d.school_name, d.grade, targetScore, d.memo || '', d.guardian_relation || '', d.student_phone || '', d.parent_phone || '', pin)];
            if (d.class_id) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.class_id, sid));
            try { await env.DB.batch(stmts); return new Response(JSON.stringify({ success: true, id: sid }), { headers }); }
            catch (err) { if (err.message.includes('UNIQUE')) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers }); throw err; }
          }

          if (method === 'PATCH' && id) {
            if (!(await canAccessStudent(teacher, id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            if (path[3] === 'restore') { await env.DB.prepare("UPDATE students SET status = '재원', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
            if (path[3] === 'hide') { await env.DB.prepare("UPDATE students SET status = '숨김', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
            const d = await request.json();
            if (d.class_id !== undefined && d.class_id) {
              if (!(await canAccessClass(teacher, d.class_id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }
            if (d.student_pin) {
              const exist = await env.DB.prepare('SELECT 1 FROM students WHERE student_pin = ? AND id != ?').bind(d.student_pin, id).first();
              if (exist) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers });
            }
            const targetScore = normalizeTargetScore(d.target_score);
            const stmts = [env.DB.prepare("UPDATE students SET name=?, school_name=?, grade=?, target_score=?, memo=?, guardian_relation=?, student_phone=?, parent_phone=?, student_pin=?, updated_at=DATETIME('now') WHERE id=?").bind(d.name, d.school_name, d.grade, targetScore, d.memo || '', d.guardian_relation || '', d.student_phone || '', d.parent_phone || '', d.student_pin || '', id)];
            if (d.class_id !== undefined) { stmts.push(env.DB.prepare('DELETE FROM class_students WHERE student_id = ?').bind(id)); if (d.class_id) stmts.push(env.DB.prepare('INSERT INTO class_students (class_id, student_id) VALUES (?, ?)').bind(d.class_id, id)); }
            try { await env.DB.batch(stmts); return new Response(JSON.stringify({ success: true }), { headers }); }
            catch (err) { if (err.message.includes('UNIQUE')) return new Response(JSON.stringify({ message: '이미 사용 중인 PIN입니다.' }), { status: 409, headers }); throw err; }
          }

          if (method === 'DELETE' && id) { 
            if (!(await canAccessStudent(teacher, id, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            await env.DB.prepare("UPDATE students SET status = '제적', updated_at = DATETIME('now') WHERE id = ?").bind(id).run(); 
            return new Response(JSON.stringify({ success: true }), { headers }); 
          }
        }

        // --- 6. 출결 및 숙제 ---
        if (resource === 'attendance-history' && method === 'GET') {
          const date = url.searchParams.get('date') || todayKstDateString();
          const [att, hw] = await Promise.all([
            env.DB.prepare('SELECT * FROM attendance WHERE date = ?').bind(date).all(),
            env.DB.prepare('SELECT * FROM homework WHERE date = ?').bind(date).all()
          ]);
          return new Response(JSON.stringify({ attendance: att.results, homework: hw.results, date }), { headers });
        }

        if (resource === 'attendance-batch' && method === 'POST') {
          const data = await request.json();
          const stmts = (data.entries || []).map(({ studentId, status, date }) =>
            env.DB.prepare("INSERT INTO attendance (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status")
              .bind(`${studentId}_${date}`, studentId, status, date)
          );
          if (stmts.length) await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (resource === 'homework-batch' && method === 'POST') {
          const data = await request.json();
          const stmts = (data.entries || []).map(({ studentId, status, date }) =>
            env.DB.prepare("INSERT INTO homework (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status")
              .bind(`${studentId}_${date}`, studentId, status, date)
          );
          if (stmts.length) await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        if (method === 'PATCH' && (resource === 'attendance' || resource === 'homework')) {
          const d = await request.json();
          const table = resource === 'attendance' ? 'attendance' : 'homework';
          await env.DB.prepare(`INSERT INTO ${table} (id, student_id, status, date, created_at) VALUES (?, ?, ?, ?, DATETIME('now')) ON CONFLICT(id) DO UPDATE SET status=excluded.status`).bind(`${d.studentId}_${d.date}`, d.studentId, d.status, d.date).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // --- 7. 시험 설계도 (Blueprints) ---
        if (resource === 'exam-blueprints') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'POST') {
            const d = await request.json();
            if (!d.archive_file) return new Response(JSON.stringify({ error: 'archive_file required' }), { status: 400, headers });
            if (!Array.isArray(d.items)) return new Response(JSON.stringify({ error: 'items must be an array' }), { status: 400, headers });

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
            return new Response(JSON.stringify({ success: true, count: stmts.length }), { headers });
          }

          if (method === 'GET') {
            const file = url.searchParams.get('file');
            if (!file) return new Response(JSON.stringify({ error: 'file parameter required' }), { status: 400, headers });
            
            const res = await env.DB.prepare('SELECT * FROM exam_blueprints WHERE archive_file = ? ORDER BY question_no ASC').bind(file).all();
            return new Response(JSON.stringify({ success: true, archive_file: file, items: res.results }), { headers });
          }
        }

        // --- 7.5. 시험 배정 관리 (Phase 3-H) ---
        if (resource === 'class-exam-assignments') {
          if (method === 'POST') {
            const d = await request.json();
            if (!d.class_id || !d.exam_title || !d.exam_date) {
              return new Response(JSON.stringify({ success: false, error: 'class_id, exam_title, exam_date required' }), { status: 400, headers });
            }

            const cls = await env.DB.prepare('SELECT id FROM classes WHERE id = ? LIMIT 1').bind(d.class_id).first();
            if (!cls) {
              return new Response(JSON.stringify({ success: false, error: 'class not found' }), { status: 404, headers });
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

            return new Response(JSON.stringify({ success: true, assignment }), { headers });
          }

          if (method === 'GET') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const classId = url.searchParams.get('class');
            if (!classId) return new Response(JSON.stringify({ success: false, error: 'classId required' }), { status: 400, headers });
            if (!(await canAccessClass(teacher, classId, env))) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });

            const res = await env.DB.prepare(`
              SELECT * FROM class_exam_assignments
              WHERE class_id = ?
              ORDER BY exam_date DESC, updated_at DESC
            `).bind(classId).all();

            return new Response(JSON.stringify({ success: true, assignments: res.results }), { headers });
          }
        }

        // --- 8. 시험 세션 및 오답 ---
        if (resource === 'exam-sessions') {
          if (method === 'DELETE' && id === 'by-exam') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const classId = url.searchParams.get('class') || '';
            const examTitle = url.searchParams.get('exam') || '';
            const examDate = url.searchParams.get('date') || '';

            if (!classId || !examTitle || !examDate) {
              return new Response(JSON.stringify({ success: false, error: 'class, exam, date required' }), { status: 400, headers });
            }
            if (!(await canAccessClass(teacher, classId, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
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

            return new Response(JSON.stringify({ success: true, deleted: sessionIds.length }), { headers });
          }

          if (method === 'GET' && id === 'by-class') {
            const classId = url.searchParams.get('class');
            const examTitle = url.searchParams.get('exam') || null;
            if (!classId) return new Response(JSON.stringify({ error: 'class required', students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] }), { status: 400, headers });

            const studentIds = await env.DB.prepare("SELECT student_id FROM class_students WHERE class_id = ?").bind(classId).all();
            const sIds = studentIds.results.map(r => r.student_id);
            if (!sIds.length) return new Response(JSON.stringify({ students: [], sessions: [], wrong_answers: [], blueprints: [], assignments: [] }), { headers });
            
            const p = sIds.map(() => '?').join(',');
            const [students, sessions, wrongs, assignments] = await Promise.all([
              env.DB.prepare(`SELECT id, name, school_name, grade FROM students WHERE id IN (${p}) AND status='재원'`).bind(...sIds).all(),
              examTitle ? env.DB.prepare(`SELECT * FROM exam_sessions WHERE class_id = ? AND exam_title = ? ORDER BY exam_date DESC`).bind(classId, examTitle).all() : env.DB.prepare(`SELECT * FROM exam_sessions WHERE class_id = ? ORDER BY exam_date DESC LIMIT 200`).bind(classId).all(),
              env.DB.prepare(`SELECT * FROM wrong_answers WHERE student_id IN (${p})`).bind(...sIds).all(),
              env.DB.prepare(`SELECT * FROM class_exam_assignments WHERE class_id = ? ORDER BY exam_date DESC, updated_at DESC`).bind(classId).all()
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

            return new Response(JSON.stringify({
              students: students.results,
              sessions: sessions.results,
              wrong_answers: wrongs.results,
              blueprints: blueprints.results,
              assignments: assignments.results
            }), { headers });
          }

          if (method === 'PATCH') {
            const d = await request.json();
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
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }

          if (method === 'DELETE' && path[3] === 'wrongs') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
            if (!session) return new Response(JSON.stringify({ success: false, error: 'session not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, session.student_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            await env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'DELETE') {
            const teacher = await verifyAuth(request, env);
            if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

            const session = await env.DB.prepare('SELECT student_id FROM exam_sessions WHERE id = ?').bind(id).first();
            if (!session) return new Response(JSON.stringify({ success: false, error: 'session not found' }), { status: 404, headers });
            if (!(await canAccessStudent(teacher, session.student_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            await env.DB.batch([
              env.DB.prepare('DELETE FROM wrong_answers WHERE session_id = ?').bind(id),
              env.DB.prepare('DELETE FROM exam_sessions WHERE id = ?').bind(id)
            ]);
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // --- 9. 운영 관리 (상담, 메모, 일정) ---
        if (resource === 'consultations') {
          if (method === 'POST') {
            const d = await request.json();
            const cid = `cns_${Date.now()}`;
            await env.DB.prepare("INSERT INTO consultations (id, student_id, date, type, content, next_action) VALUES (?, ?, ?, ?, ?, ?)").bind(cid, d.studentId, d.date, d.type, d.content, d.nextAction || '').run();
            return new Response(JSON.stringify({ success: true, id: cid }), { headers });
          }
          if (method === 'GET') {
            const sid = url.searchParams.get('studentId');
            if (sid) { const res = await env.DB.prepare('SELECT * FROM consultations WHERE student_id = ? ORDER BY date DESC, created_at DESC').bind(sid).all(); return new Response(JSON.stringify({ success: true, data: res.results }), { headers }); }
          }
          if (method === 'PATCH' && id) {
            const d = await request.json();
            await env.DB.prepare("UPDATE consultations SET date = ?, type = ?, content = ?, next_action = ? WHERE id = ?").bind(d.date, d.type, d.content, d.nextAction || '', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) { await env.DB.prepare('DELETE FROM consultations WHERE id = ?').bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
        }

        if (resource === 'operation-memos') {
          if (method === 'GET') { const res = await env.DB.prepare('SELECT * FROM operation_memos ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').all(); return new Response(JSON.stringify({ success: true, data: res.results }), { headers }); }
          if (method === 'POST') {
            const d = await request.json();
            const mid = `m_${Date.now()}`;
            await env.DB.prepare("INSERT INTO operation_memos (id, memo_date, content, is_pinned, is_done) VALUES (?, ?, ?, ?, 0)").bind(mid, d.memoDate, d.content, d.isPinned ? 1 : 0).run();
            return new Response(JSON.stringify({ success: true, id: mid }), { headers });
          }
          if (method === 'PATCH' && id) {
            const d = await request.json();
            await env.DB.prepare("UPDATE operation_memos SET memo_date=?, content=?, is_pinned=?, is_done=? WHERE id=?").bind(d.memoDate, d.content, d.isPinned ? 1 : 0, d.isDone ? 1 : 0, id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) { await env.DB.prepare("DELETE FROM operation_memos WHERE id=?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
        }
        
        if (resource === 'exam-schedules') {
          if (method === 'GET') { const res = await env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all(); return new Response(JSON.stringify({ success: true, data: res.results }), { headers }); }
          if (method === 'POST') {
            const d = await request.json();
            const eid = `exs_${Date.now()}`;
            await env.DB.prepare("INSERT INTO exam_schedules (id, school_name, grade, exam_name, exam_date, memo) VALUES (?, ?, ?, ?, ?, ?)").bind(eid, d.schoolName, d.grade, d.examName, d.examDate, d.memo || '').run();
            return new Response(JSON.stringify({ success: true, id: eid }), { headers });
          }
          if (method === 'PATCH' && id) {
            const d = await request.json();
            await env.DB.prepare("UPDATE exam_schedules SET school_name=?, grade=?, exam_name=?, exam_date=?, memo=? WHERE id=?").bind(d.schoolName, d.grade, d.examName, d.examDate, d.memo || '', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (method === 'DELETE' && id) { await env.DB.prepare("DELETE FROM exam_schedules WHERE id=?").bind(id).run(); return new Response(JSON.stringify({ success: true }), { headers }); }
        }

        // --- 9.5. 반별 교재 관리 ---
        if (resource === 'academy-schedules') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          const normalizeAcademySchedulePayload = (d) => {
            const scheduleType = String(d.scheduleType || '').trim();
            const title = String(d.title || '').trim();
            const scheduleDate = String(d.scheduleDate || '').trim();
            const targetScope = String(d.targetScope || 'global').trim() === 'student' ? 'student' : 'global';
            const studentId = targetScope === 'student' ? String(d.studentId || '').trim() : null;
            const isClosed = scheduleType === 'closed' ? 1 : (d.isClosed ? 1 : 0);

            if (!scheduleType || !title || !scheduleDate) return { error: 'Required fields missing' };
            if (targetScope === 'student' && !studentId) return { error: 'Student ID required' };
            if ((scheduleType === 'makeup' || scheduleType === 'consultation') && targetScope !== 'student') return { error: 'Student target required' };

            return {
              scheduleType,
              title,
              scheduleDate,
              startTime: d.startTime || '',
              endTime: d.endTime || '',
              targetScope,
              studentId,
              teacherName: d.teacherName || teacher.name || '',
              memo: d.memo || '',
              isClosed
            };
          };

          if (method === 'GET') {
            const from = url.searchParams.get('from') || '';
            const to = url.searchParams.get('to') || '';
            let query = 'SELECT * FROM academy_schedules WHERE is_deleted = 0';
            const params = [];
            if (from) {
              query += ' AND schedule_date >= ?';
              params.push(from);
            }
            if (to) {
              query += ' AND schedule_date <= ?';
              params.push(to);
            }
            query += ' ORDER BY schedule_date ASC, start_time ASC, created_at ASC';
            const stmt = env.DB.prepare(query);
            const res = params.length ? await stmt.bind(...params).all() : await stmt.all();
            return new Response(JSON.stringify({ success: true, data: res.results }), { headers });
          }

          if (method === 'POST') {
            const d = normalizeAcademySchedulePayload(await request.json());
            if (d.error) return new Response(JSON.stringify({ success: false, message: d.error }), { status: 400, headers });
            const sid = `acs_${Date.now()}`;
            await env.DB.prepare(`INSERT INTO academy_schedules
              (id, schedule_type, title, schedule_date, start_time, end_time, target_scope, student_id, teacher_name, memo, is_closed, is_deleted, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, DATETIME('now'), DATETIME('now'))`)
              .bind(sid, d.scheduleType, d.title, d.scheduleDate, d.startTime, d.endTime, d.targetScope, d.studentId, d.teacherName, d.memo, d.isClosed).run();
            return new Response(JSON.stringify({ success: true, id: sid }), { headers });
          }

          if (method === 'PATCH' && id) {
            const d = normalizeAcademySchedulePayload(await request.json());
            if (d.error) return new Response(JSON.stringify({ success: false, message: d.error }), { status: 400, headers });
            await env.DB.prepare(`UPDATE academy_schedules
              SET schedule_type=?, title=?, schedule_date=?, start_time=?, end_time=?, target_scope=?, student_id=?, teacher_name=?, memo=?, is_closed=?, updated_at=DATETIME('now')
              WHERE id=? AND is_deleted = 0`)
              .bind(d.scheduleType, d.title, d.scheduleDate, d.startTime, d.endTime, d.targetScope, d.studentId, d.teacherName, d.memo, d.isClosed, id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }

          if (method === 'DELETE' && id) {
            await env.DB.prepare("UPDATE academy_schedules SET is_deleted = 1, updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        if (resource === 'class-textbooks') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'GET') {
            const classId = url.searchParams.get('class') || '';
            const status = url.searchParams.get('status') || '';

            if (classId) {
              if (!(await canAccessClass(teacher, classId, env))) {
                return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
              }

              let query = 'SELECT * FROM class_textbooks WHERE class_id = ?';
              const params = [classId];

              if (status) {
                query += ' AND status = ?';
                params.push(status);
              }

              query += ' ORDER BY sort_order ASC, created_at ASC';

              const res = await env.DB.prepare(query).bind(...params).all();
              return new Response(JSON.stringify({ success: true, items: res.results }), { headers });
            }

            if (teacher.role === 'admin') {
              const res = await env.DB.prepare('SELECT * FROM class_textbooks ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC').all();
              return new Response(JSON.stringify({ success: true, items: res.results }), { headers });
            }

            const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
            const classIds = tcls.results.map(r => r.class_id);

            if (!classIds.length) {
              return new Response(JSON.stringify({ success: true, items: [] }), { headers });
            }

            const markers = classIds.map(() => '?').join(',');
            const res = await env.DB.prepare(`SELECT * FROM class_textbooks WHERE class_id IN (${markers}) ORDER BY class_id ASC, status ASC, sort_order ASC, created_at ASC`).bind(...classIds).all();
            return new Response(JSON.stringify({ success: true, items: res.results }), { headers });
          }

          if (method === 'POST') {
            const d = await request.json();

            if (!d.class_id || !String(d.title || '').trim()) {
              return new Response(JSON.stringify({ success: false, error: 'class_id and title required' }), { status: 400, headers });
            }

            if (!(await canAccessClass(teacher, d.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
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
            return new Response(JSON.stringify({ success: true, item }), { headers });
          }

          if (method === 'PATCH' && id) {
            const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

            if (!current) {
              return new Response(JSON.stringify({ success: false, error: 'not found' }), { status: 404, headers });
            }

            if (!(await canAccessClass(teacher, current.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
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
            return new Response(JSON.stringify({ success: true, item }), { headers });
          }

          if (method === 'DELETE' && id) {
            const current = await env.DB.prepare('SELECT * FROM class_textbooks WHERE id = ?').bind(id).first();

            if (!current) {
              return new Response(JSON.stringify({ success: false, error: 'not found' }), { status: 404, headers });
            }

            if (!(await canAccessClass(teacher, current.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            await env.DB.prepare('DELETE FROM class_textbooks WHERE id = ?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // --- 9.6. 반별 수업 기록 관리 ---
        if (resource === 'class-daily-records') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'GET') {
            const classId = url.searchParams.get('class') || '';
            const date = url.searchParams.get('date') || todayKstDateString();

            if (classId) {
              if (!(await canAccessClass(teacher, classId, env))) {
                return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
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

              return new Response(JSON.stringify({
                success: true,
                date,
                records: records.results,
                progress: progress.results
              }), { headers });
            }

            let classIds = [];
            if (teacher.role === 'admin') {
              const allClasses = await env.DB.prepare('SELECT id FROM classes WHERE is_active != 0 OR is_active IS NULL').all();
              classIds = allClasses.results.map(r => r.id);
            } else {
              const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(teacher.id).all();
              classIds = tcls.results.map(r => r.class_id);
            }

            if (!classIds.length) {
              return new Response(JSON.stringify({ success: true, date, records: [], progress: [] }), { headers });
            }

            const markers = classIds.map(() => '?').join(',');
            const records = await env.DB.prepare(`SELECT * FROM class_daily_records WHERE date = ? AND class_id IN (${markers}) ORDER BY class_id ASC, created_at ASC`).bind(date, ...classIds).all();
            const progress = await env.DB.prepare(`SELECT * FROM class_daily_progress WHERE record_id IN (SELECT id FROM class_daily_records WHERE date = ? AND class_id IN (${markers})) ORDER BY created_at ASC`).bind(date, ...classIds).all();

            return new Response(JSON.stringify({
              success: true,
              date,
              records: records.results,
              progress: progress.results
            }), { headers });
          }

          if (method === 'POST') {
            const d = await request.json();

            if (!d.class_id || !d.date) {
              return new Response(JSON.stringify({ success: false, error: 'class_id and date required' }), { status: 400, headers });
            }

            if (!(await canAccessClass(teacher, d.class_id, env))) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            const existing = await env.DB.prepare('SELECT * FROM class_daily_records WHERE class_id = ? AND date = ?').bind(d.class_id, d.date).first();
            const recordId = existing?.id || `cdr_${crypto.randomUUID()}`;
            const teacherName = d.teacher_name || teacher.name || '';
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

            return new Response(JSON.stringify({
              success: true,
              record,
              progress: progress.results
            }), { headers });
          }
        }

        // --- 10. 반 관리 (classes) ---
        if (resource === 'classes') {
          const normalizeTeacherNameForMap = (name) => String(name || '').trim().replace(/\s+/g, '').replace(/\uC120\uC0DD\uB2D8$/g, '');
          const syncTeacherClassMapping = async (classId, teacherName) => {
            const rawName = String(teacherName || '').trim();
            if (!classId || !rawName) return false;

            const teachers = await env.DB.prepare('SELECT id, name FROM teachers').all();
            const normalized = normalizeTeacherNameForMap(rawName);
            const matched = (teachers.results || []).find(t =>
              String(t.name || '').trim() === rawName ||
              normalizeTeacherNameForMap(t.name) === normalized
            );

            if (!matched) return false;

            await env.DB.batch([
              env.DB.prepare('DELETE FROM teacher_classes WHERE class_id = ?').bind(classId),
              env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(matched.id, classId)
            ]);
            return true;
          };
          if (method === 'POST') {
            const d = await request.json();
            const cid = `cls_${Date.now()}`;
            await env.DB.prepare("INSERT INTO classes (id, name, grade, subject, teacher_name, schedule_days, textbook, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, 1)").bind(cid, d.name, d.grade, d.subject || '수학', d.teacher_name || '박준성', d.schedule_days || '', d.textbook || '').run();
            const mappingUpdated = await syncTeacherClassMapping(cid, d.teacher_name);
            return new Response(JSON.stringify({ success: true, id: cid, mappingUpdated }), { headers });
          }
          if (method === 'PATCH' && id) {
            const d = await request.json();
            await env.DB.prepare("UPDATE classes SET name = ?, grade = ?, subject = ?, teacher_name = ?, schedule_days = ?, textbook = ?, is_active = ? WHERE id = ?").bind(d.name, d.grade, d.subject, d.teacher_name, d.schedule_days || '', d.textbook || '', d.is_active !== undefined ? d.is_active : 1, id).run();
            const mappingUpdated = await syncTeacherClassMapping(id, d.teacher_name);
            return new Response(JSON.stringify({ success: true, mappingUpdated }), { headers });
          }
        }

        // --- 11. 선생님 및 담당반 관리 (Admin Only) ---
        if (resource === 'teachers' && method === 'GET') {
          const t = await verifyAuth(request, env);
          if (t?.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const res = await env.DB.prepare('SELECT id, name, login_id, role FROM teachers ORDER BY role DESC').all();
          const map = await env.DB.prepare('SELECT * FROM teacher_classes').all();
          return new Response(JSON.stringify({ teachers: res.results, teacher_classes: map.results }), { headers });
        }

        if (resource === 'teacher-classes' && method === 'POST') {
          const t = await verifyAuth(request, env);
          if (t?.role !== 'admin') return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
          const { teacher_id, class_ids } = await request.json();
          const stmts = [env.DB.prepare('DELETE FROM teacher_classes WHERE teacher_id = ?').bind(teacher_id)];
          for (const cid of (class_ids || [])) stmts.push(env.DB.prepare('INSERT OR IGNORE INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)').bind(teacher_id, cid));
          await env.DB.batch(stmts);
          return new Response(JSON.stringify({ success: true }), { headers });
        }

        // --- 12. AI 리포트 ---
        if (resource === 'ai' && path[2] === 'student-report' && method === 'POST') {
          const p = await request.json();
          const { type, student, today: td } = p;
          const examStr = td?.exam ? `${td.exam.title} ${td.exam.score}점` : '없음';
          let fallback = type === 'parent' ? `[AP Math] ${student.name} 학생 오늘 수업 안내\n출결: ${td.att}\n숙제: ${td.hw}\n성적: ${examStr}` : type === 'student' ? `${student.name}아 수고했어!` : `상담메모: ${student.name}`;
          return new Response(JSON.stringify({ success: true, message: fallback, source: 'fallback' }), { headers });
        }
        
        // --- 13. 오늘의 일지 (결재 시스템) ---
        if (resource === 'daily-journals') {
          const teacher = await verifyAuth(request, env);
          if (!teacher) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });

          if (method === 'POST') {
            const d = await request.json();
            const jid = `jou_${Date.now()}`;
            await env.DB.prepare("INSERT INTO daily_journals (id, date, teacher_name, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))").bind(jid, d.date, teacher.name, d.content, d.status || '작성중').run();
            return new Response(JSON.stringify({ success: true, id: jid }), { headers });
          }

          if (method === 'PATCH' && id) {
            const d = await request.json();

            const existing = await env.DB.prepare('SELECT * FROM daily_journals WHERE id = ?')
              .bind(id)
              .first();

            if (!existing) {
              return new Response(JSON.stringify({ success: false, error: 'journal not found' }), { status: 404, headers });
            }

            if (teacher.role !== 'admin' && existing.teacher_name !== teacher.name) {
              return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
            }

            if (teacher.role === 'admin' && d.feedback !== undefined) {
              await env.DB.prepare("UPDATE daily_journals SET feedback = ?, status = '결재완료', updated_at = DATETIME('now') WHERE id = ?")
                .bind(d.feedback, id)
                .run();
            } else {
              await env.DB.prepare("UPDATE daily_journals SET content = ?, status = ?, updated_at = DATETIME('now') WHERE id = ?")
                .bind(d.content, d.status, id)
                .run();
            }

            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }

      return new Response(JSON.stringify({ error: 'API Endpoint Not Found' }), { status: 404, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
    }
  }
};
