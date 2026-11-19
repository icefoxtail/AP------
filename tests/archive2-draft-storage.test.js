// 만들던 문제지(초안)는 브라우저 저장소에 초안마다 키 하나 + 색인 키 하나로 둔다. 옛 키(초안 배열 통째)는 읽기 전용 백업이다.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const { catalog } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace } = require('./helpers/archive2-workspace-source.cjs');

const LEGACY = 'APMATH_ARCHIVE2_DRAFTS_v1:fixture-teacher';
const SPLIT = 'APMATH_ARCHIVE2_DRAFTS_v2:fixture-teacher';
const INDEX = SPLIT + ':index';
const draftKey = id => SPLIT + ':d:' + id;

// capacity: 저장소 전체 글자 수 상한(넘으면 QuotaExceededError). failOn: 이 키에 쓰면 던진다.
function setup({ capacity = Infinity, failOn = null, onSet = null } = {}) {
  const store = new Map(), writes = [], nodes = new Map();
  const total = () => [...store].reduce((n, [k, v]) => n + k.length + v.length, 0);
  const localStorage = {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem(key, value) {
      value = String(value);
      if (failOn && failOn(key, value)) throw Object.assign(new Error('The quota has been exceeded.'), { name: 'QuotaExceededError' });
      const next = total() - (store.has(key) ? key.length + store.get(key).length : 0) + key.length + value.length;
      if (next > capacity) throw Object.assign(new Error('The quota has been exceeded.'), { name: 'QuotaExceededError' });
      writes.push({ key, size: value.length });
      if (onSet) onSet(key, value, store);
      store.set(key, value);
    },
    removeItem: key => { store.delete(key); },
  };
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: '', textContent: '', dataset: {}, setAttribute() {}, addEventListener() {}, querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {} });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone,
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} }, scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage,
    document: { baseURI: 'https://archive.test/archive/workspace.html', getElementById: node, querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} }, addEventListener() {} },
    addEventListener() {},
    fetch: async () => { throw new Error('no network in this test'); },
    Archive2Core: core, ProblemBankMeta: require('../archive/problem-bank-meta.js'), Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'), Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'), Archive2Source: archiveSource,
  });
  ctx.window = ctx;
  store.set('APMATH_SESSION', JSON.stringify({ id: 'fixture-teacher', session_token: 'fixture-token' }));
  loadWorkspace(ctx, `
    render = () => {};
    globalThis.workspaceTest = { state, drafts, save, deleteDraft, draft, storageKey };
  `);
  const w = ctx.workspaceTest;
  const record = catalog.records.find(row => core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const scope = core.pathKey(record, 4);
  w.state.catalog = catalog;
  w.state.byUid = new Map(catalog.records.map(row => [row.questionUid, row]));
  w.state.indexVersion = catalog.indexVersion;
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  const statusText = () => node('status').textContent;
  return { w, ctx, store, writes, localStorage, statusText };
}
// 저장소에 직접 놓는 옛 형식 초안(문서 모양은 draft()가 만드는 것과 같은 필드를 일부만, 크기를 맞추려고 pad를 더한다).
const oldDraft = (n, pad = 0) => ({ schemaVersion: 1, draftId: 'old-' + n, updatedAt: `2026-11-0${(n % 9) + 1}T00:00:00.000Z`, title: '초안 ' + n, scopes: ['s' + n], selected: [{ questionUid: 'q' + n }], ...(pad ? { pad: 'x'.repeat(pad) } : {}) });
const plain = v => JSON.parse(JSON.stringify(v));
const ids = w => plain(w.drafts().map(d => d.draftId));

test('옛 형식만 있는 저장소를 열면 초안이 전부 보이고 옛 키는 그대로이며 새 키로 옮겨진다', () => {
  const { w, store } = setup();
  const old = [oldDraft(1), oldDraft(2), oldDraft(3)];
  const legacyText = JSON.stringify(old);
  store.set(LEGACY, legacyText);
  assert.deepEqual(plain(w.drafts()), old, 'same drafts, same order');
  assert.equal(store.get(LEGACY), legacyText, 'the old key is untouched (read-only backup)');
  assert.deepEqual(JSON.parse(store.get(INDEX)), { version: 1, ids: ['old-1', 'old-2', 'old-3'] });
  for (const d of old) assert.deepEqual(JSON.parse(store.get(draftKey(d.draftId))), d);
  // 다시 열어도 같다.
  assert.deepEqual(plain(w.drafts()), old);
});

test('새 형식에서 저장·읽기·삭제: 최근 저장이 앞, 같은 초안은 덮어쓰기, 삭제는 그 초안 키와 색인만', () => {
  const { w, store } = setup();
  store.set(LEGACY, JSON.stringify([oldDraft(1), oldDraft(2)]));
  const legacyText = store.get(LEGACY);
  w.state.draftId = 'new-a';
  w.save();
  assert.deepEqual(ids(w), ['new-a', 'old-1', 'old-2']);
  w.state.title = '바뀐 제목';
  w.save(); // 같은 draftId: 하나로 합쳐진다
  assert.deepEqual(ids(w), ['new-a', 'old-1', 'old-2']);
  assert.equal(w.drafts()[0].title, '바뀐 제목');
  const saved = w.drafts()[0];
  assert.deepEqual(Object.keys(plain(saved)).sort(), Object.keys(plain(w.draft())).sort(), 'the draft document keeps its shape');
  assert.equal(w.deleteDraft('old-1'), true);
  assert.deepEqual(ids(w), ['new-a', 'old-2']);
  assert.equal(store.has(draftKey('old-1')), false);
  assert.equal(store.has(draftKey('old-2')), true);
  assert.equal(store.get(LEGACY), legacyText, 'the old key never changes');
});

test('초안이 20개여도 setItem 한 번의 크기는 초안 1개분이고, 21번째 저장은 가장 오래된 한 건만 밀어낸다', () => {
  const { w, store, writes } = setup();
  const PAD = 50000;
  store.set(LEGACY, JSON.stringify(Array.from({ length: 20 }, (_, i) => oldDraft(i + 1, PAD))));
  w.drafts(); // 옮기기
  writes.length = 0;
  w.state.draftId = 'brand-new';
  w.save();
  const biggest = Math.max(...writes.map(x => x.size));
  assert.ok(biggest < PAD * 2, `largest single setItem ${biggest} must be about one draft (${PAD}), not twenty (${PAD * 20})`);
  const ids = JSON.parse(store.get(INDEX)).ids;
  assert.equal(ids.length, 20);
  assert.equal(ids[0], 'brand-new');
  assert.equal(ids.includes('old-20'), false, 'the 20 limit evicts the oldest (last) entry only');
  assert.equal(store.has(draftKey('old-20')), false);
  assert.equal(store.has(draftKey('old-1')), true);
});

test('옮기다 예외가 나면 새 키를 걷어 내고 옛 키로 그대로 동작한다(초안 유실 0)', () => {
  const { w, store } = setup({ failOn: key => key === draftKey('old-3') });
  const old = [oldDraft(1), oldDraft(2), oldDraft(3)];
  const legacyText = JSON.stringify(old);
  store.set(LEGACY, legacyText);
  assert.deepEqual(plain(w.drafts()), old);
  assert.equal(store.get(LEGACY), legacyText);
  assert.equal([...store.keys()].some(k => k.startsWith(SPLIT)), false, 'partial new keys are removed');
  // 저장·삭제도 옛 키로 이전과 같이 동작한다.
  w.state.draftId = 'while-legacy';
  w.save();
  assert.deepEqual(ids(w), ['while-legacy', 'old-1', 'old-2', 'old-3']);
  assert.equal(JSON.parse(store.get(LEGACY)).length, 4);
  assert.equal(w.deleteDraft('old-2'), true);
  assert.deepEqual(ids(w), ['while-legacy', 'old-1', 'old-3']);
  assert.equal([...store.keys()].some(k => k.startsWith(SPLIT)), false);
});

test('가짜 QuotaExceeded: 새 초안 저장이 실패해도 기존 초안은 하나도 사라지지 않고 안내가 뜬다', () => {
  const PAD = 40000;
  const probe = setup();
  probe.store.set(LEGACY, JSON.stringify(Array.from({ length: 5 }, (_, i) => oldDraft(i + 1, PAD))));
  probe.w.drafts();
  const used = [...probe.store].reduce((n, [k, v]) => n + k.length + v.length, 0);
  // 지금 쓰는 양 + 옛 백업을 합친 값에 조금만 더 여유를 준다: 새 초안(문서 하나) 정도는 들어가지 않는다.
  const { w, store, statusText } = setup({ capacity: used + 200 });
  store.set(LEGACY, JSON.stringify(Array.from({ length: 5 }, (_, i) => oldDraft(i + 1, PAD))));
  const before = w.drafts().map(d => JSON.stringify(d));
  const indexBefore = store.get(INDEX);
  w.state.draftId = 'too-big';
  w.save();
  assert.match(statusText(), /브라우저 저장 공간이 부족합니다/);
  assert.deepEqual(w.drafts().map(d => JSON.stringify(d)), before, 'every existing draft is still there');
  assert.equal(store.get(INDEX), indexBefore, 'the index is unchanged');
  assert.equal(store.has(draftKey('too-big')), false, 'no orphan key');
});

test('색인을 쓰다 실패해도 방금 쓴 새 초안 키만 걷어 내고 기존 초안은 그대로다', () => {
  const { w, store, statusText } = setup({ failOn: (key, value) => key === INDEX && value.includes('late') });
  store.set(LEGACY, JSON.stringify([oldDraft(1)]));
  w.drafts();
  const before = ids(w);
  w.state.draftId = 'late';
  w.save();
  assert.match(statusText(), /저장 공간이 부족/);
  assert.deepEqual(ids(w), before);
  assert.equal(store.has(draftKey('late')), false);
});

test('다른 탭이 방금 저장한 초안은 색인을 다시 읽어 합쳐서 잃지 않는다', () => {
  let injected = false, ctxRef = null;
  const { w, store } = setup({
    onSet: (key, _value, map) => {
      // 이 탭이 새 초안 키를 쓰는 사이 다른 탭이 색인에 'other-tab'을 더했다.
      if (!injected && key === draftKey('mine')) {
        injected = true;
        const ids = JSON.parse(map.get(INDEX)).ids;
        map.set(INDEX, JSON.stringify({ version: 1, ids: ['other-tab', ...ids] }));
        map.set(draftKey('other-tab'), JSON.stringify({ ...oldDraft(9), draftId: 'other-tab' }));
      }
    },
  });
  store.set(LEGACY, JSON.stringify([oldDraft(1)]));
  w.drafts();
  w.state.draftId = 'mine';
  w.save();
  assert.deepEqual(JSON.parse(store.get(INDEX)).ids, ['mine', 'other-tab', 'old-1']);
  assert.deepEqual(ids(w), ['mine', 'other-tab', 'old-1']);
  void ctxRef;
});

test('읽을 수 없는 색인은 덮어쓰지 않고 옛 키로 동작하며, 읽을 수 없는 초안 한 건은 건너뛴다', () => {
  const { w, store } = setup();
  store.set(LEGACY, JSON.stringify([oldDraft(1)]));
  store.set(INDEX, '{not json');
  assert.deepEqual(ids(w), ['old-1']);
  w.state.draftId = 'x';
  w.save();
  assert.equal(store.get(INDEX), '{not json', 'the unreadable index is never overwritten');
  // 색인은 정상, 초안 키 하나가 깨짐
  const second = setup();
  second.store.set(INDEX, JSON.stringify({ version: 1, ids: ['a', 'b'] }));
  second.store.set(draftKey('a'), JSON.stringify(oldDraft(1)));
  second.store.set(draftKey('b'), '{broken');
  assert.deepEqual(ids(second.w), ['old-1']);
});

test('옛 형식도 새 형식도 없으면 첫 저장 때 새 형식이 만들어지고 옛 키는 만들지 않는다', () => {
  const { w, store } = setup();
  assert.deepEqual(plain(w.drafts()), []);
  w.state.draftId = 'first';
  w.save();
  assert.deepEqual(ids(w), ['first']);
  assert.equal(store.has(LEGACY), false);
  assert.deepEqual(JSON.parse(store.get(INDEX)).ids, ['first']);
});
