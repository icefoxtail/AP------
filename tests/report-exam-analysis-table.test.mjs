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
      students: [
        { id: 's1', name: '김가온' },
        { id: 's2', name: '박도윤' },
        { id: 's3', name: '최서진' }
      ],
      classes: [
        { id: 'c1', name: '중2A' },
        { id: 'c2', name: '중2B' }
      ],
      class_students: [
        { student_id: 's1', class_id: 'c1' },
        { student_id: 's2', class_id: 'c1' },
        { student_id: 's3', class_id: 'c2' }
      ],
      exam_sessions: [
        { id: 'e1', student_id: 's1', archive_file: 'exam-table.js', exam_title: '기말 A' },
        { id: 'e2', student_id: 's2', archive_file: 'exam-table.js', exam_title: '기말 A' },
        { id: 'e3', student_id: 's3', archive_file: 'exam-table.js', exam_title: '기말 A' }
      ],
      wrong_answers: [
        { session_id: 'e1', question_id: 1 },
        { session_id: 'e2', question_id: 1 },
        { session_id: 'e3', question_id: 2 }
      ],
      exam_blueprints: [
        { archive_file: 'exam-table.js', question_no: 1, standard_unit: '이차방정식', questionType: '객관식', difficulty: '중' },
        { archive_file: 'exam-table.js', question_no: 2, standard_unit: '함수', question_type: '주관식', level: '상', score: 4 },
        { archive_file: 'exam-table.js', question_no: 3, standard_unit: '도형', difficulty: '하' }
      ],
      exam_question_reviews: [
        {
          archive_file: 'exams/exam-table.js',
          question_no: 1,
          answer: '1',
          review_text: JSON.stringify({
            concept: '이차방정식의 정의 판별',
            tag: '개념 재정리',
            asks: '이차방정식이 되는 조건을 고른다.',
            trap: '계수가 0이 되는 경우를 놓치기 쉽다.',
            key: '이차항 계수를 먼저 확인한다.',
            teach: '정의 조건을 식으로 다시 적게 한다.'
          })
        },
        {
          archive_file: 'exams/exam-table.js',
          question_no: 2,
          answer: '5',
          review_text: JSON.stringify({
            concept: '함수값 계산',
            tag: '계산·검산',
            asks: '함수값을 대입해 계산한다.',
            trap: '부호를 잘못 대입할 수 있다.',
            key: '대입 후 같은 항을 정리한다.',
            teach: '대입식 한 줄을 먼저 쓰게 한다.'
          })
        }
      ]
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const info = context.reportCenterNormalizeArchiveFile('exam-table.js');
context.reportCenterArchiveBankCache()[info.url] = {
  ok: true,
  list: [
    { questionNo: 1, content: '[3.8점] 다음 중 이차방정식인 것은?', answer: '1' },
    { questionNo: 2, content: '[4점] 함수값을 구하시오.', answer: '5' },
    { questionNo: 3, content: '[2점] 도형의 넓이를 구하시오.', answer: '10' }
  ]
};

const rows = context.reportCenterBuildExamAnalysisTableRows('exam-table.js', { classId: 'c1' });
assert.equal(rows.length, 3);
assert.equal(rows[0].points, '3.8점');
assert.equal(rows[0].correctRate, 33);
assert.equal(rows[0].classCorrectRate, 0);
assert.equal(rows[0].needsClassBoost, true);
assert.equal(rows[0].wrongGroups[0].className, '중2A');
assert.equal(JSON.stringify(rows[0].wrongGroups[0].names), JSON.stringify(['김가온', '박도윤']));
assert.equal(rows[2].hasReview, false);

const html = context.reportCenterBuildExamAnalysisTableHtml('exam-table.js', { rows });
assert.match(html, /class="aprc-qtable"/);
assert.equal((html.match(/class="aprc-qtable-row/g) || []).length, 3);
assert.match(html, /분석 대기/);
assert.match(html, /이차방정식의 정의 판별/);
assert.match(html, /개념 재정리/);
assert.match(html, /3\.8점/);
assert.match(html, /전체 33%/);
assert.match(html, /우리 반 0%/);
assert.match(html, /수업 보강/);
assert.match(html, /중2A · 김가온 박도윤/);
assert.match(html, /묻는 것/);
assert.match(html, /풀이 포인트/);
assert.match(html, /data-qtable-detail="1" hidden/);
assert.doesNotMatch(html, /aprc-qreview-card/);
assert.doesNotMatch(html, /undefined/);

context.reportCenterNavTo('exam', { archiveFile: 'exam-table.js' });
const dashboard = context.reportCenterBuildDrilldownShell('s1');
assert.match(dashboard, /문항 분석 상태/);
assert.match(dashboard, /class="aprc-qtable"/);
assert.match(dashboard, /2\/3/);
assert.doesNotMatch(dashboard, /aprc-qreview-card/);

console.log('report exam analysis table test passed');
