// The teacher home opens on a small exam list (archive/data/exam-list-v1.json) instead of the whole catalog.
// What must hold: the list is the catalog's own exam rows (same order, same values) and is rebuilt byte for byte;
// the catalog download starts only when something needs it; the home draws the same rows from the list as from the catalog.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { loadWorkspace, readWorkspacePart } = require('./helpers/archive2-workspace-source.cjs');

const root = path.resolve(__dirname, '..');
const readArchive = (name) => fs.readFileSync(path.join(root, 'archive', name), 'utf8');

test('the exam list is the catalog exam rows, in order, bound to the catalog identity, and rebuilds to the same bytes', async () => {
  const { buildExamList, EXAM_LIST_PATH, EXAM_LIST_SCHEMA } = await import(pathToFileURL(path.join(root, 'tools/lib/build-exam-list.mjs')).href);
  const first = buildExamList(root);
  const second = buildExamList(root);
  assert.equal(first.path, EXAM_LIST_PATH);
  assert.ok(first.content.equals(second.content), 'two builds are byte-identical');
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8'));
  const list = JSON.parse(first.content.toString('utf8'));
  assert.equal(list.schemaVersion, EXAM_LIST_SCHEMA);
  assert.equal(list.catalogIdentityDigest, catalog.identityDigest);
  assert.equal(list.count, catalog.exams.length);
  assert.deepEqual(list.exams, catalog.exams, 'every exam row equals the catalog row at the same position');
  assert.ok(list.exams.length > 0);
  // Small enough that the home never waits for it (the catalog it replaces is tens of MB).
  assert.ok(first.bytes < 3_000_000, `exam list is ${first.bytes} bytes`);
});

// ---- archive2-boot.js: when a page opts in, only a plain home defers the catalog ----
function bootFor({ search, lazyAttribute = true }) {
  const context = {
    console, URLSearchParams, setTimeout, clearTimeout, performance: { now: () => 0, mark() {}, measure() {} },
    location: { search },
    document: { hidden: true, currentScript: { hasAttribute: (name) => lazyAttribute && name === 'data-lazy-catalog' } },
  };
  context.window = context;
  vm.runInContext(readArchive('archive2-boot.js'), vm.createContext(context));
  return context.Archive2Boot;
}

test('only a plain home on an opted-in page defers the catalog; any other address loads it as before', () => {
  assert.equal(bootFor({ search: '' }).catalogDeferred, true);
  assert.equal(bootFor({ search: '?view=home' }).catalogDeferred, true);
  assert.equal(bootFor({ search: '?perf=1&view=home' }).catalogDeferred, true);
  for (const search of ['?view=find', '?view=compose', '?view=saved', '?view=recent', '?uid=Q1', '?source=a.js', '?paper_id=x', '?edit_saved_paper=1', '?assign=legacy', '?recipe=five-minute'])
    assert.equal(bootFor({ search }).catalogDeferred, false, search);
  assert.equal(bootFor({ search: '', lazyAttribute: false }).catalogDeferred, false, 'a page that does not opt in never defers');
});

test('standby hides the progress line until the next download stage shows it again', () => {
  const boot = bootFor({ search: '' });
  const seen = [];
  boot.onProgress((state) => seen.push(state.waiting));
  boot.standby();
  assert.equal(boot.progress.waiting, true);
  boot.setStage('fetch');
  assert.equal(boot.progress.waiting, false);
  assert.deepEqual(seen, [false, true, false]);
});

// ---- meta-foundation-runtime.js: the download starts at load, or (deferred) at the first request for the catalog ----
function runtimeFor({ deferred }) {
  let started = 0;
  const context = {
    console, URL, setTimeout, clearTimeout,
    document: { baseURI: 'https://test.invalid/archive/workspace.html' },
    fetch: async () => { throw new Error('unexpected network'); },
    Archive2Canonical: { loadInputBundle() { started += 1; return new Promise(() => {}); }, RUNTIME_INPUT_PATHS: [] },
    Archive2Boot: { catalogDeferred: deferred, fetcher: (raw) => raw, yield() {} },
  };
  context.window = context;
  vm.runInContext(readArchive('meta-foundation-runtime.js'), vm.createContext(context));
  return { context, started: () => started };
}

test('a deferred page starts the catalog download only when the catalog is first asked for, once', () => {
  const deferred = runtimeFor({ deferred: true });
  assert.equal(deferred.started(), 0, 'loading the script downloads nothing');
  assert.equal(deferred.context.__META_FOUNDATION_RUNTIME_READY__, undefined);
  deferred.context.applyArchiveMetaFoundationCatalog();
  assert.equal(deferred.started(), 1);
  deferred.context.applyArchiveMetaFoundationCatalog();
  assert.equal(deferred.started(), 1, 'asking again does not download again');
  assert.ok(deferred.context.__META_FOUNDATION_RUNTIME_READY__, 'the ready promise exists once started');
  const eager = runtimeFor({ deferred: false });
  assert.equal(eager.started(), 1, 'every other page starts at load, as before');
  assert.ok(eager.context.__META_FOUNDATION_RUNTIME_READY__);
});

// ---- the home draws the same rows from the exam list as from the catalog ----
function loadHome() {
  const storage = new Map();
  const nodes = new Map();
  const node = (id) => {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: '', textContent: '', dataset: {}, open: false,
      setAttribute() {}, addEventListener() {}, classList: { toggle() {}, add() {}, remove() {} },
      close() {}, showModal() {}, querySelectorAll() { return []; },
    });
    return nodes.get(id);
  };
  const context = {
    console, URL, URLSearchParams, Date, crypto, structuredClone,
    setTimeout() { return 1; }, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    atob: (v) => Buffer.from(v, 'base64').toString('binary'),
    btoa: (v) => Buffer.from(v, 'binary').toString('base64'),
    location: new URL('https://test.invalid/archive/workspace.html?view=home'),
    history: { pushState() {}, replaceState() {} },
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      getElementById: node, querySelectorAll: () => [], querySelector: () => null,
      createElement: () => ({ content: { firstElementChild: { querySelector: () => ({}) } } }),
      body: { dataset: {} }, addEventListener() {},
    },
    fetch: async () => { throw new Error('unexpected network'); },
  };
  context.window = context;
  context.addEventListener = () => {};
  context.Archive2Output = {
    matchesMaterial: (exam, material) => !material || (exam.material || 'exam') === material,
    displayTitle: (exam) => [exam.year, exam.school, exam.grade].filter(Boolean).join(' '),
    materialKind: () => 'exam',
  };
  context.Archive2Source = {};
  context.Archive2Papers = { receipt: () => null, partIndex: (i) => Math.floor(i / 50), lockedUids: () => new Set(), status: () => ({}) };
  const ctx = vm.createContext(context);
  vm.runInContext(readArchive('archive2-canonical.js'), ctx);
  vm.runInContext(readArchive('archive2-core.js'), ctx);
  vm.runInContext(readArchive('archive2-history.js'), ctx);
  loadWorkspace(ctx, `
    globalThis.homeTest = { state, catalogExams, homeSchoolChips, homeExamList, renderHome, similarPairs, examIndexOf, CATALOG_FREE_ACTIONS };
  `);
  return ctx.homeTest;
}

const exam = (file, school, year, extra = {}) => ({
  file, school, grade: '고1', year, semester: '1', examType: 'mid', material: 'exam', contentType: '기출', qCount: 22, subject: '공통수학1', ...extra,
});
const rows = () => [
  exam('original/a/25_가나고_고1.js', '가나고', 2025), exam('original/a/26_가나고_고1.js', '가나고', 2026),
  exam('original/a/26_다라고_고1.js', '다라고', 2026), exam('original/a/24_다라고_고1.js', '다라고', 2024),
  exam('similar/a/26_가나고_고1_유사.js', '가나고', 2026, { contentType: '유형', material: 'similar' }),
];
const markupOf = (home) => home.renderHome().replace(/\s+/g, ' ');

test('home built from the exam list equals home built from the catalog, with the same row numbers', () => {
  const light = loadHome();
  light.state.light = { exams: rows(), identityDigest: 'a'.repeat(64) };
  assert.equal(light.state.catalog, null);
  assert.equal(light.catalogExams().length, 5);
  assert.deepEqual(JSON.parse(JSON.stringify(light.homeSchoolChips())), [{ school: '가나고', count: 2 }, { school: '다라고', count: 2 }]);
  const fromList = markupOf(light);
  assert.match(fromList, /data-school="가나고"/);
  assert.match(fromList, /class="exam-row /, 'exam rows are drawn without the catalog');
  assert.doesNotMatch(fromList, /home-chip is-pending/, 'no placeholder is left');

  const full = loadHome();
  full.state.catalog = { exams: rows(), records: [], taxonomy: [] };
  assert.equal(markupOf(full), fromList, 'same markup, including every data-exam row number');
  // The catalog wins once it is there.
  light.state.catalog = { exams: rows().slice(0, 2), records: [], taxonomy: [] };
  assert.equal(light.catalogExams().length, 2);
});

test('opening an original from the home list needs no catalog, and everything that reads the catalog still waits for it', () => {
  const home = loadHome();
  for (const action of ['source-output-direct', 'similar-list', 'home-school', 'home-search', 'home-all-schools'])
    assert.ok(home.CATALOG_FREE_ACTIONS.has(action), action);
  for (const action of ['source-issue', 'multi-assign', 'go-compose', 'source-toggle', 'generate'])
    assert.equal(home.CATALOG_FREE_ACTIONS.has(action), false, `${action} still waits for the catalog`);
  const main = readWorkspacePart('main');
  const block = main.slice(main.indexOf('a === "source-output-direct") {'), main.indexOf('a === "original-print"'));
  assert.ok(block.includes('openFinderOutput'));
  assert.doesNotMatch(block, /state\.catalog/, 'the original is opened from the exam row only');
  // Leaving the home for a screen that reads the catalog, or pressing a button that does, starts the download.
  assert.match(main, /if \(state\.view !== "home" && Boot\?\.catalogDeferred\) ensureCatalog\(\);/);
  assert.match(main, /status\(DEFERRED_NOTICE\);\s*ensureCatalog\(\);/);
  // The boot starts the catalog itself unless the home opened on the list.
  assert.match(main, /Boot\?\.catalogDeferred && state\.view === "home" && await loadLightExamList\(\)/);
  assert.match(main, /\n    ensureCatalog\(\);\n  \}\)\(\);/);
  // A list that belongs to another release drops the pending press instead of replaying it on the wrong exam.
  assert.match(main, /state\.light\.identityDigest !== catalog\.identityDigest\) deferredClick = null/);
});

test('workspace.html opts in and the release manifest ships the exam list', () => {
  assert.match(readArchive('workspace.html'), /<script defer src="archive2-boot\.js[^"]*" data-lazy-catalog><\/script>/);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools/archive-pages-release-manifest.json'), 'utf8'));
  assert.equal(manifest.examList, true, 'without this the home falls back to downloading the whole catalog');
});
