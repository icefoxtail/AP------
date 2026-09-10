(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APRenderStateNormalizer = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function () {
    'use strict';
    const VERSION = 'archive-candidate-v1';
    const MODE_MAP = Object.freeze({ exam: 'exam', sol: 'solution', ans: 'answer' });
    const CANONICAL_TO_APP_MODE = Object.freeze({ exam: 'exam', solution: 'sol', answer: 'ans' });
    const RENDER_FIELDS = Object.freeze(['id', 'content', 'question', 'choices', 'answer', 'solution', 'explanation', 'sol', 'image', 'imageSize', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'layoutTag', 'choiceColumns', 'wide', 'sourceArchiveFile', 'source_archive_file', 'sourceOrdinal', 'sourceQuestionOrdinal', 'source_question_ordinal', 'questionUid', 'sourceQuestionUid', 'source_question_uid']);
    const CANONICAL_FIELDS = Object.freeze(['sourceRef', 'displayNo', 'content', 'choices', 'answer', 'solution', 'image', 'imageSize', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'layoutTag', 'choiceColumns', 'wide']);

    function copy(value, ancestors = new Set()) {
        if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (!value || typeof value !== 'object') throw new Error('UNSUPPORTED_RENDER_VALUE');
        const proto = Object.getPrototypeOf(value);
        if (!Array.isArray(value) && proto !== Object.prototype && proto !== null) throw new Error('NON_PLAIN_RENDER_VALUE');
        if (ancestors.has(value)) throw new Error('CYCLIC_RENDER_VALUE');
        if (Object.getOwnPropertySymbols(value).length) throw new Error('SYMBOL_RENDER_FIELD');
        ancestors.add(value);
        const output = Array.isArray(value) ? [] : {};
        for (const key of Object.keys(value).sort()) {
            const desc = Object.getOwnPropertyDescriptor(value, key);
            if (!desc || desc.get || desc.set || key === '__proto__') throw new Error('UNSUPPORTED_RENDER_FIELD');
            // An absent optional field has one canonical representation.
            if (desc.value !== undefined) output[key] = copy(desc.value, ancestors);
        }
        ancestors.delete(value);
        return Object.freeze(output);
    }

    function project(value, fields) {
        const result = {};
        for (const field of fields) {
            const desc = Object.getOwnPropertyDescriptor(value || {}, field);
            if (desc?.get || desc?.set) throw new Error('ACCESSOR_RENDER_FIELD');
            if (desc && desc.value !== undefined) result[field] = desc.value;
        }
        return copy(result);
    }

    function assertImmutable(value) {
        if (!value || typeof value !== 'object') return true;
        if (!Object.isFrozen(value)) throw new Error('MUTABLE_RENDER_VALUE');
        for (const item of Object.values(value)) assertImmutable(item);
        return true;
    }

    // Collision-free canonical serialization is the key authority in Phase 1A.
    // No lossy short hash can silently alias two distinct render inputs.
    function semanticDigest(value) { return JSON.stringify(copy(value)); }

    function canonicalRenderData(canonical, raw) {
        if (!Array.isArray(canonical) || !Array.isArray(raw) || canonical.length !== raw.length || !raw.length) throw new Error('INVALID_CANONICAL_RENDER_DATA');
        return copy(canonical.map((question, index) => ({
            ...project(question, CANONICAL_FIELDS),
            sourcePayload: project(raw[index], ['content', 'question']),
            renderInput: project(raw[index], RENDER_FIELDS)
        })));
    }

    function createCandidate(value) {
        const assertFields = (object, fields) => {
            for (const key of Object.keys(object || {})) if (!fields.includes(key)) throw new Error(`UNKNOWN_CANDIDATE_FIELD:${key}`);
        };
        assertFields(value, ['schemaVersion', 'canonicalMode', 'input', 'mode', 'qpp', 'source', 'printHeaderOptions', 'qrState', 'rendererMode', 'profile', 'layoutOptions', 'environment', 'fingerprints']);
        assertFields(value.source, ['targetSessionId', 'sourceRequestId', 'safeDataUrl', 'sourceArchiveFile', 'canonicalRenderData', 'canonicalDataFingerprint', 'title', 'identityTitle', 'displayTitle', 'businessData']);
        assertFields(value.printHeaderOptions, ['title', 'metaRight', 'subtitle', 'showNameLine', 'showScoreLine', 'applyToSolution', 'applyToAnswer']);
        assertFields(value.fingerprints, ['engine', 'renderAuthority', 'layoutAuthority', 'executor', 'pageLayout', 'font', 'asset', 'qrPolicy', 'qrPayload', 'printHeader', 'profile']);
        if (!Object.hasOwn(MODE_MAP, value.mode)) throw new Error('INVALID_RENDER_MODE');
        if (!Number.isInteger(value.qpp) || value.qpp < 1 || value.qpp > 40) throw new Error('INVALID_QPP');
        if (!value.source?.targetSessionId || !value.source?.canonicalRenderData?.length) throw new Error('INVALID_CANDIDATE_SOURCE');
        const candidate = copy({ ...value, schemaVersion: VERSION, canonicalMode: MODE_MAP[value.mode] });
        assertImmutable(candidate);
        return candidate;
    }

    function computeSnapshotKey(candidate) {
        assertImmutable(candidate);
        // Session binding is checked separately. Requested ordering is never a key input.
        const { targetSessionId, sourceRequestId, ...source } = candidate.source;
        const { input, ...semantic } = candidate;
        return semanticDigest({ ...semantic, source });
    }

    return Object.freeze({ VERSION, MODE_MAP, CANONICAL_TO_APP_MODE, RENDER_FIELDS, CANONICAL_FIELDS, copy, project, assertImmutable, semanticDigest, canonicalRenderData, createCandidate, computeSnapshotKey });
}));
