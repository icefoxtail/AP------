const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const core = require("../archive/archive2-core.js");
const Similar = require("../archive/archive2-similar.js");

const original = (file, school, extra = {}) => ({
  file: `original/${file}.js`, identityTitle: file, contentType: "기출", school, grade: "고1", year: 2025,
  semester: "1", examType: "mid", subject: "공통수학1", qCount: 22, ...extra,
});
const similar = (file, school, extra = {}) => ({
  file: `similar/${file}.js`, identityTitle: file, contentType: "유형", school, grade: "고1", year: 2025,
  semester: "1", examType: "mid", subject: "공통수학1", qCount: 23, ...extra,
});
const filesOf = (sets) => sets.map((exam) => exam.file);

test("a set named <original title>_유사 belongs to that original, whatever else is true of the fields", () => {
  const a = original("25_가나고_1학기_중간_고1_공통수학1", "가나고");
  const b = original("25_가나고_1학기_중간_고1_공통수학2", "가나고", { subject: "공통수학2" });
  const set = similar("25_가나고_1학기_중간_고1_공통수학2_유사", "가나고", { subject: "공통수학2" });
  const pairs = Similar.pairSimilarSets([a, b, set]);
  assert.equal(pairs.originalFileFor(set.file), b.file);
  assert.deepEqual(filesOf(pairs.setsFor(b.file)), [set.file]);
  assert.deepEqual(pairs.setsFor(a.file), []);
  assert.equal(pairs.ruleBySimilar.get(set.file), "name");
});

test("the name rule is used before the five fields and survives a missing year", () => {
  const a = original("25_가나고_1학기_중간_고1", "가나고");
  const set = similar("25_가나고_1학기_중간_고1_유사1", "가나고", { year: "" });
  const pairs = Similar.pairSimilarSets([a, set]);
  assert.equal(pairs.originalFileFor(set.file), a.file);
  assert.equal(pairs.ruleBySimilar.get(set.file), "name");
});

test("one original with the same school, grade, year, semester and exam kind is enough", () => {
  const a = original("a", "가나고");
  const set = similar("something_else", "가나고");
  const pairs = Similar.pairSimilarSets([a, set]);
  assert.equal(pairs.originalFileFor(set.file), a.file);
  assert.equal(pairs.ruleBySimilar.get(set.file), "exam");
  assert.equal(pairs.stats.linked, 1);
  assert.equal(pairs.stats.unlinked, 0);
});

test("a spaced or two-digit way of writing the same fields still matches", () => {
  const a = original("a", "가나 고", { year: 2025, semester: 1 });
  const set = similar("b", "가나고", { year: "25", semester: "1" });
  const pairs = Similar.pairSimilarSets([a, set]);
  assert.equal(pairs.originalFileFor(set.file), a.file);
});

test("several originals with the same fields are told apart by the subject", () => {
  const a = original("a", "가나고", { subject: "대수" });
  const b = original("b", "가나고", { subject: "기하" });
  const set = similar("s", "가나고", { subject: "기하" });
  const pairs = Similar.pairSimilarSets([a, b, set]);
  assert.equal(pairs.originalFileFor(set.file), b.file);
  assert.equal(pairs.ruleBySimilar.get(set.file), "subject");
});

test("anything still ambiguous stays unlinked, with a reason", () => {
  const a = original("a", "가나고", { subject: "대수" });
  const b = original("b", "가나고", { subject: "기하" });
  const noSubject = similar("s1", "가나고", { subject: "" });
  const unknownSubject = similar("s2", "가나고", { subject: "미적분" });
  const twins = [original("t1", "다라고", { subject: "대수" }), original("t2", "다라고", { subject: "대수" })];
  const twinSet = similar("s3", "다라고", { subject: "대수" });
  const pairs = Similar.pairSimilarSets([a, b, noSubject, unknownSubject, ...twins, twinSet]);
  for (const set of [noSubject, unknownSubject, twinSet]) {
    assert.equal(pairs.originalFileFor(set.file), null, set.file);
    assert.ok(pairs.unlinked.some((row) => row.exam.file === set.file && row.reason), set.file);
  }
  assert.equal(pairs.stats.linked, 0);
  assert.equal(pairs.stats.unlinked, 3);
});

test("a set is never linked to another school, grade, year, semester or exam kind", () => {
  const a = original("a", "가나고");
  const others = [
    similar("school", "다라고"),
    similar("grade", "가나고", { grade: "고2" }),
    similar("year", "가나고", { year: 2024 }),
    similar("semester", "가나고", { semester: "2" }),
    similar("kind", "가나고", { examType: "final" }),
  ];
  const pairs = Similar.pairSimilarSets([a, ...others]);
  for (const set of others) assert.equal(pairs.originalFileFor(set.file), null, set.file);
  assert.deepEqual(pairs.setsFor(a.file), []);
  // The name rule does not override a field that says otherwise either.
  const named = similar("a_유사", "다라고");
  const namedPairs = Similar.pairSimilarSets([a, named]);
  assert.equal(namedPairs.originalFileFor(named.file), null);
});

test("two courses that are certainly different are not linked even when they are the only exam of that day", () => {
  const a = original("a", "가나고", { subject: "대수" });
  const set = similar("s", "가나고", { subject: "기하" });
  assert.equal(Similar.pairSimilarSets([a, set]).originalFileFor(set.file), null);
  // Free-text labels are not compared ("수학" vs "중1 수학", "기출c" vs "공통수학1").
  const free = Similar.pairSimilarSets([original("x", "마바중", { subject: "수학" }), similar("y", "마바중", { subject: "중1 수학" })]);
  assert.equal(free.stats.linked, 1);
});

test("a set belongs to one original; an original keeps its sets in file order", () => {
  const a = original("a", "가나고");
  const sets = [similar("a_유사2", "가나고"), similar("a_유사", "가나고"), similar("a_유사10", "가나고")];
  const pairs = Similar.pairSimilarSets([a, ...sets]);
  assert.deepEqual(filesOf(pairs.setsFor(a.file)), ["similar/a_유사.js", "similar/a_유사2.js", "similar/a_유사10.js"]);
  const owners = new Map();
  for (const [file, list] of pairs.similarByOriginal) for (const set of list) {
    assert.ok(!owners.has(set.file), `${set.file} is on two originals`);
    owners.set(set.file, file);
  }
  assert.equal(owners.size, 3);
});

test("unit tests inside the similar folder and non-original exams are not similar sets or originals", () => {
  const unit = { ...similar("unit", ""), contentType: "단원평가" };
  const a = original("a", "가나고");
  const textbook = { ...original("book", "가나고"), file: "textbooks/book.js", contentType: "교과서" };
  const pairs = Similar.pairSimilarSets([unit, a, textbook]);
  assert.equal(pairs.stats.sets, 0);
  assert.equal(pairs.setsFor(textbook.file).length, 0);
});

test("pairsFor computes once per catalog and tolerates a missing catalog", () => {
  const exams = [original("a", "가나고"), similar("a_유사", "가나고")];
  const catalog = { exams };
  assert.equal(Similar.pairsFor(catalog), Similar.pairsFor(catalog));
  assert.deepEqual(Similar.pairsFor(null).setsFor("x"), []);
  assert.deepEqual(Similar.pairsFor({}).unlinked, []);
});

// ---- The real catalog: defects, not counts (the data grows every day) --------------------------
const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync("archive/data/archive2-catalog.json")));
const byFile = new Map(catalog.exams.map((exam) => [exam.file, exam]));

test("real catalog: every linked pair agrees on school, grade, year, semester and exam kind", () => {
  const pairs = Similar.pairSimilarSets(catalog.exams);
  assert.ok(pairs.stats.linked > 0, "no pair at all");
  assert.ok(pairs.stats.originalsWithSimilar > 0);
  for (const [setFile, originalFile] of pairs.originalBySimilar) {
    if (!originalFile) continue;
    const set = Similar.identityOf(byFile.get(setFile));
    const exam = Similar.identityOf(byFile.get(originalFile));
    for (const field of ["school", "grade", "year", "semester", "examType"]) {
      // A set may lack a field (the name rule then decides); a field that is there must agree.
      if (set[field]) assert.equal(set[field], exam[field], `${setFile} vs ${originalFile}: ${field}`);
    }
    assert.equal(byFile.get(originalFile).contentType, "기출", originalFile);
  }
});

test("real catalog: a similar set is on at most one original and every set is either linked or listed", () => {
  const pairs = Similar.pairSimilarSets(catalog.exams);
  const seen = new Set();
  for (const sets of pairs.similarByOriginal.values())
    for (const set of sets) {
      assert.ok(!seen.has(set.file), `${set.file} is on two originals`);
      seen.add(set.file);
    }
  assert.equal(seen.size, pairs.stats.linked);
  assert.equal(pairs.stats.linked + pairs.stats.unlinked, pairs.stats.sets);
  assert.ok(pairs.unlinked.every((row) => row.reason && pairs.originalFileFor(row.exam.file) === null));
  const similarFolder = catalog.exams.filter(Similar.isSimilarSet).length;
  assert.equal(pairs.stats.sets, similarFolder);
});

test("real catalog: the pairing is computed once and is cheap", () => {
  const started = Date.now();
  const pairs = Similar.pairsFor(catalog);
  assert.equal(Similar.pairsFor(catalog), pairs);
  assert.ok(Date.now() - started < 2000, "pairing took too long");
});
