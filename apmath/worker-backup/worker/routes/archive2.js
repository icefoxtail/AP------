import { canAccessClass, isStaffUser } from "../helpers/foundation-db.js";
import { sha256hex } from "../helpers/admin-db.js";
import { jsonResponse } from "../helpers/response.js";
import { ensureAssignmentPdf } from "./exam-pdf.js";
import {
  ARCHIVE2_CONTRACT,
  buildQuestionSnapshot,
  fail,
  hasQuestionBridge,
  loadQuestionHistory,
  questionInsertStatements,
  requireStudentAccess,
  uniqueIds,
  validateApprovedMixedQuestions,
  validateNormalBlueprint,
  checkTargetGrade,
  blueprintInsertStatements,
  validateOriginalSnapshot,
} from "../helpers/archive2-questions.js";
import {
  SAVED_PAPER_BATCH_ID,
  readAndVerifySavedSnapshot,
} from "../helpers/archive-saved-papers.js";
import output from "../../../../archive/archive2-output.js";

async function readPayload(request) {
  if (!request.body) fail("JSON body required");
  const reader = request.body.getReader(),
    decoder = new TextDecoder();
  let bytes = 0,
    text = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 3600000) {
        await reader.cancel();
        fail("payload exceeds limit", 413);
      }
      text += decoder.decode(value, { stream: true });
      if (text.length > 900000) {
        await reader.cancel();
        fail("payload exceeds 900KB", 413);
      }
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export async function handleArchive2(
  request,
  env,
  teacher,
  action,
  metadataAuthority,
) {
  try {
    if (!isStaffUser(teacher)) fail("Forbidden", 403);
    if (env.ARCHIVE2_ENABLED !== "true")
      fail("Archive 2.0 server 기능이 아직 활성화되지 않았습니다.", 503);
    if (request.method !== "POST") fail("Method not allowed", 405);
    const raw = await readPayload(request);
    if (raw.length > 900000) fail("payload exceeds 900KB", 413);
    let input;
    try {
      input = JSON.parse(raw);
    } catch {
      fail("invalid JSON");
    }
    if (!input || typeof input !== "object" || Array.isArray(input))
      fail("JSON object required");
    if (action === "question-history")
      return jsonResponse(await loadQuestionHistory(env, teacher, input));
    const savedPaperMode = action === "original" && input.saved_paper_id !== undefined;
    if (!["studio", "original"].includes(action)) fail("Not found", 404);
    const original = action === "original" && !savedPaperMode;
    if (!(await hasQuestionBridge(env)))
      fail("Archive 2.0 migration required", 503);
    if (input.contract_version !== ARCHIVE2_CONTRACT)
      fail("contract_version mismatch");
    if (
      typeof input.class_id !== "string" ||
      !(await canAccessClass(teacher, input.class_id, env))
    )
      fail("Forbidden", 403);
    const classRow = await env.DB.prepare("SELECT * FROM classes WHERE id = ?")
      .bind(input.class_id)
      .first();
    if (!classRow) fail("class not found", 404);
    const targetIds = uniqueIds(input.student_ids);
    if (!targetIds.length) fail("출제 대상 학생을 선택하세요.");
    const roster =
      (
        await env.DB.prepare(
          "SELECT cs.student_id FROM class_students cs JOIN students s ON s.id = cs.student_id WHERE cs.class_id = ? AND s.status IN ('재원','active')",
        )
          .bind(input.class_id)
          .all()
      ).results || [];
    const rosterIds = [...new Set(roster.map((r) => r.student_id))];
    const date = String(input.exam_date || "");
    let savedPaper = null;
    let savedSnapshot = null;
    let title = String(input.exam_title || "").trim();
    let file = String(input.archive_file || "").trim();
    if (savedPaperMode) {
      if (input.contract_version !== ARCHIVE2_CONTRACT)
        fail("contract_version mismatch");
      const paperId = String(input.saved_paper_id || "");
      const batchId = String(input.assignment_batch_id || "");
      if (!SAVED_PAPER_BATCH_ID.test(paperId) || !SAVED_PAPER_BATCH_ID.test(batchId))
        fail("저장본 출제 ID가 올바르지 않습니다.", 400);
      const assignmentColumns = await env.DB.prepare("PRAGMA table_info(class_exam_assignments)").all();
      if (!(assignmentColumns.results || []).some((column) => column.name === "saved_paper_id"))
        fail("저장본 출제 migration이 적용되지 않았습니다.", 503);
      savedPaper = await env.DB.prepare(
        "SELECT * FROM archive_saved_papers WHERE id=? AND owner_teacher_id=? AND deleted_at IS NULL LIMIT 1",
      ).bind(paperId, teacher.id).first();
      if (!savedPaper) fail("저장한 시험지를 찾을 수 없습니다.", 404);
      savedSnapshot = await readAndVerifySavedSnapshot(savedPaper);
      if (savedSnapshot.questions.length !== Number(savedPaper.question_count))
        fail("저장한 시험지 문항 수가 일치하지 않습니다.", 409);
      checkTargetGrade(classRow, savedPaper.grade);
      title = savedPaper.title;
      file = `MIXED:archive2-saved-${paperId}-${batchId}`;
    }
    if (
      !title ||
      title.length > 150 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !file ||
      file.length > 500
    )
      fail("invalid assignment fields");
    const existingRows =
      (
        await env.DB.prepare(
          "SELECT * FROM class_exam_assignments WHERE class_id = ? AND exam_date = ? AND archive_file = ?",
        )
          .bind(input.class_id, date, file)
          .all()
      ).results || [];
    if (existingRows.length > 1)
      fail(
        "기존 배부 identity가 중복되어 있습니다. reconciliation이 필요합니다.",
        409,
      );
    const existing = existingRows[0];
    const savedRows = existing
      ? (
          await env.DB.prepare(
            "SELECT order_no,question_uid,source_archive_file,source_question_no,source_question_ordinal,source_fingerprint,standard_unit_key,difficulty_at_assignment,metadata_revision,metadata_json,resolution_status FROM class_exam_assignment_questions WHERE assignment_id=? ORDER BY order_no",
          )
            .bind(existing.id)
            .all()
        ).results || []
      : [];
    let savedPayload = null;
    if (existing?.mixed_payload_json) {
      try {
        savedPayload = JSON.parse(existing.mixed_payload_json);
      } catch {
        fail("저장된 시험지 정보를 확인할 수 없습니다.", 409);
      }
    }
    const recipients = existing
      ? (
          await env.DB.prepare(
            "SELECT r.student_id, x.student_id AS excluded_student_id FROM class_exam_assignment_recipients r LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id=r.assignment_id AND x.student_id=r.student_id WHERE r.assignment_id=?",
          )
            .bind(existing.id)
            .all()
        ).results || []
      : [];
    const recipientIds = new Set(recipients.map((r) => r.student_id));
    const effectiveIds = new Set(
      recipients.filter((r) => !r.excluded_student_id).map((r) => r.student_id),
    );
    const newTargetIds = targetIds.filter((id) => !effectiveIds.has(id));
    // A retry keeps the frozen roster. Explicitly selected, previously excluded
    // students may be added without removing any existing recipient.
    if (existing && newTargetIds.some((id) => !recipientIds.has(id)))
      fail("최초 배부 이후 추가된 학생은 새 문제지로 출제하세요.", 409);
    if (newTargetIds.some((id) => !rosterIds.includes(id)))
      fail("대상 학생의 반 소속 또는 재원 상태가 변경되었습니다.", 409);
    if (newTargetIds.length)
      await requireStudentAccess(teacher, newTargetIds, env);
    let payload = null,
      questions,
      meta;
    if (savedPaperMode) {
      payload = { questions: savedSnapshot.questions, meta: savedSnapshot.meta };
      questions = savedSnapshot.questions;
      meta = savedSnapshot.meta;
    } else if (original) {
      if (!file.startsWith("exams/") || file.includes(".."))
        fail("원본 경로가 올바르지 않습니다.");
      payload = input.original_payload_json;
      if (!payload || !Array.isArray(payload.questions))
        fail("원본 문항이 필요합니다.");
      payload = {
        questions: payload.questions,
        meta: {
          sourceKind: "archive2-original",
          sourceArchiveFile: file.replace(/^exams\//, ""),
          identityTitle: String(payload.meta?.identityTitle || ""),
          printHeaderOptions: output.normalize(
            payload.meta?.printHeaderOptions,
            title,
          ),
          includeQr: payload.meta?.includeQr === true,
          qpp: Number(input.pdf_qpp || 4),
        },
      };
      if (!existing) {
        const verified = await validateOriginalSnapshot(env, payload, input);
        questions = verified.questions;
        payload.meta.identityTitle = verified.exam.identityTitle;
      } else {
        payload.meta.identityTitle = savedPayload?.meta?.identityTitle || "";
      }
      meta = {};
    } else if (file.startsWith("MIXED:")) {
      if (!file.startsWith("MIXED:archive2-"))
        fail("Archive 2.0 snapshot key required");
      try {
        payload =
          typeof input.mixed_payload_json === "string"
            ? JSON.parse(input.mixed_payload_json)
            : input.mixed_payload_json;
      } catch {
        fail("invalid mixed payload");
      }
      questions = payload?.questions;
      meta = payload?.meta || {};
      if (JSON.stringify(payload || {}).length > 900000)
        fail("mixed payload exceeds 900KB", 413);
      if (!existing) checkTargetGrade(classRow, input.selection_filters?.grade);
      if (!existing)
        await validateApprovedMixedQuestions(env, questions, input);
    } else {
      if (!file.startsWith("exams/") || file.includes(".."))
        fail("normalized archive_file required");
      const result = await env.DB.prepare(
        "SELECT * FROM exam_blueprints WHERE archive_file = ? ORDER BY source_question_ordinal",
      )
        .bind(file)
        .all();
      questions = (result.results || []).map((q) => ({
        ...q,
        sourceArchiveFile: file,
        sourceQuestionNo: q.question_no,
      }));
      meta = { questionUids: input.question_uids };
      const sourceGrade = await validateNormalBlueprint(env, questions, input);
      if (!existing) checkTargetGrade(classRow, sourceGrade);
    }
    const rows = savedPaperMode
      ? (existing ? savedRows : savedSnapshot.bridgeRows)
      : original && existing
        ? savedRows
        : await buildQuestionSnapshot(input, questions, meta, {
            legacy: original,
          });
    const expectedQuestionCount = Number(savedPaperMode ? savedPaper.question_count : input.question_count);
    if (!rows?.length || rows.length !== expectedQuestionCount)
      fail("저장된 원본 문항 정보를 확인할 수 없습니다.", 409);
    if (original) payload.meta.questionUids = rows.map((r) => r.question_uid);
    if (rows.length > 80)
      fail("학생 출제는 문제지당 최대 80문항입니다. 나누어 출제하세요.");
    const qpp = Number(savedPaperMode ? savedSnapshot.meta.qpp : input.pdf_qpp || 4);
    if (![1, 2, 4, 6, 8].includes(qpp)) fail("invalid pdf_qpp");
    const writeKey = await sha256hex(
      JSON.stringify([input.class_id, date, file]),
    );
    const contentSnapshot = JSON.stringify([title, file, qpp, payload, rows]);
    // Older hashes included student IDs and are protected by the immutable
    // snapshot trigger. Compare persisted content and retain those hashes so
    // already issued exams need no migration or recreation.
    const snapshotHash =
      existing?.archive2_snapshot_hash || (await sha256hex(contentSnapshot));
    if (
      existing &&
      (existing.archive2_write_key !== writeKey ||
        !existing.archive2_snapshot_hash ||
        JSON.stringify([
          existing.exam_title,
          existing.archive_file,
          Number(existing.pdf_qpp || 4),
          savedPayload,
          savedRows,
        ]) !== contentSnapshot)
    )
      fail("이미 배부된 시험입니다. 수정본은 새 문제지로 출제하세요.", 409);
    if (newTargetIds.length) {
      const history = original || savedPaperMode
        ? { union_question_uids: [], coverage: {} }
        : await loadQuestionHistory(env, teacher, {
            student_ids: newTargetIds,
            candidate_question_uids: rows.map((r) => r.question_uid),
            history_mode: input.history_mode || "all",
            recent_days: input.recent_days,
          });
      if (history.union_question_uids.length)
        fail(
          "선택 학생의 출제 이력이 변경되었습니다. 중복 문항을 교체하세요.",
          409,
        );
      if (
        (history.coverage.legacy_inferred || history.coverage.unresolved) &&
        input.acknowledge_incomplete_history !== true
      )
        fail("추정·미복원 이력 안내를 확인하세요.", 409);
    }
    const assignmentId = existing?.id || crypto.randomUUID();
    const selectId =
      "SELECT id FROM class_exam_assignments WHERE archive2_write_key = ?";
    const assignmentValues = [
      assignmentId,
      input.class_id,
      title,
      date,
      rows.length,
      file,
      file.startsWith("MIXED:") ? "mixed" : "archive",
      payload ? JSON.stringify(payload) : "",
      String(savedPaperMode ? savedPaper.subject || "" : input.subject || ""),
      qpp,
      writeKey,
      snapshotHash,
    ];
    const insert = savedPaperMode
      ? env.DB.prepare(`
          INSERT INTO class_exam_assignments
          (id,class_id,exam_title,exam_date,question_count,archive_file,source_type,mixed_payload_json,subject,pdf_qpp,archive2_write_key,archive2_snapshot_hash,saved_paper_id)
          SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?
          WHERE EXISTS (
            SELECT 1 FROM archive_saved_papers
            WHERE id=? AND owner_teacher_id=? AND deleted_at IS NULL AND snapshot_hash=?
          )
          ON CONFLICT(archive2_write_key) WHERE archive2_write_key IS NOT NULL
          DO UPDATE SET archive2_snapshot_hash = excluded.archive2_snapshot_hash
        `).bind(...assignmentValues, savedPaper.id, savedPaper.id, teacher.id, savedPaper.snapshot_hash)
      : env.DB.prepare(`
          INSERT INTO class_exam_assignments
          (id,class_id,exam_title,exam_date,question_count,archive_file,source_type,mixed_payload_json,subject,pdf_qpp,archive2_write_key,archive2_snapshot_hash)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
          ON CONFLICT(archive2_write_key) WHERE archive2_write_key IS NOT NULL
          DO UPDATE SET archive2_snapshot_hash = excluded.archive2_snapshot_hash
        `).bind(...assignmentValues);
    const statements = [insert];
    if (payload && !original)
      statements.push(
        env.DB.prepare(
          `INSERT INTO class_exam_assignment_questions (assignment_id,order_no,resolution_status)
      SELECT (${selectId}),0,'UNRESOLVED' WHERE EXISTS (SELECT 1 FROM class_exam_assignments WHERE archive_file=? AND archive2_write_key IS NOT ? AND mixed_payload_json IS NOT ?)`,
        ).bind(writeKey, file, writeKey, JSON.stringify(payload)),
      );
    const effectiveHistoryMode = savedPaperMode ? "off" : input.history_mode || "all";
    if (newTargetIds.length && !original && effectiveHistoryMode !== "off") {
      // Recheck inside the same D1 transaction: another assignment may have
      // committed after the preflight history response.
      statements.push(
        env.DB.prepare(
          `INSERT INTO class_exam_assignment_questions (assignment_id, order_no, resolution_status)
        SELECT (${selectId}), 0, 'UNRESOLVED' WHERE EXISTS (
          SELECT 1 FROM class_exam_assignment_recipients r
          JOIN class_exam_assignments a ON a.id = r.assignment_id
          JOIN class_exam_assignment_questions q ON q.assignment_id = a.id
          LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id = a.id AND x.student_id = r.student_id
          WHERE r.student_id IN (SELECT value FROM json_each(?)) AND x.student_id IS NULL
            AND q.question_uid IN (SELECT value FROM json_each(?)) AND a.archive2_write_key IS NOT ?
            ${effectiveHistoryMode === "recent" ? "AND a.exam_date >= date('now', '+9 hours', ?)" : ""}
        )`,
        ).bind(
          writeKey,
          JSON.stringify(newTargetIds),
          JSON.stringify(rows.map((r) => r.question_uid)),
          writeKey,
          ...(effectiveHistoryMode === "recent"
            ? ["-" + Number(input.recent_days) + " days"]
            : []),
        ),
      );
    }
    // Freeze the initial roster only. Retry never adds newly enrolled students.
    if (!existing)
      statements.push(
        env.DB.prepare(
          `INSERT OR IGNORE INTO class_exam_assignment_recipients
      (assignment_id,student_id) SELECT (${selectId}), value FROM json_each(?) WHERE (${selectId}) = ?
       AND EXISTS (SELECT 1 FROM students s WHERE s.id = value AND s.status IN ('재원','active'))`,
        ).bind(writeKey, JSON.stringify(rosterIds), writeKey, assignmentId),
      );
    if (!existing)
      statements.push(
        env.DB.prepare(
          `INSERT OR IGNORE INTO class_exam_assignment_exclusions
      (assignment_id,student_id,reason) SELECT (${selectId}), value, 'archive2_target' FROM json_each(?) WHERE (${selectId}) = ?
       AND EXISTS (SELECT 1 FROM students s WHERE s.id = value AND s.status IN ('재원','active'))`,
        ).bind(
          writeKey,
          JSON.stringify(rosterIds.filter((id) => !targetIds.includes(id))),
          writeKey,
          assignmentId,
        ),
      );
    // Apply the explicit selection after the initial exclusions. This also
    // handles concurrent first writes selecting different students of one exam.
    statements.push(
      env.DB.prepare(
        `DELETE FROM class_exam_assignment_exclusions WHERE assignment_id=(${selectId})
         AND student_id IN (SELECT value FROM json_each(?))`,
      ).bind(writeKey, JSON.stringify(newTargetIds)),
    );
    statements.push(
      ...questionInsertStatements(env, selectId, [writeKey], rows),
    );
    if (payload && questions)
      statements.push(
        ...(await blueprintInsertStatements(
          env,
          file,
          questions,
          metadataAuthority,
          { original, ...(savedPaperMode ? { assignmentGuard: { writeKey } } : {}) },
        )),
      );
    await env.DB.batch(statements);
    let assignment = await env.DB.prepare(selectId).bind(writeKey).first();
    if (!assignment && savedPaperMode)
      fail("저장본이 삭제되었거나 출제 저장을 완료하지 못했습니다.", 404);
    if (!assignment)
      fail("저장본이 삭제되었거나 출제 저장을 완료하지 못했습니다.", savedPaperMode ? 404 : 500);
    assignment = await env.DB.prepare(
      "SELECT * FROM class_exam_assignments WHERE id = ?",
    )
      .bind(assignment.id)
      .first();
    const actualRows =
      (
        await env.DB.prepare(
          "SELECT question_uid FROM class_exam_assignment_questions WHERE assignment_id = ? ORDER BY order_no",
        )
          .bind(assignment.id)
          .all()
      ).results || [];
    if (
      JSON.stringify(actualRows.map((r) => r.question_uid)) !==
      JSON.stringify(rows.map((r) => r.question_uid))
    )
      fail("persisted question parity failure", 500);
    // Existing PDF/R2 pipeline remains the artifact authority. A failed artifact
    // does not conceal the committed assignment or prevent idempotent retry.
    assignment = await ensureAssignmentPdf(env, assignment);
    return jsonResponse(
      {
        success: assignment.pdf_status === "ready",
        saved: true,
        assignment,
        question_uids: actualRows.map((r) => r.question_uid),
        error:
          assignment.pdf_status === "ready"
            ? undefined
            : assignment.pdf_error || "PDF 준비가 완료되지 않았습니다.",
      },
      assignment.pdf_status === "ready" ? 200 : 502,
    );
  } catch (error) {
    return jsonResponse(
      {
        success: false,
        error: /CHECK constraint/.test(error.message)
          ? "동시에 등록된 출제 이력과 충돌합니다. 다시 검증하세요."
          : error.message,
      },
      error.status ||
        (/SNAPSHOT_CONFLICT|UNIQUE constraint|CHECK constraint/.test(
          error.message,
        )
          ? 409
          : 500),
    );
  }
}
