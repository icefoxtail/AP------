const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// 단원 트리(대단원 -> 중단원/소단원 묶음)와 표의 중단원 칸·유형 거르기 계산. 자료는 매일 늘어나므로 정확한 개수는 고정하지 않고
// "정본 중단원이 모두 있음 · 순서가 정본과 같음 · 중복 이름 0 · 한 문항은 한 줄에만" 같은 결함 조건을 본다.
const archiveRoot = path.resolve(__dirname, '..', 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));
const Toc = require(path.join(archiveRoot, 'rpm-middle-toc.js'));
const Tree = require(path.join(archiveRoot, 'archive2-unit-tree.js'));
const groupsDoc = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'data', 'archive2-subunit-groups.json'), 'utf8'));

function loadJoinedIndex() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'question-index.js'), 'utf8'), context);
  const meta = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'data', 'question_metadata.json'), 'utf8'));
  const bySource = new Map(meta.records.map(m => [`${m.sourceArchiveFile}#${m.sourceOrdinal}`, m]));
  return context.window.questionIndex.map(record => {
    const m = bySource.get(`${record.sourceFile}#${record.sourceOrdinal}`);
    if (!m) return record;
    const key = String(m.subUnitKey || '').trim();
    const parent = String(m.standardUnitKey || '').trim();
    const valid = key && parent && core.isSubUnitInParentScope(key, parent);
    return { ...record, subUnitParentKey: valid ? parent : core.getSubUnitParentKey(record), subUnitKey: valid ? key : core.getSubUnitKey(record),
      difficultyBucket: m.difficultyBucket || record.difficultyBucket || '' };
  });
}
const joined = loadJoinedIndex();
const treeFor = profileId => {
  const catalog = core.buildCatalog(joined, { profileId });
  const tree = Tree.createTree(profileId, catalog.units);
  return { catalog, tree, grid: core.countGrid(catalog.units, { childOf: (record, unit) => tree.childKeyOf(unit.key, record) }) };
};

test('중등: 정본 중단원이 모두 목차 순서 그대로 트리에 있다(문항이 0이어도)', () => {
  for (const [profileId, grade] of [['m1', '중1'], ['m2', '중2'], ['m3', '중3']]) {
    const { catalog, tree } = treeFor(profileId);
    assert.equal(tree.source, 'rpm-toc');
    assert.deepEqual(catalog.units.map(unit => unit.key), Toc.units(grade).map(unit => unit.key), `${grade} 대단원 순서`);
    for (const unit of catalog.units) {
      const expected = Toc.parents(grade).filter(parent => parent.unitKey === unit.key).sort((a, b) => a.orderInUnit - b.orderInUnit).map(parent => parent.L2);
      const actual = tree.childrenOf(unit.key).filter(child => child.kind === 'chapter').map(child => child.name);
      assert.deepEqual(actual, expected, `${grade} ${unit.name} 중단원은 정본 순서와 같다`);
      const names = tree.childrenOf(unit.key).map(child => child.name);
      assert.equal(new Set(names).size, names.length, `${unit.name} 중복 이름 0`);
      const keys = tree.childrenOf(unit.key).map(child => child.key);
      assert.equal(new Set(keys).size, keys.length);
      for (const key of keys) assert.match(key, /^[\w:.\-]+$/, '칸 키는 주소·속성에 그대로 쓸 수 있다');
    }
  }
});

test('한 문항은 한 줄에만 들어가고 줄의 합이 단원 합계와 같다(중등·고등 모두)', () => {
  Tree.setGroups(groupsDoc);
  for (const profileId of ['m1', 'm2', 'm3', 'h1', 'h2']) {
    const { catalog, tree, grid } = treeFor(profileId);
    for (const unit of catalog.units) {
      const row = grid[unit.key];
      const sum = Object.values(row.children || {}).reduce((total, child) => total + child.total, 0);
      assert.equal(sum, row.total, `${profileId} ${unit.name}`);
      for (const record of unit.selectableRecords) {
        const key = tree.childKeyOf(unit.key, record);
        assert.ok(key, '모든 문항은 어떤 줄에든 들어간다');
        assert.equal(tree.childKeyOf(unit.key, record), key, '같은 문항은 늘 같은 줄');
        if (tree.hasChildren(unit.key)) assert.ok(tree.childrenOf(unit.key).some(child => child.key === key), `${unit.name}: 목록에 없는 줄 ${key}`);
      }
    }
  }
});

test('중등 중단원 판정: EXACT는 그 중단원, 옛 2015 키는 정본이 하나로 정할 때만, 못 정하면 중단원 미지정', () => {
  const unitKey = 'RPM22-M1-L1-06';
  const polygon = Toc.refinePath({ curriculumKey: '2022', courseKey: 'M1-2', L1: '평면도형', L2: '다각형' });
  const circle = Toc.refinePath({ curriculumKey: '2022', courseKey: 'M1-2', L1: '평면도형', L2: '원과 부채꼴' });
  assert.equal(polygon.status, 'EXACT');
  assert.equal(circle.status, 'EXACT');
  const rec = (id, extra) => ({ sourceFile: `original/middle/m1/1mid/x${id}.js`, sourceQuestionNo: id, id, ...extra });
  const records = [
    rec(1, { rpmParentResolution: polygon }),
    rec(2, { rpmParentResolution: circle }),
    rec(3, { rpmParentResolution: { status: 'OUT_OF_SCOPE', parent: null }, subUnitKey: 'M1-06-PLANE_FIGURE_MEASURE' }),
    rec(4, { rpmParentResolution: { status: 'AMBIGUOUS', parent: null }, subUnitKey: 'M1-06-PLANE_FIGURE_MEASURE' }),
    // 정본이 두 중단원을 가리키는 옛 키(다각형/원과 부채꼴)는 하나로 정할 수 없다.
    rec(7, { rpmParentResolution: { status: 'OUT_OF_SCOPE', parent: null }, subUnitKey: 'M1-06-POLYGON_CIRCLE' }),
    rec(5, { rpmParentResolution: { status: 'OUT_OF_SCOPE', parent: null }, subUnitKey: 'NOT-IN-CANONICAL' }),
    // 다른 대단원의 중단원이 붙어 있어도 이 단원 줄에는 넣지 않는다.
    rec(6, { rpmParentResolution: Toc.refinePath({ curriculumKey: '2022', courseKey: 'M1-1', L1: '소인수분해', L2: '소인수분해' }) })
  ];
  const tree = Tree.createTree('m1', [{ key: unitKey, name: '평면도형', course: '중1 수학', selectableRecords: records }]);
  const chapter = name => tree.childrenOf(unitKey).find(child => child.name === name).key;
  assert.equal(tree.childKeyOf(unitKey, records[0]), chapter('다각형'));
  assert.equal(tree.childKeyOf(unitKey, records[1]), chapter('원과 부채꼴'));
  assert.equal(tree.childKeyOf(unitKey, records[2]), chapter('원과 부채꼴'), '옛 2015 키는 정본이 정한 중단원으로 접는다');
  assert.equal(tree.childKeyOf(unitKey, records[6]), Tree.NONE_KEY, '정본이 하나로 정하지 않으면 추정하지 않는다');
  assert.equal(tree.childKeyOf(unitKey, records[3]), Tree.NONE_KEY, 'AMBIGUOUS는 옛 키로 되살리지 않는다');
  assert.equal(tree.childKeyOf(unitKey, records[4]), Tree.NONE_KEY);
  assert.equal(tree.childKeyOf(unitKey, records[5]), Tree.NONE_KEY);
  assert.equal(tree.childName(unitKey, Tree.NONE_KEY), '중단원 미지정');
  assert.deepEqual(tree.childrenOf(unitKey).map(child => child.name), ['다각형', '원과 부채꼴', '중단원 미지정']);
  // 문항이 없는 중단원도 표에는 보인다.
  const empty = Tree.createTree('m1', [{ key: unitKey, name: '평면도형', course: '중1 수학', selectableRecords: [] }]);
  assert.deepEqual(empty.childrenOf(unitKey).map(child => child.name), ['다각형', '원과 부채꼴']);
  assert.equal(tree.pathLabel(unitKey, chapter('원과 부채꼴')), '평면도형 › 원과 부채꼴');
});

test('고등: 묶음표 이름만 쓰고 영문·핵심 개념·중복이 없으며 기타는 맨 끝이다', () => {
  Tree.setGroups(groupsDoc);
  for (const profileId of ['h1', 'h2']) {
    const { catalog, tree } = treeFor(profileId);
    assert.equal(tree.source, 'subunit-groups');
    for (const unit of catalog.units) {
      const children = tree.childrenOf(unit.key);
      const names = children.map(child => child.name);
      assert.equal(new Set(names).size, names.length, `${unit.name} 같은 이름이 두 번 나온다: ${names}`);
      for (const name of names) {
        assert.ok(!/[A-Za-z]{2,}/.test(name), `영문 이름: ${name}`);
        assert.ok(!/핵심\s*개념/.test(name), `군더더기: ${name}`);
        assert.ok(/[가-힣]/.test(name), `한글 이름이 아님: ${name}`);
      }
      const other = children.findIndex(child => child.name === Tree.HIGH_OTHER_NAME);
      if (other >= 0) assert.equal(other, children.length - 1, '기타는 끝에');
      const general = children.findIndex(child => child.kind === 'general');
      if (general >= 0 && other >= 0) assert.ok(general < other);
    }
  }
});

test('묶음표를 못 읽으면 고등은 대단원만 보이고 콘솔에 경고하며 예외가 없다', async () => {
  Tree.resetGroups();
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (...args) => warnings.push(args.join(' '));
  try {
    const result = await Tree.loadGroups({ fetch: async () => ({ ok: false, status: 404 }) });
    assert.equal(result, null);
    assert.equal(Tree.groupsLoaded(), false);
    assert.ok(warnings.some(text => /소단원 묶음표/.test(text)), '조용히 넘어가지 않는다');
    const { catalog, tree } = treeFor('h1');
    assert.equal(tree.groupsMissing, true);
    for (const unit of catalog.units) assert.equal(tree.hasChildren(unit.key), false);
    // 잘못된 형식도 같다.
    Tree.resetGroups();
    assert.equal(await Tree.loadGroups({ fetch: async () => ({ ok: true, json: async () => ({ schemaVersion: 'x' }) }) }), null);
    // 읽히면 쓴다.
    Tree.resetGroups();
    assert.ok(await Tree.loadGroups({ fetch: async () => ({ ok: true, json: async () => groupsDoc }) }));
    assert.equal(Tree.groupsLoaded(), true);
  } finally {
    console.warn = originalWarn;
    Tree.setGroups(groupsDoc);
  }
});

test('표 계산: 중단원 칸은 그 중단원 문항만, 단원 전체 칸이 있는 단계의 중단원 칸은 따로 세지 않는다', () => {
  Tree.setGroups(groupsDoc);
  const { catalog, tree, grid } = treeFor('h1');
  const options = { units: catalog.units, childOf: (record, unit) => tree.childKeyOf(unit.key, record), childName: tree.childName.bind(tree), childRank: tree.childRank.bind(tree) };
  const unit = catalog.units.find(item => item.key === 'H22-C-06');
  const children = tree.childrenOf(unit.key).filter(child => (grid[unit.key].children[child.key]?.total || 0) > 0);
  assert.ok(children.length >= 3);
  const first = children[0];
  const step = ['1', '2', '3', '4', '5', 'none'].find(token => grid[unit.key].children[first.key][token] > 0);
  const result = core.buildSelectionPapers([{ unitKey: unit.key, childKey: first.key, step }], options);
  assert.equal(result.total, grid[unit.key].children[first.key][step]);
  for (const paper of result.papers) for (const record of paper.records) assert.equal(tree.childKeyOf(unit.key, record), first.key);
  assert.match(result.unitLabel, new RegExp(`^${unit.name} › ${first.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  assert.equal(result.scopes.length, 1);
  // 같은 단계의 단원 전체 칸이 있으면 중단원 칸은 이미 들어 있다.
  const whole = core.buildSelectionPapers([{ unitKey: unit.key, step }, { unitKey: unit.key, childKey: first.key, step }], options);
  assert.equal(whole.total, grid[unit.key][step]);
  assert.equal(whole.unitLabel, unit.name);
  // 같은 조건이면 같은 문제지 키, 다른 중단원이면 다른 키.
  const again = core.buildSelectionPapers([{ unitKey: unit.key, childKey: first.key, step }], options);
  assert.equal(again.papers[0].snapshotKey, result.papers[0].snapshotKey);
  const second = children.find(child => child.key !== first.key && grid[unit.key].children[child.key][step] > 0);
  if (second) assert.notEqual(core.buildSelectionPapers([{ unitKey: unit.key, childKey: second.key, step }], options).papers[0].snapshotKey, result.papers[0].snapshotKey);
  // childOf 없이 childKey를 주면 단원 전체로 읽는다(예외 없음).
  assert.equal(core.buildSelectionPapers([{ unitKey: unit.key, childKey: first.key, step }], { units: catalog.units }).total, grid[unit.key][step]);
  // 합계: 줄마다 단계 합이 줄 합계와 같다.
  for (const child of Object.values(grid[unit.key].children)) assert.equal(child[1] + child[2] + child[3] + child[4] + child[5] + child.none, child.total);
});

test('유형 거르기: 뺀 유형은 숫자·문제지에서 빠지고, 유형 미지정은 따로 끌 수 있으며 키는 조건을 반영한다', () => {
  const { catalog, grid } = treeFor('h2');
  const all = catalog.units.flatMap(unit => unit.selectableRecords);
  const info = core.getTypeFilterOptions(all);
  assert.equal(info.total, all.length);
  assert.equal(info.options.reduce((sum, option) => sum + option.count, 0) + info.noneCount, info.total, '유형 미지정까지 합이 맞는다');
  const typed = info.options[0];
  if (!typed) return; // 이 PC 자료에 유형이 없으면 구조 검사만
  const unit = catalog.units.find(item => item.selectableRecords.some(record => core.getFilterTypeKey(record) === typed.key));
  const step = ['1', '2', '3', '4', '5', 'none'].find(token => unit.selectableRecords.some(record => core.getStepToken(record) === token && core.getFilterTypeKey(record) === typed.key));
  const without = core.countGrid(catalog.units, { excludedTypeKeys: [typed.key] });
  const expectedLoss = unit.selectableRecords.filter(record => core.getFilterTypeKey(record) === typed.key).length;
  assert.equal(without[unit.key].total, grid[unit.key].total - expectedLoss);
  const base = core.buildSelectionPapers([{ unitKey: unit.key, step }], { units: catalog.units });
  const filtered = core.buildSelectionPapers([{ unitKey: unit.key, step }], { units: catalog.units, excludedTypeKeys: [typed.key] });
  assert.ok(filtered.total < base.total);
  assert.ok(filtered.papers.every(paper => paper.records.every(record => core.getFilterTypeKey(record) !== typed.key)));
  if (filtered.papers[0]) assert.notEqual(filtered.papers[0].snapshotKey, base.papers[0].snapshotKey);
  assert.deepEqual(filtered.excludedTypeKeys, [typed.key]);
  // 유형 미지정을 끄면 미지정 문항이 빠진다.
  const noNone = core.buildSelectionPapers([{ unitKey: unit.key, step }], { units: catalog.units, excludedTypeKeys: [core.NO_TYPE_KEY] });
  assert.ok(noNone.papers.every(paper => paper.records.every(record => core.getFilterTypeKey(record) !== core.NO_TYPE_KEY)));
  assert.equal(core.createTypeFilter([]), null);
  assert.deepEqual(core.normalizeExcludedTypeKeys(new Set(['b', 'a', '', 'a'])), ['a', 'b']);
});
