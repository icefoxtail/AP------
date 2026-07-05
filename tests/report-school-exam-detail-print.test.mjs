import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

let injectedStyle = null;
const bodyClasses = new Set();
const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민서' }],
      classes: [],
      class_students: [],
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '중간고사', score: 82, question_count: 4 }],
      wrong_answers: [{ session_id: 'e1', student_id: 's1', question_id: 2 }],
      exam_blueprints: [{ archive_file: 'exam-a.js', question_no: 2, standard_unit: '일차방정식', difficulty: '중' }],
      exam_question_reviews: [
        { archive_file: 'exam-a.js', question_no: '2', review_text: JSON.stringify({ concept: '일차방정식', tag: '계산·검산' }) }
      ],
      exam_analysis_meta: []
    }
  },
  window: {},
  document: {
    body: {
      classList: {
        add: value => bodyClasses.add(value),
        remove: value => bodyClasses.delete(value)
      }
    },
    head: { appendChild: el => { injectedStyle = el; } },
    getElementById: id => (id === 'report-print-view-style' ? injectedStyle : null),
    createElement: tag => ({ tagName: tag, id: '', textContent: '' }),
    querySelectorAll: () => []
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const doc = context.reportCenterBuildSchoolExamDetailedPrintDocument('s1', 'e1');
assert.match(doc, /class="aprc-school-detail-document"/);
assert.match(doc, /class="aprc-school-detail-head"/);
assert.doesNotMatch(doc, /aprc-pdf-header/);
assert.match(doc, /<h1>민서 상세 학부모 리포트<\/h1>/);
assert.doesNotMatch(doc, /기본값 · 학부모 상담\/출력용/);
assert.equal((doc.match(/aprc-counsel-head/g) || []).length, 0);
assert.doesNotMatch(doc, /서버 저장본|로컬 임시 저장|프리미엄 분석 적용/);
assert.doesNotMatch(doc, /학부모 해석|이번 오답 의미/);

const shell = context.reportCenterBuildSchoolExamDetailedPrintShell(doc);
assert.match(shell, /report-center-school-exam-print-view/);
assert.match(shell, /report-print-toolbar no-print/);
assert.match(shell, /reportCenterExitSchoolExamPrintMode\(\); openReportCenterHome\(\)/);

context.reportCenterInjectPrintViewStyle();
assert.ok(injectedStyle?.textContent);
assert.match(injectedStyle.textContent, /\.report-center-school-exam-print-view/);
assert.match(injectedStyle.textContent, /\.app-header,\s*\n\s*\.mobile-header,\s*\n\s*\.topbar/);
assert.match(injectedStyle.textContent, /break-inside:avoid/);
assert.match(injectedStyle.textContent, /\.aprc-school-detail-document/);

bodyClasses.add('aprc-school-print-mode');
context.reportCenterExitSchoolExamPrintMode();
assert.equal(bodyClasses.has('aprc-school-print-mode'), false);

context.AP_REPORT_AI_ANALYSIS_CACHE = { e1: { source: 'ai', summary: 'AI 요약' } };
const premiumDoc = context.reportCenterBuildSchoolExamDetailedPrintDocument('s1', 'e1');
assert.doesNotMatch(premiumDoc, /aprc-school-detail-premium-badge/);
assert.doesNotMatch(premiumDoc, /프리미엄 분석 적용/);
assert.doesNotMatch(premiumDoc, /style="padding:2px 8px/);

console.log('report school exam detail print test passed');
