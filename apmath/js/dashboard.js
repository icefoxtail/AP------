/**
 * AP Math OS v26.1.2 [js/dashboard.js]
 * 대시보드 계산, 렌더링 및 학원 운영 메뉴 엔진
 */

/**
 * ⚙️ 운영 메뉴 모달 오픈 (4G)
 */
function openOperationMenu() {
    const isOnline = navigator.onLine;
    const qLen = syncQueue.length;
    const syncStatusText = qLen > 0 ? `⚠️ 대기 중 ${qLen}건` : "✅ 대기 없음";
    const onlineStatusText = isOnline ? "🟢 온라인" : "🔴 오프라인";

    showModal('⚙️ 학원 운영 관리', `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="padding-bottom:16px; border-bottom:1px solid var(--border);">
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">학생 관리</label>
                <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openDischargedStudents();">
                    🗄️ 퇴원생 목록 조회 / 복구
                </button>
            </div>

            <div>
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">시스템 및 동기화 상태</label>
                <div class="card" style="margin:0; padding:12px; background:#f8f9fa; border-style:dashed;">
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px;">
                        <span>네트워크 상태:</span>
                        <b style="color:${isOnline ? 'var(--success)' : 'var(--error)'}">${onlineStatusText}</b>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:12px;">
                        <span>미전송 데이터:</span>
                        <b style="color:${qLen > 0 ? 'var(--warning)' : 'var(--success)'}">${syncStatusText}</b>
                    </div>
                    <button class="btn btn-primary" style="width:100%; font-size:12px; padding:8px;" onclick="processSyncQueue(); closeModal();">
                        🔄 지금 동기화 시도
                    </button>
                </div>
            </div>
        </div>
    `);
}

/**
 * 대시보드 데이터 계산 엔진
 */
function computeDashboardData() {
    const today = new Date().toLocaleDateString('sv-SE');
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    const activeIds = new Set(activeStudents.map(s => s.id));
    
    const todayAtt = state.db.attendance.filter(a => a.date === today && activeIds.has(a.student_id));
    const presentCount = todayAtt.filter(a => a.status === '등원').length;
    const absentCount = todayAtt.filter(a => a.status === '결석').length;

    const todayHw = state.db.homework.filter(h => h.date === today && activeIds.has(h.student_id));
    const hwDoneCount = todayHw.filter(h => h.status === '완료').length;
    const hwNotDoneCount = Math.max(activeStudents.length - hwDoneCount, 0);

    const attHis = state.db.attendance_history || [];
    const hwHis = state.db.homework_history || [];
    
    const examsByStudent = new Map();
    state.db.exam_sessions.forEach(es => {
        if (!examsByStudent.has(es.student_id)) examsByStudent.set(es.student_id, []);
        examsByStudent.get(es.student_id).push(es);
    });
    const wrongBySession = new Map();
    state.db.wrong_answers.forEach(w => { 
        wrongBySession.set(w.session_id, (wrongBySession.get(w.session_id) || 0) + 1); 
    });

    const studentsData = {};
    let wrongRiskCount = 0;
    const priorityAll = [];

    activeStudents.forEach(s => {
        const sid = s.id;
        const absCount = attHis.filter(a => a.student_id === sid && a.status === '결석').length;
        const hwMissCount = hwHis.filter(h => h.student_id === sid && h.status !== '완료').length;
        
        let isWrongRisk = false;
        const sExams = examsByStudent.get(sid) || [];
        if (sExams.length > 0) {
            sExams.sort((a,b) => String(b.exam_date).localeCompare(String(a.exam_date)) || String(b.id).localeCompare(String(a.id)));
            if ((wrongBySession.get(sExams[0].id) || 0) >= RISK_WRONG_THRESHOLD) isWrongRisk = true;
        }

        const isAbsenceRisk = absCount >= RISK_ABSENCE_THRESHOLD;
        const isHwRisk = hwMissCount >= RISK_HOMEWORK_THRESHOLD;
        const riskScore = (isAbsenceRisk?1:0) + (isHwRisk?1:0) + (isWrongRisk?1:0);
        const rankWeight = riskScore * 1000 + (isAbsenceRisk?500:0) + (isWrongRisk?100:0);

        const sd = { 
            id: sid, name: s.name, tags: [], riskScore, rankWeight, 
            riskLevel: riskScore===3?'🔴 긴급':riskScore===2?'🟠 주의':riskScore===1?'🟡 관찰':'', 
            className: state.db.classes.find(c => c.id === (state.db.class_students.find(m => m.student_id===sid)?.class_id))?.name || '미배정' 
        };
        if (isAbsenceRisk) sd.tags.push('결석누적'); if (isHwRisk) sd.tags.push('숙제미달'); if (isWrongRisk) sd.tags.push('오답경고');
        if (isWrongRisk) wrongRiskCount++;
        studentsData[sid] = sd;
        if (riskScore >= 1 && !isRiskMuted(sid)) priorityAll.push(sd);
    });

    priorityAll.sort((a, b) => b.rankWeight - a.rankWeight || a.name.localeCompare(b.name));
    
    const classSummaries = {};
    state.db.classes.forEach(c => {
        const cIds = state.db.class_students.filter(m => m.class_id === c.id).map(m => m.student_id).filter(id => activeIds.has(id));
        let cRisk=0, cMiss=0, cAbs=0, cPre=0;
        cIds.forEach(id => {
            const att = todayAtt.find(a => a.student_id===id);
            if (att?.status==='등원') cPre++;
            if (att?.status==='결석') cAbs++;
            if (todayHw.find(h => h.student_id===id)?.status!=='완료') cMiss++;
            if (studentsData[id]?.riskScore >= 1) cRisk++;
        });
        classSummaries[c.id] = { activeCount: cIds.length, present: cPre, absent: cAbs, hwNotDone: cMiss, riskCount: cRisk };
    });

    return { 
        global: { totalActive: activeStudents.length, presentCount, absentCount, hwDoneCount, hwNotDoneCount, wrongRiskCount }, 
        priorityTop: priorityAll.slice(0, 1), 
        classSummaries 
    };
}

/**
 * 학급 요약 카드 렌더링
 */
function renderClassSummaryCard(cls, data, todayExam) {
    const s = data.classSummaries[cls.id]; if (!s) return '';
    const today = new Date().toLocaleDateString('sv-SE');
    const cIds = state.db.class_students.filter(m => m.class_id === cls.id).map(m => m.student_id);
    const activeIds = state.db.students.filter(st => cIds.includes(st.id) && st.status === '재원').map(st => st.id);
    const testDone = todayExam
        ? new Set(state.db.exam_sessions.filter(es => es.exam_date === today && es.exam_title === todayExam.title && activeIds.includes(es.student_id)).map(es => es.student_id)).size
        : 0;
    const n = s.activeCount || 1;
    const attRate  = Math.round((s.present / n) * 100);
    const hwRate   = Math.round(((n - s.hwNotDone) / n) * 100);
    
    const testRateStr = todayExam ? `성 ${Math.round((testDone / n) * 100)}%` : `성 —`;
    
    return `
        <div class="card" onclick="renderClass('${cls.id}')" style="cursor:pointer; margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between; min-height: 120px; padding: 16px;">
            <div>
                <div style="font-weight:800; font-size:17px; display:flex; justify-content:space-between;">
                    ${cls.name} <span style="font-size:12px; font-weight:normal; color:var(--secondary);">재원 ${s.activeCount}</span>
                </div>
                <div style="font-size:13px; color:var(--secondary); margin-top:6px;">
                    등원 ${s.present} <span style="opacity:0.3;">|</span> <span style="color:${s.absent > 0 ? 'var(--error)' : 'inherit'}; font-weight:${s.absent > 0 ? '700' : 'normal'};">결석 ${s.absent}</span>
                </div>
            </div>
            <div style="display:flex; gap:6px; margin-top:10px;">
                <span style="background:${s.hwNotDone > 0 ? '#fef7e0' : '#f1f3f4'}; color:${s.hwNotDone > 0 ? '#b06000' : '#5f6368'}; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700;">숙제 ${s.hwNotDone}</span>
                <span style="background:${s.riskCount > 0 ? '#fce8e6' : '#f1f3f4'}; color:${s.riskCount > 0 ? '#c5221f' : '#5f6368'}; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700;">위험 ${s.riskCount}</span>
            </div>
            <div style="margin-top:8px; font-size:11px; color:var(--secondary); opacity:0.75;">
                출 ${attRate}% · 숙 ${hwRate}% · ${testRateStr}
            </div>
        </div>
    `;
}

/**
 * 대시보드 메인 렌더링 (4G)
 */
function renderDashboard() {
    state.ui.currentClassId = null;
    const data = computeDashboardData();
    const todayExam = getTodayExamConfig();
    const closeData = computeTodayCloseData(todayExam);
    const root = document.getElementById('app-root');

    const examBadge = todayExam 
        ? `<span style="background:#e8f0fe; color:#1a73e8; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700; border:1px solid #c2d7fa; white-space:nowrap;">시험: ${todayExam.title}</span>` 
        : `<span style="background:#f1f3f4; color:#5f6368; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700; white-space:nowrap;">오늘 시험 없음</span>`;

    const academyStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="margin:0; font-size:16px;">🏢 학원 현황</h3>
                ${examBadge}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="openOperationMenu()">⚙️ 운영</button>
                <button class="btn btn-primary" style="padding:6px 10px; font-size:11px;" onclick="copyAcademySummary()">📋 요약 복사</button>
            </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:10px; margin-bottom:28px;">
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--primary);"><div style="font-size:22px; font-weight:900;">${data.global.totalActive}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">재원생</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--success);"><div style="font-size:22px; font-weight:900; color:var(--success);">${data.global.presentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">등원</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--error);"><div style="font-size:22px; font-weight:900; color:var(--error);">${data.global.absentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">결석</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--warning);"><div style="font-size:22px; font-weight:900; color:var(--warning);">${data.global.hwNotDoneCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">숙제미달</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid #c5221f;"><div style="font-size:22px; font-weight:900; color:#c5221f;">${data.global.wrongRiskCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">오답위험</div></div>
        </div>
    `;

    const syncWarning = syncQueue.length > 0 
        ? `<div style="background:#fce8e6; color:#c5221f; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; margin-bottom:12px; text-align:center; border:1px solid #f9d2ce;">⚠️ 인터넷 끊김: ${syncQueue.length}건의 마감 데이터 대기 중</div>` 
        : '';

    const noTestStr = todayExam ? `성적 미입력 <b>${closeData.noTest.length}</b>명` : `<span style="opacity:0.6;">성적 (시험 없음)</span>`;
    
    const closeBanner = closeData.allClear
        ? `${syncWarning}<div style="display:flex; align-items:center; gap:10px; background:#e6f4ea; border:1px solid #a8d5b5; border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:14px; color:#1e6b34;">
            <span style="font-size:20px;">✅</span>
            <div><b>오늘 수업 마감 완료</b><br><span style="font-size:12px; opacity:0.8;">${todayExam ? '출결·숙제·성적 모두 처리되었습니다.' : '출결·숙제 기록이 완료되었습니다.'}</span></div>
          </div>`
        : `${syncWarning}<div onclick="openTodayCloseModal('att')" style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#fff8e1; border:1px solid #f9ab00; border-radius:12px; padding:14px 16px; margin-bottom:20px; cursor:pointer;">
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:20px;">📋</span>
                <div style="font-size:14px; color:#7a4f00;">
                    <b>오늘 수업 마감 체크</b><br>
                    <span style="font-size:12px;">
                        출결 미처리 <b>${closeData.noAtt.length}</b>명 &nbsp;·&nbsp;
                        숙제 미처리 <b>${closeData.noHw.length}</b>명 &nbsp;·&nbsp;
                        ${noTestStr}
                    </span>
                </div>
            </div>
            <span style="font-size:18px; color:#f9ab00;">›</span>
          </div>`;

    const classes = state.ui.viewScope === 'all' ? state.db.classes : state.db.classes.filter(c => c.teacher_name === state.ui.userName);
    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap;">
            <h3 style="margin:0; font-size:16px;">📂 학급별 운영 현황</h3>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="renderAttendanceLedger()">📋 출석부</button>
            </div>
        </div>
        <div class="grid" style="margin-bottom:32px;">${classes.map(c => renderClassSummaryCard(c, data, todayExam)).join('')}</div>
    `;

    let prioSec = '';
    if (data.priorityTop.length > 0) {
        const s = data.priorityTop[0];
        prioSec = `
            <h3 style="margin:0 0 12px 0; font-size:16px; color:var(--error);">🎯 집중 확인 학생</h3>
            <div class="card" style="padding:16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; border-left: 5px solid var(--error);" onclick="renderStudentDetail('${s.id}')">
                <div>
                    <div style="font-weight:800; font-size:16px;">${s.name} <span style="font-size:12px; font-weight:normal; color:var(--secondary); margin-left:6px;">${s.className}</span></div>
                    <div style="display:flex; gap:4px; margin-top:6px;">
                        ${s.tags.map(t => `<span style="background:#fce8e6; color:#c5221f; padding:1px 6px; border-radius:4px; font-size:11px; font-weight:700;">${t}</span>`).join('')}
                        <span style="font-size:12px; margin-left:4px;">${s.riskLevel}</span>
                    </div>
                </div>
                <button class="btn" style="padding:8px 16px; font-size:13px; font-weight:700; border-color:var(--border);" onclick="event.stopPropagation(); muteRiskStudent('${s.id}')">확인</button>
            </div>
        `;
    } else {
        prioSec = `<div style="text-align:center; padding:20px; opacity:0.5; font-size:13px;">✅ 현재 집중 확인이 필요한 학생이 없습니다.</div>`;
    }

    // 4G: 대시보드 하단 퇴원생 링크 제거 상태 유지
    root.innerHTML = academyStatus + closeBanner + classStatus + prioSec;
    document.getElementById('scope-text').innerText = state.ui.viewScope === 'all' ? '전체 관리' : '내 담당';
}

/**
 * 위험 관리 유틸리티
 */
function getMutedRisks() { return JSON.parse(localStorage.getItem(RISK_MUTE_KEY) || '{}'); }
function saveMutedRisks(data) { localStorage.setItem(RISK_MUTE_KEY, JSON.stringify(data)); }

function muteRiskStudent(sid) { 
    const muted = getMutedRisks(); 
    muted[sid] = new Date().toLocaleDateString('sv-SE'); 
    saveMutedRisks(muted); 
    toast('확인 처리 완료', 'info'); 
    renderDashboard(); 
}

function dateToDayIndex(str) { 
    const [y, m, d] = String(str).split('-').map(Number); 
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000); 
}

function isRiskMuted(sid) {
    const muted = getMutedRisks(); 
    const mutedDate = muted[sid]; 
    if (!mutedDate) return false;
    const today = new Date().toLocaleDateString('sv-SE');
    const diff = dateToDayIndex(today) - dateToDayIndex(mutedDate);
    return diff >= 0 && diff < RISK_MUTE_DAYS;
}

/**
 * 오늘 마감 데이터 계산
 */
function computeTodayCloseData(todayExam = getTodayExamConfig()) {
    const today = new Date().toLocaleDateString('sv-SE');
    const active = state.db.students.filter(s => s.status === '재원');
    const activeIds = new Set(active.map(s => s.id));

    const attTodaySet = new Set(
        state.db.attendance.filter(a => a.date === today && activeIds.has(a.student_id)).map(a => a.student_id)
    );
    const hwTodaySet = new Set(
        state.db.homework.filter(h => h.date === today && activeIds.has(h.student_id)).map(h => h.student_id)
    );
    const testTodaySet = todayExam ? new Set(
        state.db.exam_sessions.filter(es => es.exam_date === today && es.exam_title === todayExam.title && activeIds.has(es.student_id)).map(es => es.student_id)
    ) : new Set();

    const noAtt = [], noHw = [], noTest = [];
    active.forEach(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const className = state.db.classes.find(c => c.id === cid)?.name || '미배정';
        const info = { id: s.id, name: s.name, className };

        if (!attTodaySet.has(s.id)) noAtt.push(info);
        if (!hwTodaySet.has(s.id)) noHw.push(info);
        if (todayExam && !testTodaySet.has(s.id)) noTest.push(info);
    });

    const totalActive = active.length;
    return {
        totalActive, todayExam, noAtt, attDone: totalActive - noAtt.length,
        noHw, hwDone: totalActive - noHw.length,
        noTest, testDone: todayExam ? totalActive - noTest.length : 0,
        allClear: noAtt.length === 0 && noHw.length === 0 && (!todayExam || noTest.length === 0)
    };
}

/**
 * 퀵 액션: 출결 토글
 */
async function quickToggleAtt(sid, status, tab = 'att') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('attendance', { studentId: sid, status, date: today });
    if (!r?.success) { toast('출결 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(tab);
}

/**
 * 퀵 액션: 숙제 토글
 */
async function quickToggleHw(sid, status, tab = 'hw') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('homework', { studentId: sid, status, date: today });
    if (!r?.success) { toast('숙제 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(tab);
}

/**
 * 운영 요약 텍스트 빌드
 */
function buildAcademySummary() {
    const today = new Date().toLocaleDateString('sv-SE');
    const todayExam = getTodayExamConfig();
    const closeData = computeTodayCloseData(todayExam);

    let text = `[AP Math 운영 마감 보고 - ${today}]\n\n`;
    text += `오늘 시험: ${todayExam ? todayExam.title : '없음'}\n`;
    text += `재원생: ${closeData.totalActive}명\n`;
    text += `출결 처리: ${closeData.attDone}/${closeData.totalActive}\n`;
    text += `숙제 처리: ${closeData.hwDone}/${closeData.totalActive}\n`;
    if (todayExam) text += `성적 입력: ${closeData.testDone}/${closeData.totalActive}\n`;

    if (closeData.allClear) text += `\n✅ 오늘 운영 마감 완료`;
    else {
        text += `\n⚠️ 미처리 항목\n- 출결 미처리: ${closeData.noAtt.length}명\n- 숙제 미처리: ${closeData.noHw.length}명\n`;
        if (todayExam) text += `- 성적 미입력: ${closeData.noTest.length}명\n`;
    }
    return text;
}

/**
 * 운영 요약 복사
 */
function copyAcademySummary() {
    const text = buildAcademySummary();
    navigator.clipboard.writeText(text).then(() => toast('운영 요약이 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

/**
 * 오늘 마감 상세 모달
 */
function openTodayCloseModal(tab = 'att') {
    const todayExam = getTodayExamConfig();
    const d = computeTodayCloseData(todayExam);

    const testTabLabel = todayExam ? `성적 미입력 ${d.noTest.length}` : `성적 -`;
    const testTabEmptyMsg = todayExam ? '모든 학생 성적 입력 완료 ✅' : '오늘 시험이 설정되지 않았습니다.';

    const tabs = [
        { key: 'att',  label: `출결 미처리 ${d.noAtt.length}`,  list: d.noAtt,  emptyMsg: '모든 학생 출결 처리 완료 ✅' },
        { key: 'hw',   label: `숙제 미처리 ${d.noHw.length}`,   list: d.noHw,   emptyMsg: '모든 학생 숙제 처리 완료 ✅' },
        { key: 'test', label: testTabLabel, list: todayExam ? d.noTest : [], emptyMsg: testTabEmptyMsg }
    ];
    const cur = tabs.find(t => t.key === tab) || tabs[0];

    const tabBtns = tabs.map(t => `
        <button onclick="openTodayCloseModal('${t.key}')" style="
            flex:1; padding:10px 4px; border:none; border-radius:8px; font-size:12px; font-weight:700;
            background:${t.key === tab ? 'var(--primary)' : '#f1f3f4'};
            color:${t.key === tab ? 'white' : 'var(--secondary)'};
            cursor:pointer;">
            ${t.label}
        </button>
    `).join('');

    const rows = cur.list.length
        ? cur.list.map(s => {
            let actionBtns = '';
            if (tab === 'att') {
                actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleAtt('${s.id}', '등원', '${tab}')">✅ 등원</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--error); border-color:var(--error);" onclick="quickToggleAtt('${s.id}', '결석', '${tab}')">❌ 결석</button></div>`;
            } else if (tab === 'hw') {
                actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleHw('${s.id}', '완료', '${tab}')">✅ 완료</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--warning); border-color:var(--warning);" onclick="quickToggleHw('${s.id}', '미완료', '${tab}')">❌ 미완료</button></div>`;
            } else if (tab === 'test') {
                const preset = todayExam ? todayExam.title.replace(/'/g, "\\'") : '';
                actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="closeModal();openOMR('${s.id}', '${preset}')">성적 입력</button></div>`;
            }
            return `
                <div style="padding:14px 4px; border-bottom:1px solid var(--border);">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div onclick="closeModal();renderStudentDetail('${s.id}')" style="cursor:pointer; flex:1;">
                            <span style="font-weight:700; font-size:15px;">${s.name}</span>
                            <span style="font-size:12px; color:var(--secondary); margin-left:8px;">${s.className}</span>
                        </div>
                        <span onclick="closeModal();renderStudentDetail('${s.id}')" style="font-size:12px; color:var(--primary); cursor:pointer;">→ 프로필</span>
                    </div>
                    ${actionBtns}
                </div>`;
        }).join('')
        : `<div style="padding:32px 16px; text-align:center; color:var(--success); font-weight:700; font-size:14px;">${cur.emptyMsg}</div>`;

    showModal('📋 오늘 마감 상세', `<div style="display:flex; gap:6px; margin-bottom:16px;">${tabBtns}</div><div>${rows}</div>`);
}

/**
 * 오늘 시험 설정 모달 (복구)
 */
function openTodayExamSetModal() {
    const cfg = getTodayExamConfig();
    showModal('⚙️ 오늘 시험 설정', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <p style="margin:0; font-size:13px; color:var(--secondary);">오늘 전체 학급에 적용될 시험 기준을 설정합니다.<br>(QR 코드 생성 시에도 자동 연동됩니다)</p>
            <div style="display:flex; gap:4px; flex-wrap:wrap; margin:6px 0;">
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='쪽지시험'">쪽지시험</button>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='단원평가'">단원평가</button>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='월말평가'">월말평가</button>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='모의고사'">모의고사</button>
            </div>
            <input id="set-exam-title" class="btn" placeholder="시험명 직접 입력" value="${cfg?.title || ''}" style="text-align:left; width:100%;">
            <input id="set-exam-q" type="number" class="btn" placeholder="문항 수" value="${cfg?.q || 20}" min="1" max="50" style="text-align:left; width:100%;">
            <div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">
                <button class="btn btn-primary" style="flex:1; min-width:120px; padding:12px;" onclick="handleSetTodayExam()">저장 및 적용</button>
                <button class="btn" style="flex:1; min-width:120px; padding:12px; color:var(--error); border-color:var(--error);" onclick="clearTodayExamConfig(); closeModal();">시험 없음 처리</button>
            </div>
        </div>
    `);
}

/**
 * 오늘 시험 설정 저장 (복구)
 */
function handleSetTodayExam() {
    const t = document.getElementById('set-exam-title').value.trim();
    const q = parseInt(document.getElementById('set-exam-q').value, 10) || 20;
    if (!t) { toast('시험명을 입력하세요.', 'warn'); return; }
    setTodayExamConfig(t, q);
    toast('오늘 시험이 설정되었습니다.', 'info');
    closeModal();
    renderDashboard();
}