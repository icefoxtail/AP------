(function () {
    function normalizeStudent(row) {
        return {
            id: row.id || row.student_id || row.pin || row.student_pin || '',
            name: row.display_name || row.name || row.student_name_raw || row.normalized_name || '',
            display_name: row.display_name || row.name || '',
            grade: row.grade || row.grade_raw || '',
            school: row.school || '',
            phone: row.phone || row.phone_raw || row.normalized_phone || row.primary_phone || '',
            status: row.status || 'active',
            memo: row.memo || row.note || '',
            branch: 'eie',
            source: 'eie',
            raw: row
        };
    }

    function normalizeContact(row, student) {
        const studentId = (student && (student.id || student.student_id)) || row.student_id || '';
        return {
            id: row.id || row.contact_id || '',
            student_id: studentId,
            name: row.name || row.contact_name || '',
            relation: row.relation || row.relationship || '',
            phone: row.phone || row.phone_raw || '',
            memo: row.memo || '',
            raw_meta_json: row.raw_meta_json || null,
            is_primary: !!(row.is_primary || row.primary),
            contact_label: row.contact_label || row.label || '',
            branch: 'eie',
            raw: row
        };
    }

    function normalizeTimetableCell(cell) {
        return {
            id: cell.id || '',
            name: cell.name || cell.class_name || '',
            class_name: cell.class_name || cell.name || '',
            class_name_raw: cell.class_name_raw || cell.class_name || '',
            teacher_name: cell.teacher_name || '',
            teacher_name_raw: cell.teacher_name_raw || cell.teacher_name || '',
            day_label: cell.day_label || '',
            period_label: cell.period_label || '',
            start_time: cell.start_time || '',
            end_time: cell.end_time || '',
            status: cell.status || 'active',
            branch: 'eie',
            raw: cell
        };
    }

    // timetable_cell_id를 class_id adapter로 사용 — EIE에 아직 eie_classes 테이블이 없어
    // 1차에서는 timetable_cell_id로 class_id 역할을 대리한다.
    // 정책 근거: docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
    function normalizeAssignment(row, cell) {
        const cellId = (cell && cell.id) || row.timetable_cell_id || '';
        return {
            id: row.id || row.assignment_id || '',
            student_id: row.student_id || '',
            class_id: cellId,
            timetable_cell_id: cellId,
            status: row.status || 'active',
            branch: 'eie',
            raw: row
        };
    }

    function normalizeFoundation(studentsPayload, timetablePayload) {
        const rawStudents = Array.isArray(studentsPayload?.students) ? studentsPayload.students
            : Array.isArray(studentsPayload?.data) ? studentsPayload.data
            : Array.isArray(studentsPayload?.confirmed_students) ? studentsPayload.confirmed_students
            : [];
        const rawCells = Array.isArray(timetablePayload?.timetable_cells) ? timetablePayload.timetable_cells
            : Array.isArray(timetablePayload?.data) ? timetablePayload.data
            : [];

        const students = rawStudents.map(normalizeStudent);
        const student_contacts = [];
        const parent_contacts = [];

        rawStudents.forEach(function (row) {
            const student = normalizeStudent(row);
            const contacts = Array.isArray(row.contacts) ? row.contacts : [];
            contacts.forEach(function (c) {
                const nc = normalizeContact(c, student);
                student_contacts.push(nc);
                if (nc.relation === 'parent' || nc.is_primary) parent_contacts.push(nc);
            });
        });

        const timetable_cells = rawCells.map(normalizeTimetableCell);
        const class_students = [];
        rawCells.forEach(function (cell) {
            const nc = normalizeTimetableCell(cell);
            const assigned = Array.isArray(cell.assigned_students) ? cell.assigned_students : [];
            assigned.forEach(function (asg) {
                class_students.push(normalizeAssignment(asg, nc));
            });
        });

        return { students, student_contacts, parent_contacts, timetable_cells, class_students };
    }

    function applyFoundation(foundation) {
        if (!foundation) return;
        if (Array.isArray(foundation.students)) EieState.setStudents(foundation.students);
        if (Array.isArray(foundation.student_contacts)) EieState.setStudentContacts(foundation.student_contacts);
        if (Array.isArray(foundation.parent_contacts)) EieState.setParentContacts(foundation.parent_contacts);
        if (Array.isArray(foundation.class_students)) EieState.setClassStudents(foundation.class_students);
        if (Array.isArray(foundation.timetable_cells)) {
            EieState.setTimetableCells(foundation.timetable_cells.map(function (nc) { return nc.raw || nc; }));
        }
        var ui = EieState.get().ui;
        ui.eieApmsCompat.loadedAt = Date.now();
        ui.eieApmsCompat.error = '';
        ui.eieApmsCompat.loading = false;
    }

    async function loadFoundation(options) {
        var ui = EieState.get().ui;
        ui.eieApmsCompat.loading = true;
        ui.eieApmsCompat.error = '';
        ui.eieApmsCompat.lastSource = 'loadFoundation';

        var errors = [];
        var studentsPayload = null;
        var timetablePayload = null;

        try {
            studentsPayload = await EieApi.getStudents();
        } catch (err) {
            if (err && (err.status === 401 || err.status === 403)) {
                var authMsg = err.status === 401
                    ? '인증 만료: EIE 학생 조회 실패 (401)'
                    : '권한 없음: EIE 학생 조회 실패 (403)';
                errors.push({ source: 'students', error: authMsg, status: err.status });
                ui.eieApmsCompat.loading = false;
                ui.eieApmsCompat.error = authMsg;
                return { success: false, students: [], contacts: [], timetable_cells: [], class_students: [], errors: errors };
            }
            errors.push({ source: 'students', error: (err && err.message) || String(err) });
        }

        try {
            timetablePayload = await EieApi.getTimetable(null, { status: 'active,imported,needs_review' });
        } catch (err) {
            if (err && (err.status === 401 || err.status === 403)) {
                var ttMsg = err.status === 401
                    ? '인증 만료: EIE 시간표 조회 실패 (401)'
                    : '권한 없음: EIE 시간표 조회 실패 (403)';
                errors.push({ source: 'timetable', error: ttMsg, status: err.status });
            } else {
                errors.push({ source: 'timetable', error: (err && err.message) || String(err) });
            }
        }

        var foundation = normalizeFoundation(studentsPayload, timetablePayload);
        applyFoundation(foundation);

        if (errors.length) {
            ui.eieApmsCompat.error = errors.map(function (e) { return e.error; }).join('; ');
        }
        ui.eieApmsCompat.loading = false;

        return {
            success: errors.length === 0,
            students: foundation.students,
            contacts: foundation.student_contacts,
            timetable_cells: foundation.timetable_cells,
            class_students: foundation.class_students,
            errors: errors
        };
    }

    function syncStudent(row) {
        if (!row || !row.id) return;
        EieState.upsertStudent(normalizeStudent(row));
    }

    function syncStudentList(rows) {
        if (!Array.isArray(rows)) return;
        EieState.setStudents(rows.map(normalizeStudent));
    }

    function mergeStudentContacts(studentId, contacts) {
        if (EieState.mergeStudentContacts) {
            EieState.mergeStudentContacts(studentId, (contacts || []).map(normalizeContact));
        }
    }

    function mergeStudentConsultations(studentId, consultations) {
        if (EieState.mergeStudentConsultations) {
            EieState.mergeStudentConsultations(studentId, consultations || []);
        }
    }

    function getState() {
        return EieState.get();
    }

    window.EieApmsState = {
        normalizeStudent: normalizeStudent,
        normalizeContact: normalizeContact,
        normalizeTimetableCell: normalizeTimetableCell,
        normalizeAssignment: normalizeAssignment,
        normalizeFoundation: normalizeFoundation,
        applyFoundation: applyFoundation,
        loadFoundation: loadFoundation,
        syncStudent: syncStudent,
        syncStudentList: syncStudentList,
        mergeStudentContacts: mergeStudentContacts,
        mergeStudentConsultations: mergeStudentConsultations,
        getState: getState
    };

    // APMS 복사 코드가 state.db, state.ui를 직접 접근할 수 있도록 window.state를 제공한다.
    // EieState.get()의 참조를 그대로 연결한다 (복사본이 아님).
    // 이미 window.state가 있으면 덮어쓰지 않는다.
    if (!window.state && window.EieState && typeof window.EieState.get === 'function') {
        window.state = window.EieState.get();
    }
})();
