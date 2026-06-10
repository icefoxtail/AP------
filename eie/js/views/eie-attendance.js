(function () {
    const DAY_ORDER = ['월', '화', '수', '목', '금'];
    const WEEKDAY_BY_INDEX = ['일', '월', '화', '수', '목', '금', '토'];
    const PRIMARY_TEACHERS = ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily'];

    const STATUS_PRESENT = '등원';
    const STATUS_ABSENT = '결석';
    const STATUS_NO_CLASS = '수업 없음';
    const TAG_COUNSEL = '상담';
    const TAG_MAKEUP = '보강';
    const TAG_LATE = '지각';
    const ALL_TAGS = [TAG_COUNSEL, TAG_MAKEUP, TAG_LATE];
    const ATTENDANCE_START_DATE = '2026-06-01';

    let _cells = [];
    let _cellsLoaded = false;
    let _loadError = '';
    let _sessionByCellId = {};
    let _filterTeacher = '';
    let _filterClass = '';
    let _filterGrade = '';
    let _scopeMode = '';

    function esc(value) {
        return window.EieApp && EieApp.escapeHtml
            ? EieApp.escapeHtml(value)
            : String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
            }[ch]));
    }

    function text(value) { return String(value == null ? '' : value).trim(); }
    function jsArg(value) { return esc(JSON.stringify(String(value == null ? '' : value))); }
    function att() { const s = window.EieState ? EieState.get() : null; return s ? s.attendance : null; }
    function tKey(value) {
        if (window.EieClassroomScope && EieClassroomScope.teacherKey) return EieClassroomScope.teacherKey(value);
        return text(value).replace(/\s+/g, '').toLowerCase();
    }
    function currentSession() {
        if (window.EieClassroomScope && EieClassroomScope.currentSession) return EieClassroomScope.currentSession();
        return { teacherName: '', role: '', loginId: '' };
    }
    function isOwner() {
        const s = currentSession();
        if (window.EieClassroomScope && EieClassroomScope.isDirector) return EieClassroomScope.isDirector(s.role, s.loginId);
        return ['admin', 'owner'].includes(text(s.role).toLowerCase()) || text(s.loginId).toLowerCase() === 'admin';
    }

    function todayIso() { return new Date().toLocaleDateString('sv-SE'); }
    function currentDate() {
        const a = att();
        const date = a && a.viewDate ? a.viewDate : '';
        return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayIso();
    }
    function weekdayOf(date) {
        const d = new Date(String(date) + 'T00:00:00');
        return Number.isNaN(d.getTime()) ? '' : WEEKDAY_BY_INDEX[d.getDay()];
    }
    function getMonthDays(month) {
        const [year, mon] = String(month || '').split('-').map(Number);
        if (!year || !mon) return [];
        const endDay = new Date(year, mon, 0).getDate();
        const out = [];
        for (let day = 1; day <= endDay; day += 1) out.push(`${month}-${String(day).padStart(2, '0')}`);
        return out;
    }
    function dayStyle(date) {
        const wd = weekdayOf(date);
        if (wd === '토') return 'color:#0F766E;';
        if (wd === '일') return 'color:#E8414F;';
        return '';
    }

    function asRows(result) {
        if (Array.isArray(result && result.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result && result.cells)) return result.cells;
        if (Array.isArray(result && result.data)) return result.data;
        return [];
    }
    function studentIdOf(student) {
        return text(student && (student.student_id || student.confirmed_student_id
            || student.matched_student_id || student.canonical_student_id || student.id));
    }
    function studentName(student) {
        return text(student && (student.name || student.display_name || student.student_name_raw)) || '학생';
    }
    function studentGrade(student) { return text(student && (student.grade || student.grade_raw)); }
    function studentRaw(student) {
        if (student && student.raw && typeof student.raw === 'object') return student.raw;
        const raw = student && student.raw_meta_json;
        if (!raw) return {};
        if (typeof raw === 'object') return raw;
        try {
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }
    function isPausedStudent(student) {
        const raw = studentRaw(student);
        const status = text(student && (student.status || student.student_status || student.match_status || raw.status)).toLowerCase();
        const type = text(student && (student.type || student.student_type || raw.type || raw.student_type));
        const memo = text(student && (student.memo || raw.memo));
        return ['paused', 'on_leave', 'leave', '휴원'].includes(status)
            || type.indexOf('휴원') >= 0
            || memo.indexOf('#휴원') >= 0;
    }
    function gradeBand(grade) {
        const g = text(grade);
        if (g.indexOf('초') === 0) return '초';
        if (g.indexOf('중') === 0) return '중';
        if (g.indexOf('고') === 0) return '고';
        return '';
    }

    function buildSessions() {
        if (!window.EieTimetableView || typeof EieTimetableView._buildDisplaySessions !== 'function') return [];
        try { return EieTimetableView._buildDisplaySessions(_cells) || []; }
        catch (error) { return []; }
    }
    function sessionCellId(s) {
        const ids = Array.isArray(s && s.source_cell_ids) ? s.source_cell_ids : [];
        return text(ids[0]) || text(s && s.session_id);
    }
    function sessionStudents(s) { return Array.isArray(s && s.students) ? s.students : []; }

    function accessTeacherKeysForSession(session, teacherName) {
        const values = [
            teacherName,
            session && session.teacherName,
            session && session.teacher_name,
            session && session.teacher_key,
            session && session.homeroom_teacher,
            session && session.homeroomTeacher,
            session && session.homeroom_key,
            session && session.source_session && session.source_session.homeroom_teacher,
            session && session.source_session && session.source_session.homeroom_key,
            session && session.source_session && session.source_session.teacher_name,
            session && session.source_session && session.source_session.teacher_name_raw
        ];
        return values.map(tKey).filter(Boolean);
    }

    function parseRawMeta(value) {
        if (!value) return {};
        if (typeof value === 'object') return value;
        try { return JSON.parse(String(value)); }
        catch (error) { return {}; }
    }

    function explicitHomeroomValue(source) {
        if (!source) return '';
        const direct = text(source.homeroom_teacher || source.homeroomTeacher || source.homeroom_key);
        if (direct) return direct;
        const meta = parseRawMeta(source.raw_meta_json || source.rawMetaJson || source.meta);
        return text(meta.homeroom_teacher || meta.homeroomTeacher || meta.homeroom_key);
    }

    function explicitHomeroomFromSession(session) {
        const source = session && session.source_session;
        const sourceRows = []
            .concat(Array.isArray(source && source.source_rows) ? source.source_rows : [])
            .concat(Array.isArray(session && session.source_rows) ? session.source_rows : []);
        for (const row of sourceRows) {
            const value = explicitHomeroomValue(row);
            if (value) return value;
        }
        const sourceValue = explicitHomeroomValue(source);
        if (sourceValue) return sourceValue;
        return source ? '' : explicitHomeroomValue(session);
    }

    function homeroomTeacherKeyForSession(session) {
        return tKey(explicitHomeroomFromSession(session));
    }
    function teachingTeacherKeyForSession(session, teacherName) {
        return tKey(teacherName || session && (session.teacher_key || session.teacherName || session.teacher_name));
    }

    function periodTimeRange(period, session) {
        const explicit = text(period && period.display_time_range);
        if (explicit) return explicit;
        const start = text(period && (period.start_time || period.startTime));
        const end = text(period && (period.end_time || period.endTime));
        if (start && end) return start + '~' + end;
        return text(session && session.display_time_range);
    }

    function periodEntries(session) {
        const periods = Array.isArray(session && session.periods) ? session.periods : [];
        if (!periods.length) return [session || {}];
        return periods.map((period, index) => ({
            ...period,
            source_cell_id: text(period && period.source_cell_id)
                || text((Array.isArray(session.source_cell_ids) ? session.source_cell_ids : [])[index])
                || sessionCellId(session),
            day_teachers: period && period.day_teachers ? period.day_teachers : (session && session.day_teachers),
            period_order: Number(period && (period.period_order || period.periodOrder || 0)) || Number(session && session.period_order || 0),
            period_label: text(period && (period.period_label || period.periodLabel)) || text(session && session.period_label),
            display_time_range: periodTimeRange(period, session)
        }));
    }

    function dayTeacherSessions(displaySessions, day) {
        if (window.EieTimetableView && typeof EieTimetableView._buildDayTeacherSessions === 'function') {
            try {
                return EieTimetableView._buildDayTeacherSessions(displaySessions || [], day) || [];
            } catch (error) {
                return [];
            }
        }
        return null;
    }

    function fallbackBlocksFromDisplaySessions(sessions, selectedWeekday) {
        const blocks = [];
        sessions.forEach(s => {
            const cellId = sessionCellId(s);
            if (cellId && !_sessionByCellId[cellId]) _sessionByCellId[cellId] = s;
            periodEntries(s).forEach(period => {
                const byTeacher = {};
                DAY_ORDER.forEach(day => {
                    ((period.day_teachers && period.day_teachers[day]) || []).map(text).filter(Boolean).forEach(name => {
                        const k = tKey(name);
                        if (!byTeacher[k]) byTeacher[k] = { name, days: [] };
                        if (byTeacher[k].days.indexOf(day) < 0) byTeacher[k].days.push(day);
                    });
                });
                Object.keys(byTeacher).forEach(k => {
                    const teacher = byTeacher[k];
                    if (teacher.days.indexOf(selectedWeekday) < 0) return;
                    blocks.push({
                        teacherKey: k,
                        teacherName: teacher.name,
                        accessTeacherKeys: accessTeacherKeysForSession(s, teacher.name),
                        homeroomTeacherKey: homeroomTeacherKeyForSession(s),
                        teachingTeacherKeys: [teachingTeacherKeyForSession(s, teacher.name)].filter(Boolean),
                        cellId: text(period.source_cell_id) || cellId,
                        classDays: teacher.days.slice(),
                        periodOrder: Number(period.period_order || 0),
                        periodLabel: text(period.period_label) || (period.period_order ? `${period.period_order}교시` : ''),
                        timeRange: text(period.display_time_range),
                        className: text(s.material || s.class_name || s.class_full_name) || '수업명 없음',
                        students: sessionStudents(s)
                    });
                });
            });
        });
        return blocks;
    }

    function blocksFromDayTeacherSessions(daySessions, selectedWeekday) {
        const blocks = [];
        (daySessions || []).forEach(session => {
            const sessionIds = Array.isArray(session && session.source_cell_ids) ? session.source_cell_ids : [];
            const periods = periodEntries(session);
            periods.forEach((period, index) => {
                const cellId = text(period.source_cell_id)
                    || text(sessionIds[index])
                    || sessionCellId(session);
                if (cellId && !_sessionByCellId[cellId]) _sessionByCellId[cellId] = session;
                blocks.push({
                    teacherKey: tKey(session && (session.teacher_key || session.teacherName || session.teacher_name)),
                    teacherName: text(session && (session.teacherName || session.teacher_name)) || text(period && period.teacherName),
                    accessTeacherKeys: accessTeacherKeysForSession(session, text(session && (session.teacherName || session.teacher_name)) || text(period && period.teacherName)),
                    homeroomTeacherKey: homeroomTeacherKeyForSession(session),
                    teachingTeacherKeys: [teachingTeacherKeyForSession(session, text(session && (session.teacherName || session.teacher_name)) || text(period && period.teacherName))].filter(Boolean),
                    cellId,
                    classDays: [selectedWeekday],
                    periodOrder: Number(period.period_order || session.period_order || 0),
                    periodLabel: text(period.period_label || session.period_label) || (period.period_order ? `${period.period_order}교시` : ''),
                    timeRange: text(period.display_time_range) || periodTimeRange(period, session),
                    className: text(session && (session.material || session.class_name || session.class_full_name)) || '수업명 없음',
                    students: sessionStudents(session)
                });
            });
        });
        return blocks.filter(block => block.teacherName);
    }

    function buildBlocks(selectedWeekday) {
        const sessions = buildSessions();
        _sessionByCellId = {};
        const helperSessions = dayTeacherSessions(sessions, selectedWeekday);
        const blocks = Array.isArray(helperSessions)
            ? blocksFromDayTeacherSessions(helperSessions, selectedWeekday)
            : fallbackBlocksFromDisplaySessions(sessions, selectedWeekday);
        return blocks.sort((a, b) => {
            if (a.periodOrder !== b.periodOrder) return a.periodOrder - b.periodOrder;
            return a.className.localeCompare(b.className, 'ko', { numeric: true });
        });
    }

    function blockKey(block) {
        return [
            block.cellId || '',
            block.periodOrder || '',
            block.className || ''
        ].join('|');
    }

    function buildMonthBlocks() {
        const byKey = {};
        DAY_ORDER.forEach(day => {
            buildBlocks(day).forEach(block => {
                const key = blockKey(block);
                if (!byKey[key]) {
                    byKey[key] = { ...block, classDays: [] };
                }
                const accessKeys = Array.isArray(block.accessTeacherKeys) ? block.accessTeacherKeys : [];
                byKey[key].accessTeacherKeys = Array.from(new Set([...(byKey[key].accessTeacherKeys || []), ...accessKeys]));
                if (block.teacherKey && byKey[key].accessTeacherKeys.indexOf(block.teacherKey) < 0) byKey[key].accessTeacherKeys.push(block.teacherKey);
                const teachingKeys = Array.isArray(block.teachingTeacherKeys) ? block.teachingTeacherKeys : [];
                byKey[key].teachingTeacherKeys = Array.from(new Set([...(byKey[key].teachingTeacherKeys || []), ...teachingKeys]));
                if (!byKey[key].homeroomTeacherKey && block.homeroomTeacherKey) byKey[key].homeroomTeacherKey = block.homeroomTeacherKey;
                (block.classDays || [day]).forEach(classDay => {
                    if (byKey[key].classDays.indexOf(classDay) < 0) byKey[key].classDays.push(classDay);
                });
                if (!byKey[key].students.length && block.students.length) byKey[key].students = block.students;
            });
        });
        return Object.keys(byKey).map(key => byKey[key]).sort((a, b) => {
            if (a.periodOrder !== b.periodOrder) return a.periodOrder - b.periodOrder;
            const teacherCompare = a.teacherName.localeCompare(b.teacherName, 'ko', { numeric: true });
            if (teacherCompare) return teacherCompare;
            return a.className.localeCompare(b.className, 'ko', { numeric: true });
        });
    }

    function teacherRoster() {
        const seen = {};
        const names = [];
        const sessions = buildSessions();
        DAY_ORDER.forEach(day => {
            const helperSessions = dayTeacherSessions(sessions, day);
            if (Array.isArray(helperSessions)) {
                helperSessions.forEach(session => {
                    const name = text(session && (session.teacherName || session.teacher_name));
                    const k = tKey(session && (session.teacher_key || name));
                    if (name && !seen[k]) { seen[k] = true; names.push(name); }
                });
                return;
            }
            fallbackBlocksFromDisplaySessions(sessions, day).forEach(block => {
                const k = tKey(block.teacherName);
                if (block.teacherName && !seen[k]) { seen[k] = true; names.push(block.teacherName); }
            });
        });
        return names.sort((a, b) => {
            const ai = PRIMARY_TEACHERS.indexOf(a), bi = PRIMARY_TEACHERS.indexOf(b);
            if (ai >= 0 || bi >= 0) { if (ai < 0) return 1; if (bi < 0) return -1; return ai - bi; }
            return a.localeCompare(b, 'ko');
        });
    }

    function applyFilters(blocks) {
        let rows = blocks.slice();
        if (_filterTeacher) {
            const key = tKey(_filterTeacher);
            const owner = isOwner();
            const mode = _scopeMode || (owner ? 'homeroom' : 'teaching');
            if (mode === 'homeroom') {
                rows = rows.filter(b => b.homeroomTeacherKey === key);
            } else if (mode === 'teaching') {
                rows = rows.filter(b => {
                    const keys = Array.isArray(b.teachingTeacherKeys) ? b.teachingTeacherKeys : [];
                    return keys.indexOf(key) >= 0;
                });
            } else {
                // 원장 화면에서 선생님을 선택했을 때 출석 기록이 있다는 이유만으로
                // 다른 선생님 반까지 섞이지 않게 한다. 전체/담당 범위는 시간표 접근 키 기준이다.
                rows = rows.filter(b => blockHasTeacherAccess(b, key));
            }
        }
        if (_filterClass) rows = rows.filter(b => b.className === _filterClass);
        if (_filterGrade) {
            rows = rows.map(b => ({
                ...b,
                students: b.students.filter(st => gradeBand(studentGrade(st)) === _filterGrade)
            })).filter(b => b.students.length);
        }
        return rows;
    }

    function blockHasTeacherAccess(block, teacherKey) {
        if (!teacherKey) return true;
        const keys = Array.isArray(block && block.accessTeacherKeys) ? block.accessTeacherKeys : [];
        return keys.indexOf(teacherKey) >= 0 || tKey(block && block.teacherName) === teacherKey || tKey(block && block.teacherKey) === teacherKey;
    }

    function blockHasAnyAttendanceRecord(block) {
        const month = currentDate().slice(0, 7);
        const data = EieState.getAttendanceMonthData(month) || [];
        const cellId = text(block && block.cellId);
        const studentIds = {};
        (block && Array.isArray(block.students) ? block.students : []).forEach(st => {
            const id = studentIdOf(st);
            if (id) studentIds[id] = true;
        });
        return data.some(row => {
            if (text(row && row.timetable_cell_id || row && row.cell_id) !== cellId) return false;
            const sid = text(row && row.student_id);
            return !sid || studentIds[sid];
        });
    }

    function studentRecord(date, cellId, sid) {
        const id = String(sid || '');
        return EieState.getAttendanceForCellDate(date, cellId)
            .find(row => String(row && row.student_id) === id) || null;
    }

    function marksHtml(tags) {
        const t = Array.isArray(tags) ? tags : [];
        const parts = [];
        if (t.indexOf(TAG_COUNSEL) >= 0) parts.push('<span class="eie-att-mk eie-att-mk-star">' + iconSvg('star', '상담') + '</span>');
        if (t.indexOf(TAG_MAKEUP) >= 0) parts.push('<span class="eie-att-mk eie-att-mk-square">' + iconSvg('square', '보강') + '</span>');
        if (t.indexOf(TAG_LATE) >= 0) parts.push('<span class="eie-att-mk eie-att-mk-tri">' + iconSvg('tri', '지각') + '</span>');
        return parts.length ? '<span class="eie-att-marks">' + parts.join('') + '</span>' : '';
    }

    function iconSvg(kind, label) {
        const aria = esc(label);
        if (kind === 'present') {
            return '<svg class="eie-att-icon" viewBox="0 0 16 16" role="img" aria-label="' + aria + '"><circle cx="8" cy="8" r="5.25"></circle></svg>';
        }
        if (kind === 'absent') {
            return '<svg class="eie-att-icon" viewBox="0 0 16 16" role="img" aria-label="' + aria + '"><path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"></path></svg>';
        }
        if (kind === 'noclass') {
            return '<svg class="eie-att-icon" viewBox="0 0 16 16" role="img" aria-label="' + aria + '"><path d="M4 8h8"></path></svg>';
        }
        if (kind === 'star') {
            return '<svg class="eie-att-icon" viewBox="0 0 16 16" role="img" aria-label="' + aria + '"><path d="M8 2.4 9.7 5.8l3.8.6-2.8 2.7.7 3.8L8 11.1l-3.4 1.8.7-3.8-2.8-2.7 3.8-.6L8 2.4Z"></path></svg>';
        }
        if (kind === 'square') {
            return '<svg class="eie-att-icon" viewBox="0 0 16 16" role="img" aria-label="' + aria + '"><rect x="4" y="4" width="8" height="8" rx="1.5"></rect></svg>';
        }
        return '<svg class="eie-att-icon" viewBox="0 0 16 16" role="img" aria-label="' + aria + '"><path d="M8 3 13 12.5H3L8 3Z"></path></svg>';
    }

    function gridCellInner(rec) {
        const status = rec ? text(rec.status) : '';
        let main, marks = '';
        if (status === STATUS_ABSENT) {
            main = '<span class="eie-att-o-x">' + iconSvg('absent', '결석') + '</span>';
        } else if (status === STATUS_NO_CLASS) {
            main = '<span class="eie-att-no">' + iconSvg('noclass', '수업 없음') + '</span>';
        } else {
            main = '<span class="eie-att-o-o">' + iconSvg('present', '등원') + '</span>';
            marks = marksHtml(rec ? text(rec.tags).split(',').map(text).filter(Boolean) : []);
        }
        return '<span class="eie-att-cellbox"><span class="eie-att-main">' + main + '</span>' + marks + '</span>';
    }

    function renderLegend() {
        return '<div class="eie-att-legend" aria-label="기호 범례">'
            + '<span class="eie-att-legend-item"><b class="eie-att-o-o">' + iconSvg('present', '등원') + '</b> 등원</span>'
            + '<span class="eie-att-legend-item"><b class="eie-att-o-x">' + iconSvg('absent', '결석') + '</b> 결석</span>'
            + '<span class="eie-att-legend-item"><b class="eie-att-no">' + iconSvg('noclass', '수업 없음') + '</b> 수업 없음</span>'
            + '<span class="eie-att-legend-item"><b class="eie-att-mk-star">' + iconSvg('star', '상담') + '</b> 상담</span>'
            + '<span class="eie-att-legend-item"><b class="eie-att-mk-square">' + iconSvg('square', '보강') + '</b> 보강</span>'
            + '<span class="eie-att-legend-item"><b class="eie-att-mk-tri">' + iconSvg('tri', '지각') + '</b> 지각</span>'
            + '</div>';
    }

    function selectHtml(label, value, options, onchange) {
        return '<select class="eie-att-ctrl" aria-label="' + esc(label) + '" '
            + 'onchange="EieAttendanceView.' + onchange + '(this.value)">'
            + options.map(opt =>
                '<option value="' + esc(opt.value) + '"' + (String(opt.value) === String(value) ? ' selected' : '') + '>'
                + esc(opt.label) + '</option>').join('')
            + '</select>';
    }

    function modeButton(value, label, activeValue) {
        return '<button type="button" class="eie-att-mode' + (value === activeValue ? ' is-active' : '') + '" '
            + 'onclick="EieAttendanceView.setScopeMode(' + jsArg(value) + ')" aria-pressed="' + (value === activeValue ? 'true' : 'false') + '">'
            + esc(label) + '</button>';
    }

    function renderViewModes() {
        const owner = isOwner();
        const mode = _scopeMode || (owner ? 'homeroom' : 'teaching');
        if (owner) return '';
        return '<div class="eie-att-viewmodes" role="group" aria-label="출석부 보기">'
            + modeButton('homeroom', '담임반', mode)
            + modeButton('teaching', '수업반', mode)
            + '</div>';
    }

    function renderToolbar(date, blocks) {
        const monthLabel = Number(date.slice(5, 7)) + '월';
        const teacherOpts = [{ value: '', label: '전체 선생님' }]
            .concat(teacherRoster().map(n => ({ value: n, label: n })));
        const classSourceBlocks = isOwner() && _filterTeacher
            ? blocks.filter(b => b.homeroomTeacherKey === tKey(_filterTeacher))
            : blocks;
        const classNames = [];
        const seenC = {};
        classSourceBlocks.forEach(b => { if (!seenC[b.className]) { seenC[b.className] = true; classNames.push(b.className); } });
        const classOpts = [{ value: '', label: '전체 반' }].concat(classNames.sort((a, b) => a.localeCompare(b, 'ko')).map(c => ({ value: c, label: c })));
        const gradeOpts = [
            { value: '', label: '전체' },
            { value: '초', label: '초등부' },
            { value: '중', label: '중등부' },
            { value: '고', label: '고등부' }
        ];
        const ownerFilters = isOwner()
            ? selectHtml('선생님', _filterTeacher, teacherOpts, 'setTeacher')
                + selectHtml('학년', _filterGrade, gradeOpts, 'setGrade')
                + selectHtml('반', _filterClass, classOpts, 'setClass')
            : '';
        return '<div class="eie-att-toolbar">'
            + '<span class="eie-att-screen-title">출석부</span>'
            + '<input type="date" class="eie-att-ctrl eie-att-date-input" value="' + esc(date) + '" '
            + 'onchange="EieAttendanceView.setDate(this.value)" aria-label="기준 날짜">'
            + '<input type="month" class="eie-att-ctrl eie-att-month-input" value="' + esc(date.slice(0, 7)) + '" '
            + 'onchange="EieAttendanceView.setMonth(this.value)" aria-label="월 선택" title="' + esc(monthLabel) + '">'
            + '<button type="button" class="eie-att-ctrl eie-att-today-btn" onclick="EieAttendanceView.today()">오늘</button>'
            + renderViewModes()
            + ownerFilters
            + '<button type="button" class="eie-att-ctrl eie-att-print-btn" onclick="EieAttendanceView.print()">인쇄</button>'
            + '</div>';
    }

    function renderPrintHeader(date) {
        const month = date.slice(0, 7);
        const teacher = text(_filterTeacher) || text(currentSession().teacherName) || '전체';
        return '<div class="eie-att-print-head" aria-hidden="true">'
            + '<span>' + esc(month.slice(0, 4)) + '년 ' + esc(month.slice(5, 7)) + '월</span>'
            + '<strong>출석부</strong>'
            + '<span>' + esc(teacher) + '</span>'
            + '</div>';
    }

    function attendanceClassDaysLabel(block) {
        const rawDays = Array.isArray(block && block.classDays) ? block.classDays : [];
        const seen = {};
        const days = [];
        rawDays.map(text).filter(Boolean).forEach(day => {
            const compact = day.replace(/요일/g, '').trim();
            const resolved = DAY_ORDER.indexOf(compact) >= 0 ? compact : compact.slice(0, 1);
            if (resolved && !seen[resolved]) { seen[resolved] = true; days.push(resolved); }
        });
        days.sort((a, b) => {
            const ai = DAY_ORDER.indexOf(a);
            const bi = DAY_ORDER.indexOf(b);
            return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
        });
        return days.length ? days.join(' · ') : '';
    }

    function renderTimeCell(block) {
        const period = text(block && block.periodLabel) || '-';
        const timeRange = text(block && block.timeRange);
        const className = text(block && block.className);
        const daysLabel = attendanceClassDaysLabel(block);
        return '<td class="eie-att-time-nc" rowspan="' + esc(String(Math.max(1, block.students.length))) + '">'
            + '<div class="eie-att-block-card">'
            + '<span class="eie-att-block-period">' + esc(period) + '</span>'
            + (timeRange ? '<span class="eie-att-block-time">' + esc(timeRange) + '</span>' : '')
            + '<strong class="eie-att-block-class">' + esc(className || '수업명 없음') + '</strong>'
            + (daysLabel ? '<span class="eie-att-block-days">' + esc(daysLabel) + '</span>' : '')
            + '</div>'
            + '</td>';
    }

    function renderTable(date, blocks) {
        const month = date.slice(0, 7);
        const days = getMonthDays(month);
        const today = todayIso();
        const a = att();
        const headerCells = days.map(d => {
            const num = Number(d.slice(-2));
            const wd = weekdayOf(d);
            const sel = d === date ? ' eie-att-selcol' : '';
            return '<th class="eie-att-day-head' + sel + '" data-date="' + esc(d) + '" style="' + dayStyle(d) + '">'
                + '<span class="eie-att-dnum">' + num + '</span>'
                + '<span class="eie-att-dwd">' + esc(wd) + '</span></th>';
        }).join('');
        const emptyCols = days.map(() => '<td></td>').join('');
        const bodyRows = blocks.map(block => {
            const timeCell = renderTimeCell(block);
            const studentRows = block.students.map((st, studentIndex) => {
                const sid = studentIdOf(st);
                const paused = isPausedStudent(st);
                const cellsHtml = days.map(d => {
                    if (d > today) return '<td class="eie-att-dc eie-att-future"></td>';
                    if (d < ATTENDANCE_START_DATE) return '<td class="eie-att-dc eie-att-no-class"></td>';
                    const isClassDay = block.classDays.indexOf(weekdayOf(d)) >= 0;
                    const selCls = d === date ? ' eie-att-selcol' : '';
                    const rec = sid ? studentRecord(d, block.cellId, sid) : null;
                    if (paused) return '<td class="eie-att-dc eie-att-no-class' + selCls + '"><span class="eie-att-no">-</span></td>';
                    if (!isClassDay && !rec) return '<td class="eie-att-dc eie-att-no-class' + selCls + '"><span class="eie-att-no">-</span></td>';
                    if (!sid) return '<td class="eie-att-dc' + selCls + '"><span class="eie-att-no">-</span></td>';
                    const isSel = a && a.selectedDate === d && String(a.selectedCellId) === String(block.cellId) && String(a.selectedStudentId) === String(sid);
                    return '<td class="eie-att-dc eie-att-click' + selCls + (isSel ? ' is-selected' : '') + '" '
                        + 'onclick="EieAttendanceView.openStudent(' + jsArg(d) + ',' + jsArg(block.cellId) + ',' + jsArg(sid) + ')">'
                        + gridCellInner(rec) + '</td>';
                }).join('');
                const nm = studentName(st);
                const gr = studentGrade(st);
                return '<tr>' + (studentIndex === 0 ? timeCell : '')
                    + '<td class="eie-att-nc eie-att-student-nc">' + esc(nm)
                    + (gr ? '<small>' + esc(gr) + '</small>' : '') + '</td>' + cellsHtml + '</tr>';
            }).join('');
            const rows = studentRows || '<tr>' + timeCell + '<td class="eie-att-nc eie-att-student-nc">-</td>' + emptyCols + '</tr>';
            return '<tbody class="eie-att-block">' + rows + '</tbody>';
        }).join('');
        const empty = '<tbody class="eie-att-block"><tr><td colspan="' + (days.length + 2) + '" class="eie-att-empty">'
            + '선택한 날짜(' + esc(weekdayOf(date) || '주말') + ')에 표시할 수업이 없습니다.</td></tr></tbody>';
        return '<div class="eie-att-tbl-wrap"><table class="eie-att-grid">'
            + '<thead><tr><th class="eie-att-time-nc eie-att-time-corner">수업/시간</th><th class="eie-att-nc eie-att-corner">이름</th>' + headerCells + '</tr></thead>'
            + (bodyRows || empty) + '</table></div>';
    }

    function renderPad() {
        const a = att();
        if (!a || !a.selectedStudentId || !a.selectedCellId || !a.selectedDate) return '';
        const s = _sessionByCellId[a.selectedCellId];
        const student = s ? sessionStudents(s).find(st => studentIdOf(st) === String(a.selectedStudentId)) : null;
        const name = student ? studentName(student) : '학생';
        const className = s ? (text(s.material || s.class_name || s.class_full_name) || '수업') : '수업';
        const status = a.draftStatus;
        const tags = Array.isArray(a.draftTags) ? a.draftTags : [];
        const btn = (active, label, action, cls) =>
            '<button type="button" class="eie-att-pad-btn' + (cls ? ' ' + cls : '') + (active ? ' is-active' : '') + '" '
            + 'onclick="EieAttendanceView.pick(' + jsArg(action) + ')" aria-pressed="' + (active ? 'true' : 'false') + '">' + label + '</button>';
        return '<div class="eie-att-pad-backdrop" onclick="EieAttendanceView.closePad()"></div>'
            + '<aside class="eie-att-pad eie-p-card" aria-label="학생 출석 입력">'
            + '<div class="eie-att-pad-head"><strong>' + esc(name) + '</strong>'
            + '<span>' + esc(className) + ' · ' + esc(a.selectedDate) + '</span></div>'
            + '<div class="eie-att-pad-symbols">'
            + btn(status === STATUS_PRESENT, '○', 'present', 'is-present')
            + btn(status === STATUS_ABSENT, '×', 'absent', 'is-absent')
            + btn(status === STATUS_NO_CLASS, '-', 'noclass', 'is-noclass')
            + btn(tags.indexOf(TAG_COUNSEL) >= 0, '★', 'counsel', 'is-star')
            + btn(tags.indexOf(TAG_MAKEUP) >= 0, '■', 'makeup', 'is-square')
            + btn(tags.indexOf(TAG_LATE) >= 0, '▲', 'late', 'is-tri')
            + '</div>'
            + (a.error ? '<div class="eie-error-box">' + esc(a.error) + '</div>' : '')
            + '<button type="button" class="eie-att-pad-save" ' + (a.saving ? 'disabled' : '')
            + ' onclick="EieAttendanceView.save()">' + (a.saving ? '저장 중...' : '저장') + '</button>'
            + '</aside>';
    }

    async function ensureCells() {
        if (_cellsLoaded) return;
        try {
            const result = await EieApi.getTimetable(null, { status: 'active,imported' });
            _cells = result && result.fallback ? [] : asRows(result);
            _loadError = result && result.fallback ? '시간표 정보를 불러오지 못했습니다.' : '';
        } catch (error) {
            _cells = [];
            _loadError = '시간표 정보를 불러오지 못했습니다.';
        }
        _cellsLoaded = true;
    }
    async function ensureMonth(month) {
        if (EieState.getAttendanceMonthData(month)) return;
        EieState.setAttendanceLoadingMonth(month);
        try {
            const result = await EieApi.getAttendanceMonth(month);
            const rows = (result && (result.attendance_records || result.attendance || result.data)) || [];
            EieState.setAttendanceMonthData(month, Array.isArray(rows) ? rows : []);
        } catch (error) { EieState.setAttendanceMonthData(month, []); }
    }

    window.EieAttendanceView = {
        render: async function () {
            if (_filterTeacher === '' && !isOwner()) {
                const me = text(currentSession().teacherName);
                if (me) _filterTeacher = me;
            }
            const date = currentDate();
            const month = date.slice(0, 7);
            EieState.setAttendanceMonth(month);
            await ensureCells();
            await ensureMonth(month);
            const allBlocks = buildMonthBlocks();
            const blocks = applyFilters(allBlocks);
            const errorHtml = _loadError ? '<div class="eie-error-box">' + esc(_loadError) + '</div>' : '';
            return '<section class="eie-att-screen" aria-labelledby="eie-att-title">'
                + '<h1 id="eie-att-title" class="eie-sr-only">출석부</h1>'
                + errorHtml
                + renderPrintHeader(date)
                + renderToolbar(date, allBlocks)
                + renderLegend()
                + renderTable(date, blocks)
                + renderPad()
                + '</section>';
        },

        setDate: function (date) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(text(date))) EieState.setAttendanceViewDate(text(date));
            EieState.clearAttendanceCellSelection();
            EieRouter.open('attendance');
        },
        setMonth: function (month) {
            if (/^\d{4}-\d{2}$/.test(text(month))) EieState.setAttendanceViewDate(text(month) + '-01');
            EieState.clearAttendanceCellSelection();
            EieRouter.open('attendance');
        },
        setScopeMode: function (mode) {
            _scopeMode = text(mode);
            EieState.clearAttendanceCellSelection();
            EieRouter.open('attendance');
        },
        today: function () {
            EieState.setAttendanceViewDate(todayIso());
            EieState.clearAttendanceCellSelection();
            EieRouter.open('attendance');
        },
        openAll: function () {
            _filterTeacher = '';
            _filterClass = '';
            _filterGrade = '';
            if (isOwner()) _scopeMode = '';
            EieState.clearAttendanceCellSelection();
            EieRouter.open('attendance');
        },
        openTeacher: function (teacherName) {
            _filterTeacher = text(teacherName);
            _filterClass = '';
            _filterGrade = '';
            if (isOwner()) _scopeMode = _filterTeacher ? 'homeroom' : '';
            EieState.clearAttendanceCellSelection();
            EieRouter.open('attendance');
        },
        setTeacher: function (value) {
            _filterTeacher = text(value);
            if (isOwner()) {
                _scopeMode = _filterTeacher ? 'homeroom' : '';
                _filterClass = '';
            }
            EieState.clearAttendanceCellSelection();
            EieRouter.open('attendance');
        },
        setClass: function (value) { _filterClass = text(value); EieState.clearAttendanceCellSelection(); EieRouter.open('attendance'); },
        setGrade: function (value) { _filterGrade = text(value); EieState.clearAttendanceCellSelection(); EieRouter.open('attendance'); },
        print: function () { if (typeof window !== 'undefined' && window.print) window.print(); },

        openStudent: function (date, cellId, studentId) {
            const rec = studentRecord(text(date), text(cellId), text(studentId));
            const tags = rec ? text(rec.tags).split(',').map(text).filter(Boolean) : [];
            const status = rec ? (text(rec.status) || STATUS_PRESENT) : STATUS_PRESENT;
            EieState.setAttendanceStudentSelection(text(date), text(cellId), text(studentId));
            EieState.setAttendanceDraft(status, tags.filter(t => ALL_TAGS.indexOf(t) >= 0));
            EieRouter.open('attendance');
        },
        closePad: function () { EieState.clearAttendanceStudentSelection(); EieRouter.open('attendance'); },

        pick: function (action) {
            const a = att();
            if (!a) return;
            let status = a.draftStatus;
            let tags = Array.isArray(a.draftTags) ? a.draftTags.slice() : [];
            const toggle = tag => { const i = tags.indexOf(tag); if (i >= 0) tags.splice(i, 1); else tags.push(tag); };
            const clearsMain = st => st === STATUS_ABSENT || st === STATUS_NO_CLASS;
            if (action === 'present') {
                status = status === STATUS_PRESENT ? '' : STATUS_PRESENT;
            } else if (action === 'absent') {
                if (status === STATUS_ABSENT) status = '';
                else { status = STATUS_ABSENT; tags = []; }
            } else if (action === 'noclass') {
                if (status === STATUS_NO_CLASS) status = '';
                else { status = STATUS_NO_CLASS; tags = []; }
            } else if (action === 'counsel') {
                if (clearsMain(status)) status = STATUS_PRESENT;
                toggle(TAG_COUNSEL);
            } else if (action === 'makeup') {
                if (clearsMain(status)) status = STATUS_PRESENT;
                toggle(TAG_MAKEUP);
            } else if (action === 'late') {
                if (clearsMain(status)) status = STATUS_PRESENT;
                toggle(TAG_LATE);
            }
            EieState.setAttendanceDraft(status, tags);
            EieState.setAttendanceError('');
            EieRouter.open('attendance');
        },

        save: async function () {
            const a = att();
            if (!a || a.saving || !a.selectedStudentId || !a.selectedCellId || !a.selectedDate) return;
            const date = a.selectedDate, cellId = a.selectedCellId, studentId = a.selectedStudentId;
            const prev = studentRecord(date, cellId, studentId);
            EieState.setAttendanceSaving(true);
            EieState.setAttendanceError('');
            try {
                const result = await EieApi.saveAttendanceRecord({
                    student_id: studentId,
                    timetable_cell_id: cellId,
                    date,
                    status: a.draftStatus,
                    tags: (Array.isArray(a.draftTags) ? a.draftTags : []).join(','),
                    raw_meta_json: { source: 'eie-attendance' }
                });
                const record = (result && (result.attendance_record || result.data)) || null;
                EieState.applyAttendanceStudentResult(date, cellId, studentId, record);
                EieState.setAttendanceSaving(false);
                EieState.clearAttendanceStudentSelection();
                EieRouter.open('attendance');
            } catch (error) {
                EieState.applyAttendanceStudentResult(date, cellId, studentId, prev);
                EieState.setAttendanceSaving(false);
                EieState.setAttendanceError((error && error.message) || '저장하지 못했습니다.');
                EieRouter.open('attendance');
            }
        },

        reload: function () {
            _cellsLoaded = false;
            _cells = [];
            const a = att();
            if (a) EieState.invalidateAttendanceMonth(a.month || currentDate().slice(0, 7));
        }
    };
})();
