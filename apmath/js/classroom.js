/**
 * AP Math OS 1.0 [js/classroom.js]
 * 학급 운영 관리, 개별 출결/숙제 처리 및 출석부(Ledger) 엔진
 * [Fixed Standard UI]&#58; Typography(Fixed) & Spacing(Fixed) 전면 적용본
 */

// [UI Standard]: 클래스룸 전용 스타일 주입 (애니메이션 및 입력창 규격)
function injectClassroomStyles() {
    if (document.getElementById('classroom-style')) return;
    const style = document.createElement('style');
    style.id = 'classroom-style';
    style.textContent = `
        .cls-fade-in { animation: clsFadeIn 0.25s ease-out; }
        @keyframes clsFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .cls-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); padding: 12px 14px; font-family: inherit; outline: none; font-size: 15px; font-weight: 600; line-height: 1.4; }
    `;
    document.head.appendChild(style);
}

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

function getAttendanceDisplayStatus(status) {
    const safe = String(status || '').trim();
    return safe && safe !== '미기록' ? safe : '등원';
}

function getNextAttendanceStatus(status) {
    const cur = getAttendanceDisplayStatus(status);
    if (cur === '등원') return '결석';
    if (cur === '결석') return '지각';
    if (cur === '지각') return '보강';
    if (cur === '보강') return '상담';
    return '등원';
}

function getAttendanceStatusLabel(status) {
    const cur = getAttendanceDisplayStatus(status);
    if (cur === '등원') return '○ 등원';
    if (cur === '결석') return '× 결석';
    if (cur === '지각') return '△ 지각';
    if (cur === '보강') return '＋ 보강';
    if (cur === '상담') return '★ 상담';
    return '○ 등원';
}

function getAttendanceStatusStyle(status) {
    const cur = getAttendanceDisplayStatus(status);
    if (cur === '등원') {
        return 'background: rgba(0,208,132,0.08); color: var(--success); border: 1px solid rgba(0,208,132,0.15);';
    }
    if (cur === '결석') {
        return 'background: rgba(255,71,87,0.08); color: var(--error); font-weight: 800; border: 1px solid rgba(255,71,87,0.15);';
    }
    if (cur === '지각') {
        return 'background: rgba(255,165,2,0.12); color: var(--warning); font-weight: 800; border: 1px solid rgba(255,165,2,0.18);';
    }
    if (cur === '보강') {
        return 'background: rgba(26,92,255,0.08); color: var(--primary); font-weight: 800; border: 1px solid rgba(26,92,255,0.15);';
    }
    if (cur === '상담') {
        return 'background: rgba(124,58,237,0.10); color: #7c3aed; font-weight: 800; border: 1px solid rgba(124,58,237,0.18);';
    }
    return 'background: var(--surface-2); color: var(--secondary); border: 1px solid var(--border);';
}

// [5G-2] PIN 일괄 배분 기능 (로직 사수)
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

// [Phase 4/5] 요약 계산 (로직 사수)
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

// [UI Standard Applied]: 학급 메인 화면
function openClassAttendance(cid) {
    state.ui.classDefaultTab = 'att';
    if (typeof openDashboardClass === 'function') openDashboardClass(cid);
    else renderClass(cid);
}

function openClassHomework(cid) {
    state.ui.classDefaultTab = 'hw';
    if (typeof openDashboardClass === 'function') openDashboardClass(cid);
    else renderClass(cid);
}

function renderClass(cid) {
    injectClassroomStyles();
    const defaultTab = state.ui.classDefaultTab || '';
    state.ui.classDefaultTab = null;
    state.ui.currentClassId = String(cid);
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const mIds = state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id));
    const today = new Date().toLocaleDateString('sv-SE');
    const summary = computeClassTodaySummary(cid);

    const icons = {
        qr: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
        grade: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20V10M18 20V4M6 20v-4"></path></svg>`,
        clinic: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path></svg>`,
        edit: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg>`
    };

    const opToolsPanel = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 16px 14px 0;">
            <div style="min-width: 0;">
                <div style="font-size: 20px; font-weight:700; color: var(--text); letter-spacing: -0.5px; line-height: 1.2;">${cls.name}</div>
                <div style="font-size: 11px; font-weight: 600; color: var(--secondary); margin-top: 2px; line-height: 1.5;">${formatClassScheduleDays(cls.schedule_days)}</div>
            </div>
            <button class="btn" style="min-height: 44px; padding: 10px 14px; font-size: 13px; font-weight:700; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--secondary); line-height: 1.2;" onclick="renderDashboard()">닫기</button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 24px; padding: 0 14px;">
            <button class="btn" style="padding: 16px 4px; font-size: 11px; font-weight:700; display: flex; flex-direction: column; align-items: center; gap: 8px; border-radius: 18px; background: var(--surface); border: 1px solid var(--border); color: var(--text); line-height: 1.2;" onclick="openQrGenerator('${cid}')">
                <span style="color: var(--primary);">${icons.qr}</span> <span>QR/OMR</span>
            </button>
            <button class="btn" style="padding: 16px 4px; font-size: 11px; font-weight:700; display: flex; flex-direction: column; align-items: center; gap: 8px; border-radius: 18px; background: var(--surface); border: 1px solid var(--border); color: var(--text); line-height: 1.2;" onclick="openExamGradeView('${cid}')">
                <span style="color: var(--primary);">${icons.grade}</span> <span>시험성적</span>
            </button>
            <button class="btn" style="padding: 16px 4px; font-size: 11px; font-weight:700; display: flex; flex-direction: column; align-items: center; gap: 8px; border-radius: 18px; background: var(--surface); border: 1px solid var(--border); color: var(--text); line-height: 1.2;" onclick="if(typeof openClinicBasketForClass==='function') openClinicBasketForClass('${cid}'); else toast('클리닉 준비중', 'warn');">
                <span style="color: var(--primary);">${icons.clinic}</span> <span>클리닉</span>
            </button>
            <button class="btn btn-primary" style="padding: 16px 4px; font-size: 11px; font-weight:700; display: flex; flex-direction: column; align-items: center; gap: 8px; border-radius: 18px; line-height: 1.2;" onclick="openClassRecordModal('${cid}')">
                <span style="color: #fff;">${icons.edit}</span> <span>진도관리</span>
            </button>
        </div>
    `;

    const statusBarHtml = summary.isScheduled
        ? `<div style="display: flex; gap: 12px; align-items: center;">
             <span>출석 <b style="color: var(--text); font-weight:700;">${summary.att}/${summary.total}</b></span>
             <span style="width: 1px; height: 12px; background: var(--border);"></span>
             <span>숙제 <b style="color: var(--text); font-weight:700;">${summary.hw}/${summary.total}</b></span>
           </div>`
        : `<span style="color: var(--warning); font-weight:700;">정규 수업일 아님</span>`;

    document.getElementById('app-root').innerHTML = `
        <div class="cls-fade-in">
            ${opToolsPanel}
            <div style="margin: 0 14px 18px; padding: 14px 16px; background: rgba(26,92,255,0.06); border: 1px solid rgba(26,92,255,0.1); border-radius: 16px; font-size: 12px; color: var(--primary); font-weight:700; display: flex; justify-content: space-between; align-items: center; line-height: 1.5;">
                <span>오늘 현황</span>
                ${statusBarHtml}
            </div>
            <div style="margin: 0 14px 32px;">
                <div class="card" style="padding: 8px 0; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); box-shadow: none;">
                    <div style="padding: 14px 20px; border-bottom: 1px solid var(--border);">
                        <h2 style="font-size: 16px; font-weight:700; color: var(--text); margin: 0; line-height: 1.3;">학생 명단</h2>
                    </div>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: var(--bg);">
                                <th style="padding: 10px 16px; font-size: 11px; color: var(--secondary); text-transform: uppercase; font-weight: 700; text-align: left;">Name</th>
                                <th style="padding: 10px 4px; font-size: 11px; color: var(--secondary); text-transform: uppercase; font-weight: 700; text-align: left;">School</th>
                                <th style="padding: 10px 16px; font-size: 11px; color: var(--secondary); text-align: right; text-transform: uppercase; font-weight: 700;">Status</th>
                            </tr>
                        </thead>
                        <tbody id="class-std-list"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const listRoot = document.getElementById('class-std-list');
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    listRoot.innerHTML = stds.map(s => {
        const att = state.db.attendance.find(a => String(a.student_id) === String(s.id) && a.date === today);
        const hw = state.db.homework.find(h => String(h.student_id) === String(s.id) && h.date === today);
        const attStatus = getAttendanceDisplayStatus(att?.status);
        const hwStatus = hw?.status || '완료';

        const attStyle = getAttendanceStatusStyle(attStatus);
        const attLabel = getAttendanceStatusLabel(attStatus);
        
        const hwStyle = hwStatus === '완료' 
            ? 'background: rgba(26,92,255,0.08); color: var(--primary); border: 1px solid rgba(26,92,255,0.15);' 
            : 'background: rgba(255,165,2,0.12); color: var(--warning); font-weight:700; border: 1px solid rgba(255,165,2,0.15);';

        return `<tr style="border-bottom: 1px solid var(--border);">
            <td onclick="renderStudentDetail('${s.id}')" style="padding: 14px 16px; cursor: pointer; font-weight:700; color: var(--primary); font-size: 14px; line-height: 1.4;">${s.name}</td>
            <td style="padding: 14px 4px; color: var(--secondary); font-size: 13px; font-weight: 600; line-height: 1.5;">${s.school_name}</td>
            <td style="padding: 14px 16px; text-align: right; white-space: nowrap;">
                <button class="btn class-att-toggle" style="padding: 4px 8px; font-size: 12px; min-width: 68px; font-weight:700; border-radius: 8px; ${attStyle}" onclick="toggleAtt('${s.id}')">${attLabel}</button>
                <button class="btn class-hw-toggle" style="padding: 4px 8px; font-size: 13px; min-width: 56px; font-weight:700; border-radius: 8px; ${hwStyle}" onclick="toggleHw('${s.id}')">${hwStatus}</button>
            </td>
        </tr>`;
    }).join('');

    if (defaultTab === 'att' || defaultTab === 'hw') {
        setTimeout(() => {
            const selector = defaultTab === 'att' ? '.class-att-toggle' : '.class-hw-toggle';
            const target = document.querySelector(selector);
            if (!target) return;
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            target.focus({ preventScroll: true });
        }, 0);
    }
}

// [UI Standard Applied]: 진도관리 모달 수동 보정
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
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight:700; min-width: 120px; color: var(--text); cursor: pointer; line-height: 1.5;">
                <input type="checkbox" class="record-tb-check" value="${tb.id}" data-title="${String(tb.title).replace(/"/g, '&quot;')}" ${isChecked} style="transform: scale(1.1); accent-color: var(--primary);">
                ${String(tb.title)}
            </label>
            <input type="text" class="cls-input record-tb-progress" id="progress_${tb.id}" value="${progVal}" placeholder="예: p.10~25" style="flex: 1; min-height: 44px;">
        </div>
        `;
    }).join('') : `<div style="font-size: 12px; color: var(--secondary); padding: 24px; text-align: center; background: var(--surface-2); border-radius: 16px; font-weight: 700; line-height: 1.5;">활성 교재 없음</div>`;

    const prevNote = existingRecord ? existingRecord.special_note : '';

    showModal('진도관리', `
        <div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">교재별 진도</h4>
                <span style="font-size: 11px; font-weight: 700; color: var(--secondary); line-height: 1.5;">${todayStr}</span>
            </div>
            <div style="background: var(--surface); padding: 4px 0;">
                ${booksHtml}
            </div>
        </div>
        <div style="margin-bottom: 32px;">
            <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">특이사항</h4>
            <textarea id="record-special-note" class="cls-input" placeholder="수업 특이사항 메모" style="height: 110px; resize: none; padding: 14px; line-height: 1.6;">${prevNote}</textarea>
        </div>
        <button class="btn btn-primary" style="width: 100%; min-height: 52px; padding: 14px 16px; font-size: 14px; font-weight:700; border-radius: 14px; box-shadow: none;" onclick="saveClassRecord('${cid}', '${todayStr}')">기록 저장하기</button>
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
        progresses.push({ textbook_id: tbId === 'fallback' ? '' : tbId, textbook_title_snapshot: tbTitle, progress_text: progText });
    });
    const specialNote = document.getElementById('record-special-note')?.value.trim() || '';
    let actualTeacherName = typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.ui.userName || '담당');
    const payload = { class_id: cid, date: dateStr, teacher_name: actualTeacherName, special_note: specialNote, progress: progresses };

    try {
        const r = await api.post('class-daily-records', payload);
        if (r?.success) {
            toast('저장 완료', 'success');
            closeModal();
            await loadData();
            return;
        }
        toast(r?.message || r?.error || '수업 기록 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[saveClassRecord] failed:', e);
        toast('수업 기록 저장 중 오류가 발생했습니다.', 'error');
    }
}


// [UI Standard Applied]: 출석부(Ledger) 엔진 수동 보정
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
    showModal('출석부', `
        <div style="display: flex; gap: 12px; flex-direction: column; margin-bottom: 16px; background: var(--surface-2); padding: 12px; border: 1px solid var(--border); border-radius: 16px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="ledger-date" class="cls-input" value="${ledgerState.date}" style="flex: 1.2; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.date=this.value;loadLedger();">
                <select id="ledger-class" class="cls-input" style="flex: 1; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.classId=this.value;renderLedgerTable();">
                    <option value="">전체 학급</option>${classOptions}
                </select>
            </div>
            <div style="display: flex; gap: 6px; background: var(--surface); padding: 4px; border: 1px solid var(--border); border-radius: 12px;">
                <button id="ledger-mode-att" class="btn" style="flex: 1; border: none; font-size: 13px; font-weight:700; border-radius: 10px; min-height: 38px;" onclick="ledgerState.mode='att';renderLedgerTable();">출결 기록</button>
                <button id="ledger-mode-hw" class="btn" style="flex: 1; border: none; font-size: 13px; font-weight:700; border-radius: 10px; min-height: 38px;" onclick="ledgerState.mode='hw';renderLedgerTable();">숙제 기록</button>
            </div>
        </div>
        <div id="ledger-table-wrap" style="max-height: 55vh; overflow-y: auto; padding-right: 4px;"></div>
    `);
    loadLedger();
}

function renderLedgerTable() {
    const attBtn = document.getElementById('ledger-mode-att');
    const hwBtn = document.getElementById('ledger-mode-hw');
    const isAtt = ledgerState.mode === 'att';
    if (attBtn) { attBtn.style.background = isAtt ? 'var(--surface-2)' : 'transparent'; attBtn.style.color = isAtt ? 'var(--primary)' : 'var(--secondary)'; attBtn.style.fontWeight = isAtt ? '950' : '700'; }
    if (hwBtn) { hwBtn.style.background = !isAtt ? 'var(--surface-2)' : 'transparent'; hwBtn.style.color = !isAtt ? 'var(--primary)' : 'var(--secondary)'; hwBtn.style.fontWeight = !isAtt ? '950' : '700'; }

    const cid = ledgerState.classId;
    const mIds = cid ? state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id)) : state.db.students.map(s => String(s.id));
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;

    const rows = stds.map(s => {
        const rec = records.find(r => String(r.student_id) === String(s.id) && (!r.date || r.date === ledgerState.date));
        const status = isAtt ? getAttendanceDisplayStatus(rec?.status) : (rec?.status || '완료');
        const label = isAtt ? getAttendanceStatusLabel(status) : status;
        let style = isAtt 
            ? getAttendanceStatusStyle(status)
            : (status === '완료' ? 'background: rgba(26,92,255,0.08); color: var(--primary); border: 1px solid rgba(26,92,255,0.15);' : 'background: rgba(255,165,2,0.12); color: var(--warning); font-weight:700; border: 1px solid rgba(255,165,2,0.15);');
        
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:700; color: var(--text); font-size: 14px; line-height: 1.4;">${s.name}</td>
            <td style="padding: 14px 4px; color: var(--secondary); font-size: 12px; font-weight: 600; line-height: 1.5;">${s.school_name}</td>
            <td style="padding: 14px 12px; text-align: right;">
                <button class="btn" style="padding: 4px 10px; font-size: 12px; min-width: ${isAtt ? '76px' : '60px'}; font-weight:700; border-radius: 8px; ${style}" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${label}</button>
            </td>
        </tr>`;
    }).join('');
    
    document.getElementById('ledger-table-wrap').innerHTML = `
        <div class="card" style="padding: 8px 0; border-radius: 18px; border: 1px solid var(--border); background: var(--surface); box-shadow: none;">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: var(--bg);">
                        <th style="padding: 10px 12px; font-size: 11px; color: var(--secondary); font-weight: 700; text-align: left;">STUDENT</th>
                        <th style="padding: 10px 4px; font-size: 11px; color: var(--secondary); font-weight: 700; text-align: left;">SCHOOL</th>
                        <th style="padding: 10px 12px; font-size: 11px; color: var(--secondary); font-weight: 700; text-align: right;">STATUS</th>
                    </tr>
                </thead>
                <tbody>${rows || '<tr><td colspan="3" style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:700;">조회 대상 없음</td></tr>'}</tbody>
            </table>
        </div>
    `;
}

async function toggleAtt(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => String(a.student_id) === String(sid) && a.date === today);
    const next = getNextAttendanceStatus(cur?.status);
    const r = await api.patch('attendance', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('저장 실패', 'warn'); return; }
    await refreshDataOnly();
    if (isLedger) await loadLedger(); else if (state.ui.currentClassId) renderClass(state.ui.currentClassId); else renderDashboard();
}

async function toggleHw(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => String(h.student_id) === String(sid) && h.date === today);
    const next = (cur?.status || '완료') === '완료' ? '미완료' : '완료';
    const r = await api.patch('homework', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('저장 실패', 'warn'); return; }
    await refreshDataOnly();
    if (isLedger) await loadLedger(); else if (state.ui.currentClassId) renderClass(state.ui.currentClassId); else renderDashboard();
}

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

// [UI Standard Applied]: 시험 성적 리스트 수동 보정
async function openExamGradeView(classId) {
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const activeCount = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원').length;
    let sessions = (state.db.exam_sessions || []).filter(es => ids.includes(String(es.student_id)));
    let assignments = [];
    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) {
            sessions = res.sessions.filter(es => ids.includes(String(es.student_id)));
            const classStudentIdSet = new Set(ids);
            assignments = Array.isArray(res.assignments) ? res.assignments.filter(a => classStudentIdSet.size && String(a.class_id) === String(classId)) : [];
        }
    } catch (e) { console.warn('[openExamGradeView] fail', e); }

    const activeCountForAssignment = activeCount || ids.length;
    const grouped = {};
    sessions.forEach(s => {
        const key = makeExamListKey(s.exam_title, s.exam_date, s.archive_file || '');
        if (!grouped[key]) grouped[key] = { title: s.exam_title, date: s.exam_date, archiveFile: s.archive_file || '', sessions: [], questionCount: s.question_count || 0, assignment: null };
        grouped[key].sessions.push(s);
        if (!grouped[key].questionCount && s.question_count) grouped[key].questionCount = s.question_count;
        if (!grouped[key].archiveFile && s.archive_file) grouped[key].archiveFile = s.archive_file;
    });

    assignments.forEach(a => {
        const key = makeExamListKey(a.exam_title, a.exam_date, a.archive_file || '');
        if (!grouped[key]) grouped[key] = { title: a.exam_title, date: a.exam_date, archiveFile: a.archive_file || '', sessions: [], questionCount: a.question_count || 0, assignment: a };
        else {
            grouped[key].assignment = a;
            if (!grouped[key].questionCount && a.question_count) grouped[key].questionCount = a.question_count;
            if (!grouped[key].archiveFile && a.archive_file) grouped[key].archiveFile = a.archive_file;
        }
    });

    const exams = Object.values(grouped).sort((a,b) => String(b.date).localeCompare(String(a.date)) || String(b.title).localeCompare(String(a.title)));
    const rows = exams.map(exam => {
        const cnt = exam.sessions.length;
        const qCount = exam.questionCount || exam.sessions[0]?.question_count || exam.assignment?.question_count || 0;
        const avg = cnt ? Math.round(exam.sessions.reduce((sum, s) => sum + Number(s.score || 0), 0) / cnt) : '-';
        const pct = activeCountForAssignment ? Math.round((cnt / activeCountForAssignment) * 100) : 0;
        const archiveArg = String(exam.archiveFile || '').replace(/'/g, "\\'");
        return `<div onclick="openExamDetail('${classId}', '${String(exam.title || '').replace(/'/g, "\\'")}', '${exam.date}')" style="padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
            <div>
                <div style="font-weight:700; color: var(--text); font-size: 15px; line-height: 1.4;">${exam.title}</div>
                <div style="font-size: 11px; color: var(--secondary); margin-top: 4px; font-weight: 600; line-height: 1.5;">${exam.date} · ${qCount}문항 · 제출 ${cnt}/${activeCountForAssignment}명 (${pct}%)</div>
            </div>
            <div style="text-align: right; display: flex; align-items: center; gap: 10px;">
                <div>
                    <div style="font-size: 20px; font-weight:700; color: var(--primary); line-height: 1;">${avg}</div>
                    <div style="font-size: 10px; color: var(--secondary); font-weight:700; margin-top:4px;">평균</div>
                </div>
                <button class="btn" onclick="event.stopPropagation(); if(typeof openOMR==='function') openOMR('', '${String(exam.title || '').replace(/'/g, "\\'")}', ${qCount || 20}, '${classId}', '', '${archiveArg}', 'examList', '${exam.date}');" style="padding: 7px 10px; font-size: 11px; font-weight:700; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">입력</button>
            </div>
        </div>`;
    }).join('');

    showModal('시험성적', `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px; font-weight:700; border-radius: 10px;" onclick="if(typeof openOMR==='function') openOMR('', '단원평가', 20, '${classId}', '', '', 'examList');">새 시험 입력</button>
        </div>
        ${rows || `<div style="text-align:center; padding:40px 20px; color:var(--secondary); font-size:13px; font-weight:700;">시험 기록 없음</div>`}
    `);
}

async function openExamDetail(classId, examTitle, examDate) {
    let sessionSource = state.db.exam_sessions || [];
    let wrongSource = state.db.wrong_answers || [];
    let assignmentSource = [];

    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
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
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:700; color: var(--primary); font-size: 14px; line-height: 1.4;">${s.name}</td>
            <td style="text-align: center; font-weight:700; color: var(--text); padding: 14px 4px; font-size: 14px;">${s.score}점</td>
            <td style="padding: 14px 4px;">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${s.wrongs.length ? s.wrongs.map(qid => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(s.session, qid) : `<span style="background: rgba(255,71,87,0.08); color: var(--error); padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid rgba(255,71,87,0.15);">Q${qid}</span>`).join('') : '<span style="color: var(--secondary); font-size: 11px; font-weight: 600;">없음</span>'}
                </div>
            </td>
            <td style="text-align: right; padding: 14px 12px;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn" style="padding: 4px 10px; font-size: 11px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; font-weight: 700; min-height: 32px;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','${s.sessionId || ''}','${sArchive}','examDetail','${examDate}')">수정</button>
                    <button class="btn" style="padding: 4px 10px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.15); background: rgba(255,71,87,0.05); border-radius: 8px; font-weight: 700; min-height: 32px;" onclick="deleteExamSession('${s.sessionId || ''}','${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">삭제</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const pendingHTML = pending.map(s => `<tr style="background-color: var(--bg); border-bottom: 1px solid var(--border);">
        <td style="padding: 14px 12px; color: var(--secondary); font-weight: 600; font-size: 14px;">${s.name}</td>
        <td colspan="2" style="text-align: center; font-size: 12px; color: var(--secondary); font-weight: 700; line-height: 1.5;">미제출</td>
        <td style="text-align: right; padding: 14px 12px;">
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 11px; font-weight:700; border-radius: 8px; min-height: 32px;" onclick="closeModal();openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','','${examArchiveFile}','examDetail','${examDate}')">입력</button>
        </td>
    </tr>`).join('');

    const weakUnitHtml = typeof renderWeakUnitSummary === 'function' ? renderWeakUnitSummary(classWeakUnits, '오답 데이터 없음', { clickable: true, mode: 'class', titlePrefix: '반 취약 단원', context: { targetType: 'class', targetId: classId, targetLabel: (state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '반', examTitle, examDate } }) : '';

    showModal(`${examTitle}`, `
        <div style="padding: 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; text-align: center;">
            <div style="font-size: 14px; font-weight:700; color: var(--text); line-height: 1.4;">제출 완료: <b style="color: var(--success);">${submitted.length}명</b> / 전체 ${submitted.length + pending.length}명</div>
            <div style="font-size: 11px; font-weight: 600; color: var(--secondary); margin-top: 4px; line-height: 1.5;">${examDate} · ${qCount}문항 기준</div>
        </div>
        <div style="margin-bottom: 24px; border: 1px solid rgba(26,92,255,0.15); border-radius: 18px; padding: 16px; background: rgba(26,92,255,0.02);">
            <div style="font-size: 14px; font-weight:700; margin-bottom: 12px; color: var(--primary); line-height: 1.3;">반 취약 단원 TOP</div>
            ${weakUnitHtml}
        </div>
        <div style="margin-bottom: 12px; text-align: right;">
            <button class="btn" style="padding: 6px 12px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.15); background: rgba(255,71,87,0.05); font-weight:700; border-radius: 10px;" onclick="deleteExamByClass('${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">시험 기록 전체 삭제</button>
        </div>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border); background: var(--bg);">
                    <th style="text-align: left; padding: 10px 12px; color: var(--secondary); font-weight: 700; font-size: 11px; text-transform: uppercase;">Name</th>
                    <th style="text-align: center; padding: 10px 4px; color: var(--secondary); font-weight: 700; font-size: 11px; text-transform: uppercase;">Score</th>
                    <th style="text-align: left; padding: 10px 4px; color: var(--secondary); font-weight: 700; font-size: 11px; text-transform: uppercase;">Wrong</th>
                    <th style="text-align: right; padding: 10px 12px; color: var(--secondary); font-weight: 700; font-size: 11px; text-transform: uppercase;">Action</th>
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
    closeModal(); await refreshDataOnly(); openExamDetail(classId, examTitle, examDate);
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
        closeModal(); await refreshDataOnly(); openExamGradeView(classId);
    } catch (e) { console.warn(e); toast('시험 전체삭제 실패', 'warn'); }
}
