const assert = require('node:assert/strict');
const test = require('node:test');
const catalog = require('../../../data/archive2-catalog.json');
const model = require('../galaxy-navigation-model.js');

const exams = catalog.exams.filter((exam) => exam.file && exam.contentType === '기출');

test('navigation includes the three middle grades and one shared common-math target per semester alias', () => {
  const fakeExams = [
    { grade: '중1', subject: '수학', file: 'middle-1.js' },
    { grade: '중2', subject: '수학', file: 'middle-2.js' },
    { grade: '중3', subject: '수학', file: 'middle-3.js' },
    { grade: '고1', subject: '수학(상)', primaryStandardCourse: '수학(상)', file: 'legacy-upper.js' },
    { grade: '고1', subject: '수학하', primaryStandardCourse: '수학하', file: 'legacy-lower.js' },
    { grade: '고2', subject: '수학', primaryStandardCourse: '공통수학1', file: 'common-one.js' },
    { grade: '고2', subject: '대수c', primaryStandardCourse: '', courseRanges: [{ standardCourse: '공통수학1' }], file: 'common-one-alias.js' },
  ];
  const before = JSON.stringify(fakeExams);
  const sections = model.buildNavigationSections(fakeExams);
  assert.deepEqual(sections.map((section) => section.id), ['middle', 'common', 'high2']);
  assert.deepEqual(sections[0].items.map(({ name }) => name), ['중1', '중2', '중3']);
  assert.deepEqual(sections[1].items.map(({ name, count }) => [name, count]), [['공통수학1', 3], ['공통수학2', 1]]);
  assert.equal(sections[2].items.length, 0);
  assert.equal(JSON.stringify(fakeExams), before, 'group aliases must not rewrite source exam data');
});

test('high-two navigation uses current catalog course labels without duplicate aliases', () => {
  const sections = model.buildNavigationSections(exams);
  const labels = sections[2].items.map(({ name }) => name);
  assert.deepEqual(new Set(labels), new Set([
    '대수', '기하와벡터', '미적분I', '미적분II', '확률과 통계',
  ]));
  assert.equal(new Set(labels).size, labels.length, 'a course should appear only once in the navigation');
  assert.equal(sections[1].items.length, 2, 'common courses are shared navigation targets, not repeated in high-two');
  assert.ok(sections[1].items.every(({ count }) => count > 0));
});

test('legacy math upper/lower labels resolve to common-math galaxies while preserving source fields', () => {
  const upper = { grade: '고1', subject: '수학(상)', primaryStandardCourse: '수학(상)', semester: '1', file: 'upper.js' };
  const lower = { grade: '고1', subject: '공통수학2', primaryStandardCourse: '수학(하)', semester: '2', file: 'lower.js' };
  const before = JSON.stringify([upper, lower]);
  assert.equal(model.curriculumGroupForExam(upper).id, 'curriculum:high:공통수학1');
  assert.equal(model.curriculumGroupForExam(lower).id, 'curriculum:high:공통수학2');
  assert.equal(JSON.stringify([upper, lower]), before);
});


test('2015 and 2022 course names join the same galaxy, subject facet and counts', () => {
  const pairs = [
    ['수학(상)', '공통수학1'],
    ['수학(하)', '공통수학2'],
    ['수학Ⅰ', '대수'],
    ['수학Ⅱ', '미적분Ⅰ'],
    ['미적분', '미적분Ⅱ'],
    ['기하와벡터', '기하'],
    ['확률과통계', '확률과 통계'],
  ];
  const input = pairs.flatMap(([legacy, modern], i) => [
    { file: 'old-' + i, grade: '고2', subject: legacy, primaryStandardCourse: legacy, curriculum: '2015' },
    { file: 'new-' + i, grade: '고2', subject: modern, primaryStandardCourse: modern, curriculum: '2022' },
  ]);
  const before = JSON.stringify(input);
  for (const [legacy, modern] of pairs) {
    assert.equal(model.displayCourseName(legacy), model.displayCourseName(modern));
  }
  const grouped = new Map();
  for (const exam of input) {
    const group = model.curriculumGroupForExam(exam);
    grouped.set(group.id, (grouped.get(group.id) || 0) + 1);
  }
  assert.equal(grouped.size, pairs.length);
  assert.ok([...grouped.values()].every((count) => count === 2));
  const sections = model.buildNavigationSections(input);
  assert.ok(sections[1].items.every(({count}) => count === 2));
  assert.equal(JSON.stringify(input), before, 'source curriculum and course labels are retained');
  assert.equal(model.displayCourseName('기하와 벡터'), '기하와벡터');
  assert.equal(model.curriculumGroupForExam({ grade: '고2', subject: '기하' }).id, 'curriculum:high:기하와벡터');
});

test('subject facet and curriculum grouping use the exact same canonical course label', () => {
  const fs = require('node:fs');
  const app = fs.readFileSync(require('node:path').join(__dirname, '../orbit-app.js'), 'utf8');
  const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
  assert.match(app, /const subjectFacetValue = \(exam\) => \{[\s\S]*?galaxyNavigation\.displayCourseName\(sourceCourse\)/);
  assert.match(html, /galaxy-navigation-model\.js\?v=20261016-all-galaxy-visuals-5b-geometry-year/);
  assert.match(html, /orbit-app\.js\?v=20261016-all-galaxy-visuals-5b-geometry-year/);
});

test('2015 and 2022 year annotations are provenance rather than new galaxy boundaries', () => {
  const pairs = [
    ['2015 개정 수학Ⅰ', '대수 (2022 개정)'],
    ['2015 개정 수학Ⅱ', '2022 개정 미적분Ⅰ'],
    ['미적분 (2015 개정)', '2022 개정 미적분Ⅱ'],
    ['2015 개정 교육과정 수학(상)', '2022 개정 공통수학1'],
    ['확률과통계 (2015 개정)', '2022 개정 확률과 통계'],
    ['기하와 벡터 (2015 개정)', '2022 개정 기하'],
  ];
  const records = pairs.flatMap(([legacy, modern], i) => [
    { grade: '고2', subject: legacy, curriculumYear: 2015, file: 'legacy-' + i },
    { grade: '고2', subject: modern, curriculumYear: 2022, file: 'modern-' + i },
  ]);
  const before = JSON.stringify(records);
  for (const [legacy, modern] of pairs) {
    assert.equal(model.displayCourseName(legacy), model.displayCourseName(modern), legacy + ' vs ' + modern);
    assert.equal(
      model.curriculumGroupForExam({grade:'고2',subject:legacy}).id,
      model.curriculumGroupForExam({grade:'고2',subject:modern}).id
    );
  }
  assert.equal(new Set(records.map(exam=>model.curriculumGroupForExam(exam).id)).size, pairs.length);
  assert.equal(JSON.stringify(records),before,'source metadata must not be overwritten');
  assert.notEqual(model.displayCourseName('미적분Ⅰ'),model.displayCourseName('미적분Ⅱ'));
});
