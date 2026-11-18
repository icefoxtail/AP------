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
import { NATIVE_BASIC_HOLD_SCHEMA, NATIVE_BASIC_HOLD_REVIEW_SCHEMA, NATIVE_BASIC_HOLD_REASON } from "../archive/tools/meta-foundation/native-basic-hold-preservation.mjs";
import { NATIVE_BASIC_PARENT_SCHEMA, NATIVE_BASIC_PARENT_REVIEW_SCHEMA } from "../archive/tools/meta-foundation/reviewed-native-basic-parent.mjs";
import { REASSESSED_STUDENT_FIELDS } from "../archive/tools/meta-foundation/reviewed-source-reassessment.mjs";
import { BASIC_HELD_RENDERER_SCHEMA, BASIC_HELD_RENDERER_EVIDENCE_SCHEMA } from "../archive/tools/meta-foundation/basic-held-renderer-continuity.mjs";

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
  // Projection verification moved into the read-only batch phase. Keep the
  // schema, registrar call and refusal result bound to that current route.
  const passScript = read("tools/ci/reviewed-meta-register-pass.sh");
  const projectionPhase = read("tools/ci/verify-reviewed-projection-requests.mjs");
  assert.match(passScript, /node tools\/ci\/verify-reviewed-projection-requests\.mjs[^\n]*-- "\$\{applied\[@\]\}"/);
  const projectedSchemas = /const PROJECTED = new Set\(\[([\s\S]*?)\]\);/.exec(projectionPhase);
  assert.ok(projectedSchemas, "the projection phase declares its supported request schemas");
  assert.match(projectedSchemas[1], /['"]archive-basic-scope-rebind-request-v1['"]/);
  const cliProjection = /else if\s*\(PROJECTED\.has\(row\.schema\)\)\s*\{([\s\S]*?)\n\s{6}\}/.exec(projectionPhase);
  assert.ok(cliProjection, "non-v2 projected requests keep the existing registrar verifier");
  assert.match(cliProjection[1], /spawnSync\(process\.execPath,\s*\['archive\/tools\/meta-foundation\/register-reviewed-exam-meta-source\.mjs',\s*'--request', row\.request, '--verify-projection'\]/);
  assert.match(cliProjection[1], /ok = result\.status === 0/);
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

// Reconstructed after loss of the unpublished e511 workspace. These are new
// executions against the public production registrar, not recovered old PASSes.
function nativeHoldFixture(t, { held = true, nativeChange = () => {}, holdChange = () => {}, currentExtra = {}, svg, problemSvg } = {}) {
  const problemPath = 'archive/assets/images/test/q1.svg';
  const f = preservationFixture(t, { assets: problemSvg === undefined ? {} : { image: problemPath.slice('archive/'.length) } }), { dir } = f;
  if (problemSvg !== undefined) write(dir, problemPath, problemSvg);
  const uid = f.request.items[0].questionUid, source = f.request.sourceArchiveFile, sourcePath = `archive/exams/${source}`;
  const hash = value => sha256(stableBasicValue(value) ?? "undefined");
  const payload = q => Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k => [k, Object.hasOwn(q, k) ? q[k] : null]));
  const runtimePath = "archive/" + canonical.RUNTIME_INPUT_PATHS[0];
  const runtime = readJson(dir, runtimePath);
  const heldRecord = { questionUid: uid, sourceArchiveFile: source, sourceOrdinal: 1,
    sourceFingerprint: f.request.items[0].before.sourceFingerprint, problemTypeKey: "PT_UNRESOLVED", templateKey: null,
    difficultyBucket: 3, difficultyConfidence: "medium", metadataStatus: "EXPLICIT_L4_HOLD", metaFoundationStatus: "EXPLICIT_L4_HOLD",
    metaFoundationL4Status: "EXPLICIT_HOLD", reviewStatus: "manual_review", defaultSelectable: false };
  if (held) runtime.records.push(heldRecord);
  write(dir, runtimePath, JSON.stringify(runtime));
  write(dir, sourcePath, sourceText(f.prior));
  const refreshManifest = () => {
    const manifest = readJson(dir, "archive/data/archive2-canonical-input-manifest.json");
    manifest.files.forEach(row => { row.sha256 = sha256(fs.readFileSync(path.join(dir, "archive", row.path))); });
    manifest.projectionVersion = "archive2-canonical-v1:" + sha256(canonical.projectionManifestPayload(manifest.files));
    write(dir, "archive/data/archive2-canonical-input-manifest.json", JSON.stringify(manifest));
  };
  refreshManifest(); git(dir, "add", "-A"); git(dir, "commit", "-qm", "immutable existing basic and explicit hold");
  const priorCommit = git(dir, "rev-parse", "HEAD"), previousBlob = git(dir, "hash-object", sourcePath);
  const current = structuredClone(f.prior);
  Object.assign(current[0], { solution: "검토된 해설. $x>20$에서 정수 최솟값은 $21$이다.", problemTypeKey: "PT_CANDIDATE", templateKey: "TPL_NOT_APPROVED", ...currentExtra });
  const assetPath = "archive/assets/images/test/q1-solution.svg";
  if (svg !== undefined) { current[0].solutionImage = assetPath.slice("archive/".length); write(dir, assetPath, svg); }
  write(dir, sourcePath, sourceText(current)); git(dir, "add", "-A"); git(dir, "commit", "-qm", "native reviewed current source");
  const baseSha = git(dir, "rev-parse", "HEAD"), sourceBlob = git(dir, "hash-object", sourcePath);
  const native = { schemaVersion: "m2-s2-meta-review-v1", owner: "native-reviewer", sourceArchiveFile: source,
    reviewedQuestionCount: 2, sourceGitBlobSha: sourceBlob, baseSha, items: current.map((q, i) => ({
      questionUid: i ? uid + "2" : uid, sourceOrdinal: i + 1, rpmDecision: "KEEP", after: {}, activeDefinitionMatch: { templateKey: null },
      evidenceScope: { sourceRead: true, solutionRead: true }, proposalRefs: [], registrationDebt: ["OFFICIAL_RESOLVER_RECEIPT_REQUIRED"],
    })) };
  nativeChange(native);
  const nativePath = "review/native.json", nativeRaw = JSON.stringify(native); write(dir, nativePath, nativeRaw);
  git(dir, "add", "-A"); git(dir, "commit", "-qm", "immutable native review");
  const nativeCommit = git(dir, "rev-parse", "HEAD"), q = current[0];
  const sourceRef = commit => ({ commit, path: sourcePath, blob: sourceBlob, sha256: sha256(sourceText(current)), questionStableSha256: hash(q) });
  const rendererAssets = svg === undefined ? [] : [{ path: assetPath, field: "solutionImage", commit: nativeCommit,
    gitBlobSha1: git(dir, "hash-object", assetPath), sha256: sha256(svg), nativeCommit,
    nativeGitBlobSha1: git(dir, "hash-object", assetPath), nativeSha256: sha256(svg), unchangedFromNative: true, visuallyInspected: true }];
  if (problemSvg !== undefined) rendererAssets.push({ path: problemPath, field: 'image', commit: nativeCommit,
    gitBlobSha1: git(dir, 'hash-object', problemPath), sha256: sha256(problemSvg), nativeCommit,
    nativeGitBlobSha1: git(dir, 'hash-object', problemPath), nativeSha256: sha256(problemSvg), unchangedFromNative: true, visuallyInspected: true });
  const application = { questionUid: uid, sourceOrdinal: 1, nativeReviewRef: { commit: nativeCommit, path: nativePath, sha256: sha256(nativeRaw) },
    nativeItemStableSha256: hash(native.items[0]), nativeAfterSha256: hash(native.items[0].after), nativeActiveDefinitionMatchSha256: hash(native.items[0].activeDefinitionMatch),
    immutableSourceBefore: sourceRef(baseSha), immutableReviewedSource: sourceRef(nativeCommit), currentSource: sourceRef(nativeCommit),
    studentPayloadFields: REASSESSED_STUDENT_FIELDS, studentPayloadSha256: hash(payload(q)), rendererAssets, rendererReview: "independently inspected current rendered panels",
    decision: "HOLD_CURRENT_TEMPLATE_DEFINITION_MISMATCH", allowedRetentionFields: [], approvedValues: {}, rationale: "Independent subquestions do not have a single combined primary.",
    originalNativeAfterPreserved: true, sourcePayloadChangeApproved: false, newMathematicalQa: false, newReview2: false, newDifficultyApproval: false };
  const hold = { schemaVersion: "archive-independent-existing-primary-disposition-v1", scope: "EXISTING_PRIMARY_RETENTION_ONLY",
    reviewerOwner: "independent", reviewerRole: "INDEPENDENT_REVIEWER", sourceWrites: 0, canonicalWrites: 0, newDefinitions: 0,
    newMathematicalQa: false, newReview2: false, newDifficultyApproval: false, officialRegistrationRequired: true, actualMainRegistered: false,
    applications: [application] };
  holdChange(hold);
  const holdPath = "review/hold.json", holdRaw = JSON.stringify(hold); write(dir, holdPath, holdRaw);
  git(dir, "add", "-A"); git(dir, "commit", "-qm", "immutable independent primary hold");
  const holdCommit = git(dir, "rev-parse", "HEAD");
  const nativeRef = f.save("native-copy", native), holdRef = f.save("hold-copy", hold);
  const item = { questionUid: uid, sourceOrdinal: 1, before: f.request.items[0].before,
    after: { sourceFingerprint: sourceFingerprint(q), contentFingerprint: contentFingerprint(q) }, basicParent: f.request.items[0].basicParent,
    holdReasonCode: NATIVE_BASIC_HOLD_REASON, reason: "Preserve exact basic approval and unapproved advanced hold", evidenceRefs: [] };
  const request = { schemaVersion: "archive-basic-scope-rebind-request-v1", requestId: "native-basic-held-source", examUid: "test-middle", sourceArchiveFile: source,
    expectedQuestionCount: 2, previousSourceCommit: priorCommit, previousSourceBlobSha1: previousBlob, expectedSourceBlobSha1: sourceBlob,
    approval: { type: "BASIC_SCOPE_REBIND", metadataReviewed: true, approvedBy: "independent", evidenceRefs: [], sourceReview: {
      schemaVersion: NATIVE_BASIC_HOLD_SCHEMA, priorCommit, nativeReviewCommit: nativeCommit, nativeReviewPath: nativePath, nativeReviewRef: nativeRef,
      holdReviewCommit: holdCommit, holdReviewPath: holdPath, holdReviewRef: holdRef } }, items: [item] };
  const wrapper = { schemaVersion: NATIVE_BASIC_HOLD_REVIEW_SCHEMA, requestId: request.requestId, examUid: request.examUid, sourceArchiveFile: source,
    expectedQuestionCount: 2, expectedSourceBlobSha1: sourceBlob, priorCommit, status: "PASS", decision: "PRESERVE_EXISTING_BASIC_AND_EXPLICIT_TYPE_HOLD",
    reviewedBy: "independent", preparedBy: "implementer", newMetadataApprovals: 0, advancedApprovals: 0, questions: [{ questionUid: uid, sourceOrdinal: 1,
      holdReasonCode: NATIVE_BASIC_HOLD_REASON, basicParent: item.basicParent, nativeItemSha256: hash(native.items[0]), currentQuestionSha256: hash(q),
      priorMetadataSha256: hash(f.metadata.records[0]), priorIdentitySha256: hash(f.identity.records[0]) }] };
  const reviewRef = f.save("native-hold-wrapper", wrapper);
  request.approval.evidenceRefs = [reviewRef, nativeRef, holdRef]; item.evidenceRefs = structuredClone(request.approval.evidenceRefs);
  return { ...f, request, current, native, hold, wrapper, nativeRef, holdRef, reviewRef, runtimePath, heldRecord, assetPath, problemPath, refreshManifest };
}

test("native source hold preserves basic approval and every held runtime field through write/replay/projection", t => {
  for (const held of [false, true]) {
    const f = nativeHoldFixture(t, { held }), before = snapshot(f.dir), runtime = fs.readFileSync(path.join(f.dir, f.runtimePath));
    const dry = run(f); assert.equal(dry.preservedMetadataApprovals, 1); assert.equal(dry.newMetadataApprovals, 0); assert.equal(snapshot(f.dir), before);
    const result = run(f, { write: true }); assert.equal(result.advancedApprovals, 0); assert.equal(result.heldRuntimeBindings.length, Number(held));
    assert.deepEqual(fs.readFileSync(path.join(f.dir, f.runtimePath)), runtime);
    const md = readJson(f.dir, "archive/data/question_metadata.json"), id = readJson(f.dir, "archive/data/question_identity_map.json");
    assert.deepEqual({ ...md.records[0], ...f.request.items[0].before }, f.metadata.records[0]);
    assert.deepEqual({ ...id.records[0], sourceFingerprint: f.request.items[0].before.sourceFingerprint }, f.identity.records[0]);
    assert.deepEqual(md.records[1], f.metadata.records[1]); assert.deepEqual(id.records[1], f.identity.records[1]);
    assert.equal(run(f, { write: true }).replay, true);
    const projection = run(f, { verifyProjection: true }); assert.equal(projection.consumerSearchStatus, "STATIC_VALUES_VERIFIED");
    assert.deepEqual(projection.metaOnlyHoldReasons, [{ questionUid: f.request.items[0].questionUid, reason: NATIVE_BASIC_HOLD_REASON }]);
  }
});

test("native hold requires immutable full-bank source review and a separate zero-approval HOLD", t => {
  for (const nativeChange of [n => { n.items.pop(); }, n => { n.items[0].rpmDecision = "CORRECT"; }, n => { n.items[0].evidenceScope.solutionRead = false; },
    n => { n.items[0].contentDebt = ["MISSING_SOURCE"]; }, n => { n.items[0].proposalRefs = ["unresolved"]; }])
    refuses(nativeHoldFixture(t, { nativeChange }), /native review|native source review/);
  for (const holdChange of [h => { h.reviewerOwner = "native-reviewer"; }, h => { h.newReview2 = true; }, h => { h.applications[0].decision = "APPROVED_EXISTING_PRIMARY"; },
    h => { h.applications[0].allowedRetentionFields = ["problemTypeKey"]; }, h => { h.applications[0].nativeItemStableSha256 = "a".repeat(64); }])
    refuses(nativeHoldFixture(t, { holdChange }), /independent.*(?:scope|disposition)/);
});

test("native hold refuses changes to the current source, historical body, or immutable source binding", t => {
  for (const field of ["content", "choices", "answer", "solution", "subUnitKey", "layoutTag"]) {
    const f = nativeHoldFixture(t); f.current[0][field] = field === "choices" ? ["changed"] : "changed";
    write(f.dir, `archive/exams/${f.request.sourceArchiveFile}`, sourceText(f.current));
    f.request.expectedSourceBlobSha1 = git(f.dir, "hash-object", `archive/exams/${f.request.sourceArchiveFile}`);
    f.request.items[0].after = { sourceFingerprint: sourceFingerprint(f.current[0]), contentFingerprint: contentFingerprint(f.current[0]) };
    refuses(f, /historical approved body|current student payload|current question differs/);
  }
  const f = nativeHoldFixture(t); f.request.previousSourceCommit = f.request.approval.sourceReview.nativeReviewCommit;
  refuses(f, /historical approved body/);
  const g = nativeHoldFixture(t); g.request.approval.sourceReview.nativeReviewPath = "review/hold.json";
  refuses(g, /immutable input|immutable evidence bytes/);
});

test("native hold preserves all existing metadata including difficulty and all identity values", t => {
  for (const mutate of [r => { r.difficultyConfidence = "medium"; }, r => { r.problemTypeKey = "PT_APPROVED"; }, r => { r.fieldStatus.template = "approved"; },
    r => { r.approvalEvidence.push("new-approval"); }]) {
    const f = nativeHoldFixture(t), md = readJson(f.dir, "archive/data/question_metadata.json"); mutate(md.records[0]);
    write(f.dir, "archive/data/question_metadata.json", JSON.stringify(md)); refuses(f, /protected prior metadata/);
  }
  const f = nativeHoldFixture(t), ids = readJson(f.dir, "archive/data/question_identity_map.json"); ids.records[0].alias = "new";
  write(f.dir, "archive/data/question_identity_map.json", JSON.stringify(ids)); refuses(f, /protected prior metadata/);
});

test("native hold rejects absent, added, modified or approved runtime rows without writing", t => {
  for (const mutate of [r => r.records.splice(0), r => { r.records[0].difficultyConfidence = "high"; }, r => { r.records[0].metadataApprovalType = "FINAL_QA"; },
    r => { r.records[0].defaultSelectable = true; }, r => r.records.push({ ...r.records[0] })]) {
    const f = nativeHoldFixture(t), runtime = readJson(f.dir, f.runtimePath); mutate(runtime);
    write(f.dir, f.runtimePath, JSON.stringify(runtime)); refuses(f, /held runtime|explicit unapproved L4 hold/);
  }
  const f = nativeHoldFixture(t, { held: false }), runtime = readJson(f.dir, f.runtimePath); runtime.records.push(f.heldRecord);
  write(f.dir, f.runtimePath, JSON.stringify(runtime)); refuses(f, /held runtime/);
});

test("native hold binds exact live renderer bytes, and refuses hidden HTML or nested external SVG dependencies", t => {
  const safeSvg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>';
  const nested = '<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/svg+xml;base64,' + Buffer.from(safeSvg).toString("base64") + '"/></svg>';
  const f = nativeHoldFixture(t, { svg: nested }); assert.equal(run(f, { write: true }).status, "PASS");
  write(f.dir, f.assetPath, nested.replace("</svg>", "<!-- changed --></svg>"));
  assert.throws(() => run(f, { verifyProjection: true }), /current renderer bytes differ/);
  const g = nativeHoldFixture(t, { svg: safeSvg }); fs.unlinkSync(path.join(g.dir, g.assetPath)); refuses(g, /ENOENT/);
  const external = '<svg xmlns="http://www.w3.org/2000/svg"><image href="external.svg"/></svg>';
  const embeddedExternal = '<svg xmlns="http://www.w3.org/2000/svg"><image href="data:image/svg+xml;base64,' + Buffer.from(external).toString("base64") + '"/></svg>';
  refuses(nativeHoldFixture(t, { svg: embeddedExternal }), /external SVG dependency/);
  for (const malformed of ['<svg><image href=external.svg /></svg>', '<svg><image xlink:href=external.svg /></svg>',
    '<svg><image src=external.svg /></svg>', '<svg><image href="external.svg /></svg>', '<svg><image href="#ok"bad="x" /></svg>'])
    refuses(nativeHoldFixture(t, { svg: malformed }), /unquoted or malformed SVG dependency/);
  const fragment = nativeHoldFixture(t, { svg: '<svg xmlns="http://www.w3.org/2000/svg"><defs><path id="a" d="M0 0L1 1"/></defs><use href="#a" clip-path="url(\'#a\')"/></svg>' });
  assert.equal(run(fragment).status, "PASS");
  refuses(nativeHoldFixture(t, { currentExtra: { sharedMaterial: '<img src="assets/hidden.png">' } }), /unlisted renderer field/);
});

test("native hold replay revalidates immutable proof, receipt contents and current protected values", t => {
  const f = nativeHoldFixture(t); run(f, { write: true });
  const receiptPath = `${EVID}/${f.request.requestId}.json`, receipt = readJson(f.dir, receiptPath);
  receipt.applied[0].heldRuntimeBindings = [];
  write(f.dir, receiptPath, JSON.stringify(receipt)); assert.throws(() => run(f, { verifyProjection: true }), /receipt\/protected value drift/);
  const g = nativeHoldFixture(t); run(g, { write: true }); fs.unlinkSync(path.join(g.dir, g.nativeRef.path));
  assert.throws(() => run(g, { verifyProjection: true }), /evidence missing\/drift/);
  const h = nativeHoldFixture(t); h.request.registryChanges = []; refuses(h, /registryChanges/);
  const i = nativeHoldFixture(t); i.request.items[0].after.difficultyConfidence = "high"; refuses(i, /exactly sourceFingerprint/);
});

function heldRendererFixture(t, { svg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L2 2"/></svg>' } = {}) {
  const oldSvg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>';
  const f = nativeHoldFixture(t, { problemSvg: oldSvg });
  const { dir, request } = f, item = request.items[0], sourcePath = `archive/exams/${request.sourceArchiveFile}`;
  const hash = value => sha256(stableBasicValue(value) ?? 'undefined');
  const oldQuestion = structuredClone(f.current[0]);
  const newPath = 'archive/assets/images/test/q1-problem-visual-v2.svg';
  Object.assign(f.current[0], { image: newPath.slice('archive/'.length), imageAlt: 'same original givens', imageSize: 'tall', layoutTag: 'fullwidth' });
  write(dir, sourcePath, sourceText(f.current)); write(dir, newPath, svg);
  git(dir, 'add', '-A'); git(dir, 'commit', '-qm', 'public problem display only');
  const afterCommit = git(dir, 'rev-parse', 'HEAD');
  const app = f.hold.applications[0], oldSource = app.currentSource;
  const sourceRef = (commit, question) => {
    const raw = execFileSync('git', ['show', `${commit}:${sourcePath}`], { cwd: dir });
    return { commit, path: sourcePath, gitBlobSha1: git(dir, 'rev-parse', `${commit}:${sourcePath}`), sha256: sha256(raw), questionSha256: hash(question) };
  };
  const asset = p => ({ path: p, gitBlobSha1: git(dir, 'hash-object', p), sha256: sha256(fs.readFileSync(path.join(dir, p))) });
  const beforeAsset = asset(f.problemPath), afterAsset = asset(newPath);
  const givenSource = execFileSync('git', ['show', `${request.previousSourceCommit}:${sourcePath}`], { cwd: dir });
  const given = { schemaVersion: 'archive-problem-only-given-input-v1', scope: 'PROBLEM_DISPLAY_CONTINUITY_ONLY',
    questionUid: item.questionUid, sourceOrdinal: 1,
    sourceRef: { commit: request.previousSourceCommit, path: sourcePath, gitBlobSha1: request.previousSourceBlobSha1, sha256: sha256(givenSource) },
    fields: Object.fromEntries(['content', 'question', 'choices'].filter(k => Object.hasOwn(oldQuestion, k)).map(k => [k, oldQuestion[k]])),
    exclusions: ['answer', 'solution', 'solution assets', 'native judgments', 'review outcomes'],
    instruction: 'Freeze expected observations from this problem text before opening the separate problem-image packet. This packet makes no review decision.' };
  const exposure = originalImageSeen => ({ originalImageSeen, currentImageSeen: false, answersOrSolutionsSeen: false, nativeJudgmentsSeen: false, upstreamReviewOutcomeSeen: false });
  const expectedGiven = { schemaVersion: 'archive-problem-only-expected-observations-v1', scope: 'Q22_PROBLEM_DISPLAY_CONTINUITY_ONLY',
    reviewer: 'display-reviewer', stage: 'GIVEN_TEXT_FROZEN_BEFORE_ANY_PROBLEM_IMAGE', questionUid: item.questionUid,
    sourceOrdinal: 1, exposure: exposure(false), newApprovals: 0 };
  const expectedOriginal = { schemaVersion: 'archive-problem-only-expected-observations-v2', scope: 'Q22_PROBLEM_DISPLAY_CONTINUITY_ONLY',
    reviewer: 'display-reviewer', stage: 'ORIGINAL_PROBLEM_IMAGE_OBSERVED_CURRENT_IMAGE_UNSEEN', questionUid: item.questionUid,
    sourceOrdinal: 1, exposure: exposure(true), newApprovals: 0,
    originalImageRef: { path: f.problemPath, sha256: beforeAsset.sha256, gitBlobSha1: beforeAsset.gitBlobSha1, gitCommit: request.previousSourceCommit } };
  const observed = ['bothOriginalSubpartsPresent', 'unknownAngleRemainsSymbolic', 'allGivenAngleLabelsAtExpectedVerticesAndRays',
    'incenterSegmentsAndPointPreserved', 'circlePointsAndRadiiPreserved', 'radiusLabel8BindsOC', 'shadedRegionMatchesOriginalMinorArcAndChordAC',
    'noAddedSolutionCueObserved', 'labelsLegibleAndNotClippedAtInspectedSize', 'imageAltMatchesObservedGivens'];
  const displayReview = { schemaVersion: 'archive-independent-problem-display-review-v1', scope: 'EXACT_Q22_TWO_PART_PROBLEM_STATIC_CONTINUITY',
    reviewer: 'display-reviewer', producer: 'display-author', decision: 'STATIC_PROBLEM_DISPLAY_CONTINUITY_ACCEPTED',
    beforeImageRef: { path: f.problemPath, sha256: beforeAsset.sha256 }, currentImageRef: afterAsset,
    observations: Object.fromEntries(observed.map(k => [k, true])),
    exposure: { expectationsFrozenBeforeCurrentImage: true, answerOrSolutionRead: false, nativeJudgmentRead: false, upstreamVisualDecisionRead: false },
    actualStudentUi: 'NOT_RUN', newMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newFourSlotApprovals: 0, sourceWrites: 0, assetWrites: 0 };
  const rendererEvidence = { schemaVersion: BASIC_HELD_RENDERER_EVIDENCE_SCHEMA, scope: 'EXISTING_BASIC_AND_EXPLICIT_TYPE_HOLD_ONLY',
    sourceArchiveFile: request.sourceArchiveFile, expectedQuestionCount: 2, questionUid: item.questionUid, sourceOrdinal: 1,
    nativeReviewRef: app.nativeReviewRef,
    independentHoldRef: { commit: request.approval.sourceReview.holdReviewCommit, path: request.approval.sourceReview.holdReviewPath, sha256: f.holdRef.sha256 },
    beforeSource: sourceRef(oldSource.commit, oldQuestion), afterSource: sourceRef(afterCommit, f.current[0]),
    changedDisplayFields: ['image', 'imageAlt', 'imageSize', 'layoutTag'], beforeAssets: [beforeAsset], afterAssets: [afterAsset],
    newMetadataApprovals: 0, newMathematicalQa: false, newDifficultyJudgments: 0, newReview2: false, newFourSlotApprovals: 0, sourceWrites: 0, assetWrites: 0 };
  const uiPath = 'docs/operations/m2-q22-basic-parent-continuity-20261116/', staticPublicPath = 'evidence/root-q22-static-display-review-r1.json';
  const viewports = [{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }];
  const payloadSha = hash({ content: f.current[0].content ?? f.current[0].question, choices: f.current[0].choices ?? [] });
  const presentationSha = hash({ imageAlt: f.current[0].imageAlt, imageSize: f.current[0].imageSize, layoutTag: f.current[0].layoutTag });
  write(dir, 'archive/engine.html', '<html><body>unchanged fixture renderer</body></html>');
  write(dir, 'tools/check-q22-basic-parent-problem-browser.cjs', '// immutable synthetic UI checker fixture\n');
  write(dir, 'tools/check-reviewed-problem-renderer-browser.cjs', '// immutable synthetic capture fixture\n');
  const uiManifest = { schemaVersion: 'archive-q22-basic-parent-problem-ui-manifest-v1', scope: 'EXACT_Q22_PROBLEM_DISPLAY_ONLY_NO_PARENT_APPROVAL',
    expectedCases: 2, viewports, items: [{ key: 'Q22', questionUid: item.questionUid, sourceOrdinal: 1,
      sourcePath, sourceGitBlobSha1: rendererEvidence.afterSource.gitBlobSha1, sourceSha256: rendererEvidence.afterSource.sha256,
      expectedBankCount: 2, problemPayloadSha256: payloadSha, presentationSha256: presentationSha,
      assetPath: newPath, assetGitBlobSha1: afterAsset.gitBlobSha1, assetSha256: afterAsset.sha256 }] };
  write(dir, 'tests/fixtures/archive-q22-basic-parent-problem-ui.json', JSON.stringify(uiManifest));
  git(dir, 'add', '-A'); git(dir, 'commit', '-qm', 'immutable synthetic UI input');
  const uiCheckout = git(dir, 'rev-parse', 'HEAD');
  const publicRef = (commit, p) => { const raw = execFileSync('git', ['show', `${commit}:${p}`], { cwd: dir });
    return { commit, path: p, gitBlobSha1: git(dir, 'rev-parse', `${commit}:${p}`), sha256: sha256(raw), bytes: raw.length }; };
  const uiSourceRef = publicRef(uiCheckout, sourcePath), uiAssetRef = publicRef(uiCheckout, newPath), domSha = hash('unchanged DOM');
  const results = viewports.map(viewport => {
    const screen = { tileIndex: 1, path: `Q22-${viewport.name}-tile-01.png`, sha256: hash(viewport.name), bytes: 100 };
    return { status: 'PASS', key: 'Q22', questionUid: item.questionUid, sourceOrdinal: 1, viewport,
      sourceRef: uiSourceRef, assetRef: uiAssetRef, screenshots: [screen], visualReview: 'PENDING', pageErrors: [], requestFailures: [], externalRequests: [],
      technical: { mode: 'exam', questions: 2, pages: 2, readiness: 'RENDER_READY', imagesComplete: true,
        mathErrors: 0, unrenderedMath: 0, mathJaxSource: 'local', solutionNodes: 0, fontReadiness: { status: 'loaded' } },
      geometry: { imageInsideQuestion: true }, capture: { schemaVersion: 'archive-problem-scroll-coverage-v1', method: 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES',
        tileLimit: 8, overlapCssPixels: 32, tileCount: 1, content: { height: 200 },
        coverage: { requiredInterval: [0, 200], coveredInterval: [0, 200], complete: true },
        tiles: [{ tileIndex: 1, relativeInterval: [0, 200], filename: screen.path, clip: { x: 0, y: 0, width: 300, height: 200 },
          feedbackIdle: true, obstructionsIntersectingClip: 0, hitTestSamples: 100, foreignContentHits: 0, domSha256: domSha }],
        domSha256: domSha, feedbackIdle: true, foreignContentHits: 0, cssWrites: 0, domWrites: 0, viewportChanges: 0, compositeImageCreated: false } };
  });
  const uiScreenshots = results.flatMap(r => r.screenshots.map(({ tileIndex, ...ref }) => ref));
  const uiTechnical = { schemaVersion: 'archive-q22-basic-parent-problem-ui-preview-v1', executionOwner: 'GITHUB_ACTIONS_SUPPORTED_CHROME', checkoutCommit: uiCheckout,
    manifestRef: publicRef(uiCheckout, 'tests/fixtures/archive-q22-basic-parent-problem-ui.json'),
    checkerRef: publicRef(uiCheckout, 'tools/check-q22-basic-parent-problem-browser.cjs'),
    captureHelperRef: publicRef(uiCheckout, 'tools/check-reviewed-problem-renderer-browser.cjs'),
    expectedBankCount: 2, identityRef: publicRef(uiCheckout, 'archive/data/question_identity_map.json'),
    items: [{ key: 'Q22', questionUid: item.questionUid, sourceOrdinal: 1, problemPayloadSha256: payloadSha, presentationSha256: presentationSha, sourceRef: uiSourceRef, assetRef: uiAssetRef }],
    checkout: { expectedCheckoutCommit: uiCheckout, actualCheckoutCommit: uiCheckout, githubEventCommit: uiCheckout },
    parentRestorationApproval: false, releaseGate: 'PENDING_INDEPENDENT_VISUAL_REVIEW', mode: 'exam', studentReview: true,
    screenshotsScope: 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY', problemOnlyScreenshots: true,
    sourceOverlay: false, sourceOverlayCount: 0, sourceWrites: 0, solutionsOpened: false, newFullMathematicalQa: false,
    newMetadataApprovals: 0, newDifficultyJudgments: 0, newReviewPassCount: 0, newFourSlotApprovals: 0,
    status: 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING', expectedLogicalCases: 2, completedLogicalCases: 2,
    screenshotArtifactCount: uiScreenshots.length, screenshotArtifacts: uiScreenshots,
    results, servedFiles: [publicRef(uiCheckout, 'archive/engine.html')], failures: [] };
  const uiIndependent = { schemaVersion: 'archive-q22-independent-problem-ui-audit-v1', reviewer: 'independent-ui-reviewer', role: 'INDEPENDENT_PROBLEM_ONLY_VISUAL_REVIEWER',
    checkoutCommit: uiCheckout, workflowRun: 1, artifactId: 1, artifactZipSha256: hash('original artifact zip'),
    reviewOrder: ['GIVEN_ONLY_EXPECTED_FROZEN', 'ORIGINAL_IMAGE_EXPECTED_FROZEN', 'CURRENT_STATIC_SVG_REVIEW', 'ACTUAL_DESKTOP_ORIGINAL_TILES', 'ACTUAL_MOBILE_ORIGINAL_TILE'],
    originalPngsPersonallyInspected: structuredClone(uiScreenshots),
    logicalCases: results.map(row => ({ viewport: row.viewport, questionUid: item.questionUid, sourceOrdinal: 1,
      screenshotRefs: row.screenshots.map(({ tileIndex, ...ref }) => ref), sourceRef: uiSourceRef, assetRef: uiAssetRef,
      givenTextLegible: true, bothDiagramsComplete: true, originalGeometryLabelsAndShadedRegionPreserved: true,
      clippingObserved: false, unrelatedContentObserved: false, solutionObserved: false, captureCoverageComplete: true, observations: ['Synthetic original PNG inspection.'], status: 'ACCEPTED' })),
    decision: 'ACCEPTED_PROBLEM_DISPLAY_CONTINUITY_ONLY', parentRestorationApproval: false, newMathematicalApprovals: 0,
    newMetadataApprovals: 0, newDifficultyJudgments: 0, newReview2Approvals: 0, holdDisposition: 'UNCHANGED',
    requiredNextAction: 'ORIGINAL_HOLD_REPLAY_AND_TYPED_CONSUMER_PARENT_PRESERVATION' };
  request.requestId = 'native-basic-held-renderer';
  request.expectedSourceBlobSha1 = rendererEvidence.afterSource.gitBlobSha1;
  item.after = { sourceFingerprint: sourceFingerprint(f.current[0]), contentFingerprint: contentFingerprint(f.current[0]) };
  f.wrapper.requestId = request.requestId; f.wrapper.expectedSourceBlobSha1 = request.expectedSourceBlobSha1;
  f.wrapper.questions[0].currentQuestionSha256 = hash(f.current[0]);
  const seal = (mutateUiRefs = () => {}) => {
    const givenRef = { schemaVersion: 'archive-public-source-derived-given-ref-v1',
      path: 'evidence/m2-q22-problem-only-continuity-r1/given-only.json', sha256: sha256(JSON.stringify(given, null, 2) + '\n') };
    expectedGiven.givenRef = { path: givenRef.path, sha256: givenRef.sha256 }; expectedOriginal.givenRef = structuredClone(expectedGiven.givenRef);
    const givenExpectedRef = f.save('renderer-expected-given', expectedGiven);
    expectedOriginal.priorExpectedRef = givenExpectedRef;
    const originalExpectedRef = f.save('renderer-expected-original', expectedOriginal);
    displayReview.expectedRef = originalExpectedRef;
    const independentReviewRef = f.save('renderer-static-review', displayReview);
    Object.assign(rendererEvidence, { givenRef, givenExpectedRef, originalExpectedRef, independentReviewRef });
    write(dir, staticPublicPath, fs.readFileSync(path.join(dir, independentReviewRef.path)));
    const techPath = uiPath + 'student-ui-technical-v1.json', independentPath = uiPath + 'student-ui-independent-v1.json';
    const technicalRaw = JSON.stringify(uiTechnical, null, 2) + '\n'; write(dir, techPath, technicalRaw);
    uiIndependent.technicalRef = { path: techPath, sha256: sha256(technicalRaw) };
    uiIndependent.staticReviewRef = { path: staticPublicPath, sha256: independentReviewRef.sha256 };
    write(dir, independentPath, JSON.stringify(uiIndependent, null, 2) + '\n');
    git(dir, 'add', '-A'); git(dir, 'commit', '--allow-empty', '-qm', 'immutable synthetic UI evidence');
    const uiCommit = git(dir, 'rev-parse', 'HEAD');
    rendererEvidence.studentUi = { technicalRef: publicRef(uiCommit, techPath), independentRef: publicRef(uiCommit, independentPath) };
    mutateUiRefs(rendererEvidence.studentUi);
    const evidenceRef = f.save('renderer-evidence', rendererEvidence), reviewRef = f.save('native-hold-wrapper', f.wrapper);
    request.approval.evidenceRefs = [reviewRef, f.nativeRef, f.holdRef, evidenceRef, givenExpectedRef, originalExpectedRef, independentReviewRef];
    item.evidenceRefs = structuredClone(request.approval.evidenceRefs);
    git(dir, 'add', '-A'); git(dir, 'commit', '--allow-empty', '-qm', 'immutable static display evidence');
    request.approval.sourceReview.rendererContinuity = { schemaVersion: BASIC_HELD_RENDERER_SCHEMA,
      reviewCommit: git(dir, 'rev-parse', 'HEAD'), reviewPath: evidenceRef.path, reviewRef: evidenceRef };
  };
  seal();
  return { ...f, rendererEvidence, given, expectedGiven, expectedOriginal, displayReview, newPath, uiTechnical, uiIndependent, seal };
}

test('held renderer opt-in requires independent actual UI and preserves original native/HOLD authority through official write and replay', t => {
  const f = heldRendererFixture(t), before = snapshot(f.dir), runtime = fs.readFileSync(path.join(f.dir, f.runtimePath));
  const dry = run(f); assert.equal(dry.preservedMetadataApprovals, 1); assert.equal(snapshot(f.dir), before);
  assert.equal(run(f, { write: true }).newMetadataApprovals, 0);
  const receipt = readJson(f.dir, `${EVID}/${f.request.requestId}.json`), proof = receipt.applied[0].rendererContinuity;
  assert.equal(proof.originalNativeAndHoldJudgmentsUnchanged, true);
  assert.equal(proof.actualStudentUi, 'PASS'); assert.equal(proof.releaseGate, 'DISPLAY_WITNESS_VALIDATED_ORIGINAL_HOLD_REPLAY_REQUIRED');
  assert.equal(proof.studentUi.logicalCases, 2); assert.equal(proof.studentUi.newMetadataApprovals, 0);
  assert.equal(fs.existsSync(path.join(f.dir, f.rendererEvidence.givenRef.path)), false);
  assert.equal(f.request.approval.evidenceRefs.some(r => r.path === f.rendererEvidence.givenRef.path), false);
  assert.deepEqual(proof.changedDisplayFields, ['image', 'imageAlt', 'imageSize', 'layoutTag']);
  assert.equal(receipt.applied[0].independentHoldRef.sha256, f.holdRef.sha256);
  assert.equal(run(f, { write: true }).replay, true); assert.equal(run(f, { verifyProjection: true }).status, 'PASS');
  assert.deepEqual(fs.readFileSync(path.join(f.dir, f.runtimePath)), runtime);
  const md = readJson(f.dir, 'archive/data/question_metadata.json').records[0];
  assert.deepEqual({ ...md, ...f.request.items[0].before }, f.metadata.records[0]);
});

for (const [name, mutate, error] of [
  ['missing explicit option', f => { delete f.request.approval.sourceReview.rendererContinuity; }, /historical approved body|current student payload/],
  ['null explicit option', f => { f.request.approval.sourceReview.rendererContinuity = null; }, /held-basic renderer scope/],
  ['unknown option key', f => { f.request.approval.sourceReview.rendererContinuity.extra = true; }, /held-basic renderer scope/],
  ['wrong immutable commit', f => { f.request.approval.sourceReview.rendererContinuity.reviewCommit = 'f'.repeat(40); }, /immutable input/],
  ['wrong evidence hash', f => { f.request.approval.sourceReview.rendererContinuity.reviewRef.sha256 = '0'.repeat(64); }, /approval evidence missing\/drift/],
  ['wrong source path', f => { f.rendererEvidence.afterSource.path = 'archive/exams/wrong.js'; f.seal(); }, /same-source snapshot/],
  ['wrong denominator', f => { f.rendererEvidence.expectedQuestionCount = 3; f.seal(); }, /authority\/scope/],
  ['wrong UID', f => { f.rendererEvidence.questionUid = 'foreign'; f.seal(); }, /authority\/scope/],
  ['wider changed fields', f => { f.rendererEvidence.changedDisplayFields.push('solution'); f.seal(); }, /four problem display fields/],
  ['missing asset', f => { f.rendererEvidence.afterAssets = []; f.seal(); }, /complete asset inventory/],
  ['invented given packet text', f => { f.given.fields.content = 'invented source text'; f.seal(); }, /given packet derivation/],
  ['wrong given source snapshot', f => { f.given.sourceRef.commit = 'f'.repeat(40); f.seal(); }, /given packet derivation/],
  ['raw given input hidden in the packet', f => { f.given.studentText = 'invented source text'; f.seal(); }, /given packet derivation/],
  ['given expected saw current image', f => { f.expectedGiven.exposure.currentImageSeen = true; f.seal(); }, /exposure binding/],
  ['original expected saw native judgment', f => { f.expectedOriginal.exposure.nativeJudgmentsSeen = true; f.seal(); }, /exposure binding/],
  ['wrong expected UID', f => { f.expectedOriginal.questionUid = 'foreign'; f.seal(); }, /expected UID/],
  ['uninspected condition', f => { f.displayReview.observations.circlePointsAndRadiiPreserved = false; f.seal(); }, /static display witness/],
  ['same author and display reviewer', f => { f.displayReview.producer = f.displayReview.reviewer; f.seal(); }, /static display witness/],
  ['claimed new metadata approval', f => { f.displayReview.newMetadataApprovals = 1; f.seal(); }, /static display witness/],
  ['invented actual UI PASS in static review', f => { f.displayReview.actualStudentUi = 'PASS'; f.seal(); }, /static display witness/],
  ['missing technical UI status', f => { f.uiTechnical.status = 'NOT_RUN'; f.seal(); }, /UI technical scope/],
  ['missing one actual viewport', f => { f.uiTechnical.results.pop(); f.seal(); }, /two viewports/],
  ['wrong UI source identity', f => { f.uiTechnical.items[0].questionUid = 'foreign'; f.seal(); }, /UI exact current problem/],
  ['wrong immutable UI byte count', f => { f.seal(refs => { refs.technicalRef.bytes++; }); }, /UI immutable\/current/],
  ['unknown UI reference field', f => { f.seal(refs => { refs.extra = true; }); }, /technical and independent/],
  ['UI changed CSS capture', f => { f.uiTechnical.results[0].capture.cssWrites = 1; f.seal(); }, /UI original scroll/],
  ['UI uncovered final interval', f => { f.uiTechnical.results[0].capture.tiles[0].relativeInterval[1] = 199; f.seal(); }, /UI original PNG\/coverage/],
  ['UI missing original screenshot', f => { f.uiTechnical.screenshotArtifacts.pop(); f.seal(); }, /UI screenshot artifact/],
  ['UI independent original screenshot substitution', f => { f.uiIndependent.originalPngsPersonallyInspected[0].sha256 = '0'.repeat(64); f.seal(); }, /UI independent review/],
  ['UI independent reviewer is technical producer', f => { f.uiIndependent.reviewer = f.uiTechnical.executionOwner; f.seal(); }, /UI independent review/],
  ['UI independent reviewer is problem display producer', f => { f.uiIndependent.reviewer = f.displayReview.producer; f.seal(); }, /UI independent reviewer is problem display producer/],
  ['UI independent approval escalation', f => { f.uiIndependent.newMetadataApprovals = 1; f.seal(); }, /UI independent review/],
  ['UI independent condition disagreement', f => { f.uiIndependent.logicalCases[0].originalGeometryLabelsAndShadedRegionPreserved = false; f.seal(); }, /UI independent case/],
]) test(`held renderer refuses ${name} before any write`, t => {
  const f = heldRendererFixture(t); mutate(f); refuses(f, error);
});

test('held renderer current and cached replay recheck live source, asset, witness, protected metadata and held runtime', t => {
  for (const mutate of [
    f => fs.appendFileSync(path.join(f.dir, f.newPath), '<!-- drift -->'),
    f => fs.appendFileSync(path.join(f.dir, `archive/exams/${f.request.sourceArchiveFile}`), '\n'),
    f => fs.unlinkSync(path.join(f.dir, f.rendererEvidence.independentReviewRef.path)),
    f => fs.appendFileSync(path.join(f.dir, f.rendererEvidence.studentUi.technicalRef.path), '\n'),
    f => { const d = readJson(f.dir, 'archive/data/question_metadata.json'); d.records[0].difficultyConfidence = 'low'; write(f.dir, 'archive/data/question_metadata.json', JSON.stringify(d)); },
    f => { const d = readJson(f.dir, f.runtimePath); d.records[0].difficultyConfidence = 'high'; write(f.dir, f.runtimePath, JSON.stringify(d)); },
    f => { const p = `${EVID}/${f.request.requestId}.json`, d = readJson(f.dir, p); delete d.applied[0].rendererContinuity; write(f.dir, p, JSON.stringify(d)); },
  ]) {
    const f = heldRendererFixture(t); run(f, { write: true }); assert.equal(run(f, { verifyProjection: true }).status, 'PASS');
    mutate(f); assert.throws(() => run(f, { verifyProjection: true }), /asset bytes|source Git blob|evidence missing|UI immutable\/current|protected prior metadata|protected explicit held runtime|receipt\/protected value/);
  }
});

test('held renderer refuses new external or malformed SVG dependencies', t => {
  for (const svg of ['<svg xml:base="https://external.invalid/"><use href="#shape"/></svg>',
    '<svg><path style="fill:u\\72l(https://external.invalid/#x)"/></svg>', '<svg><image href=external.svg /></svg>',
    '<svg><use href="#shape"bad="x"/></svg>']) refuses(heldRendererFixture(t, { svg }), /unsupported SVG dependency/);
});

function newBasicParentFixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reviewed-new-basic-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q'); git(dir, 'config', 'user.email', 't@example.invalid'); git(dir, 'config', 'user.name', 't');
  const source = 'original/middle/m2/1final/99_테스트중_1학기_기말_중2_기출.js', selectedUid = 'qid_v1_' + sha256(source + '#1');
  const d5 = ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
  const hash = x => sha256(stableBasicValue(x) ?? 'undefined');
  const save = (p, v) => { const raw = JSON.stringify(v, null, 2) + '\n'; write(dir, p, raw); return { path: p, sha256: sha256(raw) }; };
  const checkpoint = name => { git(dir, 'add', '-A'); git(dir, 'commit', '-qm', name); return git(dir, 'rev-parse', 'HEAD'); };
  const parent = { grade: '중2', curriculumKey: '2022', courseKey: 'M2-1', L1: '일차함수', L2: '일차함수와 일차방정식의 관계' };
  const base = { id: 1, level: '상', curriculum: '2022', standardCourse: '중2 수학', standardUnitKey: 'M2-04', standardUnit: '일차함수와 그래프',
    subUnitKey: 'M2-04-LINEAR_FUNCTION_EQUATION', subUnit: parent.L2, content: '조건을 만족하는 값을 구하면?', choices: ['가', '나'], answer: '①, ②', solution: '이전 설명',
    difficultyBucket: 4, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL' };
  const untouched = { ...base, id: 2, content: '다른 문제', answer: '①' };
  const oldBank = [base, untouched]; write(dir, 'archive/exams/' + source, sourceText(oldBank));
  const before = { sourceFingerprint: sourceFingerprint(base), contentFingerprint: contentFingerprint(base) };
  const meta = oldBank.map((q, i) => ({ questionUid: i ? 'qid_v1_' + sha256(source + '#2') : selectedUid, sourceArchiveFile: source, sourceOrdinal: i + 1,
    sourceFingerprint: sourceFingerprint(q), contentFingerprint: contentFingerprint(q), standardCourse: q.standardCourse, standardUnitKey: q.standardUnitKey, standardUnit: q.standardUnit,
    subUnitKey: q.subUnitKey, subUnit: q.subUnit, problemTypeKey: '', templateKey: '', metadataStatus: 'approved_partial_with_explicit_holds',
    fieldStatus: { standardUnit: 'approved_source', subUnit: 'approved_source', problemType: 'manual_review_pending', template: 'manual_review_pending' },
    approvalEvidence: ['archive/_generated/old-basic.json'], ...Object.fromEntries(d5.map(k => [k, q[k]])) }));
  const ids = meta.map(r => ({ questionUid: r.questionUid, sourceArchiveFile: source, sourceOrdinal: r.sourceOrdinal, sourceFingerprint: r.sourceFingerprint }));
  save('archive/data/question_metadata.json', { records: meta }); save('archive/data/question_identity_map.json', { records: ids });
  save('archive/data/basic-scope-source-links.json', { status: 'REVIEWED_SCOPE_LINKS', records: [] });
  save('archive/data/basic-scope-parent-links.json', { records: [{ ...parent, standardUnitKey: base.standardUnitKey, subUnitKey: base.subUnitKey }] });
  const masterPath = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  const master = { records: [{ curriculum: '2022', scope: 'M2-1', majorUnit: parent.L1, midUnit: parent.L2, majorStatus: 'RPM_VERIFIED', midStatus: 'RPM_VERIFIED' }] };
  const masterRef = save(masterPath, master);
  save('archive/data/archive2-canonical-projection-policy.json', { canonicalMasterSha256: masterRef.sha256, gradeCourseAllowlist: [{ grade: '중2', curriculumKey: '2022', courseKey: 'M2-1' }] });
  save('archive/data/meta-foundation/runtime/middle-geometry-v1.json', { records: [] });
  const priorCommit = checkpoint('historical metadata and input');
  const currentBefore = { ...base, solution: '실제 원 검토의 설명', difficultyBucket: 3, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'B34', legacyLevelCompatibility: 'BORDERLINE_ACCEPTABLE' };
  write(dir, 'archive/exams/' + source, sourceText([currentBefore, untouched]));
  const nativeBase = checkpoint('native inspected source'), nativeBlob = git(dir, 'hash-object', 'archive/exams/' + source);
  const nativePath = 'docs/operations/native/accepted-review.json';
  const decision = { questionUid: selectedUid, sourceOrdinal: 1, semanticDecision: { curriculumProvenance: 'SOURCE_EXPLICIT_PRESERVED', machineCurriculum: '2022', semanticCurriculum: '2022', problemTypeKey: null, templateKey: null },
    proposalRefs: [], registrationDebt: ['ACTIVE_SCOPED_PT_TPL_BINDING_NOT_ESTABLISHED'], contentDebt: [{ type: 'MULTIPLE_VALID_CHOICES_IN_SINGLE_CHOICE_STEM' }],
    finalDifficulty: { level: '상', ...Object.fromEntries(d5.map(k => [k, currentBefore[k]])) } };
  const native = { schemaVersion: 'm2-s1-meta-review-v1', sourceArchiveFile: source, reviewedQuestionCount: 2, owner: 'native-author', baseSha: nativeBase, sourceGitBlobSha: nativeBlob,
    items: [decision, { questionUid: ids[1].questionUid, sourceOrdinal: 2 }] };
  save(nativePath, native); const nativeCommit = checkpoint('immutable native review');
  const current = { ...currentBefore, content: '조건을 만족하는 값을 보기에서 모두 고르면?' };
  const candidateRaw = sourceText([current, untouched]), afterBlob = crypto.createHash('sha1').update(`blob ${Buffer.byteLength(candidateRaw)}\0`).update(candidateRaw).digest('hex');
  const beforeRaw = fs.readFileSync(path.join(dir, 'archive/exams/' + source));
  const publicNative = { commit: nativeCommit, path: nativePath, gitBlobSha1: git(dir, 'rev-parse', nativeCommit + ':' + nativePath), sha256: sha256(fs.readFileSync(path.join(dir, nativePath))) };
  const application = { questionUid: selectedUid, sourceOrdinal: 1, sourceArchiveFile: source, expectedQuestionCount: 2,
    sourceBefore: { commit: nativeCommit, path: 'archive/exams/' + source, gitBlobSha1: nativeBlob, sha256: sha256(beforeRaw), bytes: beforeRaw.length },
    sourceAfter: { gitBlobSha1: afterBlob, sha256: sha256(candidateRaw), bytes: Buffer.byteLength(candidateRaw) },
    beforeQuestionStableSha256: hash(currentBefore), afterQuestionStableSha256: hash(current), nativeReviewRef: publicNative,
    nativeItemStableSha256: hash(decision), nativeDifficultyStableSha256: hash(decision.finalDifficulty), allowedChangedFields: ['content'],
    sourceRepairDisposition: 'APPROVED_NARROW_CURRENT_REVIEW', currentStudentMathAndRendererConsistency: 'PASS', studentAnswerPreserved: true, studentSolutionPreserved: true, assetsPreserved: true,
    advancedApproval: 'HOLD_PRESERVED', newAdvancedApproval: false, newBlindReview: false, newReview2: false, difficultyDisposition: 'TRANSPORT_EXACT_ACCEPTED_NATIVE_ONLY',
    literalTextReplacement: { before: '값을 구하면?', after: '값을 보기에서 모두 고르면?', exactOccurrenceCount: 1 }, basicParentDisposition: 'APPROVED_NEW_BASIC_ONLY', basicParent: parent };
  const independentPath = 'docs/operations/independent-new-basic.json';
  const independent = { schemaVersion: 'archive-m2s1-next-four-current-root-review-v1', reviewer: 'root-independent', baseCommit: nativeCommit,
    canonicalMasterRef: { commit: nativeCommit, path: masterPath, gitBlobSha1: git(dir, 'rev-parse', nativeCommit + ':' + masterPath), sha256: masterRef.sha256 },
    reviewScope: 'CURRENT_STUDENT_MATH_RENDERER_AND_EXACT_BASIC_PARENT_ONLY_WITH_NATIVE_CONTEXT', newBasicParentApprovedCount: 1,
    newAdvancedApprovals: 0, newDifficultyJudgments: 0, newBlindReviews: 0, newReview2: 0, nonSelectedQuestionChanges: 0, rows: [application] };
  save(independentPath, independent); const independentCommit = checkpoint('independent exact source and new BASIC review');
  write(dir, 'archive/exams/' + source, candidateRaw);
  const nativeRef = save(EVID + '/new-basic.native.json', native), independentRef = save(EVID + '/new-basic.independent.json', independent);
  const request = { schemaVersion: 'archive-basic-scope-rebind-request-v1', requestId: 'reviewed-new-basic', examUid: path.basename(source, '.js'), sourceArchiveFile: source,
    expectedSourceBlobSha1: afterBlob, previousSourceCommit: nativeCommit, previousSourceBlobSha1: nativeBlob, expectedQuestionCount: 2,
    approval: { type: 'BASIC_SCOPE_REBIND', metadataReviewed: true, approvedBy: 'root-independent', sourceReview: { schemaVersion: NATIVE_BASIC_PARENT_SCHEMA,
      priorCommit, priorFingerprintSourceCommit: priorCommit, nativeReviewCommit: nativeCommit, nativeReviewPath: nativePath, nativeReviewRef: nativeRef,
      independentReviewCommit: independentCommit, independentReviewPath: independentPath, independentReviewRef: independentRef }, evidenceRefs: [] },
    items: [{ questionUid: selectedUid, sourceOrdinal: 1, before, after: { sourceFingerprint: sourceFingerprint(current), contentFingerprint: contentFingerprint(current) },
      basicParent: parent, reason: 'separately reviewed wording and explicit current curriculum BASIC parent', evidenceRefs: [] }] };
  const review = { schemaVersion: NATIVE_BASIC_PARENT_REVIEW_SCHEMA, requestId: request.requestId, examUid: request.examUid, sourceArchiveFile: source,
    status: 'PASS', decision: 'REGISTER_NEW_BASIC_PARENT_ONLY', preparedBy: 'preparer', reviewedBy: 'root-independent', priorCommit, expectedQuestionCount: 2,
    expectedSourceBlobSha1: afterBlob, newBasicParentApprovals: 1, preservedMetadataApprovals: 0, advancedApprovals: 0, newDifficultyJudgments: 0,
    questions: [{ questionUid: selectedUid, sourceOrdinal: 1, nativeItemSha256: hash(decision), currentQuestionSha256: hash(current), priorMetadataSha256: hash(meta[0]), priorIdentitySha256: hash(ids[0]), basicParent: parent }] };
  const wrapperRef = save(EVID + '/new-basic.review.json', review);
  request.approval.evidenceRefs = [nativeRef, independentRef, wrapperRef]; request.items[0].evidenceRefs = [...request.approval.evidenceRefs];
  return { dir, request, save, current, currentBefore, untouched, meta, ids, d5, selectedUid, source, native, independent, review, nativeRef, independentRef, wrapperRef, independentPath, nativePath, checkpoint };
}

test('new reviewed BASIC parent registers one explicit-curriculum parent without upgrading advanced holds; exact native D5 replay remains separate', t => {
  const f = newBasicParentFixture(t); const dry = run(f); assert.equal(dry.newBasicParentApprovals, 1); assert.equal(dry.preservedMetadataApprovals, 0); assert.equal(dry.newMetadataApprovals, 1); assert.equal(dry.advancedApprovals, 0);
  const registered = run(f, { write: true }); assert.equal(registered.newBasicParentApprovals, 1);
  const md = readJson(f.dir, 'archive/data/question_metadata.json'); assert.deepEqual(md.records[1], f.meta[1]);
  assert.deepEqual({ ...md.records[0], ...f.request.items[0].before }, f.meta[0]);
  assert.equal(readJson(f.dir, 'archive/data/basic-scope-source-links.json').records.length, 1);
  assert.equal(run(f, { verifyProjection: true }).newBasicParentApprovals, 1);
  for (const k of f.d5) md.records[0][k] = f.current[k]; f.save('archive/data/question_metadata.json', md);
  const replay = run(f, { write: true }); assert.equal(replay.replay, true); assert.deepEqual(replay.plannedPaths, []);
  const receipt = readJson(f.dir, EVID + '/reviewed-new-basic.json'); assert.equal(receipt.metadataRegistrationStatus, 'BASIC_PARENT_REGISTERED'); assert.equal(receipt.newReview2, 0);
});

test('new BASIC refuses missing explicit curriculum, native curriculum proposal, HOLD disposition, or invented parent', t => {
  for (const mutate of [
    f => { delete f.current.curriculum; write(f.dir, 'archive/exams/' + f.source, sourceText([f.current, f.untouched])); f.request.expectedSourceBlobSha1 = git(f.dir, 'hash-object', 'archive/exams/' + f.source); f.request.items[0].after = { sourceFingerprint: sourceFingerprint(f.current), contentFingerprint: contentFingerprint(f.current) }; },
    f => { f.native.items[0].semanticDecision.curriculumProvenance = 'PROPOSAL_ONLY'; const ref = f.save(f.nativeRef.path, f.native); f.request.approval.sourceReview.nativeReviewRef = ref; f.request.approval.evidenceRefs[0] = ref; f.request.items[0].evidenceRefs[0] = ref; },
    f => { f.independent.rows[0].basicParentDisposition = 'HOLD_CURRICULUM_EVIDENCE_NOT_ESTABLISHED'; const ref = f.save(f.independentRef.path, f.independent); f.request.approval.sourceReview.independentReviewRef = ref; f.request.approval.evidenceRefs[1] = ref; f.request.items[0].evidenceRefs[1] = ref; },
    f => { f.request.items[0].basicParent = { ...f.request.items[0].basicParent, curriculumKey: '2015' }; },
  ]) { const f = newBasicParentFixture(t); mutate(f); refuses(f, /REVIEWED_NATIVE_BASIC_PARENT/); }
});

test('new BASIC binds an optional current-source path and rejects immutable wrong-path or HOLD reviews', t => {
  const revise = (f, mutate) => {
    mutate(f.independent.rows[0]);
    f.save(f.independentPath, f.independent);
    f.request.approval.sourceReview.independentReviewCommit = f.checkpoint('independent review revision');
    const ref = f.save(f.independentRef.path, f.independent);
    f.request.approval.sourceReview.independentReviewRef = ref;
    f.request.approval.evidenceRefs[1] = ref; f.request.items[0].evidenceRefs[1] = ref;
  };
  const valid = newBasicParentFixture(t);
  revise(valid, a => { a.sourceAfter.path = 'archive/exams/' + valid.source; });
  assert.equal(run(valid).newBasicParentApprovals, 1);
  for (const mutate of [
    a => { a.sourceAfter.path = 'archive/exams/original/middle/m2/1final/other.js'; },
    a => { a.sourceAfter.unreviewedSource = true; },
    a => { a.basicParentDisposition = 'HOLD_CURRICULUM_EVIDENCE_NOT_ESTABLISHED'; },
  ]) {
    const f = newBasicParentFixture(t); revise(f, mutate);
    refuses(f, /independent (?:source hash|exact current review) mismatch/);
  }
});

test('new BASIC refuses altered answer, solution, non-selected question or hidden renderer dependency before writes', t => {
  for (const change of [f => { f.current.answer = '②'; }, f => { f.current.solution = '다른 설명'; }, f => { f.untouched.content += '변경'; },
    f => { f.current.sharedMaterial = '<img src="assets/hidden.svg">'; }]) {
    const f = newBasicParentFixture(t); change(f); write(f.dir, 'archive/exams/' + f.source, sourceText([f.current, f.untouched]));
    f.request.expectedSourceBlobSha1 = git(f.dir, 'hash-object', 'archive/exams/' + f.source); f.request.items[0].after = { sourceFingerprint: sourceFingerprint(f.current), contentFingerprint: contentFingerprint(f.current) };
    refuses(f, /REVIEWED_NATIVE_BASIC_PARENT/);
  }
});

test('new BASIC retains whole protected metadata/identity and rejects runtime assignment, existing link and arbitrary difficulty', t => {
  for (const mutate of [
    f => { const d = readJson(f.dir, 'archive/data/question_metadata.json'); d.records[0].fieldStatus.problemType = 'approved'; f.save('archive/data/question_metadata.json', d); },
    f => { const d = readJson(f.dir, 'archive/data/question_identity_map.json'); d.records[0].unexpected = true; f.save('archive/data/question_identity_map.json', d); },
    f => { f.save('archive/data/meta-foundation/runtime/middle-geometry-v1.json', { records: [{ questionUid: f.selectedUid, metadataStatus: 'APPROVED' }] }); },
    f => { f.save('archive/data/basic-scope-source-links.json', { status: 'REVIEWED_SCOPE_LINKS', records: [{ ...f.request.items[0].basicParent, sourceFile: f.source, sourceOrdinal: 1 }] }); },
    f => { const d = readJson(f.dir, 'archive/data/question_metadata.json'); d.records[0].difficultyConfidence = 'low'; f.save('archive/data/question_metadata.json', d); },
  ]) { const f = newBasicParentFixture(t); mutate(f); refuses(f, /REVIEWED_NATIVE_BASIC_PARENT|already has a scoped source link/); }
});

test('new BASIC replay revalidates immutable review, current authority and exact receipt counts', t => {
  for (const mutate of [
    f => { fs.unlinkSync(path.join(f.dir, f.independentRef.path)); },
    f => { const p = 'archive/data/archive2-canonical-projection-policy.json', d = readJson(f.dir, p); d.gradeCourseAllowlist = []; f.save(p, d); },
    f => { const p = EVID + '/reviewed-new-basic.json', d = readJson(f.dir, p); d.newBasicParentApprovals = 0; f.save(p, d); },
    f => { const p = EVID + '/reviewed-new-basic.json', d = readJson(f.dir, p); d.applied[0].independentReviewRef.sha256 = '0'.repeat(64); f.save(p, d); },
  ]) {
    const f = newBasicParentFixture(t); run(f, { write: true }); mutate(f); const before = snapshot(f.dir);
    assert.throws(() => run(f, { verifyProjection: true }), /evidence missing|REVIEWED_NATIVE_BASIC_PARENT|receipt\/protected value drift/); assert.equal(snapshot(f.dir), before);
  }
});
