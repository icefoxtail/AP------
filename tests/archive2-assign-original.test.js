// 원본 시험지 출제를 화면 안 패널로 (2026-11-11): 학교 기출·유사문제 줄의 `출제`.
// 중복 출제·누락·'됐는지 모름'·서버 계약 불일치를 가짜 request로 검증한다. 실제 서버로는 아무것도 보내지 않는다.
// 요청 본문은 옛 구현(archive2-entry.js + index.html registerIndexClassExamAssignment)을 vm에서 그대로 실행해 대조한다.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const Assign = require("../archive/archive2-assign.js");
const Output = require("../archive/archive2-output.js");

const tick = () => new Promise((resolve) => setImmediate(resolve));
const NOW = Date.parse("2026-11-10T03:00:00Z"); // 한국 시간 2026-11-10 12:00
const FILE = "2025/왕운중-중1-1학기-중간.js".normalize("NFC");
const FILE_B = "2025/왕운중-중1-1학기-기말.js";
const INDEX_VERSION = "idx-2026-11-10";
const QUESTIONS = [
  { no: 1, content: "문항 1 $x^2$", answer: "3", image: "assets/images/a.png" },
  { no: 2, content: "문항 2", answer: "5", choices: ["1", "2", "3"] },
  { no: 3, content: "문항 3", answer: "1" },
];
const EXAM = {
  file: FILE, school: "왕운중", grade: "중1", year: "2025", semester: 1, examType: "mid", contentType: "기출",
  subject: "중1 수학", topic: "", qCount: 3, identityTitle: "2025 왕운중 중1 1학기 중간고사 수학",
};
const EXAM_B = { ...EXAM, file: FILE_B, examType: "final", qCount: 3, identityTitle: "2025 왕운중 중1 1학기 기말고사 수학" };
const examItem = (exam = EXAM, extra = {}) => {
  const settings = Output.settings({ header: { title: Output.displayTitle(exam), subtitle: exam.subject }, qpp: 4 });
  return {
    kind: "original", file: exam.file, title: Output.displayTitle(exam), identityTitle: exam.identityTitle,
    grade: exam.grade, subject: exam.subject, count: exam.qCount, sourceHash: "hash-" + exam.file.length, settings, ...extra,
  };
};
const CLASSES = [
  { id: "c1", name: "중1 A반", grade: "중1", teacher_name: "김선생" },
  { id: "c2", name: "중1 B반", grade: "중1", teacher_name: "김선생" },
  { id: "c3", name: "중1 C반", grade: "중1", teacher_name: "김선생" },
  { id: "c4", name: "중2 A반", grade: "중2", teacher_name: "김선생" },
];
const ROSTER = { c1: ["s1", "s2", "s3"], c2: ["s4", "s5"], c3: ["s6", "s7"], c4: ["s8"] };
function httpError(status, data = {}, message = "") {
  const error = new Error(message || data.error || `요청 실패 (${status})`);
  error.status = status;
  error.data = data;
  return error;
}
const timeoutError = () => Object.assign(new Error("응답이 늦습니다."), { timeout: true });
const stamp = () => new Date().toISOString().replace("T", " ").slice(0, 19);

// 서버 원본 분기의 멱등 판정을 코드에서 읽은 대로 옮긴 가짜 서버: routes/archive2.js의 쓰기 키·기존 건 비교.
// (아래 '서버 소스 대조' 테스트가 이 규칙이 실제 소스에 있는지 지켜 준다.)
function fakeServer() {
  const store = new Map();
  let created = 0;
  return {
    store, created: () => created,
    handle(body) {
      const key = JSON.stringify([body.class_id, body.exam_date, body.archive_file]);
      const existing = store.get(key);
      if (existing) {
        if (existing.cancelled) throw httpError(409, { error: "취소된 Assignment는 RETRY로 다시 배포할 수 없습니다." });
        if (JSON.stringify(existing.students) !== JSON.stringify(body.student_ids))
          throw httpError(409, { error: "기존 Assignment의 고정 roster는 변경할 수 없습니다. 학생 추가는 ADD_RECIPIENTS로 요청하세요." });
        const same = existing.title === body.exam_title && existing.qpp === body.pdf_qpp &&
          JSON.stringify(existing.payload) === JSON.stringify(body.original_payload_json);
        if (!same) throw httpError(409, { error: "이미 배부된 시험입니다. 수정본은 새 문제지로 출제하세요." });
        return { success: true, saved: true, assignment: existing.assignment };
      }
      created += 1;
      const assignment = { id: `a-${body.class_id}-${created}`, class_id: body.class_id, pdf_status: "ready", created_at: stamp() };
      store.set(key, { title: body.exam_title, qpp: body.pdf_qpp, payload: body.original_payload_json, students: body.student_ids.slice(), assignment, cancelled: false });
      return { success: true, saved: true, assignment };
    },
  };
}

function makeApi({ classes = CLASSES, roster = ROSTER, post = null, server = fakeServer(), recent = () => ({ success: true, assignments: [] }), submitted = new Set(), pdf = null } = {}) {
  const calls = [];
  let postInflight = 0, maxPostInflight = 0;
  async function request(route, opt = {}) {
    const call = { route, method: opt.method || "GET", headers: opt.headers, body: opt.body ? JSON.parse(JSON.stringify(opt.body)) : undefined, timeoutMs: opt.timeoutMs };
    calls.push(call);
    const isPost = route === "/class-exam-assignments" && call.method === "POST";
    if (isPost) { postInflight += 1; maxPostInflight = Math.max(maxPostInflight, postInflight); }
    try {
      await tick();
      if (route === "/qr-classes") return { success: true, classes };
      if (route.startsWith("/class-exam-assignments/roster?")) {
        const classId = new URLSearchParams(route.split("?")[1]).get("class_id");
        return { success: true, students: (roster[classId] || []).map((id) => ({ id, name: `학생 ${id}`, already_submitted: submitted.has(id) })) };
      }
      if (route.startsWith("/class-exam-assignments/recent-summary?")) return recent(call);
      if (isPost) return post ? post(call, server) : server.handle(call.body);
      if (/^\/class-exam-assignments\/[^/]+\/pdf$/.test(route)) {
        if (pdf) return pdf(call);
        return { success: true, assignment: { id: route.split("/")[2], pdf_status: "ready" } };
      }
      throw httpError(404, { error: "no route " + route });
    } finally {
      if (isPost) postInflight -= 1;
    }
  }
  return {
    request, calls, server,
    posts: () => calls.filter((c) => c.route === "/class-exam-assignments" && c.method === "POST"),
    recents: () => calls.filter((c) => c.route.startsWith("/class-exam-assignments/recent-summary")),
    maxPostInflight: () => maxPostInflight,
  };
}
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k), map };
}
async function build({ items = [examItem()], api = makeApi(), history = null, storage = memoryStorage(), now = () => NOW, loadQuestions = async () => QUESTIONS.map((q) => ({ ...q })), recentCache = Assign.createRecentCache(), onDone = () => {} } = {}) {
  const model = Assign.createModel({
    items, request: api.request, history, storage, now, onDone, recentCache,
    original: { indexVersion: INDEX_VERSION, loadQuestions },
  });
  await model.load();
  await tick();
  return { model, api, storage, recentCache };
}
const pick = (model, id, checked = true) => model.toggleClass(id, checked);

// ---- 옛 구현을 그대로 실행해 대조 ------------------------------------------------------------------------------
function runLegacyBody({ exam, item, classRow, studentIds, gradeLabel, qpp = 4, settings }) {
  const fetched = [];
  const stored = new Map();
  const context = {
    URLSearchParams, console, JSON, Date, Map, Number, String, Object, Array, Promise,
    location: { search: `?archive2Issue=${encodeURIComponent(exam.file)}&archive2Embedded=1&index_version=${INDEX_VERSION}&qpp=${qpp}`, origin: "https://x.test", href: "https://x.test/archive/index.html" },
    localStorage: { getItem: (k) => stored.get(k) ?? null, setItem: (k, v) => stored.set(k, String(v)) },
    document: { documentElement: { classList: { add() {} } }, createElement: () => ({}), head: { appendChild() {} }, body: { prepend() {} } },
    Archive2Source: { load: async () => QUESTIONS.map((q) => ({ ...q })) },
    Archive2Core: {},
    Archive2Output: Output,
    parent: { postMessage() {} },
    ARCHIVE_AP_API_BASE: "https://api.test/api",
    notifyArchiveQrApiFailure() {},
    getIndexAssignmentAuthHeader: () => ({ Authorization: "Bearer t" }),
    resolveExamQuestionCountForAssignment: (it) => it.qCount,
    getIndexClassGrade: () => gradeLabel,
    fetch: async (url, init) => {
      fetched.push({ url, init });
      return { ok: true, status: 200, json: async () => ({ saved: true, assignment: { id: "a1", pdf_status: "ready" } }) };
    },
    AssignTarget: { qpp },
    _pendingQpp: qpp,
    normalizedExams: () => [item],
  };
  context.window = context;
  // 옛 entry.js 전체(IIFE)를 실행한다.
  vm.runInNewContext(read("archive", "archive2-entry.js"), context);
  // 옛 index.html의 요청 만들기 함수들을 소스에서 잘라 실행한다.
  const html = read("archive", "index.html");
  const from = html.indexOf("function getIndexExamTitle(item) {");
  const to = html.indexOf("function closeModal() {", from);
  assert.ok(from > 0 && to > from, "index.html에서 옛 요청 함수를 찾는다");
  vm.runInNewContext(html.slice(from, to) + "\nthis.register = registerIndexClassExamAssignment; this.batchId = getIndexAssignmentBatchId;", context);
  // 워크스페이스가 iframe 준비 메시지를 받고 하던 일과 같다: 설정과 원본 정보를 iframe에 넘긴다.
  context.setArchive2OriginalSettings(settings);
  context.setArchive2OriginalSource({ file: exam.file, sourceHash: "hash", identityTitle: exam.identityTitle });
  // 옛 모달이 출제 버튼을 누를 때 하던 일: 배치 이름을 만들어 모든 반 요청에 같이 쓴다.
  return context.register(classRow, item, { assignmentBatchId: context.batchId(item, gradeLabel), target_scope: "class", gradeLabel, qpp, studentIds }).then(() => {
    assert.equal(fetched.length, 1);
    return { url: fetched[0].url, headers: fetched[0].init.headers, body: JSON.parse(fetched[0].init.body) };
  });
}

test("본문과 헤더가 옛 구현(entry.js + index.html 원본 분기)이 보내는 것과 키 하나까지 같다", async () => {
  const item = examItem();
  const { model, api } = await build({ items: [item] });
  await pick(model, "c1");
  await model.start();
  const [call] = api.posts();
  const legacy = await runLegacyBody({
    exam: EXAM, item: { ...EXAM, file: EXAM.file }, classRow: CLASSES[0], studentIds: ["s1", "s2", "s3"], gradeLabel: "중1", qpp: 4, settings: item.settings,
  });
  assert.equal(legacy.url, "https://api.test/api/class-exam-assignments");
  assert.deepEqual(Object.keys(call.body), Object.keys(legacy.body), "키 이름과 순서");
  const dynamic = new Set(["exam_date", "assignment_batch_id"]);
  for (const key of Object.keys(legacy.body)) {
    if (dynamic.has(key)) continue;
    assert.deepEqual(call.body[key], legacy.body[key], `값: ${key}`);
  }
  // 옛 구현은 오늘(실제 시계)로 보내고 새 패널은 고른 출제일로 보낸다. 모양은 같다.
  assert.match(legacy.body.exam_date, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(call.body.exam_date, "2026-11-10");
  // 서버가 읽지 않는 batch id도 옛 모양(batch_archive_<파일>_<학년>_<시각>)을 그대로 쓴다.
  assert.match(legacy.body.assignment_batch_id, /^batch_archive_[A-Za-z0-9_-]+_중1_\d+$/);
  assert.match(call.body.assignment_batch_id, /^batch_archive_[A-Za-z0-9_-]+_중1_\d+$/);
  assert.deepEqual(call.headers, { "X-Archive2-Contract": "archive2-v1" });
  assert.equal(legacy.headers["X-Archive2-Contract"], "archive2-v1");
  // 본문의 핵심 값
  assert.equal(call.body.archive_file, `exams/${FILE}`);
  assert.equal(call.body.source_type, "archive");
  assert.equal(call.body.mixed_payload_json, "");
  assert.equal(call.body.question_count, 3);
  assert.equal(call.body.index_version, INDEX_VERSION);
  assert.equal(call.body.exam_title, "2025 왕운중 중1 1학기 중간고사");
  assert.equal(call.body.target_scope, "class");
  assert.equal(call.body.saved_paper_id, undefined, "저장본 분기로 가는 필드가 없다");
  assert.deepEqual(call.body.original_payload_json.meta, { identityTitle: EXAM.identityTitle, printHeaderOptions: item.settings.header, qpp: 4, includeQr: false });
  assert.deepEqual(call.body.original_payload_json.questions, QUESTIONS);
});

test("옛 구현과 대조: 쪽당 문항 6, 반 여러 개(target_scope grade)도 같은 값이다", async () => {
  const item = examItem();
  const storage = memoryStorage();
  const { model, api } = await build({ items: [item], storage });
  assert.equal(model.setQpp(6), true);
  assert.equal(storage.getItem(Assign.QPP_KEY), "6", "워크스페이스가 다음에 읽는 기억값과 같은 키");
  await pick(model, "c1");
  await pick(model, "c2");
  await model.start();
  const [first] = api.posts();
  const settings6 = Output.settings({ header: item.settings.header, qpp: 6 });
  const legacy = await runLegacyBody({ exam: EXAM, item: { ...EXAM }, classRow: CLASSES[0], studentIds: ["s1", "s2", "s3"], gradeLabel: "중1", qpp: 6, settings: settings6 });
  assert.equal(first.body.pdf_qpp, 6);
  assert.equal(first.body.original_payload_json.meta.qpp, 6);
  assert.deepEqual(first.body.original_payload_json, legacy.body.original_payload_json);
  assert.equal(first.body.pdf_qpp, legacy.body.pdf_qpp);
  assert.equal(first.body.target_scope, "grade", "반이 둘 이상이면 옛 구현처럼 grade");
});

test("서버 소스 대조: 이 본문은 저장본이 아니라 원본 분기로 들어가고, 서버가 읽는 이름을 모두 채운다", async () => {
  const exams = read("apmath", "worker-backup", "worker", "routes", "exams.js");
  const route = read("apmath", "worker-backup", "worker", "routes", "archive2.js");
  const helper = read("apmath", "worker-backup", "worker", "helpers", "archive2-questions.js");
  assert.match(exams, /X-Archive2-Contract'\)==='archive2-v1'[\s\S]{0,200}handleArchive2\(request,env,currentTeacher,'original'/);
  assert.match(route, /const savedPaperMode = action === "original" && input\.saved_paper_id !== undefined;/);
  assert.match(route, /const original = action === "original" && !savedPaperMode;/);
  for (const key of ["contract_version", "class_id", "student_ids", "exam_date", "exam_title", "archive_file", "pdf_qpp", "original_payload_json", "question_count", "subject"])
    assert.match(route + helper, new RegExp(`input\\??\\.${key}\\b`), `서버가 ${key}를 읽는다`);
  assert.match(helper, /input\?\.index_version/);
  // 쓰기 키: batch id가 들어가지 않는다. (반, 출제일, 파일)이 같으면 같은 건이다.
  assert.match(route, /SELECT \* FROM class_exam_assignments WHERE class_id = \? AND exam_date = \? AND archive_file = \?/);
  assert.match(route, /JSON\.stringify\(\[input\.class_id, date, file\]\)/);
  assert.doesNotMatch(route.slice(route.indexOf("const original = action"), route.indexOf("if (savedPaperMode) {", route.indexOf("const original = action"))), /assignment_batch_id/);
  // 기존 건이 있을 때의 판정(가짜 서버가 옮긴 규칙)
  assert.match(route, /취소된 Assignment는 RETRY로 다시 배포할 수 없습니다\./);
  assert.match(route, /기존 Assignment의 고정 roster는 변경할 수 없습니다/);
  assert.match(route, /이미 배부된 시험입니다\. 수정본은 새 문제지로 출제하세요\./);
  assert.match(route, /const contentSnapshot = JSON\.stringify\(\[title, file, qpp, payload, rows\]\)/);
  assert.match(route, /ON CONFLICT\(archive2_write_key\)/);
  // roster의 이미 제출 판정은 exam_sessions.exam_title(= 출제 때 보낸 exam_title)과 exam_date로 한다.
  assert.match(exams, /es\.exam_title = \? AND es\.exam_date = \?/);
  assert.match(read("apmath", "worker-backup", "worker", "routes", "student-portal.js"), /assignment\.exam_title \|\| ''/);
  // 보낸 본문이 위 이름을 채운다
  const { model, api } = await build();
  await pick(model, "c1");
  await model.start();
  const body = api.posts()[0].body;
  assert.equal(typeof body.class_id, "string");
  assert.ok(Array.isArray(body.student_ids) && body.student_ids.length <= 200);
  assert.match(body.exam_date, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(body.exam_title && body.exam_title.length <= 150);
  assert.ok(body.archive_file.startsWith("exams/") && !body.archive_file.includes(".."));
  assert.ok([1, 2, 4, 6, 8].includes(body.pdf_qpp));
  assert.equal(body.original_payload_json.questions.length, body.question_count, "서버가 문항 수를 맞춰 본다");
  assert.ok(JSON.stringify(body).length < 900000, "서버 본문 상한 900KB");
});

test("시험 1 × 반 3개를 차례로 보내고(동시 1), 출제하기를 연달아 눌러도 건수만큼만 나간다", async () => {
  const { model, api } = await build();
  for (const id of ["c1", "c2", "c3"]) await pick(model, id);
  assert.equal(model.canSubmit(), true);
  const first = model.start();
  const second = model.start();
  const third = model.start();
  assert.equal(await second, false);
  assert.equal(await third, false);
  await first;
  assert.equal(api.posts().length, 3);
  assert.equal(api.maxPostInflight(), 1, "동시에 둘 이상 보내지 않는다");
  assert.deepEqual(api.posts().map((c) => c.body.class_id), ["c1", "c2", "c3"]);
  assert.equal(api.server.created(), 3);
  assert.equal(model.results().ok, 3);
  assert.equal(model.state.phase, "done");
  // 원본 문항은 한 번만 받는다(준비 중 다시 받지 않는다)
});

test("원본 문항 받기가 실패하면 아무것도 보내지 않고 잠금을 풀며, 다시 누르면 받아서 보낸다", async () => {
  let attempts = 0;
  const loadQuestions = async () => { attempts += 1; if (attempts <= 2) throw new Error("network"); return QUESTIONS.map((q) => ({ ...q })); };
  const { model, api } = await build({ loadQuestions });
  await pick(model, "c1");
  assert.equal(await model.start(), false);
  assert.equal(api.posts().length, 0);
  assert.match(model.state.startError, /시험지 원본을 불러오지 못했습니다/);
  assert.equal(model.state.starting, false);
  assert.equal(model.canSubmit(), true, "잠금이 풀려 다시 누를 수 있다");
  assert.equal(await model.start(), true);
  assert.equal(api.posts().length, 1);
  assert.equal(model.state.startError, "");
});

test("원본 문항 수가 목록과 다르면 아무것도 보내지 않는다", async () => {
  const { model, api } = await build({ loadQuestions: async () => QUESTIONS.slice(0, 2) });
  await pick(model, "c1");
  assert.equal(await model.start(), false);
  assert.equal(api.posts().length, 0);
  assert.match(model.state.startError, /문항 수가 목록과 달라/);
  assert.equal(Assign.render(model).foot.includes("문항 수가 목록과 달라"), true);
});

test("응답이 끊기면 '결과 확인 필요'이고, 확인하기는 같은 본문을 다시 보내 서버가 같은 건으로 돌려준다", async () => {
  const server = fakeServer();
  let n = 0;
  const post = (call) => {
    n += 1;
    const response = server.handle(call.body); // 서버에는 저장됐지만
    if (n === 1) throw timeoutError(); // 응답이 오지 않았다
    return response;
  };
  const { model, api, storage } = await build({ api: makeApi({ server, post }) });
  await pick(model, "c1");
  await model.start();
  assert.equal(model.state.jobs[0].status, "unknown");
  assert.equal(model.results().unknown, 1);
  assert.match(Assign.render(model).foot, /data-assign-action="confirm-all"/);
  assert.match(Assign.render(model).body, /결과 확인 필요/);
  // 결과를 모르는 건은 저장소에 표시가 남아 다음에 열어도 반 줄에서 알린다(batch id는 만들지 않는다)
  assert.deepEqual(model.store.unknownFor(`exams/${FILE}`, "c1"), ["2026-11-10"]);
  assert.doesNotMatch(JSON.stringify([...storage.map.values()]), /[0-9a-f]{8}-[0-9a-f]{4}-4/, "원본에는 저장본용 UUID를 만들지 않는다");
  await model.confirmUnknown();
  const [firstCall, secondCall] = api.posts();
  assert.equal(JSON.stringify(secondCall.body), JSON.stringify(firstCall.body), "같은 본문(batch id 포함)");
  assert.equal(model.state.jobs[0].status, "ok");
  assert.equal(server.created(), 1, "서버에는 한 건만 있다");
  assert.equal(model.store.unknownFor(`exams/${FILE}`, "c1").length, 0, "확인되면 표시가 지워진다");
  assert.match(Assign.render(model).body, /출제됨 \(다시 확인해 같은 건으로 처리\)/);
});

test("끊긴 건을 확인하기 전에 패널을 닫았다 다시 열어도 같은 본문이라 중복 출제가 생기지 않는다", async () => {
  const server = fakeServer();
  let n = 0;
  const post = (call) => { n += 1; const r = server.handle(call.body); if (n === 1) throw timeoutError(); return r; };
  const storage = memoryStorage();
  const first = await build({ api: makeApi({ server, post }), storage });
  await pick(first.model, "c1");
  await first.model.start();
  assert.equal(first.model.state.jobs[0].status, "unknown");
  const reopened = await build({ api: makeApi({ server, post }), storage });
  await pick(reopened.model, "c1");
  assert.match(Assign.render(reopened.model).body, /이전에 보낸 출제의 결과를 확인하지 못했습니다/);
  await reopened.model.start();
  assert.equal(reopened.model.state.jobs[0].status, "ok");
  assert.equal(server.created(), 1);
});

test("502 + assignment.id는 출제 성공이고 PDF 다시 준비만 제공한다(출제를 다시 보내지 않는다)", async () => {
  const post = (call) => { throw httpError(502, { success: false, error: "PDF 생성 실패", assignment: { id: "a-pdf", class_id: call.body.class_id, pdf_status: "failed", pdf_error: "render timeout" } }); };
  const { model, api } = await build({ api: makeApi({ post }) });
  await pick(model, "c1");
  await model.start();
  const job = model.state.jobs[0];
  assert.equal(job.status, "ok-pdf");
  assert.equal(job.assignmentId, "a-pdf");
  assert.equal(model.results().okPdf, 1);
  const html = Assign.render(model);
  assert.match(html.body, /출제됨 · PDF만 준비 실패/);
  assert.match(html.body, /data-assign-action="pdf"/);
  assert.doesNotMatch(html.foot, /실패한 건 다시 시도/, "출제 자체는 성공이라 다시 보내기를 권하지 않는다");
  assert.equal(await model.retryFailed(), false);
  assert.equal(api.posts().length, 1);
  await model.retryPdf(job.key);
  assert.equal(job.status, "ok");
  assert.ok(api.calls.some((c) => c.route === "/class-exam-assignments/a-pdf/pdf"));
});

test("409(학생 구성이 다름)는 그 건만 실패하고 교사 말로 알리며, 다른 날짜로 내라고 안내한다", async () => {
  const server = fakeServer();
  // 같은 반·같은 날 같은 시험을 다른 학생 구성으로 이미 낸 건이 서버에 있다
  server.handle({ class_id: "c1", exam_date: "2026-11-10", archive_file: `exams/${FILE}`, exam_title: "2025 왕운중 중1 1학기 중간고사", pdf_qpp: 4, student_ids: ["s1"], original_payload_json: { questions: QUESTIONS, meta: {} } });
  const { model, api } = await build({ api: makeApi({ server }) });
  await pick(model, "c1");
  await pick(model, "c2");
  await model.start();
  assert.equal(api.posts().length, 2, "한 건이 실패해도 나머지는 계속 진행한다");
  const [a, b] = model.state.jobs;
  assert.equal(a.status, "failed");
  assert.match(a.message, /학생 구성이 다릅니다.*출제일을 바꾸거나/);
  assert.doesNotMatch(a.message, /roster|Assignment/);
  assert.equal(b.status, "ok");
  assert.match(Assign.render(model).foot, /실패한 건 다시 시도/);
});

test("서버가 '이미 배부된 시험'(내용 다름)이나 자료 불일치로 거절해도 서버 문장을 그대로 내지 않는다", async () => {
  const messages = [
    ["이미 배부된 시험입니다. 수정본은 새 문제지로 출제하세요.", /내용이 달라 출제할 수 없습니다/],
    ["원본 내용 또는 문항 순서가 변경되었습니다. 목록을 새로고침하세요.", /새로고침한 뒤 다시 출제/],
    ["current projection index_version required", /새로고침한 뒤 다시 출제/],
    ["원본 시험의 문항 수가 일치하지 않습니다.", /새로고침한 뒤 다시 출제/],
    ["학생 출제는 문제지당 최대 80문항입니다. 나누어 출제하세요.", /80개를 넘어/],
  ];
  for (const [raw, expected] of messages) {
    const post = () => { throw httpError(409, { error: raw }); };
    const { model } = await build({ api: makeApi({ post }) });
    await pick(model, "c1");
    await model.start();
    assert.match(model.state.jobs[0].message, expected, raw);
    assert.notEqual(model.state.jobs[0].message, raw);
  }
  const post = () => { throw httpError(413, { error: "payload exceeds 900KB" }); };
  const { model } = await build({ api: makeApi({ post }) });
  await pick(model, "c1");
  await model.start();
  assert.match(model.state.jobs[0].message, /너무 커서/);
});

test("취소된 건과 같은 키(409)는 자동으로 다시 보내지 않고, 새 번호로 내는 길이 없으니 '새로 출제'도 주지 않는다", async () => {
  const server = fakeServer();
  server.handle({ class_id: "c1", exam_date: "2026-11-10", archive_file: `exams/${FILE}`, exam_title: "t", pdf_qpp: 4, student_ids: ["s1", "s2", "s3"], original_payload_json: { questions: [], meta: {} } });
  [...server.store.values()][0].cancelled = true;
  const { model, api } = await build({ api: makeApi({ server }) });
  await pick(model, "c1");
  await model.start();
  const job = model.state.jobs[0];
  assert.equal(job.status, "cancelled");
  assert.match(job.message, /취소된 상태라 같은 날짜로는 다시 낼 수 없습니다/);
  const posts = api.posts().length;
  assert.equal(await model.retryFailed(), false, "취소된 건은 실패한 건 다시 시도에 들어가지 않는다");
  assert.equal(await model.confirmUnknown(), false);
  assert.equal(await model.reissue(job.key), false, "원본은 번호를 바꿀 수 없어 새로 출제가 없다");
  assert.equal(api.posts().length, posts);
  const html = Assign.render(model);
  assert.doesNotMatch(html.body, /data-assign-action="reissue"/);
  assert.match(html.foot, /취소된 출제 1건/);
});

test("401이면 남은 건을 보내지 않고 멈추며 로그인 안내를 낸다", async () => {
  let n = 0;
  const post = (call, server) => { n += 1; if (n === 2) throw httpError(401, { error: "Unauthorized" }); return server.handle(call.body); };
  const { model, api } = await build({ api: makeApi({ post }) });
  for (const id of ["c1", "c2", "c3"]) await pick(model, id);
  await model.start();
  assert.equal(api.posts().length, 2, "c3은 보내지 않는다");
  assert.deepEqual(model.state.jobs.map((j) => j.status), ["ok", "failed", "queued"]);
  assert.equal(model.state.authLost, true);
  assert.match(Assign.render(model).body, /로그인이 끝났습니다/);
  assert.match(Assign.render(model).body, /보내지 않음/);
  n = 5;
  await model.retryFailed();
  assert.equal(api.posts().length, 4, "로그인 뒤 남은 건을 이어서 보낸다(성공한 c1은 다시 보내지 않는다)");
});

// ---- 이전 출제 기록 -------------------------------------------------------------------------------------------
const assignmentRow = (extra = {}) => ({
  id: "x1", class_id: "c1", class_name: "중1 A반", exam_date: "2026-11-10", archive_file: `exams/${FILE}`, saved_paper_id: null,
  source_type: "archive", cancelled_at: null, ...extra,
});

test("recent-summary는 패널을 열 때 한 번만 받고 60초 안에는 다시 쓰며, 60초가 지나면 다시 받는다", async () => {
  let clock = NOW;
  const cache = Assign.createRecentCache();
  const api1 = makeApi();
  await build({ api: api1, now: () => clock, recentCache: cache });
  assert.equal(api1.recents().length, 1);
  assert.match(api1.recents()[0].route, /recent-summary\?limit=1000&from=2026-08-12$/, "최근 90일(한국 날짜), 상한 1000");
  assert.equal(api1.recents()[0].timeoutMs, Assign.READ_TIMEOUT_MS);
  // 같은 페이지에서 다시 열어도 30초 뒤에는 새로 받지 않는다
  clock += 30000;
  const api2 = makeApi();
  await build({ api: api2, now: () => clock, recentCache: cache });
  assert.equal(api2.recents().length, 0);
  clock += 31000;
  const api3 = makeApi();
  await build({ api: api3, now: () => clock, recentCache: cache });
  assert.equal(api3.recents().length, 1);
  // 반을 여러 개 골라 출제해도(명단 요청이 나가도) 이력은 다시 받지 않는다
  const api4 = makeApi();
  const { model } = await build({ api: api4, now: () => clock, recentCache: Assign.createRecentCache() });
  await pick(model, "c1"); await pick(model, "c2");
  assert.equal(api4.recents().length, 1);
});

test("recent-summary가 실패해도 출제는 할 수 있고, 한 줄로 알리며, 다음에 열 때 다시 받는다", async () => {
  let fail = true;
  const recent = () => { if (fail) throw httpError(500, { error: "db" }); return { success: true, assignments: [] }; };
  const cache = Assign.createRecentCache();
  const { model, api } = await build({ api: makeApi({ recent }), recentCache: cache });
  assert.equal(model.state.historyState, "error");
  assert.match(Assign.render(model).body, /이전 출제 기록을 확인하지 못했습니다\. 출제는 할 수 있습니다\./);
  await pick(model, "c1");
  assert.equal(model.canSubmit(), true);
  await model.start();
  assert.equal(model.results().ok, 1);
  assert.equal(api.posts().length, 1);
  fail = false;
  const again = await build({ api: makeApi({ recent }), recentCache: cache });
  assert.equal(again.model.state.historyState, "ready", "실패는 캐시하지 않는다");
});

test("같은 파일·같은 반·같은 날 이미 낸 건은 반 줄에 경고하고, 다른 파일·다른 날·취소된 건과 저장본은 섞지 않는다", async () => {
  const recent = () => ({
    success: true, assignments: [
      assignmentRow(), // 같은 파일, c1, 오늘 → 경고
      assignmentRow({ id: "x2", class_id: "c2", exam_date: "2026-11-07" }), // 같은 파일, 다른 날 → 낸 적이 있습니다
      assignmentRow({ id: "x3", class_id: "c3", archive_file: `exams/${FILE_B}` }), // 다른 파일
      assignmentRow({ id: "x4", class_id: "c3", saved_paper_id: "00000000-0000-4000-8000-000000000001", archive_file: "MIXED:archive2-saved-x" }), // 저장본
      assignmentRow({ id: "x5", class_id: "c4", cancelled_at: "2026-11-10 01:00:00" }), // 취소된 건
    ],
  });
  const { model } = await build({ api: makeApi({ recent }) });
  const body = Assign.render(model).body;
  const rowOf = (id) => body.split(`data-class-row="${id}"`)[1].split("</li>")[0];
  assert.match(rowOf("c1"), /is-warn">11월 10일에 이미 냈습니다\./);
  assert.match(rowOf("c2"), /11월 7일에 낸 적이 있습니다\./);
  assert.doesNotMatch(rowOf("c3"), /이미 냈습니다|낸 적이/);
  assert.match(rowOf("c4"), /취소된 상태라 같은 날짜로는 다시 낼 수 없습니다\. 출제일을 바꿔 주세요\./);
  assert.equal(model.dupInfo(`exams/${FILE}`, model.state.classes[0]).sameDate.id, "x1");
  // 출제일을 바꾸면 판정이 다시 계산된다
  await model.setDate("2026-11-07");
  const body2 = Assign.render(model).body;
  assert.match(body2.split('data-class-row="c2"')[1].split("</li>")[0], /11월 7일에 이미 냈습니다/);
  assert.doesNotMatch(body2.split('data-class-row="c1"')[1].split("</li>")[0], /이미 냈습니다/);
});

test("이력의 파일 이름은 NFC로 맞춰 비교한다(한글 파일명의 조합 방식이 달라도 같은 시험)", async () => {
  const nfd = FILE.normalize("NFD");
  assert.notEqual(nfd, FILE);
  const recent = () => ({ success: true, assignments: [assignmentRow({ archive_file: `exams/${nfd}` })] });
  const { model } = await build({ api: makeApi({ recent }) });
  assert.ok(model.dupInfo(`exams/${FILE}`, model.state.classes[0]).sameDate);
});

test("시험이 둘 이상이면 같은 날 이미 낸 (시험, 반)은 기본으로 빠지고 이력이 늦게 와도 빠진다", async () => {
  const recent = () => ({ success: true, assignments: [assignmentRow()] });
  const items = [examItem(EXAM), examItem(EXAM_B)];
  const { model, api } = await build({ items, api: makeApi({ recent }) });
  await pick(model, "c1");
  const keys = model.plan().combos.map((c) => c.paper.file);
  assert.deepEqual(keys, [FILE_B], "FILE은 이미 냈으니 빠지고 FILE_B만 간다");
  await model.start();
  assert.equal(api.posts().length, 1);
  assert.equal(api.posts()[0].body.archive_file, `exams/${FILE_B}`);
});

test("이력이 늦게 도착해도(반을 먼저 체크한 뒤) 같은 날 건은 기본에서 빠지고, 서버가 같은 건으로 받으므로 중복은 생기지 않는다", async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const recent = async () => { await gate; return { success: true, assignments: [assignmentRow()] }; };
  const items = [examItem(EXAM), examItem(EXAM_B)];
  const model = Assign.createModel({ items, request: makeApi({ recent }).request, storage: memoryStorage(), now: () => NOW, recentCache: Assign.createRecentCache(), original: { indexVersion: INDEX_VERSION, loadQuestions: async () => QUESTIONS.map((q) => ({ ...q })) } });
  await model.load();
  await pick(model, "c1");
  assert.equal(model.plan().combos.length, 2, "이력이 오기 전에는 둘 다 포함");
  assert.match(Assign.render(model).body, /이전 출제 기록을 확인하는 중…/);
  release();
  await tick(); await tick();
  assert.equal(model.state.historyState, "ready");
  assert.equal(model.plan().combos.length, 1);
});

test("이번 접속에서 방금 낸 (시험, 반, 날짜)는 이력에 없어도 같은 날 이미 냈다고 경고한다", async () => {
  const doneStore = Assign.createDoneStore({ storage: memoryStorage() });
  const first = Assign.createModel({ items: [examItem()], request: makeApi().request, storage: memoryStorage(), now: () => NOW, doneStore, recentCache: Assign.createRecentCache(), original: { indexVersion: INDEX_VERSION, loadQuestions: async () => QUESTIONS.map((q) => ({ ...q })) } });
  await first.load();
  await pick(first, "c1");
  await first.start();
  assert.equal(first.results().ok, 1);
  const second = Assign.createModel({ items: [examItem()], request: makeApi().request, storage: memoryStorage(), now: () => NOW, doneStore, recentCache: Assign.createRecentCache(), original: { indexVersion: INDEX_VERSION, loadQuestions: async () => QUESTIONS.map((q) => ({ ...q })) } });
  await second.load();
  await tick();
  assert.match(Assign.render(second).body.split('data-class-row="c1"')[1].split("</li>")[0], /11월 10일에 이미 냈습니다/);
});

// ---- 학생 고르기 ------------------------------------------------------------------------------------------------
test("명단 요청에는 출제 때 보내는 exam_title을 쓴다(서버가 그 제목으로 이미 응시했는지 가른다)", async () => {
  const { model, api } = await build();
  await pick(model, "c1");
  const rosterCall = api.calls.find((c) => c.route.startsWith("/class-exam-assignments/roster?"));
  const query = new URLSearchParams(rosterCall.route.split("?")[1]);
  assert.equal(query.get("exam_title"), "2025 왕운중 중1 1학기 중간고사");
  assert.equal(query.get("exam_date"), "2026-11-10");
  await model.start();
  assert.equal(api.posts()[0].body.exam_title, query.get("exam_title"), "roster 제목 = 출제 제목");
});

test("학생 일부를 빼면 student_ids에 반영되고, '아직 안 본 학생만'은 이미 응시한 학생을 뺀다", async () => {
  const api = makeApi({ submitted: new Set(["s2"]) });
  const { model } = await build({ api });
  await pick(model, "c1");
  model.toggleStudentList("c1");
  const html = Assign.render(model).body;
  assert.match(html, /data-assign-action="students-unsubmitted"/);
  assert.match(html, /학생 s2<\/span>|학생 s2 <small class="assign-muted">응시함/);
  model.toggleStudent("c1", "s3", false);
  assert.deepEqual(model.plan().combos[0].studentIds, ["s1", "s2"]);
  assert.equal(model.selectUnsubmitted("c1"), true);
  await model.start();
  assert.deepEqual(api.posts()[0].body.student_ids, ["s1", "s3"]);
  assert.equal(model.state.jobs[0].studentIds.length, 2);
});

test("서버가 준 문자열(반 이름·시험 제목·메시지)은 이스케이프해서 그린다", async () => {
  const evil = '<img src=x onerror="alert(1)">';
  const classes = [{ id: "c1", name: evil + " 반", grade: "중1" }];
  const items = [examItem(EXAM, { title: evil + " 시험" })];
  const post = () => { throw httpError(409, { error: evil }); };
  const { model } = await build({ items, api: makeApi({ classes, roster: { c1: ["s1"] }, post }) });
  await pick(model, "c1");
  await model.start();
  const html = Object.values(Assign.render(model)).join("");
  assert.doesNotMatch(html, /<img src=x/);
  assert.match(html, /&lt;img src=x/);
});

// ---- 화면 ------------------------------------------------------------------------------------------------------
test("패널 화면: 제목은 '반에 출제', 주 버튼은 '출제하기', 한 쪽 문항 수와 출제일을 고를 수 있다", async () => {
  const { model } = await build();
  const parts = Assign.render(model);
  assert.match(parts.head, /<h2 id="assign-title"[^>]*>반에 출제<\/h2>/);
  assert.match(parts.head, /2025 왕운중 중1 1학기 중간고사 · 3문항/);
  assert.match(parts.foot, />출제하기<\/button>/);
  assert.match(parts.body, /data-assign-action="qpp"/);
  assert.match(parts.body, /<option value="4" selected>4문항<\/option>/);
  assert.match(parts.body, /중1 시험지입니다\. 같은 학년 반을 먼저 보여 줍니다\./);
  // 저장본 패널에는 쪽당 문항 선택이 없다
  const saved = Assign.createModel({ papers: [{ id: "00000000-0000-4000-8000-000000000001", title: "저장본", question_count: 5, grade: "중1" }], request: makeApi().request, storage: memoryStorage(), now: () => NOW });
  await saved.load();
  assert.doesNotMatch(Assign.render(saved).body, /assign-qpp-input/);
});

test("결과표: 출제된 반은 시험지·해설·정답 버튼(출제본 출력)이 있고, 성공·PDF 실패·실패가 섞여도 각각 보인다", async () => {
  const post = (call, server) => {
    if (call.body.class_id === "c2") throw httpError(502, { error: "PDF", assignment: { id: "a-c2", class_id: "c2", pdf_status: "failed", pdf_error: "x" } });
    if (call.body.class_id === "c3") throw httpError(409, { error: "기존 Assignment의 고정 roster는 변경할 수 없습니다." });
    return server.handle(call.body);
  };
  const { model } = await build({ api: makeApi({ post }) });
  for (const id of ["c1", "c2", "c3"]) await pick(model, id);
  await model.start();
  const html = Assign.render(model);
  assert.match(html.body, /data-job="[^"]*c1[^"]*"[\s\S]*출제됨/);
  for (const mode of ["exam", "sol", "ans"])
    assert.match(html.body, new RegExp(`data-action="assignment-output-direct" data-assignment="a-c1-1" data-mode="${mode}"`));
  assert.match(html.body, /data-assignment="a-c2" data-mode="exam"/, "PDF만 실패한 반도 출력 버튼이 있다");
  assert.match(html.foot, /출제됨 2건 \(PDF만 실패 1건\) · 실패 1건/);
  assert.equal(model.state.dirty, false);
});

test("onDone은 출제가 하나라도 저장되면 한 번 불린다", async () => {
  const calls = [];
  const { model } = await build({ onDone: (info) => calls.push(info.succeeded) });
  await pick(model, "c1");
  await model.start();
  model.requestClose();
  assert.deepEqual(calls, [1]);
});

test("진행 중 닫기 잠금은 원본 출제에도 적용된다", async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const post = async (call, server) => { await gate; return server.handle(call.body); };
  const { model } = await build({ api: makeApi({ post }) });
  await pick(model, "c1");
  const running = model.start();
  await tick(); await tick(); await tick();
  assert.equal(model.isBusy(), true);
  assert.equal(model.requestClose().allowed, false);
  release();
  await running;
  assert.equal(model.requestClose().allowed, true);
});

test("준비 중(원본 확인 중)에는 반·출제일 선택이 잠기고 출제하기가 한 번만 동작한다", async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const { model, api } = await build({ loadQuestions: async () => { await gate; return QUESTIONS.map((q) => ({ ...q })); } });
  await pick(model, "c1");
  const running = model.start();
  assert.equal(model.state.starting, true);
  assert.match(Assign.render(model).foot, /시험지 원본을 확인하는 중…/);
  pick(model, "c2");
  assert.equal(model.state.classes.find((c) => c.id === "c2").checked, false, "준비 중에는 반을 더 고를 수 없다");
  assert.equal(model.setDate("2026-11-11"), false);
  assert.equal(await model.start(), false);
  release();
  await running;
  assert.equal(api.posts().length, 1);
  assert.equal(api.posts()[0].body.class_id, "c1");
});

// ---- 워크스페이스 연결 ---------------------------------------------------------------------------------------------
function sliceBetween(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `${start} .. ${end}`);
  return source.slice(from, to);
}
function workspaceHarness({ search = "", assign = true, catalog = null } = {}) {
  const source = read("archive", "archive2-workspace.js");
  const code = sliceBetween(source, "function assignRequest(route, opt = {}) {", "function originalIssueBusy() {");
  const opened = [];
  const legacy = [];
  const notices = [];
  const loads = [];
  const context = {
    state: { originalReceipts: [{ id: "stale" }], catalog: catalog || { indexVersion: INDEX_VERSION, sourceHashes: [[FILE, "hash-abc"]], exams: [EXAM] } },
    location: { search },
    document: { activeElement: { id: "opener" } },
    window: { Archive2Assign: assign ? { open: (o) => opened.push(o), useLegacy: Assign.useLegacy, isOpen: () => false } : undefined, Archive2Library: {} },
    O: Output,
    Source: { load: async (file, hash) => { loads.push([file, hash]); return QUESTIONS; } },
    originalSettingsForExam: (exam) => Output.settings({ header: { title: Output.displayTitle(exam), subtitle: exam.subject }, qpp: 6 }),
    openOriginalIssue: (exam, step) => legacy.push([exam.file, step]),
    openSavedPaperIssue: () => {},
    teacherSessionOk: () => true,
    status: (message, error) => notices.push([message, error]),
    api: async () => ({}),
  };
  vm.runInNewContext(code + "\nthis.openOriginalAssign = openOriginalAssign;", context);
  return { context, opened, legacy, notices, loads };
}
test("workspace: 학교 기출·유사문제·홈의 출제는 원본 항목으로 패널을 열고, assign=legacy면 옛 iframe으로 간다", async () => {
  let h = workspaceHarness({ search: "?view=find" });
  h.context.openOriginalAssign(EXAM);
  assert.equal(h.legacy.length, 0);
  assert.equal(h.opened.length, 1);
  const opts = h.opened[0];
  assert.equal(opts.items.length, 1);
  const item = opts.items[0];
  assert.equal(item.kind, "original");
  assert.equal(item.file, FILE);
  assert.equal(item.count, 3);
  assert.equal(item.sourceHash, "hash-abc");
  assert.equal(item.identityTitle, EXAM.identityTitle);
  assert.equal(item.settings.qpp, 6, "기억해 둔 쪽당 문항 수를 기본으로");
  assert.equal(opts.original.indexVersion, INDEX_VERSION);
  assert.equal(typeof opts.request, "function");
  assert.equal(opts.opener.id, "opener");
  assert.equal(h.context.state.originalReceipts.length, 0, "옛 영수증 상태는 비운다");
  // 원본 문항은 옛 iframe과 같은 방법(해시 확인을 거치는 Source.load)으로 받는다
  const questions = await opts.original.loadQuestions({ file: FILE, sourceHash: "hash-abc" });
  assert.equal(questions.length, 3);
  assert.deepEqual(h.loads, [[FILE, "hash-abc"]]);

  h = workspaceHarness({ search: "?view=find&assign=legacy" });
  h.context.openOriginalAssign(EXAM);
  assert.equal(h.opened.length, 0);
  assert.deepEqual(h.legacy, [[FILE, "targets"]]);

  h = workspaceHarness({ search: "", assign: false });
  h.context.openOriginalAssign(EXAM);
  assert.deepEqual(h.legacy, [[FILE, "targets"]], "패널 스크립트가 없으면 옛 경로");

  h = workspaceHarness({ catalog: { indexVersion: INDEX_VERSION, sourceHashes: [], exams: [EXAM] } });
  h.context.openOriginalAssign(EXAM);
  assert.equal(h.opened.length, 0, "원본 해시를 모르면 패널을 열지 않고 알린다");
  assert.equal(h.notices[0][1], true);
});

test("workspace: source-issue는 새 패널 함수로 가고, 단원별 기출·옛 iframe 함수는 그대로 남아 있다", () => {
  const workspace = read("archive", "archive2-workspace.js");
  assert.match(workspace, /a === "source-issue"\) \{[\s\S]{0,200}openOriginalAssign\(state\.catalog\.exams\[Number\(b\.dataset\.exam\)\]\);/);
  assert.match(workspace, /function openOriginalIssue\(exam, step = "review"\)/);
  assert.match(workspace, /function openSavedPaperIssue\(id\)/);
  assert.doesNotMatch(workspace, /openOriginalIssue\(state\.catalog\.exams\[Number\(b\.dataset\.exam\)\], "targets"\)/);
  // 이번 범위는 학교 기출·유사문제까지다: 옛 파일은 건드리지 않았다
  assert.match(read("archive", "archive2-entry.js"), /window\.prepareArchive2OriginalAssignment = async function/);
});

test("버튼 글자: 줄에는 '출제', 패널 제목은 '반에 출제', 스크린리더 이름은 풀어 쓴다", () => {
  const workspace = read("archive", "archive2-workspace.js");
  assert.match(workspace, /button\("source-issue", "출제", `type="button" class="primary" data-exam="\$\{index\}" aria-label="\$\{esc\(title\)\} 반에 출제"`\)/);
  assert.match(workspace, /button\("source-issue", "출제", `type="button" class="primary" data-exam="\$\{setIndex\}" aria-label="\$\{esc\(setTitle\)\} 반에 출제"`\)/);
  assert.match(workspace, /alreadySaved \? "저장한 문제지 출제" : "저장하고 출제"/);
  assert.match(workspace, /aria-label="\$\{alreadySaved \? "저장한 문제지 반에 출제" : "저장하고 반에 출제"\}"/);
  assert.match(workspace, /"이 저장본 출제"/);
  assert.doesNotMatch(workspace, /button\("source-issue", "반에 출제"/);
  assert.match(workspace, /<h2>단원<\/h2>/);
  assert.doesNotMatch(workspace, /<h2>출제 범위<\/h2>/);
  assert.match(workspace, /단원을 고르세요\. 숫자는 지금 낼 수 있는 문항 수입니다\./);
  assert.doesNotMatch(workspace, /출제할 단원을 고르세요/);
  assert.match(Assign.renderHead(Assign.createModel({ papers: [{ id: "00000000-0000-4000-8000-000000000001", title: "t", question_count: 1 }], request: async () => ({}) })), />반에 출제<\/h2>/);
  const library = read("archive", "archive2-library.js");
  assert.match(library, /data-library-action="distribute" data-paper-id="\$\{id\}" aria-label="\$\{esc\(title\)\} 반에 출제">출제<\/button>/);
  assert.match(library, /이 묶음 \$\{parts\}권 모두 출제/);
  // 그대로 두는 말
  for (const word of ["출제 내역", "출제 이력"]) assert.ok((workspace + library).includes(word), word);
});

test("한 화면 안내문: 홈 줄·유사 세트 대화상자·학교별 기출이 모두 source-issue 하나로 새 패널에 닿는다", () => {
  const workspace = read("archive", "archive2-workspace.js");
  const handlers = workspace.match(/a === "source-issue"/g) || [];
  assert.equal(handlers.length, 1, "출제 진입은 한 곳");
  assert.equal((workspace.match(/button\("source-issue"/g) || []).length, 3, "시험 줄, 유사문제 칸, 유사 세트 대화상자");
  assert.ok(!/CATALOG_FREE_ACTIONS = new Set\(\[[^\]]*"source-issue"/.test(workspace), "카탈로그(해시·색인 버전)가 필요하니 준비 전에는 기존 지연 방식으로 기다린다");
});
