import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { commitRegistrationFiles, loadResolvedConsumerCatalog, registerReviewedCanonicalMaintenanceV1, registerReviewedExamV2, verifyConsumerValues } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";

const CANON = "archive/data/meta-foundation/canonical";
const META = "archive/data/question_metadata.json";
const script = fileURLToPath(new URL("../archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs", import.meta.url));
const archive2Core = createRequire(import.meta.url)("../archive/archive2-core.js");
const problemBankMeta = createRequire(import.meta.url)("../archive/problem-bank-meta.js");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest("hex");
const j = v => JSON.stringify(v, null, 2) + "\n";

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
  put(`${CANON}/metadata_rules.json`, { schemaVersion: "meta-foundation-metadata-rules-v1", status: "ACTIVE", rules: [] });
  put("archive/data/master_tables/js_archive_tag_master.json", []);
  fs.mkdirSync(path.join(root, "archive/data/meta-foundation/runtime"), { recursive: true });
  const changes = [];
  const change = (p, collection, match, before, after) => changes.push({ path: p, ...(collection ? { collection, match } : {}), before, after, evidenceRefs });
  const base = `${CANON}/packs/new-course`;
  change(`${CANON}/registry_index.json`, "activePacks", { id: "NEW_COURSE" }, null, { id: "NEW_COURSE", version: "1.0.0", status: "ACTIVE" });
  change(`${base}/pack.json`, null, null, null, { schemaVersion: "meta-foundation-pack-v1", packId: "NEW_COURSE", packVersion: "1.0.0", canonicalStatus: "ACTIVE", curricula: [curriculum], standardCourses: [course] });
  change(`${base}/taxonomy.json`, null, null, null, { status: "ACTIVE", problemTypes: [{ problemTypeKey: "PT_NEW", canonicalLabelKo: "새 유형", definition: "검수된 유형 의미", ownerPack: "NEW_COURSE", status: "ACTIVE" }], templates: [{ templateKey: "TPL_NEW", canonicalLabelKo: "새 풀이 구조", definition: "검수된 풀이 구조", parentProblemTypeKey: "PT_NEW", status: "ACTIVE" }] });
  change(`${base}/bindings.json`, null, null, null, { status: "ACTIVE", bindings: [{ curriculum, standardCourse: course, standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW", ownerPack: "NEW_COURSE", status: "ACTIVE" }], applicabilityRules: [] });
  change(`${base}/aliases.json`, null, null, null, { aliases: [] });
  change(`${CANON}/registry_index.json`, "activeConceptShards", { id: "NEW_CONCEPTS" }, null, { id: "NEW_CONCEPTS", version: "1.0.0", status: "ACTIVE" });
  change(`${CANON}/concepts/new-concepts.json`, null, null, null, { shardId: "NEW_CONCEPTS", shardVersion: "1.0.0", concepts: [{ conceptKey: "CC_NEW", canonicalLabelKo: "새 추가 개념", definition: "추가 개념 근거", status: "ACTIVE" }] });
  change(`${CANON}/condition_registry.json`, "conditions", { conditionKey: "COND_NEW" }, null, { conditionKey: "COND_NEW", canonicalLabelKo: "새 조건", definition: "조건 근거", status: "ACTIVE" });
  for (const row of [{ key: "UNIT_NEW", keyType: "standardUnitKey", labelKo: "새 단원", status: "active" }, { key: "SUB_NEW", keyType: "subUnitKey", parentKey: "UNIT_NEW", standardUnitKey: "UNIT_NEW", labelKo: "새 세부단원", status: "active" }]) change("archive/data/master_tables/js_archive_tag_master.json", "$", { key: row.key }, null, row);
  const after = { ...Object.fromEntries(Object.entries(q).filter(([k]) => !["id", "content", "choices", "answer", "solution", "image"].includes(k))), curriculum, curriculumKey: curriculum, courseKey: course, rpmSemanticStatus: "FINAL", rpmL3: "reviewed-rpm-l3", rpmL4: "reviewed-rpm-l4" };
  const request = { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", requestId: "test-new-course", examUid: "exam1", sourceArchiveFile: source, expectedSourceBlobSha1: blob(text), expectedQuestionCount: 1,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "fixture-reviewer", evidenceRefs }, registryChanges: changes,
    items: [{ questionUid: "uid1", sourceOrdinal: 1, before: Object.fromEntries(Object.keys(after).map(k => [k, current[k] ?? null])), after, reason: "문항 사고와 승인 분류 일치", evidenceRefs }] };
  return { root, put, read, request, q, evidenceRefs, change };
}

function calculus21SyntheticFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-meta-calculus21-synthetic-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (relative, value) => {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, Buffer.isBuffer(value) ? value : typeof value === "string" ? value : j(value));
  };
  const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
  const repo = fileURLToPath(new URL("../", import.meta.url));
  const source = "original/high/h2/2mid/26_금당고_2학기_중간_고2_미적분I.js";
  const originalBytes = fs.readFileSync(path.join(repo, "archive/exams", source));
  const originalGitBlob = execFileSync("git", ["hash-object", "--path", `archive/exams/${source}`, "--stdin"],
    { cwd: repo, input: originalBytes, encoding: "utf8" }).trim();
  assert.equal(originalGitBlob, "408a9862d9b5a08e341fb9aa008a2cbdae0cee06");
  const sourceCtx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(sourceCtx);
  vm.runInContext(originalBytes.toString("utf8"), sourceCtx, { timeout: 5000 });
  const originalBank = sourceCtx.window.questionBank || sourceCtx.window.questions;
  assert.equal(originalBank.length, 21);
  const originalMetadata = JSON.parse(fs.readFileSync(path.join(repo, META), "utf8")).records
    .filter(row => row.sourceArchiveFile === source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  const originalIdentity = JSON.parse(fs.readFileSync(path.join(repo, "archive/data/question_identity_map.json"), "utf8")).records
    .filter(row => row.sourceArchiveFile === source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  assert.equal(originalMetadata.length, 21);
  assert.equal(originalIdentity.length, 21);
  const fingerprint = question => hash(JSON.stringify({ content: question.content ?? null, choices: Array.isArray(question.choices) ? question.choices : null,
    answer: question.answer ?? null, solution: question.solution ?? null, image: question.image ?? null }));
  const contentFingerprint = question => hash(JSON.stringify({ content: question.content ?? null, choices: Array.isArray(question.choices) ? question.choices : null, image: question.image ?? null }));
  const actualFingerprintByUid = new Map(originalMetadata.map((row, index) => [row.questionUid, fingerprint(originalBank[index])]));
  for (const row of originalMetadata) assert.equal(originalIdentity.find(id => id.questionUid === row.questionUid)?.sourceFingerprint, row.sourceFingerprint);

  const syntheticPack = "SYNTHETIC_CALCULUS_TEST";
  const course = originalBank[0].standardCourse;
  const bank = originalBank.map(question => structuredClone(question));
  const syntheticClassifications = bank.map((_, index) => ({
    problemTypeKey: `PT_SYNTHETIC_TEST_${String(index + 1).padStart(2, "0")}`,
    templateKey: `TPL_SYNTHETIC_TEST_${String(index + 1).padStart(2, "0")}`,
  }));
  put(`archive/exams/${source}`, originalBytes);
  put("docs/SYNTHETIC_TEST-only-approval.json", { purpose: "Synthetic infrastructure fixture only; not an exam metadata approval", sourceArchiveFile: source });
  const evidenceRefs = [{ path: "docs/SYNTHETIC_TEST-only-approval.json", sha256: hash(fs.readFileSync(path.join(root, "docs/SYNTHETIC_TEST-only-approval.json"))) }];
  const metadataRows = originalMetadata.map(row => structuredClone(row));
  const identityRows = originalIdentity.map(row => structuredClone(row));
  const parentLinks = JSON.parse(fs.readFileSync(path.join(repo, "archive/data/basic-scope-parent-links.json"), "utf8"));
  const maintenanceFixture = JSON.parse(fs.readFileSync(path.join(repo, "tests/fixtures/meta-foundation-calculus1/canonical-maintenance-request.json"), "utf8"));
  const directBindings = maintenanceFixture.registryChanges.filter(change => change.path.endsWith("/bindings.json") &&
    change.collection === "bindings" && change.after?.bindingMode === "STANDARD_UNIT_DIRECT").map(change => change.after);
  const master = JSON.parse(fs.readFileSync(path.join(repo, "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"), "utf8"));
  const sourceParentPaths = originalBank.map(question => {
    const matches = directBindings.filter(row => row.status === "ACTIVE" && row.bindingMode === "STANDARD_UNIT_DIRECT" && row.subUnitKey === null &&
      row.curriculum === "2022" && row.standardCourse === course && row.standardUnitKey === question.standardUnitKey && row.L1 && row.L2);
    const labels = new Map(matches.map(row => [`${row.L1}\u0000${row.L2}`, { L1: row.L1, L2: row.L2 }]));
    assert.equal(labels.size, 1, `exact direct-null binding parent missing/ambiguous: ${question.standardUnitKey}`);
    const parent = [...labels.values()][0];
    assert.ok(master.records.some(row => row.curriculum === "2022" && row.scope === course && row.majorUnit === parent.L1 && row.midUnit === parent.L2));
    return parent;
  });
  assert.equal(parentLinks.sourceParents.filter(row => row.sourceFile === source).length, 0,
    "fixture must exercise the direct-binding parent path without synthetic source-parent rows");
  put("archive/data/basic-scope-parent-links.json", parentLinks);
  put("archive/data/basic-scope-source-links.json", fs.readFileSync(path.join(repo, "archive/data/basic-scope-source-links.json"), "utf8"));
  const unrelated = { questionUid: "synthetic-unrelated-exam-uid", sourceArchiveFile: "original/high/h1/1mid/unrelated.js", sourceOrdinal: 1, reviewStatus: "review_required", metadataStatus: "registration_pending_semantic_review", retainedByTest: true };
  put(META, { approvalStatus: "APPROVED_SYNTHETIC_TEST_ONLY", records: [...metadataRows, unrelated], counts: { records: 22 }, sourceDigests: { completeClassification: hash(fs.readFileSync(path.join(root, "docs/SYNTHETIC_TEST-only-approval.json"))) } });
  put("archive/data/question_identity_map.json", { records: identityRows });
  put("archive/data/master_tables/js_archive_tag_master.json", fs.readFileSync(path.join(repo, "archive/data/master_tables/js_archive_tag_master.json"), "utf8"));
  put("archive/data/basic-scope-parent-groups.json", fs.readFileSync(path.join(repo, "archive/data/basic-scope-parent-groups.json"), "utf8"));
  put("archive/data/archive2-canonical-projection-policy.json", fs.readFileSync(path.join(repo, "archive/data/archive2-canonical-projection-policy.json"), "utf8"));
  put("docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json",
    fs.readFileSync(path.join(repo, "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"), "utf8"));
  put(`${CANON}/registry_index.json`, { activePacks: [], activeConceptShards: [], conditionRegistry: { id: "CONDITION_CORE", version: "1", status: "ACTIVE" }, canonicalSources: [{ path: `${CANON}/condition_registry.json` }],
    compiledArtifacts: ["aliases", "concept_registry", "condition_registry", "curriculum_bindings", "taxonomy_registry", "meta_foundation_compiled"].map(name => ({ path: `archive/data/meta-foundation/compiled/${name}.json` })) });
  put(`${CANON}/condition_registry.json`, { schemaVersion: "meta-foundation-condition-registry-v1", owner: "CONDITION_CORE", conditions: [], conditionCount: 0 });
  for (const relative of [`${CANON}/metadata_rules.json`, "archive/data/meta-foundation/compiled/taxonomy_registry.json",
    "archive/data/meta-foundation/compiled/concept_registry.json", "archive/data/meta-foundation/compiled/condition_registry.json",
    "archive/data/meta-foundation/compiled/curriculum_bindings.json"]) {
    put(relative, fs.readFileSync(path.join(repo, relative), "utf8"));
  }
  fs.mkdirSync(path.join(root, "archive/data/meta-foundation/runtime"), { recursive: true });

  const changes = [];
  const addChange = (relative, collection, match, before, after) => changes.push({ path: relative, ...(collection ? { collection, match } : {}), before, after, evidenceRefs });
  addChange(`${CANON}/registry_index.json`, "activePacks", { id: syntheticPack }, null, { id: syntheticPack, version: "1.0.0", status: "ACTIVE" });
  const base = `${CANON}/packs/synthetic-calculus-test`;
  addChange(`${base}/pack.json`, null, null, null, { schemaVersion: "meta-foundation-pack-v1", packId: syntheticPack, packVersion: "1.0.0", canonicalStatus: "ACTIVE", curricula: ["2022"], standardCourses: [course] });
  const problemTypes = bank.map((_, index) => ({ problemTypeKey: syntheticClassifications[index].problemTypeKey, canonicalLabelKo: `SYNTHETIC TEST PT ${index + 1}`, definition: "SYNTHETIC_TEST ONLY: infrastructure fixture; no semantic approval", ownerPack: syntheticPack, status: "ACTIVE" }));
  const templates = bank.map((_, index) => ({ templateKey: syntheticClassifications[index].templateKey, canonicalLabelKo: `SYNTHETIC TEST TPL ${index + 1}`, definition: "SYNTHETIC_TEST ONLY: infrastructure fixture; no semantic approval", parentProblemTypeKey: syntheticClassifications[index].problemTypeKey, status: "ACTIVE" }));
  addChange(`${base}/taxonomy.json`, null, null, null, { status: "ACTIVE", problemTypes, templates });
  addChange(`${base}/bindings.json`, null, null, null, { status: "ACTIVE", bindings: bank.map((question, index) => ({ curriculum: "2022", standardCourse: course,
    standardUnitKey: question.standardUnitKey, subUnitKey: null, problemTypeKey: syntheticClassifications[index].problemTypeKey,
    ownerPack: syntheticPack, bindingMode: "STANDARD_UNIT_DIRECT", L1: sourceParentPaths[bank.indexOf(question)].L1, L2: sourceParentPaths[bank.indexOf(question)].L2,
    curriculumApplicability: "DEFAULT_SCOPE", defaultSelectable: true, status: "ACTIVE" })) });
  addChange(`${base}/aliases.json`, null, null, null, { aliases: [] });
  const items = bank.map((question, index) => {
    const current = metadataRows[index];
    const originalIdentityRow = identityRows[index];
    const after = {
      curriculum: "2022", curriculumKey: "2022", standardCourse: course, courseKey: course,
      standardUnitKey: question.standardUnitKey, standardUnit: question.standardUnit,
      subUnitKey: null, subUnit: question.subUnit || "", level: question.level,
      problemTypeKey: syntheticClassifications[index].problemTypeKey, templateKey: syntheticClassifications[index].templateKey,
      crossConceptKeys: question.crossConceptKeys || [], conditionKeys: question.conditionKeys || [],
      integrationPattern: question.integrationPattern || "NONE", difficultyBucket: question.difficultyBucket,
      difficultyConfidence: question.difficultyConfidence || "SYNTHETIC_TEST", L1: sourceParentPaths[index].L1, L2: sourceParentPaths[index].L2,
      L3: `SYNTHETIC TEST PT ${index + 1}`, L4: `SYNTHETIC TEST TPL ${index + 1}`,
      curriculumApplicability: "DEFAULT_SCOPE", defaultSelectable: true,
    };
    if (current.sourceFingerprint !== actualFingerprintByUid.get(current.questionUid)) {
      after.sourceFingerprint = actualFingerprintByUid.get(current.questionUid);
      after.contentFingerprint = contentFingerprint(question);
    }
    return { questionUid: current.questionUid, sourceOrdinal: index + 1,
      before: Object.fromEntries(Object.keys(after).map(field => [field, current[field] ?? null])),
      after, ...(Object.hasOwn(after, "sourceFingerprint") ? { identityBefore: { sourceFingerprint: originalIdentityRow.sourceFingerprint } } : {}),
      reason: "SYNTHETIC_TEST only: registration plumbing, no semantic judgment", evidenceRefs };
  });
  const request = {
    schemaVersion: "archive-reviewed-exam-meta-register-request-v2",
    requestId: "SYNTHETIC_TEST_gumdang_calculus1_21",
    examUid: "SYNTHETIC_TEST_gumdang_calculus1",
    sourceArchiveFile: source,
    expectedSourceBlobSha1: blob(originalBytes),
    expectedQuestionCount: 21,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "SYNTHETIC_TEST_ONLY_NOT_APPROVED", evidenceRefs },
    registryChanges: changes,
    items,
  };
  const examCtx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(examCtx);
  vm.runInContext(fs.readFileSync(path.join(repo, "archive/db.js"), "utf8"), examCtx, { timeout: 5000 });
  const exam = examCtx.window.mainDB.exams.find(row => row.file === source);
  assert.ok(exam);
  put("archive/db.js", `window.mainDB = ${JSON.stringify({ exams: [exam] })};\n`);

  for (const relative of ["archive/archive2-core.js", "archive/archive2-canonical.js", "archive/mixer-selector.js", "archive/problem-bank-meta.js", "archive/tools/build-archive2-catalog.mjs", "archive/tools/build-question-index.mjs"]) {
    const full = path.join(root, relative);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, fs.readFileSync(path.join(repo, relative)));
  }
  return { root, put, read, request, source, course, unrelated, actualFingerprintByUid, originalBytes, originalGitBlob, repo };
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

test("CORE bindings normalize to the default scope while preserving selection", t => {
  const f = fixture(t);
  const bindingChange = f.request.registryChanges.find(change => change.path.endsWith("/bindings.json"));
  bindingChange.after.bindings[0].curriculumApplicability = "CORE";
  bindingChange.after.bindings[0].defaultSelectable = true;
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  const row = f.read(META).records[0];
  const runtime = f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records[0];
  assert.equal(row.curriculumApplicability, "DEFAULT_SCOPE");
  assert.equal(row.defaultSelectable, true);
  assert.equal(runtime.runtimeSelectable, true);
});

test("outside-core rules reject conflicting approval and materialize only as supplementary", t => {
  const f = fixture(t);
  const bindingChange = f.request.registryChanges.find(change => change.path.endsWith("/bindings.json"));
  bindingChange.after.applicabilityRules = [{ curriculum: "2022", standardUnitKey: "UNIT_NEW", targetType: "template", targetKey: "TPL_NEW",
    curriculumApplicability: "SUPPLEMENTARY_OUTSIDE_CORE", defaultSelectable: false, reason: "SYNTHETIC_TEST only", status: "ACTIVE", ownerPack: "NEW_COURSE" }];
  f.request.items[0].after.curriculumApplicability = "DEFAULT_SCOPE";
  f.request.items[0].after.defaultSelectable = true;
  f.request.items[0].before.curriculumApplicability = null;
  f.request.items[0].before.defaultSelectable = null;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, write: true }), /approved applicability conflicts with canonical rule|approved selectability conflicts with canonical rule/);
  assert.equal(fs.existsSync(path.join(f.root, "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/test-new-course.json")), false);
  f.request.items[0].after.curriculumApplicability = "SUPPLEMENTARY_OUTSIDE_CORE";
  f.request.items[0].after.defaultSelectable = false;
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const row = f.read(META).records[0];
  const runtime = f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records[0];
  assert.equal(row.curriculumApplicability, "SUPPLEMENTARY_OUTSIDE_CORE");
  assert.equal(row.defaultSelectable, false);
  assert.equal(runtime.runtimeSelectable, false);
});

test("positive exact template applicability is an allowlist within its course/unit", t => {
  const f = fixture(t);
  const bindingChange = f.request.registryChanges.find(change => change.path.endsWith("/bindings.json"));
  const taxonomyChange = f.request.registryChanges.find(change => change.path.endsWith("/taxonomy.json"));
  taxonomyChange.after.templates.push({ templateKey: "TPL_APPROVED_ONLY", canonicalLabelKo: "approved sibling", definition: "SYNTHETIC_TEST only",
    parentProblemTypeKey: "PT_NEW", status: "ACTIVE" });
  bindingChange.after.applicabilityRules = [{ curriculum: "2022", standardUnitKey: "UNIT_NEW", targetType: "template", targetKey: "TPL_APPROVED_ONLY",
    curriculumApplicability: "DEFAULT_SCOPE", defaultSelectable: true, reason: "SYNTHETIC_TEST exact approved template", status: "ACTIVE", ownerPack: "NEW_COURSE" }];
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /ACTIVE template applicability rule required/);
  bindingChange.after.applicabilityRules[0].targetKey = "TPL_NEW";
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  assert.equal(f.read(META).records[0].defaultSelectable, true);
});

test("positive template allowlist does not constrain a different problem type in the same unit", t => {
  const f = fixture(t);
  const taxonomyChange = f.request.registryChanges.find(change => change.path.endsWith("/taxonomy.json"));
  taxonomyChange.after.problemTypes.push({ problemTypeKey: "PT_NEW_OTHER", canonicalLabelKo: "다른 유형", definition: "SYNTHETIC_TEST only",
    ownerPack: "NEW_COURSE", status: "ACTIVE" });
  taxonomyChange.after.templates.push({ templateKey: "TPL_NEW_OTHER", canonicalLabelKo: "다른 풀이 구조", definition: "SYNTHETIC_TEST only",
    parentProblemTypeKey: "PT_NEW_OTHER", status: "ACTIVE" });
  const bindingChange = f.request.registryChanges.find(change => change.path.endsWith("/bindings.json"));
  bindingChange.after.bindings.push({ ...structuredClone(bindingChange.after.bindings[0]), problemTypeKey: "PT_NEW_OTHER" });
  bindingChange.after.applicabilityRules = [{ curriculum: "2022", standardUnitKey: "UNIT_NEW", targetType: "template", targetKey: "TPL_APPROVED_ONLY",
    curriculumApplicability: "DEFAULT_SCOPE", defaultSelectable: true, reason: "SYNTHETIC_TEST exact template scope", status: "ACTIVE", ownerPack: "NEW_COURSE" }];
  taxonomyChange.after.templates.push({ templateKey: "TPL_APPROVED_ONLY", canonicalLabelKo: "approved sibling", definition: "SYNTHETIC_TEST only",
    parentProblemTypeKey: "PT_NEW", status: "ACTIVE" });
  f.q.problemTypeKey = "PT_NEW_OTHER";
  f.q.templateKey = "TPL_NEW_OTHER";
  const sourceText = `window.questions = ${JSON.stringify([f.q])};\n`;
  f.put(`archive/exams/${f.request.sourceArchiveFile}`, sourceText);
  const fingerprint = hash(JSON.stringify({ content: f.q.content, choices: f.q.choices, answer: f.q.answer, solution: f.q.solution, image: f.q.image }));
  const metadata = f.read(META); metadata.records[0].sourceFingerprint = fingerprint; f.put(META, metadata);
  const identity = f.read("archive/data/question_identity_map.json"); identity.records[0].sourceFingerprint = fingerprint; f.put("archive/data/question_identity_map.json", identity);
  f.request.expectedSourceBlobSha1 = blob(sourceText);
  f.request.items[0].after.problemTypeKey = f.q.problemTypeKey;
  f.request.items[0].after.templateKey = f.q.templateKey;
  f.request.items[0].after.L3 = "다른 유형";
  f.request.items[0].after.L4 = "다른 풀이 구조";
  f.request.items[0].before.L3 = null;
  f.request.items[0].before.L4 = null;
  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 1);
  assert.equal(f.read(META).records[0].problemTypeKey, "PT_NEW_OTHER");
  assert.equal(f.read(META).records[0].defaultSelectable, true);
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
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /registered output drift|runtime drift/);
});

test("A then B on shared metadata/runtime permits A replay but detects A target and canonical drift", t => {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const sourceB = "fixture/exam-b.js";
  const qB = { ...f.q, id: 2 };
  const bytesB = `window.questions=${JSON.stringify([qB])};\n`;
  f.put(`archive/exams/${sourceB}`, bytesB);
  const fpB = hash(JSON.stringify({ content: qB.content, choices: qB.choices, answer: qB.answer, solution: qB.solution, image: qB.image }));
  const rowB = { questionUid: "uidB", sourceArchiveFile: sourceB, sourceOrdinal: 1, sourceFingerprint: fpB,
    standardCourse: qB.standardCourse, standardUnitKey: qB.standardUnitKey, subUnitKey: qB.subUnitKey, reviewStatus: "review_required" };
  const meta = f.read(META); meta.records.push(rowB); f.put(META, meta);
  const identity = f.read("archive/data/question_identity_map.json"); identity.records.push({ ...rowB }); f.put("archive/data/question_identity_map.json", identity);
  const afterB = structuredClone(f.request.items[0].after);
  const requestB = { ...structuredClone(f.request), requestId: "test-new-course-B", examUid: "examB", sourceArchiveFile: sourceB,
    expectedSourceBlobSha1: blob(bytesB), registryChanges: [],
    items: [{ questionUid: "uidB", sourceOrdinal: 1, before: Object.fromEntries(Object.keys(afterB).map(field => [field, rowB[field] ?? null])),
      after: afterB, reason: "synthetic disjoint second registration", evidenceRefs: f.evidenceRefs }] };
  registerReviewedExamV2({ root: f.root, request: requestB, write: true });
  const replayA = registerReviewedExamV2({ root: f.root, request: f.request });
  assert.equal(replayA.replay, true);

  const runtimePath = "archive/data/meta-foundation/runtime/new-course-v1.json";
  const runtime = f.read(runtimePath); runtime.records.find(row => row.questionUid === "uid1").L3 = "corrupt target"; f.put(runtimePath, runtime);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /runtime drift/);
  runtime.records.find(row => row.questionUid === "uid1").L3 = "새 유형"; f.put(runtimePath, runtime);
  const taxonomyPath = `${CANON}/packs/new-course/taxonomy.json`;
  const taxonomy = f.read(taxonomyPath); taxonomy.problemTypes[0].definition = "changed canonical meaning"; f.put(taxonomyPath, taxonomy);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /canonical meaning drift/);
});

test("canonical maintenance A replay tolerates a later reviewed-exam B runtime stamp for the same pack", t => {
  const f = fixture(t);
  const baselineMeta = structuredClone(f.read(META).records[0]);
  const baselineIdentity = structuredClone(f.read("archive/data/question_identity_map.json").records[0]);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });

  const packPath = `${CANON}/packs/new-course/pack.json`;
  const beforePack = f.read(packPath);
  const crosswalkPath = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/synthetic-test.json";
  const crosswalkBefore = { schemaVersion: "rpm-primary-crosswalk-v1", records: [{ id: "SYNTHETIC_TEST_binding_gap", curriculum: "2022",
    scope: "중1 수학", standardCourse: "중1 수학", standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW",
    ownerPack: "NEW_COURSE", mappingStatus: "DIRECT_BINDING_GAP", bindingStatus: "GAP", rpmPath: { l3: "SYNTHETIC_TEST", l4: "SYNTHETIC_TEST" } }],
    summary: {}, generatedAgainstMain: "", activeAuthority: {} };
  f.put(crosswalkPath, crosswalkBefore);
  const maintenanceRequest = {
    schemaVersion: "archive-reviewed-canonical-maintenance-request-v1",
    requestId: "SYNTHETIC_TEST_maintenance_A",
    purpose: "SYNTHETIC_TEST canonical runtime envelope compatibility",
    approval: { type: "CANONICAL_MAINTENANCE", approvedBy: "SYNTHETIC_TEST_ONLY_NOT_APPROVED", evidenceRefs: f.evidenceRefs },
    registryChanges: [{ path: packPath, before: beforePack, after: { ...beforePack, maintenanceTestMarker: "SYNTHETIC_TEST" }, evidenceRefs: f.evidenceRefs }],
    crosswalkRefreshPaths: [{ path: crosswalkPath, expectedBeforeSha256: hash(fs.readFileSync(path.join(f.root, crosswalkPath))),
      selector: { curriculum: "2022", scope: "중1 수학", standardCourse: "중1 수학" }, expectedRecordCount: 1,
      expectedSummary: { recordCount: 1, DIRECT_ACTIVE: 1, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 0, FAMILY_BINDING_GAP: 0, RPM_ONLY: 0,
        byScope: { "중1 수학": { DIRECT_ACTIVE: 1, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 0, FAMILY_BINDING_GAP: 0, RPM_ONLY: 0 } } }, evidenceRefs: f.evidenceRefs }],
    actionMainSha: "1".repeat(40), items: [],
  };
  const applied = registerReviewedCanonicalMaintenanceV1({ root: f.root, request: maintenanceRequest, write: true });
  assert.equal(applied.maintenanceStatus, "APPLIED");
  assert.equal(applied.consumerSearchStatus, "NOT_RUN");
  const newPackVersion = f.read(packPath).packVersion;
  assert.equal(f.read("archive/data/meta-foundation/runtime/new-course-v1.json").packVersion, newPackVersion);

  const q = structuredClone(f.q); q.id = 2;
  const source = "fixture/exam-b.js";
  const sourceText = `window.questions = ${JSON.stringify([q])};\n`;
  f.put(`archive/exams/${source}`, sourceText);
  const fingerprint = hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const meta = f.read(META); meta.records.push({ ...baselineMeta, questionUid: "uid2", sourceArchiveFile: source, sourceOrdinal: 1,
    sourceFingerprint: fingerprint, contentFingerprint: null, reviewStatus: "review_required", metadataStatus: "registration_pending_semantic_review" }); f.put(META, meta);
  const identity = f.read("archive/data/question_identity_map.json"); identity.records.push({ ...baselineIdentity, questionUid: "uid2", sourceArchiveFile: source,
    sourceOrdinal: 1, sourceFingerprint: fingerprint }); f.put("archive/data/question_identity_map.json", identity);
  const requestB = structuredClone(f.request);
  requestB.requestId = "SYNTHETIC_TEST_exam_B";
  requestB.examUid = "SYNTHETIC_TEST_exam_B";
  requestB.sourceArchiveFile = source;
  requestB.expectedSourceBlobSha1 = blob(sourceText);
  requestB.expectedQuestionCount = 1;
  requestB.registryChanges = [];
  requestB.items[0].questionUid = "uid2";
  requestB.items[0].before = Object.fromEntries(Object.keys(requestB.items[0].after).map(field => [field, meta.records.at(-1)[field] ?? null]));
  const registeredB = registerReviewedExamV2({ root: f.root, request: requestB, write: true });
  assert.equal(registeredB.totalQuestions, 1);
  assert.equal(f.read("archive/data/meta-foundation/runtime/new-course-v1.json").runtimeVersion, `NEW_COURSE@${newPackVersion}/reviewed-exam-v2`);

  const replayA = registerReviewedCanonicalMaintenanceV1({ root: f.root, request: maintenanceRequest });
  assert.equal(replayA.replay, true);
  assert.equal(replayA.maintenanceStatus, "APPLIED");
  assert.equal(replayA.consumerSearchStatus, "NOT_RUN");
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
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: req, write: true }), /registry change affects out-of-scope UID: unrelated/);
});

test("positive applicability rules protect an out-of-scope sibling TPL of the selected PT", t => {
  const f = fixture(t);
  const taxonomyChange = f.request.registryChanges.find(change => change.path.endsWith("/taxonomy.json"));
  taxonomyChange.after.templates.push({ templateKey: "TPL_NEW_SIBLING", canonicalLabelKo: "다른 풀이 구조", definition: "SYNTHETIC_TEST only",
    parentProblemTypeKey: "PT_NEW", status: "ACTIVE" });
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const metadata = f.read(META), target = metadata.records[0];
  metadata.records.push({ ...target, questionUid: "unrelated-positive-scope", sourceArchiveFile: "other.js", sourceOrdinal: 1,
    templateKey: "TPL_NEW_SIBLING" });
  f.put(META, metadata);
  const bindingPath = `${CANON}/packs/new-course/bindings.json`;
  const rule = { curriculum: "2022", standardUnitKey: "UNIT_NEW", targetType: "template", targetKey: "TPL_NEW",
    curriculumApplicability: "DEFAULT_SCOPE", defaultSelectable: true, reason: "SYNTHETIC_TEST exact positive scope",
    status: "ACTIVE", ownerPack: "NEW_COURSE" };
  const after = structuredClone(f.request.items[0].after);
  const req = { ...structuredClone(f.request), requestId: "positive-scope-protects-sibling", registryChanges: [
    { path: bindingPath, collection: "applicabilityRules", match: { curriculum: rule.curriculum, standardUnitKey: rule.standardUnitKey,
      targetType: rule.targetType, targetKey: rule.targetKey }, before: null, after: rule, evidenceRefs: f.evidenceRefs }],
    items: [{ ...structuredClone(f.request.items[0]), before: Object.fromEntries(Object.keys(after).map(key => [key, target[key] ?? null])) }] };
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: req, write: true }), /registry change affects out-of-scope UID: unrelated-positive-scope/);
  assert.equal(fs.existsSync(path.join(f.root, "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/positive-scope-protects-sibling.json")), false);
});

test("an applicability rule in a different unit does not affect unrelated UID scope", t => {
  const f = fixture(t);
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const target = f.read(META).records[0];
  const unitPath = "archive/data/master_tables/js_archive_tag_master.json";
  const newUnit = { key: "UNIT_OTHER", keyType: "standardUnitKey", labelKo: "별도 단원", status: "active" };
  const rule = { curriculum: "2022", standardUnitKey: "UNIT_OTHER", targetType: "template", targetKey: "TPL_NEW",
    curriculumApplicability: "DEFAULT_SCOPE", defaultSelectable: true, reason: "SYNTHETIC_TEST unrelated unit",
    status: "ACTIVE", ownerPack: "NEW_COURSE" };
  const after = structuredClone(f.request.items[0].after);
  const req = { ...structuredClone(f.request), requestId: "unrelated-unit-applicability-rule", registryChanges: [
    { path: unitPath, collection: "$", match: { key: newUnit.key }, before: null, after: newUnit, evidenceRefs: f.evidenceRefs },
    { path: `${CANON}/packs/new-course/bindings.json`, collection: "applicabilityRules", match: { curriculum: rule.curriculum,
      standardUnitKey: rule.standardUnitKey, targetType: rule.targetType, targetKey: rule.targetKey }, before: null, after: rule, evidenceRefs: f.evidenceRefs }],
    items: [{ ...structuredClone(f.request.items[0]), before: Object.fromEntries(Object.keys(after).map(key => [key, target[key] ?? null])) }] };
  const result = registerReviewedExamV2({ root: f.root, request: req, write: true });
  assert.equal(result.totalQuestions, 1);
  assert.equal(f.read(META).records[0].defaultSelectable, true);
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
  const consumerEvidence = { reference: "synthetic-registered-projection", sha256: "synthetic-projection-sha" };
  const displayProjection = { ...row, projectionStatus: "DISPLAY_ONLY_SOURCE_BOUND", displayOnly: true,
    nativeTaxonomyAuthority: { registrationPackId: "H1_ORIGINAL_SOURCE", registrationPackVersion: "1.0.0" } };
  f.put("archive/data/archive2-catalog.json", { records: [{ ...row, metaProjection: displayProjection, sourceFile: row.sourceArchiveFile, metadataConflicts: [], currentSourceJsSha256: "synthetic-source-sha",
    reviewedExamRegistration: { schemaVersion: "archive-reviewed-exam-registration-projection-v2", sourceJsSha256: "synthetic-source-sha", metadataRevision: row.metadataRevision, ...consumerEvidence },
    assignmentEvidence: { reviewEvidence: consumerEvidence } }] });
  f.put("archive/question-index.js", `window.questionIndex=${JSON.stringify([{ ...row, sourceFile: row.sourceArchiveFile, course: row.standardCourse }])};`);
  // This fixture verifies the Consumer/Search value comparator only. The
  // manifest-backed projection path is covered by the repository integration
  // flow and requires the full canonical input bundle.
  const records = f.read(META).records;
  const runtime = f.read("archive/data/meta-foundation/runtime/new-course-v1.json").records;
  verifyConsumerValues(f.root, records, runtime, f.read("archive/data/archive2-catalog.json"));
  f.put("archive/question-index.js", "window.questionIndex=[];");
  assert.throws(() => verifyConsumerValues(f.root, records, runtime, f.read("archive/data/archive2-catalog.json")), /Search source denominator mismatch/);
});

test("SYNTHETIC_TEST: actual Geumdang 21 UID source reaches manifest-backed Catalog and ProblemBankMeta search", t => {
  const f = calculus21SyntheticFixture(t);
  const beforeMeta = fs.readFileSync(path.join(f.root, META));
  const wrongUid = structuredClone(f.request);
  wrongUid.items[0].questionUid = "synthetic-wrong-uid";
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: wrongUid, write: true }), /UID\/source ordinal mismatch|missing\/duplicate request UID/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), beforeMeta);

  const missingBinding = structuredClone(f.request);
  missingBinding.registryChanges.find(change => change.path.endsWith("/bindings.json")).after.bindings.pop();
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: missingBinding, write: true }), /ACTIVE curriculum binding missing|canonical label mismatch/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), beforeMeta);

  const missingExplicitNull = structuredClone(f.request);
  delete missingExplicitNull.registryChanges.find(change => change.path.endsWith("/bindings.json")).after.bindings[0].subUnitKey;
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: missingExplicitNull, write: true }), /requires explicit subUnitKey:null/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), beforeMeta);

  const forgedChild = structuredClone(f.request);
  forgedChild.items[0].after.subUnitKey = "UNREVIEWED_SYNTHETIC_CHILD";
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: forgedChild, write: true }), /ACTIVE curriculum binding missing|subunit missing/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), beforeMeta);

  const directNullWithChild = structuredClone(f.request);
  const unitKey = directNullWithChild.items[0].after.standardUnitKey;
  directNullWithChild.registryChanges.push({ path: "archive/data/master_tables/js_archive_tag_master.json", collection: "$",
    match: { key: "SYNTHETIC_TEST_CHILD" }, before: null,
    after: { key: "SYNTHETIC_TEST_CHILD", keyType: "subUnitKey", parentKey: unitKey, standardUnitKey: unitKey,
      labelKo: "SYNTHETIC_TEST child", status: "active" }, evidenceRefs: f.request.approval.evidenceRefs });
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: directNullWithChild, write: true }), /new STANDARD_UNIT_DIRECT null-subunit binding conflicts with active child units|STANDARD_UNIT_DIRECT null subunit conflicts with canonical child units/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, META)), beforeMeta);

  const duplicateBinding = structuredClone(f.request);
  const bindingChange = duplicateBinding.registryChanges.find(change => change.path.endsWith("/bindings.json"));
  bindingChange.after.bindings.push(structuredClone(bindingChange.after.bindings[0]));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: duplicateBinding, write: true }), /missing\/duplicate binding/);

  const result = registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.equal(result.totalQuestions, 21);
  assert.equal(result.runtimeMaterialized, 21);
  const registered = f.read(META).records.filter(row => row.sourceArchiveFile === f.source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  assert.equal(registered.length, 21);
  assert.deepEqual(f.read(META).records.find(row => row.questionUid === f.unrelated.questionUid), f.unrelated);
  for (const row of registered) {
    assert.equal(row.sourceFingerprint, f.actualFingerprintByUid.get(row.questionUid));
    assert.equal(row.subUnitKey, null, "SYNTHETIC_TEST direct-null binding normalizes the source's empty optional subunit only in metadata");
    assert.equal(row.subUnit, "", "SYNTHETIC_TEST keeps the absent child label blank");
  }
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/exams", f.source)), f.originalBytes,
    "SYNTHETIC_TEST registration must preserve the actual original JS bytes");
  assert.equal(execFileSync("git", ["hash-object", "--path", `archive/exams/${f.source}`, "--stdin"],
    { cwd: f.repo, input: f.originalBytes, encoding: "utf8" }).trim(), f.originalGitBlob);
  assert.equal(f.read(`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.json`).approval.approvedBy, "SYNTHETIC_TEST_ONLY_NOT_APPROVED");
  assert.deepEqual(f.read(`${CANON}/registry_index.json`).activePacks.map(row => row.id), ["SYNTHETIC_CALCULUS_TEST"]);
  const runtimeRows = f.read("archive/data/meta-foundation/runtime/synthetic-calculus-test-v1.json").records
    .filter(row => row.sourceArchiveFile === f.source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  assert.equal(runtimeRows.length, 21);
  for (const runtime of runtimeRows) {
    assert.notEqual(runtime.sourceFingerprint, runtime.contentFingerprint, `SYNTHETIC_TEST keeps source and assignment fingerprints distinct at Q${runtime.sourceOrdinal}`);
    assert.equal(runtime.subUnitKey, null);
    assert.equal(runtime.subUnit, "");
  }
  const receiptPath = `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.json`;
  assert.equal(f.read(receiptPath).sourceRawSha256, hash(fs.readFileSync(path.join(f.root, "archive/exams", f.source))));
  const canonicalMaster = JSON.parse(fs.readFileSync(path.join(f.root, "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json"), "utf8"));
  const canonicalParents = archive2Core.taxonomyPaths(canonicalMaster);
  const policy = f.read("archive/data/archive2-canonical-projection-policy.json");
  for (const runtime of runtimeRows) {
    assert.ok(policy.gradeCourseAllowlist.some(row => row.grade === "고2" && row.curriculumKey === runtime.curriculumKey && row.courseKey === runtime.courseKey));
    assert.ok(canonicalParents.some(row => row.curriculumKey === runtime.curriculumKey && row.courseKey === runtime.courseKey && row.L1 === runtime.L1 && row.L2 === runtime.L2));
  }

  for (const packId of ["GEOMETRY_EQUATIONS", "SETS_PROPOSITIONS", "FUNCTIONS_GRAPHS", "LIMIT_CONTINUITY", "INTEGRAL_CALCULUS", "DERIVATIVE",
    "PROBABILITY_STATISTICS", "MIDDLE_GEOMETRY", "MIDDLE1", "H1_FOUNDATION", "H1_ORIGINAL_SOURCE"]) {
    f.put(`archive/data/meta-foundation/runtime/${packId.toLowerCase().replaceAll("_", "-")}-v1.json`, {
      schemaVersion: "meta-foundation-runtime-v1", status: "ACTIVE", packId, packVersion: "1.0.0", runtimeVersion: `${packId}@1.0.0/SYNTHETIC_TEST`,
      counts: {}, records: [], taxonomyRows: [], ownedScopes: [],
    });
  }

  const catalogBuilder = path.join(f.root, "archive/tools/build-archive2-catalog.mjs");
  const runCatalogBuilder = () => execFileSync(process.execPath, [catalogBuilder], { cwd: f.root, stdio: "pipe" });
  const decodeBuiltCatalog = () => {
    const catalog = JSON.parse(fs.readFileSync(path.join(f.root, "archive/data/archive2-catalog.json"), "utf8"));
    const strings = catalog.strings || [];
    return catalog.records.map(row => catalog.encoding === "column-dictionary-v1"
      ? Object.fromEntries(catalog.columns.map((key, index) => [key, Array.isArray(row[index]) && row[index].length === 1 ? strings[row[index][0]] : row[index]])) : row);
  };
  const metadataBytes = fs.readFileSync(path.join(f.root, META));
  runCatalogBuilder();
  const baselineCatalogRows = decodeBuiltCatalog().filter(row => row.sourceFile === f.source);
  assert.equal(baselineCatalogRows.length, 21);
  const baselineByUid = new Map(baselineCatalogRows.map(row => [row.questionUid, row]));
  for (const runtime of runtimeRows) {
    const row = baselineByUid.get(runtime.questionUid);
    assert.ok(row?.assignmentEvidence, `valid raw source SHA plus distinct source/content fingerprints must pass Q${runtime.sourceOrdinal}`);
    assert.equal(row.curriculumKey, runtime.curriculumKey);
    assert.equal(row.courseKey, runtime.courseKey);
    assert.equal(row.L1, runtime.L1);
    assert.equal(row.L2, runtime.L2);
    assert.equal(row.subUnitKey, null);
    assert.equal(row.problemTypeKey, runtime.problemTypeKey);
    assert.equal(row.templateKey, runtime.templateKey);
    assert.equal(row.sourceFingerprint, runtime.sourceFingerprint);
    assert.equal(row.assignmentFingerprint, runtime.contentFingerprint);
  }
  const tagMasterPath = path.join(f.root, "archive/data/master_tables/js_archive_tag_master.json");
  const tagMasterBytes = fs.readFileSync(tagMasterPath);
  const targetUnit = runtimeRows[0].standardUnitKey;
  const tagMaster = JSON.parse(tagMasterBytes.toString("utf8"));
  tagMaster.push({ key: "SYNTHETIC_TEST_ACTIVE_CHILD", keyType: "subUnitKey", parentKey: targetUnit,
    standardUnitKey: targetUnit, labelKo: "SYNTHETIC_TEST active child", status: "active" });
  fs.writeFileSync(tagMasterPath, JSON.stringify(tagMaster, null, 2) + "\n");
  runCatalogBuilder();
  const childConflictRows = decodeBuiltCatalog().filter(row => row.sourceFile === f.source);
  assert.equal(childConflictRows.length, 21);
  assert.ok(childConflictRows.filter(row => row.standardUnitKey === targetUnit).every(row => row.assignmentEvidence == null),
    "direct-null proof must fail for units with an active canonical child");
  assert.ok(childConflictRows.filter(row => row.standardUnitKey !== targetUnit).every(row => row.assignmentEvidence != null),
    "the active child guard must remain unit-scoped");
  fs.writeFileSync(tagMasterPath, tagMasterBytes);
  runCatalogBuilder();
  for (const field of ["sourceFingerprint", "contentFingerprint"]) {
    const metadata = JSON.parse(metadataBytes.toString("utf8"));
    const targets = metadata.records.filter(row => row.sourceArchiveFile === f.source);
    assert.equal(targets.length, 21);
    for (const target of targets) target[field] = "0".repeat(64);
    fs.writeFileSync(path.join(f.root, META), JSON.stringify(metadata, null, 2) + "\n");
    runCatalogBuilder();
    const tamperedRows = decodeBuiltCatalog().filter(row => row.sourceFile === f.source);
    assert.equal(tamperedRows.length, 21);
    assert.ok(tamperedRows.every(row => row.assignmentEvidence == null), `direct-null binding proof must reject all 21 tampered ${field} values`);
    assert.ok(tamperedRows.every(row => row.curriculumKey === ""), `tampered ${field} must blank the unverified canonical parent`);
    fs.writeFileSync(path.join(f.root, META), metadataBytes);
  }
  const sourcePath = path.join(f.root, "archive/exams", f.source);
  const sourceBytes = fs.readFileSync(sourcePath);
  fs.writeFileSync(sourcePath, Buffer.concat([sourceBytes, Buffer.from("\n// SYNTHETIC_TEST byte-only stale-receipt probe\n")]));
  runCatalogBuilder();
  const rawTamperedRows = decodeBuiltCatalog().filter(row => row.sourceFile === f.source);
  assert.equal(rawTamperedRows.length, 21);
  assert.ok(rawTamperedRows.every(row => row.assignmentEvidence == null), "byte-only source change must stale all 21 exact raw-source receipt proofs");
  assert.ok(rawTamperedRows.every(row => row.curriculumKey === ""));
  fs.writeFileSync(sourcePath, sourceBytes);
  runCatalogBuilder();
  execFileSync(process.execPath, [path.join(f.root, "archive/tools/build-question-index.mjs")], {
    cwd: f.root, stdio: "pipe", env: { ...process.env, GEOMETRY_ARCHIVE_ROOT: path.join(f.root, "archive"), GEOMETRY_REPO_ROOT: f.root }
  });
  const verified = registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true });
  assert.equal(verified.replay, true);
  assert.equal(verified.totalQuestions, 21);
  assert.equal(verified.consumerSearchStatus, "STATIC_VALUES_VERIFIED");
  assert.equal(verified.browserStatus, "NOT_RUN");

  const searchCtx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(searchCtx);
  vm.runInContext(fs.readFileSync(path.join(f.root, "archive/question-index.js"), "utf8"), searchCtx);
  const searchRows = JSON.parse(JSON.stringify(searchCtx.window.questionIndex));
  assert.equal(searchRows.filter(row => row.sourceFile === f.source).length, 21);
  searchRows.pop();
  f.put("archive/question-index.js", `window.questionIndex=${JSON.stringify(searchRows)};\n`);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true }), /Search source denominator mismatch/);

  execFileSync(process.execPath, [path.join(f.root, "archive/tools/build-question-index.mjs")], {
    cwd: f.root, stdio: "pipe", env: { ...process.env, GEOMETRY_ARCHIVE_ROOT: path.join(f.root, "archive"), GEOMETRY_REPO_ROOT: f.root }
  });
  const catalogPath = path.join(f.root, "archive/data/archive2-catalog.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  catalog.records[0][catalog.columns.indexOf("problemTypeKey")] = "SYNTHETIC_CORRUPTION";
  fs.writeFileSync(catalogPath, j(catalog));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request, verifyProjection: true }), /canonical input digest mismatch: data\/archive2-catalog.json/);

  // Exercise the same post-push maintenance verifier used by Actions with a
  // real manifest-backed fixture. The authorization and classifications are
  // explicitly synthetic and never touch repository production data.
  runCatalogBuilder();
  execFileSync(process.execPath, [path.join(f.root, "archive/tools/build-question-index.mjs")], {
    cwd: f.root, stdio: "pipe", env: { ...process.env, GEOMETRY_ARCHIVE_ROOT: path.join(f.root, "archive"), GEOMETRY_REPO_ROOT: f.root }
  });
  const packPath = `${CANON}/packs/synthetic-calculus-test/pack.json`;
  const beforePack = f.read(packPath);
  const crosswalkPath = "archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/synthetic-calculus-maintenance.json";
  const crosswalkRecord = { id: "SYNTHETIC_TEST-001", curriculum: "2022", scope: f.course, standardUnitKey: runtimeRows[0].standardUnitKey,
    subUnitKey: null, problemTypeKey: runtimeRows[0].problemTypeKey, ownerPack: "SYNTHETIC_CALCULUS_TEST", mappingStatus: "DIRECT_BINDING_GAP",
    bindingStatus: "GAP", rpmPath: { L1: runtimeRows[0].L1, L2: runtimeRows[0].L2, L3: "SYNTHETIC_TEST", L4: "SYNTHETIC_TEST" } };
  const crosswalk = { schemaVersion: "rpm-primary-active-crosswalk-v1", status: "ACTIVE_REFERENCE", records: [crosswalkRecord],
    summary: { recordCount: 1, DIRECT_ACTIVE: 0, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 1,
      FAMILY_BINDING_GAP: 0, RPM_ONLY: 0, byScope: { [f.course]: { DIRECT_ACTIVE: 0, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 1, FAMILY_BINDING_GAP: 0, RPM_ONLY: 0 } } } };
  f.put(crosswalkPath, crosswalk);
  const crosswalkBeforeSha256 = hash(fs.readFileSync(path.join(f.root, crosswalkPath)));
  const crosswalkExpectedSummary = { recordCount: 1, DIRECT_ACTIVE: 1, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 0,
    FAMILY_BINDING_GAP: 0, RPM_ONLY: 0, byScope: { [f.course]: { DIRECT_ACTIVE: 1, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 0, FAMILY_BINDING_GAP: 0, RPM_ONLY: 0 } } };
  const maintenanceRequest = {
    schemaVersion: "archive-reviewed-canonical-maintenance-request-v1",
    requestId: "SYNTHETIC_TEST_calculus21_full_postpush",
    purpose: "SYNTHETIC_TEST only: exercise the canonical maintenance post-push verification route",
    actionMainSha: "1".repeat(40),
    approval: { type: "CANONICAL_MAINTENANCE", approvedBy: "SYNTHETIC_TEST_ONLY_NOT_APPROVED", evidenceRefs: f.request.approval.evidenceRefs },
    registryChanges: [{ path: packPath, before: beforePack, after: { ...beforePack, packVersion: "1.0.1" }, evidenceRefs: f.request.approval.evidenceRefs }],
    crosswalkRefreshPaths: [{ path: crosswalkPath, expectedBeforeSha256: crosswalkBeforeSha256,
      selector: { curriculum: "2022", scope: f.course, standardCourse: f.course }, expectedRecordCount: 1,
      expectedSummary: crosswalkExpectedSummary, evidenceRefs: f.request.approval.evidenceRefs }],
    items: [],
  };
  const applied = registerReviewedCanonicalMaintenanceV1({ root: f.root, request: maintenanceRequest, write: true });
  assert.equal(applied.maintenanceStatus, "APPLIED");
  assert.equal(applied.consumerSearchStatus, "NOT_RUN");
  assert.equal(applied.runtimeUpdates[0].recordCount, 21);
  runCatalogBuilder();
  execFileSync(process.execPath, [path.join(f.root, "archive/tools/build-question-index.mjs")], {
    cwd: f.root, stdio: "pipe", env: { ...process.env, GEOMETRY_ARCHIVE_ROOT: path.join(f.root, "archive"), GEOMETRY_REPO_ROOT: f.root }
  });
  const maintenanceRequestPath = path.join(f.root, "maintenance-request.json");
  const maintenanceSummaryPath = path.join(f.root, "maintenance-summary.md");
  fs.writeFileSync(maintenanceRequestPath, j(maintenanceRequest));
  const runPostPush = () => {
    const stdout = execFileSync(process.execPath, [
      fileURLToPath(new URL("../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs", import.meta.url)),
      "--root", f.root, "--request", maintenanceRequestPath, "--summary-file", maintenanceSummaryPath,
    ], { cwd: f.root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return JSON.parse(stdout);
  };
  const serializedPostPush = JSON.parse(JSON.stringify(runPostPush()));
  assert.equal(serializedPostPush.status, "PASS", JSON.stringify(serializedPostPush.failures));
  assert.equal(serializedPostPush.exams[0].maintenanceStatus, "MAINTENANCE_COMPLETE");
  assert.equal(serializedPostPush.exams[0].consumerSearchStatus, "STATIC_VALUES_VERIFIED");
  assert.equal(serializedPostPush.exams[0].runtimeUidsVerified, 21);
  assert.equal(serializedPostPush.exams[0].projectedClassificationUidCount, 21);
  assert.equal(serializedPostPush.exams[0].withheldClassificationUidCount, 0);
  assert.equal(serializedPostPush.exams[0].canonicalAssignmentEvidenceCount, 21);
  assert.match(fs.readFileSync(maintenanceSummaryPath, "utf8"), /21 PT\/TPL projections, 0 with PT\/TPL withheld/);
  assert.match(fs.readFileSync(maintenanceSummaryPath, "utf8"), /canonical assignment evidence 21/);
  assert.match(fs.readFileSync(maintenanceSummaryPath, "utf8"), /source fingerprint status 21 current \/ 0 held/);

  // Remove the fixture-only metadata approval state. The canonical resolver
  // must withhold the raw PT/TPL from Search, and post-push verification must
  // report the held UID denominator truthfully.
  const pendingMetadata = f.read(META);
  for (const row of pendingMetadata.records.filter(row => row.sourceArchiveFile === f.source))
    row.metadataStatus = "registration_pending_semantic_review";
  f.put(META, pendingMetadata);
  runCatalogBuilder();
  execFileSync(process.execPath, [path.join(f.root, "archive/tools/build-question-index.mjs")], {
    cwd: f.root, stdio: "pipe", env: { ...process.env, GEOMETRY_ARCHIVE_ROOT: path.join(f.root, "archive"), GEOMETRY_REPO_ROOT: f.root }
  });
  const pendingCatalogRow = decodeBuiltCatalog().find(row => row.questionUid === runtimeRows[0].questionUid);
  const resolvedLeakCatalog = loadResolvedConsumerCatalog(f.root);
  const resolvedLeakRows = resolvedLeakCatalog.records.filter(row => row.questionUid &&
    runtimeRows.some(runtime => runtime.questionUid === row.questionUid));
  const sourceHashes = new Map(resolvedLeakCatalog.sourceHashes || []);
  const pendingSearchRow = problemBankMeta.buildIndex(resolvedLeakRows.map(row => ({ ...row,
    currentSourceJsSha256: sourceHashes.get(row.sourceFile) || "" })), [])
    .find(row => row.uid === runtimeRows[0].questionUid);
  assert.ok(pendingCatalogRow?.problemTypeKey && pendingCatalogRow?.templateKey);
  assert.deepEqual([pendingSearchRow?.problemTypeKey, pendingSearchRow?.templateKey], [null, null],
    "the canonical resolver must suppress raw sidecar PT/TPL while current assignment proof is absent");
  assert.equal(pendingCatalogRow.assignmentEvidence, null, "pending metadata must not carry reviewed assignment proof");
  const pendingPostPush = runPostPush();
  assert.equal(pendingPostPush.status, "PASS", JSON.stringify(pendingPostPush.failures));
  assert.equal(pendingPostPush.exams[0].projectedClassificationUidCount, 0);
  assert.equal(pendingPostPush.exams[0].withheldClassificationUidCount, 21);
  assert.equal(pendingPostPush.exams[0].canonicalAssignmentEvidenceCount, 0);
  assert.match(fs.readFileSync(maintenanceSummaryPath, "utf8"), /0 PT\/TPL projections, 21 with PT\/TPL withheld/);
});

test("registration transaction restores installed originals after an injected mid-write failure", t => {
  const f = fixture(t);
  f.put("docs/original.json", { retained: true });
  assert.throws(() => commitRegistrationFiles(f.root, new Map([
    ["docs/original.json", j({ retained: false })],
    ["docs/new.json", j({ created: true })]
  ]), { beforeInstall(index) { if (index === 1) throw new Error("injected install failure"); } }), /injected install failure/);
  assert.deepEqual(f.read("docs/original.json"), { retained: true });
  assert.equal(fs.existsSync(path.join(f.root, "docs/new.json")), false);
  assert.deepEqual(fs.readdirSync(path.join(f.root, ".archive-meta-register", "transactions")), []);
});

test("a later writer recovers an interrupted PREPARED transaction before registration", t => {
  const f = fixture(t);
  f.put("docs/sentinel.json", { value: "before" });
  const dir = path.join(f.root, ".archive-meta-register", "transactions", "simulated-crash");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "backup-0.tmp"), j({ value: "before" }));
  fs.writeFileSync(path.join(dir, "staged-0.tmp"), j({ value: "after" }));
  f.put("docs/sentinel.json", { value: "after" });
  fs.writeFileSync(path.join(dir, "journal.json"), j({ schemaVersion: "archive-meta-registration-transaction-v1", state: "PREPARED",
    entries: [{ path: "docs/sentinel.json", staged: "staged-0.tmp", backup: "backup-0.tmp", hadOriginal: true }] }));
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  assert.deepEqual(f.read("docs/sentinel.json"), { value: "before" });
  assert.equal(fs.existsSync(dir), false);
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
