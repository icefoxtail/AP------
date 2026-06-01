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
    gate.className = 'owner-brand-tabs ap-admin-app-gate ap-surface-toolbar ap-surface-toolbar--two';
    gate.setAttribute('data-ap-system-gate', 'true');
    gate.setAttribute('role', 'navigation');
    gate.setAttribute('aria-label', '시스템 전환');
    gate.innerHTML = `
        <button class="owner-brand-tab owner-brand-tab--current btn ap-surface-action ap-surface-action--current"
                type="button"
                aria-current="page"
                onclick="void(0)">
            AP MATH
        </button>
        <a class="owner-brand-tab btn ap-surface-action"
           href="../eie/index.html#dashboard"
           aria-label="EIE 대시보드로 이동">
            EIE
        </a>
    `;

    return gate;
}

function apInsertAdminSystemGate(attempt = 0) {
    if (typeof document === 'undefined') return false;

    if (apAdminDashboardRole() !== 'admin') {
        document.body.classList.remove('ap-owner-dashboard-bg');
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
        document.body.classList.add('ap-owner-dashboard-bg');
        apRemoveAdminSystemGate();
    }

    if (typeof renderAdminControlCenter === 'function') {
        renderAdminControlCenter();
    }

    apInsertAdminSystemGate(0);
}

function apRemovePublicInquiryFloating() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('#apPublicInquiryFloatingStyle, #apPublicInquiryFloat').forEach(el => el.remove());
}

function apEnsurePublicInquiryFloatingStyle() {
    if (typeof document === 'undefined' || document.getElementById('apPublicInquiryFloatingStyle')) return;
    const style = document.createElement('style');
    style.id = 'apPublicInquiryFloatingStyle';
    style.textContent = `
        #apPublicInquiryFloat {
            position: fixed;
            right: 18px;
            bottom: 22px;
            z-index: 1200;
            width: 54px;
            height: 54px;
            border: 1px solid rgba(183, 20, 27, .24);
            border-radius: 999px;
            background: #b7141b;
            color: #fff;
            box-shadow: 0 16px 36px rgba(15, 23, 42, .24);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            animation: apPublicInquiryPulse 2.1s ease-in-out infinite;
        }
        #apPublicInquiryFloat:hover { transform: translateY(-1px); }
        #apPublicInquiryFloat .ap-inquiry-float-icon {
            font-size: 22px;
            line-height: 1;
        }
        #apPublicInquiryFloat .ap-inquiry-float-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            min-width: 21px;
            height: 21px;
            padding: 0 6px;
            border-radius: 999px;
            background: #fff;
            color: #b7141b;
            border: 1px solid rgba(183, 20, 27, .24);
            font-size: 11px;
            font-weight: 900;
            line-height: 19px;
            text-align: center;
            box-shadow: 0 6px 14px rgba(15, 23, 42, .16);
        }
        @keyframes apPublicInquiryPulse {
            0%, 100% { box-shadow: 0 14px 32px rgba(15, 23, 42, .22), 0 0 0 0 rgba(183, 20, 27, .28); }
            50% { box-shadow: 0 14px 32px rgba(15, 23, 42, .18), 0 0 0 9px rgba(183, 20, 27, 0); }
        }
        @media (max-width: 768px) {
            #apPublicInquiryFloat { right: 14px; bottom: 18px; width: 50px; height: 50px; }
            #apPublicInquiryFloat .ap-inquiry-float-icon { font-size: 20px; }
        }
    `;
    document.head.appendChild(style);
}

function apRenderPublicInquiryFloating(count) {
    if (typeof document === 'undefined') return;
    const safeCount = Number(count || 0);
    if (apAdminDashboardRole() !== 'admin' || safeCount <= 0) {
        apRemovePublicInquiryFloating();
        return;
    }
    apEnsurePublicInquiryFloatingStyle();
    let btn = document.getElementById('apPublicInquiryFloat');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'apPublicInquiryFloat';
        btn.type = 'button';
        btn.addEventListener('click', function() {
            if (typeof openPublicInquiryList === 'function') openPublicInquiryList('new');
            else if (typeof toast === 'function') toast('상담 신청 목록을 불러오지 못했습니다.', 'warn');
        });
        document.body.appendChild(btn);
    }
    const labelCount = safeCount > 99 ? '99+' : String(safeCount);
    btn.setAttribute('aria-label', `신규 상담 ${labelCount}건`);
    btn.title = `신규 상담 ${labelCount}건`;
    btn.innerHTML = `<span class="ap-inquiry-float-icon" aria-hidden="true">💬</span><span class="ap-inquiry-float-badge">${labelCount}</span>`;
}

async function apRefreshPublicInquiryFloating(attempt = 0) {
    if (apAdminDashboardRole() !== 'admin') {
        apRemovePublicInquiryFloating();
        return 0;
    }
    if (typeof api === 'undefined' || !api || typeof api.get !== 'function') {
        if (attempt < 2 && typeof setTimeout === 'function') setTimeout(() => apRefreshPublicInquiryFloating(attempt + 1), 350);
        return 0;
    }
    try {
        const res = await api.get('public-inquiries?status=new&limit=100');
        const rows = Array.isArray(res?.inquiries) ? res.inquiries : [];
        apRenderPublicInquiryFloating(rows.length);
        return rows.length;
    } catch (err) {
        apRemovePublicInquiryFloating();
        if (window.console && console.warn) console.warn('[APMS admin] public inquiry floating load failed', err);
        return 0;
    }
}


function apInquiryStatusLabel(status) {
    const map = { new: '신규', checked: '확인', done: '완료' };
    return map[String(status || 'new')] || '신규';
}

function apInquiryStatusStyle(status) {
    const s = String(status || 'new');
    if (s === 'done') return 'background:rgba(20,184,166,.12); color:#0f766e; border-color:rgba(20,184,166,.24);';
    if (s === 'checked') return 'background:rgba(37,99,235,.10); color:#1d4ed8; border-color:rgba(37,99,235,.20);';
    return 'background:rgba(183,20,27,.10); color:#b7141b; border-color:rgba(183,20,27,.20);';
}

function apRenderPublicInquiryRows(rows) {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) {
        return `<div style="padding:28px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">아직 접수된 상담 신청이 없습니다.</div>`;
    }
    return list.map(row => {
        const id = apEscapeHtml(row.id || '');
        const status = String(row.status || 'new');
        const date = apEscapeHtml(String(row.created_at || '').slice(0, 16));
        const interest = apEscapeHtml(row.interest || '미정');
        const grade = apEscapeHtml(row.student_grade || '학년 미입력');
        const name = apEscapeHtml(row.parent_name || '이름 없음');
        const phone = apEscapeHtml(row.phone || '연락처 없음');
        const message = apEscapeHtml(row.message || '문의 내용 없음');
        const memo = apEscapeHtml(row.memo || '');
        return `
            <article style="border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:14px; display:grid; gap:10px;">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
                    <div style="min-width:0;">
                        <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-bottom:6px;">
                            <span style="font-size:11px; font-weight:700; border:1px solid; border-radius:999px; padding:3px 8px; ${apInquiryStatusStyle(status)}">${apInquiryStatusLabel(status)}</span>
                            <span style="font-size:12px; color:var(--secondary); font-weight:500;">${date}</span>
                        </div>
                        <div style="font-size:15px; font-weight:800; color:var(--text);">${name} · ${phone}</div>
                        <div style="font-size:12px; color:var(--secondary); margin-top:3px;">${interest} · ${grade}</div>
                    </div>
                    <a class="btn" href="tel:${phone.replace(/[^0-9+]/g, '')}" style="padding:8px 10px; font-size:12px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border);">전화</a>
                </div>
                <div style="font-size:13px; line-height:1.55; color:var(--text); background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:10px; white-space:pre-wrap;">${message}</div>
                <textarea id="publicInquiryMemo-${id}" style="width:100%; min-height:64px; border:1px solid var(--border); border-radius:12px; padding:10px; font:inherit; font-size:13px; resize:vertical;" placeholder="처리 메모">${memo}</textarea>
                <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:8px;">
                    <button class="btn" style="padding:9px 8px; font-size:12px; border-radius:10px;" onclick="apUpdatePublicInquiry('${id}', 'new')">신규</button>
                    <button class="btn" style="padding:9px 8px; font-size:12px; border-radius:10px;" onclick="apUpdatePublicInquiry('${id}', 'checked')">확인</button>
                    <button class="btn" style="padding:9px 8px; font-size:12px; border-radius:10px; background:var(--text); color:white;" onclick="apUpdatePublicInquiry('${id}', 'done')">완료</button>
                </div>
            </article>
        `;
    }).join('');
}

async function openPublicInquiryList(statusFilter) {
    if (typeof showModal !== 'function') {
        if (typeof toast === 'function') toast('상담 신청 목록을 열 수 없습니다.', 'warn');
        return;
    }
    const filter = String(statusFilter || '').trim();
    window.__apPublicInquiryListFilter = filter;
    showModal(filter === 'new' ? '신규 상담 신청' : '상담 신청', `<div id="publicInquiryList" style="display:grid; gap:10px; min-height:120px;"><div style="padding:24px; text-align:center; color:var(--secondary);">상담 신청을 불러오는 중입니다.</div></div>`);
    try {
        const query = filter ? `public-inquiries?status=${encodeURIComponent(filter)}&limit=100` : 'public-inquiries?limit=100';
        const res = await api.get(query);
        const box = document.getElementById('publicInquiryList');
        if (!box) return;
        if (!res || res.error || res.success === false) {
            box.innerHTML = `<div style="padding:28px; text-align:center; color:var(--error); font-size:13px;">상담 신청 목록을 불러오지 못했습니다.</div>`;
            return;
        }
        box.innerHTML = apRenderPublicInquiryRows(res.inquiries || []);
    } catch (err) {
        const box = document.getElementById('publicInquiryList');
        if (box) box.innerHTML = `<div style="padding:28px; text-align:center; color:var(--error); font-size:13px;">상담 신청 목록을 불러오지 못했습니다.</div>`;
        if (window.console && console.warn) console.warn('[APMS admin] public inquiries load failed', err);
    }
}

async function apUpdatePublicInquiry(id, status) {
    const memoEl = document.getElementById(`publicInquiryMemo-${id}`);
    const memo = memoEl ? memoEl.value : '';
    try {
        const res = await api.patch(`public-inquiries/${encodeURIComponent(id)}`, { status, memo });
        if (!res || res.error || res.success === false) {
            if (typeof toast === 'function') toast(res?.message || res?.error || '상담 상태 저장 실패', 'error');
            return;
        }
        if (typeof toast === 'function') toast('상담 상태를 저장했습니다.', 'success');
        await openPublicInquiryList(window.__apPublicInquiryListFilter || '');
        await apRefreshPublicInquiryFloating();
    } catch (err) {
        if (typeof toast === 'function') toast('상담 상태 저장 중 오류가 발생했습니다.', 'error');
        if (window.console && console.warn) console.warn('[APMS admin] public inquiry update failed', err);
    }
}
