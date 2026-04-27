/**
 * AP Math OS v26.1.2 [js/core.js]
 * 핵심 설정 및 데이터 동기화 엔진 (5F: 인증 및 진입 제어 통합 완결판)
 */

const CONFIG = {
    R2_URL: 'https://r2.ap-math.com',
    API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api'
};

// [5F] 로그인 세션 (localStorage 기반)
const AUTH_KEY = 'APMATH_SESSION';

function getSession() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null; } catch { return null; }
}
function setSession(data) { localStorage.setItem(AUTH_KEY, JSON.stringify(data)); }
function clearSession() { localStorage.removeItem(AUTH_KEY); }

function getAuthHeader() {
    const s = getSession();
    if (!s) return {};
    return { 'Authorization': 'Basic ' + btoa(`${s.login_id}:${s.raw_password}`) };
}

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
    auth: { id: null, name: null, role: null }, // [5F] 인증 상태 추가
    ui: { viewScope: 'teacher', userName: '', currentClassId: null },
    db: { 
        students: [], classes: [], class_students: [], attendance: [], homework: [], 
        exam_sessions: [], wrong_answers: [], attendance_history: [], homework_history: [],
        consultations: [], operation_memos: [], exam_schedules: []
    }
};

let syncQueue = JSON.parse(localStorage.getItem('AP_SYNC_QUEUE') || '[]');

const RISK_LOOKBACK_DAYS = 14;
const RISK_ABSENCE_THRESHOLD = 2;
const RISK_HOMEWORK_THRESHOLD = 3;
const RISK_WRONG_THRESHOLD = 3;
const RISK_MUTE_DAYS = 2;
const RISK_MUTE_KEY = 'APMATH_MUTED_RISKS';

const api = {
    async get(res) {
        try { const r = await fetch(`${CONFIG.API_BASE}/${res}`, { headers: { 'Content-Type': 'application/json', ...getAuthHeader() } }); return await r.json(); } catch (e) { return {}; }
    },
    async patch(res, d) {
        if (!navigator.onLine) return addToSyncQueue('PATCH', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, { method: 'PATCH', body: JSON.stringify(d), headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        return await r.json();
    },
    async delete(res, id) {
        if (!navigator.onLine) return addToSyncQueue('DELETE', `${res}/${id}`, {});
        const r = await fetch(`${CONFIG.API_BASE}/${res}/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        return await r.json();
    },
    async post(res, d) {
        if (!navigator.onLine) return addToSyncQueue('POST', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, { method: 'POST', body: JSON.stringify(d), headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        return await r.json();
    }
};

// [5F] 로그인 화면 렌더링 (진입 차단)
function renderLogin() {
    const root = document.getElementById('app-root');
    const scopeBtn = document.querySelector('header nav button');
    let logoutBtn = document.getElementById('btn-logout');

    if (scopeBtn) scopeBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';

    root.innerHTML = `
        <div class="card" style="max-width: 400px; margin: 60px auto; text-align: center; padding: 40px 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
            <h2 style="color:var(--primary); margin-top:0; letter-spacing:-1px;">AP Math OS</h2>
            <p style="color:var(--secondary); font-size:14px; margin-bottom:30px;">선생님 계정으로 로그인하세요</p>
            <div style="display:flex; flex-direction:column; gap:12px;">
                <input id="login-id" type="text" class="btn" placeholder="아이디" style="width:100%; text-align:left; cursor:text;">
                <input id="login-pw" type="password" class="btn" placeholder="비밀번호" style="width:100%; text-align:left; cursor:text;" onkeyup="if(event.key==='Enter')handleLogin()">
                <button class="btn btn-primary" style="width:100%; margin-top:10px; padding:14px;" onclick="handleLogin()">로그인</button>
            </div>
        </div>
    `;
}

// [5F] 로그인 처리
async function handleLogin() {
    const lid = document.getElementById('login-id').value.trim();
    const lpw = document.getElementById('login-pw').value.trim();
    if (!lid || !lpw) { toast('아이디와 비밀번호를 입력하세요.', 'warn'); return; }

    try {
        const r = await fetch(`${CONFIG.API_BASE}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ login_id: lid, password: lpw }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await r.json();

        if (r.ok && data.success) {
            setSession({ login_id: lid, raw_password: lpw, id: data.id, name: data.name, role: data.role });
            toast(`${data.name} 선생님, 환영합니다.`, 'info');
            await loadData(true);
        } else {
            toast(data.message || '로그인 실패', 'error');
        }
    } catch (e) {
        toast('네트워크 오류. 다시 시도해주세요.', 'error');
    }
}

// [5F] 로그아웃
function logout() {
    clearSession();
    state.auth = { id: null, name: null, role: null };
    state.ui.userName = '';
    renderLogin();
    toast('로그아웃 되었습니다.', 'info');
}

// [5F] 데이터 로드 및 권한 제어 통합
async function loadData(isInitial = false) {
    const session = getSession();
    
    // 1. 비로그인 상태면 즉시 차단 및 로그인 화면 표시
    if (!session) {
        renderLogin();
        return; 
    }

    // 2. 로그인 성공 시 상태 반영
    state.auth = { id: session.id, name: session.name, role: session.role };
    state.ui.userName = session.name;

    // 3. UI 버튼 권한 제어 (Admin vs Teacher)
    const scopeBtn = document.querySelector('header nav button');
    if (state.auth.role === 'admin') {
        if (scopeBtn) {
            scopeBtn.style.display = 'inline-flex';
            scopeBtn.onclick = toggleScope; 
        }
    } else {
        state.ui.viewScope = 'teacher'; // 일반 교사는 자기 담당반만 보도록 강제 고정
        if (scopeBtn) scopeBtn.style.display = 'none';
    }

    // 로그아웃 버튼 노출
    let logoutBtn = document.getElementById('btn-logout');
    if (!logoutBtn) {
        const nav = document.querySelector('header nav');
        if (nav) {
            logoutBtn = document.createElement('button');
            logoutBtn.id = 'btn-logout';
            logoutBtn.className = 'btn';
            logoutBtn.style.color = 'var(--error)';
            logoutBtn.style.borderColor = 'var(--error)';
            logoutBtn.innerHTML = '로그아웃';
            logoutBtn.onclick = logout;
            nav.appendChild(logoutBtn);
        }
    } else {
        logoutBtn.style.display = 'inline-flex';
    }

    // 4. API 데이터 페칭
    if (isInitial) toast('데이터 동기화 중...', 'info');
    const data = await api.get('initial-data');
    
    // 인증 실패 (비밀번호 변경 등) 시 즉각 튕겨냄
    if (data.error && data.error === 'Unauthorized') {
        logout();
        return;
    }

    state.db = {
        classes: (data.classes && data.classes.length) ? data.classes : SEED_DATA.classes,
        students: (data.students && data.students.length) ? data.students : SEED_DATA.students,
        class_students: (data.class_students && data.class_students.length) ? data.class_students : SEED_DATA.map,
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        homework: Array.isArray(data.homework) ? data.homework : [],
        exam_sessions: Array.isArray(data.exam_sessions) ? data.exam_sessions : [],
        wrong_answers: Array.isArray(data.wrong_answers) ? data.wrong_answers : [],
        attendance_history: Array.isArray(data.attendance_history) ? data.attendance_history : [],
        homework_history: Array.isArray(data.homework_history) ? data.homework_history : [],
        consultations: Array.isArray(data.consultations) ? data.consultations : [],
        operation_memos: Array.isArray(data.operation_memos) ? data.operation_memos : [],
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : []
    };
    
    if (state.ui.currentClassId) renderClass(state.ui.currentClassId);
    else renderDashboard();
}

async function refreshDataOnly() {
    const session = getSession();
    if (!session) return;

    const data = await api.get('initial-data');
    if (data.error) return;

    state.db = { 
        ...state.db, 
        attendance: Array.isArray(data.attendance) ? data.attendance : [], 
        homework: Array.isArray(data.homework) ? data.homework : [], 
        exam_sessions: Array.isArray(data.exam_sessions) ? data.exam_sessions : [], 
        wrong_answers: Array.isArray(data.wrong_answers) ? data.wrong_answers : [], 
        attendance_history: Array.isArray(data.attendance_history) ? data.attendance_history : [], 
        homework_history: Array.isArray(data.homework_history) ? data.homework_history : [],
        consultations: Array.isArray(data.consultations) ? data.consultations : [],
        operation_memos: Array.isArray(data.operation_memos) ? data.operation_memos : [],
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : []
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
            await fetch(`${CONFIG.API_BASE}/${task.resource}`, { method: task.method, body: JSON.stringify(task.data), headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
            syncQueue = syncQueue.filter(t => t.id !== task.id);
            localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
        } catch (e) { break; }
    }
    toast('동기화 완료', 'info'); await loadData();
}

async function goHome() { 
    if (!getSession()) return; 
    state.ui.currentClassId = null; 
    await loadData(); 
}

function toggleScope() { 
    if (state.auth.role !== 'admin') return; 
    state.ui.viewScope = state.ui.viewScope === 'teacher' ? 'all' : 'teacher'; 
    const scopeText = document.getElementById('scope-text');
    if(scopeText) scopeText.innerText = state.ui.viewScope === 'teacher' ? '내 담당' : '전체 보기';
    renderDashboard(); 
}