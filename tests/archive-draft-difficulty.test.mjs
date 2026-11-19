import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { registerDifficulty5, isTextBoundDraft, DRAFT_SINGLE_MODEL, DRAFT_FIELD_STATUS, SCHEMA } from "../archive/tools/meta-foundation/register-difficulty5.mjs";
import { planExamRequest, judgedStemChoicesSha256, textBindingSha256, LEDGER_SCHEMA } from "../archive/tools/meta-foundation/build-draft-difficulty-requests.mjs";

const SOURCE = "original/high/h1/1mid/99_테스트고_1학기_중간_고1_기출.js";
const bank = [
  { id: 1, level: "중", content: "다음 중 옳은 것은? $x^2=4$", choices: ["1", "2", "3", "4", "5"], answer: 2 },
  { id: 2, level: "하", content: "값을 구하시오.", choices: [], answer: "3" },
  { id: 3, content: "세 번째 문항", choices: ["a", "b"], answer: 1 },
  { id: 4, content: "네 번째 문항", choices: ["a", "b"], answer: 1 },
  { id: 5, content: "다섯 번째 문항", choices: ["a", "b"], answer: 1 },
];
const sourceText = "window.questionBank = " + JSON.stringify(bank, null, 2) + ";\n";
const uid = n => "qid_v1_" + crypto.createHash("sha256").update(SOURCE + "#" + n).digest("hex");
const sha256 = v => crypto.createHash("sha256").update(v).digest("hex");

function fixture(t, { meta = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "draftdiff-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const records = bank.map((q, i) => ({ questionUid: uid(i + 1), sourceArchiveFile: SOURCE, sourceOrdinal: i + 1,
    fieldStatus: { difficulty: "manual_review_pending", subUnit: "approved_source" }, ...(meta[i + 1] || {}) }));
  const metaDoc = { counts: { explicitDifficultyHolds: records.filter(r => r.fieldStatus.difficulty === "manual_review_pending").length }, records };
  const put = (rel, text) => { const f = path.join(root, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text); };
  put("archive/data/question_metadata.json", JSON.stringify(metaDoc, null, 2) + "\n");
  put("archive/data/question_identity_map.json", JSON.stringify({ records: records.map(r => ({ questionUid: r.questionUid, sourceArchiveFile: SOURCE, sourceOrdinal: r.sourceOrdinal })) }, null, 2) + "\n");
  put("archive/exams/" + SOURCE, sourceText);
  const ctx = {
    metaByUid: new Map(records.map(r => [r.questionUid, r])),
    idByUid: new Map(records.map(r => [r.questionUid, { questionUid: r.questionUid, sourceArchiveFile: SOURCE, sourceOrdinal: r.sourceOrdinal }])),
    readSource: file => (file === SOURCE ? Buffer.from(sourceText) : null),
  };
  const read = () => JSON.parse(fs.readFileSync(path.join(root, "archive/data/question_metadata.json"), "utf8"));
  return { root, ctx, read };
}
const ledgerItem = (n, extra = {}) => ({ ordinal: n, questionUid: uid(n), stemChoicesSha256: judgedStemChoicesSha256(bank[n - 1]),
  requested: { type: false, difficulty: true }, difficultyBucket: 3, borderline: false, boundary: null, status: "accepted", dropReason: null, confidence: "high", ...extra });
const ledgerOf = items => ({ schemaVersion: LEDGER_SCHEMA, judge: "draft_single_model", draftGrade: true, model: "opencode-go/deepseek-v4.1-flash",
  createdAt: "2026-11-18T00:00:00.000Z", sourceArchiveFile: SOURCE, sourceHeadSha: "0".repeat(40), items });
const plan = (x, items, opts = {}) => { const ledger = ledgerOf(items); const bytes = Buffer.from(JSON.stringify(ledger)); return planExamRequest({ ledger, ledgerName: "L.json", ledgerBytes: bytes, ctx: x.ctx, ...opts }); };
const reasons = r => Object.fromEntries(r.skipped.map(s => [s.ordinal, s.reason]));

test("a judged ledger item becomes a request; the lane fills the three integer-difficulty fields and labels only the filled rows", t => {
  const x = fixture(t);
  const { request, skipped } = plan(x, [ledgerItem(1), ledgerItem(2, { difficultyBucket: 5, boundary: "B45", confidence: "low" })]);
  assert.deepEqual(skipped, []);
  assert.equal(request.schemaVersion, SCHEMA);
  assert.equal(request.approvalType, DRAFT_SINGLE_MODEL);
  assert.equal(request.judge, "opencode-go/deepseek-v4.1-flash");
  assert.equal(request.gemini.items[0].after.difficultyBoundaryFlag, "NONE");
  assert.equal(request.gemini.items[0].textBindingFingerprint, textBindingSha256(bank[0]));
  assert.equal(request.gemini.items[1].after.difficultyBoundaryFlag, "B45");
  const dry = registerDifficulty5({ root: x.root, request });
  assert.equal(dry.summary.APPLY, 2);
  assert.equal(dry.summary.changedFields, 6, "three integer-difficulty fields per question; the label is not counted as a value change");
  for (const item of request.gemini.items) {
    assert.equal(item.before, undefined, "no level is carried");
    assert.deepEqual(Object.keys(item.after).sort(), ["difficultyBoundaryFlag", "difficultyBucket", "difficultyConfidence"]);
  }
  assert.equal(x.read().records[0].difficultyBucket, undefined, "dry run writes nothing");
  const done = registerDifficulty5({ root: x.root, request, write: true });
  assert.equal(done.summary.draftMarked, 2);
  const after = x.read();
  assert.equal(after.records[0].difficultyBucket, 3);
  assert.equal(after.records[0].fieldStatus.difficulty, DRAFT_FIELD_STATUS);
  assert.equal(after.records[0].fieldStatus.subUnit, "approved_source", "other field statuses are untouched");
  assert.equal(Object.hasOwn(after.records[0], "level"), false);
  assert.equal(Object.hasOwn(after.records[0], "legacyLevelCompatibility"), false, "no level-derived value is written for a row without a level");
  assert.equal(after.records[2].fieldStatus.difficulty, "manual_review_pending", "rows outside the request are untouched");
  assert.equal(after.counts.explicitDifficultyHolds, 3);
  assert.equal(registerDifficulty5({ root: x.root, request }).summary.ALREADY_REGISTERED, 2, "replay is a no-op");
});

test("an ordinary request (no approvalType) does not label anything", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1)]);
  delete request.approvalType; delete request.judge;
  registerDifficulty5({ root: x.root, request, write: true });
  const row = x.read().records[0];
  assert.equal(row.difficultyBucket, 3);
  assert.equal(row.fieldStatus.difficulty, "manual_review_pending");
});

test("the draft marker is validated: known approvalType only, the judge is named, no reviewed correction", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1)]);
  assert.throws(() => registerDifficulty5({ root: x.root, request: { ...request, approvalType: "OTHER" } }), /unsupported approvalType/);
  assert.throws(() => registerDifficulty5({ root: x.root, request: { ...request, judge: " " } }), /requires the judge/);
  assert.throws(() => registerDifficulty5({ root: x.root, request: { ...request, reviewedCorrection: {} } }), /cannot carry a reviewed correction/);
});

test("only machine-checkable reasons drop an item, and every drop is counted with its reason", t => {
  const x = fixture(t, { meta: { 3: { difficultyBucket: 2, fieldStatus: { difficulty: "approved_source" } },
    4: { metadataApprovalType: "META_PIPELINE_AUDIT" } } });
  const items = [
    ledgerItem(1, { stemChoicesSha256: "0".repeat(64) }),
    ledgerItem(2, { difficultyBucket: 6 }),
    ledgerItem(3),
    ledgerItem(4),
    ledgerItem(5, { questionUid: uid(2) }),
  ];
  const result = plan(x, items);
  assert.equal(result.request, null);
  assert.deepEqual(reasons(result), { 1: "STEM_OR_CHOICES_CHANGED_SINCE_JUDGED", 2: "NO_VALID_DIFFICULTY_VALUE", 3: "ALREADY_HAS_DIFFICULTY",
    4: "RECEIPT_ROW_HELD", 5: "UID_ORDINAL_MISMATCH" });
  assert.equal(result.stats.alreadyFilled, 1);
  // The receipt hold is a switch: with it on, the row is included.
  const included = plan(x, [ledgerItem(4)], { includeReceiptRows: true });
  assert.equal(included.request.gemini.items.length, 1);
});

test("a value is copied, not repaired: invalid confidence or boundary is reported instead of guessed", t => {
  const x = fixture(t);
  const result = plan(x, [ledgerItem(1, { confidence: "certain" }), ledgerItem(2, { boundary: "B99" }), ledgerItem(3, { requested: { type: true, difficulty: false } })]);
  assert.deepEqual(reasons(result), { 1: "CONFIDENCE_NOT_HIGH_MEDIUM_LOW", 2: "BOUNDARY_INVALID" });
  assert.equal(result.stats.requested, 2, "items that did not ask for a difficulty are not part of this lane");
});

test("the request is deterministic and the judged text check ignores figure tags and spacing like the judging runner", t => {
  const x = fixture(t);
  const a = plan(x, [ledgerItem(1)]), b = plan(x, [ledgerItem(1)]);
  assert.equal(JSON.stringify(a.request), JSON.stringify(b.request));
  const withFigure = { ...bank[0], content: bank[0].content + '  <img src="a.png">\n' };
  assert.equal(judgedStemChoicesSha256(withFigure), judgedStemChoicesSha256(bank[0]));
  assert.notEqual(judgedStemChoicesSha256({ ...bank[0], choices: ["1", "2", "3", "4", "6"] }), judgedStemChoicesSha256(bank[0]));
  assert.equal(sha256("x").length, 64);
});

// The request carries the stem+choices fingerprint (text-v1) the grade was judged on; the lane refuses a question whose stem or choices
// changed since, in dry-run, write and projection verification alike, and ignores edits to answer/solution/figure.
function withChangedSource(x, request, mutate) {
  const changed = structuredClone(bank); mutate(changed);
  const text = "window.questionBank = " + JSON.stringify(changed, null, 2) + ";\n";
  fs.writeFileSync(path.join(x.root, "archive/exams", SOURCE), text);
  const bytes = Buffer.from(text);
  const latestBlobSha = crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
  return { ...request, gemini: { ...request.gemini, latestBlobSha } };
}
const threePaths = (x, request) => [() => registerDifficulty5({ root: x.root, request }),
  () => registerDifficulty5({ root: x.root, request, write: true }), () => registerDifficulty5({ root: x.root, request, verifyProjection: true })];

test("a changed stem since judgment refuses the request in dry-run, write and verification, and writes nothing", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1), ledgerItem(2)]);
  const changed = withChangedSource(x, request, b => { b[0].content = "다음 중 옳은 것은? $x^2=9$"; });
  const before = fs.readFileSync(path.join(x.root, "archive/data/question_metadata.json"), "utf8");
  for (const run of threePaths(x, changed)) assert.throws(run, /stem or choices changed since judged \(textBindingFingerprint\) #1/);
  assert.equal(fs.readFileSync(path.join(x.root, "archive/data/question_metadata.json"), "utf8"), before);
});

test("changed choices since judgment refuse the request", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1), ledgerItem(2)]);
  const changed = withChangedSource(x, request, b => { b[0].choices = ["1", "2", "3", "4", "6"]; });
  for (const run of threePaths(x, changed)) assert.throws(run, /stem or choices changed since judged \(textBindingFingerprint\) #1/);
});

test("an answer, solution or figure edit since judgment does not refuse the request", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1), ledgerItem(2)]);
  const changed = withChangedSource(x, request, b => { b[0].answer = 3; b[0].solution = "새 해설"; b[0].image = "fig.png"; b[1].solution = "해설만 추가"; });
  assert.equal(registerDifficulty5({ root: x.root, request: changed }).summary.APPLY, 2);
  assert.equal(registerDifficulty5({ root: x.root, request: changed, write: true }).summary.APPLY, 2);
  assert.equal(registerDifficulty5({ root: x.root, request: changed, verifyProjection: true }).summary.VERIFIED, 2);
});

// The whole-file blob (latestBlobSha) is not compared for a draft request whose every item carries textBindingFingerprint:
// another question's solution/figure edit makes the file blob differ, which must not refuse the request.
function withStaleBlob(x, mutate) {
  const changed = structuredClone(bank); mutate(changed);
  fs.writeFileSync(path.join(x.root, "archive/exams", SOURCE), "window.questionBank = " + JSON.stringify(changed, null, 2) + ";\n");
}

test("draft request with fingerprints: another question's solution edit (file blob differs) does not refuse it", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1)]);
  withStaleBlob(x, b => { b[2].solution = "다른 문항 해설"; b[3].image = "other.png"; });
  assert.equal(isTextBoundDraft(request), true);
  assert.equal(registerDifficulty5({ root: x.root, request }).summary.APPLY, 1);
  assert.equal(registerDifficulty5({ root: x.root, request, write: true }).summary.APPLY, 1);
  assert.equal(registerDifficulty5({ root: x.root, request, verifyProjection: true }).summary.VERIFIED, 1);
});

test("draft request with fingerprints and a stale file blob: the target stem edit is still refused, by the text check", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1)]);
  withStaleBlob(x, b => { b[0].content = "바뀐 발문"; });
  for (const run of threePaths(x, request)) assert.throws(run, /stem or choices changed since judged \(textBindingFingerprint\) #1/);
});

test("a draft request with an item lacking textBindingFingerprint keeps the whole-file blob check", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1), ledgerItem(2)]);
  delete request.gemini.items[1].textBindingFingerprint;
  withStaleBlob(x, b => { b[2].solution = "다른 문항 해설"; });
  assert.equal(isTextBoundDraft(request), false);
  for (const run of threePaths(x, request)) assert.throws(run, /source Git blob drift/);
});

test("a request that is not a draft keeps the whole-file blob check even when its items carry the fingerprint", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1)]);
  delete request.approvalType; delete request.judge;
  withStaleBlob(x, b => { b[2].solution = "다른 문항 해설"; });
  assert.equal(isTextBoundDraft(request), false);
  for (const run of threePaths(x, request)) assert.throws(run, /source Git blob drift/);
});

test("an item without textBindingFingerprint keeps the previous behaviour even when the stem changed", t => {
  const x = fixture(t);
  const { request } = plan(x, [ledgerItem(1), ledgerItem(2)]);
  for (const item of request.gemini.items) delete item.textBindingFingerprint;
  const changed = withChangedSource(x, request, b => { b[0].content = "전혀 다른 문제"; });
  assert.equal(registerDifficulty5({ root: x.root, request: changed }).summary.APPLY, 2);
  assert.equal(registerDifficulty5({ root: x.root, request: changed, write: true }).summary.APPLY, 2);
  assert.equal(registerDifficulty5({ root: x.root, request: changed, verifyProjection: true }).summary.VERIFIED, 2);
});
