(function () {
    const DAY_ORDER = ['월', '화', '수', '목', '금', '토', '일', ''];
    const STATUS_OPTIONS = ['active', 'needs_review', 'hidden', 'archived'];

    function asRows(result) {
        if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    function effectiveStatus(row) {
        if (row?.status === 'imported') return 'active';
        return row?.status || 'active';
    }

    function countStatus(rows, status) {
        return (Array.isArray(rows) ? rows : []).filter(row => effectiveStatus(row) === status).length;
    }

    function getRawMeta(row) {
        const value = row?.raw_meta_json;
        if (!value) return {};
        if (typeof value === 'object') return value;
        try { return JSON.parse(value); }
        catch (error) { return {}; }
    }

    function getStudentNames(row) {
        const meta = getRawMeta(row);
        const values = meta.student_names || meta.students || meta.studentSeeds || [];
        if (!Array.isArray(values)) return [];
        return values.map(item => {
            if (typeof item === 'string') return item;
            return item?.name || item?.student_name_raw || item?.studentName || '';
        }).filter(Boolean).slice(0, 18);
    }

    function sortRows(rows) {
        return [...(rows || [])].sort((a, b) => {
            const dayA = DAY_ORDER.indexOf(a.day_label || '');
            const dayB = DAY_ORDER.indexOf(b.day_label || '');
            const safeDayA = dayA >= 0 ? dayA : 99;
            const safeDayB = dayB >= 0 ? dayB : 99;
            if (safeDayA !== safeDayB) return safeDayA - safeDayB;
            const periodA = Number(a.period_order || String(a.period_label || '').replace(/\D/g, '') || 0);
            const periodB = Number(b.period_order || String(b.period_label || '').replace(/\D/g, '') || 0);
            if (periodA !== periodB) return periodA - periodB;
            return Number(a.column_index || 0) - Number(b.column_index || 0);
        });
    }

    function groupByPeriod(rows) {
        return sortRows(rows).reduce((groups, row) => {
            const key = `${row.day_label || '요일 미정'}|${row.period_label || '교시 미정'}|${row.start_time || ''}|${row.end_time || ''}`;
            if (!groups[key]) groups[key] = { row, rows: [] };
            groups[key].rows.push(row);
            return groups;
        }, {});
    }

    function renderSummary(rows) {
        const visibleRows = rows.filter(row => effectiveStatus(row) !== 'archived');
        const teacherCount = new Set(visibleRows.map(row => row.teacher_name_raw).filter(Boolean)).size;
        return `
            <div class="eie-summary-grid" aria-label="운영 시간표 요약">
                <div class="eie-summary-card"><span>전체 셀</span><strong>${EieApp.escapeHtml(visibleRows.length)}개</strong></div>
                <div class="eie-summary-card"><span>운영</span><strong>${EieApp.escapeHtml(countStatus(visibleRows, 'active'))}개</strong></div>
                <div class="eie-summary-card"><span>확인 필요</span><strong>${EieApp.escapeHtml(countStatus(visibleRows, 'needs_review'))}개</strong></div>
                <div class="eie-summary-card"><span>숨김</span><strong>${EieApp.escapeHtml(countStatus(rows, 'hidden'))}개</strong></div>
                <div class="eie-summary-card"><span>선생님</span><strong>${EieApp.escapeHtml(teacherCount)}명</strong></div>
                <div class="eie-summary-card"><span>수동 셀</span><strong>${EieApp.escapeHtml(visibleRows.filter(row => row.source_type === 'manual').length)}개</strong></div>
            </div>
        `;
    }

    function renderStudents(row) {
        const names = getStudentNames(row);
        if (!names.length) return '<div class="eie-cell-students is-empty">학생 후보는 다음 라운드에서 연결됩니다.</div>';
        return `
            <div class="eie-cell-students">
                ${names.map(name => `<button type="button" class="eie-student-chip" onclick="EieTimetableView.openStudentInfo('${EieApp.escapeHtml(row.id)}', '${EieApp.escapeHtml(name)}')">${EieApp.escapeHtml(name)}</button>`).join('')}
            </div>
        `;
    }

    function renderExcelGrid(rows) {
        if (!rows.length) return '<div class="eie-empty-box">운영 시간표 셀이 없습니다. 수업 추가 또는 엑셀 가져오기를 먼저 진행해 주세요.</div>';
        const groups = groupByPeriod(rows.filter(row => effectiveStatus(row) !== 'archived'));
        return Object.values(groups).map(group => {
            const head = group.row;
            return `
                <section class="eie-excel-period-row">
                    <div class="eie-excel-period-head">
                        <strong>${EieApp.escapeHtml(head.day_label || '-')} ${EieApp.escapeHtml(head.period_label || '-')}</strong>
                        <span>${EieApp.escapeHtml([head.start_time, head.end_time].filter(Boolean).join('~') || '시간 미정')}</span>
                    </div>
                    <div class="eie-excel-cells">
                        ${group.rows.map(row => {
                            const status = effectiveStatus(row);
                            return `
                                <article class="eie-excel-cell is-${EieApp.escapeHtml(status)} ${row.id === EieState.get().selectedTimetableCellId ? 'is-selected' : ''}">
                                    <button type="button" class="eie-cell-edit-trigger" onclick="EieTimetableView.selectCell('${EieApp.escapeHtml(row.id)}')" aria-label="수업 셀 수정">
                                        <span class="eie-cell-title">${EieApp.escapeHtml(row.class_name_raw || '수업명 없음')}</span>
                                        <span class="eie-cell-teacher">${EieApp.escapeHtml(row.teacher_name_raw || '선생님 확인')}</span>
                                        <span class="eie-status ${status === 'needs_review' ? 'is-warn' : status === 'hidden' ? 'is-muted' : 'is-ok'}">${EieApp.escapeHtml(status)}</span>
                                    </button>
                                    ${renderStudents(row)}
                                    <div class="eie-cell-meta">컬럼 ${EieApp.escapeHtml(row.column_index ?? '-')} · ${EieApp.escapeHtml(row.source_type || 'import')}</div>
                                </article>
                            `;
                        }).join('')}
                    </div>
                </section>
            `;
        }).join('');
    }

    function renderStatusOptions(selected) {
        return STATUS_OPTIONS.map(status => `<option value="${EieApp.escapeHtml(status)}" ${effectiveStatus({ status: selected }) === status ? 'selected' : ''}>${EieApp.escapeHtml(status)}</option>`).join('');
    }

    function renderEditor() {
        const state = EieState.get();
        const mode = state.timetableEditMode;
        if (!mode) return '';
        const cell = mode === 'new' ? {} : (EieState.getSelectedTimetableCell() || {});
        const title = mode === 'new' ? '수업 셀 추가' : '수업 셀 수정';
        return `
            <aside class="eie-editor-panel" aria-label="${EieApp.escapeHtml(title)}">
                <div class="eie-editor-head">
                    <h2>${EieApp.escapeHtml(title)}</h2>
                    <button type="button" class="eie-icon-button" onclick="EieTimetableView.closeEditor()">닫기</button>
                </div>
                <form class="eie-edit-form" onsubmit="EieTimetableView.submitCellForm(event, '${EieApp.escapeHtml(mode)}', '${EieApp.escapeHtml(cell.id || '')}')">
                    <label>요일<input name="day_label" value="${EieApp.escapeHtml(cell.day_label || '')}" placeholder="월" /></label>
                    <label>교시<input name="period_label" value="${EieApp.escapeHtml(cell.period_label || '')}" placeholder="1교시" /></label>
                    <label>시작 시간<input name="start_time" value="${EieApp.escapeHtml(cell.start_time || '')}" placeholder="15:10" /></label>
                    <label>종료 시간<input name="end_time" value="${EieApp.escapeHtml(cell.end_time || '')}" placeholder="15:50" /></label>
                    <label>수업명<input name="class_name_raw" value="${EieApp.escapeHtml(cell.class_name_raw || '')}" placeholder="RS3-1" /></label>
                    <label>선생님<input name="teacher_name_raw" value="${EieApp.escapeHtml(cell.teacher_name_raw || '')}" placeholder="Carmen" /></label>
                    <label>교실<input name="room_raw" value="${EieApp.escapeHtml(cell.room_raw || '')}" placeholder="" /></label>
                    <label>학생 수<input name="student_count" type="number" min="0" value="${EieApp.escapeHtml(cell.student_count ?? 0)}" /></label>
                    <label>상태<select name="status">${renderStatusOptions(cell.status || 'active')}</select></label>
                    <label class="is-wide">메모<textarea name="memo" rows="3" placeholder="운영 메모">${EieApp.escapeHtml(cell.memo || '')}</textarea></label>
                    <div class="eie-action-row">
                        <button type="submit" class="eie-primary-button">저장</button>
                        ${cell.id ? `<button type="button" class="eie-secondary-button" onclick="EieTimetableView.setStatus('${EieApp.escapeHtml(cell.id)}', 'hidden')">숨김</button>` : ''}
                        ${cell.id ? `<button type="button" class="eie-secondary-button" onclick="EieTimetableView.setStatus('${EieApp.escapeHtml(cell.id)}', 'needs_review')">보류</button>` : ''}
                    </div>
                    <div class="eie-api-note">학생/연락처 확정, classroom, 출석/숙제는 아직 생성하지 않습니다.</div>
                </form>
            </aside>
        `;
    }

    function formToPayload(form) {
        const data = new FormData(form);
        return {
            day_label: String(data.get('day_label') || '').trim(),
            period_label: String(data.get('period_label') || '').trim(),
            start_time: String(data.get('start_time') || '').trim(),
            end_time: String(data.get('end_time') || '').trim(),
            class_name_raw: String(data.get('class_name_raw') || '').trim(),
            teacher_name_raw: String(data.get('teacher_name_raw') || '').trim(),
            room_raw: String(data.get('room_raw') || '').trim(),
            student_count: Number(data.get('student_count') || 0),
            status: String(data.get('status') || 'active').trim(),
            memo: String(data.get('memo') || '').trim()
        };
    }

    function asSavedCell(result) {
        return result?.timetable_cell || result?.data || null;
    }

    async function loadTimetable() {
        const state = EieState.get();
        const result = await EieApi.getTimetable(null, { status: state.timetableStatusFilter });
        const rows = asRows(result);
        EieState.setTimetableCells(rows);
        return { rows, result };
    }

    window.EieTimetableView = {
        async render() {
            EieState.setTimetableBusy(true);
            let rows = EieState.get().timetableCells;
            let error = '';
            try {
                const loaded = await loadTimetable();
                rows = loaded.rows;
                if (loaded.result?.fallback) error = loaded.result.error || '원격 API 응답을 불러오지 못해 로컬 상태를 표시합니다.';
            } catch (loadError) {
                error = loadError?.message || '운영 시간표를 불러오지 못했습니다.';
            } finally {
                EieState.setTimetableBusy(false);
            }
            const state = EieState.get();
            return `
                <section aria-labelledby="eie-timetable-title">
                    <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">EIE 운영 시간표</p>
                        <h1 id="eie-timetable-title" class="eie-panel-title">엑셀형 운영 시간표</h1>
                        <p class="eie-panel-copy">엑셀에서 가져온 셀과 수동 추가 셀을 운영 시간표로 수정합니다. 셀에는 학생 이름만 표시하고 전화번호는 학생 상세 단계에서만 다룹니다.</p>
                        <div class="eie-action-row">
                            <button type="button" class="eie-primary-button" onclick="EieTimetableView.newCell()">수업 추가</button>
                            <button type="button" class="eie-secondary-button" onclick="EieRouter.open('import')">엑셀 가져오기</button>
                            <button type="button" class="eie-secondary-button" onclick="EieRouter.open('timetable')">새로고침</button>
                        </div>
                        ${state.timetableNotice ? `<div class="eie-notice-box">${EieApp.escapeHtml(state.timetableNotice)}</div>` : ''}
                        ${state.timetableError || error ? `<div class="eie-error-box">${EieApp.escapeHtml(state.timetableError || error)}</div>` : ''}
                        ${renderSummary(rows)}
                        <div class="eie-timetable-layout">
                            <div class="eie-timetable-main">
                                ${renderExcelGrid(rows)}
                            </div>
                            ${renderEditor()}
                        </div>
                        <div class="eie-empty-box">Round 4는 운영 시간표 셀 추가/수정/상태 변경까지만 다룹니다. 학생/연락처 확정, classroom, 출석/숙제는 생성하지 않습니다.</div>
                    </div>
                </section>
            `;
        },
        selectCell(cellId) {
            EieState.selectTimetableCell(cellId);
            EieRouter.open('timetable');
        },
        newCell() {
            EieState.startNewTimetableCell();
            EieRouter.open('timetable');
        },
        closeEditor() {
            EieState.closeTimetableEditor();
            EieRouter.open('timetable');
        },
        async submitCellForm(event, mode, cellId) {
            event.preventDefault();
            const payload = formToPayload(event.currentTarget);
            try {
                const result = mode === 'new'
                    ? await EieApi.createTimetableCell(payload)
                    : await EieApi.updateTimetableCell(cellId, payload);
                const saved = asSavedCell(result);
                if (saved) EieState.upsertTimetableCell(saved);
                EieState.setTimetableNotice('운영 시간표 셀을 저장했습니다.');
            } catch (error) {
                EieState.setTimetableError(error?.message || '수업 셀을 저장하지 못했습니다.');
            }
            EieRouter.open('timetable');
        },
        async setStatus(cellId, status) {
            try {
                const result = await EieApi.updateTimetableCellStatus(cellId, status);
                const saved = asSavedCell(result);
                if (saved) EieState.upsertTimetableCell(saved);
                EieState.setTimetableNotice(`상태를 ${status}로 변경했습니다.`);
            } catch (error) {
                EieState.setTimetableError(error?.message || '상태를 변경하지 못했습니다.');
            }
            EieRouter.open('timetable');
        },
        openStudentInfo(cellId, studentName) {
            EieState.selectTimetableCell(cellId);
            EieState.setTimetableNotice(`${studentName} 학생 정보는 다음 라운드에서 학생 상세 패널로 연결합니다. 전화번호는 시간표 셀에 노출하지 않습니다.`);
            EieRouter.open('timetable');
        }
    };
})();
