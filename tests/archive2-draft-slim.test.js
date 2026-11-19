// 초안의 최상위 scopeQuestionUids는 쓰기만 하고 읽지 않는 큰 목록이다. 새 초안에는 넣지 않고, 기존 초안도 저장 때 그 키만 뺀다(무손실).
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const { catalog } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace, readWorkspace } = require('./helpers/archive2-workspace-source.cjs');

const KEY = 'APMATH_ARCHIVE2_DRAFTS_v1:fixture-teacher';
const plain = v => JSON.parse(JSON.stringify(v));
const uid = n => 'qid_v1_' + String(n).padStart(64, '0');

// capacity: localStorage 전체 글자 수 상한(넘으면 QuotaExceededError, 그때까지의 값은 그대로).
function setup({ capacity = Infinity } = {}) {
  const store = new Map(), nodes = new Map();
  const total = () => [...store].reduce((n, [k, v]) => n + k.length + v.length, 0);
  const localStorage = {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem(key, value) {
      value = String(value);
      const next = total() - (store.has(key) ? key.length + store.get(key).length : 0) + key.length + value.length;
      if (next > capacity) throw Object.assign(new Error('The quota has been exceeded.'), { name: 'QuotaExceededError' });
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
    globalThis.workspaceTest = { state, drafts, save, draft, applyDraft, selectedScopeQuestionUids };
  `);
  const w = ctx.workspaceTest;
  const record = catalog.records.find(row => core.basicEligibility(row, { canonicalAuthority: catalog.canonicalAuthority }).ok);
  const scopeKey = core.pathKey(record, 4);
  // 범위에 문항이 많은 학년 전체 같은 경우: 범위 uid 목록이 큰 초안
  const rest = catalog.records.filter(r => r.effectiveBrowseGrade === record.effectiveBrowseGrade).slice(0, 900).map(r => r.questionUid);
  const uids = [...new Set([record.questionUid, ...rest])];
  w.state.catalog = catalog;
  w.state.byUid = new Map(catalog.records.map(row => [row.questionUid, row]));
  w.state.indexVersion = catalog.indexVersion;
  w.state.uidRoute = { scopes: [{ key: scopeKey, id: scopeKey, label: scopeKey, fullLabel: scopeKey, paths: [scopeKey], scopeQuestionUids: uids, facetQuestionUids: uids, count: uids.length, eligibleCount: uids.length, supplemental: false, children: [] }], error: null };
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scopeKey];
  w.state.rows = [{ id: scopeKey, paths: [scopeKey], scopeQuestionUids: uids, count: 1 }];
  w.state.selected = [{ ...record, rowId: scopeKey }];
  const statusText = () => String(node('status').textContent);
  return { w, ctx, store, statusText, uids };
}

// 옛 초안: 새 초안 모양 + 최상위 scopeQuestionUids(옛 코드가 쓰던 것)
function legacyDraftsFor(w, n, uids) {
  return Array.from({ length: n }, (_, i) => ({ ...plain(w.draft()), draftId: 'old-' + i, title: '초안 ' + i, scopeQuestionUids: uids, extraKeep: { i } }));
}

test('새 초안에는 최상위 scopeQuestionUids가 없고, 나머지 필드(rows 안의 목록 포함)는 그대로다', () => {
  const { w, uids } = setup();
  assert.ok(w.selectedScopeQuestionUids().length > 100, 'the scope really has many uids');
  const d = plain(w.draft());
  assert.equal('scopeQuestionUids' in d, false);
  for (const key of ['scopeSourcePaths', 'selected', 'rows', 'scopes', 'pins', 'rounds', 'sources', 'header', 'draftId']) assert.ok(key in d, key);
  assert.deepEqual(d.rows[0].scopeQuestionUids, uids, 'rows[].scopeQuestionUids is not touched by this change');
  // 크기 비교: 옛 모양(목록 포함)과 새 모양
  const oldSize = Buffer.byteLength(JSON.stringify({ ...d, scopeQuestionUids: w.selectedScopeQuestionUids() }));
  const newSize = Buffer.byteLength(JSON.stringify(d));
  assert.ok(newSize < oldSize * 0.7, `new ${newSize} must be clearly smaller than old ${oldSize}`);
});

test('저장하면 기존 초안에서도 그 키만 빠지고 다른 필드는 deep equal이며 순서·개수·20개 상한은 그대로다', () => {
  const { w, store, uids } = setup();
  const old = legacyDraftsFor(w, 5, uids);
  store.set(KEY, JSON.stringify(old));
  w.state.draftId = 'new-draft';
  w.save();
  const after = JSON.parse(store.get(KEY));
  assert.deepEqual(after.map(d => d.draftId), ['new-draft', ...old.map(d => d.draftId)]);
  for (const before of old) {
    const stored = after.find(d => d.draftId === before.draftId);
    const { scopeQuestionUids, ...expected } = before;
    assert.equal('scopeQuestionUids' in stored, false);
    assert.deepEqual(stored, expected, 'every other field is byte-for-byte the same content');
  }
  assert.equal('scopeQuestionUids' in after[0], false);
  // 20개 상한
  store.set(KEY, JSON.stringify(legacyDraftsFor(w, 20, uids)));
  w.state.draftId = 'twenty-first';
  w.save();
  const capped = JSON.parse(store.get(KEY));
  assert.equal(capped.length, 20);
  assert.equal(capped[0].draftId, 'twenty-first');
  assert.equal(capped.at(-1).draftId, 'old-18');
});

test('가득 찬 저장소: 정리하면 들어가는 저장은 성공하고 크기가 줄며, 정리해도 안 들어가면 아무것도 지우지 않고 안내만 한다', () => {
  const probe = setup();
  const old = legacyDraftsFor(probe.w, 8, probe.uids);
  const oldText = JSON.stringify(old);
  // 용량 = 옛 배열이 겨우 들어가는 크기 + 여유 조금: 목록이 든 새 초안은 안 들어가지만 정리한 배열은 들어간다.
  const tight = KEY.length + oldText.length + 'APMATH_SESSION'.length + probe.store.get('APMATH_SESSION').length + 2000;
  const { w, store, statusText, uids } = setup({ capacity: tight });
  store.set(KEY, oldText);
  assert.ok(Buffer.byteLength(JSON.stringify({ ...plain(w.draft()), scopeQuestionUids: uids })) > 2000, 'an unpruned new draft would not fit');
  w.state.draftId = 'fits-after-prune';
  w.save();
  assert.doesNotMatch(statusText(), /저장 공간이 부족/);
  const after = JSON.parse(store.get(KEY));
  assert.equal(after[0].draftId, 'fits-after-prune');
  assert.equal(after.length, 9);
  assert.ok(store.get(KEY).length < oldText.length, 'the array got smaller');
  // 정리해도 안 들어가는 경우: 기존 저장값이 그대로, 안내가 뜬다
  const prunedText = JSON.stringify(old.map(({ scopeQuestionUids, ...rest }) => rest));
  const full = setup({ capacity: KEY.length + prunedText.length + 'APMATH_SESSION'.length + probe.store.get('APMATH_SESSION').length - 50 });
  full.store.set(KEY, oldText);
  const before = full.store.get(KEY);
  full.w.state.draftId = 'nope';
  full.w.state.header = { ...full.w.state.header, title: 'x'.repeat(4000) };
  full.w.save();
  assert.match(full.statusText(), /브라우저 저장 공간이 부족합니다/);
  assert.equal(full.store.get(KEY), before, 'nothing was deleted or changed');
  assert.deepEqual(plain(full.w.drafts()).map(d => d.draftId), old.map(d => d.draftId));
});

test('옛 초안(키 있음)도, 새 초안(키 없음)도 열린다: 이 키는 선택 항목이고 어디서도 읽지 않는다', () => {
  const { w, uids } = setup();
  const fresh = { ...plain(w.draft()), scopes: [], scopeSourcePaths: [] }; // 범위 목록은 열 때 현재 카탈로그로 다시 만들어지므로 이 검사는 범위 없이 연다
  const legacy = { ...fresh, scopeQuestionUids: uids };
  for (const data of [fresh, legacy]) {
    const opened = setup();
    opened.w.applyDraft(structuredClone(data));
    assert.equal(opened.w.state.draftId, fresh.draftId);
    assert.deepEqual(plain(opened.w.state.selected).map(r => r.questionUid), fresh.selected.map(r => r.questionUid));
  }
  // 검증 규칙은 값이 없으면 건너뛰고, 복원 코드는 이 키를 읽지 않는다(읽는다면 이 정리는 무손실이 아니다).
  const source = readWorkspace();
  assert.doesNotMatch(source, /\bdata\.scopeQuestionUids\b|\bdraft\.scopeQuestionUids\b|\brecord\.scopeQuestionUids\b|\bd\.scopeQuestionUids\b/);
  assert.match(source, /if \(data\[key\] === undefined\) continue;/);
});
