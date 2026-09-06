/*
 * Canonical contract for the three print engines.
 *
 * This module deliberately contains no DOM, source loading, pagination, or
 * transport code.  It is the executable Phase 0.5 boundary consumed by later
 * Source/Render/Layout/Runtime authorities and their adapters.
 */
(function attachAPPrintContract(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APPrintContract = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function buildAPPrintContract() {
    'use strict';

    const CONTRACT_VERSION = 'ap-print-contract-v2.2';
    const SOURCE_AUTHORITY_KINDS = Object.freeze([
        'ARCHIVE_STANDALONE',
        'ARCHIVE_PREVIEW',
        'MIXED_STORAGE',
        'MIXED_PACK',
        'CLINIC_SERVER_PACKET',
        'CLINIC_SERVER_SET',
        'CLINIC_WP',
        'CLINIC_STORAGE',
        'CLINIC_PARENT_PREVIEW'
    ]);
    const SOURCE_KINDS_BY_ENGINE = Object.freeze({
        archive: Object.freeze(['ARCHIVE_STANDALONE', 'ARCHIVE_PREVIEW']),
        mixer: Object.freeze(['MIXED_STORAGE', 'MIXED_PACK']),
        clinic: Object.freeze([
            'CLINIC_SERVER_PACKET',
            'CLINIC_SERVER_SET',
            'CLINIC_WP',
            'CLINIC_STORAGE',
            'CLINIC_PARENT_PREVIEW'
        ])
    });
    const CANONICAL_RENDER_MODES = Object.freeze(['exam', 'solution', 'answer']);
    const READINESS_STATES = Object.freeze([
        'DATA_READY',
        'MATH_READY',
        'IMAGE_READY',
        'LAYOUT_READY',
        'RENDER_READY',
        'PRINT_READY'
    ]);
    const DUAL_RUN_COMPARISON_FIELDS = Object.freeze([
        'semanticDom',
        'questionCount',
        'imageCount',
        'solutionImageCount',
        'pageMap',
        'columnMembership',
        'continuations',
        'blankPages',
        'qrLocations',
        'recipientBoundaries',
        'sourceIdentity'
    ]);
    const HEADER_PAGE_MODES = new Set(['full', 'running', 'none']);
    const QR_KINDS = new Set(['submit', 'solution', 'recipient-solution', 'none']);
    const QR_PLACEMENTS = new Set(['flow', 'reserved-overlay']);
    const QPP_SOURCES = new Set(['production', 'legacy', 'requested']);
    const PRINT_SOURCES = new Set(['archive', 'mixer', 'clinic']);

    class PrintContractViolation extends Error {
        constructor(code, message, details) {
            super(message);
            this.name = 'PrintContractViolation';
            this.code = code;
            this.details = details || null;
        }
    }

    function fail(code, message, details) {
        throw new PrintContractViolation(code, message, details);
    }

    function isPlainObject(value) {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    function asNonEmptyString(value, field, code) {
        const normalized = typeof value === 'string' ? value.trim() : '';
        if (!normalized) fail(code || 'INVALID_STRING', `${field} must be a non-empty string`, { field, value });
        return normalized;
    }

    function asOptionalString(value, field, code) {
        if (value === undefined || value === null) return undefined;
        return asNonEmptyString(value, field, code);
    }

    function asPositiveInteger(value, field, allowNull) {
        if (allowNull && (value === undefined || value === null)) return null;
        const number = Number(value);
        if (!Number.isInteger(number) || number < 1) {
            fail('INVALID_POSITIVE_INTEGER', `${field} must be a positive integer`, { field, value });
        }
        return number;
    }

    function asFiniteNonNegativeNumber(value, field) {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0) {
            fail('INVALID_NON_NEGATIVE_NUMBER', `${field} must be a finite non-negative number`, { field, value });
        }
        return number;
    }

    function assertKnownSourceKind(kind) {
        if (!SOURCE_AUTHORITY_KINDS.includes(kind)) {
            fail('UNKNOWN_SOURCE_AUTHORITY_KIND', 'source authority kind is not part of the canonical contract', { kind });
        }
        return kind;
    }

    function assertSourceKindForEngine(source, kind) {
        if (!PRINT_SOURCES.has(source)) fail('UNKNOWN_PRINT_SOURCE', 'PrintJob source must be archive, mixer, or clinic', { source });
        assertKnownSourceKind(kind);
        if (!SOURCE_KINDS_BY_ENGINE[source].includes(kind)) {
            fail('SOURCE_AUTHORITY_ENGINE_MISMATCH', 'source authority kind cannot create this engine PrintJob', { source, kind });
        }
    }

    /**
     * Selects the only source that may enter a render transaction.
     * Candidates are deliberately explicit witnesses, not a priority list:
     * future adapters must mark exactly one candidate authoritative.
     */
    function selectAuthoritativeSource(candidates) {
        if (!Array.isArray(candidates)) fail('INVALID_SOURCE_CANDIDATES', 'source candidates must be an array');
        const winners = candidates.filter(candidate => candidate && candidate.authoritative === true);
        if (winners.length !== 1) {
            fail('AUTHORITATIVE_SOURCE_COUNT', 'a render transaction requires exactly one authoritative source', {
                count: winners.length,
                candidates: candidates.map(candidate => candidate && ({
                    kind: candidate.kind,
                    winnerId: candidate.winnerId,
                    authoritative: candidate.authoritative === true
                }))
            });
        }
        return createSourceAuthorityResult(winners[0]);
    }

    function createSourceAuthorityResult(value) {
        if (!isPlainObject(value)) fail('INVALID_SOURCE_AUTHORITY_RESULT', 'source authority result must be an object');
        const kind = assertKnownSourceKind(value.kind);
        const winnerId = asNonEmptyString(value.winnerId, 'winnerId', 'INVALID_SOURCE_WINNER_ID');
        if (value.evidence === undefined || value.evidence === null) {
            fail('MISSING_SOURCE_EVIDENCE', 'source authority result must retain source-selection evidence', { kind, winnerId });
        }
        return Object.freeze({
            kind,
            winnerId,
            evidence: value.evidence,
            fallbackUsed: value.fallbackUsed === true
        });
    }

    /**
     * Canonical identity deliberately has no id/displayNo alias.  The archive
     * locator may be an archive file or another durable source locator such as
     * an assessment-pack provenance key, but it cannot be omitted.
     */
    function createSourceRef(value) {
        if (!isPlainObject(value)) fail('INVALID_SOURCE_REF', 'SourceRef must be an object');
        const sourceQuestionNo = value.sourceQuestionNo === undefined || value.sourceQuestionNo === null
            ? null
            : (typeof value.sourceQuestionNo === 'number'
                ? value.sourceQuestionNo
                : asNonEmptyString(String(value.sourceQuestionNo), 'sourceQuestionNo', 'INVALID_SOURCE_QUESTION_NO'));
        if (typeof sourceQuestionNo === 'number' && !Number.isFinite(sourceQuestionNo)) {
            fail('INVALID_SOURCE_QUESTION_NO', 'sourceQuestionNo must be finite when numeric', { value: value.sourceQuestionNo });
        }
        return Object.freeze({
            sourceArchiveFile: asNonEmptyString(value.sourceArchiveFile, 'sourceArchiveFile', 'MISSING_SOURCE_ARCHIVE_FILE'),
            sourceQuestionUid: asNonEmptyString(value.sourceQuestionUid, 'sourceQuestionUid', 'MISSING_SOURCE_QUESTION_UID'),
            sourceQuestionOrdinal: asPositiveInteger(value.sourceQuestionOrdinal, 'sourceQuestionOrdinal', true),
            sourceQuestionNo
        });
    }

    function sourceRefKey(sourceRef) {
        const ref = createSourceRef(sourceRef);
        return `${ref.sourceArchiveFile}\u0000${ref.sourceQuestionUid}`;
    }

    function sameSourceRef(left, right) {
        return sourceRefKey(left) === sourceRefKey(right);
    }

    function canonicalRenderMode(mode) {
        const aliases = { sol: 'solution', ans: 'answer' };
        const canonical = aliases[mode] || mode;
        if (!CANONICAL_RENDER_MODES.includes(canonical)) {
            fail('INVALID_RENDER_MODE', 'render mode must be exam, solution, or answer; review composes sections', { mode });
        }
        return canonical;
    }

    function createCanonicalQuestion(value) {
        if (!isPlainObject(value)) fail('INVALID_CANONICAL_QUESTION', 'CanonicalQuestion must be an object');
        if (!Object.prototype.hasOwnProperty.call(value, 'sourcePayload')) {
            fail('MISSING_SOURCE_PAYLOAD', 'CanonicalQuestion must retain the original source payload');
        }
        const question = {
            sourceRef: createSourceRef(value.sourceRef),
            displayNo: asPositiveInteger(value.displayNo, 'displayNo'),
            content: typeof value.content === 'string' ? value.content : '',
            choices: Array.isArray(value.choices) ? value.choices.slice() : [],
            answer: value.answer,
            solution: typeof value.solution === 'string' ? value.solution : '',
            sourcePayload: value.sourcePayload
        };
        for (const field of [
            'image', 'imageSize', 'solutionImage', 'solutionImageAlt',
            'solutionImageCaption', 'solutionImageSize', 'layoutTag'
        ]) {
            const normalized = asOptionalString(value[field], field, 'INVALID_CANONICAL_QUESTION_FIELD');
            if (normalized !== undefined) question[field] = normalized;
        }
        if (value.choiceColumns !== undefined && value.choiceColumns !== null) {
            question.choiceColumns = asPositiveInteger(value.choiceColumns, 'choiceColumns');
        }
        if (value.wide !== undefined) question.wide = value.wide === true;
        return Object.freeze(question);
    }

    function createHeaderPolicy(value) {
        if (!isPlainObject(value)) fail('INVALID_HEADER_POLICY', 'headerPolicy must be an object');
        const firstPage = value.firstPage || 'full';
        const continuationPage = value.continuationPage || 'running';
        if (!HEADER_PAGE_MODES.has(firstPage) || !HEADER_PAGE_MODES.has(continuationPage)) {
            fail('INVALID_HEADER_PAGE_MODE', 'header page modes must be full, running, or none', { firstPage, continuationPage });
        }
        const policy = {
            title: asNonEmptyString(value.title, 'headerPolicy.title', 'MISSING_HEADER_TITLE'),
            firstPage,
            continuationPage
        };
        for (const field of ['subtitle']) {
            const normalized = asOptionalString(value[field], `headerPolicy.${field}`, 'INVALID_HEADER_POLICY');
            if (normalized !== undefined) policy[field] = normalized;
        }
        for (const field of ['showDate', 'showRecipient', 'showScore']) {
            if (value[field] !== undefined) policy[field] = value[field] === true;
        }
        return Object.freeze(policy);
    }

    function createQrPolicy(value) {
        if (!isPlainObject(value)) fail('INVALID_QR_POLICY', 'qrPolicy must be an object');
        const enabled = value.enabled === true;
        const kind = value.kind || (enabled ? null : 'none');
        const placement = value.placement || 'flow';
        if (!QR_KINDS.has(kind)) fail('INVALID_QR_KIND', 'qrPolicy.kind is invalid', { kind });
        if (!QR_PLACEMENTS.has(placement)) fail('INVALID_QR_PLACEMENT', 'qrPolicy.placement is invalid', { placement });
        if (enabled && kind === 'none') fail('INVALID_QR_POLICY', 'enabled qrPolicy cannot use kind none');
        if (!enabled && kind !== 'none') fail('INVALID_QR_POLICY', 'disabled qrPolicy must use kind none');
        const targetUrl = asOptionalString(value.targetUrl, 'qrPolicy.targetUrl', 'INVALID_QR_TARGET_URL');
        return Object.freeze({ enabled, kind, placement, ...(targetUrl ? { targetUrl } : {}) });
    }

    function createDuplexPolicy(value) {
        if (!isPlainObject(value)) fail('INVALID_DUPLEX_POLICY', 'duplexPolicy must be an object');
        return Object.freeze({
            enabled: value.enabled === true,
            breakBetweenRecipients: value.breakBetweenRecipients === true,
            ensureNextRecipientFrontSide: value.ensureNextRecipientFrontSide === true,
            trailingBlankAllowed: value.trailingBlankAllowed === true
        });
    }

    function createQppPolicy(value) {
        if (!isPlainObject(value)) fail('INVALID_QPP_POLICY', 'qppPolicy must be an object');
        const allowed = Array.from(new Set((value.allowed || []).map(item => asPositiveInteger(item, 'qppPolicy.allowed item'))));
        if (!allowed.length) fail('EMPTY_QPP_POLICY', 'qppPolicy.allowed must contain at least one value');
        const defaultValue = asPositiveInteger(value.default, 'qppPolicy.default');
        if (!allowed.includes(defaultValue)) fail('QPP_DEFAULT_NOT_ALLOWED', 'qppPolicy.default must be in qppPolicy.allowed', { allowed, defaultValue });
        if (!QPP_SOURCES.has(value.source)) fail('INVALID_QPP_SOURCE', 'qppPolicy.source must be production, legacy, or requested', { source: value.source });
        return Object.freeze({ allowed: Object.freeze(allowed), default: defaultValue, editable: value.editable === true, source: value.source });
    }

    function createLayoutPolicy(value) {
        if (!isPlainObject(value)) fail('INVALID_LAYOUT_POLICY', 'layoutPolicy must be an object');
        const pageSize = asNonEmptyString(value.pageSize, 'layoutPolicy.pageSize', 'MISSING_LAYOUT_PAGE_SIZE');
        const orientation = value.orientation || 'portrait';
        if (!['portrait', 'landscape'].includes(orientation)) fail('INVALID_LAYOUT_ORIENTATION', 'layoutPolicy.orientation must be portrait or landscape', { orientation });
        return Object.freeze({
            pageSize,
            orientation,
            columns: asPositiveInteger(value.columns, 'layoutPolicy.columns')
        });
    }

    function createFlowExtension(value) {
        if (!isPlainObject(value)) fail('INVALID_FLOW_EXTENSION', 'flow extension must be an object');
        if (value.measuredBeforePagination !== true || value.participatesInFlow !== true) {
            fail('INVALID_FLOW_EXTENSION', 'flow extension must be measured before pagination and participate in flow', { value });
        }
        return Object.freeze({
            id: asNonEmptyString(value.id, 'flowExtension.id', 'INVALID_FLOW_EXTENSION'),
            kind: asNonEmptyString(value.kind, 'flowExtension.kind', 'INVALID_FLOW_EXTENSION'),
            measuredBeforePagination: true,
            participatesInFlow: true
        });
    }

    function createOverlayExtension(value) {
        if (!isPlainObject(value) || !isPlainObject(value.reservedRect)) {
            fail('INVALID_OVERLAY_EXTENSION', 'overlay extension requires a reservedRect object');
        }
        if (value.canReflow !== false) {
            fail('INVALID_OVERLAY_EXTENSION', 'overlay extension cannot reflow page content');
        }
        const rect = value.reservedRect;
        return Object.freeze({
            id: asNonEmptyString(value.id, 'overlayExtension.id', 'INVALID_OVERLAY_EXTENSION'),
            kind: asNonEmptyString(value.kind, 'overlayExtension.kind', 'INVALID_OVERLAY_EXTENSION'),
            reservedRect: Object.freeze({
                x: asFiniteNonNegativeNumber(rect.x, 'overlayExtension.reservedRect.x'),
                y: asFiniteNonNegativeNumber(rect.y, 'overlayExtension.reservedRect.y'),
                width: asFiniteNonNegativeNumber(rect.width, 'overlayExtension.reservedRect.width'),
                height: asFiniteNonNegativeNumber(rect.height, 'overlayExtension.reservedRect.height')
            }),
            canReflow: false
        });
    }

    function createPrintSection(value) {
        if (!isPlainObject(value)) fail('INVALID_PRINT_SECTION', 'PrintSection must be an object');
        const questions = (value.questions || []).map(createCanonicalQuestion);
        const seenRefs = new Set();
        for (const question of questions) {
            const key = sourceRefKey(question.sourceRef);
            if (seenRefs.has(key)) fail('DUPLICATE_SECTION_SOURCE_REF', 'PrintSection cannot contain a duplicated canonical source reference', { sectionId: value.sectionId, key });
            seenRefs.add(key);
        }
        const recipient = value.recipient === undefined ? null : value.recipient;
        if (recipient !== null && !isPlainObject(recipient)) fail('INVALID_RECIPIENT_REF', 'recipient must be null or an object');
        return Object.freeze({
            sectionId: asNonEmptyString(value.sectionId, 'sectionId', 'MISSING_SECTION_ID'),
            renderMode: canonicalRenderMode(value.renderMode),
            questions: Object.freeze(questions),
            recipient,
            headerPolicy: createHeaderPolicy(value.headerPolicy),
            qrPolicy: createQrPolicy(value.qrPolicy),
            duplexPolicy: createDuplexPolicy(value.duplexPolicy),
            qppPolicy: createQppPolicy(value.qppPolicy),
            layoutPolicy: createLayoutPolicy(value.layoutPolicy),
            flowExtensions: Object.freeze((value.flowExtensions || []).map(createFlowExtension)),
            overlayExtensions: Object.freeze((value.overlayExtensions || []).map(createOverlayExtension))
        });
    }

    function createReviewSections(answerSection, solutionSection) {
        const answer = createPrintSection(answerSection);
        const solution = createPrintSection(solutionSection);
        if (answer.renderMode !== 'answer' || solution.renderMode !== 'solution') {
            fail('INVALID_REVIEW_COMPOSITION', 'review must be composed as an answer section followed by a solution section');
        }
        return Object.freeze([answer, solution]);
    }

    function createRuntimePolicy(value) {
        if (!isPlainObject(value)) fail('INVALID_RUNTIME_POLICY', 'runtimePolicy must be an object');
        const requiredStates = value.requiredStates || READINESS_STATES;
        const normalized = requiredStates.map(state => {
            if (!READINESS_STATES.includes(state)) fail('INVALID_READINESS_STATE', 'runtimePolicy has an unknown readiness state', { state });
            return state;
        });
        if (normalized.join('|') !== READINESS_STATES.join('|')) {
            fail('INCOMPLETE_RUNTIME_POLICY', 'runtimePolicy.requiredStates must preserve the canonical readiness sequence', { requiredStates: normalized });
        }
        return Object.freeze({ requiredStates: Object.freeze(normalized) });
    }

    function createCapabilitySnapshot(value) {
        if (!isPlainObject(value)) fail('INVALID_CAPABILITY_SNAPSHOT', 'capabilitySnapshot must be an object');
        const adapter = asNonEmptyString(value.adapter, 'capabilitySnapshot.adapter', 'MISSING_CAPABILITY_ADAPTER');
        const transportCapabilities = Array.from(new Set((value.transportCapabilities || []).map(capability => asNonEmptyString(capability, 'transport capability', 'INVALID_TRANSPORT_CAPABILITY'))));
        if (!transportCapabilities.length) fail('MISSING_TRANSPORT_CAPABILITY', 'capabilitySnapshot needs at least one transport capability');
        return Object.freeze({ adapter, transportCapabilities: Object.freeze(transportCapabilities) });
    }

    function createPrintJob(value) {
        if (!isPlainObject(value)) fail('INVALID_PRINT_JOB', 'PrintJob must be an object');
        const source = value.source;
        const sourceAuthority = createSourceAuthorityResult(value.sourceAuthority);
        assertSourceKindForEngine(source, sourceAuthority.kind);
        const sections = (value.sections || []).map(createPrintSection);
        if (!sections.length) fail('EMPTY_PRINT_JOB', 'PrintJob requires at least one PrintSection');
        const sectionIds = new Set();
        for (const section of sections) {
            if (sectionIds.has(section.sectionId)) fail('DUPLICATE_SECTION_ID', 'PrintJob cannot contain duplicate section IDs', { sectionId: section.sectionId });
            sectionIds.add(section.sectionId);
        }
        return Object.freeze({
            jobId: asNonEmptyString(value.jobId, 'jobId', 'MISSING_PRINT_JOB_ID'),
            sourceAuthority,
            source,
            sections: Object.freeze(sections),
            runtimePolicy: createRuntimePolicy(value.runtimePolicy),
            capabilitySnapshot: createCapabilitySnapshot(value.capabilitySnapshot)
        });
    }

    function callAssetResolver(resolveAssetUrl, assetRef, question, sourceRef) {
        if (typeof resolveAssetUrl !== 'function') fail('MISSING_ASSET_RESOLVER', 'render authority must receive resolveAssetUrl from its adapter');
        const canonicalQuestion = createCanonicalQuestion(question);
        const canonicalSourceRef = createSourceRef(sourceRef || canonicalQuestion.sourceRef);
        const result = resolveAssetUrl(assetRef, canonicalQuestion, canonicalSourceRef);
        if (typeof result !== 'string' || !result.trim()) {
            fail('INVALID_ASSET_RESOLVER_RESULT', 'resolveAssetUrl must return a non-empty URL string', { assetRef, result });
        }
        return result;
    }

    function createPageMap(value) {
        if (!isPlainObject(value) || !Array.isArray(value.pages)) fail('INVALID_PAGE_MAP', 'PageMap requires a pages array');
        const seenPages = new Set();
        const pages = value.pages.map(page => {
            if (!isPlainObject(page)) fail('INVALID_PAGE_MAP_PAGE', 'PageMap page must be an object');
            const pageNo = asPositiveInteger(page.pageNo, 'PageMap.pageNo');
            if (seenPages.has(pageNo)) fail('DUPLICATE_PAGE_NUMBER', 'PageMap cannot contain duplicate page numbers', { pageNo });
            seenPages.add(pageNo);
            const refs = (page.questionSourceRefs || []).map(createSourceRef);
            const displayNos = (page.displayNos || []).map(displayNo => asPositiveInteger(displayNo, 'PageMap.displayNo'));
            if (refs.length !== displayNos.length) fail('PAGEMAP_QUESTION_DISPLAY_MISMATCH', 'questionSourceRefs and displayNos must have the same length', { pageNo });
            return Object.freeze({
                pageNo,
                sectionId: asNonEmptyString(page.sectionId, 'PageMap.sectionId', 'MISSING_PAGEMAP_SECTION_ID'),
                recipientId: page.recipientId === undefined || page.recipientId === null ? null : asNonEmptyString(String(page.recipientId), 'PageMap.recipientId', 'INVALID_RECIPIENT_ID'),
                questionSourceRefs: Object.freeze(refs),
                displayNos: Object.freeze(displayNos),
                continuations: Object.freeze((page.continuations || []).map(value => asNonEmptyString(value, 'PageMap.continuation', 'INVALID_CONTINUATION'))),
                hasBlankPage: page.hasBlankPage === true
            });
        });
        return Object.freeze({ pages: Object.freeze(pages) });
    }

    function assertPageMapIntegrity(pageMapInput, sectionsInput) {
        const pageMap = createPageMap(pageMapInput);
        const sections = sectionsInput.map(createPrintSection);
        const expected = new Set();
        for (const section of sections) {
            for (const question of section.questions) expected.add(`${section.sectionId}\u0000${sourceRefKey(question.sourceRef)}`);
        }
        const observed = new Set();
        for (const page of pageMap.pages) {
            for (const ref of page.questionSourceRefs) {
                const key = `${page.sectionId}\u0000${sourceRefKey(ref)}`;
                if (!expected.has(key)) fail('PAGEMAP_UNEXPECTED_SOURCE_REF', 'PageMap contains a source reference not present in its section', { pageNo: page.pageNo, key });
                if (observed.has(key)) fail('PAGEMAP_DUPLICATE_SOURCE_REF', 'PageMap contains a duplicated source reference', { pageNo: page.pageNo, key });
                observed.add(key);
            }
        }
        const missing = Array.from(expected).filter(key => !observed.has(key));
        if (missing.length) fail('PAGEMAP_MISSING_SOURCE_REF', 'PageMap omitted canonical source references', { missing });
        return Object.freeze({ expectedCount: expected.size, observedCount: observed.size, omissionCount: 0, duplicationCount: 0 });
    }

    function createReadinessEvidence(events) {
        if (!Array.isArray(events)) fail('INVALID_READINESS_EVIDENCE', 'readiness events must be an array');
        if (events.length !== READINESS_STATES.length) fail('INCOMPLETE_READINESS_EVIDENCE', 'readiness evidence must contain every canonical state exactly once', { events });
        const normalized = events.map((event, index) => {
            if (!isPlainObject(event) || event.state !== READINESS_STATES[index] || event.evidence === undefined || event.evidence === null) {
                fail('INVALID_READINESS_TRANSITION', 'readiness transitions must follow the canonical order and retain evidence', { event, index });
            }
            return Object.freeze({ state: event.state, evidence: event.evidence });
        });
        return Object.freeze(normalized);
    }

    return Object.freeze({
        CONTRACT_VERSION,
        SOURCE_AUTHORITY_KINDS,
        SOURCE_KINDS_BY_ENGINE,
        CANONICAL_RENDER_MODES,
        READINESS_STATES,
        DUAL_RUN_COMPARISON_FIELDS,
        PrintContractViolation,
        selectAuthoritativeSource,
        createSourceAuthorityResult,
        createSourceRef,
        sourceRefKey,
        sameSourceRef,
        canonicalRenderMode,
        createCanonicalQuestion,
        createHeaderPolicy,
        createQrPolicy,
        createDuplexPolicy,
        createQppPolicy,
        createLayoutPolicy,
        createFlowExtension,
        createOverlayExtension,
        createPrintSection,
        createReviewSections,
        createRuntimePolicy,
        createCapabilitySnapshot,
        createPrintJob,
        callAssetResolver,
        createPageMap,
        assertPageMapIntegrity,
        createReadinessEvidence
    });
}));
