import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import {
  assertReleaseClosure,
  fileSha,
  mathReviewInputSha,
  objectFileSha,
  validateReleaseTransition,
  productionWritePreflight,
  protectedPayloadSha,
  validatePastExamPromotion,
} from "../lib/hardening.mjs";
import { validatePortableZip } from "../lib/portable-package.mjs";
import { fixture as coreFixture } from "../../pipeline-core/tests/fixture.mjs";
import { denominatorInput, runInputSha } from "../../pipeline-core/closure.mjs";
import { fileRef } from "../../pipeline-core/canonical.mjs";
import { runPromotion } from "../promote-reviewed-exam.mjs";

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
  fs.writeFileSync(path.join(reportsDir, "source_fidelity_evidence.json"), `${JSON.stringify(fidelity, null, 2)}\n`);
  const fidelityItem = fidelity.items[0];
  const fidelitySha = fileSha(path.join(reportsDir, "source_fidelity_evidence.json"));
  const math = { schema: "PAST_EXAM_MATH_REVIEW_EVIDENCE_v1", status: "PASS", sourceInventorySha: inventorySha, sourceIdentityMapSha: identityMapSha, sourceFidelityEvidenceSha: fidelitySha, items: [{ sourceIdentityKey, inputSha: mathReviewInputSha(question, fidelityItem), inputVisibilityProfile: "SOURCE_ONLY", priorAnswerVisible: false, sourceOnlyBlindSolve: true, choiceUniqueness: true, questionValidity: true, solutionChecked: true, solutionConclusionMatches: true, independentAnswer: "163", verdict: "PASS" }] };
  const asset = { schema: "PAST_EXAM_ASSET_PROVENANCE_EVIDENCE_v1", status: "PASS", sourceInventorySha: inventorySha, sourceIdentityMapSha: identityMapSha, items: [{ sourceIdentityKey, ...question.visualAssetProvenance }] };
  for (const [name, value] of [["math_review_evidence.json", math], ["asset_provenance_evidence.json", asset]]) fs.writeFileSync(path.join(reportsDir, name), `${JSON.stringify(value, null, 2)}\n`);
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
  math.sourceFidelityEvidenceSha = fileSha(path.join(f.reportsDir, "source_fidelity_evidence.json"));
  const q2FidelityItem = fidelity.items[1];
  math.items.push({ ...math.items[0], sourceIdentityKey: q2.sourceIdentityKey, inputSha: mathReviewInputSha(q2, q2FidelityItem) });
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
    f.writeCandidate(wrongAsset);
    const assetFile = path.join(f.reportsDir, "asset_provenance_evidence.json");
    const asset = JSON.parse(fs.readFileSync(assetFile, "utf8"));
    asset.items[0].checks.CROP_PURITY = false;
    fs.writeFileSync(assetFile, `${JSON.stringify(asset, null, 2)}\n`);
    const review = { ...f.review, candidateSha: fileSha(f.candidateFile), assetProvenanceEvidenceSha: fileSha(assetFile) };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
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

test("frozen inventory, rich closure identity, and canonical promotion pass end to end", () => {
  const hardeningFixture = fixture();
  const core = coreFixture("past-exam", { visual: false });
  try {
    fs.cpSync(hardeningFixture.examRoot, path.join(core.root, "exam"), { recursive: true });
    const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../");
    fs.mkdirSync(path.join(core.root, "archive", "data", "master_tables"), { recursive: true });
    fs.cpSync(
      path.join(repositoryRoot, "archive", "data", "master_tables", "js_archive_tag_master.json"),
      path.join(core.root, "archive", "data", "master_tables", "js_archive_tag_master.json"),
    );
    const master = JSON.parse(fs.readFileSync(path.join(core.root, "archive", "data", "master_tables", "js_archive_tag_master.json"), "utf8"))
      .find((row) => row.status !== "deprecated" && row.subUnitKey);
    const candidateRel = "exam/candidate/fixture.candidate.js";
    const candidateFile = path.join(core.root, candidateRel);
    const reportsDir = path.join(core.root, "exam", "reports");
    const q = {
      ...hardeningFixture.question,
      level: "고1",
      category: "대수",
      originalCategory: "대수",
      standardCourse: "공통수학1",
      standardUnitKey: master.standardUnitKey,
      standardUnit: master.labelKo,
      standardUnitOrder: 1,
      subUnitKey: master.subUnitKey,
      subUnit: master.labelKo,
      subUnitConfidence: "candidate_evidence",
      subUnitClassificationDepth: "complete_candidate",
      questionType: "객관식",
      layoutTag: "grid",
      tags: ["기출"],
      wide: false,
      image: "",
      visualAsset: "",
      hasVisualAsset: false,
    };
    delete q.visualAssetProvenance;
    fs.writeFileSync(candidateFile, `window.examTitle = "fixture";\nwindow.questionBank = ${JSON.stringify([q], null, 2)};\n`, "utf8");
    const assetFile = path.join(reportsDir, "asset_provenance_evidence.json");
    fs.writeFileSync(assetFile, `${JSON.stringify({ schema: "PAST_EXAM_ASSET_PROVENANCE_EVIDENCE_v1", status: "NOT_APPLICABLE", sourceInventorySha: fileSha(path.join(reportsDir, "source_inventory.json")), sourceIdentityMapSha: fileSha(path.join(reportsDir, "source_identity_map.json")), items: [] }, null, 2)}\n`);
    const handoffFile = path.join(reportsDir, "gpt_gemini_handoff_manifest.json");
    fs.writeFileSync(handoffFile, `${JSON.stringify({ protectedPayload: [{ sourceIdentityKey: q.sourceIdentityKey, sha256: protectedPayloadSha(q) }] }, null, 2)}\n`);
    const review = {
      ...hardeningFixture.review,
      examId: "fixture",
      questionCount: 1,
      candidateSha: fileSha(candidateFile),
      handoffManifestSha: fileSha(handoffFile),
      protectedPayload: [{ sourceIdentityKey: q.sourceIdentityKey, sha256: protectedPayloadSha(q) }],
      assetProvenanceEvidenceSha: fileSha(assetFile),
    };
    const reviewFile = path.join(reportsDir, "review.json");
    fs.writeFileSync(reviewFile, `${JSON.stringify(review, null, 2)}\n`);
    const sourceRel = "exam/source.js";
    fs.writeFileSync(path.join(core.root, sourceRel), fs.readFileSync(candidateFile));
    const run = core.run;
    const richQuestionUid = `${sourceRel}|fixture|1`;
    run.questions[0] = {
      ...run.questions[0],
      questionUid: richQuestionUid,
      sourcePath: sourceRel,
      candidatePath: candidateRel,
      sourceDocumentSha256: q.sourceDocumentSha256,
      sourceQuestionNo: q.sourceQuestionNo,
      sourcePageNo: q.sourcePageNo,
      sourcePageEvidencePaths: q.sourcePageEvidencePaths,
      sourceIdentityKey: q.sourceIdentityKey,
      qid: q.id,
    };
    for (const rel of ["v1-input.json", "v2-input.json"]) {
      const file = path.join(core.root, rel);
      if (fs.existsSync(file)) {
        const bundle = JSON.parse(fs.readFileSync(file, "utf8"));
        if (bundle.questionUid) bundle.questionUid = richQuestionUid;
        if (bundle.content !== undefined) bundle.content = q.content;
        if (bundle.choices !== undefined) bundle.choices = q.choices;
        fs.writeFileSync(file, `${JSON.stringify(bundle, null, 2)}\n`);
      }
    }
    run.inputs = run.inputs.filter((ref) => !["source.js", "candidate.js"].includes(ref.path));
    run.inputs.push({ ...fileRef(core.root, sourceRel), role: "source" }, { ...fileRef(core.root, candidateRel), role: "candidate" });
    run.inputSha = runInputSha(run);
    run.registry = run.registry.map((row) => ({ ...row, inputSha: run.inputSha, questionUids: [richQuestionUid] }));
    run.denominator = { status: "FROZEN", stale: false, ...denominatorInput(run) };
    for (const ref of run.evidence) {
      const file = path.join(core.root, ref.path);
      const evidence = JSON.parse(fs.readFileSync(file, "utf8"));
      evidence.questionUid = richQuestionUid;
      evidence.inputSha = run.inputSha;
      evidence.reviewStartInputSha = run.inputSha;
      evidence.reviewEndInputSha = run.inputSha;
      if (evidence.payload?.candidatePath) evidence.payload.candidatePath = candidateRel;
      if (Array.isArray(evidence.payload?.questionUids)) evidence.payload.questionUids = [richQuestionUid];
      if (Array.isArray(evidence.payload?.itemWitnesses)) for (const witness of evidence.payload.itemWitnesses) witness.questionUid = richQuestionUid;
      if (Array.isArray(evidence.payload?.itemReviews)) for (const review of evidence.payload.itemReviews) review.questionUid = richQuestionUid;
      if (Array.isArray(evidence.payload?.assetAssociations)) for (const association of evidence.payload.assetAssociations) association.questionUid = richQuestionUid;
      if (evidence.payload?.inputBundle?.path) {
        const bundlePath = path.join(core.root, evidence.payload.inputBundle.path);
        if (fs.existsSync(bundlePath)) evidence.payload.inputBundle = fileRef(core.root, evidence.payload.inputBundle.path);
      }
      fs.writeFileSync(file, `${JSON.stringify(evidence, null, 2)}\n`);
      Object.assign(ref, fileRef(core.root, ref.path));
    }
    const evidenceRefsById = new Map(run.evidence.map((ref) => {
      const evidence = JSON.parse(fs.readFileSync(path.join(core.root, ref.path), "utf8"));
      return [evidence.evidenceId, ref];
    }));
    for (const ref of run.evidence) {
      const file = path.join(core.root, ref.path);
      const evidence = JSON.parse(fs.readFileSync(file, "utf8"));
      const captureRef = evidence.payload?.captureEvidenceId ? evidenceRefsById.get(evidence.payload.captureEvidenceId) : null;
      if (captureRef && evidence.payload.captureEvidenceSha !== captureRef.sha256) {
        evidence.payload.captureEvidenceSha = captureRef.sha256;
        fs.writeFileSync(file, `${JSON.stringify(evidence, null, 2)}\n`);
        Object.assign(ref, fileRef(core.root, ref.path));
      }
    }
    const renderIds = run.evidence.map((ref) => JSON.parse(fs.readFileSync(path.join(core.root, ref.path), "utf8"))).filter((e) => e.axis === "render").map((e) => e.evidenceId).sort();
    run.productionAuthorization = { status: "APPROVED", authorityId: "e2e-test", approvedAt: "2026-09-09T00:00:00Z", releaseInputSha: run.inputSha, runtimeBundleSha: run.renderRuntime.bundleSha, renderReviewEvidenceIds: renderIds };
    const closureManifest = path.join(core.root, "run.json");
    fs.writeFileSync(closureManifest, `${JSON.stringify(run, null, 2)}\n`);
    const manifestFile = path.join(core.root, "exam", "manifest.json");
    fs.writeFileSync(manifestFile, `${JSON.stringify({ examId: "fixture", archiveRelativePath: "original/high/h1/1final/fixture-e2e.js" }, null, 2)}\n`);
    runPromotion({
      archiveRootOverride: path.join(core.root, "archive"),
      quiet: true,
      argv: ["node", "promote-reviewed-exam.mjs", "--manifest", manifestFile, "--candidate", candidateFile, "--review", reviewFile, "--assets", path.join(core.root, "exam", "assets"), "--closure-manifest", closureManifest],
    });
    assert.ok(fs.existsSync(path.join(core.root, "archive", "exams", "original", "high", "h1", "1final", "fixture-e2e.js")));
  } finally {
    hardeningFixture.cleanup();
    core.cleanup();
  }
});

test("candidate self-declared visual PASS cannot override independent asset evidence", () => {
  const f = fixture();
  try {
    const assetFile = path.join(f.reportsDir, "asset_provenance_evidence.json");
    const asset = JSON.parse(fs.readFileSync(assetFile, "utf8"));
    asset.items[0].checks.CROP_PURITY = false;
    fs.writeFileSync(assetFile, `${JSON.stringify(asset, null, 2)}\n`);
    const review = { ...f.review, candidateSha: fileSha(f.candidateFile), assetProvenanceEvidenceSha: fileSha(assetFile) };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
    assert.ok(result.errors.some((error) => error.startsWith("CROP_PURITY_FAIL:q1:CROP_PURITY")));
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
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "past-exam-release-"));
  const writeRef = (relative, value) => {
    const file = path.join(root, relative);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, value);
    return { path: relative, bytes: fs.statSync(file).size, sha256: fileSha(file) };
  };
  try {
    const candidate = writeRef("candidate.js", "candidate");
    const production = writeRef("production.js", "production");
    const runtime = writeRef("runtime.js", "runtime");
    const renderEvidence = writeRef("reports/render.json", JSON.stringify({ render: { exam: "PASS", sol: "PASS", ans: "PASS" } }));
    const base = {
      state: "DONE",
      previousState: "REAL_RENDER_PASS",
      packageApplicable: false,
      portablePackageStatus: "NOT_APPLICABLE",
      browserTested: true,
      candidateSha: candidate.sha256,
      productionSha: production.sha256,
      runtimeBundleSha: runtime.sha256,
      renderEvidenceSha: renderEvidence.sha256,
      artifactRefs: { candidate, production, runtime, renderEvidence },
      render: { exam: "PASS", sol: "PASS", ans: "PASS" },
    };
    assert.throws(() => assertReleaseClosure({ ...base, render: { exam: "NOT_TESTED", sol: "PASS", ans: "PASS" } }, { root }), /RELEASE_BLOCKED:exam/);
    assert.doesNotThrow(() => assertReleaseClosure(base, { root }));
    assert.doesNotThrow(() => validateReleaseTransition("PROMOTED", "REAL_RENDER_PASS", { packageApplicable: false }));
    assert.throws(() => assertReleaseClosure({ ...base, candidateSha: sha("fake") }, { root }), /RELEASE_CANDIDATE_SHA_MISMATCH/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("math review becomes stale when the reviewed content payload changes", () => {
  const f = fixture();
  try {
    const mutated = { ...f.question, content: "현재 candidate의 발문이 변경되었다." };
    f.writeCandidate(mutated);
    const fidelityFile = path.join(f.reportsDir, "source_fidelity_evidence.json");
    const fidelity = JSON.parse(fs.readFileSync(fidelityFile, "utf8"));
    fidelity.items[0].contentSha256 = objectFileSha(mutated.content);
    fs.writeFileSync(fidelityFile, `${JSON.stringify(fidelity, null, 2)}\n`);
    const mathFile = path.join(f.reportsDir, "math_review_evidence.json");
    const math = JSON.parse(fs.readFileSync(mathFile, "utf8"));
    math.sourceFidelityEvidenceSha = fileSha(fidelityFile);
    fs.writeFileSync(mathFile, `${JSON.stringify(math, null, 2)}\n`);
    const handoffFile = path.join(f.reportsDir, "gpt_gemini_handoff_manifest.json");
    const handoff = JSON.parse(fs.readFileSync(handoffFile, "utf8"));
    handoff.protectedPayload[0].sha256 = protectedPayloadSha(mutated);
    fs.writeFileSync(handoffFile, `${JSON.stringify(handoff, null, 2)}\n`);
    const review = {
      ...f.review,
      candidateSha: fileSha(f.candidateFile),
      handoffManifestSha: fileSha(handoffFile),
      protectedPayload: [{ sourceIdentityKey: mutated.sourceIdentityKey, sha256: protectedPayloadSha(mutated) }],
      sourceFidelityEvidenceSha: fileSha(fidelityFile),
      mathReviewEvidenceSha: fileSha(mathFile),
    };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
    assert.ok(result.errors.some((error) => error.startsWith("MATH_REVIEW_INPUT_SHA_STALE:q1")), JSON.stringify(result.errors));
  } finally { f.cleanup(); }
});

test("partial multi-page source evidence cannot pass exact page-set parity", () => {
  const f = fixture();
  try {
    const q = { ...f.question, sourcePageEvidencePaths: ["pages/page_p001.png", "pages/page_p002.png"] };
    f.writeCandidate(q);
    const page2 = path.join(f.examRoot, "pages", "page_p002.png");
    fs.writeFileSync(page2, Buffer.from("fixture-page-two-bytes"));
    const inventoryFile = path.join(f.reportsDir, "source_inventory.json");
    const inventory = JSON.parse(fs.readFileSync(inventoryFile, "utf8"));
    inventory.questions[0].sourcePageEvidencePaths = [...q.sourcePageEvidencePaths];
    fs.writeFileSync(inventoryFile, `${JSON.stringify(inventory, null, 2)}\n`);
    const mapFile = path.join(f.reportsDir, "source_identity_map.json");
    const identityMap = JSON.parse(fs.readFileSync(mapFile, "utf8"));
    identityMap.sourceInventorySha = fileSha(inventoryFile);
    identityMap.questions = inventory.questions;
    fs.writeFileSync(mapFile, `${JSON.stringify(identityMap, null, 2)}\n`);
    const fidelityFile = path.join(f.reportsDir, "source_fidelity_evidence.json");
    const fidelity = JSON.parse(fs.readFileSync(fidelityFile, "utf8"));
    fidelity.sourceInventorySha = fileSha(inventoryFile);
    fidelity.sourceIdentityMapSha = fileSha(mapFile);
    fidelity.items[0].sourcePageEvidencePaths = [...q.sourcePageEvidencePaths];
    // Deliberately omit page_p002 from sourcePageEvidence[] to exercise the exact-set gate.
    fs.writeFileSync(fidelityFile, `${JSON.stringify(fidelity, null, 2)}\n`);
    const handoffFile = path.join(f.reportsDir, "gpt_gemini_handoff_manifest.json");
    const handoff = JSON.parse(fs.readFileSync(handoffFile, "utf8"));
    handoff.protectedPayload[0].sha256 = protectedPayloadSha(q);
    fs.writeFileSync(handoffFile, `${JSON.stringify(handoff, null, 2)}\n`);
    const review = {
      ...f.review,
      candidateSha: fileSha(f.candidateFile),
      handoffManifestSha: fileSha(handoffFile),
      protectedPayload: [{ sourceIdentityKey: q.sourceIdentityKey, sha256: protectedPayloadSha(q) }],
      sourceInventorySha: fileSha(inventoryFile),
      sourceIdentityMapSha: fileSha(mapFile),
      sourceFidelityEvidenceSha: fileSha(fidelityFile),
    };
    const result = validatePastExamPromotion({ candidateFile: f.candidateFile, manifest: f.manifest, review });
    assert.ok(result.errors.some((error) => error.startsWith("SOURCE_FIDELITY_FAIL:q1")), JSON.stringify(result.errors));
  } finally { f.cleanup(); }
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
  const f = fixture();
  try {
    const reviewFile = path.join(f.root, "review.json");
    const closureFile = path.join(f.root, "closure.json");
    fs.writeFileSync(reviewFile, JSON.stringify(f.review));
    fs.writeFileSync(closureFile, JSON.stringify({ status: "PASS", productionAuthorized: true }));
    const value = "sha256:" + "a".repeat(64);
    assert.throws(() => productionWritePreflight({
      changedPaths: ["archive/exams/original/high/h1/1final/x.js"],
      receipt: { status: "AUTHORIZED", candidateSha: value, closureManifestSha: value, sourceIdentitySetSha: value, reviewedPassEnvelopeSha: value, promotionTransactionId: "tx", closureInputSha: "sha256:" + "b".repeat(64) },
      candidateFile: f.candidateFile,
      reviewFile,
      closureManifestFile: closureFile,
      expectedSourceIdentities: [{ sourceIdentityKey: f.question.sourceIdentityKey }],
      closure: { status: "PASS", productionAuthorized: true, inputSha: "sha256:" + "c".repeat(64) },
    }), /UNAUTHORIZED_PRODUCTION_WRITE/);
  } finally { f.cleanup(); }
});
