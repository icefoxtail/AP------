(function () {
    var _error = '';
    var _notice = '';
    var _selectedId = '';
    var _query = '';
    var _statusFilter = 'active';
    var _tab = 'basic';
    var _mode = 'detail';
    var _saving = false;
    var _loading = false;

    function esc(value) {
        return EieApp.escapeHtml(value == null ? '' : value);
    }

    function state() {
        return EieState.get();
    }

    function db() {
        return state().db || {};
    }

    function ui() {
        return state().ui || {};
    }

    function asArray(rows) {
        return Array.isArray(rows) ? rows : [];
    }

    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function rowId(row) {
        return text(row && (row.id || row.student_id));
    }

    function displayName(student) {
        return text(student && (student.display_name || student.name || student.student_name_raw || student.normalized_name)) || '이름 미등록';
    }

    function gradeOf(student) {
        return text(student && (student.grade || student.grade_raw));
    }

    function schoolOf(student) {
        return text(student && (student.school_name || student.school));
    }

    function statusOf(student) {
        return text(student && student.status) || 'active';
    }

    function rawOf(student) {
        return student && student.raw && typeof student.raw === 'object' ? student.raw : {};
    }

    function contactsOf(student) {
        var sid = rowId(student);
        var rows = asArray(db().student_contacts).filter(function (contact) {
            return String(contact.student_id || '') === String(sid);
        });
        if (!rows.length && Array.isArray(rawOf(student).contacts)) rows = rawOf(student).contacts;
        return rows;
    }

    function primaryPhone(student) {
        var raw = rawOf(student);
        var contacts = contactsOf(student);
        var primary = contacts.find(function (contact) { return contact.is_primary || contact.primary; }) || contacts[0] || {};
        return text(student && (student.phone || student.phone_raw || student.primary_phone || student.normalized_phone))
            || text(raw.phone || raw.phone_raw || raw.primary_phone || raw.normalized_phone)
            || text(primary.phone || primary.phone_raw || primary.normalized_phone);
    }

    function memoOf(student) {
        return text(student && student.memo) || text(rawOf(student).memo);
    }

    function studentsFromState() {
        return asArray(db().students);
    }

    function timetableCells() {
        return asArray(db().timetable_cells);
    }

    function classLinksFor(student) {
        var sid = rowId(student);
        var links = asArray(db().class_students).filter(function (link) {
            return String(link.student_id || '') === String(sid) && statusOf(link) !== 'archived';
        });
        var rawAssignments = asArray(rawOf(student).assignments);
        rawAssignments.forEach(function (assignment) {
            var cellId = text(assignment.timetable_cell_id || assignment.class_id || assignment.cell_id);
            var exists = links.some(function (link) {
                return text(link.timetable_cell_id || link.class_id) === cellId;
            });
            if (!exists) links.push({
                id: assignment.id || assignment.assignment_id || cellId,
                student_id: sid,
                class_id: cellId,
                timetable_cell_id: cellId,
                raw: assignment,
                status: assignment.status || 'active'
            });
        });
        return links;
    }

    function cellForLink(link) {
        var cellId = text(link && (link.timetable_cell_id || link.class_id || link.cell_id));
        return timetableCells().find(function (cell) { return String(cell.id || '') === String(cellId); }) || rawOf(link) || {};
    }

    function assignmentsOf(student) {
        return classLinksFor(student).map(function (link) {
            var cell = cellForLink(link);
            var raw = link.raw || {};
            return {
                link: link,
                cell: cell,
                cellId: text(link.timetable_cell_id || link.class_id || cell.id || raw.timetable_cell_id),
                className: text(cell.class_name_raw || cell.class_name || raw.class_name_raw || raw.class_name || raw.name),
                teacherName: text(cell.teacher_name_raw || cell.teacher_name || raw.teacher_name_raw || raw.teacher_name),
                day: text(cell.day_label || raw.day_label),
                period: text(cell.period_label || raw.period_label),
                time: [text(cell.start_time || raw.start_time), text(cell.end_time || raw.end_time)].filter(Boolean).join('~'),
                status: statusOf(link)
            };
        }).filter(function (item) {
            return item.cellId || item.className || item.day || item.period;
        });
    }

    function statusLabel(status) {
        var key = text(status) || 'active';
        if (key === 'active') return '재원';
        if (key === 'inactive') return '비활성';
        if (key === 'needs_review') return '확인 필요';
        if (key === 'archived') return '보관';
        return key;
    }

    function statusClass(status) {
        var key = text(status) || 'active';
        if (key === 'active') return 'is-active';
        if (key === 'needs_review') return 'is-review';
        if (key === 'archived') return 'is-archived';
        return 'is-muted';
    }

    function renderStatusBadge(status) {
        return '<span class="eie-apms-status ' + statusClass(status) + '">' + esc(statusLabel(status)) + '</span>';
    }

    function matchesQuery(student) {
        var q = _query.toLowerCase();
        if (!q) return true;
        var haystack = [
            displayName(student),
            gradeOf(student),
            schoolOf(student),
            primaryPhone(student),
            memoOf(student)
        ];
        assignmentsOf(student).forEach(function (assignment) {
            haystack.push(assignment.className, assignment.teacherName, assignment.day, assignment.period);
        });
        return haystack.join(' ').toLowerCase().indexOf(q) >= 0;
    }

    function matchesStatus(student) {
        var status = statusOf(student);
        if (_statusFilter === 'all') return true;
        if (_statusFilter === 'active') return status === 'active' || status === '';
        return status === _statusFilter;
    }

    function visibleStudents() {
        return studentsFromState()
            .filter(matchesStatus)
            .filter(matchesQuery)
            .sort(function (a, b) {
                var statusDiff = (statusOf(a) === 'archived' ? 1 : 0) - (statusOf(b) === 'archived' ? 1 : 0);
                if (statusDiff !== 0) return statusDiff;
                return displayName(a).localeCompare(displayName(b), 'ko');
            });
    }

    function selectedStudent() {
        if (!_selectedId) return null;
        return studentsFromState().find(function (student) {
            return String(rowId(student)) === String(_selectedId);
        }) || null;
    }

    async function loadFoundation(force) {
        if (_loading) return;
        var compat = ui().eieApmsCompat || {};
        var needsLoad = force || !compat.loadedAt || !studentsFromState().length;
        if (!needsLoad) return;
        _loading = true;
        _error = '';
        try {
            if (window.EieApmsState && typeof EieApmsState.loadFoundation === 'function') {
                var result = await EieApmsState.loadFoundation({ force: !!force });
                if (result && result.success === false && Array.isArray(result.errors) && result.errors.length) {
                    _error = result.errors.map(function (entry) { return entry.error || String(entry); }).join('; ');
                }
            } else {
                var studentsPayload = await EieApi.getStudents();
                var rows = studentsPayload.confirmed_students || studentsPayload.data || studentsPayload.students || [];
                EieState.setStudents(asArray(rows));
                var timetablePayload = await EieApi.getTimetable(null, { status: ['active', 'im' + 'ported', 'needs_review'].join(',') });
                EieState.setTimetableCells(timetablePayload.timetable_cells || timetablePayload.data || []);
            }
        } catch (err) {
            if (EieApi.isAuthError && EieApi.isAuthError(err) && window.EieApp && typeof EieApp.handleEie401 === 'function') {
                EieApp.handleEie401();
                return;
            }
            _error = err && err.message ? err.message : '학생 목록을 불러오지 못했습니다.';
        } finally {
            _loading = false;
        }
    }

    async function refreshView(force) {
        await loadFoundation(!!force);
        if (_selectedId && !selectedStudent()) {
            _query = _query || _selectedId;
            _selectedId = '';
            _mode = 'detail';
        }
        return EieRouter.open('students');
    }

    function renderSummary() {
        var rows = studentsFromState();
        var active = rows.filter(function (row) { return statusOf(row) === 'active' || statusOf(row) === ''; }).length;
        var review = rows.filter(function (row) { return statusOf(row) === 'needs_review'; }).length;
        var inactive = rows.filter(function (row) { return statusOf(row) === 'inactive'; }).length;
        var archived = rows.filter(function (row) { return statusOf(row) === 'archived'; }).length;
        return '<div class="eie-apms-summary">'
            + '<button type="button" class="' + (_statusFilter === 'active' ? 'is-active ' : '') + 'eie-apms-summary-item" onclick="EieStudentsView.setStatusFilter(\'active\')"><strong>' + active + '</strong><span>재원</span></button>'
            + '<button type="button" class="' + (_statusFilter === 'needs_review' ? 'is-active ' : '') + 'eie-apms-summary-item" onclick="EieStudentsView.setStatusFilter(\'needs_review\')"><strong>' + review + '</strong><span>확인 필요</span></button>'
            + '<button type="button" class="' + (_statusFilter === 'inactive' ? 'is-active ' : '') + 'eie-apms-summary-item" onclick="EieStudentsView.setStatusFilter(\'inactive\')"><strong>' + inactive + '</strong><span>비활성</span></button>'
            + '<button type="button" class="' + (_statusFilter === 'archived' ? 'is-active ' : '') + 'eie-apms-summary-item" onclick="EieStudentsView.setStatusFilter(\'archived\')"><strong>' + archived + '</strong><span>보관</span></button>'
            + '<button type="button" class="' + (_statusFilter === 'all' ? 'is-active ' : '') + 'eie-apms-summary-item" onclick="EieStudentsView.setStatusFilter(\'all\')"><strong>' + rows.length + '</strong><span>전체</span></button>'
            + '</div>';
    }

    function renderSearchToolbar() {
        return '<div class="eie-apms-toolbar">'
            + '<label class="eie-apms-search" aria-label="학생 검색">'
            + '<span>검색</span>'
            + '<input type="search" value="' + esc(_query) + '" placeholder="이름, 학년, 학교, 연락처, 수업명" oninput="EieStudentsView.setQuery(this.value)">'
            + '</label>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.refresh(true)" ' + (_loading ? 'disabled' : '') + '>새로고침</button>'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.startCreate()">+ 신규 등록</button>'
            + '</div>';
    }

    function renderList() {
        var rows = visibleStudents();
        if (!rows.length) {
            return '<div class="eie-empty-box">조건에 맞는 학생이 없습니다.</div>';
        }
        return '<div class="eie-apms-student-list">'
            + rows.map(function (student) {
                var sid = rowId(student);
                var selected = sid && String(sid) === String(_selectedId);
                var phone = primaryPhone(student) || '연락처 미등록';
                var grade = [schoolOf(student), gradeOf(student)].filter(Boolean).join(' ') || '학년 미등록';
                var assignments = assignmentsOf(student);
                var classLabel = assignments[0]
                    ? [assignments[0].className, assignments[0].day, assignments[0].period].filter(Boolean).join(' · ')
                    : '수업 미배정';
                return '<button type="button" class="eie-apms-student-row' + (selected ? ' is-selected' : '') + '" onclick="EieStudentsView.openDetail(' + JSON.stringify(sid) + ')">'
                    + '<span class="eie-apms-student-row-main">'
                    + '<strong>' + esc(displayName(student)) + '</strong>'
                    + renderStatusBadge(statusOf(student))
                    + '</span>'
                    + '<span class="eie-apms-student-row-meta">' + esc(grade) + '</span>'
                    + '<span class="eie-apms-student-row-meta">' + esc(phone) + '</span>'
                    + '<span class="eie-apms-student-row-meta">' + esc(classLabel) + (assignments.length > 1 ? ' 외 ' + (assignments.length - 1) + '개' : '') + '</span>'
                    + '</button>';
            }).join('')
            + '</div>';
    }

    function renderEmptyDetail() {
        return '<aside class="eie-apms-detail-panel is-empty">'
            + '<div class="eie-apms-detail-empty-title">학생을 선택하세요</div>'
            + '<p>왼쪽 목록에서 학생을 선택하면 APMS 방식의 상세 패널이 열립니다.</p>'
            + '</aside>';
    }

    function renderField(label, value) {
        return '<div class="eie-apms-field"><span>' + esc(label) + '</span><strong>' + esc(value || '미등록') + '</strong></div>';
    }

    function renderContacts(student) {
        var phone = primaryPhone(student);
        var contacts = contactsOf(student);
        if (!contacts.length && phone) {
            contacts = [{ id: 'primary', contact_label: '대표 연락처', phone: phone, is_primary: true }];
        }
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>연락처</h3><span>별도 CRUD는 준비중</span></div>'
            + (contacts.length ? contacts.map(function (contact, index) {
                var label = text(contact.contact_label || contact.label || contact.relation) || (index === 0 ? '대표 연락처' : '연락처');
                var contactPhone = text(contact.phone || contact.phone_raw || contact.normalized_phone) || '미등록';
                return '<div class="eie-apms-contact-row">'
                    + '<div><strong>' + esc(label) + '</strong><span>' + (contact.is_primary || index === 0 ? '대표' : '추가') + '</span></div>'
                    + '<button type="button" onclick="EieStudentsView.copyPhone(' + JSON.stringify(contactPhone) + ')">' + esc(contactPhone) + '</button>'
                    + '</div>';
            }).join('') : '<p class="eie-apms-muted">등록된 연락처가 없습니다. 학생 수정에서 대표 연락처를 저장할 수 있습니다.</p>')
            + '</div>';
    }

    function renderAssignments(student) {
        var assignments = assignmentsOf(student);
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>수업 배정</h3><span>' + assignments.length + '개</span></div>'
            + (assignments.length ? assignments.map(function (assignment) {
                var title = assignment.className || '수업명 미등록';
                var meta = [assignment.teacherName, assignment.day, assignment.period, assignment.time].filter(Boolean).join(' · ') || '시간표 정보 미등록';
                return '<button type="button" class="eie-apms-assignment-row" onclick="EieStudentsView.openClassroom(' + JSON.stringify(assignment.cellId) + ')">'
                    + '<strong>' + esc(title) + '</strong>'
                    + '<span>' + esc(meta) + '</span>'
                    + '</button>';
            }).join('') : '<p class="eie-apms-muted">배정된 EIE 수업이 없습니다.</p>')
            + '<div class="eie-action-row">'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.openTimetable()">시간표 보기</button>'
            + '</div>'
            + '</div>';
    }

    function renderReadyPanel(kind) {
        var title = kind === 'consultation' ? '상담' : '출결/숙제';
        var body = kind === 'consultation'
            ? '상담 저장 endpoint는 다음 라운드에서 연결합니다. 현재는 APMS와 같은 위치와 문법만 유지합니다.'
            : '출결과 숙제 저장 endpoint는 다음 라운드에서 연결합니다. 지금은 학생별 운영 정보를 읽기 전용으로 정리합니다.';
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>' + esc(title) + '</h3><span>준비중</span></div>'
            + '<p class="eie-apms-muted">' + esc(body) + '</p>'
            + '<button type="button" class="eie-secondary-button" disabled>저장 준비중</button>'
            + '</div>';
    }

    function renderTabBody(student) {
        if (_tab === 'contacts') return renderContacts(student);
        if (_tab === 'classes') return renderAssignments(student);
        if (_tab === 'consultation') return renderReadyPanel('consultation');
        if (_tab === 'attendance') return renderReadyPanel('attendance');
        return '<div class="eie-apms-card">'
            + '<div class="eie-apms-section-head"><h3>기본정보</h3><span>EIE</span></div>'
            + '<div class="eie-apms-field-grid">'
            + renderField('학생명', displayName(student))
            + renderField('학년', gradeOf(student))
            + renderField('학교', schoolOf(student))
            + renderField('상태', statusLabel(statusOf(student)))
            + renderField('대표 연락처', primaryPhone(student))
            + '</div>'
            + '<div class="eie-apms-note">'
            + '<span>메모</span>'
            + '<p>' + esc(memoOf(student) || '메모가 없습니다.') + '</p>'
            + '</div>'
            + '</div>';
    }

    function renderTabButton(tab, label) {
        return '<button type="button" class="eie-apms-tab' + (_tab === tab ? ' is-active' : '') + '" onclick="EieStudentsView.setTab(' + JSON.stringify(tab) + ')">' + esc(label) + '</button>';
    }

    function renderDetail(student) {
        if (!student) return renderEmptyDetail();
        var sid = rowId(student);
        if (_mode === 'edit') return renderEditForm(student);

        return '<aside class="eie-apms-detail-panel">'
            + '<div class="eie-apms-detail-head">'
            + '<div>'
            + '<h2>' + esc(displayName(student)) + '</h2>'
            + '<div class="eie-apms-head-badges">'
            + renderStatusBadge(statusOf(student))
            + '<span class="eie-apms-pill">' + esc([schoolOf(student), gradeOf(student)].filter(Boolean).join(' ') || '학년 미등록') + '</span>'
            + '<span class="eie-apms-pill">' + esc(assignmentsOf(student).length + '개 수업') + '</span>'
            + '</div>'
            + '</div>'
            + '<button type="button" class="eie-icon-button" onclick="EieStudentsView.closeDetail()">닫기</button>'
            + '</div>'
            + '<div class="eie-apms-detail-actions">'
            + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.startEdit(' + JSON.stringify(sid) + ')">수정</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.updateStatus(' + JSON.stringify(sid) + ', \'active\')" ' + (statusOf(student) === 'active' ? 'disabled' : '') + '>재원</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieStudentsView.updateStatus(' + JSON.stringify(sid) + ', \'inactive\')" ' + (statusOf(student) === 'inactive' ? 'disabled' : '') + '>비활성</button>'
            + '<button type="button" class="eie-danger-button" onclick="EieStudentsView.archiveStudent(' + JSON.stringify(sid) + ')" ' + (statusOf(student) === 'archived' ? 'disabled' : '') + '>보관 처리</button>'
            + '</div>'
            + '<div class="eie-apms-tabs">'
            + renderTabButton('basic', '기본정보')
            + renderTabButton('contacts', '연락처')
            + renderTabButton('classes', '수업 배정')
            + renderTabButton('consultation', '상담')
            + renderTabButton('attendance', '출결/숙제')
            + '</div>'
            + renderTabBody(student)
            + '</aside>';
    }

    function renderCreateForm() {
        return renderStudentForm(null);
    }

    function renderEditForm(student) {
        return renderStudentForm(student);
    }

    function renderStudentForm(student) {
        var isEdit = !!student;
        var sid = isEdit ? rowId(student) : '';
        var prefix = isEdit ? 'edit' : 'create';
        var title = isEdit ? '학생 정보 수정' : '신규 학생 등록';
        var status = isEdit ? statusOf(student) : 'active';
        return '<aside class="eie-apms-detail-panel">'
            + '<div class="eie-apms-detail-head">'
            + '<h2>' + esc(title) + '</h2>'
            + '<button type="button" class="eie-icon-button" onclick="' + (isEdit ? 'EieStudentsView.cancelEdit()' : 'EieStudentsView.cancelCreate()') + '">닫기</button>'
            + '</div>'
            + '<div id="eie-student-form-msg"></div>'
            + '<div class="eie-apms-form">'
            + '<label><span>학생명 *</span><input id="' + prefix + '-name" type="text" value="' + esc(isEdit ? displayName(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>학년</span><input id="' + prefix + '-grade" type="text" value="' + esc(isEdit ? gradeOf(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>학교</span><input id="' + prefix + '-school" type="text" value="' + esc(isEdit ? schoolOf(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>대표 연락처</span><input id="' + prefix + '-phone" type="tel" value="' + esc(isEdit ? primaryPhone(student) : '') + '" autocomplete="off"></label>'
            + '<label><span>상태</span><select id="' + prefix + '-status">'
            + '<option value="active"' + (status === 'active' ? ' selected' : '') + '>재원</option>'
            + '<option value="inactive"' + (status === 'inactive' ? ' selected' : '') + '>비활성</option>'
            + '<option value="needs_review"' + (status === 'needs_review' ? ' selected' : '') + '>확인 필요</option>'
            + '<option value="archived"' + (status === 'archived' ? ' selected' : '') + '>보관</option>'
            + '</select></label>'
            + '<label class="is-wide"><span>메모</span><textarea id="' + prefix + '-memo">' + esc(isEdit ? memoOf(student) : '') + '</textarea></label>'
            + '<div class="eie-action-row is-wide">'
            + '<button type="button" class="eie-primary-button" onclick="' + (isEdit ? 'EieStudentsView.submitEdit(' + JSON.stringify(sid) + ')' : 'EieStudentsView.submitCreate()') + '" ' + (_saving ? 'disabled' : '') + '>' + (_saving ? '저장 중...' : '저장') + '</button>'
            + '<button type="button" class="eie-secondary-button" onclick="' + (isEdit ? 'EieStudentsView.cancelEdit()' : 'EieStudentsView.cancelCreate()') + '">취소</button>'
            + '</div>'
            + '</div>'
            + '</aside>';
    }

    function formPayload(prefix) {
        var name = text(document.getElementById(prefix + '-name') && document.getElementById(prefix + '-name').value);
        var grade = text(document.getElementById(prefix + '-grade') && document.getElementById(prefix + '-grade').value);
        var school = text(document.getElementById(prefix + '-school') && document.getElementById(prefix + '-school').value);
        var phone = text(document.getElementById(prefix + '-phone') && document.getElementById(prefix + '-phone').value);
        var statusEl = document.getElementById(prefix + '-status');
        var memo = text(document.getElementById(prefix + '-memo') && document.getElementById(prefix + '-memo').value);
        return {
            display_name: name,
            name: name,
            grade: grade,
            school_name: school,
            phone: phone,
            status: statusEl ? statusEl.value : 'active',
            memo: memo
        };
    }

    function showFormError(message) {
        var target = document.getElementById('eie-student-form-msg');
        if (target) target.innerHTML = '<div class="eie-error-box">' + esc(message) + '</div>';
    }

    async function afterWrite(result, studentId) {
        var row = result && (result.student || result.data);
        if (row && row.id && window.EieApmsState && typeof EieApmsState.syncStudent === 'function') {
            EieApmsState.syncStudent(row);
        }
        if (studentId) _selectedId = String(studentId);
        if (row && row.id) _selectedId = String(row.id);
        _mode = 'detail';
        _notice = '저장했습니다.';
        await loadFoundation(true);
        await EieRouter.open('students');
    }

    window.EieStudentsView = {
        render: async function () {
            await loadFoundation(false);
            var selected = selectedStudent();
            if (_selectedId && !selected) selected = null;
            var panel = _mode === 'create' ? renderCreateForm() : renderDetail(selected);
            var noticeHtml = _notice ? '<div class="eie-success-box">' + esc(_notice) + '</div>' : '';
            var errorHtml = _error ? '<div class="eie-error-box">' + esc(_error) + '</div>' : '';
            var loadingHtml = _loading ? '<div class="eie-api-note">학생 정보를 불러오는 중입니다.</div>' : '';
            return '<section class="eie-apms-students-screen" aria-labelledby="eie-students-title">'
                + '<button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>'
                + '<div class="eie-apms-page-head">'
                + '<div><h1 id="eie-students-title">학생관리</h1><p>APMS 학생관리 흐름에 맞춰 EIE 학생, 연락처, 수업 배정을 관리합니다.</p></div>'
                + '<button type="button" class="eie-primary-button" onclick="EieStudentsView.startCreate()">+ 신규 등록</button>'
                + '</div>'
                + noticeHtml + errorHtml + loadingHtml
                + renderSummary()
                + renderSearchToolbar()
                + '<div class="eie-apms-student-layout">'
                + '<div class="eie-apms-list-panel">' + renderList() + '</div>'
                + panel
                + '</div>'
                + '</section>';
        },

        setQuery: function (query) {
            _query = text(query);
            EieRouter.open('students');
        },

        setStatusFilter: function (status) {
            _statusFilter = text(status) || 'active';
            EieRouter.open('students');
        },

        openDetail: async function (studentId) {
            _selectedId = text(studentId);
            _mode = 'detail';
            _tab = _tab || 'basic';
            _notice = '';
            if (!selectedStudent() && _selectedId) {
                await loadFoundation(true);
                if (!selectedStudent()) _query = _selectedId;
            }
            return EieRouter.open('students');
        },

        closeDetail: function () {
            _selectedId = '';
            _mode = 'detail';
            EieRouter.open('students');
        },

        startCreate: function () {
            _selectedId = '';
            _mode = 'create';
            _notice = '';
            EieRouter.open('students');
        },

        cancelCreate: function () {
            _mode = 'detail';
            EieRouter.open('students');
        },

        submitCreate: async function () {
            if (_saving) return;
            var payload = formPayload('create');
            if (!payload.display_name) return showFormError('학생명은 필수입니다.');
            _saving = true;
            try {
                var result = await EieApi.createStudent(payload);
                await afterWrite(result, result && (result.id || result.student_id));
            } catch (err) {
                showFormError(err && err.message ? err.message : '학생 등록에 실패했습니다.');
            } finally {
                _saving = false;
            }
        },

        startEdit: function (studentId) {
            if (studentId) _selectedId = text(studentId);
            _mode = 'edit';
            _notice = '';
            EieRouter.open('students');
        },

        cancelEdit: function () {
            _mode = 'detail';
            EieRouter.open('students');
        },

        submitEdit: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId || _selectedId);
            var payload = formPayload('edit');
            if (!payload.display_name) return showFormError('학생명은 필수입니다.');
            _saving = true;
            try {
                var result = await EieApi.updateStudent(sid, payload);
                await afterWrite(result, sid);
            } catch (err) {
                showFormError(err && err.message ? err.message : '학생 수정에 실패했습니다.');
            } finally {
                _saving = false;
            }
        },

        updateStatus: async function (studentId, status) {
            if (_saving) return;
            var sid = text(studentId);
            _saving = true;
            try {
                var result = await EieApi.updateStudentStatus(sid, status);
                await afterWrite(result, sid);
            } catch (err) {
                _error = err && err.message ? err.message : '상태 변경에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        archiveStudent: async function (studentId) {
            if (_saving) return;
            var sid = text(studentId);
            if (!window.confirm('이 학생을 보관 처리할까요? 실제 삭제 없이 상태만 보관으로 변경됩니다.')) return;
            _saving = true;
            try {
                var result = await EieApi.deleteStudent(sid);
                await afterWrite(result, sid);
            } catch (err) {
                _error = err && err.message ? err.message : '보관 처리에 실패했습니다.';
                await EieRouter.open('students');
            } finally {
                _saving = false;
            }
        },

        setTab: function (tab) {
            _tab = text(tab) || 'basic';
            EieRouter.open('students');
        },

        openClassroom: function (cellId) {
            if (cellId && window.EieClassroomView && typeof EieClassroomView.openDetail === 'function') {
                EieClassroomView.openDetail(cellId);
                return;
            }
            EieRouter.open('classroom');
        },

        openTimetable: function () {
            EieRouter.open('timetable-v2');
        },

        refresh: function (force) {
            return refreshView(force !== false);
        },

        copyPhone: async function (phone) {
            var value = text(phone);
            if (!value) return;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(value);
                if (window.toast) window.toast('연락처를 복사했습니다.', 'success');
            } catch (err) {
                if (window.toast) window.toast(value, 'info');
            }
        }
    };
})();
