/**
 * AP Math OS v26.1.2 [js/ui.js]
 * 공용 UI 컴포넌트 (Toast, Modal, HTML Utility)
 */

function toast(m, t='info') {
    const c = document.getElementById('toast-container'), el = document.createElement('div');
    el.className = `toast ${t}`;
    el.innerText = m;
    c.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function showModal(t, b, at=null, af=null) {
    document.getElementById('modal-title').innerText = t;
    document.getElementById('modal-body').innerHTML = b;
    const ab = document.getElementById('modal-action-btn');
    const footer = document.getElementById('modal-footer');
    
    if (at && af) {
        ab.innerText = at;
        ab.onclick = af;
        ab.classList.remove('hidden');
        if (footer) footer.classList.remove('hidden');
    } else {
        ab.classList.add('hidden');
        if (footer) footer.classList.add('hidden');
    }
    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

function escapeHtmlForTextarea(text) {
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// [3G] 클리닉 운영 안정화를 위한 공용 보조 함수
function setModalBody(html) {
    const body = document.getElementById('modal-body');
    if (body) body.innerHTML = html;
}

function setModalLoading(title, message) {
    showModal(title, `
        <div style="text-align:center;padding:24px;color:var(--secondary);">
            <div style="font-size:24px;margin-bottom:8px;">⏳</div>
            <div style="font-size:13px;font-weight:800;">${message || '처리 중입니다...'}</div>
        </div>
    `);
}

function setButtonBusy(buttonOrSelector, isBusy, label = '처리 중...') {
    const btn = typeof buttonOrSelector === 'string' ? document.querySelector(buttonOrSelector) : buttonOrSelector;
    if (!btn) return;
    if (isBusy) {
        if (!btn.dataset.originalText) btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = `<span style="opacity:0.7;">⏳ ${label}</span>`;
        btn.disabled = true;
        btn.style.pointerEvents = 'none';
    } else {
        if (btn.dataset.originalText) btn.innerHTML = btn.dataset.originalText;
        btn.disabled = false;
        btn.style.pointerEvents = 'auto';
    }
}

function safeToastError(message) {
    toast(message, 'error');
}