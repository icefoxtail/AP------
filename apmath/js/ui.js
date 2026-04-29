/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 안정화 엔진
 * [Minimalism Polish]: 폰트 조절 기능 제거, Soft Dark 적용, 테마 버튼 디자인 정제 (아이콘 제외)
 */

// ============================================================
// [Theme Manager] 다크 모드 전용 엔진
// ============================================================
function getTheme() {
    return localStorage.getItem('APMATH_THEME') || 'light';
}

function getDrawerThemeLabel(isDark) {
    // [Master Polish] 아이콘 제거, 텍스트로만 구성
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
    }

    const legacyToggleBtn = document.getElementById('theme-toggle-btn');
    if (legacyToggleBtn) {
        legacyToggleBtn.innerText = isDark ? '라이트 모드' : '다크 모드';
    }
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

            // [Polish] 모달 액션 버튼 미니멀리즘 및 터치 타겟 사수
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
// [드로어 네비게이션] 글씨 크기 조절 삭제 + 테마 토글 단일화
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
            /* [Polish] Soft Dark Palette - iOS 스타일 다크모드 적용 */
            body.dark {
                --bg: #121212;
                --surface: #1A1A1C;
                --surface-2: #242427;
                --border: #323238;
                --text: #F5F5F7;
                --text-soft: #A8A8AC;
                --secondary: #6E6E73;
                --primary: #0A84FF;
            }

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

            .drw-top-tools {
                padding:calc(16px + env(safe-area-inset-top)) 12px 10px;
                background:var(--surface);
                border-bottom:1px solid var(--border);
                flex-shrink:0;
            }

            /* [Polish] 테마 버튼 단독 배치 스타일 */
            .drw-tool-btn {
                width:100%;
                min-height:44px;
                display:flex;
                align-items:center;
                justify-content:center;
                border:1px solid var(--border);
                border-radius:12px;
                background:var(--surface-2);
                color:var(--text);
                font-size:14px;
                font-weight:700;
                font-family:inherit;
                cursor:pointer;
                letter-spacing:-0.2px;
                transition:all 0.2s;
                white-space:nowrap;
            }

            /* [Polish] 테마 토글 버튼 상태별 동적 테두리 */
            body:not(.dark) #drawer-theme-toggle {
                border: 1.5px solid rgba(255, 165, 2, 0.35);
                color: rgba(230, 110, 0, 1);
                background: rgba(255, 165, 2, 0.03);
            }
            body.dark #drawer-theme-toggle {
                border: 1.5px solid rgba(10, 132, 255, 0.25);
                color: rgba(10, 132, 255, 1);
                background: rgba(10, 132, 255, 0.03);
            }

            .drw-tool-btn:active {
                background:rgba(128, 128, 128, 0.1);
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
                background:rgba(10,132,255,0.06);
                color:var(--primary);
            }
            body.dark .drw-item.primary {
                background:rgba(10,132,255,0.1);
                color:var(--primary);
            }
            .drw-item.primary:active {
                background:rgba(10,132,255,0.12);
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