// S9: compose restricted to exactly the question UIDs named by repeated `uid` URL parameters
// (Meta search -> select -> compose). Runs on the real production catalog; the route reuses the
// scopeQuestionUids machinery and fails closed for unknown / unusable / cross-grade selections.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const Unified = require('../archive/archive2-unified-units.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');

let catalogPromise;
const catalog = () => (catalogPromise ||= productionCatalog().then(result => result.data));

function harness(data) {
  const events = new Map(), nodes = new Map(), storage = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', textContent: '', dataset: {},
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone,
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      baseURI: 'https://archive.test/archive/workspace.html',
      getElementById: node, querySelector: () => null, querySelectorAll: () => [],
      body: { dataset: {} },
      addEventListener: (name, callback) => {
        if (!events.has(name)) events.set(name, []);
        events.get(name).push(callback);
      },
    },
    addEventListener() {},
    fetch: async url => ({ ok: true, json: async () => JSON.parse(read(new URL(String(url)).pathname.replace(/^\/archive\//, ''))) }),
    Archive2Core: core,
    Archive2UnifiedUnits: Unified,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: archiveSource,
  });
  ctx.window = ctx;
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  vm.runInContext(source.slice(0, startup) + `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {state, scopeOptions, renderScopes, renderHealth, unifiedHealth, unifiedIndex, planRows, request, pool,
      draft, applyDraft, generate, review, applySourceRoute, applyUidRoute, clearUidRoute, syncUidRoute, readUrl, routeUrl, newDraft, renderUidRoute, filterMarkup, reconcileUnifiedFilters, compactSaveFilters,
      selectedScopeOptions, workspaceMatches, workspaceEligibility, applySavedPaperRevision,
      findExams, reconcileFinderFilters, finderPrimaryFilterMarkup, finderDetailFilterMarkup, renderComposition};
  })();`, ctx);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.useMode = 'general';
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = core.buildFinderIndex(data);
  w.state.indexVersion = data.indexVersion;
  return {
    w, ctx,
    async change(group, filter, value) {
      for (const callback of events.get('change') || [])
        await callback({ target: { dataset: { group, filter }, value } });
    },
  };
}


function open(w, uids) {
  w.state.view = 'compose';
  w.state.urlUids = uids;
  w.applyUidRoute();
}
function pickUids(w, grade, count) {
  const index = w.unifiedIndex();
  const picked = [];
  const files = new Set();
  for (const entry of index.views[grade]) {
    if (!w.workspaceEligibility(entry.record).ok || files.has(entry.record.sourceFile)) continue;
    files.add(entry.record.sourceFile);
    picked.push(entry.record.questionUid);
    if (picked.length === count) break;
  }
  return picked;
}

test('three UIDs from different exams restrict compose to exactly those questions and generate exactly them', async () => {
  const data = await catalog();
  const { w } = harness(data);
  const uids = pickUids(w, '고1', 3);
  assert.equal(uids.length, 3);
  open(w, uids);
  const route = w.state.uidRoute;
  assert.equal(route.error, '');
  assert.deepEqual(plain(route.records.map(record => record.questionUid)), uids);
  assert.equal(w.state.filters.grade, '고1');
  assert.deepEqual(plain(w.state.scopes), ['uid-selection']);
  assert.equal(w.state.distribution, 'all');
  const scopes = w.scopeOptions();
  assert.equal(scopes.length, 1);
  assert.deepEqual(plain(scopes[0].scopeQuestionUids), uids);
  assert.deepEqual(plain(w.pool().map(record => record.questionUid).sort()), [...uids].sort());
  const req = w.request();
  assert.deepEqual(plain(req.filters.scopeQuestionUids), uids);
  assert.equal(req.rows.length, 1);
  assert.equal(req.rows[0].count, 3);
  w.generate();
  assert.deepEqual(plain(w.state.selected.map(record => record.questionUid).sort()), [...uids].sort());
  // the URL carries the same UIDs, in order, and reading it back reproduces the route
  const url = w.routeUrl();
  assert.deepEqual(plain(url.searchParams.getAll('uid')), uids);
  assert.equal(url.searchParams.get('view'), 'compose');
});

test('a UID route survives a URL round trip and is dropped with its restriction when the URL no longer names UIDs', async () => {
  const data = await catalog();
  const { w, ctx } = harness(data);
  const uids = pickUids(w, '고1', 2);
  ctx.location = new URL('https://archive.test/archive/workspace.html?view=compose&' + uids.map(uid => 'uid=' + uid).join('&') + '&uid=' + uids[0]);
  w.readUrl();
  assert.deepEqual(plain(w.state.urlUids), uids, 'repeated and duplicate uid values are read once, in order');
  w.syncUidRoute();
  assert.deepEqual(plain(w.state.uidRoute.records.map(record => record.questionUid)), uids);
  ctx.location = new URL('https://archive.test/archive/workspace.html?view=compose');
  w.readUrl();
  w.syncUidRoute();
  assert.equal(w.state.uidRoute, null);
  assert.deepEqual(plain(w.state.scopes), []);
  assert.equal(w.state.distribution, 'equal');
});

test('unknown UIDs fail closed: nothing is selectable and the message names them', async () => {
  const data = await catalog();
  const { w } = harness(data);
  w.state.filters = { grade: '고1' };
  const [good] = pickUids(w, '고1', 1);
  const unknown = 'qid_v1_' + '0'.repeat(64);
  open(w, [good, unknown]);
  const route = w.state.uidRoute;
  assert.match(route.error, /1문항을 사용할 수 없어/);
  assert.deepEqual(plain(route.rejected), [{ uid: unknown, reason: 'UNKNOWN_UID' }]);
  assert.deepEqual(plain(w.scopeOptions()), []);
  assert.deepEqual(plain(w.pool()), []);
  assert.deepEqual(plain(w.planRows()), []);
  const html = w.renderScopes();
  assert.match(html, /role="alert"/);
  assert.match(html, /목록에 없는 문항/);
  assert.match(html, new RegExp(unknown.slice(0, 24)));
  assert.doesNotMatch(html, /data-scope=/);
  w.generate();
  assert.equal(w.state.selected.length, 0);
  assert.equal(w.state.filters.grade, '고1', 'a failed route keeps the current filters');
  w.clearUidRoute({ url: false });
  assert.ok(w.scopeOptions().length > 0, 'clearing a failed route returns to the normal unit list');
});

test('records that fail the technical gates (identity, source reference, unit placement) are rejected, never silently dropped', async () => {
  const data = await catalog();
  for (const [change, reason] of [
    [{ identityStatus: 'UNRESOLVED' }, 'IDENTITY'],
    [{ sourceFingerprint: '' }, 'SOURCE'],
    [{ sourceIntegrityStatus: 'UNRESOLVED' }, 'SOURCE'],
  ]) {
    const { w } = harness(data);
    const [uid, other] = pickUids(w, '고1', 2);
    w.state.byUid.set(uid, { ...w.state.byUid.get(uid), ...change });
    open(w, [other, uid]);
    assert.deepEqual(plain(w.state.uidRoute.rejected), [{ uid, reason }], JSON.stringify(change));
    assert.deepEqual(plain(w.pool()), []);
  }
});

test('review/quality annotations on the original are not usage gates for a UID route', async () => {
  const data = await catalog();
  const { w } = harness(data);
  const [uid, other] = pickUids(w, '고1', 2);
  w.state.byUid.set(uid, { ...w.state.byUid.get(uid), sourceIssueHold: true, sourceDefectCandidate: true,
    sourceQualityDisposition: 'SOURCE_BLOCKED', sourceStatus: 'HOLD', reviewStatus: 'HOLD' });
  open(w, [uid, other]);
  assert.equal(w.state.uidRoute.error, '');
  assert.equal(w.state.uidRoute.records.length, 2);
});

test('questions that cannot share one grade view fail closed with an explicit message', async () => {
  const data = await catalog();
  const { w } = harness(data);
  const [middle] = pickUids(w, '중2', 1);
  const [high] = pickUids(w, '고1', 1);
  open(w, [middle, high]);
  assert.match(w.state.uidRoute.error, /서로 다른 학년/);
  assert.deepEqual(plain(w.pool()), []);
  assert.deepEqual(plain(w.planRows()), []);
});

test('more than 400 UIDs fail closed, and clearing the route returns to the unrestricted list', async () => {
  const data = await catalog();
  const { w } = harness(data);
  open(w, Array.from({ length: 401 }, (_, i) => 'qid_v1_' + String(i).padStart(64, '0')));
  assert.match(w.state.uidRoute.error, /400문항까지/);
  assert.deepEqual(plain(w.scopeOptions()), []);
  w.clearUidRoute({ url: false });
  assert.equal(w.state.uidRoute, null);
  w.state.filters = { grade: '고1' };
  assert.ok(w.scopeOptions().length > 0, 'the normal unit list is back');
  assert.ok(w.scopeOptions().every(scope => scope.key !== 'uid-selection'));
});

test('a UID route over a restored draft or a new draft is dropped so the draft owns its own scopes', async () => {
  const data = await catalog();
  const { w } = harness(data);
  const uids = pickUids(w, '고1', 2);
  open(w, uids);
  w.newDraft();
  assert.equal(w.state.uidRoute, null);
  assert.deepEqual(plain(w.state.urlUids), []);
  assert.deepEqual(plain(w.state.scopes), []);
});
