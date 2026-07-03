import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민준' }, { id: 's2', name: '서연' }],
      exam_sessions: [
        { id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '중간 A', school: '왕지중', grade: '중2', score: 80 },
        { id: 'e2', student_id: 's2', archive_file: 'exam-a.js', exam_title: '중간 A', school: '왕지중', grade: '중2', score: 100 }
      ],
      wrong_answers: [
        { session_id: 'e1', student_id: 's1', question_id: 2 },
        { session_id: 'e1', student_id: 's1', question_id: 3 }
      ],
      exam_question_reviews: [
        { archive_file: 'exams/exam-a.js', question_no: 2, unit: '식의 계산', correct_rate: 50, review_text: '부호 처리 확인' }
      ],
      exam_analysis_meta: [
        { archive_file: 'exams/exam-a.js', overview_text: '계산 정확도를 확인하는 시험입니다.' }
      ],
      exam_blueprints: [
        { archive_file: 'exam-a.js', question_no: 1, unit: '수와 식', difficulty: '하' },
        { archive_file: 'exam-a.js', question_no: 2, unit: '식의 계산', difficulty: '중' },
        { archive_file: 'exam-a.js', question_no: 3, unit: '식의 계산', difficulty: '상' }
      ]
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const rates = context.reportCenterBuildCohortRates('exam-a.js');
assert.equal(rates.takers, 2);
assert.equal(
  JSON.stringify(rates.rows.map(row => ({ questionNo: row.questionNo, correctRate: row.correctRate, wrongCount: row.wrongCount }))),
  JSON.stringify([
    { questionNo: '1', correctRate: 100, wrongCount: 0 },
    { questionNo: '2', correctRate: 50, wrongCount: 1 },
    { questionNo: '3', correctRate: 50, wrongCount: 1 }
  ])
);

context.reportCenterNavTo('exam', { archiveFile: 'exams/exam-a.js' });
const html = context.reportCenterBuildDrilldownShell('s1');
assert.match(html, /data-report-drilldown-level="exam"/);
assert.match(html, /계산 정확도를 확인하는 시험입니다/);
assert.match(html, /문항 분석 상태/);
assert.match(html, /1\/3/);
assert.match(html, /민준/);
assert.match(html, /오답 2/);
assert.match(html, /서연/);
assert.match(html, /오답 0/);
assert.match(html, /1번 100%/);

console.log('report center exam dashboard test passed');
