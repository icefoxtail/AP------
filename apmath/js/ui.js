/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 안정화 엔진
 * [Drawer v8.5 HARD LOCK]&#58; GPT형 260px / 좌우 16px / 중앙정렬 회귀 차단
 *
 * 현재 사이드바 원칙:
 * - 홈 메뉴는 드로어에 두지 않는다. AP MATH 로고의 goHome()이 홈 역할을 담당한다.
 * - 햄버거(openAppDrawer)는 드로어 열기/닫기 전용이다.
 * - PC 닫힘 상태는 56px 미니 레일이며 햄버거만 표시한다.
 * - PC 열림 상태는 260px 텍스트 사이드바다.
 * - 모바일 drawer 내부에는 AP MATH OS 브랜드를 반복 표시하지 않는다.
 * - 다크모드 토글은 drawer 최상단 우측에 둔다.
 * - 햄버거, 메뉴 글자, 로그아웃은 같은 왼쪽 16px x축에 정렬한다.
 * - 다크모드 토글 오른쪽 끝은 drawer 오른쪽 16px 기준으로 정렬한다.
 * - 메뉴는 아이콘 없이 텍스트만 사용한다.
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootThemeManager);
} else {
    bootThemeManager();
}


// ============================================================
// [UI Components] 토스트 및 모달
// ============================================================
function toast(m, t='info') {
    const c = document.getElementById('toast-container');
    if (!c) return;

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
let modalStepStack = [];
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
    const enabled = appHistoryCanGoBack() || appHistoryCanUseBrowserBack();
    ['mobile-app-back-button', 'desktop-app-back-button'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.disabled = !enabled;
        btn.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    });
}

function appHistoryRecordView(nextView) {
    if (!nextView || !nextView.type) return;
    const current = appHistoryState.currentView;
    const currentKey = appHistoryViewKey(current);
    const nextKey = appHistoryViewKey(nextView);

    if (!appHistoryState.restoring && current && currentKey && currentKey !== nextKey) {
        const stack = appHistoryState.backStack;
        if (appHistoryViewKey(stack[stack.length - 1]) !== currentKey) stack.push(current);
        if (stack.length > 50) stack.shift();
    }

    appHistoryState.currentView = nextView;
    updateAppBackButtons();
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

function appHistoryBack() {
    if (modalStepStack.length) {
        closeModal();
        updateAppBackButtons();
        return true;
    }

    if (isModalOpen()) {
        closeModal(true);
        window.setTimeout(updateAppBackButtons, 280);
        return true;
    }

    const previous = appHistoryState.backStack.pop();
    if (previous) {
        const restored = appHistoryRestoreView(previous);
        if (!restored) updateAppBackButtons();
        return restored;
    }

    if (appHistoryCanUseBrowserBack()) {
        window.history.back();
        return true;
    }

    updateAppBackButtons();
    return false;
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
        studentDetailSubModal: state?.ui ? (state.ui.currentStudentDetailSubModal || null) : null
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
    actionBtn.style.minHeight = 'auto';
}

function applyModalContent(t, b, at = null, af = null, options = {}) {
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const actionBtn = document.getElementById('modal-action-btn');
    const footer = document.getElementById('modal-footer');
    const overlay = document.getElementById('modal-overlay');
    const contentEl = document.getElementById('modal-content');

    if (!titleEl || !bodyEl || !overlay) return;

    if (modalCloseTimer) {
        clearTimeout(modalCloseTimer);
        modalCloseTimer = null;
    }

    overlay.classList.remove('show');

    titleEl.innerText = t;
    bodyEl.innerHTML = b;
    if (contentEl) {
        contentEl.style.width = '';
        contentEl.style.maxWidth = '';
        contentEl.style.height = '';
        contentEl.style.maxHeight = '';
    }
    bodyEl.style.maxHeight = '';
    bodyEl.style.overflow = '';

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

    overlay.classList.remove('hidden');
    overlay.getBoundingClientRect();
    requestAnimationFrame(() => {
        overlay.classList.add('show');
    });
}

function showModal(t, b, at=null, af=null) {
    applyModalContent(t, b, at, af);
    updateAppBackButtons();
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
    if (view.type === 'textbookManage' && typeof openTextbookManageModal === 'function') return openTextbookManageModal({ returnTo: view.parentReturn || null });
    if (view.type === 'classDetail' && view.classId && typeof renderClass === 'function') {
        closeModal(true);
        return renderClass(view.classId);
    }
    if (view.type === 'studentDetail' && view.studentId && typeof renderStudentDetail === 'function') {
        closeModal(true);
        return renderStudentDetail(view.studentId);
    }
    if (view.type === 'timetable' && typeof renderTimetable === 'function') {
        closeModal(true);
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
    if (!state.ui) state.ui = {};

    if (!suppressReturn && modalStepStack.length) {
        const previous = modalStepStack.pop();
        restoreModalSnapshot(previous);
        updateAppBackButtons();
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
    modalCloseTimer = setTimeout(() => {
        overlay.classList.add('hidden');
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
    }, 260);
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
    if (body) body.innerHTML = html;
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
    sync: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M18.5 9A7 7 0 0 0 6.7 6.4"/><path d="M5.5 15a7 7 0 0 0 11.8 2.6"/></svg>',
    manual: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 1 4 15.5z"/><path d="M8 8h8"/><path d="M8 12h7"/><path d="M8 16h6"/></svg>',
    discharged: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4"/><circle cx="12" cy="8" r="3"/><path d="M17 12h4"/></svg>',
    logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"/><path d="M14 8l4 4-4 4"/><path d="M18 12H9"/></svg>',
    default: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/></svg>'
};

function drawerIcon(icon) {
    const key = String(icon || '').trim();
    return DRAWER_ICON_SVG[key] || DRAWER_ICON_SVG.default;
}

function drawerItem(icon, label, action, extraClass = '') {
    const safeLabel = (typeof apEscapeHtml === 'function') ? apEscapeHtml(String(label || '')) : String(label || '');
    const iconHtml = drawerIcon(icon);
    return `
        <button class="drw-item ${extraClass}" onclick="${action}">
            <span class="drw-icon" aria-hidden="true">${iconHtml}</span>
            <span class="drw-label">${safeLabel}</span>
        </button>
    `;
}

function drawerSection(label) {
    return `<div class="drw-section-label">${(typeof apEscapeHtml === 'function') ? apEscapeHtml(String(label || '')) : String(label || '')}</div>`;
}

function openManualCenter() {
    const url = '../manual/';
    const opened = window.open(url, '_blank', 'noopener');
    if (!opened) window.location.href = url;
}

function openExamScoreMenu() {
    showModal('시험성적', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn btn-primary" style="width:100%; min-height:48px; padding:12px 14px; font-size:14px; font-weight:700; border-radius:14px;" onclick="closeModal(); openGlobalExamGradeView();">원내 시험성적</button>
            <button class="btn" style="width:100%; min-height:48px; padding:12px 14px; font-size:14px; font-weight:700; border-radius:14px; background:var(--surface-2); border:1px solid var(--border); color:var(--text);" onclick="closeModal(); if(typeof openSchoolExamLedger==='function') openSchoolExamLedger(); else openCumulativeOpsModal('school');">학교 성적표</button>
        </div>
    `);
}

function buildDrawerMenu(roleKey) {
    const isAdminDrawer = roleKey === 'admin';

    if (isAdminDrawer) {
        return `
            ${drawerSection('학생 관리')}
            ${drawerItem('students', '학생관리', "closeAppDrawer(); openAddressBook();")}
            ${drawerItem('class', '학급관리', "closeAppDrawer(); openClassManageModal();")}

            ${drawerSection('운영')}
            ${drawerItem('schedule', '일정관리', "closeAppDrawer(); if(typeof openExamScheduleModal==='function') openExamScheduleModal(); else toast('일정관리 기능을 불러오지 못했습니다.', 'warn');")}
            ${drawerItem('discharged', '퇴원생', "closeAppDrawer(); if(typeof openDischargedStudents==='function') openDischargedStudents(); else toast('퇴원생 기능을 불러오지 못했습니다.', 'warn');")}
            ${drawerItem('exam', '진단평가', "closeAppDrawer(); if(typeof openAdminDiagnosticPanel==='function') openAdminDiagnosticPanel(); else toast('진단평가 기능을 불러오지 못했습니다.', 'warn');")}

            ${drawerSection('지원')}
            ${drawerItem('sync', '시스템 동기화', "closeAppDrawer(); openOperationMenu();")}
            ${drawerItem('manual', '사용설명서', "closeAppDrawer(); openManualCenter();")}
        `;
    }

    return `
        ${drawerSection('수업 관리')}
        ${drawerItem('timetable', '시간표', "closeAppDrawer(); if(typeof renderTimetable==='function') renderTimetable(); else toast('시간표 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('attendance', '출석부', "closeAppDrawer(); if(typeof openAttendanceLedger==='function') openAttendanceLedger(); else if(typeof renderAttendanceLedger==='function') renderAttendanceLedger(); else toast('출석부 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('journal', '일지', "closeAppDrawer(); openDailyJournalModal();")}
        ${drawerItem('memo', '메모', "closeAppDrawer(); openTodoMemoModal();")}
        ${drawerItem('class', '학급관리', "closeAppDrawer(); openClassManageModal();")}
        ${drawerItem('students', '학생관리', "closeAppDrawer(); openAddressBook();")}
        ${drawerItem('schedule', '일정관리', "closeAppDrawer(); if(typeof openExamScheduleModal==='function') openExamScheduleModal(); else toast('일정관리 기능을 불러오지 못했습니다.', 'warn');")}

        ${drawerSection('수업 자료')}
        ${drawerItem('textbook', '교재관리', "closeAppDrawer(); if(typeof openTextbookManageModal==='function') openTextbookManageModal(); else toast('교재관리 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('material', '수업자료', "closeAppDrawer(); if(typeof openStudyMaterialWrongCenter==='function') openStudyMaterialWrongCenter(); else toast('수업자료 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('exam', '시험지 보관함', "closeAppDrawer(); window.open('../archive/assessment/assessment-mvp.html', '_blank', 'noopener');")}
        ${drawerItem('clinic', '클리닉', "closeAppDrawer(); if(typeof openClinicCenter==='function') openClinicCenter(); else toast('클리닉 기능을 불러오지 못했습니다.', 'warn');")}

        ${drawerSection('평가')}
        ${drawerItem('school', '학교성적', "closeAppDrawer(); if(typeof openSchoolExamLedger==='function') openSchoolExamLedger(); else if(typeof openCumulativeOpsModal==='function') openCumulativeOpsModal('school'); else toast('학교성적 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('exam', '시험성적', "closeAppDrawer(); if(typeof openGlobalExamGradeView==='function') openGlobalExamGradeView(); else toast('시험성적 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('omr', 'OMR 입력', "closeAppDrawer(); if(typeof openOmrInput==='function') openOmrInput(); else toast('OMR 입력 기능을 불러오지 못했습니다.', 'warn');")}

        ${drawerSection('지원')}
        ${drawerItem('sync', '시스템 동기화', "closeAppDrawer(); openOperationMenu();")}
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
            min-height: 38px !important;
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
