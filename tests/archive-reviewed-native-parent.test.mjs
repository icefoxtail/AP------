import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { registerReviewedExamV2 } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";
import { loadBank, planQuestion } from "../archive/tools/meta-foundation/auto-register-merged-source.mjs";
import { loadActiveMetaRegistry, validateActiveMetaFields } from "../archive/tools/meta-foundation/active-registry.mjs";
import { validateNativeReviewedSourceReuse } from "../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs";
import { loadCanonical, buildCompiled, compiledOutputs, buildRegistryIndex } from "../archive/tools/meta-foundation/compile-meta-foundation.mjs";

const META = "archive/data/question_metadata.json", IDENTITY = "archive/data/question_identity_map.json";
const CANON = "archive/data/meta-foundation/canonical", PACK = `${CANON}/packs/middle-geometry`;
const MASTER = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
const CROSS = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json";
const hash = b => crypto.createHash("sha256").update(b).digest("hex");
const blob = b => crypto.createHash("sha1").update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest("hex");
const full = q => hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
const body = q => hash(JSON.stringify({ content: q.content, choices: q.choices, image: q.image }));

function fixture(t, { family = false, courseTransport = false } = {}) {
  family = family || courseTransport;
  const sourceArchiveFile = courseTransport ? "original/middle/m2/2mid/family-scope.js" : "fixture/exam.js";
  const sourcePath = "archive/exams/" + sourceArchiveFile;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-native-parent-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const raw = p => fs.readFileSync(path.join(root, p));
  const read = p => JSON.parse(raw(p));
  const put = (p, v) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true });
    fs.writeFileSync(path.join(root, p), typeof v === "string" ? v : JSON.stringify(v, null, 2) + "\n"); };
  const ref = p => ({ path: p, sha256: hash(raw(p)) });
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  git("init", "-q");
  const commit = () => { git("add", "--", sourcePath, "docs/native-review.json", ...(family ? [CROSS] : []));
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
  if (courseTransport) delete q.courseKey;
  const heldQuestion = { ...q, id: 2, questionUid: "uid2", content: "범위 밖 보류 문항" };
  const writeBank = () => { const bytes = `window.questionBank = ${JSON.stringify([q, heldQuestion])};\n`; put(sourcePath, bytes); return bytes; };
  const sourceBytes = writeBank(), old = { ...q, solution: "이전 검토 판본" };
  const before = { questionUid: "uid1", sourceArchiveFile, sourceOrdinal: 1, sourceFingerprint: full(old), contentFingerprint: body(old),
    standardCourse: values.standardCourse, standardUnitKey: values.standardUnitKey, subUnitKey: values.subUnitKey,
    reviewStatus: "review_required", metadataStatus: "registration_pending_semantic_review" };
  const hold = { questionUid: "uid2", sourceArchiveFile, sourceOrdinal: 2, sourceFingerprint: full(heldQuestion),
    contentFingerprint: body(heldQuestion), reviewStatus: "manual_review", metadataStatus: "approved_partial_with_explicit_holds",
    fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" } };
  put(META, { records: [before, hold], counts: {} }); put(IDENTITY, { records: [structuredClone(before), structuredClone(hold)] });
  put(`${CANON}/registry_index.json`, { activePacks: [{ id: "MIDDLE_GEOMETRY", version: "1.0.0", status: "ACTIVE" }], activeConceptShards: [],
    conditionRegistry: { id: "CONDITION_CORE", version: "1", status: "ACTIVE" }, canonicalSources: [],
    compiledArtifacts: ["aliases", "concept_registry", "condition_registry", "curriculum_bindings", "taxonomy_registry", "meta_foundation_compiled"].map(n => ({ path: `archive/data/meta-foundation/compiled/${n}.json` })) });
  put(`${CANON}/condition_registry.json`, { schemaVersion: "meta-foundation-condition-registry-v1", owner: "CONDITION_CORE", conditions: [], conditionCount: 0 });
  put(`${PACK}/pack.json`, { schemaVersion: "meta-foundation-pack-v1", packId: "MIDDLE_GEOMETRY", packVersion: "1.0.0", canonicalStatus: "ACTIVE", curricula: ["2015"], standardCourses: ["중2 수학", "M2-2"], ...(courseTransport ? {ownedStandardUnitDomains: [values.standardUnitKey]} : {}) });
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
    ...(family ? {standardUnitKey: values.standardUnitKey, subUnitKey: values.subUnitKey, mappingStatus: "FAMILY_ACTIVE", bindingStatus: "ACTIVE",
      templateCandidates: [{templateKey: "TPL_UNRELATED_CANDIDATE"}]} :
      {standardUnitKey: "M2-06", subUnitKey: "", mappingStatus: "DIRECT_BINDING_GAP", bindingStatus: "MISSING", templateKey: values.templateKey}),
    problemTypeKey: values.problemTypeKey, ownerPack: "MIDDLE_GEOMETRY" }] });
  put("docs/native-review.json", {}); const baseSha = commit();
  const review = { schemaVersion: "m2-s2-meta-review-v1", sourceArchiveFile, sourceGitBlobSha: blob(sourceBytes),
    baseSha, owner: "native-metadata-reviewer", reviewedQuestionCount: 2, items: [{ sourceOrdinal: 1, questionUid: "uid1", verdict: "REGISTRATION_PENDING",
      rpmDecision: "CORRECT", rpmRecordId: "M2-RPM-100", decisiveStep: "길이비의 제곱을 넓이비로 바꾼다.", after: structuredClone(values),
      fieldReview: { classification: "원 RPM 무게중심 경로 확인", binding: "ACTIVE 주유형과 풀이 구조 확인", difficulty: "비례와 넓이의 두 단계 확인" },
      registrationDebt: ["RESOLVER_PROOF_PENDING"], contentDebt: [] }, { sourceOrdinal: 2, questionUid: "uid2", rpmDecision: "UNRESOLVED", after: {} }] };
  if (courseTransport) delete review.items[0].after.courseKey;
  const after = { ...structuredClone(values), sourceFingerprint: full(q), contentFingerprint: body(q),
    L1: rpmPath.majorUnit, L2: rpmPath.midUnit, L3: "삼각형의 무게중심", L4: "무게중심의 활용" };
  const item = { questionUid: "uid1", sourceOrdinal: 1, before: Object.fromEntries(Object.keys(after).map(k => [k, before[k] ?? null])),
    identityBefore: { sourceFingerprint: before.sourceFingerprint }, after, reason: "원검토의 명시 RPM 부모를 정확히 운반한다." };
  const request = { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", scope: "PARTIAL_UIDS", requestId: "native-parent-fixture",
    examUid: "fixture-exam", sourceArchiveFile, expectedSourceBlobSha1: blob(sourceBytes), expectedQuestionCount: 2,
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
      nativeSourceReview: { schemaVersion: "archive-native-reviewed-parent-v1", questionUid: "uid1", sourceOrdinal: 1,
        ...(family ? {crosswalkProfile: "ACTIVE_FAMILY_EXPLICIT_NATIVE_AFTER"} : {}),
        ...(courseTransport ? {courseTransport: {schemaVersion: "archive-native-family-course-transport-v1", field: "courseKey"}} : {}) } };
    refreshRefs(); };
  updateReview();
  return { root, raw, read, put, ref, git, q, hold, before, request, item, review, updateReview, refreshRefs, writeBank, sourcePath,
    receiptPath: `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${request.requestId}.json` };
}

function familyRationaleReuseFixture(t, { family = true } = {}) {
  const f = fixture(t, { family });
  f.review.items[0].primaryMethod = "길이비에서 넓이비를 계산한다.";
  for (const field of ["primaryMethod", "decisiveStep"]) {
    f.item.before[field] = null;
    f.item.after[field] = f.review.items[0][field];
  }
  f.updateReview();
  for (const name of [META, IDENTITY]) {
    const doc = f.read(name);
    for (const row of doc.records) row.sourceQuestionNo = String(row.sourceOrdinal);
    f.put(name, doc);
  }
  f.put(`${CANON}/metadata_rules.json`, { status: "ACTIVE", integrationPatterns: ["NONE"] });
  f.put(`${CANON}/condition_registry.json`, { ...f.read(`${CANON}/condition_registry.json`), status: "ACTIVE" });
  const index = f.read(`${CANON}/registry_index.json`);
  index.status = "ACTIVE";
  index.canonicalSources = ["metadata_rules.json", "condition_registry.json", ...["pack", "taxonomy", "bindings", "aliases"].map(name => `packs/middle-geometry/${name}.json`)].map(name => ({ path: `${CANON}/${name}` }));
  f.put(`${CANON}/registry_index.json`, index);
  const canonical = loadCanonical(f.read), outputs = compiledOutputs(canonical, buildCompiled(canonical));
  for (const [p, bytes] of outputs) f.put(p, bytes);
  f.put(`${CANON}/registry_index.json`, buildRegistryIndex(canonical, outputs, p => f.raw(p).toString()));
  assert.equal(loadActiveMetaRegistry(f.root).status, "ACTIVE");
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const previous = { ...structuredClone(f.q), difficultyBucket: 2, difficultyConfidence: "medium" };
  const nativeContext = () => {
    const bytes = f.raw(f.sourcePath), bank = loadBank(bytes.toString()), question = bank[0];
    const current = f.read(META).records[0], identityMap = f.read(IDENTITY), identity = identityMap.records[0];
    const runtime = f.read("archive/data/meta-foundation/runtime/middle-geometry-v1.json");
    const registry = loadActiveMetaRegistry(f.root);
    return { question, current, identity, registry,
      validate: validateActiveMetaFields, source: f.request.sourceArchiveFile, ordinal: 1, runtimeOwner: runtime.packId,
      nativeSource: { root: f.root, bytes, blobSha1: blob(bytes), bank, identityMap,
        identityByJoin: new Map(identityMap.records.map(row => [row.sourceArchiveFile + "#" + row.sourceOrdinal, row])),
        runtimeRecord: runtime.records[0], runtimeStatus: runtime.status } };
  };
  const run = (old = previous) => planQuestion({ ...nativeContext(), previous: old });
  const revalidate = () => { const c = nativeContext();
    return validateNativeReviewedSourceReuse(f.read(f.receiptPath), c.nativeSource, c.question, c.identity, 1, c.current, c.registry); };
  return { ...f, previous, run, revalidate };
}

test("family native reuse verifies the issued rationale when only the earlier difficulty metadata differs", t => {
  const f = familyRationaleReuseFixture(t);
  const before = new Map([META, IDENTITY, f.sourcePath, f.receiptPath].map(p => [p, f.raw(p)]));
  assert.equal(Object.hasOwn(f.q, "primaryMethod"), false);
  assert.equal(Object.hasOwn(f.q, "decisiveStep"), false);
  assert.equal(f.revalidate(), true);
  for (const previous of [f.previous, f.q]) {
    const result = f.run(previous);
    assert.equal(result.status, "ALREADY_REGISTERED", JSON.stringify(result));
    assert.equal(result.nativeReviewReceipt, f.receiptPath);
  }
  for (const [p, bytes] of before) assert.deepEqual(f.raw(p), bytes);
});

test("family rationale reuse does not waive the ordinary native source rationale requirement", t => {
  const f = familyRationaleReuseFixture(t, { family: false });
  assert.equal(f.run().status, "SUPPLEMENT_PENDING");
  const caughtUp = f.run(f.q);
  assert.equal(caughtUp.nativeReviewReceipt, f.receiptPath, JSON.stringify(caughtUp));
});

test("family rationale reuse rejects changed student or other metadata fields and missing issued authority", async t => {
  const cases = [
    ["previous student content", f => { f.previous.content += " extra"; }],
    ["previous template", f => { f.previous.templateKey = "TPL_OTHER"; }],
    ["previous status", f => { f.previous.metadataStatus = "unreviewed"; }],
    ["explicit null source rationale", f => { f.q.primaryMethod = null; f.writeBank(); }],
    ["partial source rationale", f => { f.q.primaryMethod = f.review.items[0].primaryMethod; f.writeBank(); }],
    ["metadata rationale changed", f => { const d = f.read(META); d.records[0].primaryMethod += " changed"; f.put(META, d); }],
    ["parent proof removed", f => { const d = f.read(f.receiptPath); delete d.nativeParentBindings; f.put(f.receiptPath, d); }],
    ["source review proof removed", f => { const d = f.read(f.receiptPath); delete d.fingerprintRepairs[0].sourceReview; f.put(f.receiptPath, d); }],
    ["rationale proof forged", f => { const d = f.read(f.receiptPath); d.fingerprintRepairs[0].sourceReview.rationaleBindings.primaryMethod.valueSha256 = "0".repeat(64); f.put(f.receiptPath, d); }],
    ["native evidence changed", f => { const d = f.read("docs/native-review.json"); d.items[0].primaryMethod += " changed"; f.put("docs/native-review.json", d); }],
    ["source-review sidecar missing", f => { fs.unlinkSync(path.join(f.root, f.receiptPath.replace(/\.json$/, ".source-review-binding.json"))); }],
    ["current ACTIVE template changed", f => { const d = f.read(`${PACK}/taxonomy.json`); d.templates[0].status = "HOLD"; f.put(`${PACK}/taxonomy.json`, d); }],
  ];
  for (const [name, mutate] of cases) await t.test(name, t => {
    const f = familyRationaleReuseFixture(t); mutate(f);
    const before = new Map([META, IDENTITY, f.sourcePath].map(p => [p, f.raw(p)]));
    const result = f.run();
    assert.equal(result.status, "SUPPLEMENT_PENDING");
    assert.equal(result.nativeReviewReceipt, undefined);
    for (const [p, bytes] of before) assert.deepEqual(f.raw(p), bytes);
  });
});

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

test("explicit ACTIVE family profile preserves native after primary and carries only its exact parent", t => {
  const f = fixture(t, {family:true});
  const before = new Map([f.sourcePath,CROSS,MASTER,`${PACK}/taxonomy.json`,`${PACK}/bindings.json`].map(p=>[p,f.raw(p)]));
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).status,"PASS");
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,"PASS");
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);
  const issued=f.read(f.receiptPath), proof=issued.nativeParentBindings[0];
  assert.equal(proof.crosswalkProfile,"ACTIVE_FAMILY_EXPLICIT_NATIVE_AFTER");
  assert.equal(proof.primaryAuthority,"EXPLICIT_NATIVE_AFTER");
  assert.equal(proof.templateCandidatesUsedAsApproval,false);
  assert.equal(issued.appliedRecords[0].templateKey,f.review.items[0].after.templateKey);
  assert(!f.read(CROSS).records[0].templateCandidates.some(r=>r.templateKey===issued.appliedRecords[0].templateKey));
  for(const[p,raw]of before)assert.deepEqual(f.raw(p),raw);
  for(const p of [META,IDENTITY])assert.deepEqual(f.read(p).records[1],f.hold);
});

test("ACTIVE family profile cannot weaken default, native after, original RPM or current parent checks", async t => {
  for(const[name,mutate,error]of[
    ["profile deleted",f=>{delete f.item.targetParentRef.nativeSourceReview.crosswalkProfile;},/native reviewed parent:/],
    ["unknown profile",f=>{f.item.targetParentRef.nativeSourceReview.crosswalkProfile="GUESS_FROM_FAMILY";},/native reviewed parent:/],
    ["missing explicit template",f=>{delete f.review.items[0].after.templateKey;f.updateReview();},/native reviewed parent:|source reassessment:/],
    ["missing explicit curriculum",f=>{delete f.review.items[0].after.curriculum;f.updateReview();},/native reviewed parent:|source reassessment:/],
    ["missing explicit RPM path",f=>{delete f.review.items[0].after.rpmPrimaryPath;f.updateReview();},/native reviewed parent:|source reassessment:/],
    ["ordinary crosswalk template fallback",f=>{const d=f.read(CROSS);d.records[0].templateKey=f.item.after.templateKey;f.put(CROSS,d);f.refreshRefs();},/native reviewed parent:/],
    ["explicit null crosswalk template",f=>{const d=f.read(CROSS);d.records[0].templateKey=null;f.put(CROSS,d);f.refreshRefs();},/native reviewed parent:/],
    ["nonactive family",f=>{const d=f.read(CROSS);d.records[0].bindingStatus="MISSING";f.put(CROSS,d);f.refreshRefs();},/native reviewed parent:/],
    ["different family unit",f=>{const d=f.read(CROSS);d.records[0].standardUnitKey="M2-06";f.put(CROSS,d);f.refreshRefs();},/native reviewed parent:/],
    ["same selected record but rehashed crosswalk",f=>{const d=f.read(CROSS);d.unapprovedExtra="changed";f.put(CROSS,d);f.refreshRefs();},/native family crosswalk differs/],
    ["candidate chosen instead of native after",f=>{f.item.after.templateKey="TPL_UNRELATED_CANDIDATE";},/template|native|source reassessment:/],
    ["different active binding parent",f=>{const d=f.read(`${PACK}/bindings.json`);d.bindings[0].L2="other";f.put(`${PACK}/bindings.json`,d);},/native reviewed parent:/],
    ["missing master leaf",f=>{const d=f.read(MASTER);d.records[0].concepts[0].problemTypes=[];f.put(MASTER,d);f.refreshRefs();},/native reviewed parent:/],
    ["missing allowed semester",f=>{const d=f.read(`${PACK}/pack.json`);d.standardCourses=["중2 수학"];f.put(`${PACK}/pack.json`,d);},/scope|course/],
  ])await t.test(name,t=>{
    const f=fixture(t,{family:true});mutate(f);const before=f.raw(META);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),error);
    assert.deepEqual(f.raw(META),before);assert.equal(fs.existsSync(path.join(f.root,f.receiptPath)),false);
  });
});

test("ACTIVE family issued parent profile remains required on replay",async t=>{
  for(const[name,mutate]of[
    ["profile proof erased",f=>{const d=f.read(f.receiptPath);delete d.nativeParentBindings[0].crosswalkProfile;f.put(f.receiptPath,d);}],
    ["source review proof erased",f=>{const d=f.read(f.receiptPath);delete d.fingerprintRepairs[0].sourceReview;f.put(f.receiptPath,d);}],
    ["original crosswalk changed",f=>{const d=f.read(CROSS);d.records[0].mappingStatus="DIRECT_BOUND";f.put(CROSS,d);}],
  ])await t.test(name,t=>{const f=fixture(t,{family:true});registerReviewedExamV2({root:f.root,request:f.request,write:true});mutate(f);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request}),/parent|binding|evidence|source review/);});
});

test("missing course opt-in joins only explicit native after and immutable family scope, with exact absence replay", t => {
  const f=fixture(t,{courseTransport:true}), source=f.raw(f.sourcePath), before=f.raw(META);
  const missing=structuredClone(f.request);delete missing.items[0].targetParentRef.nativeSourceReview.courseTransport;
  assert.throws(()=>registerReviewedExamV2({root:f.root,request:missing}),/changed value not approved by native review: courseKey/);
  assert.deepEqual(f.raw(META),before);
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).status,"PASS");
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request,write:true}).status,"PASS");
  assert.equal(registerReviewedExamV2({root:f.root,request:f.request}).replay,true);
  const receipt=f.read(f.receiptPath),proof=receipt.fingerprintRepairs[0].sourceReview.nativeFamilyCourseTransport;
  assert.deepEqual(proof.transportedFields,["courseKey"]);
  assert.equal(proof.independentPrimaryAuthorityUsed,false);
  assert.equal(proof.inferredFromYearOrFilename,false);
  assert.deepEqual(proof.metadataBeforeScopePresence.courseKey,{present:false});
  assert.equal(receipt.appliedRecords[0].courseKey,"M2-2");
  assert.deepEqual(f.raw(f.sourcePath),source);
  for(const p of [META,IDENTITY])assert.deepEqual(f.read(p).records[1],f.hold);
});

test("single native family course cannot infer, override explicit scope or borrow retained approval",async t=>{
  for(const[name,mutate]of[
    ["unknown course schema",f=>{f.item.targetParentRef.nativeSourceReview.courseTransport.schemaVersion="unknown";}],
    ["extra transported field",f=>{f.item.targetParentRef.nativeSourceReview.courseTransport.fields=["courseKey","curriculum"];}],
    ["wrong transported field",f=>{f.item.targetParentRef.nativeSourceReview.courseTransport.field="curriculum";}],
    ["missing explicit curriculum",f=>{delete f.review.items[0].after.curriculum;f.updateReview();}],
    ["missing explicit template",f=>{delete f.review.items[0].after.templateKey;f.updateReview();}],
    ["native after already names course",f=>{f.review.items[0].after.courseKey="M2-2";f.updateReview();}],
    ["current source explicit null course",f=>{f.q.courseKey=null;f.request.expectedSourceBlobSha1=blob(f.writeBank());}],
    ["current source another semester",f=>{f.q.courseKey="M2-1";f.request.expectedSourceBlobSha1=blob(f.writeBank());}],
    ["current source explicit null curriculum",f=>{f.q.curriculum=null;f.request.expectedSourceBlobSha1=blob(f.writeBank());}],
    ["metadata explicit null course",f=>{const d=f.read(META);d.records[0].courseKey=null;f.put(META,d);}],
    ["metadata existing same course",f=>{const d=f.read(META);d.records[0].courseKey="M2-2";f.item.before.courseKey="M2-2";f.put(META,d);}],
    ["metadata another semester",f=>{const d=f.read(META);d.records[0].courseKey="M2-1";f.item.before.courseKey="M2-1";f.put(META,d);}],
    ["metadata explicit null curriculum",f=>{const d=f.read(META);d.records[0].curriculum=null;f.put(META,d);}],
    ["metadata competing curriculum",f=>{const d=f.read(META);d.records[0].curriculum="2022";f.item.before.curriculum="2022";f.put(META,d);}],
    ["missing original scope before",f=>{delete f.item.before.curriculumKey;}],
    ["requested wrong course",f=>{f.item.after.courseKey="M2-1";}],
    ["current pack missing scope domain",f=>{const d=f.read(`${PACK}/pack.json`);delete d.ownedStandardUnitDomains;f.put(`${PACK}/pack.json`,d);}],
    ["original RPM different semester",f=>{const d=f.read(CROSS);d.records[0].scope="M2-1";f.put(CROSS,d);f.updateReview();}],
    ["borrowed retained-primary authority",f=>{f.item.sourceReview.retainedFields={schemaVersion:"archive-reviewed-native-retained-fields-v1",fields:[]};}],
  ])await t.test(name,t=>{const f=fixture(t,{courseTransport:true});mutate(f);const raw=f.raw(META);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request,write:true}),/native reviewed parent:|source reassessment:|before required: uid1\.curriculumKey|native retained fields: explicit supported field selection required/);
    assert.deepEqual(f.raw(META),raw);assert(!fs.existsSync(path.join(f.root,f.receiptPath)));
  });
});

test("native family course issued proof cannot remove or forge original absence on replay",async t=>{
  for(const[name,mutate]of[
    ["course proof deleted",r=>{delete r.fingerprintRepairs[0].sourceReview.nativeFamilyCourseTransport;}],
    ["course presence false-to-true",r=>{r.fingerprintRepairs[0].sourceReview.nativeFamilyCourseTransport.metadataBeforeScopePresence.courseKey={present:true,valueSha256:hash(JSON.stringify("M2-2"))};}],
    ["curriculum presence removed",r=>{delete r.fingerprintRepairs[0].sourceReview.nativeFamilyCourseTransport.metadataBeforeScopePresence.curriculum;}],
    ["wrong native course authority",r=>{r.fingerprintRepairs[0].sourceReview.nativeFamilyCourseTransport.nativeParentAuthoritySha256="0".repeat(64);}],
  ])await t.test(name,t=>{const f=fixture(t,{courseTransport:true});registerReviewedExamV2({root:f.root,request:f.request,write:true});const receipt=f.read(f.receiptPath);mutate(receipt);f.put(f.receiptPath,receipt);
    assert.throws(()=>registerReviewedExamV2({root:f.root,request:f.request}),/binding|parent|source-review/);
  });
});
