import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

import {
  assertReleaseClosure,
  fileSha,
  objectFileSha,
  productionWritePreflight,
  protectedPayloadSha,
  validatePastExamPromotion,
} from "../lib/hardening.mjs";
import { validatePortableZip } from "../lib/portable-package.mjs";

const sha = value => `sha256:${crypto.createHash("sha256").update(value).digest("hex")}`;

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "past-exam-hardening-"));
  const examRoot = path.join(root, "exam");
  const candidateDir = path.join(examRoot, "candidate");
  const reportsDir = path.join(examRoot, "reports");
  const assetsDir = path.join(examRoot, "assets");
  fs.mkdirSync(candidateDir, { recursive: true });
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  const sourceDocumentSha256 = sha("source-pdf-bytes");
  const sourceIdentityKey = `${sourceDocumentSha256}|1`;
  const question = {
    id: 1,
    content: "다음 함수의 최댓값을 구하여라.",
    choices: ["1", "2", "3", "4", "5"],
    answer: "163",
    solution: "독립적으로 경우를 나누어 계산하면 163이다.",
    sourceDocumentSha256,
    sourceQuestionNo: "1",
    sourcePageNo: 1,
    sourceIdentityKey,
    sourceEvidencePath: "pages/page_p001.png",
    fullPageImageRelPath: "pages/page_p001.png",
    image: "assets/q001_visual.png",
    visualAsset: "assets/q001_visual.png",
    hasVisualAsset: true,
    visualAssetProvenance: {
      assetPath: "assets/q001_visual.png",
      assetSha256: "",
      sourceDocumentSha256,
      sourceQuestionNo: "1",
      sourcePageNo: 1,
      sourceBBox: { x1: 1, y1: 1, x2: 10, y2: 10 },
      cropGenerator: "fixture",
      cropStatus: "SEMANTIC_REVIEW_PASS",
      verdict: "PASS",
      checks: {
        CROP_PURITY: true,
        NO_OTHER_QUESTION_TEXT: true,
        NO_CHOICES_CONTAMINATION: true,
        NO_PAGE_BORDER_CONTAMINATION: true,
        NO_CLIPPING: true,
        REQUIRED_LABELS_PRESENT: true,
        QUESTION_SEMANTIC_MATCH: true,
      },
    },
  };
  const assetFile = path.join(examRoot, question.image);
  fs.mkdirSync(path.dirname(assetFile), { recursive: true });
  fs.writeFileSync(assetFile, Buffer.from("fixture-png-bytes"));
  question.visualAssetProvenance.assetSha256 = fileSha(assetFile);
  const candidateFile = path.join(candidateDir, "fixture.candidate.js");
  const writeCandidate = q => {
    fs.writeFileSync(candidateFile, `window.examTitle = "fixture";\nwindow.questionBank = ${JSON.stringify([q], null, 2)};\n`, "utf8");
  };
  writeCandidate(question);
  const inventory = {
    schema: "PAST_EXAM_SOURCE_INVENTORY_v1",
    examId: "fixture",
    sourceDocumentSha256,
    pageCount: 1,
    expectedQuestionCount: 1,
    questions: [{
      sourceIdentityKey,
      sourceDocumentSha256,
      sourceQuestionNo: "1",
      sourcePageNo: 1,
      sourceEvidencePath: "pages/page_p001.png",
      sourcePageEvidencePaths: ["pages/page_p001.png"],
      disposition: "INCLUDED",
    }],
  };
  fs.writeFileSync(path.join(reportsDir, "source_inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`);
  fs.writeFileSync(path.join(reportsDir, "source_identity_map.json"), `${JSON.stringify({ schema: "PAST_EXAM_SOURCE_IDENTITY_MAP_v1", sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")), questions: inventory.questions, includedIdentitySet: [sourceIdentityKey] }, null, 2)}\n`);
  const fidelity = { schema: "PAST_EXAM_SOURCE_FIDELITY_EVIDENCE_v1", sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")), items: [{ sourceIdentityKey, sourceQuestionNo: "1", sourcePageNo: 1, sourceEvidencePath: "pages/page_p001.png", sourceEvidenceSha256: sha("source-page"), contentChecked: true, choicesChecked: true, verdict: "PASS", contentSha256: objectFileSha(question.content), choicesSha256: objectFileSha(question.choices) }] };
  const math = { schema: "PAST_EXAM_MATH_REVIEW_EVIDENCE_v1", status: "PASS", items: [{ sourceIdentityKey, inputVisibilityProfile: "SOURCE_ONLY", priorAnswerVisible: false, sourceOnlyBlindSolve: true, choiceUniqueness: true, questionValidity: true, independentAnswer: "163", verdict: "PASS" }] };
  const asset = { schema: "PAST_EXAM_ASSET_PROVENANCE_EVIDENCE_v1", status: "PASS", items: [{ sourceIdentityKey, ...question.visualAssetProvenance }] };
  for (const [name, value] of [["source_fidelity_evidence.json", fidelity], ["math_review_evidence.json", math], ["asset_provenance_evidence.json", asset]]) fs.writeFileSync(path.join(reportsDir, name), `${JSON.stringify(value, null, 2)}\n`);
  const handoffFile = path.join(reportsDir, "gpt_gemini_handoff_manifest.json");
  fs.writeFileSync(handoffFile, `${JSON.stringify({ protectedPayload: [{ sourceIdentityKey, sha256: protectedPayloadSha(question) }] }, null, 2)}\n`);
  const review = {
    status: "reviewed_pass",
    examId: "fixture",
    candidateSha: fileSha(candidateFile),
    promotionTransactionId: "fixture-transaction",
    sourceIdentitySet: [sourceIdentityKey],
    handoffManifestSha: fileSha(handoffFile),
    protectedPayload: [{ sourceIdentityKey, sha256: protectedPayloadSha(question) }],
    sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")),
    sourceIdentityMapSha: fileSha(path.join(reportsDir, "source_identity_map.json")),
    sourceFidelityEvidenceSha: fileSha(path.join(reportsDir, "source_fidelity_evidence.json")),
    mathReviewEvidenceSha: fileSha(path.join(reportsDir, "math_review_evidence.json")),
    assetProvenanceEvidenceSha: fileSha(path.join(reportsDir, "asset_provenance_evidence.json")),
  };
  const manifest = { examId: "fixture", archiveRelativePath: "original/high/h1/1final/fixture.js" };
  return { root, examRoot, reportsDir, candidateFile, question, review, manifest, writeCandidate, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}

test("positive source, fidelity, math, asset and handoff fixture is promotable", () => {
  const f = fixture();
  try {
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.equal(result.status, "PASS");
    assert.deepEqual(result.identityKeys, [f.question.sourceIdentityKey]);
  } finally { f.cleanup(); }
});

test("source identity drift blocks with an explicit source-question failure", () => {
  const f = fixture();
  try {
    const wrong = { ...f.question, sourceQuestionNo: "8", sourceIdentityKey: `${f.question.sourceDocumentSha256}|8` };
    f.writeCandidate(wrong);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.equal(result.status, "BLOCKED");
    assert.ok(result.errors.some(error => error.startsWith("SOURCE_QUESTION_IDENTITY_FAIL")));
    assert.ok(result.errors.some(error => error.startsWith("SOURCE_INVENTORY_COVERAGE_FAIL")));
  } finally { f.cleanup(); }
});

test("an inventory of 25 questions cannot be silently reduced to an 18-question candidate", () => {
  const f = fixture();
  try {
    const inventoryFile = path.join(f.reportsDir, "source_inventory.json");
    const inventory = JSON.parse(fs.readFileSync(inventoryFile, "utf8"));
    for (let index = 2; index <= 25; index += 1) inventory.questions.push({
      sourceIdentityKey: `${inventory.sourceDocumentSha256}|${index}`,
      sourceDocumentSha256: inventory.sourceDocumentSha256,
      sourceQuestionNo: String(index),
      sourcePageNo: 1,
      sourceEvidencePath: "pages/page_p001.png",
      disposition: "INCLUDED",
    });
    inventory.expectedQuestionCount = 25;
    fs.writeFileSync(inventoryFile, `${JSON.stringify(inventory, null, 2)}\n`);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.ok(result.errors.some(error => error.startsWith("SOURCE_INVENTORY_COVERAGE_FAIL")));
  } finally { f.cleanup(); }
});

test("wrong asset identity and contaminated crop are hard failures", () => {
  const f = fixture();
  try {
    const wrongAsset = structuredClone(f.question);
    wrongAsset.visualAssetProvenance.sourceQuestionNo = "20";
    wrongAsset.visualAssetProvenance.checks.CROP_PURITY = false;
    f.writeCandidate(wrongAsset);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.ok(result.errors.some(error => error.startsWith("QUESTION_ASSET_IDENTITY_MISMATCH")));
    assert.ok(result.errors.some(error => error.startsWith("CROP_PURITY_FAIL")));
  } finally { f.cleanup(); }
});

test("independent math evidence catches an answer that contradicts the blind solve", () => {
  const f = fixture();
  try {
    const mathFile = path.join(f.reportsDir, "math_review_evidence.json");
    const math = JSON.parse(fs.readFileSync(mathFile, "utf8"));
    math.items[0].independentAnswer = "95";
    fs.writeFileSync(mathFile, `${JSON.stringify(math, null, 2)}\n`);
    f.review.mathReviewEvidenceSha = fileSha(mathFile);
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.ok(result.errors.some(error => error.startsWith("MATH_REVIEW_FAIL")));
  } finally { f.cleanup(); }
});

test("serialization and handoff mutation locks fail closed", () => {
  const f = fixture();
  try {
    const bad = { ...f.question, content: "깨진 $식", solution: "\u0001" };
    f.writeCandidate(bad);
    const review = { ...f.review, candidateSha: fileSha(f.candidateFile), changedFields: ["content"] };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
    assert.ok(result.errors.includes("SERIALIZATION_FAIL"));
    assert.ok(result.errors.includes("ANSWER_SOLUTION_SCOPE_VIOLATION"));
  } finally { f.cleanup(); }
});

test("release remains blocked until exact ZIP and all three real renders pass", () => {
  const hash = sha("bound");
  assert.throws(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", render: { exam: "NOT_TESTED", sol: "PASS", ans: "PASS" } }), /RELEASE_BLOCKED:exam/);
  assert.doesNotThrow(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", exactDeliverableZip: true, freshExtraction: true, browserTested: true, zipSha256: hash, extractedTreeSha256: hash, candidateSha: hash, productionSha: hash, runtimeBundleSha: hash, renderEvidenceSha: hash, render: { exam: "PASS", sol: "PASS", ans: "PASS" } }));
});

test("portable ZIP gate detects a manifest path that differs from the exact entry name", () => {
  const f = fixture();
  const zip = path.join(f.root, "fixture.zip");
  const zipManifest = path.join(f.root, "zip-manifest.json");
  try {
    const script = "import zipfile,sys; z=zipfile.ZipFile(sys.argv[1],'w'); z.writestr('한글/원본.hwp', b'x'); z.close()";
    const made = spawnSync("python", ["-c", script, zip], { encoding: "utf8" });
    assert.equal(made.status, 0, made.stderr);
    fs.writeFileSync(zipManifest, JSON.stringify({ manifestPath: "한글/원본-손상.hwp", files: [{ path: "한글/원본-손상.hwp" }] }));
    const result = validatePortableZip({ zipFile: zip, manifestFile: zipManifest });
    assert.equal(result.status, "FAIL");
    assert.ok(result.errors.some(error => error.startsWith("MANIFEST_PATH_MISSING")), JSON.stringify(result));
  } finally { f.cleanup(); }
});

test("direct production write guard requires a promotion receipt", () => {
  assert.throws(() => productionWritePreflight({ changedPaths: ["archive/exams/original/high/h1/1final/x.js"], receipt: {} }), /UNAUTHORIZED_PRODUCTION_WRITE/);
  const value = "sha256:" + "a".repeat(64);
  assert.equal(productionWritePreflight({ changedPaths: ["archive/db.js"], receipt: { candidateSha: value, closureManifestSha: value, sourceIdentitySetSha: value, reviewedPassEnvelopeSha: value, promotionTransactionId: "tx" } }).status, "PASS");
});
