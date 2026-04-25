/**
 * AP Math OS v26.1.2 [IRONCLAD]
 * 통합 프론트엔드 엔진 - 운영 안정화 3차 최종 통합본
 * (관제센터 1.1 + QR 3.0 + 출석부 탭/버튼 동기화 완결)
 */

const CONFIG = {
    R2_URL: 'https://r2.ap-math.com',
    API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api'
};

const SEED_DATA = {
    classes: [
        { id: 'm1_a', name: '중1A', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm1_b', name: '중1B', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm1_c', name: '중1C', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm2_a', name: '중2A', grade: '중2', subject: '수학', teacher_name: '박준성' },
        { id: 'm2_b', name: '중2B', grade: '중2', subject: '수학', teacher_name: '박준성' },
        { id: 'm3_a', name: '중3A', grade: '중3', subject: '수학', teacher_name: '박준성' },
        { id: 'm3_b', name: '중3B', grade: '중3', subject: '수학', teacher_name: '박준성' }
    ],
    students: [
        { id: 's01', name: '한세아', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's02', name: '홍서령', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's03', name: '김수인', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's04', name: '김다희', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's05', name: '임진후', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's06', name: '황시아', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's07', name: '남지율', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's08', name: '남지우', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's09', name: '최윤아', school_name: '왕의중', grade: '중1', status: '재원' },
        { id: 's10', name: '조희태', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's11', name: '임주현', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's12', name: '백주흔', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's13', name: '김도현', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's14', name: '임현성', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's15', name: '박현종', school_name: '왕의중', grade: '중2', status: '재원' },
        { id: 's16', name: '왕유준', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's17', name: '강형우', school_name: '동산중', grade: '중2', status: '재원' },
        { id: 's18', name: '이시온', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's19', name: '이상원', school_name: '삼산중', grade: '중3', status: '재원' },
        { id: 's20', name: '조예령', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's21', name: '유채민', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's22', name: '서유나', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's23', name: '박정원', school_name: '매산중', grade: '중3', status: '재원' },
        { id: 's24', name: '이시윤', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's25', name: '강현욱', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's26', name: '남지혁', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's27', name: '유예준', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's28', name: '김지융', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's29', name: '박현성', school_name: '왕운중', grade: '중3', status: '재원' }
    ],
    map: [
        { class_id: 'm1_a', student_id: 's01' }, { class_id: 'm1_a', student_id: 's02' }, { class_id: 'm1_a', student_id: 's03' }, { class_id: 'm1_a', student_id: 's04' }, { class_id: 'm1_a', student_id: 's05' },
        { class_id: 'm1_b', student_id: 's06' }, { class_id: 'm1_b', student_id: 's07' }, { class_id: 'm1_b', student_id: 's08' }, { class_id: 'm1_b', student_id: 's09' },
        { class_id: 'm1_c', student_id: 's10' }, { class_id: 'm1_c', student_id: 's11' },
        { class_id: 'm2_a', student_id: 's12' }, { class_id: 'm2_a', student_id: 's13' }, { class_id: 'm2_a', student_id: 's14' }, { class_id: 'm2_a', student_id: 's15' }, { class_id: 'm2_a', student_id: 's16' }, { class_id: 'm2_a', student_id: 's17' },
        { class_id: 'm3_a', student_id: 's18' }, { class_id: 'm3_a', student_id: 's19' }, { class_id: 'm3_a', student_id: 's20' }, { class_id: 'm3_a', student_id: 's21' }, { class_id: 'm3_a', student_id: 's22' },
        { class_id: 'm3_b', student_id: 's23' }, { class_id: 'm3_b', student_id: 's24' }, { class_id: 'm3_b', student_id: 's25' }, { class_id: 'm3_b', student_id: 's26' }, { class_id: 'm3_b', student_id: 's27' }, { class_id: 'm3_b', student_id: 's28' }, { class_id: 'm3_b', student_id: 's29' }
    ]
};

let state = {
    ui: { viewScope: 'teacher', userName: '박준성', currentClassId: null, showDischarged: false },
    db: { students: [], classes: [], class_students: [], attendance: [], homework: [], exam_sessions: [], wrong_answers: [], attendance_history: [], homework_history: [] }
};

let syncQueue = JSON.parse(localStorage.getItem('AP_SYNC_QUEUE') || '[]');

// --- 상수 (운영 관제 및 리스크 관리) ---
const RISK_LOOKBACK_DAYS = 14;
const RISK_ABSENCE_THRESHOLD = 2;
const RISK_HOMEWORK_THRESHOLD = 3;
const RISK_WRONG_THRESHOLD = 3;
const RISK_MUTE_DAYS = 2;
const RISK_MUTE_KEY = 'APMATH_MUTED_RISKS';

const api = {
    async get(res) {
        try {
            const r = await fetch(`${CONFIG.API_BASE}/${res}`);
            return await r.json();
        } catch (e) { return {}; }
    },
    async patch(res, d) {
        if (!navigator.onLine) return addToSyncQueue('PATCH', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, { method: 'PATCH', body: JSON.stringify(d), headers: { 'Content-Type': 'application/json' } });
        return await r.json();
    },
    async delete(res, id) {
        if (!navigator.onLine) return addToSyncQueue('DELETE', `${res}/${id}`, {});
        const r = await fetch(`${CONFIG.API_BASE}/${res}/${id}`, { method: 'DELETE' });
        return await r.json();
    },
    async post(res, d) {
        if (!navigator.onLine) return addToSyncQueue('POST', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, { method: 'POST', body: JSON.stringify(d), headers: { 'Content-Type': 'application/json' } });
        return await r.json();
    }
};

/**
 * 데이터 로드 및 전역 라우팅
 */
async function loadData(isInitial = false) {
    if (isInitial) toast('시스템 초기화 중...', 'info');
    const data = await api.get('initial-data');
    state.db = {
        classes: (data.classes && data.classes.length) ? data.classes : SEED_DATA.classes,
        students: (data.students && data.students.length) ? data.students : SEED_DATA.students,
        class_students: (data.class_students && data.class_students.length) ? data.class_students : SEED_DATA.map,
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        homework: Array.isArray(data.homework) ? data.homework : [],
        exam_sessions: Array.isArray(data.exam_sessions) ? data.exam_sessions : [],
        wrong_answers: Array.isArray(data.wrong_answers) ? data.wrong_answers : [],
        attendance_history: Array.isArray(data.attendance_history) ? data.attendance_history : [],
        homework_history: Array.isArray(data.homework_history) ? data.homework_history : []
    };
    if (state.ui.currentClassId) renderClass(state.ui.currentClassId);
    else renderDashboard();
}

/**
 * UI 리렌더링 없이 데이터만 동기화 (최소 부하)
 */
async function refreshDataOnly() {
    const data = await api.get('initial-data');
    state.db = { 
        ...state.db, 
        attendance: data.attendance, 
        homework: data.homework, 
        exam_sessions: data.exam_sessions, 
        wrong_answers: data.wrong_answers, 
        attendance_history: data.attendance_history, 
        homework_history: data.homework_history 
    };
}

function addToSyncQueue(method, resource, data) {
    syncQueue.push({ id: Date.now(), method, resource, data });
    localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
    toast('오프라인: 대기열 저장', 'warn');
    return { success: true, offline: true };
}

async function processSyncQueue() {
    if (!navigator.onLine || syncQueue.length === 0) return;
    for (const task of [...syncQueue]) {
        try {
            await fetch(`${CONFIG.API_BASE}/${task.resource}`, { method: task.method, body: JSON.stringify(task.data), headers: { 'Content-Type': 'application/json' } });
            syncQueue = syncQueue.filter(t => t.id !== task.id);
            localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
        } catch (e) { break; }
    }
    toast('동기화 완료', 'info'); await loadData();
}

async function goHome() { 
    state.ui.currentClassId = null; 
    await loadData(); 
}

function toggleScope() { 
    state.ui.viewScope = state.ui.viewScope === 'teacher' ? 'all' : 'teacher'; 
    renderDashboard(); 
}

// --- Mute & Risk 로직 (운영 관제센터 1.1) ---
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
 * 대시보드 계산 엔진 (computeDashboardData)
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

function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id]; if (!s) return '';
    return `
        <div class="card" onclick="renderClass('${cls.id}')" style="cursor:pointer; margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between; min-height: 110px; padding: 16px;">
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
        </div>
    `;
}

function renderDashboard() {
    state.ui.currentClassId = null;
    const data = computeDashboardData();
    const root = document.getElementById('app-root');

    const academyStatus = `
        <h3 style="margin:0 0 12px 0; font-size:16px;">🏢 학원 현황</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:10px; margin-bottom:28px;">
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--primary);"><div style="font-size:22px; font-weight:900;">${data.global.totalActive}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">재원생</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--success);"><div style="font-size:22px; font-weight:900; color:var(--success);">${data.global.presentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">등원</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--error);"><div style="font-size:22px; font-weight:900; color:var(--error);">${data.global.absentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">결석</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--warning);"><div style="font-size:22px; font-weight:900; color:var(--warning);">${data.global.hwNotDoneCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">숙제미달</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid #c5221f;"><div style="font-size:22px; font-weight:900; color:#c5221f;">${data.global.wrongRiskCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">오답위험</div></div>
        </div>
    `;

    const classes = state.ui.viewScope === 'all' ? state.db.classes : state.db.classes.filter(c => c.teacher_name === state.ui.userName);
    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0; font-size:16px;">📂 학급별 운영 현황</h3>
            <div style="display:flex; gap:6px;">
                <button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="renderAttendanceLedger()">📋 출석부</button>
                <button class="btn" style="padding:6px 10px; font-size:12px;" onclick="openAddStudent()">+ 학생</button>
            </div>
        </div>
        <div class="grid" style="margin-bottom:32px;">${classes.map(c => renderClassSummaryCard(c, data)).join('')}</div>
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

    root.innerHTML = academyStatus + classStatus + prioSec;
    document.getElementById('scope-text').innerText = state.ui.viewScope === 'all' ? '전체 관리' : '내 담당';
}

function renderClass(cid) {
    state.ui.currentClassId = cid;
    const cls = state.db.classes.find(c => c.id === cid);
    const mIds = state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id);
    const today = new Date().toLocaleDateString('sv-SE');

    document.getElementById('app-root').innerHTML = `
        <div style="display:flex; gap:10px; margin-bottom:15px; align-items:center; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="openQrGenerator('${cid}')">📱 시험 QR 생성</button>
            <button class="btn" onclick="toggleShowDischarged()" style="${state.ui.showDischarged ? 'background:#f1f3f4;' : ''}">
                ${state.ui.showDischarged ? '👁 제적자 포함' : '재원만 보기'}
            </button>
            <button class="btn" onclick="openAddStudent('${cid}')">+ 학생 추가</button>
        </div>
        <div class="card">
            <h2>${cls.name} 관리 <span style="font-weight:normal; opacity:0.5; font-size:14px;">(재원 ${state.db.students.filter(s => mIds.includes(s.id) && s.status==='재원').length}명)</span></h2>
            <table>
                <thead><tr><th>이름</th><th>학교</th><th style="text-align:right;">출결/숙제/성적</th></tr></thead>
                <tbody id="class-std-list"></tbody>
            </table>
        </div>
    `;

    const listRoot = document.getElementById('class-std-list');
    const stds = state.db.students.filter(s => mIds.includes(s.id)).filter(s => state.ui.showDischarged || s.status==='재원');
    
    const examsByStudent = new Map();
    state.db.exam_sessions.forEach(es => {
        if (!examsByStudent.has(es.student_id)) examsByStudent.set(es.student_id, []);
        examsByStudent.get(es.student_id).push(es);
    });
    const wrongBySession = new Map();
    state.db.wrong_answers.forEach(w => { 
        wrongBySession.set(w.session_id, (wrongBySession.get(w.session_id) || 0) + 1); 
    });

    listRoot.innerHTML = stds.map(s => {
        const att = state.db.attendance.find(a => a.student_id===s.id && a.date===today);
        const hw = state.db.homework.find(h => h.student_id===s.id && h.date===today);
        const sExams = examsByStudent.get(s.id) || [];
        let wc = 0;
        if (sExams.length > 0) {
            sExams.sort((a,b) => String(b.exam_date).localeCompare(String(a.exam_date)) || String(b.id).localeCompare(String(a.id)));
            wc = wrongBySession.get(sExams[0].id) || 0;
        }

        return `<tr style="${s.status==='제적'?'opacity:0.5;':''}">
            <td onclick="renderStudentDetail('${s.id}')" style="cursor:pointer; font-weight:800; color:var(--primary);">${s.name} ${wc>0?`<span style="display:inline-block; background:#fce8e6; color:#d93025; border-radius:20px; padding:1px 8px; font-size:10px; font-weight:700; margin-left:4px;">🔴 오답 ${wc}</span>`:''}</td>
            <td>${s.school_name}</td>
            <td style="text-align:right;">
                ${s.status==='제적'?'-':`
                    <button class="btn ${att?.status==='등원'?'btn-primary':''}" style="padding:4px 8px; font-size:11px;" onclick="toggleAtt('${s.id}')">${att?.status||'미정'}</button>
                    <button class="btn ${hw?.status==='완료'?'btn-primary':''}" style="padding:4px 8px; font-size:11px;" onclick="toggleHw('${s.id}')">${hw?.status||'미완료'}</button>
                    <button class="btn btn-primary" style="padding:4px 8px; font-size:11px;" onclick="openOMR('${s.id}')">성적</button>
                `}
            </td>
        </tr>`;
    }).join('');
}

// --- QR 생성 엔진 (QR 3.0) ---
function openQrGenerator(cid) {
    const cls = state.db.classes.find(c => c.id === cid);
    const today = new Date().toLocaleDateString('sv-SE');
    showModal('📱 시험 QR 생성', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <p style="margin:0;"><b>대상 학급:</b> ${cls.name}</p>
            <div>
                <label style="font-size:12px; color:var(--secondary);">시험명 선택/입력:</label>
                <div style="display:flex; gap:4px; margin:6px 0;">
                    <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('qr-exam').value='단원평가'">단원평가</button>
                    <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('qr-exam').value='쪽지시험'">쪽지시험</button>
                    <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('qr-exam').value='중간고사'">중간고사</button>
                </div>
                <input id="qr-exam" class="btn" value="단원평가" style="width:100%; text-align:left;">
            </div>
            <div>
                <label style="font-size:12px; color:var(--secondary);">문항 수 (1~50):</label>
                <input id="qr-q" type="number" class="btn" value="20" min="1" max="50" style="width:100%; text-align:left;">
            </div>
            <div>
                <label style="font-size:12px; color:var(--secondary);">시험 날짜:</label>
                <input id="qr-date" type="date" class="btn" value="${today}" style="width:100%; text-align:left;">
            </div>
            <div id="qr-result-area" class="hidden" style="text-align:center; margin-top:15px; border-top:1px solid var(--border); padding-top:15px;">
                <img id="qr-img" style="width:180px; height:180px; margin-bottom:10px; border: 1px solid #ddd; padding: 5px; background: white;">
                <div id="qr-url" style="font-size:11px; word-break:break-all; background:#f1f3f4; padding:8px; border-radius:8px; margin-bottom:10px; color:var(--secondary);"></div>
                <button class="btn btn-primary" style="width:100%;" onclick="copyQrUrl()">URL 복사</button>
            </div>
        </div>
    `, 'QR 코드 생성', generateQrCode);
}

function generateQrCode() {
    const cid = state.ui.currentClassId;
    const exam = document.getElementById('qr-exam').value.trim();
    const q = parseInt(document.getElementById('qr-q').value) || 20;
    const date = document.getElementById('qr-date').value;

    if (!exam || q < 1 || q > 50) { toast('입력 정보를 확인하세요 (문항 수 1~50).', 'warn'); return; }

    const appBasePath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/apmath\/?$/, '/');
    const baseUrl = window.location.origin + appBasePath + 'check/';
    const fullUrl = `${baseUrl}?class=${cid}&exam=${encodeURIComponent(exam)}&q=${q}&date=${date}`;
    
    document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
    document.getElementById('qr-url').innerText = fullUrl;
    document.getElementById('qr-result-area').classList.remove('hidden');
    toast('QR 코드가 생성되었습니다.', 'info');
}

function copyQrUrl() {
    const url = document.getElementById('qr-url').innerText;
    navigator.clipboard.writeText(url).then(() => toast('URL 복사 완료!', 'info'));
}

// --- 출석부 시스템 (Ledger / 출석부 3.1) ---
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

async function goDashboardFromLedger() {
    await refreshDataOnly();
    state.ui.currentClassId = null;
    renderDashboard();
}

/**
 * 출석부 메인 프레임 (탭 ID 부여 완료)
 */
function renderAttendanceLedger() {
    const classOptions = state.db.classes.map(c => `<option value="${c.id}" ${c.id === ledgerState.classId ? 'selected' : ''}>${c.name}</option>`).join('');
    document.getElementById('app-root').innerHTML = `
        <div style="display:flex;gap:10px;margin-bottom:15px;align-items:center;flex-wrap:wrap;">
            <button class="btn" onclick="goDashboardFromLedger()">← 홈</button>
            <h2 style="margin:0;">📋 출석부</h2>
        </div>
        <div class="card" style="margin-bottom:12px;">
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                <input type="date" id="ledger-date" class="btn" value="${ledgerState.date}" style="width:160px;" onchange="ledgerState.date=this.value;loadLedger();">
                <select id="ledger-class" class="btn" style="flex:1;min-width:120px;" onchange="ledgerState.classId=this.value;renderLedgerTable();">
                    <option value="">전체 반</option>${classOptions}
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

/**
 * 출석부 테이블 렌더러 (탭 색상 동기화 및 방어식 rec 조회 적용)
 */
function renderLedgerTable() {
    // [보정] 상단 탭 버튼 활성화 상태 실시간 동기화
    const attModeBtn = document.getElementById('ledger-mode-att');
    const hwModeBtn = document.getElementById('ledger-mode-hw');
    if (attModeBtn && hwModeBtn) {
        attModeBtn.classList.toggle('btn-primary', ledgerState.mode === 'att');
        hwModeBtn.classList.toggle('btn-primary', ledgerState.mode === 'hw');
    }

    const cid = ledgerState.classId;
    const mIds = cid ? state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id) : state.db.students.map(s => s.id);
    const stds = state.db.students.filter(s => mIds.includes(s.id) && s.status === '재원');
    const isAtt = ledgerState.mode === 'att';
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;

    const bulkArea = document.getElementById('bulk-btn-area');
    if (bulkArea) {
        bulkArea.innerHTML = isAtt ? 
            `<button class="btn btn-primary" style="flex:1;" onclick="handleBulkAtt('등원')">✅ 전체 등원</button><button class="btn" style="flex:1;color:var(--error);border-color:var(--error);" onclick="handleBulkAtt('결석')">❌ 전체 결석</button>` : 
            `<button class="btn btn-primary" style="flex:1;" onclick="handleBulkHw('완료')">✅ 전체 완료</button><button class="btn" style="flex:1;color:var(--error);border-color:var(--error);" onclick="handleBulkHw('미완료')">❌ 전체 미완료</button>`;
    }

    const rows = stds.map(s => {
        const rec = records.find(r => r.student_id === s.id && (!r.date || r.date === ledgerState.date));
        const status = isAtt ? (rec?.status || '미정') : (rec?.status || '미완료');
        const isActive = isAtt ? status === '등원' : status === '완료';
        return `<tr><td style="font-weight:700;">${s.name}</td><td>${s.school_name}</td><td style="text-align:right;"><button class="btn ${isActive ? 'btn-primary' : ''}" style="padding:6px 14px;font-size:13px;min-width:75px;" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${status}</button></td></tr>`;
    }).join('');

    document.getElementById('ledger-table-wrap').innerHTML = `
        <p style="font-size:13px;color:#5f6368;margin-bottom:12px;">${ledgerState.date} · ${cid ? state.db.classes.find(c=>c.id===cid)?.name : '전체 반'} · ${isAtt?'출결':'숙제'}</p>
        <table><thead><tr><th>이름</th><th>학교</th><th style="text-align:right;">상태</th></tr></thead><tbody>${rows || '<tr><td colspan="3" style="text-align:center;opacity:0.5;padding:20px;">표시할 학생이 없습니다.</td></tr>'}</tbody></table>
    `;
}

async function handleBulkAtt(status) {
    const cid = ledgerState.classId;
    if (!confirm(`${ledgerState.date} 기준 전체를 "${status}"으로 처리할까요?`)) return;
    const sids = cid ? state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id) : state.db.students.map(s => s.id);
    const stds = state.db.students.filter(s => sids.includes(s.id) && s.status === '재원');
    const entries = stds.map(s => ({ studentId: s.id, status, date: ledgerState.date }));
    const r = await fetch(`${CONFIG.API_BASE}/attendance-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entries }) });
    if (r.ok) { toast('일괄 처리 완료', 'info'); if (ledgerState.date === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); }
}

async function handleBulkHw(status) {
    const cid = ledgerState.classId;
    if (!confirm(`${ledgerState.date} 기준 전체를 "${status}"으로 처리할까요?`)) return;
    const sids = cid ? state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id) : state.db.students.map(s => s.id);
    const stds = state.db.students.filter(s => sids.includes(s.id) && s.status === '재원');
    const entries = stds.map(s => ({ studentId: s.id, status, date: ledgerState.date }));
    const r = await fetch(`${CONFIG.API_BASE}/homework-batch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ entries }) });
    if (r.ok) { toast('일괄 처리 완료', 'info'); if (ledgerState.date === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); }
}

// --- 코어 핸들러 (성공 검증 필수 포함) ---
async function toggleAtt(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => a.student_id === sid && a.date === today);
    const next = cur?.status === '등원' ? '결석' : '등원';
    
    const r = await api.patch('attendance', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('출결 저장 실패', 'warn'); return; }

    if (isLedger) { if (today === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); } 
    else await loadData();
}

async function toggleHw(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => h.student_id === sid && h.date === today);
    const next = cur?.status === '완료' ? '미완료' : '완료';
    
    const r = await api.patch('homework', { studentId: sid, status: next, date: today });
    if (!r?.success) { toast('숙제 저장 실패', 'warn'); return; }

    if (isLedger) { if (today === new Date().toLocaleDateString('sv-SE')) await refreshDataOnly(); await loadLedger(); } 
    else await loadData();
}

function openOMR(sid) {
    showModal('성적 직접 입력', `
        시험명: <input id="omr-title" class="btn" value="단원평가" style="width:100%; text-align:left;">
        <div class="omr-grid">${Array.from({length:10},(_,i)=>`<div class="omr-item">Q${i+1}<br><input type="checkbox" class="omr-q" value="${i+1}"></div>`).join('')}</div>
    `, '저장', () => handleOMRSave(sid));
}

async function handleOMRSave(sid) {
    const title = document.getElementById('omr-title').value;
    const wrs = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const score = (10-wrs.length)*10;
    await api.patch('exam-sessions/new', { student_id: sid, exam_title: title, score, wrong_ids: wrs, exam_date: new Date().toLocaleDateString('sv-SE') });
    toast(`${score}점 저장됨`, 'info'); closeModal(); await loadData();
}

function renderStudentDetail(sid) {
    const s = state.db.students.find(st => st.id === sid);
    const exs = state.db.exam_sessions.filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    const rows = exs.map(e => {
        const wrs = state.db.wrong_answers.filter(w => w.session_id === e.id).map(w => `<span style="display:inline-block;background:#fce8e6;color:#d93025;border-radius:4px;padding:2px 6px;margin:2px;font-size:11px;font-weight:700;">Q${w.question_id}</span>`).join('');
        return `<tr><td>${e.exam_date}</td><td>${e.exam_title}</td><td style="text-align:center;"><b>${e.score}점</b></td><td><div style="display:flex;flex-wrap:wrap;gap:2px;">${wrs||'없음'}</div></td><td><button class="btn" style="color:var(--error); padding:2px 8px; font-size:11px;" onclick="handleDeleteSession('${e.id}','${sid}')">삭제</button></td></tr>`;
    }).join('');
    showModal(`${s.name} 프로필`, `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <p style="margin:0;">${s.school_name} | ${s.grade}</p>
            <button class="btn" style="font-size:11px; padding:4px 8px;" onclick="openEditStudent('${sid}')">정보 수정</button>
        </div>
        <h4>성적 및 오답 이력</h4>
        <table><thead><tr><th>날짜</th><th>시험명</th><th>점수</th><th>오답</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="5">기록 없음</td></tr>'}</tbody></table>
        ${s.status==='재원'?`<button class="btn" style="color:var(--error); margin-top:20px;" onclick="handleDelete('${sid}')">제적 처리</button>`:`<button class="btn btn-primary" style="margin-top:20px;" onclick="handleRestore('${sid}')">재원 복구</button>`}
    `);
}

async function handleDelete(sid) { if(confirm('제적 처리하시겠습니까?')) { await api.delete('students', sid); closeModal(); await loadData(); } }
async function handleRestore(sid) { if(confirm('재원으로 복구하시겠습니까?')) { await api.patch(`students/${sid}/restore`, {}); closeModal(); await loadData(); } }
async function handleDeleteSession(eid, sid) { if(confirm('기록을 삭제하시겠습니까?')) { await api.delete('exam-sessions', eid); closeModal(); await loadData(); renderStudentDetail(sid); } }

function openEditStudent(sid) {
    const s = state.db.students.find(st => st.id === sid);
    const curCid = state.db.class_students.find(m => m.student_id === sid)?.class_id || '';
    const opts = state.db.classes.map(c => `<option value="${c.id}" ${c.id===curCid?'selected':''}>${c.name}</option>`).join('');
    showModal('학생 정보 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-name" class="btn" value="${s.name}" style="text-align:left;">
            <input id="edit-school" class="btn" value="${s.school_name}" style="text-align:left;">
            <select id="edit-grade" class="btn">
                <option value="중1" ${s.grade==='중1'?'selected':''}>중1</option>
                <option value="중2" ${s.grade==='중2'?'selected':''}>중2</option>
                <option value="중3" ${s.grade==='중3'?'selected':''}>중3</option>
            </select>
            <select id="edit-class" class="btn"><option value="">반 미배정</option>${opts}</select>
        </div>
    `, '저장', () => handleEditStudent(sid));
}

async function handleEditStudent(sid) {
    const n = document.getElementById('edit-name').value, sc = document.getElementById('edit-school').value, g = document.getElementById('edit-grade').value, c = document.getElementById('edit-class').value;
    await api.patch(`students/${sid}`, { name: n, school_name: sc, grade: g, class_id: c });
    closeModal(); await loadData();
}

function toggleShowDischarged() { state.ui.showDischarged = !state.ui.showDischarged; renderClass(state.ui.currentClassId); }

function openAddStudent(defaultCid = '') {
    const opts = state.db.classes.map(c => `<option value="${c.id}" ${c.id===defaultCid?'selected':''}>${c.name}</option>`).join('');
    showModal('신규 학생 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-name" class="btn" placeholder="이름" style="text-align:left;">
            <input id="add-school" class="btn" placeholder="학교" style="text-align:left;">
            <select id="add-grade" class="btn"><option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option></select>
            <select id="add-class" class="btn"><option value="">반 선택</option>${opts}</select>
        </div>
    `, '추가', handleAddStudent);
}

async function handleAddStudent() {
    const n = document.getElementById('add-name').value, sc = document.getElementById('add-school').value, g = document.getElementById('add-grade').value, c = document.getElementById('add-class').value;
    if(!n || !sc) return;
    await api.post('students', { name: n, school_name: sc, grade: g, class_id: c });
    closeModal(); await loadData();
}

/**
 * 전역 유틸리티 (Toast, Modal)
 */
function toast(m, t='info') { const c = document.getElementById('toast-container'), el = document.createElement('div'); el.className=`toast ${t}`; el.innerText=m; c.appendChild(el); setTimeout(() => el.remove(), 3000); }
function showModal(t, b, at=null, af=null) { document.getElementById('modal-title').innerText=t; document.getElementById('modal-body').innerHTML=b; const ab = document.getElementById('modal-action-btn'); if(at&&af){ ab.innerText=at; ab.onclick=af; ab.classList.remove('hidden'); } else ab.classList.add('hidden'); document.getElementById('modal-overlay').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal-overlay').classList.add('hidden'); }

window.onload = async () => { await loadData(true); if (navigator.onLine) await processSyncQueue(); };