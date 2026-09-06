/*
 * Phase 1A — pure source-to-canonical normalization.
 *
 * This module does not read storage, fetch a source, touch the DOM, resolve an
 * asset URL, or paginate. Source adapters supply the already-selected source
 * and this module creates immutable canonical objects for later authorities.
 */
(function attachRenderAuthority(root, factory) {
    const contract = typeof module === 'object' && module.exports
        ? require('./print-contract.js')
        : root && root.APPrintContract;
    const api = factory(contract);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APRenderAuthority = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function buildRenderAuthority(C) {
    'use strict';

    const VERSION = 'ap-render-authority-v2.2-phase1a';

    function requireContract() {
        if (!C) throw new Error('APPrintContract must load before APRenderAuthority');
        return C;
    }

    function text(value) {
        return value === undefined || value === null ? '' : String(value);
    }

    function firstPresent(source, fields) {
        for (const field of fields) {
            const value = source && source[field];
            if (value !== undefined && value !== null && text(value).trim() !== '') return value;
        }
        return undefined;
    }

    function positiveInteger(value) {
        const number = Number(value);
        return Number.isInteger(number) && number > 0 ? number : null;
    }

    function sourceFile(raw, options) {
        const value = firstPresent(raw, [
            'sourceArchiveFile', 'source_archive_file', '_sourceArchiveFile',
            '_sourceFile', 'archiveFile', '_archiveFile'
        ]) || options.sourceArchiveFile;
        const normalized = text(value).trim();
        if (!normalized) throw new Error('MISSING_SOURCE_ARCHIVE_FILE');
        return normalized;
    }

    function sourceOrdinal(raw, index) {
        return positiveInteger(firstPresent(raw, [
            'sourceQuestionOrdinal', 'source_question_ordinal', '_sourceQuestionOrdinal',
            'sourceOrdinal', 'source_ordinal'
        ])) || index + 1;
    }

    function sourceQuestionNo(raw) {
        const value = firstPresent(raw, [
            'sourceQuestionNo', 'source_question_no', '_sourceQuestionNo',
            'questionNo', 'question_no', '_sourceNo'
        ]);
        if (value === undefined) return null;
        const numeric = Number(value);
        return Number.isFinite(numeric) && text(value).trim() !== '' ? numeric : text(value).trim();
    }

    function sourceUid(raw, archiveFile, ordinal) {
        const known = firstPresent(raw, [
            'sourceQuestionUid', 'source_question_uid', '_sourceQuestionUid',
            'questionUid', 'question_uid'
        ]);
        // A deterministic legacy UID is provenance-derived. It intentionally
        // does not use id, displayNo, or sourceQuestionNo as an identity alias.
        return known === undefined ? `legacy:${archiveFile}#ordinal:${ordinal}` : text(known).trim();
    }

    function optionalString(raw, field) {
        const value = raw && raw[field];
        return value === undefined || value === null || text(value).trim() === '' ? undefined : text(value).trim();
    }

    function normalizedChoices(raw) {
        const choices = Array.isArray(raw && raw.choices)
            ? raw.choices
            : (Array.isArray(raw && raw.options) ? raw.options : []);
        return choices.slice();
    }

    function normalizerProfile(kind) {
        if (!['archive', 'mixer', 'clinic'].includes(kind)) throw new Error(`UNKNOWN_NORMALIZER_KIND:${kind}`);
        return kind;
    }

    function normalizeQuestion(kind, rawQuestion, index, options) {
        const contract = requireContract();
        normalizerProfile(kind);
        const raw = rawQuestion && typeof rawQuestion === 'object' ? rawQuestion : {};
        const archiveFile = sourceFile(raw, options);
        const ordinal = sourceOrdinal(raw, index);
        const question = {
            sourceRef: {
                sourceArchiveFile: archiveFile,
                sourceQuestionUid: sourceUid(raw, archiveFile, ordinal),
                sourceQuestionOrdinal: ordinal,
                sourceQuestionNo: sourceQuestionNo(raw)
            },
            displayNo: positiveInteger(options.displayStart) ? options.displayStart + index : index + 1,
            content: text(firstPresent(raw, ['content', 'question', 'text', 'prompt'])),
            choices: normalizedChoices(raw),
            answer: firstPresent(raw, ['answer', 'correctAnswer', 'correct', 'ans']),
            solution: text(firstPresent(raw, ['solution', 'explanation', 'commentary', 'sol'])),
            sourcePayload: rawQuestion
        };

        const image = firstPresent(raw, ['image', 'imageUrl', 'img', 'imageTag', 'imagePath', 'image_path']);
        if (image !== undefined) question.image = text(image).trim();
        for (const field of ['imageSize', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'layoutTag']) {
            const value = optionalString(raw, field);
            if (value !== undefined) question[field] = value;
        }
        const choiceColumns = positiveInteger(raw.choiceColumns);
        if (choiceColumns) question.choiceColumns = choiceColumns;
        if (raw.wide !== undefined) question.wide = raw.wide === true;
        return contract.createCanonicalQuestion(question);
    }

    function normalizeQuestions(kind, rawQuestions, options) {
        if (!Array.isArray(rawQuestions)) throw new Error('RAW_QUESTIONS_MUST_BE_ARRAY');
        const config = options || {};
        return Object.freeze(rawQuestions.map((raw, index) => normalizeQuestion(kind, raw, index, config)));
    }

    function normalizeArchiveQuestions(rawQuestions, options) {
        return normalizeQuestions('archive', rawQuestions, options || {});
    }

    function normalizeMixedQuestions(rawQuestions, options) {
        return normalizeQuestions('mixer', rawQuestions, options || {});
    }

    function normalizeClinicQuestions(rawQuestions, options) {
        return normalizeQuestions('clinic', rawQuestions, options || {});
    }

    function createPrintJobFromRaw(kind, input) {
        const contract = requireContract();
        const config = input || {};
        const questions = normalizeQuestions(kind, config.rawQuestions, {
            sourceArchiveFile: config.sourceArchiveFile,
            displayStart: config.displayStart
        });
        const section = {
            sectionId: config.sectionId || `${kind}-section`,
            renderMode: config.renderMode || 'exam',
            questions,
            recipient: config.recipient === undefined ? null : config.recipient,
            headerPolicy: config.headerPolicy,
            qrPolicy: config.qrPolicy,
            duplexPolicy: config.duplexPolicy,
            qppPolicy: config.qppPolicy,
            layoutPolicy: config.layoutPolicy,
            flowExtensions: config.flowExtensions || [],
            overlayExtensions: config.overlayExtensions || []
        };
        return contract.createPrintJob({
            jobId: config.jobId,
            sourceAuthority: config.sourceAuthority,
            source: kind,
            sections: [section],
            runtimePolicy: config.runtimePolicy || {},
            capabilitySnapshot: config.capabilitySnapshot
        });
    }

    function createArchivePrintJob(input) {
        return createPrintJobFromRaw('archive', input);
    }

    function createMixedPrintJob(input) {
        return createPrintJobFromRaw('mixer', input);
    }

    function createClinicPrintJob(input) {
        return createPrintJobFromRaw('clinic', input);
    }

    return Object.freeze({
        VERSION,
        normalizeArchiveQuestions,
        normalizeMixedQuestions,
        normalizeClinicQuestions,
        createArchivePrintJob,
        createMixedPrintJob,
        createClinicPrintJob
    });
}));
