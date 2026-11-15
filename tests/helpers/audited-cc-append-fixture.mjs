// Synthetic authority is issued by the actual original audit and preservation registrars.
// No production receipt or semantic decision is fabricated by this test fixture.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {registerReviewedExamV2} from '../../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {registerDifficulty5} from '../../archive/tools/meta-foundation/register-difficulty5.mjs';
import {sourceFingerprint as auditSourceFingerprint,contentFingerprint as auditContentFingerprint} from '../../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {validateActiveMetaFields} from '../../archive/tools/meta-foundation/active-registry.mjs';
import canonical from '../../archive/archive2-canonical.js';
import {AUDIT_CC_APPEND_SCHEMA} from '../../archive/tools/meta-foundation/audited-cross-concept-append.mjs';
const CANON='archive/data/meta-foundation/canonical',META='archive/data/question_metadata.json';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');
const j=v=>JSON.stringify(v,null,2)+'\n';
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);

function fixture(t, course = "중1 수학", curriculum = "2022", {assetText} = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-meta-v2-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, value) => { const full = path.join(root, p); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, typeof value === "string" ? value : j(value)); };
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  put("docs/approval.json", { approved: true, meaning: "fixture reviewed definitions" });
  const evidenceRefs = [{ path: "docs/approval.json", sha256: hash(fs.readFileSync(path.join(root, "docs/approval.json"))) }];
  const q = { id: 1, content: "학생용 지문", choices: ["1", "2"], answer: "1", solution: "학생용 해설", image: "assets/audit-cc-test.svg",
    standardCourse: course, standardUnitKey: "UNIT_NEW", standardUnit: "새 단원", subUnitKey: "SUB_NEW", subUnit: "새 세부단원",
    level: "중", problemTypeKey: "PT_NEW", templateKey: "TPL_NEW", crossConceptKeys: ["CC_NEW"], conditionKeys: ["COND_NEW"], integrationPattern: "NONE", difficultyBucket: 3 };
  put('archive/assets/audit-cc-test.svg',assetText || '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M1 1L10 19L19 1Z"/></svg>\n');
  const source = "fixture/exam.js";
  const text = `window.questions = ${JSON.stringify([q])};\n`;
  put(`archive/exams/${source}`, text);
  const fingerprint = hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const current = { questionUid: "uid1", sourceArchiveFile: source, sourceOrdinal: 1, sourceQuestionNo: "1", sourceFingerprint: fingerprint,
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
  change(`${base}/bindings.json`, null, null, null, { status: "ACTIVE", bindings: [{ curriculum, standardCourse: course, standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW", L1: "새 단원", L2: "새 세부단원", status: "ACTIVE" }] });
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
      crossConceptKeys: target.crossConceptKeys, conditionKeys: target.conditionKeys, contentSnippet: f.q.content, hasImage: true }] };
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

function expandOriginalAuditInputs(f, count) {
  const firstUid = f.request.items[0].questionUid;
  const uidAt = n => n === 1 ? firstUid : firstUid.startsWith('qid_v1_') ? 'qid_v1_' + hash('audit fixture ' + n) : 'uid' + n;
  const bank = Array.from({ length: count }, (_, i) => ({ ...structuredClone(f.q), id: i + 1 }));
  // A separate non-selected renderer makes whole-source authority regressions
  // independent of the selected CC application's own visual witness.
  bank[0].image = 'assets/audit-cc-other.svg';
  f.put('archive/assets/audit-cc-other.svg', fs.readFileSync(path.join(f.root, 'archive/assets/audit-cc-test.svg'), 'utf8'));
  f.request.items = bank.map((q, i) => ({ ...structuredClone(f.request.items[0]), questionUid: uidAt(i + 1), sourceOrdinal: i + 1 }));
  f.request.expectedQuestionCount = count;
  const bytes = 'window.questions=' + JSON.stringify(bank) + ';\n';
  f.put('archive/exams/' + f.request.sourceArchiveFile, bytes); f.request.expectedSourceBlobSha1 = blob(bytes);
  for (const p of [META, 'archive/data/question_identity_map.json']) {
    const doc = f.read(p), first = doc.records[0];
    doc.records = bank.map((q, i) => ({ ...structuredClone(first), questionUid: uidAt(i + 1), sourceOrdinal: i + 1, sourceQuestionNo: String(i + 1),
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
  consumerCatalog = false, questionCount = 1, selectedOrdinals = null, assetText } = {}) {
  const f = fixture(t, '중2 수학', '2015', {assetText});
  const index=f.read(CANON+'/registry_index.json');index.status='ACTIVE';index.canonicalSources.push({path:CANON+'/metadata_rules.json'});f.put(CANON+'/registry_index.json',index);
  f.put(CANON+'/metadata_rules.json',{status:'ACTIVE',integrationPatterns:['NONE','SEQUENTIAL']});
  const conditions=f.read(CANON+'/condition_registry.json');conditions.status='ACTIVE';f.put(CANON+'/condition_registry.json',conditions);
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

export function auditedCcAppendFixture(t,{questionCount=3,assetText,mutateNative}={}) {
  const f=auditedSourcePreservationFixture(t,{legacySourceAudit:true,consumerCatalog:true,consumerParent:true,questionCount,assetText});
  registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const priorPath=f.registeredPath,prior=f.read(priorPath);
  fs.rmSync(path.join(f.root,f.request.approval.sourceRebind.requestPath));
  fs.rmSync(path.join(f.root,f.request.approval.sourceRebind.difficultyRequestRef.path));
  const priorCommit=f.checkpoint('synthetic full audit preservation snapshot');
  const ordinal=2,selected=prior.appliedRecords[ordinal-1],uid=selected.questionUid,source=f.request.sourceArchiveFile;
  const oldBank=structuredClone(f.bank),sourceBlob=blob(fs.readFileSync(path.join(f.root,f.sourcePath)));
  const nativePath='.archive-meta-register/evidence/audit-cc-native.json';
  const proposalId='SYNTHETIC-EXACT-CC',key='CC_APPEND';
  const native={schemaVersion:'m2-s2-meta-review-v1',examId:'EXACT-CC-TEST',sourceArchiveFile:source,
    sourceGitBlobSha:sourceBlob,baseSha:priorCommit,reviewedQuestionCount:questionCount,judgedBy:{agent:'native-independent-reviewer'},
    items:prior.appliedRecords.map((r,i)=>({questionUid:r.questionUid,sourceOrdinal:i+1,rpmDecision:'CORRECT',
      decisiveStep:'Synthetic immutable native decision',fieldReview:{classification:'Explicit settled primary',difficulty:'Original difficulty retained'},
      proposalRefs:i+1===ordinal?[proposalId]:[],after:{curriculum:'2015',problemTypeKey:r.problemTypeKey,templateKey:r.templateKey,
        crossConceptKeys:[],integrationPattern:'SEQUENTIAL'}})),
    proposals:[{id:proposalId,type:'CC',supportingQuestionUids:[uid],supportOrdinals:[ordinal],proposedKey:key}]};
  if(mutateNative)mutateNative(native,ordinal);
  f.put(nativePath,native);const nativeCommit=f.checkpoint('synthetic immutable native CC proposal');
  const nativeRef=f.ref(nativePath),finalPath='.archive-meta-register/evidence/audit-cc-finalization.json',registryPath='.archive-meta-register/evidence/audit-cc-registry.json';
  const definition={conceptKey:key,canonicalLabelKo:'별도 확정된 추가 개념',definition:'Synthetic separately approved auxiliary concept.',status:'ACTIVE',
    supportingQuestionUids:[uid],supportingItemCount:1,ownerConceptShard:'NEW_CONCEPTS',aliases:[]};
  const registryChange={path:CANON+'/concepts/new-concepts.json',collection:'concepts',match:{conceptKey:key},before:null,after:definition};
  const assetPath='archive/assets/audit-cc-test.svg',assetBytes=fs.readFileSync(path.join(f.root,assetPath));
  const finalization={schemaVersion:'archive-cross-concept-narrow-definition-finalization-v1',
    status:'DEFINITIONS_FINALIZED_OFFICIAL_REGISTRATION_PENDING',reviewer:'independent-definition-reviewer',nativeReviewCommit:nativeCommit,
    actualMain:nativeCommit,scope:{newFullMathematicalQa:false,newReview2Claims:0,newMetadataApprovals:0,newDifficultyJudgments:0},
    applications:[{examId:native.examId,questionUid:uid,sourceOrdinal:ordinal,sourcePath:f.sourcePath,
      nativeReviewRef:{commit:nativeCommit,path:nativePath,sha256:nativeRef.sha256},nativeItemStableSha256:hash(stable(native.items[ordinal-1])),
      nativeProposalRefs:[proposalId],definitionDisposition:'ADD_EXACT_NEW_CANONICAL_CC',newMathematicalQa:false,newMetadataApproval:false,
      difficultyChanged:false,nativeProtectedStudentFieldsChanges:[],currentSourceCommit:nativeCommit,currentSourceBlobSha1:sourceBlob,
      currentSourceRawSha256:hash(fs.readFileSync(path.join(f.root,f.sourcePath))),currentWholeQuestionStableSha256:hash(stable(f.bank[ordinal-1])),
      currentProblemFigure:{commit:nativeCommit,path:assetPath,sha256:hash(assetBytes),gitBlobSha1:blob(assetBytes),visuallyInspected:true},
      reviewedPrimaryContext:Object.fromEntries(['standardCourse','standardUnitKey','subUnitKey','problemTypeKey','templateKey'].map(k=>[k,selected[k]])),
      nativeAfterCrossConceptKeys:[],addCrossConceptKey:key}],definitionDecisions:[{definition}]};
  f.put(finalPath,finalization);const finalRef=f.ref(finalPath);
  f.put(registryPath,{schemaVersion:'archive-reviewed-cross-concept-registry-change-proposal-v1',status:'PENDING_OFFICIAL_REGISTRAR',
    evidenceRefs:[finalRef],registryChanges:[registryChange]});
  const finalCommit=f.checkpoint('synthetic independent CC finalization');
  const evidenceRefs=[f.ref(priorPath),nativeRef,finalRef,f.ref(registryPath),
    ...[...new Set(f.bank.map(q=>'archive/'+q.image))].map(f.ref)];
  const sourceReview={schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:nativeCommit,reviewPath:nativePath,reviewRef:nativeRef,
    proposalFinalization:{schemaVersion:'archive-native-proposal-finalization-v1',finalizationCommit:finalCommit,
      finalizationRef:finalRef,registryChangesRef:f.ref(registryPath),proposalIds:[proposalId]}};
  f.bank[ordinal-1].crossConceptKeys=[...selected.crossConceptKeys,key];
  const writeBank=()=>{const raw='window.questions='+JSON.stringify(f.bank)+';\n';f.put(f.sourcePath,raw);return raw;};
  const requestId='append-one-reviewed-audit-cc',requestPath='.archive-meta-register/inbox/'+requestId+'.json';
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId,examUid:prior.examUid,sourceArchiveFile:source,
    expectedQuestionCount:questionCount,expectedSourceBlobSha1:blob(writeBank()),
    approval:{type:'META_PIPELINE_AUDIT',metadataReviewed:true,approvedBy:'component-transport-operator',
      metaPipelineAudit:structuredClone(prior.approval.metaPipelineAudit),evidenceRefs,
      sourceRebind:{schemaVersion:AUDIT_CC_APPEND_SCHEMA,requestPath,priorCommit,priorReceiptRef:f.ref(priorPath),
        component:{questionUid:uid,sourceOrdinal:ordinal,addCrossConceptKey:key,sourceReview}}},
    registryChanges:[{...registryChange,evidenceRefs:[finalRef,f.ref(registryPath)]}],
    items:prior.appliedRecords.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal,before:{},after:{},
      reason:'Retain actual original audit; add only the independently finalized CC component to its selected UID.',evidenceRefs}))};
  const save=()=>f.put(requestPath,request);save();
  const nativeArgs=n=>{const result=f.native(n);result.question=structuredClone(f.bank[n-1]);result.previous=oldBank[n-1];
    result.nativeSource.bank=structuredClone(f.bank);result.nativeSource.blobSha1=request.expectedSourceBlobSha1;return result;};
  const head=f.checkpoint('synthetic exact CC transport input');
  return {...f,request,requestPath,prior,priorPath,priorCommit,nativePath,nativeCommit,finalPath,registryPath,finalCommit,
    selected,uid,ordinal,key,oldBank,head,save,writeBank,nativeArgs,registeredPath:'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+requestId+'.json'};
}

export function materializeAuditConsumerInputs(f, { parentWitness = true } = {}) {
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

