const assert = require("node:assert/strict");
const fs = require("node:fs");
const { test } = require("node:test");
const { webcrypto } = require("node:crypto");
const contract = require("../archive/archive2-output-contract.js");

const savedPaper = fs.readFileSync("apmath/worker-backup/worker/helpers/archive-saved-papers.js", "utf8");
const savedPaperRoute = fs.readFileSync("apmath/worker-backup/worker/routes/archive-saved-papers.js", "utf8");
const archive2Route = fs.readFileSync("apmath/worker-backup/worker/routes/archive2.js", "utf8");
const assignmentRoute = fs.readFileSync("apmath/worker-backup/worker/routes/exams.js", "utf8");
const pdfRoute = fs.readFileSync("apmath/worker-backup/worker/routes/exam-pdf.js", "utf8");
function assertMatch(source, pattern, message) {
  assert.equal(pattern.test(source), true, message);
}

async function envelope(questions, suffix) {
  const createdAt = Date.now();
  return contract.createOutputEnvelope({
    outputRequestId: `11111111-1111-4111-8111-${suffix.padStart(12, "0")}`,
    ownerId: "22222222-2222-4222-8222-222222222222",
    sourceKind: "archive2-compose",
    sourceId: `capacity-${suffix}`,
    mode: "exam",
    questionCount: questions.length,
    questionUids: questions.map(question => question.questionUid),
    meta: { title: "용량 계측", qpp: 4, questionUids: questions.map(question => question.questionUid) },
    questions,
    createdAt,
    expiresAt: createdAt + contract.DEFAULT_TTL_MS,
  }, webcrypto);
}

test("browser output metrics separate canonical JSON bytes, base64 data URLs, and decoded image bytes", async () => {
  const raw = new Uint8Array(32 * 1024).fill(7);
  const base64 = Buffer.from(raw).toString("base64");
  const sourceQuestion = [{ questionUid: "qid_v1_capacity", image: "images/source.svg" }];
  const pinnedQuestion = [{ questionUid: "qid_v1_capacity", image: `data:image/png;base64,${base64}` }];
  const before = contract.measureOutputEnvelope(await envelope(sourceQuestion, "1"));
  const after = contract.measureOutputEnvelope(await envelope(pinnedQuestion, "2"));
  assert.equal(before.imageDataUrlBytes, 0);
  assert.equal(before.estimatedPinnedImageBytes, 0);
  assert.equal(after.estimatedPinnedImageBytes, raw.byteLength);
  assert.ok(after.imageDataUrlBytes > after.estimatedPinnedImageBytes);
  assert.ok(after.canonicalJsonBytes > before.canonicalJsonBytes);
  assert.ok(after.browserJsonBytes > 0);
});

test("50-question multi-image materialization reports UTF-8 and pinned-image growth independently", async () => {
  const binaryBytes = 4 * 1024;
  const base64 = Buffer.alloc(binaryBytes, 23).toString("base64");
  const questions = Array.from({ length: 50 }, (_, index) => ({
    questionUid: `qid_v1_${String(index + 1).padStart(64, "0")}`,
    content: `문항 ${index + 1}`,
    image: `data:image/png;base64,${base64}`,
  }));
  const metrics = contract.measureOutputEnvelope(await envelope(questions, "3"));
  assert.equal(metrics.estimatedPinnedImageBytes, 50 * binaryBytes);
  assert.ok(metrics.imageDataUrlBytes > metrics.estimatedPinnedImageBytes);
  assert.ok(metrics.canonicalJsonBytes > metrics.canonicalJsonCodeUnits);
  assert.equal(metrics.browserJsonBytes > 0, true);
});

test("separate Saved Paper, batch, Archive2 request-text, Assignment text, and PDF injection boundaries remain explicit", () => {
  assertMatch(savedPaper, /MAX_SAVED_PAPER_BYTES = 1_500_000/, "per-snapshot limit stays 1,500,000 bytes");
  assertMatch(savedPaper, /MAX_SAVED_BATCH_BYTES = 8_000_000/, "batch limit stays 8,000,000 bytes");
  assertMatch(savedPaper, /const size = byteLength\(snapshotJson\)/, "snapshot byte limit is measured after pinning");
  assertMatch(savedPaperRoute, /Content-Length/, "batch route measures the request boundary");
  assertMatch(savedPaperRoute, /bytes > MAX_SAVED_BATCH_BYTES/, "streamed request bytes use the batch limit");
  assertMatch(archive2Route, /bytes > 3600000/, "Archive2 request byte cap remains independent");
  assertMatch(archive2Route, /text\.length > 900000/, "Archive2 text cap remains independent");
  assertMatch(assignmentRoute, /value\.length > 900000/, "assignment JSON text cap remains independent");
  assertMatch(pdfRoute, /outputEnvelopeMetrics/, "PDF records envelope capacity metrics");
  assertMatch(pdfRoute, /envelope_browser_json_bytes/, "PDF reports its browser injection representation size");
});
