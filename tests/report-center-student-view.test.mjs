import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const storage = new Map();
const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민준' }, { id: 's2', name: '서연' }],
      exam_sessions: [
        { id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '중간 A', score: 80, question_count: 3 },
        { id: 'e2', student_id: 's2', archive_file: 'exam-a.js', exam_title: '중간 A', score: 100, question_count: 3 }
      ],
      wrong_answers: [
        { session_id: 'e1', student_id: 's1', question_id: 2 },
        { session_id: 'e1', student_id: 's1', question_id: 3 }
      ],
      exam_question_reviews: [
        { archive_file: 'exams/exam-a.js', question_no: 2, unit: '식의 계산', review_text: '2번 저장 분석' },
        { archive_file: 'exams/exam-a.js', question_no: 3, unit: '방정식', review_text: '3번 저장 분석' }
      ],
      exam_analysis_meta: [],
      exam_blueprints: [
        { archive_file: 'exam-a.js', question_no: 1, unit: '수와 식', difficulty: '하' },
        { archive_file: 'exam-a.js', question_no: 2, unit: '식의 계산', difficulty: '중' },
        { archive_file: 'exam-a.js', question_no: 3, unit: '방정식', difficulty: '상' }
      ]
    }
  },
  window: {},
  document: { getElementById: () => null },
  localStorage: {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const html = context.reportCenterBuildStudentView('s1', 'exam-a.js');
assert.match(html, /data-report-drilldown-level="student"/);
assert.match(html, /민준 리포트\/상담/);
assert.match(html, /오답 2/);
assert.match(html, /2번 저장 분석/);
assert.match(html, /3번 저장 분석/);
assert.match(html, /PDF 보기/);
assert.match(html, /발송 문구 복사/);

let lastModal = null;
context.reportCenterShowWideModal = (title, modalHtml) => {
  lastModal = { title, html: modalHtml };
};
context.reportCenterSetAdvancedMode(true);
context.reportCenterOpenStudentDrilldown('s1', 'e1');
assert.equal(context.reportCenterAdvancedMode(), true);
assert.equal(JSON.stringify(context.AP_REPORT_NAV), JSON.stringify({ level: 'student', archiveFile: 'exams/exam-a.js', studentId: 's1' }));
assert.ok(lastModal);
assert.match(lastModal.html, /data-report-drilldown-level="student"/);
assert.doesNotMatch(lastModal.html, /시험지 찾기/);

console.log('report center student view test passed');
