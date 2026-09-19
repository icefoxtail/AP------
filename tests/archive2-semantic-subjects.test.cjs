const assert = require("assert");
const fs = require("fs");
const path = require("path");
const C = require("../archive/archive2-core.js");

assert.deepStrictEqual(C.highSemanticSubjectOptions("고2"), [
  { value: "ALGEBRA", label: "대수" },
  { value: "CALCULUS", label: "미적분Ⅰ" },
  { value: "PROB_STATS", label: "확률과 통계" },
]);
assert.deepStrictEqual(C.highSemanticSubjectOptions("고3"), [
  { value: "CALCULUS_ADVANCED", label: "미적분Ⅱ" },
  { value: "GEOMETRY", label: "기하" },
]);

assert.strictEqual(C.highSemanticSubjectForCourseKey("대수"), "ALGEBRA");
assert.strictEqual(C.highSemanticSubjectForCourseKey("수학Ⅰ"), "ALGEBRA");
assert.strictEqual(C.highSemanticSubjectForCourseKey("미적분Ⅰ"), "CALCULUS");
assert.strictEqual(C.highSemanticSubjectForCourseKey("수학Ⅱ"), "CALCULUS");
assert.strictEqual(C.highSemanticSubjectForCourseKey("미적분Ⅱ"), "CALCULUS_ADVANCED");
assert.strictEqual(C.highSemanticSubjectForCourseKey("미적분"), "CALCULUS_ADVANCED");
assert.strictEqual(C.highSemanticSubjectForCourseKey("기하와 벡터"), "GEOMETRY");

assert.strictEqual(C.highSemanticSubjectAllowed("고2", "ALGEBRA"), true);
assert.strictEqual(C.highSemanticSubjectAllowed("고2", "GEOMETRY"), false);
assert.strictEqual(C.highSemanticSubjectAllowed("고3", "GEOMETRY"), true);
assert.strictEqual(C.highSemanticSubjectAllowed("고3", "CALCULUS"), false);

let filters = C.reconcileFinderFilters({ grade: "고2", courseKey: "수학Ⅰ" }, []);
assert.strictEqual(filters.semanticSubject, "ALGEBRA");
assert.strictEqual(filters.courseKey, "");

filters = C.reconcileFinderFilters({ grade: "고2", courseKey: "수학Ⅱ" }, []);
assert.strictEqual(filters.semanticSubject, "CALCULUS");

filters = C.reconcileFinderFilters({ grade: "고3", courseKey: "미적분" }, []);
assert.strictEqual(filters.semanticSubject, "CALCULUS_ADVANCED");

filters = C.reconcileFinderFilters({ grade: "고2", semanticSubject: "GEOMETRY" }, []);
assert.strictEqual(filters.semanticSubject, "");

filters = C.reconcileFinderFilters({ grade: "고3", semanticSubject: "ALGEBRA" }, []);
assert.strictEqual(filters.semanticSubject, "");

const baseRecord = {
  effectiveBrowseGrade: "고2",
  courseKey: "수학II",
  curriculumKey: "2015",
  courseFamilies: ["CALCULUS"],
};
assert.strictEqual(C.matches(baseRecord, { grade: "고2", semanticSubject: "CALCULUS" }), true);
assert.strictEqual(C.matches(baseRecord, { grade: "고3", semanticSubject: "CALCULUS" }), false);

const workspace = fs.readFileSync(path.join(__dirname, "../archive/archive2-workspace.js"), "utf8");
assert(workspace.includes("C.highSemanticSubjectOptions(filters.grade)"));
assert(workspace.includes("고2·고3은 과목을 먼저 선택하세요."));
assert(/function findExams\(\)[\s\S]*isHighSemanticSubjectGrade\?\.\(f\.grade\)[\s\S]*!f\.semanticSubject[\s\S]*return \[\]/.test(workspace));

console.log("PASS Archive2 high-school semantic subject grade gate");
