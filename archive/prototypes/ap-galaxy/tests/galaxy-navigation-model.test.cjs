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
    '대수', '기하', '기하와벡터', '미적분I', '미적분II', '확률과 통계',
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

test('2015 and 2022 versions of the same course share one galaxy and one filter identity', () => {
  const paired = [
    { grade: '고2', subject: '수학Ⅰ', primaryStandardCourse: '수학Ⅰ', file: 'old-algebra.js', curriculum: '2015' },
    { grade: '고2', subject: '대수', primaryStandardCourse: '대수', file: 'new-algebra.js', curriculum: '2022' },
    { grade: '고2', subject: '수학II', file: 'old-calculus-one.js', curriculum: '2015' },
    { grade: '고2', subject: '미적분Ⅰ', file: 'new-calculus-one.js', curriculum: '2022' },
    { grade: '고2', subject: '미적분', file: 'old-calculus-two.js', curriculum: '2015' },
    { grade: '고2', subject: '미적분II', file: 'new-calculus-two.js', curriculum: '2022' },
    { grade: '고2', subject: '확률과통계', file: 'old-probability.js', curriculum: '2015' },
    { grade: '고2', subject: '확률과 통계', file: 'new-probability.js', curriculum: '2022' },
  ];
  const original = JSON.stringify(paired);
  const identities = paired.map((exam) => model.curriculumGroupForExam(exam).id);
  assert.deepEqual(identities, [
    'curriculum:high:대수', 'curriculum:high:대수',
    'curriculum:high:미적분I', 'curriculum:high:미적분I',
    'curriculum:high:미적분II', 'curriculum:high:미적분II',
    'curriculum:high:확률과 통계', 'curriculum:high:확률과 통계',
  ]);
  const categories = model.buildNavigationSections(paired)[2].items;
  assert.deepEqual(categories.map(({ name, count }) => [name, count]), [
    ['대수', 2], ['미적분I', 2], ['미적분II', 2], ['확률과 통계', 2],
  ]);
  assert.equal(JSON.stringify(paired), original, 'source curriculum metadata and original exams must remain unchanged');
});

test('subject facet uses identical curriculum aliases as galaxy grouping', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const app = fs.readFileSync(path.join(__dirname, '..', 'orbit-app.js'), 'utf8');
  assert.match(app, /const subjectFacetValue = \(exam\) => \{/);
  assert.match(app, /galaxyNavigation\.displayCourseName\(sourceCourse\)/);
  assert.match(app, /subjectFacetValue\(exam\) !== filters\.subject/);
});
