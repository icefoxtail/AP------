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
import { MAX_SAVED_PAPER_BYTES, catalog, chooseSample, configureSample, core, createWorker, createWorkspace, estimateSnapshotBytes, workerFilterKeys } from "./helpers/archive2-save-roundtrip-harness.mjs";

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

    // e3. a snapshot question changed on its way to the Worker is never saved silently
    await t.test(`${grade}: a changed snapshot question is refused`, async () => {
      const tamper = async (mutate, expected) => {
        const bad = createWorkspace(server);
        await bad.ws.openSavedPaperRevision(paperId);
        mutate(bad.ws.state.derivedBaseQuestions);
        const rowsBefore = (await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n;
        await bad.ws.savePapers();
        assert.notEqual(bad.ws.state.saveResultState, "SAVED", "a changed question must not be saved");
        assert.match(bad.ws.state.saveError, expected);
        assert.equal((await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n, rowsBefore, "nothing was stored");
        return bad;
      };
      // text changed next to an embedded image: the screen refuses before anything is sent
      const textIndex = paper.snapshot.questions.findIndex((q) => ["content", "solution"].some((f) => typeof q[f] === "string" && q[f].includes("data:image/")));
      if (textIndex >= 0) {
        const field = ["content", "solution"].find((f) => typeof paper.snapshot.questions[textIndex][f] === "string" && paper.snapshot.questions[textIndex][f].includes("data:image/"));
        const blocked = await tamper((base) => { base[textIndex][field] = String(base[textIndex][field]) + " 바뀐 문장"; }, /원본 문항이 바뀌어/);
        assert.equal(blocked.wire.posts.length, 0, "nothing was sent");
      }
      // problem text changed on a question whose text has no embedded image: the Worker's fingerprint check refuses
      const plainIndex = paper.snapshot.questions.findIndex((q) => typeof q.content === "string" && !q.content.includes("data:image/"));
      if (plainIndex >= 0) {
        const refusedText = await tamper((base) => { base[plainIndex].content = String(base[plainIndex].content) + " 바뀐 문장"; }, /fingerprint/);
        assert.equal(refusedText.wire.log.find((l) => l.method === "POST").status, 409);
      }
      // answer changed: the Worker's fingerprint check refuses
      const refused = await tamper((base) => { base[0].answer = String(base[0].answer) + "9"; }, /fingerprint/);
      assert.equal(refused.wire.log.find((l) => l.method === "POST").status, 409);
    });

    // f. one question's source changed after saving: the revision must not open silently with the old content
    const changed = createWorkspace(server);
    const uid = sentUids[0];
    changed.ws.state.byUid.set(uid, { ...changed.ws.state.byUid.get(uid), sourceFingerprint: "0".repeat(64) });
    await assert.rejects(() => changed.ws.openSavedPaperRevision(paperId), /원본 문항이 바뀌어/, `${grade}: a changed source must block the revision with a Korean notice`);
    assert.equal(changed.ws.state.derivationSource, null, "nothing was opened");
    assert.equal(changed.ws.state.selected.length, 0, "no old content was put on the screen");

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
  assert.match(refusedMeta.error, /canonical metadata parity mismatch/, "refused for the metadata mismatch, not for another reason");
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
