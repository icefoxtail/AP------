/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 안정화 엔진
 * [Sidebar Polish]&#58; 상단 브랜드 박스 제거, 다크/라이트 최상단 이동, 사이드바 글씨 크기 조절 추가
 */

// ============================================================
// [Theme Manager] 다크 모드: 사이드바 상단 버튼 방식
// ============================================================
const DRAWER_FONT_KEY = 'APMATH_DRAWER_FONT_SCALE';

function getTheme() {
    return localStorage.getItem('APMATH_THEME') || 'light';
}

function getDrawerFontScale() {
    const saved = localStorage.getItem(DRAWER_FONT_KEY) || 'normal';
    return ['small', 'normal', 'large'].includes(saved) ? saved : 'normal';
}

function applyDrawerFontScale(scale = getDrawerFontScale()) {
    const safeScale = ['small', 'normal', 'large'].includes(scale) ? scale : 'normal';
    const drawer = document.getElementById('app-drawer');
    const fontBtn = document.getElementById('drawer-font-toggle');

    if (drawer) {
        drawer.classList.remove('drw-font-small', 'drw-font-normal', 'drw-font-large');
        drawer.classList.add(`drw-font-${safeScale}`);
    }

    if (fontBtn) {
        const labelMap = {
            small: '글씨 작게',
            normal: '글씨 보통',
            large: '글씨 크게'
        };
        fontBtn.innerText = labelMap[safeScale];
        fontBtn.setAttribute('aria-label', `사이드바 ${labelMap[safeScale]}`);
        fontBtn.setAttribute('title', labelMap[safeScale]);
    }
}

function toggleDrawerFontScale() {
    const current = getDrawerFontScale();
    const next = current === 'normal' ? 'large' : current === 'large' ? 'small' : 'normal';

    localStorage.setItem(DRAWER_FONT_KEY, next);
    applyDrawerFontScale(next);
}

function getDrawerThemeLabel(isDark) {
    return isDark ? '라이트 모드' : '다크 모드';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';

    if (document.body) {
        document.body.classList.toggle('dark', isDark);
    }

    const drawerToggleBtn = document.getElementById('drawer-theme-toggle');
    if (drawerToggleBtn) {
        drawerToggleBtn.innerText = getDrawerThemeLabel(isDark);
        drawerToggleBtn.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
        drawerToggleBtn.setAttribute('title', getDrawerThemeLabel(isDark));
    }

    const legacyToggleBtn = document.getElementById('theme-toggle-btn');
    if (legacyToggleBtn) {
        legacyToggleBtn.innerText = isDark ? '라이트 모드' : '다크 모드';
        legacyToggleBtn.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
        legacyToggleBtn.setAttribute('title', isDark ? '라이트 모드' : '다크 모드');
    }

    applyDrawerFontScale(getDrawerFontScale());
}

function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';

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

    if (!titleEl || !bodyEl) return;

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

    const overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    if (modalCloseTimer) {
        clearTimeout(modalCloseTimer);
        modalCloseTimer = null;
    }

    overlay.classList.remove('hidden');
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
// [드로어 네비게이션] 상단 박스 제거 + 다크모드/글씨크기 최상단 배치
// ============================================================
function renderAppDrawer() {
    if (document.getElementById('app-drawer')) {
        applyTheme(getTheme());
        applyDrawerFontScale(getDrawerFontScale());
        return;
    }

    if (!document.getElementById('app-drawer-style')) {
        const style = document.createElement('style');
        style.id = 'app-drawer-style';
        style.textContent = `
            #app-drawer-overlay {
                display:none;
                position:fixed;
                inset:0;
                background:rgba(0,0,0,0.4);
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
                width:min(80vw, 280px);
                background:var(--surface);
                z-index:9999;
                display:flex;
                flex-direction:column;
                transform:translateX(-104%);
                transition:transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.05);
                box-shadow:4px 0 24px rgba(0,0,0,0.06);
                overflow-y:auto;
                border-radius:0 24px 24px 0;
            }
            #app-drawer.drw-open { transform:translateX(0); }

            .drw-top-tools {
                padding:calc(16px + env(safe-area-inset-top)) 12px 10px;
                background:var(--surface);
                border-bottom:1px solid var(--border);
                flex-shrink:0;
                display:grid;
                grid-template-columns:1fr 1fr;
                gap:8px;
            }

            .drw-tool-btn {
                width:100%;
                min-height:44px;
                display:flex;
                align-items:center;
                justify-content:center;
                border:1px solid var(--border);
                border-radius:14px;
                background:var(--surface-2);
                color:var(--text);
                font-size:13px;
                font-weight:900;
                font-family:inherit;
                cursor:pointer;
                letter-spacing:-0.2px;
                transition:all 0.2s;
                white-space:nowrap;
            }

            .drw-tool-btn:active {
                background:var(--bg);
                transform:scale(0.97);
            }

            .drw-sec {
                font-size:12px;
                font-weight:900;
                color:var(--secondary);
                padding:18px 20px 7px;
                letter-spacing:-0.2px;
            }

            .drw-item {
                display:flex;
                align-items:center;
                width:calc(100% - 20px);
                margin:2px 10px;
                padding:13px 16px;
                min-height:47px;
                border:0;
                border-radius:14px;
                background:transparent;
                color:var(--text);
                font-size:14.5px;
                font-weight:800;
                font-family:inherit;
                text-align:left;
                cursor:pointer;
                letter-spacing:-0.2px;
                transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #app-drawer.drw-font-small .drw-sec {
                font-size:11px;
                padding-top:16px;
            }
            #app-drawer.drw-font-small .drw-item {
                font-size:13px;
                min-height:42px;
                padding:11px 14px;
            }
            #app-drawer.drw-font-small .drw-tool-btn {
                font-size:12px;
                min-height:40px;
            }

            #app-drawer.drw-font-normal .drw-sec {
                font-size:12px;
            }
            #app-drawer.drw-font-normal .drw-item {
                font-size:14.5px;
            }
            #app-drawer.drw-font-normal .drw-tool-btn {
                font-size:13px;
            }

            #app-drawer.drw-font-large .drw-sec {
                font-size:13px;
                padding-top:20px;
            }
            #app-drawer.drw-font-large .drw-item {
                font-size:16px;
                min-height:52px;
                padding:15px 17px;
            }
            #app-drawer.drw-font-large .drw-tool-btn {
                font-size:14px;
                min-height:48px;
            }

            .drw-item:active {
                background:var(--bg);
                transform:scale(0.96);
            }
            .drw-item.primary {
                background:rgba(26,92,255,0.08);
                color:var(--primary);
            }
            body.dark .drw-item.primary {
                background:rgba(92,138,255,0.12);
                color:var(--primary);
            }
            .drw-item.primary:active {
                background:rgba(26,92,255,0.12);
                transform:scale(0.96);
            }
            .drw-item.danger {
                color:var(--error);
            }
            .drw-item.danger:active {
                background:rgba(255,71,87,0.08);
                transform:scale(0.96);
            }
            .drw-spacer { flex:1; }
            .drw-footer {
                padding:10px 0 calc(18px + env(safe-area-inset-bottom));
                border-top:1px solid var(--border);
                flex-shrink:0;
                background:var(--surface);
            }
        `;
        document.head.appendChild(style);
    }

    const isAdmin = !!(state && state.auth && state.auth.role === 'admin');

    const teacherMenu = `
        <div class="drw-sec">메인</div>
        <button class="drw-item primary" onclick="closeAppDrawer(); renderDashboard();">홈</button>
        <button class="drw-item" onclick="closeAppDrawer(); openDailyJournalModal();">일지</button>
        <button class="drw-item" onclick="closeAppDrawer(); openTodoMemoModal();">메모</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook();">학생관리</button>

        <div class="drw-sec">수업·성적</div>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof renderAttendanceLedger==='function') renderAttendanceLedger();">출석부</button>
        <button class="drw-item" onclick="closeAppDrawer(); openGlobalExamGradeView();">시험성적</button>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof openClinicBasket==='function') openClinicBasket();">클리닉</button>

        <div class="drw-sec">운영</div>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu();">운영메뉴</button>
    `;

    const adminMenu = `
        <div class="drw-sec">원장</div>
        <button class="drw-item primary" onclick="closeAppDrawer(); renderAdminControlCenter();">운영센터</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook();">학생관리</button>

        <div class="drw-sec">운영</div>
        <button class="drw-item" onclick="closeAppDrawer(); openExamScheduleModal();">시험일정</button>
        <button class="drw-item" onclick="closeAppDrawer(); openDischargedStudents();">퇴원생</button>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu();">동기화상태</button>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="app-drawer-overlay" onclick="closeAppDrawer()"></div>
        <nav id="app-drawer" aria-label="AP Math OS navigation">
            <div class="drw-top-tools">
                <button id="drawer-theme-toggle" class="drw-tool-btn" type="button" onclick="toggleTheme()">다크 모드</button>
                <button id="drawer-font-toggle" class="drw-tool-btn" type="button" onclick="toggleDrawerFontScale()">글씨 보통</button>
            </div>
            ${isAdmin ? adminMenu : teacherMenu}
            <div class="drw-spacer"></div>
            <div class="drw-footer">
                <button class="drw-item danger" onclick="closeAppDrawer(); logout();">로그아웃</button>
            </div>
        </nav>
    `;

    while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);

    applyTheme(getTheme());
    applyDrawerFontScale(getDrawerFontScale());
}

function openAppDrawer() {
    renderAppDrawer();
    const drw = document.getElementById('app-drawer');
    const ovl = document.getElementById('app-drawer-overlay');
    if (drw) drw.classList.add('drw-open');
    if (ovl) ovl.classList.add('drw-open');
}

function closeAppDrawer() {
    const drw = document.getElementById('app-drawer');
    const ovl = document.getElementById('app-drawer-overlay');
    if (drw) drw.classList.remove('drw-open');
    if (ovl) ovl.classList.remove('drw-open');
}


// ============================================================
// [전역 함수 노출]
// ============================================================
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
window.getTheme = getTheme;
window.ensureThemeToggleButton = ensureThemeToggleButton;
window.getDrawerFontScale = getDrawerFontScale;
window.applyDrawerFontScale = applyDrawerFontScale;
window.toggleDrawerFontScale = toggleDrawerFontScale;
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