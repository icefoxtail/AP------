import assert from 'node:assert/strict';

// C-2: buildReportExamCohortStats의 cohort identity/grade semantics와
// report_exam_cohort_stats batching contract를 mock D1으로 검증한다.

const { buildReportExamCohortStats } = await import('../apmath/worker-backup/worker/index.js');

function makeMockD1(cohortResults, wrongResults = []) {
  const prepared = [];
  const bound = [];
  const env = {
    DB: {
      prepare(sql) {
        prepared.push(sql);
        const all = async () => {
          if (/FROM exam_sessions/.test(sql)) return { results: cohortResults };
          if (/FROM wrong_answers/.test(sql)) return { results: wrongResults };
          return { results: [] };
        };
        return {
          all,
          bind(...values) {
            bound.push({ sql, values });
            return { all };
          }
        };
      }
    }
  };
  return { env, prepared, bound };
}

const cohortRows = [
  { id: 'e1', score: '82', question_count: 20, archive_file: 'exam-a.js', exam_title: '중간고사', exam_date: '2026-06-30', student_grade: '중3', class_grade: null },
  { id: 'e2', score: '90', question_count: 20, archive_file: 'exam-a.js', exam_title: '중간고사', exam_date: '2026-06-30', student_grade: '중3', class_grade: null },
  { id: 'e3', score: '74', question_count: 20, archive_file: 'exam-a.js', exam_title: '중간고사', exam_date: '2026-06-30', student_grade: null, class_grade: '중3' },
  { id: 'e4', score: '82', question_count: 20, archive_file: '', exam_title: '중간고사', exam_date: '6/30', student_grade: '중3', class_grade: null }
];
const wrongRows = [
  { session_id: 'e1', question_id: 3 },
  { session_id: 'e1', question_id: 3 },
  { session_id: 'e2', question_id: 3 }
];
const students = [{ id: 's1', grade: '중3' }];
const mkSession = (over = {}) => ({
  id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_date: '2026-06-30',
  exam_title: '중간고사', score: '82', question_count: 20, ...over
});

// 1) 정상 school-exam 세션: grade_archive_year 스코프로 충전하고,
// 동일 question/session 중복은 COUNT(DISTINCT session_id) semantics를 유지한다.
let fixture = makeMockD1(cohortRows, wrongRows);
let rows = await buildReportExamCohortStats(fixture.env, [mkSession()], students, [], []);
assert.equal(rows.length, 1, 'school-exam 세션에 코호트 통계가 채워져야 함');
assert.equal(rows[0].cohortScope, 'grade_archive_year');
assert.equal(rows[0].gradeExamAverage, 82);
assert.equal(rows[0].gradeExamCount, 3);
assert.equal(rows[0].questionStats.length, 20);
assert.equal(rows[0].questionStats[2].wrongCount, 2, '3번 문항 오답 2명 집계');
assert.equal(rows[0].questionStats[2].correctRate, 33);
assert.equal(fixture.prepared.filter(sql => /FROM exam_sessions/.test(sql)).length, 1, 'exam_sessions는 요청당 1회만 읽어야 함');
assert.equal(fixture.prepared.filter(sql => /FROM wrong_answers/.test(sql)).length, 1, '90개 이하 session은 wrong_answers query 1회');
assert.deepEqual(fixture.bound.filter(item => /FROM wrong_answers/.test(item.sql)).map(item => item.values.length), [3]);

// 2) exam_date가 비면 identity를 만들 수 없어 미충전한다.
fixture = makeMockD1(cohortRows, wrongRows);
rows = await buildReportExamCohortStats(fixture.env, [mkSession({ exam_date: '' })], students, [], []);
assert.equal(rows.length, 0, 'exam_date 없는 세션은 코호트 미충전');
assert.equal(fixture.prepared.length, 0, 'identity가 없으면 D1 query도 없어야 함');

// 3) 학생·반 grade가 모두 비면 미충전한다.
fixture = makeMockD1(cohortRows, wrongRows);
rows = await buildReportExamCohortStats(fixture.env, [mkSession()], [{ id: 's1', grade: '' }], [], []);
assert.equal(rows.length, 0, 'grade 판별 불가 세션은 코호트 미충전');
assert.equal(fixture.prepared.length, 0, 'grade가 없으면 D1 query도 없어야 함');

// 4) 학생 grade가 없어도 반 grade로 보충된다.
fixture = makeMockD1(cohortRows, wrongRows);
rows = await buildReportExamCohortStats(
  fixture.env, [mkSession()], [{ id: 's1', grade: '' }],
  [{ id: 'c1', grade: '중3' }], [{ student_id: 's1', class_id: 'c1' }]
);
assert.equal(rows.length, 1, '반 grade 보충으로 충전되어야 함');
assert.equal(rows[0].grade, '중3');

// 5) grade 표기 변형도 정규화되어 매칭된다.
for (const grade of ['중3학년', '3학년', '중등3']) {
  fixture = makeMockD1(cohortRows, wrongRows);
  rows = await buildReportExamCohortStats(fixture.env, [mkSession()], [{ id: 's1', grade }], [], []);
  assert.equal(rows.length, 1, `grade='${grade}' 정규화 매칭`);
  assert.equal(rows[0].gradeExamCount, 3);
}

// 6) 날짜가 YYYY로 시작하지 않으면 제목+날짜+문항수 스코프로 폴백한다.
fixture = makeMockD1(cohortRows, wrongRows);
rows = await buildReportExamCohortStats(fixture.env, [mkSession({ exam_date: '6/30' })], students, [], []);
assert.equal(rows.length, 1);
assert.equal(rows[0].cohortScope, 'grade_title_date_question_count');

// 7) question_count가 없으면 grade_title_date scope도 별도로 유지한다.
const titleDateRows = [{
  id: 'title-date-1',
  score: '88',
  question_count: 0,
  archive_file: '',
  exam_title: '보충고사',
  exam_date: '2026-08-03',
  student_grade: '중3',
  class_grade: null
}];
fixture = makeMockD1(titleDateRows, []);
rows = await buildReportExamCohortStats(fixture.env, [{
  id: 'title-date-1',
  student_id: 's1',
  archive_file: '',
  exam_title: '보충고사',
  exam_date: '2026-08-03',
  score: '88',
  question_count: 0
}], students, [], []);
assert.equal(rows.length, 1);
assert.equal(rows[0].cohortScope, 'grade_title_date');
assert.equal(rows[0].gradeExamAverage, 88);
assert.deepEqual(rows[0].questionStats, []);
assert.equal(fixture.prepared.filter(sql => /FROM exam_sessions/.test(sql)).length, 1);
assert.equal(fixture.prepared.filter(sql => /FROM wrong_answers/.test(sql)).length, 0);

// 8) 91개 unique session은 90 + 1로 분할하고, exam_sessions는 요청당 1회만 읽는다.
const batchCohortRows = Array.from({ length: 91 }, (_, index) => ({
  id: `batch-${index + 1}`,
  score: String(50 + (index % 50)),
  question_count: 10,
  archive_file: 'batch-exam.js',
  exam_title: '배치시험',
  exam_date: '2026-09-01',
  student_grade: '중3',
  class_grade: null
}));
const batchWrongRows = batchCohortRows.flatMap((row, index) => [
  { session_id: row.id, question_id: 3 },
  ...(index === 0 ? [{ session_id: row.id, question_id: 3 }] : [])
]);
fixture = makeMockD1(batchCohortRows, batchWrongRows);
rows = await buildReportExamCohortStats(fixture.env, [{
  ...batchCohortRows[0],
  student_id: 's1'
}], students, [], []);
assert.equal(rows.length, 1);
assert.equal(rows[0].gradeExamCount, 91);
assert.equal(rows[0].questionStats[2].wrongCount, 91, '동일 session_id + question_id 중복은 DISTINCT semantics로 1회 집계');
assert.equal(rows[0].questionStats[2].correctRate, 0);
assert.equal(fixture.prepared.filter(sql => /FROM exam_sessions/.test(sql)).length, 1);
assert.equal(fixture.prepared.filter(sql => /FROM wrong_answers/.test(sql)).length, Math.ceil(91 / 90));
assert.deepEqual(fixture.bound.filter(item => /FROM wrong_answers/.test(item.sql)).map(item => item.values.length), [90, 1]);

console.log('report cohort stats worker test passed');
