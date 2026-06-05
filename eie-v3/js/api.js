// api.js — V3 API fetch wrapper
// window.V3Api = { getTimetable, getLatestImport }

(function () {
    const PROD_WORKER_ORIGIN = 'https://wangji-eie-os.js-pdf.workers.dev';

    function trimSlash(value) {
        return String(value || '').replace(/\/+$/, '');
    }

    function resolveApiBase() {
        if (window.EIE_API_BASE) return trimSlash(window.EIE_API_BASE);
        const meta = document.querySelector('meta[name="eie-api-base"]');
        if (meta && meta.content) return trimSlash(meta.content);
        if (window.location.origin && /workers\.dev$/i.test(window.location.hostname)) {
            return trimSlash(window.location.origin) + '/api/eie';
        }
        return PROD_WORKER_ORIGIN + '/api/eie';
    }

    function findStoredAuthHeader() {
        const keys = [
            'WANGJI_EIE_SESSION_TOKEN',
            'WANGJI_AUTH_HEADER',
            'WANGJI_AUTH_TOKEN',
            'WANGJI_SESSION_TOKEN',
            'teacher_session_token',
            'session_token'
        ];
        const ls = window.localStorage;
        if (!ls) return '';
        for (let i = 0; i < keys.length; i++) {
            const value = ls.getItem(keys[i]);
            if (!value) continue;
            const trimmed = String(value).trim();
            if (!trimmed) continue;
            if (/^(Bearer|Basic)\s+/i.test(trimmed)) return trimmed;
            return 'Bearer ' + trimmed;
        }
        return '';
    }

    function makeHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const auth = findStoredAuthHeader();
        if (auth) headers['Authorization'] = auth;
        return headers;
    }

    function normalizeError(error) {
        if (!error) return '요청을 처리하지 못했습니다.';
        if (typeof error === 'string') return error;
        return error.message || '요청을 처리하지 못했습니다.';
    }

    async function parseResponse(response) {
        const text = await response.text();
        if (!text) return null;
        try { return JSON.parse(text); } catch (e) { return { success: false, error: text }; }
    }

    async function get(path) {
        const base = resolveApiBase();
        const url = base + '/' + String(path || '').replace(/^\/+/, '');
        let response;
        try {
            response = await fetch(url, { method: 'GET', headers: makeHeaders() });
        } catch (e) {
            return { success: false, error: normalizeError(e), fallback: true, timetable_cells: [] };
        }
        const data = await parseResponse(response);
        if (response.status === 401) {
            const err = new Error('인증이 필요합니다.');
            err.status = 401;
            throw err;
        }
        if (!response.ok || (data && data.success === false)) {
            const msg = normalizeError((data && (data.error || data.message)) || response.statusText);
            return { success: false, error: msg, fallback: true, timetable_cells: [] };
        }
        return data || { success: true, timetable_cells: [] };
    }

    window.V3Api = {
        resolveApiBase: resolveApiBase,

        async getTimetable() {
            return get('timetable');
        },

        async getLatestImport() {
            return get('import/latest');
        }
    };
})();
