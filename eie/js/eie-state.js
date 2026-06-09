(function () {
    const state = {
        activeView: 'dashboard',
        latestImport: null,
        timetableCells: [],
        studentSeeds: [],
        contactSeeds: [],
        needsReview: [],
        workbookSheets: [],
        selectedSheetName: '',
        importPreview: null,
        importResult: null,
        importError: '',
        importNotice: '',
        isImportBusy: false,
        isTimetableBusy: false,
        lastLoadedImportId: '',
        selectedTimetableCellId: '',
        timetableEditMode: '',
        timetableNotice: '',
        timetableError: '',
        timetableStatusFilter: 'active,imported,needs_review',
        selectedStudentCandidate: null,
        studentCandidatePanelMode: '',
        studentSeedNotice: '',
        studentSeedError: '',
        db: {
            students: [],
            student_contacts: [],
            parent_contacts: [],
            consultations: [],
            classes: [],
            class_students: [],
            timetable_cells: [],
            attendance: [],
            homework: [],
            class_daily_records: [],
            class_daily_progress: [],
            homework_records: [],
            attendance_records: [],
            classroom_logs: [],
            textbooks: [],
            materials: []
        },
        // EIE 출석판 전용 슬라이스 (원장 월간 시간표 출석판 / 선생님 날짜 입력판)
        attendance: {
            month: '',                 // 원장 확인판에서 선택한 월 YYYY-MM
            viewDate: '',              // 선생님 입력판에서 선택한 날짜 YYYY-MM-DD
            byMonth: {},               // { 'YYYY-MM': records[] } 월간 캐시
            index: {},                 // { 'date|cellId': records[] } 날짜+셀 인덱스
            loadingMonth: '',          // 현재 조회 중인 월
            selectedCellId: '',        // 입력판/드릴다운이 열린 셀
            selectedDate: '',          // 입력판/드릴다운이 열린 날짜
            selectedStudentId: '',     // 입력판이 열린 학생 (실제 입력 단위)
            draftStatus: '',           // 임시 메인 상태 (등원/결석/'')
            draftTags: [],             // 임시 보조 태그 (상담/보강)
            saving: false,
            error: '',
            notice: ''
        },
        ui: {
            currentStudentDetailId: '',
            currentStudentDetailTab: 'grade',
            currentClassId: '',
            currentTimetableCellId: '',
            currentClassroomId: '',
            studentDetailLazyData: {},
            studentConsultations: { byStudent: {} },
            parentContactUi: { byStudent: {} },
            eieApmsCompat: {
                loadedAt: 0,
                loading: false,
                error: '',
                lastSource: ''
            }
        }
    };

    function asArray(rows) {
        return Array.isArray(rows) ? rows : [];
    }

    function importFromPayload(value) {
        if (!value) return null;
        return value.import_session || value.latest_import || value.data || value;
    }

    function findCell(cellId) {
        return state.timetableCells.find(cell => String(cell?.id || '') === String(cellId || '')) || null;
    }

    function parseRawMeta(value) {
        if (!value) return {};
        if (typeof value === 'object') return value;
        try { return JSON.parse(value); }
        catch (error) { return {}; }
    }

    function normalizeCandidateName(value) {
        return String(value || '').trim().replace(/\s+/g, ' ');
    }

    function getAssignedStudentCandidates(cell) {
        const rows = Array.isArray(cell?.assigned_students) ? cell.assigned_students : [];
        return rows.map((student, index) => ({
            ...student,
            source_kind: 'assigned',
            assigned_index: index,
            id: student?.assignment_id || student?.student_id || String(index),
            candidate_key: student?.assignment_id || student?.student_id || String(index),
            candidate_index: Number.isInteger(Number(student?.candidate_index)) ? Number(student.candidate_index) : index,
            name: student?.name || student?.display_name || '',
            student_name_raw: student?.student_name_raw || student?.name || student?.display_name || '',
            normalized_name: student?.normalized_name || normalizeCandidateName(student?.name || student?.display_name || ''),
            grade_raw: student?.grade_raw || student?.grade || '',
            phone_raw: student?.phone_raw || student?.phone || '',
            normalized_phone: student?.normalized_phone || '',
            flags: Array.isArray(student?.flags) ? student.flags : [],
            match_status: 'confirmed',
            is_confirmed: true
        })).filter(candidate => candidate.name || candidate.student_name_raw || candidate.normalized_name);
    }

    function getStudentCandidatesFromMeta(meta) {
        const candidates = Array.isArray(meta?.student_candidates) ? meta.student_candidates : [];
        if (candidates.length) {
            return candidates.map((candidate, index) => ({
                ...candidate,
                source_kind: 'candidate',
                candidate_key: String(Number.isInteger(Number(candidate?.candidate_index)) ? Number(candidate.candidate_index) : index),
                candidate_index: Number.isInteger(Number(candidate?.candidate_index)) ? Number(candidate.candidate_index) : index,
                name: candidate?.name || candidate?.student_name_raw || candidate?.studentName || '',
                normalized_name: candidate?.normalized_name || normalizeCandidateName(candidate?.name || candidate?.student_name_raw || candidate?.studentName || ''),
                flags: Array.isArray(candidate?.flags) ? candidate.flags : []
            })).filter(candidate => candidate.name || candidate.student_name_raw || candidate.normalized_name);
        }

        const values = Array.isArray(meta?.student_names)
            ? meta.student_names
            : Array.isArray(meta?.students)
                ? meta.students
                : Array.isArray(meta?.studentSeeds)
                    ? meta.studentSeeds
                    : [];

        return values.map((item, index) => {
            if (typeof item === 'string') {
                const name = normalizeCandidateName(item);
                return {
                    candidate_index: index,
                    name,
                    student_name_raw: item,
                    normalized_name: name,
                    flags: ['needs_review'],
                    match_status: 'needs_review'
                };
            }

            const name = item?.name || item?.student_name_raw || item?.studentName || '';
            return {
                ...item,
                candidate_index: Number.isInteger(Number(item?.candidate_index)) ? Number(item.candidate_index) : index,
                name,
                student_name_raw: item?.student_name_raw || name,
                normalized_name: item?.normalized_name || normalizeCandidateName(name),
                flags: Array.isArray(item?.flags) ? item.flags : ['needs_review'],
                match_status: item?.match_status || 'needs_review'
            };
        }).filter(candidate => candidate.name || candidate.student_name_raw || candidate.normalized_name);
    }

    function findStudentCandidate(cellId, candidateKey) {
        const cell = findCell(cellId);
        if (!cell) return null;
        const key = String(candidateKey == null ? '' : candidateKey);
        const index = Number(key);

        const assignedCandidates = getAssignedStudentCandidates(cell);
        const assigned = assignedCandidates.find(item => (
            String(item?.assignment_id || '') === key ||
            String(item?.student_id || '') === key ||
            String(item?.id || '') === key ||
            String(item?.candidate_key || '') === key
        )) || (Number.isInteger(index) && index >= 0 ? assignedCandidates[index] : null);

        if (assigned) {
            return {
                ...assigned,
                cell_id: cell.id,
                cell
            };
        }

        const meta = parseRawMeta(cell.raw_meta_json);
        const candidates = getStudentCandidatesFromMeta(meta);
        const candidate = Number.isInteger(index) && index >= 0
            ? candidates[index]
            : candidates.find(item => String(item?.normalized_name || item?.name || item?.student_name_raw || '') === key);
        if (!candidate) return null;
        return {
            ...candidate,
            candidate_index: Number.isInteger(index) ? index : candidates.indexOf(candidate),
            cell_id: cell.id,
            cell
        };
    }

    window.EieState = {
        get() {
            return state;
        },
        setActiveView(view) {
            state.activeView = view || 'dashboard';
        },
        setLatestImport(value) {
            state.latestImport = importFromPayload(value);
        },
        setTimetableCells(rows) {
            state.timetableCells = asArray(rows);
            state.db.timetable_cells = state.timetableCells;
            state.needsReview = state.timetableCells.filter(row => row?.status === 'needs_review');
            if (state.selectedTimetableCellId && !findCell(state.selectedTimetableCellId)) {
                state.selectedTimetableCellId = '';
                state.timetableEditMode = '';
            }
            if (state.selectedStudentCandidate?.cell_id && !findCell(state.selectedStudentCandidate.cell_id)) {
                state.selectedStudentCandidate = null;
                state.studentCandidatePanelMode = '';
            }
        },
        upsertTimetableCell(row) {
            if (!row?.id) return;
            const index = state.timetableCells.findIndex(cell => String(cell?.id) === String(row.id));
            if (index >= 0) state.timetableCells.splice(index, 1, row);
            else state.timetableCells.push(row);
            this.setTimetableCells(state.timetableCells);
            state.selectedTimetableCellId = row.id;
            state.timetableEditMode = 'edit';
        },
        setStudentSeeds(rows) {
            state.studentSeeds = asArray(rows);
            state.studentSeedError = '';
        },
        setContactSeeds(rows) {
            state.contactSeeds = asArray(rows);
            state.studentSeedError = '';
        },
        setNeedsReview(rows) {
            state.needsReview = asArray(rows);
        },
        setWorkbookSheets(rows) {
            state.workbookSheets = asArray(rows);
        },
        setSelectedSheetName(value) {
            state.selectedSheetName = value || '';
        },
        setImportPreview(value) {
            state.importPreview = value || null;
            state.importError = '';
            state.importNotice = '';
            state.importResult = null;
            if (value?.sheet_name) state.selectedSheetName = value.sheet_name;
            if (Array.isArray(value?.sheet_names)) state.workbookSheets = value.sheet_names;
            if (Array.isArray(value?.timetable_cells)) this.setTimetableCells(value.timetable_cells);
        },
        setImportResult(value) {
            state.importResult = value || null;
            const latest = importFromPayload(value);
            if (latest?.id) state.latestImport = latest;
            if (Array.isArray(value?.timetable_cells)) this.setTimetableCells(value.timetable_cells);
            if (Array.isArray(value?.needs_review)) state.needsReview = value.needs_review;
        },
        setImportError(value) {
            state.importError = value ? String(value) : '';
        },
        setImportNotice(value) {
            state.importNotice = value ? String(value) : '';
        },
        setImportBusy(value) {
            state.isImportBusy = !!value;
        },
        setTimetableBusy(value) {
            state.isTimetableBusy = !!value;
        },
        setLastLoadedImportId(value) {
            state.lastLoadedImportId = value || '';
        },
        selectTimetableCell(cellId) {
            state.selectedTimetableCellId = cellId || '';
            state.timetableEditMode = cellId ? 'edit' : '';
            state.selectedStudentCandidate = null;
            state.studentCandidatePanelMode = '';
            state.timetableError = '';
            state.timetableNotice = '';
        },
        startNewTimetableCell() {
            state.selectedTimetableCellId = '';
            state.timetableEditMode = 'new';
            state.selectedStudentCandidate = null;
            state.studentCandidatePanelMode = '';
            state.timetableError = '';
            state.timetableNotice = '';
        },
        closeTimetableEditor() {
            state.selectedTimetableCellId = '';
            state.timetableEditMode = '';
        },
        selectStudentCandidate(cellId, candidateKey) {
            const selected = findStudentCandidate(cellId, candidateKey);
            state.selectedStudentCandidate = selected;
            state.studentCandidatePanelMode = selected ? 'detail' : '';
            state.selectedTimetableCellId = selected?.cell_id || cellId || '';
            state.timetableEditMode = '';
            state.timetableError = '';
            state.timetableNotice = '';
            return selected;
        },
        closeStudentCandidatePanel() {
            state.selectedStudentCandidate = null;
            state.studentCandidatePanelMode = '';
        },
        getSelectedStudentCandidate() {
            return state.selectedStudentCandidate;
        },
        setStudentSeedNotice(value) {
            state.studentSeedNotice = value ? String(value) : '';
            if (value) state.studentSeedError = '';
        },
        setStudentSeedError(value) {
            state.studentSeedError = value ? String(value) : '';
            if (value) state.studentSeedNotice = '';
        },
        setTimetableNotice(value) {
            state.timetableNotice = value ? String(value) : '';
            if (value) state.timetableError = '';
        },
        setTimetableError(value) {
            state.timetableError = value ? String(value) : '';
            if (value) state.timetableNotice = '';
        },
        setTimetableStatusFilter(value) {
            state.timetableStatusFilter = value || 'active,imported,needs_review';
        },
        getSelectedTimetableCell() {
            return findCell(state.selectedTimetableCellId);
        },
        ensureDb() {
            return state.db;
        },
        ensureUi() {
            return state.ui;
        },
        setStudents(rows) {
            state.db.students = asArray(rows);
        },
        setStudentContacts(rows) {
            state.db.student_contacts = asArray(rows);
        },
        setParentContacts(rows) {
            state.db.parent_contacts = asArray(rows);
        },
        setClassStudents(rows) {
            state.db.class_students = asArray(rows);
        },
        setConsultations(rows) {
            state.db.consultations = asArray(rows);
        },
        setAttendance(rows) {
            state.db.attendance = asArray(rows);
            state.db.attendance_records = state.db.attendance;
        },
        setHomework(rows) {
            state.db.homework = asArray(rows);
        },
        upsertStudent(row) {
            if (!row?.id) return;
            const idx = state.db.students.findIndex(s => String(s?.id) === String(row.id));
            if (idx >= 0) state.db.students.splice(idx, 1, row);
            else state.db.students.push(row);
        },
        upsertStudentContact(row) {
            if (!row?.id) return;
            const idx = state.db.student_contacts.findIndex(c => String(c?.id) === String(row.id));
            if (idx >= 0) state.db.student_contacts.splice(idx, 1, row);
            else state.db.student_contacts.push(row);
        },
        removeOrArchiveStudentContact(row) {
            if (!row?.id) return;
            const idx = state.db.student_contacts.findIndex(c => String(c?.id) === String(row.id));
            if (idx >= 0) state.db.student_contacts.splice(idx, 1, row);
        },
        mergeStudentContacts(studentId, contacts) {
            const sid = String(studentId || '');
            const incoming = asArray(contacts);
            const others = state.db.student_contacts.filter(c => String(c?.student_id || '') !== sid);
            state.db.student_contacts = others.concat(incoming);
            state.db.parent_contacts = state.db.student_contacts.filter(c => c?.is_primary || c?.relation === 'parent');
        },
        upsertConsultation(row) {
            if (!row?.id) return;
            const idx = state.db.consultations.findIndex(c => String(c?.id) === String(row.id));
            if (idx >= 0) state.db.consultations.splice(idx, 1, row);
            else state.db.consultations.push(row);
        },
        mergeStudentConsultations(studentId, consultations) {
            const sid = String(studentId || '');
            const incoming = asArray(consultations);
            const others = state.db.consultations.filter(c => String(c?.student_id || '') !== sid);
            state.db.consultations = others.concat(incoming);
        },
        mergeStudentAttendance(studentId, records) {
            const sid = String(studentId || '');
            const incoming = asArray(records);
            const others = state.db.attendance.filter(a => String(a?.student_id || '') !== sid);
            state.db.attendance = others.concat(incoming);
            state.db.attendance_records = state.db.attendance;
        },
        upsertClassStudent(row) {
            if (!row?.id) return;
            const idx = state.db.class_students.findIndex(cs => String(cs?.id) === String(row.id));
            if (idx >= 0) state.db.class_students.splice(idx, 1, row);
            else state.db.class_students.push(row);
        },
        mergeFoundationPayload(payload) {
            if (!payload) return;
            if (Array.isArray(payload.students)) this.setStudents(payload.students);
            if (Array.isArray(payload.student_contacts)) this.setStudentContacts(payload.student_contacts);
            if (Array.isArray(payload.parent_contacts)) this.setParentContacts(payload.parent_contacts);
            if (Array.isArray(payload.class_students)) this.setClassStudents(payload.class_students);
            if (Array.isArray(payload.consultations)) this.setConsultations(payload.consultations);
            if (Array.isArray(payload.timetable_cells)) this.setTimetableCells(payload.timetable_cells);
            state.ui.eieApmsCompat.loadedAt = Date.now();
            state.ui.eieApmsCompat.error = '';
        },
        getStudentById(studentId) {
            if (!studentId) return null;
            return state.db.students.find(s => String(s?.id) === String(studentId)) || null;
        },
        getTimetableCellById(cellId) {
            if (!cellId) return null;
            return state.db.timetable_cells.find(c => String(c?.id) === String(cellId)) || null;
        },

        // ── 출석판 상태/캐시/인덱스 ────────────────────────────────────────
        attendanceIndexKey(date, cellId) {
            return `${String(date || '').slice(0, 10)}|${String(cellId || '')}`;
        },
        setAttendanceMonth(month) {
            state.attendance.month = String(month || '');
        },
        setAttendanceLoadingMonth(month) {
            state.attendance.loadingMonth = String(month || '');
        },
        // 월 전체 기록을 캐시에 저장하고 date|cellId 인덱스를 그 월에 대해 재구성한다.
        setAttendanceMonthData(month, records) {
            const key = String(month || '');
            const rows = asArray(records);
            state.attendance.byMonth[key] = rows;
            // 이 월 범위의 인덱스 항목을 비우고 다시 채운다.
            Object.keys(state.attendance.index).forEach(idxKey => {
                if (idxKey.slice(0, 7) === key) delete state.attendance.index[idxKey];
            });
            rows.forEach(row => {
                const idxKey = this.attendanceIndexKey(row?.date, row?.timetable_cell_id);
                if (!state.attendance.index[idxKey]) state.attendance.index[idxKey] = [];
                state.attendance.index[idxKey].push(row);
            });
            state.attendance.loadingMonth = '';
        },
        getAttendanceMonthData(month) {
            return state.attendance.byMonth[String(month || '')] || null;
        },
        getAttendanceForCellDate(date, cellId) {
            return state.attendance.index[this.attendanceIndexKey(date, cellId)] || [];
        },
        // 셀 저장 결과를 인덱스와 월 캐시에 반영(낙관적 갱신/롤백 공용 경로).
        applyAttendanceCellResult(date, cellId, records) {
            const idxKey = this.attendanceIndexKey(date, cellId);
            const rows = asArray(records);
            state.attendance.index[idxKey] = rows;
            const monthKey = String(date || '').slice(0, 7);
            const monthRows = state.attendance.byMonth[monthKey];
            if (Array.isArray(monthRows)) {
                const others = monthRows.filter(row =>
                    this.attendanceIndexKey(row?.date, row?.timetable_cell_id) !== idxKey);
                state.attendance.byMonth[monthKey] = others.concat(rows);
            }
        },
        setAttendanceViewDate(date) {
            state.attendance.viewDate = String(date || '').slice(0, 10);
        },
        // 학생 1명의 저장/삭제 결과를 인덱스와 월 캐시에 반영(낙관적 갱신/롤백 공용).
        applyAttendanceStudentResult(date, cellId, studentId, record) {
            const idxKey = this.attendanceIndexKey(date, cellId);
            const sid = String(studentId || '');
            const current = asArray(state.attendance.index[idxKey])
                .filter(row => String(row && row.student_id) !== sid);
            if (record) current.push(record);
            state.attendance.index[idxKey] = current;

            const monthKey = String(date || '').slice(0, 7);
            const monthRows = state.attendance.byMonth[monthKey];
            if (Array.isArray(monthRows)) {
                const others = monthRows.filter(row =>
                    !(this.attendanceIndexKey(row && row.date, row && row.timetable_cell_id) === idxKey
                        && String(row && row.student_id) === sid));
                state.attendance.byMonth[monthKey] = record ? others.concat(record) : others;
            }
        },
        // 원장 확인판 셀 드릴다운(학생 목록) 선택. 학생은 아직 미선택.
        setAttendanceCellSelection(date, cellId) {
            state.attendance.selectedDate = String(date || '').slice(0, 10);
            state.attendance.selectedCellId = String(cellId || '');
            state.attendance.selectedStudentId = '';
            state.attendance.error = '';
            state.attendance.notice = '';
        },
        // 학생별 입력판 선택(실제 입력 단위).
        setAttendanceStudentSelection(date, cellId, studentId) {
            state.attendance.selectedDate = String(date || '').slice(0, 10);
            state.attendance.selectedCellId = String(cellId || '');
            state.attendance.selectedStudentId = String(studentId || '');
            state.attendance.error = '';
            state.attendance.notice = '';
        },
        clearAttendanceCellSelection() {
            state.attendance.selectedDate = '';
            state.attendance.selectedCellId = '';
            state.attendance.selectedStudentId = '';
            state.attendance.draftStatus = '';
            state.attendance.draftTags = [];
            state.attendance.error = '';
        },
        // 학생 입력판만 닫고 셀 드릴다운(학생 목록)은 유지한다.
        clearAttendanceStudentSelection() {
            state.attendance.selectedStudentId = '';
            state.attendance.draftStatus = '';
            state.attendance.draftTags = [];
            state.attendance.error = '';
        },
        setAttendanceDraft(status, tags) {
            state.attendance.draftStatus = String(status || '');
            state.attendance.draftTags = asArray(tags).map(t => String(t || '')).filter(Boolean);
        },
        setAttendanceSaving(value) {
            state.attendance.saving = !!value;
        },
        setAttendanceError(value) {
            state.attendance.error = value ? String(value) : '';
        },
        setAttendanceNotice(value) {
            state.attendance.notice = value ? String(value) : '';
        },
        invalidateAttendanceMonth(month) {
            const key = String(month || '');
            delete state.attendance.byMonth[key];
            Object.keys(state.attendance.index).forEach(idxKey => {
                if (idxKey.slice(0, 7) === key) delete state.attendance.index[idxKey];
            });
        },
        resetApmsCompatState() {
            state.db.students = [];
            state.db.student_contacts = [];
            state.db.parent_contacts = [];
            state.db.consultations = [];
            state.db.classes = [];
            state.db.class_students = [];
            state.db.attendance = [];
            state.db.homework = [];
            state.db.class_daily_records = [];
            state.db.class_daily_progress = [];
            state.db.homework_records = [];
            state.db.attendance_records = [];
            state.db.classroom_logs = [];
            state.db.textbooks = [];
            state.db.materials = [];
            state.ui.eieApmsCompat.loadedAt = 0;
            state.ui.eieApmsCompat.loading = false;
            state.ui.eieApmsCompat.error = '';
            state.ui.eieApmsCompat.lastSource = '';
        },
        resetImportPreview() {
            state.workbookSheets = [];
            state.selectedSheetName = '';
            state.importPreview = null;
            state.importResult = null;
            state.importError = '';
            state.importNotice = '';
            state.timetableCells = [];
            state.studentSeeds = [];
            state.contactSeeds = [];
            state.needsReview = [];
            state.isImportBusy = false;
            state.isTimetableBusy = false;
            state.lastLoadedImportId = '';
            state.selectedTimetableCellId = '';
            state.timetableEditMode = '';
            state.timetableNotice = '';
            state.timetableError = '';
            state.selectedStudentCandidate = null;
            state.studentCandidatePanelMode = '';
            state.studentSeedNotice = '';
            state.studentSeedError = '';
        }
    };
})();
