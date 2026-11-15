import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { registerBasicScopeRebind, sourceFingerprint, contentFingerprint } from "../archive/tools/meta-foundation/register-basic-scope-rebind.mjs";

const SRC = "original/middle/m1/2mid/99_테스트중_2학기_중간_중1_수학.js";
const E = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/", D = ".archive-meta-register/evidence/";
const META = "archive/data/question_metadata.json", ID = "archive/data/question_identity_map.json", RT = "archive/data/meta-foundation/runtime/middle1-v1.json";
const D5 = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];
const P = ["standardUnitKey", "standardUnit", "subUnitKey", "subUnit"], S = ["crossConceptKeys", "conditionKeys", "integrationPattern"];
const sha = s => crypto.createHash("sha256").update(s).digest("hex"), json = x => JSON.stringify(x, null, 2) + "\n";
const pick = (r, ks) => Object.fromEntries(ks.map(k => [k, r[k] ?? null]));
const fp = q => ({ sourceFingerprint: sourceFingerprint(q), contentFingerprint: contentFingerprint(q) });
const bank = qs => `window.questionBank = ${JSON.stringify(qs, null, 2)};\n`;
const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const write = (root, p, value) => { fs.mkdirSync(path.dirname(path.join(root, p)), { recursive: true }); fs.writeFileSync(path.join(root, p), typeof value === "string" ? value : json(value)); };
const read = (root, p) => JSON.parse(fs.readFileSync(path.join(root, p)));

function fixture(mode = "WITHDRAW_UNSUPPORTED_TYPE") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "reviewed-parent-"));
  git(root, "init", "-q"); git(root, "config", "user.name", "test"); git(root, "config", "user.email", "test@example.invalid");
  const uid = "qid_v1_" + sha("target"), other = "qid_v1_" + sha("other");
  const beforeParent = { standardUnitKey: "M1-07", standardUnit: "입체도형의 성질", subUnitKey: "M1-07-SOLID_FIGURE", subUnit: "입체도형" };
  const afterParent = { standardUnitKey: "M1-05", standardUnit: "기본도형", subUnitKey: "M1-05-POSITION_RELATION", subUnit: "위치 관계" };
  const pair = mode === "KEEP_UNREGISTERED_TYPE" ? ["", ""] : ["PT_TEST", "TPL_TEST"];
  const old = { id: 1, content: "공간의 위치 관계를 고르시오.", choices: ["가", "나"], answer: "가", solution: "기존 풀이", level: "중", standardCourse: "중1 수학",
    ...beforeParent, problemTypeKey: pair[0], templateKey: pair[1], crossConceptKeys: [], conditionKeys: [], integrationPattern: "CASE_BRANCH",
    difficultyBucket: 3, difficultyConfidence: "medium", difficultyBoundaryFlag: "B34", legacyLevelCompatibility: "NORMAL" };
  const otherQ = { ...old, id: 2, content: "다른 문항" };
  write(root, `archive/exams/${SRC}`, bank([old, otherQ])); git(root, "add", "."); git(root, "commit", "-qm", "registered source");
  const previousSourceCommit = git(root, "rev-parse", "HEAD"), previousSourceBlobSha1 = git(root, "hash-object", `archive/exams/${SRC}`);
  const wanted = { ...afterParent, standardCourse: "중1 수학", level: "중", problemTypeKey: mode === "WITHDRAW_UNSUPPORTED_TYPE" ? null : "PT_TEST",
    templateKey: mode === "WITHDRAW_UNSUPPORTED_TYPE" ? null : "TPL_TEST", crossConceptKeys: [], conditionKeys: [], integrationPattern: "NONE",
    difficultyBucket: 2, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL" };
  const current = { ...old, ...wanted, solution: "검토된 현재 풀이" };
  const fields = { standardUnit: "approved_source", subUnit: "approved_source", problemType: pair[0] ? "approved_semantic" : "manual_review_pending", template: pair[1] ? "approved_semantic" : "manual_review_pending" };
  const row = { questionUid: uid, sourceArchiveFile: SRC, sourceOrdinal: 1, sourceQuestionNo: "1", ...old, ...fp(old), conceptClusterKey: beforeParent.subUnitKey,
    fieldStatus: fields, metadataStatus: "approved_full", approvalEvidence: ["prior-approval.json"] };
  delete row.content; delete row.choices; delete row.answer; delete row.solution; delete row.id;
  const otherRow = { ...row, questionUid: other, sourceOrdinal: 2, sourceQuestionNo: "2", ...fp(otherQ) };
  write(root, META, { records: [row, otherRow] }); write(root, ID, { records: [row, otherRow].map(r => pick(r, ["questionUid", "sourceArchiveFile", "sourceOrdinal", "sourceQuestionNo", "sourceFingerprint"])) });
  const basicParent = { grade: "중1", curriculumKey: "2022", courseKey: "M1-2", L1: "기본 도형", L2: "위치 관계" };
  write(root, "archive/data/basic-scope-source-links.json", { status: "REVIEWED_SCOPE_LINKS", records: [] });
  write(root, "archive/data/basic-scope-parent-links.json", { records: [{ ...basicParent, ...afterParent }] });
  write(root, RT, { packId: "MIDDLE1", records: pair[0] ? [pick(row, ["questionUid", "sourceArchiveFile", "sourceOrdinal", "sourceFingerprint", ...P, ...S, ...D5, "problemTypeKey", "templateKey"])] : [], counts: {} });
  const pack = "archive/data/meta-foundation/canonical/packs/middle1/";
  write(root, pack + "pack.json", { packId: "MIDDLE1", canonicalStatus: "ACTIVE", curricula: ["2022"], standardCourses: ["중1 수학"] });
  write(root, pack + "taxonomy.json", { problemTypes: [{ problemTypeKey: "PT_TEST", status: "ACTIVE", canonicalLabelKo: "공간 관계" }], templates: [{ templateKey: "TPL_TEST", parentProblemTypeKey: "PT_TEST", status: "ACTIVE", canonicalLabelKo: "관계 판정" }] });
  write(root, pack + "bindings.json", { bindings: [{ problemTypeKey: "PT_TEST", status: "ACTIVE", curriculum: "2022", standardCourse: "중1 수학", ...afterParent }] });
  write(root, `archive/exams/${SRC}`, bank([current, otherQ]));
  const expectedSourceBlobSha1 = git(root, "hash-object", `archive/exams/${SRC}`), reviewPath = "docs/operations/native-review.json";
  const preserve = mode === "PRESERVE_APPROVED_TYPE";
  const nativeRow = { questionUid: uid, sourceOrdinal: 1, decisiveStep: "공간 관계의 정의를 대조한다.",
    hashes: { QFULL: sourceFingerprint(current), QBODY: contentFingerprint(current) },
    ...(preserve ? { proposed: wanted, gapType: "RPM_LEAF_GAP", rpmDecision: { curriculum: "2022", scope: "M1-2", majorUnit: basicParent.L1, midUnit: basicParent.L2, status: "RPM_LEAF_GAP" } }
      : { reviewedProposedMetadata: wanted, publicationStatus: "HOLD_SHARED_PARENT_CONSUMER_CONFLICT", judgment: "CORRECT_WITH_TYPE_HOLD", typeReview: { status: "RPM_LEAF_GAP", currentPair: pair },
          rpmProposedParent: { curriculum: "2022", scope: "M1-2", majorUnit: basicParent.L1, midUnit: basicParent.L2 } }) };
  const native = { schemaVersion: preserve ? "m1-s2-integrated-semantic-review-v1" : "m1s2-integrated-metadata-review-v1", sourceArchiveFile: SRC,
    reviewer: "prior-reviewer", questionCount: 2, sourceGitBlobSha: expectedSourceBlobSha1, items: [nativeRow, { questionUid: other, sourceOrdinal: 2 }] };
  write(root, reviewPath, native); git(root, "add", "."); git(root, "commit", "-qm", "native review");
  const reviewCommit = git(root, "rev-parse", "HEAD"), reviewRef = { path: E + "native.json", sha256: sha(json(native)) };
  write(root, reviewRef.path, native);
  const dr = { sourceArchiveFile: SRC, ordinal: 1, questionUid: uid, before: { level: "중", ...pick(row, [...D5, "sourceFingerprint", "contentFingerprint"]) },
    after: pick(wanted, D5), ...fp(current), staleSourceBinding: false, refreshBinding: false, decision: "CORRECT", reason: "reuse exact native review" };
  const difficultyEvidence = { schemaVersion: "archive-difficulty5-reviewed-correction-v1", rows: [dr] };
  write(root, D + "difficulty.json", difficultyEvidence);
  const difficulty = { schemaVersion: "archive-difficulty5-register-request-v1", gemini: { schemaVersion: "v1", requestId: "fixture-difficulty", sourceArchiveFile: SRC,
    latestBlobSha: expectedSourceBlobSha1, items: [{ ordinal: 1, questionUid: uid, before: { level: "중" }, after: dr.after }] },
    reviewedCorrection: { schemaVersion: difficultyEvidence.schemaVersion, approvalRef: reviewPath, evidencePath: D + "difficulty.json", evidenceSha256: sha(json(difficultyEvidence)), rows: [dr] } };
  write(root, D + "difficulty-request.json", difficulty);
  const difficultyRequestRef = { path: D + "difficulty-request.json", sha256: sha(json(difficulty)) };
  const request = { schemaVersion: "archive-basic-parent-correction-request-v1", requestId: "parent-fixture", examUid: path.basename(SRC, ".js"), sourceArchiveFile: SRC,
    expectedQuestionCount: 2, expectedSourceBlobSha1, previousSourceCommit, previousSourceBlobSha1, difficultyRequestRef,
    approval: { type: "BASIC_PARENT_CORRECTION", metadataReviewed: true, approvedBy: "publisher", evidenceRefs: [reviewRef, difficultyRequestRef],
      nativeParentReview: { schemaVersion: "archive-reviewed-parent-correction-v1", reviewCommit, reviewPath, reviewRef } },
    items: [{ questionUid: uid, sourceOrdinal: 1, reason: "Reuse confirmed parent correction", before: fp(old), after: fp(current),
      parentBefore: beforeParent, parentAfter: afterParent, basicParent, typeDisposition: mode, linkBefore: null,
      expectedBefore: pick(row, [...P, "conceptClusterKey", "sourceFingerprint", "contentFingerprint", "problemTypeKey", "templateKey", ...D5, ...S]), evidenceRefs: [reviewRef] }] };
  return { root, request, uid, other, current, row, native, reviewRef, difficulty, nativeRow };
}
const run = (f, options = {}) => registerBasicScopeRebind({ root: f.root, request: f.request, ...options });

for (const mode of ["WITHDRAW_UNSUPPORTED_TYPE", "KEEP_UNREGISTERED_TYPE", "PRESERVE_APPROVED_TYPE"]) test(`reviewed parent ${mode}: exact source, separate type state, replay and projection`, () => {
  const f = fixture(mode), before = read(f.root, META).records[1];
  assert.equal(run(f).status, "PASS"); assert.equal(run(f, { write: true }).totalRebound, 1);
  const [after, other] = read(f.root, META).records;
  assert.deepEqual(other, before); assert.equal(after.standardUnitKey, "M1-05"); assert.equal(after.integrationPattern, "NONE");
  assert.equal(after.difficultyBucket, 2); assert.equal(after.sourceFingerprint, sourceFingerprint(f.current));
  assert.equal(after.rpmPathStatus, "HOLD_NO_EQUIVALENT_PATH");
  assert.equal(Boolean(after.problemTypeKey), mode === "PRESERVE_APPROVED_TYPE");
  if (mode !== "PRESERVE_APPROVED_TYPE") assert.equal(after.foundationTaxonomyStatus, "HOLD");
  assert.equal(read(f.root, RT).records.length, mode === "PRESERVE_APPROVED_TYPE" ? 1 : 0);
  assert.equal(run(f, { write: true }).replay, true); assert.equal(run(f, { verifyProjection: true }).status, "PASS");
  const receipt = read(f.root, E + "parent-fixture.json"); assert.equal(receipt.newFullSemanticApprovals, 0);
});

test("rejects missing or changed native review, scope, before snapshot and D5 evidence", () => {
  for (const mutate of [
    f => { f.request.approval.nativeParentReview.reviewCommit = "0".repeat(40); },
    f => { f.request.items[0].evidenceRefs = []; },
    f => { write(f.root, f.reviewRef.path, { ...f.native, reviewer: "other" }); },
    f => { f.request.items[0].sourceOrdinal = 2; },
    f => { delete f.request.items[0].expectedBefore.templateKey; },
    f => { f.request.items[0].expectedBefore.problemTypeKey = "PT_OTHER"; },
    f => { f.request.items[0].parentAfter.subUnitKey = "M1-05-OTHER"; },
    f => { f.request.items[0].basicParent.L2 = "기본 도형"; },
    f => { delete f.request.difficultyRequestRef; },
    f => { write(f.root, D + "difficulty.json", { ...read(f.root, D + "difficulty.json"), rows: [] }); },
    f => { f.request.registryChanges = []; },
  ]) {
    const f = fixture(); mutate(f); const original = fs.readFileSync(path.join(f.root, META), "utf8");
    assert.throws(() => run(f, { write: true })); assert.equal(fs.readFileSync(path.join(f.root, META), "utf8"), original);
  }
});

test("refuses source payload drift, unsupported type promotion and missing exact binding", () => {
  const payloadDrift = fixture(); const qs = [payloadDrift.current, { id: 2 }]; qs[0] = { ...qs[0], solution: "unreviewed solution" };
  write(payloadDrift.root, `archive/exams/${SRC}`, bank(qs)); payloadDrift.request.expectedSourceBlobSha1 = git(payloadDrift.root, "hash-object", `archive/exams/${SRC}`);
  assert.throws(() => run(payloadDrift));
  const promote = fixture("KEEP_UNREGISTERED_TYPE"); promote.request.items[0].typeDisposition = "PRESERVE_APPROVED_TYPE";
  assert.throws(() => run(promote), /type preservation mismatch/);
  const noBinding = fixture("PRESERVE_APPROVED_TYPE"); write(noBinding.root, "archive/data/meta-foundation/canonical/packs/middle1/bindings.json", { bindings: [] });
  assert.throws(() => run(noBinding), /ACTIVE exact binding/);
});

test("projection refuses a tampered registered parent or preserved runtime", () => {
  for (const file of [META, RT]) {
    const f = fixture("PRESERVE_APPROVED_TYPE"); run(f, { write: true });
    const data = read(f.root, file); data.records[0].standardUnitKey = "M1-07"; write(f.root, file, data);
    assert.throws(() => run(f, { verifyProjection: true }), /registered projection drift/);
  }
});
