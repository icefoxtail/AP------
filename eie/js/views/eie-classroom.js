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
    var _editStudentMode = false; // 학생 상세 수정 모드
    var _editCellTeachersMode = false;
    var _saving = false;
    var _addStudentMode = false;  // 학생 추가 패널
    var _consultationRows = [];
    var _consultationLoadedStudentId = '';
    var _consultationFormOpen = false;
    var _consultationDraftDate = '';

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
        if (_filterTeacherName && window.EieClassroomScope && typeof EieClassroomScope.cellsForTeacher === 'function') {
            visible = EieClassroomScope.cellsForTeacher({
                teacherName: _filterTeacherName,
                role: 'owner',
                cells: visible
            });
        }
        if (_todayFilterDate && window.EieClassroomScope && typeof EieClassroomScope.isCellOnDate === 'function') {
            visible = visible.filter(function (cell) {
                return EieClassroomScope.isCellOnDate(cell, _todayFilterDate);
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
            return String(s.assignment_id || s.student_id || '') === String(_selectedStudentKey);
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

    function attendanceRecordFor(studentId, date) {
        var sid = text(studentId);
        var day = normalizeDate(date);
        return _attendanceRows.find(function (row) {
            return String(row.student_id || '') === sid && String(row.date || '').slice(0, 10) === day;
        }) || null;
    }

    function attendanceDisplayStatus(status) {
        var cur = text(status);
        return cur && cur !== '미기록' ? cur : '등원';
    }

    function nextAttendanceStatus(status) {
        var cur = attendanceDisplayStatus(status);
        if (cur === '등원') return '결석';
        if (cur === '결석') return '수업 없음';
        return '등원';
    }

    function attendanceCompactLabel(status) {
        var cur = attendanceDisplayStatus(status);
        if (cur === '등원') return '○';
        if (cur === '결석') return '×';
        return '';
    }

    function attendanceButtonClass(status) {
        var cur = attendanceDisplayStatus(status);
        if (cur === '결석') return ' is-absent';
        if (cur === '수업 없음') return ' is-empty';
        return ' is-present';
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
    function renderStudentDetail(student, cell) {
        if (!student) return '';
        var sid = String(student.student_id || student.id || '');
        var cellId = cell ? String(cell.id || '') : '';
        var name = displayName(student);
        var grade = gradeOf(student);
        var phone = phoneOf(student);

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
                + '<label>학생구분'
                + renderStudentTypeSelect('cls-edit-student-type', studentTypeOf(student))
                + '</label>'
                + '<label>학년'
                + renderGradeSelect('cls-edit-grade', grade)
                + '</label>'
                + '<label>학교'
                + '<input type="text" id="cls-edit-school" value="' + esc(schoolOf(student)) + '">'
                + '</label>'
                + '<label>학생 연락처'
                + '<input type="tel" id="cls-edit-phone" value="' + esc(phone) + '" placeholder="010-0000-0000">'
                + '</label>'
                + '<label>학부모 연락처'
                + '<input type="tel" id="cls-edit-parent-phone" value="' + esc(parentPhoneOf(student)) + '" placeholder="010-0000-0000">'
                + '</label>'
                + '<label>보호자 관계'
                + '<input type="text" id="cls-edit-guardian-relation" value="' + esc(guardianRelationOf(student)) + '">'
                + '</label>'
                + '<label class="is-wide">주소'
                + '<input type="text" id="cls-edit-address" value="' + esc(addressOf(student)) + '">'
                + '</label>'
                + '<label>차량'
                + '<input type="text" id="cls-edit-vehicle" value="' + esc(vehicleInfoOf(student)) + '">'
                + '</label>'
                + '<label>PIN'
                + '<input type="text" id="cls-edit-pin" inputmode="numeric" maxlength="4" value="' + esc(studentPinOf(student)) + '">'
                + '</label>'
                + renderStudentTeacherPicker(student)
                + '<label>상태'
                + '<select id="cls-edit-status">'
                + '<option value="active"' + (statusOf(student) === 'active' ? ' selected' : '') + '>재원</option>'
                + '<option value="inactive"' + (statusOf(student) === 'inactive' ? ' selected' : '') + '>비활성</option>'
                + '<option value="needs_review"' + (statusOf(student) === 'needs_review' ? ' selected' : '') + '>확인 필요</option>'
                + '<option value="archived"' + (statusOf(student) === 'archived' ? ' selected' : '') + '>보관</option>'
                + '</select>'
                + '</label>'
                + '<label class="is-wide">메모'
                + '<textarea id="cls-edit-memo" style="resize:vertical;min-height:60px;">' + esc(memoOf(student)) + '</textarea>'
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
            + renderDetailRow('학생구분', studentTypeOf(student))
            + renderDetailRow('학년', grade)
            + renderDetailRow('학교', schoolOf(student))
            + renderDetailRow('학생 연락처', phone)
            + renderDetailRow('학부모 연락처', parentPhoneOf(student))
            + renderDetailRow('보호자 관계', guardianRelationOf(student))
            + renderDetailRow('주소', addressOf(student))
            + renderDetailRow('차량', vehicleInfoOf(student))
            + renderDetailRow('PIN', studentPinOf(student))
            + renderDetailRow('담당 선생님', studentTeacherNames(student).join(', '))
            + (cell ? renderDetailRow('수업', cell.class_name_raw || '-') : '')
            + (cell ? renderDetailRow('클래스 담임', teacherNamesOfCell(cell).join(', ') || '-') : '')
            + (cell ? renderDetailRow('교시', [cell.period_label, cell.start_time ? cell.start_time + '~' + (cell.end_time || '') : ''].filter(Boolean).join(' ') || '-') : '')
            + '</div>'
            + '<div class="eie-apms-note" style="margin-top:12px;"><span>메모</span><p>' + esc(memoOf(student) || '메모가 없습니다.') + '</p></div>'
            + renderStudentConsultationSection(student, cell)
            + (removeBtn ? '<div class="eie-action-row" style="margin-top:14px;">' + removeBtn + '</div>' : '')
            + '</aside>';
    }

    async function loadStudentConsultations(studentId) {
        var sid = text(studentId);
        if (!sid || !window.EieApi || typeof EieApi.getConsultations !== 'function') {
            _consultationRows = [];
            _consultationLoadedStudentId = sid;
            return;
        }
        if (_consultationLoadedStudentId === sid) return;
        try {
            var result = await EieApi.getConsultations(sid);
            var rows = (result && (result.consultations || result.data || result.items)) || [];
            _consultationRows = Array.isArray(rows) ? rows : [];
            _consultationLoadedStudentId = sid;
            if (window.EieState && typeof EieState.mergeStudentConsultations === 'function') {
                EieState.mergeStudentConsultations(sid, _consultationRows);
            }
        } catch (err) {
            _consultationRows = [];
            _consultationLoadedStudentId = sid;
        }
    }

    function consultationRowsFor(studentId) {
        var sid = text(studentId);
        if (!sid) return [];
        return (_consultationRows || []).filter(function (row) {
            var rowSid = text(row.student_id || row.studentId || row.sid);
            return !rowSid || rowSid === sid;
        });
    }

    function consultationDateOf(row) {
        return text(row.date || row.consultation_date || row.created_at || row.updated_at).slice(0, 10);
    }

    function consultationTypeOf(row) {
        return text(row.type || row.consultation_type || row.category) || '상담';
    }

    function renderStudentConsultationSection(student, cell) {
        var sid = text(student && (student.student_id || student.id));
        if (!sid) return '';
        var cellId = text(cell && cell.id);
        var rows = consultationRowsFor(sid);
        return '<section class="eie-classroom-consultation-section" aria-label="상담">'
            + '<div class="eie-classroom-consultation-head">'
            + '<h3>상담</h3>'
            + '<span>' + esc(String(rows.length)) + '건</span>'
            + '</div>'
            + (_consultationFormOpen
                ? renderStudentConsultationForm(sid, cellId)
                : '<div class="eie-apms-consultation-actions"><button type="button" class="eie-secondary-button" onclick="EieClassroomView.openStudentConsultationForm()">상담 추가</button></div>')
            + renderStudentConsultationList(rows)
            + '</section>';
    }

    function renderStudentConsultationList(rows) {
        if (!rows.length) {
            return '<div class="eie-apms-consultation-empty">상담 기록이 없습니다.</div>';
        }
        return '<div class="eie-apms-consultation-list">'
            + rows.map(function (row) {
                var content = text(row.content || row.memo || row.note);
                var nextAction = text(row.next_action || row.nextAction);
                return '<article class="eie-apms-consultation-row">'
                    + '<div class="eie-apms-consultation-main">'
                    + '<div class="eie-apms-consultation-meta">'
                    + '<em>' + esc(consultationTypeOf(row)) + '</em>'
                    + '<span>' + esc(consultationDateOf(row) || '-') + '</span>'
                    + '</div>'
                    + '<p>' + esc(content || '내용이 없습니다.') + '</p>'
                    + (nextAction ? '<div class="eie-apms-consultation-next"><strong>다음</strong> ' + esc(nextAction) + '</div>' : '')
                    + '</div>'
                    + '</article>';
            }).join('')
            + '</div>';
    }

    function renderStudentConsultationForm(studentId, cellId) {
        var defaultDate = normalizeDate(_consultationDraftDate || todayIso());
        var options = ['상담', '학습', '태도', '성적', '기타'];
        return '<div class="eie-apms-consultation-form">'
            + '<div class="eie-apms-consultation-form-head">'
            + '<strong>상담 추가</strong>'
            + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.closeStudentConsultationForm()">취소</button>'
            + '</div>'
            + '<div class="eie-apms-consultation-form-grid">'
            + '<label><span>날짜</span><input type="date" id="cls-consultation-date" value="' + esc(defaultDate) + '"></label>'
            + '<label><span>구분</span><select id="cls-consultation-type">'
            + options.map(function (option) {
                return '<option value="' + esc(option) + '">' + esc(option) + '</option>';
            }).join('')
            + '</select></label>'
            + '</div>'
            + '<label><span>상담 내용</span><textarea id="cls-consultation-content"></textarea></label>'
            + '<label><span>다음 액션</span><input type="text" id="cls-consultation-next-action"></label>'
            + '<div class="eie-apms-consultation-save-row">'
            + '<button type="button" class="eie-primary-button" onclick="EieClassroomView.saveStudentConsultation(' + jsArg(studentId) + ',' + jsArg(cellId) + ')" ' + (_saving ? 'disabled' : '') + '>'
            + (_saving ? '저장 중...' : '저장')
            + '</button>'
            + '<button type="button" class="eie-secondary-button" onclick="EieClassroomView.closeStudentConsultationForm()">취소</button>'
            + '</div>'
            + '</div>';
    }

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
            + '<button type="button" class="eie-classroom-v4-name" onclick="EieClassroomView.openStudentDetail(' + JSON.stringify(String(key)) + ')">'
            + '<strong>' + esc(name) + '</strong>'
            + (grade ? '<span>' + esc(grade) + '</span>' : '')
            + '</button>'
            + '<button type="button" class="eie-classroom-v4-status' + attendanceButtonClass(status) + '" '
            + 'data-eie-class-attendance="' + esc(sid) + '" '
            + 'aria-label="' + esc(name + ' 출석 ' + status) + '" '
            + 'title="' + esc(status) + '" '
            + 'onclick="EieClassroomView.toggleAttendance(' + JSON.stringify(sid) + ',' + JSON.stringify(cellId) + ',' + JSON.stringify(date) + ')">'
            + esc(attendanceCompactLabel(status))
            + '</button>'
            + '<button type="button" class="eie-classroom-v4-status is-consult" '
            + 'data-eie-class-consultation="' + esc(sid) + '" '
            + 'aria-label="' + esc(name + ' 상담') + '" title="상담" '
            + 'onclick="EieClassroomView.openConsultation(' + JSON.stringify(sid) + ',' + JSON.stringify(cellId) + ',' + JSON.stringify(date) + ')">★</button>'
            + '</div>';
    }

    // ── 수업 상세 패널 ────────────────────────────────────────────────
    function renderCellDetail(cell) {
        if (!cell) return '';
        var cellId = String(cell.id || '');
        var students = getAssignedStudents(cell);
        var teacherNames = teacherNamesOfCell(cell);
        if (_editCellTeachersMode) {
            return '<aside class="eie-editor-panel" aria-label="담임 선생님 수정">'
                + '<div class="eie-editor-head">'
                + '<h2>담임 선생님</h2>'
                + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.cancelCellTeachersEdit()">취소</button>'
                + '</div>'
                + '<div id="eie-cell-msg"></div>'
                + '<p style="font-size:13px;color:var(--eie-muted);margin:0 0 10px;">이미 등록된 선생님 이름 중 이 클래스에 들어가는 담임/담당 선생님을 모두 선택합니다.</p>'
                + renderCellTeacherPicker(cell)
                + '<div class="eie-action-row" style="margin-top:14px;">'
                + '<button type="button" class="eie-primary-button" onclick="EieClassroomView.submitCellTeachers(' + JSON.stringify(cellId) + ')" ' + (_saving ? 'disabled' : '') + '>' + (_saving ? '저장 중...' : '저장') + '</button>'
                + '<button type="button" class="eie-secondary-button" onclick="EieClassroomView.cancelCellTeachersEdit()">취소</button>'
                + '</div>'
                + '</aside>';
        }
        var studentsHtml = students.length
            ? '<div class="eie-classroom-v4-board">'
                + '<div class="eie-classroom-v4-head"><span>이름</span><span>출석</span><span>상담</span></div>'
                + students.map(function (s) { return renderStudentOperationRow(cell, s); }).join('')
                + '</div>'
            : '<div class="eie-empty-box" style="margin-top:8px;">배정된 학생이 없습니다.</div>';

        return '<aside class="eie-editor-panel" aria-label="수업 상세">'
            + '<div class="eie-editor-head">'
            + '<h2>' + esc(cell.class_name_raw || '수업명 없음') + '</h2>'
            + '<button type="button" class="eie-icon-button" onclick="EieClassroomView.closeDetail()">닫기</button>'
            + '</div>'
            + '<div class="eie-detail-grid">'
            + '<div class="eie-detail-row"><span>담임/담당</span><strong>' + esc(teacherNames.join(', ') || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>교시</span><strong>' + esc(cell.period_label || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>시간</span><strong>' + esc([cell.start_time, cell.end_time].filter(Boolean).join('~') || '-') + '</strong></div>'
            + '<div class="eie-detail-row"><span>학생</span><strong>' + esc(String(students.length)) + '명</strong></div>'
            + '</div>'
            + '<div id="eie-cell-msg"></div>'
            + '<div class="eie-admin-section-title-row" style="margin-top:14px;">'
            + '<h3 class="eie-admin-section-title">배정 학생</h3>'
            + '<button type="button" class="eie-small-button" onclick="EieClassroomView.startCellTeachersEdit()">담임 수정</button>'
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
            if (student) {
                await loadStudentConsultations(student.student_id || student.id);
            }
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
                + (_loaded && !_error ? renderSummary(visibleCells) : '')
                + '<div class="' + layoutClass + '">'
                + '<div class="eie-timetable-main">' + renderCards(visibleCells) + '</div>'
                + panelHtml
                + '</div>'
                + '</div>'
                + '</section>';
        },

        openTeacher: function (name) {
            _filterTeacherName = text(name);
            _todayFilterDate = '';
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        openCell: function (cellId) {
            _filterTeacherName = '';
            _todayFilterDate = '';
            this.openDetail(cellId);
        },

        openTodayForTeacher: function (name, date) {
            _filterTeacherName = text(name);
            _todayFilterDate = normalizeDate(date || todayIso());
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        openDetail: function (cellId) {
            _filterTeacherName = '';
            _todayFilterDate = '';
            _selectedCellId = cellId;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        closeDetail: function () {
            _selectedCellId = null;
            _selectedStudentKey = null;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        openStudentDetail: function (studentKey) {
            _selectedStudentKey = studentKey;
            _editStudentMode = false;
            _editCellTeachersMode = false;
            _addStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        closeStudentDetail: function () {
            _selectedStudentKey = null;
            _editStudentMode = false;
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        startStudentEdit: function () {
            _editStudentMode = true;
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

        openStudentConsultationForm: function () {
            _consultationFormOpen = true;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        closeStudentConsultationForm: function () {
            _consultationFormOpen = false;
            _consultationDraftDate = '';
            EieRouter.open('classroom');
        },

        saveStudentConsultation: async function (studentId, cellId) {
            if (_saving) return;
            var sid = text(studentId);
            if (!sid || !window.EieApi || typeof EieApi.createConsultation !== 'function') return;
            var dateEl = document.getElementById('cls-consultation-date');
            var typeEl = document.getElementById('cls-consultation-type');
            var contentEl = document.getElementById('cls-consultation-content');
            var nextActionEl = document.getElementById('cls-consultation-next-action');
            var msgEl = document.getElementById('eie-classroom-student-msg');
            var payload = {
                student_id: sid,
                date: normalizeDate(dateEl && dateEl.value ? dateEl.value : todayIso()),
                type: text(typeEl && typeEl.value) || '상담',
                content: text(contentEl && contentEl.value),
                next_action: text(nextActionEl && nextActionEl.value),
                raw_meta_json: { source: 'classroom', timetable_cell_id: text(cellId) }
            };
            if (!payload.content) {
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">상담 내용을 입력해 주세요.</div>';
                return;
            }
            _saving = true;
            if (msgEl) msgEl.innerHTML = '';
            try {
                var result = await EieApi.createConsultation(payload);
                var rows = (result && (result.consultations || result.data || (result.consultation ? [result.consultation] : []))) || [];
                if (rows.length) {
                    var incomingIds = rows.map(function (row) { return text(row.id || row.consultation_id); }).filter(Boolean);
                    _consultationRows = _consultationRows.filter(function (row) {
                        var rowId = text(row.id || row.consultation_id);
                        return rowId && incomingIds.length ? incomingIds.indexOf(rowId) < 0 : true;
                    }).concat(rows);
                } else if (result && result.consultation) {
                    _consultationRows = _consultationRows.concat([result.consultation]);
                }
                _consultationLoadedStudentId = sid;
                if (window.EieState && typeof EieState.mergeStudentConsultations === 'function') {
                    EieState.mergeStudentConsultations(sid, _consultationRows);
                }
                _consultationFormOpen = false;
                _consultationDraftDate = '';
                _saving = false;
                EieRouter.open('classroom');
            } catch (err) {
                _saving = false;
                if (msgEl) msgEl.innerHTML = '<div class="eie-error-box">' + esc(err.message || '상담을 저장하지 못했습니다.') + '</div>';
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
            _consultationFormOpen = true;
            _consultationDraftDate = normalizeDate(date || todayIso());
            if (window.EieRouter && typeof EieRouter.open === 'function') {
                EieRouter.open('classroom');
            }
        }
    };
})();
