import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportCenterSource = fs.readFileSync(path.join(root, 'apmath/js/report-center.js'), 'utf8');
const reportPrintSource = fs.readFileSync(path.join(root, 'apmath/js/report-print.js'), 'utf8');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

assert.match(reportCenterSource, /function reportCenterEnsureMathJax\(/);
assert.match(reportCenterSource, /function reportCenterTypesetMath\(/);
assert.match(reportCenterSource, /reportCenterShowWideModal[\s\S]*reportCenterTypesetMath\(bodyEl\)/);
assert.match(reportCenterSource, /reportCenterOpenPrintView[\s\S]*reportCenterTypesetMath\([^)]*report-print-document-root/);
assert.match(reportCenterSource, /reportCenterRefreshPrintViewReport[\s\S]*reportCenterTypesetMath\(root\)/);
assert.match(reportCenterSource, /reportCenterOpenBatchPrintView[\s\S]*reportCenterTypesetMath\([^)]*report-print-document-root/);
assert.match(reportPrintSource, /inlineMath:\s*\[\['\$', '\$'\], \['\\\\\\\\\(', '\\\\\\\\\)'\]\]/);
assert.match(reportPrintSource, /displayMath:\s*\[\['\$\$', '\$\$'\], \['\\\\\\\\\[', '\\\\\\\\\]'\]\]/);
assert.match(reportPrintSource, /svg:\s*\{\s*fontCache:\s*'global'\s*\}/);
assert.match(reportPrintSource, /function reportCenterPrintCleanPdf\(/);

const context = {
  state: {
    auth: { id: 'teacher-1' },
    db: {
      students: [{ id: 's1', name: 'Student' }],
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'math-exam.js', question_count: 1, score: 80 }],
      wrong_answers: [{ session_id: 'e1', student_id: 's1', question_id: 1 }],
      exam_blueprints: [{
        archive_file: 'math-exam.js',
        question_no: 1,
        content: 'Solve $x^2=4$',
        choices: ['\\(x=2\\)', '\\(x=-2\\)'],
        solution: 'Use \\dfrac{4}{2}.'
      }],
      exam_question_reviews: [{
        archive_file: 'exams/math-exam.js',
        question_no: '1',
        review_text: 'Review keeps $x^2$ and $$y=\\dfrac{1}{2}$$.',
        answer: '\\(x=\\pm2\\)'
      }],
      exam_analysis_meta: [{
        archive_file: 'exams/math-exam.js',
        overview_text: 'Overview keeps $a^2+b^2=c^2$ and \\[z=1\\].'
      }],
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

const articleHtml = context.reportCenterBuildExamAnalysisArticle('math-exam.js');
assert.match(articleHtml, /\$a\^2\+b\^2=c\^2\$/);
assert.match(articleHtml, /\\\[z=1\\\]/);
assert.match(articleHtml, /\$x\^2\$/);
assert.match(articleHtml, /\$\$y=\\dfrac\{1\}\{2\}\$\$/);
assert.match(articleHtml, /\\\(x=\\pm2\\\)/);
assert.doesNotMatch(articleHtml, /<script/i);

console.log('report center mathjax preview test passed');
