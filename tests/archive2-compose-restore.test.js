// 조건을 바꿔 지워진 문제지를 한 단계 되살리는 길(메모리만). 실제 main 이벤트 처리기(click/change)를 거쳐 확인한다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const Unified = require('../archive/archive2-unified-units.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace } = require('./helpers/archive2-workspace-source.cjs');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

let sharedCatalog = null, sharedFinderIndex = null;
function setup(t) {
  if (!sharedCatalog) {
    sharedCatalog = withTestAssignments(structuredClone(catalog));
    sharedFinderIndex = core.buildFinderIndex(sharedCatalog);
  }
  const data = sharedCatalog;
  const events = new Map(), nodes = new Map(), storage = new Map(), written = [];
  const restoreCalls = [];
  const Source = { ...archiveSource, async restore(records, cat, options) { restoreCalls.push(records.length); return archiveSource.restore(records, cat, options); } };
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', textContent: '', dataset: {}, style: {}, offsetHeight: 0, children: [],
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [], replaceChildren() {},
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const document = {
    baseURI: 'https://archive.test/archive/workspace.html',
    getElementById: node, querySelector: () => null, querySelectorAll: () => [],
    body: { dataset: {} },
    createElement: () => ({ ...node('x'), dataset: {}, style: {}, attrs: {} }),
    addEventListener: (name, callback) => {
      if (!events.has(name)) events.set(name, []);
      events.get(name).push(callback);
    },
  };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone, queueMicrotask: () => {},
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {}, setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => { written.push(String(value)); storage.set(key, value); } },
    document,
    addEventListener() {},
    fetch: async url => ({ ok: true, json: async () => JSON.parse(read(new URL(String(url)).pathname.replace(/^\/archive\//, ''))) }),
    Archive2Core: core,
    Archive2UnifiedUnits: Unified,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: Source,
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = { state, scopeOptions, request, review, generate, prepare, prepareSignature, previewSignature, draft, replace, replaceWith,
      renderResultEmpty, renderResult, renderMobileActions, renderCompose, savePapers, newDraft, invalidate, clearedResult, selectedScopeQuestionUids, selectedScopePaths };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = sharedFinderIndex;
  w.state.indexVersion = data.indexVersion;
  w.state.view = 'compose';
  const previousDocument = global.document, previousFetch = global.fetch;
  global.document = { baseURI: 'https://archive.test/archive/workspace.html' };
  global.fetch = async input => {
    const url = new URL(String(input));
    const sourcePath = decodeURIComponent(url.pathname.replace('/archive/exams/', ''));
    return { ok: true, status: 200, text: async () => fs.readFileSync(path.join(root, 'archive/exams', sourcePath), 'utf8') };
  };
  t.after(() => {
    if (previousDocument === undefined) delete global.document; else global.document = previousDocument;
    if (previousFetch === undefined) delete global.fetch; else global.fetch = previousFetch;
  });
  return {
    w, ctx, restoreCalls, written,
    async click(dataset) {
      for (const callback of events.get('click') || [])
        await callback({ target: { closest: () => ({ dataset }) } });
    },
    async change(target) {
      for (const callback of events.get('change') || []) await callback({ target });
    },
  };
}

// 실제 단원 하나에서 문제지를 만들고(고정 1·교체 1까지) 손본 상태로 만든다.
function build(w) {
  w.state.filters = { grade: '고1' };
  const unit = w.scopeOptions().filter(item => !item.unclassified).sort((a, b) => b.count - a.count)[0];
  w.state.scopes = [unit.key];
  w.state.distribution = 'pool';
  w.state.count = 8;
  w.generate();
  assert.equal(w.state.selected.length, 8);
  return unit;
}
const snapshotOf = w => plain({
  uids: w.state.selected.map(r => r.questionUid), rows: w.state.rows, pins: w.state.pins, undo: w.state.undo.length,
  scopes: w.state.scopes, buckets: w.state.buckets, count: w.state.count, distribution: w.state.distribution,
  filters: w.state.filters, custom: w.state.custom, sources: w.state.sources, shortage: w.state.composeShortage,
});

test('조건을 바꿔 결과가 지워지면 "방금 문제지 되돌리기"가 보이고, 누르면 조건과 선정 결과(고정·교체 이력)가 그대로 돌아온다', async t => {
  const h = setup(t);
  const { w } = h;
  build(w);
  // 손본 결과: 고정 1개 + 교체 이력이 있는 상태를 만든다.
  w.state.pins = [w.state.selected[0].questionUid];
  w.state.undo.push({ index: 1, before: w.state.selected[1], after: w.state.selected[1], wasPinned: false });
  const before = snapshotOf(w);
  assert.equal(w.clearedResult(), null, 'nothing to restore before a condition changes');

  await h.click({ action: 'bucket', bucket: '3' });
  assert.equal(w.state.selected.length, 0, 'the condition change clears the result as before');
  assert.notDeepEqual(plain(w.state.buckets), before.buckets);
  const empty = w.renderResultEmpty();
  assert.match(empty, /data-compose-stale/);
  assert.match(empty, /data-compose-restore/);
  assert.match(empty, /data-action="restore-cleared"[^>]*>방금 문제지 되돌리기</);
  assert.doesNotMatch(empty, /state\.|prepared|invalidate|snapshot|undo/i, 'no internal words on the screen');
  assert.doesNotMatch(empty, /교체 되돌리기/, 'not confused with the replacement undo button');

  await h.click({ action: 'restore-cleared' });
  assert.deepEqual(snapshotOf(w), before, 'conditions and selection (order, rows, pins, replace history) are back as they were');
  assert.equal(w.state.composeStale, false);
  assert.equal(w.clearedResult(), null, 'one step only: the restore point is used up');
  assert.doesNotMatch(w.renderResultEmpty(), /data-compose-restore/);
});

test('한 단계만: 여러 번 바꿔도 처음 지워진 결과로 돌아오고, 이력은 쌓이지 않는다', async t => {
  const h = setup(t);
  const { w } = h;
  build(w);
  const before = snapshotOf(w);
  await h.click({ action: 'bucket', bucket: '2' });
  await h.click({ action: 'bucket', bucket: '4' });
  await h.change({ id: 'count', value: '5', dataset: {} });
  assert.equal(w.state.selected.length, 0);
  assert.equal(w.state.count, 5);
  await h.click({ action: 'restore-cleared' });
  assert.deepEqual(snapshotOf(w), before);
  await h.click({ action: 'restore-cleared' });
  assert.deepEqual(snapshotOf(w), before, 'a second press does nothing');
});

test('새로 만들기·새 작업·출제가 시작되면 되돌리기는 사라진다', async t => {
  const a = setup(t);
  build(a.w);
  await a.click({ action: 'bucket', bucket: '3' });
  assert.ok(a.w.clearedResult());
  a.w.generate();
  assert.equal(a.w.clearedResult(), null, 'making a new paper discards it');
  assert.doesNotMatch(a.w.renderResult(), /data-compose-restore/);

  const b = setup(t);
  build(b.w);
  await b.click({ action: 'bucket', bucket: '3' });
  assert.ok(b.w.clearedResult());
  b.w.newDraft();
  assert.equal(b.w.clearedResult(), null, 'a new work discards it');
  assert.doesNotMatch(b.w.renderResultEmpty(), /data-compose-restore/);

  const c = setup(t);
  build(c.w);
  await c.click({ action: 'bucket', bucket: '3' });
  c.w.state.draftId = 'another-draft';
  assert.equal(c.w.clearedResult(), null, 'another draft discards it');

  const d = setup(t);
  build(d.w);
  d.w.state.receipts = [{ key: 'k', partIndex: 0, classId: 'c', id: 'a' }];
  await d.click({ action: 'bucket', bucket: '3' }).catch(() => {});
  assert.equal(d.w.clearedResult(), null, 'a paper that was already issued keeps its own rules');
});

test('메모리에만 둔다: 초안(저장 형식)에도 localStorage에도 지워진 선정 결과가 들어가지 않는다', async t => {
  const h = setup(t);
  const { w } = h;
  build(w);
  const uids = w.state.selected.map(r => r.questionUid);
  const keysBefore = Object.keys(w.draft()).sort();
  await h.click({ action: 'bucket', bucket: '3' });
  assert.ok(w.clearedResult());
  const draft = w.draft();
  assert.deepEqual(Object.keys(draft).sort(), keysBefore, 'no new draft field');
  assert.deepEqual(plain(draft.selected), []);
  assert.deepEqual(plain(draft.pins), []);
  assert.deepEqual(plain(draft.rows), []);
  // localStorage에는 되살릴 것의 흔적(조건 사본·선정 결과 사본)이 쓰이지 않는다.
  await h.click({ action: 'restore-cleared' });
  assert.ok(!h.written.some(value => /"conditions"|"catalogVersion"|lastCleared/.test(value)));
  assert.equal(uids.length, w.state.selected.length);
});

test('되살린 뒤: 미리보기 서명·준비 재사용이 이어지고(다시 복원하지 않음), 저장 요청이 되살린 조건과 같다(범위 uid 목록 포함)', async t => {
  const h = setup(t);
  const { w, ctx } = h;
  build(w);
  w.state.ackWarnings = true;
  ctx.localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 'fixture-teacher', session_token: 'fixture-token' }));
  ctx.APMATH_API_BASE = 'https://archive.test/api';
  const bodies = [];
  ctx.fetch = async (url, init = {}) => {
    if (new URL(String(url)).pathname === '/api/archive-saved-papers' && init.method === 'POST') {
      bodies.push(JSON.parse(init.body));
      return { ok: true, status: 200, json: async () => ({ success: true, saved: true, papers: [{ id: '00000000-0000-4000-8000-000000000b01' }] }) };
    }
    throw new Error('unexpected request ' + url);
  };
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(h.restoreCalls.length, 1);
  const scopeUids = plain(w.selectedScopeQuestionUids());
  const previewBefore = w.previewSignature();
  const prepareBefore = w.prepareSignature();

  await h.click({ action: 'bucket', bucket: '3' });
  assert.equal(w.state.selected.length, 0);
  assert.notEqual(w.prepareSignature(), prepareBefore, 'cleared: the signature no longer matches the paper');
  await h.click({ action: 'restore-cleared' });

  assert.equal(w.previewSignature(), previewBefore, 'the preview signature is the one the paper had before');
  assert.equal(w.prepareSignature(), prepareBefore);
  assert.deepEqual(plain(w.selectedScopeQuestionUids()), scopeUids);
  await w.prepare();
  assert.equal(h.restoreCalls.length, 1, 'the prepared paper came back with it: no second restore');

  await w.savePapers();
  assert.equal(bodies.length, 2);
  assert.deepEqual(bodies[1].selection_filters, bodies[0].selection_filters);
  assert.deepEqual(bodies[1].papers, bodies[0].papers);
  assert.equal(bodies[1].index_version, bodies[0].index_version);
  assert.equal(bodies[1].save_batch_id, bodies[0].save_batch_id, 'same paper, same save request');
  assert.deepEqual(plain(w.selectedScopeQuestionUids()), scopeUids);
});

test('좁은 화면 하단 띠: 되돌릴 것이 있는 동안만 "방금 문제지 되돌리기"가 띠에 보이고, 문제지 만들기 버튼은 그대로 있다', async t => {
  const h = setup(t);
  const { w, ctx } = h;
  build(w);
  ctx.Archive2Workspace.v.composeLiveInfo = { hasRows: true, possible: 50, requested: 50, disabled: false, overLimit: false };
  const idle = w.renderMobileActions();
  assert.doesNotMatch(idle, /restore-cleared/);
  await h.click({ action: 'bucket', bucket: '3' });
  const bar = w.renderMobileActions();
  assert.match(bar, /data-action="restore-cleared"[^>]*class="cz-bar-restore"[^>]*>방금 문제지 되돌리기</);
  assert.match(bar, /data-action="generate"[^>]*class="primary cz-bar-main"[^>]*>문제지 만들기</, 'the main button stays');
  assert.match(bar, /50문항 가능/);
  await h.click({ action: 'restore-cleared' });
  assert.doesNotMatch(w.renderMobileActions(), /restore-cleared/);
});

test('같은 초안에서 조건을 바꿔 지운 뒤 찾기의 "문제지 만들기"(go-compose)로 새 조건을 들고 오면 되돌리기는 사라진다', async t => {
  const h = setup(t);
  const { w } = h;
  build(w);
  await h.click({ action: 'bucket', bucket: '3' });
  assert.ok(w.clearedResult());
  // 홈·찾기로 갔다가 조건 없이 그냥 돌아온 경우는 남는다.
  w.state.view = 'find';
  assert.ok(w.clearedResult(), 'just visiting another screen keeps it');
  w.state.view = 'compose';
  assert.ok(w.clearedResult());
  w.state.view = 'find';
  w.state.find = { grade: '고1' };
  await h.click({ action: 'go-compose' });
  assert.equal(w.clearedResult(), null, 'new conditions brought from the finder discard it');
  assert.doesNotMatch(w.renderResultEmpty(), /data-compose-restore/);
});

// 저장본에서 연 수정본: 범위는 원본에 고정이라 조건 칸이 그려지지 않고, 조건 처리기가 불려도 손본 문항·고정·교체 이력은 그대로다.
// (조건이 바뀌면 invalidate()가 결과를 비우고 초안에도 빈 상태가 저장되며, 되돌리기는 수정본을 담지 않는다.)
test('수정본에는 조건 칸이 없고, 조건 처리기가 불려도 선택·고정·교체 이력이 그대로다', async t => {
  const h = setup(t);
  const { w } = h;
  build(w);
  w.state.pins = [w.state.selected[0].questionUid];
  w.state.undo.push({ index: 1, before: w.state.selected[1], after: w.state.selected[1], wasPinned: false });
  const normal = w.renderCompose();
  assert.match(normal, /data-action="compose-grade"/, '일반 만들기 화면에는 학년 버튼이 있다');
  w.state.derivationSource = { parentKind: 'SAVED_PAPER', parentId: 'p-1', parentDisplayName: '저장한 시험지', derivationType: 'REVISION' };
  const revision = w.renderCompose();
  assert.match(revision, /원본 저장 시험지의 고정된 범위/);
  assert.doesNotMatch(revision, /data-action="compose-(grade|subject)"|data-group="compose"/, '수정본 화면에는 조건 칸이 그려지지 않는다');

  const before = snapshotOf(w);
  await h.click({ action: 'compose-grade', grade: '중3' });
  await h.click({ action: 'compose-subject', subject: 'COMMON_MATH_1' });
  for (const [filter, value] of [['metaApprovedOnly', '1'], ['metaPT', 'X'], ['grade', '고2'], ['semanticSubject', 'COMMON_MATH_2']])
    await h.change({ dataset: { group: 'compose', filter }, value });
  assert.deepEqual(snapshotOf(w), before, '선택·rows·고정·교체 이력·조건이 그대로다');
  assert.equal(w.state.composeStale, false, '"조건이 바뀌었습니다" 안내도 뜨지 않는다');
  assert.equal(w.clearedResult(), null);
});
