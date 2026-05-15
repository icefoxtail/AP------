import { sha256hex } from '../helpers/admin-db.js';
import { canAccessClass, canAccessStudent, isAdminUser, isStaffUser } from '../helpers/foundation-db.js';
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

export async function handleOperations(request, env, teacher, path, url) {
  const method = request.method;
  const resource = path[1];
  const id = path[2];

  if (resource === 'consultations') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
    if (method === 'POST') {
      const d = await request.json();
      if (!(await canAccessStudent(currentTeacher, d.studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      const cid = `cns_${Date.now()}`;
      await env.DB.prepare('INSERT INTO consultations (id, student_id, date, type, content, next_action) VALUES (?, ?, ?, ?, ?, ?)').bind(cid, d.studentId, d.date, d.type, d.content, d.nextAction || '').run();
      return jsonResponse({ success: true, id: cid });
    }
    if (method === 'GET') {
      const sid = url.searchParams.get('studentId');
      if (sid) {
        if (!(await canAccessStudent(currentTeacher, sid, env))) return jsonResponse({ error: 'Forbidden' }, 403);
        const res = await env.DB.prepare('SELECT * FROM consultations WHERE student_id = ? ORDER BY date DESC, created_at DESC').bind(sid).all();
        return jsonResponse({ success: true, data: res.results });
      }
    }
    if (method === 'PATCH' && id) {
      const existing = await env.DB.prepare('SELECT student_id FROM consultations WHERE id = ?').bind(id).first();
      if (!existing) return jsonResponse({ error: 'Not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, existing.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      const d = await request.json();
      await env.DB.prepare('UPDATE consultations SET date = ?, type = ?, content = ?, next_action = ? WHERE id = ?').bind(d.date, d.type, d.content, d.nextAction || '', id).run();
      return jsonResponse({ success: true });
    }
    if (method === 'DELETE' && id) {
      const existing = await env.DB.prepare('SELECT student_id FROM consultations WHERE id = ?').bind(id).first();
      if (!existing) return jsonResponse({ error: 'Not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, existing.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      await env.DB.prepare('DELETE FROM consultations WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true });
    }
  }

  if (resource === 'operation-memos') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'GET') {
      const res = isAdminUser(currentTeacher)
        ? await env.DB.prepare('SELECT * FROM operation_memos ORDER BY is_done ASC, is_pinned DESC, memo_date ASC').all()
        : await env.DB.prepare("SELECT * FROM operation_memos WHERE teacher_name = ? OR teacher_name = '' OR teacher_name IS NULL ORDER BY is_done ASC, is_pinned DESC, memo_date ASC").bind(currentTeacher.name).all();
      return jsonResponse({ success: true, data: res.results });
    }
    if (method === 'POST') {
      const d = await request.json();
      const mid = `m_${Date.now()}`;
      await env.DB.prepare('INSERT INTO operation_memos (id, memo_date, content, is_pinned, is_done, teacher_name) VALUES (?, ?, ?, ?, 0, ?)').bind(mid, d.memoDate, d.content, d.isPinned ? 1 : 0, currentTeacher.name).run();
      return jsonResponse({ success: true, id: mid });
    }
    if (method === 'PATCH' && id) {
      const existing = await env.DB.prepare('SELECT teacher_name FROM operation_memos WHERE id = ?').bind(id).first();
      if (!existing) return jsonResponse({ error: 'Not found' }, 404);
      if (!isAdminUser(currentTeacher) && existing.teacher_name && existing.teacher_name !== currentTeacher.name) return jsonResponse({ error: 'Forbidden' }, 403);
      const d = await request.json();
      await env.DB.prepare('UPDATE operation_memos SET memo_date=?, content=?, is_pinned=?, is_done=? WHERE id=?').bind(d.memoDate, d.content, d.isPinned ? 1 : 0, d.isDone ? 1 : 0, id).run();
      return jsonResponse({ success: true });
    }
    if (method === 'DELETE' && id) {
      const existing = await env.DB.prepare('SELECT teacher_name FROM operation_memos WHERE id = ?').bind(id).first();
      if (!existing) return jsonResponse({ error: 'Not found' }, 404);
      if (!isAdminUser(currentTeacher) && existing.teacher_name && existing.teacher_name !== currentTeacher.name) return jsonResponse({ error: 'Forbidden' }, 403);
      await env.DB.prepare('DELETE FROM operation_memos WHERE id=?').bind(id).run();
      return jsonResponse({ success: true });
    }
  }

  if (resource === 'exam-schedules') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);
    if (method === 'GET') { const res = await env.DB.prepare('SELECT * FROM exam_schedules ORDER BY exam_date ASC').all(); return jsonResponse({ success: true, data: res.results }); }
    if (!isStaffUser(currentTeacher)) return jsonResponse({ error: 'Forbidden' }, 403);
    if (method === 'POST') {
      const d = await request.json();
      const eid = `exs_${Date.now()}`;
      await env.DB.prepare('INSERT INTO exam_schedules (id, school_name, grade, exam_name, exam_date, memo) VALUES (?, ?, ?, ?, ?, ?)').bind(eid, d.schoolName, d.grade, d.examName, d.examDate, d.memo || '').run();
      return jsonResponse({ success: true, id: eid });
    }
    if (method === 'PATCH' && id) {
      const d = await request.json();
      await env.DB.prepare('UPDATE exam_schedules SET school_name=?, grade=?, exam_name=?, exam_date=?, memo=? WHERE id=?').bind(d.schoolName, d.grade, d.examName, d.examDate, d.memo || '', id).run();
      return jsonResponse({ success: true });
    }
    if (method === 'DELETE' && id) { await env.DB.prepare('DELETE FROM exam_schedules WHERE id=?').bind(id).run(); return jsonResponse({ success: true }); }
  }

  if (resource === 'academy-schedules') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    const normalizeAcademySchedulePayload = (d) => {
      const scheduleType = String(d.scheduleType || '').trim();
      const title = String(d.title || '').trim();
      const scheduleDate = String(d.scheduleDate || '').trim();
      const rawTargetScope = String(d.targetScope || 'global').trim();
      const targetScope = ['global', 'teacher', 'student'].includes(rawTargetScope) ? rawTargetScope : 'global';
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
        teacherName: d.teacherName || currentTeacher.name || '',
        memo: d.memo || '',
        isClosed
      };
    };

    if (method === 'GET') {
      const from = url.searchParams.get('from') || '';
      const to = url.searchParams.get('to') || '';
      const dateParams = [];
      let dateClause = '';
      if (from) { dateClause += ' AND schedule_date >= ?'; dateParams.push(from); }
      if (to) { dateClause += ' AND schedule_date <= ?'; dateParams.push(to); }

      if (isAdminUser(currentTeacher)) {
        const query = `SELECT * FROM academy_schedules WHERE is_deleted = 0${dateClause} ORDER BY schedule_date ASC, start_time ASC, created_at ASC`;
        const res = dateParams.length ? await env.DB.prepare(query).bind(...dateParams).all() : await env.DB.prepare(query).all();
        return jsonResponse({ success: true, data: res.results });
      }

      const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(currentTeacher.id).all();
      const classIds = (tcls.results || []).map(r => r.class_id);
      let query, params;
      if (!classIds.length) {
        query = `SELECT * FROM academy_schedules WHERE is_deleted = 0${dateClause} AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?)) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`;
        params = [...dateParams, currentTeacher.name];
      } else {
        const cMarkers = classIds.map(() => '?').join(',');
        query = `SELECT * FROM academy_schedules WHERE is_deleted = 0${dateClause} AND (target_scope = 'global' OR (target_scope = 'teacher' AND teacher_name = ?) OR (target_scope = 'student' AND student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${cMarkers})))) ORDER BY schedule_date ASC, start_time ASC, created_at ASC`;
        params = [...dateParams, currentTeacher.name, ...classIds];
      }
      const res = params.length ? await env.DB.prepare(query).bind(...params).all() : await env.DB.prepare(query).all();
      return jsonResponse({ success: true, data: res.results });
    }

    if (method === 'POST') {
      const d = normalizeAcademySchedulePayload(await request.json());
      if (d.error) return jsonResponse({ success: false, message: d.error }, 400);
      if (d.targetScope === 'global' && !isStaffUser(currentTeacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      if (d.targetScope === 'student' && !(await canAccessStudent(currentTeacher, d.studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      const sid = `acs_${Date.now()}`;
      await env.DB.prepare(`INSERT INTO academy_schedules
        (id, schedule_type, title, schedule_date, start_time, end_time, target_scope, student_id, teacher_name, memo, is_closed, is_deleted, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, DATETIME('now'), DATETIME('now'))`)
        .bind(sid, d.scheduleType, d.title, d.scheduleDate, d.startTime, d.endTime, d.targetScope, d.studentId, d.teacherName, d.memo, d.isClosed).run();
      return jsonResponse({ success: true, id: sid });
    }

    if (method === 'PATCH' && id) {
      const d = normalizeAcademySchedulePayload(await request.json());
      if (d.error) return jsonResponse({ success: false, message: d.error }, 400);
      if (d.targetScope === 'global' && !isStaffUser(currentTeacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      if (d.targetScope === 'student' && !(await canAccessStudent(currentTeacher, d.studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      await env.DB.prepare(`UPDATE academy_schedules
        SET schedule_type=?, title=?, schedule_date=?, start_time=?, end_time=?, target_scope=?, student_id=?, teacher_name=?, memo=?, is_closed=?, updated_at=DATETIME('now')
        WHERE id=? AND is_deleted = 0`)
        .bind(d.scheduleType, d.title, d.scheduleDate, d.startTime, d.endTime, d.targetScope, d.studentId, d.teacherName, d.memo, d.isClosed, id).run();
      return jsonResponse({ success: true });
    }

    if (method === 'DELETE' && id) {
      const existingAcs = await env.DB.prepare('SELECT target_scope, student_id, teacher_name FROM academy_schedules WHERE id = ? AND is_deleted = 0').bind(id).first();
      if (existingAcs && existingAcs.target_scope === 'global' && !isStaffUser(currentTeacher)) return jsonResponse({ error: 'Forbidden' }, 403);
      if (existingAcs && existingAcs.target_scope === 'teacher' && !isAdminUser(currentTeacher) && existingAcs.teacher_name !== currentTeacher.name) return jsonResponse({ error: 'Forbidden' }, 403);
      if (existingAcs && existingAcs.target_scope === 'student' && !(await canAccessStudent(currentTeacher, existingAcs.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      await env.DB.prepare("UPDATE academy_schedules SET is_deleted = 1, updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
      return jsonResponse({ success: true });
    }
  }

  if (resource === 'school-exam-records') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    const normalizeSchoolExamRecordPayload = async (d) => {
      const studentId = String(d.studentId || d.student_id || '').trim();
      const examYear = Number(d.examYear || d.exam_year || 0);
      const examType = String(d.examType || d.exam_type || '').trim();
      const subject = String(d.subject || '').trim();
      if (!studentId || !examYear || !examType || !subject) return { error: 'Required fields missing' };

      let targetScoreSnapshot = d.targetScoreSnapshot ?? d.target_score_snapshot ?? null;
      if (targetScoreSnapshot === '' || targetScoreSnapshot === undefined) targetScoreSnapshot = null;
      if (targetScoreSnapshot === null) {
        const student = await env.DB.prepare('SELECT target_score FROM students WHERE id = ?').bind(studentId).first();
        targetScoreSnapshot = student?.target_score ?? null;
      }

      const rawScore = d.score;
      const score = rawScore === '' || rawScore === undefined || rawScore === null ? null : Number(rawScore);
      const targetScore = targetScoreSnapshot === '' || targetScoreSnapshot === undefined || targetScoreSnapshot === null ? null : Number(targetScoreSnapshot);

      return {
        studentId,
        classId: String(d.classId || d.class_id || '').trim() || null,
        schoolName: String(d.schoolName || d.school_name || '').trim(),
        grade: String(d.grade || '').trim(),
        examYear,
        semester: String(d.semester || '').trim(),
        examType,
        subject,
        score: Number.isFinite(score) ? score : null,
        targetScoreSnapshot: Number.isFinite(targetScore) ? targetScore : null,
        memo: String(d.memo || '').trim()
      };
    };

    if (method === 'GET') {
      const params = [];
      const clauses = ['is_deleted = 0'];
      const studentId = url.searchParams.get('studentId') || '';
      const classId = url.searchParams.get('classId') || '';
      const grade = url.searchParams.get('grade') || '';
      const year = url.searchParams.get('year') || '';

      if (studentId) { clauses.push('student_id = ?'); params.push(studentId); }
      if (classId) { clauses.push('class_id = ?'); params.push(classId); }
      if (grade) { clauses.push('grade = ?'); params.push(grade); }
      if (year) { clauses.push('exam_year = ?'); params.push(Number(year)); }

      if (!isAdminUser(currentTeacher)) {
        const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(currentTeacher.id).all();
        const classIds = (tcls.results || []).map(r => r.class_id);
        if (!classIds.length) return jsonResponse({ success: true, data: [] });
        const markers = classIds.map(() => '?').join(',');
        clauses.push(`student_id IN (SELECT student_id FROM class_students WHERE class_id IN (${markers}))`);
        params.push(...classIds);
      }

      const limit = Math.min(Number(url.searchParams.get('limit') || 1000) || 1000, 2000);
      const query = `SELECT * FROM school_exam_records WHERE ${clauses.join(' AND ')} ORDER BY exam_year DESC, semester DESC, created_at DESC LIMIT ?`;
      const res = await env.DB.prepare(query).bind(...params, limit).all();
      return jsonResponse({ success: true, data: res.results });
    }

    if (method === 'POST' && id === 'batch') {
      const d = await request.json();
      const { classId: bClassId, examYear: bYear, semester: bSem, examType: bType, subject: bSubj, records: bRecs } = d;
      if (!bYear || !bType || !bSubj) return jsonResponse({ success: false, message: 'examYear, examType, subject required' }, 400);
      if (bClassId && !(await canAccessClass(currentTeacher, bClassId, env))) return jsonResponse({ error: 'Forbidden' }, 403);

      const bStudentIds = (bRecs || []).map(r => String(r.studentId || '')).filter(Boolean);
      if (!bStudentIds.length) return jsonResponse({ success: true });

      if (!isAdminUser(currentTeacher)) {
        let allowedIds;
        if (bClassId) {
          const csRes = await env.DB.prepare('SELECT student_id FROM class_students WHERE class_id = ?').bind(bClassId).all();
          allowedIds = new Set((csRes.results || []).map(r => String(r.student_id)));
        } else {
          const tcls = await env.DB.prepare('SELECT class_id FROM teacher_classes WHERE teacher_id = ?').bind(currentTeacher.id).all();
          const tcIds = (tcls.results || []).map(r => r.class_id);
          if (!tcIds.length) return jsonResponse({ error: 'Forbidden' }, 403);
          const m2 = tcIds.map(() => '?').join(',');
          const csRes2 = await env.DB.prepare(`SELECT student_id FROM class_students WHERE class_id IN (${m2})`).bind(...tcIds).all();
          allowedIds = new Set((csRes2.results || []).map(r => String(r.student_id)));
        }
        for (const sid of bStudentIds) {
          if (!allowedIds.has(sid)) return jsonResponse({ error: 'Forbidden', message: '담당하지 않은 학생이 포함되어 있습니다.' }, 403);
        }
      }

      const sm = bStudentIds.map(() => '?').join(',');
      const existRes = await env.DB.prepare(
        `SELECT id, student_id FROM school_exam_records WHERE student_id IN (${sm}) AND exam_year = ? AND semester = ? AND exam_type = ? AND subject = ? AND is_deleted = 0`
      ).bind(...bStudentIds, Number(bYear), String(bSem || ''), String(bType), String(bSubj)).all();
      const existMap = new Map((existRes.results || []).map(r => [String(r.student_id), r.id]));

      const stuRes = await env.DB.prepare(`SELECT id, school_name, grade, target_score FROM students WHERE id IN (${sm})`).bind(...bStudentIds).all();
      const stuMap = new Map((stuRes.results || []).map(s => [String(s.id), s]));

      const stmts = [];
      const baseTs = Date.now();
      for (let i = 0; i < bRecs.length; i++) {
        const { studentId: bSid, score: bScore } = bRecs[i];
        const sid = String(bSid || '');
        if (!sid) continue;
        const rawScore = bScore === '' || bScore === null || bScore === undefined ? null : Number(bScore);
        const finalScore = Number.isFinite(rawScore) ? rawScore : null;
        const existId = existMap.get(sid);
        if (existId) {
          stmts.push(env.DB.prepare("UPDATE school_exam_records SET score = ?, class_id = ?, updated_at = DATETIME('now') WHERE id = ? AND is_deleted = 0").bind(finalScore, bClassId || null, existId));
        } else if (finalScore !== null) {
          const stu = stuMap.get(sid);
          const rid = `ser_${baseTs}_${i}_${sid.slice(-4)}`;
          stmts.push(env.DB.prepare(
            "INSERT INTO school_exam_records (id,student_id,class_id,school_name,grade,exam_year,semester,exam_type,subject,score,target_score_snapshot,memo,is_deleted,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,DATETIME('now'),DATETIME('now'))"
          ).bind(rid, sid, bClassId || null, stu?.school_name || '', stu?.grade || '', Number(bYear), String(bSem || ''), String(bType), String(bSubj), finalScore, stu?.target_score ?? null, ''));
        }
      }
      if (stmts.length) await env.DB.batch(stmts);
      return jsonResponse({ success: true });
    }

    if (method === 'POST') {
      const d = await normalizeSchoolExamRecordPayload(await request.json());
      if (d.error) return jsonResponse({ success: false, message: d.error }, 400);
      if (!(await canAccessStudent(currentTeacher, d.studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      const rid = `ser_${Date.now()}`;
      await env.DB.prepare(`INSERT INTO school_exam_records
        (id, student_id, class_id, school_name, grade, exam_year, semester, exam_type, subject, score, target_score_snapshot, memo, is_deleted, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, DATETIME('now'), DATETIME('now'))`)
        .bind(rid, d.studentId, d.classId, d.schoolName, d.grade, d.examYear, d.semester, d.examType, d.subject, d.score, d.targetScoreSnapshot, d.memo).run();
      return jsonResponse({ success: true, id: rid });
    }

    if (method === 'PATCH' && id) {
      const existing = await env.DB.prepare('SELECT student_id FROM school_exam_records WHERE id = ? AND is_deleted = 0').bind(id).first();
      if (!existing) return jsonResponse({ error: 'Not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, existing.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      const d = await normalizeSchoolExamRecordPayload(await request.json());
      if (d.error) return jsonResponse({ success: false, message: d.error }, 400);
      if (!(await canAccessStudent(currentTeacher, d.studentId, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      await env.DB.prepare(`UPDATE school_exam_records
        SET student_id=?, class_id=?, school_name=?, grade=?, exam_year=?, semester=?, exam_type=?, subject=?, score=?, target_score_snapshot=?, memo=?, updated_at=DATETIME('now')
        WHERE id=? AND is_deleted = 0`)
        .bind(d.studentId, d.classId, d.schoolName, d.grade, d.examYear, d.semester, d.examType, d.subject, d.score, d.targetScoreSnapshot, d.memo, id).run();
      return jsonResponse({ success: true });
    }

    if (method === 'DELETE' && id) {
      const existing = await env.DB.prepare('SELECT student_id FROM school_exam_records WHERE id = ? AND is_deleted = 0').bind(id).first();
      if (!existing) return jsonResponse({ error: 'Not found' }, 404);
      if (!(await canAccessStudent(currentTeacher, existing.student_id, env))) return jsonResponse({ error: 'Forbidden' }, 403);
      await env.DB.prepare("UPDATE school_exam_records SET is_deleted = 1, updated_at = DATETIME('now') WHERE id = ?").bind(id).run();
      return jsonResponse({ success: true });
    }
  }

  if (resource === 'daily-journals') {
    const currentTeacher = await requireTeacher(request, env, teacher);
    if (!currentTeacher) return jsonResponse({ error: 'Unauthorized' }, 401);

    if (method === 'POST') {
      const d = await request.json();
      const jid = `jou_${Date.now()}`;
      await env.DB.prepare("INSERT INTO daily_journals (id, date, teacher_name, content, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, DATETIME('now'), DATETIME('now'))").bind(jid, d.date, currentTeacher.name, d.content, d.status || '작성중').run();
      return jsonResponse({ success: true, id: jid });
    }

    if (method === 'PATCH' && id) {
      const d = await request.json();

      const existing = await env.DB.prepare('SELECT * FROM daily_journals WHERE id = ?')
        .bind(id)
        .first();

      if (!existing) {
        return jsonResponse({ success: false, error: 'journal not found' }, 404);
      }

      if (!isAdminUser(currentTeacher) && existing.teacher_name !== currentTeacher.name) {
        return jsonResponse({ error: 'Forbidden' }, 403);
      }

      if (isAdminUser(currentTeacher) && d.feedback !== undefined) {
        await env.DB.prepare("UPDATE daily_journals SET feedback = ?, status = '결재완료', updated_at = DATETIME('now') WHERE id = ?")
          .bind(d.feedback, id)
          .run();
      } else {
        await env.DB.prepare("UPDATE daily_journals SET content = ?, status = ?, updated_at = DATETIME('now') WHERE id = ?")
          .bind(d.content, d.status, id)
          .run();
      }

      return jsonResponse({ success: true });
    }
  }

  return null;
}
