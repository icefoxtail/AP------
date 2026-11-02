/**
 * AP Math OS [js/ws-exam-data.js]
 * 원내평가·OMR 작업 화면(ws-exam-workspace.js)의 자료 계산. 화면 코드는 여기에 없다.
 *
 * 시험 묶기·시험 정체성 판정은 통합 전 openExamGradeView / openExamDetail
 * (classroom-planner.js)이 하던 계산을 그대로 옮긴 것이다. 시험 정체성(날짜·원문 파일·배정 ID로 같은 시험을
 * 알아보는 규칙)을 바꾸지 않는다. 학생 포털이 읽는 session_id·assignment_id·archive_file 값도 건드리지 않는다.
 */

function wsExamIdText(value) {
    return String(value ?? '');
}

function wsExamClassStudentIds(classId) {
    return (state.db.class_students || [])
        .filter(m => wsExamIdText(m.class_id) === wsExamIdText(classId))
        .map(m => wsExamIdText(m.student_id));
}

/**
 * 시험별 조회(exam-sessions/by-class) 응답을 작업 화면이 쓰는 한 덩어리로 만든다.
 * res가 없으면(조회 실패) 앱이 이미 들고 있는 값(state.db)으로 대신한다.
 */
function wsExamBuildSource(classId, res) {
    const ids = wsExamClassStudentIds(classId);
    let sessions = (state.db.exam_sessions || []).filter(es => ids.includes(wsExamIdText(es.student_id)));
    let wrongAnswers = (state.db.wrong_answers || []).slice();
    let assignments = [];
    let exclusions = [];
    if (res && Array.isArray(res.sessions)) {
        sessions = res.sessions.filter(es => ids.includes(wsExamIdText(es.student_id)));
        assignments = Array.isArray(res.assignments)
            ? res.assignments.filter(a => ids.length && wsExamIdText(a.class_id) === wsExamIdText(classId))
            : [];
        exclusions = Array.isArray(res.exclusions) ? res.exclusions : [];
    }
    if (res && Array.isArray(res.wrong_answers)) wrongAnswers = res.wrong_answers.slice();
    return { classId: wsExamIdText(classId), ids, sessions: sessions.slice(), wrongAnswers, assignments: assignments.slice(), exclusions: exclusions.slice() };
}

/** 같은 시험으로 묶는 규칙(통합 전 openExamGradeView와 같다). 반환: 날짜 내림차순 시험 배열. */
function wsExamBuildExams(source) {
    const classId = source.classId;
    const ids = source.ids;
    const students = state.db.students || [];
    const activeCount = students.filter(s => ids.includes(wsExamIdText(s.id)) && s.status === '재원').length;
    const activeCountForAssignment = activeCount || ids.length;
    const assignments = source.assignments;
    const sessions = source.sessions;

    const exclusionCountByAssignmentId = new Map();
    source.exclusions.forEach(ex => {
        const assignmentId = wsExamIdText(ex.assignment_id);
        const studentId = wsExamIdText(ex.student_id);
        if (!assignmentId || !studentId) return;
        if (!exclusionCountByAssignmentId.has(assignmentId)) exclusionCountByAssignmentId.set(assignmentId, new Set());
        exclusionCountByAssignmentId.get(assignmentId).add(studentId);
    });

    const grouped = {};
    const assignmentById = new Map(assignments.map(a => [wsExamIdText(a.id), a]).filter(([id]) => id));
    const isQuestionCountCompatible = function(a, row) {
        const aq = Number(a?.question_count || 0);
        const rq = Number(row?.question_count || 0);
        return !aq || !rq || aq === rq;
    };
    const findMatchingAssignmentForSession = function(session) {
        const byAssignmentId = assignmentById.get(wsExamIdText(session.assignment_id));
        if (byAssignmentId) return byAssignmentId;

        const sessionDate = wsExamIdText(session.exam_date);
        const sessionArchive = normalizeClassroomArchiveFile(session.archive_file || '');
        const candidates = assignments.filter(a =>
            wsExamIdText(a.exam_date) === sessionDate &&
            isQuestionCountCompatible(a, session)
        );

        if (sessionArchive) {
            return candidates.find(a => normalizeClassroomArchiveFile(a.archive_file || '') === sessionArchive) || null;
        }

        const archivedCandidates = candidates.filter(a => normalizeClassroomArchiveFile(a.archive_file || ''));
        if (archivedCandidates.length === 1) return archivedCandidates[0];

        return candidates.find(a => wsExamIdText(a.exam_title) === wsExamIdText(session.exam_title)) || null;
    };

    assignments.forEach(a => {
        const key = makeExamListKey(a.exam_title, a.exam_date, a.archive_file || '');
        if (!grouped[key]) grouped[key] = { title: a.exam_title, displayTitle: getClassroomExamDisplayTitle(a), date: a.exam_date, archiveFile: a.archive_file || '', sessions: [], questionCount: a.question_count || 0, assignment: a };
        else {
            grouped[key].assignment = a;
            if (!grouped[key].questionCount && a.question_count) grouped[key].questionCount = a.question_count;
            if (!grouped[key].archiveFile && a.archive_file) grouped[key].archiveFile = a.archive_file;
            if (!grouped[key].displayTitle || grouped[key].displayTitle === grouped[key].title) grouped[key].displayTitle = getClassroomExamDisplayTitle(a);
        }
    });

    sessions.forEach(s => {
        const matchedAssignment = findMatchingAssignmentForSession(s);
        const resolvedArchiveFile = matchedAssignment?.archive_file || s.archive_file || '';
        const key = makeExamListKey(s.exam_title, s.exam_date, resolvedArchiveFile);
        if (!grouped[key]) grouped[key] = { title: s.exam_title, displayTitle: getClassroomExamDisplayTitle({ ...s, archiveFile: resolvedArchiveFile }), date: s.exam_date, archiveFile: resolvedArchiveFile, sessions: [], questionCount: s.question_count || matchedAssignment?.question_count || 0, assignment: matchedAssignment || null };
        grouped[key].sessions.push(s);
        if (!grouped[key].questionCount && s.question_count) grouped[key].questionCount = s.question_count;
        if (!grouped[key].archiveFile && resolvedArchiveFile) grouped[key].archiveFile = resolvedArchiveFile;
        if (!grouped[key].assignment && matchedAssignment) grouped[key].assignment = matchedAssignment;
        if (!grouped[key].displayTitle || grouped[key].displayTitle === grouped[key].title) grouped[key].displayTitle = getClassroomExamDisplayTitle({ ...s, archiveFile: resolvedArchiveFile });
    });

    return Object.entries(grouped).map(([key, exam]) => {
        const displayTitle = exam.displayTitle || getClassroomExamDisplayTitle(exam);
        const cnt = exam.sessions.length;
        const qCount = exam.questionCount || exam.sessions[0]?.question_count || exam.assignment?.question_count || 0;
        const avg = cnt ? Math.round(exam.sessions.reduce((sum, s) => sum + Number(s.score || 0), 0) / cnt) : null;
        const excludedCount = exam.assignment?.id ? (exclusionCountByAssignmentId.get(wsExamIdText(exam.assignment.id))?.size || 0) : 0;
        const targetCount = Math.max(0, activeCountForAssignment - excludedCount);
        const pct = targetCount ? Math.round((cnt / targetCount) * 100) : 0;
        return { ...exam, key, displayTitle, count: cnt, qCount, avg, targetCount, pct, isDraft: false };
    }).sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.title).localeCompare(String(a.title)));
}

/** 새로 만든 시험(아직 제출 기록이 없어 서버에도 없는 시험)의 목록 줄. */
function wsExamMakeDraft({ title, date, questionCount, seq }) {
    const safeTitle = String(title || '').trim() || '단원평가';
    return {
        key: `draft:${seq}:${safeTitle}||${date}`,
        title: safeTitle, displayTitle: safeTitle, date, archiveFile: '', sessions: [], questionCount: Number(questionCount) || 0,
        assignment: null, count: 0, qCount: Number(questionCount) || 0, avg: null, targetCount: 0, pct: 0, isDraft: true
    };
}

/** 시험 한 건의 학생별 상태(통합 전 openExamDetail의 계산). */
function wsExamBuildDetail(source, exam) {
    const classId = source.classId;
    const ids = source.ids;
    const examTitle = exam.title;
    const examDate = exam.date;
    const archiveFilter = normalizeClassroomArchiveFile(exam.archiveFile || '');
    const assignmentSource = source.assignments;
    const assignmentById = new Map(assignmentSource.map(a => [wsExamIdText(a.id), a]).filter(([id]) => id));
    const matchesExamIdentity = function(row) {
        if (wsExamIdText(row.exam_date) !== wsExamIdText(examDate)) return false;
        const rowArchive = normalizeClassroomArchiveFile(row.archive_file || '');
        const assignmentCandidates = assignmentSource.filter(a => {
            const aq = Number(a?.question_count || 0);
            const rq = Number(row?.question_count || 0);
            return wsExamIdText(a.exam_date) === wsExamIdText(row.exam_date) && (!aq || !rq || aq === rq);
        });
        const linkedAssignment = assignmentById.get(wsExamIdText(row.assignment_id)) ||
            (rowArchive
                ? assignmentCandidates.find(a => normalizeClassroomArchiveFile(a.archive_file || '') === rowArchive)
                : (assignmentCandidates.filter(a => normalizeClassroomArchiveFile(a.archive_file || '')).length === 1
                    ? assignmentCandidates.filter(a => normalizeClassroomArchiveFile(a.archive_file || ''))[0]
                    : assignmentCandidates.find(a => wsExamIdText(a.exam_title) === wsExamIdText(row.exam_title))));
        if (linkedAssignment) {
            if (archiveFilter && normalizeClassroomArchiveFile(linkedAssignment.archive_file || '') === archiveFilter) return true;
            if (!archiveFilter && wsExamIdText(linkedAssignment.exam_title) === wsExamIdText(examTitle)) return true;
        }
        if (archiveFilter) {
            if (rowArchive) return rowArchive === archiveFilter;
            return false;
        }
        return wsExamIdText(row.exam_title) === wsExamIdText(examTitle);
    };
    const matchedAssignment = assignmentSource.find(a => {
        if (wsExamIdText(a.exam_date) !== wsExamIdText(examDate)) return false;
        if (archiveFilter) return normalizeClassroomArchiveFile(a.archive_file || '') === archiveFilter;
        return wsExamIdText(a.exam_title) === wsExamIdText(examTitle);
    }) || null;
    const excludedStudentIds = new Set(
        source.exclusions
            .filter(ex => matchedAssignment?.id && wsExamIdText(ex.assignment_id) === wsExamIdText(matchedAssignment.id))
            .map(ex => wsExamIdText(ex.student_id))
            .filter(Boolean)
    );
    const baseActive = (state.db.students || []).filter(s => ids.includes(wsExamIdText(s.id)) && s.status === '재원');
    const active = baseActive.filter(s => !excludedStudentIds.has(wsExamIdText(s.id)));
    const sessions = source.sessions.filter(es => matchesExamIdentity(es) && ids.includes(wsExamIdText(es.student_id)) && !excludedStudentIds.has(wsExamIdText(es.student_id)));
    const sessionByStudent = new Map();
    sessions.forEach(es => { if (!sessionByStudent.has(wsExamIdText(es.student_id))) sessionByStudent.set(wsExamIdText(es.student_id), es); });

    const wrongBySession = new Map();
    source.wrongAnswers.forEach(w => {
        const key = wsExamIdText(w.session_id);
        if (!wrongBySession.has(key)) wrongBySession.set(key, []);
        wrongBySession.get(key).push(w.question_id);
    });

    // 반 명단 순서 그대로 한 표에 둔다(제출·미제출이 섞여 있어도 저장할 때 줄 순서가 바뀌지 않는다).
    const rows = active.map(s => {
        const session = sessionByStudent.get(wsExamIdText(s.id)) || null;
        const wrongs = session
            ? (wrongBySession.get(wsExamIdText(session.id)) || []).slice().sort((a, b) => Number(a) - Number(b))
            : [];
        return { student: s, sid: wsExamIdText(s.id), name: s.name, session, sessionId: session?.id || '', score: session ? (session.score ?? '-') : null, wrongs, pending: !session };
    });
    const submittedCount = rows.filter(r => !r.pending).length;
    const examArchiveFileObj = sessions.find(s => s.archive_file);
    const archiveFile = examArchiveFileObj?.archive_file || matchedAssignment?.archive_file || exam.archiveFile || '';
    const qCount = sessions[0]?.question_count || matchedAssignment?.question_count || exam.qCount || exam.questionCount || 0;
    return {
        classId, exam, rows, sessions, matchedAssignment, archiveFile, qCount,
        submittedCount, pendingCount: rows.length - submittedCount, total: rows.length,
        avg: submittedCount ? Math.round(rows.filter(r => !r.pending).reduce((sum, r) => sum + Number(r.session.score || 0), 0) / submittedCount) : null
    };
}

/** 저장 직후 화면의 자료를 고친다(서버에서 전체를 다시 받지 않는다). 세션 한 줄과 그 오답을 바꿔 넣는다. */
function wsExamApplySavedSession(source, row, wrongIds) {
    const id = wsExamIdText(row.id);
    const idx = source.sessions.findIndex(s => wsExamIdText(s.id) === id);
    if (idx >= 0) source.sessions[idx] = { ...source.sessions[idx], ...row };
    else source.sessions.push(row);
    source.wrongAnswers = source.wrongAnswers.filter(w => wsExamIdText(w.session_id) !== id)
        .concat((wrongIds || []).map(q => ({ session_id: id, question_id: wsExamIdText(q) })));
    return id;
}

/** 앱 전체 자료(state.db)에도 같은 줄을 반영해 반 화면·학생 상세·리포트가 새 점수를 본다. */
function wsExamMirrorSessionToAppState(row, wrongIds) {
    const id = wsExamIdText(row.id);
    const sessions = (state.db.exam_sessions || []).slice();
    const idx = sessions.findIndex(s => wsExamIdText(s.id) === id);
    if (idx >= 0) sessions[idx] = { ...sessions[idx], ...row };
    else sessions.push(row);
    state.db.exam_sessions = sessions;
    state.db.wrong_answers = (state.db.wrong_answers || []).filter(w => wsExamIdText(w.session_id) !== id)
        .concat((wrongIds || []).map(q => ({ session_id: id, question_id: wsExamIdText(q) })));
}

function wsExamRemoveSessionFromAppState(sessionId) {
    const id = wsExamIdText(sessionId);
    state.db.exam_sessions = (state.db.exam_sessions || []).filter(s => wsExamIdText(s.id) !== id);
    state.db.wrong_answers = (state.db.wrong_answers || []).filter(w => wsExamIdText(w.session_id) !== id);
}

/** 반 취약 단원 TOP(통합 전 방식: 이 시험의 세션만 잠깐 앱 자료에 꽂고 계산한 뒤 되돌린다). */
function wsExamWeakUnits(source, detail) {
    if (typeof computeClassWeakUnits !== 'function') return [];
    const prevSessions = state.db.exam_sessions;
    const prevWrongs = state.db.wrong_answers;
    try {
        state.db.exam_sessions = detail.sessions;
        state.db.wrong_answers = source.wrongAnswers;
        return computeClassWeakUnits(source.classId, detail.exam.title, detail.exam.date);
    } finally {
        state.db.exam_sessions = prevSessions;
        state.db.wrong_answers = prevWrongs;
    }
}

/** 점수 계산은 저장 payload(submitOmrResult)와 같은 식이다. */
function wsExamScore(questionCount, wrongCount) {
    const q = Math.max(1, Number(questionCount) || 20);
    return Math.round((q - wrongCount) * (100 / q));
}

/** 다음 미제출 학생: 현재 학생 다음 줄부터 명단 끝까지, 없으면 처음부터. 현재 학생 자신은 제외. */
function wsExamNextPendingStudent(rows, currentSid) {
    const pending = rows.filter(r => r.pending && r.sid !== wsExamIdText(currentSid));
    if (!pending.length) return null;
    const at = rows.findIndex(r => r.sid === wsExamIdText(currentSid));
    if (at < 0) return pending[0];
    return rows.slice(at + 1).find(r => r.pending && r.sid !== wsExamIdText(currentSid)) || pending[0];
}
