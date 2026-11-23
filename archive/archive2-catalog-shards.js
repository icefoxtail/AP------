// Archive 2.0 catalog shards: turn shard files back into the object the screens call `state.catalog`.
//
// The release build cuts the resolved question catalog into shards (tools/lib/build-archive2-catalog-shards.mjs): middle school by
// grade, high school by subject, plus one `common.json`. This file is the ONE place that puts them back together. It has no network
// code in it, so the build tests and the browser run the same assembly: a shard file's `records` and `authority` part, and the
// common tables, become `{ records, exams, sourceHashes, canonicalAuthority, ...catalog-level lists }`.
//
// The authority is what decides whether a record may be used (Archive2Core.basicEligibility / advancedEligible, which read
// canonicalAuthority through Archive2Canonical.validateBasicAssignment / validateAdvancedAssignment). The assembled authority gives the
// same answer for every record of the shards that were assembled as the authority of the whole bundle; a record of a shard that was
// NOT assembled is not silently accepted: `authority.shardCoverage.has(uid)` is false and the validators reject it (no identity, no
// assignment). tests/archive2-catalog-shards-authority.test.js proves both on the real inputs.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.Archive2CatalogShards = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const SHARD_SCHEMA = "archive2-catalog-shard-v2";
  const COMMON_SCHEMA = "archive2-catalog-common-v1";
  const AUTHORITY_SCHEMA = "archive2-catalog-shard-authority-v1";
  const text = (value) => String(value ?? "").trim();

  // validateBasicAssignment compares identityByUid[uid] with the record's own uid, file, ordinal and status, so the identity table is
  // not shipped: it is the record itself. (The build lists in `authority.identityOverrides` any uid whose real entry differs.)
  const identityOfRecord = (record) => ({
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceFile,
    sourceOrdinal: Number(record.sourceOrdinal),
    status: record.identityStatus,
  });

  function checkShardDoc(doc, label) {
    if (!doc || doc.schemaVersion !== SHARD_SCHEMA || !Array.isArray(doc.records))
      throw Object.assign(new Error("catalog shard has an unexpected shape: " + label), { code: "CATALOG_SHARD_INVALID" });
    const part = doc.authority;
    if (!part || part.schemaVersion !== AUTHORITY_SCHEMA || !Array.isArray(part.exams) || !part.assignments || !Array.isArray(part.advancedSame))
      throw Object.assign(new Error("catalog shard has no authority part: " + label), { code: "CATALOG_SHARD_INVALID" });
  }
  function checkCommon(common) {
    if (!common || common.schemaVersion !== COMMON_SCHEMA || !common.authority || !common.catalog)
      throw Object.assign(new Error("catalog common tables have an unexpected shape"), { code: "CATALOG_SHARD_INVALID" });
  }

  // shardDocs: parsed shard files, in the order the records should appear.
  function assembleAuthority(common, shardDocs) {
    checkCommon(common);
    const table = common.authority;
    const authority = {
      taxonomyVersion: table.taxonomyVersion,
      examGradeByFile: {},
      identityByUid: {},
      gradeCourses: table.gradeCourses,
      canonicalParents: table.canonicalParents,
      canonicalAdvancedPaths: table.canonicalAdvancedPaths,
      projectionPolicy: table.projectionPolicy,
      assignmentsByUid: {},
      advancedAssignmentsByUid: {},
      problemTypeKeys: new Set(table.problemTypeKeys),
      templatesByKey: table.templatesByKey,
      bindingKeys: new Set(table.bindingKeys),
    };
    const covered = new Set();
    const shardKeys = [];
    for (const doc of shardDocs) {
      checkShardDoc(doc, doc && doc.key);
      shardKeys.push(doc.key);
      const part = doc.authority;
      for (const exam of part.exams) authority.examGradeByFile[exam.file] = text(exam.grade || exam.sourceGrade);
      for (const record of doc.records) {
        const uid = record.questionUid;
        if (!uid) continue;
        covered.add(uid);
        authority.identityByUid[uid] = part.identityOverrides && part.identityOverrides[uid] ? part.identityOverrides[uid] : identityOfRecord(record);
      }
      for (const uid of Object.keys(part.assignments)) authority.assignmentsByUid[uid] = part.assignments[uid];
      for (const uid of part.advancedSame) if (part.assignments[uid]) authority.advancedAssignmentsByUid[uid] = part.assignments[uid];
      for (const uid of Object.keys(part.advancedOwn || {})) authority.advancedAssignmentsByUid[uid] = part.advancedOwn[uid];
    }
    // Not part of the authority the validators read: says which questions this authority was built for.
    Object.defineProperty(authority, "shardCoverage", {
      value: Object.freeze({ shards: Object.freeze([...shardKeys]), has: (uid) => covered.has(uid) }),
      enumerable: false,
    });
    return authority;
  }

  // The object a screen keeps as state.catalog, for the shards given. `index` is shards/index.json.
  function assembleCatalog(index, common, shardDocs) {
    checkCommon(common);
    if (common.indexVersion !== index.indexVersion || common.identityDigest !== index.catalogIdentityDigest)
      throw Object.assign(new Error("catalog common tables belong to another release"), { code: "CATALOG_SHARD_STALE" });
    const order = new Map((index.shards || []).map((shard, i) => [shard.key, i]));
    const docs = [...shardDocs].sort((a, b) => (order.get(a.key) ?? 1e9) - (order.get(b.key) ?? 1e9));
    for (const doc of docs) if (doc.indexVersion !== index.indexVersion)
      throw Object.assign(new Error("catalog shard belongs to another release: " + doc.key), { code: "CATALOG_SHARD_STALE" });
    const authority = assembleAuthority(common, docs);
    const records = [];
    const exams = [];
    const sourceHashes = [...(common.catalog.sourceHashes || [])];
    for (const doc of docs) {
      for (const record of doc.records) records.push(record);
      for (const exam of doc.authority.exams) exams.push(exam);
      for (const entry of doc.authority.sourceHashes || []) sourceHashes.push(entry);
    }
    return {
      ...common.catalog,
      indexVersion: index.indexVersion,
      identityDigest: index.catalogIdentityDigest,
      records,
      exams,
      sourceHashes,
      canonicalAuthority: authority,
      shardKeys: docs.map((doc) => doc.key),
    };
  }

  return { SHARD_SCHEMA, COMMON_SCHEMA, AUTHORITY_SCHEMA, identityOfRecord, assembleAuthority, assembleCatalog };
});
