(function () {
    var _cells = [];
    var _students = [];          // 전체 학생 목록 (배정 추가용)
    var _error = '';
    var _loaded = false;
    var _studentsLoaded = false;
    var _selectedCellId = null;
    var _selectedStudentKey = null;
    var _editStudentMode = false; // 학생 상세 수정 모드
    var _saving = false;
    var _addStudentMode = false;  // 학생 추가 패널

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
        return _cells.find(function (c) { return String(c.id) === String(_selectedCellId); }) || null;
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
        return '<div class="eie-summary-bar">'
            + '<span class="eie-summary-item"><strong>' + esc(String(total)) + '</strong> 수업</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(totalStudents)) + '</strong> 학생 배정</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(Object.keys(teachers).length)) + '</strong> 선생님</span>'
            + '</div>';
    }

    // ── 학생 상세 패널 (클래스룸 컨텍스트) ──────────────────────────────
    function renderStudentDetail(student, cell) {
        if (!student) return '';
        var sid = String(student.student_id || student.id || '');
        var cellId = cell ? String(cell.id || '') : '';
        var name = student.display_name || student.name || student.student_name_raw || '-';
        var grade = student.grade_raw || student.grade || '';
        var phone = student.phone_raw || student.phone || student.normalized_phone || '';

        if (_editStudentMode) {
            return '<aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 수정">'
                + '<div class="eie-editor-head">'
                + '<h2>학생 수정</h2>'
                + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.cancelStudentEdit()">취소</button>'
                + '</div>'
                + '<div id="eie-classroom-student-msg"></div>'
                + '<div class="eie-edit-form" style="margin-top:12px;">'
                + '<label>이름 <span style="color:var(--eie-primary)">*</span>'
                + '<input type="text" id="cls-edit-name" value="' + esc(name) + '">'
                + '</label>'
                + '<label>학년'
                + '<input type="text" id="cls-edit-grade" value="' + esc(grade) + '" placeholder="예: 중2">'
                + '</label>'
                + '<label class="is-wide">연락처'
                + '<input type="tel" id="cls-edit-phone" value="' + esc(phone) + '" placeholder="010-0000-0000">'
                + '</label>'
                + '<label>상태'
                + '<select id="cls-edit-status">'
                + '<option value="active"' + ((student.status || 'active') === 'active' ? ' selected' : '') + '>재원</option>'
                + '<option value="inactive"' + (student.status === 'inactive' ? ' selected' : '') + '>비활성</option>'
                + '<option value="archived"' + (student.status === 'archived' ? ' selected' : '') + '>보관</option>'
                + '</select>'
                + '</label>'
                + '<label class="is-wide">메모'
                + '<textarea id="cls-edit-memo" style="resize:vertical;min-height:60px;">' + esc(student.memo || '') + '</textarea>'
                + '</label>'
                + '<div class="eie-action-row is-wide">'
                + '<button type="button" class="eie-primary-button" onclick="EieClassroomView.submitStudentEdit(' + JSON.stringify(sid) + ')" ' + (_saving ? 'disabled' : '') + '>'
                + (_saving ? '저장 중...' : '저장')
                + '</button>'
                + '<button type="button" class="eie-secondary-button" onclick="EieClassroomView.cancelStudentEdit()">취소</button>'
                + '</div>'
                + '</div>'
                + '</aside>';
        }

        // 열람 모드
        var removeBtn = (cellId && sid)
            ? '<button type="button" class="eie-small-button" style="color:#b91c1c;border-color:#fca5a5;" '
                + 'onclick="EieClassroomView.removeStudent(' + JSON.stringify(cellId) + ',' + JSON.stringify(sid) + ')">'
                + '배정 해제</button>'
            : '';

        return '<aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">'
            + '<div class="eie-editor-head">'
            + '<h2>학생 상세</h2>'
            + '<div style="display:flex;gap:6px;">'
            + '<button type="button" class="eie-secondary-button" style="min-height:30px;padding:0 10px;font-size:12px;" onclick="EieClassroomView.startStudentEdit()">수정</button>'
            + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.closeStudentDetail()">닫기</button>'
            + '</div>'
            + '</div>'
            + '<div id="eie-classroom-student-msg"></div>'
            + '<div class="eie-student-detail-title"><strong>' + esc(name) + '</strong></div>'
            + '<div class="eie-detail-grid">'
            + '<div class="eie-detail-row"><span>학년</span><strong>' + esc(grade || '(없음)') + '</strong></div>'
            + '<div class="eie-detail-row"><span>전화번호</span><strong>' + esc(phone || '(없음)') + '</strong></div>'
            + (cell ? '<div class="eie-detail-row"><span>수업</span><strong>' + esc(cell.class_name_raw || '-') + '</strong></div>' : '')
            + (cell ? '<div class="eie-detail-row"><span>선생님</span><strong>' + esc(cell.teacher_name_raw || '-') + '</strong></div>' : '')
            + (cell ? '<div class="eie-detail-row"><span>교시</span><strong>' + esc([cell.period_label, cell.start_time ? cell.start_time + '~' + (cell.end_time || '') : ''].filter(Boolean).join(' ') || '-') + '</strong></div>' : '')
            + '</div>'
            + (removeBtn ? '<div class="eie-action-row" style="margin-top:14px;">' + removeBtn + '</div>' : '')
            + '</aside>';
    }

    // ── 수업 상세 패널 ────────────────────────────────────────────────
    function renderCellDetail(cell) {
        if (!cell) return '';
        var cellId = String(cell.id || '');
        var students = getAssignedStudents(cell);
        var studentsHtml = students.length
            ? '<div class="eie-cell-students">'
                + students.map(function (s) {
                    var key = s.assignment_id || s.student_id || '';
                    var name = s.display_name || s.name || '';
                    var grade = s.grade || s.grade_raw || '';
                    return '<button type="button" class="eie-student-chip"'
                        + ' onclick="EieClassroomView.openStudentDetail(' + JSON.stringify(String(key)) + ')">'
                        + esc(name)
                        + (grade ? ' <span style="font-size:11px;opacity:.7;">' + esc(grade) + '</span>' : '')
                        + '</button>';
                }).join('')
                + '</div>'
            : '<div class="eie-empty-box" style="margin-top:8px;">배정된 학생이 없습니다.</div>';

        return '<aside class="eie-editor-panel" aria-label="수업 상세">'
            + '<div class="eie-editor-head">'
            + '<h2>' + esc(cell.class_name_raw || '수업명 없음') + '</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.closeDetail()">닫기</button>'
            + '</div>'
            + '<div class="eie-detail-grid">'
            + '<div class="eie-detail-row"><span>선생님</span><strong>' + esc(cell.teacher_name_raw || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>교시</span><strong>' + esc(cell.period_label || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>시간</span><strong>' + esc([cell.start_time, cell.end_time].filter(Boolean).join('~') || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>학생</span><strong>' + esc(String(students.length)) + '명</strong></div>'
            + '</div>'
            + '<div id="eie-cell-msg"></div>'
            + '<div class="eie-admin-section-title-row" style="margin-top:14px;">'
            + '<h3 class="eie-admin-section-title">배정 학생</h3>'
            + '<button type="button" class="eie-small-button" onclick="EieClassroomView.openAddStudent()">+ 학생 추가</button>'
            + '</div>'
            + studentsHtml
            + '</aside>';
    }

    // ── 학생 추가 패널 ────────────────────────────────────────────────
    function renderAddStudentPanel(cell) {
        var cellId = cell ? String(cell.id || '') : '';
        var assignedIds = cell ? getAssignedStudents(cell).map(function (s) { return String(s.student_id || ''); }) : [];
        var available = _students.filter(function (s) {
            return !assignedIds.includes(String(s.id || ''));
        });

        var listHtml = available.length
            ? '<div class="eie-student-list" style="max-height:280px;overflow-y:auto;">'
                + available.map(function (s) {
                    var sid = String(s.id || '');
                    var name = s.display_name || s.name || '-';
                    var grade = s.grade || s.grade_raw || '';
                    return '<button type="button" class="eie-student-row"'
                        + ' onclick="EieClassroomView.assignStudent(' + JSON.stringify(cellId) + ',' + JSON.stringify(sid) + ')">'
                        + '<div class="eie-student-row-main">'
                        + '<span class="eie-student-row-name">' + esc(name) + '</span>'
                        + '</div>'
                        + (grade ? '<div class="eie-student-row-sub"><span class="eie-student-row-meta">' + esc(grade) + '</span></div>' : '')
                        + '</button>';
                }).join('')
                + '</div>'
            : '<div class="eie-empty-box">추가할 수 있는 학생이 없습니다.</div>';

        return '<aside class="eie-editor-panel" aria-label="학생 추가">'
            + '<div class="eie-editor-head">'
            + '<h2>학생 추가</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.closeAddStudent()">닫기</button>'
            + '</div>'
            + '<div id="eie-add-student-msg"></div>'
            + '<p style="font-size:13px;color:var(--eie-muted);margin:0 0 8px;">이미 배정된 학생은 목록에서 제외됩니다.</p>'
            + listHtml
            + '</aside>';
    }

    function renderCards(cells) {
        if (!cells.length) return '<div class="eie-empty-box">등록된 수업이 없습니다.</div>';
        return '<div class="eie-admin-card-grid">'
            + sortCells(cells).map(function (cell) {
                var students = getAssignedStudents(cell);
                var isSelected = String(cell.id) === String(_selectedCellId || '');
                var kicker = [cell.day_label, cell.period_label, cell.teacher_name_raw].filter(Boolean).join(' · ');
                return '<button type="button"'
                    + ' class="eie-admin-card' + (isSelected ? ' is-selected' : '') + '"'
                    + ' onclick="EieClassroomView.openDetail(' + JSON.stringify(String(cell.id)) + ')">'
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

            var showPanel = _selectedCellId !== null;
            var cell = getSelectedCell();
            var student = (_selectedStudentKey !== null) ? getSelectedStudent() : null;
            var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
            var layoutClass = showPanel ? 'eie-timetable-layout' : '';
            var panelHtml = '';
            if (_addStudentMode && cell) {
                panelHtml = renderAddStudentPanel(cell);
            } else if (student) {
                panelHtml = renderStudentDetail(student, cell);
            } else if (showPanel) {
                panelHtml = renderCellDetail(cell);
            }

            return '<section aria-labelledby="eie-classroom-title">'
                + '<button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>'
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
            _editStudentMode = false;
            _addStudentMode = false;
            EieRouter.open('classroom');
        },

        closeDetail: function () {
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _addStudentMode = false;
            EieRouter.open('classroom');
        },

        openStudentDetail: function (studentKey) {
            _selectedStudentKey = studentKey;
            _editStudentMode = false;
            _addStudentMode = false;
            EieRouter.open('classroom');
        },

        closeStudentDetail: function () {
            _selectedStudentKey = null;
            _editStudentMode = false;
            EieRouter.open('classroom');
        },

        startStudentEdit: function () {
            _editStudentMode = true;
            EieRouter.open('classroom');
        },

        cancelStudentEdit: function () {
            _editStudentMode = false;
            EieRouter.open('classroom');
        },

        submitStudentEdit: async function (studentId) {
            if (_saving) return;
            var nameEl = document.getElementById('cls-edit-name');
            var gradeEl = document.getElementById('cls-edit-grade');
            var phoneEl = document.getElementById('cls-edit-phone');
            var statusEl = document.getElementById('cls-edit-status');
            var memoEl = document.getElementById('cls-edit-memo');
            var msgEl = document.getElementById('eie-classroom-student-msg');

            var name = nameEl ? nameEl.value.trim() : '';
            if (!name) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">이름은 필수입니다.</div>';
                return;
            }

            _saving = true;
            if (msgEl) msgEl.innerHTML = '';
            try {
                await EieApi.updateStudent(studentId, {
                    display_name: name,
                    grade: gradeEl ? gradeEl.value.trim() : '',
                    phone: phoneEl ? phoneEl.value.trim() : undefined,
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
        }
    };
})();
