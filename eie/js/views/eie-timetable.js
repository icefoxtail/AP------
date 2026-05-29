(function () {
    const HOLDING_SLOT_COUNT = 3;
    const EDIT_MIN_WIDTH = 961;
    const DRAFT_VERSION = 'front-draft-v1';
    const MOVE_FIELDS = [
        'day_label',
        'period_label',
        'period_order',
        'start_time',
        'end_time',
        'column_index'
    ];
    const EDIT_FIELDS = [
        'class_name_raw',
        'teacher_name_raw',
        'room_raw',
        'status',
        'memo'
    ];

    const editorState = {
        isEditMode: false,
        serverSnapshot: [],
        draftCells: [],
        holdingSlots: Array(HOLDING_SLOT_COUNT).fill(null),
        selectedCellId: '',
        selectedSlot: null,
        notice: '',
        error: '',
        lastPayload: null,
        hasPreparedPayload: false,
        invalidCreateField: ''
    };

    let eventsBound = false;

    function esc(value) {
        return EieApp.escapeHtml(value);
    }

    function asRows(result) {
        if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    function deepClone(value) {
        return JSON.parse(JSON.stringify(value || []));
    }

    function canEditOnThisViewport() {
        if (typeof window === 'undefined') return true;
        return window.innerWidth >= EDIT_MIN_WIDTH;
    }

    function normalizeId(value) {
        return String(value == null ? '' : value);
    }

    function cellId(cell) {
        return normalizeId(cell?.id || cell?.cell_id || cell?.temp_id);
    }

    function isTempCell(cell) {
        return cellId(cell).startsWith('temp_');
    }

    function normalizeStatus(value) {
        const status = String(value || 'active').trim();
        if (['active', 'imported', 'needs_review', 'hidden', 'archived'].includes(status)) {
            return status === 'imported' ? 'active' : status;
        }
        return 'active';
    }

    function normalizeCell(row, fallbackIndex) {
        const periodOrder = Number(row?.period_order);
        const columnIndex = Number(row?.column_index);
        return {
            ...(row || {}),
            id: cellId(row) || `temp_${Date.now()}_${fallbackIndex || 0}`,
            period_order: Number.isFinite(periodOrder) ? periodOrder : fallbackIndex || 0,
            column_index: Number.isFinite(columnIndex) ? columnIndex : fallbackIndex || 0,
            status: normalizeStatus(row?.status || 'active'),
            class_name_raw: row?.class_name_raw || row?.class_name || '',
            teacher_name_raw: row?.teacher_name_raw || row?.teacher_name || '',
            room_raw: row?.room_raw || row?.room_name || '',
            memo: row?.memo || ''
        };
    }

    function sortRows(rows) {
        return [...(rows || [])].sort((a, b) => {
            const pA = Number(a.period_order || 0);
            const pB = Number(b.period_order || 0);
            if (pA !== pB) return pA - pB;
            return Number(a.column_index || 0) - Number(b.column_index || 0);
        });
    }

    function periodKey(row) {
        return [
            row?.day_label || '',
            row?.period_label || '교시 미정',
            row?.start_time || '',
            row?.end_time || ''
        ].join('|');
    }

    function groupByPeriod(rows) {
        return sortRows(rows).reduce((groups, row) => {
            const key = periodKey(row);
            if (!groups[key]) groups[key] = { key, row, rows: [] };
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

    function getSourceRows() {
        return editorState.isEditMode
            ? editorState.draftCells
            : EieState.get().timetableCells;
    }

    function getHeldSet() {
        return new Set(editorState.holdingSlots.filter(Boolean).map(normalizeId));
    }

    function isHeld(cellOrId) {
        return getHeldSet().has(normalizeId(typeof cellOrId === 'object' ? cellId(cellOrId) : cellOrId));
    }

    function visibleDraftCells() {
        if (!editorState.isEditMode) return EieState.get().timetableCells;
        const held = getHeldSet();
        return editorState.draftCells.filter(cell => !held.has(cellId(cell)));
    }

    function findDraftCell(id) {
        const key = normalizeId(id);
        return editorState.draftCells.find(cell => cellId(cell) === key) || null;
    }

    function findServerCell(id) {
        const key = normalizeId(id);
        return editorState.serverSnapshot.find(cell => cellId(cell) === key) || null;
    }

    function maxColumnCount(rows) {
        const max = (rows || []).reduce((value, row) => {
            const col = Number(row?.column_index || 0);
            return Number.isFinite(col) ? Math.max(value, col) : value;
        }, 0);
        return Math.max(3, Math.min(8, max + 1));
    }

    function normalizeTeacherName(value) {
        return String(value || '').trim();
    }

    function teacherNameOf(row) {
        return normalizeTeacherName(row?.teacher_name_raw || row?.teacher_name || row?.teacher || '미정');
    }

    function teacherKeyFromName(value) {
        return normalizeTeacherName(value || '미정').toLowerCase();
    }

    function teacherKey(row) {
        return teacherKeyFromName(teacherNameOf(row));
    }

    function buildTeacherColumns(rows) {
        const map = new Map();
        (rows || []).forEach((row, index) => {
            const name = teacherNameOf(row) || '미정';
            const key = teacherKeyFromName(name);
            const columnIndex = Number(row?.column_index || 0);
            if (!map.has(key)) {
                map.set(key, {
                    key,
                    label: name,
                    columnIndex: Number.isFinite(columnIndex) ? columnIndex : index,
                    firstIndex: index,
                    count: 0
                });
            }
            const meta = map.get(key);
            meta.count += 1;
            if (Number.isFinite(columnIndex)) meta.columnIndex = Math.min(meta.columnIndex, columnIndex);
        });

        const columns = Array.from(map.values()).sort((a, b) => {
            if (a.columnIndex !== b.columnIndex) return a.columnIndex - b.columnIndex;
            return a.firstIndex - b.firstIndex;
        });

        if (columns.length) return columns;
        return Array.from({ length: maxColumnCount(rows) }, (_, index) => ({
            key: `column_${index}`,
            label: `열 ${index + 1}`,
            columnIndex: index,
            firstIndex: index,
            count: 0
        }));
    }

    function slotCellMap(rows) {
        const map = new Map();
        (rows || []).forEach(row => {
            const key = `${periodKey(row)}::${teacherKey(row)}`;
            if (!map.has(key)) map.set(key, row);
        });
        return map;
    }

    function labelOfCell(row) {
        return row?.class_name_raw || row?.class_name || '수업명 없음';
    }

    function timeText(row) {
        return [row?.start_time, row?.end_time].filter(Boolean).join('~') || '시간 미정';
    }

    function statusLabel(status) {
        const map = {
            active: '활성',
            imported: '활성',
            needs_review: '확인필요',
            hidden: '숨김',
            archived: '보관'
        };
        return map[normalizeStatus(status)] || '활성';
    }

    function renderStudents(row, isEditMode) {
        const candidates = getStudentCandidates(row);
        if (!candidates.length) return '<div class="eie-cell-students is-empty">학생 없음</div>';
        return `
            <div class="eie-cell-students">
                ${candidates.map(candidate => {
                    const name = esc(candidate.name || candidate.student_name_raw);
                    if (isEditMode) {
                        return `<span class="eie-student-chip is-readonly"><span>${name}</span></span>`;
                    }
                    return `
                        <button type="button" class="eie-student-chip"
                                data-eie-student-chip="true"
                                data-cell-id="${esc(cellId(row))}"
                                data-candidate-key="${esc(candidate.candidate_key)}">
                            <span>${name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderCellCard(row, options = {}) {
        if (!row) return '';
        const id = cellId(row);
        const isSelected = editorState.selectedCellId === id;
        const isEditMode = !!options.isEditMode;
        const status = normalizeStatus(row.status);
        const classes = [
            'eie-excel-cell',
            `is-${status}`,
            isSelected ? 'is-selected' : '',
            isEditMode ? 'is-editable' : '',
            isTempCell(row) ? 'is-temp' : '',
            hasCellChanges(row) ? 'has-draft-change' : ''
        ].filter(Boolean).join(' ');

        return `
            <article class="${classes}"
                     ${isEditMode ? `draggable="true" data-eie-cell-card="true" data-cell-id="${esc(id)}"` : ''}>
                <div class="eie-cell-title">${esc(labelOfCell(row))}</div>
                <div class="eie-cell-teacher">${esc(row.teacher_name_raw || '')}</div>
                <div class="eie-cell-editor-meta">
                    <span class="eie-status is-${status}">${esc(statusLabel(status))}</span>
                    ${isEditMode ? '<span class="eie-drag-hint">이동 가능</span>' : ''}
                </div>
                ${renderStudents(row, isEditMode)}
            </article>
        `;
    }

    function renderViewCell(row) {
        return `
            <article class="eie-excel-cell ${row?.status ? 'is-' + esc(row.status) : ''}">
                <div class="eie-cell-title">${esc(labelOfCell(row))}</div>
                <div class="eie-cell-teacher">${esc(row.teacher_name_raw || '')}</div>
                ${renderStudents(row, false)}
            </article>
        `;
    }

    function renderGrid(rows) {
        const periodSource = editorState.isEditMode ? editorState.draftCells : rows;
        const visibleSource = editorState.isEditMode ? visibleDraftCells() : rows;
        if (!periodSource.length) return '<div class="eie-empty-box">등록된 EIE 시간표가 없습니다.</div>';
        const groups = groupByPeriod(periodSource);
        const allRows = editorState.isEditMode ? editorState.draftCells : visibleSource;
        const teacherColumns = buildTeacherColumns(allRows);
        const teacherHeader = `
            <div class="eie-timetable-teacher-header" aria-hidden="true">
                <div class="eie-timetable-period-corner">교시 / 시간</div>
                <div class="eie-timetable-teacher-cells">
                    ${teacherColumns.map(column => `
                        <div class="eie-timetable-teacher-head" data-teacher-key="${esc(column.key)}">
                            ${esc(column.label)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const periodRows = Object.values(groups).map(group => {
            const head = group.row;
            const map = slotCellMap(group.rows.filter(row => !isHeld(row)));
            const slots = teacherColumns.map(column => {
                const slotKey = `${group.key}::${column.key}`;
                const cell = map.get(slotKey);
                const isSelectedEmpty = editorState.selectedSlot?.periodKey === group.key && editorState.selectedSlot?.teacherKey === column.key;

                if (!editorState.isEditMode) {
                    return `
                        <div class="eie-timetable-view-slot ${cell ? 'has-cell' : 'is-empty'}" data-teacher-key="${esc(column.key)}">
                            ${cell ? renderViewCell(cell) : '<span class="eie-empty-slot-label">-</span>'}
                        </div>
                    `;
                }

                return `
                    <div class="eie-timetable-drop-slot ${cell ? 'has-cell' : 'is-empty'} ${isSelectedEmpty ? 'is-selected' : ''}"
                         data-eie-drop-slot="true"
                         data-period-key="${esc(group.key)}"
                         data-period-order="${esc(head.period_order || '')}"
                         data-day-label="${esc(head.day_label || '')}"
                         data-period-label="${esc(head.period_label || '')}"
                         data-start-time="${esc(head.start_time || '')}"
                         data-end-time="${esc(head.end_time || '')}"
                         data-column-index="${esc(column.columnIndex)}"
                         data-teacher-key="${esc(column.key)}"
                         data-teacher-name="${esc(column.label)}">
                        ${cell ? renderCellCard(cell, { isEditMode: true }) : `<span class="eie-empty-slot-label">빈 칸</span>`}
                    </div>
                `;
            }).join('');

            return `
                <section class="eie-excel-period-row ${editorState.isEditMode ? 'is-editing' : ''}">
                    <div class="eie-excel-period-head">
                        <strong>${esc(head.period_label || '-')}</strong>
                        <span>${esc(timeText(head))}</span>
                    </div>
                    <div class="eie-excel-cells ${editorState.isEditMode ? 'is-editing' : ''}">
                        ${slots}
                    </div>
                </section>
            `;
        }).join('');

        return `
            <section class="eie-timetable-board" style="--eie-teacher-columns: ${teacherColumns.length};">
                ${teacherHeader}
                ${periodRows}
            </section>
        `;
    }

    function renderHoldingArea() {
        if (!editorState.isEditMode) return '';
        return `
            <section class="eie-transfer-area" aria-label="이동칸">
                <div class="eie-transfer-head">
                    <strong>이동칸</strong>
                    <span>반을 잠깐 빼두는 작업대입니다.</span>
                </div>
                <div class="eie-transfer-slots">
                    ${editorState.holdingSlots.map((cellIdValue, index) => {
                        const cell = cellIdValue ? findDraftCell(cellIdValue) : null;
                        return `
                            <div class="eie-transfer-slot ${cell ? 'has-cell' : 'is-empty'}"
                                 data-eie-holding-slot="true"
                                 data-holding-index="${esc(index)}">
                                <div class="eie-transfer-slot-label">이동칸 ${index + 1}</div>
                                ${cell ? renderCellCard(cell, { isEditMode: true }) : '<span class="eie-empty-slot-label">비어 있음</span>'}
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    }

    function renderEditorToolbar(error) {
        const canEdit = canEditOnThisViewport();
        const validation = validateDraft();
        const changeSummary = buildPayload();
        const dirtyCount = changeSummary.moves.length + changeSummary.updates.length + changeSummary.creates.length;
        return `
            <div class="eie-timetable-toolbar ${editorState.isEditMode ? 'is-editing' : ''}">
                <div class="eie-timetable-toolbar-main">
                    <strong>${editorState.isEditMode ? '편집 중' : '열람 모드'}</strong>
                    <span>${editorState.isEditMode ? '저장 전까지 실제 시간표에는 반영되지 않습니다.' : '편집은 PC에서만 가능합니다.'}</span>
                </div>
                <div class="eie-timetable-toolbar-actions">
                    ${editorState.isEditMode ? `
                        <button type="button" class="eie-small-button" data-eie-timetable-action="reset-edit">원래대로</button>
                        <button type="button" class="eie-small-button" data-eie-timetable-action="exit-edit">나가기</button>
                        <button type="button" class="eie-primary-button" data-eie-timetable-action="prepare-save" ${validation.isValid ? '' : 'disabled'}>
                            저장 전 검증
                        </button>
                    ` : `
                        <button type="button" class="eie-primary-button" data-eie-timetable-action="start-edit" ${canEdit ? '' : 'disabled'} title="PC에서만 편집할 수 있어요">
                            편집
                        </button>
                    `}
                </div>
            </div>
            ${!canEdit && !editorState.isEditMode ? '<div class="eie-info-box">시간표 편집은 PC에서 할 수 있어요. 모바일에서는 열람만 지원합니다.</div>' : ''}
            ${error ? `<div class="eie-error-box">${esc(error)}</div>` : ''}
            ${editorState.error ? `<div class="eie-error-box">${esc(editorState.error)}</div>` : ''}
            ${editorState.notice ? `<div class="eie-info-box">${esc(editorState.notice)}</div>` : ''}
            ${editorState.isEditMode && !validation.isValid ? `
                <div class="eie-warning-box">
                    ${validation.messages.map(message => `<div>${esc(message)}</div>`).join('')}
                </div>
            ` : ''}
            ${editorState.isEditMode && dirtyCount ? `<div class="eie-draft-count">변경 예정 ${dirtyCount}건</div>` : ''}
        `;
    }

    function selectedCell() {
        return editorState.selectedCellId ? findDraftCell(editorState.selectedCellId) : null;
    }

    function renderEditorPanel() {
        const showStudentPanel = EieState.get().studentCandidatePanelMode === 'detail';
        if (!editorState.isEditMode) return showStudentPanel ? renderStudentPanel() : '';

        const cell = selectedCell();
        if (cell) return renderCellEditor(cell);
        if (editorState.selectedSlot) return renderCreatePanel();
        return `
            <aside class="eie-editor-panel eie-timetable-editor-panel" aria-label="시간표 편집">
                <div class="eie-editor-head">
                    <h2>시간표 편집</h2>
                </div>
                <p class="eie-editor-help">반 셀을 선택하거나 빈 칸을 선택해 주세요.</p>
                ${renderChangePreview()}
            </aside>
        `;
    }

    function renderCellEditor(cell) {
        return `
            <aside class="eie-editor-panel eie-timetable-editor-panel" aria-label="수업 수정">
                <div class="eie-editor-head">
                    <h2>수업 수정</h2>
                    <button type="button" class="eie-icon-button" data-eie-timetable-action="clear-selection">닫기</button>
                </div>
                <div class="eie-edit-form" data-eie-cell-form="true" data-cell-id="${esc(cellId(cell))}">
                    ${renderInput('수업명', 'class_name_raw', cell.class_name_raw || '', 'text')}
                    ${renderInput('선생님', 'teacher_name_raw', cell.teacher_name_raw || '', 'text')}
                    ${renderInput('교실', 'room_raw', cell.room_raw || '', 'text')}
                    <label>
                        <span>상태</span>
                        <select data-eie-edit-field="status">
                            ${['active', 'needs_review', 'hidden', 'archived'].map(status => `
                                <option value="${status}" ${normalizeStatus(cell.status) === status ? 'selected' : ''}>${esc(statusLabel(status))}</option>
                            `).join('')}
                        </select>
                    </label>
                    <label class="is-wide">
                        <span>메모</span>
                        <textarea rows="4" data-eie-edit-field="memo">${esc(cell.memo || '')}</textarea>
                    </label>
                </div>
                <div class="eie-action-row">
                    <button type="button" class="eie-small-button" data-eie-timetable-action="move-selected-to-holding">이동칸으로</button>
                    <button type="button" class="eie-small-button" data-eie-timetable-action="mark-needs-review">확인필요</button>
                    <button type="button" class="eie-small-button" data-eie-timetable-action="mark-hidden">숨김</button>
                    <button type="button" class="eie-small-button" data-eie-timetable-action="mark-active">활성</button>
                </div>
                ${renderChangePreview()}
            </aside>
        `;
    }

    function renderCreatePanel() {
        const slot = editorState.selectedSlot;
        return `
            <aside class="eie-editor-panel eie-timetable-editor-panel" aria-label="수업 추가">
                <div class="eie-editor-head">
                    <h2>수업 추가</h2>
                    <button type="button" class="eie-icon-button" data-eie-timetable-action="clear-selection">닫기</button>
                </div>
                <p class="eie-editor-help">선택한 빈 칸에 임시 수업을 만듭니다.</p>
                <div class="eie-edit-form" data-eie-new-cell-form="true">
                    ${renderInput('수업명', 'class_name_raw', '', 'text')}
                    ${renderInput('선생님', 'teacher_name_raw', slot.teacherName || '', 'text')}
                    ${renderInput('교실', 'room_raw', '', 'text')}
                    <label>
                        <span>상태</span>
                        <select data-eie-edit-field="status">
                            <option value="active">활성</option>
                            <option value="needs_review">확인필요</option>
                        </select>
                    </label>
                    <label class="is-wide">
                        <span>메모</span>
                        <textarea rows="4" data-eie-edit-field="memo"></textarea>
                    </label>
                </div>
                <div class="eie-action-row">
                    <button type="button" class="eie-primary-button" data-eie-timetable-action="create-draft-cell">임시 수업 만들기</button>
                </div>
                <div class="eie-api-note">${esc(slot.periodLabel || '-')} · ${esc([slot.startTime, slot.endTime].filter(Boolean).join('~') || '시간 미정')} · ${esc(slot.teacherName || `${Number(slot.columnIndex) + 1}칸`)}</div>
                ${renderChangePreview()}
            </aside>
        `;
    }

    function renderInput(label, field, value, type) {
        const isInvalid = editorState.invalidCreateField === field;
        return `
            <label class="${isInvalid ? 'is-invalid' : ''}">
                <span>${esc(label)}</span>
                <input type="${esc(type || 'text')}" value="${esc(value)}" data-eie-edit-field="${esc(field)}" ${isInvalid ? 'aria-invalid="true" autofocus' : ''}>
            </label>
        `;
    }

    function renderChangePreview() {
        const payload = buildPayload();
        const validation = validateDraft();
        const lines = [];
        payload.moves.forEach(move => {
            lines.push(`이동 · ${labelFromId(move.cell_id)} · ${move.old_period_label || '-'} ${move.old_teacher_name_raw || '-'} → ${move.new_period_label || '-'} ${move.new_teacher_name_raw || '-'}`);
        });
        payload.updates.forEach(update => {
            const fields = Object.keys(update.payload || {}).join(', ');
            lines.push(`수정 · ${labelFromId(update.cell_id)} · ${fields || '내용 변경'}`);
        });
        payload.creates.forEach(create => {
            lines.push(`추가 · ${create.payload?.class_name_raw || '새 수업'} · ${create.payload?.period_label || '-'}`);
        });
        if (!lines.length && validation.isValid) {
            lines.push('아직 변경사항이 없습니다.');
        }

        return `
            <div class="eie-change-preview">
                <div class="eie-change-preview-head">
                    <strong>변경사항</strong>
                    <span>${payload.moves.length + payload.updates.length + payload.creates.length}건</span>
                </div>
                <div class="eie-change-list">
                    ${lines.map(line => `<div class="eie-change-row">${esc(line)}</div>`).join('')}
                </div>
                ${editorState.lastPayload ? `
                    <details class="eie-payload-preview">
                        <summary>저장 payload 보기</summary>
                        <pre>${esc(JSON.stringify(editorState.lastPayload, null, 2))}</pre>
                    </details>
                ` : ''}
            </div>
        `;
    }

    function labelFromId(id) {
        const cell = findDraftCell(id) || findServerCell(id);
        return cell ? labelOfCell(cell) : normalizeId(id);
    }

    function renderStudentPanel() {
        const selected = EieState.getSelectedStudentCandidate();
        if (!selected) return '';
        const cell = selected.cell || {};
        return `
            <aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">
                <div class="eie-editor-head">
                    <h2>학생 상세</h2>
                    <button type="button" class="eie-icon-button" data-eie-timetable-action="close-student">닫기</button>
                </div>
                <div class="eie-student-detail-title">
                    <strong>${esc(selected.name || selected.student_name_raw || '-')}</strong>
                </div>
                <div class="eie-detail-grid">
                    <div class="eie-detail-row"><span>학년</span><strong>${esc(selected.grade_raw || '-')}</strong></div>
                    <div class="eie-detail-row"><span>전화번호</span><strong>${esc(selected.phone_raw || selected.normalized_phone || '-')}</strong></div>
                    <div class="eie-detail-row"><span>수업명</span><strong>${esc(cell.class_name_raw || '-')}</strong></div>
                    <div class="eie-detail-row"><span>선생님</span><strong>${esc(cell.teacher_name_raw || '-')}</strong></div>
                    <div class="eie-detail-row"><span>교시</span><strong>${esc(cell.period_label || '-')}</strong></div>
                    <div class="eie-detail-row"><span>시간</span><strong>${esc(timeText(cell) || '-')}</strong></div>
                </div>
            </aside>
        `;
    }

    async function loadTimetable() {
        const result = await EieApi.getTimetable(null, { status: 'active,imported,needs_review' });
        const rows = asRows(result).map(normalizeCell);
        EieState.setTimetableCells(rows);
        return { rows, result };
    }

    function startEditMode() {
        if (!canEditOnThisViewport()) {
            editorState.error = '시간표 편집은 PC에서 할 수 있어요.';
            editorState.notice = '';
            rerender();
            return;
        }
        const source = EieState.get().timetableCells.map(normalizeCell);
        editorState.isEditMode = true;
        editorState.serverSnapshot = deepClone(source);
        editorState.draftCells = deepClone(source);
        editorState.holdingSlots = Array(HOLDING_SLOT_COUNT).fill(null);
        editorState.selectedCellId = '';
        editorState.selectedSlot = null;
        editorState.error = '';
        editorState.notice = '편집 모드입니다. 저장 전까지 실제 시간표에는 반영되지 않습니다.';
        editorState.lastPayload = null;
        editorState.hasPreparedPayload = false;
        rerender();
    }

    function exitEditMode(force) {
        if (!force && hasDraftChanges()) {
            const ok = window.confirm('수정 중인 내용이 있습니다. 저장하지 않고 나갈까요?');
            if (!ok) return;
        }
        editorState.isEditMode = false;
        editorState.serverSnapshot = [];
        editorState.draftCells = [];
        editorState.holdingSlots = Array(HOLDING_SLOT_COUNT).fill(null);
        editorState.selectedCellId = '';
        editorState.selectedSlot = null;
        editorState.error = '';
        editorState.notice = '';
        editorState.invalidCreateField = '';
        editorState.lastPayload = null;
        editorState.hasPreparedPayload = false;
        rerender();
    }

    function resetEditMode() {
        editorState.draftCells = deepClone(editorState.serverSnapshot);
        editorState.holdingSlots = Array(HOLDING_SLOT_COUNT).fill(null);
        editorState.selectedCellId = '';
        editorState.selectedSlot = null;
        editorState.error = '';
        editorState.notice = '처음 편집 상태로 되돌렸습니다.';
        editorState.lastPayload = null;
        rerender();
    }

    function selectCell(id) {
        editorState.selectedCellId = normalizeId(id);
        editorState.selectedSlot = null;
        editorState.error = '';
        editorState.notice = '';
        rerender();
    }

    function selectSlotFromElement(el) {
        editorState.selectedCellId = '';
        editorState.selectedSlot = {
            periodKey: el.getAttribute('data-period-key') || '',
            dayLabel: el.getAttribute('data-day-label') || '',
            periodLabel: el.getAttribute('data-period-label') || '',
            periodOrder: Number(el.getAttribute('data-period-order') || 0),
            startTime: el.getAttribute('data-start-time') || '',
            endTime: el.getAttribute('data-end-time') || '',
            columnIndex: Number(el.getAttribute('data-column-index') || 0),
            teacherKey: el.getAttribute('data-teacher-key') || '',
            teacherName: el.getAttribute('data-teacher-name') || ''
        };
        editorState.error = '';
        editorState.invalidCreateField = '';
        editorState.notice = '빈 칸을 선택했습니다. 수업을 추가하거나 선택한 반을 이동할 수 있습니다.';
        rerender();
    }

    function moveCellToHolding(id, preferredIndex) {
        if (!editorState.isEditMode) return;
        const key = normalizeId(id || editorState.selectedCellId);
        if (!key || !findDraftCell(key)) return;
        const nextSlots = editorState.holdingSlots.map(value => normalizeId(value) === key ? null : value);
        const targetIndex = Number.isInteger(Number(preferredIndex))
            ? Number(preferredIndex)
            : nextSlots.findIndex(value => !value);
        if (targetIndex < 0 || targetIndex >= nextSlots.length) {
            editorState.error = '빈 이동칸이 없습니다.';
            editorState.notice = '';
            rerender();
            return;
        }
        const existing = normalizeId(nextSlots[targetIndex]);
        if (existing && existing !== key) {
            editorState.error = '이미 사용 중인 이동칸입니다. 빈 이동칸으로 옮겨 주세요.';
            editorState.notice = '';
            rerender();
            return;
        }
        nextSlots[targetIndex] = key;
        editorState.holdingSlots = nextSlots;
        editorState.selectedCellId = key;
        editorState.selectedSlot = null;
        editorState.error = '';
        editorState.notice = `${labelFromId(key)}을(를) 이동칸 ${targetIndex + 1}에 두었습니다.`;
        editorState.lastPayload = null;
        rerender();
    }

    function moveCellToSlot(id, slotEl) {
        const key = normalizeId(id || editorState.selectedCellId);
        const moving = findDraftCell(key);
        if (!moving || !slotEl) return;
        const target = slotFromElement(slotEl);
        const occupied = findCellAtSlot(target.periodKey, target.columnIndex, key, target.teacher_name_raw);
        const wasHeld = isHeld(key);
        if (wasHeld && occupied) {
            editorState.error = '이동칸에 있는 반은 빈 칸에만 배치할 수 있습니다. 먼저 대상 칸을 비워 주세요.';
            editorState.notice = '';
            editorState.selectedCellId = key;
            editorState.selectedSlot = null;
            rerender();
            return;
        }
        const old = snapshotSlot(moving);
        editorState.holdingSlots = editorState.holdingSlots.map(value => normalizeId(value) === key ? null : value);
        applySlot(moving, target);
        if (occupied) {
            applySlot(occupied, old);
            editorState.notice = `${labelOfCell(moving)}과(와) ${labelOfCell(occupied)} 위치를 바꿨습니다.`;
        } else {
            editorState.notice = `${labelOfCell(moving)}을(를) 이동했습니다.`;
        }
        editorState.selectedCellId = key;
        editorState.selectedSlot = null;
        editorState.error = '';
        editorState.lastPayload = null;
        rerender();
    }

    function slotFromElement(el) {
        return {
            periodKey: el.getAttribute('data-period-key') || '',
            day_label: el.getAttribute('data-day-label') || '',
            period_label: el.getAttribute('data-period-label') || '',
            period_order: Number(el.getAttribute('data-period-order') || 0),
            start_time: el.getAttribute('data-start-time') || '',
            end_time: el.getAttribute('data-end-time') || '',
            column_index: Number(el.getAttribute('data-column-index') || 0),
            teacher_key: el.getAttribute('data-teacher-key') || '',
            teacher_name_raw: el.getAttribute('data-teacher-name') || ''
        };
    }

    function snapshotSlot(cell) {
        return {
            periodKey: periodKey(cell),
            day_label: cell.day_label || '',
            period_label: cell.period_label || '',
            period_order: Number(cell.period_order || 0),
            start_time: cell.start_time || '',
            end_time: cell.end_time || '',
            column_index: Number(cell.column_index || 0),
            teacher_key: teacherKey(cell),
            teacher_name_raw: teacherNameOf(cell)
        };
    }

    function applySlot(cell, slot) {
        cell.day_label = slot.day_label || '';
        cell.period_label = slot.period_label || '';
        cell.period_order = Number(slot.period_order || 0);
        cell.start_time = slot.start_time || '';
        cell.end_time = slot.end_time || '';
        cell.column_index = Number(slot.column_index || 0);
        if (Object.prototype.hasOwnProperty.call(slot, 'teacher_name_raw')) {
            cell.teacher_name_raw = slot.teacher_name_raw || '';
        }
    }

    function findCellAtSlot(periodKeyValue, columnIndex, excludeId, teacherName) {
        const held = getHeldSet();
        const targetTeacherKey = teacherKeyFromName(teacherName || '');
        return editorState.draftCells.find(cell => (
            cellId(cell) !== normalizeId(excludeId) &&
            !held.has(cellId(cell)) &&
            periodKey(cell) === periodKeyValue &&
            teacherKey(cell) === targetTeacherKey
        )) || null;
    }

    function updateSelectedField(field, value) {
        const cell = selectedCell();
        if (!cell || !field) return;
        if (field === 'status') cell.status = normalizeStatus(value);
        else cell[field] = value;
        if (field === editorState.invalidCreateField && String(value || '').trim()) editorState.invalidCreateField = '';
        editorState.lastPayload = null;
    }

    function createDraftCellFromSelectedSlot() {
        const slot = editorState.selectedSlot;
        if (!slot) return;
        const form = document.querySelector('[data-eie-new-cell-form="true"]');
        const values = readFormValues(form);
        if (!String(values.class_name_raw || '').trim()) {
            editorState.error = '수업명을 입력해 주세요.';
            editorState.invalidCreateField = 'class_name_raw';
            rerender();
            return;
        }
        const tempId = `temp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        const cell = normalizeCell({
            id: tempId,
            source_type: 'manual',
            day_label: slot.dayLabel,
            period_label: slot.periodLabel,
            period_order: slot.periodOrder,
            start_time: slot.startTime,
            end_time: slot.endTime,
            column_index: slot.columnIndex,
            class_name_raw: values.class_name_raw,
            teacher_name_raw: values.teacher_name_raw || slot.teacherName || '',
            room_raw: values.room_raw,
            status: values.status || 'active',
            memo: values.memo || '',
            raw_meta_json: { source_type: 'manual_draft' }
        });
        editorState.draftCells.push(cell);
        editorState.selectedCellId = tempId;
        editorState.selectedSlot = null;
        editorState.notice = '임시 수업을 추가했습니다. 실제 저장은 다음 API 연결 단계에서 반영됩니다.';
        editorState.error = '';
        editorState.invalidCreateField = '';
        editorState.lastPayload = null;
        rerender();
    }

    function readFormValues(form) {
        const result = {};
        if (!form) return result;
        form.querySelectorAll('[data-eie-edit-field]').forEach(input => {
            result[input.getAttribute('data-eie-edit-field')] = input.value;
        });
        return result;
    }

    function hasCellChanges(cell) {
        const id = cellId(cell);
        if (isTempCell(cell)) return true;
        const original = findServerCell(id);
        if (!original) return true;
        return [...MOVE_FIELDS, ...EDIT_FIELDS].some(field => String(original?.[field] ?? '') !== String(cell?.[field] ?? ''));
    }

    function buildPayload() {
        const originalById = new Map(editorState.serverSnapshot.map(cell => [cellId(cell), cell]));
        const moves = [];
        const updates = [];
        const creates = [];

        editorState.draftCells.forEach(cell => {
            const id = cellId(cell);
            if (isTempCell(cell) || !originalById.has(id)) {
                creates.push({
                    temp_id: id,
                    payload: pickCellPayload(cell)
                });
                return;
            }
            const original = originalById.get(id);
            const moved = MOVE_FIELDS.some(field => String(original?.[field] ?? '') !== String(cell?.[field] ?? ''));
            if (moved) {
                moves.push({
                    cell_id: id,
                    old_day_label: original.day_label || '',
                    old_period_label: original.period_label || '',
                    old_period_order: Number(original.period_order || 0),
                    old_column_index: Number(original.column_index || 0),
                    old_teacher_name_raw: teacherNameOf(original),
                    new_day_label: cell.day_label || '',
                    new_period_label: cell.period_label || '',
                    new_period_order: Number(cell.period_order || 0),
                    new_column_index: Number(cell.column_index || 0),
                    new_teacher_name_raw: teacherNameOf(cell),
                    old_start_time: original.start_time || '',
                    old_end_time: original.end_time || '',
                    new_start_time: cell.start_time || '',
                    new_end_time: cell.end_time || ''
                });
            }

            const payload = {};
            EDIT_FIELDS.forEach(field => {
                if (String(original?.[field] ?? '') !== String(cell?.[field] ?? '')) payload[field] = cell?.[field] ?? '';
            });
            if (Object.keys(payload).length) {
                updates.push({ cell_id: id, payload });
            }
        });

        return {
            version: DRAFT_VERSION,
            edited_at: new Date().toISOString(),
            moves,
            updates,
            creates,
            holding_cells: editorState.holdingSlots.filter(Boolean)
        };
    }

    function pickCellPayload(cell) {
        return {
            day_label: cell.day_label || '',
            period_label: cell.period_label || '',
            period_order: Number(cell.period_order || 0),
            start_time: cell.start_time || '',
            end_time: cell.end_time || '',
            column_index: Number(cell.column_index || 0),
            class_name_raw: cell.class_name_raw || '',
            teacher_name_raw: cell.teacher_name_raw || '',
            room_raw: cell.room_raw || '',
            status: normalizeStatus(cell.status),
            memo: cell.memo || '',
            source_type: 'manual'
        };
    }

    function validateDraft() {
        if (!editorState.isEditMode) return { isValid: true, messages: [] };
        const messages = [];
        const holding = editorState.holdingSlots.filter(Boolean);
        if (holding.length) {
            messages.push(`이동칸에 ${holding.length}개 반이 남아 있습니다. 시간표에 배치하거나 편집을 취소해 주세요.`);
        }
        const seenSlots = new Map();
        const seenIds = new Set();
        editorState.draftCells.forEach(cell => {
            const id = cellId(cell);
            if (seenIds.has(id)) messages.push(`같은 반이 중복으로 들어 있습니다: ${labelOfCell(cell)}`);
            seenIds.add(id);
            if (isHeld(id)) return;
            if (!String(cell.class_name_raw || '').trim()) messages.push('수업명이 비어 있는 셀이 있습니다.');
            const key = `${periodKey(cell)}::${teacherKey(cell)}`;
            if (seenSlots.has(key)) {
                messages.push(`같은 칸에 2개 반이 있습니다: ${labelOfCell(seenSlots.get(key))}, ${labelOfCell(cell)}`);
            } else {
                seenSlots.set(key, cell);
            }
        });
        return { isValid: messages.length === 0, messages };
    }

    function hasDraftChanges() {
        const payload = buildPayload();
        return payload.moves.length || payload.updates.length || payload.creates.length || payload.holding_cells.length;
    }

    function prepareSave() {
        const validation = validateDraft();
        if (!validation.isValid) {
            editorState.error = validation.messages[0] || '저장할 수 없는 상태입니다.';
            editorState.notice = '';
            rerender();
            return;
        }
        const payload = buildPayload();
        editorState.lastPayload = payload;
        editorState.hasPreparedPayload = true;
        editorState.error = '';
        editorState.notice = '저장 전 검증을 통과했습니다. Worker 연결 후 이 payload로 일괄 저장합니다.';
        rerender();
    }

    function setSelectedStatus(status) {
        const cell = selectedCell();
        if (!cell) return;
        cell.status = normalizeStatus(status);
        editorState.notice = `${labelOfCell(cell)} 상태를 ${statusLabel(cell.status)}로 바꿨습니다.`;
        editorState.error = '';
        editorState.lastPayload = null;
        rerender();
    }

    function clearSelection() {
        editorState.selectedCellId = '';
        editorState.selectedSlot = null;
        editorState.error = '';
        editorState.invalidCreateField = '';
        rerender();
    }

    function rerender() {
        if (window.EieRouter && typeof window.EieRouter.open === 'function') {
            window.EieRouter.open('timetable');
        }
    }

    function bindDomEventsOnce() {
        if (eventsBound || typeof document === 'undefined') return;
        document.addEventListener('click', handleClick);
        document.addEventListener('dragstart', handleDragStart);
        document.addEventListener('dragover', handleDragOver);
        document.addEventListener('drop', handleDrop);
        document.addEventListener('input', handleEditInput);
        document.addEventListener('change', handleEditInput);
        window.addEventListener('beforeunload', handleBeforeUnload);
        eventsBound = true;
    }

    function handleBeforeUnload(event) {
        if (!editorState.isEditMode || !hasDraftChanges()) return;
        event.preventDefault();
        event.returnValue = '';
    }

    function handleClick(event) {
        const actionEl = event.target.closest?.('[data-eie-timetable-action]');
        if (actionEl) {
            const action = actionEl.getAttribute('data-eie-timetable-action');
            event.preventDefault();
            handleAction(action, actionEl);
            return;
        }

        const studentEl = event.target.closest?.('[data-eie-student-chip]');
        if (studentEl && !editorState.isEditMode) {
            event.preventDefault();
            openStudentInfo(studentEl.getAttribute('data-cell-id'), studentEl.getAttribute('data-candidate-key'));
            return;
        }

        if (!editorState.isEditMode) return;
        if (event.target.closest('input, textarea, select, button')) return;

        const cellEl = event.target.closest?.('[data-eie-cell-card]');
        if (cellEl) {
            event.preventDefault();
            selectCell(cellEl.getAttribute('data-cell-id'));
            return;
        }

        const holdingEl = event.target.closest?.('[data-eie-holding-slot]');
        if (holdingEl) {
            event.preventDefault();
            const slotIndex = Number(holdingEl.getAttribute('data-holding-index') || 0);
            const value = editorState.holdingSlots[slotIndex];
            if (value) selectCell(value);
            else if (editorState.selectedCellId) moveCellToHolding(editorState.selectedCellId, slotIndex);
            return;
        }

        const slotEl = event.target.closest?.('[data-eie-drop-slot]');
        if (slotEl) {
            event.preventDefault();
            const occupied = slotEl.querySelector('[data-eie-cell-card]');
            if (!occupied && editorState.selectedCellId) {
                moveCellToSlot(editorState.selectedCellId, slotEl);
            } else if (!occupied) {
                selectSlotFromElement(slotEl);
            }
        }
    }

    function handleAction(action) {
        if (action === 'start-edit') return startEditMode();
        if (action === 'exit-edit') return exitEditMode(false);
        if (action === 'reset-edit') return resetEditMode();
        if (action === 'prepare-save') return prepareSave();
        if (action === 'clear-selection') return clearSelection();
        if (action === 'create-draft-cell') return createDraftCellFromSelectedSlot();
        if (action === 'move-selected-to-holding') return moveCellToHolding(editorState.selectedCellId);
        if (action === 'mark-needs-review') return setSelectedStatus('needs_review');
        if (action === 'mark-hidden') return setSelectedStatus('hidden');
        if (action === 'mark-active') return setSelectedStatus('active');
        if (action === 'close-student') return closeStudentInfo();
    }

    function handleDragStart(event) {
        if (!editorState.isEditMode) return;
        const cellEl = event.target.closest?.('[data-eie-cell-card]');
        if (!cellEl) return;
        const id = cellEl.getAttribute('data-cell-id');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', id);
        editorState.selectedCellId = id;
    }

    function handleDragOver(event) {
        if (!editorState.isEditMode) return;
        const dropTarget = event.target.closest?.('[data-eie-drop-slot], [data-eie-holding-slot]');
        if (!dropTarget) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(event) {
        if (!editorState.isEditMode) return;
        const id = event.dataTransfer.getData('text/plain');
        if (!id) return;
        const holdingEl = event.target.closest?.('[data-eie-holding-slot]');
        const slotEl = event.target.closest?.('[data-eie-drop-slot]');
        if (!holdingEl && !slotEl) return;
        event.preventDefault();
        if (holdingEl) return moveCellToHolding(id, Number(holdingEl.getAttribute('data-holding-index') || 0));
        moveCellToSlot(id, slotEl);
    }

    function handleEditInput(event) {
        if (!editorState.isEditMode) return;
        const input = event.target.closest?.('[data-eie-edit-field]');
        if (!input) return;
        const field = input.getAttribute('data-eie-edit-field');
        if (editorState.selectedCellId) updateSelectedField(field, input.value);
    }

    function openStudentInfo(cellId, candidateKey) {
        const selected = EieState.selectStudentCandidate(cellId, candidateKey);
        if (!selected) EieState.setTimetableError('학생을 찾지 못했습니다.');
        rerender();
    }

    function closeStudentInfo() {
        EieState.closeStudentCandidatePanel();
        rerender();
    }

    window.EieTimetableView = {
        async render() {
            bindDomEventsOnce();
            let rows = editorState.isEditMode ? editorState.draftCells : EieState.get().timetableCells;
            let error = '';

            if (!editorState.isEditMode) {
                EieState.setTimetableBusy(true);
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
            }

            const showPanel = editorState.isEditMode || EieState.get().studentCandidatePanelMode === 'detail';

            return `
                <section class="eie-timetable-screen" aria-labelledby="eie-timetable-title">
                    <button type="button" class="eie-back-button"
                            data-eie-route="dashboard"
                            aria-label="EIE 홈으로 이동"
                            title="EIE 홈">← EIE 홈</button>
                    <div class="eie-panel">
                        <h1 id="eie-timetable-title" class="eie-panel-title">EIE 시간표</h1>
                        ${renderEditorToolbar(error)}
                        <div class="${showPanel ? 'eie-timetable-layout' : ''} ${editorState.isEditMode ? 'is-editing' : ''}">
                            <div class="eie-timetable-main">
                                ${renderGrid(rows)}
                            </div>
                            ${showPanel ? `
                                <div class="eie-timetable-side">
                                    ${renderHoldingArea()}
                                    ${renderEditorPanel()}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </section>
            `;
        },

        openStudentInfo,
        closeStudentInfo,
        startEditMode,
        exitEditMode,
        getDraftPayload: buildPayload,
        validateDraft
    };
})();
