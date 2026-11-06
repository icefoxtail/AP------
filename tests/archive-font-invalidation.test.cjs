const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const printRuntime = require('../archive/print-runtime.js');

const source = fs.readFileSync(path.join(__dirname, '../archive/common-fast-runtime.js'), 'utf8');
const originalSource = fs.readFileSync(path.join(__dirname, '../archive/screen-runtime-adapter.js'), 'utf8');
const success = () => ({ ok: true, mode: 'exam', pages: 1 });
function deferred() {
    let resolve;
    const promise = new Promise(yes => { resolve = yes; });
    return { promise, resolve };
}

// Execute the real host's registered event and onRequest callbacks. The fake
// renderer records requests only; no rendered/print result is treated as proven.
function fixture(ready = Promise.resolve(success()), adapterKind = 'common', fontsReady = Promise.resolve()) {
    const fontEvents = new Map();
    const requests = [];
    const idleEntered = deferred();
    const idleResult = deferred();
    let adapter;
    let busy = false;
    let session = { activeMode: 'exam' };
    const runtime = {
        get currentSession() { return session; },
        get busy() { return busy; },
        request(intent) {
            requests.push(intent.type);
            const promise = Promise.resolve(success());
            adapter.onRequest(promise, {
                input: { mode: intent.requestedMode || 'exam', state: { data: [] } },
                intent, intentType: intent.type
            });
            return promise;
        },
        cancelBackground() {},
        whenIdle() { idleEntered.resolve(); return idleResult.promise; }
    };
    const root = {
        location: new URL('https://archive.example/mixed_engine.html?mode=exam&prewarm=0'),
        __AP_RENDER_READY__: ready,
        APRenderStateNormalizer: {},
        APSideEffectLedger: { create: () => ({}) },
        APScreenRuntime: { create(value) { adapter = value; return runtime; } },
        APPrintRuntime: printRuntime,
        AppState: { data: [] },
        addEventListener() {}
    };
    const document = {
        fonts: { ready: fontsReady, addEventListener(type, callback) { fontEvents.set(type, callback); } },
        addEventListener() {}
    };
    const context = {
        window: root, document, location: root.location, URL, URLSearchParams,
        setTimeout, clearTimeout, AppState: root.AppState,
        ARCHIVE_ASSET_CACHE_VERSION: 'font-invalidation-test', performance: { now: () => 0 }
    };
    vm.runInNewContext(adapterKind === 'original' ? originalSource : source, context,
        { filename: adapterKind === 'original' ? 'archive/screen-runtime-adapter.js' : 'archive/common-fast-runtime.js' });
    const host = adapterKind === 'original'
        ? { runtime: context.createArchiveScreenRuntime() }
        : root.APCommonFastRuntime.create({ name: 'FontInvalidationTest', modes: ['exam', 'sol'] });
    assert.equal(typeof fontEvents.get('loadingdone'), 'function');
    return {
        root, runtime, host, requests, idleEntered, idleResult, fontsReady,
        dispatchFonts() { return fontEvents.get('loadingdone')({ type: 'loadingdone' }); },
        setBusy(value) { busy = value; },
        setSession(value) { session = value; }
    };
}

test('a font completion preserves the failed latest render and does not request another mode', async () => {
    const ready = Promise.resolve({ ok: false, code: 'QUESTION_IMAGE_LOAD_FAILED' });
    const h = fixture(ready);
    await h.dispatchFonts();
    assert.deepEqual(h.requests, []);
    assert.equal(h.root.__AP_RENDER_READY__, ready);
    assert.equal((await ready).code, 'QUESTION_IMAGE_LOAD_FAILED');
});

test('a rejected latest readiness promise does not reject the font handler or invalidate', async () => {
    const ready = Promise.reject(new Error('render failed'));
    const h = fixture(ready);
    await assert.doesNotReject(() => h.dispatchFonts());
    assert.deepEqual(h.requests, []);
    assert.equal(h.root.__AP_RENDER_READY__, ready);
});

test('a successful unchanged latest render allows exactly one font invalidation', async () => {
    const ready = Promise.resolve(success());
    const h = fixture(ready);
    await h.dispatchFonts();
    assert.deepEqual(h.requests, ['FONT_INVALIDATION']);
    assert.notEqual(h.root.__AP_RENDER_READY__, ready, 'the actual host observes the new request');
});

test('a newer request while readiness is awaited prevents the old font event from replacing it', async () => {
    const old = deferred();
    const h = fixture(old.promise);
    const event = h.dispatchFonts();
    const newer = h.runtime.request({ type: 'MODE_CHANGE', requestedMode: 'sol' });
    assert.equal(h.runtime.busy, false, 'promise identity must protect even an already-idle newer request');
    old.resolve(success());
    await event;
    assert.deepEqual(h.requests, ['MODE_CHANGE']);
    assert.equal(h.root.__AP_RENDER_READY__, newer);
});

test('a renderer that becomes busy while readiness is awaited does not receive a font request', async () => {
    const ready = deferred();
    const h = fixture(ready.promise);
    const event = h.dispatchFonts();
    h.setBusy(true);
    ready.resolve(success());
    await event;
    assert.deepEqual(h.requests, []);
    assert.equal(h.root.__AP_RENDER_READY__, ready.promise);
});

for (const condition of ['busy', 'no committed session']) {
    test(`a font event is ignored when the renderer starts ${condition}`, async () => {
        const h = fixture();
        if (condition === 'busy') h.setBusy(true);
        else h.setSession(null);
        await h.dispatchFonts();
        assert.deepEqual(h.requests, []);
    });
}

test('a print lock acquired during the readiness wait blocks both that event and later font events', async () => {
    const ready = deferred();
    const h = fixture(ready.promise);
    // Register the real preflight's readiness wait first. Once readiness resolves,
    // it takes its private print lock before the font handler resumes.
    const printing = h.host.preflight().then(
        () => assert.fail('the controlled preflight must not reach a successful output gate'),
        error => error
    );
    const event = h.dispatchFonts();
    ready.resolve(success());
    await h.idleEntered.promise;
    await event;
    assert.deepEqual(h.requests, []);
    await h.dispatchFonts();
    assert.deepEqual(h.requests, [], 'an already-held print lock also blocks invalidation');
    // Exit before snapshot validation: this test makes no assertion about print quality.
    h.idleResult.resolve({ ok: false, code: 'CONTROLLED_PREFLIGHT_STOP' });
    assert.equal((await printing).code, 'RENDER_TRANSACTION_INCOMPLETE');
});

test('the original adapter preserves a failed latest render after fonts finish', async () => {
    const ready = Promise.resolve({ ok: false, code: 'QUESTION_IMAGE_LOAD_FAILED' });
    const h = fixture(ready, 'original');
    await h.fontsReady;
    await h.dispatchFonts();
    assert.deepEqual(h.requests, []);
    assert.equal(h.root.__AP_RENDER_READY__, ready);
});

test('the original adapter ignores rejected latest readiness without rejecting its font handler', async () => {
    const ready = Promise.reject(new Error('render failed'));
    const h = fixture(ready, 'original');
    await h.fontsReady;
    await assert.doesNotReject(() => h.dispatchFonts());
    assert.deepEqual(h.requests, []);
    assert.equal(h.root.__AP_RENDER_READY__, ready);
});

test('the original adapter invalidates once after an unchanged successful latest render', async () => {
    const ready = Promise.resolve(success());
    const h = fixture(ready, 'original');
    await h.fontsReady;
    await h.dispatchFonts();
    assert.deepEqual(h.requests, ['FONT_INVALIDATION']);
    assert.notEqual(h.root.__AP_RENDER_READY__, ready);
});

test('the original adapter cannot replace a newer request after awaiting older readiness', async () => {
    const old = deferred();
    const h = fixture(old.promise, 'original');
    await h.fontsReady;
    const event = h.dispatchFonts();
    const newer = h.runtime.request({ type: 'MODE_CHANGE', requestedMode: 'sol' });
    old.resolve(success());
    await event;
    assert.deepEqual(h.requests, ['MODE_CHANGE']);
    assert.equal(h.root.__AP_RENDER_READY__, newer);
});

test('the original adapter rechecks busy state after awaiting readiness', async () => {
    const ready = deferred();
    const h = fixture(ready.promise, 'original');
    await h.fontsReady;
    const event = h.dispatchFonts();
    h.setBusy(true);
    ready.resolve(success());
    await event;
    assert.deepEqual(h.requests, []);
    assert.equal(h.root.__AP_RENDER_READY__, ready.promise);
});

test('the original adapter still ignores font events until its initial font readiness is observed', async () => {
    const fonts = deferred();
    const h = fixture(Promise.resolve(success()), 'original', fonts.promise);
    await h.dispatchFonts();
    assert.deepEqual(h.requests, []);
    fonts.resolve();
    await h.fontsReady;
    await h.dispatchFonts();
    assert.deepEqual(h.requests, ['FONT_INVALIDATION']);
});
