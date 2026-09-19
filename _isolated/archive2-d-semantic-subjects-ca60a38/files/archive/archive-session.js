/* Existing Archive session handoff, shared by both entry pages. */
function sanitizeApmathSessionForStorage(data) {
    const safe = { ...(data || {}) };
    delete safe.raw_password;
    delete safe.password;
    delete safe.pw;
    return safe;
}

function saveApmathSession(data) {
    localStorage.setItem('APMATH_SESSION', JSON.stringify(sanitizeApmathSessionForStorage(data)));
}

function restoreApmathSessionFromHash() {
    const hash = window.location.hash || '';
    const match = /[#&]apmsess=([^&]+)/.exec(hash);
    if (!match) return false;
    try {
        const incoming = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(match[1])))));
        if (incoming && (incoming.session_token || incoming.login_id)) {
            let existing = null;
            try { existing = JSON.parse(localStorage.getItem('APMATH_SESSION') || 'null'); } catch (e) {}
            // 이미 사용 가능한 세션 토큰이 있으면 덮어쓰지 않는다.
            const session = {
                ...(existing || {}),
                ...incoming,
                login_id: incoming.login_id || incoming.loginId || (existing && (existing.login_id || existing.loginId)) || '',
                id: incoming.id || (existing && existing.id) || '',
                name: incoming.name || (existing && existing.name) || '',
                role: incoming.role || (existing && existing.role) || '',
                session_token: incoming.session_token || (existing && existing.session_token) || '',
                expires_at: incoming.expires_at || (existing && existing.expires_at) || '',
                restored_from_archive_hash: true,
                restored_at: new Date().toISOString()
            };
            saveApmathSession(session);
            return true;
        }
    } catch (e) {
        // 잘못된 페이로드는 무시한다.
    } finally {
        // 토큰이 주소창/히스토리에 남지 않도록 해시를 제거한다.
        try {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {}
    }
    return false;
}

restoreApmathSessionFromHash();
