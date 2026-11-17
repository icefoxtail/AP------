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

test("a question that cannot fit its slot is moved to its own wide page without touching the others", () => {
  const items = [1, 2, 3, 4, 5, 6].map(no => ({ q: { layoutTag: "", no }, box: {} }));
  items[0].q.layoutTag = "subjective-2up";
  const before = buildSlotPages(items, 4);
  assert.ok(before.every(page => !page.wideItem));

  const after = buildSlotPages(items, 4, new Set([items[2]]));
  const wide = after.filter(page => page.wideItem);
  assert.equal(wide.length, 1);
  assert.equal(wide[0].wideItem, items[2]);
  const placed = after.flatMap(page => page.wideItem ? [page.wideItem] : page.placements.map(entry => entry.item));
  assert.equal(placed.length, items.length, "no question is dropped or duplicated");
  assert.deepEqual(
    buildSlotPages(items, 4, new Set()).map(page => page.placements.length),
    before.map(page => page.placements.length),
    "an empty fallback set leaves the layout unchanged");
});
