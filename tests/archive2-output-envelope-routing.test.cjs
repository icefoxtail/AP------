const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { test } = require("node:test");

const read = (path) => readFileSync(path, "utf8");
const mixedEngine = read("archive/mixed_engine.html");
const output = read("archive/archive2-output.js");
const workspace = read("archive/archive2-workspace.js");
const library = read("archive/archive2-library.js");
const entry = read("archive/archive2-entry.js");
const pdf = read("apmath/worker-backup/worker/routes/exam-pdf.js");
const screenRuntime = read("archive/screen-runtime-adapter.js");
const examExecutor = read("archive/exam-render-executor.js");
function assertNoMatch(source, pattern, message) {
  assert.equal(pattern.test(source), false, message);
}
function assertMatch(source, pattern, message) {
  assert.equal(pattern.test(source), true, message);
}

test("Archive2 output consumption requires one exact request envelope before any legacy path", () => {
  const strictBranch = mixedEngine.indexOf("if (strictOutput)");
  const legacyStart = mixedEngine.indexOf("// Explicitly legacy, non-Archive2", strictBranch);
  assert.notEqual(strictBranch, -1, "Archive2 must have an explicit strict branch");
  assert.ok(legacyStart > strictBranch, "legacy reader must remain after the Archive2 branch");
  const branch = mixedEngine.slice(strictBranch, legacyStart);
  assertMatch(branch, /readOutputEnvelope/, "strict branch must read one envelope");
  assertMatch(branch, /outputRequestId/, "strict branch must bind the request id");
  assertMatch(branch, /outputOwnerId/, "strict branch must bind the owner id");
  assertMatch(branch, /원본에서 다시 열어/, "strict branch must give a reopen action");
  assertNoMatch(branch, /localStorage\.getItem|sessionStorage\.getItem/, "Archive2 must not fall through to web storage");
});

test("Archive2 browser producers do not persist questions and metadata as separate keys", () => {
  for (const [name, source] of Object.entries({ workspace, library, entry })) {
    assertNoMatch(source, /setItem\([\s\S]{0,80}mixedQuestions_/i, `${name} still writes mixedQuestions`);
    assertNoMatch(source, /setItem\([\s\S]{0,80}mixedMeta_/i, `${name} still writes mixedMeta`);
    assertMatch(source, /publishOutputEnvelope|outputRequestId/, `${name} must route output through the envelope`);
  }
});

test("embedded Output Envelope URLs carry iframe-only preview mode", () => {
  assertMatch(output, /if \(options\.preview\)[\s\S]*searchParams\.set\("preview", "1"\)/,
    "preview presentation must use the existing engine preview contract");
  assertMatch(mixedEngine, /get\('preview'\) === '1'[\s\S]*archive2-preview/,
    "the existing mixed renderer must own embedded preview presentation");
});

test("same-source Output Envelope mode switching uses the existing producer", () => {
  assertMatch(output, /async function publishOutputEnvelopeMode/,
    "mode transitions must mint an envelope instead of changing only the URL mode");
  assertMatch(output, /sourceKind: envelope\.sourceKind[\s\S]*sourceId: envelope\.sourceId[\s\S]*ownerId: envelope\.ownerId/,
    "mode transition must retain exact source and owner identity");
  assertMatch(output, /publishOutputEnvelopeMode,/,
    "same-source mode producer must be shared by existing output engines");
});

test("Worker PDF builds and validates an envelope without relying on browser IndexedDB", () => {
  assertMatch(pdf, /createOutputEnvelope/, "Worker must create the shared contract");
  assertMatch(pdf, /validateOutputEnvelope/, "PDF consumer must verify the contract");
  assertMatch(pdf, /outputEnvelope/, "PDF transport must carry the envelope");
  assertNoMatch(pdf, /localStorage\.setItem\(`mixedQuestions_/, "PDF must not write questions to browser localStorage");
  assertNoMatch(pdf, /localStorage\.setItem\(`mixedMeta_/, "PDF must not write metadata to browser localStorage");
  assertNoMatch(pdf, /indexedDB/i, "Worker/PDF must not use browser IndexedDB");
  assertMatch(pdf, /Archive2PdfReadiness\.assertReady/, "PDF route must use the shared readiness gate");
  assertMatch(mixedEngine, /Archive2PdfReadiness\.assertReady/, "mixed engine must gate a sealed browser render");
  assertMatch(screenRuntime, /Archive2PdfReadiness\.assertReady/, "original snapshot engine must gate a sealed browser render");
});

test("frozen assignment QPP 1/2 stays exact through envelope routing and rendering", () => {
  assertMatch(mixedEngine, /return \[1, 2, 4, 6, 8\]\.includes\(parsed\) \? parsed : 4/, "mixed output renderer must accept historical frozen QPP values");
  assertMatch(mixedEngine, /slotColumnCount = AppState\.qpp === 1 \? 1 : 2/, "one-question pages must not place a second question in the other column");
  assertMatch(examExecutor, /slotColumnCount = Number\(qpp\) === 1 \? 1 : 2/, "shared fast renderer must use one slot column for QPP 1");
});
