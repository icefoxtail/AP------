import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import source from "../archive/archive2-source.js";
export async function runRc2({ db, mf, catalog, post, root }) {
  const record = catalog.records.find(
    (r) => r.automatic && r.sourceFile.startsWith("original/"),
  );
  const exam = catalog.exams.find((e) => e.file === record.sourceFile),
    raw = source.evaluate(
      fs.readFileSync(path.join(root, "archive/exams", exam.file), "utf8"),
      exam.file,
    );
  const body = {
    contract_version: "archive2-v1",
    class_id: "class-a",
    student_ids: ["student-a"],
    exam_title: "RC2 원본 출제",
    exam_date: "2026-10-01",
    archive_file: "exams/" + exam.file,
    question_count: raw.length,
    pdf_qpp: 4,
    original_payload_json: {
      questions: raw,
      meta: {
        identityTitle: exam.identityTitle,
        printHeaderOptions: {
          title: "RC2 원본 출제",
          showNameLine: true,
          showScoreLine: false,
        },
        includeQr: false,
      },
    },
  };
  await db
    .prepare(
      "INSERT OR REPLACE INTO exam_blueprints(archive_file,question_no,source_question_uid,source_question_ordinal) VALUES(?,?,?,?)",
    )
    .bind(
      body.archive_file,
      record.sourceOrdinal,
      "stale-legacy-reference",
      999,
    )
    .run();
  const first = await post("", body);
  assert.equal(first.status, 502, JSON.stringify(first.body));
  assert.equal(first.body.saved, true);
  const id = first.body.assignment.id;
  const rows = (
    await db
      .prepare(
        "SELECT * FROM class_exam_assignment_questions WHERE assignment_id=? ORDER BY order_no",
      )
      .bind(id)
      .all()
  ).results;
  assert.equal(rows.length, raw.length);
  const known = catalog.records.filter(
    (r) => r.sourceFile === exam.file && r.identityStatus === "VERIFIED",
  );
  assert.equal(rows.filter((r) => r.question_uid).length, known.length);
  assert.equal(
    (
      await db
        .prepare(
          "SELECT source_question_uid FROM exam_blueprints WHERE archive_file=? AND question_no=?",
        )
        .bind(body.archive_file, record.sourceOrdinal)
        .first()
    ).source_question_uid,
    record.questionUid,
  );
  const history = await post("question-history", {
    student_ids: ["student-a"],
    candidate_question_uids: [record.questionUid],
    history_mode: "all",
  });
  assert.ok(
    history.body.union_question_uids.includes(record.questionUid),
    "original UID must be immediately excluded",
  );
  const excluded = await post("question-history", {
    student_ids: ["student-b"],
    candidate_question_uids: [record.questionUid],
    history_mode: "all",
  });
  assert.ok(!excluded.body.union_question_uids.includes(record.questionUid));
  await db
    .prepare("INSERT INTO class_students VALUES('class-a','student-c')")
    .run();
  const retry = await post("", body);
  assert.equal(retry.body.assignment.id, id);
  const recipients = (
    await db
      .prepare(
        "SELECT student_id FROM class_exam_assignment_recipients WHERE assignment_id=? ORDER BY student_id",
      )
      .bind(id)
      .all()
  ).results;
  assert.deepEqual(
    recipients.map((r) => r.student_id),
    ["student-a", "student-b"],
  );
  assert.ok(
    await db
      .prepare(
        "SELECT * FROM class_exam_assignment_exclusions WHERE assignment_id=? AND student_id=?",
      )
      .bind(id, "student-b")
      .first(),
  );
  assert.equal(
    (await post("", { ...body, student_ids: ["student-a", "student-c"] }))
      .status,
    409,
  );
  const tampered = structuredClone(body);
  tampered.exam_date = "2026-10-02";
  tampered.original_payload_json.questions[0].solutionImage = "tampered.svg";
  assert.equal(
    (await post("", tampered)).status,
    409,
    "all source fields must be protected",
  );
  await db
    .prepare(
      "CREATE TRIGGER rc2_fail_exclusion BEFORE INSERT ON class_exam_assignment_exclusions WHEN NEW.reason='archive2_target' BEGIN SELECT RAISE(ABORT,'INJECTED_EXCLUSION_FAILURE'); END",
    )
    .run();
  assert.equal(
    (await post("", { ...body, exam_date: "2026-10-03" })).status,
    500,
  );
  assert.equal(
    (
      await db
        .prepare(
          "SELECT COUNT(*) n FROM class_exam_assignments WHERE exam_date='2026-10-03'",
        )
        .first()
    ).n,
    0,
    "assignment rolls back with exclusions",
  );
  await db.prepare("DROP TRIGGER rc2_fail_exclusion").run();
  const token = crypto
    .createHash("sha256")
    .update("student-a::student-portal:v1")
    .digest("hex");
  const exams = await mf.dispatchFetch(
    "http://local/api/student-portal/exams?student_id=student-a",
    { headers: { "X-Student-Token": token } },
  );
  const studentExam = (await exams.json()).exams.find(
    (e) => e.assignment_id === id,
  );
  assert.ok(studentExam);
  assert.equal(studentExam.exam_title, body.exam_title);
  assert.equal(studentExam.pdf_status, "failed");
  assert.deepEqual(JSON.parse(studentExam.mixed_payload_json).questions, raw);
  const omr = await mf.dispatchFetch(
    "http://local/api/student-portal/omr-submit",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: "student-a",
        student_token: token,
        assignment_id: id,
        wrong_ids: [record.sourceOrdinal],
      }),
    },
  );
  assert.equal(omr.status, 200);
  const wrong = await db
    .prepare(
      "SELECT q.question_uid FROM wrong_answers w JOIN exam_sessions e ON e.id=w.session_id JOIN class_exam_assignment_questions q ON q.assignment_id=e.assignment_id AND q.order_no=CAST(w.question_id AS INTEGER) WHERE e.assignment_id=?",
    )
    .bind(id)
    .first();
  assert.equal(wrong.question_uid, record.questionUid);
  const status = await mf.dispatchFetch(
    "http://local/api/class-exam-assignments/" + id + "/status",
    { headers: { "X-Fixture-Role": "admin" } },
  );
  const statusData = await status.json();
  assert.equal(status.status, 200, JSON.stringify(statusData));
  assert.ok(
    statusData.students.find((s) => s.student_id === "student-a").session_id,
  );
  await db
    .prepare("DELETE FROM class_exam_assignments WHERE id=?")
    .bind(id)
    .run();
  await db
    .prepare(
      "DELETE FROM class_students WHERE class_id='class-a' AND student_id='student-c'",
    )
    .run();
  console.log(
    JSON.stringify({
      rc2: "PASS",
      originalImmediateHistory: true,
      atomicRecipientsExclusions: true,
      newStudentNotAddedOnRetry: true,
      immutableSourceAllFields: true,
      portalOmrCanonicalUid: true,
    }),
  );
}
