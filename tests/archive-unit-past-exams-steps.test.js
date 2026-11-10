const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveRoot = path.join(repoRoot, 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));

let seq = 0;
function rec(overrides = {}) {
  seq += 1;
  const year = overrides.examYear || 2025;
  return {
    sourceFile: `original/high/h2/1mid/${year}_${overrides.school || 'a'}_${seq}.js`,
    sourceOrdinal: 1,
    id: 1,
    grade: '고2',
    subject: '대수',
    course: '대수',
    standardUnitKey: 'H15-M1-01',
    standardUnit: '지수와 로그',
    level: '',
    question_uid: `uid-${seq}`,
    examYear: year,
    ...overrides
  };
}
function unitOf(records) {
  const catalog = core.buildCatalog(records, { profileId: 'h2' });
  return catalog.units.find(unit => unit.count);
}
const tokens = list => list.map(record => core.getStepToken(record));

test('숫자 단계는 숫자 difficultyBucket에서만 나오고 하/중/상 라벨은 단계로 바뀌지 않는다', () => {
  assert.equal(core.getDifficultyStep({ difficultyBucket: 3 }), 3);
  assert.equal(core.getDifficultyStep({ difficultyBucket: '5' }), 5);
  assert.equal(core.getDifficultyStep({ difficultyBucket: 0 }), null);
  assert.equal(core.getDifficultyStep({ difficultyBucket: 6 }), null);
  assert.equal(core.getDifficultyStep({ difficultyBucket: '중', level: '3' }), null);
  assert.equal(core.getDifficultyStep({ difficultyBucket: '', level: '상' }), null);
  assert.equal(core.getDifficultyStep({ difficultyBucket: 'UNKNOWN' }), null);
  assert.equal(core.getLegacyDifficultyLabel({ difficultyBucket: '하' }), '하');
  assert.equal(core.getLegacyDifficultyLabel({ difficultyBucket: '', level: '[상]' }), '상');
  assert.equal(core.getLegacyDifficultyLabel({ difficultyBucket: 'UNKNOWN', level: '중' }), '중');
  assert.equal(core.getLegacyDifficultyLabel({ difficultyBucket: '중상', level: '중상' }), '없음');
  assert.equal(core.getLegacyDifficultyLabel({ difficultyBucket: '', level: '' }), '없음');
});

test('분류된 문항은 숫자 단계와 기존 분류를 따로 보존한다', () => {
  const unit = unitOf([rec({ difficultyBucket: 4 }), rec({ difficultyBucket: '중' }), rec({ difficultyBucket: '', level: '' })]);
  const byToken = Object.fromEntries(unit.records.map(record => [core.getStepToken(record), record]));
  assert.equal(byToken['4'].difficultyStep, 4);
  assert.equal(byToken.none.difficultyStep, null);
  assert.deepEqual(unit.records.filter(r => core.getStepToken(r) === 'none').map(r => r.legacyDifficultyLabel).sort(), ['없음', '중']);
});

test('한 문제지 안은 1단계부터 단계 미지정까지 쉬운 순서로, 단계 안에서는 최신 연도 순서로 정리한다', () => {
  const input = [
    rec({ difficultyBucket: 5, examYear: 2025 }),
    rec({ difficultyBucket: '', level: '', examYear: 2025 }),
    rec({ difficultyBucket: 2, examYear: 2023 }),
    rec({ difficultyBucket: 2, examYear: 2025 }),
    rec({ difficultyBucket: 1, examYear: 2026 }),
    rec({ difficultyBucket: 2, examYear: 2024 }),
    rec({ difficultyBucket: '상', examYear: 2025 }),
    rec({ difficultyBucket: '하', examYear: 2023 }),
    rec({ difficultyBucket: '중', examYear: 2025 }),
    rec({ difficultyBucket: '중', examYear: 2025, level: '' }),
    rec({ difficultyBucket: 3, examYear: 2025 })
  ];
  const unit = unitOf(input);
  assert.equal(unit.papers.length, 1);
  const ordered = unit.papers[0].records;
  assert.equal(ordered.length, input.length, '단계 미지정 문항도 제외하지 않는다');
  assert.deepEqual(tokens(ordered), ['1', '2', '2', '2', '3', '5', 'none', 'none', 'none', 'none', 'none']);
  assert.deepEqual(ordered.slice(6).map(r => r.legacyDifficultyLabel), ['하', '중', '중', '상', '없음']);
  assert.deepEqual(ordered.slice(1, 4).map(core.getExamYear), [2025, 2024, 2023]);
  assert.equal(core.getExamYear(ordered[0]), 2026);
});

test('2026년이 같은 단계에서 2025년보다 먼저이고, 연도 미상은 마지막이다', () => {
  const unit = unitOf([
    rec({ difficultyBucket: 3, examYear: 2026 }),
    rec({ difficultyBucket: 3, examYear: 2024 }),
    rec({ difficultyBucket: 3, examYear: 2025 }),
    rec({ difficultyBucket: 3, examYear: 2022 }),
    rec({ difficultyBucket: 3, examYear: 0, sourceFile: 'original/high/h2/1mid/unknown_school.js' })
  ]);
  const years = unit.papers[0].records.map(core.getExamYear);
  assert.deepEqual(years.slice(0, 4), [2026, 2025, 2024, 2022]);
  assert.equal(core.recencyRankOf(unit.papers[0].records[4]) > core.recencyRankOf(unit.papers[0].records[3]), true, 'unknown year is last');
});

test('여러 단계를 골라도 문제지 1에는 가장 최신 연도 문항이 들어가고, 한 문제지 안은 단계 오름차순이다', () => {
  const input = [];
  // Old exams hold the EASY step, the newest exam holds the HARD step: the old step-first order
  // would have put the 2020 step-1 exams in paper 1 and pushed the 2026 step-5 exam to the end.
  for (const [year, step] of [[2020, 1], [2021, 1], [2022, 2], [2023, 2], [2024, 3], [2025, 4], [2026, 5]])
    for (let n = 0; n < 30; n += 1)
      input.push(rec({ difficultyBucket: step, examYear: year, school: `y${year}`, sourceFile: `original/high/h2/1mid/${year}_y.js`, id: n + 1, sourceOrdinal: n + 1 }));
  const unit = unitOf(input);
  const papers = core.buildUnitPapers(unit, { difficultySteps: ['1', '2', '3', '4', '5'] });
  assert.ok(papers.length >= 3);
  assert.equal(papers.reduce((sum, p) => sum + p.count, 0), input.length);
  assert.equal(Math.max(...papers[0].records.map(core.getExamYear)), 2026, 'paper 1 holds the newest year');
  assert.equal(papers[0].records.some(r => core.getExamYear(r) === 2020), false, 'the oldest exams are not in paper 1');
  // Papers run from newer to older exams (the newest year of paper N+1 is not newer than paper N's oldest).
  for (let i = 1; i < papers.length; i += 1) {
    const prevOldest = Math.min(...papers[i - 1].records.map(core.getExamYear));
    const newest = Math.max(...papers[i].records.map(core.getExamYear));
    assert.ok(newest <= prevOldest, `paper ${i + 1} is not newer than paper ${i}`);
  }
  // Inside every paper the steps ascend and the headings follow the steps of that paper.
  for (const paper of papers) {
    const order = tokens(paper.records).map(Number);
    assert.deepEqual(order, [...order].sort((a, b) => a - b));
    const headings = paper.sections.filter(section => section.level === 1).map(section => section.title);
    assert.equal(new Set(headings).size, headings.length, 'one heading per step');
  }
});

test('단계 선택은 선택한 단계만으로 문제지를 다시 만들고 제목에 단계를 표시한다', () => {
  const input = [1, 1, 2, 3, 4, 5, 5].map(step => rec({ difficultyBucket: step }));
  input.push(rec({ difficultyBucket: '하' }), rec({ difficultyBucket: '' }));
  const unit = unitOf(input);
  const low = core.buildUnitPapers(unit, { difficultySteps: ['1', '2'] });
  assert.equal(low.length, 1);
  assert.deepEqual(tokens(low[0].records), ['1', '1', '2']);
  assert.equal(low[0].title, `${unit.name} · 1·2단계`);
  assert.equal(low[0].count, 3);
  const high = core.buildUnitPapers(unit, { difficultySteps: ['5', 'none'] });
  assert.deepEqual(tokens(high[0].records), ['5', '5', 'none', 'none']);
  assert.match(high[0].title, /5단계 · 단계 미지정$/);
  const all = core.buildUnitPapers(unit, {});
  assert.equal(all[0].count, input.length);
  assert.equal(all[0].title, unit.name, '전체 단계의 제목은 기존 형식을 유지한다');
  assert.deepEqual(core.buildUnitPapers(unit, { difficultySteps: ['1', '2', '3', '4', '5', 'none'] }).map(p => p.snapshotKey), all.map(p => p.snapshotKey));
  assert.notEqual(low[0].snapshotKey, all[0].snapshotKey);
  assert.equal(core.buildUnitPapers(unit, { difficultySteps: ['5'] })[0].count, 2);
});

test('문제지 크기 규칙은 유지된다(목표 50문항, 최대 80문항, 한 시험지는 함께)', () => {
  const input = [];
  for (let exam = 0; exam < 14; exam += 1) {
    for (let n = 0; n < 12; n += 1) input.push(rec({ difficultyBucket: (exam % 5) + 1, school: `s${exam}`, sourceFile: `original/high/h2/1mid/2025_s${exam}.js`, id: n + 1, sourceOrdinal: n + 1 }));
  }
  const unit = unitOf(input);
  const papers = unit.papers;
  assert.ok(papers.length >= 3);
  assert.equal(papers.reduce((sum, p) => sum + p.count, 0), input.length);
  for (const paper of papers) {
    assert.ok(paper.count <= 80);
    assert.equal(paper.count, paper.records.length);
  }
  // Steps never go backwards inside one paper.
  for (const paper of papers) {
    const flat = tokens(paper.records).map(Number);
    assert.deepEqual(flat, [...flat].sort((a, b) => a - b));
  }
  // One exam stays together inside a paper whenever it fits.
  for (const paper of papers) {
    const files = new Map();
    paper.records.forEach(r => files.set(r.sourceFile, (files.get(r.sourceFile) || 0) + 1));
    assert.ok([...files.values()].every(n => n <= 12));
  }
});

test('섹션 제목은 단계마다 첫 문항 앞에 붙고 단계 미지정 안에서는 기존 분류가 하-중-상-없음 순서로 묶인다', () => {
  const unit = unitOf([
    rec({ difficultyBucket: 1 }), rec({ difficultyBucket: 1 }), rec({ difficultyBucket: 3 }),
    rec({ difficultyBucket: '하' }), rec({ difficultyBucket: '하' }), rec({ difficultyBucket: '상' }), rec({ difficultyBucket: '' })
  ]);
  const paper = unit.papers[0];
  assert.deepEqual(paper.sections.map(s => [s.at, s.title, s.level]), [
    [0, '1단계', 1], [2, '3단계', 1], [3, '단계 미지정', 1], [3, '기존 분류: 하', 2], [5, '기존 분류: 상', 2], [6, '기존 분류: 없음', 2]
  ]);
  assert.ok(paper.sections.every(s => s.uid && s.uid === core.getQuestionUid(paper.records[s.at])));
  assert.deepEqual(core.buildStepSections([]), []);
});

test('단계 선택 정규화와 집계(하위 기존 분류 포함)', () => {
  assert.deepEqual(core.normalizeStepSelection('2,1,x,2'), ['1', '2']);
  assert.deepEqual(core.normalizeStepSelection(['none', '5']), ['5', 'none']);
  assert.deepEqual(core.normalizeStepSelection(['1', '2', '3', '4', '5', 'none']), []);
  assert.deepEqual(core.normalizeStepSelection(null), []);
  const unit = unitOf([
    rec({ difficultyBucket: 2 }), rec({ difficultyBucket: 2 }), rec({ difficultyBucket: '하' }), rec({ difficultyBucket: '중' }),
    rec({ difficultyBucket: '' }), rec({ difficultyBucket: 'UNKNOWN', level: '상' })
  ]);
  const summary = unit.stepSummary;
  assert.equal(summary.total, unit.selectableCount);
  assert.deepEqual(summary.steps, { 1: 0, 2: 2, 3: 0, 4: 0, 5: 0, none: 4 });
  assert.deepEqual(summary.legacy, { 하: 1, 중: 1, 상: 1, 없음: 1 });
});

test('선택 불가(원본 확인 실패) 문항만 제외하고 단계 미지정은 제외하지 않는다', () => {
  const unit = unitOf([rec({ difficultyBucket: 2 }), rec({ difficultyBucket: '' }), rec({ difficultyBucket: 2, generalUseEligible: false })]);
  assert.equal(unit.selectableCount, 2);
  assert.equal(core.buildUnitPapers(unit, {}).reduce((sum, p) => sum + p.count, 0), 2);
});

test('출력 포장(envelope)은 선택 필드 meta.sections를 그대로 전달하고 구형 소비자는 무시한다', async () => {
  const contract = require(path.join(archiveRoot, 'archive2-output-contract.js'));
  const questions = [{ questionUid: 'u1' }, { questionUid: 'u2' }];
  const base = { sourceKind: 'unit-past', sourceId: 's', mode: 'exam', questionCount: 2, questionUids: ['u1', 'u2'], questions };
  const withSections = await contract.createOutputEnvelope({ ...base, meta: { title: 't', sections: [{ at: 0, uid: 'u1', title: '1단계', level: 1 }] } });
  assert.equal(await contract.validateOutputEnvelope(withSections), true);
  assert.equal(withSections.meta.sections[0].title, '1단계');
  const without = await contract.createOutputEnvelope({ ...base, meta: { title: 't' } });
  assert.equal(await contract.validateOutputEnvelope(without), true);
  assert.equal('sections' in without.meta, false);
});

function fakeDocument() {
  const make = () => ({
    className: '', dataset: {}, style: { setProperty() {} }, children: [], innerHTML: '',
    classList: { items: new Set(), add(c) { this.items.add(c); }, contains(c) { return this.items.has(c); } },
    setAttribute() {}, appendChild(child) { this.children.push(child); return child; }
  });
  return { createElement: make };
}

test('정답표 렌더러는 섹션 제목 함수가 없으면 기존 DOM과 같고 있으면 첫 칸에만 제목을 넣는다', () => {
  const executor = require(path.join(archiveRoot, 'answer-render-executor.js'));
  const run = extraDeps => {
    const pages = [];
    const document = fakeDocument();
    executor.render({
      area: {}, data: [{ answer: '1' }, { answer: '2' }, { answer: '3' }], perPage: 40,
      deps: {
        document, makePage: () => { const page = { body: document.createElement('div') }; pages.push(page); return page; },
        getArchiveQuestionSourceRef: () => 'ref', formatGridAnswer: value => String(value), ...extraDeps
      }
    });
    return pages[0].body.children[0].children.filter(cell => !cell.classList.contains('ans-cell-empty'));
  };
  const plain = run({});
  assert.deepEqual(plain.map(cell => cell.innerHTML), [1, 2, 3].map(n => `<div class="ans-n">${n}.</div><div class="ans-v">${n}</div>`));
  assert.ok(plain.every(cell => !cell.innerHTML.includes('ans-sec') && !cell.classList.contains('ans-cell-section')));
  const headed = run({ getSectionHeadingHtml: (q, index, kind) => (index === 1 ? `<div class="ans-sec">H${kind}</div>` : '') });
  const withHeading = headed.filter(cell => cell.innerHTML.includes('ans-sec'));
  assert.equal(withHeading.length, 1);
  assert.ok(withHeading[0].classList.contains('ans-cell-section'));
  assert.ok(withHeading[0].innerHTML.includes('Hcell') && withHeading[0].innerHTML.includes('2.'));
});

test('mixed_engine과 시험·해설 렌더러가 같은 섹션 제목 계약을 쓴다', () => {
  const mixed = fs.readFileSync(path.join(archiveRoot, 'mixed_engine.html'), 'utf8');
  assert.match(mixed, /AppState\.meta && AppState\.meta\.sections/);
  assert.match(mixed, /getSectionHeadingHtml: getMixedSectionHeadingHtml/);
  assert.match(mixed, /\$\{getMixedSectionHeadingHtml\(q, i, 'box'\)\}<div class="q-num">/);
  assert.match(mixed, /getMixedSectionHeadingHtml\(chunk\[idx\], start \+ idx, 'cell'\)/);
  for (const file of ['exam-render-executor.js', 'solution-render-executor.js']) {
    const source = fs.readFileSync(path.join(archiveRoot, file), 'utf8');
    assert.match(source, /typeof deps\.getSectionHeadingHtml === 'function' \? deps\.getSectionHeadingHtml\(q, i, 'box'\) : ''/, file);
    assert.match(source, /\$\{sectionHtml\}<div class="q-num">/, file);
  }
  const unitPage = fs.readFileSync(path.join(archiveRoot, 'unit-past-exams.js'), 'utf8');
  assert.match(unitPage, /meta\.sections = core\.buildStepSections\(paper\.records\)/);
  assert.match(unitPage, /name="unit-step"/);
});

test('실제 아카이브: 고1 공통수학2 함수의 단계별 개수와 기존 분류 개수가 선택 가능 문항과 일치한다', () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'question-index.js'), 'utf8'), context);
  const index = context.window.questionIndex;
  const meta = JSON.parse(fs.readFileSync(path.join(archiveRoot, 'data', 'question_metadata.json'), 'utf8'));
  const bySource = new Map(meta.records.map(m => [`${m.sourceArchiveFile}#${m.sourceOrdinal}`, m]));
  const joined = index.map(record => {
    const m = bySource.get(`${record.sourceFile}#${record.sourceOrdinal}`);
    return m ? { ...record, difficultyBucket: m.difficultyBucket || record.difficultyBucket || '' } : record;
  });
  const catalog = core.buildCatalog(joined, { profileId: 'h1' });
  const unit = catalog.units.find(item => item.key === 'H22-C2-07');
  assert.ok(unit && unit.selectableCount > 100);
  const summary = unit.stepSummary;
  assert.equal(summary.total, unit.selectableCount);
  assert.equal(Object.values(summary.legacy).reduce((a, b) => a + b, 0), summary.steps.none);
  assert.equal(unit.papers.reduce((sum, p) => sum + p.count, 0), unit.selectableCount);
  for (const paper of unit.papers) {
    const order = tokens(paper.records).map(t => (t === 'none' ? 6 : Number(t)));
    assert.deepEqual(order, [...order].sort((a, b) => a - b));
  }
  const firstYears = unit.papers.map(p => Math.max(...p.records.map(r => core.recencyRankOf(r) * -1)));
  assert.deepEqual(firstYears, [...firstYears].sort((a, b) => b - a), '문제지는 최신 연도부터 이어진다');
  const low = core.buildUnitPapers(unit, { difficultySteps: ['1', '2'] });
  assert.equal(low.reduce((sum, p) => sum + p.count, 0), summary.steps[1] + summary.steps[2]);
  assert.ok(low.every(p => tokens(p.records).every(t => t === '1' || t === '2')));
});
