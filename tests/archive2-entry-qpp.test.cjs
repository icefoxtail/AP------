const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");
const output = require("../archive/archive2-output.js");

test("original QPP 8 stays identical from preview URL through assignment snapshot and PDF identity", async () => {
  const entry = fs.readFileSync(path.join(__dirname, "../archive/archive2-entry.js"), "utf8");
  const workspace = fs.readFileSync(path.join(__dirname, "../archive/archive2-workspace.js"), "utf8");
  const previewStart = workspace.indexOf("async function buildOriginalSourceOutput(");
  const previewEnd = workspace.indexOf("async function originalOutputUrl(", previewStart);
  const previewProducer = workspace.slice(previewStart, previewEnd);
  assert.notEqual(previewStart, -1);
  assert.match(previewProducer, /qpp:\s*settings\.qpp/);
  assert.match(workspace, /if \(!saved\) return buildOriginalSourceOutput\(e, mode, s\)/);
  const exam = { file: "original/middle/m1/qpp8.js", subject: "수학", grade: "중1", identityTitle: "QPP 8 시험" };
  const questions = [{ questionUid: "qpp8-question-1", question: "1 + 1 = ?", answer: "2" }];
  const assignmentTarget = { qpp: 4, view: "select", classState: {}, previewOpen: false, progress: null };
  const store = new Map([["APMATH_SESSION", JSON.stringify({ id: "teacher-qpp8" })]]);
  const localStorage = {
    getItem: key => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, String(value)),
  };
  const window = {
    Archive2Output: output,
    addEventListener() {},
  };
  const location = {
    search: "?archive2Issue=original%2Fmiddle%2Fm1%2Fqpp8.js&archive2Embedded=1&qpp=8",
    origin: "https://example.test",
    href: "https://example.test/archive/index.html?archive2Issue=original%2Fmiddle%2Fm1%2Fqpp8.js&archive2Embedded=1&qpp=8",
    pathname: "/archive/index.html",
  };
  const catalog = { exams: [exam], sourceHashes: [[exam.file, "source-qpp8-hash"]] };
  const sandbox = {
    window,
    parent: window,
    location,
    document: { documentElement: { classList: { add() {} } } },
    localStorage,
    URLSearchParams,
    AssignTarget: assignmentTarget,
    Archive2Core: { decodeCatalog: value => value },
    Archive2Source: { load: async () => questions },
    normalizedExams: () => [exam],
    openAssignTargetPanel: async (_item, qpp) => { assignmentTarget.qpp = qpp; },
    fetch: async () => ({ ok: true, json: async () => catalog }),
  };

  vm.runInNewContext(entry, sandbox, { filename: "archive2-entry.js" });
  assert.equal(await window.openArchive2OriginalIssue(), true);
  assert.equal(assignmentTarget.qpp, 8, "URL QPP 8 must not be reset to four");
  window.setArchive2OriginalQpp(8);
  const assignmentBody = await window.prepareArchive2OriginalAssignment(
    { id: "class-qpp8" },
    exam,
    { studentIds: ["student-qpp8"] },
  );

  assert.equal(assignmentBody.pdf_qpp, 8);
  assert.equal(assignmentBody.original_payload_json.meta.qpp, 8);

  const { buildPdfIdentity } = await import("../apmath/worker-backup/worker/routes/exam-pdf.js");
  const pdfIdentity = await buildPdfIdentity({
    id: "assignment-qpp8",
    class_id: "class-qpp8",
    archive_file: `exams/${exam.file}`,
    archive2_write_key: "archive2-write-qpp8",
    pdf_qpp: assignmentBody.pdf_qpp,
    question_count: assignmentBody.original_payload_json.questions.length,
    mixed_payload_json: JSON.stringify(assignmentBody.original_payload_json),
  });
  assert.equal(pdfIdentity.qpp, 8);
  assert.equal(pdfIdentity.outputEnvelope.meta.qpp, 8);
});
