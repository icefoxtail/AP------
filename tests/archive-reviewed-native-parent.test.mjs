import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { registerReviewedExamV2 } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";

const META = "archive/data/question_metadata.json", IDENTITY = "archive/data/question_identity_map.json";
const CANON = "archive/data/meta-foundation/canonical", PACK = `${CANON}/packs/middle-geometry`;
const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const CROSS = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json";
const hash = b => crypto.createHash("sha256").update(b).digest("hex");
const blob = b => crypto.createHash("sha1").update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest("hex");
const full = q => hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
const body = q => hash(JSON.stringify({ content: q.content, choices: q.choices, image: q.image }));

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-native-parent-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const raw = p => fs.readFileSync(path.join(root, p));
  const read = p => JSON.parse(raw(p));
  const put = (p, v) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
    fs.writeFileSync(path.join(root, p), typeof v === "string" ? v : JSON.stringify(v, null, 2) + "\n"); };
  const ref = p => ({ path: p, sha256: hash(raw(p)) });
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "-q");
  const commit = () => { git("add", "--", "archive/exams/fixture/exam.js", "docs/native-review.json");
    git("-c", "user.name=Native fixture reviewer", "-c", "user.email=fixture@example.invalid", "commit", "--allow-empty", "-qm", "Exact native review");
    return git("rev-parse", "HEAD"); };
  const rpmPath = { majorUnit: "도형의 닮음과 피타고라스 정리", midUnit: "삼각형의 무게중심", l3: "넓이와 무게중심", l4: "무게중심을 이용한 복합도형" };
  const values = { curriculum: "2015", curriculumKey: "2015", courseKey: "M2-2", standardCourse: "중2 수학",
    standardUnitKey: "M2-05", standardUnit: "도형의 성질", subUnitKey: "M2-05-TRIANGLE_PROPERTIES", subUnit: "삼각형의 성질",
    problemTypeKey: "PT_COORD_CENTROID", templateKey: "TPL_CENTROID_APPLICATION", crossConceptKeys: [], conditionKeys: [],
    integrationPattern: "NONE", level: "중", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL",
    rpmL1: rpmPath.majorUnit, rpmL2: rpmPath.midUnit, rpmL3: rpmPath.l3, rpmL4: rpmPath.l4, rpmPrimaryPath: rpmPath };
  const q = { id: 1, questionUid: "uid1", content: "무게중심을 지나는 평행선으로 나눈 넓이", choices: ["4:5", "1:2"], answer: "1",
    solution: "중선의 비와 평행선으로 길이비를 구한 뒤 제곱하여 넓이비를 구한다.", image: "", ...values };
  const heldQuestion = { ...q, id: 2, questionUid: "uid2", content: "범위 밖 보류 문항" };
  const sourcePath = "archive/exams/fixture/exam.js";
  const writeBank = () => { const bytes = `window.questionBank = ${JSON.stringify([q, heldQuestion])};\n`; put(sourcePath, bytes); return bytes; };
  const sourceBytes = writeBank(), old = { ...q, solution: "이전 검토 판본" };
  const before = { questionUid: "uid1", sourceArchiveFile: "fixture/exam.js", sourceOrdinal: 1, sourceFingerprint: full(old), contentFingerprint: body(old),
    standardCourse: values.standardCourse, standardUnitKey: values.standardUnitKey, subUnitKey: values.subUnitKey,
    reviewStatus: "review_required", metadataStatus: "registration_pending_semantic_review" };
  const hold = { questionUid: "uid2", sourceArchiveFile: "fixture/exam.js", sourceOrdinal: 2, sourceFingerprint: full(heldQuestion),
    contentFingerprint: body(heldQuestion), reviewStatus: "manual_review", metadataStatus: "approved_partial_with_explicit_holds",
    fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" } };
  put(META, { records: [before, hold], counts: {} }); put(IDENTITY, { records: [structuredClone(before), structuredClone(hold)] });
  put(`${CANON}/registry_index.json`, { activePacks: [{ id: "MIDDLE_GEOMETRY", version: "1.0.0", status: "ACTIVE" }], activeConceptShards: [],
    conditionRegistry: { id: "CONDITION_CORE", version: "1", status: "ACTIVE" }, canonicalSources: [],
    compiledArtifacts: ["aliases", "concept_registry", "condition_registry", "curriculum_bindings", "taxonomy_registry", "meta_foundation_compiled"].map(n => ({ path: `archive/data/meta-foundation/compiled/${n}.json` })) });
  put(`${CANON}/condition_registry.json`, { schemaVersion: "meta-foundation-condition-registry-v1", owner: "CONDITION_CORE", conditions: [], conditionCount: 0 });
  put(`${PACK}/pack.json`, { schemaVersion: "meta-foundation-pack-v1", packId: "MIDDLE_GEOMETRY", packVersion: "1.0.0", canonicalStatus: "ACTIVE", curricula: ["2015"], standardCourses: ["중2 수학", "M2-2"] });
  put(`${PACK}/taxonomy.json`, { status: "ACTIVE", problemTypes: [{ problemTypeKey: values.problemTypeKey, canonicalLabelKo: "삼각형의 무게중심",
    definition: "중선의 교점과 비를 이용한다.", status: "ACTIVE", ownerPack: "MIDDLE_GEOMETRY", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }],
    templates: [{ templateKey: values.templateKey, parentProblemTypeKey: values.problemTypeKey, canonicalLabelKo: "무게중심의 활용",
      definition: "무게중심의 비를 도형의 넓이에 적용한다.", status: "ACTIVE", ownerPack: "MIDDLE_GEOMETRY", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }] });
  put(`${PACK}/bindings.json`, { status: "ACTIVE", bindings: [{ curriculum: "2015", standardCourse: "중2 수학", standardUnitKey: values.standardUnitKey,
    subUnitKey: values.subUnitKey, problemTypeKey: values.problemTypeKey, status: "ACTIVE" }] });
  put(`${PACK}/aliases.json`, { aliases: [] });
  put("archive/data/master_tables/js_archive_tag_master.json", [{ key: values.standardUnitKey, keyType: "standardUnitKey", labelKo: values.standardUnit, status: "active" },
    { key: values.subUnitKey, keyType: "subUnitKey", parentKey: values.standardUnitKey, standardUnitKey: values.standardUnitKey, labelKo: values.subUnit, status: "active" }]);
  fs.mkdirSync(path.join(root, "archive/data/meta-foundation/runtime"), { recursive: true });
  put(MASTER, { records: [{ curriculum: "2015", scope: "M2-2", majorUnit: rpmPath.majorUnit, midUnit: rpmPath.midUnit,
    concepts: [{ concept: rpmPath.l3, problemTypes: [{ problemType: rpmPath.l4 }] }] }] });
  put(CROSS, { status: "ACTIVE_REFERENCE", records: [{ id: "M2-RPM-100", curriculum: "2015", scope: "M2-2", rpmPath,
    standardUnitKey: "M2-06", subUnitKey: "", mappingStatus: "DIRECT_BINDING_GAP", bindingStatus: "MISSING",
    problemTypeKey: values.problemTypeKey, templateKey: values.templateKey, ownerPack: "MIDDLE_GEOMETRY" }] });
  put("docs/native-review.json", {}); const baseSha = commit();
  const review = { schemaVersion: "m2-s2-meta-review-v1", sourceArchiveFile: "fixture/exam.js", sourceGitBlobSha: blob(sourceBytes),
    baseSha, owner: "native-metadata-reviewer", reviewedQuestionCount: 2, items: [{ sourceOrdinal: 1, questionUid: "uid1", verdict: "REGISTRATION_PENDING",
      rpmDecision: "CORRECT", rpmRecordId: "M2-RPM-100", decisiveStep: "길이비의 제곱을 넓이비로 바꾼다.", after: structuredClone(values),
      fieldReview: { classification: "원 RPM 무게중심 경로 확인", binding: "ACTIVE 주유형과 풀이 구조 확인", difficulty: "비례와 넓이의 두 단계 확인" },
      registrationDebt: ["RESOLVER_PROOF_PENDING"], contentDebt: [] }, { sourceOrdinal: 2, questionUid: "uid2", rpmDecision: "UNRESOLVED", after: {} }] };
  const after = { ...structuredClone(values), sourceFingerprint: full(q), contentFingerprint: body(q),
    L1: rpmPath.majorUnit, L2: rpmPath.midUnit, L3: "삼각형의 무게중심", L4: "무게중심의 활용" };
  const item = { questionUid: "uid1", sourceOrdinal: 1, before: Object.fromEntries(Object.keys(after).map(k => [k, before[k] ?? null])),
    identityBefore: { sourceFingerprint: before.sourceFingerprint }, after, reason: "원검토의 명시 RPM 부모를 정확히 운반한다." };
  const request = { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", scope: "PARTIAL_UIDS", requestId: "native-parent-fixture",
    examUid: "fixture-exam", sourceArchiveFile: "fixture/exam.js", expectedSourceBlobSha1: blob(sourceBytes), expectedQuestionCount: 2,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "immutable native metadata reviewer" }, items: [item] };
  const refreshRefs = () => {
    const refs = [ref("docs/native-review.json"), ref(MASTER), ref(CROSS)]; request.approval.evidenceRefs = refs; item.evidenceRefs = refs;
    item.sourceReview.reviewRef = refs[0];
    Object.assign(item.targetParentRef, refs[1]);
    Object.assign(item.targetParentRef.nativeSourceReview, { reviewCommit: item.sourceReview.reviewCommit, reviewPath: item.sourceReview.reviewPath, reviewRef: refs[0],
      crosswalkRef: { ...refs[2], recordId: "M2-RPM-100" } });
  };
  const updateReview = () => { put("docs/native-review.json", review); const reviewCommit = commit();
    item.sourceReview = { schemaVersion: "archive-reviewed-source-reassessment-v1", reviewCommit, reviewPath: "docs/native-review.json", reviewRef: ref("docs/native-review.json") };
    item.targetParentRef = { ...ref(MASTER), curriculum: "2015", scope: "M2-2", majorUnit: rpmPath.majorUnit, midUnit: rpmPath.midUnit,
      nativeSourceReview: { schemaVersion: "archive-native-reviewed-parent-v1", questionUid: "uid1", sourceOrdinal: 1 } };
    refreshRefs(); };
  updateReview();
  return { root, raw, read, put, ref, git, q, hold, before, request, item, review, updateReview, refreshRefs, writeBank, sourcePath,
    receiptPath: `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json` };
}

test("explicit native parent carries a reviewed RPM parent across a legacy unit gap without changing shared authority", t => {
  const f = fixture(t), before = new Map([META, IDENTITY, f.sourcePath, CROSS, MASTER, `${PACK}/bindings.json`, `${PACK}/taxonomy.json`].map(p => [p, f.raw(p)]));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).status, "PASS");
  for (const [p, bytes] of before) assert.deepEqual(f.raw(p), bytes);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  const receipt = f.read(f.receiptPath); assert.equal(receipt.nativeParentBindings.length, 1);
  assert.equal(receipt.nativeParentBindings[0].crosswalkRef.recordId, "M2-RPM-100");
  assert.equal(receipt.nativeParentBindings[0].sharedCrosswalkModified, false);
  assert.equal(receipt.appliedRecords[0].standardUnitKey, "M2-05");
  assert.equal(receipt.appliedRecords[0].L2, "삼각형의 무게중심");
  assert.equal(receipt.runtimeRecords[0].L2, "삼각형의 무게중심");
  for (const p of [META, IDENTITY]) assert.deepEqual(f.read(p).records[1], f.hold);
  for (const p of [f.sourcePath, CROSS, MASTER, `${PACK}/bindings.json`, `${PACK}/taxonomy.json`]) assert.deepEqual(f.raw(p), before.get(p));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
});

test("missing opt-in keeps the pre-existing canonical target refusal", t => {
  const f = fixture(t); delete f.item.targetParentRef.nativeSourceReview;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /canonical target parent mismatch/);
});

test("native parent rejects ambiguous or weakened review, scope and current ACTIVE authority", async t => {
  const cases = [
    ["unsupported native schema", f => { f.review.schemaVersion = "m2-s1-meta-review-v1"; f.updateReview(); }, /native reviewed parent:/],
    ["wrong review commit", f => { f.item.targetParentRef.nativeSourceReview.reviewCommit = "a".repeat(40); }, /native reviewed parent:/],
    ["wrong UID", f => { f.item.targetParentRef.nativeSourceReview.questionUid = "uid2"; }, /native reviewed parent:/],
    ["wrong ordinal", f => { f.item.targetParentRef.nativeSourceReview.sourceOrdinal = 2; }, /native reviewed parent:/],
    ["missing binding judgment", f => { delete f.review.items[0].fieldReview.binding; f.updateReview(); }, /native reviewed parent:/],
    ["unreviewed parent fallback", f => { delete f.review.items[0].after.rpmPrimaryPath; f.updateReview(); }, /native reviewed parent:/],
    ["retained but not explicit PT", f => { delete f.review.items[0].after.problemTypeKey; f.updateReview(); }, /native reviewed parent:|source reassessment:/],
    ["parent scope changed", f => { f.item.targetParentRef.scope = "M2-1"; }, /native reviewed parent:/],
    ["parent curriculum changed", f => { f.item.targetParentRef.curriculum = "2022"; }, /native reviewed parent:/],
    ["wrong parent", f => { f.item.targetParentRef.midUnit = "다른 부모"; }, /native reviewed parent:/],
    ["master leaf missing", f => { const d = f.read(MASTER); d.records[0].concepts[0].problemTypes = []; f.put(MASTER, d); f.refreshRefs(); }, /native reviewed parent:/],
    ["unselectable master leaf", f => { const d = f.read(MASTER); d.records[0].concepts[0].problemTypes[0].defaultSelectable = false; f.put(MASTER, d); f.refreshRefs(); }, /native reviewed parent:/],
    ["wrong crosswalk record", f => { f.item.targetParentRef.nativeSourceReview.crosswalkRef.recordId = "M2-RPM-099"; }, /native reviewed parent:/],
    ["crosswalk PT drift", f => { const d = f.read(CROSS); d.records[0].problemTypeKey = "PT_OTHER"; f.put(CROSS, d); f.refreshRefs(); }, /native reviewed parent:/],
    ["crosswalk scope drift", f => { const d = f.read(CROSS); d.records[0].scope = "M2-1"; f.put(CROSS, d); f.refreshRefs(); }, /native reviewed parent:/],
    ["pretend the old gap is active", f => { const d = f.read(CROSS); d.records[0].bindingStatus = "ACTIVE"; f.put(CROSS, d); f.refreshRefs(); }, /native reviewed parent:/],
    ["current binding not active", f => { const d = f.read(`${PACK}/bindings.json`); d.bindings[0].status = "HOLD"; f.put(`${PACK}/bindings.json`, d); }, /binding missing|invalid binding|ACTIVE/],
    ["conflicting explicit binding parent", f => { const d = f.read(`${PACK}/bindings.json`); d.bindings[0].L2 = "다른 부모"; f.put(`${PACK}/bindings.json`, d); }, /native reviewed parent:/],
    ["missing owner scope alias", f => { const d = f.read(`${PACK}/pack.json`); d.standardCourses = ["중2 수학"]; f.put(`${PACK}/pack.json`, d); }, /curriculum\/course aliases|ownerPack scope/],
    ["wrong active template parent", f => { const d = f.read(`${PACK}/taxonomy.json`); d.templates[0].parentProblemTypeKey = "PT_OTHER"; f.put(`${PACK}/taxonomy.json`, d); }, /parent|PT_OTHER/],
    ["registry mutation in the same request", f => { const b = f.read(`${PACK}/bindings.json`).bindings[0]; f.request.registryChanges = [{ path: `${PACK}/bindings.json`, collection: "bindings", match: { problemTypeKey: b.problemTypeKey }, before: b, after: b, evidenceRefs: f.item.evidenceRefs }]; }, /native reviewed parent:/],
    ["current protected text drift", f => { f.q.content += " 새로운 조건"; const b = f.writeBank(); f.request.expectedSourceBlobSha1 = blob(b); f.item.after.sourceFingerprint = full(f.q); f.item.after.contentFingerprint = body(f.q); }, /current student payload differs/],
  ];
  for (const [name, mutate, error] of cases) await t.test(name, t => { const f = fixture(t); mutate(f);
    const before = f.raw(META); assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), error);
    assert.deepEqual(f.raw(META), before); assert.equal(fs.existsSync(path.join(f.root, f.receiptPath)), false); });
});

test("native parent replay revalidates the proof and cannot erase or change its receipt witness", async t => {
  for (const [name, mutate] of [
    ["parent proof removed", f => { const r = f.read(f.receiptPath); delete r.nativeParentBindings; f.put(f.receiptPath, r); }],
    ["parent proof changed", f => { const r = f.read(f.receiptPath); r.nativeParentBindings[0].parent.L2 = "다른 부모"; f.put(f.receiptPath, r); }],
    ["source review proof removed", f => { const r = f.read(f.receiptPath); delete r.fingerprintRepairs[0].sourceReview; f.put(f.receiptPath, r); }],
    ["native local bytes changed", f => { const r = f.read("docs/native-review.json"); r.owner = "local forgery"; f.put("docs/native-review.json", r); }],
    ["current binding parent changed", f => { const b = f.read(`${PACK}/bindings.json`); b.bindings[0].L2 = "다른 부모"; f.put(`${PACK}/bindings.json`, b); }],
  ]) await t.test(name, t => { const f = fixture(t); registerReviewedExamV2({ root: f.root, request: f.request, write: true }); mutate(f);
    assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native parent|native reviewed parent:|evidence missing\/drift|reviewed source binding:|registered source-review binding/); });
});
