(function () {
    function getRowsFromStateOrApiResult(result) {
        const stateRows = EieState.get().timetableCells;
        if (Array.isArray(stateRows) && stateRows.length) return stateRows;
        if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    function groupRows(rows) {
        return rows.reduce((groups, row) => {
            const key = `${row.day_label || '요일 미정'} · ${row.period_label || '교시 미정'}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
            return groups;
        }, {});
    }

    function renderGroups(rows) {
        if (!rows.length) {
            return '<div class="eie-empty-box">아직 가져온 영어 시간표가 없습니다. 엑셀 가져오기에서 최신 영어 엑셀을 먼저 읽어 주세요.</div>';
        }
        const groups = groupRows(rows);
        return Object.keys(groups).map(key => `
            <section class="eie-timetable-group">
                <h2 class="eie-subtitle">${EieApp.escapeHtml(key)}</h2>
                <div class="eie-cell-grid">
                    ${groups[key].map(row => `
                        <article class="eie-cell-card ${row.status === 'needs_review' ? 'is-warn' : ''}">
                            <div class="eie-cell-topline">
                                <strong>${EieApp.escapeHtml(row.class_name_raw || '수업명 확인 필요')}</strong>
                                <span class="eie-status ${row.status === 'needs_review' ? 'is-warn' : 'is-ok'}">${EieApp.escapeHtml(row.status || '-')}</span>
                            </div>
                            <p>${EieApp.escapeHtml([row.start_time, row.end_time].filter(Boolean).join('~') || '시간 미정')}</p>
                            <p>선생님: ${EieApp.escapeHtml(row.teacher_name_raw || '확인 필요')}</p>
                            <p>컬럼: ${EieApp.escapeHtml(row.column_index ?? '-')}</p>
                        </article>
                    `).join('')}
                </div>
            </section>
        `).join('');
    }

    window.EieTimetableView = {
        async render() {
            const result = await EieApi.getTimetable(EieState.get().latestImport?.id);
            const rows = getRowsFromStateOrApiResult(result);
            EieState.setTimetableCells(rows);
            return `
                <section aria-labelledby="eie-timetable-title">
                    <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">영어 시간표</p>
                        <h1 id="eie-timetable-title" class="eie-panel-title">수업 셀 미리보기</h1>
                        <p class="eie-panel-copy">엑셀에서 추출한 timetable_cell을 확인합니다. 학생/연락처 확정과 classroom 생성은 아직 실행하지 않습니다.</p>
                        <div class="eie-api-note">표시 수업 셀: ${EieApp.escapeHtml(rows.length)}개</div>
                        ${renderGroups(rows)}
                    </div>
                </section>
            `;
        }
    };
})();
