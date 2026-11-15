const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { compareRows } = require('./archive2-solution-loading-browser.cjs');

const browserSource = fs.readFileSync(path.join(__dirname, 'archive2-output-performance-browser.cjs'), 'utf8');
const contractSource = fs.readFileSync(path.join(__dirname, '../archive/snapshot-contract.js'), 'utf8');
function exactFunctionRange(startText, endText) {
  const start = browserSource.indexOf(startText), end = browserSource.indexOf(endText, start);
  assert.ok(start >= 0 && end > start, `actual helper range missing: ${startText}`);
  return browserSource.slice(start, end);
}
const helperSource = [
  exactFunctionRange('function requireThat(', '\nfunction safeError('),
  exactFunctionRange('function timeLeft(', '\nfunction installProfile('),
  exactFunctionRange('async function printPreflight(', '\nasync function printPdfMetadata(')
].join('\n');

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  promise.catch(() => {});
  return { promise, resolve, reject };
}
function observe(promise) {
  const state = { settled: false };
  promise.then(value => Object.assign(state, { settled: true, value }),
    error => Object.assign(state, { settled: true, error }));
  return state;
}

// Run the exact helper, its actual 45-second bound and the production snapshot
// P01-P23 implementation. Only browser I/O, DOM measurements and time are fake.
function fixture({ mixed = null, evaluatePending = false, noFontsReady = false } = {}) {
  const ready = deferred(), timers = new Map(), scheduled = [], events = [];
  let now = 0, serial = 0, captures = 0, unlocks = 0, blockX = 10;
  const flush = async () => { for (let turn = 0; turn < 32; turn++) await Promise.resolve(); };
  const body = { clientWidth: 760, clientHeight: 1000, scrollWidth: 760, scrollHeight: 1000 };
  const page = { offsetWidth: 800, offsetHeight: 1122, clientWidth: 800, scrollWidth: 800,
    querySelector: () => body };
  const area = { querySelector: () => null,
    querySelectorAll: selector => selector === '.page' ? [page] : [] };
  const fonts = { status: 'loaded', ...(noFontsReady ? {} : { ready: ready.promise }) };
  const evidence = { state: 'RENDER_READY', events: Array.from({ length: 5 }, (_, index) => ({ state: 'event-' + index })) };
  const candidate = { source: { targetSessionId: 'session', sourceArchiveFile: 'fixture.js' },
    fingerprints: Object.fromEntries(['font', 'asset', 'pageLayout', 'qrPolicy', 'qrPayload', 'printHeader', 'profile', 'executor', 'layoutAuthority'].map(key => [key, 'fixed-' + key])) };
  const snapshot = { status: 'ACTIVE', rootNode: area, key: 'fixed-key', sessionId: 'session',
    pageCount: 1, readinessEvidence: evidence };
  function capturedRow() {
    return { mode: 'sol', qpp: 4, outcome: { ok: true }, questionCount: 1, blockCount: 1,
      pageCount: 1, bodyHash: 'fixed-body-hash', sourceOrder: ['fixture#1'], mathCount: 0, images: [],
      attempts: [{ state: 'SUCCEEDED' }], pages: [{ width: 800, height: 1122, textHash: 'fixed-page-hash', images: [],
        blocks: [{ sourceRef: 'fixture#1', textHash: 'fixed-block-hash', x: blockX, y: 10, width: 740, height: 50 }] }] };
  }
  const before = capturedRow();
  const window = { archiveScreenRuntime: { activeSnapshot: snapshot, committedCandidate: candidate },
    APRenderLoop: { unrenderedMathCount: () => 0 },
    APRenderStateNormalizer: { computeSnapshotKey: () => 'fixed-key' },
    bindArchiveRuntimePrintReadiness() { events.push('bind-ready'); } };
  const context = vm.createContext({
    window, document: { fonts, getElementById: () => area },
    Date: class extends Date { static now() { return now; } }, performance: { now: () => now },
    operationTimeoutMs: 90000, suiteDeadline: 1500000,
    setTimeout(callback, delay = 0) {
      const id = ++serial;
      scheduled.push({ id, delay }); timers.set(id, { at: now + delay, callback }); return id;
    },
    clearTimeout(id) { timers.delete(id); },
    H: { async capture() { captures++; events.push('capture'); return capturedRow(); }, compareRows }
  });
  vm.runInContext(contractSource, context, { filename: 'archive/snapshot-contract.js' });
  const contract = context.APArchiveSnapshotContract;
  contract.freeze(snapshot, { state: 'SUCCEEDED', snapshotKey: 'fixed-key', requestedTargetSessionId: 'session',
    targetArea: area, candidate, metrics: { mathJaxCalls: 0 }, result: { evidence }, sideEffectsAllowed: false,
    abortSignal: { aborted: false }, buildState: {}, diagnostics: {} });
  window.APArchiveSnapshotContract = { preflight(...args) {
    const result = contract.preflight(...args); events.push({ gateNames: Object.keys(result.gates), gates: result.gates }); return result;
  } };
  if (!noFontsReady) fonts.status = 'loading';
  if (mixed) window.mixedFastHost = {
    async preflight() { events.push('mixed-preflight'); if (mixed === 'reject') throw Error('MIXED_PREFLIGHT_FAILED'); return { ok: mixed === 'pass', pages: 1 }; },
    unlockPrint() { unlocks++; events.push('mixed-unlock'); }
  };
  vm.runInContext(helperSource + '\nthis.runPerformancePreflight = printPreflight;', context,
    { filename: 'actual-performance-printPreflight' });
  const result = context.runPerformancePreflight({ evaluate: callback => evaluatePending ? new Promise(() => {}) : callback() }, before);
  const outcome = observe(result);
  return { ready, fonts, events, scheduled, result, outcome, snapshot, candidate, page,
    captures: () => captures, unlocks: () => unlocks, timerCount: () => timers.size,
    setBlockX(value) { blockX = value; },
    async advance(milliseconds = 0) {
      const target = now + milliseconds; await flush();
      for (;;) {
        const due = [...timers].filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!due) break;
        const [id, timer] = due; timers.delete(id); now = timer.at; timer.callback(); await flush();
      }
      now = target; await flush();
    }
  };
}

function assertSnapshotFailure(h, gate) {
  assert.equal(h.outcome.error?.code, 'SUCCESSFUL_RENDER_PRINT_PREFLIGHT_FAILED');
  assert.deepEqual(Array.from(h.outcome.error.details.failedGates), [gate]);
  assert.equal(h.captures(), 0, 'failed snapshot gates must not reach the output comparison');
  assert.equal(h.timerCount(), 0, 'both the font and outer operation timers are released');
}

test('performance preflight waits through 4999ms, then accepts ready fonts under every actual snapshot gate', async () => {
  const h = fixture();
  await h.advance(4999);
  assert.equal(h.outcome.settled, false);
  assert.deepEqual(h.events, []);
  assert.deepEqual(h.scheduled.map(timer => timer.delay), [5000, 45000]);
  h.fonts.status = 'loaded'; h.ready.resolve(); await h.advance();
  const result = await h.result;
  assert.equal(result.ok, true);
  assert.equal(result.elapsedMs, 4999, 'the performance clock includes the product font wait');
  assert.deepEqual(Array.from(h.events[0].gateNames), Array.from({ length: 23 }, (_, i) => 'P' + String(i + 1).padStart(2, '0')));
  assert.ok(Object.values(h.events[0].gates).every(Boolean));
  assert.equal(result.outputParity.coordinateTolerancePx, 1);
  assert.equal(result.attemptsBefore, result.attemptsAfter);
  assert.equal(h.captures(), 1);
  assert.equal(h.timerCount(), 0);
});

test('5000ms without loaded fonts fails P11 and a later resolve cannot turn that rejection into PASS', async () => {
  const h = fixture();
  await h.advance(4999); assert.equal(h.outcome.settled, false);
  await h.advance(1); assert.equal(h.outcome.settled, true);
  assertSnapshotFailure(h, 'P11');
  const originalError = h.outcome.error;
  assert.equal(originalError.details.elapsedMs, 5000);
  h.fonts.status = 'loaded'; h.ready.resolve(); await h.advance(100);
  assert.equal(h.outcome.error, originalError);
  assert.equal(h.outcome.value, undefined);
  assert.equal(h.events.filter(event => typeof event === 'object').length, 1);
  assertSnapshotFailure(h, 'P11');
});

test('a resolved font promise cannot replace the actual P11 loaded-state check', async () => {
  const h = fixture(); h.ready.resolve(); await h.advance();
  assertSnapshotFailure(h, 'P11');
});

test('a font settlement cannot waive actual P15 page geometry drift', async () => {
  const h = fixture(); h.page.offsetWidth += 2;
  h.fonts.status = 'loaded'; h.ready.resolve(); await h.advance();
  assertSnapshotFailure(h, 'P15');
});

test('an early successful font settlement clears its unused timer and the outer deadline', async () => {
  const h = fixture(); await h.advance(125);
  h.fonts.status = 'loaded'; h.ready.resolve(); await h.advance();
  assert.equal(h.outcome.value.ok, true);
  assert.equal(h.outcome.value.elapsedMs, 125);
  assert.equal(h.timerCount(), 0);
  await h.advance(45000); assert.equal(h.outcome.value.ok, true);
  assert.equal(h.captures(), 1);
});

test('rejected font readiness fails closed and clears both timers without invoking snapshot gates', async () => {
  const h = fixture(); await h.advance(125); h.ready.reject(Error('font transport rejected')); await h.advance();
  assert.equal(h.outcome.error?.code, 'SUCCESSFUL_RENDER_PRINT_PREFLIGHT_FAILED');
  assert.equal(h.outcome.error.details.code, 'PRINT_PREFLIGHT_FAILED');
  assert.equal(h.outcome.error.details.elapsedMs, 125);
  assert.deepEqual(h.events, []);
  assert.equal(h.captures(), 0);
  assert.equal(h.timerCount(), 0);
});

test('already-ready fonts leave no timer and retain the normal comparison', async () => {
  const h = fixture(); h.fonts.status = 'loaded'; h.ready.resolve(); await h.advance();
  assert.equal(h.outcome.value.ok, true);
  assert.equal(h.outcome.value.elapsedMs, 0);
  assert.equal(h.outcome.value.outputParity.coordinateTolerancePx, 1);
  assert.equal(h.timerCount(), 0);
});

test('the actual post-preflight comparison retains its 1px boundary', async () => {
  const h = fixture(); h.setBlockX(11); h.fonts.status = 'loaded'; h.ready.resolve(); await h.advance();
  assert.equal(h.outcome.value.ok, true);
  assert.equal(h.outcome.value.outputParity.coordinateTolerancePx, 1);
});

test('actual post-preflight geometry drift beyond 1px still rejects after all snapshot gates pass', async () => {
  const h = fixture(); h.setBlockX(11.01); h.fonts.status = 'loaded'; h.ready.resolve(); await h.advance();
  assert.equal(h.outcome.error?.code, 'BLOCK_GEOMETRY_CHANGED');
  assert.ok(Object.values(h.events[0].gates).every(Boolean));
  assert.equal(h.captures(), 1);
  assert.equal(h.timerCount(), 0);
});

for (const state of ['pass', 'fail', 'reject']) {
  test(`the mixed preflight ${state} branch keeps its own readiness and unlock behavior`, async () => {
    const h = fixture({ mixed: state }); await h.advance();
    assert.equal(h.scheduled.some(timer => timer.delay === 5000), false);
    assert.equal(h.events.some(event => typeof event === 'object'), false);
    assert.equal(h.unlocks(), 1);
    assert.equal(h.timerCount(), 0);
    if (state === 'pass') { assert.equal(h.outcome.value.ok, true); assert.equal(h.captures(), 1); }
    else { assert.equal(h.outcome.error?.code, 'SUCCESSFUL_RENDER_PRINT_PREFLIGHT_FAILED'); assert.equal(h.captures(), 0); }
  });
}

test('the actual outer operation bound remains 45000ms when browser evaluation stalls', async () => {
  const h = fixture({ evaluatePending: true });
  await h.advance(44999); assert.equal(h.outcome.settled, false);
  await h.advance(1); assert.equal(h.outcome.error?.code, 'PERFORMANCE_OPERATION_TIMEOUT');
  assert.deepEqual(h.scheduled.map(timer => timer.delay), [45000]);
  assert.equal(h.captures(), 0);
  assert.equal(h.timerCount(), 0);
});

test('an absent optional fonts.ready keeps the existing loaded-state snapshot path', async () => {
  const h = fixture({ noFontsReady: true }); await h.advance();
  assert.equal(h.outcome.value.ok, true);
  assert.equal(h.scheduled.some(timer => timer.delay === 5000), false);
  assert.equal(h.timerCount(), 0);
});
