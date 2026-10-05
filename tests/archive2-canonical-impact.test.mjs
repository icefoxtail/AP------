import assert from "node:assert/strict";
import { test } from "node:test";
import core from "../archive/archive2-core.js";
import { createImpactReport, serializeImpactReport } from "../archive/tools/report-archive2-canonical-impact.mjs";

const sha = char => char.repeat(64);
function fixtureRecord(questionUid, grade, sourceFile, sourceOrdinal, extra = {}) {
  const middle = grade.slice(-1);
  const courseKey = `M${middle}-1`;
  return {
    questionUid,
    sourceFile,
    sourceOrdinal,
    sourceGrade: grade,
    sourceGradeStatus: "VALID",
    effectiveBrowseGrade: grade,
    identityStatus: "VERIFIED",
    sourceStatus: "VERIFIED",
    sourceIntegrityStatus: "VERIFIED",
    sourceFingerprint: sha("a"),
    assignmentFingerprint: sha("b"),
    curriculumKey: "2022",
    courseKey,
    L1: "정수와 유리수",
    L2: "정수와 유리수",
    curriculumApplicability: "DEFAULT_SCOPE",
    defaultSelectable: true,
    ...extra,
  };
}
function authorityFor(records) {
  const assignmentsByUid = {};
  const examGradeByFile = {};
  const identityByUid = {};
  const gradeCourses = [];
  const canonicalParents = [];
  for (const row of records) {
    examGradeByFile[row.sourceFile] = row.sourceGrade;
    identityByUid[row.questionUid] = {
      questionUid: row.questionUid,
      sourceArchiveFile: row.sourceFile,
      sourceOrdinal: row.sourceOrdinal,
      status: "VERIFIED",
    };
    const parent = {
      grade: row.sourceGrade,
      curriculumKey: row.curriculumKey,
      courseKey: row.courseKey,
      L1: row.L1,
      L2: row.L2,
    };
    gradeCourses.push({ grade: row.sourceGrade, curriculumKey: row.curriculumKey, courseKey: row.courseKey });
    canonicalParents.push(parent);
    if (!row.__missingAssignment) {
      assignmentsByUid[row.questionUid] = [{
        store: row.__store || "question_metadata+basic_scope_parent_links",
        ...parent,
        questionUid: row.questionUid,
        sourceFile: row.sourceFile,
        sourceOrdinal: row.sourceOrdinal,
        sourceFingerprint: row.assignmentFingerprint,
        assignmentFingerprint: row.assignmentFingerprint,
        approvalStatus: "APPROVED",
        taxonomyVersion: "test-taxonomy",
        reviewEvidence: {
          status: "PASS",
          reference: "tests/archive2-canonical-impact.test.mjs",
          sha256: sha("c"),
          ...(row.__store === "approved_item_override" ? {
            runtimeEvidenceReference: "tests/archive2-canonical-impact.test.mjs",
            runtimeEvidenceSha: sha("d"),
          } : {}),
        },
      }];
    }
  }
  return { taxonomyVersion: "test-taxonomy", assignmentsByUid, examGradeByFile, identityByUid, gradeCourses, canonicalParents };
}

test("impact totals de-duplicate repeated UID rows and distinguish overlapping from primary reasons", () => {
  const valid = fixtureRecord("qid_v1_" + "1".repeat(64), "중1", "original/middle/m1/1mid/a.js", 1);
  const gradeConflict = fixtureRecord("qid_v1_" + "2".repeat(64), "중2", "original/middle/m1/1mid/b.js", 1);
  const held = fixtureRecord("qid_v1_" + "3".repeat(64), "중1", "original/middle/m1/1mid/c.js", 1, {
    __missingAssignment: true,
    reviewStatus: "HOLD",
    unverifiedTaxonomy: { courseKey: "M1-1", L1: "정수와 유리수", L2: "정수와 유리수" },
  });
  const override = fixtureRecord("qid_v1_" + "4".repeat(64), "중1", "original/middle/m1/1mid/d.js", 1, {
    __store: "approved_item_override",
  });
  const records = [valid, gradeConflict, held, override].map(row => {
    const { __missingAssignment, __store, ...clean } = row;
    return clean;
  });
  const authority = authorityFor([valid, gradeConflict, held, override]);
  authority.examGradeByFile[gradeConflict.sourceFile] = "중2";
  const sourceRows = [valid, valid, gradeConflict, held, override].map(row => ({
    questionUid: row.questionUid,
    sourceFile: row.sourceFile,
    sourceOrdinal: row.sourceOrdinal,
    sourceGrade: row.sourceGrade,
    rawDirectCanonicalAssignment: false,
    rawLegacyTaxonomyHint: true,
  }));
  const builtRecords = [
    { ...records[0], assignmentEvidence: { approvalStatus: "APPROVED" } },
    records[1],
    { ...records[2], unverifiedTaxonomy: { courseKey: "M1-1", L1: "정수와 유리수", L2: "정수와 유리수" } },
    records[3],
  ];
  const report = createImpactReport({
    sourceRows,
    builtCatalog: { records: builtRecords },
    finalCatalog: { records, canonicalAuthority: authority, indexVersion: "test-projection" },
    generatedAt: "2026-09-30T00:00:00.000Z",
  });

  assert.equal(report.totals.uniqueRawSourceUids, 4);
  assert.equal(report.totals.rawDuplicateUidRows, 1);
  assert.equal(report.totals.eligibleBasicUids, 2);
  assert.equal(report.totals.excludedBasicUids, 2);
  assert.equal(report.totals.primaryReasonTotal, 2);
  assert.equal(Object.values(report.primaryExclusionReasonCounts).reduce((a, b) => a + b, 0), 2);
  assert.equal(report.overlappingExclusionReasonCounts.source_grade, 1);
  assert.equal(report.overlappingExclusionReasonCounts.assignment_evidence, 2);
  assert.equal(report.overlappingExclusionReasonCounts.review_hold, 1);
  const artifact = serializeImpactReport(report);
  assert.equal(artifact.uidAttributionFields[0], "rawSourcePresent");
  assert.match(artifact.uidAttributionByUid[valid.questionUid], /^1\t1\t1\t/);
});

test("entry-stage attribution uses final approved item overrides even when the builder has no assignment evidence", () => {
  const builder = fixtureRecord("qid_v1_" + "5".repeat(64), "중1", "original/middle/m1/1mid/e.js", 1);
  const override = fixtureRecord("qid_v1_" + "6".repeat(64), "중1", "original/middle/m1/1mid/f.js", 1, {
    __store: "approved_item_override",
  });
  const records = [builder, override].map(({ __store, ...row }) => row);
  const report = createImpactReport({
    sourceRows: records.map(row => ({ ...row, rawDirectCanonicalAssignment: false })),
    builtCatalog: { records: [{ ...records[0], assignmentEvidence: {} }, records[1]] },
    finalCatalog: { records, canonicalAuthority: authorityFor([builder, override]), indexVersion: "test-projection" },
  });
  assert.equal(report.totals.eligibleBasicUids, 2);
  assert.equal(report.assignmentEntryStageCounts.catalog_builder_assignment_evidence, 1);
  assert.equal(report.assignmentEntryStageCounts.reviewed_runtime_item_override, 1);
  assert.equal(report.uidAttribution.find(row => row.questionUid === override.questionUid).assignmentStore, "approved_item_override");
});

test("the report counts selectable and advanced records from the final projection, not the base catalog flag", () => {
  const row = fixtureRecord("qid_v1_" + "7".repeat(64), "중1", "original/middle/m1/1mid/g.js", 1);
  const clean = { ...row };
  const finalCatalog = { records: [clean], canonicalAuthority: authorityFor([row]), indexVersion: "final" };
  const report = createImpactReport({
    sourceRows: [{ questionUid: row.questionUid, sourceFile: row.sourceFile, sourceOrdinal: 1 }],
    builtCatalog: { records: [{ ...clean, automatic: false }] },
    finalCatalog,
  });
  assert.equal(report.totals.eligibleBasicUids, 1);
  assert.equal(report.totals.eligibleAdvancedUids, 0);
  assert.equal(report.totals.excludedBasicUids, 0);
});
