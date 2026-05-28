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
                <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                <div class="eie-panel">
                    <p class="eie-dashboard-kicker">준비 화면</p>
                    <h1 id="eie-panel-title" class="eie-panel-title">${escapeHtml(title)}</h1>
                    <p class="eie-panel-copy">${escapeHtml(copy)}</p>
                    ${note ? `<div class="eie-api-note">${escapeHtml(note)}</div>` : ''}
                    <div class="eie-empty-box">학생/연락처 확정, classroom, 출석/숙제는 아직 실행하지 않습니다.</div>
                </div>
            </section>
        `;
    }

    function bootWhenReady() {
        if (!window.EieRouter || typeof window.EieRouter.boot !== 'function') return;
        window.EieRouter.boot();
    }

    window.EieApp = {
        escapeHtml,
        mount,
        renderPanel
    };

    window.addEventListener('DOMContentLoaded', bootWhenReady);
})();
