/**
 * AP Math OS 1.0 [js/ui.js]
 * 공용 UI 컴포넌트 및 품질 보정 테마 엔진
 */

// ============================================================
// [Theme Manager] 다크 모드 테마 관리 및 텍스트 동기화
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
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem('APMATH_THEME', next);
    applyTheme(next);
}

applyTheme(getTheme());

function toast(m, t='info') {
    const c = document.getElementById('toast-container');
    if (!c) return;
    const el = document.createElement('div');
    el.className = `toast ${t}`;
    el.innerText = m;
    el.style.cssText = "background:rgba(25,31,40,0.9); color:#fff; padding:12px 24px; border-radius:50px; margin-top:8px; font-size:14px; font-weight:600; box-shadow:0 8px 20px rgba(0,0,0,0.15);";
    c.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

/**
 * Top Action Modal 시스템
 */
function showModal(t, b, at=null, af=null) {
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const actionBtn = document.getElementById('modal-action-btn');
    if (!titleEl || !bodyEl) return;

    titleEl.innerText = t;
    bodyEl.innerHTML = b;

    if (at && af) {
        actionBtn.innerText = at;
        actionBtn.onclick = af;
        actionBtn.classList.remove('hidden');
    } else {
        actionBtn.classList.add('hidden');
    }

    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => overlay.classList.add('show'));
}

function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('show');
    setTimeout(() => overlay.classList.add('hidden'), 260);
}

// ============================================================
// [드로어 네비게이션] 슬림 레이아웃 적용
// ============================================================
function renderAppDrawer() {
    if (document.getElementById('app-drawer')) return;
    const style = document.createElement('style');
    style.textContent = `
        #app-drawer { position:fixed; top:0; left:0; bottom:0; width:min(75vw, 260px); background:var(--surface); z-index:9999; transform:translateX(-104%); transition:transform .3s; box-shadow:4px 0 24px rgba(0,0,0,0.06); display:flex; flex-direction:column; border-radius:0 20px 20px 0; }
        #app-drawer.drw-open { transform:translateX(0); }
        .drw-item { padding:14px 20px; font-size:15px; font-weight:700; color:var(--text); border:0; background:transparent; text-align:left; width:100%; cursor:pointer; }
        .drw-item:active { background:var(--bg); }
    `;
    document.head.appendChild(style);
    
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div id="app-drawer-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:9998;" onclick="closeAppDrawer()"></div>
        <nav id="app-drawer">
            <div style="padding:40px 20px 20px; background:var(--bg); border-bottom:1px solid var(--border);">
                <p style="font-size:20px; font-weight:950; color:var(--primary); margin:0;">AP MATH</p>
            </div>
            <button class="drw-item" onclick="renderDashboard(); closeAppDrawer();">홈</button>
            <button class="drw-item" onclick="openAddressBook(); closeAppDrawer();">학생관리</button>
            <div style="flex:1;"></div>
            <button class="drw-item" style="color:var(--error);" onclick="logout(); closeAppDrawer();">로그아웃</button>
        </nav>
    `;
    document.body.appendChild(wrapper);
}

function openAppDrawer() { renderAppDrawer(); document.getElementById('app-drawer').classList.add('drw-open'); document.getElementById('app-drawer-overlay').style.display='block'; }
function closeAppDrawer() { document.getElementById('app-drawer').classList.remove('drw-open'); document.getElementById('app-drawer-overlay').style.display='none'; }
