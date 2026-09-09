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
    sourcePageEvidencePaths: ["pages/page_p001.png"],
    sourceIdentityKey,
    sourceEvidencePath: "pages/page_p001.png",
    fullPageImageRelPath: "pages/page_p001.png",
    image: "assets/q001_visual.png",
    visualAsset: "assets/q001_visual.png",
    hasVisualAsset: true,
    visualAssetProvenance: {
      assetPath: "assets/q001_visual.png",
      assetSha256: "",
      assetBindingType: "DIRECT",
      sourceDocumentSha256,
      sourceQuestionNo: "1",
      sourcePageNo: 1,
      sourcePageEvidence: "pages/page_p001.png",
      sourceBBox: { x1: 1, y1: 1, x2: 10, y2: 10 },
      pngDecodePass: true,
      naturalWidth: 9,
      naturalHeight: 9,
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
  fs.mkdirSync(path.join(examRoot, "pages"), { recursive: true });
  fs.writeFileSync(path.join(examRoot, "pages", "page_p001.png"), Buffer.from("fixture-page-bytes"));
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
    status: "SOURCE_INVENTORY_FROZEN",
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
  fs.writeFileSync(path.join(reportsDir, "source_identity_map.json"), `${JSON.stringify({ schema: "PAST_EXAM_SOURCE_IDENTITY_MAP_v1", status: "SOURCE_INVENTORY_FROZEN", sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")), questions: inventory.questions, includedIdentitySet: [sourceIdentityKey] }, null, 2)}\n`);
  const pageSha = fileSha(path.join(examRoot, "pages", "page_p001.png"));
  const fidelity = { schema: "PAST_EXAM_SOURCE_FIDELITY_EVIDENCE_v1", status: "PASS", sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")), sourceIdentityMapSha: fileSha(path.join(reportsDir, "source_identity_map.json")), items: [{ sourceIdentityKey, sourceQuestionNo: "1", sourcePageNo: 1, sourcePageEvidencePaths: ["pages/page_p001.png"], sourcePageEvidence: [{ path: "pages/page_p001.png", sha256: pageSha }], sourceEvidencePath: "pages/page_p001.png", sourceEvidenceSha256: pageSha, contentChecked: true, choicesChecked: true, verdict: "PASS", contentSha256: objectFileSha(question.content), choicesSha256: objectFileSha(question.choices) }] };
  const inventorySha = fileSha(path.join(reportsDir, "source_inventory.json"));
  const identityMapSha = fileSha(path.join(reportsDir, "source_identity_map.json"));
  const math = { schema: "PAST_EXAM_MATH_REVIEW_EVIDENCE_v1", status: "PASS", sourceInventorySha: inventorySha, sourceIdentityMapSha: identityMapSha, items: [{ sourceIdentityKey, inputVisibilityProfile: "SOURCE_ONLY", priorAnswerVisible: false, sourceOnlyBlindSolve: true, choiceUniqueness: true, questionValidity: true, solutionChecked: true, solutionConclusionMatches: true, independentAnswer: "163", verdict: "PASS" }] };
  const asset = { schema: "PAST_EXAM_ASSET_PROVENANCE_EVIDENCE_v1", status: "PASS", sourceInventorySha: inventorySha, sourceIdentityMapSha: identityMapSha, items: [{ sourceIdentityKey, ...question.visualAssetProvenance }] };
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

function sharedMaterialFixture() {
  const f = fixture();
  const q1 = structuredClone(f.question);
  const q2 = structuredClone(f.question);
  q2.id = 2;
  q2.content = "공통 그림을 이용하여 두 번째 문항을 해결하여라.";
  q2.sourceQuestionNo = "2";
  q2.sourceIdentityKey = `${q2.sourceDocumentSha256}|2`;
  const shared = {
    ...q1.visualAssetProvenance,
    assetBindingType: "SHARED_MATERIAL",
    sharedMaterialUid: "shared-material-1",
    dependencyQuestionSet: ["1", "2"],
    sourceQuestionNo: "1",
  };
  q1.visualAssetProvenance = structuredClone(shared);
  q2.visualAssetProvenance = structuredClone(shared);
  fs.writeFileSync(f.candidateFile, `window.examTitle = "fixture";\nwindow.questionBank = ${JSON.stringify([q1, q2], null, 2)};\n`, "utf8");
  const inventory = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "source_inventory.json"), "utf8"));
  inventory.expectedQuestionCount = 2;
  inventory.questions.push({
    sourceIdentityKey: q2.sourceIdentityKey,
    sourceDocumentSha256: q2.sourceDocumentSha256,
    sourceQuestionNo: "2",
    sourcePageNo: 1,
    sourceEvidencePath: "pages/page_p001.png",
    sourcePageEvidencePaths: ["pages/page_p001.png"],
    disposition: "INCLUDED",
  });
  const inventoryFile = path.join(f.reportsDir, "source_inventory.json");
  fs.writeFileSync(inventoryFile, `${JSON.stringify(inventory, null, 2)}\n`);
  const mapFile = path.join(f.reportsDir, "source_identity_map.json");
  fs.writeFileSync(mapFile, `${JSON.stringify({ schema: "PAST_EXAM_SOURCE_IDENTITY_MAP_v1", status: "SOURCE_INVENTORY_FROZEN", sourceInventorySha: fileSha(inventoryFile), questions: inventory.questions, includedIdentitySet: [q1.sourceIdentityKey, q2.sourceIdentityKey] }, null, 2)}\n`);
  const pageFile = path.join(f.examRoot, "pages", "page_p001.png");
  const pageSha = fileSha(pageFile);
  const fidelity = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "source_fidelity_evidence.json"), "utf8"));
  fidelity.sourceInventorySha = fileSha(inventoryFile);
  fidelity.sourceIdentityMapSha = fileSha(mapFile);
  const fidelityItem = fidelity.items[0];
  fidelity.items.push({ ...fidelityItem, sourceIdentityKey: q2.sourceIdentityKey, sourceQuestionNo: "2", contentSha256: objectFileSha(q2.content) });
  fs.writeFileSync(path.join(f.reportsDir, "source_fidelity_evidence.json"), `${JSON.stringify(fidelity, null, 2)}\n`);
  const math = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "math_review_evidence.json"), "utf8"));
  math.sourceInventorySha = fileSha(inventoryFile);
  math.sourceIdentityMapSha = fileSha(mapFile);
  math.items.push({ ...math.items[0], sourceIdentityKey: q2.sourceIdentityKey });
  fs.writeFileSync(path.join(f.reportsDir, "math_review_evidence.json"), `${JSON.stringify(math, null, 2)}\n`);
  const asset = JSON.parse(fs.readFileSync(path.join(f.reportsDir, "asset_provenance_evidence.json"), "utf8"));
  asset.sourceInventorySha = fileSha(inventoryFile);
  asset.sourceIdentityMapSha = fileSha(mapFile);
  asset.items = [{ sourceIdentityKey: q1.sourceIdentityKey, ...q1.visualAssetProvenance }, { sourceIdentityKey: q2.sourceIdentityKey, ...q2.visualAssetProvenance }];
  fs.writeFileSync(path.join(f.reportsDir, "asset_provenance_evidence.json"), `${JSON.stringify(asset, null, 2)}\n`);
  const handoffFile = path.join(f.reportsDir, "gpt_gemini_handoff_manifest.json");
  fs.writeFileSync(handoffFile, `${JSON.stringify({ protectedPayload: [{ sourceIdentityKey: q1.sourceIdentityKey, sha256: protectedPayloadSha(q1) }, { sourceIdentityKey: q2.sourceIdentityKey, sha256: protectedPayloadSha(q2) }] }, null, 2)}\n`);
  f.review = {
    ...f.review,
    candidateSha: fileSha(f.candidateFile),
    handoffManifestSha: fileSha(handoffFile),
    sourceInventorySha: fileSha(inventoryFile),
    sourceIdentityMapSha: fileSha(mapFile),
    sourceFidelityEvidenceSha: fileSha(path.join(f.reportsDir, "source_fidelity_evidence.json")),
    mathReviewEvidenceSha: fileSha(path.join(f.reportsDir, "math_review_evidence.json")),
    assetProvenanceEvidenceSha: fileSha(path.join(f.reportsDir, "asset_provenance_evidence.json")),
    sourceIdentitySet: [q1.sourceIdentityKey, q2.sourceIdentityKey],
    protectedPayload: [{ sourceIdentityKey: q1.sourceIdentityKey, sha256: protectedPayloadSha(q1) }, { sourceIdentityKey: q2.sourceIdentityKey, sha256: protectedPayloadSha(q2) }],
  };
  return f;
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

test("shared material provenance permits one visual asset for its declared dependency set", () => {
  const f = sharedMaterialFixture();
  try {
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review: f.review });
    assert.equal(result.status, "PASS", JSON.stringify(result.errors));
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

test("placeholder and incomplete objective payloads cannot reach promotion", () => {
  const f = fixture();
  try {
    const bad = { ...f.question, questionType: "객관식", content: "Source question 8 unresolved", choices: ["1", "2"] };
    f.writeCandidate(bad);
    const review = { ...f.review, candidateSha: fileSha(f.candidateFile) };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
    assert.ok(result.errors.includes("PLACEHOLDER_PAYLOAD:q1"));
    assert.ok(result.errors.includes("CHOICES_STRUCTURE_FAIL:q1"));
  } finally { f.cleanup(); }
});

test("release remains blocked until exact ZIP and all three real renders pass", () => {
  const hash = sha("bound");
  assert.throws(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", render: { exam: "NOT_TESTED", sol: "PASS", ans: "PASS" } }), /RELEASE_BLOCKED:exam/);
  assert.doesNotThrow(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", packageApplicable: true, exactDeliverableZip: true, freshExtraction: true, browserTested: true, zipSha256: hash, extractedTreeSha256: hash, candidateSha: hash, productionSha: hash, runtimeBundleSha: hash, renderEvidenceSha: hash, render: { exam: "PASS", sol: "PASS", ans: "PASS" }, packageRender: { exam: "PASS", sol: "PASS", ans: "PASS" } }));
  assert.doesNotThrow(() => assertReleaseClosure({ state: "DONE", previousState: "REAL_RENDER_PASS", packageApplicable: false, portablePackageStatus: "NOT_APPLICABLE", browserTested: true, candidateSha: hash, productionSha: hash, runtimeBundleSha: hash, renderEvidenceSha: hash, render: { exam: "PASS", sol: "PASS", ans: "PASS" } }));
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
  assert.equal(productionWritePreflight({ changedPaths: ["archive/db.js"], receipt: { status: "AUTHORIZED", candidateSha: value, closureManifestSha: value, sourceIdentitySetSha: value, reviewedPassEnvelopeSha: value, promotionTransactionId: "tx" } }).status, "PASS");
});

test('V3 completion permits classification and solution-visual fields but checks real baseline differences', () => {
  const f = fixture();
  try {
    const handoffFile = path.join(f.reportsDir, 'gpt_gemini_handoff_manifest.json');
    const handoff = JSON.parse(fs.readFileSync(handoffFile, 'utf8'));
    handoff.completionContract = 'PAST_EXAM_V3_COMPLETE';
    handoff.completionBaseline = [structuredClone(f.question)];
    fs.writeFileSync(handoffFile, JSON.stringify(handoff));
    f.review.handoffManifestSha = fileSha(handoffFile);
    f.question.level = '상';
    f.question.standardCourse = '공통수학1';
    f.question.solutionImageAlt = '해설용 그림 설명';
    f.review.changedFields = ['level', 'standardCourse', 'solutionImageAlt'];
    f.writeCandidate(f.question); f.review.candidateSha = fileSha(f.candidateFile);
    assert.equal(validatePastExamPromotion(f).status, 'PASS');
    // No changedFields declaration can hide an actual protected layout mutation.
    f.question.layoutTag = 'fullwidth';
    f.writeCandidate(f.question); f.review.candidateSha = fileSha(f.candidateFile);
    const report = validatePastExamPromotion(f);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.includes('ANSWER_SOLUTION_SCOPE_VIOLATION:q1:layoutTag'));
  } finally { f.cleanup(); }
});
