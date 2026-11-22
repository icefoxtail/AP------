// Grade bindings for the direct type-judgment lane (build-type-judgment-requests.mjs).
//
// Decision (docs/agents/metadata.md, "학년이 달라도 같은 형태의 유형은 기존 키를 재사용하고 그 학년 연결을 추가한다", 2026-11-22): a judged
// type that already exists for another grade or curriculum is NOT copied into a new key. The existing key is used and the row's own
// curriculum/course (grade) binding is added to it, append-only, so that the type is found in that grade too.
//
// What this module produces: for a result line whose PT has bindings but none that chooseScope() accepts for the row
// (SCOPE_PT_BOUND_TO_OTHER_COURSE, SCOPE_CURRICULUM_MISMATCH), the scope of the row itself plus the add-only registryChanges
// (bindings.json row of the PT's owner pack, plus the pack scope widening when the owner pack does not declare the course yet).
// Nothing else changes: no key is created, no existing row or key is modified.
//
// The unit of the new binding is the row's own standard unit/sub-unit when the tag master holds them; otherwise a unit named on the
// result line (`binding: { standardUnitKey, subUnitKey }`, written by whoever judged the line). Without any valid unit the line is
// skipped with GRADE_BINDING_NO_UNIT (a binding needs a unit; none is guessed).
import fs from "node:fs";
import path from "node:path";
import { COURSE_ALIASES_PATH } from "./course-aliases.mjs";
import { MASTER_PATH } from "./new-type-keys.mjs";

export const GRADE_BINDING_REASONS = new Set(["SCOPE_PT_BOUND_TO_OTHER_COURSE", "SCOPE_CURRICULUM_MISMATCH"]);
const MAX_UNITS_PER_GROUP = 3;
const MIDDLE_GROUP_BY_PATH_GRADE = { m1: "MIDDLE1", m2: "MIDDLE2", m3: "MIDDLE3" };
const text = v => typeof v === "string" ? v.trim() : "";
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

export function loadTagMaster(root) {
  const rows = JSON.parse(fs.readFileSync(path.join(root, MASTER_PATH), "utf8"));
  const map = new Map();
  for (const r of Array.isArray(rows) ? rows : []) if (["standardUnitKey", "subUnitKey"].includes(r.keyType) && /^active$/i.test(r.status || "")) map.set(r.key, r);
  return map;
}
// group id -> canonical (first) course name, from the alias file (e.g. MIDDLE1 -> "중1 수학")
export function loadCourseGroupNames(root) {
  const file = path.join(root, COURSE_ALIASES_PATH);
  const doc = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { spellingGroups: [] };
  return new Map((doc.spellingGroups || []).map(g => [g.id, g.members?.[0] || ""]));
}

// ctx: { registry (pt, bindingsByPt, packs, packFiles), master: Map, courseNames: Map, aliases }, env: { curriculumGuess(row), pathGrade(file) }
export function createGradeBindings({ ctx, env }) {
  const registry = ctx.registry, master = ctx.master, names = ctx.courseNames || new Map();
  const planned = new Map(); // `${pt}|${cur}|${course}` -> Map(unitKey -> { binding, owner })
  const unitPairOf = (m, row) => {
    const own = master.get(m.standardUnitKey);
    if (own?.keyType === "standardUnitKey") {
      const sub = master.get(m.subUnitKey);
      return { unit: own.key, sub: sub?.keyType === "subUnitKey" && sub.standardUnitKey === own.key ? sub.key : null };
    }
    const hint = row?.binding;
    const unit = master.get(text(hint?.standardUnitKey) || text(hint?.unit));
    if (unit?.keyType === "standardUnitKey") {
      const sub = master.get(text(hint?.subUnitKey) || text(hint?.sub));
      return { unit: unit.key, sub: sub?.keyType === "subUnitKey" && sub.standardUnitKey === unit.key ? sub.key : null };
    }
    return null;
  };
  function plan(m, row, ptKey) {
    if (!master) return { skip: null };
    const pt = registry.pt.get(ptKey), owner = text(pt?.ownerPack), pack = registry.packs.get(owner);
    if (!owner || !pack) return { skip: "SCOPE_OWNER_PACK_MISSING" };
    // A row with no curriculum of its own (textbook corpus rows have none) takes the folder/year guess, else "2015": the same tie-break as
    // chooseScope() (guess first, then the curricula in name order), which is how the already registered rows of such exams were scoped.
    const curriculum = text(m.curriculum) || text(m.curriculumKey) || env.curriculumGuess(m) || "2015";
    if (!["2015", "2022"].includes(curriculum)) return { skip: "GRADE_BINDING_CURRICULUM_UNKNOWN" };
    const course = text(m.standardCourse) || text(m.courseKey) || names.get(MIDDLE_GROUP_BY_PATH_GRADE[env.pathGrade(m.sourceArchiveFile)]) || "";
    if (!course) return { skip: "GRADE_BINDING_COURSE_UNKNOWN" };
    const pair = unitPairOf(m, row);
    if (!pair) return { skip: "GRADE_BINDING_NO_UNIT" };
    const group = `${ptKey}|${curriculum}|${course}`;
    if (!planned.has(group)) planned.set(group, new Map());
    const units = planned.get(group);
    const unitKey = `${pair.unit}\u0000${pair.sub ?? ""}`;
    if (!units.has(unitKey)) {
      // up to MAX_UNITS_PER_GROUP distinct units per (PT, curriculum, course); later rows join the first one (the binding only has to exist)
      if (units.size >= MAX_UNITS_PER_GROUP) return { scope: { curriculum, standardCourse: course }, relation: "gradeBinding", gradeBinding: { group, unitKey: units.keys().next().value, ptKey, owner, curriculum, course, uid: row.uid } };
      units.set(unitKey, { ptKey, owner, curriculum, course, pair });
    }
    const packAddition = pack.curricula.includes(curriculum) && pack.standardCourses.includes(course) ? null
      : { packId: owner, curricula: pack.curricula.includes(curriculum) ? [] : [curriculum], standardCourses: pack.standardCourses.includes(course) ? [] : [course] };
    return { scope: { curriculum, standardCourse: course }, relation: "gradeBinding", ...(packAddition ? { packAddition } : {}),
      gradeBinding: { group, unitKey, ptKey, owner, curriculum, course, uid: row.uid } };
  }
  // Add-only bindings.json rows of the planned items (supportingQuestionUids = the rows that needed the binding).
  function finalize(items) {
    const supports = new Map();
    for (const it of items) if (it.gradeBinding) {
      const k = `${it.gradeBinding.group}\u0001${it.gradeBinding.unitKey}`;
      if (!supports.has(k)) supports.set(k, []);
      supports.get(k).push(it.gradeBinding.uid);
    }
    const packDir = packId => { const f = registry.packFiles?.get(packId); return f ? f.replace(/\/pack\.json$/, "") : `archive/data/meta-foundation/canonical/packs/${packId.toLowerCase().replaceAll("_", "-")}`; };
    const changes = [];
    for (const [k, uids] of [...supports].sort((a, b) => cmp(a[0], b[0]))) {
      const [group, unitKey] = k.split("\u0001");
      const info = planned.get(group).get(unitKey);
      const { ptKey, owner, curriculum, course, pair } = info;
      const after = { problemTypeKey: ptKey, curriculum, standardCourse: course, standardUnitKey: pair.unit,
        ...(pair.sub ? { subUnitKey: pair.sub, subUnitLabelKo: master.get(pair.sub)?.labelKo || "" } : {}),
        supportingItemCount: uids.length, supportingQuestionUids: [...new Set(uids)].sort(), status: "ACTIVE", ownerPack: owner };
      const match = { curriculum, standardCourse: course, standardUnitKey: pair.unit, ...(pair.sub ? { subUnitKey: pair.sub } : {}), problemTypeKey: ptKey };
      changes.push({ path: `${packDir(owner)}/bindings.json`, collection: "bindings", match, before: null, after });
    }
    return changes;
  }
  return { plan, finalize };
}
