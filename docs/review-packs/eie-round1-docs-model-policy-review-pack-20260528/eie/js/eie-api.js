(function () {
    const API_BASE = 'https://ap-math-os-v2612.js-pdf.workers.dev/api/eie';

    function stubResponse(kind) {
        if (kind === 'latest') {
            return { success: true, stub: true, data: null, latest_import: null };
        }
        if (kind === 'timetable') {
            return { success: true, stub: true, data: [], timetable_cells: [] };
        }
        return { success: true, stub: true, data: [], student_seeds: [] };
    }

    async function get(path, kind) {
        try {
            const response = await fetch(`${API_BASE}/${path}`, { headers: { 'Content-Type': 'application/json' } });
            if (!response.ok) return stubResponse(kind);
            const data = await response.json();
            return data?.success === false ? stubResponse(kind) : data;
        } catch (e) {
            return stubResponse(kind);
        }
    }

    window.EieApi = {
        getLatestImport() {
            return get('import/latest', 'latest');
        },
        getTimetable() {
            return get('timetable', 'timetable');
        },
        getStudentSeeds() {
            return get('student-seeds', 'student-seeds');
        }
    };
})();
