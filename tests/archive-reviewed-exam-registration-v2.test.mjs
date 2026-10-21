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
  change(`${base}/taxonomy.json`, null, null, null, { status: "ACTIVE", problemTypes: [{ problemTypeKey: "PT_NEW", canonicalLabelKo: "새 유형", definition: "검수된 유형 의미", ownerPack: "NEW_COURSE", status: "ACTIVE" }], templates: [{ templateKey: "TPL_NEW", canonicalLabelKo: "새 풀이 구조", definition: "검수된 풀이 구조", parentProblemTypeKey: "PT_NEW", status: "ACTIVE" }] });
  change(`${base}/bindings.json`, null, null, null, { status: "ACTIVE", bindings: [{ curriculum, standardCourse: course, standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW", status: "ACTIVE" }] });
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
