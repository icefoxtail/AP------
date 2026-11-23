// 학교 모의고사 "보관함에 저장": 문제지 만들기의 저장 함수(savePapers)를 그대로 불러 같은 요청 본문으로 보내고, 회차 이름·세 벌 한 요청·중복 없음·
// 로그인 전·저장 실패 뒤 다시 누르기를 본다. 서버는 이 파일 안의 가짜(fetch 대역)다: 운영 API·D1에는 가지 않는다.
// 로컬 Miniflare 왕복 하네스(tests/archive2-save-roundtrip.e2e.mjs)는 이 PC에 의존 패키지(node_modules)가 없어 돌리지 못했다(NOT_RUN).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const D = require('../archive/archive2-derive.js');
const core = require('../archive/archive2-core.js');
const Unified = require('../archive/archive2-unified-units.js');
const Quick = require('../archive/archive2-quick-pools.js');
const Tree = require('../archive/archive2-unit-tree.js');
const archiveSource = require('../archive/archive2-source.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace } = require('./helpers/archive2-workspace-source.cjs');

const root = path.resolve(__dirname, '..');
Tree.setGroups(JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-subunit-groups.json'), 'utf8')));
const plain = v => JSON.parse(JSON.stringify(v));
const catalogBase = withTestAssignments(structuredClone(catalog));

function workerFilterKeys() {
  const text = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/helpers/archive-saved-papers.js'), 'utf8');
  const body = /const FILTER_KEYS = new Set\(\[([\s\S]*?)\]\)/.exec(text);
  return new Set([...body[1].matchAll(/"([^"]+)"/g)].map(match => match[1]));
}

// 가짜 서버: 저장(POST, save_batch_id 멱등), 목록(GET ?q&status), 삭제(휴지통).
function fakeServer() {
  const server = { papers: [], batches: new Map(), posts: [], failNext: 0, gets: 0 };
  const keys = workerFilterKeys();
  const respond = (status, data) => ({ ok: status < 400, status, json: async () => data });
  server.fetch = async (url, init = {}) => {
    const route = String(url).replace(/^.*\/api/, '');
    const method = (init.method || 'GET').toUpperCase();
    if (method === 'POST' && route === '/archive-saved-papers') {
      const body = JSON.parse(init.body);
      server.posts.push(body);
      if (server.failNext) { const code = server.failNext; server.failNext = 0; return respond(code, { success: false, error: 'x' }); }
      if (server.batches.has(body.save_batch_id)) return respond(200, { success: true, saved: true, papers: server.batches.get(body.save_batch_id).map(p => ({ id: p.id })) });
      assert.ok(body.papers.length >= 1 && body.papers.length <= 8, 'a request holds 1..8 papers');
      assert.deepEqual(Object.keys(body.selection_filters).filter(key => !keys.has(key)), [], 'only keys the server knows');
      const allowed = new Set(body.selection_filters.scopeQuestionUids);
      const rows = body.papers.map((paper, i) => {
        assert.equal(paper.part_index, i);
        assert.ok(paper.questions.every(q => allowed.has(q.questionUid)), 'every question is inside the saved range');
        return { id: crypto.randomUUID(), title: paper.meta.title, library_status: 'ACTIVE', question_count: paper.questions.length, save_batch_id: body.save_batch_id };
      });
      server.papers.push(...rows);
      server.batches.set(body.save_batch_id, rows);
      return respond(200, { success: true, saved: true, papers: rows.map(p => ({ id: p.id })) });
    }
    if (method === 'GET' && route.startsWith('/archive-saved-papers?')) {
      server.gets += 1;
      const params = new URL('https://x' + route).searchParams;
      const q = params.get('q') || '', status = params.get('status') || 'ACTIVE';
      return respond(200, { success: true, papers: server.papers.filter(p => p.library_status === status && p.title.includes(q)), next_cursor: null });
    }
    return respond(404, { success: false, error: 'not found ' + route });
  };
  return server;
}

function harness(server, options = {}) {
  const storage = new Map(options.session === false ? [] : [['APMATH_SESSION', JSON.stringify({ id: 'teacher-test', session_token: 'test-token' })]]);
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: '', textContent: '', dataset: {}, setAttribute() {}, addEventListener() {}, querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {}, focus() {} });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    console: { ...console, log() {} }, crypto, URL, URLSearchParams, structuredClone, queueMicrotask: () => {},
    location: new URL('https://archive.test/archive/workspace.html'), history: { pushState() {}, replaceState() {} }, scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    open: () => ({ document: { body: { textContent: '' } }, location: { replace() {} }, close() {} }),
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
    document: { baseURI: 'https://archive.test/archive/workspace.html', getElementById: node, querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} }, addEventListener() {} },
    addEventListener() {}, fetch: server.fetch,
    Archive2Core: core, Archive2UnifiedUnits: Unified, Archive2QuickPools: Quick, Archive2UnitTree: Tree, Archive2Derive: D,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'), Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'), Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: { ...archiveSource, restore: async records => records.map(r => ({ questionUid: r.questionUid, answer: '①', choices: ['1', '2', '3', '4', '5'], solution: '해설' })) },
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    render = () => {}; save = () => {};
    globalThis.workspaceTest = { state, request };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = catalogBase;
  w.state.byUid = new Map(catalogBase.records.map(r => [r.questionUid, r]));
  w.state.finderIndex = core.buildFinderIndex(catalogBase);
  w.state.indexVersion = catalogBase.indexVersion;
  const api = ctx.Archive2Workspace.api, V = ctx.Archive2Workspace.v;
  return { w, ctx, api, V, body: () => ctx.document.getElementById('modal-body').innerHTML, storage };
}
function pickBaseExam() {
  const counts = new Map();
  for (const r of catalogBase.records) if (/^original\/high\/h1\//.test(r.sourceFile)) counts.set(r.sourceFile, (counts.get(r.sourceFile) || 0) + 1);
  const file = [...counts.entries()].filter(([, n]) => n >= 16).sort((a, b) => b[0].localeCompare(a[0]))[0][0];
  return catalogBase.exams.find(e => e.file === file);
}
const act = (H, name, level) => H.api.deriveAction(name, { dataset: { level } });

test('한 벌 저장: 회차 이름 · 같은 저장 함수의 요청 본문 · 같은 결과를 또 눌러도 한 번만 · 지운 번호는 메우지 않는다', async () => {
  const server = fakeServer();
  const exam = pickBaseExam();
  const H = harness(server);
  H.api.startMockForExam(exam);
  await act(H, 'derive-mock-level', 'same');
  assert.match(H.body(), /data-action="derive-mock-save"/, '주 단추는 보관함에 저장');
  assert.match(H.body(), /문항 바꾸기/, '고쳐 쓰는 길은 보조 링크');
  assert.doesNotMatch(H.body(), />문제지 만들기에서 이어서</);
  await act(H, 'derive-mock-save');
  assert.equal(server.posts.length, 1);
  const body = server.posts[0];
  assert.deepEqual(Object.keys(body).sort(), ['include_extended', 'index_version', 'papers', 'save_batch_id', 'schema_version', 'selection_filters']);
  assert.equal(body.schema_version, 'archive-saved-paper-v1');
  assert.equal(body.papers.length, 1);
  const expectedItems = H.V.derive.dlg.sets.same.items.length;
  assert.equal(body.papers[0].questions.length, expectedItems, '문항 수 일치');
  assert.match(body.papers[0].meta.title, /^\d\d .+ 모의고사 1회 \(기본\)$/);
  const meta0 = body.papers[0].meta;
  assert.equal(meta0.printHeaderOptions.title, meta0.title, '머리글·저장 제목이 같은 값');
  assert.equal(meta0.identityTitle, meta0.title);
  assert.equal(meta0.customTitle, meta0.title);
  assert.doesNotMatch(meta0.title, /다시 ?만들기/);
  assert.match(H.body(), /data-mock-saved/);
  assert.match(H.body(), /data-action="saved-paper-issue"[^>]*data-paper-id="[0-9a-f-]{36}"/, '저장 뒤 바로 출제하기');
  assert.match(H.body(), /view=saved&amp;paper_id=/);
  // 같은 결과를 다시 눌러도 요청이 한 번 더 나가지 않는다
  await act(H, 'derive-mock-save');
  assert.equal(server.posts.length, 1);
  assert.equal(server.papers.length, 1);
  // 작업 중이던 문제지 상태는 비어 있다(문제지 만들기에 다시 저장 단계가 남지 않는다)
  assert.equal(H.w.state.selected.length, 0);
  // 요청 본문이 문제지 만들기 저장과 같은 모양: 같은 결과를 문제지 만들기로 넘겨 저장한 본문과 키 구성이 같다
  const C = harness(fakeServer());
  C.api.startMockForExam(exam);
  C.V.derive.dlg.seed = H.V.derive.dlg.seed;
  await act(C, 'derive-mock-level', 'same');
  const composeServer = C.ctx.fetch; // same fake
  await C.api.deriveAction('derive-compose', {});
  const composeSrv = fakeServer();
  C.ctx.fetch = composeSrv.fetch;
  await C.api.savePapers();
  assert.equal(composeSrv.posts.length, 1, '문제지 만들기의 저장도 같은 요청 한 번');
  const cbody = composeSrv.posts[0];
  assert.deepEqual(Object.keys(cbody).sort(), Object.keys(body).sort());
  assert.deepEqual(Object.keys(cbody.papers[0]).sort(), Object.keys(body.papers[0]).sort());
  assert.deepEqual(Object.keys(cbody.papers[0].meta).sort(), Object.keys(body.papers[0].meta).sort());
  assert.deepEqual(Object.keys(cbody.selection_filters).sort(), Object.keys(body.selection_filters).sort());
  assert.deepEqual(Object.keys(cbody.papers[0].questions[0]).sort(), Object.keys(body.papers[0].questions[0]).sort());
  void composeServer;
  // 응용 -> 2회, 지운 뒤 심화 -> 3회(빈 번호를 메우지 않고 가장 큰 번호 + 1)
  await act(H, 'derive-mock-level', 'up-some');
  await act(H, 'derive-mock-save');
  assert.match(server.posts[1].papers[0].meta.title, /모의고사 2회 \(응용\)$/);
  server.papers.find(p => /2회/.test(p.title)).library_status = 'TRASHED';
  await act(H, 'derive-mock-level', 'up-one');
  await act(H, 'derive-mock-save');
  assert.match(server.posts[2].papers[0].meta.title, /모의고사 3회 \(심화\)$/);
  // 다른 시험지는 1회부터
  const other = catalogBase.exams.find(e => /^original\/middle\//.test(e.file) && e.qCount >= 16);
  H.api.startMockForExam(other);
  await act(H, 'derive-mock-level', 'same');
  await act(H, 'derive-mock-save');
  assert.match(server.posts[3].papers[0].meta.title, /모의고사 1회 \(기본\)$/);
});

test('세 벌 모두 저장: 겹치지 않으면 한 요청 papers 3권, 1회·2회·3회', async () => {
  const server = fakeServer();
  const H = harness(server);
  H.api.startMockForExam(pickBaseExam());
  await act(H, 'derive-mock-all');
  assert.match(H.body(), /data-action="derive-mock-save-all"/);
  // 겹침 없는 세 벌로 만든다(후보가 모자라 겹친 경우는 다음 시험이 따로 본다)
  const sets = H.V.derive.dlg.sets;
  const taken = new Set();
  for (const level of ['up-one', 'up-some', 'same']) {
    sets[level].items = sets[level].items.filter(r => !taken.has(r.questionUid));
    sets[level].items.forEach(r => taken.add(r.questionUid));
  }
  await act(H, 'derive-mock-save-all');
  assert.equal(server.posts.length, 1, '한 요청');
  const papers = server.posts[0].papers;
  assert.equal(papers.length, 3);
  assert.deepEqual(papers.map(p => p.part_index), [0, 1, 2]);
  assert.match(papers[0].meta.title, /모의고사 1회 \(기본\)$/);
  assert.match(papers[1].meta.title, /모의고사 2회 \(응용\)$/);
  assert.match(papers[2].meta.title, /모의고사 3회 \(심화\)$/);
  const uids = papers.flatMap(p => p.questions.map(q => q.questionUid));
  assert.equal(new Set(uids).size, uids.length, '세 벌은 서로 겹치지 않는다');
  assert.equal((H.body().match(/data-action="saved-paper-issue"/g) || []).length, 3);
  await act(H, 'derive-mock-save-all');
  assert.equal(server.posts.length, 1, '같은 세 벌을 또 눌러도 한 번만');
});

test('세 벌 모두 저장: 다른 회차와 겹친 문항이 있으면 한 권씩 따로 저장(서버는 한 요청 안 중복을 거절)', async () => {
  const server = fakeServer();
  const H = harness(server);
  H.api.startMockForExam(pickBaseExam());
  await act(H, 'derive-mock-all');
  const sets = H.V.derive.dlg.sets;
  const order = ['up-one', 'up-some', 'same'];
  const seen = new Set();
  let dup = 0;
  for (const level of order) for (const r of sets[level].items) { if (seen.has(r.questionUid)) dup += 1; seen.add(r.questionUid); }
  const shown = order.reduce((n, level) => n + (sets[level].summary.overlap || 0), 0);
  assert.equal(shown, dup, '요약의 "다른 회차와 겹침"은 실제 겹침 수와 같다');
  if (dup) assert.match(H.body(), /다른 회차와 겹침 \d+문항/);
  if (!dup) { // 겹침이 없는 시험이면 겹치는 세트를 만들어 이 길을 확인한다
    sets.same.items = [...sets.same.items, sets['up-one'].items[0]];
    dup = 1;
  }
  await act(H, 'derive-mock-save-all');
  assert.equal(server.posts.length, 3, '권마다 한 요청');
  assert.ok(server.posts.every(post => post.papers.length === 1));
  assert.deepEqual(server.posts.map(post => post.papers[0].meta.title.replace(/^.* 모의고사 /, '')), ['1회 (기본)', '2회 (응용)', '3회 (심화)']);
  assert.equal(server.papers.length, 3);
  assert.equal((H.body().match(/data-action="saved-paper-issue"/g) || []).length, 3);
  await act(H, 'derive-mock-save-all');
  assert.equal(server.posts.length, 3, '또 눌러도 다시 저장하지 않는다');
});

const settle = async (cond) => { for (let i = 0; i < 400 && !cond(); i++) await new Promise(r => setImmediate(r)); };

test('열어 본 순간 자동 저장: 열면 한 번 저장 · 다시 열어도 한 번 · 안 연 결과·로그인 전은 저장 안 함 · 저장 실패여도 열기는 진행', async () => {
  const exam = pickBaseExam();
  const server = fakeServer();
  const H = harness(server);
  H.api.startMockForExam(exam);
  await act(H, 'derive-mock-level', 'same');
  await act(H, 'derive-again');            // 다시 뽑기로 버린 결과
  await act(H, 'derive-mock-level', 'same');
  assert.equal(server.posts.length, 0, '열지 않은 결과는 저장하지 않는다');
  H.api.deriveAction('derive-popup', {});
  await settle(() => server.posts.length === 1 && !H.V.derive.busy);
  assert.equal(server.posts.length, 1, '열어 본 순간 한 번 저장');
  assert.match(server.posts[0].papers[0].meta.title, /모의고사 1회 \(기본\)$/);
  assert.match(H.body(), /data-mock-saved/);
  H.api.deriveAction('derive-popup', {});
  await settle(() => false);
  assert.equal(server.posts.length, 1, '같은 결과를 다시 열어도 한 번만');
  // 세 벌 모두 열기 -> 한 요청 3권
  const A = harness(fakeServer());
  A.api.startMockForExam(exam);
  await act(A, 'derive-mock-all');
  const srvA = fakeServer(); A.ctx.fetch = srvA.fetch;
  A.api.deriveAction('derive-mock-open-all', {});
  await settle(() => srvA.posts.length >= 1 && !A.V.derive.busy);
  assert.ok(srvA.posts.length >= 1);
  assert.equal(srvA.posts.reduce((n, post) => n + post.papers.length, 0), 3, '세 권 모두 저장');
  // 로그인 전: 시도하지 않고 한 줄 안내
  const out = harness(fakeServer(), { session: false });
  out.api.startMockForExam(exam);
  await act(out, 'derive-mock-level', 'same');
  assert.match(out.body(), /로그인하면 시험지를 열 때 보관함에 자동 저장됩니다/);
  out.api.deriveAction('derive-popup', {});
  await settle(() => false);
  assert.doesNotMatch(out.body(), /저장 안 됨/, '로그인 전에는 실패 문구도 띄우지 않는다');
  // 저장 실패: 열기는 진행되고 창에 "저장 안 됨 · 다시 시도"
  const bad = fakeServer(); bad.failNext = 413;
  const F = harness(bad);
  F.api.startMockForExam(exam);
  await act(F, 'derive-mock-level', 'same');
  F.api.deriveAction('derive-popup', {});
  await settle(() => bad.posts.length === 1 && !F.V.derive.busy);
  assert.match(F.body(), /data-mock-autosave-failed/);
  assert.match(F.body(), /저장 안 됨 · /);
  await act(F, 'derive-mock-save');
  assert.equal(bad.papers.length, 1, '다시 시도하면 저장된다');
});

test('제목: 파생본·모의고사 저장본에서 다시 들어와도 "다시 만들기"가 한 번만 붙는다', async () => {
  const exam = pickBaseExam();
  const uids = catalogBase.records.filter(r => r.sourceFile === exam.file).map(r => r.questionUid);
  for (const baseTitle of ['2026 순천고 고1 1학기 기말고사', '2026 순천고 고1 1학기 기말고사 다시 만들기', '2026 순천고 고1 1학기 기말고사 다시 만들기 다시 만들기',
    '2026 순천고 고1 1학기 기말고사 다시만들기 다시만들기', '25 순천고 고1 2학기 기말 모의고사 1회 (기본)']) {
    const H = harness(fakeServer(), { session: false });
    H.api.deriveStartFromItems(uids.map(uid => ({ uid })), { title: baseTitle });
    await act(H, 'derive-run');
    await act(H, 'derive-compose');
    const title = H.w.state.title;
    assert.equal((title.match(/다시 ?만들기/g) || []).length, 1, `접미 한 번: ${baseTitle} -> ${title}`);
    assert.doesNotMatch(title, /모의고사/);
    assert.match(title, /다시 만들기$/);
  }
  // 모의고사 저장 -> 그 제목으로 다시 파생 -> 다시 뽑기: 모의고사 제목에는 "다시 만들기"가 붙지 않는다
  const server = fakeServer();
  const M = harness(server);
  M.api.startMockForExam(exam);
  await act(M, 'derive-mock-level', 'same');
  await act(M, 'derive-mock-save');
  const savedTitle = server.posts[0].papers[0].meta.title;
  assert.doesNotMatch(savedTitle, /다시 ?만들기/);
  await act(M, 'derive-compose');
  assert.doesNotMatch(M.w.state.title, /다시 ?만들기/);
  assert.match(M.w.state.title, /모의고사 \d+회 \(기본\)$/);
  await act(M, 'derive-compose-again');
  await act(M, 'derive-compose');
  assert.doesNotMatch(M.w.state.title, /다시 ?만들기/);
});

test('로그인 전·저장 실패: 결과는 창에 남고, 실패한 뒤 다시 누르면 저장된다', async () => {
  const exam = pickBaseExam();
  const out = harness(fakeServer(), { session: false });
  out.api.startMockForExam(exam);
  await act(out, 'derive-mock-level', 'same');
  await act(out, 'derive-mock-save');
  assert.match(out.body(), /로그인/);
  assert.ok(out.V.derive.dlg.result.items.length > 0, '만든 결과는 남아 있다');
  assert.doesNotMatch(out.body(), /data-mock-saved/);
  const server = fakeServer();
  const H = harness(server);
  H.api.startMockForExam(exam);
  await act(H, 'derive-mock-level', 'same');
  server.failNext = 413;
  await act(H, 'derive-mock-save');
  assert.match(H.body(), /너무 커서/, '기존 저장 실패 문구 그대로');
  assert.doesNotMatch(H.body(), /data-mock-saved/);
  assert.equal(server.papers.length, 0);
  await act(H, 'derive-mock-save');
  assert.equal(server.papers.length, 1, '다시 누르면 저장된다');
  assert.match(H.body(), /data-mock-saved/);
  assert.equal(server.posts.length, 2);
});
