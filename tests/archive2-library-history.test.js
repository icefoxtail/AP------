// 보관함 · 출제 내역 통합 (2026-11-10): each saved-paper row carries its own issue history.
// The history is ONE recent-summary request per list, grouped by saved_paper_id on the client.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const LIB_PATH = require.resolve("../archive/archive2-library.js");
const SUMMARY = "/class-exam-assignments/recent-summary";

function freshLibrary() {
  delete require.cache[LIB_PATH];
  return require(LIB_PATH);
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));

const pid = (n) => `00000000-0000-4000-8000-0000000000${String(n).padStart(2, "0")}`;
const paper = (n, extra = {}) => ({
  id: pid(n), title: `문제지 ${n}`, library_display_name: `문제지 ${n}`, library_status: "ACTIVE",
  grade: n % 2 ? "고1" : "고2", subject: "공통수학1", question_count: 20 + n, part_index: 0, part_count: 1,
  created_at: "2026-11-02T03:00:00.000Z", ...extra,
});
const issue = (id, paperId, extra = {}) => ({
  id, saved_paper_id: paperId, class_id: "c1", class_name: "고2 A반", exam_date: "2026-11-03",
  recipient_count: 24, submitted_count: 18, cancelled_at: null, archive_file: "MIXED:archive2-saved-x",
  source_type: "mixed", ...extra,
});

// A host whose [data-issue-slot] / [data-history-note] children can be filled in place, like the real DOM.
function makeHost() {
  const host = {
    innerHTML: "", slots: new Map(), hiddenSlots: new Map(), note: null, prepend() {},
    querySelectorAll(selector) {
      if (selector === "[data-issue-slot]") {
        return [...host.innerHTML.matchAll(/data-issue-slot data-paper-id="([^"]+)"/g)].map((match) => {
          const slot = {
            dataset: { paperId: match[1] },
            set innerHTML(value) { host.slots.set(match[1], value); },
            get innerHTML() { return host.slots.get(match[1]) ?? ""; },
            set hidden(value) { host.hiddenSlots.set(match[1], value); },
          };
          return slot;
        });
      }
      if (selector === "[data-history-note]")
        return /data-history-note/.test(host.innerHTML)
          ? [{ set innerHTML(value) { host.note = value; } }] : [];
      return [];
    },
  };
  return host;
}

function install({ request, extra = {} }) {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
  global.history = { state: null, replaceState(state) { this.state = state; }, pushState(state) { this.state = state; } };
  global.document = { addEventListener() {}, querySelectorAll() { return []; }, createElement() { return { setAttribute() {} }; } };
  global.window = { scrollY: 0, scrollTo() {}, sessionStorage: null, Archive2Api: { request }, ...extra };
  return () => {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete global[key]; else global[key] = value;
    }
  };
}

function listRouter(papers, summary, calls) {
  return async (route) => {
    calls.push(route);
    if (route.startsWith("/archive-saved-papers?")) return { papers, next_cursor: null };
    if (route.startsWith(SUMMARY)) return typeof summary === "function" ? summary(route) : summary;
    throw new Error("unexpected request: " + route);
  };
}

test("history is grouped by saved_paper_id: another paper's issues never mix in", async () => {
  const calls = [];
  const rows = [
    ...[1, 2, 3, 4, 5].map((n) => issue(`a${n}`, pid(1), { exam_date: `2026-11-0${n}`, class_name: "고2 A반" })),
    issue("a6", pid(1), { exam_date: "2026-10-20", cancelled_at: "2026-10-21T00:00:00Z", class_name: "고2 취소반" }),
    issue("b1", pid(2), { class_name: "고1 B반", recipient_count: 19, submitted_count: 19 }),
    issue("direct-school", null, { class_name: "학교기출반", archive_file: "exams/x.js", source_type: "archive" }),
    issue("direct-unit", "", { class_name: "단원별반" }),
    issue("elsewhere", pid(99), { class_name: "다른 선생님 문제지반" }),
  ];
  const restore = install({ request: listRouter([paper(1), paper(2), paper(3)], { assignments: rows }, calls) });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "ACTIVE");
    await tick();
    const first = host.slots.get(pid(1)), second = host.slots.get(pid(2)), third = host.slots.get(pid(3));
    assert.match(first, /출제 5회 · 취소 1회/);
    assert.equal((first.match(/class="paper-issue(?: is-cancelled)?"/g) || []).length, 6);
    assert.match(first, /<details class="paper-issues-older">/);
    assert.match(first, /제출 <strong>18<\/strong> \/ 24/);
    assert.match(second, /출제 1회/);
    assert.match(second, /고1 B반/);
    assert.match(second, /제출 <strong>19<\/strong> \/ 19/);
    assert.doesNotMatch(second, /고2 A반|이전 출제/);
    assert.match(third, /최근 90일 안에 출제한 기록이 없습니다/);
    for (const text of [first, second, third])
      assert.doesNotMatch(text, /학교기출반|단원별반|다른 선생님 문제지반/, "direct issues and other papers are not shown");
    // newest first: the three shown rows are 11/05, 11/04, 11/03
    const shown = first.split('<details class="paper-issues-older">')[0];
    assert.deepEqual([...shown.matchAll(/paper-issue-date">(\d+월 \d+일)</g)].map((m) => m[1]), ["11월 5일", "11월 4일", "11월 3일"]);
    assert.match(host.note, /최근 90일/);
    // F4: the fold button says 접기 once open (the label swap is CSS; aria-expanded follows the element)
    assert.match(first, /<summary aria-expanded="false"><span class="when-closed">이전 출제 3개 더 보기<\/span><span class="when-open">접기<\/span><\/summary>/);
  } finally { restore(); }
});

test("recent-summary is requested once per list, for the last 90 days; a second page does not ask again", async () => {
  const calls = [];
  const pages = { first: { papers: [paper(1)], next_cursor: "c2" }, second: { papers: [paper(2)], next_cursor: null } };
  const restore = install({
    request: async (route) => {
      calls.push(route);
      if (route.startsWith(SUMMARY)) return { assignments: [issue("x", pid(2))] };
      return route.includes("cursor=c2") ? pages.second : pages.first;
    },
  });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "ACTIVE");
    await tick();
    const summaryCalls = calls.filter((route) => route.startsWith(SUMMARY));
    assert.equal(summaryCalls.length, 1);
    const url = new URL("https://x" + summaryCalls[0]);
    assert.equal(url.searchParams.get("limit"), "1000");
    const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    const expected = `${from.getFullYear()}-${pad(from.getMonth() + 1)}-${pad(from.getDate())}`;
    assert.ok(Math.abs(Date.parse(url.searchParams.get("from")) - Date.parse(expected)) <= 24 * 60 * 60 * 1000);
    assert.equal(calls.filter((route) => /\/class-exam-assignments\/[^r]/.test(route)).length, 0, "no per-card status call");

    // the click handler loads the second page; its rows get the history that is already here
    await host.onclick({ target: { closest: () => ({ dataset: { libraryAction: "more" } }) }, preventDefault() {}, stopPropagation() {} });
    assert.equal(calls.filter((route) => route.startsWith(SUMMARY)).length, 1);
    assert.match(host.innerHTML, /문제지 2/);
    assert.match(host.innerHTML, /출제 1회/, "the page-two paper shows the history fetched earlier");
  } finally { restore(); }
});

test("the trash does not ask for issue history and shows no history area", async () => {
  const calls = [];
  const restore = install({ request: listRouter([paper(1, { library_status: "TRASHED" })], { assignments: [] }, calls) });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "TRASHED");
    await tick();
    assert.equal(calls.filter((route) => route.startsWith(SUMMARY)).length, 0);
    assert.doesNotMatch(host.innerHTML, /data-issue-slot|출제 이력/);
    assert.match(host.innerHTML, /data-status="ACTIVE">복원/);
  } finally { restore(); }
});

test("a failed history leaves the list and its buttons working, and 다시 시도 asks once more", async () => {
  const calls = [];
  let fail = true;
  const restore = install({
    request: listRouter([paper(1), paper(2)], () => {
      if (fail) throw new Error("boom");
      return { assignments: [issue("a1", pid(1))] };
    }, calls),
    extra: { Archive2WorkspaceSavedPaperIssue: async (id) => { calls.push("issue:" + id); } },
  });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "ACTIVE");
    await tick();
    // One message above the list (not one per card); the cards' history areas are empty and hidden.
    assert.match(host.note, /출제 이력을 불러오지 못했습니다/);
    assert.match(host.note, /data-library-action="history-retry">다시 시도/);
    assert.equal(host.slots.get(pid(1)), "");
    assert.equal(host.slots.get(pid(2)), "");
    assert.equal(host.hiddenSlots.get(pid(1)), true);
    const failureTexts = (host.innerHTML + [...host.slots.values()].join("") + host.note).match(/불러오지 못했습니다/g) || [];
    assert.equal(failureTexts.length, 1, "the failure is said once");
    assert.match(host.innerHTML, /문제지 1/);
    // the list keeps working while the history is down
    await host.onclick({ target: { closest: () => ({ dataset: { libraryAction: "distribute", paperId: pid(2) } }) }, preventDefault() {}, stopPropagation() {} });
    assert.ok(calls.includes("issue:" + pid(2)));
    fail = false;
    await host.onclick({ target: { closest: () => ({ dataset: { libraryAction: "history-retry" } }) }, preventDefault() {}, stopPropagation() {} });
    assert.equal(calls.filter((route) => route.startsWith(SUMMARY)).length, 2);
    assert.match(host.slots.get(pid(1)), /출제 1회/);
    assert.match(host.slots.get(pid(2)), /최근 90일 안에 출제한 기록이 없습니다/);
    assert.equal(host.hiddenSlots.get(pid(1)), false);
    assert.match(host.note, /최근 90일까지 보입니다/);
    assert.doesNotMatch(host.note, /불러오지 못했습니다/);
  } finally { restore(); }
});

test("the first draw says 확인 중 and a slow history never delays the list", async () => {
  const slow = deferred();
  const calls = [];
  const restore = install({ request: async (route) => {
    calls.push(route);
    if (route.startsWith(SUMMARY)) return slow.promise;
    return { papers: [paper(1)], next_cursor: null };
  } });
  try {
    const host = makeHost();
    const result = await freshLibrary().render(host, "", "ACTIVE");
    assert.notEqual(result, false);
    assert.match(host.innerHTML, /문제지 1/);
    assert.equal((host.innerHTML.match(/출제 이력 확인 중…/g) || []).length, 1, "'확인 중' appears once above the list, not on every card");
    assert.match(host.innerHTML, /data-issue-slot data-paper-id="[^"]+" aria-label="[^"]*" hidden>/);
    assert.match(host.innerHTML, /data-library-action="distribute"/);
    slow.resolve({ assignments: [issue("a1", pid(1))] });
    await tick();
    assert.match(host.slots.get(pid(1)), /출제 1회/);
  } finally { restore(); }
});

test("a late history answer cannot overwrite a newer list, a detail view or a left view", async () => {
  const library = freshLibrary();
  const pending = [];
  const restore = install({ request: async (route) => {
    if (route.startsWith(SUMMARY)) { const item = deferred(); pending.push(item); return item.promise; }
    return { papers: [paper(route.includes("ARCHIVED") ? 2 : 1)], next_cursor: null };
  } });
  try {
    const host = makeHost();
    await library.render(host, "", "ACTIVE");
    await tick();
    host.slots.clear();
    await library.render(host, "", "ARCHIVED");
    await tick();
    assert.equal(pending.length, 2);
    pending[0].resolve({ assignments: [issue("old", pid(1), { class_name: "옛 목록의 반" })] });
    await tick();
    assert.equal(host.slots.size, 0, "the older list's history is dropped");
    // leaving the view invalidates the one still waiting
    library.invalidatePendingRequests();
    pending[1].resolve({ assignments: [issue("new", pid(2))] });
    await tick();
    assert.equal(host.slots.size, 0, "a history that arrives after leaving the saved view is dropped");
    assert.equal(library.refreshHistory(), false, "nothing to refresh while the list is not on screen");
  } finally { restore(); }
});

test("a cancelled issue is faded with 취소됨 and no submit count; its student check still works", async () => {
  const opened = [];
  const restore = install({
    request: listRouter([paper(1)], { assignments: [
      issue("live", pid(1), { exam_date: "2026-11-05" }),
      issue("gone", pid(1), { exam_date: "2026-11-04", cancelled_at: "2026-11-04T05:00:00Z", class_name: "취소된 반" }),
    ] }, []),
    extra: { Archive2WorkspaceOpenAssignmentStatus: async (id) => { opened.push(id); } },
  });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "ACTIVE");
    await tick();
    const html = host.slots.get(pid(1));
    assert.match(html, /출제 1회 · 취소 1회/);
    const cancelled = html.match(/<li class="paper-issue is-cancelled">[\s\S]*?<\/li>/)[0];
    assert.match(cancelled, /취소된 반/);
    assert.match(cancelled, /paper-issue-cancelled">취소됨/);
    assert.doesNotMatch(cancelled, /제출/);
    assert.match(cancelled, /data-assignment-id="gone"/);
    await host.onclick({ target: { closest: () => ({ dataset: { libraryAction: "issue-status", assignmentId: "gone" } }) }, preventDefault() {}, stopPropagation() {} });
    assert.deepEqual(opened, ["gone"]);
  } finally { restore(); }
});

test("only cancelled issues, missing counts and unusual dates are described without inventing numbers", async () => {
  const restore = install({
    request: listRouter([paper(1), paper(2), paper(3)], { assignments: [
      issue("c1", pid(1), { cancelled_at: "2026-11-04T05:00:00Z" }),
      issue("n1", pid(2), { recipient_count: null, submitted_count: null }),
      issue("n2", pid(3), { recipient_count: 22, submitted_count: null, exam_date: "2025-12-05" }),
    ] }, []),
  });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "ACTIVE");
    await tick();
    assert.match(host.slots.get(pid(1)), /출제 없음 · 취소 1회/);
    assert.doesNotMatch(host.slots.get(pid(2)), /제출|대상/);
    assert.match(host.slots.get(pid(3)), /대상 22명/);
    assert.match(host.slots.get(pid(3)), /2025년 12월 5일/, "another year shows the year");
  } finally { restore(); }
});

test("server values (titles, class names, ids) are escaped in rows and history", async () => {
  const evil = '"><img src=x onerror=alert(1)>';
  const restore = install({
    request: listRouter([paper(1, { title: evil, library_display_name: evil, subject: evil })], { assignments: [
      issue('a"b', pid(1), { class_name: evil }),
    ] }, []),
  });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "ACTIVE");
    await tick();
    const all = host.innerHTML + host.slots.get(pid(1));
    assert.doesNotMatch(all, /<img/);
    assert.match(all, /&lt;img src=x onerror=alert\(1\)&gt;/);
    assert.match(host.slots.get(pid(1)), /data-assignment-id="a&quot;b"/);
  } finally { restore(); }
});

test("a row shows grade spine with the question count, set position and the five actions", async () => {
  const restore = install({
    request: listRouter([
      paper(1, { part_index: 0, part_count: 2, question_count: 50, library_display_name: "단원 문제지" }),
      paper(2, { library_status: "ARCHIVED" }),
    ], { assignments: [] }, []),
  });
  try {
    const host = makeHost();
    await freshLibrary().render(host, "", "ACTIVE");
    await tick();
    const html = host.innerHTML;
    const row = html.match(/<article class="exam-row saved-row grade-h1"[\s\S]*?<\/article>/)[0];
    assert.match(row, /<span class="exam-row-grade">고1<\/span><span class="exam-row-year">50<\/span><span class="exam-row-unit">문항<\/span>/);
    assert.match(row, /2권 중 1권/);
    assert.match(row, /공통수학1/);
    assert.match(row, /저장/);
    for (const [mode, label] of [["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]])
      assert.match(row, new RegExp(`data-library-action="output"[^>]*data-mode="${mode}">${label}`));
    assert.match(row, /data-library-action="distribute"[^>]*>반에 출제<\/button>/);
    const menu = row.match(/<div class="saved-paper-more-menu">[\s\S]*?<\/div>/)[0];
    // everything the old row offered stays reachable, now inside 더보기
    for (const needle of ['data-library-action="detail"', "edit_saved_paper=", 'data-library-action="rename"',
      'data-library-action="library-status"', 'data-library-action="delete"'])
      assert.ok(menu.includes(needle), "더보기 keeps " + needle);
    assert.doesNotMatch(row.replace(menu, ""), /data-library-action="(detail|rename|delete)"/, "they are not on the row itself");
    assert.match(host.innerHTML, /grade-h2/);
  } finally { restore(); }
});

test("refreshHistory re-reads the history of the list that is on screen", async () => {
  let answer = [];
  const calls = [];
  const library = freshLibrary();
  const restore = install({ request: listRouter([paper(1)], () => ({ assignments: answer }), calls) });
  try {
    const host = makeHost();
    await library.render(host, "", "ACTIVE");
    await tick();
    assert.match(host.slots.get(pid(1)), /최근 90일 안에 출제한 기록이 없습니다/);
    answer = [issue("fresh", pid(1))];
    assert.equal(library.refreshHistory(), true);
    await tick();
    assert.match(host.slots.get(pid(1)), /출제 1회/);
    assert.equal(calls.filter((route) => route.startsWith(SUMMARY)).length, 2);
  } finally { restore(); }
});

test("the saved-paper API client wiring: the workspace loads the pieces the rows need", () => {
  const root = path.resolve(__dirname, "..");
  const workspace = fs.readFileSync(path.join(root, "archive/archive2-workspace.js"), "utf8");
  assert.match(workspace, /window\.Archive2WorkspaceOpenAssignmentStatus = openRecentAssignmentStatus/);
  assert.match(workspace, /Archive2Library\?\.refreshHistory\?\.\(\)/);
  const library = fs.readFileSync(path.join(root, "archive/archive2-library.js"), "utf8");
  // History is grouped inside the library: it must not depend on archive2-history.js (a Worker-bundled file).
  assert.doesNotMatch(library, /require\(["']\.\/archive2-(history|core|output)/);
  assert.doesNotMatch(library, /Archive2History/);
});
