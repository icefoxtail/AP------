import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import core from "../archive/archive2-core.js";
import source from "../archive/archive2-source.js";
import {
  prepareSavedPaperBatch,
  readAndVerifySavedSnapshot,
  SAVED_PAPER_SCHEMA,
} from "../apmath/worker-backup/worker/helpers/archive-saved-papers.js";
import { resolveSavedPaperSourceGrades } from "../apmath/worker-backup/worker/helpers/archive2-questions.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const { catalog } = require("./helpers/archive2-scope-harness.cjs");
const archivePrefix = "/AP------/archive/";
const docsPrefix = "/AP------/docs/";
function assetResponse(url) {
  const pathname = decodeURIComponent(new URL(String(url)).pathname);
  const file = pathname.startsWith(archivePrefix)
    ? path.join(root, "archive", pathname.slice(archivePrefix.length))
    : pathname.startsWith(docsPrefix)
      ? path.join(root, "docs", pathname.slice(docsPrefix.length))
      : "";
  if (!file) return new Response("Not found", { status: 404 });
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative) || !fs.existsSync(file))
    return new Response("Not found", { status: 404 });
  return new Response(fs.readFileSync(file), { status: 200 });
}
const env = {
  ARCHIVE_PUBLIC_BASE_URL: "https://archive.test/AP------/archive",
  ARCHIVE2_ASSETS: { fetch: async url => assetResponse(url) },
};
const record = catalog.records.find(row => row.automatic &&
  !row.image && core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
assert.ok(record, "need an approved BASIC record without a separate source image asset");
const rawQuestion = source.evaluate(
  fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"),
  record.sourceFile,
)[record.sourceOrdinal - 1];
const question = {
  ...rawQuestion,
  questionUid: record.questionUid,
  sourceArchiveFile: record.sourceFile,
  sourceOrdinal: record.sourceOrdinal,
  sourceQuestionNo: record.sourceQuestionNo,
  sourceFingerprint: record.sourceFingerprint,
};
for (const field of core.META_FIELDS)
  if (record[field] !== undefined) question[field] = record[field];
const selectionFilters = {
  grade: record.sourceGrade,
  primaryPaths: [core.pathKey(record, 4)],
  scopeQuestionUids: [record.questionUid],
};
function saveInput(overrides = {}) {
  return {
    schema_version: SAVED_PAPER_SCHEMA,
    save_batch_id: "11111111-1111-4111-8111-111111111111",
    index_version: catalog.indexVersion,
    selection_filters: structuredClone(selectionFilters),
    papers: [{
      part_index: 0,
      questions: [structuredClone(question)],
      meta: { title: "정본 검증 저장본", qpp: 4, questionUids: [record.questionUid] },
    }],
    ...overrides,
  };
}

test("new saved papers require the current digest bundle and an exact selectable scope", async () => {
  const prepared = await prepareSavedPaperBatch(env, saveInput());
  assert.equal(prepared.currentIndexVersion, catalog.indexVersion);
  assert.equal(prepared.papers.length, 1);

  await assert.rejects(
    prepareSavedPaperBatch(env, saveInput({ index_version: "archive2-canonical-v1:" + "0".repeat(64) })),
    error => error.status === 409 && /분류 기준이 갱신되었습니다/.test(error.message),
  );
  await assert.rejects(
    prepareSavedPaperBatch(env, saveInput({
      selection_filters: { ...selectionFilters, primaryPaths: ["not-a-current-canonical-path"] },
    })),
    error => error.status === 409 && /승인된 문항·출제 범위/.test(error.message),
  );
});

test("an immutable saved snapshot remains verifiable when current taxonomy authority is unavailable", async () => {
  const prepared = await prepareSavedPaperBatch(env, saveInput());
  const stored = {
    ...prepared.papers[0],
    schema_version: prepared.papers[0].schema_version,
  };
  const previousFetch = env.ARCHIVE2_ASSETS.fetch;
  env.ARCHIVE2_ASSETS.fetch = async () => new Response("authority unavailable", { status: 503 });
  try {
    const snapshot = await readAndVerifySavedSnapshot(stored);
    assert.deepEqual(snapshot.questions.map(row => row.questionUid), [record.questionUid]);
    assert.equal(snapshot.meta.indexVersion, catalog.indexVersion);
    const route = fs.readFileSync(path.join(root, "apmath/worker-backup/worker/routes/archive2.js"), "utf8");
    const savedBranchStart = route.indexOf("if (savedPaperMode) {", route.indexOf("let payload = null"));
    const savedBranchEnd = route.indexOf("} else if (original) {", savedBranchStart);
    assert.ok(savedBranchStart >= 0 && savedBranchEnd > savedBranchStart);
    assert.match(route, /savedSnapshot = await readAndVerifySavedSnapshot\(savedPaper\)/);
    const savedBranch = route.slice(savedBranchStart, savedBranchEnd);
    assert.match(savedBranch, /savedSnapshot\.questions/);
    assert.doesNotMatch(savedBranch, /validateApprovedMixedQuestions|loadCanonicalCatalog/);
  } finally {
    env.ARCHIVE2_ASSETS.fetch = previousFetch;
  }
});

test("saved snapshot source grades resolve from preserved identity when canonical catalog is unavailable", async () => {
  const sharedRecord = catalog.records.find(row => row.sourceGrade === "고2" &&
    core.subjectProjectionForRecord(row, "", catalog.projectionPolicy) &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  assert.ok(sharedRecord, "test needs a real approved high2 shared-subject source");
  const [rawSharedQuestion] = source.evaluate(
    fs.readFileSync(path.join(root, "archive/exams", sharedRecord.sourceFile), "utf8"),
    sharedRecord.sourceFile,
  ).slice(sharedRecord.sourceOrdinal - 1, sharedRecord.sourceOrdinal);
  const sharedQuestion = {
    ...rawSharedQuestion,
    questionUid: sharedRecord.questionUid,
    sourceArchiveFile: sharedRecord.sourceFile,
    sourceOrdinal: sharedRecord.sourceOrdinal,
    sourceQuestionNo: sharedRecord.sourceQuestionNo,
    sourceFingerprint: sharedRecord.sourceFingerprint,
  };
  for (const field of core.META_FIELDS)
    if (sharedRecord[field] !== undefined) sharedQuestion[field] = sharedRecord[field];
  const filters = {
    grade: "고3",
    curriculumKey: sharedRecord.curriculumKey,
    semanticSubject: core.subjectProjectionForRecord(sharedRecord, "", catalog.projectionPolicy),
    primaryPaths: [core.pathKey(sharedRecord, 4)],
    scopeQuestionUids: [sharedRecord.questionUid],
  };
  const prepared = await prepareSavedPaperBatch(env, {
    schema_version: SAVED_PAPER_SCHEMA,
    save_batch_id: "22222222-2222-4222-8222-222222222222",
    index_version: catalog.indexVersion,
    selection_filters: filters,
    papers: [{
      part_index: 0,
      questions: [sharedQuestion],
      meta: { title: "shared source", qpp: 4, questionUids: [sharedRecord.questionUid] },
    }],
  });
  const snapshot = JSON.parse(prepared.papers[0].snapshot_json);
  assert.equal(snapshot.questions[0].sourceGrade, "고2",
    "new snapshots preserve the server-verified actual source grade separately from browse grade");
  assert.deepEqual(snapshot.questions[0].sourceIdentityEvidence, {
    schemaVersion: "archive2-saved-source-identity-v1",
    status: "VERIFIED",
    questionUid: sharedRecord.questionUid,
    sourceFile: sharedRecord.sourceFile,
    sourceOrdinal: sharedRecord.sourceOrdinal,
    identitySourceFile: sharedRecord.sourceFile,
    sourceGrade: "고2",
  });
  const legacySnapshotQuestions = snapshot.questions.map(({
    sourceGrade: _sourceGrade,
    sourceIdentityEvidence: _sourceIdentityEvidence,
    ...question
  }) => question);
  const previousFetch = env.ARCHIVE2_ASSETS.fetch;
  env.ARCHIVE2_ASSETS.fetch = async () => new Response("authority unavailable", { status: 503 });
  try {
    assert.deepEqual(
      await resolveSavedPaperSourceGrades(env, snapshot.questions),
      ["고2"],
      "new snapshots must deliver from server-verified source identity evidence without loading the current catalog",
    );
    assert.deepEqual(
      await resolveSavedPaperSourceGrades(env, legacySnapshotQuestions),
      ["고2"],
      "a 고3 browse grade must not replace the preserved 고2 source grade",
    );
    const renamedUid = "qid_v1_" + "b".repeat(64);
    const renamedIdentity = {
      ...legacySnapshotQuestions[0],
      questionUid: renamedUid,
      sourceGrade: "고2",
      sourceIdentityEvidence: {
        schemaVersion: "archive2-saved-source-identity-v1",
        status: "VERIFIED",
        questionUid: renamedUid,
        sourceFile: legacySnapshotQuestions[0].sourceArchiveFile,
        sourceOrdinal: legacySnapshotQuestions[0].sourceOrdinal,
        identitySourceFile: legacySnapshotQuestions[0].sourceArchiveFile,
        sourceGrade: "고2",
      },
    };
    assert.deepEqual(await resolveSavedPaperSourceGrades(env, [renamedIdentity]), ["고2"],
      "saved identity evidence must survive a verified source-path rename without the current identity catalog");
    const witnessedQuestion = snapshot.questions[0];
    const witnessedMutations = [
      ["question UID", { ...witnessedQuestion, questionUid: "qid_v1_" + "c".repeat(64) }],
      ["source path", { ...witnessedQuestion, sourceArchiveFile: "similar/shared.js" }],
      ["source ordinal", { ...witnessedQuestion, sourceOrdinal: witnessedQuestion.sourceOrdinal + 1 }],
      ["witness UID", {
        ...witnessedQuestion,
        sourceIdentityEvidence: { ...witnessedQuestion.sourceIdentityEvidence, questionUid: "qid_v1_" + "c".repeat(64) },
      }],
      ["witness source file", {
        ...witnessedQuestion,
        sourceIdentityEvidence: { ...witnessedQuestion.sourceIdentityEvidence, sourceFile: "similar/shared.js" },
      }],
      ["witness identity source file", {
        ...witnessedQuestion,
        sourceIdentityEvidence: { ...witnessedQuestion.sourceIdentityEvidence, identitySourceFile: "similar/shared.js" },
      }],
      ["witness ordinal", {
        ...witnessedQuestion,
        sourceIdentityEvidence: {
          ...witnessedQuestion.sourceIdentityEvidence,
          sourceOrdinal: witnessedQuestion.sourceIdentityEvidence.sourceOrdinal + 1,
        },
      }],
      ["question source grade", { ...witnessedQuestion, sourceGrade: "고1" }],
      ["witness source grade", {
        ...witnessedQuestion,
        sourceIdentityEvidence: { ...witnessedQuestion.sourceIdentityEvidence, sourceGrade: "고1" },
      }],
      ["witness schema", {
        ...witnessedQuestion,
        sourceIdentityEvidence: { ...witnessedQuestion.sourceIdentityEvidence, schemaVersion: "unknown" },
      }],
      ["witness status", {
        ...witnessedQuestion,
        sourceIdentityEvidence: { ...witnessedQuestion.sourceIdentityEvidence, status: "UNVERIFIED" },
      }],
    ];
    for (const [field, question] of witnessedMutations)
      await assert.rejects(
        resolveSavedPaperSourceGrades(env, [question]),
        error => error.status === 409,
        `a Saved Paper source identity ${field} mutation must fail closed`,
      );
    for (const [field, question] of [
      ["UID", { ...legacySnapshotQuestions[0], questionUid: "qid_v1_" + "d".repeat(64) }],
      ["ordinal", { ...legacySnapshotQuestions[0], sourceOrdinal: legacySnapshotQuestions[0].sourceOrdinal + 1 }],
      ["source grade", { ...legacySnapshotQuestions[0], sourceGrade: "고1" }],
    ])
      await assert.rejects(
        resolveSavedPaperSourceGrades(env, [question]),
        error => error.status === 409,
        `a legacy witness-less source identity ${field} mutation must fail closed`,
      );
    await assert.rejects(
      resolveSavedPaperSourceGrades(env, [{ ...legacySnapshotQuestions[0], sourceArchiveFile: "similar/shared.js" }]),
      error => error.status === 409,
      "without source-grade identity evidence the route must fail closed",
    );
  } finally {
    env.ARCHIVE2_ASSETS.fetch = previousFetch;
  }
});
