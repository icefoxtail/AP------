(function () {
    const cards = [
        {
            route: 'timetable',
            title: '영어 시간표',
            copy: '최신 영어 시간표를 가져오면 여기에 표시합니다.',
            cta: '시간표 준비 화면'
        },
        {
            route: 'import',
            title: '엑셀 가져오기',
            copy: '다음 라운드에서 최신 영어 엑셀 가져오기를 연결합니다.',
            cta: '가져오기 준비 화면'
        },
        {
            route: 'student-seeds',
            title: '학생 seed',
            copy: '시간표에서 추출한 학생 후보 정보가 여기에 표시됩니다.',
            cta: '학생 seed 준비 화면'
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
                        <p class="eie-dashboard-summary">EIE 영어관은 독립 운영 앱입니다. 이번 라운드에서는 구조와 준비 화면만 고정합니다.</p>
                    </div>
                    <div class="eie-dashboard-grid">
                        ${cards.map(cardHtml).join('')}
                    </div>
                </section>
            `;
        }
    };
})();
