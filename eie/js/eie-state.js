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
        studentSeedError: ''
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
