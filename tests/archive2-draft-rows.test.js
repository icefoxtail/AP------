// 초안의 rows[].scopeQuestionUids(그 행의 범위 안 uid 전체)는 단원 목록으로 다시 만들 수 있는 행에서만 빼고 저장하고, 열 때 현재 카탈로그의
// planRows() 목록 + 그 행에서 뽑은 문항으로 채운다. 못 만드는 범위(uid 경로·수정본·학교별 기출 선택 등)는 목록을 그대로 저장한다.
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
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace, readWorkspace } = require('./helpers/archive2-workspace-source.cjs');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
Tree.setGroups(JSON.parse(read('data/archive2-subunit-groups.json')));
const plain = v => JSON.parse(JSON.stringify(v));
const GRADE = '중2';

const base = withTestAssignments(structuredClone(catalog));
const finderCache = new WeakMap();
const finderOf = data => { if (!finderCache.has(data)) finderCache.set(data, core.buildFinderIndex(data)); return finderCache.get(data); };

function harness(data = base, extra = {}) {
  const storage = new Map(), nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { innerHTML: '', textContent: '', dataset: {}, setAttribute() {}, addEventListener() {}, querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {} });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    console: { ...console, log() {} }, crypto, URL, URLSearchParams, structuredClone, queueMicrotask: () => {},
    location: new URL('https://archive.test/archive/workspace.html'), history: { pushState() {}, replaceState() {} }, scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: k => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v), removeItem: k => storage.delete(k) },
    document: { baseURI: 'https://archive.test/archive/workspace.html', getElementById: node, querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} }, addEventListener() {} },
    addEventListener() {}, fetch: async () => { throw new Error('no network'); },
    Archive2Core: core, Archive2UnifiedUnits: Unified, Archive2QuickPools: Quick, Archive2UnitTree: Tree,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'), Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'), Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'), Archive2Source: archiveSource, ...extra,
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    render = () => {}; save = () => {};
    globalThis.workspaceTest = { state, scopeOptions, planRows, request, pool, draft, applyDraft, generate };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map(r => [r.questionUid, r]));
  w.state.finderIndex = finderOf(data);
  w.state.indexVersion = data.indexVersion;
  return { w, ctx };
}
// 학년 범위의 큰 대단원 몇 개를 골라 실제 generate()로 문제지를 만든다.
function generated({ distribution = 'equal', pick = 3, count = 12, data = base } = {}) {
  const { w } = harness(data);
  w.state.filters = { grade: GRADE };
  const scopes = w.scopeOptions().filter(s => !s.unclassified && s.count > 0).sort((a, b) => b.count - a.count).slice(0, pick);
  w.state.scopes = scopes.map(s => s.key);
  w.state.distribution = distribution;
  w.state.count = count;
  w.state.rows = w.planRows();
  w.generate();
  assert.ok(w.state.selected.length > 0, 'a paper was generated');
  return { w, scopes };
}
const listsOf = rows => Object.fromEntries(plain(rows).map(r => [r.id, r.scopeQuestionUids]));

for (const distribution of ['equal', 'pool']) {
  test(`${distribution}: 목록을 뺀 초안은 작고, 열면 저장 당시와 같은 목록(순서까지)이 돌아오며 저장 요청 범위도 같다`, () => {
    const { w } = generated({ distribution });
    const frozen = listsOf(w.state.rows), requestBefore = plain(w.request(true).filters.scopeQuestionUids);
    const d = plain(w.draft());
    assert.ok(d.rows.length >= 1 && d.rows.every(r => r.scopeUidsOmitted === true && !('scopeQuestionUids' in r)));
    const full = Buffer.byteLength(JSON.stringify({ ...d, rows: plain(w.state.rows) }));
    assert.ok(Buffer.byteLength(JSON.stringify(d)) < full * 0.9, 'the draft got smaller');
    const opened = harness().w;
    opened.applyDraft(structuredClone(d));
    assert.deepEqual(listsOf(opened.state.rows), frozen, 'same lists, same order');
    assert.equal(opened.state.rows.some(r => 'scopeUidsOmitted' in r), false, 'the marker does not stay in memory');
    assert.deepEqual(plain(opened.request(true).filters.scopeQuestionUids), requestBefore);
    assert.deepEqual(plain(opened.state.selected).map(r => r.questionUid), plain(w.state.selected).map(r => r.questionUid));
  });
}

test('단원 목록으로 못 만드는 범위는 목록을 그대로 저장한다(uid 경로·수정본·학교별 기출 선택·행이 범위·분배와 안 맞음)', () => {
  const { w } = generated();
  const keep = (label) => {
    const d = plain(w.draft());
    assert.ok(d.rows.every(r => Array.isArray(r.scopeQuestionUids) && !('scopeUidsOmitted' in r)), label);
  };
  assert.ok(plain(w.draft()).rows.every(r => r.scopeUidsOmitted), 'baseline: rebuildable');
  const restore = (change, label) => { const saved = {}; for (const k of Object.keys(change)) saved[k] = w.state[k]; Object.assign(w.state, change); keep(label); Object.assign(w.state, saved); };
  restore({ uidRoute: { scopes: [], error: null } }, 'uid route');
  restore({ derivationSource: { parentKind: 'SAVED_PAPER' } }, 'saved paper revision/fork');
  restore({ sources: ['exams/x.js'] }, 'school exam sources');
  restore({ scopes: [] }, 'no scopes');
  restore({ distribution: 'pool' }, 'rows are not the pool row');
  restore({ scopes: w.state.scopes.slice(1) }, 'a row id is no longer a chosen scope');
  restore({ composeStale: true }, 'filters changed after the paper was made (stored lists differ from the current calculation)');
  restore({ rows: [{ id: 'saved-paper-revision', scopeQuestionUids: ['a'], paths: [], count: 1 }] }, 'revision row');
  assert.ok(plain(w.draft()).rows.every(r => r.scopeUidsOmitted), 'back to rebuildable after restoring state');
});

test('옛 초안(목록 있음, 표시 없음)은 그대로 열린다: 저장된 목록을 쓰고 다시 계산하지 않는다', () => {
  const { w } = generated();
  const old = { ...plain(w.draft()), rows: plain(w.state.rows) };
  assert.ok(old.rows.every(r => Array.isArray(r.scopeQuestionUids) && !('scopeUidsOmitted' in r)));
  old.rows[0].scopeQuestionUids = [...old.rows[0].scopeQuestionUids, 'qid_v1_' + '0'.repeat(64)]; // 저장 당시에만 있던 uid
  const opened = harness().w;
  opened.applyDraft(structuredClone(old));
  assert.deepEqual(listsOf(opened.state.rows), listsOf(old.rows), 'exactly as saved');
});

test('카탈로그가 바뀐 뒤 열어도 선정 문항은 모든 행의 범위 안에 남고, 서버의 범위 검사(core.matches)를 통과한다', () => {
  const { w } = generated({ pick: 2, count: 10 });
  const d = plain(w.draft());
  const selected = new Set(plain(w.state.selected).map(r => r.questionUid));
  const scopeUids = new Set(Object.values(listsOf(w.state.rows)).flat());
  // 선정되지 않은 범위 문항 일부를 지운 카탈로그
  const changed = structuredClone(base);
  const removed = changed.records.filter(r => scopeUids.has(r.questionUid) && !selected.has(r.questionUid)).slice(0, 8).map(r => r.questionUid);
  assert.ok(removed.length > 0, 'something to remove');
  const gone = new Set(removed);
  changed.records = changed.records.filter(r => !gone.has(r.questionUid));
  const opened = harness(changed).w;
  opened.applyDraft(structuredClone(d));
  const lists = listsOf(opened.state.rows);
  for (const row of plain(opened.state.rows)) {
    const mine = plain(opened.state.selected).filter(r => r.rowId === row.id).map(r => r.questionUid);
    assert.ok(mine.every(uid => lists[row.id].includes(uid)), `row ${row.id}: every selected uid of the row is in its range`);
    assert.ok(removed.every(uid => !lists[row.id].includes(uid)), 'uids that left the catalog are gone from the range');
  }
  const filters = plain(opened.request(true).filters);
  const outside = opened.state.selected.filter(rec => !core.matches(rec, filters, { canonicalAuthority: changed.canonicalAuthority }));
  assert.equal(outside.length, 0, 'the server replay finds every saved question inside the range');
  // 선정 문항이 카탈로그에서 사라지면 지금처럼 열기를 거절한다(이 변경과 무관)
  const missing = structuredClone(base);
  const first = [...selected][0];
  missing.records = missing.records.filter(r => r.questionUid !== first);
  assert.throws(() => harness(missing).w.applyDraft(structuredClone(d)), /현재 아카이브에 없는 문항/);
});

test('열 때 범위 키가 사라진 행은 선정 문항만으로 좁히지 않고 목록 없이 두며(안내는 기존 그대로), 나머지 행은 다시 계산한다', () => {
  const { w } = generated({ pick: 3 });
  const d = plain(w.draft());
  assert.ok(d.rows.length >= 2);
  const ghost = 'u:' + GRADE + ':NO_SUCH_SUBJECT:NO_SUCH_UNIT';
  d.scopes = [...d.scopes.filter(key => key !== plain(w.state.rows)[0].id), ghost];
  d.rows[0] = { ...d.rows[0], id: ghost };
  d.selected = d.selected.map(r => (r.rowId === plain(w.state.rows)[0].id ? { ...r, rowId: ghost } : r));
  const opened = harness().w;
  opened.applyDraft(structuredClone(d));
  const rows = plain(opened.state.rows);
  const ghostRow = rows.find(r => r.id === ghost);
  const picked = plain(opened.state.selected).filter(r => r.rowId === ghost).map(r => r.questionUid);
  assert.ok(picked.length > 0 && !('scopeQuestionUids' in ghostRow) && !('scopeUidsOmitted' in ghostRow), 'no list, so the saved request recomputes the (wider) range from the row paths');
  const covered = new Set(plain(opened.request(true).filters.scopeQuestionUids));
  assert.ok(picked.every(uid => covered.has(uid)), 'the range still holds every picked question');
  for (const row of rows.filter(r => r.id !== ghost)) assert.ok(row.scopeQuestionUids.length >= 1);
  assert.ok(opened.state.scopeNotice, 'the existing notice about dropped scopes is still shown');
});

test('검증과 호환: 표시는 true만 허용하고, 목록 없는 행도 통과하며, 복원 코드는 표시 없는 행을 건드리지 않는다', () => {
  const { w } = generated();
  const d = plain(w.draft());
  const open = data => harness().w.applyDraft(structuredClone(data));
  assert.throws(() => open({ ...d, rows: d.rows.map(r => ({ ...r, scopeUidsOmitted: 'yes' })) }), /형식이 올바르지 않아/);
  assert.throws(() => open({ ...d, rows: d.rows.map(r => ({ ...r, scopeUidsOmitted: false })) }), /형식이 올바르지 않아/);
  // 목록도 표시도 없는 행(옛 코드가 새 초안을 읽는 모양): 열린다. 범위는 경로 조건으로 다시 계산된다(줄어들지 않는다).
  const bare = { ...d, rows: d.rows.map(({ scopeUidsOmitted, ...rest }) => rest) };
  const opened = harness().w;
  opened.applyDraft(structuredClone(bare));
  assert.ok(opened.state.rows.every(r => !('scopeQuestionUids' in r)));
  const frozen = new Set(Object.values(listsOf(w.state.rows)).flat());
  const fallback = new Set(plain(opened.request(true).filters.scopeQuestionUids));
  assert.ok([...frozen].every(uid => fallback.has(uid)), 'the path-based fallback covers the original range');
  assert.match(readWorkspace(), /scopeUidsOmitted/);
});

// 고등 소단원 묶음 키(대단원키~묶음키): 묶음표는 비동기로 읽혀 열 때 아직 없을 수 있으므로 목록을 빼고 저장하지 않는다.
function generatedHighChildren(distribution) {
  const { w } = harness();
  w.state.filters = { grade: '고1' };
  const parent = w.scopeOptions().filter(s => !s.unclassified && (s.children || []).filter(c => c.count > 0).length >= 2).sort((a, b) => b.count - a.count)[0];
  assert.ok(parent, 'a 고1 unit with at least two sub-unit groups');
  w.state.scopes = parent.children.filter(c => c.count > 0).slice(0, 2).map(c => c.key);
  w.state.distribution = distribution;
  w.state.count = 6;
  w.state.rows = w.planRows();
  w.generate();
  assert.ok(w.state.selected.length > 0, 'a paper was generated');
  return w;
}
const reloadGroups = () => Tree.setGroups(JSON.parse(read('data/archive2-subunit-groups.json')));

for (const distribution of ['equal', 'pool']) {
  test(`고등 소단원 묶음 키 ${distribution}: 목록째 저장하고, 표시가 붙은 옛 판본 초안도 묶음표 없이 열어 범위가 좁아지지 않는다`, () => {
    const w = generatedHighChildren(distribution);
    assert.ok(w.state.scopes.every(key => key.includes('~')));
    const frozen = listsOf(w.state.rows), requestBefore = new Set(plain(w.request(true).filters.scopeQuestionUids));
    const d = plain(w.draft());
    assert.ok(d.rows.every(r => Array.isArray(r.scopeQuestionUids) && !('scopeUidsOmitted' in r)), 'saved with the lists, no marker');
    assert.deepEqual(Object.fromEntries(d.rows.map(r => [r.id, r.scopeQuestionUids])), frozen);
    // 이미 표시로 저장된 초안(이 판본의 이전 모양)을 만들어 묶음표 미로드 상태에서 연다
    const marked = { ...d, rows: d.rows.map(({ scopeQuestionUids, ...rest }) => ({ ...rest, scopeUidsOmitted: true })) };
    try {
      Tree.resetGroups();
      const opened = harness().w;
      opened.applyDraft(structuredClone(marked));
      assert.equal(opened.state.rows.some(r => 'scopeUidsOmitted' in r), false);
      const after = new Set(plain(opened.request(true).filters.scopeQuestionUids));
      assert.ok([...requestBefore].every(uid => after.has(uid)), 'the range is not narrower than when it was saved');
      assert.ok(plain(opened.state.selected).every(r => after.has(r.questionUid)), 'every picked question is inside the range');
      assert.ok(after.size > opened.state.selected.length, 'more than just the picked questions');
    } finally { reloadGroups(); }
    // 목록째 저장한 초안은 묶음표가 없어도 저장된 목록 그대로 열린다
    try {
      Tree.resetGroups();
      const opened = harness().w;
      opened.applyDraft(structuredClone(d));
      assert.deepEqual(listsOf(opened.state.rows), frozen, 'exactly as saved');
    } finally { reloadGroups(); }
  });
}

// ---- 기준 시험지로 다시 만들기(화면): 고른 문항 UID 목록 → 문제지 만들기 → 저장 요청 → 서버 재현 ----
const Derive = require('../archive/archive2-derive.js');
function workerFilterKeys() {
  const text = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/helpers/archive-saved-papers.js'), 'utf8');
  const body = /const FILTER_KEYS = new Set\(\[([\s\S]*?)\]\)/.exec(text);
  assert.ok(body, 'the Worker declares FILTER_KEYS');
  const keys = new Set([...body[1].matchAll(/"([^"]+)"/g)].map(match => match[1]));
  assert.ok(keys.has('grade') && keys.has('scopeQuestionUids'), 'the parsed Worker key list is the real one');
  return keys;
}
const sourceWith = blank => ({ restore: async records => records.map(r => ({ questionUid: r.questionUid, answer: blank.has(r.questionUid) ? '' : '1', solution: blank.has(r.questionUid) ? '' : '해설' })) });
function deriveHarness(blank = new Set(), basePaper = null) {
  const paper = basePaper || generated({ pick: 3, count: 12 }).w;
  const baseRecords = plain(paper.state.selected);
  const baseUids = baseRecords.map(r => r.questionUid);
  const h = harness(base, { Archive2Derive: Derive, Archive2Source: sourceWith(blank) });
  const api = h.ctx.Archive2Workspace.api, V = h.ctx.Archive2Workspace.v;
  const body = () => h.ctx.document.getElementById('modal-body').innerHTML;
  return { ...h, api, V, baseUids, baseRecords, body, paper };
}
const startDerive = H => H.api.deriveStartFromItems(H.baseUids.map(uid => ({ uid })), { title: '테스트 기준' });

test('다시 뽑은 문제지 → 문제지 만들기 → 실제 저장 요청 범위 → 서버 재현 통과, 초안을 다시 열어도 같다', async () => {
  const H = deriveHarness();
  const { w, api, V, baseUids } = H;
  startDerive(H);
  await api.deriveAction('derive-run', {});
  const result = V.derive.dlg.result;
  assert.ok(result.items.length > 0, 'something was derived');
  assert.ok(result.items.every(r => !baseUids.includes(r.questionUid)), 'no base question comes back');
  assert.match(H.body(), /문항/, 'the result is told in names');
  assert.doesNotMatch(H.body(), /templateKey|problemTypeKey|qid_v1_/, 'no internal key on the screen');
  await api.deriveAction('derive-compose', {});
  const picked = plain(w.state.selected).map(r => r.questionUid);
  const wanted = result.items.map(r => r.questionUid);
  assert.ok(picked.length > 0 && picked.every(uid => wanted.includes(uid)), 'every question of the paper is a derived one');
  assert.ok(w.state.derive && w.state.derive.resultUids.length === wanted.length);
  // the request the save sends: only keys the Worker knows, and the Worker's replay (core.matches + general eligibility) accepts each question
  const req = w.request(true);
  assert.deepEqual(Object.keys(req.filters).filter(key => !workerFilterKeys().has(key)), [], 'the server answers 409 for an unknown key');
  for (const record of w.state.selected) {
    assert.equal(core.matches(record, req.filters, { canonicalAuthority: base.canonicalAuthority }), true, 'selection_filters accept ' + record.questionUid);
    assert.equal(core.generalUseEligibility(record).ok, true);
  }
  for (const row of req.rows) assert.equal(w.state.selected.filter(r => r.rowId === row.id).length, row.count, 'row counts match the selection');
  assert.ok(req.filters.scopeQuestionUids.length >= picked.length);
  // reopen the draft: the same paper, and the note that tells how it was made
  const draft = plain(w.draft());
  const opened = harness(base, { Archive2Derive: Derive });
  opened.w.applyDraft(structuredClone(draft));
  assert.deepEqual(plain(opened.w.state.selected).map(r => r.questionUid), picked);
  assert.deepEqual(plain(opened.w.state.derive), plain(w.state.derive));
  assert.match(opened.ctx.Archive2Workspace.api.deriveNoteMarkup(), /다시 만들기/);
  // a changed paper no longer claims to be the derived one
  opened.w.state.selected = opened.w.state.selected.slice(1);
  assert.equal(opened.ctx.Archive2Workspace.api.deriveNoteMarkup(), '');
  // a draft with a broken derive record is refused, not half-applied
  const broken = structuredClone(draft);
  broken.derive.typeMode = 'x';
  assert.throws(() => harness(base, { Archive2Derive: Derive }).w.applyDraft(broken), /형식이 올바르지 않아/);
  // 다시 뽑기: what was just given is left out of the next result
  const before = new Set(wanted);
  await api.deriveAction('derive-compose-again', {});
  const again = V.derive.dlg.result;
  assert.ok(again && again.items.every(r => !before.has(r.questionUid) && !baseUids.includes(r.questionUid)), 'the new result leaves out the earlier one and the base');
});

test('정답·해설이 빈 문항은 기본으로 빠지고 기억된다', async () => {
  const probe = deriveHarness();
  startDerive(probe);
  await probe.api.deriveAction('derive-run', {});
  const first = probe.V.derive.dlg.result.items.map(r => r.questionUid)[0];
  assert.ok(first, 'the probe derived something');
  const H = deriveHarness(new Set([first]), probe.paper);
  startDerive(H);
  H.V.derive.dlg.seed = probe.V.derive.dlg.seed;
  await H.api.deriveAction('derive-run', {});
  assert.equal(H.V.derive.dlg.result.items.some(r => r.questionUid === first), false, 'the empty question is not given');
  assert.ok(H.V.derive.blank.has(first), 'and it is remembered as empty');
});

test('UID가 없는 옛 출제본은 원본 파일·순번으로 되찾고, 못 찾으면 지원하지 않는다고 알린다', () => {
  const H = deriveHarness();
  const items = H.baseRecords.map(r => ({ uid: '', file: r.sourceFile, ordinal: r.sourceOrdinal, no: '' }));
  const found = H.api.deriveResolveBase(items);
  assert.deepEqual([...found.uids].sort(), [...new Set(H.baseUids)].sort(), 'every question is found again from file + ordinal');
  assert.equal(found.recovered, H.baseUids.length);
  H.api.deriveStartFromItems([{ uid: '' }, { uid: '', file: 'nowhere/none.js', ordinal: 3 }], {});
  assert.match(H.body(), /옛 형식 출제본이라 다시 뽑기를 지원하지 않습니다/);
  assert.equal(H.V.derive.dlg, null, 'no dialog of choices opens for a paper that cannot be traced');
});
