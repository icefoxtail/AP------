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

    function bootWhenReady() {
        if (!window.EieRouter || typeof window.EieRouter.boot !== 'function') return;
        window.EieRouter.boot();
    }

    window.EieApp = {
        escapeHtml,
        mount,
        renderPanel,
        fetchWithAuth
    };

    window.addEventListener('DOMContentLoaded', bootWhenReady);
})();
