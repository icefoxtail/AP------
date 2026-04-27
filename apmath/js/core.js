/**
 * AP Math OS v26.1.2 [js/core.js]
 * 핵심 설정 및 데이터 동기화 엔진 (5G Phase 1: 인증 및 역할별 관제센터 진입 제어 통합)
 */

const CONFIG = {
    R2_URL: 'https://r2.ap-math.com',
    API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api'
};

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

const SEED_DATA = { classes: [], students: [], map: [] }; // 5G부터는 API 연동이 필수이므로 시드 데이터 비중을 낮춤

let state = {
    auth: { id: null, name: null, role: null },
    ui: { viewScope: 'teacher', userName: '', currentClassId: null },
    db: { 
        students: [], classes: [], class_students: [], attendance: [], homework: [], 
        exam_sessions: [], wrong_answers: [], exam_blueprints: [], attendance_history: [], homework_history: [],
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
            toast(`${data.name} 님, 환영합니다.`, 'info');
            await loadData(true);
        } else {
            toast(data.message || '로그인 실패', 'error');
        }
    } catch (e) {
        toast('네트워크 오류. 다시 시도해주세요.', 'error');
    }
}

function logout() {
    clearSession();
    state.auth = { id: null, name: null, role: null };
    state.ui.userName = '';
    renderLogin();
    toast('로그아웃 되었습니다.', 'info');
}

async function loadData(isInitial = false) {
    const session = getSession();
    if (!session) { renderLogin(); return; }

    state.auth = { id: session.id, name: session.name, role: session.role };
    state.ui.userName = session.name;

    // [5G] 상단 토글 버튼 숨김 (각 역할에 맞는 고정 뷰 사용)
    const scopeBtn = document.querySelector('header nav button');
    if (scopeBtn) scopeBtn.style.display = 'none';

    let logoutBtn = document.getElementById('btn-logout');
    if (!logoutBtn) {
        const nav = document.querySelector('header nav');
        if (nav) {
            logoutBtn = document.createElement('button');
            logoutBtn.id = 'btn-logout';
            logoutBtn.className = 'btn';
            logoutBtn.style.color = 'var(--error)';
            logoutBtn.style.borderColor = 'var(--border)';
            logoutBtn.innerHTML = '로그아웃';
            logoutBtn.onclick = logout;
            nav.appendChild(logoutBtn);
        }
    } else {
        logoutBtn.style.display = 'inline-flex';
    }

    if (isInitial) toast('데이터 동기화 중...', 'info');
    const data = await api.get('initial-data');
    if (data.error && data.error === 'Unauthorized') { logout(); return; }

    state.db = {
        classes: Array.isArray(data.classes) ? data.classes : [],
        students: Array.isArray(data.students) ? data.students : [],
        class_students: Array.isArray(data.class_students) ? data.class_students : [],
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        homework: Array.isArray(data.homework) ? data.homework : [],
        exam_sessions: Array.isArray(data.exam_sessions) ? data.exam_sessions : [],
        wrong_answers: Array.isArray(data.wrong_answers) ? data.wrong_answers : [],
        exam_blueprints: Array.isArray(data.exam_blueprints) ? data.exam_blueprints : [],
        attendance_history: Array.isArray(data.attendance_history) ? data.attendance_history : [],
        homework_history: Array.isArray(data.homework_history) ? data.homework_history : [],
        consultations: Array.isArray(data.consultations) ? data.consultations : [],
        operation_memos: Array.isArray(data.operation_memos) ? data.operation_memos : [],
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : []
    };
    
    if (state.ui.currentClassId) {
        renderClass(state.ui.currentClassId);
    } else {
        if (state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') {
            renderAdminControlCenter();
        } else {
            renderDashboard();
        }
    }
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
        exam_blueprints: Array.isArray(data.exam_blueprints) ? data.exam_blueprints : (state.db.exam_blueprints || []),
        attendance_history: Array.isArray(data.attendance_history) ? data.attendance_history : [], 
        homework_history: Array.isArray(data.homework_history) ? data.homework_history : [],
        consultations: Array.isArray(data.consultations) ? data.consultations : [],
        operation_memos: Array.isArray(data.operation_memos) ? data.operation_memos : [],
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : []
    };
}


// [3C1] exam_blueprints 병합 및 오답 문항 단원 표시 헬퍼
function setExamBlueprintsForFiles(blueprints = []) {
    if (!Array.isArray(blueprints)) return;

    const incomingKeys = new Set(
        blueprints
            .filter(bp => bp && bp.archive_file && bp.question_no !== undefined && bp.question_no !== null)
            .map(bp => `${bp.archive_file}::${Number(bp.question_no)}`)
    );

    const kept = (state.db.exam_blueprints || []).filter(bp =>
        !incomingKeys.has(`${bp.archive_file}::${Number(bp.question_no)}`)
    );

    state.db.exam_blueprints = kept.concat(blueprints);
}

function findBlueprintForWrong(session, questionId) {
    if (!session || !session.archive_file) return null;

    const qNo = Number(questionId);
    if (!Number.isFinite(qNo)) return null;

    return (state.db.exam_blueprints || []).find(bp =>
        bp.archive_file === session.archive_file &&
        Number(bp.question_no) === qNo
    ) || null;
}

function buildWrongUnitChip(session, questionId) {
    const bp = findBlueprintForWrong(session, questionId);
    const qNo = String(questionId);
    const unit = bp ? (bp.standard_unit || bp.standard_unit_key || '') : '';
    const label = unit ? `Q${qNo} · ${unit}` : `Q${qNo}`;

    return `<span style="display:inline-flex;align-items:center;background:#fce8e6;color:#d93025;border-radius:999px;padding:2px 7px;margin:2px;font-size:11px;font-weight:700;line-height:1.4;">${label}</span>`;
}

async function ensureBlueprintsForSessions(sessions = []) {
    const files = [...new Set(
        (sessions || [])
            .map(s => s && s.archive_file)
            .filter(v => v && String(v).trim())
    )];

    for (const file of files) {
        const already = (state.db.exam_blueprints || []).some(bp => bp.archive_file === file);
        if (already) continue;

        try {
            const res = await api.get(`exam-blueprints?file=${encodeURIComponent(file)}`);
            if (res && Array.isArray(res.items)) {
                setExamBlueprintsForFiles(res.items);
            }
        } catch (e) {
            console.warn('[3C1] blueprint load failed:', file, e);
        }
    }
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

// [5G] admin이면 원장 관제센터로 이동
async function goHome() { 
    if (!getSession()) return; 
    state.ui.currentClassId = null; 
    await loadData(); 
}