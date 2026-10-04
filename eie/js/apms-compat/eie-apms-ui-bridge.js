(function () {
    // APMS 복사 코드가 기대하는 최소 전역 함수들을 EIE에서 안전하게 제공한다.
    // 목표: APMS 복사 코드가 즉시 ReferenceError로 죽지 않게 방어한다.
    // 대규모 UI 재구현은 Round 2+ 에서 진행한다.

    function escapeHtml(value) {
        if (window.EieApp && typeof EieApp.escapeHtml === 'function') {
            return EieApp.escapeHtml(value);
        }
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function showFallbackToast(message, type) {
        if (typeof document === 'undefined') return;
        var container = document.getElementById('eie-compat-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'eie-compat-toast-container';
            container.style.cssText = [
                'position:fixed', 'bottom:24px', 'left:50%', 'transform:translateX(-50%)',
                'z-index:9999', 'display:flex', 'flex-direction:column', 'gap:8px', 'pointer-events:none'
            ].join(';');
            document.body.appendChild(container);
        }
        var colorMap = { error: '#c53030', warn: '#c05621', success: '#276749' };
        var bg = colorMap[type] || '#2b6cb0';
        var el = document.createElement('div');
        el.style.cssText = 'background:' + bg + ';color:#fff;padding:8px 18px;border-radius:6px;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.25);max-width:320px;word-break:break-word;';
        el.textContent = String(message || '');
        container.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3200);
    }

    function toast(message, type) {
        if (window.EieApp && typeof EieApp.toast === 'function') {
            EieApp.toast(message, type);
            return;
        }
        console.log('[toast/' + (type || 'info') + ']', message);
        showFallbackToast(message, type);
    }

    function closeCompatModal() {
        var overlay = document.getElementById('eie-compat-modal-overlay');
        if (overlay) overlay.style.display = 'none';
        var apmsOverlay = document.getElementById('modal-overlay');
        if (apmsOverlay) apmsOverlay.style.display = 'none';
    }

    function openModal(title, bodyHtml, options) {
        if (typeof document === 'undefined') return;
        var overlay = document.getElementById('eie-compat-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'eie-compat-modal-overlay';
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:8000;display:flex;align-items:center;justify-content:center;';
            overlay.addEventListener('click', function (e) {
                if (e.target === overlay) closeCompatModal();
            });
            document.body.appendChild(overlay);
        }
        var safeTitle = escapeHtml(title || '');
        overlay.innerHTML = '<div style="background:#fff;border-radius:10px;padding:24px;max-width:480px;width:90%;max-height:80vh;overflow-y:auto;position:relative;">'
            + '<div style="font-weight:700;font-size:16px;margin-bottom:16px;">' + safeTitle + '</div>'
            + '<div>' + (bodyHtml || '') + '</div>'
            + '<button onclick="window.closeModal&&window.closeModal()" style="margin-top:16px;padding:6px 14px;border:1px solid #ccc;border-radius:4px;background:#f5f5f5;cursor:pointer;">닫기</button>'
            + '</div>';
        overlay.style.display = 'flex';
    }

    function renderDashboard() {
        if (window.EieRouter && typeof EieRouter.open === 'function') {
            EieRouter.open('dashboard');
        }
    }

    function apmsInvalidateDataIndexes() {
        // Round 1: no-op — 인덱스 무효화가 필요한 APMS 복사 코드가 호출해도 앱이 죽지 않게 방어
    }

    function returnToPreviousManagementView() {
        if (window.EieRouter && typeof EieRouter.open === 'function') {
            EieRouter.open('students');
        }
    }

    if (!window.apEscapeHtml) window.apEscapeHtml = escapeHtml;
    if (!window.toast) window.toast = toast;
    if (!window.showToast) window.showToast = toast;
    if (!window.closeModal) window.closeModal = closeCompatModal;
    if (!window.renderDashboard) window.renderDashboard = renderDashboard;
    if (!window.apmsInvalidateDataIndexes) window.apmsInvalidateDataIndexes = apmsInvalidateDataIndexes;
    if (!window.returnToPreviousManagementView) window.returnToPreviousManagementView = returnToPreviousManagementView;
    if (!window.openModal) window.openModal = openModal;

    window.EieApmsUiBridge = {
        escapeHtml: escapeHtml,
        toast: toast,
        closeModal: closeCompatModal,
        renderDashboard: renderDashboard,
        apmsInvalidateDataIndexes: apmsInvalidateDataIndexes,
        returnToPreviousManagementView: returnToPreviousManagementView,
        openModal: openModal
    };
})();
