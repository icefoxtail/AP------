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
