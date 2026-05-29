(function () {
    const routes = {
        dashboard: () => EieDashboardView.render(),
        timetable: () => EieTimetableView.render(),
        students: () => EieStudentsView.render(),
        classroom: () => EieClassroomView.render(),
        management: () => EieManagementView.render()
    };

    let hashListenerBound = false;
    let routeButtonsBound = false;

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


    function openFromElement(route) {
        const nextRoute = normalizeRoute(route);
        if (window.EieRouter && typeof window.EieRouter.open === 'function') {
            window.EieRouter.open(nextRoute);
            return;
        }
        window.location.hash = `#${nextRoute}`;
    }

    function bindRouteButtons() {
        if (routeButtonsBound || typeof document === 'undefined') return;
        document.addEventListener('click', event => {
            const target = event.target && event.target.closest ? event.target.closest('[data-eie-route]') : null;
            if (!target) return;
            const route = target.getAttribute('data-eie-route');
            if (!route) return;
            event.preventDefault();
            openFromElement(route);
        });
        routeButtonsBound = true;
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
            window.location.hash = nextHash;
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
            bindRouteButtons();
            if (!hashListenerBound) {
                window.addEventListener('hashchange', handleHashChange);
                hashListenerBound = true;
            }
            return renderRoute(window.location.hash || 'dashboard');
        },
        syncNav,
        bindRouteButtons
    };

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindRouteButtons, { once: true });
        } else {
            bindRouteButtons();
        }
    }
})();
