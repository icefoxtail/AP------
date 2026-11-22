const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const vm = require("node:vm");
const core = require("../archive/archive2-core.js");
const Similar = require("../archive/archive2-similar.js");
const { loadWorkspace } = require("./helpers/archive2-workspace-source.cjs");

const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync("archive/data/archive2-catalog.json")));
const pairs = Similar.pairSimilarSets(catalog.exams);
const indexOf = (file) => catalog.exams.findIndex((exam) => exam.file === file);
const originalWith = (min) => [...pairs.similarByOriginal].find(([, sets]) => sets.length >= min)?.[0];

// 학교별 기출 화면을 실제 workspace 스크립트로 올리고, 출제 패널은 열린 인자만 받아 적는 가짜로 둔다.
function load() {
  const events = new Map(), nodes = new Map(), storage = new Map(), opened = [];
  const slot = { innerHTML: "" };
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: "", textContent: "", dataset: {}, hidden: false, open: false,
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() { this.open = true; },
    });
    return nodes.get(id);
  };
  const context = {
    console, crypto, URL, URLSearchParams, structuredClone, Date,
    location: new URL("https://archive.test/archive/workspace.html?view=find&material=exam"),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    atob: (v) => Buffer.from(v, "base64").toString("binary"),
    btoa: (v) => Buffer.from(v, "binary").toString("base64"),
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    open: () => ({}),
    document: {
      baseURI: "https://archive.test/archive/workspace.html",
      getElementById: node, querySelector: (selector) => (selector === "[data-multi-slot]" ? slot : null), querySelectorAll: () => [],
      body: { dataset: {} },
      addEventListener: (name, callback) => {
        if (!events.has(name)) events.set(name, []);
        events.get(name).push(callback);
      },
    },
    addEventListener: (name, callback) => {
      if (!events.has(name)) events.set(name, []);
      events.get(name).push(callback);
    },
    fetch: async () => { throw new Error("unexpected network"); },
    Archive2Core: core,
    Archive2Canonical: core.Canonical,
    ProblemBankMeta: require("../archive/problem-bank-meta.js"),
    Archive2Output: require("../archive/archive2-output.js"),
    Archive2Papers: require("../archive/archive2-papers.js"),
    Archive2History: require("../archive/archive2-history.js"),
    Archive2Source: require("../archive/archive2-source.js"),
    Archive2Similar: Similar,
    Archive2Assign: { open: (o) => opened.push(o), useLegacy: () => false, isOpen: () => false },
  };
  context.window = context;
  const ctx = vm.createContext(context);
  loadWorkspace(ctx, `
    render = () => {};
    globalThis.workspaceTest = { state, findExams, renderFind };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = catalog;
  w.state.catalog.indexVersion = "iv";
  w.state.catalog.sourceHashes = catalog.exams.map((exam) => [exam.file, "hash-" + exam.file]);
  w.state.finderIndex = core.buildFinderIndex(catalog);
  w.state.view = "find";
  w.state.find = { material: "exam" };
  return {
    w, opened, slot, node,
    async click(dataset) {
      for (const callback of events.get("click") || [])
        await callback({ target: { closest: () => ({ dataset }) } });
    },
  };
}
const rowsOf = (markup) => markup.split('<article class="exam-row').slice(1);

test("every original row has a 함께 출제 check, and no bar shows until something is picked", () => {
  const { w } = load();
  const markup = w.renderFind();
  const rows = rowsOf(markup);
  assert.ok(rows.length > 0);
  for (const row of rows) assert.match(row, /data-action="multi-pick" type="button" role="checkbox" aria-checked="false"/);
  assert.doesNotMatch(markup, /multi-assign-bar/);
  assert.match(markup, /data-multi-slot/);
  assert.match(markup, /data-action="source-issue"/, "the one-sheet 출제 button stays");
});

test("picking exams (originals and a similar set) shows the bar, hands items[] of that length to the panel, and survives a filter change", async () => {
  const t = load();
  const [first, second] = t.w.findExams();
  const withSimilar = originalWith(1);
  const set = pairs.setsFor(withSimilar)[0];
  const picks = [first, second, set];
  for (const exam of picks) await t.click({ action: "multi-pick", exam: String(indexOf(exam.file)) });
  assert.match(t.slot.innerHTML, new RegExp(`${picks.length}개 시험지 한꺼번에 출제`));
  assert.match(t.slot.innerHTML, /data-action="multi-pick-clear"/);
  // 필터를 바꿔 다른 목록을 봐도 고른 것은 그대로 남는다.
  t.w.state.find = { material: "exam", grade: "고1" };
  assert.match(t.w.renderFind(), new RegExp(`고른 시험지 ${picks.length}개`));
  await t.click({ action: "multi-assign" });
  assert.equal(t.opened.length, 1);
  const items = t.opened[0].items;
  assert.equal(items.length, picks.length);
  assert.deepEqual([...items.map((item) => item.file)], picks.map((exam) => exam.file));
  assert.ok(items.every((item) => item.kind === "original" && item.sourceHash && item.count > 0 && item.settings.qpp === 4));
  assert.equal(t.opened[0].original.indexVersion, "iv");
  assert.equal(typeof t.opened[0].original.loadQuestions, "function");
});

test("picking again unchecks, 선택 지우기 empties, and the one-sheet 출제 still passes exactly one item", async () => {
  const t = load();
  const [first, second] = t.w.findExams();
  await t.click({ action: "multi-pick", exam: String(indexOf(first.file)) });
  await t.click({ action: "multi-pick", exam: String(indexOf(second.file)) });
  await t.click({ action: "multi-pick", exam: String(indexOf(first.file)) });
  assert.match(t.slot.innerHTML, /고른 시험지 1개/);
  await t.click({ action: "multi-pick-clear" });
  assert.equal(t.slot.innerHTML, "");
  assert.doesNotMatch(t.w.renderFind(), /multi-assign-bar/);
  await t.click({ action: "multi-assign" });
  assert.equal(t.opened.length, 0, "nothing picked: no panel");
  await t.click({ action: "source-issue", exam: String(indexOf(first.file)) });
  assert.equal(t.opened.length, 1);
  assert.equal(t.opened[0].items.length, 1);
  assert.equal(t.opened[0].items[0].file, first.file);
});

test("the similar-set dialog and the single-set cell each carry a check for the set", async () => {
  const t = load();
  const many = originalWith(2);
  assert.ok(many, "the catalog has an exam with two or more similar sets");
  await t.click({ action: "similar-list", exam: String(indexOf(many)) });
  const body = t.node("modal-body").innerHTML;
  for (const set of pairs.setsFor(many))
    assert.match(body, new RegExp(`data-action="multi-pick"[^>]*data-exam="${indexOf(set.file)}"`));
  const one = [...pairs.similarByOriginal].find(([, sets]) => sets.length === 1)[0];
  t.w.state.find = { material: "exam", file: one };
  const row = rowsOf(t.w.renderFind())[0];
  const setIndex = indexOf(pairs.setsFor(one)[0].file);
  assert.match(row.slice(row.indexOf("exam-row-sim has")), new RegExp(`data-action="multi-pick"[^>]*data-exam="${setIndex}"`));
});
