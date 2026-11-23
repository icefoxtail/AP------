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
    filters.primaryPaths.length > 2000 ||
    filters.primaryPaths.some((path) => typeof path !== "string" || !path.trim()) ||
    (filters.primaryPaths.length === 0 &&
      (!Array.isArray(filters.sourceFiles) || filters.sourceFiles.length === 0 ||
        filters.sourceFiles.some((file) => typeof file !== "string" || !file.trim())))
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

// Questions per page a saved paper may print with. Same set as the screen (archive2-output.js supportedQpp) and as
// routes/archive2.js, routes/exams.js and routes/exam-pdf.js, so a paper that saves can also be assigned and printed.
const SAVED_PAPER_QPP_VALUES = [1, 2, 4, 6, 8];

// "1권 3번 문항" style position of a question, as the teacher counts them (1-based).
function questionPlace(partIndex, questionIndex) {
  return `${partIndex + 1}권 ${questionIndex + 1}번 문항`;
}

// validateApprovedMixedQuestions() reports the 0-based position of the rejected question in the flattened list. Map it
// back to "N권 M번 문항" and put it in front of the Korean reason. A reason that is not Korean (a field name, a code) is
// not shown as it is; the teacher gets a plain sentence instead.
function withQuestionPlace(error, papers) {
  const flat = error?.questionIndex;
  if (!Number.isInteger(flat) || flat < 0) return error;
  let rest = flat;
  for (let p = 0; p < papers.length; p++) {
    const count = papers[p].questions.length;
    if (rest < count) {
      const place = questionPlace(p, rest);
      const reason = String(error.message || "");
      const wrapped = new Error(
        /[가-힣]/.test(reason) ? `${place}: ${reason}` : `${place}의 분류 정보가 승인된 값과 다릅니다.`,
      );
      wrapped.status = error.status;
      wrapped.questionIndex = flat;
      return wrapped;
    }
    rest -= count;
  }
  return error;
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

// Exam images are served from Cloudflare R2 (public custom domain), NOT from the Pages site: the Pages package no
// longer ships archive/assets/images (tools/archive-pages-release-manifest.json). Same key mapping as the browsers'
// archive/archive-asset-base.js: assets/images/<key> -> <base>/exams/images/<encoded key>. The Worker fetches
// server-side, so no CORS is involved. Set EXAM_IMAGE_BASE_URL to "" to read the Pages copy instead (rollback:
// re-include the images in the Pages package first, see tools/r2/EXAM_IMAGE_BASE.md).
export const DEFAULT_EXAM_IMAGE_BASE_URL = "https://img.wangjiedu.com";
export function examImageR2Url(env, assetPath) {
  const configured = env && env.EXAM_IMAGE_BASE_URL !== undefined && env.EXAM_IMAGE_BASE_URL !== null
    ? env.EXAM_IMAGE_BASE_URL
    : DEFAULT_EXAM_IMAGE_BASE_URL;
  const base = String(configured).trim().replace(/\/+$/, "");
  if (!base) return null;
  const match = /^assets\/images\/(.+)$/i.exec(String(assetPath || ""));
  if (!match) return null;
  let key = match[1];
  try { key = decodeURIComponent(key); } catch { return null; }
  const parts = key.split("/");
  if (parts.length < 2 || parts.some((part) => !part || part === "." || part === "..")) return null;
  return new URL(`${base}/exams/images/${parts.map(encodeURIComponent).join("/")}`);
}

// Reads one source image (R2 first, Pages copy as the rollback path). Used to embed it (old format) and to check it (key refs).
async function fetchSourceAsset(env, path) {
  const base = String(
    env.ARCHIVE_PUBLIC_BASE_URL || "https://icefoxtail.github.io/AP------/archive",
  ).replace(/\/+$/, "") + "/";
  let response = null;
  const r2Url = examImageR2Url(env, path);
  if (r2Url) {
    try { response = await fetch(r2Url); } catch { response = null; }
    if (response && !response.ok) {
      try { await response.body?.cancel(); } catch { /* body already closed */ }
      response = null;
    }
  }
  if (!response) {
    // R2 unavailable (or EXAM_IMAGE_BASE_URL is ""): the Pages copy, which exists only after a rollback re-includes it.
    const url = new URL(path, base);
    response = env.ARCHIVE2_ASSETS
      ? await env.ARCHIVE2_ASSETS.fetch(url)
      : await fetch(url);
  }
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
  return { bytes, response };
}

const HTML_IMAGE_REF = /(\bsrc\s*=\s*)(["'])([^"']+)\2|url\(\s*(["']?)([^)"'\s]+)(["']?\s*\))/gi;
function questionAssetPaths(question) {
  const refs = [question.image, question.solutionImage];
  for (const field of ["content", "question", "solution"])
    if (typeof question[field] === "string") for (const match of question[field].matchAll(HTML_IMAGE_REF)) refs.push(match[3] || match[5]);
  return refs.filter((ref) => typeof ref === "string").map(sourceAssetPath).filter(Boolean);
}

async function sha256Bytes(bytes) {
  return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)), (b) => b.toString(16).padStart(2, "0")).join("");
}

// The saved paper keeps the exam image PATH in its text and records each image as { path, sha256, bytes } (a later asset
// replacement is then detectable). One list per paper. An image that cannot be read stops the whole save: no partial paper.
async function recordSavedPaperAssets(env, papers) {
  const known = new Map();
  for (const path of new Set(papers.flatMap((paper) => paper.questions.flatMap(questionAssetPaths)))) {
    const { bytes } = await fetchSourceAsset(env, path);
    known.set(path, { path, sha256: await sha256Bytes(bytes), bytes: bytes.byteLength });
  }
  return papers.map((paper) => [...new Set(paper.questions.flatMap(questionAssetPaths))].sort().map((path) => known.get(path)));
}

export async function prepareSavedPaperBatch(env, input, metadataAuthority = null) {
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
      if (seenUids.has(question.questionUid)) fail(`${questionPlace(i, questionIndex)}이 시험지 묶음 안의 다른 문항과 겹칩니다.`, 409);
      seenUids.add(question.questionUid);
    });
    const expectedUids = paper.questions.map((question) => question.questionUid);
    if (!Array.isArray(paper.meta.questionUids) || stableStringify(paper.meta.questionUids) !== stableStringify(expectedUids))
      fail("문항 순서와 출력 설정의 UID 목록이 다릅니다.", 409);
  }
  let currentCatalog;
  try {
    currentCatalog = await validateApprovedMixedQuestions(
      env,
      input.papers.flatMap((paper) => paper.questions),
      {
        index_version: input.index_version,
        selection_filters: selectionFilters,
        include_extended: input.include_extended === true,
      },
    );
  } catch (error) {
    throw withQuestionPlace(error, input.papers);
  }
  const currentIndexVersion = currentCatalog.indexVersion;
  const sourceGradeByUid = new Map(
    currentCatalog.records
      .filter((record) => record.questionUid)
      .map((record) => [record.questionUid, record.sourceGrade]),
  );
  for (const [paperIndex, paper] of input.papers.entries()) {
    for (const [questionIndex, question] of paper.questions.entries()) {
      const sourceGrade = sourceGradeByUid.get(question.questionUid);
      if (!core.gradeRank(sourceGrade))
        fail(`${questionPlace(paperIndex, questionIndex)}의 학년 정보를 확인할 수 없습니다.`, 409);
      const identity = currentCatalog.canonicalAuthority.identityByUid?.[question.questionUid];
      const sourceFile = core.normalizeFile(question.sourceArchiveFile || question.sourceFile);
      const identitySourceFile = core.normalizeFile(identity?.sourceArchiveFile);
      if (
        identity?.status !== "VERIFIED" ||
        String(identity.questionUid || question.questionUid) !== String(question.questionUid) ||
        identitySourceFile !== sourceFile ||
        Number(identity.sourceOrdinal) !== Number(question.sourceOrdinal)
      ) fail(`${questionPlace(paperIndex, questionIndex)}의 출처 정보를 확인할 수 없습니다.`, 409);
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
  // Images stay as paths in the text; their sha256 and size are recorded in the snapshot (see recordSavedPaperAssets).
  const assetsByPaper = await recordSavedPaperAssets(env, input.papers);

  for (let i = 0; i < input.papers.length; i++) {
    const paper = input.papers[i];
    const expectedUids = paper.questions.map((question) => question.questionUid);
    const title = String(paper.meta.title || paper.meta.printHeaderOptions?.title || "").trim();
    if (!title || title.length > 150) fail("시험지 제목을 1~150자로 입력해 주세요.", 409);
    const qpp = Number(paper.meta.qpp || 4);
    if (!SAVED_PAPER_QPP_VALUES.includes(qpp)) fail("출력 쪽당 문항 수를 확인해 주세요.", 409);
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
      { canonicalAuthority: currentCatalog.canonicalAuthority, metadataAuthority },
    );
    const snapshot = {
      questions: paper.questions,
      meta,
      bridgeRows,
      selectionFilters,
      assets: assetsByPaper[i],
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
    (snapshot.assets !== undefined && !validSnapshotAssets(snapshot.assets)) ||
    snapshot.bridgeRows.length !== Number(row.question_count) ||
    snapshot.questions.length !== Number(row.question_count) ||
    !SAVED_PAPER_QPP_VALUES.includes(Number(snapshot.meta.qpp)) ||
    String(snapshot.meta.title || "") !== String(row.title || "") ||
    String(snapshot.meta.grade || "") !== String(row.grade || "") ||
    stableStringify(snapshot.meta.questionUids) !== stableStringify(snapshot.questions.map((question) => question.questionUid)) ||
    stableStringify(snapshot.bridgeRows.map((bridge) => bridge.question_uid)) !== stableStringify(snapshot.questions.map((question) => question.questionUid)) ||
    (await sha256hex(stableStringify(snapshot))) !== row.snapshot_hash
  ) fail("저장한 시험지 snapshot 검증에 실패했습니다.", 409);
  return snapshot;
}

// Key-reference snapshots keep the exam image paths as they are and list every image they use as { path, sha256, bytes }.
// Old snapshots have no `assets` list (their images are embedded) and are read exactly as before.
const ASSET_SHA256 = /^[0-9a-f]{64}$/;
function validSnapshotAssets(assets) {
  try {
    return Array.isArray(assets) &&
      assets.every((asset) => isPlainObject(asset) && sourceAssetPath(asset.path) === asset.path &&
        ASSET_SHA256.test(String(asset.sha256)) && Number.isInteger(asset.bytes) && asset.bytes >= 0) &&
      new Set(assets.map((asset) => asset.path)).size === assets.length;
  } catch { return false; }
}
