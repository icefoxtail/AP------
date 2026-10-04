import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { checkTargetClassGrade } from "../apmath/worker-backup/worker/helpers/archive2-questions.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const worker = path.join(root, "apmath/worker-backup/worker");
const requireWorker = createRequire(path.join(worker, "package.json"));
const requireRoot = createRequire(import.meta.url);
const { Miniflare } = requireWorker("miniflare");
const { build } = requireWorker("esbuild");
const core = requireRoot("../archive/archive2-core.js");
const history = requireRoot("../archive/archive2-history.js");
const source = requireRoot("../archive/archive2-source.js");
const { catalog } = requireRoot("./helpers/archive2-scope-harness.cjs");

test("recent-summary D1 subject normalization matches Roman aliases and exact student reads stay scoped", async () => {
  const bundle = await build({
    stdin: {
  contents: `import { handleExams } from './routes/exams.js';
import { handleCheckOmr } from './routes/check-omr.js';
import { handleStudentPortal } from './routes/student-portal.js';
export default { async fetch(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.split('/').filter(Boolean);
  if (url.pathname.startsWith('/api/student-portal/')) {
    const role = request.headers.get('X-Fixture-Role');
    const teacher = role ? {
      id: request.headers.get('X-Fixture-Teacher') || role,
      role,
    } : null;
    return handleStudentPortal(request, env, teacher, path, url);
  }
  const role = request.headers.get('X-Fixture-Role');
  const teacher = role ? {
    id: request.headers.get('X-Fixture-Teacher') || role,
    role,
  } : { id: 'admin', role: 'admin' };
  if (url.pathname === '/api/qr-classes') return handleCheckOmr(request, env, teacher, path, url);
  if (url.pathname === '/api/class-exam-assignments/recent-summary') {
    let prepared = 0;
    const recentEnv = { ...env, DB: { prepare(sql) { prepared++; return env.DB.prepare(sql); } } };
    const response = await handleExams(request, recentEnv, teacher, path, url);
    const headers = new Headers(response.headers);
    headers.set('X-Fixture-D1-Prepares', String(prepared));
    return new Response(await response.text(), { status: response.status, headers });
  }
  return handleExams(request, env, teacher, path, url);
} }`,
      resolveDir: worker,
    },
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
    external: ["cloudflare:*", "node:*"],
  });
  const mf = new Miniflare({
    modules: true,
    script: bundle.outputFiles[0].text,
    compatibilityDate: "2026-07-11",
    compatibilityFlags: ["nodejs_compat"],
    d1Databases: ["DB"],
  });

  try {
    const db = await mf.getD1Database("DB");
    for (const sql of [
      `CREATE TABLE classes(id TEXT PRIMARY KEY,name TEXT,grade TEXT)`,
      `CREATE TABLE class_exam_assignments(
        id TEXT PRIMARY KEY,class_id TEXT,exam_title TEXT,exam_date TEXT,question_count INTEGER,
        archive_file TEXT,source_type TEXT,mixed_payload_json TEXT,subject TEXT,pdf_status TEXT,pdf_error TEXT,
        saved_paper_id TEXT,cancelled_at TEXT,updated_at TEXT,created_at TEXT,grade_label TEXT
      )`,
      `CREATE TABLE archive_saved_papers(
        id TEXT PRIMARY KEY,grade TEXT,deleted_at TEXT,snapshot_json TEXT
      )`,
      `CREATE TABLE archive_saved_paper_library_metadata(saved_paper_id TEXT PRIMARY KEY,status TEXT)`,
      `CREATE TABLE class_exam_assignment_recipients(assignment_id TEXT,student_id TEXT)`,
      `CREATE TABLE class_exam_assignment_exclusions(assignment_id TEXT,student_id TEXT)`,
      `CREATE TABLE class_exam_assignment_lifecycle_events(
        event_id TEXT,assignment_id TEXT,related_assignment_id TEXT,operation TEXT,occurred_at TEXT
      )`,
      `CREATE TABLE exam_sessions(
        id TEXT PRIMARY KEY,student_id TEXT,assignment_id TEXT,exam_title TEXT,exam_date TEXT,
        question_count INTEGER,archive_file TEXT,updated_at TEXT,created_at TEXT,score REAL,wrong_ids TEXT,class_id TEXT
      )`,
      `CREATE TABLE students(
        id TEXT PRIMARY KEY,name TEXT,grade TEXT,school_name TEXT,student_pin TEXT,status TEXT
      )`,
      `CREATE TABLE class_students(class_id TEXT,student_id TEXT)`,
      `CREATE TABLE teacher_classes(teacher_id TEXT,class_id TEXT)`,
      `CREATE TABLE homework_photo_assignments(
        id TEXT PRIMARY KEY,title TEXT,description TEXT,class_id TEXT,due_date TEXT,due_time TEXT,status TEXT,created_at TEXT
      )`,
      `CREATE TABLE homework_photo_submissions(
        assignment_id TEXT,student_id TEXT,is_submitted INTEGER,submitted_at TEXT
      )`,
    ]) await db.prepare(sql).run();
    await db.prepare("INSERT INTO classes VALUES(?,?,?)").bind("class-target", "고1 대상반", "고1").run();
    await db.prepare("INSERT INTO classes VALUES(?,?,?)").bind("class-other", "고2 다른반", "고2").run();
    await db.prepare("INSERT INTO classes VALUES(?,?,?)").bind("class-1", "고1 A반", "고1").run();
    await db.prepare("INSERT INTO classes VALUES(?,?,?)").bind("class-2", "고1 B반", "고1").run();
    await db.prepare("INSERT INTO classes VALUES(?,?,?)").bind("class-recent-grade", "고1 Recent 대상반", "고1").run();

    const assignmentInsert = db.prepare(`INSERT INTO class_exam_assignments
      (id,class_id,exam_title,exam_date,question_count,archive_file,source_type,mixed_payload_json,subject,
       pdf_status,pdf_error,saved_paper_id,cancelled_at,updated_at,created_at,grade_label)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
    const recipientInsert = db.prepare("INSERT INTO class_exam_assignment_recipients VALUES(?,?)");
    const activeRows = [];
    for (let index = 0; index < 1005; index++) {
      const id = `recent-${String(index).padStart(4, "0")}`;
      activeRows.push(assignmentInsert.bind(
        id, "class-target", `최근 출제 ${index}`, "2026-09-20", 1, "original/recent.js", "archive",
        JSON.stringify({ meta: { grade: "고1", subject: "공통수학1" } }), "공통수학1", "ready", "", null, null,
        "2026-09-20T00:00:00.000Z", "2026-09-20T00:00:00.000Z", "고1",
      ));
    }
    activeRows.push(assignmentInsert.bind(
      "assignment-old-exact", "class-target", "오래된 정확 검색", "2020-01-10", 1, "original/old.js", "archive",
      JSON.stringify({ meta: { grade: "고1", subject: "공통수학1" } }), "공통수학1", "ready", "", null, null,
      "2020-01-10T00:00:00.000Z", "2020-01-10T00:00:00.000Z", "고1",
    ));
    const subjectAliases = [
      ["ALGEBRA", ["대수", "수학I", "수학Ⅰ"]],
      ["CALCULUS", ["미적분I", "미적분Ⅰ", "수학II", "수학Ⅱ"]],
      ["CALCULUS_ADVANCED", ["미적분II", "미적분Ⅱ", "미적분"]],
      ["PROB_STATS", ["확률과통계", "확률과 통계"]],
    ];
    const subjectAliasIds = new Map();
    let aliasIndex = 0;
    for (const [semanticSubject, aliases] of subjectAliases) {
      const ids = [];
      for (const alias of aliases) {
        const id = `subject-alias-${aliasIndex}`;
        const metadataOnly = aliasIndex % 2 === 1;
        const storedAlias = alias === "확률과 통계" ? alias.normalize("NFD") : alias;
        ids.push(id);
        activeRows.push(assignmentInsert.bind(
          id, "class-target", `과목 alias ${aliasIndex}`, "2026-09-21", 1,
          "original/subject-alias.js", "archive",
          JSON.stringify({ meta: { grade: "고2", subject: metadataOnly ? storedAlias : "다른 과목" } }),
          metadataOnly ? "다른 과목" : alias, "ready", "", null, null,
          "2026-09-21T00:00:00.000Z", "2026-09-21T00:00:00.000Z", "고2",
        ));
        aliasIndex++;
      }
      subjectAliasIds.set(semanticSubject, ids);
    }
    for (let index = 0; index < activeRows.length; index += 100)
      await db.batch(activeRows.slice(index, index + 100));

    const mixedRecentRecords = [];
    for (const sourceGrade of ["고2", "중3"]) {
      const record = catalog.records.find(row => row.automatic && row.sourceGrade === sourceGrade &&
        core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
      assert.ok(record, `Recent mixed-source fixture needs an actual ${sourceGrade} source`);
      const question = source.evaluate(
        fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"),
        record.sourceFile,
      )[record.sourceOrdinal - 1];
      mixedRecentRecords.push({
        ...question,
        questionUid: record.questionUid,
        sourceArchiveFile: record.sourceFile,
        sourceOrdinal: record.sourceOrdinal,
        sourceGrade: record.sourceGrade,
      });
    }
    const mixedRecentSnapshot = JSON.stringify({
      questions: mixedRecentRecords,
      meta: { grade: "고2", subject: "미적분" },
    });
    assert.deepEqual(
      [...new Set(mixedRecentRecords.map(question => question.sourceGrade))].sort(),
      ["고2", "중3"],
      "the Recent projection fixture uses actual mixed source-grade questions",
    );
    const recentPaperInsert = db.prepare(`INSERT INTO archive_saved_papers
      (id,grade,deleted_at,snapshot_json) VALUES(?,?,?,?)`);
    const recentPapers = [
      ["paper-cross", "고2", null, JSON.stringify({ questions: [], meta: { grade: "고1" } })],
      ["paper-same", "고2", null, JSON.stringify({ questions: [], meta: { grade: "고2" } })],
      ["paper-mixed", "고2", null, mixedRecentSnapshot],
      ["paper-archived", "고2", null, JSON.stringify({ questions: [], meta: { grade: "고1" } })],
      ["paper-trashed", "고3", "2026-10-02T00:00:00.000Z", JSON.stringify({ questions: [], meta: { grade: "고1" } })],
    ];
    await db.batch(recentPapers.map(row => recentPaperInsert.bind(...row)));
    const recentLibraryMetadataInsert = db.prepare(
      "INSERT INTO archive_saved_paper_library_metadata(saved_paper_id,status) VALUES(?,?)",
    );
    await db.batch([
      recentLibraryMetadataInsert.bind("paper-archived", "ARCHIVED"),
      recentLibraryMetadataInsert.bind("paper-trashed", "TRASHED"),
    ]);
    const savedRecentRows = [
      ["recent-saved-cross", "class-recent-grade", "paper-cross", "고1", null],
      ["recent-saved-mixed", "class-recent-grade", "paper-mixed", "고1", null],
      ["recent-saved-unknown", "class-recent-grade", "paper-missing", "", null],
      ["recent-saved-archived", "class-recent-grade", "paper-archived", "고1", null],
      ["recent-saved-trashed", "class-recent-grade", "paper-trashed", "고1", "2026-10-02T01:00:00.000Z"],
      ["recent-saved-same", "class-other", "paper-same", "고2", null],
    ];
    for (const [id, classId, paperId, payloadGrade, cancelledAt] of savedRecentRows)
      await assignmentInsert.bind(
        id, classId, `Saved Paper ${id}`, "2026-10-02", 2,
        `MIXED:archive2-saved-${id}`, "mixed",
        JSON.stringify({ meta: { ...(payloadGrade ? { grade: payloadGrade } : {}), subject: "미적분" } }),
        "미적분", "ready", "", paperId, cancelledAt,
        "2026-10-02T00:00:00.000Z", "2026-10-02T00:00:00.000Z", null,
      ).run();
    await db.prepare(`INSERT INTO class_exam_assignment_lifecycle_events
      (event_id,assignment_id,related_assignment_id,operation,occurred_at) VALUES(?,?,?,?,?)`)
      .bind("recent-replacement-event", "recent-saved-trashed", "recent-saved-archived",
        "REPLACEMENT_ASSIGNMENT", "2026-10-02T01:00:00.000Z").run();

    const recipients = [];
    for (let index = 0; index < 1005; index++) recipients.push(recipientInsert.bind(`recent-${String(index).padStart(4, "0")}`, "student-a"));
    recipients.push(recipientInsert.bind("assignment-old-exact", "student-a"));
    recipients.push(recipientInsert.bind("cancelled-submitted", "student-a"));
    recipients.push(recipientInsert.bind("cancelled-unsubmitted", "student-a"));
    recipients.push(recipientInsert.bind("excluded-submitted", "student-a"));
    for (let index = 0; index < recipients.length; index += 100)
      await db.batch(recipients.slice(index, index + 100));

    await assignmentInsert.bind(
      "cancelled-submitted", "class-target", "취소 후 제출", "2026-09-19", 1, "original/cancelled.js", "archive",
      JSON.stringify({ meta: { grade: "고1", subject: "공통수학1" } }), "공통수학1", "ready", "", null,
      "2026-09-19T00:00:00.000Z", "2026-09-19T00:00:00.000Z", "2026-09-19T00:00:00.000Z", "고1",
    ).run();
    await assignmentInsert.bind(
      "cancelled-unsubmitted", "class-target", "취소 미제출", "2026-09-18", 1, "original/cancelled.js", "archive",
      JSON.stringify({ meta: { grade: "고1", subject: "공통수학1" } }), "공통수학1", "ready", "", null,
      "2026-09-18T00:00:00.000Z", "2026-09-18T00:00:00.000Z", "2026-09-18T00:00:00.000Z", "고1",
    ).run();
    await assignmentInsert.bind(
      "excluded-submitted", "class-target", "제외 후 제출", "2026-09-17", 1, "original/excluded.js", "archive",
      JSON.stringify({ meta: { grade: "고1", subject: "공통수학1" } }), "공통수학1", "ready", "", null, null,
      "2026-09-17T00:00:00.000Z", "2026-09-17T00:00:00.000Z", "고1",
    ).run();
    await db.prepare("UPDATE class_exam_assignments SET cancelled_at=? WHERE id=?")
      .bind("2026-09-19T01:00:00.000Z", "cancelled-submitted").run();
    await db.prepare("UPDATE class_exam_assignments SET cancelled_at=? WHERE id=?")
      .bind("2026-09-18T01:00:00.000Z", "cancelled-unsubmitted").run();
    await db.prepare("INSERT INTO class_exam_assignment_exclusions VALUES(?,?)")
      .bind("excluded-submitted", "student-a").run();
    for (const id of ["cancelled-submitted", "excluded-submitted"])
      await db.prepare(`INSERT INTO exam_sessions
        (id,student_id,assignment_id,exam_title,exam_date,question_count,archive_file,updated_at,created_at,score,wrong_ids)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(
        `session-${id}`, "student-a", id, "review history", "2026-09-01", 1, "original/review.js",
        "2026-09-01T00:00:00.000Z", "2026-09-01T00:00:00.000Z", 1, "[]",
      ).run();

    await db.prepare("INSERT INTO students VALUES(?,?,?,?,?,?)")
      .bind("student-a", "학생 A", "고1", "테스트학교", "", "재원").run();
    await db.prepare("INSERT INTO students VALUES(?,?,?,?,?,?)")
      .bind("student-b", "학생 B", "고1", "테스트학교", "", "재원").run();

    for (const [id, classId, title] of [
      ["assignment-class-1", "class-1", "두 반 공통 시험"],
      ["assignment-class-2", "class-2", "두 반 공통 시험"],
    ]) {
      await assignmentInsert.bind(
        id, classId, title, "2026-09-30", 1, "original/shared-class-exam.js", "archive",
        JSON.stringify({ meta: { grade: "고1", subject: "공통수학1" } }), "공통수학1", "ready", "", null, null,
        "2026-09-30T00:00:00.000Z", "2026-09-30T00:00:00.000Z", "고1",
      ).run();
      await recipientInsert.bind(id, "student-a").run();
    }
    await db.prepare(`INSERT INTO exam_sessions
      (id,student_id,assignment_id,exam_title,exam_date,question_count,archive_file,updated_at,created_at,score,wrong_ids)
      VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(
      "session-class-2", "student-a", "assignment-class-2", "두 반 공통 시험", "2026-09-30", 1,
      "original/shared-class-exam.js", "2026-10-01T00:00:00.000Z", "2026-10-01T00:00:00.000Z", 1, "[]",
    ).run();
    await db.prepare(`INSERT INTO exam_sessions
      (id,student_id,assignment_id,exam_title,exam_date,question_count,archive_file,updated_at,created_at,score,wrong_ids,class_id)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      "session-class-2-legacy", "student-a", null, "두 반 공통 시험", "2026-09-30", 1,
      "original/shared-class-exam.js", "2026-10-02T00:00:00.000Z", "2026-10-02T00:00:00.000Z", 1, "[]", "class-2",
    ).run();
    for (const [id, title] of [
      ["class1-cancelled-submitted", "반 1 취소 제출"],
      ["class1-cancelled-unsubmitted", "반 1 취소 미제출"],
      ["class1-excluded-submitted", "반 1 제외 제출"],
    ]) {
      await assignmentInsert.bind(
        id, "class-1", title, "2026-09-19", 1, `original/${id}.js`, "archive",
        JSON.stringify({ meta: { grade: "고1", subject: "공통수학1" } }), "공통수학1", "ready", "", null, null,
        "2026-09-19T00:00:00.000Z", "2026-09-19T00:00:00.000Z", "고1",
      ).run();
      await recipientInsert.bind(id, "student-a").run();
    }
    await db.prepare("UPDATE class_exam_assignments SET cancelled_at=? WHERE id IN (?,?)")
      .bind("2026-09-19T01:00:00.000Z", "class1-cancelled-submitted", "class1-cancelled-unsubmitted").run();
    await db.prepare("INSERT INTO class_exam_assignment_exclusions VALUES(?,?)")
      .bind("class1-excluded-submitted", "student-a").run();
    for (const id of ["class1-cancelled-submitted", "class1-excluded-submitted"])
      await db.prepare(`INSERT INTO exam_sessions
        (id,student_id,assignment_id,exam_title,exam_date,question_count,archive_file,updated_at,created_at,score,wrong_ids)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(
        `session-${id}`, "student-a", id, "preview review history", "2026-09-19", 1, `original/${id}.js`,
        "2026-09-19T02:00:00.000Z", "2026-09-19T02:00:00.000Z", 1, "[]",
      ).run();
    await db.prepare("INSERT INTO class_students VALUES(?,?)").bind("class-1", "student-a").run();
    await db.prepare("INSERT INTO class_students VALUES(?,?)").bind("class-2", "student-a").run();
    await db.prepare("INSERT INTO class_students VALUES(?,?)").bind("class-1", "student-b").run();
    await db.prepare("INSERT INTO teacher_classes VALUES(?,?)").bind("teacher-a", "class-1").run();
    const homeworkInsert = db.prepare(`INSERT INTO homework_photo_assignments
      (id,title,description,class_id,due_date,due_time,status,created_at) VALUES(?,?,?,?,?,?,?,?)`);
    const homeworkSubmissionInsert = db.prepare(`INSERT INTO homework_photo_submissions
      (assignment_id,student_id,is_submitted,submitted_at) VALUES(?,?,?,?)`);
    for (const [id, classId, title] of [
      ["homework-class-1", "class-1", "반 1 과제"],
      ["homework-class-2", "class-2", "반 2 과제"],
    ]) {
      await homeworkInsert.bind(id, title, "과제 설명", classId, "2026-10-10", "18:00", "active", "2026-10-01").run();
      await homeworkSubmissionInsert.bind(id, "student-a", 0, null).run();
    }

    const recentBase = await mf.dispatchFetch("http://local/api/class-exam-assignments/recent-summary?limit=1000");
    const recentBaseText = await recentBase.text();
    assert.equal(recentBase.status, 200, recentBaseText);
    const recentBaseBody = JSON.parse(recentBaseText);
    assert.equal(recentBaseBody.assignments.length, 1000);
    assert.equal(recentBaseBody.assignments.some(row => row.id === "assignment-old-exact"), false,
      "the exact fixture really is outside the unfiltered latest 1000");

    const filtered = await mf.dispatchFetch(
      "http://local/api/class-exam-assignments/recent-summary?" + new URLSearchParams({
        limit: "1000", from: "2020-01-10", to: "2020-01-10", grade: "고1", class: "class-target",
        subject: "COMMON_MATH_1", subject_term: "공통수학1", query: "오래된 정확 검색",
      }).toString(),
    );
    const filteredBody = await filtered.json();
    assert.equal(filtered.status, 200, JSON.stringify(filteredBody));
    assert.deepEqual(filteredBody.assignments.map(row => row.id), ["assignment-old-exact"],
      "date, target grade, class, subject and title filters are applied before LIMIT");
    const fallbackClasses = [{ id: "class-target", name: "고1 대상반", grade: "고1" }];
    const gradeLabelFallback = history.normalizeAssignments(
      [{ ...filteredBody.assignments[0], grade_label: "고1" }], fallbackClasses, [], core,
    );
    assert.equal(gradeLabelFallback[0].contentGrade, "고1",
      "legacy non-Saved Paper rows retain the grade_label fallback");
    const payloadGradeFallback = history.normalizeAssignments(
      [{ ...filteredBody.assignments[0], mixed_payload_json: JSON.stringify({ meta: { grade: "고2" } }) }],
      fallbackClasses, [], core,
    );
    assert.equal(payloadGradeFallback[0].contentGrade, "고2",
      "legacy list rows retain the payload.meta.grade fallback");

    const savedRecent = await mf.dispatchFetch(
      "http://local/api/class-exam-assignments/recent-summary?class=class-recent-grade&limit=100",
    );
  const savedRecentBody = await savedRecent.json();
  assert.equal(savedRecent.status, 200, JSON.stringify(savedRecentBody));
  const singleSavedRecent = await mf.dispatchFetch(
    "http://local/api/class-exam-assignments/recent-summary?class=class-recent-grade&limit=1",
  );
  assert.equal(singleSavedRecent.status, 200);
  assert.equal(
    Number(savedRecent.headers.get("X-Fixture-D1-Prepares")),
    Number(singleSavedRecent.headers.get("X-Fixture-D1-Prepares")),
    "Recent D1 query count must not grow with the number of Saved Paper assignments",
  );
    const sameGradeRecent = await mf.dispatchFetch(
      "http://local/api/class-exam-assignments/recent-summary?class=class-other&limit=20",
    );
    const sameGradeBody = await sameGradeRecent.json();
    assert.equal(sameGradeRecent.status, 200, JSON.stringify(sameGradeBody));
    const recentById = new Map([...savedRecentBody.assignments, ...sameGradeBody.assignments]
      .map(row => [row.id, row]));
    assert.equal(recentById.get("recent-saved-cross")?.class_grade, "고1");
    assert.equal(recentById.get("recent-saved-cross")?.content_grade, "고2",
      "the D1 Saved Paper grade must override a misleading old payload/meta grade");
    assert.equal(recentById.get("recent-saved-same")?.content_grade, "고2",
      "same-grade saved history keeps the saved content context");
    assert.equal(recentById.get("recent-saved-unknown")?.content_grade, null,
      "a missing Saved Paper row remains unknown");
    assert.equal(recentById.get("recent-saved-archived")?.content_grade, "고2",
      "ARCHIVED library state must not erase historical content grade");
    assert.equal(recentById.get("recent-saved-trashed")?.content_grade, "고3",
      "TRASHED and soft-deleted Saved Papers remain visible in historical assignment metadata");
    for (const row of recentById.values()) {
      assert.equal(Object.hasOwn(row, "mixed_payload_json"), false,
        "Recent must not project a large Assignment payload");
      assert.equal(Object.hasOwn(row, "snapshot_json"), false,
        "Recent must not project a Saved Paper snapshot");
    }

    const recentClassRows = (await db.prepare("SELECT id,name,grade FROM classes").all()).results;
    const normalizedRecent = history.normalizeAssignments(
      [...savedRecentBody.assignments, ...sameGradeBody.assignments],
      recentClassRows,
      [],
      core,
    );
    const normalizedById = new Map(normalizedRecent.map(row => [row.id, row]));
    assert.deepEqual(
      [normalizedById.get("recent-saved-mixed").targetGrade,
        normalizedById.get("recent-saved-mixed").contentGrade],
      ["고1", "고2"],
      "the actual D1 response sent to normalizeAssignments keeps mixed source content context separate from target grade",
    );
    assert.deepEqual(
      [normalizedById.get("recent-saved-same").targetGrade,
        normalizedById.get("recent-saved-same").contentGrade],
      ["고2", "고2"],
    );
    assert.equal(normalizedById.get("recent-saved-unknown").contentGrade, "",
      "unknown content grade must not be filled from the target class grade");
    assert.equal(normalizedById.get("recent-saved-trashed").isCancelled, true);
    assert.equal(normalizedById.get("recent-saved-trashed").replacesAssignmentId, "recent-saved-archived");
    assert.equal(normalizedById.get("recent-saved-archived").replacementAssignmentId, "recent-saved-trashed");
    const filteredByTargetGrade = history.filterAssignments(normalizedRecent, { grade: "고1" });
    assert.ok(filteredByTargetGrade.some(row => row.id === "recent-saved-cross" && row.contentGrade === "고2"),
      "the Recent grade filter follows target class grade, not Saved Paper content grade");
    assert.equal(filteredByTargetGrade.some(row => row.id === "recent-saved-same"), false);
    const unauthorizedClassRecent = await mf.dispatchFetch(
      "http://local/api/class-exam-assignments/recent-summary?class=class-recent-grade",
      { headers: { "X-Fixture-Role": "teacher", "X-Fixture-Teacher": "teacher-a" } },
    );
    assert.equal(unauthorizedClassRecent.status, 403,
      "adding a Saved Paper grade join must not widen existing class access");

    const clientSubjectTerms = {
      ALGEBRA: ["대수", "수학I"],
      CALCULUS: ["미적분Ⅰ", "미적분I", "수학II"],
      CALCULUS_ADVANCED: ["미적분Ⅱ", "미적분II", "미적분"],
      PROB_STATS: ["확률과 통계", "확률과통계"],
    };
    for (const [semanticSubject, terms] of Object.entries(clientSubjectTerms)) {
      const params = new URLSearchParams({ subject: semanticSubject, class: "class-target" });
      terms.forEach(term => params.append("subject_term", term));
      const response = await mf.dispatchFetch(
        "http://local/api/class-exam-assignments/recent-summary?" + params.toString(),
      );
      const body = await response.json();
      assert.equal(response.status, 200, `${semanticSubject}: ${JSON.stringify(body)}`);
      assert.deepEqual(
        body.assignments.map(row => row.id).sort(),
        subjectAliasIds.get(semanticSubject).sort(),
        `${semanticSubject} filters cover every listed subject spelling in assignment.subject and mixed metadata`,
      );
    }

    // Use actual endpoint responses, including the fields absent from the old
    // picker mock. Keep target filters before LIMIT and content grade separate.
    await db.prepare("ALTER TABLE classes ADD COLUMN grade_label TEXT").run();
    await db.prepare("ALTER TABLE classes ADD COLUMN teacher_name TEXT DEFAULT 'Teacher A'").run();
    await db.prepare("ALTER TABLE classes ADD COLUMN is_active INTEGER DEFAULT 1").run();
    const gradeCases = [
      ["explicit", "졸업반", "고3", "", "고3"],
      ["label", "졸업반", "", "고3", "고3"],
      ["name", "고3 이름반", "", "", "고3"],
      ["space", "졸업반", "고 3", "", "고3"],
      ["unicode-space", "졸업반", "\t고\u20033", "", "고3"],
      ["first-name-match", "중2 · 고3", "", "", "중2"],
      ["invalid", "고3 반", "대학", "고3", ""],
      ["invalid-label", "고3 반", "", "대학", ""],
      ["whitespace-priority", "졸업반", " ", "고3", ""],
      ["whitespace-name", "고3 반", " ", "대학", "고3"],
      ["unknown", "졸업반", "", "", ""],
    ];
    for (const [id, name, grade, label] of gradeCases) {
      await db.prepare("INSERT INTO classes(id,name,grade,grade_label) VALUES(?,?,?,?)")
        .bind(`grade-${id}`, name, grade, label).run();
      await assignmentInsert.bind(
        `grade-${id}`, `grade-${id}`, "grade authority fallback", "2026-10-04", 1,
        `MIXED:archive2-saved-grade-${id}`, "mixed", "", "대수", "ready", "",
        "paper-cross", null, "2026-10-04", "2026-10-04", null,
      ).run();
    }
    const qrResponse = await mf.dispatchFetch("http://local/api/qr-classes");
    const qrBody = await qrResponse.json();
    assert.equal(qrResponse.status, 200, JSON.stringify(qrBody));
    const index = fs.readFileSync(path.join(root, "archive/index.html"), "utf8");
    const picker = { Archive2History: history };
    vm.runInNewContext(index.slice(index.indexOf("function getIndexClassGrade(row) {"),
      index.indexOf("function getIndexClassTeacherId(row) {")), picker);
    for (const [id, , , , expectedGrade] of gradeCases) {
      const row = qrBody.classes.find(row => row.id === `grade-${id}`);
      assert.ok(row, id);
      assert.equal(picker.getIndexClassGrade(row), expectedGrade, `real picker response: ${id}`);
      assert.deepEqual(Array.from(picker.getIndexAvailableGrades([row])), expectedGrade ? [expectedGrade] : [], id);
      if (expectedGrade) assert.equal(checkTargetClassGrade(row), expectedGrade, id);
      else assert.throws(() => checkTargetClassGrade(row), error => error.status === 409, id);
    }
    for (const targetGrade of ["대학", "고3", "중2"]) {
      // The API accepts arbitrary query text; unsupported grades must not match.
      const params = new URLSearchParams({ grade: targetGrade, query: "grade authority", limit: "1000" });
      const response = await mf.dispatchFetch("http://local/api/class-exam-assignments/recent-summary?" + params);
      const body = await response.json();
      assert.equal(response.status, 200, JSON.stringify(body));
      const expectedIds = gradeCases.filter(row => row[4] === targetGrade).map(row => `grade-${row[0]}`).sort();
      assert.deepEqual(body.assignments.map(row => row.id).sort(), expectedIds, `server target filter: ${targetGrade}`);
      const normalized = history.normalizeAssignments(body.assignments, qrBody.classes, [], core);
      assert.deepEqual(history.filterAssignments(normalized, { grade: targetGrade }).map(row => row.id).sort(), expectedIds);
      assert.ok(normalized.every(row => row.contentGrade === "고2"), "Saved Paper content grade never supplies target grade");
    }
    const limitedGradeResponse = await mf.dispatchFetch(
      "http://local/api/class-exam-assignments/recent-summary?grade=" + encodeURIComponent("고3") + "&query=grade%20authority&limit=2",
    );
    assert.equal((await limitedGradeResponse.json()).assignments.length, 2, "fallback grade filtering precedes LIMIT");

    const tokenFor = studentId => crypto.createHash("sha256")
      .update(`${studentId}::student-portal:v1`).digest("hex");
    const listUrl = `http://local/api/student-portal/exams?student_id=student-a&token=${tokenFor("student-a")}`;
    const bounded = await mf.dispatchFetch(listUrl);
    const boundedBody = await bounded.json();
    assert.equal(bounded.status, 200);
    assert.equal(boundedBody.exams.length, 150);
    assert.equal(boundedBody.exams.some(row => row.assignment_id === "assignment-old-exact"), false,
      "general student list remains bounded and does not include the old exact fixture");

    const exact = await mf.dispatchFetch(`${listUrl}&assignment_id=assignment-old-exact`);
    const exactBody = await exact.json();
    assert.equal(exact.status, 200, JSON.stringify(exactBody));
    assert.deepEqual(exactBody.exams.map(row => row.assignment_id), ["assignment-old-exact"]);

    const otherStudent = await mf.dispatchFetch(
      `http://local/api/student-portal/exams?student_id=student-b&token=${tokenFor("student-b")}&assignment_id=assignment-old-exact`,
    );
    assert.deepEqual((await otherStudent.json()).exams, [], "another student cannot read an exact Assignment");

    const teacherPreview = await mf.dispatchFetch(
      "http://local/api/student-portal/exams?student_id=student-a&assignment_id=assignment-old-exact",
      { headers: { "X-Fixture-Role": "admin" } },
    );
    const teacherPreviewBody = await teacherPreview.json();
    assert.equal(teacherPreview.status, 200);
    assert.equal(teacherPreviewBody.access_mode, "teacher_preview");
    assert.deepEqual(teacherPreviewBody.exams.map(row => row.assignment_id), ["assignment-old-exact"]);

    const teacherHeaders = {
      "X-Fixture-Role": "teacher",
      "X-Fixture-Teacher": "teacher-a",
    };
    const exactClass1Teacher = await mf.dispatchFetch(
      "http://local/api/student-portal/exams?student_id=student-a&assignment_id=assignment-class-1",
      { headers: teacherHeaders },
    );
    const exactClass1TeacherBody = await exactClass1Teacher.json();
    assert.equal(exactClass1Teacher.status, 200, JSON.stringify(exactClass1TeacherBody));
    assert.deepEqual(exactClass1TeacherBody.exams.map(row => row.assignment_id), ["assignment-class-1"]);

    const exactClass2Teacher = await mf.dispatchFetch(
      "http://local/api/student-portal/exams?student_id=student-a&assignment_id=assignment-class-2",
      { headers: teacherHeaders },
    );
    const exactClass2TeacherBody = await exactClass2Teacher.json();
    assert.equal(exactClass2Teacher.status, 403, JSON.stringify(exactClass2TeacherBody));
    assert.match(exactClass2TeacherBody.message, /반의 시험지를 확인할 권한/);

    const exactClass2PdfTeacher = await mf.dispatchFetch(
      "http://local/api/student-portal/exam-pdf?student_id=student-a&assignment_id=assignment-class-2",
      { headers: teacherHeaders },
    );
    assert.equal(exactClass2PdfTeacher.status, 403,
      "teacher-preview PDF reads use the same exact Assignment class authority");

    const teacherHome = await mf.dispatchFetch(
      "http://local/api/student-portal/home?student_id=student-a",
      { headers: teacherHeaders },
    );
    const teacherHomeBody = await teacherHome.json();
    assert.equal(teacherHome.status, 200, JSON.stringify(teacherHomeBody));
    assert.deepEqual(teacherHomeBody.assignments.map(row => row.assignment_id), ["homework-class-1"]);
    assert.ok(teacherHomeBody.class_exam_assignments.length > 0);
    assert.ok(teacherHomeBody.class_exam_assignments.every(row => row.class_id === "class-1"));
    assert.equal(teacherHomeBody.assignments.some(row => row.assignment_id === "homework-class-2"), false);
    assert.equal(teacherHomeBody.class_exam_assignments.some(row => row.assignment_id === "assignment-class-2"), false);

    const teacherGeneralExams = await mf.dispatchFetch(
      "http://local/api/student-portal/exams?student_id=student-a",
      { headers: teacherHeaders },
    );
    const teacherGeneralExamsBody = await teacherGeneralExams.json();
    assert.equal(teacherGeneralExams.status, 200, JSON.stringify(teacherGeneralExamsBody));
    assert.ok(teacherGeneralExamsBody.exams.length > 0);
    assert.ok(teacherGeneralExamsBody.exams.every(row => row.class_id === "class-1"));
    assert.equal(teacherGeneralExamsBody.exams.some(row => row.assignment_id === "assignment-class-2"), false);
    const teacherClass1Exam = teacherGeneralExamsBody.exams.find(row => row.assignment_id === "assignment-class-1");
    assert.equal(teacherClass1Exam.is_submitted, 0,
      "an unauthorized sibling-class session cannot leak into a matching exam row");
    assert.equal(teacherClass1Exam.session_id, null);

    const adminHome = await mf.dispatchFetch(
      "http://local/api/student-portal/home?student_id=student-a",
      { headers: { "X-Fixture-Role": "admin" } },
    );
    const adminHomeBody = await adminHome.json();
    assert.equal(adminHome.status, 200, JSON.stringify(adminHomeBody));
    assert.deepEqual(new Set(adminHomeBody.assignments.map(row => row.assignment_id)),
      new Set(["homework-class-1", "homework-class-2"]));
    assert.ok(adminHomeBody.class_exam_assignments.some(row => row.class_id === "class-1"));
    assert.ok(adminHomeBody.class_exam_assignments.some(row => row.class_id === "class-2"));

    const studentHome = await mf.dispatchFetch(
      `http://local/api/student-portal/home?student_id=student-a&token=${tokenFor("student-a")}`,
    );
    const studentHomeBody = await studentHome.json();
    assert.equal(studentHome.status, 200, JSON.stringify(studentHomeBody));
    assert.deepEqual(new Set(studentHomeBody.assignments.map(row => row.assignment_id)),
      new Set(["homework-class-1", "homework-class-2"]));
    assert.ok(studentHomeBody.class_exam_assignments.some(row => row.class_id === "class-1"));
    assert.ok(studentHomeBody.class_exam_assignments.some(row => row.class_id === "class-2"));

    const studentGeneralExams = await mf.dispatchFetch(listUrl);
    const studentGeneralExamsBody = await studentGeneralExams.json();
    assert.equal(studentGeneralExams.status, 200, JSON.stringify(studentGeneralExamsBody));
    assert.ok(studentGeneralExamsBody.exams.some(row => row.assignment_id === "assignment-class-2"));

    for (const assignmentId of ["assignment-class-1", "assignment-class-2"]) {
      const adminExact = await mf.dispatchFetch(
        `http://local/api/student-portal/exams?student_id=student-a&assignment_id=${assignmentId}`,
        { headers: { "X-Fixture-Role": "admin" } },
      );
      const adminExactBody = await adminExact.json();
      assert.equal(adminExact.status, 200, JSON.stringify(adminExactBody));
      assert.deepEqual(adminExactBody.exams.map(row => row.assignment_id), [assignmentId]);

      const studentExact = await mf.dispatchFetch(`${listUrl}&assignment_id=${assignmentId}`);
      const studentExactBody = await studentExact.json();
      assert.equal(studentExact.status, 200, JSON.stringify(studentExactBody));
      assert.deepEqual(studentExactBody.exams.map(row => row.assignment_id), [assignmentId]);
    }
    const teacherOtherRecipient = await mf.dispatchFetch(
      "http://local/api/student-portal/exams?student_id=student-b&assignment_id=assignment-class-1",
      { headers: teacherHeaders },
    );
    assert.deepEqual((await teacherOtherRecipient.json()).exams, [],
      "class authority does not replace exact student-recipient binding");
    const otherStudentExact = await mf.dispatchFetch(
      `http://local/api/student-portal/exams?student_id=student-b&token=${tokenFor("student-b")}&assignment_id=assignment-class-1`,
    );
    assert.deepEqual((await otherStudentExact.json()).exams, [],
      "another student's token cannot read the Assignment recipient's exact row");

    for (const [assignmentId, visible] of [
      ["class1-cancelled-submitted", true],
      ["class1-cancelled-unsubmitted", false],
      ["class1-excluded-submitted", true],
    ]) {
      const response = await mf.dispatchFetch(
        `http://local/api/student-portal/exams?student_id=student-a&assignment_id=${assignmentId}`,
        { headers: teacherHeaders },
      );
      const body = await response.json();
      assert.equal(response.status, 200, JSON.stringify(body));
      assert.equal(body.exams.length, visible ? 1 : 0, assignmentId);
      if (visible) assert.equal(body.exams[0].is_review_only, true, assignmentId);
    }

    for (const [id, expected] of [
      ["cancelled-submitted", true],
      ["cancelled-unsubmitted", false],
      ["excluded-submitted", true],
    ]) {
      const response = await mf.dispatchFetch(`${listUrl}&assignment_id=${id}`);
      const body = await response.json();
      assert.equal(response.status, 200, JSON.stringify(body));
      assert.equal(body.exams.length, expected ? 1 : 0, id);
      if (expected) assert.equal(body.exams[0].is_review_only, true, id);
    }

    const optionalGradeSchemas = [
      { name: "Saved Paper table absent", savedPaperTableSql: "", assignmentHasSavedPaperId: true },
      {
        name: "Saved Paper grade column absent",
        savedPaperTableSql: "CREATE TABLE archive_saved_papers(id TEXT PRIMARY KEY)",
        savedPaperInsertSql: "INSERT INTO archive_saved_papers(id) VALUES(?)",
        savedPaperInsertArgs: ["paper-capability"],
        assignmentHasSavedPaperId: true,
      },
      {
        name: "Saved Paper id column absent",
        savedPaperTableSql: "CREATE TABLE archive_saved_papers(grade TEXT)",
        savedPaperInsertSql: "INSERT INTO archive_saved_papers(grade) VALUES(?)",
        savedPaperInsertArgs: ["고2"],
        assignmentHasSavedPaperId: true,
      },
      {
        name: "Assignment saved_paper_id column absent",
        savedPaperTableSql: "CREATE TABLE archive_saved_papers(id TEXT PRIMARY KEY,grade TEXT)",
        savedPaperInsertSql: "INSERT INTO archive_saved_papers(id,grade) VALUES(?,?)",
        savedPaperInsertArgs: ["paper-capability", "고2"],
        assignmentHasSavedPaperId: false,
      },
    ];
    for (const schemaCase of optionalGradeSchemas) {
      const capabilityMf = new Miniflare({
        modules: true,
        script: bundle.outputFiles[0].text,
        compatibilityDate: "2026-07-11",
        compatibilityFlags: ["nodejs_compat"],
        d1Databases: ["DB"],
      });
      try {
        const capabilityDb = await capabilityMf.getD1Database("DB");
        await capabilityDb.prepare("CREATE TABLE classes(id TEXT PRIMARY KEY,name TEXT,grade TEXT)").run();
        if (schemaCase.savedPaperTableSql) {
          await capabilityDb.prepare(schemaCase.savedPaperTableSql).run();
          if (schemaCase.savedPaperInsertSql)
            await capabilityDb.prepare(schemaCase.savedPaperInsertSql).bind(...schemaCase.savedPaperInsertArgs).run();
        }
        const assignmentColumns = [
          "id TEXT PRIMARY KEY", "class_id TEXT", "exam_title TEXT", "exam_date TEXT",
          "question_count INTEGER", "archive_file TEXT", "updated_at TEXT",
          ...(schemaCase.assignmentHasSavedPaperId ? ["saved_paper_id TEXT"] : []),
        ];
        await capabilityDb.prepare(`CREATE TABLE class_exam_assignments(${assignmentColumns.join(",")})`).run();
        await capabilityDb.prepare("INSERT INTO classes VALUES(?,?,?)")
          .bind("capability-class", "고1 capability class", "고1").run();
        const assignmentNames = [
          "id", "class_id", "exam_title", "exam_date", "question_count", "archive_file", "updated_at",
          ...(schemaCase.assignmentHasSavedPaperId ? ["saved_paper_id"] : []),
        ];
        const assignmentValues = [
          "capability-assignment", "capability-class", "Capability schema", "2026-10-01", 1,
          "MIXED:archive2-capability", "2026-10-01T00:00:00.000Z",
          ...(schemaCase.assignmentHasSavedPaperId ? ["paper-capability"] : []),
        ];
        await capabilityDb.prepare(
          `INSERT INTO class_exam_assignments(${assignmentNames.join(",")}) VALUES(${assignmentNames.map(() => "?").join(",")})`,
        ).bind(...assignmentValues).run();
        const response = await capabilityMf.dispatchFetch(
          "http://local/api/class-exam-assignments/recent-summary?class=capability-class&limit=10",
        );
        const body = await response.json();
        assert.equal(response.status, 200, `${schemaCase.name}: ${JSON.stringify(body)}`);
        assert.equal(body.assignments[0]?.content_grade, null,
          `${schemaCase.name} must return unknown content grade without breaking Recent`);
      } finally {
        await capabilityMf.dispose();
      }
    }
  } finally {
    await mf.dispose();
  }
});

test("Recent workspace request carries its filter state and debounces refetches", async () => {
  const source = fs.readFileSync(path.join(root, "archive/archive2-workspace.js"), "utf8");
  const cardStart = source.indexOf("  function recentAssignmentMarkup() {");
  const cardEnd = source.indexOf("  function updateRecentResults()", cardStart);
  assert.ok(cardStart >= 0 && cardEnd > cardStart);
  assert.doesNotMatch(source.slice(cardStart, cardEnd), /\/status/,
    "recent cards never add a per-Assignment status request");
  const start = source.indexOf("  function recentSubjectTerms(subjectKey) {");
  const end = source.indexOf("  async function assignmentStatus(id) {", start);
  assert.ok(start >= 0 && end > start);
  const calls = [];
  const timers = new Map();
  let nextTimer = 1;
  const context = {
    URL,
    URLSearchParams,
    console,
    recentRefetchTimer: null,
    state: {
      recentLoadVersion: 0,
      recentLoading: false,
      recentError: "",
      recentAssignments: [],
      recentRows: [],
      recentFilters: { from: "2020-01-10", to: "2020-01-10", grade: "고1", subject: "ALGEBRA", query: "오래된 시험" },
      recentClassId: "class-target",
      catalog: { exams: [] },
      view: "recent",
    },
    classRows: [{ id: "class-target", name: "고1 대상반", grade: "고1" }],
    C: {
      subjectProjectionOptions: () => [],
      HIGH_SEMANTIC_SUBJECTS: [{ value: "ALGEBRA", label: "대수", courseKeys: ["수학I", "대수"] }],
    },
    History: {
      classGrade: history.classGrade,
      subjectOptions: () => [],
      normalizeAssignments: rows => rows,
    },
    updateRecentResults() {},
    replaceUrlState() {},
    render() {},
    status() {},
    setTimeout(callback, delay) { const id = nextTimer++; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    async api(url) {
      calls.push(String(url));
      return { assignments: [{ id: "assignment-old-exact" }] };
    },
  };
  vm.runInNewContext("const recentSubjectOptionUniverse = new Map();\n" + source.slice(start, end), context);
  await context.loadRecent();
  const first = new URL(calls[0], "https://archive.test");
  for (const [key, value] of Object.entries({
    limit: "1000", from: "2020-01-10", to: "2020-01-10", grade: "고1", class: "class-target",
    subject: "ALGEBRA", query: "오래된 시험",
  })) assert.equal(first.searchParams.get(key), value);
  assert.deepEqual(first.searchParams.getAll("subject_term"), ["대수", "수학I"]);

  context.changeRecentFilter({ dataset: { recentFilter: "query" }, value: "정확 검색" });
  assert.equal(calls.length, 1, "query keystrokes wait for the debounced refetch");
  assert.deepEqual([...timers.values()].map(timer => timer.delay), [300]);
  for (const timer of timers.values()) await timer.callback();
  assert.equal(calls.length, 2);
  assert.equal(new URL(calls[1], "https://archive.test").searchParams.get("query"), "정확 검색");
});
