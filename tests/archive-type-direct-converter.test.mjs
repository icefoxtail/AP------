// Converter from direct type-judgment result lines to DIRECT_JUDGMENT (TYPE_ONLY) registration requests.
// Fixture-only: a tiny in-memory repository context; no operational counts are pinned.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import {
  planRequests, summarize, makeRegistry, chooseScope, sourceFingerprints, typeSelectable, parseCli, readResultTables,
  DECISION_SECTION, INBOX_DIR, EVIDENCE_DIR, REQUEST_SCHEMA
} from "../archive/tools/meta-foundation/build-type-judgment-requests.mjs";
import { makeCourseAliases } from "../archive/tools/meta-foundation/course-aliases.mjs";
import { textFingerprint } from "../archive/tools/meta-foundation/text-binding-lib.mjs";

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
  assert.equal(item.judgedTextFingerprint, textFingerprint(questions[0]), "the stem+choices fingerprint binds the request to the text, not to the file blob");
  assert.deepEqual(Object.keys(item).sort(), ["after", "before", "evidenceRefs", "judgedFingerprints", "judgedTextFingerprint", "questionUid", "rationale", "scope", "sourceOrdinal"]);
  assert.deepEqual(r.approval.resultSource, { branch: "data/type-judgment-c", commit: "a".repeat(40), file: "docs/plans/x/type-results-c/m1.jsonl" });
});

test("rows that already hold a value, other decisions and refused rows are skipped with a counted reason", () => {
  const { requests, skipped } = plan();
  const summary = summarize({ requests, skipped, resultLines: lines().length });
  assert.equal(summary.items, 1);
  assert.equal(summary.skippedLines, 6);
  assert.deepEqual(summary.skippedByReason, {
    DECISION_HOLD: 1, DECISION_NEW_KEY_NOT_HANDLED: 1, ROW_HAS_APPROVAL_RECEIPT: 1, SCOPE_PT_BOUND_TO_OTHER_COURSE: 1, TYPE_ALREADY_PRESENT: 2 });
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

const aliasDoc = {
  spellingGroups: [{ id: "M1", grade: "중1", members: ["중1 수학", "중1", "중1수학"], evidence: "fixture" }, { id: "M2", grade: "중2", members: ["중2 수학", "중2"], evidence: "fixture" },
    { id: "HIGH_UP", grade: "", members: ["수학(상)", "수학_상"], evidence: "fixture" }, { id: "COMMON1", grade: "", members: ["공통수학1"], evidence: "fixture" }],
  successorGroups: [{ id: "HIGH1", subject: "고1", curricula: { 2015: ["수학(상)"], 2022: ["공통수학1"] }, evidence: "fixture" }]
};
const aliases = makeCourseAliases(aliasDoc), strict = makeCourseAliases(null);

test("scope follows the strict lane and the alias file: another spelling or the successor course is accepted, another grade or subject is not", () => {
  const sc = (aliasSet, r, pt, opt) => chooseScope(registry, aliasSet, { sourceArchiveFile: EXAM, ...r }, pt, opt);
  assert.deepEqual(sc(strict, { standardCourse: "중1 수학" }, "PT_A").scope, { curriculum: "2015", standardCourse: "중1 수학" });
  assert.deepEqual(sc(aliases, {}, "PT_A").scope, { curriculum: "2015", standardCourse: "중1 수학" }); // no course: taken from the path grade
  assert.equal(sc(strict, {}, "PT_A").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE"); // without alias data a grade cannot be told
  assert.equal(sc(strict, { standardCourse: "중1" }, "PT_A").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  const spelled = sc(aliases, { standardCourse: "중1" }, "PT_A");
  assert.deepEqual(spelled.scope, { curriculum: "2015", standardCourse: "중1 수학" });
  assert.equal(spelled.relation, "alias");
  assert.equal(sc(aliases, { standardCourse: "중2" }, "PT_A").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE"); // other grade is never mixed
  assert.equal(sc(aliases, { standardCourse: "중1 수학" }, "PT_HIGH").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  assert.equal(sc(aliases, { curriculum: "2022", standardCourse: "중1 수학" }, "PT_A").skip, "SCOPE_CURRICULUM_MISMATCH");
  assert.equal(sc(aliases, { standardCourse: "중1 수학" }, "PT_NONE").skip, "SCOPE_PT_HAS_NO_BINDING");
  // successor: the row is in the 2022 course, the PT is bound in the 2015 course of the same subject; the curriculum differs on purpose
  const succ = sc(aliases, { curriculum: "2022", standardCourse: "공통수학1" }, "PT_HIGH");
  assert.deepEqual(succ.scope, { curriculum: "2015", standardCourse: "수학(상)" });
  assert.equal(succ.relation, "successor");
  assert.equal(sc(strict, { curriculum: "2022", standardCourse: "공통수학1" }, "PT_HIGH").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
});

test("a pack that does not declare the binding course is skipped by default and widened append-only on request", () => {
  const narrow = { ...makeRegistry({ problemTypes: [{ problemTypeKey: "PT_A", status: "ACTIVE", ownerPack: "P1" }], templates: [{ templateKey: "TPL_A", status: "ACTIVE", parentProblemTypeKey: "PT_A" }],
    bindings: [{ problemTypeKey: "PT_A", curriculum: "2015", standardCourse: "중1 수학", ownerPack: "P1", status: "ACTIVE" }],
    packs: new Map([["P1", { curricula: ["2015"], standardCourses: ["중2 수학"] }]]) }), packFiles: new Map([["P1", "archive/data/meta-foundation/canonical/packs/p1/pack.json"]]) };
  assert.equal(chooseScope(narrow, aliases, { standardCourse: "중1 수학" }, "PT_A").skip, "SCOPE_PACK_DOES_NOT_DECLARE_COURSE");
  const picked = chooseScope(narrow, aliases, { standardCourse: "중1 수학" }, "PT_A", { allowPackAdditions: true });
  assert.deepEqual(picked.packAddition, { packId: "P1", curricula: [], standardCourses: ["중1 수학"] });
  // the first request in name order carries the pack change; dependents carry none
  const EXAM2 = EXAM.replace("24_", "23_");
  const recs2 = records.map(r => ({ ...r, questionUid: `x${r.sourceOrdinal}`, sourceArchiveFile: EXAM2 }));
  const all = [...records, ...recs2];
  const identity = new Map(all.map(r => [r.questionUid, { questionUid: r.questionUid, sourceArchiveFile: r.sourceArchiveFile, sourceOrdinal: r.sourceOrdinal }]));
  const ctx = { records: new Map(all.map(r => [r.questionUid, r])), identity, identityDoc: { records: [...identity.values()] },
    rowsBySource: new Map([[EXAM, records], [EXAM2, recs2]]), identityCountBySource: new Map([[EXAM, 7], [EXAM2, 7]]), registry: narrow, aliases,
    readBank: () => ({ bank: JSON.parse(JSON.stringify(questions)), bytes }), blobOf: (file, b) => sha1(b) };
  const rows = [line(1), line(1, { uid: "x1", exam: `archive/exams/${EXAM2}` })];
  const { requests, skipped } = planRequests({ ctx, resultRows: rows, approvedBy: "x", allowPackAdditions: true });
  assert.equal(requests.length, 2, JSON.stringify(skipped));
  const carriers = requests.filter(r => r.requestId.startsWith("tc-")), dependents = requests.filter(r => r.requestId.startsWith("td-"));
  assert.equal(carriers.length, 1);
  assert.equal(dependents.length, 1);
  assert.equal(dependents[0].registryChanges, undefined);
  const change = carriers[0].registryChanges[0];
  assert.equal(change.path, "archive/data/meta-foundation/canonical/packs/p1/pack.json");
  assert.deepEqual(change.before, { curricula: ["2015"], standardCourses: ["중2 수학"] });
  assert.deepEqual(change.after, { curricula: ["2015"], standardCourses: ["중2 수학", "중1 수학"] });
  assert.ok([...requests].sort((a, b) => (a.requestId < b.requestId ? -1 : 1))[0] === carriers[0]); // registered first (inbox name order)
  // without the option nothing is widened and nothing converts
  assert.equal(planRequests({ ctx, resultRows: rows, approvedBy: "x" }).requests.length, 0);
});

test("rows with receipts on other fields are skipped by default and converted on request", () => {
  const dflt = plan();
  assert.equal(dflt.requests[0].items.some(i => i.questionUid === "uid7"), false);
  const opt = plan({ includeReceiptRows: true });
  assert.deepEqual(opt.requests[0].items.map(i => i.questionUid), ["uid1", "uid7"]);
});

test("a result line whose own question number differs from the row's source ordinal is skipped", () => {
  const { requests, skipped } = planRequests({ ctx: makeCtx(), resultRows: [line(1, { no: 2 }), line(2, { no: 2, pt: "PT_A" })], approvedBy: "x" });
  assert.equal(requests.length, 0);
  assert.deepEqual(skipped.map(s => s.reason), ["RESULT_NO_DIFFERS_FROM_SOURCE_ORDINAL", "TYPE_ALREADY_PRESENT"]);
});

test("judged-base check: changed stem/choices skip the row, unchanged rows pass, an unreadable base is counted as unverified", () => {
  const copy = () => JSON.parse(JSON.stringify(questions));
  const changed = copy(); changed[0].content = "다른 지문";
  const ctxFor = bank => makeCtx({ ctx: { judgedBank: () => bank } });
  let r = planRequests({ ctx: ctxFor(changed), resultRows: [line(1)], approvedBy: "x" });
  assert.equal(r.requests.length, 0);
  assert.equal(r.skipped[0].reason, "STEM_OR_CHOICES_CHANGED_SINCE_JUDGMENT");
  const choices = copy(); choices[0].choices = ["가", "나"];
  assert.equal(planRequests({ ctx: ctxFor(choices), resultRows: [line(1)], approvedBy: "x" }).requests.length, 0);
  r = planRequests({ ctx: ctxFor(copy()), resultRows: [line(1)], approvedBy: "x" });
  assert.equal(r.requests.length, 1);
  assert.deepEqual(r.stats.judgedBase, { checked: 1, unverified: 0 });
  // solution/answer changes are not a change of the question text
  const sol = copy(); sol[0].solution = "고친 해설"; sol[0].answer = "2";
  assert.equal(planRequests({ ctx: ctxFor(sol), resultRows: [line(1)], approvedBy: "x" }).requests.length, 1);
  r = planRequests({ ctx: ctxFor(null), resultRows: [line(1)], approvedBy: "x" });
  assert.equal(r.requests.length, 1);
  assert.deepEqual(r.stats.judgedBase, { checked: 0, unverified: 1 });
  // the judged fingerprints are those of the exam as the judge saw it (figure/solution may have changed since); the text fingerprint is equal by construction
  const moved = copy(); moved[0].image = "old.png"; moved[0].solution = "옛 해설";
  r = planRequests({ ctx: ctxFor(moved), resultRows: [line(1)], approvedBy: "x" });
  assert.deepEqual(r.requests[0].items[0].judgedFingerprints, sourceFingerprints(moved[0]));
  assert.equal(r.requests[0].items[0].judgedTextFingerprint, textFingerprint(questions[0]));
  assert.deepEqual([r.stats.textBound, r.stats.noTextFingerprint], [1, 0]);
});

test("new options are parsed", () => {
  const args = parseCli(["--results", "r", "--allow-pack-scope-additions", "--include-receipt-rows", "--judged-base", "auto"]);
  assert.equal(args.allowPackAdditions, true);
  assert.equal(args.includeReceiptRows, true);
  assert.equal(args.judgedBase, "auto");
  assert.equal(parseCli(["--results", "r"]).judgedBase, "auto", "the judged-base check is on by default");
  assert.equal(parseCli(["--results", "r", "--judged-base", "none"]).judgedBase, null);
  assert.throws(() => parseCli(["--results", "r", "--judged-base"]), /MISSING_VALUE/);
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
