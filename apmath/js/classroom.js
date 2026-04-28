/**
 * AP Math OS 1.0 [js/classroom.js]
 * 학급 운영 관리, 개별 출결/숙제 처리 및 출석부(Ledger) 엔진
 * [IRONCLAD 5G UI 보정]: Toss Base + Vivid Pop 디자인 톤 반영
 * [Final Polish]: 출석부 탭 활성 상태 스타일 복구 및 전체 기능 보존
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

// [5G-2] PIN 일괄 배분 기능
async function handleBatchGeneratePins(classId) {
    if (!confirm('이 반에서 PIN이 아직 없는 학생들에게 고유 PIN을 일괄 배분하시겠습니까? (기존 PIN은 유지됨)')) return;
    const r = await api.post('students/batch-pins', { class_id: classId });
    if (r.success) {
        toast(`총 ${r.count}명의 학생에게 PIN이 자동 배분되었습니다.`, 'info');
        await loadData();
    } else {
        toast(r.message || '일괄 배분에 실패했습니다.', 'error');
    }
}

// [Phase 4/5] 예외 정책 기반 반별 요약 계산
function computeClassTodaySummary(classId) {
    const today = new Date().toLocaleDateString('sv-SE');
    const todayExam = typeof getTodayExamConfig === 'function' ? getTodayExamConfig() : null;
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const aIds = active.map(s => String(s.id));
    const total = active.length;
    const isScheduled = isClassScheduledToday(classId);

    if (!total) return { att: 0, hw: 0, test: 0, total: 0, isScheduled };

    const absentCount = state.db.attendance.filter(a => a.date === today && a.status === '결석' && aIds.includes(String(a.student_id))).length;
    const att = total - absentCount;

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

    const icons = {
        qr: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><path d="M7 7h.01M17 7h.01M7 17h.01M17 17h.01"></path></svg>`,
        grade: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10M18 20V4M6 20v-4"></path></svg>`,
        clinic: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>`,
        edit: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"></path></svg>`
    };

    const opToolsPanel = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding:2px 4px 0;">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                <button class="btn" style="width:44px; height:44px; padding:0; border:none; border-radius:14px; background:var(--surface); box-shadow:var(--shadow); color:var(--secondary);" onclick="openAppDrawer()">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div style="min-width:0;">
                    <div style="font-size:20px; font-weight:900; color:#191F28; letter-spacing:-0.5px; line-height:1.2;">${cls.name}</div>
                    <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:2px;">${formatClassScheduleDays(cls.schedule_days)}</div>
                </div>
            </div>
            <button class="btn" style="padding:10px 14px; font-size:13px; font-weight:800; background:var(--bg); border:none; border-radius:12px; color:var(--secondary);" onclick="renderDashboard()">닫기</button>
        </div>
        
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; margin-bottom:24px;">
            <button class="btn" style="padding:16px 4px; font-size:12px; font-weight:700; display:flex; flex-direction:column; align-items:center; gap:10px; border-radius:18px; background:var(--surface); border:none; box-shadow:var(--shadow); color:#191F28;" onclick="openQrGenerator('${cid}')">
                <span style="color:var(--primary);">${icons.qr}</span> <span>QR/OMR</span>
            </button>
            <button class="btn" style="padding:16px 4px; font-size:12px; font-weight:700; display:flex; flex-direction:column; align-items:center; gap:10px; border-radius:18px; background:var(--surface); border:none; box-shadow:var(--shadow); color:#191F28;" onclick="openExamGradeView('${cid}')">
                <span style="color:var(--primary);">${icons.grade}</span> <span>시험성적</span>
            </button>
            <button class="btn" style="padding:16px 4px; font-size:12px; font-weight:700; display:flex; flex-direction:column; align-items:center; gap:10px; border-radius:18px; background:var(--surface); border:none; box-shadow:var(--shadow); color:#191F28;" onclick="openClinicBasketForClass('${cid}')">
                <span style="color:var(--primary);">${icons.clinic}</span> <span>클리닉</span>
            </button>
            <button class="btn btn-primary" style="padding:16px 4px; font-size:12px; font-weight:800; display:flex; flex-direction:column; align-items:center; gap:10px; border-radius:18px;" onclick="openClassRecordModal('${cid}')">
                <span style="color:#fff;">${icons.edit}</span> <span>진도관리</span>
            </button>
        </div>
    `;

    const statusBarHtml = summary.isScheduled
        ? `<div style="display:flex; gap:14px; align-items:center;">
             <span>출석 <b style="color:#191F28;">${summary.att}/${summary.total}</b></span>
             <span style="width:1px; height:12px; background:var(--border);"></span>
             <span>숙제 <b style="color:#191F28;">${summary.hw}/${summary.total}</b></span>
           </div>`
        : `<span style="color:var(--warning); font-weight:800;">정규 수업일이 아닙니다.</span>`;

    document.getElementById('app-root').innerHTML = `
        ${opToolsPanel}
        <div style="padding:14px 18px; background:rgba(26,92,255,0.06); border-radius:16px; margin-bottom:18px; font-size:12px; color:var(--primary); font-weight:800; display:flex; justify-content:space-between; align-items:center; border:1px solid rgba(26,92,255,0.1);">
            <span>오늘 현황</span>
            ${statusBarHtml}
        </div>
        <div class="card" style="padding:8px 0; border-radius:20px;">
            <div style="padding:12px 20px 14px; border-bottom:1px solid var(--border);">
                <h2 style="font-size:16px; font-weight:900; color:#191F28; margin:0;">학생 명단</h2>
            </div>
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="background:var(--bg);">
                        <th style="padding:12px 20px; font-size:11px; color:var(--secondary); text-transform:uppercase;">Name</th>
                        <th style="padding:12px 10px; font-size:11px; color:var(--secondary); text-transform:uppercase;">School</th>
                        <th style="padding:12px 20px; font-size:11px; color:var(--secondary); text-align:right; text-transform:uppercase;">Status</th>
                    </tr>
                </thead>
                <tbody id="class-std-list"></tbody>
            </table>
        </div>
    `;

    const listRoot = document.getElementById('class-std-list');
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    listRoot.innerHTML = stds.map(s => {
        const att = state.db.attendance.find(a => String(a.student_id) === String(s.id) && a.date === today);
        const hw = state.db.homework.find(h => String(h.student_id) === String(s.id) && h.date === today);
        
        const attStatus = att?.status || '등원';
        const attStyle = attStatus === '등원' 
            ? 'background:rgba(0,208,132,0.1); color:var(--success);' 
            : 'background:rgba(255,71,87,0.12); color:var(--error); font-weight:900;';
        
        const hwStatus = hw?.status || '완료';
        const hwStyle = hwStatus === '완료' 
            ? 'background:rgba(26,92,255,0.1); color:var(--primary);' 
            : 'background:rgba(255,165,2,0.15); color:var(--warning); font-weight:900;';
        
        return `<tr>
            <td onclick="renderStudentDetail('${s.id}')" style="padding:16px 20px; cursor:pointer; font-weight:800; color:var(--primary); font-size:15px;">${s.name}</td>
            <td style="padding:16px 10px; color:var(--secondary); font-size:13px; font-weight:600;">${s.school_name}</td>
            <td style="padding:16px 20px; text-align:right; white-space:nowrap;">
                <button class="btn" style="padding:6px 14px; font-size:11px; min-width:54px; border:none; border-radius:10px; ${attStyle}" onclick="toggleAtt('${s.id}')">${attStatus}</button>
                <button class="btn" style="padding:6px 14px; font-size:11px; min-width:54px; border:none; border-radius:10px; ${hwStyle}" onclick="toggleHw('${s.id}')">${hwStatus}</button>
            </td>
        </tr>`;
    }).join('');
}

function openClassRecordModal(cid) {
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const allTextbooks = state.db.class_textbooks || [];
    let activeBooks = allTextbooks.filter(tb => String(tb.class_id) === String(cid) && tb.status === 'active');

    if (activeBooks.length === 0 && cls.textbook) {
        activeBooks = [{ id: 'fallback', title: cls.textbook }];
    }

    const existingRecord = (state.db.class_daily_records || []).find(r => String(r.class_id) === String(cid) && r.date === todayStr);
    const existingProgress = existingRecord ? (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(existingRecord.id)) : [];

    const booksHtml = activeBooks.length > 0 ? activeBooks.map((tb) => {
        const prevP = existingProgress.find(p => String(p.textbook_id) === String(tb.id) || (tb.id === 'fallback' && p.textbook_title_snapshot === tb.title));
        const progVal = prevP ? prevP.progress_text : '';
        const isChecked = (prevP || progVal) ? 'checked' : '';
        
        return `
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
            <label style="display:flex; align-items:center; gap:10px; font-size:13px; font-weight:800; min-width:120px; color:#191F28; cursor:pointer;">
                <input type="checkbox" class="record-tb-check" value="${tb.id}" data-title="${String(tb.title).replace(/"/g, '&quot;')}" ${isChecked} style="transform:scale(1.3); accent-color:var(--primary);">
                ${String(tb.title)}
            </label>
            <input type="text" class="btn record-tb-progress" id="progress_${tb.id}" value="${progVal}" placeholder="예: p.10~25" style="flex:1; text-align:left; font-size:13px; background:var(--bg); border:none; min-height:42px; padding:8px 16px; border-radius:12px;">
        </div>
        `;
    }).join('') : `<div style="font-size:13px; color:var(--secondary); padding:20px; text-align:center; background:var(--bg); border-radius:16px; font-weight:700;">등록된 활성 교재가 없습니다.</div>`;

    const prevNote = existingRecord ? existingRecord.special_note : '';

    showModal('진도관리', `
        <div style="margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:14px;">
                <h4 style="margin:0; font-size:16px; font-weight:900; color:#191F28;">교재별 진도</h4>
                <span style="font-size:12px; font-weight:700; color:var(--secondary);">${todayStr}</span>
            </div>
            <div style="background:var(--surface); padding:4px 0;">
                ${booksHtml}
            </div>
        </div>
        <div style="margin-bottom:28px;">
            <h4 style="margin:0 0 12px 0; font-size:16px; font-weight:900; color:#191F28;">특이사항</h4>
            <textarea id="record-special-note" class="btn" placeholder="전달사항이나 수업 메모를 입력하세요." style="width:100%; height:110px; text-align:left; resize:vertical; font-family:inherit; font-size:14px; background:var(--bg); border:none; padding:16px; line-height:1.7; border-radius:16px;">${prevNote}</textarea>
        </div>
        <button class="btn btn-primary" style="width:100%; padding:18px; font-size:16px; font-weight:900; border-radius:18px; box-shadow:0 6px 16px rgba(26,92,255,0.25);" onclick="saveClassRecord('${cid}', '${todayStr}')">기록 저장하기</button>
    `);
}

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
    let actualTeacherName = typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.ui.userName || '담당');

    const payload = {
        class_id: cid,
        date: dateStr,
        teacher_name: actualTeacherName,
        special_note: specialNote,
        progress: progresses
    };

    const r = await api.post('class-daily-records', payload);
    if (r.success) {
        toast('수업 기록이 저장되었습니다.', 'success');
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
    } catch (e) { toast('데이터 로드 실패', 'warn'); }
}

async function goDashboardFromLedger() { await refreshDataOnly(); state.ui.currentClassId = null; renderDashboard(); }

function renderAttendanceLedger() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}" ${String(c.id) === String(ledgerState.classId) ? 'selected' : ''}>${c.name}</option>`).join('');
    document.getElementById('app-root').innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding:2px 4px 0;">
            <div style="display:flex; align-items:center; gap:12px;">
                <button class="btn" style="width:44px; height:44px; padding:0; border:none; border-radius:14px; background:var(--surface); box-shadow:var(--shadow); color:var(--secondary);" onclick="openAppDrawer()">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div style="font-size:22px; font-weight:950; color:#191F28; letter-spacing:-0.5px;">출석부</div>
            </div>
            <button class="btn" style="padding:10px 16px; font-size:13px; font-weight:800; background:var(--bg); border:none; border-radius:12px;" onclick="goDashboardFromLedger()">홈으로</button>
        </div>
        
        <div class="card" style="padding:18px; margin-bottom:16px; border-radius:22px;">
            <div style="display:flex; gap:12px; flex-direction:column;">
                <div style="display:flex; gap:10px;">
                    <input type="date" id="ledger-date" class="btn" value="${ledgerState.date}" style="flex:1.2; text-align:left; background:var(--bg); border:none; font-weight:700;" onchange="ledgerState.date=this.value;loadLedger();">
                    <select id="ledger-class" class="btn" style="flex:1; background:var(--bg); border:none; font-weight:700;" onchange="ledgerState.classId=this.value;renderLedgerTable();">
                        <option value="">전체 학급</option>${classOptions}
                    </select>
                </div>
                <div style="display:flex; gap:8px; background:var(--bg); padding:5px; border-radius:14px;">
                    <button id="ledger-mode-att" class="btn" style="flex:1; border:none; font-size:13px; border-radius:10px; transition:all 0.25s;" onclick="ledgerState.mode='att';renderLedgerTable();">출결 기록</button>
                    <button id="ledger-mode-hw" class="btn" style="flex:1; border:none; font-size:13px; border-radius:10px; transition:all 0.25s;" onclick="ledgerState.mode='hw';renderLedgerTable();">숙제 기록</button>
                </div>
            </div>
        </div>
        <div id="ledger-table-wrap"></div>
    `;
    loadLedger();
}

/**
 * 출석부 데이터 렌더링 (v1.0 보정: 탭 버튼 활성 상태 갱신 로직 복구)
 */
function renderLedgerTable() {
    // [보구] 탭 버튼 활성 상태 스타일 즉시 반영
    const attBtn = document.getElementById('ledger-mode-att');
    const hwBtn = document.getElementById('ledger-mode-hw');
    const isAtt = ledgerState.mode === 'att';

    if (attBtn) {
        attBtn.style.background = isAtt ? 'var(--surface)' : 'transparent';
        attBtn.style.color = isAtt ? 'var(--primary)' : 'var(--secondary)';
        attBtn.style.fontWeight = isAtt ? '900' : '700';
        attBtn.style.boxShadow = isAtt ? '0 4px 10px rgba(0,0,0,0.06)' : 'none';
    }
    if (hwBtn) {
        hwBtn.style.background = !isAtt ? 'var(--surface)' : 'transparent';
        hwBtn.style.color = !isAtt ? 'var(--primary)' : 'var(--secondary)';
        hwBtn.style.fontWeight = !isAtt ? '900' : '700';
        hwBtn.style.boxShadow = !isAtt ? '0 4px 10px rgba(0,0,0,0.06)' : 'none';
    }

    const cid = ledgerState.classId;
    const mIds = cid ? state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id)) : state.db.students.map(s => String(s.id));
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;

    const rows = stds.map(s => {
        const rec = records.find(r => String(r.student_id) === String(s.id) && (!r.date || r.date === ledgerState.date));
        const status = isAtt ? (rec?.status || '등원') : (rec?.status || '완료');
        
        let style = isAtt 
            ? (status === '등원' ? 'background:rgba(0,208,132,0.1); color:var(--success);' : 'background:rgba(255,71,87,0.12); color:var(--error); font-weight:900;')
            : (status === '완료' ? 'background:rgba(26,92,255,0.1); color:var(--primary);' : 'background:rgba(255,165,2,0.15); color:var(--warning); font-weight:900;');
        
        return `<tr style="border-bottom:1px solid var(--bg);">
            <td style="padding:16px 20px; font-weight:800; color:#191F28; font-size:14px;">${s.name}</td>
            <td style="padding:16px 10px; color:var(--secondary); font-size:12px; font-weight:500;">${s.school_name}</td>
            <td style="padding:16px 20px; text-align:right;">
                <button class="btn" style="padding:6px 14px; font-size:11px; min-width:64px; border:none; border-radius:10px; ${style}" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${status}</button>
            </td>
        </tr>`;
    }).join('');
    
    const className = cid ? (state.db.classes.find(c=>String(c.id)===String(cid))?.name || '반') : '전체 학급';
    
    document.getElementById('ledger-table-wrap').innerHTML = `
        <div class="card" style="padding:8px 0; border-radius:24px;">
            <div style="padding:12px 20px 14px; border-bottom:1px solid var(--border);">
                <p style="font-size:13px; font-weight:800; color:var(--secondary); margin:0;">${className} 현황</p>
            </div>
            <table style="width:100%; border-collapse:collapse;">
                <thead>
                    <tr style="background:var(--bg);">
                        <th style="padding:12px 20px; font-size:11px; color:var(--secondary); text-transform:uppercase;">Student</th>
                        <th style="padding:12px 10px; font-size:11px; color:var(--secondary); text-transform:uppercase;">School</th>
                        <th style="padding:12px 20px; font-size:11px; color:var(--secondary); text-align:right; text-transform:uppercase;">Status</th>
                    </tr>
                </thead>
                <tbody>${rows || '<tr><td colspan="3" style="text-align:center; padding:40px; color:var(--secondary); font-size:14px; font-weight:700;">대상 학생이 없습니다.</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

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
        const sourceBadge = ex.fromAssignment 
            ? `<span style="font-size:10px; font-weight:800; background:rgba(26,92,255,0.1); color:var(--primary); padding:3px 8px; border-radius:6px; margin-left:8px;">출제됨</span>` 
            : `<span style="font-size:10px; font-weight:800; background:var(--bg); color:var(--secondary); padding:3px 8px; border-radius:6px; margin-left:8px;">제출됨</span>`;
        
        return `<div class="exam-grade-row" onclick="openExamDetail('${classId}','${String(ex.title).replace(/'/g,"\\'")}','${ex.date}')" style="padding:16px; border:1px solid var(--border); border-radius:14px; margin-bottom:12px; cursor:pointer; background:var(--surface); box-shadow:var(--shadow);">
            <div style="font-weight:800; color:#191F28; line-height:1.4; font-size:15px;">${ex.title}${sourceBadge}</div>
            <div style="font-size:12px; font-weight:600; color:var(--secondary); margin-top:8px; display:flex; align-items:center; gap:6px;">
                <span>${ex.date || '날짜 없음'}</span>
                <span style="width:3px; height:3px; background:var(--border); border-radius:50%;"></span>
                <span><b>${submittedCount}/${activeCount}</b> 제출</span>
                ${qInfo ? `<span style="width:3px; height:3px; background:var(--border); border-radius:50%;"></span><span>${qInfo.replace(' · ','')}</span>` : ''}
            </div>
        </div>`;
    }).join('') : `<div style="padding:40px 20px; text-align:center; color:var(--secondary); font-size:13px; font-weight:600; background:var(--bg); border-radius:16px;">등록된 시험 기록이 없습니다.</div>`;

    showModal('시험 성적 현황', `<div style="display:flex; flex-direction:column;">${listHTML}</div>`);
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
            <td style="padding:14px 4px; font-weight:800; color:var(--primary); font-size:14px;">${s.name}</td>
            <td style="text-align:center; font-weight:800; color:#191F28; padding:14px 4px;">${s.score}점</td>
            <td style="padding:14px 4px;">
                <div style="display:flex; flex-wrap:wrap; gap:4px;">
                    ${s.wrongs.length ? s.wrongs.map(qid => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(s.session, qid) : `<span style="background:rgba(255,71,87,0.1); color:var(--error); padding:2px 7px; border-radius:6px; font-size:11px; font-weight:700;">${qid}</span>`).join('') : '<span style="color:var(--secondary); font-size:11px;">없음</span>'}
                </div>
            </td>
            <td style="text-align:right; padding:14px 4px;">
                <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--bg); border:none;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','${s.sessionId || ''}','${sArchive}','examDetail','${examDate}')">수정</button>
                    <button class="btn" style="padding:6px 10px; font-size:11px; color:var(--error); border:none; background:rgba(255,71,87,0.05);" onclick="deleteExamSession('${s.sessionId || ''}','${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">삭제</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const pendingHTML = pending.map(s => `<tr style="background-color:rgba(139,149,161,0.05);">
        <td style="padding:14px 4px; color:var(--secondary); font-weight:600;">${s.name}</td>
        <td colspan="2" style="text-align:center; font-size:12px; color:var(--secondary); font-weight:600;">미제출</td>
        <td style="text-align:right; padding:14px 4px;">
            <button class="btn btn-primary" style="padding:6px 12px; font-size:11px; font-weight:800;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','','${examArchiveFile}','examDetail','${examDate}')">입력</button>
        </td>
    </tr>`).join('');

    const weakUnitHtml = typeof renderWeakUnitSummary === 'function' ? renderWeakUnitSummary(classWeakUnits, '오답 데이터 없음', { clickable: true, mode: 'class', titlePrefix: '반 취약 단원', context: { targetType: 'class', targetId: classId, targetLabel: (state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '반', examTitle, examDate } }) : '';

    showModal(`${examTitle}`, `
        <div style="padding:14px; background:var(--bg); border-radius:14px; margin-bottom:16px; text-align:center;">
            <div style="font-size:13px; font-weight:800; color:#191F28;">제출 완료: <b style="color:var(--success);">${submitted.length}명</b> / 전체 ${submitted.length + pending.length}명</div>
            <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:4px;">${examDate} · ${qCount}문항 기준</div>
        </div>
        <div style="margin-bottom:16px; border:1px solid rgba(26,92,255,0.2); border-radius:14px; padding:12px; background:rgba(26,92,255,0.02);">
            <div style="font-size:13px; font-weight:900; margin-bottom:10px; color:var(--primary);">반 취약 단원 TOP</div>
            ${weakUnitHtml}
        </div>
        <div style="margin-bottom:12px; text-align:right;">
            <button class="btn" style="padding:6px 12px; font-size:11px; color:var(--error); border:none; background:rgba(255,71,87,0.1); font-weight:800;" onclick="deleteExamByClass('${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">이 시험 기록 전체 삭제</button>
        </div>
        <table style="width:100%; font-size:13px; border-collapse:collapse;">
            <thead>
                <tr style="border-bottom:1.5px solid var(--border);">
                    <th style="text-align:left; padding:10px 4px; color:var(--secondary);">이름</th>
                    <th style="text-align:center; padding:10px 4px; color:var(--secondary);">점수</th>
                    <th style="text-align:left; padding:10px 4px; color:var(--secondary);">오답</th>
                    <th style="text-align:right; padding:10px 4px; color:var(--secondary);">액션</th>
                </tr>
            </thead>
            <tbody>${submittedHTML}${pendingHTML}</tbody>
        </table>
    `);
}

async function deleteExamSession(sessionId, classId, examTitle, examDate) {
    if (!sessionId) return;
    if (!confirm('이 성적 기록을 삭제하시겠습니까? 오답 정보도 함께 삭제됩니다.')) return;
    const r = await api.delete('exam-sessions', sessionId);
    if (!r?.success) { toast('삭제 실패', 'warn'); return; }
    toast('기록이 삭제되었습니다.', 'info');
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