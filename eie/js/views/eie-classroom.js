(function () {
    var _cells = [];
    var _students = [];          // 전체 학생 목록 (배정 추가용)
    var _error = '';
    var _loaded = false;
    var _studentsLoaded = false;
    var _teachers = [];
    var _teachersLoaded = false;
    var _attendanceRows = [];
    var _attendanceLoadedDate = '';
    var _selectedCellId = null;
    var _selectedStudentKey = null;
    var _filterTeacherName = '';
    var _todayFilterDate = '';
    var _selectedDay = '';
    var _editStudentMode = false; // 학생 상세 수정 모드
    var _editCellTeachersMode = false;
    var _saving = false;
    var _addStudentMode = false;  // 학생 추가 패널
    var _attendancePanelOpen = false;
    var _consultationRows = [];
    var _consultationLoadedStudentId = '';
    var _consultationFormOpen = false;
    var _consultationDraftDate = '';
    var _detailOnlyMode = false;
    var _detailOnlyReturnRoute = '';

    function esc(value) {
        return EieApp.escapeHtml(value);
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function jsArg(value) {
        return esc(JSON.stringify(String(value == null ? '' : value)));
    }

    function rawOf(row) {
        if (row && row.raw && typeof row.raw === 'object') return row.raw;
        if (!row || !row.raw_meta_json) return {};
        if (typeof row.raw_meta_json === 'object') return row.raw_meta_json;
        try {
            var parsed = JSON.parse(row.raw_meta_json);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function uniqueNames(rows) {
        var seen = {};
        return (Array.isArray(rows) ? rows : []).map(text).filter(function (name) {
            var key = name.toLowerCase();
            if (!name || seen[key]) return false;
            seen[key] = true;
            return true;
        }).sort(function (a, b) { return a.localeCompare(b, 'ko'); });
    }

    function isAssignableTeacherName(name) {
        var key = text(name).toLowerCase().replace(/\s+/g, '');
        // Foreigner/PREP are timetable coverage markers, not assignable 담당 선생님 options.
        // Keep them out even if they arrive later from timetable cells or teacher API rows.
        return key !== 'foreigner' && key !== 'foreign' && key !== '외국인' && key !== '원어민'
            && key !== 'prep' && key !== '프랩';
    }

    function teacherKey(value) {
        if (window.EieClassroomScope && typeof EieClassroomScope.teacherKey === 'function') {
            return EieClassroomScope.teacherKey(value);
        }
        return text(value).toLowerCase().replace(/\s+/g, '');
    }

    function asTeacherList(value) {
        if (Array.isArray(value)) {
            var list = [];
            value.forEach(function (item) { list = list.concat(asTeacherList(item)); });
            return uniqueNames(list);
        }
        return uniqueNames(text(value).split(/[,+/]/).map(text).filter(Boolean));
    }

    function dayTeacherSource(row) {
        var raw = rawOf(row);
        return row && (row.day_teachers || row.teacher_names_by_day || row.weekday_teachers)
            || raw.day_teachers
            || raw.teacher_names_by_day
            || raw.weekday_teachers
            || null;
    }

    function dayTeacherValues(row, day) {
        var source = dayTeacherSource(row);
        if (!source || typeof source !== 'object') return [];
        return asTeacherList(source[day] || source[day + '요일'] || source[String(day || '').toLowerCase()] || '');
    }

    function allDayTeacherValues(row) {
        var values = [];
        ['월', '화', '수', '목', '금'].forEach(function (day) {
            values = values.concat(dayTeacherValues(row, day));
        });
        return uniqueNames(values);
    }

    function currentUserNames() {
        if (window.EieClassroomScope && typeof EieClassroomScope.currentSession === 'function') {
            var session = EieClassroomScope.currentSession();
            return uniqueNames([session.teacherName, session.loginId]);
        }
        var storage = window.localStorage || {};
        return uniqueNames([
            storage.getItem && storage.getItem('WANGJI_EIE_NAME'),
            storage.getItem && storage.getItem('WANGJI_EIE_LOGIN_ID')
        ]);
    }

    function isOwnerSession() {
        if (window.EieClassroomScope && typeof EieClassroomScope.currentSession === 'function') {
            var session = EieClassroomScope.currentSession();
            return EieClassroomScope.isDirector(session.role, session.loginId);
        }
        var storage = window.localStorage || {};
        var role = text(storage.getItem && storage.getItem('WANGJI_EIE_ROLE')).toLowerCase();
        var loginId = text(storage.getItem && storage.getItem('WANGJI_EIE_LOGIN_ID')).toLowerCase();
        return role === 'admin' || role === 'owner' || loginId === 'admin';
    }

    function teacherNamesOfCell(cell) {
        if (window.EieClassroomScope && typeof EieClassroomScope.displayTeacherNamesForCell === 'function') {
            return EieClassroomScope.displayTeacherNamesForCell(cell);
        }
        var raw = rawOf(cell);
        var values = [];
        if (Array.isArray(cell && cell.teacher_names)) values = values.concat(cell.teacher_names);
        if (Array.isArray(raw.teacher_names)) values = values.concat(raw.teacher_names);
        values = values.concat(text(cell && cell.homeroom_teacher).split(','));
        values = values.concat(text(raw.homeroom_teacher).split(','));
        values = values.concat(text(cell && (cell.teacher_name_raw || cell.teacher_name)).split(','));
        values = values.concat(text(raw.teacher_name_raw || raw.teacher_name).split(','));
        return uniqueNames(values);
    }

    function accessTeacherNamesOfCell(cell) {
        if (window.EieClassroomScope && typeof EieClassroomScope.accessTeacherNamesForCell === 'function') {
            return EieClassroomScope.accessTeacherNamesForCell(cell);
        }
        return uniqueNames(teacherNamesOfCell(cell).concat(allDayTeacherValues(cell)));
    }

    function canCurrentUserUseCell(cell) {
        if (window.EieClassroomScope && typeof EieClassroomScope.canUseCell === 'function') {
            var session = EieClassroomScope.currentSession();
            if (!session.teacherName && !session.loginId && !session.role) return true;
            return EieClassroomScope.canUseCell({
                teacherName: session.teacherName,
                loginId: session.loginId,
                role: session.role,
                cell: cell
            });
        }
        if (isOwnerSession()) return true;
        var userKeys = currentUserNames().map(teacherKey).filter(Boolean);
        if (!userKeys.length) return true;
        var accessKeys = accessTeacherNamesOfCell(cell).map(teacherKey).filter(Boolean);
        return userKeys.some(function (key) { return accessKeys.indexOf(key) >= 0; });
    }

    function visibleCellsForCurrentUser(cells) {
        var visible = (Array.isArray(cells) ? cells : []).filter(canCurrentUserUseCell);
        if (_filterTeacherName) {
            visible = cellsForTeacherOnDay(visible, _filterTeacherName, activeDayLabel());
        }
        if (_todayFilterDate) {
            var filterDay = dayLabelFromDate(_todayFilterDate);
            visible = visible.filter(function (cell) {
                return cellMatchesDay(cell, filterDay);
            });
        }
        return visible;
    }

    function teacherRoster() {
        var values = _teachers.slice();
        _cells.forEach(function (cell) {
            values = values.concat(teacherNamesOfCell(cell));
        });
        return uniqueNames(values).filter(isAssignableTeacherName);
    }

    function asRows(result) {
        if (Array.isArray(result && result.timetable_cells)) return result.timetable_cells;
        if (Array.isArray(result && result.data)) return result.data;
        return [];
    }

    function sortCells(cells) {
        return cells.slice().sort(function (a, b) {
            var pA = Number(a.period_order || 0);
            var pB = Number(b.period_order || 0);
            if (pA !== pB) return pA - pB;
            return Number(a.column_index || 0) - Number(b.column_index || 0);
        });
    }

    function getAssignedStudents(cell) {
        return Array.isArray(cell && cell.assigned_students) ? cell.assigned_students : [];
    }

    function getSelectedCell() {
        if (_selectedCellId === null) return null;
        return _cells.find(function (c) { return String(c.id) === String(_selectedCellId); }) || null;
    }

    function getSelectedStudent() {
        if (_selectedStudentKey === null) return null;
        var cell = getSelectedCell();
        if (!cell) return null;
        var assigned = getAssignedStudents(cell).find(function (s) {
            return [s.assignment_id, s.student_id, s.id].map(text).filter(Boolean).some(function (key) {
                return key === String(_selectedStudentKey);
            });
        }) || null;
        if (!assigned) return null;
        var sid = text(assigned.student_id || assigned.id);
        var full = _students.find(function (student) {
            return String(student.id || student.student_id || '') === String(sid);
        }) || {};
        return Object.assign({}, full, assigned, {
            raw_meta_json: assigned.raw_meta_json || full.raw_meta_json || null
        });
    }

    function displayName(student) {
        return text(student && (student.display_name || student.name || student.student_name_raw || student.normalized_name)) || '-';
    }

    function gradeOf(student) {
        return text(student && (student.grade || student.grade_raw));
    }

    function normalizeGrade(value) {
        var raw = text(value).replace(/\s+/g, '');
        var middle = raw.match(/^중(?:학교|등)?([1-3])(?:학년)?$/);
        if (middle) return '중' + middle[1];
        var high = raw.match(/^고(?:등|등학교)?([1-3])(?:학년)?$/);
        if (high) return '고' + high[1];
        return raw;
    }

    function schoolOf(student) {
        var raw = rawOf(student);
        return text(student && (student.school_name || student.school)) || text(raw.school_name || raw.school);
    }

    function metaValue(student, key) {
        var raw = rawOf(student);
        return text(student && student[key]) || text(raw[key]);
    }

    function phoneOf(student) {
        var raw = rawOf(student);
        return text(student && (student.student_phone || student.phone || student.phone_raw || student.normalized_phone))
            || text(raw.student_phone || raw.phone || raw.phone_raw || raw.normalized_phone);
    }

    function parentPhoneOf(student) {
        return metaValue(student, 'parent_phone');
    }

    function guardianRelationOf(student) {
        return metaValue(student, 'guardian_relation');
    }

    function addressOf(student) {
        return metaValue(student, 'student_address');
    }

    function vehicleInfoOf(student) {
        return metaValue(student, 'vehicle_info');
    }

    function studentPinOf(student) {
        return metaValue(student, 'student_pin') || metaValue(student, 'pin');
    }

    function studentTypeOf(student) {
        return metaValue(student, 'student_type') || '일반';
    }

    function memoOf(student) {
        return text(student && student.memo) || text(rawOf(student).memo);
    }

    function statusOf(student) {
        var status = text(student && student.status) || 'active';
        return status === 'imported' ? 'active' : status;
    }

    function todayIso() {
        return new Date().toLocaleDateString('sv-SE');
    }

    function normalizeDate(value) {
        var raw = text(value);
        return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : todayIso();
    }


    var WEEKDAY_LABELS = ['월', '화', '수', '목', '금'];

    function dayLabelFromDate(value) {
        var raw = normalizeDate(value || todayIso());
        var date = new Date(raw + 'T00:00:00');
        if (!Number.isNaN(date.getTime())) {
            return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()] || '월';
        }
        return '월';
    }

    function activeDayLabel() {
        return text(_selectedDay) || dayLabelFromDate(_todayFilterDate || todayIso());
    }

    function cellMatchesDay(cell, day) {
        var label = text(day);
        if (!label) return true;
        if (window.EieClassroomScope && typeof EieClassroomScope.isCellOnDate === 'function') {
            if (EieClassroomScope.isCellOnDate(cell, label)) return true;
        }
        var raw = rawOf(cell);
        var aliases = window.EieClassroomScope && typeof EieClassroomScope.dayAliases === 'function'
            ? EieClassroomScope.dayAliases(label).map(teacherKey)
            : [teacherKey(label), teacherKey(label + '요일')];
        var directLabels = [
            cell && cell.day_label,
            cell && cell.day,
            cell && cell.weekday,
            raw.day_label,
            raw.day,
            raw.weekday
        ].map(teacherKey).filter(Boolean);
        if (directLabels.some(function (direct) {
            return aliases.some(function (alias) { return direct.indexOf(alias) !== -1 || alias.indexOf(direct) !== -1; });
        })) return true;

        var dayMaps = [
            cell && cell.day_teachers,
            cell && cell.teacher_names_by_day,
            cell && cell.weekday_teachers,
            raw.day_teachers,
            raw.teacher_names_by_day,
            raw.weekday_teachers
        ];
        return dayMaps.some(function (source) {
            if (!source || typeof source !== 'object') return false;
            return aliases.some(function (alias) {
                return Object.keys(source).some(function (key) {
                    var keyText = teacherKey(key);
                    return keyText && (keyText === alias || keyText.indexOf(alias) !== -1 || alias.indexOf(keyText) !== -1);
                });
            });
        });
    }

    function teacherNamesForCellOnDay(cell, day) {
        var dayNames = dayTeacherValues(cell, day);
        if (dayNames.length) return dayNames;
        return teacherNamesOfCell(cell);
    }

    function cellBelongsToTeacherOnDay(cell, name, day) {
        var target = teacherKey(name);
        if (!target) return false;
        return teacherNamesForCellOnDay(cell, day).map(teacherKey).some(function (key) {
            return key === target;
        });
    }

    function cellsForTeacherOnDay(cells, name, day) {
        var active = text(day) || activeDayLabel();
        return sortCells((Array.isArray(cells) ? cells : []).filter(function (cell) {
            return cellMatchesDay(cell, active) && cellBelongsToTeacherOnDay(cell, name, active);
        }));
    }

    function cellTitle(cell) {
        var raw = rawOf(cell);
        var candidates = [
            cell && cell.class_name_raw,
            cell && cell.raw_class_name,
            cell && cell.class_name,
            cell && cell.classTitle,
            cell && cell.title,
            cell && cell.name,
            cell && cell.display_name,
            cell && cell.class_label,
            cell && cell.material_text,
            cell && cell.material,
            raw.class_name_raw,
            raw.raw_class_name,
            raw.class_name,
            raw.classTitle,
            raw.title,
            raw.name,
            raw.display_name,
            raw.class_label,
            raw.material_text,
            raw.material
        ];
        for (var i = 0; i < candidates.length; i += 1) {
            var value = text(candidates[i]);
            if (value) return value;
        }
        return '수업명 없음';
    }

    function attendanceSummaryForCell(cell) {
        var students = getAssignedStudents(cell);
        if (!students.length) return '';
        var date = todayIso();
        var records = students.map(function (student) {
            var sid = text(student && (student.student_id || student.id));
            return sid ? attendanceRecordFor(sid, date) : null;
        }).filter(Boolean);
        if (!records.length) return '';
        var absent = records.filter(function (row) { return text(row && row.status) === '결석'; }).length;
        return '결석' + String(absent);
    }

    function renderWeekdayTabs() {
        var active = activeDayLabel();
        return '<div class="eie-classroom-weekday-tabs" aria-label="요일 선택">'
            + WEEKDAY_LABELS.map(function (day) {
                var isActive = teacherKey(day) === teacherKey(active);
                return '<button type="button" class="eie-classroom-weekday-chip' + (isActive ? ' is-active' : '') + '"'
                    + ' onclick="EieClassroomView.setDay(' + jsArg(day) + ')">'
                    + esc(day)
                    + '</button>';
            }).join('')
            + '</div>';
    }

    function renderClassroomRow(cell) {
        var cellId = text(cell && cell.id);
        var students = getAssignedStudents(cell);
        var count = students.length ? '재원' + String(students.length) : '';
        var absence = attendanceSummaryForCell(cell);
        var meta = [count, absence].filter(Boolean).join(' · ');
        return '<button type="button" class="eie-classroom-schedule-row" onclick="EieClassroomView.openDetail(' + jsArg(cellId) + ')">'
            + '<span class="eie-classroom-schedule-period">' + esc(text(cell && (cell.period_order || cell.period_label)) || '-') + '</span>'
            + '<span class="eie-classroom-schedule-main">' + esc(cellTitle(cell)) + '</span>'
            + '<span class="eie-classroom-schedule-meta">' + esc(meta) + '</span>'
            + '</button>';
    }

    function renderTeacherScheduleGroups(cells) {
        var active = activeDayLabel();
        var filtered = sortCells((Array.isArray(cells) ? cells : []).filter(function (cell) {
            return cellMatchesDay(cell, active);
        }));
        if (!filtered.length) {
            return '<div class="eie-empty-box" data-eie-classroom-empty-day="true">' + esc(active) + '요일 수업이 없습니다.</div>';
        }
        var seen = {};
        filtered.forEach(function (cell) {
            teacherNamesForCellOnDay(cell, active).forEach(function (name) {
                if (isAssignableTeacherName(name)) seen[name] = true;
            });
        });
        var roster = Object.keys(seen).sort(function (a, b) { return a.localeCompare(b, 'ko'); });
        if (!roster.length) return renderCards(filtered);

        return '<div class="eie-classroom-schedule-groups">'
            + roster.map(function (name) {
                var teacherCells = cellsForTeacherOnDay(filtered, name, active);
                if (!teacherCells.length) return '';
                return '<section class="eie-classroom-teacher-group">'
                    + '<div class="eie-classroom-teacher-head"><strong>' + esc(name) + '</strong></div>'
                    + '<div class="eie-classroom-schedule-list">'
                    + teacherCells.map(renderClassroomRow).join('')
                    + '</div>'
                    + '</section>';
            }).join('')
            + '</div>';
    }

    async function renderBorrowedTimetablePanel(cell, student) {
        if (!cell || !window.EieTimetableView || typeof EieTimetableView.renderPanelOnlyWithContext !== 'function') return '';
        var cellId = text(cell && cell.id);
        var ctx = {
            cellId: cellId,
            selectedDay: activeDayLabel(),
            mountRoute: 'classroom'
        };
        if (student) {
            ctx.studentId = text(student && (student.student_id || student.id));
            ctx.studentName = displayName(student);
            ctx.studentPanelMode = 'detail';
        }
        try {
            return await EieTimetableView.renderPanelOnlyWithContext(ctx);
        } catch (error) {
            return '';
        }
    }

    function attendanceRecordFor(studentId, date) {
        var sid = text(studentId);
        var day = normalizeDate(date);
        return _attendanceRows.find(function (row) {
            return String(row.student_id || '') === sid && String(row.date || '').slice(0, 10) === day;
        }) || null;
    }

    function attendanceDisplayStatus(status) {
        var cur = text(status);
        if (cur === '결석') return '결석';
        if (cur === '출석') return '출석';
        return '출결 전';
    }

    function nextAttendanceStatus(status) {
        var raw = text(status);
        if (!raw || raw === '미기록' || raw === '출결 전') return '출석';
        return attendanceDisplayStatus(raw) === '출석' ? '결석' : '출석';
    }

    function attendanceCompactLabel(status) {
        var cur = attendanceDisplayStatus(status);
        if (cur === '결석') return '결석';
        if (cur === '출석') return '출석';
        return '전';
    }

    function attendanceButtonClass(status) {
        var cur = attendanceDisplayStatus(status);
        if (cur === '결석') return ' is-absent';
        if (cur === '출석') return ' is-present';
        return ' is-empty';
    }

    function studentTeacherNames(student) {
        var raw = rawOf(student);
        var values = [];
        if (Array.isArray(student && student.teacher_names)) values = values.concat(student.teacher_names);
        if (Array.isArray(raw.teacher_names)) values = values.concat(raw.teacher_names);
        values = values.concat(text(student && (student.teacher_name || student.teacher_name_raw)).split(','));
        values = values.concat(text(raw.teacher_name || raw.teacher_name_raw).split(','));
        return uniqueNames(values);
    }

    function renderDetailRow(label, value) {
        return '<div class="eie-detail-row"><span>' + esc(label) + '</span><strong>' + esc(value || '(없음)') + '</strong></div>';
    }

    function renderGradeSelect(id, value) {
        var selected = normalizeGrade(value);
        var grades = ['중1', '중2', '중3', '고1', '고2', '고3'];
        return '<select id="' + esc(id) + '">'
            + '<option value="">선택</option>'
            + grades.map(function (grade) {
                return '<option value="' + esc(grade) + '"' + (selected === grade ? ' selected' : '') + '>' + esc(grade) + '</option>';
            }).join('')
            + '</select>';
    }

    function renderStudentTypeSelect(id, value) {
        var selected = value || '일반';
        var types = ['일반', '신입', '재등록', '휴원'];
        return '<select id="' + esc(id) + '">'
            + types.map(function (type) {
                return '<option value="' + esc(type) + '"' + (selected === type ? ' selected' : '') + '>' + esc(type) + '</option>';
            }).join('')
            + '</select>';
    }

    function renderStudentTeacherPicker(student) {
        var selected = studentTeacherNames(student);
        var roster = teacherRoster();
        if (!roster.length && selected.length) roster = selected;
        if (!roster.length) return '';
        return '<div class="eie-apms-teacher-picker is-wide">'
            + '<div class="eie-apms-form-label">담당 선생님</div>'
            + '<div class="eie-apms-teacher-options">'
            + roster.map(function (name) {
                var checked = selected.indexOf(name) >= 0;
                return '<label class="eie-apms-teacher-option">'
                    + '<input type="checkbox" name="cls-edit-teacher" value="' + esc(name) + '"' + (checked ? ' checked' : '') + '>'
                    + '<span>' + esc(name) + '</span>'
                    + '</label>';
            }).join('')
            + '</div>'
            + '</div>';
    }

    function renderSummary(cells) {
        var total = cells.length;
        var totalStudents = cells.reduce(function (sum, c) {
            return sum + getAssignedStudents(c).length;
        }, 0);
        var teachers = {};
        cells.forEach(function (c) {
            teacherNamesOfCell(c).forEach(function (name) { teachers[name] = true; });
        });
        return '<div class="eie-summary-bar">'
            + '<span class="eie-summary-item"><strong>' + esc(String(total)) + '</strong> 수업</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(totalStudents)) + '</strong> 학생 배정</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(Object.keys(teachers).length)) + '</strong> 선생님</span>'
            + '</div>';
    }

    // ── 학생 상세 패널 (클래스룸 컨텍스트) ──────────────────────────────
function renderCellTeacherPicker(cell) {
        var selected = teacherNamesOfCell(cell);
        var roster = teacherRoster();
        if (!roster.length && selected.length) roster = selected;
        if (!roster.length) {
            return '<div class="eie-empty-box">관리에서 선생님 계정을 만들거나 시간표에 선생님을 입력하면 선택 목록이 생깁니다.</div>';
        }
        return '<div class="eie-apms-teacher-options">'
            + roster.map(function (name) {
                var checked = selected.indexOf(name) >= 0;
                return '<label class="eie-apms-teacher-option">'
                    + '<input type="checkbox" name="cls-cell-teacher" value="' + esc(name) + '"' + (checked ? ' checked' : '') + '>'
                    + '<span>' + esc(name) + '</span>'
                    + '</label>';
            }).join('')
            + '</div>';
    }

    function renderStudentOperationRow(cell, student) {
        var sid = text(student && (student.student_id || student.id));
        var key = text(student && (student.assignment_id || student.student_id || student.id));
        var name = displayName(student);
        var grade = gradeOf(student);
        var cellId = text(cell && cell.id);
        var date = todayIso();
        var attendance = attendanceRecordFor(sid, date);
        var status = attendanceDisplayStatus(attendance && attendance.status);
        return '<div class="eie-classroom-v4-row" id="eie-class-row-' + esc(key || sid) + '">'
            + '<button type="button" class="eie-classroom-v4-name" onclick="EieClassroomView.openStudentDetail(' + jsArg(key) + ')">'
            + '<strong>' + esc(name) + '</strong>'
            + (grade ? '<span>' + esc(grade) + '</span>' : '')
            + '</button>'
            + '<button type="button" class="eie-classroom-v4-status' + attendanceButtonClass(status) + '" '
            + 'data-eie-class-attendance="' + esc(sid) + '" '
            + 'aria-label="' + esc(name + ' 출석 ' + status) + '" '
            + 'title="' + esc(status) + '" '
            + 'onclick="EieClassroomView.toggleAttendance(' + jsArg(sid) + ',' + jsArg(cellId) + ',' + jsArg(date) + ')">'
            + esc(attendanceCompactLabel(status))
            + '</button>'
            + '<button type="button" class="eie-classroom-v4-status is-consult" '
            + 'data-eie-class-consultation="' + esc(sid) + '" '
            + 'aria-label="' + esc(name + ' 상담') + '" title="상담" '
            + 'onclick="EieClassroomView.openConsultation(' + jsArg(sid) + ',' + jsArg(cellId) + ',' + jsArg(date) + ')">★</button>'
            + '</div>';
    }

    function renderClassStudentChips(cell, students) {
        if (!students.length) return '<span class="eie-p-field-value is-empty">배정된 학생이 없습니다.</span>';
        return students.map(function (student) {
            var key = text(student && (student.assignment_id || student.student_id || student.id));
            var name = displayName(student);
            return '<button type="button" class="eie-v2-card-student eie-p-chip" '
                + 'onclick="EieClassroomView.openStudentDetail(' + jsArg(key) + ')">'
                + esc(name)
                + '</button>';
        }).join('');
    }

    function renderClassAttendanceRows(cell, students) {
        if (!_attendancePanelOpen) return '';
        var cellId = text(cell && cell.id);
        var date = todayIso();
        var rows = students.length
            ? '<div class="eie-classroom-v4-board eie-classroom-attendance-board">'
                + '<div class="eie-classroom-v4-head"><span>이름</span><span>출결</span><span>상태</span></div>'
                + students.map(function (student) {
                    var sid = text(student && (student.student_id || student.id));
                    var key = text(student && (student.assignment_id || student.student_id || student.id));
                    var name = displayName(student);
                    var attendance = attendanceRecordFor(sid, date);
                    var status = attendanceDisplayStatus(attendance && attendance.status);
                    return '<div class="eie-classroom-v4-row" id="eie-class-attendance-row-' + esc(key || sid) + '">'
                        + '<button type="button" class="eie-classroom-v4-name" onclick="EieClassroomView.openStudentDetail(' + jsArg(key) + ')">'
                        + '<strong>' + esc(name) + '</strong>'
                        + '</button>'
                        + '<button type="button" class="eie-classroom-v4-status' + attendanceButtonClass(attendance && attendance.status) + '" '
                        + 'data-eie-class-attendance="' + esc(sid) + '" '
                        + 'aria-label="' + esc(name + ' 출결 ' + status) + '" '
                        + 'title="' + esc(status) + '" '
                        + 'onclick="EieClassroomView.toggleAttendance(' + jsArg(sid) + ',' + jsArg(cellId) + ',' + jsArg(date) + ')">'
                        + esc(attendanceCompactLabel(attendance && attendance.status))
                        + '</button>'
                        + '<span class="eie-classroom-attendance-state">' + esc(status) + '</span>'
                        + '</div>';
                }).join('')
                + '</div>'
            : '<div class="eie-empty-box" style="margin-top:8px;">배정된 학생이 없습니다.</div>';
        return '<span class="eie-p-section-label">출결</span>'
            + '<div class="eie-p-card" style="padding:0;">' + rows + '</div>';
    }

    // ── 수업 상세 패널 ────────────────────────────────────────────────
// ── 학생 추가 패널 ────────────────────────────────────────────────
function renderCards(cells) {
        if (!cells.length && _todayFilterDate) {
            return '<div class="eie-empty-box" data-eie-classroom-empty-today="true">오늘 수업이 없습니다.</div>';
        }
        if (!cells.length) return '<div class="eie-empty-box">등록된 수업이 없습니다.</div>';
        return '<div class="eie-admin-card-grid">'
            + sortCells(cells).map(function (cell) {
                var students = getAssignedStudents(cell);
                var isSelected = String(cell.id) === String(_selectedCellId || '');
                var kicker = [cell.day_label, cell.period_label, teacherNamesOfCell(cell).join(', ')].filter(Boolean).join(' · ');
                return '<button type="button"'
                    + ' class="eie-admin-card' + (isSelected ? ' is-selected' : '') + '"'
                    + ' onclick="EieClassroomView.openDetail(' + jsArg(cell.id) + ')">'
                    + '<span class="eie-admin-card-kicker">' + esc(kicker) + '</span>'
                    + '<strong>' + esc(cell.class_name_raw || '수업명 없음') + '</strong>'
                    + '<small>' + esc(String(students.length)) + '명 배정</small>'
                    + '</button>';
            }).join('')
            + '</div>';
    }

    window.EieClassroomView = {
        render: async function () {
            if (!_loaded) {
                try {
                    var result = await EieApi.getTimetable(null, { status: 'active,imported' });
                    _cells = result && result.fallback ? [] : asRows(result);
                    _error = (result && result.fallback) ? '클래스룸 정보를 불러오지 못했습니다.' : '';
                    _loaded = true;
                } catch (err) {
                    _error = '클래스룸 정보를 불러오지 못했습니다.';
                    _cells = [];
                }
            }
            if (!_studentsLoaded) {
                try {
                    var sResult = await EieApi.getStudents();
                    var rows = (sResult && sResult.confirmed_students)
                        || (sResult && sResult.data)
                        || (sResult && sResult.students)
                        || [];
                    _students = Array.isArray(rows) ? rows : [];
                    _studentsLoaded = true;
                } catch (e) {
                    _students = [];
                }
            }
            if (!_teachersLoaded) {
                try {
                    var tResult = await EieApi.getTeachers();
                    var tRows = (tResult && tResult.teachers) || (tResult && tResult.data) || [];
                    _teachers = uniqueNames((Array.isArray(tRows) ? tRows : []).filter(function (teacher) {
                        return text(teacher.role) !== 'disabled';
                    }).map(function (teacher) {
                        return teacher.name || teacher.display_name || teacher.teacher_name;
                    }));
                    _teachersLoaded = true;
                } catch (e2) {
                    _teachers = [];
                    _teachersLoaded = true;
                }
            }
            var today = todayIso();
            if (_attendanceLoadedDate !== today && window.EieApi && typeof EieApi.getAttendanceRecords === 'function') {
                try {
                    var aResult = await EieApi.getAttendanceRecords({ date: today });
                    _attendanceRows = (aResult && (aResult.attendance_records || aResult.attendance || aResult.data)) || [];
                    _attendanceLoadedDate = today;
                } catch (aErr) {
                    _attendanceRows = [];
                    _attendanceLoadedDate = today;
                }
            }

            var visibleCells = visibleCellsForCurrentUser(_cells);
            var showPanel = _selectedCellId !== null;
            var cell = getSelectedCell();
            if (cell && !canCurrentUserUseCell(cell)) cell = null;
            var student = (_selectedStudentKey !== null) ? getSelectedStudent() : null;
            var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
            var layoutClass = showPanel ? 'eie-timetable-layout' : '';
            var panelHtml = '';
            if (student) {
                panelHtml = await renderBorrowedTimetablePanel(cell, student);
            } else if (showPanel) {
                panelHtml = await renderBorrowedTimetablePanel(cell, null);
            }

            if (_detailOnlyMode && showPanel) {
                return '<section aria-labelledby="eie-classroom-title">'
                    + '<button type="button" class="eie-back-button" data-eie-route="teacher" aria-label="선생님 화면으로 이동" title="선생님 화면">← 선생님 화면</button>'
                    + '<div class="eie-panel eie-classroom-detail-only-panel">'
                    + '<h1 id="eie-classroom-title" class="eie-panel-title">수업 상세</h1>'
                    + errorHtml
                    + '<div class="eie-classroom-detail-only">'
                    + (panelHtml || '<div class="eie-empty-box">수업 정보를 찾지 못했습니다.</div>')
                    + '</div>'
                    + '</div>'
                    + '</section>';
            }

            return '<section aria-labelledby="eie-classroom-title">'
                + '<button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>'
                + '<div class="eie-panel">'
                + '<h1 id="eie-classroom-title" class="eie-panel-title">클래스룸</h1>'
                + errorHtml
                + (_loaded && !_error ? renderSummary(visibleCells) : '')
                + (_loaded && !_error ? renderWeekdayTabs() : '')
                + '<div class="' + layoutClass + '">'
                + '<div class="eie-timetable-main">' + renderTeacherScheduleGroups(visibleCells) + '</div>'
                + panelHtml
                + '</div>'
                + '</div>'
                + '</section>';
        },

        setDay: function (day) {
            _selectedDay = text(day);
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        openTeacher: function (name) {
            _filterTeacherName = text(name);
            _todayFilterDate = '';
            _selectedDay = activeDayLabel();
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            _detailOnlyMode = false;
            _detailOnlyReturnRoute = '';
            EieRouter.open('classroom');
        },

        openCell: function (cellId) {
            _filterTeacherName = '';
            _todayFilterDate = '';
            _detailOnlyMode = false;
            _detailOnlyReturnRoute = '';
            this.openDetail(cellId);
        },

        openTodayForTeacher: function (name, date) {
            _filterTeacherName = text(name);
            _todayFilterDate = normalizeDate(date || todayIso());
            _selectedDay = dayLabelFromDate(_todayFilterDate);
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            _detailOnlyMode = false;
            _detailOnlyReturnRoute = '';
            EieRouter.open('classroom');
        },

        openDetail: function (cellId) {
            _selectedCellId = cellId;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            _detailOnlyMode = false;
            _detailOnlyReturnRoute = '';
            EieRouter.open('classroom');
        },

        openDetailOnly: function (cellId, returnRoute) {
            _filterTeacherName = '';
            _todayFilterDate = '';
            _selectedCellId = cellId;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            _detailOnlyMode = true;
            _detailOnlyReturnRoute = text(returnRoute || 'teacher');
            EieRouter.open('classroom');
        },

        closeDetail: function () {
            var returnRoute = _detailOnlyMode ? (_detailOnlyReturnRoute || 'teacher') : 'classroom';
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            _detailOnlyMode = false;
            _detailOnlyReturnRoute = '';
            EieRouter.open(returnRoute);
        },

        openStudentDetail: function (studentKey) {
            _selectedStudentKey = studentKey;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        closeStudentDetail: function () {
            _selectedStudentKey = null;
            _editStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        startStudentEdit: function () {
            _editStudentMode = true;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        cancelStudentEdit: function () {
            _editStudentMode = false;
            EieRouter.open('classroom');
        },

        startCellTeachersEdit: function () {
            _editCellTeachersMode = true;
            _selectedStudentKey = null;
            _addStudentMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        cancelCellTeachersEdit: function () {
            _editCellTeachersMode = false;
            EieRouter.open('classroom');
        },

        submitCellTeachers: async function (cellId) {
            if (_saving) return;
            var msgEl = document.getElementById('eie-cell-msg');
            var checked = Array.prototype.slice.call(document.querySelectorAll('input[name="cls-cell-teacher"]:checked'));
            var teacherNames = uniqueNames(checked.map(function (input) { return input.value; }));
            if (!teacherNames.length) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">담임 선생님을 1명 이상 선택해 주세요.</div>';
                return;
            }
            _saving = true;
            try {
                var result = await EieApi.updateTimetableCell(cellId, {
                    teacher_name_raw: teacherNames[0],
                    teacher_names: teacherNames
                });
                var saved = result && (result.timetable_cell || result.data);
                if (saved && saved.id) {
                    var index = _cells.findIndex(function (cell) { return String(cell.id) === String(saved.id); });
                    if (index >= 0) _cells.splice(index, 1, saved);
                }
                _loaded = false;
                _editCellTeachersMode = false;
                _saving = false;
                EieRouter.open('classroom');
            } catch (err) {
                _saving = false;
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '저장하지 못했습니다.') + '</div>';
                EieRouter.open('classroom');
            }
        },

        submitStudentEdit: async function (studentId) {
            if (_saving) return;
            var nameEl = document.getElementById('cls-edit-name');
            var gradeEl = document.getElementById('cls-edit-grade');
            var schoolEl = document.getElementById('cls-edit-school');
            var phoneEl = document.getElementById('cls-edit-phone');
            var parentPhoneEl = document.getElementById('cls-edit-parent-phone');
            var relationEl = document.getElementById('cls-edit-guardian-relation');
            var addressEl = document.getElementById('cls-edit-address');
            var vehicleEl = document.getElementById('cls-edit-vehicle');
            var pinEl = document.getElementById('cls-edit-pin');
            var typeEl = document.getElementById('cls-edit-student-type');
            var statusEl = document.getElementById('cls-edit-status');
            var memoEl = document.getElementById('cls-edit-memo');
            var msgEl = document.getElementById('eie-classroom-student-msg');
            var teacherInputs = Array.prototype.slice.call(document.querySelectorAll ? document.querySelectorAll('input[name="cls-edit-teacher"]:checked') : []);

            var name = nameEl ? nameEl.value.trim() : '';
            if (!name) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">이름은 필수입니다.</div>';
                return;
            }
            var pin = pinEl ? pinEl.value.trim() : '';
            if (pin && !/^\d{4}$/.test(pin)) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">PIN은 4자리 숫자로 입력해 주세요.</div>';
                return;
            }

            _saving = true;
            if (msgEl) msgEl.innerHTML = '';
            try {
                await EieApi.updateStudent(studentId, {
                    display_name: name,
                    grade: gradeEl ? gradeEl.value.trim() : '',
                    school_name: schoolEl ? schoolEl.value.trim() : '',
                    phone: phoneEl ? phoneEl.value.trim() : undefined,
                    student_phone: phoneEl ? phoneEl.value.trim() : '',
                    parent_phone: parentPhoneEl ? parentPhoneEl.value.trim() : '',
                    guardian_relation: relationEl ? relationEl.value.trim() : '',
                    student_address: addressEl ? addressEl.value.trim() : '',
                    vehicle_info: vehicleEl ? vehicleEl.value.trim() : '',
                    student_pin: pin,
                    student_type: typeEl ? typeEl.value : '일반',
                    teacher_names: uniqueNames(teacherInputs.map(function (input) { return input.value; })),
                    status: statusEl ? statusEl.value : undefined,
                    memo: memoEl ? memoEl.value.trim() : ''
                });
                // 학생 데이터 갱신을 위해 캐시 무효화
                _studentsLoaded = false;
                _loaded = false;
                _editStudentMode = false;
                _saving = false;
                EieRouter.open('classroom');
            } catch (err) {
                _saving = false;
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '저장하지 못했습니다.') + '</div>';
                EieRouter.open('classroom');
            }
        },

        openAddStudent: function () {
            _addStudentMode = true;
            _selectedStudentKey = null;
            _editCellTeachersMode = false;
            _attendancePanelOpen = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        closeAddStudent: function () {
            _addStudentMode = false;
            EieRouter.open('classroom');
        },

        assignStudent: async function (cellId, studentId) {
            var msgEl = document.getElementById('eie-add-student-msg');
            try {
                await EieApi.assignStudentToCell(cellId, studentId);
                _loaded = false;
                _studentsLoaded = false;
                _addStudentMode = false;
                EieRouter.open('classroom');
            } catch (err) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '배정하지 못했습니다.') + '</div>';
                EieRouter.open('classroom');
            }
        },

        removeStudent: async function (cellId, studentId) {
            var msgEl = document.getElementById('eie-classroom-student-msg');
            try {
                await EieApi.removeStudentFromCell(cellId, studentId);
                _loaded = false;
                _selectedStudentKey = null;
                EieRouter.open('classroom');
            } catch (err) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '처리하지 못했습니다.') + '</div>';
                EieRouter.open('classroom');
            }
        },

        openAttendancePanel: function () {
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            _attendancePanelOpen = true;
            EieRouter.open('classroom');
        },

        closeAttendancePanel: function () {
            _attendancePanelOpen = false;
            EieRouter.open('classroom');
        },

        toggleAttendance: async function (studentId, cellId, date) {
            var sid = text(studentId);
            var day = normalizeDate(date);
            if (!sid) return;
            var current = attendanceRecordFor(sid, day);
            var next = nextAttendanceStatus(current && current.status);
            try {
                var result = await EieApi.saveAttendanceRecord({
                    student_id: sid,
                    timetable_cell_id: text(cellId),
                    date: day,
                    status: next,
                    raw_meta_json: { source: 'classroom' }
                });
                var rows = (result && (result.attendance_records || result.attendance || (result.attendance_record ? [result.attendance_record] : (result.data ? [result.data] : [])))) || [];
                if (rows.length) {
                    _attendanceRows = _attendanceRows.filter(function (row) {
                        return String(row.student_id || '') !== sid || String(row.date || '').slice(0, 10) !== day;
                    }).concat(rows);
                    if (window.EieState && typeof EieState.mergeStudentAttendance === 'function') {
                        EieState.mergeStudentAttendance(sid, rows);
                    }
                }
                EieRouter.open('classroom');
            } catch (err) {
                var msgEl = document.getElementById('eie-cell-msg');
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '출석을 저장하지 못했습니다.') + '</div>';
                EieRouter.open('classroom');
            }
        },

openConsultation: function (studentId, cellId, date) {
            var sid = text(studentId);
            if (!sid) return;
            var cid = text(cellId);
            var cell = _cells.find(function (row) { return text(row && row.id) === cid; });
            var assigned = cell ? getAssignedStudents(cell).find(function (student) {
                return text(student && (student.student_id || student.id)) === sid;
            }) : null;
            if (cid) _selectedCellId = cid;
            _selectedStudentKey = assigned
                ? text(assigned.assignment_id || assigned.student_id || assigned.id)
                : sid;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = normalizeDate(date || todayIso());
            if (window.EieRouter && typeof EieRouter.open === 'function') {
                EieRouter.open('classroom');
            }
        }
    };
})();
