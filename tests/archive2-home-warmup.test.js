// While a teacher looks at the home, the full catalog is prepared in the background (download, hash check, resolve, snapshot
// save), so the first "문제지 만들기" / 학교별 기출 검색 / 단원별 기출 of the day opens without the wait.
// What must hold (no time is asserted: this PC's CPU is shared and any time limit would flake):
//  - it starts by itself on a plain home after the exam list is drawn, once, through the same ensureCatalog/applyArchiveMetaFoundationCatalog path;
//  - it does not start for ?warm=off, data saver, 2g/slow-2g, a hidden document (it waits for the page to be shown), a phone or a small-memory device;
//  - while it runs in the background it waits for the teacher's input to be quiet before each long step, and somebody who actually waits for the
//    catalog (a screen change, a button, the intent before a press) releases that wait and makes the progress line visible;
//  - it never changes what is downloaded or verified (the verification path is canonical's and the snapshot's, untouched).
'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { loadWorkspace } = require('./helpers/archive2-workspace-source.cjs');

const archiveDir = path.join(__dirname, '..', 'archive');
const read = (name) => fs.readFileSync(path.join(archiveDir, name), 'utf8');
const tick = (n = 8) => new Promise((resolve) => { const step = (left) => (left ? setImmediate(() => step(left - 1)) : resolve()); step(n); });

// ---- archive2-boot.js on its own ---------------------------------------------------------------
function loadBoot({ search = '', navigator: nav, visibilityState = 'visible', now = { t: 0 }, timers = [] } = {}) {
  const listeners = new Map();
  const marks = [];
  const context = {
    console, URL, URLSearchParams,
    setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimeout() {},
    location: { search },
    navigator: nav,
    document: {
      hidden: true, visibilityState, currentScript: { hasAttribute: (name) => name === 'data-lazy-catalog' },
      querySelectorAll: () => [],
      addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
      removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
    },
    performance: { now: () => now.t, mark: (name) => marks.push(name), measure() {}, getEntriesByName: () => [] },
  };
  context.window = context;
  vm.runInContext(read('archive2-boot.js'), vm.createContext(context));
  const fire = (name) => { for (const fn of [...(listeners.get(name) || [])]) fn({}); };
  return { Boot: context.Archive2Boot, marks, timers, now, fire, listenerCount: () => [...listeners.values()].reduce((n, set) => n + set.size, 0) };
}

test('warm-up is blocked for ?warm=off, data saver, 2g, a hidden document, a phone and a small-memory device; open otherwise', () => {
  const blocked = (options) => loadBoot(options).Boot.warmBlocked();
  assert.equal(blocked({}), '', 'a plain desktop with no network information starts');
  assert.equal(blocked({ navigator: { userAgent: 'Mozilla/5.0 (Windows NT 10.0) Chrome/130', connection: { saveData: false, effectiveType: '4g' }, deviceMemory: 8 } }), '');
  assert.equal(blocked({ search: '?view=home&warm=off' }), 'off');
  assert.equal(blocked({ navigator: { connection: { saveData: true, effectiveType: '4g' } } }), 'save-data');
  assert.equal(blocked({ navigator: { connection: { saveData: false, effectiveType: '2g' } } }), 'slow-network');
  assert.equal(blocked({ navigator: { connection: { saveData: false, effectiveType: 'slow-2g' } } }), 'slow-network');
  assert.equal(blocked({ navigator: { connection: { saveData: false, effectiveType: '3g' } } }), '', '3g is allowed');
  assert.equal(blocked({ visibilityState: 'hidden' }), 'hidden');
  assert.equal(blocked({ navigator: { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148' } }), 'mobile');
  assert.equal(blocked({ navigator: { userAgent: 'x', userAgentData: { mobile: true } } }), 'mobile');
  assert.equal(blocked({ navigator: { userAgent: 'x', deviceMemory: 2 } }), 'low-memory');
  assert.equal(blocked({ navigator: { userAgent: 'x', deviceMemory: 4 } }), '');
});

test('?warm=off is read when the page loads, so the screen rewriting the address later does not turn it back on', () => {
  // the address is rewritten without the switch after the page loaded
  const context = vm.createContext({ console, URL, URLSearchParams, setTimeout, clearTimeout, location: { search: '?view=home&warm=off' }, document: { hidden: true, visibilityState: 'visible', currentScript: { hasAttribute: () => true } }, performance: { now: () => 0, mark() {}, measure() {} } });
  context.window = context;
  vm.runInContext(read('archive2-boot.js'), context);
  context.location.search = '?view=home';
  assert.equal(context.Archive2Boot.warmBlocked(), 'off');
});

test('the switch ?warm=off keeps the home deferred like a plain home (it is not an unknown condition)', () => {
  for (const search of ['?view=home&warm=off', '?warm=off', '?view=find&warm=off'])
    assert.equal(loadBoot({ search }).Boot.catalogDeferred, true, search);
});

test('while warming, a long step waits for quiet input; nobody waiting (or nobody warming) means no wait', async () => {
  const h = loadBoot();
  const { Boot, now, fire, timers } = h;
  assert.equal(h.listenerCount(), 0, 'no input listeners until a warm-up starts');
  // not warming: always immediate
  let done = false;
  Boot.quiet().then(() => { done = true; });
  await tick(2);
  assert.equal(done, true);

  Boot.warmBegin();
  assert.ok(h.listenerCount() > 0, 'input is watched while warming');
  assert.ok(h.marks.includes('archive2:boot:warm-start'));
  // no input yet: the first step is not delayed
  done = false;
  Boot.quiet().then(() => { done = true; });
  await tick(2);
  assert.equal(done, true, 'a quiet page is not delayed');
  // a key press just now: wait
  now.t = 1000;
  fire('keydown');
  done = false;
  Boot.quiet().then(() => { done = true; });
  await tick(2);
  assert.equal(done, false, 'the step waits while the teacher is typing');
  // time passes with no further input: the poll releases it
  now.t = 2100;
  const poll = timers.splice(0).pop();
  poll.fn();
  await tick(2);
  assert.equal(done, true, 'released once the input has been quiet');
  // input again, then somebody needs the catalog: released at once
  now.t = 3000;
  fire('wheel');
  done = false;
  Boot.quiet().then(() => { done = true; });
  await tick(2);
  assert.equal(done, false);
  Boot.demand();
  await tick(2);
  assert.equal(done, true, 'demand releases the wait');
  assert.equal(h.listenerCount(), 0, 'input listeners are removed when the warm-up ends');
  assert.ok(h.marks.includes('archive2:boot:warm-demanded'));
  // and from now on nothing waits
  now.t = 4000;
  fire('keydown');
  let late = false;
  Boot.quiet().then(() => { late = true; });
  await tick(2);
  assert.equal(late, true);
});

test('every kind of input counts: keys, wheel, scroll, touch, pointer press and a moving pointer (somebody heading for a button)', async () => {
  for (const name of ['keydown', 'input', 'wheel', 'scroll', 'touchstart', 'touchmove', 'pointerdown', 'pointermove']) {
    const h = loadBoot();
    h.Boot.warmBegin();
    h.now.t = 5000;
    h.fire(name);
    let done = false;
    h.Boot.quiet().then(() => { done = true; });
    await tick(2);
    assert.equal(done, false, `${name} makes the long step wait`);
    h.Boot.demand();
  }
});

test('idle work (the index warm-up, the snapshot write) also waits for quiet input while warming', async () => {
  const h = loadBoot();
  const { Boot, now, fire, timers } = h;
  Boot.warmBegin();
  now.t = 500;
  fire('pointerdown');
  let ran = false;
  Boot.idle(() => { ran = true; });
  // no requestIdleCallback in this context: the fallback timer is the first (200 ms) one
  const fallback = timers.splice(0).find((timer) => timer.ms === 200);
  fallback.fn({ didTimeout: true });
  await tick(2);
  assert.equal(ran, false, 'a step after the idle slot still waits for quiet input');
  Boot.demand();
  await tick(2);
  assert.equal(ran, true);
});

test('the progress line stays hidden while warming and shows up as soon as somebody waits', () => {
  const { Boot } = loadBoot();
  const seen = [];
  Boot.onProgress((state) => seen.push(state.waiting));
  Boot.standby();
  Boot.warmBegin();
  Boot.setStage('fetch');
  assert.equal(Boot.progress.waiting, true, 'a background warm-up draws no progress line');
  Boot.setStage('verify');
  assert.equal(Boot.progress.waiting, true);
  Boot.demand();
  assert.equal(Boot.progress.waiting, false, 'somebody is waiting now: the line is shown');
  Boot.setStage('resolve');
  assert.equal(Boot.progress.waiting, false);
  assert.equal(seen.at(-1), false);
});

test('a warm-up that finishes marks warm-done; demand outside a warm-up does nothing', () => {
  const h = loadBoot();
  h.Boot.demand();
  assert.equal(h.marks.includes('archive2:boot:warm-demanded'), false);
  h.Boot.warmBegin();
  h.Boot.finish(false);
  assert.ok(h.marks.includes('archive2:boot:warm-done'));
});

// ---- the real workspace boot on a lazy home ------------------------------------------------------
function bootHome({ search = '?view=home', nav, visibilityState = 'visible', session = false } = {}) {
  const events = new Map(), nodes = new Map(), storage = new Map();
  const docListeners = new Map();
  const makeNode = (id) => ({
    id, value: '', innerHTML: '', textContent: '', dataset: {}, open: false, hidden: false, style: {},
    setAttribute() {}, addEventListener() {},
    classList: { flags: {}, toggle(name, on) { this.flags[name] = Boolean(on); }, add(name) { this.flags[name] = true; }, remove(name) { this.flags[name] = false; } },
    close() {}, showModal() {}, querySelectorAll() { return []; },
  });
  const node = (id) => { if (!nodes.has(id)) nodes.set(id, makeNode(id)); return nodes.get(id); };
  let catalogCalls = 0;
  const gate = (() => { let resolve; const promise = new Promise((ok) => { resolve = ok; }); return { promise, resolve }; })();
  // one behaviour per call of applyArchiveMetaFoundationCatalog: a promise, or a function returning one; the last one repeats
  const script = [];
  const catalogOf = () => ({ indexVersion: 'i', records: [], taxonomy: [], exams, sourceHashes: [], health: {}, canonicalAuthority: {} });
  if (session) storage.set('APMATH_SESSION', JSON.stringify({ login_id: 'teacher', session_token: 'fake', role: 'teacher' }));
  const exams = [
    { file: 'a.js', school: '가나고', grade: '고1', year: 2025, semester: 1, examType: 'mid', material: 'exam', qCount: 22, subject: '공통수학1', courseFamilies: [] },
    { file: 'b.js', school: '다라고', grade: '고1', year: 2025, semester: 1, examType: 'mid', material: 'exam', qCount: 22, subject: '공통수학1', courseFamilies: [] },
  ];
  const context = {
    console, URL, URLSearchParams, Date, crypto, structuredClone,
    setTimeout: (fn) => { fn && Promise.resolve().then(fn); return 1; }, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    atob: (v) => Buffer.from(v, 'base64').toString('binary'),
    btoa: (v) => Buffer.from(v, 'binary').toString('base64'),
    requestAnimationFrame: undefined,
    navigator: nav,
    location: new URL('https://t.test/archive/workspace.html' + search),
    history: {
      state: null,
      pushState(state, _t, url) { this.state = state; if (url) context.location = new URL(String(url), context.location.href); },
      replaceState(state, _t, url) { this.state = state; if (url) context.location = new URL(String(url), context.location.href); },
    },
    scrollTo() {}, scrollY: 0,
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    document: {
      hidden: true, visibilityState, activeElement: null, baseURI: 'https://t.test/archive/workspace.html',
      currentScript: { hasAttribute: (name) => name === 'data-lazy-catalog' },
      getElementById: node,
      querySelector(selector) {
        const fill = /^\[data-home-fill="(\w+)"\]$/.exec(selector);
        return fill ? nodes.get('fill:' + fill[1]) || (nodes.set('fill:' + fill[1], makeNode('fill:' + fill[1])), nodes.get('fill:' + fill[1])) : null;
      },
      querySelectorAll: () => [],
      createElement: () => ({ dataset: {}, disabled: false, set hidden(v) {}, remove() {}, click() {} }),
      body: { dataset: {}, appendChild() {} },
      addEventListener(name, callback) {
        if (!docListeners.has(name)) docListeners.set(name, new Set());
        docListeners.get(name).add(callback);
        if (!events.has(name)) events.set(name, []);
        events.get(name).push(callback);
      },
      removeEventListener(name, callback) { docListeners.get(name)?.delete(callback); },
    },
    fetch: async (url) => {
      const text = String(url);
      if (/exam-list-v1\.json/.test(text)) return { ok: true, json: async () => ({ schemaVersion: 'archive2-exam-list-v1', exams, catalogIdentityDigest: 'a'.repeat(64) }) };
      if (/qr-classes/.test(text)) return { ok: true, json: async () => ({ classes: [] }) };
      if (/recent-summary/.test(text)) return { ok: true, json: async () => ({ assignments: [] }) };
      return { ok: false, json: async () => null };
    },
    Archive2Library: { render: async () => {}, invalidatePendingRequests() {} },
    Archive2Output: {
      matchesMaterial: (e, m) => !m || (e.material || 'exam') === m,
      displayTitle: (e) => [e.year, e.school, e.grade].filter(Boolean).join(' '), materialKind: () => 'exam',
    },
    Archive2Source: {}, ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Papers: { receipt: () => null, partIndex: (i) => Math.floor(i / 50), lockedUids: () => new Set(), status: () => ({}) },
    applyArchiveMetaFoundationCatalog: () => {
      catalogCalls += 1;
      const step = script.length > 1 ? script.shift() : script[0];
      return step ? step() : gate.promise;
    },
  };
  context.window = context;
  context.addEventListener = (name, callback) => { if (!events.has('w:' + name)) events.set('w:' + name, []); events.get('w:' + name).push(callback); };
  context.removeEventListener = () => {};
  const ctx = vm.createContext(context);
  vm.runInContext(read('archive2-boot.js'), ctx);
  vm.runInContext(read('archive2-canonical.js'), ctx);
  vm.runInContext(read('archive2-core.js'), ctx);
  vm.runInContext(read('archive2-history.js'), ctx);
  loadWorkspace(ctx, 'globalThis.__ws = { state, render };', { boot: true });
  return {
    ctx, ws: ctx.__ws, Boot: ctx.Archive2Boot, calls: () => catalogCalls, script, catalogOf, content: () => node('content').innerHTML,
    fill: (name) => nodes.get('fill:' + name),
    show() { context.document.visibilityState = 'visible'; for (const fn of [...(docListeners.get('visibilitychange') || [])]) fn({}); },
    resolveCatalog: async () => {
      gate.resolve({ indexVersion: 'i', records: [], taxonomy: [], exams, sourceHashes: [], health: {}, canonicalAuthority: {} });
      await tick(12);
    },
  };
}

test('a plain home prepares the catalog by itself after the exam list is drawn, once, through the normal path', async () => {
  const h = bootHome();
  assert.equal(h.Boot.catalogDeferred, true);
  assert.equal(h.calls(), 0, 'nothing is requested while the home is being drawn');
  await tick(20);
  assert.equal(h.calls(), 1, 'the warm-up asked for the catalog through applyArchiveMetaFoundationCatalog');
  assert.equal(h.ws.state.light?.exams?.length, 2, 'the home itself still drew from the exam list first');
  assert.equal(h.Boot.progress.waiting, true, 'no progress line for a background warm-up');
  await tick(20);
  assert.equal(h.calls(), 1, 'never twice');
  await h.resolveCatalog();
  assert.ok(h.ws.state.catalog, 'the catalog became visible to every handler as in any other start');
  assert.equal(h.ws.state.light, null);
  assert.equal(h.Boot.progress.finished, true);
});

test('not started for ?warm=off, data saver, 2g, phone or small memory', async () => {
  const cases = [
    ['?view=home&warm=off', undefined],
    ['?view=home', { connection: { saveData: true, effectiveType: '4g' } }],
    ['?view=home', { connection: { saveData: false, effectiveType: '2g' } }],
    ['?view=home', { connection: { saveData: false, effectiveType: 'slow-2g' } }],
    ['?view=home', { userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile', connection: { effectiveType: '4g' } }],
    ['?view=home', { userAgent: 'x', deviceMemory: 2 }],
  ];
  for (const [search, nav] of cases) {
    const h = bootHome({ search, nav });
    await tick(30);
    assert.equal(h.calls(), 0, `${search} ${JSON.stringify(nav)}: the catalog is not requested`);
    assert.equal(h.ws.state.light?.exams?.length, 2, 'the home still works from the exam list');
    assert.equal(h.ctx.Archive2Boot.progress.total, 0, 'no download was counted');
  }
});

test('a hidden document waits: it starts when the page is shown, not before', async () => {
  const h = bootHome({ visibilityState: 'hidden' });
  await tick(30);
  assert.equal(h.calls(), 0);
  h.show();
  await tick(30);
  assert.equal(h.calls(), 1, 'shown: the warm-up starts');
});

test('a press that needs the catalog during the warm-up joins it: one start, and the progress line is shown', async () => {
  const h = bootHome();
  await tick(20);
  assert.equal(h.calls(), 1);
  assert.equal(h.Boot.progress.waiting, true);
  // the teacher leaves the home: render() needs the catalog and says so
  h.ws.state.view = 'compose';
  h.ws.render();
  await tick(4);
  assert.equal(h.calls(), 1, 'still one start');
  assert.equal(h.Boot.progress.waiting, false, 'now somebody waits: the line is shown');
});

test('leaving the home before the warm-up fires does not start a second, different load', async () => {
  const h = bootHome();
  // before the timer-driven start runs, the teacher is already on another screen
  h.ws.state.view = 'compose';
  h.ws.render();
  await tick(30);
  assert.equal(h.calls(), 1, 'the screen asked for it once, the warm-up added nothing');
});

test('the warm-up reuses the normal start: ensureCatalog is the only caller and the verification path is untouched', () => {
  const source = read('archive2-workspace.js');
  assert.match(source, /ensureCatalog\("warm"\)/);
  assert.match(source, /function ensureCatalog\(reason\)/);
  assert.equal((source.match(/= loadCatalog\(\)/g) || []).length, 1, 'loadCatalog is started in exactly one place');
  const runtime = read('meta-foundation-runtime.js');
  assert.doesNotMatch(runtime, /sha256|digest\(/i);
  assert.match(runtime, /Boot\.pause\(\)/, 'the long steps breathe and wait for quiet input through one helper');
  const boot = read('archive2-boot.js');
  assert.doesNotMatch(boot, /sha256|digest\(/i);
});

// ---- a failure of the background attempt is forgotten; a failure somebody waits for is shown ---------
const failing = (message = 'network down') => () => Promise.reject(Object.assign(new Error(message), { code: 'TEST_FAILURE' }));
const quietConsole = () => { const saved = { warn: console.warn, error: console.error }; console.warn = () => {}; console.error = () => {}; return () => Object.assign(console, saved); };

test('a background attempt that fails shows nothing, sets no bootError, and the next request starts again as the first one', async () => {
  const restore = quietConsole();
  try {
    const h = bootHome();
    h.script.push(failing(), () => Promise.resolve(h.catalogOf()));
    await tick(30);
    assert.equal(h.calls(), 1, 'the warm-up tried once');
    assert.equal(h.ws.state.bootError ?? null, null, 'no error text was set');
    assert.doesNotMatch(h.content() + (h.fill('recent')?.innerHTML || '') + (h.fill('chips')?.innerHTML || ''), /network down|불러오지 못했습니다|data-boot-wait="failed"/);
    assert.equal(h.Boot.progress.finished, false, 'the failed attempt left no "finished/failed" state behind');
    assert.equal(h.Boot.progress.failed, false);
    assert.equal(h.Boot.progress.waiting, true, 'the progress line stays hidden');
    assert.equal(h.ws.state.light?.exams?.length, 2, 'the home still works from the exam list');
    await tick(30);
    assert.equal(h.calls(), 1, 'it does not run again by itself on the same home (a dropped line is not asked in a loop)');
    // the teacher goes to a screen that needs the catalog: a new attempt, like the first one
    h.ws.state.view = 'compose';
    h.ws.render();
    await tick(30);
    assert.equal(h.calls(), 2);
    assert.ok(h.ws.state.catalog, 'the second attempt succeeded and the catalog is there');
    assert.equal(h.ws.state.bootError ?? null, null);
    assert.equal(h.Boot.progress.finished, true);
    assert.equal(h.Boot.progress.failed, false, 'ready is not spoiled by the earlier failure');
    assert.equal(h.ctx.Archive2Boot.progress.stage, 'ready');
  } finally { restore(); }
});

test('after a background failure the warm-up is tried once more when the page is shown again, not before and not a third time', async () => {
  const restore = quietConsole();
  try {
    const h = bootHome();
    h.script.push(failing(), failing(), () => Promise.resolve(h.catalogOf()));
    await tick(30);
    assert.equal(h.calls(), 1);
    h.show(); // visibilitychange
    await tick(30);
    assert.equal(h.calls(), 2, 'one more background try');
    h.show();
    await tick(30);
    assert.equal(h.calls(), 2, 'never a third');
    assert.equal(h.ws.state.bootError ?? null, null);
  } finally { restore(); }
});

test('somebody waits while the background attempt runs: its failure gets one automatic second try, then the error is shown', async () => {
  const restore = quietConsole();
  try {
    const h = bootHome();
    let reject;
    h.script.push(() => new Promise((_ok, fail) => { reject = fail; }), failing('still down'));
    await tick(20);
    assert.equal(h.calls(), 1);
    h.ws.state.view = 'compose';
    h.ws.render(); // the teacher asks: the attempt is theirs now
    await tick(4);
    assert.equal(h.calls(), 1, 'it joined the running attempt');
    reject(Object.assign(new Error('first failure'), { code: 'TEST_FAILURE' }));
    await tick(30);
    assert.equal(h.calls(), 2, 'one automatic second try');
    assert.ok(h.ws.state.bootError, 'the second failure is shown');
    assert.equal(h.Boot.progress.failed, true);
    assert.match(h.content(), /data-boot-wait="failed"/);
    await tick(30);
    assert.equal(h.calls(), 2, 'no endless retry');
  } finally { restore(); }
});

test('somebody waits while the background attempt runs and the second try works: no error at all', async () => {
  const restore = quietConsole();
  try {
    const h = bootHome();
    let reject;
    h.script.push(() => new Promise((_ok, fail) => { reject = fail; }), () => Promise.resolve(h.catalogOf()));
    await tick(20);
    h.ws.state.view = 'compose';
    h.ws.render();
    await tick(4);
    reject(Object.assign(new Error('blip'), { code: 'TEST_FAILURE' }));
    await tick(30);
    assert.equal(h.calls(), 2);
    assert.equal(h.ws.state.bootError ?? null, null);
    assert.ok(h.ws.state.catalog);
    assert.equal(h.Boot.progress.stage, 'ready');
  } finally { restore(); }
});

test('an attempt started by a request fails exactly as before: error shown, no automatic retry, no warm state', async () => {
  const restore = quietConsole();
  try {
    const h = bootHome({ search: '?view=home&warm=off' });
    h.script.push(failing('down'), () => Promise.resolve(h.catalogOf()));
    await tick(20);
    assert.equal(h.calls(), 0);
    h.ws.state.view = 'compose';
    h.ws.render();
    await tick(30);
    assert.equal(h.calls(), 1);
    assert.ok(h.ws.state.bootError, 'the error is shown');
    assert.equal(h.Boot.progress.failed, true);
    assert.equal(h.Boot.progress.finished, true);
    assert.match(h.content(), /data-boot-wait="failed"/);
    await tick(30);
    assert.equal(h.calls(), 1, 'no retry');
  } finally { restore(); }
});

// ---- the runtime bridge forgets a failed background load ------------------------------------------
function runtimeWith({ warmStarted }) {
  let started = 0;
  const flag = { warmStarted };
  const context = {
    console, URL, setTimeout, clearTimeout,
    document: { baseURI: 'https://t.test/archive/workspace.html' },
    fetch: async () => { throw new Error('unexpected network'); },
    Archive2Canonical: { loadInputBundle() { started += 1; return Promise.reject(new Error('manifest changed')); }, RUNTIME_INPUT_PATHS: [] },
    Archive2Boot: { catalogDeferred: true, fetcher: (raw) => raw, yield() {}, warmStarted: () => flag.warmStarted },
  };
  context.window = context;
  vm.runInContext(read('meta-foundation-runtime.js'), vm.createContext(context));
  return { context, started: () => started, flag };
}

test('runtime: a load the home started in the background is forgotten when it fails, so the next request loads again', async () => {
  const r = runtimeWith({ warmStarted: true });
  await assert.rejects(() => r.context.applyArchiveMetaFoundationCatalog());
  assert.equal(r.started(), 1);
  assert.equal(r.context.__META_FOUNDATION_RUNTIME_READY__, undefined, 'the rejected promise is not kept');
  await assert.rejects(() => r.context.applyArchiveMetaFoundationCatalog());
  assert.equal(r.started(), 2, 'asked again: a new load');
});

test('runtime: a load started by a request keeps its failure as before (no new load)', async () => {
  const r = runtimeWith({ warmStarted: false });
  await assert.rejects(() => r.context.applyArchiveMetaFoundationCatalog());
  await assert.rejects(() => r.context.applyArchiveMetaFoundationCatalog());
  assert.equal(r.started(), 1);
  assert.ok(r.context.__META_FOUNDATION_RUNTIME_READY__);
});

// ---- boot: the end of a warm-up -------------------------------------------------------------------
test('warmAbort puts the progress back to the start, and does nothing once somebody waits', () => {
  const h = loadBoot();
  const { Boot } = h;
  assert.equal(Boot.warmAbort(), false, 'no warm-up: nothing to abort');
  Boot.standby();
  Boot.warmBegin();
  assert.equal(Boot.warmStarted(), true);
  Boot.setStage('fetch', { total: 5, done: 3 });
  Boot.setStage('resolve');
  assert.equal(Boot.warmAbort(), true);
  assert.equal(Boot.warmStarted(), false);
  const p = Boot.progress;
  assert.deepEqual([p.stage, p.done, p.total, p.fraction, p.finished, p.failed, p.waiting], ['fetch', 0, 0, 0, false, false, true]);
  assert.ok(h.marks.includes('archive2:boot:warm-failed'));
  assert.equal(h.listenerCount(), 0);
  // a later start begins clean and its end is a normal ready
  Boot.warmBegin();
  Boot.demand();
  assert.equal(Boot.warmAbort(), false, 'somebody waits: the failure is theirs');
  assert.equal(Boot.warmStarted(), true, 'it stays a warm-started attempt (one automatic retry applies)');
  Boot.finish(false);
  assert.equal(Boot.progress.stage, 'ready');
});

test('when the warm-up finishes the input watching ends; only the idle work waits, for at most 10 s', async () => {
  const h = loadBoot();
  const { Boot, now, fire, timers } = h;
  Boot.warmBegin();
  now.t = 1000;
  fire('pointermove');
  Boot.finish(false);
  assert.ok(h.marks.includes('archive2:boot:warm-done'));
  assert.equal(Boot.warmStarted(), false);
  assert.equal(Boot.progress.waiting, false);
  // still moving the mouse right after the end: the snapshot write / index warm-up yield ...
  now.t = 1200;
  fire('pointermove');
  let written = false;
  Boot.quiet().then(() => { written = true; });
  await tick(2);
  assert.equal(written, false, 'yields to input while the settle window is open');
  // ... but only until the cap: the settle timer closes the window and releases them, input or not
  const settle = timers.find((timer) => timer.ms === 10000);
  assert.ok(settle, 'the cap is a 10 s timer');
  settle.fn();
  await tick(2);
  assert.equal(written, true, 'released by the cap even though the mouse is still moving');
  assert.equal(h.listenerCount(), 0, 'input listeners are gone after the cap');
  now.t = 11300;
  fire('pointermove');
  let later = false;
  Boot.quiet().then(() => { later = true; });
  await tick(2);
  assert.equal(later, true, 'nothing waits any more');
  Boot.demand();
  assert.equal(h.marks.includes('archive2:boot:warm-demanded'), false, 'a request after the end is not a "demanded" warm-up');
});

test('a request during the settle window ends it at once', async () => {
  const h = loadBoot();
  h.Boot.warmBegin();
  h.now.t = 500;
  h.fire('keydown');
  h.Boot.finish(false);
  h.now.t = 600;
  h.fire('keydown');
  let ran = false;
  h.Boot.quiet().then(() => { ran = true; });
  await tick(2);
  assert.equal(ran, false);
  h.Boot.demand();
  await tick(2);
  assert.equal(ran, true);
  assert.equal(h.listenerCount(), 0);
});

test('late events of a forgotten background attempt do not show the progress line; a request that starts again does', () => {
  const { Boot } = loadBoot();
  Boot.standby();
  Boot.warmBegin();
  Boot.setStage('fetch');
  Boot.warmAbort();
  Boot.setStage('verify'); // a download of the dead attempt finishing late
  Boot.setStage('resolve');
  assert.equal(Boot.progress.stage, 'fetch');
  assert.equal(Boot.progress.waiting, true, 'still hidden');
  Boot.demand(); // somebody needs the catalog: a normal start from here
  Boot.setStage('fetch');
  assert.equal(Boot.progress.waiting, false, 'now it is shown like any other start');
  Boot.setStage('resolve');
  assert.equal(Boot.progress.stage, 'resolve');
});
