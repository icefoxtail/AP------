/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 안정화 엔진
 * [Drawer v8]: 아이콘 없는 텍스트 메뉴 / 글래스모피즘 드로어 / PC 미니 레일
 *
 * 현재 사이드바 원칙:
 * - 홈 메뉴는 드로어에 두지 않는다. AP MATH 로고의 goHome()이 홈 역할을 담당한다.
 * - 햄버거(openAppDrawer)는 드로어 열기/닫기 전용이다.
 * - PC 닫힘 상태는 56px 미니 레일이며 햄버거만 표시한다.
 * - PC 열림 상태는 260px 텍스트 사이드바다.
 * - 모바일 drawer 내부에는 AP MATH OS 브랜드를 반복 표시하지 않는다.
 * - 다크모드 토글은 drawer 최상단 우측에 둔다.
 * - 메뉴는 아이콘 없이 텍스트만 사용한다.
 * - 로그아웃은 drawer 하단에 둔다.
 */

// ============================================================
// [Theme Manager] 다크 모드: drawer 최상단 우측 스위치 방식
// ============================================================
function getTheme() {
    return localStorage.getItem('APMATH_THEME') || 'light';
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

function showModal(t, b, at=null, af=null) {
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const actionBtn = document.getElementById('modal-action-btn');
    const footer = document.getElementById('modal-footer');
    const overlay = document.getElementById('modal-overlay');

    if (!titleEl || !bodyEl || !overlay) return;

    if (modalCloseTimer) {
        clearTimeout(modalCloseTimer);
        modalCloseTimer = null;
    }

    // 먼저 기존 show 상태만 제거하고, 내용 교체가 끝난 뒤 hidden을 해제한다.
    // display:flex 상태의 투명 오버레이가 잠깐 클릭을 가로막는 상황을 줄인다.
    overlay.classList.remove('show');

    titleEl.innerText = t;
    bodyEl.innerHTML = b;

    if (actionBtn) {
        if (at && af) {
            actionBtn.innerText = at;
            actionBtn.onclick = af;
            actionBtn.classList.remove('hidden');
            actionBtn.disabled = false;

            actionBtn.style.background = 'transparent';
            actionBtn.style.border = 'none';
            actionBtn.style.boxShadow = 'none';
            actionBtn.style.color = 'var(--primary)';
            actionBtn.style.fontWeight = '900';
            actionBtn.style.fontSize = '15px';
            actionBtn.style.padding = '8px 0';
            actionBtn.style.minHeight = 'auto';
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

    // display:none 해제 직후 transition이 스킵되지 않도록 강제 reflow 후 show 적용
    overlay.classList.remove('hidden');
    overlay.getBoundingClientRect();
    requestAnimationFrame(() => {
        overlay.classList.add('show');
    });
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

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
    }, 260);
}

function escapeHtmlForTextarea(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function setModalBody(html) {
    const body = document.getElementById('modal-body');
    if (body) body.innerHTML = html;
}

function setModalLoading(title, message) {
    showModal(title, `
        <div style="text-align:center; padding:40px 24px; color:var(--secondary);">
            <div style="font-size:14px; font-weight:800;">${message || '잠시만 기다려주세요...'}</div>
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

function updateMobileHeaderUser(name) {
    const el = document.getElementById('mobile-header-user');
    if (!el) return;
    const value = (name !== undefined ? String(name || '') : getHeaderUserName()).replace(/\s*선생님\s*$/g, '').trim();
    el.textContent = value;
    el.title = value;
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
    });
} else {
    patchHeaderRelatedGlobals();
    bootHeaderSync();
}


// ============================================================
// [드로어 네비게이션] 아이콘 없는 텍스트 메뉴 + PC 미니 레일 겸용
// ============================================================
function getDrawerRoleKey() {
    return (typeof state !== 'undefined' && state.auth && state.auth.role === 'admin') ? 'admin' : 'teacher';
}

function drawerItem(icon, label, action, extraClass = '') {
    const safeLabel = String(label || '');
    return `
        <button class="drw-item ${extraClass}" onclick="${action}">
            <span class="drw-label">${safeLabel}</span>
        </button>
    `;
}

function drawerSection() {
    return '';
}

function buildDrawerMenu(roleKey) {
    return `
        ${drawerItem('', '일지', "closeAppDrawer(); openDailyJournalModal();")}
        ${drawerItem('', '메모', "closeAppDrawer(); openTodoMemoModal();")}
        ${drawerItem('', '학생관리', "closeAppDrawer(); openAddressBook();")}
        ${drawerItem('', '학급·교재', "closeAppDrawer(); openClassManageModal();")}
        ${drawerItem('', '출석부', "closeAppDrawer(); if(typeof renderAttendanceLedger==='function') renderAttendanceLedger(); else if(typeof openAttendanceLedger==='function') openAttendanceLedger(); else toast('출석부는 다음 버전에서 연결됩니다.', 'warn');")}
        ${drawerItem('', '시험일정', "closeAppDrawer(); openExamScheduleModal();")}
        ${drawerItem('', '시험성적', "closeAppDrawer(); openGlobalExamGradeView();")}
        ${drawerItem('', '클리닉', "closeAppDrawer(); if(typeof openClinicBasket==='function') openClinicBasket(); else toast('클리닉 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('', '퇴원생', "closeAppDrawer(); if(typeof openDischargedStudents==='function') openDischargedStudents(); else toast('퇴원생 기능을 불러오지 못했습니다.', 'warn');")}
        ${drawerItem('', '시스템 동기화', "closeAppDrawer(); openOperationMenu();")}
    `;
}

function ensureDrawerStyle() {
    if (document.getElementById('app-drawer-style')) return;

    const style = document.createElement('style');
    style.id = 'app-drawer-style';
    style.textContent = `
        #app-drawer-overlay {
            display:none;
            position:fixed;
            inset:0;
            background:rgba(0,0,0,0.42);
            z-index:9998;
            backdrop-filter:blur(4px);
            -webkit-backdrop-filter:blur(4px);
        }
        #app-drawer-overlay.drw-open { display:block; }

        #app-drawer {
            position:fixed;
            top:0;
            left:0;
            bottom:0;
            width:min(82vw, 280px);
            background:var(--surface-alpha);
            z-index:9999;
            display:flex;
            flex-direction:column;
            transform:translateX(-104%);
            transition:transform .26s cubic-bezier(0.4, 0, 0.2, 1), width .22s ease, background .2s ease;
            box-shadow:4px 0 24px rgba(0,0,0,0.08);
            overflow-y:auto;
            overflow-x:hidden;
            border-right:1px solid var(--border);
            border-radius:0 22px 22px 0;
            text-align:left;
            backdrop-filter:blur(16px);
            -webkit-backdrop-filter:blur(16px);
        }
        #app-drawer.drw-open { transform:translateX(0); }

        .drw-rail-toggle {
            display:none;
            width:56px;
            height:52px;
            border:0;
            border-bottom:1px solid var(--border);
            border-radius:0;
            background:transparent;
            color:var(--text);
            font-size:20px;
            font-weight:800;
            cursor:pointer;
            align-items:center;
            justify-content:center;
            font-family:inherit;
        }

        .drw-top-tools {
            padding:calc(16px + env(safe-area-inset-top)) 18px 16px;
            border-bottom:1px solid var(--border);
            display:flex;
            justify-content:space-between;
            align-items:center;
            flex-shrink:0;
        }
        
        .drw-hamburger {
            background:transparent;
            border:none;
            color:var(--text);
            font-size:22px;
            font-weight:800;
            cursor:pointer;
            padding:0;
            line-height:1;
        }

        .switch {
            position:relative;
            display:inline-block;
            width:48px;
            height:26px;
            flex:0 0 auto;
        }
        .switch input { opacity:0; width:0; height:0; }
        .slider {
            position:absolute;
            cursor:pointer;
            top:0; left:0; right:0; bottom:0;
            background-color:var(--surface-2);
            border:1px solid var(--border);
            transition:.25s;
            border-radius:999px;
        }
        .slider:before {
            position:absolute;
            content:"";
            height:20px;
            width:20px;
            left:2px;
            bottom:2px;
            background-color:var(--secondary);
            transition:.25s;
            border-radius:50%;
        }
        input:checked + .slider { background-color:var(--primary); border-color:var(--primary); }
        input:checked + .slider:before { transform:translateX(22px); background-color:#fff; }

        .drw-menu {
            padding:12px 12px;
            flex:0 0 auto;
        }
        .drw-sec { display:none; }
        .drw-item {
            display:flex;
            align-items:center;
            justify-content:flex-start;
            width:100%;
            margin:4px 0;
            padding:12px 16px;
            min-height:44px;
            border:0;
            border-radius:12px;
            background:transparent;
            color:var(--text-soft);
            font-size:15px;
            font-weight:600;
            font-family:inherit;
            text-align:left;
            cursor:pointer;
            letter-spacing:-0.3px;
            transition:background .18s ease, transform .18s ease, color .18s ease;
        }
        .drw-label {
            display:inline-block;
            min-width:0;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
        }
        .drw-item:active { background:var(--bg); transform:scale(0.98); }
        .drw-item:hover { background:var(--surface-2); }
        .drw-item.danger { color:var(--error); font-weight:700; }
        .drw-spacer { flex:1; }
        .drw-footer {
            padding:10px 12px calc(14px + env(safe-area-inset-bottom));
            border-top:1px solid var(--border);
            flex-shrink:0;
            background:transparent;
        }

        @media (min-width:901px) {
            #app-drawer-overlay { display:none !important; }
            #app-drawer {
                width:56px;
                transform:none !important;
                border-radius:0;
                box-shadow:none;
                background:var(--surface-alpha);
                backdrop-filter:blur(16px);
                -webkit-backdrop-filter:blur(16px);
                overflow:hidden;
            }
            #app-drawer.drw-expanded {
                width:260px;
                box-shadow:8px 0 30px rgba(0,0,0,0.08);
                background:var(--surface-alpha);
                overflow-y:auto;
            }
            .drw-rail-toggle { display:flex; }
            #app-drawer.drw-expanded .drw-rail-toggle { display:none; }
            #app-drawer:not(.drw-expanded) .drw-top-tools,
            #app-drawer:not(.drw-expanded) .drw-menu,
            #app-drawer:not(.drw-expanded) .drw-footer,
            #app-drawer:not(.drw-expanded) .drw-spacer { display:none; }
            #app-drawer.drw-expanded .drw-top-tools { display:flex; }
            #app-drawer.drw-expanded .drw-menu { display:block; }
            #app-drawer.drw-expanded .drw-footer { display:block; }
            #app-drawer.drw-expanded .drw-spacer { display:block; flex:1; }
        }
    `;
    document.head.appendChild(style);
}

function renderAppDrawer(force = false) {
    ensureDrawerStyle();

    const currentRole = getDrawerRoleKey();
    const oldDrawer = document.getElementById('app-drawer');
    const oldOverlay = document.getElementById('app-drawer-overlay');

    if (oldDrawer && oldOverlay && !force && oldDrawer.dataset.role === currentRole) {
        applyTheme(getTheme());
        return;
    }

    if (oldDrawer) oldDrawer.remove();
    if (oldOverlay) oldOverlay.remove();

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="app-drawer-overlay" onclick="closeAppDrawer()"></div>
        <nav id="app-drawer" data-role="${currentRole}" aria-label="AP Math OS navigation">
            <button class="drw-rail-toggle" onclick="openAppDrawer()" aria-label="메뉴 열기" title="메뉴">☰</button>
            <div class="drw-top-tools">
                <button class="drw-hamburger" onclick="closeAppDrawer()" aria-label="메뉴 닫기" title="닫기">☰</button>
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
                ${drawerItem('', '로그아웃', "closeAppDrawer(); logout();", 'danger')}
            </div>
        </nav>
    `;

    while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);
    applyTheme(getTheme());
}

function removeAppDrawer() {
    const drw = document.getElementById('app-drawer');
    const ovl = document.getElementById('app-drawer-overlay');
    if (drw) drw.remove();
    if (ovl) ovl.remove();
}

function isDesktopDrawerMode() {
    return window.matchMedia && window.matchMedia('(min-width: 901px)').matches;
}

function openAppDrawer() {
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

        if (typeof renderDashboard !== 'function') {
            window.location.href = 'index.html';
            return;
        }

        window.setTimeout(() => {
            try {
                renderDashboard();
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
window.closeModal = closeModal;
window.setModalBody = setModalBody;
window.setModalLoading = setModalLoading;
window.safeToastError = safeToastError;
window.setButtonBusy = setButtonBusy;
window.renderAppDrawer = renderAppDrawer;
window.openAppDrawer = openAppDrawer;
window.closeAppDrawer = closeAppDrawer;
window.goHome = goHome;
window.updateMobileHeaderUser = updateMobileHeaderUser;
window.syncDashboardInternalHeader = syncDashboardInternalHeader;