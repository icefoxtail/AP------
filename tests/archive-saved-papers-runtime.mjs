import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import core from "../archive/archive2-core.js";
import source from "../archive/archive2-source.js";
import { blueprintInsertStatements } from "../apmath/worker-backup/worker/helpers/archive2-questions.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const worker = path.join(root, "apmath/worker-backup/worker");
const requireWorker = createRequire(path.join(worker, "package.json"));
const { Miniflare } = requireWorker("miniflare");
const { build } = requireWorker("esbuild");
const catalogText = fs.readFileSync(path.join(root, "archive/data/archive2-catalog.json"), "utf8");
const canonicalManifest = JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-canonical-input-manifest.json"), "utf8"));
const catalog = { ...core.decodeCatalog(JSON.parse(catalogText)), indexVersion: canonicalManifest.projectionVersion };

const bundle = await build({
  stdin: {
    contents: `import { handleExams } from './routes/exams.js';
export default {async fetch(request, env) {
  const url = new URL(request.url);
  const path = url.pathname.split('/').filter(Boolean);
  const role = request.headers.get('X-Fixture-Role') || '';
  const teacher = role ? { id: role === 'admin' ? 'admin' : 'teacher-a', role } : null;
  return handleExams(request, env, teacher, path, url);
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
  bindings: {
    ARCHIVE2_ENABLED: "true",
    ARCHIVE_PUBLIC_BASE_URL: "https://icefoxtail.github.io/AP------/archive",
  },
  serviceBindings: {
    ARCHIVE2_ASSETS: (request) => {
      const url = new URL(request.url);
      const mounts = [
        ["/AP------/archive/", path.join(root, "archive")],
        ["/AP------/docs/", path.join(root, "docs")],
      ];
      const mount = mounts.find(([prefix]) => url.pathname.startsWith(prefix));
      if (!mount) return new Response("Not found", { status: 404 });
      const relativePath = decodeURIComponent(url.pathname.slice(mount[0].length));
      const baseDir = mount[1];
      const filePath = path.resolve(baseDir, relativePath);
      const relative = path.relative(baseDir, filePath);
      if (!relativePath || relative.startsWith("..") || path.isAbsolute(relative) || !fs.existsSync(filePath))
        return new Response("Not found", { status: 404 });
      const mime = path.extname(filePath).toLowerCase() === ".svg"
        ? "image/svg+xml"
        : path.extname(filePath).toLowerCase() === ".json"
          ? "application/json"
        : path.extname(filePath).toLowerCase() === ".png"
          ? "image/png"
          : path.extname(filePath).toLowerCase() === ".js"
            ? "application/javascript"
            : "image/jpeg";
      return new Response(fs.readFileSync(filePath), { headers: { "Content-Type": mime } });
    },
  },
});

function uuid() { return crypto.randomUUID(); }
function materialize(record) {
  const bank = source.evaluate(
    fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"),
    record.sourceFile,
  );
  const question = {
    ...bank[record.sourceOrdinal - 1],
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceFile,
    sourceOrdinal: record.sourceOrdinal,
    sourceFingerprint: record.sourceFingerprint,
  };
  for (const field of core.META_FIELDS)
    if (record[field] !== undefined) question[field] = record[field];
  return question;
}
function filtersFor(record) {
  return { grade: record.effectiveBrowseGrade, primaryPaths: [core.pathKey(record, 4)] };
}
function metaFor(title, questions, filters) {
  return {
    title,
    count: questions.length,
    grade: filters.grade,
    subject: core.subjectProjectionLabel(filters) || filters.courseKey || "",
    questionUids: questions.map((question) => question.questionUid),
    printHeaderOptions: {
      title,
      subtitle: "saved paper fixture",
      metaRight: "AP Math",
      showNameLine: true,
      showScoreLine: true,
      applyToSolution: true,
      applyToAnswer: true,
    },
    qpp: 4,
    includeQr: false,
    sourceType: "mixed",
    indexVersion: catalog.indexVersion,
  };
}
function saveInput(batchId, filters, papers, indexVersion = catalog.indexVersion) {
  return {
    schema_version: "archive-saved-paper-v1",
    save_batch_id: batchId,
    index_version: indexVersion,
    selection_filters: filters,
    include_extended: false,
    owner_teacher_id: "must-be-ignored",
    papers,
  };
}
async function request(pathname, method = "GET", body, role = "admin") {
  const response = await mf.dispatchFetch(`http://local/api/${pathname.replace(/^\//, "")}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(role ? { "X-Fixture-Role": role } : {}),
      ...(pathname.replace(/^\//, "").startsWith("class-exam-assignments")
        ? { "X-Archive2-Contract": "archive2-v1" }
        : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return { status: response.status, body: await response.json() };
}
async function migrate(db, sql) {
  const triggers = [...sql.matchAll(/CREATE TRIGGER IF NOT EXISTS[\s\S]*?END;/g)].map((match) => match[0]);
  const plain = sql.replace(/CREATE TRIGGER IF NOT EXISTS[\s\S]*?END;/g, "").replace(/--[^\n]*/g, "");
  for (const statement of plain.split(";").map((value) => value.trim()).filter(Boolean))
    await db.prepare(statement).run();
  for (const trigger of triggers) await db.prepare(trigger).run();
}

try {
  const db = await mf.getD1Database("DB");
  const schema = fs.readFileSync(path.join(worker, "schema.sql"), "utf8");
  for (const table of [
    "class_exam_assignments",
    "class_exam_assignment_recipients",
    "class_exam_assignment_exclusions",
    "exam_blueprints",
    "exam_sessions",
    "wrong_answers",
  ]) {
    const match = schema.match(new RegExp("CREATE TABLE IF NOT EXISTS " + table + " \\([\\s\\S]*?\\n\\);"));
    assert.ok(match, `schema contains ${table}`);
    await db.prepare(match[0]).run();
  }
  await db.exec(`
    CREATE TABLE classes(id TEXT PRIMARY KEY,name TEXT,teacher_name TEXT);
    CREATE TABLE students(id TEXT PRIMARY KEY,name TEXT,school_name TEXT DEFAULT '',grade TEXT DEFAULT '고1',student_pin TEXT DEFAULT '',status TEXT DEFAULT '재원');
    CREATE TABLE class_students(class_id TEXT,student_id TEXT);
    CREATE TABLE teacher_classes(teacher_id TEXT,class_id TEXT);
    CREATE TABLE attendance(student_id TEXT,status TEXT,date TEXT);
    ALTER TABLE exam_sessions ADD COLUMN assignment_id TEXT;
  `);
  await migrate(db, fs.readFileSync(path.join(worker, "migrations/20260916_archive2_question_bridge.sql"), "utf8"));
  await migrate(db, fs.readFileSync(path.join(worker, "migrations/20260929_archive_saved_papers.sql"), "utf8"));
  await migrate(db, fs.readFileSync(path.join(worker, "migrations/20261002_archive2_paper_lifecycle_foundation.sql"), "utf8"));
  await db.prepare("INSERT INTO classes VALUES ('class-a','고2 기본 검증반','Teacher A'),('class-saved','고2 저장본 검증반','Teacher A'),('class-race','고2 다중 반 검증반','Teacher B')").run();
  await db.prepare("INSERT INTO students(id,name) VALUES ('student-a','기본 검증학생'),('student-save-a','저장본 검증학생 가'),('student-save-b','저장본 검증학생 나'),('student-race','다중 반 검증학생')").run();
  await db.prepare("INSERT INTO class_students VALUES ('class-a','student-a'),('class-saved','student-save-a'),('class-saved','student-save-b'),('class-race','student-race')").run();

  const automatic = catalog.records.filter((record) => record.automatic);
  let imageFixture = null;
  let htmlImageFixture = null;
  const bankCache = new Map();
  for (const record of automatic) {
    if (!bankCache.has(record.sourceFile)) {
      bankCache.set(record.sourceFile, source.evaluate(
        fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"),
        record.sourceFile,
      ));
    }
    const rawQuestion = bankCache.get(record.sourceFile)[record.sourceOrdinal - 1];
    if (!imageFixture && typeof rawQuestion?.image === "string" && rawQuestion.image.startsWith("assets/images/"))
      imageFixture = { record, rawQuestion };
    const html = [rawQuestion?.content, rawQuestion?.question, rawQuestion?.solution]
      .filter((value) => typeof value === "string").join(" ");
    if (!htmlImageFixture && typeof rawQuestion?.solutionImage === "string" &&
        rawQuestion.solutionImage.startsWith("assets/images/") && rawQuestion.solutionImage.toLowerCase().endsWith(".svg")) {
      const match = /<img\b[^>]*\bsrc\s*=\s*(["'])([^"']*assets\/images\/[^"']+)\1/i.exec(html);
      if (match) htmlImageFixture = { record, rawQuestion, imagePath: match[2] };
    }
    if (imageFixture && htmlImageFixture) break;
  }
  assert.ok(imageFixture, "approved fixture has an image field asset");
  assert.ok(htmlImageFixture, "approved fixture has an inline HTML image asset");

  const directQuestion = materialize(imageFixture.record);
  const directFilters = filtersFor(imageFixture.record);
  const directBatchId = uuid();
  const directInput = saveInput(directBatchId, directFilters, [
    { part_index: 0, questions: [directQuestion], meta: metaFor("image snapshot", [directQuestion], directFilters) },
  ]);
  const beforeAssignments = Number((await db.prepare("SELECT COUNT(*) n FROM class_exam_assignments").first()).n);
  const directSaved = await request("archive-saved-papers", "POST", directInput);
  assert.equal(directSaved.status, 200, JSON.stringify(directSaved));
  assert.equal(directSaved.body.papers[0].title, "image snapshot");
  assert.equal(directSaved.body.papers[0].library_display_name, "image snapshot");
  assert.equal(directSaved.body.papers[0].library_status, "ACTIVE");
  const resolvedBatch = await request("archive-saved-papers/save-batches/" + directBatchId);
  assert.equal(resolvedBatch.status, 200, JSON.stringify(resolvedBatch));
  assert.equal(resolvedBatch.body.saved, true);
  assert.equal(resolvedBatch.body.papers[0].id, directSaved.body.papers[0].id);
  const missingBatch = await request("archive-saved-papers/save-batches/" + uuid());
  assert.equal(missingBatch.status, 200);
  assert.equal(missingBatch.body.found, false);
  assert.equal(Number((await db.prepare("SELECT COUNT(*) n FROM class_exam_assignments").first()).n), beforeAssignments, "paper save creates no assignment");
  const directId = directSaved.body.papers[0].id;
  const directDetail = await request(`archive-saved-papers/${directId}`);
  assert.equal(directDetail.status, 200);
  const originalContentHash = directDetail.body.paper.snapshot_hash;
  const copyBatchId = uuid();
  const exactCopy = await request(`archive-saved-papers/${directId}/copy`, "POST", {
    save_batch_id: copyBatchId,
    expected_snapshot_hash: originalContentHash,
  });
  assert.equal(exactCopy.status, 200, JSON.stringify(exactCopy));
  const exactCopyId = exactCopy.body.papers[0].id;
  assert.notEqual(exactCopyId, directId);
  const exactCopyDetail = await request(`archive-saved-papers/${exactCopyId}`);
  assert.equal(exactCopyDetail.status, 200);
  assert.equal(exactCopyDetail.body.paper.snapshot_hash, originalContentHash);
  assert.equal(exactCopyDetail.body.paper.title, directDetail.body.paper.title);
  assert.equal(exactCopyDetail.body.paper.library_display_name, directDetail.body.paper.title + " (복사본)");
  const [parentStoredSnapshot, copiedStoredSnapshot] = await Promise.all([
    db.prepare("SELECT snapshot_json FROM archive_saved_papers WHERE id=?").bind(directId).first(),
    db.prepare("SELECT snapshot_json FROM archive_saved_papers WHERE id=?").bind(exactCopyId).first(),
  ]);
  assert.equal(copiedStoredSnapshot.snapshot_json, parentStoredSnapshot.snapshot_json,
    "COPY reuses the verified immutable snapshot bytes exactly");
  const exactCopyLineage = await db.prepare(
    "SELECT * FROM archive_saved_paper_lineage WHERE child_saved_paper_id=?",
  ).bind(exactCopyId).first();
  assert.equal(exactCopyLineage.parent_kind, "SAVED_PAPER");
  assert.equal(exactCopyLineage.parent_id, directId);
  assert.equal(exactCopyLineage.parent_snapshot_hash, originalContentHash);
  assert.equal(exactCopyLineage.derivation_type, "COPY");
  const retriedCopy = await request(`archive-saved-papers/${directId}/copy`, "POST", {
    save_batch_id: copyBatchId,
    expected_snapshot_hash: originalContentHash,
  });
  assert.equal(retriedCopy.status, 200, JSON.stringify(retriedCopy));
  assert.equal(retriedCopy.body.papers[0].id, exactCopyId, "copy retry resolves through the same idempotency identity");
  const changedCopyRetry = await request(`archive-saved-papers/${directId}/copy`, "POST", {
    save_batch_id: copyBatchId,
    expected_snapshot_hash: "f".repeat(64),
  });
  assert.equal(changedCopyRetry.status, 409, "a copy batch cannot be reused for a different frozen parent");

  const revisionInput = structuredClone(directInput);
  revisionInput.save_batch_id = uuid();
  revisionInput.papers[0].lineage = {
    parent_kind: "SAVED_PAPER",
    parent_id: directId,
    parent_revision: null,
    parent_snapshot_hash: originalContentHash,
    derivation_type: "REVISION",
  };
  const revisionSaved = await request("archive-saved-papers", "POST", revisionInput);
  assert.equal(revisionSaved.status, 200, JSON.stringify(revisionSaved));
  const revisionLineage = await db.prepare(
    "SELECT * FROM archive_saved_paper_lineage WHERE child_saved_paper_id=?",
  ).bind(revisionSaved.body.papers[0].id).first();
  assert.equal(revisionLineage.parent_kind, "SAVED_PAPER");
  assert.equal(revisionLineage.parent_id, directId);
  assert.equal(revisionLineage.parent_snapshot_hash, originalContentHash);
  assert.equal(revisionLineage.derivation_type, "REVISION");
  const forkInput = structuredClone(directInput);
  forkInput.save_batch_id = uuid();
  forkInput.papers[0].lineage = {
    parent_kind: "SAVED_PAPER",
    parent_id: directId,
    parent_revision: null,
    parent_snapshot_hash: originalContentHash,
    derivation_type: "FORK",
  };
  const forkSaved = await request("archive-saved-papers", "POST", forkInput);
  assert.equal(forkSaved.status, 200, JSON.stringify(forkSaved));
  const forkLineage = await db.prepare(
    "SELECT * FROM archive_saved_paper_lineage WHERE child_saved_paper_id=?",
  ).bind(forkSaved.body.papers[0].id).first();
  assert.equal(forkLineage.derivation_type, "FORK");
  assert.equal(forkLineage.parent_kind, "SAVED_PAPER");
  assert.equal(forkLineage.parent_id, directId);
  const copyThroughRevisionRoute = structuredClone(directInput);
  copyThroughRevisionRoute.save_batch_id = uuid();
  copyThroughRevisionRoute.papers[0].lineage = {
    parent_kind: "SAVED_PAPER",
    parent_id: directId,
    parent_revision: null,
    parent_snapshot_hash: originalContentHash,
    derivation_type: "COPY",
  };
  const forbiddenCopy = await request("archive-saved-papers", "POST", copyThroughRevisionRoute);
  assert.equal(forbiddenCopy.status, 409, "exact copies must use the snapshot-preserving copy route");
  const forbiddenSharedRevisionInput = structuredClone(directInput);
  forbiddenSharedRevisionInput.save_batch_id = uuid();
  forbiddenSharedRevisionInput.papers[0].lineage = {
    parent_kind: "SHARED_PAPER",
    parent_id: uuid(),
    parent_revision: "rev-1",
    parent_snapshot_hash: originalContentHash,
    derivation_type: "FORK",
  };
  const forbiddenSharedRevision = await request("archive-saved-papers", "POST", forbiddenSharedRevisionInput);
  assert.equal(forbiddenSharedRevision.status, 409, "Shared Paper lineage writes remain outside this campaign");
  const renamed = await request("archive-saved-papers/" + directId + "/library", "PATCH", {
    display_name: "왕운중 심화반용",
  });
  assert.equal(renamed.status, 200, JSON.stringify(renamed));
  const renamedDetail = await request("archive-saved-papers/" + directId);
  assert.equal(renamedDetail.body.paper.title, "image snapshot", "library label never replaces output title");
  assert.equal(renamedDetail.body.paper.library_display_name, "왕운중 심화반용");
  assert.equal(renamedDetail.body.paper.snapshot_hash, originalContentHash);
  assert.equal(renamedDetail.body.paper.snapshot.meta.title, "image snapshot");
  const displayNameSearch = await request("archive-saved-papers?limit=20&q=" + encodeURIComponent("왕운중"));
  assert.equal(displayNameSearch.body.papers.some(paper => paper.id === directId), true,
    "the existing title search should find the mutable library display name");
  const archived = await request("archive-saved-papers/" + directId + "/library", "PATCH", { status: "ARCHIVED" });
  assert.equal(archived.status, 200, JSON.stringify(archived));
  assert.equal((await request("archive-saved-papers?limit=20")).body.papers.some(paper => paper.id === directId), false);
  assert.equal((await request("archive-saved-papers?status=ARCHIVED&limit=20")).body.papers.some(paper => paper.id === directId), true);
  const restored = await request("archive-saved-papers/" + directId + "/library", "PATCH", { status: "ACTIVE" });
  assert.equal(restored.status, 200, JSON.stringify(restored));
  const frozenImage = directDetail.body.paper.snapshot.questions[0].image;
  assert.match(frozenImage, /^data:image\/png;base64,/);
  assert.ok(Buffer.from(frozenImage.split(",")[1], "base64").equals(
    fs.readFileSync(path.join(root, "archive", imageFixture.rawQuestion.image)),
  ), "snapshot embeds the source image bytes");
  const retry = await request("archive-saved-papers", "POST", directInput);
  assert.equal(retry.body.idempotent, true);
  assert.equal(retry.body.papers[0].id, directId);
  const changed = await request("archive-saved-papers", "POST", {
    ...directInput,
    papers: [{ ...directInput.papers[0], meta: metaFor("changed title", [directQuestion], directFilters) }],
  });
  assert.equal(changed.status, 409);
  assert.equal((await request(`archive-saved-papers/${directId}`, "GET", undefined, "teacher")).status, 404);
  assert.equal((await request("archive-saved-papers", "GET", undefined, "")).status, 401);
  const list = await request("archive-saved-papers?limit=20");
  assert.equal("snapshot" in list.body.papers[0], false);

  const htmlQuestion = materialize(htmlImageFixture.record);
  const htmlFilters = filtersFor(htmlImageFixture.record);
  const htmlSaved = await request("archive-saved-papers", "POST", saveInput(uuid(), htmlFilters, [
    { part_index: 0, questions: [htmlQuestion], meta: metaFor("html image snapshot", [htmlQuestion], htmlFilters) },
  ], catalog.indexVersion));
  assert.equal(htmlSaved.status, 200, JSON.stringify(htmlSaved));
  const htmlDetail = await request(`archive-saved-papers/${htmlSaved.body.papers[0].id}`);
  const htmlQuestionSaved = htmlDetail.body.paper.snapshot.questions[0];
  assert.match(htmlQuestionSaved.solutionImage, /^data:image\/svg\+xml;base64,/);
  const embeddedInlineImage = /<img\b[^>]*\bsrc=["'](data:image\/[^"']+)["']/i.exec(htmlQuestionSaved.content)?.[1];
  assert.ok(embeddedInlineImage, "HTML img src is inlined into saved content");
  assert.ok(Buffer.from(embeddedInlineImage.split(",")[1], "base64").equals(
    fs.readFileSync(path.join(root, "archive", htmlImageFixture.imagePath)),
  ), "HTML image bytes are pinned");

  const batchQuestions = automatic
    .filter((record) => record.effectiveBrowseGrade === directFilters.grade && core.pathKey(record, 4) === directFilters.primaryPaths[0])
    .slice(0, 2)
    .map(materialize);
  assert.equal(batchQuestions.length, 2);
  const batchFilters = { grade: directFilters.grade, primaryPaths: directFilters.primaryPaths };
  const failedBatchId = uuid();
  await db.prepare(`CREATE TRIGGER runtime_fail_second_saved_part BEFORE INSERT ON archive_saved_papers WHEN NEW.save_batch_id='${failedBatchId}' AND NEW.part_index=1 BEGIN SELECT RAISE(ABORT,'fixture second part failure'); END`).run();
  const beforeFailedBatch = Number((await db.prepare("SELECT COUNT(*) n FROM archive_saved_papers WHERE owner_teacher_id='admin'").first()).n);
  const failedBatch = await request("archive-saved-papers", "POST", saveInput(failedBatchId, batchFilters, batchQuestions.map((question,index)=>({part_index:index,questions:[question],meta:metaFor(`part ${index+1}`,[question],batchFilters)})), catalog.indexVersion));
  assert.notEqual(failedBatch.status, 200);
  assert.equal(Number((await db.prepare("SELECT COUNT(*) n FROM archive_saved_papers WHERE owner_teacher_id='admin'").first()).n), beforeFailedBatch, "D1 batch rollback leaves no first part");
  await db.prepare("DROP TRIGGER runtime_fail_second_saved_part").run();

  const assignmentBatchId = uuid();
  const assignmentInput = {
    contract_version: "archive2-v1",
    saved_paper_id: directId,
    assignment_batch_id: assignmentBatchId,
    class_id: "class-saved",
    student_ids: ["student-save-a"],
    exam_date: "2026-09-29",
    exam_title: "client title ignored",
    pdf_qpp: 8,
    mixed_payload_json: { questions: [], meta: {} },
  };
  const assignment = await request("class-exam-assignments", "POST", assignmentInput);
  assert.equal(assignment.body.saved, true, JSON.stringify(assignment));
  assert.equal(assignment.body.assignment.saved_paper_id, directId);
  assert.equal(assignment.body.assignment.exam_title, "image snapshot");
  assert.equal(Number(assignment.body.assignment.pdf_qpp), 4);
  assert.equal(assignment.body.assignment.archive_file, `MIXED:archive2-saved-${directId}-${assignmentBatchId}`);
  assert.equal(assignment.status, 502, "fixture has no Browser Rendering; assignment remains saved on PDF failure");
  const assignmentRetry = await request("class-exam-assignments", "POST", assignmentInput);
  assert.equal(assignmentRetry.body.assignment.id, assignment.body.assignment.id);
  const secondClassAssignment = await request("class-exam-assignments", "POST", { ...assignmentInput, class_id: "class-race", student_ids: ["student-race"] });
  assert.equal(secondClassAssignment.body.saved, true);
  assert.equal(secondClassAssignment.body.assignment.archive_file, assignment.body.assignment.archive_file);
  const priorBlueprintCount = Number((await db.prepare("SELECT COUNT(*) n FROM exam_blueprints WHERE archive_file=?").bind(assignment.body.assignment.archive_file).first()).n);
  assert.ok(priorBlueprintCount >= 1);
  const missingOtherClassWriteKey = crypto.createHash("sha256").update(JSON.stringify(["class-b", assignmentInput.exam_date, assignment.body.assignment.archive_file])).digest("hex");
  const metadataAuthority = {
    buildArchiveQuestionMetadata: (question) => ({ standardUnitKey: question.standardUnitKey || null, standardUnit: question.L2 || null, standardCourse: question.courseKey || null, conceptClusterKey: null, subUnitKey: question.L3 || null, typeKey: null, templateKey: null, difficulty: String(question.difficultyBucket || "UNKNOWN"), metadataRevision: "fixture" }),
    buildArchiveMetadataHash: async (metadata) => crypto.createHash("sha256").update(JSON.stringify(metadata)).digest("hex"),
  };
  await db.batch(await blueprintInsertStatements({ DB: db }, assignment.body.assignment.archive_file, directDetail.body.paper.snapshot.questions, metadataAuthority, { assignmentGuard: { writeKey: missingOtherClassWriteKey } }));
  assert.equal(Number((await db.prepare("SELECT COUNT(*) n FROM exam_blueprints WHERE archive_file=?").bind(assignment.body.assignment.archive_file).first()).n), priorBlueprintCount, "missing other-class assignment cannot delete or add shared blueprint rows");
  assert.equal(Number((await db.prepare("SELECT COUNT(*) n FROM class_exam_assignment_questions WHERE assignment_id=?").bind(assignment.body.assignment.id).first()).n), 1, "existing assignment bridge rows remain intact");
  const deleted = await request(`archive-saved-papers/${directId}`, "DELETE");
  assert.equal(deleted.body.deleted, true);
  assert.equal((await request(`archive-saved-papers/${directId}`)).status, 404);
  assert.equal(Number((await db.prepare("SELECT COUNT(*) n FROM class_exam_assignments WHERE saved_paper_id=?").bind(directId).first()).n), 2, "soft delete retains both successful class assignments");
  assert.equal((await request("class-exam-assignments", "POST", { ...assignmentInput, assignment_batch_id: uuid() })).status, 404);
  assert.equal((await db.prepare("SELECT deleted_at FROM archive_saved_papers WHERE id=?").bind(directId).first()).deleted_at, null,
    "new trash changes only mutable library state");
  const trashed = await request("archive-saved-papers/" + directId + "/library", "PATCH", { status: "TRASHED" });
  assert.equal(trashed.status, 200, JSON.stringify(trashed));
  const trashList = await request("archive-saved-papers?status=TRASHED&limit=20");
  assert.equal(trashList.body.papers.some(paper => paper.id === directId), true);
  const restoredFromTrash = await request("archive-saved-papers/" + directId + "/library", "PATCH", { status: "ACTIVE" });
  assert.equal(restoredFromTrash.status, 200, JSON.stringify(restoredFromTrash));
  assert.equal((await request("archive-saved-papers/" + directId)).status, 200);
  await db.prepare("UPDATE archive_saved_papers SET deleted_at=? WHERE id=?")
    .bind("2026-10-02T00:00:00.000Z", directId).run();
  const legacyRestore = await request("archive-saved-papers/" + directId + "/library", "PATCH", { status: "ACTIVE" });
  assert.equal(legacyRestore.status, 409, "legacy one-way tombstones cannot be restored through the new sidecar");
  assert.equal((await request("archive-saved-papers/" + directId)).status, 404);

  console.log("Archive saved-paper D1 runtime passed: ownership, immutable content, images, idempotency, rollback, same-day multi-class identity, PDF failure retention, race guard, and soft delete.");
} finally {
  await mf.dispose();
}
