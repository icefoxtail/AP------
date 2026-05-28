(function () {
    function asRows(result) {
        if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    function countStatus(rows, status) {
        return (Array.isArray(rows) ? rows : []).filter(row => row?.status === status).length;
    }

    function groupRows(rows) {
        return rows.reduce((groups, row) => {
            const key = `${row.day_label || '요일 미정'} · ${row.period_label || '교시 미정'}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(row);
            return groups;
        }, {});
    }

    function renderImportSummary(latest, rows) {
        return `
            <div class="eie-summary-grid" aria-label="시간표 import 요약">
                <div class="eie-summary-card"><span>시트</span><strong>${EieApp.escapeHtml(latest?.sheet_name || '-')}</strong></div>
                <div class="eie-summary-card"><span>월</span><strong>${EieApp.escapeHtml(latest?.source_month || '-')}</strong></div>
                <div class="eie-summary-card"><span>수업 셀</span><strong>${EieApp.escapeHtml(rows.length)}개</strong></div>
                <div class="eie-summary-card"><span>정상</span><strong>${EieApp.escapeHtml(countStatus(rows, 'imported'))}개</strong></div>
                <div class="eie-summary-card"><span>확인 필요</span><strong>${EieApp.escapeHtml(countStatus(rows, 'needs_review'))}개</strong></div>
                <div class="eie-summary-card"><span>파일</span><strong>${EieApp.escapeHtml(latest?.file_name || '-')}</strong></div>
            </div>
        `;
    }

    function renderTable(rows) {
        if (!rows.length) return '<div class="eie-empty-box">아직 가져온 영어 시간표가 없습니다. 엑셀 가져오기에서 최신 영어 엑셀을 먼저 읽어 주세요.</div>';
        return `
            <div class="eie-table-wrap">
                <table class="eie-table">
                    <thead>
                        <tr>
                            <th>상태</th>
                            <th>요일</th>
                            <th>교시</th>
                            <th>시간</th>
                            <th>수업명</th>
                            <th>선생님</th>
                            <th>학생수</th>
                            <th>컬럼</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr class="${row.status === 'needs_review' ? 'is-needs-review' : ''}">
                                <td><span class="eie-status ${row.status === 'needs_review' ? 'is-warn' : 'is-ok'}">${EieApp.escapeHtml(row.status || '-')}</span></td>
                                <td>${EieApp.escapeHtml(row.day_label || '-')}</td>
                                <td>${EieApp.escapeHtml(row.period_label || '-')}</td>
                                <td>${EieApp.escapeHtml([row.start_time, row.end_time].filter(Boolean).join('~') || '-')}</td>
                                <td>${EieApp.escapeHtml(row.class_name_raw || '-')}</td>
                                <td>${EieApp.escapeHtml(row.teacher_name_raw || '확인 필요')}</td>
                                <td>${EieApp.escapeHtml(row.student_count ?? 0)}</td>
                                <td>${EieApp.escapeHtml(row.column_index ?? '-')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderGroups(rows) {
        if (!rows.length) return '';
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
                            <p>학생수: ${EieApp.escapeHtml(row.student_count ?? 0)}명 · 컬럼 ${EieApp.escapeHtml(row.column_index ?? '-')}</p>
                        </article>
                    `).join('')}
                </div>
            </section>
        `).join('');
    }

    async function loadTimetable() {
        const state = EieState.get();
        let latest = state.latestImport;
        if (!latest?.id) {
            const latestResult = await EieApi.getLatestImport();
            latest = latestResult?.latest_import || latestResult?.data || null;
            EieState.setLatestImport(latest);
        }
        const result = await EieApi.getTimetable(latest?.id);
        const rows = asRows(result);
        EieState.setTimetableCells(rows);
        EieState.setLastLoadedImportId(latest?.id || '');
        return { latest, rows, result };
    }

    window.EieTimetableView = {
        async render() {
            EieState.setTimetableBusy(true);
            let latest = EieState.get().latestImport;
            let rows = EieState.get().timetableCells;
            let error = '';
            try {
                const loaded = await loadTimetable();
                latest = loaded.latest;
                rows = loaded.rows;
                if (loaded.result?.fallback) error = loaded.result.error || '원격 API 응답을 불러오지 못해 로컬 상태를 표시합니다.';
            } catch (loadError) {
                error = loadError?.message || '시간표 미리보기를 불러오지 못했습니다.';
            } finally {
                EieState.setTimetableBusy(false);
            }
            return `
                <section aria-labelledby="eie-timetable-title">
                    <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">영어 시간표</p>
                        <h1 id="eie-timetable-title" class="eie-panel-title">import 결과 미리보기</h1>
                        <p class="eie-panel-copy">저장된 import_session의 timetable_cells를 확인합니다. needs_review 셀은 강조 표시됩니다.</p>
                        <div class="eie-action-row">
                            <button type="button" class="eie-secondary-button" onclick="EieRouter.open('import')">엑셀 가져오기</button>
                            <button type="button" class="eie-secondary-button" onclick="EieRouter.open('timetable')">새로고침</button>
                        </div>
                        ${error ? `<div class="eie-error-box">${EieApp.escapeHtml(error)}</div>` : ''}
                        ${renderImportSummary(latest, rows)}
                        <h2 class="eie-subtitle">수업 셀 목록</h2>
                        ${renderTable(rows)}
                        <h2 class="eie-subtitle">교시별 카드 보기</h2>
                        ${renderGroups(rows)}
                        <div class="eie-empty-box">이번 라운드는 import 결과 미리보기와 needs_review 표시까지만 다룹니다. 학생/연락처 확정, classroom, 출석/숙제는 생성하지 않습니다.</div>
                    </div>
                </section>
            `;
        }
    };
})();
