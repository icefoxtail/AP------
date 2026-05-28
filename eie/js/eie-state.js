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
        isImportBusy: false
    };

    function asArray(rows) {
        return Array.isArray(rows) ? rows : [];
    }

    window.EieState = {
        get() {
            return state;
        },
        setActiveView(view) {
            state.activeView = view || 'dashboard';
        },
        setLatestImport(value) {
            state.latestImport = value || null;
        },
        setTimetableCells(rows) {
            state.timetableCells = asArray(rows);
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
            if (value?.sheet_name) state.selectedSheetName = value.sheet_name;
            if (Array.isArray(value?.sheet_names)) state.workbookSheets = value.sheet_names;
            if (Array.isArray(value?.timetable_cells)) state.timetableCells = value.timetable_cells;
        },
        setImportResult(value) {
            state.importResult = value || null;
            if (value?.latest_import || value?.data) state.latestImport = value.latest_import || value.data;
        },
        setImportError(value) {
            state.importError = value ? String(value) : '';
        },
        setImportBusy(value) {
            state.isImportBusy = !!value;
        },
        resetImportPreview() {
            state.workbookSheets = [];
            state.selectedSheetName = '';
            state.importPreview = null;
            state.importResult = null;
            state.importError = '';
            state.timetableCells = [];
            state.studentSeeds = [];
            state.contactSeeds = [];
            state.needsReview = [];
            state.isImportBusy = false;
        }
    };
})();
