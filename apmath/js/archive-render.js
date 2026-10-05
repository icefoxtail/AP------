(function () {
    'use strict';

    const ARCHIVE_BASE_URL = 'https://icefoxtail.github.io/AP------/archive/';
    const ARCHIVE_ASSET_CACHE_VERSION = '20260828.1';

    function withArchiveAssetCacheBuster(url) {
        const raw = String(url || '').trim();
        if (!raw || /^(?:data:|blob:)/i.test(raw) || !/(^|\/)assets\/images\//i.test(raw)) return raw;
        const hashIndex = raw.indexOf('#');
        const base = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;
        const hash = hashIndex >= 0 ? raw.slice(hashIndex) : '';
        const separator = base.includes('?') ? '&' : '?';
        return `${base}${separator}v=${encodeURIComponent(ARCHIVE_ASSET_CACHE_VERSION)}${hash}`;
    }

    function normalizeArchiveFile(file) {
        const raw = String(file || '').trim();
        if (!raw) return '';
        if (/^https?:\/\//i.test(raw)) return raw;
        let path = raw.replace(/^archive\//i, '').replace(/^\.\//, '').replace(/^\//, '');
        if (!path.endsWith('.js')) path += '.js';
        if (!/^(exams|assets|data)\//i.test(path)) path = `exams/${path}`;
        return path;
    }

    function resolveArchiveAssetUrl(src, archiveFile) {
        const raw = String(src || '').trim();
        if (!raw) return '';
        if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
        let path = raw.replace(/^\.\//, '').replace(/^\//, '').replace(/^archive\//i, '');
        if (!/^assets\//i.test(path) && archiveFile) {
            const dir = normalizeArchiveFile(archiveFile).split('/').slice(0, -1).join('/');
            path = (dir ? `${dir}/` : '') + path;
        }
        const encoded = path.split('/').map(part => encodeURIComponent(part)).join('/');
        return withArchiveAssetCacheBuster(ARCHIVE_BASE_URL + encoded);
    }

    function rewriteImgSrcInHtml(html, archiveFile) {
        return String(html || '').replace(
            /(<img\b[^>]*?\bsrc\s*=\s*)(["'])([\s\S]*?)\2/gi,
            (match, pre, quote, src) => {
                const resolved = resolveArchiveAssetUrl(src, archiveFile);
                const rewritten = `${pre}${quote}${resolved || src}${quote}`;
                const withLoading = /\sloading\s*=/i.test(rewritten)
                    ? rewritten
                    : rewritten.replace(/<img\b/i, '<img loading="eager"');
                return /\sdecoding\s*=/i.test(withLoading)
                    ? withLoading
                    : withLoading.replace(/<img\b/i, '<img decoding="async"');
            }
        );
    }

    function getQuestionImageRaw(q) {
        return q?.image || q?.imageUrl || q?.img || q?.imageTag || q?.imagePath || q?.image_path || q?.figure || '';
    }

    function wrapLatex(text) {
        if (text == null) return '';
        let s = String(text);
        s = s.replace(/\\\([\s\S]+?\\\)/g, m => '$' + m.slice(2, -2) + '$');
        s = s.replace(/\\\[[\s\S]+?\\\]/g, m => '$$' + m.slice(2, -2) + '$$');
        const combRepl = T => (m, a1, a2, b1, b2) => `$_{${a1 || a2}}${T}_{${b1 || b2}}$`;
        const combPat = prefix => new RegExp(`(?<!\\$)(?:\\{\\}|\\[\\])_(?:\\{([^}]+)\\}|([a-zA-Z0-9+\\-]+))${prefix}_(?:\\{([^}]+)\\}|([a-zA-Z0-9+\\-]+))`, 'g');
        const htmlTags = [];
        s = s.replace(/<svg[\s\S]*?<\/svg>|<img[^>]*>|<br\s*\/?>|<\/?(div|span|b|i|strong|em|u|sup|sub|table|thead|tbody|tr|th|td|colgroup|col)[^>]*>/gi, m => {
            const token = `__HTMLTAG_${htmlTags.length}__`;
            htmlTags.push(m);
            return token;
        });
        s = s.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g).map((seg, idx) => {
            if (idx % 2 === 1) return seg;
            let t = seg;
            t = t.replace(combPat('C'), combRepl('C')).replace(combPat('H'), combRepl('H')).replace(combPat('P'), combRepl('P'));
            return t.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }).join('');
        s = s.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$|__HTMLTAG_\d+__)/g).map((seg, idx) => {
            if (idx % 2 === 1) return seg;
            const trimmed = seg.trim();
            if (!trimmed) return seg;
            const hasKorean = /[\uAC00-\uD7A3]/.test(seg);
            const hasLatex = /\\[a-zA-Z]/.test(seg);
            if (!hasKorean && /\\begin\{(cases|aligned|array|matrix|pmatrix|bmatrix|vmatrix|Vmatrix)\}/.test(seg)) return `$$${seg}$$`;
            if (!hasKorean && hasLatex && /^[0-9a-zA-Z\s+\-*\/=\^{}()[\]_.,\\!;:]+$/.test(trimmed)) return `$${trimmed}$`;
            if (hasKorean && hasLatex) return seg.replace(/(\\[a-zA-Z]+(?:\{[^}]*\})*(?:\{[^}]*\})*(?:_\{?[^}\s]+\}?)?(?:\^\{?[^}\s]+\}?)?)/g, '$$$1$$');
            return seg;
        }).join('');
        s = s.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g).map((seg, idx) => {
            if (idx % 2 === 1) return seg;
            return seg.replace(/(\\\{(?:[^{}]|\{[^}]*\})*\\\})/g, '$$$1$$');
        }).join('');
        s = s.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g).map((seg, idx) => {
            if (idx % 2 === 0) return seg;
            return seg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }).join('');
        s = s.replace(/\\n(?![a-zA-Z])/g, '<br>').replace(/\r\n|\r|\n/g, '<br>');
        return s.replace(/__HTMLTAG_(\d+)__/g, (_, i) => htmlTags[i] || '');
    }

    window.ApArchiveRender = {
        ARCHIVE_BASE_URL,
        ARCHIVE_ASSET_CACHE_VERSION,
        normalizeArchiveFile,
        resolveArchiveAssetUrl,
        rewriteImgSrcInHtml,
        getQuestionImageRaw,
        wrapLatex
    };
})();
