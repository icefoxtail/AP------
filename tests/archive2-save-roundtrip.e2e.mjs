// Teacher's "save a paper" job, start to finish: the real screen script (archive2-workspace.js) builds a paper with generate()
// and saves it with savePapers() against the real Worker code on a local D1. Runs in its own CI job "Archive2 save round trip"
// (.github/workflows/archive2-save-roundtrip.yml); it is intentionally NOT in tools/run-tests.js.
// Local run: npm ci --prefix apmath/worker-backup/worker && node archive/tools/build-archive2-catalog.mjs --package-only
//            node --test tests/archive2-save-roundtrip.e2e.mjs      (about 1 minute; no network, no production request)
// Assertions are defect conditions (no rejection, same order, no duplicate rows, hash verified) and never fix data counts.
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import { after, before, test } from "node:test";
import { MAX_SAVED_PAPER_BYTES, catalog, chooseSample, configureSample, core, createWorker, createWorkspace } from "./helpers/archive2-save-roundtrip-harness.mjs";

// 고3 is not sampled: its general-use pool has too few questions per unit for a 20-question, two-unit paper.
const GRADES = ["중1", "중2", "중3", "고1", "고2"];
const PER_UNIT = 10;
const ROLE = { "X-Fixture-Role": "admin" };

let server;
before(async () => { server = await createWorker(); });
after(async () => { await server?.dispose(); });

const knownDefectGrades = [];
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
    // Saving the revision re-sends the saved questions. Everything here is strict except ONE known defect (repair list 34):
    // a saved paper whose PROBLEM side (content/choices/image) carries embedded data: images is refused by the Worker with
    // "assignment fingerprint가 일치하지 않습니다" (its fingerprint covers exactly content/choices/image). A paper with images only
    // in the solution saves fine. The allowance below is that single condition; any other failure, or the same failure on a paper
    // without problem-side images, fails the check. When a fix makes the re-save succeed, the strict assertions below run
    // unchanged. Completion criterion of the fixing PR = delete the allowance (knownRevisionResaveDefect) and its summary test.
    await t.test(`${grade}: save the revision`, async () => {
      const rowsBefore = (await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n;
      await revision.ws.savePapers();
      if (revision.ws.state.saveResultState !== "SAVED") {
        const hasProblemSideImage = paper.snapshot.questions.some((q) =>
          (typeof q.image === "string" && q.image.startsWith("data:")) || JSON.stringify([q.content, q.choices]).includes("data:image/"));
        const knownRevisionResaveDefect = hasProblemSideImage && /assignment fingerprint가 일치하지 않습니다/.test(revision.ws.state.saveError);
        if (!knownRevisionResaveDefect) assert.fail(sendFailure(revision.ws, grade + " (revision)"));
        const refusal = revision.wire.log.filter((l) => l.route === "/archive-saved-papers" && l.method === "POST").at(-1);
        assert.equal(refusal?.status, 409, "the known refusal is a 409 about the question fingerprint");
        assert.equal((await server.db.prepare("SELECT COUNT(*) n FROM archive_saved_papers").first()).n, rowsBefore, "a refused revision stores nothing (no half save)");
        knownDefectGrades.push(grade);
        return;
      }
      const lineage = await server.db.prepare("SELECT parent_id, derivation_type FROM archive_saved_paper_lineage WHERE child_saved_paper_id=?").bind(revision.ws.state.savedPaperIds[0]).first();
      assert.equal(lineage?.parent_id, paperId, "the revision is linked to its parent");
      assert.ok(["REVISION", "FORK"].includes(lineage.derivation_type));
      const savedRevision = await (await api("/archive-saved-papers/" + revision.ws.state.savedPaperIds[0])).json();
      assert.deepEqual(savedRevision.paper.snapshot.questions.map((q) => q.questionUid), sentUids, `${grade}: the saved revision changed the question order`);
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

// Printed every run (and into the job summary) so the known defect (repair list 34) can never be forgotten or silently fixed.
test("known defect summary (수리 목록 34)", () => {
  const line = knownDefectGrades.length
    ? `알려진 결함 ${knownDefectGrades.length}건: 그림 있는 저장본의 수정본 재저장 409 (수리 목록 34) — ${knownDefectGrades.join(", ")}`
    : "알려진 결함 (34)이 재현되지 않음 — 허용 코드를 지워도 됨 (knownRevisionResaveDefect)";
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Archive2 save round trip
${line}
`);
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
