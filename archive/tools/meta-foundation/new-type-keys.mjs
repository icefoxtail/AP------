// New problem-type (PT) / template (TPL) keys for the direct type-judgment lane (build-type-judgment-requests.mjs, option --bundles).
//
// Input: the bundle tables of the NEW_KEY judgments (docs/plans/archive-one-route-upgrade/type-bundles/ on a carrier branch):
//   new-pt-bundles.json  + new-pt-assign.jsonl   (uid -> PT bundle)   NPT_<course>_<NAME>
//   new-tpl-bundles.json + new-tpl-assign.jsonl  (uid -> TPL bundle under an existing PT)   NTPL_<course>_<NAME>
// A bundle either creates a key (absorbInto: null) or points at an existing ACTIVE key (absorbInto: <key>). A uid whose bundle is
// null has no value to register and is skipped with a counted reason.
//
// Key rule (deterministic, a key never changes once issued): PT_<bundle id without "NPT_">, TPL_<bundle id without "NTPL_">. The
// course prefix (M1, M2, H1, GEO, ...) is already part of the bundle id. Names (canonicalLabelKo) and definitions are the bundle's own
// Korean nameKo/definition, copied as they are.
//
// What is produced: registryChanges in the existing add-only form (problemTypes / templates / bindings rows with before: null and
// status ACTIVE, see register-type-judgment.mjs checkRegistryChanges). Nothing new in the request, receipt or row schema.
//   - ownerPack of a new PT: the pack that already owns most bindings on the bundle's most common valid unit; fallback: the pack with most
//     bindings on the bundle's course. No pack at all (e.g. 미적분): the bundle's lines are skipped (NEW_KEY_OWNER_PACK_UNRESOLVED).
//   - bindings of a new PT: one per (curriculum, course) the planned questions are placed in, on up to three (unit, sub-unit) pairs
//     that the questions themselves carry and the tag master holds. A question whose own unit is empty or unknown borrows the
//     pair of the bundle's questions of the same course.
//   - a new TPL belongs to the pack of its (existing) parent PT.
//   Only keys that a planned question really uses are emitted (finalize).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { COURSE_ALIASES_PATH } from "./course-aliases.mjs";

export const BUNDLE_DIR = "docs/plans/archive-one-route-upgrade/type-bundles";
export const BUNDLE_FILES = { ptBundles: "new-pt-bundles.json", ptAssign: "new-pt-assign.jsonl", tplBundles: "new-tpl-bundles.json", tplAssign: "new-tpl-assign.jsonl" };
export const MASTER_PATH = "archive/data/master_tables/js_archive_tag_master.json";
export const BUNDLE_SOURCE = "TYPE_BUNDLE_TABLE";
const MAX_PAIRS_PER_GROUP = 3;
const MIDDLE_GROUP_BY_PATH_GRADE = { m1: "MIDDLE1", m2: "MIDDLE2", m3: "MIDDLE3" };
const MIDDLE_GROUP_BY_BUNDLE_COURSE = { middle1: "MIDDLE1", middle2: "MIDDLE2", middle3: "MIDDLE3" };

const text = v => typeof v === "string" ? v.trim() : "";
const empty = v => v === null || v === undefined || v === "";
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const git = (root, ...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 512 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
const parseJsonl = (content, label) => content.split("\n").filter(l => l.trim()).map((l, i) => { try { return JSON.parse(l); } catch { throw new Error(`BROKEN_JSONL_LINE:${label}:${i + 1}`); } });

// ---------------------------------------------------------------- keys
export const ptKeyOf = bundleId => { const m = /^NPT_([A-Z0-9]+(?:_[A-Z0-9]+)*)$/.exec(String(bundleId)); if (!m) throw new Error(`BUNDLE_ID_INVALID:${bundleId}`); return `PT_${m[1]}`; };
export const tplKeyOf = bundleId => { const m = /^NTPL_([A-Z0-9]+(?:_[A-Z0-9]+)*)$/.exec(String(bundleId)); if (!m) throw new Error(`BUNDLE_ID_INVALID:${bundleId}`); return `TPL_${m[1]}`; };

// ---------------------------------------------------------------- bundle tables
// source: { ref } (git ref, file read through git) or { dir } (plain folder). Returns the four tables and where they came from.
export function readBundleTables(root, source) {
  const read = {};
  let origin;
  if (source.ref) {
    const commit = git(root, "rev-parse", `${source.ref}^{commit}`).trim();
    const prefix = source.prefix || BUNDLE_DIR;
    origin = { branch: source.ref.replace(/^refs\/remotes\/origin\//, "").replace(/^origin\//, ""), commit, dir: prefix };
    for (const [name, file] of Object.entries(BUNDLE_FILES)) read[name] = git(root, "show", `${commit}:${prefix}/${file}`);
  } else {
    origin = { branch: source.branch || "local", commit: source.commit || "0".repeat(40), dir: source.dir };
    for (const [name, file] of Object.entries(BUNDLE_FILES)) read[name] = fs.readFileSync(path.join(source.dir, file), "utf8");
  }
  const tables = { ptBundles: JSON.parse(read.ptBundles), tplBundles: JSON.parse(read.tplBundles),
    ptAssign: parseJsonl(read.ptAssign, BUNDLE_FILES.ptAssign), tplAssign: parseJsonl(read.tplAssign, BUNDLE_FILES.tplAssign), origin };
  validateTables(tables);
  return tables;
}
export function validateTables(t) {
  const unique = (rows, f, label) => { const s = new Set(); for (const r of rows) { const k = f(r); if (s.has(k)) throw new Error(`${label}_DUPLICATE:${k}`); s.add(k); } return s; };
  const pt = unique(t.ptBundles, b => b.bundle, "PT_BUNDLE"), tpl = unique(t.tplBundles, b => b.bundle, "TPL_BUNDLE");
  unique(t.ptAssign, a => a.uid, "PT_ASSIGN_UID"); unique(t.tplAssign, a => a.uid, "TPL_ASSIGN_UID");
  for (const b of t.ptBundles) { ptKeyOf(b.bundle); if (!text(b.nameKo) || !text(b.definition)) throw new Error(`BUNDLE_NAME_OR_DEFINITION_MISSING:${b.bundle}`); }
  for (const b of t.tplBundles) { tplKeyOf(b.bundle); if (!text(b.pt) || !text(b.nameKo) || !text(b.definition)) throw new Error(`BUNDLE_NAME_OR_DEFINITION_MISSING:${b.bundle}`); }
  for (const a of t.ptAssign) if (a.bundle && !pt.has(a.bundle)) throw new Error(`PT_ASSIGN_BUNDLE_UNKNOWN:${a.bundle}`);
  for (const a of t.tplAssign) if (a.bundle && !tpl.has(a.bundle)) throw new Error(`TPL_ASSIGN_BUNDLE_UNKNOWN:${a.bundle}`);
}

// ---------------------------------------------------------------- master and alias data
function loadMaster(root) {
  const rows = JSON.parse(fs.readFileSync(path.join(root, MASTER_PATH), "utf8"));
  const map = new Map();
  for (const r of Array.isArray(rows) ? rows : []) if (["standardUnitKey", "subUnitKey"].includes(r.keyType) && /^active$/i.test(r.status || "")) map.set(r.key, r);
  return map;
}
function loadAliasGroups(root) {
  const file = path.join(root, COURSE_ALIASES_PATH);
  const doc = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { spellingGroups: [] };
  return new Map((doc.spellingGroups || []).map(g => [g.id, g]));
}
const cloneRegistry = r => ({ ...r, pt: new Map(r.pt), tpl: new Map(r.tpl), bindingsByPt: new Map([...r.bindingsByPt].map(([k, v]) => [k, v.slice()])) });

// ---------------------------------------------------------------- planning
// ctx: the converter's context ({ records, registry, aliases, root }); resultRows: the parsed result lines (with _source);
// env: { curriculumGuess(row), pathGrade(file) } from the converter. opts: { master, groups, bundlesOnly, ownerPackByBundle }.
// Returns { ctx (copy with the new keys visible in its registry), rows (converted lines), finalize(items), stats }.
export function prepareNewKeys({ ctx, tables, resultRows, env, opts = {} }) {
  const registry = cloneRegistry(ctx.registry);
  const master = opts.master || loadMaster(ctx.root);
  const groups = opts.groups || loadAliasGroups(ctx.root);
  const aliases = ctx.aliases;
  const ptBundle = new Map(tables.ptBundles.map(b => [b.bundle, b])), tplBundle = new Map(tables.tplBundles.map(b => [b.bundle, b]));
  const ptAssign = new Map(tables.ptAssign.map(a => [a.uid, a])), tplAssign = new Map(tables.tplAssign.map(a => [a.uid, a]));
  const stats = { bundlesOnly: Boolean(opts.bundlesOnly), ptBundles: { create: 0, absorb: 0, reuseExisting: 0, bad: 0 }, tplBundles: { create: 0, absorb: 0, reuseExisting: 0, bad: 0 },
    lines: { newKeyBundled: 0, newKeyAbsorbed: 0, newKeyNoBundle: 0, newKeyNotInTables: 0, tplUpgraded: 0, tplAbsorbed: 0, tplPtOnlyKept: 0, tplAlreadyJudged: 0, outsideBundles: 0 } };

  // ---- bundle -> target key
  const ptTarget = new Map(), tplTarget = new Map();
  for (const b of tables.ptBundles) {
    const derived = ptKeyOf(b.bundle), existing = registry.pt.get(b.absorbInto || derived);
    if (b.absorbInto) { if (existing?.status === "ACTIVE") { ptTarget.set(b.bundle, { kind: "absorb", key: b.absorbInto }); stats.ptBundles.absorb++; } else { ptTarget.set(b.bundle, { kind: "bad", reason: "NEW_KEY_ABSORB_TARGET_NOT_ACTIVE" }); stats.ptBundles.bad++; } }
    else if (registry.pt.has(derived)) { if (registry.pt.get(derived).status === "ACTIVE") { ptTarget.set(b.bundle, { kind: "reuse", key: derived }); stats.ptBundles.reuseExisting++; } else { ptTarget.set(b.bundle, { kind: "bad", reason: "NEW_KEY_EXISTS_NOT_ACTIVE" }); stats.ptBundles.bad++; } }
    else { ptTarget.set(b.bundle, { kind: "create", key: derived }); stats.ptBundles.create++; }
  }
  for (const b of tables.tplBundles) {
    const parent = registry.pt.get(b.pt), derived = tplKeyOf(b.bundle), existing = registry.tpl.get(b.absorbInto || derived);
    if (parent?.status !== "ACTIVE") { tplTarget.set(b.bundle, { kind: "bad", reason: "NEW_TPL_PARENT_NOT_ACTIVE" }); stats.tplBundles.bad++; }
    else if (b.absorbInto) { if (existing?.status === "ACTIVE" && existing.parentProblemTypeKey === b.pt) { tplTarget.set(b.bundle, { kind: "absorb", key: b.absorbInto }); stats.tplBundles.absorb++; } else { tplTarget.set(b.bundle, { kind: "bad", reason: "NEW_KEY_ABSORB_TARGET_NOT_ACTIVE" }); stats.tplBundles.bad++; } }
    else if (registry.tpl.has(derived)) { if (existing.status === "ACTIVE" && existing.parentProblemTypeKey === b.pt) { tplTarget.set(b.bundle, { kind: "reuse", key: derived }); stats.tplBundles.reuseExisting++; } else { tplTarget.set(b.bundle, { kind: "bad", reason: "NEW_KEY_EXISTS_WITH_OTHER_PARENT" }); stats.tplBundles.bad++; } }
    else { tplTarget.set(b.bundle, { kind: "create", key: derived }); stats.tplBundles.create++; }
  }

  // ---- course group / curriculum / unit pair of a question row
  const expectedGroups = b => {
    const names = [b.course, ...(b.courseAliases || [])];
    const ids = names.map(n => MIDDLE_GROUP_BY_BUNDLE_COURSE[n] || aliases.groupOf(n)).filter(Boolean);
    return [...new Set(ids)];
  };
  const groupOfRow = (m, expected) => {
    const raw = aliases.groupOf(text(m.standardCourse) || text(m.courseKey));
    if (raw) return { id: raw, own: true };
    const byPath = MIDDLE_GROUP_BY_PATH_GRADE[env.pathGrade(m.sourceArchiveFile)];
    if (byPath) return { id: byPath, own: false };
    return expected.length ? { id: expected[0], own: false } : { id: "", own: false };
  };
  // The row's own unit; when the row has none the tag master knows, the unit named on the bundle assignment line
  // (`binding: { standardUnitKey, subUnitKey }`, written by whoever assigned the bundle) is used.
  const unitPair = (m, uid) => {
    let unit = master.get(m.standardUnitKey), subKey = m.subUnitKey;
    if (!unit || unit.keyType !== "standardUnitKey") {
      const hint = ptAssign.get(uid)?.binding;
      unit = master.get(text(hint?.standardUnitKey)); subKey = hint?.subUnitKey;
      if (!unit || unit.keyType !== "standardUnitKey") return null;
    }
    const sub = master.get(subKey);
    return { unit: unit.key, sub: sub && sub.keyType === "subUnitKey" && sub.standardUnitKey === unit.key ? sub.key : null };
  };
  const pairKey = p => `${p.unit}\u0000${p.sub ?? ""}`;
  const canonicalCourse = id => groups.get(id)?.members?.[0] || "";
  const allBindings = [...registry.bindingsByPt.values()].flat();
  const packOfUnit = unit => {
    const n = new Map();
    for (const b of allBindings) if (b.standardUnitKey === unit && b.ownerPack) n.set(b.ownerPack, (n.get(b.ownerPack) || 0) + 1);
    return [...n].sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))[0]?.[0] || "";
  };
  // Fallback when no existing binding sits on the bundle's units: the pack with most bindings on the course (any spelling of it).
  const packOfCourse = groupId => {
    const members = groups.get(groupId)?.members || [];
    const n = new Map();
    for (const b of allBindings) if (b.ownerPack && members.some(name => ["same", "alias"].includes(aliases.relation(name, b.standardCourse)))) n.set(b.ownerPack, (n.get(b.ownerPack) || 0) + 1);
    return [...n].sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]))[0]?.[0] || "";
  };
  const defaultCurriculum = (packId) => { const c = ctx.registry.packs?.get(packId)?.curricula; return Array.isArray(c) && c.length === 1 ? c[0] : "2015"; };
  const curriculumOf = (m, groupId, packId) => {
    const own = text(m.curriculum) || text(m.curriculumKey);
    if (own) return own;
    const fam = /^H(15|22)_/.exec(groupId);
    return fam ? `20${fam[1]}` : env.curriculumGuess(m) || defaultCurriculum(packId);
  };
  const top = (counter, n) => [...counter].sort((a, b) => b[1] - a[1] || cmp(a[0], b[0])).slice(0, n);

  // ---- convert result lines
  const rows = [];
  const candidates = new Map(); // created PT key -> [{row, m, group}]
  const skipRow = (row, reason) => ({ ...row, _skip: reason });
  for (const row of resultRows) {
    let out = row;
    if (row.decision === "NEW_KEY") {
      const a = ptAssign.get(row.uid);
      if (!a) { stats.lines.newKeyNotInTables++; if (opts.bundlesOnly) { stats.lines.outsideBundles++; continue; } rows.push(row); continue; }
      if (!a.bundle) { stats.lines.newKeyNoBundle++; rows.push(skipRow(row, "NEW_KEY_NO_BUNDLE")); continue; }
      const target = ptTarget.get(a.bundle);
      if (target.kind === "bad") { rows.push(skipRow(row, target.reason)); continue; }
      out = { ...row, decision: "PICK", pt: target.key, tpl: null, _decision: "NEW_KEY", _bundle: a.bundle };
      if (target.kind === "create") {
        stats.lines.newKeyBundled++;
        const m = ctx.records.get(row.uid);
        const bundle = ptBundle.get(a.bundle), expected = expectedGroups(bundle);
        if (m) {
          const g = groupOfRow(m, expected);
          if (g.own && expected.length && !expected.includes(g.id)) { rows.push(skipRow(row, "NEW_KEY_ROW_COURSE_DIFFERS_FROM_BUNDLE")); continue; }
          if (empty(m.problemTypeKey) && empty(m.templateKey)) {
            if (!candidates.has(target.key)) candidates.set(target.key, []);
            candidates.get(target.key).push({ row: out, m, group: g.id, bundle });
          }
        }
      } else stats.lines.newKeyAbsorbed++;
      rows.push(out);
      continue;
    }
    if (row.decision === "PICK") {
      const a = tplAssign.get(row.uid);
      if (!a) { if (opts.bundlesOnly) { stats.lines.outsideBundles++; continue; } rows.push(row); continue; }
      if (!a.bundle) { stats.lines.tplPtOnlyKept++; rows.push(row); continue; }
      const target = tplTarget.get(a.bundle), bundle = tplBundle.get(a.bundle);
      if (!empty(row.tpl)) { stats.lines.tplAlreadyJudged++; rows.push(row); continue; }
      if (row.pt !== bundle.pt || target.kind === "bad") { stats.lines.tplPtOnlyKept++; rows.push(row); continue; }
      out = { ...row, tpl: target.key, _bundle: a.bundle, _tplFrom: target.kind };
      if (target.kind === "absorb" || target.kind === "reuse") stats.lines.tplAbsorbed++; else stats.lines.tplUpgraded++;
      rows.push(out);
      continue;
    }
    if (opts.bundlesOnly) { stats.lines.outsideBundles++; continue; }
    rows.push(row);
  }

  // ---- created PT: owner pack, provisional bindings (so that the converter's scope choice sees them)
  const created = { pt: new Map(), tpl: new Map() };
  const provisionalBindings = [];
  const dropped = new Set(); // uids pre-skipped because their new PT cannot be placed
  for (const [key, list] of [...candidates].sort((a, b) => cmp(a[0], b[0]))) {
    const bundle = list[0].bundle;
    const pairs = new Map(); // group id -> Map(pairKey -> {pair, n})
    const unitCount = new Map();
    for (const c of list) {
      const p = unitPair(c.m, c.row.uid);
      if (!p) continue;
      if (!pairs.has(c.group)) pairs.set(c.group, new Map());
      const e = pairs.get(c.group).get(pairKey(p)) || { pair: p, n: 0 }; e.n++; pairs.get(c.group).set(pairKey(p), e);
      unitCount.set(p.unit, (unitCount.get(p.unit) || 0) + 1);
    }
    // A unit-only pair would match every sub-unit binding of the same unit (registry match), so it is folded into the unit's best sub-unit pair.
    for (const map of pairs.values()) for (const [k, e] of [...map]) {
      if (e.pair.sub) continue;
      const withSub = top([...map].filter(([, x]) => x.pair.unit === e.pair.unit && x.pair.sub).map(([kk, x]) => [kk, x.n]), 1)[0];
      if (withSub) { map.get(withSub[0]).n += e.n; map.delete(k); }
    }
    // ownerPackByBundle (--owner-pack BUNDLE=PACK): an existing pack named by the caller for a bundle whose course no pack has bindings on yet (e.g. 미적분);
    // the pack then only gets the new course/curriculum values appended (the converter's add-only pack scope addition).
    let owner = ctx.registry.packs.has(opts.ownerPackByBundle?.get(bundle.bundle)) ? opts.ownerPackByBundle.get(bundle.bundle) : "";
    if (!owner) for (const [unit] of top(unitCount, unitCount.size)) { owner = packOfUnit(unit); if (owner) break; }
    if (!owner) owner = packOfCourse([...new Set(list.map(c => c.group))].sort()[0]);
    const lost = reason => { for (const c of list) { dropped.add(c.row.uid); } created.pt.set(key, { bundle: bundle.bundle, lost: reason }); };
    if (!owner) { lost("NEW_KEY_OWNER_PACK_UNRESOLVED"); continue; }
    created.pt.set(key, { bundle: bundle.bundle, ownerPack: owner, nameKo: bundle.nameKo, definition: bundle.definition });
    // provisional bindings: per course group the top pairs (rows of a group without any valid pair of their own are dropped)
    const okGroups = new Set();
    for (const [gid, map] of pairs) {
      okGroups.add(gid);
      for (const { pair } of top([...map].map(([k, e]) => [k, e.n]), MAX_PAIRS_PER_GROUP).map(([k]) => map.get(k))) {
        provisionalBindings.push({ problemTypeKey: key, groupId: gid, pair, ownerPack: owner });
      }
    }
    for (const c of list) if (!okGroups.has(c.group)) dropped.add(c.row.uid);
  }
  // curriculum differs per row: provisional bindings are derived per (group, curriculum) of the rows themselves
  const bindingIndex = new Map(); // `${pt}|${curr}|${course}` -> binding
  const addBinding = (b, curriculum, course) => {
    const id = `${b.problemTypeKey}|${curriculum}|${course}|${pairKey(b.pair)}`;
    if (bindingIndex.has(id)) return;
    const binding = { problemTypeKey: b.problemTypeKey, curriculum, standardCourse: course, standardUnitKey: b.pair.unit, ...(b.pair.sub ? { subUnitKey: b.pair.sub } : {}), status: "ACTIVE", ownerPack: b.ownerPack };
    bindingIndex.set(id, { ...binding, _pair: b.pair, _group: b.groupId });
    if (!registry.bindingsByPt.has(b.problemTypeKey)) registry.bindingsByPt.set(b.problemTypeKey, []);
    registry.bindingsByPt.get(b.problemTypeKey).push(binding);
  };
  for (const [key, list] of [...candidates].sort((a, b) => cmp(a[0], b[0]))) {
    const info = created.pt.get(key);
    if (!info || info.lost) continue;
    const byGroup = new Map();
    for (const b of provisionalBindings.filter(x => x.problemTypeKey === key)) { if (!byGroup.has(b.groupId)) byGroup.set(b.groupId, []); byGroup.get(b.groupId).push(b); }
    for (const c of list) {
      if (dropped.has(c.row.uid)) continue;
      for (const b of byGroup.get(c.group) || []) addBinding(b, curriculumOf(c.m, c.group, info.ownerPack), canonicalCourse(c.group));
    }
  }
  // entries visible to the planner (final text is built in finalize)
  for (const [key, info] of created.pt) if (!info.lost) registry.pt.set(key, { problemTypeKey: key, canonicalLabelKo: info.nameKo, definition: info.definition, status: "ACTIVE", ownerPack: info.ownerPack });
  for (const [bundleId, target] of tplTarget) if (target.kind === "create") {
    const b = tplBundle.get(bundleId), parent = registry.pt.get(b.pt);
    created.tpl.set(target.key, { bundle: bundleId, parent: b.pt, ownerPack: parent.ownerPack, nameKo: b.nameKo, definition: b.definition });
    registry.tpl.set(target.key, { templateKey: target.key, parentProblemTypeKey: b.pt, canonicalLabelKo: b.nameKo, definition: b.definition, status: "ACTIVE", ownerPack: parent.ownerPack });
  }
  // lines of created PTs that cannot be placed are skipped with a reason of their own
  const finalRows = rows.map(r => {
    if (r._skip) return r;
    if (r._decision === "NEW_KEY" && created.pt.get(r.pt)?.lost) return skipRow(r, created.pt.get(r.pt).lost);
    if (r._decision === "NEW_KEY" && dropped.has(r.uid)) return skipRow(r, "NEW_KEY_NO_VALID_UNIT_FOR_BINDING");
    return r;
  });

  // ---- after planning: only keys that a planned question uses
  function finalize(items) {
    const usedPt = new Map(), usedTpl = new Map(), groups2 = new Map();
    for (const it of items) {
      const ptKey = it.row.pt;
      if (created.pt.has(ptKey) && !created.pt.get(ptKey).lost) {
        if (!usedPt.has(ptKey)) usedPt.set(ptKey, []);
        usedPt.get(ptKey).push(it);
        const gk = `${ptKey}|${it.scope.curriculum}|${it.scope.standardCourse}`;
        if (!groups2.has(gk)) groups2.set(gk, { ptKey, scope: it.scope, items: [] });
        groups2.get(gk).items.push(it);
      }
      if (it.tplKey && created.tpl.has(it.tplKey)) { if (!usedTpl.has(it.tplKey)) usedTpl.set(it.tplKey, []); usedTpl.get(it.tplKey).push(it); }
    }
    const uids = list => list.map(i => i.row.uid).sort();
    const unitsOf = list => [...new Set(list.map(i => unitPair(i.m, i.row.uid)?.unit).filter(Boolean))].sort();
    const provenance = bundleId => [{ source: BUNDLE_SOURCE, bundle: bundleId, bundleTable: { branch: tables.origin.branch, commit: tables.origin.commit, dir: tables.origin.dir } }];
    const packDir = packId => { const f = ctx.registry.packFiles?.get(packId); return f ? f.replace(/\/pack\.json$/, "") : `archive/data/meta-foundation/canonical/packs/${packId.toLowerCase().replaceAll("_", "-")}`; };
    const changes = [], counts = { problemTypes: 0, templates: 0, bindings: 0 };
    for (const key of [...usedPt.keys()].sort()) {
      const info = created.pt.get(key), list = usedPt.get(key);
      const after = { problemTypeKey: key, canonicalLabelKo: info.nameKo, definition: info.definition, aliases: [], status: "ACTIVE", ownerPack: info.ownerPack,
        supportingItemCount: list.length, supportingQuestionUids: uids(list), sourceUnits: unitsOf(list), evidenceProvenance: provenance(info.bundle) };
      changes.push({ path: `${packDir(info.ownerPack)}/taxonomy.json`, collection: "problemTypes", match: { problemTypeKey: key }, before: null, after });
      counts.problemTypes++;
    }
    for (const key of [...usedTpl.keys()].sort()) {
      const info = created.tpl.get(key), list = usedTpl.get(key);
      const after = { templateKey: key, parentProblemTypeKey: info.parent, canonicalLabelKo: info.nameKo, definition: info.definition, aliases: [], status: "ACTIVE", ownerPack: info.ownerPack,
        supportingItemCount: list.length, supportingQuestionUids: uids(list), sourceUnits: unitsOf(list), evidenceProvenance: provenance(info.bundle) };
      changes.push({ path: `${packDir(info.ownerPack)}/taxonomy.json`, collection: "templates", match: { templateKey: key }, before: null, after });
      counts.templates++;
    }
    for (const gk of [...groups2.keys()].sort()) {
      const g = groups2.get(gk), owner = created.pt.get(g.ptKey).ownerPack;
      // the provisional bindings of this (PT, curriculum, course); each planned question goes to the one with its own pair, else to the first
      const own = [...bindingIndex.values()].filter(b => b.problemTypeKey === g.ptKey && b.curriculum === g.scope.curriculum && b.standardCourse === g.scope.standardCourse);
      if (!own.length) throw new Error(`NEW_KEY_BINDING_MISSING:${gk}`);
      const bucket = new Map(own.map(b => [`${b.standardUnitKey}\u0000${b.subUnitKey ?? ""}`, []]));
      const first = bucket.keys().next().value;
      for (const it of g.items) {
        const p = unitPair(it.m, it.row.uid), k = p ? pairKey(p) : null;
        // own pair, else a binding of the same unit, else the first one
        const target = k && bucket.has(k) ? k : (p && [...bucket.keys()].find(x => x.startsWith(`${p.unit}\u0000`))) || first;
        bucket.get(target).push(it);
      }
      for (const b of own) {
        const list = bucket.get(`${b.standardUnitKey}\u0000${b.subUnitKey ?? ""}`);
        if (!list.length) continue;
        const after = { problemTypeKey: g.ptKey, curriculum: b.curriculum, standardCourse: b.standardCourse, standardUnitKey: b.standardUnitKey,
          ...(b.subUnitKey ? { subUnitKey: b.subUnitKey, subUnitLabelKo: master.get(b.subUnitKey)?.labelKo || "" } : {}),
          supportingItemCount: list.length, supportingQuestionUids: uids(list), status: "ACTIVE", ownerPack: owner };
        const match = { curriculum: after.curriculum, standardCourse: after.standardCourse, standardUnitKey: after.standardUnitKey, ...(after.subUnitKey ? { subUnitKey: after.subUnitKey } : {}), problemTypeKey: g.ptKey };
        changes.push({ path: `${packDir(owner)}/bindings.json`, collection: "bindings", match, before: null, after });
        counts.bindings++;
      }
    }
    return { registryChanges: changes, counts, usedPt: usedPt.size, usedTpl: usedTpl.size,
      unusedCreatedPt: [...created.pt].filter(([k, v]) => !v.lost && !usedPt.has(k)).length, unusedCreatedTpl: [...created.tpl.keys()].filter(k => !usedTpl.has(k)).length };
  }
  return { ctx: { ...ctx, registry }, rows: finalRows, finalize, stats, created };
}
