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
      students: [{ id: 's1', name: '김가온' }],
      exam_sessions: [
        { id: 'e1', student_id: 's1', archive_file: 'print-exam.js', exam_title: '기말 분석', school: '왕지중', grade: '중2', score: 88, question_count: 2 }
      ],
      wrong_answers: [{ session_id: 'e1', question_id: 1 }],
      exam_blueprints: [
        { archive_file: 'print-exam.js', question_no: 1, standard_unit: '이차방정식', difficulty: '중', score: 3 },
        { archive_file: 'print-exam.js', question_no: 2, standard_unit: '함수', difficulty: '상', score: 4 }
      ],
      exam_question_reviews: [
        {
          archive_file: 'exams/print-exam.js',
          question_no: 1,
          answer: '2',
          review_text: JSON.stringify({
            concept: '이차방정식 판별',
            tag: '조건 해석',
            asks: '이차방정식 조건을 확인한다.',
            trap: '상수항만 보고 판단할 수 있다.',
            key: '이차항 계수를 먼저 본다.',
            teach: '조건을 식 위에 표시하게 한다.'
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

const info = context.reportCenterNormalizeArchiveFile('print-exam.js');
context.reportCenterArchiveBankCache()[info.url] = {
  ok: true,
  list: [
    { questionNo: 1, content: '[3점] 이차방정식인 것을 고르시오.', choices: ['x+1=0', 'x^2+1=0'], answer: '2' },
    { questionNo: 2, content: '[4점] 함수값을 구하시오.', choices: [], answer: '5' }
  ]
};

const doc = context.reportCenterBuildExamAnalysisPrintDocument('print-exam.js');
assert.match(doc, /기말 분석 분석표/);
assert.match(doc, /왕지중 · 중2/);
assert.match(doc, /응시 1명/);
assert.match(doc, /전체 평균 88점/);
assert.match(doc, /단원 분포/);
assert.match(doc, /class="aprc-qtable"/);
assert.match(doc, /data-qtable-detail="1"/);
assert.doesNotMatch(doc, /data-qtable-detail="1" hidden/);
assert.match(doc, /묻는 것/);
assert.doesNotMatch(doc, /\[3점\] 이차방정식인 것을 고르시오/);

const docWithContent = context.reportCenterBuildExamAnalysisPrintDocument('print-exam.js', { includeContent: true });
assert.match(docWithContent, /\[3점\] 이차방정식인 것을 고르시오/);
assert.match(docWithContent, /문항 원문/);

const shell = context.reportCenterBuildExamAnalysisPrintShell(doc);
assert.match(shell, /@page \{ size:A4; margin:12mm; \}/);
assert.match(shell, /thead \{ display:table-header-group/);
assert.match(shell, /break-inside:avoid/);
assert.match(shell, /MathJax/);

context.reportCenterNavTo('exam', { archiveFile: 'print-exam.js' });
const dashboard = context.reportCenterBuildDrilldownShell('s1');
assert.match(dashboard, /data-exam-analysis-print="exams\/print-exam\.js"/);
assert.match(dashboard, /문항 원문 포함/);
assert.match(dashboard, /지도 포인트 포함/);

console.log('report exam analysis print test passed');
