// main.js — 진입점. 탭 상태, fetch, render 조율
// read-only. POST/PATCH/DELETE 없음.

(function () {
    const state = {
        blocks: [],
        selectedDay: 'all',
        loading: false,
        error: ''
    };

    function getAppEl() {
        return document.getElementById('v3-app');
    }

    function showLoading() {
        const el = getAppEl();
        if (el) el.innerHTML = '<div class="v3-loading">불러오는 중...</div>';
    }

    function showError(msg) {
        const el = getAppEl();
        if (el) el.innerHTML = '<div class="v3-error">' + escHtml(msg || '오류가 발생했습니다.') + '</div>';
    }

    function escHtml(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
        });
    }

    function render() {
        const el = getAppEl();
        if (!el) return;

        if (state.loading) { showLoading(); return; }
        if (state.error) { showError(state.error); return; }

        let html = '';
        try {
            if (state.selectedDay === 'all') {
                const vm = window.V3DayViewBuilder.buildAllView(state.blocks);
                html = window.V3Renderer.renderAllView(vm);
            } else {
                const vm = window.V3DayViewBuilder.buildDayView(state.blocks, state.selectedDay);
                html = window.V3Renderer.renderDayView(vm);
            }
        } catch (e) {
            html = '<div class="v3-error">렌더링 오류: ' + escHtml(e && e.message || String(e)) + '</div>';
        }

        el.innerHTML = html;
    }

    function setActiveTab(day) {
        const tabs = document.querySelectorAll('#v3-day-tabs .v3-tab');
        tabs.forEach(function (tab) {
            if (tab.getAttribute('data-day') === day) {
                tab.classList.add('is-active');
            } else {
                tab.classList.remove('is-active');
            }
        });
    }

    function bindTabs() {
        const nav = document.getElementById('v3-day-tabs');
        if (!nav) return;
        nav.addEventListener('click', function (e) {
            const btn = e.target.closest('.v3-tab');
            if (!btn) return;
            const day = btn.getAttribute('data-day');
            if (!day || day === state.selectedDay) return;
            state.selectedDay = day;
            setActiveTab(day);
            render();
        });
    }

    async function init() {
        state.loading = true;
        state.error = '';
        showLoading();

        try {
            const result = await window.V3Api.getTimetable();
            const cells = (result && result.timetable_cells) || [];
            state.blocks = window.V3BlockBuilder.buildBlocks(cells);
            if (result && result.fallback && result.error) {
                state.error = 'API 오류: ' + result.error;
            }
        } catch (e) {
            if (e && e.status === 401) {
                state.error = '로그인이 필요합니다. V2에서 먼저 로그인해 주세요.';
            } else {
                state.error = (e && e.message) || '데이터를 불러오지 못했습니다.';
            }
        } finally {
            state.loading = false;
        }

        render();
    }

    document.addEventListener('DOMContentLoaded', function () {
        bindTabs();
        init();
    });
})();
