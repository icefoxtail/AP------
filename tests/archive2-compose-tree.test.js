// 문제지 만들기 단원 목록 2단(2026-11-16, 계획 작업 3b): 대단원 아래 중단원(고등은 소단원 묶음).
// 자료는 매일 늘어나므로 정확한 문항 수는 고정하지 않고 결함 조건을 본다:
//   중단원 목록 = 정본 목차(누락 0, 순서 일치), 중단원 문항 합 + 중단원 미지정 = 대단원 문항 수(한 문항은 한 줄에만),
//   기존 대단원 키로 저장한 초안은 같은 문항 수로 복원, 자식 키는 다시 계산해도 같은 안정 키, 메타 거르기는 중단원 선택을 따른다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const Unified = require('../archive/archive2-unified-units.js');
const Quick = require('../archive/archive2-quick-pools.js');
const Tree = require('../archive/archive2-unit-tree.js');
const Toc = require('../archive/rpm-middle-toc.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace } = require("./helpers/archive2-workspace-source.cjs");

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const groupsDoc = JSON.parse(read('data/archive2-subunit-groups.json'));

let sharedCatalog = null, sharedFinderIndex = null;
function harness() {
  if (!sharedCatalog) {
    sharedCatalog = withTestAssignments(structuredClone(catalog));
    sharedFinderIndex = core.buildFinderIndex(sharedCatalog);
  }
  const data = sharedCatalog;
  const events = new Map(), nodes = new Map(), storage = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', textContent: '', dataset: {},
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const document = {
    baseURI: 'https://archive.test/archive/workspace.html',
    getElementById: node, querySelector: () => null, querySelectorAll: () => [],
    body: { dataset: {} },
    addEventListener: (name, callback) => {
      if (!events.has(name)) events.set(name, []);
      events.get(name).push(callback);
    },
  };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone, queueMicrotask: () => {},
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document,
    addEventListener() {},
    fetch: async url => ({ ok: true, json: async () => JSON.parse(read(new URL(String(url)).pathname.replace(/^\/archive\//, ''))) }),
    Archive2Core: core,
    Archive2UnifiedUnits: Unified,
    Archive2QuickPools: Quick,
    Archive2UnitTree: Tree,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: archiveSource,
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {state, scopeOptions, renderScopes, planRows, request, pool, draft, applyDraft, newDraft, invalidate,
      selectedScopeOptions, composeMetaFacets, scopeUnitMarkup};
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = sharedFinderIndex;
  w.state.indexVersion = data.indexVersion;
  return {
    w, ctx, document, events,
    async click(dataset) {
      for (const callback of events.get('click') || [])
        await callback({ target: { closest: () => ({ dataset }) } });
    },
    async check(key, checked) {
      for (const callback of events.get('change') || [])
        await callback({ target: { dataset: { scope: key }, type: 'checkbox', checked } });
    },
  };
}

const MIDDLE = [['m1', '중1'], ['m2', '중2'], ['m3', '중3']];
const chapterNames = child => child.childKind === 'chapter';

test('중등: 중단원 목록은 정본 목차와 같다(누락 0, 순서 일치), 중단원 + 미지정 문항 수의 합이 대단원 문항 수다', () => {
  Tree.setGroups(groupsDoc);
  const { w } = harness();
  for (const [, grade] of MIDDLE) {
    w.state.filters = { grade };
    w.state.scopes = [];
    const scopes = w.scopeOptions();
    assert.ok(scopes.length > 0, `${grade} 대단원 목록`);
    let withChildren = 0;
    for (const scope of scopes) {
      const unitKey = scope.key.split(':').pop();
      if (scope.unclassified) { assert.equal(scope.children, undefined, '단원 미분류에는 중단원이 없다'); continue; }
      const expected = Toc.parents(grade).filter(parent => parent.unitKey === unitKey)
        .sort((a, b) => (a.orderInUnit || 0) - (b.orderInUnit || 0)).map(parent => parent.L2);
      assert.ok(scope.children?.length, `${grade} ${scope.label}에는 중단원이 있다`);
      withChildren += 1;
      assert.deepEqual(scope.children.filter(chapterNames).map(child => child.label), expected,
        `${grade} ${scope.label}의 중단원은 정본 목차와 같은 순서(누락 0)`);
      assert.equal(scope.children.reduce((sum, child) => sum + child.count, 0), scope.count,
        `${grade} ${scope.label}: 중단원 합 + 미지정 = 대단원 문항 수`);
      const none = scope.children.filter(child => child.childKind === 'none');
      assert.ok(none.length <= 1);
      assert.equal(none.length ? none[0].label : '중단원 미지정', '중단원 미지정');
      const uids = scope.children.flatMap(child => child.scopeQuestionUids);
      assert.equal(new Set(uids).size, uids.length, '한 문항은 한 줄에만');
      assert.deepEqual([...uids].sort(), [...scope.scopeQuestionUids].sort(), '중단원 문항을 모으면 대단원 문항이다');
      const names = scope.children.map(child => child.label);
      assert.equal(new Set(names).size, names.length, '같은 대단원 안 중복 이름 0');
      for (const child of scope.children) {
        assert.ok(child.key.startsWith(scope.key + '~'), '자식 키는 대단원 키로 시작한다');
        assert.equal(scope.children.length > 0 && child.parentKey, scope.key);
      }
    }
    assert.ok(withChildren > 0, `${grade}: 중단원이 있는 대단원이 있다`);
  }
});

test('중등 자식 키는 정본 parentKey의 안정 키이고 다시 계산해도 같다(목차 서수가 아니다)', () => {
  Tree.setGroups(groupsDoc);
  const first = harness(), second = harness();
  for (const [profileId, grade] of MIDDLE) {
    for (const h of [first, second]) { h.w.state.filters = { grade }; h.w.state.scopes = []; }
    const a = first.w.scopeOptions(), b = second.w.scopeOptions();
    const tree = Tree.createTree(profileId, Unified.unitsForGrade(grade).map(unit => ({ key: unit.key, name: unit.name })));
    for (const scope of a) {
      if (!scope.children) continue;
      const unitKey = scope.key.split(':').pop();
      assert.deepEqual(scope.children.map(child => child.key), b.find(other => other.key === scope.key).children.map(child => child.key));
      assert.deepEqual(scope.children.filter(chapterNames).map(child => child.childKey),
        tree.childrenOf(unitKey).filter(child => child.kind === 'chapter').map(child => child.key));
      for (const child of scope.children.filter(chapterNames)) assert.match(child.childKey, /^m[0-9a-f]{8}$/);
    }
  }
});

test('고등: 대단원 아래 소단원 묶음이 정본 묶음표 순서로 나오고 합이 대단원 문항 수다', () => {
  Tree.setGroups(groupsDoc);
  const { w } = harness();
  for (const grade of ['고1', '고2']) {
    w.state.filters = { grade };
    w.state.scopes = [];
    const scopes = w.scopeOptions();
    const withChildren = scopes.filter(scope => scope.children?.length);
    assert.ok(withChildren.length > 0, `${grade}: 묶음이 있는 단원이 있다`);
    for (const scope of withChildren) {
      assert.equal(scope.children.reduce((sum, child) => sum + child.count, 0), scope.count, `${grade} ${scope.label}: 합 = 대단원`);
      const names = scope.children.map(child => child.label);
      assert.equal(new Set(names).size, names.length, `${grade} ${scope.label}: 중복 이름 0`);
      assert.deepEqual(names.filter(name => /[A-Za-z]{2,}|핵심\s*개념/.test(name)), [], '영문·핵심 개념 이름은 보이지 않는다');
    }
  }
});

test('기존 대단원 키로 저장한 초안은 같은 문항 수로 복원되고 옛 키의 뜻은 바뀌지 않는다', () => {
  Tree.setGroups(groupsDoc);
  const { w } = harness();
  w.state.filters = { grade: '중1' };
  const parent = w.scopeOptions().filter(scope => scope.children?.length).sort((a, b) => b.count - a.count)[0];
  assert.ok(parent && parent.count > 0);
  w.state.scopes = [parent.key];
  const before = w.pool().length;
  assert.equal(w.selectedScopeOptions().length, 1);
  assert.equal(w.selectedScopeOptions()[0].count, parent.count);
  // 새 저장물과 같은 모양의 초안(대단원 키만)을 저장했다가 되돌린다.
  const saved = JSON.parse(JSON.stringify(w.draft()));
  assert.deepEqual(saved.scopes, [parent.key]);
  w.state.scopes = [];
  w.state.filters = { grade: '고1' };
  w.applyDraft(saved);
  assert.deepEqual([...w.state.scopes], [parent.key], '대단원 키 그대로 복원');
  assert.equal(w.state.scopeNotice, '', '옛 키는 제외 안내 없이 복원');
  assert.equal(w.pool().length, before, '같은 문항 수');
  assert.equal(w.planRows().length, 1);
  assert.equal(w.planRows()[0].scopeQuestionUids.length, parent.count);
  // 같은 대단원 키 + 그 자식 키가 함께 있어도 대단원이 우선이다(중복 없음).
  w.state.scopes = [parent.key, parent.children[0].key];
  assert.equal(w.selectedScopeOptions().length, 1);
  assert.equal(w.pool().length, before);
});

test('중단원만 고르면 고른 중단원의 문항만 들어가고, 초안 저장·복원도 같은 문항이다', async () => {
  Tree.setGroups(groupsDoc);
  const h = harness();
  const { w } = h;
  w.state.filters = { grade: '중1' };
  const parent = w.scopeOptions().filter(scope => scope.children?.some(child => child.childKind === 'chapter' && child.count > 0))
    .sort((a, b) => b.count - a.count)[0];
  const chosen = parent.children.filter(child => child.childKind === 'chapter' && child.count > 0 && child.count < parent.count);
  assert.ok(chosen.length >= 1, '중단원을 하나만 골라도 대단원보다 적다');
  const one = chosen[0];
  await h.check(one.key, true);
  assert.deepEqual([...w.state.scopes], [one.key]);
  const rows = w.planRows();
  assert.equal(rows.length, 1);
  assert.deepEqual([...rows[0].scopeQuestionUids].sort(), [...one.scopeQuestionUids].sort());
  const uids = new Set(rows[0].scopeQuestionUids);
  const parentOf = uid => {
    const names = parent.children.filter(child => child.scopeQuestionUids.includes(uid)).map(child => child.label);
    return names;
  };
  for (const uid of [...uids].slice(0, 50)) assert.deepEqual(parentOf(uid), [one.label], '다른 중단원 문항이 섞이지 않는다');
  assert.equal(w.pool().length, one.count);
  assert.equal(w.request().filters.scopeQuestionUids.length, one.count);
  const saved = JSON.parse(JSON.stringify(w.draft()));
  assert.deepEqual(saved.scopes, [one.key]);
  w.state.scopes = [];
  w.applyDraft(saved);
  assert.deepEqual([...w.state.scopes], [one.key], '중단원 키가 초안에서 복원된다');
  assert.equal(w.pool().length, one.count);
  // 대단원을 체크하면 그 안의 중단원 키는 빠지고 단원 전체가 된다.
  await h.check(chosen[1] ? chosen[1].key : one.key, true);
  await h.check(parent.key, true);
  assert.deepEqual([...w.state.scopes], [parent.key]);
  assert.equal(w.pool().length, parent.count);
});

test('없어진 자식 키는 제외 안내와 함께 떨어지고 다른 키는 그대로 복원된다', () => {
  Tree.setGroups(groupsDoc);
  const { w } = harness();
  w.state.filters = { grade: '중1' };
  const parent = w.scopeOptions().find(scope => scope.children?.length);
  w.state.scopes = [parent.key, parent.key + '~m00000000'];
  const saved = JSON.parse(JSON.stringify(w.draft()));
  w.state.scopes = [];
  w.applyDraft(saved);
  assert.deepEqual([...w.state.scopes], [parent.key]);
  assert.match(w.state.scopeNotice, /1개/);
});

test('메타 거르기(개념·유형)의 후보는 고른 중단원의 문항을 따라간다', async () => {
  Tree.setGroups(groupsDoc);
  const h = harness();
  const { w } = h;
  w.state.filters = { grade: '중1' };
  w.state.scopes = [];
  const parent = w.scopeOptions().filter(scope => scope.children?.some(child => child.childKind === 'chapter' && child.count > 0))
    .sort((a, b) => b.count - a.count)[0];
  const child = parent.children.find(item => item.childKind === 'chapter' && item.count > 0 && item.count < parent.count);
  const wholeUnit = (await h.check(parent.key, true), w.composeMetaFacets());
  assert.equal(wholeUnit.poolSize, parent.count);
  await h.check(parent.key, false);
  await h.check(child.key, true);
  const onlyChild = w.composeMetaFacets();
  assert.equal(onlyChild.poolSize, child.count, '고른 중단원의 문항만 개념·유형 후보에 든다');
  assert.ok(onlyChild.poolSize < wholeUnit.poolSize);
});

test('마크업: 기본은 접힘(자식 줄 없음), 펼치면 중단원·0문항(흐림)·미지정 줄이 나오고 대단원을 체크하면 포함됨이다', async () => {
  Tree.setGroups(groupsDoc);
  const h = harness();
  const { w } = h;
  w.state.filters = { grade: '중1' };
  w.state.scopes = [];
  const scopes = w.scopeOptions();
  const parent = scopes.filter(scope => scope.children?.some(child => child.childKind === 'chapter'))
    .sort((a, b) => b.count - a.count)[0];
  const plainMarkup = w.renderScopes();
  assert.ok(!plainMarkup.includes('data-scope-subs'), '아무것도 안 골랐으면 모두 접혀 있다');
  assert.match(plainMarkup, new RegExp(`data-action="scope-expand"[^>]*data-scope-key="${parent.key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  await h.click({ action: 'scope-expand', scopeKey: parent.key });
  assert.equal(w.state.scopeUnitOpen[parent.key], true);
  const open = w.renderScopes();
  assert.ok(open.includes(`data-scope-subs="${parent.key}"`));
  for (const child of parent.children.filter(chapterNames)) assert.ok(open.includes(`data-scope="${child.key}"`), `${child.label} 줄`);
  // 조건(난이도 단계)을 좁혀 0문항 중단원을 만든다. 숫자는 현재 조건을 반영하고 0문항 줄은 흐리고 고를 수 없다.
  let zero = null;
  for (const bucket of [1, 2, 3, 4, 5]) {
    w.state.buckets = [bucket];
    const narrowed = w.scopeOptions().find(scope => scope.key === parent.key);
    zero = narrowed && narrowed.count > 0 ? narrowed.children.find(child => child.childKind === 'chapter' && child.count === 0) : null;
    if (zero) break;
  }
  assert.ok(zero, '난이도 단계를 좁히면 0문항 중단원이 생기는 시험 자료다');
  const narrowedMarkup = w.renderScopes();
  const zeroRow = narrowedMarkup.split('<div class="').find(chunk => chunk.includes(`data-scope-sub="${zero.key}"`)) || '';
  assert.match(zeroRow, /^scope-item scope-sub is-zero"/, '0문항 중단원은 흐리게 보인다');
  assert.match(zeroRow, /<input type="checkbox"[^>]*data-scope="[^"]+"[^>]*disabled>/, '0문항 중단원은 고를 수 없다');
  assert.match(zeroRow, /<small>0문항<\/small>/);
  w.state.buckets = [];
  const none = parent.children.find(child => child.childKind === 'none' && child.count > 0);
  if (none) assert.ok(open.includes('중단원 미지정') && open.includes(`${none.count}문항`));
  w.state.scopes = [parent.key];
  const implied = w.renderScopes();
  assert.match(implied, /is-implied/);
  assert.match(implied, /대단원에 포함됨/);
  // 자식 하나를 골라 둔 대단원은 접혀 있어도 처음부터 펼쳐 보인다.
  w.state.scopeUnitOpen = {};
  const child = parent.children.find(item => item.childKind === 'chapter' && item.count > 0);
  w.state.scopes = [child.key];
  const partial = w.renderScopes();
  assert.ok(partial.includes(`data-scope-subs="${parent.key}"`));
  assert.match(partial, /data-scope-partial/);
});

test('대단원이 체크된 채로 중단원 하나를 풀면 나머지 중단원 전부(+ 미지정)가 남는다: 고른 문항 수 = 대단원 - 그 중단원', async () => {
  Tree.setGroups(groupsDoc);
  const h = harness();
  const { w } = h;
  w.state.filters = { grade: '중1' };
  w.state.scopes = [];
  const parent = w.scopeOptions().filter(scope => scope.children?.some(child => child.childKind === 'chapter' && child.count > 0))
    .sort((a, b) => b.count - a.count)[0];
  const released = parent.children.find(child => child.childKind === 'chapter' && child.count > 0 && child.count < parent.count);
  assert.ok(released, '풀 수 있는 중단원');
  await h.check(parent.key, true);
  assert.equal(w.pool().length, parent.count);
  // 체크된 대단원 아래 중단원 줄은 고를 수 있다(예전에는 잠겨 있었다).
  await h.click({ action: 'scope-expand', scopeKey: parent.key });
  const row = w.renderScopes().split('<div class="').find(chunk => chunk.includes(`data-scope-sub="${released.key}"`)) || '';
  assert.doesNotMatch(row, /<input type="checkbox"[^>]*disabled>/, '대단원이 체크돼도 중단원 줄은 잠기지 않는다');
  await h.check(released.key, false);
  const keys = [...w.state.scopes];
  assert.ok(!keys.includes(parent.key), '대단원 체크는 풀린다');
  assert.ok(!keys.includes(released.key));
  const others = parent.children.filter(child => child.key !== released.key && child.count > 0);
  assert.deepEqual([...keys].sort(), others.map(child => child.key).sort(), '나머지 중단원 전부(+ 중단원 미지정)');
  assert.equal(w.pool().length, parent.count - released.count, '고른 문항 수는 대단원 - 그 중단원');
  const uids = new Set(w.request().filters.scopeQuestionUids);
  for (const uid of released.scopeQuestionUids) assert.ok(!uids.has(uid), '푼 중단원 문항은 빠진다');
});

test('전체 선택·모두·연속 범위는 대단원 키만 만들고 자식 키는 남기지 않는다', async () => {
  Tree.setGroups(groupsDoc);
  const h = harness();
  const { w } = h;
  w.state.filters = { grade: '중1' };
  w.state.scopes = [];
  const scopes = w.scopeOptions();
  const parent = scopes.find(scope => scope.children?.length);
  w.state.scopes = [parent.children[0].key];
  await h.click({ action: 'scope-all' });
  assert.ok(w.state.scopes.length > 0);
  assert.ok(w.state.scopes.every(key => !key.includes('~')), '전체 선택은 대단원 키만');
  assert.ok(w.state.scopes.includes(parent.key));
  await h.click({ action: 'scope-clear' });
  assert.deepEqual([...w.state.scopes], []);
});
