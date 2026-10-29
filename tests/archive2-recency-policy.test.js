const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../archive/archive2-core.js");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

// Recency policy (user decision 2026-10-29): one definition of the current year, used by
// 문제지 만들기, 단원별 기출 and the quick assessments.
test("the current exam year is defined once, in archive2-core", () => {
  assert.equal(Object.isFrozen(core.RECENCY_POLICY), true);
  assert.equal(Number.isInteger(core.RECENCY_POLICY.currentExamYear), true);
  assert.ok(core.RECENCY_POLICY.currentExamYear >= 2026);
  for (const file of ["archive/unit-past-exams-core.js", "archive/unit-past-exams.js", "archive/archive2-workspace.js",
    "archive/archive2-unified-units.js"])
    assert.doesNotMatch(read(file), /currentExamYear\s*[:=]\s*20\d\d/, `${file} must not redefine the current year`);
});

test("workspace quick assessments and compose text follow the recency order", () => {
  const workspace = read("archive/archive2-workspace.js");
  assert.match(workspace, /function recencyShuffle\(rows\)/);
  assert.match(workspace, /fiveMinuteShuffle\(rows\)\.sort\(C\.compareRecency\)/);
  // Every quick-assessment pool shuffle goes through the recency-aware shuffle.
  assert.equal((workspace.match(/fiveMinuteShuffle\(/g) || []).length, 2, "only the definition and recencyShuffle use the raw shuffle");
  assert.match(workspace, /quickRecencyTier\(record\) \* 10/);
  assert.doesNotMatch(workspace, /최신 연도 문항부터/);
  assert.match(workspace, /완결된 최근 연도부터\(2025년, 2024년, 2023년 순\) 선택하고, 올해 시험은 그다음/);
  assert.match(workspace, /data-year-distribution/);
});

test("unit-past-exams core shares the recency rank with archive2-core", () => {
  const unit = require("../archive/unit-past-exams-core.js");
  const record = (year) => ({ sourceFile: `original/high/h1/1mid/${year}_x.js`, examYear: year });
  const years = [2026, 2023, 2025, 2024, 2021];
  const sorted = years.map(record).sort(unit.compareRecords).map(unit.getExamYear);
  assert.deepEqual(sorted, [2025, 2024, 2023, 2021, 2026]);
  for (const year of years) assert.equal(unit.recencyRankOf(record(year)), core.recencyRank(year));
});
