// Course-name relations for the type-judgment lane: which course names are the same course, and which are the same subject in
// the 2015 and 2022 curricula. The data is archive/data/meta-foundation/course-aliases.v1.json (append-only, evidence per group);
// nothing is hard-coded here. A missing file means "no aliases": only whitespace-insensitive equality remains.
import fs from "node:fs";
import path from "node:path";

export const COURSE_ALIASES_PATH = "archive/data/meta-foundation/course-aliases.v1.json";
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
    }
  };
}
export function loadCourseAliases(root) {
  const file = path.join(root, COURSE_ALIASES_PATH);
  return makeCourseAliases(fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null);
}
