/**
 * AP Math OS [js/dashboard-admin.js]
 * ?먯옣??admin) ?꾩슜 ??쒕낫???뚮뜑?? * AP MATH / EIE ?쒖뒪??寃뚯씠???ы븿
 * EIE ?대┃ ??../eie/index.html#dashboard ?대룞
 */

function renderAdminDashboardView() {
    // 湲곗〈 ?먯옣????쒕낫?쒕? 洹몃?濡??뚮뜑留?    if (typeof renderAdminControlCenter === 'function') {
        renderAdminControlCenter();
    }

    // ?먯옣????쒕낫??理쒖긽?⑥뿉 AP MATH / EIE 寃뚯씠???쎌엯
    const adminDash = document.getElementById('ap-admin-dashboard');
    if (!adminDash) return;

    const gate = document.createElement('div');
    gate.id = 'ap-system-gate';
    gate.setAttribute('role', 'navigation');
    gate.setAttribute('aria-label', '?쒖뒪???꾪솚');
    gate.style.cssText = [
        'display:flex',
        'gap:8px',
        'background:var(--surface-2)',
        'padding:4px',
        'border-radius:12px',
        'margin-bottom:18px'
    ].join(';');

    gate.innerHTML = `
        <button class="btn"
                style="flex:1; height:44px; min-height:44px; padding:0 14px; border-radius:10px; font-size:13px; font-weight:500; background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(var(--primary-rgb),0.18); box-shadow:none; cursor:default;"
                aria-current="page"
                onclick="void(0)">
            AP MATH
        </button>
        <button class="btn"
                style="flex:1; height:44px; min-height:44px; padding:0 14px; border-radius:10px; font-size:13px; font-weight:500; background:var(--surface); color:var(--secondary); border:1px solid var(--border); box-shadow:none;"
                onclick="window.location.href='../eie/index.html#dashboard'">
            EIE
        </button>
    `;

    adminDash.insertBefore(gate, adminDash.firstChild);
}

