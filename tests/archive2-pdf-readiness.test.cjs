const assert = require("node:assert/strict");
const { test } = require("node:test");
const readiness = require("../archive/archive2-pdf-readiness.js");

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
