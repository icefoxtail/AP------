import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import core from "../archive/archive2-core.js";
import source from "../archive/archive2-source.js";
import {
  buildQuestionSnapshot,
  loadCanonicalCatalog,
  validateApprovedMixedQuestions,
} from "../apmath/worker-backup/worker/helpers/archive2-questions.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { catalog } = require("./helpers/archive2-scope-harness.cjs");
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

const archivePrefix = "/AP------/archive/";
const docsPrefix = "/AP------/docs/";
function fixtureAsset(url) {
  const pathname = decodeURIComponent(new URL(String(url)).pathname);
  let file;
  if (pathname.startsWith(archivePrefix))
    file = path.join(root, "archive", pathname.slice(archivePrefix.length));
  else if (pathname.startsWith(docsPrefix))
    file = path.join(root, "docs", pathname.slice(docsPrefix.length));
  else return new Response("Not found", { status: 404 });
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative) || !fs.existsSync(file))
    return new Response("Not found", { status: 404 });
  return new Response(fs.readFileSync(file), { status: 200 });
}
const env = {
  ARCHIVE_PUBLIC_BASE_URL: "https://archive.test/AP------/archive",
  ARCHIVE2_ASSETS: { fetch: async (url) => fixtureAsset(url) },
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

test("Worker resolves the same digest-bound projection version as the browser", async () => {
  const workerCatalog = await loadCanonicalCatalog(env, catalog.indexVersion);
  assert.equal(workerCatalog.indexVersion, catalog.indexVersion);
  assert.equal(workerCatalog.canonicalProjectionVersion, catalog.indexVersion);
  assert.deepEqual(
    workerCatalog.records.filter(row => row.automatic).map(row => row.questionUid).sort(),
    catalog.records.filter(row => row.automatic).map(row => row.questionUid).sort(),
  );
});

test("Worker rejects a stale browser projection version before accepting a new selection", async () => {
  await assert.rejects(
    loadCanonicalCatalog(env, "archive2-canonical-v1:" + "0".repeat(64)),
    error => error.status === 409 && /분류 기준이 갱신되었습니다/.test(error.message),
  );
  await assert.rejects(
    validateApprovedMixedQuestions(env, [baseQuestion], { selection_filters: gradeOnlyFilters }),
    error => error.status === 409 && /index_version required/.test(error.message),
  );
});

test("grade-only canonical path filters pass mixed-question validation", async () => {
  await validateApprovedMixedQuestions(
    env,
    [baseQuestion],
    input(gradeOnlyFilters),
  );
});

test("BASIC middle3 questions without advanced taxonomy pass server validation", async () => {
  const record = catalog.records.find(row => row.effectiveBrowseGrade === "중3" &&
    row.taxonomyStatus === "UNKNOWN" && core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  assert.ok(record, "need a source-verified BASIC question without an RPM leaf");
  await validateApprovedMixedQuestions(env, [materialize(record)], input({
    grade: "중3", primaryPaths: [core.pathKey(record, 4)],
  }));
});

test("Worker accepts an approved high2 source in the shared high3 semantic browse pool without rewriting its grade", async () => {
  const record = catalog.records.find(row => row.sourceGrade === "고2" &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok &&
    core.subjectProjectionForRecord(row, "", catalog.projectionPolicy));
  assert.ok(record, "need a selectable high2 source with an approved shared semantic projection");
  const semanticSubject = core.subjectProjectionForRecord(record, "", catalog.projectionPolicy);
  const question = materialize(record);
  const verified = await validateApprovedMixedQuestions(env, [question], input({
    grade: "고3",
    semanticSubject,
    primaryPaths: [core.pathKey(record, 4)],
  }));
  assert.deepEqual(verified.sourceGrades, ["고2"], "deployment uses the actual registered source grade");
  assert.equal(record.sourceGrade, "고2");
  assert.equal(question.curriculumKey, record.curriculumKey);
  assert.equal(question.courseKey, record.courseKey);
});

test("shared browse grade cannot replace saved snapshot source grades at deployment", async () => {
  const record = catalog.records.find(row => row.sourceGrade === "고2" &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok &&
    core.subjectProjectionForRecord(row, "", catalog.projectionPolicy));
  assert.ok(record, "need an approved high2 source shared into the high3 browse pool");
  const question = materialize(record);
  const before = JSON.stringify(question);
  const questionsModule = await import("../apmath/worker-backup/worker/helpers/archive2-questions.js");
  assert.equal(typeof questionsModule.resolveSavedPaperSourceGrades, "function");
  assert.equal(typeof questionsModule.checkTargetGrades, "function");

  const sourceGrades = await questionsModule.resolveSavedPaperSourceGrades(env, [question]);
  assert.deepEqual(sourceGrades, ["고2"]);
  assert.equal(JSON.stringify(question), before, "snapshot questions stay immutable while the gate checks authority");
  assert.doesNotThrow(() => questionsModule.checkTargetGrades({ grade: "고2" }, sourceGrades),
    "a high2 source remains deployable to high2 when browsed from high3");
  assert.throws(() => questionsModule.checkTargetGrades({ grade: "고1" }, sourceGrades),
    error => error.status === 409);
});

test("BASIC restores current source bytes with optional metadata missing and passes server validation", async () => {
  for (const grade of ["중1", "중2", "고1", "고2"]) {
    const record = catalog.records.find(row => row.effectiveBrowseGrade === grade &&
      row.difficultyBucket === "UNKNOWN" && core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
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

test("BASIC rejects an unapproved source release despite verified identity and taxonomy", async () => {
  const record = catalog.records.find(row => row.sourceStatus === "HOLD" &&
    row.sourceIntegrityStatus === "VERIFIED" && core.Canonical.validateBasicAssignment(row, catalog.canonicalAuthority).ok &&
    core.Canonical.validateAdvancedAssignment(row, catalog.canonicalAuthority).ok);
  assert.ok(record);
  assert.equal(core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority }).ok, false);
  assert.equal(core.difficultyEligible(record), false);
  assert.equal(core.advancedEligible(record), false);
  const original = source.evaluate(fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"), record.sourceFile)[record.sourceOrdinal - 1];
  await expectValidationFailure(
    () => validateApprovedMixedQuestions(env, [materialize(record)], input({
      grade: record.effectiveBrowseGrade, primaryPaths: [core.pathKey(record, 4)],
    })),
    "승인된 문항·출제 범위와 일치하지 않습니다.",
  );
  assert.ok(original.content);
});

test("Worker bridge rows follow registered UID identity after a same-grade source-path repair", async () => {
  const record = catalog.records.find(row => row.automatic &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  assert.ok(record, "need an approved source question to exercise the server bridge identity");
  const renamedFile = record.sourceGrade.startsWith("고")
    ? `original/high/h${record.sourceGrade[1]}/1mid/registered-rename.js`
    : `original/middle/m${record.sourceGrade[1]}/1mid/registered-rename.js`;
  const canonicalAuthority = structuredClone(catalog.canonicalAuthority);
  canonicalAuthority.examGradeByFile[renamedFile] = record.sourceGrade;
  canonicalAuthority.identityByUid[record.questionUid] = {
    ...canonicalAuthority.identityByUid[record.questionUid],
    sourceArchiveFile: renamedFile,
  };
  canonicalAuthority.assignmentsByUid[record.questionUid] = canonicalAuthority.assignmentsByUid[record.questionUid].map(row => ({
    ...row,
    sourceFile: renamedFile,
  }));
  const renamedRecord = { ...record, sourceFile: renamedFile };
  assert.equal(core.basicEligibility(renamedRecord, { canonicalAuthority }).ok, true);
  const question = { ...materialize(record), sourceArchiveFile: renamedFile };
  const rows = await buildQuestionSnapshot({ question_count: 1 }, [question], {
    questionUids: [record.questionUid],
  }, { canonicalAuthority });
  assert.equal(rows[0].question_uid, record.questionUid);
  assert.equal(rows[0].resolution_status, "VERIFIED");
});

test("BASIC restores a UTF-8 BOM source through browser-style fetch decoding", async (t) => {
  const record = catalog.records.find(row => core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok &&
    fs.readFileSync(path.join(root, "archive/exams", row.sourceFile), "utf8").startsWith("\uFEFF"));
  if (!record) return t.skip("current registered Archive2 sources contain no BOM-prefixed source file");
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
        {
          questionUid: "qid_v1_" + "0".repeat(64),
          l1l2ParentValid: true,
          basicTaxonomyStatus: "APPROVED",
          gradeConflict: false,
        },
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

test("taxonomy fingerprint excludes answer and solution while full source fingerprint protects the saved bytes", async () => {
  const assignmentFingerprint = await core.Canonical.assignmentFingerprint(baseQuestion);
  assert.equal(assignmentFingerprint, base.assignmentFingerprint);
  const solutionOnlyEdit = {
    ...baseQuestion,
    solution: String(baseQuestion.solution || "") + "\n검증용 해설 변경",
  };
  const answerOnlyEdit = {
    ...baseQuestion,
    answer: String(baseQuestion.answer || "") + "\n검증용 정답 변경",
  };
  assert.equal(await core.Canonical.assignmentFingerprint(solutionOnlyEdit), assignmentFingerprint);
  assert.equal(await core.Canonical.assignmentFingerprint(answerOnlyEdit), assignmentFingerprint);
  for (const [label, mutation] of [
    ["content", { content: String(baseQuestion.content || "") + "\n문항 수정" }],
    ["choices", { choices: [...(baseQuestion.choices || []), "추가 선택지"] }],
    ["image", { image: String(baseQuestion.image || "") + "?changed=1" }],
  ]) {
    const changed = { ...baseQuestion, ...mutation };
    assert.notEqual(await core.Canonical.assignmentFingerprint(changed), assignmentFingerprint, label);
    await expectValidationFailure(
      () => validateApprovedMixedQuestions(env, [changed], input(gradeOnlyFilters)),
      "승인된 분류 assignment fingerprint가 일치하지 않습니다.",
    );
  }
  await expectValidationFailure(
    () => validateApprovedMixedQuestions(env, [solutionOnlyEdit], input(gradeOnlyFilters)),
    "문항 내용 fingerprint가 일치하지 않습니다.",
  );
  await expectValidationFailure(
    () => validateApprovedMixedQuestions(env, [answerOnlyEdit], input(gradeOnlyFilters)),
    "문항 내용 fingerprint가 일치하지 않습니다.",
  );
});
