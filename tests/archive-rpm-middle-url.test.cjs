const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const core = require('../archive/unit-past-exams-core.js');
const toc = require('../archive/rpm-middle-toc.js');
const source = fs.readFileSync(path.join(__dirname, '../archive/unit-past-exams.js'), 'utf8');
const entryMarker = '  window.UnitPastExams = {';
const plain = value => JSON.parse(JSON.stringify(value));

// Execute the actual page's serializers and readers. Only expose private functions in
// the VM; production exports and browser storage remain unchanged.
function runtime(unit, url = 'https://archive.test/archive/unit-past-exams.html?grade=m1') {
  assert.ok(source.includes(entryMarker), 'the UI entry point must remain available');
  const window = {
    UnitPastExamsCore: core,
    location: new URL(url),
    addEventListener() {},
  };
  const setUrl = next => { window.location = new URL(next, window.location); };
  const context = vm.createContext({
    window, URL, URLSearchParams, console,
    history: {
      replaceState(_state, _title, next) { setUrl(next); },
      pushState(_state, _title, next) { setUrl(next); },
    },
    document: { getElementById() { return null; } },
    localStorage: { getItem() { return null; } },
  });
  vm.runInContext(source.replace(entryMarker, `
    window.urlTest = { state, G, getDefaultFilterState, syncFilterUrl,
      getCollectionDefaultState, syncCollectionUrl, gridApplyStoredSelection };
${entryMarker}`), context);
  const api = window.urlTest;
  api.state.profileId = 'm1';
  api.state.selectedUnitKey = unit.key;
  api.state.catalog = { units: [unit] };
  return { api, window, get url() { return window.location.href; } };
}

function currentUnit() {
  const unit = core.getProfile('m1').units.find(row => row.name === '기본 도형');
  assert.ok(unit);
  const parents = toc.parents('중1').filter(parent => parent.unitKey === unit.key);
  const records = parents.flatMap(parent => {
    const leaf = toc.authority.leafMappings.find(row => toc.refinePath(row.basePath).parentKey === parent.key);
    assert.ok(leaf, `${parent.L2} has a full canonical leaf`);
    // Two location questions plus one question in each neighboring chapter make
    // an accidentally cleared filter observably expand the selected pool.
    const count = parent.L2 === '위치 관계' ? 2 : 1;
    return Array.from({ length: count }, () => ({
      sourceFile: 'original/middle/m1/2mid/26_url_fixture.js',
      sourceGrade: '중1', year: 2026, curriculumKey: '2022', courseKey: 'M1-2',
      mappedUnitKey: unit.key, generalUseEligible: true, level: '중',
      rpmPrimaryPath: toc.toRpmPath(toc.normalizePath(leaf.basePath)),
    }));
  }).map((record, index) => ({ ...record, id: index + 1, sourceOrdinal: index + 1,
    questionUid: `url-fixture-${index + 1}` }));
  return { ...unit, records };
}

function selectedKeys(unit) {
  return core.getSubUnitOptions(unit.records)
    .filter(option => ['위치 관계', '작도와 합동'].includes(option.label))
    .map(option => option.key);
}

test('middle RPM chapter selections survive the normal UI URL and a fresh page reader', () => {
  const unit = currentUnit();
  const keys = selectedKeys(unit);
  assert.equal(keys.length, 2);
  assert.ok(keys.every(key => key.includes(',') && key.includes('"')),
    'exercise the structured keys that a comma-separated serializer corrupts');
  assert.equal(core.getSubUnitOptions(unit.records).length, 3);
  const page = runtime(unit);
  page.api.state.filterState = { ...page.api.getDefaultFilterState(unit), subUnitKeys: keys };
  page.api.syncFilterUrl();
  assert.deepEqual(JSON.parse(new URL(page.url).searchParams.get('subUnit')), keys);

  const reloaded = runtime(unit, page.url);
  const restored = reloaded.api.getDefaultFilterState(unit);
  assert.deepEqual(plain(restored.subUnitKeys), keys);
  const selected = core.filterUnitRecords(unit.records, restored);
  assert.equal(selected.length, 3, 'reload must not widen the selection to all four questions');
  assert.ok(selected.every(record => keys.includes(core.getSelectionSubUnitKey(record))));
});

test('school collection chapter selections survive the collection UI URL and a fresh page reader', () => {
  const unit = currentUnit();
  const keys = selectedKeys(unit);
  const page = runtime(unit);
  page.api.state.collectionState = { ...page.api.getCollectionDefaultState(unit), subUnitKeys: keys };
  page.api.syncCollectionUrl();
  assert.deepEqual(JSON.parse(new URL(page.url).searchParams.get('collectionSubUnit')), keys);

  const reloaded = runtime(unit, page.url);
  const restored = reloaded.api.getCollectionDefaultState(unit);
  assert.deepEqual(plain(restored.subUnitKeys), keys);
  assert.equal(core.filterUnitRecords(unit.records, restored).length, 3,
    'collection reload must retain the requested chapters instead of matching no records');
});

test('existing comma-separated legacy chapter links still restore both selection modes', () => {
  const unit = currentUnit();
  const keys = ['M1-05-BASIC_FIGURE', 'M1-05-POSITION_RELATION'];
  unit.records = keys.map((subUnitKey, index) => ({
    id: index + 1, sourceOrdinal: index + 1, questionUid: `legacy-url-fixture-${index + 1}`,
    sourceFile: 'original/middle/m1/2mid/22_url_fixture.js', sourceGrade: '중1',
    year: 2022, curriculumKey: '2015', mappedUnitKey: unit.key,
    subUnitKey, subUnit: index ? '위치 관계' : '점, 선, 면',
    generalUseEligible: true, level: '중',
  }));
  const url = new URL('https://archive.test/archive/unit-past-exams.html?grade=m1');
  url.searchParams.set('subUnit', keys.join(','));
  url.searchParams.set('collectionSubUnit', keys.join(','));
  const page = runtime(unit, url.href);
  const normal = page.api.getDefaultFilterState(unit);
  const collection = page.api.getCollectionDefaultState(unit);
  assert.deepEqual(plain(normal.subUnitKeys), keys);
  assert.deepEqual(plain(collection.subUnitKeys), keys);
  assert.equal(core.filterUnitRecords(unit.records, normal).length, 2);
  assert.equal(core.filterUnitRecords(unit.records, collection).length, 2);
});

test('stored middle grid cells and checked units restore through a one-to-one unit alias', () => {
  const unit = currentUnit();
  unit.selectableRecords = unit.records.map(record => ({ ...record, difficultyBucket: 2 }));
  const page = runtime(unit);
  page.api.G.profileId = 'm1';
  page.api.G.counts = core.countGrid([unit]);
  assert.ok(page.api.G.counts[unit.key]['2'] > 0);
  const stored = {
    profileId: 'm1', cells: ['M22-1-05|2'], checked: ['M22-1-05'],
  };
  const before = plain(stored);

  page.api.gridApplyStoredSelection(stored);

  assert.deepEqual([...page.api.G.cells], [`${unit.key}|2`]);
  assert.deepEqual([...page.api.G.checked], [unit.key]);
  assert.deepEqual(stored, before, 'restoration must not rewrite the saved input');
});

test('stored combined geometry units remain unresolved when the current unit alias is ambiguous', () => {
  const units = core.getProfile('m2').units.map(unit => ({
    ...unit, selectableRecords: [{ difficultyBucket: 2 }],
  }));
  const page = runtime(units[0]);
  page.api.state.profileId = page.api.G.profileId = 'm2';
  page.api.state.catalog = { units };
  page.api.G.counts = core.countGrid(units);

  page.api.gridApplyStoredSelection({
    profileId: 'm2', cells: ['M22-2-06|2'], checked: ['M22-2-06'],
  });

  assert.deepEqual([...page.api.G.cells], []);
  assert.deepEqual([...page.api.G.checked], []);
});
