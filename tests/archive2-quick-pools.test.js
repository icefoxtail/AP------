// Quick assessments (5분 테스트 / 소단원 / 중단원 / 종합평가) on the unified unit layer (S8).
// Module behaviour and shortage rendering use synthetic entries; the screens and the real pool run against the
// production catalog.
const test = require('node:test');
const timeBudget = require('./helpers/time-budget.cjs');
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
const Tree = require('../archive/archive2-unit-tree.js');
const Toc = require('../archive/rpm-middle-toc.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');
const { readWorkspace, loadWorkspace } = require("./helpers/archive2-workspace-source.cjs");

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');
const groupsDoc = JSON.parse(read('data/archive2-subunit-groups.json'));
Tree.setGroups(groupsDoc);
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
  assert.deepEqual(Quick.VIEWS, ['five-minute', 'subunit-test', 'unit-test', 'monthly-test', 'diagnostic']);
  assert.deepEqual(Object.values(Quick.PRODUCTS).map(product => product.count), [4, 12, 20, 24, 24]);
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
  const holdContentBound = record(2, { sourceStatus: 'HOLD', metaBinding: 'text' });
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

// ---- 중단원 / 소단원 scopes from the shared unit tree (2026-11-16) ------------------------------------------------
const realParent = (grade, L2) => Toc.parents(grade).find(parent => parent.L2 === L2);
function realMiddleEntry(rec, parent, extra = {}) {
  return entry(rec, { grade: '중1', subject: middleSubject, subjectLabel: '중1 수학', unitKey: parent.unitKey,
    unitLabel: parent.L1, unitOrder: Unified.unitsForGrade('중1').find(unit => unit.key === parent.unitKey).order, views: ['중1'], originalCurriculum: '2022',
    rpmParent: parent, rpmParentStatus: 'EXACT', ...extra });
}
const treeOptions = (rows, meta = new Map()) => ({ index: indexOf(rows), metaByUid: meta });
const childLabels = section => section.children.filter(node => node.kind === 'child').map(node => node.label);
const pickLabels = (scopes, view) => Quick.pickableGroups(scopes, view).flatMap(group => group.items.map(item => item.node.label));

test('middle 중단원 scopes are the official table of contents of the unit, in order, empty ones included', () => {
  const polygon = realParent('중1', '다각형'), circle = realParent('중1', '원과 부채꼴');
  assert.equal(polygon.unitKey, circle.unitKey);
  const rows = [polygon, circle].flatMap(parent => [1, 2, 3].flatMap(bucket => many(bucket, bucket === 2 ? 6 : 3)
    .map(rec => realMiddleEntry(rec, parent))));
  // The recorded broad sub-unit of these rows must neither split nor merge anything.
  const meta = new Map(rows.map(row => [row.uid, Object.freeze({ subUnitKey: 'M1-05-CORE', subUnit: '평면도형 핵심 개념', rpmL3: 'kept' })]));
  const before = JSON.stringify([rows, [...meta]]);
  const pools = Quick.buildPools(indexOf(rows));
  const scopes = Quick.buildScopes(pools, '중1', middleSubject, treeOptions(rows, meta));
  const section = scopes.sections.find(row => row.unit.unitKey === polygon.unitKey);
  const tocNames = Toc.parents('중1').filter(parent => parent.unitKey === polygon.unitKey).map(parent => parent.L2);
  assert.deepEqual(childLabels(section), tocNames, '중단원 list = official L2 list of the unit, in table-of-contents order');
  const bySource = new Map(rows.map(row => [row.record, row]));
  for (const label of ['다각형', '원과 부채꼴']) {
    const node = section.children.find(child => child.label === label);
    assert.equal(node.total, 12);
    assert.ok(Quick.evaluate([node], Quick.PRODUCTS['subunit-test'], 'standard').ok);
    const parent = label === '다각형' ? polygon : circle;
    for (const bucket of Quick.BUCKETS) for (const rec of node.buckets[bucket])
      assert.equal(bySource.get(rec).rpmParent, parent, 'a scope holds only records of its own 중단원');
  }
  assert.equal(section.unit.total, rows.length);
  // Every unit of the grade is listed (no usable question yet = shown as short, never missing).
  assert.deepEqual(scopes.sections.map(row => row.unit.unitKey), Toc.parents('중1').map(parent => parent.unitKey)
    .filter((key, i, all) => all.indexOf(key) === i));
  // Pickable lists per product.
  assert.deepEqual(pickLabels(scopes, 'subunit-test').filter(label => tocNames.includes(label)), tocNames);
  assert.ok(!pickLabels(scopes, 'subunit-test').includes('평면도형'), '소단원 평가 never offers a whole 대단원');
  assert.deepEqual(pickLabels(scopes, 'unit-test').filter(label => tocNames.includes(label)), tocNames, '중단원 평가 = 중단원 list');
  const fiveMinute = Quick.pickableGroups(scopes, 'five-minute').find(group => group.section.unit.unitKey === polygon.unitKey);
  assert.deepEqual(fiveMinute.items.map(item => item.role), ['root', ...tocNames.map(() => 'child')]);
  assert.equal(JSON.stringify([rows, [...meta]]), before);
});

test('middle: ambiguous or missing parents never become a 중단원; 2015 legacy keys fold into the 중단원 the table maps them to', () => {
  const polygon = realParent('중1', '다각형');
  const mapping = Toc.authority.legacySubUnitMappings.find(row => row.parentKeys?.length === 1 &&
    Toc.parents('중1').some(parent => parent.parentKey === row.parentKeys[0]));
  const target = Toc.parents('중1').find(parent => parent.parentKey === mapping.parentKeys[0]);
  const legacy = realMiddleEntry(record(2), target, { originalCurriculum: '2015', rpmParent: null, rpmParentStatus: 'OUT_OF_SCOPE' });
  const current = realMiddleEntry(record(2), target);
  const unmapped = realMiddleEntry(record(2), target, { originalCurriculum: '2015', rpmParent: null, rpmParentStatus: 'OUT_OF_SCOPE' });
  const broken = [
    realMiddleEntry(record(2), polygon, { rpmParent: null, rpmParentStatus: 'NOT_FOUND' }),
    realMiddleEntry(record(2), polygon, { rpmParentStatus: 'LEGACY_PARENT_AMBIGUOUS' }),
    realMiddleEntry(record(2), polygon, { rpmParent: realParent('중2', '확률') }),
  ];
  const rows = [legacy, current, unmapped, ...broken];
  const meta = new Map(rows.map(row => [row.uid, { subUnitKey: 'M1-05-CORE', subUnit: '평면도형 핵심 개념' }]));
  meta.set(legacy.uid, { subUnitKey: mapping.subUnitKey, subUnit: '이전 이름' });
  const before = JSON.stringify([rows, [...meta]]);
  const pools = Quick.buildPools(indexOf(rows));
  const scopes = Quick.buildScopes(pools, '중1', middleSubject, treeOptions(rows, meta));
  const node = scopes.sections.find(row => row.unit.unitKey === target.unitKey).children.find(child => child.label === target.L2);
  assert.deepEqual(Quick.BUCKETS.flatMap(bucket => node.buckets[bucket]).map(rec => rec.questionUid).sort(),
    [legacy.uid, current.uid].sort(), 'the legacy record folds into its mapped 중단원 next to the current one');
  const labels = scopes.order.map(item => item.label);
  assert.ok(labels.every(label => !/이전 분류|중단원 미지정/.test(label)));
  const section = scopes.sections.find(row => row.unit.unitKey === target.unitKey);
  assert.ok(section.children.some(child => child.kind === 'other'), 'unplaceable records stay in the 대단원 only');
  assert.ok(!pickLabels(scopes, 'subunit-test').some(label => /이전 분류|중단원 미지정|기타/.test(label)));
  const childTotal = section.children.reduce((sum, child) => sum + child.total, 0);
  assert.equal(childTotal, section.unit.total, 'a question sits in exactly one child of its unit');
  assert.equal(JSON.stringify([rows, [...meta]]), before);
});

test('high school 소단원 scopes use the 묶음표: Korean names, no duplicates, only groups that have questions', () => {
  const scopeDoc = groupsDoc.scopes.find(row => row.unitKey === 'H22-C-01');
  const group = scopeDoc.groups.find(row => row.kind === 'subunit' && Tree.isDisplayableName(row.label) && row.keys?.length);
  const other = scopeDoc.groups.find(row => row.kind === 'subunit' && row.groupKey !== group.groupKey && Tree.isDisplayableName(row.label) && row.keys?.length);
  const inGroup = [...many(1, 3), ...many(2, 6), ...many(3, 3)].map(rec => entry(rec));
  const stray = entry(record(2));
  const unrecorded = entry(record(2));
  const meta = new Map(inGroup.map(row => [row.uid, { subUnitKey: group.keys[0].subUnitKey, subUnit: 'polynomial basic' }]));
  meta.set(stray.uid, { subUnitKey: 'NOT-IN-ANY-GROUP', subUnit: 'whatever' });
  const rows = [...inGroup, stray, unrecorded];
  const before = JSON.stringify([rows, [...meta]]);
  const pools = Quick.buildPools(indexOf(rows));
  const scopes = Quick.buildScopes(pools, '고1', 'COMMON_MATH_1', treeOptions(rows, meta));
  const section = scopes.sections.find(row => row.unit.unitKey === 'H22-C-01');
  assert.deepEqual(childLabels(section), [group.label], 'only the group that holds questions is listed, under its 묶음표 name');
  assert.ok(!childLabels(section).includes(other.label));
  const node = section.children.find(child => child.kind === 'child');
  assert.equal(node.total, 12);
  assert.ok(Quick.evaluate([node], Quick.PRODUCTS['subunit-test'], 'standard').ok);
  assert.equal(section.unit.total, 14, 'the stray and unrecorded questions stay in the 단원, not in any 소단원');
  assert.deepEqual(pickLabels(scopes, 'subunit-test').filter(label => !/\d/.test(label)).slice(0, 1), [group.label]);
  assert.deepEqual(Quick.pickableGroups(scopes, 'unit-test').find(row => row.section.unit.unitKey === 'H22-C-01').items.map(item => item.role), ['root'],
    '중단원 평가 of high school is the 단원 itself');
  assert.equal(JSON.stringify([rows, [...meta]]), before);
});

test('high school without the 묶음표 shows 단원 only and says so; the list returns when it loads', () => {
  const rows = [...many(1, 3), ...many(2, 6), ...many(3, 3)].map(rec => entry(rec));
  const meta = new Map(rows.map(row => [row.uid, { subUnitKey: 'x' }]));
  const pools = Quick.buildPools(indexOf(rows));
  Tree.resetGroups();
  try {
    const scopes = Quick.buildScopes(pools, '고1', 'COMMON_MATH_1', treeOptions(rows, meta));
    assert.equal(scopes.groupsMissing, true);
    assert.deepEqual(pickLabels(scopes, 'subunit-test').filter(label => label === '다항식의 연산'), ['다항식의 연산'],
      '소단원 평가 falls back to the 단원 while the 묶음표 is missing');
  } finally { Tree.setGroups(groupsDoc); }
  assert.equal(Quick.buildScopes(pools, '고1', 'COMMON_MATH_1', treeOptions(rows, meta)).groupsMissing, false);
});

test('종합평가 union: a 대단원 chosen whole swallows its own 중단원, siblings stay disjoint', () => {
  const polygon = realParent('중1', '다각형'), circle = realParent('중1', '원과 부채꼴');
  const rows = [polygon, circle].flatMap(parent => many(2, 6).map(rec => realMiddleEntry(rec, parent)));
  const pools = Quick.buildPools(indexOf(rows));
  const scopes = Quick.buildScopes(pools, '중1', middleSubject, treeOptions(rows));
  const section = scopes.sections.find(row => row.unit.unitKey === polygon.unitKey);
  const [a, b] = ['다각형', '원과 부채꼴'].map(label => section.children.find(child => child.label === label));
  assert.deepEqual(Quick.selectNodes(scopes, [a.key, b.key]).map(node => node.key), [a.key, b.key]);
  assert.deepEqual(Quick.selectNodes(scopes, [a.key, section.unit.key]).map(node => node.key), [section.unit.key]);
  assert.equal(Quick.evaluate(Quick.selectNodes(scopes, [a.key, b.key]), Quick.PRODUCTS['monthly-test'], 'standard').counts[2], 12);
  assert.equal(Quick.unitNoun('subunit-test', '중1'), '중단원');
  assert.equal(Quick.unitNoun('subunit-test', '고1'), '소단원');
  assert.equal(Quick.unitNoun('unit-test', '고1'), '단원');
  assert.equal(Quick.shortReason([{ bucket: 2 }, { bucket: 3 }]), '2·3단계 문항 부족');
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
  assert.ok(elapsed < timeBudget(500), `pool build ${elapsed.toFixed(1)}ms`);
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

function harness(data, { quick = true, restore } = {}) {
  const events = new Map(), nodes = new Map(), opened = [], popups = [];
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
    Archive2Core: core, Archive2UnifiedUnits: Unified, Archive2UnitTree: Tree, Archive2QuickPools: quick ? Quick : undefined,
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
    Archive2Source: { ...archiveSource, restore: restore || (async records => records.map(rec => ({ questionUid: rec.questionUid }))) },
  });
  ctx.window = ctx;
  ctx.window.open = () => {
    const popup = { document: { body: {} }, location: { replace: href => opened.push(href) }, close() { popup.closed = true; } };
    popups.push(popup);
    return popup;
  };
  loadWorkspace(ctx, `
    globalThis.workspaceTest = {state, render, renderQuick, quickState, routeUrl, readUrl, openQuickAssessment,
      balancedQuickSelection, diagnosticSelection, diagnosticMirror, setQuickPoolCache: cache => { quickPoolCache = cache; }};
  `);
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
  return { w, ctx, nodes, click, change, published, opened, popups, node };
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

const rowNames = html => [...html.matchAll(/<span class="qk-row-name">([^<]*)<\/span>/g)].map(match => match[1]);
const groupTitles = html => [...html.matchAll(/<h3 class="qk-group-title">([^<]*)</g)].map(match => match[1]);

test('screens: each product lists units under 대단원 headings, no old labels, and a conditions / result layout', async () => {
  const data = await catalog();
  const h = harness(data);
  for (const view of Quick.VIEWS) {
    h.w.state.view = view;
    h.w.quickState.grade = '고1';
    h.w.quickState.subject = 'COMMON_MATH_1';
    const start = performance.now();
    const html = h.w.renderQuick();
    const elapsed = performance.now() - start;
    assert.ok(elapsed < timeBudget(500), `${view} first render ${elapsed.toFixed(1)}ms`);
    assert.match(html, new RegExp(`<h1>${Quick.PRODUCTS[view].title}</h1>`));
    assert.match(html, /data-view="five-minute"/);
    assert.match(html, /data-view="monthly-test"/);
    assert.match(html, /data-action="quick-subject"[^>]*data-subject="COMMON_MATH_2"/);
    assert.match(html, /class="qk-grid"/);
    assert.match(html, /<aside class="qk-result"/, 'the result sits beside the conditions');
    assert.match(html, /class="qk-bar"/, 'phone bar with the one main button');
    assert.doesNotMatch(html, /· 2015|· 2022|\b2015\b개정 ·/);
    assert.match(html, /1단계 \d+ · 2단계 \d+ · 3단계 \d+/);
    assert.ok(groupTitles(html).length >= 1, `${view} has 대단원 headings`);
    for (const name of rowNames(html)) assert.doesNotMatch(name, /이전 분류|핵심\s*개념|[A-Za-z]{2,}/, `${view}: ${name}`);
    const t2 = performance.now();
    h.w.renderQuick();
    assert.ok(performance.now() - t2 < timeBudget(100), 'a second render reads the cached pools');
  }
  h.w.state.view = 'five-minute';
  const html = h.w.renderQuick();
  assert.match(html, /data-action="quick-pick"/);
  assert.match(html, /이 난이도로 만들 수 있는 단원 \d+개/);
  assert.match(html, /<span class="qk-row-name">[^<]+ 전체<\/span>/, '5분 테스트 can take a whole 대단원');
  h.w.state.view = 'unit-test';
  h.w.quickState.subject = 'COMMON_MATH_1';
  assert.match(h.w.renderQuick(), /data-action="quick-pick"/);
  h.w.state.view = 'monthly-test';
  const monthly = h.w.renderQuick();
  assert.match(monthly, /data-quick-bundle=/);
  assert.match(monthly, /data-action="quick-open-all"/);
  assert.match(monthly, /data-action="quick-open-selected"/);
  // grade not chosen yet -> prompt only
  h.w.quickState.grade = '';
  assert.match(h.w.renderQuick(), /학년을 선택하세요/);
});

test('screens: 중단원 평가 lists every official 중단원 of the grade under its 대단원, in order, with no 이전 분류', async () => {
  const data = await catalog();
  const h = harness(data);
  h.w.state.view = 'unit-test';
  h.w.quickState.shortOpen = true; // the 모자란 줄 are folded by default; open them to see the whole table of contents
  for (const grade of ['중1', '중2', '중3']) {
    h.w.quickState.grade = grade;
    h.w.quickState.subject = 'MIDDLE';
    const html = h.w.renderQuick();
    assert.doesNotMatch(html, /이전 분류|중단원 미지정/);
    const shown = rowNames(html);
    for (const name of shown) assert.doesNotMatch(name, /[A-Za-z]{2,}|핵심\s*개념/, `${grade}: ${name}`);
    // each 대단원 heading holds its 중단원 rows in the official order (a row can sit in the ready or in the folded part)
    const wanted = Toc.parents(grade).map(parent => parent.L2);
    const seen = wanted.filter(name => shown.includes(name));
    assert.deepEqual(seen, wanted, `${grade}: every 중단원 of the table of contents is on screen`);
  }
  h.w.quickState.grade = '중1';
  h.w.state.view = 'subunit-test';
  const first = h.w.renderQuick();
  assert.match(first, /평면도형/);
  assert.match(first, /<span class="qk-row-name">다각형<\/span>|<span class="qk-row-name">원과 부채꼴<\/span>/);
  assert.doesNotMatch(first, /이전 분류/);
  // 모자란 중단원이 실제 자료에 있는지는 자료와 문항별 중단원 지정표에 따라 달라진다(지정표 뒤 중1은 모든 중단원이 충분하다).
  // 모자란 줄이 있으면 접힌 한 줄이어야 하고, 없으면 접는 줄도 모자란 줄도 없어야 한다.
  // 접는 동작 자체는 아래 shortUnitCatalog 시험이 고정 자료로 본다.
  for (const grade of ['중1', '중2', '중3']) {
    h.w.quickState.grade = grade;
    h.w.quickState.shortOpen = true;
    const hasShort = /class="qk-row is-short"/.test(h.w.renderQuick());
    h.w.quickState.shortOpen = false;
    const folded = h.w.renderQuick();
    if (hasShort) assert.match(folded, /class="qk-short-toggle"[^>]*aria-expanded="false">문항이 모자란 중단원 \d+개</, `${grade}: short rows are one folded line`);
    else assert.doesNotMatch(folded, /class="qk-short-toggle"/, `${grade}: 모자란 줄이 없으면 접는 줄도 없다`);
    assert.doesNotMatch(folded, /class="qk-row is-short"/);
    assert.doesNotMatch(folded, /필요 · \d+문항 가능/, 'no long shortage sentence in the list');
  }
});

test('screens: a short row is folded behind one line and opens to a short reason', async () => {
  const data = shortUnitCatalog();
  const h = harness(data);
  h.w.state.view = 'unit-test';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  const html = h.w.renderQuick();
  assert.match(html, /class="qk-short-toggle"[^>]*aria-expanded="false">문항이 모자란 단원 \d+개</);
  assert.doesNotMatch(html, /class="qk-row is-short"/, 'folded by default');
  await h.click({ action: 'quick-short-toggle' });
  assert.equal(h.w.quickState.shortOpen, true);
  const open = h.w.renderQuick();
  assert.match(open, /class="qk-row is-short" aria-disabled="true"/);
  assert.match(open, /<em class="qk-reason">\d(·\d)*단계 문항 부족<\/em>/);
});

test('real catalog: every list on every screen is free of old labels, duplicates and wrong membership', async () => {
  const data = await catalog();
  const index = Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  const meta = require('../archive/problem-bank-meta.js').buildIndex(data.records, []);
  const metaByUid = new Map(meta.map(row => [row.questionUid || row.uid, row]));
  const pools = Quick.buildPools(index, { metaByUid });
  let nodes = 0;
  for (const grade of Unified.GRADES) for (const subject of Quick.subjectsFor(pools, grade)) {
    const scopes = Quick.buildScopes(pools, grade, subject.value, { index, metaByUid });
    assert.equal(scopes.groupsMissing, false, `${grade} ${subject.label}: 묶음표 loaded`);
    if (scopes.middle) {
      // the official table of contents, complete and in order, also for units with no usable question
      const wanted = Toc.parents(grade).map(parent => [parent.unitKey, parent.L2]);
      const got = scopes.sections.flatMap(section => section.children.filter(node => node.kind === 'child').map(node => [section.unit.unitKey, node.label]));
      assert.deepEqual(got, wanted, `${grade}: 중단원 list = official table of contents`);
    }
    for (const view of Quick.VIEWS) {
      const names = new Map();
      for (const group of Quick.pickableGroups(scopes, view)) {
        const seen = new Set();
        for (const { node, role } of group.items) {
          nodes++;
          assert.doesNotMatch(node.label, /이전 분류|핵심\s*개념|중단원 미지정/, `${grade} ${view}: ${node.label}`);
          assert.ok(role === 'root' || !/[A-Za-z]{2,}/.test(node.label), `${grade} ${view}: English name ${node.label}`);
          if (role === 'child') {
            assert.ok(!seen.has(node.label), `${grade} ${view} ${group.section.label}: duplicate ${node.label}`);
            seen.add(node.label);
          }
          names.set(node.key, node);
          // membership: every question of a scope belongs to the 대단원 the scope sits under
          for (const bucket of Quick.BUCKETS) for (const rec of node.buckets[bucket]) {
            const owner = index.byUid.get(rec.questionUid);
            if (group.unclassified) assert.equal(owner.unclassified, true);
            else assert.equal(owner.unitKey, group.section.unit.unitKey, `${grade} ${view} ${node.label}: wrong unit`);
          }
        }
      }
    }
    // a question sits in exactly one child of its unit: the children never overlap and never exceed the unit
    for (const section of scopes.sections) {
      const sum = section.children.reduce((total, child) => total + child.total, 0);
      assert.ok(!section.children.length || sum === section.unit.total, `${grade} ${section.label}: children ${sum} vs unit ${section.unit.total}`);
    }
  }
  assert.ok(nodes > 500, `checked ${nodes} scopes`);
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
  assert.match(html, /<button type="button" class="qk-row[^"]*" data-action="quick-pick"/);
  const key = html.match(/data-action="quick-pick" data-unit-key="([^"]+)"/)[1];
  await h.click({ action: 'quick-pick', unitKey: key });
  assert.equal(h.w.quickState.pick, key, 'a click only picks; nothing opens yet');
  assert.equal(h.published.length, 0);
  assert.match(h.w.renderQuick(), /data-action="quick-open-pick"/);
  await h.click({ action: 'quick-open-pick' });
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
  assert.match(html, /class="qk-short-toggle"/, 'the short unit is folded behind one line');
  h.w.quickState.shortOpen = true;
  const opened = h.w.renderQuick();
  assert.match(opened, /class="qk-row is-short" aria-disabled="true"/);
  assert.match(opened, /class="qk-reason">/);
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
  assert.equal((markup.match(/빠른 평가/g) || []).length, 1, 'one PC menu entry (the phone cell is the short 빠른평가)');
  assert.match(readWorkspace(), /class="phone-quick-link" data-view="five-minute"/, '만들기 screen links to 빠른 평가');
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
  const source = readWorkspace();
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

// ---- 진단평가 (2026-11-19): 24 questions from original past exams, 3 presets, printed from the lowest step up ------------------
// A restored question that has an answer and a solution; blank(uid) makes one of them empty.
const okRestore = (blank = () => false) => async records => records.map(rec => ({
  questionUid: rec.questionUid, answer: blank(rec) ? '' : '①', solution: blank(rec) ? '' : '풀이',
}));
function diagnosticCatalog(counts, extra = () => ({})) {
  const records = [1, 2, 3, 4, 5].flatMap(step => many(step, counts[step - 1] || 0)).map((rec, i) => ({
    ...rec, sourceGrade: '고1', effectiveBrowseGrade: '고1', subject: '공통수학1', standardCourse: '공통수학1',
    sourceFile: 'original/high/h1/1mid/diag-' + (i % 5) + '.js', examAxis: '1-mid', year: 2026 - (i % 3), ...extra(rec, i),
  }));
  return { indexVersion: 'quick-diagnostic-fixture-' + counts.join('-'), records };
}
const stepsOf = (uids, byUid) => Array.from(uids, id => byUid.get(id).difficultyBucket);
const countBy = (values, list) => list.map(value => values.filter(item => item === value).length);

test('diagnostic product: three presets of 24, 기본 is the default, the 4~5단계 slot is named', () => {
  const product = Quick.PRODUCTS.diagnostic;
  assert.equal(product.count, 24);
  assert.deepEqual(product.order, ['basic', 'standard', 'advanced']);
  assert.deepEqual(product.presets.basic, [[1, 5], [2, 5], [3, 10], [4, 4]]);
  assert.deepEqual(product.presets.standard, [[1, 3], [2, 5], [3, 10], [4, 6]]);
  assert.deepEqual(product.presets.advanced, [[1, 2], [2, 4], [3, 10], [4, 8]]);
  for (const preset of Object.values(product.presets)) assert.equal(preset.reduce((sum, [, count]) => sum + count, 0), 24);
  assert.equal(product.combine, true);
  assert.equal(product.originalOnly, true);
  assert.equal(Quick.presetMix(product, 'standard'), '1단계 3문항 · 2단계 5문항 · 3단계 10문항 · 4~5단계 6문항');
  assert.equal(harness(diagnosticCatalog([1, 1, 1, 1, 1])).w.quickState.presets.diagnostic, 'standard');
});

test('diagnostic pools: original exams only, 5단계 folded into the 4~5단계 slot, one semester on request; the other products keep their pools', () => {
  const mk = (bucket, sourceFile, examAxis) => entry(record(bucket, { sourceFile, examAxis }));
  const rows = [mk(4, 'original/high/h1/1mid/a.js', '1-mid'), mk(5, 'original/high/h1/1final/b.js', '1-final'), mk(2, 'original/high/h1/2mid/c.js', '2-mid'),
    mk(2, 'similar/high/h1/d.js', '1-mid'), mk(3, 'textbooks/x/e.js', 'other'), mk(1, 'types/high/f.js', 'other')];
  const index = indexOf(rows);
  const common = Quick.buildPools(index), diagnostic = Quick.buildPools(index, { product: Quick.PRODUCTS.diagnostic });
  const only = (pools) => pools.units['고1'].COMMON_MATH_1.flatMap(unit => Quick.BUCKETS.flatMap(bucket => unit.buckets[bucket]));
  assert.equal(only(common).length, 5, 'common pools: 5단계 stays out, similar / textbook / type sources stay in');
  assert.ok(only(common).every(rec => rec.difficultyBucket <= 4));
  const picked = only(diagnostic);
  assert.deepEqual(picked.map(rec => rec.sourceFile.split('/')[0]).sort(), ['original', 'original', 'original']);
  assert.deepEqual(picked.map(rec => rec.difficultyBucket).sort(), [2, 4, 5]);
  const unit = diagnostic.units['고1'].COMMON_MATH_1[0];
  assert.deepEqual(unit.counts, { 1: 0, 2: 1, 3: 0, 4: 2 }, '4단계 and 5단계 share one slot');
  const first = Quick.buildPools(index, { product: Quick.PRODUCTS.diagnostic, semester: '1' });
  // 2026-11-20: the semester button is the semester's subject / unit scope, not the exam's semester. 고1 units are not cut by the exam semester.
  assert.deepEqual(only(first).map(rec => rec.examAxis).sort(), ['1-final', '1-mid', '2-mid']);
  assert.equal(Quick.stillUsable(rows[1].record, Quick.PRODUCTS.diagnostic), true);
  assert.equal(Quick.stillUsable(rows[1].record, Quick.PRODUCTS['monthly-test']), false, 'a 5단계 question is still not usable elsewhere');
  // 2026-11-20: a 유형 / 유사 question is usable only as the reserve of a short step (unit.fillBuckets), never in unit.buckets
  assert.equal(Quick.stillUsable(rows[3].record, Quick.PRODUCTS.diagnostic), true, 'a similar-source question may fill a short step of 진단평가');
  assert.equal(Quick.stillUsable(rows[5].record, Quick.PRODUCTS.diagnostic), true, 'a type-source question may fill a short step of 진단평가');
  assert.equal(Quick.stillUsable(rows[4].record, Quick.PRODUCTS.diagnostic), false, 'a textbook question is never used in 진단평가');
  assert.equal(Quick.stillUsable(rows[3].record, Quick.PRODUCTS['monthly-test']), true, 'the other products keep their own rule');
  const reserve = diagnostic.units['고1'].COMMON_MATH_1[0];
  assert.deepEqual(reserve.fillCounts, { 1: 1, 2: 1, 3: 0, 4: 0 }, 'the reserve holds the 유형 (1단계) and 유사 (2단계) questions apart from the originals');
});

test('diagnostic selection: exact steps, every unit above its minimum, units take turns, a repeated type only costs a penalty', () => {
  const h = harness(diagnosticCatalog([1, 1, 1, 1, 1]));
  const node = (key, order, perStep, extra = () => ({})) => {
    const buckets = { 1: [], 2: [], 3: [], 4: [] };
    for (const [step, count] of Object.entries(perStep)) for (let i = 0; i < count; i++) buckets[step].push({ ...record(Number(step)), year: 2026, ...extra(Number(step), i) });
    return { key, order, label: key, grade: '고1', buckets };
  };
  const units = [node('u1', 1, { 1: 6, 2: 6, 3: 12, 4: 6 }), node('u2', 2, { 1: 6, 2: 6, 3: 12, 4: 6 }), node('u3', 3, { 1: 0, 2: 2, 3: 12, 4: 0 }),
    node('u4', 4, { 1: 6, 2: 6, 3: 3, 4: 6 }), node('u5', 5, { 1: 6, 2: 6, 3: 12, 4: 6 }), node('u6', 6, { 1: 2, 2: 2, 3: 2, 4: 2 })];
  for (const preset of Object.values(Quick.PRODUCTS.diagnostic.presets)) {
    const { selected, unitMinimum } = h.w.diagnosticSelection(units, preset, 24);
    assert.equal(unitMinimum, 3, 'min(floor(24 / 6 units), 3)');
    assert.equal(selected.length, 24);
    assert.equal(new Set(selected.map(rec => rec.questionUid)).size, 24);
    assert.deepEqual(countBy(Array.from(selected, rec => rec.difficultyBucket), [1, 2, 3, 4]), preset.map(([, count]) => count));
    for (const unit of units) {
      const mine = Array.from(Object.values(unit.buckets).flat(), rec => rec.questionUid), have = selected.filter(rec => mine.includes(rec.questionUid)).length;
      assert.ok(have >= Math.min(3, mine.length), unit.key + ' has ' + have);
    }
  }
  // a unit that has no question of a step is skipped for that step, not filled from another step
  const one = h.w.diagnosticSelection(units, Quick.PRODUCTS.diagnostic.presets.standard, 24).selected;
  assert.ok(!one.some(rec => units[2].buckets[1].includes(rec)));
  // type: a unit with two types in a step shows both before repeating one (soft preference)
  const typed = [node('t1', 1, { 3: 10 }, (step, i) => ({ problemTypeKey: i < 5 ? 'PT_A' : 'PT_B' })), node('t2', 2, { 1: 10, 2: 10, 4: 10 })];
  const mixed = h.w.diagnosticSelection(typed, [[3, 4]], 4).selected;
  assert.deepEqual(Array.from(mixed, rec => rec.problemTypeKey).sort(), ['PT_A', 'PT_A', 'PT_B', 'PT_B']);
  // untyped questions stay in the pool
  const untyped = [node('x1', 1, { 3: 5 })];
  assert.equal(h.w.diagnosticSelection(untyped, [[3, 5]], 5).selected.length, 5);
});

test('diagnostic: a short 4~5단계 is announced with its numbers, 기초 still prints, nothing is filled from another step', async () => {
  const data = diagnosticCatalog([8, 8, 14, 4, 0]);
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  const h = harness(data, { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  const html = h.w.renderQuick();
  assert.match(html, /<h1>진단평가<\/h1>/);
  assert.match(html, /id="five-minute-level"/, 'the three presets use the shared difficulty slider');
  assert.match(html, /4~5단계 6문항 필요 · 4문항 가능/);
  assert.match(html, /class="qk-bar"[\s\S]*qk-bar-main" disabled/);
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 0, '기본 needs 6 in the 4~5단계 slot and the pool has 4');
  h.w.quickState.presets.diagnostic = 'basic';
  assert.doesNotMatch(h.w.renderQuick(), /필요 · \d+문항 가능/);
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 1);
  const { questionUids, meta } = h.published[0];
  assert.match(meta.title, /^진단평가 · 공통수학1 1학기 전체$/);
  const steps = stepsOf(questionUids, byUid);
  assert.deepEqual(steps, [...steps].sort((a, b) => a - b), 'printed from the lowest step up');
  assert.deepEqual(countBy(steps, [1, 2, 3, 4]), [5, 5, 10, 4]);
});

test('diagnostic: another semester, a similar source and a 5단계 question are handled by the pool, 5단계 fills the top slot', async () => {
  const data = diagnosticCatalog([6, 6, 12, 3, 5], (rec, i) => (i % 7 === 0 ? { examAxis: '2-mid' } : i % 11 === 0 ? { sourceFile: 'similar/high/h1/1mid/s.js' } : {}));
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  const h = harness(data, { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  h.w.quickState.presets.diagnostic = 'advanced';
  await h.w.openQuickAssessment('all');
  const ids = h.published.length ? h.published[0].questionUids : [];
  for (const id of ids) {
    assert.ok(['1-mid', '2-mid'].includes(byUid.get(id).examAxis), 'a 고1 paper is not cut by the exam semester (the subject decides)');
    assert.ok(byUid.get(id).sourceFile.startsWith('original/'), 'only original exams');
  }
  if (h.published.length) {
    const steps = stepsOf(ids, byUid);
    assert.deepEqual(steps, [...steps].sort((a, b) => a - b));
    assert.equal(steps.filter(step => step >= 4).length, 8);
  } else assert.match(h.w.renderQuick(), /필요 · \d+문항 가능/);
});

test('diagnostic: a restored question without answer or solution is replaced inside the same step, never from another step', async () => {
  const data = diagnosticCatalog([8, 8, 20, 10, 0]);
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  // the newest-year questions of steps 1 and 3 come back empty; recency picks them first, so replacements are needed
  const empty = new Set(data.records.filter(rec => (rec.difficultyBucket === 1 || rec.difficultyBucket === 3) && rec.year === 2026).map(rec => rec.questionUid));
  const h = harness(data, { restore: okRestore(rec => empty.has(rec.questionUid)) });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 1);
  const { questionUids } = h.published[0];
  assert.equal(new Set(questionUids).size, 24);
  assert.ok(questionUids.every(id => !empty.has(id)), 'no empty question is printed');
  const steps = stepsOf(questionUids, byUid);
  assert.deepEqual(steps, [...steps].sort((a, b) => a - b));
  assert.deepEqual(countBy(steps, [1, 2, 3, 4]), [3, 5, 10, 6], 'the step counts of 기본 are kept');
  assert.match(h.nodes.get('status').textContent, /정답·해설이 없는 \d+문항은 같은 단계의 다른 문항으로 바꿨습니다/);
});

test('diagnostic: when a step has no question with answer and solution left the paper is refused, nothing is published', async () => {
  const data = diagnosticCatalog([3, 8, 14, 6, 0]);
  const stepOne = new Set(data.records.filter(rec => rec.difficultyBucket === 1).map(rec => rec.questionUid));
  const h = harness(data, { restore: okRestore(rec => stepOne.has(rec.questionUid)) });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 0);
  assert.match(h.nodes.get('status').textContent, /정답·해설이 있는 문항이 모자라/);
});

test('diagnostic: replacing empty questions stops after a small number of source requests and ends in the "모자람" message', async () => {
  // every question of step 1 and 3 comes back empty while hundreds of candidates exist: the old loop restored them all one by one
  const data = diagnosticCatalog([200, 200, 200, 200, 0]);
  const blank = new Set(data.records.filter(rec => rec.difficultyBucket === 1 || rec.difficultyBucket === 3).map(rec => rec.questionUid));
  const inner = okRestore(rec => blank.has(rec.questionUid));
  let calls = 0;
  const h = harness(data, { restore: async records => { calls += records.length; return inner(records); } });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 0, 'nothing is published when the cap is reached');
  assert.match(h.nodes.get('status').textContent, /정답·해설이 있는 문항이 모자라[\s\S]*학기를 1·2학기로 바꾸거나 난이도를 바꿔 보세요/);
  // the paper restore itself is 24 questions; the replacement tries on top of it stay small (cap 40 in total)
  assert.ok(calls <= 24 + 40, 'source requests stay capped: ' + calls);
});

test('diagnostic: the bottom bar of a semester paper says the semester, not the whole subject', () => {
  const data = diagnosticCatalog([8, 8, 14, 10, 0]);
  const h = harness(data, { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  assert.match(h.w.renderQuick(), /class="qk-bar-count">24문항 · 공통수학1 1학기 전체</);
});

// ---- 진단평가 2차 (2026-11-20): a short step is filled with 유형 / 유사 questions; A·B형 two papers ------------------------------
// A pool node with original questions (buckets) and the 유형 / 유사 reserve (fillBuckets): { step: count }.
const cellNode = (key, order, perStep, fillStep = {}) => {
  const buckets = { 1: [], 2: [], 3: [], 4: [] }, fillBuckets = { 1: [], 2: [], 3: [], 4: [] };
  for (const [step, count] of Object.entries(perStep)) for (let i = 0; i < count; i++)
    buckets[step].push({ ...record(Number(step)), year: 2026 - (i % 3), sourceFile: 'original/high/h1/1mid/o-' + key + '-' + (i % 4) + '.js' });
  for (const [step, count] of Object.entries(fillStep)) for (let i = 0; i < count; i++)
    fillBuckets[step].push({ ...record(Number(step)), year: 2026 - (i % 3), sourceFile: 'types/high/h1/t-' + key + '-' + (i % 4) + '.js' });
  return { key, order, label: key, grade: '고1', buckets, fillBuckets };
};
const cellKeyOf = (units, rec) => {
  for (let u = 0; u < units.length; u++) for (const step of [1, 2, 3, 4])
    if (units[u].buckets[step].includes(rec) || units[u].fillBuckets[step].includes(rec)) return u + '|' + step;
  return '';
};
const cellCounts = (units, list) => {
  const map = {};
  for (const rec of list) map[cellKeyOf(units, rec)] = (map[cellKeyOf(units, rec)] || 0) + 1;
  return map;
};
const isFilled = rec => /^(types|similar)\//.test(rec.sourceFile);

test('diagnostic fill: only the missing number of a short step comes from 유형 / 유사, originals first, one fill per unit before a second', () => {
  const h = harness(diagnosticCatalog([1, 1, 1, 1, 1]));
  const units = [cellNode('u1', 1, { 1: 6, 2: 6, 3: 12, 4: 2 }, { 4: 5 }), cellNode('u2', 2, { 1: 6, 2: 6, 3: 12, 4: 2 }, { 4: 5 })];
  const standard = Quick.PRODUCTS.diagnostic.presets.standard;
  const plan = h.w.diagnosticSelection(units, standard, 24);
  assert.equal(plan.selected.length, 24);
  assert.equal(new Set(plan.selected.map(rec => rec.questionUid)).size, 24);
  assert.deepEqual(countBy(Array.from(plan.selected, rec => rec.difficultyBucket), [1, 2, 3, 4]), [3, 5, 10, 6]);
  const top = plan.selected.filter(rec => rec.difficultyBucket === 4);
  assert.equal(top.filter(isFilled).length, 2, 'exactly the missing number is filled');
  for (const unit of units) for (const rec of unit.buckets[4]) assert.ok(top.includes(rec), 'every original of the short step is on the paper');
  assert.deepEqual(Array.from(top.filter(isFilled), rec => cellKeyOf(units, rec)).sort(), ['0|4', '1|4'], 'the units take turns for the fill');
  assert.equal(plan.selected.filter(rec => rec.difficultyBucket < 4).some(isFilled), false, 'a step that has enough originals takes no fill');
  assert.deepEqual(JSON.parse(JSON.stringify(plan.fills)), [{ bucket: 4, count: 2 }]);
  // nothing is short: no fill at all
  const full = h.w.diagnosticSelection([cellNode('f1', 1, { 1: 6, 2: 6, 3: 12, 4: 8 }, { 1: 9, 2: 9, 3: 9, 4: 9 })], standard, 24);
  assert.equal(full.selected.some(isFilled), false);
  assert.equal(full.fills.length, 0);
  // the printed order is still the lowest step first
  const ordered = Quick.orderByStep(units, plan.selected);
  const steps = Array.from(ordered, rec => rec.difficultyBucket);
  assert.deepEqual(steps, [...steps].sort((a, b) => a - b));
  assert.equal(ordered.length, 24);
});

test('diagnostic fill: a reserve question of a family already on the paper is skipped while another one is left, then allowed', () => {
  const h = harness(diagnosticCatalog([1, 1, 1, 1, 1]));
  const unit = cellNode('f', 1, { 4: 2 }, { 4: 4 });
  const family = new Map();
  [...unit.buckets[4], ...unit.fillBuckets[4]].forEach((rec, i) => family.set(rec.questionUid, ['A', 'B', 'A', 'B', 'C', 'D'][i]));
  const familyOf = rec => family.get(rec.questionUid) || '';
  const picked = h.w.diagnosticSelection([unit], [[4, 4]], 4, { familyOf }).selected;
  assert.equal(picked.length, 4);
  assert.deepEqual(Array.from(picked, familyOf).sort(), ['A', 'B', 'C', 'D'], 'the originals are kept, the fill takes the two other families');
  // only the same families are left: the paper is still completed
  const narrow = cellNode('g', 1, { 4: 2 }, { 4: 2 });
  const same = new Map();
  [...narrow.buckets[4], ...narrow.fillBuckets[4]].forEach((rec, i) => same.set(rec.questionUid, ['A', 'B', 'A', 'B'][i]));
  assert.equal(h.w.diagnosticSelection([narrow], [[4, 4]], 4, { familyOf: rec => same.get(rec.questionUid) }).selected.length, 4);
});

test('diagnostic A·B: the same unit x step cell counts, none of the A questions, a cell without other questions overlaps and is counted', () => {
  const h = harness(diagnosticCatalog([1, 1, 1, 1, 1]));
  const standard = Quick.PRODUCTS.diagnostic.presets.standard;
  // enough questions everywhere
  const rich = [cellNode('r1', 1, { 1: 10, 2: 10, 3: 20, 4: 10 }), cellNode('r2', 2, { 1: 10, 2: 10, 3: 20, 4: 10 }), cellNode('r3', 3, { 1: 10, 2: 10, 3: 20, 4: 10 })];
  const planA = h.w.diagnosticSelection(rich, standard, 24), planB = h.w.diagnosticMirror(rich, planA);
  assert.equal(planB.selected.length, 24);
  assert.deepEqual(cellCounts(rich, planB.selected), cellCounts(rich, planA.selected));
  assert.equal(planB.overlap, 0);
  assert.equal(planB.selected.some(rec => planA.selected.includes(rec)), false);
  assert.equal(new Set(planB.selected.map(rec => rec.questionUid)).size, 24);
  // the originals of a short step are all on A: B fills the same cells from the reserve, still no common question
  const shortUnits = [cellNode('s1', 1, { 1: 6, 2: 6, 3: 12, 4: 2 }, { 4: 6 }), cellNode('s2', 2, { 1: 6, 2: 6, 3: 12, 4: 2 }, { 4: 6 })];
  const shortA = h.w.diagnosticSelection(shortUnits, standard, 24), shortB = h.w.diagnosticMirror(shortUnits, shortA);
  assert.deepEqual(cellCounts(shortUnits, shortB.selected), cellCounts(shortUnits, shortA.selected));
  assert.equal(shortB.overlap, 0);
  assert.equal(shortB.selected.filter(isFilled).length, 6, 'B has no unused original left in the short step: its 4~5단계 is filled');
  assert.equal(shortB.selected.some(rec => shortA.selected.includes(rec)), false);
  // pair mode: a small cell gives at most half of its questions to A, so B finds other ones there
  const small = [cellNode('p1', 1, { 1: 2, 2: 2, 3: 2, 4: 2 }), cellNode('p2', 2, { 1: 20, 2: 20, 3: 20, 4: 20 })];
  const smallPreset = [[1, 3], [2, 3], [3, 3], [4, 3]];
  const smallA = h.w.diagnosticSelection(small, smallPreset, 12, { pair: true }), smallB = h.w.diagnosticMirror(small, smallA);
  assert.deepEqual(cellCounts(small, smallB.selected), cellCounts(small, smallA.selected));
  assert.equal(smallB.overlap, 0);
  // a cell with nothing else to give overlaps, and only that cell
  const tight = [cellNode('t1', 1, { 1: 6, 2: 6, 3: 12, 4: 2 }, { 4: 1 }), cellNode('t2', 2, { 1: 6, 2: 6, 3: 12, 4: 2 }, { 4: 1 })];
  const tightA = h.w.diagnosticSelection(tight, standard, 24), tightB = h.w.diagnosticMirror(tight, tightA);
  assert.deepEqual(cellCounts(tight, tightB.selected), cellCounts(tight, tightA.selected));
  assert.equal(tightB.overlap, 6, 'the 4~5단계 cell of each unit (2 originals + 1 fill) has no other question');
  assert.equal(tightB.selected.filter(rec => tightA.selected.includes(rec)).length, 6);
  assert.equal(tightB.selected.filter(rec => tightA.selected.includes(rec) && rec.difficultyBucket < 4).length, 0, 'the other steps have no overlap');
});

// A diagnostic catalog of 고1 공통수학1 (one unclassified unit) with original questions and 유형 questions of the 4~5단계.
function fillCatalog(originals, typeCount, typeStep = 4) {
  const data = diagnosticCatalog(originals);
  const types = Array.from({ length: typeCount }, (_, i) => ({
    ...record(typeStep), sourceGrade: '고1', effectiveBrowseGrade: '고1', subject: '공통수학1', standardCourse: '공통수학1',
    sourceFile: 'types/high/h1/fill-' + (i % 3) + '.js', examAxis: 'other', year: 2026 - (i % 3),
  }));
  return { ...data, records: [...data.records, ...types], indexVersion: data.indexVersion + '-fill' + typeCount };
}

test('diagnostic: 기본 with only 4 originals in the 4~5단계 is filled with 유형 questions; the screen says so, the status says how many', async () => {
  const data = fillCatalog([8, 8, 14, 4, 0], 5);
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  const h = harness(data, { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  const html = h.w.renderQuick();
  assert.match(html, /4~5단계 2문항은 원본 기출이 모자라 유형·유사 문항으로 채웁니다\./);
  assert.doesNotMatch(html, /필요 · \d+문항 가능/, 'no shortage message while the reserve covers it');
  assert.doesNotMatch(html, /class="qk-bar-main" disabled/);
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 1);
  const rows = Array.from(h.published[0].questionUids, id => byUid.get(id));
  assert.equal(rows.length, 24);
  assert.deepEqual(countBy(rows.map(rec => Math.min(rec.difficultyBucket, 4)), [1, 2, 3, 4]), [3, 5, 10, 6]);
  assert.equal(rows.filter(rec => rec.sourceFile.startsWith('types/')).length, 2);
  assert.equal(rows.filter(rec => rec.sourceFile.startsWith('original/')).length, 22);
  const steps = rows.map(rec => rec.difficultyBucket);
  assert.deepEqual(steps, [...steps].sort((a, b) => a - b), 'printed from the lowest step up');
  assert.match(h.nodes.get('status').textContent, /원본 기출이 모자란 단계는 유형 2문항으로 채웠습니다/);
  // a reserve that cannot cover the gap keeps the shortage message with the numbers that include the reserve
  const thin = fillCatalog([8, 8, 14, 4, 0], 1);
  const g = harness(thin, { restore: okRestore() });
  g.w.state.view = 'diagnostic';
  g.w.quickState.grade = '고1';
  g.w.quickState.subject = 'COMMON_MATH_1';
  assert.match(g.w.renderQuick(), /4~5단계 6문항 필요 · 5문항 가능/);
  await g.w.openQuickAssessment('all');
  assert.equal(g.published.length, 0);
  assert.equal(g.opened.length, 0);
});

test('diagnostic A·B: one check box opens two papers (A형 / B형) with the same step counts and no common question; a blocked second window leaves a "B형 열기" button', async () => {
  const data = fillCatalog([20, 20, 40, 4, 0], 12);
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  const h = harness(data, { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  const off = h.w.renderQuick();
  assert.match(off, /id="quick-two-forms"[^>]*data-quick-two-forms/);
  assert.doesNotMatch(off, /id="quick-two-forms"[^>]*checked/);
  assert.match(off, /id="quick-two-forms-bar"/, 'the bottom bar (the only open button on a phone) carries the same choice');
  await h.change({ id: 'quick-two-forms', checked: true, dataset: { quickTwoForms: '' } });
  assert.equal(h.w.quickState.twoForms, true);
  assert.match(h.w.renderQuick(), /id="quick-two-forms"[^>]*checked/);
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 2);
  const [a, b] = h.published;
  assert.match(a.meta.title, /진단평가 · 공통수학1 1학기 전체 · A형$/);
  assert.match(b.meta.title, /진단평가 · 공통수학1 1학기 전체 · B형$/);
  assert.equal(h.opened.length, 2);
  const stepsA = a.questionUids.map(id => byUid.get(id).difficultyBucket), stepsB = b.questionUids.map(id => byUid.get(id).difficultyBucket);
  assert.deepEqual(countBy(stepsA.map(step => Math.min(step, 4)), [1, 2, 3, 4]), countBy(stepsB.map(step => Math.min(step, 4)), [1, 2, 3, 4]));
  assert.deepEqual(Array.from(stepsB), [...stepsB].sort((x, y) => x - y));
  assert.equal(a.questionUids.filter(id => b.questionUids.includes(id)).length, 0);
  assert.match(h.nodes.get('status').textContent, /A·B형 두 벌\(각 24문항\)을 열었습니다\./);
  assert.match(h.nodes.get('status').textContent, /A·B형에 겹치는 문항은 없습니다/);
  // the second window is blocked: B is prepared anyway and one click opens it
  let calls = 0, later = [];
  h.ctx.window.open = (url) => {
    calls++;
    if (calls === 2) return null;
    const popup = { document: { body: {} }, location: { replace: href => later.push(href) }, close() {} };
    return popup;
  };
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 4, 'B is still published');
  assert.ok(h.w.quickState.formB?.url);
  assert.match(h.w.renderQuick(), /data-action="quick-open-b"/);
  assert.match(h.nodes.get('status').textContent, /B형은 아래 "B형 열기" 단추로 여세요/);
  let opened = '';
  h.ctx.window.open = (url) => { opened = url; return {}; };
  await h.click({ action: 'quick-open-b' });
  assert.ok(opened.includes('mixed_engine.html'));
  assert.equal(h.w.quickState.formB, null);
  // a second paper is a diagnostic-only choice
  h.w.state.view = 'monthly-test';
  assert.doesNotMatch(h.w.renderQuick(), /quick-two-forms/);
});

test('diagnostic 결과표 열기: the paper just made gets a new-tab link to diagnostic-report.html?uids= in paper order (A and B each); nothing before a paper exists or in other products', async () => {
  const data = fillCatalog([20, 20, 40, 4, 0], 12);
  const h = harness(data, { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  assert.doesNotMatch(h.w.renderQuick(), /diagnostic-report\.html/, 'no link before a paper is made');
  await h.w.openQuickAssessment('all');
  const [a] = h.published;
  const reportLinks = markup => [...markup.matchAll(/<a class="qk-report-link" href="([^"]*)" target="_blank" rel="noopener"[^>]*>([^<]*)<\/a>/g)];
  let links = reportLinks(h.w.renderQuick());
  assert.equal(links.length, 1);
  assert.equal(links[0][2], '결과표 열기');
  const url = new URL(links[0][1], 'https://archive.test/archive/workspace.html');
  assert.equal(url.pathname, '/archive/assessment/diagnostic-report.html');
  assert.deepEqual(url.searchParams.get('uids').split(','), Array.from(a.questionUids), 'the paper UIDs in paper order');
  assert.equal(a.questionUids.length, 24);
  // A·B: one link each, B has none of A's questions
  await h.change({ id: 'quick-two-forms', checked: true, dataset: { quickTwoForms: '' } });
  await h.w.openQuickAssessment('all');
  const [, a2, b2] = h.published;
  links = reportLinks(h.w.renderQuick());
  assert.deepEqual(links.map(link => link[2]), ['A형 결과표 열기', 'B형 결과표 열기']);
  const uidsOf = link => new URL(link[1], 'https://archive.test/archive/workspace.html').searchParams.get('uids').split(',');
  assert.deepEqual(uidsOf(links[0]), Array.from(a2.questionUids));
  assert.deepEqual(uidsOf(links[1]), Array.from(b2.questionUids));
  // not offered for the other quick products
  h.w.state.view = 'monthly-test';
  assert.doesNotMatch(h.w.renderQuick(), /diagnostic-report\.html/);
});

test('diagnostic on the real catalog: 고3 미적분Ⅱ 기본 (22 originals) is built by fill from 유형·유사; the screen says so; A·B keep the cell counts', async () => {
  const data = await catalog();
  const previous = globalThis.Archive2Similar;
  globalThis.Archive2Similar = require('../archive/archive2-similar.js');
  try {
    const records = data.records, changed = data;
    const byUid = new Map(records.map(rec => [rec.questionUid, rec]));
    const product = Quick.PRODUCTS.diagnostic;
    const subject = 'CALCULUS_ADVANCED';
    const index = Unified.buildIndex(records, { projectionPolicy: data.projectionPolicy });
    const pools = Quick.buildPools(index, { product, semester: '' });
    const verdict = Quick.evaluate(pools.units['고3'][subject], product, 'standard');
    assert.equal(verdict.ok, true, 'the originals plus the 유형·유사 reserve make the paper');
    assert.ok(verdict.fills.length > 0, '22 originals do not fill every step: the missing steps are filled');
    const fillTotal = verdict.fills.reduce((sum, fill) => sum + fill.count, 0);
    const h = harness(changed, { restore: okRestore() });
    h.w.state.view = 'diagnostic';
    h.w.quickState.grade = '고3';
    h.w.quickState.subject = subject;
    h.w.quickState.semester = '';
    const html = h.w.renderQuick();
    assert.match(html, new RegExp(verdict.fills[0].bucket + '단계 ' + verdict.fills[0].count + '문항'));
    assert.match(html, /qk-r-fill[^>]*>[^<]*원본 기출이 모자라 유형·유사 문항으로 채웁니다/);
    await h.w.openQuickAssessment('all');
    assert.equal(h.published.length, 1);
    const rows = Array.from(h.published[0].questionUids, id => byUid.get(id));
    assert.equal(rows.length, 24);
    assert.deepEqual(countBy(rows.map(rec => Math.min(rec.difficultyBucket, 4)), [1, 2, 3, 4]), [3, 5, 10, 6]);
    const fillRows = rows.filter(isFilled);
    assert.equal(fillRows.length, fillTotal, 'exactly the missing number');
    const fillSteps = new Set(verdict.fills.map(fill => fill.bucket));
    assert.ok(fillRows.every(rec => fillSteps.has(Math.min(rec.difficultyBucket, 4)) && /^(types|similar)\/high\//.test(rec.sourceFile)), 'high school reserve, only in the short steps');
    const steps = rows.map(rec => rec.difficultyBucket);
    assert.deepEqual(steps, [...steps].sort((a, b) => a - b));
    // 22 originals are all on the paper, so every similar question of this thin pool pairs with one of them: the family rule is relaxed there (see the synthetic family test).
    // A·B
    h.w.quickState.twoForms = true;
    await h.w.openQuickAssessment('all');
    assert.equal(h.published.length, 3);
    const [A, B] = h.published.slice(1);
    const units = pools.units['고3'][subject];
    const cellOf = id => {
      for (const unit of units) for (const step of [1, 2, 3, 4])
        if (unit.buckets[step].some(rec => rec.questionUid === id) || unit.fillBuckets[step].some(rec => rec.questionUid === id)) return unit.key + '|' + step;
      return '?';
    };
    const tally = ids => ids.reduce((map, id) => ({ ...map, [cellOf(id)]: (map[cellOf(id)] || 0) + 1 }), {});
    assert.equal(A.questionUids.length, 24);
    assert.equal(B.questionUids.length, 24);
    assert.deepEqual(tally(B.questionUids), tally(A.questionUids), 'the same unit x step cells');
    // a cell that has no other question than the ones on A (the 단원 미분류 4단계 has a single original and no 유형) repeats it, only there
    const shared = A.questionUids.filter(id => B.questionUids.includes(id));
    for (const id of shared) {
      const unit = units.find(item => cellOf(id).startsWith(item.key + '|'));
      const step = Number(cellOf(id).split('|').pop());
      const supply = unit.buckets[step].length + unit.fillBuckets[step].length;
      assert.ok(supply < 2 * tally(A.questionUids)[cellOf(id)], 'the overlap is only in a cell that cannot give B other questions: ' + cellOf(id));
    }
    assert.match(h.nodes.get('status').textContent, shared.length ? new RegExp('같은 문항 ' + shared.length + '개를 함께 씁니다') : /겹치는 문항은 없습니다/);
  } finally {
    if (previous === undefined) delete globalThis.Archive2Similar; else globalThis.Archive2Similar = previous;
  }
});

// ---- 학기 단추 = 그 학기의 과목·단원 범위 (2026-11-20): 시험지 학기로 풀을 자르지 않는다 ----------------------------------------------
test('diagnostic semester is the scope of the subject / unit, not the exam: 고2 is not cut (unit or not), 중등 follows the unit book, only a 중등 unclassified question follows its exam', () => {
  const diag = Quick.PRODUCTS.diagnostic;
  const pick = (pools, grade, subject) => (pools.units[grade][subject] || []).flatMap(unit => Quick.BUCKETS.flatMap(bucket => unit.buckets[bucket]));
  // 고2 대수: three classified questions of different exam semesters, plus unclassified ones that keep following their exam
  const high = (axis, extra = {}) => entry(record(3, { sourceFile: 'original/high/h2/x.js', examAxis: axis }),
    { grade: '고2', subject: 'ALGEBRA', subjectLabel: '대수', unitKey: 'H15-A-01', unitLabel: '지수', views: ['고2'], ...extra });
  const unclassified = axis => high(axis, { unclassified: true, unitKey: '', unitLabel: '단원 미분류', unitOrder: 9999 });
  const indexHigh = indexOf([high('1-mid'), high('1-final'), high('2-final'), unclassified('1-mid'), unclassified('2-mid')]);
  const axes = semester => Array.from(pick(Quick.buildPools(indexHigh, { product: diag, semester }), '고2', 'ALGEBRA'), rec => rec.examAxis).sort();
  // the subject decides, classified or not: the three semester buttons give the same pool
  assert.deepEqual(axes('1'), ['1-final', '1-mid', '1-mid', '2-final', '2-mid']);
  assert.deepEqual(axes('2'), axes('1'));
  assert.deepEqual(axes(''), axes('1'));
  // 중1: RPM22-M1-L1-01 is a 1학기 book unit, RPM22-M1-L1-06 a 2학기 one; the semester of the exam does not matter
  const middle = (unitKey, axis) => middleEntry(record(3, { sourceFile: 'original/middle/m1/x.js', examAxis: axis, sourceGrade: '중1', effectiveBrowseGrade: '중1' }),
    middleParent('x', 1), { unitKey, unitLabel: unitKey });
  const unclassifiedMiddle = axis => middleEntry(record(3, { sourceFile: 'original/middle/m1/x.js', examAxis: axis, sourceGrade: '중1', effectiveBrowseGrade: '중1' }),
    middleParent('x', 1), { unclassified: true, unitKey: '', unitLabel: '단원 미분류', unitOrder: 9999 });
  const indexMiddle = indexOf([middle('RPM22-M1-L1-01', '2-mid'), middle('RPM22-M1-L1-01', '1-mid'), middle('RPM22-M1-L1-06', '1-final'), middle('RPM22-M1-L1-06', '2-final'),
    unclassifiedMiddle('1-mid')]);
  const unitsOf = semester => Array.from(pick(Quick.buildPools(indexMiddle, { product: diag, semester }), '중1', middleSubject),
    rec => indexMiddle.byUid.get(rec.questionUid).unitKey).sort();
  assert.deepEqual(unitsOf('1'), ['', 'RPM22-M1-L1-01', 'RPM22-M1-L1-01'], 'a 1학기-book unit printed on a 2학기 exam is a 1학기 question; the unclassified 1학기-exam one follows its exam');
  assert.deepEqual(unitsOf('2'), ['RPM22-M1-L1-06', 'RPM22-M1-L1-06']);
  assert.equal(unitsOf('').length, 5);
  assert.equal(Quick.semesterCutsPool('중1'), true);
  assert.equal(Quick.semesterCutsPool('고1'), false);
});

test('diagnostic 고1: the semester button and the subject button never disagree (1학기 = 공통수학1, 2학기 = 공통수학2)', async () => {
  const h = harness(diagnosticCatalog([8, 8, 14, 10, 0]), { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  h.w.renderQuick();
  assert.equal(h.w.quickState.semester, '1');
  await h.click({ action: 'quick-semester', semester: '2' });
  assert.equal(h.w.quickState.subject, 'COMMON_MATH_2', 'the 2학기 button picks the 공통수학2 units');
  assert.equal(h.w.quickState.semester, '2');
  assert.equal(h.w.routeUrl().searchParams.get('qsubject'), 'COMMON_MATH_2', 'the address follows the subject the semester button picked');
  await h.click({ action: 'quick-subject', subject: 'COMMON_MATH_1' });
  h.w.renderQuick();
  assert.equal(h.w.quickState.semester, '1', 'the subject button sets the semester');
  assert.equal(h.w.routeUrl().searchParams.get('qsubject'), 'COMMON_MATH_1', 'and the address');
  await h.click({ action: 'quick-semester', semester: '' });
  assert.equal(h.w.quickState.subject, 'COMMON_MATH_1', '1·2학기 keeps the subject');
  h.w.renderQuick();
  assert.equal(h.w.quickState.semester, '');
});

test('diagnostic on the real catalog: 고2 대수 2학기 and 중1 1학기 기본 are built from originals alone (no 유형·유사 fill), 고2 does not name a semester', async () => {
  const data = await catalog();
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  const index = Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  // 고2 대수 2학기: the 수학I originals sit on 1학기 exams; they are candidates now (was 14 questions + a 12-question fill)
  const h = harness(data, { restore: okRestore() });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고2';
  h.w.quickState.subject = 'ALGEBRA';
  h.w.quickState.semester = '2';
  const html = h.w.renderQuick();
  assert.doesNotMatch(html, /qk-r-fill|필요 · \d+문항 가능/, 'no fill line and no shortage');
  assert.match(html, /class="qk-bar-count">24문항 · 대수 전체</, 'a 고2 paper does not claim a semester');
  assert.match(html, /대수 <small>\d{4}<\/small>/, 'the subject button counts the whole subject');
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 1);
  const rowsH2 = Array.from(h.published[0].questionUids, id => byUid.get(id));
  assert.equal(rowsH2.length, 24);
  assert.ok(rowsH2.every(rec => rec.sourceFile.startsWith('original/')), 'originals only: nothing needed a fill');
  assert.ok(rowsH2.some(rec => Quick.examSemester(rec) === '1'), 'questions of 1학기 exams are in a 2학기 paper');
  assert.equal(new Set(rowsH2.map(rec => rec.questionUid)).size, 24);
  const stepsH2 = rowsH2.map(rec => rec.difficultyBucket);
  assert.deepEqual(stepsH2, [...stepsH2].sort((a, b) => a - b));
  // 중1 1학기 기본: the 4~5단계 had 4 originals on 1학기 exams; with the 1학기 book's units there are enough
  const g = harness(data, { restore: okRestore() });
  g.w.state.view = 'diagnostic';
  g.w.quickState.grade = '중1';
  g.w.quickState.semester = '1';
  const htmlM1 = g.w.renderQuick();
  assert.doesNotMatch(htmlM1, /qk-r-fill|필요 · \d+문항 가능/);
  assert.match(htmlM1, /class="qk-bar-count">24문항 · 중1 수학 1학기 전체</);
  await g.w.openQuickAssessment('all');
  assert.equal(g.published.length, 1);
  const rowsM1 = Array.from(g.published[0].questionUids, id => byUid.get(id));
  assert.equal(rowsM1.length, 24);
  assert.ok(rowsM1.every(rec => rec.sourceFile.startsWith('original/')));
  for (const rec of rowsM1) {
    const row = index.byUid.get(rec.questionUid);
    if (!row.unclassified) assert.match(Unified.unitsForGrade('중1').find(unit => unit.key === row.unitKey).courseKey, /-1$/, 'a unit of the 1학기 book');
  }
});

// ---- A·B form: empty questions and a failing B never take the A paper away (2026-11-20 review of the first A·B version) ---------------------
const stableHash = uid => [...uid].reduce((sum, ch) => (sum * 31 + ch.charCodeAt(0)) >>> 0, 7);
const publishedRows = (h, byUid) => h.published.map(item => Array.from(item.questionUids, id => byUid.get(id)));

test('diagnostic A·B: every question of B is also checked against the A paper — a pool whose other questions are all empty gives an overlap, not a failure', async () => {
  const data = fillCatalog([20, 20, 40, 4, 0], 12);
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  const inner = okRestore();
  let aUids = null;
  // A (the first paper) restores fine; afterwards every question that is not on A comes back without answer and solution
  const restore = async records => {
    if (!aUids) { aUids = new Set(records.map(rec => rec.questionUid)); return inner(records); }
    return okRestore(rec => !aUids.has(rec.questionUid))(records);
  };
  const h = harness(data, { restore });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  h.w.quickState.twoForms = true;
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 2, 'both papers are made');
  const [a, b] = h.published;
  assert.equal(b.questionUids.length, 24);
  assert.equal(new Set(b.questionUids).size, 24);
  assert.ok(b.questionUids.every(id => a.questionUids.includes(id)), 'no empty question is printed: B uses A\'s own questions of the step');
  const stepsA = a.questionUids.map(id => byUid.get(id).difficultyBucket), stepsB = b.questionUids.map(id => byUid.get(id).difficultyBucket);
  assert.deepEqual(countBy(stepsB.map(step => Math.min(step, 4)), [1, 2, 3, 4]), countBy(stepsA.map(step => Math.min(step, 4)), [1, 2, 3, 4]));
  assert.match(h.nodes.get('status').textContent, /A·B형이 같은 문항 \d+개를 함께 씁니다/);
  assert.equal(h.popups.some(popup => popup.closed), false, 'no window was closed');
});

test('diagnostic A·B: when B cannot be made at all, the A window stays, only the B window closes, and the status says "B형"', async () => {
  const data = fillCatalog([20, 20, 40, 4, 0], 12);
  let batches = 0;
  const restore = async records => {
    if (records.length >= 20 && ++batches === 2) throw new Error('SOURCE_FETCH_FAILED: network');
    return okRestore()(records);
  };
  const h = harness(data, { restore });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = '고1';
  h.w.quickState.subject = 'COMMON_MATH_1';
  h.w.quickState.twoForms = true;
  await h.w.openQuickAssessment('all');
  assert.equal(h.published.length, 1, 'A is published');
  assert.equal(h.opened.length, 1, 'A window got its paper');
  assert.equal(h.popups[0].closed, undefined, 'the A window stays open');
  assert.equal(h.popups[1].closed, true, 'only the B window is closed');
  const text = h.nodes.get('status').textContent;
  assert.match(text, /B형은 만들지 못했습니다/);
  assert.match(text, /A형은 그대로 열려 있습니다/);
  assert.doesNotMatch(text, /SOURCE_FETCH_FAILED|fingerprint|UID|catalog/i, 'no internal terms');
  assert.equal(h.w.quickState.formB, null);
});

for (const [grade, semester, subject] of [['중2', '1', ''], ['고2', '2', 'ALGEBRA']]) test(`diagnostic on the real catalog: ${grade} ${semester}학기 A·B with empty questions in the 4~5단계 gives two papers, or an A paper that stays with B failing; no empty question either way`, async () => {
  const data = await catalog();
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  // about half of the questions of the 4~5단계 come back without answer / solution
  const emptyOne = rec => rec.difficultyBucket >= 4 && stableHash(rec.questionUid) % 2 === 0;
  const h = harness(data, { restore: okRestore(emptyOne) });
  h.w.state.view = 'diagnostic';
  h.w.quickState.grade = grade;
  if (subject) h.w.quickState.subject = subject;
  h.w.quickState.semester = semester;
  h.w.quickState.twoForms = true;
  h.w.renderQuick();
  await h.w.openQuickAssessment('all');
  const rows = publishedRows(h, byUid);
  assert.ok(rows.length >= 1, 'the A paper is always made');
  for (const paper of rows) {
    assert.equal(paper.length, 24);
    assert.equal(paper.some(emptyOne), false, 'no empty question is printed');
    const steps = paper.map(rec => rec.difficultyBucket);
    assert.deepEqual(steps, [...steps].sort((a, b) => a - b));
  }
  assert.equal(h.popups[0].closed, undefined, 'the A window stays open');
  const text = h.nodes.get('status').textContent;
  if (rows.length === 2) {
    assert.equal(rows[0].filter(rec => rows[1].includes(rec)).length, Number((/같은 문항 (\d+)개/.exec(text) || [0, 0])[1]), 'the told overlap is the real one');
    assert.deepEqual(countBy(rows[1].map(rec => Math.min(rec.difficultyBucket, 4)), [1, 2, 3, 4]), countBy(rows[0].map(rec => Math.min(rec.difficultyBucket, 4)), [1, 2, 3, 4]));
  } else assert.match(text, /B형은 만들지 못했습니다/);
});

test('diagnostic on the real catalog: 기초 / 기본 / 심화 print the preset steps in order from original exams, every chosen unit has its minimum', async () => {
  const data = await catalog();
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  const index = Unified.buildIndex(data.records, { projectionPolicy: data.projectionPolicy });
  let printed = 0, announced = 0;
  for (const [grade, semester] of [['중1', '2'], ['중3', '1'], ['고1', '1']]) {
    const h = harness(data, { restore: okRestore() });
    h.w.state.view = 'diagnostic';
    h.w.quickState.grade = grade;
    h.w.quickState.semester = semester;
    h.w.renderQuick();
    const subject = h.w.quickState.subject;
    const pools = Quick.buildPools(index, { product: Quick.PRODUCTS.diagnostic, semester });
    const units = pools.units[grade][subject].filter(unit => unit.total > 0);
    for (const presetName of ['basic', 'standard', 'advanced']) {
      h.w.quickState.presets.diagnostic = presetName;
      const html = h.w.renderQuick();
      const verdict = Quick.evaluate(pools.units[grade][subject], Quick.PRODUCTS.diagnostic, presetName);
      const before = h.published.length;
      await h.w.openQuickAssessment('all');
      const preset = Quick.PRODUCTS.diagnostic.presets[presetName];
      if (!verdict.ok) {
        announced++;
        assert.equal(h.published.length, before, grade + ' ' + presetName);
        assert.match(html, /\d(?:~5)?단계 \d+문항 필요 · \d+문항 가능/, grade + ' ' + presetName);
        continue;
      }
      printed++;
      assert.equal(h.published.length, before + 1, grade + ' ' + presetName);
      const { questionUids } = h.published[before];
      assert.equal(new Set(questionUids).size, 24, grade + ' ' + presetName);
      const rows = Array.from(questionUids, id => byUid.get(id));
      assert.ok(rows.every(rec => rec.sourceFile.startsWith('original/')), 'original exams only');
      // the chosen semester's scope: 중등 = units of that semester's book; 고1 = no cut by exam semester (the subject is the semester's subject)
      for (const rec of rows) {
        const row = index.byUid.get(rec.questionUid);
        if (/^중/.test(grade) && !row.unclassified) assert.match(Unified.unitsForGrade(grade).find(unit => unit.key === row.unitKey).courseKey, new RegExp('-' + semester + '$'), grade + ' unit of the chosen semester');
        else if (/^중/.test(grade)) assert.equal(Quick.examSemester(rec), semester, 'an unclassified question follows its exam semester');
      }
      const steps = rows.map(rec => rec.difficultyBucket);
      assert.deepEqual(steps, [...steps].sort((a, b) => a - b), grade + ' ' + presetName + ' step order');
      assert.deepEqual(countBy(steps.map(step => Math.min(step, 4)), [1, 2, 3, 4]), preset.map(([, count]) => count), grade + ' ' + presetName);
      const minimum = Math.min(Math.floor(24 / units.length), 3);
      for (const unit of units) {
        const mine = new Set(Quick.BUCKETS.flatMap(bucket => unit.buckets[bucket]).map(rec => rec.questionUid));
        const have = questionUids.filter(id => mine.has(id)).length;
        assert.ok(have >= Math.min(minimum, mine.size), grade + ' ' + presetName + ' ' + unit.label + ' has ' + have);
      }
      for (let i = 1; i < rows.length; i++) assert.ok(rows[i].difficultyBucket > rows[i - 1].difficultyBucket ||
        unitOrderOf(units, rows[i]) >= unitOrderOf(units, rows[i - 1]), 'unit order inside a step');
    }
  }
  assert.equal(printed + announced, 9);
  assert.ok(printed > 0);
});
function unitOrderOf(units, record) {
  for (const unit of units) if (Quick.BUCKETS.some(bucket => unit.buckets[bucket].includes(record))) return unit.order;
  return Infinity;
}

test('the four older products print from the lowest step up, in unit order inside a step, and still use the common pools', async () => {
  const data = await catalog();
  const byUid = new Map(data.records.map(rec => [rec.questionUid, rec]));
  for (const view of ['monthly-test', 'unit-test']) {
    const h = harness(data);
    h.w.state.view = view;
    h.w.quickState.grade = '고1';
    h.w.quickState.subject = 'COMMON_MATH_1';
    const html = h.w.renderQuick();
    if (view === 'unit-test') {
      const key = html.match(/data-action="quick-pick" data-unit-key="([^"]+)"/)[1];
      await h.click({ action: 'quick-pick', unitKey: key });
      await h.click({ action: 'quick-open-pick' });
    } else await h.w.openQuickAssessment('all');
    assert.equal(h.published.length, 1, view);
    const steps = stepsOf(h.published[0].questionUids, byUid);
    assert.deepEqual(steps, [...steps].sort((a, b) => a - b), view);
    assert.ok(steps.every(step => step <= 4), view + ' never uses 5단계');
  }
});
