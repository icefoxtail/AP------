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


// [3C2] 취약 단원 통계 계산 헬퍼
function getWrongConceptFromSession(session, questionId) {
    const bp = findBlueprintForWrong(session, questionId);
    if (!bp) return null;

    const unitKey = bp.standard_unit_key || '';
    const unit = bp.standard_unit || unitKey;
    const course = bp.standard_course || '';
    const cluster = bp.concept_cluster_key || '';

    if (!unit && !unitKey && !cluster) return null;

    return { unitKey, unit, course, cluster, label: unit || unitKey || cluster };
}

function sortWeakUnitEntries(mapObj) {
    return Object.values(mapObj).sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return String(a.label).localeCompare(String(b.label));
    });
}

function computeStudentWeakUnits(studentId) {
    const sessions = (state.db.exam_sessions || []).filter(e => e.student_id === studentId);
    const sessionMap = new Map(sessions.map(e => [e.id, e]));
    const bucket = {};

    (state.db.wrong_answers || []).forEach(w => {
        const session = sessionMap.get(w.session_id);
        if (!session || !session.archive_file) return;

        const concept = getWrongConceptFromSession(session, w.question_id);
        if (!concept) return;

        const key = concept.unitKey || concept.label;
        if (!bucket[key]) {
            bucket[key] = {
                key,
                label: concept.label,
                unitKey: concept.unitKey,
                course: concept.course,
                cluster: concept.cluster,
                count: 0,
                questions: []
            };
        }

        bucket[key].count += 1;
        bucket[key].questions.push({
            sessionId: session.id,
            examTitle: session.exam_title,
            examDate: session.exam_date,
            score: session.score,
            questionCount: session.question_count,
            questionId: w.question_id
        });
    });

    return sortWeakUnitEntries(bucket);
}

function computeClassWeakUnits(classId, examTitle = '', examDate = '') {
    const ids = (state.db.class_students || []).filter(m => m.class_id === classId).map(m => m.student_id);
    const sessions = (state.db.exam_sessions || []).filter(e => {
        if (!ids.includes(e.student_id)) return false;
        if (examTitle && e.exam_title !== examTitle) return false;
        if (examDate && e.exam_date !== examDate) return false;
        return true;
    });

    const sessionMap = new Map(sessions.map(e => [e.id, e]));
    const bucket = {};

    (state.db.wrong_answers || []).forEach(w => {
        const session = sessionMap.get(w.session_id);
        if (!session || !session.archive_file) return;

        const concept = getWrongConceptFromSession(session, w.question_id);
        if (!concept) return;

        const key = concept.unitKey || concept.label;
        if (!bucket[key]) {
            bucket[key] = {
                key,
                label: concept.label,
                unitKey: concept.unitKey,
                course: concept.course,
                cluster: concept.cluster,
                count: 0,
                students: new Set(),
                questions: []
            };
        }

        bucket[key].count += 1;
        bucket[key].students.add(session.student_id);
        bucket[key].questions.push({
            sessionId: session.id,
            studentId: session.student_id,
            examTitle: session.exam_title,
            examDate: session.exam_date,
            score: session.score,
            questionCount: session.question_count,
            questionId: w.question_id
        });
    });

    const result = sortWeakUnitEntries(bucket);
    result.forEach(item => {
        item.studentCount = item.students.size;
        delete item.students;
    });
    return result;
}

function apEscapeHtml(text) {
    return String(text ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getStudentNameById(studentId) {
    return (state.db.students || []).find(s => s.id === studentId)?.name || '학생';
}

function makeWeakUnitDetailKey(item, mode, title) {
    if (!state.ui.weakUnitDetails) state.ui.weakUnitDetails = {};
    const key = `wu_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    state.ui.weakUnitDetails[key] = { item, mode, title };
    return key;
}

function renderWeakUnitDetailList(item, mode = 'student') {
    const questions = Array.isArray(item?.questions) ? item.questions : [];
    if (!questions.length) {
        return `<div style="font-size:12px;color:var(--secondary);background:#f8f9fa;border:1px dashed var(--border);border-radius:8px;padding:14px;text-align:center;">상세 오답 기록이 없습니다.</div>`;
    }

    return `
        <div style="display:flex;flex-direction:column;gap:8px;max-height:60vh;overflow-y:auto;padding-right:2px;">
            ${questions.map(q => {
                const studentLabel = mode === 'class'
                    ? `<div style="font-size:13px;font-weight:900;color:var(--primary);">${apEscapeHtml(getStudentNameById(q.studentId))}</div>`
                    : '';
                const scoreLabel = q.score !== undefined && q.score !== null && q.score !== ''
                    ? `<span style="font-size:11px;color:var(--secondary);font-weight:700;">${apEscapeHtml(q.score)}점</span>`
                    : '';

                return `
                    <div style="border:1px solid var(--border);background:#fff;border-radius:10px;padding:10px 12px;">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                            <div style="flex:1;min-width:0;">
                                ${studentLabel}
                                <div style="font-size:12px;color:#202124;font-weight:800;line-height:1.45;word-break:break-word;">${apEscapeHtml(q.examTitle || '시험명 없음')}</div>
                                <div style="font-size:11px;color:var(--secondary);margin-top:3px;">${apEscapeHtml(q.examDate || '')} ${scoreLabel ? `· ${scoreLabel}` : ''}</div>
                            </div>
                            <div style="font-size:12px;font-weight:900;color:var(--error);background:#fce8e6;border-radius:999px;padding:4px 8px;white-space:nowrap;">Q${apEscapeHtml(q.questionId)}</div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function openWeakUnitDetail(detailKey) {
    const payload = state.ui.weakUnitDetails?.[detailKey];
    if (!payload || !payload.item) {
        toast('상세 데이터를 찾을 수 없습니다.', 'warn');
        return;
    }

    const item = payload.item;
    const mode = payload.mode || 'student';
    const title = payload.title || '취약 단원 상세';
    const studentCountHtml = mode === 'class' && item.studentCount
        ? `<span style="font-size:11px;color:var(--secondary);font-weight:700;margin-left:6px;">${item.studentCount}명</span>`
        : '';

    showModal(`📌 ${apEscapeHtml(item.label || title)}`, `
        <div style="background:#f8f9fa;border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:12px;">
            <div style="font-size:13px;font-weight:900;color:var(--primary);line-height:1.5;">${apEscapeHtml(item.label || '')}</div>
            <div style="font-size:11px;color:var(--secondary);margin-top:4px;">
                ${item.unitKey ? `단원키 ${apEscapeHtml(item.unitKey)} · ` : ''}오답 ${apEscapeHtml(item.count || 0)}회${studentCountHtml}
            </div>
        </div>
        ${renderWeakUnitDetailList(item, mode)}
    `);
}

function renderWeakUnitSummary(items, emptyText = '누적 오답 단원 데이터 없음', options = {}) {
    if (!Array.isArray(items) || items.length === 0) {
        return `<div style="font-size:12px;color:var(--secondary);background:#f8f9fa;border:1px dashed var(--border);border-radius:8px;padding:10px;text-align:center;">${apEscapeHtml(emptyText)}</div>`;
    }

    const clickable = options.clickable === true;
    const mode = options.mode || 'student';
    const titlePrefix = options.titlePrefix || '취약 단원';

    return `
        <div style="display:flex;flex-direction:column;gap:6px;">
            ${items.slice(0, 5).map((item, idx) => {
                const key = clickable ? makeWeakUnitDetailKey(item, mode, `${titlePrefix} 상세`) : '';
                const clickAttr = clickable ? ` onclick="openWeakUnitDetail('${key}')"` : '';
                const cursorStyle = clickable ? 'cursor:pointer;' : '';
                const detailHint = clickable ? `<span style="font-size:10px;color:var(--primary);font-weight:800;margin-left:6px;white-space:nowrap;">상세 ›</span>` : '';
                const studentCount = mode === 'class' && item.studentCount ? `<span style="font-size:10px;color:var(--secondary);font-weight:600;margin-left:4px;">${item.studentCount}명</span>` : '';

                return `
                    <div${clickAttr} style="display:flex;justify-content:space-between;align-items:center;gap:8px;background:#f8f9fa;border:1px solid var(--border);border-radius:8px;padding:8px 10px;${cursorStyle}">
                        <div style="font-size:12px;font-weight:800;color:#202124;line-height:1.4;min-width:0;">
                            ${idx + 1}. ${apEscapeHtml(item.label)}
                            ${item.unitKey ? `<span style="font-size:10px;color:var(--secondary);font-weight:600;margin-left:4px;">${apEscapeHtml(item.unitKey)}</span>` : ''}
                            ${studentCount}
                        </div>
                        <div style="display:flex;align-items:center;gap:2px;font-size:12px;font-weight:900;color:var(--error);white-space:nowrap;">
                            ${apEscapeHtml(item.count)}회${detailHint}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
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