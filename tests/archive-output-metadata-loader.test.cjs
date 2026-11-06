'use strict';

const assert = require('node:assert/strict');
const { createHash, webcrypto } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const loader = require('../archive/output-metadata-loader.js');
const contract = require('../archive/archive2-output-contract.js');
const normalizer = require('../archive/render-state-normalizer.js');
const authority = require('../archive/render-authority.js');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const readerUrl = 'https://archive.example/archive/mixed_engine.html?' + new URLSearchParams({
    archive2Context: 'archive2', archive2OutputContract: contract.CONTRACT_VERSION,
    outputRequestId: '4e026fff-8713-4cdc-b579-0fd415c3aceb',
    outputOwnerId: '8ab47162-80f1-44f4-8b63-22e47f2a870b', mode: 'exam', studio: '1'
});

function browser(url = readerUrl) {
    const scripts = [], warnings = [], elements = new Map();
    const element = tag => ({ tagName: tag.toUpperCase(), children: [], dataset: {}, style: {}, listeners: {},
        classList: { add() {}, remove() {}, toggle() {} },
        append(...nodes) { this.children.push(...nodes); }, appendChild(node) { this.append(node); return node; },
        replaceChildren(...nodes) { this.children = nodes; }, setAttribute() {},
        addEventListener(type, callback) { this.listeners[type] = callback; } });
    const win = { URL, URLSearchParams, TextEncoder, crypto: webcrypto, console: { warn: (...args) => warnings.push(args), error() {} },
        location: new URL(url), Archive2OutputContract: contract, addEventListener() {}, matchMedia() { return { matches: false }; },
        document: { baseURI: url, createElement: element, addEventListener() {}, querySelectorAll() { return []; },
            getElementById(id) { if (!elements.has(id)) elements.set(id, element('div')); return elements.get(id); },
            documentElement: element('html'), body: element('body'), head: { appendChild(script) { scripts.push(script); } } } };
    win.window = win;
    return { win, scripts, warnings, elements };
}

test('frozen reader makes no metadata request and never accepts late enrichment', async () => {
    const h = browser();
    const policy = loader.create(h.win);
    assert.equal(policy.mode, 'frozen-source');
    assert.equal(Object.isFrozen(policy), true);
    assert.equal(await policy.ready, null);
    assert.equal(h.scripts.length, 0);
    assert.equal(h.win.__ARCHIVE_METADATA_READY__, undefined, 'do not claim the sidecar was loaded');
    const question = Object.freeze({ questionUid: 'same-uid', content: 'same source', metadataRevision: 'frozen' });
    h.win.mergeArchiveQuestionMetadata = () => { throw Error('late merger must not run'); };
    h.win.location.search = '?submitQr=1';
    assert.equal(policy.normalizeQuestion(question, {}), question);
    assert.equal(h.scripts.length, 0, 'policy stays fixed across in-document URL changes');
});

test('default, malformed, explicit legacy and registration paths retain the full sidecar', async () => {
    const urls = ['https://archive.example/archive/mixed_engine.html?key=legacy'];
    for (const key of ['archive2Context', 'archive2OutputContract', 'outputRequestId', 'outputOwnerId', 'studio']) {
        const url = new URL(readerUrl); url.searchParams.delete(key); urls.push(url.href);
    }
    for (const [key, value] of [['archive2OutputContract', 'wrong'], ['runtime', 'legacy'], ['submitQr', '1'], ['osqr', '1']]) {
        const url = new URL(readerUrl); url.searchParams.set(key, value); urls.push(url.href);
    }
    const disabledSubmit = new URL(readerUrl); disabledSubmit.searchParams.set('submitQr', '0'); disabledSubmit.searchParams.set('osqr', '1');
    urls.push(disabledSubmit.href);
    for (const url of urls) {
        const h = browser(url), policy = loader.create(h.win);
        assert.equal(policy.mode, 'sidecar');
        assert.equal(h.scripts.length, 1);
        assert.equal(new URL(h.scripts[0].src).pathname, '/archive/question-meta.js');
        let settle;
        const metadata = { records: [] };
        h.win.__ARCHIVE_METADATA_READY__ = new Promise(resolve => { settle = resolve; });
        let ready = false;
        policy.ready.then(() => { ready = true; });
        await Promise.resolve();
        assert.equal(ready, false, 'a direct init call must await the helper load');
        h.scripts[0].onload();
        await Promise.resolve();
        assert.equal(ready, false, 'helper onload is not metadata readiness');
        settle(metadata);
        assert.equal(await policy.ready, metadata);
    }
});

test('optional helper and sidecar failures stay observable and a new load can retry', async () => {
    const h = browser('https://archive.example/archive/mixed_engine.html?key=legacy');
    const failed = loader.create(h.win);
    h.scripts[0].onerror();
    assert.equal(await failed.ready, null);
    assert.equal(h.warnings.length, 1);
    const question = { content: 'source' };
    assert.equal(failed.normalizeQuestion(question, {}), question);
    const retry = loader.create(h.win);
    assert.equal(h.scripts.length, 2);
    vm.runInNewContext(read('archive/question-meta.js'), {
        window: h.win, document: h.win.document, console: h.win.console, URL,
        fetch: async () => { throw Error('metadata network failure'); }
    });
    h.scripts[1].onload();
    assert.equal(await retry.ready, null);
    assert.equal(h.warnings.length, 2);
    assert.equal(retry.normalizeQuestion(question, {}), question);
    const existing = loader.create(h.win);
    assert.equal(await existing.ready, null);
    assert.equal(h.scripts.length, 2, 'a settled existing helper is not loaded twice');
});

test('actual metadata enrichment leaves real render inputs, source identities and generated markup unchanged', async () => {
    const h = browser('https://archive.example/archive/mixed_engine.html?submitQr=1');
    const sidecar = loader.create(h.win);
    const metadata = JSON.parse(read('archive/data/question_metadata.json'));
    vm.runInNewContext(read('archive/question-meta.js'), {
        window: h.win, document: h.win.document, console: h.win.console, URL,
        fetch: async () => ({ ok: true, json: async () => metadata })
    });
    h.scripts[0].onload();
    assert.equal(await sidecar.ready, metadata);
    const frozen = loader.create(browser().win);
    const sources = [
        'original/middle/m1/2final/25_왕운중_2학기_기말_중1_기출.js',
        'original/middle/m1/2final/25_팔마중_2학기_기말_중1_기출.js',
        'original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js',
        'original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js'
    ];
    for (const source of sources) {
        const bankContext = { window: {}, console };
        vm.runInNewContext(read('archive/exams/' + source), bankContext, { timeout: 3000 });
        const raw = JSON.parse(JSON.stringify(bankContext.window.questionBank || bankContext.window.questions));
        assert.ok(raw.length >= 20, 'use the complete real bank');
        const frozenQuestions = raw.map((question, index) => frozen.normalizeQuestion(question, { sourceArchiveFile: source, sourceOrdinal: index + 1 }));
        const enriched = raw.map((question, index) => sidecar.normalizeQuestion(question, { sourceArchiveFile: source, sourceOrdinal: index + 1 }));
        assert.ok(enriched.every(question => question._archiveMetadata), 'exercise real metadata matches for every question');
        assert.equal(digest(frozenQuestions), digest(raw), 'the frozen source is exact, including existing metadata');
        assert.equal(digest(enriched.map(q => normalizer.project(q, normalizer.RENDER_FIELDS))),
            digest(raw.map(q => normalizer.project(q, normalizer.RENDER_FIELDS))), 'render inputs changed');
        const options = { sourceArchiveFile: source };
        const before = authority.normalizeMixedQuestions(enriched, options);
        const after = authority.normalizeMixedQuestions(frozenQuestions, options);
        assert.equal(digest(normalizer.canonicalRenderData(before, enriched)),
            digest(normalizer.canonicalRenderData(after, frozenQuestions)), 'canonical source identity or rendering data changed');
        for (const mode of ['exam', 'sol']) {
            const renderOptions = { mode, wrapLatex: value => String(value), resolveAssetUrl: value => value };
            assert.equal(digest(before.map(q => authority.renderQuestionHTML(q, renderOptions))),
                digest(after.map(q => authority.renderQuestionHTML(q, renderOptions))), 'generated question/solution markup changed');
        }
        assert.equal(digest(before.map(q => authority.renderAnswerEntryHTML(q, {}))),
            digest(after.map(q => authority.renderAnswerEntryHTML(q, {}))), 'generated answer markup changed');
    }
});

function mixedInitFixture(withLoader = true, url = readerUrl) {
    const h = browser(url);
    const context = vm.createContext(h.win);
    const run = source => vm.runInContext(source, context);
    run(read('archive/archive2-output-contract.js'));
    if (withLoader) run(read('archive/output-metadata-loader.js'));
    const mixed = read('archive/mixed_engine.html');
    run(mixed.slice(mixed.indexOf('function createMixerSourceAdapter('), mixed.indexOf('const mixerSourceAdapter = createMixerSourceAdapter();')));
    run('adapter = createMixerSourceAdapter(); storageReads = 0; sessionStorage = localStorage = { getItem() { storageReads++; return "legacy data"; } };');
    return { ...h, run };
}

test('registration init waits for both the helper and metadata before reading its envelope', async () => {
    const h = mixedInitFixture(true, readerUrl + '&submitQr=1');
    h.run(`envelopeReads = 0;
        Archive2Output = { readOutputEnvelope() { envelopeReads++; throw Error('envelope unavailable'); } };
        metadataRelease = null;
        __ARCHIVE_METADATA_READY__ = new Promise(resolve => { metadataRelease = resolve; });
        initAttempt = adapter.init();`);
    await Promise.resolve();
    assert.equal(h.run('envelopeReads'), 0);
    h.scripts[0].onload();
    await Promise.resolve();
    assert.equal(h.run('envelopeReads'), 0);
    h.run('metadataRelease({ records: [] })');
    await h.run('initAttempt');
    assert.equal(h.run('envelopeReads'), 1);
    assert.equal(h.run('storageReads'), 0);
    assert.equal(h.run('__AP_OUTPUT_RENDER_ERROR__'), 'envelope unavailable');
});

test('frozen loading never bypasses real envelope validation or falls back to legacy storage', async () => {
    for (const mutation of [
        'envelope.questions[0].content = "tampered"',
        'envelope.questionUids[0] = "wrong-uid"',
        'envelope.ownerId = "00000000-0000-4000-8000-000000000001"',
        'envelope.createdAt = Date.now() - 2000; envelope.expiresAt = Date.now() - 1000'
    ]) {
        const h = mixedInitFixture();
        await h.run(`Archive2OutputContract.createOutputEnvelope({
            outputRequestId: new URL(location).searchParams.get('outputRequestId'),
            ownerId: new URL(location).searchParams.get('outputOwnerId'),
            sourceKind: 'archive2-mixed', sourceId: 'fixture', mode: 'exam', questionCount: 1,
            questionUids: ['uid-1'], questions: [{ questionUid: 'uid-1', content: 'verified source' }], meta: { qpp: 4 }
        }).then(value => { envelope = value; })`);
        h.run(`${mutation}; __AP_OUTPUT_ENVELOPE__ = envelope; mergeCalls = 0;
            mergeArchiveQuestionMetadata = question => { mergeCalls++; return question; };`);
        await h.run('adapter.init()');
        assert.equal(h.run('APOutputMetadataLoader.mode'), 'frozen-source');
        assert.equal(h.run('adapter.AppState.data.length'), 0);
        assert.equal(h.run('storageReads'), 0);
        assert.equal(h.run('mergeCalls'), 0);
        assert.match(h.run('__AP_OUTPUT_RENDER_ERROR__'), /Archive Output Envelope:/);
        assert.equal(h.scripts.length, 0);
        assert.equal(h.run('document.documentElement.dataset.archive2OutputFailure'), 'true');
    }
});

test('a missing startup loader fails visibly with a working reload action', async () => {
    const h = mixedInitFixture(false);
    await assert.rejects(h.run('adapter.init()'), { code: 'OUTPUT_METADATA_LOADER_UNAVAILABLE' });
    h.run('reloads = 0; location.reload = () => { reloads++; }; window.onload();');
    await Promise.resolve(); await Promise.resolve();
    assert.match(h.run('__AP_OUTPUT_RENDER_ERROR__'), /새로고침/);
    const panel = h.elements.get('print-area').children[0];
    const retry = panel.children.find(node => node.tagName === 'BUTTON');
    assert.ok(retry);
    retry.listeners.click();
    assert.equal(h.run('reloads'), 1);
});
