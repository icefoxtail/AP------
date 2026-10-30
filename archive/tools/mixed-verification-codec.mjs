// Mixed source verification resources (archive/data/archive2-source-verification/mixed-v1/, CI-generated, not in Git).
//
// Two layouts carry the same rows:
//   v1  every row is a self-contained object (readable by every deployed archive2-canonical.js, including the
//       Worker that was deployed by hand before the compact layout existed);
//   v2  per-resource string dictionary + shapes + positional rows (about 64 MB smaller). archive2-canonical.js decodes it
//       back to the exact v1 row objects (core.Canonical.decodeMixedRows).
//
// WHICH LAYOUT IS EMITTED is decided only by archive/tools/archive2-mixed-verification-policy.json ("emitSchema").
// The default is "v1" because an already-deployed Worker (apmath/worker-backup imports archive2-canonical.js and reads
// these files from the published site) cannot read v2 and would answer 503 for mixed worksheet validation.
// Flip to "v2" only AFTER the Worker was redeployed from a main that contains the v2 reader.
// Every encoded resource is decoded again by the builder and must equal the rows it came from, otherwise the build fails.
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import core from "../archive2-core.js";

export const MIXED_POLICY_PATH = "archive/tools/archive2-mixed-verification-policy.json";
export const MIXED_SCHEMAS = Object.freeze(["v1", "v2"]);

export function readMixedEmitSchema(root) {
  let policy;
  try { policy = JSON.parse(fs.readFileSync(path.join(root, MIXED_POLICY_PATH), "utf8")); }
  catch (error) { throw new Error(`Mixed verification policy is unreadable (${MIXED_POLICY_PATH}): ${error.message}`); }
  if (!policy || policy.schemaVersion !== "ARCHIVE2_MIXED_VERIFICATION_POLICY_V1" || !MIXED_SCHEMAS.includes(policy.emitSchema))
    throw new Error(`Mixed verification policy ${MIXED_POLICY_PATH} must declare emitSchema "v1" or "v2"`);
  return policy.emitSchema;
}

// The previous layout stored JSON.stringify(rows); keep its semantics (undefined fields are absent).
const plainRows = (rows) => JSON.parse(JSON.stringify(rows));

export const encodeMixedRows = (sourceRows, { kind, fileIndexByName }) => {
  const rows = plainRows(sourceRows);
  const idKeys = new Set(["sourceFile", "sourceOrdinal", "questionUid"]);
  const shapes = [], shapeIndexByKey = new Map(), prepared = [], counts = new Map();
  const count = (value) => {
    if (typeof value === "string") counts.set(value, (counts.get(value) || 0) + 1);
    else if (Array.isArray(value)) value.forEach(count);
    else if (value && typeof value === "object") Object.values(value).forEach(count);
  };
  for (const row of rows) {
    const keys = Object.keys(row.record).filter((key) => !idKeys.has(key));
    const shapeKey = JSON.stringify(keys);
    if (!shapeIndexByKey.has(shapeKey)) { shapeIndexByKey.set(shapeKey, shapes.length); shapes.push(keys); }
    const values = keys.map((key) => row.record[key]);
    prepared.push({ row, shape: shapeIndexByKey.get(shapeKey), values });
    count(values); count(row.assignments); count(row.advancedAssignments); count(row.registeredGrade);
  }
  const dict = [...counts.entries()]
    .filter(([value, n]) => n >= 2 && value.length >= 3)
    .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
    .map(([value]) => value);
  const dictIndex = new Map(dict.map((value, index) => [value, index]));
  const str = (value) => {
    if (typeof value === "string") {
      if (dictIndex.has(value)) return "~" + dictIndex.get(value).toString(36);
      return value.charCodeAt(0) === 126 ? "~" + value : value;
    }
    if (Array.isArray(value)) return value.map(str);
    if (value && typeof value === "object")
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, str(entry)]));
    return value;
  };
  const encoded = prepared.map(({ row, shape, values }) => {
    const out = [row.questionUid];
    if (kind === "bucket") {
      if (!fileIndexByName.has(row.sourceFile)) throw new Error(`Mixed compact rows reference an unindexed source: ${row.sourceFile}`);
      out.push(fileIndexByName.get(row.sourceFile));
    }
    out.push(row.sourceOrdinal, str(row.registeredGrade), shape, str(values), str(row.assignments), str(row.advancedAssignments));
    const extra = {};
    const id = row.identity;
    const standardIdentity = id && typeof id === "object" && !Array.isArray(id) &&
      Object.keys(id).sort().join(",") === "questionUid,sourceArchiveFile,sourceOrdinal,status" &&
      id.questionUid === row.questionUid && id.sourceArchiveFile === row.sourceFile &&
      id.sourceOrdinal === row.sourceOrdinal && id.status === "VERIFIED";
    if (!standardIdentity) extra.identity = id;
    const recordIds = Object.fromEntries([...idKeys].filter((key) => Object.hasOwn(row.record, key)).map((key) => [key, row.record[key]]));
    const standardIds = Object.keys(recordIds).length === 3 && recordIds.sourceFile === row.sourceFile &&
      recordIds.sourceOrdinal === row.sourceOrdinal && recordIds.questionUid === row.questionUid;
    if (!standardIds) extra.recordIds = recordIds;
    if (Object.keys(extra).length) out.push(extra);
    return out;
  });
  return { dict, shapes, rows: encoded };
};
export const assertMixedRoundTrip = (resource, original, options, label) => {
  const decoded = core.Canonical.decodeMixedRows(resource, options);
  if (!isDeepStrictEqual(decoded, plainRows(original)))
    throw new Error(`Compact mixed verification rows do not round-trip: ${label}`);
};

// Per-source shard. v1 keeps the rows as "records"; v2 stores the compact table.
export function buildMixedSourceShard({ schema, sourceFile, sourceSha256, qCount, rows }) {
  if (!MIXED_SCHEMAS.includes(schema)) throw new Error(`Unsupported mixed verification schema: ${schema}`);
  const shard = {
    schemaVersion: `archive2-mixed-source-verification-${schema}`,
    sourceFile,
    sourceSha256,
    qCount,
    ...(schema === "v2" ? encodeMixedRows(rows, { kind: "source" }) : { records: rows }),
  };
  if (schema === "v2") assertMixedRoundTrip(shard, rows, { kind: "source", sourceFile }, sourceFile);
  return shard;
}

// UID bucket (prefix "f" also carries the shared context inline).
export function buildMixedUidBucket({ schema, prefix, context, rows, sourceFiles }) {
  if (!MIXED_SCHEMAS.includes(schema)) throw new Error(`Unsupported mixed verification schema: ${schema}`);
  const fileIndexByName = new Map(sourceFiles.map((file, index) => [file, index]));
  const bucket = {
    schemaVersion: `archive2-mixed-source-verification-uid-bucket-${schema}`,
    prefix,
    ...(prefix === "f" ? { context } : {}),
    ...(schema === "v2" ? encodeMixedRows(rows, { kind: "bucket", fileIndexByName }) : { records: rows }),
  };
  if (schema === "v2") assertMixedRoundTrip(bucket, rows, { kind: "bucket", files: sourceFiles }, `uid bucket ${prefix}`);
  return bucket;
}

export const mixedIndexSchemaVersion = (schema) => `archive2-mixed-source-verification-index-${schema}`;
