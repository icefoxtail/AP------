// 화면 안 "반에 출제" 패널 (2026-11-10): 중복 출제·누락·'됐는지 모름'을 막는 상태 기계를 가짜 request로 검증한다.
// 실제 서버로는 아무것도 보내지 않는다.
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");
const Assign = require("../archive/archive2-assign.js");

const P1 = "00000000-0000-4000-8000-000000000001";
const P2 = "00000000-0000-4000-8000-000000000002";
const tick = () => new Promise((resolve) => setImmediate(resolve));
const paper = (id, extra = {}) => ({ id, title: `문제지 ${id.slice(-1)}`, library_display_name: `문제지 ${id.slice(-1)}`, grade: "고1", subject: "공통수학1", question_count: 20, part_index: 0, part_count: 1, ...extra });
const CLASSES = [
  { id: "c1", name: "고1 A반", grade: "고1", teacher_name: "김선생" },
  { id: "c2", name: "고1 B반", grade: "고1", teacher_name: "김선생" },
  { id: "c3", name: "고2 A반", grade: "고2", teacher_name: "김선생" },
  { id: "c0", name: "고1 빈반", grade: "고1", teacher_name: "김선생" },
];
const ROSTER = {
  c1: ["s1", "s2", "s3"], c2: ["s4", "s5"], c3: ["s6", "s7", "s8", "s9"], c0: [],
};
function httpError(status, data = {}, message = "") {
  const error = new Error(message || data.error || `요청 실패 (${status})`);
  error.status = status;
  error.data = data;
  return error;
}
const networkError = () => new TypeError("Failed to fetch");
const timeoutError = () => Object.assign(new Error("응답이 늦습니다."), { timeout: true });
const okAssignment = (call, extra = {}) => ({
  success: true, saved: true,
  assignment: { id: `a-${call.body.class_id}-${call.body.saved_paper_id.slice(-1)}`, class_id: call.body.class_id, pdf_status: "ready", created_at: new Date().toISOString().replace("T", " ").slice(0, 19), ...extra },
});

// post(call, n): n = 이 (반, 문제지)에 대한 몇 번째 POST인지. 값을 돌려주면 성공, 던지면 실패.
function makeApi({ classes = CLASSES, roster = ROSTER, post = (call) => okAssignment(call), rosterFail = new Set(), classesError = null, pdf = null, submitted = new Set() } = {}) {
  const calls = [];
  const counts = new Map();
  let postInflight = 0, maxPostInflight = 0;
  async function request(route, opt = {}) {
    const call = { route, method: opt.method || "GET", headers: opt.headers, body: opt.body ? JSON.parse(JSON.stringify(opt.body)) : undefined, timeoutMs: opt.timeoutMs };
    calls.push(call);
    const isPost = route === "/class-exam-assignments" && call.method === "POST";
    if (isPost) { postInflight += 1; maxPostInflight = Math.max(maxPostInflight, postInflight); }
    try {
      await tick();
      if (route === "/qr-classes") {
        if (classesError) throw classesError;
        return { success: true, classes };
      }
      if (route.startsWith("/class-exam-assignments/roster?")) {
        const classId = new URLSearchParams(route.split("?")[1]).get("class_id");
        if (rosterFail.has(classId)) throw httpError(500, { error: "server" });
        return { success: true, students: (roster[classId] || []).map((id) => ({ id, name: `학생 ${id}`, already_submitted: submitted.has(id) })) };
      }
      if (isPost) {
        const key = `${call.body.saved_paper_id}|${call.body.class_id}`;
        const n = (counts.get(key) || 0) + 1;
        counts.set(key, n);
        return post(call, n);
      }
      if (/^\/class-exam-assignments\/[^/]+\/pdf$/.test(route)) {
        if (pdf) return pdf(call);
        return { success: true, assignment: { id: route.split("/")[2], pdf_status: "ready" } };
      }
      throw httpError(404, { error: "no route " + route });
    } finally {
      if (isPost) postInflight -= 1;
    }
  }
  return { request, calls, posts: () => calls.filter((c) => c.route === "/class-exam-assignments" && c.method === "POST"), maxPostInflight: () => maxPostInflight };
}
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial));
  return { getItem: (k) => (map.has(k) ? map.get(k) : null), setItem: (k, v) => map.set(k, String(v)), removeItem: (k) => map.delete(k), map };
}
let uuidCounter = 0;
const uuid = () => `11111111-1111-4111-8111-${String(++uuidCounter).padStart(12, "0")}`;
const NOW = Date.parse("2026-11-10T03:00:00Z"); // 한국 시간 2026-11-10 12:00
async function build({ papers = [paper(P1)], api = makeApi(), history = null, storage = memoryStorage(), onDone = () => {}, now = () => NOW } = {}) {
  const model = Assign.createModel({ papers, request: api.request, history, storage, uuid, now, onDone });
  await model.load();
  return { model, api, storage };
}
async function pick(model, classId, checked = true) {
  await model.toggleClass(classId, checked);
}

test("본문과 헤더가 옛 모달의 저장본 출제와 같다", async () => {
  const { model, api } = await build();
  await pick(model, "c1");
  assert.equal(model.canSubmit(), true);
  await model.start();
  const [call] = api.posts();
  assert.equal(call.route, "/class-exam-assignments");
  assert.deepEqual(call.headers, { "X-Archive2-Contract": "archive2-v1" });
  assert.deepEqual(Object.keys(call.body), ["contract_version", "saved_paper_id", "assignment_batch_id", "class_id", "student_ids", "exam_date"]);
  assert.equal(call.body.contract_version, "archive2-v1");
  assert.equal(call.body.saved_paper_id, P1);
  assert.equal(call.body.class_id, "c1");
  assert.deepEqual(call.body.student_ids, ["s1", "s2", "s3"]);
  assert.equal(call.body.exam_date, "2026-11-10");
  assert.match(call.body.assignment_batch_id, /^[0-9a-f-]{36}$/);
  // 옛 모달(index.html)의 저장본 payload와 같은 키 이름·헤더
  const legacy = read("archive", "index.html");
  const block = legacy.slice(legacy.indexOf("const payload = item?.savedPaperId ? {"), legacy.indexOf("} : {", legacy.indexOf("const payload = item?.savedPaperId ? {")));
  const legacyKeys = [...block.matchAll(/^\s+([a-z_]+):/gm)].map((m) => m[1]);
  assert.deepEqual(legacyKeys, Object.keys(call.body));
  assert.match(legacy, /'X-Archive2-Contract':payload\.contract_version/);
  assert.match(legacy, /\/class-exam-assignments`, \{\s*method: 'POST'/);
});

test("서버 계약 대조: 서버가 읽는 이름과 batch id 형식을 만족한다", async () => {
  const route = read("apmath", "worker-backup", "worker", "routes", "archive2.js");
  for (const key of ["saved_paper_id", "assignment_batch_id", "class_id", "student_ids", "exam_date", "contract_version"])
    assert.match(route, new RegExp(`input\\.${key}\\b`), `서버가 ${key}를 읽는다`);
  assert.match(read("apmath", "worker-backup", "worker", "routes", "exams.js"), /X-Archive2-Contract'\)==='archive2-v1'/);
  const helpers = await import(path.join(root, "apmath", "worker-backup", "worker", "helpers", "archive-saved-papers.js").replace(/\\/g, "/").replace(/^([A-Za-z]):/, "file:///$1:"));
  const { model, api } = await build({ papers: [paper(P1)] });
  await pick(model, "c1");
  await model.start();
  const body = api.posts()[0].body;
  assert.match(body.assignment_batch_id, helpers.SAVED_PAPER_BATCH_ID);
  assert.match(body.saved_paper_id, helpers.SAVED_PAPER_BATCH_ID, "서버가 저장본 id도 같은 UUID 형식으로 검사한다");
  assert.ok(Array.isArray(body.student_ids) && body.student_ids.length > 0 && body.student_ids.length <= 200, "서버 uniqueIds 상한 200");
  assert.match(body.exam_date, /^\d{4}-\d{2}-\d{2}$/);
});

test("문제지 2권 × 반 2개 = 4건을 차례로 보낸다(동시에 둘 이상 진행하지 않는다)", async () => {
  const api = makeApi();
  const { model } = await build({ papers: [paper(P1), paper(P2)], api });
  await pick(model, "c1");
  await pick(model, "c2");
  const plan = model.plan();
  assert.equal(plan.combos.length, 4);
  assert.equal(plan.paperCount, 2);
  assert.equal(plan.classCount, 2);
  assert.equal(plan.studentCount, 5);
  await model.start();
  assert.equal(api.posts().length, 4);
  assert.equal(api.maxPostInflight(), 1);
  assert.deepEqual(api.posts().map((c) => `${c.body.saved_paper_id.slice(-1)}${c.body.class_id}`), ["1c1", "1c2", "2c1", "2c2"]);
  assert.equal(model.results().ok, 4);
  assert.match(Assign.renderFoot(model), /문제지 2권|출제됨 4건/);
});

test("출제하기를 연달아 눌러도 POST는 건수만큼만 나간다", async () => {
  const api = makeApi();
  const { model } = await build({ papers: [paper(P1), paper(P2)], api });
  await pick(model, "c1");
  await pick(model, "c2");
  const runs = await Promise.all([model.start(), model.start(), model.start()]);
  assert.deepEqual(runs, [true, false, false]);
  assert.equal(api.posts().length, 4);
  assert.equal(await model.start(), false, "끝난 뒤에도 다시 시작되지 않는다");
  assert.equal(api.posts().length, 4);
});

test("batch id는 실패·끊김 뒤 재시도에서 같고, 성공하면 지워지며, 새로고침 뒤에도 같다", async () => {
  const storage = memoryStorage();
  const post = (call, n) => { if (n === 1) throw httpError(404, { error: "저장한 시험지를 찾을 수 없습니다." }); return okAssignment(call); };
  let { model, api } = await build({ storage, api: makeApi({ post }) });
  await pick(model, "c1");
  await model.start();
  const first = api.posts()[0].body.assignment_batch_id;
  assert.equal(model.state.jobs[0].status, "failed");
  assert.match(storage.getItem(Assign.STORAGE_KEY), new RegExp(first));
  // 같은 모델에서 다시 시도
  await model.retryFailed();
  assert.equal(api.posts()[1].body.assignment_batch_id, first);
  assert.equal(model.state.jobs[0].status, "ok");
  assert.equal(JSON.parse(storage.getItem(Assign.STORAGE_KEY)).items[`${P1}|c1|2026-11-10`], undefined, "성공 뒤 지운다");
  // 새 출제는 새 번호
  ({ model, api } = await build({ storage, api: makeApi() }));
  await pick(model, "c1");
  await model.start();
  assert.notEqual(api.posts()[0].body.assignment_batch_id, first);

  // 패널을 닫았다 열기·새로고침: 실패한 건은 새 모델에서도 같은 번호
  const storage2 = memoryStorage();
  const failing = makeApi({ post: () => { throw httpError(404, { error: "x" }); } });
  let built = await build({ storage: storage2, api: failing });
  await pick(built.model, "c1");
  await built.model.start();
  const id1 = failing.posts()[0].body.assignment_batch_id;
  const again = makeApi();
  built = await build({ storage: storage2, api: again });
  await pick(built.model, "c1");
  await built.model.start();
  assert.equal(again.posts()[0].body.assignment_batch_id, id1);
  assert.equal(JSON.parse(storage2.getItem(Assign.STORAGE_KEY)).items[`${P1}|c1|2026-11-10`], undefined);
});

test("출제일이 다르면 batch id도 다르고, 7일이 지난 항목은 정리된다", async () => {
  const storage = memoryStorage();
  const store = Assign.createBatchStore({ storage, uuid, now: () => NOW });
  const a = store.ensure(P1, "c1", "2026-11-10");
  const b = store.ensure(P1, "c1", "2026-11-11");
  assert.notEqual(a.id, b.id);
  assert.equal(store.ensure(P1, "c1", "2026-11-10").id, a.id);
  const later = Assign.createBatchStore({ storage, uuid, now: () => NOW + 8 * 24 * 3600 * 1000 });
  assert.equal(later.peek(P1, "c1", "2026-11-10"), null);
  assert.equal(JSON.parse(storage.getItem(Assign.STORAGE_KEY)).items[`${P1}|c1|2026-11-10`], undefined);
});

test("localStorage가 막혀도 출제는 되고 같은 모델에서는 같은 번호를 쓴다", async () => {
  const broken = { getItem() { throw new Error("blocked"); }, setItem() { throw new Error("blocked"); }, removeItem() { throw new Error("blocked"); } };
  const post = (call, n) => { if (n === 1) throw networkError(); return okAssignment(call); };
  const { model, api } = await build({ storage: broken, api: makeApi({ post }) });
  await pick(model, "c1");
  await model.start();
  assert.equal(model.state.jobs[0].status, "unknown");
  await model.confirmUnknown();
  assert.equal(model.state.jobs[0].status, "ok");
  assert.equal(api.posts()[0].body.assignment_batch_id, api.posts()[1].body.assignment_batch_id);
});

test("응답이 끊기면 '결과 확인 필요'이고 확인하기는 같은 본문·같은 batch id로 다시 보낸다", async () => {
  for (const failure of [networkError, timeoutError, () => httpError(504, {}), () => httpError(500, { error: "persisted question parity failure" }), () => httpError(502, {})]) {
    const post = (call, n) => { if (n === 1) throw failure(); return okAssignment(call, { created_at: "2026-11-09 00:00:00" }); };
    const { model, api } = await build({ api: makeApi({ post }) });
    await pick(model, "c1");
    await model.start();
    const job = model.state.jobs[0];
    assert.equal(job.status, "unknown");
    assert.match(job.message, /확인이 필요/);
    assert.match(Assign.renderBody(model), /결과 확인 필요/);
    assert.match(Assign.renderBody(model), /data-assign-action="confirm"/);
    await model.confirmUnknown(job.key);
    assert.deepEqual(api.posts()[1].body, api.posts()[0].body);
    assert.equal(job.status, "ok");
    assert.equal(job.already, true, "서버가 이미 있던 건을 돌려주면 '이미 출제됨(같은 건)'");
    assert.match(Assign.renderBody(model), /이미 출제됨 \(같은 건\)/);
  }
});

test("출제 POST는 150초, 읽기는 30초 제한을 단다", async () => {
  const { model, api } = await build();
  await pick(model, "c1");
  await model.start();
  assert.equal(Assign.WRITE_TIMEOUT_MS, 150000);
  assert.equal(Assign.READ_TIMEOUT_MS, 30000);
  assert.equal(api.posts()[0].timeoutMs, 150000);
  assert.equal(api.calls[0].timeoutMs, 30000);
  assert.ok(api.calls.filter((c) => c.method === "GET").every((c) => c.timeoutMs === 30000));
});

test("502 + assignment.id(PDF만 실패)는 출제 성공이고 PDF 다시 준비만 제공한다", async () => {
  const onDone = [];
  const post = (call) => { throw httpError(502, { success: false, saved: true, error: "시험지 PDF 생성 실패", assignment: { id: "a-pdf", pdf_status: "failed", pdf_error: "Browser Rendering 시간 초과" } }); };
  let pdfCalls = 0;
  const pdf = () => { pdfCalls += 1; return pdfCalls === 1 ? { success: true, assignment: { id: "a-pdf", pdf_status: "failed", pdf_error: "또 실패" } } : { success: true, assignment: { id: "a-pdf", pdf_status: "ready" } }; };
  const storage = memoryStorage();
  const { model, api } = await build({ api: makeApi({ post, pdf }), storage, onDone: (r) => onDone.push(r) });
  await pick(model, "c1");
  await model.start();
  const job = model.state.jobs[0];
  assert.equal(job.status, "ok-pdf");
  assert.equal(job.assignmentId, "a-pdf");
  assert.equal(api.posts().length, 1, "출제를 다시 보내지 않는다");
  assert.equal(JSON.parse(storage.getItem(Assign.STORAGE_KEY)).items[`${P1}|c1|2026-11-10`], undefined, "출제는 저장됐으니 번호를 지운다");
  assert.equal(onDone.length, 1);
  assert.equal(onDone[0].succeeded, 1);
  const html = Assign.renderBody(model);
  assert.match(html, /PDF만 준비 실패/);
  assert.match(html, /data-assign-action="pdf"/);
  assert.match(html, /출제는 됐습니다\. 출력용 PDF 준비가 늦어지고 있으니 PDF 다시 준비 버튼을 눌러 주세요./);
  assert.doesNotMatch(html, /Browser Rendering|시간 초과/, "서버 원문은 화면에 내지 않는다");
  assert.doesNotMatch(Assign.renderFoot(model), /data-assign-action="retry"/, "실패 건이 없으니 출제 재시도 버튼은 없다");
  await model.retryPdf(job.key);
  assert.equal(job.status, "ok-pdf");
  assert.match(job.pdfError, /PDF를 아직 준비하지 못했습니다/);
  assert.doesNotMatch(Assign.renderBody(model), /또 실패/, "재시도 실패 원문도 화면에 내지 않는다");
  await model.retryPdf(job.key);
  assert.equal(job.status, "ok");
  assert.equal(api.calls.filter((c) => /\/pdf$/.test(c.route)).length, 2);
  assert.equal(api.posts().length, 1);
  assert.equal(api.calls.find((c) => /\/pdf$/.test(c.route)).method, "POST");
});

test("200 응답에 pdf_status가 ready가 아니어도 PDF 실패로 다룬다", async () => {
  const { model } = await build({ api: makeApi({ post: (call) => okAssignment(call, { pdf_status: "failed", pdf_error: "시간 초과" }) }) });
  await pick(model, "c1");
  await model.start();
  assert.equal(model.state.jobs[0].status, "ok-pdf");
});

test("409는 그 건만 실패하고 나머지는 계속 진행하며 서버 문구를 교사 말로 바꾼다", async () => {
  const post = (call) => {
    if (call.body.class_id === "c1") throw httpError(409, { success: false, error: "기존 Assignment의 고정 roster는 변경할 수 없습니다. 학생 추가는 ADD_RECIPIENTS로 요청하세요." });
    return okAssignment(call);
  };
  const { model, api } = await build({ api: makeApi({ post }) });
  await pick(model, "c1");
  await pick(model, "c2");
  await model.start();
  assert.deepEqual(model.state.jobs.map((j) => j.status), ["failed", "ok"]);
  assert.equal(api.posts().length, 2);
  assert.doesNotMatch(model.state.jobs[0].message, /ADD_RECIPIENTS|Assignment|roster|같은 번호/);
  assert.equal(model.state.jobs[0].message, "이 반에 이미 보낸 출제와 학생 구성이 다릅니다. 출제 내역에서 먼저 확인해 주세요.");
  assert.match(model.state.jobs[0].message, /학생 구성/);
  assert.equal(model.state.authLost, false);
  // 알려지지 않은 영어 오류는 가린다
  assert.match(Assign.friendlyMessage(httpError(409, { error: "SOMETHING_ELSE broke" }), 409), /출제하지 못했습니다/);
  assert.match(Assign.friendlyMessage(httpError(409, { error: "대상 반보다 높은 학년의 source 문항은 기본 출제할 수 없습니다." }), 409), /반 학년보다 높은/);
});

test("취소된 출제와 같은 키(409)는 자동으로 다시 보내지 않고, 교사가 '새로 출제'를 누르면 새 번호로 한 번 보낸다", async () => {
  const post = (call, n) => { if (n === 1 && call.body.class_id === "c1") throw httpError(409, { error: "취소된 Assignment는 RETRY로 다시 배포할 수 없습니다." }); return okAssignment(call); };
  const { model, api } = await build({ api: makeApi({ post }) });
  await pick(model, "c1");
  await pick(model, "c2");
  await model.start();
  assert.deepEqual(model.state.jobs.map((j) => j.status), ["cancelled", "ok"]);
  assert.equal(model.state.jobs[0].message, "이 출제는 취소된 상태입니다.");
  const html = Assign.renderBody(model);
  assert.match(html, /취소된 출제/);
  assert.match(html, /이 출제는 취소된 상태입니다\./);
  assert.match(html, /data-assign-action="reissue"/);
  assert.match(html, />새로 출제</);
  assert.doesNotMatch(Assign.renderFoot(model), /data-assign-action="retry"/, "일괄 다시 시도에는 취소된 건이 들어가지 않는다");
  assert.match(Assign.renderFoot(model), /취소된 출제 1건/);
  const before = api.posts().length;
  assert.equal(await model.retryFailed(), false, "다시 시도 대상이 아니다");
  assert.equal(await model.confirmUnknown(), false);
  assert.equal(api.posts().length, before, "자동 POST 0회");
  const firstId = api.posts()[0].body.assignment_batch_id;
  assert.equal(await model.reissue(model.state.jobs[0].key), true);
  assert.equal(api.posts().length, before + 1, "새로 출제는 한 번만 보낸다");
  assert.notEqual(api.posts().at(-1).body.assignment_batch_id, firstId, "새 batch id");
  assert.equal(model.state.jobs[0].status, "ok");
  assert.equal(await model.reissue(model.state.jobs[1].key), false, "취소 상태가 아닌 건에는 쓸 수 없다");
});

test("401이면 남은 건을 보내지 않고 멈추며 이미 된 건은 결과표에 남고, 로그인 뒤 이어서 보낸다", async () => {
  let loggedIn = false;
  const post = (call) => { if (call.body.class_id === "c2" && !loggedIn) throw httpError(401, { error: "Unauthorized" }); return okAssignment(call); };
  const { model, api } = await build({ papers: [paper(P1)], api: makeApi({ post }) });
  await pick(model, "c1");
  await pick(model, "c2");
  await pick(model, "c3");
  await model.start();
  assert.deepEqual(model.state.jobs.map((j) => j.status), ["ok", "failed", "queued"]);
  assert.equal(api.posts().length, 2, "세 번째 건은 보내지 않는다");
  assert.equal(model.state.authLost, true);
  const body = Assign.renderBody(model);
  assert.match(body, /로그인이 끝났습니다/);
  assert.match(body, /보내지 않음/);
  assert.match(body, /\.\.\/apmath\//);
  assert.match(body, /출제됨/);
  loggedIn = true;
  await model.retryFailed();
  assert.deepEqual(model.state.jobs.map((j) => j.status), ["ok", "ok", "ok"]);
  assert.equal(api.posts().length, 4, "이미 된 첫 건은 다시 보내지 않는다");
  assert.equal(api.posts()[2].body.assignment_batch_id, api.posts()[1].body.assignment_batch_id);
});

test("반 목록: 401은 로그인 안내, 담당 반 없음, 불러오기 실패는 다시 시도", async () => {
  let built = await build({ api: makeApi({ classesError: httpError(401, { error: "Unauthorized" }) }) });
  assert.equal(built.model.state.phase, "login");
  assert.match(Assign.renderBody(built.model), /선생님 로그인/);
  built = await build({ api: makeApi({ classes: [] }) });
  assert.equal(built.model.state.phase, "empty");
  assert.match(Assign.renderBody(built.model), /담당 반이 없습니다\. 반 배정은 APMS에서 합니다/);
  built = await build({ api: makeApi({ classesError: networkError() }) });
  assert.equal(built.model.state.phase, "error");
  assert.match(Assign.renderBody(built.model), /data-assign-action="reload"/);
});

test("같은 날 이미 낸 반은 기본으로 체크되지 않고, 문제지가 여러 권이면 그 건만 빠진다", async () => {
  const history = { state: "ready", byPaper: new Map([
    [P1, [{ id: "x1", classId: "c1", className: "고1 A반", date: "2026-11-10", cancelled: false }, { id: "x2", classId: "c2", className: "고1 B반", date: "2026-11-07", cancelled: false }, { id: "x3", classId: "c3", className: "고2 A반", date: "2026-11-10", cancelled: true }]],
  ]) };
  // 한 권: 반은 처음에 체크되어 있지 않고 "이미 냈습니다"가 보인다
  let built = await build({ history });
  let html = Assign.renderBody(built.model);
  assert.match(html, /11월 10일에 이미 냈습니다/);
  assert.match(html, /11월 7일에 낸 적이 있습니다/);
  assert.doesNotMatch(html, /data-class-id="c1"[^>]*checked/);
  const c3Row = html.slice(html.indexOf('data-class-row="c3"'));
  assert.doesNotMatch(c3Row.slice(0, c3Row.indexOf("</li>")), /냈습니다|낸 적/, "취소된 출제는 이미 냈다고 하지 않는다");
  assert.equal(built.model.canSubmit(), false);
  // 여러 권: 체크하면 이미 낸 (문제지, 반)만 빠진 채 시작한다
  built = await build({ papers: [paper(P1), paper(P2)], history });
  await pick(built.model, "c1");
  let plan = built.model.plan();
  assert.deepEqual(plan.combos.map((c) => c.key), [`${P2}|c1`]);
  html = Assign.renderBody(built.model);
  assert.match(html, /출제 건 확인/);
  assert.match(html, /11월 10일에 이미 냈습니다/);
  built.model.toggleCombo(`${P1}|c1`, true);
  assert.equal(built.model.plan().combos.length, 2, "교사가 다시 체크하면 포함된다");
  await built.model.start();
  assert.equal(built.api.posts().length, 2);
});

test("출제일을 바꾸면 이미 낸 판정과 명단이 새 날짜로 다시 계산된다", async () => {
  const history = { state: "ready", byPaper: new Map([[P1, [{ id: "x1", classId: "c1", className: "고1 A반", date: "2026-11-07", cancelled: false }]]]) };
  const { model, api } = await build({ history });
  await pick(model, "c1");
  assert.equal(model.dupInfo(P1, model.state.classes.find((c) => c.id === "c1")).sameDate, null);
  await model.setDate("2026-11-07");
  assert.ok(model.dupInfo(P1, model.state.classes.find((c) => c.id === "c1")).sameDate);
  const rosterCalls = api.calls.filter((c) => c.route.startsWith("/class-exam-assignments/roster?"));
  assert.equal(rosterCalls.length, 2);
  assert.match(rosterCalls[1].route, /exam_date=2026-11-07/);
  assert.equal(await model.setDate("2026/11/07"), false);
  await model.start();
  assert.equal(api.posts()[0].body.exam_date, "2026-11-07");
});

test("학생을 일부 빼면 student_ids에 반영되고, 전부 빼면 그 반은 출제되지 않는다", async () => {
  const { model, api } = await build();
  await pick(model, "c3");
  model.toggleStudent("c3", "s7", false);
  model.toggleStudent("c3", "s9", false);
  assert.deepEqual(model.plan().classes[0].studentIds, ["s6", "s8"]);
  assert.match(Assign.renderBody(model), /2명에게 출제 \(2명 제외\)/);
  await pick(model, "c2");
  model.toggleStudent("c2", "s4", false);
  model.toggleStudent("c2", "s5", false);
  assert.equal(model.plan().combos.length, 1, "학생이 0명인 반은 건에서 빠진다");
  model.selectAllStudents("c3");
  assert.equal(model.plan().classes[0].studentIds.length, 4);
  model.toggleStudent("c3", "s7", false);
  await model.start();
  assert.deepEqual(api.posts()[0].body.student_ids, ["s6", "s8", "s9"]);
  assert.equal(api.posts().length, 1);
});

test("'아직 안 본 학생만' 빠른 선택은 이미 응시한 학생을 빼고 student_ids에 반영된다", async () => {
  const api = makeApi({ submitted: new Set(["s6", "s8"]) });
  const { model } = await build({ api });
  await pick(model, "c3");
  model.toggleStudentList("c3");
  let html = Assign.renderBody(model);
  assert.match(html, /data-assign-action="students-unsubmitted"/);
  assert.match(html, /아직 안 본 학생만/);
  assert.match(html, /응시함/);
  assert.equal(model.unsubmittedCount(model.state.classes.find((c) => c.id === "c3")), 2);
  assert.equal(model.selectUnsubmitted("c3"), true);
  assert.deepEqual(model.plan().classes[0].studentIds, ["s7", "s9"]);
  html = Assign.renderBody(model);
  assert.match(html, /2명에게 출제 \(2명 제외\)/);
  assert.match(html, /students-unsubmitted"[^>]*aria-pressed="true"/);
  model.selectAllStudents("c3");
  assert.equal(model.plan().classes[0].studentIds.length, 4);
  model.selectUnsubmitted("c3");
  await model.start();
  assert.deepEqual(api.posts()[0].body.student_ids, ["s7", "s9"]);
});

test("모두 응시한 반은 '아직 안 본 학생만'이 비활성이고 '모두 응시했습니다'가 보인다", async () => {
  const { model } = await build({ api: makeApi({ submitted: new Set(["s4", "s5"]) }) });
  await pick(model, "c2");
  model.toggleStudentList("c2");
  const html = Assign.renderBody(model);
  assert.match(html, /students-unsubmitted"[^>]*disabled/);
  assert.match(html, /모두 응시했습니다/);
  assert.equal(model.selectUnsubmitted("c2"), false);
  assert.equal(model.plan().classes[0].studentIds.length, 2, "선택은 그대로 전체");
});

test("문제지가 여러 권이면 빠른 선택을 보이지 않는다(제출 여부는 한 시험 기준)", async () => {
  const { model } = await build({ papers: [paper(P1), paper(P2)], api: makeApi({ submitted: new Set(["s4"]) }) });
  await pick(model, "c2");
  model.toggleStudentList("c2");
  assert.doesNotMatch(Assign.renderBody(model), /students-unsubmitted|응시함/);
});

test("명단을 못 불러온 반은 빼고 진행할 수 있고, 학생 0명 반은 고를 수 없다", async () => {
  const { model, api } = await build({ api: makeApi({ rosterFail: new Set(["c2"]) }) });
  await pick(model, "c1");
  await pick(model, "c2");
  await pick(model, "c0");
  assert.equal(model.state.classes.find((c) => c.id === "c2").rosterState, "error");
  assert.equal(model.state.classes.find((c) => c.id === "c0").checked, false, "학생 0명 반은 자동으로 해제된다");
  await model.toggleClass("c0", true);
  assert.equal(model.state.classes.find((c) => c.id === "c0").checked, false);
  assert.equal(model.canSubmit(), true);
  const html = Assign.renderBody(model);
  assert.match(html, /학생 명단을 불러오지 못했습니다/);
  assert.match(html, /data-assign-action="roster-retry"/);
  assert.match(html, /재원 학생이 없어 출제할 수 없습니다/);
  assert.match(Assign.renderFoot(model), /명단을 못 불러온 반은 빼고 출제합니다: 고1 B반/);
  await model.start();
  assert.deepEqual(api.posts().map((c) => c.body.class_id), ["c1"]);
});

test("명단 다시 시도는 그 반만 다시 받는다", async () => {
  let fail = true;
  const api = makeApi();
  const inner = api.request;
  const request = async (route, opt) => { if (fail && route.includes("class_id=c2")) { fail = false; throw httpError(500, {}); } return inner(route, opt); };
  const model = Assign.createModel({ papers: [paper(P1)], request, uuid, now: () => NOW });
  await model.load();
  await pick(model, "c2");
  assert.equal(model.state.classes.find((c) => c.id === "c2").rosterState, "error");
  await model.retryRoster("c2");
  assert.equal(model.state.classes.find((c) => c.id === "c2").rosterState, "ready");
});

test("진행 중에는 닫을 수 없고 끝나면 닫을 수 있다", async () => {
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const post = async (call) => { await gate; return okAssignment(call); };
  const { model } = await build({ api: makeApi({ post }) });
  await pick(model, "c1");
  const running = model.start();
  await tick();
  assert.equal(model.isBusy(), true);
  const denied = model.requestClose();
  assert.equal(denied.allowed, false);
  assert.match(denied.message, /출제 중입니다\. 잠시만요/);
  assert.match(Assign.renderHead(model), /data-assign-action="close"[^>]*disabled/);
  assert.match(Assign.renderFoot(model), /출제 중…/);
  release();
  await running;
  assert.equal(model.isBusy(), false);
  assert.equal(model.requestClose().allowed, true);
});

test("서버가 준 문자열은 이스케이프해서 그린다", async () => {
  const evil = '<img src=x onerror="alert(1)">';
  const api = makeApi({
    classes: [{ id: "c1", name: evil, grade: "고1", teacher_name: evil }],
    roster: { c1: ["s1"] },
    post: () => { throw httpError(400, { error: `한글 오류 ${evil}` }); },
  });
  const { model } = await build({ papers: [paper(P1, { title: evil, library_display_name: evil })], api });
  await pick(model, "c1");
  const select = Assign.render(model);
  await model.start();
  const done = Assign.render(model);
  for (const html of [select.head, select.body, select.foot, done.head, done.body, done.foot])
    assert.doesNotMatch(html, /<img/i);
  assert.match(done.body, /&lt;img/);
  assert.doesNotMatch(done.body, /한글 오류/, "서버가 준 한글 문장도 알려진 문구가 아니면 일반 안내로 바꾼다");
  assert.match(done.body, /출제하지 못했습니다/);
});

test("H1: 이름을 바꾼 문제지는 화면에 바꾼 이름, 명단 요청(exam_title)에는 원래 제목을 쓴다", async () => {
  const renamed = paper(P1, { title: "원래 제목 문제지", library_display_name: "내가 바꾼 이름" });
  const { model, api } = await build({ papers: [renamed], api: makeApi({ submitted: new Set(["s1"]) }) });
  assert.equal(model.state.papers[0].title, "내가 바꾼 이름");
  assert.equal(model.state.papers[0].originalTitle, "원래 제목 문제지");
  assert.match(Assign.renderHead(model), /내가 바꾼 이름/);
  assert.doesNotMatch(Assign.renderHead(model), /원래 제목 문제지/);
  await pick(model, "c1");
  const rosterCall = api.calls.find((c) => c.route.startsWith("/class-exam-assignments/roster?"));
  assert.equal(new URLSearchParams(rosterCall.route.split("?")[1]).get("exam_title"), "원래 제목 문제지");
  model.toggleStudentList("c1");
  assert.match(Assign.renderBody(model), /아직 안 본 학생만/);
  // 날짜를 바꿔 다시 받을 때도 원래 제목
  await model.setDate("2026-11-09");
  const last = api.calls.filter((c) => c.route.startsWith("/class-exam-assignments/roster?")).at(-1);
  assert.equal(new URLSearchParams(last.route.split("?")[1]).get("exam_title"), "원래 제목 문제지");
});

test("H1: 원래 제목을 알 수 없으면 빠른 선택과 '응시함' 표시를 숨긴다", async () => {
  const { model } = await build({ papers: [{ id: P1, library_display_name: "이름만 있음", question_count: 10, grade: "고1" }], api: makeApi({ submitted: new Set(["s1"]) }) });
  assert.equal(model.state.papers[0].originalTitle, "");
  assert.equal(model.canCompareSubmitted(), false);
  await pick(model, "c1");
  model.toggleStudentList("c1");
  const html = Assign.renderBody(model);
  assert.doesNotMatch(html, /students-unsubmitted|응시함|아직 안 본/);
  assert.equal(model.selectUnsubmitted("c1"), false);
});

test("H1: 목록·묶음·상세 응답의 문제지 행은 모두 title(원래 제목)을 가진다", () => {
  const route = read("apmath", "worker-backup", "worker", "routes", "archive-saved-papers.js");
  // listRow가 list·save-batches·detail 세 경로의 공통 모양이다.
  const listRow = route.slice(route.indexOf("function listRow(row)"), route.indexOf("async function loadSavedPapersByBatch"));
  assert.match(listRow, /title: row\.title,/);
  assert.match(listRow, /library_display_name: row\.library_display_name \|\| row\.title/);
  assert.match(route, /\.\.\.listRow\(row\),\s*snapshot_hash/, "상세도 listRow를 펼친다");
  assert.match(route, /papers: rows\.map\(listRow\)/, "묶음도 listRow");
  assert.match(route, /papers: prior\.map\(listRow\)/);
});

test("H2: 출제 번호를 만들 수 없으면 아무것도 보내지 않고 잠금을 풀고 안내한다", async () => {
  for (const bad of [() => { throw new Error("no crypto"); }, () => "not-a-uuid", () => ""]) {
    const api = makeApi();
    const model = Assign.createModel({ papers: [paper(P1)], request: api.request, storage: memoryStorage(), uuid: bad, now: () => NOW });
    await model.load();
    await model.toggleClass("c1", true);
    assert.equal(await model.start(), false);
    assert.equal(api.posts().length, 0, "POST 0회");
    assert.equal(model.state.starting, false);
    assert.equal(model.state.working, false);
    assert.equal(model.state.phase, "select");
    assert.equal(model.isBusy(), false);
    assert.equal(model.requestClose().allowed, true);
    assert.match(Assign.renderFoot(model), /이 브라우저에서는 출제 번호를 만들 수 없습니다\. 브라우저를 최신으로 바꾸거나 관리자에게 알려 주세요\./);
    assert.equal(model.canSubmit(), true, "다시 누를 수 있다");
  }
});

test("H3: 이력이 비어 있어도 이번 접속에서 이 패널로 성공한 조합은 같은 날 이미 냈다고 경고한다", async () => {
  const sessionStore = memoryStorage();
  const doneStore = Assign.createDoneStore({ storage: sessionStore });
  const first = await build({ api: makeApi(), history: null });
  const m1 = Assign.createModel({ papers: [paper(P1)], request: first.api.request, storage: memoryStorage(), uuid, now: () => NOW, doneStore });
  await m1.load();
  await m1.toggleClass("c1", true);
  await m1.start();
  assert.equal(m1.state.jobs[0].status, "ok");
  assert.ok(sessionStore.getItem("archive2.assign.done.v1"), "sessionStorage에도 남긴다");
  // 패널을 다시 열면(메모리 기억) 이력이 없어도 경고
  const m2 = Assign.createModel({ papers: [paper(P1)], request: makeApi().request, storage: memoryStorage(), uuid, now: () => NOW, doneStore });
  await m2.load();
  assert.match(Assign.renderBody(m2), /11월 10일에 이미 냈습니다/);
  assert.ok(m2.dupInfo(P1, m2.state.classes.find((c) => c.id === "c1")).sameDate);
  // 새로고침(메모리 없음): sessionStorage만으로도
  const m3 = Assign.createModel({ papers: [paper(P1), paper(P2)], request: makeApi().request, storage: memoryStorage(), uuid, now: () => NOW, doneStore: Assign.createDoneStore({ storage: sessionStore }) });
  await m3.load();
  await m3.toggleClass("c1", true);
  assert.deepEqual(m3.plan().combos.map((c) => c.key), [`${P2}|c1`], "여러 권이면 방금 낸 (문제지, 반)은 기본으로 빠진다");
  // 다른 날짜는 '낸 적이 있다'만
  await m3.setDate("2026-11-11");
  assert.equal(m3.dupInfo(P1, m3.state.classes.find((c) => c.id === "c1")).sameDate, null);
  // sessionStorage가 막혀도 동작
  const broken = { getItem() { throw new Error("x"); }, setItem() { throw new Error("x"); } };
  const store = Assign.createDoneStore({ storage: broken });
  store.add(P1, "c1", "2026-11-10");
  assert.deepEqual(store.datesFor(P1, "c1"), ["2026-11-10"]);
});

test("옛 경로로 되돌리는 주소 스위치", () => {
  assert.equal(Assign.useLegacy("?view=saved&assign=legacy"), true);
  assert.equal(Assign.useLegacy("?view=saved"), false);
  assert.equal(Assign.useLegacy("?assign=new"), false);
  assert.equal(Assign.useLegacy(""), false);
});

// ---- 화면 제어(open): 가짜 DOM ------------------------------------------------------------------------------
function fakeDom() {
  const regions = {};
  const mk = (name) => regions[name] || (regions[name] = {
    innerHTML: "", scrollTop: 0,
    querySelector: (selector) => (selector === "#assign-title" ? title : null),
  });
  let focused = null;
  const title = { focus() { focused = "title"; } };
  const handlers = {};
  const dialog = {
    className: "", attrs: {}, removed: false, openCalls: 0, closed: false,
    setAttribute(k, v) { this.attrs[k] = v; },
    addEventListener(type, fn) { (handlers[type] ||= []).push(fn); },
    querySelector(selector) {
      const m = selector.match(/data-region="(\w+)"/);
      return m ? mk(m[1]) : null;
    },
    contains: () => false,
    showModal() { this.openCalls += 1; },
    close() { this.closed = true; },
    remove() { this.removed = true; },
    set innerHTML(v) { this._html = v; }, get innerHTML() { return this._html; },
  };
  const opener = { isConnected: true, focus() { focused = "opener"; } };
  const winHandlers = {};
  const history = { state: null, pushes: 0, backs: 0, pushState(s) { this.state = s; this.pushes += 1; }, back() { this.backs += 1; } };
  const win = {
    history, location: { href: "https://x.test/archive/workspace.html?view=saved" },
    addEventListener(type, fn) { (winHandlers[type] ||= []).push(fn); },
    removeEventListener(type, fn) { winHandlers[type] = (winHandlers[type] || []).filter((f) => f !== fn); },
    localStorage: memoryStorage(),
  };
  const doc = {
    defaultView: win, activeElement: opener, body: { appendChild() {} },
    createElement: () => dialog, getElementById: () => ({ focus() { focused = "content"; } }),
  };
  const fire = (type, event = {}) => { for (const fn of handlers[type] || []) fn(event); };
  return { doc, win, dialog, regions, fire, winHandlers, opener, history, focused: () => focused };
}
const clickOn = (action, extra = {}) => ({ target: { closest: () => ({ tagName: "BUTTON", disabled: false, dataset: { assignAction: action, ...extra } }) } });

test("패널 화면: 진행 중에는 Esc·바깥 누름·뒤로 가기·닫기 버튼이 모두 막히고 페이지 이탈 경고가 뜬다", async () => {
  Assign.handlePopState(); // 이전 테스트의 잔여 상태 없음
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  const api = makeApi({ post: async (call) => { await gate; return okAssignment(call); } });
  const dom = fakeDom();
  const done = [];
  const handle = Assign.open({ document: dom.doc, papers: [paper(P1)], request: api.request, uuid, now: () => NOW, storage: memoryStorage(), onDone: (r) => done.push(r) });
  assert.equal(Assign.isOpen(), true);
  assert.equal(dom.dialog.attrs.role, "dialog");
  assert.equal(dom.dialog.attrs["aria-modal"], "true");
  assert.equal(dom.dialog.openCalls, 1);
  assert.equal(dom.history.pushes, 1, "뒤로 가기용 항목을 하나 쌓는다");
  assert.equal(Assign.open({ document: dom.doc, papers: [paper(P1)], request: api.request }), handle, "이미 열려 있으면 새로 열지 않는다");
  await tick(); await tick();
  await handle.model.toggleClass("c1", true);
  assert.match(dom.regions.foot.innerHTML, /data-assign-action="submit"(?![^>]*disabled)/);
  dom.fire("click", clickOn("submit"));
  await tick();
  assert.equal(handle.isBusy(), true);
  assert.equal(dom.winHandlers.beforeunload.length, 1);
  const unload = { preventDefault() { this.prevented = true; }, returnValue: "" };
  dom.winHandlers.beforeunload[0](unload);
  assert.equal(unload.prevented, true);
  assert.match(unload.returnValue, /출제 중입니다/);
  // Esc
  const cancel = { preventDefault() { this.prevented = true; } };
  dom.fire("cancel", cancel);
  assert.equal(cancel.prevented, true);
  assert.equal(dom.dialog.removed, false);
  // 바깥 누름(dialog 자신이 target)
  dom.fire("click", { target: dom.dialog });
  assert.equal(dom.dialog.removed, false);
  // 닫기 버튼
  dom.fire("click", clickOn("close"));
  assert.equal(dom.dialog.removed, false);
  // 브라우저가 Esc 두 번째에 강제로 닫아 버린 경우: 다시 연다
  dom.fire("close");
  assert.equal(dom.dialog.openCalls, 2);
  // 뒤로 가기
  const pushesBefore = dom.history.pushes;
  assert.equal(Assign.handlePopState(), true);
  assert.equal(dom.history.pushes, pushesBefore + 1, "뒤로 가면 같은 자리를 다시 쌓아 머문다");
  assert.equal(dom.dialog.removed, false);
  assert.match(dom.regions.foot.innerHTML, /출제 중에는 닫을 수 없습니다/);
  release();
  await handle.model.state.jobs.length;
  for (let i = 0; i < 6; i += 1) await tick();
  assert.equal(handle.isBusy(), false);
  assert.equal(done.length, 1);
  // 끝난 뒤: 닫기 → 포커스 복귀, 쌓았던 항목 되돌리기
  dom.fire("click", clickOn("close"));
  assert.equal(dom.dialog.removed, true);
  assert.equal(dom.history.backs, 1);
  assert.equal(Assign.isOpen(), false);
  assert.equal(dom.focused(), "opener");
  assert.equal((dom.winHandlers.beforeunload || []).length, 0);
  assert.equal(Assign.handlePopState(), true, "우리가 일으킨 뒤로 가기는 workspace가 다시 그리지 않게 삼킨다");
  assert.equal(Assign.handlePopState(), false);
});

test("패널 화면: 출제할 문제지가 없으면 열지 않는다", () => {
  const dom = fakeDom();
  assert.throws(() => Assign.open({ document: dom.doc, papers: [], request: makeApi().request }), /출제할 저장한 시험지/);
  assert.equal(Assign.isOpen(), false);
});

test("패널 화면: 진행 중이 아니면 뒤로 가기는 패널만 닫는다", async () => {
  const dom = fakeDom();
  Assign.open({ document: dom.doc, papers: [paper(P1)], request: makeApi().request, uuid, now: () => NOW, storage: memoryStorage() });
  assert.equal(Assign.handlePopState(), true);
  assert.equal(dom.dialog.removed, true);
  assert.equal(dom.history.backs, 0, "이미 뒤로 갔으므로 또 되돌리지 않는다");
  assert.equal(Assign.isOpen(), false);
});

// ---- workspace·library 연결 ---------------------------------------------------------------------------------
function sliceBetween(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from);
  assert.ok(from >= 0 && to > from, `${start} .. ${end}`);
  return source.slice(from, to);
}
function workspaceDispatch({ search = "", papersFromApi = null, assign = true }) {
  const source = read("archive", "archive2-workspace.js");
  const code = sliceBetween(source, "function assignRequest(route, opt = {}) {", "function originalIssueBusy() {");
  const opened = [];
  const legacy = [];
  const requests = [];
  const refresh = [];
  const context = {
    state: { originalReceipts: [{ id: "stale" }] },
    location: { search },
    document: { activeElement: { id: "opener" } },
    window: {
      Archive2Assign: assign ? { open: (o) => opened.push(o), useLegacy: Assign.useLegacy, isOpen: () => false } : undefined,
      Archive2Library: { currentHistory: () => "HISTORY", refreshHistory: () => refresh.push(1) },
    },
    openSavedPaperIssue: (id) => legacy.push(id),
    teacherSessionOk: () => true,
    api: async (route, body, method, options) => { requests.push({ route, body, method, options }); if (papersFromApi) return papersFromApi; return {}; },
  };
  vm.runInNewContext(code + "\nthis.openSavedPaperAssign = openSavedPaperAssign; this.assignRequest = assignRequest;", context);
  return { context, opened, legacy, requests, refresh };
}
test("workspace: 저장본 출제는 패널을 열고 assign=legacy면 옛 iframe 모달로 간다", async () => {
  let h = workspaceDispatch({ search: "?view=saved&assign=legacy" });
  await h.context.openSavedPaperAssign(P1, { papers: [paper(P1)] });
  assert.equal(JSON.stringify(h.legacy), JSON.stringify([P1]));
  assert.equal(h.opened.length, 0);
  h = workspaceDispatch({ search: "?view=saved", assign: false });
  await h.context.openSavedPaperAssign(P1);
  assert.equal(JSON.stringify(h.legacy), JSON.stringify([P1]), "패널 스크립트가 없으면 옛 경로");
  h = workspaceDispatch({ search: "?view=saved" });
  await h.context.openSavedPaperAssign(P1, { papers: [paper(P1)] });
  assert.equal(h.legacy.length, 0);
  assert.equal(h.opened.length, 1);
  assert.equal(h.opened[0].papers[0].id, P1);
  assert.equal(h.opened[0].history, "HISTORY");
  assert.equal(h.opened[0].opener.id, "opener");
  assert.equal(h.context.state.originalReceipts.length, 0);
  h.opened[0].onDone({ succeeded: 1 });
  assert.equal(h.refresh.length, 1, "출제가 끝나면 보관함 이력을 새로 고친다");
  await assert.rejects(() => h.context.openSavedPaperAssign(""), /출제할 저장한 시험지/);
});
test("workspace: 목록 정보가 없으면(문제지 만들기 저장 뒤) 한 권을 서버에서 읽어 열고, 휴지통이면 막는다", async () => {
  let h = workspaceDispatch({ papersFromApi: { paper: paper(P2) } });
  await h.context.openSavedPaperAssign(P2);
  assert.equal(h.requests[0].route, "/archive-saved-papers/" + P2);
  assert.equal(h.opened[0].papers[0].id, P2);
  h = workspaceDispatch({ papersFromApi: { paper: { ...paper(P2), library_status: "TRASHED" } } });
  await assert.rejects(() => h.context.openSavedPaperAssign(P2), /휴지통/);
  assert.equal(h.opened.length, 0);
});
test("workspace: 패널 요청은 로그인이 없으면 401로 알리고, 헤더·제한 시간을 api()에 넘긴다", async () => {
  const h = workspaceDispatch({});
  await h.context.assignRequest("/class-exam-assignments", { method: "POST", body: { a: 1 }, headers: { "X-Archive2-Contract": "archive2-v1" }, timeoutMs: 150000 });
  assert.equal(JSON.stringify(h.requests[0]), JSON.stringify({ route: "/class-exam-assignments", body: { a: 1 }, method: "POST", options: { headers: { "X-Archive2-Contract": "archive2-v1" }, timeoutMs: 150000 } }));
  h.context.teacherSessionOk = () => false;
  await assert.rejects(() => h.context.assignRequest("/qr-classes"), (error) => error.status === 401);
  const workspace = read("archive", "archive2-workspace.js");
  assert.match(workspace, /if \(window\.Archive2Assign\?\.handlePopState\?\.\(\)\) return;/);
  assert.match(workspace, /else if \(a === "saved-paper-issue"\) await openSavedPaperAssign\(b\.dataset\.paperId\);/);
  assert.match(workspace, /window\.Archive2WorkspaceSavedPaperIssue = openSavedPaperAssign;/);
  assert.match(workspace, /options\.timeoutMs\) && options\.timeoutMs > 0/);
});

test("library: 줄의 반에 출제는 문제지 정보와 이력을 넘기고, 묶음은 더보기에서 모든 권을 넘긴다", async () => {
  const LIB = require.resolve("../archive/archive2-library.js");
  delete require.cache[LIB];
  const library = require(LIB);
  const opened = [];
  const requests = [];
  const parts = [
    { id: P1, title: "묶음 1권", library_status: "ACTIVE", part_index: 0, part_count: 3, save_batch_id: "b1", question_count: 50, grade: "고1" },
    { id: P2, title: "묶음 2권", library_status: "ACTIVE", part_index: 1, part_count: 3, save_batch_id: "b1", question_count: 50, grade: "고1" },
    { id: "00000000-0000-4000-8000-000000000003", title: "묶음 3권", library_status: "TRASHED", part_index: 2, part_count: 3, save_batch_id: "b1", question_count: 20, grade: "고1" },
  ];
  const single = { id: "00000000-0000-4000-8000-000000000009", title: "한 권", library_status: "ACTIVE", part_index: 0, part_count: 1, save_batch_id: "b9", question_count: 10, grade: "고1" };
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  global.window = global;
  global.location = { href: "https://x.test/archive/workspace.html?view=saved" };
  global.history = { state: null, replaceState() {} };
  global.document = { getElementById: () => null, addEventListener() {}, querySelectorAll: () => [] };
  global.scrollY = 0; global.scrollTo = () => {};
  global.Archive2Api = { request: async (route) => {
    requests.push(route);
    if (route.startsWith("/archive-saved-papers?")) return { papers: [parts[0], single], next_cursor: null };
    if (route === "/archive-saved-papers/save-batches/b1") return { success: true, papers: parts };
    if (route.startsWith("/class-exam-assignments/recent-summary")) return { assignments: [{ id: "i1", saved_paper_id: P1, class_id: "c1", class_name: "고1 A반", exam_date: "2026-11-10", recipient_count: 3, submitted_count: 0 }] };
    throw new Error("unexpected " + route);
  } };
  global.Archive2WorkspaceSavedPaperIssue = async (id, options) => opened.push({ id, options });
  try {
    const host = { innerHTML: "", prepend() {}, querySelectorAll: () => [], onclick: null };
    await library.render(host, "", "ACTIVE");
    await tick(); await tick();
    assert.match(host.innerHTML, /data-library-action="distribute-batch" data-paper-id="00000000-0000-4000-8000-000000000001">이 묶음 3권 모두 출제/);
    assert.equal((host.innerHTML.match(/distribute-batch/g) || []).length, 1, "한 권짜리에는 묶음 메뉴가 없다");
    const press = (action, paperId) => host.onclick({ target: { closest: (s) => (s === "[data-library-action]" ? { dataset: { libraryAction: action, paperId }, disabled: false } : null) }, preventDefault() {}, stopPropagation() {} });
    await press("distribute", P1);
    assert.equal(opened[0].id, P1);
    assert.deepEqual(opened[0].options.papers.map((p) => p.id), [P1]);
    assert.equal(opened[0].options.history?.byPaper?.get(P1)?.[0]?.classId, "c1", "이력에 반 id가 들어 있다");
    await press("distribute-batch", P1);
    assert.equal(opened[1].id, P1);
    assert.deepEqual(opened[1].options.papers.map((p) => p.id), [P1, P2], "휴지통에 있는 권은 뺀다");
    assert.ok(requests.includes("/archive-saved-papers/save-batches/b1"));
    assert.equal(typeof library.currentHistory, "function");
  } finally {
    delete global.Archive2WorkspaceSavedPaperIssue; delete global.Archive2Api;
    Object.assign(global, previous);
    if (previous.window === undefined) delete global.window;
    if (previous.location === undefined) delete global.location;
    if (previous.history === undefined) delete global.history;
    if (previous.document === undefined) delete global.document;
  }
});

test("배포 꾸러미와 workspace.html에 새 파일이 같은 버전으로 올라 있다", () => {
  const manifest = JSON.parse(read("tools", "archive-pages-release-manifest.json"));
  assert.ok(manifest.archiveRootFiles.includes("archive2-assign.js"));
  assert.ok(manifest.archiveRootFiles.includes("archive2-assign.css"));
  const html = read("archive", "workspace.html");
  assert.match(html, /archive2-assign\.css\?v=20261110-assign-1/);
  assert.match(html, /archive2-assign\.js\?v=20261110-assign-1/);
  assert.ok(html.indexOf("archive2-assign.js") < html.indexOf("archive2-library.js"), "패널은 보관함보다 먼저 올라온다");
  for (const file of ["archive2-assign.js", "archive2-assign.css"]) assert.ok(fs.existsSync(path.join(root, "archive", file)));
  const css = read("archive", "archive2-assign.css");
  assert.doesNotMatch(css, /#[0-9a-fA-F]{6}\b/, "새 색 숫자를 쓰지 않는다(토큰만)");
});
