import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { registerDifficulty5 } from "../archive/tools/meta-foundation/register-difficulty5.mjs";
import { planQuestion as planAutoQuestion, sourceFingerprint as auditSourceFingerprint, contentFingerprint as auditContentFingerprint, loadBank as loadSourceBank } from "../archive/tools/meta-foundation/auto-register-merged-source.mjs";
import { validateActiveMetaFields, loadActiveMetaRegistry } from "../archive/tools/meta-foundation/active-registry.mjs";
import { nativeReviewedRendererRebind } from "../archive/tools/meta-foundation/native-reviewed-renderer-reuse.mjs";
import { validateNativeReviewedSourceReuse } from "../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs";
import { verifyRegisteredRendererContinuity } from "../tools/4slot/registered-renderer-continuity.mjs";
import { buildReviewedRendererBinding } from "../archive/tools/meta-foundation/reviewed-current-renderer-continuity.mjs";
import { loadAuditPreservation } from "../archive/tools/meta-foundation/native-audit-preservation.mjs";
import { auditSourceBindingPath } from "../archive/tools/meta-foundation/native-audit-source-preservation.mjs";
import { buildReviewedSourceBinding, reviewedSourceBindingPath } from "../archive/tools/meta-foundation/reviewed-source-binding.mjs";
import { verifyChangedUidConsumerApproval } from "../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs";
import canonical from "../archive/archive2-canonical.js";
import { collectSourceValueOverrides, isLegacyPathFormulaUid, legacyPathFormulaUids, isAuditedPendingIntegrationRebindAllowed, isMetaPipelineApprovedTypeRebindAllowed, isSopPendingSourceNamespaceCorrectionAllowed, isSopV12SourceFieldCorrectionAllowed, isSourceConditionEvidenceDebtAllowed, metaPipelineCrossConceptCountMatches, metaPipelineTemplateReuseCountMatches, preservedRuntimeIdentityProvenance, registerReviewedExamV2, sopV12PackIncludes, sourceVisualType, validateSourceConditionCorrections, validateSourceCrossConceptCorrections, validateTargetedAuditCorrections, validateTargetedRecoverySupplement, verifyConsumerValues, verifyIdentityFingerprintConsumer } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";

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

function fixture(t, course = "중1 수학", curriculum = "2022", source = "fixture/exam.js", unitKey = "UNIT_NEW", subKey = "SUB_NEW") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-meta-v2-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, value) => { const full = path.join(root, p); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, typeof value === "string" ? value : j(value)); };
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  put("docs/approval.json", { approved: true, meaning: "fixture reviewed definitions" });
  const evidenceRefs = [{ path: "docs/approval.json", sha256: hash(fs.readFileSync(path.join(root, "docs/approval.json"))) }];
  const q = { id: 1, content: "학생용 지문", choices: ["1", "2"], answer: "1", solution: "학생용 해설", image: "",
    standardCourse: course, standardUnitKey: unitKey, standardUnit: "새 단원", subUnitKey: subKey, subUnit: "새 세부단원",
    level: "중", problemTypeKey: "PT_NEW", templateKey: "TPL_NEW", crossConceptKeys: ["CC_NEW"], conditionKeys: ["COND_NEW"], integrationPattern: "NONE", difficultyBucket: 3 };
  const text = `window.questions = ${JSON.stringify([q])};\n`;
  put(`archive/exams/${source}`, text);
  const fingerprint = hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const current = { questionUid: "uid1", sourceArchiveFile: source, sourceOrdinal: 1, sourceFingerprint: fingerprint,
    standardCourse: course, standardUnitKey: unitKey, subUnitKey: subKey, reviewStatus: "review_required" };
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
  change(`${base}/taxonomy.json`, null, null, null, { status: "ACTIVE", problemTypes: [{ problemTypeKey: "PT_NEW", canonicalLabelKo: "새 유형", definition: "검수된 유형 의미", ownerPack: "NEW_COURSE", status: "ACTIVE", sourceUnit: unitKey, supportingQuestionUids: ["uid1"], supportingItemCount: 1 }], templates: [{ templateKey: "TPL_NEW", canonicalLabelKo: "새 풀이 구조", definition: "검수된 풀이 구조", parentProblemTypeKey: "PT_NEW", status: "ACTIVE", sourceUnit: unitKey, supportingQuestionUids: ["uid1"], supportingItemCount: 1 }] });
  change(`${base}/bindings.json`, null, null, null, { status: "ACTIVE", bindings: [{ curriculum, standardCourse: course, standardUnitKey: unitKey, subUnitKey: subKey, problemTypeKey: "PT_NEW", status: "ACTIVE" }] });
  change(`${base}/aliases.json`, null, null, null, { aliases: [] });
  change(`${CANON}/registry_index.json`, "activeConceptShards", { id: "NEW_CONCEPTS" }, null, { id: "NEW_CONCEPTS", version: "1.0.0", status: "ACTIVE" });
  change(`${CANON}/concepts/new-concepts.json`, null, null, null, { shardId: "NEW_CONCEPTS", shardVersion: "1.0.0", concepts: [{ conceptKey: "CC_NEW", canonicalLabelKo: "새 추가 개념", definition: "추가 개념 근거", supportingQuestionUids: ["uid1"], supportingItemCount: 1, status: "ACTIVE" }] });
  change(`${CANON}/condition_registry.json`, "conditions", { conditionKey: "COND_NEW" }, null, { conditionKey: "COND_NEW", canonicalLabelKo: "새 조건", definition: "조건 근거", status: "ACTIVE" });
  for (const row of [{ key: unitKey, keyType: "standardUnitKey", labelKo: "새 단원", status: "active" }, { key: subKey, keyType: "subUnitKey", parentKey: unitKey, standardUnitKey: unitKey, labelKo: "새 세부단원", status: "active" }]) change("archive/data/master_tables/js_archive_tag_master.json", "$", { key: row.key }, null, row);
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

function parentOnlyWhitespaceFixture(t, midUnit) {
  const f = fixture(t);
  f.q.standardUnit = "기본도형";
  f.q.subUnit = "점·선·면과 각";
  Object.assign(f.request.items[0].after, { standardUnit: f.q.standardUnit, subUnit: f.q.subUnit });
  for (const change of f.request.registryChanges.filter(change => change.path === "archive/data/master_tables/js_archive_tag_master.json")) {
    change.after.labelKo = change.after.keyType === "standardUnitKey" ? f.q.standardUnit : f.q.subUnit;
  }
  const binding = f.request.registryChanges.find(change => change.path.endsWith("/bindings.json")).after.bindings[0];
  binding.L1 = f.q.standardUnit;
  assert.equal(Object.hasOwn(binding, "L2"), false);
  syncFixtureSource(f);
  attachMetaPipelineAudit(f, { promoteCanonicalTypes: true, targetCanonicalParent: true });
  const item = f.request.items[0], parent = item.targetParentRef;
  parent.midUnit = midUnit;
  item.after.L2 = midUnit;
  const master = f.read(parent.path);
  master.records[0].midUnit = midUnit;
  f.put(parent.path, master);
  const sha256 = hash(fs.readFileSync(path.join(f.root, parent.path)));
  for (const refs of [f.request.approval.evidenceRefs, item.evidenceRefs]) {
    refs.find(ref => ref.path === parent.path).sha256 = sha256;
  }
  assert.equal(parent.crosswalkRef, undefined);
  return f;
}

test("canonical parent-only label accepts native whitespace differences while preserving exact master labels", t => {
  const f = parentOnlyWhitespaceFixture(t, "기본 도형");
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  const row = f.read(META).records[0];
  assert.equal(row.L1, "기본도형");
  assert.equal(row.L2, "기본 도형");
});

test("canonical parent-only label rejects a different evidence-bound parent despite whitespace normalization", t => {
  const f = parentOnlyWhitespaceFixture(t, "평면 도형");
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /canonical target parent mismatch/);
});

test("canonical parent accepts the existing master scope alias 수학_상 for 수학(상)", t => {
  const f = fixture(t, "수학(상)", "2015");
  attachMetaPipelineAudit(f, { targetCanonicalParent: true, targetCanonicalScope: "수학_상" });
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

test("canonical parent uses the selected exact ACTIVE binding subunit label", t => {
  const midUnit = "삼각형의 무게중심", f = parentOnlyWhitespaceFixture(t, midUnit);
  const binding = f.request.registryChanges.find(change => change.path.endsWith("/bindings.json")).after.bindings[0];
  binding.subUnitLabelKo = midUnit;
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  assert.equal(f.read(META).records[0].L2, midUnit);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("canonical parent refuses a subunit label from another binding context", t => {
  const midUnit = "삼각형의 무게중심", f = parentOnlyWhitespaceFixture(t, midUnit);
  const bindings = f.request.registryChanges.find(change => change.path.endsWith("/bindings.json")).after.bindings;
  bindings[0].subUnitLabelKo = "다른 세부단원";
  bindings.push({ ...bindings[0], subUnitKey: "SUB_OTHER", subUnitLabelKo: midUnit });
  f.request.registryChanges.push({ path: "archive/data/master_tables/js_archive_tag_master.json", collection: "$", match: { key: "SUB_OTHER" }, before: null,
    after: { key: "SUB_OTHER", keyType: "subUnitKey", parentKey: "UNIT_NEW", standardUnitKey: "UNIT_NEW", labelKo: midUnit, status: "active" }, evidenceRefs: f.evidenceRefs });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /canonical target parent mismatch/);
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
  ["wrong source value", f => { f.request.items[0].after.difficultyBucket = 4; }, /source\/approved metadata parity/]
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

function historicalLevelFixture(t, level) {
  const f = fixture(t), values = { level, difficultyBucket: 3, difficultyConfidence: "high",
    difficultyBoundaryFlag: "B23", legacyLevelCompatibility: "UNKNOWN" };
  rewriteSource(f, q => Object.assign(q, values));
  Object.assign(f.request.items[0].after, values);
  for (const key of Object.keys(values)) f.request.items[0].before[key] = null;
  return f;
}

for (const level of [null, "중상"]) test(`FINAL_QA preserves explicit historical level ${JSON.stringify(level)} without deriving a new label`, t => {
  const f = historicalLevelFixture(t, level);
  const sourcePath = path.join(f.root, `archive/exams/${f.request.sourceArchiveFile}`);
  const sourceBytes = fs.readFileSync(sourcePath);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).replay, true);
  const records = f.read(META).records;
  const runtime = f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records;
  assert.equal(records[0].level, level);
  assert.equal(runtime[0].level, level);
  assert.equal(records[0].difficultyBucket, 3);
  assert.equal(records[0].legacyLevelCompatibility, "UNKNOWN");
  assert.deepEqual(fs.readFileSync(sourcePath), sourceBytes);
  const catalogRow = { ...records[0], sourceFile: records[0].sourceArchiveFile, metadataConflicts: [] };
  const indexRow = { ...records[0], sourceFile: records[0].sourceArchiveFile, course: records[0].standardCourse, level: level ?? "" };
  f.put("archive/question-index.js", `window.questionIndex=${JSON.stringify([indexRow])};`);
  assert.doesNotThrow(() => verifyConsumerValues(f.root, records, runtime, { records: [catalogRow] }));
});

test("historical level preservation still rejects unknown difficultyBucket values and mismatched inputs", t => {
  const cases = [
    [f => { f.request.items[0].after.level = "중상"; }, /metadata parity/],
    [f => { rewriteSource(f, q => { q.difficultyBucket = "UNKNOWN"; }); f.request.items[0].after.difficultyBucket = "UNKNOWN"; }, /(?:level|difficulty\w*) invalid/],
    [f => { rewriteSource(f, q => { q.difficultyBucket = 6; }); f.request.items[0].after.difficultyBucket = 6; }, /(?:level|difficulty\w*) invalid/],
    [f => { f.request.expectedSourceBlobSha1 = "f".repeat(40); }, /source.*(?:blob|SHA)|Source/i],
    [f => { f.put("docs/approval.json", { approved: false }); }, /evidence missing\/drift/],
  ];
  for (const [mutate, error] of cases) {
    const f = historicalLevelFixture(t, null);
    const before = fs.readFileSync(path.join(f.root, META));
    mutate(f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), error);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  }
});

test("a request without level is not rejected because of level; a carried level is stored as is", t => {
  for (const make of [f => review2(f), f => f]) {
    const f = make(fixture(t));
    rewriteSource(f, q => { delete q.level; });
    delete f.request.items[0].after.level; delete f.request.items[0].before.level;
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
    assert.equal(f.read(META).records[0].level, undefined);
  }
  const h = review2(fixture(t)); rewriteSource(h, q => { q.level = "최상"; }); h.request.items[0].after.level = "최상";
  assert.equal(registerReviewedExamV2({ root: h.root, request: h.request, write: true }).status, "PASS");
  assert.equal(h.read(META).records[0].level, "최상");
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

function partialFixture(t, course, curriculum, source, completeActiveMetadata = false) {
  const f = completeActiveMetadata ? fixture(t, "중2 수학", "2022", source, "M2-01", "M2-01-FIXTURE") : fixture(t, course, curriculum, source);
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

function partialSourceRebindFixture(t) {
  const f = partialFixture(t);
  const git = (...args) => execFileSync("git", args, { cwd: f.root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "-q");
  git("hash-object", "-w", f.sourcePath);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receiptRef = { path: f.receiptPath, sha256: hash(fs.readFileSync(path.join(f.root, f.receiptPath))) };
  const text = `window.questions = ${JSON.stringify([f.q, { ...f.q, id: 2, editorialNote: "other question metadata updated" }])};\n`;
  f.put(f.sourcePath, text);
  const request = { schemaVersion: f.request.schemaVersion, requestId: "test-partial-source-rebind", scope: "PARTIAL_UIDS",
    examUid: f.request.examUid, sourceArchiveFile: f.request.sourceArchiveFile, expectedSourceBlobSha1: blob(text), expectedQuestionCount: 2,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "fixture-preservation-reviewer", evidenceRefs: [...f.evidenceRefs, receiptRef],
      sourceRebind: { priorReceiptRef: receiptRef } },
    items: [{ questionUid: "uid1", sourceOrdinal: 1, before: {}, after: {}, reason: "preserve the same approved question after another question changes", evidenceRefs: f.evidenceRefs }] };
  return { ...f, request, receiptRef, priorReceiptPath: f.receiptPath };
}

test("partial source rebind preserves one approval and all omitted rows with zero new approvals", t => {
  const f = partialSourceRebindFixture(t), before = f.read(META), beforeIdentity = fs.readFileSync(path.join(f.root, "archive/data/question_identity_map.json"));
  const source = fs.readFileSync(path.join(f.root, f.sourcePath));
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.status, "PASS");
  assert.deepEqual([result.expectedQuestionCount, result.partialUidCount, result.totalQuestions, result.newMetadataApprovals, result.preservedMetadataApprovals], [2, 1, 1, 0, 1]);
  const after = f.read(META);
  assert.deepEqual(after.records[1], before.records[1]);
  assert.deepEqual(Object.keys({ ...before.records[0], ...after.records[0] }).filter(k => JSON.stringify(before.records[0][k]) !== JSON.stringify(after.records[0][k])).sort(), ["approvalEvidence", "metadataRevision"]);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_identity_map.json")), beforeIdentity);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
  const receipt = f.read("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-partial-source-rebind.json");
  assert.deepEqual([receipt.newMetadataApprovals, receipt.preservedMetadataApprovals], [0, 1]);
  assert.deepEqual(receipt.appliedRecords.map(r => r.questionUid), ["uid1"]);
  assert.deepEqual(receipt.runtimeRecords.map(r => r.questionUid), ["uid1"]);
  const replay = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(replay.replay, true);
  assert.deepEqual([replay.newMetadataApprovals, replay.preservedMetadataApprovals], [0, 1]);
  receipt.preservedMetadataApprovals = 2;
  f.put("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-partial-source-rebind.json", receipt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /approval count drift/);  receipt.preservedMetadataApprovals = 1; receipt.sourceRawSha256 = "0".repeat(64);
  f.put("archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-partial-source-rebind.json", receipt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source binding drift/);
});

test("partial source rebind keeps the accepted row version when the active pack has advanced", t => {
  const f = partialSourceRebindFixture(t), before = f.read(META).records[0];
  const packPath = `${CANON}/packs/new-course/pack.json`, pack = f.read(packPath);
  pack.packVersion = "1.0.1"; f.put(packPath, pack);
  const index = f.read(`${CANON}/registry_index.json`); index.activePacks[0].version = "1.0.1"; f.put(`${CANON}/registry_index.json`, index);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
  const after = f.read(META).records[0];
  assert.equal(after.metaFoundationPackVersion, before.metaFoundationPackVersion);
  assert.equal(after.metadataRevision, `meta-foundation:NEW_COURSE@${before.metaFoundationPackVersion}:exam-final_qa-v2:test-partial-source-rebind`);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("partial source rebind rejects prior denominator, selection, identity, runtime and approval drift", t => {
  for (const mutate of [
    r => { r.expectedQuestionCount = 1; },
    r => { r.partialUidCount = 2; },
    r => { delete r.scope; },
    r => { r.appliedRecords[0].questionUid = "uid2"; },
    r => { r.appliedRecords[0].sourceOrdinal = 2; },
    r => { r.appliedIdentityRecords[0].sourceFingerprint = "drift"; },
    r => { r.runtimeRecords[0].templateKey = "TPL_UNREVIEWED"; },
    r => { r.runtimeRecords[0].questionUid = "uid2"; },
    r => { r.approval.type = "META_PIPELINE_AUDIT"; },
    r => { r.sourceBlobSha1 = "0".repeat(40); },
  ]) {
    const f = partialSourceRebindFixture(t);
    retargetPriorReceipt(f, mutate);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /sourceRebind|prior source blob/);
  }
});

test("partial source rebind cannot add a held neighbour or change a selected renderer field", t => {
  const extra = partialSourceRebindFixture(t);
  extra.request.items.push({ ...extra.request.items[0], questionUid: "uid2", sourceOrdinal: 2 });
  assert.throws(() => registerReviewedExamV2({ root: extra.root, request: extra.request }), /prior receipt does not match/);
  for (const patch of [{ solutionImage: "unreviewed.svg" }, { number: 99 }, { primaryMethod: "unreviewed method" }]) {
    const f = partialSourceRebindFixture(t);
    const text = `window.questions = ${JSON.stringify([{ ...f.q, ...patch }, { ...f.q, id: 2 }])};\n`;
    f.put(f.sourcePath, text); f.request.expectedSourceBlobSha1 = blob(text);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /selected source question changed/);
  }
  const changed = partialSourceRebindFixture(t);
  changed.request.items[0].before = { level: "중" }; changed.request.items[0].after = { level: "상" };
  assert.throws(() => registerReviewedExamV2({ root: changed.root, request: changed.request }), /must not change values/);
});

function itemRebindFixture(t, completeActiveMetadata = false) {
  const f = partialFixture(t, undefined, undefined, undefined, completeActiveMetadata);
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

function addLegacyAlias(f, first = f.q) {
  const source = f.request.sourceArchiveFile, identity = f.read("archive/data/question_identity_map.json");
  identity.schemaVersion = "question-identity-map-v1";
  identity.lookup = { byQuestionUid: {}, bySourceFileAndOrdinal: { [source]: {} },
    bySourceFileAndQuestionNo: { [source]: {} }, byLegacyQKey: {} };
  for (const row of identity.records) {
    row.sourceQuestionNo = row.sourceOrdinal; row.legacyQKey = `${source}_${row.sourceQuestionNo}`;
    identity.lookup.byQuestionUid[row.questionUid] = { sourceArchiveFile: source, sourceOrdinal: row.sourceOrdinal, sourceQuestionNo: row.sourceQuestionNo };
    identity.lookup.bySourceFileAndOrdinal[source][row.sourceOrdinal] = row.questionUid;
    identity.lookup.bySourceFileAndQuestionNo[source][row.sourceQuestionNo] = [row.questionUid];
    identity.lookup.byLegacyQKey[row.legacyQKey] = [row.questionUid];
  }
  f.put("archive/data/question_identity_map.json", identity);
  const meta = f.read(META); for (const row of meta.records) row.sourceQuestionNo = row.sourceOrdinal; f.put(META, meta);
  const question = { ...first, questionUid: "exam|1", sourceQuestionNo: 1, sourceQid: 1, sourceOrdinal: 1 };
  f.writeBank(question);
  return question;
}

test("partial registrar preserves a uniquely mapped legacy source alias while registering the canonical UID", t => {
  const f = partialFixture(t); addLegacyAlias(f);
  const before = fs.readFileSync(path.join(f.root, f.sourcePath));
  const omitted = f.read(META).records[1];
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  const receipt = f.read(f.receiptPath);
  assert.equal(receipt.appliedRecords[0].questionUid, "uid1");
  assert.equal(receipt.runtimeRecords[0].questionUid, "uid1");
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), before);
  assert.deepEqual(f.read(META).records[1], omitted);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("partial registrar refuses unknown aliases and a conflicting or ambiguous identity lookup", t => {
  for (const mutate of [
    (q, id) => { q.questionUid = "other|1"; },
    (q, id) => { q.questionUid = "qid_v1_" + "a".repeat(64); },
    (q, id) => { q.sourceQid = 2; },
    (q, id) => { id.lookup.bySourceFileAndOrdinal["fixture/exam.js"][1] = "uid2"; },
    (q, id) => { id.lookup.bySourceFileAndQuestionNo["fixture/exam.js"][1].push("uid2"); },
  ]) {
    const f = partialFixture(t), q = addLegacyAlias(f), id = f.read("archive/data/question_identity_map.json");
    mutate(q, id); f.put("archive/data/question_identity_map.json", id); f.writeBank(q);
    const before = fs.readFileSync(path.join(f.root, META));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /source UID mismatch/);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  }
});

test("a valid source alias never excuses identity fingerprint drift", t => {
  const f = partialFixture(t); addLegacyAlias(f);
  const id = f.read("archive/data/question_identity_map.json");
  id.records[0].sourceFingerprint = "a".repeat(64); f.put("archive/data/question_identity_map.json", id);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /identity fingerprint before required/);
});

test("partial UID dry-run and write preserve the omitted HOLD and source bytes", t => {
  const f = partialFixture(t);
  const raw = p => fs.readFileSync(path.join(f.root, p), "utf8");
  const before = raw(META), source = raw(f.sourcePath);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
  assert.equal(raw(META), before);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  // The untouched hold row keeps its exact content; the written file uses the one-record-per-line form.
  const heldRow = text => JSON.parse(text).records.find(r => r.questionUid === f.hold.questionUid);
  assert.deepEqual(heldRow(before), f.hold);
  assert.deepEqual(heldRow(raw(META)), f.hold);
  assert.ok(raw(META).includes(`\n    ${JSON.stringify(f.hold)}`));
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
  assert.equal(Object.hasOwn(receipt, "expectedQuestionCount"), false);
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
    assert.deepEqual([item.scope, item.totalQuestions, item.partialUidCount, item.expectedQuestionCount], ["PARTIAL_UIDS", 1, 1, 2]);
  assert.deepEqual(f.read(META), meta);
  const receipt = f.read(f.receiptPath);
  receipt.appliedRecords[0] = meta.records[1];
  f.put(f.receiptPath, receipt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /partial receipt UID scope mismatch/);
});

test("partial UID replay rejects a missing or changed original source denominator", t => {
  const f = partialFixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath);
  for (const count of [undefined, 1, 3]) {
    f.put(f.receiptPath, { ...receipt, expectedQuestionCount: count });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /partial receipt UID scope mismatch/);
  }
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

function reviewedSourceFixture(t, schema = "m3-s2-complete-semantic-review-v1", mutateReview = () => {}, completeActiveMetadata = false) {
  const f = itemRebindFixture(t, completeActiveMetadata);
  const git = (...args) => execFileSync("git", args, { cwd: f.root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const commit = () => { git("add", "--", f.sourcePath, "docs/native-review.json");
    git("-c", "user.name=Fixture reviewer", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "-qm", "Reviewed current source");
    return git("rev-parse", "HEAD"); };
  Object.assign(f.current, { content: "실제 재검토한 새 발문", image: "assets/reviewed-figure.svg" });
  if (completeActiveMetadata) {
    const difficulty = { difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' };
    Object.assign(f.current, difficulty); Object.assign(f.item.after, difficulty);
    for (const key of Object.keys(difficulty)) f.item.before[key] = f.read(META).records[0][key] ?? null;
  }
  const bytes = f.writeBank(f.current), sourceBlob = git("hash-object", "-w", f.sourcePath);
  Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
  const after = structuredClone(f.item.after);
  delete after.sourceFingerprint; delete after.contentFingerprint;
  const isM3 = schema === "m3-s2-complete-semantic-review-v1";
  const ordinalKey = isM3 ? "ordinal" : "sourceOrdinal";
  const rows = [{ [ordinalKey]: 1, questionUid: "uid1", after, decisiveStep: "실제 검토한 문항의 결정 단계",
    ...(isM3 ? { decision: "CORRECT", debts: [] } : { verdict: "REGISTRATION_PENDING", rpmDecision: "CORRECT",
      fieldReview: { classification: "실제 주분류 검토", difficulty: "실제 난도 검토" }, contentDebt: [], registrationDebt: ["RESOLVER_PROOF_PENDING"] }) },
    { [ordinalKey]: 2, questionUid: "uid2", after: {}, decisiveStep: "보류 문항은 이번 요청에서 제외",
      ...(isM3 ? { decision: "REVIEW_COMPLETE_WITH_SOURCE_PREREQUISITE_HOLD" } : { verdict: "UNRESOLVED", rpmDecision: "UNRESOLVED" }) }];
  let review = { schemaVersion: schema, sourceArchiveFile: f.request.sourceArchiveFile, items: rows };
  f.put("docs/native-review.json", {});
  if (isM3) Object.assign(review, { author: "native-author", rootIntegrator: "native-integrator", questionCount: 2,
    sourceAfterBlob: sourceBlob, sourceAfterSha256: hash(bytes), mathR1R2R3: "NOT_RUN_OUT_OF_SCOPE" });
  else {
    const baseSha = commit();
    Object.assign(review, { owner: "native-author", reviewedQuestionCount: 2, sourceGitBlobSha: sourceBlob, baseSha });
    if (schema === "m2-s1-meta-review-v1") rows[0].sourceEvidence = { sourceGitBlobSha: sourceBlob, fingerprints: [
      { scope: "QBODY", algo: "sha256-canonical-json-v1", value: f.bodySha(f.current) },
      { scope: "QFULL", algo: "sha256-canonical-json-v1", value: f.sourceSha(f.current) }] };
  }
  const updateReview = () => {
    f.put("docs/native-review.json", review);
    const reviewCommit = commit();
    const ref = { path: "docs/native-review.json", sha256: hash(fs.readFileSync(path.join(f.root, "docs/native-review.json"))) };
    f.request.approval.evidenceRefs = [...f.evidenceRefs, ref];
    f.item.evidenceRefs = [...f.evidenceRefs, ref];
    f.item.sourceReview = { schemaVersion: "archive-reviewed-source-reassessment-v1", reviewCommit,
      reviewPath: "docs/native-review.json", reviewRef: ref };
    return ref;
  };
  delete f.item.rebind;
  mutateReview(review);
  updateReview();
  return { ...f, git, review, updateReview };
}

function rendererContinuityFixture(t, schema = 'm3-s2-complete-semantic-review-v1', mutateReview, completeActiveMetadata = false) {
  const f = reviewedSourceFixture(t, schema, mutateReview, completeActiveMetadata);
  const oldAssetPath = "archive/assets/reviewed-figure.svg", assetPath = "archive/assets/current-figure.svg";
  f.put(oldAssetPath, '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>');
  f.git("add", "--", oldAssetPath);
  const nativeRef = f.updateReview(), nativeCommit = f.item.sourceReview.reviewCommit;
  const nativeQuestion = structuredClone(f.current);
  const commit = (...paths) => {
    if (paths.length) f.git("add", "--", ...paths);
    f.git("-c", "user.name=Renderer fixture", "-c", "user.email=renderer@example.invalid", "commit", "--allow-empty", "-qm", "Exact inspected renderer snapshot");
    return f.git("rev-parse", "HEAD");
  };
  const sourceRef = (c, q) => ({ commit: c, path: f.sourcePath, gitBlobSha1: f.git("rev-parse", `${c}:${f.sourcePath}`),
    sha256: hash(f.git("show", `${c}:${f.sourcePath}`) + "\n"), questionSha256: hash(stable(q)) });
  const assetRef = (c, p, phase) => ({ commit: c, path: p, gitBlobSha1: f.git("rev-parse", `${c}:${p}`),
    sha256: hash(f.git("show", `${c}:${p}`)), phase, visuallyInspected: true });
  const prefigureCommit = commit(), prefigure = sourceRef(prefigureCommit, f.current);
  f.current.image = "assets/current-figure.svg";
  f.put(assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L2 2"/></svg>');
  f.writeBank(f.current);
  const currentCommit = commit(f.sourcePath, assetPath), current = sourceRef(currentCommit, f.current);
  Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
  const original = { commit: nativeCommit, path: f.item.sourceReview.reviewPath, sha256: nativeRef.sha256 };
  const independentPath = "docs/independent-renderer-review.json", manifestPath = "docs/renderer-continuity.json";
  const independent = { schemaVersion: "archive-independent-narrow-renderer-review-v1", reviewer: "independent-renderer-reviewer",
    status: "PASS_NARROW_CURRENT_RENDERER_REVIEW", currentSourceCommit: currentCommit, nativeReviewCommit: nativeCommit,
    counts: { newFullMathApprovals: 0, newMetadataApprovals: 0, newDifficultyApprovals: 0 }, rows: [{
      questionUid: "uid1", sourceOrdinal: 1, decision: "PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION", visualInspectionPerformed: true,
      nativeReviewRef: original, nativeItemCanonicalSha256: hash(stable(f.review.items[0])),
      nativeSourceRef: sourceRef(nativeCommit, nativeQuestion), currentSourceRef: current,
      previousQuestionSha256: hash(stable(nativeQuestion)), currentQuestionSha256: hash(stable(f.current)),
      unchangedFields: ["content", "choices", "answer", "solution", "id", "level", "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"],
      rendererAssets: [assetRef(nativeCommit, oldAssetPath, "native"), assetRef(currentCommit, assetPath, "current")],
      observed: "The changed renderer preserves the exact problem, solution and numerical labels." }] };
  const manifest = { schemaVersion: "archive-reviewed-renderer-continuity-evidence-v1",
    scope: "NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER", sourceArchiveFile: f.request.sourceArchiveFile,
    expectedQuestionCount: 2, selectedUidCount: 1, newFullMathematicalQa: false, newReviewPassCount: 0,
    newMetadataApprovals: 0, newDifficultyJudgments: 0, items: [{ questionUid: "uid1", sourceOrdinal: 1,
      nativeReviewRef: original, nativeItemSha256: hash(stable(f.review.items[0])), prefigureSourceRef: prefigure,
      currentSourceRef: current, independentReviewRef: null }] };
  const republish = () => {
    f.put(independentPath, independent);
    const reviewRef = { path: independentPath, sha256: hash(fs.readFileSync(path.join(f.root, independentPath))) };
    manifest.items[0].independentReviewRef = reviewRef;
    f.put(manifestPath, manifest);
    const manifestRef = { path: manifestPath, sha256: hash(fs.readFileSync(path.join(f.root, manifestPath))) };
    const reviewCommit = commit(independentPath, manifestPath);
    const refs = [...f.evidenceRefs, nativeRef, reviewRef, manifestRef];
    f.request.approval.evidenceRefs = refs; f.item.evidenceRefs = refs;
    f.item.sourceReview.rendererProof = { schemaVersion: "archive-reviewed-current-renderer-continuity-v1", reviewCommit, reviewRef: manifestRef };
  };
  republish();
  return { ...f, oldAssetPath, assetPath, independentPath, manifestPath, independent, manifest, republish, commit, sourceRef, assetRef, nativeQuestion };
}

function correctiveRendererContinuityFixture(t) {
  const f = rendererContinuityFixture(t), oldSolution = 'archive/assets/intermediate-solution.svg', newSolution = 'archive/assets/corrected-solution.svg';
  const removed = '<line x1="1" y1="1" x2="2" y2="2"/>', oldDescription = 'Inspected incorrect equality mark', newDescription = 'Only the justified relation is shown';
  const oldSvg = `<svg xmlns="http://www.w3.org/2000/svg"><desc id="desc">${oldDescription}</desc>${removed}<path d="M0 0L2 2"/></svg>`;
  f.put(oldSolution, oldSvg);
  Object.assign(f.current, { solutionImage: oldSolution.slice('archive/'.length), solutionImageAlt: oldDescription });
  f.writeBank(f.current); const intermediateQuestion = structuredClone(f.current), intermediateCommit = f.commit(f.sourcePath, oldSolution);
  const intermediate = f.sourceRef(intermediateCommit, intermediateQuestion);
  f.put(newSolution, oldSvg.replace(removed, '').replace(oldDescription, newDescription));
  Object.assign(f.current, { solutionImage: newSolution.slice('archive/'.length), solutionImageAlt: newDescription });
  f.writeBank(f.current); const correctedCommit = f.commit(f.sourcePath, newSolution), corrected = f.sourceRef(correctedCommit, f.current);
  const beforeRef = structuredClone(intermediate); delete beforeRef.questionSha256;
  for (const key of Object.keys(f.independent)) delete f.independent[key];
  Object.assign(f.independent, { schemaVersion: 'archive-narrow-solution-renderer-correction-independent-review-v1',
    reviewer: 'independent-corrective-renderer-reviewer', decision: 'APPROVE_EXACT_RENDERER_CORRECTION_AND_ALT_ONLY',
    questionUid: 'uid1', sourceOrdinal: 1, beforeSourceRef: beforeRef, beforeQuestionStableSha256: intermediate.questionSha256,
    proposedSourceRef: corrected, afterQuestionStableSha256: corrected.questionSha256, metadataApprovalsAdded: 0,
    difficultyJudgmentsAdded: 0, fullMathematicalQa: false, newReviewPassCount: 0, allOtherSvgBytesUnchanged: true,
    changedSourceFields: ['solutionImage', 'solutionImageAlt'], sourceQuestionCount: 2, unselectedQuestionsUnchanged: 1,
    assetBefore: f.assetRef(intermediateCommit, oldSolution, 'current'), assetAfter: f.assetRef(correctedCommit, newSolution, 'corrected'),
    descriptionBefore: oldDescription, descriptionAfter: newDescription, exactRemovedNodes: [removed],
    rendererInputs: [f.assetRef(f.item.sourceReview.reviewCommit, f.oldAssetPath, 'native'),
      f.assetRef(intermediateCommit, f.assetPath, 'current'), f.assetRef(intermediateCommit, oldSolution, 'current')],
    visualFinding: 'The exact inspected mark and its dependent description are corrected; all other source and SVG values are unchanged.' });
  f.manifest.items[0].currentSourceRef = corrected;
  Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
  f.republish();
  return { ...f, intermediate, intermediateQuestion, oldSolution, newSolution };
}

function rendererV2Fixture(t, { insertions = false, transformContainer = value => value, extraDelta = {},
  nativeSchema = 'm3-s2-complete-semantic-review-v1', mutateReview, completeActiveMetadata = false } = {}) {
  const f = rendererContinuityFixture(t, nativeSchema, mutateReview, completeActiveMetadata), previous = structuredClone(f.nativeQuestion);
  const secondAsset = 'archive/assets/current-relic.svg';
  f.put(secondAsset, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="2"/></svg>');
  Object.assign(f.current, { imageAlt: 'The two given radii and perpendicular foot', imageSize: 'full' }, extraDelta);
  if (insertions) {
    const container = (asset, width) => transformContainer(`<div class="question-image"><img src="${asset}" alt="Inspected diagram" style="width:${width}px;max-width:100%;height:auto"></div>`);
    const one = container(f.assetPath.slice('archive/'.length), 156), two = container(secondAsset.slice('archive/'.length), 248);
    f.current.content = previous.content.slice(0, 2) + one + previous.content.slice(2) + two;
    f.current.image = '';
    f.insertedContainers = [one, two];
  }
  f.writeBank(f.current);
  const currentCommit = f.commit(f.sourcePath, secondAsset), current = f.sourceRef(currentCommit, f.current);
  Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
  f.manifest.items[0].currentSourceRef = current;
  const delta = [...new Set([...Object.keys(previous), ...Object.keys(f.current)])]
    .filter(k => stable(previous[k]) !== stable(f.current[k])).sort();
  const fieldHash = (q, field) => hash(stable({ present: Object.hasOwn(q, field), value: q[field] ?? null }));
  const transition = { kind: insertions ? 'TWO_EXACT_IMAGE_CONTAINERS_INSERTED' : 'UNCHANGED',
    beforeSha256: hash(previous.content), afterSha256: hash(f.current.content) };
  if (insertions) transition.insertions = f.insertedContainers.map(raw => {
    const start = f.current.content.indexOf(raw), asset = raw.match(/src="([^"]+)"/)?.[1];
    return { startByte: Buffer.byteLength(f.current.content.slice(0, start)), byteLength: Buffer.byteLength(raw),
      sha256: hash(raw), assetPath: 'archive/' + asset };
  });
  const beforeAssets = [f.assetRef(f.item.sourceReview.reviewCommit, f.oldAssetPath, 'before')];
  const currentAssets = [f.assetRef(currentCommit, f.assetPath, 'current'), ...(insertions ? [f.assetRef(currentCommit, secondAsset, 'current')] : [])];
  for (const key of Object.keys(f.independent)) delete f.independent[key];
  Object.assign(f.independent, { schemaVersion: 'archive-independent-current-renderer-review-v2',
    scope: 'EXACT_RENDERER_METADATA_AND_TWO_IMAGE_CONTAINERS', reviewer: 'independent-v2-renderer-reviewer',
    decision: 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION', nativeReviewCommit: f.item.sourceReview.reviewCommit,
    prefigureCommit: f.manifest.items[0].prefigureSourceRef.commit, currentCommit,
    counts: { selected: 1, newFullMathApprovals: 0, newMetadataApprovals: 0, newDifficultyApprovals: 0, newReviewPassCount: 0 }, rows: [{
      questionUid: 'uid1', sourceOrdinal: 1, decision: 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION', visualInspectionPerformed: true,
      nativeReviewRef: f.manifest.items[0].nativeReviewRef, nativeItemSha256: hash(stable(f.review.items[0])),
      nativeSourceRef: f.sourceRef(f.item.sourceReview.reviewCommit, previous),
      prefigureSourceRef: f.manifest.items[0].prefigureSourceRef, currentSourceRef: current,
      changedRendererFields: delta, fieldDeltaHashes: delta.map(field => ({ field,
        beforeSha256: fieldHash(previous, field), afterSha256: fieldHash(f.current, field) })),
      contentTransition: transition, nonRendererFieldChanges: [], mathematicalStemBytesUnchanged: true,
      choicesAnswerSolutionDifficultyUnchanged: true, assets: { before: beforeAssets, current: currentAssets },
      visualEvidence: { contactSha256: 'c'.repeat(64), renderedAssetCount: new Set([...beforeAssets, ...currentAssets].map(a => a.sha256)).size },
      observed: 'Only the exact inspected rendering properties changed; the mathematical statement and existing solution are preserved.' }] });
  f.republish();
  return { ...f, secondAsset, v2row: f.independent.rows[0] };
}

for (const nativeSchema of ['m3-s2-complete-semantic-review-v1', 'm2-s2-meta-review-v1'])
for (const insertions of [false, true]) test(nativeSchema + ' renderer v2 official write/replay and native reuse preserve exact inspected ' +
    (insertions ? 'two image containers' : 'image description and size'), t => {
  const f = rendererV2Fixture(t, { insertions, nativeSchema }), nativeBytes = fs.readFileSync(path.join(f.root, 'docs/native-review.json'));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;
  assert.equal(proof.transitionContract.schemaVersion, 'archive-independent-current-renderer-review-v2');
  assert.equal(proof.transitionContract.contentTransition.kind, insertions ? 'TWO_EXACT_IMAGE_CONTAINERS_INSERTED' : 'UNCHANGED');
  assert.equal(proof.transitionContract.contentTransition.mathematicalStemSha256, hash(f.nativeQuestion.content));
  assert.deepEqual([proof.newMathematicalQa, proof.newMetadataApprovals, proof.newDifficultyJudgments], [false, 0, 0]);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString());
  const identity = f.read('archive/data/question_identity_map.json').records.find(r => r.questionUid === 'uid1');
  const source = { root: f.root, bytes, blobSha1: blob(bytes), bank, runtimeRecord: receipt.runtimeRecords[0] };
  const registry = loadActiveMetaRegistry(f.root);
  for (const previous of [f.nativeQuestion, bank[0]])
    assert.equal(nativeReviewedRendererRebind(receipt, source, previous, bank[0], identity, 1, receipt.appliedRecords[0], registry), true);
  assert.deepEqual(f.read(META).records[1], f.hold);
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'docs/native-review.json')), nativeBytes);
});

test('m2-s2 renderer continuation preserves independent source, reviewer and asset gates', async t => {
  for (const [name, mutateReview, error] of [
    ['native source-only review', review => { Object.assign(review.items[0], { verdict: 'SOURCE_ONLY', rpmDecision: 'UNRESOLVED' }); }, /native semantic decision/],
    ['native content hold', review => { review.items[0].contentDebt = ['SOURCE_SCAN_REQUIRED']; }, /explicit source\/content\/difficulty hold/],
    ['native denominator', review => { review.reviewedQuestionCount = 1; }, /denominator/],
    ...['SOURCE_ONLY', 'UNRESOLVED', undefined].map(verdict => [
      `unsettled verdict ${verdict} cannot borrow a settled RPM decision`,
      review => { review.items[0].verdict = verdict; }, /exclusive native-semantic/]),
  ]) await t.test(name, t => {
    const f = rendererV2Fixture(t, { nativeSchema: 'm2-s2-meta-review-v1', mutateReview });
    const before = fs.readFileSync(path.join(f.root, META));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), error);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  });
  for (const [name, mutate, error] of [
    ['same author and renderer reviewer', f => { f.independent.reviewer = f.review.owner; }, /independent reviewer/],
    ['uninspected asset', f => { f.v2row.assets.current[0].visuallyInspected = false; }, /visual inspection/],
    ['wrong current source', f => { f.v2row.currentSourceRef.gitBlobSha1 = '0'.repeat(40); }, /source/],
    ['new approval claim', f => { f.independent.counts.newMetadataApprovals = 1; }, /independent renderer review/],
  ]) await t.test(name, t => {
    const f = rendererV2Fixture(t, { nativeSchema: 'm2-s2-meta-review-v1' });
    const before = fs.readFileSync(path.join(f.root, META));
    mutate(f); f.republish();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), error);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  });
  for (const extraDelta of [{ answer: 'unreviewed' }, { solution: 'unreviewed' }, { difficultyBucket: 5 }]) {
    const f = rendererV2Fixture(t, { nativeSchema: 'm2-s2-meta-review-v1', extraDelta });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity|source\/approved metadata parity/);
  }
  const unsupported = rendererV2Fixture(t, { nativeSchema: 'm2-s1-meta-review-v1' });
  assert.throws(() => registerReviewedExamV2({ root: unsupported.root, request: unsupported.request }), /exclusive native-semantic/);
});

function fourSlotRendererFixture(t) {
  const f=rendererV2Fixture(t,{nativeSchema:'m2-s2-meta-review-v1',completeActiveMetadata:true});
  const index=f.read(`${CANON}/registry_index.json`);index.status='ACTIVE';
  index.canonicalSources.push({path:`${CANON}/metadata_rules.json`});f.put(`${CANON}/registry_index.json`,index);
  f.put(`${CANON}/metadata_rules.json`,{status:'ACTIVE',integrationPatterns:['NONE']});
  const conditions=f.read(`${CANON}/condition_registry.json`);conditions.status='ACTIVE';f.put(`${CANON}/condition_registry.json`,conditions);
  registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const compactPath='archive/data/item-4slot/'+f.request.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
  const item={ordinal:1,format:'단일 정답',given:[],goal:[1],method:[2],condition:[],candidates:[]};
  const compact={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:f.request.sourceArchiveFile,
    sourceGitBlobSha:f.manifest.items[0].prefigureSourceRef.gitBlobSha1,dictionaryVersion:'1.0',
    reviewedBy:{agent:'existing-slot-reviewer',at:'2026-11-15',sampled:[1]},
    evidence:{branch:'existing-native-review',commit:f.item.sourceReview.reviewCommit,path:'docs/existing-slots.json'},items:[item]};
  f.put(compactPath,compact);
  const dictionaryPath='docs/architecture/4slot/term-dictionary-v1.0.json';
  f.put(dictionaryPath,{dictionaryVersion:'1.0',terms:[{id:1,ko:'값',status:'ACTIVE'},{id:2,ko:'계산',status:'ACTIVE'}]});
  const ref=p=>({path:p,sha256:hash(fs.readFileSync(path.join(f.root,p)))});
  const sidecarPath='.archive-meta-register/4slot-renderer-continuity/fixture.json';
  const doc={schemaVersion:'archive-four-slot-registered-renderer-continuity-v1',scope:'EXISTING_VECTOR_ONLY',
    sourceArchiveFile:f.request.sourceArchiveFile,questionUid:'uid1',sourceOrdinal:1,sourceQuestionNo:'1',sourceDisplayNumber:1,
    compactRef:ref(compactPath),compactItemSha256:hash(stable(item)),dictionaryRef:ref(dictionaryPath),
    currentSourceRef:{...ref(f.sourcePath),gitBlobSha1:blob(fs.readFileSync(path.join(f.root,f.sourcePath)))},
    receiptRef:ref(f.receiptPath),rendererBindingRef:ref(f.receiptPath.replace(/\.json$/,'.renderer-binding.json')),
    independentReviewRef:ref(f.independentPath),newFourSlotApprovals:0,newMathematicalQa:false};
  f.put(sidecarPath,doc);
  return {...f,compactPath,compact,item,dictionaryPath,sidecarPath,doc,ref};
}
test('four-slot registered renderer continuity reuses only the exact issued receipt and unchanged vector',t=>{
  const f=fourSlotRendererFixture(t),before=fs.readFileSync(path.join(f.root,f.compactPath));
  const result=verifyRegisteredRendererContinuity(f.root,f.sidecarPath);
  assert.deepEqual(result,{status:'PASS',questionUid:'uid1',sourceOrdinal:1,sourceBinding:'REGISTERED_RENDERER_CONTINUITY',independentReviewClaim:false,newFourSlotApprovals:0});
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.compactPath)),before);
  const child=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('../tools/4slot/registered-renderer-continuity.mjs',import.meta.url)),f.root,f.sidecarPath],{encoding:'utf8'}));
  assert.deepEqual(child,result);
  assert.equal(verifyRegisteredRendererContinuity(f.root,f.sidecarPath).status,'PASS');
});
test('four-slot registered renderer continuity rejects drift without weakening the native proof',async t=>{
  for(const [name,mutate,error]of[
    ['changed vector',f=>{f.compact.items[0].method=[1];f.put(f.compactPath,f.compact);},/BOUND_FILE_CHANGED/],
    ['changed dictionary',f=>f.put(f.dictionaryPath,{dictionaryVersion:'1.0',terms:[]}),/BOUND_FILE_CHANGED/],
    ['unregistered receipt',f=>fs.rmSync(path.join(f.root,f.receiptPath)),/ENOENT/],
    ['changed independent witness',f=>{f.independent.reviewer='someone else';f.put(f.independentPath,f.independent);},/BOUND_FILE_CHANGED/],
    ['changed asset',f=>f.put(f.assetPath,'<svg/>'),/live renderer bytes changed/],
    ['wrong UID',f=>{f.doc.questionUid='uid2';f.put(f.sidecarPath,f.doc);},/SELECTED_RENDERER_PROOF_REQUIRED/],
    ['wrong ordinal',f=>{f.doc.sourceOrdinal=2;f.put(f.sidecarPath,f.doc);},/SOURCE_NUMBER_MISMATCH/],
    ['new slot approval claim',f=>{f.doc.newFourSlotApprovals=1;f.put(f.sidecarPath,f.doc);},/CLOSED_CONTINUITY_SCOPE/],
    ['current metadata changed',f=>{const m=f.read(META);m.records[0].difficultyBucket=5;f.put(META,m);},/REGISTERED_METADATA_DRIFT/],
    ['inactive current registry',f=>{const r=f.read(CANON+'/registry_index.json');r.status='INACTIVE';f.put(CANON+'/registry_index.json',r);},/CURRENT_ACTIVE_BINDING_REQUIRED/],
    ...['missing','inactive','changed'].map(kind=>['current runtime '+kind,f=>{
      const directory='archive/data/meta-foundation/runtime';
      for(const name of fs.readdirSync(path.join(f.root,directory))){const p=directory+'/'+name,r=f.read(p),row=r.records?.find(x=>x.questionUid==='uid1');if(!row)continue;
        if(kind==='missing')r.records=r.records.filter(x=>x.questionUid!=='uid1');else if(kind==='inactive')r.status='INACTIVE';else row.templateKey='UNREVIEWED';f.put(p,r);
      }
    },/CURRENT_RUNTIME_/]),
    ['current source changed',f=>{f.current.solution+=' changed';f.writeBank(f.current);},/CURRENT_SOURCE_CHANGED/],
    ['held compact item',f=>{f.item.registrationHold={reason:'SOURCE_EVIDENCE_UNRESOLVED'};f.put(f.compactPath,f.compact);f.doc.compactRef=f.ref(f.compactPath);f.doc.compactItemSha256=hash(stable(f.item));f.put(f.sidecarPath,f.doc);},/EXACT_UNHELD_VECTOR_REQUIRED/],
  ])await t.test(name,t=>{const f=fourSlotRendererFixture(t);mutate(f);assert.throws(()=>verifyRegisteredRendererContinuity(f.root,f.sidecarPath),error);});
});

test('renderer v2 fingerprint-only reuse preserves the issued registered rationale origin and RPM proof', t => {
  const f = rendererV2Fixture(t), value = f.review.items[0].decisiveStep;
  const transported = { primaryMethod: value, decisiveStep: value, rpmSemanticStatus: 'FINAL',
    rpmL3: 'reviewed-rpm-l3', rpmL4: 'reviewed-rpm-l4' };
  const before = { ...f.nativeQuestion, ...transported };
  f.writeBank(before);
  const prefigureCommit = f.commit(f.sourcePath), prefigure = f.sourceRef(prefigureCommit, before);
  Object.assign(f.current, transported); f.writeBank(f.current);
  const currentCommit = f.commit(f.sourcePath), currentRef = f.sourceRef(currentCommit, f.current);
  Object.assign(f.independent, { prefigureCommit, currentCommit });
  Object.assign(f.v2row, { prefigureSourceRef: prefigure, currentSourceRef: currentRef });
  Object.assign(f.manifest.items[0], { prefigureSourceRef: prefigure, currentSourceRef: currentRef });
  const metadata = f.read(META), oldFingerprints = { sourceFingerprint: metadata.records[0].sourceFingerprint,
    contentFingerprint: metadata.records[0].contentFingerprint ?? null };
  Object.assign(metadata.records[0], f.review.items[0].after, transported,
    { metadataApprovalType: 'FINAL_QA', metadataStatus: 'approved_semantic_review',
      reviewStatus: 'reviewed_pass', tagStatus: 'reviewed_pass', metaFoundationStatus: 'ACTIVE',
      L1: '새 단원', L2: '새 세부단원', L3: '새 유형', L4: '새 풀이 구조' });
  f.put(META, metadata); f.item.before = oldFingerprints;
  f.item.after = { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) };
  f.republish();
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview;
  assert.equal(proof.rationaleBindings.primaryMethod.origin, 'REGISTERED_NATIVE_DECISIVE_STEP_UNCHANGED');
  assert.equal(proof.rationaleBindings.decisiveStep.origin, 'NATIVE_ITEM_FIELD');
  assert.deepEqual(Object.keys(proof.rpmBindings).sort(), ['rpmL3', 'rpmL4']);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString());
  const identity = f.read('archive/data/question_identity_map.json').records.find(r => r.questionUid === 'uid1');
  const source = { root: f.root, bytes, blobSha1: blob(bytes), bank, runtimeRecord: receipt.runtimeRecords[0] };
  const registry = loadActiveMetaRegistry(f.root), current = receipt.appliedRecords[0];
  for (const previous of [f.nativeQuestion, bank[0]])
    assert.equal(nativeReviewedRendererRebind(receipt, source, previous, bank[0], identity, 1, current, registry), true);
  for (const delta of [{ primaryMethod: value + ' drift' }, { decisiveStep: value + ' drift' }, { rpmL3: 'unreviewed' }])
    assert.throws(() => nativeReviewedRendererRebind(receipt, source, bank[0], { ...bank[0], ...delta }, identity, 1, current, registry),
      /source reassessment:|native renderer reassessment proof differs/);
  assert.deepEqual(f.read(META).records[1], f.hold);
});

test('renderer v2 remains a closed immutable independent review contract', async t => {
  for (const [name, mutate] of [
    ['unknown scope', f => { f.independent.scope = 'ANY_HTML'; }],
    ['unknown version', f => { f.independent.schemaVersion += '-next'; }],
    ['new metadata approval', f => { f.independent.counts.newMetadataApprovals = 1; }],
    ['uninspected asset', f => { f.v2row.assets.current[0].visuallyInspected = false; }],
    ['omitted asset', f => { f.v2row.assets.current.pop(); }],
    ['changed field digest', f => { f.v2row.fieldDeltaHashes[0].afterSha256 = 'a'.repeat(64); }],
    ['changed native binding', f => { f.v2row.nativeItemSha256 = 'a'.repeat(64); }],
    ['missing insertion', f => { f.v2row.contentTransition.insertions.pop(); }],
    ['changed insertion offset', f => { f.v2row.contentTransition.insertions[0].startByte++; }],
    ['overlapping insertion', f => { f.v2row.contentTransition.insertions[1].startByte = 0; }],
    ['changed insertion hash', f => { f.v2row.contentTransition.insertions[0].sha256 = 'a'.repeat(64); }],
    ['unbound image path', f => { f.v2row.contentTransition.insertions[0].assetPath = 'archive/assets/other.svg'; }],
    ['non-image text removal', f => { f.v2row.contentTransition.beforeSha256 = hash(f.nativeQuestion.content.slice(1)); }],
  ]) await t.test(name, t => {
    const f = rendererV2Fixture(t, { insertions: true }); mutate(f); f.republish();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewed renderer continuity:/);
  });
});

test('renderer v2 refuses arbitrary HTML even when the new containers are hash-bound', async t => {
  for (const [name, transformContainer] of [
    ['extra script element', x => x.replace('</div>', '<script>alert(1)</script></div>')],
    ['event handler', x => x.replace(' alt=', ' onload="alert(1)" alt=')],
    ['unquoted source', x => x.replace(/src="([^"]+)"/, 'src=$1')],
    ['external source', x => x.replace('src="assets/', 'src="https://example.invalid/')],
    ['encoded traversal', x => x.replace('src="assets/', 'src="assets/%2e%2e/')],
    ['link wrapper', x => x.replace('<img ', '<a href="assets/other.svg"><img ').replace('</div>', '</a></div>')],
    ['arbitrary style', x => x.replace('height:auto', 'height:auto;background:url(assets/other.svg)')],
  ]) await t.test(name, t => {
    const f = rendererV2Fixture(t, { insertions: true, transformContainer });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewed renderer continuity:/);
  });
});

test('renderer v2 cannot change answers, difficulty, metadata, or uninspected live image properties', async t => {
  for (const [name, extraDelta] of [
    ['answer', { answer: 'unreviewed' }], ['solution', { solution: 'unreviewed' }],
    ['difficulty', { difficultyBucket: 5 }], ['new primary method', { primaryMethod: 'unreviewed' }],
    ['HTML alternative', { imageAlt: '<b>new</b>' }], ['unsafe size', { imageSize: 'full;display:none' }],
  ]) await t.test(name, t => {
    const f = rendererV2Fixture(t, { extraDelta });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity|source\/approved metadata parity/);
  });
  const f = rendererV2Fixture(t); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath), identity = f.read('archive/data/question_identity_map.json').records[0];
  const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString());
  const source = { root: f.root, bytes, blobSha1: blob(bytes), bank, runtimeRecord: receipt.runtimeRecords[0] };
  assert.throws(() => nativeReviewedRendererRebind(receipt, source, bank[0], { ...bank[0], imageAlt: 'Uninspected later alternative' },
    identity, 1, receipt.appliedRecords[0], loadActiveMetaRegistry(f.root)), /renderer|differs/);
  f.put(f.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><text>changed</text></svg>');
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /live renderer bytes changed/);
});

test('corrective renderer proof binds only the independently inspected intermediate input through official write and replay', t => {
  const f = correctiveRendererContinuityFixture(t), nativeBytes = fs.readFileSync(path.join(f.root, 'docs/native-review.json'));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  const proof = f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.rendererContinuity;
  const input = proof.independentlyReviewedCorrectionInput;
  assert.equal(input.schemaVersion, 'archive-inspected-renderer-correction-input-v1');
  assert.equal(input.scope, 'CORRECTION_INPUT_ONLY');
  assert.deepEqual(input.sourceRef, f.intermediate);
  assert.equal(input.rendererAssets.length, 2);
  assert.notEqual(input.studentPayloadSha256, proof.nativeStudentPayloadSha256);
  assert.notEqual(input.studentPayloadSha256, proof.currentStudentPayloadSha256);
  assert.deepEqual([proof.newMathematicalQa, proof.newMetadataApprovals, proof.newDifficultyJudgments], [false, 0, 0]);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).replay, true);
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'docs/native-review.json')), nativeBytes);
});

test('native renderer reuse accepts only the fully revalidated correction input as an intermediate cursor', t => {
  const f = correctiveRendererContinuityFixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath), current = receipt.appliedRecords[0], runtimeRecord = receipt.runtimeRecords[0];
  const identity = f.read('archive/data/question_identity_map.json').records.find(row => row.questionUid === 'uid1');
  const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString('utf8'));
  const nativeSource = { root: f.root, bytes, blobSha1: blob(bytes), bank, runtimeRecord }, registry = loadActiveMetaRegistry(f.root);
  const verify = prior => nativeReviewedRendererRebind(receipt, nativeSource, prior, bank[0], identity, 1, current, registry);
  assert.equal(verify(f.intermediateQuestion), true);
  assert.equal(verify(bank[0]), true);
  const unreviewed = { ...f.intermediateQuestion, solutionImageAlt: 'an unreviewed intermediate explanation' };
  assert.throws(() => verify(unreviewed), /previous student payload/);
  const renderer = receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;
  renderer.independentlyReviewedCorrectionInput.studentPayloadSha256 = 'b'.repeat(64);
  const bindingPath = f.receiptPath.replace(/\.json$/, '.renderer-binding.json');
  f.put(bindingPath, buildReviewedRendererBinding(receipt));
  receipt.outputDigests.find(ref => ref.path === bindingPath).sha256 = hash(fs.readFileSync(path.join(f.root, bindingPath)));
  f.put(f.receiptPath, receipt);
  assert.throws(() => verify(f.intermediateQuestion), /native renderer reassessment proof differs/);
});

test('corrective renderer intermediate binding refuses a different source, asset, UID or correction delta', t => {
  for (const mutate of [
    f => { f.independent.beforeSourceRef.commit = f.item.sourceReview.reviewCommit; },
    f => { f.independent.beforeSourceRef.path = 'archive/exams/original/other.js'; },
    f => { f.independent.beforeQuestionStableSha256 = 'a'.repeat(64); },
    f => { f.independent.questionUid = 'uid2'; },
    f => { f.independent.assetBefore.sha256 = 'a'.repeat(64); },
    f => { f.independent.rendererInputs.pop(); },
    f => { f.independent.exactRemovedNodes = ['<line x1="9" y1="1" x2="2" y2="2"/>']; },
    f => { f.independent.changedSourceFields.push('answer'); },
  ]) {
    const f = correctiveRendererContinuityFixture(t); mutate(f); f.republish();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewed renderer continuity:/);
  }
  for (const alter of [
    r => { delete r.fingerprintRepairs[0].sourceReview.rendererContinuity.independentlyReviewedCorrectionInput; },
    r => { r.fingerprintRepairs[0].sourceReview.rendererContinuity.independentlyReviewedCorrectionInput.studentPayloadSha256 = 'b'.repeat(64); },
  ]) {
    const f = correctiveRendererContinuityFixture(t); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    const receipt = f.read(f.receiptPath); alter(receipt); f.put(f.receiptPath, receipt);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /registered renderer|renderer/);
  }
});

test("compound renderer review keeps the original stale before and immutable semantic review through write/replay", t => {
  const f = rendererContinuityFixture(t), source = fs.readFileSync(path.join(f.root, f.sourcePath));
  const originalBefore = structuredClone(f.item.before), nativeBytes = fs.readFileSync(path.join(f.root, "docs/native-review.json"));
  assert.notEqual(originalBefore.sourceFingerprint, f.sourceSha(f.nativeQuestion));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).fingerprintRepairCount, 1);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;
  const bindingPath = f.receiptPath.replace(/\.json$/, ".renderer-binding.json"), binding = f.read(bindingPath);
  assert.equal(binding.schemaVersion, "archive-reviewed-renderer-binding-v1");
  assert.deepEqual(binding.records, [{ questionUid: "uid1", sourceOrdinal: 1,
    sourceReviewSha256: hash(stable(receipt.fingerprintRepairs[0].sourceReview)), fingerprintRepairSha256: hash(stable(receipt.fingerprintRepairs[0])) }]);
  assert.deepEqual([binding.expectedQuestionCount, binding.partialUidCount, binding.rendererUidCount], [2, 1, 1]);
  assert.equal(binding.requestSha256, receipt.requestSha256);
  assert.equal(receipt.appliedRecords[0].approvalEvidence.includes(bindingPath), true);
  assert.equal(receipt.runtimeRecords[0].approvalEvidence.includes(bindingPath), true);
  assert.deepEqual(receipt.outputDigests.filter(r => r.path === bindingPath), [{ path: bindingPath, sha256: hash(fs.readFileSync(path.join(f.root, bindingPath))) }]);
  assert.equal(proof.scope, "NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER");
  assert.deepEqual(proof.changedRendererFields, ["image"]);
  assert.deepEqual([proof.newMathematicalQa, proof.newMetadataApprovals, proof.newDifficultyJudgments], [false, 0, 0]);
  assert.equal(receipt.fingerprintRepairs[0].metadataBefore.sourceFingerprint, originalBefore.sourceFingerprint);
  assert.deepEqual(f.read(META).records[1], f.hold);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "docs/native-review.json")), nativeBytes);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("compound renderer review requires exact scope, inventory and original native bindings", t => {
  for (const mutate of [
    f => { f.manifest.scope = "ANY_CURRENT_CONTENT"; },
    f => { f.manifest.newMetadataApprovals = 1; },
    f => { f.manifest.newFullMathematicalQa = true; },
    f => { f.manifest.newReviewPassCount = 1; },
    f => { f.manifest.expectedQuestionCount = 1; },
    f => { f.manifest.items.push(structuredClone(f.manifest.items[0])); f.manifest.selectedUidCount = 2; },
    f => { f.manifest.items[0].nativeItemSha256 = "a".repeat(64); },
    f => { f.manifest.items[0].nativeReviewRef.sha256 = "a".repeat(64); },
    f => { f.manifest.items[0].currentSourceRef.path = "archive/exams/other.js"; },
    f => { f.manifest.items[0].prefigureSourceRef.questionSha256 = "a".repeat(64); },
    f => { f.independent.reviewer = f.review.author; },
    f => { f.independent.rows[0].visualInspectionPerformed = false; },
    f => { f.independent.rows[0].rendererAssets.pop(); },
  ]) {
    const f = rendererContinuityFixture(t); mutate(f); f.republish();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewed renderer continuity:/);
  }
});

test("compound renderer review never substitutes a prefigure before or authorizes new semantic fields", t => {
  for (const mutate of [
    f => { f.item.before.sourceFingerprint = f.sourceSha(f.nativeQuestion); },
    f => { f.item.identityBefore.sourceFingerprint = f.sourceSha(f.nativeQuestion); },
    f => { f.item.after.difficultyBucket = f.current.difficultyBucket === 3 ? 2 : 3; },
  ]) {
    const f = rendererContinuityFixture(t); mutate(f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /before|source\/approved metadata parity|not approved by native review|reviewed after value mismatch/);
  }
  for (const delta of [{ answer: "2" }, { solution: "unreviewed proof" }, { choices: ["2", "3"] }, { content: "new premise" }]) {
    const f = rendererContinuityFixture(t); Object.assign(f.current, delta); f.writeBank(f.current);
    Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /live student payload differs/);
  }
});

test("compound renderer review fails closed when proof or a bound reference is removed", t => {
  const noProof = rendererContinuityFixture(t); delete noProof.item.sourceReview.rendererProof;
  assert.throws(() => registerReviewedExamV2({ root: noProof.root, request: noProof.request }), /current student payload differs/);
  for (const where of ["approval", "item"]) {
    const f = rendererContinuityFixture(t);
    if (where === "approval") f.request.approval.evidenceRefs = f.request.approval.evidenceRefs.filter(r => r.path !== f.independentPath);
    else f.item.evidenceRefs = f.item.evidenceRefs.filter(r => r.path !== f.independentPath);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /review reference must bind approval and item/);
  }
  const local = rendererContinuityFixture(t);
  local.put(local.independentPath, { ...local.independent, reviewer: "local forgery" });
  assert.throws(() => registerReviewedExamV2({ root: local.root, request: local.request }), /evidence missing\/drift|SHA mismatch|review evidence missing or changed/);
});

test("compound renderer review checks live asset bytes and denies non-renderer changes between snapshots", t => {
  const asset = rendererContinuityFixture(t);
  asset.put(asset.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><text>unreviewed</text></svg>');
  assert.throws(() => registerReviewedExamV2({ root: asset.root, request: asset.request }), /live renderer bytes changed/);
  for (const delta of [{ answer: "2" }, { level: "상" }, { primaryMethod: "new method" }]) {
    const f = rendererContinuityFixture(t); Object.assign(f.current, delta); f.writeBank(f.current);
    for (const field of ["level", "primaryMethod"]) if (Object.hasOwn(delta, field)) {
      f.item.before[field] = f.read(META).records[0][field] ?? null; f.item.after[field] = delta[field];
    }
    const commit = f.commit(f.sourcePath);
    f.manifest.items[0].currentSourceRef = f.sourceRef(commit, f.current);
    f.republish();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /outside the inspected renderer fields/);
  }
});

test("compound renderer replay rechecks assets and rejects erased or altered stored continuity proof", t => {
  for (const mutate of [
    f => { f.put(f.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><text>later edit</text></svg>'); },
    f => { const r = f.read(f.receiptPath); delete r.fingerprintRepairs[0].sourceReview.rendererContinuity; f.put(f.receiptPath, r); },
    f => { const r = f.read(f.receiptPath); r.fingerprintRepairs[0].sourceReview.rendererContinuity.currentStudentPayloadSha256 = "a".repeat(64); f.put(f.receiptPath, r); },
  ]) {
    const f = rendererContinuityFixture(t);
    registerReviewedExamV2({ root: f.root, request: f.request, write: true }); mutate(f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewed renderer continuity:|registered renderer/);
  }
});

test("compound renderer typed sidecar binds real before values and cannot disappear with the receipt proof", async t => {
  for (const [name, mutate] of [
    ["sidecar file deleted", (f, p) => fs.rmSync(path.join(f.root, p))],
    ["sidecar digest deleted", (f, p, r) => { r.outputDigests = r.outputDigests.filter(d => d.path !== p); f.put(f.receiptPath, r); }],
    ["repair and manifest both deleted", (f, p, r) => { r.fingerprintRepairs = []; r.approval.evidenceRefs = r.approval.evidenceRefs.filter(d => d.path !== f.manifestPath); f.put(f.receiptPath, r); }],
    ["original metadata before changed", (f, p, r) => { r.fingerprintRepairs[0].metadataBefore.sourceFingerprint = "a".repeat(64); f.put(f.receiptPath, r); }],
    ["original identity before changed", (f, p, r) => { r.fingerprintRepairs[0].identityBefore.sourceFingerprint = "a".repeat(64); f.put(f.receiptPath, r); }],
    ["sidecar UID changed", (f, p) => { const d = f.read(p); d.records[0].questionUid = "uid2"; f.put(p, d); }],
    ["sidecar denominator changed", (f, p) => { const d = f.read(p); d.expectedQuestionCount = 1; f.put(p, d); }],
    ["sidecar approval marker removed", (f, p, r) => { r.appliedRecords[0].approvalEvidence = r.appliedRecords[0].approvalEvidence.filter(x => x !== p); f.put(f.receiptPath, r); }],
  ]) await t.test(name, t => {
    const f = rendererContinuityFixture(t); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    const p = f.receiptPath.replace(/\.json$/, ".renderer-binding.json"), receipt = f.read(f.receiptPath);
    mutate(f, p, receipt);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer|registered metadata drift/);
  });
});

test("partial source reassessment binds real review/source Git objects and preserves the omitted HOLD", t => {
  const f = reviewedSourceFixture(t), before = fs.readFileSync(path.join(f.root, META), "utf8");
  const sourceBytes = fs.readFileSync(path.join(f.root, f.sourcePath));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).fingerprintRepairCount, 1);
  assert.equal(fs.readFileSync(path.join(f.root, META), "utf8"), before);
  const out = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(out.totalQuestions, 1);
  for (const p of [META, "archive/data/question_identity_map.json"]) {
    const [row, held] = f.read(p).records;
    assert.equal(row.sourceFingerprint, f.sourceSha(f.current));
    assert.deepEqual(held, f.hold);
  }
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), sourceBytes);
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview;
  assert.equal(proof.reviewCommit, f.item.sourceReview.reviewCommit);
  assert.equal(proof.reviewedSourceBlobSha1, f.review.sourceAfterBlob);
  assert.equal(proof.newMathematicalQa, false);
  assert.equal(proof.scope, "METADATA_SOURCE_BINDING_ONLY");
  assert.equal(receipt.examFinalQaStatus, "NOT_EVALUATED_BY_REGISTRAR");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("native M2 S1/S2 reviews keep pending registration separate from settled field judgments", t => {
  for (const schema of ["m2-s1-meta-review-v1", "m2-s2-meta-review-v1"]) {
    const f = reviewedSourceFixture(t, schema);
    assert.equal(f.review.items[0].verdict, "REGISTRATION_PENDING");
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
    assert.equal(f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.nativeSchemaVersion, schema);
  }
});

test("reassessment refuses later changes to every protected student field even with truthful new hashes", t => {
  const changes = [{ content: "미검토 새 발문" }, { choices: ["3", "4"] }, { answer: "2" }, { solution: "미검토 풀이" },
    { image: "later.svg" }, { question: "미검토 별칭" }, { sourceQuestionNo: 7 }, { layoutTag: "wide" },
    { imageSize: "large" }, { solutionImage: "later-solution.svg" }, { number: 9 }, { sourceQid: "9" }, { sourceOrdinal: 9 }, { questionUid: "uid1" }];
  for (const change of changes) {
    const f = reviewedSourceFixture(t);
    Object.assign(f.current, change); f.writeBank(f.current);
    Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /current student payload differs/);
  }
});

test("reassessment requires immutable native review bytes, exact Git commit and dual evidence refs", t => {
  const f = reviewedSourceFixture(t), spec = structuredClone(f.item.sourceReview);
  for (const change of [{ reviewCommit: "a".repeat(40) }, { reviewCommit: f.review.sourceAfterBlob },
    { reviewPath: "docs/absent.json" }, { reviewPath: "../native-review.json" }]) {
    f.item.sourceReview = { ...spec, ...change };
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source reassessment:/);
  }
  f.item.sourceReview = spec;
  f.item.evidenceRefs = f.evidenceRefs;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewRef must bind approval and item/);
  f.item.evidenceRefs = [...f.evidenceRefs, spec.reviewRef];
  f.request.approval.evidenceRefs = f.evidenceRefs;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewRef must bind approval and item/);
  f.request.approval.evidenceRefs = [...f.evidenceRefs, spec.reviewRef];
  f.put("docs/native-review.json", { ...f.review, author: "rewritten-after-review" });
  const forged = { path: spec.reviewRef.path, sha256: hash(fs.readFileSync(path.join(f.root, spec.reviewRef.path))) };
  f.item.sourceReview.reviewRef = forged; f.item.evidenceRefs = [...f.evidenceRefs, forged];
  f.request.approval.evidenceRefs = [...f.evidenceRefs, forged];
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native review differs from its Git commit/);
});

test("reassessment refuses wrong source binding, UID/ordinal, held decisions and unapproved after values", t => {
  for (const [mutate, error] of [
    [f => { f.review.sourceArchiveFile = "another/exam.js"; }, /review source identity mismatch/],
    [f => { f.review.sourceAfterBlob = "a".repeat(40); }, /source blob\/SHA mismatch/],
    [f => { f.review.sourceAfterSha256 = "a".repeat(64); }, /source blob\/SHA mismatch/],
    [f => { f.review.questionCount = 3; }, /denominator/],
    [f => { f.review.items[0].questionUid = "another-uid"; }, /reviewed UID\/ordinal/],
    [f => { f.review.items[0].ordinal = 2; }, /UID\/ordinal denominator/],
    [f => { f.review.items[0].decision = "REVIEW_COMPLETE_WITH_SOURCE_PREREQUISITE_HOLD"; }, /semantic decision is not settled/],
    [f => { f.review.items[0].debts = [{ type: "SOURCE_SOLUTION_PREREQUISITE_HOLD" }]; }, /explicit source\/content\/difficulty hold/],
    [f => { f.review.items[0].after.rpmL3 = "다른 검토값"; }, /changed value not approved|reviewed after value mismatch/],
  ]) {
    const f = reviewedSourceFixture(t); mutate(f); f.updateReview();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), error);
  }
  const f = reviewedSourceFixture(t);
  f.item.before.conceptClusterKey = null; f.item.after.conceptClusterKey = "NOT_REVIEWED";
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /changed value not approved by native review: conceptClusterKey/);
});

test("native M2 source proofs reject stale baseline objects, per-item hashes and content holds", t => {
  for (const [mutate, error] of [
    [f => { f.review.sourceGitBlobSha = "a".repeat(40); }, /baseline\/source blob mismatch/],
    [f => { f.review.items[0].sourceEvidence.fingerprints[0].value = "b".repeat(64); }, /per-item source fingerprints mismatch/],
    [f => { f.review.items[0].contentDebt = ["Actual content remains unresolved"]; }, /explicit source\/content\/difficulty hold/],
    [f => { f.review.items[0].rpmDecision = "META_ONLY_UNRESOLVED"; }, /semantic decision is not settled/],
    [f => { f.review.items[0].fieldReview = {}; }, /native per-field review missing/],
  ]) {
    const f = reviewedSourceFixture(t, "m2-s1-meta-review-v1"); mutate(f); f.updateReview();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), error);
  }
  const f = reviewedSourceFixture(t, "m2-s2-meta-review-v1"), current = { ...f.current };
  f.writeBank({ ...current, solution: "검토 branch에서 뒤늦게 바뀐 해설" });
  f.updateReview();
  f.writeBank(current);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /current student payload differs/);
});

test("FINAL_QA source reassessment refuses a reviewed PT/TPL correction omitted from the request", t => {
  const f = reviewedSourceFixture(t), meta = f.read(META);
  meta.records[0].problemTypeKey = "PT_OLD"; meta.records[0].templateKey = "TPL_OLD";
  f.put(META, meta);
  f.writeBank({ ...f.current, problemTypeKey: "PT_OLD", templateKey: "TPL_OLD" });
  for (const field of ["problemTypeKey", "templateKey"]) { delete f.item.before[field]; delete f.item.after[field]; }
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewed after value mismatch \(including omitted field\): problemTypeKey/);
});

function proposalFinalizationFixture(t, kind = "CC", { omittedNativeCc = false, occupiedNativeTemplate = false } = {}) {
  const f = reviewedSourceFixture(t, kind === "CC" ? "m2-s2-meta-review-v1" : "m3-s2-complete-semantic-review-v1");
  f.review.examId = "E001";
  const proposal = { id: `E001-${kind}-FINAL`, ...(kind === "CC" ? { type: "CC", name: "검토된 보조 개념" } :
    { kind: "NEW_TPL", proposedKey: "TPL_FINAL", parentProblemTypeKey: "PT_NEW" }),
    definition: "독립 검토로 확정한 정확한 정의", supportingQuestionUids: ["uid1"], supportOrdinals: [1] };
  if (kind === "CC") {
    f.review.proposals = [proposal]; f.review.items[0].proposalRefs = [proposal.id];
    if (omittedNativeCc) delete f.review.items[0].after.crossConceptKeys;
  } else {
    f.put("docs/native-proposals.json", [proposal]); f.git("add", "--", "docs/native-proposals.json");
    f.review.artifactRefs = { proposals: { path: "docs/native-proposals.json", sha256: hash(fs.readFileSync(path.join(f.root, "docs/native-proposals.json"))) } };
    if (!occupiedNativeTemplate) { f.current.templateKey = ""; f.review.items[0].after.templateKey = ""; }
    f.review.items[0].debts = [{ type: "NEW_TEMPLATE" }, { type: "RESOLVER_SOLUTION_PROVENANCE" }];
  }
  const assetPath = "archive/assets/reviewed-figure.svg", asset = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>';
  f.put(assetPath, asset); f.git("add", "--", assetPath);
  f.writeBank(f.current);
  if (kind === "TPL") {
    f.review.sourceAfterBlob = f.git("hash-object", "-w", f.sourcePath);
    f.review.sourceAfterSha256 = hash(fs.readFileSync(path.join(f.root, f.sourcePath)));
  }
  const nativeRef = f.updateReview(), nativeCommit = f.item.sourceReview.reviewCommit;
  const nativeBytes = fs.readFileSync(path.join(f.root, "docs/native-review.json"));
  const snapshot = { blob: f.git("rev-parse", `${nativeCommit}:${f.sourcePath}`), sha256: hash(fs.readFileSync(path.join(f.root, f.sourcePath))), questionSha256: hash(stable(f.current)) };
  const nativeBinding = { commit: nativeCommit, path: f.item.sourceReview.reviewPath, sha256: nativeRef.sha256 };
  const common = { examId: "E001", questionUid: "uid1", sourcePath: f.sourcePath };
  const definition = kind === "CC" ? { conceptKey: "CC_FINAL", canonicalLabelKo: "확정 보조 개념", definition: proposal.definition,
    ownerConceptShard: "NEW_CONCEPTS", status: "ACTIVE", aliases: [], supportingQuestionUids: ["uid1"], supportingItemCount: 1 } :
    { templateKey: "TPL_FINAL", parentProblemTypeKey: "PT_NEW", canonicalLabelKo: "확정 풀이 구조", definition: proposal.definition,
      ownerPack: "NEW_COURSE", status: "ACTIVE", aliases: [], supportingQuestionUids: ["uid1"], supportingItemCount: 1 };
  const definitionPath = `${CANON}/${kind === "CC" ? "concepts/new-concepts.json" : "packs/new-course/taxonomy.json"}`;
  const keyField = kind === "CC" ? "conceptKey" : "templateKey", collection = kind === "CC" ? "concepts" : "templates";
  f.request.registryChanges.find(c => c.path === definitionPath).after[collection].push(definition);
  const registryChange = { path: definitionPath, collection, match: { [keyField]: definition[keyField] }, before: null, after: definition };
  let proof, registry, mapping, binding;
  if (kind === "CC") {
    proof = { schemaVersion: "archive-cross-concept-narrow-definition-finalization-v1", status: "DEFINITIONS_FINALIZED_OFFICIAL_REGISTRATION_PENDING",
      reviewer: "independent-definition-reviewer", nativeReviewCommit: nativeCommit, actualMain: nativeCommit,
      scope: { newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0 },
      definitionDecisions: [{ definition }], applications: [{ ...common, sourceOrdinal: 1, currentSourceCommit: nativeCommit,
        currentSourceBlobSha1: snapshot.blob, currentSourceRawSha256: snapshot.sha256, currentWholeQuestionStableSha256: snapshot.questionSha256,
        nativeReviewRef: nativeBinding, nativeProposalRefs: [proposal.id], nativeItemStableSha256: hash(stable(f.review.items[0])), nativeProtectedStudentFieldsChanges: [],
        currentProblemFigure: { commit: nativeCommit, path: assetPath, gitBlobSha1: f.git("rev-parse", `${nativeCommit}:${assetPath}`), sha256: hash(asset), visuallyInspected: true },
        definitionDisposition: "ADD_EXACT_NEW_CANONICAL_CC", addCrossConceptKey: "CC_FINAL",
        reviewedPrimaryContext: Object.fromEntries(["standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"].map(k => [k, f.item.after[k]])),
        nativeAfterCrossConceptKeys: [...f.current.crossConceptKeys], newMathematicalQa: false, newMetadataApproval: false, difficultyChanged: false }] };
    registry = { schemaVersion: "archive-reviewed-cross-concept-registry-change-proposal-v1", status: "PENDING_OFFICIAL_REGISTRAR", registryChanges: [registryChange] };
  } else {
    mapping = { schemaVersion: "archive-m3s2-exact-type-finalization-review-request-v1", targetTemplateKey: "TPL_FINAL", registryChange,
      rows: [{ ...common, ordinal: 1, currentSourceBlobSha1: snapshot.blob, currentSourceSha256: snapshot.sha256,
        nativeReview: nativeBinding, originalProposal: { exam: "E001", ...proposal }, currentQuestion: structuredClone(f.current), nativeItem: structuredClone(f.review.items[0]) }] };
    proof = { schemaVersion: "archive-independent-exact-template-finalization-review-v1", decision: "APPROVE_ADD_ONLY_EXACT_TEMPLATE_FINALIZATION",
      reviewer: "independent-definition-reviewer", sourceCommit: "b".repeat(40), targetTemplateKey: "TPL_FINAL", registryChange,
      rows: [{ ...common, ordinal: 1, sourceBlobSha1: snapshot.blob, sourceSha256: snapshot.sha256, questionSha256: snapshot.questionSha256,
        nativeReview: nativeBinding, imagePath: assetPath, imageSha256: hash(asset), imageViewedByRoot: true, decision: "EXACT_TEMPLATE_SUPPORTED" }] };
    binding = { schemaVersion: "archive-exact-template-finalization-source-binding-v1", publishedSourceCommit: nativeCommit,
      historicalReviewSourceCommit: proof.sourceCommit, targetTemplateKey: "TPL_FINAL", registryDefinitionUnchanged: true, newMathematicalQa: false, newMetadataApprovals: 0,
      rows: [{ ...common, sourceOrdinal: 1, sourceBlobSha1: snapshot.blob, sourceRawSha256: snapshot.sha256,
        questionStableSha256: snapshot.questionSha256, nativeReview: nativeBinding, sourceIdenticalToIndependentReview: true }] };
  }
  const proofPath = "docs/finalization.json", registryPath = "docs/finalization-registry.json", mappingPath = "docs/finalization-mapping.json", bindingPath = "docs/finalization-source.json";
  const ref = p => ({ path: p, sha256: hash(fs.readFileSync(path.join(f.root, p))) });
  const updateFinalization = () => {
    const spec = { schemaVersion: "archive-native-proposal-finalization-v1", proposalIds: [proposal.id] };
    if (mapping) { f.put(mappingPath, mapping); spec.proposalMappingRef = ref(mappingPath); proof.reviewRequest = spec.proposalMappingRef; }
    f.put(proofPath, proof); spec.finalizationRef = ref(proofPath);
    if (registry) { registry.evidenceRefs = [spec.finalizationRef]; f.put(registryPath, registry); spec.registryChangesRef = ref(registryPath); }
    if (binding) { binding.independentReviewRef = spec.finalizationRef; binding.proposalMappingRef = spec.proposalMappingRef;
      f.put(bindingPath, binding); spec.sourceBindingRef = ref(bindingPath); }
    const refs = [spec.finalizationRef, spec.registryChangesRef, spec.proposalMappingRef, spec.sourceBindingRef].filter(Boolean);
    f.git("add", "--", ...refs.map(r => r.path));
    f.git("-c", "user.name=Independent fixture reviewer", "-c", "user.email=independent@example.invalid", "commit", "--allow-empty", "-qm", "Finalize exact native proposal");
    spec.finalizationCommit = f.git("rev-parse", "HEAD");
    f.item.sourceReview.proposalFinalization = spec;
    f.item.evidenceRefs = [...f.evidenceRefs, nativeRef, ...refs]; f.request.approval.evidenceRefs = [...f.item.evidenceRefs];
  };
  updateFinalization();
  if (kind === "CC") { f.current.crossConceptKeys = [...f.current.crossConceptKeys, "CC_FINAL"]; f.item.after.crossConceptKeys = [...f.current.crossConceptKeys]; }
  else { f.current.templateKey = "TPL_FINAL"; f.item.after.templateKey = "TPL_FINAL"; }
  f.writeBank(f.current);
  return { ...f, kind, proof, registry, mapping, binding, proposal, definition, definitionPath, nativeBytes, nativeCommit, assetPath, updateFinalization };
}

function dispositionFixture(t, kind = "CC", { anonymous = true, noFigure = false, reuse = false, occupiedNativeTemplate = false,
  auxiliaryWitness = ["CONDITION", "BOUNDARY"].includes(kind) } = {}) {
  const f = reviewedSourceFixture(t, kind === "TPL" ? "m2-s2-meta-review-v1" : "m3-s2-complete-semantic-review-v1");
  // The new lane reuses an already ACTIVE primary. It cannot introduce a new
  // parent in the same operation as disposing of a native proposal.
  for (const change of f.request.registryChanges) {
    if (!change.collection) f.put(change.path, change.after);
    else { const document = f.read(change.path), rows = change.collection === "$" ? document : document[change.collection];
      rows.push(change.after); f.put(change.path, document); }
  }
  f.request.registryChanges = [];
  f.review.examId = "E001";
  const proposal = { ...(anonymous && kind !== "TPL" ? {} : { id: "E001-NATIVE-PROPOSAL" }),
    type: kind === "CC" ? "NEW_CC_PROPOSAL" : kind === "CONDITION" ? "CONDITION_CANDIDATE" : kind === "TPL" ? "NEW_TPL" : "BOUNDARY_REVIEW",
    definition: "원래 검토에서 제시한 정확한 의미", ordinal: 1, questionUid: "uid1",
    ...(kind === "TPL" ? { parent: "PT_NEW" } : kind === "BOUNDARY" ? { existingTemplate: "TPL_NEW" } : {}) };
  const nativeProposalPath = "docs/exact-native-proposals.json";
  if (kind === "TPL") {
    f.review.proposals = [proposal]; f.review.items[0].proposalRefs = [proposal.id];
    if (!occupiedNativeTemplate) delete f.review.items[0].after.templateKey;
    f.review.items[0].activeDefinitionMatch = { problemTypeKey: "PT_NEW", problemTypeStatus: "ACTIVE", templateKey: null };
  } else {
    f.put(nativeProposalPath, [proposal]); f.git("add", "--", nativeProposalPath);
    f.review.artifactRefs = { proposals: { path: nativeProposalPath, sha256: hash(fs.readFileSync(path.join(f.root, nativeProposalPath))) } };
  }
  const assetPath = "archive/assets/reviewed-figure.svg", asset = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>';
  f.put(assetPath, asset); f.git("add", "--", assetPath);
  if (noFigure) f.current.image = "";
  f.writeBank(f.current);
  Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) });
  if (kind !== "TPL") {
    f.review.sourceAfterBlob = f.git("hash-object", "-w", f.sourcePath);
    f.review.sourceAfterSha256 = hash(fs.readFileSync(path.join(f.root, f.sourcePath)));
  }
  const nativeRef = f.updateReview(), nativeCommit = f.item.sourceReview.reviewCommit,
    origin = kind === "TPL" ? { path: f.item.sourceReview.reviewPath, sha256: nativeRef.sha256 } : f.review.artifactRefs.proposals;
  const selection = { documentRef: origin, index: 0, proposalSha256: hash(stable(proposal)), questionUid: "uid1", sourceOrdinal: 1,
    ...(proposal.id ? { proposalId: proposal.id } : {}) };
  const keyField = kind === "CONDITION" ? "conditionKey" : kind === "TPL" ? "templateKey" : "conceptKey",
    field = kind === "CONDITION" ? "conditionKeys" : kind === "TPL" ? "templateKey" : "crossConceptKeys",
    key = kind === "CONDITION" ? "COND_FINAL" : kind === "TPL" ? "TPL_FINAL" : "CC_FINAL",
    collection = kind === "CONDITION" ? "conditions" : kind === "TPL" ? "templates" : "concepts",
    definitionPath = `${CANON}/${kind === "CONDITION" ? "condition_registry.json" : kind === "TPL" ? "packs/new-course/taxonomy.json" : "concepts/new-concepts.json"}`;
  const definition = { [keyField]: key, canonicalLabelKo: "좁게 확정한 정의", definition: proposal.definition, status: "ACTIVE", aliases: [],
    supportingQuestionUids: [reuse ? "prior-reviewed-uid" : "uid1"], supportingItemCount: 1,
    ...(kind === "CC" ? { ownerConceptShard: "NEW_CONCEPTS" } : kind === "CONDITION" ? { owner: "CONDITION_CORE" } : { ownerPack: "NEW_COURSE", parentProblemTypeKey: "PT_NEW" }) };
  const registryChange = { path: definitionPath, collection, match: { [keyField]: key }, before: null, after: definition };
  if (kind !== "BOUNDARY") {
    if (reuse) { const document = f.read(definitionPath); document[collection].push(definition); f.put(definitionPath, document); }
    else f.request.registryChanges = [{ ...registryChange, evidenceRefs: f.evidenceRefs }];
  }
  const choice = { selection, reason: "현재 원문과 원제안을 대조한 좁은 확정", ...(kind === "BOUNDARY" ?
    { disposition: "KEEP_REVIEWED_ACTIVE_PRIMARY", problemTypeKey: "PT_NEW", templateKey: "TPL_NEW" } :
    { disposition: reuse ? "REUSE_ACTIVE" : "ADD_ONLY", definition, ...(reuse ? { canonicalPath: definitionPath } : { registryChange }) }) };
  const app = { examId: "E001", questionUid: "uid1", sourceOrdinal: 1, sourcePath: f.sourcePath, reviewer: "independent-current-reviewer", reason: "원제안의 정확한 의미와 현재 적용만 검토",
    nativeReviewRef: { commit: nativeCommit, path: f.item.sourceReview.reviewPath, sha256: nativeRef.sha256 },
    nativeItemStableSha256: hash(stable(f.review.items[0])), proposalSelections: [selection], newMathematicalQa: false,
    newMetadataApproval: false, difficultyChanged: false, nativeProtectedStudentFieldsChanges: [],
    sourceSnapshot: { commit: nativeCommit, sourcePath: f.sourcePath, blob: f.git("rev-parse", `${nativeCommit}:${f.sourcePath}`),
      sha256: hash(fs.readFileSync(path.join(f.root, f.sourcePath))), questionSha256: hash(stable(f.current)) },
    rendererAssets: noFigure ? [] : [{ path: assetPath, gitBlobSha1: f.git("rev-parse", `${nativeCommit}:${assetPath}`), sha256: hash(asset), visuallyInspected: true }],
    reviewedPrimaryContext: Object.fromEntries(["standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"].map(k => [k, kind === "TPL" && k === "templateKey" ? key : f.item.after[k]])), decisions: [choice] };
  const proof = { schemaVersion: "archive-independent-native-proposal-disposition-v1", status: "NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING",
    scope: { newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, newSourceContentEdits: 0 }, applications: [app] };
  const independent = kind === "TPL" ? { schemaVersion: "archive-template-definition-independent-review-v1",
    decision: "APPROVE_EXACT_DEFINITION_AND_SELECTED_APPLICATION", scope: "NARROW_NEW_TEMPLATE_DEFINITION_AND_ONE_EXISTING_REVIEWED_ITEM",
    reviewer: app.reviewer, examId: app.examId, questionUid: app.questionUid, sourceOrdinal: app.sourceOrdinal, nativeReview: app.nativeReviewRef,
    originalProposal: { id: proposal.id, type: proposal.type, sha256: selection.proposalSha256 },
    proposedDefinition: structuredClone(definition), proposedDefinitionCanonicalSha256: hash(stable(definition)),
    parentProblemTypeKey: "PT_NEW", definitionOwnerPack: "NEW_COURSE", currentMainChecked: nativeCommit,
    sourceAndAssetsStillMatchCurrentMain: true, sourceSnapshots: [{ path: f.sourcePath, blob: app.sourceSnapshot.blob,
      sha256: app.sourceSnapshot.sha256, questionSha256: app.sourceSnapshot.questionSha256 }],
    rendererBindings: app.rendererAssets.map(r => ({ path: r.path, sha256: r.sha256, visuallyInspected: true })),
    approvedSupportingQuestionUids: ["uid1"], newProblemTypes: 0, newTemplatesAuthorizedForOfficialRegistration: 1,
    newCrossConcepts: 0, newConditions: 0, newMetadataApprovals: 0, newDifficultyApprovals: 0,
    existingDefinitionsChanged: 0, sourceWrites: 0, canonicalWrites: 0, fullExamQaClaimed: false,
    officialCompilerResolverConsumerStillRequired: true } : auxiliaryWitness ? {
      schemaVersion: "archive-independent-proposal-condition-boundary-finalization-v1",
      decision: "APPROVE_EXACT_TWO_CONDITIONS_AND_ONE_EXISTING_TEMPLATE_BOUNDARY", reviewer: app.reviewer,
      currentMainChecked: nativeCommit, newMetadataApprovals: 0, newDifficultyApprovals: 0, newFullExamQa: false,
      newReview2: false, existingDefinitionsModified: 0, newCrossConceptDefinitions: 0, newTemplateDefinitions: 0,
      sourceWrites: 0, canonicalWrites: 0, officialCompilerResolverAndConsumerStillRequired: true,
      approvedRegistryChanges: kind === "CONDITION" ? [structuredClone(registryChange)] : [],
      rows: [{ examId: app.examId, questionUid: app.questionUid, sourceOrdinal: app.sourceOrdinal,
        nativeProposal: structuredClone(proposal), proposalJsonSha256: hash(JSON.stringify(proposal)),
        nativeMetaRef: app.nativeReviewRef, nativeProposalRef: { commit: nativeCommit, ...origin },
        currentSourceRef: { commit: nativeCommit, path: f.sourcePath, gitBlobSha1: app.sourceSnapshot.blob, sha256: app.sourceSnapshot.sha256 },
        currentQuestionSha256: hash(JSON.stringify(f.current)), newMetadataApprovals: 0, newDifficultyJudgment: false,
        newFullMathematicalQa: false, newReview2: false, sourceWrites: 0,
        rendererAssets: app.rendererAssets.map(r => ({ path: r.path, gitBlobSha1: r.gitBlobSha1, rawSha256: r.sha256, visuallyInspected: true })),
        ...(kind === "CONDITION" ? { decision: "APPROVE_EXACT_CONDITION_APPLICATION", key } :
          { decision: "APPROVE_EXISTING_TEMPLATE_BOUNDARY_REUSE", problemTypeKey: "PT_NEW", templateKey: "TPL_NEW" }) }],
    } : null;
  const proofPath = "docs/exact-disposition.json";
  const updateFinalization = ({ omitIndependentRef = false } = {}) => {
    const extraRefs = [];
    if (independent && !omitIndependentRef) { const p = "docs/original-independent-template-review.json"; f.put(p, independent);
      app.independentReviewRef = { path: p, sha256: hash(fs.readFileSync(path.join(f.root, p))) }; extraRefs.push(app.independentReviewRef); }
    else delete app.independentReviewRef;
    f.put(proofPath, proof); f.git("add", "--", proofPath, ...extraRefs.map(r => r.path));
    f.git("-c", "user.name=Independent disposition reviewer", "-c", "user.email=disposition@example.invalid", "commit", "--allow-empty", "-qm", "Bind current exact proposal disposition");
    const proofRef = { path: proofPath, sha256: hash(fs.readFileSync(path.join(f.root, proofPath))) };
    f.item.sourceReview.proposalFinalization = { schemaVersion: "archive-native-proposal-finalization-v2", finalizationCommit: f.git("rev-parse", "HEAD"), finalizationRef: proofRef, proposalSelections: [selection] };
    f.item.evidenceRefs = [...f.evidenceRefs, nativeRef, proofRef, ...extraRefs]; f.request.approval.evidenceRefs = [...f.item.evidenceRefs];
  };
  updateFinalization();
  if (kind !== "BOUNDARY") { f.current[field] = kind === "TPL" ? key : [...f.current[field], key]; f.item.after[field] = structuredClone(f.current[field]); f.writeBank(f.current); }
  return { ...f, kind, proof, app, choice, independent, definition, definitionPath, proposal, selection, assetPath, nativeCommit, nativeBytes: fs.readFileSync(path.join(f.root, "docs/native-review.json")), updateFinalization };
}

test("v2 exact dispositions bind anonymous M3 CC/Condition and unchanged boundaries, and M2's explicitly empty native template", t => {
  for (const kind of ["CC", "CONDITION", "BOUNDARY", "TPL"]) {
    const f = dispositionFixture(t, kind), source = fs.readFileSync(path.join(f.root, f.sourcePath));
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
    assert.deepEqual(fs.readFileSync(path.join(f.root, "docs/native-review.json")), f.nativeBytes);
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
    assert.deepEqual(f.read(META).records[1], f.hold);
    const p = f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.proposalFinalization;
    assert.equal(p.newMathematicalQa, false); assert.equal(p.newReview2Claims, 0);
    assert.deepEqual(p.nativeProposalBindings[0].selection, f.selection);
    assert.equal(Object.hasOwn(p.nativeProposalBindings[0], "id"), kind === "TPL");
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  }
});

test("an exact M3 auxiliary definition may be reused without rewriting its historical supporting cohort", t => {
  for (const kind of ["CC"]) {
    const f = dispositionFixture(t, kind, { reuse: true }), bytes = fs.readFileSync(path.join(f.root, f.definitionPath));
    registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.definitionPath)), bytes);
    assert.equal(f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.proposalFinalization.definitions[0].newDefinition, false);
  }
  const textOnly = dispositionFixture(t, "CONDITION", { noFigure: true });
  assert.equal(registerReviewedExamV2({ root: textOnly.root, request: textOnly.request }).totalQuestions, 1);
  const unsupportedConditionReuse = dispositionFixture(t, "CONDITION", { reuse: true });
  assert.throws(() => registerReviewedExamV2({ root: unsupportedConditionReuse.root, request: unsupportedConditionReuse.request }), /normalized condition definition differs/);
});

test("v2 disposition selection cannot invent a historical ID, omit proposals, or alter exact document/index/UID bindings", t => {
  for (const mutate of [
    f => { f.selection.proposalId = "invented-id"; }, f => { f.selection.index = 1; },
    f => { f.selection.proposalSha256 = "a".repeat(64); }, f => { f.selection.documentRef.sha256 = "a".repeat(64); },
    f => { f.selection.questionUid = "uid2"; }, f => { f.selection.sourceOrdinal = 2; },
    f => { f.proof.applications[0].proposalSelections = []; }, f => { f.app.decisions = []; },
  ]) {
    const f = dispositionFixture(t); mutate(f); f.updateFinalization();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:|native proposal document SHA/);
  }
  const absent = dispositionFixture(t); delete absent.item.sourceReview.proposalFinalization;
  assert.throws(() => registerReviewedExamV2({ root: absent.root, request: absent.request }), /exact native ID/);
});

test("v2 disposition preserves immutable native/source/renderer/reviewer and scope safeguards", t => {
  for (const mutate of [
    f => { f.app.reviewer = "native-author"; }, f => { f.app.nativeItemStableSha256 = "a".repeat(64); },
    f => { f.app.nativeReviewRef.sha256 = "a".repeat(64); }, f => { f.app.sourceSnapshot.blob = "a".repeat(40); },
    f => { f.app.sourceSnapshot.sha256 = "a".repeat(64); }, f => { f.app.sourceSnapshot.questionSha256 = "a".repeat(64); },
    f => { f.app.rendererAssets = []; }, f => { f.app.rendererAssets[0].visuallyInspected = false; },
    f => { f.app.rendererAssets[0].sha256 = "a".repeat(64); }, f => { f.app.rendererAssets.push({ ...f.app.rendererAssets[0] }); },
    f => { f.app.reviewedPrimaryContext.templateKey = "OTHER_TPL"; }, f => { f.app.difficultyChanged = true; },
    f => { f.proof.scope.newFullMathematicalQa = true; }, f => { f.proof.scope.newMetadataApprovals = 1; },
    f => { f.app.decisions[0].disposition = "AUTOMATICALLY_ACCEPT"; },
    f => { f.app.decisions[0].registryChange.before = {}; },
  ]) {
    const f = dispositionFixture(t); mutate(f); f.updateFinalization();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:/);
  }
  const asset = dispositionFixture(t); asset.put(asset.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><text>changed</text></svg>');
  assert.throws(() => registerReviewedExamV2({ root: asset.root, request: asset.request }), /renderer bytes changed/);
  const body = dispositionFixture(t); body.current.solution = "different unreviewed solution"; body.writeBank(body.current);
  assert.throws(() => registerReviewedExamV2({ root: body.root, request: body.request }), /source fingerprint|student payload/);
});

test("v2 disposition cannot delete auxiliary keys, replace a known native template or turn a boundary into new classification", t => {
  const deleted = dispositionFixture(t); deleted.current.crossConceptKeys = ["CC_FINAL"]; deleted.item.after.crossConceptKeys = ["CC_FINAL"]; deleted.writeBank(deleted.current);
  assert.throws(() => registerReviewedExamV2({ root: deleted.root, request: deleted.request }), /finalized value must bind/);
  const occupied = dispositionFixture(t, "TPL", { occupiedNativeTemplate: true });
  assert.throws(() => registerReviewedExamV2({ root: occupied.root, request: occupied.request }), /native empty template/);
  const boundary = dispositionFixture(t, "BOUNDARY"); boundary.choice.templateKey = "OTHER"; boundary.updateFinalization();
  assert.throws(() => registerReviewedExamV2({ root: boundary.root, request: boundary.request }), /normalized boundary differs from original review/);
  const renamed = dispositionFixture(t, "CONDITION"); renamed.choice.definition.conditionKey = "COND_OTHER"; renamed.updateFinalization();
  assert.throws(() => registerReviewedExamV2({ root: renamed.root, request: renamed.request }), /registry after identity mismatch/);
});

test("normalized M2 template applications are bound to the original independent review, exact single UID, owner and definition", t => {
  for (const mutate of [
    f => { f.independent.reviewer = "different-reviewer"; },
    f => { f.independent.proposedDefinition.definition = "broadened unreviewed repeated-centroid construction"; },
    f => { f.independent.originalProposal.sha256 = "a".repeat(64); },
    f => { f.independent.nativeReview = { ...f.independent.nativeReview, sha256: "a".repeat(64) }; },
    f => { f.independent.questionUid = "uid2"; },
    f => { f.independent.approvedSupportingQuestionUids.push("uid2"); },
    f => { f.independent.definitionOwnerPack = "OTHER_PACK"; },
    f => { f.independent.currentMainChecked = "a".repeat(40); },
    f => { f.independent.rendererBindings = []; },
    f => { f.independent.newDifficultyApprovals = 1; },
    f => { f.independent.fullExamQaClaimed = true; },
  ]) {
    const f = dispositionFixture(t, "TPL"); mutate(f); f.updateFinalization();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:/);
  }
  const unbound = dispositionFixture(t, "TPL"); unbound.item.evidenceRefs = unbound.item.evidenceRefs.filter(r => r.path !== unbound.app.independentReviewRef.path);
  assert.throws(() => registerReviewedExamV2({ root: unbound.root, request: unbound.request }), /bind approval and item/);
});

test("normalized M3 conditions and boundary dispositions preserve the original independent current-source judgment", t => {
  for (const kind of ["CONDITION", "BOUNDARY"]) {
    const f = dispositionFixture(t, kind, { auxiliaryWitness: true });
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
    const proof = f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.proposalFinalization;
    assert.deepEqual(proof.independentReviewRefs, [f.app.independentReviewRef]);
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  }
  for (const mutate of [
    f => { f.independent.reviewer = "different-reviewer"; },
    f => { f.independent.rows.push(structuredClone(f.independent.rows[0])); },
    f => { f.independent.rows[0].nativeProposal.definition = "unreviewed condition"; },
    f => { f.independent.rows[0].proposalJsonSha256 = "a".repeat(64); },
    f => { f.independent.rows[0].nativeMetaRef = { ...f.independent.rows[0].nativeMetaRef, sha256: "a".repeat(64) }; },
    f => { f.independent.rows[0].nativeProposalRef.sha256 = "a".repeat(64); },
    f => { f.independent.rows[0].currentSourceRef.gitBlobSha1 = "a".repeat(40); },
    f => { f.independent.rows[0].currentQuestionSha256 = "a".repeat(64); },
    f => { f.independent.rows[0].rendererAssets[0].rawSha256 = "a".repeat(64); },
    f => { f.independent.currentMainChecked = "a".repeat(40); },
    f => { f.independent.approvedRegistryChanges[0].after.definition = "widened condition"; },
    f => { f.independent.rows[0].key = "COND_OTHER"; },
    f => { f.independent.newMetadataApprovals = 1; },
    f => { f.independent.rows[0].newDifficultyJudgment = true; },
  ]) {
    const f = dispositionFixture(t, "CONDITION", { auxiliaryWitness: true }); mutate(f); f.updateFinalization();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:/);
  }
  const boundary = dispositionFixture(t, "BOUNDARY", { auxiliaryWitness: true });
  boundary.independent.rows[0].templateKey = "TPL_OTHER"; boundary.updateFinalization();
  assert.throws(() => registerReviewedExamV2({ root: boundary.root, request: boundary.request }), /normalized boundary/);
  const unbound = dispositionFixture(t, "CONDITION", { auxiliaryWitness: true });
  unbound.item.evidenceRefs = unbound.item.evidenceRefs.filter(r => r.path !== unbound.app.independentReviewRef.path);
  assert.throws(() => registerReviewedExamV2({ root: unbound.root, request: unbound.request }), /bind approval and item/);
});

test("M3 condition and boundary normalization cannot remove the original independent review reference", t => {
  for (const kind of ["CONDITION", "BOUNDARY"]) {
    const f = dispositionFixture(t, kind); f.updateFinalization({ omitIndependentRef: true });
    assert.equal(f.app.independentReviewRef, undefined);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /SHA-bound finalization evidence required/);
  }
});

test("a different Git source path cannot lend an identical student payload to a finalized application", t => {
  const f = dispositionFixture(t), borrowedPath = "archive/exams/other-reviewed-copy.js",
    bytes = execFileSync("git", ["show", `${f.nativeCommit}:${f.sourcePath}`], { cwd: f.root });
  f.put(borrowedPath, bytes); f.git("add", "--", borrowedPath);
  f.git("-c", "user.name=Fixture reviewer", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Copy the exact old source under a different path");
  Object.assign(f.app.sourceSnapshot, { commit: f.git("rev-parse", "HEAD"), sourcePath: borrowedPath,
    blob: f.git("hash-object", borrowedPath), sha256: hash(bytes) });
  f.updateFinalization();
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /exact request source path/);
});

test("independent native CC/TPL finalization registers only the exact proposal without rewriting native review or the omitted HOLD", t => {
  for (const kind of ["CC", "TPL"]) {
    const f = proposalFinalizationFixture(t, kind), source = fs.readFileSync(path.join(f.root, f.sourcePath));
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
    const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview.proposalFinalization;
    assert.deepEqual(fs.readFileSync(path.join(f.root, "docs/native-review.json")), f.nativeBytes);
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
    assert.deepEqual(f.read(META).records[1], f.hold);
    assert.equal(proof.nativeAfterSha256, hash(stable(f.review.items[0].after)));
    assert.deepEqual([proof.newMathematicalQa, proof.newReview2Claims], [false, 0]);
    assert.deepEqual(proof.nativeProposalBindings.map(p => p.id), [f.proposal.id]);
    assert.equal(proof.assetBindings.length, 1);
    assert.equal(proof.definitions[0].key, `${kind}_FINAL`);
    assert.equal(receipt.examFinalQaStatus, "NOT_EVALUATED_BY_REGISTRAR");
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  }
});

test("typed proposal replay rechecks same-path renderer bytes for both finalized proposal contracts", t => {
  for (const [factory, kind] of [[proposalFinalizationFixture, "CC"], [proposalFinalizationFixture, "TPL"],
    [dispositionFixture, "CC"], [dispositionFixture, "TPL"]]) {
    const f = factory(t, kind);
    registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
    const source = fs.readFileSync(path.join(f.root, f.sourcePath)), metadata = fs.readFileSync(path.join(f.root, META));
    f.put(f.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="9"/></svg>');
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:.*(?:image|asset|figure|renderer)/);
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), metadata);
  }
});

test("typed proposal replay rejects a resigned receipt proof against the original immutable review", t => {
  for (const factory of [proposalFinalizationFixture, dispositionFixture]) {
    const f = factory(t, "CC"); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    const receipt = f.read(f.receiptPath), bindingPath = reviewedSourceBindingPath(f.request.requestId);
    receipt.fingerprintRepairs[0].sourceReview.proposalFinalization.nativeAfterSha256 = "a".repeat(64);
    f.put(bindingPath, buildReviewedSourceBinding({ ...receipt, request: f.request }));
    receipt.outputDigests.find(ref => ref.path === bindingPath).sha256 = hash(fs.readFileSync(path.join(f.root, bindingPath)));
    f.put(f.receiptPath, receipt);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /registered explicit source review proof drift/);
  }
});

test("typed source rebind revalidates the original proposal before writing and on every replay", t => {
  const f = proposalFinalizationFixture(t, "CC");
  const index = f.read(`${CANON}/registry_index.json`); index.status = "ACTIVE";
  index.canonicalSources.push({ path: `${CANON}/metadata_rules.json` });
  f.put(`${CANON}/registry_index.json`, index);
  f.put(`${CANON}/metadata_rules.json`, { status: "ACTIVE", integrationPatterns: ["NONE"] });
  const conditions = f.read(`${CANON}/condition_registry.json`); conditions.status = "ACTIVE";
  f.put(`${CANON}/condition_registry.json`, conditions);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.deepEqual(loadActiveMetaRegistry(f.root).errors, []);
  f.git("hash-object", "-w", f.sourcePath);
  const priorRef = { path: f.receiptPath, sha256: hash(fs.readFileSync(path.join(f.root, f.receiptPath))) };
  const source = Buffer.concat([fs.readFileSync(path.join(f.root, f.sourcePath)), Buffer.from("\n// source receipt preservation checkpoint\n")]);
  fs.writeFileSync(path.join(f.root, f.sourcePath), source);
  const request = { schemaVersion: f.request.schemaVersion, requestId: "typed-proposal-source-rebind", scope: "PARTIAL_UIDS",
    examUid: f.request.examUid, sourceArchiveFile: f.request.sourceArchiveFile, expectedSourceBlobSha1: blob(source), expectedQuestionCount: 2,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "fixture-preservation-reviewer", evidenceRefs: [...f.evidenceRefs, priorRef],
      sourceRebind: { priorReceiptRef: priorRef } },
    items: [{ questionUid: "uid1", sourceOrdinal: 1, before: {}, after: {}, reason: "preserve the exact reviewed question and its original witness",
      evidenceRefs: [priorRef] }] };
  const beforeMeta = fs.readFileSync(path.join(f.root, META)), beforeIdentity = fs.readFileSync(path.join(f.root, "archive/data/question_identity_map.json"));
  const asset = fs.readFileSync(path.join(f.root, f.assetPath));
  assert.equal(registerReviewedExamV2({ root: f.root, request }).status, "PASS");
  f.put(f.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="99"/></svg>');
  assert.throws(() => registerReviewedExamV2({ root: f.root, request, write: true }), /(?:image|asset|figure|renderer)/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), beforeMeta);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_identity_map.json")), beforeIdentity);
  fs.writeFileSync(path.join(f.root, f.assetPath), asset);
  const written = registerReviewedExamV2({ root: f.root, request, write: true });
  assert.deepEqual([written.newMetadataApprovals, written.preservedMetadataApprovals], [0, 1]);
  assert.deepEqual(f.read(META).records[1], JSON.parse(beforeMeta).records[1]);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_identity_map.json")), beforeIdentity);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
  assert.equal(registerReviewedExamV2({ root: f.root, request }).replay, true);
  const afterMeta = fs.readFileSync(path.join(f.root, META));
  f.put(f.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="98"/></svg>');
  assert.throws(() => registerReviewedExamV2({ root: f.root, request }), /(?:image|asset|figure|renderer)/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), afterMeta);
  fs.writeFileSync(path.join(f.root, f.assetPath), asset);
  assert.equal(registerReviewedExamV2({ root: f.root, request }).replay, true);
});

test("omitted native CC uses only an explicit unchanged reviewed-source array and preserves its entries", t => {
  const f = proposalFinalizationFixture(t, "CC", { omittedNativeCc: true });
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
  assert.deepEqual(f.read(META).records[0].crossConceptKeys, ["CC_NEW", "CC_FINAL"]);
});

test("finalized definitions can be reused only while their exact installed record remains unchanged", t => {
  for (const kind of ["CC", "TPL"]) {
    const f = proposalFinalizationFixture(t, kind); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    f.request.requestId += "-second-application"; f.request.registryChanges = [];
    const row = f.read(META).records[0];
    for (const k of Object.keys(f.item.before)) f.item.before[k] = row[k] ?? null;
    f.item.identityBefore.sourceFingerprint = row.sourceFingerprint;
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).status, "PASS");
    const doc = f.read(f.definitionPath), records = doc[kind === "CC" ? "concepts" : "templates"];
    records.find(r => r[kind === "CC" ? "conceptKey" : "templateKey"] === `${kind}_FINAL`).definition = "후속 미검토 의미 변경";
    f.put(f.definitionPath, doc);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /installed definition differs/);
  }
});

test("native semantic proposals cannot be silently omitted or finalized with an unbound scope", t => {
  for (const kind of ["CC", "TPL"]) {
    const f = proposalFinalizationFixture(t, kind), spec = f.item.sourceReview.proposalFinalization;
    delete f.item.sourceReview.proposalFinalization;
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native semantic proposal requires explicit/);
    f.item.sourceReview.proposalFinalization = spec;
    for (const ids of [[], ["different-proposal"], [f.proposal.id, f.proposal.id], [f.proposal.id, "extra-proposal"]]) {
      spec.proposalIds = ids;
      assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /exact supported native proposal selection/);
    }
    spec.proposalIds = [f.proposal.id]; spec.allowUnreviewed = true;
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /exact supported native proposal selection/);
  }
});

test("native proposal inventory separates four-slot TERM and exact-binding debt from unsupported metadata definitions", t => {
  const f = reviewedSourceFixture(t, "m2-s2-meta-review-v1");
  f.review.proposals = [{ id: "E001-TERM", type: "TERM", kind: "대상", ordinals: [1], definition: "별도 4슬롯 용어 후보" },
    { id: "E001-BINDING", type: "BINDING", supportingQuestionUids: ["uid1"], ordinals: [1] }];
  f.review.items[0].proposalRefs = ["E001-BINDING"]; f.updateReview();
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).status, "PASS");
  f.review.proposals[1].type = "PT"; f.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native semantic proposal requires explicit/);
  f.review.proposals[1].type = "CC"; f.review.proposals[1].supportingQuestionUids = ["uid2"]; f.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /does not support the exact UID\/ordinal/);
  f.review.proposals[1].supportingQuestionUids = ["uid1"]; f.review.proposals.push({ ...f.review.proposals[1] }); f.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /ambiguous native proposal ID/);
});

function activeReuseProposalFixture(t, kind, { install = true } = {}) {
  const f = reviewedSourceFixture(t);
  if (install) {
    for (const c of f.request.registryChanges) {
      if (!c.collection) f.put(c.path, c.after);
      else { const d = f.read(c.path); (c.collection === "$" ? d : d[c.collection]).push(c.after); f.put(c.path, d); }
    }
    f.request.registryChanges = [];
  }
  const proposal = { supportingQuestionUids: ["uid1"], supportOrdinals: [1] };
  if (kind === "EXISTING_ACTIVE_CROSSWALK_CONNECTION") Object.assign(proposal, { id: "native-connection", kind, existingTemplates: ["TPL_NEW"] });
  if (kind === "REUSE_ACTIVE_ADD_CROSSWALK") Object.assign(proposal, { type: kind, parentProblemTypeKey: "PT_NEW", templateKey: "TPL_NEW",
    globalActiveSearch: { selectedStatus: "ACTIVE" }, registrationStatus: "PROPOSAL_ONLY_NOT_INSERTED" });
  if (kind === "RPM_LEAF_GAP_ACTIVE_TEMPLATE_REUSE") Object.assign(proposal, { id: "native-leaf-gap", kind, parentProblemTypeKey: "PT_NEW",
    existingTemplateKey: "TPL_NEW", nativeTemplateProposalWithdrawn: true, sourceNewStringKeyInserted: false,
    registrationStatus: "PUBLISHER_LEAF_AND_CONNECTION_ONLY_NATIVE_REUSE" });
  if (["EXISTING_ACTIVE_LINK_GAP", "RPM_LEAF_LINK_PROPOSAL"].includes(kind)) {
    delete proposal.supportingQuestionUids; delete proposal.supportOrdinals;
    Object.assign(proposal, { type: kind, questionUid: "uid1", ordinal: 1, searchedGlobalActive: true });
    if (kind === "EXISTING_ACTIVE_LINK_GAP") Object.assign(proposal, { existingTemplate: "TPL_NEW", parent: "PT_NEW" });
    else Object.assign(proposal, { reuseTemplate: "TPL_NEW", registrationStatus: "PROPOSAL_ONLY_NOT_INSERTED" });
  }
  if (kind === "ORIGINAL_PUBLISHER_PARENT_AND_LEAF_GAP") {
    delete proposal.supportOrdinals;
    Object.assign(proposal, { kind, historicalSourceRpm: "M3-RPM-059", currentExactRpm: "M2-RPM-182",
      existingActiveProblemType: "PT_NEW", existingActiveTemplate: "TPL_NEW", newProblemTypeRequired: false,
      newTemplateRequired: false, reason: "Original publisher leaf remains missing; reuse the existing semantic definition.", owner: "native-release-owner" });
  }
  f.review.proposals = [proposal, { type: "REUSE_ACTIVE_ADD_CROSSWALK", supportingQuestionUids: ["uid2"] }];
  f.updateReview();
  return { ...f, proposal };
}

function projectionNoteFixture(t) {
  const f = activeReuseProposalFixture(t, "REUSE_ACTIVE_ADD_CROSSWALK"), row = f.review.items[0];
  row.primaryMethod = row.decisiveStep;
  row.debts = [{ type: "PROJECTION_BINDING_PENDING", curriculum: "2022", reason: "EXACT_ACTIVE_BINDING_PENDING",
    mappedProblemTypeKey: "PT_NEW", mappedTemplateKeys: ["TPL_NEW"] }];
  const proposal = { ordinal: 1, questionUid: "uid1", status: "PENDING_CODEX_REGISTRATION_OR_SOURCE_REPAIR",
    primaryMethod: row.primaryMethod, decisiveStep: row.decisiveStep, debts: structuredClone(row.debts) },
    proposalPath = "docs/native-projection-notes.json";
  delete f.review.proposals;
  const updateProjectionNote = () => {
    f.put(proposalPath, [proposal]); f.git("add", "--", proposalPath);
    f.review.artifactRefs = { "proposals.json": { path: proposalPath, sha256: hash(fs.readFileSync(path.join(f.root, proposalPath))) } };
    f.updateReview();
  };
  updateProjectionNote();
  return { ...f, proposal, updateProjectionNote };
}

test("the proposals.json alias binds exact historical projection notes without claiming that another curriculum's binding was resolved", t => {
  const f = projectionNoteFixture(t);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
  const binding = f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.technicalProposalBindings[0];
  assert.equal(binding.kind, "HISTORICAL_PROJECTION_BINDING_NOTE");
  assert.deepEqual(binding.declaredCurricula, ["2022"]);
  assert.equal(binding.historicalBindingsResolved, false);
  assert.equal(binding.newDefinition, false);
  assert.deepEqual(f.read(META).records[1], f.hold);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("historical projection aliases reject ambiguous documents, unknown debts and mismatched native or ACTIVE primary values", t => {
  for (const mutate of [
    f => { f.proposal.primaryMethod = "unreviewed rationale"; },
    f => { f.proposal.debts[0].mappedProblemTypeKey = "PT_OTHER"; },
    f => { f.proposal.debts[0].mappedTemplateKeys = ["TPL_OTHER"]; },
    f => { f.proposal.debts[0].curriculum = "UNKNOWN"; },
    f => { f.proposal.debts[0].type = "NEW_TPL_PROPOSAL"; f.review.items[0].debts = structuredClone(f.proposal.debts); },
    f => { f.proposal.debts.push({ type: "UNKNOWN_REVIEW_DEBT" }); f.review.items[0].debts = structuredClone(f.proposal.debts); },
    f => { f.proposal.newTemplate = "TPL_UNREVIEWED"; },
    f => { f.proposal.ordinal = 2; },
  ]) {
    const f = projectionNoteFixture(t); mutate(f); f.updateProjectionNote();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:|source reassessment:/);
  }
  const ambiguous = projectionNoteFixture(t);
  ambiguous.review.artifactRefs.proposals = ambiguous.review.artifactRefs["proposals.json"]; ambiguous.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: ambiguous.root, request: ambiguous.request }), /ambiguous native proposal document aliases/);
  const drift = projectionNoteFixture(t);
  drift.review.artifactRefs["proposals.json"].sha256 = "a".repeat(64); drift.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: drift.root, request: drift.request }), /native proposal document SHA mismatch/);
  const binding = projectionNoteFixture(t);
  binding.put(`${CANON}/packs/new-course/bindings.json`, { status: "ACTIVE", bindings: [] });
  assert.throws(() => registerReviewedExamV2({ root: binding.root, request: binding.request }), /binding/);
});

test("native ACTIVE crosswalk proposals, including no-ID rows, bind unchanged canonical definitions without claiming new finalization", t => {
  for (const kind of ["EXISTING_ACTIVE_CROSSWALK_CONNECTION", "REUSE_ACTIVE_ADD_CROSSWALK", "RPM_LEAF_GAP_ACTIVE_TEMPLATE_REUSE", "EXISTING_ACTIVE_LINK_GAP", "RPM_LEAF_LINK_PROPOSAL"]) {
    const f = activeReuseProposalFixture(t, kind);
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
    const proof = f.read(f.receiptPath).fingerprintRepairs[0].sourceReview;
    assert.equal(proof.proposalFinalization, undefined);
    assert.deepEqual(proof.technicalProposalBindings.map(p => [p.kind, p.problemTypeKey, p.templateKey, p.newDefinition]), [[kind, "PT_NEW", "TPL_NEW", false]]);
    assert.match(proof.technicalProposalBindings[0].proposalSha256, /^[a-f0-9]{64}$/);
    assert.deepEqual(f.read(META).records[1], f.hold);
  }
});

test("technical reuse cannot create a definition, change a parent, disguise semantic debt or bypass the exact binding", t => {
  const fresh = activeReuseProposalFixture(t, "REUSE_ACTIVE_ADD_CROSSWALK", { install: false });
  assert.throws(() => registerReviewedExamV2({ root: fresh.root, request: fresh.request }), /unchanged pre-existing ACTIVE/);
  const changed = activeReuseProposalFixture(t, "REUSE_ACTIVE_ADD_CROSSWALK"), taxonomyPath = `${CANON}/packs/new-course/taxonomy.json`;
  const old = changed.read(taxonomyPath).templates[0];
  changed.request.registryChanges = [{ path: taxonomyPath, collection: "templates", match: { templateKey: "TPL_NEW" }, before: old,
    after: { ...old, definition: "미검토 새 정의" }, evidenceRefs: changed.evidenceRefs }];
  assert.throws(() => registerReviewedExamV2({ root: changed.root, request: changed.request }), /unchanged pre-existing ACTIVE/);
  for (const mutate of [f => { f.proposal.parentProblemTypeKey = "PT_OTHER"; }, f => { f.proposal.templateKey = "TPL_OTHER"; },
    f => { f.proposal.globalActiveSearch.selectedStatus = "PENDING"; }]) {
    const f = activeReuseProposalFixture(t, "REUSE_ACTIVE_ADD_CROSSWALK"); mutate(f); f.updateReview();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /technical crosswalk reuse differs/);
  }
  const binding = activeReuseProposalFixture(t, "REUSE_ACTIVE_ADD_CROSSWALK");
  binding.put(`${CANON}/packs/new-course/bindings.json`, { status: "ACTIVE", bindings: [] });
  assert.throws(() => registerReviewedExamV2({ root: binding.root, request: binding.request }), /binding/);
  const link = activeReuseProposalFixture(t, "EXISTING_ACTIVE_LINK_GAP"); link.proposal.parent = "PT_OTHER"; link.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: link.root, request: link.request }), /existing link gap differs/);
  const leaf = activeReuseProposalFixture(t, "RPM_LEAF_LINK_PROPOSAL"); leaf.proposal.reuseTemplate = "TPL_OTHER"; leaf.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: leaf.root, request: leaf.request }), /RPM leaf proposal does not preserve/);
  const semantic = activeReuseProposalFixture(t, "REUSE_ACTIVE_ADD_CROSSWALK");
  semantic.review.proposals.push({ id: "native-new-condition", kind: "NEW_CONDITION", questionUid: "uid1", ordinal: 1 }); semantic.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: semantic.root, request: semantic.request }), /native semantic proposal requires explicit/);
  delete semantic.review.proposals[2].id; semantic.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: semantic.root, request: semantic.request }), /selected semantic proposal requires an exact native ID/);
  semantic.review.proposals[2].type = "BOUNDARY_REVIEW"; delete semantic.review.proposals[2].kind; semantic.updateReview();
  assert.throws(() => registerReviewedExamV2({ root: semantic.root, request: semantic.request }), /selected semantic proposal requires an exact native ID/);
});

test("original publisher parent and leaf debt reuses only unchanged ACTIVE definitions and preserves the unresolved debt", t => {
  const f = activeReuseProposalFixture(t, "ORIGINAL_PUBLISHER_PARENT_AND_LEAF_GAP");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, "PASS");
  const proof = f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.technicalProposalBindings[0];
  assert.equal(proof.newDefinition, false); assert.equal(proof.newMathematicalQa, false);
  assert.equal(proof.originalPublisherParentAndLeafResolved, false);
  assert.equal(proof.currentCurriculumBindingResolution, "NOT_ASSERTED");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  for (const delta of [{ existingActiveProblemType: "PT_OTHER" }, { existingActiveTemplate: "TPL_OTHER" },
    { newProblemTypeRequired: true }, { newTemplateRequired: true }, { newTemplateRequired: undefined },
    { newDefinition: "unreviewed" }]) {
    const bad = activeReuseProposalFixture(t, "ORIGINAL_PUBLISHER_PARENT_AND_LEAF_GAP");
    Object.assign(bad.proposal, delta); bad.updateReview();
    assert.throws(() => registerReviewedExamV2({ root: bad.root, request: bad.request }), /original publisher gap/);
  }
  const fresh = activeReuseProposalFixture(t, "ORIGINAL_PUBLISHER_PARENT_AND_LEAF_GAP", { install: false });
  assert.throws(() => registerReviewedExamV2({ root: fresh.root, request: fresh.request }), /unchanged pre-existing ACTIVE/);
});

test("finalization retains exact immutable evidence and dual approval/item binding", t => {
  for (const kind of ["CC", "TPL"]) {
    const f = proposalFinalizationFixture(t, kind), spec = f.item.sourceReview.proposalFinalization;
    const goodCommit = spec.finalizationCommit;
    for (const bad of ["a".repeat(40), f.git("rev-parse", `${goodCommit}:docs/finalization.json`)]) {
      spec.finalizationCommit = bad;
      assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:/);
    }
    spec.finalizationCommit = goodCommit;
    const refs = f.item.evidenceRefs;
    f.item.evidenceRefs = refs.filter(r => r.path !== spec.finalizationRef.path);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /bind approval and item/);
    f.item.evidenceRefs = refs;
    f.request.approval.evidenceRefs = refs.filter(r => r.path !== spec.finalizationRef.path);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /bind approval and item/);
    f.request.approval.evidenceRefs = refs;
    f.put(spec.finalizationRef.path, { ...f.proof, reviewer: "rewritten-proof" });
    spec.finalizationRef.sha256 = hash(fs.readFileSync(path.join(f.root, spec.finalizationRef.path)));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /differs from immutable commit/);
  }
});

test("CC finalization rejects changed UID, native item, parent, source, figure, debt scope and definition", t => {
  const mutations = [
    f => { f.proof.applications[0].questionUid = "uid2"; },
    f => { f.proof.applications[0].sourceOrdinal = 2; },
    f => { f.proof.applications[0].nativeItemStableSha256 = "f".repeat(64); },
    f => { f.proof.applications[0].nativeReviewRef.commit = "f".repeat(40); },
    f => { f.proof.applications[0].nativeProposalRefs = ["different-proposal"]; },
    f => { f.proof.applications[0].reviewedPrimaryContext.problemTypeKey = "PT_DIFFERENT"; },
    f => { f.proof.applications[0].currentSourceRawSha256 = "f".repeat(64); },
    f => { f.proof.applications[0].currentWholeQuestionStableSha256 = "f".repeat(64); },
    f => { f.proof.applications[0].currentProblemFigure.sha256 = "f".repeat(64); },
    f => { f.proof.applications[0].currentProblemFigure.visuallyInspected = false; },
    f => { f.proof.applications[0].nativeAfterCrossConceptKeys = []; },
    f => { f.proof.applications[0].difficultyChanged = true; },
    f => { f.proof.scope.newReview2Claims = 2; },
    f => { f.proof.reviewer = "native-author"; },
    f => { f.registry.registryChanges[0].before = { conceptKey: "CC_OLD" }; },
    f => { f.registry.registryChanges[0].after = { ...f.definition, definition: "다른 뜻" }; },
  ];
  for (const mutate of mutations) {
    const f = proposalFinalizationFixture(t); mutate(f); f.updateFinalization();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:/);
  }
});

test("TPL finalization validates published source separately from the unchanged historical proof and rejects parent/proposal drift", t => {
  const mutations = [
    f => { f.binding.publishedSourceCommit = f.proof.sourceCommit; },
    f => { f.binding.historicalReviewSourceCommit = "d".repeat(40); },
    f => { f.binding.rows[0].sourceRawSha256 = "f".repeat(64); },
    f => { f.mapping.rows[0].originalProposal.id = "other-proposal"; },
    f => { f.mapping.rows[0].nativeItem.decisiveStep = "미검토 단계"; },
    f => { f.mapping.rows[0].currentQuestion.answer = "2"; },
    f => { f.proof.rows[0].nativeReview.sha256 = "f".repeat(64); },
    f => { f.proof.rows[0].decision = "REVIEW_PENDING"; },
    f => { f.proof.rows[0].imageViewedByRoot = false; },
    f => { f.definition.parentProblemTypeKey = "PT_OTHER"; },
  ];
  for (const mutate of mutations) {
    const f = proposalFinalizationFixture(t, "TPL"); mutate(f); f.updateFinalization();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native proposal finalization:|TPL parent missing/);
  }
  const occupied = proposalFinalizationFixture(t, "TPL", { occupiedNativeTemplate: true });
  assert.throws(() => registerReviewedExamV2({ root: occupied.root, request: occupied.request }), /may only fill the exact native empty template/);
});

test("finalization never authorizes a later student, same-path asset, CC deletion or omitted native correction", t => {
  for (const kind of ["CC", "TPL"]) {
    const asset = proposalFinalizationFixture(t, kind);
    asset.put(asset.assetPath, "<svg>changed after independent review</svg>");
    assert.throws(() => registerReviewedExamV2({ root: asset.root, request: asset.request }), /reviewed renderer asset bytes changed/);
    const student = proposalFinalizationFixture(t, kind); student.current.solution = "새 미검토 해설"; student.writeBank(student.current);
    student.item.after.sourceFingerprint = student.sourceSha(student.current);
    assert.throws(() => registerReviewedExamV2({ root: student.root, request: student.request }), /current student payload differs/);
  }
  const cc = proposalFinalizationFixture(t); cc.current.crossConceptKeys = ["CC_FINAL"]; cc.item.after.crossConceptKeys = ["CC_FINAL"]; cc.writeBank(cc.current);
  assert.throws(() => registerReviewedExamV2({ root: cc.root, request: cc.request }), /finalized value must bind explicit request/);
  const omitted = proposalFinalizationFixture(t, "TPL"); delete omitted.item.after.templateKey; delete omitted.item.before.templateKey;
  assert.throws(() => registerReviewedExamV2({ root: omitted.root, request: omitted.request }), /source\/approved metadata parity|finalized value must bind explicit request/);
});

function carryReviewedRationale(f, primaryMethod = f.review.items[0].primaryMethod || f.review.items[0].decisiveStep) {
  const decisiveStep = f.review.items[0].decisiveStep;
  f.writeBank({ ...f.current, primaryMethod, decisiveStep });
  const current = f.read(META).records[0];
  for (const field of ["primaryMethod", "decisiveStep"]) f.item.before[field] = current[field] ?? null;
  Object.assign(f.item.after, { primaryMethod, decisiveStep });
  return { primaryMethod, decisiveStep };
}

function metadataRationaleContinuityFixture(t, { assetBytes, choiceAsset = false } = {}) {
  const f = partialFixture(t, '중2 수학', '2015', 'original/middle/m2/2mid/native-rationale-fixture.js');
  const middleParent = value => {
    for (const [key, child] of Object.entries(value)) {
      if (child && typeof child === 'object') middleParent(child);
      else if (child === 'UNIT_NEW') value[key] = 'M2-05';
      else if (child === 'SUB_NEW') value[key] = 'M2-05-TRIANGLE';
    }
  };
  middleParent(f.q); middleParent(f.request);
  for (const [key, value] of Object.entries({ difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' })) {
    f.q[key] = value; f.request.items[0].after[key] = value; f.request.items[0].before[key] = null;
  }
  const index = f.read(`${CANON}/registry_index.json`); index.status = 'ACTIVE';
  index.canonicalSources.push({ path: `${CANON}/metadata_rules.json` }); f.put(`${CANON}/registry_index.json`, index);
  f.put(`${CANON}/metadata_rules.json`, { status: 'ACTIVE', integrationPatterns: ['NONE'] });
  f.put(`${CANON}/condition_registry.json`, { ...f.read(`${CANON}/condition_registry.json`), status: 'ACTIVE' });
  const git = (...args) => execFileSync('git', args, { cwd: f.root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const commit = () => { git('add', '.'); git('-c', 'user.name=Rationale fixture', '-c', 'user.email=rationale@example.invalid', 'commit', '-qm', 'Immutable native rationale'); return git('rev-parse', 'HEAD'); };
  const assetPath = 'archive/assets/rationale-fixture.svg';
  f.put(assetPath, assetBytes ?? '<svg xmlns="http://www.w3.org/2000/svg"><path id="line" d="M0 0L1 1"/><use href="#line"/></svg>');
  if (choiceAsset) f.q.choices = ['<img src="assets/rationale-fixture.svg">', '2'];
  else f.q.image = 'assets/rationale-fixture.svg';
  f.writeBank();
  const pack = f.request.registryChanges.find(change => change.path.endsWith('/pack.json'));
  pack.after.standardCourses.push('M2-2');
  f.request.registryChanges.find(change => change.path.endsWith('/taxonomy.json')).after.templates[0].ownerPack = 'NEW_COURSE';
  f.request.items[0].after.courseKey = 'M2-2';
  const metadata = f.read(META), identities = f.read('archive/data/question_identity_map.json');
  for (const doc of [metadata, identities]) {
    middleParent(doc);
    doc.records[0].sourceFingerprint = auditSourceFingerprint(f.q);
    for (const row of doc.records) row.sourceQuestionNo = row.sourceOrdinal;
  }
  f.put(META, metadata); f.put('archive/data/question_identity_map.json', identities);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  git('init', '-q'); const baseSha = commit(), sourceGitBlobSha = git('rev-parse', `${baseSha}:${f.sourcePath}`);
  const nativeBefore = structuredClone(f.q), originalId = f.request.requestId, item = f.request.items[0];
  const nativeAfter = structuredClone(item.after), native = { schemaVersion: 'm2-s2-meta-review-v1',
    sourceArchiveFile: f.request.sourceArchiveFile, baseSha, sourceGitBlobSha, owner: 'immutable-native-reviewer', reviewedQuestionCount: 2,
    items: [{ questionUid: 'uid1', sourceOrdinal: 1, rpmDecision: 'CORRECT', after: nativeAfter,
      primaryMethod: '원 검토에서 명시한 방법', decisiveStep: '원 검토에서 명시한 결정 단계',
      fieldReview: { classification: '기존 ACTIVE 분류 확인', difficulty: '기존 난도 확인' }, contentDebt: [], registrationDebt: [] },
      { questionUid: 'uid2', sourceOrdinal: 2, rpmDecision: 'UNRESOLVED', after: {}, decisiveStep: '선택 밖 보류' }] };
  const nativePath = 'docs/native-rationale-review.json'; f.put(nativePath, native);
  const reviewCommit = commit(), nativeRef = { path: nativePath, sha256: hash(fs.readFileSync(path.join(f.root, nativePath))) };
  const current = { ...nativeBefore, curriculum: '2015', courseKey: 'M2-2',
    reviewStatus: 'reviewed_pass', tagStatus: 'reviewed_pass', tagConfidence: 'approved_final_qa' };
  f.writeBank(current);
  f.request.requestId = 'native-rationale-continuity'; f.request.registryChanges = [];
  const beforeDoc = f.read(META), before = beforeDoc.records[0], identity = f.read('archive/data/question_identity_map.json').records[0];
  const parentPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.parent-labels.json`;
  const parent = { questionUid: 'uid1', sourceArchiveFile: f.request.sourceArchiveFile, sourceOrdinal: 1,
    curriculumKey: '2015', courseKey: '중2 수학', standardUnitKey: before.standardUnitKey, subUnitKey: before.subUnitKey,
    L1: before.L1, L2: before.L2 };
  f.put(parentPath, { schemaVersion: 'archive-meta-pipeline-parent-label-evidence-v1', sourcePath: META,
    sourceSha256: hash(fs.readFileSync(path.join(f.root, META))), records: [parent] });
  const parentRef = { path: parentPath, sha256: hash(fs.readFileSync(path.join(f.root, parentPath))) };
  item.after = { ...nativeAfter, primaryMethod: native.items[0].primaryMethod, decisiveStep: native.items[0].decisiveStep,
    L1: before.L1, L2: before.L2, sourceFingerprint: auditSourceFingerprint(current), contentFingerprint: auditContentFingerprint(current) };
  item.before = Object.fromEntries(Object.keys(item.after).map(key => [key, before[key] ?? null]));
  item.identityBefore = { sourceFingerprint: identity.sourceFingerprint };
  item.basicScopeParentRef = parentRef; item.evidenceRefs = [nativeRef, parentRef];
  item.sourceReview = { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit, reviewPath: nativePath,
    reviewRef: nativeRef, rationaleContinuity: { schemaVersion: 'archive-native-rationale-continuity-v1' } };
  f.request.approval.evidenceRefs = [nativeRef, parentRef];
  const receiptPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.json`;
  const params = (previous = nativeBefore) => {
    const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString());
    const md = f.read(META), identityMap = f.read('archive/data/question_identity_map.json');
    const current = md.records.find(row => row.questionUid === 'uid1'), identity = identityMap.records.find(row => row.questionUid === 'uid1');
    const runtime = f.read('archive/data/meta-foundation/runtime/new-course-v1.json');
    return { question: bank[0], previous, current, identity, source: f.request.sourceArchiveFile, ordinal: 1,
      registry: loadActiveMetaRegistry(f.root), validate: validateActiveMetaFields, runtimeOwner: runtime.packId,
      nativeSource: { root: f.root, bytes, blobSha1: blob(bytes), bank, identityMap,
        identityByJoin: new Map(identityMap.records.map(row => [`${row.sourceArchiveFile}#${row.sourceOrdinal}`, row])),
        runtimeRecord: runtime.records.find(row => row.questionUid === 'uid1'), runtimeStatus: runtime.status } };
  };
  const plan = previous => planAutoQuestion(params(previous));
  return { ...f, git, item, native, nativePath, nativeBefore, current, parentPath, receiptPath, assetPath, originalId, beforeDoc, plan, params };
}

test('native metadata rationale continuity issues a durable opt-in and reuses old and caught-up cursors', t => {
  const f = metadataRationaleContinuityFixture(t), source = fs.readFileSync(path.join(f.root, f.sourcePath));
  const nativeBytes = fs.readFileSync(path.join(f.root, f.nativePath));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).replay, true);
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview.rationaleContinuity;
  assert.equal(proof.scope, 'ISSUED_NATIVE_RATIONALE_REUSE_ONLY');
  assert.equal(proof.rendererAssets.length, 1);
  assert.equal(proof.sourceRationaleFieldsAdded, false);
  assert.deepEqual(proof.sourceMetadataFields, ['courseKey', 'curriculum', 'reviewStatus', 'tagConfidence', 'tagStatus', 'templateKey',
    'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility']);
  const sidecar = reviewedSourceBindingPath(f.request.requestId);
  for (const row of [receipt.appliedRecords[0], receipt.runtimeRecords[0]]) assert.ok(row.approvalEvidence.includes(sidecar));
  const args = f.params();
  assert.equal(args.registry.status, 'ACTIVE', JSON.stringify(args.registry.errors));
  assert.equal(validateNativeReviewedSourceReuse(receipt, args.nativeSource, args.question, args.identity, args.ordinal, args.current, args.registry), true);
  const before = JSON.stringify([f.read(META), f.read('archive/data/question_identity_map.json')]);
  for (const previous of [f.nativeBefore, f.current]) {
    const result = f.plan(previous); assert.equal(result.status, 'ALREADY_REGISTERED', JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt, f.receiptPath); assert.equal(result.final, undefined);
  }
  assert.equal(JSON.stringify([f.read(META), f.read('archive/data/question_identity_map.json')]), before);
  assert.deepEqual(f.read(META).records[1], f.beforeDoc.records[1]);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.nativePath)), nativeBytes);
});

test('native metadata rationale continuity refuses mixed options, scope, invented rationale and source changes', async t => {
  for (const [name, mutate, expected] of [
    ['unknown option', f => { f.item.sourceReview.rationaleContinuity.allowMissing = true; }, /native rationale continuity/],
    ['wrong schema', f => { f.item.sourceReview.rationaleContinuity.schemaVersion += '-other'; }, /native rationale continuity/],
    ['explicit null option', f => { f.item.sourceReview.rationaleContinuity = null; }, /native rationale continuity/],
    ['renderer mix', f => { f.item.sourceReview.rendererProof = {}; }, /renderer continuity|native rationale continuity/],
    ['identity-only mode', f => { f.request.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'; }, /identity|rationale|unchanged/],
    ['FULL scope', f => { delete f.request.scope; }, /FULL|count|denominator|partial|total/],
    ['changed native method', f => { f.item.after.primaryMethod += ' invented'; }, /source reassessment/],
    ['changed native step', f => { f.item.after.decisiveStep += ' invented'; }, /source reassessment/],
    ['new source rationale', f => { f.current.primaryMethod = f.item.after.primaryMethod; f.writeBank(f.current); }, /native rationale continuity/],
    ['explicit null source rationale', f => { f.current.primaryMethod = null; f.writeBank(f.current); }, /current source rationale differs from native evidence: primaryMethod/],
    ['new source field', f => { f.current.editorialNote = 'unreviewed'; f.writeBank(f.current); }, /native rationale continuity/],
    ['new answer', f => { f.current.answer = '2'; f.writeBank(f.current); f.item.after.sourceFingerprint = auditSourceFingerprint(f.current); }, /source reassessment/],
    ['wrong parent UID', f => { const p = f.read(f.parentPath); p.records[0].questionUid = 'other'; f.put(f.parentPath, p); }, /evidence|SHA|sha|rationale/],
  ]) await t.test(name, t => {
    const f = metadataRationaleContinuityFixture(t); mutate(f);
    const before = fs.readFileSync(path.join(f.root, META));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), expected);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  });
});

test('native metadata rationale continuity checks live witnesses, assets and durable markers after issuance', async t => {
  for (const [name, mutate] of [
    ['same-path asset drift after warm cache', f => { f.put(f.assetPath, '<svg><text>changed</text></svg>'); }],
    ['missing native evidence', f => { fs.unlinkSync(path.join(f.root, f.nativePath)); }],
    ['changed parent evidence', f => { f.put(f.parentPath, {}); }],
    ['sidecar removed', f => { fs.unlinkSync(path.join(f.root, reviewedSourceBindingPath(f.request.requestId))); }],
    ['rationale proof deleted', f => { const r = f.read(f.receiptPath); delete r.fingerprintRepairs[0].sourceReview.rationaleContinuity; f.put(f.receiptPath, r); }],
    ['coordinated proof and row markers deleted', f => {
      const marker = reviewedSourceBindingPath(f.request.requestId), r = f.read(f.receiptPath);
      delete r.fingerprintRepairs[0].sourceReview.rationaleContinuity;
      for (const p of [META, 'archive/data/meta-foundation/runtime/new-course-v1.json']) {
        const d = f.read(p); d.records.find(x => x.questionUid === 'uid1').approvalEvidence = d.records.find(x => x.questionUid === 'uid1').approvalEvidence.filter(x => x !== marker); f.put(p, d);
      }
      for (const rows of [r.appliedRecords, r.runtimeRecords]) rows[0].approvalEvidence = rows[0].approvalEvidence.filter(x => x !== marker);
      f.put(f.receiptPath, r);
    }],
  ]) await t.test(name, t => {
    const f = metadataRationaleContinuityFixture(t); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(f.plan().status, 'ALREADY_REGISTERED'); mutate(f);
    for (const previous of [f.nativeBefore, f.current]) {
      const result = f.plan(previous); assert.equal(result.status, 'SUPPLEMENT_PENDING', JSON.stringify(result));
      assert.equal(result.final, undefined); assert.equal(result.nativeReviewReceipt, undefined);
    }
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /rationale|renderer|evidence|sidecar|proof|digest|registration|metadata|source-review[- ]binding/i);
  });
});

test('native metadata rationale continuity closes immutable SVG dependencies and nested choice assets', async t => {
  for (const assetBytes of ['<svg><image href=external.svg /></svg>', '<svg><image href="external.svg" /></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg" xml:base="https://example.invalid/unbound.svg"><use href="#shape"/></svg>',
    '<svg xmlns="http://www.w3.org/2000/svg"><style>.shape{fill:u\\72l(https://example.invalid/unbound.svg#paint)}</style></svg>']) {
    await t.test('immutable unsupported SVG dependency', t => {
      const f = metadataRationaleContinuityFixture(t, { assetBytes });
      const before = fs.readFileSync(path.join(f.root, META));
      assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /unsupported SVG dependency/);
      assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
    });
  }
  await t.test('choice-only image is validated again after cache warming', t => {
    const f = metadataRationaleContinuityFixture(t, { choiceAsset: true });
    registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(f.plan().status, 'ALREADY_REGISTERED');
    f.put(f.assetPath, '<svg><path d="M0 0L2 2"/></svg>');
    for (const previous of [f.nativeBefore, f.current]) assert.equal(f.plan(previous).status, 'SUPPLEMENT_PENDING');
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /current renderer bytes changed/);
  });
});

test('native metadata rationale continuity does not authorize unrelated old-cursor changes or ordinary reuse', async t => {
  const f = metadataRationaleContinuityFixture(t); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  for (const delta of [{ curriculum: '2022' }, { courseKey: 'M3-2' }, { difficultyBucket: 5 },
    { templateKey: 'OTHER' }, { primaryMethod: 'old arbitrary method' }, { solution: 'different old solution' }, { extra: true }]) {
    const result = f.plan({ ...f.nativeBefore, ...delta });
    assert.equal(result.status, 'SUPPLEMENT_PENDING', JSON.stringify(result)); assert.equal(result.final, undefined);
  }
  const plain = metadataRationaleContinuityFixture(t); delete plain.item.sourceReview.rationaleContinuity;
  registerReviewedExamV2({ root: plain.root, request: plain.request, write: true });
  assert.deepEqual(plain.plan().reasons, ['SOURCE_SEMANTIC_RATIONALE_MISSING']);
  assert.equal(plain.plan(plain.current).status, 'ALREADY_REGISTERED');
});

test("native decisive step can be carried verbatim with explicit provenance without inventing a separate method review", t => {
  const f = reviewedSourceFixture(t), values = carryReviewedRationale(f);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview;
  assert.deepEqual(proof.rationaleBindings, {
    primaryMethod: { origin: "NATIVE_DECISIVE_STEP_VERBATIM", valueSha256: hash(values.primaryMethod) },
    decisiveStep: { origin: "NATIVE_ITEM_FIELD", valueSha256: hash(values.decisiveStep) },
  });
  assert.equal(proof.newMathematicalQa, false);
  for (const row of [receipt.appliedRecords[0], receipt.runtimeRecords[0]])
    for (const [field, value] of Object.entries(values)) assert.equal(row[field], value);
});

function reviewedRationaleWithOlderSource(t) {
  const f = reviewedSourceFixture(t);
  const bytes = f.writeBank({ ...f.current, primaryMethod: "검토 이전 원본의 주풀이", decisiveStep: "검토 이전 원본의 결정 단계" });
  f.review.sourceAfterBlob = f.git("hash-object", "-w", f.sourcePath);
  f.review.sourceAfterSha256 = hash(bytes);
  f.updateReview();
  return { ...f, values: carryReviewedRationale(f) };
}

test("verbatim native rationale takes precedence over an older source method and survives official replay", t => {
  const f = reviewedRationaleWithOlderSource(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview;
  assert.deepEqual(proof.rationaleBindings.primaryMethod, {
    origin: "NATIVE_DECISIVE_STEP_VERBATIM", valueSha256: hash(f.values.primaryMethod),
  });
  assert.equal(proof.rationaleBindings.decisiveStep.origin, "NATIVE_ITEM_FIELD");
  assert.equal(proof.newMathematicalQa, false);
  for (const row of [receipt.appliedRecords[0], receipt.runtimeRecords[0]])
    for (const [field, value] of Object.entries(f.values)) assert.equal(row[field], value);
  const replay = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(replay.replay, true);
  assert.deepEqual(replay.plannedPaths, []);
});

test("verbatim native rationale rejects any one of the four mismatched declarations", t => {
  for (const target of ["request", "source"]) for (const field of ["primaryMethod", "decisiveStep"]) {
    const f = reviewedRationaleWithOlderSource(t);
    if (target === "request") f.item.after[field] = "독립 근거 없는 다른 설명";
    else f.writeBank({ ...f.current, ...f.values, [field]: "독립 근거 없는 다른 설명" });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /primaryMethod|decisiveStep/);
    assert.equal(fs.existsSync(path.join(f.root, f.receiptPath)), false);
  }
});

test("already-matching committed rationale keeps its source provenance for receipt compatibility", t => {
  const f = reviewedRationaleWithOlderSource(t);
  f.review.sourceAfterBlob = f.git("hash-object", "-w", f.sourcePath);
  f.review.sourceAfterSha256 = hash(fs.readFileSync(path.join(f.root, f.sourcePath)));
  f.updateReview();
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.deepEqual(f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.rationaleBindings.primaryMethod, {
    origin: "REVIEW_COMMIT_SOURCE_FIELD", valueSha256: hash(f.values.primaryMethod),
  });
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).replay, true);
});

test("explicit native after and item methods still outrank verbatim decisive-step transport", t => {
  for (const location of ["after", "item"]) {
    const f = reviewedRationaleWithOlderSource(t);
    if (location === "after") f.review.items[0].after.primaryMethod = "별도로 확정된 native 주풀이";
    else f.review.items[0].primaryMethod = "별도로 확정된 native 주풀이";
    f.review.sourceAfterBlob = f.git("hash-object", "-w", f.sourcePath);
    f.review.sourceAfterSha256 = hash(fs.readFileSync(path.join(f.root, f.sourcePath)));
    f.updateReview();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /primaryMethod/);
    assert.equal(fs.existsSync(path.join(f.root, f.receiptPath)), false);
  }
});

test("native explicit rationale and committed source rationale retain their distinct provenance", t => {
  const native = reviewedSourceFixture(t, "m2-s2-meta-review-v1");
  native.review.items[0].primaryMethod = "원검토에 명시된 주풀이"; native.updateReview(); carryReviewedRationale(native);
  registerReviewedExamV2({ root: native.root, request: native.request, write: true });
  assert.equal(native.read(native.receiptPath).fingerprintRepairs[0].sourceReview.rationaleBindings.primaryMethod.origin, "NATIVE_ITEM_FIELD");

  const source = reviewedSourceFixture(t), values = carryReviewedRationale(source, "검토 commit 원본에 실린 주풀이");
  source.review.sourceAfterBlob = source.git("hash-object", "-w", source.sourcePath);
  source.review.sourceAfterSha256 = hash(fs.readFileSync(path.join(source.root, source.sourcePath)));
  source.updateReview();
  registerReviewedExamV2({ root: source.root, request: source.request, write: true });
  const proof = source.read(source.receiptPath).fingerprintRepairs[0].sourceReview;
  assert.deepEqual(proof.rationaleBindings.primaryMethod, { origin: "REVIEW_COMMIT_SOURCE_FIELD", valueSha256: hash(values.primaryMethod) });
});

function reviewedRpmFixture(t) {
  const f=reviewedSourceFixture(t),rpmPath={majorUnit:"정본 RPM 대단원",midUnit:"정본 RPM 중단원",l3:"정본 RPM 개념",l4:"정본 RPM 유형"};
  const fields={rpmPrimaryId:"FIXTURE-RPM-1",rpmPrimaryPath:rpmPath,
    rpmL1:rpmPath.majorUnit,rpmL2:rpmPath.midUnit,rpmL3:rpmPath.l3,rpmL4:rpmPath.l4};
  const masterPath="docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
  const crosswalkPath="archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json";
  f.put(masterPath,{schemaVersion:"js-archive-taxonomy-rpm-primary-v1.0",authorityStatus:"LOCKED",records:[{
    curriculum:f.item.after.curriculum,scope:f.item.after.courseKey,majorUnit:rpmPath.majorUnit,midUnit:rpmPath.midUnit,
    concepts:[{concept:rpmPath.l3,problemTypes:[{problemType:rpmPath.l4}]}]}]});
  f.put(crosswalkPath,{schemaVersion:"rpm-primary-active-crosswalk-v1",status:"ACTIVE_REFERENCE",rpmAuthority:{source:masterPath},
    records:[{id:fields.rpmPrimaryId,curriculum:f.item.after.curriculum,scope:f.item.after.courseKey,rpmPath,
      mappingStatus:"DIRECT_ACTIVE",problemTypeKey:"PT_NEW",templateKey:"TPL_CROSSWALK_OLD_SINGLE_MAPPING"}]});
  Object.assign(f.current,fields);f.writeBank(f.current);
  for(const [key,value] of Object.entries(fields)) {
    f.item.before[key]=f.read(META).records[0][key]??null;f.item.after[key]=value;
    delete f.review.items[0].after[key];
  }
  f.review.sourceAfterBlob=f.git("hash-object","-w",f.sourcePath);
  f.review.sourceAfterSha256=hash(fs.readFileSync(path.join(f.root,f.sourcePath)));
  f.updateReview();return {...f,fields,masterPath,crosswalkPath};
}

test("reviewed RPM source fields retain immutable provenance and independent ACTIVE PT/TPL decisions",t=>{
  const f=reviewedRpmFixture(t),source=fs.readFileSync(path.join(f.root,f.sourcePath));
  registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const receipt=f.read(f.receiptPath),proof=receipt.fingerprintRepairs[0].sourceReview;
  for(const [key,value] of Object.entries(f.fields)) {
    assert.equal(proof.rpmBindings[key].origin,"REVIEW_COMMIT_SOURCE_FIELD");
    assert.match(proof.rpmBindings[key].valueSha256,/^[a-f0-9]{64}$/);
    for(const row of [receipt.appliedRecords[0],receipt.runtimeRecords[0]])assert.deepEqual(row[key],value);
  }
  assert.equal(receipt.appliedRecords[0].templateKey,"TPL_NEW","crosswalk RPM provenance is not a single-TPL override");
  assert.equal(receipt.rpmPrimaryBindings[0].selectsPtTpl,false);
  assert.equal(receipt.rpmPrimaryBindings[0].authorityUse,"RPM_PATH_PROVENANCE_ONLY");
  assert.equal(receipt.rpmPrimaryBindings[0].crosswalkRef.sha256,hash(fs.readFileSync(path.join(f.root,f.crosswalkPath))));
  assert.deepEqual(fs.readFileSync(path.join(f.root,f.sourcePath)),source);
  assert.deepEqual(f.read(META).records[1],f.hold);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);
});

test("RPM provenance rejects fabricated, ambiguous, contradictory or out-of-scope IDs and paths",async t=>{
  const cases=[
    ["unknown ID",f=>{f.current.rpmPrimaryId="UNKNOWN";f.item.after.rpmPrimaryId="UNKNOWN";f.writeBank(f.current);},/record ID missing/],
    ["undeclared ID",f=>{delete f.current.rpmPrimaryId;f.writeBank(f.current);},/exact declared source value/],
    ["different declared ID",f=>{f.item.after.rpmPrimaryId="OTHER";},/exact declared source value/],
    ["duplicate ID",f=>{const d=f.read(f.crosswalkPath);d.records.push(structuredClone(d.records[0]));f.put(f.crosswalkPath,d);},/record ID.*ambiguous/],
    ["inactive authority",f=>{const d=f.read(f.crosswalkPath);d.status="INACTIVE";f.put(f.crosswalkPath,d);},/crosswalk authority/],
    ["other curriculum",f=>{const d=f.read(f.crosswalkPath);d.records[0].curriculum="2015";f.put(f.crosswalkPath,d);},/curriculum\/scope/],
    ["other scope",f=>{const d=f.read(f.crosswalkPath);d.records[0].scope="OTHER";f.put(f.crosswalkPath,d);},/curriculum\/scope/],
    ["other ID path",f=>{const d=f.read(f.crosswalkPath);d.records[0].rpmPath.l4="다른 유형";f.put(f.crosswalkPath,d);},/ID and RPM path/],
    ["contradictory flat value",f=>{f.current.rpmL4="다른 유형";f.item.after.rpmL4="다른 유형";f.writeBank(f.current);},/flat RPM field/],
    ["omitted source path",f=>{delete f.item.after.rpmPrimaryPath;delete f.item.before.rpmPrimaryPath;},/source\/final value mismatch/],
    ["path aliases conflict",f=>{f.current.rpmPrimaryPath={...f.fields.rpmPrimaryPath,L4:"다른 유형"};f.item.after.rpmPrimaryPath=f.current.rpmPrimaryPath;f.writeBank(f.current);},/aliases.*conflicting/],
    ["missing master leaf",f=>{const d=f.read(f.masterPath);d.records[0].concepts[0].problemTypes=[];f.put(f.masterPath,d);},/path missing or ambiguous/],
    ["unlocked master",f=>{const d=f.read(f.masterPath);d.authorityStatus="DRAFT";f.put(f.masterPath,d);},/master authority/],
  ];
  for(const [name,mutate,error]of cases)await t.test(name,t=>{
    const f=reviewedRpmFixture(t),before=fs.readFileSync(path.join(f.root,META));mutate(f);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),error);
    assert.deepEqual(fs.readFileSync(path.join(f.root,META)),before);
  });
});

test("source RPM transport cannot contradict immutable native decisions or resurrect an omitted value",t=>{
  const f=reviewedRpmFixture(t);
  f.review.items[0].after.rpmPrimaryId="NATIVE_DIFFERENT_ID";f.updateReview();
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request}),/current source RPM differs from native evidence/);
  const omitted=reviewedRpmFixture(t);
  delete omitted.item.before.rpmPrimaryId;delete omitted.item.after.rpmPrimaryId;
  assert.throws(()=>registerReviewedExamV2({root:omitted.root,request:omitted.request}),/reviewed after value mismatch.*rpmPrimaryId/);
  const changed=reviewedRpmFixture(t);
  changed.current.rpmPrimaryPath=["정본 RPM 대단원","정본 RPM 중단원","정본 RPM 개념","정본 RPM 유형"].join("/");
  changed.item.after.rpmPrimaryPath=changed.current.rpmPrimaryPath;changed.writeBank(changed.current);
  assert.throws(()=>registerReviewedExamV2({root:changed.root,request:changed.request}),/current source RPM differs from native evidence/);
});

test("source reassessment ignores native annotations outside the official value contract", t => {
  const f = reviewedSourceFixture(t);
  Object.assign(f.review.items[0].after, { standardUnitOrder: 7, category: "native-source-category",
    meaningMeta: { reviewed: true }, metaStatus: "NATIVE_DONE", metaDebtFields: [] });
  f.updateReview();
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
});

test("native rationale transport refuses invented text, source drift, omitted corrections and evidence substitution", t => {
  const commitCurrentReview = f => {
    f.review.sourceAfterBlob = f.git("hash-object", "-w", f.sourcePath);
    f.review.sourceAfterSha256 = hash(fs.readFileSync(path.join(f.root, f.sourcePath)));
    f.updateReview();
  };
  for (const mutate of [
    f => { f.item.after.primaryMethod += " 다른 판단"; },
    f => { f.writeBank({ ...f.current, ...f.item.after, primaryMethod: "검토하지 않은 주풀이" }); },
    f => { delete f.item.after.primaryMethod; delete f.item.before.primaryMethod; },
    f => { delete f.item.after.decisiveStep; delete f.item.before.decisiveStep; },
    f => { f.item.after.decisiveStep = "다른 문항의 결정 단계"; },
    f => { f.item.after.primaryMethod = f.review.items[1].decisiveStep; },
    f => { f.review.items[0].primaryMethod = "native의 실제 별도 주풀이"; commitCurrentReview(f); },
    f => { f.review.items[0].after.primaryMethod = "native after에 확정된 별도 주풀이"; commitCurrentReview(f); },
  ]) {
    const f = reviewedSourceFixture(t); carryReviewedRationale(f); mutate(f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source reassessment: .*rationale|changed value not approved by native review|reviewed after value mismatch/);
  }
  const f = reviewedSourceFixture(t);
  f.review.items[0].primaryMethod = "원검토가 확정한 주풀이"; f.updateReview(); carryReviewedRationale(f);
  const meta = f.read(META); meta.records[0].primaryMethod = "예전 메타 주풀이"; f.put(META, meta);
  delete f.item.after.primaryMethod; delete f.item.before.primaryMethod;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /reviewed after value mismatch \(including omitted field\): primaryMethod/);
});

test("reassessment keeps exact before/identity checks and does not replace the older rebind guard", t => {
  for (const [mutate, error] of [
    [f => { f.item.before.sourceFingerprint = "a".repeat(64); }, /before mismatch/],
    [f => { f.item.identityBefore.sourceFingerprint = "a".repeat(64); }, /identity fingerprint before mismatch/],
    [f => { f.item.after.contentFingerprint = "a".repeat(64); }, /computed fingerprint mismatch/],
    [f => { f.item.rebind = {}; }, /exclusive PARTIAL_UIDS FINAL_QA/],
    [f => { f.request.approval.sourceRebind = {}; }, /exclusive PARTIAL_UIDS FINAL_QA/],
    [f => { f.request.approval.type = "REVIEW2"; f.request.approval.reviewPassCount = 2; }, /exclusive PARTIAL_UIDS FINAL_QA/],
    [f => { delete f.item.sourceReview; }, /fingerprint rebind evidence required/],
  ]) {
    const f = reviewedSourceFixture(t); mutate(f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), error);
  }
});

function identityOnlyFixture(t) {
  const f = reviewedSourceFixture(t, "m2-s1-meta-review-v1"), meta = f.read(META);
  const fingerprints = { sourceFingerprint: f.sourceSha(f.current), contentFingerprint: f.bodySha(f.current) };
  Object.assign(meta.records[0], fingerprints, { reviewStatus: "reviewed_pass", metadataStatus: "approved_partial_with_explicit_holds",
    problemTypeKey: "", templateKey: null, fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" },
    approvalEvidence: ["docs/approval.json"] });
  f.put(META, meta);
  const runtimePath = "archive/data/meta-foundation/runtime/preserved.json";
  f.put(runtimePath, { packId: "PRESERVED", records: [{ questionUid: "uid1", status: "HOLD", problemTypeKey: "", templateKey: null }] });
  f.request.registrationMode = "IDENTITY_FINGERPRINT_ONLY";
  f.request.registryChanges = [];
  f.item.before = { ...fingerprints }; f.item.after = { ...fingerprints };
  f.put("archive/data/generated-lite-consumer/v1/index.json", { records: [] });
  return { ...f, fingerprints, runtimePath };
}

test("identity-only preserves unresolved semantic holds and cannot perform proposal finalization", t => {
  const f = identityOnlyFixture(t), before = fs.readFileSync(path.join(f.root, META));
  f.review.proposals = [{ id: "E001-CC-PENDING", type: "CC", supportingQuestionUids: ["uid1"] }];
  f.review.items[0].proposalRefs = ["E001-CC-PENDING"]; f.updateReview();
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).newMetadataApprovals, 0);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  f.item.sourceReview.proposalFinalization = { schemaVersion: "archive-native-proposal-finalization-v1",
    finalizationCommit: f.item.sourceReview.reviewCommit, proposalIds: ["E001-CC-PENDING"] };
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /exact supported native proposal selection/);
});

test("identity-only legacy alias repair still binds the immutable reviewed student payload", t => {
  const f = identityOnlyFixture(t), q = addLegacyAlias(f, f.current);
  f.review.sourceGitBlobSha = f.git("hash-object", "-w", f.sourcePath);
  f.review.items[0].sourceEvidence.sourceGitBlobSha = f.review.sourceGitBlobSha;
  f.updateReview(); f.review.baseSha = f.git("rev-parse", "HEAD"); f.updateReview();
  const beforeMeta = fs.readFileSync(path.join(f.root, META)), beforeSource = fs.readFileSync(path.join(f.root, f.sourcePath));
  const out = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(out.newMetadataApprovals, 0);
  assert.equal(f.read("archive/data/question_identity_map.json").records[0].sourceFingerprint, f.fingerprints.sourceFingerprint);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), beforeMeta);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), beforeSource);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  q.questionUid = "unknown"; f.writeBank(q); f.request.requestId = "unknown-alias-refused";
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /identity-only UID\/source mismatch/);
});

test("identity-only repair changes one identity binding and preserves metadata, holds, runtime and source bytes", t => {
  const f = identityOnlyFixture(t), raw = p => fs.readFileSync(path.join(f.root, p));
  const protectedPaths = [META, f.sourcePath, f.runtimePath, `${CANON}/registry_index.json`];
  const before = new Map(protectedPaths.map(p => [p, raw(p)])), identityBefore = raw("archive/data/question_identity_map.json");
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.deepEqual(dry.plannedPaths, ["archive/data/question_identity_map.json", f.receiptPath]);
  assert.deepEqual(raw("archive/data/question_identity_map.json"), identityBefore);
  const out = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(out.metadataChanged, false); assert.equal(out.newMetadataApprovals, 0);
  for (const [p, bytes] of before) assert.deepEqual(raw(p), bytes, p);
  const [repaired, held] = f.read("archive/data/question_identity_map.json").records;
  assert.equal(repaired.sourceFingerprint, f.fingerprints.sourceFingerprint); assert.deepEqual(held, f.hold);
  const receipt = f.read(f.receiptPath);
  assert.equal(receipt.schemaVersion, "archive-reviewed-identity-fingerprint-repair-v1");
  assert.equal(receipt.metadataRegistrationStatus, "PRESERVED_WITHOUT_NEW_APPROVAL");
  assert.equal(receipt.fingerprintRepairs[0].sourceReview.scope, "IDENTITY_BINDING_ONLY");
  assert.equal(receipt.metadataPreservation.beforeSha256, hash(before.get(META)));
  assert.equal(receipt.metadataPreservation.afterSha256, receipt.metadataPreservation.beforeSha256);
  assert.equal(receipt.appliedRecords, undefined); assert.equal(receipt.runtimeRecords, undefined);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  const metadata = f.read(META); metadata.records[0].difficultyBucket = 2; f.put(META, metadata);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true, "later independently registered non-binding values are not owned by this identity receipt");
});

test("identity-only repair refuses semantic changes, unapproved/stale metadata, a wrong before and missing review evidence", t => {
  for (const [mutate, error] of [
    [f => { f.item.after.difficultyBucket = 2; f.item.before.difficultyBucket = 3; }, /fingerprint fields only/],
    [f => { f.item.typeHold = true; }, /fingerprint fields only/],
    [f => { f.request.registryChanges = [{ path: "unused", evidenceRefs: f.evidenceRefs }]; }, /without registry changes/],
    [f => { const m = f.read(META); m.records[0].metadataStatus = "review_required"; m.records[0].reviewStatus = "review_required"; f.put(META, m); }, /metadata approval missing/],
    [f => { const m = f.read(META); m.records[0].sourceFingerprint = "a".repeat(64); f.put(META, m); }, /current metadata\/source fingerprint mismatch/],
    [f => { f.item.before.contentFingerprint = "a".repeat(64); }, /current metadata\/source fingerprint mismatch/],
    [f => { f.item.identityBefore.sourceFingerprint = "a".repeat(64); }, /identity fingerprint before mismatch/],
    [f => { delete f.item.sourceReview; }, /explicit commit and SHA-bound native review required/],
    [f => { const id = f.read("archive/data/question_identity_map.json"); id.records[0].sourceFingerprint = f.fingerprints.sourceFingerprint; f.put("archive/data/question_identity_map.json", id); f.item.identityBefore.sourceFingerprint = f.fingerprints.sourceFingerprint; }, /repair unnecessary/],
    [f => { f.request.registrationMode = "UNKNOWN_MODE"; }, /unsupported registration mode/],
  ]) {
    const f = identityOnlyFixture(t); mutate(f);
    const before = fs.readFileSync(path.join(f.root, "archive/data/question_identity_map.json"));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), error);
    assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_identity_map.json")), before);
  }
});

test("identity-only repair rolls back identity if receipt persistence fails", t => {
  const f = identityOnlyFixture(t), identityPath = path.join(f.root, "archive/data/question_identity_map.json");
  const before = fs.readFileSync(identityPath), writeFile = fs.writeFileSync;
  try {
    fs.writeFileSync = (file, ...args) => {
      if (file === path.join(f.root, f.receiptPath)) throw new Error("fixture receipt write failure");
      return writeFile(file, ...args);
    };
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /fixture receipt write failure/);
  } finally { fs.writeFileSync = writeFile; }
  assert.deepEqual(fs.readFileSync(identityPath), before);
  assert.equal(fs.existsSync(path.join(f.root, f.receiptPath)), false);
});

test("identity-only replay refuses extra receipt UIDs and stale identity bindings", t => {
  const f = identityOnlyFixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath);
  f.put(f.receiptPath, { ...receipt, appliedIdentityRecords: [...receipt.appliedIdentityRecords, f.hold] });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /receipt scope\/binding drift/);
  f.put(f.receiptPath, receipt);
  const identity = f.read("archive/data/question_identity_map.json"); identity.records[0].sourceFingerprint = "a".repeat(64);
  f.put("archive/data/question_identity_map.json", identity);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /receipt scope\/binding drift/);
});

test("identity-only Consumer check validates real page visibility and exact fingerprints without granting an assignment", t => {
  const f = identityOnlyFixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const bindings = f.read(f.receiptPath).bindings;
  const catalog = { records: bindings.map(b => ({ ...b, sourceFile: b.sourceArchiveFile,
    assignmentFingerprint: b.contentFingerprint, canonicalAssignmentReasons: ["assignment_missing"], metadataConflicts: [] })), sourceHashes: [] };
  assert.deepEqual(verifyIdentityFingerprintConsumer(f.root, bindings, catalog), { identityBindings: 1, newMetadataApprovals: 0 });
  for (const change of [{ sourceFingerprint: "a".repeat(64) }, { assignmentFingerprint: "a".repeat(64) }, { sourceOrdinal: 2 }])
    assert.throws(() => verifyIdentityFingerprintConsumer(f.root, bindings, { ...catalog, records: [{ ...catalog.records[0], ...change }] }), /Consumer source binding mismatch/);
  assert.throws(() => verifyIdentityFingerprintConsumer(f.root, bindings, { ...catalog,
    records: [{ ...catalog.records[0], metadataConflicts: ["standardUnitKey"] }] }), /Consumer metadata conflict/);
});

// Expand the inputs before the official original audit writer runs. A partial
// preservation test therefore consumes a real full receipt, not a hand-built
// subset of an invented approval.
function expandOriginalAuditInputs(f, count) {
  const firstUid = f.request.items[0].questionUid;
  const uidAt = n => n === 1 ? firstUid : firstUid.startsWith('qid_v1_') ? 'qid_v1_' + hash('audit fixture ' + n) : 'uid' + n;
  const bank = Array.from({ length: count }, (_, i) => ({ ...structuredClone(f.q), id: i + 1 }));
  f.request.items = bank.map((q, i) => ({ ...structuredClone(f.request.items[0]), questionUid: uidAt(i + 1), sourceOrdinal: i + 1 }));
  f.request.expectedQuestionCount = count;
  const bytes = 'window.questions=' + JSON.stringify(bank) + ';\n';
  f.put('archive/exams/' + f.request.sourceArchiveFile, bytes); f.request.expectedSourceBlobSha1 = blob(bytes);
  for (const p of [META, 'archive/data/question_identity_map.json']) {
    const doc = f.read(p), first = doc.records[0];
    doc.records = bank.map((q, i) => ({ ...structuredClone(first), questionUid: uidAt(i + 1), sourceOrdinal: i + 1,
      sourceFingerprint: auditSourceFingerprint(q), ...(Object.hasOwn(first, 'contentFingerprint') ? { contentFingerprint: auditContentFingerprint(q) } : {}) }));
    f.put(p, doc);
  }
  const proof = f.request.approval.metaPipelineAudit;
  for (const key of ['auditPackageRef', 'manifestRef', 'classificationRef']) {
    if (!proof[key]) continue;
    const doc = f.read(proof[key].path), field = key === 'manifestRef' ? 'recordsToBind' : 'records';
    doc[field] = bank.map((q, i) => ({ ...structuredClone(doc[field][0]), questionId: i + 1 }));
    doc.sourceSha256 = hash(bytes);
    if (Object.hasOwn(doc, 'totalQuestions')) doc.totalQuestions = count;
    if (doc.statistics) Object.assign(doc.statistics, { totalQuestions: count, approved: count, atomicCrossConceptsBound: count });
    if (doc.payloadSummary) Object.assign(doc.payloadSummary, { totalQuestions: count, approved: count });
    f.put(proof[key].path, doc);
  }
  const parity = f.read(proof.sourceParityRef.path), firstParity = parity.records[0];
  Object.assign(parity, { driveSourceSha256: hash(bytes), productionSourceSha256: hash(bytes), productionSourceBlobSha1: blob(bytes), questionCount: count });
  parity.records = bank.map((q, i) => {
    const payload = hash(stable(Object.fromEntries(parity.studentFields.map(k => [k, Object.hasOwn(q, k) ? q[k] : null]))));
    return { ...structuredClone(firstParity), sourceOrdinal: i + 1, questionId: i + 1, questionUid: uidAt(i + 1),
      driveStudentPayloadSha256: payload, productionStudentPayloadSha256: payload };
  });
  f.put(proof.sourceParityRef.path, parity);
  for (const debt of proof.unreviewedFields || []) debt.questionUids = f.request.items.map(r => r.questionUid);
  for (const change of f.request.registryChanges) for (const concept of change.after?.concepts || []) {
    concept.supportingQuestionUids = f.request.items.map(r => r.questionUid); concept.supportingItemCount = count;
  }
  const updated = new Map(['auditPackageRef', 'manifestRef', 'classificationRef', 'sourceParityRef'].filter(k => proof[k])
    .map(k => [proof[k].path, hash(fs.readFileSync(path.join(f.root, proof[k].path)))]));
  const refresh = value => {
    if (!value || typeof value !== 'object') return;
    if (updated.has(value.path) && Object.hasOwn(value, 'sha256')) value.sha256 = updated.get(value.path);
    for (const child of Object.values(value)) refresh(child);
  };
  refresh(f.request);
  return bank;
}

function auditedSourcePreservationFixture(t, { solution = false, legacySourceAudit = false, consumerParent = false,
  consumerCatalog = false, questionCount = 1, selectedOrdinals = null, choiceRenderer = false } = {}) {
  const f = fixture(t, '중2 수학', '2015');
  legacySourceAudit ||= consumerParent;
  const canonicalSource = consumerParent || consumerCatalog;
  const uid = canonicalSource ? 'qid_v1_' + '1'.repeat(64) : 'uid1';
  const knownUnit = value => JSON.parse(JSON.stringify(value).replaceAll('UNIT_NEW', 'M2-01').replaceAll('SUB_NEW', 'M2-01-EXPONENT_LAW')
    .replaceAll('uid1', uid).replaceAll('fixture/exam.js', canonicalSource ? 'original/middle/m2/2mid/fixture.js' : 'fixture/exam.js'));
  f.request = knownUnit(f.request); f.q = knownUnit(f.q);
  if (consumerCatalog) {
    f.request.items[0].after.courseKey = 'M2-2';
    f.request.registryChanges.find(c => c.path.endsWith('/pack.json')).after.standardCourses.push('M2-2');
  }
  for (const change of f.request.registryChanges)
    for (const row of change.after?.templates || []) row.ownerPack = 'NEW_COURSE';
  for (const p of [META, 'archive/data/question_identity_map.json']) f.put(p, knownUnit(f.read(p)));
  if (choiceRenderer) {
    f.q.choices[0] = '<img src="assets/images/audit-choice.svg">';
    f.put('archive/assets/images/audit-choice.svg', typeof choiceRenderer === 'string' ? choiceRenderer
      : '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>\n');
    for (const p of [META, 'archive/data/question_identity_map.json']) {
      const doc = f.read(p); doc.records[0].sourceFingerprint = auditSourceFingerprint(f.q); f.put(p, doc);
    }
  }
  const sourcePath = 'archive/exams/' + f.request.sourceArchiveFile;
  if (legacySourceAudit) {
    f.q.crossConceptKeys = [];
    f.q.metaStatus = 'RPM_SEMANTIC_FINAL_PROJECTION_UNMATERIALIZED';
    f.q.metaNullReason = 'Prior source placeholder; the audit binds the exact approved sidecar.';
  } else delete f.q.integrationPattern;
  f.put(sourcePath, 'window.questions=' + JSON.stringify([f.q]) + ';\n');
  f.request.expectedSourceBlobSha1 = blob(fs.readFileSync(path.join(f.root, sourcePath)));
  if (!legacySourceAudit) {
    f.request.items[0].before.integrationPattern = null; f.request.items[0].after.integrationPattern = null;
  }
  const metadata = f.read(META);
  Object.assign(metadata.records[0], { contentFingerprint: auditContentFingerprint(f.q),
    tagStatus: legacySourceAudit ? 'approved_subunit_concept_partial' : 'review_required',
    tagConfidence: legacySourceAudit ? 'rule_inferred' : 'review_required',
    fieldStatus: { difficulty: legacySourceAudit ? 'approved_source' : 'source_unreviewed' } });
  if (legacySourceAudit) delete metadata.records[0].reviewStatus;
  f.put(META, metadata);
  if (legacySourceAudit) attachMetaPipelineAuditV2(f);
  else {
    attachMetaPipelineAudit(f);
    f.request.approval.metaPipelineAudit.unreviewedFields = [{ field: 'integrationPattern', status: 'EVIDENCE_DEBT',
      questionUids: [uid], reason: 'The audit did not assess integration.' }];
  }
  const bank = questionCount === 1 ? [f.q] : expandOriginalAuditInputs(f, questionCount);
  f.q = bank[0];
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receiptPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json';
  const prior = f.read(receiptPath), beforeBank = structuredClone(bank), beforeQuestion = beforeBank[0], old = prior.appliedRecords[0];
  const selected = selectedOrdinals || bank.map((_, i) => i + 1);
  const parentLinksPath = 'archive/data/basic-scope-parent-links.json', rpmMasterPath = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  const projectedParent = { grade: '중2', curriculumKey: old.curriculumKey, courseKey: old.courseKey, L1: old.L1, L2: '현재 정본의 기본 부모' };
  if (consumerParent) {
    f.put(rpmMasterPath, { records: [{ curriculum: projectedParent.curriculumKey, scope: projectedParent.courseKey,
      majorUnit: projectedParent.L1, midUnit: projectedParent.L2, concepts: [] }] });
    f.put(parentLinksPath, { schemaVersion: 'archive2-basic-scope-parent-links-v1', status: 'DERIVED_READ_ONLY',
      authority: { source: rpmMasterPath, sha256: hash(fs.readFileSync(path.join(f.root, rpmMasterPath))) },
      sourceParents: prior.appliedRecords.map(row => ({ questionUid: row.questionUid, sourceFingerprint: row.sourceFingerprint,
        assignmentFingerprint: row.contentFingerprint, ...projectedParent })) });
  }
  const git = (...args) => execFileSync('git', args, { cwd: f.root, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  const checkpoint = label => { git('add', '.'); git('-c', 'user.name=fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '-qm', label); return git('rev-parse', 'HEAD'); };
  git('init', '-q'); const priorCommit = checkpoint('original audited approval');
  const masterPath = 'archive/data/master_tables/js_archive_tag_master.json';
  const master = f.read(masterPath); master.find(r => r.key === 'M2-01').labelKo = '현재 정본 표시'; f.put(masterPath, master);
  for (const q of bank) {
    if (!legacySourceAudit) q.standardUnit = '현재 정본 표시';
    q.difficultyBucket = 2;
  }
  if (solution) f.q.solution = '독립적으로 확인한 해설의 제한된 정정';
  const sourceBytes = 'window.questions=' + JSON.stringify(bank) + ';\n'; f.put(sourcePath, sourceBytes);
  execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: f.root, input: sourceBytes });
  const ref = p => ({ path: p, sha256: hash(fs.readFileSync(path.join(f.root, p))) });
  let solutionRepair;
  if (solution) {
    const proofPath = '.archive-meta-register/evidence/narrow-solution.json';
    f.put(proofPath, { schemaVersion: 'archive-source-solution-repair-v1', status: 'NARROW_REPAIR_REVIEWED', rows: [{
      sourceArchiveFile: f.request.sourceArchiveFile, ordinal: 1, questionUid: uid,
      beforeSourceBlobSha: prior.sourceBlobSha1, afterSourceBlobSha: blob(sourceBytes),
      beforeSolutionSha256: hash(beforeQuestion.solution), afterSolutionSha256: hash(f.q.solution), changedFields: ['solution'],
      reason: 'Bounded solution clarification', reviewScope: 'No new full-exam QA or classification approval',
      reviewers: { author: 'author', independent: 'independent' }
    }] });
    solutionRepair = { ref: ref(proofPath), reviewCommit: checkpoint('independent bounded solution evidence'), reviewPath: proofPath };
  }
  const keys = ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
  const after = { difficultyBucket: 2, difficultyConfidence: 'high', difficultyBoundaryFlag: 'B23', legacyLevelCompatibility: 'NORMAL' };
  const difficultyRows = bank.map((q, i) => {
    const priorRow = prior.appliedRecords[i];
    const before = { ...Object.fromEntries(keys.map(k => [k, priorRow[k] ?? null])), level: priorRow.level,
      sourceFingerprint: priorRow.sourceFingerprint, contentFingerprint: priorRow.contentFingerprint };
    return { sourceArchiveFile: f.request.sourceArchiveFile, ordinal: i + 1, questionUid: priorRow.questionUid, before, after,
      sourceFingerprint: auditSourceFingerprint(q), contentFingerprint: auditContentFingerprint(q),
      staleSourceBinding: false, refreshBinding: false, decision: 'CORRECT', reason: 'Independent difficulty correction' };
  });
  const difficultyPath = '.archive-meta-register/inbox/preserved-difficulty.json', proofPath = '.archive-meta-register/evidence/preserved-difficulty.json';
  f.put(proofPath, { schemaVersion: 'archive-difficulty5-reviewed-correction-v1', rows: difficultyRows });
  const difficulty = { schemaVersion: 'archive-difficulty5-register-request-v1',
    gemini: { schemaVersion: 'v1', requestId: 'preserved-difficulty', sourceArchiveFile: f.request.sourceArchiveFile,
      latestBlobSha: blob(sourceBytes), items: difficultyRows.map(({ ordinal, questionUid, before, after }) => ({ ordinal, questionUid, before, after })) },
    reviewedCorrection: { schemaVersion: 'archive-difficulty5-reviewed-correction-v1', approvalRef: 'independent fixture review',
      evidencePath: proofPath, evidenceSha256: ref(proofPath).sha256, rows: difficultyRows } };
  f.put(difficultyPath, difficulty);
  registerDifficulty5({ root: f.root, request: difficulty, write: true });
  const refs = [ref(receiptPath), ref(masterPath), ref(difficultyPath), ref(proofPath), ...(solutionRepair ? [solutionRepair.ref] : [])];
  let consumerParentRef;
  if (consumerParent) {
    const parentProofPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/preserved.parent-preservation.json';
    const parentFields = ['sourceOrdinal', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'curriculumKey', 'courseKey', 'sourceFingerprint', 'contentFingerprint'];
    f.put(parentProofPath, { schemaVersion: 'archive-native-audit-consumer-parent-preservation-v1', sourceArchiveFile: prior.sourceArchiveFile,
      expectedQuestionCount: questionCount, priorReceiptRef: refs[0], priorConsumerCommit: priorCommit,
      parentLinks: { ...ref(parentLinksPath), blobSha1: blob(fs.readFileSync(path.join(f.root, parentLinksPath))) },
      records: selected.map(n => { const row = prior.appliedRecords[n - 1]; return {
        questionUid: row.questionUid, ...Object.fromEntries(parentFields.map(k => [k, row[k]])), ...projectedParent }; }) });
    consumerParentRef = ref(parentProofPath); refs.push(consumerParentRef);
  }
  const requestId = 'preserve-audit', requestPath = '.archive-meta-register/inbox/' + requestId + '.json';
  const request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId, examUid: prior.examUid,
    sourceArchiveFile: prior.sourceArchiveFile, expectedSourceBlobSha1: blob(sourceBytes), expectedQuestionCount: questionCount,
    ...(selectedOrdinals ? { scope: 'PARTIAL_UIDS' } : {}),
    approval: { type: 'META_PIPELINE_AUDIT', metadataReviewed: true, approvedBy: 'existing-approval-preservation',
      metaPipelineAudit: prior.approval.metaPipelineAudit, evidenceRefs: refs,
      sourceRebind: { schemaVersion: 'archive-native-audit-preservation-v1', requestPath, priorCommit,
        priorReceiptRef: refs[0], difficultyRequestRef: refs[2], ...(solutionRepair ? { solutionRepair } : {}), ...(consumerParentRef ? { consumerParentRef } : {}) } },
    items: selected.map(n => ({ questionUid: prior.appliedRecords[n - 1].questionUid, sourceOrdinal: n, before: {}, after: {},
      reason: 'Preserve actual prior audit; new semantic approvals zero', evidenceRefs: refs })) };
  const save = () => f.put(requestPath, request); save();
  const registeredPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/' + requestId + '.json';
  const native = (ordinal = 1) => {
    const current = f.read(META).records[ordinal - 1], identityMap = f.read('archive/data/question_identity_map.json');
    const identity = identityMap.records[ordinal - 1];
    const runtime = f.read('archive/data/meta-foundation/runtime/new-course-v1.json');
    const taxonomy = f.read('archive/data/meta-foundation/compiled/taxonomy_registry.json');
    const bindingRows = f.read('archive/data/meta-foundation/compiled/curriculum_bindings.json').bindings;
    const registry = { root: f.root, status: 'ACTIVE', registrySha: 'fixture-active',
      problemTypes: new Map(taxonomy.problemTypes.map(r => [r.problemTypeKey, r])), templates: new Map(taxonomy.templates.map(r => [r.templateKey, r])),
      concepts: new Map(f.read('archive/data/meta-foundation/compiled/concept_registry.json').concepts.map(r => [r.conceptKey, r])),
      conditions: new Map(f.read('archive/data/meta-foundation/compiled/condition_registry.json').conditions.map(r => [r.conditionKey, r])),
      activePacks: new Map([['NEW_COURSE', { status: 'ACTIVE', id: 'NEW_COURSE', version: '1.0.0' }]]),
      bindingRows, bindings: new Set(bindingRows.map(r => [r.curriculum, r.standardUnitKey, r.subUnitKey ?? '<DIRECT>', r.problemTypeKey].join('\0'))),
      integrationPatterns: new Set(['NONE']) };
    return { question: structuredClone(bank[ordinal - 1]), previous: beforeBank[ordinal - 1], current, identity, source: request.sourceArchiveFile, ordinal,
      runtimeOwner: 'NEW_COURSE', registry, validate: validateActiveMetaFields,
      nativeSource: { root: f.root, bytes: fs.readFileSync(path.join(f.root, sourcePath)), blobSha1: request.expectedSourceBlobSha1,
        bank: structuredClone(bank), identityMap,
        identityByJoin: new Map(identityMap.records.map(r => [r.sourceArchiveFile + '#' + r.sourceOrdinal, r])),
        runtimeRecord: runtime.records.find(r => r.questionUid === current.questionUid), runtimeStatus: runtime.status } };
  };
  return { ...f, request, prior, old, beforeQuestion, beforeBank, bank, sourcePath, registeredPath, save, difficulty, native, ref, checkpoint, projectedParent };
}

function auditFullSourceOnlyFixture(t, { questionCount = 4, selected = [1, 3], superseded = [], choiceRenderer = false } = {}) {
  const f = auditedSourcePreservationFixture(t, { questionCount, choiceRenderer, legacySourceAudit: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const fullReceiptPath = f.registeredPath, fullReceipt = f.read(fullReceiptPath);
  // Model later, separate approvals only as protected fixture state. They are
  // deliberately ineligible for reuse of this earlier FULL audit receipt.
  for (const p of [META, 'archive/data/meta-foundation/runtime/new-course-v1.json']) {
    const doc = f.read(p);
    for (const r of doc.records) if (superseded.includes(r.sourceOrdinal)) {
      r.metadataApprovalType = 'FINAL_QA'; r.metadataRevision = 'fixture-later-reviewed-state';
    }
    f.put(p, doc);
  }
  const priorCommit = f.checkpoint('published full preservation and any later approvals');
  const sourceBefore = fs.readFileSync(path.join(f.root, f.sourcePath));
  f.put(f.sourcePath, sourceBefore.toString() + '// unrelated whole-source revision\n');
  const requestId = 'audit-source-only', requestPath = '.archive-meta-register/inbox/' + requestId + '.json';
  const ref = f.ref(fullReceiptPath);
  const request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId,
    examUid: fullReceipt.examUid, sourceArchiveFile: fullReceipt.sourceArchiveFile,
    expectedSourceBlobSha1: blob(fs.readFileSync(path.join(f.root, f.sourcePath))), expectedQuestionCount: questionCount,
    scope: 'PARTIAL_UIDS', registryChanges: [],
    approval: { type: 'META_PIPELINE_AUDIT', metadataReviewed: true, approvedBy: 'source-only-preservation',
      metaPipelineAudit: fullReceipt.approval.metaPipelineAudit, evidenceRefs: [ref],
      sourceRebind: { schemaVersion: 'archive-native-audit-source-preservation-v1', requestPath, priorCommit, priorReceiptRef: ref } },
    items: selected.map(n => ({ questionUid: fullReceipt.appliedRecords.find(r => r.sourceOrdinal === n).questionUid,
      sourceOrdinal: n, before: {}, after: {}, reason: 'Keep exactly the still-current original audit', evidenceRefs: [ref] })) };
  const save = () => f.put(requestPath, request); save();
  const native = (ordinal = selected[0], caughtUp = false) => {
    const args = f.native(ordinal); args.nativeSource.bytes = fs.readFileSync(path.join(f.root, f.sourcePath));
    args.nativeSource.blobSha1 = blob(args.nativeSource.bytes);
    args.nativeSource.bank = loadSourceBank(args.nativeSource.bytes.toString());
    args.question = args.nativeSource.bank[ordinal - 1];
    if (caughtUp) args.previous = structuredClone(args.question);
    return args;
  };
  return { ...f, request, requestPath, save, native, fullReceiptPath, fullReceipt, sourceBefore,
    registeredPath: 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/' + requestId + '.json',
    bindingPath: auditSourceBindingPath(requestId) };
}

function auditSourceTreeBytes(root) {
  const visit = relative => fs.readdirSync(path.join(root, relative), { withFileTypes: true })
    .filter(e => e.name !== '.git').sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .flatMap(e => e.isDirectory() ? visit(path.join(relative, e.name))
      : [[path.join(relative, e.name), hash(fs.readFileSync(path.join(root, relative, e.name)))]]);
  return visit('');
}

test('source-only audit subset replays the entire FULL24 and preserves twelve still-current approvals without D5', t => {
  const f = auditFullSourceOnlyFixture(t, { questionCount: 24, selected: Array.from({ length: 12 }, (_, i) => i + 1),
    superseded: Array.from({ length: 11 }, (_, i) => i + 14), choiceRenderer: true });
  const selected = new Set(f.request.items.map(r => r.questionUid));
  const files = [META, 'archive/data/question_identity_map.json', 'archive/data/meta-foundation/runtime/new-course-v1.json'];
  const before = files.map(p => f.read(p)), source = fs.readFileSync(path.join(f.root, f.sourcePath));
  const full = fs.readFileSync(path.join(f.root, f.fullReceiptPath));
  assert.equal(f.fullReceipt.appliedRecords.length, 24);
  const dry = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(dry.totalQuestions, 12); assert.equal(dry.newMetadataApprovals, 0);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.registeredPath);
  assert.equal(receipt.auditPreservation.priorFullCount, 24);
  assert.equal(receipt.auditPreservation.publicCurrentAuthorityUids.length, 13);
  assert.equal(receipt.auditPreservation.newDifficultyApprovals, 0);
  assert.equal(receipt.preservedMetadataApprovals, 12); assert.deepEqual(receipt.fingerprintRepairs, []);
  assert.equal(receipt.auditPreservation.difficultyRequestRef, undefined);
  for (const p of files) assert.deepEqual(f.read(p).records.filter(r => !selected.has(r.questionUid)),
    before[files.indexOf(p)].records.filter(r => !selected.has(r.questionUid)));
  assert.deepEqual(f.read(files[1]), before[1], 'identity document is byte-semantically unchanged');
  for (const row of receipt.appliedRecords) {
    const old = before[0].records.find(r => r.questionUid === row.questionUid);
    assert.equal(row.metadataRevision, `meta-foundation:${old.metaFoundationPackId}@${old.metaFoundationPackVersion}:exam-meta_pipeline_audit-v2:source-only-v1:${f.request.requestId}`,
      'retain the existing catalog/parent audited-sidecar authority family and an explicit preservation marker');
    for (const key of new Set([...Object.keys(old), ...Object.keys(row)]))
      if (!['metadataRevision', 'approvalEvidence'].includes(key)) assert.deepEqual(row[key], old[key], key);
  }
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.fullReceiptPath)), full);
  fs.rmSync(path.join(f.root, f.requestPath));
  fs.rmSync(path.join(f.root, f.fullReceipt.auditPreservation.requestSnapshot.approval.sourceRebind.requestPath));
  fs.rmSync(path.join(f.root, f.fullReceipt.auditPreservation.requestSnapshot.approval.sourceRebind.difficultyRequestRef.path));
  const replay = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(replay.replay, true); assert.deepEqual(replay.plannedPaths, []);
  for (const ordinal of f.request.items.map(r => r.sourceOrdinal)) for (const caught of [false, true]) {
    const p = planAutoQuestion(f.native(ordinal, caught));
    assert.equal(p.status, 'ALREADY_REGISTERED', JSON.stringify(p));
    assert.equal(p.nativeReviewReceipt, f.registeredPath); assert.equal(p.newMetadataApprovals, 0);
  }
});

test('source-only audit subset refuses changed authority, original proof, source, D5 and current state before any write', async t => {
  const cases = [
    ['full scope', f => { delete f.request.scope; }],
    ['original audit approval type', f => { f.request.approval.type = 'FINAL_QA'; }],
    ['new D5', f => { f.request.approval.sourceRebind.difficultyRequestRef = f.fullReceipt.auditPreservation.difficultyRequestRef; }],
    ['semantic after', f => { f.request.items[0].after.templateKey = 'TPL_NEW'; }],
    ['registry change', f => { f.request.registryChanges = [{ before: null, after: {} }]; }],
    ['wrong immutable commit', f => { f.request.approval.sourceRebind.priorCommit = 'a'.repeat(40); }],
    ['changed original receipt', f => { const d = f.read(f.fullReceiptPath); d.newMetadataApprovals = 24; f.put(f.fullReceiptPath, d); }],
    ['selected UID outside prior', f => { f.request.items[0].questionUid = 'another-uid'; }],
    ['ordinal outside source', f => { f.request.items[0].sourceOrdinal = 9; }],
    ['superseded public row', f => { const row = f.fullReceipt.appliedRecords.find(r => r.sourceOrdinal === 4); f.request.items[0] = { ...f.request.items[0], questionUid: row.questionUid, sourceOrdinal: 4 }; }],
    ['selected whole question metadata', f => { const bank = structuredClone(f.bank); bank[0].tagStatus = 'new'; f.put(f.sourcePath, 'window.questions=' + JSON.stringify(bank) + ';'); f.request.expectedSourceBlobSha1 = blob(fs.readFileSync(path.join(f.root, f.sourcePath))); }],
    ['selected whole question answer', f => { const bank = structuredClone(f.bank); bank[0].answer = 'changed'; f.put(f.sourcePath, 'window.questions=' + JSON.stringify(bank) + ';'); f.request.expectedSourceBlobSha1 = blob(fs.readFileSync(path.join(f.root, f.sourcePath))); }],
    ['current metadata authority', f => { const d = f.read(META); d.records[0].fieldStatus.problemType = 'manual_review_pending'; f.put(META, d); }],
    ['current identity', f => { const p = 'archive/data/question_identity_map.json', d = f.read(p); d.records[0].sourceQuestionNo = 'wrong'; f.put(p, d); }],
    ['current runtime', f => { const p = 'archive/data/meta-foundation/runtime/new-course-v1.json', d = f.read(p); d.records.find(r => r.sourceOrdinal === 1).difficultyBucket = 5; f.put(p, d); }],
    ['same-path choice asset', f => { f.put('archive/assets/images/audit-choice.svg', '<svg/>'); }],
    ['missing choice asset', f => { fs.rmSync(path.join(f.root, 'archive/assets/images/audit-choice.svg')); }],
  ];
  for (const [label, mutate] of cases) await t.test(label, child => {
    const f = auditFullSourceOnlyFixture(child, { superseded: [4], choiceRenderer: true }); mutate(f); f.save();
    const before = auditSourceTreeBytes(f.root); assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }));
    assert.deepEqual(auditSourceTreeBytes(f.root), before);
  });
});

test('source-only audit issued sidecar, provenance and renderer drift fail closed during replay and Native reuse', async t => {
  const cases = [
    ['receipt proof removed', f => { const d = f.read(f.registeredPath); delete d.auditPreservation; f.put(f.registeredPath, d); }],
    ['sidecar missing', f => { fs.rmSync(path.join(f.root, f.bindingPath)); }],
    ['sidecar request changed', f => { const d = f.read(f.bindingPath); d.requestSnapshot.items[0].after.difficultyBucket = 5; f.put(f.bindingPath, d); }],
    ['sidecar plus source-only claim removed', f => { const d = f.read(f.registeredPath); delete d.approval.sourceRebind; delete d.auditPreservation; f.put(f.registeredPath, d); fs.rmSync(path.join(f.root, f.bindingPath)); }],
    ['same-path asset changed', f => { f.put('archive/assets/images/audit-choice.svg', '<svg/>'); }],
    ['new approval count', f => { const d = f.read(f.registeredPath); d.newMetadataApprovals = 1; f.put(f.registeredPath, d); }],
    ['metadata marker removed', f => { const d = f.read(META); d.records[0].approvalEvidence = d.records[0].approvalEvidence.filter(r => r !== f.bindingPath); f.put(META, d); }],
    ['runtime marker removed', f => { const p = 'archive/data/meta-foundation/runtime/new-course-v1.json', d = f.read(p); d.records.find(r => r.sourceOrdinal === 1).approvalEvidence = d.records.find(r => r.sourceOrdinal === 1).approvalEvidence.filter(r => r !== f.bindingPath); f.put(p, d); }],
  ];
  for (const [label, mutate] of cases) await t.test(label, child => {
    const f = auditFullSourceOnlyFixture(child, { choiceRenderer: true });
    registerReviewedExamV2({ root: f.root, request: f.request, write: true }); mutate(f);
    const before = auditSourceTreeBytes(f.root);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }));
    for (const caught of [false, true]) {
      const plan = planAutoQuestion(f.native(1, caught));
      assert.equal(plan.status, 'SUPPLEMENT_PENDING', JSON.stringify(plan));
      assert.equal(plan.final, undefined); assert.equal(plan.nativeReviewReceipt, undefined);
    }
    assert.deepEqual(auditSourceTreeBytes(f.root), before);
  });
});

test('source-only audit rejects preexisting external or unquoted SVG dependencies even when Git bytes match', async t => {
  for (const svg of ['<svg><image href=external.svg /></svg>', '<svg><image href="external.svg" /></svg>',
    '<svg><style>path{fill:url(https://example.invalid/external.svg)}</style></svg>']) await t.test(svg, child => {
    const f = auditFullSourceOnlyFixture(child, { choiceRenderer: svg });
    const before = auditSourceTreeBytes(f.root);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /SVG/);
    assert.deepEqual(auditSourceTreeBytes(f.root), before);
  });
});

function preservedAuditParentConsumerFixture(t) {
  const f = auditedSourcePreservationFixture(t, { consumerParent: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.registeredPath), r = receipt.appliedRecords[0], uid = r.questionUid;
  const assignment = { ...r, ...f.projectedParent, store: 'question_metadata+basic_scope_parent_links',
    sourceFile: r.sourceArchiveFile, sourceFingerprint: r.contentFingerprint, assignmentFingerprint: r.contentFingerprint,
    approvalStatus: 'APPROVED', taxonomyVersion: 'a'.repeat(64), reviewEvidence: { status: 'PASS',
      reference: f.old.approvalEvidence[0], sha256: 'b'.repeat(64), sourceRevision: r.metadataRevision,
      reviewedSourceFingerprint: r.sourceFingerprint } };
  const c = { ...r, ...f.projectedParent, identityStatus: 'VERIFIED', sourceFile: r.sourceArchiveFile,
    assignmentFingerprint: r.contentFingerprint, canonicalAssignmentReasons: [], metadataConflicts: [], assignmentEvidence: assignment };
  const catalog = { records: [c], canonicalAuthority: { taxonomyVersion: assignment.taxonomyVersion,
    identityByUid: { [uid]: { ...receipt.appliedIdentityRecords[0], status: 'VERIFIED' } },
    examGradeByFile: { [r.sourceArchiveFile]: '중2' }, gradeCourses: [f.projectedParent], canonicalParents: [f.projectedParent],
    assignmentsByUid: { [uid]: [assignment] } } };
  f.put('archive/question-index.js', 'window.questionIndex=' + JSON.stringify([{ sourceFile: r.sourceArchiveFile,
    sourceOrdinal: r.sourceOrdinal, standardUnitKey: r.standardUnitKey, subUnitKey: r.subUnitKey, level: r.level, course: r.standardCourse }]) + ';\n');
  const context = () => loadAuditPreservation({ root: f.root, request: f.request,
    bytes: fs.readFileSync(path.join(f.root, f.sourcePath)), bank: [f.q] });
  const verify = () => verifyConsumerValues(f.root, receipt.appliedRecords, receipt.runtimeRecords, catalog, { auditPreservation: context() });
  return { ...f, receipt, catalog, c, assignment, context, verify };
}

for (const variant of ['audit', 'solution', 'source-approved'])
  test('partial audit preservation retains only a noncontiguous subset of its full 24-UID approval: ' + variant, t => {
    const f = auditedSourcePreservationFixture(t, { questionCount: 24, selectedOrdinals: [1, 24],
      solution: variant === 'solution', legacySourceAudit: variant === 'source-approved' });
    const selected = new Set(f.request.items.map(r => r.questionUid));
    const outside = file => f.read(file).records.filter(r => !selected.has(r.questionUid));
    const files = [META, 'archive/data/question_identity_map.json', 'archive/data/meta-foundation/runtime/new-course-v1.json'];
    const before = files.map(outside), source = fs.readFileSync(path.join(f.root, f.sourcePath));
    const originalReceipt = fs.readFileSync(path.join(f.root, f.request.approval.sourceRebind.priorReceiptRef.path));
    assert.equal(f.prior.totalQuestions, 24); assert.equal(f.prior.scope, undefined);
    const dry = registerReviewedExamV2({ root: f.root, request: f.request });
    assert.equal(dry.totalQuestions, 2); assert.equal(dry.expectedQuestionCount, 24);
    assert.equal(dry.newMetadataApprovals, 0); assert.equal(dry.preservedMetadataApprovals, 2);
    const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(result.scope, 'PARTIAL_UIDS'); assert.equal(result.partialUidCount, 2);
    const receipt = f.read(f.registeredPath);
    assert.equal(receipt.totalQuestions, 2); assert.equal(receipt.expectedQuestionCount, 24);
    for (const key of ['appliedRecords', 'appliedIdentityRecords', 'runtimeRecords']) {
      assert.deepEqual(receipt[key].map(r => r.sourceOrdinal).sort((a, b) => a - b), [1, 24]);
      assert.deepEqual(new Set(receipt[key].map(r => r.questionUid)), selected);
    }
    assert.deepEqual(files.map(outside), before, 'all 22 unselected metadata, identities and runtime rows are identical');
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
    assert.deepEqual(fs.readFileSync(path.join(f.root, f.request.approval.sourceRebind.priorReceiptRef.path)), originalReceipt);
    for (const row of receipt.appliedRecords) {
      const old = f.prior.appliedRecords.find(r => r.questionUid === row.questionUid);
      for (const key of ['metadataApprovalType', 'metadataStatus', 'reviewStatus', 'tagStatus', 'tagConfidence', 'fieldStatus',
        'integrationPattern', 'integrationPatternEvidenceDebt', 'conditionKeysEvidenceDebt', 'level', 'standardUnitKey', 'subUnitKey',
        'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'metaFoundationPackId', 'metaFoundationPackVersion', 'L1', 'L2', 'L3', 'L4'])
        assert.deepEqual(row[key], old[key], row.questionUid + '.' + key);
    }
    assert.equal(registerDifficulty5({ root: f.root, request: f.difficulty, verifyProjection: true }).summary.VERIFIED, 24);
    assert.equal(registerDifficulty5({ root: f.root, request: f.difficulty, write: true }).summary.ALREADY_REGISTERED, 24);
    const replay = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(replay.replay, true); assert.deepEqual(replay.plannedPaths, []);
    for (const ordinal of [1, 24]) {
      const plan = planAutoQuestion(f.native(ordinal));
      assert.equal(plan.status, 'ALREADY_REGISTERED', JSON.stringify(plan));
      assert.equal(plan.preservedMetadataApprovals, 1); assert.equal(plan.newMetadataApprovals, 0); assert.equal(plan.final, undefined);
    }
    assert.deepEqual(files.map(outside), before, 'difficulty replay and AutoMeta are also read-only for unselected approvals');
  });

test('partial audit preservation refuses source, subset, prior approval and whole-source difficulty drift before writing', async t => {
  const cases = [
    ['empty selection', f => { f.request.items = []; }],
    ['duplicate UID', f => { f.request.items.push(structuredClone(f.request.items[0])); }],
    ['duplicate ordinal', f => { f.request.items[1].sourceOrdinal = 1; }],
    ['UID outside original audit', f => { f.request.items[1].questionUid = 'unapproved-neighbour'; }],
    ['ordinal outside whole source', f => { f.request.items[1].sourceOrdinal = 25; }],
    ['smaller source denominator', f => { f.request.expectedQuestionCount = 2; }],
    ['full scope with a subset', f => { delete f.request.scope; }],
    ['classification edit', f => { f.request.items[0].after.templateKey = 'TPL_OTHER'; }],
    ['metadata approval promotion', f => { const doc = f.read(META); doc.records[0].metadataApprovalType = 'FINAL_QA'; f.put(META, doc); }],
    ['metadata debt cleared', f => { const doc = f.read(META); delete doc.records[0].integrationPatternEvidenceDebt; f.put(META, doc); }],
    ['metadata status changed', f => { const doc = f.read(META); doc.records[0].reviewStatus = 'reviewed_pass'; f.put(META, doc); }],
    ['runtime pack changed', f => { const p = 'archive/data/meta-foundation/runtime/new-course-v1.json', doc = f.read(p); doc.records[0].metaFoundationPackVersion = '2.0.0'; f.put(p, doc); }],
    ['partial prior receipt', f => { const p = f.request.approval.sourceRebind.priorReceiptRef.path, doc = f.read(p); doc.scope = 'PARTIAL_UIDS'; doc.partialUidCount = 24; doc.expectedQuestionCount = 24; f.put(p, doc);
      f.request.approval.sourceRebind.priorCommit = f.checkpoint('partial prior is immutable but is not a full original audit'); }],
    ['difficulty correction narrowed', f => { f.difficulty.reviewedCorrection.rows = f.difficulty.reviewedCorrection.rows.filter(r => [1, 24].includes(r.ordinal)); }],
    ['difficulty request narrowed', f => { f.difficulty.gemini.items = f.difficulty.gemini.items.filter(r => [1, 24].includes(r.ordinal)); }],
    ['difficulty proof narrowed', f => { const p = f.difficulty.reviewedCorrection.evidencePath, doc = f.read(p); doc.rows = doc.rows.filter(r => [1, 24].includes(r.ordinal)); f.put(p, doc); f.difficulty.reviewedCorrection.evidenceSha256 = f.ref(p).sha256; }],
  ];
  for (const [name, mutate] of cases) await t.test(name, t => {
    const f = auditedSourcePreservationFixture(t, { questionCount: 24, selectedOrdinals: [1, 24] });
    mutate(f);
    // Keep declared local hashes accurate: rejection must be the actual scope or
    // immutable provenance, not merely a stale outer evidence reference.
    const difficultyPath = f.request.approval.sourceRebind.difficultyRequestRef.path;
    f.put(difficultyPath, f.difficulty);
    const refresh = value => {
      if (!value || typeof value !== 'object') return;
      if (value.path && value.sha256 && fs.existsSync(path.join(f.root, value.path))) value.sha256 = f.ref(value.path).sha256;
      for (const child of Object.values(value)) refresh(child);
    };
    refresh(f.request); f.save();
    const before = [META, 'archive/data/question_identity_map.json', 'archive/data/meta-foundation/runtime/new-course-v1.json']
      .map(p => fs.readFileSync(path.join(f.root, p)));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), undefined, name);
    assert.deepEqual([META, 'archive/data/question_identity_map.json', 'archive/data/meta-foundation/runtime/new-course-v1.json']
      .map(p => fs.readFileSync(path.join(f.root, p))), before);
    assert.equal(fs.existsSync(path.join(f.root, f.registeredPath)), false);
  });
});

test('partial audit receipt cannot substitute an unselected UID or widen its approval counts', async t => {
  const cases = [
    ['scope widened', r => { delete r.scope; }],
    ['identity-only mode attached', r => { r.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'; }],
    ['whole denominator lowered', r => { r.expectedQuestionCount = 2; }],
    ['partial count widened', r => { r.partialUidCount = 24; }],
    ['total count widened', r => { r.totalQuestions = 24; }],
    ['new approvals invented', r => { r.newMetadataApprovals = 2; }],
    ['preserved count widened', r => { r.preservedMetadataApprovals = 24; }],
    ['summary count widened', r => { r.auditPreservation.preservedMetadataApprovals = 24; }],
    ['unselected metadata UID', (r, f) => { r.appliedRecords[1] = f.read(META).records[1]; }],
    ['unselected identity UID', (r, f) => { r.appliedIdentityRecords[1] = f.read('archive/data/question_identity_map.json').records[1]; }],
    ['unselected runtime UID', (r, f) => { r.runtimeRecords[1] = f.read('archive/data/meta-foundation/runtime/new-course-v1.json').records.find(row => row.sourceOrdinal === 2); }],
    ['selected UID wrong ordinal', r => { r.appliedRecords[1].sourceOrdinal = 2; }],
  ];
  for (const [name, mutate] of cases) await t.test(name, t => {
    const f = auditedSourcePreservationFixture(t, { questionCount: 24, selectedOrdinals: [1, 24] });
    registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    const receipt = f.read(f.registeredPath); mutate(receipt, f); f.put(f.registeredPath, receipt);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), undefined, name);
    const auto = planAutoQuestion(f.native());
    assert.notEqual(auto.preservedMetadataApprovals, 1, 'AutoMeta also refuses the altered subset receipt');
  });
});

test('partial audit consumer parent witness covers selected UIDs only while retaining the original 24 denominator', t => {
  const f = auditedSourcePreservationFixture(t, { questionCount: 24, selectedOrdinals: [1, 24], consumerParent: true });
  const context = () => loadAuditPreservation({ root: f.root, request: f.request,
    bytes: fs.readFileSync(path.join(f.root, f.sourcePath)), bank: f.bank });
  assert.deepEqual([...context().consumerParents.keys()], f.request.items.map(r => r.questionUid));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).preservedMetadataApprovals, 2);
  const ref = f.request.approval.sourceRebind.consumerParentRef, proof = f.read(ref.path);
  const outside = f.prior.appliedRecords[1];
  proof.records[1] = { ...proof.records[1], questionUid: outside.questionUid, sourceOrdinal: outside.sourceOrdinal };
  f.put(ref.path, proof); Object.assign(ref, f.ref(ref.path)); f.save();
  assert.throws(context, /consumer parent UID outside preserved selection/);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /consumer parent UID outside preserved selection/);
});

// Use the real manifest loader, canonical resolver, native replay and student
// index. Only the small fixture's ordinary catalog inputs are materialized here.
function materializeAuditConsumerInputs(f, { parentWitness = false } = {}) {
  const metadata = f.read(META).records, sample = metadata[0], source = f.request.sourceArchiveFile;
  const masterPath = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  if (!fs.existsSync(path.join(f.root, masterPath))) f.put(masterPath, { records: [{ curriculum: sample.curriculumKey,
    scope: sample.courseKey, majorUnit: sample.L1, midUnit: sample.L2, concepts: [] }] });
  const masterSha = f.ref(masterPath).sha256;
  const parent = parentWitness ? f.projectedParent : { grade: '중2', curriculumKey: sample.curriculumKey, courseKey: sample.courseKey, L1: sample.L1, L2: sample.L2 };
  f.put('archive/data/archive2-canonical-projection-policy.json', { schemaVersion: 'archive2-canonical-projection-policy-v1',
    status: 'ACTIVE', canonicalMasterSha256: masterSha, gradeCourseAllowlist: [parent] });
  f.put('archive/data/archive2-item-review-overrides.json', { schemaVersion: 'archive2-item-review-override-index-v1', records: [] });
  if (!fs.existsSync(path.join(f.root, 'archive/data/basic-scope-parent-links.json')))
    f.put('archive/data/basic-scope-parent-links.json', { schemaVersion: 'archive2-basic-scope-parent-links-v1', status: 'DERIVED_READ_ONLY',
      authority: { source: masterPath, sha256: masterSha }, records: [], sourceParents: [] });
  const sourceBytes = fs.readFileSync(path.join(f.root, f.sourcePath));
  const records = metadata.map(r => {
    const meta = { ...r, sourceFile: source, assignmentFingerprint: r.contentFingerprint, evidenceRefs: r.approvalEvidence };
    const assignment = parentWitness ? { ...r, ...parent, store: 'question_metadata+basic_scope_parent_links',
      sourceFile: source, sourceFingerprint: r.contentFingerprint, assignmentFingerprint: r.contentFingerprint,
      approvalStatus: 'APPROVED', taxonomyVersion: masterSha, reviewEvidence: { status: 'PASS',
        reference: f.old.approvalEvidence[0], sha256: f.ref(f.old.approvalEvidence[0]).sha256,
        sourceRevision: r.metadataRevision, reviewedSourceFingerprint: r.sourceFingerprint } } : null;
    return { ...r, sourceFile: source, sourceQuestionNo: String(r.sourceOrdinal), sourceGrade: '중2', legacyLevel: r.level,
      identityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED',
      assignmentFingerprint: r.contentFingerprint, metadataAssignmentEvidence: meta, assignmentEvidence: assignment,
      metadataConflicts: [], canonicalAssignmentReasons: [], approvedSourceFingerprint: r.sourceFingerprint };
  });
  f.put('archive/data/archive2-catalog.json', { schemaVersion: 'archive2-catalog-v1', indexVersion: 'fixture',
    exams: [{ file: source, grade: '중2' }], records, sourceHashes: [[source, hash(sourceBytes)]] });
  f.put('archive/question-index.js', 'window.questionIndex=' + JSON.stringify(f.bank.map((q, i) => ({ sourceFile: source, sourceOrdinal: i + 1,
    standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey, level: q.level, course: q.standardCourse }))) + ';\n');
  f.put('archive/data/generated-lite-consumer/v1/index.json', { records: [] });
  const runtimePaths = canonical.runtimeInputPathsFromManifest([{ path: 'data/meta-foundation/runtime/new-course-v1.json' }]);
  for (const relative of canonical.MANIFEST_REQUIRED_PATHS) {
    if (fs.existsSync(path.join(f.root, 'archive', relative))) continue;
    f.put('archive/' + relative, runtimePaths.includes(relative) ? {
      packId: path.basename(relative, '.json').toUpperCase().replaceAll('-', '_'), packVersion: '1.0.0', status: 'ACTIVE', records: []
    } : { records: [] });
  }
  const runtimePacks = runtimePaths.map(p => f.read('archive/' + p));
  const files = [...new Set([...canonical.MANIFEST_REQUIRED_PATHS, ...runtimePaths, ...canonical.reviewedRegistrationProofPaths(runtimePacks)])]
    .map(relative => ({ path: relative, sha256: f.ref('archive/' + relative).sha256 }));
  f.put('archive/data/archive2-canonical-input-manifest.json', { schemaVersion: 'archive2-canonical-input-manifest-v1',
    resolverVersion: canonical.RESOLVER_VERSION,
    projectionVersion: 'archive2-canonical-v1:' + hash(canonical.projectionManifestPayload(files, canonical.RESOLVER_VERSION)), files });
}

for (const parentWitness of [false, true])
  test('partial audit preservation reaches the typed Consumer with exact selected provenance: parent witness=' + parentWitness, t => {
    const f = auditedSourcePreservationFixture(t, { questionCount: 24, selectedOrdinals: [1, 24],
      consumerCatalog: true, consumerParent: parentWitness });
    registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    materializeAuditConsumerInputs(f, { parentWitness });
    const result = registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true });
    assert.equal(result.consumerSearchStatus, 'STATIC_VALUES_VERIFIED');
    assert.equal(result.newMetadataApprovals, 0); assert.equal(result.preservedMetadataApprovals, 2);
    const out = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [f.request.approval.sourceRebind.requestPath] });
    assert.equal(out.status, 'PASS', JSON.stringify(out.failures));
    assert.deepEqual(out.counts, { changed: 2, checked: 2, passed: 2, skippedUnchanged: 0 });
    assert.equal(out.exams[0].kind, 'native-approval-preservation');
    assert.equal(out.exams[0].approvalType, 'META_PIPELINE_AUDIT');
    assert.equal(out.exams[0].newMetadataApprovals, 0); assert.equal(out.exams[0].preservedMetadataApprovals, 2);
    assert.equal(out.exams[0].expectedQuestionCount, 24);
    const registered = f.read(f.registeredPath);
    for (const mutate of [r => { r.expectedQuestionCount = 2; }, r => { r.newMetadataApprovals = 2; },
      r => { r.appliedRecords[1] = f.read(META).records[1]; }]) {
      const altered = structuredClone(registered); mutate(altered); f.put(f.registeredPath, altered);
      materializeAuditConsumerInputs(f, { parentWitness });
      const bad = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [f.request.approval.sourceRebind.requestPath] });
      assert.equal(bad.status, 'FAIL'); assert.equal(bad.counts.passed, 0); assert.equal(bad.counts.skippedUnchanged, 0);
      assert.equal(bad.failures[0].reason, 'NATIVE_PRESERVATION_MISMATCH', JSON.stringify(bad.failures));
    }
  });

test('audit preservation verifies the same prior canonical parent without rewriting raw audit labels', t => {
  const f = preservedAuditParentConsumerFixture(t);
  assert.notEqual(f.c.L2, f.old.L2);
  assert.deepEqual(f.verify(), { canonical: 1, usableMetaLane: 0 });
  assert.equal(f.read(META).records[0].L2, f.old.L2);
  assert.equal(f.receipt.runtimeRecords[0].L2, f.old.L2);
  assert.throws(() => verifyConsumerValues(f.root, f.receipt.appliedRecords, f.receipt.runtimeRecords, f.catalog), /Consumer metadata mismatch/);
});

test('a preserved consumer parent never bypasses the current exact ACTIVE binding', t => {
  const f = preservedAuditParentConsumerFixture(t);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  const bindingPath = `${CANON}/packs/new-course/bindings.json`, bindings = f.read(bindingPath);
  bindings.bindings = []; f.put(bindingPath, bindings);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /binding missing/);
});

test('preserved parent history requires the whole original approved metadata row', t => {
  const f = preservedAuditParentConsumerFixture(t), currentMetadata = f.read(META);
  const currentSource = fs.readFileSync(path.join(f.root, f.sourcePath));
  const ref = f.request.approval.sourceRebind.consumerParentRef, proof = f.read(ref.path);
  const historical = file => execFileSync('git', ['show', proof.priorConsumerCommit + ':' + file], { cwd: f.root });
  const metadata = JSON.parse(historical(META));
  metadata.records[0].conditionKeys = ['COND_OTHER']; f.put(META, metadata);
  fs.writeFileSync(path.join(f.root, f.sourcePath), historical(f.sourcePath));
  proof.priorConsumerCommit = f.checkpoint('different historical metadata');
  f.put(META, currentMetadata); fs.writeFileSync(path.join(f.root, f.sourcePath), currentSource);
  f.put(ref.path, proof); Object.assign(ref, f.ref(ref.path)); f.save();
  assert.throws(f.context, /prior UID\/keys\/approval mismatch/);
});

test('preserved consumer parent rejects wrong parents, keys, classification, fingerprints and authority', async t => {
  for (const [name, mutate] of [
    ['wrong parent even with a matching current authority', f => { f.c.L2 = f.assignment.L2 = 'different canonical parent'; f.catalog.canonicalAuthority.canonicalParents = [{ ...f.projectedParent, L2: f.c.L2 }]; }],
    ['wrong unit with the same label', f => { f.c.standardUnitKey = f.assignment.standardUnitKey = 'M2-02'; }],
    ['wrong subunit with the same label', f => { f.c.subUnitKey = f.assignment.subUnitKey = 'OTHER'; }],
    ['different PT', f => { f.c.problemTypeKey = 'PT_OTHER'; }],
    ['different TPL', f => { f.c.templateKey = 'TPL_OTHER'; }],
    ['different concepts', f => { f.c.crossConceptKeys = []; }],
    ['unapproved current assignment', f => { f.assignment.approvalStatus = 'PENDING'; }],
    ['wrong body fingerprint', f => { f.c.assignmentFingerprint = '0'.repeat(64); }],
    ['wrong reviewed full fingerprint', f => { f.assignment.reviewEvidence.reviewedSourceFingerprint = '0'.repeat(64); }],
    ['different revision', f => { f.assignment.reviewEvidence.sourceRevision = 'other'; }],
    ['not in current canonical parents', f => { f.catalog.canonicalAuthority.canonicalParents = []; }],
    ['wrong ACTIVE identity', f => { f.catalog.canonicalAuthority.identityByUid[f.c.questionUid].status = 'UNVERIFIED'; }],
    ['changed native raw parent', f => { f.receipt.runtimeRecords[0].L2 = f.c.L2; }],
  ]) await t.test(name, t => {
    const f = preservedAuditParentConsumerFixture(t); mutate(f); assert.throws(f.verify);
  });
});

test('preserved consumer parent is bound to the exact historical Git projection and approval', async t => {
  for (const [name, mutate] of [
    ['invented historical parent', p => { p.records[0].L2 = 'different parent'; }],
    ['wrong historical key', p => { p.records[0].subUnitKey = 'OTHER'; }],
    ['wrong historical UID', p => { p.records[0].questionUid = 'qid_v1_' + '2'.repeat(64); }],
    ['wrong historical source fingerprint', p => { p.records[0].sourceFingerprint = '0'.repeat(64); }],
    ['wrong parent SHA', p => { p.parentLinks.sha256 = '0'.repeat(64); }],
    ['wrong parent blob', p => { p.parentLinks.blobSha1 = '0'.repeat(40); }],
    ['different prior receipt', p => { p.priorReceiptRef.sha256 = '0'.repeat(64); }],
    ['duplicate historical UID', p => { p.records.push({ ...p.records[0] }); }],
    ['wrong original denominator', p => { p.expectedQuestionCount = 2; }],
  ]) await t.test(name, t => {
    const f = preservedAuditParentConsumerFixture(t), ref = f.request.approval.sourceRebind.consumerParentRef, proof = f.read(ref.path);
    mutate(proof); f.put(ref.path, proof); Object.assign(ref, f.ref(ref.path)); f.save(); assert.throws(f.context);
  });
});

for (const solution of [false, true]) test('audit preservation keeps original approval and debt through writer, D5 replay and AutoMeta: solution=' + solution, t => {
  const f = auditedSourcePreservationFixture(t, { solution }), beforeBytes = fs.readFileSync(path.join(f.root, f.sourcePath));
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.newMetadataApprovals, 0); assert.equal(result.preservedMetadataApprovals, 1);
  assert.equal(result.fingerprintRepairCount, solution ? 1 : 0);
  const row = f.read(META).records[0];
  for (const key of ['metadataApprovalType', 'metadataStatus', 'reviewStatus', 'tagStatus', 'tagConfidence', 'fieldStatus',
    'integrationPattern', 'integrationPatternEvidenceDebt', 'level', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'templateKey', 'L1', 'L2', 'L3', 'L4'])
    assert.deepEqual(row[key], f.old[key], key);
  assert.equal(row.standardUnit, '새 단원', 'canonical source label transport does not rewrite approved metadata wording');
  assert.equal(row.difficultyBucket, 2); assert.equal(row.fieldStatus.difficulty, 'source_unreviewed');
  assert.equal(row.integrationPattern, null); assert.equal(row.fieldStatus.integrationPattern, 'EVIDENCE_DEBT');
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), beforeBytes);
  assert.equal(registerDifficulty5({ root: f.root, request: f.difficulty, verifyProjection: true }).summary.VERIFIED, 1);
  assert.equal(registerDifficulty5({ root: f.root, request: f.difficulty, write: true }).summary.ALREADY_REGISTERED, 1);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  const plan = planAutoQuestion(f.native());
  assert.equal(plan.status, 'ALREADY_REGISTERED', JSON.stringify(plan));
  assert.equal(plan.preservedMetadataApprovals, 1); assert.equal(plan.newMetadataApprovals, 0); assert.equal(plan.final, undefined);
});

test('legacy source-approved partial audit preserves its absent QA status and source-sidecar difference', t => {
  const f = auditedSourcePreservationFixture(t, { legacySourceAudit: true });
  assert.equal(Object.hasOwn(f.old, 'reviewStatus'), false);
  assert.equal(f.old.tagStatus, 'approved_subunit_concept_partial');
  assert.equal(f.old.fieldStatus.difficulty, 'approved_source');
  assert.deepEqual(f.q.crossConceptKeys, []);
  assert.deepEqual(f.old.crossConceptKeys, ['CC_NEW']);
  const sourceBytes = fs.readFileSync(path.join(f.root, f.sourcePath));
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.newMetadataApprovals, 0); assert.equal(result.preservedMetadataApprovals, 1);
  const row = f.read(META).records[0];
  assert.equal(Object.hasOwn(row, 'reviewStatus'), false);
  for (const key of ['metadataApprovalType', 'metadataStatus', 'tagStatus', 'tagConfidence', 'fieldStatus',
    'metaFoundationPackVersion', 'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'level'])
    assert.deepEqual(row[key], f.old[key], key);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), sourceBytes);
  fs.rmSync(path.join(f.root, f.request.approval.sourceRebind.requestPath));
  fs.rmSync(path.join(f.root, f.request.approval.sourceRebind.difficultyRequestRef.path));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  assert.equal(registerDifficulty5({ root: f.root, request: f.difficulty, verifyProjection: true }).summary.VERIFIED, 1);
  const plan = planAutoQuestion(f.native());
  assert.equal(plan.status, 'ALREADY_REGISTERED', JSON.stringify(plan));
  assert.equal(plan.preservedMetadataApprovals, 1); assert.equal(plan.newMetadataApprovals, 0);
  assert.equal(plan.final, undefined);
});

test('legacy source-approved partial audit rejects status, debt, version and approved-value drift', async t => {
  for (const [name, mutate] of [
    ['invented QA', row => { row.reviewStatus = 'reviewed_pass'; }],
    ['null instead of absent QA', row => { row.reviewStatus = null; }],
    ['changed tag', row => { row.tagStatus = 'review_required'; }],
    ['promoted difficulty status', row => { row.fieldStatus.difficulty = 'approved_meta_pipeline_audit'; }],
    ['removed field status', row => { delete row.fieldStatus.condition; }],
    ['invented integration status', row => { row.fieldStatus.integrationPattern = 'approved_meta_pipeline_audit'; }],
    ['different pack version', row => { row.metaFoundationPackVersion = '2.0.0'; }],
    ['discarded approved concepts', row => { row.crossConceptKeys = []; }],
  ]) await t.test(name, t => {
    const f = auditedSourcePreservationFixture(t, { legacySourceAudit: true });
    const metadata = f.read(META); mutate(metadata.records[0]); f.put(META, metadata);
    const before = fs.readFileSync(path.join(f.root, META));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }));
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
    assert.equal(fs.existsSync(path.join(f.root, f.registeredPath)), false);
  });
});

test('legacy source-approved partial audit allows no unreviewed source transport beyond exact D5', async t => {
  for (const [name, mutate] of [
    ['new source concepts even when equal to sidecar', q => { q.crossConceptKeys = ['CC_NEW']; }],
    ['different source PT', q => { q.problemTypeKey = 'PT_OTHER'; }],
    ['new rationale', q => { q.primaryMethod = 'new source rationale'; }],
    ['canonical label transport', q => { q.standardUnit = '현재 정본 표시'; }],
    ['legacy level edit', q => { q.level = '하'; }],
    ['student answer edit', q => { q.answer = '2'; }],
  ]) await t.test(name, t => {
    const f = auditedSourcePreservationFixture(t, { legacySourceAudit: true }); mutate(f.q);
    const bytes = 'window.questions=' + JSON.stringify([f.q]) + ';\n'; f.put(f.sourcePath, bytes);
    f.request.expectedSourceBlobSha1 = blob(bytes); f.difficulty.gemini.latestBlobSha = blob(bytes);
    const ref = f.request.approval.sourceRebind.difficultyRequestRef;
    f.put(ref.path, f.difficulty); Object.assign(ref, f.ref(ref.path)); f.save();
    const before = fs.readFileSync(path.join(f.root, META));
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }),
      /unreviewed source field|legacy level baseline|binding drift|fingerprint|student inputs/);
    assert.deepEqual(fs.readFileSync(path.join(f.root, META)), before);
  });
});

test('legacy source-approved partial audit requires the exact typed immutable prior approval', async t => {
  for (const [name, mutate] of [
    ['different audit package version', p => { p.approval.metaPipelineAudit.schemaVersion = 'meta-pipeline-audit-approval-v1'; }],
    ['prior QA invented', p => { p.appliedRecords[0].reviewStatus = 'reviewed_pass'; }],
    ['prior QA null', p => { p.appliedRecords[0].reviewStatus = null; }],
    ['prior difficulty status changed', p => { p.appliedRecords[0].fieldStatus.difficulty = 'source_unreviewed'; }],
    ['prior extra field debt', p => { p.appliedRecords[0].fieldStatus.integrationPattern = 'EVIDENCE_DEBT'; }],
  ]) await t.test(name, t => {
    const f = auditedSourcePreservationFixture(t, { legacySourceAudit: true });
    const spec = f.request.approval.sourceRebind, sourceBytes = fs.readFileSync(path.join(f.root, f.sourcePath));
    const oldSource = execFileSync('git', ['show', spec.priorCommit + ':' + f.sourcePath], { cwd: f.root });
    mutate(f.prior); f.put(spec.priorReceiptRef.path, f.prior);
    fs.writeFileSync(path.join(f.root, f.sourcePath), oldSource);
    spec.priorCommit = f.checkpoint('synthetic incompatible historical approval');
    fs.writeFileSync(path.join(f.root, f.sourcePath), sourceBytes);
    Object.assign(spec.priorReceiptRef, f.ref(spec.priorReceiptRef.path));
    f.request.approval.metaPipelineAudit = structuredClone(f.prior.approval.metaPipelineAudit); f.save();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }),
      /unchanged-value contract|original v2 audit/);
  });
});

test('audit preservation rejects drift, unreviewed transport, wrong scope and approval promotion', async t => {
  const cases = [
    ['different type', f => { f.request.approval.type = 'FINAL_QA'; }, /sourceRebind requires|source rebind/],
    ['unsupported scope', f => { f.request.scope = 'PARTIAL_EXAM'; }, /unsupported registration scope/],
    ['extra UID', f => { f.request.items.push({ ...f.request.items[0], questionUid: 'other', sourceOrdinal: 2 }); }, /UID denominator/],
    ['wrong prior commit', f => { f.request.approval.sourceRebind.priorCommit = '0'.repeat(40); }, /Git evidence/],
    ['wrong prior SHA', f => { f.request.approval.sourceRebind.priorReceiptRef.sha256 = '0'.repeat(64); }, /evidence/],
    ['unrelated D5 request', f => { f.request.approval.sourceRebind.difficultyRequestRef = f.request.approval.evidenceRefs[1]; }, /difficulty request/],
    ['changed metadata value', f => { const d = f.read(META); d.records[0].level = '상'; f.put(META, d); }, /legacy level baseline|preserved state/],
    ['cleared debt', f => { const d = f.read(META); d.records[0].fieldStatus.integrationPattern = 'approved_meta_pipeline_audit'; f.put(META, d); }, /preserved state/],
    ['runtime changed', f => { const p = 'archive/data/meta-foundation/runtime/new-course-v1.json', d = f.read(p); d.records[0].runtimeSelectable = false; f.put(p, d); }, /preserved state/],
    ['item value edit', f => { f.request.items[0].after.level = '상'; }, /unchanged-value contract/],
    ['mutable audit evidence', f => { f.request.approval.metaPipelineAudit.sourceFileDriveId = 'other'; }, /approval\/scope mismatch/],
    ['unapproved key transport', f => { f.q.subUnitKey = 'WRONG'; }, /source\/approved value/],
    ['unapproved source label', f => { f.q.standardUnit = '다른 뜻'; }, /source\/approved value/],
    ['unapproved source rationale', f => { f.q.primaryMethod = 'invented'; }, /unreviewed source field/],
    ['hidden renderer edit', f => { f.q.number = 2; }, /student inputs/],
    ['missing narrow solution proof', f => { delete f.request.approval.sourceRebind.solutionRepair; }, /independently reviewed solution/],
  ];
  for (const [name, mutate, pattern] of cases) await t.test(name, t => {
    const f = auditedSourcePreservationFixture(t, { solution: name === 'missing narrow solution proof' }); mutate(f);
    if (['unapproved key transport', 'unapproved source label', 'unapproved source rationale', 'hidden renderer edit'].includes(name)) {
      const bytes = 'window.questions=' + JSON.stringify([f.q]) + ';\n'; f.put(f.sourcePath, bytes);
      f.request.expectedSourceBlobSha1 = blob(bytes); f.difficulty.gemini.latestBlobSha = blob(bytes);
      const p = f.request.approval.sourceRebind.difficultyRequestRef.path; f.put(p, f.difficulty);
      Object.assign(f.request.approval.sourceRebind.difficultyRequestRef, f.ref(p));
    }
    f.save();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), pattern);
  });
});

test('audit preservation replay and AutoMeta never accept altered receipt, identity, field status or solution evidence', async t => {
  const cases = [
    ['approval count', f => { const r = f.read(f.registeredPath); r.newMetadataApprovals = 1; f.put(f.registeredPath, r); }],
    ['source SHA', f => { const r = f.read(f.registeredPath); r.sourceRawSha256 = '0'.repeat(64); f.put(f.registeredPath, r); }],
    ['missing repair', f => { const r = f.read(f.registeredPath); r.fingerprintRepairs = []; f.put(f.registeredPath, r); }],
    ['forged repair', f => { const r = f.read(f.registeredPath); r.fingerprintRepairs[0].identityBefore.sourceFingerprint = '0'.repeat(64); f.put(f.registeredPath, r); }],
    ['missing runtime', f => { const r = f.read(f.registeredPath); r.runtimeRecords = []; f.put(f.registeredPath, r); }],
    ['new approval claim', f => { const r = f.read(f.registeredPath); r.auditPreservation.newMetadataApprovals = 1; f.put(f.registeredPath, r); }],
    ['preserved type', f => { const r = f.read(f.registeredPath); r.approval.type = 'FINAL_QA'; f.put(f.registeredPath, r); }],
    ['identity', f => { const p = 'archive/data/question_identity_map.json', d = f.read(p); d.records[0].sourceFingerprint = '0'.repeat(64); f.put(p, d); }],
    ['source QA', f => { const d = f.read(META); d.records[0].reviewStatus = 'reviewed_pass'; f.put(META, d); }],
    ['original review modified', f => { f.put(f.request.approval.sourceRebind.solutionRepair.ref.path, { forged: true }); }],
  ];
  for (const [name, mutate] of cases) await t.test(name, t => {
    const f = auditedSourcePreservationFixture(t, { solution: true });
    registerReviewedExamV2({ root: f.root, request: f.request, write: true }); mutate(f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }));
    assert.throws(() => registerDifficulty5({ root: f.root, request: f.difficulty, verifyProjection: true }));
    const plan = planAutoQuestion(f.native()); assert.notEqual(plan.status, 'ALREADY_REGISTERED');
  });
});

test('consumed native and difficulty inbox files remain verifiable from their exact sealed inputs', t => {
  const f = auditedSourcePreservationFixture(t, { solution: true });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  fs.rmSync(path.join(f.root, f.request.approval.sourceRebind.requestPath));
  fs.rmSync(path.join(f.root, f.request.approval.sourceRebind.difficultyRequestRef.path));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  assert.equal(registerDifficulty5({ root: f.root, request: f.difficulty, verifyProjection: true }).summary.VERIFIED, 1);
  assert.equal(registerDifficulty5({ root: f.root, request: f.difficulty, write: true }).summary.ALREADY_REGISTERED, 1);
  assert.equal(planAutoQuestion(f.native()).status, 'ALREADY_REGISTERED');
  const receipt = f.read(f.registeredPath);
  receipt.auditPreservation.difficultyRequestSnapshot.rawUtf8 += ' ';
  f.put(f.registeredPath, receipt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /raw SHA|provenance/);
  assert.throws(() => registerDifficulty5({ root: f.root, request: f.difficulty, verifyProjection: true }), /metadata\/fingerprint mismatch/);
  assert.notEqual(planAutoQuestion(f.native()).status, 'ALREADY_REGISTERED');
});

test('sealed audit inputs cannot hide a changed live inbox request or dependency', t => {
  for (const dependency of [false, true]) {
    const f = auditedSourcePreservationFixture(t, { solution: true });
    registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    const relative = dependency ? f.request.approval.sourceRebind.difficultyRequestRef.path : f.request.approval.sourceRebind.requestPath;
    const changed = dependency ? { ...f.difficulty, unauthorized: true } : { ...f.request, unauthorized: true };
    f.put(relative, changed);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }));
    assert.throws(() => registerDifficulty5({ root: f.root, request: f.difficulty, verifyProjection: true }));
    assert.notEqual(planAutoQuestion(f.native()).status, 'ALREADY_REGISTERED');
  }
});

// A second release preserves the actual first receipt's revision/evidence, not
// the older original audit row with those fields ignored or overwritten.
function chainedAuditPreservationFixture(t, { consumerParent = false } = {}) {
  const f = auditedSourcePreservationFixture(t, { questionCount: 24, consumerCatalog: true, consumerParent });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const priorPath = f.registeredPath, prior = f.read(priorPath), priorRequest = structuredClone(f.request);
  const consumed = [priorRequest.approval.sourceRebind.requestPath, priorRequest.approval.sourceRebind.difficultyRequestRef.path];
  for (const file of consumed) fs.unlinkSync(path.join(f.root, file));
  const priorCommit = f.checkpoint('actual first full preservation output after consuming inbox');
  // The next registered subset has metadata work elsewhere in the exam; the
  // selected preserved questions themselves retain their complete old object.
  f.bank[1].decisiveStep = 'Another selected registration owns this metadata';
  const sourceBytes = 'window.questions=' + JSON.stringify(f.bank) + ';\n'; f.put(f.sourcePath, sourceBytes);
  execFileSync('git', ['hash-object', '-w', '--stdin'], { cwd: f.root, input: sourceBytes });
  const difficultyPath = '.archive-meta-register/inbox/chain-difficulty.json';
  const proofPath = '.archive-meta-register/evidence/chain-difficulty.json';
  const fields = ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
  const rows = prior.appliedRecords.map((old, i) => ({ sourceArchiveFile: prior.sourceArchiveFile, ordinal: i + 1, questionUid: old.questionUid,
    before: { ...Object.fromEntries(fields.map(k => [k, old[k] ?? null])), level: old.level,
      sourceFingerprint: old.sourceFingerprint, contentFingerprint: old.contentFingerprint },
    after: Object.fromEntries(fields.map(k => [k, old[k]])), sourceFingerprint: auditSourceFingerprint(f.bank[i]),
    contentFingerprint: auditContentFingerprint(f.bank[i]), staleSourceBinding: false, refreshBinding: false,
    decision: 'CORRECT', reason: 'Preserve the already reviewed exact difficulty result' }));
  f.put(proofPath, { schemaVersion: 'archive-difficulty5-reviewed-correction-v1', rows });
  const difficulty = { schemaVersion: 'archive-difficulty5-register-request-v1',
    gemini: { schemaVersion: 'v1', requestId: 'chain-difficulty', sourceArchiveFile: prior.sourceArchiveFile,
      latestBlobSha: blob(sourceBytes), items: rows.map(({ ordinal, questionUid, before, after }) => ({ ordinal, questionUid, before, after })) },
    reviewedCorrection: { schemaVersion: 'archive-difficulty5-reviewed-correction-v1', approvalRef: 'exact existing D5 preservation',
      evidencePath: proofPath, evidenceSha256: f.ref(proofPath).sha256, rows } };
  f.put(difficultyPath, difficulty); registerDifficulty5({ root: f.root, request: difficulty, write: true });
  const refs = [f.ref(priorPath), f.ref('archive/data/master_tables/js_archive_tag_master.json'), f.ref(difficultyPath), f.ref(proofPath)];
  let consumerParentRef;
  if (consumerParent) {
    const oldProof = f.read(priorRequest.approval.sourceRebind.consumerParentRef.path);
    const newProof = { ...oldProof, priorReceiptRef: refs[0], priorConsumerCommit: priorCommit,
      records: oldProof.records.filter(r => [1,24].includes(r.sourceOrdinal)) };
    const newPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/chain.parent-preservation.json';
    f.put(newPath, newProof); consumerParentRef = f.ref(newPath); refs.push(consumerParentRef);
  }
  const requestId = 'chain-preserve-audit', requestPath = '.archive-meta-register/inbox/' + requestId + '.json';
  const request = { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId, examUid: prior.examUid,
    sourceArchiveFile: prior.sourceArchiveFile, expectedSourceBlobSha1: blob(sourceBytes), expectedQuestionCount: 24, scope: 'PARTIAL_UIDS',
    approval: { type: 'META_PIPELINE_AUDIT', metadataReviewed: true, approvedBy: 'same-audit-second-release-preservation',
      metaPipelineAudit: prior.approval.metaPipelineAudit, evidenceRefs: refs,
      sourceRebind: { schemaVersion: 'archive-native-audit-preservation-v1', requestPath, priorCommit,
        priorReceiptRef: refs[0], difficultyRequestRef: refs[2], ...(consumerParentRef ? { consumerParentRef } : {}) } },
    items: [1,24].map(n => ({ questionUid: prior.appliedRecords[n-1].questionUid, sourceOrdinal: n, before: {}, after: {},
      reason: 'Keep the actual previous full preservation; no new approval', evidenceRefs: refs })) };
  const save = () => f.put(requestPath, request); save();
  return { ...f, request, prior, priorRequest, priorPath, priorCommit, consumed, difficulty, save,
    registeredPath: 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/' + requestId + '.json' };
}

for (const parentWitness of [false, true])
  test('full preservation chains into an exact noncontiguous audit subset after inbox consumption: parent=' + parentWitness, t => {
    const f = chainedAuditPreservationFixture(t, { consumerParent: parentWitness });
    const untouched = f.read(META).records.filter(r => ![1,24].includes(r.sourceOrdinal));
    const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    assert.equal(result.newMetadataApprovals, 0); assert.equal(result.preservedMetadataApprovals, 2);
    assert.deepEqual(f.read(META).records.filter(r => ![1,24].includes(r.sourceOrdinal)), untouched);
    const receipt = f.read(f.registeredPath);
    for (const row of receipt.appliedRecords) {
      const prior = f.prior.appliedRecords.find(r => r.questionUid === row.questionUid);
      assert.deepEqual(row.approvalEvidence, [...prior.approvalEvidence, f.registeredPath]);
      assert.equal(row.metadataApprovalType, prior.metadataApprovalType);
      assert.deepEqual(row.fieldStatus, prior.fieldStatus);
      assert.equal(row.metaFoundationPackVersion, prior.metaFoundationPackVersion);
    }
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
    for (const ordinal of [1,24]) {
      const args=f.native(ordinal);args.nativeSource.blobSha1=f.request.expectedSourceBlobSha1;
      const planned=planAutoQuestion(args);
      assert.equal(planned.status,'ALREADY_REGISTERED',JSON.stringify(planned));
      assert.equal(planned.preservedMetadataApprovals,1);assert.equal(planned.newMetadataApprovals,0);
      assert.equal(planned.final,undefined);
    }
    materializeAuditConsumerInputs(f, { parentWitness });
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true }).consumerSearchStatus, 'STATIC_VALUES_VERIFIED');
    const consumer = verifyChangedUidConsumerApproval({ root: f.root, requestPaths: [f.request.approval.sourceRebind.requestPath] });
    assert.equal(consumer.status, 'PASS', JSON.stringify(consumer.failures));
    assert.deepEqual(consumer.counts, { changed: 2, checked: 2, passed: 2, skippedUnchanged: 0 });
    assert.equal(consumer.exams[0].newMetadataApprovals, 0);
    for (const file of f.consumed) assert.equal(fs.existsSync(path.join(f.root, file)), false, 'history replay does not restore consumed inbox');
  });

test('audit chain replays the exact historical output rather than ignoring prior revision, evidence, status or debt', async t => {
  const cases = [
    ['revision', f => { const d=f.read(META);d.records[0].metadataRevision='forged';f.put(META,d); }],
    ['current evidence', f => { const d=f.read(META);d.records[0].approvalEvidence.pop();f.put(META,d); }],
    ['sealed difficulty SHA', f => { const d=f.read(f.priorPath);d.auditPreservation.difficultyRequestSnapshot.rawUtf8+=' ';f.put(f.priorPath,d); }],
    ['historical status', f => { const d=f.read(f.priorPath);d.appliedRecords[0].fieldStatus.difficulty='approved_final_qa';f.put(f.priorPath,d); }],
    ['historical debt', f => { const d=f.read(f.priorPath);d.appliedRecords[0].fieldStatus.integrationPattern='approved_meta_pipeline_audit';f.put(f.priorPath,d); }],
    ['historical partial', f => { const d=f.read(f.priorPath);d.scope='PARTIAL_UIDS';d.partialUidCount=24;d.expectedQuestionCount=24;f.put(f.priorPath,d); }],
    ['present old D5 drift', f => { f.put(f.consumed[1], f.prior.auditPreservation.difficultyRequestSnapshot.rawUtf8+' '); }],
    ['missing historical non-inbox proof', f => { const ref=f.prior.approval.evidenceRefs.find(r=>r.path.endsWith('/preserved-difficulty.json')&&!r.path.includes('/inbox/'));fs.unlinkSync(path.join(f.root,ref.path)); }],
  ];
  for (const [name, mutate] of cases) await t.test(name, t => {
    const f = chainedAuditPreservationFixture(t); mutate(f);
    if (!['revision','current evidence'].includes(name)) {
      // Capture a deliberately invalid immutable prior for the negative test,
      // while restoring its old source so the historical-binding check is real.
      const source = fs.readFileSync(path.join(f.root,f.sourcePath));
      const oldBytes = execFileSync('git',['show',f.priorCommit+':'+f.sourcePath],{cwd:f.root});
      fs.writeFileSync(path.join(f.root,f.sourcePath),oldBytes); const bad = f.checkpoint('invalid prior '+name); fs.writeFileSync(path.join(f.root,f.sourcePath),source);
      f.request.approval.sourceRebind.priorCommit=bad;
      Object.assign(f.request.approval.sourceRebind.priorReceiptRef,f.ref(f.priorPath)); f.save();
    }
    assert.throws(() => registerReviewedExamV2({ root:f.root,request:f.request,write:true }), /audit preservation:/, name);
    assert.equal(fs.existsSync(path.join(f.root,f.registeredPath)),false);
  });
});

// ---- legacy path-formula source UIDs (decision 2026-11-15) ----------------------------------------------------------
function legacyPathUid(prefix, source, ordinal) {
  return "qid_v1_" + hash(`${prefix}${source}#${ordinal}`);
}

test("legacy path formulas: exams/ and archive/exams/ prefixed source UIDs are accepted, anything else is refused", t => {
  const source = "fixture/exam.js";
  assert.deepEqual(legacyPathFormulaUids(source, 1), [legacyPathUid("exams/", source, 1), legacyPathUid("archive/exams/", source, 1)]);
  assert.equal(isLegacyPathFormulaUid(legacyPathUid("exams/", source, 1), source, 1), true);
  assert.equal(isLegacyPathFormulaUid(legacyPathUid("archive/exams/", source, 1), source, 1), true);
  // current formula, other ordinal, other file, other prefix and non-strings are not legacy aliases
  assert.equal(isLegacyPathFormulaUid(legacyPathUid("", source, 1), source, 1), false);
  assert.equal(isLegacyPathFormulaUid(legacyPathUid("exams/", source, 2), source, 1), false);
  assert.equal(isLegacyPathFormulaUid(legacyPathUid("exams/", "fixture/other.js", 1), source, 1), false);
  assert.equal(isLegacyPathFormulaUid(legacyPathUid("original/exams/", source, 1), source, 1), false);
  assert.equal(isLegacyPathFormulaUid(undefined, source, 1), false);
  for (const [prefix, ok] of [["exams/", true], ["archive/exams/", true], ["other/", false]]) {
    const f = partialFixture(t), q = addLegacyAlias(f);
    q.questionUid = legacyPathUid(prefix, "fixture/exam.js", 1); f.writeBank(q);
    if (ok) assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
    else assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /source UID mismatch/);
  }
});

// ---- REVIEW2 source-value overrides (decision 2026-11-15) ----------------------------------------------------------
test("REVIEW2 overrides: differing tag/difficulty source values are collected per field; other approvals and unchanged values are not", () => {
  const source = { tagStatus: "manual_review", tagConfidence: "reviewed", difficultyBucket: 1, difficultyConfidence: "", L3: "x" };
  const final = { tagStatus: "reviewed_pass", tagConfidence: "independent_review2", difficultyBucket: 2, difficultyConfidence: "high", L3: "y" };
  assert.deepEqual(collectSourceValueOverrides({ approvalType: "REVIEW2", questionUid: "u1", source, final }), [
    { questionUid: "u1", field: "tagStatus", sourceValue: "manual_review", registeredValue: "reviewed_pass" },
    { questionUid: "u1", field: "tagConfidence", sourceValue: "reviewed", registeredValue: "independent_review2" },
    { questionUid: "u1", field: "difficultyBucket", sourceValue: 1, registeredValue: 2 }]);
  assert.deepEqual(collectSourceValueOverrides({ approvalType: "FINAL_QA", questionUid: "u1", source, final }), []);
  assert.deepEqual(collectSourceValueOverrides({ approvalType: "REVIEW2", questionUid: "u1", source: { tagStatus: "reviewed_pass" }, final }), []);
});

test("REVIEW2 overrides: consumer verification passes only for recorded REVIEW2 override fields", t => {
  const { f, records, runtime, catalog } = registeredExtensionConsumer(t, ["tagStatus"]);
  const review2 = structuredClone(records); review2[0].metadataApprovalType = "REVIEW2";
  const uid = review2[0].questionUid;
  const overrides = [{ questionUid: uid, field: "tagStatus", sourceValue: "manual_review", registeredValue: review2[0].tagStatus }];
  assert.deepEqual(verifyConsumerValues(f.root, review2, runtime, catalog, { sourceValueOverrides: overrides }), { canonical: 1, usableMetaLane: 0 });
  // not recorded -> still refused
  assert.throws(() => verifyConsumerValues(f.root, review2, runtime, catalog), /Consumer metadata conflict/);
  // not REVIEW2 -> still refused
  assert.throws(() => verifyConsumerValues(f.root, records, runtime, catalog, { sourceValueOverrides: overrides }), /Consumer metadata conflict/);
  // recorded for a different field -> a conflict on another field is still refused
  const other = registeredExtensionConsumer(t, ["tagStatus", "templateKey"]);
  const o2 = structuredClone(other.records); o2[0].metadataApprovalType = "REVIEW2";
  assert.throws(() => verifyConsumerValues(other.f.root, o2, other.runtime, other.catalog, { sourceValueOverrides: overrides }), /Consumer metadata conflict/);
  // registered value that no longer matches the record -> refused
  assert.throws(() => verifyConsumerValues(f.root, review2, runtime, catalog, { sourceValueOverrides: [{ ...overrides[0], registeredValue: "other" }] }), /Consumer metadata conflict/);
});

function rendererV3Fixture(t, { kind = 'QUESTION_FALLBACK_SINGLE_IMG_SRC_REPLACEMENT', emptyContent = false,
    mutateBefore = () => {}, mutateCurrent = () => {} } = {}) {
  const f = reviewedSourceFixture(t), questionAlias = kind === 'QUESTION_FALLBACK_SINGLE_IMG_SRC_REPLACEMENT';
  f.sourceSha = auditSourceFingerprint; f.bodySha = auditContentFingerprint;
  const oldAssetPath = 'archive/assets/v3-before.svg', assetPath = 'archive/assets/v3-current.svg';
  const oldBytes = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>';
  const newBytes = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L2 2"/><circle r="2"/></svg>';
  const field = questionAlias ? 'question' : 'content';
  const before = structuredClone(f.current); delete before.image;
  if (questionAlias) { delete before.content; if (emptyContent) before.content = ''; }
  before[field] = '<p>같은 조건과 풀이를 보존한다.</p><img src="assets/v3-before.svg" alt="정확한 그림">끝';
  if (!questionAlias) before.aliveReplacement = { kind: 'EXACT_ASSET', sourceAsset: { path: 'unchanged-origin.png' },
    replacementAsset: { path: oldAssetPath.slice('archive/'.length), bytes: Buffer.byteLength(oldBytes), sha256: hash(oldBytes) },
    status: 'EXISTING', note: 'unchanged' };
  mutateBefore(before);
  f.put(oldAssetPath, oldBytes); f.git('add', '--', oldAssetPath);
  const nativeBytes = f.writeBank(before);
  Object.assign(f.review, { sourceAfterBlob: blob(nativeBytes), sourceAfterSha256: hash(nativeBytes) });
  const nativeRef = f.updateReview(), nativeCommit = f.item.sourceReview.reviewCommit;
  const commit = (...paths) => {
    if (paths.length) f.git('add', '--', ...paths);
    f.git('-c', 'user.name=Renderer V3 fixture', '-c', 'user.email=renderer@example.invalid', 'commit', '--allow-empty', '-qm', 'Exact renderer V3 snapshot');
    return f.git('rev-parse', 'HEAD');
  };
  const sourceRef = (c, q) => ({ commit: c, path: f.sourcePath, gitBlobSha1: f.git('rev-parse', `${c}:${f.sourcePath}`),
    sha256: hash(f.git('show', `${c}:${f.sourcePath}`) + '\n'), questionSha256: hash(stable(q)) });
  const assetRef = (c, p) => ({ commit: c, path: p, gitBlobSha1: f.git('rev-parse', `${c}:${p}`),
    sha256: hash(f.git('show', `${c}:${p}`)), visuallyInspected: true });
  const prefigureCommit = commit(), prefigure = sourceRef(prefigureCommit, before);
  const current = structuredClone(before); current[field] = current[field].replace('assets/v3-before.svg', 'assets/v3-current.svg');
  if (!questionAlias) Object.assign(current.aliveReplacement.replacementAsset,
    { path: assetPath.slice('archive/'.length), bytes: Buffer.byteLength(newBytes), sha256: hash(newBytes) });
  mutateCurrent(current, before);
  f.put(assetPath, newBytes); f.writeBank(current);
  const currentCommit = commit(f.sourcePath, assetPath), currentRef = sourceRef(currentCommit, current);
  Object.assign(f.item.after, { sourceFingerprint: f.sourceSha(current), contentFingerprint: f.bodySha(current) });
  const original = { commit: nativeCommit, path: f.item.sourceReview.reviewPath, sha256: nativeRef.sha256 };
  const delta = [...new Set([...Object.keys(before), ...Object.keys(current)])]
    .filter(k => stable(before[k]) !== stable(current[k])).sort();
  const fieldHash = (q, k) => hash(stable({ present: Object.hasOwn(q, k), value: q[k] ?? null }));
  const beforeAssets = [assetRef(prefigureCommit, oldAssetPath)], currentAssets = [assetRef(currentCommit, assetPath)];
  const row = { questionUid: 'uid1', sourceOrdinal: 1, decision: 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION',
    visualInspectionPerformed: true, nativeReviewRef: original, nativeItemSha256: hash(stable(f.review.items[0])),
    nativeSourceRef: sourceRef(nativeCommit, before), prefigureSourceRef: prefigure, currentSourceRef: currentRef,
    changedRendererFields: delta, fieldDeltaHashes: delta.map(k => ({ field: k, beforeSha256: fieldHash(before, k), afterSha256: fieldHash(current, k) })),
    rendererTransition: { kind, field, beforeSha256: hash(before[field] ?? ''), afterSha256: hash(current[field] ?? ''),
      beforeAssetPath: oldAssetPath, currentAssetPath: assetPath }, nonRendererFieldChanges: [],
    mathematicalStemBytesUnchanged: true, choicesAnswerSolutionDifficultyUnchanged: true,
    assets: { before: beforeAssets, current: currentAssets },
    visualEvidence: { contactSha256: 'c'.repeat(64), renderedAssetCount: 2 },
    observed: 'Only one inspected local image source and its exact asset provenance changed.' };
  const independent = { schemaVersion: 'archive-independent-current-renderer-review-v3',
    scope: 'EXACT_FALLBACK_IMAGE_SOURCE_AND_ASSET_PROVENANCE', reviewer: 'independent-v3-renderer-reviewer',
    decision: 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION', nativeReviewCommit: nativeCommit, prefigureCommit, currentCommit,
    counts: { selected: 1, newFullMathApprovals: 0, newMetadataApprovals: 0, newDifficultyApprovals: 0, newReviewPassCount: 0 }, rows: [row] };
  const independentPath = 'docs/independent-renderer-v3.json', manifestPath = 'docs/renderer-v3-continuity.json';
  const manifest = { schemaVersion: 'archive-reviewed-renderer-continuity-evidence-v1',
    scope: 'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER', sourceArchiveFile: f.request.sourceArchiveFile,
    expectedQuestionCount: 2, selectedUidCount: 1, newFullMathematicalQa: false, newReviewPassCount: 0,
    newMetadataApprovals: 0, newDifficultyJudgments: 0, items: [{ questionUid: 'uid1', sourceOrdinal: 1,
      nativeReviewRef: original, nativeItemSha256: hash(stable(f.review.items[0])), prefigureSourceRef: prefigure,
      currentSourceRef: currentRef, independentReviewRef: null }] };
  const republish = () => {
    f.put(independentPath, independent);
    const independentRef = { path: independentPath, sha256: hash(fs.readFileSync(path.join(f.root, independentPath))) };
    manifest.items[0].independentReviewRef = independentRef; f.put(manifestPath, manifest);
    const manifestRef = { path: manifestPath, sha256: hash(fs.readFileSync(path.join(f.root, manifestPath))) };
    const reviewCommit = commit(independentPath, manifestPath), refs = [...f.evidenceRefs, nativeRef, independentRef, manifestRef];
    f.request.approval.evidenceRefs = refs; f.item.evidenceRefs = refs;
    f.item.sourceReview.rendererProof = { schemaVersion: 'archive-reviewed-current-renderer-continuity-v1', reviewCommit, reviewRef: manifestRef };
  };
  republish();
  return { ...f, current, before, nativeQuestion: before, independent, row, manifest, republish, commit, sourceRef,
    assetRef, oldAssetPath, assetPath, oldBytes, newBytes, independentPath, manifestPath };
}

for (const kind of ['QUESTION_FALLBACK_SINGLE_IMG_SRC_REPLACEMENT', 'CONTENT_SINGLE_IMG_SRC_AND_ASSET_PROVENANCE'])
  test('renderer v3 official write replay and native reuse: ' + kind, t => {
    const f = rendererV3Fixture(t, { kind }), originalReview = fs.readFileSync(path.join(f.root, 'docs/native-review.json'));
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
    const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;
    assert.equal(proof.transitionContract.schemaVersion, 'archive-independent-current-renderer-review-v3');
    assert.equal(proof.transitionContract.rendererTransition.kind, kind);
    assert.deepEqual([proof.newMathematicalQa, proof.newMetadataApprovals, proof.newDifficultyJudgments], [false, 0, 0]);
    assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
    const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString());
    const identity = f.read('archive/data/question_identity_map.json').records.find(r => r.questionUid === 'uid1');
    const source = { root: f.root, bytes, blobSha1: blob(bytes), bank, runtimeRecord: receipt.runtimeRecords[0] };
    for (const previous of [f.before, bank[0]])
      assert.equal(nativeReviewedRendererRebind(receipt, source, previous, bank[0], identity, 1,
        receipt.appliedRecords[0], loadActiveMetaRegistry(f.root)), true);
    assert.deepEqual(f.read(META).records[1], f.hold);
    assert.deepEqual(fs.readFileSync(path.join(f.root, 'docs/native-review.json')), originalReview);
  });

test('renderer v3 question alias accepts only absent or identically empty content', async t => {
  const positive = rendererV3Fixture(t, { emptyContent: true });
  assert.equal(registerReviewedExamV2({ root: positive.root, request: positive.request }).totalQuestions, 1);
  for (const [name, options] of [
    ['content is present', { mutateBefore: q => { q.content = 'Rendered content takes precedence'; } }],
    ['null content', { mutateBefore: q => { q.content = null; } }],
    ['alias activation', { mutateCurrent: q => { q.content = ''; } }],
    ['alias deactivation', { emptyContent: true, mutateCurrent: q => { delete q.content; } }],
    ['content fallback switch', { mutateCurrent: q => { q.content = q.question; delete q.question; } }],
  ]) await t.test(name, t => {
    const f = rendererV3Fixture(t, options);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity:/);
  });
});

test('renderer v3 refuses text or other image attribute changes and multiple source replacements', async t => {
  for (const [name, options] of [
    ['text', { mutateCurrent: q => { q.question = q.question.replace('같은', '다른'); } }],
    ['image alternative', { mutateCurrent: q => { q.question = q.question.replace('정확한 그림', '새 설명'); } }],
    ['extra element', { mutateCurrent: q => { q.question += '<b>추가</b>'; } }],
    ['two replacements', { mutateBefore: q => { q.question += '<img src="assets/v3-before.svg">'; },
      mutateCurrent: q => { q.question = q.question.replace('assets/v3-before.svg', 'assets/v3-current.svg'); } }],
    ['image src not changed', { mutateCurrent: (q, old) => { q.question = old.question; } }],
    ['answer', { mutateCurrent: q => { q.answer = 'unreviewed'; } }],
    ['solution', { mutateCurrent: q => { q.solution += ' unreviewed'; } }],
    ['legacy level', { mutateCurrent: q => { q.level = '상'; } }],
    ['difficulty bucket', { mutateCurrent: q => { q.difficultyBucket = 5; } }],
    ['PT', { mutateCurrent: q => { q.problemTypeKey = 'OTHER'; } }],
  ]) await t.test(name, t => {
    const f = rendererV3Fixture(t, options);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity:|source\/approved metadata parity/);
  });
});

test('renderer v3 asset provenance binds both exact real assets and no other object field', async t => {
  const kind = 'CONTENT_SINGLE_IMG_SRC_AND_ASSET_PROVENANCE';
  for (const [name, options] of [
    ['stale current byte count', { mutateCurrent: (q, old) => { q.aliveReplacement.replacementAsset.bytes = old.aliveReplacement.replacementAsset.bytes; } }],
    ['stale current digest', { mutateCurrent: (q, old) => { q.aliveReplacement.replacementAsset.sha256 = old.aliveReplacement.replacementAsset.sha256; } }],
    ['wrong current path', { mutateCurrent: (q, old) => { q.aliveReplacement.replacementAsset.path = old.aliveReplacement.replacementAsset.path; } }],
    ['wrong before byte count', { mutateBefore: q => { q.aliveReplacement.replacementAsset.bytes++; } }],
    ['wrong before digest', { mutateBefore: q => { q.aliveReplacement.replacementAsset.sha256 = 'a'.repeat(64); } }],
    ['changed object status', { mutateCurrent: q => { q.aliveReplacement.status = 'NEW_APPROVAL'; } }],
    ['extra nested property', { mutateCurrent: q => { q.aliveReplacement.replacementAsset.authority = 'invented'; } }],
    ['removed outer property', { mutateCurrent: q => { delete q.aliveReplacement.note; } }],
    ['bare content rebind', { mutateCurrent: (q, old) => { q.aliveReplacement = structuredClone(old.aliveReplacement); } }],
  ]) await t.test(name, t => {
    const f = rendererV3Fixture(t, { kind, ...options });
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity:/);
  });
});

test('renderer v3 requires the exact independent document and three immutable evidence bindings', async t => {
  for (const [name, mutate] of [
    ['scope', f => { f.independent.scope = 'ARBITRARY_HTML'; }],
    ['kind', f => { f.row.rendererTransition.kind = 'ANY_IMAGE'; }],
    ['transition field', f => { f.row.rendererTransition.field = 'content'; }],
    ['before hash', f => { f.row.rendererTransition.beforeSha256 = 'a'.repeat(64); }],
    ['asset path', f => { f.row.rendererTransition.currentAssetPath = 'archive/assets/foreign.svg'; }],
    ['new metadata approval', f => { f.independent.counts.newMetadataApprovals = 1; }],
    ['field delta', f => { f.row.fieldDeltaHashes = []; }],
    ['native item', f => { f.row.nativeItemSha256 = 'a'.repeat(64); }],
    ['prefigure', f => { f.row.prefigureSourceRef = { ...f.row.prefigureSourceRef, questionSha256: 'a'.repeat(64) }; }],
    ['current', f => { f.row.currentSourceRef = { ...f.row.currentSourceRef, questionSha256: 'a'.repeat(64) }; }],
    ['uninspected', f => { f.row.assets.current[0].visuallyInspected = false; }],
    ['omitted asset', f => { f.row.assets.current = []; }],
    ['same reviewer', f => { f.independent.reviewer = f.review.author; }],
  ]) await t.test(name, t => {
    const f = rendererV3Fixture(t); mutate(f); f.republish();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity:/);
  });
  for (const refKind of ['native', 'independent', 'manifest']) await t.test('missing item ref ' + refKind, t => {
    const f = rendererV3Fixture(t), p = refKind === 'native' ? 'docs/native-review.json' :
      refKind === 'independent' ? f.independentPath : f.manifestPath;
    f.item.evidenceRefs = f.item.evidenceRefs.filter(r => r.path !== p);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity:|source reassessment:/);
  });
});

test('renderer v3 keeps live asset and non-payload provenance guards on replay', async t => {
  for (const kind of ['QUESTION_FALLBACK_SINGLE_IMG_SRC_REPLACEMENT', 'CONTENT_SINGLE_IMG_SRC_AND_ASSET_PROVENANCE'])
    await t.test(kind, t => {
      const f = rendererV3Fixture(t, { kind }); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
      f.put(f.assetPath, f.newBytes + ' ');
      assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /live renderer bytes changed/);
      f.put(f.assetPath, f.newBytes);
      assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
      const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString());
      const receipt = f.read(f.receiptPath), identity = f.read('archive/data/question_identity_map.json').records[0];
      const source = { root: f.root, bytes, blobSha1: blob(bytes), bank, runtimeRecord: receipt.runtimeRecords[0] };
      if (kind.includes('PROVENANCE')) {
        const changedQuestion = structuredClone(bank[0]); changedQuestion.aliveReplacement.replacementAsset.bytes++;
        assert.throws(() => nativeReviewedRendererRebind(receipt, source, bank[0], changedQuestion, identity, 1,
          receipt.appliedRecords[0], loadActiveMetaRegistry(f.root)), /renderer continuity:/);
      }
    });
});

test('renderer v3 binds unmodified image metadata properties outside the legacy payload', async t => {
  for (const kind of ['QUESTION_FALLBACK_SINGLE_IMG_SRC_REPLACEMENT', 'CONTENT_SINGLE_IMG_SRC_AND_ASSET_PROVENANCE']) {
    for (const [field, value] of [['imageAlt', 'Unreviewed alternative'], ['imageSize', null]]) {
      await t.test(`${kind}: live ${field}`, t => {
        const f = rendererV3Fixture(t, { kind });
        f.writeBank({ ...f.current, [field]: value });
        assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }),
          /v3 live or prefigure renderer properties differ from their snapshots/);
      });
      await t.test(`${kind}: native to prefigure ${field}`, t => {
        const f = rendererV3Fixture(t, { kind }), before = { ...f.before, [field]: value };
        f.writeBank(before); const prefigureCommit = f.commit(f.sourcePath), beforeRef = f.sourceRef(prefigureCommit, before);
        Object.assign(f.current, { [field]: value }); f.writeBank(f.current);
        const currentCommit = f.commit(f.sourcePath), currentRef = f.sourceRef(currentCommit, f.current);
        Object.assign(f.independent, { prefigureCommit, currentCommit });
        Object.assign(f.row, { prefigureSourceRef: beforeRef, currentSourceRef: currentRef });
        Object.assign(f.manifest.items[0], { prefigureSourceRef: beforeRef, currentSourceRef: currentRef });
        f.republish();
        assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }),
          /v3 live or prefigure renderer properties differ from their snapshots/);
      });
    }
  }
});


test('renderer v3 never relaxes V1 or V2 evidence and rejects an unreviewed prior solution renderer', async t => {
  for (const version of ['archive-independent-narrow-renderer-review-v1', 'archive-independent-current-renderer-review-v2'])
    await t.test('schema downgrade ' + version, t => {
      const f = rendererV3Fixture(t); f.independent.schemaVersion = version; f.republish();
      assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity:/);
    });
  for (const kind of ['QUESTION_FALLBACK_SINGLE_IMG_SRC_REPLACEMENT', 'CONTENT_SINGLE_IMG_SRC_AND_ASSET_PROVENANCE'])
    await t.test('unreviewed prior renderer ' + kind, t => {
      const f = rendererV3Fixture(t, { kind }), extra = 'archive/assets/unreviewed-solution.svg';
      f.put(extra, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="3"/></svg>');
      const before = { ...f.before, solutionImage: extra.slice('archive/'.length), solutionImageAlt: 'unreviewed' };
      f.writeBank(before); const prefigureCommit = f.commit(f.sourcePath, extra), beforeRef = f.sourceRef(prefigureCommit, before);
      Object.assign(f.current, { solutionImage: before.solutionImage, solutionImageAlt: before.solutionImageAlt });
      f.writeBank(f.current); const currentCommit = f.commit(f.sourcePath), afterRef = f.sourceRef(currentCommit, f.current);
      Object.assign(f.independent, { prefigureCommit, currentCommit });
      Object.assign(f.row, { prefigureSourceRef: beforeRef, currentSourceRef: afterRef });
      Object.assign(f.manifest.items[0], { prefigureSourceRef: beforeRef, currentSourceRef: afterRef });
      f.republish();
      assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }),
        /prefigure source differs from the immutable native student payload/);
    });
});

function rendererV3PriorSolutionFixture(t) {
  const f = rendererV3Fixture(t, { kind: 'CONTENT_SINGLE_IMG_SRC_AND_ASSET_PROVENANCE' });
  const solutionPath = 'archive/assets/v3-existing-solution.svg', witnessPath = 'docs/prior-solution-renderer-review.json';
  f.put(solutionPath, '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1"/></svg>');
  const added = { solutionImage: solutionPath.slice('archive/'.length), solutionImageAlt: '기존 풀이의 정확한 관계',
    solutionImageCaption: '기존 풀이와 같은 조건을 표시한다.', solutionImageSize: 'full' };
  const previous = { ...f.before, ...added };
  f.writeBank(previous); const prefigureCommit = f.commit(f.sourcePath, solutionPath), prefigure = f.sourceRef(prefigureCommit, previous);
  Object.assign(f.current, added); f.writeBank(f.current);
  const currentCommit = f.commit(f.sourcePath), currentRef = f.sourceRef(currentCommit, f.current);
  Object.assign(f.independent, { prefigureCommit, currentCommit });
  Object.assign(f.row, { prefigureSourceRef: prefigure, currentSourceRef: currentRef });
  Object.assign(f.manifest.items[0], { prefigureSourceRef: prefigure, currentSourceRef: currentRef });
  const nativeAssets = structuredClone(f.row.assets.before);
  f.row.assets.before = [f.assetRef(prefigureCommit, f.oldAssetPath), f.assetRef(prefigureCommit, solutionPath)];
  f.row.assets.current = [f.assetRef(currentCommit, f.assetPath), f.assetRef(currentCommit, solutionPath)];
  f.row.visualEvidence.renderedAssetCount = 3;
  const fields = Object.keys(added).sort(), fieldHash = (q, k) => hash(stable({ present: Object.hasOwn(q, k), value: q[k] ?? null }));
  const witness = { schemaVersion: 'archive-independent-prior-solution-renderer-review-v1',
    scope: 'EXACT_PREEXISTING_SOLUTION_RENDERER_ADDITION', decision: 'PASS_NARROW_PRIOR_SOLUTION_RENDERER_CONTINUITY',
    reviewer: 'independent-prior-solution-reviewer', questionUid: 'uid1', sourceOrdinal: 1,
    nativeReviewRef: f.row.nativeReviewRef, nativeItemSha256: f.row.nativeItemSha256,
    nativeSourceRef: f.row.nativeSourceRef, prefigureSourceRef: prefigure, currentSourceRef: currentRef,
    addedFields: fields, fieldDeltaHashes: fields.map(field => ({ field,
      beforeSha256: fieldHash(f.before, field), afterSha256: fieldHash(previous, field) })),
    nativeAssets, prefigureAssets: structuredClone(f.row.assets.before),
    visualEvidence: { contactSha256: 'd'.repeat(64), renderedAssetCount: 2 },
    observed: 'The pre-existing illustration and plain descriptions restate the exact immutable original solution.',
    newFullMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0 };
  const publishMain = f.republish;
  f.republish = () => {
    f.put(witnessPath, witness);
    const ref = { path: witnessPath, sha256: hash(fs.readFileSync(path.join(f.root, witnessPath))) };
    f.row.prefigureRendererReviewRef = ref; f.git('add', '--', witnessPath); publishMain();
    f.request.approval.evidenceRefs.push(ref); f.item.evidenceRefs = [...f.request.approval.evidenceRefs];
  };
  f.republish();
  return { ...f, previous, witness, witnessPath, solutionPath };
}

test('renderer v3 exact prior solution witness supports official write replay and native reuse without a new semantic review', t => {
  const f = rendererV3PriorSolutionFixture(t), original = fs.readFileSync(path.join(f.root, 'docs/native-review.json'));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  const receipt = f.read(f.receiptPath), proof = receipt.fingerprintRepairs[0].sourceReview.rendererContinuity;
  assert.equal(proof.prefigureRendererWitness.schemaVersion, 'archive-independent-prior-solution-renderer-review-v1');
  assert.deepEqual(proof.prefigureRendererWitness.addedFields, ['solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  const bytes = fs.readFileSync(path.join(f.root, f.sourcePath)), bank = loadSourceBank(bytes.toString());
  const identity = f.read('archive/data/question_identity_map.json').records[0];
  const source = { root: f.root, bytes, blobSha1: blob(bytes), bank, runtimeRecord: receipt.runtimeRecords[0] };
  for (const previous of [f.before, f.previous, bank[0]])
    assert.equal(nativeReviewedRendererRebind(receipt, source, previous, bank[0], identity, 1,
      receipt.appliedRecords[0], loadActiveMetaRegistry(f.root)), true);
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'docs/native-review.json')), original);
  assert.deepEqual(f.read(META).records[1], f.hold);
});

test('renderer v3 prior solution witness cannot be omitted or broaden the exact historical addition', async t => {
  for (const [name, mutate] of [
    ['scope', f => { f.witness.scope = 'ANY_SOLUTION_CHANGE'; }],
    ['decision', f => { f.witness.decision = 'PASS'; }],
    ['same reviewer', f => { f.witness.reviewer = f.review.author; }],
    ['foreign UID', f => { f.witness.questionUid = 'uid2'; }],
    ['foreign ordinal', f => { f.witness.sourceOrdinal = 2; }],
    ['native item', f => { f.witness.nativeItemSha256 = 'a'.repeat(64); }],
    ['native source', f => { f.witness.nativeSourceRef = { ...f.witness.nativeSourceRef, questionSha256: 'a'.repeat(64) }; }],
    ['prefigure source', f => { f.witness.prefigureSourceRef = { ...f.witness.prefigureSourceRef, questionSha256: 'a'.repeat(64) }; }],
    ['current source', f => { f.witness.currentSourceRef = { ...f.witness.currentSourceRef, questionSha256: 'a'.repeat(64) }; }],
    ['missing field', f => { f.witness.addedFields.pop(); }],
    ['field digest', f => { f.witness.fieldDeltaHashes[0].afterSha256 = 'a'.repeat(64); }],
    ['new math approval', f => { f.witness.newFullMathematicalQa = true; }],
    ['new metadata approval', f => { f.witness.newMetadataApprovals = 1; }],
    ['omitted prior asset', f => { f.witness.prefigureAssets.pop(); }],
    ['uninspected', f => { f.witness.prefigureAssets[0].visuallyInspected = false; }],
  ]) await t.test(name, t => {
    const f = rendererV3PriorSolutionFixture(t); mutate(f); f.republish();
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /renderer continuity:/);
  });
  await t.test('missing witness reference', t => {
    const f = rendererV3PriorSolutionFixture(t); delete f.row.prefigureRendererReviewRef;
    f.put(f.independentPath, f.independent);
    const ref = { path: f.independentPath, sha256: hash(fs.readFileSync(path.join(f.root, f.independentPath))) };
    f.manifest.items[0].independentReviewRef = ref; f.put(f.manifestPath, f.manifest);
    const manifestRef = { path: f.manifestPath, sha256: hash(fs.readFileSync(path.join(f.root, f.manifestPath))) };
    const commit = f.commit(f.independentPath, f.manifestPath);
    const refs = f.request.approval.evidenceRefs.filter(r => ![f.independentPath, f.manifestPath].includes(r.path)).concat(ref, manifestRef);
    f.request.approval.evidenceRefs = refs; f.item.evidenceRefs = refs;
    f.item.sourceReview.rendererProof = { ...f.item.sourceReview.rendererProof, reviewCommit: commit, reviewRef: manifestRef };
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /prefigure source differs/);
  });
  await t.test('unbound prior witness in item', t => {
    const f = rendererV3PriorSolutionFixture(t); f.item.evidenceRefs = f.item.evidenceRefs.filter(r => r.path !== f.witnessPath);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /review reference must bind/);
  });
  await t.test('live historical illustration changed', t => {
    const f = rendererV3PriorSolutionFixture(t); registerReviewedExamV2({ root: f.root, request: f.request, write: true });
    fs.appendFileSync(path.join(f.root, f.solutionPath), ' ');
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /live renderer bytes changed/);
  });
});

// Runtime-only catalog identity provenance (catalogIdentityRepairVerified & co) must survive a re-registration that does not state it.
function reregisterFixture(t, { flag = true } = {}) {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const runtimeFile = "archive/data/meta-foundation/runtime/new-course-v1.json";
  const runtime = f.read(runtimeFile);
  if (flag) {
    runtime.records[0].catalogIdentityRepairVerified = true;
    runtime.records[0].catalogIdentityRepairEvidence = "fixture identity repair evidence";
    runtime.records[0].rawQuestionHash = "raw-hash-1";
  }
  f.put(runtimeFile, runtime);
  const first = f.read(META).records[0];
  const q2 = { ...f.q, difficultyBucket: 4 };
  const text = `window.questions = ${JSON.stringify([q2])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, text);
  const request = { schemaVersion: f.request.schemaVersion, requestId: "test-new-course-reregister", examUid: "exam1", sourceArchiveFile: f.request.sourceArchiveFile,
    expectedSourceBlobSha1: blob(text), expectedQuestionCount: 1,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "fixture-reviewer", evidenceRefs: f.evidenceRefs },
    items: [{ questionUid: "uid1", sourceOrdinal: 1, before: { difficultyBucket: first.difficultyBucket }, after: { difficultyBucket: 4 }, reason: "난이도만 다시 등록", evidenceRefs: f.evidenceRefs }] };
  return { ...f, request, runtimeFile };
}

test("re-registration keeps catalog identity provenance on the runtime record when the request does not state it", t => {
  const f = reregisterFixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(f.runtimeFile).records[0];
  assert.equal(row.difficultyBucket, 4);
  assert.equal(row.catalogIdentityRepairVerified, true);
  assert.equal(row.catalogIdentityRepairEvidence, "fixture identity repair evidence");
  assert.equal(row.rawQuestionHash, "raw-hash-1");
});

test("re-registration does not invent identity provenance for a runtime record that never had it", t => {
  const f = reregisterFixture(t, { flag: false });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(f.runtimeFile).records[0];
  assert.equal(row.difficultyBucket, 4);
  for (const key of ["catalogIdentityRepairVerified", "catalogIdentityRepairEvidence", "rawQuestionHash"]) assert.equal(Object.hasOwn(row, key), false, key);
});

test("identity provenance is carried only for the same UID, file, ordinal and unreplaced identity", () => {
  const previous = { questionUid: "u", sourceArchiveFile: "a.js", sourceOrdinal: 3, catalogIdentityRepairVerified: true, catalogIdentityRepairEvidence: "e", rawQuestionHash: "h", problemTypeKey: "PT_OLD" };
  const final = { questionUid: "u", sourceArchiveFile: "a.js", sourceOrdinal: 3 };
  assert.deepEqual(preservedRuntimeIdentityProvenance({ previous, final, ordinal: 3, identityReplaced: false }),
    { catalogIdentityRepairVerified: true, catalogIdentityRepairEvidence: "e", rawQuestionHash: "h" });
  assert.deepEqual(preservedRuntimeIdentityProvenance({ previous, final, ordinal: 3, identityReplaced: true }), {});
  assert.deepEqual(preservedRuntimeIdentityProvenance({ previous, final, ordinal: 4, identityReplaced: false }), {});
  assert.deepEqual(preservedRuntimeIdentityProvenance({ previous, final: { ...final, sourceArchiveFile: "b.js" }, ordinal: 3, identityReplaced: false }), {});
  assert.deepEqual(preservedRuntimeIdentityProvenance({ previous, final: { ...final, questionUid: "v" }, ordinal: 3, identityReplaced: false }), {});
  assert.deepEqual(preservedRuntimeIdentityProvenance({ previous: undefined, final, ordinal: 3, identityReplaced: false }), {});
  assert.deepEqual(preservedRuntimeIdentityProvenance({ previous, final: { ...final, rawQuestionHash: "stated" }, ordinal: 3, identityReplaced: false }),
    { catalogIdentityRepairVerified: true, catalogIdentityRepairEvidence: "e" });
});

test("a re-registration that replaces the question identity (fingerprint repair) drops identity provenance", t => {
  const f = reregisterFixture(t);
  const identityPath = "archive/data/question_identity_map.json", identityBefore = f.read(identityPath).records[0].sourceFingerprint;
  const q3 = { ...f.q, content: "교체된 지문", difficultyBucket: 4 };
  const text = `window.questions = ${JSON.stringify([q3])};
`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, text);
  const after = { sourceFingerprint: auditSourceFingerprint(q3), contentFingerprint: auditContentFingerprint(q3) };
  Object.assign(f.request, { expectedSourceBlobSha1: blob(text) });
  Object.assign(f.request.items[0], { before: { ...f.request.items[0].before, sourceFingerprint: f.read(META).records[0].sourceFingerprint, contentFingerprint: null },
    after: { ...f.request.items[0].after, ...after }, identityBefore: { sourceFingerprint: identityBefore } });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(f.runtimeFile).records[0];
  assert.equal(row.difficultyBucket, 4);
  for (const key of ["catalogIdentityRepairVerified", "catalogIdentityRepairEvidence", "rawQuestionHash"]) assert.equal(Object.hasOwn(row, key), false, key);
});

// Actual registrar/Native/Consumer parity for the issued read-only batch context.
test('projection phase reuses inputs while revalidating each real partial Native replay', async t => {
  const { createProjectionPhase, projectionPhaseSummary, closeProjectionPhase } = await import('../archive/tools/meta-foundation/reviewed-projection-phase.mjs');
  const f = auditedSourcePreservationFixture(t, { questionCount: 24, selectedOrdinals: [1, 24], consumerCatalog: true, consumerParent: false });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  materializeAuditConsumerInputs(f);
  const baseline = registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true });
  const phase = createProjectionPhase(f.root);
  for (let n = 0; n < 2; n++) assert.deepEqual(registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true, projectionPhase: phase }), baseline);
  const bad = structuredClone(f.request); bad.items[0].sourceOrdinal = 2;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: bad, verifyProjection: true, projectionPhase: phase }), /UID\/source ordinal mismatch|different content/);
  assert.deepEqual(registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true, projectionPhase: phase }), baseline);
  const summary = projectionPhaseSummary(phase, f.root);
  for (const key of ['json:archive/data/question_metadata.json', 'json:archive/data/question_identity_map.json', 'canonical-tables', 'resolved-consumer-catalog', 'search-source-index']) assert.equal(summary.inputLoads[key], 1, key);
  assert.equal(summary.cachedVerdicts, 0); assert.equal(closeProjectionPhase(phase, f.root).snapshot.sha256, summary.snapshot.sha256);
});
test('projection input context cannot enter real write or ordinary dry-run registration', async t => {
  const { createProjectionPhase, closeProjectionPhase } = await import('../archive/tools/meta-foundation/reviewed-projection-phase.mjs');
  const f = auditedSourcePreservationFixture(t, { questionCount: 2, selectedOrdinals: [1], consumerCatalog: true });
  const phase = createProjectionPhase(f.root);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true, projectionPhase: phase }), /read-only projection/);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, projectionPhase: phase }), /read-only projection/);
  closeProjectionPhase(phase, f.root);
});

test("source rebind keeps catalog identity provenance on the runtime record and never invents it", t => {
  const keys = ["catalogIdentityRepairVerified", "catalogIdentityRepairEvidence", "rawQuestionHash"];
  const runtimeFile = "archive/data/meta-foundation/runtime/new-course-v1.json";
  const flagged = sourceRebindFixture(t);
  const runtime = flagged.read(runtimeFile);
  Object.assign(runtime.records[0], { catalogIdentityRepairVerified: true, catalogIdentityRepairEvidence: "fixture identity repair evidence", rawQuestionHash: "raw-hash-1" });
  flagged.put(runtimeFile, runtime);
  // Same strict runtime comparison as before; only the replaced record's identity provenance is carried over.
  assert.equal(registerReviewedExamV2({ root: flagged.root, request: flagged.request, write: true }).status, "PASS");
  const row = flagged.read(runtimeFile).records[0];
  assert.equal(row.catalogIdentityRepairVerified, true);
  assert.equal(row.catalogIdentityRepairEvidence, "fixture identity repair evidence");
  assert.equal(row.rawQuestionHash, "raw-hash-1");
  assert.equal(row.metadataRevision.endsWith(":test-source-rebind"), true);
  const plain = sourceRebindFixture(t);
  assert.equal(registerReviewedExamV2({ root: plain.root, request: plain.request, write: true }).status, "PASS");
  for (const key of keys) assert.equal(Object.hasOwn(plain.read(runtimeFile).records[0], key), false, key);
});

// Meta slim PR 0: the registrar takes the judged values only; copies/auxiliary fields are neither required nor stored.
test("minimal request without copy or auxiliary fields registers", t => {
  const f = fixture(t);
  for (const k of ["rpmSemanticStatus", "rpmL3", "rpmL4"]) { delete f.request.items[0].after[k]; delete f.request.items[0].before[k]; }
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.status, "PASS");
  assert.equal(result.reportTags, undefined);
  const row = f.read(META).records[0];
  assert.equal(row.problemTypeKey, "PT_NEW");
  assert.equal(row.difficultyBucket, 3);
  assert.equal(row.rpmL3, undefined);
});

test("a field outside the value contract is not stored and is reported instead of rejected", t => {
  const f = fixture(t);
  Object.assign(f.request.items[0].after, { solution: "rewrite", rpmPrimaryL3: "copy", difficultyBasis: "why" });
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.status, "PASS");
  assert.deepEqual(result.reportTags, [{ questionUid: "uid1", kind: "UNSTORED_FIELDS", fields: ["solution", "rpmPrimaryL3", "difficultyBasis"] }]);
  const row = f.read(META).records[0];
  for (const k of ["solution", "rpmPrimaryL3", "difficultyBasis"]) assert.equal(Object.hasOwn(row, k), false, k);
  assert.equal(row.problemTypeKey, "PT_NEW");
  assert.equal(fs.readFileSync(path.join(f.root, "archive/exams/fixture/exam.js"), "utf8").includes("rewrite"), false);
  // The same in-memory request can be replayed: the registrar must not have rewritten it.
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

function recordIdFixture(t, { fixtureRowId = "FIXTURE-RPM-1", keepL = {} } = {}) {
  const f = fixture(t);
  const rpmPath = { majorUnit: "정본 RPM 대단원", midUnit: "정본 RPM 중단원", l3: "정본 RPM 개념", l4: "정본 RPM 유형" };
  const item = f.request.items[0];
  for (const k of ["rpmSemanticStatus", "rpmL3", "rpmL4"]) { delete item.after[k]; delete item.before[k]; }
  item.before.rpmPrimaryRecordId = null; item.after.rpmPrimaryRecordId = "FIXTURE-RPM-1";
  for (const [k, v] of Object.entries(keepL)) { item.before[k] = null; item.after[k] = v; }
  const masterPath = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
  f.put(masterPath, { schemaVersion: "js-archive-taxonomy-rpm-primary-v1.0", authorityStatus: "LOCKED", records: [] });
  f.put("archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle1.json", { schemaVersion: "rpm-primary-active-crosswalk-v1", status: "ACTIVE_REFERENCE",
    rpmAuthority: { source: masterPath }, records: [{ id: fixtureRowId, curriculum: "2022", scope: "중1 수학", rpmPath }] });
  return { f, rpmPath };
}

test("rpmPrimaryRecordId fills empty rpmL1~L4 from its crosswalk row", t => {
  const { f, rpmPath } = recordIdFixture(t);
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.rpmPrimaryRecordId, "FIXTURE-RPM-1");
  assert.deepEqual([row.rpmL1, row.rpmL2, row.rpmL3, row.rpmL4], [rpmPath.majorUnit, rpmPath.midUnit, rpmPath.l3, rpmPath.l4]);
  assert.deepEqual(result.reportTags, [{ questionUid: "uid1", kind: "RPM_FILLED_FROM_RECORD_ID", rpmPrimaryRecordId: "FIXTURE-RPM-1", fields: ["rpmL1", "rpmL2", "rpmL3", "rpmL4"] }]);
  assert.equal(row.L3, "새 유형", "plain L1~L4 display fields come from PT/TPL, not from the RPM fill");
});

test("rpmPrimaryRecordId never overwrites an existing rpmL value and reports a difference", t => {
  const { f } = recordIdFixture(t, { keepL: { rpmL3: "작성자가 쓴 개념", rpmL4: "정본 RPM 유형" } });
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.rpmL3, "작성자가 쓴 개념");
  assert.equal(row.rpmL4, "정본 RPM 유형");
  assert.equal(row.rpmL1, "정본 RPM 대단원");
  assert.deepEqual(result.reportTags.map(tag => [tag.kind, tag.fields]), [["RPM_FILLED_FROM_RECORD_ID", ["rpmL1", "rpmL2"]], ["RPM_DIFFERS_FROM_CROSSWALK", ["rpmL3"]]]);
});

test("rpmPrimaryRecordId absent from the crosswalk leaves rpmL1~L4 empty and is reported", t => {
  const { f } = recordIdFixture(t, { fixtureRowId: "OTHER-RPM-9" });
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  assert.equal(row.rpmPrimaryRecordId, "FIXTURE-RPM-1");
  for (const k of ["rpmL1", "rpmL2", "rpmL3", "rpmL4"]) assert.equal(Object.hasOwn(row, k), false, k);
  assert.deepEqual(result.reportTags, [{ questionUid: "uid1", kind: "RPM_RECORD_ID_NOT_IN_CROSSWALK", rpmPrimaryRecordId: "FIXTURE-RPM-1" }]);
});

// REVIEW2/FINAL_QA requests are bound to the stem + choices of the questions they cover (text-v1), not to the file blob:
// publishing a solution figure changes the blob but must not need a hand repin; a changed stem or choice must still be refused.
test("REVIEW2: a solution-figure-only source change is accepted without repinning the blob, a stem or choice change is still refused", t => {
  const f = partialFixture(t);
  const run = (...args) => execFileSync("git", args, { cwd: f.root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  run("init", "-q");
  const reviewedBlob = run("hash-object", "-w", f.sourcePath);
  assert.equal(reviewedBlob, f.request.expectedSourceBlobSha1);
  const edit = change => f.put(f.sourcePath, `window.questions = ${JSON.stringify([{ ...f.q, ...change }, { ...f.q, id: 2 }])};\n`);
  edit({ solutionImage: "assets/images/fixture-sol.svg", solutionImageAlt: "해설 그림", solutionImageCaption: "그림 설명" });
  assert.notEqual(run("hash-object", f.sourcePath), reviewedBlob, "the file blob did change");
  assert.equal(f.request.expectedSourceBlobSha1, reviewedBlob, "the request keeps its reviewed blob");
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
  edit({ content: f.q.content + " 조건 추가" });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source Git blob drift/);
  edit({ choices: [...(f.q.choices || ["①", "②"]), "새 보기"] });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /source Git blob drift/);
  // A request whose reviewed blob is not in Git cannot prove the stem is unchanged and keeps the blob binding.
  edit({ solutionImage: "assets/images/fixture-sol.svg" });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: { ...f.request, expectedSourceBlobSha1: "b".repeat(40) } }), /source Git blob drift/);
});
