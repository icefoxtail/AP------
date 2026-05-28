(function () {
    function normalizeText(value) {
        return String(value || '').trim().replace(/\s+/g, ' ');
    }

    function normalizePhone(value) {
        return String(value || '').replace(/[^\d]/g, '');
    }

    window.EieNormalize = {
        normalizeText,
        normalizePhone
    };
})();
