// Quick assessments (5분 테스트 / 소단원 / 중단원 / 종합평가) on the unified unit layer (S8).
// Module behaviour and shortage rendering use synthetic entries; the screens and the real pool run against the
// production catalog.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');
const core = require('../archive/archive2-core.js');
const Unified = require('../archive/archive2-unified-units.js');
const Quick = require('../archive/archive2-quick-pools.js');
const archiveSource = require('../archive/archive2-source.js');
const navigation = require('../archive/archive2-navigation.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
let catalogPromise;
const catalog = () => (catalogPromise ||= productionCatalog().then(result => result.data));

let counter = 0;
const uid = () => 'qid_v1_' + (++counter).toString(16).padStart(64, '0');
function record(bucket, extra = {}) {
  return {
    questionUid: uid(), identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED',
    sourceFile: 'original/high/h1/a.js', sourceOrdinal: counter, sourceFingerprint: 'fp' + counter,
    sourceStatus: 'VERIFIED', difficultyBucket: bucket, difficultyConfidence: 'high',
    difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL', ...extra,
  };
}
function entry(rec, extra = {}) {
  return {
    record: rec, uid: rec.questionUid, grade: '고1', subject: 'COMMON_MATH_1', subjectLabel: '공통수학1',
    unitKey: 'H22-C-01', unitLabel: '다항식의 연산', unitOrder: 1, unclassified: false, views: ['고1'], ...extra,
  };
}
const indexOf = entries => {
  const views = Object.fromEntries(Unified.GRADES.map(grade => [grade, []]));
  for (const row of entries) for (const view of row.views) views[view].push(row);
  return { views, byUid: new Map(entries.map(row => [row.uid, row])) };
};
const middleSubject = Unified.subjectsForGrade('중1')[0].value;
function middleParent(L2, order) {
  const row = { unitKey: 'RPM22-M1-L1-06', grade: '중1', curriculumKey: '2022',
    courseKey: 'M1-2', L1: '평면도형', L2, label: L2, order, orderInUnit: order };
  const parentKey = JSON.stringify([row.curriculumKey, row.courseKey, row.L1, row.L2]);
  return Object.freeze({ ...row, key: parentKey, parentKey });
}
function middleEntry(rec, parent, extra = {}) {
  return entry(rec, { grade: '중1', subject: middleSubject, subjectLabel: '중1 수학',
    unitKey: 'RPM22-M1-L1-06', unitLabel: '평면도형', unitOrder: 6, views: ['중1'], originalCurriculum: '2022',
    rpmParent: parent, rpmParentStatus: parent ? 'EXACT' : 'LEGACY_PARENT_AMBIGUOUS', ...extra });
}
const many = (bucket, count, make = record) => Array.from({ length: count }, () => make(bucket));
function shortUnitCatalog() {
  // The standard unit-test preset needs 4 bucket-1, 10 bucket-2 and 6 bucket-3 questions.
  // One fewer bucket-3 question gives this unclassified synthetic unit a stable one-question shortage.
  const records = [...many(1, 4), ...many(2, 10), ...many(3, 5)].map(rec => ({
    ...rec, sourceGrade: '고1', effectiveBrowseGrade: '고1',
    subject: '공통수학1', standardCourse: '공통수학1',
  }));
  return { indexVersion: 'quick-pools-shortage-fixture', records };
}

test('the four products keep their sizes and difficulty mixes', () => {
  assert.deepEqual(Quick.VIEWS, ['five-minute', 'subunit-test', 'unit-test', 'monthly-test']);
  assert.deepEqual(Object.values(Quick.PRODUCTS).map(product => product.count), [4, 12, 20, 24]);
  for (const product of Object.values(Quick.PRODUCTS))
    for (const preset of Object.values(product.presets))
      assert.equal(preset.reduce((sum, [, count]) => sum + count, 0), product.count, product.title);
  assert.equal(Quick.PRODUCTS['monthly-test'].combine, true);
  assert.equal(Quick.PRODUCTS['five-minute'].combine, undefined);
});

test('quick pools use the one difficulty lane: any integer bucket 1–4 with intact identity/source', () => {
  const verified = record(2);
  const noConfidence = record(2, { difficultyConfidence: undefined, difficultyBoundaryFlag: undefined, legacyLevelCompatibility: undefined });
  const holdUnbound = record(2, { sourceStatus: 'HOLD' });
  const borderlineReview = record(2, { legacyLevelCompatibility: 'BORDERLINE_REVIEW' });
  const holdContentBound = record(2, { sourceStatus: 'HOLD', metaBinding: 'content' });
  const conflict = record(2, { metadataConflicts: ['difficultyBucket'] });
  const labelOnly = record(null, { difficultyBucket: null, legacyLevel: '중' });
  const stringBucket = record('2');
  const bucket5 = record(5);
  const annotated = record(3, { sourceIssueHold: true, sourceDefectCandidate: true, sourceQualityDisposition: 'SOURCE_BLOCKED', reviewStatus: 'HOLD' });
  const brokenSource = record(3, { sourceIntegrityStatus: 'MISMATCH' });
  const noFingerprint = record(3, { sourceFingerprint: '' });
  const usable = (rec, mode) => Quick.usableBucket(rec, mode);
  assert.equal(usable(verified), 2);
  assert.equal(usable(noConfidence), 2, 'confidence/boundary/compatibility are not quick selection gates');
  assert.equal(usable(noConfidence, 'eligible'), 2, 'there is no separate strict lane: every mode gives the same result');
  assert.equal(usable(borderlineReview), 2, 'BORDERLINE_REVIEW is a label, not a gate');
  assert.equal(usable(holdUnbound), 2, 'a missing text binding is a label, not a gate');
  assert.equal(usable(holdUnbound, 'eligible'), 2);
  assert.equal(usable(holdContentBound), 2, 'content-bound metadata remains usable');
  assert.equal(usable(holdContentBound, 'eligible'), 2);
  assert.equal(usable(conflict), 2, 'difficulty metadata conflicts do not block quick selection');
  assert.equal(usable(conflict, 'eligible'), 2);
  assert.equal(usable(labelOnly), 0, 'the legacy 하/중/상 label is never turned into a number');
  assert.equal(usable(labelOnly, 'recorded'), 0);
  assert.equal(usable(stringBucket), 0);
  assert.equal(usable(bucket5), 0, '5단계 is in no preset');
  assert.equal(usable(annotated), 3, 'source review annotations are not usage gates');
  assert.equal(usable(brokenSource), 0);
  assert.equal(usable(noFingerprint), 0);
  const pools = Quick.buildPools(indexOf([verified, noConfidence, holdUnbound, holdContentBound, annotated, bucket5].map(r => entry(r))));
  assert.equal(pools.stats.usable, 5);
  assert.equal(pools.stats.bucket5, 1);
  assert.equal(pools.stats.difficultyUnusable, 0);
  const same = Quick.buildPools(indexOf([verified, noConfidence, holdUnbound, holdContentBound, annotated, bucket5].map(r => entry(r))), { difficultyMode: 'eligible' });
  assert.equal(same.stats.usable, pools.stats.usable, 'the option no longer changes the result');
  assert.equal(Quick.buildPools(indexOf([noConfidence].map(r => entry(r))), { difficultyMode: 'unknown' }).stats.usable, 1);
});

test('2015 and 2022 questions share one unit; original curriculum and keys stay untouched', () => {
  const r2015 = record(1, { curriculumKey: '2015', courseKey: '수학(상)' });
  const r2022 = record(1, { curriculumKey: '2022', courseKey: '공통수학1' });
  const before = JSON.stringify([r2015, r2022]);
  const pools = Quick.buildPools(indexOf([entry(r2015), entry(r2022)]));
  const units = Quick.unitsFor(pools, 'five-minute', '고1', 'COMMON_MATH_1');
  assert.equal(units.length, 1);
  assert.equal(units[0].counts[1], 2);
  assert.equal(units[0].label, '다항식의 연산');
  assert.doesNotMatch(JSON.stringify(units.map(({ key, label, subjectLabel }) => [key, label, subjectLabel])), /2015|2022/);
  assert.equal(JSON.stringify([r2015, r2022]), before);
  assert.deepEqual(units[0].buckets[1].map(rec => rec.curriculumKey), ['2015', '2022']);
});

test('presets: a unit is ready only when every step of the mix is covered; the reason names the shortage', () => {
  const ready = [...many(2, 2), ...many(3, 2)].map(r => entry(r));
  const short = [...many(2, 2), ...many(3, 1)].map(r => entry(r, { unitKey: 'H22-C-02', unitLabel: '항등식과 나머지 정리', unitOrder: 2 }));
  const pools = Quick.buildPools(indexOf([...ready, ...short]));
  const product = Quick.PRODUCTS['five-minute'];
  const units = Quick.unitsFor(pools, 'five-minute', '고1', 'COMMON_MATH_1');
  assert.deepEqual(units.map(unit => unit.unitKey), ['H22-C-01', 'H22-C-02'], 'curriculum order');
  const parts = Quick.partition(units, product, 'standard');
  assert.deepEqual(parts.ready.map(row => row.unit.unitKey), ['H22-C-01']);
  assert.deepEqual(parts.short.map(row => row.unit.unitKey), ['H22-C-02']);
  assert.deepEqual(parts.short[0].verdict.shortages, [{ bucket: 3, need: 2, have: 1 }]);
  assert.equal(Quick.shortageText(parts.short[0].verdict.shortages), '3단계 2문항 필요 · 1문항 가능');
  // A harder mix needs a step the unit does not have.
  assert.deepEqual(Quick.partition(units, product, 'application').ready.map(row => row.unit.unitKey), []);
  assert.equal(Quick.presetMix(product, 'standard'), '2단계 2문항 · 3단계 2문항');
  // 종합평가 combines units: the union can satisfy a mix that no single unit does.
  const monthly = Quick.PRODUCTS['monthly-test'];
  const union = [...many(1, 4), ...many(2, 6), ...many(3, 4)].map(r => entry(r));
  const more = [...many(2, 6), ...many(3, 4)].map(r => entry(r, { unitKey: 'H22-C-02', unitLabel: '항등식과 나머지 정리', unitOrder: 2 }));
  const unionPools = Quick.buildPools(indexOf([...union, ...more]));
  const both = Quick.unitsFor(unionPools, 'monthly-test', '고1', 'COMMON_MATH_1');
  assert.equal(Quick.partition(both, monthly, 'standard').ready.length, 0);
  assert.equal(Quick.evaluate(both, monthly, 'standard').ok, true);
  assert.deepEqual(Quick.evaluate(both.slice(0, 1), monthly, 'standard').shortages.map(row => row.bucket), [2, 3]);
});

test('unclassified questions form a last 단원 미분류 unit; questions without a subject stay out', () => {
  const classified = entry(record(1));
  const loose = entry(record(1), { unitKey: '', unitLabel: Unified.UNCLASSIFIED_LABEL, unitOrder: 9999, unclassified: true });
  const noSubject = entry(record(1), { subject: '', subjectLabel: '기타 문항', unclassified: true, unitKey: '' });
  const pools = Quick.buildPools(indexOf([loose, classified, noSubject]));
  const units = Quick.unitsFor(pools, 'unit-test', '고1', 'COMMON_MATH_1');
  assert.deepEqual(units.map(unit => unit.label), ['다항식의 연산', '단원 미분류']);
  assert.equal(units[1].kind, 'unclassified');
  assert.equal(pools.stats.noSubject, 1);
});

test('고2 and 고3 views share a source question; a question is counted once per unit', () => {
  const shared = record(2);
  const first = entry(shared, { grade: '고2', subject: 'ALGEBRA', subjectLabel: '대수', unitKey: 'H22-A-01', views: ['고2', '고3'] });
  const pools = Quick.buildPools(indexOf([first, { ...first }]));
  for (const grade of ['고2', '고3']) {
    const units = Quick.unitsFor(pools, 'five-minute', grade, 'ALGEBRA');
    assert.equal(units.length, 1, grade);
    assert.equal(units[0].total, 1, 'the same question is not pooled twice');
  }
  assert.equal(pools.stats.usable, 1);
});

test('소단원 pools use only recorded sub-units, labelled in Korean, under the unified unit', () => {
  const rows = [...many(1, 3), ...many(2, 3)].map(r => entry(r));
  const unrecorded = entry(record(2));
  const meta = new Map();
  rows.forEach((row, i) => meta.set(row.uid, { subUnitKey: 'H22-C-01-A', subUnit: i % 4 === 0 ? 'polynomial basic' : '다항식의 덧셈과 곱셈' }));
  const pools = Quick.buildPools(indexOf([...rows, unrecorded]), { metaByUid: meta });
  const subs = Quick.unitsFor(pools, 'subunit-test', '고1', 'COMMON_MATH_1');
  assert.equal(subs.length, 1);
  assert.equal(subs[0].label, '다항식의 덧셈과 곱셈');
  assert.equal(subs[0].unitLabel, '다항식의 연산');
  assert.equal(subs[0].total, 6, 'the question without a recorded sub-unit is not guessed into one');
  assert.equal(Quick.unitsFor(pools, 'unit-test', '고1', 'COMMON_MATH_1')[0].total, 7);
  assert.equal(Quick.unitsFor(Quick.buildPools(indexOf(rows)), 'subunit-test', '고1', 'COMMON_MATH_1').length, 0);
});

test('middle current RPM subunits split one recorded broad group without changing original metadata', () => {
  const parents = [middleParent('다각형', 1), middleParent('원과 부채꼴', 2)];
  const rows = parents.flatMap(parent => [1, 2, 3].flatMap(bucket => many(bucket, bucket === 2 ? 6 : 3)
    .map(rec => middleEntry(rec, parent))));
  const meta = new Map(rows.map(row => [row.uid, Object.freeze({
    subUnitKey: 'M1-05-CORE', subUnit: '평면도형 핵심 개념', rpmL3: 'preserved-concept',
    rpmL4: 'preserved-type', approvalStatus: 'preserved-approval',
  })]));
  const before = JSON.stringify([rows, [...meta]]);
  const pools = Quick.buildPools(indexOf(rows), { metaByUid: meta });
  const subs = Quick.unitsFor(pools, 'subunit-test', '중1', middleSubject);
  assert.deepEqual(subs.map(sub => sub.subUnitKey), parents.map(parent => parent.parentKey));
  assert.deepEqual(subs.map(sub => sub.label), ['다각형', '원과 부채꼴']);
  assert.ok(subs.every(sub => sub.total === 12 && Quick.evaluate([sub], Quick.PRODUCTS['subunit-test'], 'standard').ok));
  for (const [i, sub] of subs.entries()) {
    const expected = rows.filter(row => row.rpmParent === parents[i]).map(row => row.uid).sort();
    assert.deepEqual(Quick.BUCKETS.flatMap(bucket => sub.buckets[bucket].map(rec => rec.questionUid)).sort(), expected);
    assert.ok(Quick.BUCKETS.flatMap(bucket => sub.buckets[bucket]).every(rec => rows.some(row => row.record === rec)),
      'pool records retain their original identity and fields');
  }
  assert.equal(Quick.unitsFor(pools, 'unit-test', '중1', middleSubject)[0].total, rows.length);
  assert.equal(JSON.stringify([rows, [...meta]]), before);
});

test('middle ambiguous or missing RPM parents never use a broad legacy key as a current child', () => {
  const parent = middleParent('다각형', 1);
  const rows = [
    middleEntry(record(2), null),
    middleEntry(record(2), null, { rpmParentStatus: 'NOT_FOUND' }),
    middleEntry(record(2), parent, { rpmParentStatus: 'LEGACY_PARENT_AMBIGUOUS' }),
    middleEntry(record(2), { ...parent, grade: '중2' }),
    middleEntry(record(2), { ...parent, L2: '' }),
    middleEntry(record(2), null, { rpmParentStatus: 'OUT_OF_SCOPE' }),
  ];
  const meta = new Map(rows.map(row => [row.uid, { subUnitKey: 'M1-05-CORE', subUnit: '평면도형 핵심 개념' }]));
  const before = JSON.stringify([rows, [...meta]]);
  const pools = Quick.buildPools(indexOf(rows), { metaByUid: meta });
  assert.deepEqual(Quick.unitsFor(pools, 'subunit-test', '중1', middleSubject), []);
  assert.equal(Quick.unitsFor(pools, 'unit-test', '중1', middleSubject)[0].total, rows.length,
    'unresolved subunits remain usable in the unchanged general unit pool');
  assert.equal(JSON.stringify([rows, [...meta]]), before);
});

test('2015 middle subunits retain distinct legacy pools while high-school recorded pools stay unchanged', () => {
  const parent = middleParent('다각형', 1);
  const current = middleEntry(record(2), parent);
  const legacy = middleEntry(record(2), null, { originalCurriculum: '2015', rpmParentStatus: 'OUT_OF_SCOPE' });
  const ambiguous2015 = middleEntry(record(2), null, { originalCurriculum: '2015' });
  const high = entry(record(2), { rpmParent: parent, rpmParentStatus: 'EXACT' });
  const rows = [current, legacy, ambiguous2015, high];
  // Matching key text and labels must not merge a legacy pool into the current parent.
  const meta = new Map(rows.map(row => [row.uid, { subUnitKey: parent.parentKey, subUnit: '다각형' }]));
  meta.set(high.uid, { subUnitKey: 'H22-C-01-A', subUnit: '다항식의 덧셈과 곱셈' });
  const before = JSON.stringify([rows, [...meta]]);
  const pools = Quick.buildPools(indexOf(rows), { metaByUid: meta });
  const subs = Quick.unitsFor(pools, 'subunit-test', '중1', middleSubject);
  assert.equal(subs.length, 2);
  assert.equal(new Set(subs.map(sub => sub.key)).size, 2);
  const old = subs.find(sub => sub.legacyCurriculum === '2015');
  assert.equal(old.label, '이전 분류 · 다각형');
  assert.deepEqual(old.buckets[2], [legacy.record]);
  assert.deepEqual(subs.find(sub => !sub.legacyCurriculum).buckets[2], [current.record]);
  assert.equal(Quick.unitsFor(pools, 'unit-test', '중1', middleSubject)[0].total, 3);
  const highSub = Quick.unitsFor(pools, 'subunit-test', '고1', 'COMMON_MATH_1')[0];
  assert.equal(highSub.subUnitKey, 'H22-C-01-A');
  assert.equal(highSub.label, '다항식의 덧셈과 곱셈');
  assert.deepEqual(highSub.buckets[2], [high.record]);
  assert.equal(JSON.stringify([rows, [...meta]]), before);
});

test('real catalog: pools are built once, fast, from recorded difficulty and without curriculum suffixes', async () => {
  const data = await catalog();
  assert.ok(data.records.length >= 10000);
  const index = Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  const meta = require('../archive/problem-bank-meta.js').buildIndex(data.records, []);
  const metaByUid = new Map(meta.map(row => [row.questionUid || row.uid, row]));
  const start = performance.now();
  const pools = Quick.buildPools(index, { metaByUid });
  const elapsed = performance.now() - start;
  assert.ok(elapsed < 500, `pool build ${elapsed.toFixed(1)}ms`);
  assert.ok(pools.stats.usable > 3000, `usable ${pools.stats.usable}`);
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  let checked = 0;
  for (const grade of Unified.GRADES) for (const subject of Quick.subjectsFor(pools, grade)) {
    assert.doesNotMatch(subject.label, /2015|2022/);
    for (const view of Quick.VIEWS) for (const unit of Quick.unitsFor(pools, view, grade, subject.value)) {
      assert.doesNotMatch(unit.label, /2015|2022/);
      for (const bucket of Quick.BUCKETS) for (const rec of unit.buckets[bucket]) {
        assert.equal(rec, byUid.get(rec.questionUid));
        assert.equal(rec.difficultyBucket, bucket);
        assert.equal(core.generalUseEligibility(rec).ok, true);
        assert.ok(Number.isInteger(rec.difficultyBucket) && rec.difficultyBucket >= 1 && rec.difficultyBucket <= 4);
        checked++;
      }
    }
  }
  assert.ok(checked > 5000, `checked ${checked}`);
  const strict = Quick.buildPools(index, { metaByUid, difficultyMode: 'eligible' });
  assert.equal(pools.stats.usable, strict.stats.usable, 'the difficultyMode option does not change the pool');
  const subjects = Quick.subjectsFor(pools, '고1');
  assert.deepEqual(subjects.map(subject => subject.label), ['공통수학1', '공통수학2']);
});

function harness(data, { quick = true } = {}) {
  const events = new Map(), nodes = new Map(), opened = [];
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', textContent: '', dataset: {}, hidden: false,
      setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const published = [];
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone,
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {}, setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem() {} },
    document: {
      baseURI: 'https://archive.test/archive/workspace.html',
      getElementById: node, querySelector: () => null, querySelectorAll: () => [],
      body: { dataset: {} },
      addEventListener: (name, callback) => { (events.get(name) || events.set(name, []).get(name)).push(callback); },
    },
    addEventListener() {},
    fetch: async url => ({ ok: true, json: async () => JSON.parse(read(new URL(String(url)).pathname.replace(/^\/archive\//, ''))) }),
    Archive2Core: core, Archive2UnifiedUnits: Unified, Archive2QuickPools: quick ? Quick : undefined,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    ProblemBankAssessmentRecipes: require('../archive/problem-bank-assessment-recipes.js'),
    Archive2Canonical: core.Canonical,
    Archive2Output: {
      ...require('../archive/archive2-output.js'),
      publishOutputEnvelope: async input => { published.push(input); return { id: 'envelope' }; },
      outputEnvelopeUrl: () => new URL('https://archive.test/archive/mixed_engine.html?x=1'),
    },
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: { ...archiveSource, restore: async records => records.map(rec => ({ questionUid: rec.questionUid })) },
  });
  ctx.window = ctx;
  ctx.window.open = () => {
    const popup = { document: { body: {} }, location: { replace: href => opened.push(href) }, close() { popup.closed = true; } };
    return popup;
  };
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  vm.runInContext(source.slice(0, startup) + `
    globalThis.workspaceTest = {state, render, renderQuick, quickState, routeUrl, readUrl, openQuickAssessment,
      balancedQuickSelection, setQuickPoolCache: cache => { quickPoolCache = cache; }};
  })();`, ctx);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.useMode = 'general';
  w.state.indexVersion = data.indexVersion;
  w.state.metaIndex = require('../archive/problem-bank-meta.js').buildIndex(data.records, []);
  w.state.metaIndexSource = data.records;
  const click = async dataset => {
    const target = {
      dataset, disabled: false, closest: selector => (selector === 'button' ? target : null),
    };
    for (const callback of events.get('click') || []) await callback({ target });
  };
  const change = async (el) => { for (const callback of events.get('change') || []) await callback({ target: el }); };
  return { w, ctx, nodes, click, change, published, opened, node };
}

test('middle balanced selection uses exact current L2 even without a recorded subunit row', () => {
  const polygon = middleParent('다각형', 1), circle = middleParent('원과 부채꼴', 2);
  const rows = [polygon, polygon, circle].map((parent, i) => middleEntry(record(2, {
    sourceFile: `original/middle/m1/balance-${i}.js`, sourceGrade: '중1', effectiveBrowseGrade: '중1',
    year: i < 2 ? 2026 : 2025, L1: '기존 평면도형', L2: '기존 넓은 소단원',
  }), parent));
  const meta = new Map(rows.slice(0, 2).map(row => [row.uid, { subUnitKey: 'M1-05-CORE', subUnit: '평면도형 핵심 개념' }]));
  const index = indexOf(rows), pools = Quick.buildPools(index, { metaByUid: meta });
  const before = JSON.stringify([rows, [...meta]]), paths = rows.map(row => core.generalPathKey(row.record));
  const h = harness({ indexVersion: 'middle-rpm-balance', records: rows.map(row => row.record) });
  h.w.setQuickPoolCache({ index, metaByUid: meta });
  const selected = h.w.balancedQuickSelection(Quick.unitsFor(pools, 'unit-test', '중1', middleSubject), [[2, 2]]);
  assert.equal(selected.length, 2);
  assert.deepEqual(new Set(selected.map(rec => index.byUid.get(rec.questionUid).rpmParent.parentKey)),
    new Set([polygon.parentKey, circle.parentKey]), 'the second choice covers the other exact L2 before repeating the newest one');
  assert.equal(JSON.stringify([rows, [...meta]]), before);
  assert.deepEqual(rows.map(row => core.generalPathKey(row.record)), paths, 'request paths remain the original paths');
});

test('middle balanced selection keeps a 2015 legacy group distinct from an identically named current parent', () => {
  const parent = middleParent('다각형', 1);
  const rows = [0, 1, 2].map(i => middleEntry(record(2, {
    sourceFile: `original/middle/m1/legacy-balance-${i}.js`, sourceGrade: '중1', effectiveBrowseGrade: '중1',
    year: i < 2 ? 2026 : 2025, L2: '기존 소단원',
  }), i < 2 ? parent : null, i < 2 ? {} : { originalCurriculum: '2015', rpmParentStatus: 'OUT_OF_SCOPE' }));
  const meta = new Map(rows.map(row => [row.uid, { subUnitKey: parent.parentKey, subUnit: '다각형' }]));
  const index = indexOf(rows), pools = Quick.buildPools(index, { metaByUid: meta });
  const h = harness({ indexVersion: 'middle-rpm-legacy-balance', records: rows.map(row => row.record) });
  h.w.setQuickPoolCache({ index, metaByUid: meta });
  const selected = h.w.balancedQuickSelection(Quick.unitsFor(pools, 'unit-test', '중1', middleSubject), [[2, 2]]);
  assert.equal(selected.length, 2);
  assert.ok(selected.includes(rows[2].record), 'the legacy group remains available without merging into the exact current parent');
  assert.equal(selected.filter(rec => rec === rows[0].record || rec === rows[1].record).length, 1);
});

test('screens: each product shows unified units, no curriculum suffix, ready cards and bundle controls', async () => {
  const data = await catalog();
  const h = harness(data);
  for (const view of Quick.VIEWS) {
    h.w.state.view = view;
    h.w.quickState.grade = '고1';
    h.w.quickState.subject = 'COMMON_MATH_1';
    const start = performance.now();
    const html = h.w.renderQuick();
    const elapsed = performance.now() - start;
    assert.ok(elapsed < 500, `${view} first render ${elapsed.toFixed(1)}ms`);
    assert.match(html, new RegExp(`<h1>${Quick.PRODUCTS[view].title}</h1>`));
    assert.match(html, /data-view="five-minute"/);
    assert.match(html, /data-view="monthly-test"/);
    assert.match(html, /data-action="quick-subject"[^>]*data-subject="COMMON_MATH_2"/);
    assert.doesNotMatch(html, /· 2015|· 2022|\b2015\b개정 ·/);
    assert.match(html, /1단계 \d+ · 2단계 \d+ · 3단계 \d+/);
    const t2 = performance.now();
    h.w.renderQuick();
    assert.ok(performance.now() - t2 < 100, 'a second render reads the cached pools');
  }
  h.w.state.view = 'five-minute';
  const html = h.w.renderQuick();
  assert.match(html, /data-action="quick-unit"/);
  assert.match(html, /이 난이도로 만들 수 있는 단원 \d+개/);
  h.w.state.view = 'unit-test';
  h.w.quickState.subject = 'COMMON_MATH_1';
  const unitHtml = h.w.renderQuick();
  assert.match(unitHtml, /data-action="quick-unit"/);
  h.w.state.view = 'monthly-test';
  const monthly = h.w.renderQuick();
  assert.match(monthly, /data-quick-bundle=/);
  assert.match(monthly, /data-action="quick-open-all"/);
  // grade not chosen yet -> prompt only
  h.w.quickState.grade = '';
  assert.match(h.w.renderQuick(), /학년을 선택하세요/);
});

test('screens: the grade choice picks a usable default subject; middle school has one subject', async () => {
  const data = await catalog();
  const h = harness(data);
  h.w.state.view = 'five-minute';
  await h.click({ action: 'quick-grade', grade: '고2' });
  assert.equal(h.w.quickState.grade, '고2');
  h.w.renderQuick();
  assert.equal(h.w.quickState.subject, 'ALGEBRA', '대수 comes first in curriculum order');
  await h.click({ action: 'quick-grade', grade: '중1' });
  const html = h.w.renderQuick();
  assert.equal(h.w.quickState.subject, 'MIDDLE');
  assert.doesNotMatch(html, /data-action="quick-subject"/);
  const quickUrl = h.w.routeUrl();
  assert.equal(quickUrl.searchParams.get('qgrade'), '중1');
  assert.equal(quickUrl.searchParams.get('qsubject'), 'MIDDLE');
  assert.equal(quickUrl.searchParams.has('grade'), false, 'grade/subject belong to the Finder and 출제 내역');
  assert.equal(quickUrl.searchParams.has('subject'), false);
});

test('opening a unit selects the preset mix once per usable step and publishes 4 distinct questions', async () => {
  const data = await catalog();
  const h = harness(data);
  h.w.state.view = 'five-minute';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  const html = h.w.renderQuick();
  const key = html.match(/data-action="quick-unit"\s+data-unit-key="([^"]+)"/)[1];
  await h.click({ action: 'quick-unit', unitKey: key });
  assert.equal(h.published.length, 1);
  const { questionUids, meta, questionCount } = h.published[0];
  assert.equal(questionCount, 4);
  assert.equal(new Set(questionUids).size, 4);
  assert.match(meta.title, /^5분 테스트 · /);
  assert.deepEqual(meta.scopeKeys, [key]);
  assert.equal(meta.grade, '고1');
  assert.equal(meta.subject, '공통수학1');
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  assert.deepEqual(questionUids.map(id => byUid.get(id).difficultyBucket).sort(), [2, 2, 3, 3]);
  // Quick assessments use recorded difficulty after the technical source/identity gate.
  // Strict metadata approval is deliberately not a selection requirement.
  for (const id of questionUids) {
    const record = byUid.get(id);
    assert.equal(core.generalUseEligibility(record).ok, true);
    assert.equal(Quick.usableBucket(record), record.difficultyBucket);
  }
  assert.equal(h.opened.length, 1);
});

test('opening refuses a unit that cannot make the mix and a changed question state is caught before printing', async () => {
  const data = shortUnitCatalog();
  const h = harness(data);
  h.w.state.view = 'unit-test';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  const html = h.w.renderQuick();
  assert.match(html, /class="quick-unit is-short" disabled aria-disabled="true"/);
  assert.match(html, /class="quick-reason">/);
  // The deterministic synthetic fixture keeps the visible shortage and refusal path stable.
  const index = Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  const units = Quick.unitsFor(Quick.buildPools(index), 'unit-test', '고1', 'COMMON_MATH_1');
  const short = Quick.partition(units, Quick.PRODUCTS['unit-test'], 'standard').short;
  assert.ok(short.length > 0, 'the current catalog contains a short unit');
  await h.w.openQuickAssessment([short[0].unit.key]);
  assert.equal(h.published.length, 0, 'a short unit never prints');
  // Review-only HOLD is intentionally usable; a genuine source-integrity failure is not.
  h.w.state.view = 'monthly-test';
  h.w.renderQuick();
  for (const record of data.records) record.sourceIntegrityStatus = 'MISMATCH';
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 0, 'stale technically invalid questions are re-checked and dropped');
});

test('the quick products have one navigation tab that stays active on all four views', () => {
  const markup = navigation.markup('workspace');
  assert.match(markup, /data-view="five-minute" data-nav-key="quick"/);
  assert.match(navigation.markup('unit'), /href="workspace.html\?view=five-minute"/);
  assert.equal((markup.match(/빠른 평가/g) || []).length, 1, 'one PC menu entry; the phone menu has 5 cells and reaches it from 홈 and 만들기');
  assert.match(read('archive2-workspace.js'), /class="phone-quick-link" data-view="five-minute"/, '만들기 screen links to 빠른 평가');
  const html = read('workspace.html');
  const order = ['archive2-unified-units.js', 'archive2-quick-pools.js', 'archive2-workspace.js'].map(file => html.indexOf(file));
  assert.ok(order.every((position, i) => position > 0 && (!i || position > order[i - 1])));
  for (const view of Quick.VIEWS) {
    const ctx = vm.createContext({ URLSearchParams, location: { search: `?view=${view}` } });
    ctx.module = { exports: {} };
    vm.runInContext(read('archive2-navigation.js'), ctx);
    assert.equal(ctx.module.exports.currentKey('workspace'), 'quick', view);
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'tools/archive-pages-release-manifest.json'), 'utf8'));
  assert.ok(manifest.archiveRootFiles.includes('archive2-quick-pools.js'));
});

test('workspace has no leftover per-curriculum quick course options', () => {
  const source = read('archive2-workspace.js');
  assert.doesNotMatch(source, /quickAssessmentUnits|renderFiveMinute|openFiveMinuteUnit|five-minute-course|five-minute-grade/);
  assert.doesNotMatch(source, /\$\{unit\.courseKey\}|curriculumKey\}`\)\.join|· \$\{unit\.curriculumKey\}/);
});

test('quick-assessment URL state stays out of the Finder and 출제 내역', async () => {
  const data = await catalog();
  const h = harness(data);
  const at = search => { h.ctx.location = new URL('https://archive.test/archive/workspace.html' + search); };
  // a reload of a quick screen restores the quick selection only
  at('?view=five-minute&qgrade=고1&qsubject=COMMON_MATH_1');
  h.w.readUrl();
  assert.equal(h.w.state.view, 'five-minute');
  assert.equal(h.w.quickState.grade, '고1');
  assert.equal(h.w.quickState.subject, 'COMMON_MATH_1');
  assert.ok(!h.w.state.find.grade, 'no Finder grade from a quick URL');
  assert.ok(Object.values(h.w.state.recentFilters).every(value => value === ''));
  // the route a click on 출제 내역 / 기출·자료 writes carries nothing from the quick screen
  for (const view of ['recent', 'find']) {
    h.w.state.view = view;
    const params = h.w.routeUrl().searchParams;
    for (const key of ['grade', 'subject', 'qgrade', 'qsubject'])
      assert.equal(params.has(key), false, `${view} must not carry ${key}`);
  }
  // reading that route back leaves the filters empty
  at('?view=recent');
  h.w.readUrl();
  assert.equal(h.w.state.recentFilters.grade, '');
  assert.equal(h.w.state.recentFilters.subject, '');
  // an older quick link that used grade/subject does not fill another view's filters
  at('?view=five-minute&grade=고1&subject=COMMON_MATH_1');
  h.w.readUrl();
  assert.equal(h.w.quickState.grade, '');
  assert.ok(!h.w.state.find.grade, 'no Finder grade from a quick URL');
  assert.equal(h.w.state.recentFilters.subject, '');
  // the Finder and 출제 내역 keep their own grade/subject parameters
  at('?view=find&grade=고1');
  h.w.readUrl();
  assert.equal(h.w.state.find.grade, '고1');
  assert.equal(h.w.routeUrl().searchParams.get('grade'), '고1');
  at('?view=recent&grade=고1&subject=ALGEBRA');
  h.w.readUrl();
  assert.equal(h.w.state.recentFilters.grade, '고1');
  assert.equal(h.w.state.recentFilters.subject, 'ALGEBRA');
  assert.equal(h.w.routeUrl().searchParams.get('subject'), 'ALGEBRA');
  // switching quick -> recent -> find keeps the filters clean
  at('?view=unit-test&qgrade=고2&qsubject=ALGEBRA');
  h.w.readUrl();
  for (const view of ['recent', 'find']) {
    h.w.state.view = view;
    assert.equal(h.w.routeUrl().searchParams.has('grade'), false);
  }
});
