"use strict";
// Archive 2.0 catalog, split in two files.
//
//   archive/data/archive2-catalog.json           what the teacher screens and the Worker download and read.
//   archive/data/archive2-catalog-evidence.json  the review/evidence values that were taken out of it. Nothing
//                                                downloads this file; registration tools that need the full
//                                                values read both through readCatalog() below.
//
// Why: 66% of the catalog was review/evidence columns that no screen and no Worker code reads (11-20 measure),
// so every teacher paid for them on every entry. The slimming is a transport change only: the full records
// (indexVersion is still their hash) are rebuilt exactly by mergeEvidence().
//
// What is taken out, and why it is safe (verified again by the builder on every run: resolveCatalog over the
// slim and over the full catalog must agree; see assertResolveEquivalence in build-archive2-catalog.mjs):
//   approvedSourceFingerprint   registrar bookkeeping; no screen, no Worker, not read by resolveCatalog.
//   metadataAssignmentEvidence  resolveCatalog reads it only for a question named by a registration receipt or a
//                               review override (those keep the full value). Everything else keeps what the
//                               screens read: rpmMetadata, the pending field statuses, metadataRevision and
//                               sourceFingerprint when they differ from the record's own.
//   metaProjection              the screens read the projected values, evidenceByField[].status and from
//                               sourceBinding only bindingMode and catalogSourceJsSha256; parentBinding and the
//                               rest of sourceBinding (proof file paths, hashes) are taken out.
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const SCHEMA = "archive2-catalog-evidence-v1";
const EVIDENCE_PATH = "data/archive2-catalog-evidence.json";
const CATALOG_PATH = "data/archive2-catalog.json";
// Columns that are moved whole (the screens never read them) and columns whose values are trimmed.
const WHOLE_COLUMNS = Object.freeze(["approvedSourceFingerprint"]);
const TRIMMED_COLUMNS = Object.freeze(["metadataAssignmentEvidence", "metaProjection"]);
const EVIDENCE_COLUMNS = Object.freeze([...WHOLE_COLUMNS, ...TRIMMED_COLUMNS].sort());
// What a teacher screen reads from metaProjection.sourceBinding (problem-bank-meta.js project()).
const PROJECTION_SOURCE_BINDING_KEEP = Object.freeze(["bindingMode", "catalogSourceJsSha256"]);

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");
const normalizeText = (text) => text.replace(/^﻿/, "").replace(/\r\n/g, "\n");

function trimMetadataEvidence(value, record) {
  if (!isObject(value)) return value;
  const out = {};
  // Screens read `meta.metadataRevision || record.metadataRevision` and compare meta.sourceFingerprint with the
  // record's own; a value equal to the record's is the same answer as no value.
  if (value.metadataRevision && value.metadataRevision !== record.metadataRevision) out.metadataRevision = value.metadataRevision;
  if (value.sourceFingerprint && value.sourceFingerprint !== record.sourceFingerprint) out.sourceFingerprint = value.sourceFingerprint;
  if (isObject(value.fieldStatus)) {
    const pending = Object.fromEntries(Object.entries(value.fieldStatus).filter(([, status]) => status === "manual_review_pending"));
    if (Object.keys(pending).length) out.fieldStatus = pending;
  }
  if (value.rpmMetadata !== undefined) out.rpmMetadata = value.rpmMetadata;
  return out;
}

function trimMetaProjection(value) {
  if (!isObject(value)) return value;
  const out = {};
  for (const [key, inner] of Object.entries(value)) {
    if (key === "parentBinding") continue;
    if (key === "sourceBinding" && isObject(inner)) {
      out.sourceBinding = Object.fromEntries(PROJECTION_SOURCE_BINDING_KEEP.filter((name) => inner[name] !== undefined).map((name) => [name, inner[name]]));
      continue;
    }
    out[key] = inner;
  }
  return out;
}

// records: full catalog records (before column packing). fullEvidenceUids: questions whose
// metadataAssignmentEvidence stays whole because resolveCatalog reads it (receipt / review override rows).
// Returns { records: slim records, evidence: the removed values, column by column aligned with records }.
function slimRecords(records, { fullEvidenceUids = new Set() } = {}) {
  const columns = Object.fromEntries(EVIDENCE_COLUMNS.map((column) => [column, new Array(records.length).fill(null)]));
  const slim = records.map((record, index) => {
    const next = { ...record };
    for (const column of WHOLE_COLUMNS) {
      if (record[column] === undefined) continue;
      columns[column][index] = record[column];
      delete next[column];
    }
    if (record.metadataAssignmentEvidence !== undefined && !fullEvidenceUids.has(record.questionUid)) {
      const trimmed = trimMetadataEvidence(record.metadataAssignmentEvidence, record);
      if (JSON.stringify(trimmed) !== JSON.stringify(record.metadataAssignmentEvidence)) {
        columns.metadataAssignmentEvidence[index] = record.metadataAssignmentEvidence;
        next.metadataAssignmentEvidence = trimmed;
      }
    }
    if (record.metaProjection !== undefined) {
      const trimmed = trimMetaProjection(record.metaProjection);
      if (JSON.stringify(trimmed) !== JSON.stringify(record.metaProjection)) {
        columns.metaProjection[index] = record.metaProjection;
        next.metaProjection = trimmed;
      }
    }
    return next;
  });
  return { records: slim, evidence: { schemaVersion: SCHEMA, recordCount: records.length, columns } };
}

// Apply the same trimming to an already resolved record (used by the builder's equivalence check).
function trimResolvedRecord(record, { fullEvidenceUids = new Set() } = {}) {
  const next = { ...record };
  for (const column of WHOLE_COLUMNS) delete next[column];
  if (next.metadataAssignmentEvidence !== undefined && !fullEvidenceUids.has(record.questionUid))
    next.metadataAssignmentEvidence = trimMetadataEvidence(next.metadataAssignmentEvidence, record);
  if (next.metaProjection !== undefined) next.metaProjection = trimMetaProjection(next.metaProjection);
  return next;
}

function evidenceTextOf(evidence, catalogIndexVersion) {
  return JSON.stringify({ ...evidence, catalogIndexVersion }) + "\n";
}

// The marker the slim catalog carries so a reader knows which evidence file completes it.
function markerOf(evidenceText) {
  return { schemaVersion: SCHEMA, path: EVIDENCE_PATH, sha256: sha256(evidenceText), columns: [...EVIDENCE_COLUMNS] };
}

// decoded: records already decoded from the column-dictionary form (core.decodeCatalog). readText(relativePath)
// returns the evidence file text under archive/. A catalog without the marker is already whole.
function mergeEvidence(decoded, readText) {
  const marker = decoded?.catalogEvidence;
  if (!marker) return decoded;
  if (marker.schemaVersion !== SCHEMA || marker.path !== EVIDENCE_PATH) throw new Error("CATALOG_EVIDENCE_MARKER_INVALID");
  let text;
  try { text = normalizeText(readText(marker.path)); }
  catch (error) { throw new Error("CATALOG_EVIDENCE_FILE_UNAVAILABLE: " + marker.path + " (" + (error?.message || error) + ")"); }
  if (sha256(text) !== marker.sha256) throw new Error("CATALOG_EVIDENCE_SHA256_MISMATCH: " + marker.path + " does not belong to this catalog");
  const evidence = JSON.parse(text);
  if (evidence.schemaVersion !== SCHEMA || evidence.catalogIndexVersion !== decoded.indexVersion ||
      evidence.recordCount !== decoded.records.length)
    throw new Error("CATALOG_EVIDENCE_DOES_NOT_MATCH_CATALOG");
  const { catalogEvidence, ...rest } = decoded;
  const records = decoded.records.map((record, index) => {
    let next = record;
    for (const column of marker.columns) {
      const value = evidence.columns?.[column]?.[index];
      if (value === null || value === undefined) continue;
      if (next === record) next = { ...record };
      next[column] = value;
    }
    return next;
  });
  return { ...rest, records };
}

// A catalog resource (as loaded from the input bundle) completed with its evidence, shaped for resolveCatalog: the records are
// plain objects, so the packing keys are dropped (resolveCatalog would otherwise decode them a second time).
function completeCatalogResource(resource, readText) {
  const core = require("../archive2-core.js");
  const { encoding, columns, strings, ...complete } = mergeEvidence(core.decodeCatalog(resource), readText);
  return complete;
}

// The one reader for tools and tests that need the complete catalog records.
//   readCatalog({ root })  -> decoded catalog (records decoded, evidence merged back in)
function readCatalog({ root = path.resolve(__dirname, "../.."), decode = true } = {}) {
  const archiveDir = path.join(root, "archive");
  const core = require("../archive2-core.js");
  const data = JSON.parse(normalizeText(fs.readFileSync(path.join(archiveDir, CATALOG_PATH), "utf8")));
  const decoded = decode ? core.decodeCatalog(data) : data;
  return mergeEvidence(decoded, (relativePath) => fs.readFileSync(path.join(archiveDir, relativePath), "utf8"));
}

module.exports = {
  SCHEMA, EVIDENCE_PATH, CATALOG_PATH, EVIDENCE_COLUMNS, WHOLE_COLUMNS, TRIMMED_COLUMNS, PROJECTION_SOURCE_BINDING_KEEP,
  trimMetadataEvidence, trimMetaProjection, slimRecords, trimResolvedRecord, evidenceTextOf, markerOf, mergeEvidence, completeCatalogResource, readCatalog,
};
