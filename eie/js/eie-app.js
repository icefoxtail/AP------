(function () {
    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch]));
    }

    async function mount(html) {
        const root = document.getElementById('eie-app');
        if (!root) return;
        root.innerHTML = html;
    }

    // 라우트 진입 즉시 골격(스켈레톤)을 그려, 원격 데이터가 오는 동안
    // 이전 화면이 멈춘 듯 보이는 현상을 없앤다. 실제 콘텐츠가 mount되면 교체된다.
    const EIE_ROUTE_TITLES = {
        dashboard: '대시보드', timetable: '시간표', students: '학생관리',
        classroom: '클래스룸', attendance: '출석부', grades: '성적표',
        teacher: '선생님', management: '관리'
    };

    function mountSkeleton(route) {
        const root = document.getElementById('eie-app');
        if (!root) return;
        const title = EIE_ROUTE_TITLES[route] || '';
        root.innerHTML = `
            <section class="eie-route-skeleton" aria-busy="true" aria-live="polite" aria-label="${escapeHtml(title)} 불러오는 중">
                <div class="eie-skel eie-skel-title"></div>
                <div class="eie-skel-row">
                    <span class="eie-skel eie-skel-chip"></span>
                    <span class="eie-skel eie-skel-chip"></span>
                    <span class="eie-skel eie-skel-chip"></span>
                </div>
                <div class="eie-skel eie-skel-card"></div>
                <div class="eie-skel eie-skel-card"></div>
                <div class="eie-skel eie-skel-card"></div>
            </section>`;
    }

    function renderPanel({ title, copy, note }) {
        const homeRoute = eieHomeRouteForSession();
        return `
            <section aria-labelledby="eie-panel-title">
                <button type="button" class="eie-back-button" data-eie-route="${homeRoute}" aria-label="EIE 홈으로 이동" title="EIE 홈">EIE 홈</button>
                <div class="eie-panel">
                    <h1 id="eie-panel-title" class="eie-panel-title">${escapeHtml(title)}</h1>
                    <p class="eie-panel-copy">${escapeHtml(copy)}</p>
                    ${note ? `<div class="eie-api-note">${escapeHtml(note)}</div>` : ''}
                </div>
            </section>
        `;
    }

    // Shared auth fetch helper mirrors eie-api.js auth logic without modifying that file.
    function findStoredAuth() {
        const keys = [
            'WANGJI_EIE_SESSION_TOKEN',
            'WANGJI_AUTH_HEADER',
            'WANGJI_AUTH_TOKEN',
            'WANGJI_SESSION_TOKEN',
            'TEACHER_SESSION_TOKEN',
            'teacher_session_token',
            'session_token'
        ];
        for (const key of keys) {
            const value = window.localStorage ? window.localStorage.getItem(key) : '';
            if (!value) continue;
            const trimmed = String(value).trim();
            if (!trimmed) continue;
            if (/^(Bearer|Basic)\s+/i.test(trimmed)) return trimmed;
            return `Bearer ${trimmed}`;
        }
        return '';
    }

    async function fetchWithAuth(url) {
        const headers = { 'Content-Type': 'application/json' };
        const auth = findStoredAuth();
        if (auth) headers['Authorization'] = auth;
        const response = await fetch(url, { method: 'GET', headers });
        const text = await response.text();
        let data;
        try { data = JSON.parse(text); } catch (e) { data = { success: false, error: text }; }
        if (!response.ok || data?.success === false) {
            const err = new Error(data?.error || data?.message || response.statusText || '요청 실패');
            err.status = response.status;
            throw err;
        }
        return data || { success: true };
    }

    function getEieToken() {
        const bridge = window.WangjiOwnerAuthBridge;
        if (bridge) return bridge.getEieToken();
        return (window.localStorage && window.localStorage.getItem('WANGJI_EIE_SESSION_TOKEN')) || '';
    }

    function getEieRole() {
        return (window.localStorage && window.localStorage.getItem('WANGJI_EIE_ROLE')) || '';
    }

    function isEieTeacherSession() {
        const role = String(getEieRole() || '').toLowerCase();
        return role === 'teacher' || role === 'eieteacher';
    }

    function isEieOwnerSession() {
        const role = String(getEieRole() || '').toLowerCase();
        const loginId = String(window.localStorage?.getItem('WANGJI_EIE_LOGIN_ID') || '').toLowerCase();
        return role === 'admin' || role === 'owner' || loginId === 'admin';
    }

    function eieHomeRouteForSession() {
        return isEieTeacherSession() && !isEieOwnerSession() ? 'teacher' : 'dashboard';
    }

    function ensureEieInitialRoute() {
        const current = String(window.location.hash || '').replace(/^#/, '').trim();
        if (isEieTeacherSession()) {
            if (!current || current === 'dashboard') window.location.hash = '#teacher';
            return;
        }
        if (isEieOwnerSession()) {
            if (current !== 'dashboard') window.location.hash = '#dashboard';
        }
    }

    function clearEieToken() {
        const bridge = window.WangjiOwnerAuthBridge;
        if (bridge) { bridge.clearEieSession(); return; }
        if (window.localStorage) window.localStorage.removeItem('WANGJI_EIE_SESSION_TOKEN');
    }

    function addLogoutButton() { /* 로그아웃 버튼은 drawer 정적 HTML에 포함되어 no-op. */ }
    function removeLogoutButton() { /* no-op */ }

    function eieUpdateHeaderUser() {
        const name = (window.localStorage && window.localStorage.getItem('WANGJI_EIE_NAME')) || '';
        const mobile = document.getElementById('eie-mobile-user');
        if (mobile) mobile.textContent = name;
        let desktop = document.getElementById('eie-desktop-user');
        const topbar = document.querySelector('.eie-desktop-topbar');
        if (topbar && name) {
            if (!desktop) {
                desktop = document.createElement('div');
                desktop.id = 'eie-desktop-user';
                topbar.appendChild(desktop);
            }
            desktop.textContent = name;
        }
    }

    window.eieOpenDrawer = function () {
        var drawer = document.getElementById('eie-drawer');
        var overlay = document.getElementById('eie-drawer-overlay');
        if (!drawer) return;
        if (window.innerWidth >= 901) {
            drawer.classList.add('eie-drw-expanded');
            document.body.classList.add('eie-drawer-expanded');
        } else {
            drawer.classList.add('eie-drw-open');
            if (overlay) overlay.classList.add('eie-drw-open');
        }
    };

    window.eieCloseDrawer = function () {
        var drawer = document.getElementById('eie-drawer');
        var overlay = document.getElementById('eie-drawer-overlay');
        if (!drawer) return;
        drawer.classList.remove('eie-drw-open');
        drawer.classList.remove('eie-drw-expanded');
        if (overlay) overlay.classList.remove('eie-drw-open');
        document.body.classList.remove('eie-drawer-expanded');
    };

    window.eieGoHome = function () {
        const route = eieHomeRouteForSession();
        if (window.EieRouter && typeof window.EieRouter.open === 'function') {
            window.EieRouter.open(route);
        } else {
            window.location.hash = '#' + route;
        }
    };

    function renderEieLogin(message) {
        removeLogoutButton();
        const root = document.getElementById('eie-app');
        if (!root) return;
        const msg = message ? `<div style="margin:0 0 14px; padding:12px 14px; border-radius:14px; background:rgba(239,68,68,0.09); border:1px solid rgba(239,68,68,0.20); color:#B42318; font-size:13px; font-weight:800; line-height:1.45;" role="alert">${escapeHtml(message)}</div>` : '';
        root.innerHTML = `
            <div class="eie-login-screen" id="eie-login-screen" style="position:fixed; inset:0; z-index:3000; min-height:100vh; min-height:100dvh; overflow:hidden; display:flex; align-items:stretch; justify-content:center; background:linear-gradient(135deg,#0F766E 0%,#2563EB 50%,#7C3AED 100%); color:#fff;">
                <div style="position:absolute; inset:0; background:
                    radial-gradient(circle at 18% 18%, rgba(255,255,255,0.30) 0, rgba(255,255,255,0.10) 26%, transparent 48%),
                    radial-gradient(circle at 88% 12%, rgba(255,255,255,0.20) 0, transparent 36%),
                    radial-gradient(circle at 72% 86%, rgba(15,23,42,0.24) 0, transparent 42%); pointer-events:none;"></div>
                <div style="position:absolute; inset:0; background:rgba(15,23,42,0.08); pointer-events:none;"></div>

                <div style="position:relative; width:100%; max-width:1120px; min-height:100vh; min-height:100dvh; display:grid; grid-template-columns:minmax(0,1fr) 390px; align-items:center; gap:54px; padding:clamp(28px,5vw,72px); box-sizing:border-box;">
                    <section style="min-width:0; display:flex; flex-direction:column; justify-content:center; gap:26px;">
                        <div style="display:flex; align-items:center; gap:18px;">
                            <img src="./assets/eie-logo.png" alt="EIE" style="width:82px; height:82px; border-radius:22px; background:#fff; box-shadow:0 18px 46px rgba(15,23,42,0.24); display:block; object-fit:contain; padding:10px; box-sizing:border-box;">
                            <div style="min-width:0;">
                                <div style="font-size:clamp(34px,5.2vw,64px); font-weight:900; line-height:0.95; letter-spacing:-2.8px; color:#fff; text-shadow:0 8px 24px rgba(15,23,42,0.20);">EIE</div>
                                <div style="margin-top:9px; font-size:clamp(18px,2.2vw,27px); font-weight:800; line-height:1.1; letter-spacing:-0.9px; color:rgba(255,255,255,0.90); text-shadow:0 5px 18px rgba(15,23,42,0.16);">Operations System</div>
                            </div>
                        </div>

                        <div style="max-width:560px;">
                            <div style="font-size:clamp(18px,2.2vw,28px); font-weight:900; line-height:1.28; letter-spacing:-1px; color:#fff;">
                                선생님과 원장님을 위한<br>EIE 영어 운영 로그인
                            </div>
                            <div style="margin-top:16px; font-size:15px; font-weight:700; line-height:1.7; color:rgba(255,255,255,0.76);">
                                시간표, 출석부, 클래스룸, 학생 관리를 한 화면에서 확인합니다.
                            </div>
                        </div>
                    </section>

                    <section style="width:100%; background:rgba(255,255,255,0.95); color:#191F28; border:1px solid rgba(255,255,255,0.46); border-radius:30px; padding:30px 26px 26px; box-shadow:0 26px 70px rgba(15,23,42,0.28); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); box-sizing:border-box;">
                        <div style="margin-bottom:24px;">
                            <div style="font-size:22px; font-weight:900; line-height:1.25; letter-spacing:-0.8px; color:#191F28;">로그인</div>
                            <div style="margin-top:6px; font-size:13px; font-weight:800; line-height:1.5; color:#6B7684;">원장님 / 선생님 계정으로 접속하세요.</div>
                        </div>

                        ${msg}

                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <div>
                                <label style="display:block; font-size:12px; font-weight:900; color:#6B7684; margin-bottom:7px; margin-left:4px; line-height:1.4;" for="eie-login-id">아이디</label>
                                <input id="eie-login-id" type="text" autocomplete="username" placeholder="아이디 입력" style="width:100%; min-height:54px; text-align:left; cursor:text; padding:15px 16px; font-size:15px; font-weight:800; line-height:1.4; border-radius:16px; border:1px solid rgba(229,232,235,0.95); background:#F8FAFC; color:#191F28; box-shadow:none; outline:none; box-sizing:border-box;">
                            </div>
                            <div>
                                <label style="display:block; font-size:12px; font-weight:900; color:#6B7684; margin-bottom:7px; margin-left:4px; line-height:1.4;" for="eie-login-pw">비밀번호</label>
                                <input id="eie-login-pw" type="password" autocomplete="current-password" placeholder="비밀번호 입력" style="width:100%; min-height:54px; text-align:left; cursor:text; padding:15px 16px; font-size:15px; font-weight:800; line-height:1.4; border-radius:16px; border:1px solid rgba(229,232,235,0.95); background:#F8FAFC; color:#191F28; box-shadow:none; outline:none; box-sizing:border-box;">
                            </div>
                            <button type="button" id="eie-login-submit" style="width:100%; margin-top:10px; min-height:56px; padding:15px 16px; font-size:15px; font-weight:900; line-height:1.2; border-radius:18px; border:none; background:linear-gradient(135deg,#0F766E 0%,#2563EB 100%); color:#fff; box-shadow:0 14px 28px rgba(37,99,235,0.26); cursor:pointer;">로그인</button>
                        </div>

                        <div style="margin-top:18px; padding-top:16px; border-top:1px solid #E5E8EB; display:flex; align-items:center; justify-content:space-between; gap:10px;">
                            <span style="font-size:11px; font-weight:900; color:#8B95A1;">EIE OS</span>
                            <span style="font-size:11px; font-weight:900; color:#8B95A1;">Teacher · Owner</span>
                        </div>
                    </section>
                </div>

                <style>
                    @media (max-width: 760px) {
                        .eie-login-screen > div:nth-child(3) {
                            display:flex !important;
                            flex-direction:column !important;
                            justify-content:space-between !important;
                            gap:0 !important;
                            padding:calc(34px + env(safe-area-inset-top)) 20px calc(22px + env(safe-area-inset-bottom)) !important;
                        }
                        .eie-login-screen section:first-of-type {
                            gap:18px !important;
                            padding-top:18px !important;
                        }
                        .eie-login-screen section:first-of-type > div:first-child {
                            flex-direction:column !important;
                            align-items:flex-start !important;
                            gap:16px !important;
                        }
                        .eie-login-screen section:first-of-type img {
                            width:76px !important;
                            height:76px !important;
                            border-radius:21px !important;
                        }
                        .eie-login-screen section:first-of-type > div:last-child {
                            display:none !important;
                        }
                        .eie-login-screen section:last-of-type {
                            border-radius:28px !important;
                            padding:26px 20px 22px !important;
                            background:rgba(255,255,255,0.96) !important;
                        }
                    }
                    @media (max-width: 380px) {
                        .eie-login-screen > div:nth-child(3) {
                            padding-left:16px !important;
                            padding-right:16px !important;
                        }
                        .eie-login-screen section:last-of-type {
                            padding-left:18px !important;
                            padding-right:18px !important;
                        }
                    }
                </style>
            </div>
        `;
        const idInput = document.getElementById('eie-login-id');
        const pwInput = document.getElementById('eie-login-pw');
        if (idInput) {
            setTimeout(function () { try { idInput.focus(); } catch (e) {} }, 0);
            idInput.addEventListener('keyup', function (e) {
                if (e.key === 'Enter' && pwInput) pwInput.focus();
            });
        }
        if (pwInput) {
            pwInput.addEventListener('keyup', function (e) {
                if (e.key === 'Enter') EieApp.submitEieLogin();
            });
        }
        const btn = document.getElementById('eie-login-submit');
        if (btn) btn.addEventListener('click', function () { EieApp.submitEieLogin(); });
    }

    async function submitEieLogin() {
        const loginId = (document.getElementById('eie-login-id') || {}).value || '';
        const password = (document.getElementById('eie-login-pw') || {}).value || '';
        if (!loginId.trim() || !password.trim()) {
            renderEieLogin('아이디와 비밀번호를 입력하세요.');
            return;
        }
        const btn = document.getElementById('eie-login-submit');
        if (btn) { btn.disabled = true; btn.textContent = '로그인 중...'; }
        try {
            const eieData = await window.WangjiOwnerAuthBridge.loginEieWithCredentials(loginId.trim(), password.trim());
            window.WangjiOwnerAuthBridge.saveEieSession(eieData);
            window.WangjiOwnerAuthBridge.bridgeAfterEieLogin(loginId.trim(), password.trim(), eieData);
            eieUpdateHeaderUser();
            ensureEieInitialRoute();
            if (window.EieRouter && typeof window.EieRouter.boot === 'function') {
                window.EieRouter.boot();
            }
        } catch (e) {
            let msg = '로그인 정보를 확인해 주세요.';
            if (e && e.message && e.message.includes('fetch')) msg = 'EIE 서버에 연결하지 못했습니다.';
            renderEieLogin(msg);
        }
    }

    async function handleEieLogout() {
        const token = getEieToken();
        if (token) {
            fetch('https://wangji-eie-os.js-pdf.workers.dev/api/auth/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }
            }).catch(function () {});
        }
        clearEieToken();
        renderEieLogin('다시 로그인해 주세요.');
    }

    function handleEie401() {
        clearEieToken();
        renderEieLogin('다시 로그인해 주세요.');
    }

    function bootWhenReady() {
        if (!window.EieRouter || typeof window.EieRouter.boot !== 'function') return;
        if (!getEieToken()) {
            renderEieLogin();
            return;
        }
        eieUpdateHeaderUser();
        ensureEieInitialRoute();
        const originalBoot = window.EieRouter.boot.bind(window.EieRouter);
        window.EieRouter.boot = async function () {
            try {
                return await originalBoot();
            } catch (e) {
                if (e && e.status === 401) { handleEie401(); return; }
                throw e;
            }
        };
        window.EieRouter.boot().catch(function (e) {
            if (e && e.status === 401) handleEie401();
        });
    }

    window.EieApp = {
        escapeHtml,
        mount,
        mountSkeleton,
        renderPanel,
        fetchWithAuth,
        renderEieLogin,
        submitEieLogin,
        handleEieLogout,
        handleEie401,
        eieUpdateHeaderUser
    };

    window.addEventListener('DOMContentLoaded', bootWhenReady);
})();
