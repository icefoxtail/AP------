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
import { createGradeBindings } from "../archive/tools/meta-foundation/grade-bindings.mjs";

const EXAM = "original/middle/m1/1mid/24_가나중_1학기_중간_중1_기출.js";
const sha1 = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const questions = [1, 2, 3, 4, 5, 6, 7].map(n => ({ id: n, content: `학생용 지문 ${n}`, choices: ["1", "2"], answer: "1", solution: `해설 ${n}`, image: "" }));
const bytes = Buffer.from(`window.questions = ${JSON.stringify(questions)};\n`);
const registry = makeRegistry({
  problemTypes: [{ problemTypeKey: "PT_A", status: "ACTIVE", ownerPack: "P1" }, { problemTypeKey: "PT_OFF", status: "INACTIVE", ownerPack: "P1" }, { problemTypeKey: "PT_HIGH", status: "ACTIVE", ownerPack: "P2" }, { problemTypeKey: "PT_DRAFT", status: "ACTIVE", ownerPack: "P1" }],
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
  assert.deepEqual(r.items.map(i => i.questionUid), ["uid1", "uid7"]);
  const item = r.items[0];
  assert.deepEqual(item.before, { problemTypeKey: "", templateKey: "" });
  assert.deepEqual(item.after, { problemTypeKey: "PT_A", templateKey: "TPL_A" });
  assert.equal(item.rationale, "결정 단계 문장 1");
  assert.deepEqual(item.scope, { curriculum: "2015", standardCourse: "중1 수학" });
  assert.equal(item.textBindingFingerprint, textFingerprint(questions[0]), "the stem+choices fingerprint binds the request to the text, not to the file blob");
  assert.deepEqual(Object.keys(item).sort(), ["after", "before", "evidenceRefs", "questionUid", "rationale", "scope", "sourceOrdinal", "textBindingFingerprint"]);
  assert.deepEqual(r.approval.resultSource, { branch: "data/type-judgment-c", commit: "a".repeat(40), file: "docs/plans/x/type-results-c/m1.jsonl" });
});

test("rows that already hold a value, other decisions and refused rows are skipped with a counted reason", () => {
  const { requests, skipped } = plan();
  const summary = summarize({ requests, skipped, resultLines: lines().length });
  assert.equal(summary.items, 2);
  assert.equal(summary.skippedLines, 5);
  assert.deepEqual(summary.skippedByReason, {
    DECISION_HOLD: 1, DECISION_NEW_KEY_NOT_HANDLED: 1, SCOPE_PT_BOUND_TO_OTHER_COURSE: 1, TYPE_ALREADY_PRESENT: 2 });
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
  assert.equal(sc(aliases, { standardCourse: "중2" }, "PT_A").relation, "reach"); // a key of a lower grade than the row's course is reached (see the reach test)
  assert.equal(sc(aliases, { standardCourse: "중1 수학" }, "PT_HIGH").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  assert.equal(sc(aliases, { curriculum: "2022", standardCourse: "중1 수학" }, "PT_A").skip, "SCOPE_CURRICULUM_MISMATCH");
  assert.equal(sc(aliases, { standardCourse: "중1 수학" }, "PT_NONE").skip, "SCOPE_PT_HAS_NO_BINDING");
  // successor: the row is in the 2022 course, the PT is bound in the 2015 course of the same subject; the curriculum differs on purpose
  const succ = sc(aliases, { curriculum: "2022", standardCourse: "공통수학1" }, "PT_HIGH");
  assert.deepEqual(succ.scope, { curriculum: "2015", standardCourse: "수학(상)" });
  assert.equal(succ.relation, "successor");
  assert.equal(sc(strict, { curriculum: "2022", standardCourse: "공통수학1" }, "PT_HIGH").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
});

test("a row that carries the other curriculum's course name falls back to the successor course instead of being refused", () => {
  const reg = makeRegistry({ problemTypes: [{ problemTypeKey: "PT_X", status: "ACTIVE", ownerPack: "P2" }], templates: [],
    bindings: [{ problemTypeKey: "PT_X", curriculum: "2022", standardCourse: "공통수학1", ownerPack: "P2", status: "ACTIVE" },
      { problemTypeKey: "PT_X", curriculum: "2015", standardCourse: "수학(상)", ownerPack: "P2", status: "ACTIVE" }],
    packs: new Map([["P2", { curricula: ["2015", "2022"], standardCourses: ["공통수학1", "수학(상)"] }]]) });
  // 2015 row named with the 2022 course: the same-course binding is 2022 only, the successor 수학(상) exists in 2015
  const r = chooseScope(reg, aliases, { sourceArchiveFile: EXAM, curriculum: "2015", standardCourse: "공통수학1" }, "PT_X");
  assert.deepEqual(r.scope, { curriculum: "2015", standardCourse: "수학(상)" });
  assert.equal(r.relation, "successor");
  // the same-course binding still wins when it exists in the row's curriculum
  const own = chooseScope(reg, aliases, { sourceArchiveFile: EXAM, curriculum: "2022", standardCourse: "공통수학1" }, "PT_X");
  assert.deepEqual(own.scope, { curriculum: "2022", standardCourse: "공통수학1" });
});

test("--exclude-uids leaves a question that another pending request already carries out of the new requests", () => {
  const { requests, skipped } = plan({ excludeUids: new Set(["uid1"]) });
  assert.equal(requests[0].items.some(i => i.questionUid === "uid1"), false);
  assert.ok(skipped.some(s => s.uid === "uid1" && s.reason === "ALREADY_IN_OTHER_REQUEST"));
  assert.equal(parseCli(["--results", "r", "--exclude-uids", "f.txt"]).excludeUidsFile, "f.txt");
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

test("a status tag does not block a blank field: approved_semantic_review with no value converts, a value that is present stays", () => {
  const sem = { problemType: "approved_semantic_review", template: "approved_semantic_review" };
  const recs = [
    row(1, { problemTypeKey: "", templateKey: "", fieldStatus: { ...sem } }), // blank string, approved tag
    row(2, { problemTypeKey: null, templateKey: null, fieldStatus: { ...sem } }), // null, approved tag
    row(3, { problemTypeKey: "PT_A", templateKey: "", fieldStatus: { ...sem } }), // type value present and approved
    row(4, { problemTypeKey: "", templateKey: "TPL_A", fieldStatus: { ...sem } }), // only the template value present and approved
    row(5, { problemTypeKey: "", templateKey: "", fieldStatus: { problemType: "meta_semantic_hold", template: "manual_review_pending" } }), // blank with a hold tag: nothing to protect
    row(6), row(7) // the exam has 7 questions; these two have no result line
  ];
  const ctx = makeCtx({ records: recs });
  const rows = [1, 2, 3, 4, 5].map(n => line(n));
  const { requests, skipped } = planRequests({ ctx, resultRows: rows, approvedBy: "x" });
  assert.deepEqual(requests[0].items.map(i => i.questionUid), ["uid1", "uid2", "uid5"]);
  for (const i of requests[0].items) assert.deepEqual(i.before, { problemTypeKey: "", templateKey: "" });
  assert.deepEqual(skipped.map(s => [s.uid, s.reason]), [["uid3", "TYPE_ALREADY_PRESENT"], ["uid4", "TYPE_ALREADY_PRESENT"]]);
  // the approved value is kept under --replace-draft-types too (counted with its own reason, not replaced)
  const rep = planRequests({ ctx, resultRows: [line(3, { pt: "PT_HIGH", tpl: null })], approvedBy: "x", replaceDraft: true });
  assert.equal(rep.requests.length, 0);
  assert.equal(rep.skipped[0].reason, "TYPE_KEPT_DIFFERS_FROM_JUDGMENT");
});

test("rows with receipts on other fields are converted by default (the flag is accepted but no longer needed)", () => {
  const dflt = plan();
  assert.deepEqual(dflt.requests[0].items.map(i => i.questionUid), ["uid1", "uid7"]);
  const opt = plan({ includeReceiptRows: true });
  assert.deepEqual(opt.requests[0].items.map(i => i.questionUid), ["uid1", "uid7"]);
});

test("a result line whose own question number differs from the row's source ordinal is skipped", () => {
  const { requests, skipped } = planRequests({ ctx: makeCtx(), resultRows: [line(1, { no: 2 }), line(2, { no: 2, pt: "PT_A" })], approvedBy: "x" });
  assert.equal(requests.length, 0);
  assert.deepEqual(skipped.map(s => s.reason), ["RESULT_NO_DIFFERS_FROM_SOURCE_ORDINAL", "TYPE_ALREADY_PRESENT"]);
});

test("judged-base check: changed stem/choices keep the type (counted, marked in the ledger), unchanged rows pass, an unreadable base is counted as unverified", () => {
  const copy = () => JSON.parse(JSON.stringify(questions));
  const changed = copy(); changed[0].content = "다른 지문";
  const ctxFor = bank => makeCtx({ ctx: { judgedBank: () => bank } });
  // 2026-11-22 (학원 원장): a stem or choices edited after the judgment (a minimal source fix) does not change the type; the request binds to the CURRENT text
  let r = planRequests({ ctx: ctxFor(changed), resultRows: [line(1)], approvedBy: "x" });
  assert.equal(r.requests.length, 1);
  assert.equal(r.skipped.length, 0);
  assert.deepEqual(r.stats.judgedBase, { checked: 1, unverified: 0, changedKept: 1 });
  assert.equal(r.requests[0].items[0].textBindingFingerprint, textFingerprint(questions[0]), "bound to the current text (the registrar compares it with the current question)");
  const ledger = JSON.parse(r.files.get(r.requests[0].approval.evidenceRefs[0].path));
  assert.equal(ledger.rows[0].stemChangedSinceJudgment, true);
  const choices = copy(); choices[0].choices = ["가", "나"];
  assert.equal(planRequests({ ctx: ctxFor(choices), resultRows: [line(1)], approvedBy: "x" }).requests.length, 1);
  r = planRequests({ ctx: ctxFor(copy()), resultRows: [line(1)], approvedBy: "x" });
  assert.equal(r.requests.length, 1);
  assert.deepEqual(r.stats.judgedBase, { checked: 1, unverified: 0, changedKept: 0 });
  assert.equal(JSON.parse(r.files.get(r.requests[0].approval.evidenceRefs[0].path)).rows[0].stemChangedSinceJudgment, undefined);
  // solution/answer changes are not a change of the question text
  const sol = copy(); sol[0].solution = "고친 해설"; sol[0].answer = "2";
  assert.equal(planRequests({ ctx: ctxFor(sol), resultRows: [line(1)], approvedBy: "x" }).requests.length, 1);
  r = planRequests({ ctx: ctxFor(null), resultRows: [line(1)], approvedBy: "x" });
  assert.equal(r.requests.length, 1);
  assert.deepEqual(r.stats.judgedBase, { checked: 0, unverified: 1, changedKept: 0 });
  // figure/solution changes since the judgment do not matter; the text fingerprint is that of the stem+choices
  const moved = copy(); moved[0].image = "old.png"; moved[0].solution = "옛 해설";
  r = planRequests({ ctx: ctxFor(moved), resultRows: [line(1)], approvedBy: "x" });
  assert.equal(r.requests[0].items[0].textBindingFingerprint, textFingerprint(questions[0]));
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

test("selectable-by-type metric counts rows whose metadata is bound to the current stem+choices; a planned type is bound by its own judgment", () => {
  const stale = records.map(r => r.sourceOrdinal === 1 ? { ...r, contentFingerprint: "f".repeat(64) } : r);
  const planned = new Map([["uid1", { pt: "PT_A", tpl: "TPL_A" }]]);
  const fresh = typeSelectable(makeCtx(), [EXAM], planned);
  assert.equal(fresh.selectableBefore, 2); // uid2 (a registered draft PT) and uid3 (approved PT_A) are bound and shown
  assert.equal(fresh.selectableAfter, 3);
  assert.equal(fresh.plannedSelectable, 1);
  // a stale row (fingerprint of an older text) stays hidden unless planned; the planned type is shown
  const staleApproved = records.map(r => r.sourceOrdinal === 3 ? { ...r, contentFingerprint: "f".repeat(64) } : r);
  assert.equal(typeSelectable(makeCtx({ records: staleApproved }), [EXAM], planned).selectableBefore, 1); // only the registered draft of uid2 is still shown
  const hidden = typeSelectable(makeCtx({ records: stale }), [EXAM], planned);
  assert.equal(hidden.selectableAfter, 3);
  assert.equal(hidden.plannedSelectable, 1);
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

// ---- reach: a key of a grade at or below the exam's (2026-11-19) ----------------------------------------------------------------------
const reachDoc = {
  spellingGroups: [{ id: "M1", grade: "중1", members: ["중1 수학", "중1"], evidence: "fixture" }, { id: "M2", grade: "중2", members: ["중2 수학", "중2"], evidence: "fixture" },
    { id: "M3", grade: "중3", members: ["중3 수학", "중3"], evidence: "fixture" }, { id: "H15", grade: "고1", members: ["수학(상)"], evidence: "fixture" },
    { id: "H22", grade: "고1", members: ["공통수학1", "공통수학2"], evidence: "fixture" }],
  successorGroups: [],
  courseMoves: [{ id: "MOVE", problemTypeKeys: ["PT_COORD"], rowGrades: ["중3"], bindingGrades: ["고1"], maxExamYear: 2019, evidence: ["fixture"] }]
};
const reachAliases = makeCourseAliases(reachDoc);
const bind = (problemTypeKey, curriculum, standardCourse) => ({ problemTypeKey, curriculum, standardCourse, ownerPack: "P", status: "ACTIVE" });
const reachRegistry = makeRegistry({
  problemTypes: ["PT_LOW", "PT_MID", "PT_UP", "PT_COORD"].map(problemTypeKey => ({ problemTypeKey, status: "ACTIVE", ownerPack: "P" })), templates: [],
  bindings: [bind("PT_LOW", "2022", "중1 수학"), bind("PT_MID", "2015", "중2 수학"), bind("PT_UP", "2022", "공통수학1"), bind("PT_COORD", "2015", "수학(상)"), bind("PT_COORD", "2022", "공통수학2")],
  packs: new Map([["P", { curricula: ["2015", "2022"], standardCourses: ["중1 수학", "중2 수학", "공통수학1", "수학(상)", "공통수학2"] }]])
});
const M3_19 = "original/middle/m3/2mid/19_가나중_2학기_중간_중3_수학.js", M3_20 = M3_19.replace("19_", "20_");

test("reach: a key of a grade at or below the exam's grade is chosen; a key above it is still skipped", () => {
  const sc = (row, pt, set = reachAliases) => chooseScope(reachRegistry, set, row, pt);
  // the unit moved down: the PT is bound only to 중1 / 중2, the exam is 중3 (the row's own curriculum differs and is not compared)
  const low = sc({ sourceArchiveFile: M3_20, standardCourse: "중3", curriculum: "2015" }, "PT_LOW");
  assert.deepEqual(low.scope, { curriculum: "2022", standardCourse: "중1 수학" });
  assert.equal(low.relation, "reach");
  assert.deepEqual(sc({ sourceArchiveFile: M3_20, standardCourse: "M3-2" }, "PT_MID").scope, { curriculum: "2015", standardCourse: "중2 수학" });
  assert.equal(sc({ sourceArchiveFile: M3_20 }, "PT_MID").relation, "reach", "a row without a course is placed by its exam folder");
  assert.equal(sc({ sourceArchiveFile: M3_20, standardCourse: "공통수학1" }, "PT_LOW").relation, "reach", "a wrongly filed row course");
  // a key above the exam's grade
  assert.equal(sc({ sourceArchiveFile: "original/middle/m1/1mid/24_가나중_1학기_중간_중1_기출.js", standardCourse: "중1 수학" }, "PT_MID").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  assert.equal(sc({ sourceArchiveFile: "original/middle/m2/1mid/24_가나중_1학기_중간_중2_기출.js", standardCourse: "중2 수학" }, "PT_UP").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  assert.equal(sc({ sourceArchiveFile: "original/middle/m2/1mid/24_가나중_1학기_중간_중2_기출.js" }, "PT_UP").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  assert.equal(sc({ sourceArchiveFile: M3_20, standardCourse: "중3" }, "PT_UP").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  // the listed move: 좌표 PT of a 2019-or-earlier 중3 exam reaches its 고1 binding, a 2020 exam does not
  assert.equal(sc({ sourceArchiveFile: M3_19, standardCourse: "중3" }, "PT_COORD").relation, "reach");
  assert.equal(sc({ sourceArchiveFile: M3_20, standardCourse: "중3" }, "PT_COORD").skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
  // without alias data nothing is reached
  assert.equal(sc({ sourceArchiveFile: M3_20, standardCourse: "중3" }, "PT_LOW", makeCourseAliases(null)).skip, "SCOPE_PT_BOUND_TO_OTHER_COURSE");
});

test("a type field filled with a key the registry does not have holds no value (an old key is replaced, its old value kept in before); an approved registered key is still protected", () => {
  const sem = "approved_semantic_review";
  const recs = records.map(r => r.sourceOrdinal === 1 ? { ...r, problemTypeKey: "OLD_KEY", templateKey: "OLD_TPL", fieldStatus: { problemType: sem, template: sem } } : r);
  const { requests, skipped } = planRequests({ ctx: makeCtx({ records: recs }), resultRows: [line(1), line(3)], approvedBy: "x" });
  const item = requests[0].items.find(i => i.questionUid === "uid1");
  assert.deepEqual(item.before, { problemTypeKey: "OLD_KEY", templateKey: "OLD_TPL" });
  assert.deepEqual(item.after, { problemTypeKey: "PT_A", templateKey: "TPL_A" });
  assert.equal(skipped.find(x => x.uid === "uid3").reason, "TYPE_ALREADY_PRESENT", "uid3 holds an approved ACTIVE key and stays");
});

test("a type written in the exam file never keeps a judged question out of a request (the registered judgment wins; the registrar records the embedded value)", () => {
  const embedded = { 1: ["PT_B", "TPL_B"], 2: ["PT_A", "TPL_A"], 3: ["PT_OFF", ""] };
  const recs = [1, 2, 3, 4, 5, 6, 7].map(n => row(n, { metadataRevision: "meta-foundation:X" }));
  const readBank = () => ({ bank: questions.map((q, i) => ({ ...q, problemTypeKey: embedded[i + 1]?.[0] || "", templateKey: embedded[i + 1]?.[1] || "" })), bytes });
  const ctx = makeCtx({ records: recs, ctx: { readBank } });
  const { requests } = planRequests({ ctx, resultRows: [line(1), line(2), line(3)], approvedBy: "x" });
  const after = Object.fromEntries(requests.flatMap(r => r.items).map(i => [i.questionUid, i.after]));
  assert.deepEqual(Object.keys(after).sort(), ["uid1", "uid2", "uid3"]);
  for (const uid of ["uid1", "uid2", "uid3"]) assert.deepEqual(after[uid], { problemTypeKey: "PT_A", templateKey: "TPL_A" });
});

test("a later result line for the same question is used when the earlier one was held; once one line is in a request the rest are duplicates", () => {
  const held = line(1, { decision: "HOLD", pt: null, tpl: null });
  const better = line(1, { judge: "claude-sonnet-5.5" });
  const again = line(1, { judge: "dots" });
  const { requests, skipped } = planRequests({ ctx: makeCtx(), resultRows: [held, better, again], approvedBy: "x" });
  const items = requests.flatMap(r => r.items);
  assert.equal(items.length, 1);
  assert.equal(requests[0].approval.judge, "claude-sonnet-5.5");
  assert.deepEqual(skipped.map(s => s.reason).sort(), ["DECISION_HOLD", "DUPLICATE_RESULT_LINE"]);
});

// ---- grade bindings: an existing key of another grade/curriculum is used and the row's own grade binding is added (2026-11-22) -----------
test("a key bound only to another grade is kept and the row's grade binding is added append-only (existing key reused, no key created)", () => {
  const master = new Map([["M1-03", { key: "M1-03", keyType: "standardUnitKey" }], ["M1-03-LINEAR_EQUATION", { key: "M1-03-LINEAR_EQUATION", keyType: "subUnitKey", standardUnitKey: "M1-03", labelKo: "일차방정식" }],
    ["H22-C-01", { key: "H22-C-01", keyType: "standardUnitKey" }]]);
  const reg = { ...makeRegistry({ problemTypes: [{ problemTypeKey: "PT_HIGH", status: "ACTIVE", ownerPack: "P2" }], templates: [{ templateKey: "TPL_HIGH", status: "ACTIVE", parentProblemTypeKey: "PT_HIGH" }],
    bindings: [{ problemTypeKey: "PT_HIGH", curriculum: "2015", standardCourse: "수학(상)", standardUnitKey: "H15-SA-01", ownerPack: "P2", status: "ACTIVE" }],
    packs: new Map([["P2", { curricula: ["2015"], standardCourses: ["수학(상)"] }]]) }), packFiles: new Map([["P2", "archive/data/meta-foundation/canonical/packs/p2/pack.json"]]) };
  const recs = [1, 2, 3, 4, 5, 6, 7].map(n => row(n, { standardUnitKey: "M1-03", subUnitKey: "M1-03-LINEAR_EQUATION", curriculum: "2015" }));
  recs[2] = row(3, { standardUnitKey: "", subUnitKey: "", curriculum: "2015" }); // no unit the master knows
  const mk = bindingsOn => {
    const ctx = makeCtx({ records: recs, ctx: { registry: reg, aliases, master } });
    return bindingsOn ? { ...ctx, gradeBindings: createGradeBindings({ ctx, env: { curriculumGuess: () => "2015", pathGrade: () => "m1" } }) } : ctx;
  };
  const rows = [line(1, { pt: "PT_HIGH", tpl: "TPL_HIGH" }), line(2, { pt: "PT_HIGH", tpl: null }), line(3, { pt: "PT_HIGH", tpl: null })];
  // without the grade-binding step the lines stay skipped, as before
  assert.deepEqual(planRequests({ ctx: mk(false), resultRows: rows, approvedBy: "x" }).skipped.map(s => s.reason), ["SCOPE_PT_BOUND_TO_OTHER_COURSE", "SCOPE_PT_BOUND_TO_OTHER_COURSE", "SCOPE_PT_BOUND_TO_OTHER_COURSE"]);
  const { requests, skipped, stats } = planRequests({ ctx: mk(true), resultRows: rows, approvedBy: "x" });
  assert.deepEqual(skipped.map(s => [s.uid, s.reason, s.was]), [["uid3", "GRADE_BINDING_NO_UNIT", "SCOPE_PT_BOUND_TO_OTHER_COURSE"]], "a row without any valid unit is skipped, no unit is guessed");
  assert.equal(stats.gradeBindingRows, 2);
  assert.equal(requests.length, 1);
  const r = requests[0];
  assert.ok(r.requestId.startsWith("tc-"), "the request that carries registryChanges sorts first");
  assert.deepEqual(r.items.map(i => i.scope), [{ curriculum: "2015", standardCourse: "중1 수학" }, { curriculum: "2015", standardCourse: "중1 수학" }]);
  // the pack gains the course (append-only), and one bindings.json row is added for the PT at the row's own unit
  const [packChange, bindingChange, ...rest] = r.registryChanges;
  assert.equal(rest.length, 0);
  assert.deepEqual(packChange.after.standardCourses, ["수학(상)", "중1 수학"]);
  assert.equal(bindingChange.path, "archive/data/meta-foundation/canonical/packs/p2/bindings.json");
  assert.equal(bindingChange.collection, "bindings");
  assert.equal(bindingChange.before, null);
  assert.deepEqual(bindingChange.match, { curriculum: "2015", standardCourse: "중1 수학", standardUnitKey: "M1-03", subUnitKey: "M1-03-LINEAR_EQUATION", problemTypeKey: "PT_HIGH" });
  assert.equal(bindingChange.after.status, "ACTIVE");
  assert.equal(bindingChange.after.ownerPack, "P2");
  assert.equal(bindingChange.after.supportingItemCount, 2);
  assert.deepEqual(bindingChange.after.supportingQuestionUids, ["uid1", "uid2"]);
  assert.equal(r.registryChanges.some(c => c.collection === "problemTypes" || c.collection === "templates"), false, "no key is created");
  const ledger = JSON.parse(planRequests({ ctx: mk(true), resultRows: rows, approvedBy: "x" }).files.get(r.approval.evidenceRefs[0].path));
  assert.equal(ledger.rows[0].gradeBindingAdded, true);
  assert.equal(ledger.gradeBindingAdditions.length, 1);
  // a unit written on the result line (`binding`) stands in for a row without a valid unit
  const named = planRequests({ ctx: mk(true), resultRows: [line(3, { pt: "PT_HIGH", tpl: null, binding: { standardUnitKey: "M1-03", subUnitKey: "M1-03-LINEAR_EQUATION" } })], approvedBy: "x" });
  assert.equal(named.requests.length, 1);
  assert.equal(named.requests[0].registryChanges.at(-1).match.standardUnitKey, "M1-03");
});
