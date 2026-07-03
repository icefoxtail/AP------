import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const fields = [
  ['summary', '요약 수정'],
  ['meaning', '총평 수정'],
  ['cause', '원인 수정'],
  ['counsel', '상담 수정'],
  ['action', '조치 수정'],
  ['parent', '안내 수정']
];
const context = {
  state: { db: { exam_analysis_meta: [], exam_question_reviews: [] } },
  window: {},
  document: {
    querySelectorAll: selector => selector === '[data-report-counsel-field]'
      ? fields.map(([key, value]) => ({ getAttribute: () => key, value }))
      : []
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  openReportCenterModal: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

context.reportCenterSetCounselEditMode('s1', 'exam-a.js', true);
assert.equal(context.reportCenterCounselEditMode('s1', 'exam-a.js'), true);
const saved = context.reportCenterSaveSchoolExamCounselReport('s1', 'exam-a.js');
assert.equal(saved.meaning, '총평 수정');
assert.equal(context.reportCenterCounselEditMode('s1', 'exam-a.js'), false);
assert.equal(context.state.db.exam_analysis_meta[0].overview_text, '총평 수정');
assert.match(context.state.db.exam_analysis_meta[0].counsel_report, /안내 수정/);

console.log('report school exam edit test passed');
