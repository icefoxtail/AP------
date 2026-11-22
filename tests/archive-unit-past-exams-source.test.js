const test = require('node:test');
const timeBudget = require('./helpers/time-budget.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// 단원별 기출 표의 조건 줄(학교·연도·시험·학기, 학교별로 한 권씩)을 실제 문항 자료로 검사한다.
// 자료는 매일 늘어나므로 정확한 문항 수는 고정하지 않고 "다른 학교·연도 문항 0, 조건 없음 = 조건을 모르던 때와 같음" 같은 결함 조건만 본다.
const archiveRoot = path.resolve(__dirname, '..', 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));

function loadIndex() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'question-index.js'), 'utf8'), context);
  return context.window.questionIndex;
}

const index = loadIndex();
const catalog = core.buildCatalog(index, { profileId: 'h1' });
const units = catalog.units;
const universe = units.flatMap(unit => unit.selectableRecords);
const allCells = units.flatMap(unit => [1, 2, 3, 4, 5, 'none'].map(step => ({ unitKey: unit.key, step })));
const schoolRows = core.getSourceSchoolOptions(universe, {});
const [first, second] = schoolRows;
const yearOf = core.getExamYear;
const idOf = core.getRecordIdentity;
const total = grid => Object.values(grid).reduce((sum, row) => sum + row.total, 0);
const select = (sourceFilter, extra = {}) => core.buildSelectionPapers(allCells, { units, sourceFilter, ...extra });
const allRecords = result => result.papers.flatMap(paper => paper.records);

test('조건이 없으면(없음·빈 객체·"전체") 조건을 모르던 때와 표 숫자·문제지·권 키가 같다', () => {
  const plain = core.buildSelectionPapers(allCells, { units });
  const none = core.createSourceFilter(universe, {});
  assert.equal(none.active, false);
  assert.equal(none.key, '');
  assert.equal(none.keep, null);
  const withNone = select(none);
  assert.deepEqual(withNone.papers.map(paper => [paper.title, paper.snapshotKey, paper.records.map(idOf)]), plain.papers.map(paper => [paper.title, paper.snapshotKey, paper.records.map(idOf)]));
  assert.deepEqual(core.countGrid(units, { sourceFilter: none }), core.countGrid(units));
  // "학교별로 한 권씩"만 켜도 학교를 안 골랐으면 조건이 아니다(묶기는 학교 2곳 이상일 때만 뜻이 있다).
  assert.equal(core.createSourceFilter(universe, { group: 'school' }).active, false);
  assert.equal(plain.groupBy, 'mixed');
  assert.equal(plain.sourceKey, '');
});

test('학교 하나 + 최근 3년: 표 숫자와 문제지의 문항이 전부 그 학교·그 학교의 최근 3개 연도다', () => {
  const filter = core.createSourceFilter(universe, { schoolKeys: [first.key], yearMode: 'recent', yearCount: 3 });
  assert.equal(filter.active, true);
  const years = filter.yearsOf(first.key);
  assert.ok(years.length >= 1 && years.length <= 3, '최근 3개 연도 이하');
  const grid = core.countGrid(units, { sourceFilter: filter });
  const expected = universe.filter(record => core.getSchoolKey(record) === first.key && years.includes(yearOf(record))).length;
  assert.equal(total(grid), expected, '칸 숫자 합 = 그 학교·연도의 문항 수');
  assert.ok(total(grid) > 0 && total(grid) < universe.length);
  const result = select(filter);
  assert.equal(result.total, expected);
  const records = allRecords(result);
  assert.equal(records.filter(record => core.getSchoolKey(record) !== first.key).length, 0, '다른 학교 문항 0');
  assert.equal(records.filter(record => !years.includes(yearOf(record))).length, 0, '연도 범위 밖 문항 0');
  assert.equal(new Set(records.map(idOf)).size, records.length, '중복 문항 0');
  assert.ok(result.papers.every(paper => paper.title.startsWith(`${first.label} · 최근 3년`)), '권 제목에 학교·연도 조건');
  assert.ok(result.papers.every(paper => paper.school === first.label && paper.schoolKey === first.key));
  assert.equal(result.sourceLabel, `${first.label} · 최근 3년`);
});

test('연도를 직접 고르면 그 범위 밖 문항이 없고, 시작·끝이 뒤바뀌어도 같다', () => {
  const years = [...new Set(universe.map(yearOf))].filter(year => year >= 1900 && year <= 2200).sort((a, b) => b - a);
  const [to, from] = [years[0], years[Math.min(2, years.length - 1)]];
  const a = core.createSourceFilter(universe, { yearMode: 'range', yearFrom: from, yearTo: to });
  const b = core.createSourceFilter(universe, { yearMode: 'range', yearFrom: to, yearTo: from });
  assert.equal(a.key, b.key);
  const records = allRecords(select(a));
  assert.ok(records.length > 0);
  assert.equal(records.filter(record => yearOf(record) < from || yearOf(record) > to).length, 0, '연도 범위 밖 0');
  assert.equal(total(core.countGrid(units, { sourceFilter: a })), universe.filter(record => yearOf(record) >= from && yearOf(record) <= to).length);
  // 연도를 알 수 없는 문항(9999)은 연도 조건을 켜면 빠진다.
  assert.equal(core.createSourceFilter(universe, { yearMode: 'range', yearFrom: 0, yearTo: 0 }).active, false, '시작·끝이 없는 직접 범위는 조건이 아니다');
});

test('시험(중간·기말)·학기 조건이 결과에 반영된다', () => {
  for (const [options, ok] of [
    [{ examType: 'mid' }, record => core.getExamType(record) === 'mid'],
    [{ examType: 'final' }, record => core.getExamType(record) === 'final'],
    [{ semester: '1' }, record => core.getSemester(record) === '1'],
    [{ semester: '2', examType: 'final' }, record => core.getSemester(record) === '2' && core.getExamType(record) === 'final']
  ]) {
    const filter = core.createSourceFilter(universe, options);
    const records = allRecords(select(filter));
    assert.ok(records.length > 0, JSON.stringify(options));
    assert.equal(records.filter(record => !ok(record)).length, 0, `${JSON.stringify(options)}: 조건 밖 문항 0`);
    assert.equal(records.length, universe.filter(ok).length, `${JSON.stringify(options)}: 조건에 맞는 문항이 모두 들어간다`);
  }
  const mid = core.createSourceFilter(universe, { examType: 'mid', semester: '1' });
  assert.match(select(mid).papers[0].title, /^1학기 중간고사 · /);
});

test('학교 2곳: 한 권으로 섞기는 합쳐지고, 학교별로 한 권씩은 학교마다 따로 권이 나온다', () => {
  const options = { schoolKeys: [first.key, second.key], yearMode: 'recent', yearCount: 3 };
  const mixed = select(core.createSourceFilter(universe, { ...options, group: 'mixed' }));
  const split = select(core.createSourceFilter(universe, { ...options, group: 'school' }));
  assert.equal(mixed.groupBy, 'mixed');
  assert.equal(split.groupBy, 'school');
  assert.equal(split.total, mixed.total, '묶는 방식과 관계없이 같은 문항');
  assert.deepEqual(new Set(allRecords(split).map(idOf)), new Set(allRecords(mixed).map(idOf)));
  // 섞기: 한 권에 두 학교가 함께 들어갈 수 있고 제목은 "A 외 1교".
  assert.match(mixed.papers[0].title, new RegExp(`^${[first.label, second.label].sort()[0]} 외 1교 · 최근 3년`));
  // 학교별: 권마다 학교가 하나이고 제목에 그 학교와 연도 범위가 있다. 두 학교 모두 권이 있다.
  for (const paper of split.papers) {
    const keys = new Set(paper.records.map(core.getSchoolKey));
    assert.equal(keys.size, 1, `${paper.title}: 학교별 권에 다른 학교 문항 0`);
    assert.ok(paper.title.startsWith(paper.school), paper.title);
    const years = paper.records.map(yearOf);
    const range = Math.min(...years) === Math.max(...years) ? String(years[0]) : `${Math.min(...years)}~${Math.max(...years)}`;
    assert.ok(paper.title.includes(` · ${range} · `), `${paper.title}: 연도 범위 ${range}`);
  }
  assert.deepEqual([...new Set(split.papers.map(paper => paper.schoolKey))].sort(), [first.key, second.key].sort());
  // 한 권은 최대 80문항, 번호는 학교 안에서 센다("1권/2권").
  assert.ok(split.papers.every(paper => paper.count <= 80));
  for (const school of [first, second]) {
    const own = split.papers.filter(paper => paper.schoolKey === school.key);
    own.forEach((paper, i) => { if (own.length > 1) assert.match(paper.title, new RegExp(`· ${i + 1}권/${own.length}권$`)); });
  }
  // 학교 1곳이면 묶기 선택이 있어도 그 학교 권이다(섞기와 같다).
  const one = select(core.createSourceFilter(universe, { schoolKeys: [first.key], group: 'school' }));
  assert.equal(one.groupBy, 'mixed');
});

test('학교별 권에서 칸마다 N문항은 학교마다 N문항이고, 같은 조건이면 같은 권 키·다른 조건이면 다른 권 키다', () => {
  const options = { schoolKeys: [first.key, second.key], yearMode: 'recent', yearCount: 3, group: 'school' };
  const perCell = select(core.createSourceFilter(universe, options), { perCell: 2 });
  for (const cell of perCell.cells) {
    const bySchool = new Map();
    perCell.papers.flatMap(paper => paper.records).filter(record => record.mappedUnitKey === cell.unitKey && core.getStepToken(record) === cell.step)
      .forEach(record => bySchool.set(core.getSchoolKey(record), (bySchool.get(core.getSchoolKey(record)) || 0) + 1));
    for (const count of bySchool.values()) assert.ok(count <= 2, `${cell.unitKey} ${cell.step}: 학교마다 2문항 이하`);
  }
  const again = select(core.createSourceFilter(universe, options), { perCell: 2 });
  assert.deepEqual(again.papers.map(paper => paper.snapshotKey), perCell.papers.map(paper => paper.snapshotKey));
  const keys = new Set(perCell.papers.map(paper => paper.snapshotKey));
  assert.equal(keys.size, perCell.papers.length, '권 키 중복 0');
  // 같은 문항이어도 조건(묶기)이 다르면 키가 다르다.
  const mixed = select(core.createSourceFilter(universe, { ...options, group: 'mixed' }), { perCell: 2 });
  assert.ok(mixed.papers.every(paper => !keys.has(paper.snapshotKey)), '섞기와 학교별은 키가 겹치지 않는다');
  // 연도 조건만 달라도(결과 문항이 같을 수 있어도) 키는 다르다.
  const r3 = select(core.createSourceFilter(universe, { schoolKeys: [first.key], yearMode: 'recent', yearCount: 3 }));
  const r5 = select(core.createSourceFilter(universe, { schoolKeys: [first.key], yearMode: 'recent', yearCount: 5 }));
  assert.equal(r3.papers.some(a => r5.papers.some(b => a.snapshotKey === b.snapshotKey)), false);
});

test('학교 고르기 목록: 그 학년에 기출이 있는 학교만, 문항 수와 함께, 문항이 많은 학교부터 나온다', () => {
  assert.ok(schoolRows.length >= 2);
  assert.ok(schoolRows.every((row, i) => i === 0 || schoolRows[i - 1].count >= row.count));
  assert.equal(schoolRows.reduce((sum, row) => sum + row.count, 0), universe.filter(record => core.getSchool(record)).length);
  const mid = core.getSourceSchoolOptions(universe, { examType: 'mid', schoolKeys: ['ignored'] });
  assert.equal(mid.reduce((sum, row) => sum + row.count, 0), universe.filter(record => core.getSchool(record) && core.getExamType(record) === 'mid').length, '학교 목록은 학교 조건을 뺀 나머지 조건으로 센다');
});

test('조건 계산은 화면 응답 시간(동기 500ms) 안에 끝난다', () => {
  const started = Date.now();
  const filter = core.createSourceFilter(universe, { schoolKeys: [first.key, second.key], yearMode: 'recent', yearCount: 5, group: 'school' });
  core.countGrid(units, { sourceFilter: filter });
  select(filter);
  core.getSourceSchoolOptions(universe, { yearMode: 'recent', yearCount: 3 });
  assert.ok(Date.now() - started < timeBudget(500), `${Date.now() - started}ms`);
});
