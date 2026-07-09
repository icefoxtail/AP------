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
        { id: 's1', name: '테스트 학생', grade: '중2' },
        { id: 's2', name: '만점 학생', grade: '중2' }
      ],
      exam_sessions: [
        { id: 'e1', student_id: 's1', exam_date: '2026-06-01', exam_title: '압축 테스트', archive_file: 'compact.js', score: 80, question_count: 20 },
        { id: 'p1', student_id: 's2', exam_date: '2026-06-01', exam_title: '만점 테스트', archive_file: 'perfect.js', score: 100, question_count: 20 }
      ],
      wrong_answers: [
        { session_id: 'e1', student_id: 's1', question_id: 19 }
      ],
      exam_blueprints: [
        { archive_file: 'compact.js', question_no: 19, standard_unit: '문자와 식', difficulty: '상' }
      ],
      exam_question_reviews: [
        {
          archive_file: 'exams/compact.js',
          question_no: '19',
          review_text: JSON.stringify({
            concept: '조건 해석',
            trap: '조건을 식으로 바꾸는 첫 줄에서 부호를 놓치기 쉽습니다.',
            key: '주어진 조건을 먼저 등식으로 정리합니다.',
            teach: '다음 수업에서 조건 해석을 다시 풀이합니다.'
          })
        }
      ],
      exam_analysis_meta: [],
      class_students: [],
      classes: [],
      report_exam_cohort_stats: [],
      questions: [],
      consultations: [],
      attendance: [],
      homework: []
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { clipboard: { writeText: () => Promise.resolve() } },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

function countMatches(text, pattern) {
  return (text.match(pattern) || []).length;
}

const html = context.reportCenterBuildCleanPdfDocument('s1', 'e1', { teacherMemo: '' });

assert.match(html, /aprc-pdf-review-panel/, 'standard wrong report should render the question cards');
assert.doesNotMatch(html, /aprc-pdf-table-panel/, 'standard report should not render the duplicated question table');
assert.doesNotMatch(html, /aprc-pdf-qcomment-panel/, 'standard report should not render duplicated question comments');

const reviewPanel = html.match(/aprc-pdf-review-panel[\s\S]*?<\/section>/)?.[0] || '';
const outsideReview = html.replace(reviewPanel, '');
assert.match(reviewPanel, /19번/);
assert.doesNotMatch(outsideReview, /19번/, 'wrong question number should not repeat outside the card section');

assert.doesNotMatch(reviewPanel, /지도 포인트/);
assert.doesNotMatch(reviewPanel, /다시 풀이/);
assert.doesNotMatch(html, /다시 풀이/);
assert.match(html, /다시 풀어 정리했|다시 풀 문항|다시 풀고|다시 풀면서/, 're-teaching plan copy should appear outside the review card wording');

const order = [
  '이번 시험 점수',
  '이번 시험, 이렇게 봤습니다',
  '문항별 쉬운 설명',
  '오답 원인 한눈에',
  '학원 조치',
  '학부모님께 드리는 말씀'
].map(label => html.indexOf(label));
assert.ok(order.every(index => index >= 0), `all compact sections should exist: ${order.join(',')}`);
assert.deepEqual([...order].sort((a, b) => a - b), order, 'compact sections should render in the target order');

const parentSection = html.match(/aprc-pdf-parent-message[\s\S]*?<p>([\s\S]*?)<\/p>/)?.[1] || '';
assert.ok(parentSection.split(/[.!?。]|다\./).filter(Boolean).length <= 2, 'parent message should stay compact');

const perfectHtml = context.reportCenterBuildCleanPdfDocument('s2', 'p1', { teacherMemo: '' });
assert.doesNotMatch(perfectHtml, /aprc-pdf-review-panel/);
assert.doesNotMatch(perfectHtml, /오답 원인 한눈에/);
assert.match(perfectHtml, /학원 조치/);

console.log('report pdf dedup test passed');
