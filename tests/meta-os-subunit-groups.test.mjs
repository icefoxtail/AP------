import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  BASES, KINDS, KIND_LABELS, RULES_PATH, TABLE_PATH, UNCLASSIFIED_UNIT, buildFromRepo, buildTable,
  isBroadKey, isProblemNumberKey, keyGradeMismatch, loadCanonicalKeys, loadMaster, loadUnitIndex, serializeTable, tableKeys,
} from "../archive/tools/meta-os/build-subunit-groups.mjs";

// The subunit group table says which canonical subUnitKey values are one 소단원 inside one unified unit. These tests
// check defect conditions (a key in two groups, a key that does not exist, a wrong kind of key in a group, a stale
// table), never an exact count of the operating data: new keys keep appearing and must stay legal.
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hasHangul = (value) => /[가-힣]/.test(String(value || ""));
const built = buildFromRepo(repo);
const { table } = built;
const master = loadMaster(repo);
const unitIndex = loadUnitIndex(repo);

test("the stored table is exactly what the rules, master table and unit list produce, and is LF with a final newline", () => {
  const raw = fs.readFileSync(path.join(repo, TABLE_PATH), "utf8");
  assert.ok(!raw.includes("\r"), "table must use LF");
  assert.ok(raw.endsWith("}\n"));
  assert.equal(raw, built.text);
  assert.equal(serializeTable(JSON.parse(raw)), raw, "serialization is stable");
});

test("the --check command passes on the stored table and tolerates canonical keys that are not in the table", () => {
  const run = spawnSync(process.execPath, ["archive/tools/meta-os/build-subunit-groups.mjs", "--check"], { cwd: repo, encoding: "utf8", maxBuffer: 1 << 26 });
  assert.equal(run.status, 0, run.stderr || run.stdout);
  assert.match(run.stdout, /SUBUNIT_GROUPS_OK/);
  const first = JSON.parse(run.stdout.split("\n")[0]);
  // Unlisted keys are only counted (they are their own group); they never fail the check.
  assert.equal(typeof first.unlistedCanonicalKeys, "number");
  assert.equal(first.listedKeysMissingFromCanonical, 0);
});

test("a key belongs to exactly one group per unified unit, and a group key is unique", () => {
  const groupKeys = new Set();
  for (const scope of table.scopes) {
    const seen = new Map();
    for (const group of scope.groups) {
      assert.ok(!groupKeys.has(group.groupKey), `duplicate groupKey ${group.groupKey}`);
      groupKeys.add(group.groupKey);
      assert.ok(group.groupKey.startsWith(`SG:${scope.subject}:${scope.unitKey}:`));
      for (const entry of group.keys) {
        assert.ok(!seen.has(entry.subUnitKey), `${scope.subject} ${scope.unitKey}: ${entry.subUnitKey} in ${seen.get(entry.subUnitKey)} and ${group.groupKey}`);
        seen.set(entry.subUnitKey, group.groupKey);
      }
    }
  }
});

test("every key in the table exists in the canonical metadata", () => {
  const canonical = loadCanonicalKeys(repo);
  const missing = [...tableKeys(table)].filter((key) => !canonical.has(key));
  assert.deepEqual(missing, []);
});

test("every scope is a real unified unit (or the unclassified scope) with the unit's own name", () => {
  for (const scope of table.scopes) {
    assert.ok(unitIndex.subjects.has(scope.subject), `unknown subject ${scope.subject}`);
    if (scope.unitKey === UNCLASSIFIED_UNIT) { assert.equal(scope.unitLabel, "단원 미분류"); continue; }
    assert.equal(unitIndex.units.get(`${scope.subject}|${scope.unitKey}`), scope.unitLabel, `${scope.subject} ${scope.unitKey}`);
  }
});

test("labels are never empty and are Korean: master names for subunits, fixed words for the other kinds", () => {
  for (const scope of table.scopes) for (const group of scope.groups) {
    assert.ok(KINDS.includes(group.kind));
    assert.ok(hasHangul(group.label), `${group.groupKey} label "${group.label}"`);
    if (group.kind === "subunit") assert.ok("labelReason" in group || [...group.keys].some((entry) => master.get(entry.subUnitKey) === group.label), `${group.groupKey} label is a master name or a recorded override`);
    else if (group.kind !== "moved") assert.equal(group.label, KIND_LABELS[group.kind]);
  }
});

test("two different subunit groups in one unit never show the same name", () => {
  for (const scope of table.scopes) {
    const names = new Map();
    for (const group of scope.groups.filter((candidate) => candidate.kind === "subunit")) {
      assert.ok(!names.has(group.label), `${scope.subject} ${scope.unitKey}: "${group.label}" is ${names.get(group.label)} and ${group.groupKey}`);
      names.set(group.label, group.groupKey);
    }
  }
});

test("unit_general, unit_other and excluded follow their rules", () => {
  for (const scope of table.scopes) {
    for (const kind of ["unit_general", "unit_other", "excluded"]) assert.ok(scope.groups.filter((group) => group.kind === kind).length <= 1, `${scope.unitKey} has more than one ${kind}`);
    for (const group of scope.groups) {
      const tag = group.groupKey.split(":").pop();
      if (group.kind === "unit_general") assert.equal(tag, "GENERAL");
      if (group.kind === "unit_other") assert.equal(tag, "OTHER");
      if (group.kind === "excluded") assert.equal(tag, "EXCLUDED");
      if (group.kind === "moved") assert.ok(group.groupKey.includes(":MOVED:"), group.groupKey);
      for (const entry of group.keys) {
        assert.ok(BASES.includes(entry.basis), `${entry.subUnitKey} basis ${entry.basis}`);
        assert.equal(typeof entry.reviewed, "boolean");
        // A question-number key is only ever excluded, and only question-number keys are.
        assert.equal(isProblemNumberKey(entry.subUnitKey), group.kind === "excluded", `${scope.unitKey} ${entry.subUnitKey} in ${group.kind}`);
        if (group.kind === "unit_other") {
          // An ad-hoc key (not in the master table), a broad key that came from another unit, or another unit's / grade's
          // master key that fits no 소단원 of this unit.
          if (master.has(entry.subUnitKey)) {
            assert.ok(["foreign_broad_key", "foreign_unit_key", "cross_grade_key"].includes(entry.basis), `${scope.unitKey} ${entry.subUnitKey} basis ${entry.basis}`);
            if (entry.basis === "foreign_broad_key") assert.ok(isBroadKey(entry.subUnitKey, master), `${entry.subUnitKey} is not a broad key`);
          } else assert.equal(entry.basis, "adhoc_to_other");
        }
        if (group.kind === "unit_general") assert.equal(entry.basis, "unit_general_key");
        if (group.kind === "excluded") assert.equal(entry.basis, "problem_number_key");
        if (group.kind === "moved") assert.ok(["moved_to_other_unit", "cross_grade_key"].includes(entry.basis), `${entry.subUnitKey} basis ${entry.basis}`);
      }
    }
    // The unclassified scope only marks question-number keys.
    if (scope.unitKey === UNCLASSIFIED_UNIT) assert.ok(scope.groups.every((group) => group.kind === "excluded"));
  }
});

test("a broad key (…-CORE or a master name ending in 핵심 개념) is never part of a subunit: only 단원 일반 or 기타", () => {
  for (const scope of table.scopes) for (const group of scope.groups) for (const entry of group.keys) {
    if (!isBroadKey(entry.subUnitKey, master)) continue;
    assert.ok(["unit_general", "unit_other", "moved"].includes(group.kind), `${scope.unitKey} ${entry.subUnitKey} is in ${group.kind}`);
    // Another unit's broad key is not this unit's general key: it only goes to 기타.
    if (group.kind === "unit_other") assert.equal(entry.basis, "foreign_broad_key");
  }
  assert.ok(master.get("H22-C-02-CORE").endsWith("핵심 개념"));
  // The name test must catch a label with a space (or none) before 개념, even when the key does not end in -CORE.
  const named = new Map([["X-1", "다면체 핵심 개념"], ["X-2", "다면체 핵심개념"], ["X-3", "다면체의 개념"]]);
  assert.deepEqual(["X-1", "X-2", "X-3"].map((key) => isBroadKey(key, named)), [true, true, false]);
  const place = (subject, unit) => table.scopes.find((scope) => scope.subject === subject && scope.unitKey === unit).groups.find((group) => group.keys.some((entry) => entry.subUnitKey === "H22-C-02-CORE"));
  assert.equal(place("COMMON_MATH_1", "H22-C-02").kind, "unit_general");
  // Another unit's broad key points at its own unit's 단원 일반 (moved) when the question is that unit's content, and
  // stays in 기타 when the stems show it really belongs to the unit it sits in.
  assert.equal(place("COMMON_MATH_1", "H22-C-01").kind, "moved");
  assert.equal(place("ALGEBRA", "H22-A-01").kind, "moved");
  assert.equal(table.scopes.find((scope) => scope.subject === "PROB_STATS" && scope.unitKey === "H22-PS-01").groups.find((group) => group.keys.some((entry) => entry.subUnitKey === "H22-PS-02-CORE")).kind, "unit_other");
});

test("a group name that replaces the master name carries a recorded reason, and the master name is never the broad key's", () => {
  const rules = JSON.parse(fs.readFileSync(path.join(repo, RULES_PATH), "utf8"));
  let overrides = 0;
  for (const scope of rules.scopes) for (const [key, override] of Object.entries(scope.labelOverrides || {})) {
    overrides++;
    assert.ok(hasHangul(override.label) && String(override.reason || "").length >= 10, `${scope.unitKey} ${key}`);
    const group = table.scopes.find((candidate) => candidate.subject === scope.subject && candidate.unitKey === scope.unitKey).groups.find((candidate) => candidate.groupKey.endsWith(`:${key}`));
    assert.equal(group.label, override.label);
    assert.equal(group.labelReason, override.reason);
  }
  assert.ok(overrides > 0);
  for (const scope of table.scopes) for (const group of scope.groups)
    if (!("labelReason" in group)) continue;
    else assert.equal(group.kind, "subunit");
});

test("a merged subunit starts with its master anchor; only a content-checked ad-hoc key may sit next to master keys", () => {
  for (const scope of table.scopes) for (const group of scope.groups.filter((candidate) => candidate.kind === "subunit")) {
    if (group.keys.length > 1) assert.equal(group.keys[0].basis, "anchor");
    else assert.ok(["standalone", "cross_grade_key"].includes(group.keys[0].basis));
    assert.ok(master.has(group.keys[0].subUnitKey), `${group.groupKey} anchor is a master key`);
    assert.ok(group.groupKey.endsWith(`:${group.keys[0].subUnitKey}`));
    for (const entry of group.keys.slice(1)) {
      if (!master.has(entry.subUnitKey)) assert.equal(entry.basis, "content_checked", `${group.groupKey} ${entry.subUnitKey}`);
      assert.equal(entry.reviewed, true, `${group.groupKey} ${entry.subUnitKey} was merged without a recorded reading`);
    }
  }
});

test("user decisions: 2015 and 2022 keys of a different scope stay apart (삼각함수 정의 vs 기본)", () => {
  const scope = table.scopes.find((candidate) => candidate.subject === "ALGEBRA" && candidate.unitKey === "H22-A-04");
  const groupOf = (key) => scope.groups.find((group) => group.keys.some((entry) => entry.subUnitKey === key));
  assert.notEqual(groupOf("H15-M1-05-TRIGONOMETRIC_DEFINITION").groupKey, groupOf("H22-A-04-TRIGONOMETRIC_BASIC").groupKey);
  // The same name and same slug in both curricula is one 소단원.
  assert.equal(groupOf("H22-A-04-TRIGONOMETRIC_GRAPH").groupKey, groupOf("H15-M1-06-TRIGONOMETRIC_GRAPH").groupKey);
});

test("user decisions: broad keys are never merged with the narrower keys of their unit", () => {
  for (const scope of table.scopes) {
    const general = scope.groups.find((group) => group.kind === "unit_general");
    if (!general) continue;
    for (const group of scope.groups.filter((candidate) => candidate.kind === "subunit"))
      for (const entry of group.keys) assert.ok(!general.keys.some((other) => other.subUnitKey === entry.subUnitKey));
  }
});

test("the builder refuses inconsistent decisions with a named reason", () => {
  const labels = new Map([["H22-X-01-A", "가"], ["H15-X-01-A", "나"], ["EN-ONLY", "English only"], ["H22-X-01-B", "다"]]);
  const index = { units: new Map([["S|U1", "단원"]]), subjects: new Map([["S", "과목"]]), subjectOrder: ["S"], unitOrder: new Map([["S|U1", 1]]) };
  const rules = (scopes) => ({ schemaVersion: "archive2-subunit-group-rules-v1", scopes });
  const run = (scopes) => buildTable({ rules: rules(scopes), masterLabels: labels, unitIndex: index });
  const ok = run([{ subject: "S", unitKey: "U1", groups: [{ kind: "subunit", anchor: "H15-X-01-A", keys: [{ key: "H15-X-01-A", basis: "anchor" }, { key: "H22-X-01-A", basis: "curriculum_2015_2022", reviewed: true }] }], standalone: ["H22-X-01-B"] }]);
  // The 2022 name wins when a member of the 2022 system carries one.
  assert.equal(ok.scopes[0].groups.find((group) => group.keys.length === 2).label, "가");
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [], standalone: ["H22-X-01-A", "H22-X-01-A"] }]), /RULES_KEY_IN_TWO_GROUPS/);
  assert.throws(() => run([{ subject: "S", unitKey: "NOPE", groups: [], standalone: [] }]), /RULES_UNKNOWN_UNIT/);
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [], standalone: ["EN-ONLY"] }]), /RULES_LABEL_NOT_KOREAN/);
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [], standalone: ["NOT-IN-MASTER"] }]), /RULES_STANDALONE_NOT_MASTER/);
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [{ kind: "excluded", keys: [{ key: "H22-X-01-A", basis: "problem_number_key" }] }], standalone: [] }]), /RULES_EXCLUDED_NOT_NUMBER_KEY/);
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [{ kind: "unit_other", keys: [{ key: "H22-X-01-A", basis: "adhoc_to_other" }] }], standalone: [] }]), /RULES_OTHER_HAS_MASTER_KEY/);
  labels.set("H22-X-02-CORE", "가나 핵심 개념");
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [], standalone: ["H22-X-02-CORE"] }]), /RULES_BROAD_KEY_IN_SUBUNIT/);
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [{ kind: "subunit", anchor: "H22-X-01-A", keys: [{ key: "H22-X-01-A", basis: "anchor" }, { key: "H22-X-02-CORE", basis: "content_checked" }] }], standalone: [] }]), /RULES_BROAD_KEY_IN_SUBUNIT/);
  const renamed = run([{ subject: "S", unitKey: "U1", groups: [], standalone: ["H22-X-01-A"], labelOverrides: { "H22-X-01-A": { label: "새 이름", reason: "발문이 다른 내용이다" } } }]);
  assert.equal(renamed.scopes[0].groups[0].label, "새 이름");
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [], standalone: ["H22-X-01-A"], labelOverrides: { "H22-X-01-A": { label: "새 이름" } } }]), /RULES_LABEL_OVERRIDE/);
  assert.throws(() => run([{ subject: "S", unitKey: "U1", groups: [], standalone: ["H22-X-01-A"], labelOverrides: { "H22-X-01-B": { label: "새 이름", reason: "근거 한 줄입니다" } } }]), /RULES_LABEL_OVERRIDE_UNUSED/);
  // A canonical key that the rules do not mention is simply not in the table; the builder never needs the canonical set.
  assert.equal(tableKeys(ok).has("NEW-KEY-NOT-IN-RULES"), false);
});

test("the rules file lists no group names except the recorded overrides", () => {
  const rules = JSON.parse(fs.readFileSync(path.join(repo, RULES_PATH), "utf8"));
  for (const scope of rules.scopes) for (const group of scope.groups || []) assert.ok(!("label" in group), "labels are derived from the master table or labelOverrides");
});

const allGroups = new Map();
for (const scope of table.scopes) for (const group of scope.groups) allGroups.set(group.groupKey, { scope, group });

test("a moved group points at a real 소단원 or 단원 일반 group of another unit, shows its name, and never chains", () => {
  let moved = 0;
  for (const scope of table.scopes) for (const group of scope.groups.filter((candidate) => candidate.kind === "moved")) {
    moved++;
    const target = allGroups.get(group.belongsTo.groupKey);
    assert.ok(target, `${group.groupKey} points at ${group.belongsTo.groupKey}, which does not exist`);
    assert.ok(["subunit", "unit_general"].includes(target.group.kind), `${group.groupKey} points at a ${target.group.kind} group (moves must not chain)`);
    assert.notEqual(target.scope, scope, `${group.groupKey} points inside its own unit`);
    assert.equal(group.belongsTo.subject, target.scope.subject);
    assert.equal(group.belongsTo.unitKey, target.scope.unitKey);
    assert.equal(group.belongsTo.unitLabel, target.scope.unitLabel);
    assert.equal(group.label, target.group.label);
    assert.ok(group.keys.length > 0);
  }
  assert.ok(moved > 0);
});

test("user decision: 연립일차부등식 (middle 2) is a 소단원 of 여러 가지 방정식과 부등식 in 고1, and 연립부등식 is one group there", () => {
  const middle = table.scopes.find((scope) => scope.subject === "MIDDLE" && scope.unitKey === "M22-2-04");
  const movedGroup = middle.groups.find((group) => group.kind === "moved");
  assert.equal(movedGroup.belongsTo.groupKey, "SG:COMMON_MATH_1:H22-C-06:H15-SA-08-SYSTEM_INEQUALITY");
  assert.deepEqual(movedGroup.keys.map((entry) => entry.subUnitKey).sort(), ["M2-03-INTEGER_COUNT", "M2-03-SYSTEM_INEQ_SOL", "M2-03-SYSTEM_NO_SOL"]);
  assert.ok(!middle.groups.some((group) => group.kind === "unit_other"), "the middle-2 inequality keys are no longer 기타");
  const target = allGroups.get("SG:COMMON_MATH_1:H22-C-06:H15-SA-08-SYSTEM_INEQUALITY").group;
  assert.equal(target.label, "연립부등식");
  assert.ok(target.keys.some((entry) => entry.subUnitKey === "H22-C-06-SYSTEM"));
});

test("구역(section) is an optional heading from the unit's own list; only subunit groups carry one", () => {
  let withSections = 0;
  for (const scope of table.scopes) {
    const names = scope.sections || [];
    assert.equal(new Set(names).size, names.length);
    assert.ok(names.every(hasHangul));
    if (names.length) withSections++;
    for (const group of scope.groups) {
      if (!("section" in group)) continue;
      assert.equal(group.kind, "subunit", `${group.groupKey} is ${group.kind} but has a section`);
      assert.ok(names.includes(group.section), `${group.groupKey} section "${group.section}"`);
    }
  }
  assert.ok(withSections > 0);
  const scope = table.scopes.find((candidate) => candidate.subject === "COMMON_MATH_1" && candidate.unitKey === "H22-C-06");
  assert.deepEqual(scope.sections, ["여러 가지 방정식", "여러 가지 부등식"]);
  const sectionOf = (key) => scope.groups.find((group) => group.keys.some((entry) => entry.subUnitKey === key)).section;
  assert.equal(sectionOf("H22-C-06-EQUATION_BASIC"), "여러 가지 방정식");
  // 방정식과 부등식의 활용 mixes inequality word problems, so it has no section; 이차부등식 questions are not in 방정식의 풀이.
  assert.equal(sectionOf("H22-C-06-EQUATION_APPLICATION"), undefined);
  assert.equal(sectionOf("H15-SA-08-EQUATION_BASIC"), "여러 가지 부등식");
  assert.equal(scope.groups.find((group) => group.keys.some((entry) => entry.subUnitKey === "H15-SA-08-EQUATION_BASIC")).label, "이차부등식");
  assert.equal(allGroups.get("SG:COMMON_MATH_2:H22-C2-01:MOVED:H22-C-06:H15-SA-08-SYSTEM_INEQUALITY").group.keys[0].subUnitKey, "H15-SA-09-QUADRATIC_INEQUALITY");
  assert.equal(sectionOf("H15-SA-08-SYSTEM_INEQUALITY"), "여러 가지 부등식");
  // Common math units that merge two middle-level sections of the textbook contents carry sections; sections stay out of 일반·기타.
  const sectionsOf = (subject, unit) => table.scopes.find((candidate) => candidate.subject === subject && candidate.unitKey === unit).sections;
  assert.deepEqual(sectionsOf("COMMON_MATH_1", "H22-C-04"), ["복소수", "이차방정식"]);
  assert.deepEqual(sectionsOf("COMMON_MATH_1", "H22-C-05"), ["이차방정식", "이차방정식과 이차함수"]);
  assert.deepEqual(sectionsOf("COMMON_MATH_1", "H22-C-08"), ["경우의 수와 순열", "조합"]);
  assert.deepEqual(sectionsOf("COMMON_MATH_2", "H22-C2-05"), ["집합의 뜻과 포함 관계", "집합의 연산"]);
  assert.equal(sectionsOf("COMMON_MATH_1", "H22-C-01"), undefined, "a unit equal to one textbook section has no sections");
  assert.deepEqual(sectionsOf("ALGEBRA", "H22-A-01"), ["지수", "로그"]);
  assert.deepEqual(sectionsOf("ALGEBRA", "H22-A-04"), ["삼각함수", "삼각함수의 그래프"]);
  assert.equal(sectionsOf("PROB_STATS", "H22-PS-04"), undefined);
  const trig = table.scopes.find((candidate) => candidate.subject === "ALGEBRA" && candidate.unitKey === "H22-A-04");
  assert.ok(trig.groups.some((group) => group.label === "삼각함수가 포함된 방정식과 부등식"), "삼각방정식과 삼각부등식 are one 소단원");
});

test("a name that replaces the master name because of the 2022 textbook contents carries that reason", () => {
  const rules = JSON.parse(fs.readFileSync(path.join(repo, RULES_PATH), "utf8"));
  let renamed = 0;
  for (const scope of rules.scopes) for (const override of Object.values(scope.labelOverrides || {})) if (/^2022 교재 차례/.test(override.reason)) renamed++;
  assert.ok(renamed > 0);
  assert.equal(allGroups.get("SG:COMMON_MATH_2:H22-C2-03:H22-C2-03-TANGENT").group.label, "원의 접선의 방정식");
  assert.equal(allGroups.get("SG:COMMON_MATH_2:H22-C2-04:H15-SA-12-REFLECTION").group.label, "대칭이동");
});

test("a key of another grade sits in a unit only when it is marked cross_grade_key, and the mark is only for such keys", () => {
  let crossGrade = 0;
  for (const scope of table.scopes) for (const group of scope.groups) {
    if (group.kind === "excluded") continue;
    for (const entry of group.keys) {
      const mismatch = keyGradeMismatch(scope.subject, scope.unitKey, entry.subUnitKey);
      assert.equal(entry.basis === "cross_grade_key", mismatch, `${scope.unitKey} ${entry.subUnitKey} basis ${entry.basis}`);
      if (mismatch) crossGrade++;
    }
  }
  assert.ok(crossGrade > 0);
  assert.equal(keyGradeMismatch("MIDDLE", "M22-2-02", "M2-01-EXPONENT_LAW"), false);
  assert.equal(keyGradeMismatch("MIDDLE", "M22-2-02", "M1-07-SOLID_FIGURE_MEASURE"), true);
  assert.equal(keyGradeMismatch("MIDDLE", "M22-1-07", "M1-2-GEOM-SOLID-01-CORE"), false);
  assert.equal(keyGradeMismatch("COMMON_MATH_1", "H22-C-05", "M3-04-QUADRATIC_FUNCTION_APPLICATION"), true);
  assert.equal(keyGradeMismatch("COMMON_MATH_1", "H22-C-05", "H15-SA-13-QUADRATIC_GRAPH"), false);
});

test("the builder refuses wrong moves, sections and grade marks with a named reason", () => {
  const labels = new Map([["M1-01-A", "가"], ["M1-01-B", "나"], ["M2-01-A", "다"], ["M2-01-B", "라"]]);
  const index = {
    units: new Map([["MIDDLE|M22-1-01", "단원 하나"], ["MIDDLE|M22-2-01", "단원 둘"]]), subjects: new Map([["MIDDLE", "중학"]]), subjectOrder: ["MIDDLE"],
    unitOrder: new Map([["MIDDLE|M22-1-01", 1], ["MIDDLE|M22-2-01", 2]]),
  };
  const run = (scopes) => buildTable({ rules: { schemaVersion: "archive2-subunit-group-rules-v1", scopes }, masterLabels: labels, unitIndex: index });
  const one = { subject: "MIDDLE", unitKey: "M22-1-01", groups: [], standalone: ["M1-01-A"] };
  const moveTo = (anchor, unitKey = "M22-1-01") => ({ subject: "MIDDLE", unitKey: "M22-2-01", groups: [{ kind: "moved", belongsTo: { subject: "MIDDLE", unitKey, anchor }, keys: [{ key: "M2-01-A", basis: "moved_to_other_unit" }] }], standalone: [] });
  const ok = run([one, moveTo("M1-01-A")]);
  const moved = ok.scopes[1].groups[0];
  assert.equal(moved.label, "가");
  assert.equal(moved.belongsTo.unitLabel, "단원 하나");
  assert.throws(() => run([one, moveTo("M1-01-NOPE")]), /RULES_MOVED_TARGET_MISSING/);
  assert.throws(() => run([moveTo("M1-01-A")]), /RULES_MOVED_TARGET_MISSING/);
  assert.throws(() => run([one, moveTo("M2-01-A", "M22-2-01")]), /RULES_MOVED_TARGET_(MISSING|SAME_UNIT)/);
  assert.throws(() => run([{ ...one, groups: [{ kind: "moved", belongsTo: { subject: "MIDDLE", unitKey: "M22-2-01", anchor: "M2-01-B" }, keys: [{ key: "M1-01-B", basis: "cross_grade_key" }] }] }, { subject: "MIDDLE", unitKey: "M22-2-01", groups: [{ kind: "moved", belongsTo: { subject: "MIDDLE", unitKey: "M22-1-01", anchor: "M1-01-A" }, keys: [{ key: "M2-01-B", basis: "cross_grade_key" }] }], standalone: [] }]), /RULES_MOVED_TARGET_MISSING/, "a move into a moved group is a chain");
  assert.throws(() => run([{ ...one, groups: [{ kind: "subunit", belongsTo: { subject: "MIDDLE", unitKey: "M22-2-01", anchor: "x" }, anchor: "M1-01-B", keys: [{ key: "M1-01-B", basis: "anchor" }] }] }]), /RULES_BELONGS_TO_NOT_MOVED/);
  assert.throws(() => run([{ subject: "MIDDLE", unitKey: "M22-2-01", groups: [{ kind: "moved", keys: [{ key: "M2-01-A", basis: "moved_to_other_unit" }] }], standalone: [] }]), /RULES_MOVED_TARGET/);
  // Sections: a value must come from the unit's own list, and a section needs a group.
  const sectioned = (sectionOf, sections = ["구역 하나", "구역 둘"]) => run([{ ...one, sections, sectionOf }]);
  assert.equal(sectioned({ "M1-01-A": "구역 하나" }).scopes[0].groups[0].section, "구역 하나");
  assert.throws(() => sectioned({ "M1-01-A": "다른 구역" }), /RULES_SECTION_VALUE/);
  assert.throws(() => sectioned({ "M1-01-NOPE": "구역 하나" }), /RULES_SECTION_UNUSED/);
  assert.throws(() => sectioned({}, ["구역 하나", "구역 하나"]), /RULES_SECTIONS/);
  // Grade marks: a key of another grade must be marked, and the mark is only for such a key.
  assert.throws(() => run([{ subject: "MIDDLE", unitKey: "M22-1-01", groups: [], standalone: ["M2-01-A"] }]), /RULES_CROSS_GRADE_UNMARKED/);
  assert.throws(() => run([{ subject: "MIDDLE", unitKey: "M22-1-01", groups: [{ kind: "subunit", anchor: "M1-01-A", keys: [{ key: "M1-01-A", basis: "anchor" }, { key: "M2-01-A", basis: "content_checked" }] }], standalone: [] }]), /RULES_CROSS_GRADE_UNMARKED/);
  assert.throws(() => run([{ subject: "MIDDLE", unitKey: "M22-1-01", groups: [{ kind: "subunit", anchor: "M1-01-A", keys: [{ key: "M1-01-A", basis: "anchor" }, { key: "M1-01-B", basis: "cross_grade_key" }] }], standalone: [] }]), /RULES_CROSS_GRADE_NOT_CROSS/);
  const marked = run([{ subject: "MIDDLE", unitKey: "M22-1-01", groups: [{ kind: "subunit", anchor: "M1-01-A", keys: [{ key: "M1-01-A", basis: "anchor" }, { key: "M2-01-A", basis: "cross_grade_key", reviewed: true }] }], standalone: [] }]);
  assert.equal(marked.scopes[0].groups[0].keys[1].basis, "cross_grade_key");
  const standalone = run([{ subject: "MIDDLE", unitKey: "M22-1-01", groups: [], standalone: ["M2-01-A"], crossGradeStandalone: ["M2-01-A"] }]);
  assert.equal(standalone.scopes[0].groups[0].keys[0].basis, "cross_grade_key");
  assert.throws(() => run([{ subject: "MIDDLE", unitKey: "M22-1-01", groups: [], standalone: ["M1-01-A"], crossGradeStandalone: ["M2-01-A"] }]), /RULES_CROSS_GRADE_STANDALONE_UNUSED/);
});
