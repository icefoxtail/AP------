import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import canonical from "../../archive2-canonical.js";
import { loadCanonical, buildCompiled, compiledOutputs, buildRegistryIndex } from "./compile-meta-foundation.mjs";
import { refreshRuntime } from "./reviewed-runtime-summary.mjs";

const CANON = "archive/data/meta-foundation/canonical";
const INDEX = `${CANON}/registry_index.json`;
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
const MAINTENANCE_RECEIPTS = "archive/data/meta-foundation/evidence/canonical-maintenance/v1";
const problemBankMeta = createRequire(import.meta.url)("../../problem-bank-meta.js");
const json = value => JSON.stringify(value, null, 2) + "\n";
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const bindingSubUnitIdentity = row => Object.hasOwn(row || {}, "subUnitKey")
  ? { present: true, value: row.subUnitKey } : { present: false };
const digest = value => crypto.createHash("sha256").update(value).digest("hex");
const eq = (a, b) => isDeepStrictEqual(a, b);
const slug = value => value.toLowerCase().replaceAll("_", "-");
const approved = row => row.reviewStatus === "reviewed_pass" || String(row.metadataStatus || "").startsWith("approved_");
const fail = message => { throw new Error(message); };
const requireText = (value, name) => typeof value === "string" && value.trim() ? value : fail(`${name} required`);
const sourceFields = ["standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit", "level", "L3", "L4",
  "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"];
const valueFields = new Set([...sourceFields, "sourceFingerprint", "contentFingerprint", "curriculum", "curriculumKey", "courseKey", "L1", "L2", "L3", "L4",
  "rpmL1", "rpmL2", "rpmL3", "rpmL4", "rpmPrimaryPath", "rpmSemanticStatus", "semanticSourceScope", "semanticScopeRelation",
  "primaryMethod", "decisiveStep", "integrationReason", "conceptClusterKey", "secondaryConceptKeys",
  "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "curriculumApplicability", "defaultSelectable"]);

function safePath(root, relative) {
  if (typeof relative !== "string" || !relative || relative.includes("\\") || relative.split("/").some(x => !x || x === "." || x === "..") || path.isAbsolute(relative)) fail(`unsafe path: ${relative}`);
  const full = path.resolve(root, relative);
  if (!full.startsWith(path.resolve(root) + path.sep)) fail(`path outside repository: ${relative}`);
  // Do not let a symlink in a checkout turn an allowlisted write into an external write.
  for (let p = full; p !== path.resolve(root); p = path.dirname(p)) {
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail(`symlink path: ${relative}`);
  }
  return full;
}

function unique(rows, key, name) {
  const map = new Map();
  for (const row of rows) {
    const k = typeof key === "function" ? key(row) : row[key];
    if (!k || map.has(k)) fail(`missing/duplicate ${name}: ${k}`);
    map.set(k, row);
  }
  return map;
}

// Native canonical documents only. No second registry or parallel compiler.
function allowedCollection(file, collection) {
  if (file === MASTER) return collection === "$";
  if (file === INDEX) return ["activePacks", "activeConceptShards"].includes(collection);
  if (/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/taxonomy\.json$/.test(file)) return ["problemTypes", "templates"].includes(collection);
  if (/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/bindings\.json$/.test(file)) return ["bindings", "applicabilityRules"].includes(collection);
  if (/^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/aliases\.json$/.test(file)) return collection === "aliases";
  if (/^archive\/data\/meta-foundation\/canonical\/concepts\/[a-z0-9-]+\.json$/.test(file)) return collection === "concepts";
  return file === `${CANON}/condition_registry.json` && collection === "conditions";
}

function registryPlan(root, changes, verifyEvidence) {
  const documents = new Map();
  const original = new Map();
  const read = file => {
    if (documents.has(file)) return documents.get(file);
    const full = safePath(root, file);
    const value = fs.existsSync(full) ? JSON.parse(fs.readFileSync(full, "utf8")) : null;
    original.set(file, structuredClone(value));
    documents.set(file, value);
    return value;
  };
  for (const change of changes) {
    const { path: file, collection, match, before, after } = change;
    safePath(root, file);
    if (!Object.hasOwn(change, "before") || !Object.hasOwn(change, "after")) fail("registry change requires explicit before/after (null for absence)");
    verifyEvidence(change.evidenceRefs);
    const doc = read(file);
    if (!collection) {
      const nativeDoc = /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/(pack|taxonomy|bindings|aliases)\.json$/.test(file)
        || /^archive\/data\/meta-foundation\/canonical\/concepts\/[a-z0-9-]+\.json$/.test(file);
      if (!nativeDoc || (doc !== null && !file.endsWith("/pack.json"))) fail(`whole-document change not allowed: ${file}`);
      if (!eq(doc, before) || !after || typeof after !== "object" || Array.isArray(after)) fail(`registry document before/after mismatch: ${file}`);
      documents.set(file, structuredClone(after));
      continue;
    }
    if (!allowedCollection(file, collection) || !match || typeof match !== "object" || Array.isArray(match) || !Object.keys(match).length) fail(`registry collection/match not allowed: ${file}`);
    if (!doc) fail(`create native document before editing collection: ${file}`);
    const rows = collection === "$" ? doc : doc[collection];
    if (!Array.isArray(rows)) fail(`registry collection missing: ${file}.${collection}`);
    const matches = rows.map((row, i) => Object.entries(match).every(([k, v]) => Object.hasOwn(row, k) && eq(row[k], v)) ? i : -1).filter(i => i >= 0);
    if (matches.length > 1) fail(`ambiguous registry match: ${file}`);
    const index = matches[0];
    if (!eq(index === undefined ? null : rows[index], before)) fail(`registry before mismatch: ${file}`);
    if (after !== null && (!after || typeof after !== "object" || Array.isArray(after) || !Object.entries(match).every(([k, v]) => eq(after[k], v)))) fail(`registry after identity mismatch: ${file}`);
    if (after === null) { if (index === undefined) fail(`cannot delete missing registry entry: ${file}`); rows.splice(index, 1); }
    else if (index === undefined) rows.push(structuredClone(after));
    else rows[index] = structuredClone(after);
  }
  const readJson = file => read(file) ?? fail(`canonical file missing: ${file}`);
  const index = readJson(INDEX);
  unique(index.activePacks, "id", "pack");
  unique(index.activeConceptShards, "id", "concept shard");
  for (const row of [...index.activePacks, ...index.activeConceptShards]) if (!/^[A-Z][A-Z0-9_]*$/.test(row.id) || row.status !== "ACTIVE") fail(`invalid ACTIVE owner: ${row.id}`);
  const bump = value => /^\d+\.\d+\.\d+$/.test(value) ? value.replace(/\d+$/, n => String(Number(n) + 1)) : /^\d+$/.test(value) ? String(Number(value) + 1) : fail(`invalid canonical version: ${value}`);
  for (const entry of index.activePacks) {
    const base = `${CANON}/packs/${slug(entry.id)}`;
    const meta = readJson(`${base}/pack.json`);
    const taxonomy = readJson(`${base}/taxonomy.json`);
    const bindings = readJson(`${base}/bindings.json`);
    const aliases = readJson(`${base}/aliases.json`);
    const touched = ["pack", "taxonomy", "bindings", "aliases"].some(n => {
      const p = `${base}/${n}.json`; return !eq(readJson(p), original.get(p));
    });
    if (touched) {
      taxonomy.problemTypeCount = taxonomy.problemTypes.length;
      taxonomy.templateCount = taxonomy.templates.length;
      bindings.bindingCount = bindings.bindings.length;
      Object.assign(meta, { problemTypeCount: taxonomy.problemTypes.length, templateCount: taxonomy.templates.length, bindingCount: bindings.bindings.length, aliasCount: aliases.aliases.length });
      const old = original.get(`${base}/pack.json`);
      if (old && meta.packVersion === old.packVersion) meta.packVersion = bump(old.packVersion);
    }
    if (meta.canonicalStatus !== "ACTIVE" || !/^\d+\.\d+\.\d+$/.test(meta.packVersion)) fail(`invalid pack status/version: ${entry.id}`);
    entry.version = meta.packVersion;
  }
  for (const entry of index.activeConceptShards) {
    const file = `${CANON}/concepts/${slug(entry.id)}.json`;
    const shard = readJson(file);
    const old = original.get(file);
    if (!eq(old, shard)) {
      shard.conceptCount = shard.concepts.length;
      if (old && shard.shardVersion === old.shardVersion) shard.shardVersion = bump(old.shardVersion);
    }
    entry.version = shard.shardVersion;
    entry.conceptCount = shard.concepts.length;
  }
  const conditionPath = `${CANON}/condition_registry.json`;
  const condition = readJson(conditionPath);
  if (!eq(condition, original.get(conditionPath))) {
    condition.conditionCount = condition.conditions.length;
    index.conditionRegistry.version = bump(index.conditionRegistry.version);
  }
  const canonical = loadCanonical(readJson);
  const compiled = buildCompiled(canonical);
  const master = readJson(MASTER);
  const activeChildren = rows => new Set((rows || []).filter(row => row.keyType === "subUnitKey" &&
    ["active", "ACTIVE"].includes(row.status)).map(row => row.standardUnitKey));
  const beforeChildren = activeChildren(original.get(MASTER));
  const afterChildren = activeChildren(master);
  const beforeDirectBindings = new Set();
  for (const [file, doc] of original) {
    const match = /^archive\/data\/meta-foundation\/canonical\/packs\/[a-z0-9-]+\/bindings\.json$/.exec(file);
    if (!match) continue;
    const base = file.slice(0, -"bindings.json".length);
    const ownerPack = original.get(`${base}pack.json`)?.packId;
    for (const binding of doc?.bindings || []) if (binding.status === "ACTIVE" &&
      binding.bindingMode === "STANDARD_UNIT_DIRECT" && binding.subUnitKey === null)
      beforeDirectBindings.add(stable([binding.curriculum, binding.standardCourse, binding.standardUnitKey,
        binding.problemTypeKey, binding.ownerPack || ownerPack]));
  }
  for (const binding of compiled.curriculumBindings.bindings) {
    if (binding.status !== "ACTIVE" || binding.bindingMode !== "STANDARD_UNIT_DIRECT" || binding.subUnitKey !== null) continue;
    const identity = stable([binding.curriculum, binding.standardCourse, binding.standardUnitKey,
      binding.problemTypeKey, binding.ownerPack]);
    if (afterChildren.has(binding.standardUnitKey) &&
        (!beforeDirectBindings.has(identity) || !beforeChildren.has(binding.standardUnitKey)))
      fail(`new STANDARD_UNIT_DIRECT null-subunit binding conflicts with active child units: ${binding.standardUnitKey}/${binding.problemTypeKey}`);
  }
  const output = compiledOutputs(canonical, compiled);
  const requiredSources = [...canonical.packs.flatMap(p => ["pack", "taxonomy", "bindings", "aliases"].map(n => `${p.base}/${n}.json`)), ...canonical.shards.map(s => s.file), conditionPath];
  const indexed = new Set(index.canonicalSources.map(r => r.path));
  for (const file of requiredSources) if (!indexed.has(file)) index.canonicalSources.push({ path: file });
  const readText = file => documents.has(file) && !eq(documents.get(file), original.get(file)) ? json(documents.get(file)) : fs.readFileSync(safePath(root, file), "utf8");
  output.set(INDEX, json(buildRegistryIndex(canonical, output, readText)));
  for (const [file, doc] of documents) if (file !== INDEX && !eq(doc, original.get(file))) output.set(file, json(doc));
  return { canonical, compiled, output, master, original, readJson };
}

function lookup(plan) {
  const c = plan.compiled;
  const result = {
    packs: unique(plan.canonical.packs, p => p.meta.packId, "pack"),
    pt: unique(c.taxonomy.problemTypes, "problemTypeKey", "PT"),
    tpl: unique(c.taxonomy.templates, "templateKey", "TPL"),
    cc: unique(c.conceptRegistry.concepts, "conceptKey", "CrossConcept"),
    cond: unique(c.conditionRegistry.conditions, "conditionKey", "Condition"),
    master: unique(plan.master.filter(r => ["standardUnitKey", "subUnitKey"].includes(r.keyType)), "key", "master unit key"),
    bindings: unique(c.curriculumBindings.bindings.filter(r => r.status === "ACTIVE"), r => stable([r.curriculum, r.standardCourse, r.standardUnitKey, bindingSubUnitIdentity(r), r.problemTypeKey]), "binding")
  };
  result.applicabilityRules = c.curriculumBindings.applicabilityRules || [];
  for (const rule of result.applicabilityRules.filter(row => row.status === "ACTIVE")) {
    const exactTargetRule = rule.curriculum && rule.standardUnitKey && ["problemType", "template"].includes(rule.targetType) && rule.targetKey;
    const legacyTemplateScopeRule = rule.curriculum && rule.unitScope && Array.isArray(rule.templates) && rule.templates.length;
    if ((!exactTargetRule && !legacyTemplateScopeRule) || typeof rule.curriculumApplicability !== "string" || typeof rule.defaultSelectable !== "boolean" ||
        rule.ownerPack && !result.packs.has(rule.ownerPack)) fail(`invalid ACTIVE applicability rule: ${rule.targetKey || rule.unitScope}`);
  }
  unique([...result.pt.keys(), ...result.tpl.keys(), ...result.cc.keys(), ...result.cond.keys()].map(key => ({ key })), "key", "cross-kind canonical key");
  for (const p of result.pt.values()) if (p.status === "ACTIVE") {
    requireText(p.canonicalLabelKo, `PT label ${p.problemTypeKey}`);
    if (!result.packs.has(p.ownerPack)) fail(`PT owner missing: ${p.problemTypeKey}`);
  }
  for (const t of result.tpl.values()) if (t.status === "ACTIVE") {
    requireText(t.canonicalLabelKo, `TPL label ${t.templateKey}`);
    if (result.pt.get(t.parentProblemTypeKey)?.status !== "ACTIVE") fail(`TPL parent missing: ${t.templateKey}`);
  }
  for (const b of result.bindings.values()) {
    if (result.pt.get(b.problemTypeKey)?.status !== "ACTIVE") fail(`binding PT missing: ${b.problemTypeKey}`);
    if (!result.master.has(b.standardUnitKey) || b.subUnitKey && !result.master.has(b.subUnitKey)) fail(`binding unit missing: ${b.standardUnitKey}/${b.subUnitKey}`);
    if (b.bindingMode === "STANDARD_UNIT_DIRECT" && b.subUnitKey !== null) fail(`STANDARD_UNIT_DIRECT binding requires explicit subUnitKey:null: ${b.problemTypeKey}`);
  }
  if (c.aliases.collisions.length) fail("canonical alias collision");
  return result;
}

function assertNoOutOfScopeRegistryImpact(root, metadata, targetUids, plan, verifyEvidence) {
  const baseline = registryPlan(root, [], verifyEvidence), beforeTables = lookup(baseline), tables = lookup(plan);
  for (const row of metadata.records.filter(record => !targetUids.has(record.questionUid))) {
    const signature = current => {
      const curriculum = row.curriculum || row.curriculumKey;
      const template = current.tpl.get(row.templateKey);
      const applicabilityRules = current.applicabilityRules.filter(rule => rule.status === "ACTIVE" &&
        rule.curriculum === curriculum && rule.standardUnitKey === row.standardUnitKey &&
        (!rule.subUnitKey || rule.subUnitKey === (row.subUnitKey ?? null)) && (
          rule.targetType === "problemType" && rule.targetKey === row.problemTypeKey ||
          rule.targetType === "template" && rule.targetKey === row.templateKey ||
          rule.targetType === "template" && rule.defaultSelectable === true &&
            ["CORE", "DEFAULT_SCOPE"].includes(rule.curriculumApplicability) &&
            current.tpl.get(rule.targetKey)?.parentProblemTypeKey === row.problemTypeKey ||
          Array.isArray(rule.templates) && rule.templates.includes(row.templateKey) && rule.unitScope === template?.sourceUnit));
      const refs = [current.pt.get(row.problemTypeKey), current.tpl.get(row.templateKey), current.master.get(row.standardUnitKey), current.master.get(row.subUnitKey),
        ...(row.crossConceptKeys || []).map(key => current.cc.get(key)), ...(row.conditionKeys || []).map(key => current.cond.get(key)),
        ...[...current.bindings.values()].filter(binding => binding.curriculum === (row.curriculum || row.curriculumKey) && binding.standardUnitKey === row.standardUnitKey &&
          stable(bindingSubUnitIdentity(binding)) === stable(bindingSubUnitIdentity(row)) && binding.problemTypeKey === row.problemTypeKey),
        ...applicabilityRules];
      return stable(refs);
    };
    if (signature(beforeTables) !== signature(tables)) fail(`registry change affects out-of-scope UID: ${row.questionUid}`);
    const problemType = beforeTables.pt.get(row.problemTypeKey);
    if (problemType) {
      const was = beforeTables.packs.get(problemType.ownerPack)?.meta, now = tables.packs.get(problemType.ownerPack)?.meta;
      const curriculum = row.curriculum || row.curriculumKey, course = row.standardCourse || row.courseKey;
      if (was?.curricula?.includes(curriculum) && !now?.curricula?.includes(curriculum) ||
          was?.standardCourses?.includes(course) && !now?.standardCourses?.includes(course)) fail(`registry scope change affects out-of-scope UID: ${row.questionUid}`);
    }
  }
}

function resolve(row, tables) {
  const active = (map, key, type) => {
    const r = map.get(key);
    if (!r || r.status !== "ACTIVE") fail(`inactive/missing ${type}: ${key}`);
    return r;
  };
  const pt = active(tables.pt, row.problemTypeKey, "PT");
  const tpl = active(tables.tpl, row.templateKey, "TPL");
  if (tpl.parentProblemTypeKey !== pt.problemTypeKey) fail(`TPL parent mismatch: ${row.templateKey}`);
  for (const [field, map] of [["crossConceptKeys", tables.cc], ["conditionKeys", tables.cond]]) {
    if (!Array.isArray(row[field]) || new Set(row[field]).size !== row[field].length) fail(`invalid ${field}`);
    for (const k of row[field]) active(map, k, field);
  }
  const unit = tables.master.get(row.standardUnitKey), sub = tables.master.get(row.subUnitKey);
  if (!unit || unit.keyType !== "standardUnitKey" || !["active", "ACTIVE"].includes(unit.status)) fail(`standard unit missing: ${row.standardUnitKey}`);
  if (row.subUnitKey && (!sub || sub.keyType !== "subUnitKey" || !["active", "ACTIVE"].includes(sub.status))) fail(`subunit missing: ${row.subUnitKey}`);
  const curriculum = requireText(row.curriculum || row.curriculumKey, "curriculum");
  const course = requireText(row.standardCourse || row.courseKey, "standardCourse");
  const compactCourse = value => String(value).normalize("NFC").replace(/\s/g, "");
  if (row.curriculumKey && row.curriculumKey !== curriculum || row.courseKey && compactCourse(row.courseKey) !== compactCourse(course)) fail("curriculum/course aliases disagree");
  const unitHasCanonicalChild = [...tables.master.values()].some(candidate => candidate.keyType === "subUnitKey" &&
    candidate.standardUnitKey === row.standardUnitKey);
  let binding = tables.bindings.get(stable([curriculum, course, row.standardUnitKey, bindingSubUnitIdentity(row), row.problemTypeKey]));
  if (!binding && (row.subUnitKey === "" || row.subUnitKey == null)) {
    const directNullBindings = [...tables.bindings.values()].filter(candidate => candidate.status === "ACTIVE" &&
      candidate.bindingMode === "STANDARD_UNIT_DIRECT" && candidate.subUnitKey === null &&
      candidate.curriculum === curriculum && candidate.standardCourse === course &&
      candidate.standardUnitKey === row.standardUnitKey && candidate.problemTypeKey === row.problemTypeKey);
    if (directNullBindings.length === 1 && !unitHasCanonicalChild) {
      binding = directNullBindings[0];
      row.subUnitKey = null;
    }
  }
  if (!binding) fail(`ACTIVE curriculum binding missing: ${curriculum}/${course}/${row.problemTypeKey}`);
  if (binding.bindingMode === "STANDARD_UNIT_DIRECT" && binding.subUnitKey === null && unitHasCanonicalChild)
    fail(`STANDARD_UNIT_DIRECT null subunit conflicts with canonical child units: ${row.standardUnitKey}`);
  const pack = tables.packs.get(binding.ownerPack || pt.ownerPack);
  if (!pack || !pack.meta.curricula.includes(curriculum) || !pack.meta.standardCourses.includes(course)) fail(`binding ownerPack scope missing: ${binding.ownerPack || pt.ownerPack}/${curriculum}/${course}`);
  const rulesInScope = tables.applicabilityRules.filter(rule => rule.status === "ACTIVE" && rule.curriculum === curriculum &&
    rule.standardUnitKey === row.standardUnitKey && (!rule.subUnitKey || rule.subUnitKey === (row.subUnitKey ?? null)));
  const matches = rulesInScope.filter(rule => rule.targetType === "problemType" && rule.targetKey === row.problemTypeKey ||
    rule.targetType === "template" && rule.targetKey === row.templateKey);
  const legacyTemplateRules = tables.applicabilityRules.filter(rule => rule.status === "ACTIVE" && rule.curriculum === curriculum &&
    Array.isArray(rule.templates) && rule.templates.includes(row.templateKey) && rule.unitScope === tpl.sourceUnit);
  matches.push(...legacyTemplateRules);
  const positiveTemplateScope = rulesInScope.some(rule => rule.targetType === "template" && rule.defaultSelectable === true &&
    ["CORE", "DEFAULT_SCOPE"].includes(rule.curriculumApplicability) &&
    tables.tpl.get(rule.targetKey)?.parentProblemTypeKey === row.problemTypeKey);
  if (positiveTemplateScope && !matches.some(rule => rule.targetType === "template" && rule.targetKey === row.templateKey))
    fail(`ACTIVE template applicability rule required: ${curriculum}/${row.standardUnitKey}/${row.templateKey}`);
  if (matches.length > 1 && new Set(matches.map(rule => stable([rule.curriculumApplicability, rule.defaultSelectable]))).size > 1)
    fail(`conflicting ACTIVE applicability rules: ${curriculum}/${row.standardUnitKey}/${row.problemTypeKey}/${row.templateKey}`);
  const applicabilityRule = matches.at(-1) || null;
  return { pt, tpl, unit, sub, binding, pack, curriculum, course, applicabilityRule };
}

function resolutionSnapshot(row, resolved, tables) {
  return {
    pack: { packId: resolved.pack.meta.packId, canonicalStatus: resolved.pack.meta.canonicalStatus,
      curriculumInScope: resolved.pack.meta.curricula.includes(resolved.curriculum), courseInScope: resolved.pack.meta.standardCourses.includes(resolved.course) },
    problemType: resolved.pt,
    template: resolved.tpl,
    standardUnit: resolved.unit,
    subUnit: resolved.sub ?? null,
    binding: resolved.binding,
    applicabilityRule: resolved.applicabilityRule,
    crossConcepts: row.crossConceptKeys.map(key => tables.cc.get(key)),
    conditions: row.conditionKeys.map(key => tables.cond.get(key)),
  };
}

function normalizeApplicability(value) {
  return value === "CORE" ? "DEFAULT_SCOPE" : value;
}

function applyEffectiveApplicability(row, patch, resolved) {
  const source = resolved.applicabilityRule || resolved.binding;
  const sourceApplicability = source.curriculumApplicability;
  const sourceSelectable = source.defaultSelectable;
  let applicability = normalizeApplicability(sourceApplicability || row.curriculumApplicability || "DEFAULT_SCOPE");
  let selectable = sourceSelectable ?? row.defaultSelectable ?? true;
  if (sourceApplicability === "CORE") {
    if (sourceSelectable === false) fail(`CORE applicability cannot disable default selection: ${row.questionUid}`);
    applicability = "DEFAULT_SCOPE";
    selectable = true;
  }
  if (applicability === "SUPPLEMENTARY_OUTSIDE_CORE" && selectable) fail(`outside-core applicability cannot be default-selectable: ${row.questionUid}`);
  if (Object.hasOwn(patch.after, "curriculumApplicability") && normalizeApplicability(patch.after.curriculumApplicability) !== applicability)
    fail(`approved applicability conflicts with canonical rule: ${row.questionUid}`);
  if (Object.hasOwn(patch.after, "defaultSelectable") && patch.after.defaultSelectable !== selectable)
    fail(`approved selectability conflicts with canonical rule: ${row.questionUid}`);
  row.curriculumApplicability = applicability;
  row.defaultSelectable = selectable;
}

function crosswalkSummary(records) {
  const statuses = ["DIRECT_ACTIVE", "FAMILY_ACTIVE", "DIRECT_BINDING_GAP", "FAMILY_BINDING_GAP", "RPM_ONLY"];
  const summary = { recordCount: records.length, ...Object.fromEntries(statuses.map(status => [status, 0])), byScope: {} };
  for (const row of records) {
    const status = row.mappingStatus;
    if (!statuses.includes(status)) fail(`unsupported crosswalk mapping status: ${status}`);
    summary[status]++;
    const scope = row.scope || "";
    if (!summary.byScope[scope]) summary.byScope[scope] = Object.fromEntries(statuses.map(key => [key, 0]));
    summary.byScope[scope][status]++;
  }
  return summary;
}

function plannedRegistrySha(plan) {
  const readFinal = relative => plan.output.has(relative) ? JSON.parse(plan.output.get(relative)) : plan.readJson(relative);
  const registry = {
    index: readFinal(INDEX),
    rules: readFinal(`${CANON}/metadata_rules.json`),
    conditionsCanonical: readFinal(`${CANON}/condition_registry.json`),
    taxonomy: readFinal("archive/data/meta-foundation/compiled/taxonomy_registry.json"),
    concepts: readFinal("archive/data/meta-foundation/compiled/concept_registry.json"),
    conditions: readFinal("archive/data/meta-foundation/compiled/condition_registry.json"),
    bindings: readFinal("archive/data/meta-foundation/compiled/curriculum_bindings.json"),
  };
  return `sha256:${digest(JSON.stringify(registry))}`;
}

function actionMainRevision(root, request) {
  if (fs.existsSync(path.join(root, ".git"))) return execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  if (/^[a-f0-9]{40}$/.test(request.actionMainSha || "")) return request.actionMainSha;
  fail("actionMainSha required when Git revision is unavailable");
}

function refreshCrosswalkPaths(root, plan, refreshes, request) {
  if (!Array.isArray(refreshes) || !refreshes.length) fail("crosswalkRefreshPaths required");
  const outputs = new Map(), witnesses = [];
  const registrySha = plannedRegistrySha(plan), revision = actionMainRevision(root, request);
  for (const refresh of refreshes) {
    const relative = refresh.path;
    if (typeof relative !== "string" || !/^archive\/data\/meta-foundation\/crosswalks\/rpm-primary-v1\.0\/[a-z0-9][a-z0-9-]*\.json$/.test(relative)) fail(`crosswalk path outside allowlist: ${relative}`);
    const full = safePath(root, relative), beforeBytes = fs.readFileSync(full);
    if (outputs.has(relative)) fail(`duplicate crosswalk refresh path: ${relative}`);
    if (!/^[a-f0-9]{64}$/.test(refresh.expectedBeforeSha256 || "") || digest(beforeBytes) !== refresh.expectedBeforeSha256) fail(`crosswalk before SHA drift: ${relative}`);
    const data = JSON.parse(beforeBytes.toString("utf8"));
    const curriculum = requireText(refresh.selector?.curriculum, "crosswalk selector curriculum");
    const scope = requireText(refresh.selector?.scope, "crosswalk selector scope");
    if (!Number.isInteger(refresh.expectedRecordCount) || refresh.expectedRecordCount < 1) fail("crosswalk expectedRecordCount required");
    const selected = data.records.filter(row => row.curriculum === curriculum && row.scope === scope);
    if (selected.length !== refresh.expectedRecordCount) fail(`crosswalk selector denominator mismatch: ${relative}/${curriculum}/${scope}`);
    const replacements = new Map();
    for (const row of selected) {
      const statusMap = { DIRECT_BINDING_GAP: "DIRECT_ACTIVE", FAMILY_BINDING_GAP: "FAMILY_ACTIVE" };
      const nextStatus = statusMap[row.mappingStatus];
      if (!nextStatus || row.bindingStatus === "ACTIVE") fail(`crosswalk row is not a binding gap: ${row.id}`);
      const standardCourse = refresh.selector.standardCourse || scope;
      const bindings = plan.compiled.curriculumBindings.bindings.filter(binding => binding.status === "ACTIVE" && binding.curriculum === curriculum &&
        binding.standardCourse === standardCourse && binding.standardUnitKey === row.standardUnitKey &&
        (binding.subUnitKey ?? null) === (row.subUnitKey ?? null) && binding.problemTypeKey === row.problemTypeKey && binding.ownerPack === row.ownerPack);
      if (bindings.length !== 1) fail(`crosswalk exact ACTIVE binding count ${bindings.length}: ${row.id}`);
      const binding = bindings[0];
      const next = { ...row, mappingStatus: nextStatus, bindingStatus: "ACTIVE", binding: {
        curriculum: binding.curriculum, standardCourse: binding.standardCourse, standardUnitKey: binding.standardUnitKey,
        subUnitKey: binding.subUnitKey ?? null, ownerPack: binding.ownerPack,
      } };
      for (const key of Object.keys(row)) if (!["mappingStatus", "bindingStatus", "binding"].includes(key) && !eq(row[key], next[key])) fail(`crosswalk semantic parity changed: ${row.id}.${key}`);
      replacements.set(row.id, next);
    }
    data.records = data.records.map(row => replacements.get(row.id) || row);
    if (data.records.filter(row => row.curriculum === curriculum && row.scope === scope).some(row => !replacements.has(row.id))) fail(`crosswalk selector row changed outside refresh: ${relative}`);
    data.summary = crosswalkSummary(data.records);
    if (!eq(data.summary, refresh.expectedSummary)) fail(`crosswalk summary mismatch: ${relative}`);
    data.generatedAgainstMain = revision;
    data.activeAuthority = { ...(data.activeAuthority || {}), source: "archive/data/meta-foundation/canonical/",
      packs: [...new Set(data.records.map(row => row.ownerPack).filter(Boolean))], registrySha };
    const text = json(data);
    outputs.set(relative, text);
    witnesses.push({ path: relative, beforeSha256: digest(beforeBytes), afterSha256: digest(text), curriculum, scope,
      standardCourse: refresh.selector.standardCourse || scope, rowCount: selected.length,
      refreshedRows: selected.map(row => replacements.get(row.id)) });
  }
  return { outputs, witnesses, generatedAgainstMain: revision, registrySha };
}

const transactionRoot = root => path.join(root, ".archive-meta-register", "transactions");

function readTransactionJournal(dir) {
  const journalPath = path.join(dir, "journal.json");
  return fs.existsSync(journalPath) ? JSON.parse(fs.readFileSync(journalPath, "utf8")) : null;
}

function writeTransactionJournal(dir, journal) {
  const temp = path.join(dir, "journal.next.json");
  fs.writeFileSync(temp, json(journal), { flag: "w" });
  fs.renameSync(temp, path.join(dir, "journal.json"));
}

function restoreTransaction(root, dir, journal) {
  for (const entry of journal.entries) {
    const full = safePath(root, entry.path);
    if (entry.hadOriginal) fs.copyFileSync(path.join(dir, entry.backup), full);
    else fs.rmSync(full, { force: true });
  }
}

function recoverRegistrationTransactions(root) {
  const base = transactionRoot(root);
  if (!fs.existsSync(base)) return;
  for (const name of fs.readdirSync(base).sort()) {
    const dir = path.join(base, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    const journal = readTransactionJournal(dir);
    if (journal && journal.state !== "COMMITTED") restoreTransaction(root, dir, journal);
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function hasPendingRegistrationTransactions(root) {
  const base = transactionRoot(root);
  return fs.existsSync(base) && fs.readdirSync(base).some(name => {
    const dir = path.join(base, name);
    const journal = fs.statSync(dir).isDirectory() ? readTransactionJournal(dir) : null;
    return journal?.state !== "COMMITTED";
  });
}

export function commitRegistrationFiles(root, files, { beforeInstall = null } = {}) {
  const base = transactionRoot(root);
  fs.mkdirSync(base, { recursive: true });
  const dir = path.join(base, crypto.randomUUID());
  fs.mkdirSync(dir);
  const entries = [];
  try {
    for (const [relative, text] of files) {
      const full = safePath(root, relative);
      fs.mkdirSync(path.dirname(full), { recursive: true });
      const index = entries.length;
      const staged = `staged-${index}.tmp`, backup = `backup-${index}.tmp`;
      const hadOriginal = fs.existsSync(full);
      if (hadOriginal) fs.copyFileSync(full, path.join(dir, backup));
      fs.writeFileSync(path.join(dir, staged), text, { flag: "wx" });
      entries.push({ path: relative, staged, backup, hadOriginal });
    }
    const journal = { schemaVersion: "archive-meta-registration-transaction-v1", state: "PREPARED", entries };
    writeTransactionJournal(dir, journal);
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      beforeInstall?.(i, entry);
      fs.renameSync(path.join(dir, entry.staged), safePath(root, entry.path));
    }
    writeTransactionJournal(dir, { ...journal, state: "COMMITTED" });
    fs.rmSync(dir, { recursive: true, force: true });
  } catch (error) {
    const journal = readTransactionJournal(dir);
    if (journal?.state !== "COMMITTED") {
      if (journal) restoreTransaction(root, dir, journal);
      else for (const entry of entries) if (!entry.hadOriginal) fs.rmSync(safePath(root, entry.path), { force: true });
    }
    fs.rmSync(dir, { recursive: true, force: true });
    throw error;
  }
}

function labelsFor(patch, row, resolved, read, sourceBlob) {
  const base = { L1: resolved.binding.L1 || resolved.unit.labelKo, L2: resolved.binding.L2 || resolved.sub?.labelKo || "", L3: resolved.pt.canonicalLabelKo, L4: resolved.tpl.canonicalLabelKo };
  const withTargetParent = labels => {
    if (!patch.targetParentRef) return labels;
    const ref = patch.targetParentRef;
    const masterPath = "docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json";
    if (ref.path !== masterPath || !(patch.evidenceRefs || []).some(e => e.path === ref.path)) fail("target parent reference is not evidence-bound");
    const compact = value => String(value).normalize("NFC").replace(/\s/g, "");
    const matches = (read(masterPath).records || []).filter(r => r.curriculum === ref.curriculum && r.scope === ref.scope && r.majorUnit === ref.majorUnit && r.midUnit === ref.midUnit);
    if (!matches.length || ref.curriculum !== resolved.curriculum || compact(ref.scope) !== compact(row.courseKey || resolved.course) ||
        ref.midUnit !== (resolved.binding.L2 || resolved.unit.labelKo) || resolved.binding.L1 && ref.majorUnit !== resolved.binding.L1) fail("canonical target parent mismatch");
    return { ...labels, L1: ref.majorUnit, L2: ref.midUnit };
  };
  if (patch.approvedMetadataRef) {
    if (patch.semanticBinding) fail("ambiguous semantic approval reference");
    const ref = patch.approvedMetadataRef;
    if (!/^archive\/data\/meta-foundation\/exam-scoped\/[^/]+\.json$/.test(ref.path || "") ||
        !(patch.evidenceRefs || []).some(e => e.path === ref.path)) fail("approved metadata reference is not evidence-bound");
    const doc = read(ref.path);
    if (doc.schemaVersion !== "archive-exam-scoped-metadata-v1" || doc.purpose !== "EXAM_SCOPED_CANONICAL_METADATA_EXPORT" ||
        !/^ACTIVE_SEMANTIC_VERIFIED(?:__|$)/.test(doc.status || "") || doc.sourceArchiveFile !== row.sourceArchiveFile ||
        doc.sourceBlobSha !== sourceBlob || doc.recordCount !== doc.records?.length) fail("approved metadata source/schema drift");
    const matches = doc.records.filter(r => r.questionUid === row.questionUid && r.sourceOrdinal === row.sourceOrdinal);
    if (matches.length !== 1 || ref.questionUid !== row.questionUid) fail("approved metadata UID/ordinal mismatch");
    const approvedRow = matches[0];
    if (approvedRow.reviewStatus !== "reviewed_pass" || approvedRow.bindingResolutionStatus !== "RESOLVED" ||
        ["curriculumKey", "standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"].some(k => !eq(approvedRow[k], row[k]))) fail("approved metadata classification drift");
    return withTargetParent(Object.fromEntries(["L1", "L2", "L3", "L4"].map(k => [k, requireText(approvedRow[k], `approved ${k}`)])));
  }
  if (!patch.semanticBinding) return withTargetParent(base);
  const load = (file, id) => {
    if (!/^archive\/data\/meta-foundation\/crosswalks\/rpm-primary-v1\.0\/[a-z0-9-]+\.json$/.test(file || "")) fail("invalid semantic crosswalk path");
    const doc = read(file), matches = (doc.records || []).filter(r => r.id === id);
    if (matches.length !== 1) fail(`semantic crosswalk record missing/ambiguous: ${id}`);
    return { doc, record: matches[0] };
  };
  const spec = patch.semanticBinding;
  const semantic = load(spec.crosswalkPath, spec.recordId);
  const target = load(spec.targetCrosswalkPath || spec.crosswalkPath, spec.targetRecordId || spec.recordId);
  const s = semantic.record, t = target.record;
  if (s.problemTypeKey !== row.problemTypeKey || s.templateKey !== row.templateKey || s.bindingStatus !== "ACTIVE") fail(`RPM/PT/TPL mismatch: ${row.questionUid}`);
  if (t.curriculum !== resolved.curriculum || t.scope !== resolved.course || t.standardUnitKey !== row.standardUnitKey || (t.subUnitKey ?? null) !== (row.subUnitKey ?? null)) fail(`RPM target scope mismatch: ${row.questionUid}`);
  if (s.curriculum !== t.curriculum || s.scope !== t.scope) {
    const rank = grade => ({ 중1: 1, 중2: 2, 중3: 3, 고1: 4, 고2: 5, 고3: 6, M1: 1, M2: 2, M3: 3, H1: 4, H2: 5, H3: 6 })[grade] || 0;
    if (row.semanticScopeRelation !== "PREREQUISITE_LOWER_GRADE" || !rank(semantic.doc.grade) || rank(semantic.doc.grade) >= rank(target.doc.grade)) fail(`invalid prerequisite semantic scope: ${row.questionUid}`);
  }
  return withTargetParent({ L1: requireText(t.rpmPath?.majorUnit, "target RPM L1"), L2: requireText(t.rpmPath?.midUnit, "target RPM L2"),
    L3: requireText(s.rpmPath?.l3, "semantic RPM L3"), L4: requireText(s.rpmPath?.l4, "semantic RPM L4") });
}

// The caller first binds the complete source file to expectedSourceBlobSha1.
// Hashes supplied by a request are assertions, never the fingerprint authority.
export function validateReviewedSourceFingerprints({ question: q, metadata, identity, patch }) {
  const uid = metadata.questionUid;
  const sourceFingerprint = digest(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null,
    answer: q.answer ?? null, solution: q.solution ?? null, image: q.image ?? null }));
  const contentFingerprint = digest(JSON.stringify({ content: q.content ?? null, choices: Array.isArray(q.choices) ? q.choices : null, image: q.image ?? null }));
  const requested = Object.hasOwn(patch.after, "sourceFingerprint");
  if (requested) {
    for (const [key, value] of Object.entries({ sourceFingerprint, contentFingerprint })) {
      if (!Object.hasOwn(patch.after, key) || !Object.hasOwn(patch.before, key)) fail(`fingerprint repair before/after required: ${uid}.${key}`);
      if (!eq(patch.before[key], metadata[key] ?? null)) fail(`fingerprint before mismatch: ${uid}.${key}`);
      if (patch.after[key] !== value) fail(`computed fingerprint mismatch: ${uid}.${key}`);
    }
  }
  if (Object.hasOwn(patch.after, "contentFingerprint") && patch.after.contentFingerprint !== contentFingerprint)
    fail(`computed fingerprint mismatch: ${uid}.contentFingerprint`);
  if ((patch.after.sourceFingerprint ?? metadata.sourceFingerprint) !== sourceFingerprint) fail(`source fingerprint drift: ${uid}`);
  if (patch.identityBefore !== undefined) {
    const before = patch.identityBefore;
    if (!before || typeof before !== "object" || Array.isArray(before) || Object.keys(before).length !== 1 ||
        !Object.hasOwn(before, "sourceFingerprint") || before.sourceFingerprint !== identity.sourceFingerprint)
      fail(`identity fingerprint before mismatch: ${uid}`);
  }
  const identityChanged = identity.sourceFingerprint !== sourceFingerprint;
  if (identityChanged && (!requested || patch.identityBefore === undefined)) fail(`identity fingerprint before required: ${uid}`);
  return { sourceFingerprint, contentFingerprint, identityChanged,
    identityAfter: identityChanged ? { ...identity, sourceFingerprint } : { ...identity } };
}

export function registerReviewedExamV2({ root, request: req, write = false, verifyProjection = false }) {
  if (write) recoverRegistrationTransactions(root);
  else if (hasPendingRegistrationTransactions(root)) fail("unfinished registration transaction; rerun with --write to recover");
  if (req.schemaVersion !== "archive-reviewed-exam-meta-register-request-v2") fail("request schema mismatch");
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(req.requestId || "")) fail("valid requestId required");
  requireText(req.examUid, "examUid");
  if (!["REVIEW2", "FINAL_QA"].includes(req.approval?.type) || req.approval.metadataReviewed !== true) fail("metadata approval required");
  if (req.approval.type === "REVIEW2" && req.approval.reviewPassCount !== 2) fail("REVIEW2 count must be 2");
  requireText(req.approval.approvedBy, "approvedBy");
  const evidenceRefs = refs => {
    if (!Array.isArray(refs) || !refs.length) fail("evidenceRefs required");
    for (const ref of refs) {
      if (!/^[a-f0-9]{64}$/.test(ref.sha256 || "")) fail("evidence SHA-256 required");
      const full = safePath(root, ref.path);
      if (!fs.existsSync(full) || digest(fs.readFileSync(full)) !== ref.sha256) fail(`evidence missing/drift: ${ref.path}`);
    }
  };
  evidenceRefs(req.approval.evidenceRefs);
  if (!Array.isArray(req.items) || req.registryChanges !== undefined && !Array.isArray(req.registryChanges)) fail("items/registryChanges must be arrays");
  for (const item of req.items) evidenceRefs(item.evidenceRefs);
  for (const change of req.registryChanges || []) evidenceRefs(change.evidenceRefs);
  const source = requireText(req.sourceArchiveFile, "sourceArchiveFile");
  if (!source.endsWith(".js") || source.startsWith("archive/") || source.startsWith("exams/")) fail("sourceArchiveFile must be archive/exams-relative");
  const bytes = fs.readFileSync(safePath(root, `archive/exams/${source}`));
  const blob = fs.existsSync(path.join(root, ".git"))
    ? execFileSync("git", ["hash-object", "--path", `archive/exams/${source}`, "--stdin"], { cwd: root, input: bytes, encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] }).trim()
    : crypto.createHash("sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex");
  if (req.expectedSourceBlobSha1 !== blob) fail("source Git blob drift");
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || ctx.questionBank || ctx.window.examData?.questions;
  if (!Array.isArray(bank) || !Number.isInteger(req.expectedQuestionCount) || bank.length !== req.expectedQuestionCount || !bank.length) fail("source denominator mismatch");
  const read = file => JSON.parse(fs.readFileSync(safePath(root, file), "utf8"));
  const metadata = read(META), identity = read(IDENTITY);
  const metadataByUid = unique(metadata.records, "questionUid", "metadata UID");
  unique(metadata.records, r => `${r.sourceArchiveFile}#${r.sourceOrdinal}`, "metadata source ordinal");
  const ids = unique(identity.records, "questionUid", "identity UID");
  const rows = metadata.records.filter(r => r.sourceArchiveFile === source).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  const patches = unique(req.items || [], "questionUid", "request UID");
  if (rows.length !== bank.length || patches.size !== bank.length || identity.records.filter(r => r.sourceArchiveFile === source).length !== bank.length) fail("UID denominator mismatch");
  const requestSha256 = digest(stable(req));
  const receiptPath = `${RECEIPTS}/${req.requestId}.json`;
  const receiptFull = safePath(root, receiptPath);
  const previous = fs.existsSync(receiptFull) ? read(receiptPath) : null;
  if (previous && previous.requestSha256 !== requestSha256) fail("requestId reused with different content");
  if (previous) {
    for (const record of previous.appliedRecords) if (!eq(rows.find(r => r.questionUid === record.questionUid), record)) fail(`registered metadata drift: ${record.questionUid}`);
    for (const record of previous.appliedIdentityRecords || []) if (!eq(ids.get(record.questionUid), record)) fail(`registered identity drift: ${record.questionUid}`);
    const currentPlan = registryPlan(root, [], evidenceRefs), currentTables = lookup(currentPlan);
    const priorResolutionByUid = new Map((previous.canonicalResolutions || []).map(record => [record.questionUid, record.snapshot]));
    for (const record of previous.appliedRecords) {
      const r = resolve(record, currentTables);
      const labels = labelsFor(patches.get(record.questionUid), record, r, read, blob);
      for (const [key, value] of Object.entries(labels)) if (record[key] !== value) fail(`registered canonical label drift: ${record.questionUid}.${key}`);
      if (!eq(priorResolutionByUid.get(record.questionUid), resolutionSnapshot(record, r, currentTables))) fail(`registered canonical meaning drift: ${record.questionUid}`);
    }
    // outputDigests are historical write witnesses. Shared metadata/runtime and
    // compiled files may legitimately change when a later request registers a
    // different exam; replay is bound to this request's UID records and exact
    // canonical semantic dependencies below, not whole shared-file hashes.
    const allRuntime = fs.readdirSync(safePath(root, "archive/data/meta-foundation/runtime")).filter(n => n.endsWith(".json") && n !== "runtime-bridge-receipt.json").flatMap(n => read(`archive/data/meta-foundation/runtime/${n}`).records || []);
    for (const record of previous.runtimeRecords) {
      const found = allRuntime.filter(r => r.questionUid === record.questionUid);
      if (found.length !== 1 || !eq(found[0], record)) fail(`registered runtime drift: ${record.questionUid}`);
    }
    if (verifyProjection) verifyConsumer(root, previous.appliedRecords, previous.runtimeRecords, read);
    return { status: "PASS", requestId: req.requestId, totalQuestions: rows.length, replay: true, plannedPaths: [],
      consumerSearchStatus: verifyProjection ? "STATIC_VALUES_VERIFIED" : "NOT_RUN", browserStatus: "NOT_RUN" };
  }
  if (verifyProjection) fail("registration receipt required before --verify-projection");
  const targetUids = new Set(rows.map(r => r.questionUid));
  const plan = registryPlan(root, req.registryChanges || [], evidenceRefs);
  const tables = lookup(plan);
  for (const change of req.registryChanges || []) {
    const row = change.after;
    if (change.path === MASTER && row?.keyType === "subUnitKey" && ["active", "ACTIVE"].includes(row.status)) {
      if (tables.master.get(row.standardUnitKey || row.parentKey)?.keyType !== "standardUnitKey" || row.parentKey && row.standardUnitKey && row.parentKey !== row.standardUnitKey) fail(`subunit parent mismatch: ${row.key}`);
    }
  }
  // A shared definition may evolve only when it leaves all out-of-scope approved
  // consumers identical. Migrations involving another exam need its own request.
  if (req.registryChanges?.length) assertNoOutOfScopeRegistryImpact(root, metadata, targetUids, plan, evidenceRefs);
  const runtimeRoot = "archive/data/meta-foundation/runtime";
  const runtimes = new Map();
  for (const name of fs.readdirSync(safePath(root, runtimeRoot)).filter(n => n.endsWith(".json") && n !== "runtime-bridge-receipt.json")) {
    const file = `${runtimeRoot}/${name}`, data = read(file);
    if (!data.packId || !Array.isArray(data.records) || runtimes.has(data.packId)) fail(`runtime pack malformed/duplicate: ${file}`);
    runtimes.set(data.packId, { file, data });
  }
  const owners = new Map();
  for (const [pack, item] of runtimes) for (const r of item.data.records) {
    if (owners.has(r.questionUid)) fail(`duplicate runtime UID: ${r.questionUid}`);
    owners.set(r.questionUid, pack);
  }
  const touched = new Set(), applied = [], runtimeRecords = [], appliedIdentityRecords = [], fingerprintRepairs = [], canonicalResolutions = [];
  let identityChanged = false;
  for (let i = 0; i < bank.length; i++) {
    const current = rows[i], patch = patches.get(current.questionUid), q = JSON.parse(JSON.stringify(bank[i]));
    const id = ids.get(current.questionUid);
    if (!patch || patch.sourceOrdinal !== i + 1 || current.sourceOrdinal !== i + 1 || id?.sourceArchiveFile !== source || id.sourceOrdinal !== i + 1) fail(`UID/source ordinal mismatch #${i + 1}`);
    if (q.questionUid && q.questionUid !== current.questionUid) fail(`source UID mismatch #${i + 1}`);
    evidenceRefs(patch.evidenceRefs);
    requireText(patch.reason, `UID ${current.questionUid} semantic reason`);
    if (!patch.after || typeof patch.after !== "object" || Array.isArray(patch.after) || !patch.before || typeof patch.before !== "object" || Array.isArray(patch.before)) fail(`before/after required: ${current.questionUid}`);
    for (const [field, value] of Object.entries(patch.before)) if (!valueFields.has(field) || !eq(current[field] ?? null, value)) fail(`before mismatch: ${current.questionUid}.${field}`);
    for (const [field, value] of Object.entries(patch.after)) {
      if (!valueFields.has(field)) fail(`unapproved field: ${field}`);
      if (!Object.hasOwn(patch.before, field)) fail(`before required: ${current.questionUid}.${field}`);
    }
    const final = { ...current, ...structuredClone(patch.after) };
    for (const f of sourceFields) if (Object.hasOwn(q, f)) {
      const sourceValue = q[f];
      const sourceIsBlank = sourceValue == null || typeof sourceValue === "string" && !sourceValue.trim() || Array.isArray(sourceValue) && sourceValue.length === 0;
      if (!sourceIsBlank && !eq(sourceValue, final[f])) fail(`source/approved metadata parity: ${current.questionUid}.${f}`);
    }
    const checked = validateReviewedSourceFingerprints({ question: q, metadata: current, identity: id, patch });
    const fingerprint = checked.sourceFingerprint;
    if (!Object.hasOwn(patch.after, "contentFingerprint") && current.contentFingerprint != null && current.contentFingerprint !== checked.contentFingerprint)
      fail(`content fingerprint drift: ${current.questionUid}`);
    if (!Object.hasOwn(patch.after, "contentFingerprint")) final.contentFingerprint = checked.contentFingerprint;
    if (checked.identityChanged || Object.hasOwn(patch.after, "sourceFingerprint")) fingerprintRepairs.push({
      questionUid: current.questionUid, sourceOrdinal: i + 1,
      metadataBefore: { sourceFingerprint: current.sourceFingerprint ?? null, contentFingerprint: current.contentFingerprint ?? null },
      identityBefore: { sourceFingerprint: id.sourceFingerprint },
      after: { sourceFingerprint: checked.sourceFingerprint, contentFingerprint: checked.contentFingerprint }
    });
    if (checked.identityChanged) { Object.assign(id, checked.identityAfter); identityChanged = true; }
    appliedIdentityRecords.push(structuredClone(id));
    if (!["하", "중", "상"].includes(final.level) || !Number.isInteger(final.difficultyBucket) || final.difficultyBucket < 1 || final.difficultyBucket > 5) fail(`level/difficulty invalid: ${current.questionUid}`);
    requireText(final.integrationPattern, "integrationPattern (explicit NONE if not applicable)");
    const resolved = resolve(final, tables), { pt, tpl, unit, sub, pack, curriculum, course } = resolved;
    applyEffectiveApplicability(final, patch, resolved);
    canonicalResolutions.push({ questionUid: current.questionUid, snapshot: resolutionSnapshot(final, resolved, tables) });
    for (const [field, label] of Object.entries(labelsFor(patch, final, resolved, read, blob))) {
      if (Object.hasOwn(patch.after, field) && patch.after[field] !== label) fail(`canonical label mismatch: ${current.questionUid}.${field}`);
      if (approved(current) && current[field] !== label && !Object.hasOwn(patch.before, field)) fail(`before required for derived label: ${current.questionUid}.${field}`);
      final[field] = label;
    }
    const revision = `meta-foundation:${pack.meta.packId}@${pack.meta.packVersion}:exam-${req.approval.type.toLowerCase()}-v2:${req.requestId}`;
    Object.assign(final, { curriculum, curriculumKey: curriculum, standardCourse: course, courseKey: final.courseKey || course,
      reviewStatus: "reviewed_pass", metadataStatus: "approved_semantic_review", metadataRevision: revision,
      tagStatus: "reviewed_pass", tagConfidence: req.approval.type === "REVIEW2" ? "independent_review2" : "approved_final_qa",
      foundationTaxonomyStatus: "CONFIRMED", projectionStatus: "REUSE", metaFoundationStatus: "ACTIVE",
      metaFoundationPackId: pack.meta.packId, metaFoundationPackVersion: pack.meta.packVersion, metaFoundationHoldReason: null,
      l3Disposition: "ASSIGNED", l4Disposition: "ASSIGNED", curriculumApplicability: final.curriculumApplicability || "DEFAULT_SCOPE",
      defaultSelectable: final.defaultSelectable !== false, approvalEvidence: [...new Set([...(current.approvalEvidence || []), receiptPath])],
      fieldStatus: { ...(current.fieldStatus || {}), ...Object.fromEntries(["standardUnit", "subUnit", "concept", "problemType", "template", "crossConcept", "condition", "integrationPattern", "difficulty"].map(k => [k, req.approval.type === "REVIEW2" ? "approved_review2" : "approved_final_qa"])) }
    });
    const packId = pack.meta.packId;
    if (!runtimes.has(packId)) {
      const file = `${runtimeRoot}/${slug(packId)}-v1.json`;
      if (fs.existsSync(safePath(root, file))) fail(`runtime output path conflict: ${file}`);
      runtimes.set(packId, { file, data: { schemaVersion: "meta-foundation-runtime-v1", status: "ACTIVE", packId, packVersion: pack.meta.packVersion,
        runtimeVersion: `${packId}@${pack.meta.packVersion}/reviewed-exam-v2`, counts: {}, records: [], taxonomyRows: [], ownedScopes: [] } });
    }
    const oldOwner = owners.get(current.questionUid);
    if (oldOwner && oldOwner !== packId) {
      const old = runtimes.get(oldOwner);
      old.data.records = old.data.records.filter(r => r.questionUid !== current.questionUid); touched.add(oldOwner);
    }
    const rr = { ...final, sourceQuestionNo: String(q.sourceQuestionNo ?? q.id ?? ""), sourceIdentity: `${source}#${i + 1}`,
      approvedSourceFingerprint: fingerprint, legacyLevel: final.level,
      runtimeSelectable: final.defaultSelectable && final.curriculumApplicability === "DEFAULT_SCOPE" };
    const rt = runtimes.get(packId).data;
    rt.records = rt.records.filter(r => r.questionUid !== current.questionUid); rt.records.push(rr);
    touched.add(packId);
    Object.assign(current, final); applied.push(structuredClone(final)); runtimeRecords.push(rr);
  }
  for (const [packId, item] of runtimes) for (const row of item.data.records) {
    if (targetUids.has(row.questionUid) || !req.registryChanges?.length) continue;
    // Retiring/removing a native key must also preserve non-approved runtime consumers.
    if (row.problemTypeKey) {
      const old = metadataByUid.get(row.questionUid);
      if (!old) fail(`runtime without metadata: ${row.questionUid}`);
      if (!tables.packs.has(packId) || tables.pt.get(row.problemTypeKey)?.status !== "ACTIVE" || row.templateKey && tables.tpl.get(row.templateKey)?.status !== "ACTIVE") fail(`registry change breaks runtime UID: ${row.questionUid}`);
    }
  }
  for (const packId of touched) {
    const item = runtimes.get(packId);
    if (item.data.records.some(row => targetUids.has(row.questionUid))) {
      item.data.generatedFrom = { ...(item.data.generatedFrom || {}), [`reviewedExam_${req.requestId}`]: receiptPath };
    }
    const version = tables.packs.get(packId)?.meta.packVersion;
    if (version) { item.data.packVersion = version; item.data.runtimeVersion = `${packId}@${version}/reviewed-exam-v2`; }
    item.data.records.sort((a, b) => a.questionUid.localeCompare(b.questionUid, "en"));
    refreshRuntime(item.data);
    plan.output.set(item.file, json(item.data));
  }
  metadata.reviewedPassCount = metadata.records.filter(r => r.reviewStatus === "reviewed_pass").length;
  metadata.counts = { ...(metadata.counts || {}), records: metadata.records.length,
    uidUnique: true, sourceJoinUnique: true, semanticallyReviewed: metadata.records.filter(approved).length };
  if (Object.hasOwn(metadata.counts, "explicitProblemTypeHolds")) metadata.counts.explicitProblemTypeHolds = metadata.records.filter(r => r.fieldStatus?.problemType === "manual_review_pending").length;
  if (Object.hasOwn(metadata.counts, "explicitTemplateHolds")) metadata.counts.explicitTemplateHolds = metadata.records.filter(r => r.fieldStatus?.template === "manual_review_pending").length;
  if (Object.hasOwn(metadata.counts, "explicitDifficultyHolds")) metadata.counts.explicitDifficultyHolds = metadata.records.filter(r => r.fieldStatus?.difficulty === "manual_review_pending").length;
  plan.output.set(META, json(metadata));
  if (identityChanged) {
    // Retain UID, source ordinal, lookups and unrelated identity records.
    const stableIdentity = { ...identity }; delete stableIdentity.generatedAt; delete stableIdentity.identityDigest;
    identity.identityDigest = digest(JSON.stringify(stableIdentity));
    plan.output.set(IDENTITY, JSON.stringify(identity) + "\n");
  }
  const outputDigests = [...plan.output].map(([file, text]) => ({ path: file, sha256: digest(text) }));
  const receipt = { schemaVersion: "archive-reviewed-exam-meta-registration-v2", requestId: req.requestId, requestSha256,
    examUid: req.examUid, sourceArchiveFile: source, sourceBlobSha1: blob, sourceRawSha256: digest(bytes), approval: req.approval,
    metadataRegistrationStatus: "REGISTERED", examFinalQaStatus: "NOT_EVALUATED_BY_REGISTRAR",
    consumerSearchStatus: "NOT_RUN", totalQuestions: applied.length, registryChanges: req.registryChanges || [],
    appliedRecords: applied, appliedIdentityRecords, fingerprintRepairs, canonicalResolutions, runtimeRecords, outputDigests };
  plan.output.set(receiptPath, json(receipt));
  const changed = [...plan.output].filter(([file, text]) => !fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text);
  // All semantic and reference checks precede the first write; restore originals
  // if an I/O failure occurs. CLI dry-run never changes production data.
  if (write) commitRegistrationFiles(root, changed);
  return { status: "PASS", write, requestId: req.requestId, approvalType: req.approval.type, totalQuestions: applied.length,
    registryChangeCount: req.registryChanges?.length || 0, runtimeMaterialized: runtimeRecords.length,
    fingerprintRepairCount: fingerprintRepairs.length,
    consumerSearchStatus: "NOT_RUN", replay: false, plannedPaths: changed.map(([file]) => file) };
}

function resolveCurrentCatalog(root, read) {
  const manifestPath = "archive/data/archive2-canonical-input-manifest.json";
  if (!fs.existsSync(safePath(root, manifestPath))) fail("canonical manifest missing");
  const manifest = read(manifestPath);
  if (manifest.schemaVersion !== "archive2-canonical-input-manifest-v1" || manifest.resolverVersion !== canonical.RESOLVER_VERSION ||
      manifest.projectionVersion !== "archive2-canonical-v1:" + digest(canonical.projectionManifestPayload(manifest.files, manifest.resolverVersion))) fail("canonical manifest version/digest mismatch");
  const files = Object.fromEntries(manifest.files.map(row => [row.path, { sha256: row.sha256 }]));
  if (canonical.MANIFEST_REQUIRED_PATHS.some(p => !files[p])) fail("canonical manifest incomplete");
  const resources = {};
  const load = relative => {
    const repoRelative = path.relative(root, path.resolve(root, "archive", relative)).replaceAll("\\", "/");
    const text = fs.readFileSync(safePath(root, repoRelative), "utf8").replaceAll("\r\n", "\n");
    if (!files[relative] || digest(text) !== files[relative].sha256) fail(`canonical input digest mismatch: ${relative}`);
    resources[relative] = JSON.parse(text);
  };
  const runtimePaths = canonical.runtimeInputPathsFromManifest(manifest.files);
  for (const relative of new Set([...canonical.REQUIRED_INPUT_PATHS, ...runtimePaths])) load(relative);
  for (const relative of canonical.reviewedRegistrationProofPaths(runtimePaths.map(p => resources[p]))) load(relative);
  return canonical.resolveCatalog({ versionBundle: { manifest, projectionVersion: manifest.projectionVersion, files, resources } });
}

// Loads the digest-checked canonical input bundle exactly as the student Consumer does.
export function loadResolvedConsumerCatalog(root, read = file => JSON.parse(fs.readFileSync(safePath(root, file), "utf8"))) {
  return resolveCurrentCatalog(root, read);
}

function verifyConsumer(root, records, runtimeRecords, read) {
  const resolved = loadResolvedConsumerCatalog(root, read);
  verifyConsumerValues(root, records, runtimeRecords, resolved);
  verifyProblemBankSearchValues(records, resolved);
}

export function verifyConsumerValues(root, records, runtimeRecords, catalog) {
  if (!records.length || records.length !== runtimeRecords.length) fail("Consumer UID denominator mismatch");
  const source = records[0].sourceArchiveFile;
  const ordinals = records.map(row => row.sourceOrdinal).sort((a, b) => a - b);
  if (records.some(row => row.sourceArchiveFile !== source) || ordinals.some((ordinal, index) => ordinal !== index + 1)) fail("Consumer source/ordinal denominator mismatch");
  const decode = v => Array.isArray(v) && v.length === 1 && Number.isInteger(v[0]) && catalog.strings?.[v[0]] !== undefined ? catalog.strings[v[0]] : v;
  const rows = catalog.encoding === "column-dictionary-v1" && Array.isArray(catalog.records[0])
    ? catalog.records.map(r => Object.fromEntries(catalog.columns.map((k, i) => [k, decode(r[i])]))) : catalog.records;
  const byUid = unique(rows, "questionUid", "catalog UID");
  const targetCatalogRows = rows.filter(row => row.sourceFile === source);
  if (targetCatalogRows.length !== records.length) fail("Consumer source denominator mismatch");
  const runtimeByUid = unique(runtimeRecords, "questionUid", "runtime UID");
  if (runtimeByUid.size !== records.length) fail("Runtime UID denominator mismatch");
  let directNullBindingKeys = null, canonicalSubUnitsByUnit = null;
  const legacyIndexHasVerifiedNullSubUnit = (record, runtime) => {
    if (record.subUnitKey !== null || runtime?.subUnitKey !== null || !record.metaFoundationPackId ||
        runtime.metaFoundationPackId !== record.metaFoundationPackId) return false;
    if (directNullBindingKeys === null) {
      try {
        const compiled = JSON.parse(fs.readFileSync(safePath(root, "archive/data/meta-foundation/compiled/curriculum_bindings.json"), "utf8"));
        directNullBindingKeys = new Set((compiled.bindings || []).filter(row => row.status === "ACTIVE" &&
          row.bindingMode === "STANDARD_UNIT_DIRECT" && row.subUnitKey === null).map(row =>
          stable([row.curriculum, row.standardCourse, row.standardUnitKey, row.problemTypeKey, row.ownerPack])));
        const master = JSON.parse(fs.readFileSync(safePath(root, MASTER), "utf8"));
        canonicalSubUnitsByUnit = new Set((master || []).filter(row => row.keyType === "subUnitKey").map(row => row.standardUnitKey));
      } catch { directNullBindingKeys = new Set(); canonicalSubUnitsByUnit = new Set(); }
    }
    return directNullBindingKeys.has(stable([record.curriculum, record.standardCourse, record.standardUnitKey,
      record.problemTypeKey, record.metaFoundationPackId])) && !canonicalSubUnitsByUnit.has(record.standardUnitKey);
  };
  for (const r of records) {
    const c = byUid.get(r.questionUid);
    if (!c || c.sourceFile !== r.sourceArchiveFile || c.sourceOrdinal !== r.sourceOrdinal) fail(`Consumer UID missing/mismatch: ${r.questionUid}`);
    for (const f of ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"]) if (!eq(c[f], r[f])) fail(`Consumer metadata mismatch: ${r.questionUid}.${f} expected=${stable(r[f])} actual=${stable(c[f])} reason=${stable(c.canonicalAssignmentReasons || [])}`);
    if (c.metadataConflicts?.length) fail(`Consumer metadata conflict: ${r.questionUid}:${stable(c.metadataConflicts)}`);
    const runtime = runtimeByUid.get(r.questionUid);
    if (!runtime || runtime.sourceArchiveFile !== r.sourceArchiveFile || runtime.sourceOrdinal !== r.sourceOrdinal || runtime.approvedSourceFingerprint !== r.sourceFingerprint) fail(`Runtime identity/fingerprint mismatch: ${r.questionUid}`);
    for (const f of ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket", "level"]) if (!eq(runtime[f], r[f])) fail(`Runtime metadata mismatch: ${r.questionUid}.${f}`);
  }
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx); vm.runInContext(fs.readFileSync(safePath(root, "archive/question-index.js"), "utf8"), ctx, { timeout: 10000 });
  const index = unique(JSON.parse(JSON.stringify(ctx.window.questionIndex || [])), r => `${r.sourceFile}#${r.sourceOrdinal}`, "search source ordinal");
  const targetIndexRows = [...index.values()].filter(row => row.sourceFile === source);
  if (targetIndexRows.length !== records.length) fail("Search source denominator mismatch");
  for (const r of records) {
    const found = index.get(`${r.sourceArchiveFile}#${r.sourceOrdinal}`);
    if (!found) fail(`Search UID source missing: ${r.questionUid}`);
    if (found.questionUid !== undefined && found.questionUid !== r.questionUid) fail(`Search UID mismatch: ${r.questionUid}`);
    for (const [searchField, metaField] of Object.entries({ standardUnitKey: "standardUnitKey", standardUnit: "standardUnit", subUnitKey: "subUnitKey", subUnit: "subUnit", level: "level", course: "standardCourse" })) {
      const runtime = runtimeByUid.get(r.questionUid);
      const legacyEmptySubUnit = searchField === "subUnitKey" && found[searchField] === "" && r[metaField] === null &&
        legacyIndexHasVerifiedNullSubUnit(r, runtime);
      if (found[searchField] !== undefined && !eq(found[searchField], r[metaField]) && !legacyEmptySubUnit)
        fail(`Search metadata mismatch: ${r.questionUid}.${searchField}`);
    }
  }
}

function verifyProblemBankSearchValues(records, catalog) {
  const source = records[0]?.sourceArchiveFile;
  if (!source || records.some(row => row.sourceArchiveFile !== source)) fail("ProblemBankMeta source denominator mismatch");
  const sourceRows = (catalog.records || []).filter(row => row.sourceFile === source);
  if (sourceRows.length !== records.length) fail("ProblemBankMeta search source denominator mismatch");
  const searchRows = problemBankMeta.buildIndex(sourceRows, []);
  const byUid = unique(searchRows, "uid", "ProblemBankMeta search UID");
  if (byUid.size !== records.length) fail("ProblemBankMeta search UID denominator mismatch");
  const fields = ["standardCourse", "standardUnit", "standardUnitKey", "subUnit", "subUnitKey", "level",
    "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"];
  const rpmFields = ["rpmL1", "rpmL2", "rpmL3", "rpmL4"];
  for (const expected of records) {
    const actual = byUid.get(expected.questionUid);
    if (!actual || actual.sourceFile !== source || actual.sourceOrdinal !== expected.sourceOrdinal) fail(`ProblemBankMeta search UID/source mismatch: ${expected.questionUid}`);
    for (const field of fields) if (!eq(actual[field] ?? null, expected[field] ?? null)) fail(`ProblemBankMeta search metadata mismatch: ${expected.questionUid}.${field} expected=${stable(expected[field] ?? null)} actual=${stable(actual[field] ?? null)}`);
    for (const field of rpmFields) {
      const supplied = Object.hasOwn(expected, field) && expected[field] != null;
      if (supplied && !eq(actual[field] ?? null, expected[field])) fail(`ProblemBankMeta search RPM metadata mismatch: ${expected.questionUid}.${field}`);
      if (!supplied && actual[field] != null) fail(`ProblemBankMeta inferred absent RPM metadata: ${expected.questionUid}.${field}`);
    }
    const matched = problemBankMeta.query(searchRows, { standardCourse: expected.standardCourse, standardUnitKey: expected.standardUnitKey,
      subUnitKey: expected.subUnitKey,
      problemTypeKey: expected.problemTypeKey, templateKey: expected.templateKey,
      crossConceptKeys: expected.crossConceptKeys, conditionKeys: expected.conditionKeys,
      integrationPattern: expected.integrationPattern, difficultyBucket: expected.difficultyBucket });
    if (!matched.some(row => row.uid === expected.questionUid)) fail(`ProblemBankMeta search query mismatch: ${expected.questionUid}`);
  }
}

function verifyEvidenceRefs(root, refs) {
  if (!Array.isArray(refs) || !refs.length) fail("evidenceRefs required");
  for (const ref of refs) {
    if (!/^[a-f0-9]{64}$/.test(ref.sha256 || "")) fail("evidence SHA-256 required");
    const full = safePath(root, ref.path);
    if (!fs.existsSync(full) || digest(fs.readFileSync(full)) !== ref.sha256) fail(`evidence missing/drift: ${ref.path}`);
  }
}

function assertRegistryChangesApplied(plan, changes) {
  for (const change of changes) {
    const doc = plan.readJson(change.path);
    if (!change.collection) {
      const packMatch = /^archive\/data\/meta-foundation\/canonical\/packs\/([a-z0-9-]+)\/pack\.json$/.exec(change.path);
      if (packMatch) {
        const pack = plan.canonical.packs.find(row => slug(row.meta.packId) === packMatch[1]);
        const derivedFields = new Set(["problemTypeCount", "templateCount", "bindingCount", "aliasCount"]);
        if (!pack || doc.packVersion !== pack.meta.packVersion ||
            Object.entries(change.after).some(([key, value]) => key !== "packVersion" && !eq(doc[key], value)) ||
            Object.keys(doc).some(key => !Object.hasOwn(change.after, key) && !derivedFields.has(key)))
          fail(`maintenance canonical after drift: ${change.path}`);
      } else if (!eq(doc, change.after)) fail(`maintenance canonical after drift: ${change.path}`);
      continue;
    }
    const rows = change.collection === "$" ? doc : doc?.[change.collection];
    if (!Array.isArray(rows)) fail(`maintenance canonical collection missing: ${change.path}`);
    const matches = rows.filter(row => Object.entries(change.match || {}).every(([key, value]) => eq(row[key], value)));
    if (change.after === null ? matches.length !== 0 : matches.length !== 1 || !eq(matches[0], change.after))
      fail(`maintenance canonical after drift: ${change.path}`);
  }
}

function verifyCrosswalkRefreshes(root, plan, witnesses) {
  for (const witness of witnesses) {
    const data = JSON.parse(fs.readFileSync(safePath(root, witness.path), "utf8"));
    const targetRows = data.records.filter(row => row.curriculum === witness.curriculum && row.scope === witness.scope);
    if (targetRows.length !== witness.rowCount) fail(`maintenance crosswalk denominator drift: ${witness.path}`);
    const actualById = unique(targetRows, "id", "crosswalk row id");
    for (const expected of witness.refreshedRows) {
      const actual = actualById.get(expected.id);
      if (!actual || !eq(actual, expected)) fail(`maintenance crosswalk row drift: ${witness.path}/${expected.id}`);
      const matches = plan.compiled.curriculumBindings.bindings.filter(binding => binding.status === "ACTIVE" && binding.curriculum === witness.curriculum &&
        binding.standardCourse === witness.standardCourse && binding.standardUnitKey === actual.standardUnitKey &&
        (binding.subUnitKey ?? null) === (actual.subUnitKey ?? null) && binding.problemTypeKey === actual.problemTypeKey && binding.ownerPack === actual.ownerPack);
      if (matches.length !== 1) fail(`maintenance crosswalk binding drift: ${witness.path}/${actual.id}`);
    }
  }
}

export function isMaintenanceClassificationProjected(catalog, search) {
  const meaningful = value => value !== undefined && value !== null && value !== "" && value !== "UNKNOWN";
  const visibleKeys = ["problemTypeKey", "templateKey"].filter(field => meaningful(search?.[field]));
  const projected = visibleKeys.length > 0;
  if (!projected) return false;
  if (!Array.isArray(catalog?.canonicalAssignmentReasons) || catalog.canonicalAssignmentReasons.length ||
      catalog.assignmentEvidence?.approvalStatus !== "APPROVED" || catalog.assignmentEvidence?.reviewEvidence?.status !== "PASS")
    fail(`maintenance PT/TPL Search exposure lacks current approved assignment evidence: ${catalog?.questionUid || search?.uid || "unknown UID"}`);
  for (const field of visibleKeys) if (!meaningful(catalog[field]) || !eq(catalog[field], search[field]) ||
      !meaningful(catalog.assignmentEvidence?.[field]) || !eq(catalog.assignmentEvidence[field], search[field]))
    fail(`maintenance PT/TPL Search exposure is not backed by a matching advanced assignment: ${catalog?.questionUid || search?.uid || "unknown UID"}.${field}`);
  return true;
}

function canonicalMaintenanceVerificationResult(requestId, projection, changedPackIds) {
  return { status: "PASS", requestId, maintenanceStatus: "MAINTENANCE_COMPLETE", replay: true,
    consumerSearchStatus: projection.status, totalRuntimeUids: projection.totalRuntimeUids,
    projectedClassificationUidCount: projection.projectedClassificationUidCount,
    withheldClassificationUidCount: projection.withheldClassificationUidCount,
    searchAdvancedFieldUidCount: projection.searchAdvancedFieldUidCount,
    searchAdvancedFieldUidCounts: projection.searchAdvancedFieldUidCounts,
    canonicalAssignmentEvidenceCount: projection.canonicalAssignmentEvidenceCount,
    sourceFingerprintMatchCount: projection.sourceFingerprintMatchCount,
    sourceFingerprintHoldCount: projection.sourceFingerprintHoldCount,
    changedPackIds, plannedPaths: [] };
}

function verifyMaintenanceProjection(root, receipt, read) {
  const metadata = read(META);
  const metadataByUid = unique(metadata.records, "questionUid", "metadata UID");
  const runtimeFiles = fs.readdirSync(safePath(root, "archive/data/meta-foundation/runtime"))
    .filter(name => name.endsWith(".json") && name !== "runtime-bridge-receipt.json")
    .map(name => read(`archive/data/meta-foundation/runtime/${name}`));
  const changedPacks = new Set(receipt.changedPackIds);
  const runtimeRows = runtimeFiles.filter(file => changedPacks.has(file.packId)).flatMap(file => file.records || []);
  if (!runtimeRows.length && changedPacks.size) fail("maintenance runtime UID set is empty");
  const runtimeByUid = unique(runtimeRows, "questionUid", "maintenance runtime UID");
  for (const runtime of runtimeRows) {
    const meta = metadataByUid.get(runtime.questionUid);
    if (!meta || meta.sourceArchiveFile !== runtime.sourceArchiveFile || meta.sourceOrdinal !== runtime.sourceOrdinal) fail(`maintenance metadata/runtime UID mismatch: ${runtime.questionUid}`);
  }
  const resolved = resolveCurrentCatalog(root, read);
  const catalogByUid = unique((resolved.records || []).filter(row => runtimeByUid.has(row.questionUid)), "questionUid", "maintenance catalog UID");
  if (catalogByUid.size !== runtimeRows.length) fail("maintenance catalog UID denominator mismatch");
  const sourceShaByFile = new Map(resolved.sourceHashes || []);
  const catalogRows = [...catalogByUid.values()].map(row => ({ ...row, currentSourceJsSha256: sourceShaByFile.get(row.sourceFile) || "" }));
  const searchRows = problemBankMeta.buildIndex(catalogRows, []);
  const searchByUid = unique(searchRows, "uid", "maintenance ProblemBankMeta UID");
  const advancedFields = ["problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"];
  const meaningful = value => value !== undefined && value !== null && value !== "" && value !== "UNKNOWN" &&
    !(Array.isArray(value) && value.length === 0);
  const searchAdvancedFieldUidCounts = Object.fromEntries(advancedFields.map(field => [field, 0]));
  let projectedClassificationUidCount = 0, searchAdvancedFieldUidCount = 0, canonicalAssignmentEvidenceCount = 0;
  let sourceFingerprintMatchCount = 0, sourceFingerprintHoldCount = 0;
  for (const runtime of runtimeRows) {
    const meta = metadataByUid.get(runtime.questionUid);
    const catalog = catalogByUid.get(runtime.questionUid), search = searchByUid.get(runtime.questionUid);
    if (!catalog || catalog.sourceFile !== runtime.sourceArchiveFile || catalog.sourceOrdinal !== runtime.sourceOrdinal)
      fail(`maintenance catalog source identity mismatch: ${runtime.questionUid}`);
    if (!search || search.sourceFile !== runtime.sourceArchiveFile || search.sourceOrdinal !== runtime.sourceOrdinal)
      fail(`maintenance Search source identity mismatch: ${runtime.questionUid}`);
    if (meta.sourceArchiveFile !== catalog.sourceFile || meta.sourceOrdinal !== catalog.sourceOrdinal)
      fail(`maintenance metadata/catalog source identity mismatch: ${runtime.questionUid}`);

    const currentSourceFingerprintMatches = Boolean(meta.sourceFingerprint && catalog.sourceFingerprint === meta.sourceFingerprint);
    if (currentSourceFingerprintMatches) sourceFingerprintMatchCount++;
    else sourceFingerprintHoldCount++;
    const hasCurrentRegisteredProof = catalog.reviewedExamRegistration?.schemaVersion === "archive-reviewed-exam-registration-projection-v2";
    if (hasCurrentRegisteredProof && (!currentSourceFingerprintMatches ||
        catalog.reviewedExamRegistration.sourceJsSha256 !== catalog.currentSourceJsSha256))
      fail(`maintenance current registered source fingerprint mismatch: ${runtime.questionUid}`);
    if (meta.contentFingerprint && catalog.assignmentFingerprint && meta.contentFingerprint !== catalog.assignmentFingerprint && hasCurrentRegisteredProof)
      fail(`maintenance current registered content fingerprint mismatch: ${runtime.questionUid}`);

    const hasApprovedAssignment = Array.isArray(catalog.canonicalAssignmentReasons) && !catalog.canonicalAssignmentReasons.length &&
      catalog.assignmentEvidence?.approvalStatus === "APPROVED" && catalog.assignmentEvidence?.reviewEvidence?.status === "PASS";
    if (hasApprovedAssignment) canonicalAssignmentEvidenceCount++;
    const pageHasAdvancedProjection = advancedFields.some(field => meaningful(search[field]));
    if (pageHasAdvancedProjection) searchAdvancedFieldUidCount++;
    if (isMaintenanceClassificationProjected(catalog, search)) projectedClassificationUidCount++;
    for (const field of advancedFields) if (meaningful(search[field])) searchAdvancedFieldUidCounts[field]++;

    for (const field of advancedFields) {
      const actual = search[field];
      if (!meaningful(actual)) continue;
      if (!meaningful(meta[field]) && !meaningful(catalog[field]))
        fail(`maintenance Search exposes metadata without a current source value: ${runtime.questionUid}.${field}`);
      if (meaningful(meta[field]) && !eq(actual, meta[field]))
        fail(`maintenance Search advanced value differs from current metadata: ${runtime.questionUid}.${field}`);
      if (Object.hasOwn(catalog, field) && meaningful(catalog[field]) && !eq(catalog[field], actual))
        fail(`maintenance Catalog/Search advanced value mismatch: ${runtime.questionUid}.${field}`);
    }
    if (pageHasAdvancedProjection) {
      const filters = Object.fromEntries(["standardCourse", "standardUnitKey", "subUnitKey", ...advancedFields]
        .filter(field => meaningful(search[field])).map(field => [field, search[field]]));
      const matched = problemBankMeta.query(searchRows, filters);
      if (!matched.some(row => row.uid === runtime.questionUid)) fail(`maintenance Search query mismatch: ${runtime.questionUid}`);
    }
  }
  return { status: "STATIC_VALUES_VERIFIED", totalRuntimeUids: runtimeRows.length, packIds: [...changedPacks].sort(),
    projectedClassificationUidCount, withheldClassificationUidCount: runtimeRows.length - projectedClassificationUidCount,
    searchAdvancedFieldUidCount, searchAdvancedFieldUidCounts, canonicalAssignmentEvidenceCount,
    sourceFingerprintMatchCount, sourceFingerprintHoldCount };
}

export function registerReviewedCanonicalMaintenanceV1({ root, request: req, write = false, verify = false }) {
  if (write) recoverRegistrationTransactions(root);
  else if (hasPendingRegistrationTransactions(root)) fail("unfinished registration transaction; rerun with --write to recover");
  if (req.schemaVersion !== "archive-reviewed-canonical-maintenance-request-v1") fail("maintenance request schema mismatch");
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(req.requestId || "")) fail("valid maintenance requestId required");
  requireText(req.purpose, "maintenance purpose");
  if (req.approval?.type !== "CANONICAL_MAINTENANCE" || !requireText(req.approval.approvedBy, "approvedBy")) fail("canonical maintenance authorization required");
  if (!Array.isArray(req.items) || req.items.length !== 0) fail("canonical maintenance requires items: []");
  if (!Array.isArray(req.registryChanges) || !req.registryChanges.length) fail("maintenance registryChanges required");
  verifyEvidenceRefs(root, req.approval.evidenceRefs);
  for (const change of req.registryChanges) verifyEvidenceRefs(root, change.evidenceRefs);
  for (const refresh of req.crosswalkRefreshPaths || []) verifyEvidenceRefs(root, refresh.evidenceRefs);
  if (verify && write) fail("--verify-maintenance is read-only");

  const requestSha256 = digest(stable(req));
  const receiptPath = `${MAINTENANCE_RECEIPTS}/${req.requestId}.json`;
  const receiptFull = safePath(root, receiptPath);
  const read = relative => JSON.parse(fs.readFileSync(safePath(root, relative), "utf8"));
  const previous = fs.existsSync(receiptFull) ? read(receiptPath) : null;
  const verifyPrevious = receipt => {
    if (receipt.requestSha256 !== requestSha256) fail("maintenance requestId reused with different content");
    const currentPlan = registryPlan(root, [], refs => verifyEvidenceRefs(root, refs));
    assertRegistryChangesApplied(currentPlan, req.registryChanges);
    const runtimeDir = "archive/data/meta-foundation/runtime";
    const runtimes = fs.readdirSync(safePath(root, runtimeDir)).filter(name => name.endsWith(".json") && name !== "runtime-bridge-receipt.json")
      .map(name => read(`${runtimeDir}/${name}`));
    for (const packId of receipt.changedPackIds) {
      const activePack = currentPlan.canonical.packs.find(pack => pack.meta.packId === packId);
      const runtime = runtimes.find(row => row.packId === packId);
      if (!activePack || !runtime || runtime.packVersion !== activePack.meta.packVersion ||
          !String(runtime.runtimeVersion || "").startsWith(`${packId}@${activePack.meta.packVersion}/`))
        fail(`maintenance runtime envelope drift: ${packId}`);
    }
    verifyCrosswalkRefreshes(root, currentPlan, receipt.crosswalkRefreshes || []);
    if (!verify) return { status: "PASS", requestId: req.requestId, maintenanceStatus: "APPLIED", replay: true,
      consumerSearchStatus: "NOT_RUN", plannedPaths: [] };
    const projection = verifyMaintenanceProjection(root, receipt, read);
    return canonicalMaintenanceVerificationResult(req.requestId, projection, projection.packIds);
  };
  if (previous) return verifyPrevious(previous);
  if (verify) fail("canonical maintenance receipt required before --verify-maintenance");

  const metadata = read(META);
  const verifyRefs = refs => verifyEvidenceRefs(root, refs);
  const plan = registryPlan(root, req.registryChanges, verifyRefs);
  assertNoOutOfScopeRegistryImpact(root, metadata, new Set(), plan, verifyRefs);
  const changedPackSlugs = [...plan.output.keys()].map(file => /^archive\/data\/meta-foundation\/canonical\/packs\/([^/]+)\/pack\.json$/.exec(file)?.[1]).filter(Boolean);
  const changedPackIds = [...new Set(changedPackSlugs.map(packSlug => plan.canonical.packs.find(pack => slug(pack.meta.packId) === packSlug)?.meta.packId).filter(Boolean))].sort();
  const runtimeDir = "archive/data/meta-foundation/runtime";
  const runtimeFiles = new Map();
  for (const name of fs.readdirSync(safePath(root, runtimeDir)).filter(name => name.endsWith(".json") && name !== "runtime-bridge-receipt.json")) {
    const relative = `${runtimeDir}/${name}`, data = read(relative);
    if (!data.packId || !Array.isArray(data.records) || runtimeFiles.has(data.packId)) fail(`runtime pack malformed/duplicate: ${relative}`);
    runtimeFiles.set(data.packId, { relative, data });
  }
  const runtimeUpdates = [];
  for (const packId of changedPackIds) {
    const pack = plan.canonical.packs.find(row => row.meta.packId === packId);
    const packPath = `${CANON}/packs/${slug(packId)}/pack.json`;
    const beforePack = plan.original.get(packPath);
    const runtime = runtimeFiles.get(packId);
    if (!beforePack || !runtime) fail(`maintenance requires existing runtime pack: ${packId}`);
    if (runtime.data.packVersion !== beforePack.packVersion) fail(`maintenance runtime before version drift: ${packId}`);
    const beforeRecords = structuredClone(runtime.data.records);
    runtime.data.packVersion = pack.meta.packVersion;
    runtime.data.runtimeVersion = `${packId}@${pack.meta.packVersion}/canonical-maintenance-v1`;
    runtime.data.generatedFrom = { ...(runtime.data.generatedFrom || {}), [`canonicalMaintenance_${req.requestId}`]: receiptPath };
    refreshRuntime(runtime.data);
    if (!eq(runtime.data.records, beforeRecords)) fail(`canonical maintenance changed runtime UID records: ${packId}`);
    plan.output.set(runtime.relative, json(runtime.data));
    runtimeUpdates.push({ packId, beforeVersion: beforePack.packVersion, afterVersion: pack.meta.packVersion,
      recordCount: beforeRecords.length, recordsSha256: digest(stable(beforeRecords)) });
  }
  if (plan.output.has(META) || plan.output.has(IDENTITY)) fail("canonical maintenance cannot change source metadata or identity records");
  const crosswalk = refreshCrosswalkPaths(root, plan, req.crosswalkRefreshPaths || [], req);
  for (const [file, text] of crosswalk.outputs) plan.output.set(file, text);
  const outputDigests = [...plan.output].map(([file, text]) => ({ path: file, sha256: digest(text) }));
  const receipt = { schemaVersion: "archive-reviewed-canonical-maintenance-receipt-v1", requestId: req.requestId, requestSha256,
    status: "APPLIED", maintenanceStatus: "APPLIED", metadataRegistrationStatus: "NOT_APPLICABLE", examFinalQaStatus: "NOT_EVALUATED",
    consumerSearchStatus: "NOT_RUN", purpose: req.purpose, approval: req.approval, registryChanges: req.registryChanges,
    changedPackIds, runtimeUpdates, crosswalkRefreshes: crosswalk.witnesses, generatedAgainstMain: crosswalk.generatedAgainstMain,
    activeRegistrySha: crosswalk.registrySha, outputDigests };
  plan.output.set(receiptPath, json(receipt));
  const changed = [...plan.output].filter(([file, text]) => !fs.existsSync(safePath(root, file)) ||
    fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text);
  if (write) commitRegistrationFiles(root, changed);
  return { status: "PASS", write, requestId: req.requestId, maintenanceStatus: "APPLIED", consumerSearchStatus: "NOT_RUN",
    changedPackIds, runtimeUpdates, crosswalkRowsRefreshed: crosswalk.witnesses.reduce((sum, row) => sum + row.rowCount, 0),
    replay: false, plannedPaths: changed.map(([file]) => file) };
}
