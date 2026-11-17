import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import {
  buildQuestionSnapshot,
  validateApprovedMixedQuestions,
  validateOriginalSnapshot,
} from "../apmath/worker-backup/worker/helpers/archive2-questions.js";

const require = createRequire(import.meta.url);
const core = require("../archive/archive2-core.js");
const canonical = require("../archive/archive2-canonical.js");
const archiveSource = require("../archive/archive2-source.js");
const { catalog } = require("./helpers/archive2-scope-harness.cjs");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archiveDir = path.join(root, "archive");
const manifestRelative = "archive/data/archive2-canonical-input-manifest.json";
const compactManifestRelative = "archive/" + canonical.COMPACT_INPUT_MANIFEST_PATH;
const indexRelative = "archive/data/archive2-source-verification-index.json";
// Original verification reads the sharded file list (top index + one hash-prefix bucket); the flat index above is
// kept for Workers deployed before the sharded layout and for the mixed lookup.
const topRelative = "archive/" + canonical.SOURCE_VERIFICATION_TOP_INDEX_PATH;
const manifestPath = path.join(root, manifestRelative);
const indexPath = path.join(root, indexRelative);
const manifestText = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const compactManifestText = fs.readFileSync(path.join(root, compactManifestRelative), "utf8");
const compactManifest = JSON.parse(compactManifestText);
const indexText = fs.readFileSync(indexPath, "utf8");
const sourceIndex = JSON.parse(indexText);
const sourceFile = "original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js";
const topText = fs.readFileSync(path.join(root, topRelative), "utf8");
const topIndex = JSON.parse(topText);
const bucketRelativeOf = (file) =>
  "archive/" + canonical.SOURCE_VERIFICATION_INDEX_BUCKET_PREFIX + sha256(file).slice(0, 1) + ".json";
const bucketRelative = bucketRelativeOf(sourceFile);
const bucketText = fs.readFileSync(path.join(root, bucketRelative), "utf8");
const sourceBucket = JSON.parse(bucketText);
const sourceEntry = sourceBucket.files.find((row) => row.sourceFile === sourceFile);
assert.ok(sourceEntry, "selected original source must have a verification shard");
assert.deepEqual(sourceEntry, sourceIndex.files.find((row) => row.sourceFile === sourceFile), "bucket row equals the flat index row");
// The shard path is derived from the source file; index rows no longer repeat it (index size).
const shardPathOf = (file) => canonical.SOURCE_VERIFICATION_SHARD_PREFIX + sha256(file) + ".json";
assert.equal(Object.hasOwn(sourceEntry, "path"), false, "index rows omit the derivable shard path");
const shardRelative = "archive/" + shardPathOf(sourceFile);
const shardPath = path.join(root, shardRelative);
const shardText = fs.readFileSync(shardPath, "utf8");
const sourceShard = JSON.parse(shardText);
const sourceExam = catalog.exams.find((row) => core.normalizeFile(row.file) === sourceFile);
const sourceRows = catalog.records
  .filter((row) => row.sourceFile === sourceFile)
  .sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
const sourceQuestions = archiveSource.evaluate(
  fs.readFileSync(path.join(archiveDir, "exams", sourceFile), "utf8"),
  sourceFile,
);
const baseUrl = "https://archive.test/AP------/archive";

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makeInput(indexVersion = manifest.projectionVersion, file = sourceFile) {
  return {
    archive_file: "exams/" + file,
    question_count: file === sourceFile ? sourceQuestions.length : 1,
    index_version: indexVersion,
  };
}

function createAssetEnv({ overrides = new Map(), missing = new Set(), statuses = new Map() } = {}) {
  const requests = [];
  let bytesFetched = 0;
  const fetch = async (input) => {
    const pathname = decodeURIComponent(new URL(String(input)).pathname);
    let relative;
    if (pathname.startsWith("/AP------/archive/"))
      relative = "archive/" + pathname.slice("/AP------/archive/".length);
    else if (pathname.startsWith("/AP------/docs/"))
      relative = "docs/" + pathname.slice("/AP------/docs/".length);
    else {
      requests.push(pathname);
      return new Response("Not found", { status: 404 });
    }
    requests.push(relative);
    if (missing.has(relative))
      return new Response("Not found", { status: 404 });
    if (statuses.has(relative))
      return new Response("Unavailable", { status: statuses.get(relative) });
    let body;
    if (overrides.has(relative)) {
      body = overrides.get(relative);
      if (body === null)
        return new Response("Not found", { status: 404 });
    } else {
      const file = path.resolve(root, relative);
      const fromRoot = path.relative(root, file);
      if (
        fromRoot.startsWith("..") ||
        path.isAbsolute(fromRoot) ||
        !fs.existsSync(file) ||
        !fs.statSync(file).isFile()
      )
        return new Response("Not found", { status: 404 });
      body = fs.readFileSync(file);
    }
    bytesFetched += Buffer.byteLength(body);
    return new Response(body, { status: 200 });
  };
  return {
    env: {
      ARCHIVE_PUBLIC_BASE_URL: baseUrl,
      ARCHIVE2_ASSETS: { fetch },
    },
    requests,
    bytesFetched: () => bytesFetched,
  };
}

function expectedShardRecord(row, normalizedFile) {
  const identity = row.questionUid
    ? catalog.canonicalAuthority.identityByUid[row.questionUid] || null
    : null;
  const result = {
    sourceOrdinal: Number(row.sourceOrdinal),
    sourceQuestionNo: row.sourceQuestionNo ?? "",
    questionUid: row.questionUid || "",
    identityStatus: row.identityStatus || "UNRESOLVED",
    sourceFile: normalizedFile,
    identitySourceFile: identity?.sourceArchiveFile || "",
    identitySourceOrdinal: Number(identity?.sourceOrdinal || 0),
    sourceGrade: row.sourceGrade || "",
    sourceFingerprint: row.sourceFingerprint || "",
    rawQuestionHash: row.rawQuestionHash || "",
  };
  for (const field of [...core.META_FIELDS, "sourceQualityHold"])
    if (Object.prototype.hasOwnProperty.call(row, field))
      result[field] = row[field];
  return JSON.parse(JSON.stringify(result));
}

function expectedShardExam(exam, normalizedFile) {
  return {
    file: normalizedFile,
    qCount: Number(exam.qCount),
    grade: exam.grade || exam.sourceGrade || "",
    identityTitle: exam.identityTitle || "",
  };
}

async function rebasedShardFixture(mutator) {
  const nextManifest = clone(manifest);
  const nextTop = clone(topIndex);
  const nextBucket = clone(sourceBucket);
  const bucketFileRow = nextBucket.files.find((row) => row.sourceFile === sourceFile);
  const nextShard = clone(sourceShard);
  mutator(nextShard);

  const nextShardText = JSON.stringify(nextShard) + "\n";
  bucketFileRow.sha256 = sha256(nextShardText);
  const nextBucketText = JSON.stringify(nextBucket) + "\n";
  const topBucketRow = nextTop.buckets.find((row) => row.prefix === nextBucket.prefix);
  topBucketRow.sha256 = sha256(nextBucketText);
  topBucketRow.byteLength = Buffer.byteLength(nextBucketText);
  const nextTopText = JSON.stringify(nextTop) + "\n";
  const manifestIndexRow = nextManifest.files.find(
    (row) => row.path === canonical.SOURCE_VERIFICATION_TOP_INDEX_PATH,
  );
  assert.ok(manifestIndexRow, "top index digest must be in the outer manifest");
  manifestIndexRow.sha256 = sha256(nextTopText);
  nextManifest.projectionVersion = await canonical.computeProjectionVersion(
    nextManifest.files,
    nextManifest.resolverVersion,
  );
  const nextManifestText = JSON.stringify(nextManifest) + "\n";
  return {
    manifest: nextManifest,
    top: nextTop,
    bucket: nextBucket,
    shard: nextShard,
    input: makeInput(nextManifest.projectionVersion),
    overrides: new Map([
      [manifestRelative, nextManifestText],
      [compactManifestRelative, JSON.stringify(canonical.encodeCompactInputManifest(nextManifest)) + "\n"],
      [topRelative, nextTopText],
      [bucketRelative, nextBucketText],
      [shardRelative, nextShardText],
    ]),
  };
}

const withoutSourceIndexes = (files) => files.filter(
  (row) => row.path !== canonical.SOURCE_VERIFICATION_INDEX_PATH &&
    row.path !== canonical.SOURCE_VERIFICATION_TOP_INDEX_PATH,
);

async function legacyFullSourceNumberFixture() {
  const legacyManifest = clone(manifest);
  legacyManifest.files = withoutSourceIndexes(legacyManifest.files);
  const packedCatalog = JSON.parse(
    fs.readFileSync(path.join(archiveDir, "data/archive2-catalog.json"), "utf8"),
  );
  const sourceFileColumn = packedCatalog.columns.indexOf("sourceFile");
  const sourceOrdinalColumn = packedCatalog.columns.indexOf("sourceOrdinal");
  const sourceQuestionNoColumn = packedCatalog.columns.indexOf("sourceQuestionNo");
  const sourceFingerprintColumn = packedCatalog.columns.indexOf("sourceFingerprint");
  assert.ok(sourceFileColumn >= 0 && sourceOrdinalColumn >= 0);
  assert.ok(sourceQuestionNoColumn >= 0 && sourceFingerprintColumn >= 0);
  const decodeCell = (value) =>
    Array.isArray(value) && value.length === 1 && Number.isInteger(value[0])
      ? packedCatalog.strings[value[0]]
      : value;
  const row = packedCatalog.records.find((candidate) =>
    core.normalizeFile(decodeCell(candidate[sourceFileColumn])) === sourceFile &&
    Number(decodeCell(candidate[sourceOrdinalColumn])) === 1,
  );
  assert.ok(row, "packed catalog must contain the selected first source ordinal");
  row[sourceQuestionNoColumn] = null;
  row[sourceFingerprintColumn] = null;
  const catalogText = JSON.stringify(packedCatalog) + "\n";
  const catalogManifestRow = legacyManifest.files.find(
    (entry) => entry.path === "data/archive2-catalog.json",
  );
  assert.ok(catalogManifestRow);
  catalogManifestRow.sha256 = sha256(catalogText);
  legacyManifest.projectionVersion = await canonical.computeProjectionVersion(
    legacyManifest.files,
    legacyManifest.resolverVersion,
  );
  return {
    input: makeInput(legacyManifest.projectionVersion),
    overrides: new Map([
      [manifestRelative, JSON.stringify(legacyManifest) + "\n"],
      [compactManifestRelative, null],
      ["archive/data/archive2-catalog.json", catalogText],
    ]),
  };
}


test("compact canonical manifest is a deterministic lossless companion without a projection hash cycle", async () => {
  const before = JSON.stringify(manifest);
  const encoded = canonical.encodeCompactInputManifest(manifest);
  assert.equal(JSON.stringify(encoded) + "\n", compactManifestText);
  assert.deepEqual(encoded, canonical.encodeCompactInputManifest(manifest));
  assert.equal(JSON.stringify(manifest), before, "encoding cannot modify the authority manifest");
  const decoded = canonical.decodeCompactInputManifest(compactManifest);
  assert.deepEqual(decoded, manifest, "every header, ordered path and whole hash must survive");
  assert.equal(JSON.stringify(decoded) + "\n", manifestText, "current original bytes round trip exactly");
  assert.equal(await canonical.computeProjectionVersion(decoded.files, decoded.resolverVersion), manifest.projectionVersion);
  assert.equal(manifest.files.some((row) => row.path === canonical.COMPACT_INPUT_MANIFEST_PATH), false);
  assert.ok(Buffer.byteLength(compactManifestText) < Buffer.byteLength(manifestText));
  assert.equal(new Set(compactManifest.directories).size, compactManifest.directories.length);
  assert.ok(manifest.files.some((row) => row.path.startsWith("../docs/")), "the existing authority namespace stays lossless");
});

test("compact manifest rejects malformed tuples, headers, directories, paths and hashes", async (t) => {
  const cases = [
    ["tuple length", (value) => { value.files[0].push("extra"); }],
    ["tuple object", (value) => { value.files[0] = { path: "data/a.json", sha256: "0".repeat(64) }; }],
    ["directory index string", (value) => { value.files[0][0] = "0"; }],
    ["directory index fractional", (value) => { value.files[0][0] = 0.5; }],
    ["directory index negative", (value) => { value.files[0][0] = -1; }],
    ["directory index negative zero", (value) => { value.files[0][0] = -0; }],
    ["directory index out of range", (value) => { value.files[0][0] = value.directories.length; }],
    ["filename slash", (value) => { value.files[0][1] = "other/file.json"; }],
    ["filename backslash", (value) => { value.files[0][1] = "other\\file.json"; }],
    ["filename parent segment", (value) => { value.files[0][1] = ".."; }],
    ["filename dot segment", (value) => { value.files[0][1] = "."; }],
    ["filename empty", (value) => { value.files[0][1] = ""; }],
    ["filename query", (value) => { value.files[0][1] += "?x=1"; }],
    ["filename encoded traversal", (value) => { value.files[0][1] = "%2e%2e"; }],
    ["filename control", (value) => { value.files[0][1] += "\u0000"; }],
    ["file hash format", (value) => { value.files[0][2] = "not-a-sha256"; }],
    ["file hash type", (value) => { value.files[0][2] = 0; }],
    ["duplicate reconstructed path", (value) => { value.files.push([...value.files[0]]); }],
    ["directory duplicate", (value) => { value.directories[1] = value.directories[0]; }],
    ["directory absolute", (value) => { value.directories[0] = "/data/"; }],
    ["directory unsupported traversal", (value) => { value.directories[0] = "../private/"; }],
    ["directory interior traversal", (value) => { value.directories[0] = "data/../"; }],
    ["directory encoded traversal", (value) => { value.directories[0] = "%2e%2e/"; }],
    ["directory missing slash", (value) => { value.directories[0] = "data"; }],
    ["directory unused", (value) => { value.directories.push("data/unused/"); }],
    ["directory noncanonical order", (value) => { value.files[0][0] = 1; }],
    ["extra header", (value) => { value.extra = true; }],
    ["missing header", (value) => { delete value.generatedFromCatalogIndexVersion; }],
    ["catalog version format", (value) => { value.generatedFromCatalogIndexVersion = "invalid"; }],
    ["projection version format", (value) => { value.projectionVersion = "invalid"; }],
  ];
  for (const [name, mutate] of cases) await t.test(name, () => {
    const value = clone(compactManifest);
    mutate(value);
    assert.throws(() => canonical.decodeCompactInputManifest(value),
      (error) => error.code === "CANONICAL_INPUT_DIGEST_MISMATCH");
  });
  for (const field of ["schemaVersion", "manifestSchemaVersion", "resolverVersion"]) await t.test(field, () => {
    const value = clone(compactManifest);
    value[field] = "unsupported";
    assert.throws(() => canonical.decodeCompactInputManifest(value),
      (error) => error.code === "CANONICAL_RESOLVER_VERSION_MISMATCH");
  });
  const extraHeader = { ...manifest, extra: true };
  assert.throws(() => canonical.encodeCompactInputManifest(extraHeader));
  const extraFileField = clone(manifest);
  extraFileField.files[0].extra = true;
  assert.throws(() => canonical.encodeCompactInputManifest(extraFileField), "encoding must not silently drop original fields");
  const cycle = clone(manifest);
  cycle.files.push({ path: canonical.COMPACT_INPUT_MANIFEST_PATH, sha256: "0".repeat(64) });
  assert.throws(() => canonical.encodeCompactInputManifest(cycle), "companion must not create an input hash cycle");
});

test("only an HTTP 404 compact companion uses the unchanged original-manifest source path", async () => {
  const assets = createAssetEnv({ missing: new Set([compactManifestRelative]) });
  const result = await validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput());
  assert.deepEqual(assets.requests, [compactManifestRelative, manifestRelative, topRelative, bucketRelative, shardRelative]);
  assert.equal(result.exam.file, sourceFile);
  assert.equal(result.questions.length, sourceQuestions.length);
  assert.deepEqual(result.questions.map((row) => row.questionUid), sourceRows.map((row) =>
    row.identityStatus === "VERIFIED" ? row.questionUid : null));
});

test("an existing but corrupt or unavailable companion never downgrades to the original manifest", async (t) => {
  const malformed = createAssetEnv({ overrides: new Map([[compactManifestRelative, "{not JSON"]]) });
  await assert.rejects(validateOriginalSnapshot(malformed.env, { questions: sourceQuestions }, makeInput()),
    (error) => error.status === 503);
  assert.deepEqual(malformed.requests, [compactManifestRelative]);
  for (const status of [403, 410, 500, 503]) await t.test("HTTP " + status, async () => {
    const assets = createAssetEnv({ statuses: new Map([[compactManifestRelative, status]]) });
    await assert.rejects(validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503);
    assert.deepEqual(assets.requests, [compactManifestRelative]);
  });
  for (const [name, mutate] of [
    ["invalid tuple does not downgrade", (value) => { value.files[0][0] = "0"; }],
    ["duplicate path does not downgrade", (value) => { value.files.push([...value.files[0]]); }],
    ["unsupported compact schema does not downgrade", (value) => { value.schemaVersion = "unsupported"; }],
  ]) await t.test(name, async () => {
    const value = clone(compactManifest);
    mutate(value);
    const assets = createAssetEnv({ overrides: new Map([[compactManifestRelative, JSON.stringify(value) + "\n"]]) });
    await assert.rejects(validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503);
    assert.deepEqual(assets.requests, [compactManifestRelative]);
  });
  const transportRequests = [];
  const networkFailure = { ...createAssetEnv().env, ARCHIVE2_ASSETS: { fetch: async (url) => {
    transportRequests.push(String(url));
    throw new Error("test transport unavailable");
  } } };
  await assert.rejects(validateOriginalSnapshot(networkFailure, { questions: sourceQuestions }, makeInput()),
    (error) => error.status === 503);
  assert.equal(transportRequests.length, 1);
  assert.ok(transportRequests[0].endsWith("/" + canonical.COMPACT_INPUT_MANIFEST_PATH));
  for (const [name, mutate] of [
    ["tuple hash changes the existing projection digest", (value) => { value.files[0][2] = "0".repeat(64); }],
    ["projection header differs", (value) => { value.projectionVersion = "archive2-canonical-v1:" + "0".repeat(64); }],
  ]) await t.test(name, async () => {
    const value = clone(compactManifest);
    mutate(value);
    const assets = createAssetEnv({ overrides: new Map([[compactManifestRelative, JSON.stringify(value) + "\n"]]) });
    await assert.rejects(validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503 && /canonical input manifest digest mismatch/.test(error.message));
    assert.deepEqual(assets.requests, [compactManifestRelative]);
  });
  await t.test("catalog header still binds to the index", async () => {
    const value = clone(compactManifest);
    value.generatedFromCatalogIndexVersion = "0".repeat(64);
    const assets = createAssetEnv({ overrides: new Map([[compactManifestRelative, JSON.stringify(value) + "\n"]]) });
    await assert.rejects(validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503 && /canonical source index does not match the current projection/.test(error.message));
    assert.deepEqual(assets.requests, [compactManifestRelative, topRelative]);
  });
});

test("source verification index binds every source row to the full canonical resolver output", async () => {
  assert.equal(await canonical.computeProjectionVersion(manifest.files, manifest.resolverVersion), manifest.projectionVersion);
  // Workers deployed before the sharded layout compute their base without the flat index only (it includes the top index).
  assert.equal(
    await canonical.computeProjectionVersion(
      manifest.files.filter((row) => row.path !== canonical.SOURCE_VERIFICATION_INDEX_PATH),
      manifest.resolverVersion,
    ),
    sourceIndex.baseProjectionVersion,
  );
  // The top index cannot commit to a version containing itself or the flat index.
  assert.equal(
    await canonical.computeProjectionVersion(withoutSourceIndexes(manifest.files), manifest.resolverVersion),
    topIndex.baseProjectionVersion,
  );
  const indexManifestRow = manifest.files.find(
    (row) => row.path === canonical.SOURCE_VERIFICATION_INDEX_PATH,
  );
  assert.ok(indexManifestRow);
  assert.equal(sha256(indexText), indexManifestRow.sha256);
  const topManifestRow = manifest.files.find(
    (row) => row.path === canonical.SOURCE_VERIFICATION_TOP_INDEX_PATH,
  );
  assert.ok(topManifestRow);
  assert.equal(sha256(topText), topManifestRow.sha256);
  assert.equal(topIndex.schemaVersion, canonical.SOURCE_VERIFICATION_TOP_INDEX_SCHEMA);
  assert.equal(topIndex.generatedFromCatalogIndexVersion, manifest.generatedFromCatalogIndexVersion);
  assert.equal(sourceIndex.schemaVersion, "archive2-source-verification-index-v1");
  assert.equal(sourceIndex.resolverVersion, canonical.RESOLVER_VERSION);
  assert.equal(sourceIndex.generatedFromCatalogIndexVersion, manifest.generatedFromCatalogIndexVersion);
  assert.equal(Object.hasOwn(sourceIndex, "projectionVersion"), false);
  assert.equal(Object.hasOwn(sourceShard, "projectionVersion"), false);
  assert.equal(Object.hasOwn(sourceShard, "baseProjectionVersion"), false);
  assert.equal(sourceIndex.files.length, catalog.exams.length);
  assert.equal(new Set(sourceIndex.files.map((row) => row.sourceFile)).size, sourceIndex.files.length);
  assert.equal(new Set(sourceIndex.files.map((row) => shardPathOf(row.sourceFile))).size, sourceIndex.files.length);

  const sourceHashes = new Map(
    catalog.sourceHashes.map(([file, sha]) => [core.normalizeFile(file), String(sha || "").toLowerCase()]),
  );
  let shardQuestionCount = 0;
  let shardBytes = 0;
  for (const entry of sourceIndex.files) {
    const normalizedFile = core.normalizeFile(entry.sourceFile);
    const file = path.resolve(archiveDir, shardPathOf(entry.sourceFile));
    const fromArchive = path.relative(archiveDir, file);
    assert.equal(fromArchive.startsWith("..") || path.isAbsolute(fromArchive), false);
    const body = fs.readFileSync(file, "utf8");
    const shard = JSON.parse(body);
    const exam = catalog.exams.find((row) => core.normalizeFile(row.file) === normalizedFile);
    const records = catalog.records
      .filter((row) => row.sourceFile === normalizedFile)
      .sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));

    assert.equal(sha256(body), entry.sha256, normalizedFile);
    assert.equal(shard.schemaVersion, "archive2-source-verification-v1", normalizedFile);
    assert.equal(shard.sourceFile, normalizedFile, normalizedFile);
    assert.deepEqual(shard.exam, expectedShardExam(exam, normalizedFile), normalizedFile);
    assert.equal(Number(entry.qCount), Number(exam.qCount), normalizedFile);
    assert.equal(records.length, Number(exam.qCount), normalizedFile);
    assert.equal(shard.sourceSha256, sourceHashes.get(normalizedFile) || "", normalizedFile);
    assert.deepEqual(
      shard.records,
      records.map((row) => expectedShardRecord(row, normalizedFile)),
      normalizedFile,
    );
    assert.deepEqual(
      shard.records.map((row) => row.sourceOrdinal),
      records.map((row) => Number(row.sourceOrdinal)),
      normalizedFile,
    );
    shardQuestionCount += shard.records.length;
    shardBytes += Buffer.byteLength(body);
  }
  assert.equal(shardQuestionCount, catalog.records.length);
  // The dynamic catalog/source-index parity checks above remain strict when new
  // exam files are registered. Avoid pinning historical global totals here.
  assert.ok(shardQuestionCount > 0);
  assert.ok(shardBytes > 0);
});

test("original snapshot validation fetches only the compact manifest, top index, one index bucket, and selected source shard", async () => {
  assert.equal(sourceExam.qCount, sourceQuestions.length);
  assert.equal(sourceRows.length, sourceQuestions.length);
  assert.equal(sourceShard.records.length, sourceQuestions.length);
  for (let index = 0; index < sourceQuestions.length; index++)
    assert.equal(sha256(JSON.stringify(sourceQuestions[index])), sourceRows[index].rawQuestionHash);

  const assets = createAssetEnv();
  const result = await validateOriginalSnapshot(
    assets.env,
    { questions: sourceQuestions },
    makeInput(),
  );
  assert.deepEqual(assets.requests, [compactManifestRelative, topRelative, bucketRelative, shardRelative]);
  assert.equal(assets.bytesFetched(), Buffer.byteLength(compactManifestText) + Buffer.byteLength(topText) + Buffer.byteLength(bucketText) + Buffer.byteLength(shardText));
  assert.ok(assets.bytesFetched() < 500_000, "selected exam verification stays below 500 KB");
  assert.ok(assets.bytesFetched() < 67_058_078 / 100, "selected exam verification avoids the 67 MB resolver bundle");
  assert.equal(result.exam.file, sourceFile);
  assert.equal(result.exam.qCount, sourceQuestions.length);
  assert.equal(result.questions.length, sourceQuestions.length);

  let canonicalMetadataDifferenceCount = 0;
  for (let index = 0; index < sourceRows.length; index++) {
    const raw = sourceQuestions[index];
    const row = sourceRows[index];
    const verified = result.questions[index];
    assert.equal(verified.questionUid, row.identityStatus === "VERIFIED" ? row.questionUid : null);
    assert.equal(verified.sourceArchiveFile, sourceFile);
    assert.equal(verified.sourceOrdinal, index + 1);
    assert.equal(verified.sourceQuestionNo, row.sourceQuestionNo);
    assert.equal(verified.sourceFingerprint, row.sourceFingerprint);
    for (const field of ["content", "choices", "answer", "solution", "image"])
      assert.deepEqual(verified[field], raw[field], "raw question bytes are retained: " + field);
    for (const field of core.META_FIELDS) {
      const expectedPresent = Object.prototype.hasOwnProperty.call(row, field);
      const actualPresent = Object.prototype.hasOwnProperty.call(verified, field);
      assert.equal(actualPresent, expectedPresent, "canonical Meta presence: " + field);
      if (expectedPresent) {
        assert.deepEqual(verified[field], row[field], "canonical Meta value: " + field);
        if (
          Object.prototype.hasOwnProperty.call(raw, field) !== expectedPresent ||
          (expectedPresent && JSON.stringify(raw[field]) !== JSON.stringify(row[field]))
        )
          canonicalMetadataDifferenceCount += 1;
      }
    }
  }
  assert.ok(canonicalMetadataDifferenceCount > 0, "verified output must be rebuilt from canonical Meta fields");
  assert.equal(Object.prototype.hasOwnProperty.call(sourceQuestions[0], "questionUid"), false);
  assert.equal(result.questions[0].questionUid, sourceRows[0].questionUid);
});

test("stale versions, corrupt artifacts, and unindexed sources fail closed without full-loader fallback", async (t) => {
  await t.test("stale browser version stops after manifest read", async () => {
    const assets = createAssetEnv();
    await assert.rejects(
      validateOriginalSnapshot(
        assets.env,
        { questions: sourceQuestions },
        makeInput("archive2-canonical-v1:" + "0".repeat(64)),
      ),
      (error) => error.status === 409 && /분류 기준이 갱신되었습니다/.test(error.message),
    );
    assert.deepEqual(assets.requests, [compactManifestRelative]);
  });

  await t.test("top index body digest mismatch does not downgrade to the full catalog", async () => {
    const assets = createAssetEnv({
      overrides: new Map([[topRelative, topText + " "]])
    });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503 && /canonical source index digest mismatch/.test(error.message),
    );
    assert.deepEqual(assets.requests, [compactManifestRelative, topRelative]);
  });

  await t.test("listed but unavailable top index does not use legacy fallback", async () => {
    const assets = createAssetEnv({ missing: new Set([topRelative]) });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503,
    );
    assert.deepEqual(assets.requests, [compactManifestRelative, topRelative]);
  });

  await t.test("bucket body digest mismatch does not downgrade to the flat index or the full catalog", async () => {
    const assets = createAssetEnv({
      overrides: new Map([[bucketRelative, bucketText + " "]])
    });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503 && /canonical source index bucket digest mismatch/.test(error.message),
    );
    assert.deepEqual(assets.requests, [compactManifestRelative, topRelative, bucketRelative]);
  });

  await t.test("listed but unavailable bucket does not use the flat index", async () => {
    const assets = createAssetEnv({ missing: new Set([bucketRelative]) });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503,
    );
    assert.deepEqual(assets.requests, [compactManifestRelative, topRelative, bucketRelative]);
  });

  await t.test("the flat index is never read for original verification", async () => {
    const assets = createAssetEnv({ overrides: new Map([[indexRelative, "not json"]]) });
    const result = await validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput());
    assert.equal(result.questions.length, sourceQuestions.length);
    assert.equal(assets.requests.includes(indexRelative), false);
  });

  await t.test("shard body digest mismatch does not downgrade to the full catalog", async () => {
    const assets = createAssetEnv({
      overrides: new Map([[shardRelative, shardText + " "]])
    });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503 && /canonical source shard digest mismatch/.test(error.message),
    );
    assert.deepEqual(assets.requests, [compactManifestRelative, topRelative, bucketRelative, shardRelative]);
  });

  await t.test("unknown source is rejected before any shard fetch", async () => {
    const assets = createAssetEnv();
    const unknownFile = "original/high/h2/1final/not-indexed.js";
    await assert.rejects(
      validateOriginalSnapshot(
        assets.env,
        { questions: sourceQuestions },
        makeInput(manifest.projectionVersion, unknownFile),
      ),
      (error) => error.status === 503 && /canonical source is not indexed/.test(error.message),
    );
    assert.deepEqual(assets.requests, [compactManifestRelative, topRelative, bucketRelativeOf(unknownFile)]);
  });
});

test("raw content, order, and client-supplied identity or Meta cannot replace the shard snapshot", async (t) => {
  await t.test("changed content fails the raw source hash", async () => {
    const changed = clone(sourceQuestions);
    changed[0].content = String(changed[0].content || "") + "\n검증용 변경";
    const assets = createAssetEnv();
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: changed }, makeInput()),
      (error) => error.status === 409 && /원본 내용 또는 문항 순서가 변경되었습니다/.test(error.message),
    );
  });

  await t.test("swapped source order fails the per-ordinal raw source hashes", async () => {
    assert.notEqual(sourceRows[0].rawQuestionHash, sourceRows[1].rawQuestionHash);
    const reordered = clone(sourceQuestions);
    [reordered[0], reordered[1]] = [reordered[1], reordered[0]];
    const assets = createAssetEnv();
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: reordered }, makeInput()),
      (error) => error.status === 409 && /원본 내용 또는 문항 순서가 변경되었습니다/.test(error.message),
    );
  });

  await t.test("request cannot inject a UID or a different canonical Meta value", async () => {
    const spoofed = clone(sourceQuestions);
    spoofed[0].questionUid = "qid_v1_" + "0".repeat(64);
    spoofed[0].L1 = "요청 위조";
    const assets = createAssetEnv();
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: spoofed }, makeInput()),
      (error) => error.status === 409 && /원본 내용 또는 문항 순서가 변경되었습니다/.test(error.message),
    );
  });
});

test("a legacy manifest falls back to the existing full canonical loader", async () => {
  const legacyManifest = clone(manifest);
  legacyManifest.files = withoutSourceIndexes(legacyManifest.files);
  legacyManifest.projectionVersion = await canonical.computeProjectionVersion(
    legacyManifest.files,
    legacyManifest.resolverVersion,
  );
  const legacyText = JSON.stringify(legacyManifest) + "\n";
  const assets = createAssetEnv({
    overrides: new Map([[manifestRelative, legacyText], [compactManifestRelative, null]])
  });
  const result = await validateOriginalSnapshot(
    assets.env,
    { questions: sourceQuestions },
    makeInput(legacyManifest.projectionVersion),
  );
  assert.equal(result.questions.length, sourceQuestions.length);
  assert.equal(result.questions[0].questionUid, sourceRows[0].questionUid);
  assert.equal(assets.requests.filter((row) => row === manifestRelative).length, 2);
  assert.ok(assets.requests.includes("archive/data/archive2-catalog.json"));
  assert.ok(assets.requests.some((row) => row.startsWith("archive/data/meta-foundation/runtime/")));
  assert.equal(assets.requests.includes(indexRelative), false);
  // The full loader also verifies manifest-declared runtime packs and their reviewed registration proofs.
  const loaderInputs = [...new Set([
    ...canonical.REQUIRED_INPUT_PATHS,
    ...legacyManifest.files.map((row) => row.path).filter((p) => p.startsWith("data/meta-foundation/runtime/")),
  ])];
  const registrationProofs = [...new Set(loaderInputs
    .filter((p) => p.startsWith("data/meta-foundation/runtime/"))
    .flatMap((p) => Object.entries(JSON.parse(fs.readFileSync(path.join(archiveDir, p), "utf8")).generatedFrom || {})
      .filter(([key]) => key.startsWith("reviewedExam_"))
      .map(([, value]) => String(value).replace(/^archive\//, ""))))];
  assert.deepEqual(
    [...assets.requests].sort(),
    [compactManifestRelative, manifestRelative, manifestRelative, ...[...loaderInputs, ...registrationProofs].map((p) => path.posix.normalize("archive/" + p))].sort(),
  );
});

test("legacy unresolved row without Meta remains snapshotable and does not become a new gate", async () => {
  const fixture = await rebasedShardFixture((shard) => {
    shard.records[0].identityStatus = "UNRESOLVED";
    for (const field of core.META_FIELDS)
      delete shard.records[0][field];
  });
  const assets = createAssetEnv({ overrides: fixture.overrides });
  const result = await validateOriginalSnapshot(
    assets.env,
    { questions: sourceQuestions },
    fixture.input,
  );
  assert.equal(result.questions[0].questionUid, null);
  assert.equal(result.questions[0].sourceArchiveFile, sourceFile);
  assert.equal(result.questions[0].sourceOrdinal, 1);
  assert.equal(core.META_FIELDS.some((field) => Object.hasOwn(result.questions[0], field)), false);

  const rows = await buildQuestionSnapshot(
    { question_count: sourceQuestions.length },
    result.questions,
    {},
    { legacy: true, canonicalAuthority: result.canonicalAuthority },
  );
  assert.equal(rows.length, sourceQuestions.length);
  assert.equal(rows[0].question_uid, null);
  assert.equal(rows[0].resolution_status, "UNRESOLVED");
  assert.equal(rows[0].order_no, 1);
  assert.equal(rows[1].resolution_status, "VERIFIED");
});

test("absent and null source numbers keep the original question id fallback across full and sharded validation", async () => {
  assert.ok(Object.prototype.hasOwnProperty.call(sourceQuestions[0], "id"));
  const withoutVolatileSnapshotFields = (metadataJson) => {
    if (typeof metadataJson !== "string" || !metadataJson) return metadataJson;
    const snapshot = JSON.parse(metadataJson);
    delete snapshot.capturedAt;
    delete snapshot.snapshotHash;
    return JSON.stringify(snapshot);
  };
  const normalizeRows = (rows) => rows.map((row) => ({
    ...row,
    metadata_json: withoutVolatileSnapshotFields(row.metadata_json),
  }));
  const fullFixture = await legacyFullSourceNumberFixture();
  const fullAssets = createAssetEnv({ overrides: fullFixture.overrides });
  const fullResult = await validateOriginalSnapshot(
    fullAssets.env,
    { questions: sourceQuestions },
    fullFixture.input,
  );
  const fullRows = await buildQuestionSnapshot(
    { question_count: sourceQuestions.length },
    fullResult.questions,
    {},
    { legacy: true, canonicalAuthority: fullResult.canonicalAuthority },
  );

  for (const sourceQuestionNoMode of ["absent", "null"]) {
    const fixture = await rebasedShardFixture((shard) => {
      if (sourceQuestionNoMode === "absent")
        delete shard.records[0].sourceQuestionNo;
      else
        shard.records[0].sourceQuestionNo = null;
      delete shard.records[0].sourceFingerprint;
    });
    const fastAssets = createAssetEnv({ overrides: fixture.overrides });
    const fastResult = await validateOriginalSnapshot(
      fastAssets.env,
      { questions: sourceQuestions },
      fixture.input,
    );
    const fastRows = await buildQuestionSnapshot(
      { question_count: sourceQuestions.length },
      fastResult.questions,
      {},
      { legacy: true, canonicalAuthority: fastResult.canonicalAuthority },
    );
    assert.deepEqual(
      normalizeRows(fastRows),
      normalizeRows(fullRows),
      sourceQuestionNoMode + " sourceQuestionNo and sourceFingerprint preserve full-loader snapshot semantics",
    );
    assert.equal(
      fastRows[0].source_question_no,
      String(sourceQuestions[0].id),
      sourceQuestionNoMode + " sourceQuestionNo falls back to raw question id",
    );
    assert.equal(fastRows[0].source_fingerprint, null);
    assert.equal(fastRows[0].question_uid, sourceRows[0].questionUid);
    assert.equal(
      withoutVolatileSnapshotFields(fastRows[0].metadata_json),
      withoutVolatileSnapshotFields(fullRows[0].metadata_json),
    );
  }
});

test("mixed assignment validation uses indexed verification with a legacy full-catalog fallback", async () => {
  const record = catalog.records.find((row) => row.automatic && row.questionUid);
  assert.ok(record);
  const bank = archiveSource.evaluate(
    fs.readFileSync(path.join(archiveDir, "exams", record.sourceFile), "utf8"),
    record.sourceFile,
  );
  const question = {
    ...bank[Number(record.sourceOrdinal) - 1],
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceFile,
    sourceOrdinal: record.sourceOrdinal,
    sourceFingerprint: record.sourceFingerprint,
  };
  for (const field of core.META_FIELDS)
    if (record[field] !== undefined) question[field] = record[field];
  const assets = createAssetEnv();
  const result = await validateApprovedMixedQuestions(
    assets.env,
    [question],
    {
      index_version: manifest.projectionVersion,
      selection_filters: {
        grade: record.sourceGrade,
        primaryPaths: [core.pathKey(record, 4)],
      },
    },
  );
  assert.deepEqual(result.sourceGrades, [record.sourceGrade]);
  assert.ok(assets.requests.includes(manifestRelative));
  assert.equal(assets.requests.includes(compactManifestRelative), false, "mixed loader keeps the original manifest contract");
  if (sourceIndex.mixedLookup) {
    assert.ok(assets.requests.includes(indexRelative));
    assert.ok(assets.requests.includes("archive/data/archive2-source-verification/mixed-v1/context.json"));
    assert.equal(assets.requests.includes("archive/data/archive2-catalog.json"), false);
    assert.equal(assets.requests.some((row) => row.startsWith("archive/data/archive2-source-verification/v1/")), false);
    assert.equal(assets.requests.some((row) => row.startsWith("archive/data/archive2-source-verification/mixed-v1/")), true);
  } else {
    assert.equal(assets.requests.length, canonical.REQUIRED_INPUT_PATHS.length + 3);
    assert.ok(assets.requests.includes("archive/data/archive2-catalog.json"));
    assert.equal(assets.requests.includes(indexRelative), true);
    assert.equal(assets.requests.some((row) => row.startsWith("archive/data/archive2-source-verification/")), false);
  }
});

test("registered textbook sources validate through the Worker original-snapshot path with their raw figures intact", async () => {
  const textbookFile = "textbooks/미래엔_공통수학1/미래엔_공통수학1_경우의수_대단원마무리_고1/미래엔_공통수학1_경우의수_대단원마무리_고1.js";
  const exam = catalog.exams.find((row) => core.normalizeFile(row.file) === textbookFile);
  assert.ok(exam, "textbook source is registered in the catalog");
  assert.equal(exam.grade, "고1");
  const questions = archiveSource.evaluate(fs.readFileSync(path.join(archiveDir, "exams", textbookFile), "utf8"), textbookFile);
  const rows = catalog.records
    .filter((row) => row.sourceFile === textbookFile)
    .sort((a, b) => Number(a.sourceOrdinal) - Number(b.sourceOrdinal));
  assert.equal(rows.length, questions.length);
  assert.ok(rows.every((row) => row.sourceGrade === "고1" && row.sourceGradeStatus === "VALID"));
  assert.ok(questions.some((question) => /<img src="q04\.png"/.test(question.content)), "the figure is referenced by its bare file name");

  const assets = createAssetEnv();
  const result = await validateOriginalSnapshot(
    assets.env,
    { questions },
    { archive_file: "exams/" + textbookFile, question_count: questions.length, index_version: manifest.projectionVersion },
  );
  assert.deepEqual(assets.requests, [compactManifestRelative, topRelative, bucketRelativeOf(textbookFile), "archive/" + shardPathOf(textbookFile)]);
  assert.equal(result.exam.file, textbookFile);
  assert.equal(result.questions.length, questions.length);
  for (let index = 0; index < questions.length; index++) {
    assert.equal(result.questions[index].questionUid, rows[index].questionUid);
    assert.equal(result.questions[index].sourceArchiveFile, textbookFile);
    for (const field of ["content", "choices", "answer", "solution", "image"])
      assert.deepEqual(result.questions[index][field], questions[index][field], "raw question bytes are retained: " + field);
  }
});

test("sharded file list matches the flat index and every byte it commits to", async () => {
  const buckets = new Map();
  const prefixes = new Set();
  let total = 0;
  assert.equal(topIndex.buckets.length, canonical.SOURCE_VERIFICATION_INDEX_BUCKET_COUNT);
  for (const row of topIndex.buckets) {
    assert.match(row.prefix, /^[0-9a-f]$/);
    assert.equal(prefixes.has(row.prefix), false, "bucket prefix is repeated: " + row.prefix);
    prefixes.add(row.prefix);
    const body = fs.readFileSync(path.join(root, "archive", canonical.SOURCE_VERIFICATION_INDEX_BUCKET_PREFIX + row.prefix + ".json"), "utf8");
    assert.equal(sha256(body), row.sha256, "bucket digest: " + row.prefix);
    assert.equal(Buffer.byteLength(body), row.byteLength, "bucket byteLength: " + row.prefix);
    const bucket = JSON.parse(body);
    assert.equal(bucket.schemaVersion, canonical.SOURCE_VERIFICATION_INDEX_BUCKET_SCHEMA);
    assert.equal(bucket.prefix, row.prefix);
    assert.equal(bucket.files.length, row.fileCount);
    total += bucket.files.length;
    buckets.set(row.prefix, bucket);
  }
  assert.equal(total, topIndex.fileCount, "bucket rows add up to the top index count");
  assert.equal(total, sourceIndex.files.length, "bucket rows add up to the flat index");

  const seen = new Set();
  for (const [prefix, bucket] of buckets) {
    for (const row of bucket.files) {
      assert.equal(seen.has(row.sourceFile), false, "source is listed twice: " + row.sourceFile);
      seen.add(row.sourceFile);
      assert.equal(sha256(row.sourceFile).slice(0, 1), prefix, "source is in the wrong bucket: " + row.sourceFile);
      assert.equal(Object.hasOwn(row, "path"), false);
    }
  }
  const flat = new Map(sourceIndex.files.map((row) => [row.sourceFile, row]));
  assert.equal(seen.size, flat.size, "no source is missing or extra");
  for (const bucket of buckets.values())
    for (const row of bucket.files)
      assert.deepEqual(row, flat.get(row.sourceFile), "bucket row equals flat row: " + row.sourceFile);
});

test("the largest original check stays far below the 500 KB limit", async () => {
  const sizeOf = (relative) => fs.statSync(path.join(root, relative)).size;
  const fixed = sizeOf(compactManifestRelative) + sizeOf(topRelative);
  let worst = 0;
  let worstFile = "";
  for (const row of sourceIndex.files) {
    const bytes = fixed + sizeOf(bucketRelativeOf(row.sourceFile)) + sizeOf("archive/" + shardPathOf(row.sourceFile));
    if (bytes > worst) { worst = bytes; worstFile = row.sourceFile; }
  }
  assert.ok(worst < 500_000, "largest original check is " + worst + " bytes (" + worstFile + ")");
});

// With coordinatedTotal the forger also rewrites the top index total, so only the per-row checks can catch the change.
async function rebasedBucketFixture(mutateBucket, { coordinatedTotal = false } = {}) {
  const nextManifest = clone(manifest);
  const nextTop = clone(topIndex);
  const nextBucket = clone(sourceBucket);
  mutateBucket(nextBucket);
  const nextBucketText = JSON.stringify(nextBucket) + "\n";
  const topBucketRow = nextTop.buckets.find((row) => row.prefix === nextBucket.prefix);
  topBucketRow.sha256 = sha256(nextBucketText);
  topBucketRow.byteLength = Buffer.byteLength(nextBucketText);
  if (coordinatedTotal) nextTop.fileCount += nextBucket.files.length - topBucketRow.fileCount;
  topBucketRow.fileCount = nextBucket.files.length;
  const nextTopText = JSON.stringify(nextTop) + "\n";
  nextManifest.files.find((row) => row.path === canonical.SOURCE_VERIFICATION_TOP_INDEX_PATH).sha256 = sha256(nextTopText);
  nextManifest.projectionVersion = await canonical.computeProjectionVersion(nextManifest.files, nextManifest.resolverVersion);
  return {
    input: makeInput(nextManifest.projectionVersion),
    overrides: new Map([
      [manifestRelative, JSON.stringify(nextManifest) + "\n"],
      [compactManifestRelative, JSON.stringify(canonical.encodeCompactInputManifest(nextManifest)) + "\n"],
      [topRelative, nextTopText],
      [bucketRelative, nextBucketText],
    ]),
  };
}

test("a bucket that holds another bucket's row or loses a row fails closed even when its digests are rebased", async (t) => {
  await t.test("a row that belongs to another bucket is rejected", async () => {
    const foreign = sourceIndex.files.find((row) => sha256(row.sourceFile).slice(0, 1) !== sourceBucket.prefix);
    assert.ok(foreign, "a row from another bucket exists");
    const fixture = await rebasedBucketFixture((bucket) => bucket.files.push(clone(foreign)), { coordinatedTotal: true });
    const assets = createAssetEnv({ overrides: fixture.overrides });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, fixture.input),
      (error) => error.status === 503 && /canonical source index row is invalid/.test(error.message),
    );
    assert.equal(assets.requests.includes(shardRelative), false, "no shard is fetched after a bad bucket");
  });

  await t.test("a dropped row breaks the top index coverage count", async () => {
    const dropped = sourceBucket.files.findIndex((row) => row.sourceFile !== sourceFile);
    assert.ok(dropped >= 0);
    const fixture = await rebasedBucketFixture((bucket) => bucket.files.splice(dropped, 1));
    const assets = createAssetEnv({ overrides: fixture.overrides });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, fixture.input),
      (error) => error.status === 503 && /bucket coverage is incomplete/.test(error.message),
    );
    assert.equal(assets.requests.includes(bucketRelative), false, "coverage is checked before any bucket is read");
  });
});
