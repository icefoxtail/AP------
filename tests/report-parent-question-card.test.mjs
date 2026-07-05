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
      students: [{ id: 's1', name: '민서' }],
      classes: [],
      class_students: [],
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '중간고사', score: 80, question_count: 6 }],
      wrong_answers: [
        { session_id: 'e1', student_id: 's1', question_id: 8 },
        { session_id: 'e1', student_id: 's1', question_id: 3 }
      ],
      exam_blueprints: [
        { archive_file: 'exam-a.js', question_no: 8, standard_unit: '일차방정식', difficulty: '매우 어려움', points: 4 },
        { archive_file: 'exam-a.js', question_no: 3, standard_unit: '함수', difficulty: '쉬움', points: 3 }
      ],
      exam_question_reviews: [
        { archive_file: 'exam-a.js', question_no: '8', review_text: JSON.stringify({ concept: '일차방정식', tag: '조건 해석', trap: '경계 조건을 놓치기 쉬웠습니다' }) },
        { archive_file: 'exam-a.js', question_no: '3', review_text: JSON.stringify({ concept: '함수', tag: '계산·검산' }) }
      ],
      exam_analysis_meta: []
    }
  },
  window: {},
  document: { querySelectorAll: () => [] },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const detail = context.reportCenterNormalizeQuestionDetail(
  { content: 'x의 값을 구하시오.', choices: ['x=1', 'x=2'], answer: 'x=2', solution: '양변을 정리합니다.' },
  8,
  { questionNo: 8, unit: '일차방정식', correctRate: 32, classCorrectRate: 25 }
);
const row = {
  questionNo: 8,
  unit: '일차방정식',
  type: '서술형',
  points: 4,
  difficulty: '매우 어려움',
  correctRate: 32,
  classCorrectRate: 25,
  reviewText: JSON.stringify({ concept: '일차방정식', tag: '조건 해석', trap: '경계 조건을 놓치기 쉬웠습니다' })
};

const card = context.reportCenterBuildParentWrongQuestionCard(row, detail);
assert.match(card, /aprc-parent-question-card/);
assert.match(card, /8번/);
assert.match(card, /일차방정식/);
assert.match(card, /서술형/);
assert.match(card, /4점/);
assert.match(card, /전체 정답률 32%/);
assert.match(card, /반 정답률 25%/);
assert.match(card, /학부모 해석/);
assert.match(card, /이번 오답 의미/);
assert.match(card, /다음 수업 계획/);
assert.match(card, /실제 문항/);
assert.match(card, /x의 값을 구하시오/);
assert.match(card, /x=1/);
assert.doesNotMatch(card, /<b>정답<\/b>/);
assert.doesNotMatch(card, /archive|blueprint|review_text|raw/i);

const withAnswer = context.reportCenterBuildParentWrongQuestionCard(row, detail, { showAnswer: true });
assert.match(withAnswer, /<b>정답<\/b>/);

const missing = context.reportCenterBuildParentWrongQuestionCard({ questionNo: 9, correctRate: 70 }, null);
assert.match(missing, /문항 원문을 불러오지 못했습니다/);

const archiveDetails = { ok: true, details: [detail] };
const report = context.reportCenterBuildSchoolExamDetailedParentReport('s1', 'exam-a.js', { archiveDetails });
assert.match(report, /aprc-parent-question-card/);
assert.doesNotMatch(report, /aprc-qreview-card/);

const firstCard = report.slice(report.indexOf('aprc-parent-question-card'));
const order = [
  firstCard.indexOf('aprc-parent-question-head'),
  firstCard.indexOf('학부모 해석'),
  firstCard.indexOf('이번 오답 의미'),
  firstCard.indexOf('다음 수업 계획'),
  firstCard.indexOf('실제 문항')
];
assert.deepEqual([...order].sort((a, b) => a - b), order);
assert.ok(order.every(index => index >= 0));

console.log('report parent question card test passed');
