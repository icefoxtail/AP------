/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 다크모드 테마 엔진
 */

// ============================================================
// [Theme Manager] 다크 모드 테마 관리
// ============================================================
function getTheme() {
    return localStorage.getItem('APMATH_THEME') || 'light';
}

function applyTheme(theme) {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (theme === 'dark') {
        document.body.classList.add('dark');
        if (toggleBtn) toggleBtn.innerText = '라이트 모드';
    } else {
        document.body.classList.remove('dark');
        if (toggleBtn) toggleBtn.innerText = '다크 모드';
    }
}

function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('APMATH_THEME', next);
    applyTheme(next);
}

// 파일 로드 시 즉시 테마 적용
applyTheme(getTheme());


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

/**
 * Top Action Modal
 */
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
// [드로어 네비게이션] 테마 스위치 잔재 제거 완료
// ============================================================
function renderAppDrawer() {
    if (document.getElementById('app-drawer')) return;

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
                border-radius:0 20px 20px 0;
            }
            #app-drawer.drw-open { transform:translateX(0); }

            .drw-hdr {
                padding:calc(40px + env(safe-area-inset-top)) 20px 20px;
                background:var(--bg);
                flex-shrink:0;
                border-bottom:1px solid var(--border);
            }
            .drw-title {
                color:var(--primary);
                font-size:20px;
                font-weight:950;
                margin:0;
                letter-spacing:-0.8px;
            }
            .drw-sub {
                color:var(--secondary);
                font-size:12px;
                font-weight:700;
                margin:6px 0 0;
            }

            .drw-sec {
                font-size:11px;
                font-weight:900;
                color:var(--secondary);
                padding:16px 20px 6px;
                letter-spacing:0.5px;
                text-transform:uppercase;
            }
            .drw-item {
                display:flex;
                align-items:center;
                width:calc(100% - 16px);
                margin:2px 8px;
                padding:12px 14px;
                min-height:44px;
                border:0;
                border-radius:12px;
                background:transparent;
                color:var(--text);
                font-size:14px;
                font-weight:700;
                font-family:inherit;
                text-align:left;
                cursor:pointer;
                transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .drw-item:active {
                background:var(--bg);
                transform:scale(0.96);
            }
            .drw-item.primary {
                background:rgba(26,92,255,0.08);
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
                padding:8px 0 calc(16px + env(safe-area-inset-bottom));
                border-top:1px solid var(--border);
                flex-shrink:0;
                background:var(--surface);
            }
        `;
        document.head.appendChild(style);
    }

    const session = typeof getSession === 'function' ? getSession() : null;
    const isAdmin = !!(state && state.auth && state.auth.role === 'admin');
    const displayName = isAdmin
        ? (state.auth?.name || session?.name || '원장')
        : (typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.auth?.name || session?.name || '담당'));

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
            <div class="drw-hdr">
                <p class="drw-title">AP Math OS</p>
                <p class="drw-sub">${isAdmin ? `${displayName} 원장` : `${displayName} 선생님`}</p>
            </div>
            ${isAdmin ? adminMenu : teacherMenu}
            <div class="drw-spacer"></div>
            <div class="drw-footer">
                <button class="drw-item danger" onclick="closeAppDrawer(); logout();">로그아웃</button>
            </div>
        </nav>
    `;

    while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);
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
