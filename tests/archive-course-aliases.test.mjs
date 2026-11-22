// Course alias data: spellings of one course and 2015<->2022 subject successors. The data must never join different grades.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { makeCourseAliases, COURSE_ALIASES_PATH } from "../archive/tools/meta-foundation/course-aliases.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const doc = JSON.parse(fs.readFileSync(path.join(repo, COURSE_ALIASES_PATH), "utf8"));
const compact = v => String(v).normalize("NFC").replace(/\s/g, "");
// Grade a spelling states by itself (middle school names carry the grade digit); high-school names carry none.
const statedMiddleGrade = name => {
  const n = compact(name).replace(/中/g, "중");
  const m = /^(?:중(?:학교)?([123])|M([123])(?:-|$)|중학교수학([123]))/.exec(n);
  return m ? `중${m[1] || m[2] || m[3]}` : "";
};

test("every group names its evidence and a grade; no spelling belongs to two groups", () => {
  assert.equal(doc.schemaVersion, "course-aliases-v1");
  const seen = new Map();
  for (const group of doc.spellingGroups) {
    assert.ok(group.id && group.grade && group.members.length && group.evidence?.length, `incomplete group ${group.id}`);
    for (const member of group.members) {
      assert.ok(!seen.has(compact(member)) || seen.get(compact(member)) === group.id, `${member} is in ${seen.get(compact(member))} and ${group.id}`);
      seen.set(compact(member), group.id);
    }
  }
  for (const group of doc.successorGroups) assert.ok(group.id && group.evidence?.length, `successor group ${group.id}`);
  for (const group of [...doc.spellingGroups, ...doc.successorGroups])
    for (const ref of group.evidence) {
      const file = /^([^\s:(]+)/.exec(ref)[1];
      if (/^archive\//.test(file)) assert.ok(fs.existsSync(path.join(repo, file)), `evidence file missing: ${file}`);
    }
});

test("courses of different grades are never in the same spelling group", () => {
  for (const group of doc.spellingGroups) {
    const stated = new Set(group.members.map(statedMiddleGrade).filter(Boolean));
    assert.ok(stated.size <= 1, `${group.id} mixes grades ${[...stated]}`);
    if (group.id.startsWith("MIDDLE")) assert.deepEqual([...stated], [group.grade], `${group.id} members must state grade ${group.grade}`);
    else assert.equal(stated.size, 0, `${group.id} is a high-school course group but a member states a middle-school grade`);
  }
  const aliases = makeCourseAliases(doc);
  assert.equal(aliases.relation("중2 수학", "중3 수학"), "");
  assert.equal(aliases.relation("중1 수학", "중2-1"), "");
  assert.equal(aliases.relation("중3-1", "공통수학1"), "");
  assert.equal(aliases.relation("수학I", "수학II"), "");
});

test("successor groups relate one 2015 course side to one 2022 course side of the same subject, high school only", () => {
  const aliases = makeCourseAliases(doc);
  for (const group of doc.successorGroups) {
    assert.deepEqual(Object.keys(group.curricula).sort(), ["2015", "2022"], group.id);
    const all = Object.values(group.curricula).flat();
    assert.ok(all.every(course => !statedMiddleGrade(course)), `${group.id} lists a middle-school course`);
    assert.equal(new Set(all.map(compact)).size, all.length, `${group.id} repeats a course`);
    for (const course of all) assert.ok(aliases.groupOf(course), `${course} has no spelling group`);
  }
  const seen = new Set();
  for (const course of doc.successorGroups.flatMap(g => Object.values(g.curricula).flat())) {
    assert.ok(!seen.has(compact(course)), `${course} is in two successor groups`);
    seen.add(compact(course));
  }
});

test("relation: same, alias, successor and everything else", () => {
  const a = makeCourseAliases(doc);
  assert.equal(a.relation("중3 수학", "중3 수학"), "same");
  assert.equal(a.relation("중3수학", "중3 수학"), "same");
  assert.equal(a.relation("중3 수학", "중3-1"), "alias");
  assert.equal(a.relation("중학교 2학년", "중2-1"), "alias");
  assert.equal(a.relation("수학Ⅰ", "수학I"), "alias");
  assert.equal(a.relation("미적분1", "미적분I"), "alias");
  assert.equal(a.relation("수학_상", "수학(상)"), "alias");
  assert.equal(a.relation("대수", "수학I"), "successor");
  assert.equal(a.relation("수학Ⅰ", "대수"), "successor");
  assert.equal(a.relation("미적분1", "수학II"), "successor");
  assert.equal(a.relation("수학(상)", "공통수학2"), "successor");
  assert.equal(a.relation("수학(상)", "수학(하)"), "", "same-curriculum sibling courses stay different");
  assert.equal(a.relation("공통수학1", "공통수학2"), "");
  assert.equal(a.relation("미적분", "미적분I"), "", "2015 미적분 corresponds to 2022 미적분II, not 미적분I");
  assert.equal(a.relation("미적분", "미적분II"), "successor");
  assert.equal(a.relation("중학교 수학", "중1 수학"), "", "a course name without a grade is not guessed");
  // "중학 수학" has no grade in its own text, but every one of its 221 metadata rows lies under middle/m1 (counted 2026-11-18): listed with that evidence.
  assert.equal(a.relation("중학 수학", "중1 수학"), "alias");
  assert.equal(a.relation("중학 수학", "중2 수학"), "");
  assert.equal(a.relation("", "중1 수학"), "");
});

test("without the data file only whitespace-insensitive equality remains", () => {
  const none = makeCourseAliases(null);
  assert.equal(none.loaded, false);
  assert.equal(none.relation("중3 수학", "중3수학"), "same");
  assert.equal(none.relation("중3 수학", "중3-1"), "");
});

// ---- reach: a key of a grade at or below the exam's (2026-11-19, user decision) ------------------------------------------------------
const M3 = "original/middle/m3/2mid/19_신흥중_2학기_중간_중3_수학.js";
const M2 = "original/middle/m2/1mid/23_가나중_1학기_중간_중2_기출.js";
const M1 = "original/middle/m1/1mid/23_가나중_1학기_중간_중1_기출.js";

test("reach: a key at or below the exam's grade is accepted (moved units, prerequisite content, wrong row course)", () => {
  const a = makeCourseAliases(doc);
  assert.equal(a.reach("중3", "중1 수학", { sourceArchiveFile: M3 }), "reach", "units that moved down to 중1 (central tendency)");
  assert.equal(a.reach("M3-2", "중2", { sourceArchiveFile: M3 }), "reach", "units that moved down to 중2 (Pythagorean)");
  assert.equal(a.reach("", "중2", { sourceArchiveFile: M3 }), "reach", "a row without a course is placed by its exam folder");
  assert.equal(a.reach("중3", "중3-1", { sourceArchiveFile: M3 }), "reach", "the same grade is inside the ceiling too");
  assert.equal(a.reach("수학(상)", "중3", { sourceArchiveFile: "original/high/h1/1mid/22_가나고_1학기_중간_고1_기출.js" }), "reach", "prerequisite 중3 content in a 고1 exam");
  assert.equal(a.reach("수학(상)", "수학II", { sourceArchiveFile: "original/high/h2/1mid/22_가나고_1학기_중간_고2_수학II.js" }), "reach", "a 고2 exam row filed under 수학(상)");
  assert.equal(a.reach("공통수학1", "중3", { sourceArchiveFile: M3 }), "reach", "a wrongly filed row course does not lower the ceiling below the exam grade");
  assert.equal(a.reach("중2", "중3", { sourceArchiveFile: M3 }), "reach", "the exam folder can lift the ceiling above the row's course");
});

test("reach: a key of a higher grade than the exam is never accepted", () => {
  const a = makeCourseAliases(doc);
  assert.equal(a.reach("중2", "공통수학1", { sourceArchiveFile: M2, problemTypeKey: "PT_H1_COUNTING_PRINCIPLE_GENERAL" }), "", "중2 exam, 고1 key");
  assert.equal(a.reach("중1", "수학(상)", { sourceArchiveFile: M1, problemTypeKey: "PT_H1_POLY_IDENTITY_COEFFICIENT" }), "", "중1 exam, 고1 key");
  assert.equal(a.reach("중1", "중2-1", { sourceArchiveFile: M1 }), "");
  assert.equal(a.reach("중3", "수학(상)", { sourceArchiveFile: M3, problemTypeKey: "PT_CIRCLE_EQUATION" }), "", "no courseMoves entry for this PT");
  assert.equal(a.reach("중1", "중2 수학", { sourceArchiveFile: "" }), "", "no exam folder: only the row course sets the ceiling");
  assert.equal(a.reach("", "중1 수학", { sourceArchiveFile: "" }), "", "no ceiling at all");
  assert.equal(a.reach("중3", "알수없는과정", { sourceArchiveFile: M3 }), "", "unknown key course");
});

test("reach: the listed move (좌표 거리·최단거리, 2009 개정 중3 → 2022 공통수학2) holds for the six real rows and stops after 2019", () => {
  const a = makeCourseAliases(doc);
  const rows = [["18_연향중_2학기_중간_중3_수학.js", "", "PT_COORD_DISTANCE"], ["18_연향중_2학기_중간_중3_수학.js", "", "PT_MOVE_REFLECTION_SHORTEST"],
    ["19_신흥중_2학기_중간_중3_수학.js", "중3", "PT_COORD_DISTANCE"], ["19_연향중_2학기_중간_중3_수학.js", "중3", "PT_COORD_DISTANCE"],
    ["19_이수중_2학기_중간_중3_수학.js", "중2", "PT_COORD_DISTANCE"], ["19_이수중_2학기_중간_중3_수학.js", "중2", "PT_MOVE_REFLECTION_SHORTEST"]];
  for (const [file, rowCourse, pt] of rows)
    for (const course of ["수학(상)", "공통수학2"]) assert.equal(a.reach(rowCourse, course, { sourceArchiveFile: `archive/exams/original/middle/m3/2mid/${file}`, problemTypeKey: pt }), "reach", `${file} ${pt} ${course}`);
  const later = "original/middle/m3/2mid/20_신흥중_2학기_중간_중3_수학.js";
  assert.equal(a.reach("중3", "공통수학2", { sourceArchiveFile: later, problemTypeKey: "PT_COORD_DISTANCE" }), "", "2020 and later: no move");
  assert.equal(a.reach("중3", "공통수학2", { sourceArchiveFile: M3, problemTypeKey: "PT_CIRCLE_EQUATION" }), "", "another PT: no move");
  assert.equal(a.reach("중2", "공통수학2", { sourceArchiveFile: "original/middle/m2/2mid/19_가나중_2학기_중간_중2_수학.js", problemTypeKey: "PT_COORD_DISTANCE" }), "", "a 중2 exam does not take the 중3 move");
  const moves = doc.courseMoves;
  assert.ok(moves.length >= 1);
  for (const m of moves) {
    assert.ok(m.id && m.problemTypeKeys?.length && m.rowGrades?.length && m.bindingGrades?.length && Number.isInteger(m.maxExamYear) && m.evidence?.length, `incomplete move ${m.id}`);
    for (const ref of m.evidence) assert.ok(fs.existsSync(path.join(repo, /^([^\s:(]+)/.exec(ref)[1])), `evidence file missing: ${ref}`);
  }
});

test("reach: relation() is unchanged by it, and without alias data nothing reaches", () => {
  const a = makeCourseAliases(doc);
  assert.equal(a.relation("중3 수학", "중1 수학"), "", "relation() still never joins grades");
  assert.equal(makeCourseAliases(null).reach("중3", "중1 수학", { sourceArchiveFile: M3 }), "");
});
