/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 안정화 엔진
 * [Drawer v8.5 HARD LOCK]&#58; GPT형 260px / 좌우 16px / 중앙정렬 회귀 차단
 *
 * 현재 사이드바 원칙:
 * - 홈 메뉴는 드로어에 두지 않는다. AP MATH 로고의 goHome()이 홈 역할을 담당한다.
 * - 햄버거(openAppDrawer)는 드로어 열기/닫기 전용이다.
 * - PC 닫힘 상태는 56px 미니 레일이며 햄버거와 항목 아이콘(이름은 title·aria-label)을 표시한다.
 * - PC 열림 상태는 260px 아이콘+텍스트 사이드바다.
 * - 모바일 drawer 내부에는 AP MATH OS 브랜드를 반복 표시하지 않는다.
 * - 다크모드 토글은 drawer 최상단 우측에 둔다.
 * - 햄버거, 메뉴 글자, 로그아웃은 같은 왼쪽 16px x축에 정렬한다.
 * - 다크모드 토글 오른쪽 끝은 drawer 오른쪽 16px 기준으로 정렬한다.
 * - 메뉴 항목은 아이콘(DRAWER_ICON_SVG)과 이름을 함께 쓰고, 지금 열린 화면의 항목에 aria-current="page"를 단다(drawerMark).
 * - 로그아웃은 drawer 하단에 둔다.
 */

// ============================================================
// [Theme Manager] 다크 모드: drawer 최상단 우측 스위치 방식
// ============================================================
function getTheme() {
    const saved = localStorage.getItem('APMATH_THEME');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';

    if (document.body) {
        document.body.classList.toggle('dark', isDark);
    }

    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = isDark;
    }

    const legacyToggleBtn = document.getElementById('theme-toggle-btn');
    if (legacyToggleBtn) {
        legacyToggleBtn.innerText = isDark ? '라이트 모드' : '다크 모드';
        legacyToggleBtn.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
        legacyToggleBtn.setAttribute('title', isDark ? '라이트 모드' : '다크 모드');
    }
}

function toggleTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const next = themeSwitch
        ? (themeSwitch.checked ? 'dark' : 'light')
        : (getTheme() === 'dark' ? 'light' : 'dark');

    localStorage.setItem('APMATH_THEME', next);
    applyTheme(next);
}

// 구버전 호환용
function toggleThemeLegacy() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem('APMATH_THEME', next);
    applyTheme(next);
}

function ensureThemeToggleButton() {
    const floatingBtn = document.getElementById('theme-toggle-btn');
    if (floatingBtn && floatingBtn.classList.contains('theme-floating-toggle')) {
        floatingBtn.remove();
    }

    applyTheme(getTheme());
}

function bootThemeManager() {
    ensureThemeToggleButton();
    if (window.matchMedia) {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const syncSystemTheme = () => {
            if (!localStorage.getItem('APMATH_THEME')) applyTheme(getTheme());
        };
        if (media.addEventListener) media.addEventListener('change', syncSystemTheme);
        else if (media.addListener) media.addListener(syncSystemTheme);
    }
}

function appendArchiveSessionToUrlForUi(url) {
    try {
        const session = typeof getSession === 'function'
            ? getSession()
            : JSON.parse(localStorage.getItem('APMATH_SESSION') || 'null');
        if (!session) return url;
        const payload = {
            login_id: session.login_id || '',
            id: session.id || '',
            name: session.name || '',
            role: session.role || '',
            session_token: session.session_token || '',
            expires_at: session.expires_at || ''
        };
        if (!payload.session_token && !payload.login_id) return url;
        const token = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
        return url + (url.indexOf('#') === -1 ? '#' : '&') + 'apmsess=' + token;
    } catch (e) {
        return url;
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootThemeManager);
} else {
    bootThemeManager();
}


// ============================================================
// [UI Components] 토스트 및 모달
// ============================================================
// 모달이 열려 있으면 토스트를 모달 제목줄 바로 아래(본문 맨 위)에 띄운다. 제목·헤더 버튼·하단 액션줄을 가리지 않는다.
// 위치는 모달 헤더 실측으로 정하고(CSS 변수 --toast-top/--toast-left), 모달이 없으면 변수를 지워 화면 아래 기본 위치로 돌아간다.
function apmsPlaceToastContainer(c) {
    try {
        const header = document.getElementById('modal-header');
        const content = document.getElementById('modal-content');
        const open = typeof isModalOpen === 'function' && isModalOpen() && header && content;
        if (!open) {
            c.style.removeProperty('--toast-top');
            c.style.removeProperty('--toast-left');
            return;
        }
        const h = header.getBoundingClientRect();
        const m = content.getBoundingClientRect();
        c.style.setProperty('--toast-top', Math.round(h.bottom + 8) + 'px');
        c.style.setProperty('--toast-left', Math.round(m.left + m.width / 2) + 'px');
    } catch (error) { /* 위치를 못 재면 CSS 기본값 */ }
}

function toast(m, t='info') {
    const c = document.getElementById('toast-container');
    if (!c) return;

    apmsPlaceToastContainer(c);
    const el = document.createElement('div');
    el.className = `toast ${t}`;
    el.innerText = m;
    c.appendChild(el);

    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px) scale(0.96)';
        setTimeout(() => el.remove(), 400);
    }, 3000);
}

let modalCloseTimer = null;
// 모달 닫기 대기(ms). 이 시간이 지나야 모달이 완전히 닫히고 이전 화면으로 돌아간다. 길면 "눌렀는데 한참 뒤에 된다"로 느껴진다.
// index.html의 #modal-overlay/#modal-content 전환 시간(0.12s)과 맞춘다. 모션 줄이기 설정이면 기다리지 않는다.
const APMS_MODAL_CLOSE_MS = 120;
function apmsModalCloseDelay() {
    try {
        if (typeof window !== 'undefined' && typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 0;
    } catch (e) { /* 기본값 사용 */ }
    return APMS_MODAL_CLOSE_MS;
}
let modalStepStack = [];
// 모달 공통 닫기 정책 상태 (아래 "모달 닫기 정책" 구역 참고)
let modalDirtyTouched = false;      // 사용자가 입력칸을 직접 건드렸는가(신뢰된 input/change 이벤트)
let modalDirtyChecker = null;       // 모달이 등록한 "저장 안 한 변경이 있나" 콜백
let modalDirtyBound = null;         // 이벤트를 붙인 #modal-body 요소(한 번만 붙이기 위한 표식)
let modalLayerSeq = 0;              // 모달·상위 레이어가 열린 순서(맨 위 판단용)
let modalOpenSeq = 0;               // 현재 모달이 열린 순서
let modalBackdropPressed = false;   // 누르기 시작이 배경이었는가(안에서 끌어서 밖에서 놓은 경우 제외)
const apmsEscapeLayers = [];        // 모달 위에 뜨는 다른 레이어의 Esc 닫기 등록부
let apmsModalLogicalOpen = false;   // 모달이 "논리적으로" 열려 있는가(closeModal 즉시 false. DOM의 hidden은 APMS_MODAL_CLOSE_MS 뒤에 바뀐다)
const apmsNavGuard = { traversing: false, timer: null, syncQueued: false, holdBoot: false }; // 브라우저 뒤로 가기 연결 상태(아래 "브라우저 뒤로 가기" 구역). holdBoot: 새로고침 직후 반 화면 복원 판단이 끝날 때까지 보호 항목을 걷지 않는다(N4)
let appHistoryState = {
    currentView: null,
    backStack: [],
    restoring: false,
    patchTimer: null
};

const AP_APP_HISTORY_WRAP_NAMES = {
    renderDashboard: { type: 'dashboard' },
    renderAdminControlCenter: { type: 'adminDashboard' },
    renderClass: { type: 'classDetail', argKeys: ['classId'] },
    renderStudentDetail: { type: 'studentDetail', argKeys: ['studentId'] },
    renderTimetable: { type: 'timetable' },
    openAttendanceLedger: { type: 'attendance' },
    openSchoolExamLedger: { type: 'schoolExam' },
    openOmrInput: { type: 'omrInput' },
    renderOmrInput: { type: 'omrInput' }
};

function isModalOpen() {
    const overlay = document.getElementById('modal-overlay');
    return !!overlay && !overlay.classList.contains('hidden');
}

function appHistoryBuildView(name, args = []) {
    const meta = AP_APP_HISTORY_WRAP_NAMES[name] || {};
    const view = { type: meta.type || name };
    (meta.argKeys || []).forEach((key, index) => {
        view[key] = args[index] !== undefined && args[index] !== null ? String(args[index]) : '';
    });
    if (view.type === 'dashboard' && state?.auth?.role === 'admin') view.type = 'adminDashboard';
    return view;
}

function appHistoryViewKey(view) {
    if (!view || !view.type) return '';
    return [
        view.type,
        view.classId || '',
        view.studentId || ''
    ].join(':');
}

function appHistoryCanGoBack() {
    return modalStepStack.length > 0 || isModalOpen() || appHistoryState.backStack.length > 0;
}

function appHistoryCanUseBrowserBack() {
    return typeof window !== 'undefined' && window.history && window.history.length > 1;
}

function updateAppBackButtons() {
    // The top-left back button is part of the permanent app chrome.
    // Keep it clickable even when the internal SPA stack is empty;
    // appHistoryBack() will fall back to the proper home/dashboard view.
    ['mobile-app-back-button', 'desktop-app-back-button'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.disabled = false;
        btn.setAttribute('aria-disabled', 'false');
    });
}

function appHistoryRecordView(nextView) {
    if (!nextView || !nextView.type) return;
    // 학생 상세는 화면이 아니라 모달이다(자기 닫기·복귀 경로가 있다). 화면 이력에 넣으면 모달을 닫은 뒤
    // 뒤로 가기가 같은 학생 상세를 다시 여는 "한 번 더" 문제가 생기므로 이력에서 뺀다.
    if (nextView.type === 'studentDetail') return;
    let current = appHistoryState.currentView;
    // 첫 대시보드 그리기가 화면 이동 감싸기보다 먼저 끝난 경우(자료가 스크립트 로딩보다 빨리 온 경우)에는 현재 화면이 기록되지 않았다.
    // 로그인한 상태에서 대시보드 아닌 화면으로 처음 이동하면 직전 화면은 첫 화면(대시보드)이었다고 본다. 아니면 반 화면에서 뒤로 갈 곳이 없다.
    if (!current && !appHistoryState.restoring && state?.auth?.role && nextView.type !== 'dashboard' && nextView.type !== 'adminDashboard') {
        current = appHistoryBuildView('renderDashboard');
    }
    const currentKey = appHistoryViewKey(current);
    const nextKey = appHistoryViewKey(nextView);

    const isRootView = nextView.type === 'dashboard' || nextView.type === 'adminDashboard';
    if (!appHistoryState.restoring && isRootView) {
        // 첫 화면(대시보드)으로 직접 돌아오면 쌓인 이력을 비운다. 그래야 첫 화면에서 뒤로 가기가 앱 종료(기본 동작)가 된다.
        appHistoryState.backStack.length = 0;
    } else if (!appHistoryState.restoring && current && currentKey && currentKey !== nextKey) {
        const stack = appHistoryState.backStack;
        if (appHistoryViewKey(stack[stack.length - 1]) !== currentKey) stack.push(current);
        if (stack.length > 50) stack.shift();
    }

    appHistoryState.currentView = nextView;
    apmsClassHashApply();
    updateAppBackButtons();
    apmsNavScheduleSync();
}

function appHistoryRestoreView(view) {
    if (!view || !view.type) return false;
    appHistoryState.restoring = true;
    try {
        if (view.type === 'dashboard' && typeof window.renderDashboard === 'function') {
            window.renderDashboard();
            return true;
        }
        if (view.type === 'adminDashboard' && typeof window.renderAdminControlCenter === 'function') {
            window.renderAdminControlCenter();
            return true;
        }
        if (view.type === 'classDetail' && view.classId && typeof window.renderClass === 'function') {
            window.renderClass(view.classId);
            return true;
        }
        if (view.type === 'studentDetail' && view.studentId && typeof window.renderStudentDetail === 'function') {
            window.renderStudentDetail(view.studentId);
            return true;
        }
        if (view.type === 'timetable' && typeof window.renderTimetable === 'function') {
            window.renderTimetable();
            return true;
        }
        if (view.type === 'attendance' && typeof window.openAttendanceLedger === 'function') {
            window.openAttendanceLedger();
            return true;
        }
        if (view.type === 'schoolExam' && typeof window.openSchoolExamLedger === 'function') {
            window.openSchoolExamLedger();
            return true;
        }
        if (view.type === 'omrInput' && typeof window.openOmrInput === 'function') {
            window.openOmrInput();
            return true;
        }
    } finally {
        appHistoryState.restoring = false;
        updateAppBackButtons();
    }
    return false;
}

// 앱 ← 버튼과 기기 뒤로 가기가 공유하는 "모달 한 겹 닫기". 단계 모달이면 한 단계만 돌아간다.
function closeModalForAppBack() {
    if (modalStepStack.length) {
        closeModal();
        updateAppBackButtons();
        return;
    }
    const returnCtx = state.ui?.modalReturnView;
    const hasClassReturn = returnCtx?.type === 'classDetail' ||
        (returnCtx?.type === 'studentDetail' && state.ui?.currentStudentDetailReturnTo?.type === 'classDetail');
    // The app back button must not discard a classroom-origin modal's return route.
    closeModal(!hasClassReturn);
    window.setTimeout(updateAppBackButtons, 180);
}

// options.fromHistory: 브라우저 뒤로 가기(popstate)에서 불렀다. 할 일이 없을 때 history.back()·홈 이동으로 되돌리지 않는다.
function appHistoryBack(options) {
    const fromHistory = !!(options && options.fromHistory === true);
    if (modalStepStack.length || apmsNavModalOpen()) {
        // 헤더 "취소"·Esc와 같은 확인: 입력 중이면 "닫을까요?"를 묻고, 아니오면 그대로 둔다.
        return requestCloseModal('back');
    }

    const previous = appHistoryState.backStack.pop();
    if (previous) {
        const restored = appHistoryRestoreView(previous);
        if (!restored) updateAppBackButtons();
        apmsNavScheduleSync();
        return restored;
    }

    if (fromHistory) return false;

    if (appHistoryCanUseBrowserBack()) {
        window.history.back();
        return true;
    }

    // Final fallback: keep the button useful on first-load dashboard states.
    if (typeof goHome === 'function') {
        goHome();
        updateAppBackButtons();
        return true;
    }

    updateAppBackButtons();
    return false;
}

// ============================================================
// [브라우저 뒤로 가기 연결] 휴대폰·태블릿 뒤로 가기 = 모달 닫기 / 앱 ← (2026-11-02 N2)
// 방식: "뒤로 갈 곳이 있는 동안"(열린 모달·단계 모달·위 레이어·화면 이력) 브라우저 이력에 보호 항목(guard) 한 칸만 둔다.
//   - 뒤로 가기(popstate): 보호 항목이 소모된다. 그때 한 겹만 닫는다(맨 위 레이어 → 모달/단계 → 화면 이력 한 칸 = 앱 ← 버튼과 같다).
//     입력 중이면 Esc처럼 "닫을까요?"를 묻고, 아니오면 닫지 않는다. 뒤로 갈 곳이 남았으면 보호 항목을 다시 채운다.
//   - 코드가 닫을 때(저장 성공 closeModal(true) 등): 뒤로 갈 곳이 0이 되면 보호 항목을 history.go(-1)로 걷어 낸다.
//     그래서 "뒤로 가기를 두 번 눌러야 하는" 일이 없다. 갈 곳이 남아 있으면 보호 항목은 그대로다.
//   - 뒤로 갈 곳이 없으면(첫 화면) 보호 항목도 없으므로 뒤로 가기는 기본 동작(앱 종료·이전 사이트) 그대로다.
// 주소에는 아무것도 남기지 않는다: pushState(state, '', location.href).
// 보호 항목은 사용자가 화면을 누른 뒤에만 쌓인다(모달·화면 열기는 모두 누르기에서 시작). 크롬의 "누르지 않은 페이지의 이력 건너뛰기"에 걸리지 않는다.
// ============================================================
// 지금 열려 있는 모달이 있는가. 닫는 중(closeModal 뒤 APMS_MODAL_CLOSE_MS)은 닫힌 것으로 본다. DOM을 직접 열어 쓰는 옛 화면도 열린 것으로 친다.
// 실제 DOM과 맞춘다: closeModal 없이 #modal-overlay를 직접 숨긴 코드(report-center 등)가 있어도 논리 상태가 true로 남지 않게 고친다.
function apmsNavModalOpen() {
    const domOpen = isModalOpen();
    if (!domOpen) {
        if (apmsModalLogicalOpen) { apmsModalLogicalOpen = false; apmsNavScheduleSync(); }
        return false;
    }
    return apmsModalLogicalOpen || !modalCloseTimer;
}

// 로그인 화면(로그아웃·세션 없음)으로 가면 이전 사용자의 화면 이력·모달 상태를 모두 버린다.
// 안 그러면 기기 뒤로 가기가 이전 사용자의 대시보드를 로그인 없이 다시 그린다.
function apmsNavReset() {
    appHistoryState.backStack.length = 0;
    appHistoryState.currentView = null;
    if (typeof state !== 'undefined' && state && state.ui) state.ui.currentClassId = null; // 로그인 화면에서는 열려 있던 반을 버린다(다른 계정이 로그인해도 앞 사용자의 반이 다시 그려지지 않게)
    modalStepStack = [];
    apmsEscapeLayers.length = 0;
    if (apmsModalLogicalOpen || isModalOpen()) closeModal(true);
    apmsModalLogicalOpen = false;
    apmsNavScheduleSync();
}

function apmsNavLoginVisible() {
    return !!(typeof document !== 'undefined' && document.querySelector && document.querySelector('.ap-login-fullscreen'));
}

function apmsNavDepth() {
    return modalStepStack.length + (apmsNavModalOpen() ? 1 : 0) + apmsEscapeLayers.length + appHistoryState.backStack.length;
}

function apmsNavHasGuard() {
    try { return !!(window.history.state && window.history.state.apmsGuard); } catch (error) { return false; }
}

function apmsNavSync() {
    if (typeof window === 'undefined' || !window.history || typeof window.history.pushState !== 'function') return;
    if (apmsNavGuard.traversing) return; // 걷어 내는 중. popstate가 오면 다시 맞춘다.
    if (apmsNavGuard.holdBoot) return; // 새로고침 직후: 반 화면을 복원할지 정하는 중이다.
    const want = apmsNavDepth() > 0;
    const has = apmsNavHasGuard();
    if (want && !has) {
        try { window.history.pushState({ apmsGuard: true }, '', window.location.href); } catch (error) { console.warn('[nav] pushState failed:', error); }
    } else if (!want && has) {
        apmsNavGuard.traversing = true;
        clearTimeout(apmsNavGuard.timer);
        // popstate가 끝내 안 오면 잠금이 풀리지 않으므로 안전 장치를 둔다.
        apmsNavGuard.timer = setTimeout(() => { apmsNavGuard.traversing = false; apmsNavSync(); }, 700);
        try { window.history.go(-1); } catch (error) { apmsNavGuard.traversing = false; }
    }
}

// 같은 처리 흐름 안에서 닫고 바로 여는 경우(closeModal 뒤 showModal 등)에는 이력을 건드리지 않도록 한 번에 모아 맞춘다.
function apmsNavScheduleSync() {
    if (apmsNavGuard.syncQueued) return;
    apmsNavGuard.syncQueued = true;
    Promise.resolve().then(() => { apmsNavGuard.syncQueued = false; apmsNavSync(); });
}

// 기기 뒤로 가기 한 번이 닫을 한 겹. 닫았으면 true.
function apmsNavBackStep() {
    const topLayer = apmsEscapeLayers.length ? apmsEscapeLayers[apmsEscapeLayers.length - 1] : null;
    if (topLayer && (!apmsNavModalOpen() || topLayer.seq > modalOpenSeq)) {
        if (typeof topLayer.close === 'function') topLayer.close();
        return true;
    }
    return appHistoryBack({ fromHistory: true }) !== false;
}

function apmsNavOnPopState(event) {
    if (apmsNavGuard.traversing) { // 우리가 걷어 낸 이동. 할 일 없음.
        apmsNavGuard.traversing = false;
        clearTimeout(apmsNavGuard.timer);
        apmsClassHashApply(); // 걷어 낸 자리의 주소 해시가 낡았을 수 있다(예: 반 화면에서 대시보드로 직접 이동)
        apmsNavSync();
        return;
    }
    // 방어: 로그인 화면에서는 아무것도 복원하지 않는다(이전 사용자의 화면이 로그인 없이 보이는 것을 막는다).
    if (apmsNavLoginVisible()) { apmsNavReset(); apmsNavSync(); return; }
    const landedOnGuard = !!(event && event.state && event.state.apmsGuard);
    // 보호 항목으로 "앞으로 가기"로 들어왔다면 되돌릴 일만 맞춘다. 보호 항목에서 밖으로 나왔다면(뒤로 가기) 한 겹 닫는다.
    if (!landedOnGuard && apmsNavDepth() > 0) apmsNavBackStep();
    apmsClassHashApply();
    apmsNavSync();
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function' && !window.__apmsNavHistoryBound) {
    window.__apmsNavHistoryBound = true;
    try {
        // 새로고침으로 옛 보호 항목 위에서 시작한 경우: 보호 항목을 일반 항목으로 바꿔 둔다(앱 상태는 처음부터라 갈 곳이 없다).
        // 단 주소에 #class=가 있고 로그인 세션이 있으면 반 화면을 복원할 수 있다. 그때는 이 항목을 그대로 보호 항목으로 쓴다
        // (그래야 [앞 화면, 기본 항목, 보호 항목]이 유지되어 뒤로 1번 = 대시보드, 2번 = 앱 종료). 복원하지 않기로 하면 apmsClassHashBootDone이 일반 항목으로 바꾼다.
        if (window.history.state && window.history.state.apmsGuard) {
            if (apmsClassHashRead() && apmsClassHashHasStoredSession()) {
                apmsNavGuard.holdBoot = true;
                setTimeout(() => { if (apmsNavGuard.holdBoot) apmsClassHashBootDone(false); }, 15000); // 자료를 못 받아 복원 판단이 안 오면 포기한다
            } else {
                window.history.replaceState({ apmsBase: true }, '', window.location.href);
            }
        }
    } catch (error) { /* 이력 접근이 막힌 환경 */ }
    window.addEventListener('popstate', apmsNavOnPopState);
}

// ============================================================
// [새로고침 시 반 화면 복원] 주소 해시 #class=<반 id> (2026-11-02 N4, 결정 D3: 반 화면만)
//   - 반 화면에 있는 동안 주소에 #class=<id>만 남기고, 다른 화면(대시보드 등)으로 가면 지운다. 모달 상태는 넣지 않는다.
//   - 이력 칸을 늘리지 않는다: history.replaceState만 쓴다(보호 항목 pushState는 location.href를 그대로 써 해시를 따라간다).
//   - hashchange는 듣지 않는다. 뒤로 가기·history.go(-1)는 popstate가 처리하고, 이동한 자리의 해시는 popstate 끝에서 현재 화면에 맞춘다.
//   - 새로고침(또는 그 주소로 열기) 뒤 loadData가 apmsClassHashRestoreTarget으로 판단한다: 접근 가능한 반이면 열고, 아니면 조용히 대시보드 + 해시 제거.
//     복원할 때는 화면 이력에 대시보드를 먼저 남긴다(뒤로 1번 = 대시보드).
//   - 로그인 전이면 해시를 그대로 두었다가 로그인한 사용자가 해시를 쓴 사용자와 같을 때만 복원한다(탭 단위 sessionStorage에 쓴 사용자 id를 기록).
//   - 로그아웃(apmsClassHashForget)은 해시·기록·열린 반을 모두 지운다.
// ============================================================
const APMS_CLASS_HASH_OWNER_KEY = 'APMS_CLASS_HASH_OWNER';
let apmsClassHashBootHadSession = null; // 첫 loadData 호출 때 로그인 세션이 있었는가(주소로 바로 연 경우와 로그인 뒤 복원을 구분)

function apmsClassHashRead() {
    try {
        const m = /^#class=([^&]+)$/.exec(window.location.hash || '');
        return m ? decodeURIComponent(m[1]) : '';
    } catch (error) { return ''; }
}

function apmsClassHashHasStoredSession() {
    try { return !!JSON.parse(localStorage.getItem('APMATH_SESSION')); } catch (error) { return false; }
}

function apmsClassHashOwner(value) {
    try {
        if (value === undefined) return sessionStorage.getItem(APMS_CLASS_HASH_OWNER_KEY) || '';
        if (value) sessionStorage.setItem(APMS_CLASS_HASH_OWNER_KEY, value); else sessionStorage.removeItem(APMS_CLASS_HASH_OWNER_KEY);
    } catch (error) { /* sessionStorage가 막힌 환경 */ }
    return '';
}

function apmsClassHashWrite(id) {
    try {
        const next = window.location.pathname + window.location.search + (id ? '#class=' + encodeURIComponent(id) : '');
        const cur = window.location.pathname + window.location.search + window.location.hash;
        if (next !== cur) window.history.replaceState(window.history.state, '', next);
    } catch (error) { /* 이력 접근이 막힌 환경 */ }
}

function apmsClassHashClear(forgetOwner) {
    apmsClassHashWrite('');
    if (forgetOwner) apmsClassHashOwner('');
}

// 지금 화면(appHistoryState.currentView)에 주소 해시를 맞춘다. 학생 상세(모달)는 appHistoryRecordView가 걸러내므로 해시는 그대로다.
function apmsClassHashApply() {
    if (typeof window === 'undefined' || !window.history) return;
    // 로그인 화면: 세션 만료라면(해시 주인 기록이 남아 있음) 로그인 뒤 복원을 위해 해시를 그대로 둔다. 주인이 없으면(로그아웃·낯선 주소) 남은 낡은 해시를 지운다.
    if (apmsNavLoginVisible()) { if (!apmsClassHashOwner()) apmsClassHashClear(false); return; }
    const view = appHistoryState.currentView;
    if (!view || !view.type) return; // 아직 화면이 없다(부팅 중). 주소는 loadData의 복원 판단이 정한다.
    if (view.type === 'classDetail' && view.classId) {
        const sameClass = String(state?.ui?.currentClassId || '') === String(view.classId);
        const ok = sameClass && typeof isClassroomClassAccessible === 'function' && isClassroomClassAccessible(view.classId);
        if (ok) {
            apmsClassHashWrite(view.classId);
            apmsClassHashOwner(String(state?.auth?.id ?? ''));
            return;
        }
    }
    apmsClassHashClear(false);
}

// loadData가 맨 앞에서 부른다: 첫 호출이 부팅이다.
function apmsClassHashNoteLoad(session) {
    if (apmsClassHashBootHadSession === null) {
        apmsClassHashBootHadSession = !!session;
        if (!session) apmsClassHashBootDone(false);
    }
}

// 복원할 반 id를 돌려준다(없으면 ''). 접근 불가·없는 반·다른 사용자의 해시는 조용히 지운다. state.db가 채워진 뒤에 부른다.
function apmsClassHashRestoreTarget(session) {
    const id = apmsClassHashRead();
    if (!id) return '';
    const owner = apmsClassHashOwner();
    const sid = String(session?.id ?? '');
    const allowed = owner ? owner === sid : apmsClassHashBootHadSession === true;
    const accessible = allowed && typeof isClassroomClassAccessible === 'function' && isClassroomClassAccessible(id);
    if (!accessible) { apmsClassHashClear(true); return ''; }
    return id;
}

// 복원 판단이 끝났다. 복원하지 않으면 새로고침으로 물려받은 보호 항목은 일반 항목으로 바꾼다.
function apmsClassHashBootDone(restored) {
    const wasHeld = apmsNavGuard.holdBoot;
    apmsNavGuard.holdBoot = false;
    if (wasHeld && !restored) {
        try { if (window.history.state && window.history.state.apmsGuard) window.history.replaceState({ apmsBase: true }, '', window.location.href); } catch (error) { /* 이력 접근이 막힌 환경 */ }
    }
    apmsNavScheduleSync();
}

// 복원: 화면 이력에 대시보드를 남기고(뒤로 1번 = 대시보드) 반 화면을 연다. 반 화면이 안 열리면 대시보드로 둔다.
function apmsClassHashRestore(id) {
    if (!appHistoryState.currentView && state?.auth?.role) appHistoryState.currentView = appHistoryBuildView('renderDashboard');
    const result = typeof window.renderClass === 'function' ? window.renderClass(id) : false;
    const view = appHistoryState.currentView;
    if (result !== false && !(view && view.type === 'classDetail')) appHistoryRecordView(appHistoryBuildView('renderClass', [id])); // 화면 이동 감싸기가 아직 안 붙은 경우
    const opened = result !== false && !!document.querySelector('.ap-classroom-shell');
    if (!opened) {
        apmsClassHashClear(true);
        appHistoryState.currentView = null;
        appHistoryState.backStack.length = 0;
        if (state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter(); else renderDashboard();
    }
    apmsClassHashBootDone(opened);
}

// 로그아웃: 앞 사용자의 반 위치를 지운다.
function apmsClassHashForget() {
    apmsClassHashClear(true);
    if (typeof state !== 'undefined' && state && state.ui) state.ui.currentClassId = null;
    appHistoryState.currentView = null;
}

function appHistoryWrapGlobal(name, meta) {
    const fn = window[name];
    if (typeof fn !== 'function' || fn.__apHistoryWrapped) return false;

    const wrapped = function(...args) {
        const nextView = appHistoryBuildView(name, args);
        const result = fn.apply(this, args);
        appHistoryRecordView(nextView);
        return result;
    };
    wrapped.__apHistoryWrapped = true;
    wrapped.__apHistoryOriginal = fn;
    window[name] = wrapped;
    return true;
}

function appHistoryPatchGlobalNavigation(retryCount = 0) {
    Object.entries(AP_APP_HISTORY_WRAP_NAMES).forEach(([name, meta]) => appHistoryWrapGlobal(name, meta));
    updateAppBackButtons();

    if (retryCount < 8) {
        if (appHistoryState.patchTimer) clearTimeout(appHistoryState.patchTimer);
        appHistoryState.patchTimer = setTimeout(() => appHistoryPatchGlobalNavigation(retryCount + 1), 180);
    }
}

function getCurrentModalSnapshot() {
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const actionBtn = document.getElementById('modal-action-btn');
    const footer = document.getElementById('modal-footer');
    if (!titleEl || !bodyEl || !isModalOpen()) return null;

    return {
        title: titleEl.innerText || '',
        bodyHtml: bodyEl.innerHTML || '',
        actionText: actionBtn ? (actionBtn.innerText || '') : '',
        actionHandler: actionBtn ? actionBtn.onclick : null,
        actionHidden: actionBtn ? actionBtn.classList.contains('hidden') : true,
        footerHtml: footer ? (footer.innerHTML || '') : '',
        footerHidden: footer ? footer.classList.contains('hidden') : true,
        modalReturnView: state?.ui ? (state.ui.modalReturnView || null) : null,
        studentDetailSubModal: state?.ui ? (state.ui.currentStudentDetailSubModal || null) : null,
        dirtyChecker: modalDirtyChecker
    };
}

function resetModalActionStyle(actionBtn) {
    if (!actionBtn) return;
    actionBtn.style.background = 'transparent';
    actionBtn.style.border = 'none';
    actionBtn.style.boxShadow = 'none';
    actionBtn.style.color = 'var(--primary)';
    actionBtn.style.fontWeight = '700';
    actionBtn.style.fontSize = '15px';
    actionBtn.style.padding = '8px 0';
    actionBtn.style.minHeight = '44px';
}

function applyModalContent(t, b, at = null, af = null, options = {}) {
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const actionBtn = document.getElementById('modal-action-btn');
    const footer = document.getElementById('modal-footer');
    const overlay = document.getElementById('modal-overlay');
    const contentEl = document.getElementById('modal-content');
    const cancelBtn = document.getElementById('modal-cancel-btn');

    if (!titleEl || !bodyEl || !overlay) return;

    document.body?.classList?.add('ap-modal-open');
    apmsModalLogicalOpen = true;

    if (modalCloseTimer) {
        clearTimeout(modalCloseTimer);
        modalCloseTimer = null;
    }

    // [깜박임 핫픽스] 모달이 이미 열려 있으면 열림 애니메이션을 재시작하지 않는다.
    // .show를 제거했다가 다시 붙이면 #modal-content가 슬라이드/페이드 아웃→인을 반복해
    // 내용만 바뀌어도 화면이 한 번 깜박인다. 이미 열려 있으면 내용만 조용히 교체한다.
    const alreadyOpen = overlay.classList.contains('show') && !overlay.classList.contains('hidden');

    if (!alreadyOpen) overlay.classList.remove('show');

    titleEl.innerText = t;
    bodyEl.innerHTML = b;
    resetModalDirtyState(bodyEl);
    if (!alreadyOpen) modalOpenSeq = ++modalLayerSeq;
    if (contentEl) {
        contentEl.classList.remove('clinic-print-fullscreen');
        contentEl.style.width = '';
        contentEl.style.maxWidth = '';
        contentEl.style.height = '';
        contentEl.style.maxHeight = '';
    }
    bodyEl.style.maxHeight = '';
    bodyEl.style.overflow = '';
    if (cancelBtn) cancelBtn.disabled = false;

    if (actionBtn) {
        if (at && af) {
            actionBtn.innerText = at;
            actionBtn.onclick = af;
            actionBtn.classList.remove('hidden');
            actionBtn.disabled = false;
            resetModalActionStyle(actionBtn);
        } else {
            actionBtn.classList.add('hidden');
            actionBtn.onclick = null;
            actionBtn.disabled = false;
            actionBtn.innerText = '';
        }
    }

    if (footer) {
        footer.classList.add('hidden');
        footer.innerHTML = '';
    }

    adoptHeaderActionIntoModalActions(bodyEl, at, af);

    overlay.classList.remove('hidden');
    if (!alreadyOpen) {
        overlay.getBoundingClientRect();
        requestAnimationFrame(() => {
            overlay.classList.add('show');
        });
    }
    apmsNavScheduleSync();
}

// 등급 모달(.apms-modal)에 헤더 행동(showModal의 at/af)이 넘어오면 저장 버튼을 하단 오른쪽 액션줄로 옮겨 그린다.
// 헤더 버튼은 DOM에 남아(CSS가 숨김) 단일 출처가 되고, 하단 버튼은 그 버튼을 눌러 준다.
// 그래서 헤더 버튼의 disabled(중복 제출 방지)가 하단에도 그대로 적용된다.
// 본문에 이미 .apms-modal__actions(또는 .apms-unified-actions)가 있으면 아무것도 하지 않는다.
function adoptHeaderActionIntoModalActions(bodyEl, at, af) {
    if (!bodyEl || !at || !af || typeof bodyEl.querySelector !== 'function') return;
    const root = bodyEl.querySelector('.apms-modal');
    if (!root || root.querySelector('.apms-modal__actions, .apms-unified-actions')) return;
    const bar = document.createElement('div');
    bar.className = 'apms-modal__actions';
    bar.setAttribute('data-modal-action-proxy', '1');
    // 모달 헤더에 "취소"(#modal-cancel-btn)가 있으면 하단에 취소를 또 만들지 않는다(헤더·하단 중복 금지, 사용자 결정 2026-11-02).
    // 헤더 취소가 없는 화면에서만 하단 취소를 둔다.
    const headerCancel = typeof document.getElementById === 'function' ? document.getElementById('modal-cancel-btn') : null;
    bar.innerHTML = (headerCancel ? '' : '<button type="button" class="btn apms-button apms-button--quiet apms-unified-quiet" onclick="requestCloseModal(\'cancel\')">취소</button>') +
        '<button type="button" class="btn apms-button apms-button--primary btn-primary apms-unified-primary" onclick="document.getElementById(\'modal-action-btn\').click()"></button>';
    bar.lastChild.textContent = String(at);
    root.appendChild(bar);
}

function showModal(t, b, at=null, af=null) {
    applyModalContent(t, b, at, af);
    updateAppBackButtons();
}

// ============================================================
// [모달 닫기 정책] Esc · 바깥 클릭 · "저장 안 한 변경" (2026-11-02 사용자 결정)
// 사용법: apmath/DESIGN.md "모달 공통 부품" 절.
// - Esc: 열린 모달(맨 위 하나)을 닫는다. 입력 중이거나 변경이 있으면 "닫을까요?" 확인.
//   단계 모달(showModalStep)이면 한 단계만 돌아간다(closeModal 의미 그대로).
// - 바깥 클릭: 입력 중이거나 변경이 있으면 닫지 않는다. 작업 화면(W)·전체 화면(P) 등급은 늘 닫지 않는다.
// - "입력 중" 판정: ① 모달이 setModalDirtyChecker(fn)로 등록한 콜백(있으면 이것만 본다)
//   ② 사용자가 본문 안 입력칸을 직접 바꿨는가(신뢰된 input/change 이벤트). 코드로 .value를 넣은 것은 세지 않는다.
//   검색창처럼 세면 안 되는 칸은 type="search" 이거나 data-apms-nodirty 속성을 단다.
// ============================================================
function resetModalDirtyState(bodyEl) {
    modalDirtyTouched = false;
    modalDirtyChecker = null;
    if (bodyEl && modalDirtyBound !== bodyEl && typeof bodyEl.addEventListener === 'function') {
        modalDirtyBound = bodyEl;
        const mark = event => {
            if (!event || event.isTrusted === false) return;
            const target = event.target;
            if (!target || !target.tagName) return;
            const tag = String(target.tagName).toUpperCase();
            if (tag !== 'INPUT' && tag !== 'TEXTAREA' && tag !== 'SELECT') return;
            if (String(target.type || '').toLowerCase() === 'search') return;
            if (typeof target.closest === 'function' && target.closest('[data-apms-nodirty]')) return;
            modalDirtyTouched = true;
        };
        bodyEl.addEventListener('input', mark, true);
        bodyEl.addEventListener('change', mark, true);
    }
}

function setModalDirtyChecker(fn) {
    modalDirtyChecker = typeof fn === 'function' ? fn : null;
}

function markModalClean() {
    modalDirtyTouched = false;
}

function markModalDirty() {
    modalDirtyTouched = true;
}

function isModalDirty() {
    if (typeof modalDirtyChecker === 'function') {
        try { return !!modalDirtyChecker(); } catch (error) { console.warn('[modal dirty checker] failed:', error); return false; }
    }
    // 진도 모달은 자기 초안 비교 장치(hasUnsavedClassProgressChanges)가 있다. 그대로 쓴다.
    const body = document.getElementById('modal-body');
    if (body && typeof body.querySelector === 'function' && body.querySelector('.ap-class-progress-modal') &&
        typeof hasUnsavedClassProgressChanges === 'function') {
        try { return !!hasUnsavedClassProgressChanges(); } catch (error) { return false; }
    }
    return modalDirtyTouched;
}

// 'confirm' | 'form' | 'workspace' | 'panel' | 'legacy'(등급 클래스가 없는 옛 모달)
function getModalTier() {
    const body = document.getElementById('modal-body');
    const root = body && typeof body.querySelector === 'function' ? body.querySelector('.apms-modal') : null;
    if (!root) return 'legacy';
    const has = name => root.classList.contains('apms-modal--' + name);
    if (has('confirm')) return 'confirm';
    if (has('workspace') || has('workspace-single')) return 'workspace';
    if (has('panel')) return 'panel';
    return 'form';
}

// 순수 판정: source 'escape' | 'cancel'(헤더 취소) | 'back'(앱 ← · 기기 뒤로 가기) | 'backdrop' → 'close' | 'confirm' | 'ignore'
// escape·cancel·back은 같은 규칙이다: 변경이 있으면 확인, 없으면 닫음(작업 화면·전체 화면 등급도 같다).
function decideModalClose(source, tier, dirty) {
    if (source === 'backdrop') {
        if (tier === 'workspace' || tier === 'panel') return 'ignore';
        return dirty ? 'ignore' : 'close';
    }
    return dirty ? 'confirm' : 'close';
}

function confirmDiscardModalChanges() {
    const message = '입력한 내용이 저장되지 않았습니다. 닫을까요?';
    if (typeof window !== 'undefined' && typeof window.confirm === 'function') return window.confirm(message);
    return typeof confirm === 'function' ? confirm(message) : false;
}

function requestCloseModal(source) {
    if (!isModalOpen()) return false;
    const action = decideModalClose(source, getModalTier(), isModalDirty());
    if (action === 'ignore') return false;
    if (action === 'confirm' && !confirmDiscardModalChanges()) return false;
    // 'back'(앱 ← 버튼·기기 뒤로 가기)은 반 화면 등으로 돌아가는 경로를 지키는 전용 닫기를 쓴다. 'escape'·'cancel'은 closeModal().
    if (source === 'back' && typeof closeModalForAppBack === 'function') closeModalForAppBack();
    else closeModal();
    return true;
}

// 모달 위에 뜨는 다른 레이어(전체 화면 오버레이 등)가 Esc로 닫히게 하려면 연다/닫는 쪽에서 등록한다.
// 가장 늦게 열린 것(모달 포함)만 Esc에 반응한다. 반환값은 해제 함수.
function registerEscapeLayer(closeFn) {
    const layer = { seq: ++modalLayerSeq, close: closeFn };
    apmsEscapeLayers.push(layer);
    if (typeof apmsNavScheduleSync === 'function') apmsNavScheduleSync();
    return function unregisterEscapeLayer() {
        const index = apmsEscapeLayers.indexOf(layer);
        if (index >= 0) apmsEscapeLayers.splice(index, 1);
        if (typeof apmsNavScheduleSync === 'function') apmsNavScheduleSync();
    };
}

function handleModalEscape(event) {
    if (!event || (event.key !== 'Escape' && event.key !== 'Esc')) return false;
    if (event.defaultPrevented || event.isComposing) return false;
    const topLayer = apmsEscapeLayers.length ? apmsEscapeLayers[apmsEscapeLayers.length - 1] : null;
    const modalOpen = isModalOpen();
    if (topLayer && (!modalOpen || topLayer.seq > modalOpenSeq)) {
        if (typeof topLayer.close === 'function') topLayer.close(event);
        if (typeof event.preventDefault === 'function') event.preventDefault();
        return true;
    }
    if (!modalOpen) return false;
    if (typeof document.querySelector === 'function' && document.querySelector('.ap-login-fullscreen')) return false;
    const closed = requestCloseModal('escape');
    if (closed && typeof event.preventDefault === 'function') event.preventDefault();
    return closed;
}

function handleModalBackdropPress(event) {
    const overlay = document.getElementById('modal-overlay');
    modalBackdropPressed = !!event && !!overlay && event.target === overlay;
}

function handleModalBackdropClick(event) {
    const overlay = document.getElementById('modal-overlay');
    const pressed = modalBackdropPressed;
    modalBackdropPressed = false;
    if (!event || !overlay || event.target !== overlay || !pressed) return false;
    return requestCloseModal('backdrop');
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function' && !document.__apmsModalEscapeBound) {
    document.__apmsModalEscapeBound = true;
    document.addEventListener('keydown', handleModalEscape);
}

function handleModalKeyboard(event) {
    if (!event || event.key !== 'Tab') return;
    const overlay = document.getElementById('modal-overlay');
    if (!overlay || overlay.classList.contains('hidden')) return;
    const focusable = Array.from(overlay.querySelectorAll(
        'button:not([disabled]):not(.hidden), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    )).filter(element => element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function showModalStep(t, b, at=null, af=null) {
    if (!state.ui) state.ui = {};
    const snapshot = getCurrentModalSnapshot();
    if (snapshot) modalStepStack.push(snapshot);
    applyModalContent(t, b, at, af);
    updateAppBackButtons();
}

function replaceModalStep(t, b, at=null, af=null) {
    applyModalContent(t, b, at, af);
    updateAppBackButtons();
}

function clearModalSteps() {
    modalStepStack = [];
}

function restoreModalSnapshot(snapshot) {
    if (!snapshot) return false;
    applyModalContent(
        snapshot.title || '',
        snapshot.bodyHtml || '',
        snapshot.actionHidden ? null : snapshot.actionText,
        snapshot.actionHidden ? null : snapshot.actionHandler
    );

    const footer = document.getElementById('modal-footer');
    if (footer) {
        footer.innerHTML = snapshot.footerHtml || '';
        footer.classList.toggle('hidden', !!snapshot.footerHidden);
    }

    if (!state.ui) state.ui = {};
    state.ui.modalReturnView = snapshot.modalReturnView || null;
    state.ui.currentStudentDetailSubModal = snapshot.studentDetailSubModal || null;
    modalDirtyChecker = typeof snapshot.dirtyChecker === 'function' ? snapshot.dirtyChecker : null;
    return true;
}

function setManagementReturnView(ctx) {
    if (!state.ui) state.ui = {};
    state.ui.returnView = ctx || null;
}

function setModalReturnView(ctx) {
    if (!state.ui) state.ui = {};
    state.ui.modalReturnView = ctx || null;
}

function returnToPreviousManagementView(fallback = 'dashboard', ctx = null) {
    if (!state.ui) state.ui = {};
    const view = ctx || state.ui.returnView || {};
    state.ui.modalReturnView = null;

    if (view.type === 'addressBook' && typeof openAddressBook === 'function') return openAddressBook();
    if (view.type === 'classManage' && typeof openClassManageModal === 'function') return openClassManageModal();
    if (view.type === 'classDetail' && view.classId && typeof renderClass === 'function') {
        closeModal(true);
        // Do not confuse the previous class screen with the class selected in progress.
        const existingClassroom = document.querySelector('.ap-classroom-shell');
        if (existingClassroom && String(existingClassroom.getAttribute('data-class-id') || '') === String(view.classId)) {
            state.ui.currentClassId = String(view.classId);
            return;
        }
        return renderClass(view.classId);
    }
    if (view.type === 'studentDetail' && view.studentId && typeof renderStudentDetail === 'function') {
        closeModal(true);
        return renderStudentDetail(view.studentId);
    }
    if (view.type === 'timetable' && typeof renderTimetable === 'function') {
        closeModal(true);
        // [깜박임 핫픽스] 시간표가 배경에 이미 살아 있으면 전체 재렌더하지 않는다.
        if (document.getElementById('timetable-root')) return;
        return renderTimetable();
    }
    if (view.type === 'attendance') {
        closeModal(true);
        const attOv = document.getElementById('att-ledger-overlay');
        if (attOv) {
            attOv.style.display = 'flex';
            attOv.style.flexDirection = 'column';
        } else if (typeof openAttendanceLedger === 'function') {
            openAttendanceLedger();
        }
        return;
    }

    closeModal(true);
    if (fallback === 'dashboard' && typeof renderDashboard === 'function') return renderDashboard();
}

function closeModal(suppressReturn = false) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;
    if (overlay.dataset.mutationPending) return;
    if (!state.ui) state.ui = {};
    if (Object.prototype.hasOwnProperty.call(state.ui, 'classProgressModalRequestId')) {
        state.ui.classProgressModalRequestId = Number(state.ui.classProgressModalRequestId || 0) + 1;
    }

    if (!suppressReturn && modalStepStack.length) {
        const previous = modalStepStack.pop();
        restoreModalSnapshot(previous);
        updateAppBackButtons();
        apmsNavScheduleSync();
        return;
    }

    if (suppressReturn) {
        state.ui.modalReturnView = null;
        clearModalSteps();
    }
    const shouldReturn = !suppressReturn && !!state.ui.modalReturnView;
    const returnCtx = shouldReturn ? state.ui.modalReturnView : null;
    if (shouldReturn) state.ui.modalReturnView = null;

    if (modalCloseTimer) {
        clearTimeout(modalCloseTimer);
        modalCloseTimer = null;
    }

    overlay.classList.remove('show');
    modalDirtyTouched = false;
    modalDirtyChecker = null;
    apmsModalLogicalOpen = false;
    apmsNavScheduleSync();
    modalCloseTimer = setTimeout(() => {
        overlay.classList.add('hidden');
        document.body?.classList?.remove('ap-modal-open');
        modalCloseTimer = null;

        const actionBtn = document.getElementById('modal-action-btn');
        const footer = document.getElementById('modal-footer');
        if (actionBtn) {
            actionBtn.classList.add('hidden');
            actionBtn.onclick = null;
            actionBtn.disabled = false;
            actionBtn.innerText = '';
        }
        if (footer) {
            footer.classList.add('hidden');
            footer.innerHTML = '';
        }
        if (returnCtx) returnToPreviousManagementView('dashboard', returnCtx);
        updateAppBackButtons();
    }, apmsModalCloseDelay());
}

function escapeHtmlForTextarea(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function setModalBody(html) {
    const body = document.getElementById('modal-body');
    if (body) {
        body.innerHTML = html;
        // 본문을 통째로 바꾸면 새 화면이므로 "입력 중" 표시를 처음으로 되돌린다.
        // (등록한 dirty 콜백은 유지한다. 콜백은 모달 하나의 수명 동안 쓴다.)
        modalDirtyTouched = false;
    }
}

function setModalLoading(title, message) {
    showModal(title, `
        <div style="text-align:center; padding:40px 24px; color:var(--secondary);">
            <div style="font-size:14px; font-weight:700;">${message || '잠시만 기다려주세요...'}</div>
        </div>
    `);
}

function setButtonBusy(buttonOrSelector, isBusy, label = '처리 중') {
    const btn = typeof buttonOrSelector === 'string' ? document.querySelector(buttonOrSelector) : buttonOrSelector;
    if (!btn) return;

    if (isBusy) {
        if (!btn.dataset.originalText) btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<span style="opacity:0.7;">${label}...</span>`;
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
    } else {
        if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
        btn.disabled = false;
        btn.style.pointerEvents = 'auto';
    }
}

function safeToastError(message) {
    toast(message, 'error');
}


// ============================================================
// [상단 헤더 동기화] 모바일 헤더 사용자명 / 내부 중복 헤더 숨김
// ============================================================
function getHeaderUserName() {
    if (typeof getTeacherNameForUI === 'function') {
        const teacherName = String(getTeacherNameForUI() || '').replace(/\s*선생님\s*$/g, '').trim();
        if (teacherName) return teacherName;
    }

    if (typeof state !== 'undefined') {
        if (state.ui && state.ui.userName) return String(state.ui.userName).replace(/\s*선생님\s*$/g, '').trim();
        if (state.auth && state.auth.name) return String(state.auth.name).replace(/\s*선생님\s*$/g, '').trim();
    }

    try {
        const session = JSON.parse(localStorage.getItem('APMATH_SESSION') || 'null');
        if (session && session.name) return String(session.name).replace(/\s*선생님\s*$/g, '').trim();
    } catch (e) {}

    return '';
}

function ensureDesktopHeaderUser() {
    const topbar = document.querySelector('.desktop-topbar');
    if (!topbar) return null;

    let el = document.getElementById('desktop-header-user');
    if (!el) {
        el = document.createElement('div');
        el.id = 'desktop-header-user';
        topbar.appendChild(el);
    }

    el.style.marginLeft = 'auto';
    el.style.fontSize = '15px';
    el.style.fontWeight = '600';
    el.style.color = 'var(--text)';
    el.style.whiteSpace = 'nowrap';
    el.style.textAlign = 'right';
    el.style.pointerEvents = 'none';
    return el;
}

function updateMobileHeaderUser(name) {
    const value = (name !== undefined ? String(name || '') : getHeaderUserName()).replace(/\s*선생님\s*$/g, '').trim();
    const el = document.getElementById('mobile-header-user');
    if (el) {
        el.textContent = value;
        el.title = value;
    }

    const desktopEl = ensureDesktopHeaderUser();
    if (desktopEl) {
        desktopEl.textContent = value;
        desktopEl.title = value;
        desktopEl.style.display = value ? 'block' : 'none';
    }
}

function syncDashboardInternalHeader() {
    const root = document.getElementById('app-root');
    if (!root || !root.firstElementChild) return;

    // 이전에 숨긴 요소가 첫 번째 요소가 아니게 되었거나 조건이 바뀐 경우 복구한다.
    root.querySelectorAll('.ap-internal-header-hidden').forEach(el => {
        if (el !== root.firstElementChild) el.classList.remove('ap-internal-header-hidden');
    });

    const first = root.firstElementChild;
    if (!first) return;

    const directDrawerButton = first.querySelector(':scope > div button[onclick*="openAppDrawer"], :scope > button[onclick*="openAppDrawer"]');
    const hasTeacherSuffix = /선생님/.test(first.textContent || '');
    const hasTodayJournal = !!first.querySelector('h3') && /오늘일지/.test(first.textContent || '');

    // 대시보드 내부의 상단 컨트롤 행만 숨긴다.
    // 단순히 "선생님" 텍스트가 있다는 이유로 일반 콘텐츠를 숨기지 않는다.
    if (directDrawerButton && hasTeacherSuffix && !hasTodayJournal && first.children.length <= 3) {
        first.classList.add('ap-internal-header-hidden');
    } else {
        first.classList.remove('ap-internal-header-hidden');
    }
}

let appRootObserver = null;
function bootHeaderSync() {
    updateMobileHeaderUser();
    syncDashboardInternalHeader();

    const root = document.getElementById('app-root');
    if (root && !appRootObserver) {
        appRootObserver = new MutationObserver(() => {
            updateMobileHeaderUser();
            syncDashboardInternalHeader();
        });
        appRootObserver.observe(root, { childList: true, subtree: false });
    }
}

function patchHeaderRelatedGlobals(retryCount = 0) {
    let patchedSomething = false;

    if (typeof window.loadData === 'function' && !window.__apLoadDataHeaderPatched) {
        const originalLoadData = window.loadData;
        window.loadData = async function(...args) {
            const result = await originalLoadData.apply(this, args);
            updateMobileHeaderUser();
            syncDashboardInternalHeader();
            return result;
        };
        window.__apLoadDataHeaderPatched = true;
        patchedSomething = true;
    }

    if (typeof window.logout === 'function' && !window.__apLogoutHeaderPatched) {
        const originalLogout = window.logout;
        window.logout = function(...args) {
            const result = originalLogout.apply(this, args);
            updateMobileHeaderUser('');
            removeAppDrawer();
            return result;
        };
        window.__apLogoutHeaderPatched = true;
        patchedSomething = true;
    }

    if ((!window.__apLoadDataHeaderPatched || !window.__apLogoutHeaderPatched) && retryCount < 3) {
        setTimeout(() => patchHeaderRelatedGlobals(retryCount + 1), 120);
    } else if (!patchedSomething && retryCount >= 3) {
        console.warn('[ui.js] header sync hooks were not fully patched.');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        patchHeaderRelatedGlobals();
        bootHeaderSync();
        appHistoryPatchGlobalNavigation();
    });
} else {
    patchHeaderRelatedGlobals();
    bootHeaderSync();
    appHistoryPatchGlobalNavigation();
}


// ============================================================
// [드로어 네비게이션] 아이콘형 섹션 메뉴 + PC 미니 레일 겸용
// ============================================================
function getDrawerRoleKey() {
    const role = String((typeof state !== 'undefined' && state.auth && state.auth.role) || '').toLowerCase();
    if (role === 'admin') return 'admin';
    if (role === 'eieteacher') return 'none';
    return 'teacher';
}

const DRAWER_ICON_SVG = {
    students: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4"/><circle cx="12" cy="8" r="3"/><path d="M20 18c0-1.7-1.1-3.1-2.6-3.7"/><path d="M17 6.2a2.5 2.5 0 0 1 0 4.6"/></svg>',
    class: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v15H6.5A2.5 2.5 0 0 1 4 16.5z"/><path d="M7 4v15"/><path d="M10 8h6"/><path d="M10 12h5"/></svg>',
    attendance: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2"/><path d="M15 4V2"/><path d="M9 12l2 2 4-4"/></svg>',
    timetable: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M4 9h16"/><path d="M8 13h3"/><path d="M13 13h3"/><path d="M8 17h3"/></svg>',
    journal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h9l3 3v13H6z"/><path d="M15 4v4h4"/><path d="M9 12h6"/><path d="M9 16h5"/></svg>',
    memo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H8l-3 3z"/><path d="M8 9h8"/><path d="M8 12h5"/></svg>',
    schedule: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M5 10h14"/><path d="M9 14h3"/></svg>',
    textbook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v15H6.5A2.5 2.5 0 0 1 4 16.5z"/><path d="M7 4v15"/><path d="M10 8h5"/><path d="M10 12h6"/></svg>',
    material: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7l8 4 8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg>',
    clinic: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/><rect x="4" y="4" width="16" height="16" rx="4"/></svg>',
    school: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10 12 5l8 5-8 5z"/><path d="M7 12v5c2.8 1.7 7.2 1.7 10 0v-5"/></svg>',
    exam: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h7l3 3v13H7z"/><path d="M14 4v4h4"/><path d="M9.5 13.5l1.5 1.5 3.5-4"/></svg>',
    omr: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="2"/><circle cx="9" cy="9" r="1"/><circle cx="9" cy="13" r="1"/><circle cx="9" cy="17" r="1"/><path d="M12 9h4"/><path d="M12 13h4"/><path d="M12 17h4"/></svg>',
    report: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20V10"/><path d="M12 20V4"/><path d="M19 20v-7"/><path d="M3.5 20h17"/></svg>',
    sync: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.7 6.4"/><path d="M5.5 15a7 7 0 0 0 11.8 2.6"/></svg>',
    manual: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 1 4 15.5z"/><path d="M8 8h8"/><path d="M8 12h7"/><path d="M8 16h6"/></svg>',
    discharged: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4"/><circle cx="12" cy="8" r="3"/><path d="M17 12h4"/></svg>',
    archive: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="4" rx="1.5"/><path d="M5 8.5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/><path d="M10 12h4"/></svg>',
    manage: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 3.4-.2-.1a1.7 1.7 0 0 0-1.9.3 1.7 1.7 0 0 0-.6 1.7v.2H9v-.2a1.7 1.7 0 0 0-.6-1.7 1.7 1.7 0 0 0-1.9-.3l-.2.1-2-3.4.1-.1A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3 13.8h-.2v-3.6H3A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-3.4.2.1a1.7 1.7 0 0 0 1.9-.3A1.7 1.7 0 0 0 9 1.7v-.2h6v.2a1.7 1.7 0 0 0 .6 1.7 1.7 1.7 0 0 0 1.9.3l.2-.1 2 3.4-.1.1A1.7 1.7 0 0 0 19.4 9 1.7 1.7 0 0 0 21 10.2h.2v3.6H21a1.7 1.7 0 0 0-1.6 1.2z"/></svg>',
    logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/><path d="M14 8l4 4-4 4"/><path d="M18 12H9"/></svg>',
    playground: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2v7.31L4.17 19.5A2 2 0 0 0 5.89 22h12.22a2 2 0 0 0 1.72-2.5L14 9.31V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>',
    default: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/></svg>'
};

function drawerIcon(icon) {
    const key = String(icon || '').trim();
    return DRAWER_ICON_SVG[key] || DRAWER_ICON_SVG.default;
}

function drawerItem(icon, label, action, extraClass = '', navKey = '') {
    if (String(action || '').indexOf('renderTimetableMonths') !== -1) return '';
    const safeLabel = (typeof apEscapeHtml === 'function') ? apEscapeHtml(String(label || '')) : String(label || '');
    const iconHtml = drawerIcon(icon);
    // aria-label·title: 레일(56px)에서는 이름 글자가 숨겨지므로 이 둘이 이름 역할을 한다.
    const navAttr = navKey ? ` data-nav="${navKey}"` : '';
    return `
        <button type="button" class="drw-item ${extraClass}"${navAttr} aria-label="${safeLabel}" title="${safeLabel}" onclick="${action}">
            <span class="drw-icon" aria-hidden="true">${iconHtml}</span>
            <span class="drw-label">${safeLabel}</span>
        </button>
    `;
}

// ------------------------------------------------------------
// 현재 위치 표시 (aria-current="page")
// - 서랍 항목을 누르면 drawerMark(key, kind)가 그 항목을 현재 위치로 표시한다.
//   kind 'modal': 모달·작업 화면(W)이 열려 있는 동안만 표시하고, 닫히면 해제한다.
//   kind 'page' : 시간표·출석부·학교성적처럼 본 화면을 바꾸는 항목. 이후는 appHistoryState.currentView로 따라간다.
// - 대시보드·반 화면에서 모달이 열리면 표시는 없다(서랍 항목이 없는 일).
// ------------------------------------------------------------
const DRAWER_PAGE_NAV_KEYS = { timetable: 'timetable', attendance: 'attendance', schoolExam: 'school' };
const drawerNavState = { intent: null, timer: null, observer: null };

function drawerOverlayOpen() {
    const modal = document.getElementById('modal-overlay');
    if (modal && !modal.classList.contains('hidden') && modal.classList.contains('show')) return true;
    const wide = document.getElementById('report-center-wide-overlay');
    return !!(wide && wide.classList.contains('show'));
}

function drawerPageNavKey() {
    try {
        const view = appHistoryState && appHistoryState.currentView;
        return (view && DRAWER_PAGE_NAV_KEYS[view.type]) || '';
    } catch (e) {
        return '';
    }
}

function drawerResolveCurrentKey() {
    return drawerNavState.intent ? drawerNavState.intent.key : drawerPageNavKey();
}

function drawerRefreshCurrent() {
    const drw = document.getElementById('app-drawer');
    if (!drw) return '';
    const key = drawerResolveCurrentKey();
    drw.querySelectorAll('.drw-item[data-nav]').forEach(btn => {
        const on = !!key && btn.getAttribute('data-nav') === key;
        btn.classList.toggle('drw-active', on);
        if (on) btn.setAttribute('aria-current', 'page');
        else btn.removeAttribute('aria-current');
    });
    return key;
}

function drawerNavTick() {
    const intent = drawerNavState.intent;
    if (intent) {
        const age = Date.now() - intent.at;
        const open = drawerOverlayOpen();
        if (open) intent.seen = true;
        // 모달형: 한 번 열렸다가 닫히면 해제. 열리지 않으면 3초 뒤 해제. 본 화면형: 3초 뒤 currentView에 맡긴다.
        const done = intent.kind === 'modal' ? (!open && (intent.seen || age > 3000)) : age > 3000;
        if (done) drawerNavState.intent = null;
    }
    if (!drawerNavState.intent && drawerNavState.timer) {
        clearInterval(drawerNavState.timer);
        drawerNavState.timer = null;
    }
    drawerRefreshCurrent();
}

function drawerMark(key, kind) {
    drawerNavState.intent = { key: String(key || ''), kind: kind === 'page' ? 'page' : 'modal', at: Date.now(), seen: false };
    if (!drawerNavState.timer) drawerNavState.timer = setInterval(drawerNavTick, 300);
    drawerRefreshCurrent();
}

// 서랍·레일이 스크롤될 때 아래에 더 있음을 알리는 페이드(.drw-scroll-more, CSS가 그린다). 끝까지 내리면 사라진다.
function drawerUpdateScrollHint() {
    const drw = document.getElementById('app-drawer');
    if (!drw) return;
    const more = drw.scrollHeight - drw.clientHeight - drw.scrollTop > 4;
    drw.classList.toggle('drw-scroll-more', more);
}

function drawerBindScrollHint(drw) {
    if (!drw || drw.__apScrollHint) return;
    drw.__apScrollHint = true;
    drw.addEventListener('scroll', drawerUpdateScrollHint, { passive: true });
    window.addEventListener('resize', drawerUpdateScrollHint);
}

function drawerBindNavObserver() {
    if (drawerNavState.observer || typeof MutationObserver === 'undefined') return;
    const root = document.getElementById('app-root');
    if (!root) return;
    // 본 화면이 바뀌면(대시보드 버튼으로 시간표를 연 경우 포함) 표시를 다시 계산한다.
    drawerNavState.observer = new MutationObserver(() => drawerRefreshCurrent());
    drawerNavState.observer.observe(root, { childList: true });
}

function drawerSection(label) {
    return `<div class="drw-section-label">${(typeof apEscapeHtml === 'function') ? apEscapeHtml(String(label || '')) : String(label || '')}</div>`;
}

function openManualCenter() {
    const url = '../manual/';
    const opened = window.open(url, '_blank', 'noopener');
    if (!opened) window.location.href = url;
}

function buildDrawerMenu(roleKey) {
    const isAdminDrawer = roleKey === 'admin';

    // 원장 서랍: 항목 구성은 그대로 두고(결정 D1) 이름 통일·현재 위치 표시·아이콘만 적용한다.
    if (isAdminDrawer) {
        return `
            ${drawerSection('학생 관리')}
            ${drawerItem('students', '학생 관리', "closeAppDrawer(); drawerMark('students'); openAddressBook();", '', 'students')}
            ${drawerItem('class', '반 관리', "closeAppDrawer(); drawerMark('class'); openClassManageModal();", '', 'class')}

            ${drawerSection('운영')}
            ${drawerItem('schedule', '일정관리', "closeAppDrawer(); if(typeof openExamScheduleModal==='function') { drawerMark('schedule'); openExamScheduleModal(); } else toast('일정관리 기능을 불러오지 못했습니다.', 'warn');", '', 'schedule')}
            ${drawerItem('timetable', '시간표', "closeAppDrawer(); if(typeof openLiveTimetable==='function') { drawerMark('timetable', 'page'); openLiveTimetable(); } else if(typeof renderTimetable==='function') { drawerMark('timetable', 'page'); renderTimetable(); } else toast('시간표 기능을 불러오지 못했습니다.', 'warn');", '', 'timetable')}
            ${drawerItem('discharged', '퇴원생', "closeAppDrawer(); if(typeof openDischargedStudents==='function') { drawerMark('discharged'); openDischargedStudents(); } else toast('퇴원생 기능을 불러오지 못했습니다.', 'warn');", '', 'discharged')}
            ${drawerItem('exam', '진단평가', "closeAppDrawer(); if(typeof openAdminDiagnosticPanel==='function') { drawerMark('diagnostic'); openAdminDiagnosticPanel(); } else toast('진단평가 기능을 불러오지 못했습니다.', 'warn');", '', 'diagnostic')}

            ${drawerSection('수업 자료')}
            ${drawerItem('archive', '아카이브', "closeAppDrawer(); if(typeof openDashboardArchiveWindow==='function') openDashboardArchiveWindow(event); else toast('아카이브를 불러오지 못했습니다.', 'warn');")}
            ${drawerItem('playground', '도형·함수 실험실', "closeAppDrawer(); window.open('./playground/index.html', '_blank', 'noopener');")}

            ${drawerSection('지원')}
            ${drawerItem('manage', '관리', "closeAppDrawer(); if(typeof openAdminOperationMenu==='function') { drawerMark('manage'); openAdminOperationMenu(); } else toast('관리 기능을 불러오지 못했습니다.', 'warn');", '', 'manage')}
            ${drawerItem('sync', '시스템 동기화', "closeAppDrawer(); drawerMark('sync'); openOperationMenu();", '', 'sync')}
            ${drawerItem('manual', '사용설명서', "closeAppDrawer(); openManualCenter();")}
        `;
    }

    // 선생님 서랍: 자주 쓰는 순서(수업 → 반·학생 → 기록 → 평가·리포트 → 자료 → 지원). 항목은 빼지 않고 묶음만 옮겼다.
    return `
        ${drawerSection('수업')}
        ${drawerItem('timetable', '시간표', "closeAppDrawer(); if(typeof openLiveTimetable==='function') { drawerMark('timetable', 'page'); openLiveTimetable(); } else if(typeof renderTimetable==='function') { drawerMark('timetable', 'page'); renderTimetable(); } else toast('시간표 기능을 불러오지 못했습니다.', 'warn');", '', 'timetable')}
        ${drawerItem('attendance', '출석부', "closeAppDrawer(); if(typeof openAttendanceLedger==='function') { drawerMark('attendance', 'page'); openAttendanceLedger(); } else if(typeof renderAttendanceLedger==='function') { drawerMark('attendance'); renderAttendanceLedger(); } else toast('출석부 기능을 불러오지 못했습니다.', 'warn');", '', 'attendance')}
        ${drawerItem('textbook', '진도·교재', "closeAppDrawer(); if(typeof openGlobalTextbookManage==='function') { drawerMark('textbook'); openGlobalTextbookManage(); } else toast('진도·교재 기능을 불러오지 못했습니다.', 'warn');", '', 'textbook')}
        ${drawerItem('clinic', '클리닉', "closeAppDrawer(); if(typeof openClinicCenter==='function') { drawerMark('clinic'); openClinicCenter(); } else toast('클리닉 기능을 불러오지 못했습니다.', 'warn');", '', 'clinic')}
        ${drawerItem('exam', '원내평가·OMR', "closeAppDrawer(); if(typeof openExamWorkspace==='function') { drawerMark('exam-omr'); openExamWorkspace(''); } else toast('원내평가·OMR 기능을 불러오지 못했습니다.', 'warn');", '', 'exam-omr')}

        ${drawerSection('반·학생')}
        ${drawerItem('manage', '반 관리', "closeAppDrawer(); drawerMark('class'); openClassManageModal();", '', 'class')}
        ${drawerItem('students', '학생 관리', "closeAppDrawer(); drawerMark('students'); openAddressBook();", '', 'students')}
        ${drawerItem('discharged', '퇴원생', "closeAppDrawer(); if(typeof openWithdrawalReport==='function') { drawerMark('discharged'); openWithdrawalReport(); } else toast('퇴원생 기능을 불러오지 못했습니다.', 'warn');", '', 'discharged')}

        ${drawerSection('기록')}
        ${drawerItem('journal', '일지', "closeAppDrawer(); drawerMark('journal'); openDailyJournalModal();", '', 'journal')}
        ${drawerItem('memo', '메모', "closeAppDrawer(); drawerMark('memo'); openTodoMemoModal();", '', 'memo')}
        ${drawerItem('schedule', '일정관리', "closeAppDrawer(); if(typeof openExamScheduleModal==='function') { drawerMark('schedule'); openExamScheduleModal(); } else toast('일정관리 기능을 불러오지 못했습니다.', 'warn');", '', 'schedule')}

        ${drawerSection('평가·리포트')}
        ${drawerItem('report', '리포트 센터', "closeAppDrawer(); if(typeof openReportCenterHome==='function') { drawerMark('report'); openReportCenterHome(); } else toast('리포트 센터를 불러오지 못했습니다.', 'warn');", '', 'report')}
        ${drawerItem('school', '학교성적', "closeAppDrawer(); if(typeof openSchoolExamLedger==='function') { drawerMark('school', 'page'); openSchoolExamLedger(); } else if(typeof openCumulativeOpsModal==='function') { drawerMark('school'); openCumulativeOpsModal('school'); } else toast('학교성적 기능을 불러오지 못했습니다.', 'warn');", '', 'school')}

        ${drawerSection('자료')}
        ${drawerItem('material', '수업자료', "closeAppDrawer(); if(typeof openStudyMaterialWrongCenter==='function') { drawerMark('material'); openStudyMaterialWrongCenter(); } else toast('수업자료 기능을 불러오지 못했습니다.', 'warn');", '', 'material')}
        ${drawerItem('archive', '시험지 보관함', "closeAppDrawer(); window.open(appendArchiveSessionToUrlForUi('../archive/assessment/assessment-mvp.html'), '_blank', 'noopener');")}
        ${drawerItem('playground', '도형·함수 실험실', "closeAppDrawer(); window.open('./playground/index.html', '_blank', 'noopener');")}

        ${drawerSection('지원')}
        ${drawerItem('sync', '시스템 동기화', "closeAppDrawer(); drawerMark('sync'); openOperationMenu();", '', 'sync')}
        ${drawerItem('manual', '사용설명서', "closeAppDrawer(); openManualCenter();")}
    `;
}

function ensureDrawerStyle() {
    const oldInlineStyle = document.getElementById('app-drawer-style');
    if (oldInlineStyle) oldInlineStyle.remove();

    if (document.getElementById('sidebar-foundation-css') || document.querySelector('link[href*="sidebar-foundation.css"]')) return;

    const link = document.createElement('link');
    link.id = 'sidebar-foundation-css';
    link.rel = 'stylesheet';
    link.href = './css/sidebar-foundation.css';
    document.head.appendChild(link);
}

function renderAppDrawer(force = false) {
    const currentRole = getDrawerRoleKey();
    if (currentRole === 'none') {
        removeAppDrawer();
        return;
    }

    ensureDrawerStyle();

    const oldDrawer = document.getElementById('app-drawer');
    const oldOverlay = document.getElementById('app-drawer-overlay');
    const roleChanged = oldDrawer && oldDrawer.dataset.role !== currentRole;

    if (oldDrawer && oldOverlay && !force && !roleChanged) {
        applyTheme(getTheme());
        return;
    }

    if (oldDrawer) oldDrawer.remove();
    if (oldOverlay) oldOverlay.remove();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="app-drawer-overlay" onclick="closeAppDrawer()"></div>
        <nav id="app-drawer" data-role="${currentRole}" aria-label="AP Math OS navigation">
            <button class="drw-rail-toggle" onclick="openAppDrawer()" aria-label="메뉴 열기" title="메뉴"><span class="ap-hamburger-glyph">☰</span></button>
            <div class="drw-top-tools">
                <button class="drw-hamburger" onclick="closeAppDrawer()" aria-label="메뉴 닫기" title="닫기"><span class="ap-hamburger-glyph">☰</span></button>
                <label class="switch" title="다크 모드">
                    <input type="checkbox" id="theme-switch" onchange="toggleTheme()">
                    <span class="slider"></span>
                </label>
            </div>
            <div class="drw-menu">
                ${buildDrawerMenu(currentRole)}
            </div>
            <div class="drw-spacer"></div>
            <div class="drw-footer">
                ${drawerItem('logout', '로그아웃', "closeAppDrawer(); logout();", 'danger')}
            </div>
        </nav>
    `;

    while (wrapper.firstChild) {
        document.body.appendChild(wrapper.firstChild);
    }

    drawerBindNavObserver();
    drawerRefreshCurrent();
    drawerBindScrollHint(document.getElementById('app-drawer'));
    drawerUpdateScrollHint();
    window.setTimeout(drawerUpdateScrollHint, 300);
    applyTheme(getTheme());
}

function removeAppDrawer() {
    const drw = document.getElementById('app-drawer');
    const ovl = document.getElementById('app-drawer-overlay');
    if (drw) drw.remove();
    if (ovl) ovl.remove();

    const style = document.getElementById('app-drawer-style');
    if (style) style.remove();
}

function isDesktopDrawerMode() {
    return window.matchMedia && window.matchMedia('(min-width: 901px)').matches;
}

function openAppDrawer() {
    if (getDrawerRoleKey() === 'none') {
        removeAppDrawer();
        return;
    }
    renderAppDrawer();
    drawerRefreshCurrent();
    drawerUpdateScrollHint();
    const drw = document.getElementById('app-drawer');
    const ovl = document.getElementById('app-drawer-overlay');
    if (!drw) return;

    if (isDesktopDrawerMode()) {
        const expanded = drw.classList.toggle('drw-expanded');
        document.body.classList.toggle('ap-drawer-expanded', expanded);
        return;
    }

    document.body.classList.remove('ap-drawer-expanded');
    drw.classList.add('drw-open');
    if (ovl) ovl.classList.add('drw-open');
}

function closeAppDrawer() {
    const drw = document.getElementById('app-drawer');
    const ovl = document.getElementById('app-drawer-overlay');
    if (drw) {
        drw.classList.remove('drw-open');
        drw.classList.remove('drw-expanded');
    }
    if (ovl) ovl.classList.remove('drw-open');
    document.body.classList.remove('ap-drawer-expanded');
}

function syncDrawerResponsiveState() {
    const drw = document.getElementById('app-drawer');

    if (!isDesktopDrawerMode()) {
        document.body.classList.remove('ap-drawer-expanded');
        if (drw) drw.classList.remove('drw-expanded');
        return;
    }

    if (drw && !drw.classList.contains('drw-expanded')) {
        document.body.classList.remove('ap-drawer-expanded');
    }
}

if (!window.__apDrawerResizePatched) {
    window.__apDrawerResizePatched = true;
    window.addEventListener('resize', syncDrawerResponsiveState);
    window.addEventListener('orientationchange', syncDrawerResponsiveState);
}


function goHome() {
    try {
        if (typeof closeModal === 'function') closeModal();
        if (typeof closeAppDrawer === 'function') closeAppDrawer();

        const isAdmin = typeof state !== 'undefined'
            && state.auth
            && state.auth.role === 'admin';

        const homeRenderer = isAdmin && typeof renderAdminControlCenter === 'function'
            ? renderAdminControlCenter
            : (typeof renderDashboard === 'function' ? renderDashboard : null);

        if (!homeRenderer) {
            window.location.href = 'index.html';
            return;
        }

        window.setTimeout(() => {
            try {
                homeRenderer();
                updateMobileHeaderUser();
                syncDashboardInternalHeader();
            } catch (e) {
                console.warn('[ui.js] goHome render fallback:', e);
                window.location.href = 'index.html';
            }
        }, 280);
        return;
    } catch (e) {
        console.warn('[ui.js] goHome fallback:', e);
    }

    window.location.href = 'index.html';
}

// ============================================================
// [전역 함수 노출]
// ============================================================
window.toggleTheme = toggleTheme;
window.toggleThemeLegacy = toggleThemeLegacy;
window.applyTheme = applyTheme;
window.getTheme = getTheme;
window.ensureThemeToggleButton = ensureThemeToggleButton;
window.toast = toast;
window.showModal = showModal;
window.showModalStep = showModalStep;
window.replaceModalStep = replaceModalStep;
window.clearModalSteps = clearModalSteps;
window.closeModal = closeModal;
window.setManagementReturnView = setManagementReturnView;
window.setModalReturnView = setModalReturnView;
window.returnToPreviousManagementView = returnToPreviousManagementView;
window.appHistoryBack = appHistoryBack;
window.appHistoryCanGoBack = appHistoryCanGoBack;
window.appHistoryRecordView = appHistoryRecordView;
window.appHistoryPatchGlobalNavigation = appHistoryPatchGlobalNavigation;
window.updateAppBackButtons = updateAppBackButtons;
window.setModalBody = setModalBody;
window.setModalLoading = setModalLoading;
window.safeToastError = safeToastError;
window.setButtonBusy = setButtonBusy;
window.renderAppDrawer = renderAppDrawer;
window.openAppDrawer = openAppDrawer;
window.openManualCenter = openManualCenter;
window.closeAppDrawer = closeAppDrawer;
window.removeAppDrawer = removeAppDrawer;
window.goHome = goHome;
window.updateMobileHeaderUser = updateMobileHeaderUser;
window.syncDashboardInternalHeader = syncDashboardInternalHeader;


// ============================================================
// [Drawer Size Lock] 모바일/PC 사이드바 규격 완전 통일
// - PC expanded drawer = 260px
// - 모바일 drawer = 260px 기준, 작은 화면만 안전 축소
// - 상단 drawer header 높이/좌우 padding/햄버거 위치 통일
// ============================================================
function installDrawerSizeLock() {
    const old = document.getElementById('drawer-size-lock-style');
    if (old) old.remove();

    const style = document.createElement('style');
    style.id = 'drawer-size-lock-style';
    style.textContent = `
        :root {
            --ap-drawer-width: 260px;
            --ap-drawer-rail-width: 56px;
            --ap-drawer-x: 16px;
            --ap-drawer-header-h: 58px;
        }

        #app-drawer {
            --drw-left: var(--ap-drawer-x) !important;
            --drw-right: var(--ap-drawer-x) !important;
            width: min(var(--ap-drawer-width), calc(100vw - 56px)) !important;
            max-width: var(--ap-drawer-width) !important;
            box-sizing: border-box !important;
        }

        #app-drawer .drw-top-tools {
            position: relative !important;
            min-height: var(--ap-drawer-header-h) !important;
            height: var(--ap-drawer-header-h) !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 8px !important;
            border-bottom: 1px solid var(--border) !important;
            flex-shrink: 0 !important;
        }

        #app-drawer .drw-hamburger {
            position: absolute !important;
            left: 10px !important;
            top: 11px !important;
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
            min-height: 36px !important;
            padding: 0 !important;
            margin: 0 !important;
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            font-weight: 700 !important;
            line-height: 1 !important;
            border: 0 !important;
            background: transparent !important;
            box-shadow: none !important;
            z-index: 3 !important;
        }

        #app-drawer .switch {
            position: absolute !important;
            right: 16px !important;
            top: 16px !important;
            width: 48px !important;
            height: 26px !important;
            margin: 0 !important;
            flex: 0 0 48px !important;
        }

        #app-drawer .drw-menu {
            padding: 6px 0 !important;
        }

        #app-drawer .drw-item {
            width: 100% !important;
            min-height: 44px !important; /* N1: 터치 목표 44px */
            margin: 1px 0 !important;
            padding: 9px var(--ap-drawer-x) !important;
            box-sizing: border-box !important;
            border-radius: 0 !important;
            text-align: left !important;
            justify-content: flex-start !important;
        }

        #app-drawer .drw-label {
            text-align: left !important;
        }

        #app-drawer .drw-footer {
            padding: 6px 0 calc(10px + env(safe-area-inset-bottom)) !important;
            border-top: 1px solid var(--border) !important;
        }

        @media (min-width: 901px) {
            #app-drawer {
                width: var(--ap-drawer-rail-width) !important;
                max-width: var(--ap-drawer-rail-width) !important;
            }

            #app-drawer.drw-expanded {
                width: var(--ap-drawer-width) !important;
                max-width: var(--ap-drawer-width) !important;
            }

            #app-drawer .drw-rail-toggle {
                width: 36px !important;
                height: 36px !important;
                min-width: 36px !important;
                min-height: 36px !important;
                margin: 11px 0 0 10px !important;
                padding: 0 !important;
                box-sizing: border-box !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 20px !important;
                font-weight: 700 !important;
            }

            #app-drawer:not(.drw-expanded) .drw-rail-toggle {
                display: flex !important;
            }

            #app-drawer.drw-expanded .drw-rail-toggle {
                display: none !important;
            }

            #app-drawer.drw-expanded .drw-top-tools {
                display: flex !important;
            }

            #app-drawer.drw-expanded .drw-hamburger {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        }

        @media (max-width: 900px) {
            #app-drawer {
                width: min(var(--ap-drawer-width), calc(100vw - 56px)) !important;
                max-width: var(--ap-drawer-width) !important;
                border-radius: 0 18px 18px 0 !important;
            }

            #app-drawer .drw-top-tools {
                min-height: var(--ap-drawer-header-h) !important;
                height: var(--ap-drawer-header-h) !important;
                padding: 0 !important;
            }

            #app-drawer .drw-hamburger {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        }
    `;
    document.head.appendChild(style);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', installDrawerSizeLock);
} else {
    installDrawerSizeLock();
}
