(function () {
    var _teacherName = '';
    var _cells = [];
    var _loaded = false;
    var _error = '';
    var _dayTab = '';

    var WEEKDAYS = [
        { key: 'mon', label: '월', full: '월요일', index: 1, en: 'mon', enFull: 'monday' },
        { key: 'tue', label: '화', full: '화요일', index: 2, en: 'tue', enFull: 'tuesday' },
        { key: 'wed', label: '수', full: '수요일', index: 3, en: 'wed', enFull: 'wednesday' },
        { key: 'thu', label: '목', full: '목요일', index: 4, en: 'thu', enFull: 'thursday' },
        { key: 'fri', label: '금', full: '금요일', index: 5, en: 'fri', enFull: 'friday' }
    ];

    function esc(value) {
        if (window.EieApp && typeof EieApp.escapeHtml === 'function') {
            return EieApp.escapeHtml(value == null ? '' : value);
        }
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function jsArg(value) {
        return esc(JSON.stringify(String(value == null ? '' : value)));
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function normalizeName(value) {
        if (window.EieClassroomScope && typeof EieClassroomScope.teacherKey === 'function') {
            return EieClassroomScope.teacherKey(value);
        }
        return text(value).replace(/선생님|선생|샘|teacher/gi, '').replace(/\s+/g, '').toLowerCase();
    }

    function readJson(value) {
        if (!value) return {};
        if (typeof value === 'object') return value;
        try {
            var parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function rawOf(row) {
        if (window.EieClassroomScope && typeof EieClassroomScope.rawOf === 'function') {
            return EieClassroomScope.rawOf(row);
        }
        if (row && row.raw && typeof row.raw === 'object') return row.raw;
        return readJson(row && row.raw_meta_json);
    }

    function flattenTeacherList(value) {
        if (window.EieClassroomScope && typeof EieClassroomScope.asTeacherList === 'function') {
            return EieClassroomScope.asTeacherList(value);
        }
        if (Array.isArray(value)) {
            var list = [];
            value.forEach(function (item) { list = list.concat(flattenTeacherList(item)); });
            return list;
        }
        if (value && typeof value === 'object') {
            var objectList = [];
            Object.keys(value).forEach(function (key) { objectList = objectList.concat(flattenTeacherList(value[key])); });
            return objectList;
        }
        return text(value).split(/[,+/]/).map(text).filter(Boolean);
    }

    function uniqueNames(values) {
        var map = {};
        var rows = [];
        (Array.isArray(values) ? values : [values]).forEach(function (value) {
            flattenTeacherList(value).forEach(function (name) {
                var clean = text(name);
                var key = normalizeName(clean);
                if (!key || map[key]) return;
                map[key] = true;
                rows.push(clean);
            });
        });
        return rows.sort(function (a, b) { return a.localeCompare(b, 'ko'); });
    }

    function rowsFromPayload(payload) {
        if (Array.isArray(payload && payload.timetable_cells)) return payload.timetable_cells;
        if (Array.isArray(payload && payload.cells)) return payload.cells;
        if (Array.isArray(payload && payload.rows)) return payload.rows;
        if (Array.isArray(payload && payload.data)) return payload.data;
        return [];
    }

    function stateCells() {
        var state = window.EieState && typeof EieState.get === 'function' ? EieState.get() : {};
        var dbRows = state && state.db && Array.isArray(state.db.timetable_cells) ? state.db.timetable_cells : [];
        if (dbRows.length) return dbRows;
        return state && Array.isArray(state.timetableCells) ? state.timetableCells : [];
    }

    function stateDb() {
        var state = window.EieState && typeof EieState.get === 'function' ? EieState.get() : {};
        return state && state.db ? state.db : {};
    }

    function localValue(key) {
        if (typeof window === 'undefined' || !window.localStorage || typeof window.localStorage.getItem !== 'function') return '';
        return text(window.localStorage.getItem(key) || '');
    }

    function storedTeacherName() {
        return localValue('WANGJI_EIE_NAME') || localValue('WANGJI_EIE_LOGIN_ID');
    }

    function storedRole() {
        return localValue('WANGJI_EIE_ROLE');
    }

    function isOwnerLike(value) {
        var key = normalizeName(value);
        return key === 'admin' || key === 'owner' || key === 'director' || key === '원장' || key === '원장님';
    }

    function getAssignedStudents(cell) {
        return Array.isArray(cell && cell.assigned_students) ? cell.assigned_students.filter(Boolean) : [];
    }

    function teacherNamesFromCell(cell) {
        if (window.EieClassroomScope && typeof EieClassroomScope.accessTeacherNamesForCell === 'function') {
            return EieClassroomScope.accessTeacherNamesForCell(cell);
        }
        var raw = rawOf(cell);
        return uniqueNames([
            cell && cell.homeroom_teacher,
            raw.homeroom_teacher,
            cell && cell.teacher_name_raw,
            cell && cell.teacher_name,
            raw.teacher_name_raw,
            raw.teacher_name,
            Array.isArray(cell && cell.teacher_names) ? cell.teacher_names : [],
            Array.isArray(raw.teacher_names) ? raw.teacher_names : []
        ]);
    }

    function teacherRoster(cells) {
        var names = {};
        ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily', 'Foreigner', 'Laura'].forEach(function (name) {
            names[normalizeName(name)] = name;
        });
        var stored = storedTeacherName();
        if (stored && !isOwnerLike(stored)) names[normalizeName(stored)] = stored;
        (cells || []).forEach(function (cell) {
            teacherNamesFromCell(cell).forEach(function (name) {
                var key = normalizeName(name);
                if (key) names[key] = name;
            });
        });
        return Object.keys(names).map(function (key) { return names[key]; }).sort(function (a, b) {
            return a.localeCompare(b, 'ko');
        });
    }

    function matchTeacherNamesForCell(cell, roster) {
        var found = {};
        var rosterKeys = {};
        (roster || []).forEach(function (name) {
            var key = normalizeName(name);
            if (key) rosterKeys[key] = name;
        });
        var hasRoster = Object.keys(rosterKeys).length > 0;
        teacherNamesFromCell(cell).forEach(function (name) {
            var key = normalizeName(name);
            if (!key) return;
            if (!hasRoster || rosterKeys[key]) found[hasRoster ? rosterKeys[key] : name] = true;
        });

        var haystack = normalizeName([
            cell && cell.class_name_raw,
            cell && cell.memo,
            cell && cell.raw_class_name
        ].filter(Boolean).join(' '));

        (roster || []).forEach(function (name) {
            var key = normalizeName(name);
            if (!key || !haystack) return;
            if (haystack.indexOf(key) !== -1) found[name] = true;
        });

        return Object.keys(found);
    }

    function cellsForTeacher(cells, teacherName) {
        if (window.EieClassroomScope && typeof EieClassroomScope.cellsForTeacher === 'function') {
            return EieClassroomScope.cellsForTeacher({
                teacherName: teacherName,
                role: 'teacher',
                cells: cells
            });
        }
        var roster = teacherRoster(cells);
        var targetKey = normalizeName(teacherName);
        if (!targetKey) return [];
        return (cells || []).filter(function (cell) {
            return matchTeacherNamesForCell(cell, roster).some(function (name) {
                return normalizeName(name) === targetKey;
            });
        });
    }

    function todayLabel() {
        return ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()];
    }

    function todayWeekday() {
        var label = todayLabel();
        return WEEKDAYS.filter(function (day) { return day.label === label; })[0] || WEEKDAYS[0];
    }

    function dayFromValue(value) {
        var raw = text(value);
        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
            var date = new Date(raw + 'T00:00:00');
            if (!Number.isNaN(date.getTime())) {
                var index = date.getDay();
                return WEEKDAYS.filter(function (day) { return day.index === index; })[0] || null;
            }
        }
        var key = normalizeName(raw.replace(/요일$/, ''));
        if (!key) return null;
        return WEEKDAYS.filter(function (day) {
            return [day.key, day.label, day.full, day.en, day.enFull, String(day.index)].some(function (candidate) {
                return normalizeName(candidate) === key;
            });
        })[0] || null;
    }

    function ensureDayTab() {
        if (!_dayTab || !dayFromValue(_dayTab)) _dayTab = todayWeekday().key;
    }

    function dayAliases(value) {
        var day = dayFromValue(value) || todayWeekday();
        var aliases = [day.key, day.label, day.full, day.en, day.enFull, String(day.index)];
        var raw = text(value);
        if (raw) aliases.push(raw, raw.replace(/요일$/, ''), raw.toLowerCase());
        if (window.EieClassroomScope && typeof EieClassroomScope.dayAliases === 'function') {
            aliases = aliases.concat(EieClassroomScope.dayAliases(value));
        }
        var seen = {};
        return aliases.map(text).filter(function (alias) {
            var key = normalizeName(alias);
            if (!key || seen[key]) return false;
            seen[key] = true;
            return true;
        });
    }

    function isoDate(offsetDays) {
        var date = new Date();
        date.setDate(date.getDate() + Number(offsetDays || 0));
        return date.toLocaleDateString('sv-SE');
    }

    function koreanDate(offsetDays) {
        var date = new Date();
        date.setDate(date.getDate() + Number(offsetDays || 0));
        return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }).replace(/\.$/, '');
    }

    function todayIso() {
        return isoDate(0);
    }

    function isTodayCell(cell) {
        return cellMatchesDay(cell, todayIso());
    }

    function teacherDaySources(cell) {
        var raw = rawOf(cell);
        return [
            cell && cell.day_teachers,
            cell && cell.teacher_names_by_day,
            cell && cell.weekday_teachers,
            raw.day_teachers,
            raw.teacher_names_by_day,
            raw.weekday_teachers
        ].filter(function (source) { return source && typeof source === 'object'; });
    }

    function dayTeacherInfo(cell, dayValue) {
        var aliases = dayAliases(dayValue).map(normalizeName);
        var found = false;
        var names = [];
        teacherDaySources(cell).forEach(function (source) {
            Object.keys(source || {}).forEach(function (key) {
                if (aliases.indexOf(normalizeName(key)) === -1) return;
                found = true;
                names = names.concat(flattenTeacherList(source[key]));
            });
        });
        return { found: found, names: uniqueNames(names) };
    }

    function cellMatchesDay(cell, dayValue) {
        var info = dayTeacherInfo(cell, dayValue);
        if (info.found) return true;
        if (window.EieClassroomScope && typeof EieClassroomScope.isCellOnDate === 'function') {
            if (EieClassroomScope.isCellOnDate(cell, dayValue)) return true;
        }
        var aliases = dayAliases(dayValue).map(normalizeName);
        var labels = [
            cell && cell.day_label,
            cell && cell.day,
            cell && cell.weekday
        ].map(normalizeName).filter(Boolean);
        if (/^\d{4}-\d{2}-\d{2}/.test(text(dayValue)) && labels.indexOf(normalizeName('오늘')) !== -1) return true;
        if ((dayFromValue(dayValue) || {}).label === todayLabel() && labels.indexOf(normalizeName('오늘')) !== -1) return true;
        return labels.some(function (label) {
            return aliases.some(function (alias) {
                return label.indexOf(alias) !== -1 || alias.indexOf(label) !== -1;
            });
        });
    }

    function cellBelongsToTeacherOnDay(cell, teacherName, dayValue) {
        var targetKey = normalizeName(teacherName);
        if (!targetKey) return false;
        var info = dayTeacherInfo(cell, dayValue);
        if (info.found) {
            return info.names.some(function (name) { return normalizeName(name) === targetKey; });
        }
        return cellsForTeacher([cell], teacherName).length > 0;
    }

    function cellsForTeacherOnDay(cells, teacherName, dayValue) {
        var helperCells = helperCellsForTeacherOnDay(cells, teacherName, dayValue);
        if (helperCells) return helperCells;
        return (cells || []).filter(function (cell) {
            return cellMatchesDay(cell, dayValue) && cellBelongsToTeacherOnDay(cell, teacherName, dayValue);
        });
    }

    function helperDisplaySessions(cells) {
        if (!window.EieTimetableView || typeof EieTimetableView._buildDisplaySessions !== 'function') return null;
        try {
            return EieTimetableView._buildDisplaySessions(cells || []) || [];
        } catch (error) {
            return null;
        }
    }

    function helperDayTeacherSessions(cells, dayValue) {
        if (!window.EieTimetableView || typeof EieTimetableView._buildDayTeacherSessions !== 'function') return null;
        var day = (dayFromValue(dayValue) || todayWeekday()).label;
        var sessions = helperDisplaySessions(cells);
        if (!Array.isArray(sessions)) return null;
        try {
            return EieTimetableView._buildDayTeacherSessions(sessions, day) || [];
        } catch (error) {
            return null;
        }
    }

    function helperCellsForTeacherOnDay(cells, teacherName, dayValue) {
        var targetKey = normalizeName(teacherName);
        if (!targetKey) return [];
        var sessions = helperDayTeacherSessions(cells, dayValue);
        if (!Array.isArray(sessions)) return null;
        return sessions.filter(function (session) {
            return normalizeName(session && (session.teacherName || session.teacher_name || session.teacher)) === targetKey
                || normalizeName(session && session.teacher_key) === targetKey;
        }).map(helperSessionToCell);
    }

    function helperSessionToCell(session) {
        var periods = Array.isArray(session && session.periods) ? session.periods : [];
        var firstPeriod = sortCells(periods.map(function (period, index) {
            return {
                period_order: period && (period.period_order || period.periodOrder || index + 1),
                period_label: period && (period.period_label || period.periodLabel || ''),
                column_index: index
            };
        }))[0] || {};
        var sourceIds = Array.isArray(session && session.source_cell_ids) ? session.source_cell_ids : [];
        var teacherName = text(session && (session.teacherName || session.teacher_name || session.teacher));
        return {
            id: text(sourceIds[0]) || text(session && (session.source_cell_id || session.session_id || session.id)),
            source_cell_ids: sourceIds,
            session_id: text(session && session.session_id),
            day_label: text((dayFromValue(_dayTab) || todayWeekday()).label),
            period_order: Number(firstPeriod.period_order || session.period_order || 0),
            period_label: text(firstPeriod.period_label || session.period_label || ''),
            class_name: text(session && (session.material || session.class_name || session.class_full_name)) || '',
            class_name_raw: text(session && (session.material || session.class_name || session.class_full_name)) || '',
            material: text(session && session.material),
            assigned_students: Array.isArray(session && session.students) ? session.students : [],
            teacher_name_raw: teacherName,
            teacher_name: teacherName,
            teacher_names: teacherName ? [teacherName] : [],
            day_teachers: teacherName ? { [text((dayFromValue(_dayTab) || todayWeekday()).label)]: [teacherName] } : {}
        };
    }

    function uniqueStudents(cells) {
        var map = {};
        (cells || []).forEach(function (cell) {
            getAssignedStudents(cell).forEach(function (student) {
                var id = text(student.student_id || student.id || student.assignment_id || student.display_name || student.name);
                if (!id || map[id]) return;
                map[id] = {
                    id: text(student.student_id || student.id || ''),
                    key: id,
                    name: student.display_name || student.name || student.student_name_raw || '-',
                    grade: student.grade_raw || student.grade || '',
                    className: classNameOfCell(cell),
                    cellId: cell.id || ''
                };
            });
        });
        return Object.keys(map).map(function (key) { return map[key]; }).sort(function (a, b) {
            return text(a.name).localeCompare(text(b.name), 'ko');
        });
    }

    function currentTeacherCells() {
        return cellsForTeacher(_cells, _teacherName);
    }

    function periodNumberOf(cell) {
        var raw = Number(cell && cell.period_order);
        if (Number.isFinite(raw) && raw > 0) return raw;
        var match = text(cell && cell.period_label).match(/\d+/);
        return match ? Number(match[0]) : 0;
    }

    function sortCells(cells) {
        return (cells || []).slice().sort(function (a, b) {
            var dayA = text(a.day_label || a.day);
            var dayB = text(b.day_label || b.day);
            var d = dayA.localeCompare(dayB, 'ko');
            if (d) return d;
            var pA = periodNumberOf(a);
            var pB = periodNumberOf(b);
            if (pA !== pB) return pA - pB;
            return Number(a.column_index || 0) - Number(b.column_index || 0);
        });
    }

    function normalizeDashboardText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function classNameOfCell(cell) {
        var raw = rawOf(cell);
        return normalizeDashboardText(
            cell && (
                cell.class_name_raw ||
                cell.raw_class_name ||
                cell.class_name ||
                cell.classTitle ||
                cell.title ||
                cell.name ||
                cell.display_name ||
                cell.class_label ||
                cell.material_text ||
                cell.material
            ) ||
            raw.class_name_raw ||
            raw.raw_class_name ||
            raw.class_name ||
            raw.classTitle ||
            raw.title ||
            raw.name ||
            raw.display_name ||
            raw.class_label ||
            raw.material_text ||
            raw.material ||
            ''
        );
    }

    function studentCountOfCell(cell) {
        var assigned = getAssignedStudents(cell);
        if (assigned.length) return assigned.length;
        var raw = rawOf(cell);
        var values = [
            cell && cell.student_count,
            cell && cell.studentCount,
            cell && cell.enrolled_count,
            cell && cell.enrolledCount,
            cell && cell.current_students,
            raw.student_count,
            raw.studentCount,
            raw.enrolled_count,
            raw.enrolledCount,
            raw.current_students
        ];
        for (var i = 0; i < values.length; i += 1) {
            var count = Number(values[i]);
            if (Number.isFinite(count) && count > 0) return count;
        }
        return null;
    }

    function attendanceRows() {
        var db = stateDb();
        return []
            .concat(Array.isArray(db.attendance) ? db.attendance : [])
            .concat(Array.isArray(db.attendance_records) ? db.attendance_records : []);
    }

    function attendanceRowsForCell(cell, dateValue) {
        var date = text(dateValue || todayIso()).slice(0, 10);
        var cellId = text(cell && cell.id);
        var studentIds = getAssignedStudents(cell).map(function (student) {
            return text(student.student_id || student.studentId || student.id || student.eie_student_id);
        }).filter(Boolean);
        return attendanceRows().filter(function (row) {
            var rowDate = text(row.date || row.attendance_date || row.record_date || row.created_at).slice(0, 10);
            if (rowDate !== date) return false;
            var rowCellId = text(row.cell_id || row.timetable_cell_id || row.classroom_cell_id || row.session_id);
            if (cellId && rowCellId && rowCellId === cellId) return true;
            var rowStudentId = text(row.student_id || row.studentId || row.eie_student_id || row.student_seed_id);
            return rowStudentId && studentIds.indexOf(rowStudentId) !== -1;
        });
    }

    function attendanceShortLabel(cell, dateValue) {
        var rows = attendanceRowsForCell(cell, dateValue);
        var count = studentCountOfCell(cell);
        var absent = 0;
        rows.forEach(function (row) {
            var status = text(row.status || row.attendance_status || row.value || row.result);
            if (/결석|absent|missing|no-show/i.test(status)) absent += 1;
        });
        if (count) return '등원' + Math.max(0, count - absent);
        if (absent) return '등원0';
        return '등원0';
    }

    async function loadCells() {
        var cached = stateCells();
        if (cached.length) {
            _cells = cached;
            _loaded = true;
            return;
        }
        if (_loaded) return;
        try {
            var result = await EieApi.getTimetable(null, { status: 'active,imported,needs_review' });
            _cells = rowsFromPayload(result);
            if (window.EieState && typeof EieState.setTimetableCells === 'function') {
                EieState.setTimetableCells(_cells);
            }
            _error = result && result.fallback ? '시간표 정보를 불러오지 못했습니다.' : '';
        } catch (err) {
            _cells = [];
            _error = err && err.message ? err.message : '시간표 정보를 불러오지 못했습니다.';
        } finally {
            _loaded = true;
        }
    }

    function ensureTeacherName(roster) {
        if (_teacherName) return;
        var stored = storedTeacherName();
        var role = storedRole();
        if (stored && !isOwnerLike(role) && !isOwnerLike(stored)) {
            _teacherName = stored;
            return;
        }
        if (roster.length) _teacherName = roster.filter(function (name) { return !isOwnerLike(name); })[0] || roster[0];
    }

    function renderShortcutRow() {
        return '<div class="eie-teacher-quick-cards eie-p-chip-row">'
            + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openTimetable()">시간표</button>'
            + '<button class="eie-teacher-quick-card eie-p-btn-save" type="button" onclick="EieTeacherView.openClassroomList()">클래스룸</button>'
            + '<button class="eie-teacher-quick-card eie-p-btn-cancel" type="button" onclick="EieTeacherView.openAttendanceLedger()">출석부</button>'
            + '</div>';
    }

    function renderHomeHead(todayRows) {
        var teacherLabel = _teacherName || '선생님';
        return '<div class="eie-teacher-home-head eie-p-card">'
            + '<div class="eie-teacher-home-copy">'
            + '<div class="eie-teacher-title-row">'
            + '<h2>' + esc(teacherLabel) + ' 선생님</h2>'
            + '<span>' + esc(koreanDate(0)) + '</span>'
            + '</div>'
            + '</div>'
            + renderShortcutRow()
            + '</div>';
    }

    function renderSectionHead(title, countLabel) {
        return '<div class="eie-teacher-section-head">'
            + '<h3>' + esc(title) + '</h3>'
            + (countLabel ? '<span>' + esc(countLabel) + '</span>' : '')
            + '</div>';
    }

    function periodLabelOf(cell) {
        var no = periodNumberOf(cell);
        if (no) return String(no);
        return text(cell && cell.period_label) || '-';
    }

    function teacherMetaForCell(cell, dayValue) {
        var info = dayTeacherInfo(cell, dayValue || todayIso());
        var names = info.found && info.names.length ? info.names : matchTeacherNamesForCell(cell, teacherRoster(_cells));
        return names.join(', ');
    }

    function renderClassRow(cell, options) {
        var opts = options || {};
        var cellId = String(cell && cell.id || '');
        var className = classNameOfCell(cell) || '수업명 없음';
        var count = studentCountOfCell(cell);
        var dayValue = opts.dayValue || todayIso();
        var chips = [];
        if (count) chips.push('재원' + count);
        if (opts.showAttendance) chips.push(attendanceShortLabel(cell, todayIso()));
        return '<button type="button" class="eie-teacher-day-row eie-p-card" data-eie-teacher-cell-id="' + esc(cellId) + '" data-eie-teacher-key="' + esc(normalizeName(_teacherName)) + '" onclick="EieTeacherView.openClassroom(' + jsArg(cellId) + ')">'
            + '<span class="eie-teacher-day-row__period">' + esc(periodLabelOf(cell)) + '</span>'
            + '<span class="eie-teacher-day-row__main">'
            + '<strong>' + esc(className) + '</strong>'
            + '</span>'
            + '<span class="eie-teacher-day-row__chips">'
            + chips.map(function (chip) { return '<span class="eie-teacher-chip eie-p-chip">' + esc(chip) + '</span>'; }).join('')
            + '</span>'
            + '</button>';
    }

    function renderTodaySchedule(todayRows) {
        var rows = sortCells(todayRows || []);
        return '<div class="eie-teacher-schedule eie-teacher-schedule--today eie-p-card">'
            + renderSectionHead('오늘 수업')
            + '<div class="eie-teacher-day-card-list">'
            + (rows.length ? rows.map(function (cell) { return renderClassRow(cell, { showAttendance: true, dayValue: todayIso() }); }).join('') : '<div class="eie-empty-box" data-eie-teacher-empty-today="true">오늘 수업이 없습니다.</div>')
            + '</div>'
            + '</div>';
    }

    function renderDayTabbar() {
        ensureDayTab();
        return '<div class="eie-teacher-tabbar eie-p-chip-row" aria-label="요일 선택">'
            + WEEKDAYS.map(function (item) {
                return '<button class="btn eie-p-chip' + (_dayTab === item.key ? ' is-active' : '') + '" type="button" onclick="EieTeacherView.setDay(' + jsArg(item.key) + ')">' + esc(item.label) + '</button>';
            }).join('')
            + '</div>';
    }

    function renderWeekdaySchedule() {
        ensureDayTab();
        var selected = dayFromValue(_dayTab) || todayWeekday();
        var rows = sortCells(cellsForTeacherOnDay(_cells, _teacherName, selected.label));
        var showAttendance = selected.label === todayLabel();
        var sectionTitle = showAttendance ? '오늘 수업' : selected.label + '요일 수업';
        return '<div class="eie-teacher-schedule eie-teacher-schedule--today eie-p-card">'
            + renderSectionHead(sectionTitle)
            + renderDayTabbar()
            + '<div class="eie-teacher-day-card-list">'
            + (rows.length ? rows.map(function (cell) { return renderClassRow(cell, { showAttendance: showAttendance, dayValue: selected.label }); }).join('') : '<div class="eie-empty-box">' + esc(selected.label) + '요일 담당 수업이 없습니다.</div>')
            + '</div>'
            + '</div>';
    }

    async function render() {
        await loadCells();
        var roster = teacherRoster(_cells);
        ensureTeacherName(roster);
        ensureDayTab();
        var todayRows = sortCells(cellsForTeacherOnDay(_cells, _teacherName, todayIso()));
        var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';

        return '<section class="eie-teacher-dashboard eie-v2-screen" data-eie-teacher-key="' + esc(normalizeName(_teacherName)) + '" aria-labelledby="eie-teacher-title">'
            + '<h1 id="eie-teacher-title" class="eie-teacher-sr-title">' + esc(_teacherName || '선생님') + ' 선생님 대시보드</h1>'
            + '<div class="eie-teacher-dashboard-shell">'
            + errorHtml
            + renderHomeHead(todayRows)
            + renderWeekdaySchedule()
            + '</div>'
            + '</section>';
    }

    function openTeacherStudentList() {
        if (_teacherName && window.EieStudentsView && typeof EieStudentsView.setTeacherFilter === 'function') {
            EieStudentsView.setTeacherFilter(_teacherName);
            return;
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('students');
    }

    window.EieTeacherView = {
        render: render,
        openTeacher: function (teacherName) {
            _teacherName = text(teacherName);
            _dayTab = todayWeekday().key;
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('teacher');
        },
        setDay: function (dayKey) {
            var day = dayFromValue(dayKey) || todayWeekday();
            _dayTab = day.key;
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('teacher');
        },
        setTab: function (tab) {
            var day = dayFromValue(tab) || todayWeekday();
            _dayTab = day.key;
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('teacher');
        },
        openTimetable: function () {
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('timetable');
        },
        openClassroom: function (cellId) {
            if (cellId && window.EieClassroomView && typeof EieClassroomView.openCell === 'function') {
                EieClassroomView.openCell(cellId);
                return;
            }
            if (cellId && window.EieClassroomView && typeof EieClassroomView.openDetail === 'function') {
                EieClassroomView.openDetail(cellId);
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('classroom');
        },
        openClassroomList: function () {
            if (_teacherName && window.EieClassroomView && typeof EieClassroomView.openTeacher === 'function') {
                EieClassroomView.openTeacher(_teacherName);
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('classroom');
        },
        openTodayClassroom: function () {
            if (_teacherName && window.EieClassroomView && typeof EieClassroomView.openTodayForTeacher === 'function') {
                EieClassroomView.openTodayForTeacher(_teacherName);
                return;
            }
            if (_teacherName && window.EieClassroomView && typeof EieClassroomView.openTeacher === 'function') {
                EieClassroomView.openTeacher(_teacherName);
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('classroom');
        },
        openStudent: function (studentId, tab) {
            if (studentId && window.EieStudentsView && typeof EieStudentsView.openDetail === 'function') {
                EieStudentsView.openDetail(studentId, { from: 'teacher', tab: text(tab || 'basic') }, text(tab || 'basic'));
                return;
            }
            if (_teacherName && window.EieStudentsView && typeof EieStudentsView.setTeacherFilter === 'function') {
                EieStudentsView.setTeacherFilter(_teacherName);
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('students');
        },
        openAttendanceLedger: function () {
            if (_teacherName && window.EieAttendanceView && typeof EieAttendanceView.openTeacher === 'function') {
                EieAttendanceView.openTeacher(_teacherName);
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('attendance');
        },
        openConsultations: function () {
            openTeacherStudentList();
        },
        showPreparing: function (label) {
            if (typeof window !== 'undefined' && window.alert) window.alert(label + ' 기능은 준비중입니다.');
        },
        matchTeacherNamesForCell: matchTeacherNamesForCell,
        cellsForTeacher: cellsForTeacher,
        cellsForTeacherOnDay: cellsForTeacherOnDay,
        teacherNamesFromCell: teacherNamesFromCell,
        dayTeacherInfo: dayTeacherInfo,
        classNameOfCell: classNameOfCell,
        studentCountOfCell: studentCountOfCell
    };
})();
