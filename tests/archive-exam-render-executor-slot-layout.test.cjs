const assert = require("node:assert/strict");
const { test } = require("node:test");
const { buildSlotPages } = require("../archive/exam-render-executor.js");

test("shared fast renderer keeps QPP 1 subjective-slot pages to one question", () => {
  const items = [
    { q: { layoutTag: "subjective-2up" }, box: {} },
    { q: { layoutTag: "subjective-4up" }, box: {} },
    { q: { layoutTag: "subjective-2up" }, box: {} },
  ];

  const pages = buildSlotPages(items, 1);
  assert.equal(pages.length, 3);
  assert.deepEqual(pages.map(page => page.placements.length), [1, 1, 1]);
  assert.ok(pages.every(page => page.placements[0].col === 0));

  const twoPerPage = buildSlotPages(items, 2);
  assert.deepEqual(twoPerPage.map(page => page.placements.length), [2, 1]);
});
