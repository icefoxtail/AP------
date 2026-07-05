import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const apiCalls = [];
const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '김가온' }, { id: 's2', name: '박도윤' }],
      exam_sessions: [
        { id: 'e1', student_id: 's1', archive_file: 'archive-ai.js', exam_title: 'AI 분석 시험', school: '왕지중', grade: '중2' },
        { id: 'e2', student_id: 's2', archive_file: 'archive-ai.js', exam_title: 'AI 분석 시험', school: '왕지중', grade: '중2' }
      ],
      wrong_answers: [{ session_id: 'e1', question_id: 2 }],
      exam_blueprints: [
        { archive_file: 'archive-ai.js', question_no: 1, standard_unit: '이차방정식', difficulty: '중' },
        { archive_file: 'archive-ai.js', question_no: 2, standard_unit: '함수', difficulty: '상' }
      ],
      exam_question_reviews: [
        {
          archive_file: 'exams/archive-ai.js',
          question_no: 1,
          answer: '1',
          review_text: JSON.stringify({ concept: '사람 리뷰', tag: '조건 해석', asks: '보존 대상' })
        }
      ],
      exam_analysis_meta: [
        { archive_file: 'exams/archive-ai.js', overview_text: '기존 총평' }
      ]
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  api: {
    async post(pathName, body) {
      apiCalls.push({ pathName, body });
      if (pathName === 'ai/report-analysis') {
        return {
          success: true,
          analysis: {
            overview_text: '새 총평',
            questions: [
              { questionNo: 1, concept: '덮으면 안 됨', tag: '계산·검산', asks: 'x', trap: 'x', key: 'x', teach: 'x' },
              { questionNo: 2, concept: '함수값 계산', tag: '계산·검산', asks: '함수값을 구한다.', trap: '부호 실수', key: '대입 후 정리', teach: '대입식을 먼저 쓰게 한다.' }
            ]
          }
        };
      }
      return { success: true };
    }
  },
  toast: () => {},
  openReportCenterModal: () => {},
  console: { ...console, warn: () => {}, error: () => {} },
  setTimeout,
  clearTimeout,
  fetch: async () => ({ ok: false, text: async () => '' })
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const info = context.reportCenterNormalizeArchiveFile('archive-ai.js');
context.reportCenterArchiveBankCache()[info.url] = {
  ok: true,
  list: [
    { questionNo: 1, content: '[3점] 이차방정식인 것은?', choices: ['1', '2'], answer: '1' },
    { questionNo: 2, content: '[4점] f(2)를 구하시오.', choices: [], answer: '5' }
  ]
};

const payload = await context.reportCenterBuildSchoolExamArchiveAiPayload('archive-ai.js');
assert.equal(payload.reportType, 'exam_archive_analysis');
assert.equal(payload.questions.length, 2);
assert.equal(payload.questions[1].content, '[4점] f(2)를 구하시오.');
assert.equal(payload.questions[1].correctRate, 50);
assert.equal(payload.questions[0].hasReview, true);
assert.match(payload.instructions, /계산·검산/);

const result = await context.reportCenterRequestSchoolExamArchiveAiAnalysis('archive-ai.js');
assert.equal(result.saved, 1);
assert.equal(result.skipped, 1);

const q1 = context.reportCenterGetExamReviews('archive-ai.js').byQuestion.get('1');
const q2 = context.reportCenterGetExamReviews('archive-ai.js').byQuestion.get('2');
assert.equal(JSON.parse(q1.review_text).concept, '사람 리뷰');
assert.equal(JSON.parse(q2.review_text).concept, '함수값 계산');
assert.equal(JSON.parse(q2.review_text).source, 'ai');
assert.equal(context.reportCenterGetExamReviews('archive-ai.js').meta.overview_text, '기존 총평');

const serverSave = apiCalls.find(call => call.pathName === 'exams/exam-analysis');
assert.ok(serverSave, 'AI-created reviews should be sent through existing exam-analysis save route');
assert.equal(serverSave.body.reviews.length, 1);
assert.equal(serverSave.body.reviews[0].question_no, '2');

const tableHtml = context.reportCenterBuildExamAnalysisTableHtml('archive-ai.js');
assert.match(tableHtml, /AI/);
assert.match(tableHtml, /함수값 계산/);

console.log('report exam archive ai test passed');
