(function () {
    const DAY_ORDER = ['월', '화', '수', '목', '금', '토', '일'];
    const FALLBACK_DAY_LABEL = '전체';
    const STATUS_LABELS = {
        active: '활성',
        imported: '활성',
        needs_review: '확인필요',
        hidden: '숨김',
        archived: '보관'
    };

    const viewState = {
        selectedDay: '',
        selectedSessionId: '',
        selectedStudentId: '',
        selectedStudentName: '',
        studentPanelMode: 'detail',
        studentSaving: false,
        studentError: '',
        lastError: ''
    };

    let eventsBound = false;

    function esc(value) {
        if (window.EieApp?.escapeHtml) return window.EieApp.escapeHtml(value);
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch]));
    }

    function asRows(result) {
        if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result?.cells)) return result.cells;
        if (Array.isArray(result?.data)) return result.data;
        if (Array.isArray(result?.rows)) return result.rows;
        return [];
    }

    function normalizeKey(value) {
        return String(value == null ? '' : value).trim();
    }

    function getRawMeta(row) {
        const value = row?.raw_meta_json;
        if (!value) return {};
        if (typeof value === 'object') return value;
        try { return JSON.parse(value); } catch (error) { return {}; }
    }

    function normalizeDay(value) {
        const raw = normalizeKey(value);
        if (!raw) return '';
        const compact = raw.replace(/요일/g, '').trim();
        const found = DAY_ORDER.find(day => compact.includes(day));
        return found || '';
    }

    function normalizeTime(value) {
        const raw = normalizeKey(value);
        if (!raw) return '';
        const match = raw.match(/(\d{1,2})[:시]\s*(\d{1,2})?/);
        if (!match) return raw;
        const hour = Number(match[1]);
        const minute = Number(match[2] || 0);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return raw;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function timeToMinutes(value) {
        const time = normalizeTime(value);
        const match = time.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;
        const hour = Number(match[1]);
        const minute = Number(match[2]);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
        return hour * 60 + minute;
    }

    function minutesToTime(value) {
        const minutes = Number(value);
        if (!Number.isFinite(minutes)) return '';
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function normalizeStatus(value) {
        const status = normalizeKey(value || 'active');
        if (['active', 'imported', 'needs_review', 'hidden', 'archived'].includes(status)) return status;
        return 'active';
    }

    function normalizeStudentName(value) {
        return normalizeKey(value).replace(/\s+/g, ' ');
    }

    function dbStudents() {
        const rows = window.EieState?.get?.()?.db?.students;
        return Array.isArray(rows) ? rows : [];
    }

    function rawOf(row) {
        if (row?.raw && typeof row.raw === 'object') return row.raw;
        if (!row?.raw_meta_json) return {};
        try {
            const parsed = JSON.parse(row.raw_meta_json);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function studentRowId(row) {
        return normalizeKey(row?.id || row?.student_id);
    }

    function studentDisplayName(row) {
        return normalizeStudentName(row?.display_name || row?.name || row?.student_name_raw || row?.normalized_name) || viewState.selectedStudentName || '학생';
    }

    function studentGrade(row) {
        return normalizeKey(row?.grade || row?.grade_raw || rawOf(row).grade || rawOf(row).grade_raw);
    }

    function normalizeGrade(value) {
        const raw = normalizeKey(value).replace(/\s+/g, '');
        const middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return `중${middle[1]}`;
        const high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return `고${high[1]}`;
        return raw;
    }

    function studentSchool(row) {
        return normalizeKey(row?.school_name || row?.school || rawOf(row).school_name || rawOf(row).school);
    }

    function studentPhone(row) {
        return normalizeKey(row?.student_phone || row?.phone || row?.phone_raw || row?.primary_phone || row?.normalized_phone || rawOf(row).student_phone || rawOf(row).phone || rawOf(row).phone_raw || rawOf(row).primary_phone || rawOf(row).normalized_phone);
    }

    function studentMemo(row) {
        return normalizeKey(row?.memo || rawOf(row).memo);
    }

    function studentMeta(row, key) {
        return normalizeKey(row?.[key] || rawOf(row)[key]);
    }

    function studentType(row) {
        return studentMeta(row, 'student_type') || '일반';
    }

    function studentParentPhone(row) {
        return studentMeta(row, 'parent_phone');
    }

    function studentGuardianRelation(row) {
        return studentMeta(row, 'guardian_relation');
    }

    function studentAddress(row) {
        return studentMeta(row, 'student_address');
    }

    function studentVehicleInfo(row) {
        return studentMeta(row, 'vehicle_info');
    }

    function studentPin(row) {
        return studentMeta(row, 'student_pin') || studentMeta(row, 'pin');
    }

    function studentTeacherNames(row) {
        const raw = rawOf(row);
        const values = [];
        if (Array.isArray(row?.teacher_names)) values.push(...row.teacher_names);
        if (Array.isArray(raw.teacher_names)) values.push(...raw.teacher_names);
        values.push(...normalizeKey(row?.teacher_name || row?.teacher_name_raw).split(','));
        values.push(...normalizeKey(raw.teacher_name || raw.teacher_name_raw).split(','));
        return uniqueNames(values);
    }

    function teacherRoster() {
        const values = [];
        const state = window.EieState?.get?.() || {};
        const cells = Array.isArray(state.db?.timetable_cells) ? state.db.timetable_cells : (Array.isArray(state.timetableCells) ? state.timetableCells : []);
        cells.forEach(cell => values.push(...getTeacherNames(cell)));
        dbStudents().forEach(student => values.push(...studentTeacherNames(student)));
        return uniqueNames(values);
    }

    function studentStatus(row) {
        return normalizeKey(row?.status || 'active') || 'active';
    }

    function selectedStudentRecord() {
        const id = normalizeKey(viewState.selectedStudentId);
        const name = normalizeStudentName(viewState.selectedStudentName);
        if (id) {
            const byId = dbStudents().find(row => String(studentRowId(row)) === String(id));
            if (byId) return byId;
        }
        if (name) {
            return dbStudents().find(row => studentDisplayName(row) === name) || null;
        }
        return null;
    }

    function getStudents(row) {
        const assigned = Array.isArray(row?.assigned_students) ? row.assigned_students : [];
        if (assigned.length) {
            return assigned.map((student, index) => ({
                key: normalizeKey(student?.assignment_id || student?.student_id || student?.pin || student?.pin_code || student?.student_pin || student?.id || ''),
                assignment_id: normalizeKey(student?.assignment_id || ''),
                student_id: normalizeKey(student?.student_id || student?.confirmed_student_id || student?.matched_student_id || student?.canonical_student_id || student?.id || ''),
                pin: normalizeKey(student?.pin || student?.pin_code || student?.student_pin || ''),
                name: normalizeStudentName(student?.name || student?.display_name || student?.student_name_raw || ''),
                grade: normalizeKey(student?.grade_raw || student?.grade || ''),
                status: normalizeKey(student?.status || student?.match_status || '')
            })).filter(student => student.name);
        }

        const meta = getRawMeta(row);
        const source = Array.isArray(meta?.student_candidates) ? meta.student_candidates
            : Array.isArray(meta?.student_names) ? meta.student_names
                : Array.isArray(meta?.students) ? meta.students
                    : Array.isArray(meta?.studentSeeds) ? meta.studentSeeds
                        : [];

        return source.map((item, index) => {
            if (typeof item === 'string') {
                return { key: String(index), assignment_id: '', student_id: '', pin: '', name: normalizeStudentName(item), grade: '', status: 'needs_review' };
            }
            return {
                key: normalizeKey(item?.candidate_key || item?.assignment_id || item?.student_id || item?.pin || item?.pin_code || item?.student_pin || item?.id || ''),
                assignment_id: normalizeKey(item?.assignment_id || ''),
                student_id: normalizeKey(item?.student_id || item?.confirmed_student_id || item?.matched_student_id || item?.canonical_student_id || item?.id || ''),
                pin: normalizeKey(item?.pin || item?.pin_code || item?.student_pin || ''),
                name: normalizeStudentName(item?.name || item?.student_name_raw || item?.studentName || ''),
                grade: normalizeKey(item?.grade_raw || item?.grade || ''),
                status: normalizeKey(item?.status || item?.match_status || '')
            };
        }).filter(student => student.name);
    }

    function dedupeStudents(rows) {
        const map = new Map();
        rows.forEach((row, rowIndex) => {
            const rowKey = normalizeKey(row?.id || row?.cell_id || row?.temp_id || row?.source_index || rowIndex);
            getStudents(row).forEach((student, index) => {
                const stableKey = normalizeKey(student.key);
                const name = normalizeStudentName(student.name);
                if (!name) return;

                const key = stableKey
                    ? `id:${stableKey}`
                    : `name:${name}|grade:${normalizeKey(student.grade)}|status:${normalizeKey(student.status)}|row:${rowKey}|index:${index}`;

                if (map.has(key)) return;
                map.set(key, { ...student, name });
            });
        });
        return Array.from(map.values());
    }

    function getClassName(row) {
        return normalizeKey(row?.class_name_raw || row?.class_name || row?.name || '수업명 없음');
    }

    function getTeacherName(row) {
        return normalizeKey(row?.teacher_name_raw || row?.teacher_name || row?.teacher || '미정') || '미정';
    }

    function uniqueNames(rows) {
        const seen = new Set();
        return (Array.isArray(rows) ? rows : []).map(normalizeKey).filter(name => {
            const key = name.toLowerCase();
            if (!name || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function getTeacherNames(row) {
        const meta = getRawMeta(row);
        const values = [];
        if (Array.isArray(row?.teacher_names)) values.push(...row.teacher_names);
        if (Array.isArray(meta.teacher_names)) values.push(...meta.teacher_names);
        values.push(...normalizeKey(row?.teacher_name_raw || row?.teacher_name || row?.teacher).split(','));
        return uniqueNames(values);
    }

    function getTeacherDisplayName(row) {
        const names = getTeacherNames(row);
        return names.length ? names.join(', ') : getTeacherName(row);
    }

    function teacherKey(value) {
        return normalizeKey(value || '미정').toLowerCase();
    }

    function isPrepCell(row) {
        const meta = getRawMeta(row);
        const text = [getClassName(row), row?.class_name_raw, row?.memo, meta?.session_type, meta?.type]
            .map(value => String(value || '').toLowerCase())
            .join(' ');
        return /\bprep\b|프렙|준비/.test(text);
    }

    function cellId(row, index) {
        return normalizeKey(row?.id || row?.cell_id || row?.temp_id || `row_${index}`);
    }

    function normalizeCell(row, index) {
        const start = normalizeTime(row?.start_time || row?.start || row?.from_time || '');
        const end = normalizeTime(row?.end_time || row?.end || row?.to_time || '');
        const startMinutes = timeToMinutes(start);
        const endMinutes = timeToMinutes(end);
        const fallbackStart = Number(row?.period_order || row?.period_no || index || 0);
        return {
            ...(row || {}),
            source_index: index,
            id: cellId(row, index),
            day: normalizeDay(row?.day_of_week || row?.day_label || row?.day || '') || FALLBACK_DAY_LABEL,
            teacher_name: getTeacherDisplayName(row),
            teacher_key: teacherKey(getTeacherName(row)),
            class_name: getClassName(row),
            start_time: start,
            end_time: end,
            start_minutes: Number.isFinite(startMinutes) ? startMinutes : null,
            end_minutes: Number.isFinite(endMinutes) ? endMinutes : null,
            period_order: Number.isFinite(Number(row?.period_order)) ? Number(row.period_order) : fallbackStart,
            status: normalizeStatus(row?.status),
            students: getStudents(row),
            memo: normalizeKey(row?.memo || ''),
            room: normalizeKey(row?.room_raw || row?.room_name || ''),
            is_prep: isPrepCell(row)
        };
    }

    function sortByTime(rows) {
        return [...rows].sort((a, b) => {
            const aTime = a.start_minutes ?? (a.period_order * 10000) ?? 0;
            const bTime = b.start_minutes ?? (b.period_order * 10000) ?? 0;
            if (aTime !== bTime) return aTime - bTime;
            const teacherCompare = a.teacher_name.localeCompare(b.teacher_name, 'ko');
            if (teacherCompare) return teacherCompare;
            return a.class_name.localeCompare(b.class_name, 'ko');
        });
    }

    function canMerge(previous, next) {
        if (!previous || !next) return false;
        if (previous.is_prep || next.is_prep) return false;
        if (previous.day !== next.day) return false;
        if (previous.teacher_key !== next.teacher_key) return false;
        if (previous.class_name !== next.class_name) return false;
        if (!Number.isFinite(previous.end_minutes) || !Number.isFinite(next.start_minutes)) return false;
        return previous.end_minutes === next.start_minutes;
    }

    function makeSession(cells, index) {
        const ordered = sortByTime(cells);
        const first = ordered[0] || {};
        const last = ordered[ordered.length - 1] || first;
        const startMinutes = ordered.map(cell => cell.start_minutes).filter(Number.isFinite).sort((a, b) => a - b)[0] ?? null;
        const endMinutes = ordered.map(cell => cell.end_minutes).filter(Number.isFinite).sort((a, b) => b - a)[0] ?? null;
        const startTime = Number.isFinite(startMinutes) ? minutesToTime(startMinutes) : (first.start_time || '');
        const endTime = Number.isFinite(endMinutes) ? minutesToTime(endMinutes) : (last.end_time || '');
        const students = dedupeStudents(ordered);
        const mergedStatus = ordered.find(cell => cell.status === 'needs_review')?.status
            || ordered.find(cell => cell.status === 'hidden')?.status
            || ordered.find(cell => cell.status === 'archived')?.status
            || first.status
            || 'active';

        return {
            session_id: `session_${ordered.map(cell => cell.id).join('_') || index}`,
            source_cell_ids: ordered.map(cell => cell.id),
            source_rows: ordered,
            day: first.day || '',
            teacher_name: first.teacher_name || '미정',
            teacher_key: first.teacher_key || 'unknown',
            class_name: first.class_name || '수업명 없음',
            start_time: startTime,
            end_time: endTime,
            start_minutes: Number.isFinite(startMinutes) ? startMinutes : null,
            end_minutes: Number.isFinite(endMinutes) ? endMinutes : null,
            duration_minutes: Number.isFinite(startMinutes) && Number.isFinite(endMinutes) ? Math.max(0, endMinutes - startMinutes) : 0,
            status: normalizeStatus(mergedStatus),
            students,
            student_count: students.length,
            memo: ordered.map(cell => cell.memo).filter(Boolean).join(' / '),
            room: first.room || '',
            is_merged: ordered.length > 1,
            merge_type: ordered.length > 1 ? 'auto' : 'single'
        };
    }

    function buildDisplaySessions(rawRows) {
        const normalized = sortByTime((rawRows || [])
            .map(normalizeCell)
            .filter(cell => !cell.is_prep));
        const grouped = new Map();
        normalized.forEach(cell => {
            const key = [cell.day, cell.teacher_key, cell.class_name].join('::');
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key).push(cell);
        });

        const sessions = [];
        grouped.forEach(cells => {
            const ordered = sortByTime(cells);
            let bucket = [];
            ordered.forEach(cell => {
                const previous = bucket[bucket.length - 1];
                if (previous && canMerge(previous, cell)) {
                    bucket.push(cell);
                    return;
                }
                if (bucket.length) sessions.push(makeSession(bucket, sessions.length));
                bucket = [cell];
            });
            if (bucket.length) sessions.push(makeSession(bucket, sessions.length));
        });

        return sortByTime(sessions);
    }

    function daySortValue(day) {
        if (day === FALLBACK_DAY_LABEL) return 98;
        const index = DAY_ORDER.indexOf(day);
        return index >= 0 ? index : 99;
    }

    function getAvailableDays(sessions) {
        const days = Array.from(new Set((sessions || []).map(session => session.day).filter(Boolean)));
        return days.sort((a, b) => daySortValue(a) - daySortValue(b) || a.localeCompare(b, 'ko'));
    }

    function todayLabel() {
        const day = new Date().getDay();
        return ['일', '월', '화', '수', '목', '금', '토'][day] || '월';
    }

    function ensureSelectedDay(days) {
        if (!days.length) return '';
        if (viewState.selectedDay && days.includes(viewState.selectedDay)) return viewState.selectedDay;
        const today = todayLabel();
        viewState.selectedDay = days.includes(today) ? today : days[0];
        return viewState.selectedDay;
    }

    function buildTeacherColumns(sessions) {
        const map = new Map();
        (sessions || []).forEach((session, index) => {
            if (!map.has(session.teacher_key)) {
                map.set(session.teacher_key, {
                    key: session.teacher_key,
                    label: session.teacher_name || '미정',
                    firstIndex: index,
                    count: 0
                });
            }
            map.get(session.teacher_key).count += 1;
        });
        return Array.from(map.values()).sort((a, b) => a.firstIndex - b.firstIndex || a.label.localeCompare(b.label, 'ko'));
    }

    function buildTimeBoundaries(sessions) {
        const values = [];
        (sessions || []).forEach(session => {
            if (Number.isFinite(session.start_minutes)) values.push(session.start_minutes);
            if (Number.isFinite(session.end_minutes)) values.push(session.end_minutes);
        });
        const unique = Array.from(new Set(values)).sort((a, b) => a - b);
        if (unique.length >= 2) return unique;
        return [];
    }

    function rowIndexForMinute(boundaries, minute, fallback) {
        const index = boundaries.indexOf(minute);
        if (index >= 0) return index + 2;
        return fallback;
    }

    function statusLabel(status) {
        return STATUS_LABELS[normalizeStatus(status)] || '활성';
    }

    function studentDetailId(student) {
        return normalizeKey(student?.student_id || student?.id || student?.studentId || student?.confirmed_student_id || student?.matched_student_id || student?.canonical_student_id || '');
    }

    function studentSearchName(student) {
        return normalizeStudentName(student?.name || '');
    }

    function studentChipName(name) {
        const text = normalizeStudentName(name);
        const chars = Array.from(text);
        return chars.length > 3 ? chars.slice(0, 3).join('') : text;
    }

    function returnContextFor(options) {
        return {
            from: 'timetable-v2',
            route: 'timetable-v2',
            selectedDay: normalizeKey(options?.day || viewState.selectedDay || ''),
            sessionId: normalizeKey(options?.sessionId || ''),
            cellId: normalizeKey(options?.cellId || '')
        };
    }

    function contextAttrs(context) {
        const ctx = context || {};
        return [
            ctx.selectedDay ? `data-eie-v2-return-day="${esc(ctx.selectedDay)}"` : '',
            ctx.sessionId ? `data-eie-v2-return-session="${esc(ctx.sessionId)}"` : '',
            ctx.cellId ? `data-eie-v2-return-cell="${esc(ctx.cellId)}"` : ''
        ].filter(Boolean).join(' ');
    }

    function renderStudentNames(students, options) {
        const list = Array.isArray(students) ? students : [];
        const shouldLink = !!options?.linkStudents;
        if (!list.length) return '<div class="eie-v2-student-empty">학생 없음</div>';
        return `
            <div class="eie-v2-student-list" aria-label="학생 명단">
                ${list.map(student => {
                    const id = studentDetailId(student);
                    const name = studentSearchName(student);
                    const context = returnContextFor(options);
                    if (shouldLink && (id || name)) {
                        return `<button type="button"
                            class="eie-v2-student-chip is-clickable"
                            ${id ? `data-eie-v2-student-id="${esc(id)}"` : ''}
                            ${!id && name ? `data-eie-v2-student-name="${esc(name)}"` : ''}
                            ${contextAttrs(context)}
                            title="${esc(name || student.name || '학생')}"
                            aria-label="${esc(name || '학생')} 학생관리 열기">${esc(studentChipName(name || student.name))}</button>`;
                    }
                    return `<span class="eie-v2-student-chip" title="${esc(student.name || '')}">${esc(studentChipName(student.name))}</span>`;
                }).join('')}
            </div>
        `;
    }

    function renderSessionCard(session, layout) {
        const status = normalizeStatus(session.status);
        const isSpecial = status !== 'active' && status !== 'imported';
        const durationClass = session.duration_minutes >= 70 ? 'is-long-session' : 'is-short-session';
        const rowStart = rowIndexForMinute(layout.boundaries, session.start_minutes, 2);
        const rowEnd = rowIndexForMinute(layout.boundaries, session.end_minutes, rowStart + 1);
        const columnStart = (layout.teacherIndex.get(session.teacher_key) || 0) + 2;
        const isSelected = viewState.selectedSessionId === session.session_id;
        const time = [session.start_time, session.end_time].filter(Boolean).join('~') || '시간 미정';
        return `
            <div role="button" tabindex="0"
                class="eie-v2-session-card ${durationClass} ${isSelected ? 'is-selected' : ''}"
                data-eie-v2-session="${esc(session.session_id)}"
                style="grid-column:${columnStart};grid-row:${rowStart} / ${Math.max(rowEnd, rowStart + 1)};"
                aria-label="${esc(session.class_name)} 상세 보기">
                <span class="eie-v2-session-topline">
                    <strong>${esc(session.class_name)}</strong>
                    ${isSpecial ? `<em class="eie-v2-status-badge is-${esc(status)}">${esc(statusLabel(status))}</em>` : ''}
                </span>
                <span class="eie-v2-session-time">${esc(time)}</span>
                ${renderStudentNames(session.students, { linkStudents: true, day: session.day, sessionId: session.session_id, cellId: session.source_cell_ids?.[0] || '' })}
                <span class="eie-v2-hover-card" role="tooltip">
                    <b>${esc(session.class_name)}</b>
                    <small>${esc(time)} · 학생 ${session.student_count.toLocaleString('ko-KR')}명</small>
                    ${renderStudentNames(session.students, { linkStudents: true, day: session.day, sessionId: session.session_id, cellId: session.source_cell_ids?.[0] || '' })}
                </span>
            </div>
        `;
    }

    function renderEmptyCells(layout) {
        const cells = [];
        const rowCount = Math.max(0, layout.boundaries.length - 1);
        for (let row = 0; row < rowCount; row += 1) {
            const label = `${minutesToTime(layout.boundaries[row])}~${minutesToTime(layout.boundaries[row + 1])}`;
            cells.push(`
                <div class="eie-v2-time-cell" style="grid-column:1;grid-row:${row + 2};">
                    <strong>${esc(minutesToTime(layout.boundaries[row]))}</strong>
                    <small>${esc(label)}</small>
                </div>
            `);
            layout.teachers.forEach((teacher, index) => {
                cells.push(`<div class="eie-v2-empty-slot" style="grid-column:${index + 2};grid-row:${row + 2};" aria-hidden="true"></div>`);
            });
        }
        return cells.join('');
    }

    function renderTeacherHeaders(layout) {
        return layout.teachers.map((teacher, index) => `
            <div class="eie-v2-teacher-header" style="grid-column:${index + 2};grid-row:1;">
                <strong>${esc(teacher.label)}</strong>
                <small>${teacher.count.toLocaleString('ko-KR')}개 수업</small>
            </div>
        `).join('');
    }

    function renderDayTabs(days, selectedDay) {
        if (!days.length) return '';
        return `
            <div class="eie-v2-day-tabs" role="tablist" aria-label="요일 선택">
                ${days.map(day => `
                    <button type="button" class="eie-v2-day-tab ${day === selectedDay ? 'is-active' : ''}" data-eie-v2-day="${esc(day)}" role="tab" aria-selected="${day === selectedDay ? 'true' : 'false'}">
                        ${esc(day)}
                    </button>
                `).join('')}
            </div>
        `;
    }

    function renderStudentField(label, value) {
        return `
            <div class="eie-v2-student-field">
                <span>${esc(label)}</span>
                <strong>${esc(value || '미등록')}</strong>
            </div>
        `;
    }

    function renderGradeSelect(id, value) {
        const selected = normalizeGrade(value);
        return `<select id="${esc(id)}">
            <option value="">선택</option>
            ${['중1', '중2', '중3', '고1', '고2', '고3'].map(grade => `<option value="${esc(grade)}"${selected === grade ? ' selected' : ''}>${esc(grade)}</option>`).join('')}
        </select>`;
    }

    function renderStudentTypeSelect(id, value) {
        const selected = value || '일반';
        return `<select id="${esc(id)}">
            ${['일반', '신입', '재등록', '휴원'].map(type => `<option value="${esc(type)}"${selected === type ? ' selected' : ''}>${esc(type)}</option>`).join('')}
        </select>`;
    }

    function renderStudentTeacherPicker(student) {
        const selected = studentTeacherNames(student);
        let roster = teacherRoster();
        if (!roster.length && selected.length) roster = selected;
        if (!roster.length) return '';
        return `
            <div class="eie-v2-student-teacher-picker">
                <span>담당 선생님</span>
                <div class="eie-apms-teacher-options">
                    ${roster.map(name => `
                        <label class="eie-apms-teacher-option">
                            <input type="checkbox" name="eie-v2-edit-teacher" value="${esc(name)}"${selected.includes(name) ? ' checked' : ''}>
                            <span>${esc(name)}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderStudentPanel() {
        if (!viewState.selectedStudentId && !viewState.selectedStudentName) return '';
        const student = selectedStudentRecord() || {
            id: viewState.selectedStudentId,
            display_name: viewState.selectedStudentName,
            status: 'active'
        };
        if (viewState.studentPanelMode === 'edit') return renderStudentEditPanel(student);
        const sid = studentRowId(student) || viewState.selectedStudentId;
        return `
            <aside class="eie-v2-detail-panel eie-v2-student-panel" aria-label="${esc(studentDisplayName(student))} 학생 상세">
                <div class="eie-v2-detail-head">
                    <span>학생 상세</span>
                    <h3>${esc(studentDisplayName(student))}</h3>
                    <p>${esc([studentSchool(student), studentGrade(student)].filter(Boolean).join(' · ') || '학적 정보 미등록')}</p>
                    ${viewState.studentError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.studentError)}</div>` : ''}
                    <div class="eie-v2-detail-actions">
                        <button type="button" class="eie-secondary-button" data-eie-v2-student-back>수업 상세</button>
                        ${sid ? '<button type="button" class="eie-primary-button" data-eie-v2-student-edit>수정</button>' : ''}
                    </div>
                </div>
                ${sid ? '' : '<div class="eie-v2-detail-section"><p>확정된 학생 id가 없어 이 패널에서 바로 수정할 수 없습니다. 학생관리에서 이름으로 확인해 주세요.</p></div>'}
                <div class="eie-v2-detail-section">
                    <strong>기본정보</strong>
                    <div class="eie-v2-student-field-grid">
                        ${renderStudentField('학생명', studentDisplayName(student))}
                        ${renderStudentField('학생구분', studentType(student))}
                        ${renderStudentField('학년', studentGrade(student))}
                        ${renderStudentField('학교', studentSchool(student))}
                        ${renderStudentField('상태', statusLabel(studentStatus(student)))}
                        ${renderStudentField('학생 연락처', studentPhone(student))}
                        ${renderStudentField('학부모 연락처', studentParentPhone(student))}
                        ${renderStudentField('보호자 관계', studentGuardianRelation(student))}
                        ${renderStudentField('주소', studentAddress(student))}
                        ${renderStudentField('차량', studentVehicleInfo(student))}
                        ${renderStudentField('PIN', studentPin(student))}
                        ${renderStudentField('담당 선생님', studentTeacherNames(student).join(', '))}
                    </div>
                </div>
                <div class="eie-v2-detail-section">
                    <strong>메모</strong>
                    <p>${esc(studentMemo(student) || '메모가 없습니다.')}</p>
                </div>
            </aside>
        `;
    }

    function renderStudentEditPanel(student) {
        const saving = viewState.studentSaving;
        return `
            <aside class="eie-v2-detail-panel eie-v2-student-panel" aria-label="${esc(studentDisplayName(student))} 학생 수정">
                <div class="eie-v2-detail-head">
                    <span>학생 수정</span>
                    <h3>${esc(studentDisplayName(student))}</h3>
                    ${viewState.studentError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.studentError)}</div>` : ''}
                </div>
                <div class="eie-v2-student-form">
                    <label><span>학생명</span><input id="eie-v2-edit-name" type="text" value="${esc(studentDisplayName(student))}" autocomplete="off"></label>
                    <div class="eie-v2-form-row">
                        <label><span>학생구분</span>${renderStudentTypeSelect('eie-v2-edit-student-type', studentType(student))}</label>
                        <label><span>학년</span>${renderGradeSelect('eie-v2-edit-grade', studentGrade(student))}</label>
                    </div>
                    <label><span>학교</span><input id="eie-v2-edit-school" type="text" value="${esc(studentSchool(student))}" autocomplete="off"></label>
                    <label><span>학생 연락처</span><input id="eie-v2-edit-phone" type="tel" value="${esc(studentPhone(student))}" autocomplete="off"></label>
                    <label><span>학부모 연락처</span><input id="eie-v2-edit-parent-phone" type="tel" value="${esc(studentParentPhone(student))}" autocomplete="off"></label>
                    <label><span>주소</span><input id="eie-v2-edit-address" type="text" value="${esc(studentAddress(student))}" autocomplete="off"></label>
                    <label><span>차량</span><input id="eie-v2-edit-vehicle" type="text" value="${esc(studentVehicleInfo(student))}" autocomplete="off"></label>
                    ${renderStudentTeacherPicker(student)}
                    <details class="eie-v2-extra-fields">
                        <summary>추가 정보</summary>
                        <div class="eie-v2-extra-fields-body">
                            <label><span>보호자 관계</span><input id="eie-v2-edit-guardian-relation" type="text" value="${esc(studentGuardianRelation(student))}" autocomplete="off"></label>
                            <label><span>PIN</span><input id="eie-v2-edit-pin" type="text" inputmode="numeric" maxlength="4" value="${esc(studentPin(student))}" autocomplete="off"></label>
                            <label><span>상태</span><select id="eie-v2-edit-status">
                                ${['active', 'inactive', 'needs_review', 'archived'].map(status => `<option value="${esc(status)}"${studentStatus(student) === status ? ' selected' : ''}>${esc(statusLabel(status))}</option>`).join('')}
                            </select></label>
                            <label class="is-wide"><span>메모</span><textarea id="eie-v2-edit-memo">${esc(studentMemo(student))}</textarea></label>
                        </div>
                    </details>
                </div>
                <div class="eie-v2-detail-actions">
                    <button type="button" class="eie-primary-button" data-eie-v2-student-save ${saving ? 'disabled' : ''}>${saving ? '저장 중...' : '저장'}</button>
                    <button type="button" class="eie-secondary-button" data-eie-v2-student-cancel ${saving ? 'disabled' : ''}>취소</button>
                </div>
            </aside>
        `;
    }

    function renderSelectedPanel(session) {
        const studentPanel = renderStudentPanel();
        if (studentPanel) return studentPanel;
        if (!session) {
            return `
                <aside class="eie-v2-detail-panel is-empty" aria-label="수업 상세">
                    <h3>수업을 선택하세요</h3>
                    <p>시간표에서 수업을 클릭하면 학생 명단과 원본 정보를 확인할 수 있습니다.</p>
                </aside>
            `;
        }
        const time = [session.start_time, session.end_time].filter(Boolean).join('~') || '시간 미정';
        const rawRows = session.source_rows || [];
        const firstCellId = normalizeKey(session.source_cell_ids?.[0] || rawRows?.[0]?.id || '');
        return `
            <aside class="eie-v2-detail-panel" aria-label="${esc(session.class_name)} 상세">
                <div class="eie-v2-detail-head">
                    <span>${esc(session.day)}요일 · ${esc(session.teacher_name)}</span>
                    <h3>${esc(session.class_name)}</h3>
                    <p>${esc(time)}</p>
                    ${firstCellId ? `
                        <div class="eie-v2-detail-actions">
                            <button type="button" class="eie-secondary-button" data-eie-v2-open-classroom="${esc(firstCellId)}" aria-label="클래스룸에서 이 수업 보기">클래스룸</button>
                        </div>
                    ` : ''}
                </div>
                <div class="eie-v2-detail-section">
                    <strong>학생 ${session.student_count.toLocaleString('ko-KR')}명</strong>
                    ${renderStudentNames(session.students, { linkStudents: true, day: session.day, sessionId: session.session_id, cellId: firstCellId })}
                </div>
                ${session.memo ? `
                    <div class="eie-v2-detail-section">
                        <strong>메모</strong>
                        <p>${esc(session.memo)}</p>
                    </div>
                ` : ''}
                <div class="eie-v2-detail-section">
                    <strong>상태</strong>
                    <p>${esc(statusLabel(session.status))}</p>
                </div>
                <div class="eie-v2-detail-section">
                    <strong>원본 데이터</strong>
                    <p>${rawRows.length.toLocaleString('ko-KR')}개 row${session.is_merged ? ' 병합' : ''}</p>
                    <ul class="eie-v2-source-list">
                        ${rawRows.map(row => {
                            const rowId = normalizeKey(row?.id || row?.cell_id || '');
                            return `<li>
                                <span>#${esc(rowId || '-')} · ${esc(row.start_time || '')}~${esc(row.end_time || '')}</span>
                                ${rowId ? `<button type="button" class="eie-v2-source-link" data-eie-v2-open-classroom="${esc(rowId)}" aria-label="원본 수업칸 클래스룸 열기">클래스룸</button>` : ''}
                            </li>`;
                        }).join('')}
                    </ul>
                </div>
            </aside>
        `;
    }

    function renderMobileList(daySessions) {
        const teachers = buildTeacherColumns(daySessions);
        return `
            <div class="eie-v2-mobile-list">
                ${teachers.map(teacher => {
                    const sessions = daySessions.filter(session => session.teacher_key === teacher.key);
                    return `
                        <details class="eie-v2-mobile-teacher" open>
                            <summary>${esc(teacher.label)} <span>${sessions.length.toLocaleString('ko-KR')}개</span></summary>
                            ${sessions.map(session => `
                                <div role="button" tabindex="0" class="eie-v2-mobile-card" data-eie-v2-session="${esc(session.session_id)}">
                                    <strong>${esc(session.class_name)}</strong>
                                    <small>${esc([session.start_time, session.end_time].filter(Boolean).join('~') || '시간 미정')}</small>
                                    ${renderStudentNames(session.students, { linkStudents: true, day: session.day, sessionId: session.session_id, cellId: session.source_cell_ids?.[0] || '' })}
                                </div>
                            `).join('') || '<div class="eie-v2-empty-mobile">수업 없음</div>'}
                        </details>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderBoard(daySessions) {
        const teachers = buildTeacherColumns(daySessions);
        const boundaries = buildTimeBoundaries(daySessions);
        if (!daySessions.length) {
            return '<div class="eie-v2-empty-state">선택한 요일에 표시할 수업이 없습니다.</div>';
        }
        if (!boundaries.length || !teachers.length) {
            return '<div class="eie-v2-empty-state">시간 정보가 부족해서 v2 시간표를 만들 수 없습니다.</div>';
        }
        const teacherIndex = new Map(teachers.map((teacher, index) => [teacher.key, index]));
        const layout = { teachers, boundaries, teacherIndex };
        return `
            <div class="eie-v2-board-wrap" aria-label="EIE 시간표 v2 보드">
                <div class="eie-v2-board" style="--eie-v2-teacher-count:${teachers.length};--eie-v2-row-count:${Math.max(1, boundaries.length - 1)};">
                    <div class="eie-v2-corner" style="grid-column:1;grid-row:1;">시간</div>
                    ${renderTeacherHeaders(layout)}
                    ${renderEmptyCells(layout)}
                    ${daySessions.map(session => renderSessionCard(session, layout)).join('')}
                </div>
            </div>
            ${renderMobileList(daySessions)}
        `;
    }

    async function loadRows() {
        const stateRows = Array.isArray(window.EieState?.get?.()?.timetableCells)
            ? window.EieState.get().timetableCells
            : [];
        if (!window.EieApi?.getTimetable) return { rows: stateRows, error: '' };
        try {
            const result = await window.EieApi.getTimetable(null, { status: 'active,needs_review,hidden' });
            const rows = asRows(result);
            if (window.EieState?.setTimetableCells) window.EieState.setTimetableCells(rows);
            return { rows, error: result?.fallback ? result.error || '' : '' };
        } catch (error) {
            return { rows: stateRows, error: error?.message || '시간표를 불러오지 못했습니다.' };
        }
    }

    function homeRoute() {
        const role = String(window.localStorage?.getItem?.('WANGJI_EIE_ROLE') || '').toLowerCase();
        return role === 'teacher' || role === 'eieteacher' ? 'teacher' : 'dashboard';
    }

    function renderHeader(days, selectedDay, error) {
        const route = homeRoute();
        return `
            <div class="eie-v2-page-head">
                <div>
                    <button type="button" class="eie-back-button" data-eie-route="${esc(route)}" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>
                    <h1>시간표</h1>
                </div>
                <div class="eie-v2-head-actions">
                    <button type="button" class="eie-secondary-button" data-eie-route="timetable-editor" aria-label="시간표 편집 열기">편집</button>
                </div>
            </div>
            ${error ? `<div class="eie-v2-alert" role="alert">${esc(error)}</div>` : ''}
            ${renderDayTabs(days, selectedDay)}
        `;
    }

    function bindEvents() {
        if (eventsBound) return;
        document.addEventListener('click', event => {
            const studentButton = event.target.closest?.('[data-eie-v2-student-id],[data-eie-v2-student-name]');
            if (studentButton) {
                event.preventDefault();
                event.stopPropagation();
                openStudentLedgerFromTimetable(studentButton);
                return;
            }
            const dayButton = event.target.closest?.('[data-eie-v2-day]');
            if (dayButton) {
                event.preventDefault();
                viewState.selectedDay = dayButton.getAttribute('data-eie-v2-day') || '';
                viewState.selectedSessionId = '';
                clearStudentPanel();
                if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
                return;
            }
            const sessionButton = event.target.closest?.('[data-eie-v2-session]');
            if (sessionButton) {
                event.preventDefault();
                viewState.selectedSessionId = sessionButton.getAttribute('data-eie-v2-session') || '';
                clearStudentPanel();
                if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
                return;
            }
            const backButton = event.target.closest?.('[data-eie-v2-student-back]');
            if (backButton) {
                event.preventDefault();
                clearStudentPanel();
                if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
                return;
            }
            const editStudentButton = event.target.closest?.('[data-eie-v2-student-edit]');
            if (editStudentButton) {
                event.preventDefault();
                viewState.studentPanelMode = 'edit';
                viewState.studentError = '';
                if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
                return;
            }
            const cancelStudentButton = event.target.closest?.('[data-eie-v2-student-cancel]');
            if (cancelStudentButton) {
                event.preventDefault();
                viewState.studentPanelMode = 'detail';
                viewState.studentError = '';
                if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
                return;
            }
            const saveStudentButton = event.target.closest?.('[data-eie-v2-student-save]');
            if (saveStudentButton) {
                event.preventDefault();
                saveStudentFromPanel();
                return;
            }
            const classroomButton = event.target.closest?.('[data-eie-v2-open-classroom]');
            if (classroomButton) {
                event.preventDefault();
                const cellId = classroomButton.getAttribute('data-eie-v2-open-classroom') || '';
                if (cellId && window.EieClassroomView?.openDetail) {
                    window.EieClassroomView.openDetail(cellId);
                } else if (window.EieRouter?.open) {
                    window.EieRouter.open('classroom');
                }
                return;
            }
            const refreshButton = event.target.closest?.('[data-eie-v2-refresh]');
            if (refreshButton) {
                event.preventDefault();
                viewState.selectedSessionId = '';
                clearStudentPanel();
                if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            }
        });
        eventsBound = true;
    }

    function openStudentLedgerFromTimetable(button) {
        const studentId = button.getAttribute('data-eie-v2-student-id') || '';
        const studentName = button.getAttribute('data-eie-v2-student-name') || button.textContent || '';
        viewState.selectedStudentId = normalizeKey(studentId);
        viewState.selectedStudentName = normalizeStudentName(studentName);
        viewState.selectedSessionId = button.getAttribute('data-eie-v2-return-session') || viewState.selectedSessionId;
        viewState.selectedDay = button.getAttribute('data-eie-v2-return-day') || viewState.selectedDay;
        viewState.studentPanelMode = viewState.selectedStudentId ? 'edit' : 'detail';
        viewState.studentError = '';
        if (viewState.selectedStudentId && window.EieApmsState?.loadFoundation) {
            window.EieApmsState.loadFoundation({ force: true }).catch(() => null).then(() => {
                if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            });
            return;
        }
        if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
    }

    function clearStudentPanel() {
        viewState.selectedStudentId = '';
        viewState.selectedStudentName = '';
        viewState.studentPanelMode = 'detail';
        viewState.studentError = '';
        viewState.studentSaving = false;
    }

    function studentFieldValue(id) {
        const el = document.getElementById(id);
        return normalizeKey(el && el.value);
    }

    function selectedStudentTeacherNames() {
        if (!document.querySelectorAll) return [];
        return uniqueNames(Array.from(document.querySelectorAll('input[name="eie-v2-edit-teacher"]:checked')).map(input => input.value));
    }

    async function refreshStudentFoundation(row) {
        if (row && row.id && window.EieState?.upsertStudent) window.EieState.upsertStudent(row);
        if (row && row.id && window.EieApmsState?.syncStudent) window.EieApmsState.syncStudent(row);
        if (window.EieApmsState?.loadFoundation) {
            await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
        }
    }

    async function saveStudentFromPanel() {
        if (viewState.studentSaving) return;
        const sid = normalizeKey(viewState.selectedStudentId);
        if (!sid || !window.EieApi?.updateStudent) {
            viewState.studentError = '학생 id가 없어 시간표 패널에서 바로 수정할 수 없습니다.';
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            return;
        }
        const payload = {
            display_name: studentFieldValue('eie-v2-edit-name'),
            name: studentFieldValue('eie-v2-edit-name'),
            grade: studentFieldValue('eie-v2-edit-grade'),
            school_name: studentFieldValue('eie-v2-edit-school'),
            phone: studentFieldValue('eie-v2-edit-phone'),
            student_phone: studentFieldValue('eie-v2-edit-phone'),
            parent_phone: studentFieldValue('eie-v2-edit-parent-phone'),
            guardian_relation: studentFieldValue('eie-v2-edit-guardian-relation'),
            student_address: studentFieldValue('eie-v2-edit-address'),
            vehicle_info: studentFieldValue('eie-v2-edit-vehicle'),
            student_pin: studentFieldValue('eie-v2-edit-pin'),
            student_type: studentFieldValue('eie-v2-edit-student-type') || '일반',
            teacher_names: selectedStudentTeacherNames(),
            status: studentFieldValue('eie-v2-edit-status') || 'active',
            memo: studentFieldValue('eie-v2-edit-memo')
        };
        if (!payload.display_name) {
            viewState.studentError = '학생명은 필수입니다.';
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            return;
        }
        if (payload.student_pin && !/^\d{4}$/.test(payload.student_pin)) {
            viewState.studentError = 'PIN은 4자리 숫자로 입력해 주세요.';
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            return;
        }
        viewState.studentSaving = true;
        viewState.studentError = '';
        try {
            const result = await window.EieApi.updateStudent(sid, payload);
            const row = result?.student || result?.data || { id: sid, ...payload };
            viewState.selectedStudentId = normalizeKey(row.id || row.student_id || sid);
            viewState.selectedStudentName = studentDisplayName(row);
            viewState.studentPanelMode = 'detail';
            await refreshStudentFoundation(row);
        } catch (error) {
            viewState.studentError = error?.message || '학생 정보를 저장하지 못했습니다.';
        } finally {
            viewState.studentSaving = false;
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
        }
    }

    function refresh() {
        viewState.selectedSessionId = '';
        if (window.EieRouter?.open) return window.EieRouter.open('timetable-v2');
    }

    function openWithContext(returnCtx) {
        const ctx = returnCtx || {};
        viewState.selectedDay = normalizeKey(ctx.selectedDay || ctx.day || viewState.selectedDay);
        viewState.selectedSessionId = normalizeKey(ctx.sessionId || ctx.session_id || viewState.selectedSessionId);
        if (window.EieRouter?.open) return window.EieRouter.open('timetable-v2');
    }

    async function render() {
        bindEvents();
        const { rows, error } = await loadRows();
        const sessions = buildDisplaySessions(rows);
        const days = getAvailableDays(sessions);
        const selectedDay = ensureSelectedDay(days);
        const daySessions = sessions.filter(session => session.day === selectedDay);
        const selectedSession = sessions.find(session => session.session_id === viewState.selectedSessionId) || null;
        return `
            <section class="eie-v2-screen" aria-labelledby="eie-v2-title">
                ${renderHeader(days, selectedDay, error)}
                <div class="eie-v2-layout">
                    <div class="eie-v2-main">
                        ${renderBoard(daySessions)}
                    </div>
                    ${renderSelectedPanel(selectedSession)}
                </div>
            </section>
        `;
    }

    window.EieTimetableV2View = {
        render,
        refresh,
        openWithContext,
        _buildDisplaySessions: buildDisplaySessions
    };
})();
