(function () {
    function renderRows(rows, emptyText) {
        if (!rows.length) return `<div class="eie-empty-box">${EieApp.escapeHtml(emptyText)}</div>`;
        return `
            <div class="eie-table-wrap">
                <table class="eie-table">
                    <thead><tr><th>이름</th><th>학년</th><th>상태</th><th>메모</th></tr></thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td>${EieApp.escapeHtml(row.student_name_raw || row.name || '-')}</td>
                                <td>${EieApp.escapeHtml(row.grade_raw || '-')}</td>
                                <td>${EieApp.escapeHtml(row.match_status || row.status || '-')}</td>
                                <td>${EieApp.escapeHtml(row.memo_raw || '')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    window.EieStudentSeedsView = {
        async render() {
            const state = EieState.get();
            const importId = state.latestImport?.id;
            const studentResult = await EieApi.getStudentSeeds(importId);
            const contactResult = await EieApi.getContactSeeds(importId);
            const studentRows = Array.isArray(studentResult?.student_seeds) ? studentResult.student_seeds : [];
            const contactRows = Array.isArray(contactResult?.contact_seeds) ? contactResult.contact_seeds : [];
            EieState.setStudentSeeds(studentRows);
            EieState.setContactSeeds(contactRows);
            return `
                <section aria-labelledby="eie-seeds-title">
                    <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">학생 seed</p>
                        <h1 id="eie-seeds-title" class="eie-panel-title">학생·연락처 후보</h1>
                        <p class="eie-panel-copy">이번 라운드에서는 학생/연락처 확정을 실행하지 않습니다. 후보 목록 화면 연결만 준비합니다.</p>
                        <div class="eie-summary-grid">
                            <div class="eie-summary-card"><span>학생 후보</span><strong>${EieApp.escapeHtml(studentRows.length)}명</strong></div>
                            <div class="eie-summary-card"><span>연락처 후보</span><strong>${EieApp.escapeHtml(contactRows.length)}건</strong></div>
                        </div>
                        <h2 class="eie-subtitle">학생 후보</h2>
                        ${renderRows(studentRows, '아직 저장된 학생 후보가 없습니다. Round 4에서 검토 UI를 연결합니다.')}
                        <h2 class="eie-subtitle">연락처 후보</h2>
                        ${renderRows(contactRows, '아직 저장된 연락처 후보가 없습니다. Round 4 이후 검토합니다.')}
                    </div>
                </section>
            `;
        }
    };
})();
