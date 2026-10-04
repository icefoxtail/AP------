import { sha256hex } from "./admin-db.js";
import {
  buildQuestionSnapshot,
  fail,
  validateApprovedMixedQuestions,
} from "./archive2-questions.js";
import core from "../../../../archive/archive2-core.js";
import output from "../../../../archive/archive2-output.js";

export const SAVED_PAPER_SCHEMA = "archive-saved-paper-v1";
export const SAVED_PAPER_BATCH_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export const MAX_SAVED_PAPER_BYTES = 1_500_000;
export const MAX_SAVED_BATCH_BYTES = 8_000_000;
export const MAX_SAVED_PAPERS = 8;
export const MAX_SAVED_QUESTIONS = 400;
export const SAVED_PAPER_LIBRARY_STATES = Object.freeze(["ACTIVE", "ARCHIVED", "TRASHED"]);
const SAVED_PAPER_LIBRARY_STATUS_SET = new Set(SAVED_PAPER_LIBRARY_STATES);

export function resolveSavedPaperLibraryStatus(savedPaper, libraryMetadata = null) {
  if (!savedPaper || typeof savedPaper !== "object") throw new TypeError("saved paper row is required");
  if (savedPaper.deleted_at !== null && savedPaper.deleted_at !== undefined) return "TRASHED";
  const status = libraryMetadata?.status ?? "ACTIVE";
  if (!SAVED_PAPER_LIBRARY_STATUS_SET.has(status))
    throw new Error("invalid library status: " + String(status));
  return status;
}

const FILTER_KEYS = new Set([
  "grade", "curriculumKey", "courseKey", "semanticSubject", "L1", "L2", "L3", "L4",
  "sourceFiles", "primaryPaths", "scopeQuestionUids", "school", "yearFrom", "yearTo",
  "axis", "family", "difficultyBuckets", "query",
]);

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function byteLength(value) {
  return new TextEncoder().encode(value).byteLength;
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function validateSelectionFilters(filters) {
  if (!isPlainObject(filters)) fail("selection_filters required");
  const keys = Object.keys(filters);
  if (keys.some((key) => !FILTER_KEYS.has(key)))
    fail("허용되지 않은 출제 조건이 포함되어 있습니다.", 409);
  if (
    typeof filters.grade !== "string" ||
    !filters.grade.trim() ||
    !Array.isArray(filters.primaryPaths) ||
    filters.primaryPaths.length === 0 ||
    filters.primaryPaths.length > 2000 ||
    filters.primaryPaths.some((path) => typeof path !== "string" || !path.trim())
  ) fail("출제 학년과 범위를 확인해 주세요.", 409);
  for (const key of ["sourceFiles", "scopeQuestionUids", "difficultyBuckets"]) {
    if (filters[key] !== undefined && (!Array.isArray(filters[key]) || filters[key].some((value) => typeof value !== "string")))
      fail(`invalid selection_filters.${key}`, 409);
  }
  for (const key of ["curriculumKey", "courseKey", "semanticSubject", "L1", "L2", "L3", "L4", "school", "axis", "family", "query", "yearFrom", "yearTo"]) {
    const value = filters[key];
    if (value !== undefined && !["string", "number"].includes(typeof value))
      fail(`invalid selection_filters.${key}`, 409);
  }
  if (byteLength(stableStringify(filters)) > 200_000)
    fail("출제 조건 크기가 너무 큽니다.", 413);
  return JSON.parse(JSON.stringify(filters));
}

export async function computeSavedPaperRequestHash(input) {
  if (input?.schema_version !== SAVED_PAPER_SCHEMA) fail("schema_version mismatch", 400);
  if (!SAVED_PAPER_BATCH_ID.test(String(input.save_batch_id || "")))
    fail("save_batch_id must be a UUID", 400);
  if (!Array.isArray(input.papers) || input.papers.length < 1 || input.papers.length > MAX_SAVED_PAPERS)
    fail(`1~${MAX_SAVED_PAPERS} papers required`, 400);
  const selectionFilters = validateSelectionFilters(input.selection_filters);
  return sha256hex(stableStringify({
    schema_version: input.schema_version,
    save_batch_id: input.save_batch_id,
    index_version: input.index_version,
    selection_filters: selectionFilters,
    include_extended: input.include_extended === true,
    papers: input.papers,
  }));
}

export async function computeSavedPaperCopyRequestHash({ save_batch_id, parent_id, parent_snapshot_hash }) {
  if (!SAVED_PAPER_BATCH_ID.test(String(save_batch_id || "")))
    fail("save_batch_id must be a UUID", 400);
  if (!SAVED_PAPER_BATCH_ID.test(String(parent_id || "")))
    fail("parent Saved Paper ID must be a UUID", 400);
  if (!/^[0-9a-f]{64}$/i.test(String(parent_snapshot_hash || "")))
    fail("parent snapshot hash is invalid", 400);
  return sha256hex(stableStringify({
    operation: "SAVED_PAPER_COPY",
    schema_version: SAVED_PAPER_SCHEMA,
    save_batch_id,
    parent_id,
    parent_snapshot_hash: String(parent_snapshot_hash).toLowerCase(),
  }));
}

function validateQuestionObject(question, partIndex, questionIndex) {
  if (!isPlainObject(question)) fail(`문항 ${questionIndex + 1}의 형식이 올바르지 않습니다.`, 409);
  const uid = String(question.questionUid || "");
  if (!/^qid_v1_[a-f0-9]{64}$/.test(uid))
    fail(`${partIndex + 1}권 ${questionIndex + 1}번 문항 UID를 확인할 수 없습니다.`, 409);
}

function sourceAssetPath(value) {
  const raw = String(value ?? "").trim().replace(/\\/g, "/");
  if (!raw || /^(?:data:|blob:|https?:)/i.test(raw)) return "";
  const pathOnly = raw.split(/[?#]/, 1)[0];
  const marker = pathOnly.toLowerCase().indexOf("assets/images/");
  if (marker < 0) return "";
  const relative = pathOnly.slice(marker);
  if (relative.split("/").some((part) => part === ".." || part === "."))
    fail("시험지 이미지 경로가 올바르지 않습니다.", 409);
  return relative;
}

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

async function embedSavedPaperAssets(env, questions) {
  const cache = new Map();
  const base = String(
    env.ARCHIVE_PUBLIC_BASE_URL || "https://icefoxtail.github.io/AP------/archive",
  ).replace(/\/+$/, "") + "/";
  async function inlineReference(value) {
    if (typeof value !== "string") return value;
    const path = sourceAssetPath(value);
    if (!path) return value;
    if (cache.has(path)) return cache.get(path);
    const url = new URL(path, base);
    const response = env.ARCHIVE2_ASSETS
      ? await env.ARCHIVE2_ASSETS.fetch(url)
      : await fetch(url);
    if (!response.ok) fail("문제지 이미지 파일을 저장할 수 없습니다.", 409);
    const reader = response.body?.getReader();
    let bytes;
    if (reader) {
      const chunks = [];
      let size = 0;
      try {
        for (;;) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          size += chunk.byteLength;
          if (size > MAX_SAVED_PAPER_BYTES) {
            await reader.cancel();
            fail("문제지 이미지가 저장 한도를 넘었습니다.", 413);
          }
          chunks.push(chunk);
        }
      } finally {
        reader.releaseLock();
      }
      bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.byteLength;
      }
    } else {
      bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > MAX_SAVED_PAPER_BYTES)
        fail("문제지 이미지가 저장 한도를 넘었습니다.", 413);
    }
    const ext = path.split(".").at(-1).toLowerCase();
    const fallbackMime = ({ png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", svg: "image/svg+xml", webp: "image/webp", gif: "image/gif" })[ext];
    const declaredMime = String(response.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
    const mime = declaredMime.startsWith("image/") ? declaredMime : fallbackMime;
    if (!mime) fail("지원하지 않는 문제지 이미지 형식입니다.", 409);
    const dataUrl = `data:${mime};base64,${bytesToBase64(bytes)}`;
    cache.set(path, dataUrl);
    return dataUrl;
  }
  async function inlineHtmlImages(value) {
    if (typeof value !== "string" || !/(?:src\s*=|url\s*\()/i.test(value)) return value;
    const matches = [...value.matchAll(/(\bsrc\s*=\s*)(["'])([^"']+)\2|url\(\s*(["']?)([^)"'\s]+)(["']?\s*\))/gi)];
    if (!matches.length) return value;
    let outputText = "";
    let cursor = 0;
    for (const match of matches) {
      const ref = match[3] || match[5];
      const rewritten = await inlineReference(ref);
      outputText += value.slice(cursor, match.index);
      if (match[3]) outputText += `${match[1]}${match[2]}${rewritten}${match[2]}`;
      else outputText += `url(${match[4]}${rewritten}${match[6]}`;
      cursor = match.index + match[0].length;
    }
    return outputText + value.slice(cursor);
  }
  for (const question of questions) {
    if (typeof question.image === "string") question.image = await inlineReference(question.image);
    if (typeof question.solutionImage === "string") question.solutionImage = await inlineReference(question.solutionImage);
    for (const field of ["content", "question", "solution"])
      if (typeof question[field] === "string") question[field] = await inlineHtmlImages(question[field]);
  }
}

export async function prepareSavedPaperBatch(env, input) {
  if (input.schema_version !== SAVED_PAPER_SCHEMA) fail("schema_version mismatch", 400);
  if (!SAVED_PAPER_BATCH_ID.test(String(input.save_batch_id || "")))
    fail("save_batch_id must be a UUID", 400);
  if (typeof input.index_version !== "string" || !input.index_version.trim() || input.index_version.length > 2000)
    fail("index_version required", 400);
  const selectionFilters = validateSelectionFilters(input.selection_filters);
  if (!Array.isArray(input.papers) || input.papers.length < 1 || input.papers.length > MAX_SAVED_PAPERS)
    fail(`1~${MAX_SAVED_PAPERS} papers required`, 400);

  const requestHash = await computeSavedPaperRequestHash(input);
  let totalQuestions = 0;
  const prepared = [];
  const seenUids = new Set();
  for (let i = 0; i < input.papers.length; i++) {
    const paper = input.papers[i];
    if (!isPlainObject(paper) || Number(paper.part_index) !== i || !Array.isArray(paper.questions) || !isPlainObject(paper.meta))
      fail("권 번호, 문항 또는 시험지 설정이 올바르지 않습니다.", 409);
    if (paper.questions.length < 1 || paper.questions.length > 50)
      fail("저장한 시험지는 권당 1~50문항이어야 합니다.", 409);
    totalQuestions += paper.questions.length;
    if (totalQuestions > MAX_SAVED_QUESTIONS) fail("한 번에 최대 400문항까지 저장할 수 있습니다.", 413);
    paper.questions.forEach((question, questionIndex) => {
      validateQuestionObject(question, i, questionIndex);
      if (seenUids.has(question.questionUid)) fail("시험지 묶음 안에 중복 문항이 있습니다.", 409);
      seenUids.add(question.questionUid);
    });
    const expectedUids = paper.questions.map((question) => question.questionUid);
    if (!Array.isArray(paper.meta.questionUids) || stableStringify(paper.meta.questionUids) !== stableStringify(expectedUids))
      fail("문항 순서와 출력 설정의 UID 목록이 다릅니다.", 409);
  }
  const currentCatalog = await validateApprovedMixedQuestions(
    env,
    input.papers.flatMap((paper) => paper.questions),
    {
      index_version: input.index_version,
      selection_filters: selectionFilters,
      include_extended: input.include_extended === true,
    },
  );
  const currentIndexVersion = currentCatalog.indexVersion;
  const sourceGradeByUid = new Map(
    currentCatalog.records
      .filter((record) => record.questionUid)
      .map((record) => [record.questionUid, record.sourceGrade]),
  );
  for (const paper of input.papers) {
    for (const question of paper.questions) {
      const sourceGrade = sourceGradeByUid.get(question.questionUid);
      if (!core.gradeRank(sourceGrade))
        fail("저장한 시험지 source grade를 확인할 수 없습니다.", 409);
      const identity = currentCatalog.canonicalAuthority.identityByUid?.[question.questionUid];
      const sourceFile = core.normalizeFile(question.sourceArchiveFile || question.sourceFile);
      const identitySourceFile = core.normalizeFile(identity?.sourceArchiveFile);
      if (
        identity?.status !== "VERIFIED" ||
        String(identity.questionUid || question.questionUid) !== String(question.questionUid) ||
        identitySourceFile !== sourceFile ||
        Number(identity.sourceOrdinal) !== Number(question.sourceOrdinal)
      ) fail("저장한 시험지 source identity를 확인할 수 없습니다.", 409);
      question.sourceGrade = sourceGrade;
      question.sourceIdentityEvidence = {
        schemaVersion: "archive2-saved-source-identity-v1",
        status: "VERIFIED",
        questionUid: question.questionUid,
        sourceFile,
        sourceOrdinal: Number(question.sourceOrdinal),
        identitySourceFile,
        sourceGrade,
      };
    }
  }
  // Keep the exact image bytes inside the immutable snapshot. Source asset
  // paths are stable filenames, so saving only the URL would allow a later
  // asset replacement to silently change an already saved paper.
  await embedSavedPaperAssets(env, input.papers.flatMap((paper) => paper.questions));

  for (let i = 0; i < input.papers.length; i++) {
    const paper = input.papers[i];
    const expectedUids = paper.questions.map((question) => question.questionUid);
    const title = String(paper.meta.title || paper.meta.printHeaderOptions?.title || "").trim();
    if (!title || title.length > 150) fail("시험지 제목을 1~150자로 입력해 주세요.", 409);
    const qpp = Number(paper.meta.qpp || 4);
    if (![4, 6, 8].includes(qpp)) fail("출력 쪽당 문항 수를 확인해 주세요.", 409);
    const meta = {
      ...paper.meta,
      title,
      count: paper.questions.length,
      grade: selectionFilters.grade,
      subject: core.subjectProjectionLabel(selectionFilters) || selectionFilters.courseKey || "",
      questionUids: expectedUids,
      printHeaderOptions: output.normalize(paper.meta.printHeaderOptions || paper.meta.header || {}, title),
      includeQr: paper.meta.includeQr === true,
      qpp,
      sourceType: "mixed",
      indexVersion: currentIndexVersion,
    };
    const bridgeRows = await buildQuestionSnapshot(
      { question_count: paper.questions.length },
      paper.questions,
      meta,
      { canonicalAuthority: currentCatalog.canonicalAuthority },
    );
    const snapshot = {
      questions: paper.questions,
      meta,
      bridgeRows,
      selectionFilters,
      verifiedAt: new Date().toISOString(),
    };
    const snapshotJson = stableStringify(snapshot);
    const size = byteLength(snapshotJson);
    if (size > MAX_SAVED_PAPER_BYTES)
      fail(`${i + 1}권 데이터가 저장 한도(1,500,000바이트)를 넘었습니다.`, 413);
    prepared.push({
      part_index: i,
      title,
      grade: meta.grade,
      subject: meta.subject,
      question_count: paper.questions.length,
      snapshot_json: snapshotJson,
      snapshot_hash: await sha256hex(snapshotJson),
      snapshot_bytes: size,
      schema_version: SAVED_PAPER_SCHEMA,
      source_index_version: currentIndexVersion,
    });
  }

  if (byteLength(stableStringify(input)) > MAX_SAVED_BATCH_BYTES)
    fail("저장 요청 전체가 8,000,000바이트를 넘었습니다.", 413);
  return {
    requestHash,
    currentIndexVersion,
    selectionFilters,
    totalQuestions,
    papers: prepared,
  };
}

export async function readAndVerifySavedSnapshot(row) {
  if (!row || row.schema_version !== SAVED_PAPER_SCHEMA)
    fail("저장한 시험지 형식을 확인할 수 없습니다.", 409);
  let snapshot;
  try {
    snapshot = JSON.parse(row.snapshot_json);
  } catch {
    fail("저장한 시험지 데이터를 읽을 수 없습니다.", 409);
  }
  if (
    !isPlainObject(snapshot) ||
    !Array.isArray(snapshot.questions) ||
    !isPlainObject(snapshot.meta) ||
    !Array.isArray(snapshot.bridgeRows) ||
    !isPlainObject(snapshot.selectionFilters) ||
    snapshot.bridgeRows.length !== Number(row.question_count) ||
    snapshot.questions.length !== Number(row.question_count) ||
    ![4, 6, 8].includes(Number(snapshot.meta.qpp)) ||
    String(snapshot.meta.title || "") !== String(row.title || "") ||
    String(snapshot.meta.grade || "") !== String(row.grade || "") ||
    stableStringify(snapshot.meta.questionUids) !== stableStringify(snapshot.questions.map((question) => question.questionUid)) ||
    stableStringify(snapshot.bridgeRows.map((bridge) => bridge.question_uid)) !== stableStringify(snapshot.questions.map((question) => question.questionUid)) ||
    (await sha256hex(stableStringify(snapshot))) !== row.snapshot_hash
  ) fail("저장한 시험지 snapshot 검증에 실패했습니다.", 409);
  return snapshot;
}
