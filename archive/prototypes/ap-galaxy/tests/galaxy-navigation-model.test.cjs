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
    '대수', '기하', '기하와벡터', '미적분', '미적분I', '수학I', '수학II', '확률과 통계',
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
