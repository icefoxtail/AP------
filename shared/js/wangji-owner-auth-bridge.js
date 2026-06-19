(function () {
    const WANGJI_EIE_WORKER_BASE = (window.WANGJI_EIE_WORKER_BASE || 'https://wangji-eie-os.js-pdf.workers.dev').replace(/\/+$/, '');
    const WANGJI_APMATH_API_BASE = (window.WANGJI_APMATH_API_BASE || 'https://ap-math-os-v2612.js-pdf.workers.dev/api').replace(/\/+$/, '');

    const KEYS = {
        token: 'WANGJI_EIE_SESSION_TOKEN',
        loginId: 'WANGJI_EIE_LOGIN_ID',
        role: 'WANGJI_EIE_ROLE',
        name: 'WANGJI_EIE_NAME',
        expiresAt: 'WANGJI_EIE_EXPIRES_AT'
    };

    function ls() { return window.localStorage; }

    function saveEieSession(payload) {
        if (!payload || !payload.session_token) return;
        ls().setItem(KEYS.token, payload.session_token);
        ls().setItem(KEYS.loginId, payload.login_id || '');
        ls().setItem(KEYS.role, payload.role || '');
        ls().setItem(KEYS.name, payload.name || '');
        ls().setItem(KEYS.expiresAt, payload.expires_at || '');
    }

    function getEieToken() {
        return ls().getItem(KEYS.token) || '';
    }

    function clearEieSession() {
        Object.values(KEYS).forEach(function (k) { ls().removeItem(k); });
    }

    function hasEieSession() {
        return !!getEieToken();
    }

    function isAdminPayload(payload) {
        if (!payload) return false;
        const role = String(payload.role || '').toLowerCase();
        const loginId = String(payload.login_id || payload.loginId || payload.id || '').toLowerCase();
        return role === 'admin' || role === 'owner' || loginId === 'admin';
    }

    async function loginEieWithCredentials(loginId, password) {
        const res = await fetch(WANGJI_EIE_WORKER_BASE + '/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ login_id: loginId, password: password })
        });
        const data = await res.json().catch(function () { return {}; });
        if (!res.ok || !data.success) throw new Error(data.error || data.message || '로그인 실패');
        return data;
    }

    async function bridgeAfterApmathLogin(loginId, password, apmathPayload) {
        if (!isAdminPayload(apmathPayload)) return;
        try {
            const eieData = await loginEieWithCredentials(loginId, password);
            saveEieSession(eieData);
        } catch (e) {
            console.warn('[WangjiOwnerAuthBridge] EIE 브릿지 실패 (AP Math 로그인에는 영향 없음):', e.message);
        }
    }

    async function bridgeAfterEieLogin(loginId, password, eiePayload) {
        saveEieSession(eiePayload);
        try {
            const apiBase = ((window.CONFIG && window.CONFIG.API_BASE) || WANGJI_APMATH_API_BASE).replace(/\/+$/, '');
            const r = await fetch(apiBase + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ login_id: loginId, password: password })
            });
            const data = await r.json().catch(function () { return {}; });
            if (r.ok && data.success) {
                ls().setItem('APMATH_SESSION', JSON.stringify({
                    login_id: data.login_id || loginId,
                    id: data.id,
                    name: data.name,
                    role: data.role,
                    session_token: data.session_token || '',
                    expires_at: data.expires_at || ''
                }));
            }
        } catch (e) {
            console.warn('[WangjiOwnerAuthBridge] AP Math 브릿지 실패 (EIE 로그인에는 영향 없음):', e.message);
        }
    }

    window.WangjiOwnerAuthBridge = {
        loginEieWithCredentials: loginEieWithCredentials,
        saveEieSession: saveEieSession,
        getEieToken: getEieToken,
        clearEieSession: clearEieSession,
        hasEieSession: hasEieSession,
        isAdminPayload: isAdminPayload,
        bridgeAfterApmathLogin: bridgeAfterApmathLogin,
        bridgeAfterEieLogin: bridgeAfterEieLogin
    };
})();
