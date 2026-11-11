// 출제 내역·만들던 문제지에서 바로 지우기 (2026-11-11 사용자 요청).
// - 출제 내역 줄마다 `출제 취소`: 서버에 취소 시각만 남기고, 취소한 출제는 목록에서 기본으로 숨긴다.
// - 만들던 문제지 줄마다 `삭제`가 `이어하기` 옆에 바로 보인다(더보기 안에 숨기지 않는다).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { workspaceHarness, okJson } = require("./helpers/archive2-workspace-ui-harness.cjs");

const source = fs.readFileSync(path.join(__dirname, "../archive/archive2-workspace.js"), "utf8");
const raw = (id, extra = {}) => ({
  id, class_id: "c1", class_name: "고2 A반", class_grade: "고2", exam_title: `시험 ${id}`, exam_date: "2026-11-03",
  question_count: 20, recipient_count: 24, submitted_count: 0, pdf_status: "ready", saved_paper_id: null,
  archive_file: "", source_type: "archive", cancelled_at: null, ...extra,
});
function loadRows(h, assignments) {
  h.workspace.setClasses([{ id: "c1", name: "고2 A반", grade: "고2" }]);
  h.workspace.state.recentAssignments = assignments;
  h.workspace.state.recentRows = h.ctx.Archive2History.normalizeAssignments(
    assignments, [{ id: "c1", name: "고2 A반", grade: "고2" }], [], h.ctx.Archive2Core,
  );
  h.workspace.state.recentClassId = "";
}
const cards = (html) => [...html.matchAll(/<article class="history-card[^>]*data-assignment-id="([^"]+)"/g)].map((m) => m[1]);
const card = (html, id) => html.match(new RegExp(`<article class="history-card[^>]*data-assignment-id="${id}"[\\s\\S]*?</article>`))[0];

test("every live 출제 내역 row offers 출제 취소 next to its other actions, whatever it was made from", () => {
  const h = workspaceHarness();
  loadRows(h, [
    raw("a-saved", { saved_paper_id: "paper-1", archive_file: "MIXED:archive2-saved-paper-1-b", source_type: "mixed" }),
    raw("a-school", { archive_file: "exams/original/high/h2/2mid/26_매산고.js" }),
    raw("a-unit", { archive_file: "MIXED:unitpast_abc", source_type: "mixed" }),
  ]);
  const html = h.workspace.recentAssignmentMarkup();
  for (const id of ["a-saved", "a-school", "a-unit"]) {
    const row = card(html, id);
    assert.match(row, new RegExp(`data-action="assignment-cancel" data-assignment="${id}"[^>]*>출제 취소</button>`));
    assert.match(row, /data-action="assignment-status"/, "the existing actions stay");
  }
  assert.doesNotMatch(html, /recent-toggle-cancelled/, "no toggle while nothing is cancelled");
});

test("cancelled rows are hidden by default and come back with the toggle, without a 출제 취소 button", () => {
  const h = workspaceHarness();
  loadRows(h, [raw("live"), raw("gone", { cancelled_at: "2026-11-04T00:00:00Z" }), raw("gone2", { cancelled_at: "2026-11-05T00:00:00Z" })]);
  let html = h.workspace.recentAssignmentMarkup();
  assert.deepEqual(cards(html), ["live"]);
  assert.match(html, /data-action="recent-toggle-cancelled"[^>]*aria-pressed="false"[^>]*>취소한 출제 2건 보기</);

  h.workspace.state.recentShowCancelled = true;
  html = h.workspace.recentAssignmentMarkup();
  assert.deepEqual(cards(html).sort(), ["gone", "gone2", "live"]);
  assert.match(card(html, "gone"), /취소됨/);
  assert.doesNotMatch(card(html, "gone"), /assignment-cancel/, "a cancelled row cannot be cancelled again");
  assert.match(html, /aria-pressed="true"[^>]*>취소한 출제 숨기기</);
});

test("only cancelled rows left: the empty note still offers the toggle", () => {
  const h = workspaceHarness();
  loadRows(h, [raw("gone", { cancelled_at: "2026-11-04T00:00:00Z" })]);
  const html = h.workspace.recentAssignmentMarkup();
  assert.deepEqual(cards(html), []);
  assert.match(html, /현재 조건에 맞는 출제 내역이 없습니다/);
  assert.match(html, /취소한 출제 1건 보기/);
});

test("출제 취소 asks first, naming the paper, the class and how many already submitted", () => {
  const h = workspaceHarness();
  loadRows(h, [raw("a1", { exam_title: "중간 대비", submitted_count: 3 }), raw("a2")]);
  h.workspace.askCancelAssignment("a1");
  const body = h.node("modal-body").innerHTML;
  assert.equal(h.node("modal").open, true);
  assert.match(body, /<strong>중간 대비<\/strong> · 고2 A반 · 2026-11-03/);
  assert.match(body, /되돌릴 수 없습니다/);
  assert.match(body, /이미 제출한 학생 3명의 기록은 지워지지 않습니다/);
  assert.match(body, /data-action="assignment-cancel-confirm" data-assignment="a1"/);
  assert.doesNotMatch(body, /data-action="close-dialog"/, "the dialog frame already has 닫기");
  h.workspace.askCancelAssignment("a2");
  assert.doesNotMatch(h.node("modal-body").innerHTML, /이미 제출한 학생/, "nothing to say when nobody submitted");
});

test("confirming sends one cancel for that assignment, then the row leaves the list", async () => {
  const calls = [];
  const h = workspaceHarness(async (url, init) => {
    calls.push({ url: String(url), method: init?.method, body: init?.body ? JSON.parse(init.body) : null });
    return okJson({ success: true, cancelled: true, assignment: { id: "a1", cancelled_at: "2026-11-11T00:00:00Z" } });
  });
  loadRows(h, [raw("a1"), raw("a2")]);
  h.workspace.askCancelAssignment("a1");
  // 연타: 두 번째 호출은 첫 요청이 끝나기 전이라 보내지 않는다
  const [first, second] = await Promise.all([h.workspace.cancelRecentAssignment("a1"), h.workspace.cancelRecentAssignment("a1")]);
  assert.deepEqual([first, second], [true, false]);
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/class-exam-assignments\/a1\/cancel$/);
  assert.equal(calls[0].method, "POST");
  assert.match(calls[0].body.operation_identity, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(h.node("modal").open, false);
  assert.deepEqual(cards(h.workspace.recentAssignmentMarkup()), ["a2"]);
  assert.match(h.workspace.recentAssignmentMarkup(), /취소한 출제 1건 보기/);
  assert.match(h.node("recent-assignments").innerHTML, /취소한 출제 1건 보기/, "the visible list was redrawn");
});

test("a failed cancel keeps the row and says so in the dialog, in Korean", async () => {
  const h = workspaceHarness(async () => ({ ok: false, status: 500, json: async () => ({ success: false, error: "D1_ERROR: boom" }) }));
  loadRows(h, [raw("a1")]);
  h.workspace.askCancelAssignment("a1");
  assert.equal(await h.workspace.cancelRecentAssignment("a1"), false);
  assert.equal(h.node("modal").open, true, "the dialog stays so the teacher can try again");
  assert.equal(h.node("assignment-cancel-error").hidden, false);
  assert.match(h.node("assignment-cancel-error").textContent, /출제를 취소하지 못했습니다/);
  assert.doesNotMatch(h.node("assignment-cancel-error").textContent, /D1_ERROR|boom/);
  assert.deepEqual(cards(h.workspace.recentAssignmentMarkup()), ["a1"]);
});

test("PDF 오류 원문(영어)은 교사용 문장으로 바꿔 보인다", () => {
  const h = workspaceHarness();
  assert.match(h.workspace.pdfErrorText("Unable to create new browser: code: 429: message: Rate limit exceeded"), /잠시 바쁩니다.*PDF 다시 준비/);
  assert.match(h.workspace.pdfErrorText("PDF worker offline"), /PDF를 준비하지 못했습니다/);
  assert.equal(h.workspace.pdfErrorText("Browser Rendering 시간 초과"), "Browser Rendering 시간 초과", "a Korean reason is kept");
  loadRows(h, [raw("p1", { pdf_status: "failed", pdf_error: "Unable to create new browser: code: 429: message: Rate limit exceeded" })]);
  const row = card(h.workspace.recentAssignmentMarkup(), "p1");
  assert.doesNotMatch(row, /Rate limit|Unable to create/);
  assert.match(row, /history-pdf-error">PDF를 만드는 서버가 잠시 바쁩니다/);
});

test("만들던 문제지: 삭제 asks first and removes only that draft from this browser", () => {
  const h = workspaceHarness();
  const w = h.workspace;
  const store = (list) => h.ctx.localStorage.setItem(w.storageKey(), JSON.stringify(list));
  store([
    { draftId: "d1", title: "지울 문제지", selected: [{}, {}], updatedAt: "2026-11-11T03:00:00Z" },
    { draftId: "d2", title: "남길 문제지", selected: [], updatedAt: "2026-11-10T03:00:00Z" },
  ]);
  w.askDeleteDraft("d1");
  const body = h.node("modal-body").innerHTML;
  assert.match(body, /<strong>지울 문제지<\/strong> · 2문항/);
  assert.match(body, /보관함에 저장한 문제지와 이미 낸 출제는 그대로 남습니다/);
  assert.match(body, /data-action="delete-draft-confirm" data-draft-id="d1"/);
  assert.equal(w.drafts().length, 2, "nothing is deleted before the confirmation");

  assert.equal(w.deleteDraft("d1"), true);
  // drafts() comes from the vm realm: copy before comparing with arrays made here
  const ids = () => Array.from(w.drafts(), (d) => d.draftId);
  assert.deepEqual(ids(), ["d2"]);
  assert.equal(h.node("modal").open, false);
  assert.equal(w.deleteDraft(""), false);
  assert.deepEqual(ids(), ["d2"]);
});

test("deleting the draft being worked on empties the working paper so autosave cannot bring it back", () => {
  const h = workspaceHarness();
  const w = h.workspace;
  const current = w.state.draftId;
  h.ctx.localStorage.setItem(w.storageKey(), JSON.stringify([{ draftId: current, title: "작업 중", selected: [{}] }]));
  w.state.selected = [{ questionUid: "q1" }];
  w.state.scopes = ["A"];
  assert.equal(w.deleteDraft(current), true);
  assert.equal(w.drafts().length, 0);
  assert.notEqual(w.state.draftId, current);
  assert.equal(w.state.selected.length, 0);
  assert.equal(w.state.scopes.length, 0);
});

test("삭제 is a visible button beside 이어하기 on both lists, and both go through the confirmation", () => {
  // 홈
  assert.match(source, /class="home-draft-actions">\$\{button\("restore", "이어하기"[^\n]*\$\{button\("delete-draft", "삭제", `type="button" data-draft-id="\$\{esc\(d\.draftId\)\}"/);
  // 출제 내역
  assert.match(source, /history-draft-actions">\$\{button\("restore", "이어하기", `data-draft="\$\{i\}"`\)\}\$\{button\("delete-draft", "삭제", `data-draft-id="\$\{esc\(d\.draftId\)\}"/);
  assert.doesNotMatch(source, /<summary>더보기<\/summary>\$\{button\("delete-draft"/, "no longer tucked inside 더보기");
  assert.match(source, /a === "delete-draft"\) askDeleteDraft\(b\.dataset\.draftId\)/);
  assert.match(source, /a === "delete-draft-confirm"\) deleteDraft\(b\.dataset\.draftId\)/);
  // 지우기·취소 버튼은 자료 준비(카탈로그)를 기다리지 않는다
  for (const action of ["delete-draft-confirm", "assignment-cancel", "assignment-cancel-confirm", "recent-toggle-cancelled"])
    assert.match(source, new RegExp(`CATALOG_FREE_ACTIONS = new Set\\(\\[[^\\]]*"${action}"`));
});

test("홈의 생성문제 칸은 열리는 화면 이름대로 모의고사라고 부른다", () => {
  assert.match(source, /productKey: "generated-bank",\s*label: "모의고사",/);
  assert.match(fs.readFileSync(path.join(__dirname, "../archive/generated-bank.html"), "utf8"), /<h1>모의고사 만들기<\/h1>/);
});
