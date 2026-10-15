(function attachSvgAccessibility(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APSvgAccessibility = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function buildSvgAccessibility(root) {
    'use strict';

    const MATH_WORDS = new Set([
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'sin', 'cos', 'tan', 'cot', 'sec', 'csc', 'log', 'ln', 'lim', 'max', 'min', 'sqrt', 'pi', 'theta', 'alpha', 'beta', 'gamma', 'delta', 'omega'
    ]);

    function text(value) {
        return value === undefined || value === null ? '' : String(value);
    }

    function normalizeAssetRef(assetRef, baseUrl) {
        const raw = text(assetRef).trim();
        if (!raw || /^(?:data:|blob:|javascript:)/i.test(raw)) return '';
        try {
            const fallbackBase = typeof location !== 'undefined' && location.href
                ? location.href
                : 'https://svg-accessibility.invalid/archive/';
            const base = new URL(baseUrl || fallbackBase, fallbackBase);
            const parsed = new URL(raw.replace(/\\/g, '/'), base);
            const sameHttpOrigin = /^https?:$/.test(base.protocol) && parsed.protocol === base.protocol && parsed.origin === base.origin;
            const sameFileOrigin = base.protocol === 'file:' && parsed.protocol === 'file:';
            if (!sameHttpOrigin && !sameFileOrigin) return '';
            let pathname = decodeURIComponent(parsed.pathname);
            if (sameFileOrigin) {
                const archiveMarker = pathname.toLowerCase().lastIndexOf('/archive/');
                if (archiveMarker < 0) return '';
                pathname = pathname.slice(archiveMarker + '/archive/'.length);
            } else {
                const withLeadingSlash = `/${pathname.replace(/^\/+/, '')}`;
                const archiveMarker = withLeadingSlash.toLowerCase().lastIndexOf('/archive/');
                pathname = archiveMarker >= 0
                    ? withLeadingSlash.slice(archiveMarker + '/archive/'.length)
                    : withLeadingSlash.replace(/^\//, '');
            }
            pathname = pathname.replace(/^archive\//, '').replace(/^\.\//, '');
            return pathname.startsWith('assets/') ? pathname : '';
        } catch (_) {
            return '';
        }
    }

    function isGenericOrEnglishAlt(value) {
        const alt = text(value).trim();
        if (!alt) return true;
        const normalized = alt.toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim();
        if (/^(?:문항\s*\d+\s*)?(?:문제|해설)?\s*(?:그림|그래프|도형|이미지)$/.test(normalized)) return true;
        if (/핵심\s*관계를\s*표시한\s*(?:해설\s*)?(?:도형|그림|그래프)$/.test(normalized)) return true;
        const words = alt.match(/[A-Za-z]+/g) || [];
        if (words.some(word => !/^[A-Z]{2,4}$/.test(word) && !MATH_WORDS.has(word.toLowerCase()))) return true;
        return !/[가-힣]/.test(alt) && words.length > 0 && words.some(word => !MATH_WORDS.has(word.toLowerCase()));
    }

    function curatedText(record) {
        const title = text(record && record.titleKo).trim();
        const description = text(record && record.descriptionKo).trim();
        if (!title || !description) return '';
        return title === description ? title : `${title}. ${description}`;
    }

    function combineAccessibleText(record, existingAlt) {
        const curated = curatedText(record);
        if (!curated || isGenericOrEnglishAlt(existingAlt)) return curated;
        const existing = text(existingAlt).trim();
        const normalize = value => value.toLocaleLowerCase('ko-KR').replace(/\s+/g, ' ').trim();
        const oldText = normalize(existing);
        const fullText = normalize(curated);
        if (fullText.includes(oldText)) return curated;
        if (oldText.includes(fullText)) return existing;
        const separator = /[.!?。！？…]$/.test(existing) ? ' ' : '. ';
        return `${existing}${separator}${curated}`;
    }

    function createResolver(records, options) {
        const config = options || {};
        const baseUrl = config.baseUrl;
        const indexed = new Map();
        for (const record of Array.isArray(records) ? records : []) {
            const key = normalizeAssetRef(record && record.assetRef, baseUrl);
            if (!key || !['problem', 'solution'].includes(record.visualRole)) continue;
            const roleKey = `${key}\u0000${record.visualRole}`;
            if (indexed.has(roleKey)) throw new Error(`DUPLICATE_SVG_ACCESSIBILITY_RECORD:${record.assetRef}:${record.visualRole}`);
            indexed.set(roleKey, record);
        }

        return function resolveImageDescription(assetRef, requestedField, question, existingAlt) {
            const key = normalizeAssetRef(assetRef, baseUrl);
            if (!key) return '';
            const role = requestedField === 'solutionImage' || requestedField === 'solution' ? 'solution' : 'problem';
            const record = role === 'solution'
                ? indexed.get(`${key}\u0000solution`) || indexed.get(`${key}\u0000problem`)
                : indexed.get(`${key}\u0000problem`);
            if (!record || record.provenanceStatus !== 'SOURCE_BOUND') return '';
            if (role === 'problem' && (record.visualRole !== 'problem' || record.answerHintFree !== true)) return '';
            if (role === 'solution' && record.visualRole === 'problem' && record.answerHintFree !== true) return '';
            return combineAccessibleText(record, existingAlt);
        };
    }

    let currentRecords = null;
    let currentResolver = null;
    function resolveImageDescription(assetRef, field, question, existingAlt) {
        const records = root && root.APSvgAccessibilityIndex && root.APSvgAccessibilityIndex.records;
        if (!Array.isArray(records)) return '';
        if (records !== currentRecords) {
            currentRecords = records;
            currentResolver = createResolver(records);
        }
        return currentResolver(assetRef, field, question, existingAlt);
    }

    function selectAccessibleAlt(assetRef, field, question, existingAlt, fallbackAlt) {
        const curated = resolveImageDescription(assetRef, field, question, existingAlt);
        if (curated) return curated;
        return isGenericOrEnglishAlt(existingAlt) ? text(fallbackAlt).trim() : text(existingAlt).trim();
    }

    return Object.freeze({
        normalizeAssetRef,
        isGenericOrEnglishAlt,
        createResolver,
        resolveImageDescription,
        selectAccessibleAlt
    });
}));
