const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// 단원 x 단계 표(여러 단원 x 여러 단계 선택): 실제 문항 자료로 검사한다. 자료는 매일 늘어나므로
// 정확한 문항 수는 고정하지 않고 "합계 일치·중복 0·예외 없음" 같은 결함 조건만 본다.
const archiveRoot = path.resolve(__dirname, '..', 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));

function loadJoinedIndex() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'question-index.js'), 'utf8'), context);
  const meta = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'data', 'question_metadata.json'), 'utf8'));
  const bySource = new Map(meta.records.map(m => [`${m.sourceArchiveFile}#${m.sourceOrdinal}`, m]));
  return context.window.questionIndex.map(record => {
    const m = bySource.get(`${record.sourceFile}#${record.sourceOrdinal}`);
    return m ? { ...record, difficultyBucket: m.difficultyBucket || record.difficultyBucket || '' } : record;
  });
}

const joined = loadJoinedIndex();
const catalog = core.buildCatalog(joined, { profileId: 'h1' });
const units = catalog.units;
const unitOf = key => units.find(unit => unit.key === key);
// 사용자 예: 고1 공통수학2 명제·함수·유리함수·무리함수 x 1·2·3단계
const KEYS = ['H22-C2-06', 'H22-C2-07', 'H22-C2-08', 'H22-C2-09'];
const cellsFor = (keys, steps) => keys.flatMap(unitKey => steps.map(step => ({ unitKey, step })));
const SELECTION = cellsFor(KEYS, [1, 2, 3]);
const identities = papers => papers.flatMap(paper => paper.records.map(core.getRecordIdentity));

test('집계표: 단원마다 단계별 개수의 합이 그 단원의 선택 가능 문항 수와 같고 한 번 계산하는 시간이 짧다', () => {
  const started = Date.now();
  const grid = core.countGrid(units);
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 500, `집계 ${elapsed}ms`);
  for (const unit of units) {
    const row = grid[unit.key];
    assert.ok(row, unit.key);
    assert.equal(row[1] + row[2] + row[3] + row[4] + row[5] + row.none, unit.selectableCount, unit.name);
    assert.equal(row.total, unit.selectableCount);
  }
  assert.deepEqual(core.countGrid(null), {});
});

test('전부 모드: 고른 칸의 문항 합계와 같고, 한 문항은 한 번만 들어간다', () => {
  const grid = core.countGrid(units);
  const result = core.buildSelectionPapers(SELECTION, { units });
  const expected = SELECTION.reduce((sum, cell) => sum + grid[cell.unitKey][cell.step], 0);
  assert.equal(result.total, expected);
  assert.equal(result.papers.reduce((sum, paper) => sum + paper.count, 0), expected);
  const ids = identities(result.papers);
  assert.equal(new Set(ids).size, ids.length, '중복 문항 0');
  assert.deepEqual(result.shortages, []);
  assert.equal(result.perCell, null);
  // 같은 칸을 두 번 줘도 한 번만 센다.
  assert.equal(core.buildSelectionPapers([...SELECTION, ...SELECTION], { units }).total, expected);
});

test('칸마다 N문항: 칸마다 N 이하, 모자란 칸은 있는 만큼만 넣고 shortages에 기록하며 예외가 없다', () => {
  const grid = core.countGrid(units);
  const N = 15;
  const result = core.buildSelectionPapers(SELECTION, { units, perCell: N });
  for (const cell of result.cells) {
    assert.ok(cell.got <= N);
    assert.equal(cell.got, Math.min(N, grid[cell.unitKey][cell.step]));
  }
  const short = result.cells.filter(cell => grid[cell.unitKey][cell.step] < N);
  assert.deepEqual(result.shortages.map(item => [item.unitKey, item.step, item.wanted, item.got]),
    short.map(cell => [cell.unitKey, cell.step, N, cell.got]));
  assert.ok(short.length > 0, '이 자료에는 모자란 칸이 있어 이 검사가 의미가 있다');
  assert.equal(result.total, result.cells.reduce((sum, cell) => sum + cell.got, 0));
  const ids = identities(result.papers);
  assert.equal(new Set(ids).size, ids.length);
  // 아주 큰 N도 막지 않는다(= 전부).
  assert.equal(core.buildSelectionPapers(SELECTION, { units, perCell: 5000 }).total, core.buildSelectionPapers(SELECTION, { units }).total);
});

test('칸마다 N문항은 최신 연도 문항을 먼저 뽑는다', () => {
  const key = KEYS[1];
  const all = unitOf(key).selectableRecords.filter(record => core.getStepToken(record) === '3');
  const newest = Math.min(...all.map(core.recencyRankOf));
  const result = core.buildSelectionPapers([{ unitKey: key, step: 3 }], { units, perCell: 5 });
  assert.equal(result.total, 5);
  assert.equal(Math.min(...result.papers[0].records.map(core.recencyRankOf)), newest);
});

test('권 나누기: 한 권 80문항 이하, 같은 시험은 한 권에, 정렬 방식과 관계없이 문항이 빠지지 않는다', () => {
  for (const order of ['recent', 'unit', 'step']) {
    const result = core.buildSelectionPapers(SELECTION, { units, order });
    assert.ok(result.papers.length >= 2, order);
    assert.equal(result.papers.reduce((sum, paper) => sum + paper.count, 0), result.total, order);
    for (const paper of result.papers) assert.ok(paper.count <= 80 && paper.count === paper.records.length, order);
  }
  // 최신순: 같은 원본 시험의 문항은 두 권으로 갈라지지 않는다.
  const recent = core.buildSelectionPapers(SELECTION, { units, order: 'recent' });
  const paperOfFile = new Map();
  recent.papers.forEach(paper => paper.records.forEach(record => {
    const owner = paperOfFile.get(record.sourceFile);
    assert.ok(owner === undefined || owner === paper.index, `${record.sourceFile}이 ${owner}권과 ${paper.index}권으로 갈라짐`);
    paperOfFile.set(record.sourceFile, paper.index);
  }));
});

test('최신 연도순: 문제지 1에 가장 최신 연도가 들어가고 권이 뒤로 갈수록 오래된다. 권 안은 단원 → 쉬운 단계 순서다', () => {
  const result = core.buildSelectionPapers(SELECTION, { units, order: 'recent' });
  const allYears = result.papers.flatMap(paper => paper.records.map(core.getExamYear)).filter(year => year < 2200);
  assert.equal(result.papers[0].yearMax, Math.max(...allYears));
  for (let i = 1; i < result.papers.length; i += 1) assert.ok(result.papers[i].yearMax <= result.papers[i - 1].yearMin);
  const unitIndex = new Map(units.map((unit, index) => [unit.key, index]));
  for (const paper of result.papers) {
    const seq = paper.records.map(record => [unitIndex.get(record.mappedUnitKey), Number(core.getStepToken(record) === 'none' ? 6 : core.getStepToken(record))]);
    const sorted = [...seq].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    assert.deepEqual(seq, sorted);
  }
});

test('단원순·단계순: 권 안의 정렬이 약속대로이고 구역 제목이 단원·단계가 바뀔 때 붙는다', () => {
  const unitIndex = new Map(units.map((unit, index) => [unit.key, index]));
  const byUnit = core.buildSelectionPapers(SELECTION, { units, order: 'unit' });
  const unitSeq = byUnit.papers.flatMap(paper => paper.records.map(record => unitIndex.get(record.mappedUnitKey)));
  assert.deepEqual(unitSeq, [...unitSeq].sort((a, b) => a - b), '단원 순으로 권을 자른다');
  const byStep = core.buildSelectionPapers(SELECTION, { units, order: 'step' });
  const stepSeq = byStep.papers.flatMap(paper => paper.records.map(record => Number(core.getStepToken(record))));
  assert.deepEqual(stepSeq, [...stepSeq].sort((a, b) => a - b), '쉬운 단계 순으로 권을 자른다');
  for (const result of [byUnit, byStep, core.buildSelectionPapers(SELECTION, { units })]) {
    for (const paper of result.papers) {
      assert.ok(paper.sections.length > 0);
      assert.equal(paper.sections[0].at, 0);
      assert.ok(paper.sections.every(section => section.at >= 0 && section.at < paper.count && section.title && [1, 2].includes(section.level)));
      assert.ok(paper.sections.every(section => section.title.length <= 40));
    }
  }
  const sample = core.buildSelectionPapers(SELECTION, { units, order: 'recent' }).papers[0].sections.map(section => section.title);
  assert.ok(sample.some(title => KEYS.map(key => unitOf(key).name).includes(title)), '단원 이름 제목');
  assert.ok(sample.includes('1단계'));
  // 단원이 하나면 단원 제목 없이 단계 제목만 붙는다(기존 단원별 문제지와 같은 모양).
  const single = core.buildSelectionPapers([{ unitKey: KEYS[0], step: 1 }, { unitKey: KEYS[0], step: 2 }], { units });
  assert.deepEqual(single.papers[0].sections.map(section => section.title), ['1단계', '2단계']);
});

test('같은 선택·옵션이면 같은 구성과 snapshotKey, 다른 선택·옵션이면 다른 키', () => {
  const a = core.buildSelectionPapers(SELECTION, { units });
  const b = core.buildSelectionPapers([...SELECTION].reverse(), { units });
  assert.deepEqual(a.papers.map(paper => paper.snapshotKey), b.papers.map(paper => paper.snapshotKey));
  assert.deepEqual(identities(a.papers), identities(b.papers));
  const keys = new Set(a.papers.map(paper => paper.snapshotKey));
  assert.equal(keys.size, a.papers.length, '권마다 키가 다르다');
  const variants = [
    core.buildSelectionPapers(SELECTION.slice(0, -1), { units }),
    core.buildSelectionPapers(SELECTION, { units, perCell: 10 }),
    core.buildSelectionPapers(SELECTION, { units, order: 'unit' }),
    core.buildSelectionPapers(SELECTION, { units, order: 'step' })
  ];
  for (const variant of variants) {
    for (const paper of variant.papers) assert.ok(!keys.has(paper.snapshotKey), '다른 선택의 키가 겹치지 않는다');
  }
  assert.match(a.papers[0].snapshotKey, /^unitpast_h1-through-2final-v2_multi-[0-9a-f]{8}_[0-9a-f]{8}$/);
  const one = core.buildSelectionPapers([{ unitKey: KEYS[0], step: 1 }], { units });
  assert.match(one.papers[0].snapshotKey, /^unitpast_h1-through-2final-v2_H22-C2-06_[0-9a-f]{8}$/);
});

test('권 제목은 교사가 읽어 내용을 아는 이름이다', () => {
  const result = core.buildSelectionPapers(SELECTION, { units });
  const n = result.papers.length;
  assert.equal(result.papers[0].title, `명제 외 3단원 · 1~3단계 · 1권/${n}권`);
  const single = core.buildSelectionPapers([{ unitKey: KEYS[1], step: 2 }], { units });
  assert.equal(single.papers.length >= 1, true);
  assert.match(single.papers[0].title, /^함수 · 2단계/);
  const odd = core.buildSelectionPapers([{ unitKey: KEYS[0], step: 1 }, { unitKey: KEYS[0], step: 3 }, { unitKey: KEYS[0], step: 'none' }], { units });
  assert.match(odd.papers[0].title, /^명제 · 1·3단계 · 단계 미지정/);
});

test('빈 선택·없는 단원·문항 0인 칸에서도 예외 없이 빈 결과를 돌려준다', () => {
  const empty = core.buildSelectionPapers([], { units });
  assert.deepEqual([empty.papers, empty.total, empty.shortages], [[], 0, []]);
  for (const bad of [null, undefined, 'x', [null], [{}], [{ unitKey: 'NOPE', step: 1 }], [{ unitKey: KEYS[0], step: 9 }]])
    assert.equal(core.buildSelectionPapers(bad, { units }).total, 0);
  assert.equal(core.buildSelectionPapers(SELECTION).total, 0, '단원 목록이 없으면 빈 결과');
  assert.equal(core.buildSelectionPapers(SELECTION, { units, perCell: 0 }).perCell, null, '0은 전부로 본다');
  const zeroUnit = units.find(unit => core.countGrid([unit])[unit.key].total === 0) || units[0];
  const zeroStep = [1, 2, 3, 4, 5, 'none'].find(step => !(core.countGrid([zeroUnit])[zeroUnit.key][step] > 0));
  if (zeroStep !== undefined) {
    const result = core.buildSelectionPapers([{ unitKey: zeroUnit.key, step: zeroStep }], { units, perCell: 10 });
    assert.deepEqual([result.total, result.papers.length], [0, 0]);
    assert.deepEqual(result.shortages.map(item => item.got), [0], '문항 0인 칸도 모자란 칸으로만 기록');
  }
  // 한 칸이 비어도 다른 칸은 그대로 만든다.
  const mixed = core.buildSelectionPapers([{ unitKey: KEYS[0], step: 1 }, { unitKey: 'NOPE', step: 1 }], { units });
  assert.equal(mixed.total, core.countGrid(units)[KEYS[0]][1]);
});

test('선택 계산은 화면 응답 시간(동기 500ms) 안에 끝난다(과목 전체 x 전체 단계)', () => {
  const all = cellsFor(units.map(unit => unit.key), [1, 2, 3, 4, 5, 'none']);
  const started = Date.now();
  const result = core.buildSelectionPapers(all, { units });
  const elapsed = Date.now() - started;
  assert.ok(result.total > 1000);
  assert.ok(elapsed < 500, `${result.total}문항 계산 ${elapsed}ms`);
});
