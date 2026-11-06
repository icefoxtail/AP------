/* Metadata enrichment is optional for a verified, frozen output reader. */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root?.document) root.APOutputMetadataLoader = api.create(root);
}(typeof globalThis === 'undefined' ? this : globalThis, function () {
    'use strict';

    const METADATA_SCRIPT = 'question-meta.js?v=archive-metadata-v1-phase1b-20260826b';

    function isFrozenReader(win) {
        const params = new URL(win.location.href, win.document.baseURI).searchParams;
        const contractVersion = win.Archive2OutputContract?.CONTRACT_VERSION;
        // This selects a loading policy, not an output authority. The mixed
        // reader still verifies the complete envelope before using its source.
        // Registration consumes sidecar fields, including after a mode switch.
        return !!contractVersion && params.get('archive2Context') === 'archive2' &&
            params.get('archive2OutputContract') === contractVersion &&
            !!params.get('outputRequestId')?.trim() && !!params.get('outputOwnerId')?.trim() &&
            params.get('studio') === '1' && params.get('runtime') !== 'legacy' &&
            params.get('submitQr') !== '1' && params.get('osqr') !== '1';
    }

    function loadSidecar(win) {
        if (win.__ARCHIVE_METADATA_READY__) return Promise.resolve(win.__ARCHIVE_METADATA_READY__);
        return new Promise(resolve => {
            const script = win.document.createElement('script');
            script.src = new URL(METADATA_SCRIPT, win.document.baseURI).href;
            script.async = true;
            script.onload = () => {
                script.onload = script.onerror = null;
                // Loading the helper only starts its fetch. Do not normalize
                // legacy or registration inputs until that fetch has settled.
                resolve(win.__ARCHIVE_METADATA_READY__ || null);
            };
            script.onerror = () => {
                script.onload = script.onerror = null;
                win.console.warn('[metadata] question-meta.js 로드 실패 — approved sidecar metadata 없이 진행');
                resolve(null);
            };
            win.document.head.appendChild(script);
        });
    }

    function create(win) {
        const frozenSource = isFrozenReader(win);
        // Keep this decision for the lifetime of the document. A mode change or
        // late metadata helper must never alter an already sealed source input.
        return Object.freeze({
            mode: frozenSource ? 'frozen-source' : 'sidecar',
            ready: frozenSource ? Promise.resolve(null) : loadSidecar(win),
            normalizeQuestion(question, ref) {
                if (frozenSource) return question;
                return typeof win.mergeArchiveQuestionMetadata === 'function'
                    ? win.mergeArchiveQuestionMetadata(question, ref) : question;
            }
        });
    }

    return Object.freeze({ create });
}));
