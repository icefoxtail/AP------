// ?assign=legacy(옛 출제 화면으로 되돌리는 스위치)는 워크스페이스가 시작할 때 주소를 다시 써도 유지되어야 한다.
// 실제 workspace 스크립트를 불러와 주소 재작성(replaceState/pushState)을 실제처럼 location에 반영하며 확인한다.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const crypto = require("node:crypto");
const Assign = require("../archive/archive2-assign.js");
const core = require("../archive/archive2-core.js");

const FILE = "2025/왕운중-중1-1학기-중간.js";
const EXAM = { file: FILE, school: "왕운중", grade: "중1", year: "2025", semester: 1, examType: "mid", contentType: "기출", subject: "중1 수학", qCount: 3, identityTitle: "t" };

function load(search) {
  const events = new Map(), nodes = new Map(), storage = new Map();
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: "", textContent: "", dataset: {}, hidden: false, open: false,
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() { this.open = true; },
    });
    return nodes.get(id);
  };
  const opened = [], legacy = [], pushes = [], replaces = [];
  const context = {
    console, crypto, URL, URLSearchParams, structuredClone, Date,
    location: new URL("https://archive.test/archive/workspace.html" + search),
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    atob: (v) => Buffer.from(v, "base64").toString("binary"),
    btoa: (v) => Buffer.from(v, "binary").toString("base64"),
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    open: () => ({}),
    document: {
      baseURI: "https://archive.test/archive/workspace.html", activeElement: { id: "opener" },
      getElementById: node, querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} },
      addEventListener: (name, callback) => { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    },
    addEventListener: (name, callback) => { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    fetch: async () => { throw new Error("unexpected network"); },
    Archive2Core: core, Archive2Canonical: core.Canonical,
    ProblemBankMeta: require("../archive/problem-bank-meta.js"),
    Archive2Output: require("../archive/archive2-output.js"),
    Archive2Papers: require("../archive/archive2-papers.js"),
    Archive2History: require("../archive/archive2-history.js"),
    Archive2Source: require("../archive/archive2-source.js"),
    Archive2Similar: require("../archive/archive2-similar.js"),
    Archive2Assign: { open: (o) => opened.push(o), useLegacy: Assign.useLegacy, isOpen: () => false },
  };
  // 실제 브라우저처럼 주소 변경이 location에 반영된다.
  context.history = {
    state: null,
    pushState(s, t, url) { pushes.push(String(url)); context.location = new URL(String(url), context.location); },
    replaceState(s, t, url) { replaces.push(String(url)); context.location = new URL(String(url), context.location); },
  };
  context.window = context;
  const ctx = vm.createContext(context);
  const source = fs.readFileSync("archive/archive2-workspace.js", "utf8");
  const startup = source.lastIndexOf("  (async () => {");
  assert.ok(startup > 0);
  vm.runInContext(source.slice(0, startup) + `
    render = () => {};
    openOriginalIssue = (exam, step) => { globalThis.__legacy.push(["original", exam.file, step]); };
    openSavedPaperIssue = (id) => { globalThis.__legacy.push(["saved", id]); };
    globalThis.workspaceTest = { state, routeUrl, replaceUrlState, replaceFinderUrlState, openOriginalAssign, openSavedPaperAssign,
      showSavedLibrary, openRouteInPage };
  })();`, Object.assign(ctx, { __legacy: legacy }));
  const w = ctx.workspaceTest;
  w.state.catalog = { indexVersion: "iv", sourceHashes: [[FILE, "hash"]], exams: [EXAM] };
  w.state.view = "find";
  return { w, ctx, opened, legacy, pushes, replaces, loc: () => ctx.location };
}

test("assign=legacy는 시작할 때 읽어 두고, 주소를 다시 써도(replaceState) 주소에 남는다", async () => {
  const h = load("?view=find&assign=legacy&material=exam");
  assert.equal(h.w.state.assignLegacy, true);
  // 실제 시작 흐름이 하는 일: 주소를 routeUrl()로 다시 쓴다
  h.w.replaceUrlState();
  assert.equal(h.loc().searchParams.get("assign"), "legacy", "다시 쓴 주소에도 남는다");
  assert.equal(h.loc().searchParams.get("view"), "find");
  h.w.replaceFinderUrlState();
  assert.equal(h.loc().searchParams.get("assign"), "legacy");
  // 화면을 옮겨도(pushState) 남는다
  h.w.state.view = "saved";
  h.w.showSavedLibrary();
  assert.equal(h.loc().searchParams.get("view"), "saved");
  assert.equal(h.loc().searchParams.get("assign"), "legacy");
  assert.ok(h.pushes.every((url) => /assign=legacy/.test(url)));
  // 같은 페이지 안 이동(메뉴)도 유지한다
  assert.equal(h.w.openRouteInPage("workspace.html?view=compose"), true);
  assert.equal(h.loc().searchParams.get("assign"), "legacy");
});

test("주소가 다시 쓰여 location.search에서 사라진 뒤에도 원본·저장본 출제는 옛 iframe으로 간다", async () => {
  const h = load("?view=find&assign=legacy&material=exam");
  // 주소가 다시 쓰여 assign이 사라진 상태를 만든다(옛 버그의 상황)
  h.ctx.location = new URL("https://archive.test/archive/workspace.html?view=find&material=exam");
  assert.equal(h.ctx.location.searchParams.has("assign"), false);
  h.w.openOriginalAssign(EXAM);
  await h.w.openSavedPaperAssign("00000000-0000-4000-8000-000000000001", { papers: [{ id: "00000000-0000-4000-8000-000000000001", title: "t", question_count: 3 }] });
  assert.deepEqual(JSON.parse(JSON.stringify(h.legacy)), [["original", FILE, "targets"], ["saved", "00000000-0000-4000-8000-000000000001"]]);
  assert.equal(h.opened.length, 0, "새 패널은 열리지 않는다");
});

test("스위치가 없으면 주소에 assign이 붙지 않고 새 패널이 열린다", async () => {
  const h = load("?view=find&material=exam");
  assert.equal(h.w.state.assignLegacy, false);
  h.w.replaceUrlState();
  assert.equal(h.loc().searchParams.has("assign"), false);
  h.w.openOriginalAssign(EXAM);
  assert.equal(h.opened.length, 1);
  assert.equal(h.legacy.length, 0);
  // 주소를 직접 바꿔 넣은 경우(다른 값)는 스위치가 아니다
  assert.equal(load("?view=find&assign=new").w.state.assignLegacy, false);
});
