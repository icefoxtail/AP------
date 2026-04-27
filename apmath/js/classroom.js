/**
 * AP Math OS v26.1.2 [js/classroom.js]
 * 학급 운영 관리, 개별 출결/숙제 처리 및 출석부(Ledger) 엔진 (3C 최종 보정)
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

/**
 * 3C: 반 화면 전용 전체 출결 처리 (ledgerState 독립)
 */
async function handleClassBulkAtt(classId, status) {
    const cls = state.db.classes.find(c => c.id === classId);
    if (!confirm(`${cls.name} 학생 전체를 "${status}" 처리할까요?`)) return;

    const today = new Date().toLocaleDateString('sv-SE');
    const mIds = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const activeStds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');
    
    const entries = activeStds.map(s => ({ studentId: s.id, status, date: today }));
    
    const r = await fetch(`${CONFIG.API_BASE}/attendance-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
    });

    if (r.ok) {
        toast(`${cls.name} 전체 ${status} 완료`, 'info'); // 3C 보정: info로 통일
        await refreshDataOnly();
        renderClass(classId);
    } else {
        toast('일괄 처리 실패', 'warn');
    }
}

/**
 * 3C: 반 화면 전용 전체 숙제 처리 (ledgerState 독립)
 */
async function handleClassBulkHw(classId, status) {
    const cls = state.db.classes.find(c => c.id === classId);
    if (!confirm(`${cls.name} 학생 전체 숙제를 "${status}" 처리할까요?`)) return;

    const today = new Date().toLocaleDateString('sv-SE');
    const mIds = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const activeStds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');
    
    const entries = activeStds.map(s => ({ studentId: s.id, status, date: today }));
    
    const r = await fetch(`${CONFIG.API_BASE}/homework-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries })
    });

    if (r.ok) {
        toast(`${cls.name} 전체 숙제 ${status} 완료`, 'info'); // 3C 보정: info로 통일
        await refreshDataOnly();
        renderClass(classId);
    } else {
        toast('일괄 처리 실패', 'warn');
    }
}

/**
 * 개별 학급 관리 화면 렌더링 (3C: 버튼 위계 축소 및 상태바 성적 제거)
 */
function renderClass(cid) {
    state.ui.currentClassId = cid;
    const cls = state.db.classes.find(c => c.id === cid);
    const mIds = state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id);
    const today = new Date().toLocaleDateString('sv-SE');

    const summary = computeClassTodaySummary(cid);
    
    // 3C: 모바일 최적화 3단 상단 도구 레이아웃 및 위험 버튼 위계 축소
    const opToolsPanel = `
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:15px;">
            <div style="display:flex; gap:8px;">
                <button class="btn" style="flex:1; padding:10px; font-size:13px; border-color:var(--border);" onclick="openQrGenerator('${cid}')">📸 QR 생성</button>
                <button class="btn" style="flex:1; padding:10px; font-size:13px; border-color:var(--border);" onclick="openQrSubmitStatus('${cid}')">📊 제출 현황</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px; font-weight:700;" onclick="handleClassBulkAtt('${cid}', '등원')">✅ 전체 등원</button>
                <button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--error); border-color:var(--error);" onclick="handleClassBulkAtt('${cid}', '결석')">❌ 전체 결석</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px; font-weight:700;" onclick="handleClassBulkHw('${cid}', '완료')">✅ 전체 완료</button>
                <button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--warning); border-color:var(--warning);" onclick="handleClassBulkHw('${cid}', '미완료')">⚠️ 전체 미완료</button>
            </div>
        </div>
    `;

    // 3C: statusBarHtml에서 성적 제거
    const statusBarHtml = summary.isScheduled
        ? `<span>출석 <b>${summary.att}/${summary.total}</b></span>
           <span style="opacity:0.3;">·</span>
           <span>숙제 <b>${summary.hw}/${summary.total}</b></span>`
        : `<span style="color:var(--warning); font-weight:700;">오늘은 정규 수업일이 아닙니다. (수동 처리 가능)</span>`;

    document.getElementById('app-root').innerHTML = `
        ${opToolsPanel}
        <div style="padding:8px 12px; background:#f8f9fa; border-radius:8px; margin-bottom:12px; font-size:11px; color:#5f6368; display:flex; flex-wrap:wrap; gap:8px; border:1px solid var(--border);">
            <b style="color:var(--primary);">오늘 수업 현황</b>
            ${statusBarHtml}
        </div>
        <div class="card">
            <h2 style="font-size:16px;">${cls.name} 관리 <span style="font-weight:normal; opacity:0.5; font-size:13px;">(재원 ${summary.total}명 · ${formatClassScheduleDays(cls.schedule_days)})</span></h2>
            <table>
                <thead><tr><th>이름</th><th>학교</th><th style="text-align:right;">출결/숙제/성적</th></tr></thead>
                <tbody id="class-std-list"></tbody>
            </table>
        </div>
    `;

    const listRoot = document.getElementById('class-std-list');
    const stds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');
    const examsByStudent = new Map();
    state.db.exam_sessions.forEach(es => { if (!examsByStudent.has(es.student_id)) examsByStudent.set(es.student_id, []); examsByStudent.get(es.student_id).push(es); });
    const wrongBySession = new Map();
    state.db.wrong_answers.forEach(w => { wrongBySession.set(w.session_id, (wrongBySession.get(w.session_id) || 0) + 1); });

    listRoot.innerHTML = stds.map(s => {
        const att = state.db.attendance.find(a => a.student_id===s.id && a.date===today);
        const hw = state.db.homework.find(h => h.student_id===s.id && h.date===today);
        const attStatus = att?.status || '미정';
        const attClass = attStatus === '등원' ? 'btn-primary' : '';
        const attStyleStr = attStatus === '결석' ? 'border-color:var(--error); color:var(--error); font-weight:700;' : '';
        const hwStatus = hw?.status || '미완료';
        const hwClass = hwStatus === '완료' ? 'btn-primary' : '';
        const hwStyleStr = hwStatus === '미완료' ? 'border-color:var(--warning); color:var(--warning); font-weight:700;' : '';
        const sExams = examsByStudent.get(s.id) || [];
        let wc = 0; if (sExams.length > 0) { sExams.sort((a,b) => String(b.exam_date).localeCompare(String(a.exam_date))); wc = wrongBySession.get(sExams[0].id) || 0; }

        return `<tr>
            <td onclick="renderStudentDetail('${s.id}')" style="cursor:pointer; font-weight:800; color:var(--primary);">${s.name} ${wc>0?`<span style="display:inline-block; background:#fce8e6; color:#d93025; border-radius:20px; padding:1px 8px; font-size:10px; font-weight:700; margin-left:4px;">🔴 오답 ${wc}</span>`:''}</td>
            <td>${s.school_name}</td>
            <td style="text-align:right; white-space:nowrap;">
                <button class="btn ${attClass}" style="padding:4px 8px; font-size:11px; ${attStyleStr}" onclick="toggleAtt('${s.id}')">${attStatus}</button>
                <button class="btn ${hwClass}" style="padding:4px 8px; font-size:11px; ${hwStyleStr}" onclick="toggleHw('${s.id}')">${hwStatus}</button>
                <button class="btn" style="padding:4px 8px; font-size:11px; border-color:var(--border);" onclick="openOMR('${s.id}')">성적</button>
            </td>
        </tr>`;
    }).join('');
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
    // 3C: test 계산 자체는 나중을 위해 내부적으로 유지
    const test = todayExam ? new Set(state.db.exam_sessions.filter(es => es.exam_date === today && es.exam_title === todayExam.title && aIds.includes(es.student_id)).map(es => es.student_id)).size : 0;
    return { att, hw, test, total, isScheduled };
}

// --- 출석부 (Ledger) 로직 ---
let ledgerState = { date: new Date().toLocaleDateString('sv-SE'), classId: '', attendance: [], homework: [], mode: 'att' };

async function loadLedger() {
    try {
        const r = await fetch(`${CONFIG.API_BASE}/attendance-history?date=${ledgerState.date}`);
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
    const r = await fetch(`${CONFIG.API_BASE}/attendance-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entries }) });
    if (r.ok) { toast('일괄 처리 완료', 'info'); if (ledgerState.date === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); }
}

async function handleBulkHw(status) {
    const cid = ledgerState.classId; if (!confirm(`${ledgerState.date} 기준 전체를 "${status}"으로 처리할까요?`)) return;
    const sids = cid ? state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id) : state.db.students.map(s => s.id);
    const stds = state.db.students.filter(s => sids.includes(s.id) && s.status === '재원');
    const entries = stds.map(s => ({ studentId: s.id, status, date: ledgerState.date }));
    const r = await fetch(`${CONFIG.API_BASE}/homework-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entries }) });
    if (r.ok) { toast('일괄 처리 완료', 'info'); if (ledgerState.date === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); }
}

async function toggleAtt(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date; const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => a.student_id === sid && a.date === today); const next = cur?.status === '등원' ? '결석' : '등원';
    const r = await api.patch('attendance', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('출결 저장 실패', 'warn'); return; }
    if (isLedger) { if (today === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); } else await loadData();
}

async function toggleHw(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date; const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => h.student_id === sid && h.date === today); const next = cur?.status === '완료' ? '미완료' : '완료';
    const r = await api.patch('homework', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('숙제 저장 실패', 'warn'); return; }
    if (isLedger) { if (today === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); } else await loadData();
}