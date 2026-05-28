(function () {
    function countStatus(rows, status) {
        return (Array.isArray(rows) ? rows : []).filter(row => row?.status === status).length;
    }

    function getPreviewRows(preview) {
        return Array.isArray(preview?.timetable_cells) ? preview.timetable_cells : [];
    }

    function renderSummaryCards({ sheetName, sourceMonth, fileName, rows, latestImport }) {
        const cellCount = rows.length;
        const needsReviewCount = countStatus(rows, 'needs_review');
        const importedCount = countStatus(rows, 'imported');
        return `
            <div class="eie-summary-grid" aria-label="가져오기 요약">
                <div class="eie-summary-card"><span>시트</span><strong>${EieApp.escapeHtml(sheetName || latestImport?.sheet_name || '-')}</strong></div>
                <div class="eie-summary-card"><span>월</span><strong>${EieApp.escapeHtml(sourceMonth || latestImport?.source_month || '-')}</strong></div>
                <div class="eie-summary-card"><span>수업 셀</span><strong>${EieApp.escapeHtml(cellCount)}개</strong></div>
                <div class="eie-summary-card"><span>정상</span><strong>${EieApp.escapeHtml(importedCount)}개</strong></div>
                <div class="eie-summary-card"><span>확인 필요</span><strong>${EieApp.escapeHtml(needsReviewCount)}개</strong></div>
                <div class="eie-summary-card"><span>파일</span><strong>${EieApp.escapeHtml(fileName || latestImport?.file_name || '-')}</strong></div>
            </div>
        `;
    }

    function renderSheetInfo(preview) {
        const sheets = Array.isArray(preview?.sheet_names) ? preview.sheet_names : [];
        if (!sheets.length) return '';
        return `
            <div class="eie-inline-note">
                감지된 시트 ${EieApp.escapeHtml(sheets.length)}개 중 자동 선택 시트는 <strong>${EieApp.escapeHtml(preview.sheet_name || '-')}</strong>입니다.
                시트 수동 재선택은 다음 라운드에서 파일 재읽기와 함께 연결합니다.
            </div>
            <select id="eie-sheet-select" class="eie-select" disabled aria-label="감지된 시트">
                ${sheets.map(name => `<option value="${EieApp.escapeHtml(name)}" ${name === preview.sheet_name ? 'selected' : ''}>${EieApp.escapeHtml(name)}</option>`).join('')}
            </select>
        `;
    }

    function cellRows(preview) {
        const rows = getPreviewRows(preview).slice(0, 12);
        if (!rows.length) return '<div class="eie-empty-box">아직 추출된 수업 셀이 없습니다.</div>';
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
                                <td>${EieApp.escapeHtml(row.column_index ?? '-')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderResult(result, rows) {
        if (!result) return '';
        const latest = result.latest_import || result.import_session || result.data || {};
        return `
            <div class="eie-success-box">
                ${EieApp.escapeHtml(result.message || 'import_session과 timetable_cells 저장 요청이 완료되었습니다.')}
            </div>
            <div class="eie-action-row">
                <button type="button" class="eie-primary-button" onclick="EieRouter.open('timetable')">시간표 미리보기</button>
                <span class="eie-muted-text">저장 ID: ${EieApp.escapeHtml(latest.id || '-')} · 저장된 셀 ${EieApp.escapeHtml(rows.length)}개</span>
            </div>
        `;
    }

    function renderImportPanel() {
        const state = EieState.get();
        const preview = state.importPreview;
        const result = state.importResult;
        const error = state.importError;
        const notice = state.importNotice;
        const rows = getPreviewRows(preview);
        const latest = state.latestImport;
        return `
            <section aria-labelledby="eie-import-title">
                <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                <div class="eie-panel">
                    <p class="eie-dashboard-kicker">엑셀 가져오기</p>
                    <h1 id="eie-import-title" class="eie-panel-title">최신 영어 엑셀 가져오기</h1>
                    <p class="eie-panel-copy">엑셀을 읽어 import_session과 timetable_cells만 저장합니다. 학생/연락처 확정, classroom, 출석/숙제는 생성하지 않습니다.</p>

                    <div class="eie-import-actions">
                        <label class="eie-file-button" for="eie-workbook-file">엑셀 파일 선택</label>
                        <input id="eie-workbook-file" class="eie-file-input" type="file" accept=".xlsx,.xls" onchange="EieImportView.handleFile(this.files && this.files[0])">
                        <button type="button" class="eie-primary-button" onclick="EieImportView.submitImport()" ${preview && !state.isImportBusy ? '' : 'disabled'}>${state.isImportBusy ? '저장 중...' : 'staging 저장'}</button>
                        <button type="button" class="eie-secondary-button" onclick="EieImportView.reset()">초기화</button>
                    </div>

                    ${renderSheetInfo(preview)}
                    ${error ? `<div class="eie-error-box">${EieApp.escapeHtml(error)}</div>` : ''}
                    ${notice ? `<div class="eie-api-note">${EieApp.escapeHtml(notice)}</div>` : ''}
                    ${renderResult(result, state.timetableCells)}
                    ${preview ? renderSummaryCards({ sheetName: preview.sheet_name, sourceMonth: preview.source_month, fileName: preview.file_name, rows, latestImport: latest }) : '<div class="eie-empty-box">엑셀 파일을 선택하면 파싱 요약과 수업 셀 미리보기가 표시됩니다.</div>'}
                    ${preview ? '<h2 class="eie-subtitle">추출 수업 셀 미리보기</h2>' : ''}
                    ${preview ? cellRows(preview) : ''}

                    <div class="eie-empty-box">이번 라운드는 import 결과 미리보기와 needs_review 표시까지만 다룹니다. 학생/연락처 확정, classroom, 출석/숙제는 다음 라운드 이후입니다.</div>
                </div>
            </section>
        `;
    }

    async function remount() {
        await EieApp.mount(renderImportPanel());
    }

    window.EieImportView = {
        async render() {
            return renderImportPanel();
        },
        async handleFile(file) {
            EieState.setImportResult(null);
            EieState.setImportError('');
            EieState.setImportNotice('');
            try {
                const preview = await EieExcelParser.parseFile(file);
                EieState.setImportPreview(preview);
            } catch (error) {
                EieState.setImportError(error?.message || '엑셀 파일을 읽지 못했습니다.');
            }
            await remount();
        },
        async submitImport() {
            const state = EieState.get();
            const preview = state.importPreview;
            if (!preview) {
                EieState.setImportError('먼저 엑셀 파일을 선택해 주세요.');
                await remount();
                return;
            }
            EieState.setImportBusy(true);
            EieState.setImportError('');
            EieState.setImportNotice('');
            EieState.setImportResult(null);
            await remount();
            try {
                const result = await EieApi.createImport({
                    import_session: preview.import_session,
                    timetable_cells: preview.timetable_cells,
                    overwrite: false
                });
                EieState.setImportResult(result);
                if (Array.isArray(result?.timetable_cells)) EieState.setTimetableCells(result.timetable_cells);
                EieState.setImportNotice('저장 후 시간표 미리보기에서 import 결과를 확인할 수 있습니다.');
            } catch (error) {
                EieState.setImportError(error?.message || 'staging 저장 요청에 실패했습니다.');
            } finally {
                EieState.setImportBusy(false);
                await remount();
            }
        },
        async reset() {
            EieState.resetImportPreview();
            await remount();
        }
    };
})();
