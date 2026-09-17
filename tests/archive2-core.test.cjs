const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../archive/archive2-core.js");
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
  questionUid:
    "qid_v1_" +
    crypto
      .createHash("sha256")
      .update(base.sourceFile + "#" + n)
      .digest("hex"),
});
const request = (rows) => ({
  filters: {
    grade: base.sourceGrade,
    curriculumKey: base.curriculumKey,
    courseKey: base.courseKey,
  },
  rows,
  seed: "teacher-test",
});

test("canonical approval gates distinguish UNKNOWN, HOLD, extended candidate and pending recheck", () => {
  assert.ok(base && core.eligibility(base).ok);
  for (const change of [
    { difficultyBucket: "중" },
    { difficultyBucket: "UNKNOWN" },
    { reviewStatus: "HOLD" },
    { legacyLevelCompatibility: "BORDERLINE_REVIEW" },
    {
      curriculumApplicability: "RPM_EXTENDED_CANDIDATE",
      defaultSelectable: false,
    },
    { identityStatus: "UNRESOLVED" },
    { sourceStatus: "HOLD" },
  ])
    assert.equal(core.eligibility({ ...base, ...change }).ok, false);
});
test("pin and rebuild retain pins and student/series exclusion; no silent shortage relaxation", () => {
  const pool = Array.from({ length: 20 }, (_, i) => record(i + 1));
  const req = request([{ id: "a", count: 10 }]);
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
test("newest eligible years fill each row first, independent of input order and seed", () => {
  const pool = [2021, 2025, 2026, 2025, 2026, undefined].map((year, i) => ({ ...record(i + 1), year }));
  for (const seed of ['one', 'two', 'three']) {
    const req = { ...request([{ id: 'a', count: 4 }]), seed };
    const result = core.selectBlueprint([...pool].reverse(), req);
    assert.equal(result.ok, true);
    assert.deepEqual(result.selected.map(r => r.year), [2026, 2026, 2025, 2025]);
    const all = core.selectBlueprint(pool, { ...req, rows: [{ id: 'a', count: 6 }] });
    assert.deepEqual(all.selected.map(r => r.year), [2026, 2026, 2025, 2025, 2021, undefined]);
  }
});
test("latest-first keeps year/source restrictions, pins, difficulty and history authoritative", () => {
  const pool = [2021, 2025, 2026, 2025, 2026].map((year, i) => ({ ...record(i + 1), year, sourceFile: 'exam-' + i + '.js' }));
  pool[4].reviewStatus = 'HOLD';
  const req = request([{ id: 'a', count: 3 }]);
  req.pins = [{ questionUid: pool[0].questionUid, rowId: 'a' }];
  const result = core.selectBlueprint(pool, req, { student: [pool[2].questionUid] });
  assert.deepEqual(result.selected.map(r => r.year), [2025, 2025, 2021]);
  const ranged = core.selectBlueprint(pool, { ...request([{ id: 'a', count: 2 }]), filters: { ...req.filters, yearFrom: 2025, yearTo: 2025 } });
  assert.equal(ranged.ok, true);
  assert.deepEqual(ranged.selected.map(r => r.year), [2025, 2025]);
  const sourceOnly = core.selectBlueprint(pool, { ...request([{ id:'a',count:1 }]), filters: { ...req.filters, sourceFiles:[pool[0].sourceFile] } });
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
test("all selectable production records have canonical numeric metadata and registered identity", () => {
  const ids = new Set();
  for (const r of catalog.records.filter((r) => r.automatic)) {
    assert.equal(core.eligibility(r).ok, true);
    assert.ok(!ids.has(r.questionUid));
    ids.add(r.questionUid);
    assert.equal(r.sourceFingerprint, r.approvedSourceFingerprint);
  }
  assert.ok(ids.size > 0);
  assert.equal(catalog.health.questions, catalog.records.length);
});
