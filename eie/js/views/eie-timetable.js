(function () {
    function esc(value) {
        return EieApp.escapeHtml(value);
    }

    function jsArg(value) {
        return EieApp.escapeHtml(JSON.stringify(String(value == null ? '' : value)));
    }

    function asRows(result) {
        if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    function sortRows(rows) {
        return [...(rows || [])].sort((a, b) => {
            const pA = Number(a.period_order || 0);
            const pB = Number(b.period_order || 0);
            if (pA !== pB) return pA - pB;
            return Number(a.column_index || 0) - Number(b.column_index || 0);
        });
    }

    function groupByPeriod(rows) {
        return sortRows(rows).reduce((groups, row) => {
            const key = `${row.period_label || '교시 미정'}|${row.start_time || ''}|${row.end_time || ''}`;
            if (!groups[key]) groups[key] = { row, rows: [] };
            groups[key].rows.push(row);
            return groups;
        }, {});
    }

    function getRawMeta(row) {
        const value = row?.raw_meta_json;
        if (!value) return {};
        if (typeof value === 'object') return value;
        try { return JSON.parse(value); } catch (e) { return {}; }
    }

    function getStudentCandidates(row) {
        const assigned = Array.isArray(row?.assigned_students) ? row.assigned_students : [];
        if (assigned.length) {
            return assigned.map((student, index) => ({
                candidate_key: student.assignment_id || student.student_id || String(index),
                name: student.name || student.display_name || '',
                student_name_raw: student.student_name_raw || student.name || student.display_name || '',
                phone_raw: student.phone_raw || student.phone || '',
                normalized_phone: student.normalized_phone || '',
                grade_raw: student.grade_raw || student.grade || ''
            })).filter(s => s.name || s.student_name_raw);
        }
        const meta = getRawMeta(row);
        const names = meta.student_names || meta.students || meta.studentSeeds || [];
        if (!Array.isArray(names)) return [];
        return names.map((item, index) => ({
            candidate_key: String(index),
            name: typeof item === 'string' ? item : (item?.name || item?.student_name_raw || ''),
            student_name_raw: typeof item === 'string' ? item : (item?.student_name_raw || item?.name || ''),
            phone_raw: '',
            normalized_phone: '',
            grade_raw: ''
        })).filter(s => s.name);
    }

    function renderStudents(row) {
        const candidates = getStudentCandidates(row);
        if (!candidates.length) return '<div class="eie-cell-students is-empty">학생 없음</div>';
        return `
            <div class="eie-cell-students">
                ${candidates.map(candidate => `
                    <button type="button" class="eie-student-chip"
                            onclick="EieTimetableView.openStudentInfo(${jsArg(row.id)}, ${jsArg(candidate.candidate_key)})">
                        <span>${esc(candidate.name || candidate.student_name_raw)}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    function renderGrid(rows) {
        if (!rows.length) return '<div class="eie-empty-box">등록된 EIE 시간표가 없습니다.</div>';
        const groups = groupByPeriod(rows);
        return Object.values(groups).map(group => {
            const head = group.row;
            return `
                <section class="eie-excel-period-row">
                    <div class="eie-excel-period-head">
                        <strong>${esc(head.period_label || '-')}</strong>
                        <span>${esc([head.start_time, head.end_time].filter(Boolean).join('~') || '시간 미정')}</span>
                    </div>
                    <div class="eie-excel-cells">
                        ${group.rows.map(row => `
                            <article class="eie-excel-cell">
                                <div class="eie-cell-title">${esc(row.class_name_raw || '수업명 없음')}</div>
                                <div class="eie-cell-teacher">${esc(row.teacher_name_raw || '')}</div>
                                ${renderStudents(row)}
                            </article>
                        `).join('')}
                    </div>
                </section>
            `;
        }).join('');
    }

    function renderStudentPanel() {
        const selected = EieState.getSelectedStudentCandidate();
        if (!selected) return '';
        const cell = selected.cell || {};
        return `
            <aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">
                <div class="eie-editor-head">
                    <h2>학생 상세</h2>
                    <button type="button" class="eie-icon-button"
                            onclick="EieTimetableView.closeStudentInfo()">닫기</button>
                </div>
                <div class="eie-student-detail-title">
                    <strong>${esc(selected.name || selected.student_name_raw || '-')}</strong>
                </div>
                <div class="eie-detail-grid">
                    <div class="eie-detail-row">
                        <span>학년</span>
                        <strong>${esc(selected.grade_raw || '-')}</strong>
                    </div>
                    <div class="eie-detail-row">
                        <span>전화번호</span>
                        <strong>${esc(selected.phone_raw || selected.normalized_phone || '-')}</strong>
                    </div>
                    <div class="eie-detail-row">
                        <span>수업명</span>
                        <strong>${esc(cell.class_name_raw || '-')}</strong>
                    </div>
                    <div class="eie-detail-row">
                        <span>선생님</span>
                        <strong>${esc(cell.teacher_name_raw || '-')}</strong>
                    </div>
                    <div class="eie-detail-row">
                        <span>교시</span>
                        <strong>${esc(cell.period_label || '-')}</strong>
                    </div>
                    <div class="eie-detail-row">
                        <span>시간</span>
                        <strong>${esc([cell.start_time, cell.end_time].filter(Boolean).join('~') || '-')}</strong>
                    </div>
                </div>
            </aside>
        `;
    }

    async function loadTimetable() {
        const result = await EieApi.getTimetable(null, { status: 'active,imported' });
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
                if (loaded.result?.fallback === true) {
                    error = '시간표를 불러오지 못했습니다.' +
                        (loaded.result.error ? ' (' + loaded.result.error + ')' : '');
                }
            } catch (loadError) {
                error = '시간표를 불러오지 못했습니다.';
            } finally {
                EieState.setTimetableBusy(false);
            }

            if (error && !rows.length) {
                return `
                    <section aria-labelledby="eie-timetable-title">
                        <button type="button" class="eie-back-button"
                                data-eie-route="dashboard"
                                aria-label="EIE 홈으로 이동"
                                title="EIE 홈">← EIE 홈</button>
                        <div class="eie-panel">
                            <h1 id="eie-timetable-title" class="eie-panel-title">EIE 시간표</h1>
                            <div class="eie-error-box">${esc(error)}</div>
                        </div>
                    </section>
                `;
            }

            const st = EieState.get();
            const showPanel = st.studentCandidatePanelMode === 'detail';

            return `
                <section aria-labelledby="eie-timetable-title">
                    <button type="button" class="eie-back-button"
                            data-eie-route="dashboard"
                            aria-label="EIE 홈으로 이동"
                            title="EIE 홈">← EIE 홈</button>
                    <div class="eie-panel">
                        <h1 id="eie-timetable-title" class="eie-panel-title">EIE 시간표</h1>
                        ${error ? `<div class="eie-error-box">${esc(error)}</div>` : ''}
                        <div class="${showPanel ? 'eie-timetable-layout' : ''}">
                            <div class="eie-timetable-main">
                                ${renderGrid(rows)}
                            </div>
                            ${showPanel ? renderStudentPanel() : ''}
                        </div>
                    </div>
                </section>
            `;
        },

        openStudentInfo(cellId, candidateKey) {
            const selected = EieState.selectStudentCandidate(cellId, candidateKey);
            if (!selected) EieState.setTimetableError('학생을 찾지 못했습니다.');
            EieRouter.open('timetable');
        },

        closeStudentInfo() {
            EieState.closeStudentCandidatePanel();
            EieRouter.open('timetable');
        }
    };
})();
