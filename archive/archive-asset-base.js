/*
 * Exam image base URL - the ONE setting that decides where exam images are loaded from.
 *
 * Exam JS keeps its image references unchanged ("assets/images/<examFolder>/<file>", or the bare
 * "<examFolder>/<file>" key). Every consumer that turns such a reference into an URL calls
 * resolveExamImageUrl() from this file.
 *
 *   DEFAULT_EXAM_IMAGE_BASE = 'https://img.wangjiedu.com' -> <base>/exams/images/<examFolder>/<file> (Cloudflare R2). TODAY.
 *   DEFAULT_EXAM_IMAGE_BASE = ''                      -> same-origin relative URLs, byte-for-byte unchanged (pre-R2 behaviour).
 *
 * The default was switched to R2 on 2026-10-30 (bucket CORS is set for https://icefoxtail.github.io and
 * https://wangjiedu.com, see tools/r2/EXAM_IMAGE_BASE.md). Images stay in Git and in the Pages package, so an
 * external URL that fails to load falls back ONCE to the original same-origin URL.
 *
 * CORS mode: an external exam <img> is requested with crossorigin="anonymous" (crossOriginAttr / applyCrossOrigin)
 * so that print code can read its pixels (print_image_optimizer.js, html2canvas) and the browser cache keeps the
 * response WITH its Access-Control-Allow-Origin header. A plain (no-cors) load of the same URL would cache the
 * response without that header and make every later CORS read of it fail. Pages that do not run on http(s)
 * (file://) skip the attribute; a CORS failure (origin not allowed by the bucket) takes the same-origin fallback.
 *
 * Teacher QA override (never honoured on student pages): "?assetBase=<https url>" is remembered in localStorage
 * (key ap.examImageBase.qa) so that preview iframes / print windows opened afterwards use it too;
 * "?assetBase=off" forces same-origin images (also remembered); "?assetBase=default" forgets the override.
 * Only exam images under assets/images are mapped (assets/generated-lite, textbook images next to their source JS
 * and other files are never remapped).
 */
(function attachArchiveAssetBase(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) {
        root.APArchiveAssetBase = api;
        root.resolveExamImageUrl = api.resolveExamImageUrl;
        root.examImageCrossOriginAttr = api.crossOriginAttr;
        root.examImageCrossOrigin = api.applyCrossOrigin;
        // Read the configuration at load time: a QA ?assetBase= on a page that renders no image itself (workspace,
        // unit-past-exams, ...) is still remembered for the preview iframes and print windows it opens.
        if (root.document && typeof root.document.addEventListener === 'function') { api.describe(); api.installFallback(root.document); }
    }
}(typeof globalThis === 'undefined' ? this : globalThis, function createArchiveAssetBase(root) {
    'use strict';

    // THE setting. Exam images come from Cloudflare R2 by default; '' would go back to same-origin Pages URLs.
    const DEFAULT_EXAM_IMAGE_BASE = 'https://img.wangjiedu.com';
    const R2_KEY_PREFIX = 'exams/images/';
    const OVERRIDE_STORAGE_KEY = 'ap.examImageBase.qa';
    const OVERRIDE_PARAM = 'assetBase';
    const OVERRIDE_OFF = 'off';          // ?assetBase=off  -> same-origin images (stored under the same key)
    const OVERRIDE_RESET = 'default';    // ?assetBase=default (or empty) -> forget the override
    const OWN_HOSTS = new Set(['icefoxtail.github.io', 'wangjiedu.com', 'www.wangjiedu.com']);
    const FALLBACK_FLAG = 'apImgFallback';
    // [optional absolute origin][optional ./ ../ archive/ AP------/ prefixes]assets/images/<key>
    const IMAGE_PATH = /^(?:(?:https?:)?\/\/([^/?#]+))?\/?(?:(?:\.{1,2}|archive|AP------)\/)*assets\/images\/([^?#]+)([?#].*)?$/i;
    const BARE_KEY = /^([^/?#]+\/[^/?#]+\.(?:png|jpe?g|webp|gif|svg))([?#].*)?$/i;

    const externalToOriginal = new Map();

    function locationOf() {
        return root && root.location ? root.location : null;
    }

    function isStudentPage() {
        const loc = locationOf();
        if (root && root.__AP_EXAM_IMAGE_BASE_STUDENT__ === true) return true;
        if (!loc) return false;
        if (/\/apmath\/student\//i.test(String(loc.pathname || ''))) return true;
        try { return new URLSearchParams(loc.search || '').get('studentReview') === '1'; } catch (error) { return false; }
    }

    function normalizeBase(value) {
        const text = String(value == null ? '' : value).trim();
        if (!text) return '';
        let url;
        try { url = new URL(text); } catch (error) { return ''; }
        const local = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        if (url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) return '';
        if (url.username || url.password || url.search || url.hash) return '';
        return url.origin + url.pathname.replace(/\/+$/, '');
    }

    // QA override value: 'off' (same-origin images), a normalized https base, or null (nothing usable).
    function normalizeOverride(value) {
        const text = String(value == null ? '' : value).trim();
        if (text.toLowerCase() === OVERRIDE_OFF) return OVERRIDE_OFF;
        return normalizeBase(text) || null;
    }

    // null = no override (the default base applies). Never honoured on student pages.
    function readOverride() {
        if (!root || isStudentPage()) return null;
        const loc = locationOf();
        let params = null;
        try { params = loc ? new URLSearchParams(loc.search || '') : null; } catch (error) { params = null; }
        if (params && params.has(OVERRIDE_PARAM)) {
            const raw = String(params.get(OVERRIDE_PARAM) || '').trim();
            const reset = !raw || raw.toLowerCase() === OVERRIDE_RESET;
            const value = reset ? null : normalizeOverride(raw);
            // An unusable value (http://..., a typo) is ignored: it neither changes the stored override nor takes effect.
            if (reset || value) {
                try {
                    if (root.localStorage) {
                        if (value) root.localStorage.setItem(OVERRIDE_STORAGE_KEY, value);
                        else root.localStorage.removeItem(OVERRIDE_STORAGE_KEY);
                    }
                } catch (error) { /* storage unavailable: this page still honours the query value */ }
                return value;
            }
        }
        try { return normalizeOverride(root.localStorage && root.localStorage.getItem(OVERRIDE_STORAGE_KEY)); } catch (error) { return null; }
    }

    let configured = null;
    function getConfig() {
        if (!configured) {
            const override = readOverride();
            const defaultBase = normalizeBase(DEFAULT_EXAM_IMAGE_BASE);
            const base = override === null ? defaultBase : override === OVERRIDE_OFF ? '' : override;
            configured = Object.freeze({ base, source: override === null ? 'default' : 'override' });
        }
        return configured;
    }

    function isOwnHost(host) {
        if (!host) return true;
        const loc = locationOf();
        const lower = String(host).toLowerCase();
        return OWN_HOSTS.has(lower) || (!!loc && lower === String(loc.host || '').toLowerCase());
    }

    // "<examFolder>/<file>" key of an exam image reference, or '' when the reference is not an exam image.
    function examImageKey(path, options) {
        const raw = String(path == null ? '' : path).trim();
        if (!raw || /^(?:data|blob):/i.test(raw)) return '';
        const match = IMAGE_PATH.exec(raw);
        let key = '';
        if (match) {
            if (!isOwnHost(match[1])) return '';
            key = match[2];
        } else if (options && options.bareKey) {
            const bare = BARE_KEY.exec(raw);
            if (!bare || /^(?:assets|exams|data|archive|vendor)\//i.test(bare[1])) return '';
            key = bare[1];
        } else return '';
        try { key = decodeURIComponent(key); } catch (error) { return ''; }
        const parts = key.split('/');
        return parts.length >= 2 && parts.every(part => part && part !== '.' && part !== '..') ? key : '';
    }

    function tail(path) {
        const m = /[?#].*$/.exec(String(path));
        return m ? m[0] : '';
    }

    // Returns the URL to load. With an empty base (QA ?assetBase=off, or DEFAULT_EXAM_IMAGE_BASE = '') the input
    // string is returned untouched.
    function resolveExamImageUrl(path, options) {
        const config = options && options.config ? options.config : getConfig();
        if (!config.base) return path;
        const key = examImageKey(path, options);
        if (!key) return path;
        const url = config.base + '/' + R2_KEY_PREFIX + key.split('/').map(encodeURIComponent).join('/') + tail(path);
        if (externalToOriginal.size < 50000) externalToOriginal.set(url, String(path));
        return url;
    }

    // CORS mode of an external exam <img> (see the header comment): 'anonymous' on http(s) pages, '' elsewhere (file://).
    function corsMode() {
        const loc = locationOf();
        return !loc || /^https?:$/i.test(String(loc.protocol || '')) ? 'anonymous' : '';
    }

    // True for an URL that resolveExamImageUrl() has just mapped to the external base.
    function isExternalUrl(url) {
        return externalToOriginal.has(String(url == null ? '' : url));
    }

    // ' crossorigin="anonymous"' for an <img ...> template whose src is `url`; '' for same-origin URLs.
    function crossOriginAttr(url) {
        return corsMode() && isExternalUrl(url) ? ' crossorigin="anonymous"' : '';
    }

    // DOM variant for an <img> element: call it BEFORE the src is assigned, so the image is fetched once, in CORS mode.
    function applyCrossOrigin(img, url) {
        const mode = corsMode();
        if (!mode || !img || typeof img.setAttribute !== 'function' || typeof img.getAttribute !== 'function' || !isExternalUrl(url)) return false;
        if (img.getAttribute('crossorigin') == null) img.setAttribute('crossorigin', mode);
        return true;
    }

    // <img src="..."> inside an HTML string (inline exam content). Default config: returned untouched.
    function resolveHtml(html, options) {
        const config = options && options.config ? options.config : getConfig();
        if (!config.base || typeof html !== 'string' || html.indexOf('<img') < 0) return html;
        return html.replace(/(<img\b[^>]*?\bsrc\s*=\s*)(["'])([\s\S]*?)\2/gi, (match, pre, quote, src) => {
            const url = resolveExamImageUrl(src, options);
            const cors = /\bcrossorigin\b/i.test(pre) ? '' : crossOriginAttr(url);
            return (cors ? pre.replace(/^<img\b/i, '<img' + cors) : pre) + quote + url + quote;
        });
    }

    // One fallback per image: external URL failed -> original same-origin URL. A capture-phase listener stops the
    // first error so that readiness code waiting on the element only sees the outcome of the fallback load.
    function installFallback(doc) {
        if (!doc || doc.__apExamImageFallback || typeof doc.addEventListener !== 'function') return false;
        doc.__apExamImageFallback = true;
        doc.addEventListener('error', event => {
            const image = event.target;
            if (!image || image.tagName !== 'IMG' || !image.dataset || image.dataset[FALLBACK_FLAG]) return;
            const current = image.getAttribute('src') || '';
            const original = externalToOriginal.get(current);
            if (!original) return;
            image.dataset[FALLBACK_FLAG] = '1';
            event.stopImmediatePropagation();
            image.setAttribute('src', original);
        }, true);
        return true;
    }

    function describe() {
        const config = getConfig();
        return { base: config.base, source: config.source, student: isStudentPage(), keyPrefix: R2_KEY_PREFIX, crossOrigin: corsMode() };
    }

    function resetForTest() {
        configured = null;
        externalToOriginal.clear();
    }

    return Object.freeze({
        DEFAULT_EXAM_IMAGE_BASE, R2_KEY_PREFIX, OVERRIDE_STORAGE_KEY, OVERRIDE_PARAM,
        examImageKey, resolveExamImageUrl, resolveHtml, crossOriginAttr, applyCrossOrigin, installFallback, describe, normalizeBase, resetForTest
    });
}));
