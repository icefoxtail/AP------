(function () {
    const state = {
        activeView: 'dashboard',
        latestImport: null,
        timetableCells: [],
        studentSeeds: []
    };

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
            state.timetableCells = Array.isArray(rows) ? rows : [];
        },
        setStudentSeeds(rows) {
            state.studentSeeds = Array.isArray(rows) ? rows : [];
        }
    };
})();
