(function () {
    window.EieTimetableView = {
        async render() {
            const result = await EieApi.getTimetable();
            const rows = Array.isArray(result?.timetable_cells) ? result.timetable_cells : [];
            EieState.setTimetableCells(rows);
            return EieApp.renderPanel({
                title: '영어 시간표',
                copy: '최신 영어 시간표를 가져오면 여기에 표시합니다.',
                note: `API stub: timetable_cells ${rows.length}건`
            });
        }
    };
})();
