(function () {
    var _teacherName = '';
    var _cells = [];
    var _loaded = false;
    var _error = '';

    function esc(value) {
        return EieApp.escapeHtml(value == null ? '' : value);
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function normalizeName(value) {
        return text(value).replace(/\s+/g, '').toLowerCase();
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

    function getAssignedStudents(cell) {
        return Array.isArray(cell && cell.assigned_students) ? cell.assigned_students : [];
    }

    function teacherRoster(cells) {
        var names = {};
        ['Carmen', 'IVY', 'Lily', 'Stacy', 'Zoe', 'Laura'].forEach(function (name) {
            names[name] = true;
        });
        (cells || []).forEach(function (cell) {
            var direct = text(cell && (cell.teacher_name_raw || cell.teacher_name));
            if (direct) names[direct] = true;
        });
        return Object.keys(names).sort(function (a, b) { return a.localeCompare(b, 'ko'); });
    }

    function matchTeacherNamesForCell(cell, roster) {
        var found = {};
        var direct = text(cell && (cell.teacher_name_raw || cell.teacher_name));
        var directKey = normalizeName(direct);
        (roster || []).forEach(function (name) {
            var key = normalizeName(name);
            if (!key) return;
            if (directKey && directKey === key) found[name] = true;
            var haystack = normalizeName([
                cell && cell.class_name_raw,
                cell && cell.memo,
                cell && cell.raw_class_name
            ].filter(Boolean).join(' '));
            if (haystack && haystack.indexOf(key) !== -1) found[name] = true;
        });
        return Object.keys(found);
    }

    function cellsForTeacher(cells, teacherName) {
        var roster = teacherRoster(cells);
        var targetKey = normalizeName(teacherName);
        if (!targetKey) return [];
        return (cells || []).filter(function (cell) {
            return matchTeacherNamesForCell(cell, roster).some(function (name) {
                return normalizeName(name) === targetKey;
            });
        });
    }

    function uniqueStudents(cells) {
        var map = {};
        (cells || []).forEach(function (cell) {
            getAssignedStudents(cell).forEach(function (student) {
                var key = text(student.student_id || student.id || student.display_name || student.name);
                if (!key || map[key]) return;
                map[key] = {
                    name: student.display_name || student.name || student.student_name_raw || '-',
                    grade: student.grade_raw || student.grade || ''
                };
            });
        });
        return Object.keys(map).map(function (key) { return map[key]; });
    }

    function sortCells(cells) {
        return (cells || []).slice().sort(function (a, b) {
            var pA = Number(a.period_order || 0);
            var pB = Number(b.period_order || 0);
            if (pA !== pB) return pA - pB;
            return Number(a.column_index || 0) - Number(b.column_index || 0);
        });
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

    function renderTeacherTabs(roster) {
        return '<div class="eie-apms-toolbar">'
            + roster.map(function (name) {
                var active = normalizeName(name) === normalizeName(_teacherName);
                return '<button type="button" class="' + (active ? 'eie-primary-button' : 'eie-secondary-button') + '" onclick="EieTeacherView.openTeacher(' + JSON.stringify(name) + ')">' + esc(name) + '</button>';
            }).join('')
            + '</div>';
    }

    function renderSummary(name, cells) {
        var students = uniqueStudents(cells);
        return '<div class="eie-apms-summary-grid">'
            + '<div class="eie-apms-summary-item"><strong>' + esc(String(cells.length)) + '</strong><span>담당/공동 수업</span></div>'
            + '<div class="eie-apms-summary-item"><strong>' + esc(String(students.length)) + '</strong><span>담당 학생</span></div>'
            + '<div class="eie-apms-summary-item"><strong>' + esc(name || '-') + '</strong><span>선생님 페이지</span></div>'
            + '</div>';
    }

    function renderClassCards(cells) {
        if (!cells.length) return '<div class="eie-empty-box">이 선생님으로 매칭된 수업이 아직 없습니다.</div>';
        return '<div class="eie-admin-card-grid">'
            + sortCells(cells).map(function (cell) {
                var students = getAssignedStudents(cell);
                var teachers = matchTeacherNamesForCell(cell, teacherRoster(_cells)).join(', ') || cell.teacher_name_raw || '-';
                var kicker = [cell.day_label, cell.period_label, teachers].filter(Boolean).join(' · ');
                return '<button type="button" class="eie-admin-card" onclick="EieTeacherView.openClassroom()">'
                    + '<span class="eie-admin-card-kicker">' + esc(kicker) + '</span>'
                    + '<strong>' + esc(cell.class_name_raw || '수업명 없음') + '</strong>'
                    + '<small>' + esc(String(students.length)) + '명 배정</small>'
                    + '</button>';
            }).join('')
            + '</div>';
    }

    function renderStudentList(cells) {
        var students = uniqueStudents(cells);
        if (!students.length) return '<div class="eie-empty-box">배정된 학생이 아직 없습니다.</div>';
        return '<div class="eie-apms-card" style="padding:0;overflow:hidden;">'
            + students.map(function (student) {
                return '<div class="eie-apms-contact-row">'
                    + '<div><strong>' + esc(student.name) + '</strong><span>' + esc(student.grade || '학년 정보 없음') + '</span></div>'
                    + '</div>';
            }).join('')
            + '</div>';
    }

    async function render() {
        await loadCells();
        var roster = teacherRoster(_cells);
        if (!_teacherName && roster.length) _teacherName = roster[0];
        var teacherCells = cellsForTeacher(_cells, _teacherName);
        var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
        return '<section class="eie-apms-students-screen" aria-labelledby="eie-teacher-title">'
            + '<button type="button" class="eie-back-button" data-eie-route="management" aria-label="관리로 이동" title="관리">← 관리</button>'
            + '<div class="eie-apms-page-head">'
            + '<div><h1 id="eie-teacher-title">' + esc(_teacherName || '선생님') + ' 선생님</h1><p>APMath teacher 화면처럼 담당 수업과 학생을 한 곳에서 확인합니다.</p></div>'
            + '</div>'
            + errorHtml
            + renderTeacherTabs(roster)
            + renderSummary(_teacherName, teacherCells)
            + '<div class="eie-apms-student-layout">'
            + '<div class="eie-apms-list-panel"><h2 class="eie-admin-section-title">담당 수업</h2>' + renderClassCards(teacherCells) + '</div>'
            + '<aside class="eie-apms-detail-panel"><div class="eie-apms-detail-head"><h2>담당 학생</h2><button type="button" class="eie-secondary-button" onclick="EieTeacherView.openClassroom()">클래스룸</button></div>'
            + renderStudentList(teacherCells)
            + '<div class="eie-empty-box" style="margin-top:12px;">숙제, 리포트, 오답, 일지는 준비중입니다.</div>'
            + '</aside>'
            + '</div>'
            + '</section>';
    }

    window.EieTeacherView = {
        render: render,
        openTeacher: function (teacherName) {
            _teacherName = text(teacherName);
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('teacher');
        },
        openClassroom: function () {
            if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('classroom');
        },
        matchTeacherNamesForCell: matchTeacherNamesForCell,
        cellsForTeacher: cellsForTeacher
    };
})();
