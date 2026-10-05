const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const scopeHarness = require('./helpers/archive2-scope-harness.cjs');
const approvedTestCatalog = scopeHarness.catalog;
const withTestAssignments = scopeHarness.withTestAssignments;
const projectionPolicy = approvedTestCatalog.projectionPolicy;
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'archive', name), 'utf8');
const readRoot = (...parts) => fs.readFileSync(path.join(root, ...parts), 'utf8');
const plain = value => JSON.parse(JSON.stringify(value));

// Node-only unit harness. No browser/Chromium/Playwright, no catalog stub placed
// at the production path, no network. Real core + workspace handlers are executed;
// DOM sinks and the HTTP boundary are test doubles, not a visual/render test.
function harness(fetcher = async () => { throw new Error('unexpected network'); }) {
  const events = new Map(), nodes = new Map(), storage = new Map(), timers = new Map();
  let nextTimerId = 1;
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: '', textContent: '', dataset: {}, open: false,
      setAttribute(k, v) { this[k] = v; }, addEventListener() {},
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
      querySelectorAll() { return []; },
    });
    return nodes.get(id);
  };
  const context = {
    console, URL, URLSearchParams, Date, crypto, structuredClone,
    setTimeout(callback, delay) { const id = nextTimerId++; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); }, matchMedia: () => ({ matches: false }),
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    btoa: value => Buffer.from(value, 'binary').toString('base64'),
    location: new URL('https://test.invalid/archive/workspace.html?view=recent'),
    history: { pushState() {}, replaceState() {} },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      getElementById: node, querySelectorAll: () => [],
      createElement: () => ({
        content: { firstElementChild: { querySelector: () => ({}) } },
      }),
      querySelector: selector => selector === '[data-recent-filter="subject"]' ? node('recent-subject') : null,
      body: { dataset: {} },
      addEventListener: (name, callback) => { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    },
    fetch: fetcher,
  };
  context.window = context;
  context.addEventListener = () => {};
  context.Archive2Output = { matchesMaterial: (exam, material) => !material || exam.material === material };
  context.Archive2Source = {};
  context.Archive2Papers = {
    receipt: () => null, partIndex: index => Math.floor(index / 50), lockedUids: () => new Set(),
    status: (_count, receipts) => ({ complete: receipts.length > 0 }),
  };
  const ctx = vm.createContext(context);
  vm.runInContext(read('archive2-canonical.js'), ctx);
  vm.runInContext(read('archive2-core.js'), ctx);
  vm.runInContext(read('archive2-history.js'), ctx);
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  assert.ok(startup > 0, 'only skip the network bootstrap, not handlers');
  vm.runInContext(source.slice(0, startup) + `
    render = () => { globalThis.workspaceRenderCount++; };
    globalThis.workspaceRenderCount = 0;
    globalThis.workspaceTest = {
      state, filterMarkup, finderSchoolValues, reconcileFinderSchool, scopeOptions, pool,
      recentAssignmentMarkup, renderRecent, loadRecent, changeRecentFilter, applyDraft, draft, replace,
      getCandidates: () => candidateRecords,
      setClasses: rows => { classRows = rows; },
      getClasses: () => classRows,
      getRenderCount: () => globalThis.workspaceRenderCount,
    };
  })();`, ctx);
  const w = ctx.workspaceTest;
  w.state.catalog = { taxonomy: [], records: [], exams: [], indexVersion: 'unit-test' };
  w.state.finderIndex = ctx.Archive2Core.buildFinderIndex(w.state.catalog);
  storage.set('APMATH_SESSION', JSON.stringify({ login_id: 'unit-test', session_token: 'unit-test' }));
  return {
    c: ctx.Archive2Core, h: ctx.Archive2History, w, nodes, node,
    async event(type, target, extra = {}) { for (const callback of events.get(type) || []) await callback({ target, ...extra }); },
    async flushTimers() {
      while (timers.size) {
        const pending = [...timers.values()]; timers.clear();
        for (const timer of pending) await timer.callback();
      }
    },
    timerDelays: () => [...timers.values()].map(timer => timer.delay),
  };
}
function catalogFixture(h) {
  const records = [], exams = [];
  function add(file, grade, school, entries) {
    const sourcePath = `original/${grade.startsWith('중') ? `middle/m${grade[1]}` : `high/h${grade[1]}`}/1mid/${file}`;
    exams.push({ file: sourcePath, grade, sourceGrade: grade, effectiveBrowseGrade: grade, school,
      year: 2025, semester: 1, examType: 'mid', material: 'exam', courseRanges: [], curriculums: [] });
    for (const entry of entries) {
      const parent = approvedTestCatalog.canonicalAuthority.canonicalParents.find(row =>
        row.grade === grade && row.curriculumKey === entry.curriculumKey && row.courseKey === entry.courseKey);
      const index = records.length + 1;
      const questionUid = 'qid_v1_' + String(index).padStart(64, '0');
      records.push({
        ...(parent || { grade, curriculumKey: entry.curriculumKey, courseKey: entry.courseKey,
          L1: '분류 미승인', L2: entry.legacyStandardUnitKey || entry.courseKey }),
        sourceFile: sourcePath, sourceQuestionNo: String(index), sourceOrdinal: index, questionUid,
        identityStatus: 'VERIFIED', sourceStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED',
        sourceFingerprint: crypto.createHash('sha256').update('frozen-source:' + questionUid).digest('hex'),
        assignmentFingerprint: crypto.createHash('sha256').update('assignment:' + questionUid).digest('hex'),
        taxonomyStatus: 'CONFIRMED', reviewStatus: 'reviewed_pass',
        difficultyBucket: 2, difficultyConfidence: 'high', difficultyBoundaryFlag: 'NONE',
        legacyLevelCompatibility: 'NORMAL', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true,
        effectiveBrowseGrade: grade, sourceGrade: grade, school, year: 2025, examAxis: '1-mid',
        L3: '유형', L4: '세부유형', __testApprovedAssignment: Boolean(parent), ...entry,
      });
    }
  }
  add('old-c1.js', '고1', '경우고', [{ curriculumKey: '2015', courseKey: '수학(하)', legacyStandardUnitKey: 'H15-SB-06' }]);
  add('old-c2.js', '고1', '좌표고', [{ curriculumKey: '2015', courseKey: '수학(상)', legacyStandardUnitKey: 'H15-SA-09' }]);
  add('new-c1.js', '고1', '공통고', [
    { curriculumKey: '2022', courseKey: '공통수학1', legacyStandardUnitKey: 'H22-C-01' },
    { curriculumKey: '2022', courseKey: '공통수학1', legacyStandardUnitKey: 'H22-C-01' },
  ]);
  add('mixed.js', '고1', '혼합고', [
    { curriculumKey: '2015', courseKey: '수학(하)', legacyStandardUnitKey: 'H15-SB-06' },
    { curriculumKey: '2022', courseKey: '공통수학2', legacyStandardUnitKey: 'H22-C2-01' },
    { curriculumKey: '2022', courseKey: '공통수학2', legacyStandardUnitKey: 'H22-C2-01' },
  ]);
  for (const grade of ['고2', '고3']) for (const subject of h.c.HIGH_SEMANTIC_SUBJECTS) {
    const oldCourse = projectionPolicy.high23SharedSubjects.find(row => row.grade === grade && row.curriculumKey === '2015' && row.projectionKey === subject.value)?.courseKey;
    const newCourse = projectionPolicy.high23SharedSubjects.find(row => row.grade === grade && row.curriculumKey === '2022' && row.projectionKey === subject.value)?.courseKey;
    add(`${grade}-${subject.value}-old.js`, grade, `${subject.value}구고`, [{ curriculumKey: '2015', courseKey: oldCourse }]);
    add(`${grade}-${subject.value}-new.js`, grade, `${subject.value}신고`, [{ curriculumKey: '2022', courseKey: newCourse }]);
  }
  for (const grade of ['중1', '중2', '중3']) for (const curriculumKey of ['2015', '2022'])
    add(`${grade}-${curriculumKey}.js`, grade, `${grade}${curriculumKey}중`, [{ curriculumKey, courseKey: `M${grade[1]}-1` }]);
  const taxonomy = records.map(r => ({ curriculumKey: r.curriculumKey, courseKey: r.courseKey, L1: r.L1, L2: r.L2, L3: r.L3, L4: r.L4 }));
  const data = withTestAssignments({ ...approvedTestCatalog, records, exams, taxonomy,
    projectionPolicy, indexVersion: 'unit-test' }, records);
  Object.assign(h.w.state, { catalog: data, finderIndex: h.c.buildFinderIndex(data),
    byUid: new Map(records.map(r => [r.questionUid, r])), indexVersion: data.indexVersion });
  return { records, exams, taxonomy, catalog: data };
}
const schools = (h, filters) => plain(h.w.finderSchoolValues(filters));
const change = (h, field, value) => h.event('change', { id: '', dataset: { group: 'compose', filter: field }, value });
function installCatalog(h, data) {
  h.w.state.catalog = data;
  h.w.state.finderIndex = h.c.buildFinderIndex(data);
  h.w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  h.w.state.indexVersion = data.indexVersion;
}

for (const grade of ['중1', '중2', '중3']) test(`${grade}: school curriculum filter and stale family remain safe`, async () => {
  const h = harness(); catalogFixture(h);
  h.w.state.filters = { grade, curriculumKey: '2015', courseKey: `M${grade[1]}-1`, school: `${grade}2015중`, family: 'COMMON_1' };
  await change(h, 'curriculumKey', '2022');
  assert.equal(h.w.state.filters.school, '');
  assert.equal(h.w.state.filters.family, '');
  assert.deepEqual(schools(h, h.w.state.filters), [`${grade}2022중`]);
  assert.doesNotMatch(h.w.filterMarkup(h.w.state.filters, 'compose', true), /data-filter="family"/);
});
test('Compose and Finder use only exact native high1 course+curriculum projections', () => {
  const h = harness(); catalogFixture(h);
  for (const [curriculumKey, semanticSubject, expected] of [
    ['2015', 'H1_2015_MATH_DOWN', ['경우고', '혼합고']],
    ['2022', 'COMMON_MATH_1', ['공통고']],
    ['2015', 'H1_2015_MATH_UP', ['좌표고']],
    ['2022', 'COMMON_MATH_2', ['혼합고']],
  ]) {
    const f = { grade: '고1', curriculumKey, semanticSubject };
    assert.deepEqual(schools(h, f), expected);
    const markup = h.w.filterMarkup(f, 'compose', true);
    const select = markup.match(/<select data-filter="school"[^>]*>([\s\S]*?)<\/select>/)[1];
    for (const school of ['경우고', '좌표고', '공통고', '혼합고']) assert.equal(select.includes(school), expected.includes(school));
  }
});
test('changing curriculum clears only an invalid school, preserving high1 subject', async () => {
  const h = harness(); catalogFixture(h);
  h.w.state.filters = { grade: '고1', curriculumKey: '2015', semanticSubject: 'COMMON_MATH_1', school: '경우고', L3: 'old', L4: 'old' };
  h.w.state.scopes = ['old-scope'];
  await change(h, 'curriculumKey', '2022');
  assert.equal(h.w.state.filters.school, '');
  assert.equal(h.w.state.filters.semanticSubject, 'COMMON_MATH_1');
  assert.equal(h.w.state.filters.L3, undefined); assert.equal(h.w.state.filters.L4, undefined);
  assert.equal(h.w.state.scopes.length, 0);
  h.w.state.filters.school = '공통고';
  await change(h, 'curriculumKey', '');
  assert.equal(h.w.state.filters.school, '공통고');
});
test('subject changes clear invalid schools but keep schools available in both buckets', async () => {
  const h = harness(); catalogFixture(h);
  h.w.state.filters = { grade: '고1', semanticSubject: 'H1_2015_MATH_UP', school: '좌표고' };
  await change(h, 'semanticSubject', 'H1_2015_MATH_DOWN');
  assert.equal(h.w.state.filters.school, '');
  h.w.state.filters.school = '혼합고';
  await change(h, 'semanticSubject', 'H1_2015_MATH_DOWN');
  assert.equal(h.w.state.filters.school, '혼합고');
});
for (const grade of ['고2', '고3']) test(`${grade}: all five subjects preserve curriculum intersections and clear stale school`, async () => {
  const h = harness(); catalogFixture(h);
  assert.deepEqual(plain(h.c.subjectProjectionOptions(grade).map(x => x.label)), ['대수', '미적분Ⅰ', '확률과 통계', '미적분Ⅱ', '기하']);
  for (const subject of h.c.HIGH_SEMANTIC_SUBJECTS) {
    h.w.state.filters = { grade, semanticSubject: subject.value, curriculumKey: '2015', school: `${subject.value}구고` };
    assert.deepEqual(schools(h, h.w.state.filters), [`${subject.value}구고`]);
    await change(h, 'curriculumKey', '2022');
    assert.equal(h.w.state.filters.school, '');
    assert.equal(h.w.state.filters.semanticSubject, subject.value);
    assert.deepEqual(schools(h, h.w.state.filters), [`${subject.value}신고`]);
  }
});
test('고2·고3 Finder browse shares the same approved high-semantic source pool', () => {
  const h = harness();
  const fixture = catalogFixture(h);
  for (const exam of fixture.exams) exam.school += ` ${exam.grade}`;
  for (const record of fixture.records) record.school += ` ${record.sourceGrade}`;
  installCatalog(h, fixture.catalog);

  for (const { value: semanticSubject } of h.c.highSemanticSubjectOptions()) {
    const expectedSchools = [
      `${semanticSubject}구고 고2`,
      `${semanticSubject}구고 고3`,
      `${semanticSubject}신고 고2`,
      `${semanticSubject}신고 고3`,
    ].sort();
    for (const grade of ['고2', '고3'])
      assert.deepEqual(
        schools(h, { grade, semanticSubject }),
        expectedSchools,
        `${grade} ${semanticSubject} Finder should browse the shared high-semantic pool`,
      );
  }
});
test('unapproved high-semantic course labels cannot create a shared cross-grade projection', () => {
  const { c } = harness();
  const file = 'original/high/h2/1mid/unapproved-shared-subject.js';
  const exam = { file, grade: '고2', sourceGrade: '고2', effectiveBrowseGrade: '고2' };
  const record = { sourceFile: file, sourceGrade: '고2', curriculumKey: '2015', courseKey: '대수' };
  const index = c.buildFinderIndex({
    taxonomy: [], records: [record], exams: [exam], projectionPolicy,
  });
  assert.equal(c.subjectProjectionForRecord(record, '', projectionPolicy), '');
  assert.equal(c.matches(record, { grade: '고3', semanticSubject: 'ALGEBRA' }, { projectionPolicy }), false);
  assert.equal(c.finderMatches(exam, { grade: '고3', semanticSubject: 'ALGEBRA' }, index), false);
});
test('high1 projections retain native course identities and reject unapproved unit aliases', () => {
  const { c } = harness();
  assert.equal(c.isHighSemanticSubjectGrade('고1'), false);
  assert.deepEqual(plain(c.subjectProjectionOptions('고1').map(x => x.label)), ['공통수학1', '공통수학2', '수학(상)', '수학(하)']);
  assert.deepEqual(plain(require('../archive/data/archive2-canonical-projection-policy.json').high1CompatibilityProjections), []);
  const policy = projectionPolicy;
  const project = (curriculumKey, courseKey, extra = {}) => c.subjectProjectionForRecord({
    sourceGrade: '고1', curriculumKey, courseKey, ...extra,
  }, '고1', policy);
  assert.equal(project('2015', '수학(상)'), 'H1_2015_MATH_UP');
  assert.equal(project('2015', '수학(하)'), 'H1_2015_MATH_DOWN');
  assert.equal(project('2022', '공통수학1'), 'COMMON_MATH_1');
  assert.equal(project('2022', '공통수학2'), 'COMMON_MATH_2');
  assert.equal(project('2015', 'M3-1', { legacyStandardUnitKey: 'H15-SA-09' }), '');
  assert.equal(project('2015', '수학(상)', { sourceGrade: '고2' }), '');
  assert.equal(c.subjectProjectionForRecord({ curriculumKey: '2015', courseKey: '수학(상)' }, '고1', policy), '');
});
test('Compose pool/scopes still consume the record-level projection authority', () => {
  const h = harness(); catalogFixture(h);
  for (const semanticSubject of ['H1_2015_MATH_UP', 'H1_2015_MATH_DOWN', 'COMMON_MATH_1', 'COMMON_MATH_2']) {
    h.w.state.filters = { grade: '고1', semanticSubject };
    const pool = h.w.pool().filter(r => h.c.matches(r, h.w.state.filters, h.w.state));
    assert.ok(pool.length);
    assert.ok(pool.every(r => h.c.subjectProjectionForRecord(r, '고1', projectionPolicy) === semanticSubject));
    const selectable = pool.filter(r => h.c.eligibility(r, h.w.state).ok &&
      h.c.basicScopeParent(r, h.w.state.catalog.basicScopeLinks, h.w.state.catalog.canonicalAuthority));
    assert.equal(h.w.scopeOptions().reduce((sum, s) => sum + s.count, 0), selectable.length);
  }
  const source = read('archive2-workspace.js');
  assert.equal((source.match(/subject: C\.subjectProjectionLabel\(state\.filters\)/g) || []).length, 2);
  assert.match(source, /candidateRecords = pool\(\)\.filter\([\s\S]*?C\.matches\(r, selectionFilters, state\)/);
});
test('Finder-to-Compose clears stale school without losing the selected subject', async () => {
  const h = harness(); catalogFixture(h);
  h.w.state.find = { grade: '고1', semanticSubject: 'COMMON_MATH_2' };
  h.w.state.filters = { grade: '고1', semanticSubject: 'COMMON_MATH_1', school: '경우고' };
  const button = { dataset: { action: 'go-compose' }, disabled: false };
  await h.event('click', { closest: () => button });
  assert.equal(h.w.state.filters.school, '');
  assert.equal(h.w.state.filters.semanticSubject, 'COMMON_MATH_2');
});
test('draft school repair preserves UID, fingerprint and frozen receipt contracts', () => {
  const h = harness(); const fixture = catalogFixture(h);
  const r = fixture.records[0];
  h.w.state.selected = [{ ...r, rowId: 'r1' }];
  h.w.state.filters = { grade: '고1', curriculumKey: '2022', semanticSubject: 'COMMON_MATH_1', school: '경우고' };
  const d = plain(h.w.draft());
  h.w.applyDraft(d);
  assert.equal(h.w.state.filters.school, '');
  assert.equal(h.w.state.selected[0].questionUid, r.questionUid);
  assert.equal(h.w.state.selected[0].sourceFingerprint, r.sourceFingerprint);
  const saved = { id: 'a', key: 'frozen', partIndex: 0, questionUids: [r.questionUid], ready: true };
  const frozen = { ...d, sealed: true, receipts: [saved] };
  h.w.applyDraft(frozen);
  assert.deepEqual(plain(h.w.state.receipts), [saved]);
  assert.equal(h.w.state.selected[0].questionUid, r.questionUid);
  assert.throws(() => h.w.applyDraft({ ...d, selected: [{ ...d.selected[0], sourceFingerprint: 'changed' }] }), /원본 문항이 변경/);
});

test('saved Compose L3/L4 labels migrate only with a current approved advanced assignment and exact scope', () => {
  const meta = approvedTestCatalog.records.find(row => scopeHarness.core.advancedEligible(row, {
    canonicalAuthority: approvedTestCatalog.canonicalAuthority,
  }));
  const h = harness();
  installCatalog(h, { ...approvedTestCatalog, records: [meta] });
  const path = h.c.pathKey(meta, 4);
  h.w.state.filters = { grade: meta.sourceGrade };
  const scope = h.w.scopeOptions().find(row => row.paths.includes(path));
  assert.ok(scope);
  h.w.state.scopes = [scope.key];
  h.w.state.filters = { grade: meta.sourceGrade, L3: meta.L3, L4: meta.L4 };
  h.w.state.rows = [{ id: 'saved', paths: [path], depth: 4, count: 1, difficultyBuckets: [2] }];
  h.w.state.selected = [{ ...meta, rowId: 'saved' }];
  const saved = plain(h.w.draft());
  saved.scopeSourcePaths = [path];
  saved.scopes = [scope.key];
  h.w.applyDraft(saved);
  assert.equal(h.w.state.filters.L3, h.c.advancedFilterValue(meta, 3));
  assert.equal(h.w.state.filters.L4, h.c.advancedFilterValue(meta, 4));
  assert.equal(h.c.matches(h.w.state.selected[0], { ...h.w.state.filters, primaryPaths: [path] }, h.w.state), true);
  const request = { canonicalAuthority: h.w.state.catalog.canonicalAuthority,
    filters: { ...h.w.state.filters, primaryPaths: [path] }, rows: h.w.state.rows };
  assert.notEqual(h.c.review(h.w.state.selected, request).status, 'HARD_BLOCK');
});

test('unissued draft restores legacy advanced labels only when its exact approved scope remains', () => {
  const meta = approvedTestCatalog.records.find(row => scopeHarness.core.advancedEligible(row, {
    canonicalAuthority: approvedTestCatalog.canonicalAuthority,
  }));
  const h = harness();
  installCatalog(h, { ...approvedTestCatalog, records: [meta] });
  const path = h.c.pathKey(meta, 4);
  h.w.state.filters = { grade: meta.sourceGrade };
  const scope = h.w.scopeOptions().find(row => row.paths.includes(path));
  assert.ok(scope);
  h.w.state.scopes = [scope.key];
  h.w.state.filters = { grade: meta.sourceGrade, L3: meta.L3, L4: meta.L4 };
  const saved = plain(h.w.draft());
  saved.scopeSourcePaths = [path];
  assert.equal(saved.rows.length, 0);
  h.w.applyDraft(saved);
  assert.equal(h.w.state.filters.L3, h.c.advancedFilterValue(meta, 3));
  assert.equal(h.w.state.filters.L4, h.c.advancedFilterValue(meta, 4));
  assert.throws(() => h.w.applyDraft({ ...saved, scopes: [], scopeSourcePaths: [] }), /현재 분류 기준이 변경/);
});
test('issued Compose filters cannot be changed by the school P2 handler', async () => {
  const h = harness(); catalogFixture(h);
  h.w.state.filters = { grade: '고1', semanticSubject: 'COMMON_MATH_1', school: '경우고' };
  h.w.state.receipts = [{ id: 'issued' }]; const before = plain(h.w.state.filters);
  await change(h, 'semanticSubject', 'COMMON_MATH_2');
  assert.deepEqual(plain(h.w.state.filters), before);
});

test('changing Compose count after input still invalidates generated paper state and rerenders', async () => {
  const h = harness(); catalogFixture(h);
  Object.assign(h.w.state, {
    count: 10,
    selected: [{ questionUid: 'selected' }],
    rows: [{ id: 'generated-row' }],
    prepared: [{ id: 'prepared-paper' }],
    pins: ['pinned-question'],
    undo: [{ id: 'undo-entry' }],
    ackWarnings: true,
    indexVersion: 'stale-index',
  });
  const panel = {
    querySelector: () => ({ replaceWith() {} }),
    querySelectorAll: () => [],
    insertBefore() {},
  };
  const count = {
    id: 'count', value: '12', dataset: {},
    closest: selector => selector === '.panel' ? panel : null,
  };

  await h.event('input', count);
  assert.equal(h.w.state.count, 12);
  assert.deepEqual(plain(h.w.state.selected), []);
  assert.deepEqual(plain(h.w.state.rows), []);
  assert.deepEqual(plain(h.w.state.prepared), []);
  assert.equal(h.w.getRenderCount(), 0);

  await h.event('change', count);
  assert.deepEqual(plain(h.w.state.pins), []);
  assert.deepEqual(plain(h.w.state.undo), []);
  assert.equal(h.w.state.ackWarnings, false);
  assert.equal(h.w.state.indexVersion, 'unit-test');
  assert.equal(h.w.getRenderCount(), 1);
});

function historyFixture(h) {
  const classes = [
    { id: 'c1', name: '중3 A', grade: '중3' },
    { id: 'c2', name: '고2 B', grade: '고2' },
  ];
  const assignments = [
    { id: 'a1', class_id: 'c1', grade_label: '고1', subject: '공통수학1', exam_date: '2026-09-22', exam_title: '중간 고사 대비', question_count: 20, pdf_status: 'ready' },
    { id: 'a2', class_id: 'c1', subject: '공통수학2', exam_date: '2026-09-22', exam_title: '좌표 확인', question_count: 10, pdf_status: 'pending', mixed_payload_json: JSON.stringify({ meta: { grade: '고1' } }), recipient_count: 0, submitted_count: 0 },
    { id: 'a3', class_id: 'c2', grade_label: '고2', subject: '수학I', exam_date: '2026-09-20T23:00:00+09:00', exam_title: '중간고사 대수', question_count: 15, pdf_status: 'ready', recipient_count: 12, submitted_count: 8 },
    { id: 'a4', class_id: 'c1', grade_label: '고1', subject: '수학(상)', exam_date: '', exam_title: '보존 기록', question_count: 5 },
  ];
  return { classes, assignments, rows: h.h.normalizeAssignments(assignments, classes, [], h.c) };
}
test('history separates target class grade from paper grade without mutating assignment snapshots', () => {
  const h = harness(); const f = historyFixture(h); const before = JSON.stringify(f.assignments);
  const rows = h.h.normalizeAssignments(f.assignments, f.classes, [], h.c);
  assert.equal(rows[0].className, '중3 A');
  assert.equal(rows[0].targetGrade, '중3'); assert.equal(rows[0].grade, '중3');
  assert.equal(rows[0].contentGrade, '고1'); assert.equal(rows[0].subjectLabel, '공통수학1');
  assert.equal(rows[2].targetGrade, '고2'); assert.equal(rows[2].contentGrade, '고2'); assert.equal(rows[2].subjectLabel, '대수');
  assert.equal(rows[0].recipientCount, null); assert.equal(rows[1].recipientCount, 0);
  const apiGradeWins = h.h.normalizeAssignments([{ class_id: 'c1', class_grade: '중2', grade_label: '고1', subject: '공통수학1' }], f.classes, [], h.c)[0];
  assert.equal(apiGradeWins.targetGrade, '중2'); assert.equal(apiGradeWins.contentGrade, '고1');
  assert.equal(JSON.stringify(f.assignments), before);
});
test('high1 history retains exact saved course projections and never rewrites curriculum identity', () => {
  const h = harness();
  const rows = h.h.normalizeAssignments([
    { id: 'raw', grade_label: '고1', subject: '수학(상)' },
    { id: 'mixed', grade_label: '고1', mixed_payload_json: { meta: { grade: '고1' }, questions: [
      { sourceGrade: '고1', curriculumKey: '2015', courseKey: '수학(상)', projectionPolicy },
      { sourceGrade: '고1', curriculumKey: '2022', courseKey: '공통수학2', projectionPolicy },
    ] } },
  ], [], [], h.c);
  assert.deepEqual(plain(rows[0].subjectKeys), ['H1_2015_MATH_UP']);
  assert.deepEqual(new Set(plain(rows[1].subjectKeys)), new Set(['H1_2015_MATH_UP', 'COMMON_MATH_2']));
  assert.equal(rows[1].subjectLabel, '공통수학2 · 수학(상)');
  assert.ok(!rows[1].subjectKeys.includes('COMMON_MATH_1'));
  assert.deepEqual(plain(h.h.filterAssignments(rows, { subject: 'H1_2015_MATH_UP' }).map(r => r.id)), ['raw', 'mixed']);
  assert.deepEqual(plain(h.h.filterAssignments(rows, { subject: 'COMMON_MATH_2' }).map(r => r.id)), ['mixed']);
});
test('history supports all five high-school semantic labels and safe malformed payloads', () => {
  const h = harness();
  for (const grade_label of ['고2', '고3']) for (const subject of h.c.HIGH_SEMANTIC_SUBJECTS) {
    const row = h.h.normalizeAssignments([{ grade_label, subject: subject.courseKeys.at(-1), mixed_payload_json: '{broken' }], [], [], h.c)[0];
    assert.deepEqual(plain(row.subjectKeys), [subject.value]); assert.equal(row.subjectLabel, subject.label);
  }
  for (const value of [null, '', ' ', -1, 'bad', true]) {
    const row = h.h.normalizeAssignments([{ recipient_count: value, submitted_count: value }], [], [], h.c)[0];
    assert.equal(row.recipientCount, null); assert.equal(row.submittedCount, null);
  }
});
test('recent summary normalizer exposes PDF and lifecycle states without inferring missing values', () => {
  const h = harness();
  const [row] = h.h.normalizeAssignments([{
    id: 'cancelled-parent', class_id: 'c1', class_name: '고1 A반', class_grade: '고1',
    exam_title: '개정 전 시험', exam_date: '2026-09-22', pdf_status: 'failed', pdf_error: 'worker offline',
    cancelled_at: '2026-09-23T00:00:00Z', review_only_count: 2,
    replacement_assignment_id: 'replacement-exact', replaces_assignment_id: '',
  }], [{ id: 'c1', name: '고1 A반', grade: '고1' }], [], h.c);
  assert.equal(row.pdfStatus, 'failed'); assert.equal(row.pdfError, 'worker offline');
  assert.equal(row.isCancelled, true); assert.equal(row.isReviewOnly, true);
  assert.equal(row.reviewOnlyCount, 2); assert.equal(row.replacementAssignmentId, 'replacement-exact');
  const [unknown] = h.h.normalizeAssignments([{ id: 'legacy', pdf_status: null }], [], [], h.c);
  assert.equal(unknown.pdfStatus, 'pending'); assert.equal(unknown.reviewOnlyCount, null);
  assert.equal(unknown.isCancelled, false);
});
test('all history filters compose conjunctively; period includes both endpoints', () => {
  const h = harness(); const { rows } = historyFixture(h);
  assert.deepEqual(plain(h.h.filterAssignments(rows, { from: '2026-09-20', to: '2026-09-22', grade: '중3', classId: 'c1', subject: 'COMMON_MATH_1', query: '중간고사' }).map(r => r.id)), ['a1']);
  assert.equal(h.h.filterAssignments(rows, { from: '2026-09-23', to: '2026-09-20' }).length, 0);
  assert.equal(h.h.filterAssignments(rows, { from: '2026-09-22', to: '2026-09-22' }).length, 2);
  assert.equal(h.h.filterAssignments(rows, { query: '없는 제목' }).length, 0);
});
test('date groups are newest-first, same-day grouped, stable and do not mutate the input', () => {
  const h = harness(); const { rows } = historyFixture(h); const before = JSON.stringify(rows);
  const groups = h.h.groupByDate(rows);
  assert.deepEqual(plain(groups.map(g => g.date)), ['2026-09-22', '2026-09-20', '']);
  assert.equal(groups[0].rows.length, 2);
  assert.equal(JSON.stringify(rows), before);
  assert.equal(h.h.dateKey('2026-09-22T23:30:00-10:00'), '2026-09-22');
  assert.equal(h.h.dateKey('2026-02-30'), '');
});
test('compact history markup separates drafts, preserves the detail action and escapes untrusted text', () => {
  const h = harness(); const f = historyFixture(h);
  h.w.setClasses(f.classes); Object.assign(h.w.state, { recentClassId: '', recentRows: f.rows });
  let markup = h.w.renderRecent();
  for (const filter of ['from', 'to', 'grade', 'subject', 'query']) assert.ok(markup.includes(`data-recent-filter="${filter}"`));
  assert.match(markup, /id="recent-class"/); assert.match(markup, /전체 반/);
  assert.match(markup, /대상 중3/); assert.match(markup, /시험지 고1 · 공통수학1/);
  assert.match(markup, /<aside class="history-drafts"/);
  assert.match(markup, /학생별 확인/);
  assert.match(markup, /data-mode="exam" class="small"[^>]*>시험/);
  assert.match(markup, /data-mode="sol" class="small"[^>]*>해설/);
  assert.match(markup, /data-mode="ans" class="small"[^>]*>정답/);
  assert.match(markup, /PDF 다시 준비/);
  assert.match(markup, /data-action="assignment-status"/);
  assert.doesNotMatch(markup, /assignment-students|\/status|<iframe/);
  assert.match(markup, /대상 0명/); assert.match(markup, /제출 0명/);
  const malicious = { ...f.rows[0], id: 'a" onclick="alert(1)', title: '<script>alert(1)</script>' };
  h.w.state.recentRows = [malicious]; markup = h.w.recentAssignmentMarkup();
  assert.doesNotMatch(markup, /<script>|data-assignment="a" onclick/);
  assert.match(markup, /&lt;script&gt;/);
  assert.doesNotMatch(markup, /대상 0명|제출 0명/);
});
test('CSS stays history-scoped, with compact 2-column desktop and 1-column mobile contract', () => {
  const css = read('archive2-history.css');
  assert.match(css, /\.history-grid\s*\{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.history-grid\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.doesNotMatch(css, /\.mobile-nav|bottom-nav|data-archive-navigation|position:\s*fixed/);
  const html = read('workspace.html');
  assert.ok(html.indexOf('archive2-history.js') < html.indexOf('archive2-workspace.js'));
  assert.match(html, /archive2-navigation\.js\?v=20260929-saved-library-2/);
});
test('history sends server filters after a debounce and never calls per-card status', async () => {
  const calls = []; let h;
  h = harness(async url => {
    calls.push(String(url));
    const data = String(url).endsWith('/qr-classes') ? { classes: [
      { id: 'c1', name: '중3 A', grade: '중3' }, { id: 'c2', name: '고2 B', grade: '고2' },
    ] } : { assignments: Array.from({ length: 100 }, (_, i) => ({
      id: `a${i}`, class_id: i % 2 ? 'c1' : 'c2', class_grade: i % 2 ? '중3' : '고2',
      grade_label: i % 2 ? '고1' : '고2', subject: i % 2 ? '공통수학1' : '수학I', exam_date: '2026-09-22',
    })) };
    return { ok: true, json: async () => data };
  });
  await h.w.loadRecent();
  assert.equal(calls.length, 2); assert.ok(calls[1].endsWith('/class-exam-assignments/recent-summary?limit=1000'));
  assert.equal(h.w.state.recentRows.length, 100); assert.equal(h.w.state.recentClassId, '');
  assert.equal(h.h.filterAssignments(h.w.state.recentRows, { grade: '중3' }).length, 50);
  h.w.recentAssignmentMarkup();
  await h.event('input', { dataset: { recentFilter: 'query' }, value: '오래된 제목' });
  assert.equal(calls.length, 2, 'typing does not issue one request per keystroke');
  assert.deepEqual(h.timerDelays(), [300]);
  await h.flushTimers();
  assert.equal(calls.length, 3);
  const request = new URL(calls[2]);
  assert.equal(request.searchParams.get('query'), '오래된 제목');
  assert.equal(request.searchParams.get('limit'), '1000');
  assert.ok(calls.every(url => !url.endsWith('/status')));
});
test('class filter is server-backed and blank means all classes rather than zero results', async () => {
  const calls = []; const h = harness(async url => {
    calls.push(String(url));
    if (String(url).endsWith('/qr-classes')) return { ok: true, json: async () => ({ classes: [
      { id: 'c1', name: '중3 A', grade: '중3' }, { id: 'c2', name: '고2 B', grade: '고2' },
    ] }) };
    return { ok: true, json: async () => ({ assignments: [
      { id: 'one', class_id: 'c1', class_grade: '중3', grade_label: '고1', subject: '공통수학1', exam_title: '첫 시험', exam_date: '2026-09-22' },
      { id: 'two', class_id: 'c2', class_grade: '고2', grade_label: '고2', subject: '수학I', exam_title: '둘째 시험', exam_date: '2026-09-22' },
    ] }) };
  });
  await h.w.loadRecent();
  assert.match(h.w.recentAssignmentMarkup(), /첫 시험/); assert.match(h.w.recentAssignmentMarkup(), /둘째 시험/);
  await h.event('change', { id: 'recent-class', dataset: {}, value: 'c1' });
  assert.match(h.node('recent-assignments').innerHTML, /첫 시험/); assert.doesNotMatch(h.node('recent-assignments').innerHTML, /둘째 시험/);
  await h.flushTimers();
  assert.equal(new URL(calls.at(-1)).searchParams.get('class'), 'c1');
  await h.event('change', { id: 'recent-class', dataset: {}, value: '' });
  assert.match(h.node('recent-assignments').innerHTML, /첫 시험/); assert.match(h.node('recent-assignments').innerHTML, /둘째 시험/);
  await h.flushTimers();
  assert.equal(new URL(calls.at(-1)).searchParams.has('class'), false);
  await h.event('change', { id: '', dataset: { recentFilter: 'grade' }, value: '중3' });
  assert.match(h.node('recent-class').innerHTML, /중3 A/); assert.doesNotMatch(h.node('recent-class').innerHTML, /고2 B/);
  await h.flushTimers();
  assert.equal(new URL(calls.at(-1)).searchParams.get('grade'), '중3');
  assert.equal(calls.length, 5);
});
test('worker history list supports whole, grade and class scopes with class metadata in one response', () => {
  const worker = readRoot('apmath', 'worker-backup', 'worker', 'routes', 'exams.js');
  const start = worker.indexOf("const historyList = url.searchParams.get('history') === '1'");
  const end = worker.indexOf("if (!classId) return jsonResponse", start);
  const block = worker.slice(start, end);
  assert.ok(start > 0 && end > start);
  assert.match(block, /getAllowedClassIds\(env, currentTeacher\)/);
  assert.match(block, /a\.class_id = \?/);
  assert.match(block, /REPLACE\(COALESCE\(c\.grade/);
  assert.match(block, /SUBSTR\(COALESCE\(a\.exam_date/);
  assert.match(block, /c\.name AS class_name, c\.grade AS class_grade/);
  assert.match(block, /dedupeClassExamAssignments/);
});
test('recent and student detail expose cancellation, replacement, review-only, and exact deep-link identity', () => {
  const h = harness(); const { classes, rows } = historyFixture(h);
  const stateRow = {
    ...rows[0], id: 'parent-assignment', title: '취소된 원본', pdfReady: false,
    pdfStatus: 'failed', pdfError: 'PDF worker offline', isCancelled: true,
    replacementAssignmentId: 'replacement-assignment', isReviewOnly: true, reviewOnlyCount: 1,
  };
  h.w.setClasses(classes); h.w.state.recentRows = [stateRow]; h.w.state.recentClassId = '';
  const markup = h.w.recentAssignmentMarkup();
  assert.match(markup, /취소됨/);
  assert.match(markup, /대체됨 · replacement-assignment/);
  assert.match(markup, /열람 전용 · 1명/);
  assert.match(markup, /PDF 준비 실패/);
  assert.match(markup, /PDF 다시 준비/);
  const workspace = read('archive2-workspace.js');
  assert.match(workspace, /url\.searchParams\.set\("assignment_id", String\(a\.id \|\| id\)\)/);
  assert.match(workspace, /url\.searchParams\.set\("student_id", String\(studentId \|\| ""\)\)/);
  assert.match(workspace, /url\.searchParams\.set\("omr", "1"\)/);
});
test('additive recent summary is bounded and leaves compatible history API intact', () => {
  const worker = readRoot('apmath', 'worker-backup', 'worker', 'routes', 'exams.js');
  const start = worker.indexOf("if (id === 'recent-summary') {");
  const end = worker.indexOf("const historyList = url.searchParams.get('history') === '1'", start);
  assert.ok(start > 0 && end > start);
  const summary = worker.slice(start, end);
  assert.match(summary, /Math\.min\(1000, limitInput\)/);
  assert.match(summary, /LIMIT \?/);
  assert.match(summary, /subject_term/);
  assert.match(summary, /exam_title/);
  assert.match(summary, /replacement_assignment_id/);
  assert.match(summary, /review_only_count/);
  assert.doesNotMatch(summary, /mixed_payload_json/);
  assert.ok(worker.slice(end).includes("url.searchParams.get('history') === '1'"));
});
test('history load failures do not display old-class cards as new results', async () => {
  const h = harness(async () => { throw new Error('test list unavailable'); });
  h.w.setClasses([{ id: 'c1', name: '1반' }]); h.w.state.recentRows = [{ id: 'old' }];
  await assert.rejects(h.w.loadRecent(), /test list unavailable/);
  assert.equal(h.w.state.recentRows.length, 0); assert.equal(h.w.state.recentLoading, false);
  assert.match(h.w.recentAssignmentMarkup(), /test list unavailable/);
});
test('Korean IME title search applies at compositionend and leaves unrelated filters untouched', async () => {
  const h = harness(); const f = historyFixture(h); h.w.state.recentRows = f.rows; h.w.state.recentClassId = '';
  const before = plain(h.w.state.filters), el = { dataset: { recentFilter: 'query' }, value: '중간고사' };
  await h.event('input', el, { isComposing: true }); assert.equal(h.w.state.recentFilters.query, '');
  await h.event('compositionend', el); assert.equal(h.w.state.recentFilters.query, '중간고사');
  assert.deepEqual(plain(h.w.state.filters), before);
  assert.match(h.node('recent-assignments').innerHTML, /중간 고사 대비/);
  assert.doesNotMatch(h.node('recent-assignments').innerHTML, /좌표 확인/);
});

// pool() remains a broad source/path helper; the actual replacement boundary
// applies C.matches, exactly as selectBlueprint/review do in the shared core.
test('replacement candidates execute the shared high1 subject gate', () => {
  const h = harness(); const { records } = catalogFixture(h);
  for (const semanticSubject of ['COMMON_MATH_1', 'COMMON_MATH_2']) {
    h.w.state.filters = { grade: '고1', semanticSubject };
    const current = records.find(r => h.c.matches(r, h.w.state.filters, h.w.state));
    assert.ok(current, semanticSubject);
    h.w.state.selected = [{ ...current, rowId: 'selected-row' }];
    h.w.state.rows = [{ id: 'selected-row', count: 1 }];
    h.w.replace(0);
    const candidates = h.w.getCandidates();
    assert.ok(candidates.length, `${semanticSubject}; diagnostics=${JSON.stringify(records.filter(r => h.c.matches(r, h.w.state.filters, h.w.state)).map(r => h.c.eligibility(r, h.w.state)))}`);
    assert.ok(candidates.every(r => h.c.subjectProjectionForRecord(r, '고1', projectionPolicy) === semanticSubject));
    assert.ok(candidates.every(r => r.questionUid !== current.questionUid));
  }
});
