#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import core from "../../archive2-core.js";

const mode = process.argv.slice(2).find((arg) => arg === "--check" || arg === "--write");
if (!mode || process.argv.slice(2).filter((arg) => arg === "--check" || arg === "--write").length !== 1)
  throw new Error("Usage: node archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs (--check|--write)");

const archiveRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const repoRoot = path.resolve(archiveRoot, "..");
const runtimeDir = path.join(archiveRoot, "data/meta-foundation/runtime");
const manifestRelativePath = "archive/data/archive2-canonical-input-manifest.json";
const manifestPath = path.join(repoRoot, ...manifestRelativePath.split("/"));
const normalizeText = (value) => String(value).replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const readJson = (file) => JSON.parse(normalizeText(fs.readFileSync(file, "utf8")));
const writeJson = (file, value) => JSON.stringify(value, null, 2) + "\n";
const normalizeSourceFile = (value) => core.normalizeFile(value);
const sourceKey = (file, ordinal) => `${normalizeSourceFile(file)}#${Number(ordinal)}`;

const manifest = readJson(manifestPath);
const resources = {};
const files = {};
for (const row of manifest.files || []) {
  const file = path.resolve(archiveRoot, row.path);
  const bytes = Buffer.from(normalizeText(fs.readFileSync(file, "utf8")), "utf8");
  const actualSha = sha256(bytes);
  if (actualSha !== String(row.sha256 || "").toLowerCase())
    throw new Error(`Archive2 canonical input digest mismatch: ${row.path}`);
  resources[row.path] = JSON.parse(bytes.toString("utf8"));
  files[row.path] = { sha256: actualSha };
}
const sortedFiles = (manifest.files || [])
  .map((row) => ({ path: row.path, sha256: String(row.sha256).toLowerCase() }))
  .sort((a, b) => a.path.localeCompare(b.path));
const projectionVersion = `archive2-canonical-v1:${sha256(JSON.stringify({
  resolverVersion: manifest.resolverVersion,
  files: sortedFiles,
}))}`;
if (projectionVersion !== manifest.projectionVersion)
  throw new Error("Archive2 canonical manifest projection version mismatch");
const catalog = core.Canonical.resolveCatalog({
  versionBundle: { manifest, projectionVersion, files, resources },
});
if (!catalog.canonicalAuthority || !catalog.indexVersion)
  throw new Error("Archive2 canonical source authority is incomplete");
const packedCatalog = core.decodeCatalog(resources["data/archive2-catalog.json"]);

const packs = [
  { id: "DERIVATIVE", file: "derivative-v1.json", receiptPrefix: "derivative" },
  { id: "INTEGRAL_CALCULUS", file: "integral-calculus-v1.json", receiptPrefix: "integralCalculus" },
];
const catalogByUid = new Map(catalog.records.filter((row) => row.questionUid).map((row) => [row.questionUid, row]));
const packedBySource = new Map(packedCatalog.records.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));
const outputFiles = new Map();
const packReports = {};

for (const pack of packs) {
  const runtimePath = path.join(runtimeDir, pack.file);
  const runtime = readJson(runtimePath);
  if (runtime.packId !== pack.id || !Array.isArray(runtime.records))
    throw new Error(`Unexpected runtime pack identity: ${pack.file}`);
  const seenUids = new Set();
  const seenSources = new Set();
  const heldRecords = [];
  let directUidJoinCount = 0;
  let sourceIdentityRepairJoinCount = 0;
  let currentCatalogUidDirectJoinCount = 0;
  let currentCatalogSourceIdentityRepairJoinCount = 0;
  let currentCatalogJoinMismatchCount = 0;
  let sourceReadyCount = 0;
  let sourceHoldCount = 0;
  let currentCatalogSourceHoldDirectCount = 0;
  let supplementaryCount = 0;

  for (const overlay of runtime.records) {
    const source = sourceKey(overlay.sourceArchiveFile, overlay.sourceOrdinal);
    if (!overlay.questionUid || seenUids.has(overlay.questionUid))
      throw new Error(`Duplicate/missing runtime question UID: ${pack.id}/${overlay.questionUid}`);
    if (seenSources.has(source))
      throw new Error(`Duplicate runtime source identity: ${pack.id}/${source}`);
    seenUids.add(overlay.questionUid);
    seenSources.add(source);

    const base = packedBySource.get(source);
    const record = catalogByUid.get(overlay.questionUid);
    const identity = catalog.canonicalAuthority.identityByUid?.[overlay.questionUid];
    if (!base || !record || !identity)
      throw new Error(`Runtime canonical join missing: ${pack.id}/${overlay.questionUid}/${source}`);
    if (normalizeSourceFile(identity.sourceArchiveFile) !== normalizeSourceFile(overlay.sourceArchiveFile) ||
        Number(identity.sourceOrdinal) !== Number(overlay.sourceOrdinal) || identity.status !== "VERIFIED")
      throw new Error(`Runtime source identity mismatch: ${pack.id}/${overlay.questionUid}`);

    const repaired = base.questionUid !== overlay.questionUid;
    if (repaired) {
      if (base.questionUid !== "" || overlay.catalogIdentityRepairVerified !== true)
        throw new Error(`Unverified source identity repair: ${pack.id}/${overlay.questionUid}`);
      sourceIdentityRepairJoinCount += 1;
      if (identity.status === "VERIFIED" && normalizeSourceFile(identity.sourceArchiveFile) === normalizeSourceFile(overlay.sourceArchiveFile) &&
          Number(identity.sourceOrdinal) === Number(overlay.sourceOrdinal))
        currentCatalogSourceIdentityRepairJoinCount += 1;
      else currentCatalogJoinMismatchCount += 1;
    } else {
      directUidJoinCount += 1;
      if (base.questionUid === overlay.questionUid && identity.status === "VERIFIED")
        currentCatalogUidDirectJoinCount += 1;
      else currentCatalogJoinMismatchCount += 1;
    }

    const reasons = core.eligibility(record, { canonicalAuthority: catalog.canonicalAuthority }).reasons;
    const sourceReleased = record.identityStatus === "VERIFIED" &&
      record.sourceIntegrityStatus === "VERIFIED" && record.sourceStatus === "VERIFIED";
    if (sourceReleased) {
      sourceReadyCount += 1;
      if (overlay.curriculumApplicability === "SUPPLEMENTARY_OUTSIDE_CORE") supplementaryCount += 1;
    } else {
      sourceHoldCount += 1;
      if (!repaired) currentCatalogSourceHoldDirectCount += 1;
      if (!reasons.includes("source_release"))
        throw new Error(`Canonical source hold lacks source_release reason: ${pack.id}/${overlay.questionUid}`);
      heldRecords.push({
        questionUid: overlay.questionUid,
        sourceArchiveFile: overlay.sourceArchiveFile,
        sourceOrdinal: Number(overlay.sourceOrdinal),
        sourceStatus: record.sourceStatus,
        identityStatus: record.identityStatus,
        sourceIntegrityStatus: record.sourceIntegrityStatus,
        approvedSourceFingerprint: record.approvedSourceFingerprint || "",
        currentSourceFingerprint: record.sourceFingerprint || "",
        releaseGateReasons: reasons,
      });
    }
  }

  if (sourceReadyCount + sourceHoldCount !== runtime.records.length)
    throw new Error(`Runtime source readiness does not close for ${pack.id}`);
  if (currentCatalogUidDirectJoinCount + currentCatalogSourceIdentityRepairJoinCount + currentCatalogJoinMismatchCount !== runtime.records.length || currentCatalogJoinMismatchCount !== 0)
    throw new Error(`Current canonical source identity join failed for ${pack.id}`);

  runtime.counts = { ...(runtime.counts || {}) };
  runtime.counts.sourceHold = sourceHoldCount;
  runtime.counts.currentCatalogUidDirectJoin = currentCatalogUidDirectJoinCount;
  runtime.counts.currentCatalogSourceIdentityRepairJoin = currentCatalogSourceIdentityRepairJoinCount;
  runtime.counts.currentCatalogJoinMismatch = currentCatalogJoinMismatchCount;
  runtime.counts.currentCatalogSourceHoldDirect = currentCatalogSourceHoldDirectCount;
  runtime.counts.automaticEligibleExpected = sourceReadyCount - supplementaryCount;
  outputFiles.set(path.relative(repoRoot, runtimePath).replace(/\\/g, "/"), writeJson(runtimePath, runtime));

  packReports[pack.id] = {
    runtimeFile: `archive/data/meta-foundation/runtime/${pack.file}`,
    runtimeRecords: runtime.records.length,
    directUidJoinCount,
    sourceIdentityRepairJoinCount,
    currentCatalogUidDirectJoinCount,
    currentCatalogSourceIdentityRepairJoinCount,
    currentCatalogJoinMismatchCount,
    currentCatalogSourceHoldDirectCount,
    sourceReadyCount,
    sourceHoldCount,
    supplementaryCount,
    automaticEligibleExpected: sourceReadyCount - supplementaryCount,
    heldRecords,
  };
}

const allRuntimeRecords = core.Canonical.RUNTIME_INPUT_PATHS.flatMap((relative) =>
  readJson(path.join(archiveRoot, relative)).records || [],
);
const allUidCount = new Set(allRuntimeRecords.map((row) => row.questionUid)).size;
const allSourceCount = new Set(allRuntimeRecords.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size;
if (allUidCount !== allRuntimeRecords.length || allSourceCount !== allRuntimeRecords.length)
  throw new Error("Combined runtime UID/source identity uniqueness failed");
let combinedDirectJoinCount = 0;
let combinedSourceIdentityRepairJoinCount = 0;
let combinedJoinMismatchCount = 0;
for (const overlay of allRuntimeRecords) {
  const base = packedBySource.get(sourceKey(overlay.sourceArchiveFile, overlay.sourceOrdinal));
  const identity = catalog.canonicalAuthority.identityByUid?.[overlay.questionUid];
  if (!base || !identity || identity.status !== "VERIFIED" ||
      normalizeSourceFile(identity.sourceArchiveFile) !== normalizeSourceFile(overlay.sourceArchiveFile) ||
      Number(identity.sourceOrdinal) !== Number(overlay.sourceOrdinal)) {
    combinedJoinMismatchCount += 1;
  } else if (base.questionUid === overlay.questionUid) {
    combinedDirectJoinCount += 1;
  } else if (base.questionUid === "" && overlay.catalogIdentityRepairVerified === true) {
    combinedSourceIdentityRepairJoinCount += 1;
  } else {
    combinedJoinMismatchCount += 1;
  }
}
if (combinedDirectJoinCount + combinedSourceIdentityRepairJoinCount + combinedJoinMismatchCount !== allRuntimeRecords.length || combinedJoinMismatchCount !== 0)
  throw new Error("Combined runtime canonical source identity join failed");

const activeRuntimePacks = core.Canonical.RUNTIME_INPUT_PATHS.map((relative) => {
  const relativePath = path.relative(archiveRoot, path.join(archiveRoot, relative)).replace(/\\/g, "/");
  const targetOutput = outputFiles.get(path.relative(repoRoot, path.join(archiveRoot, relative)).replace(/\\/g, "/"));
  const fileText = targetOutput || normalizeText(fs.readFileSync(path.join(archiveRoot, relative), "utf8"));
  const runtime = JSON.parse(fileText);
  return {
    packId: runtime.packId,
    records: runtime.records || [],
    runtimeFile: path.basename(relativePath),
    runtimeSha256: sha256(fileText),
  };
}).sort((a, b) => a.packId.localeCompare(b.packId, "en"));

const receiptPath = path.join(runtimeDir, "runtime-bridge-receipt.json");
const receipt = readJson(receiptPath);
receipt.checked = { ...(receipt.checked || {}) };
receipt.checked.archive2CatalogIndexVersion = catalog.indexVersion;
receipt.checked.combinedRuntimeRecords = allRuntimeRecords.length;
receipt.checked.combinedUniqueUid = allUidCount;
receipt.checked.combinedUniqueSourceIdentity = allSourceCount;
receipt.checked.combinedRuntimeCatalogJoin = combinedDirectJoinCount + combinedSourceIdentityRepairJoinCount;
receipt.checked.combinedRuntimeCatalogDirectJoin = combinedDirectJoinCount;
receipt.checked.combinedRuntimeCatalogSourceIdentityRepairJoin = combinedSourceIdentityRepairJoinCount;
receipt.checked.combinedRuntimeCatalogJoinMismatch = combinedJoinMismatchCount;
receipt.checked.existingRuntimeRecordsByPack = Object.fromEntries(activeRuntimePacks.map((pack) => [pack.packId, pack.records.length]));
receipt.checked.metaFoundationRuntimePackCount = activeRuntimePacks.length;
receipt.checked.metaFoundationRuntimeUrlCount = activeRuntimePacks.length;
const packRecordCountFields = {
  DERIVATIVE: "derivativeRuntimeRecords",
  INTEGRAL_CALCULUS: "integralCalculusRuntimeRecords",
  LIMIT_CONTINUITY: "limitContinuityRuntimeRecords",
  FUNCTIONS_GRAPHS: "functionsGraphsRuntimeRecords",
  GEOMETRY_EQUATIONS: "geometryRecords",
  MIDDLE_GEOMETRY: "middleGeometryRuntimeRecords",
  MIDDLE1: "middle1RuntimeRecords",
  H1_FOUNDATION: "h1FoundationRuntimeRecords",
  PROBABILITY_STATISTICS: "probabilityStatisticsRuntimeRecords",
  SETS_PROPOSITIONS: "setsPropositionsRuntimeRecords",
};
for (const pack of activeRuntimePacks) {
  const field = packRecordCountFields[pack.packId];
  if (field) receipt.checked[field] = pack.records.length;
}
for (const pack of packs) {
  const report = packReports[pack.id];
  receipt.checked[`${pack.receiptPrefix}RuntimeRecords`] = report.runtimeRecords;
  receipt.checked[`${pack.receiptPrefix}ExistingCatalogUidJoin`] = report.currentCatalogUidDirectJoinCount;
  receipt.checked[`${pack.receiptPrefix}SourceIdentityRepairJoin`] = report.currentCatalogSourceIdentityRepairJoinCount;
  receipt.checked[`${pack.receiptPrefix}CatalogJoin`] = report.currentCatalogUidDirectJoinCount + report.currentCatalogSourceIdentityRepairJoinCount;
  receipt.checked[`${pack.receiptPrefix}CatalogJoinMismatch`] = report.currentCatalogJoinMismatchCount;
  receipt.checked[`${pack.receiptPrefix}SourceHold`] = report.sourceHoldCount;
  receipt.checked[`${pack.receiptPrefix}AutomaticEligibleExpected`] = report.automaticEligibleExpected;
}
if (receipt.reviewedApplyV1) {
  receipt.reviewedApplyV1 = {
    ...receipt.reviewedApplyV1,
    status: "PASS",
    activePackCount: activeRuntimePacks.length,
    runtimeRecordCount: allRuntimeRecords.length,
    uniqueUidCount: allUidCount,
    uniqueSourceIdentityCount: allSourceCount,
    archive2DirectJoinCount: combinedDirectJoinCount,
    archive2SourceIdentityRepairJoinCount: combinedSourceIdentityRepairJoinCount,
    archive2JoinMismatchCount: combinedJoinMismatchCount,
    packCounts: activeRuntimePacks.map((pack) => ({
      packId: pack.packId,
      records: pack.records.length,
      runtimeFile: pack.runtimeFile,
      runtimeSha256: pack.runtimeSha256,
    })),
  };
}
receipt.checked.currentCanonicalSourceReadinessV1 = {
  schemaVersion: "ARCHIVE2_META_FOUNDATION_SOURCE_READINESS_V1",
  catalogIndexVersion: catalog.indexVersion,
  combinedRuntimeRecords: allRuntimeRecords.length,
  combinedUniqueUid: allUidCount,
  combinedUniqueSourceIdentity: allSourceCount,
  packs: packReports,
};
outputFiles.set(
  path.relative(repoRoot, receiptPath).replace(/\\/g, "/"),
  writeJson(receiptPath, receipt),
);

const changedFiles = [...outputFiles.entries()].filter(([relative, text]) => {
  const file = path.join(repoRoot, ...relative.split("/"));
  return !fs.existsSync(file) || normalizeText(fs.readFileSync(file, "utf8")) !== text;
});
if (mode === "--check" && changedFiles.length)
  throw new Error(`Runtime source-readiness outputs stale: ${changedFiles.map(([relative]) => relative).join(", ")}`);
if (mode === "--write") {
  for (const [relative, text] of outputFiles) {
    const file = path.join(repoRoot, ...relative.split("/"));
    if (normalizeText(fs.readFileSync(file, "utf8")) === text) continue;
    fs.writeFileSync(file, text, "utf8");
  }
}

console.log(JSON.stringify({
  status: "PASS",
  mode,
  catalogIndexVersion: catalog.indexVersion,
  runtimeRecordCount: allRuntimeRecords.length,
  uniqueUidCount: allUidCount,
  uniqueSourceIdentityCount: allSourceCount,
  combinedCatalogDirectJoinCount: combinedDirectJoinCount,
  combinedCatalogSourceIdentityRepairJoinCount: combinedSourceIdentityRepairJoinCount,
  combinedCatalogJoinMismatchCount: combinedJoinMismatchCount,
  changedFiles: changedFiles.map(([relative]) => relative),
  packs: Object.fromEntries(Object.entries(packReports).map(([id, row]) => [id, {
    runtimeRecords: row.runtimeRecords,
    directUidJoinCount: row.directUidJoinCount,
    sourceIdentityRepairJoinCount: row.sourceIdentityRepairJoinCount,
    currentCatalogUidDirectJoinCount: row.currentCatalogUidDirectJoinCount,
    currentCatalogSourceIdentityRepairJoinCount: row.currentCatalogSourceIdentityRepairJoinCount,
    currentCatalogJoinMismatchCount: row.currentCatalogJoinMismatchCount,
    currentCatalogSourceHoldDirectCount: row.currentCatalogSourceHoldDirectCount,
    sourceReadyCount: row.sourceReadyCount,
    sourceHoldCount: row.sourceHoldCount,
    supplementaryCount: row.supplementaryCount,
    automaticEligibleExpected: row.automaticEligibleExpected,
  }])),
}, null, 2));
