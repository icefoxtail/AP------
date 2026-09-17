const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const core = require("../archive/archive2-core.js");

const catalog = core.decodeCatalog(
  JSON.parse(fs.readFileSync("archive/data/archive2-catalog.json")),
);
const finderIndex = core.buildFinderIndex(catalog);

const grades = ["중1", "중2", "중3", "고1", "고2", "고3"];
const taxonomyCourseKeys = (grade) => [
  ...core.finderCourseKeys(catalog.taxonomy, { grade }),
];
const files = (rows) => rows.map((exam) => exam.file);
const middleCourseKeysForRange = (range) => {
  const base = String(range.courseCode || "").match(/^M[123]$/)?.[0];
  const numbers = [range.rangeStartUnitKey, range.rangeEndUnitKey]
    .map((key) => String(key || "").match(/^M[123]-(\d{1,2})$/)?.[1])
    .filter(Boolean)
    .map(Number);
  if (!base || !numbers.length) return [];
  const first = Math.min(...numbers);
  const last = Math.max(...numbers);
  return [1, 2]
    .filter((semester) => {
      const start = semester === 1 ? 1 : 5;
      const end = semester === 1 ? 4 : 8;
      return first <= end && last >= start;
    })
    .map((semester) => `${base}-${semester}`);
};
const expectedCourseMatch = (exam, courseKey) =>
  (exam.courseRanges || []).some((range) =>
    middleCourseKeysForRange(range).includes(courseKey) ||
    core.normalizeCourseIdentity(range.standardCourse) ===
      core.normalizeCourseIdentity(courseKey),
  );
const expectedCurriculumMatch = (exam, curriculumKey) => {
  if (exam.curriculums?.length) return exam.curriculums.includes(curriculumKey);
  const codes = (exam.courseRanges || []).map((range) =>
    String(range.courseCode || ""),
  );
  const codeCurricula = new Set(
    codes
      .map((code) =>
        code.startsWith("H15") ? "2015" : code.startsWith("H22") ? "2022" : "",
      )
      .filter(Boolean),
  );
  if (codeCurricula.size) return codeCurricula.has(curriculumKey);
  return codes.some((code) =>
    /^M[123]$/.test(code) && ["2015", "2022"].includes(curriculumKey),
  );
};

test("actual catalog retains exact course intersections for every available grade", () => {
  const expectedGradeCounts = {
    중1: 61,
    중2: 65,
    중3: 80,
    고1: 143,
    고2: 113,
    고3: 0,
  };
  for (const grade of grades) {
    const exams = catalog.exams.filter(
      (exam) => exam.effectiveBrowseGrade === grade,
    );
    assert.equal(exams.length, expectedGradeCounts[grade], grade);
    for (const courseKey of taxonomyCourseKeys(grade)) {
      const expected = exams.filter((exam) => expectedCourseMatch(exam, courseKey));
      const actual = exams.filter((exam) =>
        core.finderMatches(exam, { courseKey }, finderIndex),
      );
      assert.deepEqual(files(actual), files(expected), `${grade} ${courseKey}`);
      for (const curriculumKey of ["2015", "2022"]) {
        assert.deepEqual(
          files(
            exams.filter((exam) =>
              core.finderMatches(
                exam,
                { courseKey, curriculumKey },
                finderIndex,
              ),
            ),
          ),
          files(
            expected.filter((exam) =>
              expectedCurriculumMatch(exam, curriculumKey),
            ),
          ),
          `${grade} ${courseKey} + ${curriculumKey}`,
        );
      }
    }
  }
});

test("middle-school catalog range keys normalize to canonical semester course identities", () => {
  const taxonomy = [
    { curriculumKey: "2015", courseKey: "M1-1" },
    { curriculumKey: "2015", courseKey: "M1-2" },
    { curriculumKey: "2022", courseKey: "M1-1" },
    { curriculumKey: "2022", courseKey: "M1-2" },
  ];
  const exams = [
    {
      file: "middle-first.js",
      courseRanges: [
        {
          courseCode: "M1",
          standardCourse: "중1 수학",
          rangeStartUnitKey: "M1-03",
          rangeEndUnitKey: "M1-04",
        },
      ],
      curriculums: [],
    },
    {
      file: "middle-second.js",
      courseRanges: [
        {
          courseCode: "M1",
          standardCourse: "중1 · 2학기",
          rangeStartUnitKey: "M1-05",
          rangeEndUnitKey: "M1-08",
        },
      ],
      curriculums: [],
    },
  ];
  const index = core.buildFinderIndex({ taxonomy, exams, records: [] });
  assert.equal(
    core.finderMatches(exams[0], { courseKey: "M1-1" }, index),
    true,
  );
  assert.equal(
    core.finderMatches(exams[0], { courseKey: "M1-2" }, index),
    false,
  );
  assert.equal(
    core.finderMatches(exams[1], { courseKey: "M1-2" }, index),
    true,
  );
  assert.equal(
    core.finderMatches(exams[1], { curriculumKey: "2015" }, index),
    true,
  );
  assert.equal(
    core.finderMatches(exams[1], { curriculumKey: "2022" }, index),
    true,
  );
});

test("high-school H15/H22 course codes provide curriculum identity when exam metadata is absent", () => {
  const taxonomy = [
    { curriculumKey: "2015", courseKey: "수학I" },
    { curriculumKey: "2022", courseKey: "대수" },
  ];
  const exams = [
    {
      file: "high-old.js",
      courseRanges: [
        { courseCode: "H15-M1", standardCourse: "수학I" },
      ],
      curriculums: [],
    },
    {
      file: "high-new.js",
      courseRanges: [{ courseCode: "H22-A", standardCourse: "대수" }],
      curriculums: [],
    },
  ];
  const index = core.buildFinderIndex({ taxonomy, exams, records: [] });
  assert.equal(
    core.finderMatches(exams[0], { courseKey: "수학I", curriculumKey: "2015" }, index),
    true,
  );
  assert.equal(
    core.finderMatches(exams[0], { curriculumKey: "2022" }, index),
    false,
  );
  assert.equal(
    core.finderMatches(exams[1], { courseKey: "대수", curriculumKey: "2022" }, index),
    true,
  );
  assert.equal(
    core.finderMatches(exams[1], { curriculumKey: "2015" }, index),
    false,
  );
});

test("grade/curriculum changes keep compatible courseKey and clear incompatible stale state", () => {
  assert.deepEqual(
    core.reconcileFinderFilters(
      { grade: "중3", curriculumKey: "2015", courseKey: "M3-2" },
      catalog.taxonomy,
    ),
    { grade: "중3", curriculumKey: "2015", courseKey: "M3-2" },
  );
  assert.equal(
    core.reconcileFinderFilters(
      { grade: "중1", curriculumKey: "2015", courseKey: "M3-2" },
      catalog.taxonomy,
    ).courseKey,
    "",
  );
  assert.equal(
    core.reconcileFinderFilters(
      { grade: "고1", curriculumKey: "2022", courseKey: "수학(상)" },
      catalog.taxonomy,
    ).courseKey,
    "",
  );
  assert.equal(
    core.reconcileFinderFilters(
      { grade: "중1", curriculumKey: "2022", courseKey: "M1-2" },
      catalog.taxonomy,
    ).courseKey,
    "M1-2",
  );
});
