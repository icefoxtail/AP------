(function () {
    function previewSummary(preview) {
        if (!preview) return '';
        const summary = preview.summary || {};
        return `
            <div class="eie-summary-grid" aria-label="엑셀 파싱 요약">
                <div class="eie-summary-card"><span>시트</span><strong>${EieApp.escapeHtml(preview.sheet_name || '-')}</strong></div>
                <div class="eie-summary-card"><span>수업 셀</span><strong>${EieApp.escapeHtml(summary.timetable_cell_count || 0)}개</strong></div>
                <div class="eie-summary-card"><span>확인 필요</span><strong>${EieApp.escapeHtml(summary.needs_review_count || 0)}개</strong></div>
            </div>
        `;
    }

    function cellRows(preview) {
        const rows = Array.isArray(preview?.timetable_cells) ? preview.timetable_cells.slice(0, 8) : [];
        if (!rows.length) {
            return '<div class="eie-empty-box">아직 추출된 수업 셀이 없습니다.</div>';
        }
        return `
            <div class="eie-table-wrap">
                <table class="eie-table">
                    <thead>
                        <tr>
                            <th>교시</th>
                            <th>시간</th>
                            <th>수업명</th>
                            <th>선생님</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td>${EieApp.escapeHtml(row.period_label || '-')}</td>
                                <td>${EieApp.escapeHtml([row.start_time, row.end_time].filter(Boolean).join('~') || '-')}</td>
                                <td>${EieApp.escapeHtml(row.class_name_raw || '-')}</td>
                                <td>${EieApp.escapeHtml(row.teacher_name_raw || '확인 필요')}</td>
                                <td><span class="eie-status ${row.status === 'needs_review' ? 'is-warn' : 'is-ok'}">${EieApp.escapeHtml(row.status || '-')}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function sheetOptions(preview) {
        const sheets = Array.isArray(preview?.sheet_names) ? preview.sheet_names : [];
        if (!sheets.length) return '';
        return `
            <label class="eie-field-label" for="eie-sheet-select">감지된 시트</label>
            <select id="eie-sheet-select" class="eie-select" onchange="EieImportView.selectSheet(this.value)">
                ${sheets.map(name => `<option value="${EieApp.escapeHtml(name)}" ${name === preview.sheet_name ? 'selected' : ''}>${EieApp.escapeHtml(name)}</option>`).join('')}
            </select>
        `;
    }

    function renderImportPanel() {
        const state = EieState.get();
        const preview = state.importPreview;
        const result = state.importResult;
        const error = state.importError;
        return `
            <section aria-labelledby="eie-import-title">
                <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                <div class="eie-panel">
                    <p class="eie-dashboard-kicker">엑셀 가져오기</p>
                    <h1 id="eie-import-title" class="eie-panel-title">최신 영어 엑셀 가져오기</h1>
                    <p class="eie-panel-copy">브라우저에서 엑셀을 읽어 수업 셀만 미리 추출합니다. 학생/연락처 확정과 클래스룸 생성은 아직 실행하지 않습니다.</p>

                    <div class="eie-import-actions">
                        <label class="eie-file-button" for="eie-workbook-file">엑셀 파일 선택</label>
                        <input id="eie-workbook-file" class="eie-file-input" type="file" accept=".xlsx,.xls" onchange="EieImportView.handleFile(this.files && this.files[0])">
                        <button type="button" class="eie-primary-button" onclick="EieImportView.submitImport()" ${preview ? '' : 'disabled'}>${state.isImportBusy ? '저장 중...' : 'staging 저장'}</button>
                    </div>

                    ${sheetOptions(preview)}
                    ${error ? `<div class="eie-error-box">${EieApp.escapeHtml(error)}</div>` : ''}
                    ${result ? `<div class="eie-success-box">${EieApp.escapeHtml(result.message || 'import_session과 timetable_cells 저장 요청이 완료되었습니다.')}</div>` : ''}
                    ${previewSummary(preview)}
                    ${cellRows(preview)}

                    <div class="eie-empty-box">이번 라운드는 import_session과 timetable_cells 저장까지만 다룹니다. 학생/연락처 확정, classroom, 출석/숙제는 생성하지 않습니다.</div>
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
            try {
                const preview = await EieExcelParser.parseFile(file);
                EieState.setImportPreview(preview);
            } catch (error) {
                EieState.setImportError(error?.message || '엑셀 파일을 읽지 못했습니다.');
            }
            await remount();
        },
        async selectSheet(sheetName) {
            const state = EieState.get();
            EieState.setSelectedSheetName(sheetName);
            EieState.setImportError('시트 재선택은 다음 라운드에서 파일 재읽기와 함께 연결합니다. 현재는 자동 선택 시트 기준 미리보기만 사용합니다.');
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
            } catch (error) {
                EieState.setImportError(error?.message || 'staging 저장 요청에 실패했습니다.');
            } finally {
                EieState.setImportBusy(false);
                await remount();
            }
        }
    };
})();
