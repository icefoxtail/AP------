const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');

// Loads the workspace script (minus its network bootstrap) and exposes the home helpers.
function loadHome() {
  const storage = new Map();
  const nodes = new Map();
  const node = id => {
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
    atob: v => Buffer.from(v, 'base64').toString('binary'),
    btoa: v => Buffer.from(v, 'binary').toString('base64'),
    location: new URL('https://test.invalid/archive/workspace.html?view=home'),
    history: { pushState() {}, replaceState() {} },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
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
    displayTitle: exam => [exam.year, exam.school, exam.grade].filter(Boolean).join(' '),
    materialKind: () => 'exam',
  };
  context.Archive2Source = {};
  context.Archive2Papers = { receipt: () => null, partIndex: i => Math.floor(i / 50), lockedUids: () => new Set(), status: () => ({}) };
  const ctx = vm.createContext(context);
  vm.runInContext(read('archive2-canonical.js'), ctx);
  vm.runInContext(read('archive2-core.js'), ctx);
  vm.runInContext(read('archive2-history.js'), ctx);
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  assert.ok(startup > 0);
  vm.runInContext(source.slice(0, startup) + `
    globalThis.homeTest = { state, homeSchoolChips, readRecentExams, rememberRecentExam, homeExamList,
      renderHome, relativeDayLabel, gradeClass };
  })();`, ctx);
  return { ctx, storage, home: ctx.homeTest };
}

const exam = (file, school, extra = {}) => ({
  file, school, grade: '고1', year: 2025, semester: 1, examType: 'mid', material: 'exam',
  qCount: 22, subject: '공통수학1', ...extra,
});

test('school chips are computed from the loaded exams, most exams first, and never fixed', () => {
  const { home } = loadHome();
  home.state.catalog = { exams: [
    exam('a1.js', '가나고'), exam('a2.js', '가나고'), exam('a3.js', '가나고'),
    exam('b1.js', '다라고'), exam('b2.js', '다라고'),
    exam('c1.js', '마바고'),
    exam('x.js', '교과서학교', { material: 'textbook' }),
    exam('n.js', ''),
  ], records: [], taxonomy: [] };
  assert.deepEqual(JSON.parse(JSON.stringify(home.homeSchoolChips())), [
    { school: '가나고', count: 3 }, { school: '다라고', count: 2 }, { school: '마바고', count: 1 },
  ]);
  assert.equal(home.homeSchoolChips(2).length, 2);
  home.state.catalog = { exams: [], records: [], taxonomy: [] };
  assert.deepEqual(JSON.parse(JSON.stringify(home.homeSchoolChips())), [], 'no data, no chips');
  const markup = home.renderHome();
  assert.doesNotMatch(markup, /data-school=/);
});

test('home shows the chips as school searches and grade buttons as links to the unit page', () => {
  const { home } = loadHome();
  home.state.catalog = { exams: [exam('a1.js', '가나고')], records: [], taxonomy: [] };
  const markup = home.renderHome();
  assert.match(markup, /data-action="home-school"[^>]*data-school="가나고"/);
  assert.match(markup, /data-action="home-all-schools"/);
  assert.match(markup, /학교, 학년, 시험을 띄어 쓰면 모두 맞는 시험지만 나옵니다\./);
  for (const [label, id] of [['중1', 'm1'], ['중2', 'm2'], ['중3', 'm3'], ['고1', 'h1'], ['고2', 'h2'], ['고3', 'h3']])
    assert.match(markup, new RegExp(`href="unit-past-exams\\.html\\?ready=1&amp;grade=${id}">${label}</a>`));
  assert.doesNotMatch(markup, /다시 열기|유사문제/, 'sections that need later stages are not shown');
});

test('recent opens are kept newest first, deduplicated and capped at 8', () => {
  const { home, storage } = loadHome();
  for (let i = 0; i < 10; i++) home.rememberRecentExam({ file: `f${i}.js` }, 1000 + i);
  home.rememberRecentExam({ file: 'f5.js' }, 2000);
  const rows = home.readRecentExams();
  assert.equal(rows.length, 8);
  assert.equal(rows[0].file, 'f5.js');
  assert.equal(rows.filter(row => row.file === 'f5.js').length, 1);
  home.rememberRecentExam({}, 1);
  home.rememberRecentExam(null, 1);
  assert.equal(home.readRecentExams().length, 8, 'a missing exam adds nothing');
  storage.set('APMATH_ARCHIVE2_RECENT_EXAMS_v1', '{not json');
  assert.equal(home.readRecentExams().length, 0, 'a damaged record reads as empty');
});

test('a blocked or full browser storage never throws and never hides the home screen', () => {
  const { ctx, home } = loadHome();
  const broken = { getItem() { throw new Error('SecurityError'); }, setItem() { throw new Error('QuotaExceededError'); } };
  ctx.localStorage = broken;
  assert.doesNotThrow(() => home.rememberRecentExam({ file: 'a.js' }));
  assert.equal(home.readRecentExams().length, 0);
  home.state.catalog = { exams: [exam('a.js', '가나고')], records: [], taxonomy: [] };
  let markup = '';
  assert.doesNotThrow(() => { markup = home.renderHome(); });
  assert.match(markup, /최근 연도 기출/, 'falls back to the newest exams');
  ctx.localStorage = undefined;
  assert.doesNotThrow(() => home.rememberRecentExam({ file: 'a.js' }));
  assert.doesNotThrow(() => home.readRecentExams());
});

test('recently opened exams come first with the existing exam actions; missing files are skipped', () => {
  const { home } = loadHome();
  home.state.catalog = { exams: [exam('a.js', '가나고'), exam('b.js', '다라고', { grade: '중2' })], records: [], taxonomy: [] };
  home.rememberRecentExam({ file: 'gone.js' }, Date.now());
  home.rememberRecentExam({ file: 'b.js' }, Date.now());
  const markup = home.renderHome();
  assert.match(markup, /최근 연 기출/);
  assert.doesNotMatch(markup, /gone\.js/);
  assert.match(markup, /home-exam grade-m2/);
  for (const mode of ['exam', 'sol', 'ans'])
    assert.match(markup, new RegExp(`data-action="source-output-direct"[^>]*data-exam="1" data-mode="${mode}"`));
  assert.match(markup, /data-action="source-issue"[^>]*data-exam="1"/);
  assert.match(markup, /반에 출제/);
});

test('relative day labels', () => {
  const { home } = loadHome();
  const now = new Date(2026, 10, 10, 15, 0).getTime();
  const day = n => new Date(2026, 10, 10 - n, 9, 0).getTime();
  assert.equal(home.relativeDayLabel(day(0), now), '오늘');
  assert.equal(home.relativeDayLabel(day(1), now), '어제');
  assert.equal(home.relativeDayLabel(day(3), now), '3일 전');
  assert.equal(home.relativeDayLabel(day(8), now), '지난주');
  assert.equal(home.relativeDayLabel(day(20), now), '10월 21일');
});

test('home keeps the draft resume and quick assessment entries and the moved tool links', () => {
  const { home } = loadHome();
  home.state.catalog = { exams: [exam('a.js', '가나고')], records: [], taxonomy: [] };
  const markup = home.renderHome();
  assert.match(markup, /만들던 문제지/);
  assert.match(markup, /data-product-key="generated-bank"/);
  for (const key of ['five-minute-test', 'subunit-assessment', 'unit-assessment', 'exam-prep'])
    assert.match(markup, new RegExp(`data-product-key="${key}"`));
  assert.match(markup, /href="problem-bank-search\.html"/);
  assert.match(markup, /data-view="health"/);
  assert.match(markup, /href="index\.html\?legacy=1"/);
});

test('the three screens that moved into the 보관함 · 출제 내역 switch show it', () => {
  assert.match(read('archive2-library.js'), /libraryTabs\?\.\("saved"\)/);
  assert.match(read('archive2-workspace.js'), /libraryTabs\?\.\("recent"\)/);
});
