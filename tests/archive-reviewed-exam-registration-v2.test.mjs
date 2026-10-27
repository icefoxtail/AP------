import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isMetaPipelineApprovedTypeRebindAllowed, metaPipelineCrossConceptCountMatches, metaPipelineTemplateReuseCountMatches, registerReviewedExamV2, verifyConsumerValues } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";

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
});

test("META_PIPELINE_AUDIT v2 fails closed when a bound CrossConcept has no definition evidence", t => {
  const f = fixture(t);
  attachMetaPipelineAuditV2(f);
  f.request.registryChanges = f.request.registryChanges.filter(change =>
    change.collection !== "activeConceptShards" && !change.path.startsWith(`${CANON}/concepts/`));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }),
    /META_PIPELINE_AUDIT v2 lacks an active CrossConcept definition for CC_NEW/);
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
