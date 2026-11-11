import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  BASES, KINDS, KIND_LABELS, RULES_PATH, TABLE_PATH, UNCLASSIFIED_UNIT, buildFromRepo, buildTable,
  isBroadKey, isProblemNumberKey, loadCanonicalKeys, loadMaster, loadUnitIndex, serializeTable, tableKeys,
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
    else assert.equal(group.label, KIND_LABELS[group.kind]);
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
      for (const entry of group.keys) {
        assert.ok(BASES.includes(entry.basis), `${entry.subUnitKey} basis ${entry.basis}`);
        assert.equal(typeof entry.reviewed, "boolean");
        // A question-number key is only ever excluded, and only question-number keys are.
        assert.equal(isProblemNumberKey(entry.subUnitKey), group.kind === "excluded", `${scope.unitKey} ${entry.subUnitKey} in ${group.kind}`);
        if (group.kind === "unit_other") {
          // An ad-hoc key (not in the master table), or a broad key that came from another unit.
          if (master.has(entry.subUnitKey)) { assert.equal(entry.basis, "foreign_broad_key"); assert.ok(isBroadKey(entry.subUnitKey, master), `${entry.subUnitKey} is a master key, not an ad-hoc key`); }
          else assert.equal(entry.basis, "adhoc_to_other");
        }
        if (group.kind === "unit_general") assert.equal(entry.basis, "unit_general_key");
        if (group.kind === "excluded") assert.equal(entry.basis, "problem_number_key");
      }
    }
    // The unclassified scope only marks question-number keys.
    if (scope.unitKey === UNCLASSIFIED_UNIT) assert.ok(scope.groups.every((group) => group.kind === "excluded"));
  }
});

test("a broad key (…-CORE or a master name ending in 핵심 개념) is never part of a subunit: only 단원 일반 or 기타", () => {
  for (const scope of table.scopes) for (const group of scope.groups) for (const entry of group.keys) {
    if (!isBroadKey(entry.subUnitKey, master)) continue;
    assert.ok(group.kind === "unit_general" || group.kind === "unit_other", `${scope.unitKey} ${entry.subUnitKey} is in ${group.kind}`);
    // Another unit's broad key is not this unit's general key: it only goes to 기타.
    if (group.kind === "unit_other") assert.equal(entry.basis, "foreign_broad_key");
  }
  assert.ok(master.get("H22-C-02-CORE").endsWith("핵심 개념"));
  // The name test must catch a label with a space (or none) before 개념, even when the key does not end in -CORE.
  const named = new Map([["X-1", "다면체 핵심 개념"], ["X-2", "다면체 핵심개념"], ["X-3", "다면체의 개념"]]);
  assert.deepEqual(["X-1", "X-2", "X-3"].map((key) => isBroadKey(key, named)), [true, true, false]);
  const place = (subject, unit) => table.scopes.find((scope) => scope.subject === subject && scope.unitKey === unit).groups.find((group) => group.keys.some((entry) => entry.subUnitKey === "H22-C-02-CORE"));
  assert.equal(place("COMMON_MATH_1", "H22-C-02").kind, "unit_general");
  assert.equal(place("COMMON_MATH_1", "H22-C-01").kind, "unit_other");
  assert.equal(place("ALGEBRA", "H22-A-01").kind, "unit_other");
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
    assert.equal(group.keys[0].basis, group.keys.length > 1 ? "anchor" : "standalone");
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
