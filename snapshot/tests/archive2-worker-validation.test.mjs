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
const base = catalog.records.find((record) => record.automatic);
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
