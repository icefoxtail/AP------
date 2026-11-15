// Basic-scope rebind registrar (archive-basic-scope-rebind-request-v1): accepts a figure-only re-bind of an approved
// basic-scope row and refuses everything else (metadata value change, stem/answer/choice/solution change, unapproved
// row or UID, hash drift, wrong parent, ...). Runs on a throw-away Git repository so no production data is touched.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { registerBasicScopeRebind, sourceFingerprint, contentFingerprint } from "../archive/tools/meta-foundation/register-basic-scope-rebind.mjs";
import { BASIC_PRESERVATION_SCHEMA, BASIC_PRESERVATION_REVIEW_SCHEMA, stableBasicValue } from "../archive/tools/meta-foundation/reviewed-basic-preservation.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonical = createRequire(import.meta.url)("../archive/archive2-canonical.js");
const SRC = "original/high/h2/1mid/99_테스트고_1학기_중간_고2_대수.js";
const EVID = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const EXAM_DIR = "99_테스트고_1학기_중간_고2_대수";
const uid = n => "qid_v1_" + sha256(`${SRC}#${n}`);

const baseQuestions = () => [
  { id: 1, level: "중", standardUnitKey: "H15-M1-05", subUnitKey: "H15-M1-05-TRIGONOMETRIC_DEFINITION", content: "$\\sin\\theta=\\frac{1}{2}$일 때 값은?", choices: ["1", "2"], answer: "1", solution: "풀이 1" },
  { id: 2, level: "중", standardUnitKey: "H15-M1-05", subUnitKey: "H15-M1-05-TRIGONOMETRIC_DEFINITION",
    content: "[도형필요]\n다음 그림과 같이 선분 $AC$의 길움을 구하시오. (6점)", choices: [], answer: "12", solution: "풀이 2 $x=12$" },
];
// What the repository holds after the figure fix.
const fixedQuestions = () => {
  const bank = baseQuestions();
  bank[1] = { ...bank[1], image: `assets/images/${EXAM_DIR}/q2.svg`, imageAlt: "그림", content: "다음 그림과 같이 선분 $AC$의 길이를 구하시오. (6점)" };
  return bank;
};
const sourceText = bank => `window.questionBank = ${JSON.stringify(bank, null, 2)};\n`;

function git(dir, ...args) { return execFileSync("git", args, { cwd: dir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim(); }
const write = (dir, rel, text) => { const full = path.join(dir, rel); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, text); };
const readJson = (dir, rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), "utf8"));

// Builds a repo whose Git history holds the approved bytes and whose work tree holds the fixed bytes.
function fixture({ current = fixedQuestions(), approvedMeta = {}, links = [], figure = true, parentRows } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "basic-rebind-"));
  git(dir, "init", "-q");
  git(dir, "config", "user.email", "t@example.invalid"); git(dir, "config", "user.name", "t");
  const prior = baseQuestions();
  write(dir, `archive/exams/${SRC}`, sourceText(prior));
  git(dir, "add", "-A"); git(dir, "commit", "-qm", "approved bytes");
  const previousBlob = git(dir, "hash-object", `archive/exams/${SRC}`);
  write(dir, `archive/exams/${SRC}`, sourceText(current));
  if (figure) write(dir, `archive/assets/images/${EXAM_DIR}/q2.svg`, "<svg xmlns=\"http://www.w3.org/2000/svg\"/>");
  const metaRow = (q, n) => ({ questionUid: uid(n), sourceArchiveFile: SRC, sourceOrdinal: n, sourceQuestionNo: String(n),
    sourceFingerprint: sourceFingerprint(q), contentFingerprint: contentFingerprint(q), standardCourse: "대수", standardUnitKey: q.standardUnitKey,
    subUnitKey: q.subUnitKey, metadataStatus: "approved_partial_with_explicit_holds", tagStatus: "approved_subunit_concept_partial",
    fieldStatus: { standardUnit: "approved_source", subUnit: "approved_source" }, approvalEvidence: ["archive/_generated/x.json"], ...(n === 2 ? approvedMeta : {}) });
  write(dir, "archive/data/question_metadata.json", JSON.stringify({ records: prior.map((q, i) => metaRow(q, i + 1)), counts: {} }, null, 2) + "\n");
  write(dir, "archive/data/question_identity_map.json", JSON.stringify({ records: prior.map((q, i) => ({ questionUid: uid(i + 1), sourceArchiveFile: SRC, sourceOrdinal: i + 1, sourceFingerprint: sourceFingerprint(q) })) }) + "\n");
  write(dir, "archive/data/basic-scope-source-links.json", JSON.stringify({ schemaVersion: "archive2-reviewed-basic-source-links-v1", status: "REVIEWED_SCOPE_LINKS", records: links }, null, 2) + "\n");
  write(dir, "archive/data/basic-scope-parent-links.json", JSON.stringify({ records: parentRows ?? [
    { grade: "고2", curriculumKey: "2015", courseKey: "수학I", standardUnitKey: "H15-M1-05", subUnitKey: "H15-M1-05-TRIGONOMETRIC_DEFINITION", L1: "삼각함수", L2: "삼각함수" }] }, null, 2) + "\n");
  const q2 = current[1], p2 = prior[1];
  const request = {
    schemaVersion: "archive-basic-scope-rebind-request-v1", requestId: "rebind-test-01", examUid: "99_테스트고_1학기_중간_고2_대수", sourceArchiveFile: SRC,
    expectedSourceBlobSha1: git(dir, "hash-object", `archive/exams/${SRC}`), previousSourceBlobSha1: previousBlob, expectedQuestionCount: 2,
    approval: { type: "BASIC_SCOPE_REBIND", metadataReviewed: true, approvedBy: "test reviewer", evidenceRefs: [] },
    items: [{ questionUid: uid(2), sourceOrdinal: 2,
      before: { sourceFingerprint: sourceFingerprint(p2), contentFingerprint: contentFingerprint(p2) },
      after: { sourceFingerprint: sourceFingerprint(q2), contentFingerprint: contentFingerprint(q2) },
      contentEdits: [{ from: "길움을", to: "길이를" }],
      basicParent: { grade: "고2", curriculumKey: "2015", courseKey: "수학I", L1: "삼각함수", L2: "삼각함수" },
      reason: "figure attached, placeholder removed, one typo fixed", evidenceRefs: [] }],
  };
  const f = { dir, request, current, previousBlob };
  bind(f);
  return f;
}
// Writes the human review file for the request as it stands now and binds it (approval + every item).
// `tweak` edits the review document before it is written, to model wrong or foreign reviews.
function bind(f, tweak = () => {}) {
  const q = f.current;
  const review = { schemaVersion: "archive-basic-scope-rebind-review-v1", requestId: f.request.requestId, examUid: f.request.examUid, sourceArchiveFile: SRC,
    questions: f.request.items.map(item => ({ questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, contentEdits: item.contentEdits || [],
      contentAfterSha256: sha256(String(q[item.sourceOrdinal - 1].content ?? "")) })) };
  tweak(review);
  const text = JSON.stringify(review, null, 2) + "\n";
  write(f.dir, `${EVID}/rebind-test.review.json`, text);
  f.ref = { path: `${EVID}/rebind-test.review.json`, sha256: sha256(text) };
  f.request.approval.evidenceRefs = [f.ref];
  for (const item of f.request.items) item.evidenceRefs = [f.ref];
}
const snapshot = dir => ["archive/data/question_metadata.json", "archive/data/question_identity_map.json", "archive/data/basic-scope-source-links.json"]
  .map(rel => fs.readFileSync(path.join(dir, rel), "utf8")).join("\u0000");
const run = (f, opts = {}) => registerBasicScopeRebind({ root: f.dir, request: f.request, ...opts });
// The refusal must happen before the first write: nothing on disk may change.
function refuses(f, pattern, opts = {}) {
  const before = snapshot(f.dir);
  assert.throws(() => run(f, { write: true, ...opts }), pattern);
  assert.equal(snapshot(f.dir), before, "a refused request must not touch any file");
  assert.ok(!fs.existsSync(path.join(f.dir, `${EVID}/${f.request.requestId}.json`)), "no receipt for a refused request");
}

test("accepts a figure-only re-bind: only fingerprints move, the parent link is restored, replay and projection checks pass", () => {
  const f = fixture();
  const before = readJson(f.dir, "archive/data/question_metadata.json");
  const dry = run(f);
  assert.equal(dry.status, "PASS"); assert.equal(dry.write, false);
  assert.equal(snapshot(f.dir).includes(f.request.items[0].after.sourceFingerprint), false, "dry run writes nothing");
  const done = run(f, { write: true });
  assert.equal(done.totalRebound, 1);
  const after = readJson(f.dir, "archive/data/question_metadata.json");
  const [item] = f.request.items;
  const changed = after.records[1], untouched = before.records[1];
  assert.equal(changed.sourceFingerprint, item.after.sourceFingerprint);
  assert.equal(changed.contentFingerprint, item.after.contentFingerprint);
  assert.deepEqual({ ...changed, sourceFingerprint: 0, contentFingerprint: 0 }, { ...untouched, sourceFingerprint: 0, contentFingerprint: 0 }, "no metadata value changes");
  assert.deepEqual(after.records[0], before.records[0], "the other question is untouched");
  const identity = readJson(f.dir, "archive/data/question_identity_map.json");
  assert.equal(identity.records[1].sourceFingerprint, item.after.sourceFingerprint);
  assert.ok(identity.identityDigest, "identity digest refreshed");
  const links = readJson(f.dir, "archive/data/basic-scope-source-links.json").records;
  assert.equal(links.length, 1);
  assert.deepEqual({ ...links[0], reason: 0 }, { grade: "고2", curriculumKey: "2015", courseKey: "수학I", sourceFile: SRC, sourceOrdinal: 2,
    sourceFingerprint: item.after.sourceFingerprint, L1: "삼각함수", L2: "삼각함수", reason: 0, sourceBodyFingerprint: item.after.contentFingerprint });
  const receipt = readJson(f.dir, `${EVID}/rebind-test-01.json`);
  assert.equal(receipt.metadataValuesChanged, false);
  assert.equal(receipt.applied[0].contentRule, "PLACEHOLDER_REMOVED+TEXT_FIX");
  // Replay (same request) and the read-only projection check both pass on the registered state.
  assert.equal(run(f, { write: true }).replay, true);
  assert.equal(run(f, { verifyProjection: true }).status, "PASS");
});

test("refuses a changed answer, choices, solution or classification field in the source", () => {
  for (const [field, value] of [["answer", "13"], ["choices", ["1", "3"]], ["solution", "다른 풀이"], ["level", "상"], ["subUnitKey", "H15-M1-05-TRIGONOMETRIC_RELATION"]]) {
    const bank = fixedQuestions(); bank[1][field] = value;
    const f = fixture({ current: bank });
    refuses(f, new RegExp(field === "answer" ? "answer changed" : field === "choices" ? "choices changed" : field === "solution" ? "solution changed" : `classification field changed in source: ${field}`));
  }
});

test("refuses stem changes beyond the placeholder line and declared digit-free text fixes", () => {
  const numberChanged = fixedQuestions(); numberChanged[1].content = "다음 그림과 같이 선분 $AC$의 길이를 구하시오. (7점)";
  refuses(fixture({ current: numberChanged }), /stem differs from approved stem/);
  const undeclared = fixedQuestions(); undeclared[1].content = "다음 그림과 같이 선분 $AC$의 길이를 구하시오.";
  refuses(fixture({ current: undeclared }), /stem differs from approved stem/);
  const f = fixture(); f.request.items[0].contentEdits = [{ from: "(6점)", to: "(7점)" }];
  refuses(f, /must not touch digits/);
  const g = fixture(); g.request.items[0].contentEdits = [{ from: "선분 $AC$의 길움을 구하시오", to: "선분 $AC$의 길이를 구하시오" }];
  refuses(g, /longer than 8 characters/);
  const h = fixture(); h.request.items[0].contentEdits = [{ from: "길움을", to: "길이를" }, { from: "없는글", to: "있는글" }];
  refuses(h, /exactly once/);
  const i = fixture(); i.request.items[0].contentEdits = [{ from: "길움을", to: "길이를" }, { from: "구하", to: "찾" }];
  refuses(i, /stem differs from approved stem/);
});

test("a stem edit without a newly attached figure is refused (the figure is the reason for this path)", () => {
  // q1 has no figure at all; a "typo fix" there must not pass just because the edit is short and digit-free.
  const bank = fixedQuestions(); bank[0] = { ...bank[0], content: "$\\sin\\theta=\\frac{1}{2}$일 때 수는?" };
  const f = fixture({ current: bank });
  const prior = baseQuestions()[0];
  f.request.items = [{ questionUid: uid(1), sourceOrdinal: 1,
    before: { sourceFingerprint: sourceFingerprint(prior), contentFingerprint: contentFingerprint(prior) },
    after: { sourceFingerprint: sourceFingerprint(bank[0]), contentFingerprint: contentFingerprint(bank[0]) },
    contentEdits: [{ from: "값은", to: "수는" }], reason: "typo", evidenceRefs: [] }];
  bind(f);
  refuses(f, /a newly attached figure is required/);
});

test("the figure must be this question's own file", () => {
  for (const image of [`assets/images/${EXAM_DIR}/q11.svg`, "assets/images/other-exam/q2.svg", `assets/images/${EXAM_DIR}/q2-solution.svg`, `assets/images/${EXAM_DIR}/sub/q2.svg`]) {
    const bank = fixedQuestions(); bank[1].image = image;
    const f = fixture({ current: bank, figure: false });
    write(f.dir, `archive/${image}`, "<svg xmlns=\"http://www.w3.org/2000/svg\"/>");
    refuses(f, /figure must be/);
  }
});

test("the human review file binds the stem edits and the resulting stem; short edits that flip meaning need the reviewer's record", () => {
  // The request declares an edit the reviewer never listed.
  const unlisted = fixture(); bind(unlisted, review => { review.questions[0].contentEdits = []; });
  refuses(unlisted, /contentEdits differ from the review file/);
  // The reviewer listed another edit than the request applies.
  const other = fixture(); bind(other, review => { review.questions[0].contentEdits = [{ from: "길움을", to: "길이을" }]; });
  refuses(other, /contentEdits differ from the review file/);
  // The reviewed resulting stem is not the stem in the source.
  const stem = fixture(); bind(stem, review => { review.questions[0].contentAfterSha256 = "0".repeat(64); });
  refuses(stem, /stem differs from the reviewed stem/);
  // A meaning-flipping but short, digit-free edit passes the character rules; only a review that records it can bind it.
  const bank = fixedQuestions(); bank[1].content = "다음 그림과 같이 선분 $AC$의 길이를 구하시오. (6점)".replace("구하", "찾");
  const flipped = fixture({ current: bank }); flipped.request.items[0].contentEdits = [{ from: "길움을", to: "길이를" }, { from: "구하", to: "찾" }];
  bind(flipped, review => { review.questions[0].contentEdits = [{ from: "길움을", to: "길이를" }]; });
  refuses(flipped, /contentEdits differ from the review file/);
  // No review file / more than one / not an approval evidence ref of this request.
  const none = fixture(); write(none.dir, `${EVID}/other.json`, "{}\n");
  none.request.approval.evidenceRefs = [{ path: `${EVID}/other.json`, sha256: sha256("{}\n") }];
  none.request.items[0].evidenceRefs = none.request.approval.evidenceRefs;
  refuses(none, /exactly one archive-basic-scope-rebind-review-v1 approval evidence file required/);
  const detached = fixture(); write(detached.dir, `${EVID}/other.json`, "{}\n");
  detached.request.items[0].evidenceRefs = [{ path: `${EVID}/other.json`, sha256: sha256("{}\n") }];
  refuses(detached, /evidenceRefs must include the review file/);
  const missingQ = fixture(); bind(missingQ, review => { review.questions = []; });
  refuses(missingQ, /review file needs exactly one entry/);
});

test("a review written for another request, exam or question cannot be reused", () => {
  for (const [what, tweak, pattern] of [
    ["requestId", r => { r.requestId = "basic-rebind-other-q11"; }, /requestId\/examUid\/sourceArchiveFile differ/],
    ["examUid", r => { r.examUid = "98_다른고_1학기_중간_고2_대수"; }, /requestId\/examUid\/sourceArchiveFile differ/],
    ["sourceArchiveFile", r => { r.sourceArchiveFile = "original/high/h2/1mid/98_다른고.js"; }, /requestId\/examUid\/sourceArchiveFile differ/],
    ["questionUid", r => { r.questions[0].questionUid = uid(1); }, /review file needs exactly one entry/],
    ["ordinal", r => { r.questions[0].sourceOrdinal = 1; }, /review file needs exactly one entry/],
    ["shape", r => { delete r.questions; }, /questions\[\] required/],
  ]) {
    const f = fixture(); bind(f, tweak);
    refuses(f, pattern);
  }
});

test("refuses placeholder removal without a newly attached figure", () => {
  const bank = fixedQuestions(); delete bank[1].image;
  refuses(fixture({ current: bank, figure: false }), /a newly attached figure is required/);
});

test("refuses when nothing changed, or the figure file is missing", () => {
  const tagsOnly = baseQuestions(); tagsOnly[1].tags = ["표시만"];
  refuses(fixture({ current: tagsOnly }), /nothing to rebind/);
  refuses(fixture({ current: baseQuestions() }), /previousSourceBlobSha1/);
  refuses(fixture({ figure: false }), /figure file missing/);
});

test("refuses metadata value changes in the request and any non-fingerprint field", () => {
  const f = fixture(); f.request.items[0].after.standardUnitKey = "H15-M1-06"; f.request.items[0].before.standardUnitKey = "H15-M1-05";
  refuses(f, /exactly sourceFingerprint and contentFingerprint/);
  const g = fixture(); delete g.request.items[0].after.contentFingerprint;
  refuses(g, /exactly sourceFingerprint and contentFingerprint/);
  const h = fixture(); h.request.registryChanges = [];
  refuses(h, /registryChanges are not allowed/);
});

test("refuses rows that are not basic-scope approved, are review-reset pending, or are not in the request exam", () => {
  refuses(fixture({ approvedMeta: { metadataStatus: "registration_pending_semantic_review" } }), /not a basic-scope approved row/);
  refuses(fixture({ approvedMeta: { fieldStatus: { standardUnit: "manual_review_pending", subUnit: "approved_source" } } }), /not a basic-scope approved row/);
  refuses(fixture({ approvedMeta: { approvalEvidence: [] } }), /not a basic-scope approved row/);
  refuses(fixture({ approvedMeta: { registrationUpdateState: { disposition: "PHYSICAL_META_UPDATED_REVIEW_RESET_PENDING" } } }), /pending review-reset state/);
  const unlisted = fixture(); unlisted.request.items[0].questionUid = "qid_v1_" + sha256("elsewhere#1");
  refuses(unlisted, /UID not in source exam/);
  const wrongOrdinal = fixture(); wrongOrdinal.request.items[0].sourceOrdinal = 1;
  refuses(wrongOrdinal, /UID\/source ordinal mismatch/);
  const dup = fixture(); dup.request.items.push({ ...dup.request.items[0] });
  refuses(dup, /duplicate item/);
});

test("refuses hash drift: source blob, previous blob, stored fingerprints, claimed after fingerprints", () => {
  const blob = fixture(); blob.request.expectedSourceBlobSha1 = "0".repeat(40);
  refuses(blob, /source Git blob drift/);
  const same = fixture(); same.request.previousSourceBlobSha1 = same.request.expectedSourceBlobSha1;
  refuses(same, /previousSourceBlobSha1/);
  const missing = fixture(); missing.request.previousSourceBlobSha1 = "1".repeat(40);
  refuses(missing, /previous source blob unavailable/);
  const wrongBefore = fixture(); wrongBefore.request.items[0].before.sourceFingerprint = "a".repeat(64);
  refuses(wrongBefore, /before fingerprints do not match the registered row/);
  const wrongAfter = fixture(); wrongAfter.request.items[0].after.contentFingerprint = "b".repeat(64);
  refuses(wrongAfter, /after fingerprints do not match the current source/);
  // Approval was about other bytes than the prior blob: the prior blob cannot reproduce the stored fingerprints.
  const stranger = fixture({ approvedMeta: { sourceFingerprint: "c".repeat(64), contentFingerprint: "d".repeat(64) } });
  stranger.request.items[0].before = { sourceFingerprint: "c".repeat(64), contentFingerprint: "d".repeat(64) };
  const metaPath = path.join(stranger.dir, "archive/data/question_identity_map.json");
  const identity = JSON.parse(fs.readFileSync(metaPath, "utf8")); identity.records[1].sourceFingerprint = "c".repeat(64); fs.writeFileSync(metaPath, JSON.stringify(identity) + "\n");
  refuses(stranger, /previous source blob does not reproduce the approved fingerprints/);
  const driftedIdentity = fixture();
  const identityPath = path.join(driftedIdentity.dir, "archive/data/question_identity_map.json");
  const drifted = JSON.parse(fs.readFileSync(identityPath, "utf8")); drifted.records[1].sourceFingerprint = "e".repeat(64); fs.writeFileSync(identityPath, JSON.stringify(drifted) + "\n");
  refuses(driftedIdentity, /before fingerprints do not match the registered row\/identity/);
});

test("refuses unbound or wrong approval and evidence", () => {
  const type = fixture(); type.request.approval.type = "REVIEW2";
  refuses(type, /BASIC_SCOPE_REBIND approval/);
  const unreviewed = fixture(); unreviewed.request.approval.metadataReviewed = false;
  refuses(unreviewed, /BASIC_SCOPE_REBIND approval/);
  const drift = fixture(); drift.request.approval.evidenceRefs[0].sha256 = "f".repeat(64);
  refuses(drift, /evidence missing\/drift/);
  const outside = fixture(); outside.request.items[0].evidenceRefs = [{ path: "archive/data/question_metadata.json", sha256: sha256(fs.readFileSync(path.join(outside.dir, "archive/data/question_metadata.json"))) }];
  refuses(outside, /evidence outside/);
  const noRefs = fixture(); noRefs.request.items[0].evidenceRefs = [];
  refuses(noRefs, /evidenceRefs required/);
  const reused = fixture(); run(reused, { write: true }); reused.request.items[0].reason = "another reason";
  assert.throws(() => run(reused, { write: true }), /requestId reused with different content/);
});

test("basicParent must be the single canonical parent of the approved sub-unit; an existing link may not change its parent", () => {
  const f = fixture(); f.request.items[0].basicParent.L2 = "삼각함수의 활용";
  refuses(f, /not the single canonical parent/);
  const ambiguous = fixture({ parentRows: [
    { grade: "고2", curriculumKey: "2015", courseKey: "수학I", standardUnitKey: "H15-M1-05", subUnitKey: "H15-M1-05-TRIGONOMETRIC_DEFINITION", L1: "삼각함수", L2: "삼각함수" },
    { grade: "고2", curriculumKey: "2015", courseKey: "수학I", standardUnitKey: "H15-M1-05", subUnitKey: "H15-M1-05-TRIGONOMETRIC_DEFINITION", L1: "삼각함수", L2: "다른 중단원" }] });
  refuses(ambiguous, /not the single canonical parent/);
  const existing = { grade: "고2", curriculumKey: "2015", courseKey: "수학I", sourceFile: SRC, sourceOrdinal: 2, sourceFingerprint: "a".repeat(64), L1: "삼각함수", L2: "다른 중단원", reason: "r", sourceBodyFingerprint: "b".repeat(64) };
  refuses(fixture({ links: [existing] }), /existing reviewed link has another parent/);
  // A reviewed link that exists must be re-bound together with the metadata, never silently left behind.
  const silent = fixture({ links: [{ ...existing, L2: "삼각함수" }] }); delete silent.request.items[0].basicParent;
  refuses(silent, /supply basicParent/);
  const ok = fixture({ links: [{ ...existing, L2: "삼각함수" }] });
  run(ok, { write: true });
  const links = readJson(ok.dir, "archive/data/basic-scope-source-links.json").records;
  assert.equal(links.length, 1, "the existing link is re-bound, not duplicated");
  assert.equal(links[0].sourceBodyFingerprint, ok.request.items[0].after.contentFingerprint);
  assert.equal(links[0].reason, "r", "the reviewed reason is kept");
});

test("the registrar, pass script, consumer verifier and commit paths know the rebind schema", () => {
  const read = rel => fs.readFileSync(path.join(repoRoot, rel), "utf8");
  assert.match(read("archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs"), /archive-basic-scope-rebind-request-v1[\s\S]{0,200}register-basic-scope-rebind\.mjs/);
  assert.match(read("tools/ci/reviewed-meta-register-pass.sh"), /"\$schema" == "archive-basic-scope-rebind-request-v1"[^\n]* \]\]; then\n      verify_rc/);
  assert.match(read("tools/ci/reviewed-meta-register-pass.sh"), /node --test tests\/archive-basic-scope-rebind\.test\.mjs/);
  assert.match(read("archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs"), /BASIC_REBIND: "archive-basic-scope-rebind-request-v1"/);
  assert.ok(read("tools/ci/archive-meta-register-commit.paths").split(/\r?\n/).includes("archive/data/basic-scope-source-links.json"), "the link file is committed by the single writer");
});

// A small real canonical bundle, committed with the original metadata and
// source. No mocked approval predicate is used by the preservation tests.
function preservationFixture(t, { text = false, fullDrift = false, approved = true, assets = {}, mutateCurrent = () => {} } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "basic-preservation-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, "init", "-q"); git(dir, "config", "user.email", "t@example.invalid"); git(dir, "config", "user.name", "t");
  const source = "original/middle/m2/1mid/26_테스트중_1학기_중간_중2_기출.js";
  const questionUid = "qid_v1_" + sha256(source + "#1");
  const parent = { grade: "중2", curriculumKey: "2015", courseKey: "M2-1", L1: "일차부등식", L2: "일차부등식의 활용" };
  const questions = [{ id: 1, standardCourse: "중2 수학", standardUnitKey: "M2-02", subUnitKey: "M2-02-LINEAR_INEQUALITY_WORD",
    problemTypeKey: null, templateKey: null, level: "중", content: "처음에 간 거리를 구하시오. $x>20$", choices: ["", " ", ""], answer: "21", solution: "처음에 간 거리는 $21$이다." },
  { id: 2, content: "unselected", choices: [], answer: "1", solution: "1" }];
  Object.assign(questions[0], assets);
  const prior = structuredClone(questions), q = prior[0];
  const before = { sourceFingerprint: fullDrift ? "f".repeat(64) : sourceFingerprint(q), contentFingerprint: contentFingerprint(q) };
  const metadata = { records: [{ questionUid, sourceArchiveFile: source, sourceOrdinal: 1, sourceQuestionNo: "1", ...before,
    standardCourse: "중2 수학", standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey, problemTypeKey: "", templateKey: "",
    fieldStatus: { standardUnit: "approved_source", subUnit: "approved_source", problemType: "manual_review_pending", template: "manual_review_pending" },
    metadataStatus: "approved_partial_with_explicit_holds", approvalEvidence: ["archive/_generated/prior-basic.json"],
    difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "B23", legacyLevelCompatibility: "NORMAL" },
  { questionUid: questionUid + "2", sourceArchiveFile: source, sourceOrdinal: 2, keep: "metadata" }] };
  const identity = { records: [{ questionUid, sourceArchiveFile: source, sourceOrdinal: 1, sourceFingerprint: before.sourceFingerprint },
    { questionUid: questionUid + "2", sourceArchiveFile: source, sourceOrdinal: 2, keep: "identity" }] };
  write(dir, `archive/exams/${source}`, sourceText(prior));
  write(dir, "archive/data/question_metadata.json", JSON.stringify(metadata));
  write(dir, "archive/data/question_identity_map.json", JSON.stringify(identity));
  const master = { records: [{ curriculum: "2015", scope: "M2-1", majorUnit: parent.L1, midUnit: parent.L2, concepts: [] }] };
  const masterSha = sha256(JSON.stringify(master));
  const resources = Object.fromEntries(canonical.MANIFEST_REQUIRED_PATHS.map(p => [p, {}]));
  resources[canonical.CANONICAL_MASTER_PATH] = master;
  resources["data/archive2-canonical-projection-policy.json"] = { schemaVersion: "archive2-canonical-projection-policy-v1", status: "ACTIVE",
    canonicalMasterSha256: masterSha, gradeCourseAllowlist: [{ grade: "중2", curriculumKey: "2015", courseKey: "M2-1" }] };
  resources["data/basic-scope-parent-links.json"] = { schemaVersion: "archive2-basic-scope-parent-links-v1", status: "DERIVED_READ_ONLY", authority: { sha256: masterSha },
    records: [{ ...parent, standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey },
      { ...parent, curriculumKey: "2022", standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey }], sourceParents: [], groups: [] };
  resources["data/basic-scope-source-links.json"] = { status: "REVIEWED_SCOPE_LINKS", records: [] };
  resources["data/archive2-item-review-overrides.json"] = { schemaVersion: "archive2-item-review-override-index-v1", status: "DERIVED_READ_ONLY", records: [] };
  resources["data/meta-foundation/compiled/taxonomy_registry.json"] = { status: "DERIVED_READ_ONLY", problemTypes: [], templates: [] };
  resources["data/meta-foundation/compiled/curriculum_bindings.json"] = { status: "DERIVED_READ_ONLY", bindings: [] };
  for (const p of canonical.RUNTIME_INPUT_PATHS) resources[p] = { status: "ACTIVE", packId: p, records: [], taxonomyRows: [], ownedScopes: [] };
  const assignment = { questionUid, sourceFile: source, sourceOrdinal: 1, ...parent,
    sourceFingerprint: before.contentFingerprint, assignmentFingerprint: before.contentFingerprint,
    approvalStatus: approved ? "APPROVED" : "HOLD", taxonomyVersion: masterSha,
    reviewEvidence: { status: "PASS", reference: "prior-review.json", sha256: "b".repeat(64) } };
  resources["data/archive2-catalog.json"] = { schemaVersion: "archive2-v1", indexVersion: "test", taxonomy: [parent], exams: [{ file: source, grade: "중2", qCount: 2 }],
    sourceHashes: [[source, sha256(sourceText(prior))]], records: [{ questionUid, sourceFile: source, sourceOrdinal: 1, sourceGrade: "중2",
      identityStatus: "VERIFIED", sourceStatus: "VERIFIED", sourceIntegrityStatus: "VERIFIED", sourceFingerprint: sourceFingerprint(q),
      assignmentFingerprint: before.contentFingerprint, ...parent, standardUnitKey: q.standardUnitKey, subUnitKey: q.subUnitKey,
      reviewStatus: "reviewed_pass", assignmentEvidence: assignment }] };
  const files = Object.entries(resources).map(([p, value]) => { const raw = JSON.stringify(value); write(dir, `archive/${p}`, raw); return { path: p, sha256: sha256(raw) }; });
  write(dir, "archive/data/archive2-canonical-input-manifest.json", JSON.stringify({ schemaVersion: "archive2-canonical-input-manifest-v1",
    resolverVersion: canonical.RESOLVER_VERSION, files,
    projectionVersion: "archive2-canonical-v1:" + sha256(canonical.projectionManifestPayload(files)) }));
  git(dir, "add", "-A"); git(dir, "commit", "-qm", "original basic approval");
  const priorCommit = git(dir, "rev-parse", "HEAD"), previousBlob = git(dir, "hash-object", `archive/exams/${source}`);
  const textEdits = text ? { content: [{ from: "처음에 간 거리를", to: "처음에 뛴 거리를" }], solution: [{ from: "처음에 간 거리는", to: "처음에 뛴 거리는" }] } : {};
  if (text) for (const [field, edits] of Object.entries(textEdits)) questions[0][field] = questions[0][field].replace(edits[0].from, edits[0].to);
  else questions[0].choices = [];
  mutateCurrent(questions[0]);
  write(dir, `archive/exams/${source}`, sourceText(questions));
  const after = { sourceFingerprint: sourceFingerprint(questions[0]), contentFingerprint: contentFingerprint(questions[0]) };
  const request = { schemaVersion: "archive-basic-scope-rebind-request-v1", requestId: "basic-current-preservation", examUid: "test-middle",
    sourceArchiveFile: source, expectedQuestionCount: 2, previousSourceCommit: priorCommit, previousSourceBlobSha1: previousBlob,
    expectedSourceBlobSha1: git(dir, "hash-object", `archive/exams/${source}`),
    approval: { type: "BASIC_SCOPE_REBIND", metadataReviewed: true, approvedBy: "independent", evidenceRefs: [],
      sourceReview: { schemaVersion: BASIC_PRESERVATION_SCHEMA, priorCommit, repairBaseCommit: priorCommit } },
    items: [{ questionUid, sourceOrdinal: 1, before, after, basicParent: parent, reason: "preserve an existing basic approval",
      repairKind: text ? "REVIEWED_KOREAN_TEXT_ONLY" : "EMPTY_CHOICE_PLACEHOLDERS_ONLY", textEdits, evidenceRefs: [] }] };
  const item = request.items[0], hashValue = v => sha256(stableBasicValue(v) ?? "undefined");
  const changes = Object.keys({ ...prior[0], ...questions[0] }).filter(k => stableBasicValue(prior[0][k]) !== stableBasicValue(questions[0][k])).sort()
    .map(field => ({ field, beforeSha256: hashValue(prior[0][field]), afterSha256: hashValue(questions[0][field]) }));
  const record = { questionUid, sourceOrdinal: 1, repairKind: item.repairKind, textEdits, changes, basicParent: parent,
    beforeQuestionSha256: hashValue(prior[0]), afterQuestionSha256: hashValue(questions[0]), decision: "PRESERVE_EXISTING_BASIC_ONLY" };
  const save = (name, doc) => { const raw = JSON.stringify(doc); const rel = `${EVID}/${name}.json`; write(dir, rel, raw); return { path: rel, sha256: sha256(raw) }; };
  const input = { schemaVersion: "archive-basic-scope-preservation-review-input-v1", rows: [record] }, inputRef = save("basic-input", input);
  const independent = { schemaVersion: "archive-basic-scope-preservation-independent-review-v1", reviewer: "independent", inputSha256: inputRef.sha256,
    status: "PASS_FOR_EXACT_DECLARED_REPAIR_AND_EXISTING_BASIC_ONLY", rows: [{ ...record, sourcePath: `archive/exams/${source}`,
      priorCommit, repairBaseCommit: priorCommit, verifiedCurrentSourceRawSha256: sha256(sourceText(questions)), newAdvancedApproval: false }] };
  const independentRef = save("basic-independent", independent);
  const review = { schemaVersion: BASIC_PRESERVATION_REVIEW_SCHEMA, requestId: request.requestId, examUid: request.examUid, sourceArchiveFile: source,
    expectedQuestionCount: 2, expectedSourceBlobSha1: request.expectedSourceBlobSha1, priorCommit, repairBaseCommit: priorCommit,
    status: "PASS", decision: "PRESERVE_EXISTING_BASIC_ONLY", reviewedBy: "independent", preparedBy: "implementer", newMetadataApprovals: 0, advancedApprovals: 0,
    independentInputRef: inputRef, independentReviewRef: independentRef, questions: [record] };
  const reviewRef = save("basic-current-review", review);
  request.approval.evidenceRefs = [reviewRef, independentRef, inputRef]; item.evidenceRefs = structuredClone(request.approval.evidenceRefs);
  return { dir, request, prior, current: questions, metadata, identity, review, reviewRef, independent, independentRef, input, inputRef, save };
}

test("reviewed basic preservation restores empty-choice and exact text repairs, including a prior full-only fingerprint drift", t => {
  for (const opts of [{ fullDrift: true }, { text: true }]) {
    const f = preservationFixture(t, opts), before = snapshot(f.dir);
    const dry = run(f); assert.equal(dry.preservedMetadataApprovals, 1); assert.equal(dry.newMetadataApprovals, 0);
    assert.equal(snapshot(f.dir), before);
    const result = run(f, { write: true }); assert.equal(result.advancedApprovals, 0);
    const metadata = readJson(f.dir, "archive/data/question_metadata.json"), identity = readJson(f.dir, "archive/data/question_identity_map.json");
    assert.deepEqual({ ...metadata.records[0], ...f.request.items[0].before }, f.metadata.records[0]);
    assert.deepEqual(metadata.records[1], f.metadata.records[1]); assert.deepEqual(identity.records[1], f.identity.records[1]);
    const digest = metadata.digest; delete metadata.digest; assert.equal(digest, sha256(JSON.stringify(metadata)));
    assert.equal(run(f, { write: true }).replay, true);
    const projection = run(f, { verifyProjection: true }); assert.equal(projection.consumerSearchStatus, "STATIC_VALUES_VERIFIED");
    assert.equal(projection.preservedMetadataApprovals, 1);
    assert.equal(readJson(f.dir, `${EVID}/${f.request.requestId}.json`).applied[0].preexistingFullFingerprintDrift, !!opts.fullDrift);
  }
});

test("reviewed basic preservation refuses nonblank choices, numeric/answer/classification edits and unsupported repair kinds", t => {
  for (const mutateCurrent of [q => { q.answer = "22"; }, q => { q.choices = ["1"]; }, q => { q.level = "상"; }, q => { q.content += " $2$"; }]) {
    const f = preservationFixture(t, { mutateCurrent }); refuses(f, /only empty choice placeholders/);
  }
  const f = preservationFixture(t, { text: true, mutateCurrent: q => { q.solution += " $22$"; } }); refuses(f, /undeclared text change/);
  const g = preservationFixture(t); g.request.items[0].repairKind = "ANY_SOURCE_CHANGE"; refuses(g, /current-source review mismatch/);
});

test("reviewed basic preservation refuses prior HOLD, parent replacement, changed protected metadata and an active runtime", t => {
  refuses(preservationFixture(t, { approved: false }), /exact canonical basic parent is not approved/);
  const wrongParent = preservationFixture(t); wrongParent.request.items[0].basicParent.curriculumKey = "2022";
  refuses(wrongParent, /exact canonical basic parent is not approved|review mismatch/);
  for (const change of [row => { row.fieldStatus.problemType = "approved"; }, row => { row.metadataApprovalType = "FINAL_QA"; }, row => { row.subUnitKey = "OTHER"; }]) {
    const f = preservationFixture(t), md = readJson(f.dir, "archive/data/question_metadata.json"); change(md.records[0]);
    write(f.dir, "archive/data/question_metadata.json", JSON.stringify(md)); refuses(f, /protected approval\/identity values changed/);
  }
  const f = preservationFixture(t), rel = "archive/" + canonical.RUNTIME_INPUT_PATHS[0], runtime = readJson(f.dir, rel);
  runtime.records.push({ questionUid: f.request.items[0].questionUid }); write(f.dir, rel, JSON.stringify(runtime));
  refuses(f, /current runtime approval cannot use/);
});

test("reviewed basic preservation refuses independent evidence drift, missing commit and receipt tampering", t => {
  const f = preservationFixture(t); write(f.dir, f.independentRef.path, JSON.stringify({ ...f.independent, status: "HOLD" })); refuses(f, /evidence missing\/drift/);
  const g = preservationFixture(t); g.request.approval.sourceReview.priorCommit = "a".repeat(40); refuses(g, /independent review scope/);
  const h = preservationFixture(t); run(h, { write: true });
  const rel = `${EVID}/${h.request.requestId}.json`, receipt = readJson(h.dir, rel); receipt.newMetadataApprovals = 1; write(h.dir, rel, JSON.stringify(receipt));
  assert.throws(() => run(h, { verifyProjection: true }), /receipt\/protected value drift/);
});

test("reviewed basic preservation rejects unchanged external, alternate and inline render asset shapes", t => {
  for (const assets of [{ image: "assets/images/q1.svg" }, { images: ["q1.svg"] }, { solutionImage: "solution.svg" },
    { solutionImages: ["solution.svg"] }, { sharedMaterial: "<svg><image href='nested.svg'/></svg>" },
    { explanation: "<img src='figure.png'>" }, { extra: { figure: { src: "figure.png" } } }])
    refuses(preservationFixture(t, { assets }), /render assets are outside text-only preservation/);
});
