// 단원별 기출 출제를 화면 안 패널로 (2026-11-11): 단원별 기출의 `출제`·`전체 출제`.
// 중복 출제·'일부 학생에게만 내려던 것이 반 전체에 남음'·'여러 권 중 일부만 나가고 멈춤'을 가짜 request로 검증한다.
// 실제 서버(운영 API)로는 아무것도 보내지 않는다. 요청 본문은 옛 구현(index.html registerIndexClassExamAssignment)을
// vm에서 그대로 실행해 대조한다.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const Assign = require("../archive/archive2-assign.js");

const tick = () => new Promise((resolve) => setImmediate(resolve));
const NOW = Date.parse("2026-11-10T03:00:00Z"); // 한국 시간 2026-11-10 12:00
const UUID = "123e4567-e89b-42d3-a456-426614174000";
const CLASSES = [
  { id: "c1", name: "고1 A반", grade: "고1", teacher_name: "김선생" },
  { id: "c2", name: "고1 B반", grade: "고1", teacher_name: "김선생" },
  { id: "c3", name: "중3 A반", grade: "중3", teacher_name: "김선생" },
];
const ROSTER = { c1: ["s1", "s2", "s3", "s4"], c2: ["s5", "s6"], c3: ["s7"] };
function httpError(status, data = {}, message = "") {
  const error = new Error(message || data.error || `요청 실패 (${status})`);
  error.status = status;
  error.data = data;
  return error;
}
const timeoutError = () => Object.assign(new Error("응답이 늦습니다."), { timeout: true });
const stamp = () => new Date().toISOString().replace("T", " ").slice(0, 19);

const QUESTIONS = (n) => [1, 2, 3].map((no) => ({ id: no, content: `권 ${n} 문항 ${no} $x^2$`, answer: String(no), _sourceFile: "2025/a.js" }));
const META = (n, title) => ({
  title, customTitle: title, identityTitle: title, count: 3, category: "단원별 기출", grade: "고1", gradeLabel: "고1", qpp: 4, includeQr: false,
  unitName: "다항식의 연산", subject: "공통수학1", sourceType: "mixed", printHeaderOptions: { title, subtitle: "", metaRight: "" },
});
const TITLE = (n) => `다항식의 연산 · 전체 단계 · ${n}권/3권`;
const unitItem = (n, extra = {}) => ({
  kind: "unit", snapshotKey: `mix_17000000000${n}`, title: TITLE(n), identityTitle: TITLE(n), grade: "고1", subject: "공통수학1", count: 3,
  partIndex: n - 1, partCount: 3, ref: { n }, ...extra,
});
const loader = (overrides = {}) => async (item) => {
  const n = item.ref.n;
  if (overrides[n]) return overrides[n](item);
  return { questions: QUESTIONS(n), meta: META(n, item.title) };
};

// 서버가 헤더 없는 POST에서 하는 일을 코드에서 읽은 대로 옮긴 가짜 서버(routes/exams.js):
// 같은 (반, 출제일, archive_file)이면 새 건을 만들지 않고 기존 건을 갱신해 같은 assignment를 돌려준다.
// 받는 사람은 항상 반 전체다(student_ids를 읽지 않는다). 아래 '서버 소스 대조'가 이 규칙을 지켜 준다.
function fakeServer({ cancelledKeys = new Set(), tooBig = false } = {}) {
  const store = new Map();
  const excluded = new Map(); // assignment id → Set(student)
  let created = 0;
  return {
    store, excluded, created: () => created,
    post(call) {
      const body = call.body;
      if (call.headers && call.headers["X-Archive2-Contract"]) throw httpError(400, { error: "단원별 출제에는 계약 헤더를 붙이지 않는다" });
      if (tooBig) throw httpError(400, { success: false, error: "mixed_payload_json with questions is required for a MIXED assignment" });
      const key = JSON.stringify([body.class_id, body.exam_date, body.archive_file]);
      let assignment = store.get(key);
      if (!assignment) {
        created += 1;
        assignment = { id: `a${created}`, class_id: body.class_id, archive_file: body.archive_file, exam_title: body.exam_title, exam_date: body.exam_date, pdf_status: "ready", created_at: stamp() };
        if (cancelledKeys.has(key)) assignment.cancelled_at = "2026-11-01T00:00:00Z";
        store.set(key, assignment);
      }
      return { success: true, assignment };
    },
    exclude(call) {
      const body = call.body;
      const target = [...store.values()].find((row) => row.id === body.assignment_id);
      if (!target) throw httpError(404, { success: false, error: "assignment not found" });
      const set = excluded.get(target.id) || new Set();
      for (const id of body.student_ids) set.add(id);
      excluded.set(target.id, set);
      return { success: true, results: body.student_ids.map((student_id) => ({ success: true, student_id })) };
    },
  };
}

function makeApi({ classes = CLASSES, roster = ROSTER, server = fakeServer(), post = null, exclude = null, recent = () => ({ success: true, assignments: [] }), submitted = new Set() } = {}) {
  const calls = [];
  let inflight = 0, maxInflight = 0;
  async function request(route, opt = {}) {
    const call = { route, method: opt.method || "GET", headers: opt.headers, body: opt.body ? JSON.parse(JSON.stringify(opt.body)) : undefined, timeoutMs: opt.timeoutMs };
    calls.push(call);
    const isPost = route === "/class-exam-assignments" && call.method === "POST";
    const isExclude = route === "/class-exam-assignments/exclude-students";
    if (isPost || isExclude) { inflight += 1; maxInflight = Math.max(maxInflight, inflight); }
    try {
      await tick();
      if (route === "/qr-classes") return { success: true, classes };
      if (route.startsWith("/class-exam-assignments/roster?")) {
        const classId = new URLSearchParams(route.split("?")[1]).get("class_id");
        return { success: true, students: (roster[classId] || []).map((id) => ({ id, name: `학생 ${id}`, already_submitted: submitted.has(id) })) };
      }
      if (route.startsWith("/class-exam-assignments/recent-summary?")) return recent(call);
      if (isPost) return post ? post(call, server) : server.post(call);
      if (isExclude) return exclude ? exclude(call, server) : server.exclude(call);
      if (/^\/class-exam-assignments\/[^/]+\/pdf$/.test(route)) return { success: true, assignment: { id: route.split("/")[2], pdf_status: "ready" } };
      throw httpError(404, { error: "no route " + route });
    } finally {
      if (isPost || isExclude) inflight -= 1;
    }
  }
  return {
    request, calls, server,
    posts: () => calls.filter((c) => c.route === "/class-exam-assignments" && c.method === "POST"),
    excludes: () => calls.filter((c) => c.route === "/class-exam-assignments/exclude-students"),
    rosters: () => calls.filter((c) => c.route.startsWith("/class-exam-assignments/roster?")),
    maxInflight: () => maxInflight,
  };
}
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k), map };
}
async function build({ items = [unitItem(1)], api = makeApi(), load = loader(), storage = memoryStorage(), recentCache = Assign.createRecentCache(), uuid = () => UUID, onDone = () => {}, outputLinks = false } = {}) {
  const model = Assign.createModel({
    items, request: api.request, storage, now: () => NOW, onDone, recentCache, uuid, unit: { load },
  });
  model.state.outputLinks = outputLinks;
  await model.load();
  await tick();
  return { model, api, storage, recentCache };
}
const pick = (model, id) => model.toggleClass(id, true);

// ---- 옛 구현을 그대로 실행해 대조 ------------------------------------------------------------------------------
function runLegacyBody({ item, classRow, studentIds, gradeLabel, qpp = 4 }) {
  const fetched = [];
  const context = {
    URLSearchParams, console, JSON, Date, Map, Number, String, Object, Array, Promise,
    location: { search: "?unitPastAssign=x&archive2Embedded=1", origin: "https://x.test", href: "https://x.test/archive/index.html" },
    localStorage: { getItem: () => null, setItem() {} },
    ARCHIVE_AP_API_BASE: "https://api.test/api",
    notifyArchiveQrApiFailure() {},
    getIndexAssignmentAuthHeader: () => ({ Authorization: "Bearer t" }),
    resolveExamQuestionCountForAssignment: (it) => Number(it.qCount),
    getIndexClassGrade: () => gradeLabel,
    fetch: async (url, init) => {
      fetched.push({ url, init });
      return { ok: true, status: 200, json: async () => ({ success: true, assignment: { id: "a1", pdf_status: "ready" } }) };
    },
    AssignTarget: { qpp },
    _pendingQpp: qpp,
  };
  context.window = context;
  const html = read("archive", "index.html");
  const from = html.indexOf("function getIndexExamTitle(item) {");
  const to = html.indexOf("function closeModal() {", from);
  assert.ok(from > 0 && to > from, "index.html에서 옛 요청 함수를 찾는다");
  vm.runInNewContext(html.slice(from, to) + "\nthis.register = registerIndexClassExamAssignment; this.batchId = getIndexAssignmentBatchId;", context);
  return context.register(classRow, item, { assignmentBatchId: context.batchId(item, gradeLabel), target_scope: "class", gradeLabel, qpp, studentIds }).then(() => {
    assert.equal(fetched.length, 1);
    return { url: fetched[0].url, headers: fetched[0].init.headers, body: JSON.parse(fetched[0].init.body) };
  });
}
// openPendingUnitPastAssignmentFromUrl(index.html)가 Output Envelope에서 읽어 만드는 항목과 같은 모양.
function legacyItem(n) {
  const questions = QUESTIONS(n);
  const meta = META(n, TITLE(n));
  return {
    ...meta, unitPast: true, title: meta.title || meta.identityTitle, identityTitle: meta.identityTitle || meta.title, topic: meta.title,
    qCount: questions.length, count: questions.length, source_type: "mixed", outputSnapshot: { questions, meta }, outputMeta: meta,
    unitPastSnapshotKey: unitItem(n).snapshotKey,
  };
}

test("본문이 옛 모달이 같은 권에 보내던 것과 키·순서·값이 같고, 계약 헤더와 student_ids가 없다", async () => {
  const { model, api } = await build();
  await pick(model, "c1");
  await model.start();
  const [call] = api.posts();
  const legacy = await runLegacyBody({ item: legacyItem(1), classRow: CLASSES[0], studentIds: ROSTER.c1, gradeLabel: "고1" });
  assert.equal(legacy.url, "https://api.test/api/class-exam-assignments");
  assert.deepEqual(Object.keys(call.body), Object.keys(legacy.body), "키 이름과 순서");
  assert.deepEqual(Object.keys(call.body), [
    "class_id", "exam_title", "exam_date", "question_count", "archive_file", "source_type", "mixed_payload_json",
    "pdf_qpp", "subject", "grade_label", "assignment_batch_id", "target_scope",
  ]);
  const dynamic = new Set(["exam_date", "assignment_batch_id"]);
  for (const key of Object.keys(legacy.body)) {
    if (dynamic.has(key)) continue;
    assert.deepEqual(call.body[key], legacy.body[key], `값: ${key}`);
  }
  assert.equal(typeof call.body.mixed_payload_json, "string", "문자열이다(객체가 아니다)");
  assert.equal(call.body.mixed_payload_json, legacy.body.mixed_payload_json, "문항·meta 문자열까지 같다");
  assert.match(legacy.body.exam_date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(call.body.exam_date, "2026-11-10", "출제일은 패널에서 고른 값(옛 경로는 늘 오늘)");
  assert.match(call.body.assignment_batch_id, /^batch_archive_mix_170000000001_고1_\d+$/);
  assert.match(legacy.body.assignment_batch_id, /^batch_archive_mix_170000000001_고1_\d+$/);
  assert.equal(call.body.archive_file, "MIXED:mix_170000000001");
  assert.equal(call.body.source_type, "mixed");
  assert.equal(call.body.exam_title, TITLE(1));
  assert.equal(call.body.target_scope, "class");
  assert.equal(call.body.student_ids, undefined, "서버는 student_ids를 읽지 않는다");
  assert.equal(call.body.contract_version, undefined);
  assert.equal(call.headers, undefined, "계약 헤더 없음");
  assert.equal(legacy.headers["X-Archive2-Contract"], undefined, "옛 경로도 헤더가 없다");
  assert.equal(call.timeoutMs, Assign.WRITE_TIMEOUT_MS);
});

test("반이 여러 개면 target_scope가 grade이고, 한 쪽 문항 수를 바꾸면 pdf_qpp와 meta.qpp가 같이 바뀐다", async () => {
  const { model, api } = await build();
  assert.equal(model.state.qpp, 4, "항상 4문항으로 시작");
  assert.equal(model.setQpp(6), true);
  await pick(model, "c1");
  await pick(model, "c2");
  await model.start();
  const [first] = api.posts();
  const legacy = await runLegacyBody({ item: legacyItem(1), classRow: CLASSES[0], studentIds: ROSTER.c1, gradeLabel: "고1", qpp: 6 });
  assert.equal(first.body.target_scope, "grade");
  assert.equal(first.body.pdf_qpp, 6);
  assert.equal(legacy.body.pdf_qpp, 6);
  assert.equal(JSON.parse(first.body.mixed_payload_json).meta.qpp, 6);
  assert.equal(JSON.parse(first.body.mixed_payload_json).meta.title, TITLE(1));
});

test("반 전체를 고르면 제외 요청이 나가지 않고, 일부만 고르면 POST 뒤에 고르지 않은 학생만 뺀다", async () => {
  const { model, api } = await build();
  await pick(model, "c1");
  await pick(model, "c2");
  model.toggleStudent("c1", "s2", false); // c1은 s1·s3·s4만
  model.toggleStudent("c1", "s3", false); // → s1·s4만
  await model.start();
  const posts = api.posts();
  assert.equal(posts.length, 2);
  const excludes = api.excludes();
  assert.equal(excludes.length, 1, "c2는 반 전체라 제외 요청이 없다");
  const [exclude] = excludes;
  assert.deepEqual(Object.keys(exclude.body), ["assignment_id", "class_id", "student_ids", "operation_identity", "exam_title", "exam_date", "archive_file"]);
  assert.deepEqual(exclude.body.student_ids, ["s2", "s3"], "고르지 않은 학생 = 명단 − 선택");
  assert.equal(exclude.body.class_id, "c1");
  assert.equal(exclude.body.assignment_id, "a1");
  assert.equal(exclude.body.operation_identity, UUID);
  assert.equal(exclude.body.exam_title, posts[0].body.exam_title);
  assert.equal(exclude.body.exam_date, posts[0].body.exam_date);
  assert.equal(exclude.body.archive_file, posts[0].body.archive_file);
  assert.ok(api.calls.indexOf(exclude) > api.calls.indexOf(posts[0]), "POST가 먼저다");
  const r = model.results();
  assert.equal(r.ok, 2);
  assert.equal(r.excludeFailed, 0);
  assert.equal(model.state.phase, "done");
  // 옛 모달이 보내던 제외 본문의 키와 순서(index.html assignTargetProcessOneClass)와 같다.
  const html = read("archive", "index.html");
  assert.match(html, /assignment_id: registration\?\.assignment\?\.id \|\| undefined,\s*class_id: classId,\s*student_ids: excludedIds,\s*operation_identity: crypto\.randomUUID\(\),\s*exam_title: getIndexExamTitle\(AssignTarget\.item\),\s*exam_date: examDate,\s*archive_file: getIndexAssignmentArchiveFile\(AssignTarget\.item\)/);
});

test("제외 요청은 200명씩 나눠 보낸다", async () => {
  const big = Array.from({ length: 450 }, (_, i) => `b${i}`);
  const api = makeApi({ roster: { ...ROSTER, c1: big } });
  const { model } = await build({ api });
  await pick(model, "c1");
  model.toggleStudent("c1", "b0", false); // 아직 전체 → 명단에서 하나 뺀 것으로 시작하려면 먼저 전체 선택 상태를 깨야 한다
  // b0만 빼 둔 상태에서 나머지 449명을 모두 빼고 b449만 남긴다
  for (const id of big.slice(1, 449)) model.toggleStudent("c1", id, false);
  await model.start();
  const excludes = api.excludes();
  assert.deepEqual(excludes.map((c) => c.body.student_ids.length), [200, 200, 49]);
  assert.equal(new Set(excludes.flatMap((c) => c.body.student_ids)).size, 449);
  assert.ok(excludes.every((c) => c.body.student_ids.length <= 200));
});

test("제외가 실패하면 성공으로 표시하지 않고, 다시 빼기는 제외 요청만 같은 operation_identity로 다시 보낸다", async () => {
  let fail = true;
  const api = makeApi({ exclude: (call, server) => { if (fail) throw httpError(500, { error: "boom" }); return server.exclude(call); } });
  let done = null;
  const { model } = await build({ api, onDone: (info) => { done = info; } });
  await pick(model, "c1");
  model.toggleStudent("c1", "s2", false);
  await model.start();
  assert.equal(api.posts().length, 1);
  assert.equal(api.excludes().length, 1);
  let job = model.state.jobs[0];
  assert.equal(job.status, "exclude-failed");
  assert.equal(model.results().ok, 0, "성공으로 세지 않는다");
  assert.equal(model.results().excludeFailed, 1);
  assert.match(job.message, /출제는 됐지만 고르지 않은 학생 1명을 빼지 못했습니다\. 지금은 반 전체에게 보입니다\./);
  assert.equal(done.succeeded, 0, "보관함에는 성공 건으로 알리지 않는다");
  const html = Assign.render(model);
  assert.match(html.body, /출제됨 · 학생 제외 실패/);
  assert.match(html.body, /data-assign-action="exclude-retry"/);
  assert.match(html.foot, /다시 빼기/);
  assert.match(html.foot, /반 전체에게 보임/);
  assert.doesNotMatch(html.body, /출제됨<\/p>/);
  // 이 상태로 닫으려 하면 한 번 알리고, 두 번째에 닫힌다.
  const first = model.requestClose();
  assert.equal(first.allowed, false);
  assert.equal(first.warn, true);
  assert.match(Assign.render(model).foot, /아직 빼지 못했습니다/);
  // 다시 빼기: POST는 다시 가지 않는다.
  fail = false;
  await model.retryExclusion();
  assert.equal(api.posts().length, 1, "출제를 다시 보내지 않는다");
  assert.equal(api.excludes().length, 2);
  assert.equal(api.excludes()[1].body.operation_identity, api.excludes()[0].body.operation_identity);
  assert.deepEqual(api.excludes()[1].body.student_ids, ["s2"]);
  job = model.state.jobs[0];
  assert.equal(job.status, "ok");
  assert.equal(model.results().ok, 1);
  assert.equal(model.requestClose().allowed, true);
  assert.deepEqual([...api.server.excluded.get("a1")], ["s2"]);
});

test("제외 응답이 일부 학생만 성공이면 성공한 학생은 남은 목록에서 빼고 나머지만 다시 보낸다", async () => {
  let first = true;
  const api = makeApi({
    exclude: (call, server) => {
      if (first) {
        first = false;
        const ids = call.body.student_ids;
        throw httpError(200, { success: false, results: ids.map((id, i) => ({ success: i === 0, student_id: id })) });
      }
      return server.exclude(call);
    },
  });
  const { model } = await build({ api });
  await pick(model, "c1");
  model.toggleStudent("c1", "s2", false);
  model.toggleStudent("c1", "s3", false);
  await model.start();
  assert.equal(model.state.jobs[0].status, "exclude-failed");
  assert.match(model.state.jobs[0].message, /1명을 빼지 못했습니다/);
  await model.retryExclusion();
  assert.deepEqual(api.excludes()[1].body.student_ids, ["s3"]);
  assert.equal(model.state.jobs[0].status, "ok");
});

test("응답을 못 받으면(timeout) 같은 본문을 다시 보내고, 확인이 성공하면 이어서 제외까지 간다", async () => {
  let attempt = 0;
  const api = makeApi({ post: (call, server) => { attempt += 1; if (attempt === 1) throw timeoutError(); return server.post(call); } });
  const { model } = await build({ api });
  await pick(model, "c1");
  model.toggleStudent("c1", "s1", false);
  await model.start();
  assert.equal(model.state.jobs[0].status, "unknown");
  assert.equal(api.excludes().length, 0, "출제가 됐는지 모르는 동안은 제외도 보내지 않는다");
  await model.confirmUnknown();
  const posts = api.posts();
  assert.equal(posts.length, 2);
  assert.deepEqual(posts[1].body, posts[0].body, "같은 본문(같은 batch id·같은 문서)");
  assert.equal(api.server.created(), 1, "새 건이 생기지 않는다");
  assert.equal(api.excludes().length, 1);
  assert.deepEqual(api.excludes()[0].body.student_ids, ["s1"]);
  assert.equal(model.state.jobs[0].status, "ok");
});

test("같은 권을 같은 날 다시 눌러도 같은 키로만 나간다(새 건 없음)", async () => {
  const api = makeApi();
  const first = await build({ api });
  await pick(first.model, "c1");
  await first.model.start();
  const second = await build({ api });
  await pick(second.model, "c1");
  await second.model.start();
  const posts = api.posts();
  assert.equal(posts.length, 2);
  for (const key of ["class_id", "exam_title", "exam_date", "archive_file", "mixed_payload_json"]) assert.equal(posts[1].body[key], posts[0].body[key], key);
  assert.equal(api.server.created(), 1);
  assert.equal(second.model.state.jobs[0].status, "ok");
  assert.equal(second.model.state.jobs[0].already, false);
});

test("3권 중 2번째가 실패하면 1권은 성공, 3권은 보내지 않음, 이어 보내기는 남은 것만 보낸다", async () => {
  let failSecond = true;
  const api = makeApi({
    post: (call, server) => {
      if (call.body.archive_file === "MIXED:mix_170000000002" && failSecond) throw httpError(400, { error: "class not found" });
      return server.post(call);
    },
  });
  const { model } = await build({ items: [unitItem(1), unitItem(2), unitItem(3)], api });
  await pick(model, "c1");
  await model.start();
  assert.deepEqual(model.state.jobs.map((job) => job.status), ["ok", "failed", "ok"], "실패해도 다음 권은 계속 보낸다");
  assert.equal(api.posts().length, 3);
  failSecond = false;
  await model.retryFailed();
  assert.deepEqual(model.state.jobs.map((job) => job.status), ["ok", "ok", "ok"]);
  assert.equal(api.posts().length, 4, "실패한 한 건만 다시 보냈다");
  assert.equal(api.posts()[3].body.archive_file, "MIXED:mix_170000000002");
  assert.equal(api.server.created(), 3);
  // 결과 줄에 권 제목이 붙는다
  assert.match(Assign.render(model).body, new RegExp(TITLE(2).replace(/[.*+?^${}()|[\]\\·]/g, "\\$&")));
});

test("로그인이 끝나면(401) 남은 권을 보내지 않고 '보내지 않음'으로 남긴 뒤 이어 보낸다", async () => {
  let expired = true;
  const api = makeApi({
    post: (call, server) => {
      if (call.body.archive_file === "MIXED:mix_170000000002" && expired) throw httpError(401, { error: "Unauthorized" });
      return server.post(call);
    },
  });
  const { model } = await build({ items: [unitItem(1), unitItem(2), unitItem(3)], api });
  await pick(model, "c1");
  await model.start();
  assert.deepEqual(model.state.jobs.map((job) => job.status), ["ok", "failed", "queued"]);
  assert.equal(api.posts().length, 2, "3권은 보내지 않았다");
  assert.equal(model.state.authLost, true);
  expired = false;
  await model.retryFailed();
  assert.deepEqual(model.state.jobs.map((job) => job.status), ["ok", "ok", "ok"]);
  assert.equal(api.posts().length, 4);
});

test("문항을 하나라도 준비하지 못하면 아무것도 보내지 않고 어느 권이 왜 안 되는지 알려 준다", async () => {
  const { model, api } = await build({
    items: [unitItem(1), unitItem(2), unitItem(3)],
    load: loader({ 2: async () => { throw new Error("2025/a.js의 3번 문항을 찾지 못했습니다."); } }),
  });
  await pick(model, "c1");
  await model.start();
  assert.equal(api.posts().length, 0, "POST 0건");
  assert.equal(api.excludes().length, 0);
  assert.equal(model.state.phase, "select", "잠금을 풀고 다시 누를 수 있다");
  assert.equal(model.state.starting, false);
  assert.equal(model.state.working, false);
  assert.ok(model.state.startError.includes(TITLE(2)), "어느 권인지");
  assert.match(model.state.startError, /문항을 준비하지 못했습니다/);
  assert.equal(model.canSubmit(), true);
  assert.match(Assign.render(model).foot, /문항을 준비하지 못했습니다/);
});

test("문항이 비었거나 본문이 900000자를 넘으면 아무것도 보내지 않는다", async () => {
  const empty = await build({ items: [unitItem(1), unitItem(2)], load: loader({ 2: async () => ({ questions: [], meta: {} }) }) });
  await pick(empty.model, "c1");
  await empty.model.start();
  assert.equal(empty.api.posts().length, 0);
  assert.match(empty.model.state.startError, /문항이 없어 출제할 수 없습니다/);

  const huge = "가".repeat(900001);
  const big = await build({ items: [unitItem(1), unitItem(2)], load: loader({ 2: async (item) => ({ questions: [{ id: 1, content: huge }], meta: META(2, item.title) }) }) });
  await pick(big.model, "c1");
  await big.model.start();
  assert.equal(big.api.posts().length, 0, "1권은 괜찮아도 2권이 너무 크면 모두 보내지 않는다");
  assert.ok(big.model.state.startError.includes(TITLE(2)));
  assert.match(big.model.state.startError, /문제지가 너무 커서 낼 수 없습니다\. 문항 수를 줄여 다시 만들어 주세요\./);

  const limit = 900000;
  const near = await build({ load: async (item) => {
    const base = JSON.stringify({ questions: [{ id: 1, content: "" }], meta: { ...META(1, item.title), qpp: 4 } }).length;
    return { questions: [{ id: 1, content: "x".repeat(limit - base) }], meta: META(1, item.title) };
  } });
  await pick(near.model, "c1");
  await near.model.start();
  assert.equal(near.api.posts().length, 1, "한도 안(900000자)은 보낸다");
  assert.equal(near.api.posts()[0].body.mixed_payload_json.length, limit);
});

test("서버가 mixed_payload_json 오류(400)를 돌려주면 교사가 알아듣는 말로 바꿔 보여 준다", async () => {
  const api = makeApi({ server: fakeServer({ tooBig: true }) });
  const { model } = await build({ api });
  await pick(model, "c1");
  await model.start();
  const job = model.state.jobs[0];
  assert.equal(job.status, "failed");
  assert.equal(job.message, "문제지가 너무 커서 낼 수 없습니다. 문항 수를 줄여 다시 만들어 주세요.");
  assert.doesNotMatch(Assign.render(model).body, /mixed_payload_json|새로 출제/);
});

test("연타해도 POST는 한 번만 나가고, 한 번에 하나씩 순서대로 보낸다", async () => {
  const api = makeApi();
  const { model } = await build({ items: [unitItem(1), unitItem(2)], api });
  await pick(model, "c1");
  const a = model.start();
  const b = model.start();
  const c = model.start();
  await Promise.all([a, b, c]);
  assert.equal(api.posts().length, 2, "두 권 × 한 반 = 2건만");
  assert.equal(api.maxInflight(), 1, "동시에 둘 이상 보내지 않는다");
  assert.deepEqual(api.posts().map((call) => call.body.archive_file), ["MIXED:mix_170000000001", "MIXED:mix_170000000002"]);
});

test("같은 날 이미 낸 건(recent-summary의 MIXED 줄)은 경고하고 여러 권이면 기본으로 뺀다", async () => {
  const recent = () => ({
    success: true,
    assignments: [
      { id: "old1", class_id: "c1", class_name: "고1 A반", exam_date: "2026-11-10", archive_file: "MIXED:mix_170000000001", saved_paper_id: null },
      // 저장본으로 낸 건(MIXED:archive2-saved-…, saved_paper_id 있음)은 단원별 문제지와 무관하다.
      { id: "old2", class_id: "c2", class_name: "고1 B반", exam_date: "2026-11-10", archive_file: "MIXED:archive2-saved-xyz-abc", saved_paper_id: "xyz" },
    ],
  });
  const one = await build({ api: makeApi({ recent }) });
  await one.model.loadOriginalHistory();
  await pick(one.model, "c1");
  await pick(one.model, "c2");
  assert.ok(one.model.dupInfo(one.model.state.papers[0].id, one.model.state.classes.find((c) => c.id === "c1")).sameDate, "c1은 같은 날 이미 냈다");
  assert.equal(one.model.dupInfo(one.model.state.papers[0].id, one.model.state.classes.find((c) => c.id === "c2")).sameDate, null, "저장본 출제 줄은 무관");
  assert.match(Assign.render(one.model).body, /에 이미 냈습니다/);

  const many = await build({ items: [unitItem(1), unitItem(2)], api: makeApi({ recent }) });
  await many.model.loadOriginalHistory();
  await pick(many.model, "c1");
  const plan = many.model.plan();
  assert.deepEqual(plan.combos.map((combo) => combo.paper.snapshotKey), ["mix_170000000002"], "이미 낸 1권은 기본으로 빠진다");
  await many.model.start();
  assert.equal(many.api.posts().length, 1);
  assert.equal(many.api.posts()[0].body.archive_file, "MIXED:mix_170000000002");
});

test("이미 있던 건이 취소된 상태면 성공으로 표시하지 않고 날짜를 바꾸라고 알린다", async () => {
  const key = JSON.stringify(["c1", "2026-11-10", "MIXED:mix_170000000001"]);
  const api = makeApi({ server: fakeServer({ cancelledKeys: new Set([key]) }) });
  const { model } = await build({ api });
  await pick(model, "c1");
  model.toggleStudent("c1", "s2", false);
  await model.start();
  const job = model.state.jobs[0];
  assert.equal(job.status, "cancelled");
  assert.equal(model.results().ok, 0);
  assert.equal(api.excludes().length, 0, "취소된 건에는 제외도 보내지 않는다");
  assert.match(job.message, /취소된 상태라 같은 날짜로는 다시 낼 수 없습니다/);
  assert.doesNotMatch(Assign.render(model).body, /data-assign-action="reissue"/, "새로 출제 버튼은 단원별에는 없다");
});

test("결과 줄에 출력 버튼은 없고(단원 페이지에 처리기가 없다), 로그인이 없으면 로그인 안내가 그려진다", async () => {
  const { model } = await build();
  await pick(model, "c1");
  await model.start();
  assert.doesNotMatch(Assign.render(model).body, /assignment-output-direct/);
  const withLinks = await build({ outputLinks: true });
  await pick(withLinks.model, "c1");
  await withLinks.model.start();
  assert.match(Assign.render(withLinks.model).body, /assignment-output-direct/, "다른 화면에서는 그대로 쓴다");

  const api = makeApi();
  const login = await build({ api: { ...api, request: async () => { throw httpError(401, {}, "교사 로그인이 필요합니다."); } } });
  assert.equal(login.model.state.phase, "login");
  assert.match(Assign.render(login.model).body, /선생님 로그인/);
});

test("저장본·원본 항목의 본문은 그대로다(단원별 변경이 번지지 않는다)", async () => {
  const request = async (route, opt = {}) => {
    if (route === "/qr-classes") return { success: true, classes: CLASSES };
    if (route.startsWith("/class-exam-assignments/roster?")) return { success: true, students: ROSTER.c1.map((id) => ({ id, name: id })) };
    if (route === "/class-exam-assignments") { calls.push(opt); return { success: true, assignment: { id: "a1", pdf_status: "ready", created_at: stamp() } }; }
    throw httpError(404);
  };
  const calls = [];
  const model = Assign.createModel({ items: [{ id: "paper-1", title: "저장한 시험지", grade: "고1", subject: "수학", count: 5 }], request, storage: memoryStorage(), now: () => NOW, uuid: () => UUID });
  await model.load();
  await model.toggleClass("c1", true);
  await model.start();
  assert.deepEqual(calls[0].headers, { "X-Archive2-Contract": "archive2-v1" });
  assert.equal(calls[0].body.contract_version, "archive2-v1");
  assert.equal(calls[0].body.saved_paper_id, "paper-1");
});

test("서버 소스 대조: 헤더 없는 POST는 기존 건을 갱신하고, 제외는 UUID·200명 한도, 본문은 900000자 한도", async () => {
  const exams = read("apmath", "worker-backup", "worker", "routes", "exams.js");
  assert.match(exams, /value\.length > 900000/);
  assert.match(exams, /mixed_payload_json with questions is required for a MIXED assignment/);
  assert.match(exams, /AND archive_file IN \(\$\{markers\}\)/);
  assert.match(exams, /UPDATE class_exam_assignments\s+SET \$\{updateSets\.join/);
  assert.match(exams, /studentIds\.length > 200/);
  assert.match(exams, /id === 'exclude-students'/);
  assert.match(exams, /normalizeAssignmentOperationRequestId/);
  // 서버는 이 POST에서 student_ids를 읽지 않는다(받는 사람은 반 전체로 기록된다).
  const post = exams.slice(exams.indexOf("if (method === 'POST') {", exams.indexOf("class_id, exam_title, exam_date required") - 600), exams.indexOf("class_id, exam_title, exam_date required") + 8000);
  assert.doesNotMatch(post.slice(0, post.indexOf("const insertColumns")), /d\.student_ids/);
  // 이 패널의 두 요청 이름이 서버가 읽는 이름과 같다
  for (const key of ["class_id", "exam_title", "exam_date", "question_count", "archive_file", "source_type", "mixed_payload_json", "pdf_qpp", "subject", "grade_label", "assignment_batch_id", "target_scope"])
    assert.match(exams, new RegExp(`d\\.${key}\\b|d\\.pdf_qpp ?\\?\\?`), `서버가 ${key}를 읽는다`);
});
