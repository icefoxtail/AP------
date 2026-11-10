// 출제 내역 (2026-11-10): date-ordered rows with a source label, and 학생별 확인 that also works from 보관함.
const test = require("node:test");
const assert = require("node:assert/strict");
const { workspaceHarness, okJson } = require("./helpers/archive2-workspace-ui-harness.cjs");

const raw = (id, extra = {}) => ({
  id, class_id: "c1", class_name: "고2 A반", class_grade: "고2", exam_title: `시험 ${id}`, exam_date: "2026-11-03",
  question_count: 20, recipient_count: 24, submitted_count: 18, pdf_status: "ready", saved_paper_id: null,
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
const card = (html, id) => html.match(new RegExp(`<article class="history-card[^>]*data-assignment-id="${id}"[\\s\\S]*?</article>`))[0];

test("each 출제 내역 row names where it came from: 보관함 문제지, 학교 기출 or 단원별 기출", () => {
  const h = workspaceHarness();
  loadRows(h, [
    raw("a-saved", { saved_paper_id: "paper-77", archive_file: "MIXED:archive2-saved-paper-77-batch", source_type: "mixed" }),
    raw("a-school", { archive_file: "exams/original/high/h2/2mid/26_매산고.js" }),
    raw("a-unit", { archive_file: "MIXED:unit-past-abc123", source_type: "mixed" }),
    raw("a-none", { archive_file: "" }),
  ]);
  const html = h.workspace.recentAssignmentMarkup();
  const saved = card(html, "a-saved");
  assert.match(saved, /<button type="button" class="history-source is-link" data-action="recent-open-saved" data-paper-id="paper-77"[^>]*>보관함 문제지<\/button>/);
  assert.match(card(html, "a-school"), /<span class="history-source">학교 기출<\/span>/);
  assert.match(card(html, "a-unit"), /<span class="history-source">단원별 기출<\/span>/);
  assert.doesNotMatch(card(html, "a-none"), /history-source/);
  // a saved paper wins over its MIXED:archive2-saved-… file name
  assert.doesNotMatch(saved, /단원별 기출|학교 기출/);
});

test("rows keep every existing action and show 반 · 제출 n/m on a grade-colored date spine", () => {
  const h = workspaceHarness();
  loadRows(h, [
    raw("r1", { exam_date: "2026-11-03", pdf_status: "failed", pdf_error: "PDF 오류" }),
    raw("r2", { exam_date: "2026-11-09", class_name: "고2 B반", recipient_count: 0, submitted_count: 0 }),
  ]);
  const html = h.workspace.recentAssignmentMarkup();
  assert.ok(html.indexOf('data-assignment-id="r2"') < html.indexOf('data-assignment-id="r1"'), "newest date first");
  const r1 = card(html, "r1");
  assert.match(r1, /grade-h2/);
  assert.match(r1, /<span class="exam-row-grade">11월<\/span><span class="exam-row-year">3<\/span><span class="exam-row-unit">고2<\/span>/);
  assert.match(r1, /<span class="history-class">고2 A반<\/span>/);
  assert.match(r1, /제출 18\/24/);
  assert.match(r1, /PDF 준비 실패/);
  assert.match(r1, /data-action="assignment-pdf"[^>]*>PDF 다시 준비/);
  for (const [mode, label] of [["exam", "시험지"], ["sol", "해설"], ["ans", "정답"]])
    assert.match(r1, new RegExp(`data-action="assignment-output-direct" data-assignment="r1" data-mode="${mode}" class="small">${label}`));
  assert.match(r1, /data-action="assignment-status" data-assignment="r1"[^>]*>학생별 확인/);
  assert.match(card(html, "r2"), /제출 0\/0/);
});

test("server titles, class names and ids stay escaped in 출제 내역 rows", () => {
  const h = workspaceHarness();
  loadRows(h, [raw('x"y', { exam_title: "<script>alert(1)</script>", class_name: "<b>반</b>", saved_paper_id: 'p"1' })]);
  const html = h.workspace.recentAssignmentMarkup();
  assert.doesNotMatch(html, /<script>|<b>반|data-paper-id="p"1"/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /data-paper-id="p&quot;1"/);
});

test("학생별 확인 opens from 보관함 as it does from 출제 내역, and a late answer after leaving is dropped", async () => {
  const pending = [];
  const h = workspaceHarness((url) => new Promise((resolve) => pending.push({ url: String(url), resolve })));
  h.workspace.setView("saved");
  const request = h.workspace.openRecentAssignmentStatus("assignment-from-saved");
  assert.equal(pending.length, 1);
  assert.match(pending[0].url, /\/class-exam-assignments\/assignment-from-saved\/status$/);
  pending[0].resolve(okJson({
    assignment: { id: "assignment-from-saved", exam_title: "보관함 시험", exam_date: "2026-11-03", question_count: 2, pdf_status: "ready" },
    students: [{ student_id: "s1", name: "김학생", session_id: "x" }],
  }));
  await request;
  assert.match(h.node("modal-body").innerHTML, /보관함 시험/);
  assert.match(h.node("modal-body").innerHTML, /김학생/);

  // leaving 보관함 (here: to the finder) before the answer arrives drops it
  h.node("modal-body").innerHTML = "kept";
  const late = h.workspace.openRecentAssignmentStatus("late-one");
  h.workspace.setView("find");
  pending[1].resolve(okJson({ assignment: { id: "late-one", exam_title: "늦은 시험", exam_date: "2026-11-03", question_count: 1 }, students: [] }));
  await late;
  assert.equal(h.node("modal-body").innerHTML, "kept");
});
