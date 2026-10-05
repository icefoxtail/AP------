(function attachQuestionImageReadiness(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APQuestionImageReadiness = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function createQuestionImageReadiness() {
    'use strict';

    const QUESTION_IMAGE_SELECTOR = '.q-content img, [data-semantic-content="1"] img, .q-image-wrap img';
    const DEFAULT_TIMEOUT_MS = 1200;

    function asList(value) {
        return Array.from(value || []);
    }

    function collectImages(root, selector = 'img') {
        return asList(root?.querySelectorAll?.(selector));
    }

    function collectQuestionImages(root) {
        return collectImages(root, QUESTION_IMAGE_SELECTOR);
    }

    function imageSource(image) {
        return String(image?.currentSrc || image?.src || image?.getAttribute?.('src') || '');
    }

    function normalizeQuestionImageSources(root, resolve) {
        if (typeof resolve !== 'function') throw new TypeError('QUESTION_IMAGE_RESOLVER_MISSING');
        const images = collectQuestionImages(root);
        images.forEach(image => {
            const raw = String(image.getAttribute?.('src') || '').trim();
            if (!raw) return;
            const normalized = resolve(raw, image);
            if (typeof normalized === 'string' && normalized !== raw) image.setAttribute('src', normalized);
        });
        return images;
    }

    function inspectImage(image) {
        if (!image) return { status: 'error', reason: 'MISSING_IMAGE' };
        if (image.complete !== true) return { status: 'pending', reason: 'LOAD_PENDING', src: imageSource(image) };
        const naturalWidth = Number(image.naturalWidth) || 0;
        const naturalHeight = Number(image.naturalHeight) || 0;
        if (naturalWidth <= 0 || naturalHeight <= 0) return {
            status: 'error', reason: 'COMPLETE_WITHOUT_DIMENSIONS', naturalWidth, naturalHeight, src: imageSource(image)
        };
        return { status: 'loaded', naturalWidth, naturalHeight, src: imageSource(image) };
    }

    async function waitForDecode(image, timeoutMs) {
        if (typeof image?.decode !== 'function') return inspectImage(image);
        let decodePromise;
        try {
            decodePromise = Promise.resolve(image.decode());
        } catch (error) {
            return { status: 'error', reason: 'DECODE_ERROR', message: String(error?.message || error) };
        }
        const decoded = await Promise.race([
            decodePromise.then(() => ({ status: 'decoded' })).catch(error => ({
                status: 'error', reason: 'DECODE_ERROR', message: String(error?.message || error)
            })),
            new Promise(resolve => setTimeout(() => resolve({ status: 'timeout', reason: 'DECODE_TIMEOUT' }), timeoutMs))
        ]);
        if (decoded.status !== 'decoded') return { ...decoded, src: imageSource(image) };
        return inspectImage(image);
    }

    async function waitForImage(image, timeoutMs = DEFAULT_TIMEOUT_MS) {
        const immediate = inspectImage(image);
        if (immediate.status === 'loaded') return waitForDecode(image, timeoutMs);
        if (immediate.status === 'error') return immediate;
        if (!image?.addEventListener) return { status: 'timeout', reason: 'LOAD_TIMEOUT' };

        const eventResult = await new Promise(resolve => {
            let settled = false;
            const timer = setTimeout(() => finish({ status: 'timeout', reason: 'LOAD_TIMEOUT', src: imageSource(image) }), timeoutMs);
            const cleanup = () => {
                clearTimeout(timer);
                image.removeEventListener?.('load', onLoad);
                image.removeEventListener?.('error', onError);
            };
            const finish = result => {
                if (settled) return;
                settled = true;
                cleanup();
                resolve(result);
            };
            const onLoad = () => {
                const loaded = inspectImage(image);
                finish(loaded.status === 'loaded' ? loaded : {
                    ...loaded, reason: loaded.reason || 'LOADED_WITHOUT_DIMENSIONS'
                });
            };
            const onError = () => finish({ status: 'error', reason: 'LOAD_ERROR', src: imageSource(image) });
            image.addEventListener('load', onLoad, { once: true });
            image.addEventListener('error', onError, { once: true });
        });
        if (eventResult.status !== 'loaded') return eventResult;
        return waitForDecode(image, timeoutMs);
    }

    function summarize(results) {
        const list = asList(results);
        return Object.freeze({
            images: list.length,
            loaded: list.filter(result => result?.status === 'loaded').length,
            errors: list.filter(result => result?.status === 'error').length,
            timeouts: list.filter(result => result?.status === 'timeout' || result?.status === 'pending').length
        });
    }

    function createReadinessError(results, failureCodes = {}) {
        const list = asList(results);
        const bad = list.find(result => result?.status !== 'loaded') || { status: 'error', reason: 'UNKNOWN' };
        const code = bad.status === 'error'
            ? String(failureCodes.error || 'IMAGE_READINESS_INCOMPLETE')
            : String(failureCodes.timeout || 'IMAGE_READINESS_INCOMPLETE');
        const error = new Error(code);
        error.code = code;
        error.details = { summary: summarize(list), results: list };
        return error;
    }

    async function waitForImages(images, options = {}) {
        const list = asList(images);
        const timeoutMs = Number(options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
        const results = await Promise.all(list.map(image => waitForImage(image, timeoutMs)));
        const summary = summarize(results);
        if (options.throwOnFailure !== false && results.some(result => result?.status !== 'loaded')) {
            throw createReadinessError(results, options.failureCodes);
        }
        return Object.freeze({ summary, results: Object.freeze(results) });
    }

    function validateImages(images, options = {}) {
        const results = asList(images).map(inspectImage);
        const bad = results.some(result => result?.status !== 'loaded');
        return Object.freeze({
            ok: !bad,
            code: bad ? createReadinessError(results, options.failureCodes).code : null,
            summary: summarize(results),
            results: Object.freeze(results)
        });
    }

    return Object.freeze({
        QUESTION_IMAGE_SELECTOR,
        DEFAULT_TIMEOUT_MS,
        collectImages,
        collectQuestionImages,
        normalizeQuestionImageSources,
        inspectImage,
        waitForImage,
        waitForImages,
        validateImages,
        summarize,
        createReadinessError
    });
}));
