(function () {
    var _cells = [];
    var _error = '';
    var _loaded = false;
    var _selectedCellId = null;
    var _selectedStudentKey = null;

    function esc(value) {
        return EieApp.escapeHtml(value);
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
        return _cells.find(function (c) {
            return String(c.id) === String(_selectedCellId);
        }) || null;
    }

    function getSelectedStudent() {
        if (_selectedStudentKey === null) return null;
        var cell = getSelectedCell();
        if (!cell) return null;
        return getAssignedStudents(cell).find(function (s) {
            return String(s.assignment_id || s.student_id || '') === String(_selectedStudentKey);
        }) || null;
    }

    function renderSummary(cells) {
        var total = cells.length;
        var totalStudents = cells.reduce(function (sum, c) {
            return sum + getAssignedStudents(c).length;
        }, 0);
        var teachers = {};
        cells.forEach(function (c) {
            if (c.teacher_name_raw) teachers[c.teacher_name_raw] = true;
        });
        var teacherCount = Object.keys(teachers).length;
        return '<div class="eie-summary-bar">'
            + '<span class="eie-summary-item"><strong>' + esc(String(total)) + '</strong> 수업</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(totalStudents)) + '</strong> 학생 배정</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(teacherCount)) + '</strong> 선생님</span>'
            + '</div>';
    }

    function renderStudentDetail(student, cell) {
        if (!student) return '';
        var name = student.display_name || student.name || student.student_name_raw || '-';
        var grade = student.grade_raw || student.grade || '-';
        var phone = student.phone_raw || student.phone || student.normalized_phone || '-';
        return '<aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">'
            + '<div class="eie-editor-head">'
            + '<h2>학생 상세</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.closeStudentDetail()">닫기</button>'
            + '</div>'
            + '<div class="eie-student-detail-title"><strong>' + esc(name) + '</strong></div>'
            + '<div class="eie-detail-grid">'
            + '<div class="eie-detail-row"><span>학년</span><strong>' + esc(grade) + '</strong></div>'
            + '<div class="eie-detail-row"><span>전화번호</span><strong>' + esc(phone) + '</strong></div>'
            + (cell ? '<div class="eie-detail-row"><span>수업</span><strong>' + esc(cell.class_name_raw || '-') + '</strong></div>' : '')
            + (cell ? '<div class="eie-detail-row"><span>선생님</span><strong>' + esc(cell.teacher_name_raw || '-') + '</strong></div>' : '')
            + (cell ? '<div class="eie-detail-row"><span>교시</span><strong>' + esc(cell.period_label || '-') + '</strong></div>' : '')
            + '</div>'
            + '</aside>';
    }

    function renderCellDetail(cell) {
        if (!cell) return '';
        var students = getAssignedStudents(cell);
        var studentsHtml = students.length
            ? '<div class="eie-admin-section-title-row" style="margin-top:14px;">'
                + '<h3 class="eie-admin-section-title">학생 목록</h3></div>'
                + '<div class="eie-cell-students">'
                + students.map(function (s) {
                    var key = s.assignment_id || s.student_id || '';
                    var name = s.display_name || s.name || '';
                    return '<button type="button" class="eie-student-chip"'
                        + ' onclick="EieClassroomView.openStudentDetail(' + esc(JSON.stringify(String(key))) + ')">'
                        + esc(name)
                        + '</button>';
                }).join('')
                + '</div>'
            : '<div class="eie-empty-box">배정된 학생이 없습니다.</div>';
        return '<aside class="eie-editor-panel" aria-label="수업 상세">'
            + '<div class="eie-editor-head">'
            + '<h2>' + esc(cell.class_name_raw || '수업명 없음') + '</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.closeDetail()">닫기</button>'
            + '</div>'
            + '<div class="eie-detail-grid">'
            + '<div class="eie-detail-row"><span>선생님</span><strong>' + esc(cell.teacher_name_raw || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>교시</span><strong>' + esc(cell.period_label || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>시간</span><strong>' + esc([cell.start_time, cell.end_time].filter(Boolean).join('~') || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>학생 수</span><strong>' + esc(String(students.length)) + '명</strong></div>'
            + '</div>'
            + studentsHtml
            + '</aside>';
    }

    function renderCards(cells) {
        if (!cells.length) return '<div class="eie-empty-box">등록된 수업이 없습니다.</div>';
        return '<div class="eie-admin-card-grid">'
            + sortCells(cells).map(function (cell) {
                var students = getAssignedStudents(cell);
                var isSelected = String(cell.id) === String(_selectedCellId || '');
                var kicker = [cell.period_label, cell.teacher_name_raw].filter(Boolean).join(' ');
                return '<button type="button"'
                    + ' class="eie-admin-card' + (isSelected ? ' is-selected' : '') + '"'
                    + ' onclick="EieClassroomView.openDetail(' + esc(JSON.stringify(String(cell.id))) + ')">'
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
                    if (result && result.fallback === true) {
                        _error = '클래스룸 정보를 불러오지 못했습니다.';
                        _cells = [];
                    } else {
                        _cells = asRows(result);
                        _error = '';
                        _loaded = true;
                    }
                } catch (err) {
                    _error = '클래스룸 정보를 불러오지 못했습니다.';
                    _cells = [];
                }
            }

            var showPanel = _selectedCellId !== null;
            var cell = getSelectedCell();
            var student = (_selectedStudentKey !== null) ? getSelectedStudent() : null;
            var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
            var layoutClass = showPanel ? 'eie-timetable-layout' : '';
            var panelHtml = '';
            if (student) {
                panelHtml = renderStudentDetail(student, cell);
            } else if (showPanel) {
                panelHtml = renderCellDetail(cell);
            }

            return '<section aria-labelledby="eie-classroom-title">'
                + '<button type="button" class="eie-back-button" onclick="EieRouter.open(\'dashboard\')">← EIE 홈</button>'
                + '<div class="eie-panel">'
                + '<h1 id="eie-classroom-title" class="eie-panel-title">클래스룸</h1>'
                + errorHtml
                + (_loaded && !_error ? renderSummary(_cells) : '')
                + '<div class="' + layoutClass + '">'
                + '<div class="eie-timetable-main">' + renderCards(_cells) + '</div>'
                + panelHtml
                + '</div>'
                + '</div>'
                + '</section>';
        },

        openDetail: function (cellId) {
            _selectedCellId = cellId;
            _selectedStudentKey = null;
            EieRouter.open('classroom');
        },

        closeDetail: function () {
            _selectedCellId = null;
            _selectedStudentKey = null;
            EieRouter.open('classroom');
        },

        openStudentDetail: function (studentKey) {
            _selectedStudentKey = studentKey;
            EieRouter.open('classroom');
        },

        closeStudentDetail: function () {
            _selectedStudentKey = null;
            EieRouter.open('classroom');
        }
    };
})();
