import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
const require = createRequire(import.meta.url);
import core from "../archive/archive2-core.js";
import source from "../archive/archive2-source.js";
import {
  buildQuestionSnapshot,
  resolveSavedPaperSourceGrades,
} from "../apmath/worker-backup/worker/helpers/archive2-questions.js";
const outputContract = require("../archive/archive2-output-contract.js");
import {
  prepareSavedPaperBatch,
  SAVED_PAPER_SCHEMA,
  stableStringify,
} from "../apmath/worker-backup/worker/helpers/archive-saved-papers.js";
import { runRc2 } from "./archive2-rc2-boundaries.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const worker = path.join(root, "apmath/worker-backup/worker");
const requireWorker = createRequire(path.join(worker, "package.json"));
const { Miniflare } = requireWorker("miniflare");
const { build } = requireWorker("esbuild");
const { catalog } = require("./helpers/archive2-scope-harness.cjs");
const serving = process.argv.includes("--serve");
const fixturePort = Number(process.env.ARCHIVE2_FIXTURE_PORT || 8790);
let canonicalBundleUnavailable = false;
let canonicalManifestFetches = 0;
function archiveAssetResponse(input) {
  const pathname = decodeURIComponent(new URL(String(input?.url || input)).pathname);
  if (pathname.endsWith("/archive/data/archive2-canonical-input-manifest.json")) {
    canonicalManifestFetches += 1;
    if (canonicalBundleUnavailable)
      return new Response("authority unavailable", { status: 503 });
  }
  const archivePrefix = "/AP------/archive/";
  const docsPrefix = "/AP------/docs/";
  const file = pathname.startsWith(archivePrefix)
    ? path.join(root, "archive", pathname.slice(archivePrefix.length))
    : pathname.startsWith(docsPrefix)
      ? path.join(root, "docs", pathname.slice(docsPrefix.length))
      : "";
  if (!file) return new Response("Not found", { status: 404 });
  const relative = path.relative(root, file);
  if (relative.startsWith("..") || path.isAbsolute(relative) || !fs.existsSync(file) || !fs.statSync(file).isFile())
    return new Response("Not found", { status: 404 });
  return new Response(fs.readFileSync(file), { status: 200 });
}
const bundle = await build({
  stdin: {
    contents: `import { handleExams } from './routes/exams.js';
import { handleStudentPortal } from './routes/student-portal.js';
import { handleWrongClinics } from './routes/wrong-clinics.js';
let splitFault=false;
export default {async fetch(request, env) {
const url=new URL(request.url);
if(!url.pathname.startsWith('/api/'))return env.FIXTURE_ASSETS.fetch(request);
const role=request.headers.get('X-Fixture-Role') || (request.headers.get('Authorization')==='Bearer fixture-admin'?'admin':null);
const teacher=role ? {id:role==='admin'?'admin':role==='teacher-b'?'teacher-b':'teacher-a',role:role==='admin'?'admin':'teacher'} : null;
if(url.pathname==='/api/__fixture/split-failure'&&teacher){splitFault=true;return Response.json({success:true});}
if(url.pathname==='/api/class-exam-assignments/studio'&&splitFault){const body=await request.clone().json();if(body.question_count<50){splitFault=false;return Response.json({success:false,error:'검증용 후속 문제지 충돌: 이 문제지만 수정한 뒤 재시도하세요.'},{status:409});}}
if(url.pathname==='/api/qr-classes'&&teacher)return Response.json({success:true,classes:(await env.DB.prepare('SELECT * FROM classes').all()).results});
if(url.pathname==='/api/student-portal/home')return Response.json({success:true,read_only:!!teacher,access_mode:teacher?'teacher_preview':'student',student:await env.DB.prepare('SELECT id,name,grade,school_name FROM students WHERE id=?').bind(url.searchParams.get('student_id')).first(),classes:[],assignments:[],class_exam_assignments:[]});
if(url.pathname==='/api/student-portal/wrong-clinics')return Response.json({success:true,packets:[]});
if(url.pathname.startsWith('/api/wrong-clinics'))return handleWrongClinics(request,env,teacher,url.pathname.split('/').filter(Boolean),url);
if(url.pathname.startsWith('/api/student-portal/'))return handleStudentPortal(request,env,teacher,url.pathname.split('/').filter(Boolean),url);
return handleExams(request,env,teacher,url.pathname.split('/').filter(Boolean),url);
}}`,
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
  r2Buckets: ["EXAM_PDF_BUCKET"],
  bindings: { ARCHIVE2_ENABLED: "true" },
  serviceBindings: {
    ARCHIVE2_ASSETS: archiveAssetResponse,
    FIXTURE_ASSETS: (request) => {
      const pathname = decodeURIComponent(new URL(request.url).pathname),
        file = path.resolve(root, "." + pathname);
      const relative = path.relative(root, file);
      if (
        relative.startsWith("..") ||
        path.isAbsolute(relative) ||
        !fs.existsSync(file) ||
        !fs.statSync(file).isFile()
      )
        return new Response("Not found", { status: 404 });
      const ext = path.extname(file),
        mime =
          {
            ".html": "text/html",
            ".js": "application/javascript",
            ".mjs": "application/javascript",
            ".json": "application/json",
            ".css": "text/css",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".svg": "image/svg+xml",
            ".png": "image/png",
            ".jpg": "image/jpeg",
          }[ext] || "application/octet-stream";
      let content = fs.readFileSync(file);
      if (ext === ".html")
        content = Buffer.from(
          content
            .toString("utf8")
            .replaceAll(
              "https://ap-math-os-v2612.js-pdf.workers.dev/api",
              new URL(request.url).origin + "/api",
            )
            .replace(
              "<head>",
              "<head><script>window.APMATH_API_BASE=location.origin+'/api';</script>",
            ),
        );
      if (pathname === "/apmath/student/index.html") {
        const studentId =
          new URL(request.url).searchParams.get("fixtureStudent") ||
          "student-a";
        const token = crypto
          .createHash("sha256")
          .update(studentId + "::student-portal:v1")
          .digest("hex");
        content = Buffer.from(
          content
            .toString("utf8")
            .replace(
              "<head>",
              `<head><script>localStorage.setItem('APMATH_STUDENT_PORTAL_SESSION',JSON.stringify(${JSON.stringify({ student_id: studentId, student_token: token, name: "검증학생", grade: "고1" })}));</script>`,
            ),
        );
      }
      if (["/archive/workspace.html", "/archive/index.html"].includes(pathname))
        content = Buffer.from(
          content
            .toString("utf8")
            .replace(
              "<head>",
              `<head><script>window.APMATH_API_BASE=location.origin+'/api';localStorage.setItem('APMATH_SESSION',JSON.stringify({id:'fixture-admin',role:'admin',session_token:'fixture-admin'}));</script>`,
            )
            .replace(
              "<body>",
              '<body><p style="padding:8px;background:#fff4db;margin:0">로컬 runtime 검증 · 합성 학생만 사용 · production 연결 없음</p>',
            ),
        );
      return new Response(content, {
        headers: { "Content-Type": mime + "; charset=utf-8" },
      });
    },
  },
  port: serving ? fixturePort : 0,
});
try {
  const db = await mf.getD1Database("DB");
  const schema = fs.readFileSync(path.join(worker, "schema.sql"), "utf8");
  for (const name of [
    "class_exam_assignments",
    "class_exam_assignment_recipients",
    "class_exam_assignment_exclusions",
    "exam_blueprints",
    "exam_sessions",
    "wrong_answers",
  ]) {
    const statement = schema.match(
      new RegExp(
        "CREATE TABLE IF NOT EXISTS " + name + " \\([\\s\\S]*?\\n\\);",
      ),
    );
    assert.ok(statement, name);
    await db.prepare(statement[0]).run();
  }
  await db.exec(
    "CREATE TABLE classes(id TEXT PRIMARY KEY,name TEXT,teacher_name TEXT,grade TEXT DEFAULT '고1');CREATE TABLE students(id TEXT PRIMARY KEY,name TEXT,school_name TEXT DEFAULT '',grade TEXT DEFAULT '고1',student_pin TEXT DEFAULT '',status TEXT DEFAULT '재원');CREATE TABLE class_students(class_id TEXT,student_id TEXT);CREATE TABLE teacher_classes(teacher_id TEXT,class_id TEXT);CREATE TABLE attendance(student_id TEXT,status TEXT,date TEXT);ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;",
  );
  const migration = fs.readFileSync(
    path.join(worker, "migrations/20260916_archive2_question_bridge.sql"),
    "utf8",
  );
  // D1 exec is line-oriented; SQLite trigger bodies are issued as one statement.
  const plain = migration
    .slice(0, migration.indexOf("CREATE TRIGGER"))
    .replace(/--[^\n]*/g, "");
  for (const sql of plain
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean))
    await db.prepare(sql).run();
  await db.prepare(migration.slice(migration.indexOf("CREATE TRIGGER"))).run();
  const savedPaperMigration = fs.readFileSync(
    path.join(worker, "migrations/20260929_archive_saved_papers.sql"),
    "utf8",
  );
  const savedTriggerIndex = savedPaperMigration.indexOf("CREATE TRIGGER");
  const savedPlain = savedPaperMigration.slice(0, savedTriggerIndex).replace(/--[^\n]*/g, "");
  for (const sql of savedPlain.split(";").map((s) => s.trim()).filter(Boolean))
    await db.prepare(sql).run();
  await db.prepare(savedPaperMigration.slice(savedTriggerIndex)).run();

  const stage1FixtureInsert = "INSERT INTO archive_saved_papers (id,owner_teacher_id,save_batch_id,part_index,part_count,title,grade,subject,question_count,snapshot_json,snapshot_hash,save_request_hash,source_index_version,schema_version,created_at,deleted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const stage1Snapshot = JSON.stringify({ questions: [{ questionUid: "qid_v1_stage1", content: "frozen" }], meta: { title: "Stage 1", qpp: 4 } });
  for (const [id, batch, deletedAt] of [
    ["stage1-parent", "stage1-batch-parent", null],
    ["stage1-active", "stage1-batch-active", null],
    ["stage1-deleted", "stage1-batch-deleted", "2026-01-01T00:00:00.000Z"],
    ["stage1-shared-child", "stage1-batch-shared", null],
    ["stage1-common-child", "stage1-batch-common", null],
  ]) {
    await db.prepare(stage1FixtureInsert).bind(
      id, "stage1-owner", batch, 0, 1, "Stage 1", "고1", "수학", 1, stage1Snapshot,
      "a".repeat(64), "b".repeat(64), "legacy-index", SAVED_PAPER_SCHEMA,
      "2026-01-01T00:00:00.000Z", deletedAt,
    ).run();
  }
  const stage1AssignmentHash = "c".repeat(64);
  await db.prepare("INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,archive_file,source_type,mixed_payload_json,subject,pdf_qpp,archive2_write_key,archive2_snapshot_hash,saved_paper_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(
    "stage1-existing-assignment", "stage1-class", "Stage 1", "2026-01-01", 1,
    "MIXED:stage1", "mixed", '{"questions":[{"content":"frozen"}],"meta":{"qpp":4}}',
    "수학", 4, "stage1-write-key", stage1AssignmentHash, null,
  ).run();

  const lifecycleMigrationPath = path.join(worker, "migrations/20261002_archive2_paper_lifecycle_foundation.sql");
  assert.ok(fs.existsSync(lifecycleMigrationPath), "Stage 1 additive persistence migration must exist");
  const lifecycleMigration = fs.readFileSync(lifecycleMigrationPath, "utf8");
  const lifecycleTriggers = [...lifecycleMigration.matchAll(/CREATE TRIGGER IF NOT EXISTS.*?END;/gs)]
    .map(match => match[0]);
  const lifecyclePlain = lifecycleMigration
    .replace(/CREATE TRIGGER IF NOT EXISTS.*?END;/gs, "")
    .replace(/--.*$/gm, "");
  for (const sql of lifecyclePlain.split(";").map(value => value.trim()).filter(Boolean))
    await db.prepare(sql).run();
  for (const trigger of lifecycleTriggers) await db.prepare(trigger).run();

  assert.equal(Number((await db.prepare("SELECT COUNT(*) n FROM archive_saved_paper_library_metadata").first()).n), 0,
    "migration must not mass-backfill sidecar rows");
  const cancellationColumn = (await db.prepare("PRAGMA table_info(class_exam_assignments)").all()).results
    .find(column => column.name === "cancelled_at");
  assert.ok(cancellationColumn);
  assert.equal(cancellationColumn.notnull, 0);
  const lifecycleHelper = await import("../apmath/worker-backup/worker/helpers/archive-saved-papers.js");
  const resolveStatus = lifecycleHelper.resolveSavedPaperLibraryStatus;
  assert.equal(typeof resolveStatus, "function");
  const legacyActive = await db.prepare("SELECT * FROM archive_saved_papers WHERE id=?").bind("stage1-active").first();
  const legacyDeleted = await db.prepare("SELECT * FROM archive_saved_papers WHERE id=?").bind("stage1-deleted").first();
  assert.equal(resolveStatus(legacyActive, null), "ACTIVE");
  assert.equal(resolveStatus(legacyDeleted, null), "TRASHED");
  const immutablePaperFields = [legacyActive.title, legacyActive.snapshot_json, legacyActive.snapshot_hash];
  await db.prepare("INSERT INTO archive_saved_paper_library_metadata (saved_paper_id,owner_teacher_id,display_name,status,note,tags_json,is_favorite) VALUES (?,?,?,?,?,?,?)").bind(
    "stage1-active", "stage1-owner", "Stage 1 보관함 이름", "ACTIVE", "note", '["tag"]', 1,
  ).run();
  await db.prepare("UPDATE archive_saved_paper_library_metadata SET display_name=?,status=?,note=?,tags_json=?,is_favorite=? WHERE saved_paper_id=?").bind(
    "바뀐 표시 이름", "ARCHIVED", "new note", '["review"]', 0, "stage1-active",
  ).run();
  const changedMetadata = await db.prepare("SELECT * FROM archive_saved_paper_library_metadata WHERE saved_paper_id=?").bind("stage1-active").first();
  assert.equal(resolveStatus(legacyActive, changedMetadata), "ARCHIVED");
  const unchangedPaper = await db.prepare("SELECT title,snapshot_json,snapshot_hash FROM archive_saved_papers WHERE id=?").bind("stage1-active").first();
  assert.deepEqual([unchangedPaper.title, unchangedPaper.snapshot_json, unchangedPaper.snapshot_hash], immutablePaperFields);
  await db.prepare("INSERT INTO archive_saved_paper_library_metadata (saved_paper_id,owner_teacher_id,status) VALUES (?,?,?)").bind(
    "stage1-deleted", "stage1-owner", "ACTIVE",
  ).run();
  assert.equal(resolveStatus(legacyDeleted,
    await db.prepare("SELECT * FROM archive_saved_paper_library_metadata WHERE saved_paper_id=?").bind("stage1-deleted").first()), "TRASHED");

  const lineageInsert = "INSERT INTO archive_saved_paper_lineage (child_saved_paper_id,parent_kind,parent_id,parent_revision,parent_snapshot_hash,derivation_type) VALUES (?,?,?,?,?,?)";
  for (const row of [
    ["stage1-active", "SAVED_PAPER", "stage1-parent", null, "a".repeat(64), "REVISION"],
    ["stage1-shared-child", "SHARED_PAPER", "future-shared-id", "revision-7", "d".repeat(64), "FORK"],
    ["stage1-common-child", "COMMON_PAPER", "future-common-id", "revision-2", "e".repeat(64), "COPY"],
  ]) await db.prepare(lineageInsert).bind(...row).run();
  assert.equal((await db.prepare("SELECT parent_kind FROM archive_saved_paper_lineage WHERE child_saved_paper_id=?").bind("stage1-shared-child").first()).parent_kind, "SHARED_PAPER");
  await assert.rejects(
    db.prepare(lineageInsert).bind("stage1-common-child", "COMMON_PAPER", "invalid", null, null, "DUPLICATE").run(),
    /ARCHIVE_SAVED_PAPER_LINEAGE_IMMUTABLE|CHECK constraint/i,
  );
  await assert.rejects(
    db.prepare("UPDATE archive_saved_paper_lineage SET parent_id=? WHERE child_saved_paper_id=?").bind("mutated", "stage1-shared-child").run(),
    /ARCHIVE_SAVED_PAPER_LINEAGE_IMMUTABLE/,
  );

  const eventInsert = "INSERT INTO class_exam_assignment_lifecycle_events (event_id,assignment_id,related_assignment_id,saved_paper_id,student_id,actor_teacher_id,operation,operation_identity,metadata_json) VALUES (?,?,?,?,?,?,?,?,?)";
  for (const [operation, identity, relatedId, studentId] of [
    ["ADD_RECIPIENTS", "stage1-add", "parent-assignment", null],
    ["EXCLUDE", "stage1-exclude", null, "student-a"],
    ["RESTORE", "stage1-restore", null, "student-a"],
    ["CANCEL", "stage1-cancel", null, null],
    ["REPLACEMENT_ASSIGNMENT", "stage1-replacement", "old-assignment", null],
  ]) await db.prepare(eventInsert).bind(
    "event-" + identity, "stage1-existing-assignment", relatedId, "stage1-active",
    studentId, "teacher-stage1", operation, identity, "{}",
  ).run();
  await assert.rejects(
    db.prepare(eventInsert).bind("event-retry", "stage1-existing-assignment", null, null, null, "teacher-stage1", "RETRY", "stage1-retry", "{}").run(),
    /CHECK constraint/i,
  );
  await assert.rejects(
    db.prepare("DELETE FROM class_exam_assignment_lifecycle_events WHERE event_id=?").bind("event-stage1-cancel").run(),
    /ARCHIVE_ASSIGNMENT_EVENT_IMMUTABLE/,
  );
  const preservedAssignment = await db.prepare("SELECT archive2_snapshot_hash,mixed_payload_json,cancelled_at FROM class_exam_assignments WHERE id=?").bind("stage1-existing-assignment").first();
  assert.equal(preservedAssignment.archive2_snapshot_hash, stage1AssignmentHash);
  assert.equal(preservedAssignment.mixed_payload_json, '{"questions":[{"content":"frozen"}],"meta":{"qpp":4}}');
  assert.equal(preservedAssignment.cancelled_at, null);
  await db.prepare("DELETE FROM class_exam_assignments WHERE id=?").bind("stage1-existing-assignment").run();
  const assignmentContextMigrationPath = path.join(worker, "migrations/20261002_archive2_assignment_context.sql");
  assert.ok(fs.existsSync(assignmentContextMigrationPath), "Stage 5 frozen Assignment context migration must exist");
  const assignmentContextMigration = fs.readFileSync(assignmentContextMigrationPath, "utf8");
  const assignmentContextTriggers = [...assignmentContextMigration.matchAll(/CREATE TRIGGER IF NOT EXISTS.*?END;/gs)]
    .map(match => match[0]);
  const assignmentContextPlain = assignmentContextMigration
    .replace(/CREATE TRIGGER IF NOT EXISTS.*?END;/gs, "")
    .replace(/--.*$/gm, "");
  for (const sql of assignmentContextPlain.split(";").map(value => value.trim()).filter(Boolean))
    await db.prepare(sql).run();
  for (const trigger of assignmentContextTriggers) await db.prepare(trigger).run();
  assert.equal(Number((await db.prepare("SELECT COUNT(*) AS n FROM archive2_assignment_context_snapshots").first()).n), 0,
    "frozen Assignment context migration must not fabricate history for legacy rows");
  await db.prepare(`INSERT INTO archive2_assignment_context_snapshots
    (assignment_id,saved_paper_id,saved_paper_snapshot_hash,output_context_hash,assignment_context_hash,context_json)
    VALUES (?,?,?,?,?,?)`).bind(
    "stage1-existing-assignment", "stage1-active", "a".repeat(64), "b".repeat(64), "c".repeat(64), "{}",
  ).run();
  await assert.rejects(
    db.prepare("UPDATE archive2_assignment_context_snapshots SET context_json=? WHERE assignment_id=?")
      .bind('{"mutated":true}', "stage1-existing-assignment").run(),
    /ARCHIVE2_ASSIGNMENT_CONTEXT_IMMUTABLE/,
  );
  await assert.rejects(
    db.prepare("DELETE FROM archive2_assignment_context_snapshots WHERE assignment_id=?")
      .bind("stage1-existing-assignment").run(),
    /ARCHIVE2_ASSIGNMENT_CONTEXT_IMMUTABLE/,
  );
  console.info("paper lifecycle persistence foundation PASS");

  await db.exec(
    "INSERT INTO classes VALUES ('class-a','고1 검증반 A','Teacher A','고1'),('class-b','고1 검증반 B','Teacher B','고1');INSERT INTO students(id,name) VALUES ('student-a','검증학생 가'),('student-b','검증학생 나'),('student-c','검증학생 다');INSERT INTO class_students VALUES ('class-a','student-a'),('class-a','student-b'),('class-b','student-c');INSERT INTO teacher_classes VALUES ('teacher-a','class-a');",
  );
  await db.prepare("ALTER TABLE classes ADD COLUMN grade_label TEXT").run();
  await db.prepare("INSERT INTO classes (id,name,teacher_name,grade) VALUES (?,?,?,?)")
    .bind("class-h2", "고2 saved paper target", "Teacher A", "고2").run();
  await db.prepare("INSERT INTO students(id,name,grade,status) VALUES (?,?,?,?)")
    .bind("student-h2", "저장본 검증학생", "고2", "active").run();
  await db.prepare("INSERT INTO students(id,name,grade,status) VALUES (?,?,?,?)")
    .bind("student-h2-b", "추가 배포 검증학생", "고2", "active").run();
  await db.prepare("INSERT INTO class_students VALUES (?,?)")
    .bind("class-h2", "student-h2").run();
  await db.prepare("INSERT INTO class_students VALUES (?,?)")
    .bind("class-h2", "student-h2-b").run();
  await db.prepare("INSERT INTO teacher_classes VALUES (?,?)")
    .bind("teacher-a", "class-h2").run();
  const addGradeTargetClass = async ({ id, name, grade, gradeLabel = "", studentId }) => {
    await db.prepare("INSERT INTO classes (id,name,teacher_name,grade,grade_label) VALUES (?,?,?,?,?)")
      .bind(id, name, "Teacher A", grade, gradeLabel).run();
    await db.prepare("INSERT INTO students(id,name,grade,status) VALUES (?,?,?,?)")
      .bind(studentId, `${name} 학생`, grade || gradeLabel || "고1", "active").run();
    await db.prepare("INSERT INTO class_students VALUES (?,?)").bind(id, studentId).run();
    await db.prepare("INSERT INTO teacher_classes VALUES (?,?)").bind("teacher-a", id).run();
  };
  for (const [shortGrade, grade] of [["m1", "중1"], ["m2", "중2"], ["m3", "중3"], ["h1", "고1"], ["h3", "고3"]])
    await addGradeTargetClass({
      id: `class-target-${shortGrade}`,
      name: `${grade} Saved Paper 대상반`,
      grade,
      studentId: `student-target-${shortGrade}`,
    });
  await addGradeTargetClass({
    id: "class-target-grade-label",
    name: "학년 라벨 대상반",
    grade: "",
    gradeLabel: "중1",
    studentId: "student-target-grade-label",
  });
  await addGradeTargetClass({
    id: "class-target-name-fallback",
    name: "고3 이름 fallback 대상반",
    grade: "",
    studentId: "student-target-name-fallback",
  });
  await addGradeTargetClass({
    id: "class-target-invalid-grade",
    name: "고1 이름 fallback 금지반",
    grade: "고4",
    studentId: "student-target-invalid-grade",
  });
  await addGradeTargetClass({
    id: "class-target-unknown-grade",
    name: "담당 학년 미확인반",
    grade: "",
    studentId: "student-target-unknown-grade",
  });
  const base = catalog.records.find((r) => r.automatic && r.sourceGrade === "고1" &&
    (!process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX || r.sourceFile.startsWith(process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX)));
  const records = catalog.records
    .filter(
      (r) =>
        r.automatic &&
        (!process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX || r.sourceFile.startsWith(process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX)) &&
        r.curriculumKey === base.curriculumKey &&
        r.courseKey === base.courseKey,
    )
    .slice(0, 2);
  const uid = (n) => records[n - 1].questionUid;
  const questions = records.map((record) => {
    const bank = source.evaluate(
      fs.readFileSync(
        path.join(root, "archive/exams", record.sourceFile),
        "utf8",
      ),
      record.sourceFile,
    );
    const q = {
      ...bank[record.sourceOrdinal - 1],
      questionUid: record.questionUid,
      sourceArchiveFile: record.sourceFile,
      sourceOrdinal: record.sourceOrdinal,
      sourceFingerprint: record.sourceFingerprint,
    };
    // Raw source rows may carry retired overlay fields; runtime metadata must come only from canonical authority.
    for (const field of core.META_FIELDS) delete q[field];
    for (const field of core.META_FIELDS)
      if (record[field] !== undefined) q[field] = record[field];
    return q;
  });
  const payload = {
    contract_version: "archive2-v1",
    class_id: "class-a",
    student_ids: ["student-a"],
    exam_title: "Runtime",
    exam_date: "2026-09-16",
    question_count: 2,
    archive_file: "MIXED:archive2-runtime",
    history_mode: "all",
    index_version: catalog.indexVersion,
    selection_filters: {
      grade: base.sourceGrade,
      primaryPaths: [
        ...new Set(records.map((record) => core.pathKey(record, 4))),
      ],
    },
    mixed_payload_json: {
      questions,
      meta: { questionUids: questions.map((q) => q.questionUid) },
    },
  };
  const post = async (action, body, role = "admin") => {
    const response = await mf.dispatchFetch(
      "http://local/api/class-exam-assignments/" + action,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(body.contract_version
            ? { "X-Archive2-Contract": body.contract_version }
            : {}),
          ...(role ? { "X-Fixture-Role": role } : {}),
        },
        body: JSON.stringify(body),
      },
    );
    return { status: response.status, body: await response.json() };
  };

  const sharedRecord = catalog.records.find((row) => row.automatic && row.sourceGrade === "고2" &&
    core.subjectProjectionForRecord(row, "", catalog.projectionPolicy) &&
    core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  assert.ok(sharedRecord, "saved-paper route fixture needs a real approved high2 shared-subject source");
  const sharedQuestion = {
    ...source.evaluate(
      fs.readFileSync(path.join(root, "archive/exams", sharedRecord.sourceFile), "utf8"),
      sharedRecord.sourceFile,
    )[sharedRecord.sourceOrdinal - 1],
    questionUid: sharedRecord.questionUid,
    sourceArchiveFile: sharedRecord.sourceFile,
    sourceOrdinal: sharedRecord.sourceOrdinal,
    sourceQuestionNo: sharedRecord.sourceQuestionNo,
    sourceFingerprint: sharedRecord.sourceFingerprint,
  };
  for (const field of core.META_FIELDS)
    if (sharedRecord[field] !== undefined) sharedQuestion[field] = sharedRecord[field];
  const semanticSubject = core.subjectProjectionForRecord(sharedRecord, "", catalog.projectionPolicy);
  const savedPaperEnv = {
    ARCHIVE_PUBLIC_BASE_URL: "https://archive.test/AP------/archive",
    ARCHIVE2_ASSETS: { fetch: archiveAssetResponse },
  };
  const savedPapers = [];
  for (const [index, browseGrade] of ["고2", "고3"].entries()) {
    const saveBatchId = index === 0
      ? "33333333-3333-4333-8333-333333333333"
      : "44444444-4444-4444-8444-444444444444";
    const selectionFilters = {
      grade: browseGrade,
      curriculumKey: sharedRecord.curriculumKey,
      semanticSubject,
      primaryPaths: [core.pathKey(sharedRecord, 4)],
      scopeQuestionUids: [sharedRecord.questionUid],
    };
    const prepared = await prepareSavedPaperBatch(savedPaperEnv, {
      schema_version: SAVED_PAPER_SCHEMA,
      save_batch_id: saveBatchId,
      index_version: catalog.indexVersion,
      selection_filters: selectionFilters,
      papers: [{
        part_index: 0,
        questions: [structuredClone(sharedQuestion)],
        meta: { title: `공유 source ${browseGrade}`, qpp: 4, questionUids: [sharedRecord.questionUid] },
      }],
    });
    const paper = prepared.papers[0];
    const id = crypto.randomUUID();
    await db.prepare(`INSERT INTO archive_saved_papers (
      id,owner_teacher_id,save_batch_id,part_index,part_count,title,grade,subject,question_count,
      snapshot_json,snapshot_hash,save_request_hash,source_index_version,schema_version,created_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      id, "teacher-a", saveBatchId, paper.part_index, 1, paper.title, paper.grade, paper.subject,
      paper.question_count, paper.snapshot_json, paper.snapshot_hash, prepared.requestHash,
      paper.source_index_version, paper.schema_version, new Date().toISOString(),
    ).run();
    const snapshot = JSON.parse(paper.snapshot_json);
    assert.equal(snapshot.questions[0].sourceGrade, "고2",
      "the Worker save path must freeze actual source grade separately from the browse grade");
    assert.equal(snapshot.meta.grade, browseGrade);
    savedPapers.push({ id, browseGrade });
  }
  const manifestFetchesBeforeDelivery = canonicalManifestFetches;
  canonicalBundleUnavailable = true;
  const savedPaperDeliveries = [];
  try {
    for (const paper of savedPapers) {
      const delivery = await post("", {
        contract_version: "archive2-v1",
        class_id: "class-h2",
        exam_title: "shared saved source delivery",
        student_ids: ["student-h2"],
        exam_date: "2026-10-02",
        saved_paper_id: paper.id,
        assignment_batch_id: paper.browseGrade === "고2"
          ? "55555555-5555-4555-8555-555555555555"
          : "66666666-6666-4666-8666-666666666666",
      }, "teacher");
      assert.equal(delivery.body.saved, true, JSON.stringify(delivery));
      assert.equal(delivery.status, 502,
        "the snapshot delivery should reach the expected local no-Browser-Rendering boundary");
      const outputResponse = await mf.dispatchFetch(
        `http://local/api/class-exam-assignments/${encodeURIComponent(delivery.body.assignment.id)}/output?mode=ans`,
        { headers: { "X-Fixture-Role": "teacher" } },
      );
      const outputData = await outputResponse.json();
      assert.equal(outputResponse.status, 200, JSON.stringify(outputData));
      assert.equal(outputData.envelope.contractVersion, "archive2-output-envelope-v1");
      assert.equal(outputData.envelope.assignmentId, delivery.body.assignment.id);
      assert.equal(outputData.envelope.paperId, paper.id);
      assert.equal(outputData.envelope.mode, "ans");
      await outputContract.validateOutputEnvelope(outputData.envelope, {
        outputRequestId: outputData.envelope.outputRequestId,
        ownerId: outputData.envelope.ownerId,
        mode: "ans",
      }, crypto.webcrypto);
      assert.deepEqual(outputData.envelope.questionUids, [sharedRecord.questionUid]);
      const boardResponse = await mf.dispatchFetch(
        "http://local/api/class-exam-assignments/board?grade=%EA%B3%A02&from=2026-09-02&to=2026-10-02",
        { headers: { "X-Fixture-Role": "teacher" } },
      );
      const boardData = await boardResponse.json();
      assert.equal(boardResponse.status, 200, JSON.stringify(boardData));
      const boardRow = boardData.assignments.find(row => row.id === delivery.body.assignment.id);
      assert.ok(boardRow, "board should retain the exact assignment identity");
      assert.equal(boardRow.has_output_snapshot, true);
      assert.equal(boardRow.can_read_snapshot, true,
        "a teacher assigned to the exact class may read its snapshot");
      assert.ok(boardRow.archive2_snapshot_hash);
      assert.equal(Object.prototype.hasOwnProperty.call(boardRow, "mixed_payload_json"), false,
        "board listing should not materialize the full payload before the direct output action");
      const peerBoardResponse = await mf.dispatchFetch(
        "http://local/api/class-exam-assignments/board?grade=%EA%B3%A02&from=2026-09-02&to=2026-10-02",
        { headers: { "X-Fixture-Role": "teacher-b" } },
      );
      const peerBoard = await peerBoardResponse.json();
      const peerRow = peerBoard.assignments.find(row => row.id === delivery.body.assignment.id);
      assert.ok(peerRow, "same-grade board listing must retain another teacher's row");
      assert.equal(peerRow.has_output_snapshot, true);
      assert.equal(peerRow.can_read_snapshot, false,
        "snapshot-read authority must use teacher ID and exact class ID");
      const peerOutputResponse = await mf.dispatchFetch(
        `http://local/api/class-exam-assignments/${encodeURIComponent(delivery.body.assignment.id)}/output?mode=ans`,
        { headers: { "X-Fixture-Role": "teacher-b" } },
      );
      assert.equal(peerOutputResponse.status, 403,
        "direct output endpoint must enforce the same read authority advertised by the board");
      savedPaperDeliveries.push({
        browseGrade: paper.browseGrade,
        saved: delivery.body.saved,
        status: delivery.status,
        assignmentId: delivery.body.assignment.id,
      });
    }
  } finally {
    canonicalBundleUnavailable = false;
  }
  const manifestFetchesDuringSavedPaperDelivery = canonicalManifestFetches - manifestFetchesBeforeDelivery;
  assert.equal(manifestFetchesDuringSavedPaperDelivery, 0,
    "saved snapshot delivery must not reload the current canonical catalog or manifest");
  assert.deepEqual(savedPaperDeliveries.map(row => [row.saved, row.status]), [[true, 502], [true, 502]],
    "the same high2 source must have the same delivery decision from high2 and high3 browse views");
  const studentH2Token = crypto.createHash("sha256").update("student-h2::student-portal:v1").digest("hex");
  const beforeCancelPortalResponse = await mf.dispatchFetch(
    `http://local/api/student-portal/exams?student_id=student-h2&token=${studentH2Token}`,
  );
  const beforeCancelPortal = await beforeCancelPortalResponse.json();
  assert.equal(beforeCancelPortalResponse.status, 200, JSON.stringify(beforeCancelPortal));
  assert.ok(beforeCancelPortal.exams.some(row => row.assignment_id === savedPaperDeliveries[0].assignmentId),
    "an active Saved Paper Assignment appears in the student portal");
  const parentAssignmentContext = await db.prepare(
    "SELECT * FROM archive2_assignment_context_snapshots WHERE assignment_id=?",
  ).bind(savedPaperDeliveries[0].assignmentId).first();
  const parentSavedPaper = await db.prepare("SELECT * FROM archive_saved_papers WHERE id=?")
    .bind(savedPapers[0].id).first();
  const parentAssignmentRow = await db.prepare("SELECT * FROM class_exam_assignments WHERE id=?")
    .bind(savedPaperDeliveries[0].assignmentId).first();
  const parentAssignmentPayload = JSON.parse(parentAssignmentRow.mixed_payload_json);
  assert.equal(parentAssignmentContext.saved_paper_id, savedPapers[0].id);
  assert.equal(parentAssignmentContext.saved_paper_snapshot_hash, parentSavedPaper.snapshot_hash);
  const parentFrozenContext = JSON.parse(parentAssignmentContext.context_json);
  assert.equal(parentFrozenContext.content.snapshotHash, parentSavedPaper.snapshot_hash);
  assert.equal(parentFrozenContext.assignment.classId, "class-h2");
  assert.equal(parentFrozenContext.assignment.examDate, "2026-10-02");
  assert.deepEqual(parentFrozenContext.assignment.targetStudentIds, ["student-h2"]);
  assert.deepEqual(parentFrozenContext.assignment.qrTarget, { identityKind: "ASSIGNMENT_ID" });
  assert.equal(parentAssignmentContext.assignment_id, savedPaperDeliveries[0].assignmentId);
  assert.equal(parentFrozenContext.output.qpp, 4);
  assert.equal(parentFrozenContext.output.includeQr, false);
  assert.equal(parentFrozenContext.output.qpp, parentAssignmentPayload.meta.qpp);
  assert.equal(parentFrozenContext.output.includeQr, parentAssignmentPayload.meta.includeQr);
  assert.deepEqual(parentFrozenContext.output.printHeaderOptions, parentAssignmentPayload.meta.printHeaderOptions);
  assert.equal(parentAssignmentContext.output_context_hash,
    crypto.createHash("sha256").update(JSON.stringify(parentFrozenContext.output)).digest("hex"));
  assert.equal(parentAssignmentContext.assignment_context_hash,
    crypto.createHash("sha256").update(JSON.stringify(parentFrozenContext.assignment)).digest("hex"));
  const repeatSamePaper = await post("", {
    contract_version: "archive2-v1",
    class_id: "class-h2",
    student_ids: ["student-h2"],
    exam_date: "2026-10-04",
    saved_paper_id: savedPapers[0].id,
    assignment_batch_id: "99999999-9999-4999-8999-999999999999",
  }, "teacher");
  assert.equal(repeatSamePaper.body.saved, true, JSON.stringify(repeatSamePaper));
  const repeatContext = await db.prepare(
    "SELECT * FROM archive2_assignment_context_snapshots WHERE assignment_id=?",
  ).bind(repeatSamePaper.body.assignment.id).first();
  assert.equal(repeatContext.saved_paper_snapshot_hash, parentSavedPaper.snapshot_hash);
  assert.equal(repeatContext.output_context_hash, parentAssignmentContext.output_context_hash,
    "the same Saved Paper reuses the same frozen default Output context");
  assert.notEqual(repeatContext.assignment_context_hash, parentAssignmentContext.assignment_context_hash,
    "reusing one Saved Paper on another date receives a distinct Assignment context identity");
  assert.equal(JSON.parse(repeatContext.context_json).assignment.examDate, "2026-10-04");
  const deliveredSavedCount = await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignments WHERE saved_paper_id IS NOT NULL AND class_id='class-h2'",
  ).first();
  assert.equal(Number(deliveredSavedCount.n), 3,
    "the same immutable Saved Paper can have multiple independently identified delivery contexts");
  const parentAssignmentId = savedPaperDeliveries[0].assignmentId;
  const parentPaperId = savedPapers[0].id;
  const addRecipientsBody = {
    contract_version: "archive2-v1",
    assignment_operation: "ADD_RECIPIENTS",
    related_assignment_id: parentAssignmentId,
    class_id: "class-h2",
    student_ids: ["student-h2-b"],
    exam_date: "2026-10-02",
    saved_paper_id: parentPaperId,
    assignment_batch_id: "77777777-7777-4777-8777-777777777777",
  };
  const addedRecipients = await post("", addRecipientsBody, "teacher");
  assert.equal(addedRecipients.body.saved, true, JSON.stringify(addedRecipients));
  assert.equal(addedRecipients.status, 502, "local PDF binding is intentionally absent after the Assignment commit");
  const addedAssignmentId = addedRecipients.body.assignment.id;
  assert.notEqual(addedAssignmentId, parentAssignmentId,
    "ADD_RECIPIENTS creates a distinct frozen Assignment identity");
  const addEvent = await db.prepare(
    "SELECT * FROM class_exam_assignment_lifecycle_events WHERE assignment_id=? AND operation='ADD_RECIPIENTS'",
  ).bind(addedAssignmentId).first();
  assert.equal(addEvent.related_assignment_id, parentAssignmentId);
  assert.equal(addEvent.saved_paper_id, parentPaperId);
  assert.equal(JSON.parse(addEvent.metadata_json).student_ids[0], "student-h2-b");
  const childAssignmentContext = await db.prepare(
    "SELECT * FROM archive2_assignment_context_snapshots WHERE assignment_id=?",
  ).bind(addedAssignmentId).first();
  const childFrozenContext = JSON.parse(childAssignmentContext.context_json);
  assert.equal(childAssignmentContext.saved_paper_snapshot_hash, parentSavedPaper.snapshot_hash,
    "the second Assignment points at the same immutable Saved Paper content");
  assert.notEqual(childAssignmentContext.assignment_context_hash, parentAssignmentContext.assignment_context_hash,
    "recipient/date/Assignment identity is independent from content identity");
  assert.deepEqual(childFrozenContext.assignment.targetStudentIds, ["student-h2-b"]);
  assert.equal(childFrozenContext.assignment.relatedAssignmentId, parentAssignmentId);
  const childRecipient = await db.prepare(`
    SELECT r.student_id,x.student_id AS excluded_student_id
    FROM class_exam_assignment_recipients r
    LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id=r.assignment_id AND x.student_id=r.student_id
    WHERE r.assignment_id=? AND r.student_id=?
  `).bind(addedAssignmentId, "student-h2-b").first();
  assert.equal(childRecipient.student_id, "student-h2-b");
  assert.equal(childRecipient.excluded_student_id, null,
    "the new Assignment freezes the added student without changing the parent's roster");
  const parentExcludedRecipient = await db.prepare(
    "SELECT reason FROM class_exam_assignment_exclusions WHERE assignment_id=? AND student_id=?",
  ).bind(parentAssignmentId, "student-h2-b").first();
  assert.equal(parentExcludedRecipient.reason, "archive2_target", "the original frozen Assignment roster stays unchanged");
  const retryAddRecipients = await post("", addRecipientsBody, "teacher");
  assert.equal(retryAddRecipients.body.assignment.id, addedAssignmentId);
  assert.equal(Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignment_lifecycle_events WHERE operation='ADD_RECIPIENTS' AND related_assignment_id=?",
  ).bind(parentAssignmentId).first()).n), 1);
  const changedAddRetry = await post("", { ...addRecipientsBody, student_ids: ["student-h2"] }, "teacher");
  assert.equal(changedAddRetry.status, 409, "one ADD_RECIPIENTS identity cannot be reused for another frozen roster");
  const studentH2BToken = crypto.createHash("sha256").update("student-h2-b::student-portal:v1").digest("hex");
  assert.equal(await db.prepare("SELECT 1 FROM exam_sessions WHERE assignment_id=? AND student_id=?")
    .bind(addedAssignmentId, "student-h2-b").first(), null,
  "the additional recipient has no submitted session before cancellation");
  const cancelUnsubmittedChild = await mf.dispatchFetch(
    `http://local/api/class-exam-assignments/${encodeURIComponent(addedAssignmentId)}/cancel`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
      body: JSON.stringify({ operation_identity: "88888888-8888-4888-8888-888888888880" }),
    },
  );
  assert.equal(cancelUnsubmittedChild.status, 200, await cancelUnsubmittedChild.clone().text());
  const unsubmittedCancelPortalResponse = await mf.dispatchFetch(
    `http://local/api/student-portal/exams?student_id=student-h2-b&token=${studentH2BToken}`,
  );
  const unsubmittedCancelPortal = await unsubmittedCancelPortalResponse.json();
  assert.equal(unsubmittedCancelPortalResponse.status, 200, JSON.stringify(unsubmittedCancelPortal));
  assert.equal(unsubmittedCancelPortal.exams.some(row => row.assignment_id === addedAssignmentId), false,
    "an unsubmitted cancelled Assignment stays hidden from the student portal");
  await db.batch([
    db.prepare("DELETE FROM class_exam_assignment_exclusions WHERE assignment_id=?").bind(addedAssignmentId),
    db.prepare("DELETE FROM class_exam_assignment_recipients WHERE assignment_id=?").bind(addedAssignmentId),
    db.prepare("DELETE FROM class_exam_assignment_questions WHERE assignment_id=?").bind(addedAssignmentId),
    db.prepare("DELETE FROM class_exam_assignments WHERE id=?").bind(addedAssignmentId),
  ]);
  assert.equal(Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignment_lifecycle_events WHERE assignment_id=?",
  ).bind(addedAssignmentId).first()).n), 2,
  "append-only Assignment lifecycle events survive legacy Assignment cleanup");
  await db.batch([
    db.prepare("DELETE FROM class_exam_assignment_exclusions WHERE assignment_id=?").bind(repeatSamePaper.body.assignment.id),
    db.prepare("DELETE FROM class_exam_assignment_recipients WHERE assignment_id=?").bind(repeatSamePaper.body.assignment.id),
    db.prepare("DELETE FROM class_exam_assignment_questions WHERE assignment_id=?").bind(repeatSamePaper.body.assignment.id),
    db.prepare("DELETE FROM class_exam_assignments WHERE id=?").bind(repeatSamePaper.body.assignment.id),
  ]);

  const parentAssignmentBeforeOps = await db.prepare("SELECT * FROM class_exam_assignments WHERE id=?")
    .bind(parentAssignmentId).first();
  const preservedSessionId = crypto.randomUUID();
  await db.prepare(`INSERT INTO exam_sessions
    (id,student_id,exam_title,score,exam_date,question_count,class_id,archive_file,assignment_id)
    VALUES (?,?,?,?,?,?,?,?,?)`).bind(
    preservedSessionId, "student-h2", parentAssignmentBeforeOps.exam_title, 1,
    parentAssignmentBeforeOps.exam_date, parentAssignmentBeforeOps.question_count,
    parentAssignmentBeforeOps.class_id, parentAssignmentBeforeOps.archive_file, parentAssignmentId,
  ).run();
  await db.prepare("INSERT INTO wrong_answers (session_id,question_id,student_id) VALUES (?,?,?)")
    .bind(preservedSessionId, "1", "student-h2").run();
  const preservedSessionBefore = await db.prepare("SELECT * FROM exam_sessions WHERE id=?")
    .bind(preservedSessionId).first();
  const preservedWrongAnswersBefore = await db.prepare("SELECT * FROM wrong_answers WHERE session_id=? ORDER BY question_id")
    .bind(preservedSessionId).all();

  const excludeRequestId = "88888888-8888-4888-8888-888888888881";
  const excludeBody = {
    assignment_id: parentAssignmentId,
    class_id: "class-h2",
    student_id: "student-h2",
    exam_title: parentAssignmentBeforeOps.exam_title,
    exam_date: parentAssignmentBeforeOps.exam_date,
    archive_file: parentAssignmentBeforeOps.archive_file,
    operation_identity: excludeRequestId,
  };
  const excludeResponse = await mf.dispatchFetch("http://local/api/class-exam-assignments/exclude-student", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify(excludeBody),
  });
  const excludeResult = await excludeResponse.json();
  assert.equal(excludeResponse.status, 200, JSON.stringify(excludeResult));
  assert.equal((await db.prepare("SELECT id FROM exam_sessions WHERE id=?").bind(preservedSessionId).first()).id,
    preservedSessionId, "EXCLUDE retains the original submission session");
  assert.equal(Number((await db.prepare("SELECT COUNT(*) AS n FROM wrong_answers WHERE session_id=?").bind(preservedSessionId).first()).n),
    1, "EXCLUDE retains wrong-answer history");
  const excludeEventIdentity = `EXCLUDE:${parentAssignmentId}:${excludeRequestId}:student-h2`;
  const excludeEvent = await db.prepare("SELECT * FROM class_exam_assignment_lifecycle_events WHERE operation_identity=?")
    .bind(excludeEventIdentity).first();
  assert.equal(excludeEvent.student_id, "student-h2");
  const addManualExcludedRecipient = await post("", {
    ...addRecipientsBody,
    student_ids: ["student-h2"],
    assignment_batch_id: "77777777-7777-4777-8777-777777777778",
  }, "teacher");
  assert.equal(addManualExcludedRecipient.status, 409,
    "ADD_RECIPIENTS cannot bypass an explicit manual EXCLUDE with a second Assignment");
  const excludeReplay = await mf.dispatchFetch("http://local/api/class-exam-assignments/exclude-student", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify(excludeBody),
  });
  assert.equal((await excludeReplay.json()).idempotent, true);
  assert.equal(Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignment_lifecycle_events WHERE operation='EXCLUDE' AND assignment_id=? AND student_id='student-h2'",
  ).bind(parentAssignmentId).first()).n), 1);

  const restoreRequestId = "88888888-8888-4888-8888-888888888882";
  const restoreBody = { assignment_id: parentAssignmentId, student_id: "student-h2", operation_identity: restoreRequestId };
  const restoreResponse = await mf.dispatchFetch("http://local/api/class-exam-assignments/restore-student", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify(restoreBody),
  });
  assert.equal(restoreResponse.status, 200, await restoreResponse.clone().text());
  assert.equal(await db.prepare(
    "SELECT 1 FROM class_exam_assignment_exclusions WHERE assignment_id=? AND student_id=? AND reason='manual'",
  ).bind(parentAssignmentId, "student-h2").first(), null);
  assert.equal((await db.prepare("SELECT id FROM exam_sessions WHERE id=?").bind(preservedSessionId).first()).id,
    preservedSessionId);
  assert.equal(Number((await db.prepare("SELECT COUNT(*) AS n FROM wrong_answers WHERE session_id=?").bind(preservedSessionId).first()).n), 1);
  const restoreEventIdentity = `RESTORE:${parentAssignmentId}:${restoreRequestId}:student-h2`;
  const restoreEvent = await db.prepare("SELECT * FROM class_exam_assignment_lifecycle_events WHERE operation_identity=?")
    .bind(restoreEventIdentity).first();
  assert.equal(restoreEvent.assignment_id, parentAssignmentId);
  const restoreReplay = await mf.dispatchFetch("http://local/api/class-exam-assignments/restore-student", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify(restoreBody),
  });
  assert.equal((await restoreReplay.json()).idempotent, true);
  assert.equal((await db.prepare(
    "SELECT context_json FROM archive2_assignment_context_snapshots WHERE assignment_id=?",
  ).bind(parentAssignmentId).first()).context_json, parentAssignmentContext.context_json,
  "EXCLUDE/RESTORE changes do not mutate the frozen Assignment context");

  const excludeBeforeCancel = await mf.dispatchFetch("http://local/api/class-exam-assignments/exclude-student", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify({ ...excludeBody, operation_identity: "88888888-8888-4888-8888-888888888884" }),
  });
  assert.equal(excludeBeforeCancel.status, 200, await excludeBeforeCancel.clone().text());
  const excludedReviewPortalResponse = await mf.dispatchFetch(
    `http://local/api/student-portal/exams?student_id=student-h2&token=${studentH2Token}`,
  );
  const excludedReviewPortal = await excludedReviewPortalResponse.json();
  assert.equal(excludedReviewPortalResponse.status, 200, JSON.stringify(excludedReviewPortal));
  const excludedReviewRow = excludedReviewPortal.exams.find(row => row.assignment_id === parentAssignmentId);
  assert.ok(excludedReviewRow, "a submitted EXCLUDE remains in student history");
  assert.equal(excludedReviewRow.is_review_only, true);
  assert.equal(excludedReviewRow.is_excluded, true);
  assert.equal(excludedReviewRow.is_cancelled, false);
  assert.equal(excludedReviewRow.is_submitted, 1);
  assert.equal(excludedReviewRow.session_id, preservedSessionId);
  const excludedOmr = await mf.dispatchFetch("http://local/api/student-portal/omr-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: "student-h2", student_token: studentH2Token, assignment_id: parentAssignmentId, wrong_ids: [1] }),
  });
  assert.equal(excludedOmr.status, 404, "a submitted review-only EXCLUDE blocks a new OMR submission");
  assert.deepEqual(await db.prepare("SELECT * FROM exam_sessions WHERE id=?").bind(preservedSessionId).first(),
    preservedSessionBefore, "EXCLUDE does not mutate any historical session field");
  assert.deepEqual((await db.prepare("SELECT * FROM wrong_answers WHERE session_id=? ORDER BY question_id")
    .bind(preservedSessionId).all()).results, preservedWrongAnswersBefore.results,
  "EXCLUDE does not mutate historical wrong-answer rows");

  const restoreBeforeCancel = await mf.dispatchFetch("http://local/api/class-exam-assignments/restore-student", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify({
      assignment_id: parentAssignmentId,
      student_id: "student-h2",
      operation_identity: "88888888-8888-4888-8888-888888888886",
    }),
  });
  assert.equal(restoreBeforeCancel.status, 200, await restoreBeforeCancel.clone().text());
  const restoredPortalResponse = await mf.dispatchFetch(
    `http://local/api/student-portal/exams?student_id=student-h2&token=${studentH2Token}`,
  );
  const restoredPortal = await restoredPortalResponse.json();
  const restoredAssignment = restoredPortal.exams.find(row => row.assignment_id === parentAssignmentId);
  assert.ok(restoredAssignment);
  assert.equal(restoredAssignment.is_review_only, false);
  assert.equal(restoredAssignment.is_excluded, false);

  const cancelRequestId = "88888888-8888-4888-8888-888888888883";
  const cancelUrl = `http://local/api/class-exam-assignments/${encodeURIComponent(parentAssignmentId)}/cancel`;
  const cancelResponse = await mf.dispatchFetch(cancelUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify({ operation_identity: cancelRequestId }),
  });
  const cancelResult = await cancelResponse.json();
  assert.equal(cancelResponse.status, 200, JSON.stringify(cancelResult));
  assert.ok(cancelResult.assignment.cancelled_at);
  assert.equal(cancelResult.assignment.mixed_payload_json, parentAssignmentBeforeOps.mixed_payload_json);
  assert.equal(cancelResult.assignment.archive2_snapshot_hash, parentAssignmentBeforeOps.archive2_snapshot_hash);
  const cancelledContext = await db.prepare(
    "SELECT * FROM archive2_assignment_context_snapshots WHERE assignment_id=?",
  ).bind(parentAssignmentId).first();
  assert.equal(cancelledContext.context_json, parentAssignmentContext.context_json,
    "CANCEL cannot mutate the frozen delivery context");
  const afterCancelPortalResponse = await mf.dispatchFetch(
    `http://local/api/student-portal/exams?student_id=student-h2&token=${studentH2Token}`,
  );
  const afterCancelPortal = await afterCancelPortalResponse.json();
  assert.equal(afterCancelPortalResponse.status, 200, JSON.stringify(afterCancelPortal));
  const cancelledReviewRow = afterCancelPortal.exams.find(row => row.assignment_id === parentAssignmentId);
  assert.ok(cancelledReviewRow, "a submitted CANCEL remains in student history");
  assert.equal(cancelledReviewRow.is_review_only, true);
  assert.equal(cancelledReviewRow.is_cancelled, true);
  assert.equal(cancelledReviewRow.is_excluded, false);
  assert.equal(cancelledReviewRow.is_submitted, 1);
  assert.equal(cancelledReviewRow.session_id, preservedSessionId);
  assert.deepEqual(await db.prepare("SELECT * FROM exam_sessions WHERE id=?").bind(preservedSessionId).first(),
    preservedSessionBefore, "CANCEL does not mutate any historical session field");
  assert.deepEqual((await db.prepare("SELECT * FROM wrong_answers WHERE session_id=? ORDER BY question_id")
    .bind(preservedSessionId).all()).results, preservedWrongAnswersBefore.results,
  "CANCEL does not mutate historical wrong-answer rows");
  const cancelledStudentPdf = await mf.dispatchFetch(
    `http://local/api/student-portal/exam-pdf?student_id=student-h2&token=${studentH2Token}&assignment_id=${encodeURIComponent(parentAssignmentId)}`,
  );
  assert.equal(cancelledStudentPdf.status, 404, "a cancelled Assignment cannot expose its PDF to students");
  const cancelledOmr = await mf.dispatchFetch("http://local/api/student-portal/omr-submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: "student-h2", student_token: studentH2Token, assignment_id: parentAssignmentId, wrong_ids: [1] }),
  });
  assert.equal(cancelledOmr.status, 404, "a cancelled Assignment blocks new OMR submissions");
  const restoreCancelled = await mf.dispatchFetch("http://local/api/class-exam-assignments/restore-student", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify({ assignment_id: parentAssignmentId, student_id: "student-h2", operation_identity: "88888888-8888-4888-8888-888888888885" }),
  });
  assert.equal(restoreCancelled.status, 409,
    "RESTORE cannot claim to reactivate a terminally cancelled Assignment");
  assert.equal(await db.prepare(
    "SELECT reason FROM class_exam_assignment_exclusions WHERE assignment_id=? AND student_id=?",
  ).bind(parentAssignmentId, "student-h2").first(), null,
  "RESTORE after cancellation leaves the restored recipient projection unchanged");
  assert.equal(await db.prepare(
    "SELECT 1 FROM class_exam_assignment_lifecycle_events WHERE operation_identity=?",
  ).bind(`RESTORE:${parentAssignmentId}:88888888-8888-4888-8888-888888888885:student-h2`).first(), null);
  const cancelledOutputResponse = await mf.dispatchFetch(
    `http://local/api/class-exam-assignments/${encodeURIComponent(parentAssignmentId)}/output?mode=ans`,
    { headers: { "X-Fixture-Role": "teacher" } },
  );
  const cancelledOutput = await cancelledOutputResponse.json();
  assert.equal(cancelledOutputResponse.status, 200, JSON.stringify(cancelledOutput));
  assert.equal(cancelledOutput.envelope.assignmentId, parentAssignmentId,
    "a cancelled Assignment remains reopenable from its historical frozen snapshot");
  assert.equal((await db.prepare("SELECT id FROM exam_sessions WHERE id=?").bind(preservedSessionId).first()).id,
    preservedSessionId, "CANCEL retains historical sessions");
  assert.equal(Number((await db.prepare("SELECT COUNT(*) AS n FROM wrong_answers WHERE session_id=?").bind(preservedSessionId).first()).n),
    1, "CANCEL retains historical wrong answers");
  const destructiveDelete = await mf.dispatchFetch(
    "http://local/api/exam-sessions/by-exam?class=" + encodeURIComponent("class-h2") +
      "&exam=" + encodeURIComponent(parentAssignmentBeforeOps.exam_title) +
      "&date=" + encodeURIComponent(parentAssignmentBeforeOps.exam_date) +
      "&archive=" + encodeURIComponent(parentAssignmentBeforeOps.archive_file) +
      "&assignment=" + encodeURIComponent(parentAssignmentId),
    { method: "DELETE", headers: { "X-Fixture-Role": "teacher" } },
  );
  assert.equal(destructiveDelete.status, 409,
    "legacy DELETE cannot erase an Archive 2.0 historical Assignment; cancellation is separate");
  assert.equal((await db.prepare("SELECT id FROM exam_sessions WHERE id=?").bind(preservedSessionId).first()).id,
    preservedSessionId);
  const cancelReplay = await mf.dispatchFetch(cancelUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Fixture-Role": "teacher" },
    body: JSON.stringify({ operation_identity: cancelRequestId }),
  });
  assert.equal((await cancelReplay.json()).assignment.cancelled_at, cancelResult.assignment.cancelled_at);
  assert.equal(Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignment_lifecycle_events WHERE operation='CANCEL' AND assignment_id=?",
  ).bind(parentAssignmentId).first()).n), 1);
  const cancelledRetry = await post("", {
    contract_version: "archive2-v1",
    class_id: "class-h2",
    student_ids: ["student-h2"],
    exam_date: "2026-10-02",
    saved_paper_id: parentPaperId,
    assignment_batch_id: "55555555-5555-4555-8555-555555555555",
  }, "teacher");
  assert.equal(cancelledRetry.status, 409, "CANCEL blocks ordinary Assignment retry");

  const sourcePaper = await db.prepare("SELECT * FROM archive_saved_papers WHERE id=?").bind(parentPaperId).first();
  const replacementSnapshot = JSON.parse(sourcePaper.snapshot_json);
  const replacementTitle = sourcePaper.title + " 수정본";
  replacementSnapshot.meta.title = replacementTitle;
  replacementSnapshot.meta.printHeaderOptions = { ...replacementSnapshot.meta.printHeaderOptions, title: replacementTitle };
  const replacementSnapshotJson = stableStringify(replacementSnapshot);
  const replacementSnapshotHash = crypto.createHash("sha256").update(replacementSnapshotJson).digest("hex");
  const replacementPaperId = crypto.randomUUID();
  const replacementBatchId = crypto.randomUUID();
  await db.prepare(`INSERT INTO archive_saved_papers (
    id,owner_teacher_id,save_batch_id,part_index,part_count,title,grade,subject,question_count,
    snapshot_json,snapshot_hash,save_request_hash,source_index_version,schema_version,created_at
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    replacementPaperId, "teacher-a", replacementBatchId, 0, 1, replacementTitle,
    sourcePaper.grade, sourcePaper.subject, sourcePaper.question_count,
    replacementSnapshotJson, replacementSnapshotHash, "a".repeat(64), sourcePaper.source_index_version,
    SAVED_PAPER_SCHEMA, new Date().toISOString(),
  ).run();
  await db.prepare("INSERT INTO archive_saved_paper_library_metadata (saved_paper_id,owner_teacher_id,status) VALUES (?,?,?)")
    .bind(replacementPaperId, "teacher-a", "ACTIVE").run();
  await db.prepare(`INSERT INTO archive_saved_paper_lineage
    (child_saved_paper_id,parent_kind,parent_id,parent_revision,parent_snapshot_hash,derivation_type)
    VALUES (?,'SAVED_PAPER',?,NULL,?,'REVISION')`).bind(
    replacementPaperId, parentPaperId, sourcePaper.snapshot_hash,
  ).run();
  const replacementAssignment = await post("", {
    contract_version: "archive2-v1",
    assignment_operation: "REPLACEMENT_ASSIGNMENT",
    related_assignment_id: parentAssignmentId,
    class_id: "class-h2",
    student_ids: ["student-h2"],
    exam_date: "2026-10-03",
    saved_paper_id: replacementPaperId,
    assignment_batch_id: replacementBatchId,
  }, "teacher");
  assert.equal(replacementAssignment.body.saved, true, JSON.stringify(replacementAssignment));
  const replacementAssignmentId = replacementAssignment.body.assignment.id;
  assert.notEqual(replacementAssignmentId, parentAssignmentId);
  const replacementEvent = await db.prepare(
    "SELECT * FROM class_exam_assignment_lifecycle_events WHERE assignment_id=? AND operation='REPLACEMENT_ASSIGNMENT'",
  ).bind(replacementAssignmentId).first();
  assert.equal(replacementEvent.related_assignment_id, parentAssignmentId);
  assert.equal(replacementEvent.saved_paper_id, replacementPaperId);
  assert.equal(JSON.parse(replacementEvent.metadata_json).parent_saved_paper_id, parentPaperId);
  const replacementContext = await db.prepare(
    "SELECT * FROM archive2_assignment_context_snapshots WHERE assignment_id=?",
  ).bind(replacementAssignmentId).first();
  assert.equal(replacementContext.saved_paper_id, replacementPaperId);
  assert.equal(replacementContext.saved_paper_snapshot_hash, replacementSnapshotHash);
  assert.notEqual(replacementContext.saved_paper_snapshot_hash, parentAssignmentContext.saved_paper_snapshot_hash,
    "replacement has a distinct Content identity as well as Assignment identity");
  const recentSummaryResponse = await mf.dispatchFetch(
    "http://local/api/class-exam-assignments/recent-summary?limit=9999",
    { headers: { "X-Fixture-Role": "teacher" } },
  );
  const recentSummary = await recentSummaryResponse.json();
  assert.equal(recentSummaryResponse.status, 200, JSON.stringify(recentSummary));
  assert.equal(recentSummary.limit, 1000, "recent summary clamps its result window");
  const parentSummary = recentSummary.assignments.find(row => row.id === parentAssignmentId);
  const replacementSummary = recentSummary.assignments.find(row => row.id === replacementAssignmentId);
  assert.ok(parentSummary, "summary includes the exact cancelled historical Assignment");
  assert.equal(parentSummary.replacement_assignment_id, replacementAssignmentId);
  assert.ok(Number(parentSummary.review_only_count) >= 1, "cancelled submitted history is marked read-only");
  assert.equal(replacementSummary.replaces_assignment_id, parentAssignmentId);
  const exactReplacementRecipientCount = await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignment_recipients WHERE assignment_id=?",
  ).bind(replacementAssignmentId).first();
  assert.equal(Number(replacementSummary.recipient_count), Number(exactReplacementRecipientCount.n));
  assert.equal(Number(replacementSummary.submitted_count), 0);
  assert.equal(Object.hasOwn(parentSummary, "mixed_payload_json"), false,
    "bounded summary never returns frozen question payloads");
  const compatibleHistoryResponse = await mf.dispatchFetch(
    "http://local/api/class-exam-assignments?history=1",
    { headers: { "X-Fixture-Role": "teacher" } },
  );
  const compatibleHistory = await compatibleHistoryResponse.json();
  assert.equal(compatibleHistoryResponse.status, 200);
  assert.ok(Array.isArray(compatibleHistory.assignments), "the compatibility history API remains available");
  assert.equal((await db.prepare("SELECT cancelled_at FROM class_exam_assignments WHERE id=?").bind(parentAssignmentId).first()).cancelled_at,
    cancelResult.assignment.cancelled_at, "replacement preserves the cancelled historical parent");
  assert.equal((await db.prepare("SELECT id FROM exam_sessions WHERE id=?").bind(preservedSessionId).first()).id,
    preservedSessionId);
  await db.batch([
    db.prepare("DELETE FROM class_exam_assignment_exclusions WHERE assignment_id=?").bind(replacementAssignmentId),
    db.prepare("DELETE FROM class_exam_assignment_recipients WHERE assignment_id=?").bind(replacementAssignmentId),
    db.prepare("DELETE FROM class_exam_assignment_questions WHERE assignment_id=?").bind(replacementAssignmentId),
    db.prepare("DELETE FROM class_exam_assignments WHERE id=?").bind(replacementAssignmentId),
  ]);
  assert.ok(await db.prepare(
    "SELECT event_id FROM class_exam_assignment_lifecycle_events WHERE assignment_id=? AND operation='REPLACEMENT_ASSIGNMENT'",
  ).bind(replacementAssignmentId).first(), "replacement lineage remains auditable after row cleanup");

  for (const delivery of savedPaperDeliveries)
    await db.prepare("DELETE FROM class_exam_assignments WHERE id=?").bind(delivery.assignmentId).run();
  for (const paper of savedPapers)
    await db.prepare("UPDATE archive_saved_papers SET deleted_at=? WHERE id=?")
      .bind(new Date().toISOString(), paper.id).run();
  assert.equal(
    (await post("question-history", { student_ids: ["student-a"] }, "")).status,
    401,
  );
  assert.equal(
    (await post("question-history", { student_ids: ["student-c"] }, "teacher"))
      .status,
    403,
  );
  const created = await post("studio", payload);
  assert.equal(created.body.saved, true, JSON.stringify(created));
  assert.equal(created.status, 502); // local Browser Rendering is deliberately absent; never claim PDF PASS.
  const id = created.body.assignment.id;
  assert.deepEqual(
    created.body.question_uids,
    questions.map((q) => q.questionUid),
  );
  const blueprintRows = (
    await db
      .prepare(
        "SELECT source_question_uid FROM exam_blueprints WHERE archive_file=? ORDER BY question_no",
      )
      .bind(payload.archive_file)
      .all()
  ).results;
  assert.deepEqual(
    blueprintRows.map((r) => r.source_question_uid),
    questions.map((q) => q.questionUid),
  );
  const portalPost = async (studentId) => {
    const token = crypto
      .createHash("sha256")
      .update(studentId + "::student-portal:v1")
      .digest("hex");
    const response = await mf.dispatchFetch(
      "http://local/api/student-portal/omr-submit",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          student_token: token,
          assignment_id: id,
          wrong_ids: [1],
        }),
      },
    );
    return { status: response.status, body: await response.json() };
  };
  const omr = await portalPost("student-a");
  assert.equal(omr.status, 200, JSON.stringify(omr));
  assert.equal((await portalPost("student-b")).status, 404);
  const wrong = (
    await db
      .prepare(
        "SELECT q.question_uid FROM wrong_answers w JOIN exam_sessions e ON e.id=w.session_id JOIN class_exam_assignment_questions q ON q.assignment_id=e.assignment_id AND q.order_no=CAST(w.question_id AS INTEGER) WHERE e.assignment_id=?",
      )
      .bind(id)
      .all()
  ).results;
  assert.deepEqual(
    wrong.map((r) => r.question_uid),
    [uid(1)],
  );
  const repeat = await post("studio", payload);
  assert.equal(repeat.body.assignment?.id, id, JSON.stringify(repeat));
  assert.equal(Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignment_lifecycle_events WHERE assignment_id=? AND operation='RETRY'",
  ).bind(id).first()).n), 0, "RETRY keeps the existing write-key authority and is not an operation event");
  assert.equal(
    (
      await db
        .prepare("SELECT COUNT(*) AS n FROM class_exam_assignment_questions")
        .first()
    ).n,
    2,
  );
  const history = await post(
    "question-history",
    {
      student_ids: ["student-a", "student-b"],
      candidate_question_uids: [uid(1)],
      unit_keys: ["metadata-changed"],
    },
    "teacher",
  );
  assert.deepEqual(history.body.students["student-a"].question_uids, [uid(1)]);
  assert.deepEqual(history.body.students["student-b"].question_uids, []);
  assert.equal(history.body.coverage.verified, 2);
  const changed = await post("studio", {
    ...payload,
    student_ids: ["student-b"],
  });
  assert.equal(changed.status, 409, "retry cannot silently turn into add-recipients");
  const addedRecipient = await db.prepare(`
    SELECT r.student_id, x.student_id AS excluded_student_id
    FROM class_exam_assignment_recipients r
    LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id=r.assignment_id AND x.student_id=r.student_id
    WHERE r.assignment_id=? AND r.student_id=?
  `).bind(id, "student-b").first();
  assert.equal(addedRecipient.student_id, "student-b");
  assert.equal(addedRecipient.excluded_student_id, "student-b",
    "retry cannot restore a previously excluded recipient");
  const duplicate = await post("studio", {
    ...payload,
    archive_file: "MIXED:archive2-second",
  });
  assert.equal(duplicate.status, 409);
  const invalid = await post("studio", {
    ...payload,
    archive_file: "MIXED:archive2-bad",
    mixed_payload_json: {
      questions: [questions[0], questions[0]],
      meta: { questionUids: [uid(1), uid(1)] },
    },
  });
  assert.equal(invalid.status, 400);
  const forged = await post("studio", {
    ...payload,
    archive_file: "MIXED:archive2-forged",
    mixed_payload_json: {
      ...payload.mixed_payload_json,
      questions: questions.map((q) => ({ ...q, content: "forged" })),
    },
  });
  assert.equal(forged.status, 409);
  assert.equal(
    (
      await db
        .prepare("SELECT COUNT(*) AS n FROM class_exam_assignments")
        .first()
    ).n,
    1,
  );
  await db
    .prepare(
      "DELETE FROM class_exam_assignment_exclusions WHERE assignment_id = ?",
    )
    .bind(id)
    .run();
  const included = await post("question-history", {
    student_ids: ["student-b"],
  });
  assert.deepEqual(included.body.union_question_uids, [uid(1), uid(2)].sort());
  await db
    .prepare("DELETE FROM class_exam_assignments WHERE id = ?")
    .bind(id)
    .run();
  const deleted = await post("question-history", {
    student_ids: ["student-a"],
  });
  assert.deepEqual(deleted.body.union_question_uids, []);
  const races = await Promise.all(
    ["race-a", "race-b"].map((key) =>
      post("studio", { ...payload, archive_file: "MIXED:archive2-" + key }),
    ),
  );
  assert.equal(
    races.filter((r) => r.body.saved).length,
    1,
    JSON.stringify(races),
  );
  assert.equal(races.filter((r) => r.status === 409).length, 1);
  const raceId = races.find((r) => r.body.saved).body.assignment.id;
  await db
    .prepare("DELETE FROM class_exam_assignments WHERE id = ?")
    .bind(raceId)
    .run();
  await db
    .prepare(
      "INSERT INTO class_exam_assignments (id,class_id,exam_title,exam_date,question_count,created_at) VALUES ('legacy','class-a','Legacy','2026-07-01',3,'2026-07-01')",
    )
    .run();
  await db
    .prepare(
      "INSERT INTO class_exam_assignment_recipients (assignment_id,student_id) VALUES ('legacy','student-a')",
    )
    .run();
  await db
    .prepare(
      "INSERT INTO class_exam_assignment_questions (assignment_id,order_no,question_uid,source_archive_file,source_question_ordinal,resolution_status) VALUES ('legacy',1,?,?,?,'VERIFIED')",
    )
    .bind(uid(1), records[0].sourceFile, records[0].sourceOrdinal)
    .run();
  const coverage = await post("question-history", {
    student_ids: ["student-a"],
    candidate_question_uids: [],
  });
  assert.deepEqual(coverage.body.coverage, {
    verified: 0,
    legacy_inferred: 1,
    unresolved: 2,
  });
  assert.deepEqual(coverage.body.union_question_uids, []);
  const normalRecords = catalog.records.filter(
    (r) => r.sourceFile === base.sourceFile,
  );
  for (const r of normalRecords)
    await db
      .prepare(
        "INSERT INTO exam_blueprints (archive_file,question_no,source_question_uid,source_question_ordinal) VALUES (?,?,?,?)",
      )
      .bind(
        "exams/" + base.sourceFile,
        r.sourceOrdinal,
        r.questionUid,
        r.sourceOrdinal,
      )
      .run();
  const normal = await post("studio", {
    ...payload,
    student_ids: ["student-b"],
    archive_file: "exams/" + base.sourceFile,
    question_count: normalRecords.length,
    question_uids: normalRecords.map((r) => r.questionUid),
    mixed_payload_json: undefined,
  });
  assert.equal(normal.body.saved, true, JSON.stringify(normal));
  assert.equal(normal.body.question_uids.length, normalRecords.length);
  await db
    .prepare("DELETE FROM class_exam_assignments WHERE id = ?")
    .bind(normal.body.assignment.id)
    .run();
  const fiftyRecords = catalog.records
    .filter(
      (r) =>
        r.automatic &&
        (!process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX || r.sourceFile.startsWith(process.env.AP_ARCHIVE2_TEST_SOURCE_PREFIX)) &&
        r.sourceGrade === base.sourceGrade &&
        r.curriculumKey === base.curriculumKey,
    )
    .slice(0, 50);
  assert.equal(fiftyRecords.length, 50, "50-question fixture must use 50 approved canonical records");
  const banks = new Map();
  const fifty = fiftyRecords.map((record) => {
    if (!banks.has(record.sourceFile))
      banks.set(
        record.sourceFile,
        source.evaluate(
          fs.readFileSync(
            path.join(root, "archive/exams", record.sourceFile),
            "utf8",
          ),
          record.sourceFile,
        ),
      );
    const q = {
      ...banks.get(record.sourceFile)[record.sourceOrdinal - 1],
      questionUid: record.questionUid,
      sourceArchiveFile: record.sourceFile,
      sourceOrdinal: record.sourceOrdinal,
      sourceFingerprint: record.sourceFingerprint,
    };
    // Raw source rows can include obsolete overlay fields; use canonical metadata only.
    for (const field of core.META_FIELDS) delete q[field];
    for (const field of core.META_FIELDS)
      if (record[field] !== undefined) q[field] = record[field];
    return q;
  });
  const large = await post("studio", {
    ...payload,
    student_ids: ["student-b"],
    archive_file: "MIXED:archive2-fifty",
    question_count: fifty.length,
    selection_filters: {
      grade: base.sourceGrade,
      primaryPaths: [
        ...new Set(fiftyRecords.map((record) => core.pathKey(record, 4))),
      ],
    },
    mixed_payload_json: {
      questions: fifty,
      meta: { questionUids: fifty.map((q) => q.questionUid) },
    },
  });
  assert.equal(large.body.saved, true, JSON.stringify(large));
  assert.deepEqual(
    large.body.question_uids,
    fifty.map((q) => q.questionUid),
  );
  const studentToken = crypto
    .createHash("sha256")
    .update("student-b::student-portal:v1")
    .digest("hex");
  const finalOmr = await mf.dispatchFetch(
    "http://local/api/student-portal/omr-submit",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: "student-b",
        student_token: studentToken,
        assignment_id: large.body.assignment.id,
        wrong_ids: [50],
      }),
    },
  );
  assert.equal(finalOmr.status, 200);
  const finalWrong = await db
    .prepare(
      "SELECT q.question_uid FROM wrong_answers w JOIN exam_sessions e ON e.id=w.session_id JOIN class_exam_assignment_questions q ON q.assignment_id=e.assignment_id AND q.order_no=CAST(w.question_id AS INTEGER) WHERE e.assignment_id=?",
    )
    .bind(large.body.assignment.id)
    .first();
  assert.equal(finalWrong.question_uid, fifty[49].questionUid);
  await db
    .prepare("DELETE FROM class_exam_assignments WHERE id=?")
    .bind(large.body.assignment.id)
    .run();
  // The primary original-exam path keeps the existing assignment API. Canonical
  // automatic-selection eligibility must not prevent issuing an intact source.
  const nativeExam = catalog.exams.find(
    (e) => e.file.startsWith("original/high/h1/") && e.qCount > 0,
  );
  const nativeInput = {
    class_id: "class-a",
    exam_title: "Native original runtime",
    exam_date: "2026-09-17",
    index_version: catalog.indexVersion,
    question_count: nativeExam.qCount,
    archive_file: "exams/" + nativeExam.file,
    source_type: "archive",
    pdf_qpp: 4,
  };
  const native = await post("", nativeInput);
  assert.equal(native.status, 502);
  assert.ok(native.body.assignment.id);
  assert.equal(native.body.assignment.question_count, nativeExam.qCount);
  const nativeExcluded = await post("exclude-students", {
    ...nativeInput,
    assignment_id: native.body.assignment.id,
    student_ids: ["student-b"],
  });
  assert.equal(nativeExcluded.status, 200);
  assert.equal(nativeExcluded.body.success, true);
  const nativeRetry = await post("", nativeInput);
  assert.equal(nativeRetry.body.assignment.id, native.body.assignment.id);
  const effectiveNative = (
    await db
      .prepare(
        "SELECT r.student_id FROM class_exam_assignment_recipients r LEFT JOIN class_exam_assignment_exclusions x ON x.assignment_id=r.assignment_id AND x.student_id=r.student_id WHERE r.assignment_id=? AND x.student_id IS NULL",
      )
      .bind(native.body.assignment.id)
      .all()
  ).results;
  assert.deepEqual(
    effectiveNative.map((r) => r.student_id),
    ["student-a"],
  );
  if (process.argv.includes("--audit-rc2")) {
    const bridgeCount = (
      await db
        .prepare(
          "SELECT COUNT(*) n FROM class_exam_assignment_questions WHERE assignment_id=?",
        )
        .bind(native.body.assignment.id)
        .first()
    ).n;
    await db
      .prepare("INSERT INTO class_students VALUES('class-a','student-c')")
      .run();
    await post("", nativeInput);
    const added = await db
      .prepare(
        "SELECT student_id FROM class_exam_assignment_recipients WHERE assignment_id=? AND student_id=?",
      )
      .bind(native.body.assignment.id, "student-c")
      .first();
    console.log(
      JSON.stringify({
        rc1Reproduction: {
          P1_01: { bridgeCount, missing: bridgeCount === 0 },
          P1_02: { newStudentAddedOnRetry: !!added },
          split: "first rememberReceipt calls seal() before subsequent papers",
        },
      }),
    );
    await db
      .prepare(
        "DELETE FROM class_students WHERE class_id='class-a' AND student_id='student-c'",
      )
      .run();
  }
  await db
    .prepare("DELETE FROM class_exam_assignments WHERE id=?")
    .bind(native.body.assignment.id)
    .run();
  if (!process.argv.includes("--audit-rc2"))
    await runRc2({ db, mf, catalog, post, root });
  if (process.argv.includes('--clinic-m3')) {
    const midterms = catalog.exams.filter(exam => exam.file.startsWith('original/middle/m3/2mid/'));
    let submitted = 0;
    for (const exam of midterms) {
      const raw = source.evaluate(fs.readFileSync(path.join(root, 'archive/exams', exam.file), 'utf8'), exam.file);
      const issued = await post('', {
        contract_version: 'archive2-v1', class_id: 'class-a', student_ids: ['student-a'],
        exam_title: '중3 2학기 중간 ' + exam.file, exam_date: '2026-09-28', index_version: catalog.indexVersion,
        archive_file: 'exams/' + exam.file, question_count: raw.length, pdf_qpp: 4,
        original_payload_json: { questions: raw, meta: { includeQr: false } }
      });
      assert.equal(issued.body.saved, true, JSON.stringify(issued));
      const assignmentId = issued.body.assignment.id;
      const token = crypto.createHash('sha256').update('student-a::student-portal:v1').digest('hex');
      const response = await mf.dispatchFetch('http://local/api/student-portal/omr-submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: 'student-a', student_token: token, assignment_id: assignmentId, wrong_ids: [raw.length] })
      });
      assert.equal(response.status, 200, await response.text());
      const linked = await db.prepare(`SELECT bp.source_question_ordinal,bp.source_question_uid,bp.source_archive_file,
        w.question_id,e.archive_file FROM wrong_answers w JOIN exam_sessions e ON e.id=w.session_id
        JOIN exam_blueprints bp ON bp.archive_file=e.archive_file AND bp.question_no=CAST(w.question_id AS INTEGER)
        WHERE e.assignment_id=?`).bind(assignmentId).first();
      assert.equal(Number(linked.question_id), raw.length);
      assert.equal(Number(linked.source_question_ordinal), raw.length);
      const clinicItem = { archiveFile: linked.archive_file, questionNo: raw.length, sourceArchiveFile: linked.source_archive_file || linked.archive_file,
        sourceQuestionNo: Number(raw[raw.length - 1].id) || raw.length, sourceQuestionOrdinal: linked.source_question_ordinal, sourceQuestionUid: linked.source_question_uid };
      const clinicResponse = await mf.dispatchFetch('http://local/api/wrong-clinics', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Fixture-Role': 'admin' },
        body: JSON.stringify({ title: '중3 중간 오답', mode: 'grade', source: { class_id: 'class-a', grade: '중3', scope_type: 'grade' },
          targets: [{ type: 'student', student_id: 'student-a', class_id: 'class-a' }],
          payload: { mode: 'grade', gradeName: '중3', gradeWrongItems: [clinicItem] } })
      });
      const clinic = await clinicResponse.json();
      assert.equal(clinicResponse.status, 200, JSON.stringify(clinic));
      const storedResponse = await mf.dispatchFetch('http://local/api/wrong-clinics/set/' + clinic.public_set_key);
      const stored = await storedResponse.json();
      assert.equal(stored.payload.gradeWrongItems[0].sourceQuestionOrdinal, raw.length);
      assert.equal(stored.payload.gradeWrongItems[0].sourceQuestionUid, linked.source_question_uid);
      assert.equal(stored.payload.recipients.length, 1);
      submitted += 1;
    }
    console.log(JSON.stringify({ middle3MidtermClinic: 'PASS', originalAssignments: midterms.length, omrSubmissions: submitted, storedGradeClinics: submitted, pdf: 'EXPECTED_FAILURE_NO_BROWSER_BINDING' }));
  }
  const guardedSubjectRecords = catalog.records
    .filter((row) => row.automatic && row.sourceGrade === "고2" &&
      row.curriculumKey === sharedRecord.curriculumKey &&
      core.subjectProjectionForRecord(row, "", catalog.projectionPolicy) === semanticSubject &&
      core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const guardedCandidateRecords = guardedSubjectRecords;
  const guardedQuestionCache = new Map();
  const guardedCandidates = guardedCandidateRecords.map((row) => {
    if (!guardedQuestionCache.has(row.sourceFile)) {
      const sourceText = fs.readFileSync(path.join(root, "archive/exams", row.sourceFile), "utf8");
      guardedQuestionCache.set(row.sourceFile, source.evaluate(sourceText, row.sourceFile));
    }
    const question = structuredClone(guardedQuestionCache.get(row.sourceFile)[row.sourceOrdinal - 1]);
    question.questionUid = row.questionUid;
    question.sourceArchiveFile = row.sourceFile;
    question.sourceOrdinal = row.sourceOrdinal;
    question.sourceQuestionNo = row.sourceQuestionNo;
    question.sourceFingerprint = row.sourceFingerprint;
    for (const field of core.META_FIELDS)
      if (row[field] !== undefined) question[field] = row[field];
    return { row, question };
  });
  const guardedBatch = guardedCandidates
    .filter(({ question }) => !/assets\/images\//i.test(JSON.stringify(question)))
    .slice(0, 50);
  const guardedBatchRecords = guardedBatch.map(({ row }) => row);
  const guardedQuestions = guardedBatch.map(({ question }) => question);
  assert.equal(guardedBatchRecords.length, 50, "Saved Paper D1 route regression needs 50 compact approved questions");
  const savedPaperAssignmentMatrix = [];
  const savedPaperGradeAcceptance = [];
  let mixedSourceGradeAcceptance = null;
  for (const questionCount of [1, 5, 6, 10, 50]) {
    const selectedRecords = guardedBatchRecords.slice(0, questionCount);
    const selectedQuestions = structuredClone(guardedQuestions.slice(0, questionCount));
    const saveBatchId = crypto.randomUUID();
    const selectionFilters = {
      grade: "고2",
      curriculumKey: selectedRecords[0].curriculumKey,
      semanticSubject,
      primaryPaths: [...new Set(selectedRecords.map((row) => core.pathKey(row, 4)))],
      scopeQuestionUids: selectedRecords.map((row) => row.questionUid),
    };
    const prepared = await prepareSavedPaperBatch(savedPaperEnv, {
      schema_version: SAVED_PAPER_SCHEMA,
      save_batch_id: saveBatchId,
      index_version: catalog.indexVersion,
      selection_filters: selectionFilters,
      papers: [{
        part_index: 0,
        questions: selectedQuestions,
        meta: {
          title: `D1 bind regression ${questionCount}`,
          qpp: 4,
          questionUids: selectedQuestions.map((question) => question.questionUid),
        },
      }],
    });
    const paper = prepared.papers[0];
    const savedPaperId = crypto.randomUUID();
    await db.prepare(`INSERT INTO archive_saved_papers (
      id,owner_teacher_id,save_batch_id,part_index,part_count,title,grade,subject,question_count,
      snapshot_json,snapshot_hash,save_request_hash,source_index_version,schema_version,created_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      savedPaperId, "teacher-a", saveBatchId, 0, 1, paper.title, paper.grade, paper.subject,
      paper.question_count, paper.snapshot_json, paper.snapshot_hash, prepared.requestHash,
      paper.source_index_version, paper.schema_version, new Date().toISOString(),
    ).run();
    const delivery = await post("", {
      contract_version: "archive2-v1",
      class_id: "class-h2",
      student_ids: ["student-h2"],
      exam_date: "2026-10-03",
      saved_paper_id: savedPaperId,
      assignment_batch_id: crypto.randomUUID(),
    }, "teacher");
    assert.equal(delivery.body.saved, true, `${questionCount}-question Saved Paper must commit: ${JSON.stringify(delivery)}`);
    assert.equal(delivery.status, 502, "the local PDF renderer is intentionally unavailable after the Assignment commit");
    const assignmentRows = await db.prepare(
      "SELECT COUNT(*) AS n FROM class_exam_assignment_questions WHERE assignment_id=?",
    ).bind(delivery.body.assignment.id).first();
    assert.equal(Number(assignmentRows.n), questionCount, `${questionCount}-question Assignment preserves every ordered question`);
    const blueprintRows = await db.prepare(
      "SELECT COUNT(*) AS n FROM exam_blueprints WHERE archive_file=?",
    ).bind(delivery.body.assignment.archive_file).first();
    assert.equal(Number(blueprintRows.n), questionCount, `${questionCount}-question Saved Paper writes every blueprint row`);
    savedPaperAssignmentMatrix.push({
      questionCount,
      saved: delivery.body.saved,
      savedPaperId,
      assignmentId: delivery.body.assignment.id,
    });
  }

  const actualHigh2SavedPaper = { id: savedPaperAssignmentMatrix[0].savedPaperId, browseGrade: "고2" };
  assert.ok(actualHigh2SavedPaper.id, "grade acceptance requires the real high2-source Saved Paper");
  const actualHigh2Snapshot = JSON.parse((await db.prepare(
    "SELECT snapshot_json FROM archive_saved_papers WHERE id=?",
  ).bind(actualHigh2SavedPaper.id).first()).snapshot_json);
  assert.deepEqual(await resolveSavedPaperSourceGrades(savedPaperEnv, actualHigh2Snapshot.questions), ["고2"],
    "the source-grade acceptance fixture must resolve from its frozen question identity");

  const manifestFetchesBeforeGradeAcceptance = canonicalManifestFetches;
  canonicalBundleUnavailable = true;
  try {
    const gradeTargets = [
      ["class-target-m1", "student-target-m1", "중1"],
      ["class-target-m2", "student-target-m2", "중2"],
      ["class-target-m3", "student-target-m3", "중3"],
      ["class-target-h1", "student-target-h1", "고1"],
      ["class-h2", "student-h2", "고2"],
      ["class-target-h3", "student-target-h3", "고3"],
    ];
    for (const [classId, studentId, targetGrade] of gradeTargets) {
      const delivery = await post("", {
        contract_version: "archive2-v1",
        class_id: classId,
        student_ids: [studentId],
        exam_date: "2026-10-05",
        saved_paper_id: actualHigh2SavedPaper.id,
        assignment_batch_id: crypto.randomUUID(),
      }, "teacher");
      assert.equal(delivery.body.saved, true,
        `actual high2 source must distribute to valid ${targetGrade} target: ${JSON.stringify(delivery)}`);
      assert.equal(delivery.status, 502,
        `${targetGrade} Assignment must commit before the expected local PDF binding failure`);
      const assignment = await db.prepare(
        "SELECT class_id,saved_paper_id FROM class_exam_assignments WHERE id=?",
      ).bind(delivery.body.assignment.id).first();
      assert.equal(assignment.class_id, classId);
      assert.equal(assignment.saved_paper_id, actualHigh2SavedPaper.id,
        "every grade target must retain the same immutable Saved Paper identity");
      savedPaperGradeAcceptance.push({ sourceGrade: "고2", targetGrade, saved: true });
    }

    for (const [classId, studentId, targetGrade] of [
      ["class-target-grade-label", "student-target-grade-label", "중1"],
      ["class-target-name-fallback", "student-target-name-fallback", "고3"],
    ]) {
      const delivery = await post("", {
        contract_version: "archive2-v1",
        class_id: classId,
        student_ids: [studentId],
        exam_date: "2026-10-06",
        saved_paper_id: actualHigh2SavedPaper.id,
        assignment_batch_id: crypto.randomUUID(),
      }, "teacher");
      assert.equal(delivery.body.saved, true,
        `${targetGrade} target fallback metadata must remain valid: ${JSON.stringify(delivery)}`);
      assert.equal(delivery.status, 502);
      savedPaperGradeAcceptance.push({ sourceGrade: "고2", targetGrade, metadataFallback: true, saved: true });
    }

    const writesBeforeInvalidTargets = Number((await db.prepare(
      "SELECT COUNT(*) AS n FROM class_exam_assignments",
    ).first()).n);
    for (const [classId, studentId] of [
      ["class-target-invalid-grade", "student-target-invalid-grade"],
      ["class-target-unknown-grade", "student-target-unknown-grade"],
    ]) {
      const rejected = await post("", {
        contract_version: "archive2-v1",
        class_id: classId,
        student_ids: [studentId],
        exam_date: "2026-10-07",
        saved_paper_id: actualHigh2SavedPaper.id,
        assignment_batch_id: crypto.randomUUID(),
      }, "teacher");
      assert.equal(rejected.status, 409, `${classId} must fail closed: ${JSON.stringify(rejected)}`);
      assert.notEqual(rejected.body.saved, true,
        `${classId} must not claim an Assignment was saved: ${JSON.stringify(rejected)}`);
    }
    assert.equal(Number((await db.prepare(
      "SELECT COUNT(*) AS n FROM class_exam_assignments",
    ).first()).n), writesBeforeInvalidTargets,
    "unknown and invalid target metadata must cause zero Assignment writes");

    const materializeLegacySourceQuestion = (row) => {
      const sourceText = fs.readFileSync(path.join(root, "archive/exams", row.sourceFile), "utf8");
      const original = source.evaluate(sourceText, row.sourceFile)[row.sourceOrdinal - 1];
      const question = structuredClone(original);
      question.questionUid = row.questionUid;
      question.sourceArchiveFile = row.sourceFile;
      question.sourceOrdinal = row.sourceOrdinal;
      question.sourceQuestionNo = row.sourceQuestionNo;
      question.sourceFingerprint = row.sourceFingerprint;
      question.sourceGrade = row.sourceGrade;
      delete question.sourceIdentityEvidence;
      for (const field of core.META_FIELDS)
        if (row[field] !== undefined) question[field] = row[field];
      return question;
    };
    const legacyMixedRecords = [];
    for (const sourceGrade of ["고2", "중3"]) {
      let selected = null;
      for (const row of catalog.records.filter(record => record.automatic && record.sourceGrade === sourceGrade &&
        core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority }).ok)) {
        const question = materializeLegacySourceQuestion(row);
        if (!/assets\/images\//i.test(JSON.stringify(question))) {
          selected = { row, question };
          break;
        }
      }
      assert.ok(selected, `need an actual compact ${sourceGrade} source question for a legacy mixed snapshot`);
      legacyMixedRecords.push(selected);
    }
    const legacyMixedQuestions = legacyMixedRecords.map(item => item.question);
    const legacyMixedGrades = await resolveSavedPaperSourceGrades(savedPaperEnv, legacyMixedQuestions);
    assert.deepEqual(legacyMixedGrades, ["중3", "고2"],
      "mixed source grades must be resolved from each real UID/path/ordinal, not Saved Paper context");
    assert.ok(legacyMixedQuestions.every(question => !question.sourceIdentityEvidence),
      "this is the supported legacy witness-less snapshot path");
    const legacyMixedMeta = {
      title: "legacy mixed-source Saved Paper",
      grade: "고2",
      subject: "수학",
      count: legacyMixedQuestions.length,
      qpp: 4,
      questionUids: legacyMixedQuestions.map(question => question.questionUid),
    };
    const legacyMixedBridgeRows = await buildQuestionSnapshot(
      { question_count: legacyMixedQuestions.length },
      legacyMixedQuestions,
      legacyMixedMeta,
      { canonicalAuthority: catalog.canonicalAuthority },
    );
    const legacyMixedSnapshot = {
      questions: legacyMixedQuestions,
      meta: legacyMixedMeta,
      bridgeRows: legacyMixedBridgeRows,
      selectionFilters: {
        grade: "고2",
        primaryPaths: [...new Set(legacyMixedRecords.map(item => core.pathKey(item.row, 4)))],
        scopeQuestionUids: legacyMixedQuestions.map(question => question.questionUid),
      },
      verifiedAt: new Date().toISOString(),
    };
    const legacyMixedSnapshotJson = stableStringify(legacyMixedSnapshot);
    const legacyMixedPaperId = crypto.randomUUID();
    const legacyMixedSaveBatchId = crypto.randomUUID();
    await db.prepare(`INSERT INTO archive_saved_papers (
      id,owner_teacher_id,save_batch_id,part_index,part_count,title,grade,subject,question_count,
      snapshot_json,snapshot_hash,save_request_hash,source_index_version,schema_version,created_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
      legacyMixedPaperId, "teacher-a", legacyMixedSaveBatchId, 0, 1, legacyMixedMeta.title,
      legacyMixedMeta.grade, legacyMixedMeta.subject, legacyMixedQuestions.length,
      legacyMixedSnapshotJson, crypto.createHash("sha256").update(legacyMixedSnapshotJson).digest("hex"),
      crypto.createHash("sha256").update(legacyMixedSaveBatchId).digest("hex"),
      catalog.indexVersion, SAVED_PAPER_SCHEMA, new Date().toISOString(),
    ).run();
    await db.prepare(`INSERT INTO archive_saved_paper_library_metadata
      (saved_paper_id,owner_teacher_id,status) VALUES (?,?,?)`)
      .bind(legacyMixedPaperId, "teacher-a", "ACTIVE").run();
    const mixedDelivery = await post("", {
      contract_version: "archive2-v1",
      class_id: "class-target-m1",
      student_ids: ["student-target-m1"],
      exam_date: "2026-10-08",
      saved_paper_id: legacyMixedPaperId,
      assignment_batch_id: crypto.randomUUID(),
    }, "teacher");
    assert.equal(mixedDelivery.body.saved, true,
      `legacy mixed-source Saved Paper must distribute from actual source identity: ${JSON.stringify(mixedDelivery)}`);
    assert.equal(mixedDelivery.status, 502);
    mixedSourceGradeAcceptance = {
      actualSourceGrades: legacyMixedGrades,
      savedPaperGradeContext: legacyMixedMeta.grade,
      targetGrade: "중1",
      saved: mixedDelivery.body.saved,
    };
  } finally {
    canonicalBundleUnavailable = false;
  }
  assert.equal(canonicalManifestFetches, manifestFetchesBeforeGradeAcceptance,
    "cross-grade Saved Paper delivery must not re-read the current catalog");

  const assignmentCountBeforeGradePolicies = Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignments",
  ).first()).n);
  const directMixedUpperSource = await post("studio", {
    contract_version: "archive2-v1",
    class_id: "class-target-m1",
    student_ids: ["student-target-m1"],
    exam_title: "direct MIXED upper source rejection",
    exam_date: "2026-10-09",
    question_count: 1,
    archive_file: "MIXED:archive2-upper-source-mixed",
    index_version: catalog.indexVersion,
    selection_filters: {
      grade: "고2",
      curriculumKey: sharedRecord.curriculumKey,
      semanticSubject,
      primaryPaths: [core.pathKey(sharedRecord, 4)],
      scopeQuestionUids: [sharedRecord.questionUid],
    },
    mixed_payload_json: {
      questions: [structuredClone(sharedQuestion)],
      meta: { questionUids: [sharedRecord.questionUid] },
    },
  }, "teacher");
  assert.equal(directMixedUpperSource.status, 409,
    `direct MIXED must retain its source-to-target restriction: ${JSON.stringify(directMixedUpperSource)}`);
  assert.equal(Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignments",
  ).first()).n), assignmentCountBeforeGradePolicies,
  "rejected direct MIXED distribution must not write an Assignment");

  const high2BlueprintRecords = catalog.records.filter(record => record.sourceFile === sharedRecord.sourceFile)
    .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
  const high2BlueprintExam = catalog.exams.find(exam => exam.file === sharedRecord.sourceFile);
  assert.ok(high2BlueprintExam && high2BlueprintRecords.length === high2BlueprintExam.qCount,
    "normal blueprint policy test requires the complete actual high2 source exam");
  const high2BlueprintFile = "exams/" + sharedRecord.sourceFile;
  for (const record of high2BlueprintRecords)
    await db.prepare(`INSERT OR IGNORE INTO exam_blueprints
      (archive_file,question_no,source_question_uid,source_question_ordinal) VALUES (?,?,?,?)`)
      .bind(high2BlueprintFile, record.sourceOrdinal, record.questionUid, record.sourceOrdinal).run();
  const normalBlueprintUpperSource = await post("studio", {
    contract_version: "archive2-v1",
    class_id: "class-target-m1",
    student_ids: ["student-target-m1"],
    exam_title: "normal blueprint upper source rejection",
    exam_date: "2026-10-10",
    question_count: high2BlueprintRecords.length,
    archive_file: high2BlueprintFile,
    index_version: catalog.indexVersion,
    question_uids: high2BlueprintRecords.map(record => record.questionUid),
    pdf_qpp: 4,
  }, "teacher");
  assert.equal(normalBlueprintUpperSource.status, 409,
    `normal blueprint must retain its source-to-target restriction: ${JSON.stringify(normalBlueprintUpperSource)}`);
  assert.equal(Number((await db.prepare(
    "SELECT COUNT(*) AS n FROM class_exam_assignments",
  ).first()).n), assignmentCountBeforeGradePolicies,
  "rejected normal blueprint distribution must not write an Assignment");

  const rawOriginalQuestions = source.evaluate(
    fs.readFileSync(path.join(root, "archive/exams", sharedRecord.sourceFile), "utf8"),
    sharedRecord.sourceFile,
  );
  const rawOriginalLowerTarget = await post("original", {
    contract_version: "archive2-v1",
    class_id: "class-target-m1",
    student_ids: ["student-target-m1"],
    exam_title: "raw Original existing separate policy",
    exam_date: "2026-10-11",
    index_version: catalog.indexVersion,
    archive_file: high2BlueprintFile,
    question_count: rawOriginalQuestions.length,
    pdf_qpp: 4,
    original_payload_json: { questions: rawOriginalQuestions, meta: { includeQr: false } },
  }, "teacher");
  assert.ok(rawOriginalLowerTarget.body.assignment?.id,
    `raw Original must keep its separate existing distribution behavior: ${JSON.stringify(rawOriginalLowerTarget)}`);
  assert.equal(rawOriginalLowerTarget.status, 502,
    "raw Original Assignment should commit before the expected local PDF binding failure");
  const rawOriginalAssignment = await db.prepare(
    "SELECT class_id,archive_file FROM class_exam_assignments WHERE id=?",
  ).bind(rawOriginalLowerTarget.body.assignment.id).first();
  assert.deepEqual(rawOriginalAssignment, { class_id: "class-target-m1", archive_file: high2BlueprintFile });

  console.log(
    JSON.stringify({
      status: "PASS",
      runtime: "workerd + D1",
      mixedBlueprintParity: "PASS",
      studentOmrWrongAnswerUid: "PASS",
      normalBlueprintBridge: "PASS",
      nativeOriginalAssignmentExclusionRetry: "PASS",
      fiftyQuestionPersistenceAndLastOmrUid: "PASS",
      authorization: "PASS",
      persistedOrderedUidParity: "PASS",
      retry: "PASS",
      effectiveRecipients: "PASS",
      metadataIndependentHistory: "PASS",
      historyConflict: "PASS",
      deletedAssignment: "PASS",
      savedPaperRouteDuringCanonicalOutage: {
        status: "PASS",
        actualSourceGrade: sharedRecord.sourceGrade,
        targetClassGrade: "고2",
        browseGrades: savedPaperDeliveries.map((row) => row.browseGrade),
        deliveryResults: savedPaperDeliveries.map(({ browseGrade, saved, status }) => ({ browseGrade, saved, status })),
        canonicalManifestRequestsDuringDelivery: manifestFetchesDuringSavedPaperDelivery,
      },
      savedPaperAssignmentMatrix,
      savedPaperAssignmentSizes: "1/5/6/10/50 D1 PASS",
      savedPaperGradeAcceptance,
      mixedSourceGradeAcceptance,
      directMixedAndBlueprintUpperSourcePolicy: "409 / zero Assignment writes",
      rawOriginalSeparatePolicy: {
        actualSourceGrade: sharedRecord.sourceGrade,
        targetGrade: "중1",
        saved: Boolean(rawOriginalLowerTarget.body.assignment?.id),
      },
      pdf: "EXPECTED_FAILURE_NO_BROWSER_BINDING",
    }),
  );
  if (serving) {
    await db
      .prepare("DELETE FROM class_exam_assignments WHERE id='legacy'")
      .run();
    console.log("Fixture worker: " + (await mf.ready));
    await new Promise(() => {});
  }
} finally {
  await mf.dispose();
}
