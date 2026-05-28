(function () {
    const cards = [
        {
            route: 'timetable',
            title: '영어 시간표',
            copy: '엑셀에서 추출한 수업 셀을 미리 확인합니다.',
            cta: '시간표 보기'
        },
        {
            route: 'import',
            title: '엑셀 가져오기',
            copy: '최신 영어 엑셀을 읽고 staging 저장 요청을 준비합니다.',
            cta: '엑셀 선택'
        },
        {
            route: 'student-seeds',
            title: '학생 후보',
            copy: '학생·연락처 후보를 확인하고 EIE 전용 확정을 진행합니다.',
            cta: '확정 관리'
        }
    ];

    function cardHtml(card) {
        return `
            <button type="button" class="eie-card" onclick="EieRouter.open('${card.route}')">
                <span class="eie-card-label">EIE</span>
                <span class="eie-card-title">${EieApp.escapeHtml(card.title)}</span>
                <span class="eie-card-copy">${EieApp.escapeHtml(card.copy)}</span>
                <span class="eie-card-cta">${EieApp.escapeHtml(card.cta)}</span>
            </button>
        `;
    }

    window.EieDashboardView = {
        render() {
            return `
                <section aria-labelledby="eie-dashboard-title">
                    <div class="eie-dashboard-head">
                        <p class="eie-dashboard-kicker">EIE 영어관</p>
                        <h1 id="eie-dashboard-title" class="eie-dashboard-title">EIE 운영 준비</h1>
                        <p class="eie-dashboard-summary">EIE 영어관은 독립 운영 앱입니다. APMS 구조를 상위 기준으로 삼지 않고 엑셀 기반 import 흐름부터 분리합니다.</p>
                    </div>
                    <div class="eie-dashboard-grid">
                        ${cards.map(cardHtml).join('')}
                    </div>
                </section>
            `;
        }
    };
})();
