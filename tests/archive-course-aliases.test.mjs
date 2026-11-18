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
  assert.equal(a.relation("중학 수학", "중1 수학"), "", "a course name without a grade is not guessed");
  assert.equal(a.relation("", "중1 수학"), "");
});

test("without the data file only whitespace-insensitive equality remains", () => {
  const none = makeCourseAliases(null);
  assert.equal(none.loaded, false);
  assert.equal(none.relation("중3 수학", "중3수학"), "same");
  assert.equal(none.relation("중3 수학", "중3-1"), "");
});
