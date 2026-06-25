// Phase 1c: classroom ledger, exam, and planner handlers moved from classroom.js without logic changes.

let ledgerState = { date: new Date().toLocaleDateString('sv-SE'), classId: '', attendance: [], homework: [], mode: 'att' };
function handlePlannerDirectFetchAuthStatus(response) {
    if (!response) return false;
    if (response.status === 401) {
        if (typeof handleUnauthorizedResponse === 'function') handleUnauthorizedResponse();
        return true;
    }
    if (response.status === 403) {
        if (typeof toast === 'function') toast('권한이 없습니다. 계정 권한을 확인해 주세요.', 'warn');
        return true;
    }
    return false;
}

async function loadLedger() {
    try {
        const r = await fetch(`${CONFIG.API_BASE}/attendance-history?date=${ledgerState.date}`, { headers: getAuthHeader() });
        if (handlePlannerDirectFetchAuthStatus(r)) return;
        const data = await r.json().catch(() => ({}));
        if (!r.ok || data.success === false) {
            if (typeof toast === 'function') toast(data.message || data.error || '데이터 로드 실패', 'warn');
            return;
        }
        ledgerState.attendance = data.attendance || []; ledgerState.homework = data.homework || []; renderLedgerTable();
    } catch (e) { toast('데이터 로드 실패', 'warn'); }
}

function renderAttendanceLedger() {
    ledgerState.mode = 'att';
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}" ${String(c.id) === String(ledgerState.classId) ? 'selected' : ''}>${c.name}</option>`).join('');
    showModal('출석부', `<div style="display: flex; gap: 12px; flex-direction: column; margin-bottom: 16px; background: var(--surface-2); padding: 12px; border: 1px solid var(--border); border-radius: 16px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="ledger-date" class="cls-input" value="${ledgerState.date}" style="flex: 1.2; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.date=this.value;loadLedger();">
                <select id="ledger-class" class="cls-input" style="flex: 1; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.classId=this.value;renderLedgerTable();"><option value="">전체 학급</option>${classOptions}</select>
            </div>
            <div style="display: flex; gap: 6px; background: var(--surface); padding: 4px; border: 1px solid var(--border); border-radius: 12px;">
                <button id="ledger-mode-att" class="btn cls-v4-ledger-mode-active" style="flex: 1; border: none; font-size: 13px; font-weight:500; border-radius: 12px; min-height: 38px;" onclick="ledgerState.mode='att';renderLedgerTable();">출결 기록</button>
                <button id="ledger-mode-hw" class="btn apms-button apms-button--quiet" style="flex: 1; border: none; font-size: 13px; font-weight:500; border-radius: 12px; min-height: 38px;" onclick="ledgerState.mode='hw';renderLedgerTable();">숙제 기록</button>
            </div>
        </div><div id="ledger-table-wrap" style="max-height: 55vh; overflow-y: auto; padding-right: 4px;"></div>`);
    loadLedger();
}

function renderLedgerTable() {
    const isAtt = ledgerState.mode === 'att';
    const cid = ledgerState.classId;
    const mIds = cid ? state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id)) : state.db.students.map(s => String(s.id));
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;
    const recordMap = {}; records.forEach(r => { if (!r.date || r.date === ledgerState.date) recordMap[r.student_id] = r.status; });

    const rows = stds.map(s => {
        const sCid = cid || state.db.class_students.find(m => String(m.student_id) === String(s.id))?.class_id;
        const isScheduled = sCid ? isClassScheduledOnDate(sCid, ledgerState.date) : true;
        const recStatus = recordMap[s.id];
        const label = isAtt ? getAttendanceStatusLabel(recStatus, isScheduled) : getHomeworkStatusLabel(recStatus, isScheduled);
        const style = isAtt ? getAttendanceStatusStyle(recStatus, isScheduled) : getHomeworkStatusStyle(recStatus, isScheduled);
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:500; color: var(--text); font-size: 14px; line-height: 1.4; text-align: left;">${apEscapeHtml(s.name)}</td>
            <td style="padding: 14px 4px; color: var(--secondary); font-size: 12px; font-weight: 400; line-height: 1.5; text-align: center;">${apEscapeHtml(s.school_name)}</td>
            <td style="padding: 14px 12px; text-align: center; vertical-align: middle;">
                <button class="btn apms-button apms-button--quiet" style="padding: 4px 10px; font-size: 12px; min-width: ${isAtt ? '76px' : '60px'}; font-weight:500; border-radius: 8px; margin: 0 auto; display: flex; align-items: center; justify-content: center; ${style}" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${label}</button>
            </td>
        </tr>`;
    }).join('');
    
    const headerTitle = isAtt ? '출결' : '숙제';
    
    const ledgerWrap = document.getElementById('ledger-table-wrap');
    if (!ledgerWrap) return;
    ledgerWrap.innerHTML = `<div class="card apms-card" style="padding: 8px 0; border-radius: 18px; border: 1px solid var(--border); background: var(--surface); box-shadow: none;">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                <thead><tr style="background: var(--bg); border-bottom: 1px solid var(--border);">
                <th style="width: 30%; padding: 10px 12px; font-size: 12px; color: var(--secondary); font-weight:500; text-align: left;">이름</th>
                <th style="width: 40%; padding: 10px 4px; font-size: 12px; color: var(--secondary); font-weight:500; text-align: center;">학교</th>
                <th style="width: 30%; padding: 10px 12px; font-size: 12px; color: var(--secondary); font-weight:500; text-align: center;">${headerTitle}</th>
                </tr></thead>
                <tbody>${rows || '<tr><td colspan="3" style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:500;">조회 대상 없음</td></tr>'}</tbody>
            </table></div>`;
    const attBtn = document.getElementById('ledger-mode-att');
    const hwBtn = document.getElementById('ledger-mode-hw');
    if (attBtn && hwBtn) {
        attBtn.classList.toggle('cls-v4-ledger-mode-active', isAtt);
        hwBtn.classList.toggle('cls-v4-ledger-mode-active', !isAtt);
    }
}

// ★ 낙관적 업데이트 및 월간 캐시 동기화 적용
async function toggleAtt(sid, date) {
    const today = normalizeClassroomDate(date) || getClassroomOperationDate();
    const isLedger = !!date && !!document.getElementById('ledger-table-wrap');
    const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => String(a.student_id) === String(sid) && a.date === today);
    const hadRecord = !!cur;
    const sCid = state.db.class_students.find(m => String(m.student_id) === String(sid))?.class_id;
    const isScheduled = sCid ? isClassScheduledOnDate(sCid, today) : true;
    const next = getNextAttendanceStatus(cur?.status, isScheduled);
    const prevStatus = cur ? cur.status : undefined;

    if (cur) cur.status = next;
    else list.push({ student_id: sid, date: today, status: next });
    syncClassroomAttendanceStatusToState(sid, today, next);

    if (isLedger) renderLedgerTable();
    else if (state.ui.currentClassId) {
        const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
        if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
    }
    else renderDashboard();

    try {
        const r = await api.patch('attendance', { studentId: sid, status: next, date: today });
        if (!r?.success) throw new Error('fail');
        // 낙관적 업데이트(syncClassroomAttendanceStatusToState)가 state.db/월간캐시/출석부 셀을
        // 이미 row 단위로 갱신했으므로 전체 initial-data 재조회는 하지 않는다.
    } catch (e) {
        if (hadRecord && cur) {
            cur.status = prevStatus;
            syncClassroomAttendanceStatusToState(sid, today, prevStatus || '미기록');
        } else {
            const idx = list.findIndex(a => String(a.student_id) === String(sid) && a.date === today);
            if (idx > -1) list.splice(idx, 1);
            syncClassroomAttendanceStatusToState(sid, today, '미기록');
        }
        if (isLedger) renderLedgerTable();
        else if (state.ui.currentClassId) {
            const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
            if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
        }
        else renderDashboard();
        toast('저장 실패', 'warn');
    }
}

// ★ 낙관적 업데이트 및 월간 캐시 동기화 적용
async function toggleHw(sid, date) {
    const today = normalizeClassroomDate(date) || getClassroomOperationDate();
    const isLedger = !!date && !!document.getElementById('ledger-table-wrap');
    const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => String(h.student_id) === String(sid) && h.date === today);
    const hadRecord = !!cur;
    const sCid = state.db.class_students.find(m => String(m.student_id) === String(sid))?.class_id;
    const isScheduled = sCid ? isClassScheduledOnDate(sCid, today) : true;
    const next = getNextHomeworkStatus(cur?.status, isScheduled);
    const prevStatus = cur ? cur.status : undefined;

    if (cur) cur.status = next;
    else list.push({ student_id: sid, date: today, status: next });
    syncClassroomHomeworkStatusToState(sid, today, next);

    if (isLedger) renderLedgerTable();
    else if (state.ui.currentClassId) {
        const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
        if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
    }
    else renderDashboard();

    try {
        const r = await api.patch('homework', { studentId: sid, status: next, date: today });
        if (!r?.success) throw new Error('fail');
        // 낙관적 업데이트(syncClassroomHomeworkStatusToState)가 state.db/월간캐시/출석부 셀을
        // 이미 row 단위로 갱신했으므로 전체 initial-data 재조회는 하지 않는다.
    } catch (e) {
        if (hadRecord && cur) cur.status = prevStatus;
        else {
            const idx = list.findIndex(h => String(h.student_id) === String(sid) && h.date === today);
            if (idx > -1) list.splice(idx, 1);
        }
        syncClassroomHomeworkStatusToState(sid, today, prevStatus || '미기록');
        if (isLedger) renderLedgerTable();
        else if (state.ui.currentClassId) {
            const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
            if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
        }
        else renderDashboard();
        toast('저장 실패', 'warn');
    }
}

function normalizeClassroomArchiveFile(raw = '') {
    const s = String(raw || '').trim();
    if (!s) return '';
    if (s.startsWith('MIXED:')) return s;
    if (/^https?:\/\//i.test(s)) return s;
    let path = s.replace(/^archive\//, '').replace(/^\.\//, '').replace(/^\/+/, '');
    if (!path) return '';
    if (/^(exams|assets|data)\//.test(path)) return path;
    if (!path.endsWith('.js')) path += '.js';
    return `exams/${path}`;
}

function makeExamListKey(title, date, archiveFile = '') {
    const safeTitle = String(title || '');
    const safeDate = String(date || '');
    const safeArchive = normalizeClassroomArchiveFile(archiveFile || '');
    if (safeArchive) return `${safeDate}||${safeArchive}`;
    return `${safeTitle}||${safeDate}`;
}

function makeExamDetailKey(title, date, archiveFile = '') {
    const safeTitle = String(title || '');
    const safeDate = String(date || '');
    const safeArchive = normalizeClassroomArchiveFile(archiveFile || '');
    if (safeArchive) return `${safeDate}||${safeArchive}`;
    return `${safeTitle}||${safeDate}`;
}

async function openExamGradeView(classId) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId });
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const activeCount = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원').length;
    let sessions = (state.db.exam_sessions || []).filter(es => ids.includes(String(es.student_id)));
    let assignments = [];
    let exclusions = [];
    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) {
            sessions = res.sessions.filter(es => ids.includes(String(es.student_id)));
            const classStudentIdSet = new Set(ids);
            assignments = Array.isArray(res.assignments) ? res.assignments.filter(a => classStudentIdSet.size && String(a.class_id) === String(classId)) : [];
            exclusions = Array.isArray(res.exclusions) ? res.exclusions : [];
        }
    } catch (e) { console.warn('[openExamGradeView] fail', e); }

    const activeCountForAssignment = activeCount || ids.length;
    const exclusionCountByAssignmentId = new Map();
    exclusions.forEach(ex => {
        const assignmentId = String(ex.assignment_id || '');
        const studentId = String(ex.student_id || '');
        if (!assignmentId || !studentId) return;
        if (!exclusionCountByAssignmentId.has(assignmentId)) exclusionCountByAssignmentId.set(assignmentId, new Set());
        exclusionCountByAssignmentId.get(assignmentId).add(studentId);
    });
    const grouped = {};
    const assignmentById = new Map(assignments.map(a => [String(a.id || ''), a]).filter(([id]) => id));
    const isQuestionCountCompatible = function(a, row) {
        const aq = Number(a?.question_count || 0);
        const rq = Number(row?.question_count || 0);
        return !aq || !rq || aq === rq;
    };
    const findMatchingAssignmentForSession = function(session) {
        const byAssignmentId = assignmentById.get(String(session.assignment_id || ''));
        if (byAssignmentId) return byAssignmentId;

        const sessionDate = String(session.exam_date || '');
        const sessionArchive = normalizeClassroomArchiveFile(session.archive_file || '');
        const candidates = assignments.filter(a =>
            String(a.exam_date || '') === sessionDate &&
            isQuestionCountCompatible(a, session)
        );

        if (sessionArchive) {
            return candidates.find(a => normalizeClassroomArchiveFile(a.archive_file || '') === sessionArchive) || null;
        }

        const archivedCandidates = candidates.filter(a => normalizeClassroomArchiveFile(a.archive_file || ''));
        if (archivedCandidates.length === 1) return archivedCandidates[0];

        return candidates.find(a => String(a.exam_title || '') === String(session.exam_title || '')) || null;
    };

    assignments.forEach(a => {
        const key = makeExamListKey(a.exam_title, a.exam_date, a.archive_file || '');
        if (!grouped[key]) grouped[key] = { title: a.exam_title, date: a.exam_date, archiveFile: a.archive_file || '', sessions: [], questionCount: a.question_count || 0, assignment: a };
        else {
            grouped[key].assignment = a;
            if (!grouped[key].questionCount && a.question_count) grouped[key].questionCount = a.question_count;
            if (!grouped[key].archiveFile && a.archive_file) grouped[key].archiveFile = a.archive_file;
        }
    });

    sessions.forEach(s => {
        const matchedAssignment = findMatchingAssignmentForSession(s);
        const resolvedArchiveFile = matchedAssignment?.archive_file || s.archive_file || '';
        const key = makeExamListKey(s.exam_title, s.exam_date, resolvedArchiveFile);
        if (!grouped[key]) grouped[key] = { title: s.exam_title, date: s.exam_date, archiveFile: resolvedArchiveFile, sessions: [], questionCount: s.question_count || matchedAssignment?.question_count || 0, assignment: matchedAssignment || null };
        grouped[key].sessions.push(s);
        if (!grouped[key].questionCount && s.question_count) grouped[key].questionCount = s.question_count;
        if (!grouped[key].archiveFile && resolvedArchiveFile) grouped[key].archiveFile = resolvedArchiveFile;
        if (!grouped[key].assignment && matchedAssignment) grouped[key].assignment = matchedAssignment;
    });

    const exams = Object.values(grouped).sort((a,b) => String(b.date).localeCompare(String(a.date)) || String(b.title).localeCompare(String(a.title)));
    const rows = exams.map(exam => {
        const cnt = exam.sessions.length;
        const qCount = exam.questionCount || exam.sessions[0]?.question_count || exam.assignment?.question_count || 0;
        const avg = cnt ? Math.round(exam.sessions.reduce((sum, s) => sum + Number(s.score || 0), 0) / cnt) : '-';
        const excludedCount = exam.assignment?.id ? (exclusionCountByAssignmentId.get(String(exam.assignment.id))?.size || 0) : 0;
        const targetCount = Math.max(0, activeCountForAssignment - excludedCount);
        const pct = targetCount ? Math.round((cnt / targetCount) * 100) : 0;
        const archiveArg = apJsArg(exam.archiveFile || '');
        return `<div onclick="openExamDetail('${classId}', ${apJsArg(exam.title || '')}, '${exam.date}', ${archiveArg})" style="padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
            <div>
                <div style="font-weight:500; color: var(--text); font-size: 15px; line-height: 1.4;">${exam.title}</div>
                <div style="font-size: 11px; color: var(--secondary); margin-top: 4px; font-weight: 400; line-height: 1.5;">${exam.date} · ${qCount}문항 · 제출 ${cnt}/${targetCount}명 (${pct}%)</div>
            </div>
            <div style="text-align: right; display: flex; align-items: center; gap: 10px;">
                <div>
                    <div style="font-size: 20px; font-weight:500; color: var(--primary); line-height: 1;">${avg}</div>
                    <div style="font-size: 10px; color: var(--secondary); font-weight:500; margin-top:4px;">평균</div>
                </div>
               <button class="btn apms-button apms-button--quiet" onclick="event.stopPropagation(); openExamDetail('${classId}', ${apJsArg(exam.title || '')}, '${exam.date}', ${archiveArg});" style="padding: 7px 10px; font-size: 11px; font-weight:500; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">학생별 입력</button>
            </div>
        </div>`;
    }).join('');

    showModal('원내평가', `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="padding: 8px 14px; font-size: 12px; font-weight:500; border-radius: 12px;" onclick="closeModal(true); if(typeof openOMR==='function') openOMR('', '단원평가', 20, '${classId}', '', '', 'examList');">새 시험 입력</button>
        </div>
        ${rows || `<div style="text-align:center; padding:40px 20px; color:var(--secondary); font-size:13px; font-weight:500;">시험 기록 없음</div>`}
    `);
}

async function openExamDetail(classId, examTitle, examDate, archiveFile = '') {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId });
    let sessionSource = state.db.exam_sessions || [];
    let wrongSource = state.db.wrong_answers || [];
    let assignmentSource = [];
    let exclusionSource = [];

    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) sessionSource = res.sessions;
        if (res && Array.isArray(res.wrong_answers)) wrongSource = res.wrong_answers;
        if (res && Array.isArray(res.assignments)) assignmentSource = res.assignments;
        if (res && Array.isArray(res.exclusions)) exclusionSource = res.exclusions;
    } catch (e) { console.warn('[openExamDetail] fail', e); }

    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const baseActive = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const archiveFilter = normalizeClassroomArchiveFile(archiveFile || '');
    const assignmentById = new Map(assignmentSource.map(a => [String(a.id || ''), a]).filter(([id]) => id));
    const matchesExamIdentity = function(row) {
        if (String(row.exam_date || '') !== String(examDate || '')) return false;
        const rowArchive = normalizeClassroomArchiveFile(row.archive_file || '');
        const assignmentCandidates = assignmentSource.filter(a => {
            const aq = Number(a?.question_count || 0);
            const rq = Number(row?.question_count || 0);
            return String(a.exam_date || '') === String(row.exam_date || '') && (!aq || !rq || aq === rq);
        });
        const linkedAssignment = assignmentById.get(String(row.assignment_id || '')) ||
            (rowArchive
                ? assignmentCandidates.find(a => normalizeClassroomArchiveFile(a.archive_file || '') === rowArchive)
                : (assignmentCandidates.filter(a => normalizeClassroomArchiveFile(a.archive_file || '')).length === 1
                    ? assignmentCandidates.filter(a => normalizeClassroomArchiveFile(a.archive_file || ''))[0]
                    : assignmentCandidates.find(a => String(a.exam_title || '') === String(row.exam_title || ''))));
        if (linkedAssignment) {
            if (archiveFilter && normalizeClassroomArchiveFile(linkedAssignment.archive_file || '') === archiveFilter) return true;
            if (!archiveFilter && String(linkedAssignment.exam_title || '') === String(examTitle || '')) return true;
        }
        if (archiveFilter) {
            if (rowArchive) return rowArchive === archiveFilter;
            return false;
        }
        return String(row.exam_title || '') === String(examTitle || '');
    };
    const matchedAssignment = assignmentSource.find(a => {
        if (String(a.exam_date || '') !== String(examDate || '')) return false;
        if (archiveFilter) return normalizeClassroomArchiveFile(a.archive_file || '') === archiveFilter;
        return String(a.exam_title || '') === String(examTitle || '');
    });
    const excludedStudentIds = new Set(
        (exclusionSource || [])
            .filter(ex => matchedAssignment?.id && String(ex.assignment_id || '') === String(matchedAssignment.id))
            .map(ex => String(ex.student_id || ''))
            .filter(Boolean)
    );
    const active = baseActive.filter(s => !excludedStudentIds.has(String(s.id)));
    const sessions = sessionSource.filter(es => matchesExamIdentity(es) && ids.includes(String(es.student_id)) && !excludedStudentIds.has(String(es.student_id)));

    const sessionsWithArchive = sessions.filter(s => s.archive_file);
    if (sessionsWithArchive.length > 0 && typeof ensureBlueprintsForSessions === 'function') {
        try { await ensureBlueprintsForSessions(sessionsWithArchive); } catch (e) { console.warn(e); }
    } else if (matchedAssignment?.archive_file && typeof ensureBlueprintsForSessions === 'function') {
        try { await ensureBlueprintsForSessions([{ archive_file: matchedAssignment.archive_file, question_count: matchedAssignment.question_count, exam_title: matchedAssignment.exam_title, exam_date: matchedAssignment.exam_date }]); } catch (e) { console.warn(e); }
    }

    const submittedIds = new Set(sessions.map(s => String(s.student_id)));
    const qCount = sessions[0]?.question_count || matchedAssignment?.question_count || 0;

    const prevSessions = state.db.exam_sessions;
    const prevWrongs = state.db.wrong_answers;
    state.db.exam_sessions = sessions;
    state.db.wrong_answers = wrongSource;
    let classWeakUnits = [];
    if (typeof computeClassWeakUnits === 'function') classWeakUnits = computeClassWeakUnits(classId, examTitle, examDate);
    state.db.exam_sessions = prevSessions;
    state.db.wrong_answers = prevWrongs;

    const submitted = active.filter(s => submittedIds.has(String(s.id))).map(s => {
        const sess = sessions.find(es => String(es.student_id) === String(s.id));
        const wrongs = wrongSource.filter(w => String(w.session_id) === String(sess?.id)).map(w => w.question_id).sort((a, b) => Number(a) - Number(b));
        return { ...s, score: sess?.score ?? '-', sessionId: sess?.id, session: sess, wrongs };
    });
    const pending = active.filter(s => !submittedIds.has(String(s.id)));

    const examArchiveFileObj = sessions.find(s => s.archive_file);
    const examArchiveFile = apJsArg(examArchiveFileObj?.archive_file || matchedAssignment?.archive_file || '');
    const assignmentIdArg = apJsArg(matchedAssignment?.id || '');

    const submittedHTML = submitted.map(s => {
        const sArchive = s.session?.archive_file ? apJsArg(s.session.archive_file) : examArchiveFile;
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:500; color: var(--primary); font-size: 14px; line-height: 1.4;">${s.name}</td>
            <td style="text-align: center; font-weight:500; color: var(--text); padding: 14px 4px; font-size: 14px;">${s.score}점</td>
            <td style="padding: 14px 4px;">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${s.wrongs.length ? s.wrongs.map(qid => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(s.session, qid) : `<span style="background: rgba(var(--error-rgb),0.10); color: var(--error); padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight:500; border: 1px solid rgba(var(--error-rgb),0.18);">Q${qid}</span>`).join('') : '<span style="color: var(--secondary); font-size: 11px; font-weight: 400;">없음</span>'}
                </div>
            </td>
            <td style="text-align: right; padding: 14px 12px;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn apms-button apms-button--quiet" style="padding: 4px 10px; font-size: 11px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; font-weight:500; min-height: 32px;" onclick="closeModal(true);openOMR('${s.id}',${apJsArg(examTitle)},${qCount},'${classId}','${s.sessionId || ''}',${sArchive},'examDetail','${examDate}')">수정</button>
                    <button class="btn apms-button apms-button--quiet" style="padding: 4px 10px; font-size: 11px; color: var(--error); border: 1px solid rgba(var(--error-rgb),0.18); background: rgba(var(--error-rgb),0.08); border-radius: 8px; font-weight:500; min-height: 32px;" onclick="deleteExamSession('${s.sessionId || ''}','${classId}',${apJsArg(examTitle)},'${examDate}',${sArchive},'${s.id}',${assignmentIdArg})">삭제</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const pendingHTML = pending.map(s => `<tr style="background-color: var(--bg); border-bottom: 1px solid var(--border);">
        <td style="padding: 14px 12px; color: var(--secondary); font-weight: 500; font-size: 14px;">${s.name}</td>
        <td colspan="2" style="text-align: center; font-size: 12px; color: var(--secondary); font-weight:500; line-height: 1.5;">미제출</td>
        <td style="text-align: right; padding: 14px 12px;">
            <div style="display: flex; gap: 6px; justify-content: flex-end;">
                <button class="btn apms-button apms-button--primary btn-primary" style="padding: 6px 12px; font-size: 11px; font-weight:500; border-radius: 8px; min-height: 32px;" onclick="closeModal(true);openOMR('${s.id}',${apJsArg(examTitle)},${qCount},'${classId}','',${examArchiveFile},'examDetail','${examDate}')">입력</button>
                <button class="btn apms-button apms-button--quiet" style="padding: 4px 10px; font-size: 11px; color: var(--error); border: 1px solid rgba(var(--error-rgb),0.18); background: rgba(var(--error-rgb),0.08); border-radius: 8px; font-weight:500; min-height: 32px;" onclick="deleteExamSession('','${classId}',${apJsArg(examTitle)},'${examDate}',${examArchiveFile},'${s.id}',${assignmentIdArg})">삭제</button>
            </div>
        </td>
    </tr>`).join('');

    const weakUnitHtml = typeof renderWeakUnitSummary === 'function' ? renderWeakUnitSummary(classWeakUnits, '오답 데이터 없음', { clickable: true, mode: 'class', titlePrefix: '반 취약 단원', context: { targetType: 'class', targetId: classId, targetLabel: (state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '반', examTitle, examDate } }) : '';

    showModal(`${examTitle}`, `
        <div style="padding: 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; text-align: center;">
            <div style="font-size: 14px; font-weight:500; color: var(--text); line-height: 1.4;">제출 완료: <span style="color: var(--success);; font-weight:500;">${submitted.length}명</span> / 전체 ${submitted.length + pending.length}명</div>
            <div style="font-size: 11px; font-weight: 400; color: var(--secondary); margin-top: 4px; line-height: 1.5;">${examDate} · ${qCount}문항 기준</div>
        </div>
        <div style="margin-bottom: 24px; border: 1px solid rgba(var(--primary-rgb),0.16); border-radius: 18px; padding: 16px; background: rgba(var(--primary-rgb),0.04);">
            <div style="font-size: 14px; font-weight:500; margin-bottom: 12px; color: var(--primary); line-height: 1.3;">반 취약 단원 TOP</div>
            ${weakUnitHtml}
        </div>
        <div style="margin-bottom: 12px; text-align: right;">
            <button class="btn apms-button apms-button--quiet btn-danger" style="padding: 6px 12px; font-size: 11px; font-weight:500; border-radius: var(--radius-sm);" onclick="deleteExamByClass('${classId}',${apJsArg(examTitle)},'${examDate}',${examArchiveFile})">시험 기록 전체 삭제</button>
        </div>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse; table-layout: fixed;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border); background: var(--bg);">
                    <th style="width: 25%; text-align: left; padding: 10px 12px; color: var(--secondary); font-weight:500; font-size: 12px;">이름</th>
                    <th style="width: 20%; text-align: center; padding: 10px 4px; color: var(--secondary); font-weight:500; font-size: 12px;">점수</th>
                    <th style="width: 35%; text-align: left; padding: 10px 4px; color: var(--secondary); font-weight:500; font-size: 12px;">오답</th>
                    <th style="width: 20%; text-align: right; padding: 10px 12px; color: var(--secondary); font-weight:500; font-size: 12px;">관리</th>
                </tr>
            </thead>
            <tbody>${submittedHTML}${pendingHTML}</tbody>
        </table>
    `);
}

async function deleteExamSession(sessionId, classId, examTitle, examDate, archiveFile = '', studentId = '', assignmentId = '') {
    if (studentId) {
        if (!classId || !examTitle || !examDate) return;
        if (!confirm('이 학생을 이 시험에서 삭제할까요?\n제출 기록이 있으면 오답 기록도 함께 삭제됩니다.')) return;
        try {
            const r = await api.post('class-exam-assignments/exclude-student', {
                class_id: classId,
                student_id: studentId,
                exam_title: examTitle,
                exam_date: examDate,
                archive_file: archiveFile || '',
                assignment_id: assignmentId || ''
            });
            if (!r?.success) { toast('삭제 실패', 'warn'); return; }
            toast('학생을 시험에서 삭제했습니다.', 'info');
            closeModal(true); await refreshDataOnly(); openExamDetail(classId, examTitle, examDate, archiveFile);
        } catch (e) {
            console.warn(e);
            toast('삭제 실패', 'warn');
        }
        return;
    }
    if (!sessionId) return;
    if (!confirm('이 성적 기록을 삭제하시겠습니까? 오답 정보도 함께 삭제됩니다.')) return;
    const r = await api.delete('exam-sessions', sessionId);
    if (!r?.success) { toast('삭제 실패', 'warn'); return; }
    toast('기록이 삭제되었습니다.', 'info');
    closeModal(true); await refreshDataOnly(); openExamDetail(classId, examTitle, examDate, archiveFile);
}

async function deleteExamByClass(classId, examTitle, examDate, archiveFile = '') {
    if (!confirm('이 시험의 제출 기록 전체를 삭제할까요?\n오답 기록도 모두 삭제됩니다.')) return;
    try {
        const archiveQuery = archiveFile ? `&archive=${encodeURIComponent(archiveFile)}` : '';
        const url = `${CONFIG.API_BASE}/exam-sessions/by-exam?class=${encodeURIComponent(classId)}&exam=${encodeURIComponent(examTitle)}&date=${encodeURIComponent(examDate)}${archiveQuery}`;
        const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        if (handlePlannerDirectFetchAuthStatus(r)) return;
        const data = await r.json();
        if (!r.ok || !data.success) { toast('시험 전체삭제 실패', 'warn'); return; }
        toast('시험 전체 기록이 삭제되었습니다.', 'info');
        closeModal(true); await refreshDataOnly(); openExamGradeView(classId);
    } catch (e) { console.warn(e); toast('시험 전체삭제 실패', 'warn'); }
}

// ── 선생님용 반 플래너 확인 ─────────────────────────────────────────────
function isPlannerTargetClass(cls) {
    return !!cls;
}

function getPlannerBaseUrl() {
    const origin = window.location.origin;
    let path = window.location.pathname || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/')) path = path.substring(0, path.lastIndexOf('/') + 1);
    return origin + path + 'planner/';
}

async function copyPlannerStudentLink(studentId) {
    const url = `${getPlannerBaseUrl()}?student_id=${encodeURIComponent(studentId)}`;
    try {
        await navigator.clipboard.writeText(url);
        toast('플래너 링크가 복사되었습니다.', 'info');
    } catch (e) {
        showModal('플래너 링크', `
            <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:8px;">아래 링크를 복사하세요. PIN은 포함되지 않습니다.</div>
            <div style="word-break:break-all; background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:12px; font-size:13px; font-weight:500; color:var(--text);">${apEscapeHtml(url)}</div>
        `);
    }
}

async function loadPlannerOverview(classId, date) {
    if (api.getPlannerOverview) return api.getPlannerOverview(classId, date);
    return api.get(`planner/overview?class_id=${encodeURIComponent(classId)}&date=${encodeURIComponent(date)}`);
}

function getClassPlannerToday() {
    try {
        return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
    } catch (e) {
        return new Date().toLocaleDateString('sv-SE');
    }
}

function parseClassPlannerDate(dateStr) {
    const safe = String(dateStr || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(safe)) return null;
    const date = new Date(`${safe}T00:00:00`);
    if (!Number.isFinite(date.getTime())) return null;
    return date;
}

function addClassPlannerDays(dateStr, days) {
    const base = parseClassPlannerDate(dateStr) || parseClassPlannerDate(getClassPlannerToday());
    if (!base) return getClassPlannerToday();
    base.setDate(base.getDate() + Number(days || 0));
    return base.toLocaleDateString('sv-SE');
}

function getClassPlannerWeekStart(dateStr) {
    const base = parseClassPlannerDate(dateStr) || parseClassPlannerDate(getClassPlannerToday());
    if (!base) return getClassPlannerToday();
    const day = base.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    return addClassPlannerDays(base.toLocaleDateString('sv-SE'), offset);
}

function getClassPlannerWeekDates(weekStart) {
    return Array.from({ length: 7 }, (_, idx) => addClassPlannerDays(weekStart, idx));
}

function getClassPlannerDayName(dateStr, longLabel = false) {
    const date = parseClassPlannerDate(dateStr) || parseClassPlannerDate(getClassPlannerToday());
    const shortNames = ['일', '월', '화', '수', '목', '금', '토'];
    const longNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const index = date ? date.getDay() : 0;
    return longLabel ? longNames[index] : shortNames[index];
}

function formatClassPlannerDayLabel(dateStr) {
    return `${getClassPlannerDayName(dateStr)} ${String(dateStr || '').slice(5)}`;
}

function renderClassPlannerDayTabLabel(dateStr) {
    return `
        <span class="cls-planner-tab-day">${apEscapeHtml(getClassPlannerDayName(dateStr))}</span>
        <span class="cls-planner-tab-date">${apEscapeHtml(String(dateStr || '').slice(5))}</span>
    `;
}

function injectClassPlannerReviewStyles() {
    if (document.getElementById('class-planner-review-style')) return;
    const style = document.createElement('style');
    style.id = 'class-planner-review-style';
    style.textContent = `
        .class-planner-review {
            display: flex;
            flex-direction: column;
            gap: 14px;
            color: var(--text);
        }
        .class-planner-review .cls-planner-hero,
        .class-planner-review .cls-planner-nav,
        .class-planner-review .cls-planner-mode-tabs,
        .class-planner-review .cls-planner-day-tabs,
        .class-planner-review .cls-planner-list,
        .class-planner-review .cls-planner-week-wrap {
            width: 100%;
            box-sizing: border-box;
        }
        .class-planner-review .cls-planner-hero {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 18px;
            border: 1px solid var(--border);
            border-radius: 20px;
            background:
                linear-gradient(180deg, var(--primary-soft), rgba(var(--primary-rgb),0.04)),
                var(--surface);
        }
        .class-planner-review .cls-planner-hero-title {
            font-size: 18px;
            font-weight:500;
            line-height: 1.3;
        }
        .class-planner-review .cls-planner-hero-sub {
            margin-top: 4px;
            font-size: 12px;
            font-weight:500;
            color: var(--secondary);
        }
        .class-planner-review .cls-planner-nav,
        .class-planner-review .cls-planner-mode-tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .class-planner-review .cls-planner-day-tabs {
            display: flex;
            gap: 6px;
            overflow-x: auto;
            padding-bottom: 2px;
            scrollbar-width: thin;
        }
        .class-planner-review .cls-planner-btn {
            appearance: none;
            border: 1px solid var(--border);
            border-radius: 12px;
            min-height: 38px;
            padding: 9px 14px;
            background: var(--surface);
            color: var(--text);
            font-size: 12px;
            font-weight:500;
            line-height: 1.2;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            white-space: nowrap;
            cursor: pointer;
            transition: background .16s ease, border-color .16s ease, color .16s ease, box-shadow .16s ease, transform .16s ease;
            box-shadow: 0 1px 0 rgba(15, 23, 42, 0.02);
        }
        .class-planner-review .cls-planner-btn:hover {
            border-color: rgba(var(--primary-rgb),0.24);
            background: var(--primary-soft);
        }
        .class-planner-review .cls-planner-btn.active {
            background: var(--primary);
            border-color: var(--primary);
            color: #fff;
            box-shadow: 0 10px 24px rgba(var(--primary-rgb),0.20);
        }
        .class-planner-review .cls-planner-day-tabs .cls-planner-btn {
            flex: 0 0 auto;
            min-width: 72px;
            min-height: 40px;
            padding: 8px 12px;
            flex-direction: column;
            align-items: flex-start;
        }
        .class-planner-review .cls-planner-tab-day,
        .class-planner-review .cls-planner-tab-date {
            display: block;
        }
        .class-planner-review .cls-planner-tab-day {
            font-size: 11px;
            font-weight:500;
            opacity: 0.78;
        }
        .class-planner-review .cls-planner-tab-date {
            font-size: 13px;
            font-weight:500;
        }
        .class-planner-review .cls-planner-list {
            display: grid;
            gap: 10px;
        }
        .class-planner-review .cls-planner-date-title {
            padding: 0 4px;
            font-size: 12px;
            font-weight:500;
            color: var(--secondary);
        }
        .class-planner-review .cls-planner-student-card {
            padding: 14px;
            border: 1px solid var(--border);
            border-radius: 16px;
            background: var(--surface);
            box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }
        .class-planner-review .cls-planner-student-name {
            margin-bottom: 10px;
            font-size: 14px;
            font-weight:500;
            color: var(--text);
        }
        .class-planner-review .cls-planner-plan-list,
        .class-planner-review .cls-planner-cell-list {
            display: grid;
            gap: 8px;
        }
        .class-planner-review .cls-planner-plan-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 12px;
            border-radius: 14px;
            background: var(--surface-2);
            border: 1px solid var(--primary-soft);
        }
        .class-planner-review .cls-planner-plan-item.done {
            opacity: 0.7;
        }
        .class-planner-review .cls-planner-plan-mark {
            flex: 0 0 22px;
            width: 22px;
            height: 22px;
            border-radius: 8px;
            background: var(--primary-soft);
            color: var(--primary);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight:500;
        }
        .class-planner-review .cls-planner-plan-item.done .cls-planner-plan-mark {
            background: var(--primary);
            color: #fff;
        }
        .class-planner-review .cls-planner-plan-main {
            min-width: 0;
            flex: 1;
        }
        .class-planner-review .cls-planner-plan-title {
            font-size: 13px;
            font-weight:500;
            line-height: 1.45;
            word-break: break-word;
        }
        .class-planner-review .cls-planner-plan-meta {
            margin-top: 4px;
        }
        .class-planner-review .cls-planner-subject {
            display: inline-flex;
            align-items: center;
            min-height: 24px;
            padding: 0 8px;
            border-radius: 999px;
            background: var(--primary-soft);
            color: var(--primary);
            font-size: 11px;
            font-weight:500;
        }
        .class-planner-review .cls-planner-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
        }
        .class-planner-review .cls-planner-badge {
            min-height: 26px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 0 9px;
            border-radius: 999px;
            border: 1px solid var(--border);
            background: var(--surface);
            color: var(--secondary);
            font-size: 11px;
            font-weight: 500;
            line-height: 1;
            white-space: nowrap;
        }
        .class-planner-review .cls-planner-badge svg,
        .class-planner-review .cls-planner-plan-mark svg,
        .class-planner-review .cls-planner-cell-item svg {
            width: 15px;
            height: 15px;
            stroke: currentColor;
            stroke-width: 2;
            fill: none;
            stroke-linecap: round;
            stroke-linejoin: round;
            flex: 0 0 auto;
        }
        .class-planner-review .cls-planner-badge--focus {
            border-color: rgba(0,184,148,.24);
            background: rgba(0,184,148,.09);
            color: #047857;
        }
        .class-planner-review .cls-planner-badge--rest {
            border-color: rgba(245,159,0,.28);
            background: rgba(245,159,0,.10);
            color: #B45309;
        }
        .class-planner-review .cls-planner-badge--done {
            border-color: rgba(var(--primary-rgb),.26);
            background: var(--primary-soft);
            color: var(--primary);
        }
        .class-planner-review .cls-planner-badge--snapshot {
            border-color: rgba(51,65,85,.16);
            background: rgba(51,65,85,.06);
            color: #475569;
        }
        .class-planner-review .cls-planner-badge--question,
        .class-planner-review .cls-planner-badge--reply {
            border-color: rgba(99,102,241,.24);
            background: rgba(99,102,241,.08);
            color: #4F46E5;
        }
        .class-planner-review .cls-planner-student-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
        }
        .class-planner-review .cls-planner-student-head .cls-planner-student-name {
            margin-bottom: 0;
        }
        .class-planner-review .cls-planner-live-summary {
            justify-content: flex-end;
            margin-top: 0;
        }
        .class-planner-review .cls-planner-empty,
        .class-planner-review .cls-planner-cell-empty {
            font-size: 12px;
            font-weight:500;
            color: var(--secondary);
        }
        .class-planner-review .cls-planner-empty {
            padding: 2px 0;
        }
        .class-planner-review .cls-planner-week-wrap {
            overflow-x: auto;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: var(--surface);
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
        }
        .class-planner-review .cls-planner-week-table {
            width: 100%;
            min-width: 860px;
            border-collapse: separate;
            border-spacing: 0;
        }
        .class-planner-review .cls-planner-week-table thead th {
            padding: 12px 10px;
            border-bottom: 1px solid var(--border);
            background: var(--surface-2);
            font-size: 12px;
            font-weight:500;
            color: var(--secondary);
            text-align: left;
            vertical-align: bottom;
        }
        .class-planner-review .cls-planner-week-table tbody td {
            padding: 12px 10px;
            border-bottom: 1px solid rgba(15,23,42,0.06);
            vertical-align: top;
        }
        .class-planner-review .cls-planner-week-table tbody tr:last-child td {
            border-bottom: none;
        }
        .class-planner-review .cls-planner-week-student {
            min-width: 92px;
            font-size: 13px;
            font-weight:500;
        }
        .class-planner-review .cls-planner-discharged-row .cls-planner-week-student {
            color: rgba(100, 116, 139, 0.38);
            font-weight: 500;
        }
        .class-planner-review .cls-planner-week-head-day,
        .class-planner-review .cls-planner-week-head-date {
            display: block;
        }
        .class-planner-review .cls-planner-week-head-day {
            font-size: 11px;
            font-weight:500;
            color: var(--secondary);
        }
        .class-planner-review .cls-planner-week-head-date {
            margin-top: 2px;
            font-size: 13px;
            font-weight:500;
            color: var(--text);
        }
        .class-planner-review .cls-planner-cell-item {
            display: flex;
            align-items: flex-start;
            gap: 5px;
            padding: 8px 10px;
            border-radius: 12px;
            background: var(--surface-2);
            border: 1px solid var(--primary-soft);
            font-size: 12px;
            font-weight:500;
            line-height: 1.45;
            color: var(--text);
            word-break: break-word;
        }
        .class-planner-review .cls-planner-cell-item.done {
            opacity: 0.68;
        }
        .modal-overlay:has(.class-planner-review) .modal-content,
        #modal-overlay:has(.class-planner-review) .modal-content,
        .ap-modal-overlay:has(.class-planner-review) .modal-content,
        .modal:has(.class-planner-review) .modal-content {
            width: min(1080px, calc(100vw - 32px)) !important;
            max-width: min(1080px, calc(100vw - 32px)) !important;
        }
        .modal-overlay:has(.class-planner-review) #modal-body,
        #modal-overlay:has(.class-planner-review) #modal-body,
        .modal:has(.class-planner-review) #modal-body {
            max-height: min(78vh, 860px) !important;
            overflow: auto !important;
        }
        .class-planner-review .cls-planner-month-wrap {
            overflow-x: auto;
            border: 1px solid var(--border);
            border-radius: 18px;
            background: var(--surface);
            box-shadow: 0 12px 28px rgba(15, 23, 42, 0.05);
        }
        .class-planner-review .cls-planner-month-table {
            width: max-content;
            min-width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }
        .class-planner-review .cls-planner-month-table thead th {
            position: sticky;
            top: 0;
            z-index: 2;
            padding: 10px 8px;
            border-bottom: 1px solid var(--border);
            border-right: 1px solid rgba(15,23,42,0.05);
            background: var(--surface-2);
            font-size: 11px;
            font-weight:500;
            color: var(--secondary);
            text-align: left;
            vertical-align: bottom;
            min-width: 126px;
        }
        .class-planner-review .cls-planner-month-table tbody td {
            padding: 10px 8px;
            min-width: 126px;
            max-width: 190px;
            border-bottom: 1px solid rgba(15,23,42,0.06);
            border-right: 1px solid rgba(15,23,42,0.05);
            vertical-align: top;
        }
        .class-planner-review .cls-planner-month-table thead th:first-child,
        .class-planner-review .cls-planner-month-table tbody td:first-child {
            position: sticky;
            left: 0;
            z-index: 3;
            min-width: 100px;
            max-width: 120px;
            background: var(--surface);
            border-right: 2px solid var(--border);
        }
        .class-planner-review .cls-planner-month-table thead th:first-child {
            z-index: 4;
            background: var(--surface-2);
        }
        .class-planner-review .cls-planner-month-head-day,
        .class-planner-review .cls-planner-month-head-date {
            display: block;
        }
        .class-planner-review .cls-planner-month-head-day {
            font-size: 10px;
            font-weight:500;
            color: var(--secondary);
        }
        .class-planner-review .cls-planner-month-head-date {
            margin-top: 2px;
            font-size: 12px;
            font-weight:500;
            color: var(--text);
        }
        .class-planner-review #planner-control-body {
            min-height: 180px;
        }
        @media (min-width: 701px) {
            .class-planner-review .cls-planner-mode-tabs {
                display: flex !important;
            }
            .class-planner-review .cls-planner-week-wrap {
                display: block !important;
            }
        }
        @media (max-width: 700px) {
            .class-planner-review {
                gap: 12px;
            }
            .class-planner-review .cls-planner-mode-tabs {
                display: none !important;
            }
            .class-planner-review .cls-planner-hero {
                padding: 16px;
                align-items: flex-start;
                flex-direction: column;
            }
            .class-planner-review .cls-planner-hero .cls-planner-btn,
            .class-planner-review .cls-planner-nav .cls-planner-btn,
            .class-planner-review .cls-planner-mode-tabs .cls-planner-btn {
                flex: 1 1 calc(50% - 4px);
            }
            .class-planner-review .cls-planner-nav {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            .class-planner-review .cls-planner-nav .cls-planner-btn:first-child {
                grid-column: span 2;
            }
            .class-planner-review .cls-planner-day-tabs .cls-planner-btn {
                min-width: 68px;
            }
            .class-planner-review .cls-planner-week-wrap {
                margin-right: -2px;
            }
        }
    `;
    document.head.appendChild(style);
}

function getClassPlannerPlanDate(plan) {
    return String(plan?.plan_date || plan?.date || plan?.feedback_date || '').slice(0, 10);
}

function getClassPlannerPlanTitle(plan) {
    return String(plan?.title || plan?.content || plan?.plan_title || '').trim();
}

function getClassPlannerPlanSubject(plan) {
    return String(plan?.subject || '').trim();
}

function isClassPlannerDone(plan) {
    return Number(plan?.is_done || plan?.done || 0) === 1;
}

const classPlannerLiveUi = {
    icon(type) {
        const icons = {
            focus: '<path d="M12 3v3"></path><path d="M12 18v3"></path><path d="M3 12h3"></path><path d="M18 12h3"></path><circle cx="12" cy="12" r="4"></circle>',
            rest: '<path d="M17 8h1a3 3 0 0 1 0 6h-1"></path><path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"></path><path d="M6 2v2"></path><path d="M10 2v2"></path><path d="M14 2v2"></path>',
            done: '<path d="M20 6 9 17l-5-5"></path>',
            snapshot: '<path d="M4 7h3l2-2h6l2 2h3v12H4Z"></path><circle cx="12" cy="13" r="3"></circle>',
            question: '<path d="M9.1 9a3 3 0 1 1 5.4 1.8c-.9.6-1.5 1.1-1.5 2.2"></path><path d="M12 17h.01"></path><circle cx="12" cy="12" r="10"></circle>',
            reply: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path>'
        };
        return `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[type] || icons.focus}</svg>`;
    },

    badge(type, label) {
        return `<span class="cls-planner-badge cls-planner-badge--${type}">${this.icon(type)}<span>${apEscapeHtml(label)}</span></span>`;
    },

    optionalBadge(type, label, count) {
        return Number(count || 0) > 0 ? this.badge(type, label) : '';
    },

    count(plan, keys) {
        for (const key of keys) {
            const n = Number(plan && plan[key]);
            if (Number.isFinite(n) && n > 0) return n;
        }
        return 0;
    },

    summarize(plans) {
        const list = Array.isArray(plans) ? plans : [];
        const done = list.filter(isClassPlannerDone).length;
        return list.reduce((summary, plan) => {
            summary.snapshots += this.count(plan, ['snapshot_count', 'photo_count', 'photos_count', 'attachment_count']);
            summary.questions += this.count(plan, ['question_count', 'questions_count']);
            summary.replies += this.count(plan, ['reply_count', 'replies_count']);
            return summary;
        }, { total: list.length, done, snapshots: 0, questions: 0, replies: 0 });
    },

    badges(plans, extraClass = '') {
        const summary = this.summarize(plans);
        const statusType = summary.total && summary.done === summary.total ? 'done' : summary.total ? 'focus' : 'rest';
        const statusLabel = summary.total && summary.done === summary.total
            ? `완료 ${summary.done}/${summary.total}`
            : summary.total
                ? `진행 ${summary.done}/${summary.total}`
                : '미시작';
        const className = `cls-planner-badges${extraClass ? ` ${extraClass}` : ''}`;
        return `
            <div class="${className}">
                ${this.badge(statusType, statusLabel)}
                ${this.optionalBadge('snapshot', '스냅샷', summary.snapshots)}
                ${this.optionalBadge('question', `질문 ${summary.questions}`, summary.questions)}
                ${this.optionalBadge('reply', `답변 ${summary.replies}`, summary.replies)}
            </div>
        `;
    }
};

function ensureClassPlannerState() {
    if (!state.ui) state.ui = {};
    const today = getClassPlannerToday();
    if (!state.ui.classPlannerMode) state.ui.classPlannerMode = 'day';
    if (typeof window !== 'undefined' && window.innerWidth <= 700) state.ui.classPlannerMode = 'day';
    if (!state.ui.classPlannerSelectedDate) state.ui.classPlannerSelectedDate = today;
    if (!state.ui.classPlannerWeekStart) state.ui.classPlannerWeekStart = getClassPlannerWeekStart(state.ui.classPlannerSelectedDate);
    if (!state.ui.classPlannerWeekCache || typeof state.ui.classPlannerWeekCache !== 'object') state.ui.classPlannerWeekCache = {};
    if (!state.ui.classPlannerMonthCache || typeof state.ui.classPlannerMonthCache !== 'object') state.ui.classPlannerMonthCache = {};
    if (window.innerWidth <= 700) state.ui.classPlannerMode = 'day';
    const dates = getClassPlannerWeekDates(state.ui.classPlannerWeekStart);
    if (!dates.includes(state.ui.classPlannerSelectedDate)) {
        state.ui.classPlannerSelectedDate = dates.includes(today) ? today : dates[0];
    }
}

function buildClassPlannerWeekCacheKey(classId, weekStart) {
    return `${String(classId || '')}::${String(weekStart || '')}`;
}

async function loadClassPlannerStudentRange(studentId, from, to) {
    return api.getPlannerStudentPlans
        ? api.getPlannerStudentPlans(studentId, from, to)
        : api.get(`planner?student_id=${encodeURIComponent(studentId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

async function loadClassPlannerWeek(classId, weekStart, force = false) {
    ensureClassPlannerState();
    const cacheKey = buildClassPlannerWeekCacheKey(classId, weekStart);
    if (!force && state.ui.classPlannerWeekCache[cacheKey]) return state.ui.classPlannerWeekCache[cacheKey];

    const safeMonthStart = getClassPlannerMonthStart(weekStart);
    const students = getClassroomMonthlyPlannerStudents(classId, safeMonthStart);
    const dates = getClassPlannerWeekDates(weekStart);
    const from = dates[0];
    const to = dates[dates.length - 1];

    const studentWeeks = await Promise.all(students.map(async student => {
        const byDate = {};
        dates.forEach(date => { byDate[date] = []; });
        try {
            const data = await loadClassPlannerStudentRange(student.id, from, to);
            const plans = Array.isArray(data?.plans) ? data.plans : [];
            plans.forEach(plan => {
                const date = getClassPlannerPlanDate(plan);
                if (!byDate[date]) return;
                byDate[date].push(plan);
            });
        } catch (e) {
            console.error('[loadClassPlannerWeek] student load failed:', student.id, e);
        }
        dates.forEach(date => {
            byDate[date].sort((a, b) => {
                const at = String(a.sort_order ?? a.created_at ?? a.id ?? '');
                const bt = String(b.sort_order ?? b.created_at ?? b.id ?? '');
                return at.localeCompare(bt);
            });
        });
        return { student, plansByDate: byDate };
    }));

    const weekData = { classId, weekStart, dates, students: studentWeeks };
    state.ui.classPlannerWeekCache[cacheKey] = weekData;
    return weekData;
}

function getClassPlannerMonthStart(dateStr) {
    const safe = normalizeClassroomDate(dateStr) || getClassPlannerToday();
    return `${safe.slice(0, 7)}-01`;
}

function getClassPlannerMonthDates(monthStart) {
    const start = parseClassPlannerDate(monthStart) || parseClassPlannerDate(getClassPlannerMonthStart(getClassPlannerToday()));
    const year = start.getFullYear();
    const month = start.getMonth();
    const last = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: last }, (_, idx) => new Date(year, month, idx + 1).toLocaleDateString('sv-SE'));
}

function buildClassPlannerMonthCacheKey(classId, monthStart) {
    return `${String(classId || '')}::${String(monthStart || '')}`;
}

async function loadClassPlannerMonth(classId, monthStart, force = false) {
    ensureClassPlannerState();
    const safeMonthStart = getClassPlannerMonthStart(monthStart);
    const cacheKey = buildClassPlannerMonthCacheKey(classId, safeMonthStart);
    if (!force && state.ui.classPlannerMonthCache[cacheKey]) return state.ui.classPlannerMonthCache[cacheKey];

    const students = getClassroomActiveStudents(classId);
    const dates = getClassPlannerMonthDates(safeMonthStart);
    const from = dates[0];
    const to = dates[dates.length - 1];

    const studentMonths = await Promise.all(students.map(async student => {
        const byDate = {};
        dates.forEach(date => { byDate[date] = []; });
        try {
            const data = await loadClassPlannerStudentRange(student.id, from, to);
            const plans = Array.isArray(data?.plans) ? data.plans : [];
            plans.forEach(plan => {
                const date = getClassPlannerPlanDate(plan);
                if (!byDate[date]) return;
                byDate[date].push(plan);
            });
        } catch (e) {
            console.error('[loadClassPlannerMonth] student load failed:', student.id, e);
        }
        dates.forEach(date => {
            byDate[date].sort((a, b) => {
                const at = String(a.sort_order ?? a.created_at ?? a.id ?? '');
                const bt = String(b.sort_order ?? b.created_at ?? b.id ?? '');
                return at.localeCompare(bt);
            });
        });
        return { student, plansByDate: byDate };
    }));

    const monthData = { classId, monthStart: safeMonthStart, dates, students: studentMonths };
    state.ui.classPlannerMonthCache[cacheKey] = monthData;
    return monthData;
}

function renderClassPlannerMonthTable(classId, monthStart, monthData) {
    const dates = Array.isArray(monthData?.dates) ? monthData.dates : getClassPlannerMonthDates(monthStart);
    const students = Array.isArray(monthData?.students) ? monthData.students : [];
    if (!students.length) return `<div class="cls-planner-empty">조회 대상 학생이 없습니다.</div>`;
    return `
        <div class="cls-planner-month-wrap">
            <table class="cls-planner-month-table">
                <thead>
                    <tr>
                        <th>학생</th>
                        ${dates.map(date => `
                            <th>
                                <span class="cls-planner-month-head-day">${apEscapeHtml(getClassPlannerDayName(date))}</span>
                                <span class="cls-planner-month-head-date">${apEscapeHtml(String(date || '').slice(5))}</span>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${students.map(row => `
                        <tr class="${row.student?.isPlannerDischarged ? 'cls-planner-discharged-row' : ''}">
                            <td class="cls-planner-week-student">${apEscapeHtml(row.student?.name || '학생')}</td>
                            ${dates.map(date => `<td>${renderClassPlannerWeekCell(row.plansByDate?.[date] || [])}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderClassPlannerStudentPlanList(plans) {
    const list = Array.isArray(plans) ? plans : [];
    if (!list.length) return `<div class="cls-planner-empty">등록된 계획 없음</div>`;
    return `
        <div class="cls-planner-plan-list">
            ${list.map(plan => {
                const done = isClassPlannerDone(plan);
                const subject = getClassPlannerPlanSubject(plan);
                const title = getClassPlannerPlanTitle(plan);
                return `
                    <div class="cls-planner-plan-item ${done ? 'done' : ''}">
                        <div class="cls-planner-plan-mark">${done ? classPlannerLiveUi.icon('done') : classPlannerLiveUi.icon('focus')}</div>
                        <div class="cls-planner-plan-main">
                            <div class="cls-planner-plan-title">${apEscapeHtml(title || '제목 없음')}</div>
                            ${subject ? `<div class="cls-planner-plan-meta"><span class="cls-planner-subject">${apEscapeHtml(subject)}</span></div>` : ''}
                            <div class="cls-planner-badges">
                                ${done ? classPlannerLiveUi.badge('done', '완료') : classPlannerLiveUi.badge('focus', '대기')}
                                ${classPlannerLiveUi.optionalBadge('snapshot', '스냅샷', classPlannerLiveUi.count(plan, ['snapshot_count', 'photo_count', 'photos_count', 'attachment_count']))}
                                ${classPlannerLiveUi.optionalBadge('question', `질문 ${classPlannerLiveUi.count(plan, ['question_count', 'questions_count'])}`, classPlannerLiveUi.count(plan, ['question_count', 'questions_count']))}
                                ${classPlannerLiveUi.optionalBadge('reply', `답변 ${classPlannerLiveUi.count(plan, ['reply_count', 'replies_count'])}`, classPlannerLiveUi.count(plan, ['reply_count', 'replies_count']))}
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderClassPlannerDayList(classId, date, weekData) {
    const students = Array.isArray(weekData?.students) ? weekData.students : [];
    if (!students.length) return `<div class="cls-planner-empty">조회 대상 학생이 없습니다.</div>`;
    return `
        <div class="cls-planner-list">
            <div class="cls-planner-date-title">${apEscapeHtml(getClassPlannerDayName(date, true))} ${apEscapeHtml(date)}</div>
            ${students.map(row => `
                <div class="cls-planner-student-card">
                    <div class="cls-planner-student-head">
                        <div class="cls-planner-student-name">${apEscapeHtml(row.student?.name || '학생')}</div>
                        ${classPlannerLiveUi.badges(row.plansByDate?.[date] || [], 'cls-planner-live-summary')}
                    </div>
                    ${renderClassPlannerStudentPlanList(row.plansByDate?.[date] || [])}
                </div>
            `).join('')}
        </div>
    `;
}

function renderClassPlannerWeekCell(plans) {
    const list = Array.isArray(plans) ? plans : [];
    if (!list.length) return `<div class="cls-planner-cell-empty">없음</div>`;
    return `
        <div class="cls-planner-cell-list">
            ${list.map(plan => {
                const done = isClassPlannerDone(plan);
                const subject = getClassPlannerPlanSubject(plan);
                const title = getClassPlannerPlanTitle(plan) || '제목 없음';
                const text = subject ? `${subject} · ${title}` : title;
                return `<div class="cls-planner-cell-item ${done ? 'done' : ''}">${done ? classPlannerLiveUi.icon('done') : ''}${apEscapeHtml(text)}</div>`;
            }).join('')}
        </div>
    `;
}

function renderClassPlannerWeekTable(classId, weekStart, weekData) {
    const dates = Array.isArray(weekData?.dates) ? weekData.dates : getClassPlannerWeekDates(weekStart);
    const students = Array.isArray(weekData?.students) ? weekData.students : [];
    if (!students.length) return `<div class="cls-planner-empty">조회 대상 학생이 없습니다.</div>`;
    return `
        <div class="cls-planner-week-wrap">
            <table class="cls-planner-week-table">
                <thead>
                    <tr>
                        <th>학생</th>
                        ${dates.map(date => `
                            <th>
                                <span class="cls-planner-week-head-day">${apEscapeHtml(getClassPlannerDayName(date))}</span>
                                <span class="cls-planner-week-head-date">${apEscapeHtml(String(date || '').slice(5))}</span>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${students.map(row => `
                        <tr>
                            <td class="cls-planner-week-student">${apEscapeHtml(row.student?.name || '학생')}</td>
                            ${dates.map(date => `<td>${renderClassPlannerWeekCell(row.plansByDate?.[date] || [])}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderClassPlannerModeTabs(classId) {
    if (typeof window !== 'undefined' && window.innerWidth <= 700) return '';
    const mode = state.ui.classPlannerMode || 'day';
    return `
        <div class="cls-planner-mode-tabs" data-class-planner-pc-mode-tabs="1">
            <button class="cls-planner-btn ${mode === 'day' ? 'active' : ''}" onclick="setClassPlannerMode('${classId}', 'day')">요일별</button>
            <button class="cls-planner-btn ${mode === 'week' ? 'active' : ''}" onclick="setClassPlannerMode('${classId}', 'week')">주간별</button>
            <button class="cls-planner-btn ${mode === 'month' ? 'active' : ''}" onclick="setClassPlannerMode('${classId}', 'month')">월간별</button>
        </div>
    `;
}

function renderClassPlannerDayTabs(classId, weekStart, selectedDate) {
    const dates = getClassPlannerWeekDates(weekStart);
    return `
        <div class="cls-planner-day-tabs">
            ${dates.map(date => `
                <button class="cls-planner-btn ${String(selectedDate) === String(date) ? 'active' : ''}" onclick="setClassPlannerSelectedDate('${classId}', '${date}')">
                    ${renderClassPlannerDayTabLabel(date)}
                </button>
            `).join('')}
        </div>
    `;
}

function renderClassPlannerContent(classId, periodData) {
    const mode = window.innerWidth <= 700 ? 'day' : (state.ui.classPlannerMode || 'day');
    const date = state.ui.classPlannerSelectedDate;
    if (mode === 'month') return renderClassPlannerMonthTable(classId, getClassPlannerMonthStart(date), periodData);
    if (mode === 'week') return renderClassPlannerWeekTable(classId, state.ui.classPlannerWeekStart, periodData);
    return renderClassPlannerDayList(classId, date, periodData);
}

function renderClassPlannerPeriodNav(classId) {
    const mode = window.innerWidth <= 700 ? 'day' : (state.ui.classPlannerMode || 'day');
    if (mode === 'month') {
        return `
            <div class="cls-planner-nav">
                <button class="cls-planner-btn" onclick="moveClassPlannerMonth('${classId}', -1)">지난 달</button>
                <button class="cls-planner-btn" onclick="resetClassPlannerMonth('${classId}')">이번 달</button>
                <button class="cls-planner-btn" onclick="moveClassPlannerMonth('${classId}', 1)">다음 달</button>
            </div>
        `;
    }
    return `
        <div class="cls-planner-nav">
            <button class="cls-planner-btn" onclick="moveClassPlannerWeek('${classId}', -1)">지난 주</button>
            <button class="cls-planner-btn" onclick="resetClassPlannerWeek('${classId}')">이번 주</button>
            <button class="cls-planner-btn" onclick="moveClassPlannerWeek('${classId}', 1)">다음 주</button>
        </div>
    `;
}

function expandClassPlannerModalForPc() {
    const body = document.getElementById('modal-body');
    if (!body) return;
    const content = body.closest('.modal-content') || body.parentElement;
    if (!content) return;
    if (typeof window !== 'undefined' && window.innerWidth > 700) {
        content.style.width = 'min(1080px, calc(100vw - 32px))';
        content.style.maxWidth = 'min(1080px, calc(100vw - 32px))';
        body.style.maxHeight = 'min(78vh, 860px)';
        body.style.overflow = 'auto';
    }
}

function renderPlannerRateBar(rate) {
    const safeRate = Math.max(0, Math.min(100, Math.round(Number(rate || 0))));
    return `
        <div style="display:flex; align-items:center; gap:8px; min-width:96px;">
            <div style="flex:1; height:7px; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; overflow:hidden;">
                <div style="height:100%; width:${safeRate}%; background:var(--primary); border-radius:999px;"></div>
            </div>
            <span style="width:34px; text-align:right; font-size:12px; font-weight:500; color:var(--text);">${safeRate}%</span>
        </div>
    `;
}

function getPlannerMonthBounds(month) {
    const safeMonth = /^\d{4}-\d{2}$/.test(String(month || '')) ? String(month) : new Date().toLocaleDateString('sv-SE').slice(0, 7);
    const [year, monthNo] = safeMonth.split('-').map(Number);
    const first = new Date(year, monthNo - 1, 1);
    const last = new Date(year, monthNo, 0);
    const fmt = d => d.toLocaleDateString('sv-SE');
    return { month: safeMonth, from: fmt(first), to: fmt(last) };
}

function renderPlannerPlanList(plans, feedback) {
    const list = Array.isArray(plans) ? plans : [];
    if (!list.length) {
        return `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:400; border:1px dashed var(--border); border-radius:14px; background:var(--surface-2);">해당 기간에 등록된 계획이 없습니다.</div>`;
    }

    const feedbackMap = new Map((Array.isArray(feedback) ? feedback : []).map(f => [String(f.feedback_date), f]));
    const groups = {};
    list.forEach(plan => {
        const date = String(plan.plan_date || '');
        if (!groups[date]) groups[date] = [];
        groups[date].push(plan);
    });

    return Object.keys(groups).sort().map(date => {
        const items = groups[date];
        const done = items.filter(p => Number(p.is_done || 0) === 1).length;
        const rate = items.length ? Math.round((done / items.length) * 100) : 0;
        const fb = feedbackMap.get(date);
        const feedbackHtml = fb && String(fb.teacher_comment || fb.badge || '').trim()
            ? `<div style="margin-top:10px; padding:10px 12px; border-radius:12px; background:var(--primary-soft); color:var(--text); font-size:12px; font-weight:400; line-height:1.5;">${apEscapeHtml(`${fb.badge || ''} ${fb.teacher_comment || ''}`.trim())}</div>`
            : '';

        return `
            <div style="border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 14px; background:var(--surface-2); border-bottom:1px solid var(--border);">
                    <div style="font-size:13px; font-weight:500; color:var(--text);">${apEscapeHtml(date)}</div>
                    <div style="display:flex; align-items:center; gap:8px; min-width:150px;">
                        ${renderPlannerRateBar(rate)}
                    </div>
                </div>
                <div style="padding:10px 14px;">
                    ${items.map(plan => {
                        const isDone = Number(plan.is_done || 0) === 1;
                        const subject = String(plan.subject || '수학').trim();
                        const repeat = String(plan.repeat_rule || '').trim();
                        return `
                            <div style="display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid var(--border);">
                                <span style="flex:0 0 auto; width:22px; height:22px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:500; background:${isDone ? 'var(--primary)' : 'var(--surface-2)'}; color:${isDone ? '#fff' : 'var(--secondary)'}; border:1px solid ${isDone ? 'var(--primary)' : 'var(--border)'};">${isDone ? '✓' : ''}</span>
                                <div style="min-width:0; flex:1;">
                                    <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.45; ${isDone ? 'opacity:.55; text-decoration:line-through;' : ''}">${apEscapeHtml(plan.title || '')}</div>
                                    <div style="font-size:11px; font-weight:400; color:var(--secondary); margin-top:3px;">${apEscapeHtml(subject)}${repeat ? ` · ${repeat === 'daily' ? '매일 반복' : repeat === 'weekly' ? '매주 반복' : repeat}` : ''}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    ${feedbackHtml}
                </div>
            </div>
        `;
    }).join('<div style="height:10px;"></div>');
}

async function openPlannerStudentPlans(studentId, monthOrDate) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const bounds = getPlannerMonthBounds(String(monthOrDate || '').slice(0, 7));
    const classId = state?.ui?.plannerControlClassId || state?.ui?.currentClassId || '';

    showModal('플래너 상세', `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:14px; background:var(--surface-2); border-radius:16px;">
                <div style="min-width:0;">
                    <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.3;">${apEscapeHtml(student?.name || '학생')}</div>
                    <div style="font-size:12px; font-weight:400; color:var(--secondary); margin-top:4px;">${apEscapeHtml(bounds.month)} 전체 계획</div>
                </div>
                <button class="btn apms-button apms-button--quiet" style="min-height:38px; padding:8px 12px; font-size:12px; font-weight:500; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="${classId ? `renderPlannerControl('${classId}')` : 'closeModal(true)'}">목록</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="month" id="planner-student-month" class="btn" value="${bounds.month}" style="flex:1; text-align:left; background:var(--surface); border:1px solid var(--border);">
                <button class="btn apms-button apms-button--primary btn-primary" style="min-height:44px; padding:10px 14px; font-size:12px; font-weight:500;" onclick="openPlannerStudentPlans('${studentId}', document.getElementById('planner-student-month')?.value)">조회</button>
            </div>
            <div id="planner-student-plans-body">
                <div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:400;">불러오는 중...</div>
            </div>
        </div>
    `);

    try {
        const data = api.getPlannerStudentPlans
            ? await api.getPlannerStudentPlans(studentId, bounds.from, bounds.to)
            : await api.get(`planner?student_id=${encodeURIComponent(studentId)}&from=${encodeURIComponent(bounds.from)}&to=${encodeURIComponent(bounds.to)}`);
        const body = document.getElementById('planner-student-plans-body');
        if (!body) return;
        if (!data?.success) {
            body.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:400;">계획을 불러오지 못했습니다.</div>`;
            toast(data?.message || data?.error || '플래너 상세 조회 실패', 'warn');
            return;
        }
        body.innerHTML = renderPlannerPlanList(data.plans || [], data.feedback || []);
    } catch (e) {
        console.error('[openPlannerStudentPlans] failed:', e);
        const body = document.getElementById('planner-student-plans-body');
        if (body) body.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:400;">계획 조회 중 오류가 발생했습니다.</div>`;
        toast('계획 조회 중 오류가 발생했습니다.', 'error');
    }
}

function renderPlannerOverviewTable(classId, date, rows) {
    const root = document.getElementById('planner-control-body');
    if (!root) return;

    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) {
        root.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:400;">조회 대상 학생이 없습니다.</div>`;
        return;
    }

    const desktopRows = list.map(row => {
        const fb = row.feedback || null;
        const fbText = fb ? `${fb.badge || ''} ${fb.teacher_comment || '피드백 저장됨'}`.trim() : '미작성';
        return `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:12px 10px; font-size:14px; font-weight:500; color:var(--text);">${apEscapeHtml(row.name)}</td>
                <td style="padding:12px 6px; text-align:center; font-size:13px; font-weight:500; color:var(--text);">${Number(row.total || 0)}</td>
                <td style="padding:12px 6px; text-align:center; font-size:13px; font-weight:500; color:var(--primary);">${Number(row.done || 0)}</td>
                <td style="padding:12px 10px;">${renderPlannerRateBar(row.rate)}</td>
                <td style="padding:12px 10px; font-size:12px; font-weight:400; color:${fb ? 'var(--text)' : 'var(--secondary)'}; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${apEscapeHtml(fbText)}</td>
                <td style="padding:12px 10px; text-align:right;">
                    <div style="display:flex; gap:6px; justify-content:flex-end;">
                        <button class="btn apms-button apms-button--quiet" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:500; border-radius:12px; background:var(--surface-2); border:none; color:var(--text);" onclick="openPlannerStudentPlans('${row.student_id}', '${date}')">상세</button>
                        <button class="btn apms-button apms-button--quiet" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:500; border-radius:12px; background:var(--surface-2); border:none;" onclick="openPlannerFeedbackModal('${row.student_id}', '${date}', ${Number(row.rate || 0)})">피드백</button>
                        <button class="btn apms-button apms-button--quiet" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:500; border-radius:12px; background:var(--primary-soft); border:none; color:var(--primary);" onclick="copyPlannerStudentLink('${row.student_id}')">링크</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const mobileCards = list.map(row => {
        const fb = row.feedback || null;
        const fbText = fb ? `${fb.badge || ''} ${fb.teacher_comment || '피드백 저장됨'}`.trim() : '피드백 미작성';
        return `
            <div style="border:1px solid var(--border); border-radius:16px; padding:14px; background:var(--surface); margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.3;">${apEscapeHtml(row.name)}</div>
                        <div style="font-size:12px; font-weight:400; color:var(--secondary); margin-top:4px;">할 일 ${Number(row.total || 0)} · 완료 ${Number(row.done || 0)}</div>
                    </div>
                    <div style="font-size:13px; font-weight:500; color:var(--primary);">${Number(row.rate || 0)}%</div>
                </div>
                ${renderPlannerRateBar(row.rate)}
                <div style="font-size:12px; font-weight:400; color:${fb ? 'var(--text)' : 'var(--secondary)'}; margin-top:10px; line-height:1.5;">${apEscapeHtml(fbText)}</div>
                <div style="display:flex; gap:8px; margin-top:12px;">
                    <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:500; border-radius:12px; background:var(--surface-2); border:none; color:var(--text);" onclick="openPlannerStudentPlans('${row.student_id}', '${date}')">상세</button>
                    <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:500; border-radius:12px; background:var(--surface-2); border:none;" onclick="openPlannerFeedbackModal('${row.student_id}', '${date}', ${Number(row.rate || 0)})">피드백</button>
                    <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:500; border-radius:12px; background:var(--primary-soft); border:none; color:var(--primary);" onclick="copyPlannerStudentLink('${row.student_id}')">링크 복사</button>
                </div>
            </div>
        `;
    }).join('');

    root.innerHTML = `
        <style>
            @media (max-width:700px) {
                #planner-desktop-table { display:none !important; }
                #planner-mobile-list { display:block !important; }
            }
            @media (min-width:701px) {
                #planner-desktop-table { display:block !important; }
                #planner-mobile-list { display:none !important; }
            }
        </style>
        <div id="planner-desktop-table" style="overflow-x:auto; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
            <table style="width:100%; border-collapse:collapse; min-width:720px;">
                <thead>
                    <tr style="background:var(--surface-2); border-bottom:1px solid var(--border);">
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:500; color:var(--secondary);">학생</th>
                        <th style="padding:10px 6px; text-align:center; font-size:12px; font-weight:500; color:var(--secondary);">할 일</th>
                        <th style="padding:10px 6px; text-align:center; font-size:12px; font-weight:500; color:var(--secondary);">완료</th>
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:500; color:var(--secondary);">이행률</th>
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:500; color:var(--secondary);">피드백</th>
                        <th style="padding:10px; text-align:right; font-size:12px; font-weight:500; color:var(--secondary);">관리</th>
                    </tr>
                </thead>
                <tbody>${desktopRows}</tbody>
            </table>
        </div>
        <div id="planner-mobile-list">${mobileCards}</div>
    `;
}

async function renderPlannerControl(classId) {
    ensureClassPlannerState();
    injectClassPlannerReviewStyles();
    if (!state.ui) state.ui = {};
    state.ui.plannerControlClassId = String(classId || '');
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (!cls) return toast('반 정보를 찾을 수 없습니다.', 'warn');
    if (!isPlannerTargetClass(cls)) return toast('플래너 확인 대상 반이 아닙니다.', 'warn');

    const today = getClassPlannerToday();
    if (!state.ui.classPlannerSelectedDate) state.ui.classPlannerSelectedDate = today;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(state.ui.classPlannerSelectedDate);

    showModal('플래너 확인', `
        <div class="class-planner-review cls-planner-wrap">
            <div class="cls-planner-hero">
                <div style="min-width:0;">
                    <div class="cls-planner-hero-title">${apEscapeHtml(cls.name)}</div>
                    <div class="cls-planner-hero-sub">반 전체 학생 플래너 확인</div>
                </div>
                <button class="cls-planner-btn" onclick="renderClass('${classId}'); closeModal(true);">반 화면</button>
            </div>
            ${renderClassPlannerPeriodNav(classId)}
            ${renderClassPlannerModeTabs(classId)}
            ${(window.innerWidth <= 700 || state.ui.classPlannerMode !== 'month') ? renderClassPlannerDayTabs(classId, state.ui.classPlannerWeekStart, state.ui.classPlannerSelectedDate) : ''}
            <div id="planner-control-body">
                <div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:400;">불러오는 중...</div>
            </div>
        </div>
    `);
    expandClassPlannerModalForPc();
    await refreshPlannerControl(classId);
}

async function refreshPlannerControl(classId) {
    ensureClassPlannerState();
    const body = document.getElementById('planner-control-body');
    if (body) body.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:400;">불러오는 중...</div>`;

    try {
        const mode = window.innerWidth <= 700 ? 'day' : (state.ui.classPlannerMode || 'day');
        const periodData = mode === 'month'
            ? await loadClassPlannerMonth(classId, getClassPlannerMonthStart(state.ui.classPlannerSelectedDate), true)
            : await loadClassPlannerWeek(classId, state.ui.classPlannerWeekStart, true);
        if (body) body.innerHTML = renderClassPlannerContent(classId, periodData);
    } catch (e) {
        console.error('[refreshPlannerControl] failed:', e);
        if (body) body.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:400;">플래너 조회 중 오류가 발생했습니다.</div>`;
        toast('플래너 조회 중 오류가 발생했습니다.', 'error');
    }
}

window.setClassPlannerMode = async function(classId, mode) {
    ensureClassPlannerState();
    const safeMode = String(mode) === 'month' ? 'month' : String(mode) === 'week' ? 'week' : 'day';
    state.ui.classPlannerMode = window.innerWidth <= 700 ? 'day' : safeMode;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(state.ui.classPlannerSelectedDate);
    await renderPlannerControl(classId);
};

window.setClassPlannerSelectedDate = async function(classId, dateStr) {
    ensureClassPlannerState();
    const date = normalizeClassroomDate(dateStr) || getClassPlannerToday();
    state.ui.classPlannerSelectedDate = date;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(date);
    await renderPlannerControl(classId);
};

window.moveClassPlannerWeek = async function(classId, direction) {
    ensureClassPlannerState();
    const move = Number(direction || 0) * 7;
    state.ui.classPlannerWeekStart = addClassPlannerDays(state.ui.classPlannerWeekStart, move);
    state.ui.classPlannerSelectedDate = addClassPlannerDays(state.ui.classPlannerSelectedDate, move);
    await renderPlannerControl(classId);
};

window.resetClassPlannerWeek = async function(classId) {
    ensureClassPlannerState();
    const today = getClassPlannerToday();
    state.ui.classPlannerSelectedDate = today;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(today);
    await renderPlannerControl(classId);
};

window.moveClassPlannerMonth = async function(classId, direction) {
    ensureClassPlannerState();
    const base = parseClassPlannerDate(getClassPlannerMonthStart(state.ui.classPlannerSelectedDate)) || parseClassPlannerDate(getClassPlannerMonthStart(getClassPlannerToday()));
    base.setMonth(base.getMonth() + Number(direction || 0));
    state.ui.classPlannerSelectedDate = base.toLocaleDateString('sv-SE');
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(state.ui.classPlannerSelectedDate);
    await renderPlannerControl(classId);
};

window.resetClassPlannerMonth = async function(classId) {
    ensureClassPlannerState();
    const today = getClassPlannerToday();
    state.ui.classPlannerSelectedDate = today;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(today);
    await renderPlannerControl(classId);
};

function openPlannerFeedbackModal(studentId, date, currentRate) {
    const s = state.db.students.find(st => String(st.id) === String(studentId));
    const safeRate = Math.max(0, Math.min(100, Math.round(Number(currentRate || 0))));
    showModal('플래너 피드백', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:var(--surface-2); border-radius:14px; padding:12px;">
                <div style="font-size:14px; font-weight:500; color:var(--text);">${apEscapeHtml(s?.name || '학생')}</div>
                <div style="font-size:12px; font-weight:400; color:var(--secondary); margin-top:4px;">${apEscapeHtml(date)} · 현재 이행률 ${safeRate}%</div>
            </div>
            <select id="planner-feedback-badge" class="btn" style="width:100%; text-align:left; background:var(--surface); border:1px solid var(--border);">
                <option value="">배지 없음</option>
                <option value="⭐">⭐ 잘함</option>
                <option value="🔥">🔥 집중</option>
                <option value="👍">👍 좋아요</option>
            </select>
            <textarea id="planner-feedback-comment" class="cls-input" rows="5" placeholder="학생에게 보일 피드백을 입력하세요." style="resize:none;"></textarea>
            <button class="btn apms-button apms-button--primary btn-primary" style="min-height:48px; font-size:14px; font-weight:500;" onclick="savePlannerFeedback('${studentId}', '${date}', ${safeRate})">저장</button>
        </div>
    `);
}

async function savePlannerFeedback(studentId, date, currentRate) {
    const badge = document.getElementById('planner-feedback-badge')?.value || '';
    const teacherComment = document.getElementById('planner-feedback-comment')?.value.trim() || '';
    const payload = {
        student_id: studentId,
        feedback_date: date,
        teacher_comment: teacherComment,
        badge,
        completion_rate: Math.max(0, Math.min(100, Math.round(Number(currentRate || 0))))
    };

    try {
        const r = api.savePlannerFeedback ? await api.savePlannerFeedback(payload) : await api.post('planner/feedback', payload);
        if (!r?.success) {
            toast(r?.message || r?.error || '피드백 저장 실패', 'warn');
            return;
        }
        toast('피드백이 저장되었습니다.', 'success');
        closeModal(true);
        const classId = state?.ui?.plannerControlClassId || state?.ui?.currentClassId || '';
        if (classId) await renderPlannerControl(classId);
    } catch (e) {
        console.error('[savePlannerFeedback] failed:', e);
        toast('피드백 저장 중 오류가 발생했습니다.', 'error');
    }
}
