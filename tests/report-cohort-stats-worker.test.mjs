import assert from 'node:assert/strict';

// C-2: 워커 buildReportExamCohortStats가 school-exam 세션(archive_file + exam_date)에 대해
// report_exam_cohort_stats를 실제로 채우는지 mock D1으로 검증한다.
// 미충전 조건(identity null / grade 누락)도 함께 고정한다.

const { buildReportExamCohortStats } = await import('../apmath/worker-backup/worker/index.js');

const cohortRows = [
  { id: 'e1', score: '82', question_count: 20, student_grade: '중3', class_grade: null },
  { id: 'e2', score: '90', question_count: 20, student_grade: '중3', class_grade: null },
  { id: 'e3', score: '74', question_count: 20, student_grade: null, class_grade: '중3' }
];
const env = {
  DB: {
    prepare: sql => ({
      bind: () => ({
        all: async () => {
          if (/FROM exam_sessions/.test(sql)) return { results: cohortRows };
          if (/FROM wrong_answers/.test(sql)) return { results: [{ question_id: 3, wrong_count: 2 }] };
          return { results: [] };
        }
      })
    })
  }
};
const students = [{ id: 's1', grade: '중3' }];
const mkSession = (over = {}) => ({
  id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_date: '2026-06-30',
  exam_title: '중간고사', score: '82', question_count: 20, ...over
});

// 1) 정상 school-exam 세션: grade_archive_year 스코프로 충전, 평균·인원·문항 통계 포함
let rows = await buildReportExamCohortStats(env, [mkSession()], students, [], []);
assert.equal(rows.length, 1, 'school-exam 세션에 코호트 통계가 채워져야 함');
assert.equal(rows[0].cohortScope, 'grade_archive_year');
assert.equal(rows[0].gradeExamAverage, 82);
assert.equal(rows[0].gradeExamCount, 3);
assert.equal(rows[0].questionStats.length, 20);
assert.equal(rows[0].questionStats[2].wrongCount, 2, '3번 문항 오답 2명 집계');
assert.equal(rows[0].questionStats[2].correctRate, 33);

// 2) exam_date가 비면 identity를 만들 수 없어 미충전 (알려진 미충전 조건 #1)
rows = await buildReportExamCohortStats(env, [mkSession({ exam_date: '' })], students, [], []);
assert.equal(rows.length, 0, 'exam_date 없는 세션은 코호트 미충전');

// 3) 학생·반 grade가 모두 비면 미충전 (알려진 미충전 조건 #2)
rows = await buildReportExamCohortStats(env, [mkSession()], [{ id: 's1', grade: '' }], [], []);
assert.equal(rows.length, 0, 'grade 판별 불가 세션은 코호트 미충전');

// 4) 학생 grade가 없어도 반 grade로 보충되면 충전
rows = await buildReportExamCohortStats(
  env, [mkSession()], [{ id: 's1', grade: '' }],
  [{ id: 'c1', grade: '중3' }], [{ student_id: 's1', class_id: 'c1' }]
);
assert.equal(rows.length, 1, '반 grade 보충으로 충전되어야 함');
assert.equal(rows[0].grade, '중3');

// 5) grade 표기 변형도 정규화되어 매칭 (중3학년/3학년/중등3)
for (const grade of ['중3학년', '3학년', '중등3']) {
  rows = await buildReportExamCohortStats(env, [mkSession()], [{ id: 's1', grade }], [], []);
  assert.equal(rows.length, 1, `grade='${grade}' 정규화 매칭`);
  assert.equal(rows[0].gradeExamCount, 3);
}

// 6) 날짜가 YYYY로 시작하지 않으면 제목+날짜+문항수 스코프로 폴백
rows = await buildReportExamCohortStats(env, [mkSession({ exam_date: '6/30' })], students, [], []);
assert.equal(rows.length, 1);
assert.equal(rows[0].cohortScope, 'grade_title_date_question_count');

console.log('report cohort stats worker test passed');
