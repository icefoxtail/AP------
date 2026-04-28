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
// [드로어 네비게이션] AP Math OS 모바일 앱형 네비게이션
// ============================================================
function renderAppDrawer() {
    if (document.getElementById('app-drawer')) return;
    if (!document.getElementById('app-drawer-style')) {
        const style = document.createElement('style');
        style.id = 'app-drawer-style';
        style.textContent = `
            #app-drawer-overlay { display:none; position:fixed; inset:0; background:rgba(18,28,45,0.42); z-index:9998; backdrop-filter:blur(2px); }
            #app-drawer-overlay.drw-open { display:block; }
            #app-drawer { position:fixed; top:0; left:0; bottom:0; width:min(82vw,306px); background:#FCFCFA; z-index:9999; display:flex; flex-direction:column; transform:translateX(-104%); transition:transform .22s cubic-bezier(.4,0,.2,1); box-shadow:10px 0 34px rgba(12,68,124,.18); overflow-y:auto; border-radius:0 24px 24px 0; }
            #app-drawer.drw-open { transform:translateX(0); }
            .drw-hdr { padding:38px 20px 18px; background:linear-gradient(135deg,#0C447C 0%,#2C7BE5 100%); flex-shrink:0; }
            .drw-title { color:#fff; font-size:19px; font-weight:950; margin:0; letter-spacing:-.5px; }
            .drw-sub { color:rgba(255,255,255,.78); font-size:12px; font-weight:800; margin:5px 0 0; }
            .drw-sec { font-size:11px; font-weight:950; color:#8a94a6; padding:16px 20px 6px; letter-spacing:.4px; }
            .drw-item { display:flex; align-items:center; gap:12px; width:calc(100% - 24px); margin:4px 12px; padding:14px; min-height:48px; border:0; border-radius:16px; background:transparent; color:#1a1a1a; font-size:14px; font-weight:900; font-family:inherit; text-align:left; cursor:pointer; }
            .drw-item:active { background:#E6F1FB; color:#0C447C; transform:scale(.99); }
            .drw-item.primary { background:#E6F1FB; color:#0C447C; }
            .drw-item.danger { color:#c5221f; }
            .drw-item.danger:active { background:#fce8e6; }
            .drw-icon { width:24px; text-align:center; font-size:18px; }
            .drw-spacer { flex:1; }
            .drw-footer { padding:10px 0 18px; border-top:1px solid #eef0f2; flex-shrink:0; }
        `;
        document.head.appendChild(style);
    }
    const session = typeof getSession === 'function' ? getSession() : null;
    const isAdmin = !!(state && state.auth && state.auth.role === 'admin');
    const displayName = isAdmin ? (state.auth?.name || session?.name || '원장') : (typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.auth?.name || session?.name || '담당'));
    const teacherMenu = `
        <div class="drw-sec">메인</div>
        <button class="drw-item primary" onclick="closeAppDrawer(); renderDashboard();"><span class="drw-icon">🏠</span>홈</button>
        <button class="drw-item" onclick="closeAppDrawer(); openDailyJournalModal();"><span class="drw-icon">📝</span>일지</button>
        <button class="drw-item" onclick="closeAppDrawer(); openTodoMemoModal();"><span class="drw-icon">✅</span>메모</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook();"><span class="drw-icon">👥</span>학생관리</button>
        <div class="drw-sec">수업·성적</div>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof renderAttendanceLedger==='function') renderAttendanceLedger();"><span class="drw-icon">📋</span>출석부</button>
        <button class="drw-item" onclick="closeAppDrawer(); openGlobalExamGradeView();"><span class="drw-icon">📊</span>시험성적</button>
        <button class="drw-item" onclick="closeAppDrawer(); if(typeof openClinicBasket==='function') openClinicBasket();"><span class="drw-icon">🧺</span>클리닉</button>
        <div class="drw-sec">운영</div>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu();"><span class="drw-icon">⚙️</span>운영메뉴</button>`;
    const adminMenu = `
        <div class="drw-sec">원장</div>
        <button class="drw-item primary" onclick="closeAppDrawer(); renderAdminControlCenter();"><span class="drw-icon">🏢</span>운영센터</button>
        <button class="drw-item" onclick="closeAppDrawer(); openAddressBook();"><span class="drw-icon">👥</span>학생관리</button>
        <div class="drw-sec">운영</div>
        <button class="drw-item" onclick="closeAppDrawer(); openExamScheduleModal();"><span class="drw-icon">📅</span>시험일정</button>
        <button class="drw-item" onclick="closeAppDrawer(); openDischargedStudents();"><span class="drw-icon">🗄️</span>퇴원생</button>
        <button class="drw-item" onclick="closeAppDrawer(); openOperationMenu();"><span class="drw-icon">🔄</span>동기화상태</button>`;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="app-drawer-overlay" onclick="closeAppDrawer()"></div>
        <nav id="app-drawer" aria-label="AP Math OS navigation">
            <div class="drw-hdr"><p class="drw-title">AP Math OS</p><p class="drw-sub">${isAdmin ? `${displayName} 원장` : `${displayName} 선생님`}</p></div>
            ${isAdmin ? adminMenu : teacherMenu}
            <div class="drw-spacer"></div>
            <div class="drw-footer"><button class="drw-item danger" onclick="closeAppDrawer(); logout();"><span class="drw-icon">🚪</span>로그아웃</button></div>
        </nav>`;
    while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);
}
function openAppDrawer() { renderAppDrawer(); const drw=document.getElementById('app-drawer'); const ovl=document.getElementById('app-drawer-overlay'); if(drw) drw.classList.add('drw-open'); if(ovl) ovl.classList.add('drw-open'); }
function closeAppDrawer() { const drw=document.getElementById('app-drawer'); const ovl=document.getElementById('app-drawer-overlay'); if(drw) drw.classList.remove('drw-open'); if(ovl) ovl.classList.remove('drw-open'); }
