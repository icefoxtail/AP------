import { sha256hex } from "./admin-db.js";
import { canAccessStudentsBatch } from "./foundation-db.js";
import core from "../../../../archive/archive2-core.js";

export const ARCHIVE2_CONTRACT = "archive2-v1";
const UID = /^qid_v1_[a-f0-9]{64}$/;
const norm = (value) =>
  String(value ?? "")
    .normalize("NFC")
    .replace(/\\/g, "/")
    .replace(/^\/?(?:archive\/)?exams\//, "")
    .replace(/^\/+/, "")
    .trim();
export function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  throw error;
}
export function checkTargetGrade(classRow, sourceGrade) {
  const grade =
    String(classRow.grade || classRow.grade_label || "").replace(/\s/g, "") ||
    String(classRow.name || "").match(/(?:중|고)[123]/)?.[0];
  if (!core.gradeRank(grade))
    fail(
      "반 학년을 확인할 수 없습니다. APMS의 반 학년 정보를 확인하세요.",
      409,
    );
  if (core.gradeRank(sourceGrade) > core.gradeRank(grade))
    fail("대상 반보다 높은 학년의 source 문항은 기본 출제할 수 없습니다.", 409);
}
export function uniqueIds(input, max = 200) {
  if (
    !Array.isArray(input) ||
    input.length > max ||
    input.some((v) => typeof v !== "string" || !v.trim() || v.length > 150)
  )
    fail("invalid student_ids");
  return [...new Set(input.map((v) => v.trim()))];
}
export async function requireStudentAccess(teacher, ids, env) {
  // Keep each query below D1's bind-parameter boundary; no per-student queries.
  for (let i = 0; i < ids.length; i += 80) {
    const part = ids.slice(i, i + 80);
    const allowed = await canAccessStudentsBatch(teacher, part, env);
    if (part.some((id) => !allowed.has(id))) fail("Forbidden", 403);
  }
}
export async function hasQuestionBridge(env) {
  const row = await env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='class_exam_assignment_questions'",
  ).first();
  return Boolean(row);
}
async function loadCatalog(env) {
  const url = new URL(
    "data/archive2-catalog.json",
    String(
      env.ARCHIVE_PUBLIC_BASE_URL ||
        "https://icefoxtail.github.io/AP------/archive",
    ).replace(/\/$/, "") + "/",
  );
  const response = env.ARCHIVE2_ASSETS
    ? await env.ARCHIVE2_ASSETS.fetch(url)
    : await fetch(url);
  if (!response.ok) fail("승인 catalog를 확인할 수 없습니다.", 503);
  return core.decodeCatalog(await response.json());
}
export async function validateNormalBlueprint(env, questions, input) {
  const data = await loadCatalog(env),
    file = norm(input.archive_file);
  const exam = data.exams.find((e) => e.file === file);
  if (
    !exam ||
    questions.length !== exam.qCount ||
    Number(input.question_count) !== exam.qCount
  )
    fail("원본 시험과 blueprint 문항 수가 일치하지 않습니다.", 409);
  const records = data.records
    .filter((r) => r.sourceFile === file)
    .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  for (let i = 0; i < records.length; i++) {
    const q = questions[i],
      record = records[i];
    if (
      record.identityStatus !== "VERIFIED" ||
      q.source_question_uid !== record.questionUid ||
      Number(q.source_question_ordinal) !== record.sourceOrdinal
    )
      fail("원본 blueprint의 canonical identity를 확인할 수 없습니다.", 409);
    q.sourceFingerprint = record.sourceFingerprint;
    for (const field of core.META_FIELDS)
      if (record[field] !== undefined) q[field] = record[field];
  }
  const url = new URL(
    "exams/" + file.split("/").map(encodeURIComponent).join("/"),
    String(
      env.ARCHIVE_PUBLIC_BASE_URL ||
        "https://icefoxtail.github.io/AP------/archive",
    ).replace(/\/$/, "") + "/",
  );
  const response = env.ARCHIVE2_ASSETS
    ? await env.ARCHIVE2_ASSETS.fetch(url)
    : await fetch(url);
  if (
    !response.ok ||
    (await sha256hex((await response.text()).replace(/\r\n/g, "\n"))) !==
      new Map(data.sourceHashes).get(file)
  )
    fail("원본 source 파일이 catalog와 일치하지 않습니다.", 409);
  return exam.effectiveBrowseGrade;
}
export async function validateApprovedMixedQuestions(env, questions, input) {
  const data = await loadCatalog(env);
  if (data.indexVersion !== input.index_version)
    fail("catalog 버전이 변경되었습니다. 문제지를 다시 검증하세요.", 409);
  const filters = input?.selection_filters;
  if (
    !filters ||
    typeof filters !== "object" ||
    Array.isArray(filters) ||
    typeof filters.grade !== "string" ||
    !filters.grade.trim() ||
    !Array.isArray(filters.primaryPaths) ||
    filters.primaryPaths.length === 0 ||
    filters.primaryPaths.some(
      (path) => typeof path !== "string" || !path.trim(),
    )
  )
    fail("selection_filters required");
  const byUid = new Map(
    data.records.filter((r) => r.questionUid).map((r) => [r.questionUid, r]),
  );
  for (const q of questions || []) {
    const record = byUid.get(q.questionUid);
    if (
      !record ||
      !core.eligibility(record, {
        includeExtended: input.include_extended === true,
      }).ok ||
      !core.matches(record, input.selection_filters)
    )
      fail("승인된 문항·출제 범위와 일치하지 않습니다.", 409);
    const fingerprint = await sha256hex(
      JSON.stringify({
        content: q.content ?? null,
        choices: Array.isArray(q.choices) ? q.choices : null,
        answer: q.answer ?? null,
        solution: q.solution ?? null,
        image: q.image ?? null,
      }),
    );
    if (
      fingerprint !== record.sourceFingerprint ||
      q.sourceFingerprint !== fingerprint
    )
      fail("문항 내용 fingerprint가 일치하지 않습니다.", 409);
    for (const field of core.META_FIELDS)
      if (
        q[field] !== undefined &&
        JSON.stringify(q[field]) !== JSON.stringify(record[field])
      )
        fail("canonical metadata parity mismatch: " + field, 409);
    for (const field of core.META_FIELDS)
      if (record[field] !== undefined) q[field] = record[field];
  }
}
// Original issue needs verified source bytes/ordinal identity, not automatic
// selection approval. All raw fields (including visual/layout fields) are hashed.
export async function validateOriginalSnapshot(env, payload, input) {
  const catalog = await loadCatalog(env),
    file = norm(input.archive_file);
  const exam = catalog.exams.find((e) => e.file === file),
    raw = payload?.questions;
  if (
    !exam ||
    !Array.isArray(raw) ||
    raw.length !== exam.qCount ||
    Number(input.question_count) !== exam.qCount
  )
    fail("원본 시험의 문항 수가 일치하지 않습니다.", 409);
  const records = catalog.records
    .filter((r) => r.sourceFile === file)
    .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  if (records.length !== raw.length)
    fail("원본 문항 목록을 확인할 수 없습니다.", 409);
  const verified = await Promise.all(
    raw.map(async (q, i) => {
      const r = records[i];
      if (
        !r.rawQuestionHash ||
        (await sha256hex(JSON.stringify(q))) !== r.rawQuestionHash
      )
        fail(
          "원본 내용 또는 문항 순서가 변경되었습니다. 목록을 새로고침하세요.",
          409,
        );
      const result = {
        ...q,
        questionUid: r.identityStatus === "VERIFIED" ? r.questionUid : null,
        sourceArchiveFile: file,
        sourceOrdinal: i + 1,
        sourceQuestionNo: r.sourceQuestionNo,
        sourceFingerprint: r.sourceFingerprint,
      };
      for (const field of core.META_FIELDS) {
        delete result[field];
        if (r[field] !== undefined) result[field] = r[field];
      }
      return result;
    }),
  );
  return { questions: verified, exam };
}
export async function buildQuestionSnapshot(
  assignment,
  questions,
  meta = {},
  options = {},
) {
  if (
    !Array.isArray(questions) ||
    questions.length < 1 ||
    questions.length > 400
  )
    fail("1~400 questions required");
  if (Number(assignment.question_count) !== questions.length)
    fail("question_count/payload parity mismatch");
  const seen = new Set(),
    rows = [];
  for (const [i, q] of questions.entries()) {
    const file = norm(
      q.sourceArchiveFile ||
        q._sourceFile ||
        q.sourceFile ||
        q.source_archive_file,
    );
    const ordinal = Number(
      q.sourceOrdinal ?? q._sourceQuestionOrdinal ?? q.source_question_ordinal,
    );
    const uid = String(q.questionUid || q.source_question_uid || "");
    let status = "UNRESOLVED";
    if (
      file &&
      !file.includes("..") &&
      !/^[a-z]+:/i.test(file) &&
      Number.isInteger(ordinal) &&
      ordinal > 0 &&
      UID.test(uid) &&
      uid === "qid_v1_" + (await sha256hex(file + "#" + ordinal)) &&
      !seen.has(uid)
    )
      status = "VERIFIED";
    if (status === "UNRESOLVED" && !options.legacy)
      fail("canonical UID/source ordinal mismatch at " + (i + 1));
    if (status === "VERIFIED") seen.add(uid);
    const snapshot = {};
    for (const field of [
      "curriculumKey",
      "courseKey",
      "L1",
      "L2",
      "L3",
      "L4",
      "secondaryConceptKeys",
      "curriculumApplicability",
      "defaultSelectable",
      "difficultyBucket",
      "difficultyConfidence",
      "difficultyBoundaryFlag",
      "legacyLevelCompatibility",
      "reviewStatus",
      "metadataRevision",
    ])
      if (q[field] !== undefined) snapshot[field] = q[field];
    rows.push({
      order_no: i + 1,
      question_uid: status === "VERIFIED" ? uid : null,
      source_archive_file: file || null,
      source_question_no: String(
        q.sourceQuestionNo ??
          q._sourceQuestionNo ??
          q.source_question_no ??
          q.id ??
          "",
      ),
      source_question_ordinal:
        Number.isInteger(ordinal) && ordinal > 0 ? ordinal : null,
      source_fingerprint: q.sourceFingerprint || null,
      standard_unit_key: q.standardUnitKey || q.standard_unit_key || null,
      difficulty_at_assignment: Number.isInteger(q.difficultyBucket)
        ? String(q.difficultyBucket)
        : "UNKNOWN",
      metadata_revision: q.metadataRevision || null,
      metadata_json: JSON.stringify(snapshot),
      resolution_status: status,
    });
  }
  if (
    !options.legacy &&
    (!Array.isArray(meta.questionUids) ||
      meta.questionUids.length !== rows.length ||
      rows.some((r, i) => r.question_uid !== meta.questionUids[i]))
  )
    fail("ordered final UID/payload parity mismatch");
  return rows;
}
export function questionInsertStatements(
  env,
  assignmentIdSql,
  assignmentParams,
  rows,
) {
  const columns = [
    "order_no",
    "question_uid",
    "source_archive_file",
    "source_question_no",
    "source_question_ordinal",
    "source_fingerprint",
    "standard_unit_key",
    "difficulty_at_assignment",
    "metadata_revision",
    "metadata_json",
    "resolution_status",
  ];
  const statements = [];
  for (let i = 0; i < rows.length; i += 8) {
    const batch = rows.slice(i, i + 8);
    statements.push(
      env.DB.prepare(
        `INSERT OR IGNORE INTO class_exam_assignment_questions (assignment_id, ${columns.join(",")}) VALUES
      ${batch.map(() => `((${assignmentIdSql}), ${columns.map(() => "?").join(",")})`).join(",")}`,
      ).bind(
        ...batch.flatMap((row) => [
          ...assignmentParams,
          ...columns.map((c) => row[c] ?? null),
        ]),
      ),
    );
  }
  return statements;
}

export async function blueprintInsertStatements(
  env,
  file,
  questions,
  metadataAuthority,
  options = {},
) {
  const columns = [
    "archive_file",
    "question_no",
    "source_archive_file",
    "source_question_no",
    "source_question_uid",
    "source_question_ordinal",
    "standard_unit_key",
    "standard_unit",
    "standard_course",
    "concept_cluster_key",
    "sub_unit_key",
    "type_key",
    "template_key",
    "difficulty",
    "metadata_revision",
    "metadata_hash",
  ];
  const values = await Promise.all(
    questions.map(async (q, i) => {
      const metadata = metadataAuthority.buildArchiveQuestionMetadata(q);
      return [
        file,
        i + 1,
        norm(q.sourceArchiveFile || q._sourceFile),
        String(q.sourceQuestionNo ?? q._sourceQuestionNo ?? q.id ?? ""),
        q.questionUid || null,
        Number(q.sourceOrdinal),
        metadata.standardUnitKey || null,
        metadata.standardUnit || null,
        metadata.standardCourse || null,
        metadata.conceptClusterKey || null,
        metadata.subUnitKey || null,
        metadata.typeKey || null,
        metadata.templateKey || null,
        String(metadata.difficulty || "UNKNOWN"),
        metadata.metadataRevision,
        await metadataAuthority.buildArchiveMetadataHash(metadata),
      ];
    }),
  );
  const statements = [];
  for (let i = 0; i < values.length; i += 6) {
    const batch = values.slice(i, i + 6);
    statements.push(
      env.DB.prepare(
        `INSERT ${options.original ? "" : "OR IGNORE "}INTO exam_blueprints (${columns.join(",")}) VALUES ${batch.map(() => `(${columns.map(() => "?").join(",")})`).join(",")}${
          options.original
            ? ` ON CONFLICT(archive_file,question_no) DO UPDATE SET ${columns
                .slice(2)
                .map((c) => `${c}=excluded.${c}`)
                .join(",")} WHERE excluded.source_question_uid IS NOT NULL`
            : ""
        }`,
      ).bind(...batch.flat()),
    );
  }
  return statements;
}
export async function loadQuestionHistory(env, teacher, input) {
  const ids = uniqueIds(input.student_ids);
  await requireStudentAccess(teacher, ids, env);
  const mode = input.history_mode || "all";
  if (!["all", "recent", "off"].includes(mode)) fail("invalid history_mode");
  const days = Number(input.recent_days);
  if (mode === "recent" && (!Number.isInteger(days) || days < 1 || days > 3650))
    fail("recent_days must be 1~3650");
  if (!(await hasQuestionBridge(env)))
    fail("출제 이력 bridge가 아직 설치되지 않았습니다.", 503);
  const candidates = input.candidate_question_uids;
  if (
    candidates !== undefined &&
    (!Array.isArray(candidates) ||
      candidates.length > 20000 ||
      candidates.some((uid) => !UID.test(uid)))
  )
    fail("invalid candidate_question_uids");
  const candidateSet = candidates === undefined ? null : new Set(candidates);
  const students = Object.fromEntries(
    ids.map((id) => [
      id,
      {
        question_uids: [],
        coverage: { verified: 0, legacy_inferred: 0, unresolved: 0 },
      },
    ]),
  );
  const union = new Set();
  if (mode !== "off")
    for (let i = 0; i < ids.length; i += 80) {
      const part = ids.slice(i, i + 80);
      const result = await env.DB.prepare(
        `
      SELECT r.student_id, r.created_at AS recipient_created_at, a.id AS assignment_id,
        a.created_at AS assignment_created_at, a.question_count, a.archive2_write_key,
        q.order_no, q.question_uid, q.resolution_status
      FROM class_exam_assignment_recipients r
      JOIN class_exam_assignments a ON a.id = r.assignment_id
      LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id = a.id AND x.student_id = r.student_id
      LEFT JOIN class_exam_assignment_questions q ON q.assignment_id = a.id
      WHERE r.student_id IN (${part.map(() => "?").join(",")}) AND x.student_id IS NULL
        ${mode === "recent" ? "AND a.exam_date >= date('now', '+9 hours', ?)" : ""}
      ORDER BY r.student_id, a.id, q.order_no
    `,
      )
        .bind(...part, ...(mode === "recent" ? ["-" + days + " days"] : []))
        .all();
      const seenAssignments = new Map(),
        studentUids = new Map(part.map((id) => [id, new Set()]));
      for (const row of result.results || []) {
        const student = students[row.student_id];
        const key = row.student_id + ":" + row.assignment_id;
        if (!seenAssignments.has(key))
          seenAssignments.set(key, {
            student,
            expected: Number(row.question_count),
            actual: 0,
          });
        const entry = seenAssignments.get(key);
        if (!row.order_no) continue;
        entry.actual++;
        let status = "unresolved";
        if (
          row.resolution_status !== "UNRESOLVED" &&
          UID.test(row.question_uid || "")
        ) {
          if (row.archive2_write_key) status = "verified";
          else if (
            String(row.assignment_created_at).slice(0, 10) < "2026-08-19"
          )
            status = "legacy_inferred";
          else if (
            String(row.assignment_created_at).slice(0, 10) ===
            String(row.recipient_created_at).slice(0, 10)
          )
            status =
              row.resolution_status === "LEGACY_INFERRED"
                ? "legacy_inferred"
                : "verified";
          // Even unresolved recipient timing cannot erase a known effective exposure UID.
          if (!candidateSet || candidateSet.has(row.question_uid))
            studentUids.get(row.student_id).add(row.question_uid);
        }
        student.coverage[status]++;
      }
      for (const entry of seenAssignments.values())
        entry.student.coverage.unresolved += Math.max(
          0,
          entry.expected - entry.actual,
        );
      for (const [id, uids] of studentUids) {
        students[id].question_uids = [...uids].sort();
        uids.forEach((uid) => union.add(uid));
      }
    }
  const coverage = { verified: 0, legacy_inferred: 0, unresolved: 0 };
  for (const student of Object.values(students))
    for (const k of Object.keys(coverage)) coverage[k] += student.coverage[k];
  return {
    success: true,
    contract_version: ARCHIVE2_CONTRACT,
    students,
    union_question_uids: [...union].sort(),
    coverage,
    coverage_unit: "effective_student_question_occurrences",
    history_mode: mode,
  };
}
