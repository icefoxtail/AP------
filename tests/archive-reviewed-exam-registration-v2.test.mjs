import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { registerReviewedExamV2, verifyConsumerValues } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";

const CANON = "archive/data/meta-foundation/canonical";
const META = "archive/data/question_metadata.json";
const script = fileURLToPath(new URL("../archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs", import.meta.url));
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest("hex");
const j = v => JSON.stringify(v, null, 2) + "\n";
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);

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

function attachMetaPipelineAudit(f, { existingConcept = false, existingConceptLabelDrift = false, siblingParent = false, promoteCanonicalTypes = false, driveSourceHashDrift = false, targetCanonicalParent = false, exactSourceHashBasis = false } = {}) {
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
    readingEvidence: { sourceTextExcerpt: "학생용 발문 발췌", solutionDecisiveExcerpt: "핵심 풀이 발췌", visualAssetChecked: false, visualType: "NONE" } };
  const audit = { schemaVersion: "ALIVE_META_AUDIT_ATOMIC_v3", examTitle, sourceFileDriveId, sourceSha256: hash(sourceBytes),
    auditedTimestamp: "2026-10-23T00:00:00Z", auditVerdict: "ALL_APPROVED_CANONICAL_STANDARDIZED",
    statistics: { totalQuestions: 1, approved: 1, holdRemaining: 0, canonicalTemplatesReused: 1, newTemplatesCreated: 0, atomicCrossConceptsBound: 1 },
    boundAtomicCrossConcepts: [{ conceptKey: auditConcept.conceptKey, labelKo: auditConcept.canonicalLabelKo, definition: auditConcept.definition }],
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
    f.put(canonicalMasterPath, { records: [{ curriculum: f.request.items[0].after.curriculum, scope: f.request.items[0].after.courseKey,
      majorUnit: f.q.standardUnit, midUnit: f.q.standardUnit }] });
    targetParentRef = { path: canonicalMasterPath, curriculum: f.request.items[0].after.curriculum,
      scope: f.request.items[0].after.courseKey, majorUnit: f.q.standardUnit, midUnit: f.q.standardUnit };
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
    problemTypeKeyNullReason: "No exact ACTIVE binding exists yet.", templateKeyNullReason: "No exact ACTIVE binding exists yet." };
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
  f.put("archive/data/archive2-catalog.json", { records: [{ ...row, sourceFile: row.sourceArchiveFile, metadataConflicts: [] }] });
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
