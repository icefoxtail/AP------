(function () {
    window.EieTimetableMonthsView = {
        async render() {
            if (window.EieRouter?.open) {
                await window.EieRouter.open('timetable');
                return '';
            }
            return window.EieTimetableView?.render ? window.EieTimetableView.render() : '';
        }
    };
})();
