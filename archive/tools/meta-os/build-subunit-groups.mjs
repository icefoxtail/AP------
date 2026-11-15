import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

// Builds archive/data/archive2-subunit-groups.json (the "묶음표") from the human decisions in
// archive/data/meta-os/subunit-group-rules.json, the master tag table and the unified unit list.
//
// The table only says which canonical subUnitKey values are shown and selected as ONE 소단원 inside one unified
// unit (subject + unitKey). It never changes a key or any value in question_metadata.json, the crosswalks, the
// sealed digests or the catalog. A key that is not listed here is treated as its own group by the consumer, so new
// keys appearing in the canonical metadata never fail a check; `--check` only reports how many there are.
//
//   node archive/tools/meta-os/build-subunit-groups.mjs            build and write the table
//   node archive/tools/meta-os/build-subunit-groups.mjs --check    exit 1 if the stored table differs from a rebuild
//
// Group kinds: subunit (one 소단원, one or more keys), unit_general (broad whole-unit keys, never merged with the
// narrower keys), unit_other ("기타" for ad-hoc keys that are not in the master table and not clearly a master
// 소단원), excluded (keys that are only a question number, left out of 소단원 평가).

export const RULES_PATH = "archive/data/meta-os/subunit-group-rules.json";
export const TABLE_PATH = "archive/data/archive2-subunit-groups.json";
const MASTER_PATH = "archive/data/master_tables/js_archive_tag_master.json";
const META_PATH = "archive/data/question_metadata.json";

export const TABLE_SCHEMA = "archive2-subunit-groups-v1";
export const KINDS = Object.freeze(["subunit", "unit_general", "unit_other", "moved", "excluded"]);
export const BASES = Object.freeze([
  "anchor", "standalone", "same_master_label", "curriculum_2015_2022", "unit_renumber", "content_checked",
  "unit_general_key", "adhoc_to_other", "foreign_broad_key", "foreign_unit_key", "moved_to_other_unit", "cross_grade_key", "problem_number_key",
]);
export const UNCLASSIFIED_UNIT = "UNCLASSIFIED";
export const KIND_LABELS = Object.freeze({ unit_general: "단원 일반", unit_other: "기타", excluded: "제외(문제 번호 키)" });
const KIND_RANK = Object.fromEntries(KINDS.map((kind, index) => [kind, index]));
const hasHangul = (value) => /[가-힣]/.test(String(value || ""));
const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// A broad key covers a whole unit (…-CORE, or a master name that ends in 핵심 개념). It is never one 소단원 of a unit.
export const isBroadKey = (key, masterLabels) => /-CORE$/.test(String(key || "")) || /핵심\s*개념$/.test(masterLabels?.get(key) || "");
export const isProblemNumberKey = (key) => /-P\d+-Q\d+$|-Q\d+$/.test(String(key || ""));

// Grade check: a middle-school scope (unitKey M22-<grade>-…) should only list keys of its own grade (M<grade>-…), and a
// high-school scope should list no middle-school keys (M<grade>-…). A key of another grade is allowed only when it is
// marked cross_grade_key, which tells the re-judging line that the question's own 소단원 value is the wrong one.
export function scopeGrade(subject, unitKey) {
  const middle = /^M22-(\d)-/.exec(String(unitKey || ""));
  if (subject === "MIDDLE" && middle) return { level: "middle", grade: Number(middle[1]) };
  if (subject === "MIDDLE") return null;
  return { level: "high", grade: 0 };
}
export function keyGradeMismatch(subject, unitKey, key) {
  const scope = scopeGrade(subject, unitKey);
  if (!scope) return false;
  const middleKey = /^M(\d)-/.exec(String(key || ""));
  if (scope.level === "middle") return Boolean((middleKey && Number(middleKey[1]) !== scope.grade) || /^(H\d|HH\d|HIGH\d)/.test(String(key || "")));
  return Boolean(middleKey);
}

function readJson(root, relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), "utf8").replace(/^﻿/, ""));
}

// Unified unit list: subject value + unitKey -> unit name, in the order the screen shows them.
export function loadUnitIndex(root) {
  const require = createRequire(import.meta.url);
  const Unified = require(path.join(root, "archive/archive2-unified-units.js"));
  const units = new Map();
  const subjects = new Map();
  const subjectOrder = [];
  const unitOrder = new Map();
  for (const grade of Unified.GRADES) {
    // Stored key-group decisions retain their historical unit IDs. The current RPM parent
    // projection has separate IDs, so both namespaces remain valid without rewriting old rules.
    for (const group of [...Unified.structure(grade), ...Unified.structure(grade, { legacy: true })]) {
      if (!subjects.has(group.subject)) { subjects.set(group.subject, group.label); subjectOrder.push(group.subject); }
      for (const unit of group.units) {
        const id = `${group.subject}|${unit.key}`;
        if (!units.has(id)) { units.set(id, unit.label); unitOrder.set(id, unit.order); }
      }
    }
  }
  return { units, subjects, subjectOrder, unitOrder };
}

export function loadMaster(root) {
  const rows = readJson(root, MASTER_PATH);
  const labels = new Map();
  for (const row of rows) if (row.keyType === "subUnitKey") labels.set(row.key, String(row.labelKo || row.subUnit || ""));
  return labels;
}

export function loadCanonicalKeys(root) {
  const keys = new Set();
  for (const record of readJson(root, META_PATH).records || []) if (record.subUnitKey) keys.add(record.subUnitKey);
  return keys;
}

const scopeId = (scope) => `${scope.subject}|${scope.unitKey}`;

// Pure builder. Throws Error with a list of RULES_* problems when the decisions are inconsistent.
export function buildTable({ rules, masterLabels, unitIndex }) {
  const problems = [];
  const fail = (code, detail) => problems.push(`${code}: ${detail}`);
  if (rules?.schemaVersion !== "archive2-subunit-group-rules-v1") fail("RULES_SCHEMA", String(rules?.schemaVersion));
  const scopes = [];
  const seenScopes = new Set();
  for (const scope of rules?.scopes || []) {
    const id = scopeId(scope);
    if (seenScopes.has(id)) { fail("RULES_DUPLICATE_SCOPE", id); continue; }
    seenScopes.add(id);
    const classified = scope.unitKey !== UNCLASSIFIED_UNIT;
    const unitLabel = classified ? unitIndex.units.get(id) : "단원 미분류";
    if (classified && !unitLabel) { fail("RULES_UNKNOWN_UNIT", id); continue; }
    if (!unitIndex.subjects.has(scope.subject)) { fail("RULES_UNKNOWN_SUBJECT", id); continue; }
    const seenKeys = new Set();
    const claim = (key, where) => {
      if (!key) { fail("RULES_EMPTY_KEY", `${id} ${where}`); return false; }
      if (seenKeys.has(key)) { fail("RULES_KEY_IN_TWO_GROUPS", `${id} ${key}`); return false; }
      seenKeys.add(key);
      return true;
    };
    const groups = [];
    const sections = scope.sections || [];
    if (sections.some((name) => !hasHangul(name)) || new Set(sections).size !== sections.length) fail("RULES_SECTIONS", id);
    for (const group of scope.groups || []) {
      if (!KINDS.includes(group.kind)) { fail("RULES_KIND", `${id} ${group.kind}`); continue; }
      if (group.kind === "moved" && !(group.belongsTo?.subject && group.belongsTo?.unitKey && group.belongsTo?.anchor)) { fail("RULES_MOVED_TARGET", id); continue; }
      if (group.kind !== "moved" && group.belongsTo) fail("RULES_BELONGS_TO_NOT_MOVED", id);
      const entries = [];
      for (const entry of group.keys || []) {
        if (group.kind === "subunit" && isBroadKey(entry.key, masterLabels)) fail("RULES_BROAD_KEY_IN_SUBUNIT", `${id} ${entry.key}`);
        if (!BASES.includes(entry.basis)) fail("RULES_BASIS", `${id} ${entry.key} ${entry.basis}`);
        if (!claim(entry.key, group.kind)) continue;
        const isMaster = masterLabels.has(entry.key);
        if (group.kind === "excluded" && !isProblemNumberKey(entry.key)) fail("RULES_EXCLUDED_NOT_NUMBER_KEY", `${id} ${entry.key}`);
        // 기타 holds ad-hoc keys, a broad key of another unit, or another unit's (or grade's) key that fits no 소단원 here.
        if (group.kind === "unit_other" && isMaster && !["foreign_broad_key", "foreign_unit_key", "cross_grade_key"].includes(entry.basis)) fail("RULES_OTHER_HAS_MASTER_KEY", `${id} ${entry.key}`);
        if (group.kind === "unit_other" && entry.basis === "foreign_broad_key" && !isBroadKey(entry.key, masterLabels)) fail("RULES_FOREIGN_KEY_NOT_BROAD", `${id} ${entry.key}`);
        if (group.kind === "unit_other" && isProblemNumberKey(entry.key)) fail("RULES_OTHER_HAS_NUMBER_KEY", `${id} ${entry.key}`);
        if (group.kind !== "excluded") {
          const mismatch = classified && keyGradeMismatch(scope.subject, scope.unitKey, entry.key);
          if (mismatch && entry.basis !== "cross_grade_key") fail("RULES_CROSS_GRADE_UNMARKED", `${id} ${entry.key}`);
          if (!mismatch && entry.basis === "cross_grade_key") fail("RULES_CROSS_GRADE_NOT_CROSS", `${id} ${entry.key}`);
        }
        entries.push({ subUnitKey: entry.key, basis: entry.basis, reviewed: entry.reviewed === true });
      }
      if (!entries.length) continue;
      if (group.kind === "subunit") {
        const anchor = group.anchor || entries[0].subUnitKey;
        if (entries[0].subUnitKey !== anchor) fail("RULES_ANCHOR_NOT_FIRST", `${id} ${anchor}`);
        if (!masterLabels.has(anchor)) fail("RULES_ANCHOR_NOT_MASTER", `${id} ${anchor}`);
        // The shown name: the 2022 unit system's name when a member carries it (H22-*), otherwise the master name of the anchor.
        const named = entries.find((entry) => /^H22-/.test(entry.subUnitKey) && masterLabels.has(entry.subUnitKey) && hasHangul(masterLabels.get(entry.subUnitKey)));
        const override = scope.labelOverrides?.[anchor];
        if (override && (!override.reason || !hasHangul(override.label))) fail("RULES_LABEL_OVERRIDE", `${id} ${anchor}`);
        const label = override ? override.label : masterLabels.get(named ? named.subUnitKey : anchor) || "";
        if (!hasHangul(label)) fail("RULES_LABEL_NOT_KOREAN", `${id} ${anchor} "${label}"`);
        groups.push({ groupKey: `SG:${scope.subject}:${scope.unitKey}:${anchor}`, kind: "subunit", label, ...(override ? { labelReason: override.reason } : {}), keys: entries });
      } else if (group.kind === "moved") {
        // Keys that the unified unit list places in this unit but whose content belongs to a 소단원 of another unit.
        // The label and target are filled in once every scope is built (the target group must really exist).
        // The target is a 소단원 group named by its anchor key, or the unit's "단원 일반" group named GENERAL.
        const target = group.belongsTo;
        groups.push({ groupKey: `SG:${scope.subject}:${scope.unitKey}:MOVED:${target.unitKey}:${target.anchor}`, kind: "moved", label: "", belongsTo: { subject: target.subject, unitKey: target.unitKey, unitLabel: "", groupKey: `SG:${target.subject}:${target.unitKey}:${target.anchor}` }, keys: entries });
      } else {
        const tag = { unit_general: "GENERAL", unit_other: "OTHER", excluded: "EXCLUDED" }[group.kind];
        groups.push({ groupKey: `SG:${scope.subject}:${scope.unitKey}:${tag}`, kind: group.kind, label: KIND_LABELS[group.kind], keys: entries });
      }
    }
    const crossStandalone = new Set(scope.crossGradeStandalone || []);
    for (const key of crossStandalone) if (!(scope.standalone || []).includes(key)) fail("RULES_CROSS_GRADE_STANDALONE_UNUSED", `${id} ${key}`);
    for (const key of scope.standalone || []) {
      if (!claim(key, "standalone")) continue;
      const mismatch = classified && keyGradeMismatch(scope.subject, scope.unitKey, key);
      if (mismatch && !crossStandalone.has(key)) fail("RULES_CROSS_GRADE_UNMARKED", `${id} ${key}`);
      if (!mismatch && crossStandalone.has(key)) fail("RULES_CROSS_GRADE_NOT_CROSS", `${id} ${key}`);
      const override = scope.labelOverrides?.[key];
      if (override && (!override.reason || !hasHangul(override.label))) fail("RULES_LABEL_OVERRIDE", `${id} ${key}`);
      const label = override ? override.label : masterLabels.get(key) || "";
      if (!masterLabels.has(key)) fail("RULES_STANDALONE_NOT_MASTER", `${id} ${key}`);
      else if (isBroadKey(key, masterLabels)) fail("RULES_BROAD_KEY_IN_SUBUNIT", `${id} ${key}`);
      else if (!hasHangul(label)) fail("RULES_LABEL_NOT_KOREAN", `${id} ${key} "${label}"`);
      groups.push({ groupKey: `SG:${scope.subject}:${scope.unitKey}:${key}`, kind: "subunit", label, ...(override ? { labelReason: override.reason } : {}), keys: [{ subUnitKey: key, basis: crossStandalone.has(key) ? "cross_grade_key" : "standalone", reviewed: false }] });
    }
    for (const key of Object.keys(scope.labelOverrides || {}))
      if (!groups.some((group) => group.kind === "subunit" && group.groupKey.endsWith(`:${key}`))) fail("RULES_LABEL_OVERRIDE_UNUSED", `${id} ${key}`);
    // Optional 구역(section): a heading a subunit list can be split by (e.g. 여러 가지 방정식 / 여러 가지 부등식).
    for (const [key, name] of Object.entries(scope.sectionOf || {})) {
      const group = groups.find((candidate) => candidate.kind === "subunit" && candidate.groupKey.endsWith(`:${key}`));
      if (!group) fail("RULES_SECTION_UNUSED", `${id} ${key}`);
      else if (!sections.includes(name)) fail("RULES_SECTION_VALUE", `${id} ${key} "${name}"`);
      else group.section = name;
    }
    const keyOf = new Set();
    for (const group of groups) {
      if (keyOf.has(group.groupKey)) fail("RULES_DUPLICATE_GROUP_KEY", group.groupKey);
      keyOf.add(group.groupKey);
    }
    groups.sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind] || compare(a.groupKey, b.groupKey));
    scopes.push({ subject: scope.subject, unitKey: scope.unitKey, unitLabel, ...(sections.length ? { sections } : {}), groups });
  }
  // A moved group must point at a real subunit group of another unit; it shows that group's name.
  const byGroupKey = new Map();
  for (const scope of scopes) for (const group of scope.groups) byGroupKey.set(group.groupKey, { scope, group });
  for (const scope of scopes) for (const group of scope.groups.filter((candidate) => candidate.kind === "moved")) {
    const target = byGroupKey.get(group.belongsTo.groupKey);
    // The target must be a real 소단원 or 단원 일반 group of another unit, never a moved group itself (no chains).
    if (!target || !["subunit", "unit_general"].includes(target.group.kind)) fail("RULES_MOVED_TARGET_MISSING", `${scope.subject} ${scope.unitKey} -> ${group.belongsTo.groupKey}`);
    else if (target.scope === scope) fail("RULES_MOVED_TARGET_SAME_UNIT", group.groupKey);
    else { group.label = target.group.label; group.belongsTo.unitLabel = target.scope.unitLabel; }
  }
  if (problems.length) throw Object.assign(new Error(problems.slice(0, 40).join("\n")), { problems });
  const subjectRank = new Map(unitIndex.subjectOrder.map((subject, index) => [subject, index]));
  scopes.sort((a, b) =>
    (subjectRank.get(a.subject) ?? 99) - (subjectRank.get(b.subject) ?? 99) || compare(a.subject, b.subject) ||
    (unitIndex.unitOrder.get(scopeId(a)) ?? 9999) - (unitIndex.unitOrder.get(scopeId(b)) ?? 9999) || compare(a.unitKey, b.unitKey));
  return {
    schemaVersion: TABLE_SCHEMA,
    description: "소단원 묶음표. 같은 통합 단원 안에서 하나의 소단원으로 보여 주고 고르는 소단원 키(subUnitKey)의 묶음이다. 표시와 선택에만 쓰며 문항의 소단원 값과 정본 메타는 바꾸지 않는다. 표에 없는 키는 자기 자신이 하나의 묶음이다.",
    sources: { rules: RULES_PATH, masterTable: MASTER_PATH },
    scope: "통합 단원(subject + unitKey)마다 한 키는 한 묶음에만 속한다. unitKey UNCLASSIFIED는 '단원 미분류'다.",
    kinds: { subunit: "소단원", unit_general: "단원 일반(넓은 키)", unit_other: "기타(임시 키)", moved: "다른 단원의 소단원에 속하는 키(belongsTo)", excluded: "소단원 평가 제외" },
    scopes,
  };
}

export function serializeTable(table) {
  return JSON.stringify(table, null, 1) + "\n";
}

// Counts used by the CLI summary and by tests.
export function summarizeTable(table) {
  const out = { scopes: table.scopes.length, groups: 0, keys: 0, byKind: {}, multiKeySubunits: 0, keysInMultiKeySubunits: 0 };
  for (const kind of KINDS) out.byKind[kind] = 0;
  for (const scope of table.scopes) for (const group of scope.groups) {
    out.groups++; out.keys += group.keys.length; out.byKind[group.kind]++;
    if (group.kind === "subunit" && group.keys.length > 1) { out.multiKeySubunits++; out.keysInMultiKeySubunits += group.keys.length; }
  }
  return out;
}

export function tableKeys(table) {
  const keys = new Set();
  for (const scope of table.scopes) for (const group of scope.groups) for (const entry of group.keys) keys.add(entry.subUnitKey);
  return keys;
}

export function buildFromRepo(root) {
  const rules = readJson(root, RULES_PATH);
  const table = buildTable({ rules, masterLabels: loadMaster(root), unitIndex: loadUnitIndex(root) });
  return { rules, table, text: serializeTable(table) };
}

function main() {
  const argv = process.argv.slice(2);
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const check = argv.includes("--check");
  let built;
  try { built = buildFromRepo(root); }
  catch (error) { console.error("SUBUNIT_GROUPS_BUILD_FAILED\n" + error.message); process.exit(2); }
  const target = path.join(root, TABLE_PATH);
  const stored = fs.existsSync(target) ? fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n") : null;
  // Keys that exist in the canonical metadata but are in no group are not an error: they are their own group.
  const canonical = loadCanonicalKeys(root);
  const listed = tableKeys(built.table);
  const missingFromCanonical = [...listed].filter((key) => !canonical.has(key)).sort();
  const unlisted = [...canonical].filter((key) => !listed.has(key)).sort();
  const summary = summarizeTable(built.table);
  console.log(JSON.stringify({ summary, canonicalKeys: canonical.size, unlistedCanonicalKeys: unlisted.length, listedKeysMissingFromCanonical: missingFromCanonical.length }));
  if (missingFromCanonical.length) console.error("SUBUNIT_GROUPS_KEY_NOT_IN_CANONICAL " + missingFromCanonical.slice(0, 20).join(", "));
  if (check) {
    if (stored !== built.text) { console.error("SUBUNIT_GROUPS_STALE: regenerate with node archive/tools/meta-os/build-subunit-groups.mjs"); process.exit(1); }
    console.log("SUBUNIT_GROUPS_OK");
    return;
  }
  fs.writeFileSync(target, built.text, "utf8");
  console.log(`wrote ${TABLE_PATH}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
