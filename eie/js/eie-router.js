(function () {
    const routes = {
        dashboard: () => EieDashboardView.render(),
        timetable: () => EieTimetableView.render(),
        'timetable-editor': () => EieTimetableEditorView.render(),
        students: () => EieStudentsView.render(),
        classroom: () => EieClassroomView.render(),
        attendance: () => EieAttendanceView.render(),
        grades: () => EieGradeLedgerView.render(),
        teacher: () => EieTeacherView.render(),
        management: () => EieManagementView.render()
    };

    let hashListenerBound = false;
    let routeButtonsBound = false;

    function defaultRouteForSession() {
        const storage = window.localStorage || {};
        const role = String(storage.getItem && storage.getItem('WANGJI_EIE_ROLE') || '').toLowerCase();
        const loginId = String(storage.getItem && storage.getItem('WANGJI_EIE_LOGIN_ID') || '').toLowerCase();
        if ((role === 'teacher' || role === 'eieteacher') && loginId !== 'admin') return 'teacher';
        return 'dashboard';
    }

    function normalizeRoute(route) {
        const key = String(route || '').replace(/^#/, '').trim();
        if (key === 'timetable-v2') return 'timetable';
        return routes[key] ? key : defaultRouteForSession();
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

    function syncOwnerBackground(route) {
        if (typeof document === 'undefined') return;
        const nextRoute = normalizeRoute(route);
        document.body.classList.toggle('eie-owner-dashboard-bg', nextRoute === 'dashboard');
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

    let renderToken = 0;
    let lastMountedRoute = '';

    async function renderRoute(route) {
        const nextRoute = normalizeRoute(route);
        const token = ++renderToken;
        EieState.setActiveView(nextRoute);
        syncNav(nextRoute);
        syncOwnerBackground(nextRoute);
        // 즉시 골격을 그려 "멈춤" 체감을 없앤다(데이터는 뒤에서 채움).
        if (lastMountedRoute !== nextRoute && window.EieApp && typeof window.EieApp.mountSkeleton === 'function') {
            window.EieApp.mountSkeleton(nextRoute);
        }
        try {
            const html = await routes[nextRoute]();
            // 더 최신 네비게이션이 있으면 이 결과는 버린다(stale 덮어쓰기 방지).
            if (token !== renderToken) return;
            await EieApp.mount(html);
            lastMountedRoute = nextRoute;
        } catch (e) {
            if (token !== renderToken) return;
            if (e && e.status === 401 && window.EieApp && typeof window.EieApp.handleEie401 === 'function') {
                window.EieApp.handleEie401();
                return;
            }
            throw e;
        }
    }

    let eieBackStack = [];

    function updateEieBackButtons() {
        const canGoBack = eieBackStack.length > 0;
        ['eie-mobile-back-button', 'eie-desktop-back-button'].forEach(id => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.disabled = !canGoBack;
        });
    }

    function eieHistoryBack() {
        if (eieBackStack.length === 0) return;
        const prev = eieBackStack.pop();
        const prevHash = `#${prev}`;
        // 스택 조작이므로 hashchange 이벤트로 다시 push되지 않도록 플래그 사용
        window.__eieGoingBack = true;
        window.location.hash = prevHash;
        updateEieBackButtons();
    }

    async function open(route) {
        const nextRoute = normalizeRoute(route);
        const nextHash = `#${nextRoute}`;
        if (window.location.hash !== nextHash) {
            // 현재 라우트를 스택에 쌓기
            if (!window.__eieGoingBack) {
                const currentRoute = normalizeRoute(window.location.hash);
                if (currentRoute !== nextRoute) {
                    eieBackStack.push(currentRoute);
                    if (eieBackStack.length > 30) eieBackStack.shift();
                }
            }
            window.__eieGoingBack = false;
            updateEieBackButtons();
            window.location.hash = nextHash;
            return;
        }
        window.__eieGoingBack = false;
        await renderRoute(nextRoute);
    }

    function handleHashChange() {
        if (!window.__eieGoingBack) {
            // 브라우저 직접 해시 변경 시 스택 초기화하지 않음
        }
        window.__eieGoingBack = false;
        updateEieBackButtons();
        renderRoute(window.location.hash || 'dashboard');
    }

    window.eieHistoryBack = eieHistoryBack;

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
