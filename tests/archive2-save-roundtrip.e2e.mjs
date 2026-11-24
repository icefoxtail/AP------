// Teacher's "save a paper" job, start to finish: the real screen script (archive2-workspace.js) builds a paper with generate()
// and saves it with savePapers() against the real Worker code on a local D1. Runs in its own CI job "Archive2 save round trip"
// (.github/workflows/archive2-save-roundtrip.yml); it is intentionally NOT in tools/run-tests.js.
// A second group runs the REAL button handlers (grade/subject/difficulty step/meta controls) before building and saving, so a value a button puts
// into the screen state that the server refuses (the 2026-11-19 "409 after pressing a grade button") is caught here.
// Local run: npm ci --prefix apmath/worker-backup/worker && node archive/tools/build-archive2-catalog.mjs --package-only
//            node --test tests/archive2-save-roundtrip.e2e.mjs      (about 1 minute; no network, no production request)
// Assertions are defect conditions (no rejection, same order, no duplicate rows, hash verified) and never fix data counts.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { after, before, test } from "node:test";
import { pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";
import { MAX_SAVED_PAPER_BYTES, catalog, root, chooseSample, configureSample, core, createWorker, createWorkspace, estimateSnapshotBytes, imageRefs, workerFilterKeys } from "./helpers/archive2-save-roundtrip-harness.mjs";

// 고3 is not sampled: its general-use pool has too few questions per unit for a 20-question, two-unit paper.
const GRADES = ["중1", "중2", "중3", "고1", "고2"];
const PER_UNIT = 10;
const ROLE = { "X-Fixture-Role": "admin" };

let server;
before(async () => { server = await createWorker(); });
after(async () => { await server?.dispose(); });

const samples = new Map();
async function sampleFor(grade) {
  if (!samples.has(grade)) samples.set(grade, await chooseSample(grade, { perUnit: PER_UNIT }));
  const sample = samples.get(grade);
  assert.ok(sample, `${grade}: 용량 초과 위험 — 표본 또는 서버 한도 확인: no two-unit, ${PER_UNIT * 2}-question paper fits well under the server limit ` +
    `(${MAX_SAVED_PAPER_BYTES} bytes); pick another sample rule or fix the size problem - this check must not be skipped`);
  return sample;
}
const api = (route, init = {}) => server.mf.dispatchFetch("http://local/api" + route, { ...init, headers: { ...ROLE, ...(init.headers || {}) } });
const sendFailure = (ws, label) => /저장 한도/.test(ws.state.saveError)
  ? `${label}: 용량 초과로 저장 거절 — 표본 또는 서버 한도 확인 (${ws.state.saveError})`
  : `${label}: 저장 거절 — ${ws.state.saveError}`;

async function savedPaperRows(batchId) {
  return (await server.db.prepare("SELECT id, part_index, length(CAST(snapshot_json AS BLOB)) AS bytes FROM archive_saved_papers WHERE save_batch_id=? ORDER BY part_index").bind(batchId).all()).results;
}

for (const grade of GRADES) {
  test(`${grade}: build, save, read back, save again, open as revision, assign`, async (t) => {
    const sample = await sampleFor(grade);
    const { ws, wire, seedMode } = createWorkspace(server);
    configureSample(ws, seedMode, grade, sample.keys, PER_UNIT);
    const sentUids = ws.state.selected.map((r) => r.questionUid);
    assert.ok(sentUids.length >= 2, `${grade}: generate() built an empty paper`);

    // a/b. save: one request, accepted
    await ws.savePapers();
    assert.equal(ws.state.saveResultState, "SAVED", sendFailure(ws, grade));
    assert.equal(wire.posts.length, 1, `${grade}: one save request`);
    assert.equal(wire.log.filter((l) => l.route === "/archive-saved-papers" && l.method === "POST").every((l) => l.status === 200), true);
    const [paperId] = ws.state.savedPaperIds;
    const batchId = wire.posts[0].save_batch_id;
    const rows = await savedPaperRows(batchId);
    assert.equal(rows.length, wire.posts[0].papers.length, "every volume was stored once");
    const bytes = rows[0].bytes;
    t.diagnostic(`${grade}: ${sentUids.length} questions, snapshot ${bytes} bytes of ${MAX_SAVED_PAPER_BYTES} (${((bytes / MAX_SAVED_PAPER_BYTES) * 100).toFixed(0)}%); units ${sample.labels.join(" / ")}`);
    const stored = JSON.parse((await server.db.prepare("SELECT snapshot_json FROM archive_saved_papers WHERE id=?").bind(paperId).first()).snapshot_json);
    assert.ok(!/data:image\//.test(JSON.stringify(stored.questions)) && Array.isArray(stored.assets), `${grade}: images are kept as paths and listed with sha256 and size, not embedded`);
    assert.ok(bytes <= MAX_SAVED_PAPER_BYTES * 0.85, `${grade}: sample uses ${bytes} bytes, too close to the server limit ${MAX_SAVED_PAPER_BYTES} - choose a lighter sample`);

    // c. read back through the route the screen uses; the Worker verifies the snapshot hash while reading
    const detailResponse = await api("/archive-saved-papers/" + paperId);
    assert.equal(detailResponse.status, 200, `${grade}: saved paper cannot be read back`);
    const { paper } = await detailResponse.json();
    assert.deepEqual(paper.snapshot.questions.map((q) => q.questionUid), sentUids, `${grade}: question order changed by the save`);
    assert.match(paper.snapshot_hash, /^[0-9a-f]{64}$/);

    // d. the same content again: same batch id, no duplicate row
    await ws.savePapers();
    assert.equal(ws.state.saveResultState, "SAVED", sendFailure(ws, grade + " (second save)"));
    assert.equal(wire.posts[1].save_batch_id, batchId, "the same content keeps its batch id");
    assert.deepEqual(ws.state.savedPaperIds, [paperId], "the repeat resolves to the same saved paper");
    assert.equal((await savedPaperRows(batchId)).length, rows.length, "no duplicate saved rows");

    // e. open as a revision and save the revision (lineage)
    const revision = createWorkspace(server);
    await revision.ws.openSavedPaperRevision(paperId);
    assert.deepEqual(revision.ws.state.selected.map((r) => r.questionUid), sentUids, `${grade}: revision restores a different paper`);
    assert.equal(revision.ws.state.derivationSource?.parentId, paperId);
    // Saving the revision re-sends the saved questions; questions whose images the Worker embedded at save time must go back
    // to the Worker in a form it can verify (repair list 34: the screen sends the original image paths, the Worker embeds again).
    const CONTENT_FIELDS = ["content", "question", "choices", "answer", "solution", "image", "solutionImage"];
    const pick = (q) => Object.fromEntries(CONTENT_FIELDS.map((f) => [f, q[f]]));
    await t.test(`${grade}: save the revision`, async () => {
      await revision.ws.savePapers();
      assert.equal(revision.ws.state.saveResultState, "SAVED", sendFailure(revision.ws, grade + " (revision)"));
      const revisionId = revision.ws.state.savedPaperIds[0];
      const lineage = await server.db.prepare("SELECT parent_id, derivation_type FROM archive_saved_paper_lineage WHERE child_saved_paper_id=?").bind(revisionId).first();
      assert.equal(lineage?.parent_id, paperId, "the revision is linked to its parent");
      assert.ok(["REVISION", "FORK"].includes(lineage.derivation_type));
      const savedRevision = (await (await api("/archive-saved-papers/" + revisionId)).json()).paper;
      assert.deepEqual(savedRevision.snapshot.questions.map((q) => q.questionUid), sentUids, `${grade}: the saved revision changed the question order`);
      // problem text, choices, answer, solution and the (re-embedded) image bytes are the same as in the saved paper
      assert.deepEqual(savedRevision.snapshot.questions.map(pick), paper.snapshot.questions.map(pick), `${grade}: the revision's content differs from the saved paper`);
      const revisionBytes = (await server.db.prepare("SELECT length(CAST(snapshot_json AS BLOB)) AS bytes FROM archive_saved_papers WHERE id=?").bind(revisionId).first()).bytes;
      assert.ok(revisionBytes <= MAX_SAVED_PAPER_BYTES, `${grade}: revision snapshot ${revisionBytes} exceeds the server limit`);
      assert.ok(Math.abs(revisionBytes - bytes) < bytes * 0.05, `${grade}: revision size ${revisionBytes} differs from the saved paper's ${bytes}`);
    });

    // e2. replace one question of the revision, then save: the replaced question is the newly chosen one, the others are the saved ones
    await t.test(`${grade}: replace one question and save`, async () => {
      const edit = createWorkspace(server);
      await edit.ws.openSavedPaperRevision(paperId);
      const candidateUid = (edit.ws.state.rows[0].scopeQuestionUids || []).find((uid) => !sentUids.includes(uid) && edit.ws.state.byUid.has(uid) && core.generalUseEligibility(edit.ws.state.byUid.get(uid)).ok);
      assert.ok(candidateUid, `${grade}: no replacement candidate in the saved range`);
      const k = sentUids.length - 1;
      const next = edit.ws.state.selected.slice();
      next[k] = { ...edit.ws.state.byUid.get(candidateUid), rowId: next[k].rowId };
      edit.ws.state.selected = next; // what replaceWith() does
      edit.ws.state.prepared = [];
      edit.ws.state.ackWarnings = true;
      await edit.ws.savePapers();
      assert.equal(edit.ws.state.saveResultState, "SAVED", sendFailure(edit.ws, grade + " (edited revision)"));
      const saved = (await (await api("/archive-saved-papers/" + edit.ws.state.savedPaperIds[0])).json()).paper;
      assert.deepEqual(saved.snapshot.questions.map((q) => q.questionUid), [...sentUids.slice(0, k), candidateUid], `${grade}: wrong question set after the replacement`);
      assert.deepEqual(saved.snapshot.questions.slice(0, k).map(pick), paper.snapshot.questions.slice(0, k).map(pick), `${grade}: untouched questions changed`);
    });

    // e3. content that differs from the current catalog is still refused by the Worker (tampering, a stale screen)
    await t.test(`${grade}: a question that differs from the catalog is refused`, async () => {
      const tamper = async (mutate) => {
        const bad = createWorkspace(server);
        await bad.ws.openSavedPaperRevision(paperId);
        const papers = await bad.ws.prepare();
        mutate(papers[0].questions);
        const rowsBefore = (await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n;
        await bad.ws.savePapers();
        assert.notEqual(bad.ws.state.saveResultState, "SAVED", "a changed question must not be saved");
        assert.match(bad.ws.state.saveError, /fingerprint/);
        assert.equal(bad.wire.log.find((l) => l.method === "POST").status, 409);
        assert.equal((await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n, rowsBefore, "nothing was stored");
      };
      const plainIndex = paper.snapshot.questions.findIndex((q) => typeof q.content === "string");
      await tamper((questions) => { questions[plainIndex].content = String(questions[plainIndex].content) + " 바뀐 문장"; });
      await tamper((questions) => { questions[0].answer = String(questions[0].answer) + "9"; });
    });

    // f. 2026-11-24: a question fixed after the save never blocks the revision (it opens with the current content and a one-line notice);
    // a question that left the archive is the only one left out, and its number is told. The revision saves in both cases.
    await t.test(`${grade}: a fixed or vanished question never blocks the revision`, async () => {
      const raw = structuredClone(paper);
      const fixed = createWorkspace(server);
      const old = structuredClone(raw);
      old.snapshot.questions[0].sourceFingerprint = "0".repeat(64);
      fixed.ws.applySavedPaperRevision(old);
      assert.deepEqual(fixed.ws.state.selected.map((r) => r.questionUid), sentUids, `${grade}: a fixed question must still open`);
      assert.match(fixed.ws.state.composeNotice, /문항 1개가 저장 뒤 고쳐져 최신 내용으로 열었습니다/);
      await fixed.ws.savePapers();
      assert.equal(fixed.ws.state.saveResultState, "SAVED", sendFailure(fixed.ws, grade + " (fixed question)"));
      const savedFixed = (await (await api("/archive-saved-papers/" + fixed.ws.state.savedPaperIds[0])).json()).paper;
      assert.deepEqual(savedFixed.snapshot.questions.map(pick), paper.snapshot.questions.map(pick), `${grade}: the revision holds the current content`);

      const gone = createWorkspace(server);
      const ghostPaper = structuredClone(raw);
      const ghostUid = "qid_v1_" + "0".repeat(64);
      ghostPaper.snapshot.questions[1].questionUid = ghostUid;
      ghostPaper.snapshot.meta.questionUids[1] = ghostUid;
      gone.ws.applySavedPaperRevision(ghostPaper);
      assert.deepEqual(gone.ws.state.selected.map((r) => r.questionUid), sentUids.filter((_, index) => index !== 1), `${grade}: only the vanished question is left out`);
      assert.match(gone.ws.state.composeNotice, /2번 문항은 아카이브에서 찾을 수 없어 빼고 열었습니다/);
      await gone.ws.savePapers();
      assert.equal(gone.ws.state.saveResultState, "SAVED", sendFailure(gone.ws, grade + " (vanished question)"));
      const savedGone = (await (await api("/archive-saved-papers/" + gone.ws.state.savedPaperIds[0])).json()).paper;
      assert.deepEqual(savedGone.snapshot.questions.map((q) => q.questionUid), sentUids.filter((_, index) => index !== 1));
    });

    // g. assign the saved paper to a class: the assignment keeps the saved order
    const sourceGrades = [...new Set(paper.snapshot.questions.map((q) => q.sourceGrade))].sort((a, b) => core.gradeRank(a) - core.gradeRank(b));
    const classId = "e2e-class-" + grade, studentId = "e2e-student-" + grade;
    await server.db.prepare("INSERT INTO classes VALUES (?,?,?)").bind(classId, `${sourceGrades.at(-1)} 저장 검증반`, "Teacher").run();
    await server.db.prepare("INSERT INTO students(id,name) VALUES (?,?)").bind(studentId, "검증학생").run();
    await server.db.prepare("INSERT INTO class_students VALUES (?,?)").bind(classId, studentId).run();
    const assigned = await api("/class-exam-assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Archive2-Contract": "archive2-v1" },
      body: JSON.stringify({
        contract_version: "archive2-v1", saved_paper_id: paperId, assignment_batch_id: crypto.randomUUID(), class_id: classId,
        student_ids: [studentId], exam_date: "2026-09-29", mixed_payload_json: { questions: [], meta: {} },
      }),
    });
    const assignedBody = await assigned.json();
    // Without Browser Rendering the PDF step answers 502 after the assignment is stored (same as tests/archive-saved-papers-runtime.mjs).
    assert.equal(assignedBody.saved, true, `${grade}: assignment was not stored (${assigned.status} ${JSON.stringify(assignedBody).slice(0, 200)})`);
    assert.ok([200, 502].includes(assigned.status));
    const assignment = assignedBody.assignment;
    assert.equal(assignment.saved_paper_id, paperId);
    const payload = JSON.parse((await server.db.prepare("SELECT mixed_payload_json FROM class_exam_assignments WHERE id=?").bind(assignment.id).first()).mixed_payload_json);
    assert.deepEqual(payload.questions.map((q) => q.questionUid), sentUids, `${grade}: assigned order differs from the saved order`);
    const bridge = (await server.db.prepare("SELECT question_uid FROM class_exam_assignment_questions WHERE assignment_id=? ORDER BY order_no").bind(assignment.id).all()).results;
    assert.deepEqual(bridge.map((r) => r.question_uid), sentUids, `${grade}: assignment question rows differ from the saved order`);
  });
}

// ---- Saving after the teacher pressed the condition buttons -------------------------------------------------------------------
// The samples above set the screen state directly (configureSample), so they cannot see what the buttons leave in state.filters.
// Here the REAL click/change handlers of the screen are run (grade and subject buttons, difficulty-step buttons, meta checkboxes/selects),
// a paper is built from the resulting state, and it goes to the real Worker route. Defect conditions only: the route answers 200, the stored
// selection_filters hold only keys the Worker accepts (read from the Worker source), and the stored paper reads back. 2026-11-19: the grade
// button left empty metaL3/metaPT/metaTPL/metaApprovedOnly/originalCurriculum keys and every save after it was refused with 409.
const ALLOWED_FILTER_KEYS = workerFilterKeys();

// After the presses: choose two units that the pressed filters list, build the paper from them (the screen's own generate()) and keep
// the pair whose paper is well under the server limit. Same rule as chooseSample, but it never overwrites the pressed filters.
async function buildAfterPresses(ws, seedMode, label) {
  const units = ws.scopeOptions().filter((scope) => scope.count >= PER_UNIT && !scope.unclassified).slice(0, 6);
  const skipped = [];
  for (let i = 0; i < units.length; i++) for (let j = i + 1; j < units.length; j++) {
    ws.state.scopes = [units[i].key, units[j].key];
    ws.state.distribution = "equal";
    ws.state.count = PER_UNIT;
    seedMode(true);
    ws.generate(false);
    seedMode(false);
    if (ws.state.selected.length < 2) continue;
    let papers;
    try { papers = await ws.prepare(); } catch (error) { skipped.push(`${units[i].key}+${units[j].key}: ${error.apDetail?.code || error.message}`); continue; }
    if (papers.length !== 1 || estimateSnapshotBytes(papers[0]).bytes > MAX_SAVED_PAPER_BYTES * 0.6) continue;
    ws.state.ackWarnings = true;
    return;
  }
  assert.fail(`${label}: the pressed filters list no unit pair that builds a paper well under the server limit — choose another button or fix the screen (this check must not be skipped)${skipped.length ? "; pairs the screen could not prepare: " + skipped.join(", ") : ""}`);
}

async function saveAfterPresses(session, label) {
  const { ws, wire } = session;
  const rowsBefore = (await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n;
  await ws.savePapers();
  const post = wire.log.find((l) => l.route === "/archive-saved-papers" && l.method === "POST");
  assert.equal(post?.status, 200, `${label}: the save route answered ${post?.status} (${post?.error || ws.state.saveError}) — a button left a condition the server refuses`);
  assert.equal(ws.state.saveResultState, "SAVED", sendFailure(ws, label));
  assert.equal(wire.posts.length, 1, `${label}: one save request`);
  const sentUnknown = Object.keys(wire.posts[0].selection_filters).filter((key) => !ALLOWED_FILTER_KEYS.has(key));
  assert.deepEqual(sentUnknown, [], `${label}: the request carries condition keys the Worker does not accept`);
  const [paperId] = ws.state.savedPaperIds;
  assert.ok(paperId, `${label}: no saved paper id`);
  assert.ok((await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n > rowsBefore, `${label}: nothing was stored`);
  const { paper } = await (await api("/archive-saved-papers/" + paperId)).json();
  assert.deepEqual(Object.keys(paper.snapshot.selectionFilters).filter((key) => !ALLOWED_FILTER_KEYS.has(key)), [], `${label}: the stored selection_filters hold keys outside the Worker's list`);
  assert.deepEqual(paper.snapshot.questions.map((q) => q.questionUid), Array.from(ws.state.selected, (r) => r.questionUid), `${label}: stored question order differs from the screen`);
  return { paperId, paper };
}

// The workspace starts on 고1, so a grade press only changes the filters when it names another grade.
for (const grade of ["중3", "고2"]) {
  test(`${grade} grade button, then build and save`, async () => {
    const session = createWorkspace(server);
    await session.click({ action: "compose-grade", grade });
    assert.equal(session.ws.state.filters.grade, grade, "the button changed the grade");
    await buildAfterPresses(session.ws, session.seedMode, `grade button ${grade}`);
    await saveAfterPresses(session, `grade button ${grade}`);
  });
}

// After a subject button press the listed units, the built paper and the saved paper must all be in that subject (not the opposite one).
// subjects: the subjects the pressed buttons leave on; the scope keys read u:<view>:<subject>:<unit>, and each stored question is looked up in the
// unified index, which knows the subject of every question.
function assertOnlySubjects(session, saved, subjects, label) {
  const { ws } = session;
  const listed = ws.scopeOptions().map((scope) => String(scope.key).split(":")[2]);
  assert.ok(listed.length > 0, `${label}: the pressed buttons list no unit`);
  // With both buttons on the list also shows the "no subject" group (key part "-", questions the unit table cannot place); one button on never does.
  const extra = subjects.length > 1 ? ["-"] : [];
  assert.deepEqual([...new Set(listed)].filter((subject) => !subjects.includes(subject) && !extra.includes(subject)), [], `${label}: the unit list holds a subject whose button is off`);
  assert.deepEqual(subjects.filter((subject) => !listed.includes(subject)), [], `${label}: a pressed subject lists no unit`);
  assert.ok(ws.state.scopes.length > 0 && ws.state.scopes.every((key) => subjects.includes(String(key).split(":")[2])), `${label}: the built paper's units are outside the pressed subjects`);
  const index = ws.unifiedIndex();
  const storedSubjects = saved.paper.snapshot.questions.map((q) => index.byUid.get(q.questionUid)?.subject);
  assert.ok(storedSubjects.length > 0, `${label}: the saved paper holds no question`);
  assert.deepEqual([...new Set(storedSubjects)].filter((subject) => !subjects.includes(subject)), [], `${label}: the saved paper holds a question outside the pressed subjects`);
}

// On the first screen both subject buttons are on, so pressing one leaves that subject only; the paper built and saved afterwards is in it.
for (const subject of ["COMMON_MATH_1", "COMMON_MATH_2"]) {
  test(`${subject} subject button, then build and save`, async () => {
    const session = createWorkspace(server);
    await session.click({ action: "compose-subject", subject });
    assert.equal(session.ws.state.filters.semanticSubject, subject, "the button left the pressed subject on");
    await buildAfterPresses(session.ws, session.seedMode, `subject button ${subject}`);
    const saved = await saveAfterPresses(session, `subject button ${subject}`);
    assertOnlySubjects(session, saved, [subject], `subject button ${subject}`);
  });
}

// Both subjects on (the first one pressed, then the other): the paper may use units of either, and it saves.
test("both subject buttons on, then build and save", async () => {
  const session = createWorkspace(server);
  await session.click({ action: "compose-subject", subject: "COMMON_MATH_1" });
  await session.click({ action: "compose-subject", subject: "COMMON_MATH_2" });
  assert.equal(session.ws.state.filters.semanticSubject, "", "the second subject was added: both are on");
  await buildAfterPresses(session.ws, session.seedMode, "both subject buttons");
  const saved = await saveAfterPresses(session, "both subject buttons");
  assertOnlySubjects(session, saved, ["COMMON_MATH_1", "COMMON_MATH_2"], "both subject buttons");
});

test("grade button, subject button, then a difficulty-step button, then build and save", async () => {
  const session = createWorkspace(server);
  await session.click({ action: "compose-grade", grade: "고2" });
  await session.click({ action: "compose-subject", subject: "COMMON_MATH_1" });
  // Steps 1..5 are buttons; use the first one that still leaves a buildable paper (the data decides which, nothing is fixed here).
  let pressed = 0;
  for (const step of [3, 2, 4, 1, 5]) {
    session.ws.state.buckets = [];
    await session.click({ action: "bucket", bucket: String(step) });
    assert.equal(JSON.stringify(session.ws.state.buckets), JSON.stringify([step]), "the button selected the step");
    try { await buildAfterPresses(session.ws, session.seedMode, `difficulty step ${step}`); pressed = step; break; } catch { /* try the next step */ }
  }
  assert.ok(pressed, "some difficulty step leaves a buildable paper — the buttons or the data changed");
  await saveAfterPresses(session, `difficulty step ${pressed}`);
});

test("meta filters switched on and off again, then build and save", async () => {
  const session = createWorkspace(server);
  await session.click({ action: "compose-grade", grade: "중3" });
  const withType = catalog.records.find((r) => typeof r.problemTypeKey === "string" && r.problemTypeKey);
  await session.change("metaApprovedOnly", "1");
  if (withType) await session.change("metaPT", withType.problemTypeKey);
  assert.equal(session.ws.state.filters.metaApprovedOnly, "1", "the checkbox turned the condition on");
  if (withType) await session.change("metaPT", "");
  await session.change("metaApprovedOnly", "");
  assert.equal(session.ws.state.filters.metaApprovedOnly, "", "the checkbox turned it off again");
  await buildAfterPresses(session.ws, session.seedMode, "meta on/off");
  await saveAfterPresses(session, "meta on/off");
});

test("open a saved paper as a revision, press a condition button, then save the revision again", async () => {
  const base = createWorkspace(server);
  await base.click({ action: "compose-grade", grade: "중3" });
  await buildAfterPresses(base.ws, base.seedMode, "revision base");
  const { paperId } = await saveAfterPresses(base, "revision base");
  const sentUids = base.ws.state.selected.map((r) => r.questionUid);

  const revision = createWorkspace(server);
  await revision.ws.openSavedPaperRevision(paperId);
  assert.deepEqual(revision.ws.state.selected.map((r) => r.questionUid), sentUids, "the revision opened with the saved paper");
  // A condition control pressed on the opened revision (on, then off again) leaves empty meta keys in the filters and clears the paper;
  // the teacher then builds the paper again and saves it as a revision of the same saved paper.
  await revision.change("metaApprovedOnly", "1");
  await revision.change("metaApprovedOnly", "");
  assert.ok(revision.ws.state.derivationSource, "the screen still knows it is editing a revision");
  await buildAfterPresses(revision.ws, revision.seedMode, "revision after a condition button");
  const { paperId: revisionId } = await saveAfterPresses(revision, "revision after a condition button");
  const lineage = await server.db.prepare("SELECT parent_id FROM archive_saved_paper_lineage WHERE child_saved_paper_id=?").bind(revisionId).first();
  assert.equal(lineage?.parent_id, paperId, "the revision is linked to its parent");
});

test("negative: metadata that differs from the catalog, or a stale list version, is still refused by the server", async () => {
  const grade = GRADES[0];
  const sample = await sampleFor(grade);

  // The screen sends a question whose metadata differs from the catalog record: the server must answer 409.
  const tampered = createWorkspace(server);
  configureSample(tampered.ws, tampered.seedMode, grade, sample.keys, PER_UNIT);
  tampered.wire.beforePost = (body) => {
    const question = body.papers[0].questions[0];
    const field = core.META_FIELDS.find((f) => catalog.records.find((r) => r.questionUid === question.questionUid)?.[f] !== undefined);
    assert.ok(field, "the catalog record has a metadata field to alter");
    question[field] = "TAMPERED-" + String(question[field]);
    return body;
  };
  const before = (await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n;
  await tampered.ws.savePapers();
  const refusedMeta = tampered.wire.log.find((l) => l.method === "POST");
  assert.equal(refusedMeta.status, 409, "altered metadata must be refused");
  // The server no longer shows the internal English reason; it names the question and says its classification differs.
  assert.match(refusedMeta.error, /\d+권 \d+번 문항의 분류 정보가 승인된 값과 다릅니다/,"refused for the metadata mismatch, not for another reason");
  assert.notEqual(tampered.ws.state.saveResultState, "SAVED");
  assert.equal((await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n, before, "nothing was stored");

  // An older list version than the server's is refused with the "분류 기준이 갱신" 409.
  const good = createWorkspace(server);
  configureSample(good.ws, good.seedMode, grade, sample.keys, PER_UNIT);
  good.wire.beforePost = (body) => ({ ...body, index_version: "archive2-canonical-v1:" + "0".repeat(64), save_batch_id: crypto.randomUUID() });
  await good.ws.savePapers();
  const stale = good.wire.log.find((l) => l.method === "POST");
  assert.equal(stale.status, 409, "a stale list version must be refused");
  assert.match(stale.error, /분류 기준이 갱신/, "refused because the list version is stale, not for another reason");
  assert.notEqual(good.ws.state.saveResultState, "SAVED");
});

test("a picture the server cannot read does not stop the save: the paper is saved and the screen names the question", async () => {
  const grade = GRADES[0];
  const sample = await sampleFor(grade);
  const { ws, wire, seedMode } = createWorkspace(server);
  configureSample(ws, seedMode, grade, sample.keys, PER_UNIT);
  let lostKey = "", questionNo = 0;
  wire.beforePost = (body) => {
    body.papers[0].questions.some((question, index) => {
      const [first] = imageRefs(question);
      if (!first) return false;
      lostKey = first.replace(/^assets\/images\//, "");
      questionNo = index + 1;
      return true;
    });
    assert.ok(lostKey, "the sample paper has a picture");
    server.missingImageKeys.add(lostKey);
    return body;
  };
  try {
    await ws.savePapers();
  } finally {
    server.missingImageKeys.delete(lostKey);
  }
  assert.equal(ws.state.saveResultState, "SAVED", sendFailure(ws, "missing picture"));
  assert.equal(wire.log.find((l) => l.method === "POST").status, 200);
  assert.match(ws.state.saveMessage, new RegExp("그림 1개를 확인하지 못했습니다\\(1권 " + questionNo + "번 문항"), "the message names the question");
  const [paperId] = ws.state.savedPaperIds;
  const { paper } = await (await api("/archive-saved-papers/" + paperId)).json();
  assert.deepEqual(paper.snapshot.assets.filter((asset) => asset.missing).map((asset) => asset.path), ["assets/images/" + lostKey], "only that picture is marked");
});

// ---- 문제지 만들기 from the catalog shards of the chosen grade (stage 2-4) -------------------------------------------------------------
// The screen builds its list from the shards of the grade (not the whole bundle). A paper made that way must save exactly like one made from the
// whole catalog (same index_version, same question values the Worker compares), and a saved paper of ANOTHER grade must open as a revision:
// the screen fetches the shards of the exams the paper names before it checks the paper.
let shardFilesOnce = null;
async function shardFiles() {
  if (!shardFilesOnce) {
    const { buildCatalogShards } = await import(pathToFileURL(root + "/tools/lib/build-archive2-catalog-shards.mjs").href);
    const built = await buildCatalogShards(root);
    const files = new Map(built.files);
    files.set("index.json", built.entries[0].content);
    shardFilesOnce = files;
  }
  return shardFilesOnce;
}
for (const grade of ["중1", "고1", "고2"]) {
  test(`${grade}: a paper made from the shards of the grade saves, reads back, and a paper of another grade opens as a revision`, async () => {
    const files = await shardFiles();
    const sample = await sampleFor(grade);
    const { ws, wire, seedMode } = createWorkspace(server, { shardFiles: files });
    ws.state.filters = { grade };
    const first = await ws.bootFromShards();
    assert.equal(first.complete, false, "the screen holds the shards of the grade only");
    assert.equal(first.indexVersion, catalog.indexVersion, "the version string the server compares");
    configureSample(ws, seedMode, grade, sample.keys, PER_UNIT);
    const sentUids = ws.state.selected.map((r) => r.questionUid);
    assert.ok(sentUids.length >= 2, `${grade}: generate() built an empty paper from the shards`);
    await ws.savePapers();
    assert.equal(ws.state.saveResultState, "SAVED", sendFailure(ws, grade + " (from shards)"));
    assert.equal(wire.log.filter((l) => l.route === "/archive-saved-papers" && l.method === "POST").every((l) => l.status === 200), true);
    const [paperId] = ws.state.savedPaperIds;
    const { paper } = await (await api("/archive-saved-papers/" + paperId)).json();
    assert.deepEqual(paper.snapshot.questions.map((q) => q.questionUid), sentUids);
    assert.equal(paper.snapshot.meta.indexVersion ?? catalog.indexVersion, catalog.indexVersion);

    // a revision of a paper of ANOTHER grade, opened by a screen that holds only this grade's shards
    const otherGrade = grade === "중1" ? "고2" : "중1";
    const otherSample = await sampleFor(otherGrade);
    const maker = createWorkspace(server);
    configureSample(maker.ws, maker.seedMode, otherGrade, otherSample.keys, PER_UNIT);
    await maker.ws.savePapers();
    assert.equal(maker.ws.state.saveResultState, "SAVED", sendFailure(maker.ws, otherGrade + " (maker)"));
    const [otherPaperId] = maker.ws.state.savedPaperIds;
    const otherUids = maker.ws.state.selected.map((r) => r.questionUid);
    const opener = createWorkspace(server, { shardFiles: files });
    opener.ws.state.filters = { grade };
    const held = await opener.ws.bootFromShards();
    assert.ok(otherUids.every((uid) => !held.records.some((r) => r.questionUid === uid)) || held.complete, "the other grade's questions are not held yet");
    await opener.ws.openSavedPaperRevision(otherPaperId);
    assert.deepEqual(opener.ws.state.selected.map((r) => r.questionUid), otherUids, "the revision restores the other grade's paper");
    assert.ok(otherUids.every((uid) => opener.ws.state.byUid.has(uid)), "the screen fetched the shards of the paper's exams");
    assert.equal(opener.ws.state.derivationSource?.parentId, otherPaperId);
    await opener.ws.savePapers();
    assert.equal(opener.ws.state.saveResultState, "SAVED", sendFailure(opener.ws, otherGrade + " revision opened from " + grade + " shards"));
  });
}

// A draft keeps only {questionUid, rowId, sourceFingerprint} per question (no exam file) and the grade of its filters. Restoring it ("이전 작업 복원"),
// or importing a work file, on a screen that holds the shards of ANOTHER grade must find the questions: the grade hint first, then every shard;
// "not in the archive" is only said after all shards are in.
for (const grade of ["중1", "고1"]) {
  test(`${grade} screen: a draft made in another grade is restored (grade hint, and every shard when the hint is missing); a missing question is left out (never refuses the draft) only after all shards`, async () => {
    const files = await shardFiles();
    const otherGrade = grade === "중1" ? "고2" : "중1";
    const otherSample = await sampleFor(otherGrade);
    const maker = createWorkspace(server);
    configureSample(maker.ws, maker.seedMode, otherGrade, otherSample.keys, PER_UNIT);
    const made = JSON.parse(JSON.stringify(maker.ws.draft()));
    const wanted = made.selected.map((row) => row.questionUid);
    assert.ok(wanted.length >= 2, "the maker built a paper");
    assert.ok(made.selected.every((row) => !row.sourceFile && !row.sourceArchiveFile), "a draft row names no exam file: only the uid");
    assert.equal(made.filters.grade, otherGrade);
    const open = async () => {
      const screen = createWorkspace(server, { shardFiles: files });
      screen.ws.state.filters = { grade };
      const held = await screen.ws.bootFromShards();
      assert.equal(held.complete, false);
      assert.ok(wanted.every((uid) => !screen.ws.state.byUid.has(uid)), "the other grade's questions are not held before the restore");
      return screen.ws;
    };
    // (a) restore with the grade the draft was made in
    let ws = await open();
    await ws.shardGlue.ensureShardFiles(made.selected, made.sources, { grades: [made.filters.grade] });
    ws.applyDraft(made);
    assert.deepEqual(ws.state.selected.map((r) => r.questionUid), wanted);
    assert.equal(ws.state.catalog.complete, false, "only the shards of the draft's grade were added, not every shard");
    // (b) an imported work file without a usable grade: every shard is fetched before the questions are judged
    ws = await open();
    const noGrade = { ...made, filters: { ...made.filters, grade: "" } };
    await ws.shardGlue.ensureShardFiles(noGrade.selected, noGrade.sources, { grades: [noGrade.filters.grade] });
    ws.applyDraft(noGrade);
    assert.deepEqual(ws.state.selected.map((r) => r.questionUid), wanted);
    // (c) a grade hint that is wrong for the questions: still found, by the fallback to every shard
    ws = await open();
    const wrong = { ...made, filters: { ...made.filters, grade: grade } };
    await ws.shardGlue.ensureShardFiles(wrong.selected, wrong.sources, { grades: [wrong.filters.grade] });
    ws.applyDraft(wrong);
    assert.deepEqual(ws.state.selected.map((r) => r.questionUid), wanted);
    assert.equal(ws.state.catalog.complete, true, "the hint did not hold the questions, so every shard was received");
    // (d) a question that is in no shard: refused as "not in the archive", after all shards were received
    ws = await open();
    const ghost = { ...made, selected: [...made.selected, { ...made.selected[0], questionUid: "qid_v1_" + "0".repeat(64) }] };
    await ws.shardGlue.ensureShardFiles(ghost.selected, ghost.sources, { grades: [ghost.filters.grade] });
    assert.equal(ws.state.catalog.complete, true);
    // 2026-11-24: it no longer refuses the whole draft; only that question is left out, with its number told.
    ws.applyDraft(ghost);
    assert.deepEqual(ws.state.selected.map((r) => r.questionUid), wanted);
    assert.match(ws.state.composeNotice, new RegExp(`${wanted.length + 1}번 문항은 아카이브에서 찾을 수 없어 빼고 열었습니다`));
  });
}

// The connection fails, or the shard files are wrong while the whole bundle is not there either: whatever the combination, nothing is left
// half done (the catalog, the loader and the screen's busy flag), no query throws, and the same action works when things are back.
const NETWORK_MESSAGE = "문항 목록을 받지 못했습니다. 연결을 확인하고 다시 시도해 주세요.";
test("offline: a grade change and a draft restore fail with the connection message, leave the screen as it was, and work again when the connection is back", async () => {
  const files = await shardFiles();
  const net = { offline: false };
  const otherSample = await sampleFor("중1");
  const maker = createWorkspace(server);
  configureSample(maker.ws, maker.seedMode, "중1", otherSample.keys, PER_UNIT);
  const made = JSON.parse(JSON.stringify(maker.ws.draft()));
  const wanted = made.selected.map((row) => row.questionUid);
  const { ws } = createWorkspace(server, { shardFiles: files, net });
  // a screen with no index yet answers "needed", it does not throw
  assert.equal(ws.shardGlue.shardMissing({ grades: ["고1"] }), true);
  ws.state.filters = { grade: "고1" };
  const held = await ws.bootFromShards();
  assert.equal(ws.shardGlue.shardNeedsLoading(), false);
  const heldKeys = [...held.shardKeys];
  net.offline = true;
  // (1) the teacher clicks another grade
  ws.state.filters = { grade: "중1" };
  assert.equal(ws.shardGlue.shardNeedsLoading(), true);
  await assert.rejects(ws.shardGlue.ensureShards(ws.shardGlue.shardNeed()), (error) => {
    assert.equal(error.code, "CATALOG_SHARD_NETWORK");
    assert.equal(error.message, NETWORK_MESSAGE);
    return true;
  });
  assert.equal(net.wholeBundleCalls || 0, 0, "a failed connection does not start the 20MB whole bundle");
  assert.equal(ws.state.catalog, held, "the catalog is exactly what it was");
  assert.doesNotThrow(() => ws.shardGlue.shardNeedsLoading());
  assert.equal(ws.shardGlue.shardNeedsLoading(), true, "still waiting for the grade, and asking says so without throwing");
  // (e) the grade that is open can be worked in again: it needs nothing more
  ws.state.filters = { grade: "고1" };
  assert.equal(ws.shardGlue.shardNeedsLoading(), false);
  // (2) the restore of a draft of another grade, offline: refused with the same message, the busy flag is released
  await assert.rejects(ws.shardGlue.ensureShardFiles(made.selected, made.sources, { grades: [made.filters.grade] }), (error) => error.code === "CATALOG_SHARD_NETWORK");
  assert.equal(ws.state.shardBusy, false, "the buttons are enabled again");
  assert.deepEqual([...ws.state.catalog.shardKeys], heldKeys);
  // back online: the same two actions work, with the choices kept
  net.offline = false;
  ws.state.filters = { grade: "중1" };
  await ws.shardGlue.ensureShards(ws.shardGlue.shardNeed());
  assert.equal(ws.shardGlue.shardNeedsLoading(), false);
  assert.ok(ws.state.catalog.shardKeys.includes("m1"));
  ws.state.filters = { grade: "고1" };
  await ws.shardGlue.ensureShardFiles(made.selected, made.sources, { grades: [made.filters.grade] });
  ws.applyDraft(made);
  assert.deepEqual(ws.state.selected.map((row) => row.questionUid), wanted);
  assert.equal(ws.state.shardBusy, false);
});

test("the shard files are wrong and the whole bundle is not there either: the screen stays on its shards, says why, and recovers when the files are right", async () => {
  const files = await shardFiles();
  const net = { offline: false, corrupt: new Set() };
  const { ws } = createWorkspace(server, { shardFiles: files, net });
  ws.state.filters = { grade: "고1" };
  const held = await ws.bootFromShards();
  net.corrupt.add("shard-m1.json");
  ws.state.filters = { grade: "중1" };
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    await assert.rejects(ws.shardGlue.ensureShards(ws.shardGlue.shardNeed()), (error) => {
      assert.equal(error.code, "CATALOG_SHARD_STALE");
      assert.equal(error.message, "자료가 갱신되는 중입니다. 잠시 뒤 다시 시도해 주세요.");
      return true;
    });
    assert.equal(net.wholeBundleCalls, attempt, "the whole bundle was tried (and is not there)");
    assert.equal(ws.state.catalog, held, "nothing changed");
    assert.doesNotThrow(() => ws.shardGlue.shardNeedsLoading());
    assert.equal(ws.shardGlue.shardNeedsLoading(), true);
  }
  net.corrupt.clear();
  await ws.shardGlue.ensureShards(ws.shardGlue.shardNeed());
  assert.ok(ws.state.catalog.shardKeys.includes("m1"), "recovered by asking again");
  assert.equal(ws.shardGlue.shardNeedsLoading(), false);
});

// the screen code that decides between the message and the whole bundle
test("shard failure policy in the screen: connection = message and retry, release/bytes = verified whole bundle, nothing changes until it arrives", () => {
  const source = readFileSync(root + "/archive/archive2-workspace.js", "utf8");
  assert.match(source, /if \(isNetworkFailure\(error\)\) throw shardNetworkError\(error\);\s*if \(!isShardFailure\(error\)\) throw error;\s*await swapToWholeBundle\(error\);/);
  assert.match(source, /const full = await window\.applyArchiveMetaFoundationCatalog\(\);\s*shardsBroken = true; shardSession = null;/, "the session is dropped only after the whole bundle arrived");
  assert.match(source, /function shardMissing\(need\) \{\s*try \{/, "a lookup never throws");
  assert.match(source, /ensureShardFiles\(restoring\?\.selected, restoring\?\.sources, \{ grades: \[restoring\?\.filters\?\.grade\] \}\);\s*\$\("modal"\)\.close\(\);/, "the dialog closes after the shards came");
  assert.match(source, /ensureShardFiles\(imported\?\.selected, imported\?\.sources, \{ grades: \[imported\?\.filters\?\.grade\] \}\)/);
  assert.match(source, /a === "shard-back"/);
});
