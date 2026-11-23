'use strict';
// 원장님 지시(2026-11-23): 화면 어디서도 "기출c"가 보이지 않고 "기출"로 보인다. 파일 이름·카탈로그 값은 그대로 두고 보이는 글자만 바꾼다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { displaySubjectOf, displaySubjectOfExam, withoutContentMark, readableExamTitle } = require('../archive/exam-display-title.js');

const root = path.resolve(__dirname, '..');
const MARK = /기출[\s_]*c(?![a-z])|(^|[\s_])c($|[\s_])/i;

test('"기출c"·"기출C"·"기출_c"는 "기출"과 같은 취급이다', () => {
  const plain = displaySubjectOf('기출');
  assert.equal(plain, '기출');
  for (const raw of ['기출c', '기출C', '기출_c', '기출_C', '기출 c', '기출_content', 'c', 'C']) {
    assert.equal(displaySubjectOf(raw), plain, raw);
  }
  // 과목이 아니라 자료 표시이므로, 표준 과목을 알면 그것이 보인다(`_기출.js` 파일이 과목을 보이는 것과 같다).
  for (const raw of ['기출', '기출c', '기출C', '기출_c', 'c']) {
    assert.equal(displaySubjectOf(raw, { fallback: '공통수학1' }), '공통수학1', raw);
  }
});

test('실제 과목 이름은 건드리지 않고 꼬리 c만 걷는다', () => {
  for (const same of ['공통수학1', '수학(상)', '수학I', '미적분', '확률과 통계', '중3 수학', '']) assert.equal(displaySubjectOf(same), same);
  assert.equal(displaySubjectOf('대수c'), '대수');
  assert.equal(displaySubjectOf('수학c'), '수학');
  assert.equal(withoutContentMark('22 신흥중 1학기 기말 중3 기출c'), '22 신흥중 1학기 기말 중3 기출');
  assert.equal(displaySubjectOf(null, { fallback: '수학' }), '수학');
});

test('제목에서도 대소문자 변형 표시가 빠진다', () => {
  assert.equal(readableExamTitle('25_강남여고_1학기_기말_고1_기출C'), readableExamTitle('25_강남여고_1학기_기말_고1_기출'));
  assert.equal(readableExamTitle('26_금당고_1학기_중간_고1_기출_C'), readableExamTitle('26_금당고_1학기_중간_고1_기출'));
});

test('카탈로그의 모든 시험: 보이는 과목·제목에 "기출c"가 남지 않는다', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8'));
  const leftovers = [];
  let empty = 0;
  for (const exam of catalog.exams) {
    const subject = displaySubjectOfExam(exam);
    const title = readableExamTitle(path.basename(exam.file, '.js'));
    if (!subject) empty += 1;
    if (MARK.test(subject) || MARK.test(title)) leftovers.push(`${exam.file} -> ${subject} | ${title}`);
  }
  assert.deepEqual(leftovers, []);
  assert.equal(empty, 0, '과목 칸이 비어 보이는 시험이 없다');
});

test('화면 코드는 같은 함수를 거친다(화면마다 따로 replace하지 않는다)', () => {
  const sites = {
    'archive/archive2-workspace-core.js': 'displaySubjectOfExam',
    'archive/archive2-entry.js': 'displaySubjectOfExam',
    'archive/archive2-assign.js': 'displaySubjectOf',
    'archive/archive2-workspace-find.js': 'displaySubjectOfExam',
    'archive/archive2-library.js': 'displaySubjectOf',
    'archive/archive2-workspace-recent.js': 'displaySubjectOf',
    'archive/index.html': 'displaySubjectOfExam',
    'archive/mixer.html': 'displaySubjectOfExam',
    'archive/assessment/assessment-analysis.html': 'withoutContentMark',
  };
  for (const [file, name] of Object.entries(sites)) {
    assert.ok(fs.readFileSync(path.join(root, file), 'utf8').includes(`ExamDisplayTitle?.${name}`), `${file} uses ${name}`);
  }
});

test('고르는 값·검색 색인은 그대로다: 카탈로그 subject와 파일 이름은 바뀌지 않는다', () => {
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/archive2-catalog.json'), 'utf8'));
  const marked = catalog.exams.filter((exam) => /기출_?c\.js$/i.test(exam.file));
  assert.ok(marked.length > 0);
  assert.ok(marked.some((exam) => /기출c/i.test(exam.subject) || exam.subject === 'c'), '내부 값은 그대로 남아 검색·식별에 쓰인다');
});
