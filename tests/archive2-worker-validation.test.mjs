import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import core from "../archive/archive2-core.js";
import source from "../archive/archive2-source.js";
import { validateApprovedMixedQuestions } from "../apmath/worker-backup/worker/helpers/archive2-questions.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = core.decodeCatalog(
  JSON.parse(
    fs.readFileSync(path.join(root, "archive/data/archive2-catalog.json")),
  ),
);
const catalogText = fs.readFileSync(
  path.join(root, "archive/data/archive2-catalog.json"),
  "utf8",
);
const base = catalog.records.find((record) => record.automatic && (!process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX || record.sourceFile.startsWith(process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX)));
assert.ok(base, "catalog must contain an automatic record");
const basePath = core.pathKey(base, 4);
const alternate = catalog.records.find(
  (record) =>
    record.automatic &&
    record.effectiveBrowseGrade === base.effectiveBrowseGrade &&
    core.pathKey(record, 4) !== basePath,
);

assert.ok(alternate, "catalog must contain an alternate canonical path");

const env = {
  ARCHIVE2_ASSETS: {
    fetch: async () =>
      new Response(catalogText, {
        headers: { "Content-Type": "application/json" },
      }),
  },
};

function materialize(record) {
  const bank = source.evaluate(
    fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"),
    record.sourceFile,
  );
  const question = {
    ...bank[record.sourceOrdinal - 1],
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceFile,
    sourceOrdinal: record.sourceOrdinal,
    sourceFingerprint: record.sourceFingerprint,
  };
  for (const field of core.META_FIELDS)
    if (record[field] !== undefined) question[field] = record[field];
  return question;
}

const baseQuestion = materialize(base);
const alternateQuestion = materialize(alternate);
const gradeOnlyFilters = {
  grade: base.effectiveBrowseGrade,
  primaryPaths: [basePath],
};
const fullFilters = {
  ...gradeOnlyFilters,
  curriculumKey: base.curriculumKey,
  courseKey: base.courseKey,
};
const input = (selection_filters) => ({
  index_version: catalog.indexVersion,
  selection_filters,
});

async function expectValidationFailure(run, message) {
  await assert.rejects(run, (error) => {
    assert.equal(error.message, message);
    return true;
  });
}

test("grade-only canonical path filters pass mixed-question validation", async () => {
  await validateApprovedMixedQuestions(
    env,
    [baseQuestion],
    input(gradeOnlyFilters),
  );
});

test("BASIC middle3 questions without advanced taxonomy pass server validation", async () => {
  const record = catalog.records.find(row => row.effectiveBrowseGrade === "중3" &&
    row.taxonomyStatus === "UNKNOWN" && core.basicEligibility(row).ok);
  assert.ok(record, "need a source-verified BASIC question without an RPM leaf");
  await validateApprovedMixedQuestions(env, [materialize(record)], input({
    grade: "중3", primaryPaths: [core.pathKey(record, 4)],
  }));
});

test("BASIC restores current source bytes with optional metadata missing and passes server validation", async () => {
  for (const grade of ["중1", "중2", "중3", "고1", "고2"]) {
    const record = catalog.records.find(row => row.effectiveBrowseGrade === grade &&
      row.difficultyBucket === "UNKNOWN" && core.basicEligibility(row).ok);
    assert.ok(record, grade + " needs an unclassified BASIC source question");
    const original = source.evaluate(fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"), record.sourceFile)[record.sourceOrdinal - 1];
    const previousFetch = globalThis.fetch, previousDocument = globalThis.document;
    let restored;
    try {
      globalThis.document = { baseURI: "https://archive.test/archive/workspace.html" };
      globalThis.fetch = async url => new Response(fs.readFileSync(path.join(root,
        decodeURIComponent(new URL(String(url)).pathname).replace(/^\//, "")), "utf8"));
      [restored] = await source.restore([record], catalog);
    } finally {
      globalThis.fetch = previousFetch;
      if (previousDocument === undefined) delete globalThis.document;
      else globalThis.document = previousDocument;
    }
    for (const field of ["content", "choices", "answer", "solution", "image", "layoutTag", "wide", "level"])
      assert.deepEqual(restored[field], original[field], grade + ": " + field);
    assert.equal(restored.difficultyBucket, "UNKNOWN");
    await validateApprovedMixedQuestions(env, [restored], input({ grade,
      primaryPaths: [core.pathKey(record, 4)],
    }));
  }
});

test("BASIC current-source integrity is independent of stale advanced metadata approval", async () => {
  const record = catalog.records.find(row => row.sourceStatus === "HOLD" &&
    row.sourceIntegrityStatus === "VERIFIED" && core.basicEligibility(row).ok);
  assert.ok(record);
  assert.equal(core.difficultyEligible(record), false);
  assert.equal(core.advancedEligible(record), false);
  const original = source.evaluate(fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"), record.sourceFile)[record.sourceOrdinal - 1];
  await validateApprovedMixedQuestions(env, [materialize(record)], input({
    grade: record.effectiveBrowseGrade, primaryPaths: [core.pathKey(record, 4)],
  }));
  assert.ok(original.content);
});

test("BASIC restores a UTF-8 BOM source through browser-style fetch decoding", async () => {
  const record = catalog.records.find(row => core.basicEligibility(row).ok &&
    fs.readFileSync(path.join(root, "archive/exams", row.sourceFile), "utf8").startsWith("\uFEFF"));
  assert.ok(record, "need an actual BOM-prefixed source regression");
  const original = source.evaluate(fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"), record.sourceFile)[record.sourceOrdinal - 1];
  const previousFetch = globalThis.fetch, previousDocument = globalThis.document;
  try {
    globalThis.document = { baseURI: "https://archive.test/archive/workspace.html" };
    globalThis.fetch = async url => new Response(fs.readFileSync(path.join(root,
      decodeURIComponent(new URL(String(url)).pathname).replace(/^\//, "")), "utf8"));
    const [restored] = await source.restore([record], catalog);
    assert.equal(restored.content, original.content);
    assert.equal(restored.solution, original.solution);
    await validateApprovedMixedQuestions(env, [restored], input({
      grade: record.effectiveBrowseGrade, primaryPaths: [core.pathKey(record, 4)],
    }));
  } finally {
    globalThis.fetch = previousFetch;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});

test("curriculum and course filters remain optional additions, when present", async () => {
  await validateApprovedMixedQuestions(env, [baseQuestion], input(fullFilters));
});

test("mixed validation rejects missing or malformed primaryPaths", async (t) => {
  for (const [name, filters] of [
    ["missing", { grade: base.effectiveBrowseGrade }],
    ["empty", { ...gradeOnlyFilters, primaryPaths: [] }],
    ["non-string", { ...gradeOnlyFilters, primaryPaths: [1] }],
    ["blank", { ...gradeOnlyFilters, primaryPaths: ["  "] }],
  ]) {
    await t.test(name, () =>
      expectValidationFailure(
        () => validateApprovedMixedQuestions(env, [baseQuestion], input(filters)),
        "selection_filters required",
      ),
    );
  }
});

test("mixed validation rejects a question outside primaryPaths", async () => {
  await expectValidationFailure(
    () =>
      validateApprovedMixedQuestions(
        env,
        [alternateQuestion],
        input(gradeOnlyFilters),
      ),
    "승인된 문항·출제 범위와 일치하지 않습니다.",
  );
});

test(
  "mixed validation keeps UID, fingerprint, and metadata parity gates",
  async (t) => {
    const cases = [
      [
        "questionUid",
        { questionUid: "qid_v1_" + "0".repeat(64) },
        "승인된 문항·출제 범위와 일치하지 않습니다.",
      ],
      [
        "fingerprint",
        { sourceFingerprint: "forged-fingerprint" },
        "문항 내용 fingerprint가 일치하지 않습니다.",
      ],
      [
        "metadata",
        {
          difficultyBucket: base.difficultyBucket === 1 ? 2 : 1,
        },
        "canonical metadata parity mismatch: difficultyBucket",
      ],
    ];
    for (const [name, mutation, message] of cases) {
      await t.test(name, () =>
        expectValidationFailure(
          () =>
            validateApprovedMixedQuestions(
              env,
              [{ ...baseQuestion, ...mutation }],
              input(gradeOnlyFilters),
            ),
          message,
        ),
      );
    }
  },
);
