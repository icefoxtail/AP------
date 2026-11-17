import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { validateM2Family3ProblemContinuity as validate,
  M2_FAMILY3_PROBLEM_CONTINUITY_SCHEMA as SCHEMA, M2_FAMILY3_PROBLEM_BINDING_SCHEMA as BINDING,
  M2_FAMILY3_PROBLEM_SCOPE as SCOPE, M2_FAMILY3_PROBLEM_ITEMS as ITEMS
} from "../archive/tools/meta-foundation/reviewed-m2-family3-problem-continuity.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STAGE_A_COMMIT = "98b82952f463e29f3df50099e43321e868436a68";
const TECHNICAL_COMMIT = "7c6d2b60143bee6faac360e8fab343551c85c3cf";
const DIRECTORY = "docs/operations/m2-family3-problem-continuity-20261116/";
const stable = value => JSON.stringify(value, (_, x) => x && typeof x === "object" && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const clone = structuredClone;
const without = (question, fields) => Object.fromEntries(Object.entries(question).filter(([key]) => !fields.includes(key)));
const fields = ["id", "number", "sourceQuestionNo", "sourceQid", "sourceOrdinal", "questionUid", "questionType",
  "content", "question", "choices", "image", "images", "figureSvg", "layoutTag", "wide", "imageAlt", "imageCaption", "imageSize", "score"];
const problem = question => Object.fromEntries(fields.filter(key => Object.hasOwn(question, key)).map(key => [key, question[key]]));
function git(root, args, input) {
  return execFileSync("git", args, { cwd: root, input, maxBuffer: 8 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0",
      GIT_AUTHOR_NAME: "Archive test", GIT_AUTHOR_EMAIL: "test@example.invalid",
      GIT_COMMITTER_NAME: "Archive test", GIT_COMMITTER_EMAIL: "test@example.invalid" } });
}
function bankFromBytes(bytes) {
  const context = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext("globalThis.window={};globalThis.console={log(){},warn(){},error(){}};", context, { timeout: 1000 });
  vm.runInContext(bytes.toString("utf8"), context, { timeout: 3000 });
  return JSON.parse(vm.runInContext("JSON.stringify(window.questionBank || window.questions || globalThis.questions || globalThis.questionBank || window.examData?.questions)", context, { timeout: 1000 }));
}
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-family3-")); git(root, ["init", "-q"]);
  const common = path.resolve(REPO, git(REPO, ["rev-parse", "--git-common-dir"]).toString().trim());
  fs.writeFileSync(path.join(root, ".git/objects/info/alternates"), path.join(common, "objects") + "\n");
  const docs = {}, refs = {}, originalBytes = new Map(), wrappers = new Map(), wrapperRefs = new Map(), cache = new Map();
  function write(relative, bytes, remember = true) {
    const target = path.join(root, relative); fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
    if (remember) originalBytes.set(relative, Buffer.from(bytes));
  }
  for (const [name, relative, commit] of [
    ["staticRef", DIRECTORY + "static-v1.json", STAGE_A_COMMIT],
    ["studentUiObservedRef", DIRECTORY + "student-ui-observed-v1.json", STAGE_A_COMMIT],
    ["studentUiTechnicalRef", "docs/operations/m2-problem21-continuity-20261116/student-ui-technical-v1.json", TECHNICAL_COMMIT]
  ]) {
    const bytes = git(root, ["show", commit + ":" + relative]); write(relative, bytes); docs[name] = JSON.parse(bytes);
    refs[name] = { commit, path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes), bytes: bytes.length };
  }
  const staticDoc = docs.staticRef, technical = docs.studentUiTechnicalRef;
  function materialize(ref) {
    if (originalBytes.has(ref.path)) { assert.equal(sha(originalBytes.get(ref.path)), ref.sha256); return; }
    const bytes = git(root, ["show", ref.commit + ":" + ref.path]);
    assert.equal(blob(bytes), ref.gitBlobSha1); assert.equal(sha(bytes), ref.sha256); write(ref.path, bytes);
  }
  for (const row of staticDoc.rows) {
    materialize(row.currentSourceRef);
    row.nativeProblemAssets.forEach(materialize); row.currentProblemAssets.forEach(materialize);
  }
  for (const ref of technical.servedFiles)
    if (ref.path !== "archive/data/question_metadata.json" && !ref.path.startsWith("archive/exams/")) materialize(ref);
  technical.studentFontResources.forEach(materialize);
  function commitFiles(files, mode = "100644", suppliedOid) {
    git(root, ["read-tree", "--empty"]);
    for (const relative of files) {
      const oid = suppliedOid || git(root, ["hash-object", "-w", "--stdin"], fs.readFileSync(path.join(root, relative))).toString().trim();
      git(root, ["update-index", "--add", "--cacheinfo", mode + "," + oid + "," + relative]);
    }
    const tree = git(root, ["write-tree"]).toString().trim();
    return git(root, ["commit-tree", tree], "local metadata fixture\n").toString().trim();
  }
  for (const source of [...new Set(ITEMS.map(item => item.sourceArchiveFile))]) wrappers.set(source, {
    schemaVersion: BINDING, scope: SCOPE, sourceArchiveFile: source,
    selectedQuestionUids: ITEMS.filter(item => item.sourceArchiveFile === source).map(item => item.questionUid),
    ...clone(refs), inventoryQuestions: 3, normalizationQuestions: 3,
    newMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0, newReview2Claims: 0, sourceWrites: 0, rendererWrites: 0
  });
  function sealWrappers() {
    const relativePaths = [];
    for (const [source, wrapper] of wrappers) {
      const relative = DIRECTORY + (source.includes("매산") ? "binding-e015-v1.json" : "binding-e017-v1.json");
      const bytes = Buffer.from(JSON.stringify(wrapper, null, 2) + "\n"); write(relative, bytes, false);
      relativePaths.push(relative); wrapperRefs.set(source, { path: relative, sha256: sha(bytes) });
    }
    const commit = commitFiles(relativePaths);
    for (const ref of wrapperRefs.values()) ref.commit = commit;
  }
  sealWrappers();
  const retained = {
    retainedFields: { schemaVersion: "archive-reviewed-native-retained-fields-v1",
      fields: ["standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "standardUnit", "subUnit"],
      independentPrimary: { schemaVersion: "archive-reviewed-existing-primary-disposition-v1", reviewCommit: "7be7d9908427cca28b6d6cabfea19d30ba6d7d83",
        reviewRef: { path: ".archive-meta-register/evidence/m2s2-retained-primary-finalization-20261115/m3-four-existing-primary.json",
          sha256: "7a17926507216647352baaf38a25d92e9830846d56522f2011034248b8696209" } } },
    retainedScopeTransport: { schemaVersion: "archive-reviewed-retained-scope-transport-v1", fields: ["curriculum", "curriculumKey", "courseKey"] }
  };
  function args(key = "E017-Q06") {
    const witness = staticDoc.rows.find(row => row.key === key);
    const nativeReview = JSON.parse(git(root, ["show", witness.nativeReviewRef.commit + ":" + witness.nativeReviewRef.path]));
    const reviewedBank = bankFromBytes(git(root, ["show", witness.nativeSourceRef.commit + ":" + witness.nativeSourceRef.path]));
    const committedBank = bankFromBytes(git(root, ["show", witness.nativeCommittedSourceRef.commit + ":" + witness.nativeCommittedSourceRef.path]));
    const bytes = fs.readFileSync(path.join(root, witness.currentSourceRef.path)), liveBank = bankFromBytes(bytes);
    const ref = wrapperRefs.get(witness.sourceArchiveFile), wrapper = wrappers.get(witness.sourceArchiveFile);
    const narrow = { path: ref.path, sha256: ref.sha256 };
    const evidenceRefs = [narrow, ...Object.values(wrapper).filter(ref => ref && typeof ref === "object" && ref.path)
      .map(ref => ({ path: ref.path, sha256: ref.sha256 }))];
    const sourceReview = {
      schemaVersion: "archive-reviewed-source-reassessment-v1", reviewCommit: witness.nativeReviewRef.commit,
      reviewPath: witness.nativeReviewRef.path, reviewRef: { path: witness.nativeReviewRef.path, sha256: witness.nativeReviewRef.sha256 },
      m2Family3ProblemContinuity: { schemaVersion: SCHEMA, reviewCommit: ref.commit, reviewRef: clone(narrow) },
      ...(key.startsWith("E015") ? clone(retained) : {})
    };
    const row = nativeReview.items.find(row => row.questionUid === witness.questionUid);
    return { root, cache, request: { scope: "PARTIAL_UIDS", registryChanges: [], sourceArchiveFile: witness.sourceArchiveFile,
      expectedQuestionCount: witness.expectedQuestionCount, expectedSourceBlobSha1: blob(bytes),
      approval: { type: "FINAL_QA", metadataReviewed: true, evidenceRefs: clone(evidenceRefs) } },
      patch: { questionUid: witness.questionUid, sourceOrdinal: witness.sourceOrdinal, before: {}, after: { sourceFingerprint: "test-preserved" },
        sourceReview, evidenceRefs: clone(evidenceRefs) }, row,
      native: { spec: sourceReview, review: nativeReview, sourceBlob: witness.nativeSourceRef.gitBlobSha1,
        committedBlob: witness.nativeCommittedSourceRef.gitBlobSha1, reviewedBank, committedBank },
      question: liveBank[witness.sourceOrdinal - 1], bankFromBytes };
  }
  return { root, docs, refs, staticDoc, technical, wrappers, wrapperRefs, args, write, commitFiles, sealWrappers,
    restore(relative) { fs.writeFileSync(path.join(root, relative), originalBytes.get(relative)); },
    verifyUnchanged() { for (const [relative, bytes] of originalBytes) assert.equal(sha(fs.readFileSync(path.join(root, relative))), sha(bytes)); },
    close() { fs.rmSync(root, { recursive: true, force: true }); } };
}

test("family3 has exactly three identities and is absent by default", () => {
  assert.equal(ITEMS.length, 3);
  assert.equal(validate({ patch: {} }), null);
  assert.equal(validate({ patch: { sourceReview: { unrelatedExistingOption: {} } } }), null);
});

test("family3 immutable static and actual UI evidence bounds memory-only normalization", async t => {
  const f = fixture();
  try {
    for (const item of ITEMS) await t.test(item.key + " restores four problem fields and preserves all other fields/options", () => {
      const args = f.args(item.key), originalArgs = clone({ question: args.question, patch: args.patch }), result = validate(args);
      assert.equal(sha(stable(problem(result.normalizedQuestion))), sha(stable(problem(args.native.reviewedBank[item.sourceOrdinal - 1]))));
      assert.deepEqual(result.normalizedProblemFields, ["image", "imageAlt", "imageSize", "layoutTag"]);
      assert.deepEqual(without(result.normalizedQuestion, result.normalizedProblemFields), without(args.question, result.normalizedProblemFields));
      assert.equal(result.proof.requiresOrdinaryNativeValidation, true);
      assert.equal(result.proof.requiresOrdinaryRetainedValidation, item.key.startsWith("E015"));
      assert.equal(result.proof.requiresSeparateSolutionContinuity, false);
      assert.equal(result.proof.newMetadataApprovals, 0); assert.equal(result.proof.sourceWrites, 0);
      assert.equal(result.proof.ui.logicalCases, 6); assert.equal(result.proof.ui.originalPngs, 6);
      assert.equal(result.normalizedPatch.sourceReview.m2Family3ProblemContinuity, undefined);
      if (item.key.startsWith("E015")) {
        assert.deepEqual(result.normalizedPatch.sourceReview.retainedFields, args.patch.sourceReview.retainedFields);
        assert.deepEqual(result.normalizedPatch.sourceReview.retainedScopeTransport, args.patch.sourceReview.retainedScopeTransport);
      }
      assert.deepEqual({ question: args.question, patch: args.patch }, originalArgs);
    });
    for (const [name, mutate, pattern] of [
      ["null option", a => { a.patch.sourceReview.m2Family3ProblemContinuity = null; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["own undefined is not absence", a => { a.patch.sourceReview.m2Family3ProblemContinuity = undefined; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["unknown option key", a => { a.patch.sourceReview.m2Family3ProblemContinuity.skip = true; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["unknown sourceReview option", a => { a.patch.sourceReview.otherContinuity = {}; }, /EXACT_SOURCE_REVIEW_OPTIONS/],
      ["other surface cannot enter", a => { a.patch.sourceReview.e023SolutionDisplayContinuity = {}; }, /EXACT_SOURCE_REVIEW_OPTIONS/],
      ["other UID", a => { a.patch.questionUid = "qid_v1_" + "f".repeat(64); }, /EXACT_FAMILY3_ONLY/],
      ["other ordinal", a => { a.patch.sourceOrdinal = 2; }, /EXACT_FAMILY3_ONLY/],
      ["other source", a => { a.request.sourceArchiveFile = "original/other.js"; }, /EXACT_FAMILY3_ONLY/],
      ["full-exam scope", a => { a.request.scope = "FULL_EXAM"; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["non-FINAL approval", a => { a.request.approval.type = "BASIC"; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["registry addition is separate authority", a => { a.request.registryChanges = [{}]; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["sourceRebind even own undefined", a => { a.request.approval.sourceRebind = undefined; }, /EXPLICIT_EXCLUSIVE_NATIVE_CONTRACT/],
      ["smaller bank", a => { a.request.expectedQuestionCount--; }, /NATIVE_IDENTITY_OR_METADATA_ONLY_SCOPE/],
      ["student field in target after", a => { a.patch.after.content = "synthetic"; }, /NATIVE_IDENTITY_OR_METADATA_ONLY_SCOPE/],
      ["unsafe wrapper path", a => { a.patch.sourceReview.m2Family3ProblemContinuity.reviewRef.path = "../outside.json"; }, /UNSAFE_PATH/],
      ["missing immutable commit", a => { a.patch.sourceReview.m2Family3ProblemContinuity.reviewCommit = "1".repeat(40); }, /IMMUTABLE_GIT_INPUT_UNAVAILABLE/],
      ["bad wrapper hash", a => { a.patch.sourceReview.m2Family3ProblemContinuity.reviewRef.sha256 = "a".repeat(64); }, /BOTH_EVIDENCE_LISTS_REQUIRED|WRAPPER_BINDING/],
      ["missing approval evidence", a => { a.request.approval.evidenceRefs.pop(); }, /BOTH_EVIDENCE_LISTS_REQUIRED/],
      ["duplicated patch evidence", a => { a.patch.evidenceRefs.push(clone(a.patch.evidenceRefs[0])); }, /BOTH_EVIDENCE_LISTS_REQUIRED/],
      ["different Native review row", a => { a.row = { ...a.row, rpmDecision: "HOLD" }; }, /ORIGINAL_NATIVE_AUTHORITY_CHANGED/],
      ["different Native source body with same problem", a => { a.native.reviewedBank[5].courseKey = "synthetic-other"; }, /ORIGINAL_NATIVE_AUTHORITY_CHANGED/],
      ["different committed source body", a => { a.native.committedBank[5].conditionKeys = ["synthetic-other"]; }, /ORIGINAL_NATIVE_AUTHORITY_CHANGED/],
      ["different Native commit", a => { a.native.spec = { ...a.native.spec, reviewCommit: "2".repeat(40) }; }, /EXACT_SOURCE_REVIEW_OPTIONS/],
      ["wrong current source CAS", a => { a.request.expectedSourceBlobSha1 = "3".repeat(40); }, /LIVE_SOURCE_CAS/],
      ["synthetic passed question", a => { a.question = { ...a.question, content: "synthetic different given" }; }, /LIVE_ARGUMENT_OR_DENOMINATOR/],
      ["E015 missing retained companion", a => { Object.assign(a, f.args("E015-Q07")); delete a.patch.sourceReview.retainedFields; }, /RETAINED_COMPANION_OUTER_CONTRACT/],
      ["E015 own null scope companion", a => { Object.assign(a, f.args("E015-Q08")); a.patch.sourceReview.retainedScopeTransport = null; }, /RETAINED_COMPANION_OUTER_CONTRACT/],
      ["E015 partial retained field mask", a => { Object.assign(a, f.args("E015-Q07")); a.patch.sourceReview.retainedFields.fields.pop(); }, /RETAINED_COMPANION_OUTER_CONTRACT/],
      ["E015 unsafe independent metadata path", a => { Object.assign(a, f.args("E015-Q07")); a.patch.sourceReview.retainedFields.independentPrimary.reviewRef.path = "../unrelated.json"; }, /UNSAFE_PATH/]
    ]) await t.test(name, () => { const args = f.args(); mutate(args); assert.throws(() => validate(args), pattern); });
    for (const [name, relative, pattern] of [
      ["old PNG bytes", f.staticDoc.rows[2].nativeProblemAssets[0].path, /LIVE_PROBLEM_ASSET_DRIFT/],
      ["current SVG bytes", f.staticDoc.rows[2].currentProblemAssets[0].path, /LIVE_PROBLEM_ASSET_DRIFT/],
      ["served engine bytes", "archive/engine.html", /LIVE_SERVED_CODE_DRIFT/],
      ["font bytes", f.technical.studentFontResources[0].path, /LIVE_SERVED_CODE_DRIFT|LIVE_STUDENT_FONT_DRIFT/],
      ["static capsule local bytes", f.refs.staticRef.path, /LIVE_CAPSULE_DRIFT/],
      ["technical evidence local bytes", f.refs.studentUiTechnicalRef.path, /LIVE_CAPSULE_DRIFT/]
    ]) await t.test(name + " drift rejects", () => {
      fs.appendFileSync(path.join(f.root, relative), " ");
      try { assert.throws(() => validate(f.args()), pattern); } finally { f.restore(relative); }
    });
    const source = ITEMS.find(item => item.key === "E017-Q06").sourceArchiveFile;
    const wrapper = f.wrappers.get(source);
    await t.test("resealed wrapper cannot expand to Q2", () => {
      const before = clone(wrapper.selectedQuestionUids); wrapper.selectedQuestionUids.push("qid_v1_" + "f".repeat(64)); f.sealWrappers();
      try { assert.throws(() => validate(f.args()), /EXACT_WRAPPER_SCOPE/); }
      finally { wrapper.selectedQuestionUids = before; f.sealWrappers(); }
    });
    for (const mode of ["100755", "120000"]) await t.test("immutable capsule mode " + mode + " rejects", () => {
      const before = wrapper.staticRef.commit; wrapper.staticRef.commit = f.commitFiles([f.refs.staticRef.path], mode); f.sealWrappers();
      try { assert.throws(() => validate(f.args()), /IMMUTABLE_BLOB_MODE/); }
      finally { wrapper.staticRef.commit = before; f.sealWrappers(); }
    });
    await t.test("wrapper is also a regular blob", () => {
      const args = f.args(), ref = f.wrapperRefs.get(source);
      args.patch.sourceReview.m2Family3ProblemContinuity.reviewCommit = f.commitFiles([ref.path], "100755");
      assert.throws(() => validate(args), /IMMUTABLE_BLOB_MODE/);
    });
    for (const [name, ordinal] of [["selected", 5], ["nonselected", 0]]) await t.test(name + " problem suffix remains rejected after current CAS refresh", () => {
      const relative = f.staticDoc.rows.find(row => row.key === "E017-Q06").currentSourceRef.path;
      fs.appendFileSync(path.join(f.root, relative), "\nwindow.questionBank[" + ordinal + "].content = 'synthetic different given';\n");
      try { assert.throws(() => validate(f.args()), /LIVE_PROBLEM_BANK_DRIFT/); } finally { f.restore(relative); }
    });
    await t.test("metadata remains outside display authority and is never silently replaced", () => {
      const args = f.args(); args.question = { ...args.question, conditionKeys: ["synthetic-unapproved"] };
      const result = validate(args);
      assert.deepEqual(result.normalizedQuestion.conditionKeys, ["synthetic-unapproved"]);
      assert.equal(result.proof.requiresOrdinaryNativeValidation, true);
      assert.notEqual(result.proof.argumentWholeQuestionSha256, result.proof.liveWholeQuestionSha256);
    });
    f.verifyUnchanged();
  } finally { f.close(); }
});

// The generated SVG accessibility index is rebuilt by every main snapshot, so it
// is compared by the entries the question's own image consumes (rules in
// svg-index-continuity.mjs); every other served file stays a byte pin.
test("family3 compares consumed SVG index entries, not the whole generated file", async t => {
  const f = fixture(), INDEX = "archive/data/svg-accessibility-index.js", PREFIX = "(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(";
  const SUFFIX = ");\n}(typeof window !== 'undefined' ? window : globalThis));\n", file = path.join(f.root, INDEX);
  const rewrite = mutate => { const text = fs.readFileSync(file, "utf8"), doc = JSON.parse(text.slice(PREFIX.length, -SUFFIX.length));
    mutate(doc); fs.writeFileSync(file, PREFIX + JSON.stringify(doc) + SUFFIX); };
  const mine = doc => doc.records.filter(row => decodeURIComponent(row.assetRef).endsWith("/24_연향중_2학기_중간_중2_수학/q6-problem-visual-v2.svg"));
  const other = doc => doc.records.filter(row => !decodeURIComponent(row.assetRef).includes("/24_연향중_2학기_중간_중2_수학/"));
  const restore = () => f.restore(INDEX);
  try {
    await t.test("unrelated added, removed or changed entries still pass", () => {
      rewrite(doc => { const rows = other(doc); rows[0].descriptionKo = "unrelated change"; doc.records.splice(doc.records.indexOf(rows[1]), 1);
        doc.records.push({ ...rows[2], assetRef: "assets/images/zz_unrelated/q1.svg" }); });
      try { assert.ok(validate(f.args())); } finally { restore(); }
    });
    for (const [label, mutate] of [
      ["changed consumed entry", doc => { mine(doc)[0].descriptionKo += " changed"; }],
      ["removed consumed entry", doc => { doc.records.splice(doc.records.indexOf(mine(doc)[0]), 1); }],
      ["consumed key gains a second role entry", doc => { doc.records.push({ ...mine(doc)[0], visualRole: "solution" }); }],
    ]) await t.test(label + " fails", () => {
      rewrite(mutate);
      try { assert.throws(() => validate(f.args()), /LIVE_SERVED_CODE_DRIFT/); } finally { restore(); }
    });
    await t.test("an appended byte to the index fails", () => {
      fs.appendFileSync(file, " ");
      try { assert.throws(() => validate(f.args()), /LIVE_SERVED_CODE_DRIFT/); } finally { restore(); }
    });
  } finally { f.close(); }
});
