const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const { catalog, withTestAssignments } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace } = require('./helpers/archive2-workspace-source.cjs');

// 인쇄·저장·교체 때 미리보기를 다시 그리지 않고, 준비(prepare)가 두 번 돌지 않는지 본다.
// 실제 Source.restore(원본 파일 SHA·지문·UID 확인)를 그대로 쓰고, 호출만 센다.
const root = path.resolve(__dirname, '..');

function setup(t) {
  const data = withTestAssignments(structuredClone(catalog));
  const events = new Map(), nodes = new Map(), storage = new Map();
  const restoreCalls = [];
  let gate = null;
  const Source = {
    ...archiveSource,
    async restore(records, cat, options) {
      restoreCalls.push(records.map(record => record.questionUid));
      if (gate) await gate;
      return archiveSource.restore(records, cat, options);
    },
  };
  const element = () => ({
    innerHTML: '', textContent: '', dataset: {}, style: {}, offsetHeight: 0, attrs: {}, children: [], events: {},
    setAttribute(key, value) { this.attrs[key] = value; }, addEventListener(name, callback) { this.events[name] = callback; },
    replaceChildren(...children) { this.children = children; },
    querySelectorAll: () => [], classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
  });
  const node = id => { if (!nodes.has(id)) nodes.set(id, element()); return nodes.get(id); };
  const iframes = [];
  const frameDoc = { body: {}, documentElement: { dataset: {} }, querySelector: () => null, addEventListener() {} };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone,
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {}, setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    MutationObserver: class { observe() {} disconnect() {} },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      baseURI: 'https://archive.test/archive/workspace.html',
      getElementById: node, querySelector: () => null, querySelectorAll: () => [],
      body: { dataset: {} },
      createElement(tag) {
        const el = element();
        if (tag === 'iframe') { el.contentDocument = frameDoc; el.contentWindow = {}; iframes.push(el); }
        return el;
      },
      addEventListener: (name, callback) => { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    },
    addEventListener() {},
    fetch: async url => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(path.join(root, 'archive', new URL(String(url)).pathname.replace(/^\/archive\//, '')), 'utf8')) }),
    Archive2Core: core,
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
    globalThis.workspaceTest = { state, prepare, updatePreview, previewSignature, printOnce, savePapers, replaceWith, request,
      setReplacement(index, candidates) {
        showDialog = () => {};
        try { replace(index); } catch {}
        candidateRecords = candidates;
      },
      setRender: fn => { render = fn; }, setOutputUrl: fn => { outputUrl = fn; } };
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = core.buildFinderIndex(data);
  w.state.indexVersion = data.indexVersion;
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
  const eligible = data.records.filter(row => core.basicEligibility(row, { canonicalAuthority: data.canonicalAuthority }).ok);
  // 서로 다른 원본 파일에서 4문항: 파일 대조도 여러 번 일어나게 한다.
  const picked = [];
  for (const record of eligible) if (!picked.some(row => row.sourceFile === record.sourceFile)) picked.push(record);
  assert.ok(picked.length >= 6, 'fixture needs at least 6 eligible questions from distinct files');
  const select = records => { w.state.selected = records.slice(0, 4).map(record => ({ ...record, rowId: 'r' })); };
  select(picked);
  return { w, ctx, node, iframes, restoreCalls, picked, data, hold(promise) { gate = promise; }, release() { gate = null; }, select };
}

test('3 concurrent prepare() calls with the same signature restore once and share one result', async t => {
  const { w, restoreCalls } = setup(t);
  const [a, b, c] = await Promise.all([w.prepare(), w.prepare(), w.prepare()]);
  assert.equal(restoreCalls.length, 1);
  assert.equal(restoreCalls[0].length, 4);
  assert.equal(a, b);
  assert.equal(b, c);
  assert.equal(w.state.prepared, a);
  await w.prepare();
  assert.equal(restoreCalls.length, 1, 'a finished prepare is reused, not restored again');
});

test('replacing one question restores only that question and reuses the other three', async t => {
  const { w, restoreCalls, picked } = setup(t);
  const first = await w.prepare();
  const keptObjects = first[0].questions.slice();
  assert.equal(restoreCalls.length, 1);
  const replacement = picked[5];
  w.setReplacement(2, [replacement]);
  w.replaceWith(replacement);
  const second = await w.prepare();
  assert.equal(restoreCalls.length, 2);
  assert.deepEqual(restoreCalls[1], [replacement.questionUid]);
  assert.equal(second[0].questions.length, 4);
  assert.equal(second[0].questions[0], keptObjects[0]);
  assert.equal(second[0].questions[1], keptObjects[1]);
  assert.equal(second[0].questions[3], keptObjects[3]);
  assert.equal(second[0].questions[2].questionUid, replacement.questionUid);
  // 전부 새로 복원한 것과 한 글자도 다르지 않다.
  w.state.prepared = [];
  const fresh = await w.prepare();
  assert.equal(JSON.stringify(fresh), JSON.stringify(second));
});

test('reuse never skips revalidation: a tampered or source-changed question is restored again from the source', async t => {
  const { w, restoreCalls, picked } = setup(t);
  const first = await w.prepare();
  const original = first[0].questions[1].content;
  first[0].questions[1].content = String(original) + ' (tampered)';
  const replacement = picked[5];
  w.setReplacement(0, [replacement]);
  w.replaceWith(replacement);
  const second = await w.prepare();
  assert.equal(restoreCalls.length, 2);
  assert.deepEqual(restoreCalls[1].slice().sort(), [first[0].questions[1].questionUid, replacement.questionUid].sort());
  assert.equal(second[0].questions[1].content, original, 'tampered passage text must not reach the output');

  // 원본 파일 SHA가 기대값과 다르면 재사용하지 않고, 복원이 그대로 막는다.
  const file = second[0].questions[3].sourceArchiveFile;
  const hashes = new Map(w.state.catalog.sourceHashes);
  hashes.set(file, 'f'.repeat(64));
  w.state.catalog = { ...w.state.catalog, sourceHashes: [...hashes] };
  w.state.header = { ...w.state.header, title: '제목이 바뀌었습니다' };
  await assert.rejects(() => w.prepare(), /원본 파일이 변경|source/i);
});

test('a late-finishing old prepare does not overwrite the newer state', async t => {
  const { w, restoreCalls, picked, hold, release, select } = setup(t);
  let open;
  hold(new Promise(resolve => { open = resolve; }));
  const oldRun = w.prepare();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(restoreCalls.length, 1);
  release();
  select(picked.slice(1, 5));
  const newSignature = JSON.stringify([w.state.selected.map(r => r.questionUid), w.state.header, w.state.qpp, w.state.round, w.state.includeQr, w.state.derivationSource]);
  const newRun = await w.prepare();
  assert.equal(newRun.signature, newSignature);
  open();
  await assert.rejects(oldRun, /편집 내용이 변경/);
  assert.equal(w.state.prepared, newRun);
  assert.equal(w.state.prepared.signature, newSignature);
});

function previewApp(t) {
  const app = setup(t);
  const { w, node } = app;
  const host = node('preview-host');
  const popup = { location: { href: '' }, close() {} };
  app.ctx.open = () => popup;
  app.ctx.window.open = () => popup;
  w.setOutputUrl(async () => ({ href: 'engine.html', envelope: { ownerId: 'owner', outputRequestId: 'request' } }));
  // render()가 compose 화면에서 하는 일: 문제지 내용이 그대로면 미리보기 칸은 건드리지 않고 updatePreview만 부른다.
  w.setRender(() => { w.updatePreview(); });
  return { ...app, host, popup };
}

test('print, save success and save failure do not re-create the preview iframe', async t => {
  const { w, host, iframes, ctx, picked } = previewApp(t);
  // 저장 검사를 통과하는 한 문항짜리 문제지(저장 경로는 실제 savePapers).
  const record = picked[0];
  const scope = core.pathKey(record, 4);
  w.state.filters = { grade: record.effectiveBrowseGrade };
  w.state.scopes = [scope];
  w.state.rows = [{ id: scope, paths: [scope], scopeQuestionUids: [record.questionUid], count: 1 }];
  w.state.selected = [{ ...record, rowId: scope }];
  w.state.ackWarnings = true;
  await w.updatePreview();
  assert.equal(iframes.length, 1);
  const drawn = host.dataset.previewSignature;
  assert.ok(drawn);

  await w.printOnce();
  await w.updatePreview();
  assert.equal(iframes.length, 1, 'print');
  assert.equal(host.dataset.previewSignature, drawn);

  ctx.localStorage.setItem('APMATH_SESSION', JSON.stringify({ id: 'fixture-teacher', session_token: 'fixture-token' }));
  ctx.APMATH_API_BASE = 'https://archive.test/api';
  let mode = 'ok';
  const bodies = [];
  ctx.fetch = async (url, init = {}) => {
    if (new URL(String(url)).pathname === '/api/archive-saved-papers' && init.method === 'POST') {
      bodies.push(JSON.parse(init.body));
      return mode === 'ok'
        ? { ok: true, status: 200, json: async () => ({ success: true, saved: true, papers: [{ id: '00000000-0000-4000-8000-000000000a01' }] }) }
        : { ok: false, status: 400, json: async () => ({ error: 'bad request' }) };
    }
    throw new Error('unexpected request ' + url);
  };
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'SAVED', w.state.saveError);
  assert.equal(iframes.length, 1, 'save success');
  mode = 'fail';
  w.state.saveSignature = '';
  w.state.savedPaperIds = [];
  w.state.saveBatchId = '';
  await w.savePapers();
  assert.equal(w.state.saveResultState, 'FAILED');
  assert.equal(iframes.length, 1, 'save failure');
  assert.equal(host.dataset.previewSignature, drawn);
  assert.equal(bodies.length, 2);
  assert.deepEqual(bodies[1].papers, bodies[0].papers, 'same save request body');
});

test('the preview is drawn again only when the content signature changes', async t => {
  const { w, host, iframes, picked } = previewApp(t);
  await w.updatePreview();
  await w.updatePreview();
  assert.equal(iframes.length, 1);

  w.state.outputMode = 'sol';
  await w.updatePreview();
  assert.equal(iframes.length, 2, 'output mode');
  w.state.qpp = 2;
  await w.updatePreview();
  assert.equal(iframes.length, 3, 'questions per page');
  const replacement = picked[5];
  w.setReplacement(1, [replacement]);
  w.setRender(() => {});
  w.replaceWith(replacement);
  await w.updatePreview();
  assert.equal(iframes.length, 4, 'replacement');
  await w.updatePreview();
  assert.equal(iframes.length, 4);
  assert.equal(host.attrs['aria-busy'], 'true', 'the engine load event has not fired in this harness');
});

test('an updatePreview that is still preparing is not restarted by another render', async t => {
  const { w, iframes, restoreCalls, hold, release } = previewApp(t);
  let open;
  hold(new Promise(resolve => { open = resolve; }));
  const first = w.updatePreview();
  await new Promise(resolve => setImmediate(resolve));
  const second = w.updatePreview();
  const third = w.updatePreview();
  release();
  open();
  await Promise.all([first, second, third]);
  assert.equal(restoreCalls.length, 1);
  assert.equal(iframes.length, 1);
});
