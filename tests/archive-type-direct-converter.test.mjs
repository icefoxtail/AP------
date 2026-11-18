// Converter from direct type-judgment result lines to DIRECT_JUDGMENT (TYPE_ONLY) registration requests.
// Fixture-only: a tiny in-memory repository context; no operational counts are pinned.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {
  planRequests, summarize, makeRegistry, chooseScope, courseFamily, sourceFingerprints, typeSelectable, parseCli, readResultTables,
  DECISION_SECTION, INBOX_DIR, EVIDENCE_DIR, REQUEST_SCHEMA
} from "../archive/tools/meta-foundation/build-type-judgment-requests.mjs";

const EXAM = "original/middle/m1/1mid/24_가나중_1학기_중간_중1_기출.js";
const sha1 = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const questions = [1, 2, 3, 4, 5, 6, 7].map(n => ({ id: n, content: `학생용 지문 ${n}`, choices: ["1", "2"], answer: "1", solution: `해설 ${n}`, image: "" }));
const bytes = Buffer.from(`window.questions = ${JSON.stringify(questions)};\n`);
const registry = makeRegistry({
  problemTypes: [{ problemTypeKey: "PT_A", status: "ACTIVE", ownerPack: "P1" }, { problemTypeKey: "PT_OFF", status: "INACTIVE", ownerPack: "P1" }, { problemTypeKey: "PT_HIGH", status: "ACTIVE", ownerPack: "P2" }],
  templates: [{ templateKey: "TPL_A", status: "ACTIVE", parentProblemTypeKey: "PT_A" }, { templateKey: "TPL_OTHER", status: "ACTIVE", parentProblemTypeKey: "PT_HIGH" }],
  bindings: [{ problemTypeKey: "PT_A", curriculum: "2015", standardCourse: "중1 수학", ownerPack: "P1", status: "ACTIVE" },
    { problemTypeKey: "PT_HIGH", curriculum: "2015", standardCourse: "수학(상)", ownerPack: "P2", status: "ACTIVE" }],
  packs: new Map([["P1", { curricula: ["2015"], standardCourses: ["중1 수학"] }], ["P2", { curricula: ["2015"], standardCourses: ["수학(상)"] }]])
});
const fp = n => sourceFingerprints(questions[n - 1]);
const row = (n, over = {}) => ({ questionUid: `uid${n}`, sourceArchiveFile: EXAM, sourceOrdinal: n, ...fp(n), standardCourse: "중1 수학", problemTypeKey: "", templateKey: "",
  metadataRevision: "archive-registration-sync-v1", fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" }, ...over });
const records = [
  row(1), // blank, convertible
  row(2, { problemTypeKey: "PT_DRAFT", fieldStatus: { problemType: "manual_review_pending", template: "manual_review_pending" } }), // draft value present
  row(3, { problemTypeKey: "PT_A", fieldStatus: { problemType: "approved_review2", template: "approved_review2" } }), // already approved
  row(4, { standardCourse: "중1" }), // course spelling differs from every binding
  row(5), // NEW_KEY line
  row(6), // HOLD line
  row(7, { metadataApprovalType: "REVIEW2" }) // other fields carry a receipt
];
function makeCtx(over = {}) {
  const recs = over.records || records;
  const identity = new Map(recs.map(r => [r.questionUid, { questionUid: r.questionUid, sourceArchiveFile: r.sourceArchiveFile, sourceOrdinal: r.sourceOrdinal }]));
  return { records: new Map(recs.map(r => [r.questionUid, r])), identity, identityDoc: { records: [...identity.values()] },
    rowsBySource: new Map([[EXAM, recs]]), identityCountBySource: new Map([[EXAM, recs.length]]), registry,
    readBank: () => ({ bank: JSON.parse(JSON.stringify(questions)), bytes }), blobOf: (file, b) => sha1(b), ...over.ctx };
}
const line = (n, extra = {}) => ({ uid: `uid${n}`, exam: `archive/exams/${EXAM}`, no: n, decision: "PICK", pt: "PT_A", tpl: "TPL_A", step: `결정 단계 문장 ${n}`, note: "메모", figure: false, check: "OK",
  _source: { branch: "data/type-judgment-c", commit: "a".repeat(40), file: "docs/plans/x/type-results-c/m1.jsonl" }, ...extra });
const lines = () => [line(1), line(2), line(3), line(4), line(5, { decision: "NEW_KEY", pt: null, tpl: null }), line(6, { decision: "HOLD", pt: null, tpl: null }), line(7)];
const plan = (over = {}) => planRequests({ ctx: makeCtx(), resultRows: lines(), approvedBy: "테스트 결정", ...over });

test("PICK line of an empty-type row becomes one DIRECT_JUDGMENT request item with values copied as judged", () => {
  const { requests } = plan();
  assert.equal(requests.length, 1);
  const r = requests[0];
  assert.equal(r.schemaVersion, REQUEST_SCHEMA);
  assert.equal(r.approval.type, "DIRECT_JUDGMENT");
  assert.equal(r.fieldScope, "TYPE_ONLY");
  assert.equal(r.scope, "PARTIAL_UIDS");
  assert.equal(r.approval.reviewPassCount, 1);
  assert.equal(r.approval.decisionRef.section, DECISION_SECTION);
  assert.equal(r.sourceArchiveFile, EXAM);
  assert.equal(r.expectedQuestionCount, questions.length);
  assert.equal(r.expectedSourceBlobSha1, sha1(bytes));
  assert.deepEqual(r.items.map(i => i.questionUid), ["uid1"]);
  const item = r.items[0];
  assert.deepEqual(item.before, { problemTypeKey: "", templateKey: "" });
  assert.deepEqual(item.after, { problemTypeKey: "PT_A", templateKey: "TPL_A" });
  assert.equal(item.rationale, "결정 단계 문장 1");
  assert.deepEqual(item.scope, { curriculum: "2015", standardCourse: "중1 수학" });
  assert.deepEqual(item.judgedFingerprints, fp(1));
  assert.deepEqual(Object.keys(item).sort(), ["after", "before", "evidenceRefs", "judgedFingerprints", "questionUid", "rationale", "scope", "sourceOrdinal"]);
  assert.deepEqual(r.approval.resultSource, { branch: "data/type-judgment-c", commit: "a".repeat(40), file: "docs/plans/x/type-results-c/m1.jsonl" });
});

test("rows that already hold a value, other decisions and refused rows are skipped with a counted reason", () => {
  const { requests, skipped } = plan();
  const summary = summarize({ requests, skipped, resultLines: lines().length });
  assert.equal(summary.items, 1);
  assert.equal(summary.skippedLines, 6);
  assert.deepEqual(summary.skippedByReason, {
    DECISION_HOLD: 1, DECISION_NEW_KEY_NOT_HANDLED: 1, ROW_HAS_APPROVAL_RECEIPT: 1, SCOPE_COURSE_SPELLING_NEEDS_ALIAS: 1, TYPE_ALREADY_PRESENT: 2 });
  assert.ok(skipped.every(s => s.uid && s.reason));
  // every line is accounted for: converted + skipped
  assert.equal(summary.items + summary.skippedLines, lines().length);
});

test("no line is dropped silently: duplicate lines, unknown rows and registry defects are counted", () => {
  const rows = [line(1), line(1), line(5, { pt: "PT_OFF", tpl: null }), line(5, { uid: "uid-missing" }), line(6, { tpl: "TPL_OTHER" }), line(7, { step: "-" })];
  const ctx = makeCtx({ records: records.map(r => r.sourceOrdinal === 7 ? { ...r, metadataApprovalType: undefined } : r) });
  const { requests, skipped } = planRequests({ ctx, resultRows: rows, approvedBy: "x" });
  const by = summarize({ requests, skipped, resultLines: rows.length }).skippedByReason;
  assert.equal(requests[0].items.length, 1);
  assert.deepEqual(by, { DUPLICATE_RESULT_LINE: 1, PT_NOT_ACTIVE_IN_REGISTRY: 1, RATIONALE_MISSING: 1, ROW_NOT_IN_CANONICAL_METADATA: 1, TPL_PARENT_DIFFERS_FROM_PT: 1 });
});

test("a PT-only judgment writes no templateKey", () => {
  const { requests } = planRequests({ ctx: makeCtx(), resultRows: [line(1, { tpl: null })], approvedBy: "x" });
  assert.deepEqual(requests[0].items[0].after, { problemTypeKey: "PT_A" });
});

test("same inputs give byte-identical files; changed judgment text gives a new requestId and ledger", () => {
  const a = plan(), b = plan();
  assert.deepEqual([...a.files], [...b.files]);
  const changed = planRequests({ ctx: makeCtx(), resultRows: [line(1, { step: "다른 근거 문장입니다" })], approvedBy: "테스트 결정" });
  assert.notEqual(changed.requests[0].requestId, a.requests[0].requestId);
  const [requestPath, ledgerPath] = [...a.files.keys()];
  assert.ok(requestPath.startsWith(`${INBOX_DIR}/`) || ledgerPath.startsWith(`${INBOX_DIR}/`));
  const ledgerKey = [...a.files.keys()].find(k => k.startsWith(`${EVIDENCE_DIR}/`));
  const ref = a.requests[0].approval.evidenceRefs[0];
  assert.equal(ref.path, ledgerKey);
  assert.equal(ref.sha256, crypto.createHash("sha256").update(a.files.get(ledgerKey)).digest("hex"));
  assert.deepEqual(a.requests[0].items[0].evidenceRefs, [ref]);
});

test("before is read from the current canonical row, not from the result table", () => {
  const ctx = makeCtx({ records: records.map(r => r.sourceOrdinal === 1 ? { ...r, templateKey: "" } : r) });
  const { requests } = planRequests({ ctx, resultRows: [line(1)], approvedBy: "x" });
  assert.deepEqual(requests[0].items[0].before, { problemTypeKey: "", templateKey: "" });
  // a row that gained a value since the judgment is no longer blank
  const filled = makeCtx({ records: records.map(r => r.sourceOrdinal === 1 ? { ...r, problemTypeKey: "PT_A" } : r) });
  const second = planRequests({ ctx: filled, resultRows: [line(1)], approvedBy: "x" });
  assert.equal(second.requests.length, 0);
  assert.equal(second.skipped[0].reason, "TYPE_ALREADY_PRESENT");
});

test("--exams and --limit select exams; unselected exams are not counted as skips", () => {
  assert.equal(planRequests({ ctx: makeCtx(), resultRows: lines(), exams: ["archive/exams/other.js"], approvedBy: "x" }).skipped.filter(s => s.decision === "PICK").length, 0);
  assert.equal(plan({ exams: [EXAM] }).requests.length, 1);
  assert.equal(plan({ limit: 1 }).requests.length, 1);
  const args = parseCli(["--results", "ref", "--exams", "a.js, b.js", "--limit", "3", "--dry-run"]);
  assert.deepEqual([args.exams, args.limit, args.dryRun], [["a.js", "b.js"], 3, true]);
  assert.throws(() => parseCli(["--limit", "3"]), /RESULTS_REQUIRED/);
  assert.throws(() => parseCli(["--results", "r", "--bogus"]), /INVALID_ARGUMENT/);
});

test("scope follows the strict lane: row course must equal the binding course; no course/curriculum is invented across courses", () => {
  assert.deepEqual(chooseScope(registry, { standardCourse: "중1 수학", sourceArchiveFile: EXAM }, "PT_A").scope, { curriculum: "2015", standardCourse: "중1 수학" });
  assert.deepEqual(chooseScope(registry, { sourceArchiveFile: EXAM }, "PT_A").scope, { curriculum: "2015", standardCourse: "중1 수학" }); // no course: taken from the path family
  assert.equal(chooseScope(registry, { standardCourse: "중1", sourceArchiveFile: EXAM }, "PT_A").skip, "SCOPE_COURSE_SPELLING_NEEDS_ALIAS");
  assert.equal(chooseScope(registry, { standardCourse: "중1 수학", sourceArchiveFile: EXAM }, "PT_HIGH").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  assert.equal(chooseScope(registry, { curriculum: "2022", standardCourse: "중1 수학", sourceArchiveFile: EXAM }, "PT_A").skip, "SCOPE_CURRICULUM_MISMATCH");
  assert.equal(chooseScope(registry, { standardCourse: "중1 수학" }, "PT_NONE").skip, "SCOPE_PT_HAS_NO_BINDING");
  assert.equal(courseFamily("수학Ⅰ"), courseFamily("수학I"));
  assert.notEqual(courseFamily("중2 수학"), courseFamily("중3 수학"));
});

test("an exam whose row count differs from its source is skipped as a whole", () => {
  const ctx = makeCtx({ ctx: { rowsBySource: new Map([[EXAM, records.slice(0, 3)]]) } });
  const { requests, skipped } = planRequests({ ctx, resultRows: [line(1)], approvedBy: "x" });
  assert.equal(requests.length, 0);
  assert.equal(skipped[0].reason, "EXAM_ROW_COUNT_DIFFERS_FROM_SOURCE");
});

test("selectable-by-type metric counts only rows bound to the current stem/choices/image", () => {
  const stale = records.map(r => r.sourceOrdinal === 1 ? { ...r, contentFingerprint: "f".repeat(64) } : r);
  const planned = new Map([["uid1", { pt: "PT_A", tpl: "TPL_A" }]]);
  const fresh = typeSelectable(makeCtx(), [EXAM], planned);
  assert.equal(fresh.selectableBefore, 1); // uid3 already carries an approved PT_A and is bound
  assert.equal(fresh.selectableAfter, 2);
  assert.equal(fresh.plannedSelectable, 1);
  const hidden = typeSelectable(makeCtx({ records: stale }), [EXAM], planned);
  assert.equal(hidden.selectableAfter, 1);
  assert.equal(hidden.plannedHiddenStaleBinding, 1);
});

test("result tables are read from plain folders (never repaired) and the excluded duplicate book file is ignored", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "type-results-"));
  try {
    fs.mkdirSync(path.join(dir, "type-results-c"));
    fs.writeFileSync(path.join(dir, "type-results-c", "a.jsonl"), JSON.stringify({ uid: "u1", decision: "PICK" }) + "\n\n");
    fs.writeFileSync(path.join(dir, "type-results-c", "비상_미적분1.jsonl"), JSON.stringify({ uid: "u2", decision: "PICK" }) + "\n");
    const { rows } = readResultTables(os.tmpdir(), [{ dir }]);
    assert.deepEqual(rows.map(r => r.uid), ["u1"]);
    assert.equal(rows[0]._source.file, "type-results-c/a.jsonl");
    fs.writeFileSync(path.join(dir, "type-results-c", "b.jsonl"), "{broken\n");
    assert.throws(() => readResultTables(os.tmpdir(), [{ dir }]), /BROKEN_JSONL_LINE/);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
