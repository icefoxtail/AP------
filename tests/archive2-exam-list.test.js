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
  // The school finder opens on the list too, unless the address carries a condition only the records can decide.
  for (const search of ['?view=find', '?view=find&material=exam', '?view=find&query=%EA%B8%88%EB%8B%B9%EA%B3%A0&material=exam&page=1', '?view=find&grade=%EA%B3%A01&axis=1-mid&similarOnly=1'])
    assert.equal(bootFor({ search }).catalogDeferred, true, search);
  for (const search of ['?view=find&semanticSubject=ALGEBRA', '?view=find&curriculumKey=2022', '?view=find&courseKey=x', '?view=find&family=COMMON_1', '?view=find&uid=Q1', '?view=find&source=a.js'])
    assert.equal(bootFor({ search }).catalogDeferred, false, search);
  // 조각 경로가 기본(2단계 2-4): 그 밖의 주소도 전체 받기를 로드 때 시작하지 않고 화면이 필요한 조각만 받는다.
  // 주소에 shards=0 이 있으면 예전 규칙(평범한 홈만 늦게, 나머지는 바로 전체 받기)으로 돌아간다.
  const others = ['?view=compose', '?view=saved', '?view=recent', '?uid=Q1', '?source=a.js', '?paper_id=x', '?edit_saved_paper=1', '?assign=legacy', '?recipe=five-minute', '?grade=%EA%B3%A01'];
  for (const search of others) {
    assert.equal(bootFor({ search }).catalogDeferred, true, search);
    assert.equal(bootFor({ search: `${search}&shards=0` }).catalogDeferred, false, `${search}&shards=0`);
  }
  assert.equal(bootFor({ search: '?shards=0' }).catalogDeferred, true, 'a plain home stays deferred with shards off');
  assert.equal(bootFor({ search: '?view=home&shards=0' }).catalogDeferred, true);
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
  vm.runInContext(readArchive('rpm-middle-toc.js'), ctx);
  vm.runInContext(readArchive('unit-past-exams-core.js'), ctx);
  vm.runInContext(readArchive('archive2-unified-units.js'), ctx);
  vm.runInContext(readArchive('archive2-similar.js'), ctx);
  loadWorkspace(ctx, `
    globalThis.homeTest = { state, catalogExams, homeSchoolChips, homeExamList, renderHome, similarPairs, examIndexOf, CATALOG_FREE_ACTIONS,
      renderFind, findExams, lightFindUsable, finderSchoolValues, reconcileFinderFilters, LIGHT_FIND_ACTIONS };
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
  assert.match(main, /if \(state\.view !== "home" && Boot\?\.catalogDeferred && !lightPending\) ensureCatalog\(\);/);
  assert.match(main, /status\(DEFERRED_NOTICE\);[\s\S]{0,500}?ensureCatalog\(\);/);
  // The boot asks for the exam list first on a plain home or school finder, and starts the catalog itself otherwise or when the list is unusable.
  assert.match(main, /lightPending = Boolean\(Boot\?\.catalogDeferred && \(state\.view === "home" \|\| state\.view === "find"\)\);/);
  assert.match(main, /if \(lightPending\) \{\s*const listed = await loadLightExamList\(\);/);
  assert.match(main, /\n    ensureCatalog\(\);\n  \}\)\(\);/);
  // A list that belongs to another release drops the pending press instead of replaying it on the wrong exam.
  assert.match(main, /state\.light\.identityDigest !== catalog\.identityDigest\) \{ deferredClick = null;/);
});

test('workspace.html opts in and the release manifest ships the exam list', () => {
  assert.match(readArchive('workspace.html'), /<script defer src="archive2-boot\.js[^"]*" data-lazy-catalog><\/script>/);
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools/archive-pages-release-manifest.json'), 'utf8'));
  assert.equal(manifest.examList, true, 'without this the home falls back to downloading the whole catalog');
});

// ---- the school finder draws from the list first and is the same screen once the catalog is there ----
const findRows = () => [
  exam('original/a/25_가나고_고1.js', '가나고', 2025), exam('original/a/26_가나고_고2.js', '가나고', 2026, { grade: '고2', subject: '대수' }),
  exam('original/a/26_다라고_고1.js', '다라고', 2026), exam('original/a/24_다라고_중1.js', '다라고', 2024, { grade: '중1' }),
  exam('similar/a/26_가나고_고2_유사.js', '가나고', 2026, { contentType: '유형', material: 'similar', grade: '고2' }),
];
const squash = (html) => html.replace(/\s+/g, ' ').replace(/ disabled(?=[ >])/g, '');
test('the finder draws from the exam list alone, and with the catalog it is the same markup', () => {
  const light = loadHome();
  light.state.light = { exams: findRows(), identityDigest: 'a'.repeat(64) };
  light.state.find = { material: 'exam' };
  assert.equal(light.lightFindUsable(), true);
  const lightMarkup = light.renderFind();
  assert.doesNotMatch(lightMarkup, /find-light-note/, 'a plain list needs no "preparing" line');
  assert.match(lightMarkup, /가나고/);

  const full = loadHome();
  full.state.catalog = { exams: findRows(), records: [], taxonomy: [], projectionPolicy: {} };
  full.state.finderIndex = new Map();
  full.state.find = { material: 'exam' };
  assert.equal(squash(full.renderFind()), squash(lightMarkup), 'same rows, same order, same boxes (the list-only screen only has some boxes disabled)');
  assert.match(lightMarkup, /<select data-filter="curriculumKey" data-group="find" disabled>/, 'the record-based boxes hold their place, disabled');
});

test('conditions only the records can decide wait for the catalog; the ones a list can answer do not', () => {
  const light = loadHome();
  light.state.light = { exams: findRows(), identityDigest: 'a'.repeat(64) };
  for (const key of ['curriculumKey', 'courseKey', 'semanticSubject', 'family']) {
    light.state.find = { material: 'exam', [key]: 'x' };
    assert.equal(light.lightFindUsable(), false, `${key} waits for the catalog`);
  }
  light.state.find = { material: 'exam', school: '가나고', yearFrom: '2025', axis: '1-mid', grade: '고2' };
  assert.equal(light.lightFindUsable(), true);
  assert.deepEqual(light.findExams().map((e) => e.file), ['original/a/26_가나고_고2.js']);
  // A word and a grade can still change once the question texts / record grades are known: say so, never "no results".
  light.state.find = { material: 'exam', query: '아무글자' };
  const markup = light.renderFind();
  assert.match(markup, /문항 단위 검색을 준비하는 중…/);
  assert.match(markup, /find-empty-pending/);
  assert.doesNotMatch(markup, /현재 조건에 맞는 자료가 없습니다/);
  light.state.catalog = { exams: findRows(), records: [], taxonomy: [], projectionPolicy: {} };
  light.state.finderIndex = new Map();
  const done = light.renderFind();
  assert.doesNotMatch(done, /find-light-note|find-empty-pending/);
  assert.match(done, /현재 조건에 맞는 자료가 없습니다/, 'the empty message appears only once the catalog is ready');
});

test('the finder buttons run on the list alone only while there is a list, and the rest still waits for the catalog', () => {
  const home = loadHome();
  for (const action of ['finder-search', 'finder-axis-quick', 'finder-grade', 'finder-publisher', 'finder-reset', 'material', 'page-prev', 'page-next', 'multi-pick', 'multi-pick-clear', 'finder-subject', 'source-toggle', 'sources-clear'])
    assert.ok(home.LIGHT_FIND_ACTIONS.has(action), action);
  for (const action of ['go-compose', 'source-issue', 'multi-assign', 'derive-mock-open'])
    assert.equal(home.LIGHT_FIND_ACTIONS.has(action), false, `${action} waits for the records`);
  const main = readWorkspacePart('main');
  assert.match(main, /!\(state\.light && LIGHT_FIND_ACTIONS\.has\(a\)\)/);
  // 조각 3단계: the list-only draw hands over to afterListFindPaint, which starts the whole catalog only when there is no shard path / no table.
  assert.match(main, /afterListFindPaint\(\);\s*return;/, 'the finder asks what is left to do after the list-only draw');
  assert.match(main, /if \(!shardsOn\(\)\) \{ startCatalogAfterPaint\(\); return; \}/, 'without the shard path the whole catalog starts after the draw, as before');
  assert.match(main, /if \(ok\) renderKeepingFindPlace\(\); else startCatalogAfterPaint\(\);/, 'a table that cannot be used falls back to the whole catalog');
  assert.match(main, /else if \(state\.view === "find"\) renderKeepingFindPlace\(\);/, 'the full screen replaces the list-only one in place');
});

// ---- 조각 3단계: the finder table (common.json) answers the record-based conditions from the list ----
test('with the finder table the list answers curriculum, subject and question-name words; only a uid-like word waits for the records', () => {
  const home = loadHome();
  const rowsOf = findRows();
  home.state.light = { exams: rowsOf, identityDigest: 'a'.repeat(64) };
  const set = (...items) => new Set(items);
  const identity = (grades, curricula) => ({ courseKeys: set(), curriculumKeys: set(...curricula), sourceGrades: set(...grades), subjectProjections: set(), subjectCurriculumPairs: set() });
  const table = {
    finderIndex: new Map([
      ['original/a/25_가나고_고1.js', identity(['고1'], ['2022'])],
      ['original/a/26_가나고_고2.js', identity(['고2'], ['2015'])],
      ['original/a/26_다라고_고1.js', identity(['고1'], ['2022'])],
      ['original/a/24_다라고_중1.js', identity(['중1'], ['2015'])],
      ['similar/a/26_가나고_고2_유사.js', identity(['고2'], ['2015'])],
    ]),
    examSubjects: new Map([['original/a/26_가나고_고2.js', set('ALGEBRA')]]),
    labelsOf: (file) => (file === 'original/a/25_가나고_고1.js' ? ['다항식의연산'] : []),
    uidChars: set(...'0123456789_abcdefiqv'),
  };
  home.state.finderTable = table;
  home.state.find = { material: 'exam', curriculumKey: '2015' };
  assert.equal(home.lightFindUsable(), true, 'a curriculum no longer waits for the catalog once the table is there');
  assert.deepEqual(home.findExams().map((e) => e.file), ['original/a/26_가나고_고2.js', 'original/a/24_다라고_중1.js']);
  home.state.find = { material: 'exam', semanticSubject: 'ALGEBRA' };
  assert.deepEqual(home.findExams().map((e) => e.file), ['original/a/26_가나고_고2.js']);
  home.state.find = { material: 'exam', query: '다항식' };
  assert.deepEqual(home.findExams().map((e) => e.file), ['original/a/25_가나고_고1.js'], 'a word from the question names finds the exam');
  assert.doesNotMatch(home.renderFind(), /find-light-note/, 'a plain word needs no "preparing" line');
  assert.doesNotMatch(home.renderFind(), /<select data-filter="curriculumKey" data-group="find" disabled>/, 'the boxes are live');
  // short digits never match a uid; a long uid-like word cannot be answered from the table
  home.state.find = { material: 'exam', query: '2025' };
  assert.deepEqual(home.findExams().map((e) => e.file), ['original/a/25_가나고_고1.js']);
  home.state.find = { material: 'exam', query: 'qid_v1_ab12cd34' };
  const markup = home.renderFind();
  assert.match(markup, /문항 단위 검색을 준비하는 중…/);
  assert.doesNotMatch(markup, /현재 조건에 맞는 자료가 없습니다/);
});

// ---- 조각 3단계: with a few shards held for a button, the finder and the home still draw from the list ----
test('with only some shards held, the finder and the home keep the list (same rows, same numbers); other screens read their own catalog', () => {
  const home = loadHome();
  home.state.light = { exams: findRows(), identityDigest: 'a'.repeat(64) };
  // one shard of one exam: its `exams` is a subset, so row numbers would shift if the screen read it
  home.state.catalog = { complete: false, exams: findRows().slice(2, 3), records: [], taxonomy: [], projectionPolicy: {} };
  home.state.view = 'find';
  assert.equal(home.catalogExams().length, findRows().length, 'the finder lists the whole list');
  home.state.view = 'home';
  assert.equal(home.catalogExams().length, findRows().length, 'the home lists the whole list');
  home.state.view = 'compose';
  assert.equal(home.catalogExams().length, 1, 'other screens read the catalog they hold');
  home.state.catalog.complete = true;
  home.state.view = 'find';
  assert.equal(home.catalogExams().length, 1, 'a complete catalog is the list');
});
