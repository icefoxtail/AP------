const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const vm = require("node:vm");
const core = require("../archive/archive2-core.js");
const Similar = require("../archive/archive2-similar.js");
const { loadWorkspace } = require("./helpers/archive2-workspace-source.cjs");

const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync("archive/data/archive2-catalog.json")));

// 학교별 기출 화면의 유형 · 시험대비 칸을 실제 workspace 스크립트로 그린다(화면 조각은 글자로만 확인).
function load() {
  const node = () => ({
    innerHTML: "", textContent: "", dataset: {}, hidden: false, setAttribute() {}, addEventListener() {},
    querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
  });
  const context = {
    console, crypto, URL, URLSearchParams, structuredClone, Date,
    location: new URL("https://archive.test/archive/workspace.html?view=find&material=types"),
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
    globalThis.workspaceTest = { state, findExams, renderFind, isTypesSet };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = catalog;
  w.state.catalog.indexVersion = "iv";
  w.state.catalog.sourceHashes = catalog.exams.map((exam) => [exam.file, "hash-" + exam.file]);
  w.state.finderIndex = core.buildFinderIndex(catalog);
  w.state.view = "find";
  w.state.find = { material: "types" };
  return w;
}
const rowsOf = (markup) => markup.split('<article class="exam-row').slice(1);
const pressed = (markup, material) =>
  new RegExp(`data-action="material" data-material="${material}" aria-pressed="true"`).test(markup);

test("유형 · 시험대비 칸: types/ 세트만 나오고 유사 시험지(similar/)는 들어가지 않는다", () => {
  const w = load();
  const markup = w.renderFind();
  assert.ok(pressed(markup, "types"));
  assert.ok(!pressed(markup, "nonexam") && !pressed(markup, "exam") && !pressed(markup, "textbook"));
  for (const label of ["학교 기출", "교과서", "유형 · 시험대비", "기출 외 시험지", "전체"]) assert.ok(markup.includes(`>${label}</button>`), label);
  const exams = w.findExams();
  assert.ok(exams.length > 0);
  assert.ok(exams.every((exam) => exam.file.startsWith("types/")), "types/만");
  assert.ok(exams.every((exam) => !exam.file.startsWith("similar/")));
  // 카탈로그의 types/ 세트가 하나도 빠지지 않는다.
  const allTypes = catalog.exams.filter((exam) => exam.file.startsWith("types/"));
  assert.equal(exams.length, allTypes.length);
  assert.ok(catalog.exams.some((exam) => exam.file.startsWith("similar/") && exam.contentType === "유형"), "유사 쪽 유형도 있어야 제외를 확인할 수 있다");
  assert.match(markup, /유형 · 시험대비 [\d,]+개/);
  assert.doesNotMatch(markup, /data-action="finder-axis-quick"/);
  assert.doesNotMatch(markup, /assessment-entry/);
  assert.doesNotMatch(markup, /find-check/);
  // 기출 외 시험지 칸은 그대로 types/ 세트를 포함한다.
  w.state.find = { material: "nonexam" };
  assert.ok(w.findExams().some((exam) => exam.file.startsWith("types/")));
  assert.ok(pressed(w.renderFind(), "nonexam"));
});

test("유형 · 시험대비 줄은 세트 이름이 먼저 읽히고 학년 · 유형 띠가 붙으며 열기 · 출제 · 함께 출제가 그대로다", () => {
  const w = load();
  w.state.find = { material: "types", grade: "중1" };
  const exams = w.findExams();
  assert.ok(exams.length > 0 && exams.every((exam) => exam.grade === "중1"));
  const rows = rowsOf(w.renderFind());
  assert.equal(rows.length, Math.min(18, exams.length));
  for (const row of rows) {
    assert.match(row, /exam-row-year">중1</);
    assert.match(row, /exam-row-grade">유형</);
    for (const mode of ["exam", "sol", "ans"]) assert.match(row, new RegExp(`data-action="source-output-direct" type="button" data-exam="\\d+" data-mode="${mode}"`));
    assert.match(row, /data-action="source-issue"/);
    assert.match(row, /data-action="multi-pick"/);
    assert.doesNotMatch(row, /· 유사/);
  }
  // 실생활 입체도형 세트는 첫 화면의 첫 줄에 이름으로 보인다.
  assert.match(rows[0], /중1 2학기 기말 시험대비 실생활 입체도형/);
});

test("유형 · 시험대비 정렬은 카탈로그의 학기 · 시험 시기(2학기 기말이 위) 다음 이름순이다", () => {
  const w = load();
  const exams = w.findExams();
  const term = (exam) => (Number(exam.semester) || 0) * 2 + (exam.examType === "final" ? 1 : 0);
  for (let i = 1; i < exams.length; i++) assert.ok(term(exams[i - 1]) >= term(exams[i]), `${exams[i - 1].file} → ${exams[i].file}`);
  assert.ok(w.isTypesSet({ file: "types/middle/m1/a.js" }));
  assert.ok(!w.isTypesSet({ file: "similar/a.js" }));
  assert.ok(!w.isTypesSet({ file: "original/a.js" }));
});
