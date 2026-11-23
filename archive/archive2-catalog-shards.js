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
    // The whole catalog lists its exams in one order and each exam's questions together by number; examShard's keys are in that order.
    // Shards hold exams in that relative order, but a catalog made of several shards would interleave them by shard: put it back, so a
    // list built from some shards is in the same order as the list built from all of them (ties between questions of one year follow it).
    const position = new Map(Object.keys(index.examShard || {}).map((file, i) => [file, i]));
    const rank = (file) => (position.has(file) ? position.get(file) : 1e9);
    if (docs.length > 1) {
      records.sort((a, b) => rank(a.sourceFile) - rank(b.sourceFile));
      exams.sort((a, b) => rank(a.file) - rank(b.file));
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
      // true when every shard of the release is in: a screen that needs the whole list can tell a partial catalog from a complete one
      complete: docs.length === (index.shards || []).length,
    };
  }

  // ---- the loader (stage 2-2): fetch, verify, assemble ---------------------------------------------------------------------
  // `createLoader({ base, fetch })` -> { loadIndex, courses, shardKeysOfCourse, shardKeyOfExam, loadShard, loadShards, loadCommon, loadCatalog }.
  //
  // What it promises a screen:
  //  - Every shard and the common file is checked against the sha256 and byte length in index.json (the index of the same release). The
  //    check is on the raw bytes, before they are parsed. The index is the root: it is fetched with revalidation and carries the
  //    projection version string (`indexVersion`) the screens send to the server as index_version.
  //  - A file that fails (hash, length, 404, broken JSON, network) is retried ONCE after fetching the index again, because the usual cause is
  //    a release that went out between the index and the file. If the index names another version everything held is dropped and reloaded.
  //    A second failure is an error with `retryable: true` and a teacher-readable message. The loader never falls back to the whole bundle
  //    by itself, and never returns a catalog made of files of two releases.
  //  - A shard already received in this document is not received again. URLs carry `?v=<first 16 of sha256>`, so the browser cache keeps
  //    them across visits and a changed file is a new URL.
  //  - When there are no shards at all (the build skipped them, a local checkout) `loadIndex` throws code CATALOG_SHARDS_UNAVAILABLE; the
  //    screen decides to use the whole bundle (see isUnavailable).
  const INDEX_SCHEMA = "archive2-catalog-shards-v1";
  const STALE_MESSAGE = "자료가 갱신되는 중입니다. 잠시 뒤 다시 시도해 주세요.";
  const NETWORK_MESSAGE = "문항 목록을 받지 못했습니다. 연결을 확인하고 다시 시도해 주세요.";
  const UNAVAILABLE_MESSAGE = "문항 조각 자료를 사용할 수 없습니다.";
  // a failure that came from the connection (no response, HTTP error), as opposed to bytes that arrived but do not match the index
  const isNetworkFailure = (error) => {
    for (let hop = 0, current = error; current && hop < 6; hop += 1, current = current.cause)
      if (current.network === true || current.code === "CATALOG_SHARD_NETWORK") return true;
    return false;
  };
  // every error this loader throws about files it could not get right (the screen may give up the shard path for these)
  const isShardFailure = (error) => Boolean(error) && typeof error.code === "string" && /^CATALOG_SHARD/.test(error.code);
  const failure = (code, message, retryable, cause) => Object.assign(new Error(message), { code, retryable: Boolean(retryable), ...(cause ? { cause } : {}) });
  const isUnavailable = (error) => Boolean(error) && error.code === "CATALOG_SHARDS_UNAVAILABLE";
  const hex = (buffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
  async function sha256Of(bytes) {
    const subtle = globalThis.crypto && globalThis.crypto.subtle;
    if (!subtle) throw failure("CATALOG_SHARD_STALE", "SHA-256 is not available", false);
    return hex(await subtle.digest("SHA-256", bytes));
  }
  const withSlash = (value) => (String(value).endsWith("/") ? String(value) : String(value) + "/");

  function createLoader(options = {}) {
    const doFetch = options.fetch || ((url, init) => globalThis.fetch(url, init));
    const base = withSlash(options.base || "data/archive2-catalog-shards-v1/");
    const digest = options.sha256 || sha256Of;
    const decoder = new TextDecoder("utf-8");
    let index = null; // the index of the release this document is working with
    let indexRequest = null;
    let generation = 0; // changes when the index names another release: everything received before is dropped
    const memo = new Map(); // `${generation}|${file path}` -> Promise of the parsed file
    const wanted = new Set(); // shard keys asked for so far (a screen adds courses one after another)

    async function getBytes(url, cache) {
      let response;
      try { response = await doFetch(url, { cache }); }
      catch (error) { throw Object.assign(failure("CATALOG_SHARD_FETCH_FAILED", "network error: " + url, true, error), { network: true }); }
      if (!response || !response.ok) throw Object.assign(failure("CATALOG_SHARD_FETCH_FAILED", "HTTP " + (response && response.status) + ": " + url, true), { network: true });
      return new Uint8Array(await response.arrayBuffer());
    }
    function parseIndex(bytes) {
      let doc;
      try { doc = JSON.parse(decoder.decode(bytes)); } catch (error) { throw failure("CATALOG_SHARDS_UNAVAILABLE", UNAVAILABLE_MESSAGE, false, error); }
      if (!doc || doc.schemaVersion !== INDEX_SCHEMA || !Array.isArray(doc.shards) || !Array.isArray(doc.courses) || !doc.common || !doc.examShard
          || !/^archive2-canonical-v1:[a-f0-9]{64}$/.test(String(doc.indexVersion)))
        throw failure("CATALOG_SHARDS_UNAVAILABLE", UNAVAILABLE_MESSAGE, false);
      return doc;
    }
    // fresh: true asks the network, not the cache (after a failure; the first read revalidates).
    function fetchIndex(fresh) {
      const request = (async () => {
        let bytes;
        try { bytes = await getBytes(base + "index.json", fresh ? "reload" : "no-cache"); }
        catch (error) { throw failure("CATALOG_SHARDS_UNAVAILABLE", UNAVAILABLE_MESSAGE, false, error); }
        const next = parseIndex(bytes);
        if (index && next.indexVersion !== index.indexVersion) generation += 1;
        index = next;
        return index;
      })();
      return request;
    }
    // Files that fail together share one fresh index request.
    let freshRequest = null;
    function refreshIndex() {
      if (!freshRequest) freshRequest = fetchIndex(true).finally(() => { freshRequest = null; });
      return freshRequest;
    }
    function loadIndex() {
      if (index) return Promise.resolve(index);
      if (!indexRequest) indexRequest = fetchIndex(false).catch((error) => { indexRequest = null; throw error; });
      return indexRequest;
    }
    function needIndex() {
      if (!index) throw failure("CATALOG_SHARDS_UNAVAILABLE", "the shard index is not loaded yet (await loadIndex() first)", false);
      return index;
    }
    function courses() { return needIndex().courses.map((course) => ({ ...course, shards: [...course.shards] })); }
    function shardKeysOfCourse(courseKey) {
      const course = needIndex().courses.find((row) => row.key === courseKey);
      if (!course) throw failure("CATALOG_SHARD_UNKNOWN", "unknown course: " + courseKey, false);
      return [...course.shards];
    }
    // The shard the questions of an exam are in. Looked up in the index (never derived from the subject name: the five 중2 exams whose
    // registered course says 중1 are in the m2 shard).
    function shardKeyOfExam(file) { return needIndex().examShard[file] || null; }

    // One verified file. `entryOf(index)` finds the file's entry in an index; the retry asks it again after a fresh index.
    async function verified(entryOf, cacheMode) {
      const entry = entryOf(index);
      if (!entry) throw failure("CATALOG_SHARD_UNKNOWN", "the index does not list this file", false);
      const url = base + entry.path + "?v=" + String(entry.sha256).slice(0, 16);
      const bytes = await getBytes(url, cacheMode);
      if (bytes.length !== entry.bytes || (await digest(bytes)) !== entry.sha256)
        throw failure("CATALOG_SHARD_FETCH_FAILED", "digest mismatch: " + entry.path, true);
      try { return JSON.parse(decoder.decode(bytes)); }
      catch (error) { throw failure("CATALOG_SHARD_FETCH_FAILED", "unreadable JSON: " + entry.path, true, error); }
    }
    async function loadVerified(entryOf) {
      await loadIndex();
      try { return await verified(entryOf, "default"); }
      catch {
        try {
          await refreshIndex();
          return await verified(entryOf, "reload");
        } catch (second) {
          // the connection failed (no answer, HTTP error): say so. Otherwise the file is gone from the new index or its bytes do not match:
          // the release is moving, and the teacher is asked to try again shortly.
          if (isNetworkFailure(second)) throw failure("CATALOG_SHARD_NETWORK", NETWORK_MESSAGE, true, second);
          throw failure("CATALOG_SHARD_STALE", STALE_MESSAGE, true, second);
        }
      }
    }
    function memoized(path, entryOf) {
      const id = generation + "|" + path;
      if (!memo.has(id)) {
        const request = loadVerified(entryOf).catch((error) => { if (memo.get(id) === request) memo.delete(id); throw error; });
        memo.set(id, request);
      }
      return memo.get(id);
    }
    function loadShard(key) {
      return loadIndex().then(() => {
        if (!index.shards.some((shard) => shard.key === key)) throw failure("CATALOG_SHARD_UNKNOWN", "unknown shard: " + key, false);
        return memoized("shard:" + key, (current) => current.shards.find((shard) => shard.key === key));
      });
    }
    function loadShards(keys) { return Promise.all([...new Set(keys)].map(loadShard)); }
    function loadCommon() { return loadIndex().then(() => memoized("common", (current) => current.common)); }

    // The shard keys a need names, from the index alone: { all, grades: [browse grades], courses: [course keys], shards: [keys], exams: [exam files] }.
    // A grade names every shard that has a question browsable under that grade (the index lists them per shard), so no screen has a rule of its
    // own. An exam that is not in the index is returned in `unknownExams` (the caller decides; loadCatalog refuses it).
    function keysFor(need = {}) {
      const current = needIndex();
      const keys = new Set();
      if (need.all) for (const shard of current.shards) keys.add(shard.key);
      for (const grade of need.grades || []) for (const shard of current.shards) if ((shard.browseGrades || []).includes(grade)) keys.add(shard.key);
      for (const course of need.courses || []) for (const key of shardKeysOfCourse(course)) keys.add(key);
      for (const key of need.shards || []) keys.add(key);
      const unknownExams = [];
      for (const file of need.exams || []) { const key = shardKeyOfExam(file); if (key) keys.add(key); else unknownExams.push(file); }
      return { keys: [...keys], unknownExams };
    }
    // The state.catalog for everything asked for so far plus `want` (same fields as keysFor).
    // Calling it again with more adds to the same set (고1, then 고2).
    // options.onProgress({ done, total }): called when the files of this call are asked for (done 0) and each time one arrives, for a screen
    // that shows "n/N" while it waits (total = the shards held after this call).
    async function loadCatalog(want = {}, options = {}) {
      await loadIndex();
      const asked = keysFor(want);
      if (asked.unknownExams.length) throw failure("CATALOG_SHARD_UNKNOWN", "no shard for exam: " + asked.unknownExams[0], false);
      for (const key of asked.keys) wanted.add(key);
      const progress = typeof options.onProgress === "function" ? options.onProgress : null;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        const at = generation;
        const keys = [...wanted];
        let done = 0;
        if (progress) progress({ done, total: keys.length });
        const [common, docs] = await Promise.all([loadCommon(), Promise.all(keys.map((key) => loadShard(key).then((doc) => {
          done += 1;
          if (progress) progress({ done, total: keys.length });
          return doc;
        })))]);
        // a release change during the load: what was received is of two releases, so load it again from the current index
        if (at !== generation || !keys.every((key) => index.shards.some((shard) => shard.key === key))) continue;
        return assembleCatalog(index, common, docs);
      }
      throw failure("CATALOG_SHARD_STALE", STALE_MESSAGE, true);
    }
    return {
      loadIndex, hasIndex: () => index !== null, courses, shardKeysOfCourse, shardKeyOfExam, keysFor, loadShard, loadShards, loadCommon, loadCatalog,
      // for tests and the screen's status line: what is held now
      held: () => ({ indexVersion: index && index.indexVersion, shards: [...wanted], generation }),
    };
  }

  // The address says ?shards=0 (or off / false): this document uses the whole bundle, as before stage 2. The default (no parameter) is shards.
  const shardsDisabled = (search) => /[?&]shards=(?:0|off|false)(?:[&#]|$)/.test(String(search || ""));

  return {
    SHARD_SCHEMA, COMMON_SCHEMA, AUTHORITY_SCHEMA, INDEX_SCHEMA, STALE_MESSAGE, NETWORK_MESSAGE, UNAVAILABLE_MESSAGE,
    identityOfRecord, assembleAuthority, assembleCatalog, createLoader, isUnavailable, isShardFailure, isNetworkFailure, shardsDisabled,
  };
});
