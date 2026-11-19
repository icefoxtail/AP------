// 시험지 보관함(assessment-mvp.html)의 "AP 제출 QR 시험지 출력"(출제)이 Archive 2.0 출제 패널로 나간다(2026-11-19).
// 화면의 실제 스크립트를 가짜 브라우저(vm)에 올리고, 패널 쪽은 실제 archive2-assign.js 상태 기계를 가짜 서버에 물려 동작으로 확인한다.
// 운영 서버·운영 개수는 쓰지 않는다. 옛 모달 길(?assign=legacy)과 평가 전달 자료 정리(#2565)가 그대로인지도 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Assign = require('../archive/archive2-assign.js');

const html = fs.readFileSync(path.join(__dirname, '..', 'archive', 'assessment', 'assessment-mvp.html'), 'utf8');
const coreSource = fs.readFileSync(path.join(__dirname, '..', 'archive', 'assessment', 'assessment-pack-core.js'), 'utf8');
const script = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).sort((a, b) => b.length - a.length)[0];

const PACK = {
  id: 'UNIT_1SEM_H2_02_25', title: '고2 1학기 평가', category: '단원평가', grade: '고11', scopeLabel: '범위',
  questions: [
    { id: 1, content: 'q1', _sourceFile: 'original/original/a.js', _sourceQuestionNo: 1 },
    { id: 2, content: 'q2', _sourceFile: 'original/original/a.js', _sourceQuestionNo: 2 },
  ],
};
const CLASSES = [
  { id: 'c1', name: '고2 A반', grade: '고2', teacher_name: '김선생' },
  { id: 'c2', name: '고2 B반', grade: '고2', teacher_name: '김선생' },
];
const tick = () => new Promise((resolve) => setImmediate(resolve));

function makeStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    map,
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem(k, v) { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
    key: (i) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
}

function makeNode() {
  const classes = new Set();
  const el = {
    style: {}, dataset: {}, children: [], textContent: '', innerHTML: '', value: '', options: [],
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c), toggle() {}, contains: (c) => classes.has(c) },
    setAttribute() {}, addEventListener() {}, appendChild(child) { el.children.push(child); return child; }, append() {}, remove() {}, focus() {},
    querySelector: () => null, querySelectorAll: () => [], closest: () => null,
  };
  return el;
}

// 가짜 서버: 헤더 없는 POST /class-exam-assignments는 같은 (반, 날짜, archive_file)이면 같은 건을 돌려준다(서버가 하는 대로).
function makeServer() {
  const calls = [];
  const rows = new Map();
  let created = 0;
  const server = { failPost: null };
  async function fetchImpl(url, init = {}) {
    const route = String(url).replace('https://api.test/api', '');
    const method = init.method || 'GET';
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ route, method, headers: init.headers, body });
    const ok = (data) => ({ ok: true, status: 200, json: async () => data });
    if (route === '/qr-classes') return ok({ success: true, classes: CLASSES });
    if (route.startsWith('/class-exam-assignments/roster?')) return ok({ success: true, students: [{ id: 's1', name: '학생1' }, { id: 's2', name: '학생2' }] });
    if (route.startsWith('/class-exam-assignments/recent-summary?')) {
      return ok({ success: true, assignments: [...rows.values()].map((r) => ({ id: r.id, class_id: r.class_id, class_name: r.class_id, exam_date: r.exam_date, archive_file: r.archive_file, saved_paper_id: null })) });
    }
    if (route === '/class-exam-assignments' && method === 'POST') {
      if (server.failPost) return server.failPost();
      const key = JSON.stringify([body.class_id, body.exam_date, body.archive_file]);
      if (!rows.has(key)) {
        created += 1;
        rows.set(key, { id: `a${created}`, class_id: body.class_id, exam_date: body.exam_date, archive_file: body.archive_file, exam_title: body.exam_title, pdf_status: 'ready', created_at: new Date().toISOString().replace('T', ' ').slice(0, 19) });
      }
      return ok({ success: true, assignment: rows.get(key) });
    }
    return { ok: false, status: 404, json: async () => ({ error: 'no route ' + route }) };
  }
  return Object.assign(server, { fetchImpl, calls, rows, posts: () => calls.filter((c) => c.route === '/class-exam-assignments' && c.method === 'POST') });
}

function boot({ storage = makeStorage(), search = '', server = makeServer(), withPanel = true } = {}) {
  const opened = [];
  const wins = [];
  const panelOpens = [];
  const nodes = new Map();
  const getNode = (id) => { if (!nodes.has(id)) nodes.set(id, makeNode()); return nodes.get(id); };
  const makeWin = () => { const w = { closed: false, location: { replaceCalls: [], replace(u) { w.location.replaceCalls.push(u); } }, document: { title: '', body: { style: {}, textContent: '' } }, close() { w.closed = true; } }; wins.push(w); return w; };
  const document = {
    getElementById: getNode, querySelector: () => makeNode(), querySelectorAll: () => [], createElement: () => makeNode(), body: makeNode(), title: '', addEventListener() {},
  };
  storage.map.set('APMATH_SESSION', JSON.stringify({ login_id: 't', session_token: 'tok', expires_at: '2999-01-01T00:00:00Z' }));
  const sandbox = {
    document, localStorage: storage, history: { replaceState() {} }, console: { ...console, warn() {}, error() {}, log() {} },
    URL, URLSearchParams, Date, JSON, Math, Promise, setTimeout, clearTimeout, AbortController, encodeURIComponent, decodeURIComponent, escape, unescape,
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'), atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    fetch: server.fetchImpl, alert() {}, addEventListener() {}, APMATH_API_BASE: 'https://api.test/api',
  };
  sandbox.window = sandbox;
  sandbox.location = { search, hash: '', href: 'https://example.test/archive/assessment/assessment-mvp.html' + search, pathname: '/archive/assessment/assessment-mvp.html' };
  sandbox.APMATH_ASSESSMENT_PACKS_1SEM = { packs: [PACK], categoryOrder: ['단원평가'], sourceSummary: {} };
  sandbox.open = (url) => { opened.push(String(url)); return makeWin(); };
  if (withPanel) {
    let active = null;
    sandbox.Archive2Assign = {
      useLegacy: Assign.useLegacy,
      handlePopState: () => false,
      isOpen: () => Boolean(active),
      // 실제 open()은 DOM 위에 같은 상태 기계(createModel)를 올린다: 여기서는 DOM 없이 같은 모델을 만든다.
      open(options) {
        panelOpens.push(options);
        const model = Assign.createModel({ request: options.request, items: options.items, unit: options.unit, storage: makeStorage(), onClose: options.onClose });
        model.state.outputLinks = options.outputLinks !== false;
        model.state.jobActions = typeof options.jobActions === 'function' ? options.jobActions : null;
        const handle = { model, close() { active = null; options.onClose && options.onClose(); } };
        active = handle;
        model.load();
        return handle;
      },
    };
  }
  vm.createContext(sandbox);
  vm.runInContext(coreSource, sandbox, { filename: 'assessment-pack-core.js' });
  vm.runInContext(script, sandbox, { filename: 'assessment-mvp.inline.js' });
  return { sandbox, opened, wins, panelOpens, nodes, server, storage, getNode };
}
const call = (ctx, expr) => vm.runInContext(expr, ctx.sandbox);
const urlOf = (win) => new URL(win.location.replaceCalls.at(-1));

test('출제(제출 QR)는 출제 패널을 열고, 쪽당 문항·출제 대상 모달은 거치지 않는다', () => {
  const ctx = boot();
  call(ctx, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
  assert.equal(ctx.panelOpens.length, 1, '패널이 한 번 열렸다');
  const [options] = ctx.panelOpens;
  assert.equal(options.items.length, 1);
  assert.equal(options.items[0].kind, 'unit');
  assert.equal(options.items[0].identityTitle, PACK.title, '서버가 응시 여부를 가르는 제목은 옛 모달과 같은 팩 제목');
  assert.equal(options.items[0].count, PACK.questions.length);
  assert.equal(options.items[0].grade, '고2', "팩 번호의 학년(pack.grade '고11'이 아니라 반 학년과 맞는 값)");
  assert.equal(ctx.getNode('assessmentQppModal').classList.contains('open'), false, '쪽당 문항 모달은 열리지 않는다(패널 안에 있다)');
  assert.equal(ctx.getNode('assessmentTargetModal').classList.contains('open'), false);
  assert.equal(ctx.getNode('assessmentClassModalOverlay').classList.contains('open'), false);
});

test('일반 시험지 출력(QR 없음)은 옛 길 그대로 쪽당 문항 모달로 간다', () => {
  const ctx = boot();
  call(ctx, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(false);');
  assert.equal(ctx.panelOpens.length, 0);
  assert.equal(ctx.getNode('assessmentQppModal').classList.contains('open'), true);
});

test('주소에 assign=legacy가 있거나 패널 스크립트가 없으면 옛 출제 모달 길로 간다', () => {
  for (const [label, opts] of [['assign=legacy', { search: '?assign=legacy' }], ['패널 스크립트 없음', { withPanel: false }]]) {
    const ctx = boot(opts);
    call(ctx, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
    assert.equal(ctx.panelOpens.length, 0, label);
    assert.equal(ctx.getNode('assessmentQppModal').classList.contains('open'), true, `${label}: 옛 쪽당 문항 모달`);
  }
});

test('패널이 보내는 본문: 같은 서버 경로·옛 모달과 같은 MIXED 본문에 pack_id·pack_hash, 계약 헤더 없음', async () => {
  const ctx = boot();
  call(ctx, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
  const handleModel = call(ctx, 'assessmentPackCore.panelContext().handle.model');
  await tick(); await tick();
  assert.equal(handleModel.state.phase, 'select', '반 목록을 받았다');
  await handleModel.toggleClass('c1', true);
  await handleModel.start();
  const [post] = ctx.server.posts();
  assert.ok(post, 'POST가 나갔다');
  assert.equal(post.headers['X-Archive2-Contract'], undefined, '계약 헤더가 없다(헤더 없는 옛 경로)');
  assert.equal(post.headers.Authorization, 'Bearer tok', '이 브라우저의 교사 로그인으로 보낸다');
  const key = call(ctx, 'AssessmentPackCore.assignKey(packs[0])');
  assert.match(key, /^assessment_UNIT_1SEM_H2_02_25_fnv1a_[0-9a-f]{8}$/);
  assert.equal(post.body.archive_file, `MIXED:${key}`);
  assert.equal(post.body.source_type, 'mixed');
  assert.equal(post.body.exam_title, PACK.title);
  assert.equal(post.body.class_id, 'c1');
  assert.equal(post.body.question_count, PACK.questions.length);
  assert.equal(post.body.pack_id, PACK.id);
  assert.equal(post.body.pack_hash, call(ctx, 'buildAssessmentPackHash(packs[0])'));
  assert.equal(post.body.grade_label, '고2', '반 학년');
  assert.equal(post.body.target_scope, 'class');
  assert.equal(post.body.pdf_qpp, 4);
  const payload = JSON.parse(post.body.mixed_payload_json);
  assert.equal(payload.questions.length, PACK.questions.length);
  assert.equal(payload.questions[0]._sourceFile, 'original/original/a.js', '문항은 팩 그대로(원본 경로 포함)');
  assert.equal(payload.meta.packId, PACK.id);
  assert.equal(payload.meta.customTitle, PACK.title);
  assert.equal(payload.meta.qpp, 4, '쪽당 문항은 패널에서 고른 값');
  assert.equal(handleModel.state.jobs[0].status, 'ok');
});

test('같은 팩을 같은 반에 다시 내면 같은 키로 나가고, 패널이 이미 낸 건으로 알려 준다', async () => {
  const server = makeServer();
  const first = boot({ server });
  call(first, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
  const m1 = call(first, 'assessmentPackCore.panelContext().handle.model');
  await tick(); await tick();
  await m1.toggleClass('c1', true);
  await m1.start();
  const second = boot({ server });
  call(second, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
  const m2 = call(second, 'assessmentPackCore.panelContext().handle.model');
  await tick(); await tick();
  await m2.loadOriginalHistory();
  const cls = m2.state.classes.find((c) => c.id === 'c1');
  assert.ok(m2.dupInfo(m2.state.papers[0].id, cls).sameDate, '같은 날 이미 낸 건으로 보인다');
  await m2.toggleClass('c1', true);
  await m2.start();
  const posts = server.posts();
  assert.equal(posts.length, 2);
  assert.equal(posts[0].body.archive_file, posts[1].body.archive_file, '두 번 모두 같은 MIXED 키');
  assert.equal(server.rows.size, 1, '서버에는 한 건만 있다');
});

test('출제된 건의 시험지 단추는 같은 키·반 연결·등록 끝남 표시로 QR 시험지를 연다(엔진이 다시 등록하지 않는다)', async () => {
  const ctx = boot();
  call(ctx, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
  const model = call(ctx, 'assessmentPackCore.panelContext().handle.model');
  await tick(); await tick();
  await model.toggleClass('c2', true);
  await model.start();
  const job = model.state.jobs[0];
  assert.equal(job.status, 'ok');
  assert.match(Assign.render(model).body, /data-action="assignment-output-direct"/, '결과 줄에 시험지·해설·정답 단추가 있다');
  call(ctx, `assessmentPackCore.openAssignedOutput(${JSON.stringify(job.assignmentId)}, "exam")`);
  assert.equal(ctx.opened.length, 1, '클릭 순간 창이 열린다');
  await tick(); await tick();
  const url = urlOf(ctx.wins[0]);
  const key = call(ctx, 'AssessmentPackCore.assignKey(packs[0])');
  assert.ok(url.pathname.endsWith('/mixed_engine.html'));
  assert.equal(url.searchParams.get('key'), key, '등록한 MIXED 키와 같은 키');
  assert.equal(url.searchParams.get('mode'), 'exam');
  assert.equal(url.searchParams.get('submitQr'), '1');
  assert.equal(url.searchParams.get('class'), 'c2');
  assert.equal(url.searchParams.get('className'), '고2 B반');
  assert.equal(url.searchParams.get('assignmentRegistered'), '1');
  assert.equal(url.searchParams.get('preRegistered'), '1');
  assert.equal(url.searchParams.get('date'), job.date, '패널에서 고른 출제일');
  assert.equal(url.searchParams.get('packId'), PACK.id, '저장 자료가 정리돼도 팩 번호로 열린다');
  assert.ok(ctx.storage.getItem('mixedQuestions_' + key), '엔진에 넘길 자료를 저장했다');
  assert.equal(ctx.server.posts().length, 1, '열기만으로는 서버에 다시 등록하지 않는다');

  call(ctx, `assessmentPackCore.openAssignedOutput(${JSON.stringify(job.assignmentId)}, "sol")`);
  await tick(); await tick();
  const sol = urlOf(ctx.wins[1]);
  assert.equal(sol.searchParams.get('mode'), 'sol');
  assert.equal(sol.searchParams.get('submitQr'), null);
});

test('출제가 안 된 반의 줄에는 시험지를 QR 없이 여는 단추가 있고, 열면 반 연결·제출 QR 없이 열린다(#2565와 같은 규칙)', async () => {
  for (const [label, failPost] of [
    ['서버 오류', () => ({ ok: false, status: 500, json: async () => ({ error: 'boom' }) })],
    ['로그인 만료', () => ({ ok: false, status: 401, json: async () => ({}) })],
    ['연결 실패', () => { throw new TypeError('Failed to fetch'); }],
  ]) {
    const server = makeServer();
    server.failPost = failPost;
    const ctx = boot({ server });
    call(ctx, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
    const model = call(ctx, 'assessmentPackCore.panelContext().handle.model');
    await tick(); await tick();
    await model.toggleClass('c1', true);
    await model.start().catch(() => {});
    const job = model.state.jobs[0];
    assert.ok(['failed', 'unknown'].includes(job.status), `${label}: 출제가 안 됐다 (${job.status})`);
    assert.match(Assign.render(model).body, /data-host-action="plain-paper"[^>]*>QR 없이 시험지 열기/, `${label}: 줄에 단추`);
    assert.doesNotMatch(Assign.render(model).body, /assignment-output-direct/, `${label}: QR 시험지 단추는 없다`);
    call(ctx, 'assessmentPackCore.openPlainPaper()');
    assert.equal(ctx.opened.length, 1, `${label}: 클릭 순간 창이 열린다`);
    await tick(); await tick();
    const url = urlOf(ctx.wins[0]);
    assert.equal(url.searchParams.get('submitQr'), '0', `${label}: 제출 QR을 찍지 않는다`);
    assert.equal(url.searchParams.get('class'), null, label);
    assert.equal(url.searchParams.get('assignmentRegistered'), null, label);
    assert.equal(url.searchParams.get('mode'), 'exam');
    assert.equal(url.searchParams.get('key'), call(ctx, 'AssessmentPackCore.assignKey(packs[0])'));
    assert.equal(url.searchParams.get('packId'), PACK.id, label);
  }
  // 출제된 줄(ok)에는 그 단추가 없다.
  const okCtx = boot();
  call(okCtx, 'openAssessmentPrintModeModal(packs[0]); selectAssessmentPrintMode(true);');
  const okModel = call(okCtx, 'assessmentPackCore.panelContext().handle.model');
  await tick(); await tick();
  await okModel.toggleClass('c1', true);
  await okModel.start();
  assert.doesNotMatch(Assign.render(okModel).body, /data-host-action/);
});

test('고정 키 자료도 평가 전달 자료 정리(#2565)가 최근 순으로 정리하고, 다른 키는 건드리지 않는다', () => {
  const seed = { other_app_key: 'z'.repeat(50), mixedQuestions_mix_unrelated: 'keep', mixedMeta_mix_unrelated: 'keep' };
  for (let i = 0; i < 9; i += 1) {
    seed[`mixedQuestions_assessment_P${i}_fnv1a_0000000${i}`] = 'q';
    seed[`mixedMeta_assessment_P${i}_fnv1a_0000000${i}`] = JSON.stringify({ generatedAt: new Date(Date.UTC(2026, 10, 1 + i)).toISOString() });
  }
  seed.mixedQuestions_assessment_OLD_1700000000000 = 'q';
  seed.mixedMeta_assessment_OLD_1700000000000 = 'm';
  const ctx = boot({ storage: makeStorage(seed) });
  call(ctx, 'pruneAssessmentSnapshots(3)'); // 화면을 열 때도 한 번 정리되므로, 여기서는 남길 개수만 다시 확인한다.
  const left = [...ctx.storage.map.keys()].filter((k) => k.startsWith('mixedQuestions_assessment_'));
  assert.equal(left.length, 3, '최근 3개만 남는다');
  assert.ok(left.includes('mixedQuestions_assessment_P8_fnv1a_00000008') && left.includes('mixedQuestions_assessment_P7_fnv1a_00000007'), '고정 키는 meta.generatedAt이 가장 최근인 것부터 남는다');
  assert.equal(ctx.storage.getItem('other_app_key'), 'z'.repeat(50));
  assert.equal(ctx.storage.getItem('mixedQuestions_mix_unrelated'), 'keep', 'mix_ 키는 건드리지 않는다');
  assert.equal(ctx.storage.getItem('APMATH_SESSION') !== null, true, '로그인 세션은 건드리지 않는다');
});
