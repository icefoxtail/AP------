import { isStaffUser } from "../helpers/foundation-db.js";
import { jsonResponse } from "../helpers/response.js";
import { fail } from "../helpers/archive2-questions.js";
import {
  MAX_SAVED_BATCH_BYTES,
  MAX_SAVED_PAPERS,
  SAVED_PAPER_BATCH_ID,
  SAVED_PAPER_SCHEMA,
  SAVED_PAPER_LIBRARY_STATES,
  computeSavedPaperRequestHash,
  computeSavedPaperCopyRequestHash,
  prepareSavedPaperBatch,
  readAndVerifySavedSnapshot,
  resolveSavedPaperLibraryStatus,
} from "../helpers/archive-saved-papers.js";

const CAPABILITY_CACHE = new WeakMap();
const LIBRARY_CAPABILITY_CACHE = new WeakMap();

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

async function hasSavedPaperLibraryMetadataTable(env) {
  if (!LIBRARY_CAPABILITY_CACHE.has(env)) {
    LIBRARY_CAPABILITY_CACHE.set(env, env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='archive_saved_paper_library_metadata'",
    ).first().then(Boolean).catch(() => false));
  }
  return LIBRARY_CAPABILITY_CACHE.get(env);
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
  const metadata = row.library_status === undefined
    ? null
    : { status: row.library_status };
  return {
    id: row.id,
    title: row.title,
    library_display_name: row.library_display_name || row.title,
    library_status: resolveSavedPaperLibraryStatus(row, metadata),
    legacy_tombstone: row.deleted_at !== null && row.deleted_at !== undefined,
    question_count: Number(row.question_count),
    grade: row.grade,
    subject: row.subject,
    part_index: Number(row.part_index),
    part_count: Number(row.part_count),
    save_batch_id: row.save_batch_id,
    created_at: row.created_at,
  };
}

async function loadSavedPapersByBatch(env, teacherId, batchId) {
  const result = await env.DB.prepare(
    "SELECT p.*,m.display_name AS library_display_name,m.status AS library_status " +
    "FROM archive_saved_papers p LEFT JOIN archive_saved_paper_library_metadata m " +
    "ON m.saved_paper_id=p.id AND m.owner_teacher_id=p.owner_teacher_id " +
    "WHERE p.owner_teacher_id=? AND p.save_batch_id=? ORDER BY p.part_index",
  ).bind(teacherId, batchId).all();
  return result.results || [];
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
  const prior = await loadSavedPapersByBatch(env, teacher.id, input.save_batch_id);
  const matchPrior = () => prior.length === input.papers.length &&
    prior.every((row, index) => Number(row.part_index) === index &&
      Number(row.part_count) === input.papers.length &&
      row.save_request_hash === requestHash &&
      row.schema_version === SAVED_PAPER_SCHEMA);
  if (prior.length) {
    if (!matchPrior()) fail("save_batch_id was already used for different paper content", 409);
    return privateJson({ success: true, saved: true, idempotent: true, papers: prior.map(listRow) });
  }
  const derivations = [];
  for (const paper of input.papers) {
    if (paper.lineage == null) {
      derivations.push(null);
      continue;
    }
    const lineage = paper.lineage;
    if (!lineage || typeof lineage !== "object" || Array.isArray(lineage) ||
        Object.keys(lineage).some(key => ![
          "parent_kind", "parent_id", "parent_revision", "parent_snapshot_hash", "derivation_type",
        ].includes(key)))
      fail("파생 시험지 계보 정보가 올바르지 않습니다.", 409);
    if (lineage.derivation_type === "COPY")
      fail("정확한 사본은 Saved Paper 복사 경로를 사용해 주세요.", 409);
    if (!["REVISION", "FORK"].includes(lineage.derivation_type))
      fail("invalid derivation_type", 409);
    if (lineage.parent_kind !== "SAVED_PAPER")
      fail("Shared/Common Paper 파생 저장은 현재 구현 범위 밖입니다.", 409);
    if (!SAVED_PAPER_BATCH_ID.test(String(lineage.parent_id || "")))
      fail("parent Saved Paper ID must be a UUID", 400);
    if (lineage.parent_revision != null && lineage.parent_revision !== "")
      fail("Saved Paper parent does not have a revision identity", 409);
    if (!/^[0-9a-f]{64}$/i.test(String(lineage.parent_snapshot_hash || "")))
      fail("parent snapshot hash is invalid", 400);
    const parent = await env.DB.prepare(
      "SELECT * FROM archive_saved_papers WHERE id=? AND owner_teacher_id=? LIMIT 1",
    ).bind(lineage.parent_id, teacher.id).first();
    if (!parent) fail("원본 저장 시험지를 찾을 수 없습니다.", 404);
    const parentMetadata = await env.DB.prepare(
      "SELECT * FROM archive_saved_paper_library_metadata WHERE saved_paper_id=? AND owner_teacher_id=? LIMIT 1",
    ).bind(parent.id, teacher.id).first();
    if (resolveSavedPaperLibraryStatus(parent, parentMetadata) === "TRASHED")
      fail("휴지통 시험지를 새 파생본의 원본으로 사용할 수 없습니다.", 404);
    if (String(parent.snapshot_hash).toLowerCase() !== String(lineage.parent_snapshot_hash).toLowerCase())
      fail("원본 Saved Paper snapshot이 변경되었거나 일치하지 않습니다.", 409);
    await readAndVerifySavedSnapshot(parent);
    derivations.push({
      parentKind: "SAVED_PAPER",
      parentId: parent.id,
      parentRevision: null,
      parentSnapshotHash: parent.snapshot_hash,
      derivationType: lineage.derivation_type,
    });
  }
  const prepared = await prepareSavedPaperBatch(env, input);
  if (prepared.requestHash !== requestHash) fail("save request changed during validation", 409);

  const createdAt = new Date().toISOString();
  const statements = [];
  for (const paper of prepared.papers) {
    const id = crypto.randomUUID();
    statements.push(env.DB.prepare(
      "INSERT INTO archive_saved_papers (id,owner_teacher_id,save_batch_id,part_index,part_count,title,grade,subject,question_count,snapshot_json,snapshot_hash,save_request_hash,source_index_version,schema_version,created_at) " +
      "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ).bind(
      id, teacher.id, input.save_batch_id, paper.part_index,
      prepared.papers.length, paper.title, paper.grade, paper.subject,
      paper.question_count, paper.snapshot_json, paper.snapshot_hash,
      prepared.requestHash, paper.source_index_version, paper.schema_version, createdAt,
    ));
    statements.push(env.DB.prepare(
      "INSERT INTO archive_saved_paper_library_metadata (saved_paper_id,owner_teacher_id,status,created_at,updated_at) " +
      "VALUES (?,?,'ACTIVE',?,?)",
    ).bind(id, teacher.id, createdAt, createdAt));
    const lineage = derivations[paper.part_index];
    if (lineage) statements.push(env.DB.prepare(
      "INSERT INTO archive_saved_paper_lineage (child_saved_paper_id,parent_kind,parent_id,parent_revision,parent_snapshot_hash,derivation_type,created_at) " +
      "VALUES (?,?,?,?,?,?,?)",
    ).bind(
      id, lineage.parentKind, lineage.parentId, lineage.parentRevision,
      lineage.parentSnapshotHash, lineage.derivationType, createdAt,
    ));
  }
  try {
    await env.DB.batch(statements);
  } catch (error) {
    // Concurrent retries can race at the unique owner/batch/part key. Return
    // the committed IDs only when the winning request has the same full hash.
    const raced = await loadSavedPapersByBatch(env, teacher.id, input.save_batch_id)
      .catch(() => []);
    if (raced.length === input.papers.length && raced.every((row, index) =>
      Number(row.part_index) === index && Number(row.part_count) === input.papers.length &&
      row.save_request_hash === requestHash && row.schema_version === SAVED_PAPER_SCHEMA)) {
      return privateJson({ success: true, saved: true, idempotent: true, papers: raced.map(listRow) });
    }
    throw error;
  }
  const rows = await loadSavedPapersByBatch(env, teacher.id, input.save_batch_id);
  if (rows.length !== input.papers.length) fail("시험지 저장 결과를 확인하지 못했습니다.", 500);
  return privateJson({ success: true, saved: true, idempotent: false, papers: rows.map(listRow) });
}

async function handleCopy(id, request, env, teacher) {
  if (!SAVED_PAPER_BATCH_ID.test(id)) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const input = await readBoundedJson(request);
  if (!input || typeof input !== "object" || Array.isArray(input) ||
      Object.keys(input).some(key => !["save_batch_id", "expected_snapshot_hash"].includes(key)))
    fail("사본 요청 형식이 올바르지 않습니다.", 400);
  const requestHash = await computeSavedPaperCopyRequestHash({
    save_batch_id: input.save_batch_id,
    parent_id: id,
    parent_snapshot_hash: input.expected_snapshot_hash,
  });
  const prior = await loadSavedPapersByBatch(env, teacher.id, input.save_batch_id);
  if (prior.length) {
    const sameCopy = prior.length === 1 && Number(prior[0].part_index) === 0 &&
      Number(prior[0].part_count) === 1 && prior[0].save_request_hash === requestHash;
    const lineage = sameCopy ? await env.DB.prepare(
      "SELECT * FROM archive_saved_paper_lineage WHERE child_saved_paper_id=? LIMIT 1",
    ).bind(prior[0].id).first() : null;
    if (!sameCopy || lineage?.parent_kind !== "SAVED_PAPER" || lineage.parent_id !== id ||
        String(lineage.parent_snapshot_hash || "").toLowerCase() !== String(input.expected_snapshot_hash).toLowerCase() ||
        lineage.derivation_type !== "COPY")
      fail("save_batch_id was already used for a different operation", 409);
    return privateJson({ success: true, saved: true, idempotent: true, papers: prior.map(listRow) });
  }

  const parent = await env.DB.prepare(
    "SELECT * FROM archive_saved_papers WHERE id=? AND owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  if (!parent) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const parentMetadata = await env.DB.prepare(
    "SELECT * FROM archive_saved_paper_library_metadata WHERE saved_paper_id=? AND owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  if (resolveSavedPaperLibraryStatus(parent, parentMetadata) === "TRASHED")
    fail("휴지통 시험지는 복사할 수 없습니다.", 404);
  if (String(parent.snapshot_hash).toLowerCase() !== String(input.expected_snapshot_hash).toLowerCase())
    fail("원본 Saved Paper snapshot이 변경되었거나 일치하지 않습니다.", 409);
  await readAndVerifySavedSnapshot(parent);

  const now = new Date().toISOString();
  const idCopy = crypto.randomUUID();
  const displayName = (parentMetadata?.display_name || parent.title || "저장한 시험지").slice(0, 140) + " (복사본)";
  const statements = [
    env.DB.prepare(
      "INSERT INTO archive_saved_papers (id,owner_teacher_id,save_batch_id,part_index,part_count,title,grade,subject,question_count,snapshot_json,snapshot_hash,save_request_hash,source_index_version,schema_version,created_at) " +
      "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ).bind(
      idCopy, teacher.id, input.save_batch_id, 0, 1, parent.title, parent.grade,
      parent.subject, parent.question_count, parent.snapshot_json, parent.snapshot_hash,
      requestHash, parent.source_index_version, parent.schema_version, now,
    ),
    env.DB.prepare(
      "INSERT INTO archive_saved_paper_library_metadata (saved_paper_id,owner_teacher_id,display_name,status,created_at,updated_at) " +
      "VALUES (?,?,?,'ACTIVE',?,?)",
    ).bind(idCopy, teacher.id, displayName, now, now),
    env.DB.prepare(
      "INSERT INTO archive_saved_paper_lineage (child_saved_paper_id,parent_kind,parent_id,parent_revision,parent_snapshot_hash,derivation_type,created_at) " +
      "VALUES (?,'SAVED_PAPER',?,?,?,'COPY',?)",
    ).bind(idCopy, id, null, parent.snapshot_hash, now),
  ];
  try {
    await env.DB.batch(statements);
  } catch (error) {
    const raced = await loadSavedPapersByBatch(env, teacher.id, input.save_batch_id).catch(() => []);
    const lineage = raced.length === 1 ? await env.DB.prepare(
      "SELECT * FROM archive_saved_paper_lineage WHERE child_saved_paper_id=? LIMIT 1",
    ).bind(raced[0].id).first().catch(() => null) : null;
    if (raced.length === 1 && raced[0].save_request_hash === requestHash &&
        lineage?.parent_kind === "SAVED_PAPER" && lineage.parent_id === id &&
        lineage.derivation_type === "COPY")
      return privateJson({ success: true, saved: true, idempotent: true, papers: raced.map(listRow) });
    throw error;
  }
  const rows = await loadSavedPapersByBatch(env, teacher.id, input.save_batch_id);
  if (rows.length !== 1) fail("시험지 복사 결과를 확인하지 못했습니다.", 500);
  return privateJson({ success: true, saved: true, idempotent: false, papers: rows.map(listRow) });
}

async function handleSaveBatchStatus(batchId, env, teacher) {
  if (!SAVED_PAPER_BATCH_ID.test(batchId)) fail("save_batch_id must be a UUID", 400);
  const rows = await loadSavedPapersByBatch(env, teacher.id, batchId);
  if (!rows.length) return privateJson({ success: true, found: false, saved: false, papers: [] });
  const expectedCount = Number(rows[0].part_count);
  const complete = rows.length === expectedCount && rows.every((row, index) =>
    Number(row.part_index) === index && Number(row.part_count) === expectedCount &&
    row.schema_version === SAVED_PAPER_SCHEMA);
  if (!complete) fail("저장 요청 결과가 완성된 batch와 일치하지 않습니다.", 409);
  return privateJson({ success: true, found: true, saved: true, idempotent: true, papers: rows.map(listRow) });
}

async function handleList(url, env, teacher) {
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw === null ? 20 : Number(limitRaw);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) fail("limit must be 1~50", 400);
  const query = String(url.searchParams.get("q") || "").trim().slice(0, 100);
  const requestedStatus = String(url.searchParams.get("status") || "ACTIVE").toUpperCase();
  if (!SAVED_PAPER_LIBRARY_STATES.includes(requestedStatus)) fail("invalid library status", 400);
  let cursor = cursorDecode(url.searchParams.get("cursor"));
  const papers = [];
  let hasMore = false;
  let nextCursor = null;

  while (papers.length < limit) {
    const where = ["p.owner_teacher_id=?"];
    const params = [teacher.id];
    if (query) {
      const escaped = "%" + query.replace(/[!%_]/g, "!$&") + "%";
      where.push("(p.title LIKE ? ESCAPE '!' OR COALESCE(m.display_name,p.title) LIKE ? ESCAPE '!')");
      params.push(escaped, escaped);
    }
    if (cursor) {
      where.push("(p.created_at < ? OR (p.created_at = ? AND p.id < ?))");
      params.push(cursor[0], cursor[0], cursor[1]);
    }
    params.push(limit + 1);
    const result = await env.DB.prepare(
      "SELECT p.*,m.display_name AS library_display_name,m.status AS library_status " +
      "FROM archive_saved_papers p LEFT JOIN archive_saved_paper_library_metadata m " +
      "ON m.saved_paper_id=p.id AND m.owner_teacher_id=p.owner_teacher_id " +
      "WHERE " + where.join(" AND ") + " ORDER BY p.created_at DESC,p.id DESC LIMIT ?",
    ).bind(...params).all();
    const found = result.results || [];
    if (!found.length) break;
    const scan = found.slice(0, limit);
    for (let index = 0; index < scan.length; index++) {
      const row = scan[index];
      cursor = [String(row.created_at), String(row.id)];
      const metadata = row.library_status == null ? null : { status: row.library_status };
      if (resolveSavedPaperLibraryStatus(row, metadata) === requestedStatus) papers.push(listRow(row));
      if (papers.length === limit) {
        hasMore = index < scan.length - 1 || found.length > scan.length;
        nextCursor = cursorEncode(row);
        break;
      }
    }
    if (papers.length === limit) break;
    if (found.length <= limit) break;
    cursor = [String(scan.at(-1).created_at), String(scan.at(-1).id)];
  }

  return privateJson({ success: true, papers, next_cursor: hasMore ? nextCursor : null });
}

async function handleDetail(id, env, teacher) {
  if (!SAVED_PAPER_BATCH_ID.test(id)) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const row = await env.DB.prepare(
    "SELECT p.*,m.display_name AS library_display_name,m.status AS library_status " +
    "FROM archive_saved_papers p LEFT JOIN archive_saved_paper_library_metadata m " +
    "ON m.saved_paper_id=p.id AND m.owner_teacher_id=p.owner_teacher_id " +
    "WHERE p.id=? AND p.owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  if (!row || resolveSavedPaperLibraryStatus(row, row?.library_status == null
    ? null
    : { status: row.library_status }) === "TRASHED")
    fail("저장한 시험지를 찾을 수 없습니다.", 404);
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

async function handleLibraryUpdate(id, request, env, teacher) {
  if (!SAVED_PAPER_BATCH_ID.test(id)) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const input = await readBoundedJson(request);
  if (!input || typeof input !== "object" || Array.isArray(input)) fail("JSON object required", 400);
  const allowed = new Set(["display_name", "status"]);
  if (Object.keys(input).length === 0 || Object.keys(input).some(key => !allowed.has(key)))
    fail("허용되지 않은 보관함 정보입니다.", 400);
  const paper = await env.DB.prepare(
    "SELECT * FROM archive_saved_papers WHERE id=? AND owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  if (!paper) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const currentMetadata = await env.DB.prepare(
    "SELECT * FROM archive_saved_paper_library_metadata WHERE saved_paper_id=? AND owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  const currentStatus = resolveSavedPaperLibraryStatus(paper, currentMetadata);
  if (paper.deleted_at !== null && paper.deleted_at !== undefined) {
    if (input.status && input.status !== "TRASHED")
      fail("legacy tombstone은 이 Campaign에서 복구할 수 없습니다.", 409);
    fail("legacy tombstone 보관 정보는 이 Campaign에서 변경할 수 없습니다.", 409);
  }
  const nextStatus = input.status === undefined ? currentStatus : String(input.status);
  if (!SAVED_PAPER_LIBRARY_STATES.includes(nextStatus)) fail("invalid library status", 400);
  let displayName;
  if (Object.hasOwn(input, "display_name")) {
    if (input.display_name === null || (typeof input.display_name === "string" && !input.display_name.trim()))
      displayName = null;
    else if (typeof input.display_name === "string" && input.display_name.trim().length <= 150)
      displayName = input.display_name.trim();
    else fail("보관함 표시 이름은 150자 이하로 입력해 주세요.", 400);
  }
  const updatedAt = new Date().toISOString();
  if (currentMetadata) {
    const sets = ["status=?", "updated_at=?"];
    const values = [nextStatus, updatedAt];
    if (Object.hasOwn(input, "display_name")) {
      sets.push("display_name=?");
      values.push(displayName);
    }
    values.push(id, teacher.id);
    await env.DB.prepare(
      "UPDATE archive_saved_paper_library_metadata SET " + sets.join(",") +
      " WHERE saved_paper_id=? AND owner_teacher_id=?",
    ).bind(...values).run();
  } else {
    await env.DB.prepare(
      "INSERT INTO archive_saved_paper_library_metadata (saved_paper_id,owner_teacher_id,display_name,status,created_at,updated_at) VALUES (?,?,?,?,?,?)",
    ).bind(id, teacher.id, Object.hasOwn(input, "display_name") ? displayName : null, nextStatus, updatedAt, updatedAt).run();
  }
  const updated = await env.DB.prepare(
    "SELECT p.*,m.display_name AS library_display_name,m.status AS library_status " +
    "FROM archive_saved_papers p LEFT JOIN archive_saved_paper_library_metadata m " +
    "ON m.saved_paper_id=p.id AND m.owner_teacher_id=p.owner_teacher_id " +
    "WHERE p.id=? AND p.owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  return privateJson({ success: true, paper: listRow(updated) });
}

async function handleDelete(id, env, teacher) {
  if (!SAVED_PAPER_BATCH_ID.test(id)) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  const paper = await env.DB.prepare(
    "SELECT * FROM archive_saved_papers WHERE id=? AND owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  if (!paper) fail("저장한 시험지를 찾을 수 없습니다.", 404);
  if (paper.deleted_at !== null && paper.deleted_at !== undefined)
    return privateJson({ success: true, deleted: true, library_status: "TRASHED", legacy_tombstone: true,
      note: "legacy tombstone은 복구할 수 없으며 이미 배포된 학생 시험지는 유지됩니다." });
  const metadata = await env.DB.prepare(
    "SELECT * FROM archive_saved_paper_library_metadata WHERE saved_paper_id=? AND owner_teacher_id=? LIMIT 1",
  ).bind(id, teacher.id).first();
  if (metadata) {
    await env.DB.prepare(
      "UPDATE archive_saved_paper_library_metadata SET status='TRASHED',updated_at=? WHERE saved_paper_id=? AND owner_teacher_id=?",
    ).bind(new Date().toISOString(), id, teacher.id).run();
  } else {
    const now = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO archive_saved_paper_library_metadata (saved_paper_id,owner_teacher_id,status,created_at,updated_at) VALUES (?,?,'TRASHED',?,?)",
    ).bind(id, teacher.id, now, now).run();
  }
  return privateJson({ success: true, deleted: true, library_status: "TRASHED",
    note: "이미 배포된 학생 시험지는 유지됩니다." });
}

export async function handleArchiveSavedPapers(request, env, teacher, path, url) {
  try {
    if (!isStaffUser(teacher)) fail("Forbidden", teacher ? 403 : 401);
    if (env.ARCHIVE2_ENABLED !== "true") fail("Archive 2.0 server 기능이 아직 활성화되지 않았습니다.", 503);
    if (!(await hasSavedPaperTable(env))) fail("저장한 시험지 DB migration이 적용되지 않았습니다.", 503);
    if (!(await hasSavedPaperLibraryMetadataTable(env)))
      fail("Paper Lifecycle library metadata migration이 적용되지 않았습니다.", 503);
    const method = request.method.toUpperCase();
    const id = String(path[2] || "");
    const subresource = String(path[3] || "");
    if (id === "save-batches" && subresource && method === "GET")
      return await handleSaveBatchStatus(subresource, env, teacher);
    if (id && subresource === "copy" && method === "POST")
      return await handleCopy(id, request, env, teacher);
    if (id && subresource === "library" && method === "PATCH")
      return await handleLibraryUpdate(id, request, env, teacher);
    if (!id && method === "POST") return await handleCreate(request, env, teacher);
    if (!id && method === "GET") return await handleList(url, env, teacher);
    if (id && !subresource && method === "GET") return await handleDetail(id, env, teacher);
    if (id && !subresource && method === "DELETE") return await handleDelete(id, env, teacher);
    fail("Method not allowed", 405);
  } catch (error) {
    const status = Number(error.status) || (/UNIQUE constraint|SNAPSHOT_CONFLICT/.test(error.message) ? 409 : /no such table|no such column/.test(error.message) ? 503 : 500);
    const code = status === 401 ? "UNAUTHORIZED" : status === 403 ? "FORBIDDEN" : status === 404 ? "NOT_FOUND" : status === 409 ? "VALIDATION_CONFLICT" : status === 413 ? "PAYLOAD_TOO_LARGE" : status === 503 ? "MIGRATION_REQUIRED" : status === 405 ? "METHOD_NOT_ALLOWED" : "INTERNAL_ERROR";
    return privateJson({ success: false, code, error: error.message || "저장한 시험지 요청을 처리하지 못했습니다." }, status);
  }
}
