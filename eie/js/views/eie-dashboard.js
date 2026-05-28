(function () {
    function escapeHtml(value) {
        if (window.EieApp?.escapeHtml) return window.EieApp.escapeHtml(value);
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch]));
    }

    function renderShortcut(label, color, onclick, active = false) {
        return `
            <button class="eie-admin-shortcut${active ? ' is-active' : ''}"
                    type="button"
                    style="color:${escapeHtml(color)};"
                    onclick="${onclick}">
                ${escapeHtml(label)}
            </button>
        `;
    }

    function render() {
        return `
            <section class="eie-admin-home" aria-labelledby="eie-admin-title">
                <div class="eie-admin-head">
                    <h3 id="eie-admin-title">운영센터</h3>
                    <span>원장님</span>
                </div>

                <div class="eie-admin-shortcuts" aria-label="EIE 관리 바로가기">
                    ${renderShortcut('AP Math', '#0f172a', "window.location.href='../apmath/index.html';")}
                    ${renderShortcut('EIE', '#16a34a', "EieRouter.open('dashboard')", true)}
                    ${renderShortcut('시간표', '#2563eb', "EieRouter.open('timetable')")}
                </div>

                <div class="eie-admin-section">
                    <div class="eie-admin-section-title-row">
                        <h3 class="eie-admin-section-title">EIE 관리</h3>
                    </div>
                    <div class="eie-admin-card-grid">
                        <button class="eie-admin-card" type="button" onclick="EieRouter.open('timetable')">
                            <span class="eie-admin-card-kicker">오늘 확인</span>
                            <strong>시간표</strong>
                            <small>26.04 시간표와 학생 배정을 확인합니다.</small>
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    window.EieDashboardView = { render };
})();
