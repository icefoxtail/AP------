(function () {
    window.EieStudentSeedsView = {
        async render() {
            const result = await EieApi.getStudentSeeds();
            const rows = Array.isArray(result?.student_seeds) ? result.student_seeds : [];
            EieState.setStudentSeeds(rows);
            return EieApp.renderPanel({
                title: '학생 seed',
                copy: '시간표에서 추출한 학생 후보 정보가 여기에 표시됩니다.',
                note: `API stub: student_seeds ${rows.length}건`
            });
        }
    };
})();
