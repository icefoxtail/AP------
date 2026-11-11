const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../archive/archive2-core.js");
const canonical = require("../archive/archive2-canonical.js");
const source = require("../archive/archive2-source.js");
const root = path.resolve(__dirname, "..");
const catalog = core.decodeCatalog(
  JSON.parse(
    fs.readFileSync(path.join(root, "archive/data/archive2-catalog.json")),
  ),
);
const base = catalog.records.find((r) => r.automatic);
const record = (n) => ({
  ...base,
  sourceOrdinal: n,
  assignmentFingerprint: "c".repeat(64),
  questionUid:
    "qid_v1_" +
    crypto
      .createHash("sha256")
      .update(base.sourceFile + "#" + n)
      .digest("hex"),
});
function canonicalAuthority(records) {
  const taxonomyVersion = "test-taxonomy-v1";
  const authority = {
    taxonomyVersion,
    examGradeByFile: {},
    identityByUid: {},
    gradeCourses: [],
    canonicalParents: [],
    assignmentsByUid: {},
    advancedAssignmentsByUid: {},
    projectionPolicy: {
      schemaVersion: "archive2-canonical-projection-policy-v1",
      version: "test",
      canonicalMasterSha256: taxonomyVersion,
      gradeCourseAllowlist: [],
      high1CompatibilityProjections: [],
      high23SharedSubjects: [],
    },
  };
  for (const row of records) {
    const grade = row.sourceGrade;
    authority.examGradeByFile[row.sourceFile] = grade;
    authority.identityByUid[row.questionUid] = {
      questionUid: row.questionUid,
      sourceArchiveFile: row.sourceFile,
      sourceOrdinal: row.sourceOrdinal,
      status: "VERIFIED",
    };
    const gradeCourse = { grade, curriculumKey: row.curriculumKey, courseKey: row.courseKey };
    if (!authority.gradeCourses.some(x => JSON.stringify(x) === JSON.stringify(gradeCourse)))
      authority.gradeCourses.push(gradeCourse);
    if (!authority.projectionPolicy.gradeCourseAllowlist.some(x => JSON.stringify(x) === JSON.stringify(gradeCourse)))
      authority.projectionPolicy.gradeCourseAllowlist.push(gradeCourse);
    const parent = {
      grade,
      curriculumKey: row.curriculumKey,
      courseKey: row.courseKey,
      L1: row.L1,
      L2: row.L2,
    };
    if (!authority.canonicalParents.some(x => JSON.stringify(x) === JSON.stringify(parent)))
      authority.canonicalParents.push(parent);
    authority.assignmentsByUid[row.questionUid] = [{
      questionUid: row.questionUid,
      sourceFile: row.sourceFile,
      sourceOrdinal: row.sourceOrdinal,
      sourceFingerprint: row.assignmentFingerprint,
      assignmentFingerprint: row.assignmentFingerprint,
      ...parent,
      approvalStatus: "APPROVED",
      taxonomyVersion: authority.taxonomyVersion,
      reviewEvidence: {
        status: "PASS",
        reference: "tests/archive2-core.test.cjs",
        sha256: "d".repeat(64),
      },
    }];
    if (row.sourceGrade === "고1" && row.curriculumKey === "2015") {
      const unitKey = row.legacyStandardUnitKey || row.standardUnitKey;
      const projectionKey = unitKey === "H15-SA-09" ? "COMMON_MATH_2"
        : unitKey === "H15-SB-06" ? "COMMON_MATH_1" : "";
      if (projectionKey) {
        const targetCourse = projectionKey === "COMMON_MATH_1" ? "공통수학1" : "공통수학2";
        const targetGradeCourse = { grade: "고1", curriculumKey: "2022", courseKey: targetCourse };
        if (!authority.projectionPolicy.gradeCourseAllowlist.some(x => JSON.stringify(x) === JSON.stringify(targetGradeCourse)))
          authority.projectionPolicy.gradeCourseAllowlist.push(targetGradeCourse);
        authority.projectionPolicy.high1CompatibilityProjections.push({
        sourceGrade: "고1",
        sourceCurriculumKey: "2015",
        sourceCourseKey: row.courseKey,
        sourceUnitKey: unitKey,
        projectionKey,
        targetCurriculumKey: "2022",
        targetCourseKey: targetCourse,
        approvalStatus: "APPROVED",
        taxonomyVersion,
        evidenceReference: "tests/archive2-core.test.cjs",
        evidenceSha256: "e".repeat(64),
        });
      }
    }
  }
  return authority;
}
const request = (rows, records = [base]) => ({
  filters: {
    grade: base.sourceGrade,
    curriculumKey: base.curriculumKey,
    courseKey: base.courseKey,
  },
  rows,
  seed: "teacher-test",
  canonicalAuthority: canonicalAuthority(records),
});

test("BASIC preserves explicit quality holds while optional difficulty remains a filter", () => {
  const eligibleBase = record(base.sourceOrdinal);
  const authority = canonicalAuthority([eligibleBase]);
  assert.ok(base && core.eligibility(eligibleBase, { canonicalAuthority: authority }).ok);
  for (const change of [
    { reviewStatus: "HOLD" },
    {
      curriculumApplicability: "RPM_EXTENDED_CANDIDATE",
      defaultSelectable: false,
    },
    { identityStatus: "UNRESOLVED" },
    { sourceStatus: "HOLD", sourceIntegrityStatus: "HOLD" },
    { sourceStatus: "HOLD", sourceIntegrityStatus: "VERIFIED" },
  ])
    assert.equal(core.eligibility({ ...eligibleBase, ...change }, { canonicalAuthority: authority }).ok, false);
  // Difficulty words are never converted to a number: without an integer bucket the record
  // stays selectable but cannot satisfy a difficulty filter (no estimation).
  for (const change of [{ difficultyBucket: "중" }, { difficultyBucket: "UNKNOWN" }]) {
    const record = { ...eligibleBase, ...change };
    assert.equal(core.eligibility(record, { canonicalAuthority: authority }).ok, true);
    assert.equal(core.difficultyEligible(record), false);
    assert.equal(core.matches(record, { difficultyBuckets: [1, 2, 3, 4, 5] }, { canonicalAuthority: authority }), false);
  }
  // Auxiliary labels are not gates: an integer bucket with BORDERLINE_REVIEW (or missing labels)
  // is usable in strict and general mode alike.
  for (const change of [
    { legacyLevelCompatibility: "BORDERLINE_REVIEW" },
    { legacyLevelCompatibility: undefined, difficultyConfidence: undefined, difficultyBoundaryFlag: undefined },
  ]) {
    const record = { ...eligibleBase, difficultyBucket: 3, ...change };
    assert.equal(core.difficultyEligible(record), true);
    assert.equal(core.matches(record, { difficultyBuckets: [3] }, { canonicalAuthority: authority }), true);
    assert.equal(core.matches(record, { difficultyBuckets: [3] }, { canonicalAuthority: authority, useMode: "general" }), true);
  }
});
test("one difficulty lane: an integer bucket passes for every caller unless a real defect applies", () => {
  const baseline = record(base.sourceOrdinal);
  // Registered after the exam file changed only in its answer/solution (content binding): the values
  // still describe the question. No auxiliary labels, an unapproved source release and a conflict
  // marker (registered value differs from the exam file's inline value) are labels, not gates.
  const labelsOnly = {
    ...baseline, difficultyBucket: 3, difficultyConfidence: undefined,
    difficultyBoundaryFlag: undefined, legacyLevelCompatibility: undefined,
    sourceStatus: "HOLD", metaBinding: "content", metadataConflicts: ["difficultyBucket"],
  };
  const opts = { useMode: "general" };
  const target = { difficultyBuckets: [3] };
  assert.equal(core.generalUseEligibility(labelsOnly).ok, true);
  assert.equal(core.difficultyEligible(labelsOnly), true);
  assert.equal(core.difficultyEligible(labelsOnly, opts), true);
  for (const options of [undefined, opts]) {
    assert.equal(core.matches(labelsOnly, target, options), true);
    assert.equal(core.rowMatches(labelsOnly, target, options), true);
    assert.equal(core.matches(labelsOnly, { difficultyBuckets: [2] }, options), false);
  }
  assert.equal(core.difficultyEligible({ ...labelsOnly, sourceStatus: "VERIFIED", metaBinding: "exact" }), true);
  // Real defects: the recorded value no longer describes this question's text (no binding and not
  // the verified source), a word or non-integer instead of a bucket (no conversion), a broken
  // identity or source reference.
  const textChanged = { ...labelsOnly, metaBinding: "" };
  for (const options of [undefined, opts]) {
    assert.equal(core.difficultyEligible(textChanged, options), false);
    assert.equal(core.matches(textChanged, target, options), false);
    assert.equal(core.rowMatches(textChanged, target, options), false);
  }
  for (const value of ["UNKNOWN", null, "3", "중", 0, 6, 2.5]) {
    for (const options of [undefined, opts])
      assert.equal(core.matches({ ...labelsOnly, difficultyBucket: value }, target, options), false);
  }
  assert.equal(core.generalUseEligibility({ ...labelsOnly, sourceIntegrityStatus: "MISMATCH" }).ok, false);
  assert.equal(core.difficultyEligible({ ...labelsOnly, sourceIntegrityStatus: "MISMATCH" }), false);
  assert.equal(core.difficultyEligible({ ...labelsOnly, identityStatus: "UNRESOLVED" }), false);
  assert.equal(core.difficultyEligible({ ...labelsOnly, sourceFingerprint: "" }), false);
});

test("pin and rebuild retain pins and student/series exclusion; no silent shortage relaxation", () => {
  const pool = Array.from({ length: 20 }, (_, i) => record(i + 1));
  const req = request([{ id: "a", count: 10 }], pool);
  req.pins = [{ questionUid: pool[0].questionUid, rowId: "a" }];
  const context = {
    student: [pool[1].questionUid],
    series: [pool[2].questionUid],
  };
  const result = core.selectBlueprint(pool, req, context);
  assert.equal(result.ok, true);
  assert.equal(result.selected.length, 10);
  assert.ok(result.selected.some((r) => r.questionUid === pool[0].questionUid));
  assert.equal(core.review(result.selected, req, context).status, "WARN");
  assert.deepEqual(
    result.selected.map((r) => r.questionUid),
    core.selectBlueprint(pool, req, context).selected.map((r) => r.questionUid),
  );
  const shortage = core.selectBlueprint(pool.slice(0, 10), req, context);
  assert.equal(shortage.ok, false);
  assert.equal(shortage.shortages[0].shortage, 2);
  assert.equal(
    core.review(result.selected, req, {
      student: [result.selected[0].questionUid],
    }).status,
    "HARD_BLOCK",
  );
});
test("canonical path scope and source grade remain hard filters", () => {
  const lower = { ...base, sourceGrade: "고2", effectiveBrowseGrade: "고2" };
  assert.equal(core.matches(lower, { grade: "고1" }), false);
  assert.notEqual(
    core.pathKey({ ...base, curriculumKey: "2015" }),
    core.pathKey({ ...base, curriculumKey: "2022" }),
  );
});
test("grade-only plans accept a merged set of canonical paths", () => {
  const paths = [core.pathKey(base, 4), core.pathKey({ ...base, curriculumKey: "2015" }, 4)];
  const req = {
    filters: { grade: base.sourceGrade, primaryPaths: paths },
    rows: [{ id: "merged", count: 1, paths }],
  };
  assert.deepEqual(core.validatePlan(req), []);
  assert.equal(core.rowMatches(base, req.rows[0]), true);
});
test("recency policy (2026-11-10): the newest year always first, unknown years last", () => {
  const rank = (year, current) => core.recencyRank(year, current);
  assert.ok(rank(2026) < rank(2025) && rank(2025) < rank(2024) && rank(2024) < rank(2023));
  assert.ok(rank(2026) < rank(2015), "the newest year precedes every older year");
  assert.ok(rank(2015) < rank(undefined) && rank(2015) < rank(0) && rank(2015) < rank("x"));
  assert.equal(rank(0), rank(null));
  assert.equal(rank(1800), rank(undefined));
  assert.doesNotMatch(core.RECENCY_POLICY.order, /올해 자료는 그다음/);
  assert.deepEqual(core.sortYearsByRecency([2026, 2023, 0, 2025, 2024, 2021]), [2026, 2025, 2024, 2023, 2021, 0]);
  // New school years keep arriving: a year newer than the configured constant still sorts first
  // and precedes unknown years, so a stale constant never hides newer data.
  assert.ok(rank(2027) < rank(2026) && rank(2027) < rank(undefined));
  assert.deepEqual(core.sortYearsByRecency([2026, 2028, 2027, 2025]), [2028, 2027, 2026, 2025]);
  assert.deepEqual([{ year: 2026 }, { year: undefined }, { year: 2025 }, { year: 2023 }].sort(core.compareRecency).map(r => r.year),
    [2026, 2025, 2023, undefined]);
  // Browsing lists keep the plain calendar order.
  assert.deepEqual([{ year: 2025 }, { year: 2026 }].sort(core.compareNewest).map(r => r.year), [2026, 2025]);
});
test("the newest years fill each row first, independent of input order and seed", () => {
  const pool = [2021, 2025, 2026, 2025, 2026, undefined].map((year, i) => ({ ...record(i + 1), year }));
  for (const seed of ['one', 'two', 'three']) {
    const req = { ...request([{ id: 'a', count: 4 }], pool), seed };
    const result = core.selectBlueprint([...pool].reverse(), req);
    assert.equal(result.ok, true);
    assert.deepEqual(result.selected.map(r => r.year), [2026, 2026, 2025, 2025]);
    const all = core.selectBlueprint(pool, { ...req, rows: [{ id: 'a', count: 6 }] });
    assert.deepEqual(all.selected.map(r => r.year), [2026, 2026, 2025, 2025, 2021, undefined]);
    const two = core.selectBlueprint(pool, { ...req, rows: [{ id: 'a', count: 2 }] });
    assert.deepEqual(two.selected.map(r => r.year), [2026, 2026]);
  }
});
test("latest-first keeps year/source restrictions, pins, difficulty and history authoritative", () => {
  const pool = [2021, 2025, 2026, 2025, 2026].map((year, i) => ({ ...record(i + 1), year, sourceFile: base.sourceFile.replace(/\.js$/, `-${i}.js`) }));
  const req = request([{ id: 'a', count: 3 }], pool);
  pool[4].reviewStatus = 'HOLD';
  req.pins = [{ questionUid: pool[0].questionUid, rowId: 'a' }];
  const result = core.selectBlueprint(pool, req, { student: [pool[2].questionUid] });
  assert.deepEqual(result.selected.map(r => r.year), [2025, 2025, 2021]);
  const rangedRequest = request([{ id: 'a', count: 2 }], pool);
  const ranged = core.selectBlueprint(pool, { ...rangedRequest, filters: { ...req.filters, yearFrom: 2025, yearTo: 2025 } });
  assert.equal(ranged.ok, true);
  assert.deepEqual(ranged.selected.map(r => r.year), [2025, 2025]);
  const sourceOnly = core.selectBlueprint(pool, { ...req, rows: [{ id:'a',count:1 }], filters: { ...req.filters, sourceFiles:[pool[0].sourceFile] } });
  assert.equal(sourceOnly.selected[0].year,2021);
  assert.equal(core.matches({...pool[0],year:undefined},{yearTo:2025}),false);
});
test("two source files with equal lexical declarations load independently and ordinal is authoritative", () => {
  const a = source.evaluate(
    "const local = 1; window.questionBank = [{id: 1, content: local}, {id: 1, content: 2}];",
    "a.js",
  );
  const b = source.evaluate(
    "const local = 3; window.questions = [{id: 1, content: local}];",
    "b.js",
  );
  assert.equal(a[1].content, 2);
  assert.equal(b[0].content, 3);
});
test("raw catalog records cannot bypass the resolved canonical authority with stored flags", () => {
  const ids = new Set();
  for (const r of catalog.records.filter((r) => r.automatic)) {
    assert.equal(core.eligibility({ ...r, l1l2ParentValid: true }).ok, false);
    assert.ok(!ids.has(r.questionUid));
    ids.add(r.questionUid);
    assert.equal(r.sourceIntegrityStatus, "VERIFIED");
    assert.match(r.sourceFingerprint, /^[a-f0-9]{64}$/);
  }
  assert.ok(ids.size > 0);
  assert.equal(catalog.health.questions, catalog.records.length);
});
test("grade-aware subject projection keeps high semantic API stable and gives high1 exactly two user-facing subjects", () => {
  assert.equal(core.isHighSemanticSubjectGrade("고1"), false);
  assert.equal(core.isHighSemanticSubjectGrade("고2"), true);
  assert.equal(core.isHighSemanticSubjectGrade("고3"), true);
  assert.equal(core.hasSubjectProjection("중3"), false);
  assert.equal(core.hasSubjectProjection("고1"), true);
  assert.deepEqual(
    core.subjectProjectionOptions("고1").map((item) => item.label),
    ["공통수학1", "공통수학2", "수학(상)", "수학(하)"],
  );
  assert.deepEqual(
    core.subjectProjectionOptions("고2"),
    core.highSemanticSubjectOptions(),
  );
});

test("high1 projection uses exact allowlisted curriculum equivalences and native 2015 course groups", () => {
  const authority = canonicalAuthority([
    { ...record(1), sourceGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", legacyStandardUnitKey: "H15-SA-09" },
    { ...record(2), sourceGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", legacyStandardUnitKey: "H15-SA-10" },
  ]);
  const policy = authority.projectionPolicy;
  assert.equal(core.subjectProjectionForRecord({
    sourceGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", legacyStandardUnitKey: "H15-SA-09",
  }, "고1", policy), "COMMON_MATH_2");
  assert.equal(core.subjectProjectionForRecord({
    sourceGrade: "고1", effectiveBrowseGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", legacyStandardUnitKey: "H15-SA-10",
  }, "고1", policy), "H1_2015_MATH_UP");
  assert.equal(core.subjectProjectionForRecord({
    sourceGrade: "중3", effectiveBrowseGrade: "고1", legacyStandardUnitKey: "M3-04",
  }, "고1", policy), "");
  assert.equal(core.subjectProjectionForRecord({
    sourceGrade: "고1", curriculumKey: "2015", legacyStandardUnitKey: "RAW-legacy",
  }, "고1", policy), "");
  assert.equal(
    core.subjectProjectionForRecord({
      sourceGrade: "고1",
      effectiveBrowseGrade: "고1",
      curriculumKey: "2022",
      courseKey: "공통수학1",
    }, "고1", { ...policy, gradeCourseAllowlist: policy.gradeCourseAllowlist.concat({ grade:"고1",curriculumKey:"2022",courseKey:"공통수학1" }) }),
    "COMMON_MATH_1",
  );
  assert.equal(
    core.subjectProjectionForRecord({
      sourceGrade: "고1",
      effectiveBrowseGrade: "고1",
      curriculumKey: "2022",
      courseKey: "공통수학2",
    }, "고1", { ...policy, gradeCourseAllowlist: policy.gradeCourseAllowlist.concat({ grade:"고1",curriculumKey:"2022",courseKey:"공통수학2" }) }),
    "COMMON_MATH_2",
  );
});

test("unapproved legacy, RAW, label, and source-grade projections stay unavailable", () => {
  const policy = { canonicalMasterSha256: "x", gradeCourseAllowlist: [], high1CompatibilityProjections: [], high23SharedSubjects: [] };
  for (const row of [
    { sourceGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", legacyStandardUnitKey: "RAW-다항식" },
    { sourceGrade: "중3", effectiveBrowseGrade: "고1", courseKey: "수학(상)", legacyStandardUnitKey: "M3-04" },
    { effectiveBrowseGrade: "고1", courseKey: "수학(상)", legacyStandardUnitKey: "H15-SA-01" },
  ]) assert.equal(core.subjectProjectionForRecord(row, "고1", policy), "");
});

test("user-facing subject label resolver is nonblank only when a real subject is selected", () => {
  assert.equal(
    core.subjectProjectionLabel({ grade: "고1", semanticSubject: "COMMON_MATH_1" }),
    "공통수학1",
  );
  assert.equal(
    core.subjectProjectionLabel({ grade: "고2", semanticSubject: "ALGEBRA" }),
    "대수",
  );
  assert.equal(
    core.subjectProjectionLabel({ grade: "고3", semanticSubject: "CALCULUS_ADVANCED" }),
    "미적분Ⅱ",
  );
  assert.equal(core.subjectProjectionLabel({ grade: "중2", courseKey: "M2-1" }), "M2-1");
  assert.equal(core.subjectProjectionLabel({ grade: "고1" }), "");
});

test("blueprint and review consume the same high1 subject projection filter", () => {
  const make = (n, legacyStandardUnitKey) => ({
    questionUid: "qid_v1_" + String(n).padStart(64, "0"),
    identityStatus: "VERIFIED",
    sourceStatus: "VERIFIED",
    sourceIntegrityStatus: "VERIFIED",
    taxonomyStatus: "CONFIRMED",
    gradeConflict: false,
    reviewStatus: "reviewed_pass",
    difficultyBucket: 2,
    difficultyConfidence: "high",
    difficultyBoundaryFlag: "NONE",
    legacyLevelCompatibility: "NORMAL",
    curriculumApplicability: "DEFAULT_SCOPE",
    defaultSelectable: true,
    metadataConflicts: [],
    sourceFile: `original/high/h1/test-${n}.js`,
    sourceOrdinal: n,
    sourceQuestionNo: String(n),
    sourceGrade: "고1",
    effectiveBrowseGrade: "고1",
    curriculumKey: "2015",
    courseKey: legacyStandardUnitKey.startsWith("H15-SA") ? "수학(상)" : "수학(하)",
    legacyStandardUnitKey,
    L1: "공통수학",
    L2: "교차 경계 테스트",
    L3: "L3",
    L4: "L4",
    school: "테스트고",
    year: 2025,
  });
  const common2 = make(1, "H15-SA-09");
  const common1 = make(2, "H15-SB-06");
  common2.sourceFingerprint = "source-1";
  common1.sourceFingerprint = "source-2";
  common2.assignmentFingerprint = "assignment-1";
  common1.assignmentFingerprint = "assignment-2";
  const path = core.pathKey(common2, 4);
  const authority = canonicalAuthority([common1, common2]);
  const req = {
    filters: {
      grade: "고1",
      curriculumKey: "2015",
      semanticSubject: "COMMON_MATH_2",
      primaryPaths: [path],
    },
    rows: [{ id: "a", count: 1, paths: [path] }],
    seed: "projection-test",
    canonicalAuthority: authority,
  };
  const result = core.selectBlueprint([common1, common2], req);
  assert.equal(result.ok, true);
  assert.deepEqual(result.selected.map((r) => r.questionUid), [common2.questionUid]);
  assert.equal(core.review(result.selected, req).status, "PASS");
  assert.equal(core.review([{ ...common1, rowId: "a" }], req).status, "HARD_BLOCK");
});

test("high2 and high3 five-subject semantic mapping remains unchanged", () => {
  assert.deepEqual(
    core.HIGH_SEMANTIC_SUBJECTS.map(({ value, label }) => [value, label]),
    [
      ["ALGEBRA", "대수"],
      ["CALCULUS", "미적분Ⅰ"],
      ["PROB_STATS", "확률과 통계"],
      ["CALCULUS_ADVANCED", "미적분Ⅱ"],
      ["GEOMETRY", "기하"],
    ],
  );
  assert.equal(core.highSemanticSubjectForCourseKey("수학I"), "ALGEBRA");
  assert.equal(core.highSemanticSubjectForCourseKey("대수"), "ALGEBRA");
  assert.equal(core.highSemanticSubjectForCourseKey("수학II"), "CALCULUS");
  assert.equal(core.highSemanticSubjectForCourseKey("미적분Ⅰ"), "CALCULUS");
  assert.equal(core.highSemanticSubjectForCourseKey("미적분"), "CALCULUS_ADVANCED");
  assert.equal(core.highSemanticSubjectForCourseKey("기하와 벡터"), "GEOMETRY");
});
