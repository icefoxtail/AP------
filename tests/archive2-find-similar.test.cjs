const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const crypto = require("node:crypto");
const core = require("../archive/archive2-core.js");
const Similar = require("../archive/archive2-similar.js");

const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync("archive/data/archive2-catalog.json")));
const pairs = Similar.pairSimilarSets(catalog.exams);
const indexOf = (file) => catalog.exams.findIndex((exam) => exam.file === file);
const originalWith = (count) =>
  [...pairs.similarByOriginal].find(([, sets]) => sets.length === count)?.[0];
const originalWithout = () =>
  catalog.exams.find((exam) => exam.contentType === "기출" && !pairs.setsFor(exam.file).length);

// Loads the real workspace script (minus its network bootstrap) against the real catalog.
function load(search = "?view=find&material=exam") {
  const events = new Map(), nodes = new Map(), storage = new Map(), opened = [];
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
    location: new URL("https://archive.test/archive/workspace.html" + search),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    atob: (v) => Buffer.from(v, "base64").toString("binary"),
    btoa: (v) => Buffer.from(v, "binary").toString("base64"),
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    open: (url) => { opened.push(String(url)); return {}; },
    document: {
      baseURI: "https://archive.test/archive/workspace.html",
      getElementById: node, querySelector: () => null, querySelectorAll: () => [],
      body: { dataset: {} },
      addEventListener: (name, callback) => {
        if (!events.has(name)) events.set(name, []);
        events.get(name).push(callback);
      },
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
  };
  context.window = context;
  const ctx = vm.createContext(context);
  const source = fs.readFileSync("archive/archive2-workspace.js", "utf8");
  const startup = source.lastIndexOf("  (async () => {");
  assert.ok(startup > 0);
  vm.runInContext(source.slice(0, startup) + `
    render = () => {};
    globalThis.workspaceTest = { state, findExams, renderFind, renderHome, renderUnlinkedSimilar, routeUrl, readUrl,
      rememberRecentExam, findSummaryText };
  })();`, ctx);
  const w = ctx.workspaceTest;
  w.state.catalog = catalog;
  w.state.finderIndex = core.buildFinderIndex(catalog);
  w.state.view = "find";
  w.state.find = { material: "exam" };
  return {
    w, ctx, opened, nodes: nodes, node,
    async click(dataset) {
      for (const callback of events.get("click") || [])
        await callback({ target: { closest: () => ({ dataset }) } });
    },
    async change(filter, value, checked) {
      for (const callback of events.get("change") || [])
        await callback({ target: { dataset: { group: "find", filter }, value, checked, type: checked === undefined ? "text" : "checkbox" } });
    },
  };
}
const rowsOf = (markup) => markup.split('<article class="exam-row').slice(1)
  .map((row) => '<article class="exam-row' + row.slice(0, row.indexOf("</article>") + 10));
const dataExam = (row, action) => new RegExp(`data-action="${action}"[^>]*data-exam="(\\d+)"`).exec(row)?.[1];

test("the finder lists original exams by default, newest year first, one row each", () => {
  const { w } = load();
  const exams = w.findExams();
  assert.ok(exams.length > 100);
  assert.ok(exams.every((exam) => exam.contentType === "기출"));
  const years = exams.map((exam) => Number(exam.year) || 0);
  for (let i = 1; i < years.length; i++) assert.ok(years[i - 1] >= years[i], `year order breaks at ${i}`);
  const rows = rowsOf(w.renderFind());
  assert.equal(rows.length, 18);
  assert.match(w.renderFind(), /<h1>학교별 기출<\/h1>/);
  assert.match(w.renderFind(), /data-action="go-compose"/);
});

test("a row with one similar set shows 열기 and 출제 for that set's file; the exam's own buttons stay on the exam", () => {
  const { w } = load();
  const file = originalWith(1);
  const exam = catalog.exams[indexOf(file)];
  const set = pairs.setsFor(file)[0];
  w.state.find = { material: "exam", file: exam.file };
  const row = rowsOf(w.renderFind())[0];
  assert.match(row, /class="exam-row-sim has"/);
  assert.match(row, /유사문제<\/strong> <span>· \d+문항<\/span>/);
  const sim = row.slice(row.indexOf('class="exam-row-sim has"'));
  assert.equal(dataExam(sim, "source-output-direct"), String(indexOf(set.file)));
  assert.match(sim, new RegExp(`data-action="source-output-direct"[^>]*data-exam="${indexOf(set.file)}" data-mode="exam"[^>]*>열기<`));
  assert.match(sim, new RegExp(`data-action="source-issue"[^>]*data-exam="${indexOf(set.file)}"[^>]*>출제<`));
  const main = row.slice(0, row.indexOf('class="exam-row-sim has"'));
  assert.equal((main.match(new RegExp(`data-exam="${indexOf(exam.file)}"`, "g")) || []).length >= 5, true);
  assert.doesNotMatch(main, new RegExp(`data-exam="${indexOf(set.file)}"`), "the exam side must not point at the set");
  assert.match(main, /반에 출제/);
});

test("a row with two or more sets shows the count and a 보기 button, and the dialog lists each set with four buttons", async () => {
  const t = load();
  const file = originalWith(2) || originalWith(3);
  assert.ok(file, "the catalog has an exam with two similar sets");
  const sets = pairs.setsFor(file);
  t.w.state.find = { material: "exam", file };
  const row = rowsOf(t.w.renderFind())[0];
  assert.match(row, new RegExp(`유사문제</strong> <span>${sets.length}세트</span>`));
  assert.match(row, new RegExp(`data-action="similar-list"[^>]*data-exam="${indexOf(file)}"`));
  assert.doesNotMatch(row.slice(row.indexOf("exam-row-sim")), />열기</);
  await t.click({ action: "similar-list", exam: String(indexOf(file)) });
  const body = t.node("modal-body").innerHTML;
  assert.equal((body.match(/class="similar-set"/g) || []).length, sets.length);
  assert.doesNotMatch(body.replace(/aria-label="[^"]*"|title="[^"]*"/g, ""), /\d{2}_[가-힣]|\.js\b/, "no file name in the teacher dialog");
  assert.match(body, /<div class="muted">[^<]*\d+문항<\/div>/);
  for (const set of sets) {
    const index = indexOf(set.file);
    for (const mode of ["exam", "sol", "ans"])
      assert.match(body, new RegExp(`data-action="source-output-direct"[^>]*data-exam="${index}" data-mode="${mode}"`));
    assert.match(body, new RegExp(`data-action="source-issue"[^>]*data-exam="${index}"`));
  }
});

test("a row without a similar set says so and has no button for it", () => {
  const { w } = load();
  const exam = originalWithout();
  w.state.find = { material: "exam", file: exam.file };
  const row = rowsOf(w.renderFind())[0];
  assert.match(row, /class="exam-row-sim none">유사문제 없음</);
  assert.doesNotMatch(row, /exam-row-sim-actions|similar-list|>열기</);
  assert.match(row, /data-similar-count="0"/);
});

test("the 열기 / 출제 of a similar set call the existing actions with the set's file", async () => {
  const t = load();
  const set = pairs.setsFor(originalWith(1))[0];
  await t.click({ action: "source-output-direct", exam: String(indexOf(set.file)), mode: "exam" });
  assert.equal(t.opened.length, 1);
  const url = new URL(t.opened[0]);
  assert.equal(url.pathname.split("/").pop(), "engine.html");
  assert.equal(url.searchParams.get("data"), "exams/" + set.file);
  assert.equal(url.searchParams.get("mode"), "exam");
  await t.click({ action: "source-issue", exam: String(indexOf(set.file)) });
  assert.match(t.node("modal-body").innerHTML, new RegExp("archive2Issue=" + encodeURIComponent(set.file).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("opening a similar set counts as opening its exam on the home list", async () => {
  const t = load();
  const file = originalWith(1);
  const set = pairs.setsFor(file)[0];
  await t.click({ action: "source-output-direct", exam: String(indexOf(set.file)), mode: "exam" });
  const stored = JSON.parse(t.ctx.localStorage.getItem("APMATH_ARCHIVE2_RECENT_EXAMS_v1"));
  assert.equal(stored[0].file, file);
});

test('"유사문제 있는 시험만" keeps exactly the exams that have a pair, and clears with 조건 지우기', async () => {
  const t = load();
  const all = t.w.findExams().length;
  await t.change("similarOnly", "on", true);
  assert.equal(t.w.state.find.similarOnly, "1");
  const kept = t.w.findExams();
  assert.equal(kept.length, pairs.stats.originalsWithSimilar);
  assert.ok(kept.length > 0 && kept.length < all);
  assert.ok(kept.every((exam) => pairs.setsFor(exam.file).length > 0));
  assert.match(t.w.renderFind(), /type="checkbox" data-filter="similarOnly" data-group="find" checked/);
  assert.match(t.w.renderFind(), /유사문제 있는 시험 \d+개/);
  assert.match(t.w.routeUrl().search, /similarOnly=1/);
  await t.click({ action: "finder-reset" });
  assert.equal(t.w.state.find.similarOnly, "");
  assert.equal(t.w.findExams().length, all);
});

test("grade buttons set the grade filter and a second press clears it; terms still toggle", async () => {
  const t = load();
  const markup = t.w.renderFind();
  for (const grade of ["중1", "중2", "중3", "고1", "고2", "고3"])
    assert.match(markup, new RegExp(`data-action="finder-grade"[^>]*data-grade="${grade}" aria-pressed="false"`));
  await t.click({ action: "finder-grade", grade: "고1" });
  assert.equal(t.w.state.find.grade, "고1");
  assert.ok(t.w.findExams().length > 0 && t.w.findExams().every((exam) => exam.grade === "고1"));
  assert.match(t.w.renderFind(), /data-grade="고1" aria-pressed="true"/);
  await t.click({ action: "finder-grade", grade: "고1" });
  assert.equal(t.w.state.find.grade, "");
  await t.click({ action: "finder-axis-quick", axis: "2-mid" });
  assert.ok(t.w.findExams().every((exam) => exam.semester === "2" && exam.examType === "mid"));
  assert.match(t.w.renderFind(), /data-axis="2-mid" aria-pressed="true"/);
  await t.click({ action: "finder-axis-quick", axis: "2-mid" });
  assert.equal(t.w.state.find.axis, "");
});

test("the filters that moved into the fold still work: curriculum, subject, school, year range", async () => {
  const t = load();
  const markup = t.w.renderFind();
  const fold = markup.slice(markup.indexOf('<details class="find-more"'), markup.indexOf("</details>", markup.indexOf('<details class="find-more"')));
  for (const filter of ["curriculumKey", "school", "yearFrom", "yearTo"])
    assert.match(fold, new RegExp(`data-filter="${filter}" data-group="find"`), filter);
  assert.match(fold, /data-filter="(semanticSubject|courseKey)" data-group="find"/);
  assert.match(fold, /과목 · 학교 · 연도|<summary>과목 · 학교 · 연도<\/summary>/);
  const before = t.w.findExams().length;
  await t.change("school", "순천고");
  assert.ok(t.w.findExams().length > 0 && t.w.findExams().length < before);
  assert.ok(t.w.findExams().every((exam) => exam.school === "순천고"));
  await t.change("yearFrom", "2025");
  assert.ok(t.w.findExams().every((exam) => Number(exam.year) >= 2025));
  await t.change("yearTo", "2025");
  assert.ok(t.w.findExams().every((exam) => Number(exam.year) === 2025));
  await t.change("curriculumKey", "2022");
  assert.ok(t.w.findExams().length > 0);
  assert.match(t.w.renderFind(), /<details class="find-more" open>/, "an active fold filter keeps the fold open");
});

test("the search box matches several words together (school, grade, term in any order)", async () => {
  const t = load();
  t.w.state.find = { material: "exam", query: "순천고 고1" };
  const exams = t.w.findExams();
  assert.ok(exams.length > 0 && exams.every((exam) => exam.school === "순천고" && exam.grade === "고1"));
  const summary = t.w.findSummaryText(t.w.state.find, exams.length);
  assert.equal(summary, `순천고 고1 기출 ${exams.length}개`);
  assert.match(t.w.renderFind(), /placeholder="순천고 고1 1학기 중간"/);
  assert.match(t.w.renderFind(), /data-action="finder-search"[^>]*>찾기</);
});

test("the three material views stay, the default is 학교 기출, and 전체 is remembered in the address", () => {
  const t = load("?view=find");
  t.w.readUrl();
  assert.equal(t.w.state.find.material, "exam");
  const markup = t.w.renderFind();
  for (const label of ["학교 기출", "기출 외 시험지", "전체"]) assert.match(markup, new RegExp(`data-action="material"[^>]*>${label}<`));
  assert.match(markup, /data-material="exam" aria-pressed="true"/);
  t.w.state.find.material = "";
  assert.match(t.w.routeUrl().search, /material=all/);
  const again = load("?view=find&material=all");
  again.w.readUrl();
  assert.equal(again.w.state.find.material, "");
  const file = load("?view=find&file=" + encodeURIComponent(pairs.setsFor(originalWith(1))[0].file));
  file.w.readUrl();
  assert.notEqual(file.w.state.find.material, "exam", "a link to one file does not hide it behind 학교 기출");
});

test("a one-exam link shows the exam's title in the active filter, not its file name", () => {
  const t = load();
  const exam = catalog.exams[indexOf(originalWith(1))];
  t.w.state.find = { material: "exam", file: exam.file };
  const markup = t.w.renderFind();
  const chip = /<span class="finder-chip">시험지 ([^<]*)<\/span>/.exec(markup)?.[1];
  assert.ok(chip && !chip.includes("_") && !chip.includes(".js"), chip);
});

test("a similar set listed on its own says which exam it belongs to when it is linked", () => {
  const t = load();
  const set = pairs.setsFor(originalWith(1))[0];
  t.w.state.find = { material: "nonexam", file: set.file };
  const row = rowsOf(t.w.renderFind())[0];
  assert.match(row, /exam-row-tag">[^<]+ 기출의 유사문제</);
  assert.doesNotMatch(row, /exam-row-sim/);
  const unlinked = pairs.unlinked[0]?.exam;
  if (unlinked) {
    t.w.state.find = { material: "nonexam", file: unlinked.file };
    assert.doesNotMatch(rowsOf(t.w.renderFind())[0], /exam-row-tag/);
  }
});

test("home rows use the same row with the similar-problem cell, and the hint says so", () => {
  const t = load("?view=home");
  const file = originalWith(1);
  t.w.rememberRecentExam(catalog.exams[indexOf(file)], Date.now());
  const markup = t.w.renderHome();
  assert.match(markup, /유사문제가 있는 기출은 옆에 함께 나옵니다\./);
  const row = rowsOf(markup)[0];
  assert.match(row, /exam-row-title/);
  assert.match(row, /class="exam-row-sim has"/);
  assert.match(row, /오늘/);
  assert.doesNotMatch(row, /finder-card-more/, "the 더보기 menu belongs to 학교별 기출 only");
  // The same function draws a finder row: identical markup apart from range, 더보기 and the day label.
  t.w.state.find = { material: "exam", file };
  const finderRow = rowsOf(t.w.renderFind())[0];
  const strip = (html) => html.replace(/<details class="finder-card-more">.*?<\/details>/s, "").replace(/<div class="exam-row-range">.*?<\/div>/s, "").replace(/ · 오늘/, "").replace(/\s+/g, " ");
  assert.equal(strip(row), strip(finderRow));
});

test("the 자료 점검 screen lists the unlinked similar sets at the bottom", () => {
  const { w } = load("?view=health");
  const markup = w.renderUnlinkedSimilar();
  assert.match(markup, new RegExp(`원본 기출과 연결되지 않은 유사문제 ${pairs.unlinked.length}개`));
  if (pairs.unlinked.length) {
    assert.match(markup, /<details class="health-unlinked">/);
    for (const { exam } of pairs.unlinked.slice(0, 3))
      assert.ok(markup.includes(exam.file.split("/").pop().replace(/\.js$/, "")), exam.file);
  }
});
