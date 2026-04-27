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
            archiveFile: session.archive_file || '',
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
            archiveFile: session.archive_file || '',
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
            <button class="btn btn-primary" style="width:100%;margin-top:10px;padding:10px;font-size:12px;font-weight:900;" onclick="openSimilarQuestionRecommendations('${detailKey}')">유사문항 추천</button>
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


// [3D] JS아카이브 기반 유사문항 추천 및 클리닉 후보 바구니
const CLINIC_CART_KEY = 'APMATH_CLINIC_CANDIDATES';

function getJsArchiveBaseUrl() {
    try {
        return new URL('../', window.location.href).href;
    } catch (e) {
        return `${window.location.origin}/`;
    }
}

function normalizeArchivePath(file) {
    const raw = String(file || '').trim();
    if (!raw) return '';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    if (raw.startsWith('exams/')) return raw;
    return `exams/${raw.replace(/^\.\//, '')}`;
}

function getExamDisplayTitle(meta = {}, file = '') {
    return meta.title || meta.examTitle || meta.exam_title || meta.name || String(file || '').replace(/^exams\//, '').replace(/\.js$/, '');
}

async function fetchArchiveScriptText(relativePath) {
    const base = getJsArchiveBaseUrl();
    const url = new URL(relativePath, base).href;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`JS아카이브 파일 로드 실패: ${relativePath}`);
    return await res.text();
}

async function loadJsArchiveDBForRecommend() {
    if (state.ui.jsArchiveDBCache) return state.ui.jsArchiveDBCache;
    const text = await fetchArchiveScriptText('db.js');
    const sandbox = {};
    const db = new Function('window', `${text}\n;return window.mainDB || {};`)(sandbox);
    state.ui.jsArchiveDBCache = db || {};
    return state.ui.jsArchiveDBCache;
}

async function loadConceptMapForRecommend() {
    if (state.ui.conceptMapCache) return state.ui.conceptMapCache;
    try {
        const text = await fetchArchiveScriptText('concept_map.js');
        const sandbox = {};
        const map = new Function('window', `${text}\n;return window.CONCEPT_MAP || {};`)(sandbox);
        state.ui.conceptMapCache = map || {};
    } catch (e) {
        state.ui.conceptMapCache = {};
    }
    return state.ui.conceptMapCache;
}

async function loadArchiveQuestionBank(file) {
    const path = normalizeArchivePath(file);
    if (!path) return { examTitle: '', questionBank: [] };
    if (!state.ui.archiveQuestionBankCache) state.ui.archiveQuestionBankCache = {};
    if (state.ui.archiveQuestionBankCache[path]) return state.ui.archiveQuestionBankCache[path];

    const text = await fetchArchiveScriptText(path);
    const sandbox = {};
    const data = new Function('window', `${text}\n;return { examTitle: window.examTitle || '', questionBank: window.questionBank || [] };`)(sandbox);
    const normalized = {
        examTitle: data.examTitle || path.replace(/^exams\//, '').replace(/\.js$/, ''),
        questionBank: Array.isArray(data.questionBank) ? data.questionBank : []
    };
    state.ui.archiveQuestionBankCache[path] = normalized;
    return normalized;
}

function getDbExamEntries(db) {
    if (Array.isArray(db?.exams)) return db.exams;
    if (Array.isArray(db?.시험)) return db.시험;
    if (db && typeof db === 'object') {
        return Object.values(db).flatMap(v => Array.isArray(v) ? v : []);
    }
    return [];
}

function entryMayContainUnit(entry, unitKey, standardCourse = '') {
    if (!unitKey) return true;
    const ranges = Array.isArray(entry.courseRanges) ? entry.courseRanges : [];
    const allRanges = ranges.length ? ranges : [entry];
    return allRanges.some(r => {
        const startKey = r.rangeStartUnitKey || entry.rangeStartUnitKey || '';
        const endKey = r.rangeEndUnitKey || entry.rangeEndUnitKey || '';
        const startOrder = Number(r.rangeStartUnitOrder ?? entry.rangeStartUnitOrder ?? 999);
        const endOrder = Number(r.rangeEndUnitOrder ?? entry.rangeEndUnitOrder ?? 999);
        const course = r.standardCourse || entry.primaryStandardCourse || entry.standardCourse || '';

        if (startKey === unitKey || endKey === unitKey) return true;
        if (standardCourse && course && standardCourse !== course) return false;

        const prefix = unitKey.split('-').slice(0, -1).join('-');
        if (startKey && endKey && startKey.startsWith(prefix) && endKey.startsWith(prefix)) {
            const n = Number(unitKey.split('-').pop());
            if (Number.isFinite(n) && Number.isFinite(startOrder) && Number.isFinite(endOrder)) {
                return startOrder <= n && n <= endOrder;
            }
        }
        return !startKey && !endKey;
    });
}

function isOriginalWrongQuestion(item, filePath, questionId) {
    const normalizedFile = normalizeArchivePath(filePath);
    return (item?.questions || []).some(q => {
        const wrongFile = normalizeArchivePath(q.archiveFile || q.sourceArchiveFile || '');
        return wrongFile && wrongFile === normalizedFile && Number(q.questionId) === Number(questionId);
    });
}

function makeRecommendCandidateKey(candidate) {
    return `${normalizeArchivePath(candidate.file)}::${Number(candidate.questionId)}`;
}

function getClinicCart() {
    try {
        const arr = JSON.parse(localStorage.getItem(CLINIC_CART_KEY) || '[]');
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        return [];
    }
}

function saveClinicCart(items) {
    localStorage.setItem(CLINIC_CART_KEY, JSON.stringify(Array.isArray(items) ? items : []));
}

function addClinicCandidate(candidateKey) {
    const candidate = state.ui.recommendationCandidates?.[candidateKey];
    if (!candidate) {
        toast('추천 문항 데이터를 찾을 수 없습니다.', 'warn');
        return;
    }
    const cart = getClinicCart();
    const key = makeRecommendCandidateKey(candidate);
    if (cart.some(item => makeRecommendCandidateKey(item) === key)) {
        toast('이미 클리닉 후보에 담긴 문항입니다.', 'warn');
        return;
    }
    cart.push(candidate);
    saveClinicCart(cart);
    toast(`클리닉 후보에 담았습니다. (${cart.length}개)`, 'info');
}

async function buildSimilarQuestionCandidates(item, limit = 10) {
    const unitKey = item?.unitKey || '';
    const cluster = item?.cluster || '';
    const standardCourse = item?.course || '';
    if (!unitKey && !cluster) return [];

    const db = await loadJsArchiveDBForRecommend();
    const conceptMap = await loadConceptMapForRecommend();
    const entries = getDbExamEntries(db)
        .filter(entry => entry && entry.file)
        .filter(entry => entryMayContainUnit(entry, unitKey, standardCourse));

    const exact = [];
    const fallback = [];
    const seen = new Set();

    for (const entry of entries) {
        if (exact.length >= limit && fallback.length >= limit) break;
        const file = normalizeArchivePath(entry.file);
        try {
            const bankData = await loadArchiveQuestionBank(file);
            for (const q of bankData.questionBank) {
                if (!q || q.id === undefined || q.id === null) continue;
                if (isOriginalWrongQuestion(item, file, q.id)) continue;

                const qUnitKey = q.standardUnitKey || '';
                const qCluster = q.conceptClusterKey || conceptMap[qUnitKey] || '';
                const key = `${file}::${Number(q.id)}`;
                if (seen.has(key)) continue;

                const isExact = unitKey && qUnitKey === unitKey;
                const isFallback = !isExact && cluster && qCluster === cluster;
                if (!isExact && !isFallback) continue;

                const candidate = {
                    file,
                    examTitle: bankData.examTitle || getExamDisplayTitle(entry, file),
                    questionId: q.id,
                    level: q.level || '',
                    standardUnitKey: qUnitKey,
                    standardUnit: q.standardUnit || qUnitKey || '',
                    standardCourse: q.standardCourse || entry.primaryStandardCourse || '',
                    conceptClusterKey: qCluster,
                    contentPreview: String(q.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90),
                    matchType: isExact ? 'standardUnitKey' : 'conceptClusterKey'
                };

                seen.add(key);
                if (isExact) exact.push(candidate);
                else fallback.push(candidate);
                if (exact.length >= limit) break;
            }
        } catch (e) {
            console.warn('[3D] 추천 후보 로드 실패:', file, e);
        }
    }

    return exact.concat(fallback).slice(0, limit);
}

function renderSimilarQuestionCandidates(candidates) {
    if (!Array.isArray(candidates) || !candidates.length) {
        return `<div style="font-size:12px;color:var(--secondary);background:#f8f9fa;border:1px dashed var(--border);border-radius:8px;padding:14px;text-align:center;">추천 가능한 유사문항을 아직 찾지 못했습니다.</div>`;
    }

    if (!state.ui.recommendationCandidates) state.ui.recommendationCandidates = {};

    return `
        <div style="display:flex;flex-direction:column;gap:8px;max-height:62vh;overflow-y:auto;padding-right:2px;">
            ${candidates.map((c, idx) => {
                const key = `rec_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`;
                state.ui.recommendationCandidates[key] = c;
                const matchLabel = c.matchType === 'standardUnitKey' ? '단원 일치' : '개념군 보완';
                return `
                    <div style="border:1px solid var(--border);background:#fff;border-radius:10px;padding:10px 12px;">
                        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start;">
                            <div style="flex:1;min-width:0;">
                                <div style="font-size:12px;font-weight:900;color:var(--primary);line-height:1.45;word-break:break-word;">${idx + 1}. ${apEscapeHtml(c.examTitle)}</div>
                                <div style="font-size:11px;color:var(--secondary);margin-top:3px;">Q${apEscapeHtml(c.questionId)} · ${apEscapeHtml(c.standardUnit || '')} ${c.level ? `· ${apEscapeHtml(c.level)}` : ''}</div>
                                <div style="font-size:11px;color:#5f6368;margin-top:5px;line-height:1.45;word-break:break-word;">${apEscapeHtml(c.contentPreview || '')}</div>
                            </div>
                            <span style="font-size:10px;font-weight:900;color:${c.matchType === 'standardUnitKey' ? 'var(--success)' : 'var(--warning)'};background:#f8f9fa;border-radius:999px;padding:4px 7px;white-space:nowrap;">${matchLabel}</span>
                        </div>
                        <button class="btn" style="width:100%;margin-top:8px;padding:8px;font-size:11px;font-weight:900;border-color:var(--primary);color:var(--primary);" onclick="addClinicCandidate('${key}')">클리닉 후보 담기</button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

async function openSimilarQuestionRecommendations(detailKey) {
    const payload = state.ui.weakUnitDetails?.[detailKey];
    if (!payload || !payload.item) {
        toast('추천 기준 데이터를 찾을 수 없습니다.', 'warn');
        return;
    }

    const item = payload.item;
    showModal('유사문항 추천', `
        <div style="text-align:center;padding:24px;color:var(--secondary);">
            <div style="font-size:24px;margin-bottom:8px;">⏳</div>
            <div style="font-size:13px;font-weight:800;">JS아카이브에서 유사문항을 찾는 중입니다...</div>
        </div>
    `);

    try {
        const candidates = await buildSimilarQuestionCandidates(item, 10);
        const cartCount = getClinicCart().length;
        showModal('유사문항 추천', `
            <div style="background:#f8f9fa;border:1px solid var(--border);border-radius:10px;padding:10px 12px;margin-bottom:12px;">
                <div style="font-size:13px;font-weight:900;color:var(--primary);line-height:1.5;">${apEscapeHtml(item.label || '취약 단원')}</div>
                <div style="font-size:11px;color:var(--secondary);margin-top:4px;line-height:1.5;">
                    ${item.unitKey ? `기준 단원 ${apEscapeHtml(item.unitKey)} · ` : ''}${item.cluster ? `개념군 ${apEscapeHtml(item.cluster)} · ` : ''}현재 후보 ${cartCount}개 보관 중
                </div>
            </div>
            ${renderSimilarQuestionCandidates(candidates)}
        `);
    } catch (e) {
        console.warn('[3D] 유사문항 추천 실패:', e);
        showModal('유사문항 추천', `
            <div style="font-size:12px;color:var(--error);background:#fce8e6;border-radius:8px;padding:14px;text-align:center;line-height:1.5;">
                유사문항 추천을 불러오지 못했습니다.<br>JS아카이브 db.js 또는 exams 경로를 확인하세요.
            </div>
        `);
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