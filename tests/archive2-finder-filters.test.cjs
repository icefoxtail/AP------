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
  const rolloutYear = { 중1: 2025, 중2: 2026, 중3: 2027 }[
    exam.effectiveBrowseGrade
  ];
  if (!rolloutYear || !/^M[123]$/.test(codes.find((code) => /^M[123]$/.test(code)) || ""))
    return false;
  const sourceYear = Number(exam.year);
  return String(exam.year ?? "").trim() !== "" && Number.isInteger(sourceYear)
    ? curriculumKey === (sourceYear >= rolloutYear ? "2022" : "2015")
    : false;
};

test("actual catalog retains exact course intersections for every available grade", () => {
  for (const grade of grades) {
    const exams = catalog.exams.filter(
      (exam) => exam.effectiveBrowseGrade === grade,
    );
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

test("middle-school rollout assigns metadata-free exams to one curriculum by grade and year", () => {
  const middleExams = catalog.exams.filter((exam) =>
    /^중[123]$/.test(exam.effectiveBrowseGrade),
  );
  assert.ok(middleExams.length > 0);
  assert.ok(middleExams.every((exam) => !exam.curriculums?.length));
  const rolloutCases = [
    ["중1", 2024, "2015"],
    ["중1", 2025, "2022"],
    ["중2", 2025, "2015"],
    ["중2", 2026, "2022"],
    ["중3", 2026, "2015"],
    ["중3", 2027, "2022"],
  ];
  for (const [grade, year, curriculum] of rolloutCases)
    assert.equal(core.middleCurriculumFromYear(grade, year), curriculum);
  for (const exam of middleExams) {
    const expected = middleCurriculumFromYearForTest(exam);
    if (!expected) continue;
    assert.equal(
      core.finderMatches(exam, { curriculumKey: expected }, finderIndex),
      true,
      `${exam.file} must match ${expected}`,
    );
    assert.equal(
      core.finderMatches(
        exam,
        { curriculumKey: expected === "2015" ? "2022" : "2015" },
        finderIndex,
      ),
      false,
      `${exam.file} must not match the other curriculum`,
    );
  }
});

function middleCurriculumFromYearForTest(exam) {
  const rolloutYear = { 중1: 2025, 중2: 2026, 중3: 2027 }[
    exam.effectiveBrowseGrade
  ];
  if (
    !rolloutYear ||
    String(exam.year ?? "").trim() === "" ||
    !Number.isInteger(Number(exam.year))
  )
    return "";
  return Number(exam.year) >= rolloutYear ? "2022" : "2015";
}

test("actual M1-2 catalog rows split between 2015 and 2022 without overlap", () => {
  const middle1 = catalog.exams.filter(
    (exam) => exam.effectiveBrowseGrade === "중1",
  );
  const curriculum2015 = middle1.filter((exam) =>
    core.finderMatches(
      exam,
      { courseKey: "M1-2", curriculumKey: "2015" },
      finderIndex,
    ),
  );
  const curriculum2022 = middle1.filter((exam) =>
    core.finderMatches(
      exam,
      { courseKey: "M1-2", curriculumKey: "2022" },
      finderIndex,
    ),
  );
  assert.ok(curriculum2015.some((exam) => Number(exam.year) <= 2024));
  assert.ok(curriculum2022.some((exam) => Number(exam.year) >= 2025));
  assert.ok(curriculum2015.every((exam) => Number(exam.year) <= 2024));
  assert.ok(curriculum2022.every((exam) => Number(exam.year) >= 2025));
  assert.equal(
    new Set(files(curriculum2015).filter((file) => files(curriculum2022).includes(file))).size,
    0,
  );
});

test("direct middle-school curriculum metadata overrides rollout fallback", () => {
  const exam = {
    file: "middle-direct-metadata.js",
    effectiveBrowseGrade: "중1",
    year: 2025,
    curriculums: ["2015"],
    courseRanges: [
      {
        courseCode: "M1",
        rangeStartUnitKey: "M1-05",
        rangeEndUnitKey: "M1-08",
      },
    ],
  };
  const index = core.buildFinderIndex({
    taxonomy: [
      { curriculumKey: "2015", courseKey: "M1-2" },
      { curriculumKey: "2022", courseKey: "M1-2" },
    ],
    exams: [exam],
    records: [],
  });
  assert.equal(core.finderMatches(exam, { curriculumKey: "2015" }, index), true);
  assert.equal(core.finderMatches(exam, { curriculumKey: "2022" }, index), false);
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
    false,
  );
  assert.equal(
    core.finderMatches(exams[1], { curriculumKey: "2022" }, index),
    false,
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

test("stale URL filter state is reconciled after parsing", () => {
  const staleUrl = new URL(
    "https://example.test/archive/workspace.html?view=find&grade=%EC%A4%911&courseKey=M3-2",
  );
  const parsed = Object.fromEntries(
    ["grade", "curriculumKey", "courseKey"].flatMap((key) =>
      staleUrl.searchParams.has(key)
        ? [[key, staleUrl.searchParams.get(key)]]
        : [],
    ),
  );
  assert.deepEqual(
    core.reconcileFinderFilters(parsed, catalog.taxonomy),
    { grade: "중1", courseKey: "" },
  );
});

test("workspace readUrl and popstate paths reconcile parsed Finder state", () => {
  const workspace = fs.readFileSync("archive/archive2-workspace.js", "utf8");
  assert.match(
    workspace,
    /state\.find,\s*C\.reconcileFinderFilters\(state\.find, state\.catalog\.taxonomy\)/s,
  );
  assert.match(workspace, /history\.replaceState\(null, "", url\)/);
  assert.match(workspace, /window\.addEventListener\("popstate"/);
});
