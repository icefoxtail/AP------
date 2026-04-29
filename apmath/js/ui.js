/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 안정화 엔진
 */

// ============================================================
// [Theme Manager] 다크 모드: 사이드바 상단 스위치 방식
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
// [드로어 네비게이션] 상단 문구 제거 + 다크모드 버튼 배치
// ============================================================
function renderAppDrawer() {
    if (document.getElementById('app-drawer')) {
        applyTheme(getTheme());
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
                width:min(75vw, 260px);
                background:var(--surface);
                z-index:9999;
                display:flex;
                flex-direction:column;
                transform:translateX(-104%);
                transition:transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.05);
                box-shadow:4px 0 24px rgba(0,0,0,0.06);
                overflow-y:auto;
                border-right:1px solid var(--border);
                border-radius:0 20px 20px 0;
            }
            #app-drawer.drw-open { transform:translateX(0); }

            .drw-top-tools {
                padding:calc(18px + env(safe-area-inset-top)) 24px 12px;
                background:var(--surface);
                border-bottom:1px solid var(--border);
                flex-shrink:0;
                display:flex;
                justify-content:flex-start;
                align-items:center;
                gap:12px;
                text-align:left;
            }

            .drw-top-label {
                font-size:15px;
                font-weight:900;
                color:var(--text);
                text-align:left;
                letter-spacing:-0.2px;
                line-height:1;
            }

            .switch {
                position:relative;
                display:inline-block;
                width:48px;
                height:26px;
                flex:0 0 auto;
            }
            .switch input {
                opacity:0;
                width:0;
                height:0;
            }
            .slider {
                position:absolute;
                cursor:pointer;
                top:0;
                left:0;
                right:0;
                bottom:0;
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
            input:checked + .slider {
                background-color:var(--primary);
                border-color:var(--primary);
            }
            input:checked + .slider:before {
                transform:translateX(22px);
                background-color:#fff;
            }

            .drw-sec {
                font-size:14px;
                font-weight:900;
                padding:20px 24px 7px;
                letter-spacing:-0.2px;
                text-align:left;
                line-height:1.2;
            }

            .drw-item {
                display:flex;
                align-items:center;
                justify-content:flex-start;
                width:calc(100% - 16px);
                margin:2px 8px;
                padding:12px 16px;
                min-height:44px;
                border:0;
                border-radius:12px;
                background:transparent;
                color:var(--text);
                font-size:14px;
                font-weight:800;
                font-family:inherit;
                text-align:left;
                cursor:pointer;
                letter-spacing:-0.2px;
                transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .drw-item:active {
                background:var(--bg);
                transform:scale(0.96);
            }
            .drw-item.primary {
                color:var(--text);
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
                padding:8px 0 calc(16px + env(safe-area-inset-bottom));
                border-top:1px solid var(--border);
                flex-shrink:0;
                background:var(--surface);
            }
        `;
        document.head.appendChild(style);
    }

    const isAdmin = !!(state && state.auth && state.auth.role === 'admin');

    const teacherMenu = `
        <div class="drw-sec" style="color:var(--primary);">메인</div>
        <button class="drw-item" onclick="closeAppDrawer(); renderDashboard();">홈</button>
        <button class="drw-item" onclick="closeAppDrawer(); openDailyJournalModal();">일지</button>
        <button class="drw-item" onclick="closeAppDrawer(); openTodoMemoModal();">메모</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook();">학생관리</button>

        <div class="drw-sec" style="color:#6E54FF;">수업·성적</div>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof renderAttendanceLedger==='function') renderAttendanceLedger();">출석부</button>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof openExamScheduleModal==='function') openExamScheduleModal();">시험일정</button>
        <button class="drw-item" onclick="closeAppDrawer(); openGlobalExamGradeView();">시험성적</button>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof openClinicBasket==='function') openClinicBasket();">클리닉</button>

        <div class="drw-sec" style="color:var(--warning);">운영</div>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu();">운영메뉴</button>
    `;

    const adminMenu = `
        <div class="drw-sec" style="color:var(--primary);">원장</div>
        <button class="drw-item" onclick="closeAppDrawer(); renderAdminControlCenter();">운영센터</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook();">학생관리</button>

        <div class="drw-sec" style="color:var(--warning);">운영</div>
        <button class="drw-item" onclick="closeAppDrawer(); openExamScheduleModal();">시험일정</button>
        <button class="drw-item" onclick="closeAppDrawer(); openDischargedStudents();">퇴원생</button>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu();">동기화상태</button>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="app-drawer-overlay" onclick="closeAppDrawer()"></div>
        <nav id="app-drawer" aria-label="AP Math OS navigation">
            <div class="drw-top-tools">
                <span class="drw-top-label">다크 모드</span>
                <label class="switch">
                    <input type="checkbox" id="theme-switch" onchange="toggleTheme()">
                    <span class="slider"></span>
                </label>
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