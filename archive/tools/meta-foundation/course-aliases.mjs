// Course-name relations for the type-judgment lane: which course names are the same course, and which are the same subject in
// the 2015 and 2022 curricula. The data is archive/data/meta-foundation/course-aliases.v1.json (append-only, evidence per group);
// nothing is hard-coded here. A missing file means "no aliases": only whitespace-insensitive equality remains.
import fs from "node:fs";
import path from "node:path";

export const COURSE_ALIASES_PATH = "archive/data/meta-foundation/course-aliases.v1.json";
const GRADE_ORDER = ["중1", "중2", "중3", "고1", "고2", "고3"];
// The grade of an exam from its folder (original|similar|types/middle|high/m1..h3) and its year from the file's "NN_" prefix.
export function examFolderInfo(file) {
  const text = String(file ?? "").replace(/\\/g, "/");
  const m = /(?:^|\/)(?:original|similar|types)\/(?:middle|high)\/([mh])([123])\//.exec(text);
  const y = /(?:^|\/)(\d{2})_/.exec(text);
  return { grade: m ? GRADE_ORDER[(m[1] === "h" ? 3 : 0) + Number(m[2]) - 1] : "", year: y ? 2000 + Number(y[1]) : 0 };
}
const compact = value => String(value ?? "").normalize("NFC").replace(/\s/g, "");

export function makeCourseAliases(doc = null) {
  const spelling = new Map(); // compact member -> group
  for (const group of doc?.spellingGroups || []) for (const member of group.members) spelling.set(compact(member), group);
  const canonical = value => { const g = spelling.get(compact(value)); return g ? compact(g.members[0]) : compact(value); };
  const successor = [];
  for (const group of doc?.successorGroups || []) {
    const sides = Object.entries(group.curricula || {}).map(([curriculum, courses]) => ({ curriculum, courses: new Set(courses.map(canonical)) }));
    successor.push({ id: group.id, sides });
  }
  const moves = doc?.courseMoves || [];
  return {
    loaded: Boolean(doc),
    // The course (spelling) group id of a name, or "" when the name is in no group.
    groupOf: value => spelling.get(compact(value))?.id || "",
    // The grade a course name belongs to (group.grade, e.g. "중2", "고1"), or "" when the name is in no group.
    gradeOf: value => spelling.get(compact(value))?.grade || "",
    // "same": equal up to whitespace; "alias": another spelling of the same course; "successor": the same subject in the other
    // curriculum (2015 <-> 2022); "": no relation (different course or grade, or unknown).
    relation(a, b) {
      if (!compact(a) || !compact(b)) return "";
      if (compact(a) === compact(b)) return "same";
      const ca = canonical(a), cb = canonical(b);
      if (ca === cb) return "alias";
      for (const group of successor) {
        const sideA = group.sides.findIndex(s => s.courses.has(ca)), sideB = group.sides.findIndex(s => s.courses.has(cb));
        if (sideA >= 0 && sideB >= 0 && sideA !== sideB) return "successor";
      }
      return "";
    },
    // "reach": the key's course grade is at or below max(row course grade, exam folder grade), or a listed move (courseMoves) says
    // that unit sat in the exam's grade when the exam was taken. Never a key of a higher grade than the exam: that key is wrong or
    // needs a same-grade key. Rows without a known grade (no alias data) get "". The check is only about the course; whether the key
    // fits the question is the judgment's job. opts: { sourceArchiveFile, problemTypeKey }.
    reach(rowCourse, bindingCourse, { sourceArchiveFile = "", problemTypeKey = "" } = {}) {
      const key = GRADE_ORDER.indexOf(spelling.get(compact(bindingCourse))?.grade);
      const exam = examFolderInfo(sourceArchiveFile);
      const ceiling = Math.max(GRADE_ORDER.indexOf(spelling.get(compact(rowCourse))?.grade), GRADE_ORDER.indexOf(exam.grade));
      if (key < 0 || ceiling < 0) return "";
      if (key <= ceiling) return "reach";
      return moves.some(m => m.problemTypeKeys?.includes(problemTypeKey) && m.rowGrades?.includes(GRADE_ORDER[ceiling]) &&
        m.bindingGrades?.includes(GRADE_ORDER[key]) && exam.year > 0 && exam.year <= m.maxExamYear) ? "reach" : "";
    }
  };
}
export function loadCourseAliases(root) {
  const file = path.join(root, COURSE_ALIASES_PATH);
  return makeCourseAliases(fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null);
}
