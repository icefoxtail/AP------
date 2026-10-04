import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const toastCalls = [];
const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민준', status: '재원' }],
      classes: [{ id: 'c1', name: '고1 A반' }],
      class_students: [{ class_id: 'c1', student_id: 's1' }],
      attendance: [],
      homework: [],
      exam_sessions: [],
      wrong_answers: [],
      consultations: [],
      class_daily_records: [],
      class_daily_progress: [],
      student_memos: [],
      student_reports: [],
      report_exam_cohort_stats: []
    }
  },
  window: {},
  document: { getElementById: () => null },
  escapeHtmlForTextarea: text => String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;'),
  localStorage: {
    _m: new Map(),
    getItem(key) { return this._m.has(key) ? this._m.get(key) : null; },
    setItem(key, value) { this._m.set(key, String(value)); },
    removeItem(key) { this._m.delete(key); }
  },
  toast: (msg, kind) => toastCalls.push([msg, kind]),
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

assert.equal(typeof context.reportCenterBuildMenuBody, 'function');

const noStudent = context.reportCenterBuildMenuBody('daily', '');
assert.match(noStudent, /리포트를 만들 학생을 먼저 선택하세요/);
assert.doesNotMatch(noStudent, /학생 정보를 찾을 수 없습니다/);
assert.equal(toastCalls.length, 0);

const withStudent = context.reportCenterBuildMenuBody('daily', 's1');
assert.match(withStudent, /report-center-daily-text/);
assert.match(withStudent, /선택: 민준/);

const examNoStudent = context.reportCenterBuildMenuBody('exam', '');
assert.match(examNoStudent, /리포트를 만들 학생을 먼저 선택하세요/);

console.log('report center inline report entry test passed');
