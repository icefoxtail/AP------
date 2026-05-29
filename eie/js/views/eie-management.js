(function () {
    function esc(value) {
        return EieApp.escapeHtml(value);
    }

    function render() {
        return '<section aria-labelledby="eie-management-title">'
            + '<button type="button" class="eie-back-button" data-eie-route="dashboard" aria-label="EIE 홈으로 이동" title="EIE 홈">← EIE 홈</button>'
            + '<div class="eie-panel">'
            + '<h1 id="eie-management-title" class="eie-panel-title">관리</h1>'
            + '<p class="eie-panel-copy">EIE 설정은 추후 연결됩니다.</p>'
            + '<div class="eie-empty-box">관리 기능 준비 중</div>'
            + '</div>'
            + '</section>';
    }

    window.EieManagementView = { render: render };
})();
