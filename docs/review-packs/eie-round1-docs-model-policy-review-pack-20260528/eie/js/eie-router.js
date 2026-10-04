(function () {
    const routes = {
        dashboard: () => EieDashboardView.render(),
        timetable: () => EieTimetableView.render(),
        import: () => EieImportView.render(),
        'student-seeds': () => EieStudentSeedsView.render()
    };

    async function open(route) {
        const nextRoute = routes[route] ? route : 'dashboard';
        EieState.setActiveView(nextRoute);
        window.location.hash = nextRoute === 'dashboard' ? '' : nextRoute;
        await EieApp.mount(await routes[nextRoute]());
    }

    window.EieRouter = {
        open,
        boot() {
            const route = window.location.hash.replace(/^#/, '') || 'dashboard';
            return open(route);
        }
    };
})();
