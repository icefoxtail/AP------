// 그림이 많은 단원으로 20·50문항 문제지를 저장 -> 읽기 -> 수정본 다시 저장 -> 출제 복사까지 돌려 본다.
// 운영 요청 0건: Miniflare + 로컬 D1, 그림 요청(img.wangjiedu.com)은 저장소의 archive/assets/images 파일로 답한다.
// 이유 1: 그림을 data URL로 내장하던 때는 권당 1,500,000바이트 상한 때문에 그림 많은 단원 20~50문항이 413으로 거절됐다.
//   검사는 개수가 아니라 조건이다(저장 크기 < 한도, 왕복 성공, 내장 없음).
// 이유 2: 그림 한 장을 서버가 읽지 못해도(404·읽기 오류) 문제지는 저장돼야 한다("한 문항 때문에 전체가 막히면 안 된다").
//   읽지 못한 그림만 { path, sha256: null, bytes: null, missing: true }로 남고, 응답이 "N권 M번 문항"으로 알려 준다.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import core from "../archive/archive2-core.js";
import source from "../archive/archive2-source.js";
import { MAX_SAVED_PAPER_BYTES, stableStringify } from "../apmath/worker-backup/worker/helpers/archive-saved-papers.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const worker = path.join(root, "apmath/worker-backup/worker");
const requireWorker = createRequire(path.join(worker, "package.json"));
const { Miniflare } = requireWorker("miniflare");
const { build } = requireWorker("esbuild");
const canonicalManifest = JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-canonical-input-manifest.json"), "utf8"));
const catalog = {
  ...core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-catalog.json"), "utf8"))),
  indexVersion: canonicalManifest.projectionVersion,
};

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

const R2_IMAGE_PREFIX = "/exams/images/";
let r2ImageRequests = 0;
// 그림 키 -> 요청 횟수. r2Behavior에 (몇 번째 요청인지) => Response | null 을 두면 그 키만 다르게 답한다(null이면 정상).
const r2KeyRequests = new Map();
const r2Behavior = new Map();
const mf = new Miniflare({
  modules: true,
  script: bundle.outputFiles[0].text,
  compatibilityDate: "2026-07-11",
  compatibilityFlags: ["nodejs_compat"],
  d1Databases: ["DB"],
  r2Buckets: ["EXAM_PDF_BUCKET"],
  bindings: { ARCHIVE2_ENABLED: "true", ARCHIVE_PUBLIC_BASE_URL: "https://icefoxtail.github.io/AP------/archive" },
  outboundService: (request) => {
    const url = new URL(request.url);
    if (url.origin !== "https://img.wangjiedu.com" || !url.pathname.startsWith(R2_IMAGE_PREFIX))
      return new Response("Unexpected outbound request " + request.url, { status: 502 });
    r2ImageRequests += 1;
    const requestedKey = decodeURIComponent(url.pathname.slice(R2_IMAGE_PREFIX.length));
    const nth = (r2KeyRequests.get(requestedKey) || 0) + 1;
    r2KeyRequests.set(requestedKey, nth);
    const forced = r2Behavior.get(requestedKey)?.(nth);
    if (forced) return forced;
    const baseDir = path.join(root, "archive/assets/images");
    const filePath = path.resolve(baseDir, decodeURIComponent(url.pathname.slice(R2_IMAGE_PREFIX.length)));
    if (path.relative(baseDir, filePath).startsWith("..") || !fs.existsSync(filePath)) return new Response("Not found", { status: 404 });
    const ext = path.extname(filePath).toLowerCase();
    return new Response(fs.readFileSync(filePath), {
      headers: { "Content-Type": ext === ".svg" ? "image/svg+xml" : ext === ".png" ? "image/png" : "image/jpeg" },
    });
  },
  serviceBindings: {
    // 카탈로그·정본 JSON은 Pages(archive/)에서 읽는다. 그림은 여기로 오지 않는다(R2 쪽만).
    ARCHIVE2_ASSETS: (request) => {
      const url = new URL(request.url);
      const mounts = [["/AP------/archive/", path.join(root, "archive")], ["/AP------/docs/", path.join(root, "docs")]];
      const mount = mounts.find(([prefix]) => url.pathname.startsWith(prefix));
      if (!mount || /\/assets\/images\//i.test(decodeURIComponent(url.pathname))) return new Response("Not found", { status: 404 });
      const filePath = path.resolve(mount[1], decodeURIComponent(url.pathname.slice(mount[0].length)));
      if (path.relative(mount[1], filePath).startsWith("..") || !fs.existsSync(filePath)) return new Response("Not found", { status: 404 });
      return new Response(fs.readFileSync(filePath), { headers: { "Content-Type": filePath.endsWith(".json") ? "application/json" : "application/javascript" } });
    },
  },
});

const HTML_IMAGE_REF = /(\bsrc\s*=\s*)(["'])([^"']+)\2|url\(\s*(["']?)([^)"'\s]+)(["']?\s*\))/gi;
function imagePaths(question) {
  const refs = [question.image, question.solutionImage];
  for (const field of ["content", "question", "solution"])
    if (typeof question[field] === "string") for (const match of question[field].matchAll(HTML_IMAGE_REF)) refs.push(match[3] || match[5]);
  return [...new Set(refs.filter((ref) => typeof ref === "string" && ref.includes("assets/images/")).map((ref) => ref.split(/[?#]/, 1)[0]))];
}
function imageBytes(question) {
  let total = 0;
  for (const p of imagePaths(question)) {
    try { total += fs.statSync(path.join(root, "archive", p)).size; } catch { /* a missing file counts 0 */ }
  }
  return total;
}
const bankCache = new Map();
function materialize(record) {
  if (!bankCache.has(record.sourceFile))
    bankCache.set(record.sourceFile, source.evaluate(fs.readFileSync(path.join(root, "archive/exams", record.sourceFile), "utf8"), record.sourceFile));
  const question = {
    ...bankCache.get(record.sourceFile)[record.sourceOrdinal - 1],
    questionUid: record.questionUid,
    sourceArchiveFile: record.sourceFile,
    sourceOrdinal: record.sourceOrdinal,
    sourceFingerprint: record.sourceFingerprint,
  };
  for (const field of core.META_FIELDS) if (record[field] !== undefined) question[field] = record[field];
  return question;
}
function metaFor(title, questions, filters, qpp = 4) {
  return {
    title,
    count: questions.length,
    grade: filters.grade,
    subject: core.subjectProjectionLabel(filters) || filters.courseKey || "",
    questionUids: questions.map((question) => question.questionUid),
    printHeaderOptions: { title, subtitle: "many images", metaRight: "AP Math", showNameLine: true, showScoreLine: true, applyToSolution: true, applyToAnswer: true },
    qpp,
    includeQr: false,
    sourceType: "mixed",
    indexVersion: catalog.indexVersion,
  };
}
async function request(pathname, method = "GET", body) {
  const text = body ? JSON.stringify(body) : undefined;
  const response = await mf.dispatchFetch(`http://local/api/${pathname}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      "X-Fixture-Role": "admin",
      ...(pathname.startsWith("class-exam-assignments") ? { "X-Archive2-Contract": "archive2-v1" } : {}),
    },
    ...(text ? { body: text } : {}),
  });
  const raw = await response.text();
  return { status: response.status, bytes: raw.length, body: JSON.parse(raw), requestBytes: text ? Buffer.byteLength(text) : 0 };
}
async function migrate(db, sql) {
  const triggers = [...sql.matchAll(/CREATE TRIGGER IF NOT EXISTS[\s\S]*?END;/g)].map((match) => match[0]);
  const plain = sql.replace(/CREATE TRIGGER IF NOT EXISTS[\s\S]*?END;/g, "").replace(/--[^\n]*/g, "");
  for (const statement of plain.split(";").map((value) => value.trim()).filter(Boolean)) await db.prepare(statement).run();
  for (const trigger of triggers) await db.prepare(trigger).run();
}

// 그림 바이트가 가장 큰 단원 3개(문항 50개 이상). 단원마다 그림이 큰 문항부터 20개·50개.
const automatic = catalog.records.filter((record) => record.automatic);
const units = new Map();
for (const record of automatic) {
  const key = record.effectiveBrowseGrade + "|" + core.pathKey(record, 4);
  if (!units.has(key)) units.set(key, { filters: { grade: record.effectiveBrowseGrade, primaryPaths: [core.pathKey(record, 4)] }, items: [] });
  units.get(key).items.push({ record, bytes: imageBytes(materialize(record)) });
}
const picked = [...units.values()]
  .filter((unit) => unit.items.length >= 50)
  .map((unit) => ({ ...unit, items: unit.items.sort((a, b) => b.bytes - a.bytes) }))
  .sort((a, b) => b.items.slice(0, 50).reduce((s, x) => s + x.bytes, 0) - a.items.slice(0, 50).reduce((s, x) => s + x.bytes, 0))
  .slice(0, 3);

const rows = [];
try {
  const db = await mf.getD1Database("DB");
  const schema = fs.readFileSync(path.join(worker, "schema.sql"), "utf8");
  for (const table of ["class_exam_assignments", "class_exam_assignment_recipients", "class_exam_assignment_exclusions", "exam_blueprints", "exam_sessions", "wrong_answers", "assessment_result_items"]) {
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
  for (const file of ["20260916_archive2_question_bridge", "20261015_assessment_result_uid_meta_snapshot", "20260929_archive_saved_papers", "20261002_archive2_paper_lifecycle_foundation", "20261002_archive2_assignment_context"])
    await migrate(db, fs.readFileSync(path.join(worker, `migrations/${file}.sql`), "utf8"));
  await db.prepare("INSERT INTO classes VALUES ('class-a','고2 검증반','Teacher A')").run();
  await db.prepare("INSERT INTO students(id,name) VALUES ('student-a','검증학생')").run();
  await db.prepare("INSERT INTO class_students VALUES ('class-a','student-a')").run();

  assert.equal(picked.length, 3, "image-heavy units with 50+ questions exist");
  for (const unit of picked) {
    for (const count of [20, 50]) {
      const questions = unit.items.slice(0, count).map((item) => materialize(item.record));
      const embeddedWouldBe = Math.round(unit.items.slice(0, count).reduce((s, x) => s + x.bytes, 0) * 4 / 3);
      const input = {
        schema_version: "archive-saved-paper-v1",
        save_batch_id: crypto.randomUUID(),
        index_version: catalog.indexVersion,
        selection_filters: unit.filters,
        include_extended: false,
        papers: [{ part_index: 0, questions, meta: metaFor(`many images ${count}`, questions, unit.filters) }],
      };
      const row = { unit: JSON.parse(unit.filters.primaryPaths[0]).slice(2).join("/"), count, embeddedWouldBe };
      const r2Before = r2ImageRequests;
      const startedAt = Date.now();
      const saved = await request("archive-saved-papers", "POST", input);
      row.saveMs = Date.now() - startedAt;
      row.r2Fetches = r2ImageRequests - r2Before;
      row.requestBytes = saved.requestBytes;
      row.saveStatus = saved.status;
      assert.equal(saved.status, 200, JSON.stringify(saved.body).slice(0, 300));
      assert.deepEqual(saved.body.missing_images, { count: 0, items: [] }, "every image was read, none is marked missing");
      const paperId = saved.body.papers[0].id;
      const stored = await db.prepare("SELECT length(CAST(snapshot_json AS BLOB)) n FROM archive_saved_papers WHERE id=?").bind(paperId).first();
      row.snapshotBytes = Number(stored.n);
      assert.ok(row.snapshotBytes < MAX_SAVED_PAPER_BYTES, "saved paper fits the per-paper limit");
      assert.ok(row.snapshotBytes < 1_000_000, "key references keep a many-image paper well under the 2MB D1 row limit");

      const detail = await request(`archive-saved-papers/${paperId}`);
      row.detailStatus = detail.status;
      row.detailBytes = detail.bytes;
      assert.equal(detail.status, 200);
      const snapshot = detail.body.paper.snapshot;
      assert.ok(!/data:image\//.test(JSON.stringify(snapshot)), "no image is embedded");
      assert.equal(snapshot.questions.length, count);
      const expectedPaths = [...new Set(questions.flatMap(imagePaths))].sort();
      assert.deepEqual(snapshot.assets.map((asset) => asset.path).sort(), expectedPaths, "every image is listed once as path + sha256 + bytes");
      row.images = expectedPaths.length;

      // 수정본: 저장본에서 연 문항 그대로 다시 저장(REVISION).
      const revision = {
        ...input,
        save_batch_id: crypto.randomUUID(),
        papers: [{
          part_index: 0,
          questions: snapshot.questions,
          meta: { ...snapshot.meta },
          lineage: { parent_kind: "SAVED_PAPER", parent_id: paperId, parent_revision: null, parent_snapshot_hash: detail.body.paper.snapshot_hash, derivation_type: "REVISION" },
        }],
      };
      const resaved = await request("archive-saved-papers", "POST", revision);
      row.reSaveStatus = resaved.status;
      assert.equal(resaved.status, 200, JSON.stringify(resaved.body).slice(0, 300));
      assert.deepEqual(stableStringify(snapshot.questions.map((q) => q.image ?? null)), stableStringify((await request(`archive-saved-papers/${resaved.body.papers[0].id}`)).body.paper.snapshot.questions.map((q) => q.image ?? null)));

      const r2BeforeAssign = r2ImageRequests;
      const assigned = await request("class-exam-assignments", "POST", {
        contract_version: "archive2-v1",
        saved_paper_id: paperId,
        assignment_batch_id: crypto.randomUUID(),
        class_id: "class-a",
        student_ids: ["student-a"],
        exam_date: "2026-11-23",
        exam_title: "ignored",
        pdf_qpp: 4,
        mixed_payload_json: { questions: [], meta: {} },
      });
      row.assignStatus = assigned.status;
      assert.equal(assigned.body.saved, true, JSON.stringify(assigned.body).slice(0, 300));
      assert.equal(r2ImageRequests, r2BeforeAssign, "출제 복사는 그림을 다시 읽지 않는다");
      row.payloadBytes = assigned.body.assignment.mixed_payload_json.length;
      assert.ok(row.payloadBytes < 1_500_000, "assignment payload copy stays under the row limit");
      rows.push(row);
    }
  }
  console.log(JSON.stringify(rows, null, 1));

  // ---- 그림 한 장을 읽지 못해도 문제지는 저장된다 -------------------------------------------------------------
  const unit = picked[0];
  const keyOf = (imagePath) => imagePath.replace(/^assets\/images\//, "");
  const SHA = /^[0-9a-f]{64}$/;
  const questions50 = unit.items.slice(0, 50).map((item) => materialize(item.record));
  const usage = new Map();
  questions50.forEach((question, index) => imagePaths(question).forEach((p) => usage.set(p, [...(usage.get(p) || []), index])));
  assert.ok(usage.size >= 50, "the 50-question paper has many images");
  const onlyOnce = [...usage].filter(([, users]) => users.length === 1).map(([p, users]) => ({ path: p, index: users[0] }));
  assert.ok(onlyOnce.length >= 3, "enough images used by one question only");
  const wholePaper = (questions, batchId = crypto.randomUUID()) => ({
    schema_version: "archive-saved-paper-v1",
    save_batch_id: batchId,
    index_version: catalog.indexVersion,
    selection_filters: unit.filters,
    include_extended: false,
    papers: [{ part_index: 0, questions, meta: metaFor("missing image", questions, unit.filters) }],
  });
  const assign = (savedPaperId) => request("class-exam-assignments", "POST", {
    contract_version: "archive2-v1", saved_paper_id: savedPaperId, assignment_batch_id: crypto.randomUUID(), class_id: "class-a",
    student_ids: ["student-a"], exam_date: "2026-11-23", exam_title: "ignored", pdf_qpp: 4, mixed_payload_json: { questions: [], meta: {} },
  });
  const reviseFrom = (paperId, detailBody) => ({
    ...wholePaper(detailBody.paper.snapshot.questions),
    papers: [{
      part_index: 0, questions: detailBody.paper.snapshot.questions, meta: { ...detailBody.paper.snapshot.meta },
      lineage: { parent_kind: "SAVED_PAPER", parent_id: paperId, parent_revision: null, parent_snapshot_hash: detailBody.paper.snapshot_hash, derivation_type: "REVISION" },
    }],
  });

  // (1) 그림 100장 가까이 중 1장이 404: 저장 200, 그 1장만 표시, 읽기·수정본·출제 복사 통과, 응답에 위치. 404는 다시 읽지 않는다.
  {
    const lost = onlyOnce[0];
    r2Behavior.set(keyOf(lost.path), () => new Response("Not found", { status: 404 }));
    r2KeyRequests.clear();
    const first = wholePaper(questions50);
    const saved = await request("archive-saved-papers", "POST", first);
    assert.equal(saved.status, 200, JSON.stringify(saved.body).slice(0, 300));
    assert.equal(saved.body.saved, true);
    assert.deepEqual(saved.body.missing_images, {
      count: 1,
      items: [{ part: 1, question: lost.index + 1, place: `1권 ${lost.index + 1}번 문항`, path: lost.path }],
    });
    assert.equal(r2KeyRequests.get(keyOf(lost.path)), 1, "a 404 is a definite answer: the image is not read again");
    const paperId = saved.body.papers[0].id;
    const detail = await request(`archive-saved-papers/${paperId}`);
    assert.equal(detail.status, 200, "a snapshot with a not-verified image is read like any other");
    const assets = detail.body.paper.snapshot.assets;
    assert.equal(assets.length, usage.size);
    assert.deepEqual(assets.filter((asset) => asset.missing), [{ path: lost.path, sha256: null, bytes: null, missing: true }], "only that image is marked");
    assert.ok(assets.filter((asset) => !asset.missing).every((asset) => SHA.test(asset.sha256) && Number.isInteger(asset.bytes) && asset.bytes > 0 && asset.missing === undefined), "every other image keeps its sha256 + byte count");
    assert.equal(detail.body.paper.snapshot.questions[lost.index].questionUid, questions50[lost.index].questionUid, "the question itself is saved");

    // 수정본 다시 저장(그림은 아직 없음) / 출제 복사
    const resaved = await request("archive-saved-papers", "POST", reviseFrom(paperId, detail.body));
    assert.equal(resaved.status, 200, JSON.stringify(resaved.body).slice(0, 300));
    assert.equal(resaved.body.missing_images.count, 1);
    const reads = r2ImageRequests;
    const assigned = await assign(paperId);
    assert.equal(assigned.body.saved, true, JSON.stringify(assigned.body).slice(0, 300));
    assert.equal(r2ImageRequests, reads, "assigning reads no image");
    assert.ok(!/data:image\//.test(assigned.body.assignment.mixed_payload_json));

    // 멱등: 같은 요청을 그림이 생긴 뒤에 다시 보내도 처음 저장본 그대로 답한다(두 번째에 그림이 있어도 결과가 갈리지 않는다).
    r2Behavior.delete(keyOf(lost.path));
    r2KeyRequests.clear();
    const retry = await request("archive-saved-papers", "POST", first);
    assert.equal(retry.status, 200);
    assert.equal(retry.body.idempotent, true);
    assert.equal(retry.body.papers[0].id, paperId);
    assert.deepEqual(retry.body.missing_images, saved.body.missing_images, "the retry names the same not-verified image");
    assert.equal(r2ImageRequests, reads, "a retry reads no image");
    assert.equal(r2KeyRequests.size, 0);
    const lookup = await request("archive-saved-papers/save-batches/" + first.save_batch_id);
    assert.equal(lookup.body.papers[0].id, paperId);

    // 그림이 생긴 뒤 새 저장은 모두 확인된 저장본이 된다(다른 저장본이므로 해시가 다르다).
    const fixed = await request("archive-saved-papers", "POST", reviseFrom(paperId, detail.body));
    assert.equal(fixed.status, 200);
    assert.deepEqual(fixed.body.missing_images, { count: 0, items: [] });
    const fixedDetail = await request(`archive-saved-papers/${fixed.body.papers[0].id}`);
    assert.ok(fixedDetail.body.paper.snapshot.assets.every((asset) => SHA.test(asset.sha256) && asset.missing === undefined));
    assert.notEqual(fixedDetail.body.paper.snapshot_hash, detail.body.paper.snapshot_hash);

    // 변조는 그대로 409: 표시 형식이 맞지 않는 assets, 해시가 맞지 않는 저장본.
    const parentRow = await db.prepare("SELECT * FROM archive_saved_papers WHERE id=?").bind(paperId).first();
    const base = JSON.parse(parentRow.snapshot_json);
    const lostIndex = base.assets.findIndex((asset) => asset.missing);
    const insertRow = async (snapshot, hash) => {
      const snapshotJson = stableStringify(snapshot);
      const next = {
        ...parentRow, id: crypto.randomUUID(), save_batch_id: crypto.randomUUID(), save_request_hash: crypto.randomBytes(32).toString("hex"),
        snapshot_json: snapshotJson, snapshot_hash: hash || crypto.createHash("sha256").update(snapshotJson).digest("hex"),
      };
      const columns = Object.keys(next);
      await db.prepare(`INSERT INTO archive_saved_papers (${columns.join(",")}) VALUES (${columns.map(() => "?").join(",")})`).bind(...columns.map((column) => next[column])).run();
      return next.id;
    };
    const withEntry = (entry) => ({ ...base, assets: base.assets.map((asset, index) => index === lostIndex ? entry : asset) });
    const statusOf = async (snapshot, hash) => (await request(`archive-saved-papers/${await insertRow(snapshot, hash)}`)).status;
    assert.equal(await statusOf(base), 200, "control: the not-verified marker with a matching hash reads");
    assert.equal(await statusOf(withEntry({ path: lost.path, sha256: "a".repeat(64), bytes: null, missing: true })), 409, "missing + sha256");
    assert.equal(await statusOf(withEntry({ path: lost.path, sha256: null, bytes: 5, missing: true })), 409, "missing + bytes");
    assert.equal(await statusOf(withEntry({ path: lost.path, sha256: null, bytes: null })), 409, "null sha256 without the missing marker");
    assert.equal(await statusOf(withEntry({ path: lost.path, sha256: null, bytes: null, missing: false })), 409, "missing:false");
    assert.equal(await statusOf(withEntry({ path: lost.path, sha256: "zz", bytes: 1 })), 409, "an ordinary entry stays strict");
    assert.equal(await statusOf(withEntry({ path: lost.path, sha256: null, bytes: null, missing: true }), "f".repeat(64)), 409, "wrong snapshot_hash");
  }

  // (2) 일시적 읽기 실패(503)는 한 번만 다시 읽는다. 다시 읽어서 되면 확인된 그림으로 저장.
  {
    const flaky = onlyOnce[1];
    r2Behavior.set(keyOf(flaky.path), (nth) => nth === 1 ? new Response("busy", { status: 503 }) : null);
    r2KeyRequests.clear();
    const saved = await request("archive-saved-papers", "POST", wholePaper(questions50));
    assert.equal(saved.status, 200, JSON.stringify(saved.body).slice(0, 300));
    assert.equal(saved.body.missing_images.count, 0);
    assert.equal(r2KeyRequests.get(keyOf(flaky.path)), 2, "one more read after a temporary failure");
    const detail = await request(`archive-saved-papers/${saved.body.papers[0].id}`);
    assert.match(detail.body.paper.snapshot.assets.find((asset) => asset.path === flaky.path).sha256, SHA);
    r2Behavior.delete(keyOf(flaky.path));
  }

  // (3) 계속 503이면 다시 읽기는 한 번뿐이고(무한 재시도 없음) 그 그림만 표시하고 저장한다.
  {
    const dead = onlyOnce[2];
    r2Behavior.set(keyOf(dead.path), () => new Response("busy", { status: 503 }));
    r2KeyRequests.clear();
    const saved = await request("archive-saved-papers", "POST", wholePaper(questions50));
    assert.equal(saved.status, 200, JSON.stringify(saved.body).slice(0, 300));
    assert.equal(saved.body.missing_images.count, 1);
    assert.equal(saved.body.missing_images.items[0].place, `1권 ${dead.index + 1}번 문항`);
    assert.equal(r2KeyRequests.get(keyOf(dead.path)), 2, "read once, then once more, then stop");
    r2Behavior.delete(keyOf(dead.path));
  }

  // (4) 두 권: 어느 권 몇 번 문항인지 말해 준다. 두 권이 함께 저장된다(일부만 저장되지 않는다).
  {
    const first = questions50.slice(0, 10);
    const second = questions50.slice(10, 20);
    const inSecond = onlyOnce.find((entry) => entry.index >= 10 && entry.index < 20);
    assert.ok(inSecond, "an image only the second paper's question uses");
    r2Behavior.set(keyOf(inSecond.path), () => new Response("Not found", { status: 404 }));
    const input = wholePaper(first);
    input.papers = [
      { part_index: 0, questions: first, meta: metaFor("권1", first, unit.filters) },
      { part_index: 1, questions: second, meta: metaFor("권2", second, unit.filters) },
    ];
    const saved = await request("archive-saved-papers", "POST", input);
    assert.equal(saved.status, 200, JSON.stringify(saved.body).slice(0, 300));
    assert.equal(saved.body.papers.length, 2, "both papers are saved together");
    assert.deepEqual(saved.body.missing_images, {
      count: 1,
      items: [{ part: 2, question: inSecond.index - 10 + 1, place: `2권 ${inSecond.index - 10 + 1}번 문항`, path: inSecond.path }],
    });
    r2Behavior.delete(keyOf(inSecond.path));
  }

  console.log("Saved papers with many images: 20 and 50 question papers save, read, re-save and assign by key reference; one unreadable image does not stop the save.");
} finally {
  await mf.dispose();
}
