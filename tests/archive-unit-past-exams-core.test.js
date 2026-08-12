const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const repoRoot = path.resolve(__dirname, '..');
const archiveRoot = path.join(repoRoot, 'archive');
const core = require(path.join(archiveRoot, 'unit-past-exams-core.js'));

function loadQuestionIndex() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(archiveRoot, 'question-index.js'), 'utf8'), context);
  return context.window.questionIndex;
}

function loadExam(sourceFile) {
  const context = { window: {}, console };
  const filename = path.join(archiveRoot, 'exams', sourceFile);
  vm.runInNewContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  return context.window.questions || context.window.questionBank;
}

test('고2 단원별 기출은 요청한 세 과목만 2022 개정 표시 단원으로 합산한다', () => {
  const catalog = core.buildCatalog(loadQuestionIndex(), { profileId: 'h2' });
  const byCourse = Object.fromEntries(core.PROFILES.h2.courses.map(course => [
    course,
    catalog.units.filter(unit => unit.course === course).reduce((sum, unit) => sum + unit.count, 0)
  ]));

  assert.equal(catalog.scannedCount, 1626);
  assert.equal(catalog.classifiedCount, 1564);
  assert.equal(catalog.review.length, 0);
  assert.equal(catalog.invalid.length, 0);
  assert.equal(catalog.ignored.length, 62);
  assert.deepEqual(byCourse, { '대수': 474, '미적분Ⅰ': 385, '확률과 통계': 705 });
  assert.equal(catalog.units.length, 23);
  assert.ok(catalog.units.every(unit => unit.records.length === unit.count));
  assert.ok(catalog.units.flatMap(unit => unit.papers).every(paper => paper.count <= 80));
});

test('고2 단원별 기출의 모든 문항 JS와 이미지 에셋을 복원할 수 있다', () => {
  const catalog = core.buildCatalog(loadQuestionIndex(), { profileId: 'h2' });
  const records = catalog.units.flatMap(unit => unit.records);
  const byFile = Object.groupBy(records, record => record.sourceFile);
  let imageCount = 0;

  for (const [sourceFile, fileRecords] of Object.entries(byFile)) {
    const questions = loadExam(sourceFile);
    assert.ok(Array.isArray(questions), `${sourceFile}: 문항 배열 없음`);
    for (const record of fileRecords) {
      const question = questions.find(item => Number(item.id) === Number(record.sourceQuestionNo));
      assert.ok(question, `${sourceFile}#${record.sourceQuestionNo}: 원본 문항 없음`);
      for (const field of ['image', 'solutionImage']) {
        const assetPath = question[field];
        if (!assetPath || /^(?:data:|https?:|blob:)/i.test(assetPath)) continue;
        imageCount += 1;
        const absolutePath = path.join(archiveRoot, String(assetPath).replace(/^archive[\\/]/, ''));
        assert.ok(fs.existsSync(absolutePath), `${sourceFile}#${record.sourceQuestionNo}: ${field} 누락 (${assetPath})`);
      }
    }
  }

  assert.equal(Object.keys(byFile).length, 70);
  assert.equal(records.length, 1564);
  assert.equal(imageCount, 194);
});

test('문제지는 원본 시험지 묶음을 가능한 한 유지하고 80문항을 넘지 않는다', () => {
  const records = [
    ...Array.from({ length: 30 }, (_, index) => ({ sourceFile: 'original/high/h2/1mid/24_A.js', id: index + 1 })),
    ...Array.from({ length: 25 }, (_, index) => ({ sourceFile: 'original/high/h2/1mid/24_B.js', id: index + 1 })),
    ...Array.from({ length: 40 }, (_, index) => ({ sourceFile: 'original/high/h2/1final/24_C.js', id: index + 1 }))
  ];
  const papers = core.splitIntoPapers(records, { target: 50, max: 80 });
  assert.deepEqual(papers.map(paper => paper.length), [55, 40]);
  assert.ok(papers.every(paper => paper.length <= 80));
});

test('중1·중2·중3 기출을 학년별 표시 단원으로 빠짐없이 합산한다', () => {
  const index = loadQuestionIndex();
  const expected = {
    m1: { questions: 737, units: 9 },
    m2: { questions: 1450, units: 9 },
    m3: { questions: 1617, units: 7 }
  };

  for (const [profileId, value] of Object.entries(expected)) {
    const catalog = core.buildCatalog(index, { profileId });
    assert.equal(catalog.scannedCount, value.questions, profileId);
    assert.equal(catalog.classifiedCount, value.questions, profileId);
    assert.equal(catalog.review.length, 0, profileId);
    assert.equal(catalog.invalid.length, 0, profileId);
    assert.equal(catalog.units.length, value.units, profileId);
    assert.ok(catalog.units.every(unit => unit.count > 0), profileId);
    assert.ok(catalog.units.flatMap(unit => unit.papers).every(paper => paper.count <= 80), profileId);
  }
});

test('중등 단원별 기출의 모든 원본 JS와 이미지 에셋을 복원할 수 있다', () => {
  const index = loadQuestionIndex();
  const records = ['m1', 'm2', 'm3'].flatMap(profileId =>
    core.buildCatalog(index, { profileId }).units.flatMap(unit => unit.records)
  );
  const byFile = Object.groupBy(records, record => record.sourceFile);
  let imageCount = 0;

  for (const [sourceFile, fileRecords] of Object.entries(byFile)) {
    const questions = loadExam(sourceFile);
    assert.ok(Array.isArray(questions), `${sourceFile}: 문항 배열 없음`);
    for (const record of fileRecords) {
      const question = questions.find(item => Number(item.id) === Number(record.sourceQuestionNo));
      assert.ok(question, `${sourceFile}#${record.sourceQuestionNo}: 원본 문항 없음`);
      for (const field of ['image', 'solutionImage']) {
        const assetPath = question[field];
        if (!assetPath || /^(?:data:|https?:|blob:)/i.test(assetPath)) continue;
        imageCount += 1;
        const absolutePath = path.join(archiveRoot, String(assetPath).replace(/^archive[\\/]/, ''));
        assert.ok(fs.existsSync(absolutePath), `${sourceFile}#${record.sourceQuestionNo}: ${field} 누락 (${assetPath})`);
      }
    }
  }

  assert.equal(records.length, 3804);
  assert.equal(Object.keys(byFile).length, 160);
  assert.equal(imageCount, 1220);
});
