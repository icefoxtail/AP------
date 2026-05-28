(function () {
    function normalizeText(value) {
        return String(value || '').trim().replace(/\s+/g, ' ');
    }

    function normalizePhone(value) {
        return String(value || '').replace(/[^\d]/g, '');
    }

    function normalizeName(value) {
        return normalizeText(value)
            .replace(/[\(\)\[\]{}]/g, ' ')
            .replace(/\s+/g, '')
            .trim();
    }

    function looksLikePhone(value) {
        const digits = normalizePhone(value);
        if (digits.length < 8 || digits.length > 12) return false;
        return /^(01\d|0\d{1,2}|1\d{3})/.test(digits) || digits.length >= 10;
    }

    function extractPhoneCandidates(value) {
        const raw = String(value || '');
        const matches = raw.match(/(?:\+?82[-.\s]?)?0?1\d[-.\s]?\d{3,4}[-.\s]?\d{4}|0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}|\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{4}/g) || [];
        const seen = new Set();
        return matches.map(item => ({
            phone_raw: normalizeText(item),
            normalized_phone: normalizePhone(item)
        })).filter(item => {
            if (!looksLikePhone(item.normalized_phone) || seen.has(item.normalized_phone)) return false;
            seen.add(item.normalized_phone);
            return true;
        });
    }

    function stripPhoneFromText(value) {
        return normalizeText(String(value || '').replace(/(?:\+?82[-.\s]?)?0?1\d[-.\s]?\d{3,4}[-.\s]?\d{4}|0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}|\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{4}/g, ' '));
    }

    window.EieNormalize = {
        normalizeText,
        normalizePhone,
        normalizeName,
        looksLikePhone,
        extractPhoneCandidates,
        stripPhoneFromText
    };
})();
