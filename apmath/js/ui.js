/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 안정화 엔진
 * [Minimalism Polish]&#58; 폰트 조절 제거, 섹션 헤더 강화, 다크모드 토글 스위치 적용
 * [UI Fix]&#58; 사이드바 왼쪽 정렬 통일 및 섹션 헤더 시인성 강화
 */

// ============================================================
// [Theme Manager] 다크 모드 전용 엔진 (Toggle Switch 방식)
// ============================================================
function getTheme() {
    return localStorage.getItem('APMATH_THEME') || 'light';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';

    if (document.body) {
        document.body.classList.toggle('dark', isDark);
    }

    // [Polish] 사이드바 내부 토글 스위치 상태 동기화
    const themeSwitch = document.getElementById('theme-switch');
    if (themeSwitch) {
        themeSwitch.checked = isDark;
    }

    const legacyToggleBtn = document.getElementById('theme-toggle-btn');
    if (legacyToggleBtn) {
        legacyToggleBtn.innerText = isDark ? '라이트 모드' : '다크 모드';
    }
}

function toggleTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const next = (themeSwitch && themeSwitch.checked) ? 'dark' : 'light';

    localStorage.setItem('APMATH_THEME', next);
    applyTheme(next);
}

// 구 버전 호환용 (대시보드 등에서 직접 호출 시)
function toggleThemeLegacy() {
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
            actionBtn.style.fontWeight = '800';
            actionBtn.style.fontSize = '15px';
            actionBtn.style.padding = '8px 12px';
            actionBtn.style.minHeight = '44px';
            actionBtn.style.borderRadius = '8px';
            actionBtn.style.transition = 'background 0.2s';
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
// [드로어 네비게이션] 왼쪽 정렬 강화 + 섹션 헤더 크기 보정 + 토글 스위치
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
                width:min(80vw, 280px);
                background:var(--surface);
                z-index:9999;
                display:flex;
                flex-direction:column;
                transform:translateX(-104%);
                transition:transform .3s cubic-bezier(0.175, 0.885, 0.32, 1.05);
                box-shadow:4px 0 24px rgba(0,0,0,0.06);
                border-right:1px solid var(--border);
                overflow-y:auto;
                border-radius:0 24px 24px 0;
            }
            #app-drawer.drw-open { transform:translateX(0); }

            /* [Polish] 상단 토글 영역: 좌우 수평 정렬 24px 고정 */
            .drw-top-tools {
                padding:calc(16px + env(safe-area-inset-top)) 24px 10px;
                background:var(--surface);
                border-bottom:1px solid var(--border);
                flex-shrink:0;
                display:flex;
                justify-content:space-between;
                align-items:center;
            }
            .drw-top-label {
                font-size:15px;
                font-weight:900;
                color:var(--text);
            }

            /* [Polish] 다크모드 토글 스위치 CSS */
            .switch {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 26px;
            }
            .switch input { opacity: 0; width: 0; height: 0; }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: var(--surface-2);
                border: 1px solid var(--border);
                transition: .3s;
                border-radius: 26px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                bottom: 2px;
                background-color: var(--secondary);
                transition: .3s;
                border-radius: 50%;
            }
            input:checked + .slider {
                background-color: var(--primary);
                border-color: var(--primary);
            }
            input:checked + .slider:before {
                transform: translateX(22px);
                background-color: #ffffff;
            }

            /* [Polish] 섹션 헤더: 24px 왼쪽 정렬 강화 및 색상 보정 */
            .drw-sec {
                font-size:14px;
                font-weight:900;
                color:var(--text);
                padding:22px 24px 8px;
                letter-spacing:-0.2px;
                text-align:left;
            }

            /* [Polish] 아이템 여백 조정 (8+16=24px 시작점 일치) */
            .drw-item {
                display:flex;
                align-items:center;
                width:calc(100% - 16px);
                margin:2px 8px;
                padding:13px 16px;
                min-height:47px;
                border:0;
                border-radius:12px;
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

            .drw-item:active {
                background:rgba(128, 128, 128, 0.1);
                transform:scale(0.96);
            }
            .drw-item.primary {
                background:rgba(26,92,255,0.06);
                color:var(--primary);
            }
            body.dark .drw-item.primary {
                background:rgba(10,132,255,0.1);
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
        <button class="drw-item" onclick="closeAppDrawer(); setTimeout(() => { if(typeof renderAttendanceLedger==='function') renderAttendanceLedger(); }, 260);">출석부</button>
        <button class="drw-item" onclick="closeAppDrawer(); setTimeout(() => { if(typeof openExamScheduleModal==='function') openExamScheduleModal(); }, 260);">시험일정</button>
        <button class="drw-item" onclick="closeAppDrawer(); openGlobalExamGradeView();">시험·성적</button>
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