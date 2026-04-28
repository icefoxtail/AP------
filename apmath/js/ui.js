/**
 * AP Math OS v26.1.2 [js/ui.js]
 * 공용 UI 컴포넌트 (Toast, Modal, HTML Utility)
 */

function toast(m, t='info') {
    const c = document.getElementById('toast-container'), el = document.createElement('div');
    el.className = `toast ${t}`;
    el.innerText = m;
    c.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function showModal(t, b, at=null, af=null) {
    document.getElementById('modal-title').innerText = t;
    document.getElementById('modal-body').innerHTML = b;
    const ab = document.getElementById('modal-action-btn');
    const footer = document.getElementById('modal-footer');
    
    if (at && af) {
        ab.innerText = at;
        ab.onclick = af;
        ab.classList.remove('hidden');
        if (footer) footer.classList.remove('hidden');
    } else {
        ab.classList.add('hidden');
        if (footer) footer.classList.add('hidden');
    }
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

function escapeHtmlForTextarea(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// [3G] 클리닉 운영 안정화를 위한 공용 보조 함수
function setModalBody(html) {
    const body = document.getElementById('modal-body');
    if (body) body.innerHTML = html;
}

function setModalLoading(title, message) {
    showModal(title, `
        <div style="text-align:center;padding:24px;color:var(--secondary);">
            <div style="font-size:24px;margin-bottom:8px;">⏳</div>
            <div style="font-size:13px;font-weight:800;">${message || '처리 중입니다...'}</div>
        </div>
    `);
}

function setButtonBusy(buttonOrSelector, isBusy, label = '처리 중...') {
    const btn = typeof buttonOrSelector === 'string' ? document.querySelector(buttonOrSelector) : buttonOrSelector;
    if (!btn) return;
    if (isBusy) {
        if (!btn.dataset.originalText) btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<span style="opacity:0.7;">⏳ ${label}</span>`;
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
// [드로어 네비게이션] AP Math OS v26.2
// renderAppDrawer(), openAppDrawer(), closeAppDrawer()
// ============================================================

function renderAppDrawer() {
    // 중복 생성 방지
    if (document.getElementById('app-drawer')) return;

    // CSS 주입
    if (!document.getElementById('app-drawer-style')) {
        const style = document.createElement('style');
        style.id = 'app-drawer-style';
        style.textContent = `
            #app-drawer-overlay {
                display: none; position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.4); z-index: 9998;
            }
            #app-drawer-overlay.drw-open { display: block; }
            #app-drawer {
                position: fixed; top: 0; left: 0; bottom: 0;
                width: 272px; background: #fff; z-index: 9999;
                display: flex; flex-direction: column;
                transform: translateX(-100%);
                transition: transform 0.22s cubic-bezier(.4,0,.2,1);
                box-shadow: 4px 0 20px rgba(0,0,0,0.12);
                overflow-y: auto;
            }
            #app-drawer.drw-open { transform: translateX(0); }
            .drw-hdr {
                background: #0C447C; padding: 44px 20px 20px;
                flex-shrink: 0;
            }
            .drw-title { color: #fff; font-size: 17px; font-weight: 700; margin: 0; }
            .drw-sub { color: rgba(255,255,255,0.52); font-size: 12px; margin: 4px 0 0; }
            .drw-sec {
                font-size: 11px; font-weight: 600; color: #aaa;
                padding: 14px 20px 4px; letter-spacing: 0.4px;
            }
            .drw-item {
                display: flex; align-items: center; gap: 12px;
                padding: 14px 20px; cursor: pointer;
                border: none; border-bottom: 0.5px solid #f2f2f2;
                font-size: 14px; font-weight: 500; color: #1a1a1a;
                background: none; text-align: left; width: 100%;
                font-family: inherit; min-height: 44px;
            }
            .drw-item:active { background: #f0f5ff; color: #0C447C; }
            .drw-item.danger { color: #c5221f; }
            .drw-item.danger:active { background: #fce8e6; }
            .drw-spacer { flex: 1; }
            .drw-footer { padding: 8px 0; border-top: 1px solid #f0f0f0; flex-shrink: 0; }
        `;
        document.head.appendChild(style);
    }

    const isAdmin = state && state.auth && state.auth.role === 'admin';
    const teacherName = typeof getTeacherNameForUI === 'function'
        ? getTeacherNameForUI()
        : (state && state.auth && state.auth.name) || '';

    const teacherMenu = `
        <div class="drw-sec">화면</div>
        <button class="drw-item" onclick="closeAppDrawer(); renderDashboard()">🏠 홈 (오늘일정·학급관리)</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook()">👥 학생관리</button>
        <div class="drw-sec">기능</div>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof renderAttendanceLedger==='function') renderAttendanceLedger()">📋 출석부</button>
        <button class="drw-item" onclick="closeAppDrawer(); openGlobalExamGradeView()">📊 시험성적</button>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof openClinicBasket==='function') openClinicBasket()">🧺 클리닉</button>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu()">⚙️ 운영메뉴</button>
    `;

    const adminMenu = `
        <div class="drw-sec">화면</div>
        <button class="drw-item" onclick="closeAppDrawer(); renderAdminControlCenter()">🏢 운영센터</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook()">👥 학생관리</button>
        <div class="drw-sec">관리</div>
        <button class="drw-item" onclick="closeAppDrawer(); openExamScheduleModal()">📅 시험일정</button>
        <button class="drw-item" onclick="closeAppDrawer(); openDischargedStudents()">🚪 퇴원생</button>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu()">🔄 동기화상태</button>
        <!-- checkSyncStatus() 미구현 시 openOperationMenu()로 대체 -->
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="app-drawer-overlay" onclick="closeAppDrawer()"></div>
        <div id="app-drawer">
            <div class="drw-hdr">
                <p class="drw-title">AP Math OS</p>
                <p class="drw-sub">${isAdmin ? '원장' : teacherName + ' 선생님'}</p>
            </div>
            ${isAdmin ? adminMenu : teacherMenu}
            <div class="drw-spacer"></div>
            <div class="drw-footer">
                <button class="drw-item danger" onclick="closeAppDrawer(); logout()">🚪 로그아웃</button>
            </div>
        </div>
    `;
    while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);
}

function openAppDrawer() {
    renderAppDrawer(); // 미생성 시 생성
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
