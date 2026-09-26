#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  equal, jsonText, normalizeSourceFile, packetDigest, parseArgs, readJson,
  readPacket, repoRootFrom, sha256
} from "./reviewed-apply-core.mjs";

const arg = parseArgs(process.argv.slice(2));
const check = arg.flags.has("check");
const write = arg.flags.has("write");
if (check === write) throw new Error("Usage: rebuild-reviewed-runtime.mjs (--check|--write) [--packet <path>] [--repo-root <path>]");
const root = repoRootFrom(import.meta.url, arg.values.get("repo-root"));
const dataDir = path.join(root, "archive/data");
const runtimeDir = path.join(dataDir, "meta-foundation/runtime");
const overrideDir = path.join(dataDir, "meta-foundation/evidence/review-overrides/v1");
const packetPath = arg.values.get("packet");
let packet = null;
let packetInfo = null;
if (packetPath) ({ packet, info: packetInfo } = readPacket(path.isAbsolute(packetPath) ? packetPath : path.join(root, packetPath)));

const read = (...parts) => readJson(path.join(root, ...parts));
const registryIndex = read("archive/data/meta-foundation/canonical/registry_index.json");
const taxonomy = read("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const concepts = read("archive/data/meta-foundation/compiled/concept_registry.json");
const conditions = read("archive/data/meta-foundation/compiled/condition_registry.json");
const bindings = read("archive/data/meta-foundation/compiled/curriculum_bindings.json");
const aliases = read("archive/data/meta-foundation/compiled/aliases.json");
const identity = read("archive/data/question_identity_map.json");
const metadata = read("archive/data/question_metadata.json");
const catalogCore = await import(pathToFileURL(path.join(root, "archive/archive2-core.js")).href);
const catalog = catalogCore.default.decodeCatalog(read("archive/data/archive2-catalog.json"));
const master = read("archive/data/master_tables/js_archive_tag_master.json");
const masterByKey = new Map(master.map((row) => [row.key, row]));
const problemByKey = new Map((taxonomy.problemTypes || []).map((row) => [row.problemTypeKey, row]));
const templateByKey = new Map((taxonomy.templates || []).map((row) => [row.templateKey, row]));
const conceptByKey = new Map((concepts.concepts || []).map((row) => [row.conceptKey, row]));
const conditionByKey = new Map((conditions.conditions || []).map((row) => [row.conditionKey, row]));
const activePacks = new Map((registryIndex.activePacks || []).filter((row) => row.status === "ACTIVE").map((row) => [row.id, row]));
const bindingRows = (bindings.bindings || []).filter((row) => row.status === "ACTIVE");
const aliasesData = aliases;
const canonicalKeys = [
  ...(taxonomy.problemTypes || []).map((row) => row.problemTypeKey),
  ...(taxonomy.templates || []).map((row) => row.templateKey),
  ...(concepts.concepts || []).map((row) => row.conceptKey),
  ...(conditions.conditions || []).map((row) => row.conditionKey)
];
if (new Set(canonicalKeys).size !== canonicalKeys.length) throw new Error("canonical duplicate/cross-kind key collision");
const activeBindingKeys = bindingRows.map((row) => [row.curriculum, row.standardUnitKey, row.subUnitKey ?? "", row.problemTypeKey].join("\u0000"));
if (new Set(activeBindingKeys).size !== activeBindingKeys.length) throw new Error("duplicate ACTIVE curriculum/L1/L2/L3 binding collision");
const activePackRows = (registryIndex.activePacks || []).filter((row) => row.status === "ACTIVE");
if (new Set(activePackRows.map((row) => row.id)).size !== activePackRows.length) throw new Error("duplicate ACTIVE canonical runtime pack id");

const identityByUid = new Map();
const identitySourceSet = new Set();
for (const row of identity.records || []) {
  if (identityByUid.has(row.questionUid)) throw new Error(`duplicate identity UID: ${row.questionUid}`);
  const sourceKey = `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`;
  if (identitySourceSet.has(sourceKey)) throw new Error(`duplicate identity source: ${sourceKey}`);
  identitySourceSet.add(sourceKey);
  identityByUid.set(row.questionUid, row);
}
const metadataByUid = new Map();
const metadataSourceSet = new Set();
for (const row of metadata.records || []) {
  if (metadataByUid.has(row.questionUid)) throw new Error(`duplicate metadata UID: ${row.questionUid}`);
  const sourceKey = `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`;
  if (metadataSourceSet.has(sourceKey)) throw new Error(`duplicate metadata source identity: ${sourceKey}`);
  metadataSourceSet.add(sourceKey);
  metadataByUid.set(row.questionUid, row);
}
if (identityByUid.size !== metadataByUid.size) throw new Error("identity/metadata cardinality mismatch");

const overrideByUid = new Map();
const overrideSourceSet = new Set();
if (fs.existsSync(overrideDir)) {
  for (const name of fs.readdirSync(overrideDir).filter((entry) => entry.endsWith(".json")).sort()) {
    const file = path.join(overrideDir, name);
    const row = readJson(file);
    if (!row.questionUid || path.basename(name, ".json") !== row.questionUid) throw new Error(`review override UID/path mismatch: ${name}`);
    if (overrideByUid.has(row.questionUid)) throw new Error(`duplicate override UID: ${row.questionUid}`);
    const sourceKey = `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`;
    if (overrideSourceSet.has(sourceKey)) throw new Error(`duplicate override source identity: ${sourceKey}`);
    overrideSourceSet.add(sourceKey);
    if (!identityByUid.has(row.questionUid)) throw new Error(`override without source identity: ${row.questionUid}`);
    const id = identityByUid.get(row.questionUid);
    if (normalizeSourceFile(id.sourceArchiveFile) !== normalizeSourceFile(row.sourceArchiveFile) || Number(id.sourceOrdinal) !== Number(row.sourceOrdinal) || id.sourceFingerprint !== row.sourceFingerprint) {
      throw new Error(`override source identity mismatch: ${row.questionUid}`);
    }
    overrideByUid.set(row.questionUid, row);
  }
}

const runtimeFiles = fs.readdirSync(runtimeDir).filter((name) => name.endsWith(".json") && name !== "runtime-bridge-receipt.json").sort();
const runtimes = new Map();
const runtimePathByPack = new Map();
for (const name of runtimeFiles) {
  const file = path.join(runtimeDir, name);
  const runtime = readJson(file);
  if (!Array.isArray(runtime.records) || !runtime.packId) throw new Error(`runtime pack file malformed: ${name}`);
  if (!activePacks.has(runtime.packId)) throw new Error(`runtime pack is not in canonical activePacks: ${runtime.packId}`);
  if (runtimes.has(runtime.packId)) throw new Error(`duplicate runtime file for pack: ${runtime.packId}`);
  runtimes.set(runtime.packId, { runtime, file, relative: `archive/data/meta-foundation/runtime/${name}` });
  runtimePathByPack.set(runtime.packId, file);
}
for (const packId of activePacks.keys()) if (!runtimes.has(packId)) throw new Error(`active canonical pack has no runtime file: ${packId}`);

const activeRuntimeByUid = new Map();
const activeRuntimeSourceSet = new Set();
for (const [packId, item] of runtimes) {
  for (const row of item.runtime.records) {
    if (!row.questionUid) throw new Error(`runtime UID missing in ${packId}`);
    if (activeRuntimeByUid.has(row.questionUid)) throw new Error(`active runtime duplicate UID: ${row.questionUid}`);
    const sourceKey = `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`;
    if (activeRuntimeSourceSet.has(sourceKey)) throw new Error(`active runtime duplicate source identity: ${sourceKey}`);
    activeRuntimeSourceSet.add(sourceKey);
    activeRuntimeByUid.set(row.questionUid, { row, packId, item });
  }
}

if (packet) {
  const expectedPacketSha = packetDigest(packet);
  for (const patch of packet.metaPatches) {
    const override = overrideByUid.get(patch.questionUid);
    if (!override || override.latestAcceptedReview2?.applyId !== packet.applyId || override.latestAcceptedReview2.packetSha256 !== expectedPacketSha) {
      throw new Error(`review override missing or stale for packet UID ${patch.questionUid}`);
    }
  }
}

const canonicalBinding = (row) => bindingRows.find((binding) =>
  binding.curriculum === (row.curriculum || row.curriculumKey) &&
  binding.standardUnitKey === row.standardUnitKey &&
  (binding.subUnitKey ?? null) === (row.subUnitKey ?? null) &&
  binding.problemTypeKey === row.problemTypeKey
);
const failIfNotActive = (map, key, label) => {
  const row = map.get(key);
  if (!row || row.status !== "ACTIVE") throw new Error(`active runtime has unregistered ${label}: ${key}`);
  return row;
};
const canonicalErrors = [];
let brokenL4ParentCount = 0;
let unregisteredL3Count = 0;
let unregisteredL4Count = 0;
let unregisteredCrossConceptCount = 0;
let bindingMismatchCount = 0;
const canonicalAssignments = [];
for (const [packId, item] of runtimes) {
  for (const row of item.runtime.records) {
    const id = identityByUid.get(row.questionUid);
    if (!id || normalizeSourceFile(id.sourceArchiveFile) !== normalizeSourceFile(row.sourceArchiveFile) || Number(id.sourceOrdinal) !== Number(row.sourceOrdinal)) {
      throw new Error(`active runtime identity-map join mismatch: ${row.questionUid}`);
    }
    const mapped = Boolean(row.problemTypeKey);
    if (!mapped) {
      if (row.templateKey) { unregisteredL4Count += 1; canonicalErrors.push(`L4 without L3 ${row.questionUid}`); }
      continue;
    }
    const l1 = masterByKey.get(row.standardUnitKey);
    const l2 = masterByKey.get(row.subUnitKey);
    // A few frozen archive assignments use a cross-unit source label, but an
    // explicit ACTIVE curriculum/L1/L2/L3 binding is authoritative for those
    // existing records. Validate each key and the complete compiled binding
    // below instead of inventing a parent binding from key spelling alone.
    if (!l1 || l1.keyType !== "standardUnitKey" || row.subUnitKey && (!l2 || l2.keyType !== "subUnitKey")) {
      bindingMismatchCount += 1;
      canonicalErrors.push(`invalid L1/L2 parent ${row.questionUid}`);
    }
    let l3;
    let l4;
    try { l3 = failIfNotActive(problemByKey, row.problemTypeKey, "L3"); }
    catch (error) { unregisteredL3Count += 1; canonicalErrors.push(`${row.questionUid}: ${error.message}`); }
    if (row.templateKey) {
      try { l4 = failIfNotActive(templateByKey, row.templateKey, "L4"); }
      catch (error) { unregisteredL4Count += 1; canonicalErrors.push(`${row.questionUid}: ${error.message}`); }
      if (l4 && l4.parentProblemTypeKey !== row.problemTypeKey) {
        brokenL4ParentCount += 1;
        canonicalErrors.push(`broken L4 parent ${row.questionUid}: ${row.templateKey} -> ${l4.parentProblemTypeKey}`);
      }
    }
    for (const key of row.crossConceptKeys || []) {
      try { failIfNotActive(conceptByKey, key, "CrossConcept"); }
      catch (error) { unregisteredCrossConceptCount += 1; canonicalErrors.push(`${row.questionUid}: ${error.message}`); }
    }
    for (const key of row.conditionKeys || []) {
      const condition = conditionByKey.get(key);
      if (!condition || condition.status !== "ACTIVE") canonicalErrors.push(`unregistered condition ${row.questionUid}: ${key}`);
    }
    if (l3 && !canonicalBinding(row)) {
      bindingMismatchCount += 1;
      canonicalErrors.push(`curriculum/L1/L2/L3 binding mismatch ${row.questionUid}`);
    }
    if (row.L3 && l3 && row.L3 !== l3.canonicalLabelKo) canonicalErrors.push(`L3 label mismatch ${row.questionUid}`);
    if (row.L4 && l4 && row.L4 !== l4.canonicalLabelKo) canonicalErrors.push(`L4 label mismatch ${row.questionUid}`);
    canonicalAssignments.push({ packId, row, l1, l2, l3, l4 });
  }
}
if ((aliasesData.collisions || []).length) canonicalErrors.push("compiled alias collisions exist");

const overridesDigest = sha256([...overrideByUid.values()].sort((a, b) => a.questionUid.localeCompare(b.questionUid, "en")).map((row) => JSON.stringify(row)).join("\n"));
const catalogByUid = new Map((catalog.records || []).map((row) => [row.questionUid, row]));
const catalogBySource = new Map((catalog.records || []).map((row) => [`${normalizeSourceFile(row.sourceFile)}#${Number(row.sourceOrdinal)}`, row]));
const outputFiles = new Map();
const changedPacks = new Set();
const touchedUids = [];
const makeRuntimeRecord = (meta, id, binding, l1, l2, l3, l4, packId, packVersion, catalogRow) => {
  const difficultyValid = Number.isInteger(meta.difficultyBucket) && meta.difficultyBucket >= 1 && meta.difficultyBucket <= 5;
  const runtimeSelectable = meta.reviewStatus === "reviewed_pass" && meta.foundationTaxonomyStatus === "CONFIRMED" &&
    meta.curriculumApplicability === "DEFAULT_SCOPE" && meta.defaultSelectable !== false && difficultyValid && Boolean(meta.courseKey || meta.standardCourse) && Boolean(l1 && (l2 || binding.bindingMode === "STANDARD_UNIT_DIRECT"));
  const l2Label = l2?.labelKo || binding.subUnitLabelKo || "";
  return {
    questionUid: meta.questionUid,
    sourceArchiveFile: normalizeSourceFile(meta.sourceArchiveFile),
    sourceOrdinal: Number(meta.sourceOrdinal),
    sourceQuestionNo: String(meta.sourceQuestionNo ?? id.sourceQuestionNo ?? ""),
    sourceIdentity: `${normalizeSourceFile(meta.sourceArchiveFile)}#${Number(meta.sourceOrdinal)}`,
    sourceFingerprint: meta.sourceFingerprint,
    approvedSourceFingerprint: meta.sourceFingerprint,
    curriculum: binding.curriculum,
    curriculumKey: binding.curriculum,
    courseKey: meta.courseKey || meta.standardCourse || binding.standardCourse || "",
    standardCourse: meta.standardCourse || binding.standardCourse || "",
    standardUnitKey: meta.standardUnitKey,
    standardUnit: meta.standardUnit || l1.labelKo,
    subUnitKey: meta.subUnitKey,
    subUnit: meta.subUnit || l2Label,
    L1: l1.labelKo,
    L2: l2Label,
    L3: l3.canonicalLabelKo,
    L4: l4.canonicalLabelKo,
    problemTypeKey: meta.problemTypeKey,
    templateKey: meta.templateKey,
    crossConceptKeys: [...(meta.crossConceptKeys || [])],
    secondaryConceptKeys: [...(meta.secondaryConceptKeys || [])],
    conditionKeys: [...(meta.conditionKeys || [])],
    integrationPattern: meta.integrationPattern || "NONE",
    difficultyBucket: meta.difficultyBucket,
    difficultyConfidence: meta.difficultyConfidence,
    difficultyBoundaryFlag: meta.difficultyBoundaryFlag,
    legacyLevel: meta.legacyLevel,
    legacyLevelCompatibility: meta.legacyLevelCompatibility,
    foundationTaxonomyStatus: "CONFIRMED",
    curriculumApplicability: meta.curriculumApplicability || "DEFAULT_SCOPE",
    defaultSelectable: meta.defaultSelectable !== false,
    runtimeSelectable,
    reviewStatus: meta.reviewStatus,
    metadataStatus: meta.metadataStatus,
    metadataRevision: meta.metadataRevision,
    metaFoundationStatus: "ACTIVE",
    metaFoundationPackId: packId,
    metaFoundationPackVersion: packVersion,
    catalogIdentityRepairVerified: catalogRow?.identityStatus === "VERIFIED",
    rawQuestionHash: catalogRow?.rawQuestionHash || ""
  };
};

for (const override of overrideByUid.values()) {
  const decision = override.latestAcceptedReview2;
  if (decision.status !== "REPAIR") continue;
  const meta = metadataByUid.get(override.questionUid);
  const packId = decision.runtimePackId;
  const activePack = activePacks.get(packId);
  if (!activePack) throw new Error(`REPAIR references inactive pack ${packId}: ${override.questionUid}`);
  const l1 = masterByKey.get(meta.standardUnitKey);
  const l2 = meta.subUnitKey ? masterByKey.get(meta.subUnitKey) : null;
  const l3 = problemByKey.get(meta.problemTypeKey);
  const l4 = templateByKey.get(meta.templateKey);
  if (!l1 || meta.subUnitKey && !l2 || !l3 || !l4 || l4.parentProblemTypeKey !== l3.problemTypeKey) throw new Error(`REPAIR canonical mapping invalid: ${override.questionUid}`);
  if (!meta.crossConceptKeys.every((key) => conceptByKey.get(key)?.status === "ACTIVE")) throw new Error(`REPAIR CrossConcept invalid: ${override.questionUid}`);
  const binding = bindingRows.find((row) => row.curriculum === (meta.curriculum || meta.curriculumKey) && row.standardUnitKey === meta.standardUnitKey && (row.subUnitKey ?? null) === (meta.subUnitKey ?? null) && row.problemTypeKey === meta.problemTypeKey);
  if (!binding) throw new Error(`REPAIR curriculum binding missing: ${override.questionUid}`);
  const runtimePack = runtimes.get(packId);
  const positions = [];
  for (const [index, row] of runtimePack.runtime.records.entries()) if (row.questionUid === override.questionUid) positions.push(index);
  const anyRuntime = activeRuntimeByUid.get(override.questionUid);
  if (positions.length > 1) throw new Error(`duplicate UID within runtime pack: ${override.questionUid}`);
  if (anyRuntime && anyRuntime.packId !== packId) throw new Error(`runtimePackId mismatch for ${override.questionUid}: ${anyRuntime.packId} != ${packId}`);
  const catalogRow = catalogByUid.get(override.questionUid);
  if (!catalogRow || normalizeSourceFile(catalogRow.sourceFile) !== normalizeSourceFile(meta.sourceArchiveFile) || Number(catalogRow.sourceOrdinal) !== Number(meta.sourceOrdinal)) {
    throw new Error(`Archive2 catalog join missing/mismatched for ${override.questionUid}`);
  }
  const next = makeRuntimeRecord(meta, identityByUid.get(override.questionUid), binding, l1, l2, l3, l4, packId, activePack.version, catalogRow);
  if (positions.length) {
    const prior = runtimePack.runtime.records[positions[0]];
    Object.assign(prior, next);
  } else {
    runtimePack.runtime.records.push(next);
  }
  runtimePack.runtime.records.sort((a, b) => a.questionUid.localeCompare(b.questionUid, "en"));
  runtimePack.runtime.generatedFrom = {
    ...(runtimePack.runtime.generatedFrom || {}),
    reviewOverrides: "archive/data/meta-foundation/evidence/review-overrides/v1",
    reviewOverrideDigest: overridesDigest
  };
  runtimePack.runtime.reviewedApply = {
    schemaVersion: "archive-reviewed-runtime-rebuild-v1",
    overrideDigest: overridesDigest,
    acceptedRepairUidCount: [...overrideByUid.values()].filter((row) => row.latestAcceptedReview2.status === "REPAIR" && row.latestAcceptedReview2.runtimePackId === packId).length
  };
  changedPacks.add(packId);
  touchedUids.push(override.questionUid);
}

function groupUsage(records, field, project = (row) => row[field]) {
  const byKey = new Map();
  for (const row of records) {
    const value = project(row);
    const keys = Array.isArray(value) ? value : [value];
    for (const key of keys.filter((entry) => typeof entry === "string" && entry)) {
      if (!byKey.has(key)) byKey.set(key, []);
      byKey.get(key).push(row.questionUid);
    }
  }
  return [...byKey.entries()].sort(([a], [b]) => a.localeCompare(b, "en")).map(([key, uids]) => ({ key, count: uids.length, questionUids: uids.sort() }));
}

function makeTaxonomyRows(records) {
  const groups = new Map();
  for (const row of records) {
    if (!row.problemTypeKey || row.metaFoundationL3Status === "ROUTE_OUT") continue;
    const signature = [row.curriculumKey || row.curriculum, row.courseKey, row.L1, row.L2, row.L3, row.L4, row.problemTypeKey, row.templateKey, row.curriculumApplicability].join("\u0000");
    if (!groups.has(signature)) groups.set(signature, []);
    groups.get(signature).push(row);
  }
  return [...groups.values()].map((rows) => {
    const first = rows[0];
    return {
      curriculumKey: first.curriculumKey || first.curriculum,
      courseKey: first.courseKey,
      L1: first.L1,
      L2: first.L2,
      L3: first.L3,
      L4: first.L4,
      problemTypeKey: first.problemTypeKey,
      templateKey: first.templateKey,
      curriculumApplicability: first.curriculumApplicability,
      defaultSelectable: rows.some((row) => row.defaultSelectable === true),
      supportingItemCount: rows.length
    };
  }).sort((a, b) => `${a.curriculumKey}|${a.courseKey}|${a.L1}|${a.L2}|${a.problemTypeKey}|${a.templateKey}`.localeCompare(`${b.curriculumKey}|${b.courseKey}|${b.L1}|${b.L2}|${b.problemTypeKey}|${b.templateKey}`, "en"));
}

function dynamicCounts(records) {
  const mapped = records.filter((row) => row.problemTypeKey);
  const selectable = records.filter((row) => row.runtimeSelectable === true).length;
  const difficultyHolds = records.filter((row) => row.difficultyReviewStatus === "manual_review" || String(row.metaFoundationDifficultyStatus || "").includes("HOLD")).length;
  const l3Final = records.filter((row) => row.metaFoundationL3Status === "FINAL" || Boolean(row.problemTypeKey)).length;
  const l4Final = records.filter((row) => row.metaFoundationL4Status === "FINAL" || Boolean(row.templateKey)).length;
  const ccCount = records.reduce((sum, row) => sum + (row.crossConceptKeys || []).length, 0);
  const conditionCount = records.reduce((sum, row) => sum + (row.conditionKeys || []).length, 0);
  return {
    records: records.length,
    mapped: mapped.length,
    canonicalAssignments: mapped.length,
    finalL3: l3Final,
    finalL4: l4Final,
    explicitL3Hold: records.filter((row) => row.metaFoundationL3Status === "EXPLICIT_HOLD").length,
    explicitL4Hold: records.filter((row) => row.metaFoundationL4Status === "EXPLICIT_HOLD").length,
    semanticHold: records.filter((row) => row.reviewStatus === "reviewed_hold" || row.reviewStatus === "manual_review").length,
    routeOut: records.filter((row) => row.reviewStatus === "route_out" || row.metaFoundationL3Status === "ROUTE_OUT").length,
    solutionQualityHold: records.filter((row) => row.sourceQualityDisposition === "SOLUTION_REPAIR_REQUIRED").length,
    rpmPathHold: records.filter((row) => row.rpmPathStatus === "HOLD_NO_EQUIVALENT_PATH").length,
    difficultyHold: difficultyHolds,
    defaultSelectable: records.filter((row) => row.defaultSelectable === true).length,
    runtimeSelectable: selectable,
    automaticEligibleExpected: selectable,
    supplementary: records.filter((row) => row.supplementary === true).length,
    sourceHold: records.filter((row) => row.metadataStatus === "SOURCE_HOLD").length,
    uniqueProblemTypes: new Set(mapped.map((row) => row.problemTypeKey)).size,
    uniqueTemplates: new Set(mapped.map((row) => row.templateKey).filter(Boolean)).size,
    uniqueCrossConcepts: new Set(records.flatMap((row) => row.crossConceptKeys || [])).size,
    l3ProblemTypeCount: new Set(mapped.map((row) => row.problemTypeKey)).size,
    l4TemplateCount: new Set(mapped.map((row) => row.templateKey).filter(Boolean)).size,
    crossConceptReferenceCount: ccCount,
    conditionReferenceCount: conditionCount,
    taxonomyRows: makeTaxonomyRows(records).length,
    bindingGap: 0,
    sourceRepairPending: records.filter((row) => row.sourceRepairPending === true).length,
    difficultyReviewed: records.filter((row) => Number.isInteger(row.difficultyBucket) && row.difficultyBucket >= 1 && row.difficultyBucket <= 5).length,
    catalogIdentityRepairVerified: records.filter((row) => row.catalogIdentityRepairVerified === true).length
  };
}

const usageByPack = new Map();
for (const packId of changedPacks) {
  const item = runtimes.get(packId);
  const records = item.runtime.records;
  const computed = dynamicCounts(records);
  item.runtime.counts = { ...(item.runtime.counts || {}) };
  for (const [key, value] of Object.entries(computed)) {
    if (key === "records" || Object.hasOwn(item.runtime.counts, key)) item.runtime.counts[key] = value;
  }
  const taxonomyRows = makeTaxonomyRows(records);
  if (Object.hasOwn(item.runtime, "taxonomyRows")) item.runtime.taxonomyRows = taxonomyRows;
  if (Object.hasOwn(item.runtime, "ownedScopes")) {
    const scopes = new Map();
    for (const row of records.filter((value) => value.problemTypeKey)) {
      const scope = { curriculumKey: row.curriculumKey || row.curriculum, courseKey: row.courseKey, L1: row.L1, L2: row.L2 };
      const key = Object.values(scope).join("\u0000");
      scopes.set(key, scope);
    }
    item.runtime.ownedScopes = [...scopes.values()].sort((a, b) => Object.values(a).join("|").localeCompare(Object.values(b).join("|"), "en"));
  }
  item.runtime.usage = {
    schemaVersion: "archive-reviewed-runtime-usage-v1",
    records: records.length,
    problemTypes: groupUsage(records, "problemTypeKey"),
    templates: groupUsage(records, "templateKey"),
    crossConcepts: groupUsage(records, "crossConceptKeys"),
    conditions: groupUsage(records, "conditionKeys")
  };
  usageByPack.set(packId, computed);
  outputFiles.set(item.relative, jsonText(item.runtime));
}

const allRows = [...runtimes.values()].flatMap((item) => item.runtime.records);
const combinedUidSet = new Set(allRows.map((row) => row.questionUid));
const combinedSourceSet = new Set(allRows.map((row) => `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`));
if (combinedUidSet.size !== allRows.length) throw new Error("active runtime duplicate UID");
if (combinedSourceSet.size !== allRows.length) throw new Error("active runtime duplicate source identity");
let catalogDirectJoinCount = 0;
let catalogSourceIdentityRepairJoinCount = 0;
let catalogJoinMismatchCount = 0;
for (const row of allRows) {
  const sourceKey = `${normalizeSourceFile(row.sourceArchiveFile)}#${Number(row.sourceOrdinal)}`;
  const byUid = catalogByUid.get(row.questionUid);
  const bySource = catalogBySource.get(sourceKey);
  if (byUid && `${normalizeSourceFile(byUid.sourceFile)}#${Number(byUid.sourceOrdinal)}` === sourceKey) catalogDirectJoinCount += 1;
  else if (bySource && !bySource.questionUid && row.catalogIdentityRepairVerified === true) catalogSourceIdentityRepairJoinCount += 1;
  else catalogJoinMismatchCount += 1;
}
if (catalogJoinMismatchCount) throw new Error(`active runtime Archive2 catalog join mismatch: ${catalogJoinMismatchCount}`);
if (brokenL4ParentCount || unregisteredL3Count || unregisteredL4Count || unregisteredCrossConceptCount || bindingMismatchCount || canonicalErrors.length) {
  throw new Error(`reviewed runtime canonical gate failed: ${JSON.stringify({ brokenL4ParentCount, unregisteredL3Count, unregisteredL4Count, unregisteredCrossConceptCount, bindingMismatchCount, failures: canonicalErrors.slice(0, 10) })}`);
}

if (changedPacks.size) {
  const receiptPath = path.join(runtimeDir, "runtime-bridge-receipt.json");
  const receipt = fs.existsSync(receiptPath) ? readJson(receiptPath) : { schemaVersion: "meta-foundation-runtime-bridge-receipt-v1", checked: {} };
  const perPack = [...runtimes.entries()].sort(([a], [b]) => a.localeCompare(b, "en")).map(([packId, item]) => ({
    packId,
    records: item.runtime.records.length,
    runtimeFile: path.basename(item.file),
    runtimeSha256: sha256(jsonText(item.runtime))
  }));
  const catalogJoins = catalogDirectJoinCount + catalogSourceIdentityRepairJoinCount;
  receipt.reviewedApplyV1 = {
    schemaVersion: "archive-reviewed-runtime-receipt-v1",
    status: "PASS",
    activePackCount: runtimes.size,
    runtimeRecordCount: allRows.length,
    uniqueUidCount: combinedUidSet.size,
    uniqueSourceIdentityCount: combinedSourceSet.size,
    archive2DirectJoinCount: catalogDirectJoinCount,
    archive2SourceIdentityRepairJoinCount: catalogSourceIdentityRepairJoinCount,
    archive2JoinMismatchCount: catalogJoinMismatchCount,
    canonicalGateCounts: { brokenL4ParentCount, unregisteredL3Count, unregisteredL4Count, unregisteredCrossConceptCount, bindingMismatchCount },
    overrideUidCount: overrideByUid.size,
    overrideDigest: overridesDigest,
    packCounts: perPack,
    latestPacketApplyId: packet?.applyId || receipt.reviewedApplyV1?.latestPacketApplyId || ""
  };
  receipt.checked = {
    ...(receipt.checked || {}),
    combinedRuntimeRecords: allRows.length,
    combinedUniqueUid: combinedUidSet.size,
    combinedUniqueSourceIdentity: combinedSourceSet.size,
    combinedRuntimeCatalogJoin: catalogJoins,
    combinedRuntimeCatalogDirectJoin: catalogDirectJoinCount,
    combinedRuntimeCatalogSourceIdentityRepairJoin: catalogSourceIdentityRepairJoinCount,
    combinedRuntimeCatalogJoinMismatch: catalogJoinMismatchCount,
    metaFoundationRuntimePackCount: runtimes.size,
    metaFoundationRuntimeUrlCount: runtimes.size,
    questionMetadataDigest: metadata.digest,
    reviewOverrideUidCount: overrideByUid.size,
    reviewOverrideDigest: overridesDigest
  };
  outputFiles.set("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json", jsonText(receipt));
}

const plannedPaths = [...outputFiles.keys()].filter((relative) => {
  const file = path.join(root, ...relative.split("/"));
  return !fs.existsSync(file) || fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") !== outputFiles.get(relative);
});
if (check && plannedPaths.length) throw new Error(`reviewed runtime outputs stale: ${plannedPaths.join(", ")}`);
if (write) {
  for (const [relative, text] of outputFiles) {
    const file = path.join(root, ...relative.split("/"));
    const current = fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n") : null;
    if (current === text) continue;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text, "utf8");
  }
}
console.log(JSON.stringify({
  status: "PASS",
  mode: check ? "CHECK" : "WRITE",
  activePackCount: runtimes.size,
  runtimeRecordCount: allRows.length,
  uniqueUidCount: combinedUidSet.size,
  uniqueSourceIdentityCount: combinedSourceSet.size,
  catalogDirectJoinCount,
  catalogSourceIdentityRepairJoinCount,
  catalogJoinMismatchCount,
  repairedUids: touchedUids.sort(),
  changedPacks: [...changedPacks].sort(),
  outputMutationCount: write ? plannedPaths.length : 0,
  wouldChange: plannedPaths,
  canonicalGateCounts: { brokenL4ParentCount, unregisteredL3Count, unregisteredL4Count, unregisteredCrossConceptCount, bindingMismatchCount }
}, null, 2));
