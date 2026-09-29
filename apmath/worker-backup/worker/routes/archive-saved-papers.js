import { isStaffUser } from "../helpers/foundation-db.js";
import { jsonResponse } from "../helpers/response.js";
import { fail } from "../helpers/archive2-questions.js";
import {
  MAX_SAVED_BATCH_BYTES,
  MAX_SAVED_PAPERS,
  SAVED_PAPER_BATCH_ID,
  SAVED_PAPER_SCHEMA,
  computeSavedPaperRequestHash,
  prepareSavedPaperBatch,
  readAndVerifySavedSnapshot,
} from "../helpers/archive-saved-papers.js";

const CAPABILITY_CACHE = new WeakMap();

function privateJson(data, status = 200) {
  const response = jsonResponse(data, status);
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store, max-age=0");
  headers.set("Pragma", "no-cache");
  return new Response(response.body, { status: response.status, headers });
}

async function hasSavedPaperTable(env) {
  if (!CAPABILITY_CACHE.has(env)) {
    CAPABILITY_CACHE.set(env, env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='archive_saved_papers'",
    ).first().then(Boolean).catch(() => false));
  }
  return CAPABILITY_CACHE.get(env);
}

async function readBoundedJson(request) {
  if (!request.body) fail("JSON body required", 400);
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  if (contentLength > MAX_SAVED_BATCH_BYTES) fail("요청 크기가 8,000,000바이트를 넘습니다.", 413);
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let raw = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_SAVED_BATCH_BYTES) {
        await reader.cancel();
        fail("요청 크기가 8,000,000바이트를 넘습니다.", 413);
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(raw);
  } catch {
    fail("invalid JSON", 400);
  }
}

function listRow(row) {
  return {
    id: row.id,
    title: row.title,
    question_count: Number(row.question_count),
    grade: row.grade,
    subject: row.subject,
    part_index: Number(row.part_index),
    part_count: Number(row.part_count),
    save_batch_id: row.save_batch_id,
    created_at: row.created_at,
  };
}

function cursorEncode(row) {
  return btoa(JSON.stringify([row.created_at, row.id]))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function cursorDecode(value) {
  if (!value) return null;
  try {
    const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
    const parsed = JSON.parse(atob(normalized + "=".repeat((4 - normalized.length % 4) % 4)));
    if (!Array.isArray(parsed) || parsed.length !== 2 || parsed.some((part) => typeof part !== "string" || part.length > 200))
      fail("invalid cursor", 400);
    return parsed;
  } catch (error) {
    if (error.status) throw error;
    fail("invalid cursor", 400);
  }
}

async function handleCreate(request, env, teacher) {
  const input = await readBoundedJson(request);
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("JSON object required", 400);
  const requestHash = await computeSavedPaperRequestHash(input);
  const existing = await env.DB.prepare(
    "SELECT * FROM archive_saved_papers WHERE owner_teacher_id=? AND save_batch_id=? ORDER BY part_index",
  ).bind(teacher.id, input.save_batch_id).all();
  const prior = existing.results || [];
  const matchPrior = () => prior.length === input.papers.length &&
    prior.every((row, index) => Number(row.part_index) === index &&
      Number(row.part_count) === input.papers.length &&
      row.save_request_hash === requestHash &&
      row.schema_version === SAVED_PAPER_SCHEMA);
  if (prior.length) {
    if (!matchPrior()) fail("save_batch_id was already used for different paper content", 409);
    return privateJson({ success: true, saved: true, idempotent: true, papers: prior.map(listRow) });
  }
  const prepared = await prepareSavedPaperBatch(env, input);
  if (prepared.requestHash !== requestHash) fail("save request changed during validation", 409);

  const createdAt = new Date().toISOString();
  const statements = prepared.papers.map((paper) => env.DB.prepare(`
    INSERT INTO archive_saved_papers (
      id, owner_teacher_id, save_batch_id, part_index, part_count, title, grade, subject,
      question_count, snapshot_json, snapshot_hash, save_request_hash,
      source_index_version, schema_version, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(), teacher.id, input.save_batch_id, paper.part_index,
    prepared.papers.length, paper.title, paper.grade, paper.subject,
    paper.question_count, paper.snapshot_json, paper.snapshot_hash,
    prepared.requestHash, paper.source_index_version, paper.schema_version, createdAt,
  ));
  try {
    await env.DB.batch(statements);
  } catch (error) {
    // Concurrent retries can race at the unique owner/batch/part key. Return
    // the committed IDs only when the winning request has the same full hash.
    const raced = await env.DB.prepare(
      "SELECT * FROM archive_saved_papers WHERE owner_teacher_id=? AND save_batch_id=? ORDER BY part_index",
    ).bind(teacher.id, input.save_batch_id).all().catch(() => ({ results: [] }));
    const rows = raced.results || [];
    if (rows.length === input.papers.length && rows.every((row, index) =>
      Number(row.part_index) === index && Number(row.part_count) === input.papers.length &&
      row.save_request_hash === requestHash && row.schema_version === SAVED_PAPER_SCHEMA)) {
      return privateJson({ success: true, saved: true, idempotent: true, papers: rows.map(listRow) });
    }
    throw error;
  }
  const created = await env.DB.prepare(
    "SELECT * FROM archive_saved_papers WHERE owner_teacher_id=? AND save_batch_id=? ORDER BY part_index",
  ).bind(teacher.id, input.save_batch_id).all();
  const rows = created.results || [];
  if (rows.length !== input.papers.length) fail("시험지 저장 결과를 확인하지 못했습니다.", 500);
  return privateJson({ success: true, saved: true, idempotent: false, papers: rows.map(listRow) });
}

async function handleList(url, env, teacher) {
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw === null ? 20 : Number(limitRaw);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) fail("limit must be 1~50", 400);
  const query = String(url.searchParams.get("q") || "").trim().slice(0, 100);
  const cursor = cursorDecode(url.searchParams.get("cursor"));
  const where = ["owner_teacher_id=?", "deleted_at IS NULL"];
  const params = [teacher.id];
  if (query) {
    where.push("title LIKE ? ESCAPE '\\'");
    params.push(`%${query.replace(/[\\%_]/g, "\\$&")}%`);
  }
  if (cursor) {
    where.push("(created_at < ? OR (created_at = ? AND id < ?))");
    params.push(cursor[0], cursor[0], cursor[1]);
  }
  params.push(limit + 1);
  const result = await env.DB.prepare(`
    SELECT id,title,question_count,grade,subject,part_index,part_count,save_batch_id,created_at
    FROM archive_saved_papers WHERE ${where.join(" AND ")}
    ORDER BY created_at DESC,id DESC LIMIT ?
  `).bind(...params).all();
  const found = result.results || [];
  const hasMore = found.length > limit;
  const rows = found.slice(0, limit);
  return privateJson({
    success: true,
    papers: rows.map(listRow),
    next_cursor: hasMore ? cursorEncode(rows[rows.length - 1]) : null,
  });
}

async function handleDetail(id, env, teacher) {
  if (!SAVED_PAPER_BATCH_ID.test(id)) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const row = await env.DB.prepare(
    "SELECT * FROM archive_saved_papers WHERE id=? AND owner_teacher_id=? AND deleted_at IS NULL LIMIT 1",
  ).bind(id, teacher.id).first();
  if (!row) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const snapshot = await readAndVerifySavedSnapshot(row);
  return privateJson({
    success: true,
    paper: {
      ...listRow(row),
      snapshot_hash: row.snapshot_hash,
      schema_version: row.schema_version,
      source_index_version: row.source_index_version,
      snapshot,
    },
  });
}

async function handleDelete(id, env, teacher) {
  if (!SAVED_PAPER_BATCH_ID.test(id)) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const result = await env.DB.prepare(
    "UPDATE archive_saved_papers SET deleted_at=? WHERE id=? AND owner_teacher_id=? AND deleted_at IS NULL",
  ).bind(new Date().toISOString(), id, teacher.id).run();
  if (!result.meta?.changes) {
    const alreadyDeleted = await env.DB.prepare(
      "SELECT id FROM archive_saved_papers WHERE id=? AND owner_teacher_id=? AND deleted_at IS NOT NULL LIMIT 1",
    ).bind(id, teacher.id).first();
    if (!alreadyDeleted) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  }
  return privateJson({ success: true, deleted: true, note: "이미 배포된 학생 시험지는 유지됩니다." });
}

export async function handleArchiveSavedPapers(request, env, teacher, path, url) {
  try {
    if (!isStaffUser(teacher)) fail("Forbidden", teacher ? 403 : 401);
    if (env.ARCHIVE2_ENABLED !== "true") fail("Archive 2.0 server 기능이 아직 활성화되지 않았습니다.", 503);
    if (!(await hasSavedPaperTable(env))) fail("저장한 시험지 DB migration이 적용되지 않았습니다.", 503);
    const method = request.method.toUpperCase();
    const id = String(path[2] || "");
    if (!id && method === "POST") return await handleCreate(request, env, teacher);
    if (!id && method === "GET") return await handleList(url, env, teacher);
    if (id && method === "GET") return await handleDetail(id, env, teacher);
    if (id && method === "DELETE") return await handleDelete(id, env, teacher);
    fail("Method not allowed", 405);
  } catch (error) {
    const status = Number(error.status) || (/UNIQUE constraint|SNAPSHOT_CONFLICT/.test(error.message) ? 409 : /no such table|no such column/.test(error.message) ? 503 : 500);
    const code = status === 401 ? "UNAUTHORIZED" : status === 403 ? "FORBIDDEN" : status === 404 ? "NOT_FOUND" : status === 409 ? "VALIDATION_CONFLICT" : status === 413 ? "PAYLOAD_TOO_LARGE" : status === 503 ? "MIGRATION_REQUIRED" : status === 405 ? "METHOD_NOT_ALLOWED" : "INTERNAL_ERROR";
    return privateJson({ success: false, code, error: error.message || "저장한 시험지 요청을 처리하지 못했습니다." }, status);
  }
}
