const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const adapterSource = fs.readFileSync(path.join(root, 'archive/screen-runtime-adapter.js'), 'utf8');
const normalizerSource = fs.readFileSync(path.join(root, 'archive/render-state-normalizer.js'), 'utf8');

// Exercise the actual adapter and immutable candidate normalizer. Only DOM and
// rendering are stand-ins; these tests assert transport identity, not print QA.
function fixture() {
  const context = vm.createContext({ URL, URLSearchParams, setTimeout, clearTimeout });
  vm.runInContext(`
    var adapter, committed, lastInput, failNextHistory = false;
    var nodeMap = new Map(), classNames = new Set();
    function element(id) {
      return { id, className: '', style: { cssText: '' }, checked: false,
        textContent: '', innerText: '', tagName: 'DIV', value: '', nextSibling: null,
        classList: { toggle() {} }, removeAttribute(key) { if (key === 'id') this.id = ''; } };
    }
    var activeArea = element('print-area');
    var parentNode = {
      replaceChild(next, prior) { activeArea = next; next.parentNode = this; prior.parentNode = null; },
      insertBefore(next) { activeArea = next; next.parentNode = this; }
    };
    activeArea.parentNode = parentNode;
    function node(id) {
      if (id === 'print-area') return activeArea;
      if (!nodeMap.has(id)) nodeMap.set(id, element(id));
      return nodeMap.get(id);
    }
    var location = new URL('https://archive.example/archive/engine.html?data=exams/fixed.js&mode=exam&qpp=4&prewarm=0');
    var AppState = { mode: 'exam', qpp: 4, data: [] };
    var runtime = { currentSession: { activeMode: 'exam' }, busy: false };
    var window = { location, APSideEffectLedger: { create: () => ({}) },
      APScreenRuntime: { create(value) { adapter = value; return runtime; } }, addEventListener() {} };
    var document = { fonts: { ready: Promise.resolve(), addEventListener() {} },
      addEventListener() {}, querySelectorAll() { return []; }, getElementById: node,
      documentElement: { dataset: {}, style: { getPropertyValue() { return ''; }, setProperty() {} },
        classList: { add(v) { classNames.add(v); }, remove(v) { classNames.delete(v); },
          contains(v) { return classNames.has(v); }, toggle(v, yes) { if (yes) classNames.add(v); else classNames.delete(v); } } } };
    var history = { state: null,
      pushState(_a, _b, url) { if (failNextHistory) { failNextHistory = false; throw Error('CONTROLLED_HISTORY_FAILURE'); } location.href = url; },
      replaceState(_a, _b, url) { location.href = url; } };
    var performance = { now: () => 0 }, ARCHIVE_ASSET_CACHE_VERSION = 'url-binding-test';
    var normalizeArchiveExamScriptPath = value => value;
    var normalizePrintHeaderOptions = value => window.APRenderStateNormalizer.copy(value || {});
    var getDisplayTitle = () => '', getKstTodayString = () => '2026-11-15';
    var renderPrintHeaderControls = () => {}, applyQrSolutionLockUI = () => {}, archiveReadinessTracker;
  `, context);
  vm.runInContext(normalizerSource, context, { filename: 'archive/render-state-normalizer.js' });
  vm.runInContext('window.APRenderStateNormalizer = APRenderStateNormalizer;', context);
  vm.runInContext(adapterSource, context, { filename: 'archive/screen-runtime-adapter.js' });
  vm.runInContext(`
    createArchiveScreenRuntime();
    lastInput = adapter.captureInput({ type: 'SOURCE_CHANGE', payload: {
      safeDataUrl: 'exams/fixed.js', mode: 'exam', qpp: 4
    } }, null, null);
    var source = APRenderStateNormalizer.copy({ sourceKind: 'archive-source',
      sourceRequestId: lastInput.sourceRequestId, safeDataUrl: 'exams/fixed.js',
      sourceArchiveFile: 'test-fixtures/fixed.js', canonicalDataFingerprint: 'synthetic-source-v1',
      canonicalRenderData: [{ displayNo: 1, renderInput: { id: 1 }, sourcePayload: {} }],
      title: 'fixture', identityTitle: 'fixture', displayTitle: 'fixture', businessData: [{ id: 1 }] });
    committed = { input: lastInput, source };
    function modeIntent(mode, id) {
      const envelope = { mode, questionCount: 1, contractVersion: 'v3',
        outputRequestId: id, ownerId: 'owner', payloadHash: 'payload-' + id,
        meta: { qpp: 4, printHeaderOptions: {} } };
      const url = new URL(location.href);
      for (const [key, value] of Object.entries({ archive2Context: 'archive2',
        archive2OutputContract: 'v3', outputRequestId: id, outputOwnerId: 'owner',
        mode, q: '1', qpp: '4' })) url.searchParams.set(key, value);
      return { type: 'MODE_CHANGE', requestedMode: mode,
        payload: { printHeaderOptions: {}, outputEnvelope: envelope, outputUrl: url.href } };
    }
    async function transact(intent) {
      const next = adapter.captureInput(intent, lastInput, committed);
      const candidate = await adapter.prepare(next, { requestedTargetSessionId: 'fixed-session' }, committed);
      const ctx = { intent, intentType: intent.type, candidate,
        buildState: { mode: candidate.mode, qpp: candidate.qpp, printHeaderOptions: candidate.printHeaderOptions },
        targetArea: element('staged'), readinessTracker: { snapshot: () => ({}) }, metrics: {}, diagnostics: {} };
      const journal = adapter.capture(ctx);
      try { adapter.attach(ctx, journal); adapter.commit(ctx); }
      catch (error) { adapter.rollback(ctx, journal); throw error; }
      if (intent.payload?.outputEnvelope) {
        const e = intent.payload.outputEnvelope;
        window.__AP_OUTPUT_RENDER_READY__ = { contractVersion: e.contractVersion,
          outputRequestId: e.outputRequestId, payloadHash: e.payloadHash, pageCount: 1 };
      }
      committed = candidate; lastInput = next;
      runtime.committedCandidate = candidate;
      return bindingState();
    }
    function bindingState() {
      const e = window.__AP_OUTPUT_ENVELOPE__, u = new URL(location.href);
      return { url: u.href, candidateUrl: committed.environment?.url || lastInput.url,
        requestId: u.searchParams.get('outputRequestId'), ownerId: u.searchParams.get('outputOwnerId'),
        contractVersion: u.searchParams.get('archive2OutputContract'), mode: u.searchParams.get('mode'),
        questionCount: u.searchParams.get('q'), qpp: u.searchParams.get('qpp'),
        verifiedId: window.__AP_OUTPUT_ENVELOPE_READY__?.outputRequestId || null,
        renderedId: window.__AP_OUTPUT_RENDER_READY__?.outputRequestId || null,
        envelopeId: e?.outputRequestId || null, errorPresent: !!window.__AP_OUTPUT_RENDER_ERROR__,
        source: committed.source, inputFrozen: Object.isFrozen(lastInput) };
    }
  `, context);
  return {
    run: code => vm.runInContext(code, context),
    async state(code = 'bindingState()') {
      return JSON.parse(JSON.stringify(await vm.runInContext(code, context)));
    }
  };
}

function assertEnvelope(state, id, mode = 'sol') {
  assert.equal(state.url, state.candidateUrl, 'the committed candidate carries the published URL');
  assert.equal(state.requestId, id);
  assert.equal(state.ownerId, 'owner');
  assert.equal(state.contractVersion, 'v3');
  assert.equal(state.mode, mode);
  assert.equal(state.questionCount, '1');
  assert.equal(state.qpp, '4');
  assert.equal(state.verifiedId, id);
  assert.equal(state.renderedId, id);
  assert.equal(state.envelopeId, id);
  assert.equal(state.errorPresent, false);
  assert.equal(state.inputFrozen, true);
}

for (const type of ['FONT_INVALIDATION', 'ASSET_INVALIDATION', 'PAGE_LAYOUT_INVALIDATION', 'ENGINE_INVALIDATION', 'FORCED_REBUILD']) {
  test(`a published original output keeps its exact identity through ${type}`, async () => {
    const h = fixture();
    const before = await h.state("transact(modeIntent('sol', 'request-1'))");
    const after = await h.state(`transact({ type: '${type}', payload: { fingerprint: 'after-print' } })`);
    assertEnvelope(after, 'request-1');
    assert.deepEqual(after.source, before.source, 'invalidation cannot change the selected source');
  });
}

test('a newer published mode and request remain authoritative after print-font invalidation', async () => {
  const h = fixture();
  await h.state("transact(modeIntent('sol', 'request-1'))");
  await h.state("transact(modeIntent('ans', 'request-2'))");
  assertEnvelope(await h.state("transact({ type: 'FONT_INVALIDATION', payload: { fingerprint: 'after-print' } })"), 'request-2', 'ans');
});

test('republishing a header binds the same verified URL without changing the source', async () => {
  const h = fixture();
  const before = await h.state("transact(modeIntent('sol', 'request-1'))");
  await h.state(`(async () => { const intent = modeIntent('sol', 'request-header');
    intent.payload.printHeaderOptions = { title: 'revised fixture heading' };
    intent.payload.outputEnvelope.meta.printHeaderOptions = { title: 'revised fixture heading' };
    return transact(intent); })()`);
  const after = await h.state("transact({ type: 'FONT_INVALIDATION', payload: { fingerprint: 'after-print' } })");
  assertEnvelope(after, 'request-header');
  assert.deepEqual(after.source, before.source);
});

test('a failed history commit restores the prior published URL, envelope and candidate', async () => {
  const h = fixture();
  const before = await h.state("transact(modeIntent('sol', 'request-1'))");
  h.run('failNextHistory = true;');
  await assert.rejects(h.state("transact(modeIntent('ans', 'request-2'))"), /CONTROLLED_HISTORY_FAILURE/);
  assert.deepEqual(await h.state(), before);
  assertEnvelope(await h.state("transact({ type: 'FONT_INVALIDATION' })"), 'request-1');
});

test('an original without an output envelope does not acquire output authority on invalidation', async () => {
  const h = fixture();
  const state = await h.state("transact({ type: 'FONT_INVALIDATION' })");
  assert.equal(state.requestId, null);
  assert.equal(state.ownerId, null);
  assert.equal(state.contractVersion, null);
  assert.equal(state.verifiedId, null);
  assert.equal(state.renderedId, null);
  assert.equal(state.envelopeId, null);
  assert.equal(state.mode, 'exam');
});

const rejected = [
  ['other origin', "u.hostname = 'other.example';"],
  ['other path', "u.pathname = '/other/engine.html';"],
  ['wrong mode', "u.searchParams.set('mode', 'exam');"],
  ['missing Archive context', "u.searchParams.delete('archive2Context');"],
  ['different contract', "u.searchParams.set('archive2OutputContract', 'other');"],
  ['missing request', "u.searchParams.delete('outputRequestId');"],
  ['different request', "u.searchParams.set('outputRequestId', 'other');"],
  ['different owner', "u.searchParams.set('outputOwnerId', 'other');"],
  ['different denominator', "u.searchParams.set('q', '2');"],
  ['different qpp', "u.searchParams.set('qpp', '2');"]
];
for (const [name, mutation] of rejected) {
  test(`a candidate cannot preserve an output URL with ${name}`, async () => {
    const h = fixture();
    const before = await h.state("transact(modeIntent('sol', 'request-1'))");
    await assert.rejects(h.state(`(async () => { const intent = modeIntent('ans', 'request-2');
      const u = new URL(intent.payload.outputUrl); ${mutation}
      intent.payload.outputUrl = u.href; return transact(intent); })()`), /OUTPUT_MODE_TRANSACTION_MISMATCH/);
    assert.deepEqual(await h.state(), before, 'rejection happens before visible or candidate state changes');
  });
}

test('an envelope mode cannot disagree with the requested mode', async () => {
  const h = fixture();
  await assert.rejects(h.state(`(async () => { const intent = modeIntent('sol', 'request-1');
    intent.payload.outputEnvelope.mode = 'ans'; return transact(intent); })()`), /OUTPUT_MODE_TRANSACTION_MISMATCH/);
});

test('an envelope header cannot disagree with the accepted candidate header', async () => {
  const h = fixture();
  await assert.rejects(h.state(`(async () => { const intent = modeIntent('sol', 'request-1');
    intent.payload.outputEnvelope.meta.printHeaderOptions = { title: 'foreign' }; return transact(intent); })()`), /OUTPUT_MODE_TRANSACTION_MISMATCH/);
});
