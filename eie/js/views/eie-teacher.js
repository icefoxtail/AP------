(function () {
    var _teacherName = '';
    var _cells = [];
    var _loaded = false;
    var _error = '';
    var _tab = 'all';

    function esc(value) {
        return EieApp.escapeHtml(value == null ? '' : value);
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function normalizeName(value) {
        if (window.EieClassroomScope && typeof EieClassroomScope.teacherKey === 'function') {
            return EieClassroomScope.teacherKey(value);
        }
        return text(value).replace(/\s+/g, '').toLowerCase();
    }

    function readJson(value) {
        if (!value) return {};
        if (typeof value === 'object') return value;
        try { return JSON.parse(value); }
        catch (error) { return {}; }
    }

    function uniqueNames(values) {
        var map = {};
        (values || []).forEach(function (value) {
            String(value || '').split(',').forEach(function (part) {
                var name = text(part);
                if (name) map[normalizeName(name)] = name;
            });
        });
        return Object.keys(map).map(function (key) { return map[key]; });
    }

    function rowsFromPayload(payload) {
        if (Array.isArray(payload && payload.timetable_cells)) return payload.timetable_cells;
        if (Array.isArray(payload && payload.data)) return payload.data;
        return [];
    }

    function stateCells() {
        var state = window.EieState && typeof EieState.get === 'function' ? EieState.get() : {};
        var rows = state && state.db && Array.isArray(state.db.timetable_cells) ? state.db.timetable_cells : [];
        return rows.length ? rows : [];
    }

    function stateDb() {
        var state = window.EieState && typeof EieState.get === 'function' ? EieState.get() : {};
        return state && state.db ? state.db : {};
    }

    function storedTeacherName() {
        if (typeof window === 'undefined' || !window.localStorage) return '';
        return text(window.localStorage.getItem('WANGJI_EIE_NAME') || '');
    }

    function getAssignedStudents(cell) {
        return Array.isArray(cell && cell.assigned_students) ? cell.assigned_students : [];
    }

    function teacherNamesFromCell(cell) {
        if (window.EieClassroomScope && typeof EieClassroomScope.accessTeacherNamesForCell === 'function') {
            return EieClassroomScope.accessTeacherNamesForCell(cell);
        }
        var raw = readJson(cell && cell.raw_meta_json);
        return uniqueNames([]
            .concat(Array.isArray(cell && cell.teacher_names) ? cell.teacher_names : [])
            .concat(Array.isArray(raw.teacher_names) ? raw.teacher_names : [])
            .concat([
                cell && cell.teacher_name_raw,
                cell && cell.teacher_name,
                raw.teacher_name_raw,
                raw.teacher_name
            ]));
    }

    function teacherRoster(cells) {
        var names = {};
        ['Carmen', 'IVY', 'Lily', 'Stacy', 'Zoe', 'Laura'].forEach(function (name) {
            names[normalizeName(name)] = name;
        });
        var stored = storedTeacherName();
        if (stored) names[normalizeName(stored)] = stored;
        (cells || []).forEach(function (cell) {
            teacherNamesFromCell(cell).forEach(function (name) {
                names[normalizeName(name)] = name;
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

    function isJointCell(cell, teacherName) {
        return matchTeacherNamesForCell(cell, teacherRoster(_cells)).filter(function (name) {
            return normalizeName(name) !== normalizeName(teacherName);
        }).length > 0;
    }

    function todayLabel() {
        return ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()];
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
        if (window.EieClassroomScope && typeof EieClassroomScope.isCellOnDate === 'function') {
            return EieClassroomScope.isCellOnDate(cell, todayIso());
        }
        var day = text(cell && (cell.day_label || cell.day));
        if (!day) return false;
        return day.indexOf(todayLabel()) !== -1;
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
                    className: cell.class_name_raw || '',
                    cellId: cell.id || ''
                };
            });
        });
        return Object.keys(map).map(function (key) { return map[key]; }).sort(function (a, b) {
            return text(a.name).localeCompare(text(b.name), 'ko');
        });
    }

    function firstAssignedStudent(cells) {
        return uniqueStudents(cells || [])[0] || null;
    }

    function currentTeacherCells() {
        return cellsForTeacher(_cells, _teacherName);
    }

    function sortCells(cells) {
        return (cells || []).slice().sort(function (a, b) {
            var dayA = text(a.day_label || a.day);
            var dayB = text(b.day_label || b.day);
            var d = dayA.localeCompare(dayB, 'ko');
            if (d) return d;
            var pA = Number(a.period_order || 0);
            var pB = Number(b.period_order || 0);
            if (pA !== pB) return pA - pB;
            return Number(a.column_index || 0) - Number(b.column_index || 0);
        });
    }

    function attendanceRows() {
        var db = stateDb();
        return []
            .concat(Array.isArray(db.attendance) ? db.attendance : [])
            .concat(Array.isArray(db.attendance_records) ? db.attendance_records : []);
    }

    function attendanceStatusOf(studentId) {
        var sid = text(studentId);
        if (!sid) return '';
        var today = todayIso();
        var row = attendanceRows().find(function (item) {
            var rowStudentId = text(item.student_id || item.studentId || item.eie_student_id);
            var rowDate = text(item.date || item.attendance_date || item.record_date || item.created_at).slice(0, 10);
            return rowStudentId === sid && rowDate === today;
        });
        return text(row && (row.status || row.attendance_status || row.value));
    }

    function classAttendanceSummary(cell) {
        var students = getAssignedStudents(cell);
        var present = 0;
        var absent = 0;
        students.forEach(function (student) {
            var status = attendanceStatusOf(student.student_id || student.id);
            if (/결석|absent|missing/i.test(status)) absent += 1;
            else if (/등원|출석|present|attended|done/i.test(status)) present += 1;
        });
        return {
            activeCount: students.length,
            present: present,
            absent: absent
        };
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
        if (stored) {
            _teacherName = stored;
            return;
        }
        if (roster.length) _teacherName = roster[0];
    }

    function renderShortcutRow() {
        return '<div class="eie-teacher-shortcuts ap-dashboard-shortcuts ap-dashboard-action-grid ap-dashboard-action-grid--teacher-quick">'
            + '<button class="btn ap-dashboard-action-button" type="button" onclick="EieTeacherView.openTodayClassroom()">클래스룸</button>'
            + '<button class="btn ap-dashboard-action-button" type="button" onclick="EieTeacherView.openTimetable()">시간표</button>'
            + '<button class="btn ap-dashboard-action-button" type="button" onclick="EieTeacherView.openAttendanceLedger()">출석부</button>'
            + '<button class="btn ap-dashboard-action-button" type="button" onclick="EieTeacherView.openConsultations()">학생상담</button>'
            + '</div>';
    }

    function renderTodayClassSummary(cells) {
        var todayCells = cells.filter(isTodayCell);
        var content = todayCells.length
            ? todayCells.map(function (cell) {
                return esc(cell.class_name_raw || '수업명 없음') + ' ' + esc(String(getAssignedStudents(cell).length)) + '명';
            }).join(' · ')
            : '오늘 수업 없음';

        return '<div class="ap-dashboard-section ap-dashboard-journal-section ap-dashboard-journal-section--teacher eie-teacher-today">'
            + '<div class="ap-dashboard-section-head ap-dashboard-journal-head">'
            + '<h3 class="ap-dashboard-journal-title">오늘일지</h3>'
            + '</div>'
            + '<div class="ap-dashboard-journal-summary ap-dashboard-journal-summary--plain">' + content + '</div>'
            + '<div class="journal-matrix">'
            + renderJournalDayRow(0)
            + renderJournalDayRow(1)
            + '</div>'
            + '</div>';
    }

    function renderJournalDayRow(offsetDays) {
        return '<button class="journal-day-cell journal-day-cell--missing" type="button" onclick="EieTeacherView.showPreparing(\'일지\')" data-eie-journal-date="' + esc(isoDate(offsetDays)) + '">'
            + '<span class="journal-day-cell__label">' + esc(koreanDate(offsetDays)) + '</span>'
            + '<span class="journal-day-cell__spacer"></span>'
            + '<span class="journal-day-cell__status">미작성</span>'
            + '<span class="journal-day-cell__chevron" aria-hidden="true">›</span>'
            + '</button>';
    }

    function renderTodaySchedule(cells) {
        var todayRows = sortCells((cells || []).filter(isTodayCell));
        return '<div class="eie-teacher-schedule">'
            + '<div class="ap-dashboard-section-head eie-teacher-section-head"><h3>오늘일정</h3></div>'
            + '<div class="ap-dashboard-surface-list ap-dashboard-surface-list--today">'
            + (todayRows.length ? todayRows.map(function (cell) {
                return '<button class="eie-teacher-schedule-row" type="button" onclick="EieTeacherView.openClassroom(' + JSON.stringify(String(cell.id || '')) + ')">'
                    + '<span class="eie-teacher-schedule-check" aria-hidden="true"></span>'
                    + '<span class="eie-teacher-schedule-copy"><strong>' + esc(cell.class_name_raw || '수업') + '</strong><small>' + esc([cell.period_label, teacherNamesFromCell(cell).join(', ')].filter(Boolean).join(' · ')) + '</small></span>'
                    + '</button>';
            }).join('') : '<div class="eie-empty-box" data-eie-teacher-empty-today="true">오늘 수업이 없습니다.</div>')
            + '</div>'
            + '</div>';
    }

    function renderTabbar() {
        var items = [
            { key: 'all', label: '전체' },
            { key: 'elementary', label: '초등' },
            { key: 'middle', label: '중등' }
        ];
        return '<div class="ap-dashboard-tabbar eie-teacher-tabbar">'
            + items.map(function (item) {
                return '<button class="btn' + (_tab === item.key ? ' is-active' : '') + '" type="button" onclick="EieTeacherView.setTab(' + JSON.stringify(item.key) + ')">'
                    + esc(item.label)
                    + '</button>';
            }).join('')
            + '</div>';
    }

    function filteredCells(cells) {
        if (_tab === 'elementary') return cells.filter(function (cell) {
            return /초|초등|elementary|ES/i.test(text(cell && cell.class_name_raw));
        });
        if (_tab === 'middle') return cells.filter(function (cell) {
            return /중|M|중등/i.test(text(cell && cell.class_name_raw));
        });
        return cells;
    }

    function renderClassRow(cell) {
        var summary = classAttendanceSummary(cell);
        var teachers = matchTeacherNamesForCell(cell, teacherRoster(_cells));
        var meta = [cell.day_label, cell.period_label, teachers.join(', ')].filter(Boolean).join(' · ');
        var name = cell.class_name_raw || '수업명 없음';
        return '<button type="button" class="ap-class-row ap-class-row--scheduled eie-teacher-class-row" onclick="EieTeacherView.openClassroom(' + JSON.stringify(String(cell.id || '')) + ')">'
            + '<div class="ap-class-row__name">' + esc(name) + '</div>'
            + '<div class="ap-class-row__chips">'
            + '<span class="ap-class-chip">재원 ' + esc(String(summary.activeCount)) + '</span>'
            + '<span class="ap-class-chip">등원 ' + esc(String(summary.present)) + '</span>'
            + '<span class="ap-class-chip">결석 ' + esc(String(summary.absent)) + '</span>'
            + '</div>'
            + '</button>';
    }

    function renderClassStatus(cells) {
        var rows = filteredCells(cells);
        return '<div class="ap-dashboard-section-head eie-teacher-section-head">'
            + '<h3>학급관리</h3>'
            + '<span>' + esc(String(rows.length)) + '개 수업</span>'
            + '</div>'
            + renderTabbar()
            + '<div class="ap-dashboard-class-list">'
            + (rows.length ? sortCells(rows).map(renderClassRow).join('') : '<div class="eie-empty-box">담당 수업이 아직 없습니다.</div>')
            + '</div>';
    }

    async function render() {
        await loadCells();
        var roster = teacherRoster(_cells);
        ensureTeacherName(roster);
        var teacherCells = cellsForTeacher(_cells, _teacherName);
        var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';

        return '<section class="eie-teacher-dashboard" aria-labelledby="eie-teacher-title">'
            + '<h1 id="eie-teacher-title" class="eie-teacher-sr-title">' + esc(_teacherName || '선생님') + ' 선생님 대시보드</h1>'
            + '<div class="ap-dashboard-shell eie-teacher-dashboard-shell">'
            + renderShortcutRow()
            + errorHtml
            + renderTodayClassSummary(teacherCells)
            + renderTodaySchedule(teacherCells)
            + renderClassStatus(teacherCells)
            + '</div>'
            + '</section>';
    }

    window.EieTeacherView = {
        render: render,
        openTeacher: function (teacherName) {
            _teacherName = text(teacherName);
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('teacher');
        },
        setTab: function (tab) {
            _tab = text(tab) || 'all';
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
        openTodayClassroom: function () {
            if (_teacherName && window.EieClassroomView && typeof EieClassroomView.openTodayForTeacher === 'function') {
                EieClassroomView.openTodayForTeacher(_teacherName);
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
            var student = firstAssignedStudent(currentTeacherCells());
            if (student && student.id && window.EieStudentsView && typeof EieStudentsView.openDetail === 'function') {
                EieStudentsView.openDetail(student.id, { from: 'teacher', tab: 'attendance' }, 'attendance');
                return;
            }
            if (_teacherName && window.EieStudentsView && typeof EieStudentsView.setTeacherFilter === 'function') {
                EieStudentsView.setTeacherFilter(_teacherName);
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('students');
        },
        openConsultations: function () {
            var student = firstAssignedStudent(currentTeacherCells());
            if (student && student.id && window.EieStudentsView && typeof EieStudentsView.openDetail === 'function') {
                EieStudentsView.openDetail(student.id, { from: 'teacher', tab: 'consultation' }, 'consultation');
                return;
            }
            if (_teacherName && window.EieStudentsView && typeof EieStudentsView.setTeacherFilter === 'function') {
                EieStudentsView.setTeacherFilter(_teacherName);
                return;
            }
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('students');
        },
        showPreparing: function (label) {
            if (typeof window !== 'undefined' && window.alert) window.alert(label + ' 기능은 준비중입니다.');
        },
        matchTeacherNamesForCell: matchTeacherNamesForCell,
        cellsForTeacher: cellsForTeacher,
        teacherNamesFromCell: teacherNamesFromCell
    };
})();
