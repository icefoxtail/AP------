import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const state = {
  auth: { id: 'teacher-1' },
  db: {
    students: [
      { id: 's1', name: '김학생' },
      { id: 's2', name: '박학생' }
    ],
    exam_sessions: [
      { id: 'e1', student_id: 's1', archive_file: 'article-exam.js', question_count: 3 },
      { id: 'e2', student_id: 's2', archive_file: 'article-exam.js', question_count: 3 }
    ],
    wrong_answers: [
      { session_id: 'e1', question_id: 2 },
      { session_id: 'e2', question_id: 3 }
    ],
    exam_blueprints: [
      { archive_file: 'article-exam.js', question_no: 1, standard_unit: '수와 식', level: '쉬움', answer: '1' },
      { archive_file: 'article-exam.js', question_no: 2, standard_unit: '방정식', level: '보통', answer: '2' },
      { archive_file: 'article-exam.js', question_no: 3, standard_unit: '함수', level: '어려움', answer: '3' }
    ],
    exam_question_reviews: [
      { archive_file: 'exams/article-exam.js', question_no: '2', review_text: '저장된 2번 리뷰입니다.', answer: '저장 정답' }
    ],
    exam_analysis_meta: [
      { archive_file: 'exams/article-exam.js', overview_text: '저장된 시험지 총평입니다.' }
    ]
  }
};

const context = {
  state,
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  navigator: { clipboard: { writeText: text => { context.__copiedText = text; return Promise.resolve(); } } },
  toast: (message, type) => { context.__toasts.push({ message, type }); },
  __copiedText: '',
  __toasts: [],
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const html = context.reportCenterBuildExamAnalysisArticle('article-exam.js');
assert.match(html, /저장된 시험지 총평입니다\./);
assert.equal((html.match(/class="aprc-qreview-card/g) || []).length, 3, 'article should render every blueprint question');
assert.match(html, /저장된 2번 리뷰입니다\./);
assert.match(html, /문항 <b>3<\/b>/);
assert.match(html, /응시 기록 <b>2<\/b>/);
assert.doesNotMatch(html, /김학생|박학생|student_id|s1|s2/, 'article must stay anonymous');
assert.doesNotMatch(html, /<script/i);
assert.equal(context.reportCenterLooksLikeCodeText(html), false);

const fallbackHtml = context.reportCenterBuildExamAnalysisArticle('missing-exam.js');
assert.match(fallbackHtml, /분석할 문항 정보가 아직 없습니다\./);

console.log('exam analysis article tests passed');
