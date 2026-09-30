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
