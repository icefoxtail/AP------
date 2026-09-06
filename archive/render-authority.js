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
        const adapterIdentity = typeof options.resolveSourceRef === 'function'
            ? (options.resolveSourceRef(raw, index) || {})
            : {};
        const identity = { ...raw, ...adapterIdentity };
        const archiveFile = sourceFile(identity, options);
        const ordinal = sourceOrdinal(identity, index);
        const question = {
            sourceRef: {
                sourceArchiveFile: archiveFile,
                sourceQuestionUid: sourceUid(identity, archiveFile, ordinal),
                sourceQuestionOrdinal: ordinal,
                sourceQuestionNo: sourceQuestionNo(identity)
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
            displayStart: config.displayStart,
            resolveSourceRef: config.resolveSourceRef
        });
        const section = {
            sectionId: config.sectionId || `${kind}-section`,
            renderMode: config.renderMode || 'exam',
            questions,
            recipient: config.recipient === undefined ? null : config.recipient,
            headerPolicy: config.headerPolicy,
            qrPolicy: config.qrPolicy,
            qrPolicies: config.qrPolicies,
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

    function escapeHtmlAttribute(value) {
        return text(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
        return `<${field === 'solutionImage' ? 'span' : 'div'} class="${className}${sizeClass}"><img src="${escapeHtmlAttribute(url)}" alt="${escapeHtmlAttribute(alt)}">${caption}</${field === 'solutionImage' ? 'span' : 'div'}>`;
    }

    function renderQuestionHTML(inputQuestion, options) {
        const contract = requireContract();
        const question = contract.createCanonicalQuestion(inputQuestion);
        const config = options || {};
        const mode = contract.canonicalRenderMode(config.mode || 'exam');
        const format = typeof config.wrapLatex === 'function' ? config.wrapLatex : value => text(value);
        const content = typeof config.prepareContent === 'function'
            ? config.prepareContent(question, format)
            : format(question.content);
        const image = mode === 'exam' ? renderImageHTML(question, 'image', 'q-image-wrap', config) : '';
        const choices = mode === 'exam' ? renderChoicesHTML(question, format) : '';
        const answer = mode === 'answer' ? `<div class="sol-ans">[정답] ${format(question.answer === undefined || question.answer === null ? '-' : question.answer)}</div>` : '';
        const preparedSolution = typeof config.prepareSolution === 'function'
            ? config.prepareSolution(question, format)
            : format(question.solution || '해설이 없습니다.');
        const solution = mode === 'solution'
            ? `<div class="sol-meta"><div class="sol-ans">[정답] ${format(question.answer === undefined || question.answer === null ? '-' : question.answer)}</div>${renderImageHTML(question, 'solutionImage', 'sol-image-wrap', config)}<div class="sol-exp">${preparedSolution}</div></div>`
            : '';
        const contentClass = mode === 'solution' && config.solutionContentClass !== 'q-content'
            ? ' data-semantic-content="1"'
            : ' class="q-content"';
        const boxClass = mode === 'solution' ? 'q-box sol-box' : 'q-box';
        return `<div class="${boxClass}" data-source-ref="${question.sourceRef.sourceArchiveFile}#${question.sourceRef.sourceQuestionUid}"><div class="q-num">${question.displayNo}.</div><div${contentClass}>${content}</div>${image}${choices}${answer}${solution}</div>`;
    }

    function renderAnswerEntryHTML(inputQuestion, options) {
        const question = requireContract().createCanonicalQuestion(inputQuestion);
        const config = options || {};
        const format = typeof config.formatAnswer === 'function' ? config.formatAnswer : value => text(value);
        const answer = question.answer === undefined || question.answer === null ? '-' : question.answer;
        return `<div class="ans-cell" data-source-ref="${question.sourceRef.sourceArchiveFile}#${question.sourceRef.sourceQuestionUid}"><div class="ans-n">${question.displayNo}.</div><div class="ans-v">${format(answer)}</div></div>`;
    }

    function normalizeSemanticText(value) {
        return text(value).replace(/\s+/g, ' ').trim();
    }

    function fnv1a(value) {
        let hash = 0x811c9dc5;
        for (let index = 0; index < value.length; index++) {
            hash ^= value.charCodeAt(index);
            hash = Math.imul(hash, 0x01000193) >>> 0;
        }
        return hash.toString(16).padStart(8, '0');
    }

    function semanticClassNames(element) {
        return Array.from(element.classList || []).filter(name => /^(?:q-|choices|choice-|sol-|answer-box|question-(?:note|table))/.test(name)).sort();
    }

    function semanticMarkup(element) {
        if (!element) return '';
        const clone = element.cloneNode(true);
        clone.querySelectorAll('mjx-container').forEach(node => node.replaceWith(document.createTextNode(node.textContent || '')));
        clone.querySelectorAll('*').forEach(node => {
            Array.from(node.attributes).forEach(attribute => {
                if (!['class', 'colspan', 'rowspan', 'src', 'alt'].includes(attribute.name.toLowerCase())) node.removeAttribute(attribute.name);
            });
        });
        return normalizeSemanticText(clone.innerHTML);
    }

    function domFingerprint(html) {
        const template = document.createElement('template');
        template.innerHTML = text(html);
        const root = template.content;
        const questions = Array.from(root.querySelectorAll('.q-box')).map(question => {
            const content = question.querySelector('.q-content');
            const choiceItems = Array.from(question.querySelectorAll('.choice-item'));
            const questionImages = Array.from(question.querySelectorAll('.q-image-wrap img'));
            const solutionImages = Array.from(question.querySelectorAll('.sol-image-wrap img'));
            const tables = Array.from(question.querySelectorAll('table')).map(table => ({
                classNames: semanticClassNames(table),
                rows: Array.from(table.rows || []).map(row => Array.from(row.cells || []).map(cell => ({ text: normalizeSemanticText(cell.textContent), colSpan: cell.colSpan, rowSpan: cell.rowSpan })))
            }));
            const classes = Array.from(question.querySelectorAll('[class]')).map(element => ({ tag: element.tagName.toLowerCase(), classNames: semanticClassNames(element) })).filter(item => item.classNames.length);
            return {
                sourceRef: question.getAttribute('data-source-ref') || '',
                classes,
                content: content ? normalizeSemanticText(content.textContent) : '',
                contentMarkup: semanticMarkup(content),
                choices: choiceItems.map(item => ({
                    classNames: semanticClassNames(item),
                    number: normalizeSemanticText(item.querySelector('.choice-no')?.textContent),
                    text: normalizeSemanticText(item.querySelector('.choice-text')?.textContent)
                })),
                answers: Array.from(question.querySelectorAll('.sol-ans')).map(element => normalizeSemanticText(element.textContent)),
                solutions: Array.from(question.querySelectorAll('.sol-exp')).map(element => normalizeSemanticText(element.textContent)),
                questionImages: questionImages.map(image => ({ src: image.getAttribute('src') || '', alt: image.getAttribute('alt') || '' })),
                solutionImages: solutionImages.map(image => ({ src: image.getAttribute('src') || '', alt: image.getAttribute('alt') || '', caption: normalizeSemanticText(image.closest('.sol-image-wrap')?.querySelector('.sol-image-caption')?.textContent) })),
                tables,
                viewBlocks: Array.from(question.querySelectorAll('.question-note-box')).map(element => normalizeSemanticText(element.textContent))
            };
        });
        return questions;
    }

    function lexicalMatches(source, expression) {
        return Array.from(text(source).matchAll(expression)).map(match => normalizeSemanticText(match[1] || ''));
    }

    function lexicalFingerprint(html) {
        const source = text(html);
        const attrs = expression => Array.from(source.matchAll(expression)).map(match => match[1] || '');
        return [{
            semanticMarkup: normalizeSemanticText(source),
            sourceRef: attrs(/data-source-ref="([^"]*)"/g).join('|'),
            classes: attrs(/<([a-z0-9]+)[^>]*class="([^"]*(?:q-|choices|choice-|sol-|answer-box|question-(?:note|table))[^"]*)"[^>]*>/gi).map((_, index) => index),
            content: lexicalMatches(source, /class="[^"]*q-content[^"]*"[^>]*>([\s\S]*?)<\//gi),
            contentMarkup: lexicalMatches(source, /class="[^"]*q-content[^"]*"[^>]*>([\s\S]*?)<\//gi),
            choices: lexicalMatches(source, /class="[^"]*choice-text[^"]*"[^>]*>([\s\S]*?)<\//gi),
            answers: lexicalMatches(source, /class="[^"]*sol-ans[^"]*"[^>]*>([\s\S]*?)<\//gi),
            solutions: lexicalMatches(source, /class="[^"]*sol-exp[^"]*"[^>]*>([\s\S]*?)<\//gi),
            questionImages: attrs(/class="[^"]*q-image-wrap[^"]*"[\s\S]*?<img[^>]*src="([^"]*)"/gi),
            solutionImages: attrs(/class="[^"]*sol-image-wrap[^"]*"[\s\S]*?<img[^>]*src="([^"]*)"/gi),
            tables: lexicalMatches(source, /<table[^>]*>([\s\S]*?)<\/table>/gi),
            viewBlocks: lexicalMatches(source, /class="[^"]*question-note-box[^"]*"[^>]*>([\s\S]*?)<\//gi)
        }];
    }

    function semanticFingerprint(html) {
        const questions = typeof document !== 'undefined' && document.createElement
            ? domFingerprint(html)
            : lexicalFingerprint(html);
        const payload = JSON.stringify(questions);
        return Object.freeze({ questionCount: questions.length, questions: Object.freeze(questions), hash: fnv1a(payload) });
    }

    function answerSemanticFingerprint(html) {
        const source = text(html);
        if (typeof document !== 'undefined' && document.createElement) {
            const template = document.createElement('template');
            template.innerHTML = source;
            const entries = Array.from(template.content.querySelectorAll('.ans-cell:not(.ans-cell-empty)')).map(cell => ({
                sourceRef: cell.getAttribute('data-source-ref') || '',
                number: normalizeSemanticText(cell.querySelector('.ans-n')?.textContent),
                value: normalizeSemanticText(cell.querySelector('.ans-v')?.textContent),
                markup: semanticMarkup(cell.querySelector('.ans-v'))
            })).sort((left, right) => (Number.parseInt(left.number, 10) || 0) - (Number.parseInt(right.number, 10) || 0));
            const serialized = JSON.stringify(entries);
            return Object.freeze({ entryCount: entries.length, entries: Object.freeze(entries), hash: fnv1a(serialized) });
        }
        const entries = lexicalMatches(source, /class="[^"]*ans-v[^"]*"[^>]*>([\s\S]*?)<\//gi);
        return Object.freeze({ entryCount: entries.length, entries: Object.freeze(entries), hash: fnv1a(JSON.stringify(entries)) });
    }

    function compareAnswerSemantics(legacyHtml, authorityHtml) {
        const legacy = answerSemanticFingerprint(legacyHtml);
        const authority = answerSemanticFingerprint(authorityHtml);
        const differences = [];
        if (legacy.entryCount !== authority.entryCount) differences.push({ key: 'answerEntryCount', legacy: legacy.entryCount, authority: authority.entryCount });
        if (legacy.hash !== authority.hash) {
            differences.push({ key: 'answerFingerprint', legacy: legacy.hash, authority: authority.hash });
            const count = Math.max(legacy.entries.length, authority.entries.length);
            for (let index = 0; index < count && differences.length < 33; index++) {
                const left = JSON.stringify(legacy.entries[index] ?? null);
                const right = JSON.stringify(authority.entries[index] ?? null);
                if (left !== right) differences.push({ key: 'answer[' + index + ']', legacy: fnv1a(left), authority: fnv1a(right) });
            }
        }
        return Object.freeze({ equal: differences.length === 0, legacy, authority, differences: Object.freeze(differences) });
    }

    function semanticSnapshot(html) {
        const fingerprint = semanticFingerprint(html);
        const questions = fingerprint.questions;
        return Object.freeze({
            questionCount: fingerprint.questionCount,
            contentCount: questions.reduce((count, item) => count + (Array.isArray(item.content) ? item.content.length : 1), 0),
            choiceCount: questions.reduce((count, item) => count + (item.choices?.length || 0), 0),
            questionImageCount: questions.reduce((count, item) => count + (item.questionImages?.length || 0), 0),
            solutionImageCount: questions.reduce((count, item) => count + (item.solutionImages?.length || 0), 0),
            answerCount: questions.reduce((count, item) => count + (item.answers?.length || 0), 0),
            solutionCount: questions.reduce((count, item) => count + (item.solutions?.length || 0), 0),
            fingerprint
        });
    }

    function compareQuestionSemantics(legacyHtml, authorityHtml) {
        const legacy = semanticSnapshot(legacyHtml);
        const authority = semanticSnapshot(authorityHtml);
        const differences = [];
        for (const key of ['questionCount', 'contentCount', 'choiceCount', 'questionImageCount', 'solutionImageCount', 'answerCount', 'solutionCount']) {
            if (legacy[key] !== authority[key]) differences.push({ key, legacy: legacy[key], authority: authority[key] });
        }
        if (legacy.fingerprint.hash !== authority.fingerprint.hash) {
            differences.push({ key: 'semanticFingerprint', legacy: legacy.fingerprint.hash, authority: authority.fingerprint.hash });
            const questionCount = Math.max(legacy.fingerprint.questions.length, authority.fingerprint.questions.length);
            for (let index = 0; index < questionCount && differences.length < 33; index++) {
                const legacyQuestion = legacy.fingerprint.questions[index] || {};
                const authorityQuestion = authority.fingerprint.questions[index] || {};
                for (const field of ['sourceRef', 'classes', 'content', 'contentMarkup', 'choices', 'answers', 'solutions', 'questionImages', 'solutionImages', 'tables', 'viewBlocks', 'semanticMarkup']) {
                    const left = JSON.stringify(legacyQuestion[field] ?? null);
                    const right = JSON.stringify(authorityQuestion[field] ?? null);
                    if (left !== right) differences.push({ key: 'question[' + index + '].' + field, legacy: fnv1a(left), authority: fnv1a(right) });
                    if (differences.length >= 33) break;
                }
            }
        }
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
        renderAnswerEntryHTML,
        semanticSnapshot,
        semanticFingerprint,
        answerSemanticFingerprint,
        compareAnswerSemantics,
        compareQuestionSemantics
    });
}));
