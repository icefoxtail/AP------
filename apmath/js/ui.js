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
    if (at && af) {
        ab.innerText = at;
        ab.onclick = af;
        ab.classList.remove('hidden');
    } else {
        ab.classList.add('hidden');
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