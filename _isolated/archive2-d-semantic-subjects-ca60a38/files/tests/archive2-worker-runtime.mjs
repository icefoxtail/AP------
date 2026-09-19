import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";
import core from "../archive/archive2-core.js";
import source from "../archive/archive2-source.js";
import { runRc2 } from "./archive2-rc2-boundaries.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const worker = path.join(root, "apmath/worker-backup/worker");
const requireWorker = createRequire(path.join(worker, "package.json"));
const { Miniflare } = requireWorker("miniflare");
const { build } = requireWorker("esbuild");
const catalogText = fs.readFileSync(
  path.join(root, "archive/data/archive2-catalog.json"),
  "utf8",
);
const catalog = core.decodeCatalog(JSON.parse(catalogText));
const serving = process.argv.includes("--serve");
const fixturePort = Number(process.env.ARCHIVE2_FIXTURE_PORT || 8790);
const bundle = await build({
  stdin: {
    contents: `import { handleExams } from './routes/exams.js';
import { handleStudentPortal } from './routes/student-portal.js';
let splitFault=false;
export default {async fetch(request, env) {
const url=new URL(request.url);
if(!url.pathname.startsWith('/api/'))return env.FIXTURE_ASSETS.fetch(request);
const role=request.headers.get('X-Fixture-Role') || (request.headers.get('Authorization')==='Bearer fixture-admin'?'admin':null);
const teacher=role ? {id:role==='admin'?'admin':'teacher-a',role} : null;
if(url.pathname==='/api/__fixture/split-failure'&&teacher){splitFault=true;return Response.json({success:true});}
if(url.pathname==='/api/class-exam-assignments/studio'&&splitFault){const body=await request.clone().json();if(body.question_count<50){splitFault=false;return Response.json({success:false,error:'검증용 후속 문제지 충돌: 이 문제지만 수정한 뒤 재시도하세요.'},{status:409});}}
if(url.pathname==='/api/qr-classes'&&teacher)return Response.json({success:true,classes:(await env.DB.prepare('SELECT * FROM classes').all()).results});
if(url.pathname==='/api/student-portal/home')return Response.json({success:true,read_only:!!teacher,access_mode:teacher?'teacher_preview':'student',student:await env.DB.prepare('SELECT id,name,grade,school_name FROM students WHERE id=?').bind(url.searchParams.get('student_id')).first(),classes:[],assignments:[],class_exam_assignments:[]});
if(url.pathname==='/api/student-portal/wrong-clinics')return Response.json({success:true,packets:[]});
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
    ARCHIVE2_ASSETS: (request) => {
      const url = new URL(request.url);
      if (url.pathname.endsWith("/data/archive2-catalog.json"))
        return new Response(catalogText, {
          headers: { "Content-Type": "application/json" },
        });
      const file = decodeURIComponent(url.pathname.split("/exams/")[1] || "");
      if (!file || file.includes(".."))
        return new Response("Not found", { status: 404 });
      return new Response(
        fs.readFileSync(path.join(root, "archive/exams", file)),
        { headers: { "Content-Type": "application/javascript" } },
      );
    },
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
    "CREATE TABLE classes(id TEXT PRIMARY KEY,name TEXT,teacher_name TEXT);CREATE TABLE students(id TEXT PRIMARY KEY,name TEXT,school_name TEXT DEFAULT '',grade TEXT DEFAULT '고1',student_pin TEXT DEFAULT '',status TEXT DEFAULT '재원');CREATE TABLE class_students(class_id TEXT,student_id TEXT);CREATE TABLE teacher_classes(teacher_id TEXT,class_id TEXT);CREATE TABLE attendance(student_id TEXT,status TEXT,date TEXT);ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;",
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
  await db.exec(
    "INSERT INTO classes VALUES ('class-a','고1 검증반 A','Teacher A'),('class-b','고1 검증반 B','Teacher B');INSERT INTO students(id,name) VALUES ('student-a','검증학생 가'),('student-b','검증학생 나'),('student-c','검증학생 다');INSERT INTO class_students VALUES ('class-a','student-a'),('class-a','student-b'),('class-b','student-c');INSERT INTO teacher_classes VALUES ('teacher-a','class-a');",
  );
  const base = catalog.records.find((r) => r.automatic);
  const records = catalog.records
    .filter(
      (r) =>
        r.automatic &&
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
  assert.equal(repeat.body.assignment.id, id);
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
  assert.equal(changed.status, 409);
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
        r.curriculumKey === base.curriculumKey &&
        r.courseKey === base.courseKey,
    )
    .slice(0, 50);
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
    for (const field of core.META_FIELDS)
      if (record[field] !== undefined) q[field] = record[field];
    return q;
  });
  const large = await post("studio", {
    ...payload,
    student_ids: ["student-b"],
    archive_file: "MIXED:archive2-fifty",
    question_count: 50,
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
