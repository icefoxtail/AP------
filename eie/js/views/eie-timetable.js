(function () {
    const DAY_ORDER = ['월', '화', '수', '목', '금', '토', '일', ''];
    const STATUS_OPTIONS = ['active', 'needs_review', 'hidden', 'archived'];
    const STATUS_FILTERS = [
        { value: 'active,imported,needs_review', label: '운영', description: '운영 중 + 확인 필요' },
        { value: 'active,imported,needs_review,hidden,archived', label: '전체', description: '숨김·보관 포함' },
        { value: 'needs_review', label: '확인 필요', description: '확인 필요만' },
        { value: 'hidden', label: '숨김', description: '숨김 처리만' }
    ];

    const FLAG_LABELS = {
        duplicate_name: '동명이인',
        missing_phone: '전화 없음',
        needs_review: '확인 필요',
        phone_only: '전화만',
        name_only: '이름만'
    };

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


    function jsArg(value) {
        return EieApp.escapeHtml(JSON.stringify(String(value == null ? '' : value)));
    }

    function getStudentCandidates(row) {
        const assigned = Array.isArray(row?.assigned_students) ? row.assigned_students : [];
        if (assigned.length) {
            return assigned.map((student, index) => ({
                ...student,
                source_kind: 'assigned',
                assigned_index: index,
                candidate_index: Number.isInteger(Number(student.candidate_index)) ? Number(student.candidate_index) : index,
                candidate_key: student.assignment_id || student.student_id || String(index),
                name: student.name || student.display_name || '',
                student_name_raw: student.student_name_raw || student.name || student.display_name || '',
                phone_raw: student.phone_raw || student.phone || '',
                normalized_phone: student.normalized_phone || '',
                grade_raw: student.grade_raw || student.grade || '',
                flags: Array.isArray(student.flags) ? student.flags : [],
                match_status: 'confirmed',
                is_confirmed: true
            })).filter(candidate => candidate.name || candidate.student_name_raw).slice(0, 40);
        }

        const meta = getRawMeta(row);
        const candidates = Array.isArray(meta.student_candidates) ? meta.student_candidates : [];
        if (candidates.length) {
            return candidates.map((candidate, index) => ({
                ...candidate,
                candidate_index: index,
                name: candidate.name || candidate.student_name_raw || '',
                flags: Array.isArray(candidate.flags) ? candidate.flags : []
            })).filter(candidate => candidate.name || candidate.student_name_raw).slice(0, 40);
        }
        const values = meta.student_names || meta.students || meta.studentSeeds || [];
        if (!Array.isArray(values)) return [];
        return values.map((item, index) => {
            if (typeof item === 'string') {
                return { candidate_index: index, name: item, student_name_raw: item, flags: ['needs_review'], match_status: 'needs_review' };
            }
            return {
                ...item,
                candidate_index: index,
                name: item?.name || item?.student_name_raw || item?.studentName || '',
                flags: Array.isArray(item?.flags) ? item.flags : ['needs_review']
            };
        }).filter(candidate => candidate.name || candidate.student_name_raw).slice(0, 40);
    }

    function isCandidateConfirmed(cell, candidateIndex) {
        const confirmed = getRawMeta(cell).confirmed_student_candidates;
        if (!Array.isArray(confirmed)) return false;
        return confirmed.some(item => String(item?.candidate_index) === String(candidateIndex));
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
        const visibleRows = rows;
        const teacherCount = new Set(visibleRows.map(row => row.teacher_name_raw).filter(Boolean)).size;
        const studentCandidateCount = visibleRows.reduce((sum, row) => sum + getStudentCandidates(row).length, 0);
        return `
            <div class="eie-summary-grid" aria-label="운영 시간표 요약">
                <div class="eie-summary-card"><span>전체 셀</span><strong>${EieApp.escapeHtml(visibleRows.length)}개</strong></div>
                <div class="eie-summary-card"><span>운영</span><strong>${EieApp.escapeHtml(countStatus(visibleRows, 'active'))}개</strong></div>
                <div class="eie-summary-card"><span>확인 필요</span><strong>${EieApp.escapeHtml(countStatus(visibleRows, 'needs_review'))}개</strong></div>
                <div class="eie-summary-card"><span>숨김</span><strong>${EieApp.escapeHtml(countStatus(rows, 'hidden'))}개</strong></div>
                <div class="eie-summary-card"><span>선생님</span><strong>${EieApp.escapeHtml(teacherCount)}명</strong></div>
                <div class="eie-summary-card"><span>학생</span><strong>${EieApp.escapeHtml(studentCandidateCount)}명</strong></div>
            </div>
        `;
    }

    function renderFilterControls() {
        const current = EieState.get().timetableStatusFilter || 'active,imported,needs_review';
        return `
            <div class="eie-filter-bar" aria-label="시간표 보기 필터">
                <span class="eie-filter-label">보기</span>
                ${STATUS_FILTERS.map(filter => `
                    <button type="button" class="eie-filter-button ${filter.value === current ? 'is-active' : ''}" onclick="EieTimetableView.changeFilter('${EieApp.escapeHtml(filter.value)}')">
                        <strong>${EieApp.escapeHtml(filter.label)}</strong>
                        <small>${EieApp.escapeHtml(filter.description)}</small>
                    </button>
                `).join('')}
            </div>
        `;
    }

    function renderCandidateFlags(candidate) {
        const flags = Array.isArray(candidate?.flags) ? candidate.flags : [];
        const important = flags.filter(flag => FLAG_LABELS[flag]).slice(0, 3);
        if (!important.length) return '';
        return `<span class="eie-chip-badges">${important.map(flag => `<em class="eie-chip-badge is-${EieApp.escapeHtml(flag)}">${EieApp.escapeHtml(FLAG_LABELS[flag])}</em>`).join('')}</span>`;
    }

    function renderStudents(row) {
        const candidates = getStudentCandidates(row);
        if (!candidates.length) return '<div class="eie-cell-students is-empty">학생 없음</div>';
        return `
            <div class="eie-cell-students">
                ${candidates.map(candidate => {
                    const candidateKey = candidate.candidate_key || candidate.assignment_id || candidate.student_id || String(candidate.candidate_index || 0);
                    return `
                        <button type="button" class="eie-student-chip ${candidate.flags?.length ? 'has-flags' : ''}" onclick="EieTimetableView.openStudentInfo(${jsArg(row.id)}, ${jsArg(candidateKey)})">
                            <span>${EieApp.escapeHtml(candidate.name || candidate.student_name_raw || '-')}</span>
                            ${renderCandidateFlags(candidate)}
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderExcelGrid(rows) {
        if (!rows.length) return '<div class="eie-empty-box">등록된 EIE 시간표가 없습니다.</div>';
        const groups = groupByPeriod(rows);
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
                                        <span class="eie-status ${status === 'needs_review' ? 'is-warn' : status === 'hidden' || status === 'archived' ? 'is-muted' : 'is-ok'}">${EieApp.escapeHtml(status)}</span>
                                    </button>
                                    ${renderStudents(row)}
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
                    <label>시작 시간<input name="start_time" value="${EieApp.escapeHtml(cell.start_time || '')}" placeholder="14:00" /></label>
                    <label>종료 시간<input name="end_time" value="${EieApp.escapeHtml(cell.end_time || '')}" placeholder="15:30" /></label>
                    <label class="is-wide">수업명<input name="class_name_raw" value="${EieApp.escapeHtml(cell.class_name_raw || '')}" placeholder="수업명" /></label>
                    <label>선생님<input name="teacher_name_raw" value="${EieApp.escapeHtml(cell.teacher_name_raw || '')}" placeholder="선생님" /></label>
                    <label>교실<input name="room_raw" value="${EieApp.escapeHtml(cell.room_raw || '')}" placeholder="교실" /></label>
                    <label>학생 수<input name="student_count" type="number" min="0" value="${EieApp.escapeHtml(cell.student_count ?? 0)}" /></label>
                    <label>상태<select name="status">${renderStatusOptions(cell.status || 'active')}</select></label>
                    <label class="is-wide">메모<textarea name="memo" rows="3" placeholder="운영 메모">${EieApp.escapeHtml(cell.memo || '')}</textarea></label>
                    <div class="eie-action-row">
                        <button type="submit" class="eie-primary-button">저장</button>
                        ${cell.id ? `<button type="button" class="eie-secondary-button" onclick="EieTimetableView.setStatus('${EieApp.escapeHtml(cell.id)}', 'hidden')">숨김</button>` : ''}
                        ${cell.id ? `<button type="button" class="eie-secondary-button" onclick="EieTimetableView.setStatus('${EieApp.escapeHtml(cell.id)}', 'needs_review')">보류</button>` : ''}
                        ${cell.id ? `<button type="button" class="eie-secondary-button" onclick="EieTimetableView.setStatus('${EieApp.escapeHtml(cell.id)}', 'archived')">보관</button>` : ''}
                    </div>
                    <div class="eie-api-note">학생/연락처 확정, classroom, 출석/숙제는 아직 생성하지 않습니다.</div>
                </form>
            </aside>
        `;
    }

    function renderDetailRow(label, value) {
        return `
            <div class="eie-detail-row">
                <span>${EieApp.escapeHtml(label)}</span>
                <strong>${EieApp.escapeHtml(value || '-')}</strong>
            </div>
        `;
    }

    function renderStudentPanel() {
        const selected = EieState.getSelectedStudentCandidate();
        if (!selected) return '';
        const cell = selected.cell || {};
        const flags = Array.isArray(selected.flags) ? selected.flags : [];
        const reasons = Array.isArray(getRawMeta(cell).needs_review_reasons) ? getRawMeta(cell).needs_review_reasons : [];
        return `
            <aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">
                <div class="eie-editor-head">
                    <h2>학생</h2>
                    <button type="button" class="eie-icon-button" onclick="EieTimetableView.closeStudentInfo()">닫기</button>
                </div>
                <div class="eie-student-detail-title">
                    <strong>${EieApp.escapeHtml(selected.name || selected.student_name_raw || '-')}</strong>
                    ${renderCandidateFlags(selected)}
                </div>
                <div class="eie-detail-grid">
                    ${renderDetailRow('이름', selected.student_name_raw || selected.name)}
                    ${renderDetailRow('학년', selected.grade_raw)}
                    ${renderDetailRow('전화번호', selected.phone_raw || selected.normalized_phone)}
                    ${renderDetailRow('원본 메모', selected.memo_raw)}
                    ${renderDetailRow('요일/교시', [cell.day_label, cell.period_label].filter(Boolean).join(' '))}
                    ${renderDetailRow('시간', [cell.start_time, cell.end_time].filter(Boolean).join('~'))}
                    ${renderDetailRow('수업명', cell.class_name_raw)}
                    ${renderDetailRow('선생님', cell.teacher_name_raw)}
                    ${renderDetailRow('원본 위치', [selected.source_row ? `행 ${selected.source_row}` : '', selected.source_col ? `열 ${selected.source_col}` : ''].filter(Boolean).join(' · '))}
                    ${renderDetailRow('상태', selected.match_status || (flags.length ? 'needs_review' : 'candidate'))}
                </div>
                ${(flags.length || reasons.length) ? `
                    <div class="eie-review-reasons">
                        <span>확인 필요</span>
                        <div>${[...new Set([...flags, ...reasons])].map(flag => `<em>${EieApp.escapeHtml(FLAG_LABELS[flag] || flag)}</em>`).join('')}</div>
                    </div>
                ` : ''}
                <div class="eie-action-row">
                    ${(selected.is_confirmed || isCandidateConfirmed(cell, selected.candidate_index)) ? '<span class="eie-status is-ok">등록됨</span>' : `<button type="button" class="eie-primary-button" onclick="EieTimetableView.confirmSelectedStudentCandidate()">학생·연락처·수업배정 확정</button>`}
                </div>
                <div class="eie-api-note">전화번호는 학생 상세에서만 표시됩니다.</div>
            </aside>
        `;
    }

    function renderSidePanel() {
        const state = EieState.get();
        if (state.studentCandidatePanelMode === 'detail') return renderStudentPanel();
        return renderEditor();
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
                    <a class="eie-back-button" href="../apmath/index.html">원장님 화면</a>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">EIE 운영 시간표</p>
                        <h1 id="eie-timetable-title" class="eie-panel-title">EIE 운영 시간표</h1>
                        <p class="eie-panel-copy">원본 시간표 기준으로 수업 셀과 학생 이름을 표시합니다. 전화번호는 학생 상세에서만 확인합니다.</p>
                        <div class="eie-action-row">
                            <button type="button" class="eie-primary-button" onclick="EieTimetableView.newCell()">수업 추가</button>
                            <button type="button" class="eie-secondary-button" onclick="EieRouter.open('timetable')">새로고침</button>
                        </div>
                        ${renderFilterControls()}
                        ${state.timetableNotice ? `<div class="eie-notice-box">${EieApp.escapeHtml(state.timetableNotice)}</div>` : ''}
                        ${state.timetableError || error ? `<div class="eie-error-box">${EieApp.escapeHtml(state.timetableError || error)}</div>` : ''}
                        ${renderSummary(rows)}
                        <div class="eie-timetable-layout">
                            <div class="eie-timetable-main">
                                ${renderExcelGrid(rows)}
                            </div>
                            ${renderSidePanel()}
                        </div>
                        <div class="eie-empty-box">Round 6은 EIE 전용 학생·연락처·수업배정 확정까지만 다룹니다. classroom, 출석/숙제는 생성하지 않습니다.</div>
                    </div>
                </section>
            `;
        },
        changeFilter(value) {
            EieState.setTimetableStatusFilter(value);
            EieState.closeTimetableEditor();
            EieState.closeStudentCandidatePanel();
            EieRouter.open('timetable');
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
        closeStudentInfo() {
            EieState.closeStudentCandidatePanel();
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
        openStudentInfo(cellId, candidateIndex) {
            const selected = EieState.selectStudentCandidate(cellId, candidateIndex);
            if (!selected) EieState.setTimetableError('학생를 찾지 못했습니다.');
            EieRouter.open('timetable');
        },
        async confirmSelectedStudentCandidate() {
            const selected = EieState.getSelectedStudentCandidate();
            if (!selected?.cell_id) {
                EieState.setTimetableError('확정할 학생를 찾지 못했습니다.');
                EieRouter.open('timetable');
                return;
            }
            try {
                await EieApi.confirmStudentCandidate({
                    cell_id: selected.cell_id,
                    candidate_index: selected.candidate_index
                });
                EieState.setTimetableNotice('학생·연락처·수업배정을 확정했습니다.');
                EieState.closeStudentCandidatePanel();
            } catch (error) {
                EieState.setTimetableError(error?.message || '학생를 확정하지 못했습니다.');
            }
            EieRouter.open('timetable');
        }
    };
})();
