(function () {
    const DAY_ORDER = ['월', '화', '수', '목', '금', '토', '일'];
    // 상단 담임 열 고정 목록 (Carmen / Zoe / IVY / STACY / Lily 만 허용 — Laura · Foreigner 제외)
    const HOMEROOM_COLUMN_TEACHERS = ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily'];
    const DEFAULT_EIE_TEACHERS = ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily'];
    const DEFAULT_EIE_DAY_TEACHERS = [...DEFAULT_EIE_TEACHERS, 'Foreigner', 'PREP'];
    const FALLBACK_DAY_LABEL = '전체';
    const STATUS_LABELS = {
        active: '재원',
        imported: '재원',
        needs_review: '확인 필요',
        hidden: '숨김',
        archived: '숨김',
        inactive: '비활성'
    };
    const STANDARD_PERIOD_TIMES = [
        { period_order: 1, period_label: '1교시', start_time: '15:10', end_time: '15:50' },
        { period_order: 2, period_label: '2교시', start_time: '15:50', end_time: '16:30' },
        { period_order: 3, period_label: '3교시', start_time: '16:30', end_time: '17:10' },
        { period_order: 4, period_label: '4교시', start_time: '17:10', end_time: '17:50' },
        { period_order: 5, period_label: '5교시', start_time: '17:50', end_time: '18:30' },
        { period_order: 6, period_label: '6교시', start_time: '18:30', end_time: '19:15' },
        { period_order: 7, period_label: '7교시', start_time: '19:15', end_time: '20:00' },
        { period_order: 8, period_label: '8교시', start_time: '20:00', end_time: '20:45' }
    ];


    const PERIOD_TIME_BY_ORDER = STANDARD_PERIOD_TIMES.reduce((map, row) => {
        const order = Number(row.period_order || 0);
        if (order > 0 && !map.has(order)) {
            map.set(order, {
                period_order: order,
                period_label: row.period_label,
                start_time: row.start_time,
                end_time: row.end_time
            });
        }
        return map;
    }, new Map());

    const viewState = {
        selectedDay: '',
        selectedSessionId: '',
        selectedStudentId: '',
        selectedStudentName: '',
        searchQuery: '',
        studentPanelMode: 'detail',
        panelMountRoute: 'timetable',
        transferTargetId: '',
        studentSaving: false,
        studentError: '',
        studentNotice: '',
        studentDetailTab: 'basic',
        studentConsultationLoadedId: '',
        studentConsultationRows: [],
        studentConsultationSelectedId: '',
        studentConsultationFormOpen: false,
        studentConsultationEditingId: '',
        classPanelMode: 'detail',
        miniSaving: false,
        miniError: '',
        miniNotice: '',
        classAttendanceSessionId: '',
        activeTeacherDay: '월',
        activeTeacherSourceCellId: '',
        activeTeacherPeriodKey: '',
        activeTeacherPeriodIndex: '',
        activeDayOverlay: null,
        lastError: '',
        repairMode: false,
        repairPreview: null,
        repairSaving: false,
        repairError: '',
        repairNotice: '',
        miniAddStudentSessionId: '',
        zoomBoosted: (function () { try { return localStorage.getItem('eie-v2-zoom-boost') === '1'; } catch (_) { return false; } })(),
        editMode: false,
        editDraft: {},     // { [sessionId]: { homeroomKey, homeroomName, periodKey, periodLabel, periodOrder, startTime, endTime } }
        editCreates: [],   // 편집 모드에서 복사→붙여넣기로 만든 임시 수업 셀 목록
        editCopySourceSessionId: '',
        editSaving: false,
        editError: '',
        editNotice: ''
    };

    let eventsBound = false;
    let searchRerenderTimer = null;
    let lastRenderedSessions = [];
    let draggingSessionId = '';

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

    function todayIso() {
        return new Date().toLocaleDateString('sv-SE');
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

    function isForeignerTeacher(value) {
        const text = normalizeKey(value).toLowerCase();
        return text === 'foreigner'
            || text === 'foreign'
            || text.startsWith('forei')
            || text.includes('원어민')
            || text.includes('외국인');
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

    function dayTeacherObjectFromSource(source) {
        const result = {};
        DAY_ORDER.slice(0, 5).forEach(day => {
            const raw = source?.[day] ?? source?.[`${day}요일`] ?? source?.[day?.toLowerCase?.()];
            if (raw !== undefined) result[day] = asTeacherList(raw);
        });
        return result;
    }

    function periodTeacherKeyForPeriod(period, index) {
        const periodKey = normalizeKey(period?.period_key || period?.key || gridPeriodKey(period));
        if (periodKey) return `periodKey:${periodKey}`;
        const periodIndex = normalizeKey(index);
        if (periodIndex !== '') return `periodIndex:${periodIndex}`;
        const order = Number(period?.period_order || period?.period_no || 0);
        return Number.isFinite(order) && order > 0 ? `periodOrder:${order}` : '';
    }

    function periodTeacherFallbackKeys(period, index) {
        const keys = [];
        const primary = periodTeacherKeyForPeriod(period, index);
        if (primary) keys.push(primary);
        const periodKey = normalizeKey(period?.period_key || period?.key || gridPeriodKey(period));
        if (periodKey) keys.push(`periodKey:${periodKey}`);
        const periodIndex = normalizeKey(index);
        if (periodIndex !== '') keys.push(`periodIndex:${periodIndex}`);
        const order = Number(period?.period_order || period?.period_no || 0);
        if (Number.isFinite(order) && order > 0) keys.push(`periodOrder:${order}`);
        return uniqueNames(keys);
    }

    function resolvePeriodDayTeachers(meta, rowOrPeriod, index, fallback) {
        const periodDays = meta?.period_day_teachers;
        if (periodDays && typeof periodDays === 'object') {
            for (const key of periodTeacherFallbackKeys(rowOrPeriod, index)) {
                const resolved = dayTeacherObjectFromSource(periodDays[key]);
                if (Object.keys(resolved).length) return resolved;
            }
        }
        return fallback || {};
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

    function canonicalEiePeriodTime(periodOrder, kind) {
        const standard = standardPeriodTime(Number(periodOrder || 0));
        return kind === 'end' ? (standard?.end_time || '') : (standard?.start_time || '');
    }

    function canonicalEieTime(value, periodOrder, kind) {
        const normalized = normalizeTime(value);
        const standard = canonicalEiePeriodTime(periodOrder, kind);
        if (!normalized) return standard;
        const match = normalized.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return normalized;
        const hour = Number(match[1]);
        const minute = Number(match[2]);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return normalized;
        const standardHour = Number((standard.match(/^(\d{1,2}):/) || [])[1]);
        const resolvedHour = Number.isFinite(standardHour) && standardHour >= 12 && hour < 12
            ? hour + 12
            : hour;
        return `${String(resolvedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    function eieClockParts(value) {
        const time = normalizeTime(value);
        const match = time.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return { prefix: '', time };
        const hour = Number(match[1]);
        const minute = match[2];
        if (!Number.isFinite(hour)) return { prefix: '', time };
        if (hour >= 12) {
            const displayHour = hour === 12 ? 12 : hour - 12;
            return { prefix: '오후', time: `${displayHour}:${minute}` };
        }
        return { prefix: '', time: `${hour}:${minute}` };
    }

    function displayEieClock(value) {
        const parts = eieClockParts(value);
        return parts.prefix ? `${parts.prefix} ${parts.time}` : parts.time;
    }

    function displayEieTimeRange(start, end, periodOrder) {
        const order = Number(periodOrder || 0);
        if (!Number.isFinite(order) || order <= 0) return displayTimeRange(start, end);
        const canonicalStart = canonicalEieTime(start, order, 'start');
        const canonicalEnd = canonicalEieTime(end, order, 'end');
        const startParts = eieClockParts(canonicalStart);
        const endParts = eieClockParts(canonicalEnd);
        const values = [startParts.time, endParts.time].filter(Boolean);
        if (!values.length) return '시간 미정';
        const prefix = startParts.prefix || endParts.prefix;
        return `${prefix ? `${prefix} ` : ''}${values.join('~')}`;
    }

    function displaySessionTimeRange(session) {
        if (session?.display_time_range) return session.display_time_range;
        const periods = sortPeriods(session?.periods || []);
        const first = periods[0] || session || {};
        const last = periods[periods.length - 1] || session || {};
        const order = periodOrderOf(first || session);
        const start = session?.start_time || first?.start_time || '';
        const end = session?.end_time || last?.end_time || '';
        return displayEieTimeRange(start, end, order);
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
        const base = row?.raw && typeof row.raw === 'object' ? row.raw : row;
        const rawMetaValue = base?.raw_meta_json !== undefined && base?.raw_meta_json !== null
            ? base.raw_meta_json
            : row?.raw_meta_json;
        let parsed = {};
        if (rawMetaValue && typeof rawMetaValue === 'object') {
            parsed = rawMetaValue;
        } else if (rawMetaValue) {
            try {
                const value = JSON.parse(rawMetaValue);
                if (value && typeof value === 'object') parsed = value;
            } catch (error) {
                parsed = {};
            }
        }
        return Object.assign({}, base || {}, parsed);
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
        if (window.EieGradeUtils && typeof EieGradeUtils.normalizeEieGrade === 'function') {
            return EieGradeUtils.normalizeEieGrade(value);
        }
        const raw = normalizeKey(value).replace(/\s+/g, '');
        const middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return `중${middle[1]}`;
        const high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return `고${high[1]}`;
        return /^중[1-3]$|^고[1-3]$/.test(raw) ? raw : '';
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

    function studentEnrollDate(row) {
        return studentMeta(row, 'enrollment_date') || studentMeta(row, 'first_attendance_date') || studentMeta(row, 'first_attended_at');
    }

    function applyEnrollDateFields(payload, value) {
        const date = normalizeKey(value);
        payload.first_attendance_date = date;
        payload.enrollment_date = date;
        payload.first_attended_at = date;
        return payload;
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

    function isPausedStudent(row) {
        const raw = rawOf(row);
        const status = normalizeKey(row?.status || row?.student_status || row?.match_status || raw.status).toLowerCase();
        const type = normalizeKey(row?.student_type || raw.student_type).replace(/\s+/g, '');
        const memo = normalizeKey(row?.memo || raw.memo);
        return status === 'paused' || status === 'on_leave' || status === 'leave' || status === '휴원' ||
            type.includes('휴원') || memo.includes('#휴원');
    }

    // ── EIE Panel v1.0 공통 헬퍼 (CODEX_TASK.md §B) ──
    function pAvatarInitials(name) {
        const chars = Array.from(normalizeStudentName(name) || '');
        return chars.slice(0, 2).join('') || '?';
    }
    function pStudentTypeBadge(type) {
        const t = normalizeKey(type) || '일반';
        const map = { '일반': 'ilban', '신입': 'sinip', '재등록': 'redeung', '휴원': 'hyuwon' };
        return { cls: 'b-type-' + (map[t] || 'ilban'), label: t };
    }
    function pGradeBadge(grade) {
        const g = normalizeGrade(grade);
        if (!g) return null;
        let key = 'jung';
        if (g.startsWith('초')) key = 'cho';
        else if (g.startsWith('고')) key = 'go';
        else if (g.startsWith('중')) key = 'jung';
        return { cls: 'b-grade-' + key, label: g };
    }
    function pStatusBadge(student) {
        if (isPausedStudent(student)) return { cls: 'b-status-hyuwon', label: '휴원' };
        const status = normalizeStatus(studentStatus(student));
        if (status === 'archived' || status === 'inactive') return { cls: 'b-status-toewon', label: '퇴원' };
        return { cls: 'b-status-jaewon', label: '재원' };
    }
    function renderPBadge(badge) {
        if (!badge) return '';
        return `<span class="eie-p-badge ${badge.cls}">${esc(badge.label)}</span>`;
    }
    function renderPField(label, value, emptyText) {
        const v = normalizeKey(value);
        const empty = !v;
        const display = empty ? (emptyText || '미등록') : v;
        return `<div class="eie-p-field-row"><span class="eie-p-field-label">${esc(label)}</span><span class="eie-p-field-value${empty ? ' is-empty' : ''}">${esc(display)}</span></div>`;
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

    function dbConsultations() {
        const rows = window.EieState?.get?.()?.db?.consultations;
        return Array.isArray(rows) ? rows : [];
    }

    function consultationDate(row) {
        return normalizeKey(row?.date || row?.consultation_date || row?.created_at).slice(0, 10);
    }

    function consultationType(row) {
        return normalizeKey(row?.type || row?.consultation_type || '상담') || '상담';
    }

    function consultationRowsForStudent(studentId) {
        const sid = normalizeKey(studentId);
        const rows = viewState.studentConsultationLoadedId === sid
            ? viewState.studentConsultationRows
            : dbConsultations().filter(row => normalizeKey(row?.student_id) === sid);
        return (Array.isArray(rows) ? rows : []).slice().sort((a, b) => {
            const ad = consultationDate(a) || normalizeKey(a?.created_at);
            const bd = consultationDate(b) || normalizeKey(b?.created_at);
            return bd.localeCompare(ad);
        });
    }

    function consultationRowId(row) {
        return normalizeKey(row?.id || row?.consultation_id || row?.uuid || row?.created_at || row?.date || row?.consultation_date || '');
    }

    function consultationApiId(row) {
        return normalizeKey(row?.id || row?.consultation_id || row?.uuid || '');
    }

    function mergePanelConsultationRows(studentId, incomingRows) {
        const sid = normalizeKey(studentId);
        const byId = new Map();
        const withoutId = [];
        consultationRowsForStudent(sid)
            .concat(Array.isArray(incomingRows) ? incomingRows : [])
            .filter(Boolean)
            .forEach(row => {
                const id = consultationRowId(row);
                if (id) byId.set(id, row);
                else withoutId.push(row);
            });
        const merged = Array.from(byId.values()).concat(withoutId).sort((a, b) => {
            const ad = consultationDate(a) || normalizeKey(a?.created_at);
            const bd = consultationDate(b) || normalizeKey(b?.created_at);
            return bd.localeCompare(ad);
        });
        viewState.studentConsultationRows = merged;
        viewState.studentConsultationLoadedId = sid;
        if (window.EieState?.mergeStudentConsultations) {
            window.EieState.mergeStudentConsultations(sid, merged);
        }
        return merged;
    }

    function replacePanelConsultationRows(studentId, rows) {
        const sid = normalizeKey(studentId);
        const nextRows = (Array.isArray(rows) ? rows : []).slice().sort((a, b) => {
            const ad = consultationDate(a) || normalizeKey(a?.created_at);
            const bd = consultationDate(b) || normalizeKey(b?.created_at);
            return bd.localeCompare(ad);
        });
        viewState.studentConsultationRows = nextRows;
        viewState.studentConsultationLoadedId = sid;
        if (window.EieState?.mergeStudentConsultations) {
            window.EieState.mergeStudentConsultations(sid, nextRows);
        }
        return nextRows;
    }

    function consultationRowsFromResult(result) {
        if (Array.isArray(result?.consultations)) return result.consultations;
        if (Array.isArray(result?.data)) return result.data;
        if (result?.consultation) return [result.consultation];
        if (result?.data) return [result.data];
        return [];
    }

    function consultationDateLabel(row) {
        const date = consultationDate(row);
        return /^\d{4}-\d{2}-\d{2}/.test(date) ? date.slice(5, 10) : (date || '날짜 없음');
    }

    function selectedPanelConsultation(rows) {
        const wantedId = normalizeKey(viewState.studentConsultationSelectedId);
        return (rows || []).find(row => consultationRowId(row) === wantedId) || (rows || [])[0] || null;
    }

    function renderPanelConsultationDetail(row) {
        if (!row) {
            return '<div class="eie-v2-panel-consultation-empty">상담 기록 없음</div>';
        }
        const content = normalizeKey(row?.content) || '상담 내용이 없습니다.';
        const nextAction = normalizeKey(row?.next_action || row?.nextAction);
        const apiId = consultationApiId(row);
        const rowId = consultationRowId(row);
        return `
            <article class="eie-v2-panel-consultation-card">
                <div class="eie-v2-panel-consultation-meta">
                    <strong>${esc(consultationDate(row) || '날짜 없음')}</strong>
                    <em>${esc(consultationType(row))}</em>
                </div>
                <p>${esc(content)}</p>
                ${nextAction ? `<small><strong>후속조치</strong> ${esc(nextAction)}</small>` : ''}
                <div class="eie-v2-panel-consultation-card-actions">
                    <button type="button" class="eie-p-btn-cancel" data-eie-v2-consultation-edit="${esc(rowId)}">수정</button>
                    <button type="button" class="eie-p-btn-danger" data-eie-v2-consultation-delete="${esc(apiId)}"${apiId ? '' : ' disabled'}>삭제</button>
                </div>
            </article>
        `;
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
                status: normalizeKey(student?.status || student?.match_status || ''),
                student_type: normalizeKey(student?.student_type || student?.type || ''),
                memo: normalizeKey(student?.memo || '')
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
                status: normalizeKey(item?.status || item?.match_status || ''),
                student_type: normalizeKey(item?.student_type || item?.type || ''),
                memo: normalizeKey(item?.memo || '')
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
        return materialText(row) || 'Class 없음';
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
        if (explicit && !isForeignerTeacher(explicit)) return explicit;
        const names = getTeacherNames(row).filter(name => !isForeignerTeacher(name));
        const fallback = getTeacherName(row);
        if (names.length) return names[0];
        return fallback && !isForeignerTeacher(fallback) ? fallback : '미정';
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
        const periodOrder = Number.isFinite(Number(row?.period_order)) ? Number(row.period_order) : fallbackStart;
        const canonicalStart = canonicalEieTime(start, periodOrder, 'start');
        const canonicalEnd = canonicalEieTime(end, periodOrder, 'end');
        const canonicalStartMinutes = timeToMinutes(canonicalStart);
        const canonicalEndMinutes = timeToMinutes(canonicalEnd);
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
            canonical_start_time: canonicalStart,
            canonical_end_time: canonicalEnd,
            canonical_start_minutes: Number.isFinite(canonicalStartMinutes) ? canonicalStartMinutes : null,
            canonical_end_minutes: Number.isFinite(canonicalEndMinutes) ? canonicalEndMinutes : null,
            period_order: periodOrder,
            status: normalizeStatus(row?.status),
            students: getStudents(row),
            memo: normalizeKey(row?.memo || ''),
            room: normalizeKey(row?.room_raw || row?.room_name || ''),
            is_prep: isPrepCell(row)
        };
    }

    function sortByTime(rows) {
        return [...rows].sort((a, b) => {
            const aTime = timeSortValue(a);
            const bTime = timeSortValue(b);
            if (aTime !== bTime) return aTime - bTime;
            const aOrder = Number(a.period_order || 0);
            const bOrder = Number(b.period_order || 0);
            if (aOrder !== bOrder) return aOrder - bOrder;
            const teacherCompare = a.teacher_name.localeCompare(b.teacher_name, 'ko');
            if (teacherCompare) return teacherCompare;
            return a.class_name.localeCompare(b.class_name, 'ko');
        });
    }

    function timeSortValue(cell) {
        if (Number.isFinite(cell?.canonical_start_minutes)) return cell.canonical_start_minutes;
        if (Number.isFinite(cell?.start_minutes)) return cell.start_minutes;
        const order = Number(cell?.period_order || 0);
        return Number.isFinite(order) && order > 0 ? order * 10000 : 0;
    }

    function periodOrderOf(row) {
        const direct = Number(row?.period_order || row?.period_no || 0);
        if (Number.isFinite(direct) && direct > 0) return direct;
        const label = normalizeKey(row?.period_label || row?.period || '');
        const match = label.match(/(\d+)/);
        const fromLabel = match ? Number(match[1]) : 0;
        return Number.isFinite(fromLabel) && fromLabel > 0 ? fromLabel : 0;
    }

    function canonicalPeriodLabel(row) {
        const order = periodOrderOf(row);
        const label = normalizeKey(row?.period_label || row?.period || '');
        const standard = PERIOD_TIME_BY_ORDER.get(order);
        if (standard?.period_label) return standard.period_label;
        if (Number.isFinite(order) && order > 0 && (!label || label.includes('~'))) return `${order}교시`;
        return label || (Number.isFinite(order) && order > 0 ? `${order}교시` : '');
    }

    function standardPeriodTime(rowOrOrder) {
        const order = Number(typeof rowOrOrder === 'object'
            ? periodOrderOf(rowOrOrder)
            : rowOrOrder);
        return PERIOD_TIME_BY_ORDER.get(order) || null;
    }

    function canonicalPeriodStart(row) {
        return row?.start_time || standardPeriodTime(row)?.start_time || '';
    }

    function canonicalPeriodEnd(row) {
        return row?.end_time || standardPeriodTime(row)?.end_time || '';
    }

    function periodGroupKey(row) {
        const order = periodOrderOf(row);
        const label = normalizeKey(row?.period_label || row?.period || '');
        return Number.isFinite(order) && order > 0 ? `period:${order}` : `period:${label}`;
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

    function studentMergeKey(student) {
        return normalizeKey(
            student?.student_id || student?.confirmed_student_id || student?.matched_student_id ||
            student?.canonical_student_id || student?.id || student?.assignment_id ||
            student?.pin || student?.student_pin || student?.name || student?.display_name ||
            student?.student_name_raw || ''
        ).toLowerCase();
    }

    function studentSetSignature(students) {
        return (Array.isArray(students) ? students : [])
            .map(studentMergeKey)
            .filter(Boolean)
            .sort()
            .join('|');
    }

    function cellDisplayMergeKey(cell) {
        return [
            materialKey(cell),
            studentSetSignature(cell?.students || getStudents(cell))
        ].join('::');
    }

    function normalizePeriodLabel(order, fallback) {
        const numericOrder = Number(order);
        const label = normalizeKey(fallback);
        if (Number.isFinite(numericOrder) && numericOrder > 0 && (!label || label.includes('~'))) return `${numericOrder}교시`;
        return label || (Number.isFinite(numericOrder) && numericOrder > 0 ? `${numericOrder}교시` : '교시');
    }

    function periodRecordFromCell(cell) {
        const order = periodOrderOf(cell);
        const startTime = cell?.start_time || '';
        const endTime = cell?.end_time || '';
        const canonicalStartTime = canonicalEieTime(startTime, order, 'start');
        const canonicalEndTime = canonicalEieTime(endTime, order, 'end');
        const period = {
            key: periodGroupKey(cell),
            period_key: periodGroupKey(cell),
            period_order: order,
            period_label: normalizePeriodLabel(order, cell?.period_label || cell?.period),
            start_time: startTime,
            end_time: endTime,
            canonical_start_time: canonicalStartTime,
            canonical_end_time: canonicalEndTime,
            display_time_range: displayEieTimeRange(startTime, endTime, order),
            start_minutes: timeToMinutes(canonicalStartTime),
            end_minutes: timeToMinutes(canonicalEndTime),
            source_cell_id: cell?.id || cell?.cell_id || ''
        };
        return {
            ...period,
            day_teachers: resolvePeriodDayTeachers(getRawMeta(cell), period, 0, dayTeacherMap([cell]))
        };
    }

    function periodRecordsFromCell(cell) {
        return [periodRecordFromCell(cell)];
    }

    function buildRuntimePeriodTimeMap(sessions) {
        const choices = new Map();
        (sessions || []).forEach(session => {
            const rows = Array.isArray(session?.source_rows) && session.source_rows.length
                ? session.source_rows
                : [session];
            rows.forEach(row => {
                const order = periodOrderOf(row);
                const start = canonicalEieTime(row?.start_time || '', order, 'start');
                const end = canonicalEieTime(row?.end_time || '', order, 'end');
                const startMin = timeToMinutes(start);
                const endMin = timeToMinutes(end);
                const label = normalizePeriodLabel(order, row?.period_label || row?.period);
                if (!order || !Number.isFinite(startMin) || !Number.isFinite(endMin) || startMin >= endMin) return;
                const duration = endMin - startMin;
                if (duration > 70) return;
                const key = `${start}|${end}|${label}`;
                if (!choices.has(order)) choices.set(order, new Map());
                const bucket = choices.get(order);
                bucket.set(key, {
                    count: Number(bucket.get(key)?.count || 0) + 1,
                    period_order: order,
                    period_label: label,
                    start_time: start,
                    end_time: end,
                    start_minutes: startMin,
                    end_minutes: endMin
                });
            });
        });
        const result = new Map();
        choices.forEach((bucket, order) => {
            const best = Array.from(bucket.values()).sort((a, b) => {
                if (b.count !== a.count) return b.count - a.count;
                return a.start_minutes - b.start_minutes;
            })[0];
            if (best) result.set(order, best);
        });
        return result;
    }

    function runtimePeriodRecord(order, runtimePeriodMap) {
        const numericOrder = Number(order || 0);
        const runtime = runtimePeriodMap?.get?.(numericOrder);
        const source = runtime || {};
        const label = normalizePeriodLabel(numericOrder, source.period_label || `${numericOrder}교시`);
        return {
            key: `period:${numericOrder}`,
            period_key: `period:${numericOrder}`,
            period_order: numericOrder,
            period_label: label,
            start_time: source.start_time || '',
            end_time: source.end_time || '',
            canonical_start_time: canonicalEieTime(source.start_time || '', numericOrder, 'start'),
            canonical_end_time: canonicalEieTime(source.end_time || '', numericOrder, 'end'),
            display_time_range: displayEieTimeRange(source.start_time || '', source.end_time || '', numericOrder),
            start_minutes: timeToMinutes(source.start_time || ''),
            end_minutes: timeToMinutes(source.end_time || ''),
            day_teachers: {},
            source_cell_id: ''
        };
    }

    function periodRecordsFromCellForGrid(cell, runtimePeriodMap) {
        const order = periodOrderOf(cell);
        const rawStart = timeToMinutes(canonicalEieTime(cell?.start_time || '', order, 'start'));
        const rawEnd = timeToMinutes(canonicalEieTime(cell?.end_time || '', order, 'end'));
        const runtimePeriods = Array.from(runtimePeriodMap?.values?.() || [])
            .filter(period => {
                const periodOrder = Number(period?.period_order || 0);
                const start = timeToMinutes(canonicalEieTime(period.start_time, periodOrder, 'start'));
                const end = timeToMinutes(canonicalEieTime(period.end_time, periodOrder, 'end'));
                return Number.isFinite(rawStart) && Number.isFinite(rawEnd) &&
                    Number.isFinite(start) && Number.isFinite(end) &&
                    start >= rawStart && end <= rawEnd;
            })
            .sort((a, b) => a.period_order - b.period_order);
        const periods = runtimePeriods.length >= 2 && runtimePeriods.some(period => Number(period.period_order) === order)
            ? runtimePeriods
            : [periodRecordFromCell(cell)];
        return periods.filter(period => Number(period.period_order) > 0).map((period, index) => ({
            ...period,
            key: `period:${Number(period.period_order)}`,
            period_key: `period:${Number(period.period_order)}`,
            canonical_start_time: canonicalEieTime(period.start_time, Number(period.period_order), 'start'),
            canonical_end_time: canonicalEieTime(period.end_time, Number(period.period_order), 'end'),
            display_time_range: displayEieTimeRange(period.start_time, period.end_time, Number(period.period_order)),
            day_teachers: resolvePeriodDayTeachers(getRawMeta(cell), {
                ...period,
                key: `period:${Number(period.period_order)}`,
                period_key: `period:${Number(period.period_order)}`
            }, index, dayTeacherMap([cell])),
            source_cell_id: cell?.id || cell?.cell_id || ''
        }));
    }

    function mergePeriodRecords(periods) {
        const map = new Map();
        (periods || []).forEach(period => {
            const key = gridPeriodKey(period);
            if (!key) return;
            if (!map.has(key)) {
                map.set(key, { ...period, day_teachers: { ...(period.day_teachers || {}) } });
                return;
            }
            const current = map.get(key);
            DAY_ORDER.forEach(day => {
                current.day_teachers[day] = uniqueNames([
                    ...(current.day_teachers?.[day] || []),
                    ...(period.day_teachers?.[day] || [])
                ]);
            });
        });
        return sortPeriods(Array.from(map.values()));
    }

    function sortPeriods(periods) {
        return [...(Array.isArray(periods) ? periods : [])].sort((a, b) => {
            const ao = Number(a?.period_order || 0);
            const bo = Number(b?.period_order || 0);
            if (ao !== bo) return ao - bo;
            return (a?.start_minutes ?? 999999) - (b?.start_minutes ?? 999999);
        });
    }

    function gridPeriodsForSession(session, runtimePeriodMap) {
        const sourceRows = Array.isArray(session?.source_rows) ? session.source_rows : [];
        const sourcePeriods = sourceRows.length
            ? mergePeriodRecords(sourceRows.flatMap(row => periodRecordsFromCellForGrid(row, runtimePeriodMap)))
            : [];
        if (sourcePeriods.length) return sourcePeriods;
        const periods = mergePeriodRecords((session?.periods?.length ? session.periods : []).map(period => (
            runtimePeriodRecord(period.period_order, runtimePeriodMap)
        )));
        if (periods.length) return periods;
        return mergePeriodRecords([runtimePeriodRecord(session?.period_order, runtimePeriodMap)]);
    }

    function shouldMergeAdjacentPeriod(left, right) {
        if (!left || !right) return false;
        const leftOrder = Number(left.period_order || 0);
        const rightOrder = Number(right.period_order || 0);
        return Number.isFinite(leftOrder) && Number.isFinite(rightOrder) && rightOrder === leftOrder + 1;
    }

    function clearMiniNoticeLater(delay) {
        if (viewState.miniNoticeTimer) window.clearTimeout(viewState.miniNoticeTimer);
        if (!viewState.miniNotice) return;
        viewState.miniNoticeTimer = window.setTimeout(() => {
            viewState.miniNoticeTimer = 0;
            viewState.miniNotice = '';
            reopenPanelMountRoute();
        }, delay || 2000);
    }

    function makeWeeklyCard(cells, index, runtimePeriodMap) {
        const ordered = sortByTime(cells);
        const first = ordered[0] || {};
        const periods = mergePeriodRecords(ordered.flatMap(cell => periodRecordsFromCellForGrid(cell, runtimePeriodMap)));
        const firstPeriod = periods[0] || periodRecordFromCell(first);
        const lastPeriod = periods[periods.length - 1] || firstPeriod;
        const startMinutes = periods.map(period => period.start_minutes).filter(Number.isFinite).sort((a, b) => a - b)[0] ?? null;
        const endMinutes = periods.map(period => period.end_minutes).filter(Number.isFinite).sort((a, b) => b - a)[0] ?? null;
        const startTime = firstPeriod.start_time || (Number.isFinite(startMinutes) ? minutesToTime(startMinutes) : (first.start_time || ''));
        const endTime = lastPeriod.end_time || (Number.isFinite(endMinutes) ? minutesToTime(endMinutes) : (first.end_time || ''));
        const students = dedupeWeeklyStudents(ordered);
        const mergedStatus = ordered.find(cell => cell.status === 'needs_review')?.status
            || ordered.find(cell => cell.status === 'hidden')?.status
            || ordered.find(cell => cell.status === 'archived')?.status
            || first.status
            || 'active';
        const sourceIds = ordered.map(cell => cell.id).filter(Boolean);
        const teachers = uniqueNames(ordered.flatMap(getTeacherNames));
        const homeroomTeacher = getPrimaryTeacherName(first);
        const periodLabel = periods.length > 1
            ? `${firstPeriod.period_label}~${lastPeriod.period_label}`
            : firstPeriod.period_label;
        const firstOrder = Number(firstPeriod.period_order || periodOrderOf(first));
        const canonicalStartTime = canonicalEieTime(startTime, firstOrder, 'start');
        const canonicalEndTime = canonicalEieTime(endTime, firstOrder, 'end');
        const canonicalStartMinutes = timeToMinutes(canonicalStartTime);
        const canonicalEndMinutes = timeToMinutes(canonicalEndTime);

        return {
            session_id: stableSessionKey(first, sourceIds, index),
            source_cell_ids: sourceIds,
            source_rows: ordered,
            day: '',
            period_key: firstPeriod.period_key || periodGroupKey(first),
            period_label: periodLabel,
            material: materialLabel(first),
            material_key: materialKey(first),
            class_name: materialLabel(first),
            class_full_name: getClassName(first),
            teacher_name: teachers.join(', ') || getTeacherName(first),
            homeroom_teacher: homeroomTeacher,
            homeroom_key: teacherKey(homeroomTeacher),
            teacher_key: `card_${index}`,
            day_teachers: dayTeacherMap(ordered),
            periods,
            start_time: startTime,
            end_time: endTime,
            canonical_start_time: canonicalStartTime,
            canonical_end_time: canonicalEndTime,
            canonical_start_minutes: Number.isFinite(canonicalStartMinutes) ? canonicalStartMinutes : null,
            canonical_end_minutes: Number.isFinite(canonicalEndMinutes) ? canonicalEndMinutes : null,
            display_time_range: displayEieTimeRange(startTime, endTime, firstOrder),
            start_minutes: Number.isFinite(startMinutes) ? startMinutes : null,
            end_minutes: Number.isFinite(endMinutes) ? endMinutes : null,
            duration_minutes: Number.isFinite(startMinutes) && Number.isFinite(endMinutes) ? Math.max(0, endMinutes - startMinutes) : 0,
            period_order: Number.isFinite(Number(firstPeriod.period_order)) ? Number(firstPeriod.period_order) : index,
            status: normalizeStatus(mergedStatus),
            students,
            student_count: students.length,
            memo: ordered.map(cell => cell.memo).filter(Boolean).join(' / '),
            room: first.room || '',
            is_temp_copy: ordered.some(cell => !!cell.is_temp_copy),
            is_merged: ordered.length > 1,
            merge_type: ordered.length > 1 ? 'display-session' : 'single',
            slot_lane: Number(first.slot_lane) >= 1 ? Number(first.slot_lane) : 1
        };
    }

    function buildDisplaySessions(rawRows) {
        const normalized = sortByTime((rawRows || [])
            .map(normalizeCell)
            .filter(cell => !cell.is_prep)
            .filter(cell => {
                const status = normalizeStatus(cell.status);
                return status !== 'hidden' && status !== 'archived' && status !== 'inactive';
            }));
        const runtimePeriodMap = buildRuntimePeriodTimeMap(normalized);
        const grouped = new Map();
        normalized.forEach(cell => {
            const key = cellDisplayMergeKey(cell);
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key).push(cell);
        });
        const cards = [];
        grouped.forEach(cells => {
            let current = [];
            sortByTime(cells).forEach(cell => {
                const previous = current[current.length - 1];
                if (current.length && !shouldMergeAdjacentPeriod(previous, cell)) {
                    cards.push(makeWeeklyCard(current, cards.length, runtimePeriodMap));
                    current = [];
                }
                current.push(cell);
            });
            if (current.length) cards.push(makeWeeklyCard(current, cards.length, runtimePeriodMap));
        });
        return sortByTime(cards).sort((a, b) => {
            const aOrder = Number(a.period_order || 0);
            const bOrder = Number(b.period_order || 0);
            if (aOrder !== bOrder) return aOrder - bOrder;
            const aTime = timeSortValue(a) ?? 999999;
            const bTime = timeSortValue(b) ?? 999999;
            if (aTime !== bTime) return aTime - bTime;
            return a.material.localeCompare(b.material, 'ko');
        });
    }

    function statusLabel(status) {
        return STATUS_LABELS[normalizeStatus(status)] || '재원';
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
            from: 'timetable',
            route: 'timetable',
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

    function sortStudentsByName(students) {
        return [...(Array.isArray(students) ? students : [])].sort((a, b) => {
            const aPaused = isPausedStudent(a) ? 1 : 0;
            const bPaused = isPausedStudent(b) ? 1 : 0;
            if (aPaused !== bPaused) return aPaused - bPaused;
            const left = studentSearchName(a) || a?.name || '';
            const right = studentSearchName(b) || b?.name || '';
            return String(left).localeCompare(String(right), 'ko', { sensitivity: 'base', numeric: true });
        });
    }

    function renderStudentNames(students, options) {
        const list = sortStudentsByName(students);
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
                            class="eie-v2-student-chip is-clickable${isPausedStudent(student) ? ' is-paused' : ''}"
                            ${id ? `data-eie-v2-student-id="${esc(id)}"` : ''}
                            ${!id && name ? `data-eie-v2-student-name="${esc(name)}"` : ''}
                            ${contextAttrs(context)}
                            title="${esc(name || student.name || '학생')}"
                            aria-label="${esc(name || '학생')} 학생관리 열기">${esc(studentChipName(name || student.name))}</button>`;
                    }
                    return `<span class="eie-v2-student-chip${isPausedStudent(student) ? ' is-paused' : ''}" title="${esc(student.name || '')}">${esc(studentChipName(student.name))}</span>`;
                }).join('')}
            </div>
        `;
    }

    function renderStudentPreview(students, options) {
        const list = sortStudentsByName(students);
        if (!list.length) return '<div class="eie-v2-card-students-empty">학생 없음</div>';
        const visible = list;
        const rest = 0;
        return `
            <div class="eie-v2-card-students" aria-label="학생 명단">
                ${visible.map(student => {
                    const id = studentDetailId(student);
                    const name = studentSearchName(student);
                    const context = returnContextFor(options);
                    if (id || name) {
                        return `<button type="button"
                            class="eie-v2-card-student${isPausedStudent(student) ? ' is-paused' : ''}"
                            ${id ? `data-eie-v2-student-id="${esc(id)}"` : ''}
                            ${!id && name ? `data-eie-v2-student-name="${esc(name)}"` : ''}
                            ${contextAttrs(context)}
                            title="${esc(name || student.name || '학생')}"
                            aria-label="${esc(name || '학생')} 학생관리 열기">${esc(studentChipName(name || student.name))}</button>`;
                    }
                    return `<span class="eie-v2-card-student${isPausedStudent(student) ? ' is-paused' : ''}" title="${esc(student.name || '')}">${esc(studentChipName(student.name))}</span>`;
                }).join('')}
                ${rest ? `<span class="eie-v2-card-student-more">+${rest}명</span>` : ''}
            </div>
        `;
    }

    function teacherShortForDay(session, day) {
        return shortTeacherNames(session?.day_teachers?.[day] || []);
    }

    function teacherColorKeyForDay(session, day) {
        const names = uniqueNames(session?.day_teachers?.[day] || []);
        if (!names.length) return 'none';
        if (names.length > 1) return 'mixed';
        return teacherKey(names[0] || '');
    }

    function teacherShortForPeriodDay(period, session, day) {
        const names = uniqueNames(period?.day_teachers?.[day] || session?.day_teachers?.[day] || []);
        return shortTeacherNames(names);
    }

    function teacherColorKeyForPeriodDay(period, session, day) {
        const names = uniqueNames(period?.day_teachers?.[day] || session?.day_teachers?.[day] || []);
        if (!names.length) return 'none';
        if (names.length > 1) return 'mixed';
        return teacherKey(names[0] || '');
    }

    function getDayLabelName(day) {
        return {
            월: '월요일',
            화: '화요일',
            수: '수요일',
            목: '목요일',
            금: '금요일'
        }[day] || day || '';
    }

    function dayOverlayTeacherNames(period, session, day) {
        return uniqueNames(period?.day_teachers?.[day] || session?.day_teachers?.[day] || []);
    }

    function dayTeacherClassKey(session) {
        const first = Array.isArray(session?.source_rows) ? (session.source_rows[0] || {}) : {};
        return normalizeKey(
            session?.class_key || session?.class_full_name || session?.class_name ||
            rawClassName(first) || sourceRowKey(first) || ''
        ).toLowerCase();
    }

    function dayTeacherSourceKey(session) {
        const sourceIds = Array.isArray(session?.source_cell_ids) ? session.source_cell_ids : [];
        return sourceIds.length
            ? sourceIds.map(id => normalizeKey(id)).filter(Boolean).sort().join('|')
            : normalizeKey(session?.session_id || '');
    }

    function dayTeacherMergeKey(item) {
        return [
            item?.teacher_key || teacherKey(item?.teacherName || ''),
            normalizeKey(item?.class_key || '').toLowerCase(),
            normalizeKey(item?.material_key || item?.material || '').toLowerCase(),
            studentSetSignature(item?.students || []),
            normalizeKey(item?.source_session_key || '')
        ].join('::');
    }

    function buildDayTeacherSessions(displaySessions, day) {
        const activeDay = DAY_ORDER.slice(0, 5).includes(day) ? day : '';
        if (!activeDay) return [];
        const runtimePeriodMap = buildRuntimePeriodTimeMap(displaySessions || []);
        const items = [];
        (displaySessions || []).forEach(session => {
            const periods = gridPeriodsForSession(session, runtimePeriodMap);
            periods.forEach(period => {
                const teacherNames = dayOverlayTeacherNames(period, session, activeDay);
                if (!teacherNames.length) return;
                teacherNames.forEach(teacherName => {
                    items.push({
                        source_session: session,
                        session_id: session.session_id,
                        source_cell_ids: Array.isArray(session.source_cell_ids) ? session.source_cell_ids.slice() : [],
                        material: session.material || session.class_name || '',
                        material_key: session.material_key || '',
                        class_key: dayTeacherClassKey(session),
                        class_full_name: session.class_full_name || session.material || '',
                        source_session_key: dayTeacherSourceKey(session),
                        teacherName,
                        teacher_key: teacherKey(teacherName),
                        students: Array.isArray(session.students) ? session.students.slice() : [],
                        period_order: Number(period.period_order || 0),
                        period_label: period.period_label || session.period_label || '',
                        start_time: period.start_time || '',
                        end_time: period.end_time || '',
                        start_minutes: period.start_minutes ?? timeToMinutes(period.start_time || ''),
                        periods: [{ ...period, teacherName }],
                        status: session.status || 'active'
                    });
                });
            });
        });
        const grouped = new Map();
        items.forEach(item => {
            const key = dayTeacherMergeKey(item);
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key).push(item);
        });
        const merged = [];
        grouped.forEach(groupItems => {
            const ordered = groupItems.slice().sort((a, b) => {
                if (a.period_order !== b.period_order) return a.period_order - b.period_order;
                return String(a.period_label || '').localeCompare(String(b.period_label || ''), 'ko', { numeric: true });
            });
            let current = null;
            ordered.forEach(item => {
                const lastPeriod = current?.periods?.[current.periods.length - 1] || null;
                const canMerge = current
                    && Number(item.period_order || 0) === Number(lastPeriod?.period_order || 0) + 1
                    && (item.teacher_key || teacherKey(item.teacherName || '')) === (current.teacher_key || teacherKey(current.teacherName || ''));
                if (!canMerge) {
                    current = { ...item, periods: item.periods.slice() };
                    merged.push(current);
                    return;
                }
                current.periods.push(...item.periods);
                current.source_cell_ids = uniqueNames([...(current.source_cell_ids || []), ...(item.source_cell_ids || [])]);
                current.end_time = item.end_time || current.end_time;
            });
        });
        return assignDayTeacherLanes(merged.map(session => {
            const periods = sortPeriods(session.periods || []);
            const startPeriodOrder = Number(periods[0]?.period_order || session.period_order || 0);
            const endPeriodOrder = Number(periods[periods.length - 1]?.period_order || startPeriodOrder || 0);
            return {
                ...session,
                periods,
                startPeriodOrder,
                endPeriodOrder,
                rowSpan: Math.max(1, endPeriodOrder - startPeriodOrder + 1)
            };
        })).sort((a, b) => {
            const aOrder = Number(a.startPeriodOrder || 0);
            const bOrder = Number(b.startPeriodOrder || 0);
            if (aOrder !== bOrder) return aOrder - bOrder;
            return String(a.teacherName || '').localeCompare(String(b.teacherName || ''), 'ko', { sensitivity: 'base' });
        });
    }

    function dayTeacherSessionsOverlap(left, right) {
        const leftStart = Number(left?.startPeriodOrder || 0);
        const leftEnd = Number(left?.endPeriodOrder || leftStart || 0);
        const rightStart = Number(right?.startPeriodOrder || 0);
        const rightEnd = Number(right?.endPeriodOrder || rightStart || 0);
        return leftStart <= rightEnd && rightStart <= leftEnd;
    }

    function assignDayTeacherLanes(dayTeacherSessions) {
        const byTeacher = new Map();
        (dayTeacherSessions || []).forEach(session => {
            const key = session.teacher_key || teacherKey(session.teacherName || '');
            if (!byTeacher.has(key)) byTeacher.set(key, []);
            byTeacher.get(key).push(session);
        });
        const result = [];
        byTeacher.forEach(sessions => {
            const lanes = [];
            sessions.slice().sort((a, b) => {
                if (a.startPeriodOrder !== b.startPeriodOrder) return a.startPeriodOrder - b.startPeriodOrder;
                if (a.endPeriodOrder !== b.endPeriodOrder) return a.endPeriodOrder - b.endPeriodOrder;
                return String(a.material || '').localeCompare(String(b.material || ''), 'ko', { numeric: true });
            }).forEach(session => {
                let laneIndex = lanes.findIndex(lane => !lane.some(existing => dayTeacherSessionsOverlap(existing, session)));
                if (laneIndex < 0) {
                    laneIndex = lanes.length;
                    lanes.push([]);
                }
                const placed = { ...session, laneIndex, laneCount: 0 };
                lanes[laneIndex].push(placed);
                result.push(placed);
            });
            lanes.flat().forEach(session => { session.laneCount = Math.max(1, lanes.length); });
        });
        return result;
    }

    function collectDayTeachers(dayTeacherSessions) {
        const seen = new Map();
        (dayTeacherSessions || []).forEach(session => {
            const name = normalizeKey(session?.teacherName || '');
            if (name && !seen.has(teacherKey(name))) seen.set(teacherKey(name), name);
        });
        const preferred = DEFAULT_EIE_DAY_TEACHERS.filter(name => seen.has(teacherKey(name))).map(name => seen.get(teacherKey(name)));
        const rest = Array.from(seen.entries())
            .filter(([key]) => !DEFAULT_EIE_DAY_TEACHERS.some(name => teacherKey(name) === key))
            .map(([, name]) => name)
            .sort((a, b) => String(a).localeCompare(String(b), 'ko', { sensitivity: 'base' }));
        return uniqueNames([...preferred, ...rest]);
    }

    function renderWeekdayOverlayTabs(activeDay) {
        return `
            <div class="eie-weekday-overlay__tabs" role="tablist" aria-label="요일별 시간표">
                ${DAY_ORDER.slice(0, 5).map(day => `
                    <button type="button"
                        class="eie-small-button ${activeDay === day ? 'is-active' : ''}"
                        data-eie-v2-day-overlay="${esc(day)}"
                        aria-label="${esc(`${getDayLabelName(day)} 선생님별 시간표 보기`)}">${esc(day)}</button>
                `).join('')}
            </div>
        `;
    }

    function buildDayTeacherLayout(teachers, dayTeacherSessions) {
        let nextColumn = 2;
        return (teachers || []).map(teacher => {
            const key = teacherKey(teacher);
            const laneCount = Math.max(1, ...(dayTeacherSessions || [])
                .filter(session => (session.teacher_key || teacherKey(session.teacherName || '')) === key)
                .map(session => Number(session.laneCount || 1)));
            const meta = { name: teacher, key, startColumn: nextColumn, laneCount };
            nextColumn += laneCount;
            return meta;
        });
    }

    function renderDayTeacherCard(daySession, day, column, row) {
        const periods = sortPeriods(daySession?.periods || []);
        const span = Math.max(1, Number(daySession?.rowSpan || periods.length || 1));
        return `
            <article class="eie-weekday-card"
                style="grid-column:${column};grid-row:${row} / span ${span};--eie-weekday-row-span:${span};"
                data-eie-day-teacher-key="${esc(daySession.teacher_key || teacherKey(daySession.teacherName || ''))}">
                <div class="eie-weekday-card__class">
                    <span>Class</span>
                    <strong title="${esc(daySession.class_full_name || daySession.material || '')}">${esc(daySession.material || 'Class 없음')}</strong>
                </div>
                <div class="eie-weekday-card__students">
                    ${renderStudentNames(daySession.students || [], { linkStudents: true, sessionId: daySession.session_id, cellId: daySession.source_cell_ids?.[0] || '' })}
                </div>
            </article>
        `;
    }

    function renderDayTeacherOverlay(displaySessions, day) {
        if (!day) return '';
        const dayTeacherSessions = buildDayTeacherSessions(displaySessions, day);
        const teachers = collectDayTeachers(dayTeacherSessions);
        const teacherLayout = buildDayTeacherLayout(teachers, dayTeacherSessions);
        const teacherMetaByKey = new Map(teacherLayout.map(meta => [meta.key, meta]));
        const runtimePeriodMap = buildRuntimePeriodTimeMap(displaySessions || []);
        const periodGroups = buildPeriodGroups(displaySessions || [], runtimePeriodMap);
        const periodRow = new Map(periodGroups.map((group, index) => [group.key, index + 2]));
        const cards = dayTeacherSessions.map(daySession => {
            const first = sortPeriods(daySession.periods || [])[0] || {};
            const teacherMeta = teacherMetaByKey.get(daySession.teacher_key || teacherKey(daySession.teacherName || ''));
            const col = teacherMeta ? teacherMeta.startColumn + Number(daySession.laneIndex || 0) : 0;
            const row = periodRow.get(gridPeriodKey(first));
            if (!col || !row) return '';
            return renderDayTeacherCard(daySession, day, col, row);
        }).join('');
        const laneColumnCount = teacherLayout.reduce((sum, meta) => sum + Number(meta.laneCount || 1), 0);
        return `
            <section class="eie-weekday-overlay" aria-label="${esc(`${getDayLabelName(day)} 선생님별 시간표`)}">
                <div class="eie-weekday-modal-backdrop" aria-hidden="true"></div>
                <div class="eie-weekday-modal-window" role="dialog" aria-modal="true" aria-label="${esc(`${getDayLabelName(day)} 선생님별 시간표`)}">
                    <div class="eie-weekday-overlay__bar">
                        <div class="eie-weekday-overlay__start">
                            <button type="button" class="eie-small-button eie-weekday-overlay__home" data-eie-v2-day-overlay-close aria-label="전체 시간표로 돌아가기">전체 시간표</button>
                        </div>
                        <div class="eie-weekday-overlay__center">
                            ${renderWeekdayOverlayTabs(day)}
                        </div>
                        <div class="eie-weekday-overlay__end">
                            <button type="button" class="eie-small-button eie-weekday-overlay__close" data-eie-v2-day-overlay-close aria-label="요일별 시간표 닫기">닫기</button>
                        </div>
                    </div>
                    <div class="eie-weekday-overlay__scroll">
                        <div class="eie-weekday-grid"
                            style="--eie-weekday-row-count:${periodGroups.length};--eie-weekday-lane-columns:${Math.max(laneColumnCount, 1)};">
                            <div class="eie-weekday-grid__corner" style="grid-column:1;grid-row:1;" aria-hidden="true"></div>
                            ${teacherLayout.map(meta => `
                                <div class="eie-weekday-grid__teacher eie-v2-teacher-frame-cell eie-v2-grid-teacher-header" style="grid-column:${meta.startColumn} / span ${meta.laneCount};grid-row:1;" data-eie-day-teacher-key="${esc(meta.key)}" data-eie-v2-teacher-key="${esc(meta.key)}">
                                    <strong>${esc(meta.name)}</strong>
                                </div>
                            `).join('')}
                            ${periodGroups.map((group, index) => {
                                const row = index + 2;
                                const title = periodTitle(group.sample);
                                return `
                                    <div class="eie-weekday-grid__period" style="grid-column:1;grid-row:${row};">
                                        <strong>${esc(title.period)}</strong>
                                        <span>${esc(title.time)}</span>
                                    </div>
                                    ${teacherLayout.map(meta => Array.from({ length: meta.laneCount }, (_, laneIndex) => `
                                        <div class="eie-weekday-grid__blank" style="grid-column:${meta.startColumn + laneIndex};grid-row:${row};" aria-hidden="true"></div>
                                    `).join('')).join('')}
                                `;
                            }).join('')}
                            ${cards}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    function renderPeriodTeacherRows(session) {
        const periods = sortPeriods(session?.periods?.length ? session.periods : [periodRecordFromCell(session)]);
        return `
            <div class="eie-v2-card-teacher-table" aria-label="교시별 요일 담당 선생님">
                <div class="eie-v2-card-teacher-row is-head" aria-hidden="true">
                    <span></span>
                    ${DAY_ORDER.slice(0, 5).map(day => `<span>${esc(day)}</span>`).join('')}
                </div>
                ${periods.map(period => `
                    <div class="eie-v2-card-teacher-row is-body">
                        <strong title="${esc(period.display_time_range || displayEieTimeRange(period.start_time, period.end_time, period.period_order))}">${esc(period.period_label || session.period_label || '')}</strong>
                        ${DAY_ORDER.slice(0, 5).map(day => `<span data-eie-day-teacher-key="${esc(teacherColorKeyForPeriodDay(period, session, day))}" title="${esc((period.day_teachers?.[day] || session.day_teachers?.[day] || []).join(', ') || '-')}">${esc(teacherShortForPeriodDay(period, session, day))}</span>`).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderWeeklyCard(session) {
        const status = normalizeStatus(session.status);
        const isSpecial = status !== 'active' && status !== 'imported';
        const isSelected = viewState.selectedSessionId === session.session_id;
        const isDrafted = viewState.editMode && !!viewState.editDraft[session.session_id];
        const isCopySource = viewState.editMode && viewState.editCopySourceSessionId === session.session_id;
        const isTempCopy = viewState.editMode && !!session.is_temp_copy;
        const canEditCard = viewState.editMode && !isTempCopy;
        const articleAttrs = isTempCopy
            ? `role="group" aria-label="${esc(session.material)} 저장 전 임시 수업"`
            : `role="button" tabindex="0" data-eie-v2-session="${esc(session.session_id)}" aria-label="${esc(session.material)} 수업 상세 보기"`;
        const homeroomColorKey = teacherKey(session.homeroom_teacher || session.teacher_name || '');
        return `
            <article ${articleAttrs}
                data-eie-homeroom="${esc(homeroomColorKey)}"
                data-eie-v2-period-span="${esc(String(Math.max(1, session?.periods?.length || 1)))}"
                class="eie-v2-week-card ${viewState.editMode ? 'is-edit-card' : ''} ${isSelected ? 'is-selected' : ''} ${isDrafted ? 'is-edit-drafted' : ''} ${isCopySource ? 'is-copy-source' : ''} ${isTempCopy ? 'is-temp-copy' : ''}"
                ${canEditCard ? `draggable="true" data-eie-drag-session="${esc(session.session_id)}"` : ''}>
                ${viewState.editMode ? `
                    <div class="eie-v2-card-edit-actions">
                        ${canEditCard ? `<button type="button" class="eie-v2-card-copy-button" data-eie-copy-session="${esc(session.session_id)}" title="이 반을 복사해서 빈 슬롯에 붙여넣습니다" aria-label="${esc(`${session.material || session.class_full_name || '선택한 반'} 복사`)}">${isCopySource ? '복사됨' : '복사'}</button>` : ''}
                        <button type="button" class="eie-v2-card-delete-button" data-eie-delete-session="${esc(session.session_id)}" title="반카드만 삭제합니다. 학생은 삭제되지 않습니다." aria-label="${esc(`${session.material || session.class_full_name || '선택한 반'} 반카드 삭제`)}">삭제</button>
                    </div>
                ` : ''}
                ${isTempCopy ? '<span class="eie-v2-card-copy-badge" aria-label="저장 전 임시 수업">저장 전</span>' : ''}
                <div class="eie-v2-card-material-row">
                    <span>Class</span>
                    <strong title="${esc(session.class_full_name || session.material)}">${esc(session.material || 'Class 없음')}</strong>
                </div>
                ${renderPeriodTeacherRows(session)}
                ${isSpecial ? `<em class="eie-v2-status-badge is-${esc(status)}">${esc(statusLabel(status))}</em>` : ''}
                ${renderStudentPreview(session.students, { linkStudents: true, sessionId: session.session_id, cellId: session.source_cell_ids?.[0] || '' })}
            </article>
        `;
    }

    function periodTitle(session) {
        const label = normalizeKey(session?.period_label);
        const order = Number(session?.period_order || 0);
        const period = label && !label.includes('~')
            ? label
            : (Number.isFinite(order) && order > 0 ? `${order}교시` : '교시 미정');
        const standard = standardPeriodTime(order);
        const time = displayEieTimeRange(
            session?.start_time || standard?.start_time,
            session?.end_time || standard?.end_time,
            order
        );
        return { period, time };
    }

    function sessionHomeroomKey(session) {
        return teacherKey(session?.homeroom_teacher || session?.teacher_name || '미정');
    }

    function sessionHomeroomName(session) {
        return normalizeKey(session?.homeroom_teacher || session?.teacher_name || '미정') || '미정';
    }

    function buildHomeroomColumns(/* sessions unused — columns are fixed */) {
        // 상단 담임 열은 고정 5명만: Carmen / Zoe / IVY / STACY / Lily
        // Laura · Foreigner · 미정은 절대 열에 포함하지 않는다
        return HOMEROOM_COLUMN_TEACHERS.map((name, index) => ({
            name,
            key: teacherKey(name),
            index
        }));
    }

    function effectiveHomeroomKey(session) {
        if (viewState.editMode && viewState.editDraft[session.session_id]?.homeroomKey) {
            return viewState.editDraft[session.session_id].homeroomKey;
        }
        return sessionHomeroomKey(session);
    }

    function sessionsForTeacher(sessions, teacher) {
        const key = teacher?.key || '';
        return (sessions || []).filter(session => effectiveHomeroomKey(session) === key);
    }

    function visibleTeacherSessions(sessions, teacher) {
        const seen = new Set();
        return sessionsForTeacher(sessions, teacher).filter(session => {
            const status = normalizeStatus(session?.status);
            if (status === 'hidden' || status === 'archived' || status === 'inactive') return false;
            const key = normalizeKey(session?.session_id || session?.source_cell_ids?.join('|') || session?.material || '');
            if (key && seen.has(key)) return false;
            if (key) seen.add(key);
            return true;
        });
    }

    function studentStableLaneKey(student) {
        return normalizeKey(
            student?.student_id || student?.confirmed_student_id || student?.matched_student_id ||
            student?.canonical_student_id || student?.id || student?.pin || student?.student_pin ||
            student?.name || student?.display_name || student?.student_name_raw || ''
        ).toLowerCase();
    }

    function sessionStudentLaneSignature(session) {
        const keys = (Array.isArray(session?.students) ? session.students : [])
            .map(studentStableLaneKey)
            .filter(Boolean)
            .sort();
        if (keys.length) return `students:${keys.join('|')}`;
        const mat = normalizeKey(session?.material || session?.class_full_name || '').toLowerCase();
        const tch = normalizeKey(session?.homeroom_teacher || session?.teacher_name || '').toLowerCase();
        if (mat) return `class:${mat}|teacher:${tch}`;
        return `id:${normalizeKey(session?.session_id || '').toLowerCase()}`;
    }

    function laneMapKey(group, teacher) {
        return `${normalizeKey(group?.key || '')}::${teacher?.key || ''}`;
    }

    function sessionPeriodRows(session, periodRowIndex, runtimePeriodMap) {
        const draft = viewState.editMode && viewState.editDraft[session?.session_id];
        const periods = gridPeriodsForSession(session, runtimePeriodMap);
        const draftPeriodKey = normalizedDraftPeriodKey(draft, periods[0]);
        if (draftPeriodKey) {
            const startRow = periodRowIndex.get(draftPeriodKey);
            if (Number.isFinite(startRow)) {
                const span = Math.max(1, periods.length || 1);
                return { startRow, endRow: startRow + span - 1 };
            }
        }
        const rows = periods
            .map((period, index) => {
                return periodRowIndex.get(gridPeriodKey(period));
            })
            .filter(Number.isFinite);
        if (!rows.length) {
            const fallback = periodRowIndex.get(draftPeriodKey || gridPeriodKey(periods[0]) || session?.period_key || '');
            if (Number.isFinite(fallback)) rows.push(fallback);
        }
        const startRow = rows.length ? Math.min(...rows) : 0;
        const endRow = rows.length ? Math.max(...rows) : startRow;
        return { startRow, endRow };
    }

    function rowRangesOverlap(a, b) {
        if (!a || !b) return false;
        return Number(a.startRow || 0) <= Number(b.endRow || 0) &&
            Number(b.startRow || 0) <= Number(a.endRow || 0);
    }

    function buildAutoSlotLaneMap(groups, teachers, runtimePeriodMap) {
        const result = new Map();
        const safeGroups = Array.isArray(groups) ? groups : [];
        const periodRowIndex = new Map();
        safeGroups.forEach((group, index) => periodRowIndex.set(group.key, index + 2));

        (teachers || []).forEach(teacher => {
            const seen = new Set();
            const placements = [];
            safeGroups.forEach(group => {
                sessionsForTeacher(group.sessions, teacher).forEach(session => {
                    const key = normalizeKey(session?.session_id || session?.source_cell_ids?.join('|') || '');
                    if (key && seen.has(key)) return;
                    if (key) seen.add(key);
                    const range = sessionPeriodRows(session, periodRowIndex, runtimePeriodMap);
                    if (!range.startRow) return;
                    placements.push({
                        session,
                        signature: sessionStudentLaneSignature(session),
                        lane: 0,
                        startRow: range.startRow,
                        endRow: range.endRow
                    });
                });
            });

            placements
                .sort((a, b) => {
                    if (a.startRow !== b.startRow) return a.startRow - b.startRow;
                    if (a.endRow !== b.endRow) return b.endRow - a.endRow;
                    return (a.signature || '').localeCompare(b.signature || '');
                })
                .forEach(item => {
                    const overlapping = placements.filter(other => other !== item && other.lane && rowRangesOverlap(item, other));
                    const occupied = new Set(overlapping.map(other => Number(other.lane || 1)));
                    const storedLane = Number(item.session?.slot_lane || 0);
                    if (storedLane >= 1 && !occupied.has(storedLane)) item.lane = storedLane;
                    if (!item.lane) {
                        let lane = 1;
                        while (occupied.has(lane)) lane += 1;
                        item.lane = lane;
                    }
                });

            safeGroups.forEach((group, groupIndex) => {
                const row = groupIndex + 2;
                const items = placements
                    .filter(item => item.startRow <= row && row <= item.endRow)
                    .map(item => ({
                        session: item.session,
                        lane: item.lane
                    }));
                result.set(laneMapKey(group, teacher), items);
            });
        });

        return result;
    }

    function laneItemsForSlot(group, teacher, autoLaneMap) {
        const key = laneMapKey(group, teacher);
        const items = autoLaneMap?.get(key);
        if (Array.isArray(items)) return items;
        return sessionsForTeacher(group?.sessions || [], teacher).map((session, index) => ({ session, lane: index + 1 }));
    }

    function maxLaneForSlot(group, teacher, autoLaneMap) {
        const items = laneItemsForSlot(group, teacher, autoLaneMap).filter(item => {
            if (!item?.session) return false;
            const status = normalizeStatus(item.session.status);
            return status !== 'hidden' && status !== 'archived' && status !== 'inactive';
        });
        return items.reduce((max, item) => Math.max(max, Number(item.lane || 1)), 0);
    }

    function applyTeacherWidthHints(groups, teachers, autoLaneMap) {
        const safeGroups = Array.isArray(groups) ? groups : [];
        return (teachers || []).map(teacher => {
            const maxCards = safeGroups.reduce((max, group) => {
                return Math.max(max, maxLaneForSlot(group, teacher, autoLaneMap));
            }, 0);
            return {
                ...teacher,
                maxCards,
                widthPx: 170 + Math.max(0, maxCards - 1) * 164,
                isWide: maxCards >= 2
            };
        });
    }

    function teacherColumnTemplate(teachers) {
        return (teachers || []).map(teacher => `${Number(teacher?.widthPx || 170)}px`).join(' ');
    }

    function teacherBoardMinWidth(teachers) {
        const rows = Array.isArray(teachers) ? teachers : [];
        const columns = rows.reduce((sum, teacher) => sum + Number(teacher?.widthPx || 170), 0);
        const columnGap = Math.max(0, rows.length - 1) * 6;
        return `calc(var(--eie-v2-period-width) + ${columns + columnGap + 30}px)`;
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

    function renderTeacherHeaderRow(teachers, columnTemplate) {
        return `
            <div class="eie-v2-teacher-frame-head" aria-label="담임" style="grid-template-columns:${esc(columnTemplate || '')};">
                ${teachers.map(teacher => `
                    <div class="eie-v2-teacher-frame-cell ${teacher.isWide ? 'is-wide' : 'is-normal'}" data-eie-v2-teacher-key="${esc(teacher.key)}">
                        <strong>${esc(teacher.name)}</strong>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function slotDataFromGroup(group, teacher) {
        const sample = group?.sample || {};
        return {
            teacherKey: teacher?.key || '',
            teacherName: teacher?.name || '',
            columnIndex: Number.isFinite(Number(teacher?.index)) ? Number(teacher.index) : 0,
            periodKey: group?.key || '',
            periodLabel: sample.period_label || '',
            periodOrder: Number(sample.period_order || 0),
            startTime: sample.start_time || '',
            endTime: sample.end_time || '',
            // 주간 V2 보드에서는 붙여넣기 대상 요일이 특정되지 않는다.
            // 원본 셀 day_label을 복사하면 잘못된 요일 저장이 될 수 있으므로 기본값은 빈 값으로 둔다.
            dayLabel: ''
        };
    }

    function detectTargetSlotLane(targetSlot, existingCards) {
        const usedLanes = new Set();
        (existingCards || []).forEach(s => usedLanes.add(Number(s.slot_lane) >= 1 ? Number(s.slot_lane) : 1));
        (viewState.editCreates || []).filter(cell => {
            return Number(cell.period_order) === Number(targetSlot.periodOrder) &&
                   normalizeKey(cell.teacher_name_raw || '') === normalizeKey(targetSlot.teacherName || '');
        }).forEach(cell => usedLanes.add(Number(cell.slot_lane) >= 1 ? Number(cell.slot_lane) : 1));
        if (!usedLanes.has(1)) return 1;
        if (!usedLanes.has(2)) return 2;
        return null;
    }

    function sourcePeriodKey(session) {
        return periodGroupKey(session);
    }

    function cellPeriodKey(cell) {
        return periodGroupKey(cell);
    }

    function slotKeyOf(targetSlot) {
        return `${normalizeKey(targetSlot?.periodKey || '')}::${teacherKey(targetSlot?.teacherName || targetSlot?.teacherKey || '')}`;
    }

    function tempCellSlotKey(cell) {
        return `${cellPeriodKey(cell)}::${teacherKey(cell?.teacher_name_raw || cell?.homeroom_teacher || '')}`;
    }

    function hasUnsavedEditChanges() {
        return !!(viewState.editMode && (
            Object.keys(viewState.editDraft || {}).length ||
            (Array.isArray(viewState.editCreates) && viewState.editCreates.length)
        ));
    }

    function copiedSessionRecord() {
        if (!viewState.editCopySourceSessionId) return null;
        return lastRenderedSessions.find(session => session.session_id === viewState.editCopySourceSessionId) || null;
    }

    function canPasteCopiedSessionToSlot(group, teacher, cards) {
        if (!viewState.editMode || !viewState.editCopySourceSessionId) return false;
        const source = copiedSessionRecord();
        if (!source) return false;
        const target = slotDataFromGroup(group, teacher);
        if (!target.periodKey || !target.teacherKey) return false;
        if (normalizeKey(target.periodKey) === sourcePeriodKey(source)) return false;
        const targetSlotKey = slotKeyOf(target);
        const alreadySameCopy = (viewState.editCreates || []).some(cell => (
            tempCellSlotKey(cell) === targetSlotKey &&
            normalizeKey(cell.copy_source_session_id || '') === normalizeKey(source.session_id || '')
        ));
        if (alreadySameCopy) return false;
        if (detectTargetSlotLane(target, cards) === null) return false;
        return true;
    }

    function renderLaneCards(group, teacher, autoLaneMap) {
        const laneItems = laneItemsForSlot(group, teacher, autoLaneMap).filter(item => item?.session);
        if (!laneItems.length) return '';
        const maxLane = laneItems.reduce((max, item) => Math.max(max, Number(item.lane || 1)), 1);
        const byLane = new Map();
        laneItems.forEach(item => {
            const lane = Math.max(1, Number(item.lane || 1));
            if (!byLane.has(lane)) byLane.set(lane, []);
            byLane.get(lane).push(item.session);
        });
        const parts = [];
        for (let lane = 1; lane <= maxLane; lane += 1) {
            const laneCards = byLane.get(lane) || [];
            if (laneCards.length) parts.push(laneCards.map(renderWeeklyCard).join(''));
            else parts.push('<div class="eie-v2-lane-placeholder" aria-hidden="true"></div>');
        }
        return parts.join('');
    }

    function renderTeacherSlots(group, teachers, columnTemplate, autoLaneMap) {
        return `
            <div class="eie-v2-teacher-frame-row" style="--eie-v2-homeroom-count:${teachers.length};grid-template-columns:${esc(columnTemplate || '')};">
                ${teachers.map(teacher => {
                    const cards = sessionsForTeacher(group.sessions, teacher);
                    const maxLane = maxLaneForSlot(group, teacher, autoLaneMap);
                    const slot = slotDataFromGroup(group, teacher);
                    const dropAttrs = viewState.editMode ? `
                        data-eie-drop-slot="true"
                        data-drop-teacher-key="${esc(slot.teacherKey)}"
                        data-drop-teacher-name="${esc(slot.teacherName)}"
                        data-drop-column-index="${esc(String(slot.columnIndex))}"
                        data-drop-period-key="${esc(slot.periodKey)}"
                        data-drop-period-label="${esc(slot.periodLabel)}"
                        data-drop-period-order="${esc(String(slot.periodOrder || ''))}"
                        data-drop-start="${esc(slot.startTime)}"
                        data-drop-end="${esc(slot.endTime)}"
                        data-drop-day-label="${esc(slot.dayLabel || '')}"` : '';
                    const pasteButton = canPasteCopiedSessionToSlot(group, teacher, cards)
                        ? `<button type="button" class="eie-v2-paste-button" data-eie-paste-session="true"
                                data-drop-teacher-key="${esc(slot.teacherKey)}"
                                data-drop-teacher-name="${esc(slot.teacherName)}"
                                data-drop-column-index="${esc(String(slot.columnIndex))}"
                                data-drop-period-key="${esc(slot.periodKey)}"
                                data-drop-period-label="${esc(slot.periodLabel)}"
                                data-drop-period-order="${esc(String(slot.periodOrder || ''))}"
                                data-drop-start="${esc(slot.startTime)}"
                                data-drop-end="${esc(slot.endTime)}"
                                data-drop-day-label="${esc(slot.dayLabel || '')}"
                                aria-label="${esc(`${slot.periodLabel || '선택한 교시'} ${slot.teacherName || '담임'} 슬롯에 복사한 반 붙여넣기`)}">여기에 붙여넣기</button>`
                        : '';
                    return `
                        <div class="eie-v2-teacher-slot ${teacher.isWide ? 'is-wide' : 'is-normal'} ${maxLane >= 2 ? 'has-multiple-cards' : 'has-single-card'}" data-eie-v2-teacher-key="${esc(teacher.key)}" ${dropAttrs}>
                            ${cards.length ? renderLaneCards(group, teacher, autoLaneMap) : `<div class="eie-v2-teacher-slot-empty" aria-hidden="${pasteButton ? 'false' : 'true'}">${pasteButton}</div>`}
                            ${cards.length && pasteButton ? pasteButton : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    function buildPeriodGroups(sessions, runtimePeriodMap) {
        const map = new Map();
        (sessions || []).forEach(session => {
            const draft = viewState.editMode && viewState.editDraft[session.session_id];
            const sessionPeriods = gridPeriodsForSession(session, runtimePeriodMap);
            sessionPeriods.forEach((period, index) => {
                const draftPeriodKey = normalizedDraftPeriodKey(draft, period);
                const key = index === 0 && draftPeriodKey
                    ? draftPeriodKey
                    : gridPeriodKey(period);
                if (!map.has(key)) {
                    const sample = index === 0 && draft
                        ? { ...session, period_label: draft.periodLabel, period_order: draft.periodOrder, start_time: draft.startTime, end_time: draft.endTime }
                        : { ...session, ...period, period_key: key };
                    map.set(key, { key, sample, sessions: [] });
                }
                if (index === 0) map.get(key).sessions.push(session);
            });
        });
        return Array.from(map.values()).sort((a, b) => {
            const ao = Number(a.sample.period_order || 0);
            const bo = Number(b.sample.period_order || 0);
            if (ao !== bo) return ao - bo;
            return (a.sample.start_minutes ?? 999999) - (b.sample.start_minutes ?? 999999);
        });
    }

    function gridPeriodKey(period) {
        return periodGroupKey(period);
    }

    function normalizedDraftPeriodKey(draft, fallbackPeriod) {
        if (!draft?.periodKey) return '';
        const order = Number(draft.periodOrder || fallbackPeriod?.period_order || 0);
        return Number.isFinite(order) && order > 0 ? periodGroupKey({ period_order: order }) : normalizeKey(draft.periodKey);
    }

    function gridRowSpanForSession(session, periodRowIndex, runtimePeriodMap) {
        const periods = gridPeriodsForSession(session, runtimePeriodMap);
        const rows = periods.map(period => periodRowIndex.get(gridPeriodKey(period))).filter(Number.isFinite);
        if (rows.length >= 2) return Math.max(1, Math.max(...rows) - Math.min(...rows) + 1);
        return Math.max(1, periods.length || 1);
    }

    function renderGridSlot(group, teacher, autoLaneMap) {
        const cards = laneItemsForSlot(group, teacher, autoLaneMap)
            .map(item => item?.session)
            .filter(Boolean);
        const maxLane = maxLaneForSlot(group, teacher, autoLaneMap);
        const slot = slotDataFromGroup(group, teacher);
        const dropAttrs = viewState.editMode ? `
            data-eie-drop-slot="true"
            data-drop-teacher-key="${esc(slot.teacherKey)}"
            data-drop-teacher-name="${esc(slot.teacherName)}"
            data-drop-column-index="${esc(String(slot.columnIndex))}"
            data-drop-period-key="${esc(slot.periodKey)}"
            data-drop-period-label="${esc(slot.periodLabel)}"
            data-drop-period-order="${esc(String(slot.periodOrder || ''))}"
            data-drop-start="${esc(slot.startTime)}"
            data-drop-end="${esc(slot.endTime)}"
            data-drop-day-label="${esc(slot.dayLabel || '')}"` : '';
        const pasteButton = canPasteCopiedSessionToSlot(group, teacher, cards)
            ? `<button type="button" class="eie-v2-paste-button" data-eie-paste-session="true"
                    data-drop-teacher-key="${esc(slot.teacherKey)}"
                    data-drop-teacher-name="${esc(slot.teacherName)}"
                    data-drop-column-index="${esc(String(slot.columnIndex))}"
                    data-drop-period-key="${esc(slot.periodKey)}"
                    data-drop-period-label="${esc(slot.periodLabel)}"
                    data-drop-period-order="${esc(String(slot.periodOrder || ''))}"
                    data-drop-start="${esc(slot.startTime)}"
                    data-drop-end="${esc(slot.endTime)}"
                    data-drop-day-label="${esc(slot.dayLabel || '')}"
                    aria-label="${esc(`${slot.periodLabel || '선택한 교시'} ${slot.teacherName || '선택한 선생님'} 붙여넣기`)}">붙여넣기</button>`
            : '';
        return `
            <div class="eie-v2-grid-slot ${maxLane >= 2 ? 'has-multiple-cards' : 'has-single-card'}"
                data-eie-v2-teacher-key="${esc(teacher.key)}"
                ${dropAttrs}>
                ${pasteButton}
            </div>
        `;
    }

    function gridLaneForSession(group, teacher, session, autoLaneMap) {
        const items = laneItemsForSlot(group, teacher, autoLaneMap);
        const found = items.find(item => item?.session?.session_id === session?.session_id);
        return Math.max(1, Number(found?.lane || session?.slot_lane || 1));
    }

    function renderGridCards(sessions, periodGroups, teachers, autoLaneMap, periodRowIndex, runtimePeriodMap) {
        const teacherIndex = new Map((teachers || []).map((teacher, index) => [teacher.key, index + 2]));
        const groupByKey = new Map((periodGroups || []).map(group => [group.key, group]));
        return (sessions || []).map(session => {
            const status = normalizeStatus(session?.status);
            if (status === 'hidden' || status === 'archived' || status === 'inactive') return '';
            const teacherKeyValue = effectiveHomeroomKey(session);
            const col = teacherIndex.get(teacherKeyValue);
            const periods = gridPeriodsForSession(session, runtimePeriodMap);
            const draft = viewState.editMode && viewState.editDraft[session.session_id];
            const startKey = normalizedDraftPeriodKey(draft, periods[0]) || gridPeriodKey(periods[0]);
            const row = periodRowIndex.get(startKey);
            if (!col || !row) return '';
            const teacher = teachers.find(item => item.key === teacherKeyValue);
            const group = groupByKey.get(startKey);
            const lane = gridLaneForSession(group, teacher, session, autoLaneMap);
            const span = draft?.periodKey ? Math.max(1, periods.length || 1) : gridRowSpanForSession(session, periodRowIndex, runtimePeriodMap);
            return `
                <div class="eie-v2-grid-card-wrapper"
                    style="grid-column:${col};grid-row:${row} / span ${span};--eie-v2-card-lane:${lane};--eie-v2-card-row-span:${span};">
                    ${renderWeeklyCard(session)}
                </div>
            `;
        }).join('');
    }

    function renderBoard(sessions) {
        const query = viewState.searchQuery || '';
        const filtered = (sessions || []).filter(session => matchesSearch(session, query));
        if (!filtered.length) {
            return `<div class="eie-v2-empty-state">${query ? '검색 결과가 없습니다.' : '등록된 EIE 시간표가 없습니다.'}</div>`;
        }
        const runtimePeriodMap = buildRuntimePeriodTimeMap(filtered);
        const periodGroups = buildPeriodGroups(filtered, runtimePeriodMap);
        const baseTeachers = buildHomeroomColumns(filtered);
        const autoLaneMap = buildAutoSlotLaneMap(periodGroups, baseTeachers, runtimePeriodMap);
        const teachers = applyTeacherWidthHints(periodGroups, baseTeachers, autoLaneMap);
        const columnTemplate = teacherColumnTemplate(teachers);
        const minWidth = teacherBoardMinWidth(teachers);
        const periodRowIndex = new Map();
        periodGroups.forEach((group, index) => periodRowIndex.set(group.key, index + 2));
        return `
            <div class="eie-v2-card-board" aria-label="EIE 시간표 그리드">
                <div class="eie-v2-board-scroll">
                    <div class="eie-v2-board-grid eie-v2-full-grid"
                        style="--eie-v2-homeroom-count:${teachers.length};--eie-v2-row-count:${periodGroups.length};--eie-v2-board-min-width:${esc(minWidth)};grid-template-columns:var(--eie-v2-period-width) ${esc(columnTemplate)};">
                        <div class="eie-v2-board-corner eie-v2-grid-corner" style="grid-column:1;grid-row:1;" aria-hidden="true"></div>
                        ${teachers.map((teacher, index) => `
                            <div class="eie-v2-teacher-frame-cell eie-v2-grid-teacher-header ${teacher.isWide ? 'is-wide' : 'is-normal'}"
                                style="grid-column:${index + 2};grid-row:1;"
                                data-eie-v2-teacher-key="${esc(teacher.key)}">
                                <strong>${esc(teacher.name)}</strong>
                            </div>
                        `).join('')}
                        ${periodGroups.map((group, index) => {
                            const row = index + 2;
                            const title = periodTitle(group.sample);
                            return `
                                <div class="eie-v2-period-head eie-v2-grid-period-label" style="grid-column:1;grid-row:${row};">
                                    <strong>${esc(title.period)}</strong>
                                    <span>${esc(title.time)}</span>
                                </div>
                                ${teachers.map((teacher, teacherOffset) => `
                                    <div style="grid-column:${teacherOffset + 2};grid-row:${row};">
                                        ${renderGridSlot(group, teacher, autoLaneMap)}
                                    </div>
                                `).join('')}
                            `;
                        }).join('')}
                        ${renderGridCards(filtered, periodGroups, teachers, autoLaneMap, periodRowIndex, runtimePeriodMap)}
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

    function renderStudentQuickRecords(sid) {
        if (!sid) return '';
        const rows = consultationRowsForStudent(sid).slice(0, 5);
        const selected = selectedPanelConsultation(rows);
        const selectedId = consultationRowId(selected);
        const loadingText = viewState.studentConsultationLoadedId === sid ? '' : '불러오는 중';
        const editing = viewState.studentConsultationFormOpen && normalizeKey(viewState.studentConsultationEditingId);
        const editingRow = editing ? (rows.find(row => consultationRowId(row) === editing) || null) : null;
        const editingType = consultationType(editingRow);
        const dateButtons = rows.map(row => {
            const id = consultationRowId(row);
            return `<button type="button" class="eie-v2-panel-consultation-date${id === selectedId ? ' is-active' : ''}" data-eie-v2-consultation-select="${esc(id)}">${esc(consultationDateLabel(row))}</button>`;
        }).join('');
        const formHtml = viewState.studentConsultationFormOpen ? `
            <div class="eie-v2-panel-consultation-form">
                <div class="eie-v2-panel-consultation-form-head">
                    <strong>${editingRow ? '상담 수정' : '새 상담 기록'}</strong>
                </div>
                <div class="eie-v2-panel-consultation-form-grid">
                    <label class="eie-v2-student-quick-field">
                        <span>상담일</span>
                        <input id="eie-v2-consultation-date" type="date" value="${esc(consultationDate(editingRow) || todayIso())}">
                    </label>
                    <label class="eie-v2-student-quick-field">
                        <span>유형</span>
                        <select id="eie-v2-consultation-type">
                            ${['학습', '생활', '진로', '학부모', '상담'].map(type => `<option value="${esc(type)}"${editingType === type ? ' selected' : ''}>${esc(type)}</option>`).join('')}
                        </select>
                    </label>
                    <label class="eie-v2-student-quick-field is-wide">
                        <span>상담 입력</span>
                        <textarea id="eie-v2-consultation-content" placeholder="상담 내용을 입력하세요.">${esc(normalizeKey(editingRow?.content))}</textarea>
                    </label>
                    <label class="eie-v2-student-quick-field is-wide">
                        <span>후속조치</span>
                        <textarea id="eie-v2-consultation-next-action" placeholder="다음 조치가 있으면 입력하세요.">${esc(normalizeKey(editingRow?.next_action || editingRow?.nextAction))}</textarea>
                    </label>
                </div>
                <div class="eie-v2-panel-consultation-form-actions">
                    <button type="button" class="eie-p-btn-cancel" data-eie-v2-consultation-cancel>취소</button>
                    <button type="button" class="eie-p-btn-save" data-eie-v2-consultation-save="${esc(sid)}"${viewState.studentSaving ? ' disabled' : ''}>${editingRow ? '수정 저장' : '상담 저장'}</button>
                </div>
            </div>
        ` : '';
        return `
            <div class="eie-v2-detail-section eie-v2-student-quick-records">
                <div class="eie-v2-panel-consultation-shell">
                    <div class="eie-v2-panel-consultation-head">
                        <strong>최근 상담</strong>
                        ${loadingText ? `<span>${esc(loadingText)}</span>` : ''}
                    </div>
                    ${dateButtons ? `<div class="eie-v2-panel-consultation-dates">${dateButtons}</div>` : ''}
                    ${renderPanelConsultationDetail(selected)}
                    ${formHtml}
                    ${viewState.studentConsultationFormOpen ? '' : `
                        <div class="eie-v2-panel-consultation-footer">
                            <button type="button" class="eie-p-btn-new" data-eie-v2-consultation-new="${esc(sid)}">+ 새 상담</button>
                        </div>
                    `}
                </div>
                <div class="eie-v2-student-quick-grid">
                    <label class="eie-v2-student-quick-field">
                        <span>등원일</span>
                        <input id="eie-v2-attendance-date" type="date" value="${esc(todayIso())}">
                    </label>
                    <button type="button" class="eie-p-btn-save" data-eie-v2-attendance-save="${esc(sid)}" data-eie-v2-attendance-date-input="eie-v2-attendance-date">등원 저장</button>
                </div>
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
        // Foreigner/PREP are timetable coverage markers, not assignable 담당 선생님 options.
        // Keep them out of the student teacher picker even if future timetable data reintroduces them.
        const isAssignableTeacherName = name => {
            const key = normalizeKey(name).toLowerCase().replace(/\s+/g, '');
            return key !== 'foreigner' && key !== 'foreign' && key !== '외국인' && key !== '원어민'
                && key !== 'prep' && key !== '프랩';
        };
        const selected = studentTeacherNames(student).filter(isAssignableTeacherName);
        let roster = teacherRoster().filter(isAssignableTeacherName);
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

    function renderNewStudentPanel() {
        const saving = viewState.studentSaving;
        return `
            <aside class="eie-v2-detail-panel eie-v2-student-panel eie-p-panel" aria-label="신입생 등록">
                <div class="eie-p-head">
                    <div class="eie-p-head-top">
                        <div class="eie-p-head-identity">
                            <div class="eie-p-head-text">
                                <div class="eie-p-head-name">신입생 등록</div>
                                <div class="eie-p-head-sub">새 학생</div>
                            </div>
                        </div>
                        <div class="eie-p-head-actions">
                            <button type="button" class="eie-p-btn-cancel" data-eie-v2-student-cancel ${saving ? 'disabled' : ''}>취소</button>
                            <button type="button" class="eie-p-btn-new" data-eie-v2-student-save ${saving ? 'disabled' : ''}>${saving ? '저장 중...' : '등록'}</button>
                        </div>
                    </div>
                    ${viewState.studentError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.studentError)}</div>` : ''}
                </div>
                <div class="eie-v2-student-form">
                    <span class="eie-p-section-label">필수 정보</span>
                    <div class="eie-p-card">
                        <label class="eie-p-form-field"><span>학생명 <span class="eie-p-required">*</span></span><input id="eie-v2-edit-name" type="text" placeholder="학생명 입력" autocomplete="off"></label>
                        <div class="eie-p-form-row">
                            <label class="eie-p-form-field"><span>학생구분</span>${renderStudentTypeSelect('eie-v2-edit-student-type', '')}</label>
                            <label class="eie-p-form-field"><span>학년</span>${renderGradeSelect('eie-v2-edit-grade', '')}</label>
                        </div>
                        <div class="eie-p-form-row">
                            <label class="eie-p-form-field"><span>학교</span><input id="eie-v2-edit-school" type="text" autocomplete="off"></label>
                            <label class="eie-p-form-field"><span>차량</span><input id="eie-v2-edit-vehicle" type="text" autocomplete="off"></label>
                        </div>
                    </div>
                    <span class="eie-p-section-label">연락처</span>
                    <div class="eie-p-card">
                        <div class="eie-p-form-row">
                            <label class="eie-p-form-field"><span>학생 연락처</span><input id="eie-v2-edit-phone" type="tel" autocomplete="off"></label>
                            <label class="eie-p-form-field"><span>학부모 연락처</span><input id="eie-v2-edit-parent-phone" type="tel" autocomplete="off"></label>
                        </div>
                        <label class="eie-p-form-field"><span>주소</span><input id="eie-v2-edit-address" type="text" autocomplete="off"></label>
                    </div>
                    <span class="eie-p-section-label">추가 정보 (선택)</span>
                    <details class="eie-p-drawer">
                        <summary class="eie-p-drawer-trigger">보호자·메모<span class="eie-p-drawer-caret" aria-hidden="true">⌄</span></summary>
                        <div class="eie-p-drawer-body">
                            <label class="eie-p-form-field"><span>보호자 관계</span><input id="eie-v2-edit-guardian-relation" type="text" autocomplete="off"></label>
                            <label class="eie-p-form-field"><span>메모</span><textarea id="eie-v2-edit-memo"></textarea></label>
                        </div>
                        <div class="eie-p-danger-zone">
                            <div class="eie-p-danger-zone-left">
                                <span>첫 등원일</span>
                                <input id="eie-v2-new-enroll-date" type="date" value="${esc(todayIso())}" style="width:auto;">
                            </div>
                        </div>
                    </details>
                </div>
            </aside>
        `;
    }

    function renderStudentTransferPanel(student) {
        const saving = viewState.studentSaving;
        const sid = studentRowId(student) || viewState.selectedStudentId;
        const currentSession = selectedSessionRecord();
        const currentLabel = currentSession
            ? `${currentSession.material || '-'} · ${currentSession.period_label || ''}`
            : '-';
        const available = lastRenderedSessions.filter(s => s.session_id !== currentSession?.session_id);
        const targetId = normalizeKey(viewState.transferTargetId);
        return `
            <aside class="eie-v2-detail-panel eie-v2-student-panel eie-p-panel" aria-label="${esc(studentDisplayName(student))} 전반">
                <div class="eie-p-head">
                    <div class="eie-p-head-top">
                        <div class="eie-p-head-identity">
                            <div class="eie-p-head-text">
                                <div class="eie-p-head-name">${esc(studentDisplayName(student))}</div>
                                <div class="eie-p-head-sub">전반 · 현재 ${esc(currentLabel)}</div>
                            </div>
                        </div>
                        <div class="eie-p-head-actions">
                            <button type="button" class="eie-p-btn-cancel" data-eie-v2-student-cancel ${saving ? 'disabled' : ''}>취소</button>
                            <button type="button" class="eie-p-btn-warn" data-eie-v2-transfer-confirm="${esc(sid)}" ${(!targetId || saving) ? 'disabled' : ''}>${saving ? '이동 중...' : '이동'}</button>
                        </div>
                    </div>
                    ${viewState.studentError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.studentError)}</div>` : ''}
                </div>
                <span class="eie-p-section-label">이동할 반 선택</span>
                <div class="eie-p-card" style="gap:5px;">
                    ${available.length ? available.map(s => {
                        const rawTime = displaySessionTimeRange(s);
                        const t = rawTime && rawTime !== '시간 미정' ? rawTime : '';
                        return `<button type="button" class="eie-p-transfer-card${targetId === s.session_id ? ' is-selected' : ''}" data-eie-v2-transfer-pick="${esc(s.session_id)}">
                            <span class="eie-p-transfer-card-title">${esc(s.material || '-')}</span>
                            <span class="eie-p-transfer-card-sub">${esc(s.period_label || '')}${t ? ` · ${esc(t)}` : ''}</span>
                        </button>`;
                    }).join('') : '<span class="eie-p-field-value is-empty">이동할 수 있는 반이 없습니다.</span>'}
                </div>
            </aside>
        `;
    }

    function renderApProfileInfoRow(label, value, options = {}) {
        const text = normalizeKey(value);
        return `
            <div class="eie-v2-ap-info-row">
                <span class="eie-v2-ap-info-label">${esc(label)}</span>
                <span class="eie-v2-ap-info-value${text ? '' : ' is-muted'}">${esc(text || options.empty || '')}</span>
            </div>
        `;
    }

    function renderStudentPanelTabs(activeTab) {
        const tab = ['basic', 'consultation', 'grades'].includes(activeTab) ? activeTab : 'basic';
        const tabs = [
            ['basic', '기본'],
            ['consultation', '상담'],
            ['grades', '성적']
        ];
        return `
            <div class="eie-v2-ap-tabs">
                ${tabs.map(([key, label]) => `
                    <button type="button" class="eie-v2-ap-tab${tab === key ? ' is-active' : ''}" data-eie-v2-student-detail-tab="${esc(key)}">${esc(label)}</button>
                `).join('')}
            </div>
        `;
    }

    function renderStudentPanelProfileHead(student, sid, subtitle) {
        const status = studentStatus(student);
        const statusClass = status === 'active' || status === 'imported' ? 'is-active' : (status === 'archived' || status === 'hidden' ? 'is-archived' : '');
        const session = selectedSessionRecord();
        const teacherNames = studentTeacherNames(student).join(', ');
        const meta = [
            [studentSchool(student), normalizeGrade(studentGrade(student)) || studentGrade(student)].filter(Boolean).join(' · ') || subtitle,
            session?.material || '',
            teacherNames ? `담임 ${teacherNames}` : ''
        ].filter(Boolean).join(' · ');
        return `
            <header class="eie-v2-ap-profile-head">
                <div class="eie-v2-ap-head-main">
                    <div class="eie-v2-ap-head-title">
                        <h1>${esc(studentDisplayName(student))}</h1>
                        <span class="eie-v2-ap-status-dot ${esc(statusClass)}"></span>
                        <span class="eie-v2-ap-status-text ${esc(statusClass)}">${esc(statusLabel(status))}</span>
                    </div>
                    <div class="eie-v2-ap-meta-line">${esc(meta || '학교/학년 미등록')}</div>
                </div>
                <div class="eie-v2-ap-head-actions">
                    <button type="button" class="eie-v2-ap-head-btn" data-eie-v2-student-back>닫기</button>
                    ${sid ? '<button type="button" class="eie-v2-ap-head-btn is-primary" data-eie-v2-student-edit>수정</button>' : ''}
                </div>
            </header>
        `;
    }

    function renderStudentBasicPanel(student, sid) {
        const session = selectedSessionRecord();
        const recentClass = session ? [session.period_label, session.material].filter(Boolean).join(' · ') : '';
        const latestConsultation = consultationRowsForStudent(sid)[0];
        const latestConsultationText = latestConsultation
            ? [consultationDate(latestConsultation), consultationType(latestConsultation)].filter(Boolean).join(' ')
            : '';
        const parentInfo = [
            studentParentPhone(student),
            studentGuardianRelation(student) ? `(${studentGuardianRelation(student)})` : ''
        ].filter(Boolean).join(' ');
        return `
            <div class="eie-v2-ap-tab-body">
                <section class="eie-v2-ap-card">
                    <div class="eie-v2-ap-section-head">
                        <h3>학생 상세 정보</h3>
                    </div>
                    <div class="eie-v2-ap-info-list">
                        ${renderApProfileInfoRow('학생 연락처', studentPhone(student))}
                        ${renderApProfileInfoRow('보호자 정보', parentInfo)}
                        ${renderApProfileInfoRow('주소', studentAddress(student))}
                        ${renderApProfileInfoRow('차량', studentVehicleInfo(student))}
                        ${renderApProfileInfoRow('등원일', studentEnrollDate(student) || '미등록')}
                        ${renderApProfileInfoRow('메모', studentMemo(student))}
                    </div>
                </section>
                <section class="eie-v2-ap-card">
                    <div class="eie-v2-ap-section-head"><h3>최근 활동</h3></div>
                    <div class="eie-v2-ap-info-list">
                        ${renderApProfileInfoRow('최근 수업', recentClass)}
                        ${renderApProfileInfoRow('최근 시험', '')}
                        ${renderApProfileInfoRow('마지막 상담', latestConsultationText)}
                    </div>
                </section>
                <section class="eie-v2-ap-card">
                    <div class="eie-v2-ap-history-head">
                        <div>
                            <h3>학생 이력</h3>
                            <p>상태 변경 0건 · 반 이동 0건</p>
                        </div>
                        <div>
                            <button type="button" class="eie-v2-ap-mini-btn" disabled>상태 변경 이력</button>
                            <button type="button" class="eie-v2-ap-mini-btn" disabled>반 이동 이력</button>
                        </div>
                    </div>
                    <div class="eie-v2-ap-attendance-save">
                        <label><span>등원일</span><input id="eie-v2-attendance-date" type="date" value="${esc(todayIso())}"></label>
                        ${sid ? `<button type="button" class="eie-v2-ap-mini-btn is-primary" data-eie-v2-attendance-save="${esc(sid)}" data-eie-v2-attendance-date-input="eie-v2-attendance-date">등원 저장</button>` : ''}
                    </div>
                </section>
            </div>
        `;
    }

    function renderStudentConsultationPanel(student, sid) {
        const rows = consultationRowsForStudent(sid).slice(0, 5);
        const selected = selectedPanelConsultation(rows);
        const selectedId = consultationRowId(selected);
        const loadingText = viewState.studentConsultationLoadedId === sid ? '' : '불러오는 중';
        const editing = viewState.studentConsultationFormOpen && normalizeKey(viewState.studentConsultationEditingId);
        const editingRow = editing ? (rows.find(row => consultationRowId(row) === editing) || null) : null;
        const editingType = consultationType(editingRow);
        const dateButtons = rows.map(row => {
            const id = consultationRowId(row);
            return `<button type="button" class="eie-v2-ap-consult-date${id === selectedId ? ' is-active' : ''}" data-eie-v2-consultation-select="${esc(id)}">${esc(consultationDateLabel(row))}</button>`;
        }).join('');
        const formHtml = viewState.studentConsultationFormOpen ? `
            <div class="eie-v2-ap-form-card">
                <div class="eie-v2-ap-section-head"><h3>${editingRow ? '상담 수정' : '새 상담 기록'}</h3></div>
                <div class="eie-v2-panel-consultation-form-grid">
                    <label class="eie-v2-student-quick-field"><span>상담일</span><input id="eie-v2-consultation-date" type="date" value="${esc(consultationDate(editingRow) || todayIso())}"></label>
                    <label class="eie-v2-student-quick-field"><span>유형</span><select id="eie-v2-consultation-type">${['학습', '생활', '진로', '학부모', '상담'].map(type => `<option value="${esc(type)}"${editingType === type ? ' selected' : ''}>${esc(type)}</option>`).join('')}</select></label>
                    <label class="eie-v2-student-quick-field is-wide"><span>상담 입력</span><textarea id="eie-v2-consultation-content" placeholder="상담 내용을 입력하세요.">${esc(normalizeKey(editingRow?.content))}</textarea></label>
                    <label class="eie-v2-student-quick-field is-wide"><span>후속조치</span><textarea id="eie-v2-consultation-next-action" placeholder="다음 조치가 있으면 입력하세요.">${esc(normalizeKey(editingRow?.next_action || editingRow?.nextAction))}</textarea></label>
                </div>
                <div class="eie-v2-panel-consultation-form-actions">
                    <button type="button" class="eie-v2-ap-mini-btn" data-eie-v2-consultation-cancel>취소</button>
                    <button type="button" class="eie-v2-ap-mini-btn is-primary" data-eie-v2-consultation-save="${esc(sid)}"${viewState.studentSaving ? ' disabled' : ''}>${editingRow ? '수정 저장' : '상담 저장'}</button>
                </div>
            </div>
        ` : '';
        return `
            <div class="eie-v2-ap-tab-body">
                <section class="eie-v2-ap-card eie-v2-ap-consult-pinned">
                    <div class="eie-v2-ap-section-head">
                        <h3>최근 상담</h3>
                        <button type="button" class="eie-v2-ap-mini-btn is-primary" data-eie-v2-consultation-new="${esc(sid)}">+ 상담</button>
                    </div>
                    ${loadingText ? `<div class="eie-v2-ap-loading">${esc(loadingText)}</div>` : ''}
                    ${dateButtons ? `<div class="eie-v2-ap-consult-date-row">${dateButtons}</div>` : ''}
                    ${renderPanelConsultationDetail(selected)}
                </section>
                ${formHtml}
                <section class="eie-v2-ap-card">
                    <div class="eie-v2-ap-section-head"><h3>상담 이력</h3><span>${esc(String(rows.length))}건</span></div>
                    <div class="eie-v2-ap-consult-list">
                        ${rows.length ? rows.map(renderPanelConsultationDetail).join('') : '<div class="eie-v2-panel-consultation-empty">상담 기록 없음</div>'}
                    </div>
                </section>
            </div>
        `;
    }

    function renderStudentGradesPanel(student, sid) {
        const session = selectedSessionRecord();
        const classId = Array.isArray(session?.source_cell_ids) && session.source_cell_ids.length ? session.source_cell_ids[0] : '';
        return `
            <div class="eie-v2-ap-tab-body">
                <section class="eie-v2-ap-card">
                    <div class="eie-v2-ap-section-head"><h3>성적</h3><button type="button" class="eie-v2-ap-mini-btn is-primary" data-eie-v2-open-student-grades="${esc(sid)}" data-eie-v2-grade-class-id="${esc(classId)}">성적표 열기</button></div>
                    <div class="eie-v2-ap-info-list">
                        ${renderApProfileInfoRow('최근 시험', '')}
                        ${renderApProfileInfoRow('최근 점수', '')}
                    </div>
                </section>
                <section class="eie-v2-ap-card">
                    <div class="eie-v2-ap-section-head"><h3>성적표 기록</h3></div>
                    <div class="eie-v2-panel-consultation-empty">저장된 성적 기록이 없습니다.</div>
                </section>
            </div>
        `;
    }

    function renderStudentPanelBody(student, sid) {
        const tab = ['basic', 'consultation', 'grades'].includes(viewState.studentDetailTab) ? viewState.studentDetailTab : 'basic';
        if (tab === 'consultation') return renderStudentConsultationPanel(student, sid);
        if (tab === 'grades') return renderStudentGradesPanel(student, sid);
        return renderStudentBasicPanel(student, sid);
    }

    function renderStudentPanel() {
        if (viewState.studentPanelMode === 'new') return renderNewStudentPanel();
        if (!viewState.selectedStudentId && !viewState.selectedStudentName) return '';
        const student = selectedStudentRecord() || {
            id: viewState.selectedStudentId,
            display_name: viewState.selectedStudentName,
            status: 'active'
        };
        if (viewState.studentPanelMode === 'edit') return renderStudentEditPanel(student);
        if (viewState.studentPanelMode === 'transfer') return renderStudentTransferPanel(student);
        const sid = studentRowId(student) || viewState.selectedStudentId;
        const subtitle = [studentSchool(student), studentGrade(student)].filter(Boolean).join(' · ') || '학적 정보 미등록';
        const session = selectedSessionRecord();
        const className = session ? normalizeKey(session.material) : '';
        const sessionDays = session ? miniActiveDays(session).join(', ') : '';
        const sessionTimeRaw = session ? displaySessionTimeRange(session) : '';
        const sessionTime = sessionTimeRaw && sessionTimeRaw !== '시간 미정' ? sessionTimeRaw : '';
        const periodTime = session ? [session.period_label, sessionTime].filter(Boolean).join(' · ') : '';
        const teacherNames = studentTeacherNames(student).join(', ');
        const pin = studentPin(student);
        return `
            <aside class="eie-v2-detail-panel eie-v2-student-panel eie-p-panel eie-v2-ap-profile-panel" aria-label="학생 상세">
                <div class="eie-v2-ap-profile-shell">
                    ${renderStudentPanelProfileHead(student, sid, subtitle)}
                    ${renderStudentPanelTabs(viewState.studentDetailTab)}
                    ${viewState.studentError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.studentError)}</div>` : ''}
                    ${viewState.studentNotice ? `<div class="eie-v2-alert is-success" role="status">${esc(viewState.studentNotice)}</div>` : ''}
                    ${sid ? '' : '<div class="eie-v2-ap-card"><span class="eie-v2-ap-info-value is-muted">확정된 학생 id가 없어 이 패널에서 바로 수정할 수 없습니다. 학생관리에서 이름으로 확인해 주세요.</span></div>'}
                    ${renderStudentPanelBody(student, sid)}
                </div>
            </aside>
        `;
    }

    function renderStudentEditPanel(student) {
        const saving = viewState.studentSaving;
        const sid = studentRowId(student) || viewState.selectedStudentId;
        const enrollDate = studentEnrollDate(student);
        return `
            <aside class="eie-v2-detail-panel eie-v2-student-panel eie-p-panel" aria-label="${esc(studentDisplayName(student))} 학생 수정">
                <div class="eie-p-head">
                    <div class="eie-p-head-top">
                        <div class="eie-p-head-identity">
                            <div class="eie-p-head-text">
                                <div class="eie-p-head-name">${esc(studentDisplayName(student))}</div>
                            </div>
                        </div>
                        <div class="eie-p-head-actions">
                            <button type="button" class="eie-p-btn-cancel" data-eie-v2-student-cancel ${saving ? 'disabled' : ''}>취소</button>
                            <button type="button" class="eie-p-btn-save" data-eie-v2-student-save ${saving ? 'disabled' : ''}>${saving ? '저장 중...' : '저장'}</button>
                        </div>
                    </div>
                    ${viewState.studentError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.studentError)}</div>` : ''}
                    ${viewState.studentNotice ? `<div class="eie-v2-alert is-success" role="status">${esc(viewState.studentNotice)}</div>` : ''}
                </div>
                <div class="eie-v2-student-form">
                    <span class="eie-p-section-label">필수 정보</span>
                    <div class="eie-p-card">
                        <label class="eie-p-form-field"><span>학생명</span><input id="eie-v2-edit-name" type="text" value="${esc(studentDisplayName(student))}" autocomplete="off"></label>
                        <div class="eie-p-form-row">
                            <label class="eie-p-form-field"><span>학생구분</span>${renderStudentTypeSelect('eie-v2-edit-student-type', studentType(student))}</label>
                            <label class="eie-p-form-field"><span>학년</span>${renderGradeSelect('eie-v2-edit-grade', studentGrade(student))}</label>
                        </div>
                        <div class="eie-p-form-row">
                            <label class="eie-p-form-field"><span>학교</span><input id="eie-v2-edit-school" type="text" value="${esc(studentSchool(student))}" autocomplete="off"></label>
                            <label class="eie-p-form-field"><span>차량</span><input id="eie-v2-edit-vehicle" type="text" value="${esc(studentVehicleInfo(student))}" autocomplete="off"></label>
                        </div>
                    </div>
                    <span class="eie-p-section-label">연락처</span>
                    <div class="eie-p-card">
                        <div class="eie-p-form-row">
                            <label class="eie-p-form-field"><span>학생 연락처</span><input id="eie-v2-edit-phone" type="tel" value="${esc(studentPhone(student))}" autocomplete="off"></label>
                            <label class="eie-p-form-field"><span>학부모 연락처</span><input id="eie-v2-edit-parent-phone" type="tel" value="${esc(studentParentPhone(student))}" autocomplete="off"></label>
                        </div>
                        <label class="eie-p-form-field"><span>주소</span><input id="eie-v2-edit-address" type="text" value="${esc(studentAddress(student))}" autocomplete="off"></label>
                        ${renderStudentTeacherPicker(student)}
                    </div>
                    <span class="eie-p-section-label">추가 정보</span>
                    <details class="eie-p-drawer">
                        <summary class="eie-p-drawer-trigger">보호자·메모<span class="eie-p-drawer-caret" aria-hidden="true">⌄</span></summary>
                        <div class="eie-p-drawer-body">
                            <label class="eie-p-form-field"><span>보호자 관계</span><input id="eie-v2-edit-guardian-relation" type="text" value="${esc(studentGuardianRelation(student))}" autocomplete="off"></label>
                            <label class="eie-p-form-field"><span>등원일</span><input id="eie-v2-edit-enroll-date" type="date" value="${esc(enrollDate)}" autocomplete="off"></label>
                            <label class="eie-p-form-field"><span>메모</span><textarea id="eie-v2-edit-memo">${esc(studentMemo(student))}</textarea></label>
                        </div>
                        <div class="eie-p-danger-zone">
                            <div class="eie-p-enroll-area">
                                ${enrollDate
                                    ? `<span class="eie-p-enroll-done">첫 등원 ${esc(enrollDate)}</span>`
                                    : `<span class="eie-p-enroll-chip">첫 등원일 미등록</span>
                                <input type="date" id="eie-v2-edit-first-attendance-date" value="${esc(todayIso())}">
                                ${sid ? `<button type="button" class="eie-p-btn-cancel eie-p-enroll-save" data-eie-v2-attendance-save="${esc(sid)}" data-eie-v2-attendance-date-input="eie-v2-edit-first-attendance-date">저장</button>` : ''}`}
                            </div>
                            ${sid ? `
                            <div class="eie-p-danger-actions">
                                <button type="button" class="eie-p-btn-warn" data-eie-v2-student-transfer>전반</button>
                                <button type="button" class="eie-p-btn-danger" data-eie-v2-retire-student="${esc(sid)}">퇴원</button>
                            </div>` : ''}
                        </div>
                    </details>
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
        values.push(...DEFAULT_EIE_DAY_TEACHERS);
        teacherRoster().forEach(name => values.push(name));
        (session?.source_rows || []).forEach(row => getTeacherNames(row).forEach(name => values.push(name)));
        Object.values(session?.day_teachers || {}).forEach(list => (list || []).forEach(name => values.push(name)));
        (session?.periods || []).forEach(period => {
            Object.values(period?.day_teachers || {}).forEach(list => (list || []).forEach(name => values.push(name)));
        });
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

    function miniPeriodRowKey(sourceCellId, periodKey, periodIndex) {
        const parts = [
            normalizeKey(sourceCellId),
            normalizeKey(periodKey),
            normalizeKey(periodIndex)
        ];
        return parts.some(Boolean) ? parts.join('::') : '';
    }

    function periodTeacherKeyForInput(input) {
        const periodKey = normalizeKey(input?.getAttribute?.('data-eie-v2-period-key') || '');
        if (periodKey) return `periodKey:${periodKey}`;
        const periodIndex = normalizeKey(input?.getAttribute?.('data-eie-v2-period-index') || '');
        if (periodIndex !== '') return `periodIndex:${periodIndex}`;
        return '';
    }

    function isMiniMultiPeriodEditor() {
        if (!document.querySelectorAll) return false;
        const indexes = new Set(Array.from(document.querySelectorAll('[data-eie-v2-day-teacher]'))
            .map(input => normalizeKey(input.getAttribute('data-eie-v2-period-index') || ''))
            .filter(value => value !== ''));
        return indexes.size > 1;
    }

    function miniDayTeacherInput(day, sourceCellId, periodKey, periodIndex, options = {}) {
        if (!document.querySelectorAll) return null;
        const inputs = Array.from(document.querySelectorAll('[data-eie-v2-day-teacher]'));
        const byDay = inputs.filter(input => input.getAttribute('data-eie-v2-day-teacher') === day);
        const sourceKey = normalizeKey(sourceCellId);
        const periodKeyValue = normalizeKey(periodKey);
        const periodIndexValue = normalizeKey(periodIndex);
        const isMultiPeriod = Boolean(options?.isMultiPeriod);

        if (isMultiPeriod) {
            if (sourceKey && periodKeyValue && periodIndexValue) {
                const composite = byDay.find(input => (
                    normalizeKey(input.getAttribute('data-eie-v2-period-source-cell') || '') === sourceKey &&
                    normalizeKey(input.getAttribute('data-eie-v2-period-key') || '') === periodKeyValue &&
                    normalizeKey(input.getAttribute('data-eie-v2-period-index') || '') === periodIndexValue
                ));
                if (composite) return composite;
            }
            if (periodKeyValue) {
                const byPeriodKey = byDay.find(input => normalizeKey(input.getAttribute('data-eie-v2-period-key') || '') === periodKeyValue);
                if (byPeriodKey) return byPeriodKey;
            }
            if (periodIndexValue !== '') {
                const byIndex = byDay.find(input => normalizeKey(input.getAttribute('data-eie-v2-period-index') || '') === periodIndexValue);
                if (byIndex) return byIndex;
            }
            return null;
        }

        if (sourceKey) {
            const exact = byDay.find(input => normalizeKey(input.getAttribute('data-eie-v2-period-source-cell') || '') === sourceKey);
            if (exact) return exact;
        }
        if (periodKeyValue) {
            const byPeriodKey = byDay.find(input => normalizeKey(input.getAttribute('data-eie-v2-period-key') || '') === periodKeyValue);
            if (byPeriodKey) return byPeriodKey;
        }
        if (periodIndexValue !== '') {
            const byIndex = byDay.find(input => normalizeKey(input.getAttribute('data-eie-v2-period-index') || '') === periodIndexValue);
            if (byIndex) return byIndex;
        }
        return byDay[0] || null;
    }

    function miniTeacherPeriodRows(session) {
        const periods = sortPeriods(session?.periods?.length ? session.periods : [periodRecordFromCell(session)]);
        return periods.map((period, index) => ({
            ...period,
            index,
            source_cell_id: normalizeKey(period?.source_cell_id || session?.source_cell_ids?.[index] || session?.source_rows?.[index]?.id || session?.source_rows?.[index]?.cell_id || ''),
            period_key: period?.period_key || period?.key || ''
        }));
    }

    function renderMiniDayTeacherEditor(session) {
        const teachers = teacherOptionsFor(session);
        const rows = miniTeacherPeriodRows(session);
        const teacherButtons = teachers.length ? `
            <div class="eie-v2-mini-teacher-picker">
                <span class="eie-p-section-label">선생님 목록</span>
                <div class="eie-v2-mini-teacher-list" aria-label="선생님 목록">
                    ${teachers.map(name => `<button type="button" class="eie-small-button" data-eie-v2-pick-teacher="${esc(name)}">${esc(name)}</button>`).join('')}
                </div>
            </div>
        ` : '';
        const dayHead = DAY_ORDER.slice(0, 5).map(day => `<span class="eie-v2-mini-day-grid-day">${esc(day)}</span>`).join('');
        return `
            <div class="eie-v2-mini-day-grid" role="table">
                <div class="eie-v2-mini-day-grid-head" role="row">
                    <span class="eie-v2-mini-day-grid-corner" aria-hidden="true"></span>
                    ${dayHead}
                </div>
                ${rows.map(row => {
                    const periodLabel = row.period_label || session.period_label || '';
                    return `<div class="eie-v2-mini-day-grid-row" role="row">
                        <span class="eie-v2-mini-day-grid-period">${esc(periodLabel)}</span>
                        ${DAY_ORDER.slice(0, 5).map(day => {
                            const value = (row?.day_teachers?.[day] || []).join(', ');
                            return `<input type="text" class="eie-v2-mini-day-grid-input"
                                data-eie-v2-day-teacher="${esc(day)}"
                                data-eie-v2-period-index="${esc(String(row.index))}"
                                data-eie-v2-period-key="${esc(row.period_key)}"
                                data-eie-v2-period-source-cell="${esc(row.source_cell_id)}"
                                value="${esc(value)}"
                                placeholder="-"
                                aria-label="${esc(`${periodLabel} ${day}`)}"
                                autocomplete="off">`;
                        }).join('')}
                    </div>`;
                }).join('')}
            </div>
            ${teacherButtons}
        `;
    }

    function miniActiveDays(session) {
        const rows = miniTeacherPeriodRows(session);
        return DAY_ORDER.slice(0, 5).filter(day => rows.some(row => (row?.day_teachers?.[day] || []).length));
    }

    function renderMiniStudentManager(session) {
        const students = Array.isArray(session?.students) ? session.students : [];
        const firstCellId = normalizeKey(session?.source_cell_ids?.[0] || session?.source_rows?.[0]?.id || '');
        return `
            <div class="eie-v2-class-student-grid">
                ${students.length ? students.map(student => {
                    const sid = studentDetailId(student);
                    const name = studentSearchName(student) || student.name || '학생';
                    return `<button type="button" class="eie-v2-class-student-cell"
                        ${sid ? `data-eie-v2-student-id="${esc(sid)}"` : ''}
                        ${!sid ? `data-eie-v2-student-name="${esc(name)}"` : ''}
                        data-eie-v2-return-session="${esc(session.session_id)}"
                        ${firstCellId ? `data-eie-v2-return-cell="${esc(firstCellId)}"` : ''}
                        >${esc(name)}</button>`;
                }).join('') : '<span class="eie-v2-ap-info-value is-muted">배정된 학생이 없습니다.</span>'}
                <button type="button" class="eie-v2-class-student-cell is-add" data-eie-v2-add-student-toggle data-session-id="${esc(session.session_id)}">+ 추가</button>
            </div>
        `;
    }

    function renderMiniStudentChips(session) {
        const students = Array.isArray(session?.students) ? session.students : [];
        const firstCellId = normalizeKey(session?.source_cell_ids?.[0] || session?.source_rows?.[0]?.id || '');
        if (!students.length) return '<span class="eie-v2-ap-info-value is-muted">배정된 학생이 없습니다.</span>';
        return `
            <div class="eie-v2-class-student-grid">
                ${students.map(student => {
                    const sid = studentDetailId(student);
                    const name = studentSearchName(student) || student.name || '학생';
                    return `<button type="button" class="eie-v2-class-student-cell"
                        ${sid ? `data-eie-v2-student-id="${esc(sid)}"` : ''}
                        ${!sid ? `data-eie-v2-student-name="${esc(name)}"` : ''}
                        data-eie-v2-return-session="${esc(session.session_id)}"
                        ${firstCellId ? `data-eie-v2-return-cell="${esc(firstCellId)}"` : ''}
                        >${esc(name)}</button>`;
                }).join('')}
            </div>
        `;
    }

    function renderClassAttendanceGrid(session) {
        const students = Array.isArray(session?.students) ? session.students : [];
        const date = todayIso();
        if (!students.length) return '<span class="eie-v2-ap-info-value is-muted">배정된 학생이 없습니다.</span>';
        return `
            <div class="eie-v2-class-student-grid">
                ${students.map(student => {
                    const sid = studentDetailId(student);
                    const name = studentSearchName(student) || student.name || '학생';
                    const record = classAttendanceRecord(sid, date);
                    const status = classAttendanceStatusLabel(record?.status);
                    const statusClass = classAttendanceStatusClass(record?.status);
                    return `<button type="button" class="eie-v2-class-student-cell is-attendance ${esc(statusClass)}"
                        data-eie-v2-class-attendance="${esc(sid)}"
                        data-session-id="${esc(session.session_id)}"
                        data-cell-id="${esc(session.source_cell_ids?.[0] || '')}"
                        data-date="${esc(date)}">
                            <span>${esc(name)}</span>
                            <span>${esc(status)}</span>
                        </button>`;
                }).join('')}
            </div>
        `;
    }

    function classAttendanceRecord(studentId, date) {
        const sid = normalizeKey(studentId);
        const day = normalizeKey(date).slice(0, 10);
        const rows = Array.isArray(window.EieState?.get?.()?.db?.attendance)
            ? window.EieState.get().db.attendance
            : [];
        return rows.find(row => (
            normalizeKey(row?.student_id) === sid &&
            normalizeKey(row?.date || row?.attendance_date).slice(0, 10) === day
        )) || null;
    }

    function classAttendanceStatusLabel(status) {
        const raw = normalizeKey(status);
        const lower = raw.toLowerCase();
        if (raw === '결석' || lower === 'absent') return '결석';
        return '출석';
    }

    function classAttendanceStatusClass(status) {
        const label = classAttendanceStatusLabel(status);
        if (label === '결석') return 'is-absent';
        return 'is-present';
    }

    function renderMiniClassAttendance(session) {
        if (viewState.classAttendanceSessionId !== session?.session_id) return '';
        const students = Array.isArray(session?.students) ? session.students : [];
        const date = todayIso();
        return `
            <section class="eie-v2-mini-section">
                <div class="eie-v2-mini-section-title">
                    <span class="eie-p-section-label">출결</span>
                </div>
                <div class="eie-p-card eie-v2-mini-card-compact">
                    <div class="eie-p-chip-row">
                        ${students.length ? students.map(student => {
                            const sid = studentDetailId(student);
                            const name = studentSearchName(student) || student.name || '학생';
                            const record = classAttendanceRecord(sid, date);
                            const status = classAttendanceStatusLabel(record?.status);
                            const statusClass = classAttendanceStatusClass(record?.status);
                            return `<button type="button" class="eie-p-chip eie-p-attendance-chip ${esc(statusClass)}"
                                data-eie-v2-class-attendance="${esc(sid)}"
                                data-session-id="${esc(session.session_id)}"
                                data-cell-id="${esc(session.source_cell_ids?.[0] || '')}"
                                data-date="${esc(date)}">${esc(name)} · ${esc(status)}</button>`;
                        }).join('') : '<span class="eie-p-field-value is-empty">배정된 학생이 없습니다.</span>'}
                    </div>
                </div>
            </section>
        `;
    }

    function renderMiniNewStudentForm(session) {
        return `<button type="button" class="eie-secondary-button eie-v2-mini-add-student-button" data-eie-v2-add-student-toggle data-session-id="${esc(session.session_id)}">+ 학생 추가</button>`;
    }

    function classMetaLine(session) {
        const rawTime = displaySessionTimeRange(session);
        const time = rawTime === '시간 미정' ? '' : rawTime;
        const days = miniActiveDays(session);
        const parts = [
            session?.period_label || '',
            time,
            days.length ? days.join('·') : ''
        ].filter(Boolean);
        return parts.join(' · ') || '시간 미정';
    }

    function renderClassDayTeacherInfoRow(session) {
        const rows = miniTeacherPeriodRows(session);
        const dayHead = DAY_ORDER.slice(0, 5).map(day => `<span class="eie-v2-class-day-grid-day">${esc(day)}</span>`).join('');
        const bodyRows = rows.map(row => {
            const periodLabel = row.period_label || session.period_label || '';
            const cells = DAY_ORDER.slice(0, 5).map(day => {
                const names = (row?.day_teachers?.[day] || []).join(', ');
                return `<span class="eie-v2-class-day-grid-cell${names ? '' : ' is-empty'}" title="${esc(names)}">${esc(names || '-')}</span>`;
            }).join('');
            return `<div class="eie-v2-class-day-grid-row" role="row"><span class="eie-v2-class-day-grid-period">${esc(periodLabel)}</span>${cells}</div>`;
        }).join('');
        return `
            <div class="eie-v2-class-day-grid-block">
                <span class="eie-v2-class-day-grid-label">교시별 담당</span>
                <div class="eie-v2-class-day-grid" role="table">
                    <div class="eie-v2-class-day-grid-head" role="row"><span class="eie-v2-class-day-grid-corner" aria-hidden="true"></span>${dayHead}</div>
                    ${bodyRows}
                </div>
            </div>
        `;
    }

    function renderMiniClassroomDetailPanel(session) {
        const status = normalizeStatus(session?.status || 'active');
        const statusClass = status === 'active' || status === 'imported' ? 'is-active' : (status === 'hidden' || status === 'archived' ? 'is-archived' : '');
        const homeroom = normalizeKey(session?.homeroom_teacher || session?.teacher_name || '');
        const attendanceOpen = viewState.classAttendanceSessionId === session.session_id;
        return `
            <aside class="eie-v2-detail-panel eie-v2-class-profile-panel eie-p-panel eie-v2-ap-profile-panel" aria-label="${esc(session.material)} 수업 상세">
                <div class="eie-v2-ap-profile-shell">
                    <header class="eie-v2-ap-profile-head">
                        <div class="eie-v2-ap-head-main">
                            <div class="eie-v2-ap-head-title">
                                <h1>${esc(session.material || '반명 미등록')}</h1>
                                <span class="eie-v2-ap-status-dot ${esc(statusClass)}"></span>
                                <span class="eie-v2-ap-status-text ${esc(statusClass)}">${esc(STATUS_LABELS[status] || status || '상태 미정')}</span>
                            </div>
                            <div class="eie-v2-ap-meta-line">${esc(classMetaLine(session))}</div>
                        </div>
                        <div class="eie-v2-ap-head-actions">
                            <button type="button" class="eie-v2-ap-head-btn" data-eie-v2-class-back>닫기</button>
                            <button type="button" class="eie-v2-ap-head-btn is-primary" data-eie-v2-class-edit="${esc(session.session_id)}">수정</button>
                        </div>
                    </header>
                    ${viewState.miniError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.miniError)}</div>` : ''}
                    ${viewState.miniNotice ? `<div class="eie-v2-alert is-success" role="status">${esc(viewState.miniNotice)}</div>` : ''}
                    <div class="eie-v2-ap-tab-body">
                        <section class="eie-v2-ap-card">
                            <div class="eie-v2-ap-section-head"><h3>수업 정보</h3></div>
                            <div class="eie-v2-ap-info-list">
                                ${renderApProfileInfoRow('담임', homeroom, { empty: '미등록' })}
                            </div>
                            ${renderClassDayTeacherInfoRow(session)}
                        </section>
                        <section class="eie-v2-ap-card">
                            <div class="eie-v2-ap-section-head">
                                <h3>학생 명단</h3>
                                <div class="eie-v2-ap-seg" role="group" aria-label="명단/출결 보기">
                                    <button type="button" class="eie-v2-ap-seg-btn${attendanceOpen ? '' : ' is-active'}" data-eie-v2-class-attendance-toggle="${esc(session.session_id)}" data-eie-v2-class-attendance-mode="roster">명단</button>
                                    <button type="button" class="eie-v2-ap-seg-btn${attendanceOpen ? ' is-active' : ''}" data-eie-v2-class-attendance-toggle="${esc(session.session_id)}" data-eie-v2-class-attendance-mode="attendance">출결</button>
                                </div>
                            </div>
                            ${attendanceOpen ? renderClassAttendanceGrid(session) : renderMiniStudentChips(session)}
                        </section>
                        <section class="eie-v2-ap-card">
                            <div class="eie-v2-ap-section-head"><h3>메모</h3></div>
                            <div class="eie-v2-class-memo-read${normalizeKey(session?.memo) ? '' : ' is-empty'}">${esc(normalizeKey(session?.memo))}</div>
                        </section>
                    </div>
                </div>
            </aside>
        `;
    }

    function miniTimeDisplayValue(session, first, kind) {
        const periods = sortPeriods(session?.periods || []);
        const source = kind === 'end'
            ? (periods[periods.length - 1] || first || session || {})
            : (periods[0] || first || session || {});
        const order = periodOrderOf(source || session);
        const raw = kind === 'end'
            ? (session?.end_time || source?.end_time || first?.end_time || '')
            : (session?.start_time || source?.start_time || first?.start_time || '');
        return displayEieClock(canonicalEieTime(raw, order, kind));
    }

    function miniTimePayloadValue(fieldId, fallback, periodOrder, kind) {
        const value = miniFieldValue(fieldId);
        return canonicalEieTime(value || fallback || '', periodOrder, kind);
    }

    function renderMiniClassroomPanel(session) {
        if (!session) return '';
        const first = session.source_rows?.[0] || {};
        const isMultiPeriod = (session?.periods || []).length > 1;
        const startInputValue = miniTimeDisplayValue(session, first, 'start');
        const endInputValue = miniTimeDisplayValue(session, first, 'end');
        return `
            <div class="eie-v2-ap-profile-shell" data-eie-v2-mini-session="${esc(session.session_id)}">
                <header class="eie-v2-ap-profile-head">
                    <label class="eie-v2-ap-head-main eie-v2-ap-edit-title" for="eie-v2-mini-material">
                        <span class="eie-v2-ap-edit-title-label">반명</span>
                        <input id="eie-v2-mini-material" class="eie-v2-ap-edit-title-input" type="text" value="${esc(session.material || '')}" placeholder="반명" autocomplete="off">
                        <span class="eie-v2-ap-meta-line">${esc(classMetaLine(session))}</span>
                    </label>
                    <div class="eie-v2-ap-head-actions">
                        <button type="button" class="eie-v2-ap-head-btn" data-eie-v2-cancel-mini ${viewState.miniSaving ? 'disabled' : ''}>취소</button>
                        <button type="button" class="eie-v2-ap-head-btn is-primary" data-eie-v2-save-mini ${viewState.miniSaving ? 'disabled' : ''}>${viewState.miniSaving ? '저장 중...' : '저장'}</button>
                    </div>
                </header>
                ${viewState.miniError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.miniError)}</div>` : ''}
                ${viewState.miniNotice ? `<div class="eie-v2-alert is-success" role="status">${esc(viewState.miniNotice)}</div>` : ''}
                <div class="eie-v2-ap-tab-body">
                    <section class="eie-v2-ap-card">
                        <div class="eie-v2-ap-section-head"><h3>교시별 담당</h3></div>
                        ${renderMiniDayTeacherEditor(session)}
                    </section>
                    <section class="eie-v2-ap-card">
                        <div class="eie-v2-ap-section-head"><h3>학생 명단</h3></div>
                        ${renderMiniStudentManager(session)}
                    </section>
                    <section class="eie-v2-ap-card">
                        <div class="eie-v2-ap-section-head"><h3>메모·기본 정보</h3></div>
                        <div class="eie-v2-mini-base-body">
                            <label class="eie-p-form-field"><span>메모</span><textarea id="eie-v2-mini-memo" class="eie-v2-mini-memo-area">${esc(session.memo || '')}</textarea></label>
                            <div class="eie-v2-mini-time-grid">
                                <label class="eie-p-form-field"><span>교시</span><input id="eie-v2-mini-period" class="eie-tabular" type="text" value="${esc(session.period_label || first.period_label || '')}" autocomplete="off" ${isMultiPeriod ? 'readonly' : ''}></label>
                                <label class="eie-p-form-field"><span>시작</span><input id="eie-v2-mini-start" class="eie-tabular" type="text" value="${esc(startInputValue)}" inputmode="numeric" autocomplete="off" ${isMultiPeriod ? 'readonly' : ''}></label>
                                <label class="eie-p-form-field"><span>종료</span><input id="eie-v2-mini-end" class="eie-tabular" type="text" value="${esc(endInputValue)}" inputmode="numeric" autocomplete="off" ${isMultiPeriod ? 'readonly' : ''}></label>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    function renderSelectedPanel(session) {
        const studentPanel = renderStudentPanel();
        if (studentPanel) return studentPanel;
        if (!session) return '';
        if (viewState.classPanelMode !== 'edit') return renderMiniClassroomDetailPanel(session);
        return `
            <aside class="eie-v2-detail-panel eie-v2-mini-classroom eie-p-panel eie-v2-ap-profile-panel" aria-label="${esc(session.material)} 수업 상세">
                ${renderMiniClassroomPanel(session)}
            </aside>
        `;
    }

    async function loadRows() {
        const stateRows = Array.isArray(window.EieState?.get?.()?.timetableCells)
            ? window.EieState.get().timetableCells
            : [];
        const useCacheOnce = viewState.useRowsCacheOnce;
        viewState.useRowsCacheOnce = false;
        if (!window.EieApi?.getTimetable) return { rows: stateRows, error: '' };
        // 패널 상태 전환 등 데이터가 바뀌지 않는 재렌더는 캐시로 즉시 응답해 깜빡임을 막는다.
        // (저장 경로는 refreshTimetableRowsAfterMiniSave로 상태를 먼저 갱신하므로 최신값이 유지된다.)
        if (useCacheOnce && stateRows.length) return { rows: stateRows, error: '' };
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

    // ── Current timetable validation helpers ───────────────────────

    function validationIssue(label, detail) {
        return { label, detail: normalizeKey(detail || '') };
    }

    function buildTimetableValidationPreview(sessions) {
        return (sessions || []).map((session, idx) => {
            const issues = [];
            const sourceRows = Array.isArray(session?.source_rows) ? session.source_rows : [];
            const cellIds = Array.isArray(session?.source_cell_ids) ? session.source_cell_ids : [];
            const material = normalizeKey(session?.material || session?.class_name || '');
            const homeroom = normalizeKey(sessionHomeroomName(session) || '');
            const periodLabel = normalizeKey(session?.period_label || '');
            const timeRange = displaySessionTimeRange(session);
            const dayTeachers = session?.day_teachers || {};
            const filledDays = DAY_ORDER.slice(0, 5).filter(day => uniqueNames(dayTeachers[day] || []).length);

            if (!sourceRows.length && !cellIds.length) issues.push(validationIssue('원본 셀 없음', '저장된 timetable_cells 연결을 확인하세요.'));
            if (!material) issues.push(validationIssue('교재/반명 없음', '현재 셀의 material_text 또는 class_name_raw가 비어 있습니다.'));
            if (!homeroom) issues.push(validationIssue('담임 없음', 'teacher_name_raw 또는 homeroom_teacher가 비어 있습니다.'));
            if (!periodLabel && !timeRange) issues.push(validationIssue('교시/시간 없음', 'period_order, start_time, end_time을 확인하세요.'));
            if (!filledDays.length) issues.push(validationIssue('요일별 강사 없음', 'day_teachers 또는 teacher_names_by_day가 비어 있습니다.'));
            if (!Array.isArray(session?.students) || !session.students.length) issues.push(validationIssue('학생 없음', 'assigned_students 연결을 확인하세요.'));

            return {
                idx,
                session,
                source_cell_ids: cellIds,
                material,
                homeroom,
                period_label: periodLabel,
                time_range: timeRange,
                filled_days: filledDays,
                student_count: Array.isArray(session?.students) ? session.students.length : 0,
                issues,
                status: issues.length ? 'needs_review' : 'ok'
            };
        });
    }

    function renderValidationRow(item) {
        const session = item.session || {};
        const cellIds = Array.isArray(item.source_cell_ids) ? item.source_cell_ids : [];
        const cellIdDisplay = cellIds.length ? cellIds[0].slice(0, 8) + (cellIds.length > 1 ? `...+${cellIds.length - 1}` : '') : '-';
        const daySummary = DAY_ORDER.slice(0, 5).map(day => {
            const teachers = uniqueNames(session?.day_teachers?.[day] || []);
            return `${day}:${teachers.length ? teachers.join('/') : '-'}`;
        }).join(' ');
        const issueSummary = item.issues.length
            ? item.issues.map(issue => issue.label).join(', ')
            : '정상';
        return `<tr class="eie-v2-repair-row ${item.status === 'needs_review' ? 'is-changed is-warn' : ''}" data-validation-idx="${item.idx}">
            <td class="eie-v2-repair-num">${item.idx + 1}</td>
            <td class="eie-v2-repair-cellid" title="${esc(cellIds.join(', '))}">${esc(cellIdDisplay)}</td>
            <td class="eie-v2-repair-cur-time">${esc([item.period_label, item.time_range].filter(Boolean).join(' ') || '-')}</td>
            <td class="eie-v2-repair-cur-mat" title="${esc(item.material || '-')}">${esc(item.material || '-')}</td>
            <td class="eie-v2-repair-cur-teacher">${esc(item.homeroom || '-')}</td>
            <td title="${esc(daySummary)}">${esc(daySummary)}</td>
            <td>${esc(String(item.student_count || 0))}</td>
            <td>
                <em class="eie-v2-repair-badge is-${item.status === 'ok' ? 'same' : 'needs_change'}">${item.status === 'ok' ? '정상' : '확인 필요'}</em>
                <span class="eie-v2-repair-diff-hint" title="${esc(item.issues.map(issue => issue.detail).filter(Boolean).join(' / '))}">· ${esc(issueSummary)}</span>
            </td>
        </tr>`;
    }

    function renderTimetableValidationPanel(preview) {
        if (!preview) return '<div class="eie-v2-repair-loading">현재 시간표 검증 중...</div>';
        const okCount = preview.filter(item => item.status === 'ok').length;
        const reviewCount = preview.length - okCount;
        return `
            <div class="eie-v2-repair-panel">
                <div class="eie-v2-repair-head">
                    <h2>현재 시간표 검증</h2>
                    <p>현재 저장된 timetable_cells 기준 · 정상 <strong>${okCount}</strong>건 · 확인 필요 <strong>${reviewCount}</strong>건</p>
                    <p class="eie-v2-repair-legend">26.04 seed나 별도 truth 표와 비교하지 않고, 화면에 저장된 교시/반/요일별 강사/학생 연결만 점검합니다.</p>
                    ${viewState.repairError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.repairError)}</div>` : ''}
                    ${viewState.repairNotice ? `<div class="eie-v2-info" role="status">${esc(viewState.repairNotice)}</div>` : ''}
                </div>
                <div class="eie-v2-repair-actions">
                    <button type="button" class="eie-secondary-button" data-eie-repair-close>닫기</button>
                </div>
                <div class="eie-v2-repair-scroll">
                    <table class="eie-v2-repair-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>cell_id</th>
                                <th>현재 시간</th>
                                <th>현재 교재/반</th>
                                <th>현재 담임</th>
                                <th>요일별 강사</th>
                                <th>학생</th>
                                <th>상태</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${preview.map(renderValidationRow).join('')}
                        </tbody>
                    </table>
                </div>
            </div>`;
    }

    // ── Current timetable validation helpers end ────────────────────

    function renderHeader(error) {
        return `
            <div class="eie-v2-page-head eie-v2-card-head">
                <div class="eie-v2-head-left">
                    ${viewState.repairMode
                        ? `<button type="button" class="eie-secondary-button" data-eie-repair-close>← 돌아가기</button>`
                        : `<label class="eie-v2-search" aria-label="학생 또는 교재 검색">
                               <input type="search" data-eie-v2-search placeholder="학생 또는 교재 검색" value="${esc(viewState.searchQuery || '')}" autocomplete="off">
                           </label>`
                    }
                </div>
                <div class="eie-v2-head-center">
                    <h1 id="eie-v2-title">${viewState.repairMode ? '시간표 검증' : 'EiE 시간표'}</h1>
                </div>
                <div class="eie-v2-head-right">
                    ${viewState.repairMode ? '' : viewState.editMode
                        ? `<button type="button" class="eie-primary-button" data-eie-edit-save ${viewState.editSaving ? 'disabled' : ''}>${viewState.editSaving ? '저장 중...' : '저장'}</button>
                           <button type="button" class="eie-secondary-button" data-eie-edit-cancel>취소</button>`
                        : `${renderWeekdayOverlayTabs(viewState.activeDayOverlay)}
                           <button type="button" class="eie-secondary-button eie-v2-print-button" data-eie-print-timetable title="시간표 인쇄">인쇄</button>
                           <button type="button" class="eie-secondary-button" data-eie-edit-toggle>시간표 편집</button>
                           <button type="button" class="eie-secondary-button${viewState.zoomBoosted ? ' is-active' : ''}" data-eie-zoom-boost>${viewState.zoomBoosted ? '작게 보기' : '크게 보기'}</button>`
                    }
                </div>
                ${viewState.editMode ? `<div class="eie-v2-edit-mode-bar">편집 모드 — 드래그로 위치를 바꾸고, 복사한 반은 원하는 빈 슬롯에 붙여넣으세요.${viewState.editCreates.length ? ` · 새 수업 ${viewState.editCreates.length}개` : ''}</div>` : ''}
                ${viewState.editNotice ? `<div class="eie-v2-info" role="status">${esc(viewState.editNotice)}</div>` : ''}
                ${viewState.editError ? `<div class="eie-v2-alert" role="alert">${esc(viewState.editError)}</div>` : ''}
            </div>
            ${error ? `<div class="eie-v2-alert" role="alert">${esc(error)}</div>` : ''}
        `;
    }

    function applyZoomBoost() {
        document.body.style.zoom = viewState.zoomBoosted ? '1.5' : '';
    }

    function bindEvents() {
        if (eventsBound) return;

        window.addEventListener('beforeunload', event => {
            if (!hasUnsavedEditChanges()) return;
            event.preventDefault();
            event.returnValue = '';
        });

        // ── 드래그&드롭 편집 이벤트 ─────────────────────────────────
        document.addEventListener('dragstart', event => {
            const card = event.target.closest?.('[data-eie-drag-session]');
            if (!card || !viewState.editMode) return;
            draggingSessionId = card.getAttribute('data-eie-drag-session') || '';
            card.classList.add('is-dragging');
            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', draggingSessionId);
            }
        });

        document.addEventListener('dragend', event => {
            const card = event.target.closest?.('[data-eie-drag-session]');
            if (card) card.classList.remove('is-dragging');
            document.querySelectorAll('.is-drop-over').forEach(el => el.classList.remove('is-drop-over'));
            draggingSessionId = '';
        });

        document.addEventListener('dragover', event => {
            const slot = event.target.closest?.('[data-eie-drop-slot]');
            if (!slot || !viewState.editMode || !draggingSessionId) return;
            event.preventDefault();
            if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
            slot.classList.add('is-drop-over');
        });

        document.addEventListener('dragleave', event => {
            const slot = event.target.closest?.('[data-eie-drop-slot]');
            if (!slot) return;
            if (!slot.contains(event.relatedTarget)) slot.classList.remove('is-drop-over');
        });

        document.addEventListener('drop', event => {
            const slot = event.target.closest?.('[data-eie-drop-slot]');
            if (!slot || !viewState.editMode || !draggingSessionId) return;
            event.preventDefault();
            slot.classList.remove('is-drop-over');
            const sid = draggingSessionId;
            const session = lastRenderedSessions.find(s => s.session_id === sid);
            if (!session) return;
            const newHomeroomKey = slot.getAttribute('data-drop-teacher-key') || '';
            const newHomeroomName = slot.getAttribute('data-drop-teacher-name') || '';
            const newPeriodKey = slot.getAttribute('data-drop-period-key') || '';
            const newPeriodLabel = slot.getAttribute('data-drop-period-label') || '';
            const newPeriodOrder = slot.getAttribute('data-drop-period-order') || '';
            const newStartTime = slot.getAttribute('data-drop-start') || '';
            const newEndTime = slot.getAttribute('data-drop-end') || '';
            const curHomeroomKey = effectiveHomeroomKey(session);
            const curDraft = viewState.editDraft[sid] || {};
            const curPeriodKey = curDraft.periodKey || session.period_key || '';
            const homeroomChanged = newHomeroomKey !== curHomeroomKey;
            const periodChanged = newPeriodKey !== curPeriodKey;
            if (!homeroomChanged && !periodChanged) return;
            const draft = {};
            if (homeroomChanged) { draft.homeroomKey = newHomeroomKey; draft.homeroomName = newHomeroomName; }
            else if (curDraft.homeroomKey) { draft.homeroomKey = curDraft.homeroomKey; draft.homeroomName = curDraft.homeroomName; }
            if (periodChanged) { draft.periodKey = newPeriodKey; draft.periodLabel = newPeriodLabel; draft.periodOrder = Number(newPeriodOrder); draft.startTime = newStartTime; draft.endTime = newEndTime; }
            else if (curDraft.periodKey) { draft.periodKey = curDraft.periodKey; draft.periodLabel = curDraft.periodLabel; draft.periodOrder = curDraft.periodOrder; draft.startTime = curDraft.startTime; draft.endTime = curDraft.endTime; }
            viewState.editDraft[sid] = draft;
            reopenPanelMountRoute();
        });

        document.addEventListener('click', event => {
            const dayOverlayButton = event.target.closest?.('[data-eie-v2-day-overlay]');
            if (dayOverlayButton) {
                event.preventDefault();
                viewState.activeDayOverlay = dayOverlayButton.getAttribute('data-eie-v2-day-overlay') || null;
                reopenPanelMountRoute();
                return;
            }
            const dayOverlayClose = event.target.closest?.('[data-eie-v2-day-overlay-close]');
            if (dayOverlayClose) {
                event.preventDefault();
                viewState.activeDayOverlay = null;
                reopenPanelMountRoute();
                return;
            }
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
                reopenPanelMountRoute();
                return;
            }
            const copySessionButton = event.target.closest?.('[data-eie-copy-session]');
            if (copySessionButton) {
                event.preventDefault();
                event.stopPropagation();
                copySessionForPaste(copySessionButton.getAttribute('data-eie-copy-session') || '');
                return;
            }
            const deleteSessionButton = event.target.closest?.('[data-eie-delete-session]');
            if (deleteSessionButton) {
                event.preventDefault();
                event.stopPropagation();
                deleteClassSession(deleteSessionButton.getAttribute('data-eie-delete-session') || '');
                return;
            }
            const pasteSessionButton = event.target.closest?.('[data-eie-paste-session]');
            if (pasteSessionButton) {
                event.preventDefault();
                event.stopPropagation();
                pasteCopiedSessionToSlot(pasteSessionButton);
                return;
            }
            const sessionButton = event.target.closest?.('[data-eie-v2-session]');
            if (sessionButton) {
                event.preventDefault();
                if (viewState.miniSaving) return;
                const nextSessionId = sessionButton.getAttribute('data-eie-v2-session') || '';
                const nextSession = lastRenderedSessions.find(s => s.session_id === nextSessionId);
                if (nextSession?.is_temp_copy) {
                    viewState.selectedSessionId = '';
                    viewState.editNotice = '저장 전 임시 수업은 상세 수정할 수 없습니다. 저장 후 다시 선택해 주세요.';
                    reopenPanelMountRoute();
                    return;
                }
                viewState.selectedSessionId = nextSessionId;
                viewState.classPanelMode = 'detail';
                viewState.activeTeacherDay = '월';
                viewState.activeTeacherSourceCellId = '';
                viewState.activeTeacherPeriodKey = '';
                viewState.activeTeacherPeriodIndex = '';
                viewState.miniError = '';
                viewState.miniNotice = '';
                if (viewState.miniNoticeTimer) { window.clearTimeout(viewState.miniNoticeTimer); viewState.miniNoticeTimer = 0; }
                clearStudentPanel();
                reopenPanelMountRoute();
                return;
            }
            const classBackButton = event.target.closest?.('[data-eie-v2-class-back]');
            if (classBackButton) {
                event.preventDefault();
                closeTimetableDetailPanel();
                reopenPanelMountRoute();
                return;
            }
            const classEditButton = event.target.closest?.('[data-eie-v2-class-edit]');
            if (classEditButton) {
                event.preventDefault();
                viewState.classPanelMode = 'edit';
                viewState.miniError = '';
                viewState.miniNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const backButton = event.target.closest?.('[data-eie-v2-student-back]');
            if (backButton) {
                event.preventDefault();
                clearStudentPanel();
                reopenPanelMountRoute();
                return;
            }
            const studentDetailTabButton = event.target.closest?.('[data-eie-v2-student-detail-tab]');
            if (studentDetailTabButton) {
                event.preventDefault();
                viewState.studentDetailTab = studentDetailTabButton.getAttribute('data-eie-v2-student-detail-tab') || 'basic';
                viewState.studentConsultationFormOpen = false;
                viewState.studentConsultationEditingId = '';
                reopenPanelMountRoute();
                return;
            }
            const studentGradesButton = event.target.closest?.('[data-eie-v2-open-student-grades]');
            if (studentGradesButton) {
                event.preventDefault();
                openStudentGradesFromPanel(studentGradesButton);
                return;
            }
            const attendanceSaveButton = event.target.closest?.('[data-eie-v2-attendance-save]');
            if (attendanceSaveButton) {
                event.preventDefault();
                saveStudentAttendanceFromPanel(
                    attendanceSaveButton.getAttribute('data-eie-v2-attendance-save') || '',
                    attendanceSaveButton.getAttribute('data-eie-v2-attendance-date-input') || 'eie-v2-attendance-date'
                );
                return;
            }
            const consultationSelectButton = event.target.closest?.('[data-eie-v2-consultation-select]');
            if (consultationSelectButton) {
                event.preventDefault();
                viewState.studentConsultationSelectedId = consultationSelectButton.getAttribute('data-eie-v2-consultation-select') || '';
                viewState.studentConsultationFormOpen = false;
                viewState.studentConsultationEditingId = '';
                reopenPanelMountRoute();
                return;
            }
            const consultationEditButton = event.target.closest?.('[data-eie-v2-consultation-edit]');
            if (consultationEditButton) {
                event.preventDefault();
                viewState.studentConsultationSelectedId = consultationEditButton.getAttribute('data-eie-v2-consultation-edit') || '';
                viewState.studentConsultationEditingId = viewState.studentConsultationSelectedId;
                viewState.studentConsultationFormOpen = true;
                viewState.studentError = '';
                viewState.studentNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const consultationDeleteButton = event.target.closest?.('[data-eie-v2-consultation-delete]');
            if (consultationDeleteButton) {
                event.preventDefault();
                deleteStudentConsultationFromPanel(consultationDeleteButton.getAttribute('data-eie-v2-consultation-delete') || '');
                return;
            }
            const consultationNewButton = event.target.closest?.('[data-eie-v2-consultation-new]');
            if (consultationNewButton) {
                event.preventDefault();
                viewState.studentConsultationFormOpen = true;
                viewState.studentConsultationEditingId = '';
                viewState.studentError = '';
                viewState.studentNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const consultationCancelButton = event.target.closest?.('[data-eie-v2-consultation-cancel]');
            if (consultationCancelButton) {
                event.preventDefault();
                viewState.studentConsultationFormOpen = false;
                viewState.studentConsultationEditingId = '';
                reopenPanelMountRoute();
                return;
            }
            const consultationSaveButton = event.target.closest?.('[data-eie-v2-consultation-save]');
            if (consultationSaveButton) {
                event.preventDefault();
                saveStudentConsultationFromPanel(consultationSaveButton.getAttribute('data-eie-v2-consultation-save') || '');
                return;
            }
            const editStudentButton = event.target.closest?.('[data-eie-v2-student-edit]');
            if (editStudentButton) {
                event.preventDefault();
                viewState.studentPanelMode = 'edit';
                viewState.studentError = '';
                viewState.studentNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const cancelStudentButton = event.target.closest?.('[data-eie-v2-student-cancel]');
            if (cancelStudentButton) {
                event.preventDefault();
                closeTimetableDetailPanel();
                reopenPanelMountRoute();
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
                const activeSourceCellId = viewState.activeTeacherSourceCellId || '';
                const activePeriodKey = viewState.activeTeacherPeriodKey || '';
                const activePeriodIndex = viewState.activeTeacherPeriodIndex || '';
                const targetInput = miniDayTeacherInput(activeDay, activeSourceCellId, activePeriodKey, activePeriodIndex, {
                    isMultiPeriod: isMiniMultiPeriodEditor()
                });
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
            const classAttendanceToggle = event.target.closest?.('[data-eie-v2-class-attendance-toggle]');
            if (classAttendanceToggle) {
                event.preventDefault();
                const sessionId = normalizeKey(classAttendanceToggle.getAttribute('data-eie-v2-class-attendance-toggle') || '');
                const mode = normalizeKey(classAttendanceToggle.getAttribute('data-eie-v2-class-attendance-mode') || '');
                if (mode === 'attendance') viewState.classAttendanceSessionId = sessionId;
                else if (mode === 'roster') viewState.classAttendanceSessionId = '';
                else viewState.classAttendanceSessionId = viewState.classAttendanceSessionId === sessionId ? '' : sessionId;
                reopenPanelMountRoute();
                return;
            }
            const classAttendanceButton = event.target.closest?.('[data-eie-v2-class-attendance]');
            if (classAttendanceButton) {
                event.preventDefault();
                saveClassAttendanceFromMiniPanel(classAttendanceButton);
                return;
            }
            const cancelMiniButton = event.target.closest?.('[data-eie-v2-cancel-mini]');
            if (cancelMiniButton) {
                event.preventDefault();
                if (viewState.classPanelMode === 'edit') {
                    viewState.classPanelMode = 'detail';
                    viewState.miniError = '';
                    viewState.miniNotice = '';
                    reopenPanelMountRoute();
                    return;
                }
                if ((viewState.panelMountRoute || '') === 'classroom' && window.EieClassroomView?.closeDetail) {
                    window.EieClassroomView.closeDetail();
                    return;
                }
                closeTimetableDetailPanel();
                reopenPanelMountRoute();
                return;
            }
            const assignStudentButton = event.target.closest?.('[data-eie-v2-assign-student]');
            if (assignStudentButton) {
                event.preventDefault();
                assignStudentToMiniClassroom();
                return;
            }
            const transferButton = event.target.closest?.('[data-eie-v2-student-transfer]');
            if (transferButton) {
                event.preventDefault();
                viewState.studentPanelMode = 'transfer';
                viewState.transferTargetId = '';
                viewState.studentError = '';
                viewState.studentNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const transferPick = event.target.closest?.('[data-eie-v2-transfer-pick]');
            if (transferPick) {
                event.preventDefault();
                viewState.transferTargetId = normalizeKey(transferPick.getAttribute('data-eie-v2-transfer-pick') || '');
                viewState.studentError = '';
                reopenPanelMountRoute();
                return;
            }
            const transferConfirm = event.target.closest?.('[data-eie-v2-transfer-confirm]');
            if (transferConfirm) {
                event.preventDefault();
                const targetId = normalizeKey(viewState.transferTargetId);
                if (!targetId) {
                    viewState.studentError = '이동할 반을 먼저 선택해 주세요.';
                    reopenPanelMountRoute();
                    return;
                }
                const targetSession = lastRenderedSessions.find(s => s.session_id === targetId);
                const targetLabel = targetSession ? `${targetSession.material || '-'} · ${targetSession.period_label || ''}` : '선택한 반';
                if (!window.confirm(`이 학생을 '${targetLabel}'(으)로 전반 처리할까요?`)) return;
                transferStudentToClass(transferConfirm.getAttribute('data-eie-v2-transfer-confirm') || '');
                return;
            }
            const addStudentToggle = event.target.closest?.('[data-eie-v2-add-student-toggle]');
            if (addStudentToggle) {
                event.preventDefault();
                viewState.studentPanelMode = 'new';
                viewState.selectedStudentId = '';
                viewState.selectedStudentName = '';
                viewState.miniAddStudentSessionId = addStudentToggle.getAttribute('data-session-id') || viewState.selectedSessionId;
                viewState.studentError = '';
                viewState.studentNotice = '';
                reopenPanelMountRoute();
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
                reopenPanelMountRoute();
                return;
            }
            const printButton = event.target.closest?.('[data-eie-print-timetable]');
            if (printButton) {
                event.preventDefault();
                printTimetable();
                return;
            }
            const editToggleButton = event.target.closest?.('[data-eie-edit-toggle]');
            if (editToggleButton) {
                event.preventDefault();
                viewState.editMode = true;
                viewState.activeDayOverlay = null;
                viewState.editDraft = {};
                viewState.editCreates = [];
                resetEditCopyState();
                viewState.editError = '';
                viewState.editNotice = '';
                viewState.selectedSessionId = '';
                reopenPanelMountRoute();
                return;
            }
            const editSaveButton = event.target.closest?.('[data-eie-edit-save]');
            if (editSaveButton) {
                event.preventDefault();
                saveEditDraft();
                return;
            }
            const editCancelButton = event.target.closest?.('[data-eie-edit-cancel]');
            if (editCancelButton) {
                event.preventDefault();
                viewState.editMode = false;
                viewState.editDraft = {};
                viewState.editCreates = [];
                resetEditCopyState();
                viewState.editError = '';
                viewState.editNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const repairOpenButton = event.target.closest?.('[data-eie-repair-open]');
            if (repairOpenButton) {
                event.preventDefault();
                viewState.repairMode = true;
                viewState.activeDayOverlay = null;
                viewState.repairPreview = null;
                viewState.repairError = '';
                viewState.repairNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const repairCloseButton = event.target.closest?.('[data-eie-repair-close]');
            if (repairCloseButton) {
                event.preventDefault();
                viewState.repairMode = false;
                viewState.repairPreview = null;
                viewState.repairError = '';
                viewState.repairNotice = '';
                reopenPanelMountRoute();
                return;
            }
            const zoomBoostButton = event.target.closest?.('[data-eie-zoom-boost]');
            if (zoomBoostButton) {
                event.preventDefault();
                viewState.zoomBoosted = !viewState.zoomBoosted;
                try { localStorage.setItem('eie-v2-zoom-boost', viewState.zoomBoosted ? '1' : '0'); } catch (_) {}
                applyZoomBoost();
                zoomBoostButton.textContent = viewState.zoomBoosted ? '작게 보기' : '크게 보기';
                zoomBoostButton.classList.toggle('is-active', viewState.zoomBoosted);
                return;
            }
        });

        document.addEventListener('focusin', event => {
            const dayInput = event.target.closest?.('[data-eie-v2-day-teacher]');
            if (dayInput) {
                viewState.activeTeacherDay = dayInput.getAttribute('data-eie-v2-day-teacher') || '월';
                viewState.activeTeacherSourceCellId = dayInput.getAttribute('data-eie-v2-period-source-cell') || '';
                viewState.activeTeacherPeriodKey = dayInput.getAttribute('data-eie-v2-period-key') || '';
                viewState.activeTeacherPeriodIndex = dayInput.getAttribute('data-eie-v2-period-index') || '';
            }
        });
        document.addEventListener('input', event => {
            const searchInput = event.target.closest?.('[data-eie-v2-search]');
            if (!searchInput) return;
            viewState.searchQuery = searchInput.value || '';
            viewState.selectedSessionId = '';
            clearStudentPanel();
            if (searchRerenderTimer) window.clearTimeout(searchRerenderTimer);
            searchRerenderTimer = window.setTimeout(() => {
                const rerender = window.EieRouter?.open ? reopenPanelMountRoute() : Promise.resolve();
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

        // ── 보드 잡고 끌기(드래그-팬) ─────────────────────────────────
        // 크게 보기(150%) 상태에서 하단 가로 스크롤바까지 내려가지 않고도
        // 시간표를 아무 곳이나 잡고 좌우/상하로 끌어서 이동할 수 있게 한다.
        let boardPan = null;
        document.addEventListener('pointerdown', event => {
            if (event.button !== 0) return;
            const scroller = event.target.closest?.('.eie-v2-board-scroll');
            if (!scroller) return;
            // 버튼/입력 등 인터랙티브 요소 위에서는 패닝을 시작하지 않는다.
            if (event.target.closest?.('button, a, input, select, textarea, label')) return;
            boardPan = {
                scroller,
                startX: event.clientX,
                startY: event.clientY,
                scrollLeft: scroller.scrollLeft,
                scrollTop: scroller.scrollTop,
                moved: false
            };
        });
        document.addEventListener('pointermove', event => {
            if (!boardPan) return;
            const dx = event.clientX - boardPan.startX;
            const dy = event.clientY - boardPan.startY;
            if (!boardPan.moved && Math.hypot(dx, dy) < 6) return;
            boardPan.moved = true;
            boardPan.scroller.classList.add('is-panning');
            boardPan.scroller.scrollLeft = boardPan.scrollLeft - dx;
            boardPan.scroller.scrollTop = boardPan.scrollTop - dy;
            event.preventDefault();
        });
        const endBoardPan = () => {
            if (!boardPan) return;
            const scroller = boardPan.scroller;
            if (boardPan.moved) {
                // 끌기로 끝난 경우, 뒤따라오는 click(카드 열림 등)을 한 번 막는다.
                const suppress = e => { e.stopPropagation(); e.preventDefault(); };
                scroller.addEventListener('click', suppress, { capture: true, once: true });
                setTimeout(() => scroller.removeEventListener('click', suppress, true), 0);
            }
            scroller.classList.remove('is-panning');
            boardPan = null;
        };
        document.addEventListener('pointerup', endBoardPan);
        document.addEventListener('pointercancel', endBoardPan);

        eventsBound = true;
    }

    function removeTimetablePrintSheet() {
        const existing = document.getElementById('eie-print-sheet');
        if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    }

    function getTimetablePrintSource() {
        const weekdayGrid = document.querySelector('.eie-weekday-overlay .eie-weekday-grid');
        if (weekdayGrid) {
            const day = normalizeKey(viewState.activeDayOverlay || viewState.selectedDay || weekdayGrid.closest?.('.eie-weekday-overlay')?.getAttribute?.('data-eie-day') || '');
            const label = day ? getDayLabelName(day) : '요일별';
            return {
                type: 'weekday',
                title: `EIE ${label} 시간표`,
                node: weekdayGrid
            };
        }
        const fullGrid = document.querySelector('.eie-v2-board-grid.eie-v2-full-grid');
        if (!fullGrid) return null;
        return {
            type: 'full',
            title: 'EIE 전체 시간표',
            node: fullGrid
        };
    }

    function buildTimetablePrintSheet() {
        removeTimetablePrintSheet();
        const source = getTimetablePrintSource();
        if (!source?.node) return null;

        const sheet = document.createElement('div');
        sheet.id = 'eie-print-sheet';
        sheet.className = `eie-print-sheet eie-print-sheet--measure is-${source.type}`;

        const title = document.createElement('div');
        title.className = 'eie-print-sheet-title';
        title.textContent = source.title || 'EIE 시간표';

        const body = document.createElement('div');
        body.className = 'eie-print-sheet-body';

        const stage = document.createElement('div');
        stage.className = 'eie-print-sheet-stage';

        const clone = source.node.cloneNode(true);
        clone.classList.add('eie-print-sheet-grid-clone');
        clone.removeAttribute('id');
        stage.appendChild(clone);
        body.appendChild(stage);
        sheet.appendChild(title);
        sheet.appendChild(body);
        document.body.appendChild(sheet);

        const rect = clone.getBoundingClientRect();
        const naturalWidth = Math.ceil(Math.max(rect.width || 0, clone.scrollWidth || 0));
        const naturalHeight = Math.ceil(Math.max(rect.height || 0, clone.scrollHeight || 0));
        if (!naturalWidth || !naturalHeight) {
            removeTimetablePrintSheet();
            return null;
        }

        const PRINT_WIDTH = 1084;
        const PRINT_BODY_HEIGHT = 730;
        const scale = Math.min(1, PRINT_WIDTH / naturalWidth, PRINT_BODY_HEIGHT / naturalHeight);
        const scaledWidth = naturalWidth * scale;
        const left = Math.max(0, Math.floor((PRINT_WIDTH - scaledWidth) / 2));

        stage.style.width = `${naturalWidth}px`;
        stage.style.height = `${naturalHeight}px`;
        stage.style.left = `${left}px`;
        stage.style.top = '0px';
        stage.style.transform = `scale(${scale})`;
        sheet.style.setProperty('--eie-print-scale', String(scale));
        sheet.style.setProperty('--eie-print-natural-width', `${naturalWidth}px`);
        sheet.style.setProperty('--eie-print-natural-height', `${naturalHeight}px`);
        sheet.classList.remove('eie-print-sheet--measure');
        return sheet;
    }

    function printTimetable() {
        const body = document && document.body;
        const sheet = buildTimetablePrintSheet();
        if (!sheet) {
            window.print?.();
            return;
        }
        if (body?.classList) body.classList.add('eie-printing-timetable');

        const cleanup = () => {
            removeTimetablePrintSheet();
            if (body?.classList) body.classList.remove('eie-printing-timetable');
            window.removeEventListener?.('afterprint', cleanup);
        };

        window.addEventListener?.('afterprint', cleanup, { once: true });
        const runPrint = () => {
            window.print?.();
            window.setTimeout?.(cleanup, 2000);
        };
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(() => window.requestAnimationFrame(runPrint));
        } else {
            window.setTimeout(runPrint, 50);
        }
    }

    function reopenPanelMountRoute() {
        // 패널 내 상태 전환(상세<->수정, 닫기, 출결 토글 등)은 데이터가 그대로다.
        // 같은 라우트를 다시 그릴 때 네트워크 재요청으로 화면이 하얗게 깜빡이는 걸 막기 위해
        // 다음 loadRows 한 번은 캐시를 쓰도록 표시한다.
        viewState.useRowsCacheOnce = true;
        if (window.EieRouter?.open) return window.EieRouter.open(viewState.panelMountRoute || 'timetable');
        return null;
    }

    function openStudentLedgerFromTimetable(button) {
        const studentId = button.getAttribute('data-eie-v2-student-id') || '';
        const studentName = button.getAttribute('data-eie-v2-student-name') || button.textContent || '';
        const previousStudentId = viewState.selectedStudentId;
        viewState.selectedStudentId = normalizeKey(studentId);
        viewState.selectedStudentName = normalizeStudentName(studentName);
        viewState.selectedSessionId = button.getAttribute('data-eie-v2-return-session') || viewState.selectedSessionId;
        viewState.selectedDay = button.getAttribute('data-eie-v2-return-day') || viewState.selectedDay;
        viewState.studentPanelMode = 'detail';
        viewState.studentDetailTab = 'basic';
        viewState.studentError = '';
        viewState.studentNotice = '';
        if (previousStudentId !== viewState.selectedStudentId) {
            viewState.studentConsultationLoadedId = '';
            viewState.studentConsultationRows = [];
            viewState.studentConsultationSelectedId = '';
            viewState.studentConsultationFormOpen = false;
            viewState.studentConsultationEditingId = '';
        }
        if (viewState.selectedStudentId && window.EieApmsState?.loadFoundation) {
            window.EieApmsState.loadFoundation({ force: true }).catch(() => null).then(() => {
                loadStudentConsultationsForPanel(viewState.selectedStudentId).catch(() => null).then(() => {
                    reopenPanelMountRoute();
                });
            });
            return;
        }
        if (viewState.selectedStudentId) {
            loadStudentConsultationsForPanel(viewState.selectedStudentId).catch(() => null).then(() => {
                reopenPanelMountRoute();
            });
            return;
        }
        reopenPanelMountRoute();
    }

    function openStudentGradesFromPanel(button) {
        const sid = normalizeKey(button?.getAttribute?.('data-eie-v2-open-student-grades') || viewState.selectedStudentId);
        const classId = normalizeKey(button?.getAttribute?.('data-eie-v2-grade-class-id') || selectedSessionRecord()?.source_cell_ids?.[0] || '');
        const student = selectedStudentRecord();
        const studentName = studentDisplayName(student || { display_name: viewState.selectedStudentName });
        if (window.EieGradeLedgerView && typeof EieGradeLedgerView.openStudent === 'function') {
            return EieGradeLedgerView.openStudent({
                studentId: sid,
                studentName,
                classId,
                mode: 'academy',
                monthKey: todayIso().slice(0, 7)
            });
        }
        if (window.EieGradeLedgerView && typeof EieGradeLedgerView.openLedger === 'function') {
            return EieGradeLedgerView.openLedger({
                studentId: sid,
                studentName,
                classId,
                mode: 'academy',
                monthKey: todayIso().slice(0, 7)
            });
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') return EieRouter.open('grades');
    }

    function clearStudentPanel() {
        viewState.selectedStudentId = '';
        viewState.selectedStudentName = '';
        viewState.studentPanelMode = 'detail';
        viewState.transferTargetId = '';
        viewState.studentDetailTab = 'basic';
        viewState.studentError = '';
        viewState.studentNotice = '';
        viewState.studentSaving = false;
        viewState.studentConsultationLoadedId = '';
        viewState.studentConsultationRows = [];
        viewState.studentConsultationSelectedId = '';
        viewState.studentConsultationFormOpen = false;
        viewState.studentConsultationEditingId = '';
    }

    function closeTimetableDetailPanel() {
        viewState.selectedSessionId = '';
        viewState.classPanelMode = 'detail';
        viewState.miniAddStudentSessionId = '';
        viewState.miniError = '';
        viewState.miniNotice = '';
        if (viewState.miniNoticeTimer) {
            window.clearTimeout(viewState.miniNoticeTimer);
            viewState.miniNoticeTimer = 0;
        }
        clearStudentPanel();
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

    async function saveStudentAttendanceFromPanel(studentId, dateInputId = 'eie-v2-attendance-date') {
        const sid = normalizeKey(studentId || viewState.selectedStudentId);
        if (!sid || viewState.studentSaving) return;
        if (!window.EieApi?.saveAttendanceRecord) {
            viewState.studentError = '출결 저장 API를 사용할 수 없습니다.';
            reopenPanelMountRoute();
            return;
        }
        const dateEl = document.getElementById(dateInputId || 'eie-v2-attendance-date');
        const session = selectedSessionRecord();
        const cellId = normalizeKey(session?.source_cell_ids?.[0] || session?.source_rows?.[0]?.id || '');
        const payload = {
            student_id: sid,
            date: normalizeKey(dateEl && dateEl.value) || todayIso(),
            status: '등원'
        };
        if (cellId) payload.timetable_cell_id = cellId;
        viewState.studentSaving = true;
        viewState.studentError = '';
        viewState.studentNotice = '';
        try {
            const result = await window.EieApi.saveAttendanceRecord(payload);
            const rows = result?.attendance_records || result?.attendance || (result?.attendance_record ? [result.attendance_record] : (result?.data ? [result.data] : []));
            if (window.EieState?.mergeStudentAttendance) window.EieState.mergeStudentAttendance(sid, rows);
            const currentEnrollDate = studentEnrollDate(selectedStudentRecord());
            const shouldWriteFirstEnrollDate = !currentEnrollDate;
            if (shouldWriteFirstEnrollDate && window.EieApi?.updateStudent) {
                const studentResult = await window.EieApi.updateStudent(sid, applyEnrollDateFields({}, payload.date));
                const row = studentResult?.student || studentResult?.data || null;
                await refreshStudentFoundation(row || { id: sid, raw_meta_json: JSON.stringify(applyEnrollDateFields({}, payload.date)) });
            } else if (rows.length) {
                await refreshStudentFoundation(selectedStudentRecord() || { id: sid });
            }
            viewState.studentNotice = shouldWriteFirstEnrollDate ? '등원일을 저장했습니다.' : '등원을 저장했습니다.';
        } catch (error) {
            viewState.studentError = error?.message || '등원을 저장하지 못했습니다.';
        } finally {
            viewState.studentSaving = false;
            reopenPanelMountRoute();
        }
    }

    async function loadStudentConsultationsForPanel(studentId) {
        const sid = normalizeKey(studentId || viewState.selectedStudentId);
        if (!sid || viewState.studentConsultationLoadedId === sid) return;
        if (!window.EieApi?.getConsultations) {
            viewState.studentConsultationRows = consultationRowsForStudent(sid);
            viewState.studentConsultationLoadedId = sid;
            return;
        }
        const result = await window.EieApi.getConsultations(sid).catch(() => null);
        const rows = consultationRowsFromResult(result);
        viewState.studentConsultationRows = Array.isArray(rows) ? rows : [];
        viewState.studentConsultationLoadedId = sid;
        if (window.EieState?.mergeStudentConsultations) {
            window.EieState.mergeStudentConsultations(sid, viewState.studentConsultationRows);
        }
    }

    async function saveClassAttendanceFromMiniPanel(button) {
        const sid = normalizeKey(button?.getAttribute?.('data-eie-v2-class-attendance') || '');
        const sessionId = normalizeKey(button?.getAttribute?.('data-session-id') || viewState.selectedSessionId);
        const cellId = normalizeKey(button?.getAttribute?.('data-cell-id') || '');
        const date = normalizeKey(button?.getAttribute?.('data-date') || todayIso());
        if (!sid || viewState.miniSaving) return;
        if (!window.EieApi?.saveAttendanceRecord) {
            viewState.miniError = '출결 저장 API를 사용할 수 없습니다.';
            reopenPanelMountRoute();
            return;
        }
        const current = classAttendanceRecord(sid, date);
        const currentStatus = classAttendanceStatusLabel(current?.status);
        const nextStatus = current ? (currentStatus === '출석' ? '결석' : '출석') : '출석';
        viewState.miniSaving = true;
        viewState.miniError = '';
        viewState.miniNotice = '';
        try {
            const payload = {
                student_id: sid,
                date,
                status: nextStatus
            };
            if (cellId) payload.timetable_cell_id = cellId;
            const result = await window.EieApi.saveAttendanceRecord(payload);
            const rows = result?.attendance_records || result?.attendance || (result?.attendance_record ? [result.attendance_record] : (result?.data ? [result.data] : []));
            if (window.EieState?.mergeStudentAttendance) window.EieState.mergeStudentAttendance(sid, rows);
            viewState.classAttendanceSessionId = sessionId;
        } catch (error) {
            viewState.miniError = error?.message || '출결을 저장하지 못했습니다.';
        } finally {
            viewState.miniSaving = false;
            reopenPanelMountRoute();
        }
    }

    async function saveStudentConsultationFromPanel(studentId) {
        const sid = normalizeKey(studentId || viewState.selectedStudentId);
        if (!sid) return;
        if (viewState.studentSaving) return;
        const editingId = normalizeKey(viewState.studentConsultationEditingId);
        const editingRow = editingId ? consultationRowsForStudent(sid).find(row => consultationRowId(row) === editingId) : null;
        const apiEditId = editingRow ? consultationApiId(editingRow) : '';
        if ((!editingRow && !window.EieApi?.createConsultation) || (editingRow && (!apiEditId || !window.EieApi?.updateConsultation))) {
            viewState.studentError = '상담 저장 API를 사용할 수 없습니다.';
            reopenPanelMountRoute();
            return;
        }
        const dateEl = document.getElementById('eie-v2-consultation-date') || document.getElementById('eie-v2-attendance-date');
        const typeEl = document.getElementById('eie-v2-consultation-type');
        const contentEl = document.getElementById('eie-v2-consultation-content');
        const nextEl = document.getElementById('eie-v2-consultation-next-action');
        const payload = {
            student_id: sid,
            date: normalizeKey(dateEl && dateEl.value) || todayIso(),
            type: normalizeKey(typeEl && typeEl.value) || '학습',
            content: normalizeKey(contentEl && contentEl.value),
            next_action: normalizeKey(nextEl && nextEl.value)
        };
        if (!payload.content) {
            viewState.studentError = '상담 내용을 입력해 주세요.';
            reopenPanelMountRoute();
            return;
        }
        viewState.studentSaving = true;
        viewState.studentError = '';
        viewState.studentNotice = '';
        try {
            const result = editingRow
                ? await window.EieApi.updateConsultation(apiEditId, payload)
                : await window.EieApi.createConsultation(payload);
            let rows = consultationRowsFromResult(result);
            if (!Array.isArray(rows)) rows = [];
            if (!rows.length) {
                rows = [Object.assign({}, editingRow || {}, payload, {
                    id: apiEditId || `panel-${sid}-${Date.now()}`,
                    created_at: normalizeKey(editingRow?.created_at) || new Date().toISOString()
                })];
            }
            mergePanelConsultationRows(sid, rows);
            viewState.studentConsultationSelectedId = consultationRowId(rows[0]);
            if (window.EieApi?.getConsultations) {
                const loaded = await window.EieApi.getConsultations(sid).catch(() => null);
                const loadedRows = consultationRowsFromResult(loaded);
                if (Array.isArray(loadedRows) && loadedRows.length) {
                    replacePanelConsultationRows(sid, loadedRows);
                    const savedId = consultationRowId(rows[0]);
                    if (savedId && loadedRows.some(row => consultationRowId(row) === savedId)) {
                        viewState.studentConsultationSelectedId = savedId;
                    }
                }
            }
            viewState.studentNotice = editingRow ? '상담을 수정했습니다.' : '상담을 저장했습니다.';
            viewState.studentConsultationFormOpen = false;
            viewState.studentConsultationEditingId = '';
            if (contentEl) contentEl.value = '';
            if (nextEl) nextEl.value = '';
        } catch (error) {
            viewState.studentError = error?.message || '상담을 저장하지 못했습니다.';
        } finally {
            viewState.studentSaving = false;
            reopenPanelMountRoute();
        }
    }

    async function deleteStudentConsultationFromPanel(consultationId) {
        const id = normalizeKey(consultationId);
        const sid = normalizeKey(viewState.selectedStudentId);
        if (!id || !sid || viewState.studentSaving) return;
        if (!window.EieApi?.deleteConsultation) {
            viewState.studentError = '상담 삭제 API를 사용할 수 없습니다.';
            reopenPanelMountRoute();
            return;
        }
        if (window.confirm && !window.confirm('상담 기록을 삭제할까요?')) return;
        viewState.studentSaving = true;
        viewState.studentError = '';
        viewState.studentNotice = '';
        try {
            const result = await window.EieApi.deleteConsultation(id);
            const responseRows = consultationRowsFromResult(result);
            const nextRows = responseRows.length
                ? responseRows
                : consultationRowsForStudent(sid).filter(row => consultationApiId(row) !== id);
            replacePanelConsultationRows(sid, nextRows);
            viewState.studentConsultationSelectedId = consultationRowId(nextRows[0]);
            viewState.studentConsultationFormOpen = false;
            viewState.studentConsultationEditingId = '';
            viewState.studentNotice = '상담을 삭제했습니다.';
        } catch (error) {
            viewState.studentError = error?.message || '상담을 삭제하지 못했습니다.';
        } finally {
            viewState.studentSaving = false;
            reopenPanelMountRoute();
        }
    }

    function resetEditCopyState() {
        viewState.editCopySourceSessionId = '';
    }

    function slotDataFromElement(el) {
        return {
            teacherKey: el?.getAttribute('data-drop-teacher-key') || '',
            teacherName: el?.getAttribute('data-drop-teacher-name') || '',
            columnIndex: Number(el?.getAttribute('data-drop-column-index') || 0),
            periodKey: el?.getAttribute('data-drop-period-key') || '',
            periodLabel: el?.getAttribute('data-drop-period-label') || '',
            periodOrder: Number(el?.getAttribute('data-drop-period-order') || 0),
            startTime: el?.getAttribute('data-drop-start') || '',
            endTime: el?.getAttribute('data-drop-end') || '',
            dayLabel: el?.getAttribute('data-drop-day-label') || ''
        };
    }

    function sanitizeCopiedRawMeta(meta, sourceSession, targetSlot) {
        const raw = { ...(meta || {}) };
        [
            'students',
            'student_names',
            'studentSeeds',
            'student_candidates',
            'assigned_students',
            'assignments',
            'student_count'
        ].forEach(key => { delete raw[key]; });
        const dayTeachers = sourceSession?.day_teachers || raw.day_teachers || raw.teacher_names_by_day || {};
        raw.source_type = 'manual_copy';
        raw.copy_source = 'timetable_copy_paste';
        raw.copied_from_session_id = sourceSession?.session_id || '';
        raw.copied_from_cell_ids = Array.isArray(sourceSession?.source_cell_ids) ? sourceSession.source_cell_ids : [];
        raw.material_text = sourceSession?.material || raw.material_text || '';
        raw.homeroom_teacher = targetSlot.teacherName || sourceSession?.homeroom_teacher || raw.homeroom_teacher || '';
        raw.teacher_names = uniqueNames([targetSlot.teacherName || sourceSession?.homeroom_teacher || sourceSession?.teacher_name || ''].filter(Boolean));
        raw.day_teachers = dayTeachers;
        raw.teacher_names_by_day = dayTeachers;
        return raw;
    }

    function buildCopiedCellPayload(sourceSession, targetSlot, slotLane) {
        const first = sourceSession?.source_rows?.[0] || {};
        const meta = getRawMeta(first);
        const className = normalizeKey(sourceSession?.class_full_name || first.class_name_raw || first.class_name || sourceSession?.material || meta.class_name_raw || meta.material_text || '');
        const material = normalizeKey(sourceSession?.material || first.material_text || meta.material_text || className);
        return {
            day_label: normalizeKey(targetSlot.dayLabel || ''),
            period_label: targetSlot.periodLabel || '',
            period_order: targetSlot.periodOrder || 0,
            start_time: targetSlot.startTime || '',
            end_time: targetSlot.endTime || '',
            column_index: Number.isFinite(Number(targetSlot.columnIndex)) ? Number(targetSlot.columnIndex) : 0,
            class_name_raw: className,
            material_text: material,
            material,
            teacher_name_raw: targetSlot.teacherName || sourceSession?.homeroom_teacher || sourceSession?.teacher_name || '',
            room_raw: first.room_raw || sourceSession?.room || '',
            status: 'active',
            memo: sourceSession?.memo || first.memo || '',
            source_type: 'manual',
            slot_lane: (slotLane === 2) ? 2 : 1,
            raw_meta_json: sanitizeCopiedRawMeta(meta, sourceSession, targetSlot)
        };
    }

    function createTempCopiedCell(sourceSession, targetSlot, slotLane) {
        const payload = buildCopiedCellPayload(sourceSession, targetSlot, slotLane);
        const tempId = `temp_copy_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        return {
            ...payload,
            id: tempId,
            cell_id: tempId,
            temp_id: tempId,
            is_temp_copy: true,
            period_key: targetSlot.periodKey || '',
            copy_source_session_id: sourceSession?.session_id || '',
            assigned_students: (Array.isArray(sourceSession?.students) ? sourceSession.students : []).map(student => ({
                assignment_id: student.assignment_id || '',
                student_id: student.student_id || student.id || student.confirmed_student_id || student.matched_student_id || student.canonical_student_id || '',
                pin: student.pin || student.student_pin || '',
                name: student.name || student.display_name || student.student_name_raw || '',
                display_name: student.display_name || student.name || student.student_name_raw || '',
                grade: student.grade || student.grade_raw || '',
                status: student.status || 'active',
                student_type: student.student_type || student.type || '',
                memo: student.memo || ''
            })).filter(student => student.name || student.student_id),
            student_count: Array.isArray(sourceSession?.students) ? sourceSession.students.length : 0,
            raw_meta_json: payload.raw_meta_json
        };
    }

    async function deleteClassSession(sessionId) {
        if (!viewState.editMode || viewState.editSaving) return;
        const sid = normalizeKey(sessionId);
        if (!sid) return;
        const session = lastRenderedSessions.find(row => row.session_id === sid);
        if (!session) return;

        if (session.is_temp_copy) {
            const sourceIds = new Set((session.source_cell_ids || []).map(normalizeKey));
            viewState.editCreates = (viewState.editCreates || []).filter(cell => {
                const id = normalizeKey(cell.id || cell.cell_id || cell.temp_id || '');
                return !sourceIds.has(id);
            });
            if (viewState.selectedSessionId === sid) viewState.selectedSessionId = '';
            viewState.editNotice = `${session.material || session.class_full_name || '저장 전 반'}을(를) 삭제했습니다.`;
            viewState.editError = '';
            reopenPanelMountRoute();
            return;
        }

        const cellIds = (session.source_cell_ids || []).map(normalizeKey).filter(Boolean);
        if (!cellIds.length || !window.EieApi?.updateTimetableCellStatus) return;
        const ok = window.confirm('이 반카드만 시간표에서 삭제할까요? 학생은 삭제되지 않습니다.');
        if (!ok) return;

        viewState.editSaving = true;
        viewState.editError = '';
        viewState.editNotice = '반카드를 삭제하는 중입니다.';
        reopenPanelMountRoute();
        try {
            for (const cellIdValue of cellIds) {
                await window.EieApi.updateTimetableCellStatus(cellIdValue, 'archived');
            }
            if (viewState.editDraft[sid]) delete viewState.editDraft[sid];
            if (viewState.selectedSessionId === sid) viewState.selectedSessionId = '';
            clearStudentPanel();
            await refreshTimetableRowsAfterMiniSave();
            viewState.editNotice = `${session.material || session.class_full_name || '반카드'}을(를) 삭제했습니다.`;
            viewState.editError = '';
        } catch (error) {
            viewState.editError = error?.message || '반카드 삭제에 실패했습니다.';
            viewState.editNotice = '';
        } finally {
            viewState.editSaving = false;
            reopenPanelMountRoute();
        }
    }

    function copySessionForPaste(sessionId) {
        if (!viewState.editMode) return;
        const sid = normalizeKey(sessionId);
        const session = lastRenderedSessions.find(row => row.session_id === sid);
        if (!session) return;
        viewState.editCopySourceSessionId = sid;
        viewState.editNotice = `${session.material || session.class_full_name || '선택한 반'}을(를) 복사했습니다. 빈 슬롯의 '여기에 붙여넣기'를 누르세요.`;
        viewState.editError = '';
        reopenPanelMountRoute();
    }

    function pasteCopiedSessionToSlot(slotEl) {
        if (!viewState.editMode || !viewState.editCopySourceSessionId) return;
        const source = copiedSessionRecord();
        if (!source) {
            resetEditCopyState();
            viewState.editError = '복사한 반을 찾지 못했습니다. 다시 복사해 주세요.';
            reopenPanelMountRoute();
            return;
        }
        const targetSlot = slotDataFromElement(slotEl);
        if (!targetSlot.periodKey || !targetSlot.teacherKey) return;
        if (normalizeKey(targetSlot.periodKey) === sourcePeriodKey(source)) {
            viewState.editError = '같은 교시에는 붙여넣을 수 없습니다.';
            viewState.editNotice = '';
            reopenPanelMountRoute();
            return;
        }
        const targetSlotKey = slotKeyOf(targetSlot);
        const alreadySameCopy = (viewState.editCreates || []).some(cell => (
            tempCellSlotKey(cell) === targetSlotKey &&
            normalizeKey(cell.copy_source_session_id || '') === normalizeKey(source.session_id || '')
        ));
        if (alreadySameCopy) {
            viewState.editError = '같은 반은 같은 위치에 한 번만 붙여넣을 수 있습니다.';
            viewState.editNotice = '';
            reopenPanelMountRoute();
            return;
        }
        const existingCardsForTarget = lastRenderedSessions.filter(session =>
            !session.is_temp_copy &&
            Number(session.period_order) === Number(targetSlot.periodOrder) &&
            normalizeKey(session.homeroom_teacher || '') === normalizeKey(targetSlot.teacherName || '')
        );
        const slotLane = detectTargetSlotLane(targetSlot, existingCardsForTarget);
        if (slotLane === null) {
            viewState.editError = '이 교시·선생님 칸에는 반을 더 이상 추가할 수 없습니다 (최대 2반).';
            viewState.editNotice = '';
            reopenPanelMountRoute();
            return;
        }
        const tempCell = createTempCopiedCell(source, targetSlot, slotLane);
        viewState.editCreates.push(tempCell);
        viewState.selectedSessionId = '';
        viewState.editNotice = `${source.material || source.class_full_name || '복사한 반'}을(를) ${targetSlot.periodLabel || '선택한 교시'} · ${targetSlot.teacherName || '담임'} 슬롯에 붙여넣었습니다. 저장 전까지 실제 시간표에는 반영되지 않습니다.`;
        viewState.editError = '';
        reopenPanelMountRoute();
    }

    async function saveEditDraft() {
        if (viewState.editSaving) return;
        const draftEntries = Object.entries(viewState.editDraft);
        const createEntries = Array.isArray(viewState.editCreates) ? viewState.editCreates : [];
        if (!draftEntries.length && !createEntries.length) {
            viewState.editMode = false;
            resetEditCopyState();
            viewState.editNotice = '';
            reopenPanelMountRoute();
            return;
        }
        viewState.editSaving = true;
        viewState.editError = '';
        viewState.editNotice = '시간표를 저장하는 중입니다.';
        reopenPanelMountRoute();
        let successCount = 0;
        const failures = [];
        try {
            const failedCreateCells = [];
            const failedDraftSessionIds = new Set();
            for (const cell of createEntries) {
                try {
                    const payload = {
                        day_label: normalizeKey(cell.day_label || ''),
                        period_label: cell.period_label || '',
                        period_order: Number(cell.period_order || 0),
                        start_time: cell.start_time || '',
                        end_time: cell.end_time || '',
                        column_index: Number.isFinite(Number(cell.column_index)) ? Number(cell.column_index) : 0,
                        class_name_raw: cell.class_name_raw || cell.material_text || cell.material || '',
                        material_text: cell.material_text || cell.material || cell.class_name_raw || '',
                        material: cell.material || cell.material_text || cell.class_name_raw || '',
                        teacher_name_raw: cell.teacher_name_raw || '',
                        room_raw: cell.room_raw || '',
                        status: normalizeStatus(cell.status || 'active'),
                        memo: cell.memo || '',
                        source_type: 'manual',
                        slot_lane: (Number(cell.slot_lane) === 2) ? 2 : 1,
                        raw_meta_json: cell.raw_meta_json || {}
                    };
                    if (!payload.class_name_raw) throw new Error('class_name_raw is required');
                    const created = await window.EieApi.createTimetableCell(payload);
                    const savedCell = created?.timetable_cell || created?.data || created?.cell || null;
                    const savedCellId = normalizeKey(savedCell?.id || savedCell?.cell_id || '');
                    if (savedCellId && Array.isArray(cell.assigned_students) && cell.assigned_students.length) {
                        const assignOps = cell.assigned_students
                            .map(student => normalizeKey(student.student_id || student.id || student.confirmed_student_id || student.matched_student_id || student.canonical_student_id || ''))
                            .filter(Boolean)
                            .map(copiedStudentId => ({ cell_id: savedCellId, student_id: copiedStudentId }));
                        if (assignOps.length) await batchCellStudentOps(savedCellId, { assign: assignOps }).catch(() => null);
                    }
                    successCount++;
                } catch (err) {
                    failedCreateCells.push(cell);
                    failures.push(cell.class_name_raw || cell.id || 'new-cell');
                }
            }
            for (const [sessionId, changes] of draftEntries) {
                const session = lastRenderedSessions.find(s => s.session_id === sessionId);
                if (!session) continue;
                for (const row of (session.source_rows || [])) {
                    const rowId = normalizeKey(row?.id || row?.cell_id || '');
                    if (!rowId) continue;
                    try {
                        const payload = {};
                        if (changes.homeroomKey) {
                            payload.homeroom_teacher = changes.homeroomName;
                            payload.teacher_name_raw = changes.homeroomName;
                            const meta = getRawMeta(row);
                            payload.raw_meta_json = { ...meta, homeroom_teacher: changes.homeroomName };
                        }
                        if (changes.periodKey) {
                            payload.period_label = changes.periodLabel;
                            payload.period_order = changes.periodOrder;
                            payload.start_time = changes.startTime;
                            payload.end_time = changes.endTime;
                        }
                        await window.EieApi.updateTimetableCell(rowId, payload);
                        successCount++;
                    } catch (err) {
                        failures.push(rowId);
                        failedDraftSessionIds.add(sessionId);
                    }
                }
            }
            if (failures.length) {
                const nextDraft = {};
                failedDraftSessionIds.forEach(sessionId => {
                    if (viewState.editDraft[sessionId]) nextDraft[sessionId] = viewState.editDraft[sessionId];
                });
                viewState.editDraft = nextDraft;
                viewState.editCreates = failedCreateCells;
                viewState.editMode = true;
                viewState.editError = `${successCount}건 저장 / ${failures.length}건 실패. 실패한 항목은 편집 상태로 남겨두었습니다.`;
                viewState.editNotice = '';
                await refreshTimetableRowsAfterMiniSave();
            } else {
                await refreshTimetableRowsAfterMiniSave();
                viewState.editDraft = {};
                viewState.editCreates = [];
                viewState.editMode = false;
                resetEditCopyState();
                viewState.editNotice = '시간표를 저장했습니다.';
                viewState.editError = '';
            }
        } catch (err) {
            viewState.editError = err?.message || '저장 실패';
        } finally {
            viewState.editSaving = false;
            reopenPanelMountRoute();
        }
    }

    // Deprecated: 기존 오른쪽 패널 "교시 복사" 흐름은 제거했다. 편집 모드 복사→붙여넣기만 사용한다.

    // ── 배정/해제 일괄 처리 헬퍼 ──────────────────────────────────────
    // ops: { assign: [{ cell_id, student_id }], remove: [{ cell_id, student_id }] }
    // batch API 한 번으로 처리하고, 워커가 batch 라우트를 모르는 경우(404/405)만
    // 기존 단건 API를 병렬 호출로 폴백한다.
    async function batchCellStudentOps(primaryCellId, ops) {
        const assign = Array.isArray(ops?.assign) ? ops.assign.filter(op => op && op.cell_id && op.student_id) : [];
        const remove = Array.isArray(ops?.remove) ? ops.remove.filter(op => op && op.cell_id && op.student_id) : [];
        if (!assign.length && !remove.length) return { success: true };
        if (window.EieApi?.batchCellStudents) {
            try {
                return await window.EieApi.batchCellStudents(primaryCellId, { assign, remove });
            } catch (error) {
                if (error?.status !== 404 && error?.status !== 405) throw error;
            }
        }
        const results = await Promise.allSettled([
            ...assign.map(op => window.EieApi.assignStudentToCell(op.cell_id, op.student_id)),
            ...remove.map(op => window.EieApi.removeStudentFromCell(op.cell_id, op.student_id))
        ]);
        const okCount = results.filter(r => r.status === 'fulfilled').length;
        if (!okCount) {
            const firstRejected = results.find(r => r.status === 'rejected');
            if (firstRejected) throw firstRejected.reason;
        }
        return { success: true, fallback: true };
    }

    async function transferStudentToClass(studentId) {
        if (viewState.studentSaving) return;
        const targetSelect = document.getElementById('eie-v2-transfer-target');
        const targetSessionId = normalizeKey(viewState.transferTargetId || targetSelect?.value || '');
        if (!targetSessionId) {
            viewState.studentError = '이동할 반을 선택해 주세요.';
            reopenPanelMountRoute();
            return;
        }
        const sid = normalizeKey(studentId);
        if (!sid) return;
        const currentSession = selectedSessionRecord();
        const targetSession = lastRenderedSessions.find(s => s.session_id === targetSessionId);
        if (!targetSession) return;
        viewState.studentSaving = true;
        viewState.studentError = '';
        try {
            const currentCellIds = Array.isArray(currentSession?.source_cell_ids)
                ? currentSession.source_cell_ids.filter(Boolean) : [];
            const newCellIds = Array.isArray(targetSession.source_cell_ids)
                ? targetSession.source_cell_ids.filter(Boolean) : [];
            const removeOps = currentCellIds.map(cellId => ({ cell_id: cellId, student_id: sid }));
            const assignOps = newCellIds.map(cellId => ({ cell_id: cellId, student_id: sid }));
            if (removeOps.length || assignOps.length) {
                const primaryCellId = (assignOps[0] || removeOps[0]).cell_id;
                await batchCellStudentOps(primaryCellId, { assign: assignOps, remove: removeOps }).catch(() => null);
            }
            if (window.EieApmsState?.loadFoundation)
                await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
            await refreshTimetableRowsAfterMiniSave();
            closeTimetableDetailPanel();
        } catch (error) {
            viewState.studentError = error?.message || '전반 실패';
        } finally {
            viewState.studentSaving = false;
            reopenPanelMountRoute();
            clearMiniNoticeLater(2000);
        }
    }

    async function createAndAssignStudent() {
        const name = studentFieldValue('eie-v2-edit-name');
        if (!name) {
            viewState.studentError = '학생명은 필수입니다.';
            reopenPanelMountRoute();
            return;
        }
        if (!window.EieApi?.createStudent) {
            viewState.studentError = 'API를 사용할 수 없습니다.';
            reopenPanelMountRoute();
            return;
        }
        viewState.studentSaving = true;
        viewState.studentError = '';
        try {
            const payload = {
                display_name: name,
                name,
                grade: normalizeGrade(studentFieldValue('eie-v2-edit-grade')),
                school_name: studentFieldValue('eie-v2-edit-school'),
                phone: studentFieldValue('eie-v2-edit-phone'),
                student_phone: studentFieldValue('eie-v2-edit-phone'),
                parent_phone: studentFieldValue('eie-v2-edit-parent-phone'),
                student_address: studentFieldValue('eie-v2-edit-address'),
                vehicle_info: studentFieldValue('eie-v2-edit-vehicle'),
                student_type: studentFieldValue('eie-v2-edit-student-type') || '일반',
                status: 'active'
            };
            applyEnrollDateFields(payload, studentFieldValue('eie-v2-new-enroll-date'));
            const result = await window.EieApi.createStudent(payload);
            const newId = normalizeKey(result?.id || result?.data?.id || result?.student?.id || '');
            const sessionId = viewState.miniAddStudentSessionId || viewState.selectedSessionId;
            const session = lastRenderedSessions.find(s => s.session_id === sessionId) || null;
            const cellIds = Array.isArray(session?.source_cell_ids) ? session.source_cell_ids.filter(Boolean) : [];
            if (newId && cellIds.length) {
                const assignOps = cellIds.map(cid => ({ cell_id: cid, student_id: newId }));
                await batchCellStudentOps(cellIds[0], { assign: assignOps }).catch(() => null);
            }
            if (window.EieApmsState?.loadFoundation) await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
            await refreshTimetableRowsAfterMiniSave();
            closeTimetableDetailPanel();
        } catch (error) {
            viewState.studentError = error?.message || '등록 실패';
        } finally {
            viewState.studentSaving = false;
            reopenPanelMountRoute();
            clearMiniNoticeLater(2000);
        }
    }

    async function saveStudentFromPanel() {
        if (viewState.studentSaving) return;
        if (viewState.studentPanelMode === 'new') {
            await createAndAssignStudent();
            return;
        }
        const sid = normalizeKey(viewState.selectedStudentId);
        if (!sid || !window.EieApi?.updateStudent) {
            viewState.studentError = '학생 id가 없어 시간표 패널에서 바로 수정할 수 없습니다.';
            reopenPanelMountRoute();
            return;
        }
        const payload = {
            display_name: studentFieldValue('eie-v2-edit-name'),
            name: studentFieldValue('eie-v2-edit-name'),
            grade: normalizeGrade(studentFieldValue('eie-v2-edit-grade')),
            school_name: studentFieldValue('eie-v2-edit-school'),
            phone: studentFieldValue('eie-v2-edit-phone'),
            student_phone: studentFieldValue('eie-v2-edit-phone'),
            parent_phone: studentFieldValue('eie-v2-edit-parent-phone'),
            guardian_relation: studentFieldValue('eie-v2-edit-guardian-relation'),
            student_address: studentFieldValue('eie-v2-edit-address'),
            vehicle_info: studentFieldValue('eie-v2-edit-vehicle'),
            student_type: studentFieldValue('eie-v2-edit-student-type') || '일반',
            teacher_names: selectedStudentTeacherNames(),
            status: studentFieldValue('eie-v2-edit-status') || 'active',
            memo: studentFieldValue('eie-v2-edit-memo')
        };
        applyEnrollDateFields(payload, studentFieldValue('eie-v2-edit-enroll-date'));
        if (!payload.display_name) {
            viewState.studentError = '학생명은 필수입니다.';
            reopenPanelMountRoute();
            return;
        }
        viewState.studentSaving = true;
        viewState.studentError = '';
        try {
            const result = await window.EieApi.updateStudent(sid, payload);
            const row = result?.student || result?.data || { id: sid, ...payload };
            await refreshStudentFoundation(row);
            closeTimetableDetailPanel();
        } catch (error) {
            viewState.studentError = error?.message || '학생 정보를 저장하지 못했습니다.';
        } finally {
            viewState.studentSaving = false;
            reopenPanelMountRoute();
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

    function miniPeriodTeacherValues() {
        const result = {
            bySourceCellId: new Map(),
            byCompositeKey: new Map(),
            byPeriodTeacherKey: new Map(),
            byPeriodKey: new Map(),
            byIndex: new Map(),
            periodDayTeachers: {},
            ambiguousSourceCellIds: new Set()
        };
        if (!document.querySelectorAll) return result;
        const inputs = Array.from(document.querySelectorAll('[data-eie-v2-day-teacher]'));
        const sourceSignatures = new Map();
        inputs.forEach(input => {
            const sourceCellId = normalizeKey(input.getAttribute('data-eie-v2-period-source-cell') || '');
            if (!sourceCellId) return;
            const signature = miniPeriodRowKey(
                sourceCellId,
                input.getAttribute('data-eie-v2-period-key') || '',
                input.getAttribute('data-eie-v2-period-index') || ''
            );
            if (!sourceSignatures.has(sourceCellId)) sourceSignatures.set(sourceCellId, new Set());
            if (signature) sourceSignatures.get(sourceCellId).add(signature);
        });
        sourceSignatures.forEach((signatures, sourceCellId) => {
            if (signatures.size > 1) result.ambiguousSourceCellIds.add(sourceCellId);
        });
        inputs.forEach(input => {
            const day = input.getAttribute('data-eie-v2-day-teacher') || '';
            const sourceCellId = normalizeKey(input.getAttribute('data-eie-v2-period-source-cell') || '');
            const periodKey = normalizeKey(input.getAttribute('data-eie-v2-period-key') || '');
            const index = normalizeKey(input.getAttribute('data-eie-v2-period-index') || '');
            const compositeKey = miniPeriodRowKey(sourceCellId, periodKey, index);
            const periodTeacherKey = periodTeacherKeyForInput(input);
            const teachers = splitTeacherValue(input.value || '');
            if (periodTeacherKey) {
                if (!result.periodDayTeachers[periodTeacherKey]) result.periodDayTeachers[periodTeacherKey] = {};
                result.periodDayTeachers[periodTeacherKey][day] = teachers;
            }
            [
                [result.bySourceCellId, sourceCellId],
                [result.byCompositeKey, compositeKey],
                [result.byPeriodTeacherKey, periodTeacherKey],
                [result.byPeriodKey, periodKey],
                [result.byIndex, index]
            ].forEach(([map, key]) => {
                if (!key) return;
                if (!map.has(key)) map.set(key, {});
                map.get(key)[day] = teachers;
            });
        });
        return result;
    }

    function existingRowDayTeachers(row) {
        const result = {};
        DAY_ORDER.slice(0, 5).forEach(day => {
            const teachers = dayTeacherValues(row, day);
            if (teachers.length) result[day] = teachers;
        });
        return result;
    }

    function teacherValuesForRow(row, index, periodTeacherValues, fallbackDayTeachers, options = {}) {
        const rowId = normalizeKey(row?.id || row?.cell_id || '');
        const periodKey = normalizeKey(cellPeriodKey(row));
        const indexKey = normalizeKey(index);
        const compositeKey = miniPeriodRowKey(rowId, periodKey, indexKey);
        const periodTeacherKey = periodTeacherKeyForPeriod(row, indexKey);
        if (options?.isMultiPeriod) {
            const matched = periodTeacherValues.byCompositeKey.get(compositeKey)
                || periodTeacherValues.byPeriodTeacherKey.get(periodTeacherKey)
                || periodTeacherValues.byPeriodKey.get(periodKey)
                || periodTeacherValues.byIndex.get(indexKey)
                || (!periodTeacherValues.ambiguousSourceCellIds?.has(rowId) ? periodTeacherValues.bySourceCellId.get(rowId) : null);
            if (matched) return matched;
            const metaPeriodDays = resolvePeriodDayTeachers(getRawMeta(row), row, indexKey, {});
            if (Object.keys(metaPeriodDays).length) return metaPeriodDays;
            return options?.existingRowDayTeachers || {};
        }
        return periodTeacherValues.bySourceCellId.get(rowId)
            || periodTeacherValues.byPeriodKey.get(periodKey)
            || periodTeacherValues.byIndex.get(indexKey)
            || fallbackDayTeachers
            || {};
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
        const first = rows[0] || {};
        const periodOrder = periodOrderOf(session?.periods?.[0] || first || session);
        const startTime = miniTimePayloadValue('eie-v2-mini-start', session.start_time || first.start_time || '', periodOrder, 'start');
        const endTime = miniTimePayloadValue('eie-v2-mini-end', session.end_time || first.end_time || '', periodOrder, 'end');
        const memo = miniFieldValue('eie-v2-mini-memo');
        const dayTeachers = miniDayTeacherValues();
        const periodTeacherValues = miniPeriodTeacherValues();
        const isMultiPeriod = (session?.periods || []).length > 1;
        const savingSessionId = session.session_id;
        const savingSourceIds = Array.isArray(session.source_cell_ids) ? session.source_cell_ids.slice() : [];
        viewState.miniSaving = true;
        viewState.miniError = '';
        viewState.miniNotice = '';
        try {
            for (const [rowIndex, row] of rows.entries()) {
                const rowId = normalizeKey(row?.id || row?.cell_id || '');
                if (!rowId) continue;
                const rowExistingDayTeachers = existingRowDayTeachers(row);
                const rowDayTeachers = teacherValuesForRow(
                    row,
                    rowIndex,
                    periodTeacherValues,
                    isMultiPeriod ? null : dayTeachers,
                    { isMultiPeriod, existingRowDayTeachers: rowExistingDayTeachers }
                );
                const isSplitSourcePeriod = isMultiPeriod && (
                    rows.length < (session?.periods || []).length ||
                    periodTeacherValues.ambiguousSourceCellIds?.has(rowId)
                );
                const metaDayTeachers = isSplitSourcePeriod ? rowExistingDayTeachers : rowDayTeachers;
                const day = normalizeDay(row.day || row.day_label || row.day_of_week || '');
                const isWeekdayRow = DAY_ORDER.slice(0, 5).includes(day);
                const teachers = isWeekdayRow ? (rowDayTeachers[day] || getTeacherNames(row)) : getTeacherNames(row);
                const homeroomTeacher = normalizeKey(session.homeroom_teacher || getPrimaryTeacherName(row));
                const existingMeta = getRawMeta(row);
                const metaExtra = {
                    day_teachers: metaDayTeachers,
                    teacher_names_by_day: metaDayTeachers,
                    homeroom_teacher: homeroomTeacher
                };
                if (isMultiPeriod) {
                    metaExtra.period_day_teachers = {
                        ...(existingMeta?.period_day_teachers || {}),
                        ...(periodTeacherValues.periodDayTeachers || {})
                    };
                }
                const payload = {
                    period_label: isMultiPeriod ? (row.period_label || '') : (periodLabel || row.period_label || ''),
                    start_time: isMultiPeriod ? (row.start_time || '') : (startTime || row.start_time || ''),
                    end_time: isMultiPeriod ? (row.end_time || '') : (endTime || row.end_time || ''),
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
                    const fallbackTeachers = uniqueNames(Object.values(rowDayTeachers).flat());
                    payload.teacher_names = fallbackTeachers;
                    payload.teacher_name_raw = fallbackTeachers.join(', ');
                }
                await window.EieApi.updateTimetableCell(rowId, payload);
            }
            await refreshTimetableRowsAfterMiniSave();
            viewState.classPanelMode = 'detail';
        } catch (error) {
            viewState.miniError = error?.message || '저장 실패';
            viewState.miniNotice = '';
        } finally {
            viewState.miniSaving = false;
            reopenPanelMountRoute();
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
            const assignOps = cellIds.map(cellIdValue => ({ cell_id: cellIdValue, student_id: studentId }));
            await batchCellStudentOps(cellIds[0], { assign: assignOps });
            await refreshTimetableRowsAfterMiniSave();
            closeTimetableDetailPanel();
        } catch (error) {
            viewState.miniError = error?.message || '저장 실패';
        } finally {
            viewState.miniSaving = false;
            reopenPanelMountRoute();
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
            const removeOps = cellIds.map(cellIdValue => ({ cell_id: cellIdValue, student_id: sid }));
            await batchCellStudentOps(cellIds[0], { remove: removeOps });
            await refreshTimetableRowsAfterMiniSave();
            closeTimetableDetailPanel();
        } catch (error) {
            viewState.miniError = error?.message || '저장 실패';
        } finally {
            viewState.miniSaving = false;
            reopenPanelMountRoute();
            clearMiniNoticeLater(2000);
        }
    }

    async function saveNewStudentToMiniClassroom() {
        if (viewState.miniSaving) return;
        const session = selectedSessionRecord();
        const nameEl = document.getElementById('eie-v2-new-student-name');
        const gradeEl = document.getElementById('eie-v2-new-student-grade');
        const schoolEl = document.getElementById('eie-v2-new-student-school');
        const phoneEl = document.getElementById('eie-v2-new-student-phone');
        const parentEl = document.getElementById('eie-v2-new-student-parent');
        const name = normalizeKey(nameEl?.value || '');
        if (!name) {
            viewState.miniAddStudentError = '학생명을 입력해 주세요.';
            reopenPanelMountRoute();
            return;
        }
        if (!window.EieApi?.createStudent) {
            viewState.miniAddStudentError = 'API를 사용할 수 없습니다.';
            reopenPanelMountRoute();
            return;
        }
        viewState.miniSaving = true;
        viewState.miniAddStudentError = '';
        viewState.miniError = '';
        viewState.miniNotice = '';
        try {
            const payload = {
                name,
                display_name: name,
                grade: normalizeGrade(gradeEl?.value || ''),
                school_name: normalizeKey(schoolEl?.value || ''),
                phone: normalizeKey(phoneEl?.value || ''),
                parent_phone: normalizeKey(parentEl?.value || ''),
                status: 'active'
            };
            const created = await window.EieApi.createStudent(payload);
            const newId = normalizeKey(created?.id || created?.data?.id || created?.student?.id || '');
            const cellIds = Array.isArray(session?.source_cell_ids) ? session.source_cell_ids.filter(Boolean) : [];
            if (newId && cellIds.length) {
                const assignOps = cellIds.map(cellId => ({ cell_id: cellId, student_id: newId }));
                await batchCellStudentOps(cellIds[0], { assign: assignOps }).catch(() => null);
            }
            if (window.EieApmsState?.loadFoundation) await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
            await refreshTimetableRowsAfterMiniSave();
            viewState.miniAddStudentMode = false;
            closeTimetableDetailPanel();
        } catch (error) {
            viewState.miniAddStudentError = error?.message || '등록 실패';
        } finally {
            viewState.miniSaving = false;
            reopenPanelMountRoute();
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
            if (cellIds.length) {
                const removeOps = cellIds.map(cellIdValue => ({ cell_id: cellIdValue, student_id: sid }));
                await batchCellStudentOps(cellIds[0], { remove: removeOps }).catch(() => null);
            }
            if (window.EieApmsState?.loadFoundation) await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
            await refreshTimetableRowsAfterMiniSave();
            closeTimetableDetailPanel();
        } catch (error) {
            viewState.miniError = error?.message || '퇴원 처리에 실패했습니다.';
        } finally {
            viewState.miniSaving = false;
            reopenPanelMountRoute();
            clearMiniNoticeLater(2000);
        }
    }

    function refresh() {
        closeTimetableDetailPanel();
        return reopenPanelMountRoute();
    }

    function openWithContext(returnCtx) {
        const ctx = returnCtx || {};
        viewState.selectedDay = normalizeKey(ctx.selectedDay || ctx.day || viewState.selectedDay);
        viewState.selectedSessionId = normalizeKey(ctx.sessionId || ctx.session_id || viewState.selectedSessionId);
        viewState.classPanelMode = normalizeKey(ctx.classPanelMode || ctx.class_panel_mode || viewState.classPanelMode || 'detail') || 'detail';
        return reopenPanelMountRoute();
    }

    async function openStudentWithContext(returnCtx) {
        const ctx = returnCtx || {};
        viewState.selectedDay = normalizeKey(ctx.selectedDay || ctx.day || viewState.selectedDay);
        viewState.selectedSessionId = normalizeKey(ctx.sessionId || ctx.session_id || viewState.selectedSessionId);
        const previousStudentId = normalizeKey(viewState.selectedStudentId);
        viewState.selectedStudentId = normalizeKey(ctx.studentId || ctx.student_id || '');
        viewState.selectedStudentName = normalizeStudentName(ctx.studentName || ctx.student_name || '');
        viewState.studentPanelMode = normalizeKey(ctx.studentPanelMode || ctx.student_panel_mode || 'detail') || 'detail';
        viewState.studentDetailTab = normalizeKey(ctx.studentDetailTab || ctx.student_detail_tab || '') || 'basic';
        viewState.studentError = '';
        viewState.studentNotice = '';
        if (previousStudentId !== viewState.selectedStudentId) {
            viewState.studentConsultationLoadedId = '';
            viewState.studentConsultationRows = [];
            viewState.studentConsultationSelectedId = '';
            viewState.studentConsultationFormOpen = false;
            viewState.studentConsultationEditingId = '';
        }
        if (viewState.selectedStudentId && window.EieApmsState?.loadFoundation) {
            await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
        }
        if (viewState.selectedStudentId) {
            await loadStudentConsultationsForPanel(viewState.selectedStudentId).catch(() => null);
        }
        return reopenPanelMountRoute();
    }


    async function renderPanelOnlyWithContext(returnCtx) {
        bindEvents();
        const ctx = returnCtx || {};
        viewState.panelMountRoute = normalizeKey(ctx.mountRoute || ctx.mount_route || ctx.route || 'timetable') || 'timetable';
        const { rows } = await loadRows();
        const sessions = buildDisplaySessions(rows);
        lastRenderedSessions = sessions;

        const cellId = normalizeKey(ctx.cellId || ctx.cell_id || '');
        let selectedSession = null;

        if (ctx.sessionId || ctx.session_id) {
            const wantedSessionId = normalizeKey(ctx.sessionId || ctx.session_id || '');
            selectedSession = sessions.find(session => session.session_id === wantedSessionId) || null;
        }

        if (!selectedSession && cellId) {
            selectedSession = sessions.find(session => {
                if (!session) return false;
                if (normalizeKey(session.session_id) === cellId) return true;
                const sourceIds = Array.isArray(session.source_cell_ids) ? session.source_cell_ids : [];
                if (sourceIds.map(normalizeKey).includes(cellId)) return true;
                const rows = Array.isArray(session.source_rows) ? session.source_rows : [];
                return rows.some(row => normalizeKey(row && row.id) === cellId);
            }) || null;
        }

        if (ctx.selectedDay || ctx.day) {
            viewState.selectedDay = normalizeKey(ctx.selectedDay || ctx.day);
        } else if (selectedSession && selectedSession.day_label) {
            viewState.selectedDay = normalizeKey(selectedSession.day_label);
        }

        viewState.selectedSessionId = selectedSession ? normalizeKey(selectedSession.session_id) : normalizeKey(ctx.sessionId || ctx.session_id || '');
        viewState.classPanelMode = normalizeKey(ctx.classPanelMode || ctx.class_panel_mode || 'detail') || 'detail';
        if (ctx.classAttendanceOpen || ctx.class_attendance_open) {
            viewState.classAttendanceSessionId = selectedSession ? selectedSession.session_id : viewState.selectedSessionId;
        } else if (ctx.classAttendanceSessionId || ctx.class_attendance_session_id) {
            viewState.classAttendanceSessionId = normalizeKey(ctx.classAttendanceSessionId || ctx.class_attendance_session_id || '');
        } else if (viewState.classAttendanceSessionId && viewState.classAttendanceSessionId !== viewState.selectedSessionId) {
            viewState.classAttendanceSessionId = '';
        }
        const nextStudentId = normalizeKey(ctx.studentId || ctx.student_id || '');
        const sameStudentPanel = nextStudentId && nextStudentId === normalizeKey(viewState.selectedStudentId);
        viewState.selectedStudentId = nextStudentId;
        viewState.selectedStudentName = normalizeStudentName(ctx.studentName || ctx.student_name || '');
        viewState.studentPanelMode = normalizeKey(ctx.studentPanelMode || ctx.student_panel_mode || 'detail') || 'detail';
        viewState.studentDetailTab = normalizeKey(ctx.studentDetailTab || ctx.student_detail_tab || viewState.studentDetailTab || 'basic') || 'basic';
        if (!sameStudentPanel) {
            viewState.studentError = '';
            viewState.studentNotice = '';
            viewState.studentDetailTab = normalizeKey(ctx.studentDetailTab || ctx.student_detail_tab || '') || 'basic';
            viewState.studentConsultationLoadedId = '';
            viewState.studentConsultationRows = [];
            viewState.studentConsultationSelectedId = '';
            viewState.studentConsultationFormOpen = false;
            viewState.studentConsultationEditingId = '';
        }
        if (viewState.panelMountRoute === 'classroom' && selectedSession) {
            viewState.classAttendanceSessionId = selectedSession.session_id;
        }

        if (viewState.selectedStudentId && window.EieApmsState?.loadFoundation) {
            await window.EieApmsState.loadFoundation({ force: true }).catch(() => null);
        }
        if (viewState.selectedStudentId) {
            await loadStudentConsultationsForPanel(viewState.selectedStudentId).catch(() => null);
        }

        const panel = renderSelectedPanel(selectedSession);
        return panel
            ? '<div class="eie-classroom-borrowed-panel eie-v2-screen" data-eie-classroom-borrowed-panel="timetable">' + panel + '</div>'
            : '';
    }

    async function render() {
        bindEvents();
        viewState.panelMountRoute = 'timetable';
        const { rows, error } = await loadRows();
        const rowsForDisplay = viewState.editMode && Array.isArray(viewState.editCreates) && viewState.editCreates.length
            ? rows.concat(viewState.editCreates)
            : rows;
        const sessions = buildDisplaySessions(rowsForDisplay);
        lastRenderedSessions = sessions;

        if (viewState.repairMode) {
            if (!viewState.repairPreview) {
                viewState.repairPreview = buildTimetableValidationPreview(sessions);
            }
            return `
                <section class="eie-v2-screen" aria-labelledby="eie-v2-title">
                    ${renderHeader(error)}
                    <div class="eie-v2-layout is-full">
                        <div class="eie-v2-main">
                            ${renderTimetableValidationPanel(viewState.repairPreview)}
                        </div>
                    </div>
                </section>
            `;
        }

        const selectedSession = sessions.find(session => session.session_id === viewState.selectedSessionId) || null;
        const selectedPanel = renderSelectedPanel(selectedSession);
        const hasPanel = !!selectedPanel;
        const shouldShowDayOverlay = Boolean(viewState.activeDayOverlay) && !viewState.editMode && !viewState.repairMode;
        return `
            <section class="eie-v2-screen" aria-labelledby="eie-v2-title">
                ${renderHeader(error)}
                <div class="eie-v2-layout ${hasPanel ? 'has-panel' : 'is-full'}">
                    <div class="eie-v2-main">
                        ${shouldShowDayOverlay ? renderDayTeacherOverlay(sessions, viewState.activeDayOverlay) : ''}
                        ${renderBoard(sessions)}
                    </div>
                    ${selectedPanel}
                </div>
            </section>
        `;
    }

    window.EieTimetableView = {
        render,
        refresh,
        openWithContext,
        openStudentWithContext,
        renderPanelOnlyWithContext,
        _buildDisplaySessions: buildDisplaySessions,
        _buildDayTeacherSessions: buildDayTeacherSessions,
        _buildTimetableValidationPreview: buildTimetableValidationPreview
    };
})();
