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

    function renderPanel({ title, copy, note }) {
        return `
            <section aria-labelledby="eie-panel-title">
                <button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>
                <div class="eie-panel">
                    <h1 id="eie-panel-title" class="eie-panel-title">${escapeHtml(title)}</h1>
                    <p class="eie-panel-copy">${escapeHtml(copy)}</p>
                    ${note ? `<div class="eie-api-note">${escapeHtml(note)}</div>` : ''}
                </div>
            </section>
        `;
    }

    // Shared auth fetch helper — mirrors eie-api.js auth logic without modifying that file
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

    function clearEieToken() {
        const bridge = window.WangjiOwnerAuthBridge;
        if (bridge) { bridge.clearEieSession(); return; }
        if (window.localStorage) window.localStorage.removeItem('WANGJI_EIE_SESSION_TOKEN');
    }

    function addLogoutButton() {
        if (document.getElementById('eie-logout-btn')) return;
        const nav = document.querySelector('.eie-nav') || document.querySelector('.eie-shell-header');
        if (!nav) return;
        const btn = document.createElement('button');
        btn.id = 'eie-logout-btn';
        btn.type = 'button';
        btn.className = 'eie-nav-link';
        btn.textContent = '로그아웃';
        btn.style.cssText = 'cursor:pointer;';
        btn.addEventListener('click', function () { EieApp.handleEieLogout(); });
        nav.appendChild(btn);
    }

    function removeLogoutButton() {
        const btn = document.getElementById('eie-logout-btn');
        if (btn) btn.remove();
    }

    function renderEieLogin(message) {
        removeLogoutButton();
        const root = document.getElementById('eie-app');
        if (!root) return;
        const msg = message ? `<p class="eie-login-error" role="alert">${escapeHtml(message)}</p>` : '';
        root.innerHTML = `
            <div class="eie-login-overlay" id="eie-login-screen">
                <div class="eie-login-card">
                    <div class="eie-login-logo" aria-hidden="true">E</div>
                    <h1 class="eie-login-title">EIE 영어 관리</h1>
                    <p class="eie-login-sub">원장님 계정으로 로그인합니다.</p>
                    ${msg}
                    <label class="eie-login-label" for="eie-login-id">아이디</label>
                    <input id="eie-login-id" type="text" class="eie-login-input" autocomplete="username" placeholder="아이디 입력">
                    <label class="eie-login-label" for="eie-login-pw">비밀번호</label>
                    <input id="eie-login-pw" type="password" class="eie-login-input" autocomplete="current-password" placeholder="비밀번호 입력">
                    <button type="button" class="eie-login-btn" id="eie-login-submit">로그인</button>
                    <p class="eie-login-notice">로그인 상태는 이 브라우저에 저장됩니다.</p>
                </div>
            </div>
        `;
        const input = document.getElementById('eie-login-pw');
        if (input) {
            input.addEventListener('keyup', function (e) {
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
            addLogoutButton();
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
        addLogoutButton();
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
        renderPanel,
        fetchWithAuth,
        renderEieLogin,
        submitEieLogin,
        handleEieLogout,
        handleEie401
    };

    window.addEventListener('DOMContentLoaded', bootWhenReady);
})();
