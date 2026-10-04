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
                    <div class="eie-api-note">${escapeHtml(note)}</div>
                    <div class="eie-empty-box">이번 라운드에서는 실제 파서, 업로드, seed 자동 생성을 실행하지 않습니다.</div>
                </div>
            </section>
        `;
    }

    window.EieApp = {
        escapeHtml,
        mount,
        renderPanel
    };

    window.addEventListener('DOMContentLoaded', () => {
        EieRouter.boot();
    });
})();
