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
const indexRelative = "archive/data/archive2-source-verification-index.json";
const manifestPath = path.join(root, manifestRelative);
const indexPath = path.join(root, indexRelative);
const manifestText = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestText);
const indexText = fs.readFileSync(indexPath, "utf8");
const sourceIndex = JSON.parse(indexText);
const sourceFile = "original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js";
const sourceEntry = sourceIndex.files.find((row) => row.sourceFile === sourceFile);
assert.ok(sourceEntry, "selected original source must have a verification shard");
const shardRelative = "archive/" + sourceEntry.path;
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

function createAssetEnv({ overrides = new Map(), missing = new Set() } = {}) {
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
  for (const field of core.META_FIELDS)
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
  const nextIndex = clone(sourceIndex);
  const indexRow = nextIndex.files.find((row) => row.sourceFile === sourceFile);
  const nextShard = clone(sourceShard);
  mutator(nextShard);

  const nextShardText = JSON.stringify(nextShard) + "\n";
  indexRow.sha256 = sha256(nextShardText);
  const nextIndexText = JSON.stringify(nextIndex) + "\n";
  const manifestIndexRow = nextManifest.files.find(
    (row) => row.path === canonical.SOURCE_VERIFICATION_INDEX_PATH,
  );
  assert.ok(manifestIndexRow, "source index digest must be in the outer manifest");
  manifestIndexRow.sha256 = sha256(nextIndexText);
  nextManifest.projectionVersion = await canonical.computeProjectionVersion(
    nextManifest.files,
    nextManifest.resolverVersion,
  );
  const nextManifestText = JSON.stringify(nextManifest) + "\n";
  return {
    manifest: nextManifest,
    index: nextIndex,
    shard: nextShard,
    input: makeInput(nextManifest.projectionVersion),
    overrides: new Map([
      [manifestRelative, nextManifestText],
      [indexRelative, nextIndexText],
      [shardRelative, nextShardText],
    ]),
  };
}

async function legacyFullSourceNumberFixture() {
  const legacyManifest = clone(manifest);
  legacyManifest.files = legacyManifest.files.filter(
    (row) => row.path !== canonical.SOURCE_VERIFICATION_INDEX_PATH,
  );
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
      ["archive/data/archive2-catalog.json", catalogText],
    ]),
  };
}

test("source verification index binds every source row to the full canonical resolver output", async () => {
  assert.equal(await canonical.computeProjectionVersion(manifest.files, manifest.resolverVersion), manifest.projectionVersion);
  assert.equal(
    await canonical.computeProjectionVersion(
      manifest.files.filter((row) => row.path !== canonical.SOURCE_VERIFICATION_INDEX_PATH),
      manifest.resolverVersion,
    ),
    sourceIndex.baseProjectionVersion,
  );
  const indexManifestRow = manifest.files.find(
    (row) => row.path === canonical.SOURCE_VERIFICATION_INDEX_PATH,
  );
  assert.ok(indexManifestRow);
  assert.equal(sha256(indexText), indexManifestRow.sha256);
  assert.equal(sourceIndex.schemaVersion, "archive2-source-verification-index-v1");
  assert.equal(sourceIndex.resolverVersion, canonical.RESOLVER_VERSION);
  assert.equal(sourceIndex.generatedFromCatalogIndexVersion, manifest.generatedFromCatalogIndexVersion);
  assert.equal(Object.hasOwn(sourceIndex, "projectionVersion"), false);
  assert.equal(Object.hasOwn(sourceShard, "projectionVersion"), false);
  assert.equal(Object.hasOwn(sourceShard, "baseProjectionVersion"), false);
  assert.equal(sourceIndex.files.length, catalog.exams.length);
  assert.equal(new Set(sourceIndex.files.map((row) => row.sourceFile)).size, sourceIndex.files.length);
  assert.equal(new Set(sourceIndex.files.map((row) => row.path)).size, sourceIndex.files.length);

  const sourceHashes = new Map(
    catalog.sourceHashes.map(([file, sha]) => [core.normalizeFile(file), String(sha || "").toLowerCase()]),
  );
  let shardQuestionCount = 0;
  let shardBytes = 0;
  for (const entry of sourceIndex.files) {
    const normalizedFile = core.normalizeFile(entry.sourceFile);
    const file = path.resolve(archiveDir, entry.path);
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
  assert.equal(shardQuestionCount, 17787);
  assert.equal(sourceIndex.files.length, 755);
  assert.ok(shardBytes > 0);
});

test("original snapshot validation fetches only the manifest, index, and selected source shard", async () => {
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
  assert.deepEqual(assets.requests, [manifestRelative, indexRelative, shardRelative]);
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
    assert.deepEqual(assets.requests, [manifestRelative]);
  });

  await t.test("index body digest mismatch does not downgrade to the full catalog", async () => {
    const assets = createAssetEnv({
      overrides: new Map([[indexRelative, indexText + " "]])
    });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503 && /canonical source index digest mismatch/.test(error.message),
    );
    assert.deepEqual(assets.requests, [manifestRelative, indexRelative]);
  });

  await t.test("listed but unavailable index does not use legacy fallback", async () => {
    const assets = createAssetEnv({ missing: new Set([indexRelative]) });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503,
    );
    assert.deepEqual(assets.requests, [manifestRelative, indexRelative]);
  });

  await t.test("shard body digest mismatch does not downgrade to the full catalog", async () => {
    const assets = createAssetEnv({
      overrides: new Map([[shardRelative, shardText + " "]])
    });
    await assert.rejects(
      validateOriginalSnapshot(assets.env, { questions: sourceQuestions }, makeInput()),
      (error) => error.status === 503 && /canonical source shard digest mismatch/.test(error.message),
    );
    assert.deepEqual(assets.requests, [manifestRelative, indexRelative, shardRelative]);
  });

  await t.test("unknown source is rejected before any shard fetch", async () => {
    const assets = createAssetEnv();
    await assert.rejects(
      validateOriginalSnapshot(
        assets.env,
        { questions: sourceQuestions },
        makeInput(manifest.projectionVersion, "original/high/h2/1final/not-indexed.js"),
      ),
      (error) => error.status === 503 && /canonical source is not indexed/.test(error.message),
    );
    assert.deepEqual(assets.requests, [manifestRelative, indexRelative]);
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
  legacyManifest.files = legacyManifest.files.filter(
    (row) => row.path !== canonical.SOURCE_VERIFICATION_INDEX_PATH,
  );
  legacyManifest.projectionVersion = await canonical.computeProjectionVersion(
    legacyManifest.files,
    legacyManifest.resolverVersion,
  );
  const legacyText = JSON.stringify(legacyManifest) + "\n";
  const assets = createAssetEnv({
    overrides: new Map([[manifestRelative, legacyText]])
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
  assert.equal(assets.requests.length, canonical.REQUIRED_INPUT_PATHS.length + 2);
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
      fastRows,
      fullRows,
      sourceQuestionNoMode + " sourceQuestionNo and sourceFingerprint preserve full-loader snapshot semantics",
    );
    assert.equal(
      fastRows[0].source_question_no,
      String(sourceQuestions[0].id),
      sourceQuestionNoMode + " sourceQuestionNo falls back to raw question id",
    );
    assert.equal(fastRows[0].source_fingerprint, null);
    assert.equal(fastRows[0].question_uid, sourceRows[0].questionUid);
    assert.equal(fastRows[0].metadata_json, fullRows[0].metadata_json);
  }
});

test("mixed assignment validation keeps the existing full-catalog path", async () => {
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
  assert.equal(assets.requests.length, canonical.REQUIRED_INPUT_PATHS.length + 1);
  assert.ok(assets.requests.includes("archive/data/archive2-catalog.json"));
  assert.equal(assets.requests.includes(indexRelative), false);
  assert.equal(assets.requests.some((row) => row.startsWith("archive/data/archive2-source-verification/")), false);
});
