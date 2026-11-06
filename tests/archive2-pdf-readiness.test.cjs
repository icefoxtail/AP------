const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { test } = require("node:test");
const readiness = require("../archive/archive2-pdf-readiness.js");

function trackedReadiness() {
  const timers = new Set(), listeners = new Set();
  const controller = new AbortController();
  const signal = {
    get aborted() { return controller.signal.aborted; },
    addEventListener(type, callback, options) { listeners.add(callback); controller.signal.addEventListener(type, callback, options); },
    removeEventListener(type, callback) { listeners.delete(callback); controller.signal.removeEventListener(type, callback); }
  };
  const context = { module: { exports: {} },
    setTimeout(callback, delay) { const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay); timers.add(timer); return timer; },
    clearTimeout(timer) { timers.delete(timer); clearTimeout(timer); }
  };
  vm.runInNewContext(fs.readFileSync(require.resolve('../archive/archive2-pdf-readiness.js'), 'utf8'), context);
  return { api: context.module.exports, timers, listeners, controller, signal };
}

async function promptly(promise) {
  let timer;
  try {
    return await Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('CANCELLATION_DID_NOT_SETTLE')), 500); })]);
  } finally { clearTimeout(timer); }
}

function fakePage({ clipped = false } = {}) {
  const questionBox = {
    className: "q-box",
    clientHeight: 40,
    scrollHeight: clipped ? 500 : 40,
    clientWidth: 180,
    scrollWidth: 180,
    overflowX: "hidden",
    overflowY: "hidden",
  };
  const page = {
    clientHeight: 240,
    scrollHeight: 240,
    clientWidth: 300,
    scrollWidth: 300,
    querySelectorAll: () => [questionBox],
  };
  const printArea = { querySelectorAll: () => [page] };
  const document = {
    fonts: { ready: Promise.resolve() },
    getElementById: () => printArea,
    querySelectorAll: (selector) => selector.endsWith(" img")
      ? []
      : selector.endsWith(".page *") ? [questionBox] : [page],
  };
  const window = {
    getComputedStyle: (element) => ({
      overflowX: element.overflowX || "visible",
      overflowY: element.overflowY || "visible",
    }),
  };
  return { document, window };
}

test("PDF readiness rejects clipped question containers even when the page itself fits", async () => {
  const { document, window } = fakePage({ clipped: true });
  await assert.rejects(
    readiness.assertReady(null, { document, window }),
    /content clipped inside 1 element/,
  );
});

test("PDF readiness accepts question containers with no hidden overflow", async () => {
  const { document, window } = fakePage();
  const result = await readiness.assertReady(null, { document, window });
  assert.equal(result.pageCount, 1);
});

test("the synchronous commit gate enforces the same attached layout checks", () => {
  assert.throws(() => readiness.assertLayoutReady(fakePage({ clipped: true })), /content clipped inside 1 element/);
  assert.deepEqual(readiness.assertLayoutReady(fakePage()), { pageCount: 1 });
});

test("a finalizer uses its validated result without waiting on its own pending public promise", async () => {
  const h = fakePage();
  const identity = { contractVersion: 'contract', outputRequestId: 'request', payloadHash: 'hash' };
  h.window.__AP_RENDER_READY__ = new Promise(() => {});
  h.window.__AP_OUTPUT_ENVELOPE_READY__ = identity;
  const options = { ...h, renderOutcome: { ok: true, pages: 1 }, renderTimeoutMs: 5 };
  assert.equal((await readiness.assertReady(identity, options)).pageCount, 1);
  await assert.rejects(readiness.assertReady(identity, { ...options, renderOutcome: { ok: false, pages: 1 } }), /render did not complete/);
  await assert.rejects(readiness.assertReady({ ...identity, outputRequestId: 'wrong' }, options), /verified envelope does not match/);
});

test("the internal render result still runs font, image decode and clipping gates", async () => {
  const clipped = fakePage({ clipped: true });
  await assert.rejects(readiness.assertReady(null, { ...clipped, renderOutcome: { ok: true, pages: 1 } }), /content clipped/);
  const fonts = fakePage();
  fonts.document.fonts.ready = Promise.reject(new Error('FONT_FAILED'));
  await assert.rejects(readiness.assertReady(null, { ...fonts, renderOutcome: { ok: true, pages: 1 } }), /FONT_FAILED/);
  const image = fakePage();
  const query = image.document.querySelectorAll;
  image.document.querySelectorAll = selector => selector.endsWith(' img')
    ? [{ complete: true, naturalWidth: 10, naturalHeight: 10, decode: async () => { throw new Error('DECODE_FAILED'); } }]
    : query(selector);
  await assert.rejects(readiness.assertReady(null, { ...image, renderOutcome: { ok: true, pages: 1 } }), /DECODE_FAILED/);
});

test("aborting a pending decode rejects promptly without resolving it and releases timers/listeners", async () => {
  const tracked = trackedReadiness(), h = fakePage();
  let enterDecode, rejectDecode;
  const entered = new Promise(resolve => { enterDecode = resolve; });
  const nativeDecode = new Promise((_, reject) => { rejectDecode = reject; });
  const query = h.document.querySelectorAll;
  h.document.querySelectorAll = selector => selector.endsWith(' img')
    ? [{ complete: true, naturalWidth: 10, naturalHeight: 10, decode() { enterDecode(); return nativeDecode; } }]
    : query(selector);
  const pending = tracked.api.assertReady(null, { ...h, signal: tracked.signal, renderOutcome: { ok: true, pages: 1 } });
  await entered;
  assert.ok(tracked.timers.size > 0);
  tracked.controller.abort();
  await assert.rejects(promptly(pending), error => error.code === 'DISCARDED_STALE');
  assert.equal(tracked.timers.size, 0);
  assert.equal(tracked.listeners.size, 0);
  // The discarded native operation is still observed, even if it fails later.
  rejectDecode(new Error('LATE_NATIVE_DECODE_REJECTION'));
  await new Promise(setImmediate);
});

test("aborting image loading removes its native load and error listeners too", async () => {
  const tracked = trackedReadiness(), h = fakePage(), imageListeners = new Map();
  let enterLoad;
  const entered = new Promise(resolve => { enterLoad = resolve; });
  const query = h.document.querySelectorAll;
  h.document.querySelectorAll = selector => selector.endsWith(' img') ? [{ complete: false,
    addEventListener(type, callback) { imageListeners.set(type, callback); if (type === 'error') enterLoad(); },
    removeEventListener(type, callback) { if (imageListeners.get(type) === callback) imageListeners.delete(type); }
  }] : query(selector);
  const pending = tracked.api.assertReady(null, { ...h, signal: tracked.signal });
  await entered;
  tracked.controller.abort();
  await assert.rejects(promptly(pending), /DISCARDED_STALE/);
  assert.equal(imageListeners.size, 0);
  assert.equal(tracked.timers.size, 0);
  assert.equal(tracked.listeners.size, 0);
});

test("an active decode still enforces its existing timeout and releases resources", async () => {
  const tracked = trackedReadiness(), h = fakePage();
  const query = h.document.querySelectorAll;
  h.document.querySelectorAll = selector => selector.endsWith(' img')
    ? [{ complete: true, naturalWidth: 10, naturalHeight: 10, decode: () => new Promise(() => {}) }]
    : query(selector);
  await assert.rejects(tracked.api.assertReady(null, { ...h, signal: tracked.signal, decodeTimeoutMs: 5 }), /required image 1 decode timed out/);
  assert.equal(tracked.timers.size, 0);
  assert.equal(tracked.listeners.size, 0);
});
