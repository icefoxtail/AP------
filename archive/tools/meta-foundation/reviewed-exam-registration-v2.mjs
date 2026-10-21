import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import { execFileSync } from "node:child_process";
import canonical from "../../archive2-canonical.js";
import { loadCanonical, buildCompiled, compiledOutputs, buildRegistryIndex } from "./compile-meta-foundation.mjs";
import { refreshRuntime } from "./reviewed-runtime-summary.mjs";

const CANON = "archive/data/meta-foundation/canonical";
const INDEX = `${CANON}/registry_index.json`;
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1";
const json = value => JSON.stringify(value, null, 2) + "\n";
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
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
  const output = compiledOutputs(canonical, compiled);
  const requiredSources = [...canonical.packs.flatMap(p => ["pack", "taxonomy", "bindings", "aliases"].map(n => `${p.base}/${n}.json`)), ...canonical.shards.map(s => s.file), conditionPath];
  const indexed = new Set(index.canonicalSources.map(r => r.path));
  for (const file of requiredSources) if (!indexed.has(file)) index.canonicalSources.push({ path: file });
  const readText = file => documents.has(file) && !eq(documents.get(file), original.get(file)) ? json(documents.get(file)) : fs.readFileSync(safePath(root, file), "utf8");
  output.set(INDEX, json(buildRegistryIndex(canonical, output, readText)));
  for (const [file, doc] of documents) if (file !== INDEX && !eq(doc, original.get(file))) output.set(file, json(doc));
  return { canonical, compiled, output, master: readJson(MASTER), original, readJson };
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
    bindings: unique(c.curriculumBindings.bindings.filter(r => r.status === "ACTIVE"), r => stable([r.curriculum, r.standardCourse, r.standardUnitKey, r.subUnitKey ?? null, r.problemTypeKey]), "binding")
  };
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
  }
  if (c.aliases.collisions.length) fail("canonical alias collision");
  return result;
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
  const binding = tables.bindings.get(stable([curriculum, course, row.standardUnitKey, row.subUnitKey ?? null, row.problemTypeKey]));
  if (!binding) fail(`ACTIVE curriculum binding missing: ${curriculum}/${course}/${row.problemTypeKey}`);
  const pack = tables.packs.get(binding.ownerPack || pt.ownerPack);
  if (!pack || !pack.meta.curricula.includes(curriculum) || !pack.meta.standardCourses.includes(course)) fail(`binding ownerPack scope missing: ${binding.ownerPack || pt.ownerPack}/${curriculum}/${course}`);
  return { pt, tpl, unit, sub, binding, pack, curriculum, course };
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
    for (const record of previous.appliedRecords) {
      const r = resolve(record, currentTables);
      const labels = labelsFor(patches.get(record.questionUid), record, r, read, blob);
      for (const [key, value] of Object.entries(labels)) if (record[key] !== value) fail(`registered canonical label drift: ${record.questionUid}.${key}`);
    }
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
  if (req.registryChanges?.length) {
    const baseline = registryPlan(root, [], evidenceRefs), beforeTables = lookup(baseline);
    for (const row of metadata.records.filter(r => !targetUids.has(r.questionUid))) {
      const signature = t => {
        const refs = [t.pt.get(row.problemTypeKey), t.tpl.get(row.templateKey), t.master.get(row.standardUnitKey), t.master.get(row.subUnitKey),
          ...(row.crossConceptKeys || []).map(k => t.cc.get(k)), ...(row.conditionKeys || []).map(k => t.cond.get(k)),
          ...[...t.bindings.values()].filter(b => b.curriculum === (row.curriculum || row.curriculumKey) && b.standardUnitKey === row.standardUnitKey && (b.subUnitKey ?? null) === (row.subUnitKey ?? null) && b.problemTypeKey === row.problemTypeKey)];
        return stable(refs);
      };
      if (signature(beforeTables) !== signature(tables)) fail(`registry change affects out-of-scope approved UID: ${row.questionUid}`);
      const p = beforeTables.pt.get(row.problemTypeKey);
      if (p) {
        const was = beforeTables.packs.get(p.ownerPack)?.meta;
        const now = tables.packs.get(p.ownerPack)?.meta;
        const c = row.curriculum || row.curriculumKey, course = row.standardCourse || row.courseKey;
        if (was?.curricula?.includes(c) && !now?.curricula?.includes(c) || was?.standardCourses?.includes(course) && !now?.standardCourses?.includes(course)) fail(`registry scope change affects out-of-scope UID: ${row.questionUid}`);
      }
    }
  }
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
  const touched = new Set(), applied = [], runtimeRecords = [], appliedIdentityRecords = [], fingerprintRepairs = [];
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
    for (const f of sourceFields) if (Object.hasOwn(q, f) && !eq(q[f], final[f])) fail(`source/approved metadata parity: ${current.questionUid}.${f}`);
    const checked = validateReviewedSourceFingerprints({ question: q, metadata: current, identity: id, patch });
    const fingerprint = checked.sourceFingerprint;
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
  const outputDigests = [...plan.output].filter(([file, text]) => file !== META && (!fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text)).map(([file, text]) => ({ path: file, sha256: digest(text) }));
  const receipt = { schemaVersion: "archive-reviewed-exam-meta-registration-v2", requestId: req.requestId, requestSha256,
    examUid: req.examUid, sourceArchiveFile: source, sourceBlobSha1: blob, sourceRawSha256: digest(bytes), approval: req.approval,
    metadataRegistrationStatus: "REGISTERED", examFinalQaStatus: "NOT_EVALUATED_BY_REGISTRAR",
    consumerSearchStatus: "NOT_RUN", totalQuestions: applied.length, registryChanges: req.registryChanges || [],
    appliedRecords: applied, appliedIdentityRecords, fingerprintRepairs, runtimeRecords, outputDigests };
  plan.output.set(receiptPath, json(receipt));
  const changed = [...plan.output].filter(([file, text]) => !fs.existsSync(safePath(root, file)) || fs.readFileSync(safePath(root, file), "utf8").replaceAll("\r\n", "\n") !== text);
  // All semantic and reference checks precede the first write; restore originals
  // if an I/O failure occurs. CLI dry-run never changes production data.
  if (write) {
    const backup = new Map();
    try {
      for (const [file, text] of changed) {
        const full = safePath(root, file);
        backup.set(full, fs.existsSync(full) ? fs.readFileSync(full) : null);
        fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, text, "utf8");
      }
    } catch (error) {
      for (const [full, bytes] of backup) { if (bytes === null) fs.rmSync(full, { force: true }); else fs.writeFileSync(full, bytes); }
      throw error;
    }
  }
  return { status: "PASS", write, requestId: req.requestId, approvalType: req.approval.type, totalQuestions: applied.length,
    registryChangeCount: req.registryChanges?.length || 0, runtimeMaterialized: runtimeRecords.length,
    fingerprintRepairCount: fingerprintRepairs.length,
    consumerSearchStatus: "NOT_RUN", replay: false, plannedPaths: changed.map(([file]) => file) };
}

function verifyConsumer(root, records, runtimeRecords, read) {
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
  const resolved = canonical.resolveCatalog({ versionBundle: { manifest, projectionVersion: manifest.projectionVersion, files, resources } });
  return verifyConsumerValues(root, records, runtimeRecords, resolved);
}

export function verifyConsumerValues(root, records, runtimeRecords, catalog) {
  const decode = v => Array.isArray(v) && v.length === 1 && Number.isInteger(v[0]) && catalog.strings?.[v[0]] !== undefined ? catalog.strings[v[0]] : v;
  const rows = catalog.encoding === "column-dictionary-v1" && Array.isArray(catalog.records[0])
    ? catalog.records.map(r => Object.fromEntries(catalog.columns.map((k, i) => [k, decode(r[i])]))) : catalog.records;
  const byUid = unique(rows, "questionUid", "catalog UID");
  for (const r of records) {
    const c = byUid.get(r.questionUid);
    if (!c || c.sourceFile !== r.sourceArchiveFile || c.sourceOrdinal !== r.sourceOrdinal) fail(`Consumer UID missing/mismatch: ${r.questionUid}`);
    for (const f of ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket"]) if (!eq(c[f], r[f])) fail(`Consumer metadata mismatch: ${r.questionUid}.${f}`);
    if (c.metadataConflicts?.length) fail(`Consumer metadata conflict: ${r.questionUid}`);
  }
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(ctx); vm.runInContext(fs.readFileSync(safePath(root, "archive/question-index.js"), "utf8"), ctx, { timeout: 10000 });
  const index = unique(JSON.parse(JSON.stringify(ctx.window.questionIndex || [])), r => `${r.sourceFile}#${r.sourceOrdinal}`, "search source ordinal");
  for (const r of records) {
    const found = index.get(`${r.sourceArchiveFile}#${r.sourceOrdinal}`);
    if (!found) fail(`Search UID source missing: ${r.questionUid}`);
    for (const f of ["standardUnitKey", "subUnitKey", "level"]) if (!eq(found[f], r[f])) fail(`Search metadata mismatch: ${r.questionUid}.${f}`);
    if (found.course !== r.standardCourse) fail(`Search course mismatch: ${r.questionUid}`);
  }
  if (!runtimeRecords.length) fail("runtime records missing");
}
