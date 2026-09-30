import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import core from "../archive/archive2-core.js";

const require = createRequire(import.meta.url);
let canonical = {};
try {
  canonical = require("../archive/archive2-canonical.js");
} catch {
  // Keep the red test behavioral: the missing API is asserted below.
}

const file = "original/middle/m2/1final/25_test_중2.js";
const uid = "qid_v1_" + "a".repeat(64);
const canonicalAuthority = () => ({
  taxonomyVersion: "taxonomy-sha256",
  examGradeByFile: { [file]: "중2" },
  identityByUid: {
    [uid]: {
      questionUid: uid,
      sourceArchiveFile: file,
      sourceOrdinal: 1,
      status: "VERIFIED",
    },
  },
  gradeCourses: [{ grade: "중2", curriculumKey: "2022", courseKey: "M2-1" }],
  canonicalParents: [{
    grade: "중2",
    curriculumKey: "2022",
    courseKey: "M2-1",
    L1: "일차방정식",
    L2: "일차방정식의 풀이",
  }],
  assignmentsByUid: {
    [uid]: [{
      questionUid: uid,
      sourceFile: file,
      sourceOrdinal: 1,
      sourceFingerprint: "assignment-fingerprint",
      assignmentFingerprint: "assignment-fingerprint",
      grade: "중2",
      curriculumKey: "2022",
      courseKey: "M2-1",
      L1: "일차방정식",
      L2: "일차방정식의 풀이",
      approvalStatus: "APPROVED",
      taxonomyVersion: "taxonomy-sha256",
      reviewEvidence: {
        status: "PASS",
        reference: "archive/data/evidence/review-q1.json",
        sha256: "b".repeat(64),
      },
    }],
  },
  advancedAssignmentsByUid: {},
});

const record = (patch = {}) => ({
  questionUid: uid,
  sourceFile: file,
  sourceOrdinal: 1,
  sourceGrade: "중2",
  effectiveBrowseGrade: "고1",
  identityStatus: "VERIFIED",
  sourceStatus: "VERIFIED",
  sourceIntegrityStatus: "VERIFIED",
  sourceFingerprint: "full-source-fingerprint",
  assignmentFingerprint: "assignment-fingerprint",
  curriculumKey: "2022",
  courseKey: "M2-1",
  L1: "일차방정식",
  L2: "일차방정식의 풀이",
  taxonomyStatus: "UNKNOWN",
  basicTaxonomyStatus: "CONFIRMED",
  l1l2ParentValid: false,
  curriculumApplicability: "DEFAULT_SCOPE",
  reviewStatus: "reviewed_pass",
  ...patch,
});

test("source grade comes from the registered exam and exact source identity/path", () => {
  assert.equal(typeof canonical.resolveSourceGrade, "function");
  assert.deepEqual(canonical.resolveSourceGrade({
    registeredGrade: "중2",
    sourceFile: file,
    identitySourceFile: file,
  }), { grade: "중2", status: "VALID", reason: "" });
});

test("conflicting and unresolved grade evidence fail closed", () => {
  assert.equal(typeof canonical.resolveSourceGrade, "function");
  const conflict = canonical.resolveSourceGrade({
    registeredGrade: "고1",
    sourceFile: file,
    identitySourceFile: file,
  });
  assert.equal(conflict.status, "SOURCE_GRADE_CONFLICT");
  const unresolved = canonical.resolveSourceGrade({
    registeredGrade: "",
    sourceFile: "original/unknown/test.js",
    identitySourceFile: "original/unknown/test.js",
  });
  assert.equal(unresolved.status, "SOURCE_GRADE_UNRESOLVED");
});

test("assignment fingerprint changes with problem content, choices, and image, not answer or solution", async () => {
  assert.equal(typeof canonical.assignmentFingerprint, "function");
  const base = { content: "문항", choices: ["1", "2"], image: "assets/q1.png", answer: "1", solution: "풀이" };
  const baseFingerprint = await canonical.assignmentFingerprint(base);
  assert.equal(await canonical.assignmentFingerprint({ ...base, answer: "2", solution: "새 풀이" }), baseFingerprint);
  assert.notEqual(await canonical.assignmentFingerprint({ ...base, content: "수정 문항" }), baseFingerprint);
  assert.notEqual(await canonical.assignmentFingerprint({ ...base, choices: ["1", "3"] }), baseFingerprint);
  assert.notEqual(await canonical.assignmentFingerprint({ ...base, image: "assets/q2.png" }), baseFingerprint);
});

test("BASIC requires verified identity, current assignment evidence, and exact canonical membership", () => {
  assert.equal(typeof canonical.validateBasicAssignment, "function");
  const authority = canonicalAuthority();
  const result = canonical.validateBasicAssignment(record(), authority);
  assert.equal(result.ok, true);
  assert.deepEqual(result.parent, {
    grade: "중2",
    curriculumKey: "2022",
    courseKey: "M2-1",
    L1: "일차방정식",
    L2: "일차방정식의 풀이",
  });

  const missingEvidence = canonicalAuthority();
  missingEvidence.assignmentsByUid[uid][0].reviewEvidence = null;
  assert.equal(canonical.validateBasicAssignment(record(), missingEvidence).ok, false);

  const wrongParent = canonicalAuthority();
  wrongParent.canonicalParents = [];
  assert.equal(canonical.validateBasicAssignment(record(), wrongParent).ok, false);
  assert.equal(canonical.validateBasicAssignment(
    record({ sourceFingerprint: "updated-answer-solution-only-full-hash" }),
    authority,
  ).ok, true);
});

test("BASIC ignores stored parent booleans and stale optional metadata status, but retains source-quality holds", () => {
  const authority = canonicalAuthority();
  assert.equal(core.basicEligibility(record({ l1l2ParentValid: false }), { canonicalAuthority: authority }).ok, true);
  assert.equal(core.basicEligibility(record({ basicTaxonomyStatus: "HOLD" }), { canonicalAuthority: authority }).ok, true);
  assert.equal(core.basicEligibility(record({ l1l2ParentValid: true }), {}).ok, false);
  assert.equal(core.basicEligibility(record({
    sourceStatus: "HOLD",
    sourceIntegrityStatus: "VERIFIED",
  }), { canonicalAuthority: authority }).ok, true);
  assert.equal(core.basicEligibility(record({
    sourceQualityDisposition: "SOURCE_BLOCKED",
  }), { canonicalAuthority: authority }).ok, false);
});

test("an invalid advanced parent removes only advanced capability", () => {
  assert.equal(typeof canonical.validateAdvancedAssignment, "function");
  const invalidAdvanced = record({
    L3: "잘못된 RPM 개념",
    L4: "다른 parent의 leaf",
  });
  const authority = canonicalAuthority();
  assert.equal(canonical.validateBasicAssignment(invalidAdvanced, authority).ok, true);
  assert.equal(canonical.validateAdvancedAssignment(invalidAdvanced, authority).ok, false);
});
