// First screen first (2026-11-10): the order of the boot is the contract, not a time.
//  - Home, 보관함 and 출제 내역 are drawn before the catalog download is answered.
//  - A press that needs the catalog (menu, school chip, search) never throws before it is ready: the menu
//    moves at once, the body shows progress, and the real screen is drawn by itself when the catalog arrives.
//  - The big files are not handed to canonical.loadInputBundle (hash check, JSON.parse) before the first paint,
//    reviewed-exam-meta is requested together with the catalog, and canonical still receives every file.
// Times are never asserted: this PC's CPU is shared and any time limit would flake.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const archiveDir = path.join(__dirname, '..', 'archive');
const read = (name) => fs.readFileSync(path.join(archiveDir, name), 'utf8');
const tick = (n = 6) => new Promise((resolve) => { const step = (left) => (left ? setImmediate(() => step(left - 1)) : resolve()); step(n); });
const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };

// ---- archive2-boot.js on its own ---------------------------------------------------------------
function loadBoot({ hidden = true, search = '', log = console } = {}) {
  const marks = [];
  const timers = [];
  const context = {
    console: log, URL, URLSearchParams,
    // Zero-delay timers run (next turn); long ones are kept so a test can fire the safety timer by hand.
    setTimeout: (fn, ms) => { if (!ms) setImmediate(fn); else timers.push({ fn, ms }); return timers.length; }, clearTimeout() {},
    location: { search },
    document: { hidden, querySelectorAll: () => [] },
    performance: { now: () => marks.length, mark: (name) => marks.push(name), measure() {}, getEntriesByName: () => [] },
  };
  context.window = context;
  vm.runInContext(read('archive2-boot.js'), vm.createContext(context));
  return { Boot: context.Archive2Boot, marks, timers };
}

const MANIFEST = 'https://t.test/archive/data/archive2-canonical-input-manifest.json';
const CATALOG = 'https://t.test/archive/data/archive2-catalog.json';
const PACK = 'https://t.test/archive/data/meta-foundation/runtime/derivative-v1.json';
const REVIEWED = (name) => `https://t.test/archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${name}.json`;
const packText = (names) => JSON.stringify({
  generatedFrom: Object.fromEntries(names.map((name) => [`reviewedExam_${name}`, `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${name}.json`])),
  records: [],
});

test('the fetcher holds the big files back until the first paint, then hands every file over unchanged', async () => {
  const { Boot } = loadBoot();
  const requested = [];
  const raw = async (url) => { requested.push(url); return { ok: true, status: 200, text: async () => (url === CATALOG ? '{"catalog":1}' : '{}') }; };
  const fetcher = Boot.fetcher(raw);
  const manifest = await fetcher(MANIFEST);
  let catalogText = null;
  const catalog = await fetcher(CATALOG);
  const catalogPromise = catalog.text().then((text) => { catalogText = text; });
  await tick();
  assert.equal(catalogText, null, 'the catalog text is not given to the hash check before the first paint');
  assert.ok(requested.includes(CATALOG), 'but it is already downloading');
  await manifest.text();
  Boot.firstPaint(); // hidden tab: opens without waiting for a frame
  await tick();
  await catalogPromise;
  assert.equal(catalogText, '{"catalog":1}');
});

test('the gate opens by itself when the screen code never reports a paint (no endless wait)', async () => {
  const { Boot, timers } = loadBoot();
  const fetcher = Boot.fetcher(async () => ({ ok: true, status: 200, text: async () => '{}' }));
  const response = await fetcher(CATALOG);
  let done = false;
  response.text().then(() => { done = true; });
  await tick();
  assert.equal(done, false);
  const safety = timers.find((timer) => timer.ms >= 1000);
  assert.ok(safety, 'a safety timer exists');
  safety.fn();
  await tick();
  assert.equal(done, true);
});

test('reviewed-exam-meta named by a runtime pack is requested right away, at most 6 at a time, and each only once', async () => {
  const { Boot } = loadBoot();
  const names = Array.from({ length: 14 }, (_, i) => `r${i}`);
  const requested = [];
  let inFlight = 0, peak = 0;
  const release = [];
  const raw = async (url) => {
    requested.push(url);
    if (url === MANIFEST) return { ok: true, status: 200, text: async () => '{}' };
    if (url === PACK) return { ok: true, status: 200, text: async () => packText(names) };
    inFlight += 1; peak = Math.max(peak, inFlight);
    await new Promise((resolve) => release.push(resolve));
    inFlight -= 1;
    return { ok: true, status: 200, text: async () => `{"n":"${url.slice(-8)}"}` };
  };
  const fetcher = Boot.fetcher(raw);
  await fetcher(MANIFEST); // establishes the archive base
  Boot.firstPaint();
  const pack = await fetcher(PACK);
  await pack.text();
  await tick();
  assert.equal(requested.filter((url) => url.includes('/reviewed-exam-meta/')).length, 6, 'only the pool size is in flight');
  assert.equal(peak, 6);
  while (requested.filter((url) => url.includes('/reviewed-exam-meta/')).length < names.length || release.length) {
    release.splice(0).forEach((fn) => fn());
    await tick(2);
  }
  assert.equal(peak, 6);
  // canonical asks for them later: it gets the early copies, nothing is downloaded twice
  const before = requested.length;
  for (const name of names) {
    const response = await fetcher(REVIEWED(name));
    assert.equal(response.ok, true);
    assert.match(await response.text(), /"n":/);
  }
  assert.equal(requested.length, before, 'served from the early download');
  // a file no pack names (the unreferenced evidence file) is never requested early
  assert.ok(!requested.some((url) => url.includes('h1-fast-lane-c-20261013-original')));
});

test('a failed early download falls back to one normal request instead of failing the load', async () => {
  const { Boot } = loadBoot();
  let attempts = 0;
  const raw = async (url) => {
    if (url === MANIFEST) return { ok: true, status: 200, text: async () => '{}' };
    if (url === PACK) return { ok: true, status: 200, text: async () => packText(['bad']) };
    attempts += 1;
    if (attempts === 1) throw new TypeError('network');
    return { ok: true, status: 200, text: async () => '{"ok":1}' };
  };
  const fetcher = Boot.fetcher(raw);
  await fetcher(MANIFEST);
  Boot.firstPaint();
  await (await fetcher(PACK)).text();
  await tick();
  const response = await fetcher(REVIEWED('bad'));
  assert.equal(await response.text(), '{"ok":1}');
  assert.equal(attempts, 2);
});

test('meta-foundation-runtime hands canonical the boot fetcher and keeps working without it', () => {
  const source = read('meta-foundation-runtime.js');
  assert.match(source, /Boot\.fetcher\(rawFetcher\)\s*:\s*rawFetcher/, 'the boot fetcher is optional');
  assert.match(source, /cache: "no-cache"/, 'revalidation is unchanged');
  // The verification path is canonical's: this file must not hash or skip anything itself.
  assert.doesNotMatch(source, /sha256|digest\(/i);
});

// ---- the real workspace boot ---------------------------------------------------------------------
function exam(file, school, extra = {}) {
  return {
    file, school, grade: '고1', year: 2025, semester: 1, examType: 'mid', material: 'exam',
    qCount: 22, subject: '공통수학1', courseFamilies: [], ...extra,
  };
}

// Runs the whole archive2-workspace.js (boot included) with a catalog promise the test controls.
function boot(search = '', { session = false } = {}) {
  const events = new Map(), nodes = new Map(), storage = new Map(), hooks = {};
  const pushed = [];
  const makeNode = (id) => ({
    id, value: '', innerHTML: '', textContent: '', dataset: {}, open: false, hidden: false, style: {},
    setAttribute() {}, addEventListener() {},
    classList: { flags: {}, toggle(name, on) { this.flags[name] = Boolean(on); }, add(name) { this.flags[name] = true; }, remove(name) { this.flags[name] = false; } },
    close() {}, showModal() {}, querySelectorAll() { return []; },
  });
  const node = (id) => { if (!nodes.has(id)) nodes.set(id, makeNode(id)); return nodes.get(id); };
  const catalogGate = deferred();
  const library = { rendered: 0, render: async () => { library.rendered += 1; }, invalidatePendingRequests() {} };
  if (session) storage.set('APMATH_SESSION', JSON.stringify({ login_id: 'teacher', session_token: 'fake', role: 'teacher' }));
  const context = {
    console, URL, URLSearchParams, Date, crypto, structuredClone,
    setTimeout: (fn) => { fn && Promise.resolve().then(fn); return 1; }, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    atob: (v) => Buffer.from(v, 'base64').toString('binary'),
    btoa: (v) => Buffer.from(v, 'binary').toString('base64'),
    requestAnimationFrame: undefined,
    location: new URL('https://t.test/archive/workspace.html' + search),
    history: {
      state: null,
      pushState(state, _t, url) { this.state = state; pushed.push(String(url)); if (url) context.location = new URL(String(url), context.location.href); },
      replaceState(state, _t, url) { this.state = state; if (url) context.location = new URL(String(url), context.location.href); },
    },
    scrollTo() {}, scrollY: 0,
    localStorage: { getItem: (k) => storage.get(k) ?? null, setItem: (k, v) => storage.set(k, v) },
    document: {
      hidden: true, activeElement: null, baseURI: 'https://t.test/archive/workspace.html',
      getElementById: node,
      querySelector(selector) {
        const fill = /^\[data-home-fill="(\w+)"\]$/.exec(selector);
        return fill ? nodes.get('fill:' + fill[1]) || null : null;
      },
      querySelectorAll: () => [],
      createElement: () => {
        const el = { dataset: {}, disabled: false, set hidden(v) {}, remove() {},
          click() { for (const callback of events.get('click') || []) callback({ target: { closest: (sel) => (sel === 'button' ? el : null) } }); } };
        return el;
      },
      body: { dataset: {}, appendChild() {} },
      addEventListener(name, callback) { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    },
    fetch: async (url) => {
      const text = String(url);
      if (/qr-classes/.test(text)) return { ok: true, json: async () => ({ classes: [] }) };
      if (/recent-summary/.test(text)) return { ok: true, json: async () => ({ assignments: [] }) };
      return { ok: false, json: async () => null };
    },
    Archive2Library: library,
    Archive2Output: {
      matchesMaterial: (e, m) => !m || (e.material || 'exam') === m,
      displayTitle: (e) => [e.year, e.school, e.grade].filter(Boolean).join(' '), materialKind: () => 'exam',
    },
    Archive2Source: {}, ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Papers: { receipt: () => null, partIndex: (i) => Math.floor(i / 50), lockedUids: () => new Set(), status: () => ({}) },
    applyArchiveMetaFoundationCatalog: () => catalogGate.promise,
  };
  context.window = context;
  context.addEventListener = (name, callback) => { if (!events.has('w:' + name)) events.set('w:' + name, []); events.get('w:' + name).push(callback); };
  const ctx = vm.createContext(context);
  vm.runInContext(read('archive2-boot.js'), ctx);
  vm.runInContext(read('archive2-canonical.js'), ctx);
  vm.runInContext(read('archive2-core.js'), ctx);
  vm.runInContext(read('archive2-history.js'), ctx);
  let source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {\n    readUrl();');
  assert.ok(startup > 0, 'the boot IIFE keeps its shape');
  source = source.slice(0, startup) + 'globalThis.__ws = { state, renderContent, render, status };\n' + source.slice(startup);
  vm.runInContext(source, ctx);
  const fill = (name) => { if (!nodes.has('fill:' + name)) nodes.set('fill:' + name, makeNode('fill:' + name)); return nodes.get('fill:' + name); };
  return {
    ctx, ws: ctx.__ws, node, library, pushed, storage, fill,
    content: () => node('content').innerHTML,
    statusNode: () => node('status'),
    catalogGate,
    ready: async (extra = {}) => {
      catalogGate.resolve({
        indexVersion: 'test-index', records: [], taxonomy: [], exams: [exam('a.js', '가나고'), exam('b.js', '다라고')],
        sourceHashes: [], health: {}, canonicalAuthority: {}, ...extra,
      });
      await tick(12);
    },
    async click(dataset) {
      for (const callback of events.get('click') || [])
        await callback({ target: { closest: (sel) => (sel === 'button' ? { dataset, disabled: false } : null) } });
    },
  };
}

test('home is drawn before the catalog answers, with placeholders where the catalog will fill in', async () => {
  const h = boot('');
  await tick();
  assert.equal(h.ws.state.catalog ?? null, null, 'the catalog has not arrived');
  assert.match(h.content(), /archive-home/);
  assert.match(h.content(), /data-home-fill="chips"/);
  assert.match(h.content(), /home-chip is-pending/, 'school chips start as placeholders');
  assert.match(h.content(), /data-boot-wait="loading"/, 'the recent-exam rows say they are being prepared');
  assert.doesNotMatch(h.content(), /data-action="home-school"/, 'no school chip that would need the catalog');
  assert.equal(h.ctx.Archive2Boot.progress.finished, false);
});

test('when the catalog arrives home fills its two parts in place and the page is not redrawn', async () => {
  const h = boot('');
  await tick();
  const before = h.content();
  const chips = h.fill('chips'), recent = h.fill('recent');
  await h.ready();
  assert.match(chips.innerHTML, /data-action="home-school"[^>]*data-school="가나고"/);
  assert.match(recent.innerHTML, /exam-row/);
  assert.equal(h.content(), before, 'content (search box, focus) was not rewritten');
  assert.equal(h.ctx.Archive2Boot.progress.finished, true);
  assert.equal(h.ctx.Archive2Boot.progress.failed, false);
});

test('the menu moves at once before the catalog is ready and the screen draws itself when it is', async () => {
  const h = boot('');
  await tick();
  await assert.doesNotReject(h.click({ view: 'find' }));
  assert.equal(h.ws.state.view, 'find');
  assert.match(h.content(), /data-boot-wait="loading"/);
  assert.match(h.content(), /학교별 기출/);
  assert.doesNotMatch(h.content(), /find-surface/);
  assert.match(h.ctx.location.search, /view=find/, 'the address already names the screen');
  await h.ready();
  assert.doesNotMatch(h.content(), /data-boot-wait/, 'the progress screen is gone');
  assert.match(h.content(), /find-surface/, 'the real screen was drawn without another press');
});

test('a school chip or the search box pressed before the catalog is ready reaches the same screen', async () => {
  for (const [dataset, pattern] of [
    [{ action: 'home-all-schools' }, /material=exam/],
    [{ action: 'home-search' }, /material=exam/],
  ]) {
    const h = boot('');
    await tick();
    await assert.doesNotReject(h.click(dataset));
    assert.equal(h.ws.state.view, 'find');
    assert.match(h.ctx.location.search, pattern);
    await h.ready();
    assert.match(h.content(), /find-surface/);
  }
});

test('a quick assessment opened from home before the catalog is ready stays in this page (no reload that restarts the load)', async () => {
  const h = boot('');
  await tick();
  await h.click({ action: 'home-product', productKey: 'five-minute-test' });
  assert.ok(h.pushed.some((url) => /view=five-minute/.test(url)), 'opened in the page with pushState');
  assert.equal(h.ws.state.view, 'five-minute');
  assert.match(h.content(), /data-boot-wait="loading"/);
  assert.equal(h.ctx.location.pathname, '/archive/workspace.html', 'still the same page');
});

test('a button that needs the catalog is held, says so, and is pressed again when the catalog is ready', async () => {
  const h = boot('');
  await tick();
  const before = h.pushed.length;
  await assert.doesNotReject(h.click({ action: 'finder-reset' }));
  assert.equal(h.pushed.length, before, 'nothing ran yet');
  assert.match(h.statusNode().textContent, /자료를 준비하는 중/);
  assert.notEqual(h.statusNode().classList.flags.error, true, 'a notice, not an error');
  await h.ready();
  assert.ok(h.pushed.length > before, 'the held press ran after the catalog arrived');
});

test('a held press is dropped when the teacher leaves the screen, even if they come back to it', async () => {
  const h = boot('');
  await tick();
  await h.click({ action: 'finder-reset' });
  assert.match(h.statusNode().textContent, /자료를 준비하는 중/);
  await h.click({ view: 'find' });
  assert.doesNotMatch(h.statusNode().textContent, /자료를 준비하는 중/, 'the notice does not follow the teacher to another screen');
  await h.click({ view: 'home' });
  const before = h.pushed.length;
  await h.ready();
  assert.equal(h.pushed.length, before, 'the old press did not run after coming back');
});

test('보관함 is drawn before the catalog answers and is not drawn again when it arrives', async () => {
  const h = boot('?view=saved', { session: true });
  await tick();
  assert.equal(h.library.rendered, 1, 'drawn at once');
  await h.ready();
  assert.equal(h.library.rendered, 1, 'the arrival of the catalog does not reload the list');
});

test('출제 내역 is drawn and loads its list without waiting for the catalog', async () => {
  const h = boot('?view=recent', { session: true });
  await tick();
  assert.match(h.content(), /history-surface/);
  assert.equal(h.ws.state.catalog ?? null, null);
  assert.equal(h.ws.state.recentLoading, false, 'the list request finished before the catalog arrived');
  await h.ready();
  assert.match(h.content(), /history-surface/);
});

test('a catalog that fails keeps home usable, shows the reason with a retry, and is shown on every screen that needs it', async () => {
  const h = boot('');
  await tick();
  h.catalogGate.reject(Object.assign(new Error('CANONICAL_AUTHORITY_UNAVAILABLE: x'), { code: 'CANONICAL_AUTHORITY_UNAVAILABLE' }));
  await tick(12);
  const recent = h.fill('recent');
  assert.equal(h.ctx.Archive2Boot.progress.failed, true);
  assert.match(h.content(), /archive-home/, 'home stays');
  assert.ok(h.ws.state.bootError, 'the reason is kept');
  await h.click({ view: 'find' });
  assert.match(h.content(), /data-boot-wait="failed"/);
  assert.match(h.content(), /data-action="boot-retry"/);
  assert.doesNotMatch(h.content(), /data-boot-wait="loading"/);
  assert.ok(recent);
});

test('the progress is real: it follows downloads and stages and never moves backwards', () => {
  const { Boot } = loadBoot();
  const seen = [];
  Boot.onProgress((state) => seen.push([state.stage, state.fraction, state.done, state.total]));
  Boot.setStage('fetch', { total: 4, done: 1 });
  Boot.setStage('fetch', { total: 4, done: 3 });
  Boot.setStage('verify');
  Boot.setStage('fetch', { total: 8, done: 3 }); // more files were added after the first batch
  Boot.setStage('resolve');
  Boot.setStage('index');
  Boot.finish(false);
  const fractions = seen.map((row) => row[1]);
  assert.deepEqual([...fractions].sort((a, b) => a - b), fractions, 'monotone');
  assert.equal(fractions.at(-1), 1);
  assert.equal(Boot.progress.finished, true);
});

test('the timing table is printed only with ?perf=1 and the marks are named as documented', () => {
  const quiet = [];
  const silent = loadBoot({ log: { table: (rows) => quiet.push(rows), warn() {}, error() {} } });
  silent.Boot.finish(false);
  assert.equal(quiet.length, 0, 'nothing is printed by default');
  const printed = [];
  const loud = loadBoot({ search: '?perf=1', log: { table: (rows) => printed.push(rows), warn() {}, error() {} } });
  loud.Boot.finish(false);
  assert.equal(printed.length, 1);
  assert.ok(loud.marks.includes('archive2:boot:start') && loud.marks.includes('archive2:boot:ready'));
});
