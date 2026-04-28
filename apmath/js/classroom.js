/**
 * AP Math OS v26.1.2 [js/classroom.js]
 * 학급 운영 관리, 개별 출결/숙제 처리 및 출석부(Ledger) 엔진
 * Phase 4/5: 반 화면 상단 4대 액션 재배치, 예외 정책 기반 통계 보정, 진도관리 모달 개편
 */

function formatClassScheduleDays(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return daysStr.split(',').map(d => map[parseInt(d)]).join('');
}

function isClassScheduledToday(clsId) {
    const cls = state.db.classes.find(c => String(c.id) === String(clsId));
    if (!cls || !cls.schedule_days) return true;
    const todayIdx = String(new Date().getDay());
    return cls.schedule_days.split(',').includes(todayIdx);
}

// [5G-2] PIN 일괄 배분 기능 (보존: 대시보드 통합 PIN 관리에서 호출함)
async function handleBatchGeneratePins(classId) {
    if (!confirm('이 반에서 PIN이 아직 없는 모든 학생들에게 고유 PIN을 일괄 배분(자동 생성)하시겠습니까? (기존 PIN은 절대 덮어쓰지 않습니다)')) return;
    const r = await api.post('students/batch-pins', { class_id: classId });
    if (r.success) {
        toast(`총 ${r.count}명의 학생에게 PIN이 자동 배분되었습니다.`, 'info');
        await loadData();
    } else {
        toast(r.message || '일괄 배분에 실패했습니다.', 'error');
    }
}

// [Phase 4/5] 예외 정책 기반 반별 요약 계산 (미기록 = 등원/완료 간주)
function computeClassTodaySummary(classId) {
    const today = new Date().toLocaleDateString('sv-SE');
    const todayExam = typeof getTodayExamConfig === 'function' ? getTodayExamConfig() : null;
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const aIds = active.map(s => String(s.id));
    const total = active.length;
    const isScheduled = isClassScheduledToday(classId);

    if (!total) return { att: 0, hw: 0, test: 0, total: 0, isScheduled };

    // 예외 정책: 등원수 = 전체 - 결석자수
    const absentCount = state.db.attendance.filter(a => a.date === today && a.status === '결석' && aIds.includes(String(a.student_id))).length;
    const att = total - absentCount;

    // 예외 정책: 숙제완료수 = 전체 - 미완료자수
    const hwMissCount = state.db.homework.filter(h => h.date === today && h.status === '미완료' && aIds.includes(String(h.student_id))).length;
    const hw = total - hwMissCount;

    const test = todayExam ? new Set(state.db.exam_sessions.filter(es => es.exam_date === today && es.exam_title === todayExam.title && aIds.includes(String(es.student_id))).map(es => String(es.student_id))).size : 0;
    
    return { att, hw, test, total, isScheduled };
}

function renderClass(cid) {
    state.ui.currentClassId = String(cid);
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const mIds = state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id));
    const today = new Date().toLocaleDateString('sv-SE');
    const summary = computeClassTodaySummary(cid);

    // [Phase 4/5] 4대 핵심 액션만 남기고 상단 툴바 재배치
    const opToolsPanel = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:8px;">
                <button class="btn" style="padding:6px 10px; font-size:18px; border-color:var(--border); line-height:1;" onclick="openAppDrawer()">&#9776;</button>
                <span style="font-weight:800; font-size:16px; color:var(--primary);">${cls.name}</span>
            </div>
            <button class="btn" style="font-size:11px; padding:4px 10px;" onclick="renderDashboard()">&#8592; 목록</button>
        </div>
        <div style="display:flex; gap:8px; margin-bottom:15px; flex-wrap:wrap;">
            <button class="btn" style="flex:1; min-width:80px; padding:10px; font-size:13px; border-color:var(--border);" onclick="openQrGenerator('${cid}')">📸 QR/OMR</button>
            <button class="btn" style="flex:1; min-width:80px; padding:10px; font-size:13px; border-color:var(--border);" onclick="openExamGradeView('${cid}')">📋 시험성적</button>
            <button class="btn" style="flex:1; min-width:80px; padding:10px; font-size:13px; border-color:var(--border);" onclick="openClinicBasketForClass('${cid}')">🧺 클리닉</button>
            <button class="btn btn-primary" style="flex:1; min-width:80px; padding:10px; font-size:13px; font-weight:800;" onclick="openClassRecordModal('${cid}')">✏️ 진도관리</button>
        </div>
    `;

    const statusBarHtml = summary.isScheduled
        ? `<span>출석 <b>${summary.att}/${summary.total}</b></span>
           <span style="opacity:0.3;">·</span>
           <span>숙제 <b>${summary.hw}/${summary.total}</b></span>`
        : `<span style="color:var(--warning); font-weight:700;">오늘은 정규 수업일이 아닙니다. 개별 수동 처리는 가능합니다.</span>`;

    document.getElementById('app-root').innerHTML = `
        ${opToolsPanel}
        <div style="padding:8px 12px; background:#f8f9fa; border-radius:8px; margin-bottom:12px; font-size:11px; color:#5f6368; display:flex; flex-wrap:wrap; gap:8px; border:1px solid var(--border);">
            <b style="color:var(--primary);">수업현황</b>
            ${statusBarHtml}
        </div>
        <div class="card">
            <h2 style="font-size:16px;">${cls.name} 관리 <span style="font-weight:normal; opacity:0.5; font-size:13px;">(재원 ${summary.total}명 · ${formatClassScheduleDays(cls.schedule_days)})</span></h2>
            <table>
                <thead><tr><th>이름</th><th>학교</th><th style="text-align:right;">출결/숙제</th></tr></thead>
                <tbody id="class-std-list"></tbody>
            </table>
        </div>
    `;

    const listRoot = document.getElementById('class-std-list');
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    listRoot.innerHTML = stds.map(s => {
        const att = state.db.attendance.find(a => String(a.student_id) === String(s.id) && a.date === today);
        const hw = state.db.homework.find(h => String(h.student_id) === String(s.id) && h.date === today);
        
        // 예외 정책: 기록 없으면 '등원/완료'가 기본값
        const attStatus = att?.status || '등원';
        const attClass = attStatus === '등원' ? 'btn-primary' : '';
        const attStyleStr = attStatus === '결석' ? 'border-color:var(--error); color:var(--error); font-weight:700;' : '';
        
        const hwStatus = hw?.status || '완료';
        const hwClass = hwStatus === '완료' ? 'btn-primary' : '';
        const hwStyleStr = hwStatus === '미완료' ? 'border-color:var(--warning); color:var(--warning); font-weight:700;' : '';
        
        return `<tr>
            <td onclick="renderStudentDetail('${s.id}')" style="cursor:pointer; font-weight:800; color:var(--primary);">${s.name}</td>
            <td>${s.school_name}</td>
            <td style="text-align:right; white-space:nowrap;">
                <button class="btn ${attClass}" style="padding:6px 10px; font-size:12px; ${attStyleStr}" onclick="toggleAtt('${s.id}')">${attStatus}</button>
                <button class="btn ${hwClass}" style="padding:6px 10px; font-size:12px; ${hwStyleStr}" onclick="toggleHw('${s.id}')">${hwStatus}</button>
            </td>
        </tr>`;
    }).join('');
}

// [Phase 4/5] 반별 진도관리 (진도 및 특이사항) 모달
function openClassRecordModal(cid) {
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const todayStr = new Date().toLocaleDateString('sv-SE');

    // 하위 호환성: class_textbooks가 없으면 기존 classes.textbook 임시 사용
    const allTextbooks = state.db.class_textbooks || [];
    let activeBooks = allTextbooks.filter(tb => String(tb.class_id) === String(cid) && tb.status === 'active');

    if (activeBooks.length === 0 && cls.textbook) {
        activeBooks = [{ id: 'fallback', title: cls.textbook }];
    }

    // 기존 당일 기록 로드 (수정 모드 지원)
    const existingRecord = (state.db.class_daily_records || []).find(r => String(r.class_id) === String(cid) && r.date === todayStr);
    const existingProgress = existingRecord ? (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(existingRecord.id)) : [];

    const booksHtml = activeBooks.length > 0 ? activeBooks.map((tb) => {
        const prevP = existingProgress.find(p => String(p.textbook_id) === String(tb.id) || (tb.id === 'fallback' && p.textbook_title_snapshot === tb.title));
        const progVal = prevP ? prevP.progress_text : '';
        const isChecked = (prevP || progVal) ? 'checked' : '';
        
        return `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <label style="display:flex; align-items:center; gap:6px; font-size:13px; font-weight:700; min-width:110px;">
                <input type="checkbox" class="record-tb-check" value="${tb.id}" data-title="${String(tb.title).replace(/"/g, '&quot;')}" ${isChecked} style="transform:scale(1.2);">
                ${String(tb.title).replace(/</g, '&lt;').replace(/>/g, '&gt;')}
            </label>
            <input type="text" class="btn record-tb-progress" id="progress_${tb.id}" value="${progVal}" placeholder="진도 (예: p.45~50)" style="flex:1; text-align:left; font-size:12px;">
        </div>
        `;
    }).join('') : '<div style="font-size:12px; color:var(--secondary); padding:10px 0;">활성 교재가 없습니다. 운영 메뉴의 교재 관리에서 등록해주세요.</div>';

    const prevNote = existingRecord ? existingRecord.special_note : '';

    showModal(`✏️ ${cls.name} 진도관리`, `
        <div style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h4 style="margin:0; font-size:13px; color:var(--primary);">교재진도</h4>
                <span style="font-size:11px; color:var(--secondary);">${todayStr}</span>
            </div>
            <div style="background:#f8f9fa; padding:12px 12px 4px 12px; border-radius:8px; border:1px solid var(--border);">
                ${booksHtml}
            </div>
        </div>
        <div style="margin-bottom:16px;">
            <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--primary);">특이사항</h4>
            <textarea id="record-special-note" class="btn" placeholder="특이사항 입력" style="width:100%; height:80px; text-align:left; resize:vertical; font-family:inherit; font-size:13px;">${prevNote}</textarea>
        </div>
        <button class="btn btn-primary" style="width:100%; padding:12px; font-size:13px; font-weight:800;" onclick="saveClassRecord('${cid}', '${todayStr}')">저장</button>
    `);
}

// [Phase 4/5] 수업 기록(진도) 저장 API (실제 교사명 연동 보완)
async function saveClassRecord(cid, dateStr) {
    const checks = document.querySelectorAll('.record-tb-check:checked');
    const progresses = [];
    
    checks.forEach(chk => {
        const tbId = chk.value;
        const tbTitle = chk.getAttribute('data-title');
        const progInput = document.getElementById(`progress_${tbId}`);
        const progText = progInput ? progInput.value.trim() : '';
        
        progresses.push({
            textbook_id: tbId === 'fallback' ? '' : tbId,
            textbook_title_snapshot: tbTitle,
            progress_text: progText
        });
    });

    const specialNote = document.getElementById('record-special-note').value.trim();

    // 작성한 실제 교사명 매핑 (dashboard.js 헬퍼 우선 참조)
    let actualTeacherName = state.ui.userName;
    if (typeof getTeacherNameForUI === 'function') {
        actualTeacherName = getTeacherNameForUI();
    } else {
        const session = typeof getSession === 'function' ? getSession() : null;
        actualTeacherName = state.ui?.userName || state.auth?.name || session?.name || '담당';
        actualTeacherName = String(actualTeacherName || '').trim();
        if (!actualTeacherName || actualTeacherName === '선생님1') actualTeacherName = '담당';
    }

    const payload = {
        class_id: cid,
        date: dateStr,
        teacher_name: actualTeacherName,
        special_note: specialNote,
        progress: progresses
    };

    const r = await api.post('class-daily-records', payload);
    if (r.success) {
        toast('저장완료', 'success');
        closeModal();
        await loadData(); 
    } else {
        toast(r.error || '저장실패', 'error');
    }
}

// 출석부(Ledger) 엔진
let ledgerState = { date: new Date().toLocaleDateString('sv-SE'), classId: '', attendance: [], homework: [], mode: 'att' };

async function loadLedger() {
    try {
        const r = await fetch(`${CONFIG.API_BASE}/attendance-history?date=${ledgerState.date}`, { headers: getAuthHeader() });
        const data = await r.json();
        ledgerState.attendance = data.attendance || [];
        ledgerState.homework = data.homework || [];
        renderLedgerTable();
    } catch (e) { toast('데이터를 불러오지 못했습니다.', 'warn'); }
}

async function goDashboardFromLedger() { await refreshDataOnly(); state.ui.currentClassId = null; renderDashboard(); }

function renderAttendanceLedger() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}" ${String(c.id) === String(ledgerState.classId) ? 'selected' : ''}>${c.name}</option>`).join('');
    document.getElementById('app-root').innerHTML = `
        <div style="display:flex;gap:10px;margin-bottom:15px;align-items:center;flex-wrap:wrap;">
            <button class="btn" onclick="goDashboardFromLedger()">← 홈</button>
            <h2 style="margin:0;">📋 전체 출석부</h2>
        </div>
        <div class="card" style="margin-bottom:12px;">
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                <input type="date" id="ledger-date" class="btn" value="${ledgerState.date}" style="width:160px;" onchange="ledgerState.date=this.value;loadLedger();">
                <select id="ledger-class" class="btn" style="flex:1;min-width:120px;" onchange="ledgerState.classId=this.value;renderLedgerTable();">
                    <option value="">전체학급</option>${classOptions}
                </select>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button id="ledger-mode-att" class="btn ${ledgerState.mode==='att'?'btn-primary':''}" onclick="ledgerState.mode='att';renderLedgerTable();">출결</button>
                    <button id="ledger-mode-hw" class="btn ${ledgerState.mode==='hw'?'btn-primary':''}" onclick="ledgerState.mode='hw';renderLedgerTable();">숙제</button>
                </div>
            </div>
        </div>
        <div class="card" id="ledger-table-wrap"></div>
    `;
    loadLedger();
}

function renderLedgerTable() {
    const attModeBtn = document.getElementById('ledger-mode-att');
    const hwModeBtn = document.getElementById('ledger-mode-hw');
    if (attModeBtn && hwModeBtn) { attModeBtn.classList.toggle('btn-primary', ledgerState.mode === 'att'); hwModeBtn.classList.toggle('btn-primary', ledgerState.mode === 'hw'); }
    
    const cid = ledgerState.classId;
    const mIds = cid ? state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id)) : state.db.students.map(s => String(s.id));
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    const isAtt = ledgerState.mode === 'att';
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;

    const rows = stds.map(s => {
        const rec = records.find(r => String(r.student_id) === String(s.id) && (!r.date || r.date === ledgerState.date));
        const status = isAtt ? (rec?.status || '등원') : (rec?.status || '완료');
        let btnClass = ''; let btnExtraStyle = '';
        
        if (isAtt) { if (status === '등원') btnClass = 'btn-primary'; else if (status === '결석') btnExtraStyle = 'border-color:var(--error); color:var(--error); font-weight:700;'; }
        else { if (status === '완료') btnClass = 'btn-primary'; else if (status === '미완료') btnExtraStyle = 'border-color:var(--warning); color:var(--warning); font-weight:700;'; }
        
        return `<tr><td style="font-weight:700;">${s.name}</td><td>${s.school_name}</td><td style="text-align:right;"><button class="btn ${btnClass}" style="padding:6px 14px;font-size:13px;min-width:75px;${btnExtraStyle}" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${status}</button></td></tr>`;
    }).join('');
    
    document.getElementById('ledger-table-wrap').innerHTML = `<p style="font-size:13px;color:#5f6368;margin-bottom:12px;">${ledgerState.date} · ${cid ? state.db.classes.find(c=>String(c.id)===String(cid))?.name : '전체 반'} · ${isAtt?'출결':'숙제'}</p><table><thead><tr><th>이름</th><th>학교</th><th style="text-align:right;">상태</th></tr></thead><tbody>${rows || '<tr><td colspan="3" style="text-align:center;opacity:0.5;padding:20px;">표시할 학생이 없습니다.</td></tr>'}</tbody></table>`;
}

// 개별 토글 로직
async function toggleAtt(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => String(a.student_id) === String(sid) && a.date === today);
    const next = (cur?.status || '등원') === '등원' ? '결석' : '등원';

    const r = await api.patch('attendance', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('출결 저장 실패', 'warn'); return; }

    if (isLedger) {
        if (today === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly();
        await loadLedger();
    } else {
        await refreshDataOnly();
        if (state.ui.currentClassId) renderClass(state.ui.currentClassId);
        else renderDashboard();
    }
}

async function toggleHw(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => String(h.student_id) === String(sid) && h.date === today);
    const next = (cur?.status || '완료') === '완료' ? '미완료' : '완료';

    const r = await api.patch('homework', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('숙제 저장 실패', 'warn'); return; }

    if (isLedger) {
        if (today === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly();
        await loadLedger();
    } else {
        await refreshDataOnly();
        if (state.ui.currentClassId) renderClass(state.ui.currentClassId);
        else renderDashboard();
    }
}

// 시험/성적 관련 (기존 로직 보존)
function makeExamListKey(title, date, archiveFile = '') {
    const safeTitle = String(title || '');
    const safeDate = String(date || '');
    const safeArchive = String(archiveFile || '');
    if (safeArchive) return `${safeTitle}||${safeDate}||${safeArchive}`;
    return `${safeTitle}||${safeDate}`;
}

function makeExamDetailKey(title, date) {
    return `${String(title || '')}||${String(date || '')}`;
}

async function openExamGradeView(classId) {
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const activeCount = active.length;

    let sessions = (state.db.exam_sessions || []).filter(es => ids.includes(String(es.student_id)));
    let assignments = [];

    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') {
            setExamBlueprintsForFiles(res.blueprints);
        }
        if (res && Array.isArray(res.sessions)) {
            sessions = res.sessions.filter(es => ids.includes(String(es.student_id)));
            const classStudentIdSet = new Set(ids);
            const otherSessions = (state.db.exam_sessions || []).filter(es => !classStudentIdSet.has(String(es.student_id)));
            state.db.exam_sessions = [...otherSessions, ...sessions];
        }
        if (res && Array.isArray(res.assignments)) assignments = res.assignments;
        if (res && Array.isArray(res.wrong_answers)) {
            const sessionIdSet = new Set(sessions.map(s => String(s.id)));
            const otherWrongs = (state.db.wrong_answers || []).filter(w => !sessionIdSet.has(String(w.session_id)));
            const classWrongs = res.wrong_answers.filter(w => sessionIdSet.has(String(w.session_id)));
            state.db.wrong_answers = [...otherWrongs, ...classWrongs];
        }
    } catch (e) { console.warn('[openExamGradeView] fail', e); }

    const examMap = {};
    assignments.forEach(a => {
        const title = a.exam_title || '시험지';
        const date = a.exam_date || '';
        const archiveFile = a.archive_file || '';
        const key = makeExamListKey(title, date, archiveFile);
        if (!examMap[key]) {
            examMap[key] = { title, date, archiveFile, sourceType: a.source_type || 'archive', questionCount: Number(a.question_count || 0), sessions: [], fromAssignment: true };
        } else {
            examMap[key].fromAssignment = true;
            examMap[key].questionCount = Math.max(Number(examMap[key].questionCount || 0), Number(a.question_count || 0));
        }
    });

    sessions.forEach(es => {
        const title = es.exam_title || '시험지';
        const date = es.exam_date || '';
        const archiveFile = es.archive_file || '';
        let key = makeExamListKey(title, date, archiveFile);
        if (!examMap[key]) {
            const detailKey = makeExamDetailKey(title, date);
            const matchedKey = Object.keys(examMap).find(k => makeExamDetailKey(examMap[k].title, examMap[k].date) === detailKey);
            if (matchedKey) key = matchedKey;
        }
        if (!examMap[key]) {
            examMap[key] = { title, date, archiveFile, sourceType: 'session', questionCount: Number(es.question_count || 0), sessions: [], fromAssignment: false };
        }
        examMap[key].sessions.push(es);
        examMap[key].questionCount = Math.max(Number(examMap[key].questionCount || 0), Number(es.question_count || 0));
    });

    const examList = Object.values(examMap).sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.title || '').localeCompare(String(a.title || '')));

    const listHTML = examList.length ? examList.map(ex => {
        const submittedCount = new Set((ex.sessions || []).map(s => String(s.student_id))).size;
        const qInfo = ex.questionCount ? ` · ${ex.questionCount}문항` : '';
        const sourceBadge = ex.fromAssignment ? `<span style="font-size:10px;font-weight:800;background:#e8f0fe;color:var(--primary);padding:2px 6px;border-radius:999px;margin-left:6px;">출제됨</span>` : `<span style="font-size:10px;font-weight:800;background:#f1f3f4;color:var(--secondary);padding:2px 6px;border-radius:999px;margin-left:6px;">제출기록</span>`;
        return `<div class="exam-grade-row" onclick="openExamDetail('${classId}','${String(ex.title).replace(/'/g,"\\'")}','${ex.date}')" style="padding:14px; border:1px solid var(--border); border-radius:8px; margin-bottom:8px; cursor:pointer; background:var(--surface); box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div style="font-weight:800; color:var(--primary); line-height:1.45;">${ex.title}${sourceBadge}</div>
            <div style="font-size:12px; color:var(--secondary); margin-top:4px;">${ex.date || '날짜 없음'} · <b>${submittedCount}/${activeCount}</b> 제출${qInfo}</div>
        </div>`;
    }).join('') : '<div style="opacity:0.5;text-align:center;padding:30px;">등록된 시험이 없습니다.</div>';

    showModal(`📋 ${cls?.name || '반'} 시험·성적`, `<div style="display:flex;flex-direction:column;gap:8px;">${listHTML}</div>`);
}

async function openExamDetail(classId, examTitle, examDate) {
    let sessionSource = state.db.exam_sessions || [];
    let wrongSource = state.db.wrong_answers || [];
    let assignmentSource = [];

    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints)) setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) sessionSource = res.sessions;
        if (res && Array.isArray(res.wrong_answers)) wrongSource = res.wrong_answers;
        if (res && Array.isArray(res.assignments)) assignmentSource = res.assignments;
    } catch (e) { console.warn('[openExamDetail] fail', e); }

    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const sessions = sessionSource.filter(es => String(es.exam_title || '') === String(examTitle || '') && String(es.exam_date || '') === String(examDate || '') && ids.includes(String(es.student_id)));
    const matchedAssignment = assignmentSource.find(a => String(a.exam_title || '') === String(examTitle || '') && String(a.exam_date || '') === String(examDate || ''));

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
    state.db.exam_sessions = sessionSource;
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
    const examArchiveFile = String(examArchiveFileObj?.archive_file || matchedAssignment?.archive_file || '').replace(/'/g, "\\'");

    const submittedHTML = submitted.map(s => {
        const sArchive = s.session?.archive_file ? String(s.session.archive_file).replace(/'/g, "\\'") : examArchiveFile;
        return `<tr>
            <td style="padding:10px 4px;">${s.name}</td>
            <td style="text-align:center;font-weight:800;color:var(--primary);padding:10px 4px;">${s.score}점</td>
            <td style="font-size:11px;padding:10px 4px;color:var(--error);font-weight:600;">
                <div style="display:flex;flex-wrap:wrap;gap:2px;">
                    ${s.wrongs.length ? s.wrongs.map(qid => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(s.session, qid) : `<span style="background:#fce8e6;padding:2px 6px;border-radius:4px;">${qid}</span>`).join('') : '없음'}
                </div>
            </td>
            <td style="text-align:center;padding:10px 4px;">
                <div style="display:flex;flex-direction:column;gap:4px;align-items:center;">
                    <button class="btn" style="padding:6px 10px;font-size:11px;min-width:44px;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','${s.sessionId || ''}','${sArchive}')">수정</button>
                    <button class="btn" style="padding:6px 10px;font-size:11px;min-width:44px;color:var(--error);border-color:var(--error);" onclick="deleteExamSession('${s.sessionId || ''}','${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">삭제</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const pendingHTML = pending.map(s => `<tr style="background-color:var(--bg);">
        <td style="padding:10px 4px; color:var(--secondary);">${s.name}</td>
        <td colspan="2" style="opacity:0.5; text-align:center; font-size:12px; padding:10px 4px;">미제출</td>
        <td style="text-align:center;padding:10px 4px;">
            <button class="btn btn-primary" style="padding:6px 10px;font-size:11px;min-width:44px;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','','${examArchiveFile}')">입력</button>
        </td>
    </tr>`).join('');

    const weakUnitHtml = typeof renderWeakUnitSummary === 'function' ? renderWeakUnitSummary(classWeakUnits, '오답 데이터 없음', { clickable: true, mode: 'class', titlePrefix: '반 취약 단원', context: { targetType: 'class', targetId: classId, targetLabel: (state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '반', examTitle, examDate } }) : '';

    showModal(`${examTitle} (${examDate})`, `
        <div style="font-size:13px; color:var(--secondary); margin-bottom:8px; background:var(--bg); padding:10px; border-radius:8px; text-align:center;">
            <b>${submitted.length + pending.length}명</b> 중 <b style="color:var(--success);">${submitted.length}명 제출</b>
            ${qCount ? `<br><span style="font-size:11px; margin-top:4px; display:inline-block;">기준 문항 수: ${qCount}문항</span>` : ''}
            ${matchedAssignment && !sessions.length ? `<br><span style="font-size:11px; margin-top:4px; display:inline-block;color:var(--primary);font-weight:700;">출제 완료 · 아직 제출 없음</span>` : ''}
        </div>
        <div style="margin-bottom:12px; text-align:right;"><button class="btn" style="padding:6px 12px;font-size:11px;color:var(--error);border-color:var(--error);" onclick="deleteExamByClass('${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">🗑 이 시험 전체삭제</button></div>
        <div style="margin-bottom:12px;"><div style="font-size:13px;font-weight:900;margin-bottom:6px;color:var(--primary);">📌 반 취약 단원 TOP</div>${weakUnitHtml}</div>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <thead><tr style="border-bottom:2px solid var(--border);"><th style="text-align:left;padding:8px 4px;">이름</th><th style="text-align:center;padding:8px 4px;">점수</th><th style="text-align:left;padding:8px 4px;">오답</th><th style="text-align:center;padding:8px 4px;">액션</th></tr></thead>
            <tbody>${submittedHTML}${pendingHTML}</tbody>
        </table>
    `);
}

async function deleteExamSession(sessionId, classId, examTitle, examDate) {
    if (!sessionId) return;
    if (!confirm('이 성적 기록을 삭제하시겠습니까? 오답 정보도 함께 삭제됩니다.')) return;
    const r = await api.delete('exam-sessions', sessionId);
    if (!r?.success) { toast('삭제 실패', 'warn'); return; }
    toast('삭제되었습니다.', 'info');
    closeModal(); await loadData(); openExamDetail(classId, examTitle, examDate);
}

async function deleteExamByClass(classId, examTitle, examDate) {
    if (!confirm('이 시험의 제출 기록 전체를 삭제할까요?')) return;
    if (!confirm('오답 기록도 모두 삭제됩니다. 정말 삭제하시겠습니까?')) return;
    try {
        const url = `${CONFIG.API_BASE}/exam-sessions/by-exam?class=${encodeURIComponent(classId)}&exam=${encodeURIComponent(examTitle)}&date=${encodeURIComponent(examDate)}`;
        const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        const data = await r.json();
        if (!r.ok || !data.success) { toast('시험 전체삭제 실패', 'warn'); return; }
        toast('시험 전체 기록이 삭제되었습니다.', 'info');
        closeModal(); await loadData(); openExamGradeView(classId);
    } catch (e) { console.warn(e); toast('시험 전체삭제 실패', 'warn'); }
}