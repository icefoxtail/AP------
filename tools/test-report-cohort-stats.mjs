import assert from 'node:assert/strict';
import { buildReportExamCohortStats } from '../apmath/worker-backup/worker/index.js';

const visibleSessions = [
  {
    id: 'own',
    student_id: 'stu-own',
    score: 80,
    exam_date: '2026-05-20',
    question_count: 4,
    archive_file: 'exams/m1-unit-test.js'
  }
];

const students = [
  { id: 'stu-own', grade: '중1' }
];

const allCohortRows = [
  { id: 'own', score: 80, question_count: 4, student_grade: '중1', class_grade: '' },
  { id: 'same-year-other-date', score: 100, question_count: 4, student_grade: '중1', class_grade: '' },
  { id: 'next-year', score: 60, question_count: 4, student_grade: '중1', class_grade: '' },
  { id: 'same-year-other-grade', score: 40, question_count: 4, student_grade: '중2', class_grade: '' }
];

const wrongRows = [
  { session_id: 'own', question_id: '2' },
  { session_id: 'same-year-other-date', question_id: '3' },
  { session_id: 'next-year', question_id: '1' },
  { session_id: 'same-year-other-grade', question_id: '4' }
];

const env = {
  DB: {
    prepare(sql) {
      return {
        bind(...params) {
          return {
            async all() {
              if (sql.includes('FROM wrong_answers')) {
                const sessionIds = new Set(params.map(String));
                const counts = new Map();
                for (const row of wrongRows.filter(row => sessionIds.has(String(row.session_id)))) {
                  const questionId = String(row.question_id);
                  counts.set(questionId, (counts.get(questionId) || 0) + 1);
                }
                return {
                  results: [...counts.entries()].map(([question_id, wrong_count]) => ({ question_id, wrong_count }))
                };
              }

              const archiveFile = String(params[0] || '');
              const examYear = String(params[1] || '');
              assert.equal(archiveFile, 'exams/m1-unit-test.js');
              return {
                results: allCohortRows.filter(row => {
                  if (!examYear) return true;
                  if (row.id === 'next-year') return false;
                  return true;
                })
              };
            }
          };
        }
      };
    }
  }
};

const stats = await buildReportExamCohortStats(env, visibleSessions, students, [], []);

assert.equal(stats.length, 1);
assert.equal(stats[0].cohortScope, 'grade_archive_year');
assert.equal(stats[0].examYear, '2026');
assert.equal(stats[0].gradeExamCount, 2);
assert.equal(stats[0].gradeExamAverage, 90);
assert.equal(stats[0].gradeExamRank, 2);

const q2 = stats[0].questionStats.find(row => row.questionNo === 2);
const q3 = stats[0].questionStats.find(row => row.questionNo === 3);
assert.deepEqual({ wrongCount: q2.wrongCount, correctRate: q2.correctRate }, { wrongCount: 1, correctRate: 50 });
assert.deepEqual({ wrongCount: q3.wrongCount, correctRate: q3.correctRate }, { wrongCount: 1, correctRate: 50 });

console.log('Report cohort stats contract passed');
