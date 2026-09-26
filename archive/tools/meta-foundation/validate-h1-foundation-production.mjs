#!/usr/bin/env node
// Deterministic H1 Meta Foundation integrity and Archive 2.0 selector-path audit.
// This validates accepted artifacts and exercises the production runtime bridge;
// it performs no semantic review and changes no question source.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import core from "../../archive2-core.js";

const require = createRequire(import.meta.url);
const archive2Source = require("../../archive2-source.js");
const archive2Output = require("../../archive2-output.js");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const evidenceDir = "archive/data/meta-foundation/evidence/high1/v1";
const runtimePath = "archive/data/meta-foundation/runtime/h1-foundation-v1.json";
const assignmentPath = `${evidenceDir}/item_metadata_assignments_1170.json`;
const packDir = "archive/data/meta-foundation/canonical/packs/h1-foundation";
const sourceDriftPath = `${evidenceDir}/source_drift_hold_048.jsonl`;
const sourceRecoveryPath = `${evidenceDir}/source_drift_hold_048_resolution.jsonl`;
const readText = (file) => fs.readFileSync(path.join(root, file), "utf8");
const readJson = (file) => JSON.parse(readText(file));
const readJsonl = (file) => readText(file).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
const sha256 = (value) => crypto.createHash("sha256").update(value, "utf8").digest("hex");
const outputPath = `${evidenceDir}/archive2_runtime_validation.json`;
const failures = [];
const gate = (name, pass, detail = null) => {
  if (!pass) failures.push({ name, detail });
};
const runGateCommand = (name, script, args = []) => {
  try {
    execFileSync(process.execPath, [script, ...args], { cwd: root, stdio: "pipe" });
    return { name, status: "PASS" };
  } catch (error) {
    failures.push({ name, detail: String(error.stderr || error.message || error).slice(0, 2000) });
    return { name, status: "FAIL" };
  }
};
const deterministicChecks = [
  runGateCommand("compile-meta-foundation", "archive/tools/meta-foundation/compile-meta-foundation.mjs", ["--check"]),
  runGateCommand("validate-meta-foundation-pack", "archive/tools/meta-foundation/validate-meta-foundation-pack.mjs", [
    "--pack-dir", "archive/data/meta-foundation/canonical/packs/h1-foundation",
    "--assignments", "archive/data/meta-foundation/evidence/high1/v1/item_metadata_assignments_1170.json",
    "--runtime", "archive/data/meta-foundation/runtime/h1-foundation-v1.json",
    "--compiled-root", "archive/data/meta-foundation/compiled"
  ]),
  runGateCommand("build-archive2-catalog", "archive/tools/build-archive2-catalog.mjs", ["--check"])
];

const pack = readJson(`${packDir}/pack.json`);
const taxonomy = readJson(`${packDir}/taxonomy.json`);
const bindings = readJson(`${packDir}/bindings.json`);
const assignments = readJson(assignmentPath);
const runtime = readJson(runtimePath);
const metadata = readJson("archive/data/question_metadata.json");
const identity = readJson("archive/data/question_identity_map.json");
const compiledTaxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const compiledConcepts = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const compiledConditions = readJson("archive/data/meta-foundation/compiled/condition_registry.json");
const compiledBindings = readJson("archive/data/meta-foundation/compiled/curriculum_bindings.json");
const registryIndex = readJson("archive/data/meta-foundation/canonical/registry_index.json");
const metadataByUid = new Map(metadata.records.map((row) => [row.questionUid, row]));
const identityByUid = new Map(identity.records.map((row) => [row.questionUid, row]));
const compiledPT = new Map(compiledTaxonomy.problemTypes.map((row) => [row.problemTypeKey, row]));
const compiledTPL = new Map(compiledTaxonomy.templates.map((row) => [row.templateKey, row]));
const concepts = new Set(compiledConcepts.concepts.map((row) => row.conceptKey));
const conditions = new Set(compiledConditions.conditions.map((row) => row.conditionKey));
const bindingKey = (row) => [row.curriculum, row.standardUnitKey, row.subUnitKey === null ? "<DIRECT>" : row.subUnitKey, row.problemTypeKey].join("\0");
const bindingKeys = new Set(compiledBindings.bindings.map(bindingKey));
const patternSet = new Set(["NONE", "SEQUENTIAL", "INTERDEPENDENT", "REINTERPRETATION", "CASE_BRANCH", "DEEP_COMPOSITE"]);
const allowedBuckets = new Set([1, 2, 3, 4, 5, "UNKNOWN"]);
const allowedCompatibility = new Set(["NORMAL", "BORDERLINE_REVIEW", "BORDERLINE_ACCEPTABLE", "STRONG_CONFLICT", "UNKNOWN"]);

const uids = new Set();
const sources = new Set();
const assignmentByUid = new Map();
const runtimeByUid = new Map(runtime.records.map((row) => [row.questionUid, row]));
const activeRuntimeRows = runtime.records.filter((row) => row.metaFoundationPackId === "H1_FOUNDATION");
let parentMismatch = 0;
let missingL3 = 0;
let missingL4Disposition = 0;
let missingBinding = 0;
let invalidCrossConcept = 0;
let invalidCondition = 0;
let invalidIntegration = 0;
let invalidDifficulty = 0;
let difficultyMissing = 0;
let sourceFingerprintMismatch = 0;
let explicitHoldSourceFingerprintMismatch = 0;
let metadataParityMismatch = 0;
let explicitHold = 0;
let sourceHold = 0;
const difficultyDistribution = {};
const dispositionCounts = {};

for (const item of assignments.items) {
  if (uids.has(item.questionUid)) failures.push({ name: "duplicateUid", detail: item.questionUid });
  uids.add(item.questionUid);
  const sourceIdentity = `${item.sourceArchiveFile}#${Number(item.sourceOrdinal)}`;
  if (sources.has(sourceIdentity)) failures.push({ name: "duplicateSourceIdentity", detail: sourceIdentity });
  sources.add(sourceIdentity);
  assignmentByUid.set(item.questionUid, item);
  dispositionCounts[item.l4Disposition] = (dispositionCounts[item.l4Disposition] || 0) + 1;
  difficultyDistribution[String(item.difficultyBucket)] = (difficultyDistribution[String(item.difficultyBucket)] || 0) + 1;
  if (item.reviewStatus === "HOLD") explicitHold += 1;
  if (item.sourceHoldReason || item.sourceIssueHold) sourceHold += 1;
  if (!allowedBuckets.has(item.difficultyBucket)) invalidDifficulty += 1;
  if (item.difficultyBucket === "UNKNOWN") difficultyMissing += 1;
  if (!allowedCompatibility.has(item.legacyLevelCompatibility)) invalidDifficulty += 1;
  if (!item.l3Disposition || !item.problemTypeKey && item.l3Disposition !== "HOLD") missingL3 += 1;
  if (!item.l4Disposition) missingL4Disposition += 1;
  if (item.problemTypeKey && !compiledPT.has(item.problemTypeKey)) missingL3 += 1;
  if (item.templateKey) {
    const template = compiledTPL.get(item.templateKey);
    if (!template || template.parentProblemTypeKey !== item.problemTypeKey) parentMismatch += 1;
  } else if (item.l4Disposition === "ASSIGNED") {
    parentMismatch += 1;
  }
  if (item.problemTypeKey && !bindingKeys.has(bindingKey(item))) missingBinding += 1;
  for (const key of item.crossConceptKeys || []) if (!concepts.has(key)) invalidCrossConcept += 1;
  for (const key of item.conditionKeys || []) if (!conditions.has(key)) invalidCondition += 1;
  if (!patternSet.has(item.integrationPattern)) invalidIntegration += 1;
  const sidecar = metadataByUid.get(item.questionUid);
  const identityRow = identityByUid.get(item.questionUid);
  const runtimeRow = runtimeByUid.get(item.questionUid);
  if (!sidecar || !identityRow || !runtimeRow) {
    metadataParityMismatch += 1;
  } else {
    if (sidecar.sourceFingerprint !== item.sourceFingerprint || identityRow.sourceFingerprint !== item.sourceFingerprint) sourceFingerprintMismatch += 1;
    for (const field of ["problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys", "integrationPattern", "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility", "reviewStatus", "l3Disposition", "l4Disposition", "foundationTaxonomyStatus"]) {
      if (JSON.stringify(sidecar[field] ?? null) !== JSON.stringify(item[field] ?? null)) metadataParityMismatch += 1;
      if (JSON.stringify(runtimeRow[field] ?? null) !== JSON.stringify(item[field] ?? null)) metadataParityMismatch += 1;
    }
  }
}

const sourceDriftRows = readJsonl(sourceDriftPath);
const sourceDriftByUid = new Map(sourceDriftRows.map((row) => [row.questionUid, row]));
const sourceRecoveryRows = readJsonl(sourceRecoveryPath);
const sourceRecoveryByUid = new Map(sourceRecoveryRows.map((row) => [row.questionUid, row]));
let sourceDriftHandlingMismatch = 0;
for (const row of sourceDriftRows) {
  const item = assignmentByUid.get(row.questionUid);
  const resolution = sourceRecoveryByUid.get(row.questionUid);
  if (!item || !resolution || resolution.sourceIdentity !== row.sourceIdentity ||
      resolution.sourceArchiveFile !== row.sourceArchiveFile || Number(resolution.sourceOrdinal) !== Number(row.sourceOrdinal)) {
    sourceDriftHandlingMismatch += 1;
    continue;
  }
  if (resolution.status === "RESOLVED") {
    if (!["SOURCE_VERIFIED_NO_CHANGE", "SOURCE_REPAIR"].includes(resolution.sourceRecoveryDecision) ||
        resolution.qaDecision !== "QA_PASS" || resolution.fingerprintSyncStatus !== "SYNCED" ||
        item.sourceIssueHold === true || (item.holdReasons || []).includes("SOURCE_DRIFT_ORIGIN_MAIN") ||
        item.sourceFingerprint !== resolution.finalSourceFingerprint ||
        resolution.metadataSourceFingerprint !== resolution.finalSourceFingerprint) sourceDriftHandlingMismatch += 1;
  } else if (resolution.status === "REMAINS_HOLD") {
    const sourceHold = resolution.sourceRecoveryDecision === "SOURCE_HOLD";
    if (!resolution.holdReason || resolution.fingerprintSyncStatus !== "EXPLICIT_HOLD" ||
        item.runtimeSelectable === true || item.sourceFingerprint !== resolution.metadataSourceFingerprint ||
        !(item.reviewStatus === "HOLD" || item.sourceIssueHold === true || (item.holdReasons || []).length) ||
        (sourceHold && item.sourceIssueHold !== true) ||
        (!sourceHold && (item.sourceIssueHold === true || (item.holdReasons || []).includes("SOURCE_DRIFT_ORIGIN_MAIN")))) {
      sourceDriftHandlingMismatch += 1;
    }
  } else {
    sourceDriftHandlingMismatch += 1;
  }
}
const sourceRecoveryResolvedCount = sourceRecoveryRows.filter((row) => row.status === "RESOLVED").length;
const sourceRecoveryRemainsHoldCount = sourceRecoveryRows.filter((row) => row.status === "REMAINS_HOLD").length;
const sourceRecoveryFingerprintSyncCount = sourceRecoveryRows.filter((row) => row.status === "RESOLVED" && row.finalSourceFingerprint !== row.beforeFingerprint).length;
const sourceHoldCount = sourceRecoveryRows.filter((row) => row.sourceRecoveryDecision === "SOURCE_HOLD").length;
const sourceRecoveryExplicitFingerprintHoldCount = sourceRecoveryRows.filter((row) =>
  row.status === "REMAINS_HOLD" && row.finalSourceFingerprint !== row.metadataSourceFingerprint
).length;

// Independently re-hash all current H1 question source rows using Archive 2.0's
// production fingerprint formula and compare to metadata and identity sidecars.
const dbContext = { window: {}, console: { log() {}, warn() {}, error() {} } };
dbContext.globalThis = dbContext;
vm.createContext(dbContext);
vm.runInContext(readText("archive/db.js"), dbContext, { filename: "archive/db.js", timeout: 3000 });
const sourceByIdentity = new Map();
for (const exam of dbContext.window.mainDB.exams) {
  const sourceFile = core.normalizeFile(exam.file);
  const sourcePath = `archive/exams/${sourceFile}`;
  const sourceContext = { window: {}, console: { log() {}, warn() {}, error() {} } };
  sourceContext.globalThis = sourceContext;
  vm.createContext(sourceContext);
  vm.runInContext(readText(sourcePath), sourceContext, { filename: sourcePath, timeout: 3000 });
  const bank = sourceContext.window.questions || sourceContext.window.questionBank || sourceContext.questions || sourceContext.questionBank;
  if (!Array.isArray(bank)) throw new Error(`source bank missing: ${sourceFile}`);
  bank.forEach((question, index) => sourceByIdentity.set(`${sourceFile}#${index + 1}`, question));
}
for (const item of assignments.items) {
  const question = sourceByIdentity.get(`${item.sourceArchiveFile}#${item.sourceOrdinal}`);
  if (!question) {
    sourceFingerprintMismatch += 1;
    continue;
  }
  const actual = sha256(JSON.stringify({
    content: question.content ?? null,
    choices: Array.isArray(question.choices) ? question.choices : null,
    answer: question.answer ?? null,
    solution: question.solution ?? null,
    image: question.image ?? null
  }));
  const drift = sourceDriftByUid.get(item.questionUid);
  const resolution = sourceRecoveryByUid.get(item.questionUid);
  if (actual !== item.sourceFingerprint) {
    if (resolution?.status === "REMAINS_HOLD" && resolution.holdReason &&
        item.reviewStatus === "HOLD" && item.runtimeSelectable !== true) {
      // A deliberately un-synchronized QA hold remains excluded from Archive 2.0.
      explicitHoldSourceFingerprintMismatch += 1;
    } else {
      sourceFingerprintMismatch += 1;
    }
  }
  if (drift) {
    const expected = resolution?.finalSourceFingerprint || drift.currentMainSourceFingerprint;
    if (actual !== expected) sourceFingerprintMismatch += 1;
  }
}

gate("activeRegistryEntry", registryIndex.activePacks.some((row) => row.id === "H1_FOUNDATION" && row.version === "1.0.0" && row.status === "ACTIVE"));
gate("assignmentDenominator", assignments.items.length === 1170 && runtime.records.length === 1170 && activeRuntimeRows.length === 1170);
gate("uidUnique", uids.size === 1170);
gate("sourceIdentityUnique", sources.size === 1170);
gate("sourceDriftCoverage", sourceDriftRows.length === 48 && sourceDriftByUid.size === 48 && sourceRecoveryRows.length === 48 && sourceRecoveryByUid.size === 48 && sourceDriftHandlingMismatch === 0);
gate("l3MissingOnlyExplicitHold", missingL3 === 0);
gate("l4DispositionPresent", missingL4Disposition === 0);
gate("l3L4ParentMismatch", parentMismatch === 0);
gate("canonicalBindingMissing", missingBinding === 0);
gate("crossConceptIntegrity", invalidCrossConcept === 0);
gate("conditionIntegrity", invalidCondition === 0);
gate("integrationPatternIntegrity", invalidIntegration === 0);
gate("difficultyIntegrity", invalidDifficulty === 0);
gate("metadataParity", metadataParityMismatch === 0);
gate("sourceFingerprintIntegrity", sourceFingerprintMismatch === 0);
gate("sourceFingerprintMismatchOnlyExplicitHolds", sourceRecoveryExplicitFingerprintHoldCount === explicitHoldSourceFingerprintMismatch);

const packedCatalog = readJson("archive/data/archive2-catalog.json");
const catalog = core.decodeCatalog(packedCatalog);
const vmWindow = { Archive2Core: core };
const fetchArchiveAsset = async (url) => {
  const parsed = new URL(String(url));
  const prefix = "/archive/";
  if (!parsed.pathname.startsWith(prefix)) throw new Error(`unexpected runtime URL: ${parsed.pathname}`);
  const relative = `archive/${parsed.pathname.slice(prefix.length)}`;
  const value = readJson(relative);
  return { ok: true, status: 200, json: async () => value };
};
const runtimeContext = {
  window: vmWindow,
  document: { baseURI: "https://archive2.validation.test/archive/index.html" },
  URL,
  fetch: fetchArchiveAsset,
  console: { log() {}, warn() {}, error() {} },
  setTimeout,
  clearTimeout
};
runtimeContext.globalThis = runtimeContext;
vm.createContext(runtimeContext);
vm.runInContext(readText("archive/meta-foundation-runtime.js"), runtimeContext, { filename: "archive/meta-foundation-runtime.js", timeout: 3000 });
const overlaidCatalog = await runtimeContext.window.applyArchiveMetaFoundationCatalog(catalog);
const multiRuntime = runtimeContext.window.ARCHIVE_META_FOUNDATION_RUNTIME;
const runtimePackIdByUid = new Map(
  runtimeContext.window.ARCHIVE_META_FOUNDATION_RUNTIMES.flatMap((packRow) =>
    packRow.records.map((row) => [row.questionUid, packRow.packId])
  )
);
const h1CatalogRows = overlaidCatalog.records.filter((row) => row.metaFoundationPackId === "H1_FOUNDATION");
const h1EligibleRows = h1CatalogRows.filter((row) => core.eligibility(row).ok);
const heldButSelectable = h1CatalogRows.filter((row) => row.reviewStatus === "HOLD" && core.eligibility(row).ok).length;
const unknownButSelectable = h1CatalogRows.filter((row) => row.difficultyBucket === "UNKNOWN" && core.eligibility(row).ok).length;
const sourceHeldButSelectable = h1CatalogRows.filter((row) => row.sourceIssueHold && core.eligibility(row).ok).length;
const existingRuntimeRows = overlaidCatalog.records.filter((row) => {
  const packId = runtimePackIdByUid.get(row.questionUid);
  return packId && packId !== "H1_FOUNDATION";
});
const existingPackBridgeRegressionRows = existingRuntimeRows.filter((row) => core.eligibility(row).ok !== core.eligibility({ ...row, taxonomyStatus: "CONFIRMED" }).ok);
const existingRuntimeRecordsByPack = Object.fromEntries(
  runtimeContext.window.ARCHIVE_META_FOUNDATION_RUNTIMES
    .filter((packRow) => packRow.packId !== "H1_FOUNDATION")
    .map((packRow) => [packRow.packId, packRow.records.length])
);
const taxonomyRows = overlaidCatalog.taxonomy.filter((row) => row.curriculumKey && row.problemTypeKey && row.curriculumKey !== "");
const h1TaxonomyRows = taxonomyRows.filter((row) => {
  const usedByH1 = assignments.items.some((item) => item.curriculumKey === row.curriculumKey && item.courseKey === row.courseKey && item.L1 === row.L1 && item.L2 === row.L2 && item.problemTypeKey === row.problemTypeKey && (item.templateKey || "") === (row.templateKey || ""));
  return usedByH1;
});

let joinedSourceMismatch = 0;
const joinedSourceMismatchDetails = [];
for (const item of assignments.items) {
  const row = overlaidCatalog.records.find((candidate) => candidate.questionUid === item.questionUid);
  const resolution = sourceRecoveryByUid.get(item.questionUid);
  const explicitRecoveryHold = resolution?.status === "REMAINS_HOLD" && Boolean(resolution.holdReason) &&
    item.reviewStatus === "HOLD" && item.runtimeSelectable !== true;
  const sourceKeyMatches = row && core.normalizeFile(row.sourceFile) === item.sourceArchiveFile &&
    Number(row.sourceOrdinal) === Number(item.sourceOrdinal);
  const sourceFingerprintMatchesExpected = row && (explicitRecoveryHold
    ? row.sourceFingerprint === resolution.finalSourceFingerprint
    : row.sourceFingerprint === item.sourceFingerprint);
  const sourceStatusIsAllowed = row && (explicitRecoveryHold
    ? ["VERIFIED", "HOLD"].includes(row.sourceStatus)
    : row.sourceStatus === "VERIFIED");
  if (!row || row.metaFoundationPackId !== "H1_FOUNDATION" || !sourceKeyMatches || !sourceStatusIsAllowed || row.identityStatus !== "VERIFIED" || !sourceFingerprintMatchesExpected || row.approvedSourceFingerprint !== item.sourceFingerprint || row.reviewStatus !== item.reviewStatus || row.foundationTaxonomyStatus !== item.foundationTaxonomyStatus) {
    joinedSourceMismatch += 1;
    if (joinedSourceMismatchDetails.length < 40) joinedSourceMismatchDetails.push({
      questionUid: item.questionUid,
      sourceIdentity: item.sourceIdentity,
      catalogFound: Boolean(row),
      metaFoundationPackId: row?.metaFoundationPackId,
      sourceKeyMatches,
      sourceStatus: row?.sourceStatus,
      sourceStatusIsAllowed,
      identityStatus: row?.identityStatus,
      sourceFingerprintMatchExpected: sourceFingerprintMatchesExpected,
      approvedSourceFingerprintMatch: row?.approvedSourceFingerprint === item.sourceFingerprint,
      reviewStatusMatch: row?.reviewStatus === item.reviewStatus,
      foundationTaxonomyStatusMatch: row?.foundationTaxonomyStatus === item.foundationTaxonomyStatus,
      itemReviewStatus: item.reviewStatus,
      catalogReviewStatus: row?.reviewStatus,
      itemFoundationTaxonomyStatus: item.foundationTaxonomyStatus,
      catalogFoundationTaxonomyStatus: row?.foundationTaxonomyStatus
    });
  }
}
gate("archive2RuntimePackLoaded", multiRuntime.packs.length === 10 && multiRuntime.records.length === 5087);
gate("archive2H1DirectJoin", h1CatalogRows.length === 1170 && joinedSourceMismatch === 0, {
  h1CatalogRows: h1CatalogRows.length,
  joinedSourceMismatch
});
gate("archive2H1FilterTaxonomy", h1TaxonomyRows.length > 0 && h1CatalogRows.some((row) => row.curriculumKey && row.courseKey && row.standardUnitKey && row.subUnitKey));
gate("archive2H1SelectableCount", h1EligibleRows.length === runtime.counts.runtimeSelectable);
gate("explicitHoldNotSelectable", heldButSelectable === 0);
gate("unknownDifficultyBasicParity", h1CatalogRows.filter(row => row.difficultyBucket === "UNKNOWN").every(row =>
  core.basicEligibility(row).ok === core.basicEligibility({ ...row, difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL" }).ok));
gate("sourceHoldNotSelectable", sourceHeldButSelectable === 0);
gate("existingPackRuntimeRegression", existingPackBridgeRegressionRows.length === 0);

let selectionSmoke = { status: "NOT_RUN", selectedCount: 0, reviewStatus: "NOT_RUN", errors: [] };
let archive2QuestionSearch = { status: "NOT_RUN", count: 0, matchedUid: null };
let archive2ExamGeneration = { status: "NOT_RUN", preparedCount: 0, sourceRestored: false, outputPath: null, questionUids: [] };
const selectionTarget = h1EligibleRows.find((row) => row.templateKey && row.effectiveBrowseGrade);
if (selectionTarget) {
  const selectionPath = core.pathKey(selectionTarget, 4);
  const l3Filter = core.advancedFilterValue(selectionTarget, 3);
  const l4Filter = core.advancedFilterValue(selectionTarget, 4);
  const searchTerm = selectionTarget.L2 || selectionTarget.L1 || selectionTarget.school || "";
  const finderFilters = {
    grade: selectionTarget.effectiveBrowseGrade,
    primaryPaths: [selectionPath],
    L3: l3Filter,
    L4: l4Filter,
    difficultyBuckets: [selectionTarget.difficultyBucket],
    query: searchTerm
  };
  const searchedRows = overlaidCatalog.records.filter((row) => core.matches(row, finderFilters));
  archive2QuestionSearch = {
    status: Boolean(l3Filter && l4Filter && finderFilters.difficultyBuckets.length) &&
      searchedRows.some((row) => row.questionUid === selectionTarget.questionUid) ? "PASS" : "FAIL",
    count: searchedRows.length,
    matchedUid: searchedRows.find((row) => row.questionUid === selectionTarget.questionUid)?.questionUid || null,
    filters: { grade: finderFilters.grade, primaryPath: selectionPath, L3: l3Filter, L4: l4Filter, difficultyBucket: selectionTarget.difficultyBucket, query: searchTerm }
  };
  const request = {
    filters: finderFilters,
    rows: [{ id: "h1-meta-foundation-smoke", count: 1, depth: 4, path: selectionPath, difficultyBuckets: [selectionTarget.difficultyBucket] }],
    pins: [{ questionUid: selectionTarget.questionUid, rowId: "h1-meta-foundation-smoke" }],
    seed: "h1-foundation-archive2-production-validation"
  };
  const result = core.selectBlueprint(overlaidCatalog.records, request);
  const review = core.review(result.selected, request);
  selectionSmoke = {
    status: result.ok ? "PASS" : "FAIL",
    selectedCount: result.selected.length,
    reviewStatus: review.status,
    selectedPackIds: [...new Set(result.selected.map((row) => row.metaFoundationPackId))],
    errors: [...result.errors, ...review.hardFailures]
  };
  gate("archive2QuestionSearchAndFilters", archive2QuestionSearch.status === "PASS");
  gate("archive2ExamSelectionPipeline", result.ok && result.selected.length === 1 && result.selected[0].metaFoundationPackId === "H1_FOUNDATION" && review.status === "PASS");
  if (result.ok && result.selected.length === 1 && review.status === "PASS") {
    const priorDocument = globalThis.document;
    const priorFetch = globalThis.fetch;
    globalThis.document = { baseURI: "https://archive2.validation.test/archive/" };
    globalThis.fetch = async (input) => {
      const parsed = new URL(String(input));
      const prefix = "/archive/";
      if (!parsed.pathname.startsWith(prefix)) throw new Error("unexpected source restore URL: " + parsed.pathname);
      const relative = "archive/" + decodeURIComponent(parsed.pathname.slice(prefix.length));
      return { ok: true, status: 200, text: async () => readText(relative) };
    };
    try {
      const restoredQuestions = await archive2Source.restore(result.selected, catalog);
      const header = archive2Output.settings({
        header: { title: "H1 Archive 2.0 validation" },
        qpp: 4,
        includeQr: false
      });
      const generationMeta = {
        title: header.header.title,
        count: restoredQuestions.length,
        grade: selectionTarget.effectiveBrowseGrade,
        questionUids: restoredQuestions.map((row) => row.questionUid),
        printHeaderOptions: header.header,
        qpp: header.qpp,
        includeQr: header.includeQr,
        sourceType: "mixed",
        outputContractVersion: core.VERSION,
        indexVersion: catalog.indexVersion
      };
      const generatedKey = "archive2-h1-source-drift48-validation";
      const paperStoragePayload = {
        ["mixedQuestions_" + generatedKey]: JSON.stringify(restoredQuestions),
        ["mixedMeta_" + generatedKey]: JSON.stringify(generationMeta)
      };
      const storedQuestions = JSON.parse(paperStoragePayload["mixedQuestions_" + generatedKey]);
      const storedMeta = JSON.parse(paperStoragePayload["mixedMeta_" + generatedKey]);
      const outputUrl = archive2Output.engineUrl("mixed_engine.html", "https://archive2.validation.test/archive/workspace.html");
      outputUrl.searchParams.set("key", generatedKey);
      outputUrl.searchParams.set("q", String(storedQuestions.length));
      archive2Output.applyUrl(outputUrl, header);
      archive2ExamGeneration = {
        status: storedQuestions.length === 1 && storedMeta.count === 1 &&
          storedMeta.questionUids[0] === selectionTarget.questionUid &&
          outputUrl.pathname.endsWith("/mixed_engine.html") ? "PASS" : "FAIL",
        preparedCount: storedQuestions.length,
        sourceRestored: storedQuestions.length === 1,
        storageContract: Object.keys(paperStoragePayload).sort(),
        outputPath: outputUrl.pathname + outputUrl.search,
        questionUids: generationMeta.questionUids,
        title: archive2Output.displayTitle({ year: selectionTarget.year, school: selectionTarget.school, grade: selectionTarget.effectiveBrowseGrade, semester: selectionTarget.semester, examType: selectionTarget.examAxis, contentType: "기출", file: selectionTarget.sourceFile }),
        indexVersion: generationMeta.indexVersion
      };
    } finally {
      globalThis.document = priorDocument;
      globalThis.fetch = priorFetch;
    }
  }
  gate("archive2ExamGenerationPath", archive2ExamGeneration.status === "PASS");
} else {
  gate("archive2ExamSelectionPipeline", false, "no selectable H1 item with a current L4 key was found");
  gate("archive2QuestionSearchAndFilters", false, "no selectable H1 item with a current L4 key was found");
  gate("archive2ExamGenerationPath", false, "no selectable H1 item with a current L4 key was found");
}

const result = {
  schemaVersion: "h1-foundation-archive2-production-validation-v1",
  status: failures.length ? "FAIL" : "PASS",
  packId: "H1_FOUNDATION",
  packVersion: "1.0.0",
  createdAt: new Date().toISOString(),
  globalCounts: {
    assignments: assignments.items.length,
    uniqueUid: uids.size,
    uniqueSourceIdentity: sources.size,
    finalDifficulty: difficultyDistribution,
    explicitHold,
    sourceHold,
    runtimeSelectable: runtime.counts.runtimeSelectable,
    l3Unique: new Set(assignments.items.map((row) => row.problemTypeKey).filter(Boolean)).size,
    l3New: taxonomy.problemTypes.length,
    l4AssignedUnique: new Set(assignments.items.map((row) => row.templateKey).filter(Boolean)).size,
    l4New: taxonomy.templates.length,
    l3l4ParentMismatch: parentMismatch,
    missingBinding,
    crossConceptRegisteredCount: concepts.size,
    crossConceptUsedCount: new Set(assignments.items.flatMap((row) => row.crossConceptKeys || [])).size,
    unregisteredCrossConceptCount: invalidCrossConcept,
    conditionKeyCount: conditions.size,
    conditionUsedCount: new Set(assignments.items.flatMap((row) => row.conditionKeys || [])).size,
    unregisteredConditionCount: invalidCondition,
    integrationPatternsUsed: [...new Set(assignments.items.map((row) => row.integrationPattern))].sort(),
    explicitL3Holds: assignments.items.filter((row) => row.l3Disposition === "HOLD").length,
    explicitL4Holds: assignments.items.filter((row) => row.l4Disposition === "HOLD").length,
    noSeparateL4: assignments.items.filter((row) => row.l4Disposition === "NO_SEPARATE_L4").length,
    borderLineReview: assignments.items.filter((row) => row.legacyLevelCompatibility === "BORDERLINE_REVIEW").length
  },
  archive2: {
    catalogQuestions: catalog.records.length,
    combinedRuntimePacks: multiRuntime.packs.length,
    combinedRuntimeRecords: multiRuntime.records.length,
    h1JoinedRecords: h1CatalogRows.length,
    h1JoinedSourceMismatch: joinedSourceMismatch,
    h1JoinedSourceMismatchDetails: joinedSourceMismatchDetails,
    h1FilterTaxonomyRows: h1TaxonomyRows.length,
    h1EligibleRecords: h1EligibleRows.length,
    h1HeldButSelectable: heldButSelectable,
    h1UnknownDifficultyButSelectable: unknownButSelectable,
    h1SourceHeldButSelectable: sourceHeldButSelectable,
    existingPackRecordsChecked: existingRuntimeRows.length,
    existingPackRuntimeEligibilityChanges: existingPackBridgeRegressionRows.length,
    existingRuntimeRecordsByPack,
    questionSearchAndFilters: archive2QuestionSearch,
    examSelectionPipeline: selectionSmoke,
    examGenerationPath: archive2ExamGeneration,
    catalogIndexVersion: catalog.indexVersion,
    runtimeVersion: multiRuntime.runtimeVersion
  },
  deterministicChecks,
  gates: failures,
  sourceRecovery: {
    inventoryRows: sourceDriftRows.length,
    resolved: sourceRecoveryResolvedCount,
    remainsHold: sourceRecoveryRemainsHoldCount,
    sourceHolds: sourceHoldCount,
    changedSourceFingerprints: sourceRecoveryFingerprintSyncCount,
    explicitHoldFingerprintMismatches: explicitHoldSourceFingerprintMismatch,
    unheldFingerprintMismatches: sourceFingerprintMismatch
  },
  expectedHoldPolicy: {
    sourceDriftUids: sourceDriftRows.length,
    sourceRecoveryResolved: sourceRecoveryResolvedCount,
    sourceRecoveryRemainsHold: sourceRecoveryRemainsHoldCount,
    sourceHoldCount,
    explicitFingerprintMismatchesAllowedOnlyForHeldRows: true,
    repeatedSemanticReview: false
  }
};

if (!failures.length) {
  const receiptPath = "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json";
  const receipt = readJson(receiptPath);
  receipt.status = "ACTIVE";
  receipt.runtimeVersion = "META_FOUNDATION_MULTI/runtime-bridge-v5";
  const checked = receipt.checked || (receipt.checked = {});
  Object.assign(checked, {
    combinedRuntimeRecords: multiRuntime.records.length,
    existingPackRecordsChecked: existingRuntimeRows.length,
    existingPackEligibilityChanges: existingPackBridgeRegressionRows.length,
    existingRuntimeRecordsByPack,
    combinedUniqueUid: new Set(multiRuntime.records.map((row) => row.questionUid)).size,
    combinedUniqueSourceIdentity: new Set(multiRuntime.records.map((row) => `${row.sourceArchiveFile}#${row.sourceOrdinal}`)).size,
    combinedRuntimeCatalogJoin: h1CatalogRows.length + (multiRuntime.records.length - activeRuntimeRows.length),
    combinedRuntimeCatalogJoinMismatch: 0,
    archive2CatalogIndexVersion: catalog.indexVersion || "",
    questionMetadataDigest: metadata.digest || "",
    metaFoundationRuntimePackCount: multiRuntime.packs.length,
    metaFoundationRuntimeUrlCount: multiRuntime.packs.length,
    h1FoundationRuntimeRecords: activeRuntimeRows.length,
    h1FoundationExistingCatalogUidJoin: h1CatalogRows.length,
    h1FoundationSourceIdentityRepairJoin: 0,
    h1FoundationCatalogJoin: h1CatalogRows.length,
    h1FoundationCatalogJoinMismatch: 0,
    h1FoundationFinalL3: assignments.items.filter((row) => row.l3Disposition === "ASSIGNED").length,
    h1FoundationFinalL4: assignments.items.filter((row) => row.l4Disposition === "ASSIGNED").length,
    h1FoundationExplicitL3Hold: assignments.items.filter((row) => row.l3Disposition === "HOLD").length,
    h1FoundationExplicitL4Hold: assignments.items.filter((row) => row.l4Disposition === "HOLD").length,
    h1FoundationNoSeparateL4: assignments.items.filter((row) => row.l4Disposition === "NO_SEPARATE_L4").length,
    h1FoundationDifficultyHold: assignments.items.filter((row) => row.difficultyBucket === "UNKNOWN").length,
    h1FoundationLatestMainSourceHold: sourceHoldCount,
    h1FoundationSourceHold: sourceHold,
    h1FoundationRuntimeSelectable: h1EligibleRows.length,
    h1FoundationAutomaticEligibleExpected: h1EligibleRows.length,
    middle1RuntimeRecords: runtimeContext.window.ARCHIVE_META_FOUNDATION_RUNTIMES.find((row) => row.packId === "MIDDLE1")?.records.length || 0
  });
  receipt.archive2JoinContract = {
    ...(receipt.archive2JoinContract || {}),
    expectedRuntimeJoin: multiRuntime.records.length,
    runtimePackCount: multiRuntime.packs.length,
    catalogBuilder: "archive/tools/build-archive2-catalog.mjs",
    joinKey: "questionUid with direct sourceArchiveFile#sourceOrdinal parity",
    browserRuntimeGate: "applyArchiveMetaFoundationCatalog requires joined === runtime.counts.records"
  };
  const existingInvariants = (receipt.invariants || []).filter((line) => !/Current active runtime pack count is|Current active runtime join is|H1_FOUNDATION joins Archive 2.0|H1_FOUNDATION retains/.test(line));
  receipt.invariants = [
    ...existingInvariants,
    `Current active runtime pack count is ${multiRuntime.packs.length}, including MIDDLE_GEOMETRY, MIDDLE1, and H1_FOUNDATION.`,
    `Current active runtime join is ${multiRuntime.records.length}/${multiRuntime.records.length} with UID/source-identity duplicate counts 0.`,
    `H1_FOUNDATION joins Archive 2.0 by direct questionUid for ${h1CatalogRows.length}/${activeRuntimeRows.length} rows.`,
    `H1_FOUNDATION retains ${explicitHold} explicit item holds; ${h1EligibleRows.length} rows are selectable by the production eligibility gate.`
  ];
  fs.writeFileSync(path.join(root, receiptPath), JSON.stringify(receipt, null, 2) + "\n", "utf8");
  result.archive2.runtimeBridgeReceiptUpdated = true;
  result.archive2.runtimeBridgeReceiptPackCount = multiRuntime.packs.length;
  result.archive2.runtimeBridgeReceiptJoinCount = multiRuntime.records.length;
}

if (!failures.length) {
  const auditPath = `${evidenceDir}/global_integrity_audit.json`;
  const audit = readJson(auditPath);
  audit.status = "PASS";
  audit.latestMainSourceDrift = {
    ...(audit.latestMainSourceDrift || {}),
    path: sourceRecoveryPath,
    total: sourceDriftRows.length,
    resolved: sourceRecoveryResolvedCount,
    remainsHold: sourceRecoveryRemainsHoldCount,
    reviewAgain: false
  };
  audit.counts = {
    ...(audit.counts || {}),
    sourceDriftHold: assignments.items.filter((row) => row.sourceIssueHold === true && row.sourceHoldReason === "LATEST_MAIN_SOURCE_CHANGED_NO_REVIEW_AUTHORIZED").length,
    sourceFingerprintSync: sourceRecoveryFingerprintSyncCount,
    explicitHoldFingerprintMismatches: explicitHoldSourceFingerprintMismatch,
    explicitHold: explicitHold
  };
  audit.validation = {
    ...(audit.validation || {}),
    deterministicCompilerCheck: "PASS",
    genericPackValidator: "PASS",
    archive2CatalogGeneratorCheck: "PASS",
    archive2RuntimeBridge: "PASS",
    archive2ExamSelectionPipeline: "PASS",
    archive2QuestionSearchAndFilters: "PASS",
    archive2ExamGenerationPath: "PASS",
    sourceFingerprintMismatchAfterSync: sourceFingerprintMismatch,
    explicitHoldSourceFingerprintMismatch: explicitHoldSourceFingerprintMismatch,
    compiledJoinMissing: 0,
    runtimeJoinMissing: 0,
    l3l4ParentMismatch: parentMismatch,
    unregisteredCrossConcept: invalidCrossConcept,
    unregisteredCondition: invalidCondition,
    invalidIntegrationPattern: invalidIntegration,
    invalidDifficultyBucket: invalidDifficulty
  };
  audit.runtime = {
    combinedPackCount: multiRuntime.packs.length,
    combinedRuntimeRecords: multiRuntime.records.length,
    h1RuntimeRecords: h1CatalogRows.length,
    h1RuntimeSelectable: h1EligibleRows.length,
    h1ExplicitHold: explicitHold,
    h1LatestMainSourceHold: sourceHoldCount,
    h1CatalogIndexVersion: catalog.indexVersion,
    productionSelectionSmoke: selectionSmoke
  };
  fs.writeFileSync(path.join(root, auditPath), JSON.stringify(audit, null, 2) + "\n", "utf8");
  const promotionPath = `${evidenceDir}/promotion_receipt.json`;
  const promotion = readJson(promotionPath);
  promotion.status = "VALIDATED_READY_FOR_BRANCH_CHECKPOINT";
  promotion.validationPath = outputPath;
  promotion.validationStatus = "PASS";
  promotion.sourceFingerprintSyncCount = sourceRecoveryFingerprintSyncCount;
  promotion.sourceHoldCount = sourceHold;
  promotion.explicitHoldFingerprintMismatchCount = explicitHoldSourceFingerprintMismatch;
  promotion.sourceDriftResolvedCount = sourceRecoveryResolvedCount;
  promotion.sourceDriftRemainsHoldCount = sourceRecoveryRemainsHoldCount;
  promotion.archive2RuntimeRecords = multiRuntime.records.length;
  promotion.archive2H1DirectJoin = h1CatalogRows.length;
  promotion.archive2H1RuntimeSelectable = h1EligibleRows.length;
  promotion.archive2ExamSelectionPipeline = "PASS";
  fs.writeFileSync(path.join(root, promotionPath), JSON.stringify(promotion, null, 2) + "\n", "utf8");
}

fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
fs.writeFileSync(path.join(root, outputPath), JSON.stringify(result, null, 2) + "\n", "utf8");
process.stdout.write(JSON.stringify(result, null, 2) + "\n");
if (failures.length) process.exitCode = 1;
