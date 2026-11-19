// Direct type judgment (DIRECT_JUDGMENT, TYPE_ONLY) lane of the reviewed-exam registrar.
// The fixture is a small repository-shaped temp root; the last test is a read-only dry run against the real data.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { registerReviewedExamV2, receiptRecordMatchesRow } from "../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs";
import { DIRECT_JUDGMENT, TYPE_FIELD_STATUS, DECISION_DOCUMENT } from "../archive/tools/meta-foundation/register-type-judgment.mjs";
import { textFingerprint } from "../archive/tools/meta-foundation/text-binding-lib.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CANON = "archive/data/meta-foundation/canonical";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const SOURCE = "fixture/exam.js";
const SECTION = "CURRENT — 유형(PT/TPL) 판정은 직접 판정 결과를 정본으로 받는다";
const COURSE = "중1 수학";
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest("hex");
const j = v => JSON.stringify(v, null, 2) + "\n";
const fingerprints = q => ({
  sourceFingerprint: hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image })),
  contentFingerprint: hash(JSON.stringify({ content: q.content, choices: q.choices, image: q.image }))
});
const TYPE_KEYS = ["problemTypeKey", "templateKey", "typeApproval"];
const withoutType = row => {
  const copy = structuredClone(row);
  for (const key of TYPE_KEYS) delete copy[key];
  if (copy.fieldStatus) { delete copy.fieldStatus.problemType; delete copy.fieldStatus.template; }
  return copy;
};

function fixture(t, { rowMutations = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-type-judgment-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, value) => { const full = path.join(root, p); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, typeof value === "string" ? value : j(value)); };
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  put(DECISION_DOCUMENT, `# 문항 메타데이터\n\n## ${SECTION} (2026-11-17, 사용자 결정)\n`);
  put("docs/approval.json", { approved: true });
  const evidenceRefs = [{ path: "docs/approval.json", sha256: hash(fs.readFileSync(path.join(root, "docs/approval.json"))) }];
  const questions = [1, 2, 3, 4, 5].map(n => ({ id: n, content: `학생용 지문 ${n}`, choices: ["1", "2"], answer: "1", solution: `학생용 해설 ${n}`, image: "" }));
  const text = `window.questions = ${JSON.stringify(questions)};\n`;
  put(`archive/exams/${SOURCE}`, text);
  const pendingStatus = () => ({ standardUnit: "manual_review_pending", subUnit: "manual_review_pending", concept: "manual_review_pending",
    problemType: "manual_review_pending", template: "manual_review_pending", difficulty: "source_unreviewed" });
  const row = (n, over = {}) => ({ questionUid: `uid${n}`, sourceArchiveFile: SOURCE, sourceOrdinal: n, sourceQuestionNo: n,
    ...fingerprints(questions[n - 1]), standardCourse: COURSE, standardUnitKey: "UNIT_UNREVIEWED", standardUnit: "미승인 단원", subUnitKey: "SUB_UNREVIEWED", subUnit: "미승인 소단원",
    conceptClusterKey: "", problemTypeKey: "", templateKey: "", crossConceptKeys: [], conditionKeys: [], integrationPattern: "NONE", difficultyBucket: 3,
    tagConfidence: "review_required", tagStatus: "review_required", reviewStatus: "review_required", metadataStatus: "registration_pending_semantic_review",
    metadataRevision: "archive-registration-sync-v1", approvalEvidence: ["archive/tools/intelligence/sync-pending-question-metadata-v1.mjs"],
    fieldStatus: pendingStatus(), ...over });
  const records = [
    row(1), // no type yet, row fingerprints exact
    row(2, { problemTypeKey: "PT_OLD_DRAFT", templateKey: "TPL_OLD_DRAFT", sourceFingerprint: "e".repeat(64) }), // draft type, only answer/solution bytes differ ("content")
    row(3, { contentFingerprint: "f".repeat(64), sourceFingerprint: "f".repeat(64) }), // stem differs: "stale"
    row(4, { problemTypeKey: "PT_A", templateKey: "TPL_A", fieldStatus: { ...pendingStatus(), problemType: "approved_review2", template: "approved_review2" } }), // type already approved
    row(5)
  ].map((r, i) => ({ ...r, ...(rowMutations[i + 1] || {}) }));
  put(META, { schemaVersion: "fixture", counts: { records: 5, explicitProblemTypeHolds: 0, explicitTemplateHolds: 0 }, records });
  put(IDENTITY, { records: records.map(r => ({ questionUid: r.questionUid, sourceArchiveFile: SOURCE, sourceOrdinal: r.sourceOrdinal, sourceFingerprint: r.sourceFingerprint })) });
  // Canonical registry: one ACTIVE pack with PT_A/TPL_A and PT_B/TPL_B (bound to the course), PT_C (no binding), an inactive PT.
  const base = `${CANON}/packs/test-pack`;
  put(`${CANON}/registry_index.json`, { activePacks: [{ id: "TEST_PACK", version: "1.0.0", status: "ACTIVE" }], activeConceptShards: [],
    conditionRegistry: { id: "CONDITION_CORE", version: "1", status: "ACTIVE" }, canonicalSources: [{ path: `${CANON}/condition_registry.json` }],
    compiledArtifacts: ["aliases", "concept_registry", "condition_registry", "curriculum_bindings", "taxonomy_registry", "meta_foundation_compiled"].map(n => ({ path: `archive/data/meta-foundation/compiled/${n}.json` })) });
  put(`${CANON}/condition_registry.json`, { schemaVersion: "meta-foundation-condition-registry-v1", owner: "CONDITION_CORE", conditions: [], conditionCount: 0 });
  put(`${base}/pack.json`, { schemaVersion: "meta-foundation-pack-v1", packId: "TEST_PACK", packVersion: "1.0.0", canonicalStatus: "ACTIVE", curricula: ["2022"], standardCourses: [COURSE] });
  const pt = (key, status = "ACTIVE") => ({ problemTypeKey: key, canonicalLabelKo: `유형 ${key}`, definition: "검수된 유형 의미", ownerPack: "TEST_PACK", status, sourceUnit: "UNIT_X", supportingQuestionUids: [], supportingItemCount: 0 });
  const tpl = (key, parent) => ({ templateKey: key, canonicalLabelKo: `풀이 ${key}`, definition: "검수된 풀이 구조", parentProblemTypeKey: parent, status: "ACTIVE", sourceUnit: "UNIT_X", supportingQuestionUids: [], supportingItemCount: 0 });
  put(`${base}/taxonomy.json`, { status: "ACTIVE", problemTypes: [pt("PT_A"), pt("PT_B"), pt("PT_C"), pt("PT_OFF", "RETIRED")], templates: [tpl("TPL_A", "PT_A"), tpl("TPL_B", "PT_B")] });
  put(`${base}/bindings.json`, { status: "ACTIVE", bindings: [{ curriculum: "2022", standardCourse: COURSE, standardUnitKey: "UNIT_X", subUnitKey: "SUB_X", problemTypeKey: "PT_A", status: "ACTIVE" },
    { curriculum: "2022", standardCourse: COURSE, standardUnitKey: "UNIT_X", subUnitKey: "SUB_X", problemTypeKey: "PT_B", status: "ACTIVE" }] });
  put(`${base}/aliases.json`, { aliases: [] });
  put(MASTER, [{ key: "UNIT_X", keyType: "standardUnitKey", labelKo: "단원", status: "active" },
    { key: "SUB_X", keyType: "subUnitKey", parentKey: "UNIT_X", standardUnitKey: "UNIT_X", labelKo: "소단원", status: "active" }]);
  fs.mkdirSync(path.join(root, "archive/data/meta-foundation/runtime"), { recursive: true });
  const item = (n, after, over = {}) => {
    const q = questions[n - 1], current = records[n - 1];
    return { questionUid: `uid${n}`, sourceOrdinal: n,
      before: { problemTypeKey: current.problemTypeKey || null, templateKey: current.templateKey || null },
      after, rationale: "해설의 결정적 단계: 도함수의 정의를 극한으로 바꾼다", judge: "dots",
      scope: { curriculum: "2022", standardCourse: COURSE }, textBindingFingerprint: textFingerprint(q), evidenceRefs, ...over };
  };
  const request = (items, over = {}) => ({ schemaVersion: "archive-reviewed-exam-meta-register-request-v2", requestId: "type-judgment-test", examUid: "exam1",
    sourceArchiveFile: SOURCE, expectedSourceBlobSha1: blob(text), expectedQuestionCount: 5, scope: "PARTIAL_UIDS", fieldScope: "TYPE_ONLY",
    approval: { type: DIRECT_JUDGMENT, metadataReviewed: true, reviewPassCount: 1, approvedBy: "fixture-reviewer", judge: "dots",
      decisionRef: { document: DECISION_DOCUMENT, section: SECTION },
      resultSource: { branch: "data/type-judgment-c-20261116", commit: "a".repeat(40), file: "docs/plans/archive-one-route-upgrade/type-results-c/fixture.jsonl" }, evidenceRefs },
    items, ...over });
  const run = (req, opts = {}) => registerReviewedExamV2({ root, request: req, ...opts });
  const bytes = () => ({ meta: fs.readFileSync(path.join(root, META)), identity: fs.readFileSync(path.join(root, IDENTITY)), source: fs.readFileSync(path.join(root, `archive/exams/${SOURCE}`)) });
  return { root, put, read, request, item, run, bytes, records, questions, text, evidenceRefs, base, rows: () => read(META).records };
}

test("PT and TPL are registered; unit, difficulty and every other field and status stay byte-identical", t => {
  const f = fixture(t), before = f.bytes(), rowsBefore = f.rows();
  const req = f.request([f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" }), f.item(2, { problemTypeKey: "PT_A", templateKey: "TPL_A" })]);
  const result = f.run(req, { write: true });
  assert.equal(result.status, "PASS");
  assert.equal(result.typeApprovals, 2);
  assert.equal(result.fieldScope, "TYPE_ONLY");
  assert.equal(result.runtimeMaterialized, 0);
  const rowsAfter = f.rows();
  for (const n of [1, 2]) {
    const row = rowsAfter[n - 1];
    assert.equal(row.problemTypeKey, "PT_A");
    assert.equal(row.templateKey, "TPL_A");
    assert.equal(row.fieldStatus.problemType, TYPE_FIELD_STATUS);
    assert.equal(row.fieldStatus.template, TYPE_FIELD_STATUS);
    assert.equal(row.typeApproval.approvalType, DIRECT_JUDGMENT);
    assert.equal(row.typeApproval.reviewPassCount, 1);
    assert.equal(row.typeApproval.judge, "dots");
    assert.match(row.typeApproval.rationale, /결정적 단계/);
    assert.equal(row.typeApproval.receipt, `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${req.requestId}.json`);
  }
  for (let i = 0; i < 5; i++) assert.deepEqual(withoutType(rowsAfter[i]), withoutType(rowsBefore[i]), `row ${i + 1} other fields`);
  for (const n of [3, 4, 5]) assert.deepEqual(rowsAfter[n - 1], rowsBefore[n - 1], `untouched row ${n}`);
  assert.equal(rowsAfter[0].metadataStatus, "registration_pending_semantic_review");
  assert.equal(rowsAfter[0].fieldStatus.standardUnit, "manual_review_pending");
  assert.equal(rowsAfter[0].fieldStatus.difficulty, "source_unreviewed");
  assert.equal(rowsAfter[0].difficultyBucket, 3);
  assert.deepEqual(fs.readFileSync(path.join(f.root, IDENTITY)), before.identity, "identity map untouched");
  assert.deepEqual(fs.readFileSync(path.join(f.root, `archive/exams/${SOURCE}`)), before.source, "exam source untouched");
  assert.deepEqual(fs.readdirSync(path.join(f.root, "archive/data/meta-foundation/runtime")), [], "no runtime row is created");
  const receipt = f.read(`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${req.requestId}.json`);
  assert.equal(receipt.schemaVersion, "archive-reviewed-exam-meta-registration-v2");
  assert.equal(receipt.fieldScope, "TYPE_ONLY");
  assert.equal(receipt.typeRecords.length, 2);
  assert.equal(receipt.approval.type, DIRECT_JUDGMENT);
  assert.deepEqual(receipt.rowBindingCounts, { exact: 1, content: 1, stale: 0 });
});

test("PT only is accepted: a draft template is cleared and the template status stays pending", t => {
  const f = fixture(t);
  f.run(f.request([f.item(1, { problemTypeKey: "PT_B", templateKey: null }), f.item(2, { problemTypeKey: "PT_A" })]), { write: true });
  const [r1, r2] = f.rows();
  assert.equal(r1.problemTypeKey, "PT_B");
  assert.equal(r1.templateKey, "");
  assert.equal(r1.fieldStatus.problemType, TYPE_FIELD_STATUS);
  assert.equal(r1.fieldStatus.template, "manual_review_pending");
  assert.equal(r2.templateKey, "", "the draft TPL_OLD_DRAFT is replaced, not kept under another PT");
  assert.equal(r2.fieldStatus.template, "manual_review_pending");
  assert.equal(r2.typeApproval.priorType.templateKey, "TPL_OLD_DRAFT");
});

test("explicit hold counters are recomputed, row-level counters are not touched", t => {
  const f = fixture(t, { rowMutations: {} });
  const meta = f.read(META);
  meta.counts.explicitProblemTypeHolds = f.rows().filter(r => r.fieldStatus.problemType === "manual_review_pending").length;
  meta.counts.explicitTemplateHolds = f.rows().filter(r => r.fieldStatus.template === "manual_review_pending").length;
  f.put(META, meta);
  f.run(f.request([f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" })]), { write: true });
  const after = f.read(META);
  assert.equal(after.counts.explicitProblemTypeHolds, after.records.filter(r => r.fieldStatus.problemType === "manual_review_pending").length);
  assert.equal(after.counts.explicitTemplateHolds, after.records.filter(r => r.fieldStatus.template === "manual_review_pending").length);
  assert.equal(after.counts.records, 5);
});

test("a type judgment without a template key replays and verifies (absent key is not drift)", t => {
  const f = fixture(t);
  const req = f.request([f.item(1, { problemTypeKey: "PT_A" })]);
  const meta = f.read(META);
  delete meta.records[0].templateKey; // real rows without a template have no such key
  f.put(META, meta);
  f.run(req, { write: true });
  assert.equal(f.run(req, { verifyProjection: true }).consumerSearchStatus, "TYPE_FIELDS_VERIFIED");
});

test("a re-run is an idempotent replay and verifies; later drift of a registered type is detected", t => {
  const f = fixture(t);
  const req = f.request([f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" })]);
  f.run(req, { write: true });
  const written = f.bytes();
  const again = f.run(req, { write: true });
  assert.equal(again.replay, true);
  assert.deepEqual(again.plannedPaths, []);
  assert.deepEqual(f.bytes(), written, "replay writes nothing");
  const verified = f.run(req, { verifyProjection: true });
  assert.equal(verified.consumerSearchStatus, "TYPE_FIELDS_VERIFIED");
  assert.equal(verified.consumerLanes.directTypeJudgment, 1);
  const meta = f.read(META);
  meta.records[0].problemTypeKey = "PT_B";
  f.put(META, meta);
  assert.throws(() => f.run(req, { verifyProjection: true }), /registered type metadata drift/);
  const taxonomyPath = `${f.base}/taxonomy.json`, taxonomy = f.read(taxonomyPath);
  meta.records[0].problemTypeKey = "PT_A";
  f.put(META, meta);
  taxonomy.problemTypes.find(p => p.problemTypeKey === "PT_A").status = "RETIRED";
  f.put(taxonomyPath, taxonomy);
  assert.throws(() => f.run(req, { verifyProjection: true }), /TPL parent missing: TPL_A/);
  assert.throws(() => f.run({ ...req, items: [{ ...req.items[0], rationale: "다른 근거 문장입니다" }] }), /requestId reused with different content/);
});

test("an already approved type is never overwritten, and no file is written", t => {
  const f = fixture(t), before = f.bytes();
  assert.throws(() => f.run(f.request([f.item(4, { problemTypeKey: "PT_B", templateKey: "TPL_B" })]), { write: true }), /type already approved: uid4\.problemType=approved_review2/);
  assert.deepEqual(f.bytes(), before);
  assert.equal(fs.existsSync(path.join(f.root, "archive/data/meta-foundation/evidence")), false);
});

test("statuses other than an unapproved type are not overwritten while the field holds a value (hold, adjudicated)", t => {
  for (const status of ["meta_semantic_hold", "r2e_adjudicated", "EVIDENCE_DEBT"]) {
    const f = fixture(t, { rowMutations: { 1: { problemTypeKey: "PT_B", fieldStatus: { problemType: status, template: "manual_review_pending" } } } });
    assert.throws(() => f.run(f.request([f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" })]), { write: true }), /type field status is not overwritable/);
  }
});

// A status is a tag on a value: a field with no value has nothing to protect (decision: value present -> use it; only real defects block).
for (const [label, blank] of [["empty string", ""], ["null", null]]) {
  test(`an approved_semantic_review row whose type and template values are blank (${label}) is filled, and only then`, t => {
    const sem = { problemType: "approved_semantic_review", template: "approved_semantic_review" };
    const f = fixture(t, { rowMutations: { 1: { problemTypeKey: blank, templateKey: blank, fieldStatus: { ...sem } } } });
    const others = f.rows()[0];
    f.run(f.request([f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" })]), { write: true });
    const row = f.rows()[0];
    assert.equal(row.problemTypeKey, "PT_A");
    assert.equal(row.templateKey, "TPL_A");
    assert.equal(row.fieldStatus.problemType, TYPE_FIELD_STATUS);
    assert.equal(row.fieldStatus.template, TYPE_FIELD_STATUS);
    assert.equal(row.typeApproval.priorType.problemTypeStatus, "approved_semantic_review", "the old tag is kept in the approval record");
    assert.equal(row.standardUnitKey, others.standardUnitKey);
    // PT-only: the template stays blank and keeps its old tag
    const g = fixture(t, { rowMutations: { 1: { problemTypeKey: blank, templateKey: blank, fieldStatus: { ...sem } } } });
    g.run(g.request([g.item(1, { problemTypeKey: "PT_A" })]), { write: true });
    assert.equal(g.rows()[0].fieldStatus.problemType, TYPE_FIELD_STATUS);
    assert.equal(g.rows()[0].fieldStatus.template, "approved_semantic_review");
  });
}

test("an approved row that holds a value is still never overwritten; a blank field does not open the field that holds one", t => {
  const sem = "approved_semantic_review";
  // type value present, approved
  const a = fixture(t, { rowMutations: { 1: { problemTypeKey: "PT_B", fieldStatus: { problemType: sem, template: sem } } } }), aBefore = a.bytes();
  assert.throws(() => a.run(a.request([a.item(1, { problemTypeKey: "PT_A" })]), { write: true }), /type already approved: uid1\.problemType=approved_semantic_review/);
  assert.deepEqual(a.bytes(), aBefore);
  // type blank, template value present and approved: the template field stays final, so the request is refused as a whole
  const b = fixture(t, { rowMutations: { 1: { problemTypeKey: "", templateKey: "TPL_B", fieldStatus: { problemType: sem, template: sem } } } }), bBefore = b.bytes();
  assert.throws(() => b.run(b.request([b.item(1, { problemTypeKey: "PT_B", templateKey: "TPL_B" })]), { write: true }), /type already approved: uid1\.template=approved_semantic_review/);
  assert.deepEqual(b.bytes(), bBefore);
  // a request that claims "blank" for a field that actually holds a value
  const c = fixture(t, { rowMutations: { 1: { problemTypeKey: "PT_B", fieldStatus: { problemType: sem, template: sem } } } });
  assert.throws(() => c.run(c.request([c.item(1, { problemTypeKey: "PT_A" }, { before: { problemTypeKey: "", templateKey: "" } })])), /before mismatch: uid1\.problemTypeKey/);
});

test("a type field that holds a key the registry does not have is not protected: an approved old key is replaced and kept in priorType; an ACTIVE registered key stays protected", t => {
  const sem = "approved_semantic_review";
  const a = fixture(t, { rowMutations: { 1: { problemTypeKey: "OLD_KEY", templateKey: "OLD_TPL", fieldStatus: { problemType: sem, template: sem } } } });
  a.run(a.request([a.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" }, { before: { problemTypeKey: "OLD_KEY", templateKey: "OLD_TPL" } })]), { write: true });
  const row = a.read("archive/data/question_metadata.json").records.find(r => r.questionUid === "uid1");
  assert.equal(row.problemTypeKey, "PT_A");
  assert.equal(row.fieldStatus.problemType, "approved_direct_judgment");
  assert.deepEqual(row.typeApproval.priorType, { problemTypeKey: "OLD_KEY", templateKey: "OLD_TPL", problemTypeStatus: sem, templateStatus: sem });
  // the old value must still be named in `before`
  const b = fixture(t, { rowMutations: { 1: { problemTypeKey: "OLD_KEY", fieldStatus: { problemType: sem, template: sem } } } });
  assert.throws(() => b.run(b.request([b.item(1, { problemTypeKey: "PT_A" }, { before: { problemTypeKey: "", templateKey: "" } })]), { write: true }), /before mismatch: uid1\.problemTypeKey/);
  // an ACTIVE registered key with an approved status is final (PT_B is ACTIVE in the fixture registry)
  const c = fixture(t, { rowMutations: { 1: { problemTypeKey: "PT_B", fieldStatus: { problemType: sem, template: sem } } } });
  assert.throws(() => c.run(c.request([c.item(1, { problemTypeKey: "PT_A" })]), { write: true }), /type already approved: uid1\.problemType=approved_semantic_review/);
});

test("filling a blank approved row still needs every other check: course, registry and the judged text", t => {
  const blankRow = { problemTypeKey: "", templateKey: "", fieldStatus: { problemType: "approved_semantic_review", template: "approved_semantic_review" } };
  const f = fixture(t, { rowMutations: { 1: blankRow } });
  assert.throws(() => f.run(f.request([f.item(1, { problemTypeKey: "PT_A" }, { scope: { curriculum: "2022", standardCourse: "중2 수학" } })])), /course mismatch/);
  assert.throws(() => f.run(f.request([f.item(1, { problemTypeKey: "PT_C" })])), /ACTIVE curriculum binding missing/);
  const req = f.request([f.item(1, { problemTypeKey: "PT_A" })]);
  editSource(f, 1, { content: "다른 발문" });
  assert.throws(() => f.run(req, { write: true }), /stem or choices differ from the judged text.*uid1/);
});

test("a row with a receipt on its other fields takes a type while its type is still empty; a taxonomy HOLD row is refused", t => {
  const withReceipt = fixture(t, { rowMutations: { 1: { metadataApprovalType: "REVIEW2" } } });
  withReceipt.run(withReceipt.request([withReceipt.item(1, { problemTypeKey: "PT_A" })]), { write: true });
  assert.equal(withReceipt.rows()[0].problemTypeKey, "PT_A");
  assert.equal(withReceipt.rows()[0].metadataApprovalType, "REVIEW2", "the other fields' approval type is untouched");
  // the same row with an already approved type is still final
  const approved = fixture(t, { rowMutations: { 1: { metadataApprovalType: "REVIEW2", problemTypeKey: "PT_B", templateKey: "TPL_B", fieldStatus: { problemType: "approved_review2", template: "approved_review2" } } } });
  assert.throws(() => approved.run(approved.request([approved.item(1, { problemTypeKey: "PT_A" })])), /type already approved/);
  // a row-level taxonomy HOLD is no reason to refuse a judged type (the hold stays on the row's other fields)
  const held = fixture(t, { rowMutations: { 1: { foundationTaxonomyStatus: "HOLD" } } });
  held.run(held.request([held.item(1, { problemTypeKey: "PT_A" })]), { write: true });
  assert.equal(held.rows()[0].problemTypeKey, "PT_A");
  assert.equal(held.rows()[0].foundationTaxonomyStatus, "HOLD", "the hold on the row is untouched");
});

test("receipt replay ignores the type fields a DIRECT_JUDGMENT added to a row whose receipt recorded no type, and nothing else", () => {
  const recorded = { questionUid: "u", problemTypeKey: "", templateKey: "", standardUnitKey: "U1", metadataApprovalType: "REVIEW2",
    fieldStatus: { standardUnit: "approved_review2", problemType: "manual_review_pending", template: "manual_review_pending" } };
  const typed = { ...structuredClone(recorded), problemTypeKey: "PT_A", templateKey: "TPL_A",
    fieldStatus: { ...recorded.fieldStatus, problemType: "approved_direct_judgment", template: "approved_direct_judgment" }, typeApproval: { approvalType: "DIRECT_JUDGMENT" } };
  assert.equal(receiptRecordMatchesRow(recorded, recorded), true);
  assert.equal(receiptRecordMatchesRow(typed, recorded), true);
  assert.equal(receiptRecordMatchesRow({ ...typed, standardUnitKey: "U2" }, recorded), false, "any other drift still fails");
  assert.equal(receiptRecordMatchesRow({ ...typed, fieldStatus: { ...typed.fieldStatus, standardUnit: "manual_review_pending" } }, recorded), false);
  assert.equal(receiptRecordMatchesRow({ ...typed, typeApproval: { approvalType: "OTHER" } }, recorded), false, "only a DIRECT_JUDGMENT type is excused");
  assert.equal(receiptRecordMatchesRow({ ...recorded, problemTypeKey: "PT_A" }, recorded), false, "a type without a DIRECT_JUDGMENT is drift");
  const withOwnType = { ...recorded, problemTypeKey: "PT_B", fieldStatus: { ...recorded.fieldStatus, problemType: "approved_review2" } };
  assert.equal(receiptRecordMatchesRow({ ...withOwnType, problemTypeKey: "PT_A", typeApproval: { approvalType: "DIRECT_JUDGMENT" } }, withOwnType), false, "a receipt's own type is never replaced");
  assert.equal(receiptRecordMatchesRow(undefined, recorded), false);
});

test("registry checks stay strict: unknown or inactive PT, TPL of another PT, missing binding, wrong curriculum or course", t => {
  const f = fixture(t);
  const refused = (after, pattern, over = {}) => assert.throws(() => f.run(f.request([f.item(1, after, over)])), pattern);
  refused({ problemTypeKey: "PT_NOPE" }, /inactive\/missing PT: PT_NOPE/);
  refused({ problemTypeKey: "PT_OFF" }, /inactive\/missing PT: PT_OFF/);
  refused({ problemTypeKey: "PT_A", templateKey: "TPL_B" }, /TPL parent mismatch: TPL_B/);
  refused({ problemTypeKey: "PT_A", templateKey: "TPL_NOPE" }, /inactive\/missing TPL: TPL_NOPE/);
  refused({ problemTypeKey: "PT_C" }, /ACTIVE curriculum binding missing: 2022\/중1 수학\/PT_C/);
  refused({ problemTypeKey: "PT_A" }, /curriculum mismatch|ACTIVE curriculum binding missing/, { scope: { curriculum: "2015", standardCourse: COURSE } });
  refused({ problemTypeKey: "PT_A" }, /course mismatch/, { scope: { curriculum: "2022", standardCourse: "중2 수학" } });
  refused({ problemTypeKey: "PT_A" }, /scope\.curriculum/, { scope: { curriculum: "", standardCourse: COURSE } });
});

test("before must equal the current type values (empty forms are equivalent)", t => {
  const f = fixture(t);
  assert.throws(() => f.run(f.request([f.item(2, { problemTypeKey: "PT_A" }, { before: { problemTypeKey: "PT_A", templateKey: null } })])), /before mismatch: uid2\.problemTypeKey/);
  assert.throws(() => f.run(f.request([f.item(1, { problemTypeKey: "PT_A" }, { before: { problemTypeKey: "PT_A", templateKey: null } })])), /before mismatch: uid1\.problemTypeKey/);
  assert.throws(() => f.run(f.request([f.item(1, { problemTypeKey: "PT_A" }, { before: { problemTypeKey: null } })])), /before required: uid1\.templateKey/);
  assert.equal(f.run(f.request([f.item(1, { problemTypeKey: "PT_A" }, { before: { problemTypeKey: "", templateKey: "" } })])).totalQuestions, 1);
});

test("the judgment is bound to each question's stem and choices, not to the file blob", t => {
  const f = fixture(t);
  const ok = f.item(1, { problemTypeKey: "PT_A" });
  // a wrong or absent file blob is not a reason to refuse; a wrong or absent text fingerprint is
  assert.equal(f.run({ ...f.request([ok]), expectedSourceBlobSha1: "0".repeat(40) }).totalQuestions, 1);
  assert.throws(() => f.run(f.request([{ ...ok, textBindingFingerprint: "1".repeat(64) }])), /stem or choices differ from the judged text/);
  assert.throws(() => f.run(f.request([{ ...ok, textBindingFingerprint: undefined }])), /stem or choices differ from the judged text/);
});

test("stale and content-bound rows are tagged with their binding; their own fingerprints are never rewritten", t => {
  const f = fixture(t), rowsBefore = f.rows();
  const result = f.run(f.request([f.item(1, { problemTypeKey: "PT_A" }), f.item(2, { problemTypeKey: "PT_A" }), f.item(3, { problemTypeKey: "PT_A" })]), { write: true });
  assert.deepEqual(result.rowBindingCounts, { exact: 1, content: 1, stale: 1 });
  const rows = f.rows();
  assert.deepEqual(rows.slice(0, 3).map(r => r.typeApproval.rowBinding), ["exact", "content", "stale"]);
  for (let i = 0; i < 3; i++) {
    assert.equal(rows[i].sourceFingerprint, rowsBefore[i].sourceFingerprint);
    assert.equal(rows[i].contentFingerprint, rowsBefore[i].contentFingerprint);
    assert.equal(rows[i].typeApproval.judgedContentFingerprint, fingerprints(f.questions[i]).contentFingerprint);
    assert.equal(rows[i].typeApproval.textBindingFingerprint, textFingerprint(f.questions[i]));
  }
});

test("a request carrying any other field is refused", t => {
  const f = fixture(t);
  const ok = f.item(1, { problemTypeKey: "PT_A" });
  const refused = (items, pattern, over) => assert.throws(() => f.run({ ...f.request(items), ...over }), pattern);
  refused([f.item(1, { problemTypeKey: "PT_A", difficultyBucket: 4 }, { before: { problemTypeKey: null, templateKey: null, difficultyBucket: 3 } })], /writes type fields only: uid1\.(?:before|after)\.difficultyBucket/);
  refused([f.item(1, { problemTypeKey: "PT_A", crossConceptKeys: [] })], /writes type fields only: uid1\.after\.crossConceptKeys/);
  refused([{ ...ok, typeHold: true }], /item key not allowed .*typeHold/);
  refused([{ ...ok, sourceReview: {} }], /item key not allowed .*sourceReview|source reassessment requires/);
  refused([{ ...ok, targetParentRef: {} }], /item key not allowed .*targetParentRef/);
  refused([ok], /identity-only repair requires|unsupported registration mode/, { registrationMode: "IDENTITY_FINGERPRINT_ONLY" });
  refused([ok], /approval key not allowed: sourceRebind/, { approval: { ...f.request([ok]).approval, sourceRebind: {} } });
  refused([ok], /requires fieldScope TYPE_ONLY/, { fieldScope: "ALL" });
  refused([ok], /requires scope PARTIAL_UIDS|UID denominator mismatch/, { scope: undefined });
});

test("a missing or placeholder rationale (decisive step) is refused", t => {
  const f = fixture(t);
  for (const rationale of [undefined, "", "   ", "-", "TBD", "짧음"])
    assert.throws(() => f.run(f.request([f.item(1, { problemTypeKey: "PT_A" }, { rationale })])), /rationale \(decisive solution step\) required: uid1/);
});

test("approval evidence is required: decision reference, result source, one review pass", t => {
  const f = fixture(t);
  const ok = f.item(1, { problemTypeKey: "PT_A" });
  const approval = f.request([ok]).approval;
  const refused = (patch, pattern) => assert.throws(() => f.run({ ...f.request([ok]), approval: { ...approval, ...patch } }), pattern);
  refused({ reviewPassCount: 2 }, /DIRECT_JUDGMENT count must be 1/);
  refused({ reviewPassCount: undefined }, /DIRECT_JUDGMENT count must be 1/);
  refused({ decisionRef: { document: DECISION_DOCUMENT, section: "존재하지 않는 절" } }, /decision section not found/);
  refused({ decisionRef: { document: "docs/agents/common.md", section: SECTION } }, /decisionRef must name/);
  refused({ resultSource: { branch: "b", commit: "xyz", file: "f" } }, /resultSource needs branch/);
  refused({ judge: "" }, /approval\.judge required/);
  refused({ evidenceRefs: [] }, /evidenceRefs required/);
});

test("new keys are added by the same request (add-only registryChanges) and bump the pack version and its runtime file", t => {
  const f = fixture(t);
  f.put("archive/data/meta-foundation/runtime/test-pack-v1.json", { packId: "TEST_PACK", packVersion: "1.0.0", runtimeVersion: "TEST_PACK@1.0.0/reviewed-exam-v2", counts: { records: 0 }, records: [] });
  const evidenceRefs = f.evidenceRefs;
  const change = (file, collection, match, after) => ({ path: file, collection, match, before: null, after, evidenceRefs });
  const registryChanges = [
    change(`${f.base}/taxonomy.json`, "problemTypes", { problemTypeKey: "PT_NEW" }, { problemTypeKey: "PT_NEW", canonicalLabelKo: "새 유형", definition: "새로 만든 유형", ownerPack: "TEST_PACK", status: "ACTIVE", sourceUnit: "UNIT_X", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }),
    change(`${f.base}/taxonomy.json`, "templates", { templateKey: "TPL_NEW" }, { templateKey: "TPL_NEW", canonicalLabelKo: "새 풀이", definition: "새로 만든 풀이", parentProblemTypeKey: "PT_NEW", status: "ACTIVE", sourceUnit: "UNIT_X", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }),
    change(`${f.base}/bindings.json`, "bindings", { curriculum: "2022", standardCourse: COURSE, standardUnitKey: "UNIT_X", subUnitKey: "SUB_X", problemTypeKey: "PT_NEW" },
      { curriculum: "2022", standardCourse: COURSE, standardUnitKey: "UNIT_X", subUnitKey: "SUB_X", problemTypeKey: "PT_NEW", status: "ACTIVE" })
  ];
  const req = f.request([f.item(1, { problemTypeKey: "PT_NEW", templateKey: "TPL_NEW" })], { registryChanges });
  const dry = f.run(req);
  assert.equal(dry.registryChangeCount, 3);
  assert.equal(f.read(`${f.base}/pack.json`).packVersion, "1.0.0", "a dry run writes nothing");
  f.run(req, { write: true });
  assert.equal(f.rows()[0].problemTypeKey, "PT_NEW");
  assert.equal(f.rows()[0].fieldStatus.problemType, TYPE_FIELD_STATUS);
  assert.ok(f.read(`${f.base}/taxonomy.json`).problemTypes.some(p => p.problemTypeKey === "PT_NEW"));
  assert.equal(f.read(`${f.base}/pack.json`).packVersion, "1.0.1");
  assert.equal(f.read("archive/data/meta-foundation/runtime/test-pack-v1.json").packVersion, "1.0.1");
  const receipt = f.read(`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${req.requestId}.json`);
  assert.equal(receipt.registryChanges.length, 3);
  assert.ok(receipt.outputDigests.some(d => d.path === `${f.base}/taxonomy.json`));
  assert.equal(f.run(req, { verifyProjection: true }).consumerSearchStatus, "TYPE_FIELDS_VERIFIED");
});

test("registryChanges that are not add-only taxonomy/binding rows are refused", t => {
  const f = fixture(t);
  const evidenceRefs = f.evidenceRefs;
  const ok = f.item(1, { problemTypeKey: "PT_A" });
  const taxonomy = `${f.base}/taxonomy.json`;
  const attempts = [
    { path: taxonomy, collection: "problemTypes", match: { problemTypeKey: "PT_A" }, before: f.read(taxonomy).problemTypes[0], after: { ...f.read(taxonomy).problemTypes[0], canonicalLabelKo: "바꾼 이름" }, evidenceRefs },
    { path: taxonomy, collection: "problemTypes", match: { problemTypeKey: "PT_X" }, before: null, after: { problemTypeKey: "PT_X", status: "DRAFT" }, evidenceRefs },
    { path: `${CANON}/registry_index.json`, collection: "activePacks", match: { id: "P2" }, before: null, after: { id: "P2", version: "1.0.0", status: "ACTIVE" }, evidenceRefs },
    { path: MASTER, collection: "$", match: { key: "UNIT_Y" }, before: null, after: { key: "UNIT_Y", keyType: "standardUnitKey", labelKo: "새 단원", status: "active" }, evidenceRefs }
  ];
  for (const attempt of attempts) assert.throws(() => f.run(f.request([ok], { registryChanges: [attempt] })), /may only add ACTIVE problemTypes\/templates\/bindings/);
});

test("other request lanes keep their contract: a v2 request without DIRECT_JUDGMENT is not routed here", t => {
  const f = fixture(t);
  const req = f.request([f.item(1, { problemTypeKey: "PT_A" })]);
  assert.throws(() => f.run({ ...req, approval: { ...req.approval, type: "REVIEW2", reviewPassCount: 2 } }), error => !/direct judgment/.test(error.message));
  assert.throws(() => f.run({ ...req, approval: { ...req.approval, type: "NOT_A_TYPE" } }), /metadata approval required/);
});

// Read-only dry run on the real data: the lane must accept a real unit-unapproved row of the real main data, plan only the
// metadata file and its receipt, and leave everything else alone. It picks its inputs from the data (no fixed counts).
test("dry run on the real repository data plans only the metadata file and the receipt", { timeout: 600000 }, t => {
  const meta = JSON.parse(fs.readFileSync(path.join(repo, META), "utf8"));
  const registry = JSON.parse(fs.readFileSync(path.join(repo, `${CANON}/registry_index.json`), "utf8"));
  const bindings = new Map();
  for (const pack of registry.activePacks) {
    const dir = `${CANON}/packs/${pack.id.toLowerCase().replaceAll("_", "-")}`;
    const bound = JSON.parse(fs.readFileSync(path.join(repo, `${dir}/bindings.json`), "utf8")).bindings.filter(b => b.status === "ACTIVE");
    for (const b of bound) if (!bindings.has(`${b.curriculum}|${b.standardCourse}`)) bindings.set(`${b.curriculum}|${b.standardCourse}`, b);
  }
  const boundTypeless = r => !r.problemTypeKey && !r.metadataApprovalType && (r.curriculum || r.curriculumKey) &&
    bindings.has(`${r.curriculum || r.curriculumKey}|${r.standardCourse}`) && !String(r.foundationTaxonomyStatus || "").startsWith("HOLD");
  // Prefer the original sample (pending semantic review, both type fields pending). The registrations of the type data batches
  // consume such rows, so fall back to any other typeless, receipt-less row of a bound course (the lane fills an empty type field
  // whatever its status tag says). With no such row left there is nothing to dry-run on the real data: skip, never relax the assertions below.
  const wanted = meta.records.find(r => boundTypeless(r) && r.metadataStatus === "registration_pending_semantic_review" &&
    r.fieldStatus?.problemType === "manual_review_pending" && r.fieldStatus?.template === "manual_review_pending") ||
    meta.records.find(boundTypeless);
  if (!wanted) { t.skip("the real data has no typeless, receipt-less row of a bound course left (the type data batches filled them); the lane is covered by the fixture tests above"); return; }
  const binding = bindings.get(`${wanted.curriculum || wanted.curriculumKey}|${wanted.standardCourse}`);
  const bytes = fs.readFileSync(path.join(repo, "archive/exams", wanted.sourceArchiveFile));
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  const q = bank[wanted.sourceOrdinal - 1];
  const gitBlob = blob(bytes);
  const approvalRef = path.join(repo, "docs/agents/metadata.md");
  const request = { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", requestId: "type-judgment-real-dry-run", examUid: wanted.sourceArchiveFile,
    sourceArchiveFile: wanted.sourceArchiveFile, expectedSourceBlobSha1: gitBlob, expectedQuestionCount: bank.length, scope: "PARTIAL_UIDS", fieldScope: "TYPE_ONLY",
    approval: { type: DIRECT_JUDGMENT, metadataReviewed: true, reviewPassCount: 1, approvedBy: "dry-run", judge: "dry-run",
      decisionRef: { document: DECISION_DOCUMENT, section: SECTION }, resultSource: { branch: "b", commit: "b".repeat(40), file: "f" },
      evidenceRefs: [{ path: "docs/agents/metadata.md", sha256: hash(fs.readFileSync(approvalRef)) }] },
    items: [{ questionUid: wanted.questionUid, sourceOrdinal: wanted.sourceOrdinal, before: { problemTypeKey: wanted.problemTypeKey ?? null, templateKey: wanted.templateKey ?? null },
      after: { problemTypeKey: binding.problemTypeKey }, rationale: "실제 데이터 모의 실행용 근거 문장",
      scope: { curriculum: wanted.curriculum || wanted.curriculumKey, standardCourse: wanted.standardCourse }, textBindingFingerprint: textFingerprint(q),
      evidenceRefs: [{ path: "docs/agents/metadata.md", sha256: hash(fs.readFileSync(approvalRef)) }] }] };
  const metaBefore = fs.readFileSync(path.join(repo, META));
  const result = registerReviewedExamV2({ root: repo, request });
  assert.equal(result.status, "PASS");
  assert.equal(result.write, false);
  assert.deepEqual(result.plannedPaths.sort(), [META, `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/type-judgment-real-dry-run.json`].sort());
  assert.deepEqual(fs.readFileSync(path.join(repo, META)), metaBefore, "a dry run changes nothing");
  t.diagnostic(`dry run row: ${wanted.sourceArchiveFile}#${wanted.sourceOrdinal} -> ${binding.problemTypeKey} (${result.rowBindingCounts && JSON.stringify(result.rowBindingCounts)})`);
});

// ---- course aliases (archive/data/meta-foundation/course-aliases.v1.json) --------------------------------------------------------
const ALIASES = "archive/data/meta-foundation/course-aliases.v1.json";
const aliasDoc = {
  schemaVersion: "course-aliases-v1",
  spellingGroups: [{ id: "A", grade: "중1", members: [COURSE, "중1"], evidence: ["fixture"] }, { id: "B", grade: "고1", members: ["수학(상)"], evidence: ["fixture"] },
    { id: "C", grade: "중2", members: ["중2 수학"], evidence: ["fixture"] }],
  successorGroups: [{ id: "S", curricula: { "2015": ["수학(상)"], "2022": [COURSE] }, evidence: ["fixture"] }]
};
const typeRequest = f => f.request([f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" })]);

test("a row whose course is another spelling of the binding course registers, and the relation is recorded", t => {
  const f = fixture(t, { rowMutations: { 1: { standardCourse: "중1" } } });
  f.put(ALIASES, aliasDoc);
  f.run(typeRequest(f), { write: true });
  const row = f.rows()[0];
  assert.equal(row.problemTypeKey, "PT_A");
  assert.deepEqual(row.typeApproval.scope, { curriculum: "2022", standardCourse: COURSE, curriculumSource: "request", rowCourse: "중1", courseRelation: "alias" });
  assert.equal(f.run(typeRequest(f), { verifyProjection: true }).consumerSearchStatus, "TYPE_FIELDS_VERIFIED");
});

test("without the alias data the same spelling difference is refused (unchanged strict behaviour)", t => {
  const f = fixture(t, { rowMutations: { 1: { standardCourse: "중1" } } });
  assert.throws(() => f.run(typeRequest(f)), /course mismatch: uid1 row=중1 judged=중1 수학/);
});

test("a key of a higher grade than the row's course is refused even with the alias data", t => {
  const f = fixture(t, { rowMutations: { 1: { standardCourse: "중1" } } });
  f.put(ALIASES, aliasDoc);
  const higher = f.request([f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" }, { scope: { curriculum: "2022", standardCourse: "중2 수학" } })]);
  assert.throws(() => f.run(higher), /course mismatch: uid1 row=중1 judged=중2 수학/);
});

test("a key of a lower grade than the row's course registers as reach, the relation is recorded, and the row curriculum is not compared", t => {
  const f = fixture(t, { rowMutations: { 1: { standardCourse: "중2 수학", curriculum: "2015" } } });
  assert.throws(() => f.run(typeRequest(f)), /course mismatch: uid1 row=중2 수학 judged=중1 수학/, "without the alias data a grade cannot be told");
  f.put(ALIASES, aliasDoc);
  f.run(typeRequest(f), { write: true });
  const row = f.rows()[0];
  assert.equal(row.problemTypeKey, "PT_A");
  assert.deepEqual(row.typeApproval.scope, { curriculum: "2022", standardCourse: COURSE, curriculumSource: "row", rowCourse: "중2 수학", courseRelation: "reach" });
  assert.equal(f.run(typeRequest(f), { verifyProjection: true }).consumerSearchStatus, "TYPE_FIELDS_VERIFIED", "the receipt replays");
  // a wrongly filed higher row course lifts the ceiling, it does not refuse the key
  const g = fixture(t, { rowMutations: { 1: { standardCourse: "수학(상)" } } });
  g.put(ALIASES, { ...aliasDoc, successorGroups: [] });
  g.run(typeRequest(g), { write: true });
  assert.equal(g.rows()[0].typeApproval.scope.courseRelation, "reach");
});

test("the same subject of the other curriculum is accepted only through a successor group, and the row curriculum may differ then", t => {
  const f = fixture(t, { rowMutations: { 1: { standardCourse: "수학(상)", curriculum: "2015", curriculumKey: "2015" } } });
  assert.throws(() => f.run(typeRequest(f)), /course mismatch: uid1 row=수학\(상\)/);
  f.put(ALIASES, aliasDoc);
  f.run(typeRequest(f), { write: true });
  assert.equal(f.rows()[0].typeApproval.scope.courseRelation, "successor");
  // an alias relation still compares the curriculum of the row
  const g = fixture(t, { rowMutations: { 1: { standardCourse: "중1", curriculum: "2015" } } });
  g.put(ALIASES, aliasDoc);
  assert.throws(() => g.run(typeRequest(g)), /curriculum mismatch: uid1 row=2015 judged=2022/);
});

// ---- pack scope: values may be added, nothing else about a pack -----------------------------------------------------------------
function packScopeFixture(t) {
  // The row is a 2015 question; the only binding of PT_A is 2015 too, but the owner pack declares only 2022: the binding is out of scope.
  const f = fixture(t, { rowMutations: { 1: { curriculum: "2015", curriculumKey: "2015" } } });
  f.put("archive/data/meta-foundation/runtime/test-pack-v1.json", { packId: "TEST_PACK", packVersion: "1.0.0", runtimeVersion: "TEST_PACK@1.0.0/reviewed-exam-v2", counts: { records: 0 }, records: [] });
  const bindings = f.read(`${f.base}/bindings.json`);
  bindings.bindings.push({ curriculum: "2015", standardCourse: COURSE, standardUnitKey: "UNIT_X", subUnitKey: "SUB_X", problemTypeKey: "PT_A", status: "ACTIVE" });
  f.put(`${f.base}/bindings.json`, bindings);
  const pack = f.read(`${f.base}/pack.json`);
  const packChange = after => ({ path: `${f.base}/pack.json`, before: pack, after, evidenceRefs: f.evidenceRefs });
  const item = f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" }, { scope: { curriculum: "2015", standardCourse: COURSE } });
  return { f, pack, packChange, item };
}

test("a binding outside the owner pack's declared scope is refused until the same request widens the pack (values appended only)", t => {
  const { f, pack, packChange, item } = packScopeFixture(t);
  assert.throws(() => f.run(f.request([item])), /binding ownerPack scope missing: 2015\/중1 수학\/PT_A/);
  const req = f.request([item], { registryChanges: [packChange({ ...pack, curricula: [...pack.curricula, "2015"] })] });
  f.run(req, { write: true });
  assert.deepEqual(f.read(`${f.base}/pack.json`).curricula, ["2022", "2015"]);
  assert.equal(f.read(`${f.base}/pack.json`).packVersion, "1.0.1", "the planner bumps the pack version");
  assert.equal(f.read("archive/data/meta-foundation/runtime/test-pack-v1.json").packVersion, "1.0.1");
  assert.equal(f.rows()[0].problemTypeKey, "PT_A");
  assert.equal(f.run(req, { verifyProjection: true }).consumerSearchStatus, "TYPE_FIELDS_VERIFIED");
});

test("pack changes that remove, replace, reorder or touch another field are refused", t => {
  const { f, pack, packChange, item } = packScopeFixture(t);
  const attempts = [
    { ...pack, curricula: [] },
    { ...pack, curricula: ["2015"] },
    { ...pack, curricula: ["2015", "2022"] },
    { ...pack, curricula: ["2022", "2022"] },
    { ...pack, standardCourses: [COURSE, ""] },
    { ...pack, curricula: [...pack.curricula, "2015"], canonicalStatus: "RETIRED" },
    { ...pack, curricula: [...pack.curricula, "2015"], packVersion: "9.9.9" },
    { ...pack, curricula: [...pack.curricula, "2015"], ownedStandardUnitDomains: ["X"] },
    { ...pack }
  ];
  for (const after of attempts) assert.throws(() => f.run(f.request([item], { registryChanges: [packChange(after)] })), /may only add values to a pack's curricula\/standardCourses/);
  const before = f.read(`${f.base}/pack.json`);
  assert.deepEqual(before, pack, "a refused request leaves the pack untouched");
});

// ---- the lane binds to stem + choices (textBindingFingerprint), not to the exam file blob ----
function editSource(f, n, change) {
  const bank = f.questions.map(q => ({ ...q }));
  Object.assign(bank[n - 1], change);
  f.put(`archive/exams/${SOURCE}`, `window.questions = ${JSON.stringify(bank)};
`);
}
const withText = (f, items) => items.map(item => ({ ...item, textBindingFingerprint: textFingerprint(f.questions[item.sourceOrdinal - 1]) }));

test("a type the exam file's author wrote into the question does not stop the direct judgment; the record says it differs", t => {
  const f = fixture(t, { rowMutations: { 1: { metadataRevision: "meta-foundation:TEST@1" } } });
  const req = f.request(withText(f, [f.item(1, { problemTypeKey: "PT_A" })]));
  editSource(f, 1, { problemTypeKey: "PT_B", templateKey: "TPL_B" }); // embedded type of the author, different from the judged PT_A
  assert.equal(f.run(req, { write: true }).status, "PASS");
  assert.equal(f.rows()[0].problemTypeKey, "PT_A", "the judgment wins");
  assert.equal(f.rows()[0].typeApproval.examEmbeddedType.matchesRegistered, false);
  assert.equal(f.rows()[0].typeApproval.examEmbeddedType.problemTypeKey, "PT_B");
});

test("a request still registers after the exam file changed elsewhere (figure, solution, answer); the receipt records the actual file", t => {
  const f = fixture(t);
  const req = f.request(withText(f, [f.item(1, { problemTypeKey: "PT_A", templateKey: "TPL_A" }), f.item(2, { problemTypeKey: "PT_A" })]));
  editSource(f, 1, { solution: "다듬은 해설", image: "recut.png", answer: "2" }); // blob drift, same stem and choices
  const result = f.run(req, { write: true });
  assert.equal(result.status, "PASS");
  assert.equal(f.rows()[0].problemTypeKey, "PT_A");
  assert.equal(f.rows()[0].typeApproval.textBindingFingerprint, textFingerprint(f.questions[0]));
  const receipt = f.read(`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${req.requestId}.json`);
  assert.notEqual(receipt.sourceBlobSha1, req.expectedSourceBlobSha1, "the receipt records the file as it was registered");
  editSource(f, 2, { solution: "또 고친 해설" }); // replay of a registered request is history: later file edits do not break it
  assert.equal(f.run(req).replay, true);
});

test("a request is refused when a stem or the choices changed, or when an item has no text fingerprint; nothing is written", t => {
  for (const change of [{ content: "다른 발문" }, { choices: ["가", "나"] }]) {
    const f = fixture(t), before = f.bytes();
    const req = f.request(withText(f, [f.item(1, { problemTypeKey: "PT_A" }), f.item(2, { problemTypeKey: "PT_A" })]));
    editSource(f, 2, change);
    assert.throws(() => f.run(req, { write: true }), /stem or choices differ from the judged text.*uid2/);
    assert.deepEqual(f.bytes().meta, before.meta, "nothing written");
  }
  const f = fixture(t);
  assert.throws(() => f.run(f.request([{ ...f.item(1, { problemTypeKey: "PT_A" }), textBindingFingerprint: undefined }]), { write: true }), /stem or choices differ from the judged text.*uid1/);
});
