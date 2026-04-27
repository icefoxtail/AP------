/**
 * AP Math OS v26.1.2 [js/classroom.js]
 * 학급 운영 관리, 개별 출결/숙제 처리 및 출석부(Ledger) 엔진 (5G-2: 일괄 PIN 배분 UI 추가)
 */

function formatClassScheduleDays(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return daysStr.split(',').map(d => map[parseInt(d)]).join('');
}

function isClassScheduledToday(clsId) {
    const cls = state.db.classes.find(c => c.id === clsId);
    if (!cls || !cls.schedule_days) return true;
    const todayIdx = String(new Date().getDay());
    return cls.schedule_days.split(',').includes(todayIdx);
}

async function handleClassBulkAtt(classId, status) {
    if (!navigator.onLine) {
        toast("오프라인 상태에서는 전체 처리를 할 수 없습니다. 연결 후 다시 시도하세요.", "warn");
        return;
    }

    const cls = state.db.classes.find(c => c.id === classId);
    if (!confirm(`${cls.name} 학생 전체를 "${status}" 처리할까요?`)) return;

    const today = new Date().toLocaleDateString('sv-SE');
    const mIds = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const activeStds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');
    
    const entries = activeStds.map(s => ({ studentId: s.id, status, date: today }));
    
    const r = await fetch(`${CONFIG.API_BASE}/attendance-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ entries })
    });

    if (r.ok) {
        toast(`${cls.name} 전체 ${status} 완료`, 'info');
        await refreshDataOnly();
        renderClass(classId);
    } else {
        toast('일괄 처리 실패', 'warn');
    }
}

async function handleClassBulkHw(classId, status) {
    if (!navigator.onLine) {
        toast("오프라인 상태에서는 전체 처리를 할 수 없습니다. 연결 후 다시 시도하세요.", "warn");
        return;
    }

    const cls = state.db.classes.find(c => c.id === classId);
    if (!confirm(`${cls.name} 학생 전체 숙제를 "${status}" 처리할까요?`)) return;

    const today = new Date().toLocaleDateString('sv-SE');
    const mIds = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const activeStds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');
    
    const entries = activeStds.map(s => ({ studentId: s.id, status, date: today }));
    
    const r = await fetch(`${CONFIG.API_BASE}/homework-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ entries })
    });

    if (r.ok) {
        toast(`${cls.name} 전체 숙제 ${status} 완료`, 'info');
        await refreshDataOnly();
        renderClass(classId);
    } else {
        toast('일괄 처리 실패', 'warn');
    }
}

function renderClass(cid) {
    state.ui.currentClassId = cid;
    const cls = state.db.classes.find(c => c.id === cid);
    const mIds = state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id);
    const today = new Date().toLocaleDateString('sv-SE');

    const summary = computeClassTodaySummary(cid);
    
    const bulkDisabledAttr = !summary.isScheduled ? 'disabled' : '';
    const bulkDisabledStyle = !summary.isScheduled ? 'opacity:0.5; pointer-events:none;' : '';

    // [5G-2] PIN 일괄 배분 버튼 UI 추가
    const opToolsPanel = `
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
            <div style="display:flex; gap:8px;">
                <button class="btn" style="flex:1; padding:10px; font-size:13px; border-color:var(--border);" onclick="openQrGenerator('${cid}')">📸 QR 생성</button>
                <button class="btn" style="flex:1; padding:10px; font-size:13px; border-color:var(--border);" onclick="openQrSubmitStatus('${cid}')">📊 제출 현황</button>
                <button class="btn" style="flex:1; padding:10px; font-size:13px; border-color:var(--border);" onclick="openExamGradeView('${cid}')">📋 시험·성적</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button class="btn" style="flex:1; padding:10px; font-size:12px; border-color:var(--border); color:var(--primary);" onclick="handleBatchGeneratePins('${cid}')">🔑 PIN 일괄 배분</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button class="btn btn-primary" ${bulkDisabledAttr} style="flex:1; padding:12px; font-size:13px; font-weight:700; ${bulkDisabledStyle}" onclick="handleClassBulkAtt('${cid}', '등원')">✅ 전체 등원</button>
                <button class="btn" ${bulkDisabledAttr} style="flex:1; padding:10px; font-size:12px; color:var(--error); border-color:var(--error); ${bulkDisabledStyle}" onclick="handleClassBulkAtt('${cid}', '결석')">❌ 전체 결석</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button class="btn btn-primary" ${bulkDisabledAttr} style="flex:1; padding:12px; font-size:13px; font-weight:700; ${bulkDisabledStyle}" onclick="handleClassBulkHw('${cid}', '완료')">✅ 전체 완료</button>
                <button class="btn" ${bulkDisabledAttr} style="flex:1; padding:10px; font-size:12px; color:var(--warning); border-color:var(--warning); ${bulkDisabledStyle}" onclick="handleClassBulkHw('${cid}', '미완료')">⚠️ 전체 미완료</button>
            </div>
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
            <b style="color:var(--primary);">오늘 수업 현황</b>
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
    const stds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');

    listRoot.innerHTML = stds.map(s => {
        const att = state.db.attendance.find(a => a.student_id===s.id && a.date===today);
        const hw = state.db.homework.find(h => h.student_id===s.id && h.date===today);
        
        const attStatus = att?.status || '미정';
        const attClass = attStatus === '등원' ? 'btn-primary' : '';
        const attStyleStr = attStatus === '결석' ? 'border-color:var(--error); color:var(--error); font-weight:700;' : '';
        
        const hwStatus = hw?.status || '미완료';
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

// [5G-2] PIN 일괄 배분 기능
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

function computeClassTodaySummary(classId) {
    const today = new Date().toLocaleDateString('sv-SE');
    const todayExam = getTodayExamConfig();
    const ids = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const active = state.db.students.filter(s => ids.includes(s.id) && s.status === '재원');
    const aIds = active.map(s => s.id);
    const total = active.length;
    const isScheduled = isClassScheduledToday(classId);
    
    if (!total) return { att: 0, hw: 0, test: 0, total: 0, isScheduled };
    const att = state.db.attendance.filter(a => a.date === today && a.status === '등원' && aIds.includes(a.student_id)).length;
    const hw = state.db.homework.filter(h => h.date === today && h.status === '완료' && aIds.includes(h.student_id)).length;
    const test = todayExam ? new Set(state.db.exam_sessions.filter(es => es.exam_date === today && es.exam_title === todayExam.title && aIds.includes(es.student_id)).map(es => es.student_id)).size : 0;
    return { att, hw, test, total, isScheduled };
}

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
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}" ${c.id === ledgerState.classId ? 'selected' : ''}>${c.name}</option>`).join('');
    document.getElementById('app-root').innerHTML = `
        <div style="display:flex;gap:10px;margin-bottom:15px;align-items:center;flex-wrap:wrap;">
            <button class="btn" onclick="goDashboardFromLedger()">← 홈</button>
            <h2 style="margin:0;">📋 출석부</h2>
        </div>
        <div class="card" style="margin-bottom:12px;">
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                <input type="date" id="ledger-date" class="btn" value="${ledgerState.date}" style="width:160px;" onchange="ledgerState.date=this.value;loadLedger();">
                <select id="ledger-class" class="btn" style="flex:1;min-width:120px;" onchange="ledgerState.classId=this.value;renderLedgerTable();">
                    <option value="">전체 반 (활성)</option>${classOptions}
                </select>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button id="ledger-mode-att" class="btn ${ledgerState.mode==='att'?'btn-primary':''}" onclick="ledgerState.mode='att';renderLedgerTable();">출결</button>
                    <button id="ledger-mode-hw" class="btn ${ledgerState.mode==='hw'?'btn-primary':''}" onclick="ledgerState.mode='hw';renderLedgerTable();">숙제</button>
                </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;" id="bulk-btn-area"></div>
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
    const mIds = cid ? state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id) : state.db.students.map(s => s.id);
    const stds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');
    const isAtt = ledgerState.mode === 'att';
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;
    const bulkArea = document.getElementById('bulk-btn-area');
    if (bulkArea) { bulkArea.innerHTML = isAtt ? `<button class="btn btn-primary" style="flex:1;" onclick="handleBulkAtt('등원')">✅ 전체 등원</button><button class="btn" style="flex:1;color:var(--error);border-color:var(--error);" onclick="handleBulkAtt('결석')">❌ 전체 결석</button>` : `<button class="btn btn-primary" style="flex:1;" onclick="handleBulkHw('완료')">✅ 전체 완료</button><button class="btn" style="flex:1;color:var(--error);border-color:var(--error);" onclick="handleBulkHw('미완료')">❌ 전체 미완료</button>`; }
    const rows = stds.map(s => {
        const rec = records.find(r => r.student_id === s.id && (!r.date || r.date === ledgerState.date));
        const status = isAtt ? (rec?.status || '미정') : (rec?.status || '미완료');
        let btnClass = ''; let btnExtraStyle = '';
        if (isAtt) { if (status === '등원') btnClass = 'btn-primary'; else if (status === '결석') btnExtraStyle = 'border-color:var(--error); color:var(--error); font-weight:700;'; }
        else { if (status === '완료') btnClass = 'btn-primary'; else if (status === '미완료') btnExtraStyle = 'border-color:var(--warning); color:var(--warning); font-weight:700;'; }
        return `<tr><td style="font-weight:700;">${s.name}</td><td>${s.school_name}</td><td style="text-align:right;"><button class="btn ${btnClass}" style="padding:6px 14px;font-size:13px;min-width:75px;${btnExtraStyle}" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${status}</button></td></tr>`;
    }).join('');
    document.getElementById('ledger-table-wrap').innerHTML = `<p style="font-size:13px;color:#5f6368;margin-bottom:12px;">${ledgerState.date} · ${cid ? state.db.classes.find(c=>c.id===cid)?.name : '전체 반'} · ${isAtt?'출결':'숙제'}</p><table><thead><tr><th>이름</th><th>학교</th><th style="text-align:right;">상태</th></tr></thead><tbody>${rows || '<tr><td colspan="3" style="text-align:center;opacity:0.5;padding:20px;">표시할 학생이 없습니다.</td></tr>'}</tbody></table>`;
}

async function handleBulkAtt(status) {
    const cid = ledgerState.classId; if (!confirm(`${ledgerState.date} 기준 전체를 "${status}"으로 처리할까요?`)) return;
    const sids = cid ? state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id) : state.db.students.map(s => s.id);
    const stds = state.db.students.filter(s => sids.includes(s.id) && s.status === '재원');
    const entries = stds.map(s => ({ studentId: s.id, status, date: ledgerState.date }));
    const r = await fetch(`${CONFIG.API_BASE}/attendance-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ entries }) });
    if (r.ok) { toast('일괄 처리 완료', 'info'); if (ledgerState.date === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); }
}

async function handleBulkHw(status) {
    const cid = ledgerState.classId; if (!confirm(`${ledgerState.date} 기준 전체를 "${status}"으로 처리할까요?`)) return;
    const sids = cid ? state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id) : state.db.students.map(s => s.id);
    const stds = state.db.students.filter(s => sids.includes(s.id) && s.status === '재원');
    const entries = stds.map(s => ({ studentId: s.id, status, date: ledgerState.date }));
    const r = await fetch(`${CONFIG.API_BASE}/homework-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...getAuthHeader() }, body: JSON.stringify({ entries }) });
    if (r.ok) { toast('일괄 처리 완료', 'info'); if (ledgerState.date === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); }
}

async function toggleAtt(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date; const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => a.student_id === sid && a.date === today); const next = cur?.status === '등원' ? '결석' : '등원';
    
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
    const isLedger = !!date; const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => h.student_id === sid && h.date === today); const next = cur?.status === '완료' ? '미완료' : '완료';
    
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

async function openExamGradeView(classId) {
    const cls = state.db.classes.find(c => c.id === classId);
    
    const ids = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const sessions = state.db.exam_sessions.filter(es => ids.includes(es.student_id));
    
    const examMap = {};
    sessions.forEach(es => {
        const key = `${es.exam_title}||${es.exam_date}`;
        if (!examMap[key]) examMap[key] = { title: es.exam_title, date: es.exam_date, sessions: [] };
        examMap[key].sessions.push(es);
    });
    const examList = Object.values(examMap).sort((a, b) => b.date.localeCompare(a.date));

    const listHTML = examList.length
        ? examList.map(ex => `
            <div class="exam-grade-row" onclick="openExamDetail('${classId}','${ex.title.replace(/'/g,"\\'")}','${ex.date}')" style="padding: 14px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; cursor: pointer; background: var(--surface); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="font-weight:800; color:var(--primary);">${ex.title}</div>
                <div style="font-size:12px; color:var(--secondary); margin-top:4px;">${ex.date} · <b>${ex.sessions.length}명</b> 제출 완료</div>
            </div>`).join('')
        : '<div style="opacity:0.5;text-align:center;padding:30px;">등록된 시험이 없습니다.</div>';

    showModal(`📋 ${cls.name} 시험·성적`, `
        <div style="display:flex;flex-direction:column;gap:8px;">${listHTML}</div>
    `);
}

async function openExamDetail(classId, examTitle, examDate) {
    let sessionSource = state.db.exam_sessions || [];
    let wrongSource = state.db.wrong_answers || [];

    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints)) {
            setExamBlueprintsForFiles(res.blueprints);
        }
        if (res && Array.isArray(res.sessions)) {
            sessionSource = res.sessions;
        }
        if (res && Array.isArray(res.wrong_answers)) {
            wrongSource = res.wrong_answers;
        }
    } catch (e) {
        console.warn('[3C1] by-class blueprint load failed', e);
    }

    const ids = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const active = state.db.students.filter(s => ids.includes(s.id) && s.status === '재원');
    const sessions = sessionSource.filter(es =>
        es.exam_title === examTitle && es.exam_date === examDate && ids.includes(es.student_id)
    );
    const submittedIds = new Set(sessions.map(s => s.student_id));
    const qCount = sessions[0]?.question_count || 0;

    const submitted = active.filter(s => submittedIds.has(s.id)).map(s => {
        const sess = sessions.find(es => es.student_id === s.id);
        const wrongs = wrongSource
            .filter(w => w.session_id === sess?.id)
            .map(w => w.question_id)
            .sort((a,b)=>Number(a)-Number(b));
        return { ...s, score: sess?.score ?? '-', sessionId: sess?.id, session: sess, wrongs };
    });
    const pending = active.filter(s => !submittedIds.has(s.id));

    const submittedHTML = submitted.map(s => `
        <tr>
            <td style="padding:10px 4px;">${s.name}</td>
            <td style="text-align:center;font-weight:800;color:var(--primary);padding:10px 4px;">${s.score}점</td>
            <td style="font-size:11px;padding:10px 4px;color:var(--error);font-weight:600;">
                <div style="display:flex;flex-wrap:wrap;gap:2px;">
                    ${s.wrongs.length ? s.wrongs.map(qid => buildWrongUnitChip(s.session, qid)).join('') : '없음'}
                </div>
            </td>
            <td style="text-align:center;padding:10px 4px;">
                <button class="btn" style="padding:4px 8px;font-size:11px;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g,"\\'")}',${qCount},'${classId}','${s.sessionId || ''}')">수정</button>
            </td>
        </tr>`).join('');

    const pendingHTML = pending.map(s => `
        <tr style="background-color:var(--bg);">
            <td style="padding:10px 4px; color:var(--secondary);">${s.name}</td>
            <td colspan="2" style="opacity:0.5; text-align:center; font-size:12px; padding:10px 4px;">미제출</td>
            <td style="text-align:center;padding:10px 4px;">
                <button class="btn btn-primary" style="padding:4px 8px;font-size:11px;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g,"\\'")}',${qCount},'${classId}','')">입력</button>
            </td>
        </tr>`).join('');

    showModal(`${examTitle} (${examDate})`, `
        <div style="font-size:13px; color:var(--secondary); margin-bottom:12px; background:var(--bg); padding:10px; border-radius:8px; text-align:center;">
            <b>${submitted.length + pending.length}명</b> 중 <b style="color:var(--success);">${submitted.length}명 제출</b>
            ${qCount ? `<br><span style="font-size:11px; margin-top:4px; display:inline-block;">기준 문항 수: ${qCount}문항</span>` : ''}
        </div>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <thead><tr style="border-bottom:2px solid var(--border);">
                <th style="text-align:left;padding:8px 4px;">이름</th>
                <th style="text-align:center;padding:8px 4px;">점수</th>
                <th style="text-align:left;padding:8px 4px;">오답</th>
                <th style="text-align:center;padding:8px 4px;">액션</th>
            </tr></thead>
            <tbody>${submittedHTML}${pendingHTML}</tbody>
        </table>
    `);
}