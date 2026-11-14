import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isAuditedPendingIntegrationRebindAllowed, isMetaPipelineApprovedTypeRebindAllowed, isSopPendingSourceNamespaceCorrectionAllowed, isSopV12SourceFieldCorrectionAllowed, isSourceConditionEvidenceDebtAllowed, metaPipelineCrossConceptCountMatches, metaPipelineTemplateReuseCountMatches, registerReviewedExamV2, sopV12PackIncludes, sourceVisualType, validateSourceConditionCorrections, validateSourceCrossConceptCorrections, validateTargetedAuditCorrections, validateTargetedRecoverySupplement, verifyConsumerValues } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";

test("targeted audit correction preserves raw provenance and cannot merge canonical keys", () => {
  const ref = { path: "docs/audit-correction.json", sha256: "a".repeat(64) };
  const row = { questionUid: "uid", sourceOrdinal: 1, originalDifficultyReason: "기존 설명",
    correctedDifficultyReason: "원본에 맞는 설명", originalCrossConceptKeys: ["CC_OLD"],
    correctedCrossConceptKeys: ["CC_OTHER_AUDITED"], sourceTextExcerpt: "홀함수", sourceSolutionExcerpt: "대칭구간 적분", reason: "원본에 맞춤" };
  const corrections = { schemaVersion: "meta-pipeline-targeted-audit-corrections-v1", sourceArchiveFile: "original/exam.js",
    sourceSha256: "b".repeat(64), sourceBlobSha1: "c".repeat(40), reviewer: { role: "CODEX_META_PIPELINE_COURIER", id: "root" }, records: [row] };
  const audited = { questionId: 1, crossConceptKeys: ["CC_OLD"], difficultyReason: "기존 설명" };
  const args = { corrections, source: corrections.sourceArchiveFile, sourceSha256: corrections.sourceSha256, sourceBlobSha1: corrections.sourceBlobSha1,
    bank: [{ content: "홀함수 조건", solution: "대칭구간 적분" }], items: [{ sourceOrdinal: 1, questionUid: "uid", evidenceRefs: [ref] }],
    rawAudit: { records: [audited, { questionId: 2, crossConceptKeys: ["CC_OTHER_AUDITED"] }] },
    classificationPackage: { records: [audited] }, manifest: { recordsToBind: [audited] }, ref, existingConceptKeys: new Set() };
  assert.deepEqual(validateTargetedAuditCorrections(args)[0].correctedCrossConceptKeys, ["CC_OTHER_AUDITED"]);
  assert.throws(() => validateTargetedAuditCorrections({ ...args, existingConceptKeys: new Set(["CC_OLD"]) }), /cannot merge existing meanings/);
  assert.throws(() => validateTargetedAuditCorrections({ ...args, existingConceptKeys: new Set(["CC_OTHER_AUDITED"]) }), /cannot merge existing meanings/);
  assert.throws(() => validateTargetedAuditCorrections({ ...args, bank: [{ content: "다른 조건", solution: "대칭구간 적분" }] }), /item\/evidence mismatch/);
  assert.throws(() => validateTargetedAuditCorrections({ ...args, items: [{ ...args.items[0], evidenceRefs: [] }] }), /item\/evidence mismatch/);
});

test("source CrossConcept supplement preserves distinct source and audited keys", () => {
  const ref = { path: "docs/source-cross.json", sha256: "a".repeat(64) };
  const row = { questionUid: "uid", sourceOrdinal: 1, sourceCrossConceptKeys: ["CC_SOURCE"],
    auditedCrossConceptKeys: ["CC_AUDIT"], sourceTextExcerpt: "역함수가 존재", reason: "일대일 조건이 쓰인다" };
  const corrections = { schemaVersion: "meta-pipeline-source-crossconcept-corrections-v1", sourceArchiveFile: "original/exam.js",
    sourceSha256: "b".repeat(64), sourceBlobSha1: "c".repeat(40), reviewer: { role: "CODEX_META_PIPELINE_COURIER", id: "root" }, records: [row] };
  const args = { corrections, source: corrections.sourceArchiveFile, sourceSha256: corrections.sourceSha256,
    sourceBlobSha1: corrections.sourceBlobSha1, bank: [{ content: "역함수가 존재하도록", crossConceptKeys: ["CC_SOURCE"] }],
    items: [{ questionUid: "uid", sourceOrdinal: 1, before: { crossConceptKeys: ["CC_SOURCE"] },
      after: { crossConceptKeys: ["CC_AUDIT", "CC_SOURCE"] }, evidenceRefs: [ref] }],
    rawAudit: { records: [{ questionId: 1, crossConceptKeys: ["CC_AUDIT"] }] },
    manifest: { recordsToBind: [{ questionId: 1, crossConceptKeys: ["CC_AUDIT"] }] }, ref };
  assert.deepEqual(validateSourceCrossConceptCorrections(args)[0].crossConceptKeys, ["CC_AUDIT", "CC_SOURCE"]);
  assert.throws(() => validateSourceCrossConceptCorrections({ ...args, sourceSha256: "d".repeat(64) }), /identity\/reviewer mismatch/);
  assert.throws(() => validateSourceCrossConceptCorrections({ ...args, bank: [{ content: "조건 없음", crossConceptKeys: ["CC_SOURCE"] }] }), /item\/evidence mismatch/);
  assert.throws(() => validateSourceCrossConceptCorrections({ ...args, items: [{ ...args.items[0], after: { crossConceptKeys: ["CC_AUDIT"] } }] }), /item\/evidence mismatch/);
  assert.throws(() => validateSourceCrossConceptCorrections({ ...args, items: [{ ...args.items[0], evidenceRefs: [] }] }), /item\/evidence mismatch/);
});

test("source Condition correction preserves only exact source-bound reviewed keys", () => {
  const ref = { path: "docs/source-condition.json", sha256: "a".repeat(64) };
  const row = { questionUid: "uid", sourceOrdinal: 1, sourceConditionKeys: ["COND_POSITIVE"],
    auditedConditionKeys: [], sourceTextExcerpt: "각 항이 양수", reason: "양수 조건은 해 선택에 사용된다" };
  const corrections = { schemaVersion: "meta-pipeline-source-condition-corrections-v1", sourceArchiveFile: "original/exam.js",
    sourceSha256: "b".repeat(64), sourceBlobSha1: "c".repeat(40), reviewer: { role: "CODEX_META_PIPELINE_COURIER", id: "root" }, records: [row] };
  const args = { corrections, source: corrections.sourceArchiveFile, sourceSha256: corrections.sourceSha256,
    sourceBlobSha1: corrections.sourceBlobSha1, bank: [{ content: "각 항이 양수인 수열", conditionKeys: ["COND_POSITIVE"] }],
    items: [{ questionUid: "uid", sourceOrdinal: 1, before: { conditionKeys: ["COND_POSITIVE"] },
      after: { conditionKeys: ["COND_POSITIVE"] }, evidenceRefs: [ref] }],
    rawAudit: { records: [{ questionId: 1, conditionKeys: [] }] }, manifest: { recordsToBind: [{ questionId: 1, conditionKeys: [] }] }, ref };
  assert.deepEqual(validateSourceConditionCorrections(args)[0].conditionKeys, ["COND_POSITIVE"]);
  assert.throws(() => validateSourceConditionCorrections({ ...args, sourceSha256: "d".repeat(64) }), /identity\/reviewer mismatch/);
  assert.throws(() => validateSourceConditionCorrections({ ...args, bank: [{ content: "조건 없음", conditionKeys: ["COND_POSITIVE"] }] }), /item\/evidence mismatch/);
  assert.throws(() => validateSourceConditionCorrections({ ...args, items: [{ ...args.items[0], after: { conditionKeys: [] } }] }), /item\/evidence mismatch/);
  assert.throws(() => validateSourceConditionCorrections({ ...args, items: [{ ...args.items[0], evidenceRefs: [] }] }), /item\/evidence mismatch/);
  const both = ["COND_POSITIVE", "COND_RANGE"];
  const multiRow = { ...row, sourceConditionKeys: both, sourceTextExcerpts: [
    { location: "content", text: "각 항이 양수", supports: ["COND_POSITIVE"] },
    { location: "solution", text: "t>0", supports: ["COND_RANGE"] },
  ] };
  const multi = { ...args, corrections: { ...corrections, records: [multiRow] },
    bank: [{ content: "각 항이 양수인 수열", solution: "t>0이다", conditionKeys: both }],
    items: [{ ...args.items[0], before: { conditionKeys: both }, after: { conditionKeys: both } }] };
  assert.equal(validateSourceConditionCorrections(multi).length, 1);
  assert.throws(() => validateSourceConditionCorrections({ ...multi, corrections: { ...corrections,
    records: [{ ...multiRow, sourceTextExcerpts: multiRow.sourceTextExcerpts.slice(0, 1) }] } }), /item\/evidence mismatch/);
});

test("audited integration replaces only an exactly bound pending placeholder", () => {
  const args = { current: { metadataStatus: "registration_pending_semantic_review", integrationPattern: "NONE" },
    question: { integrationPattern: "NONE" }, patch: { before: { integrationPattern: "NONE" }, sourceMetadataBefore: { integrationPattern: "NONE" } },
    final: { integrationPattern: "SEQUENTIAL" }, auditedPattern: "SEQUENTIAL" };
  assert.equal(isAuditedPendingIntegrationRebindAllowed(args), true);
  assert.equal(isAuditedPendingIntegrationRebindAllowed({ ...args, current: { ...args.current, metadataStatus: "approved_semantic_review" } }), false);
  assert.equal(isAuditedPendingIntegrationRebindAllowed({ ...args, question: { integrationPattern: "MULTI_STEP_COUPLING" } }), false);
  assert.equal(isAuditedPendingIntegrationRebindAllowed({ ...args, final: { integrationPattern: "NONE" } }), false);
  assert.equal(isAuditedPendingIntegrationRebindAllowed({ ...args, auditedPattern: "" }), false);
});

test("missing sourceDrive Condition evidence remains debt instead of an approved empty set", () => {
  const args = { debt: { reason: "Audit and source omit Condition evidence" }, flatV3: true,
    rawRow: {}, candidateRow: {}, question: {}, patch: { before: { conditionKeys: null }, after: { conditionKeys: null } } };
  assert.equal(isSourceConditionEvidenceDebtAllowed(args), true);
  assert.equal(isSourceConditionEvidenceDebtAllowed({ ...args, patch: { ...args.patch, after: { conditionKeys: [] } } }), false);
  assert.equal(isSourceConditionEvidenceDebtAllowed({ ...args, patch: { ...args.patch, before: { conditionKeys: ["COND_INTEGER"] } } }), false);
  assert.equal(isSourceConditionEvidenceDebtAllowed({ ...args, question: { conditionKeys: [] } }), false);
  assert.equal(isSourceConditionEvidenceDebtAllowed({ ...args, candidateRow: { conditionKeys: [] } }), false);
  assert.equal(isSourceConditionEvidenceDebtAllowed({ ...args, flatV3: false }), false);
});

test("targeted replacement supplement binds exact source, review, UID and separately reviewed condition", () => {
  const ref = { path: "archive/data/r2e-intake/item.json", sha256: "a".repeat(64) };
  const question = { content: "정수 a", choices: ["1", "2"], answer: "1", solution: "정수 조건을 쓴다" };
  const row = { sourceOrdinal: 1, questionUid: "qid", metadataReviewStatus: "TARGETED_RECOVERY_PASS",
    difficultyAudit: "FRESH_INDEPENDENT_TARGETED_PASS", replacementType: "QUESTION_REPLACEMENT",
    conditionKeys: ["COND_INTEGER"], integrationPattern: "SEQUENTIAL" };
  const recovery = { schemaVersion: "JS_ARCHIVE_M3_ITEM_RECOVERY_META_V2_PAYLOAD_v1", examFile: "exam.js",
    finalArtifactSha: "b".repeat(40), sourceReview2Audit: "FRESH_INDEPENDENT_REVIEW2",
    itemRecoveryQuestionCount: 1, itemRecoveryQuestionIds: [1], freshMetadataRows: [row],
    itemHoldResolution: [{ qid: 1, recoveryType: "QUESTION_REPLACEMENT", replacedQid: 1, replacementQuestion: question }] };
  const args = { recovery, source: "original/exam.js", sourceBlobSha1: "b".repeat(40), bank: [question],
    items: [{ sourceOrdinal: 1, questionUid: "qid", after: { conditionKeys: ["COND_INTEGER"], integrationPattern: "SEQUENTIAL" }, evidenceRefs: [ref] }],
    rawAudit: { records: [{ questionId: 1 }] }, classificationPackage: { records: [{ questionId: 1 }] },
    manifest: { recordsToBind: [{ questionId: 1, conditionKeys: [] }] }, ref };
  assert.deepEqual(validateTargetedRecoverySupplement(args).conditionKeys, ["COND_INTEGER"]);
  assert.throws(() => validateTargetedRecoverySupplement({ ...args, sourceBlobSha1: "c".repeat(40) }), /identity\/source\/review mismatch/);
  assert.throws(() => validateTargetedRecoverySupplement({ ...args, bank: [{ ...question, answer: "2" }] }), /item\/evidence mismatch/);
  assert.throws(() => validateTargetedRecoverySupplement({ ...args, items: [{ ...args.items[0], after: { ...args.items[0].after, conditionKeys: [] } }] }), /item\/evidence mismatch/);
  assert.throws(() => validateTargetedRecoverySupplement({ ...args, items: [{ ...args.items[0], evidenceRefs: [] }] }), /item\/evidence mismatch/);
  assert.throws(() => validateTargetedRecoverySupplement({ ...args, rawAudit: { records: [{ questionId: 1, conditionKeys: [] }] } }), /item\/evidence mismatch/);
});

test("SOP mixed packs accept only exact named owner packs", () => {
  assert.equal(sopV12PackIncludes("MIDDLE2_AND_MIDDLE_GEOMETRY", "MIDDLE2"), true);
  assert.equal(sopV12PackIncludes("MIDDLE2_AND_MIDDLE_GEOMETRY", "MIDDLE_GEOMETRY"), true);
  assert.equal(sopV12PackIncludes("MIDDLE2_AND_MIDDLE_GEOMETRY", "MIDDLE3"), false);
  assert.equal(sopV12PackIncludes("MIDDLE2", "MIDDLE"), false);
});

test("SOP namespace correction requires pending state, exact source and canonical labels", () => {
  const question = { standardCourse: "중2-1", standardUnitKey: "OLD", standardUnit: "old", subUnitKey: "OLD-SUB", subUnit: "old sub" };
  const final = { standardCourse: "중2 수학", standardUnitKey: "M2-03", standardUnit: "연립일차방정식", subUnitKey: "M2-03-EQ", subUnit: "연립일차방정식" };
  const args = { field: "standardUnitKey", current: { ...question, metadataStatus: "registration_pending_semantic_review" }, question,
    patch: { sourceMetadataBefore: { ...question } }, final,
    audited: { correctedStandardUnitKey: final.standardUnitKey, correctedSubUnitKey: final.subUnitKey, assignmentCorrectionReason: "canonical namespace correction" },
    resolved: { pack: { meta: { standardCourses: ["중2-1", "중2 수학"] } }, unit: { labelKo: final.standardUnit }, sub: { labelKo: final.subUnit } } };
  assert.equal(isSopPendingSourceNamespaceCorrectionAllowed(args), true);
  assert.equal(isSopPendingSourceNamespaceCorrectionAllowed({ ...args, current: { ...args.current, metadataStatus: "approved_semantic_review" } }), false);
  assert.equal(isSopPendingSourceNamespaceCorrectionAllowed({ ...args, patch: { sourceMetadataBefore: { ...question, standardUnitKey: "OTHER" } } }), false);
  assert.equal(isSopPendingSourceNamespaceCorrectionAllowed({ ...args, audited: { ...args.audited, assignmentCorrectionReason: "" } }), false);
  assert.equal(isSopPendingSourceNamespaceCorrectionAllowed({ ...args, final: { ...final, subUnit: "invented" } }), false);
  assert.equal(isSopPendingSourceNamespaceCorrectionAllowed({ ...args, field: "answer" }), false);
});

test("source visual detection includes images embedded in question HTML", () => {
  assert.equal(sourceVisualType({ content: '<p><img src="assets/images/q15.png" /></p>' }), "IMAGE");
  assert.equal(sourceVisualType({ choices: ['<img src="assets/images/q.svg" />'] }), "SVG");
  assert.equal(sourceVisualType({ content: '<svg></svg><img src="q.png">' }), "SVG_IMAGE");
  assert.equal(sourceVisualType({ content: '<p>only text</p>' }), "NONE");
});

test("SOP v1.2 source field correction requires identical review and request entries", () => {
  const entry = { field: "answer", questionUid: "uid1", auditQuestionNumber: 1, originalManifestValue: "2",
    currentSourceValue: "1", reason: "Human reviewer confirmed the original manifest answer was stale.", appliedToManifest: false };
  const base = { field: "answer", ordinal: 1, questionUid: "uid1", originalValue: "2", currentValue: "1",
    reviewEntry: entry, itemEntry: { ...entry } };
  assert.equal(isSopV12SourceFieldCorrectionAllowed(base), true);
  for (const field of ["content", "choices", "questionUid", "id", "sourceOrdinal", "standardUnitKey"]) {
    assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, field }), false);
  }
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, itemEntry: { ...entry, reason: "different" } }), false);
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, reviewEntry: { ...entry, appliedToManifest: true }, itemEntry: { ...entry, appliedToManifest: true } }), false);
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, reviewEntry: { ...entry, reason: "   " }, itemEntry: { ...entry, reason: "   " } }), false);
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, originalValue: "1" }), false);
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, currentValue: "2" }), false);
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, ordinal: 2 }), false);
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, questionUid: "uid2" }), false);
  const equal = { ...entry, originalManifestValue: "1", currentSourceValue: "1" };
  assert.equal(isSopV12SourceFieldCorrectionAllowed({ ...base, originalValue: "1", currentValue: "1",
    reviewEntry: equal, itemEntry: { ...equal } }), false);
});

test("template reuse statistics accept exact distinct-key or item-binding counts", () => {
  const audit = {records:[{classification:{templateKey:"TPL_A"}},{classification:{templateKey:"TPL_A"}},{classification:{templateKey:"TPL_B"}}]};
  assert.equal(metaPipelineTemplateReuseCountMatches({canonicalTemplatesReused:2},audit),true);
  assert.equal(metaPipelineTemplateReuseCountMatches({canonicalTemplatesReused:3},audit),true);
  for(const count of [0,1,4,2.5,"2",null]) assert.equal(metaPipelineTemplateReuseCountMatches({canonicalTemplatesReused:count},audit),false);
  assert.equal(metaPipelineTemplateReuseCountMatches({canonicalTemplatesReused:0},{records:[]}),false);
  assert.equal(metaPipelineTemplateReuseCountMatches({canonicalTemplatesReused:1},{records:[{classification:{templateKey:"TPL_A"}},{}]}),false);
});

const CANON = "archive/data/meta-foundation/canonical";
const META = "archive/data/question_metadata.json";
const script = fileURLToPath(new URL("../archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs", import.meta.url));
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest("hex");
const j = v => JSON.stringify(v, null, 2) + "\n";
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);

test("META_PIPELINE_AUDIT accepts either unique CC definitions or total per-question bindings", () => {
  const audit = { records: [
    { classification: { crossConceptKeys: ["CC_SHARED", "CC_A"] } },
    { classification: { crossConceptKeys: ["CC_SHARED"] } },
  ] };
  assert.equal(metaPipelineCrossConceptCountMatches({ atomicCrossConceptsBound: 3 }, audit), true);
  assert.equal(metaPipelineCrossConceptCountMatches({ atomicCrossConceptsBound: 2 }, audit), true);
  assert.equal(metaPipelineCrossConceptCountMatches({ atomicCrossConceptsBound: 4 }, audit), false);
});

test("approved PT/TPL rebinding is limited to active prior keys and META_PIPELINE_AUDIT", () => {
  const current = { metadataStatus: "approved_full", metadataApprovalType: "META_PIPELINE_AUDIT" };
  assert.equal(isMetaPipelineApprovedTypeRebindAllowed({ field: "problemTypeKey", current, priorTypeStatus: "ACTIVE" }), true);
  assert.equal(isMetaPipelineApprovedTypeRebindAllowed({ field: "templateKey", current, priorTypeStatus: "RETIRED" }), false);
  assert.equal(isMetaPipelineApprovedTypeRebindAllowed({
    field: "problemTypeKey", current: { ...current, metadataApprovalType: "FINAL_QA" }, priorTypeStatus: "ACTIVE",
  }), false);
  assert.equal(isMetaPipelineApprovedTypeRebindAllowed({ field: "crossConceptKeys", current, priorTypeStatus: "ACTIVE" }), false);
});

function missingLegacyConceptFixture(t, status, sourceTags = [], reverseAfter = false) {
  const f = fixture(t, "기하");
  f.q.crossConceptKeys = sourceTags;
  if (sourceTags.length) {
    f.request.items[0].after.crossConceptKeys = ["CC_NEW", "CC_EXTRA"];
    if (reverseAfter) f.request.items[0].after.crossConceptKeys.reverse();
    const concepts = f.request.registryChanges.find(change => change.path.includes("/concepts/")).after.concepts;
    concepts.push({ ...concepts[0], conceptKey: "CC_EXTRA", canonicalLabelKo: "추가 보조 개념", definition: "별도 검수된 보조 개념" });
  }
  const sourceText = `window.questions = ${JSON.stringify([f.q])};`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, sourceText);
  f.request.expectedSourceBlobSha1 = blob(sourceText);
  const doc = f.read(META);
  doc.records[0].reviewStatus = "reviewed_pass";
  doc.records[0].metadataStatus = status;
  doc.records[0].fieldStatus = { concept: "approved_classification" };
  delete doc.records[0].crossConceptKeys;
  f.put(META, doc);
  f.request.items[0].before.crossConceptKeys = null;
  for (const key of ["L1", "L2", "L3", "L4"]) f.request.items[0].before[key] = doc.records[0][key] ?? null;
  f.request.items[0].sourceMetadataBefore = { crossConceptKeys: sourceTags };
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true, exactSourceHashBasis: true });
  return f;
}

test("partial legacy rows may materialize audited concepts when source explicitly has an empty list", t => {
  const f = missingLegacyConceptFixture(t, "approved_partial_with_explicit_holds");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

test("missing concepts on a fully approved legacy row do not authorize rebinding", t => {
  const f = missingLegacyConceptFixture(t, "approved_full");
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source\/approved metadata parity/);
});

test("partial missing-array projection preserves explicit source tags as an ordered prefix", t => {
  const f = missingLegacyConceptFixture(t, "approved_partial_with_explicit_holds", ["CC_NEW"]);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

test("partial missing-array projection rejects reordering an explicit source tag", t => {
  const f = missingLegacyConceptFixture(t, "approved_partial_with_explicit_holds", ["CC_NEW"], true);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source\/approved metadata parity/);
});

function fixture(t, course = "중1 수학", curriculum = "2022") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-meta-v2-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, value) => { const full = path.join(root, p); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, typeof value === "string" ? value : j(value)); };
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  put("docs/approval.json", { approved: true, meaning: "fixture reviewed definitions" });
  const evidenceRefs = [{ path: "docs/approval.json", sha256: hash(fs.readFileSync(path.join(root, "docs/approval.json"))) }];
  const q = { id: 1, content: "학생용 지문", choices: ["1", "2"], answer: "1", solution: "학생용 해설", image: "",
    standardCourse: course, standardUnitKey: "UNIT_NEW", standardUnit: "새 단원", subUnitKey: "SUB_NEW", subUnit: "새 세부단원",
    level: "중", problemTypeKey: "PT_NEW", templateKey: "TPL_NEW", crossConceptKeys: ["CC_NEW"], conditionKeys: ["COND_NEW"], integrationPattern: "NONE", difficultyBucket: 3 };
  const source = "fixture/exam.js";
  const text = `window.questions = ${JSON.stringify([q])};\n`;
  put(`archive/exams/${source}`, text);
  const fingerprint = hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const current = { questionUid: "uid1", sourceArchiveFile: source, sourceOrdinal: 1, sourceFingerprint: fingerprint,
    standardCourse: course, standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", reviewStatus: "review_required" };
  put(META, { records: [current], counts: {} });
  put("archive/data/question_identity_map.json", { records: [{ ...current }] });
  put(`${CANON}/registry_index.json`, { activePacks: [], activeConceptShards: [], conditionRegistry: { id: "CONDITION_CORE", version: "1", status: "ACTIVE" }, canonicalSources: [{ path: `${CANON}/condition_registry.json` }],
    compiledArtifacts: ["aliases", "concept_registry", "condition_registry", "curriculum_bindings", "taxonomy_registry", "meta_foundation_compiled"].map(n => ({ path: `archive/data/meta-foundation/compiled/${n}.json` })) });
  put(`${CANON}/condition_registry.json`, { schemaVersion: "meta-foundation-condition-registry-v1", owner: "CONDITION_CORE", conditions: [], conditionCount: 0 });
  put("archive/data/master_tables/js_archive_tag_master.json", []);
  fs.mkdirSync(path.join(root, "archive/data/meta-foundation/runtime"), { recursive: true });
  const changes = [];
  const change = (p, collection, match, before, after) => changes.push({ path: p, ...(collection ? { collection, match } : {}), before, after, evidenceRefs });
  const base = `${CANON}/packs/new-course`;
  change(`${CANON}/registry_index.json`, "activePacks", { id: "NEW_COURSE" }, null, { id: "NEW_COURSE", version: "1.0.0", status: "ACTIVE" });
  change(`${base}/pack.json`, null, null, null, { schemaVersion: "meta-foundation-pack-v1", packId: "NEW_COURSE", packVersion: "1.0.0", canonicalStatus: "ACTIVE", curricula: [curriculum], standardCourses: [course] });
  change(`${base}/taxonomy.json`, null, null, null, { status: "ACTIVE", problemTypes: [{ problemTypeKey: "PT_NEW", canonicalLabelKo: "새 유형", definition: "검수된 유형 의미", ownerPack: "NEW_COURSE", status: "ACTIVE", sourceUnit: "UNIT_NEW", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }], templates: [{ templateKey: "TPL_NEW", canonicalLabelKo: "새 풀이 구조", definition: "검수된 풀이 구조", parentProblemTypeKey: "PT_NEW", status: "ACTIVE", sourceUnit: "UNIT_NEW", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }] });
  change(`${base}/bindings.json`, null, null, null, { status: "ACTIVE", bindings: [{ curriculum, standardCourse: course, standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW", status: "ACTIVE" }] });
  change(`${base}/aliases.json`, null, null, null, { aliases: [] });
  change(`${CANON}/registry_index.json`, "activeConceptShards", { id: "NEW_CONCEPTS" }, null, { id: "NEW_CONCEPTS", version: "1.0.0", status: "ACTIVE" });
  change(`${CANON}/concepts/new-concepts.json`, null, null, null, { shardId: "NEW_CONCEPTS", shardVersion: "1.0.0", concepts: [{ conceptKey: "CC_NEW", canonicalLabelKo: "새 추가 개념", definition: "추가 개념 근거", supportingQuestionUids: ["uid1"], supportingItemCount: 1, status: "ACTIVE" }] });
  change(`${CANON}/condition_registry.json`, "conditions", { conditionKey: "COND_NEW" }, null, { conditionKey: "COND_NEW", canonicalLabelKo: "새 조건", definition: "조건 근거", status: "ACTIVE" });
  for (const row of [{ key: "UNIT_NEW", keyType: "standardUnitKey", labelKo: "새 단원", status: "active" }, { key: "SUB_NEW", keyType: "subUnitKey", parentKey: "UNIT_NEW", standardUnitKey: "UNIT_NEW", labelKo: "새 세부단원", status: "active" }]) change("archive/data/master_tables/js_archive_tag_master.json", "$", { key: row.key }, null, row);
  const after = { ...Object.fromEntries(Object.entries(q).filter(([k]) => !["id", "content", "choices", "answer", "solution", "image"].includes(k))), curriculum, curriculumKey: curriculum, courseKey: course, rpmSemanticStatus: "FINAL", rpmL3: "reviewed-rpm-l3", rpmL4: "reviewed-rpm-l4" };
  const request = { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", requestId: "test-new-course", examUid: "exam1", sourceArchiveFile: source, expectedSourceBlobSha1: blob(text), expectedQuestionCount: 1,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "fixture-reviewer", evidenceRefs }, registryChanges: changes,
    items: [{ questionUid: "uid1", sourceOrdinal: 1, before: Object.fromEntries(Object.keys(after).map(k => [k, current[k] ?? null])), after, reason: "문항 사고와 승인 분류 일치", evidenceRefs }] };
  return { root, put, read, request, q, evidenceRefs, change };
}

function attachMetaPipelineAudit(f, { existingConcept = false, existingConceptLabelDrift = false, siblingParent = false, promoteCanonicalTypes = false, driveSourceHashDrift = false, targetCanonicalParent = false, targetParentUsesSubUnit = false, targetCanonicalScope, exactSourceHashBasis = false, dualVisual = false } = {}) {
  const conceptChange = f.request.registryChanges.find(change => change.path.startsWith(`${CANON}/concepts/`));
  const pendingRegistryChanges = [];
  for (const change of f.request.registryChanges) {
    if (!existingConcept && (change === conceptChange || change.collection === "activeConceptShards")) { pendingRegistryChanges.push(change); continue; }
    if (promoteCanonicalTypes) { pendingRegistryChanges.push(change); continue; }
    const full = path.join(f.root, change.path);
    if (!change.collection) { fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, j(change.after)); continue; }
    const doc = JSON.parse(fs.readFileSync(full, "utf8"));
    const rows = change.collection === "$" ? doc : doc[change.collection];
    rows.push(change.after);
    fs.writeFileSync(full, j(doc));
  }
  f.request.registryChanges = pendingRegistryChanges;
  const nativeConceptPath = conceptChange.path;
  const nativeConcept = conceptChange.after.concepts[0];
  let auditConcept = { ...nativeConcept };
  let existingConceptReviews = [];
  if (existingConcept) {
    const native = f.read(nativeConceptPath);
    native.concepts[0].definition = "정본에서 이미 등록된 미분계수 의미";
    if (existingConceptLabelDrift) native.concepts[0].canonicalLabelKo = "기존 정본 표시명";
    f.put(nativeConceptPath, native);
    auditConcept = { ...nativeConcept,
      ...(existingConceptLabelDrift ? { canonicalLabelKo: "감사에서 사용한 표시명" } : {}),
      definition: "감사에서 설명한 같은 미분계수의 접선 기울기 관점" };
    existingConceptReviews = [{ conceptKey: nativeConcept.conceptKey, disposition: "REUSE_CANONICAL",
      canonicalLabelKo: native.concepts[0].canonicalLabelKo, canonicalDefinition: native.concepts[0].definition,
      auditLabelKo: auditConcept.canonicalLabelKo, auditDefinition: auditConcept.definition,
      rationale: "같은 수학 개념의 동치인 적용 관점이며 기존 정본 정의를 수정하거나 병합하지 않는다." }];
  }
  const sourceBytes = fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`));
  const examTitle = path.basename(f.request.sourceArchiveFile, ".js");
  const sourceFileDriveId = "fixture-drive-source-id";
  const target = f.request.items[0].after;
  const record = { questionId: 1, standardUnitKey: f.q.standardUnitKey, subUnitKey: f.q.subUnitKey, auditVerdict: "APPROVED",
    classification: { problemTypeKey: target.problemTypeKey, templateKey: target.templateKey, crossConceptKeys: target.crossConceptKeys,
      conditionKeys: target.conditionKeys, status: "APPROVED_CANONICAL" },
    readingEvidence: { sourceTextExcerpt: "학생용 발문 발췌", solutionDecisiveExcerpt: "핵심 풀이 발췌", visualAssetChecked: dualVisual, visualType: dualVisual ? "SVG_IMAGE" : "NONE" } };
  const audit = { schemaVersion: "ALIVE_META_AUDIT_ATOMIC_v3", examTitle, sourceFileDriveId, sourceSha256: hash(sourceBytes),
    auditedTimestamp: "2026-10-23T00:00:00Z", auditVerdict: "ALL_APPROVED_CANONICAL_STANDARDIZED",
    statistics: { totalQuestions: 1, approved: 1, holdRemaining: 0, canonicalTemplatesReused: 1, newTemplatesCreated: 0, atomicCrossConceptsBound: target.crossConceptKeys.length },
    boundAtomicCrossConcepts: [auditConcept, ...conceptChange.after.concepts.slice(1)].map(concept => ({ conceptKey: concept.conceptKey, labelKo: concept.canonicalLabelKo, definition: concept.definition })),
    handOffToCourier: { status: "READY_FOR_COURIER_REGISTRATION", author: "META_PIPELINE_UNIFIED_AUTHOR", registrationProtocol: "DIRECT_ATOMIC_METADATA_BINDING" },
    records: [record] };
  const manifest = { schemaVersion: "COURIER_INTAKE_MANIFEST_v2", examTitle, sourceFileDriveId, sourceSha256: hash(sourceBytes),
    status: "READY_FOR_COURIER_REGISTRATION", courierAction: "COMMIT_CANONICAL_BINDING", bindingTarget: `archive/exams/${f.request.sourceArchiveFile}`,
    payloadSummary: { totalQuestions: 1, approved: 1, templateInflationCount: 0, atomicCrossConceptsCount: 1, holdCount: 0 },
    recordsToBind: [{ questionId: 1, problemTypeKey: target.problemTypeKey, templateKey: target.templateKey, crossConceptKeys: target.crossConceptKeys }] };
  const evidenceRoot = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
  const auditPath = `${evidenceRoot}/${f.request.requestId}.audit.json`;
  const manifestPath = `${evidenceRoot}/${f.request.requestId}.manifest.json`;
  const sourceParityPath = `${evidenceRoot}/${f.request.requestId}.source-parity.json`;
  const parentLabelsPath = `${evidenceRoot}/${f.request.requestId}.parent-labels.json`;
  const canonicalMasterPath = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
  f.put(auditPath, audit);
  f.put(manifestPath, manifest);
  const studentFields = ["id", "questionType", "content", "choices", "answer", "solution", "image", "images", "figureSvg", "solutionImage", "solutionFigureSvg", "layoutTag", "wide"];
  const studentPayloadHash = hash(stable(Object.fromEntries(studentFields.map(field => [field, Object.hasOwn(f.q, field) ? f.q[field] : null]))));
  const sourceParity = { schemaVersion: "archive-meta-pipeline-source-parity-v1",
    status: driveSourceHashDrift ? "EXACT_STUDENT_VISIBLE_PARITY_WITH_AUDIT_HASH_DRIFT" : "EXACT_STUDENT_VISIBLE_PARITY", sourceFileDriveId,
    ...(exactSourceHashBasis ? { parityBasis: "EXACT_SOURCE_SHA256" } : {}),
    ...(driveSourceHashDrift ? { auditSourceSha256: hash(sourceBytes), sourceHashDriftReason: "AUDIT_SOURCE_HASH_DIFFERS_FROM_CURRENT_DRIVE_FILE" } : {}),
    driveSourceSha256: driveSourceHashDrift ? "f".repeat(64) : hash(sourceBytes), productionSourceSha256: hash(sourceBytes), productionSourceBlobSha1: f.request.expectedSourceBlobSha1,
    sourceArchiveFile: f.request.sourceArchiveFile, studentFields, questionCount: 1,
    records: [{ sourceOrdinal: 1, questionId: 1, questionUid: f.request.items[0].questionUid,
      driveSourceTextExcerptMatched: !exactSourceHashBasis, driveSolutionExcerptMatched: !exactSourceHashBasis,
      driveStudentPayloadSha256: studentPayloadHash, productionStudentPayloadSha256: studentPayloadHash, studentPayloadEqual: true }] };
  f.put(sourceParityPath, sourceParity);
  const parentContext = { curriculumKey: f.request.items[0].after.curriculum,
    courseKey: String(f.request.items[0].after.courseKey).replace(/\s/g, ""), standardUnitKey: f.q.standardUnitKey };
  const parentLabels = { schemaVersion: "archive-meta-pipeline-parent-label-evidence-v1", sourcePath: "archive/data/basic-scope-parent-links.json",
    sourceSha256: hash("fixture basic scope parent links"),
    records: siblingParent
      ? [{ ...parentContext, subUnitKey: "SUB_SIBLING_A", L1: f.q.standardUnit, L2: f.q.subUnit },
        { ...parentContext, subUnitKey: "SUB_SIBLING_B", L1: f.q.standardUnit, L2: f.q.subUnit }]
      : [{ ...parentContext, subUnitKey: f.q.subUnitKey, L1: f.q.standardUnit, L2: f.q.subUnit }],
    derivedRecords: siblingParent ? [{ ...parentContext, subUnitKey: f.q.subUnitKey, L1: f.q.standardUnit, L2: f.q.subUnit,
      method: "SAME_STANDARD_UNIT_SIBLING_PARENT_CONSENSUS", supportingSubUnitKeys: ["SUB_SIBLING_A", "SUB_SIBLING_B"] }] : [] };
  f.put(parentLabelsPath, parentLabels);
  const auditPackageRef = { path: auditPath, sha256: hash(fs.readFileSync(path.join(f.root, auditPath))) };
  const manifestRef = { path: manifestPath, sha256: hash(fs.readFileSync(path.join(f.root, manifestPath))) };
  const sourceParityRef = { path: sourceParityPath, sha256: hash(fs.readFileSync(path.join(f.root, sourceParityPath))) };
  const parentLabelsRef = { path: parentLabelsPath, sha256: hash(fs.readFileSync(path.join(f.root, parentLabelsPath))) };
  let targetParentRef = null;
  let targetParentEvidenceRef = null;
  if (targetCanonicalParent) {
    const midUnit = targetParentUsesSubUnit ? f.q.subUnit : f.q.standardUnit;
    f.put(canonicalMasterPath, { records: [{ curriculum: f.request.items[0].after.curriculum, scope: targetCanonicalScope || f.request.items[0].after.courseKey,
      majorUnit: f.q.standardUnit, midUnit }] });
    targetParentRef = { path: canonicalMasterPath, curriculum: f.request.items[0].after.curriculum,
      scope: targetCanonicalScope || f.request.items[0].after.courseKey, majorUnit: f.q.standardUnit, midUnit };
    targetParentEvidenceRef = { path: canonicalMasterPath, sha256: hash(fs.readFileSync(path.join(f.root, canonicalMasterPath))) };
  }
  const evidenceRefs = [...f.evidenceRefs, auditPackageRef, manifestRef, sourceParityRef, parentLabelsRef,
    ...(targetParentEvidenceRef ? [targetParentEvidenceRef] : [])];
  f.request.approval = { type: "META_PIPELINE_AUDIT", metadataReviewed: true, approvedBy: "META_PIPELINE_UNIFIED_AUTHOR", evidenceRefs,
    metaPipelineAudit: { schemaVersion: "meta-pipeline-audit-approval-v1", sourceFileDriveId, auditPackageRef, manifestRef, sourceParityRef, existingConceptReviews } };
  f.request.items = f.request.items.map(item => ({ ...item, before: { ...item.before, L1: null, L2: null },
    after: { ...item.after, L1: targetParentRef?.majorUnit || f.q.standardUnit, L2: targetParentRef?.midUnit || f.q.subUnit },
    ...(targetParentRef ? { targetParentRef } : { basicScopeParentRef: parentLabelsRef }), evidenceRefs }));
  return { audit, manifest, auditPackageRef, manifestRef };
}

function attachMetaPipelineAuditV2(f) {
  const attached = attachMetaPipelineAudit(f);
  const proof = f.request.approval.metaPipelineAudit;
  const sourceBytes = fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`));
  const target = f.request.items[0].after;
  const audit = { ...attached.audit, schemaVersion: "META_AUDIT_ATOMIC_PACKAGE_v2",
    boundAtomicCrossConcepts: attached.audit.boundAtomicCrossConcepts.map(row => row.conceptKey),
    records: [{ questionId: 1, standardCourse: f.q.standardCourse, standardUnitKey: f.q.standardUnitKey,
      standardUnit: f.q.standardUnit, subUnitKey: f.q.subUnitKey, subUnit: f.q.subUnit,
      problemTypeKey: target.problemTypeKey, templateKey: target.templateKey, targetPack: "new-course", assignedPack: "new-course",
      difficultyBucket: f.q.difficultyBucket, level: f.q.level, difficultyConfidence: "source_preserved",
      difficultyReason: "fixture source-supported classification reason", crossConceptKeys: target.crossConceptKeys,
      conditionKeys: target.conditionKeys, integrationPattern: target.integrationPattern,
      auditStatus: "APPROVED", auditRemarks: "Exact audited binding approved." }] };
  delete audit.handOffToCourier;
  const manifest = { ...attached.manifest, schemaVersion: "ALIVE_COURIER_INTAKE_MANIFEST_v3", totalQuestions: 1, totalHoldCount: 0,
    recordsToBind: [{ questionId: 1, standardCourse: f.q.standardCourse, standardUnitKey: f.q.standardUnitKey,
      standardUnit: f.q.standardUnit, subUnitKey: f.q.subUnitKey, subUnit: f.q.subUnit,
      problemTypeKey: target.problemTypeKey, templateKey: target.templateKey, targetPack: "new-course",
      crossConcepts: target.crossConceptKeys.join(" "), conditionKeys: target.conditionKeys,
      integrationPattern: target.integrationPattern, difficultyBucket: f.q.difficultyBucket }] };
  delete manifest.courierAction;
  delete manifest.bindingTarget;
  delete manifest.payloadSummary;
  const classificationPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.classification.json`;
  const classification = { schemaVersion: "CANDIDATE_CLASSIFICATION_v2", examTitle: path.basename(f.request.sourceArchiveFile, ".js"),
    sourceFileName: path.basename(f.request.sourceArchiveFile), sourceFileDriveId: proof.sourceFileDriveId,
    sourceSha256: hash(sourceBytes), totalQuestions: 1,
    records: [{ questionId: 1, standardCourse: f.q.standardCourse, standardUnitKey: f.q.standardUnitKey,
      standardUnit: f.q.standardUnit, subUnitKey: f.q.subUnitKey, subUnit: f.q.subUnit,
      problemTypeKey: target.problemTypeKey, templateKey: target.templateKey, targetPack: "new-course",
      difficultyBucket: f.q.difficultyBucket, level: f.q.level, difficultyReason: "fixture source-supported classification reason",
      crossConceptKeys: target.crossConceptKeys, conditionKeys: target.conditionKeys, contentSnippet: f.q.content, hasImage: false }] };
  f.put(proof.auditPackageRef.path, audit);
  f.put(proof.manifestRef.path, manifest);
  f.put(classificationPath, classification);
  const auditPackageRef = { path: proof.auditPackageRef.path, sha256: hash(fs.readFileSync(path.join(f.root, proof.auditPackageRef.path))) };
  const manifestRef = { path: proof.manifestRef.path, sha256: hash(fs.readFileSync(path.join(f.root, proof.manifestRef.path))) };
  const classificationRef = { path: classificationPath, sha256: hash(fs.readFileSync(path.join(f.root, classificationPath))) };
  const replace = refs => {
    const next = refs.filter(ref => ref.path !== auditPackageRef.path && ref.path !== manifestRef.path && ref.path !== classificationRef.path);
    return [...next, auditPackageRef, manifestRef, classificationRef];
  };
  f.request.approval.evidenceRefs = replace(f.request.approval.evidenceRefs);
  f.request.approval.metaPipelineAudit = { ...proof, schemaVersion: "meta-pipeline-audit-approval-v2",
    auditPackageRef, manifestRef, classificationRef };
  f.request.items = f.request.items.map(item => ({ ...item, evidenceRefs: replace(item.evidenceRefs) }));
  return { audit, manifest, classification, auditPackageRef, manifestRef, classificationRef };
}

function attachMetaPipelineAuditKeyOnlyV3(f) {
  const attached = attachMetaPipelineAuditV2(f);
  const proof = f.request.approval.metaPipelineAudit;
  const audit = f.read(proof.auditPackageRef.path);
  audit.schemaVersion = "ALIVE_META_AUDIT_ATOMIC_v3";
  audit.records = audit.records.map(row => ({ ...row,
    readingEvidence: { sourceTextExcerpt: f.q.content, solutionDecisiveExcerpt: "fixture exact solution excerpt",
      visualAssetChecked: false, visualType: "NONE" } }));
  const classification = f.read(proof.classificationRef.path);
  classification.schemaVersion = "CANDIDATE_CLASSIFICATION_PACKAGE_v2";
  f.put(proof.auditPackageRef.path, audit);
  f.put(proof.classificationRef.path, classification);
  const auditPackageRef = { path: proof.auditPackageRef.path, sha256: hash(fs.readFileSync(path.join(f.root, proof.auditPackageRef.path))) };
  const classificationRef = { path: proof.classificationRef.path, sha256: hash(fs.readFileSync(path.join(f.root, proof.classificationRef.path))) };
  const replace = refs => {
    const next = refs.filter(ref => ref.path !== auditPackageRef.path && ref.path !== classificationRef.path);
    return [...next, auditPackageRef, classificationRef];
  };
  f.request.approval.evidenceRefs = replace(f.request.approval.evidenceRefs);
  f.request.approval.metaPipelineAudit = { ...proof, auditPackageRef, classificationRef };
  f.request.items = f.request.items.map(item => ({ ...item, evidenceRefs: replace(item.evidenceRefs) }));
  return { ...attached, audit, classification, auditPackageRef, classificationRef };
}

function attachMetaPipelineAuditSourceDriveFlatV3(f, { difficultyBucketOverride, omitClassificationReadingEvidence = false, classBucketOverride, solutionExcerptOverride, visualAssetChecked } = {}) {
  const attached = attachMetaPipelineAuditV2(f);
  const proof = f.request.approval.metaPipelineAudit;
  const sourceBytes = fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`));
  const examTitle = path.basename(f.request.sourceArchiveFile, ".js");
  const oldAuditRow = attached.audit.records[0];
  const oldClassRow = attached.classification.records[0];
  const difficultyBucket = difficultyBucketOverride ?? oldAuditRow.difficultyBucket;
  const difficultyConfidence = oldAuditRow.difficultyConfidence || "source_preserved";
  const readingEvidence = { sourceTextExcerpt: f.q.content, solutionDecisiveExcerpt: solutionExcerptOverride ?? f.q.solution,
    ...(typeof visualAssetChecked === "boolean" ? { visualAssetChecked, visualType: "NONE" } : {}) };
  const audit = {
    schemaVersion: "ALIVE_META_AUDIT_ATOMIC_v3", examTitle, sourceDriveId: proof.sourceFileDriveId,
    sourceSha256: hash(sourceBytes), totalQuestions: 1, totalApproved: 1, totalHold: 0,
    auditStatus: "ALL_APPROVED_CANONICAL_STANDARDIZED",
    records: [{
      questionId: 1, questionNo: 1, readingEvidence, pack: oldAuditRow.targetPack,
      standardCourse: oldAuditRow.standardCourse, standardUnitKey: oldAuditRow.standardUnitKey,
      standardUnit: oldAuditRow.standardUnit, subUnitKey: oldAuditRow.subUnitKey, subUnit: oldAuditRow.subUnit,
      problemTypeKey: oldAuditRow.problemTypeKey, templateKey: oldAuditRow.templateKey,
      crossConceptKeys: oldAuditRow.crossConceptKeys,
      difficulty: { bucket: difficultyBucket, confidence: difficultyConfidence,
        reason: oldAuditRow.difficultyReason },
      auditVerdict: "APPROVED_CANONICAL",
    }],
  };
  const classification = {
    schemaVersion: "ALIVE_CANDIDATE_CLASSIFICATION_v3", examTitle, sourceDriveId: proof.sourceFileDriveId,
    sourceSha256: hash(sourceBytes), totalQuestions: 1,
    records: [{
      questionId: 1, questionNo: 1, pack: oldClassRow.targetPack,
      standardCourse: oldClassRow.standardCourse, standardUnitKey: oldClassRow.standardUnitKey,
      standardUnit: oldClassRow.standardUnit, subUnitKey: oldClassRow.subUnitKey, subUnit: oldClassRow.subUnit,
      problemTypeKey: oldClassRow.problemTypeKey, templateKey: oldClassRow.templateKey,
      crossConceptKeys: oldClassRow.crossConceptKeys, conditionKeys: oldClassRow.conditionKeys,
      integrationPattern: oldClassRow.integrationPattern,
      difficultyBucket: classBucketOverride ?? difficultyBucket, difficultyConfidence,
      difficultyReason: oldClassRow.difficultyReason,
      ...(!omitClassificationReadingEvidence ? { readingEvidence } : {}),
    }],
  };
  f.put(proof.auditPackageRef.path, audit);
  const classificationPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.classification.json`;
  f.put(classificationPath, classification);
  const auditPackageRef = { path: proof.auditPackageRef.path, sha256: hash(fs.readFileSync(path.join(f.root, proof.auditPackageRef.path))) };
  const classificationRef = { path: classificationPath, sha256: hash(fs.readFileSync(path.join(f.root, classificationPath))) };
  const replace = refs => {
    const next = refs.filter(ref => ref.path !== auditPackageRef.path && ref.path !== classificationRef.path);
    return [...next, auditPackageRef, classificationRef];
  };
  f.request.approval.evidenceRefs = replace(f.request.approval.evidenceRefs);
  f.request.approval.metaPipelineAudit = { ...proof, schemaVersion: "meta-pipeline-audit-approval-v3",
    auditPackageRef, classificationRef };
  f.request.items = f.request.items.map(item => ({ ...item,
    before: { ...item.before, difficultyConfidence: item.before.difficultyConfidence ?? null },
    after: { ...item.after, difficultyBucket, difficultyConfidence },
    evidenceRefs: replace(item.evidenceRefs) }));
  return { ...attached, audit, classification, auditPackageRef, classificationRef };
}

function syncFixtureSource(f) {
  const text = "window.questions = " + JSON.stringify([f.q]) + ";\n";
  f.put("archive/exams/" + f.request.sourceArchiveFile, text);
  f.request.expectedSourceBlobSha1 = blob(text);
}

function attachMetaPipelineAuditV4(f, { sourceFieldCorrections = [], manifestOverrides = {}, auditSourceSha256, reviewRowOverrides = {} } = {}) {
  attachMetaPipelineAudit(f, { exactSourceHashBasis: true });
  const proof = f.request.approval.metaPipelineAudit;
  const conditionKeys = Array.isArray(f.q.conditionKeys) ? [...f.q.conditionKeys] : [];
  const metadata = f.read(META);
  Object.assign(metadata.records[0], { conditionKeys, difficultyBucket: f.q.difficultyBucket });
  f.put(META, metadata);
  f.request.items = f.request.items.map(item => ({ ...item,
    before: { ...item.before, conditionKeys, difficultyBucket: f.q.difficultyBucket },
    after: { ...item.after, conditionKeys } }));
  const item = f.request.items[0];
  delete item.after.difficultyBucket;
  const sourceBytes = fs.readFileSync(path.join(f.root, "archive/exams/" + f.request.sourceArchiveFile));
  const examTitle = path.basename(f.request.sourceArchiveFile, ".js");
  const currentSourceSha256 = hash(sourceBytes);
  const originalSourceSha256 = auditSourceSha256 || currentSourceSha256;
  const target = item.after;
  const corrections = Array.isArray(sourceFieldCorrections) ? sourceFieldCorrections : [];
  if (corrections.length) item.sourceFieldCorrections = corrections;
  const auditRow = {
    questionNumber: 1, sourceQuestionId: 1, auditStatus: "PASS",
    packIsolationPassed: true, zeroHoldCompliance: true, zeroStubCertified: true,
    designatedPack: "new-course", verifiedPrimaryTaxonomy: target.problemTypeKey,
    verifiedTemplatePattern: target.templateKey, verifiedCrossConcepts: [...target.crossConceptKeys],
    curriculumAlignment: { unitKey: f.q.standardUnitKey, subUnitKey: f.q.subUnitKey },
    levelVerbatimPreserved: f.q.level, difficultyRank: 3,
    difficultyReasonTrace: "fixture source-supported difficulty reason", solutionStepCountVerified: 2,
  };
  const audit = {
    manifestType: "META_AUDIT_ATOMIC_PACKAGE", sopVersion: "SOP_v1.2",
    examTitle, examSlug: examTitle, sourceFileDriveId: proof.sourceFileDriveId,
    sourceFileSha256: originalSourceSha256, primaryPack: "new-course",
    standardCourse: f.q.standardCourse, totalQuestionsAudited: 1, auditPassedCount: 1, holdCount: 0,
    auditVerdict: "AUDIT_COMPLETE_100_PERCENT_PASS", auditRecords: [auditRow],
  };
  const correctedAssignment = { problemTypeKey: target.problemTypeKey, templateKey: target.templateKey,
    crossConceptKeys: [...target.crossConceptKeys], standardUnitKey: f.q.standardUnitKey,
    subUnitKey: f.q.subUnitKey, standardCourse: f.q.standardCourse };
  const reviewRow = {
    questionUid: item.questionUid, sourceOrdinal: 1, auditQuestionNumber: 1,
    problemTypeKey: target.problemTypeKey, templateKey: target.templateKey,
    crossConceptKeys: [...target.crossConceptKeys], standardUnitKey: f.q.standardUnitKey,
    subUnitKey: f.q.subUnitKey,
    originalAssignment: { standardUnitKey: f.q.standardUnitKey, subUnitKey: f.q.subUnitKey },
    correctedAssignment, sourceTextExcerpt: f.q.content, solutionDecisiveExcerpt: f.q.solution,
    visualEvidence: { assetChecked: false, visualType: "NONE" },
    ...(corrections.length ? { sourceFieldCorrections: corrections } : {}),
    ...reviewRowOverrides,
  };
  const review = {
    schemaVersion: "archive-meta-pipeline-sop-v12-corrective-review-v1", sopVersion: "SOP_v1.2",
    excerptBasis: "CURRENT_PRODUCTION_SOURCE", examTitle, examSlug: examTitle,
    sourceArchiveFile: f.request.sourceArchiveFile, sourceFileDriveId: proof.sourceFileDriveId,
    originalDeclaredSourceSha256: originalSourceSha256, driveSourceSha256: currentSourceSha256,
    productionSourceSha256: currentSourceSha256,
    sourceHashDrift: originalSourceSha256 !== currentSourceSha256,
    questionCount: 1, rows: [reviewRow],
    reviewer: { id: "fixture-human-reviewer", role: "AUTHORIZED_REVIEWER" },
    reviewedAt: "2026-11-04T00:00:00Z",
  };
  const manifestRow = {
    questionNumber: 1, sourceQuestionId: 1, primaryTaxonomy: target.problemTypeKey,
    templatePattern: target.templateKey, crossConcepts: [...target.crossConceptKeys],
    unitKey: f.q.standardUnitKey, subUnitKey: f.q.subUnitKey, pack: "new-course",
    difficulty: 3, level: f.q.level, questionType: f.q.questionType ?? null,
    answer: f.q.answer ?? null, choicesCount: Array.isArray(f.q.choices) ? f.q.choices.length : null,
    score: f.q.score ?? null, ...manifestOverrides,
  };
  const manifest = {
    manifestType: "COURIER_INTAKE_MANIFEST", sopVersion: "SOP_v1.2",
    examTitle, examSlug: examTitle, sourceDriveId: proof.sourceFileDriveId,
    sourceFileSha256: originalSourceSha256, standardCourse: f.q.standardCourse,
    targetPack: "new-course", totalQuestionsToRegister: 1, readyForRegistrationCount: 1,
    pipelineStatus: "READY_FOR_COURIER_REGISTRATION", recordsToBind: [manifestRow],
  };
  const evidenceRoot = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
  const reviewPath = evidenceRoot + "/" + f.request.requestId + ".corrective-review.json";
  f.put(proof.auditPackageRef.path, audit);
  f.put(proof.manifestRef.path, manifest);
  const parity = f.read(proof.sourceParityRef.path);
  parity.originalDeclaredSourceSha256 = originalSourceSha256;
  parity.parityBasis = "EXACT_SOURCE_SHA256";
  parity.status = originalSourceSha256 === currentSourceSha256 ? "EXACT_STUDENT_VISIBLE_PARITY" : "EXACT_STUDENT_VISIBLE_PARITY_WITH_AUDIT_HASH_DRIFT";
  f.put(proof.sourceParityRef.path, parity);
  f.put(reviewPath, review);
  const ref = file => ({ path: file, sha256: hash(fs.readFileSync(path.join(f.root, file))) });
  const auditRef = ref(proof.auditPackageRef.path);
  const manifestRef = ref(proof.manifestRef.path);
  const sourceParityRef = ref(proof.sourceParityRef.path);
  const correctiveReviewRef = ref(reviewPath);
  const replace = refs => [...refs.filter(row => ![auditRef.path, manifestRef.path, sourceParityRef.path, reviewPath].includes(row.path)),
    auditRef, manifestRef, sourceParityRef, correctiveReviewRef];
  f.request.approval.evidenceRefs = replace(f.request.approval.evidenceRefs);
  f.request.approval.metaPipelineAudit = { schemaVersion: "meta-pipeline-audit-approval-v4",
    sourceFileDriveId: proof.sourceFileDriveId, auditPackageRef: auditRef, manifestRef,
    sourceParityRef, correctiveReviewRef, existingConceptReviews: [] };
  f.request.items = f.request.items.map(row => ({ ...row, evidenceRefs: replace(row.evidenceRefs) }));
  return { audit, manifest, review, auditRef, manifestRef, sourceParityRef, correctiveReviewRef };
}

function answerCorrection(overrides = {}) {
  return { field: "answer", questionUid: "uid1", auditQuestionNumber: 1,
    originalManifestValue: "2", currentSourceValue: "1",
    reason: "Human reviewer confirmed the current source answer is authoritative.",
    appliedToManifest: false, ...overrides };
}

function v4CorrectionFixture(t, options = {}) {
  const f = fixture(t);
  f.q.questionType = "객관식";
  f.q.score = 3;
  syncFixtureSource(f);
  attachMetaPipelineAuditV4(f, { sourceFieldCorrections: [answerCorrection()], auditSourceSha256: "a".repeat(64),
    manifestOverrides: { answer: "2" }, ...options });
  return f;
}

test("SOP_v1.2 v4 registers an exact no-correction input unchanged", t => {
  const f = fixture(t);
  f.q.questionType = "객관식";
  f.q.score = 3;
  syncFixtureSource(f);
  attachMetaPipelineAuditV4(f);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  assert.deepEqual(receipt.metaPipelineAudit.sopV12CorrectiveReview.sourceFieldCorrections, []);
});

test("SOP_v1.2 v4 accepts all four reviewed source-field drifts without rewriting audit, manifest or source", t => {
  const f = fixture(t);
  f.q.questionType = "객관식";
  f.q.score = 3;
  syncFixtureSource(f);
  const corrections = [
    answerCorrection(),
    answerCorrection({ field: "questionType", originalManifestValue: "서술형", currentSourceValue: "객관식",
      reason: "Human reviewer confirmed the current source question type is authoritative." }),
    answerCorrection({ field: "choicesCount", originalManifestValue: 5, currentSourceValue: 2,
      reason: "Human reviewer confirmed the current source choices count is authoritative." }),
    answerCorrection({ field: "score", originalManifestValue: 5, currentSourceValue: 3,
      reason: "Human reviewer confirmed the current source score is authoritative." }),
  ];
  attachMetaPipelineAuditV4(f, { sourceFieldCorrections: corrections, auditSourceSha256: "a".repeat(64),
    manifestOverrides: { answer: "2", questionType: "서술형", choicesCount: 5, score: 5 } });
  const auditPath = f.request.approval.metaPipelineAudit.auditPackageRef.path;
  const manifestPath = f.request.approval.metaPipelineAudit.manifestRef.path;
  const sourcePath = "archive/exams/" + f.request.sourceArchiveFile;
  const auditBefore = fs.readFileSync(path.join(f.root, auditPath));
  const manifestBefore = fs.readFileSync(path.join(f.root, manifestPath));
  const sourceBefore = fs.readFileSync(path.join(f.root, sourcePath));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  assert.deepEqual(fs.readFileSync(path.join(f.root, auditPath)), auditBefore);
  assert.deepEqual(fs.readFileSync(path.join(f.root, manifestPath)), manifestBefore);
  assert.deepEqual(fs.readFileSync(path.join(f.root, sourcePath)), sourceBefore);
  assert.equal(result.plannedPaths.includes(auditPath), false);
  assert.equal(result.plannedPaths.includes(manifestPath), false);
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  const recorded = receipt.metaPipelineAudit.sopV12CorrectiveReview.sourceFieldCorrections;
  assert.equal(recorded.length, 4);
  assert.equal(recorded.every(row => row.appliedToManifest === false), true);
  assert.equal(recorded.every(row => row.reviewer.id === "fixture-human-reviewer" && row.reviewer.role === "AUTHORIZED_REVIEWER"), true);
  assert.deepEqual(recorded.map(row => row.field), ["answer", "questionType", "choicesCount", "score"]);
});

test("SOP_v1.2 v4 rejects missing, duplicated, cross-UID, mismatched, reasonless and contradictory corrections", t => {
  const missing = fixture(t);
  missing.q.questionType = "객관식";
  missing.q.score = 3;
  syncFixtureSource(missing);
  attachMetaPipelineAuditV4(missing, { auditSourceSha256: "a".repeat(64), manifestOverrides: { answer: "2" } });
  const metadataBefore = fs.readFileSync(path.join(missing.root, META));
  assert.throws(() => registerReviewedExamV2({ root: missing.root, request: missing.request, write: true }), /manifest binding mismatch/);
  assert.deepEqual(fs.readFileSync(path.join(missing.root, META)), metadataBefore);

  const duplicate = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection(), answerCorrection()] });
  assert.throws(() => registerReviewedExamV2({ root: duplicate.root, request: duplicate.request }), /duplicate source field correction/);

  const crossUid = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection({ questionUid: "uid2" })] });
  assert.throws(() => registerReviewedExamV2({ root: crossUid.root, request: crossUid.request }), /invalid source field correction/);

  const split = v4CorrectionFixture(t);
  split.request.items[0].sourceFieldCorrections = [answerCorrection({ reason: "Different human reason." })];
  assert.throws(() => registerReviewedExamV2({ root: split.root, request: split.request }), /invalid source field correction/);

  const wrongOriginal = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection({ originalManifestValue: "9" })] });
  assert.throws(() => registerReviewedExamV2({ root: wrongOriginal.root, request: wrongOriginal.request }), /invalid source field correction/);

  const wrongCurrent = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection({ currentSourceValue: "9" })] });
  assert.throws(() => registerReviewedExamV2({ root: wrongCurrent.root, request: wrongCurrent.request }), /invalid source field correction/);

  const reasonless = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection({ reason: "   " })] });
  assert.throws(() => registerReviewedExamV2({ root: reasonless.root, request: reasonless.request }), /invalid source field correction/);

  const applied = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection({ appliedToManifest: true })] });
  assert.throws(() => registerReviewedExamV2({ root: applied.root, request: applied.request }), /invalid source field correction/);

  const contradictory = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection({ originalManifestValue: "1", currentSourceValue: "1" })],
    manifestOverrides: { answer: "1" } });
  assert.throws(() => registerReviewedExamV2({ root: contradictory.root, request: contradictory.request }), /invalid source field correction/);

  for (const field of ["content", "choices", "questionUid", "id", "sourceOrdinal"]) {
    const forbidden = v4CorrectionFixture(t, { sourceFieldCorrections: [answerCorrection({ field })] });
    assert.throws(() => registerReviewedExamV2({ root: forbidden.root, request: forbidden.request }), /not permitted for field/);
  }

  const uncoveredField = v4CorrectionFixture(t, { manifestOverrides: { answer: "2", questionType: "서술형" } });
  assert.throws(() => registerReviewedExamV2({ root: uncoveredField.root, request: uncoveredField.request }), /manifest binding mismatch/);
});

for (const [course, curriculum] of [["중1 수학", "2015"], ["중2 수학", "2022"], ["중3 수학", "2022"], ["공통수학1", "2022"], ["대수", "2022"], ["미적분Ⅰ", "2022"], ["확률과통계", "2022"], ["수학Ⅱ", "2015"], ["기하", "2015"], ["아직 등록되지 않은 미래 선택과목", "2030"]]) {
  test(`native canonical extension and registration without subject code: ${curriculum}/${course}`, t => {
    const f = fixture(t, course, curriculum);
    const before = fs.readFileSync(path.join(f.root, META));
    const dry = registerReviewedExamV2({ root: f.root, request: f.request });
    assert.equal(dry.totalQuestions, 1);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
    const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(result.runtimeMaterialized, 1);
    const row = f.read(META).records[0];
    assert.equal(row.courseKey, course);
    assert.equal(row.curriculum, curriculum);
    assert.equal(row.L1, "새 단원");
    assert.equal(row.tagConfidence, "approved_final_qa");
    assert.equal(row.fieldStatus.problemType, "approved_final_qa");
    const replay = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(replay.replay, true);
    assert.deepEqual(replay.plannedPaths, []);
    assert.equal(f.read(`${CANON}/packs/new-course/taxonomy.json`).problemTypes[0].problemTypeKey, "PT_NEW");
  });
}

test("META_PIPELINE_AUDIT can append audited CC keys to an approved empty field", t => {
  const f = fixture(t);
  f.q.crossConceptKeys = [];
  const sourcePath = `archive/exams/${f.request.sourceArchiveFile}`;
  const updatedSource = `window.questions = ${JSON.stringify([f.q])};\n`;
  f.put(sourcePath, updatedSource);
  f.request.expectedSourceBlobSha1 = blob(updatedSource);
  const metadata = f.read(META);
  Object.assign(metadata.records[0], {
    crossConceptKeys: [], reviewStatus: "reviewed_pass", metadataStatus: "approved_full",
    fieldStatus: { crossConcept: "approved_semantic" },
  });
  f.put(META, metadata);
  f.request.items[0].before.crossConceptKeys = [];
  f.request.items[0].before.L3 = null;
  f.request.items[0].before.L4 = null;
  f.request.items[0].sourceMetadataBefore = { crossConceptKeys: [] };
  attachMetaPipelineAudit(f);

  const dryRun = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dryRun.totalQuestions, 1);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.runtimeMaterialized, 1);
  assert.deepEqual(f.read(META).records[0].crossConceptKeys, ["CC_NEW"]);
});

test("META_PIPELINE_AUDIT resolves exact basic-scope parents through an active courseKey alias", t => {
  const f = fixture(t, "중1 수학", "2015");
  const pack = f.request.registryChanges.find(change => change.path.endsWith("/pack.json"));
  pack.after.standardCourses.push("M1-2");
  f.request.items[0].after.courseKey = "M1-2";
  f.request.items[0].before.courseKey = null;
  attachMetaPipelineAudit(f);
  const dryRun = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dryRun.totalQuestions, 1);
});

test("REVIEW2 approval remains distinct", t => {
  const f = fixture(t);
  f.request.approval.type = "REVIEW2";
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /count must be 2/);
  f.request.approval.reviewPassCount = 2;
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(f.read(META).records[0].tagConfidence, "independent_review2");
});

test("META_PIPELINE_AUDIT registers exact audited bindings without relabeling FINAL_QA or REVIEW2", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
  const row = f.read(META).records[0];
  assert.equal(row.metadataApprovalType, "META_PIPELINE_AUDIT");
  assert.equal(row.tagConfidence, "meta_pipeline_audit");
  assert.equal(row.fieldStatus.problemType, "approved_meta_pipeline_audit");
  assert.equal(Object.hasOwn(row.fieldStatus, "difficulty"), false);
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  assert.equal(receipt.approval.type, "META_PIPELINE_AUDIT");
  assert.equal(receipt.examFinalQaStatus, "NOT_EVALUATED_BY_REGISTRAR");
  assert.equal(receipt.metaPipelineAudit.schemaVersion, "ALIVE_META_AUDIT_ATOMIC_v3");
});

test("META_PIPELINE_AUDIT accepts the v2 atomic audit with its paired classification and v3 Courier manifest", t => {
  const f = fixture(t);
  attachMetaPipelineAuditV2(f);
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dry.totalQuestions, 1);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  assert.equal(receipt.metaPipelineAudit.schemaVersion, "META_AUDIT_ATOMIC_PACKAGE_v2");
  assert.equal(receipt.metaPipelineAudit.classificationSha256, f.request.approval.metaPipelineAudit.classificationRef.sha256);
  assert.equal(receipt.examFinalQaStatus, "NOT_EVALUATED_BY_REGISTRAR");
  const replay = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(replay.replay, true);
  assert.deepEqual(replay.plannedPaths, []);
});

test("META_PIPELINE_AUDIT atomic v2 accepts both SHA-bound classification v2 envelope spellings", t => {
  const f = fixture(t);
  attachMetaPipelineAuditV2(f);
  const ref = f.request.approval.metaPipelineAudit.classificationRef;
  const updateClassification = mutate => {
    const classification = f.read(ref.path);
    mutate(classification);
    f.put(ref.path, classification);
    const sha = hash(fs.readFileSync(path.join(f.root, ref.path)));
    ref.sha256 = sha;
    for (const rows of [f.request.approval.evidenceRefs, ...f.request.items.map(item => item.evidenceRefs)]) {
      const row = rows.find(entry => entry.path === ref.path);
      assert.ok(row);
      row.sha256 = sha;
    }
  };
  updateClassification(p => { p.schemaVersion = "CANDIDATE_CLASSIFICATION_PACKAGE_v2"; });
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).status, "PASS");
  updateClassification(p => { p.examTitle = "OTHER_EXAM"; });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /classification identity\/schema mismatch/);
});

test("META_PIPELINE_AUDIT v2 fails closed when a bound CrossConcept has no definition evidence", t => {
  const f = fixture(t);
  attachMetaPipelineAuditV2(f);
  f.request.registryChanges = f.request.registryChanges.filter(change =>
    change.collection !== "activeConceptShards" && !change.path.startsWith(`${CANON}/concepts/`));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }),
    /META_PIPELINE_AUDIT v2 lacks an active CrossConcept definition for CC_NEW/);
});

test("atomic v2 integration opt-in rejects values not present in both audit and manifest", t => {
  const f = fixture(t);
  attachMetaPipelineAuditV2(f);
  f.request.approval.metaPipelineAudit.auditedIntegrationPatterns = true;
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).status, "PASS");
  f.request.items[0].after.integrationPattern = "SEQUENTIAL";
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /audited integration pattern\/manifest mismatch/);
});

test("META_PIPELINE_AUDIT accepts the key-only v3 flat audit with its paired classification package", t => {
  const f = fixture(t);
  attachMetaPipelineAuditKeyOnlyV3(f);
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dry.totalQuestions, 1);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  assert.equal(receipt.metaPipelineAudit.schemaVersion, "ALIVE_META_AUDIT_ATOMIC_v3");
  assert.equal(receipt.metaPipelineAudit.inputAuditVariant, "key_only_v3");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("META_PIPELINE_AUDIT accepts sourceDriveId flat v3 with its paired ALIVE classification", t => {
  const f = fixture(t);
  attachMetaPipelineAuditSourceDriveFlatV3(f);
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dry.totalQuestions, 1);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  assert.equal(receipt.metaPipelineAudit.schemaVersion, "ALIVE_META_AUDIT_ATOMIC_v3");
  assert.equal(receipt.metaPipelineAudit.inputAuditVariant, "source_drive_flat_v3");
  assert.equal(receipt.metaPipelineAudit.sourceSchemaNormalization.statistics.normalizationBasis.includes("APPROVED_CANONICAL"), true);
  assert.equal(receipt.metaPipelineAudit.sourceSchemaNormalization.visualEvidence, "NOT_PROVIDED_IN_SOURCE_SCHEMA");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("META_PIPELINE_AUDIT sourceDriveId flat v3 rejects a classification tag mismatch", t => {
  const f = fixture(t);
  attachMetaPipelineAuditSourceDriveFlatV3(f);
  const proof = f.request.approval.metaPipelineAudit;
  const classification = f.read(proof.classificationRef.path);
  classification.records[0].crossConceptKeys = [];
  f.put(proof.classificationRef.path, classification);
  const classificationRef = { ...proof.classificationRef,
    sha256: hash(fs.readFileSync(path.join(f.root, proof.classificationRef.path))) };
  f.request.approval.metaPipelineAudit.classificationRef = classificationRef;
  f.request.approval.evidenceRefs = f.request.approval.evidenceRefs.map(ref =>
    ref.path === classificationRef.path ? classificationRef : ref);
  f.request.items = f.request.items.map(item => ({ ...item,
    evidenceRefs: item.evidenceRefs.map(ref => ref.path === classificationRef.path ? classificationRef : ref) }));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }),
    /META_PIPELINE_AUDIT sourceDrive v3 classification tags mismatch/);
});

test("sourceDrive flat v3 uses final audit excerpts when classification omits duplicate reading evidence", t => {
  const f = fixture(t);
  attachMetaPipelineAuditSourceDriveFlatV3(f, { omitClassificationReadingEvidence: true, visualAssetChecked: false });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  assert.equal(receipt.metaPipelineAudit.sourceSchemaNormalization.classificationEvidenceAbsent, 1);
  assert.deepEqual(receipt.metaPipelineAudit.sourceSchemaNormalization.visualEvidenceCounts, { checked: 0, notChecked: 1, notProvided: 0 });
});

test("sourceDrive flat v3 still checks final solution excerpts when classification has no reading evidence", t => {
  const f = fixture(t);
  attachMetaPipelineAuditSourceDriveFlatV3(f, { omitClassificationReadingEvidence: true, solutionExcerptOverride: "not present in the source solution" });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /sourceDrive v3 solution excerpt mismatch/);
});

test("sourceDrive flat v3 rejects paired difficulty bucket drift", t => {
  const f = fixture(t);
  attachMetaPipelineAuditSourceDriveFlatV3(f, { classBucketOverride: 5 });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /sourceDrive v3 evidence mismatch/);
});

test("sourceDrive flat v3 binds its audited 1-5 bucket over a legacy text bucket", t => {
  const f = fixture(t);
  delete f.q.difficultyBucket;
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  f.request.items = f.request.items.map(item => ({ ...item,
    sourceMetadataBefore: { difficultyBucket: null } }));
  const metadata = f.read(META);
  metadata.records[0].difficultyBucket = "중";
  metadata.records[0].fieldStatus = { difficulty: "approved_source" };
  f.put(META, metadata);
  f.request.items[0].before.difficultyBucket = "중";
  attachMetaPipelineAuditSourceDriveFlatV3(f, { difficultyBucketOverride: 2 });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.difficultyBucket, 2);
  assert.equal(row.difficultyConfidence, "source_preserved");
  assert.equal(row.fieldStatus.difficulty, "approved_meta_pipeline_audit");
});

for (const manifestSchema of ["ALIVE_COURIER_INTAKE_MANIFEST_v3", "COURIER_INTAKE_MANIFEST_v3"]) {
  test(`META_PIPELINE_AUDIT accepts ${manifestSchema} with the rich audit gates intact`, t => {
    const f = fixture(t);
    attachMetaPipelineAudit(f);
    const manifestRef = f.request.approval.metaPipelineAudit.manifestRef;
    const manifest = f.read(manifestRef.path);
    manifest.schemaVersion = manifestSchema;
    manifest.totalQuestions = 1;
    manifest.totalHoldCount = 0;
    delete manifest.courierAction;
    delete manifest.bindingTarget;
    delete manifest.payloadSummary;
    manifest.recordsToBind = manifest.recordsToBind.map(row => {
      const normalized = { ...row, crossConcepts: row.crossConceptKeys.join(" "), conditionKeys: f.q.conditionKeys };
      delete normalized.crossConceptKeys;
      return normalized;
    });
    f.put(manifestRef.path, manifest);
    const nextManifestRef = { path: manifestRef.path, sha256: hash(fs.readFileSync(path.join(f.root, manifestRef.path))) };
    const replaceManifestRef = refs => [...refs.filter(ref => ref.path !== manifestRef.path), nextManifestRef];
    f.request.approval.evidenceRefs = replaceManifestRef(f.request.approval.evidenceRefs);
    f.request.approval.metaPipelineAudit.manifestRef = nextManifestRef;
    f.request.items = f.request.items.map(item => ({ ...item, evidenceRefs: replaceManifestRef(item.evidenceRefs) }));

    const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
    assert.equal(result.totalQuestions, 1);
    assert.equal(f.read(META).records[0].metadataApprovalType, "META_PIPELINE_AUDIT");
  });
}

test("META_PIPELINE_AUDIT rejects a CrossConcept key echoed as its definition", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f);
  const auditRef = f.request.approval.metaPipelineAudit.auditPackageRef;
  const audit = f.read(auditRef.path);
  const definition = audit.boundAtomicCrossConcepts[0];
  definition.labelKo = definition.conceptKey;
  definition.definition = definition.conceptKey;
  f.put(auditRef.path, audit);
  const nextAuditRef = { path: auditRef.path, sha256: hash(fs.readFileSync(path.join(f.root, auditRef.path))) };
  const replaceAuditRef = refs => [...refs.filter(ref => ref.path !== auditRef.path), nextAuditRef];
  f.request.approval.evidenceRefs = replaceAuditRef(f.request.approval.evidenceRefs);
  f.request.approval.metaPipelineAudit.auditPackageRef = nextAuditRef;
  f.request.items = f.request.items.map(item => ({ ...item, evidenceRefs: replaceAuditRef(item.evidenceRefs) }));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /CrossConcept definition placeholder/);
});

test("META_PIPELINE_AUDIT accepts a canonical target parent when the exact master snapshot is evidence-bound", t => {
  const f = fixture(t, "기하");
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true, targetCanonicalParent: true });
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
  const row = f.read(META).records[0];
  assert.equal(row.L1, "새 단원");
  assert.equal(row.L2, "새 단원");

  const unlinked = fixture(t, "기하");
  attachMetaPipelineAudit(unlinked, { promoteCanonicalTypes: true, targetCanonicalParent: true });
  const masterPath = unlinked.request.items[0].targetParentRef.path;
  unlinked.request.approval.evidenceRefs = unlinked.request.approval.evidenceRefs.filter(ref => ref.path !== masterPath);
  assert.throws(() => registerReviewedExamV2({ root: unlinked.root, request: unlinked.request, write: true }), /registration binding mismatch/);
});

test("META_PIPELINE_AUDIT accepts an exact canonical parent at the audited subunit label", t => {
  const f = fixture(t, "기하");
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true, targetCanonicalParent: true, targetParentUsesSubUnit: true });
  const result = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(result.totalQuestions, 1);
});

test("canonical parent accepts the existing master scope alias 수학_상 for 수학(상)", t => {
  const f = fixture(t, "수학(상)", "2015");
  attachMetaPipelineAudit(f, { targetCanonicalParent: true, targetCanonicalScope: "수학_상" });
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

test("canonical parent scope aliases do not cross the upper and lower math courses", t => {
  const f = fixture(t, "수학(하)", "2015");
  attachMetaPipelineAudit(f, { targetCanonicalParent: true, targetCanonicalScope: "수학_상" });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /canonical target parent mismatch/);
});

function attachExactTypeParent(f) {
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true, targetCanonicalParent: true });
  const item = f.request.items[0], parent = item.targetParentRef;
  const master = f.read(parent.path);
  parent.midUnit = "RPM 전용 부모";
  master.records[0].midUnit = parent.midUnit;
  f.put(parent.path, master);
  const newHash = hash(fs.readFileSync(path.join(f.root, parent.path)));
  const visit = value => {
    if (!value || typeof value !== "object") return;
    if (value.path === parent.path && value.sha256) value.sha256 = newHash;
    Object.values(value).forEach(visit);
  };
  visit(f.request);
  item.after.L2 = parent.midUnit;
  const crossPath = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json";
  f.put(crossPath, { status: "ACTIVE_REFERENCE", records: [{ id: "EXACT-TYPE", curriculum: item.after.curriculum,
    scope: item.after.standardCourse, problemTypeKey: item.after.problemTypeKey, templateKey: item.after.templateKey,
    bindingStatus: "ACTIVE", rpmPath: { majorUnit: parent.majorUnit, midUnit: parent.midUnit } }] });
  const ref = { path: crossPath, sha256: hash(fs.readFileSync(path.join(f.root, crossPath))) };
  parent.crosswalkRef = { ...ref, recordId: "EXACT-TYPE" };
  item.evidenceRefs.push(ref);
  return { item, crossPath };
}

test("canonical parent accepts an evidence-bound exact ACTIVE PT/TPL crosswalk parent", t => {
  const f = fixture(t, "기하");
  attachExactTypeParent(f);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

function attachDeclaredCrosswalkCourseAlias(f, declared) {
  const data = attachExactTypeParent(f), alias = "GEOMETRY_ALIAS";
  const packChange = f.request.registryChanges.find(change => change.path.endsWith("/pack.json"));
  if (declared) packChange.after.standardCourses.push(alias);
  data.item.after.courseKey = alias;
  data.item.targetParentRef.scope = alias;
  const masterPath = data.item.targetParentRef.path, master = f.read(masterPath), crosswalk = f.read(data.crossPath);
  master.records[0].scope = alias; crosswalk.records[0].scope = alias;
  f.put(masterPath, master); f.put(data.crossPath, crosswalk);
  const hashes = new Map([masterPath, data.crossPath].map(p => [p, hash(fs.readFileSync(path.join(f.root, p)))]));
  const update = o => { if (!o || typeof o !== "object") return; if (hashes.has(o.path) && o.sha256) o.sha256 = hashes.get(o.path); Object.values(o).forEach(update); };
  update(f.request);
}

test("exact crosswalk parent accepts a courseKey alias declared by its ACTIVE owner pack", t => {
  const f = fixture(t, "기하");
  attachDeclaredCrosswalkCourseAlias(f, true);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

test("exact crosswalk parent rejects an alias absent from its ACTIVE owner pack", t => {
  const f = fixture(t, "기하");
  attachDeclaredCrosswalkCourseAlias(f, false);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /curriculum\/course aliases disagree/);
});

test("canonical crosswalk parent rejects wrong PT, course, parent, inactive and unbound references", t => {
  for (const field of ["problemTypeKey", "scope", "bindingStatus", "parent", "sha256"]) {
    const f = fixture(t, "기하"), { item, crossPath } = attachExactTypeParent(f);
    if (field === "sha256") item.targetParentRef.crosswalkRef.sha256 = "0".repeat(64);
    else {
      const doc = f.read(crossPath);
      if (field === "parent") doc.records[0].rpmPath.midUnit = "잘못된 부모";
      else doc.records[0][field] = "WRONG";
      f.put(crossPath, doc);
      const updated = hash(fs.readFileSync(path.join(f.root, crossPath)));
      item.targetParentRef.crosswalkRef.sha256 = updated;
      item.evidenceRefs.find(ref => ref.path === crossPath).sha256 = updated;
    }
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /canonical target crosswalk/);
  }
});

test("META_PIPELINE_AUDIT permits audit/current Drive hash drift only with exact per-UID student parity", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { driveSourceHashDrift: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json");
  assert.equal(receipt.metaPipelineAudit.sourceHashDrift, true);
  assert.equal(receipt.metaPipelineAudit.auditSourceSha256, f.read(receipt.approval.metaPipelineAudit.auditPackageRef.path).sourceSha256);
});

test("META_PIPELINE_AUDIT accepts exact full-source SHA parity when audit excerpts are summaries", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { exactSourceHashBasis: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.problemTypeKey, "PT_NEW");
});

test("META_PIPELINE_AUDIT accepts the combined SVG_IMAGE visual evidence value", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { exactSourceHashBasis: true, dualVisual: true });
  const result = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(result.totalQuestions, 1);
});

test("META_PIPELINE_AUDIT promotes missing PT/TPL/CC definitions from audited UID evidence", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
  assert.equal(result.registryChangeCount, f.request.registryChanges.length);
  const taxonomy = f.read(`${CANON}/packs/new-course/taxonomy.json`);
  assert.equal(taxonomy.problemTypes[0].problemTypeKey, "PT_NEW");
  assert.equal(taxonomy.templates[0].templateKey, "TPL_NEW");
  assert.deepEqual(taxonomy.problemTypes[0].supportingQuestionUids, ["uid1"]);
  assert.deepEqual(taxonomy.templates[0].supportingQuestionUids, ["uid1"]);
  assert.equal(f.read(`${CANON}/concepts/new-concepts.json`).concepts[0].conceptKey, "CC_NEW");
  assert.equal(f.read(META).records[0].problemTypeKey, "PT_NEW");
  assert.equal(f.read(META).records[0].templateKey, "TPL_NEW");
});

test("META_PIPELINE_AUDIT appends an added binding domain to an existing owner pack", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const base = `${CANON}/packs/new-course`;
  const activePackChange = f.request.registryChanges.find(c => c.path === `${CANON}/registry_index.json` && c.collection === "activePacks");
  const packChange = f.request.registryChanges.find(c => c.path === `${base}/pack.json`);
  const taxonomyChange = f.request.registryChanges.find(c => c.path === `${base}/taxonomy.json`);
  const bindingChange = f.request.registryChanges.find(c => c.path === `${base}/bindings.json`);
  const aliasesChange = f.request.registryChanges.find(c => c.path === `${base}/aliases.json`);
  const pack = { ...packChange.after, ownedStandardUnitDomains: [] };
  const index = f.read(`${CANON}/registry_index.json`);
  index.activePacks.push({ id: pack.packId, version: pack.packVersion, status: "ACTIVE" });
  f.put(`${CANON}/registry_index.json`, index);
  f.put(`${base}/pack.json`, pack);
  f.put(`${base}/taxonomy.json`, { status: "ACTIVE", problemTypes: [], templates: [] });
  f.put(`${base}/bindings.json`, { status: "ACTIVE", bindings: [], applicabilityRules: [] });
  f.put(`${base}/aliases.json`, { aliases: [] });
  const evidenceRefs = packChange.evidenceRefs;
  f.request.registryChanges = f.request.registryChanges.filter(c => ![activePackChange, packChange, taxonomyChange, bindingChange, aliasesChange].includes(c));
  f.request.registryChanges.push(
    { path: `${base}/taxonomy.json`, collection: "problemTypes", match: { problemTypeKey: "PT_NEW" }, before: null,
      after: taxonomyChange.after.problemTypes[0], evidenceRefs },
    { path: `${base}/taxonomy.json`, collection: "templates", match: { templateKey: "TPL_NEW" }, before: null,
      after: taxonomyChange.after.templates[0], evidenceRefs },
    { path: `${base}/bindings.json`, collection: "bindings", match: { curriculum: "2022", standardCourse: "중1 수학",
      standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW" }, before: null,
      after: bindingChange.after.bindings[0], evidenceRefs }
  );
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.deepEqual(f.read(`${base}/pack.json`).ownedStandardUnitDomains, ["UNIT_NEW"]);
});

test("META_PIPELINE_AUDIT permits an additive course scope extension only for an exact active binding", t => {
  const sourceCourse = "확률과 통계", canonicalCourse = "확률과통계";
  const f = fixture(t, sourceCourse, "2015");
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const newBase = `${CANON}/packs/new-course`;
  const existingBase = `${CANON}/packs/functions-graphs`;
  const indexPath = `${CANON}/registry_index.json`;
  const index = f.read(indexPath);
  index.activePacks = [{ id: "FUNCTIONS_GRAPHS", version: "1.0.0", status: "ACTIVE" }];
  f.put(indexPath, index);
  const currentPack = { schemaVersion: "meta-foundation-pack-v1", packId: "FUNCTIONS_GRAPHS", packVersion: "1.0.0",
    canonicalStatus: "ACTIVE", curricula: ["2015"], standardCourses: [sourceCourse], ownedStandardUnitDomains: [] };
  f.put(`${existingBase}/pack.json`, currentPack);
  f.put(`${existingBase}/taxonomy.json`, { status: "ACTIVE", problemTypes: [], templates: [] });
  f.put(`${existingBase}/bindings.json`, { status: "ACTIVE", bindings: [], applicabilityRules: [] });
  f.put(`${existingBase}/aliases.json`, { aliases: [] });

  const originalTaxonomy = f.request.registryChanges.find(change => change.path === `${newBase}/taxonomy.json`).after;
  const originalBindings = f.request.registryChanges.find(change => change.path === `${newBase}/bindings.json`).after;
  const evidenceRefs = f.request.registryChanges.find(change => change.path === `${newBase}/pack.json`).evidenceRefs;
  const problemType = { ...originalTaxonomy.problemTypes[0], ownerPack: "FUNCTIONS_GRAPHS" };
  const template = { ...originalTaxonomy.templates[0], ownerPack: "FUNCTIONS_GRAPHS" };
  const binding = { ...originalBindings.bindings[0], ownerPack: "FUNCTIONS_GRAPHS" };
  f.request.registryChanges = f.request.registryChanges.filter(change =>
    !change.path.startsWith(`${newBase}/`) && !(change.path === indexPath && change.collection === "activePacks"));
  f.request.registryChanges.push(
    { path: `${existingBase}/pack.json`, before: currentPack,
      after: { ...currentPack, standardCourses: [...currentPack.standardCourses, canonicalCourse] }, evidenceRefs },
    { path: `${existingBase}/taxonomy.json`, collection: "problemTypes", match: { problemTypeKey: "PT_NEW" },
      before: null, after: problemType, evidenceRefs },
    { path: `${existingBase}/taxonomy.json`, collection: "templates", match: { templateKey: "TPL_NEW" },
      before: null, after: template, evidenceRefs },
    { path: `${existingBase}/bindings.json`, collection: "bindings", match: { curriculum: "2015", standardCourse: sourceCourse,
      standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW" }, before: null, after: binding, evidenceRefs }
  );
  f.request.items[0].after.courseKey = canonicalCourse;

  const result = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(result.status, "PASS");
  assert.deepEqual(result.plannedPaths.includes(`${existingBase}/pack.json`), true);
  const invalid = structuredClone(f.request);
  invalid.registryChanges.find(change => change.path === `${existingBase}/pack.json`).after.standardCourses = [sourceCourse];
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: invalid }), /registry changes must be additions only/);
});

test("META_PIPELINE_AUDIT preserves a source course label while binding an explicitly packed canonical course key", t => {
  const f = fixture(t, "중3-1", "2015");
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const packChange = f.request.registryChanges.find(change => change.path.endsWith("/new-course/pack.json"));
  packChange.after.standardCourses.push("M3-1");
  f.request.items[0].after.courseKey = "M3-1";

  const result = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(result.status, "PASS");
  const invalid = structuredClone(f.request);
  invalid.registryChanges.find(change => change.path.endsWith("/new-course/pack.json")).after.standardCourses = ["중3-1"];
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: invalid }), /curriculum\/course aliases disagree/);
});

test("META_PIPELINE_AUDIT assigns a new TPL to the exact binding pack when its parent PT is external", t => {
  const f = fixture(t);
  const newBase = `${CANON}/packs/new-course`;
  const parentBase = `${CANON}/packs/parent-course`;
  const index = f.read(`${CANON}/registry_index.json`);
  index.activePacks.push({ id: "PARENT_COURSE", version: "1.0.0", status: "ACTIVE" });
  f.put(`${CANON}/registry_index.json`, index);
  f.put(`${parentBase}/pack.json`, { schemaVersion: "meta-foundation-pack-v1", packId: "PARENT_COURSE", packVersion: "1.0.0",
    canonicalStatus: "ACTIVE", curricula: ["2022"], standardCourses: ["중1 수학"], ownedStandardUnitDomains: ["UNIT_NEW"] });
  f.put(`${parentBase}/taxonomy.json`, { status: "ACTIVE", problemTypes: [{ problemTypeKey: "PT_NEW", canonicalLabelKo: "새 유형",
    definition: "기존 외부 owner의 유형", ownerPack: "PARENT_COURSE", status: "ACTIVE" }], templates: [] });
  f.put(`${parentBase}/bindings.json`, { status: "ACTIVE", bindings: [] });
  f.put(`${parentBase}/aliases.json`, { aliases: [] });
  f.put(`${newBase}/taxonomy.json`, { status: "ACTIVE", problemTypes: [], templates: [] });
  const originalTaxonomy = f.request.registryChanges.find(change => change.path === `${newBase}/taxonomy.json`).after;
  f.request.registryChanges.find(change => change.path === `${newBase}/bindings.json`).after.bindings[0].ownerPack = "NEW_COURSE";
  const evidenceRefs = f.request.registryChanges.find(change => change.path === `${newBase}/pack.json`).evidenceRefs;
  f.request.registryChanges = f.request.registryChanges.filter(change => change.path !== `${newBase}/taxonomy.json`);
  f.request.registryChanges.push({ path: `${newBase}/taxonomy.json`, collection: "templates", match: { templateKey: "TPL_NEW" }, before: null,
    after: { ...originalTaxonomy.templates[0], ownerPack: "NEW_COURSE" }, evidenceRefs });
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  assert.equal(f.read(`${newBase}/taxonomy.json`).templates[0].ownerPack, "NEW_COURSE");
  assert.equal(f.read(`${newBase}/bindings.json`).bindings[0].problemTypeKey, "PT_NEW");
});

test("META_PIPELINE_AUDIT rejects an unbound PT/TPL registry addition", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const taxonomy = f.request.registryChanges.find(change => change.path.endsWith("taxonomy.json")).after;
  taxonomy.problemTypes.push({ problemTypeKey: "PT_UNUSED", canonicalLabelKo: "미사용 유형", definition: "시험지에서 승인되지 않은 유형",
    ownerPack: "NEW_COURSE", status: "ACTIVE", supportingQuestionUids: ["uid1"], supportingItemCount: 1 });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /promotions must exactly match missing audited keys/);
});

test("META_PIPELINE_AUDIT requires exact supporting UIDs for a new TPL", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const taxonomy = f.request.registryChanges.find(change => change.path.endsWith("taxonomy.json")).after;
  taxonomy.templates[0].supportingQuestionUids = [];
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /TPL promotion support mismatch/);
});

test("META_PIPELINE_AUDIT materializes explicitly pending source metadata placeholders", t => {
  const f = fixture(t);
  f.q = { ...f.q, problemTypeKey: null, templateKey: null, crossConceptKeys: [], projectionStatus: "BINDING_PENDING",
    problemTypeKeyNullReason: "No exact ACTIVE binding exists yet.", templateKeyNullReason: "No exact ACTIVE binding exists yet.",
    crossConceptKeysNullReason: "No exact ACTIVE binding exists yet." };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(f.read(META).records[0].problemTypeKey, "PT_NEW");
  assert.equal(f.read(META).records[0].templateKey, "TPL_NEW");
  assert.equal(f.read(META).records[0].crossConceptKeys[0], "CC_NEW");
  assert.equal(fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`), "utf8"), bytes);
});

test("META_PIPELINE_AUDIT resolves field-specific explicit holds on an overall reviewed_pass row", t => {
  const f = fixture(t);
  f.q = { ...f.q, problemTypeKey: null, templateKey: null, crossConceptKeys: [] };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  f.request.items = f.request.items.map(item => ({ ...item, before: { ...item.before, L3: null, L4: null },
    sourceMetadataBefore: { problemTypeKey: null, templateKey: null, crossConceptKeys: [] } }));
  const metadata = f.read(META);
  Object.assign(metadata.records[0], {
    reviewStatus: "reviewed_pass", metadataStatus: "approved_partial_with_explicit_holds",
    fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending", crossConcept: "manual_review_pending" },
  });
  f.put(META, metadata);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(f.read(META).records[0].problemTypeKey, "PT_NEW");
  assert.equal(f.read(META).records[0].templateKey, "TPL_NEW");
});

test("META_PIPELINE_AUDIT accepts the preserved RPM final-binding gap marker with its reason", t => {
  const f = fixture(t);
  f.q = { ...f.q, problemTypeKey: null, templateKey: null, crossConceptKeys: [],
    metaStatus: "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED", metaNullReason: "No exact active binding was materialized." };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(f.read(META).records[0].problemTypeKey, "PT_NEW");
  assert.equal(f.read(META).records[0].templateKey, "TPL_NEW");
});

test("META_PIPELINE_AUDIT rejects RPM final-binding gap markers without a reason", t => {
  const f = fixture(t);
  f.q = { ...f.q, problemTypeKey: null, templateKey: null, crossConceptKeys: [],
    metaStatus: "RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED" };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  attachMetaPipelineAudit(f);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /source\/approved metadata parity/);
});

test("META_PIPELINE_AUDIT rebinds exact unapproved source tags without changing source bytes", t => {
  const f = fixture(t);
  f.q = { ...f.q, problemTypeKey: "PT_OLD", templateKey: "TPL_OLD", crossConceptKeys: ["CC_OLD"] };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  f.request.items[0].sourceMetadataBefore = { problemTypeKey: "PT_OLD", templateKey: "TPL_OLD", crossConceptKeys: ["CC_OLD"] };
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(f.read(META).records[0].problemTypeKey, "PT_NEW");
  assert.deepEqual(f.read(META).records[0].crossConceptKeys, ["CC_NEW"]);
  assert.equal(fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`), "utf8"), bytes);
});

test("META_PIPELINE_AUDIT resolves only explicitly pending fields on a partial metadata row", t => {
  const f = fixture(t);
  f.q = { ...f.q, crossConceptKeys: [] };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  f.request.items[0].before.crossConceptKeys = [];
  f.request.items[0].before.L3 = null;
  f.request.items[0].before.L4 = null;
  f.request.items[0].after.crossConceptKeys = ["CC_NEW"];
  f.request.items[0].sourceMetadataBefore = { crossConceptKeys: [] };
  const meta = f.read(META);
  Object.assign(meta.records[0], { crossConceptKeys: [], reviewStatus: "manual_review",
    metadataStatus: "approved_partial_with_explicit_holds", fieldStatus: { concept: "manual_review_pending" } });
  f.put(META, meta);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.crossConceptKeys[0], "CC_NEW");
  assert.equal(row.fieldStatus.concept, "approved_meta_pipeline_audit");
  assert.equal(row.reviewStatus, "manual_review");
  assert.equal(row.metadataStatus, "approved_semantic_review");
});

test("META_PIPELINE_AUDIT closes a registration-reset marker and preserves the prior R1 evidence", t => {
  const f = fixture(t);
  const meta = f.read(META);
  meta.records[0].registrationUpdateState = { schemaVersion: "JS_ARCHIVE_EXISTING_TARGET_META_DELTA_POLICY_V1",
    disposition: "PHYSICAL_META_UPDATED_REVIEW_RESET_PENDING", r1MetaPass: true,
    r1EvidenceRef: "archive/analysis/fixture/r1-evidence.json", changedFields: ["problemTypeKey", "templateKey"] };
  f.put(META, meta);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const state = f.read(META).records[0].registrationUpdateState;
  assert.equal(state.disposition, "META_PIPELINE_AUDIT_REGISTERED");
  assert.equal(state.r1MetaPass, true);
  assert.equal(state.r1EvidenceRef, "archive/analysis/fixture/r1-evidence.json");
  assert.equal(state.metaPipelineAuditCompletion.requestId, f.request.requestId);
});

test("META_PIPELINE_AUDIT preserves source QA status fields instead of promoting exam Final QA", t => {
  const f = fixture(t);
  f.q = { ...f.q, tagConfidence: "high", tagStatus: "manual_review", reviewStatus: "manual_review" };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  const meta = f.read(META);
  Object.assign(meta.records[0], { tagConfidence: "high", tagStatus: "manual_review", reviewStatus: "manual_review" });
  f.put(META, meta);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.tagConfidence, "high");
  assert.equal(row.tagStatus, "manual_review");
  assert.equal(row.reviewStatus, "manual_review");
  assert.equal(row.metadataStatus, "approved_semantic_review");
  assert.equal(row.metadataApprovalType, "META_PIPELINE_AUDIT");
});

test("META_PIPELINE_AUDIT completes semantic fields while preserving an unrelated pending difficulty hold", t => {
  const f = fixture(t);
  f.q = { ...f.q, reviewStatus: "review_required", tagStatus: "review_required" };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  const meta = f.read(META);
  Object.assign(meta.records[0], { reviewStatus: "review_required", tagStatus: "review_required",
    metadataStatus: "registration_pending_semantic_review", fieldStatus: { difficulty: "manual_review_pending" } });
  f.put(META, meta);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.metadataStatus, "approved_partial_with_explicit_holds");
  assert.equal(row.reviewStatus, "review_required");
  assert.equal(row.tagStatus, "review_required");
  assert.equal(row.fieldStatus.difficulty, "manual_review_pending");
  assert.equal(row.fieldStatus.problemType, "approved_meta_pipeline_audit");
});

test("META_PIPELINE_AUDIT keeps unrelated manual field holds after binding the audited fields", t => {
  const f = fixture(t);
  f.q = { ...f.q, crossConceptKeys: [] };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  f.request.items[0].before.crossConceptKeys = [];
  f.request.items[0].before.L3 = null;
  f.request.items[0].before.L4 = null;
  f.request.items[0].after.crossConceptKeys = ["CC_NEW"];
  f.request.items[0].sourceMetadataBefore = { crossConceptKeys: [] };
  const meta = f.read(META);
  Object.assign(meta.records[0], { crossConceptKeys: [], reviewStatus: "manual_review",
    metadataStatus: "approved_partial_with_explicit_holds", fieldStatus: {
      concept: "manual_review_pending", difficulty: "manual_review_pending"
    } });
  f.put(META, meta);
  attachMetaPipelineAudit(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.crossConceptKeys[0], "CC_NEW");
  assert.equal(row.fieldStatus.concept, "approved_meta_pipeline_audit");
  assert.equal(row.fieldStatus.difficulty, "manual_review_pending");
  assert.equal(row.reviewStatus, "manual_review");
  assert.equal(row.metadataStatus, "approved_partial_with_explicit_holds");
});

test("META_PIPELINE_AUDIT cannot rebind source tags on an already approved metadata row", t => {
  const f = fixture(t);
  f.q = { ...f.q, problemTypeKey: "PT_OLD" };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  f.request.items[0].sourceMetadataBefore = { problemTypeKey: "PT_OLD" };
  const meta = f.read(META);
  meta.records[0].reviewStatus = "reviewed_pass";
  meta.records[0].metadataStatus = "approved_final_qa";
  f.put(META, meta);
  f.request.items[0].before.problemTypeKey = null;
  attachMetaPipelineAudit(f);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /source\/approved metadata parity/);
});

test("META_PIPELINE_AUDIT does not treat unreasoned null source metadata as pending placeholders", t => {
  const f = fixture(t);
  f.q = { ...f.q, problemTypeKey: null, templateKey: null, crossConceptKeys: [], projectionStatus: "BINDING_PENDING" };
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  attachMetaPipelineAudit(f);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /source\/approved metadata parity/);
});

test("META_PIPELINE_AUDIT preserves an unresolved legacy difficulty bucket as EVIDENCE_DEBT", t => {
  const f = fixture(t);
  delete f.q.difficultyBucket;
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  const meta = f.read(META);
  meta.records[0].difficultyBucket = "중";
  meta.records[0].fieldStatus = { difficulty: "approved_source" };
  f.put(META, meta);
  f.request.items[0].before.difficultyBucket = "중";
  f.request.items[0].after.difficultyBucket = null;
  attachMetaPipelineAudit(f);
  f.request.approval.metaPipelineAudit.unreviewedFields = [
    { field: "difficultyBucket", status: "EVIDENCE_DEBT", questionUids: ["uid1"], reason: "The source label is not a five-level bucket and the audit package did not assess difficulty; no conversion was inferred." }
  ];
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.difficultyBucket, null);
  assert.equal(row.fieldStatus.difficulty, "EVIDENCE_DEBT");
  assert.equal(row.difficultyEvidenceDebt.status, "EVIDENCE_DEBT");
});

test("META_PIPELINE_AUDIT records unassessed IntegrationPattern instead of inventing NONE", t => {
  const f = fixture(t);
  delete f.q.integrationPattern;
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  delete f.request.items[0].after.integrationPattern;
  delete f.request.items[0].before.integrationPattern;
  f.request.items[0].after.integrationPattern = null;
  f.request.items[0].before.integrationPattern = null;
  attachMetaPipelineAudit(f);
  f.request.approval.metaPipelineAudit.unreviewedFields = [
    { field: "integrationPattern", status: "EVIDENCE_DEBT", questionUids: ["uid1"], reason: "The ALIVE meta audit schema does not assess IntegrationPattern." }
  ];
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.integrationPattern, null);
  assert.equal(row.fieldStatus.integrationPattern, "EVIDENCE_DEBT");
  assert.equal(row.integrationPatternEvidenceDebt.status, "EVIDENCE_DEBT");
});

test("META_PIPELINE_AUDIT accepts a shared L1/L2 parent only from sibling consensus under the same unit", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { siblingParent: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.L1, "새 단원");
  assert.equal(row.L2, "새 세부단원");
});

test("META_PIPELINE_AUDIT uses an exact approved metadata parent snapshot when the shared parent map lacks a row", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f);
  const metadata = f.read(META), current = metadata.records[0];
  Object.assign(current, { L1: "기존 승인 L1", L2: "기존 승인 L2", curriculum: "2022", curriculumKey: "2022",
    reviewStatus: "reviewed_pass", metadataStatus: "approved_semantic_review" });
  f.put(META, metadata);
  const parentPath = f.request.items[0].basicScopeParentRef.path;
  const parentProof = { schemaVersion: "archive-meta-pipeline-parent-label-evidence-v1", sourcePath: META,
    sourceSha256: hash(fs.readFileSync(path.join(f.root, META))), records: [{ questionUid: "uid1", sourceArchiveFile: f.request.sourceArchiveFile,
      sourceOrdinal: 1, curriculumKey: "2022", courseKey: "중1 수학", standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW",
      L1: current.L1, L2: current.L2 }], derivedRecords: [] };
  f.put(parentPath, parentProof);
  const ref = { path: parentPath, sha256: hash(fs.readFileSync(path.join(f.root, parentPath))) };
  const replaceParentRef = refs => refs.map(row => row.path === parentPath ? ref : row);
  f.request.approval.evidenceRefs = replaceParentRef(f.request.approval.evidenceRefs);
  f.request.items = f.request.items.map(item => ({ ...item, basicScopeParentRef: ref,
    before: { ...item.before, curriculum: "2022", curriculumKey: "2022", L1: current.L1, L2: current.L2, L3: null, L4: null },
    after: { ...item.after, L1: current.L1, L2: current.L2 }, evidenceRefs: replaceParentRef(item.evidenceRefs) }));
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.L1, "기존 승인 L1");
  assert.equal(row.L2, "기존 승인 L2");
  const replay = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(replay.status, "PASS");
  assert.equal(replay.replay, true);
});

test("META_PIPELINE_AUDIT reuses a same-label existing CrossConcept without changing its canonical meaning", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { existingConcept: true });
  const beforeRegistry = f.read(`${CANON}/concepts/new-concepts.json`);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.registryChangeCount, 0);
  assert.deepEqual(f.read(`${CANON}/concepts/new-concepts.json`), beforeRegistry);
  assert.equal(f.read(META).records[0].crossConceptKeys[0], "CC_NEW");
});

test("META_PIPELINE_AUDIT permits reviewed label and definition wording drift without changing canonical CrossConcept", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { existingConcept: true, existingConceptLabelDrift: true });
  const canonicalBefore = f.read(`${CANON}/concepts/new-concepts.json`);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.registryChangeCount, 0);
  assert.deepEqual(f.read(`${CANON}/concepts/new-concepts.json`), canonicalBefore);
  assert.equal(f.read(META).records[0].crossConceptKeys[0], "CC_NEW");
});

test("META_PIPELINE_AUDIT refuses existing CrossConcept wording drift without a reuse rationale", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { existingConcept: true });
  delete f.request.approval.metaPipelineAudit.existingConceptReviews;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /wording review required/);
  assert.equal(fs.existsSync(path.join(f.root, "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json")), false);
});

test("META_PIPELINE_AUDIT rejects missing or mismatched audit proof before writes", t => {
  const missing = fixture(t);
  missing.request.approval.type = "META_PIPELINE_AUDIT";
  assert.throws(() => registerReviewedExamV2({ root: missing.root, request: missing.request, write: true }), /proof required/);
  assert.equal(fs.existsSync(path.join(missing.root, "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json")), false);

  const mismatched = fixture(t);
  attachMetaPipelineAudit(mismatched);
  mismatched.request.items[0].after.crossConceptKeys = [];
  const before = fs.readFileSync(path.join(mismatched.root, META));
  assert.throws(() => registerReviewedExamV2({ root: mismatched.root, request: mismatched.request, write: true }), /registration binding mismatch/);
  assert.deepEqual(fs.readFileSync(path.join(mismatched.root, META)), before);
  assert.equal(fs.existsSync(path.join(mismatched.root, "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json")), false);
});

for (const [name, mutate, error] of [
  ["wrong before", f => { f.request.items[0].before.standardCourse = "wrong"; }, /before mismatch/],
  ["wrong source blob", f => { f.request.expectedSourceBlobSha1 = "0".repeat(40); }, /blob drift/],
  ["missing UID", f => { f.request.items = []; }, /denominator/],
  ["duplicate UID", f => { f.request.items.push(f.request.items[0]); }, /duplicate request UID/],
  ["wrong ordinal", f => { f.request.items[0].sourceOrdinal = 2; }, /ordinal mismatch/],
  ["missing evidence", f => { f.request.approval.evidenceRefs[0].sha256 = "0".repeat(64); }, /evidence missing\/drift/],
  ["outside canonical write", f => { f.request.registryChanges[0].path = "archive/exams/evil.js"; }, /collection\/match not allowed/],
  ["path traversal", f => { f.request.sourceArchiveFile = "../evil.js"; }, /unsafe path/],
  ["inactive template", f => { f.request.registryChanges.find(c => c.path.endsWith("taxonomy.json")).after.templates[0].status = "RETIRED"; }, /inactive\/missing TPL/],
  ["invalid parent", f => { f.request.registryChanges.find(c => c.path.endsWith("taxonomy.json")).after.templates[0].parentProblemTypeKey = "PT_MISSING"; }, /TPL parent missing/],
  ["binding missing", f => { f.request.registryChanges.find(c => c.path.endsWith("bindings.json")).after.bindings = []; }, /binding missing/],
  ["wrong source value", f => { f.request.items[0].after.difficultyBucket = 4; }, /source\/approved metadata parity/],
  ["protected student field", f => { f.request.items[0].after.solution = "rewrite"; }, /unapproved field/]
]) test(`reject ${name} before any write`, t => {
  const f = fixture(t); const original = fs.readFileSync(path.join(f.root, META));
  mutate(f);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), error);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), original);
  assert.equal(fs.existsSync(path.join(f.root, `${CANON}/packs/new-course/pack.json`)), false);
});

test("same requestId cannot be rewritten, and replay detects runtime corruption", t => {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const changed = structuredClone(f.request); changed.items[0].reason = "changed";
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: changed }), /different content/);
  const file = "archive/data/meta-foundation/runtime/new-course-v1.json";
  const rt = f.read(file); rt.records[0].L3 = "corrupt"; f.put(file, rt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /runtime drift/);
});

test("unused definitions can be added, revised, retired and deleted with before/evidence", t => {
  const f = fixture(t);
  const unused = { conditionKey: "COND_UNUSED", canonicalLabelKo: "사용 전 조건", definition: "근거", status: "ACTIVE" };
  f.change(`${CANON}/condition_registry.json`, "conditions", { conditionKey: "COND_UNUSED" }, null, unused);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const make = (id, before, after) => ({ ...f.request, requestId: id, registryChanges: [{ path: `${CANON}/condition_registry.json`, collection: "conditions", match: { conditionKey: "COND_UNUSED" }, before, after, evidenceRefs: f.evidenceRefs }],
    items: [{ ...f.request.items[0], before: Object.fromEntries(Object.keys(f.request.items[0].after).map(k => [k, f.read(META).records[0][k] ?? null])) }] });
  const revised = { ...unused, canonicalLabelKo: "수정한 조건" };
  registerReviewedExamV2({ root: f.root, request: make("revise", unused, revised), write: true });
  const retired = { ...revised, status: "RETIRED", replacedBy: "COND_NEW" };
  registerReviewedExamV2({ root: f.root, request: make("retire", revised, retired), write: true });
  registerReviewedExamV2({ root: f.root, request: make("delete", retired, null), write: true });
  assert.equal(f.read(`${CANON}/condition_registry.json`).conditions.some(c => c.conditionKey === "COND_UNUSED"), false);
  assert.equal(f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/delete.json").registryChanges[0].before.status, "RETIRED");
});

test("shared definitions cannot change another exam's approved meaning", t => {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const meta = f.read(META), row = meta.records[0];
  meta.records.push({ ...row, questionUid: "unrelated", sourceArchiveFile: "other.js" }); f.put(META, meta);
  const req = { ...f.request, requestId: "change-shared", registryChanges: [{ path: `${CANON}/condition_registry.json`, collection: "conditions", match: { conditionKey: "COND_NEW" }, before: f.read(`${CANON}/condition_registry.json`).conditions[0], after: { ...f.read(`${CANON}/condition_registry.json`).conditions[0], definition: "changed meaning" }, evidenceRefs: f.evidenceRefs }] };
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: req, write: true }), /out-of-scope approved UID: unrelated/);
});

test("a binding for another course alias of the same unit and PT does not change an approved row of the original course", t => {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const meta = f.read(META), row = meta.records[0];
  meta.records.push({ ...row, questionUid: "unrelated", sourceArchiveFile: "other.js", sourceOrdinal: 1 }); f.put(META, meta);
  const bindingsPath = "archive/data/meta-foundation/canonical/packs/new-course/bindings.json";
  const exact = f.read(bindingsPath).bindings[0];
  // The row of the original course is looked up by its exact course, so a binding of another alias is not its consumer.
  const alias = { ...exact, standardCourse: "다른 과정 표기" };
  const add = { ...f.request, requestId: "add-course-alias-binding", registryChanges: [{ path: bindingsPath, collection: "bindings",
    match: { curriculum: alias.curriculum, standardCourse: alias.standardCourse, standardUnitKey: alias.standardUnitKey, subUnitKey: alias.subUnitKey, problemTypeKey: alias.problemTypeKey },
    before: null, after: alias, evidenceRefs: f.evidenceRefs }],
  items: [{ ...f.request.items[0], before: Object.fromEntries(Object.keys(f.request.items[0].after).map(k => [k, f.read(META).records[0][k] ?? null])) }] };
  assert.equal(registerReviewedExamV2({ root: f.root, request: add, write: true }).status, "PASS");
  // Changing the exact binding of that course still counts as changing the unrelated approved row.
  const edit = { ...add, requestId: "edit-exact-binding", registryChanges: [{ path: bindingsPath, collection: "bindings",
    match: { curriculum: exact.curriculum, standardCourse: exact.standardCourse, standardUnitKey: exact.standardUnitKey, subUnitKey: exact.subUnitKey, problemTypeKey: exact.problemTypeKey },
    before: exact, after: { ...exact, L2: "다른 중단원" }, evidenceRefs: f.evidenceRefs }] };
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: edit, write: true }), /out-of-scope approved UID: unrelated/);
});

test("META_PIPELINE_AUDIT canonical promotions do not treat unrelated pending rows as approved consumers", t => {
  const f = fixture(t);
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true });
  const meta = f.read(META), pending = { ...meta.records[0], questionUid: "pending-outside", sourceArchiveFile: "other.js",
    sourceOrdinal: 1, reviewStatus: "review_required", metadataStatus: "registration_pending_semantic_review" };
  meta.records.push(pending);
  f.put(META, meta);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  assert.deepEqual(f.read(META).records.find(r => r.questionUid === "pending-outside"), pending);
});

test("existing CLI accepts v2 and repo-root without touching the working repository", t => {
  const f = fixture(t); f.put("request.json", f.request);
  const result = JSON.parse(execFileSync(process.execPath, [script, "--repo-root", f.root, "--request", "request.json", "--write"], { encoding: "utf8" }));
  assert.equal(result.status, "PASS");
  assert.equal(result.approvalType, "FINAL_QA");
});

test("extension compiles against the actual repository canonical packs, shards and master", t => {
  const f = fixture(t, "신규 선택과목", "2030");
  const repo = fileURLToPath(new URL("../", import.meta.url));
  fs.cpSync(path.join(repo, CANON), path.join(f.root, CANON), { recursive: true });
  fs.copyFileSync(path.join(repo, "archive/data/master_tables/js_archive_tag_master.json"), path.join(f.root, "archive/data/master_tables/js_archive_tag_master.json"));
  const before = f.read(`${CANON}/registry_index.json`).activePacks.length;
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.status, "PASS");
  assert.equal(f.read(`${CANON}/registry_index.json`).activePacks.length, before + 1);
});

test("catalog and Search verification checks target values after registration", t => {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  const catalogRow = { ...row, sourceFile: row.sourceArchiveFile, metadataConflicts: [] };
  // Archive2 catalog exposes L1/L2; the canonical Meta Foundation runtime is
  // the consumer projection for the deeper L3/L4 path.
  delete catalogRow.L3; delete catalogRow.L4;
  f.put("archive/data/archive2-catalog.json", { records: [catalogRow] });
  f.put("archive/question-index.js", `window.questionIndex=${JSON.stringify([{ ...row, sourceFile: row.sourceArchiveFile, course: row.standardCourse }])};`);
  // This fixture verifies the Consumer/Search value comparator only. The
  // manifest-backed projection path is covered by the repository integration
  // flow and requires the full canonical input bundle.
  const records = f.read(META).records;
  const runtime = f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records;
  verifyConsumerValues(f.root, records, runtime, f.read("archive/data/archive2-catalog.json"));
  f.put("archive/question-index.js", "window.questionIndex=[];");
  assert.throws(() => verifyConsumerValues(f.root, records, runtime, f.read("archive/data/archive2-catalog.json")), /Search UID source missing/);
});

test("24 UID request preserves unrelated approved metadata and all student fields", t => {
  const f = fixture(t, "대수");
  const bank = Array.from({ length: 24 }, (_, i) => ({ ...f.q, id: i + 1, image: [15, 18].includes(i + 1) ? `existing-q${i + 1}.png` : "" }));
  const bytes = `window.questions=${JSON.stringify(bank)};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  const rows = bank.map((q, i) => ({ questionUid: `uid${i + 1}`, sourceArchiveFile: f.request.sourceArchiveFile, sourceOrdinal: i + 1,
    sourceFingerprint: hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image })), reviewStatus: "review_required" }));
  const unrelated = { questionUid: "outside", sourceArchiveFile: "other.js", sourceOrdinal: 1, reviewStatus: "reviewed_pass", metadataStatus: "approved_semantic_review", custom: { preserve: true } };
  f.put(META, { records: [...rows, unrelated] });
  f.put("archive/data/question_identity_map.json", { records: rows });
  f.request.expectedQuestionCount = 24;
  f.request.expectedSourceBlobSha1 = blob(bytes);
  f.request.items = rows.map(row => ({ ...structuredClone(f.request.items[0]), questionUid: row.questionUid, sourceOrdinal: row.sourceOrdinal,
    before: Object.fromEntries(Object.keys(f.request.items[0].after).map(k => [k, row[k] ?? null])) }));
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 24);
  assert.deepEqual(f.read(META).records.find(r => r.questionUid === "outside"), unrelated);
  assert.equal(fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`), "utf8"), bytes);
});

test("replace an in-use template and remove its old definition in the same approved exam request", t => {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const base = `${CANON}/packs/new-course/taxonomy.json`, old = f.read(base).templates[0];
  const replacement = { ...old, templateKey: "TPL_REPLACEMENT", canonicalLabelKo: "수정한 풀이 구조" };
  f.request.requestId = "replace-used-template";
  f.request.registryChanges = [
    { path: base, collection: "templates", match: { templateKey: replacement.templateKey }, before: null, after: replacement, evidenceRefs: f.evidenceRefs },
    { path: base, collection: "templates", match: { templateKey: old.templateKey }, before: old, after: null, evidenceRefs: f.evidenceRefs }
  ];
  f.q.templateKey = replacement.templateKey;
  const bytes = `window.questions=${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, bytes);
  f.request.expectedSourceBlobSha1 = blob(bytes);
  const current = f.read(META).records[0];
  f.request.items[0].after.templateKey = replacement.templateKey;
  f.request.items[0].after.L4 = replacement.canonicalLabelKo;
  f.request.items[0].before = Object.fromEntries(Object.keys(f.request.items[0].after).map(k => [k, current[k] ?? null]));
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.deepEqual(f.read(base).templates.map(t => t.templateKey), [replacement.templateKey]);
  assert.equal(f.read(META).records[0].templateKey, replacement.templateKey);
});

// ---- Generated extension keys (EXT-*): accepted only when registered, GENERATED_ACTIVE, unpromoted, parented ----
const EXT_INDEX = "archive/data/archive2-extension-keys.json";
const EXT_REGISTRY = "archive/data/meta-foundation/extensions/similar-high/x.registry.json";

// The mutate* hooks change the registry entry / index definition / registry file before they are written.
function extensionFixture(t, { cross = ["EXT-CROSS-X"], cond = [], mutateEntry, mutateDefinition, mutateRegistry, scope = {}, registerKinds = {} } = {}) {
  const f = fixture(t, "확률과통계", "2015");
  const entry = { key: "EXT-CROSS-X", kind: "CROSS", status: "GENERATED_ACTIVE", canonicalRpmPromotion: false, label: "확장 연결 개념",
    parent: { conceptKey: "CC_NEW" }, standardCourse: "확률과통계", curriculumKey: "2015", ...scope };
  const condEntry = { key: "EXT-COND-X", status: "GENERATED_ACTIVE", canonicalRpmPromotion: false, labelKo: "확장 조건", parentKey: "COND_NEW",
    standardCourse: "확률과통계", curriculum: "2015", ...scope };
  mutateEntry?.(entry, condEntry);
  const registry = { schemaVersion: "similar-high-generated-extension-registry-v1", status: "GENERATED_ACTIVE", extensions: [entry], generatedConditions: [condEntry] };
  mutateRegistry?.(registry);
  f.put(EXT_REGISTRY, registry);
  const definitions = [
    { key: "EXT-CROSS-X", kind: registerKinds.cross ?? "cross", status: "GENERATED_ACTIVE", canonicalPromoted: false, file: EXT_REGISTRY },
    { key: "EXT-COND-X", kind: registerKinds.cond ?? "cond", status: "GENERATED_ACTIVE", canonicalPromoted: false, file: EXT_REGISTRY }
  ];
  if (mutateDefinition) for (const definition of definitions) mutateDefinition(definition);
  f.put(EXT_INDEX, { schemaVersion: "archive2-extension-keys-v1", status: "DERIVED_READ_ONLY", definitions });
  setItemKeys(f, { crossConceptKeys: ["CC_NEW", ...cross], conditionKeys: [...cond] });
  return f;
}

// Keep the source JS, its blob hash and the request item in agreement (the registrar binds all three).
function setItemKeys(f, fields) {
  Object.assign(f.q, fields);
  Object.assign(f.request.items[0].after, fields);
  const text = `window.questions = ${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, text);
  f.request.expectedSourceBlobSha1 = blob(text);
}

test("EXT: a registered GENERATED_ACTIVE extension CrossConcept and Condition register without canonical promotion", t => {
  const f = extensionFixture(t, { cond: ["EXT-COND-X"] });
  const before = { index: fs.readFileSync(path.join(f.root, EXT_INDEX)), registry: fs.readFileSync(path.join(f.root, EXT_REGISTRY)) };
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dry.totalQuestions, 1);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.runtimeMaterialized, 1);
  const row = f.read(META).records[0];
  assert.deepEqual(row.crossConceptKeys, ["CC_NEW", "EXT-CROSS-X"]);
  assert.deepEqual(row.conditionKeys, ["EXT-COND-X"]);
  assert.equal(row.reviewStatus, "reviewed_pass");
  // The extension never enters a canonical registry, the compiled registries, the index or its source registry.
  const registries = result.plannedPaths.filter(file => file.startsWith("archive/data/meta-foundation/") && /\/(canonical|compiled)\//.test(file));
  assert.ok(registries.length > 0, "canonical/compiled registries were written for the fixture");
  for (const file of registries) assert.equal(/EXT-/.test(fs.readFileSync(path.join(f.root, file), "utf8")), false, `${file} must not mention an extension key`);
  assert.deepEqual(fs.readFileSync(path.join(f.root, EXT_INDEX)), before.index);
  assert.deepEqual(fs.readFileSync(path.join(f.root, EXT_REGISTRY)), before.registry);
  // The receipt records exactly which extension definitions backed the registration.
  const receipt = f.read(`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.json`);
  assert.deepEqual(receipt.generatedExtensionKeys.map(use => [use.key, use.kind, use.canonicalRpmPromotion, use.parentKey, use.registryPath, use.questionUids]), [
    ["EXT-COND-X", "cond", false, "COND_NEW", EXT_REGISTRY, ["uid1"]],
    ["EXT-CROSS-X", "cross", false, "CC_NEW", EXT_REGISTRY, ["uid1"]]
  ]);
  assert.equal(receipt.generatedExtensionKeys[0].registrySha256, hash(before.registry));
  // The runtime pack carries the same keys, and replay still verifies.
  const runtime = f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records[0];
  assert.deepEqual(runtime.crossConceptKeys, ["CC_NEW", "EXT-CROSS-X"]);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("EXT: a canonical-only request does not need the extension index at all", t => {
  const f = fixture(t);
  assert.equal(fs.existsSync(path.join(f.root, EXT_INDEX)), false);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

test("EXT: an extension key missing from the index is refused", t => {
  const f = extensionFixture(t, { cross: ["EXT-CROSS-NOT-REGISTERED"] });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /unregistered extension key \(crossConceptKeys\): EXT-CROSS-NOT-REGISTERED/);
});

test("EXT: a missing extension index refuses every extension key", t => {
  const f = extensionFixture(t);
  fs.rmSync(path.join(f.root, EXT_INDEX));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /extension key index missing/);
});

for (const [name, options, pattern] of [
  ["index status other than GENERATED_ACTIVE", { mutateDefinition: d => { d.status = "GENERATED_ACTIVE_CREATOR_CANDIDATE_ONLY"; } }, /is not GENERATED_ACTIVE/],
  ["index status missing", { mutateDefinition: d => { delete d.status; } }, /is not GENERATED_ACTIVE/],
  ["index claiming canonical promotion", { mutateDefinition: d => { d.canonicalPromoted = true; } }, /canonical promotion/],
  ["index omitting the promotion flag", { mutateDefinition: d => { delete d.canonicalPromoted; } }, /canonical promotion/],
  ["index kind that does not fit the field", { registerKinds: { cross: "cond" } }, /kind mismatch/],
  ["index kind conflict", { mutateDefinition: d => { d.kindConflicts = ["l4"]; } }, /kind mismatch/],
  ["source registry outside the extensions directory", { mutateDefinition: d => { d.file = "archive/data/meta-foundation/canonical/condition_registry.json"; } }, /not defined in archive\/data\/meta-foundation\/extensions\//],
  ["source registry that is not GENERATED_ACTIVE", { mutateRegistry: r => { r.status = "SUPERSEDED"; } }, /registry is not GENERATED_ACTIVE/],
  ["source entry status other than GENERATED_ACTIVE", { mutateEntry: e => { e.status = "GENERATED_CANDIDATE_BRANCH_ONLY"; } }, /entry is not GENERATED_ACTIVE/],
  ["source entry canonicalRpmPromotion true", { mutateEntry: e => { e.canonicalRpmPromotion = true; } }, /canonicalRpmPromotion false/],
  ["source entry canonicalRpmPromotion missing", { mutateEntry: e => { delete e.canonicalRpmPromotion; } }, /canonicalRpmPromotion false/],
  ["source entry of the wrong kind", { mutateEntry: e => { e.kind = "COND"; } }, /registry kind mismatch/],
  ["source entry without a parent", { mutateEntry: e => { delete e.parent; } }, /parent is not an ACTIVE canonical cross/],
  ["source entry with a parent that is not canonical", { mutateEntry: e => { e.parent = { conceptKey: "CC_DOES_NOT_EXIST" }; } }, /parent is not an ACTIVE canonical cross/],
  ["source entry whose parent is itself an extension key", { mutateEntry: e => { e.parent = { conceptKey: "EXT-CROSS-OTHER" }; } }, /parent is not an ACTIVE canonical cross/],
  ["source entry for another curriculum", { scope: { curriculumKey: "2022" } }, /scope mismatch/],
  ["source entry for another course", { scope: { standardCourse: "수학II" } }, /scope mismatch/],
  ["source entry without a scope", { mutateEntry: e => { delete e.standardCourse; } }, /scope mismatch/],
  ["source registry defining the key twice", { mutateRegistry: r => { r.extensions.push({ ...r.extensions[0] }); } }, /exactly once/],
  ["source registry that does not define the indexed key", { mutateRegistry: r => { r.extensions[0].key = "EXT-CROSS-RENAMED"; } }, /exactly once/]
]) {
  test(`EXT: refused - ${name}`, t => {
    const f = extensionFixture(t, options);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), pattern);
    assert.equal(f.read(META).records[0].reviewStatus, "review_required", "nothing is written when an extension key is refused");
  });
}

test("EXT: a condition key is refused for the same reasons (parent must be an ACTIVE canonical Condition)", t => {
  const f = extensionFixture(t, { cross: [], cond: ["EXT-COND-X"], mutateEntry: (_, c) => { c.parentKey = "COND_DOES_NOT_EXIST"; } });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /parent is not an ACTIVE canonical cond/);
  const g = extensionFixture(t, { cross: [], cond: ["EXT-COND-X"], mutateEntry: (_, c) => { c.canonicalRpmPromotion = true; } });
  assert.throws(() => registerReviewedExamV2({ root: g.root, request: g.request }), /canonicalRpmPromotion false/);
});

// The catalog builder only knows canonical concept/condition keys, so it flags a record that carries a registered extension key
// with `foundationTaxonomy` and keeps it out of the strict advanced lane (never promoted). --verify-projection must accept exactly that.
function registeredExtensionConsumer(t, conflicts) {
  const f = extensionFixture(t, { cond: ["EXT-COND-X"] });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  const catalogRow = { ...row, sourceFile: row.sourceArchiveFile, metadataConflicts: conflicts };
  delete catalogRow.L3; delete catalogRow.L4;
  f.put("archive/question-index.js", `window.questionIndex=${JSON.stringify([{ ...row, sourceFile: row.sourceArchiveFile, course: row.standardCourse }])};`);
  const records = f.read(META).records;
  const runtime = f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records;
  return { f, records, runtime, catalog: { records: [catalogRow] } };
}

test("EXT: --verify-projection accepts the foundationTaxonomy flag of a registered extension record and reports the lane", t => {
  const { f, records, runtime, catalog } = registeredExtensionConsumer(t, ["foundationTaxonomy"]);
  assert.deepEqual(verifyConsumerValues(f.root, records, runtime, catalog), { canonical: 1, usableMetaLane: 0, generatedExtension: 1 });
});

test("EXT: the foundationTaxonomy waiver does not hide other conflicts or an extension that stopped being valid", t => {
  const { f, records, runtime, catalog } = registeredExtensionConsumer(t, ["foundationTaxonomy", "templateKey"]);
  assert.throws(() => verifyConsumerValues(f.root, records, runtime, catalog), /Consumer metadata conflict/);
  const plain = registeredExtensionConsumer(t, ["foundationTaxonomy"]);
  // A canonical-only record keeps the previous behaviour: any foundationTaxonomy conflict blocks.
  const canonicalOnly = structuredClone(plain.records); canonicalOnly[0].crossConceptKeys = ["CC_NEW"]; canonicalOnly[0].conditionKeys = [];
  const canonicalRuntime = structuredClone(plain.runtime); canonicalRuntime[0].crossConceptKeys = ["CC_NEW"]; canonicalRuntime[0].conditionKeys = [];
  const canonicalCatalog = structuredClone(plain.catalog); canonicalCatalog.records[0].crossConceptKeys = ["CC_NEW"]; canonicalCatalog.records[0].conditionKeys = [];
  assert.throws(() => verifyConsumerValues(plain.f.root, canonicalOnly, canonicalRuntime, canonicalCatalog), /Consumer metadata conflict/);
  // The extension was demoted after registration: the waiver re-validates it and refuses.
  const index = plain.f.read(EXT_INDEX); index.definitions[0].status = "SUPERSEDED_NOT_TO_RELEASE"; plain.f.put(EXT_INDEX, index);
  assert.throws(() => verifyConsumerValues(plain.f.root, plain.records, plain.runtime, plain.catalog), /is not GENERATED_ACTIVE/);
});

test("EXT: extension keys are not accepted for PT/TPL, and canonical keys keep the previous refusal", t => {
  const f = extensionFixture(t);
  setItemKeys(f, { problemTypeKey: "EXT-CROSS-X" });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /inactive\/missing PT: EXT-CROSS-X/);
  const g = fixture(t);
  setItemKeys(g, { crossConceptKeys: ["CC_NEW", "CC_NOT_REGISTERED"] });
  assert.throws(() => registerReviewedExamV2({ root: g.root, request: g.request }), /inactive\/missing crossConceptKeys: CC_NOT_REGISTERED/);
});

// FINAL_QA source-only rebind (2026-11-02): a receipt whose sourceRawSha256 no longer matches the catalog because only
// non-question bytes (solution figures) changed is re-bound without changing any metadata value.
function sourceRebindFixture(t, mutateSource = q => ({ ...q, solutionImage: "solution/q1.svg" })) {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receiptPath = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json";
  const receiptRef = { path: receiptPath, sha256: hash(fs.readFileSync(path.join(f.root, receiptPath))) };
  const text = `window.questions = ${JSON.stringify([mutateSource(f.q)])};\n`;
  f.put("archive/exams/fixture/exam.js", text);
  const request = { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", requestId: "test-source-rebind", examUid: "exam1",
    sourceArchiveFile: "fixture/exam.js", expectedSourceBlobSha1: blob(text), expectedQuestionCount: 1,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "fixture-reviewer", evidenceRefs: [...f.evidenceRefs, receiptRef], sourceRebind: { priorReceiptRef: receiptRef } },
    items: [{ questionUid: "uid1", sourceOrdinal: 1, before: {}, after: {}, reason: "source-only rebind", evidenceRefs: f.evidenceRefs }] };
  return { ...f, request, receiptRef };
}

test("source rebind re-binds the receipt to changed non-question bytes and keeps every metadata value", t => {
  const f = sourceRebindFixture(t);
  const before = f.read(META).records[0];
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.status, "PASS");
  const after = f.read(META).records[0];
  const changed = Object.keys({ ...before, ...after }).filter(k => JSON.stringify(before[k]) !== JSON.stringify(after[k])).sort();
  assert.deepEqual(changed, ["approvalEvidence", "metadataRevision"]);
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-source-rebind.json");
  assert.equal(receipt.sourceRawSha256, hash(fs.readFileSync(path.join(f.root, "archive/exams/fixture/exam.js"))));
  assert.notEqual(receipt.sourceRawSha256, f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json").sourceRawSha256);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true, "re-run is a no-op replay");
});

// Rewrites the prior receipt (evidence file) and re-binds the request to its new SHA-256.
function retargetPriorReceipt(f, mutate) {
  const full = path.join(f.root, f.receiptRef.path);
  const receipt = JSON.parse(fs.readFileSync(full, "utf8")); mutate(receipt);
  fs.writeFileSync(full, j(receipt));
  const ref = { path: f.receiptRef.path, sha256: hash(fs.readFileSync(full)) };
  f.request.approval.evidenceRefs = [...f.evidenceRefs, ref]; f.request.approval.sourceRebind.priorReceiptRef = ref;
}

test("source rebind tolerates a later difficulty intake only with the exact difficulty5 value shapes", t => {
  const intake = { difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL" };
  const prepare = patch => {
    const f = sourceRebindFixture(t);
    retargetPriorReceipt(f, receipt => { receipt.appliedRecords[0].difficultyBucket = null; });
    const meta = f.read(META); Object.assign(meta.records[0], intake, patch); f.put(META, meta);
    return f;
  };
  const good = prepare({});
  assert.equal(registerReviewedExamV2({ root: good.root, request: good.request }).status, "PASS");
  for (const bad of [{ difficultyConfidence: "certain" }, { difficultyBoundaryFlag: "B56" }, { legacyLevelCompatibility: "STRONG_CONFLICT" }, { difficultyBucket: 9 }]) {
    const f = prepare(bad);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /not a valid difficulty5 intake result/);
  }
});

test("source rebind refuses a prior receipt that is not the registration of the current approved rows", t => {
  const renamed = sourceRebindFixture(t);
  retargetPriorReceipt(renamed, receipt => { receipt.requestId = "some-other-request"; });
  assert.throws(() => registerReviewedExamV2({ root: renamed.root, request: renamed.request }), /not the registration of the current approved rows/);
  const unlinked = sourceRebindFixture(t);
  const meta = unlinked.read(META); meta.records[0].approvalEvidence = []; unlinked.put(META, meta);
  assert.throws(() => registerReviewedExamV2({ root: unlinked.root, request: unlinked.request }), /not the registration of the current approved rows/);
});

test("source rebind refuses changed question text, value changes, drifted metadata and an unneeded rebind", t => {
  const text = sourceRebindFixture(t, q => ({ ...q, content: "바뀐 지문" }));
  assert.throws(() => registerReviewedExamV2({ root: text.root, request: text.request }), /fingerprint drift/);
  const solution = sourceRebindFixture(t, q => ({ ...q, solution: "바뀐 해설" }));
  assert.throws(() => registerReviewedExamV2({ root: solution.root, request: solution.request }), /fingerprint drift/);
  const values = sourceRebindFixture(t);
  values.request.items[0].before = { level: "중" }; values.request.items[0].after = { level: "하" };
  assert.throws(() => registerReviewedExamV2({ root: values.root, request: values.request }), /must not change values/);
  const drift = sourceRebindFixture(t);
  const meta = drift.read(META); meta.records[0].L3 = "다른 유형"; drift.put(META, meta);
  assert.throws(() => registerReviewedExamV2({ root: drift.root, request: drift.request }), /differs from prior receipt/);
  const same = sourceRebindFixture(t, q => q);
  assert.throws(() => registerReviewedExamV2({ root: same.root, request: same.request }), /sourceRebind unnecessary/);
  const typed = sourceRebindFixture(t);
  typed.request.approval.type = "REVIEW2"; typed.request.approval.reviewPassCount = 2;
  assert.throws(() => registerReviewedExamV2({ root: typed.root, request: typed.request }), /sourceRebind requires FINAL_QA/);
});

// ---- SOP_v1.2 META_AUDIT_ATOMIC_PACKAGE / approval v4 ----
const SOP_V12_EVIDENCE_ROOT = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
const SOP_V12_STUDENT_FIELDS = ["id", "questionType", "content", "choices", "answer", "solution", "image", "images", "figureSvg", "solutionImage", "solutionFigureSvg", "layoutTag", "wide"];

function sopV12Refs(f) {
  const ref = relative => ({ path: relative, sha256: hash(fs.readFileSync(path.join(f.root, relative))) });
  const proof = f.request.approval.metaPipelineAudit;
  const auditRef = ref(proof.auditPackageRef.path);
  const manifestRef = ref(proof.manifestRef.path);
  const sourceParityRef = ref(proof.sourceParityRef.path);
  const correctiveReviewRef = ref(proof.correctiveReviewRef.path);
  const parentRef = ref(f.request.items[0].basicScopeParentRef.path);
  const evidenceRefs = [...f.evidenceRefs, auditRef, manifestRef, sourceParityRef, correctiveReviewRef, parentRef];
  f.request.approval.evidenceRefs = evidenceRefs;
  f.request.approval.metaPipelineAudit = { ...proof, auditPackageRef: auditRef, manifestRef, sourceParityRef, correctiveReviewRef };
  f.request.items = f.request.items.map(item => ({ ...item, basicScopeParentRef: parentRef, evidenceRefs }));
  return { auditRef, manifestRef, sourceParityRef, correctiveReviewRef, parentRef };
}

function attachSopV12(f, options = {}) {
  const { driveSourceHashDrift = false, difficultyDebt = false, legacyAssignment = null, preserveConditionKeys = null, auditEdit, manifestEdit, reviewEdit, parityEdit } = options;
  const source = f.request.sourceArchiveFile;
  const requestId = f.request.requestId;
  const sourceDriveId = "fixture-sop-v12-drive";
  const examTitle = "픽스처 사람이 읽는 시험지명";
  const examSlug = path.basename(source, ".js");

  const conditionKeys = preserveConditionKeys ?? [];
  f.q = { ...f.q, conditionKeys, score: 3, questionType: "객관식" };
  if (difficultyDebt) delete f.q.difficultyBucket;
  const sourceText = `window.questions = ${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${source}`, sourceText);
  f.request.expectedSourceBlobSha1 = blob(sourceText);
  const sourceBytes = fs.readFileSync(path.join(f.root, `archive/exams/${source}`));
  const productionSha = hash(sourceBytes);
  const declaredSha = driveSourceHashDrift ? "e".repeat(64) : productionSha;

  if (!conditionKeys.length) f.request.registryChanges = f.request.registryChanges.filter(change => change.collection !== "conditions");
  const item = f.request.items[0];
  const metadata = f.read(META);
  const current = metadata.records[0];
  current.difficultyBucket = difficultyDebt ? "중" : 3;
  current.conditionKeys = conditionKeys;
  const originalAssignment = legacyAssignment
    ? { standardUnitKey: legacyAssignment.standardUnitKey, subUnitKey: legacyAssignment.subUnitKey }
    : { standardUnitKey: f.q.standardUnitKey, subUnitKey: f.q.subUnitKey };
  const correctedAssignment = { standardUnitKey: item.after.standardUnitKey, subUnitKey: item.after.subUnitKey };
  if (difficultyDebt) current.fieldStatus = { ...(current.fieldStatus || {}), difficulty: "approved_source" };
  f.put(META, metadata);
  delete item.after.difficultyBucket;
  delete item.before.difficultyBucket;
  if (difficultyDebt) { item.after.difficultyBucket = null; item.before.difficultyBucket = "중"; }
  item.after.conditionKeys = conditionKeys;
  item.before.conditionKeys = conditionKeys;
  item.after.level = f.q.level;
  item.before.level = current.level ?? null;
  item.after.L1 = f.q.standardUnit;
  item.after.L2 = f.q.subUnit;
  item.before.L1 = null;
  item.before.L2 = null;

  const parentPath = `${SOP_V12_EVIDENCE_ROOT}/${requestId}.parent-labels.json`;
  f.put("archive/data/basic-scope-parent-links.json", { records: [] });
  f.put(parentPath, { schemaVersion: "archive-meta-pipeline-parent-label-evidence-v1",
    sourcePath: "archive/data/basic-scope-parent-links.json",
    sourceSha256: hash(fs.readFileSync(path.join(f.root, "archive/data/basic-scope-parent-links.json"))),
    records: [{ curriculumKey: item.after.curriculum, courseKey: item.after.courseKey, standardUnitKey: correctedAssignment.standardUnitKey,
      subUnitKey: correctedAssignment.subUnitKey, L1: f.q.standardUnit, L2: f.q.subUnit }], derivedRecords: [] });

  const audit = { manifestType: "META_AUDIT_ATOMIC_PACKAGE", examTitle, examSlug, sourceDriveId,
    sourceFileSha256: declaredSha, standardCourse: item.after.standardCourse, primaryPack: "NEW_COURSE",
    totalQuestionsAudited: 1, auditPassedCount: 1, holdCount: 0,
    auditStatus: "AUDIT_COMPLETE_100_PERCENT_PASS", sopVersion: "SOP_v1.2", auditedAt: "2026-11-04T00:00:00Z",
    auditRecords: [{ questionNumber: 1, sourceQuestionId: 1, auditStatus: "PASS", packIsolationPassed: true,
      designatedPack: "NEW_COURSE", verifiedPrimaryTaxonomy: "PT_NEW", verifiedTemplatePattern: "TPL_NEW",
      verifiedCrossConcepts: ["CC_NEW"], curriculumAlignment: { unitKey: originalAssignment.standardUnitKey, subUnitKey: originalAssignment.subUnitKey },
      levelVerbatimPreserved: "중", difficultyRank: 3,
      difficultyReasonTrace: "SOP_v1.2 감사 설명이며 원문 발췌가 아니다.",
      solutionStepCountVerified: 5, zeroHoldCompliance: true, zeroStubCertified: true }] };
  auditEdit?.(audit, f);

  const manifest = { manifestType: "COURIER_INTAKE_MANIFEST", examTitle, examSlug, sourceDriveId,
    sourceFileSha256: declaredSha, standardCourse: item.after.standardCourse, targetPack: "NEW_COURSE",
    totalQuestionsToRegister: 1, readyForRegistrationCount: 1, pipelineStatus: "READY_FOR_COURIER_REGISTRATION",
    sopVersion: "SOP_v1.2", registeredAt: "2026-11-04T00:00:00Z",
    recordsToBind: [{ questionNumber: 1, sourceQuestionId: 1, score: 3, level: "중", difficulty: 3,
      primaryTaxonomy: "PT_NEW", templatePattern: "TPL_NEW", pack: "NEW_COURSE", crossConcepts: ["CC_NEW"],
      unitKey: originalAssignment.standardUnitKey, subUnitKey: originalAssignment.subUnitKey, answer: f.q.answer, questionType: f.q.questionType,
      choicesCount: f.q.choices.length, zeroStubCertified: true }] };
  manifestEdit?.(manifest, f);

  const review = { schemaVersion: "archive-meta-pipeline-sop-v12-corrective-review-v1", sopVersion: "SOP_v1.2",
    examTitle, examSlug, sourceArchiveFile: source, sourceFileDriveId: sourceDriveId,
    originalDeclaredSourceSha256: declaredSha, excerptBasis: "CURRENT_PRODUCTION_SOURCE",
    driveSourceSha256: productionSha, productionSourceSha256: productionSha, sourceHashDrift: declaredSha !== productionSha,
    reviewer: { id: "fixture-root-reviewer", role: "ROOT" }, reviewedAt: "2026-11-04T00:00:00Z", questionCount: 1,
    rows: [{ questionUid: item.questionUid, sourceOrdinal: 1, auditQuestionNumber: 1,
      problemTypeKey: "PT_NEW", templateKey: "TPL_NEW", crossConceptKeys: ["CC_NEW"],
      standardUnitKey: originalAssignment.standardUnitKey, subUnitKey: originalAssignment.subUnitKey,
      originalAssignment, correctedAssignment, assignmentCorrectionReason: legacyAssignment?.correctionReason ?? null,
      sourceTextExcerpt: f.q.content, solutionDecisiveExcerpt: f.q.solution,
      visualEvidence: { assetChecked: false, visualType: "NONE" } }] };
  reviewEdit?.(review, f, audit);

  const studentPayloadHash = hash(stable(Object.fromEntries(SOP_V12_STUDENT_FIELDS.map(field =>
    [field, Object.hasOwn(f.q, field) ? f.q[field] : null]))));
  const sourceParity = { schemaVersion: "archive-meta-pipeline-source-parity-v1",
    status: "EXACT_STUDENT_VISIBLE_PARITY", sourceFileDriveId: sourceDriveId,
    parityBasis: "EXACT_SOURCE_SHA256",
    originalDeclaredSourceSha256: declaredSha,
    driveSourceSha256: productionSha, productionSourceSha256: productionSha,
    productionSourceBlobSha1: f.request.expectedSourceBlobSha1, sourceArchiveFile: source,
    studentFields: SOP_V12_STUDENT_FIELDS, questionCount: 1,
    records: [{ sourceOrdinal: 1, questionId: 1, questionUid: item.questionUid,
      driveSourceTextExcerptMatched: false, driveSolutionExcerptMatched: false,
      driveStudentPayloadSha256: studentPayloadHash, productionStudentPayloadSha256: studentPayloadHash,
      studentPayloadEqual: true }] };
  parityEdit?.(sourceParity, f);

  const auditPath = `${SOP_V12_EVIDENCE_ROOT}/${requestId}.audit.json`;
  const manifestPath = `${SOP_V12_EVIDENCE_ROOT}/${requestId}.manifest.json`;
  const reviewPath = `${SOP_V12_EVIDENCE_ROOT}/${requestId}.corrective-review.json`;
  const parityPath = `${SOP_V12_EVIDENCE_ROOT}/${requestId}.source-parity.json`;
  f.put(auditPath, audit);
  f.put(manifestPath, manifest);
  f.put(reviewPath, review);
  f.put(parityPath, sourceParity);
  item.basicScopeParentRef = { path: parentPath, sha256: hash(fs.readFileSync(path.join(f.root, parentPath))) };
  f.request.approval = { type: "META_PIPELINE_AUDIT", metadataReviewed: true, approvedBy: "fixture-root-reviewer",
    evidenceRefs: [], metaPipelineAudit: {
      schemaVersion: "meta-pipeline-audit-approval-v4", sourceFileDriveId: sourceDriveId,
      auditPackageRef: { path: auditPath, sha256: hash(fs.readFileSync(path.join(f.root, auditPath))) },
      manifestRef: { path: manifestPath, sha256: hash(fs.readFileSync(path.join(f.root, manifestPath))) },
      sourceParityRef: { path: parityPath, sha256: hash(fs.readFileSync(path.join(f.root, parityPath))) },
      correctiveReviewRef: { path: reviewPath, sha256: hash(fs.readFileSync(path.join(f.root, reviewPath))) },
      unreviewedFields: difficultyDebt ? [{ field: "difficultyBucket", status: "EVIDENCE_DEBT",
        questionUids: [item.questionUid],
        reason: "The SOP_v1.2 audit reports a difficulty rank, not an audited 1-5 bucket; no bucket is inferred." }] : [],
      existingConceptReviews: [] } };
  const refs = sopV12Refs(f);
  return { audit, manifest, review, sourceParity, refs };
}

function rewriteSopV12Doc(f, refs, kind, mutate) {
  const target = refs[kind];
  const doc = f.read(target.path);
  mutate(doc);
  f.put(target.path, doc);
  return sopV12Refs(f);
}

test("SOP_v1.2 META_AUDIT_ATOMIC_PACKAGE registers through approval v4 with a corrective review", t => {
  const f = fixture(t);
  attachSopV12(f);
  const sourcePath = `archive/exams/${f.request.sourceArchiveFile}`;
  const before = fs.readFileSync(path.join(f.root, sourcePath));
  const auditBefore = fs.readFileSync(path.join(f.root, f.request.approval.metaPipelineAudit.auditPackageRef.path));
  const manifestBefore = fs.readFileSync(path.join(f.root, f.request.approval.metaPipelineAudit.manifestRef.path));
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dry.totalQuestions, 1);
  assert.deepEqual(fs.readFileSync(path.join(f.root, sourcePath)), before);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.approvalType, "META_PIPELINE_AUDIT");
  const row = f.read(META).records[0];
  assert.equal(row.metadataApprovalType, "META_PIPELINE_AUDIT");
  assert.equal(row.problemTypeKey, "PT_NEW");
  assert.equal(row.templateKey, "TPL_NEW");
  assert.equal(Object.hasOwn(row.fieldStatus, "condition"), false);
  assert.equal(Object.hasOwn(row.fieldStatus, "difficulty"), false);
  const receipt = f.read(`${SOP_V12_EVIDENCE_ROOT}/${f.request.requestId}.json`);
  assert.equal(receipt.metaPipelineAudit.inputAuditVariant, "sop_v12_corrective_review");
  assert.equal(receipt.metaPipelineAudit.sopV12CorrectiveReview.templateInflation, "NOT_REPORTED_IN_SOURCE_SCHEMA");
  assert.equal(receipt.metaPipelineAudit.sopV12CorrectiveReview.conditionEvidence, "NOT_PRESENT_IN_SOURCE_SCHEMA");
  assert.equal(receipt.metaPipelineAudit.sopV12CorrectiveReview.sourceHashDrift, false);
  assert.equal(receipt.metaPipelineAudit.sopV12CorrectiveReview.originalDeclaredSourceSha256,
    receipt.metaPipelineAudit.sopV12CorrectiveReview.productionSourceSha256);
  assert.equal(Object.hasOwn(receipt.metaPipelineAudit.sopV12CorrectiveReview, "newTemplatesCreated"), false);
  assert.deepEqual(fs.readFileSync(path.join(f.root, sourcePath)), before);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.request.approval.metaPipelineAudit.auditPackageRef.path)), auditBefore);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.request.approval.metaPipelineAudit.manifestRef.path)), manifestBefore);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("SOP_v1.2 approval v4 keeps the declared SHA while current source bytes differ only through the review", t => {
  const f = fixture(t);
  const attached = attachSopV12(f, { driveSourceHashDrift: true });
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.status, "PASS");
  const receipt = f.read(`${SOP_V12_EVIDENCE_ROOT}/${f.request.requestId}.json`);
  const sop = receipt.metaPipelineAudit.sopV12CorrectiveReview;
  assert.equal(sop.sourceHashDrift, true);
  assert.equal(sop.originalDeclaredSourceSha256, "e".repeat(64));
  assert.equal(sop.driveSourceSha256, hash(fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`))));
  assert.equal(sop.driveSourceSha256, sop.productionSourceSha256);
  assert.equal(sop.productionSourceSha256, hash(fs.readFileSync(path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`))));
  assert.equal(receipt.metaPipelineAudit.auditSourceSha256, "e".repeat(64));
  assert.equal(receipt.metaPipelineAudit.driveSourceSha256, sop.driveSourceSha256);
  assert.equal(receipt.metaPipelineAudit.productionSourceSha256, sop.productionSourceSha256);
  assert.equal(f.read(attached.refs.auditRef.path).sourceFileSha256, "e".repeat(64));
  assert.notEqual(receipt.sourceRawSha256, "e".repeat(64));
});

test("SOP_v1.2 approval v4 records difficulty as EVIDENCE_DEBT instead of binding the rank", t => {
  const f = fixture(t);
  attachSopV12(f, { difficultyDebt: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.difficultyBucket, null);
  assert.equal(row.fieldStatus.difficulty, "EVIDENCE_DEBT");
  assert.equal(row.difficultyEvidenceDebt.status, "EVIDENCE_DEBT");
});

test("SOP_v1.2 approval v4 rejects a fabricated source excerpt", t => {
  const f = fixture(t);
  const attached = attachSopV12(f);
  rewriteSopV12Doc(f, attached.refs, "correctiveReviewRef", review => { review.rows[0].sourceTextExcerpt = "원문에 없는 발췌"; });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source excerpt is not in the production question/);
});

test("SOP_v1.2 approval v4 rejects reusing difficultyReasonTrace as a source excerpt", t => {
  const f = fixture(t);
  const attached = attachSopV12(f);
  const audit = f.read(attached.refs.auditRef.path);
  rewriteSopV12Doc(f, attached.refs, "correctiveReviewRef", review => {
    review.rows[0].sourceTextExcerpt = audit.auditRecords[0].difficultyReasonTrace;
  });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /must not reuse difficultyReasonTrace/);
});

test("SOP_v1.2 approval v4 rejects visual evidence that does not match the production assets", t => {
  const f = fixture(t);
  const attached = attachSopV12(f);
  rewriteSopV12Doc(f, attached.refs, "correctiveReviewRef", review => { review.rows[0].visualEvidence.visualType = "IMAGE"; });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /visual evidence does not match the production source assets/);
});

for (const [name, mutate, pattern] of [
  ["UID", review => { review.rows[0].questionUid = "other-uid"; }, /UID.ordinal.classification parity/],
  ["audit ordinal", review => { review.rows[0].auditQuestionNumber = 2; }, /UID.ordinal.classification parity/],
  ["primary taxonomy", review => { review.rows[0].problemTypeKey = "PT_OTHER"; }, /UID.ordinal.classification parity/],
  ["template", review => { review.rows[0].templateKey = "TPL_OTHER"; }, /UID.ordinal.classification parity/],
  ["cross concepts", review => { review.rows[0].crossConceptKeys = []; }, /UID.ordinal.classification parity/],
  ["subunit", review => { review.rows[0].subUnitKey = "SUB_OTHER"; }, /UID.ordinal.classification parity/]
]) {
  test(`SOP_v1.2 approval v4 rejects corrective review ${name} drift`, t => {
    const f = fixture(t);
    const attached = attachSopV12(f);
    rewriteSopV12Doc(f, attached.refs, "correctiveReviewRef", mutate);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), pattern);
  });
}

test("SOP_v1.2 approval v4 requires the corrective review reference and binds both SHAs", t => {
  const missing = fixture(t);
  attachSopV12(missing);
  const proof = missing.request.approval.metaPipelineAudit;
  const reviewPath = proof.correctiveReviewRef.path;
  delete missing.request.approval.metaPipelineAudit.correctiveReviewRef;
  missing.request.approval.evidenceRefs = missing.request.approval.evidenceRefs.filter(ref => ref.path !== reviewPath);
  missing.request.items = missing.request.items.map(item => ({ ...item,
    evidenceRefs: item.evidenceRefs.filter(ref => ref.path !== reviewPath) }));
  assert.throws(() => registerReviewedExamV2({ root: missing.root, request: missing.request }), /correctiveReviewRef is required only for approval v4/);

  const original = fixture(t);
  const originalAttached = attachSopV12(original);
  rewriteSopV12Doc(original, originalAttached.refs, "correctiveReviewRef", review => { review.originalDeclaredSourceSha256 = "0".repeat(64); });
  assert.throws(() => registerReviewedExamV2({ root: original.root, request: original.request }), /original source SHA does not match the audit declaration/);

  const current = fixture(t);
  const currentAttached = attachSopV12(current);
  rewriteSopV12Doc(current, currentAttached.refs, "correctiveReviewRef", review => { review.productionSourceSha256 = "0".repeat(64); });
  assert.throws(() => registerReviewedExamV2({ root: current.root, request: current.request }), /production source SHA does not match the current source bytes/);

  const drive = fixture(t);
  const driveAttached = attachSopV12(drive);
  rewriteSopV12Doc(drive, driveAttached.refs, "correctiveReviewRef", review => { review.driveSourceSha256 = "0".repeat(64); });
  assert.throws(() => registerReviewedExamV2({ root: drive.root, request: drive.request }), /actual current Drive SHA does not match the current source bytes/);

  const parityDrive = fixture(t);
  const parityDriveAttached = attachSopV12(parityDrive, { driveSourceHashDrift: true });
  rewriteSopV12Doc(parityDrive, parityDriveAttached.refs, "sourceParityRef", parity => { parity.driveSourceSha256 = "e".repeat(64); });
  assert.throws(() => registerReviewedExamV2({ root: parityDrive.root, request: parityDrive.request }), /exact current Drive.production bytes/);

  const flag = fixture(t);
  const flagAttached = attachSopV12(flag);
  rewriteSopV12Doc(flag, flagAttached.refs, "correctiveReviewRef", review => { review.sourceHashDrift = true; });
  assert.throws(() => registerReviewedExamV2({ root: flag.root, request: flag.request }), /sourceHashDrift flag is inconsistent/);
});

test("SOP_v1.2 approval v4 keeps N/N and zero holds fail-closed", t => {
  const count = fixture(t);
  const countAttached = attachSopV12(count);
  rewriteSopV12Doc(count, countAttached.refs, "auditRef", audit => { audit.auditPassedCount = 0; });
  assert.throws(() => registerReviewedExamV2({ root: count.root, request: count.request }), /audit denominator.identity/);

  const hold = fixture(t);
  const holdAttached = attachSopV12(hold);
  rewriteSopV12Doc(hold, holdAttached.refs, "auditRef", audit => { audit.holdCount = 1; });
  assert.throws(() => registerReviewedExamV2({ root: hold.root, request: hold.request }), /audit denominator.identity/);
});

test("SOP_v1.2 approval v4 rejects manifest classification and production answer drift", t => {
  const taxonomy = fixture(t);
  const taxonomyAttached = attachSopV12(taxonomy);
  rewriteSopV12Doc(taxonomy, taxonomyAttached.refs, "manifestRef", manifest => {
    manifest.recordsToBind[0].primaryTaxonomy = "PT_OTHER";
  });
  assert.throws(() => registerReviewedExamV2({ root: taxonomy.root, request: taxonomy.request }), /SOP_v1.2 manifest binding mismatch/);

  const answer = fixture(t);
  const answerAttached = attachSopV12(answer);
  rewriteSopV12Doc(answer, answerAttached.refs, "manifestRef", manifest => {
    manifest.recordsToBind[0].answer = "9";
  });
  assert.throws(() => registerReviewedExamV2({ root: answer.root, request: answer.request }), /SOP_v1.2 manifest binding mismatch/);
});

test("SOP_v1.2 approval v4 refuses Condition evidence and unaudited difficulty buckets", t => {
  const condition = fixture(t);
  attachSopV12(condition);
  condition.request.items[0].after.conditionKeys = ["COND_OTHER"];
  assert.throws(() => registerReviewedExamV2({ root: condition.root, request: condition.request }), /audited binding limits violated/);

  const bucket = fixture(t);
  attachSopV12(bucket);
  bucket.request.items[0].after.difficultyBucket = 3;
  assert.throws(() => registerReviewedExamV2({ root: bucket.root, request: bucket.request }), /audited binding limits violated/);

  const debt = fixture(t);
  attachSopV12(debt, { difficultyDebt: true });
  debt.request.approval.metaPipelineAudit.unreviewedFields = [];
  assert.throws(() => registerReviewedExamV2({ root: debt.root, request: debt.request }), /difficultyBucket invalid without explicit META_PIPELINE_AUDIT EVIDENCE_DEBT/);
});

test("SOP_v1.2 approval v4 accepts a documented unit correction without creating fake original keys", t => {
  const f = fixture(t);
  f.q.standardUnitKey = "M3-05";
  f.q.subUnitKey = "M3-03-01";
  attachSopV12(f, { legacyAssignment: { standardUnitKey: "M3-05", subUnitKey: "M3-03-01",
    correctionReason: "M3-05 is the audit statistics label; the canonical unit is UNIT_NEW and M3-03-01 has no canonical master row." } });
  const sourcePath = `archive/exams/${f.request.sourceArchiveFile}`;
  const sourceBefore = fs.readFileSync(path.join(f.root, sourcePath));
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.standardUnitKey, "UNIT_NEW");
  assert.equal(row.subUnitKey, "SUB_NEW");
  const masterKeys = f.read("archive/data/master_tables/js_archive_tag_master.json").map(entry => entry.key);
  assert.equal(masterKeys.includes("M3-05"), false);
  assert.equal(masterKeys.includes("M3-03-01"), false);
  assert.deepEqual(fs.readFileSync(path.join(f.root, sourcePath)), sourceBefore);
});

test("SOP_v1.2 approval v4 rejects an unexplained or mismatched unit correction", t => {
  const unexplained = fixture(t);
  attachSopV12(unexplained, { legacyAssignment: { standardUnitKey: "M3-05", subUnitKey: "M3-03-01" } });
  assert.throws(() => registerReviewedExamV2({ root: unexplained.root, request: unexplained.request }), /assignment correction requires a reason/);

  const originalMismatch = fixture(t);
  const originalAttached = attachSopV12(originalMismatch, { legacyAssignment: { standardUnitKey: "M3-05", subUnitKey: "M3-03-01",
    correctionReason: "documented correction" } });
  rewriteSopV12Doc(originalMismatch, originalAttached.refs, "correctiveReviewRef", review => {
    review.rows[0].originalAssignment = { standardUnitKey: "M3-99", subUnitKey: "M3-03-01" };
  });
  assert.throws(() => registerReviewedExamV2({ root: originalMismatch.root, request: originalMismatch.request }), /original.corrected assignment mismatch/);

  const requestMismatch = fixture(t);
  attachSopV12(requestMismatch, { legacyAssignment: { standardUnitKey: "M3-05", subUnitKey: "M3-03-01",
    correctionReason: "documented correction" } });
  requestMismatch.request.items[0].after.standardUnitKey = "UNIT_OTHER";
  assert.throws(() => registerReviewedExamV2({ root: requestMismatch.root, request: requestMismatch.request }), /audited binding limits violated/);
});

test("SOP_v1.2 approval v4 preserves existing conditionKeys and never approves Condition", t => {
  const f = fixture(t);
  attachSopV12(f, { preserveConditionKeys: ["COND_NEW"] });
  const sourcePath = `archive/exams/${f.request.sourceArchiveFile}`;
  const sourceBefore = fs.readFileSync(path.join(f.root, sourcePath));
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.deepEqual(row.conditionKeys, ["COND_NEW"]);
  assert.equal(Object.hasOwn(row.fieldStatus, "condition"), false);
  assert.equal(Object.hasOwn(row.fieldStatus, "difficulty"), false);
  assert.deepEqual(fs.readFileSync(path.join(f.root, sourcePath)), sourceBefore);

  const removed = fixture(t);
  attachSopV12(removed, { preserveConditionKeys: ["COND_NEW"] });
  removed.request.items[0].after.conditionKeys = [];
  assert.throws(() => registerReviewedExamV2({ root: removed.root, request: removed.request }), /audited binding limits violated/);
});

test("SOP_v1.2 approval v4 cannot be mixed with legacy audit or proof schemas", t => {
  const legacyAudit = fixture(t);
  attachSopV12(legacyAudit);
  legacyAudit.request.approval.metaPipelineAudit.schemaVersion = "meta-pipeline-audit-approval-v3";
  assert.throws(() => registerReviewedExamV2({ root: legacyAudit.root, request: legacyAudit.request }), /correctiveReviewRef is required only for approval v4/);

  const legacyProof = fixture(t);
  attachMetaPipelineAudit(legacyProof);
  legacyProof.request.approval.metaPipelineAudit.schemaVersion = "meta-pipeline-audit-approval-v4";
  legacyProof.request.approval.metaPipelineAudit.correctiveReviewRef = legacyProof.evidenceRefs[0];
  assert.throws(() => registerReviewedExamV2({ root: legacyProof.root, request: legacyProof.request }), /source identity.schema mismatch/);
});

// ---- REVIEW2 relaxation (2026-11-13): source without carried fields, reviewStatus waiver, type-hold rows ----
function rewriteSource(f, mutate) {
  const full = path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`);
  const q = JSON.parse(fs.readFileSync(full, "utf8").replace(/^window\.questions = /, "").replace(/;\s*$/, ""))[0];
  mutate(q);
  const text = `window.questions = ${JSON.stringify([q])};\n`;
  fs.writeFileSync(full, text);
  f.request.expectedSourceBlobSha1 = blob(text);
  return q;
}
function review2(f) { f.request.approval.type = "REVIEW2"; f.request.approval.reviewPassCount = 2; return f; }

test("REVIEW2 may register a question whose source carries no level; other approvals and carried values stay strict", t => {
  const f = review2(fixture(t));
  rewriteSource(f, q => { delete q.level; });
  delete f.request.items[0].after.level; delete f.request.items[0].before.level;
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
  assert.equal(f.read(META).records[0].level, undefined);
  const g = fixture(t); rewriteSource(g, q => { delete q.level; });
  delete g.request.items[0].after.level; delete g.request.items[0].before.level;
  assert.throws(() => registerReviewedExamV2({ root: g.root, request: g.request }), /level invalid/);
  const h = review2(fixture(t)); rewriteSource(h, q => { q.level = "최상"; }); h.request.items[0].after.level = "최상";
  assert.throws(() => registerReviewedExamV2({ root: h.root, request: h.request }), /level invalid/);
  const i = review2(fixture(t)); delete i.request.items[0].after.level; delete i.request.items[0].before.level;
  assert.throws(() => registerReviewedExamV2({ root: i.root, request: i.request }), /metadata parity: uid1.level/);
});

function searchFixture(t, mutateIndex) {
  const f = review2(fixture(t));
  rewriteSource(f, q => { delete q.level; delete q.standardUnitKey; delete q.subUnitKey; delete q.standardCourse; });
  delete f.request.items[0].after.level; delete f.request.items[0].before.level;
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  const catalogRow = { ...row, sourceFile: row.sourceArchiveFile, metadataConflicts: [] };
  delete catalogRow.L3; delete catalogRow.L4;
  const idx = { ...row, sourceFile: row.sourceArchiveFile, course: "", standardUnitKey: "", subUnitKey: "", level: "" };
  f.put("archive/question-index.js", `window.questionIndex=${JSON.stringify([mutateIndex ? mutateIndex(idx) : idx])};`);
  return { f, records: f.read(META).records, runtime: f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records, catalog: { records: [catalogRow] } };
}

test("REVIEW2 Search check accepts fields the source does not carry, but not a carried value that differs", t => {
  const { f, records, runtime, catalog } = searchFixture(t);
  assert.doesNotThrow(() => verifyConsumerValues(f.root, records, runtime, catalog));
  const strict = structuredClone(records); strict[0].metadataApprovalType = "FINAL_QA";
  assert.throws(() => verifyConsumerValues(f.root, strict, runtime, catalog), /Search metadata mismatch/);
  const carried = searchFixture(t, idx => ({ ...idx, standardUnitKey: "OTHER_UNIT" }));
  const src = path.join(carried.f.root, `archive/exams/${carried.records[0].sourceArchiveFile}`);
  const q = JSON.parse(fs.readFileSync(src, "utf8").replace(/^window\.questions = /, "").replace(/;\s*$/, ""))[0]; q.standardUnitKey = "OTHER_UNIT";
  fs.writeFileSync(src, `window.questions = ${JSON.stringify([q])};\n`);
  assert.throws(() => verifyConsumerValues(carried.f.root, carried.records, carried.runtime, carried.catalog), /Search metadata mismatch/);
  const course = searchFixture(t, idx => ({ ...idx, course: "다른 과목" }));
  assert.throws(() => verifyConsumerValues(course.f.root, course.records, course.runtime, course.catalog), /Search course mismatch/);
});

test("REVIEW2 waives only a reviewStatus conflict in the Consumer check", t => {
  const { f, records, runtime, catalog } = searchFixture(t);
  catalog.records[0].metadataConflicts = ["reviewStatus"];
  assert.doesNotThrow(() => verifyConsumerValues(f.root, records, runtime, catalog));
  catalog.records[0].metadataConflicts = ["reviewStatus", "difficultyBucket"];
  assert.throws(() => verifyConsumerValues(f.root, records, runtime, catalog), /Consumer metadata conflict/);
  catalog.records[0].metadataConflicts = ["reviewStatus"];
  const other = structuredClone(records); other[0].metadataApprovalType = "FINAL_QA";
  assert.throws(() => verifyConsumerValues(f.root, other, runtime, catalog), /Consumer metadata conflict/);
});

function typeHoldFixture(t) {
  const f = review2(fixture(t));
  rewriteSource(f, q => { delete q.problemTypeKey; delete q.templateKey; });
  const item = f.request.items[0];
  for (const k of ["problemTypeKey", "templateKey", "rpmL3", "rpmL4"]) { delete item.after[k]; delete item.before[k]; }
  item.typeHold = true;
  return f;
}

test("typeHold registers unit/sub-unit only, leaves PT/TPL untouched and writes no runtime row", t => {
  const f = typeHoldFixture(t);
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dry.runtimeMaterialized, 0);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.problemTypeKey, undefined); assert.equal(row.templateKey, undefined);
  assert.equal(row.standardUnitKey, "UNIT_NEW"); assert.equal(row.subUnitKey, "SUB_NEW");
  assert.equal(row.fieldStatus.problemType, "manual_review_pending"); assert.equal(row.fieldStatus.standardUnit, "approved_review2");
  assert.equal(row.metadataStatus, "approved_partial_with_explicit_holds"); assert.equal(row.metaFoundationHoldReason, "TYPE_PATH_UNBOUND_UNIT_SUB_ONLY");
  assert.equal(fs.readdirSync(path.join(f.root, "archive/data/meta-foundation/runtime")).filter(n => n.endsWith(".json")).length, 0);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).replay, true);
});

test("typeHold neighbours stay refused: other approvals, PT/TPL given, registered PT/TPL, bad flag, bad unit, missing flag", t => {
  const final = typeHoldFixture(t); final.request.approval.type = "FINAL_QA"; delete final.request.approval.reviewPassCount;
  assert.throws(() => registerReviewedExamV2({ root: final.root, request: final.request }), /typeHold requires REVIEW2/);
  const given = typeHoldFixture(t); given.request.items[0].after.problemTypeKey = "PT_NEW"; given.request.items[0].before.problemTypeKey = null;
  assert.throws(() => registerReviewedExamV2({ root: given.root, request: given.request }), /typeHold must not set problemTypeKey|source\/approved metadata parity/);
  const noFlag = typeHoldFixture(t); delete noFlag.request.items[0].typeHold;
  assert.throws(() => registerReviewedExamV2({ root: noFlag.root, request: noFlag.request }), /inactive\/missing PT/);
  const registered = typeHoldFixture(t);
  const meta = registered.read(META); meta.records[0].problemTypeKey = "PT_NEW"; registered.put(META, meta);
  assert.throws(() => registerReviewedExamV2({ root: registered.root, request: registered.request }), /typeHold only for unregistered PT\/TPL|source\/approved metadata parity|before mismatch/);
  const truthy = typeHoldFixture(t); truthy.request.items[0].typeHold = "yes";
  assert.throws(() => registerReviewedExamV2({ root: truthy.root, request: truthy.request }), /typeHold requires REVIEW2 and true/);
  const badUnit = typeHoldFixture(t); badUnit.request.items[0].after.standardUnitKey = "NO_SUCH_UNIT";
  assert.throws(() => registerReviewedExamV2({ root: badUnit.root, request: badUnit.request }), /standard unit missing|source\/approved metadata parity/);
});

test("typeHold accepts a source that carries empty PT/TPL placeholders; a resolved type still must equal the source value", t => {
  const f = typeHoldFixture(t);
  rewriteSource(f, q => { q.problemTypeKey = null; q.templateKey = ""; });
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
  // REVIEW2 (since the received-values change): the same null placeholder is also consistent with a first registration of a resolved type; other approval types stay strict
  const g = review2(fixture(t));
  rewriteSource(g, q => { q.problemTypeKey = null; });
  assert.doesNotThrow(() => registerReviewedExamV2({ root: g.root, request: g.request }));
  const g2 = fixture(t);
  rewriteSource(g2, q => { q.problemTypeKey = null; });
  assert.throws(() => registerReviewedExamV2({ root: g2.root, request: g2.request }), /metadata parity: uid1.problemTypeKey/);
  // and a non-empty source value is never waived
  const h = typeHoldFixture(t);
  rewriteSource(h, q => { q.problemTypeKey = "PT_NEW"; });
  assert.throws(() => registerReviewedExamV2({ root: h.root, request: h.request }), /metadata parity: uid1.problemTypeKey/);
});

test("typeHold labels follow a verified basicScopeParentRef; an inconsistent proof is refused", t => {
  const f = typeHoldFixture(t);
  const rel = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.parent-labels.json";
  const proof = { schemaVersion: "archive-meta-pipeline-parent-label-evidence-v1", sourcePath: "archive/data/basic-scope-parent-links.json", sourceSha256: "a".repeat(64),
    records: [{ curriculumKey: "2022", courseKey: "중1수학", standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", L1: "부모 대단원", L2: "부모 중단원" }], derivedRecords: [] };
  f.put(rel, proof);
  const ref = { path: rel, sha256: hash(fs.readFileSync(path.join(f.root, rel))) };
  const item = f.request.items[0];
  item.basicScopeParentRef = ref; item.evidenceRefs = [...item.evidenceRefs, ref];
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.deepEqual([row.L1, row.L2], ["부모 대단원", "부모 중단원"]);
  const bad = typeHoldFixture(t);
  bad.put(rel, { ...proof, records: [{ ...proof.records[0], standardUnitKey: "OTHER" }] });
  const badRef = { path: rel, sha256: hash(fs.readFileSync(path.join(bad.root, rel))) };
  bad.request.items[0].basicScopeParentRef = badRef; bad.request.items[0].evidenceRefs = [...bad.request.items[0].evidenceRefs, badRef];
  assert.throws(() => registerReviewedExamV2({ root: bad.root, request: bad.request }), /basic scope parent evidence missing\/ambiguous/);
  const unbound = typeHoldFixture(t);
  unbound.put(rel, proof);
  unbound.request.items[0].basicScopeParentRef = { path: rel, sha256: hash(fs.readFileSync(path.join(unbound.root, rel))) };
  assert.throws(() => registerReviewedExamV2({ root: unbound.root, request: unbound.request }), /not evidence-bound/);
});

// ---- received-values registry (append-only table beside the sealed canonical tables) and fieldCandidates ----
const RECEIVED_FILE = "archive/data/meta-os/received-values.json";
const recv = (kind, value, parent = "", extra = {}) => ({ kind, value, label: `받은 ${value}`, parent, reason: "문항을 읽고 판정한 새 값", firstExam: "exam1", receivedAt: "2026-11-14", status: "UNGROUPED", ...extra });
function writeReceived(f, records) {
  const file = path.join(f.root, RECEIVED_FILE);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify({ schemaVersion: "archive-received-values-v1", records }, null, 2) + "\n");
}
function receivedFixture(t, records = [recv("unit", "UNIT_RECV"), recv("subUnit", "SUB_RECV", "UNIT_RECV")]) {
  const f = typeHoldFixture(t);
  const labels = { standardUnitKey: "UNIT_RECV", standardUnit: "받은 UNIT_RECV", subUnitKey: "SUB_RECV", subUnit: "받은 SUB_RECV" };
  rewriteSource(f, q => Object.assign(q, labels));
  Object.assign(f.request.items[0].after, labels);
  writeReceived(f, records);
  return f;
}

test("received registry: a unit/sub-unit key missing from the sealed master is accepted from the registry and the judged value is kept as a candidate", t => {
  const f = receivedFixture(t);
  f.request.items[0].fieldCandidates = { standardUnitKey: [{ value: "UNIT_NEW", source: "p3" }], rpmPath: [{ value: { majorUnit: "가", midUnit: "나", l3: "다", l4: "라" }, source: "proposed-new" }] };
  writeReceived(f, [recv("unit", "UNIT_RECV"), recv("subUnit", "SUB_RECV", "UNIT_RECV"), recv("rpmPath", "가 > 나 > 다 > 라", "가 > 나 > 다")]);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.standardUnitKey, "UNIT_RECV");                       // the main cell keeps the source value
  assert.deepEqual(row.fieldCandidates.standardUnitKey, [{ value: "UNIT_NEW", source: "p3" }]);
  assert.equal(row.fieldCandidates.rpmPath[0].value.l4, "라");
  assert.equal(row.problemTypeKey, undefined);                            // PT/TPL are never written for a received value
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).replay, true);
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.root, RECEIVED_FILE), "utf8")).records.length, 3);   // the registry is only read by the registrar
});

test("received registry: a value that is in neither the master nor the registry is still refused", t => {
  const none = receivedFixture(t, []);
  assert.throws(() => registerReviewedExamV2({ root: none.root, request: none.request }), /standard unit missing: UNIT_RECV/);
  const noSub = receivedFixture(t, [recv("unit", "UNIT_RECV")]);
  assert.throws(() => registerReviewedExamV2({ root: noSub.root, request: noSub.request }), /subunit missing: SUB_RECV/);
  const wrongParent = receivedFixture(t, [recv("unit", "UNIT_RECV"), recv("subUnit", "SUB_RECV", "UNIT_NEW")]);
  assert.throws(() => registerReviewedExamV2({ root: wrongParent.root, request: wrongParent.request }), /subunit parent mismatch/);
  const withdrawn = receivedFixture(t, [recv("unit", "UNIT_RECV", "", { status: "WITHDRAWN" }), recv("subUnit", "SUB_RECV", "UNIT_RECV")]);
  assert.throws(() => registerReviewedExamV2({ root: withdrawn.root, request: withdrawn.request }), /standard unit missing: UNIT_RECV/);
  const dup = receivedFixture(t, [recv("unit", "UNIT_RECV"), recv("unit", "UNIT_RECV")]);
  assert.throws(() => registerReviewedExamV2({ root: dup.root, request: dup.request }), /received-values duplicate/);
  const bad = receivedFixture(t, [recv("unit", "UNIT_RECV", "", { status: "APPROVED" })]);
  assert.throws(() => registerReviewedExamV2({ root: bad.root, request: bad.request }), /received-values status invalid/);
});

test("fieldCandidates: out-of-scope fields, unknown values, bad sources and non-REVIEW2 approvals are refused", t => {
  const refuse = (mutate, pattern) => {
    const f = receivedFixture(t); f.request.items[0].fieldCandidates = {}; mutate(f.request.items[0].fieldCandidates, f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), pattern);
  };
  refuse(c => { c.problemTypeKey = [{ value: "PT_X", source: "p3" }]; }, /fieldCandidates field not allowed/);                    // PT/TPL are never written through candidates
  refuse(c => { c.standardUnitKey = [{ value: "NO_SUCH_UNIT", source: "p3" }]; }, /not in master or received registry/);
  refuse(c => { c.standardUnitKey = [{ value: "UNIT_NEW", source: "guess" }]; }, /fieldCandidates entry malformed/);
  refuse(c => { c.integrationPattern = [{ value: "PT_SOMETHING", source: "p3" }]; }, /outside the six values/);
  refuse(c => { c.rpmPath = [{ value: { majorUnit: "가", midUnit: "나", l3: "다", l4: "라" }, source: "p3" }]; }, /rpmPath not in RPM master or received registry/);
  refuse(c => { c.crossConceptKeys = [{ value: ["CC_NOT_ANYWHERE"], source: "p3" }]; }, /key not canonical or received/);
  refuse(c => { c.standardUnitKey = []; }, /fieldCandidates list required/);
  const final = receivedFixture(t); final.request.approval.type = "FINAL_QA"; delete final.request.approval.reviewPassCount;
  final.request.items[0].fieldCandidates = { standardUnitKey: [{ value: "UNIT_NEW", source: "p3" }] };
  assert.throws(() => registerReviewedExamV2({ root: final.root, request: final.request }), /requires REVIEW2|typeHold requires REVIEW2/);
});

test("received registry: changed source text and a wrong UID are still refused", t => {
  const drift = receivedFixture(t);
  const full = path.join(drift.root, `archive/exams/${drift.request.sourceArchiveFile}`);
  fs.writeFileSync(full, fs.readFileSync(full, "utf8") + "\n// changed after judgment\n");
  assert.throws(() => registerReviewedExamV2({ root: drift.root, request: drift.request }), /source Git blob drift/);
  const uid = receivedFixture(t); uid.request.items[0].questionUid = "qid_of_another_question";
  assert.throws(() => registerReviewedExamV2({ root: uid.root, request: uid.request }), /UID|denominator|ordinal/);
});

test("REVIEW2: an empty PT/TPL placeholder in the source is consistent with a first registration of a resolved PT/TPL", t => {
  const f = review2(fixture(t));
  rewriteSource(f, q => { q.problemTypeKey = ""; q.templateKey = ""; });
  assert.doesNotThrow(() => registerReviewedExamV2({ root: f.root, request: f.request }));
  const strict = fixture(t);
  rewriteSource(strict, q => { q.problemTypeKey = ""; q.templateKey = ""; });
  assert.throws(() => registerReviewedExamV2({ root: strict.root, request: strict.request }), /source\/approved metadata parity/);   // other approval types keep the strict rule
});

test("fieldCandidates rpmPath is accepted when the path is a leaf of the locked RPM master, refused when it is not", t => {
  const f = receivedFixture(t);
  const master = path.join(f.root, "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json");
  fs.mkdirSync(path.dirname(master), { recursive: true });
  fs.writeFileSync(master, JSON.stringify({ records: [{ curriculum: "2015", scope: "수학_상", majorUnit: "가", midUnit: "나", concepts: [{ concept: "다", problemTypes: [{ problemType: "라" }] }] }] }));
  f.request.items[0].fieldCandidates = { rpmPath: [{ value: { majorUnit: "가", midUnit: "나", l3: "다", l4: "라" }, source: "agree" }] };
  assert.doesNotThrow(() => registerReviewedExamV2({ root: f.root, request: f.request }));
  f.request.items[0].fieldCandidates = { rpmPath: [{ value: { majorUnit: "가", midUnit: "나", l3: "다", l4: "없는 L4" }, source: "agree" }] };
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /rpmPath not in RPM master or received registry/);
});

function partialFixture(t) {
  const f = fixture(t);
  const hold = { questionUid: "uid2", sourceArchiveFile: f.request.sourceArchiveFile, sourceOrdinal: 2,
    sourceFingerprint: "legacy-fingerprint", reviewStatus: "manual_review", metadataStatus: "approved_partial_with_explicit_holds",
    fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" }, problemTypeKey: "", templateKey: null };
  const sourcePath = `archive/exams/${f.request.sourceArchiveFile}`;
  const writeBank = (first = f.q) => {
    const text = `window.questions = ${JSON.stringify([first, { ...f.q, id: 2 }])};\n`;
    f.put(sourcePath, text);
    f.request.expectedSourceBlobSha1 = blob(text);
    return text;
  };
  for (const p of [META, "archive/data/question_identity_map.json"]) {
    const doc = f.read(p);
    doc.records.push(hold);
    f.put(p, doc);
  }
  f.request.scope = "PARTIAL_UIDS";
  f.request.expectedQuestionCount = 2;
  writeBank();
  return { ...f, hold, sourcePath, writeBank, receiptPath: `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.json` };
}

function itemRebindFixture(t) {
  const f = partialFixture(t);
  const sourceSha = q => hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const bodySha = q => hash(JSON.stringify({ content: q.content, choices: q.choices, image: q.image }));
  const git = (...args) => execFileSync("git", args, { cwd: f.root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "-q");
  // Put the actual old JS bytes into Git, then change only the targeted ordinal.
  const priorSourceBlobSha1 = git("hash-object", "-w", f.sourcePath);
  const current = { ...f.q, solution: "학생용 해설 교정" };
  f.writeBank(current);
  const item = f.request.items[0];
  item.rebind = { priorSourceBlobSha1, priorContentFingerprint: bodySha(f.q) };
  Object.assign(item.before, { sourceFingerprint: sourceSha(f.q), contentFingerprint: null });
  Object.assign(item.after, { sourceFingerprint: sourceSha(current), contentFingerprint: bodySha(current) });
  item.identityBefore = { sourceFingerprint: sourceSha(f.q) };
  return { ...f, item, current, sourceSha, bodySha };
}

test("partial UID dry-run and write preserve the omitted HOLD and source bytes", t => {
  const f = partialFixture(t);
  const raw = p => fs.readFileSync(path.join(f.root, p), "utf8");
  const before = raw(META), source = raw(f.sourcePath);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
  assert.equal(raw(META), before);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  const holdBytes = JSON.stringify(f.hold, null, 2).replaceAll("\n", "\n    ");
  assert.ok(before.includes(holdBytes) && raw(META).includes(holdBytes));
  assert.equal(raw(f.sourcePath), source);
  assert.deepEqual(f.read(f.receiptPath).appliedRecords.map(r => r.questionUid), ["uid1"]);
});

test("partial UID rejects foreign UID, wrong ordinal, duplicate UID/ordinal and empty items", t => {
  const f = partialFixture(t), [item] = f.request.items;
  for (const [items, error] of [
    [[{ ...item, questionUid: "foreign" }], /UID\/source ordinal mismatch/],
    [[{ ...item, sourceOrdinal: 2 }], /UID\/source ordinal mismatch/],
    [[item, { ...item, sourceOrdinal: 2 }], /duplicate request UID/],
    [[item, { ...item, questionUid: "uid2" }], /duplicate request ordinal/],
    [[], /partial items must not be empty/],
  ]) assert.throws(() => registerReviewedExamV2({ root: f.root, request: { ...f.request, items } }), error);
});

test("unmarked partial UID fails and a complete legacy request retains its receipt shape", t => {
  const f = partialFixture(t);
  delete f.request.scope;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /UID denominator mismatch/);
  const full = fixture(t);
  registerReviewedExamV2({ root: full.root, request: full.request, write: true });
  const receipt = full.read(f.receiptPath);
  assert.equal(receipt.totalQuestions, 1);
  assert.equal(Object.hasOwn(receipt, "scope"), false);
  assert.equal(Object.hasOwn(receipt, "partialUidCount"), false);
});

test("partial UID rebind verifies old Git bytes and updates both fingerprints", t => {
  const f = itemRebindFixture(t);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.fingerprintRepairCount, 1);
  for (const p of [META, "archive/data/question_identity_map.json"]) {
    const [bound, held] = f.read(p).records;
    assert.equal(bound.sourceFingerprint, f.sourceSha(f.current));
    assert.deepEqual(held, f.hold);
  }
  assert.deepEqual(f.read(f.receiptPath).fingerprintRepairs[0].rebind, f.item.rebind);
});

test("partial UID rebind refuses a changed stem or figure even with a truthful prior hash", t => {
  for (const change of [{ content: "다른 발문" }, { image: "other.png" }, { question: "옛 형식 발문 변경" }]) {
    const f = itemRebindFixture(t);
    Object.assign(f.current, change);
    f.writeBank(f.current);
    Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /rebind content fingerprint mismatch/);
  }
});

test("partial UID rebind refuses missing, invalid or unrelated blob evidence", t => {
  const f = itemRebindFixture(t), proof = f.item.rebind, currentBlob = f.request.expectedSourceBlobSha1;
  assert.equal(execFileSync("git", ["hash-object", "-w", f.sourcePath], { cwd: f.root, encoding: "utf8" }).trim(), currentBlob);
  for (const [change, error] of [
    [{ rebind: undefined }, /rebind evidence required/],
    [{ rebind: { ...proof, priorSourceBlobSha1: undefined } }, /priorSourceBlobSha1 is required/],
    [{ rebind: { ...proof, priorSourceBlobSha1: "a".repeat(40) } }, /prior source blob unavailable/],
    [{ rebind: { ...proof, priorSourceBlobSha1: currentBlob } }, /prior source fingerprint mismatch/],
    [{ rebind: { ...proof, priorContentFingerprint: "a".repeat(64) } }, /content fingerprint mismatch/],
  ]) assert.throws(() => registerReviewedExamV2({ root: f.root, request: {
    ...f.request, items: [{ ...f.item, ...change }],
  } }), error);
  f.request.expectedSourceBlobSha1 = "b".repeat(40);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source Git blob drift/);
});

test("partial UID replay reports its exact denominator and ignores changes to omitted rows", t => {
  const f = itemRebindFixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const meta = f.read(META);
  meta.records[1].reviewStatus = "review_required";
  f.put(META, meta);
  const replay = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(replay.replay, true);
  assert.deepEqual(replay.plannedPaths, []);
  for (const item of [replay, f.read(f.receiptPath)])
    assert.deepEqual([item.scope, item.totalQuestions, item.partialUidCount], ["PARTIAL_UIDS", 1, 1]);
  assert.deepEqual(f.read(META), meta);
  const receipt = f.read(f.receiptPath);
  receipt.appliedRecords[0] = meta.records[1];
  f.put(f.receiptPath, receipt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /partial receipt UID scope mismatch/);
});

test("partial UID Consumer verification sees only applied records from the receipt", t => {
  const f = partialFixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath), [row] = receipt.appliedRecords;
  const catalog = { records: [{ ...row, sourceFile: row.sourceArchiveFile, metadataConflicts: [] }] };
  f.put("archive/question-index.js", `window.questionIndex=${JSON.stringify([{ ...row, sourceFile: row.sourceArchiveFile, course: row.standardCourse }])};`);
  const lanes = verifyConsumerValues(f.root, receipt.appliedRecords, receipt.runtimeRecords, catalog);
  assert.deepEqual(lanes, { canonical: 1, usableMetaLane: 0 });
  assert.throws(() => verifyConsumerValues(f.root, f.read(META).records, receipt.runtimeRecords, catalog), /Consumer UID missing\/mismatch: uid2/);
});
