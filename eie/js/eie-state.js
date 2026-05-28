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
        lastLoadedImportId: ''
    };

    function asArray(rows) {
        return Array.isArray(rows) ? rows : [];
    }

    function importFromPayload(value) {
        if (!value) return null;
        return value.import_session || value.latest_import || value.data || value;
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
        },
        setStudentSeeds(rows) {
            state.studentSeeds = asArray(rows);
        },
        setContactSeeds(rows) {
            state.contactSeeds = asArray(rows);
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
        }
    };
})();
