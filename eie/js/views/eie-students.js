(function () {
    var _students = [];
    var _error = '';
    var _loaded = false;
    var _selectedId = null;
    var _query = '';

    function esc(value) {
        return EieApp.escapeHtml(value);
    }

    function getPhone(student) {
        return student.phone_raw
            || student.phone
            || student.normalized_phone
            || student.primary_phone
            || (Array.isArray(student.contacts) && student.contacts[0]
                ? (student.contacts[0].phone_raw || student.contacts[0].phone || '')
                : '')
            || '-';
    }

    function getGrade(student) {
        return student.grade_raw || student.grade || '-';
    }

    function getSelected() {
        if (_selectedId === null) return null;
        return _students.find(function (s) {
            return String(s.id || s.student_id || '') === String(_selectedId);
        }) || null;
    }

    function matchesQuery(student, query) {
        if (!query) return true;
        var q = query.toLowerCase();
        var name = (student.display_name || student.name || '').toLowerCase();
        var grade = (student.grade || student.grade_raw || '').toLowerCase();
        var assignments = Array.isArray(student.assignments) ? student.assignments : [];
        var classMatch = assignments.some(function (a) {
            return (a.class_name_raw || '').toLowerCase().indexOf(q) >= 0
                || (a.teacher_name_raw || '').toLowerCase().indexOf(q) >= 0;
        });
        return name.indexOf(q) >= 0 || grade.indexOf(q) >= 0 || classMatch;
    }

    function filteredStudents() {
        return _students.filter(function (s) { return matchesQuery(s, _query); });
    }

    function renderSummary(students) {
        var total = students.length;
        var withContact = students.filter(function (s) {
            return (s.contact_count || 0) > 0;
        }).length;
        var withAssign = students.filter(function (s) {
            return (s.assignment_count || 0) > 0;
        }).length;
        return '<div class="eie-summary-bar">'
            + '<span class="eie-summary-item"><strong>' + esc(String(total)) + '</strong> 전체</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(withContact)) + '</strong> 연락처 있음</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(withAssign)) + '</strong> 수업 배정</span>'
            + '</div>';
    }

    function renderStatusBadge(status) {
        var s = status || 'active';
        var label = s === 'active' ? '활성'
            : s === 'needs_review' ? '검토필요'
            : s === 'inactive' ? '비활성'
            : s === 'archived' ? '보관'
            : s;
        var cls = s === 'active' ? 'eie-badge-active'
            : s === 'needs_review' ? 'eie-badge-review'
            : 'eie-badge-inactive';
        return '<span class="eie-badge ' + cls + '">' + esc(label) + '</span>';
    }

    function renderDetail(student) {
        if (!student) return '';
        var name = student.display_name || student.name || student.student_name || '-';
        var grade = getGrade(student);
        var classCnt = student.assignment_count != null ? student.assignment_count
            : student.class_count != null ? student.class_count : '-';
        var contacts = Array.isArray(student.contacts) ? student.contacts : [];
        var assignments = Array.isArray(student.assignments) ? student.assignments : [];

        // 연락처 섹션
        var contactsHtml;
        if (contacts.length) {
            contactsHtml = '<div class="eie-admin-section-title-row" style="margin-top:14px;">'
                + '<h3 class="eie-admin-section-title">연락처</h3></div>'
                + '<div class="eie-detail-grid">'
                + contacts.map(function (c, i) {
                    var label = c.contact_label || (i === 0 ? '대표' : '연락처');
                    var ph = c.phone_raw || c.phone || '-';
                    return '<div class="eie-detail-row"><span>' + esc(label) + '</span><strong>' + esc(ph) + '</strong></div>';
                }).join('')
                + '</div>';
        } else {
            contactsHtml = '<div class="eie-detail-grid">'
                + '<div class="eie-detail-row"><span>전화번호</span><strong>' + esc(getPhone(student)) + '</strong></div>'
                + '</div>';
        }

        // 수업 배정 섹션
        var assignHtml = '';
        if (assignments.length) {
            assignHtml = '<div class="eie-admin-section-title-row" style="margin-top:14px;">'
                + '<h3 class="eie-admin-section-title">수업 배정</h3></div>'
                + '<div class="eie-detail-grid">'
                + assignments.map(function (a) {
                    var cellLabel = [a.class_name_raw, a.teacher_name_raw].filter(Boolean).join(' / ') || '-';
                    var timeLabel = [a.period_label, a.start_time ? a.start_time + '~' + (a.end_time || '') : ''].filter(Boolean).join(' ') || '-';
                    return '<div class="eie-detail-row"><span>' + esc(cellLabel) + '</span><strong>' + esc(timeLabel) + '</strong></div>';
                }).join('')
                + '</div>';
        }

        return '<aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">'
            + '<div class="eie-editor-head">'
            + '<h2>학생 상세</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieStudentsView.closeDetail()">닫기</button>'
            + '</div>'
            + '<div class="eie-student-detail-title"><strong>' + esc(name) + '</strong></div>'
            + '<div class="eie-detail-grid">'
            + '<div class="eie-detail-row"><span>학년</span><strong>' + esc(grade) + '</strong></div>'
            + '<div class="eie-detail-row"><span>수업 수</span><strong>' + esc(String(classCnt)) + '</strong></div>'
            + '</div>'
            + contactsHtml
            + assignHtml
            + '</aside>';
    }

    function renderList(students) {
        if (!students.length) {
            return _query
                ? '<div class="eie-empty-box">검색 결과가 없습니다.</div>'
                : '<div class="eie-empty-box">학생이 없습니다.</div>';
        }
        var rows = students.map(function (student) {
            var sid = String(student.id || student.student_id || '');
            var isSelected = sid !== '' && sid === String(_selectedId || '');
            var nameText = student.display_name || student.name || student.student_name || '-';
            var gradeText = getGrade(student);
            var statusHtml = renderStatusBadge(student.status || 'active');
            var assignCnt = student.assignment_count != null ? student.assignment_count
                : student.class_count != null ? student.class_count : 0;
            var hasContact = (student.contact_count || 0) > 0;
            return '<button type="button"'
                + ' class="eie-student-row' + (isSelected ? ' is-selected' : '') + '"'
                + ' onclick="EieStudentsView.openDetail(' + esc(JSON.stringify(sid)) + ')">'
                + '<div class="eie-student-row-main">'
                + '<span class="eie-student-row-name">' + esc(nameText) + '</span>'
                + statusHtml
                + (hasContact ? '<span class="eie-badge eie-badge-contact">연락처</span>' : '')
                + '</div>'
                + '<div class="eie-student-row-sub">'
                + '<span class="eie-student-row-meta">' + esc(gradeText) + '</span>'
                + '<span class="eie-student-row-meta">수업 ' + esc(String(assignCnt)) + '개</span>'
                + '</div>'
                + '</button>';
        });
        return '<div class="eie-student-list">' + rows.join('') + '</div>';
    }

    window.EieStudentsView = {
        render: async function () {
            if (!_loaded) {
                try {
                    var base = EieApi.resolveApiBase();
                    var result = await EieApp.fetchWithAuth(base + '/confirmed-students');
                    _students = Array.isArray(result && result.confirmed_students)
                        ? result.confirmed_students
                        : Array.isArray(result && result.data)
                            ? result.data
                            : Array.isArray(result && result.students)
                                ? result.students
                                : [];
                    _error = _students.length === 0 && result && result.success === false
                        ? '학생 목록을 불러오지 못했습니다.'
                        : '';
                    _loaded = true;
                } catch (err) {
                    _error = '학생 목록을 불러오지 못했습니다.';
                    _students = [];
                }
            }

            var showPanel = _selectedId !== null;
            var selected = getSelected();
            var filtered = filteredStudents();
            var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
            var layoutClass = showPanel ? 'eie-timetable-layout' : '';
            var detailHtml = showPanel ? renderDetail(selected) : '';

            return '<section aria-labelledby="eie-students-title">'
                + '<button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>'
                + '<div class="eie-panel">'
                + '<h1 id="eie-students-title" class="eie-panel-title">학생관리</h1>'
                + '<p class="eie-panel-copy">전화번호는 학생 이름 클릭 후 상세에서 확인합니다.</p>'
                + errorHtml
                + (_loaded && !_error ? renderSummary(_students) : '')
                + '<div class="eie-search-bar">'
                + '<input type="search" class="eie-search-input"'
                + ' placeholder="이름, 학년, 수업명, 선생님으로 검색..."'
                + ' value="' + esc(_query) + '"'
                + ' oninput="EieStudentsView.setQuery(this.value)">'
                + '</div>'
                + '<div class="' + layoutClass + '">'
                + '<div class="eie-timetable-main">' + renderList(filtered) + '</div>'
                + detailHtml
                + '</div>'
                + '</div>'
                + '</section>';
        },

        setQuery: function (q) {
            _query = String(q || '');
            EieRouter.open('students');
        },

        openDetail: function (studentId) {
            _selectedId = studentId;
            EieRouter.open('students');
        },

        closeDetail: function () {
            _selectedId = null;
            EieRouter.open('students');
        }
    };
})();
