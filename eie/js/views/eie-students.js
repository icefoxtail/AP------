(function () {
    var _students = [];
    var _error = '';
    var _loaded = false;
    var _selectedId = null;
    var _query = '';
    var _editMode = false;   // 상세 패널 편집 모드
    var _saving = false;     // 저장 중 상태
    var _showCreate = false; // 등록 폼 표시

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
            || '';
    }

    function getGrade(student) {
        return student.grade_raw || student.grade || '';
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
        var active = students.filter(function (s) { return (s.status || 'active') === 'active'; }).length;
        var inactive = total - active;
        return '<div class="eie-summary-bar">'
            + '<span class="eie-summary-item"><strong>' + esc(String(total)) + '</strong> 전체</span>'
            + '<span class="eie-summary-item"><strong>' + esc(String(active)) + '</strong> 재원</span>'
            + (inactive > 0 ? '<span class="eie-summary-item"><strong>' + esc(String(inactive)) + '</strong> 비활성/보관</span>' : '')
            + '</div>';
    }

    function renderStatusBadge(status) {
        if (status === 'active') return '<span class="eie-badge eie-badge-active">재원</span>';
        if (status === 'inactive') return '<span class="eie-badge eie-badge-review">비활성</span>';
        if (status === 'archived') return '<span class="eie-badge eie-badge-archived">보관</span>';
        if (status === 'needs_review') return '<span class="eie-badge eie-badge-review">확인필요</span>';
        return '<span class="eie-badge eie-badge-active">재원</span>';
    }

    // ── 학생 등록 폼 ────────────────────────────────────────────────────
    function renderCreateForm() {
        return '<aside class="eie-editor-panel" aria-label="학생 등록">'
            + '<div class="eie-editor-head">'
            + '<h2>학생 등록</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieStudentsView.cancelCreate()">닫기</button>'
            + '</div>'
            + '<div id="eie-student-create-msg"></div>'
            + '<div class="eie-edit-form" style="margin-top:12px;">'
            + '<label>이름 <span style="color:var(--eie-primary)">*</span>'
            + '<input type="text" id="create-name" placeholder="학생 이름" autocomplete="off">'
            + '</label>'
            + '<label>학년'
            + '<input type="text" id="create-grade" placeholder="예: 중2" autocomplete="off">'
            + '</label>'
            + '<label>연락처 (대표)'
            + '<input type="tel" id="create-phone" placeholder="010-0000-0000" autocomplete="off">'
            + '</label>'
            + '<label>상태'
            + '<select id="create-status">'
            + '<option value="active">재원</option>'
            + '<option value="inactive">비활성</option>'
            + '</select>'
            + '</label>'
            + '<label class="is-wide">메모'
            + '<textarea id="create-memo" placeholder="메모" style="resize:vertical;min-height:60px;"></textarea>'
            + '</label>'
            + '<div class="eie-action-row is-wide">'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.submitCreate()" ' + (_saving ? 'disabled' : '') + '>'
            + (_saving ? '저장 중...' : '저장')
            + '</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.cancelCreate()">취소</button>'
            + '</div>'
            + '</div>'
            + '</aside>';
    }

    // ── 학생 상세 패널 (열람/수정 모드) ─────────────────────────────────
    function renderDetail(student) {
        if (!student) return '';
        var sid = esc(String(student.id || ''));
        var name = student.display_name || student.name || '-';
        var grade = getGrade(student);
        var phone = getPhone(student);
        var memo = student.memo || '';
        var contacts = Array.isArray(student.contacts) ? student.contacts : [];
        var assignments = Array.isArray(student.assignments) ? student.assignments : [];
        var status = student.status || 'active';

        if (_editMode) {
            // 수정 모드
            var contactsEditHtml = '<label class="is-wide">연락처 (대표)'
                + '<input type="tel" id="edit-phone" value="' + esc(phone) + '" placeholder="010-0000-0000">'
                + '</label>';
            if (contacts.length > 1) {
                contactsEditHtml += contacts.slice(1).map(function (c, i) {
                    var label = c.contact_label || '연락처' + (i + 2);
                    var ph = c.phone_raw || c.phone || '';
                    return '<div class="eie-detail-row"><span>' + esc(label) + '</span><strong>' + esc(ph) + '</strong></div>';
                }).join('');
            }
            return '<aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 수정">'
                + '<div class="eie-editor-head">'
                + '<h2>학생 수정</h2>'
                + '<button type="button" class="eie-icon-button" onclick="EieStudentsView.cancelEdit()">취소</button>'
                + '</div>'
                + '<div id="eie-student-edit-msg"></div>'
                + '<div class="eie-edit-form" style="margin-top:12px;">'
                + '<label>이름 <span style="color:var(--eie-primary)">*</span>'
                + '<input type="text" id="edit-name" value="' + esc(name) + '">'
                + '</label>'
                + '<label>학년'
                + '<input type="text" id="edit-grade" value="' + esc(grade) + '" placeholder="예: 중2">'
                + '</label>'
                + contactsEditHtml
                + '<label>상태'
                + '<select id="edit-status">'
                + '<option value="active"' + (status === 'active' ? ' selected' : '') + '>재원</option>'
                + '<option value="inactive"' + (status === 'inactive' ? ' selected' : '') + '>비활성</option>'
                + '<option value="archived"' + (status === 'archived' ? ' selected' : '') + '>보관</option>'
                + '<option value="needs_review"' + (status === 'needs_review' ? ' selected' : '') + '>확인필요</option>'
                + '</select>'
                + '</label>'
                + '<label class="is-wide">메모'
                + '<textarea id="edit-memo" style="resize:vertical;min-height:60px;">' + esc(memo) + '</textarea>'
                + '</label>'
                + '<div class="eie-action-row is-wide">'
                + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.submitEdit(' + JSON.stringify(sid) + ')" ' + (_saving ? 'disabled' : '') + '>'
                + (_saving ? '저장 중...' : '저장')
                + '</button>'
                + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.cancelEdit()">취소</button>'
                + '</div>'
                + '</div>'
                + '</aside>';
        }

        // 열람 모드
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
            var ph = phone || '(없음)';
            contactsHtml = '<div class="eie-detail-grid">'
                + '<div class="eie-detail-row"><span>전화번호</span><strong>' + esc(ph) + '</strong></div>'
                + '</div>';
        }

        var assignHtml = '';
        if (assignments.length) {
            assignHtml = '<div class="eie-admin-section-title-row" style="margin-top:14px;">'
                + '<h3 class="eie-admin-section-title">수업 배정</h3></div>'
                + '<div class="eie-detail-grid">'
                + assignments.map(function (a) {
                    var cellLabel = [a.class_name_raw, a.teacher_name_raw].filter(Boolean).join(' / ') || '-';
                    var timeLabel = [a.day_label, a.period_label, a.start_time ? a.start_time + '~' + (a.end_time || '') : ''].filter(Boolean).join(' ') || '-';
                    return '<div class="eie-detail-row"><span>' + esc(cellLabel) + '</span><strong>' + esc(timeLabel) + '</strong></div>';
                }).join('')
                + '</div>';
        }

        var memoHtml = memo ? '<div class="eie-admin-section-title-row" style="margin-top:14px;">'
            + '<h3 class="eie-admin-section-title">메모</h3></div>'
            + '<div class="eie-inline-note">' + esc(memo) + '</div>' : '';

        return '<aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">'
            + '<div class="eie-editor-head">'
            + '<h2>학생 상세</h2>'
            + '<div style="display:flex;gap:6px;">'
            + '<button type="button" class="eie-secondary-button" style="min-height:30px;padding:0 10px;font-size:12px;" onclick="EieStudentsView.startEdit()">수정</button>'
            + '<button type="button" class="eie-icon-button" onclick="EieStudentsView.closeDetail()">닫기</button>'
            + '</div>'
            + '</div>'
            + '<div class="eie-student-detail-title">'
            + '<strong>' + esc(name) + '</strong>'
            + renderStatusBadge(status)
            + '</div>'
            + '<div class="eie-detail-grid">'
            + '<div class="eie-detail-row"><span>학년</span><strong>' + esc(grade || '(없음)') + '</strong></div>'
            + '<div class="eie-detail-row"><span>수업 수</span><strong>' + esc(String(assignments.length)) + '개</strong></div>'
            + '</div>'
            + contactsHtml
            + memoHtml
            + assignHtml
            + '</aside>';
    }

    function renderList(students) {
        if (!students.length) {
            return _query
                ? '<div class="eie-empty-box">검색 결과가 없습니다.</div>'
                : '<div class="eie-empty-box">등록된 학생이 없습니다.</div>';
        }
        var rows = students.map(function (student) {
            var sid = String(student.id || student.student_id || '');
            var isSelected = sid !== '' && sid === String(_selectedId || '');
            var nameText = student.display_name || student.name || '-';
            var gradeText = getGrade(student);
            var statusHtml = renderStatusBadge(student.status || 'active');
            var assignCnt = student.assignment_count != null ? student.assignment_count
                : student.class_count != null ? student.class_count : 0;
            var hasContact = (student.contact_count || 0) > 0;
            return '<button type="button"'
                + ' class="eie-student-row' + (isSelected ? ' is-selected' : '') + '"'
                + ' onclick="EieStudentsView.openDetail(' + JSON.stringify(sid) + ')">'
                + '<div class="eie-student-row-main">'
                + '<span class="eie-student-row-name">' + esc(nameText) + '</span>'
                + statusHtml
                + (hasContact ? '<span class="eie-badge eie-badge-contact">연락처</span>' : '')
                + '</div>'
                + '<div class="eie-student-row-sub">'
                + '<span class="eie-student-row-meta">' + esc(gradeText || '학년 미입력') + '</span>'
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
                    var result = await EieApi.getStudents();
                    var rows = (result && result.confirmed_students)
                        || (result && result.data)
                        || (result && result.students)
                        || [];
                    _students = Array.isArray(rows) ? rows : [];
                    _error = (!_students.length && result && result.success === false)
                        ? (result.error || '학생 목록을 불러오지 못했습니다.')
                        : '';
                    _loaded = true;
                } catch (err) {
                    _error = '학생 목록을 불러오지 못했습니다.';
                    _students = [];
                }
            }

            var showPanel = _selectedId !== null || _showCreate;
            var selected = getSelected();
            var filtered = filteredStudents();
            var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
            var layoutClass = showPanel ? 'eie-timetable-layout' : '';
            var panelHtml = '';
            if (_showCreate) {
                panelHtml = renderCreateForm();
            } else if (_selectedId !== null) {
                panelHtml = renderDetail(selected);
            }

            return '<section aria-labelledby="eie-students-title">'
                + '<button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>'
                + '<div class="eie-panel">'
                + '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">'
                + '<h1 id="eie-students-title" class="eie-panel-title" style="margin:0;">학생관리</h1>'
                + '<button type="button" class="eie-primary-button" style="min-height:36px;" onclick="EieStudentsView.openCreate()">+ 학생 등록</button>'
                + '</div>'
                + '<p class="eie-panel-copy">전화번호는 학생 이름 클릭 후 상세에서 확인합니다.</p>'
                + errorHtml
                + (_loaded && !_error ? renderSummary(_students) : '')
                + '<div class="eie-search-bar">'
                + '<input type="search" class="eie-search-input"'
                + ' placeholder="이름, 학년, 수업명으로 검색..."'
                + ' value="' + esc(_query) + '"'
                + ' oninput="EieStudentsView.setQuery(this.value)">'
                + '</div>'
                + '<div class="' + layoutClass + '">'
                + '<div class="eie-timetable-main">' + renderList(filtered) + '</div>'
                + panelHtml
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
            _editMode = false;
            _showCreate = false;
            EieRouter.open('students');
        },

        closeDetail: function () {
            _selectedId = null;
            _editMode = false;
            EieRouter.open('students');
        },

        startEdit: function () {
            _editMode = true;
            EieRouter.open('students');
        },

        cancelEdit: function () {
            _editMode = false;
            EieRouter.open('students');
        },

        submitEdit: async function (studentId) {
            if (_saving) return;
            var nameEl = document.getElementById('edit-name');
            var gradeEl = document.getElementById('edit-grade');
            var phoneEl = document.getElementById('edit-phone');
            var statusEl = document.getElementById('edit-status');
            var memoEl = document.getElementById('edit-memo');
            var msgEl = document.getElementById('eie-student-edit-msg');

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
                // 목록 갱신
                _loaded = false;
                _editMode = false;
                _saving = false;
                EieRouter.open('students');
            } catch (err) {
                _saving = false;
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '저장하지 못했습니다.') + '</div>';
                EieRouter.open('students');
            }
        },

        openCreate: function () {
            _showCreate = true;
            _selectedId = null;
            _editMode = false;
            EieRouter.open('students');
        },

        cancelCreate: function () {
            _showCreate = false;
            EieRouter.open('students');
        },

        submitCreate: async function () {
            if (_saving) return;
            var nameEl = document.getElementById('create-name');
            var gradeEl = document.getElementById('create-grade');
            var phoneEl = document.getElementById('create-phone');
            var statusEl = document.getElementById('create-status');
            var memoEl = document.getElementById('create-memo');
            var msgEl = document.getElementById('eie-student-create-msg');

            var name = nameEl ? nameEl.value.trim() : '';
            if (!name) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">이름은 필수입니다.</div>';
                return;
            }

            _saving = true;
            if (msgEl) msgEl.innerHTML = '';

            try {
                await EieApi.createStudent({
                    display_name: name,
                    grade: gradeEl ? gradeEl.value.trim() : '',
                    phone: phoneEl ? phoneEl.value.trim() : '',
                    status: statusEl ? statusEl.value : 'active',
                    memo: memoEl ? memoEl.value.trim() : ''
                });
                _loaded = false;
                _showCreate = false;
                _saving = false;
                EieRouter.open('students');
            } catch (err) {
                _saving = false;
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '저장하지 못했습니다.') + '</div>';
                EieRouter.open('students');
            }
        }
    };
})();
