(function () {
    function esc(value) {
        if (window.EieApp?.escapeHtml) return window.EieApp.escapeHtml(value);
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function render() {
        return `
            <section class="eie-admin-home" aria-labelledby="eie-admin-title">
                <div class="eie-admin-head">
                    <h3 id="eie-admin-title">EIE 영어 관리</h3>
                    <span>원장님</span>
                </div>

                <div class="eie-admin-shortcuts" aria-label="앱 전환">
                    <button class="eie-admin-shortcut" type="button"
                            style="color:#0f172a;"
                            onclick="window.location.href='../apmath/index.html'">AP MATH</button>
                    <button class="eie-admin-shortcut is-active" type="button"
                            data-eie-route="dashboard"
                            onclick="EieRouter.open('dashboard')">EIE</button>
                </div>

                <div class="eie-admin-section">
                    <div class="eie-admin-section-title-row">
                        <h3 class="eie-admin-section-title">EIE 관리</h3>
                    </div>
                    <div class="eie-admin-card-grid">
                        <button class="eie-admin-card" type="button"
                                onclick="EieRouter.open('timetable')">
                            <span class="eie-admin-card-kicker">26.04 · 31개 수업</span>
                            <strong>시간표</strong>
                            <small>EIE 시간표 원장 확인용</small>
                        </button>
                        <button class="eie-admin-card" type="button"
                                onclick="EieRouter.open('students')">
                            <span class="eie-admin-card-kicker">209명 등록</span>
                            <strong>학생관리</strong>
                            <small>확정된 EIE 학생 목록 · 전화번호 상세</small>
                        </button>
                        <button class="eie-admin-card" type="button"
                                onclick="EieRouter.open('classroom')">
                            <span class="eie-admin-card-kicker">211개 배정</span>
                            <strong>클래스룸</strong>
                            <small>수업 셀 기반 수업 운영 확인</small>
                        </button>
                        <button class="eie-admin-card" type="button"
                                onclick="EieRouter.open('management')">
                            <span class="eie-admin-card-kicker">설정</span>
                            <strong>관리</strong>
                            <small>EIE 운영 설정 (준비 중)</small>
                        </button>
                    </div>
                </div>
            </section>
        `;
    }

    window.EieDashboardView = { render };
})();
