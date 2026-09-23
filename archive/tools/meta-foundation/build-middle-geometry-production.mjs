#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "../../..");
const require = createRequire(import.meta.url);
const archive2 = require(path.join(root, "archive/archive2-core.js"));
const evidenceRoot = path.join(root, "archive/data/meta-foundation/evidence/middle-geometry/v1");
const canonicalRoot = path.join(root, "archive/data/meta-foundation/canonical");
const packDir = path.join(canonicalRoot, "packs/middle-geometry");
const runtimePath = path.join(root, "archive/data/meta-foundation/runtime/middle-geometry-v1.json");
const indexPath = path.join(canonicalRoot, "registry_index.json");
const compiledTaxonomyPath = path.join(root, "archive/data/meta-foundation/compiled/taxonomy_registry.json");
const conceptsPath = path.join(root, "archive/data/meta-foundation/compiled/concept_registry.json");
const conditionsPath = path.join(root, "archive/data/meta-foundation/compiled/condition_registry.json");
const indexRuntimePath = path.join(root, "archive/question-index.js");
const uidA = "qid_v1_a438810be625fa9cd973e8a7f2af2fd9fa0661a06794b02eae1ce5645a8c76f7";
const uidB = "qid_v1_e4ba2b9da32f044d69365ba770f627de7a5c507022acc721246243608a99f94a";

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n", "utf8");
const sha256File = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const uniq = (items) => [...new Set(items)];
const by = (items, keyFn) => {
  const map = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return map;
};
const stable = (a, b) => String(a).localeCompare(String(b), "en");
const clone = (value) => JSON.parse(JSON.stringify(value));
const key = (...parts) => parts.map((part) => String(part ?? "")).join("|");
const sourceKey = (file, ordinal) => archive2.normalizeFile(file) + "#" + Number(ordinal);

function requireCount(name, actual, expected) {
  if (actual !== expected) throw new Error(name + " expected " + expected + " but got " + actual);
}

const l3 = readJson(path.join(evidenceRoot, "l3_semantic_final_928.json")).records;
const l4 = readJson(path.join(evidenceRoot, "l4_crossconcept_semantic_freeze_928.json")).records;
const difficulty = readJson(path.join(evidenceRoot, "difficulty_final_freeze_928_20260923.json"));
const relational = readJson(path.join(evidenceRoot, "relational_metadata_final_928_20260923.json"));
const candidateTaxonomy = readJson(path.join(evidenceRoot, "candidate_compiled_middle_geometry.json")).taxonomy;
const templateRegistry = readJson(path.join(evidenceRoot, "l4_template_semantic_registry_candidate.json")).templates;
const compiledTaxonomy = readJson(compiledTaxonomyPath);
const compiledConcepts = readJson(conceptsPath);
const compiledConditions = readJson(conditionsPath);
const conditionRegistry = readJson(path.join(canonicalRoot, "condition_registry.json"));
const registryIndex = readJson(indexPath);
const catalogData = readJson(path.join(root, "archive/data/archive2-catalog.json"));
const catalog = archive2.decodeCatalog(catalogData);

globalThis.window = globalThis.window || {};
require(indexRuntimePath);
const questionIndex = globalThis.window.questionIndex || [];
if (!Array.isArray(questionIndex) || !questionIndex.length) throw new Error("question-index runtime unavailable");

requireCount("L3 denominator", l3.length, 928);
requireCount("L3 final", l3.filter((row) => row.l3ReviewStatus === "FINAL").length, 921);
requireCount("L3 route-out", l3.filter((row) => row.l3ReviewStatus !== "FINAL").length, 7);
requireCount("L4 final", l4.filter((row) => row.l4ReviewStatus === "FINAL").length, 901);
requireCount("L4 explicit hold", l4.filter((row) => row.l4ReviewStatus === "EXPLICIT_HOLD").length, 20);
requireCount("L4 route-out", l4.filter((row) => row.l4ReviewStatus === "ROUTE_OUT").length, 7);
requireCount("difficulty final mapped records", difficulty.records.length, 921);
requireCount("relational mapped records", relational.records.length, 921);

const l3ByUid = new Map(l3.map((row) => [row.questionUid, row]));
const l4ByUid = new Map(l4.map((row) => [row.questionUid, row]));
const difficultyByUid = new Map(difficulty.records.map((row) => [row.questionUid, row]));
const relationalByUid = new Map(relational.records.map((row) => [row.questionUid, row]));
const indexBySource = new Map(questionIndex.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));
const catalogByUid = new Map(catalog.records.map((row) => [row.questionUid, row]));
const catalogBySource = new Map(catalog.records.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));

if (l3ByUid.size !== 928 || l4ByUid.size !== 928) throw new Error("duplicate source-ledger UID");
if (difficultyByUid.size !== 921 || relationalByUid.size !== 921) throw new Error("duplicate final metadata UID");

const mappedL3 = l3.filter((row) => row.l3ReviewStatus === "FINAL");
const finalL4 = l4.filter((row) => row.l4ReviewStatus === "FINAL");
const typeKeys = uniq(mappedL3.map((row) => row.problemTypeKey)).sort(stable);
const templateKeys = uniq(finalL4.map((row) => row.templateKey)).sort(stable);
const activeTypes = new Map(compiledTaxonomy.problemTypes.filter((row) => row.status === "ACTIVE" && row.ownerPack !== "MIDDLE_GEOMETRY").map((row) => [row.problemTypeKey, row]));
const activeTemplates = new Map(compiledTaxonomy.templates.filter((row) => row.status === "ACTIVE" && row.ownerPack !== "MIDDLE_GEOMETRY").map((row) => [row.templateKey, row]));
const candidateTypes = new Map(candidateTaxonomy.problemTypes.map((row) => [row.problemTypeKey, row]));
const candidateTemplates = new Map(templateRegistry.map((row) => [row.templateKey, row]));
const typeSupport = by(mappedL3, (row) => row.problemTypeKey);
const templateSupport = by(finalL4, (row) => row.templateKey);

const newProblemTypes = typeKeys.filter((key) => !activeTypes.has(key)).map((problemTypeKey) => {
  const base = candidateTypes.get(problemTypeKey);
  if (!base) throw new Error("missing completed L3 definition " + problemTypeKey);
  const supportingQuestionUids = (typeSupport.get(problemTypeKey) || []).map((row) => row.questionUid).sort(stable);
  const { mergedFromRawProblemTypes, ...definition } = clone(base);
  return {
    ...definition,
    problemTypeKey,
    aliases: Array.isArray(base.aliases) ? base.aliases : [],
    supportingQuestionUids,
    supportingItemCount: supportingQuestionUids.length,
    status: "ACTIVE",
    ownerPack: "MIDDLE_GEOMETRY"
  };
});

const newTemplates = templateKeys.filter((key) => !activeTemplates.has(key)).map((templateKey) => {
  const base = candidateTemplates.get(templateKey);
  if (!base) throw new Error("missing completed L4 definition " + templateKey);
  const supportingQuestionUids = (templateSupport.get(templateKey) || []).map((row) => row.questionUid).sort(stable);
  const parentKeys = uniq((templateSupport.get(templateKey) || []).map((row) => row.problemTypeKey));
  if (parentKeys.length !== 1 || parentKeys[0] !== base.parentProblemTypeKey) {
    throw new Error("final L4 parent mismatch for " + templateKey + ": " + parentKeys.join(","));
  }
  const { supportCount, supportingItemCount: candidateSupportCount, supportingQuestionUids: candidateSupport, reuse, ...definition } = clone(base);
  return {
    ...definition,
    templateKey,
    parentProblemTypeKey: parentKeys[0],
    aliases: Array.isArray(base.aliases) ? base.aliases : [],
    supportingQuestionUids,
    supportingItemCount: supportingQuestionUids.length,
    status: "ACTIVE",
    ownerPack: "MIDDLE_GEOMETRY"
  };
});

requireCount("Middle Geometry owned L3 key count", newProblemTypes.length, 11);
requireCount("Middle Geometry owned L4 key count", newTemplates.length, 31);

const typeDefinitionByKey = new Map([...activeTypes, ...newProblemTypes.map((row) => [row.problemTypeKey, row])]);
const templateDefinitionByKey = new Map([...activeTemplates, ...newTemplates.map((row) => [row.templateKey, row])]);
for (const row of mappedL3) {
  if (!typeDefinitionByKey.has(row.problemTypeKey)) throw new Error("unknown L3 key " + row.problemTypeKey);
}
for (const row of finalL4) {
  const template = templateDefinitionByKey.get(row.templateKey);
  if (!template || template.parentProblemTypeKey !== row.problemTypeKey) throw new Error("unknown or mismatched L4 key " + row.templateKey);
}

const bindingsByKey = by(mappedL3, (row) => {
  const ix = indexBySource.get(sourceKey(row.sourceArchiveFile, row.sourceOrdinal));
  if (!ix) throw new Error("question-index source missing " + row.sourceArchiveFile + "#" + row.sourceOrdinal);
  if (ix.standardUnitKey !== row.standardUnitKey || ix.subUnitKey !== row.subUnitKey) {
    throw new Error("source/L3 parent mismatch " + row.questionUid + ": " + ix.standardUnitKey + "/" + ix.subUnitKey + " != " + row.standardUnitKey + "/" + row.subUnitKey);
  }
  return key(ix.curriculumKey || "2015", ix.course || "중" + row.grade.slice(1) + " 수학", row.standardUnitKey, row.subUnitKey, row.problemTypeKey);
});
const bindings = [...bindingsByKey.entries()].map(([groupKey, rows]) => {
  const [curriculum, standardCourse, standardUnitKey, subUnitKey, problemTypeKey] = groupKey.split("|");
  const supportingQuestionUids = rows.map((row) => row.questionUid).sort(stable);
  return {
    problemTypeKey,
    curriculum,
    standardCourse,
    standardUnitKey,
    subUnitKey,
    supportingItemCount: supportingQuestionUids.length,
    supportingQuestionUids,
    status: "ACTIVE",
    ownerPack: "MIDDLE_GEOMETRY"
  };
}).sort((a, b) => key(a.curriculum, a.standardCourse, a.standardUnitKey, a.subUnitKey, a.problemTypeKey).localeCompare(key(b.curriculum, b.standardCourse, b.standardUnitKey, b.subUnitKey, b.problemTypeKey), "en"));

const aliasesFromTaxonomy = [...newProblemTypes, ...newTemplates].flatMap((row) => (row.aliases || []).map((alias) => ({
  alias,
  canonicalKey: row.problemTypeKey || row.templateKey,
  canonicalKind: row.problemTypeKey ? "problemType" : "template",
  source: "PACK_TAXONOMY_ALIAS",
  status: "ACTIVE"
})));
const taxonomy = {
  schemaVersion: "middle-geometry-taxonomy-pack-v1",
  status: "ACTIVE",
  hierarchy: "standardUnitKey -> subUnitKey -> problemTypeKey -> templateKey",
  semanticRegistrySharedAcrossCurricula: true,
  problemTypeCount: newProblemTypes.length,
  templateCount: newTemplates.length,
  problemTypes: newProblemTypes,
  templates: newTemplates,
  droppedTemplates: [],
  foundationPack: true,
  ownerPack: "MIDDLE_GEOMETRY"
};
const bindingsFile = {
  schemaVersion: "middle-geometry-curriculum-bindings-v1",
  status: "ACTIVE",
  bindingCount: bindings.length,
  bindings,
  policy: "Bindings are recomputed from the 921 current FINAL L3 UIDs and current source parent metadata.",
  ownerPack: "MIDDLE_GEOMETRY"
};
const aliasFile = {
  schemaVersion: "middle-geometry-aliases-v1",
  status: "ACTIVE",
  aliasCount: aliasesFromTaxonomy.length,
  aliases: aliasesFromTaxonomy,
  collisionCount: 0,
  collisions: [],
  semanticFixes: [],
  ownerPack: "MIDDLE_GEOMETRY"
};
const pack = {
  schemaVersion: "meta-foundation-pack-v1",
  packId: "MIDDLE_GEOMETRY",
  packVersion: "1.0.0",
  canonicalStatus: "ACTIVE",
  schemaAuthority: "docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md",
  ownerPack: "MIDDLE_GEOMETRY",
  curricula: ["2015"],
  standardCourses: ["중2 수학", "중3 수학"],
  ownedStandardUnitDomains: ["M2-05", "M2-06", "M3-05", "M3-06"],
  activeItemEvidenceCount: 921,
  problemTypeCount: newProblemTypes.length,
  templateCount: newTemplates.length,
  crossConceptReferenceCount: relational.counts.crossConceptAssignments,
  conditionRegistryCount: (conditionRegistry.conditions || []).length,
  bindingCount: bindings.length,
  aliasCount: aliasesFromTaxonomy.length,
  outOfGroupRoutingCount: 7,
  productionJsMutation: true,
  promotionReviewDisposition: "USER_FINAL_LEDGER_WITH_EXPLICIT_HOLDS",
  notes: [
    "Canonical support UIDs and counts were recomputed from the current FINAL L3/L4 ledgers.",
    "Two authorized L1/L2 source metadata corrections were applied; protected student fields were unchanged.",
    "Already ACTIVE L3 and L4 keys are reused without changing their existing owners.",
    "Difficulty recheck holds and L4 explicit holds remain non-selectable in runtime."
  ]
};

fs.mkdirSync(packDir, { recursive: true });
writeJson(path.join(packDir, "pack.json"), pack);
writeJson(path.join(packDir, "taxonomy.json"), taxonomy);
writeJson(path.join(packDir, "bindings.json"), bindingsFile);
writeJson(path.join(packDir, "aliases.json"), aliasFile);

const packEntry = registryIndex.activePacks.find((row) => row.id === "MIDDLE_GEOMETRY");
if (packEntry) {
  packEntry.version = "1.0.0";
  packEntry.status = "ACTIVE";
} else {
  registryIndex.activePacks.push({ id: "MIDDLE_GEOMETRY", version: "1.0.0", status: "ACTIVE" });
}
const canonicalSourceRows = [
  "aliases.json", "bindings.json", "pack.json", "taxonomy.json"
].map((name) => ({ path: "archive/data/meta-foundation/canonical/packs/middle-geometry/" + name }));
for (const source of canonicalSourceRows) {
  if (!registryIndex.canonicalSources.some((row) => row.path === source.path)) registryIndex.canonicalSources.push(source);
}

const activeConceptKeys = new Set(compiledConcepts.concepts.filter((row) => row.status === "ACTIVE").map((row) => row.conceptKey));
const activeConditionKeys = new Set(compiledConditions.conditions.filter((row) => row.status === "ACTIVE").map((row) => row.conditionKey));

const records = l3.map((sourceRow) => {
  const uid = sourceRow.questionUid;
  const l4Row = l4ByUid.get(uid);
  const ix = indexBySource.get(sourceKey(sourceRow.sourceArchiveFile, sourceRow.sourceOrdinal));
  const catalogRow = catalogByUid.get(uid);
  if (!l4Row || !ix || !catalogRow) throw new Error("source join incomplete for " + uid);
  if (sourceKey(catalogRow.sourceFile, catalogRow.sourceOrdinal) !== sourceKey(sourceRow.sourceArchiveFile, sourceRow.sourceOrdinal)) {
    throw new Error("Archive2 UID/source mismatch " + uid);
  }
  if (catalogRow.sourceFingerprint !== sourceRow.sourceFingerprint) throw new Error("Archive2 source fingerprint mismatch " + uid);
  if (ix.standardUnitKey !== sourceRow.standardUnitKey || ix.subUnitKey !== sourceRow.subUnitKey) {
    throw new Error("question-index parent mismatch " + uid);
  }
  if (l4Row.sourceFingerprint && l4Row.sourceFingerprint !== sourceRow.sourceFingerprint) throw new Error("L4 fingerprint mismatch " + uid);

  const isRouteOut = sourceRow.l3ReviewStatus !== "FINAL";
  const difficultyRow = difficultyByUid.get(uid) || null;
  const relationalRow = relationalByUid.get(uid) || null;
  if (!isRouteOut && (!difficultyRow || !relationalRow)) throw new Error("mapped final join missing difficulty/relational " + uid);
  const l4Final = l4Row.l4ReviewStatus === "FINAL";
  const l4Hold = l4Row.l4ReviewStatus === "EXPLICIT_HOLD";
  const problemTypeKey = isRouteOut ? null : sourceRow.problemTypeKey;
  const templateKey = l4Final ? l4Row.templateKey : null;
  const problemType = problemTypeKey ? typeDefinitionByKey.get(problemTypeKey) : null;
  const template = templateKey ? templateDefinitionByKey.get(templateKey) : null;
  const ccKeys = isRouteOut ? [] : (l4Row.crossConceptKeys || []);
  const conditionKeys = relationalRow ? (relationalRow.conditionKeys || []) : [];
  const integrationPattern = relationalRow ? relationalRow.integrationPattern : "NONE";
  for (const key of ccKeys) if (!activeConceptKeys.has(key)) throw new Error("inactive cross-concept key " + key + " for " + uid);
  for (const key of conditionKeys) if (!activeConditionKeys.has(key)) throw new Error("inactive Condition key " + key + " for " + uid);

  const difficultyPass = !!difficultyRow && ["PASS_BLIND_NO_RECHECK_TRIGGER", "PASS_EXISTING_SOURCE_PARITY_RECHECK", "PASS_USER_AUTHORIZED_SOURCE_UPDATE"].includes(difficultyRow.recheckDisposition);
  const sourceVerified = catalogRow.sourceStatus === "VERIFIED" && catalogRow.identityStatus === "VERIFIED";
  const selectable = !isRouteOut && l4Final && difficultyPass && sourceVerified;
  const metadataStatus = isRouteOut ? "ROUTE_OUT" : l4Hold ? "EXPLICIT_L4_HOLD" : !difficultyPass ? "DIFFICULTY_RECHECK_HOLD" : "FINAL";
  const reviewStatus = selectable ? "reviewed_pass" : "manual_review";

  return {
    questionUid: uid,
    sourceArchiveFile: sourceRow.sourceArchiveFile,
    sourceOrdinal: Number(sourceRow.sourceOrdinal),
    sourceQuestionNo: String(sourceRow.sourceQuestionNo || ix.id || ""),
    sourceFingerprint: sourceRow.sourceFingerprint,
    rawQuestionHash: catalogRow.rawQuestionHash,
    approvedSourceFingerprint: catalogRow.approvedSourceFingerprint,
    curriculumKey: String(ix.curriculumKey || "2015"),
    courseKey: ix.course || "중" + sourceRow.grade.slice(1) + " 수학",
    standardCourse: ix.course || "중" + sourceRow.grade.slice(1) + " 수학",
    standardUnitKey: sourceRow.standardUnitKey,
    standardUnit: ix.standardUnit,
    subUnitKey: sourceRow.subUnitKey,
    subUnit: ix.subUnit,
    L1: ix.standardUnit,
    L2: ix.subUnit,
    L3: problemType ? problemType.canonicalLabelKo : null,
    L4: template ? template.canonicalLabelKo : null,
    problemTypeKey,
    templateKey,
    crossConceptKeys: ccKeys,
    conditionKeys,
    integrationPattern,
    contentHash: relationalRow ? relationalRow.contentHash : null,
    solutionHash: relationalRow ? relationalRow.solutionHash : null,
    inputBundleSha: relationalRow ? relationalRow.inputBundleSha : null,
    difficultyBucket: difficultyRow ? difficultyRow.difficultyBucket : null,
    difficultyConfidence: difficultyRow ? difficultyRow.difficultyConfidence : null,
    difficultyBoundaryFlag: difficultyRow ? difficultyRow.difficultyBoundaryFlag : null,
    legacyLevel: difficultyRow ? difficultyRow.legacyLevel : ix.level || null,
    legacyLevelCompatibility: difficultyRow ? difficultyRow.legacyLevelCompatibility : null,
    difficultyReviewStatus: difficultyRow ? difficultyRow.reviewStatus : "ROUTE_OUT",
    difficultyRecheckDisposition: difficultyRow ? difficultyRow.recheckDisposition : "ROUTE_OUT",
    metaFoundationDifficultyStatus: difficultyRow ? difficultyRow.recheckDisposition : "ROUTE_OUT",
    metaFoundationL3Status: isRouteOut ? "ROUTE_OUT" : "FINAL",
    metaFoundationL4Status: l4Row.l4ReviewStatus,
    curriculumApplicability: "DEFAULT_SCOPE",
    defaultSelectable: selectable,
    reviewStatus,
    metadataStatus,
    metaFoundationStatus: metadataStatus,
    metaFoundationPackId: "MIDDLE_GEOMETRY",
    metaFoundationPackVersion: "1.0.0",
    metadataRevision: "meta-foundation:MIDDLE_GEOMETRY@1.0.0"
  };
}).sort((a, b) => stable(a.questionUid, b.questionUid));

requireCount("Runtime unique UID", new Set(records.map((row) => row.questionUid)).size, 928);
requireCount("Runtime unique source", new Set(records.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, 928);
requireCount("Runtime direct UID catalog join", records.filter((row) => catalogByUid.has(row.questionUid)).length, 928);
requireCount("Runtime default selectable final L3/L4/recheck pass", records.filter((row) => row.defaultSelectable).length, records.filter((row) => row.reviewStatus === "reviewed_pass").length);

const taxonomyGroups = by(records.filter((row) => row.metaFoundationL3Status === "FINAL"), (row) => key(
  row.curriculumKey, row.courseKey, row.L1, row.L2, row.L3, row.L4, row.problemTypeKey, row.templateKey, row.curriculumApplicability
));
const taxonomyRows = [...taxonomyGroups.entries()].map(([groupKey, rows]) => {
  const first = rows[0];
  return {
    curriculumKey: first.curriculumKey,
    courseKey: first.courseKey,
    L1: first.L1,
    L2: first.L2,
    L3: first.L3,
    L4: first.L4,
    problemTypeKey: first.problemTypeKey,
    templateKey: first.templateKey,
    curriculumApplicability: first.curriculumApplicability,
    defaultSelectable: rows.some((row) => row.defaultSelectable),
    supportingItemCount: rows.length
  };
}).sort((a, b) => key(a.curriculumKey, a.courseKey, a.L1, a.L2, a.problemTypeKey, a.templateKey).localeCompare(key(b.curriculumKey, b.courseKey, b.L1, b.L2, b.problemTypeKey, b.templateKey), "en"));

const ownedScopes = uniq(records.filter((row) => row.metaFoundationL3Status === "FINAL").map((row) => key(row.curriculumKey, row.courseKey, row.L1, row.L2)))
  .map((scope) => {
    const [curriculumKey, courseKey, L1, L2] = scope.split("|");
    return { curriculumKey, courseKey, L1, L2 };
  }).sort((a, b) => key(a.curriculumKey, a.courseKey, a.L1, a.L2).localeCompare(key(b.curriculumKey, b.courseKey, b.L1, b.L2), "en"));

const finalL3Count = records.filter((row) => row.metaFoundationL3Status === "FINAL").length;
const finalL4Count = records.filter((row) => row.metaFoundationL4Status === "FINAL").length;
const explicitL4HoldCount = records.filter((row) => row.metaFoundationL4Status === "EXPLICIT_HOLD").length;
const routeOutCount = records.filter((row) => row.metaFoundationL3Status === "ROUTE_OUT").length;
const difficultyHoldCount = records.filter((row) => row.difficultyReviewStatus === "manual_review").length;
const defaultSelectableCount = records.filter((row) => row.defaultSelectable).length;
const runtime = {
  schemaVersion: "meta-foundation-runtime-overlay-v1",
  status: "ACTIVE",
  runtimeVersion: "MIDDLE_GEOMETRY@1.0.0/runtime-bridge-v1",
  packId: "MIDDLE_GEOMETRY",
  packVersion: "1.0.0",
  generatedFrom: {
    l3: "archive/data/meta-foundation/evidence/middle-geometry/v1/l3_semantic_final_928.json",
    l4CrossConcept: "archive/data/meta-foundation/evidence/middle-geometry/v1/l4_crossconcept_semantic_freeze_928.json",
    difficulty: "archive/data/meta-foundation/evidence/middle-geometry/v1/difficulty_final_freeze_928_20260923.json",
    relational: "archive/data/meta-foundation/evidence/middle-geometry/v1/relational_metadata_final_928_20260923.json",
    canonicalPack: "archive/data/meta-foundation/canonical/packs/middle-geometry",
    questionIndex: "archive/question-index.js",
    archive2CatalogSha256: sha256File(path.join(root, "archive/data/archive2-catalog.json"))
  },
  counts: {
    records: records.length,
    finalL3: finalL3Count,
    finalL4: finalL4Count,
    explicitL4Hold: explicitL4HoldCount,
    routeOut: routeOutCount,
    difficultyHold: difficultyHoldCount,
    defaultSelectable: defaultSelectableCount,
    supplementary: 0,
    sourceHold: records.filter((row) => row.reviewStatus === "manual_review" && row.metadataStatus === "SOURCE_HOLD").length,
    automaticEligibleExpected: defaultSelectableCount,
    catalogUidDirectJoin: 928,
    catalogSourceIdentityRepairJoin: 0,
    taxonomyRows: taxonomyRows.length
  },
  ownedScopes,
  taxonomyRows,
  records
};

requireCount("taxonomy mapped support denominator", records.filter((row) => row.metaFoundationL3Status === "FINAL").length, 921);
requireCount("final L4 plus explicit hold equals mapped L3", finalL4Count + explicitL4HoldCount, 921);
requireCount("route-out denominator", routeOutCount, 7);

const activePack = {
  id: "MIDDLE_GEOMETRY",
  version: "1.0.0",
  status: "ACTIVE"
};
const activePackRows = registryIndex.activePacks.filter((row) => row.id === activePack.id);
if (activePackRows.length !== 1) throw new Error("registry index must contain exactly one Middle Geometry pack");

writeJson(indexPath, registryIndex);
writeJson(runtimePath, runtime);
const runtimeFiles = [
  "geometry-equations-v1.json",
  "sets-propositions-v1.json",
  "functions-graphs-v1.json",
  "limit-continuity-v1.json",
  "integral-calculus-v1.json",
  "derivative-v1.json",
  "probability-statistics-v1.json",
  "middle-geometry-v1.json"
].map((name) => path.join(root, "archive/data/meta-foundation/runtime", name));
const activeRuntimePacks = runtimeFiles.map((file) => readJson(file));
const combinedRuntime = activeRuntimePacks.flatMap((row) => row.records || []);
const combinedUidSet = new Set(combinedRuntime.map((row) => row.questionUid));
const combinedSourceSet = new Set(combinedRuntime.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal)));
if (combinedUidSet.size !== combinedRuntime.length) throw new Error("active runtime duplicate UID");
if (combinedSourceSet.size !== combinedRuntime.length) throw new Error("active runtime duplicate source identity");
const directJoinByPack = new Map();
let combinedCatalogDirectJoin = 0;
for (const packRuntime of activeRuntimePacks) {
  let direct = 0;
  let sourceRepair = 0;
  for (const row of packRuntime.records || []) {
    const catalogRow = catalogByUid.get(row.questionUid);
    const sourceRow = catalogBySource.get(sourceKey(row.sourceArchiveFile, row.sourceOrdinal));
    if (catalogRow && sourceKey(catalogRow.sourceFile, catalogRow.sourceOrdinal) === sourceKey(row.sourceArchiveFile, row.sourceOrdinal)) {
      direct += 1;
      combinedCatalogDirectJoin += 1;
    } else if (sourceRow && !sourceRow.questionUid && row.catalogIdentityRepairVerified === true) {
      sourceRepair += 1;
    } else {
      throw new Error("active runtime Archive2 identity join mismatch " + row.questionUid);
    }
  }
  directJoinByPack.set(packRuntime.packId, { direct, sourceRepair, total: (packRuntime.records || []).length });
}
if (combinedCatalogDirectJoin !== combinedRuntime.length) throw new Error("active runtime direct catalog join mismatch");
const runtimeReceiptPath = path.join(root, "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
if (fs.existsSync(runtimeReceiptPath)) {
  const receipt = readJson(runtimeReceiptPath);
  receipt.status = "ACTIVE";
  receipt.runtimeVersion = "META_FOUNDATION_MULTI/runtime-bridge-v4";
  const checked = receipt.checked || (receipt.checked = {});
  Object.assign(checked, {
    combinedRuntimeRecords: combinedRuntime.length,
    combinedUniqueUid: combinedUidSet.size,
    combinedUniqueSourceIdentity: combinedSourceSet.size,
    combinedRuntimeCatalogJoin: combinedCatalogDirectJoin,
    combinedRuntimeCatalogJoinMismatch: 0,
    archive2CatalogIndexVersion: catalogData.indexVersion || "",
    questionMetadataDigest: readJson(path.join(root, "archive/data/question_metadata.json")).digest,
    questionMetadataFingerprintSync: 3,
    metaFoundationRuntimePackCount: activeRuntimePacks.length,
    metaFoundationRuntimeUrlCount: activeRuntimePacks.length,
    middleGeometryRuntimeRecords: records.length,
    middleGeometryExistingCatalogUidJoin: directJoinByPack.get("MIDDLE_GEOMETRY").direct,
    middleGeometrySourceIdentityRepairJoin: directJoinByPack.get("MIDDLE_GEOMETRY").sourceRepair,
    middleGeometryCatalogJoin: directJoinByPack.get("MIDDLE_GEOMETRY").total,
    middleGeometryCatalogJoinMismatch: 0,
    middleGeometryFinalL3: finalL3Count,
    middleGeometryFinalL4: finalL4Count,
    middleGeometryExplicitL4Hold: explicitL4HoldCount,
    middleGeometryRouteOut: routeOutCount,
    middleGeometryDifficultyHold: difficultyHoldCount,
    middleGeometryAutomaticEligibleExpected: defaultSelectableCount
  });
  for (const [packId, prefix] of [
    ["LIMIT_CONTINUITY", "limitContinuity"],
    ["INTEGRAL_CALCULUS", "integralCalculus"],
    ["DERIVATIVE", "derivative"],
    ["PROBABILITY_STATISTICS", "probabilityStatistics"]
  ]) {
    const join = directJoinByPack.get(packId);
    if (join) {
      checked[prefix + "ExistingCatalogUidJoin"] = join.direct;
      checked[prefix + "SourceIdentityRepairJoin"] = join.sourceRepair;
      checked[prefix + "CatalogJoin"] = join.total;
      checked[prefix + "CatalogJoinMismatch"] = 0;
    }
  }
  const oldInvariants = (receipt.invariants || []).filter((value) =>
    !/3 catalog rows with unresolved UID|241 DERIVATIVE items join|181 active LIMIT_CONTINUITY rows|53 active INTEGRAL_CALCULUS rows|Combined active Meta Foundation runtime join is 1904|Current active runtime 1904|RUNTIME_URLS loads seven active runtime packs|Seven-pack runtime load is 2608/.test(value)
  );
  receipt.invariants = [
    ...oldInvariants,
    "Current active runtime pack count is 8, including MIDDLE_GEOMETRY.",
    "Current active runtime join is " + combinedRuntime.length + "/" + combinedRuntime.length + " with UID/source-identity duplicate counts 0.",
    "MIDDLE_GEOMETRY joins Archive2 by direct questionUid for " + directJoinByPack.get("MIDDLE_GEOMETRY").direct + "/" + records.length + " rows.",
    "MIDDLE_GEOMETRY preserves 20 explicit L4 holds and 7 route-outs as non-selectable."
  ];
  if (receipt.archive2JoinContract) receipt.archive2JoinContract.expectedRuntimeJoin = combinedRuntime.length;
  writeJson(runtimeReceiptPath, receipt);
}


const evidence = {
  schemaVersion: "middle-geometry-canonical-runtime-build-receipt-v1",
  status: "GENERATED_FROM_FINAL_LEDGERS",
  packId: "MIDDLE_GEOMETRY",
  packVersion: "1.0.0",
  sourceArtifacts: {
    l3Sha256: sha256File(path.join(evidenceRoot, "l3_semantic_final_928.json")),
    l4Sha256: sha256File(path.join(evidenceRoot, "l4_crossconcept_semantic_freeze_928.json")),
    difficultySha256: sha256File(path.join(evidenceRoot, "difficulty_final_freeze_928_20260923.json")),
    relationalSha256: sha256File(path.join(evidenceRoot, "relational_metadata_final_928_20260923.json"))
  },
  counts: {
    mappedL3: 921,
    routeOut: 7,
    finalL4: 901,
    explicitL4Hold: 20,
    ownedProblemTypes: newProblemTypes.length,
    reusedProblemTypes: typeKeys.length - newProblemTypes.length,
    ownedTemplates: newTemplates.length,
    reusedTemplates: templateKeys.length - newTemplates.length,
    bindings: bindings.length,
    runtimeRecords: records.length,
    runtimeTaxonomyRows: taxonomyRows.length,
    difficultyHold: difficultyHoldCount,
    defaultSelectable: defaultSelectableCount
  },
  artifacts: [
    "archive/data/meta-foundation/canonical/packs/middle-geometry/pack.json",
    "archive/data/meta-foundation/canonical/packs/middle-geometry/taxonomy.json",
    "archive/data/meta-foundation/canonical/packs/middle-geometry/bindings.json",
    "archive/data/meta-foundation/canonical/packs/middle-geometry/aliases.json",
    "archive/data/meta-foundation/runtime/middle-geometry-v1.json"
  ]
};
writeJson(path.join(evidenceRoot, "canonical_runtime_build_receipt_20260923.json"), evidence);
console.log(JSON.stringify(evidence, null, 2));
