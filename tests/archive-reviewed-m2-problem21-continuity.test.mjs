import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { validateM2ProblemRenderer21Continuity, verifyFrozenSvgIndexFootprint, M2_PROBLEM21_CONTINUITY_SCHEMA,
  M2_PROBLEM21_BINDING_SCHEMA, M2_PROBLEM21_SCOPE, M2_PROBLEM21_ITEMS } from "../archive/tools/meta-foundation/reviewed-m2-problem21-continuity.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EVIDENCE_DIRECTORY = "docs/operations/m2-problem21-continuity-20261116/";
const EVIDENCE_COMMIT = "7c6d2b60143bee6faac360e8fab343551c85c3cf";
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
const clone = value => structuredClone(value);
const git = (root, args, input) => execFileSync("git", args, { cwd: root, input, maxBuffer: 8 * 1024 * 1024,
  stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0",
    GIT_AUTHOR_NAME: "Archive test", GIT_AUTHOR_EMAIL: "archive-test@example.invalid",
    GIT_COMMITTER_NAME: "Archive test", GIT_COMMITTER_EMAIL: "archive-test@example.invalid" } });
function bankFromBytes(bytes) {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(bytes.toString("utf8"), ctx, { timeout: 3000, contextCodeGeneration: { strings: false, wasm: false } });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank)) throw new Error("test fixture bank unavailable");
  return JSON.parse(JSON.stringify(bank));
}
const allProblemFields = ["id", "number", "sourceQuestionNo", "sourceQid", "sourceOrdinal", "questionUid", "questionType",
  "content", "question", "choices", "image", "images", "figureSvg", "layoutTag", "wide", "imageAlt", "imageCaption", "imageSize", "score"];
const problem = question => Object.fromEntries(allProblemFields.filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]]));
const without = (question, fields) => Object.fromEntries(Object.entries(question).filter(([key]) => !fields.includes(key)));
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-m2-problem21-")); git(root, ["init", "-q"]);
  const common = path.resolve(repo, git(repo, ["rev-parse", "--git-common-dir"]).toString().trim());
  fs.writeFileSync(path.join(root, ".git/objects/info/alternates"), `${path.join(common, "objects")}\n`);
  const docs = {}, paths = {}, refs = {}, written = new Map(), cache = new Map();
  const write = (relative, bytes) => {
    const full = path.join(root, relative); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, bytes);
    written.set(relative, Buffer.from(bytes)); return full;
  };
  for (const [key, name] of Object.entries({ staticRef: "static-v1.json", studentUiObservedRef: "student-ui-observed-v1.json",
    studentUiTechnicalRef: "student-ui-technical-v1.json", q10IndependentRef: "q10-independent-ui-v1.json" })) {
    const relative = EVIDENCE_DIRECTORY + name, bytes = git(repo, ["show", `${EVIDENCE_COMMIT}:${relative}`]);
    paths[key] = relative; docs[key] = JSON.parse(bytes); write(relative, bytes);
    refs[key] = { path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes), bytes: bytes.length };
  }
  const staticDoc = docs.staticRef, technical = docs.studentUiTechnicalRef;
  function materialize(ref) {
    if (written.has(ref.path)) { assert.equal(sha(written.get(ref.path)), ref.sha256); return; }
    const bytes = git(root, ["show", `${ref.commit}:${ref.path}`]); assert.equal(blob(bytes), ref.gitBlobSha1); assert.equal(sha(bytes), ref.sha256);
    write(ref.path, bytes);
  }
  for (const row of staticDoc.rows) { materialize(row.currentSourceRef); row.nativeProblemAssets.forEach(materialize); row.currentProblemAssets.forEach(materialize); }
  for (const ref of technical.servedFiles) if (ref.path !== "archive/data/question_metadata.json" && !ref.path.startsWith("archive/exams/")) materialize(ref);
  for (const ref of technical.studentFontResources) materialize(ref);
  let wrapper;
  const wrapperPath = `${EVIDENCE_DIRECTORY}binding-e017-v1.json`;
  const wrappers = new Map(), wrapperRefs = new Map();
  function commitFiles(files) {
    git(root, ["read-tree", "--empty"]);
    for (const relative of files) { const oid = git(root, ["hash-object", "-w", "--stdin"], fs.readFileSync(path.join(root, relative))).toString().trim();
      git(root, ["update-index", "--add", "--cacheinfo", `100644,${oid},${relative}`]); }
    const tree = git(root, ["write-tree"]).toString().trim(); return git(root, ["commit-tree", tree], "test metadata only\n").toString().trim();
  }
  function modeCommit(relative, mode, suppliedOid) {
    git(root, ["read-tree", "--empty"]);
    const oid = suppliedOid || git(root, ["hash-object", "-w", "--stdin"], fs.readFileSync(path.join(root, relative))).toString().trim();
    git(root, ["update-index", "--add", "--cacheinfo", `${mode},${oid},${relative}`]);
    const tree = git(root, ["write-tree"]).toString().trim(); return git(root, ["commit-tree", tree], "test mode boundary\n").toString().trim();
  }
  const capsuleCommit = EVIDENCE_COMMIT;
  for (const ref of Object.values(refs)) ref.commit = capsuleCommit;
  for (const sourceArchiveFile of [...new Set(M2_PROBLEM21_ITEMS.map(item => item.sourceArchiveFile))]) {
    const selectedQuestionUids = M2_PROBLEM21_ITEMS.filter(item => item.sourceArchiveFile === sourceArchiveFile && item.callerAction === "NORMALIZE_EXACT_PROBLEM_FIELDS").map(item => item.questionUid);
    wrappers.set(sourceArchiveFile, { schemaVersion: M2_PROBLEM21_BINDING_SCHEMA, scope: M2_PROBLEM21_SCOPE, sourceArchiveFile, selectedQuestionUids,
      ...clone(refs), inventoryQuestions: 21, normalizationQuestions: 20, existingRouteQuestions: 1, newMathematicalQa: false,
      newMetadataApprovals: 0, newDifficultyJudgments: 0, newReview2Claims: 0, sourceWrites: 0, rendererWrites: 0 });
  }
  wrapper = wrappers.values().next().value;
  function sealWrapper() {
    const files = [];
    for (const [source, value] of wrappers) {
      const relative = EVIDENCE_DIRECTORY + (source.includes("/2mid/") ? "binding-e017-v1.json" : "binding-e023-v1.json");
      const bytes = Buffer.from(JSON.stringify(value, null, 2) + "\n"); write(relative, bytes); files.push(relative);
      wrapperRefs.set(source, { path: relative, sha256: sha(bytes) });
    }
    const commit = commitFiles(files); for (const ref of wrapperRefs.values()) ref.commit = commit;
  }
  sealWrapper();
  function args(key = "E017-Q01") {
    const witness = staticDoc.rows.find(row => row.key === key), review = JSON.parse(git(root, ["show", `${witness.nativeReviewRef.commit}:${witness.nativeReviewRef.path}`]));
    const reviewedBank = bankFromBytes(git(root, ["show", `${witness.nativeSourceRef.commit}:${witness.nativeSourceRef.path}`]));
    const bytes = fs.readFileSync(path.join(root, witness.currentSourceRef.path)), currentBank = bankFromBytes(bytes);
    const selectedWrapper = wrappers.get(witness.sourceArchiveFile), selectedRef = wrapperRefs.get(witness.sourceArchiveFile);
    const patchRef = { path: selectedRef.path, sha256: selectedRef.sha256 };
    const evidenceRefs = [patchRef, ...Object.values(selectedWrapper).filter(ref => ref && typeof ref === "object" && ref.path).map(ref => ({ path: ref.path, sha256: ref.sha256 }))];
    const sourceReview = { schemaVersion: "archive-reviewed-source-reassessment-v1", reviewCommit: witness.nativeReviewRef.commit,
      reviewPath: witness.nativeReviewRef.path, reviewRef: { path: witness.nativeReviewRef.path, sha256: witness.nativeReviewRef.sha256 },
      m2ProblemRenderer21Continuity: { schemaVersion: M2_PROBLEM21_CONTINUITY_SCHEMA, reviewCommit: selectedRef.commit, reviewRef: clone(patchRef) } };
    const row = review.items.find(row => row.questionUid === witness.questionUid), patch = { questionUid: witness.questionUid,
      sourceOrdinal: witness.sourceOrdinal, before: {}, after: { sourceFingerprint: "test-existing-fingerprint" }, sourceReview, evidenceRefs: clone(evidenceRefs) };
    return { root, cache, request: { scope: "PARTIAL_UIDS", sourceArchiveFile: witness.sourceArchiveFile, expectedQuestionCount: witness.expectedQuestionCount,
      expectedSourceBlobSha1: blob(bytes), approval: { type: "FINAL_QA", metadataReviewed: true, evidenceRefs: clone(evidenceRefs) } }, patch, row,
      native: { spec: sourceReview, review, sourceBlob: witness.nativeSourceRef.gitBlobSha1, committedBlob: witness.nativeSourceRef.gitBlobSha1,
        reviewedBank, committedBank: clone(reviewedBank), reviewer: review.owner }, question: currentBank[witness.sourceOrdinal - 1], bankFromBytes };
  }
  const beforeDigests = () => new Map([...written.keys()].map(relative => [relative, sha(fs.readFileSync(path.join(root, relative)))]));
  const baseline = beforeDigests();
  return { root, args, docs, refs, paths, staticDoc, technical, wrapper, sealWrapper, written, modeCommit, wrapperPath, capsuleCommit,
    write, beforeDigests, baseline,
    restore(relative) { fs.writeFileSync(path.join(root, relative), written.get(relative)); },
    close() { fs.rmSync(root, { recursive: true, force: true }); } };
}

test("public problem21 is absent by default and cannot normalize Q2 or another UID", () => {
  assert.equal(validateM2ProblemRenderer21Continuity({ patch: {} }), null);
  assert.equal(validateM2ProblemRenderer21Continuity({ patch: { sourceReview: { independentOtherSurface: { preserve: true } } } }), null);
  assert.equal(M2_PROBLEM21_ITEMS.length, 21);
  assert.equal(M2_PROBLEM21_ITEMS.filter(row => row.callerAction === "NORMALIZE_EXACT_PROBLEM_FIELDS").length, 20);
});

test("frozen public problem21 uses real immutable Git and original UI evidence", async t => {
  const f = fixture();
  try {
    for (const item of M2_PROBLEM21_ITEMS.filter(row => row.callerAction === "NORMALIZE_EXACT_PROBLEM_FIELDS")) {
      await t.test(`exact ${item.key} restores only its owned problem fields`, () => {
        const args = f.args(item.key), result = validateM2ProblemRenderer21Continuity(args);
        assert.equal(sha(stable(problem(result.normalizedQuestion))), sha(stable(problem(args.native.reviewedBank[item.sourceOrdinal - 1]))));
        assert.equal(sha(stable(without(result.normalizedQuestion, result.normalizedProblemFields))), sha(stable(without(args.question, result.normalizedProblemFields))));
        assert.equal(result.proof.requiresOrdinaryNativeValidation, true);
        assert.equal(result.proof.requiresSeparateSolutionContinuity, item.key.startsWith("E023"));
        assert.equal(result.proof.newMetadataApprovals, 0); assert.equal(result.proof.sourceWrites, 0);
        assert.equal(result.normalizedPatch.sourceReview.m2ProblemRenderer21Continuity, undefined);
        assert.ok(args.patch.sourceReview.m2ProblemRenderer21Continuity);
      });
    }
    for (const [name, mutate, pattern] of [
      ["Q2 uses only its existing E017 route", a => Object.assign(a, f.args("E017-Q02")), /EXACT20_ONLY_Q2/],
      ["another UID cannot borrow a reviewed ordinal", a => { a.patch.questionUid = "qid_v1_" + "f".repeat(64); }, /EXACT20_ONLY_Q2/],
      ["another source cannot borrow a reviewed UID", a => { a.request.sourceArchiveFile = "original/other.js"; }, /EXACT20_ONLY_Q2/],
      ["FULL request cannot opt in", a => { a.request.scope = "FULL_EXAM"; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["difficulty-only approval cannot opt in", a => { a.request.approval.type = "DIFFICULTY_ONLY"; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["sourceRebind is a separate existing contract", a => { a.request.approval.sourceRebind = {}; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["unknown opt-in field fails closed", a => { a.patch.sourceReview.m2ProblemRenderer21Continuity.skip = true; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["null opt-in fails closed", a => { a.patch.sourceReview.m2ProblemRenderer21Continuity = null; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["own undefined opt-in is not absence", a => { a.patch.sourceReview.m2ProblemRenderer21Continuity = undefined; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["unknown sourceReview option rejected", a => { a.patch.sourceReview.unknownContinuity = { schemaVersion: "unknown" }; }, /EXACT_SOURCE_REVIEW_OPTIONS/],
      ["undefined sourceReview extra key rejected", a => { a.patch.sourceReview.unknownContinuity = undefined; }, /EXACT_SOURCE_REVIEW_OPTIONS/],
      ["private companion cannot enter E017", a => { a.patch.sourceReview.e023SolutionDisplayContinuity = { schemaVersion: "archive-m2-e023-solution-display6-continuity-v1", reviewCommit: "a".repeat(40), reviewRef: { path: "safe/other.json", sha256: "b".repeat(64) } }; }, /PRIVATE_COMPANION_OUTER_CONTRACT/],
      ["own undefined private companion rejected", a => { Object.assign(a, f.args("E023-Q04")); a.patch.sourceReview.e023SolutionDisplayContinuity = undefined; }, /PRIVATE_COMPANION_OUTER_CONTRACT/],
      ["null private companion rejected", a => { Object.assign(a, f.args("E023-Q04")); a.patch.sourceReview.e023SolutionDisplayContinuity = null; }, /PRIVATE_COMPANION_OUTER_CONTRACT/],
      ["wrong private companion schema rejected", a => { Object.assign(a, f.args("E023-Q04")); a.patch.sourceReview.e023SolutionDisplayContinuity = { schemaVersion: "other", reviewCommit: "a".repeat(40), reviewRef: { path: "safe/other.json", sha256: "b".repeat(64) } }; }, /PRIVATE_COMPANION_OUTER_CONTRACT/],
      ["unsafe private companion ref rejected without reading it", a => { Object.assign(a, f.args("E023-Q04")); a.patch.sourceReview.e023SolutionDisplayContinuity = { schemaVersion: "archive-m2-e023-solution-display6-continuity-v1", reviewCommit: "a".repeat(40), reviewRef: { path: "../private.json", sha256: "b".repeat(64) } }; }, /UNSAFE_PATH/],
      ["bank denominator cannot shrink", a => { a.request.expectedQuestionCount--; }, /NATIVE_IDENTITY_OR_METADATA_ONLY_SCOPE/],
      ["request cannot mutate a problem field", a => { a.patch.after.content = "synthetic"; }, /NATIVE_IDENTITY_OR_METADATA_ONLY_SCOPE/],
      ["unsafe wrapper path rejected", a => { a.patch.sourceReview.m2ProblemRenderer21Continuity.reviewRef.path = "../escape.json"; }, /UNSAFE_PATH/],
      ["immutable wrapper commit must exist", a => { a.patch.sourceReview.m2ProblemRenderer21Continuity.reviewCommit = "1".repeat(40); }, /IMMUTABLE_GIT_INPUT_UNAVAILABLE/],
      ["wrong wrapper raw hash rejected", a => { a.patch.sourceReview.m2ProblemRenderer21Continuity.reviewRef.sha256 = "a".repeat(64); }, /BOTH_EVIDENCE_LISTS_REQUIRED|WRAPPER_BINDING/],
      ["approval evidence cannot omit the UI document", a => { a.request.approval.evidenceRefs.pop(); }, /BOTH_EVIDENCE_LISTS_REQUIRED/],
      ["item evidence cannot duplicate the wrapper", a => { a.patch.evidenceRefs.push(clone(a.patch.evidenceRefs[0])); }, /BOTH_EVIDENCE_LISTS_REQUIRED/],
      ["different native row cannot be resealed", a => { a.row = { ...a.row, rpmDecision: "HOLD" }; }, /ORIGINAL_NATIVE_AUTHORITY_CHANGED/],
      ["different original review commit rejected", a => { a.native.spec = { ...a.native.spec, reviewCommit: "2".repeat(40) }; }, /EXACT_SOURCE_REVIEW_OPTIONS/],
      ["current source CAS remains mandatory", a => { a.request.expectedSourceBlobSha1 = "a".repeat(40); }, /LIVE_SOURCE_CAS/],
      ["passed question must match live problem projection", a => { a.question = { ...a.question, content: "synthetic different given" }; }, /LIVE_ARGUMENT_OR_DENOMINATOR/],
    ]) await t.test(name, () => { const args = f.args(); mutate(args); assert.throws(() => validateM2ProblemRenderer21Continuity(args), pattern); });

    for (const [name, relative, pattern] of [
      ["current SVG raw drift", f.staticDoc.rows[0].currentProblemAssets[0].path, /LIVE_PROBLEM_ASSET_DRIFT/],
      ["original PNG raw drift", f.staticDoc.rows[0].nativeProblemAssets[0].path, /LIVE_PROBLEM_ASSET_DRIFT/],
      ["current engine byte drift", "archive/engine.html", /LIVE_SERVED_CODE_DRIFT/],
      ["current student font byte drift", f.technical.studentFontResources[0].path, /LIVE_SERVED_CODE_DRIFT|LIVE_STUDENT_FONT_DRIFT/],
      ["live UI evidence differs from immutable Git", f.paths.studentUiTechnicalRef, /LIVE_CAPSULE_DRIFT/],
    ]) await t.test(name, () => {
      fs.appendFileSync(path.join(f.root, relative), " ");
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args()), pattern); } finally { f.restore(relative); }
    });
    for (const [label, mode] of [["executable immutable capsule", "100755"], ["symlink immutable capsule", "120000"]])
      await t.test(label, () => {
        const prior = f.wrapper.staticRef.commit; f.wrapper.staticRef.commit = f.modeCommit(f.paths.staticRef, mode); f.sealWrapper();
        try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args()), /IMMUTABLE_BLOB_MODE/); }
        finally { f.wrapper.staticRef.commit = prior; f.sealWrapper(); }
      });
    await t.test("wrapper must also be a regular nonexecutable blob", () => {
      const args = f.args(); args.patch.sourceReview.m2ProblemRenderer21Continuity.reviewCommit = f.modeCommit(f.wrapperPath, "100755");
      assert.throws(() => validateM2ProblemRenderer21Continuity(args), /IMMUTABLE_BLOB_MODE/);
    });
    await t.test("a Git commit entry cannot stand in for the wrapper blob", () => {
      const args = f.args(); args.patch.sourceReview.m2ProblemRenderer21Continuity.reviewCommit = f.modeCommit(f.wrapperPath, "160000", f.capsuleCommit);
      assert.throws(() => validateM2ProblemRenderer21Continuity(args), /IMMUTABLE_BLOB_MODE/);
    });
    await t.test("bank wrapper cannot include skipped Q2", () => {
      const original = [...f.wrapper.selectedQuestionUids]; f.wrapper.selectedQuestionUids.push(M2_PROBLEM21_ITEMS.find(item => item.key === "E017-Q02").questionUid); f.sealWrapper();
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args()), /EXACT_WRAPPER_SCOPE/); }
      finally { f.wrapper.selectedQuestionUids = original; f.sealWrapper(); }
    });
    await t.test("bank wrapper cannot be rebound to the other exam", () => {
      const original = f.wrapper.sourceArchiveFile; f.wrapper.sourceArchiveFile = M2_PROBLEM21_ITEMS.find(item => item.key === "E023-Q04").sourceArchiveFile; f.sealWrapper();
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args()), /EXACT_WRAPPER_SCOPE/); }
      finally { f.wrapper.sourceArchiveFile = original; f.sealWrapper(); }
    });
    await t.test("resealed live selected given is not an approved renderer delta", () => {
      const p = f.staticDoc.rows[0].currentSourceRef.path;
      fs.appendFileSync(path.join(f.root, p), '\nwindow.questionBank[0].content = "synthetic changed given";\n');
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args()), /LIVE_PROBLEM_BANK_DRIFT/); } finally { f.restore(p); }
    });
    await t.test("executed suffix changing a nonselected problem is rejected", () => {
      const p = f.staticDoc.rows[0].currentSourceRef.path;
      fs.appendFileSync(path.join(f.root, p), '\nwindow.questionBank[5].question = "synthetic changed nonselected given";\n');
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args()), /LIVE_PROBLEM_BANK_DRIFT/); } finally { f.restore(p); }
    });
    await t.test("Q10 transcription cannot be replaced and resealed", () => {
      const p = f.staticDoc.rows[0].currentSourceRef.path;
      fs.appendFileSync(path.join(f.root, p), '\nwindow.questionBank[9].content = "synthetic transcription change";\n');
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args("E017-Q10")), /LIVE_PROBLEM_BANK_DRIFT/); } finally { f.restore(p); }
    });
    for (const [label, key, mutation] of [
      ["resealed static reviewer", "staticRef", d => { d.sourceReviewer = d.transportAuthor; }],
      ["resealed current problem hash", "staticRef", d => { d.rows[0].currentProblemSha256 = "a".repeat(64); }],
      ["resealed screenshot inventory", "studentUiObservedRef", d => { d.cases[0].screenshots[0].sha256 = "b".repeat(64); }],
      ["resealed runtime coverage", "studentUiTechnicalRef", d => { d.results[0].capture.coverage.complete = false; }],
      ["resealed independent Q10 observer", "q10IndependentRef", d => { d.authorIsReviewer = true; }],
    ]) await t.test(label, () => {
      const original = clone(f.wrapper[key]), d = clone(f.docs[key]); mutation(d);
      const bytes = Buffer.from(JSON.stringify(d, null, 2) + "\n"), relative = f.paths[key]; fs.writeFileSync(path.join(f.root, relative), bytes);
      f.wrapper[key] = { ...original, sha256: sha(bytes), gitBlobSha1: blob(bytes), bytes: bytes.length }; f.sealWrapper();
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args()), /FROZEN_CAPSULE_CHANGED/); }
      finally { f.wrapper[key] = original; f.restore(relative); f.sealWrapper(); }
    });
    await t.test("private option and nonproblem fields are preserved for the separate validator", () => {
      const args = f.args("E023-Q04"), other = Object.freeze({ schemaVersion: "archive-m2-e023-solution-display6-continuity-v1",
        reviewCommit: "a".repeat(40), reviewRef: { path: "unread-other-surface/review.json", sha256: "b".repeat(64) } });
      args.patch.sourceReview.e023SolutionDisplayContinuity = other;
      const result = validateM2ProblemRenderer21Continuity(args);
      assert.equal(result.normalizedPatch.sourceReview.e023SolutionDisplayContinuity, other);
      assert.equal(sha(stable(without(args.question, result.normalizedProblemFields))), sha(stable(without(result.normalizedQuestion, result.normalizedProblemFields))));
      assert.equal(result.proof.requiresSeparateSolutionContinuity, true);
      assert.ok(!result.normalizedProblemFields.some(field => /solution|answer|course|rpm|template/i.test(field)));
    });
    const actual = f.beforeDigests();
    for (const [relative, expected] of f.baseline) if (relative !== ".archive-meta-register/evidence/test-m2-problem21/binding.json")
      assert.equal(actual.get(relative), expected, `input unchanged: ${relative}`);
  } finally { f.close(); }
});

// The generated SVG accessibility index is rebuilt by every main snapshot, so it
// is compared by the entries this question's screen consumed, not by bytes. Every
// other served file stays an exact live byte pin.
const INDEX_PATH = "archive/data/svg-accessibility-index.js";
const INDEX_PREFIX = "(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(";
const INDEX_SUFFIX = ");\n}(typeof window !== 'undefined' ? window : globalThis));\n";
const indexDoc = f => { const text = fs.readFileSync(path.join(f.root, INDEX_PATH), "utf8");
  return JSON.parse(text.slice(INDEX_PREFIX.length, -INDEX_SUFFIX.length)); };
const rewriteIndex = (f, mutate) => { const doc = indexDoc(f); mutate(doc);
  fs.writeFileSync(path.join(f.root, INDEX_PATH), INDEX_PREFIX + JSON.stringify(doc) + INDEX_SUFFIX); };
const entryFor = (doc, name) => doc.records.filter(row => decodeURIComponent(row.assetRef).endsWith("/24_연향중_2학기_중간_중2_수학/" + name));

test("problem21 compares the consumed SVG index entries instead of the whole generated file", async t => {
  const f = fixture();
  try {
    const q1 = "q1-problem-visual-v2.svg", q10 = "q10-problem-visual-v2.svg";
    assert.equal(entryFor(indexDoc(f), q1).length, 1, "fixture sanity: Q1 has a consumed entry in the frozen index");
    assert.equal(entryFor(indexDoc(f), q10).length, 0, "fixture sanity: Q10 has no entry in the frozen index");
    const passes = key => { const result = validateM2ProblemRenderer21Continuity(f.args(key)); assert.equal(result.proof.ui.liveServedCodeVerified, true); };
    const restoreIndex = () => f.restore(INDEX_PATH);
    const mutateOther = doc => {
      const others = doc.records.filter(row => !decodeURIComponent(row.assetRef).includes("/24_연향중_2학기_중간_중2_수학/"));
      others[0].descriptionKo = "unrelated change"; doc.records.splice(doc.records.indexOf(others[1]), 1);
      doc.records.push({ ...others[2], assetRef: "assets/images/zz_unrelated_exam/q1-added.svg" });
      doc.sourceIndexSha256 = "sha256:" + "e".repeat(64);
    };

    await t.test("unrelated entries added, removed or changed still pass (Q1 with an entry, Q10 without)", () => {
      rewriteIndex(f, mutateOther);
      try { passes("E017-Q01"); passes("E017-Q10"); } finally { restoreIndex(); }
    });
    await t.test("a sibling question's re-versioned entry does not affect this question", () => {
      rewriteIndex(f, doc => { const sibling = entryFor(doc, "q3-problem-visual-v2.svg"); assert.equal(sibling.length, 1);
        sibling[0].assetRef = sibling[0].assetRef.replace("q3-problem-visual-v2.svg", "q3-problem-visual-v3.svg"); });
      try { passes("E017-Q01"); } finally { restoreIndex(); }
    });
    for (const [label, mutate] of [
      ["Q1 entry text changed", doc => { entryFor(doc, q1)[0].descriptionKo += " changed"; }],
      ["Q1 entry provenance changed", doc => { entryFor(doc, q1)[0].svgSha256 = "f".repeat(64); }],
      ["Q1 entry removed", doc => { doc.records.splice(doc.records.indexOf(entryFor(doc, q1)[0]), 1); }],
      ["Q1 entry re-versioned away", doc => { const row = entryFor(doc, q1)[0]; row.assetRef = row.assetRef.replace(q1, "q1-problem-visual-v3.svg"); }],
      ["Q1 gains a solution-role entry", doc => { doc.records.push({ ...entryFor(doc, q1)[0], visualRole: "solution" }); }],
    ]) await t.test(`${label} fails`, () => {
      rewriteIndex(f, mutate);
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args("E017-Q01")), /LIVE_SERVED_CODE_DRIFT/); } finally { restoreIndex(); }
    });
    // Allowed: a key with NO frozen entry gains a valid problem-role entry that is
    // SOURCE_BOUND, answerHintFree and digest-bound to the displayed asset bytes.
    const q10Path = "archive/assets/images/24_연향중_2학기_중간_중2_수학/" + q10;
    const q10Entry = (doc, change = {}) => { const bytes = fs.readFileSync(path.join(f.root, q10Path)), base = entryFor(doc, q1)[0];
      return { ...base, assetRef: base.assetRef.replace(q1, q10), visualRole: "problem", titleKo: "새 접근성 제목", descriptionKo: "새 접근성 설명",
        svgSha256: "sha256:" + sha(bytes), gitBlobSha: blob(bytes), ...change }; };
    await t.test("a key with no frozen entry may gain one valid SOURCE_BOUND answer-hint-free entry", () => {
      rewriteIndex(f, doc => { doc.records.push(q10Entry(doc)); });
      try { passes("E017-Q10"); } finally { restoreIndex(); }
    });
    for (const [label, change] of [
      ["answerHintFree is not true", { answerHintFree: false }],
      ["provenance is not SOURCE_BOUND", { provenanceStatus: "ASSET_ONLY" }],
      ["it is a solution-role entry", { visualRole: "solution" }],
      ["its svgSha256 is not the displayed asset's digest", { svgSha256: "sha256:" + "0".repeat(64) }],
      ["its gitBlobSha is not the displayed asset's blob", { gitBlobSha: "1".repeat(40) }],
      ["its description is empty", { descriptionKo: " " }],
      ["its digest field is malformed", { svgSha256: "not-a-digest" }],
    ]) await t.test(`a new entry is rejected when ${label}`, () => {
      rewriteIndex(f, doc => { doc.records.push(q10Entry(doc, change)); });
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args("E017-Q10")), /LIVE_SERVED_CODE_DRIFT/); } finally { restoreIndex(); }
    });
    await t.test("a key that had a frozen entry cannot gain a second entry, even a valid one", () => {
      rewriteIndex(f, doc => { const base = entryFor(doc, q1)[0], bytes = fs.readFileSync(path.join(f.root, "archive/assets/images/24_연향중_2학기_중간_중2_수학/" + q1));
        doc.records.push({ ...base, visualRole: "solution", svgSha256: "sha256:" + sha(bytes), gitBlobSha: blob(bytes) }); });
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args("E017-Q01")), /LIVE_SERVED_CODE_DRIFT/); } finally { restoreIndex(); }
    });
    await t.test("a changed unrelated entry in the same index does not hide a changed consumed entry", () => {
      rewriteIndex(f, doc => { mutateOther(doc); entryFor(doc, q1)[0].titleKo += " changed"; });
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args("E017-Q01")), /LIVE_SERVED_CODE_DRIFT/); } finally { restoreIndex(); }
    });
    for (const [label, apply] of [
      ["an appended byte breaks the generated wrapper", () => fs.appendFileSync(path.join(f.root, INDEX_PATH), " ")],
      ["a schema change", () => rewriteIndex(f, doc => { doc.schemaVersion = "SVG_STUDENT_ACCESSIBILITY_V2"; })],
      ["a normalized duplicate key and role rejected by the student runtime", () => rewriteIndex(f, doc => {
        const other = doc.records.find(row => !decodeURIComponent(row.assetRef).includes("/24_연향중_2학기_중간_중2_수학/"));
        doc.records.push({ ...other, assetRef: "/archive/" + other.assetRef }); })],
      ["an unreadable index", () => fs.rmSync(path.join(f.root, INDEX_PATH))],
    ]) await t.test(`${label} fails`, () => {
      apply();
      try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args("E017-Q10")), /LIVE_SERVED_CODE_DRIFT/); } finally { restoreIndex(); }
    });
    for (const relative of ["archive/svg-accessibility.js", "archive/screen-runtime.js", "archive/question-meta.js"])
      await t.test(`a one-byte change to ${relative} still fails even beside an unrelated index change`, () => {
        rewriteIndex(f, mutateOther); fs.appendFileSync(path.join(f.root, relative), " ");
        try { assert.throws(() => validateM2ProblemRenderer21Continuity(f.args("E017-Q10")), /LIVE_SERVED_CODE_DRIFT/); }
        finally { f.restore(relative); restoreIndex(); }
      });
    await t.test("the frozen index must still authenticate by its pinned hashes", () => {
      const ref = f.technical.servedFiles.find(row => row.path === INDEX_PATH), ctx = f.args("E017-Q01"), assets = [{ path: "archive/assets/images/24_연향중_2학기_중간_중2_수학/" + q1 }];
      assert.doesNotThrow(() => verifyFrozenSvgIndexFootprint({ ...ctx, cache: new Map() }, ref, assets));
      for (const [label, bad, pattern] of [
        ["raw sha256", { ...ref, sha256: "a".repeat(64) }, /IMMUTABLE_RAW_DIGEST/],
        ["byte length", { ...ref, bytes: ref.bytes + 1 }, /IMMUTABLE_REF_BINDING/],
        ["git blob", { ...ref, gitBlobSha1: "b".repeat(40) }, /IMMUTABLE_REF_BINDING|IMMUTABLE_BLOB_MODE/],
        ["commit", { ...ref, commit: "c".repeat(40) }, /IMMUTABLE_GIT_INPUT_UNAVAILABLE/],
      ]) assert.throws(() => verifyFrozenSvgIndexFootprint({ ...ctx, cache: new Map() }, bad, assets), pattern, label);
    });
    await t.test("an unsafe or non-asset consumed path is rejected, never silently skipped", () => {
      const ref = f.technical.servedFiles.find(row => row.path === INDEX_PATH), ctx = { ...f.args("E017-Q01"), cache: new Map() };
      for (const assets of [[], [{ path: "archive/data/question_metadata.json" }], [{ path: "archive/assets/../x.svg" }]])
        assert.throws(() => verifyFrozenSvgIndexFootprint(ctx, ref, assets), /PROBLEM_ASSET_PATH/);
    });
  } finally { f.close(); }
});
