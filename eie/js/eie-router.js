(function () {
    const routes = {
        dashboard: () => EieDashboardView.render(),
        timetable: () => EieTimetableView.render()
    };

    let hashListenerBound = false;

    function normalizeRoute(route) {
        const key = String(route || '').replace(/^#/, '').trim();
        return routes[key] ? key : 'dashboard';
    }

    function syncNav(route) {
        if (typeof document === 'undefined') return;
        document.querySelectorAll('[data-eie-route]').forEach(el => {
            const isActive = el.getAttribute('data-eie-route') === route;
            el.classList.toggle('is-active', isActive);
            if (isActive) el.setAttribute('aria-current', 'page');
            else el.removeAttribute('aria-current');
        });
    }

    async function renderRoute(route) {
        const nextRoute = normalizeRoute(route);
        EieState.setActiveView(nextRoute);
        syncNav(nextRoute);
        await EieApp.mount(await routes[nextRoute]());
    }

    async function open(route) {
        const nextRoute = normalizeRoute(route);
        const nextHash = `#${nextRoute}`;
        if (window.location.hash !== nextHash) {
            window.location.hash = nextRoute;
            return;
        }
        await renderRoute(nextRoute);
    }

    function handleHashChange() {
        renderRoute(window.location.hash || 'dashboard');
    }

    window.EieRouter = {
        open,
        boot() {
            if (!hashListenerBound) {
                window.addEventListener('hashchange', handleHashChange);
                hashListenerBound = true;
            }
            return renderRoute(window.location.hash || 'dashboard');
        }
    };
})();
