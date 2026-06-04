(function () {
    const DAY_ORDER = ['월', '화', '수', '목', '금', '토', '일'];
    const DEFAULT_EIE_TEACHERS = ['Carmen', 'IVY', 'Lily', 'Zoe', 'Stacy', 'Foreigner'];
    const FALLBACK_DAY_LABEL = '전체';
    const STATUS_LABELS = {
        active: '활성',
        imported: '활성',
        needs_review: '확인 필요',
        hidden: '숨김',
        archived: '숨김',
        inactive: '비활성'
    };

    const viewState = {
        selectedDay: '',
        selectedSessionId: '',
        selectedStudentId: '',
        selectedStudentName: '',
        searchQuery: '',
        studentPanelMode: 'detail',
        studentSaving: false,
        studentError: '',
        miniSaving: false,
        miniError: '',
        miniNotice: '',
        activeTeacherDay: '월',
        lastError: ''
    };

    let eventsBound = false;
    let searchRerenderTimer = null;
    let lastRenderedSessions = [];

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

    function asTeacherList(value) {
        if (Array.isArray(value)) return uniqueNames(value.flatMap(item => asTeacherList(item)));
        const text = normalizeKey(value);
        if (!text) return [];
        return uniqueNames(text.split(/[,+/]/).map(item => normalizeKey(item)).filter(Boolean));
    }

    function dayTeacherSource(row) {
        const meta = getRawMeta(row);
        return row?.day_teachers
            || row?.teacher_names_by_day
            || row?.weekday_teachers
            || meta?.day_teachers
            || meta?.teacher_names_by_day
            || meta?.weekday_teachers
            || null;
    }

    function dayTeacherValues(row, day) {
        const source = dayTeacherSource(row);
        if (!source || typeof source !== 'object') return [];
        return asTeacherList(source[day] || source[`${day}요일`] || source[day?.toLowerCase?.()] || '');
    }

    function allDayTeacherValues(row) {
        const values = [];
        DAY_ORDER.slice(0, 5).forEach(day => values.push(...dayTeacherValues(row, day)));
        return uniqueNames(values);
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

    function displayTime(value) {
        const time = normalizeTime(value);
        const match = time.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return time;
        return `${Number(match[1])}:${match[2]}`;
    }

    function displayTimeRange(start, end) {
        const values = [displayTime(start), displayTime(end)].filter(Boolean);
        return values.length ? values.join('~') : '시간 미정';
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
        if (['active', 'imported', 'needs_review', 'hidden', 'archived', 'inactive'].includes(status)) return status;
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

    function teacherRowName(row) {
        return normalizeKey(row?.display_name || row?.name || row?.teacher_name || row?.teacher_name_raw || row?.id || '');
    }

    function teacherRoster() {
        const values = [];
        const state = window.EieState?.get?.() || {};
        const cells = Array.isArray(state.db?.timetable_cells) ? state.db.timetable_cells : (Array.isArray(state.timetableCells) ? state.timetableCells : []);
        const teachers = Array.isArray(state.db?.teachers) ? state.db.teachers : (Array.isArray(state.teachers) ? state.teachers : []);
        teachers.forEach(teacher => values.push(teacherRowName(teacher)));
        cells.forEach(cell => {
            values.push(...getTeacherNames(cell));
            values.push(...allDayTeacherValues(cell));
        });
        dbStudents().forEach(student => values.push(...studentTeacherNames(student)));
        values.push(...DEFAULT_EIE_TEACHERS);
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

    function dedupeWeeklyStudents(rows) {
        const map = new Map();
        rows.forEach(row => {
            getStudents(row).forEach(student => {
                const stableKey = normalizeKey(student.student_id || student.assignment_id || student.pin || student.key);
                const name = normalizeStudentName(student.name);
                if (!name) return;
                const key = stableKey
                    ? `id:${stableKey}`
                    : `name:${name}|grade:${normalizeKey(student.grade)}`;
                if (map.has(key)) return;
                map.set(key, { ...student, name });
            });
        });
        return Array.from(map.values());
    }

    function getClassName(row) {
        return normalizeKey(row?.class_name_raw || row?.class_name || row?.name || '수업명 없음');
    }

    function compactClassName(value) {
        return normalizeKey(value)
            .replace(/\([^)]*\)/g, ' ')
            .replace(/\[[^\]]*\]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function materialText(row) {
        const meta = getRawMeta(row);
        const direct = normalizeKey(
            row?.material_text || row?.material || row?.textbook || row?.book_name ||
            meta?.material_text || meta?.material || meta?.textbook || meta?.book_name || meta?.book
        );
        if (direct) return direct;
        const compact = compactClassName(row?.class_name_raw || row?.class_name || row?.name || '');
        if (!compact) return '';
        const parts = compact.split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && /^[A-Za-z]+$/i.test(parts[0]) && /^\d+(?:[-.]\d+)?$/.test(parts[1])) {
            return `${parts[0]} ${parts[1]}`;
        }
        return parts[0] || compact;
    }

    function materialLabel(row) {
        return materialText(row) || '교재 없음';
    }

    function materialKey(row) {
        return normalizeKey(materialText(row) || getClassName(row) || row?.id || row?.cell_id || '').toLowerCase();
    }

    function sourceRowKey(row) {
        const meta = getRawMeta(row);
        return normalizeKey(
            row?.card_key || row?.group_key || row?.source_row || row?.sourceRow || row?.row_key ||
            meta?.card_key || meta?.group_key || meta?.source_row || meta?.sourceRow || meta?.row_key
        );
    }

    function rawClassName(row) {
        return normalizeKey(row?.class_name_raw || row?.class_name || row?.name || '');
    }

    function classGroupKey(row) {
        const className = rawClassName(row).toLowerCase();
        const material = materialKey(row);
        const cell = normalizeKey(row?.id || row?.cell_id || '');

        const parts = [];
        if (material) parts.push(`material:${material}`);
        if (className) parts.push(`class:${className}`);
        if (!parts.length && cell) parts.push(`cell:${cell}`);
        return parts.join('|') || 'unknown';
    }

    function cardGroupKey(row) {
        const sourceKey = sourceRowKey(row);
        const groupKey = classGroupKey(row);
        const bodyKey = sourceKey ? `source:${sourceKey}|${groupKey}` : `class:${groupKey}`;
        return [periodGroupKey(row), bodyKey].join('::');
    }

    function shortTeacherName(value) {
        const text = normalizeKey(value);
        if (!text || text === '미정') return '-';
        const compact = text.replace(/선생님|teacher/ig, '').trim() || text;
        return Array.from(compact).slice(0, 2).join('');
    }

    function shortTeacherNames(values) {
        const names = uniqueNames(Array.isArray(values) ? values : normalizeKey(values).split(','));
        if (!names.length) return '-';
        return names.map(shortTeacherName).join('/');
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
        values.push(normalizeKey(row?.homeroom_teacher || meta?.homeroom_teacher));
        values.push(...normalizeKey(row?.teacher_name_raw || row?.teacher_name || row?.teacher).split(','));
        return uniqueNames(values);
    }

    function getTeacherDisplayName(row) {
        const names = getTeacherNames(row);
        return names.length ? names.join(', ') : getTeacherName(row);
    }

    function getPrimaryTeacherName(row) {
        const meta = getRawMeta(row);
        const explicit = normalizeKey(row?.homeroom_teacher || meta?.homeroom_teacher);
        if (explicit) return explicit;
        const names = getTeacherNames(row);
        return names[0] || getTeacherName(row) || '미정';
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

    function periodGroupKey(row) {
        return [
            Number.isFinite(Number(row?.period_order)) ? Number(row.period_order) : '',
            row?.period_label || '',
            row?.start_time || '',
            row?.end_time || ''
        ].join('|');
    }

    function dayTeacherMap(cells) {
        const map = {};
        DAY_ORDER.slice(0, 5).forEach(day => { map[day] = []; });
        (cells || []).forEach(cell => {
            DAY_ORDER.slice(0, 5).forEach(day => {
                map[day].push(...dayTeacherValues(cell, day));
            });
            const day = normalizeDay(cell.day) || normalizeDay(cell.day_label || cell.day_of_week || '');
            if (!DAY_ORDER.slice(0, 5).includes(day)) return;
            const names = getTeacherNames(cell);
            map[day].push(...(names.length ? names : [getTeacherName(cell)]));
        });
        return Object.fromEntries(Object.entries(map).map(([day, names]) => [day, uniqueNames(names)]));
    }

    function stableSessionKey(first, sourceIds, index) {
        const sourceKey = sourceIds.length
            ? `cells_${sourceIds.join('_')}`
            : `group_${sourceRowKey(first) || rawClassName(first) || first?.id || first?.cell_id || index}`;
        return `card_${periodGroupKey(first)}_${sourceKey}`.replace(/[^a-zA-Z0-9가-힣_-]+/g, '_');
    }

    function sameSourceCells(a, b) {
        const left = Array.isArray(a) ? a.map(normalizeKey).filter(Boolean).sort() : [];
        const right = Array.isArray(b) ? b.map(normalizeKey).filter(Boolean).sort() : [];
        if (!left.length || left.length !== right.length) return false;
        return left.every((value, index) => value === right[index]);
    }

    function findSessionBySourceCells(sessions, sourceIds) {
        return (sessions || []).find(session => sameSourceCells(session?.source_cell_ids, sourceIds)) || null;
    }

    function clearMiniNoticeLater(delay) {
        if (viewState.miniNoticeTimer) window.clearTimeout(viewState.miniNoticeTimer);
        if (!viewState.miniNotice) return;
        viewState.miniNoticeTimer = window.setTimeout(() => {
            viewState.miniNoticeTimer = 0;
            viewState.miniNotice = '';
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
        }, delay || 2000);
    }

    function makeWeeklyCard(cells, index) {
        const ordered = sortByTime(cells);
        const first = ordered[0] || {};
        const startMinutes = ordered.map(cell => cell.start_minutes).filter(Number.isFinite).sort((a, b) => a - b)[0] ?? null;
        const endMinutes = ordered.map(cell => cell.end_minutes).filter(Number.isFinite).sort((a, b) => b - a)[0] ?? null;
        const startTime = Number.isFinite(startMinutes) ? minutesToTime(startMinutes) : (first.start_time || '');
        const endTime = Number.isFinite(endMinutes) ? minutesToTime(endMinutes) : (first.end_time || '');
        const students = dedupeWeeklyStudents(ordered);
        const mergedStatus = ordered.find(cell => cell.status === 'needs_review')?.status
            || ordered.find(cell => cell.status === 'hidden')?.status
            || ordered.find(cell => cell.status === 'archived')?.status
            || first.status
            || 'active';
        const sourceIds = ordered.map(cell => cell.id).filter(Boolean);
        const teachers = uniqueNames(ordered.flatMap(getTeacherNames));
        const homeroomTeacher = getPrimaryTeacherName(first);

        return {
            session_id: stableSessionKey(first, sourceIds, index),
            source_cell_ids: sourceIds,
            source_rows: ordered,
            day: '',
            period_key: periodGroupKey(first),
            period_label: first.period_label || first.period || `${first.period_order || index + 1}교시`,
            material: materialLabel(first),
            material_key: materialKey(first),
            class_name: materialLabel(first),
            class_full_name: getClassName(first),
            teacher_name: teachers.join(', ') || '미정',
            homeroom_teacher: homeroomTeacher,
            homeroom_key: teacherKey(homeroomTeacher),
            teacher_key: `card_${index}`,
            day_teachers: dayTeacherMap(ordered),
            start_time: startTime,
            end_time: endTime,
            start_minutes: Number.isFinite(startMinutes) ? startMinutes : null,
            end_minutes: Number.isFinite(endMinutes) ? endMinutes : null,
            duration_minutes: Number.isFinite(startMinutes) && Number.isFinite(endMinutes) ? Math.max(0, endMinutes - startMinutes) : 0,
            period_order: Number.isFinite(Number(first.period_order)) ? Number(first.period_order) : index,
            status: normalizeStatus(mergedStatus),
            students,
            student_count: students.length,
            memo: ordered.map(cell => cell.memo).filter(Boolean).join(' / '),
            room: first.room || '',
            is_merged: ordered.length > 1,
            merge_type: ordered.length > 1 ? 'weekly-card' : 'single'
        };
    }

    function buildDisplaySessions(rawRows) {
        const normalized = sortByTime((rawRows || [])
            .map(normalizeCell)
            .filter(cell => !cell.is_prep));
        const grouped = new Map();
        normalized.forEach(cell => {
            const key = cardGroupKey(cell);
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key).push(cell);
        });
        const cards = [];
        grouped.forEach(cells => cards.push(makeWeeklyCard(cells, cards.length)));
        return sortByTime(cards).sort((a, b) => {
            const aOrder = Number(a.period_order || 0);
            const bOrder = Number(b.period_order || 0);
            if (aOrder !== bOrder) return aOrder - bOrder;
            const aTime = a.start_minutes ?? 999999;
            const bTime = b.start_minutes ?? 999999;
            if (aTime !== bTime) return aTime - bTime;
            return a.material.localeCompare(b.material, 'ko');
        });
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

    function renderStudentPreview(students, options) {
        const list = Array.isArray(students) ? students : [];
        if (!list.length) return '<div class="eie-v2-card-students-empty">학생 없음</div>';
        const max = 8;
        const visible = list.slice(0, max);
        const rest = Math.max(0, list.length - visible.length);
        return `
            <div class="eie-v2-card-students" aria-label="학생 명단">
                ${visible.map(student => {
                    const id = studentDetailId(student);
                    const name = studentSearchName(student);
                    const context = returnContextFor(options);
                    if (id || name) {
                        return `<button type="button"
                            class="eie-v2-card-student"
                            ${id ? `data-eie-v2-student-id="${esc(id)}"` : ''}
                            ${!id && name ? `data-eie-v2-student-name="${esc(name)}"` : ''}
                            ${contextAttrs(context)}
                            title="${esc(name || student.name || '학생')}"
                            aria-label="${esc(name || '학생')} 학생관리 열기">${esc(studentChipName(name || student.name))}</button>`;
                    }
                    return `<span class="eie-v2-card-student" title="${esc(student.name || '')}">${esc(studentChipName(student.name))}</span>`;
                }).join('')}
                ${rest ? `<span class="eie-v2-card-student-more">+${rest}명</span>` : ''}
            </div>
        `;
    }

    function teacherShortForDay(session, day) {
        return shortTeacherNames(session?.day_teachers?.[day] || []);
    }

    function renderWeeklyCard(session) {
        const status = normalizeStatus(session.status);
        const isSpecial = status !== 'active' && status !== 'imported';
        const isSelected = viewState.selectedSessionId === session.session_id;
        return `
            <article role="button" tabindex="0"
                class="eie-v2-week-card ${isSelected ? 'is-selected' : ''}"
                data-eie-v2-session="${esc(session.session_id)}"
                aria-label="${esc(session.material)} 수업 상세 보기">
                <div class="eie-v2-week-grid is-head" aria-hidden="true">
                    <span>교재</span>
                    ${DAY_ORDER.slice(0, 5).map(day => `<span>${esc(day)}</span>`).join('')}
                </div>
                <div class="eie-v2-week-grid is-body">
                    <strong title="${esc(session.class_full_name || session.material)}">${esc(session.material || '교재 없음')}</strong>
                    ${DAY_ORDER.slice(0, 5).map(day => `<span title="${esc((session.day_teachers?.[day] || []).join(', ') || '-')}">${esc(teacherShortForDay(session, day))}</span>`).join('')}
                </div>
                ${isSpecial ? `<em class="eie-v2-status-badge is-${esc(status)}">${esc(statusLabel(status))}</em>` : ''}
                ${renderStudentPreview(session.students, { linkStudents: true, sessionId: session.session_id, cellId: session.source_cell_ids?.[0] || '' })}
            </article>
        `;
    }

    function periodTitle(session) {
        const period = normalizeKey(session?.period_label) || '교시 미정';
        const time = displayTimeRange(session?.start_time, session?.end_time);
        return { period, time };
    }

    function buildPeriodGroups(sessions) {
        const map = new Map();
        (sessions || []).forEach(session => {
            const key = session.period_key || `${session.period_order || ''}|${session.start_time || ''}|${session.end_time || ''}`;
            if (!map.has(key)) map.set(key, { key, sample: session, sessions: [] });
            map.get(key).sessions.push(session);
        });
        return Array.from(map.values()).sort((a, b) => {
            const ao = Number(a.sample.period_order || 0);
            const bo = Number(b.sample.period_order || 0);
            if (ao !== bo) return ao - bo;
            return (a.sample.start_minutes ?? 999999) - (b.sample.start_minutes ?? 999999);
        });
    }

    function sessionHomeroomKey(session) {
        return teacherKey(session?.homeroom_teacher || session?.teacher_name || '미정');
    }

    function sessionHomeroomName(session) {
        return normalizeKey(session?.homeroom_teacher || session?.teacher_name || '미정') || '미정';
    }

    function buildHomeroomColumns(sessions) {
        const values = [];
        const unknownKey = teacherKey('미정');
        const hasUnknownSession = (sessions || []).some(session => sessionHomeroomKey(session) === unknownKey);
        values.push(...teacherRoster());
        (sessions || []).forEach(session => values.push(sessionHomeroomName(session)));
        const names = uniqueNames(values).filter(name => {
            if (!name) return false;
            if (teacherKey(name) === unknownKey) return hasUnknownSession;
            return true;
        });
        if (hasUnknownSession && !names.some(name => teacherKey(name) === unknownKey)) names.push('미정');
        if (!names.length) names.push('미정');
        return names.map((name, index) => ({
            name,
            key: teacherKey(name),
            index
        }));
    }

    function sessionsForTeacher(sessions, teacher) {
        const key = teacher?.key || '';
        return (sessions || []).filter(session => sessionHomeroomKey(session) === key);
    }

    function matchesSearch(session, query) {
        const q = normalizeKey(query).toLowerCase();
        if (!q) return true;
        const haystack = [
            session.material,
            session.class_full_name,
            session.teacher_name,
            session.homeroom_teacher,
            session.period_label,
            session.start_time,
            session.end_time,
            ...(session.students || []).map(student => student.name || '')
        ].join(' ').toLowerCase();
        return haystack.includes(q);
    }

    function renderTeacherHeaderRow(teachers) {
        return `
            <div class="eie-v2-teacher-frame-head" aria-label="담임">
                ${teachers.map(teacher => `
                    <div class="eie-v2-teacher-frame-cell" data-eie-v2-teacher-key="${esc(teacher.key)}">
                        <strong>${esc(teacher.name)}</strong>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderTeacherSlots(group, teachers) {
        return `
            <div class="eie-v2-teacher-frame-row" style="--eie-v2-homeroom-count:${teachers.length};">
                ${teachers.map(teacher => {
                    const cards = sessionsForTeacher(group.sessions, teacher);
                    return `
                        <div class="eie-v2-teacher-slot" data-eie-v2-teacher-key="${esc(teacher.key)}">
                            ${cards.length ? cards.map(renderWeeklyCard).join('') : '<div class="eie-v2-teacher-slot-empty" aria-hidden="true"></div>'}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function renderBoard(sessions) {
        const query = viewState.searchQuery || '';
        const filtered = (sessions || []).filter(session => matchesSearch(session, query));
        if (!filtered.length) {
            return `<div class="eie-v2-empty-state">${query ? '검색 결과가 없습니다.' : '등록된 EIE 시간표가 없습니다.'}</div>`;
        }
        const teachers = buildHomeroomColumns(filtered);
        return `
            <div class="eie-v2-card-board" aria-label="EIE 교재 카드형 시간표">
                <div class="eie-v2-board-scroll">
                    <div class="eie-v2-board-grid" style="--eie-v2-homeroom-count:${teachers.length};">
                        <div class="eie-v2-board-corner" aria-hidden="true"></div>
                        ${renderTeacherHeaderRow(teachers)}
                        ${buildPeriodGroups(filtered).map(group => {
                            const title = periodTitle(group.sample);
                            return `
                                <section class="eie-v2-period-row">
                                    <div class="eie-v2-period-head">
                                        <strong>${esc(title.period)}</strong>
                                        <span>${esc(title.time)}</span>
                                    </div>
                                    ${renderTeacherSlots(group, teachers)}
                                </section>
                            `;
                        }).join('')}
                    </div>
                </div>
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
                                ${['active', 'inactive', 'needs_review'].map(status => `<option value="${esc(status)}"${studentStatus(student) === status ? ' selected' : ''}>${esc(statusLabel(status))}</option>`).join('')}
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

    function renderDayTeacherRows(session) {
        return `
            <div class="eie-v2-detail-week-teachers">
                ${DAY_ORDER.slice(0, 5).map(day => `
                    <div>
                        <span>${esc(day)}</span>
                        <strong>${esc((session?.day_teachers?.[day] || []).join(', ') || '-')}</strong>
                    </div>
                `).join('')}
            </div>
        `;
    }


    function splitTeacherValue(value) {
        return uniqueNames(normalizeKey(value).split(/[,+/]/));
    }

    function teacherOptionsFor(session) {
        const values = [];
        teacherRoster().forEach(name => values.push(name));
        (session?.source_rows || []).forEach(row => getTeacherNames(row).forEach(name => values.push(name)));
        Object.values(session?.day_teachers || {}).forEach(list => (list || []).forEach(name => values.push(name)));
        return uniqueNames(values);
    }

    function selectedSessionRecord() {
        const sid = normalizeKey(viewState.selectedSessionId);
        if (!sid) return null;
        return lastRenderedSessions.find(session => session.session_id === sid) || null;
    }

    function rawMetaWithMaterial(row, material, extra) {
        const meta = getRawMeta(row);
        return { ...meta, material_text: normalizeKey(material), ...(extra || {}) };
    }

    function renderMiniField(label, inner, wide) {
        return `<label class="eie-v2-mini-field ${wide ? 'is-wide' : ''}"><span>${esc(label)}</span>${inner}</label>`;
    }

    function miniStatusOptions(session) {
        const current = normalizeStatus(session?.status || 'active');
        const base = current === 'imported'
            ? ['imported', 'needs_review', 'hidden']
            : ['active', 'needs_review', 'hidden'];
        return uniqueNames(base.includes(current) ? base : [current, ...base]);
    }

    function miniDayTeacherInput(day) {
        if (!document.querySelectorAll) return null;
        return Array.from(document.querySelectorAll('[data-eie-v2-day-teacher]'))
            .find(input => input.getAttribute('data-eie-v2-day-teacher') === day) || null;
    }

    function renderMiniDayTeacherEditor(session) {
        const teachers = teacherOptionsFor(session);
        const teacherButtons = teachers.length ? `
            <div class="eie-v2-mini-teacher-list" aria-label="선생님 목록">
                ${teachers.map(name => `<button type="button" class="eie-small-button" data-eie-v2-pick-teacher="${esc(name)}">${esc(name)}</button>`).join('')}
            </div>
        ` : '';
        return `
            <div class="eie-v2-mini-day-grid">
                ${DAY_ORDER.slice(0, 5).map(day => {
                    const value = (session?.day_teachers?.[day] || []).join(', ');
                    return `<label class="eie-v2-mini-day-cell">
                        <span>${esc(day)}</span>
                        <input type="text" data-eie-v2-day-teacher="${esc(day)}" value="${esc(value)}" placeholder="-" autocomplete="off">
                    </label>`;
                }).join('')}
            </div>
            ${teacherButtons}
        `;
    }

    function renderMiniStudentManager(session) {
        const students = Array.isArray(session?.students) ? session.students : [];
        const assignedIds = new Set(students.map(student => normalizeKey(studentDetailId(student))).filter(Boolean));
        const candidates = dbStudents().filter(student => {
            const sid = normalizeKey(studentRowId(student));
            return sid && !assignedIds.has(sid) && normalizeStatus(studentStatus(student)) !== 'inactive';
        });
        const firstCellId = normalizeKey(session?.source_cell_ids?.[0] || session?.source_rows?.[0]?.id || '');
        return `
            <div class="eie-v2-mini-student-list">
                ${students.length ? students.map(student => {
                    const sid = studentDetailId(student);
                    const name = studentSearchName(student) || student.name || '학생';
                    const grade = normalizeKey(student.grade || student.grade_raw || '');
                    return `<div class="eie-v2-mini-student-row">
                        <button type="button" class="eie-v2-card-student" ${sid ? `data-eie-v2-student-id="${esc(sid)}"` : ''} ${!sid ? `data-eie-v2-student-name="${esc(name)}"` : ''} data-eie-v2-return-session="${esc(session.session_id)}" ${firstCellId ? `data-eie-v2-return-cell="${esc(firstCellId)}"` : ''}>${esc(name)}</button>
                        ${grade ? `<span>${esc(grade)}</span>` : '<span></span>'}
                        <button type="button" class="eie-small-button" ${sid ? `data-eie-v2-retire-student="${esc(sid)}"` : 'disabled'}>퇴원</button>
                        <button type="button" class="eie-small-button" ${sid ? `data-eie-v2-remove-student="${esc(sid)}"` : 'disabled'}>수업 제외</button>
                    </div>`;
                }).join('') : '<div class="eie-empty-box">배정된 학생이 없습니다.</div>'}
            </div>
            <div class="eie-v2-mini-add-student">
                <select data-eie-v2-add-student>
                    <option value="">학생 추가</option>
                    ${candidates.map(student => `<option value="${esc(studentRowId(student))}">${esc(studentDisplayName(student))}${studentGrade(student) ? ` · ${esc(studentGrade(student))}` : ''}</option>`).join('')}
                </select>
                <button type="button" class="eie-secondary-button" data-eie-v2-assign-student ${candidates.length ? '' : 'disabled'}>저장</button>
            </div>
        `;
    }

    function renderMiniClassroomPanel(session) {
        if (!session) return '';
        const time = displayTimeRange(session.start_time, session.end_time) === '시간 미정' ? '' : displayTimeRange(session.start_time, session.end_time);
        const first = session.source_rows?.[0] || {};
        return `
            <div class="eie-v2-detail-head eie-v2-mini-head">
                <span>${esc(session.period_label || '교시 미정')}${time ? ` · ${esc(time)}` : ''}</span>
                <label class="eie-v2-mini-title"><span>교재</span><input id="eie-v2-mini-material" type="text" value="${esc(session.material || '')}" placeholder="교재 없음" autocomplete="off"></label>
                ${viewState.miniError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.miniError)}</div>` : ''}
                ${viewState.miniNotice ? `<div class="eie-v2-info" role="status">${esc(viewState.miniNotice)}</div>` : ''}
            </div>
            <div class="eie-v2-mini-form" data-eie-v2-mini-session="${esc(session.session_id)}">
                <div class="eie-v2-detail-section">
                    <strong>정보 수정</strong>
                    <div class="eie-v2-mini-grid">
                        ${renderMiniField('교시', `<input id="eie-v2-mini-period" type="text" value="${esc(session.period_label || first.period_label || '')}" autocomplete="off">`)}
                        ${renderMiniField('시작', `<input id="eie-v2-mini-start" type="text" value="${esc(displayTime(session.start_time || first.start_time || ''))}" inputmode="numeric" autocomplete="off">`)}
                        ${renderMiniField('종료', `<input id="eie-v2-mini-end" type="text" value="${esc(displayTime(session.end_time || first.end_time || ''))}" inputmode="numeric" autocomplete="off">`)}
                        ${renderMiniField('메모', `<textarea id="eie-v2-mini-memo">${esc(session.memo || '')}</textarea>`, true)}
                    </div>
                </div>
                <div class="eie-v2-detail-section">
                    <strong>요일별 담당</strong>
                    ${renderMiniDayTeacherEditor(session)}
                </div>
                <div class="eie-v2-detail-section">
                    <strong>학생 명단</strong>
                    ${renderMiniStudentManager(session)}
                </div>
                <div class="eie-v2-detail-section">
                    <strong>수업 정보</strong>
                    <ul class="eie-v2-source-list">
                        ${(session.source_rows || []).map(row => `<li><span>${esc(row.day || row.day_label || '-')} · ${esc(row.period_label || session.period_label || '-')} · ${esc(displayTimeRange(row.start_time, row.end_time))}</span></li>`).join('')}
                    </ul>
                </div>
                <div class="eie-v2-detail-actions">
                    <button type="button" class="eie-primary-button" data-eie-v2-save-mini ${viewState.miniSaving ? 'disabled' : ''}>${viewState.miniSaving ? '저장 중...' : '저장'}</button>
                    <button type="button" class="eie-secondary-button" data-eie-v2-refresh>오늘</button>
                </div>
            </div>
        `;
    }

    function renderSelectedPanel(session) {
        const studentPanel = renderStudentPanel();
        if (studentPanel) return studentPanel;
        if (!session) {
            return `
                <aside class="eie-v2-detail-panel is-empty" aria-label="수업 상세">
                    <h3>수업을 선택하세요</h3>
                    <p>시간표에서 교재 카드를 클릭하면 오른쪽에서 바로 수정할 수 있습니다.</p>
                </aside>
            `;
        }
        return `
            <aside class="eie-v2-detail-panel eie-v2-mini-classroom" aria-label="${esc(session.material)} 수업 상세">
                ${renderMiniClassroomPanel(session)}
            </aside>
        `;
    }

    async function loadRows() {
        const stateRows = Array.isArray(window.EieState?.get?.()?.timetableCells)
            ? window.EieState.get().timetableCells
            : [];
        if (!window.EieApi?.getTimetable) return { rows: stateRows, error: '' };
        try {
            const result = await window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' });
            if (result?.fallback) {
                return { rows: stateRows, error: result.error || '시간표를 불러오지 못해 기존 화면을 유지했습니다.' };
            }
            const rows = asRows(result);
            if (window.EieState?.setTimetableCells) window.EieState.setTimetableCells(rows);
            return { rows, error: '' };
        } catch (error) {
            return { rows: stateRows, error: error?.message || '시간표를 불러오지 못했습니다.' };
        }
    }

    function homeRoute() {
        const role = String(window.localStorage?.getItem?.('WANGJI_EIE_ROLE') || '').toLowerCase();
        return role === 'teacher' || role === 'eieteacher' ? 'teacher' : 'dashboard';
    }

    function renderHeader(error) {
        const route = homeRoute();
        return `
            <div class="eie-v2-page-head eie-v2-card-head">
                <div class="eie-v2-title-row">
                    <button type="button" class="eie-back-button" data-eie-route="${esc(route)}" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>
                    <h1>시간표</h1>
                </div>
                <div class="eie-v2-head-actions">
                    <button type="button" class="eie-secondary-button" data-eie-route="timetable-editor" aria-label="시간표 편집 열기">편집</button>
                    <label class="eie-v2-search" aria-label="학생 또는 교재 검색">
                        <input type="search" data-eie-v2-search placeholder="학생 또는 교재 검색" value="${esc(viewState.searchQuery || '')}" autocomplete="off">
                    </label>
                </div>
            </div>
            ${error ? `<div class="eie-v2-alert" role="alert">${esc(error)}</div>` : ''}
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
                if (viewState.miniSaving) return;
                viewState.selectedSessionId = sessionButton.getAttribute('data-eie-v2-session') || '';
                viewState.activeTeacherDay = '월';
                viewState.miniError = '';
                viewState.miniNotice = '';
                if (viewState.miniNoticeTimer) { window.clearTimeout(viewState.miniNoticeTimer); viewState.miniNoticeTimer = 0; }
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
            const teacherPickButton = event.target.closest?.('[data-eie-v2-pick-teacher]');
            if (teacherPickButton) {
                event.preventDefault();
                const teacherName = teacherPickButton.getAttribute('data-eie-v2-pick-teacher') || '';
                const activeDay = viewState.activeTeacherDay || '월';
                const targetInput = miniDayTeacherInput(activeDay) || document.querySelector('[data-eie-v2-day-teacher]');
                if (targetInput) {
                    targetInput.value = teacherName;
                    targetInput.focus();
                }
                return;
            }
            const saveMiniButton = event.target.closest?.('[data-eie-v2-save-mini]');
            if (saveMiniButton) {
                event.preventDefault();
                saveMiniClassroomPanel();
                return;
            }
            const assignStudentButton = event.target.closest?.('[data-eie-v2-assign-student]');
            if (assignStudentButton) {
                event.preventDefault();
                assignStudentToMiniClassroom();
                return;
            }
            const removeStudentButton = event.target.closest?.('[data-eie-v2-remove-student]');
            if (removeStudentButton) {
                event.preventDefault();
                event.stopPropagation();
                removeStudentFromMiniClassroom(removeStudentButton.getAttribute('data-eie-v2-remove-student') || '');
                return;
            }
            const retireStudentButton = event.target.closest?.('[data-eie-v2-retire-student]');
            if (retireStudentButton) {
                event.preventDefault();
                event.stopPropagation();
                retireMiniStudent(retireStudentButton.getAttribute('data-eie-v2-retire-student') || '');
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
        document.addEventListener('focusin', event => {
            const dayInput = event.target.closest?.('[data-eie-v2-day-teacher]');
            if (dayInput) viewState.activeTeacherDay = dayInput.getAttribute('data-eie-v2-day-teacher') || '월';
        });
        document.addEventListener('input', event => {
            const searchInput = event.target.closest?.('[data-eie-v2-search]');
            if (!searchInput) return;
            viewState.searchQuery = searchInput.value || '';
            viewState.selectedSessionId = '';
            clearStudentPanel();
            if (searchRerenderTimer) window.clearTimeout(searchRerenderTimer);
            searchRerenderTimer = window.setTimeout(() => {
                const rerender = window.EieRouter?.open ? window.EieRouter.open('timetable-v2') : Promise.resolve();
                Promise.resolve(rerender).then(() => {
                    const nextInput = document.querySelector('[data-eie-v2-search]');
                    if (nextInput) {
                        nextInput.focus();
                        const end = nextInput.value.length;
                        if (nextInput.setSelectionRange) nextInput.setSelectionRange(end, end);
                    }
                });
            }, 180);
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


    function miniFieldValue(id) {
        const el = document.getElementById(id);
        return normalizeKey(el && el.value);
    }

    function miniDayTeacherValues() {
        const result = {};
        if (!document.querySelectorAll) return result;
        document.querySelectorAll('[data-eie-v2-day-teacher]').forEach(input => {
            const day = input.getAttribute('data-eie-v2-day-teacher') || '';
            result[day] = splitTeacherValue(input.value || '');
        });
        return result;
    }

    async function refreshTimetableRowsAfterMiniSave() {
        if (!window.EieApi?.getTimetable) return [];
        const result = await window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' });
        if (result?.fallback) return [];
        const rows = asRows(result);
        if (window.EieState?.setTimetableCells) window.EieState.setTimetableCells(rows);
        return rows;
    }

    async function saveMiniClassroomPanel() {
        if (viewState.miniSaving) return;
        const session = selectedSessionRecord();
        if (!session || !window.EieApi?.updateTimetableCell) return;
        const rows = Array.isArray(session.source_rows) ? session.source_rows : [];
        if (!rows.length) return;
        const material = miniFieldValue('eie-v2-mini-material');
        const periodLabel = miniFieldValue('eie-v2-mini-period');
        const startTime = normalizeTime(miniFieldValue('eie-v2-mini-start'));
        const endTime = normalizeTime(miniFieldValue('eie-v2-mini-end'));
        const memo = miniFieldValue('eie-v2-mini-memo');
        const dayTeachers = miniDayTeacherValues();
        const savingSessionId = session.session_id;
        const savingSourceIds = Array.isArray(session.source_cell_ids) ? session.source_cell_ids.slice() : [];
        viewState.miniSaving = true;
        viewState.miniError = '';
        viewState.miniNotice = '';
        try {
            for (const row of rows) {
                const rowId = normalizeKey(row?.id || row?.cell_id || '');
                if (!rowId) continue;
                const day = normalizeDay(row.day || row.day_label || row.day_of_week || '');
                const isWeekdayRow = DAY_ORDER.slice(0, 5).includes(day);
                const teachers = isWeekdayRow ? (dayTeachers[day] || getTeacherNames(row)) : getTeacherNames(row);
                const homeroomTeacher = normalizeKey(session.homeroom_teacher || getPrimaryTeacherName(row));
                const metaExtra = {
                    day_teachers: dayTeachers,
                    teacher_names_by_day: dayTeachers,
                    homeroom_teacher: homeroomTeacher
                };
                const payload = {
                    period_label: periodLabel || row.period_label || '',
                    start_time: startTime || row.start_time || '',
                    end_time: endTime || row.end_time || '',
                    memo,
                    material_text: material,
                    material,
                    raw_meta_json: rawMetaWithMaterial(row, material, metaExtra)
                };
                if (isWeekdayRow) {
                    if (teachers.length) {
                        payload.teacher_names = teachers;
                        payload.teacher_name_raw = teachers.join(', ');
                    } else {
                        payload.teacher_names = [];
                        payload.teacher_name_raw = '';
                    }
                } else {
                    const fallbackTeachers = homeroomTeacher && homeroomTeacher !== '미정' ? [homeroomTeacher] : uniqueNames(Object.values(dayTeachers).flat());
                    payload.teacher_names = fallbackTeachers;
                    payload.teacher_name_raw = fallbackTeachers.join(', ');
                }
                await window.EieApi.updateTimetableCell(rowId, payload);
            }
            const refreshedRows = await refreshTimetableRowsAfterMiniSave();
            const refreshedSessions = buildDisplaySessions(refreshedRows.length ? refreshedRows : (window.EieState?.get?.()?.timetableCells || []));
            const nextSession = findSessionBySourceCells(refreshedSessions, savingSourceIds);
            viewState.selectedSessionId = nextSession?.session_id || savingSessionId;
            viewState.miniNotice = '저장 완료';
            viewState.miniError = '';
        } catch (error) {
            viewState.miniError = error?.message || '저장 실패';
            viewState.miniNotice = '';
        } finally {
            viewState.miniSaving = false;
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            clearMiniNoticeLater(2000);
        }
    }

    async function assignStudentToMiniClassroom() {
        if (viewState.miniSaving) return;
        const session = selectedSessionRecord();
        const select = document.querySelector?.('[data-eie-v2-add-student]');
        const studentId = normalizeKey(select && select.value);
        const cellIds = Array.isArray(session?.source_cell_ids) ? session.source_cell_ids.filter(Boolean) : [];
        if (!studentId || !cellIds.length || !window.EieApi?.assignStudentToCell) return;
        viewState.miniSaving = true;
        viewState.miniError = '';
        viewState.miniNotice = '';
        try {
            let successCount = 0;
            let firstError = null;
            for (const cellIdValue of cellIds) {
                try {
                    await window.EieApi.assignStudentToCell(cellIdValue, studentId);
                    successCount += 1;
                } catch (error) {
                    if (!firstError) firstError = error;
                }
            }
            if (!successCount && firstError) throw firstError;
            await refreshTimetableRowsAfterMiniSave();
            viewState.miniNotice = '저장 완료';
        } catch (error) {
            viewState.miniError = error?.message || '저장 실패';
        } finally {
            viewState.miniSaving = false;
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            clearMiniNoticeLater(2000);
        }
    }

    async function removeStudentFromMiniClassroom(studentId) {
        if (viewState.miniSaving) return;
        const session = selectedSessionRecord();
        const sid = normalizeKey(studentId);
        const cellIds = Array.isArray(session?.source_cell_ids) ? session.source_cell_ids.filter(Boolean) : [];
        if (!sid || !cellIds.length || !window.EieApi?.removeStudentFromCell) return;
        viewState.miniSaving = true;
        viewState.miniError = '';
        viewState.miniNotice = '';
        try {
            let successCount = 0;
            let firstError = null;
            for (const cellIdValue of cellIds) {
                try {
                    await window.EieApi.removeStudentFromCell(cellIdValue, sid);
                    successCount += 1;
                } catch (error) {
                    if (!firstError) firstError = error;
                }
            }
            if (!successCount && firstError) throw firstError;
            await refreshTimetableRowsAfterMiniSave();
            viewState.miniNotice = '저장 완료';
        } catch (error) {
            viewState.miniError = error?.message || '저장 실패';
        } finally {
            viewState.miniSaving = false;
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            clearMiniNoticeLater(2000);
        }
    }

    async function retireMiniStudent(studentId) {
        if (viewState.miniSaving) return;
        const session = selectedSessionRecord();
        const sid = normalizeKey(studentId);
        if (!sid || !window.EieApi?.updateStudent) return;
        if (!window.confirm('이 학생을 퇴원 처리하시겠습니까?')) return;
        viewState.miniSaving = true;
        viewState.miniError = '';
        viewState.miniNotice = '';
        try {
            await window.EieApi.updateStudent(sid, { status: 'inactive' });
            const cellIds = Array.isArray(session?.source_cell_ids) ? session.source_cell_ids.filter(Boolean) : [];
            if (window.EieApi?.removeStudentFromCell) {
                for (const cellIdValue of cellIds) {
                    await window.EieApi.removeStudentFromCell(cellIdValue, sid).catch(() => null);
                }
            }
            if (window.EieApmsState?.loadFoundation) await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
            await refreshTimetableRowsAfterMiniSave();
            viewState.miniNotice = '퇴원 처리되었습니다.';
        } catch (error) {
            viewState.miniError = error?.message || '퇴원 처리에 실패했습니다.';
        } finally {
            viewState.miniSaving = false;
            if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
            clearMiniNoticeLater(2000);
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
        lastRenderedSessions = sessions;
        const selectedSession = sessions.find(session => session.session_id === viewState.selectedSessionId) || null;
        return `
            <section class="eie-v2-screen" aria-labelledby="eie-v2-title">
                ${renderHeader(error)}
                <div class="eie-v2-layout">
                    <div class="eie-v2-main">
                        ${renderBoard(sessions)}
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
