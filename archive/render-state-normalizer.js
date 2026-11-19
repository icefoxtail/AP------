(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APRenderStateNormalizer = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function () {
    'use strict';
    const VERSION = 'archive-candidate-v2';
    const MODE_MAP = Object.freeze({ exam: 'exam', sol: 'solution', ans: 'answer' });
    const CANONICAL_TO_APP_MODE = Object.freeze({ exam: 'exam', solution: 'sol', answer: 'ans' });
    const RENDER_FIELDS = Object.freeze(['id', 'content', 'question', 'choices', 'answer', 'solution', 'explanation', 'sol', 'image', 'imageAlt', 'imageSize', 'imageSizeOverride', 'imageScale', 'choicesEmbeddedInImage', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'solutionImageSizeOverride', 'solutionImageScale', 'solutionImageLayout', 'solutionReminderImagePolicy', 'layoutTag', 'layoutForce', 'choiceColumns', 'wide', 'sourceArchiveFile', 'source_archive_file', 'sourceOrdinal', 'sourceQuestionOrdinal', 'source_question_ordinal', 'questionUid', 'sourceQuestionUid', 'source_question_uid', 'reviewSourceRef']);
    const CANONICAL_FIELDS = Object.freeze(['sourceRef', 'displayNo', 'content', 'choices', 'answer', 'solution', 'image', 'imageSize', 'imageSizeOverride', 'choicesEmbeddedInImage', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'solutionImageSizeOverride', 'solutionImageLayout', 'solutionReminderImagePolicy', 'layoutTag', 'choiceColumns', 'wide']);
    const ownedImmutableValues = new WeakSet();
    const serializedValues = new WeakMap();

    function copy(value, ancestors = new Set()) {
        if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (!value || typeof value !== 'object') throw new Error('UNSUPPORTED_RENDER_VALUE');
        if (ownedImmutableValues.has(value)) return value;
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
        Object.freeze(output);
        ownedImmutableValues.add(output);
        return output;
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
        if (ownedImmutableValues.has(value)) return true;
        if (!Object.isFrozen(value)) throw new Error('MUTABLE_RENDER_VALUE');
        for (const item of Object.values(value)) assertImmutable(item);
        return true;
    }

    // Collision-free canonical serialization is the key authority in Phase 1A.
    // No lossy short hash can silently alias two distinct render inputs.
    function semanticDigest(value) {
        const immutable = copy(value);
        if (!immutable || typeof immutable !== 'object') return JSON.stringify(immutable);
        if (!serializedValues.has(immutable)) serializedValues.set(immutable, JSON.stringify(immutable));
        return serializedValues.get(immutable);
    }

    // 2026-11-18 사용자 결정: 배치는 "기본 칸(grid)"과 "한 단 전체(subjective-2up)" 둘뿐이고, 기본은 모든 문항을 칸에 먼저 놓는다.
    // 시험지 데이터의 layoutTag(fullwidth·wide·full·subjective-2up·subjective-4up 등)와 wide:true는 그림이 컸던 시절 사람이 붙인 "힌트"라서
    // 문제 모드 렌더에서는 처음 배치에 쓰지 않는다(데이터는 고치지 않고 렌더용 사본에서만). 들어가지 않는 문항은 균등 칸 엔진이 측정 뒤에
    // 그 문항만 한 단 전체로 올린다(equal-slot-engine.js 자동 승격). 작성자가 꼭 한 단 전체를 원하면 문항에 layoutForce: "subjective-2up".
    const FORCE_TWO_UP = 'subjective-2up';
    function renderLayoutTag() { return ''; }
    function renderQuestionLayout(question) {
        if (!question || typeof question !== 'object') return question;
        const forced = question.layoutForce === FORCE_TWO_UP;
        return { ...question, layoutTag: forced ? FORCE_TWO_UP : '', wide: false };
    }

    function canonicalRenderData(canonical, raw) {
        if (!Array.isArray(canonical) || !Array.isArray(raw) || canonical.length !== raw.length) throw new Error('INVALID_CANONICAL_RENDER_DATA');
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
        assertFields(value.source, ['targetSessionId', 'sourceRequestId', 'sourceKind', 'safeDataUrl', 'sourceArchiveFile', 'bridgeEpoch', 'sourceEpoch', 'revision', 'canonicalRenderData', 'canonicalDataFingerprint', 'title', 'identityTitle', 'displayTitle', 'businessData']);
        assertFields(value.printHeaderOptions, ['title', 'metaRight', 'subtitle', 'showNameLine', 'showScoreLine', 'applyToSolution', 'applyToAnswer']);
        assertFields(value.fingerprints, ['engine', 'renderAuthority', 'layoutAuthority', 'executor', 'pageLayout', 'font', 'asset', 'qrPolicy', 'qrPayload', 'printHeader', 'profile']);
        if (!Object.hasOwn(MODE_MAP, value.mode)) throw new Error('INVALID_RENDER_MODE');
        if (!Number.isInteger(value.qpp) || value.qpp < 1 || value.qpp > 40) throw new Error('INVALID_QPP');
        if (!value.source?.targetSessionId || !Array.isArray(value.source?.canonicalRenderData) || (value.source.sourceKind !== 'review-snapshot' && !value.source.canonicalRenderData.length)) throw new Error('INVALID_CANDIDATE_SOURCE');
        if (value.source?.sourceKind && !['archive-source', 'review-snapshot'].includes(value.source.sourceKind)) throw new Error('INVALID_SOURCE_KIND');
        for (const key of ['bridgeEpoch', 'sourceEpoch', 'revision']) {
            if (value.source?.[key] !== undefined && (!Number.isInteger(value.source[key]) || value.source[key] < 0)) throw new Error(`INVALID_SOURCE_REVISION:${key}`);
        }
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

    return Object.freeze({ VERSION, MODE_MAP, CANONICAL_TO_APP_MODE, RENDER_FIELDS, CANONICAL_FIELDS, copy, project, assertImmutable, semanticDigest, canonicalRenderData, createCandidate, computeSnapshotKey, renderLayoutTag, renderQuestionLayout });
}));
