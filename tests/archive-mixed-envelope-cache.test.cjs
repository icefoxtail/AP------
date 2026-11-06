'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');
const mixed = read('mixed_engine.html');
const factoryStart = mixed.indexOf('function createMixerSourceAdapter(');
const factoryScript = mixed.slice(factoryStart, mixed.indexOf('</script>', factoryStart));

// These are binding/transaction unit tests, not a substitute for the Chrome
// suite. Execute the production adapter factory and common input/key logic;
// a recording renderer supplies no claims about layout or rendered content.
function fixture() {
    const context = vm.createContext({ URL, URLSearchParams, setTimeout, clearTimeout, AbortController, console, performance });
    const run = source => vm.runInContext(source, context);
    run(`
        globalThis.window = globalThis;
        const classes = () => ({ values: new Set(), add(...names) { names.forEach(name => this.values.add(name)); },
            remove(...names) { names.forEach(name => this.values.delete(name)); }, contains(name) { return this.values.has(name); },
            toggle(name, force) { const present = force === undefined ? !this.values.has(name) : force; present ? this.values.add(name) : this.values.delete(name); } });
        const elements = new Map();
        const element = id => { if (!elements.has(id)) elements.set(id, { id, dataset: {}, value: '', checked: false,
            classList: classes(), style: { getPropertyValue() { return ''; }, setProperty() {} }, setAttribute() {}, removeAttribute() {},
            querySelectorAll() { return []; }, addEventListener() {} }); return elements.get(id); };
        location = new URL('https://archive.example/archive/mixed_engine.html?archive2Context=archive2&archive2OutputContract=contract&outputRequestId=initial&outputOwnerId=owner&mode=exam&q=1&qpp=4&studio=1&v=keep-version&prewarm=0');
        history = { state: null, replaceState(state, unused, url) { this.state = state; location.href = url; } };
        document = { addEventListener() {}, getElementById: element,
            querySelectorAll(selector) { return selector === '#print-area .page' ? [element('page')] : []; },
            documentElement: element('html'), body: element('body'), fonts: { status: 'loaded', ready: Promise.resolve(), addEventListener() {} } };
        addEventListener = () => {};
        APExamRenderExecutor = { renderComposed() {} }; APSolutionRenderExecutor = { renderComposed() {} }; APAnswerRenderExecutor = { render() {} };
        APPrintRuntime = {}; APRenderLoop = {};
        Archive2ReaderControls = { setReady(value, mode) { reader = { ready: value, mode }; }, syncMode(mode) { reader.mode = mode; } };
        reader = { ready: true, mode: 'exam' };
        Archive2PdfReadiness = { assertLayoutReady() { if (layoutFailure) throw Error('LAYOUT_REJECTED'); return { pageCount: 1 }; },
            async assertReady() { if (lateFailure) throw Error('LATE_READINESS_REJECTED'); return { pageCount: 1 }; } };
        layoutFailure = false; lateFailure = false; requestSerial = 0; published = []; cleaned = []; inputs = []; candidates = [];
        publishGate = null; requestFailure = null;
        Archive2Output = { async publishOutputEnvelope(input) {
            const envelope = { ...input, contractVersion: 'contract', outputRequestId: 'request-' + (++requestSerial), payloadHash: 'hash-' + requestSerial };
            published.push(envelope);
            if (publishGate) await publishGate(envelope);
            return envelope;
        }, createOutputStore() { return { async cleanup(owner, id) { cleaned.push([owner, id]); } }; } };
        APScreenRuntime = { create(adapter) {
            commonAdapter = adapter;
            let desired = null, committed = null;
            const runtime = { currentSession: { activeMode: 'exam' }, cancelBackground() {}, busy: false,
                request(intent) {
                    let input;
                    try { input = adapter.captureInput(intent, desired, committed); }
                    catch (error) { return Promise.resolve({ ok: false, code: error.message }); }
                    desired = input; inputs.push(input);
                    const pending = Promise.resolve().then(async () => {
                        if (requestFailure) { const code = requestFailure; requestFailure = null; desired = null; return { ok: false, code }; }
                        const ctx = { input, intent, intentType: intent.type, abortSignal: new AbortController().signal,
                            requestedTargetSessionId: 'session', state: 'SUCCEEDED', result: { sessionId: 'session', pageCount: 1 },
                            targetArea: { isConnected: false, removeAttribute() {} }, diagnostics: {}, metrics: {}, readinessTracker: { snapshot() { return {}; } } };
                        ctx.candidate = await adapter.prepare(input, ctx, committed);
                        ctx.buildState = JSON.parse(JSON.stringify(ctx.candidate.state));
                        candidates.push(ctx.candidate);
                        const journal = adapter.capture(ctx);
                        try { adapter.commit(ctx); await adapter.finalize?.(ctx); }
                        catch (error) { adapter.rollback(ctx, journal); desired = null; return { ok: false, code: error.message }; }
                        committed = ctx.candidate; runtime.currentSession.activeMode = input.mode;
                        return { ok: true, mode: input.mode, pages: 1 };
                    });
                    adapter.onRequest(pending, { input, intent, intentType: intent.type });
                    return pending;
                }
            }; return runtime;
        } };
    `);
    run(read('render-state-normalizer.js'));
    run(read('common-fast-runtime.js'));
    run(factoryScript);
    run(`
        Object.assign(AppState, { data: [{ id: 1, questionUid: 'uid-1', content: 'source', answer: 'value', solution: 'explanation' }],
            meta: { title: 'binding fixture', qpp: 4 }, key: 'initial', mode: 'exam', qpp: 4 });
        AppState.printHeaderOptions = normalizePrintHeaderOptions({});
        __AP_OUTPUT_ENVELOPE__ = { contractVersion: 'contract', outputRequestId: 'initial', ownerId: 'owner', payloadHash: 'initial-hash',
            sourceKind: 'archive2-mixed', sourceId: 'fixture', mode: 'exam', questionCount: 1, questionUids: ['uid-1'],
            questions: JSON.parse(JSON.stringify(AppState.data)), meta: JSON.parse(JSON.stringify(AppState.meta)) };
        AppState.outputEnvelope = __AP_OUTPUT_ENVELOPE__;
        __AP_OUTPUT_ENVELOPE_READY__ = { contractVersion: 'contract', outputRequestId: 'initial', payloadHash: 'initial-hash' };
        __AP_OUTPUT_RENDER_READY__ = { ...__AP_OUTPUT_ENVELOPE_READY__, pageCount: 1 };
        __AP_RENDER_READY__ = Promise.resolve({ ok: true, mode: 'exam', pages: 1 });
        __AP_OUTPUT_RENDER_ERROR__ = null;
    `);
    return { run, context, json(source) { return JSON.parse(run(`JSON.stringify(${source})`)); } };
}

test('fresh transport IDs preserve exact render keys and publish current binding only on commit', async () => {
    const h = fixture();
    await h.run('mixedFastHost.runtime.request({ type: "FORCED_REBUILD" })');
    const initialKey = h.run('APRenderStateNormalizer.computeSnapshotKey(candidates[0])');
    await h.run('switchMode("sol")');
    await h.run('switchMode("ans")');
    await h.run('switchMode("exam")');
    assert.equal(h.run('APRenderStateNormalizer.computeSnapshotKey(candidates.at(-1))'), initialKey);
    assert.equal(h.run('AppState.key'), 'initial', 'the source/QR key stays bound to the source session');
    assert.equal(h.run('new URL(location).searchParams.get("v")'), 'keep-version');
    assert.equal(h.run('new URL(location).searchParams.get("outputRequestId")'), 'request-3');
    assert.equal(h.run('__AP_OUTPUT_RENDER_READY__.outputRequestId'), 'request-3');
    assert.equal(h.run('inputs.at(-1).transport.envelope'), h.run('__AP_OUTPUT_ENVELOPE__'));
    assert.equal(h.run('Object.isFrozen(inputs.at(-1).transport.envelope.questions[0])'), true);
    assert.deepEqual(h.json('published.map(value => value.questionUids)'), [['uid-1'], ['uid-1'], ['uid-1']]);
});

test('transport validation rejects wrong content, owner, options and stale editor inputs', async () => {
    const h = fixture();
    await h.run('switchMode("sol")');
    h.run('lastInput = inputs.at(-1); lastIntent = { type: "MODE_CHANGE", requestedMode: "sol", payload: { outputEnvelope: lastInput.transport.envelope, outputUrl: lastInput.url, outputGeneration: lastInput.transport.generation, inputFingerprint: APRenderStateNormalizer.semanticDigest({ key: lastInput.state.key, data: lastInput.state.data, meta: lastInput.state.meta, qpp: lastInput.state.qpp, printHeaderOptions: lastInput.state.printHeaderOptions }) } };');
    for (const change of [
        'intent.payload.outputEnvelope.questions[0].content = "changed"',
        'intent.payload.outputEnvelope.ownerId = "someone-else"',
        'intent.payload.outputUrl += "&solQr=1"',
        'state.qpp = 8',
        'state.printHeaderOptions.title = "new title"',
        'intent.payload.outputUrl = intent.payload.outputUrl.replace("archive.example", "other.example")'
    ]) {
        assert.throws(() => h.run(`{ const intent = JSON.parse(JSON.stringify(lastIntent)), state = JSON.parse(JSON.stringify(lastInput.state)); ${change}; mixerSourceAdapter.captureOutputTransport(intent, state, lastInput.url); }`), /OUTPUT_MODE_TRANSACTION_MISMATCH/);
    }
    const stable = h.run('mixerSourceAdapter.outputRenderUrl(lastInput.url)');
    assert.notEqual(h.run('mixerSourceAdapter.outputRenderUrl(lastInput.url + "&solQr=1")'), stable);
    assert.notEqual(h.run('mixerSourceAdapter.outputRenderUrl(lastInput.url.replace("outputOwnerId=owner", "outputOwnerId=other"))'), stable);
    h.run('qrExamUrl = lastInput.url.replace("mode=sol", "mode=exam") + "&solQr=1"');
    assert.notEqual(h.run('mixerSourceAdapter.outputRenderUrl(qrExamUrl)'), h.run('mixerSourceAdapter.outputRenderUrl(qrExamUrl.replace("request-1", "next-request"))'),
        'a solution QR embeds its transport request, so that exam must rebuild');
    assert.equal(h.run('mixerSourceAdapter.outputRenderUrl(qrExamUrl + "&portalQr=1")'), h.run('mixerSourceAdapter.outputRenderUrl(qrExamUrl.replace("request-1", "next-request") + "&portalQr=1")'));
});

test('a real source or editor change is carried into the next envelope without changing the old frozen source', async () => {
    const h = fixture();
    h.run('originalEnvelope = __AP_OUTPUT_ENVELOPE__; edited = JSON.parse(JSON.stringify(AppState.data)); edited[0].content = "edited source, same UID"');
    await h.run('mixedFastHost.runtime.request({ type: "SOURCE_CHANGE", payload: { data: edited } })');
    await h.run('mixedFastHost.runtime.request({ type: "QPP_CHANGE", payload: { qpp: 8 } })');
    await h.run('mixedFastHost.runtime.request({ type: "HEADER_CHANGE", payload: { header: { title: "edited header" } } })');
    await h.run('switchMode("sol")');
    assert.equal(h.run('published.at(-1).questions[0].content'), 'edited source, same UID');
    assert.equal(h.run('published.at(-1).questions[0].questionUid'), 'uid-1');
    assert.equal(h.run('published.at(-1).meta.qpp'), 8);
    assert.equal(h.run('published.at(-1).meta.printHeaderOptions.title'), 'edited header');
    assert.equal(h.run('originalEnvelope.questions[0].content'), 'source');
});

test('layout and full readiness failures restore the old binding and history before retry', async () => {
    const h = fixture();
    const oldUrl = h.run('location.href');
    h.run('layoutFailure = true');
    await assert.rejects(h.run('switchMode("sol")'), /LAYOUT_REJECTED/);
    assert.equal(h.run('AppState.mode'), 'exam');
    assert.equal(h.run('__AP_OUTPUT_ENVELOPE__.outputRequestId'), 'initial');
    assert.equal(h.run('__AP_OUTPUT_RENDER_READY__.outputRequestId'), 'initial');
    assert.equal(h.run('location.href'), oldUrl);
    assert.deepEqual(h.json('cleaned'), [['owner', 'request-1']]);
    h.run('layoutFailure = false; lateFailure = true');
    await assert.rejects(h.run('switchMode("sol")'), /LATE_READINESS_REJECTED/);
    assert.equal(h.run('AppState.mode'), 'exam');
    assert.equal(h.run('__AP_OUTPUT_ENVELOPE__.outputRequestId'), 'initial');
    assert.equal(h.run('location.href'), oldUrl);
    assert.equal(h.run('__AP_OUTPUT_RENDER_READY__.outputRequestId'), 'initial');
    assert.equal(h.run('__AP_OUTPUT_RENDER_ERROR__'), null);
    assert.deepEqual(h.json('cleaned'), [['owner', 'request-1'], ['owner', 'request-2']]);
    h.run('lateFailure = false');
    assert.equal((await h.run('switchMode("sol")')).ok, true);
    assert.equal(h.run('__AP_OUTPUT_RENDER_READY__.outputRequestId'), 'request-3');
    assert.equal(h.run('__AP_OUTPUT_RENDER_ERROR__'), null);
});

test('rollback restores an observed readiness value as well as its property descriptor', async () => {
    const h = fixture();
    h.run(`let observedReady = __AP_OUTPUT_RENDER_READY__;
        Object.defineProperty(window, '__AP_OUTPUT_RENDER_READY__', { configurable: true,
            get() { return observedReady; }, set(value) { observedReady = value; } });
        layoutFailure = true;`);
    await assert.rejects(h.run('switchMode("sol")'), /LAYOUT_REJECTED/);
    assert.equal(h.run('__AP_OUTPUT_RENDER_READY__.outputRequestId'), 'initial');
    assert.equal(h.run('typeof Object.getOwnPropertyDescriptor(window, "__AP_OUTPUT_RENDER_READY__").set'), 'function');
});

test('selecting the restored old mode after failure recovers actual render readiness', async () => {
    const h = fixture();
    h.run('lateFailure = true');
    await assert.rejects(h.run('switchMode("sol")'), /LATE_READINESS_REJECTED/);
    assert.equal(h.run('AppState.mode'), 'exam');
    assert.equal((await h.run('__AP_RENDER_READY__')).ok, false);
    h.run('lateFailure = false');
    assert.equal((await h.run('switchMode("exam")')).ok, true);
    assert.equal((await h.run('__AP_RENDER_READY__')).ok, true);
    assert.equal(h.run('__AP_OUTPUT_RENDER_READY__.outputRequestId'), 'request-2');
    assert.equal(h.run('reader.ready'), true);
    assert.deepEqual(h.json('inputs.map(value => value.mode)'), ['sol', 'exam']);
});

test('a same-mode readiness check cannot supersede a newer mode request while awaiting', async () => {
    const h = fixture();
    h.run('let releaseSameMode; __AP_RENDER_READY__ = new Promise(resolve => { releaseSameMode = resolve; }); sameMode = switchMode("exam");');
    const next = h.run('switchMode("ans")');
    h.run('releaseSameMode({ ok: true, mode: "exam", pages: 1 })');
    assert.equal((await h.run('sameMode')).code, 'DISCARDED_STALE');
    assert.equal((await next).ok, true);
    assert.equal(h.run('AppState.mode'), 'ans');
    assert.deepEqual(h.json('inputs.map(value => value.mode)'), ['ans']);
});

test('out-of-order envelope publishing cannot request or seal an older mode', async () => {
    const h = fixture();
    h.run('let releaseOld; publishGate = envelope => envelope.mode === "sol" ? new Promise(resolve => { releaseOld = resolve; }) : Promise.resolve(); oldSwitch = switchMode("sol");');
    const latest = await h.run('switchMode("ans")');
    assert.equal(latest.ok, true);
    h.run('releaseOld()');
    assert.equal((await h.run('oldSwitch')).code, 'DISCARDED_STALE');
    assert.deepEqual(h.json('inputs.map(value => value.mode)'), ['ans']);
    assert.equal(h.run('AppState.mode'), 'ans');
    assert.equal(h.run('__AP_OUTPUT_RENDER_READY__.outputRequestId'), 'request-2');
    assert.deepEqual(h.json('cleaned'), [['owner', 'request-1']]);
});
