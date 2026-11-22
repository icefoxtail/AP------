const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const vm = require("node:vm");
const core = require("../archive/archive2-core.js");
const Similar = require("../archive/archive2-similar.js");
const { loadWorkspace } = require("./helpers/archive2-workspace-source.cjs");

const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync("archive/data/archive2-catalog.json")));

// 학교별 기출 화면의 교과서 칸을 실제 workspace 스크립트로 그린다(화면 조각은 글자로만 확인).
function load() {
  const node = () => ({
    innerHTML: "", textContent: "", dataset: {}, hidden: false, setAttribute() {}, addEventListener() {},
    querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
  });
  const context = {
    console, crypto, URL, URLSearchParams, structuredClone, Date,
    location: new URL("https://archive.test/archive/workspace.html?view=find&material=textbook"),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    atob: (v) => Buffer.from(v, "base64").toString("binary"),
    btoa: (v) => Buffer.from(v, "binary").toString("base64"),
    localStorage: { getItem: () => null, setItem() {} },
    open: () => ({}),
    document: {
      baseURI: "https://archive.test/archive/workspace.html",
      getElementById: node, querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} },
      addEventListener() {},
    },
    addEventListener() {},
    fetch: async () => { throw new Error("unexpected network"); },
    Archive2Core: core,
    Archive2Canonical: core.Canonical,
    ProblemBankMeta: require("../archive/problem-bank-meta.js"),
    Archive2Output: require("../archive/archive2-output.js"),
    Archive2Papers: require("../archive/archive2-papers.js"),
    Archive2History: require("../archive/archive2-history.js"),
    Archive2Source: require("../archive/archive2-source.js"),
    Archive2Similar: Similar,
    Archive2Assign: { open() {}, useLegacy: () => false, isOpen: () => false },
  };
  context.window = context;
  const ctx = vm.createContext(context);
  loadWorkspace(ctx, `
    render = () => {};
    globalThis.workspaceTest = { state, findExams, renderFind, textbookParts, applyFinderFilterChange };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = catalog;
  w.state.catalog.indexVersion = "iv";
  w.state.catalog.sourceHashes = catalog.exams.map((exam) => [exam.file, "hash-" + exam.file]);
  w.state.finderIndex = core.buildFinderIndex(catalog);
  w.state.view = "find";
  w.state.find = { material: "textbook" };
  return w;
}
const rowsOf = (markup) => markup.split('<article class="exam-row').slice(1);
const pressed = (markup, material) =>
  new RegExp(`data-action="material" data-material="${material}" aria-pressed="true"`).test(markup);

test("교과서 칸: 네 칸 줄에서 교과서만 눌려 있고 교과서 줄만 나온다", () => {
  const w = load();
  const markup = w.renderFind();
  assert.ok(pressed(markup, "textbook"));
  assert.ok(!pressed(markup, "nonexam") && !pressed(markup, "exam"));
  for (const label of ["학교 기출", "교과서", "기출 외 시험지", "전체"]) assert.ok(markup.includes(`>${label}</button>`), label);
  const exams = w.findExams();
  assert.ok(exams.length > 0);
  assert.ok(exams.every((exam) => exam.contentType === "교과서"));
  assert.match(markup, /교과서 [\d,]+개/);
  // 시험 시기 단추·평가 보관함 입구는 교과서에 필요 없다.
  assert.doesNotMatch(markup, /data-action="finder-axis-quick"/);
  assert.doesNotMatch(markup, /assessment-entry/);
  // 학교 기출 칸은 예전 그대로다(시험 시기 단추, 교과서 줄 없음).
  w.state.find = { material: "exam" };
  const exam = w.renderFind();
  assert.ok(pressed(exam, "exam"));
  assert.match(exam, /data-action="finder-axis-quick"/);
  assert.doesNotMatch(exam, /exam-row-tbhead/);
});

test("교과서 줄은 출판사 · 과목이 단원 이름 위에 먼저 읽히고 시험지·해설·정답·출제·함께 출제는 그대로다", () => {
  const w = load();
  const rows = rowsOf(w.renderFind());
  assert.ok(rows.length > 0);
  for (const row of rows) {
    const head = row.match(/class="exam-row-tbhead">([^<]+)</)?.[1];
    assert.ok(head && /^\S+ · \S/.test(head), "출판사 · 과목: " + head);
    assert.ok(row.indexOf("exam-row-tbhead") < row.indexOf("exam-row-title"), "머리줄이 단원 이름보다 앞");
    assert.match(row, /exam-row-year">고[12]</);
    assert.match(row, /exam-row-grade">교과서</);
    for (const mode of ["exam", "sol", "ans"]) assert.match(row, new RegExp(`data-action="source-output-direct" type="button" data-exam="\\d+" data-mode="${mode}"`));
    assert.match(row, /data-action="source-issue"/);
    assert.match(row, /data-action="multi-pick"/);
  }
  // 단원 이름에는 출판사·과목 낱말이 되풀이되지 않는다(카탈로그 전체 교과서 줄).
  const exams = w.findExams();
  for (const exam of exams) {
    const { publisher, subject, unit } = w.textbookParts(exam);
    assert.ok(publisher && subject && unit, exam.file);
    assert.ok(!unit.startsWith(publisher.slice(0, 2)), `${exam.file}: ${unit}`);
    assert.ok(!unit.replace(/\s/g, "").startsWith(subject.replace(/\s/g, "")), `${exam.file}: ${unit}`);
  }
});

test("출판사 단추는 학교 조건 하나로 목록을 줄이고, 과목 → 출판사 → 단원 순으로 둔다", () => {
  const w = load();
  const markup = w.renderFind();
  const publishers = [...markup.matchAll(/data-publisher="([^"]+)"/g)].map((m) => m[1]).filter(Boolean);
  assert.ok(publishers.length >= 2);
  const all = w.findExams();
  const order = ["공통수학1", "공통수학2", "대수", "미적분I", "확률과 통계", "기하"];
  const subjects = all.map((exam) => order.indexOf(w.textbookParts(exam).subject));
  assert.ok(subjects.every((at) => at >= 0));
  assert.deepEqual([...subjects], [...subjects].sort((a, b) => a - b), "과목 순서");
  w.state.find = { material: "textbook", school: publishers[0] };
  const picked = w.findExams();
  assert.ok(picked.length > 0 && picked.length < all.length);
  assert.ok(picked.every((exam) => exam.school === publishers[0]));
  assert.match(w.renderFind(), new RegExp(`data-publisher="${publishers[0]}" aria-pressed="true"`));
});
