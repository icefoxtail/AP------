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

    function extractChoice(choice) {
        if (choice === undefined || choice === null) return '';
        if (typeof choice === 'object') return text(choice.text || choice.content || choice.value || choice.answer || Object.values(choice)[0]);
        return text(choice);
    }

    function stripChoicePrefix(value) {
        return text(value).replace(/^\s*(?:[①②③④⑤⑥⑦⑧⑨⑩]|\(?\d+\)|\d+\.(?!\d))\s*/, '').trim();
    }

    function choiceRenderMode(choices, choiceColumns) {
        if (positiveInteger(choiceColumns)) return 'grid';
        const texts = choices.map(choice => stripChoicePrefix(extractChoice(choice)));
        const stripped = texts.map(value => value.replace(/\$\$[\s\S]*?\$\$/g, '~').replace(/\$[^$\n]*?\$/g, '~').trim());
        const average = stripped.reduce((sum, value) => sum + value.length, 0) / Math.max(stripped.length, 1);
        const hasMarkers = texts.some(value => (value.match(/[ㄱㄴㄷㄹㅁ]\.|㉠|㉡|㉢|㉣|㉤/g) || []).length >= 2);
        if (hasMarkers) return 'boxed';
        if (stripped.some(value => value.length > 36) || texts.some(value => /\n|<br/i.test(value)) || average > 28) return 'block';
        return stripped.some(value => value.length > 20) ? 'block' : 'compact';
    }

    function renderChoicesHTML(question, format) {
        const choices = Array.isArray(question.choices) ? question.choices : [];
        if (!choices.length || choices[0] === '주관식' || choices.every(choice => !extractChoice(choice).trim())) return '<div class="answer-box"></div>';
        const circled = ['①', '②', '③', '④', '⑤'];
        const mode = choiceRenderMode(choices, question.choiceColumns);
        const style = mode === 'grid' ? ` style="grid-template-columns:repeat(${question.choiceColumns}, minmax(0, 1fr))"` : '';
        const items = choices.map((choice, index) => `<div class="choice-item"><span class="choice-no">${circled[index] || ''}</span><span class="choice-text">${format(stripChoicePrefix(extractChoice(choice)))}</span></div>`).join('');
        return `<div class="choices choices-${mode}"${style}>${items}</div>`;
    }

    function renderImageHTML(question, field, className, options) {
        const assetRef = question[field];
        if (!assetRef) return '';
        const resolve = options.resolveAssetUrl;
        if (typeof resolve !== 'function') throw new Error('MISSING_ASSET_RESOLVER');
        const url = requireContract().callAssetResolver(resolve, assetRef, question, question.sourceRef);
        const sizeField = field === 'solutionImage' ? 'solutionImageSize' : 'imageSize';
        const size = optionalString(question, sizeField);
        const sizeClass = size ? ` image-${size}` : '';
        const alt = field === 'solutionImage' ? optionalString(question, 'solutionImageAlt') || `문항 ${question.displayNo} 해설 그래프` : '';
        const caption = field === 'solutionImage' && question.solutionImageCaption
            ? `<span class="sol-image-caption">${question.solutionImageCaption}</span>`
            : '';
        return `<${field === 'solutionImage' ? 'span' : 'div'} class="${className}${sizeClass}"><img src="${url}" alt="${alt}">${caption}</${field === 'solutionImage' ? 'span' : 'div'}>`;
    }

    function renderQuestionHTML(inputQuestion, options) {
        const contract = requireContract();
        const question = contract.createCanonicalQuestion(inputQuestion);
        const config = options || {};
        const mode = contract.canonicalRenderMode(config.mode || 'exam');
        const format = typeof config.wrapLatex === 'function' ? config.wrapLatex : value => text(value);
        const content = format(question.content);
        const image = renderImageHTML(question, 'image', 'q-image-wrap', config);
        const choices = mode === 'exam' ? renderChoicesHTML(question, format) : '';
        const answer = mode === 'answer' ? `<div class="sol-ans">[정답] ${format(question.answer === undefined || question.answer === null ? '-' : question.answer)}</div>` : '';
        const solution = mode === 'solution'
            ? `<div class="sol-meta"><div class="sol-ans">[정답] ${format(question.answer === undefined || question.answer === null ? '-' : question.answer)}</div>${renderImageHTML(question, 'solutionImage', 'sol-image-wrap', config)}<div class="sol-exp">${format(question.solution || '해설이 없습니다.')}</div></div>`
            : '';
        return `<article class="q-box" data-source-ref="${question.sourceRef.sourceArchiveFile}#${question.sourceRef.sourceQuestionUid}"><div class="q-num">${question.displayNo}.</div><div class="q-content">${content}</div>${image}${choices}${answer}${solution}</article>`;
    }

    function semanticSnapshot(html) {
        const source = text(html);
        const count = pattern => (source.match(pattern) || []).length;
        return Object.freeze({
            questionCount: count(/class="q-box(?:\s|"|$)/g),
            contentCount: count(/class="q-content"/g),
            choiceCount: count(/class="choice-item"/g),
            questionImageCount: count(/class="q-image-wrap(?:\s|"|$)/g),
            solutionImageCount: count(/class="sol-image-wrap(?:\s|"|$)/g),
            answerCount: count(/class="sol-ans"/g),
            solutionCount: count(/class="sol-exp"/g)
        });
    }

    function compareQuestionSemantics(legacyHtml, authorityHtml) {
        const legacy = semanticSnapshot(legacyHtml);
        const authority = semanticSnapshot(authorityHtml);
        const differences = Object.keys(legacy).filter(key => legacy[key] !== authority[key]).map(key => ({ key, legacy: legacy[key], authority: authority[key] }));
        return Object.freeze({ equal: differences.length === 0, legacy, authority, differences: Object.freeze(differences) });
    }

    return Object.freeze({
        VERSION,
        normalizeArchiveQuestions,
        normalizeMixedQuestions,
        normalizeClinicQuestions,
        createArchivePrintJob,
        createMixedPrintJob,
        createClinicPrintJob,
        renderQuestionHTML,
        semanticSnapshot,
        compareQuestionSemantics
    });
}));
