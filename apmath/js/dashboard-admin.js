/**
 * AP Math OS [js/dashboard-admin.js]
 * 원장님(admin) 전용 대시보드 렌더러
 * renderAdminControlCenter() 렌더 완료 후 AP MATH / EIE 게이트를 안전하게 삽입한다.
 */

function apAdminDashboardRole() {
    return String((typeof state !== 'undefined' && state?.auth?.role) || '').toLowerCase();
}

function apRemoveAdminSystemGate() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('#ap-system-gate, .ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]').forEach(el => el.remove());
}

function apCreateAdminSystemGate() {
    const gate = document.createElement('div');
    gate.id = 'ap-system-gate';
    gate.className = 'ap-admin-app-gate';
    gate.setAttribute('data-ap-system-gate', 'true');
    gate.setAttribute('role', 'navigation');
    gate.setAttribute('aria-label', '시스템 전환');
    gate.style.cssText = [
        'display:grid',
        'grid-template-columns:repeat(2,minmax(0,1fr))',
        'gap:8px',
        'background:linear-gradient(180deg, var(--surface) 0%, var(--surface-2) 100%)',
        'padding:4px',
        'border:1px solid rgba(var(--primary-rgb),0.14)',
        'border-radius:16px',
        'margin-bottom:14px',
        'box-sizing:border-box',
        'box-shadow:0 10px 24px rgba(15,23,42,0.055)'
    ].join(';');

    gate.innerHTML = `
        <button class="btn"
                type="button"
                style="height:44px; min-height:44px; max-height:44px; padding:0 10px; border-radius:12px; font-size:13px; font-weight:500; background:linear-gradient(180deg, var(--surface) 0%, rgba(var(--primary-rgb),0.035) 100%); color:var(--text); border:1px solid rgba(var(--primary-rgb),0.13); box-shadow:0 6px 16px rgba(var(--primary-rgb),0.08); cursor:default;"
                aria-current="page"
                onclick="void(0)">
            AP MATH
        </button>
        <button class="btn"
                type="button"
                style="height:44px; min-height:44px; max-height:44px; padding:0 10px; border-radius:12px; font-size:13px; font-weight:500; background:linear-gradient(180deg, var(--surface) 0%, rgba(var(--primary-rgb),0.035) 100%); color:var(--text); border:1px solid rgba(var(--primary-rgb),0.13); box-shadow:0 6px 16px rgba(var(--primary-rgb),0.08);"
                onclick="window.location.href='../eie/index.html#dashboard'">
            EIE
        </button>
    `;

    return gate;
}

function apInsertAdminSystemGate(attempt = 0) {
    if (typeof document === 'undefined') return false;

    if (apAdminDashboardRole() !== 'admin') {
        apRemoveAdminSystemGate();
        return false;
    }

    const adminDash = document.getElementById('ap-admin-dashboard');
    if (!adminDash) {
        if (attempt === 0 && typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => apInsertAdminSystemGate(1));
            return false;
        }
        if (attempt <= 1 && typeof setTimeout === 'function') {
            setTimeout(() => apInsertAdminSystemGate(2), 0);
            return false;
        }
        console.warn('[APMS dashboard-admin] #ap-admin-dashboard를 찾지 못해 AP/EIE 게이트를 삽입하지 못했습니다.');
        return false;
    }

    const existingGate = adminDash.querySelector('#ap-system-gate, .ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]');
    if (existingGate) return true;

    apRemoveAdminSystemGate();
    adminDash.insertBefore(apCreateAdminSystemGate(), adminDash.firstChild);
    return true;
}

function renderAdminDashboardView() {
    if (typeof document !== 'undefined') {
        document.body.classList.remove('ap-teacher-dashboard-mode');
        apRemoveAdminSystemGate();
    }

    if (typeof renderAdminControlCenter === 'function') {
        renderAdminControlCenter();
    }

    apInsertAdminSystemGate(0);
}
