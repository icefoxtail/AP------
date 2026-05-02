/**
 * AP Math OS v26.1.2 [js/core.js]
 * 핵심 설정 및 데이터 동기화 엔진
 * [Fixed Standard UI]: Typography(Fixed) & Spacing(Fixed) 전면 적용본
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

const SEED_DATA = { classes: [], students: [], map: [] };

let state = {
    auth: { id: null, name: null, role: null },
    ui: { viewScope: 'teacher', userName: '', currentClassId: null },
    db: { 
        students: [], classes: [], class_students: [], attendance: [], homework: [], 
        exam_sessions: [], wrong_answers: [], exam_blueprints: [], attendance_history: [], homework_history: [],
        consultations: [], operation_memos: [], exam_schedules: [], academy_schedules: [], journals: [],
        class_textbooks: [], class_daily_records: [], class_daily_progress: []
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

// [UI Standard Applied]: 로그인 화면
function renderLogin() {
    const root = document.getElementById('app-root');
    const scopeBtn = document.querySelector('header nav button');
    const logoutBtn = document.getElementById('btn-logout');

    if (scopeBtn) scopeBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.remove();

    root.innerHTML = `
        <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); padding:20px;">
            <div style="width:100%; max-width:380px; background:var(--surface); border-radius:24px; padding:40px 28px; border:1px solid var(--border); box-shadow:none;">
                <div style="text-align:center; margin-bottom:32px;">
                    <div style="display:inline-flex; align-items:center; justify-content:center; width:56px; height:56px; background:var(--primary); border-radius:16px; margin-bottom:16px; border:1.5px solid rgba(26,92,255,0.3);">
                        <span style="color:#fff; font-size:24px; font-weight:700;">A</span>
                    </div>
                    <h2 style="color:var(--text); margin:0 0 6px; font-size:20px; font-weight:700; line-height:1.2; letter-spacing:-0.5px;">AP Math OS</h2>
                    <p style="color:var(--secondary); font-size:13px; margin:0; font-weight:700; line-height:1.5;">선생님 계정으로 로그인하세요</p>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <label style="display:block; font-size:13px; font-weight:700; color:var(--secondary); margin-bottom:6px; margin-left:4px; line-height:1.5;">아이디</label>
                        <input id="login-id" type="text" class="btn" placeholder="아이디 입력" style="width:100%; text-align:left; cursor:text; padding:14px 16px; font-size:15px; font-weight:600; line-height:1.4; border-radius:12px; border:1px solid var(--border); background:var(--surface-2); color:var(--text);">
                    </div>
                    <div>
                        <label style="display:block; font-size:13px; font-weight:700; color:var(--secondary); margin-bottom:6px; margin-left:4px; line-height:1.5;">비밀번호</label>
                        <input id="login-pw" type="password" class="btn" placeholder="비밀번호 입력" style="width:100%; text-align:left; cursor:text; padding:14px 16px; font-size:15px; font-weight:600; line-height:1.4; border-radius:12px; border:1px solid var(--border); background:var(--surface-2); color:var(--text);" onkeyup="if(event.key==='Enter')handleLogin()">
                    </div>
                    <button class="btn btn-primary" style="width:100%; margin-top:12px; min-height:52px; padding:14px 16px; font-size:14px; font-weight:700; line-height:1.2; border-radius:14px; box-shadow:none;" onclick="handleLogin()">로그인</button>
                </div>
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

    const scopeBtn = document.querySelector('header nav button');
    if (scopeBtn) scopeBtn.style.display = 'none';

    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.remove();

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
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : [],
        academy_schedules: Array.isArray(data.academy_schedules) ? data.academy_schedules : [],
        journals: Array.isArray(data.journals) ? data.journals : [],
        class_textbooks: Array.isArray(data.class_textbooks) ? data.class_textbooks : [],
        class_daily_records: Array.isArray(data.class_daily_records) ? data.class_daily_records : [],
        class_daily_progress: Array.isArray(data.class_daily_progress) ? data.class_daily_progress : []
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
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : [],
        academy_schedules: Array.isArray(data.academy_schedules) ? data.academy_schedules : (state.db.academy_schedules || []),
        journals: Array.isArray(data.journals) ? data.journals : (state.db.journals || []),
        class_textbooks: Array.isArray(data.class_textbooks) ? data.class_textbooks : (state.db.class_textbooks || []),
        class_daily_records: Array.isArray(data.class_daily_records) ? data.class_daily_records : (state.db.class_daily_records || []),
        class_daily_progress: Array.isArray(data.class_daily_progress) ? data.class_daily_progress : (state.db.class_daily_progress || [])
    };
}

function getStudentTargetScore(studentId) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const raw = student?.target_score;
    if (raw === undefined || raw === null || raw === '') return null;
    const score = Number(raw);
    if (!Number.isFinite(score)) return null;
    return Math.max(0, Math.min(100, Math.round(score)));
}

function computeStudentTargetProgress(studentId, limit = 3) {
    const targetScore = getStudentTargetScore(studentId);
    if (targetScore === null) {
        return {
            targetScore: null,
            currentAverage: null,
            remainScore: null,
            achievementRate: null
        };
    }

    const scores = (state.db.exam_sessions || [])
        .filter(e => String(e.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')))
        .slice(0, limit)
        .map(e => Number(e.score))
        .filter(v => Number.isFinite(v));

    if (!scores.length) {
        return {
            targetScore,
            currentAverage: null,
            remainScore: null,
            achievementRate: null
        };
    }

    const currentAverage = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    return {
        targetScore,
        currentAverage,
        remainScore: Math.max(targetScore - currentAverage, 0),
        achievementRate: targetScore > 0 ? Math.round((currentAverage / targetScore) * 100) : null
    };
}

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

// [UI Standard Applied]: 오답 칩 보정
function buildWrongUnitChip(session, questionId) {
    const bp = findBlueprintForWrong(session, questionId);
    const qNo = String(questionId);
    const unit = bp ? (bp.standard_unit || bp.standard_unit_key || '') : '';
    const label = unit ? `Q${qNo} · ${unit}` : `Q${qNo}`;

    return `<span style="display:inline-flex; align-items:center; background:rgba(255,71,87,0.08); color:var(--error); border:1px solid rgba(255,71,87,0.15); border-radius:999px; padding:4px 10px; margin:2px; font-size:11px; font-weight:600; line-height:1.5;">${label}</span>`;
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

function makeWeakUnitDetailKey(item, mode, title, context = null) {
    if (!state.ui.weakUnitDetails) state.ui.weakUnitDetails = {};
    const key = `wu_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    state.ui.weakUnitDetails[key] = { item, mode, title, context };
    return key;
}

// [UI Standard Applied]: 취약단원 상세 리스트
function renderWeakUnitDetailList(item, mode = 'student') {
    const questions = Array.isArray(item?.questions) ? item.questions : [];
    if (!questions.length) {
        return `<div style="font-size:12px; color:var(--secondary); background:var(--bg); border:1px dashed var(--border); border-radius:12px; padding:14px; text-align:center; font-weight:600; line-height:1.5;">상세 오답 기록이 없습니다.</div>`;
    }

    return `
        <div style="display:flex; flex-direction:column; gap:10px; max-height:60vh; overflow-y:auto; padding-right:2px;">
            ${questions.map(q => {
                const studentLabel = mode === 'class'
                    ? `<div style="font-size:14px; font-weight:700; color:var(--primary); line-height:1.4;">${apEscapeHtml(getStudentNameById(q.studentId))}</div>`
                    : '';
                const scoreLabel = q.score !== undefined && q.score !== null && q.score !== ''
                    ? `<span style="font-size:11px; color:var(--secondary); font-weight:600; line-height:1.5;">${apEscapeHtml(q.score)}점</span>`
                    : '';

                return `
                    <div style="border:1px solid var(--border); background:var(--surface); border-radius:18px; padding:14px 12px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                            <div style="flex:1; min-width:0;">
                                ${studentLabel}
                                <div style="font-size:14px; color:var(--text); font-weight:700; line-height:1.4; word-break:break-word;">${apEscapeHtml(q.examTitle || '시험명 없음')}</div>
                                <div style="font-size:11px; color:var(--secondary); margin-top:3px; font-weight:600; line-height:1.5;">${apEscapeHtml(q.examDate || '')} ${scoreLabel ? `· ${scoreLabel}` : ''}</div>
                            </div>
                            <div style="font-size:13px; font-weight:700; color:var(--error); background:rgba(255,71,87,0.08); border-radius:8px; padding:4px 8px; white-space:nowrap; line-height:1.5;">Q${apEscapeHtml(q.questionId)}</div>
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
        ? `<span style="font-size:11px; color:var(--secondary); font-weight:600; margin-left:6px; line-height:1.5;">${item.studentCount}명</span>`
        : '';

    showModal(`📌 ${apEscapeHtml(item.label || title)}`, `
        <div style="background:var(--bg); border:1px solid transparent; border-radius:12px; padding:12px 14px; margin-bottom:12px;">
            <div style="font-size:16px; font-weight:700; color:var(--primary); line-height:1.3;">${apEscapeHtml(item.label || '')}</div>
            <div style="font-size:11px; color:var(--secondary); margin-top:4px; font-weight:600; line-height:1.5;">
                ${item.unitKey ? `단원키 ${apEscapeHtml(item.unitKey)} · ` : ''}오답 ${apEscapeHtml(item.count || 0)}회${studentCountHtml}
            </div>
            <button class="btn btn-primary" style="width:100%; margin-top:10px; min-height:44px; padding:10px 14px; font-size:13px; font-weight:700; line-height:1.2; border-radius:12px;" onclick="openSimilarQuestionRecommendations('${detailKey}')">유사문항 추천 보기</button>
        </div>
        ${renderWeakUnitDetailList(item, mode)}
    `);
}

// [UI Standard Applied]: 취약단원 요약
function renderWeakUnitSummary(items, emptyText = '누적 오답 단원 데이터 없음', options = {}) {
    if (!Array.isArray(items) || items.length === 0) {
        return `<div style="font-size:12px; color:var(--secondary); background:var(--bg); border:1px dashed var(--border); border-radius:12px; padding:12px; text-align:center; font-weight:600; line-height:1.5;">${apEscapeHtml(emptyText)}</div>`;
    }

    const clickable = options.clickable === true;
    const mode = options.mode || 'student';
    const titlePrefix = options.titlePrefix || '취약 단원';

    return `
        <div style="display:flex; flex-direction:column; gap:10px;">
            ${items.slice(0, 5).map((item, idx) => {
                const key = clickable ? makeWeakUnitDetailKey(item, mode, `${titlePrefix} 상세`, options.context || null) : '';
                const clickAttr = clickable ? ` onclick="openWeakUnitDetail('${key}')"` : '';
                const cursorStyle = clickable ? 'cursor:pointer;' : '';
                const detailHint = clickable ? `<span style="font-size:11px; color:var(--primary); font-weight:700; margin-left:6px; white-space:nowrap; line-height:1.5;">상세 ›</span>` : '';
                const studentCount = mode === 'class' && item.studentCount ? `<span style="font-size:11px; color:var(--secondary); font-weight:600; margin-left:4px; line-height:1.5;">${item.studentCount}명</span>` : '';

                return `
                    <div${clickAttr} style="display:flex; justify-content:space-between; align-items:center; gap:10px; background:var(--bg); border:1px solid transparent; border-radius:12px; padding:10px 12px; ${cursorStyle}">
                        <div style="font-size:14px; font-weight:700; color:var(--text); line-height:1.4; min-width:0;">
                            ${idx + 1}. ${apEscapeHtml(item.label)}
                            ${item.unitKey ? `<span style="font-size:11px; color:var(--secondary); font-weight:600; margin-left:4px; line-height:1.5;">${apEscapeHtml(item.unitKey)}</span>` : ''}
                            ${studentCount}
                        </div>
                        <div style="display:flex; align-items:center; gap:2px; font-size:13px; font-weight:700; color:var(--error); white-space:nowrap; line-height:1.5;">
                            ${apEscapeHtml(item.count)}회${detailHint}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

const CLINIC_CART_KEY = 'APMATH_CLINIC_CANDIDATES';

function apEscapeAttr(text) {
    return apEscapeHtml(text).replace(/`/g, '&#96;');
}

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
    return `${normalizeArchivePath(candidate.archiveFile || candidate.file)}::${Number(candidate.questionNo || candidate.questionId)}`;
}

function makeClinicItemId(candidate, context = {}) {
    const targetType = context.targetType || candidate.targetType || 'general';
    const targetId = context.targetId || candidate.targetId || 'general';
    return `${makeRecommendCandidateKey(candidate)}::${targetType}::${targetId}`;
}

function normalizeClinicContext(context = null) {
    const safe = context && typeof context === 'object' ? context : {};
    const targetType = ['student', 'class', 'general'].includes(safe.targetType) ? safe.targetType : 'general';
    const targetId = String(safe.targetId || targetType || 'general');
    const targetLabel = String(safe.targetLabel || (targetType === 'student' ? '학생' : targetType === 'class' ? '반' : '일반'));
    return { targetType, targetId, targetLabel };
}

function normalizeClinicBasketItem(raw, fallbackContext = null) {
    if (!raw || typeof raw !== 'object') return null;

    const context = normalizeClinicContext({
        targetType: raw.targetType,
        targetId: raw.targetId,
        targetLabel: raw.targetLabel,
        ...(fallbackContext || {})
    });

    const archiveFile = normalizeArchivePath(raw.archiveFile || raw.file || raw.source_archive_file || '');
    const questionNo = Number(raw.questionNo ?? raw.questionId ?? raw.source_question_no);
    if (!archiveFile || !Number.isFinite(questionNo)) return null;

    const item = {
        id: raw.id || '',
        archiveFile,
        questionNo,
        sourceTitle: raw.sourceTitle || raw.examTitle || getExamDisplayTitle({}, archiveFile),
        standardUnitKey: raw.standardUnitKey || raw.standard_unit_key || '',
        standardUnit: raw.standardUnit || raw.standard_unit || raw.standardUnitKey || raw.standard_unit_key || '',
        standardCourse: raw.standardCourse || raw.standard_course || '',
        conceptClusterKey: raw.conceptClusterKey || raw.concept_cluster_key || '',
        level: raw.level || '',
        preview: raw.preview || raw.contentPreview || '',
        matchType: raw.matchType || 'unknown',
        targetType: context.targetType,
        targetId: context.targetId,
        targetLabel: context.targetLabel,
        addedAt: raw.addedAt || new Date().toISOString()
    };

    item.id = makeClinicItemId(item, context);
    return item;
}

function getClinicCart() {
    try {
        const arr = JSON.parse(localStorage.getItem(CLINIC_CART_KEY) || '[]');
        if (!Array.isArray(arr)) return [];
        return arr.map(item => normalizeClinicBasketItem(item)).filter(Boolean);
    } catch (e) {
        return [];
    }
}

function saveClinicCart(items) {
    try {
        const safe = (Array.isArray(items) ? items : []).map(item => normalizeClinicBasketItem(item)).filter(Boolean);
        localStorage.setItem(CLINIC_CART_KEY, JSON.stringify(safe));
        return safe;
    } catch (e) {
        toast('클리닉 바구니 저장에 실패했습니다.', 'warn');
        return getClinicCart();
    }
}

function addClinicCandidate(candidateKey, contextKey = '') {
    const candidate = state.ui.recommendationCandidates?.[candidateKey];
    if (!candidate) {
        toast('추천 문항 데이터를 찾을 수 없습니다.', 'warn');
        return;
    }

    const context = state.ui.clinicContexts?.[contextKey] || state.ui.activeClinicContext || null;
    const item = normalizeClinicBasketItem(candidate, context);
    if (!item) {
        toast('클리닉 후보로 담을 수 없는 문항입니다.', 'warn');
        return;
    }

    const cart = getClinicCart();
    if (cart.some(x => x.id === item.id)) {
        toast('이미 해당 대상의 클리닉 바구니에 담긴 문항입니다.', 'warn');
        return;
    }

    cart.push(item);
    saveClinicCart(cart);
    toast(`클리닉 바구니에 담았습니다. (${cart.length}개)`, 'info');
}

function removeClinicCandidate(itemId, contextKey = '') {
    const id = String(itemId || '');
    if (!id) return;
    const next = getClinicCart().filter(item => item.id !== id);
    saveClinicCart(next);
    toast('클리닉 후보를 삭제했습니다.', 'info');
    openClinicBasketByKey(contextKey);
}

function clearClinicBasket(contextKey = '') {
    const context = state.ui.clinicContexts?.[contextKey] || null;
    const cart = getClinicCart();
    const filtered = context
        ? cart.filter(item => item.targetType === context.targetType && item.targetId === context.targetId)
        : cart;

    if (!filtered.length) {
        toast('비울 클리닉 후보가 없습니다.', 'warn');
        return;
    }

    const label = context ? `${context.targetLabel} 바구니` : '전체 클리닉 바구니';
    if (!confirm(`${label}의 후보 ${filtered.length}개를 모두 비울까요?`)) return;

    const removeIds = new Set(filtered.map(item => item.id));
    saveClinicCart(cart.filter(item => !removeIds.has(item.id)));
    toast('클리닉 바구니를 비웠습니다.', 'info');
    openClinicBasketByKey(contextKey);
}

function makeClinicContextKey(context = null) {
    if (!state.ui.clinicContexts) state.ui.clinicContexts = {};
    const normalized = normalizeClinicContext(context);
    const key = `clinic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    state.ui.clinicContexts[key] = normalized;
    return key;
}

function openClinicBasketForClass(classId) {
    const cls = (state.db.classes || []).find(c => c.id === classId);
    const key = makeClinicContextKey({ targetType: 'class', targetId: classId, targetLabel: cls?.name || '반' });
    openClinicBasketByKey(key);
}

function openClinicBasketForStudent(studentId) {
    const s = (state.db.students || []).find(st => st.id === studentId);
    const key = makeClinicContextKey({ targetType: 'student', targetId: studentId, targetLabel: s?.name || '학생' });
    openClinicBasketByKey(key);
}

function openClinicBasket(context = null) {
    const key = context ? makeClinicContextKey(context) : '';
    openClinicBasketByKey(key);
}

function groupClinicItems(items) {
    const groups = {};
    items.forEach(item => {
        const targetKey = `${item.targetType}::${item.targetId}`;
        if (!groups[targetKey]) {
            groups[targetKey] = {
                targetType: item.targetType,
                targetId: item.targetId,
                targetLabel: item.targetLabel,
                units: {}
            };
        }
        const unitKey = item.standardUnitKey || item.standardUnit || '미분류';
        if (!groups[targetKey].units[unitKey]) {
            groups[targetKey].units[unitKey] = {
                unitKey,
                unitLabel: item.standardUnit || item.standardUnitKey || '미분류 단원',
                items: []
            };
        }
        groups[targetKey].units[unitKey].items.push(item);
    });
    return Object.values(groups);
}

// [UI Standard Applied]: 클리닉 바구니 아이템
function renderClinicBasketItems(items, contextKey = '') {
    if (!items.length) {
        return `<div style="font-size:12px; color:var(--secondary); background:var(--bg); border:1px dashed var(--border); border-radius:12px; padding:18px; text-align:center; font-weight:600; line-height:1.5;">담긴 클리닉 후보가 없습니다.</div>`;
    }

    const groups = groupClinicItems(items);
    return `
        <div style="display:flex; flex-direction:column; gap:12px; max-height:62vh; overflow-y:auto; padding-right:2px;">
            ${groups.map(group => `
                <div style="border:1px solid var(--border); border-radius:18px; background:var(--surface); overflow:hidden;">
                    <div style="background:var(--bg); padding:12px 14px; border-bottom:1px solid var(--border);">
                        <div style="font-size:16px; font-weight:700; color:var(--primary); line-height:1.3;">${apEscapeHtml(group.targetLabel || '일반')}</div>
                        <div style="font-size:11px; color:var(--secondary); margin-top:2px; font-weight:600; line-height:1.5;">${group.targetType === 'student' ? '학생별 클리닉' : group.targetType === 'class' ? '반별 클리닉' : '일반 클리닉'}</div>
                    </div>
                    ${Object.values(group.units).map(unit => `
                        <div style="padding:12px 14px; border-bottom:1px solid var(--border);">
                            <div style="font-size:14px; font-weight:700; color:var(--text); margin-bottom:8px; line-height:1.4;">${apEscapeHtml(unit.unitLabel)} ${unit.unitKey && unit.unitKey !== unit.unitLabel ? `<span style="font-size:11px; color:var(--secondary); font-weight:600; line-height:1.5;">${apEscapeHtml(unit.unitKey)}</span>` : ''}</div>
                            <div style="display:flex; flex-direction:column; gap:10px;">
                                ${unit.items.map(item => `
                                    <div style="border:1px solid var(--border); border-radius:12px; padding:10px 12px; background:var(--surface);">
                                        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                                            <div style="flex:1; min-width:0;">
                                                <div style="font-size:13px; font-weight:700; color:var(--primary); line-height:1.5; word-break:break-word;">${apEscapeHtml(item.sourceTitle)}</div>
                                                <div style="font-size:11px; color:var(--secondary); font-weight:600; margin-top:3px; line-height:1.5;">Q${apEscapeHtml(item.questionNo)}${item.level ? ` · ${apEscapeHtml(item.level)}` : ''} · ${item.matchType === 'standardUnitKey' ? '단원 일치' : item.matchType === 'conceptClusterKey' ? '개념군 보완' : '후보'}</div>
                                                ${item.preview ? `<div style="font-size:11px; color:var(--secondary); line-height:1.5; margin-top:6px; word-break:break-word;">${apEscapeHtml(item.preview)}</div>` : ''}
                                            </div>
                                            <button class="btn" style="padding:4px 8px; font-size:11px; font-weight:700; color:var(--error); border-color:transparent; background:rgba(255,71,87,0.1); border-radius:8px; line-height:1.5;" onclick="removeClinicCandidate('${apEscapeAttr(item.id)}','${apEscapeAttr(contextKey)}')">삭제</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `).join('')}
        </div>
    `;
}

function openClinicBasketByKey(contextKey = '') {
    const context = state.ui.clinicContexts?.[contextKey] || null;
    const cart = getClinicCart();
    const filtered = context
        ? cart.filter(item => item.targetType === context.targetType && item.targetId === context.targetId)
        : cart;
    const title = context ? `🧺 ${context.targetLabel} 클리닉 바구니` : '🧺 클리닉 바구니';
    const scopeLabel = context ? `${context.targetLabel} 후보 ${filtered.length}개 / 전체 ${cart.length}개` : `전체 후보 ${cart.length}개`;

    showModal(title, `
        <div style="background:var(--bg); border:1px solid transparent; border-radius:12px; padding:12px 14px; margin-bottom:14px;">
            <div style="font-size:16px; font-weight:700; color:var(--primary); line-height:1.3;">${apEscapeHtml(scopeLabel)}</div>
            <div style="font-size:11px; color:var(--secondary); margin-top:4px; line-height:1.5; font-weight:600;">학생별·반별·단원별로 담긴 유사문항 후보를 관리합니다.</div>
        </div>
        ${renderClinicBasketItems(filtered, contextKey)}
        <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap;">
            <button class="btn" style="flex:1; min-width:120px; min-height:44px; padding:10px 14px; color:var(--error); border-color:transparent; background:rgba(255,71,87,0.1); font-size:13px; font-weight:700; border-radius:12px; line-height:1.2;" onclick="clearClinicBasket('${apEscapeAttr(contextKey)}')">${context ? '현재 바구니 비우기' : '전체 비우기'}</button>
            <button class="btn btn-primary" style="flex:1; min-width:140px; min-height:44px; padding:10px 14px; font-size:13px; font-weight:700; border-radius:12px; line-height:1.2;" onclick="openClinicWorksheet('${apEscapeAttr(contextKey)}')">클리닉지 출력</button>
        </div>
    `);
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
                    archiveFile: file,
                    examTitle: bankData.examTitle || getExamDisplayTitle(entry, file),
                    sourceTitle: bankData.examTitle || getExamDisplayTitle(entry, file),
                    questionId: q.id,
                    questionNo: q.id,
                    level: q.level || '',
                    standardUnitKey: qUnitKey,
                    standardUnit: q.standardUnit || qUnitKey || '',
                    standardCourse: q.standardCourse || entry.primaryStandardCourse || '',
                    conceptClusterKey: qCluster,
                    contentPreview: String(q.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90),
                    preview: String(q.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 90),
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

// [UI Standard Applied]: 유사문항 추천 리스트
function renderSimilarQuestionCandidates(candidates, contextKey = '') {
    if (!Array.isArray(candidates) || !candidates.length) {
        return `<div style="font-size:12px; color:var(--secondary); background:var(--bg); border:1px dashed var(--border); border-radius:12px; padding:16px; text-align:center; font-weight:600; line-height:1.5;">추천 가능한 유사문항을 아직 찾지 못했습니다.</div>`;
    }

    if (!state.ui.recommendationCandidates) state.ui.recommendationCandidates = {};

    return `
        <div style="display:flex; flex-direction:column; gap:10px; max-height:62vh; overflow-y:auto; padding-right:2px;">
            ${candidates.map((c, idx) => {
                const key = `rec_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`;
                state.ui.recommendationCandidates[key] = c;
                const matchLabel = c.matchType === 'standardUnitKey' ? '단원 일치' : '개념군 보완';
                return `
                    <div style="border:1px solid var(--border); background:var(--surface); border-radius:18px; padding:14px 12px;">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
                            <div style="flex:1; min-width:0;">
                                <div style="font-size:14px; font-weight:700; color:var(--primary); line-height:1.4; word-break:break-word;">${idx + 1}. ${apEscapeHtml(c.examTitle)}</div>
                                <div style="font-size:11px; color:var(--secondary); margin-top:3px; font-weight:600; line-height:1.5;">Q${apEscapeHtml(c.questionId)} · ${apEscapeHtml(c.standardUnit || '')} ${c.level ? `· ${apEscapeHtml(c.level)}` : ''}</div>
                                <div style="font-size:11px; color:var(--secondary); margin-top:6px; line-height:1.5; word-break:break-word;">${apEscapeHtml(c.contentPreview || '')}</div>
                            </div>
                            <span style="font-size:11px; font-weight:700; color:${c.matchType === 'standardUnitKey' ? 'var(--success)' : 'var(--warning)'}; background:var(--bg); border-radius:8px; padding:4px 8px; white-space:nowrap; line-height:1.5;">${matchLabel}</span>
                        </div>
                        <button class="btn" style="width:100%; margin-top:12px; min-height:44px; padding:10px 14px; font-size:13px; font-weight:700; border:1px solid var(--primary); color:var(--primary); border-radius:12px; line-height:1.2;" onclick="addClinicCandidate('${key}','${contextKey}')">클리닉 후보 담기</button>
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
    const contextKey = makeClinicContextKey(payload.context || null);
    state.ui.activeClinicContext = state.ui.clinicContexts?.[contextKey] || normalizeClinicContext(null);

    showModal('유사문항 추천', `
        <div style="text-align:center; padding:32px 24px; color:var(--secondary);">
            <div style="font-size:28px; margin-bottom:12px;">⏳</div>
            <div style="font-size:14px; font-weight:700; line-height:1.4;">JS아카이브에서 유사문항을 찾는 중입니다...</div>
        </div>
    `);

    try {
        const candidates = await buildSimilarQuestionCandidates(item, 10);
        const cartCount = getClinicCart().length;
        showModal('유사문항 추천', `
            <div style="background:var(--bg); border:1px solid transparent; border-radius:12px; padding:12px 14px; margin-bottom:14px;">
                <div style="font-size:16px; font-weight:700; color:var(--primary); line-height:1.3;">${apEscapeHtml(item.label || '취약 단원')}</div>
                <div style="font-size:11px; color:var(--secondary); margin-top:4px; line-height:1.5; font-weight:600;">
                    ${item.unitKey ? `기준 단원 ${apEscapeHtml(item.unitKey)} · ` : ''}${item.cluster ? `개념군 ${apEscapeHtml(item.cluster)} · ` : ''}전체 후보 ${cartCount}개 보관 중
                </div>
                <button class="btn" style="width:100%; margin-top:10px; min-height:44px; padding:10px 14px; font-size:13px; font-weight:700; background:var(--primary); color:#fff; border:none; border-radius:12px; line-height:1.2;" onclick="openClinicBasketByKey('${contextKey}')">🧺 클리닉 바구니 보기</button>
            </div>
            ${renderSimilarQuestionCandidates(candidates, contextKey)}
        `);
    } catch (e) {
        console.warn('[3D] 유사문항 추천 실패:', e);
        showModal('유사문항 추천', `
            <div style="font-size:13px; color:var(--error); background:rgba(255,71,87,0.1); border-radius:12px; padding:16px; text-align:center; line-height:1.6; font-weight:700;">
                유사문항 추천을 불러오지 못했습니다.<br>JS아카이브 db.js 또는 exams 경로를 확인하세요.
            </div>
        `);
    }
}


function getClinicCartItemsForContext(contextKey = '') {
    const context = state.ui.clinicContexts?.[contextKey] || null;
    const cart = getClinicCart();
    if (!context) return cart;
    return cart.filter(item => item.targetType === context.targetType && item.targetId === context.targetId);
}

function makeClinicPrintKey(context = null) {
    const targetType = context?.targetType || 'all';
    const rawTargetId = context?.targetId || 'basket';
    const safeTargetId = String(rawTargetId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 40) || 'basket';
    return `clinic_${targetType}_${safeTargetId}_${Date.now()}`;
}

function makeClinicPrintTitle(context = null) {
    const today = new Date().toLocaleDateString('sv-SE').replace(/-/g, '').slice(2);
    const label = context?.targetLabel || '전체';
    return `${label} 클리닉지 - ${today}`;
}

function normalizeClinicSourceFile(file) {
    const path = normalizeArchivePath(file);
    return path.replace(/^\.\//, '');
}

function getQuestionNumberFromClinicItem(item) {
    const raw = item?.questionNo ?? item?.questionId ?? item?._sourceQuestionNo ?? item?.sourceQuestionNo;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
}

function findQuestionInBank(questionBank, questionNo) {
    if (!Array.isArray(questionBank) || questionNo === null || questionNo === undefined) return null;
    const byId = questionBank.find(q => Number(q?.id) === Number(questionNo));
    if (byId) return byId;
    const idx = Number(questionNo) - 1;
    if (Number.isInteger(idx) && idx >= 0 && idx < questionBank.length) return questionBank[idx];
    return null;
}

function cloneQuestionForClinicPrint(original, item, outputNo, bankData) {
    const sourceFile = normalizeClinicSourceFile(item.archiveFile || item.file || item.sourceFile || item._sourceFile || '');
    const sourceTitle = item.sourceTitle || item.examTitle || bankData?.examTitle || sourceFile.replace(/^exams\//, '').replace(/\.js$/, '');
    const sourceQuestionNo = getQuestionNumberFromClinicItem(item) ?? original?.id ?? outputNo;
    const q = JSON.parse(JSON.stringify(original || {}));

    q.id = outputNo;
    q._originalId = original?.id ?? sourceQuestionNo;
    q._sourceFile = sourceFile;
    q._sourceTitle = sourceTitle;
    q._sourceQuestionNo = sourceQuestionNo;

    if (q.solution == null) q.solution = '';
    if (q.answer == null) q.answer = '';
    if (!Array.isArray(q.choices)) q.choices = q.choices ? [q.choices] : [];

    q.standardUnitKey = q.standardUnitKey || item.standardUnitKey || '';
    q.standardUnit = q.standardUnit || item.standardUnit || '';
    q.standardCourse = q.standardCourse || item.standardCourse || '';
    q.conceptClusterKey = q.conceptClusterKey || item.conceptClusterKey || '';
    q.level = q.level || item.level || '';

    return q;
}

async function hydrateClinicBasketItems(items = []) {
    const output = [];
    const failures = [];
    const bankCache = {};

    for (const item of (Array.isArray(items) ? items : [])) {
        const file = normalizeClinicSourceFile(item.archiveFile || item.file || item.sourceFile || item._sourceFile || '');
        const qNo = getQuestionNumberFromClinicItem(item);
        if (!file || qNo === null) {
            failures.push({ item, reason: '문항 출처 또는 번호 없음' });
            continue;
        }

        try {
            if (!bankCache[file]) bankCache[file] = await loadArchiveQuestionBank(file);
            const bankData = bankCache[file];
            const original = findQuestionInBank(bankData.questionBank, qNo);
            if (!original) {
                failures.push({ item, reason: `${file} ${qNo}번 문항 없음` });
                continue;
            }
            output.push(cloneQuestionForClinicPrint(original, item, output.length + 1, bankData));
        } catch (e) {
            console.warn('[3F] 클리닉 문항 로드 실패:', file, qNo, e);
            failures.push({ item, reason: e?.message || '문항 로드 실패' });
        }
    }

    return { questions: output, failures };
}

function buildClinicMixedMeta(items, questions, context = null, key = '') {
    const title = makeClinicPrintTitle(context);
    const unitSummary = [...new Set((items || []).map(item => item.standardUnit || item.standardUnitKey || '').filter(Boolean))];
    return {
        title,
        customTitle: title,
        source: 'apmath_clinic',
        key,
        targetType: context?.targetType || 'all',
        targetId: context?.targetId || '',
        targetLabel: context?.targetLabel || '전체',
        createdAt: new Date().toISOString(),
        unitSummary,
        qCount: questions.length,
        qpp: 4,
        printMode: 'exam'
    };
}

function saveClinicMixedPayload(key, questions, meta) {
    const qStr = JSON.stringify(questions || []);
    const mStr = JSON.stringify(meta || {});
    try {
        localStorage.setItem('mixedQuestions_' + key, qStr);
        localStorage.setItem('mixedMeta_' + key, mStr);
        return 'localStorage';
    } catch (e) {
        console.warn('[3F] localStorage 저장 실패, sessionStorage fallback:', e);
        sessionStorage.setItem('mixedQuestions', qStr);
        sessionStorage.setItem('mixedMeta', mStr);
        return 'sessionStorage';
    }
}

function buildMixedEngineClinicUrl(key, qpp = 4) {
    const base = getJsArchiveBaseUrl();
    const url = new URL('mixed_engine.html', base);
    url.searchParams.set('key', key);
    url.searchParams.set('mode', 'exam');
    url.searchParams.set('qpp', String(qpp || 4));
    return url.toString();
}

async function openClinicWorksheet(contextKey = '') {
    const context = state.ui.clinicContexts?.[contextKey] || null;
    const items = getClinicCartItemsForContext(contextKey);
    if (!items.length) {
        toast('출력할 클리닉 문항이 없습니다.', 'warn');
        return;
    }

    const popup = window.open('', '_blank');
    if (!popup) {
        toast('새 창이 차단되었습니다. 팝업 허용 후 다시 시도하세요.', 'warn');
        return;
    }

    popup.document.write(`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>클리닉지 준비 중</title></head><body style="font-family:system-ui,-apple-system,sans-serif;padding:24px;line-height:1.6;"><h3>클리닉지 준비 중...</h3><p>JS아카이브 문항을 불러오는 중입니다.</p></body></html>`);
    popup.document.close();

    try {
        const { questions, failures } = await hydrateClinicBasketItems(items);
        if (!questions.length) {
            popup.close();
            toast('출력 가능한 문항을 불러오지 못했습니다.', 'warn');
            return;
        }

        const key = makeClinicPrintKey(context);
        const meta = buildClinicMixedMeta(items, questions, context, key);
        saveClinicMixedPayload(key, questions, meta);

        if (failures.length) {
            toast(`일부 문항 ${failures.length}개는 불러오지 못해 제외했습니다.`, 'warn');
        } else {
            toast(`${questions.length}문항 클리닉지를 생성합니다.`, 'info');
        }

        popup.location.href = buildMixedEngineClinicUrl(key, meta.qpp);
    } catch (e) {
        console.warn('[3F] 클리닉지 생성 실패:', e);
        try { popup.close(); } catch (_) {}
        toast('클리닉지 생성 중 오류가 발생했습니다.', 'error');
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

    let syncedCount = 0;
    let failedCount = 0;

    for (const task of [...syncQueue]) {
        try {
            const r = await fetch(`${CONFIG.API_BASE}/${task.resource}`, {
                method: task.method,
                body: JSON.stringify(task.data),
                headers: { 'Content-Type': 'application/json', ...getAuthHeader() }
            });

            if (!r.ok) {
                failedCount += 1;
                console.warn('[AP Math OS] syncQueue server rejected task:', task, r.status);
                break;
            }

            syncQueue = syncQueue.filter(t => t.id !== task.id);
            localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
            syncedCount += 1;
        } catch (e) {
            failedCount += 1;
            console.warn('[AP Math OS] syncQueue failed and preserved:', task, e);
            break;
        }
    }

    if (syncedCount > 0 && failedCount === 0) {
        toast('동기화 완료', 'info');
        await loadData();
    } else if (syncedCount > 0 && failedCount > 0) {
        toast(`일부 동기화 완료 / ${syncQueue.length}건 대기 유지`, 'warn');
        await loadData();
    } else if (failedCount > 0) {
        toast('동기화 실패: 대기열 보존', 'warn');
    }
}

async function goHome() { 
    if (!getSession()) return; 
    state.ui.currentClassId = null; 
    await loadData(); 
}
