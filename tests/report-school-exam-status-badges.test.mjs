import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

let formFields = [['meaning', 'local meaning']];
const calls = [];
const toasts = [];
const context = {
  state: {
    db: {
      students: [{ id: 's1', name: '민서' }],
      classes: [],
      class_students: [],
      exam_sessions: [{ id: 'e1', student_id: 's1', archive_file: 'exam-a.js', exam_title: '중간고사', score: 80, question_count: 3 }],
      wrong_answers: [],
      exam_blueprints: [],
      exam_question_reviews: [],
      exam_analysis_meta: [],
      exam_student_reports: []
    }
  },
  window: {},
  document: {
    querySelectorAll: selector => selector === '[data-report-counsel-field]'
      ? formFields.map(([key, value]) => ({ getAttribute: () => key, value }))
      : []
  },
  api: {
    async post(pathName, body) {
      calls.push({ pathName, body });
      return { success: true };
    }
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: (message, type) => toasts.push({ message, type }),
  openReportCenterModal: () => {},
  console: { ...console, warn: () => {} },
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

let html = context.reportCenterBuildStudentView('s1', 'exam-a.js');
assert.match(html, /문항 원문 불러오는 중/);
assert.match(html, /로컬 기본 리포트/);
assert.match(html, /기본 문구 사용 중/);

context.reportCenterSetCachedArchiveDetails('e1', { ok: true, details: [] });
context.state.db.exam_student_reports = [{
  archive_file: 'exams/exam-a.js',
  student_id: 's1',
  report_type: 'counsel',
  fields_json: JSON.stringify({ meaning: 'server meaning' })
}];
context.AP_REPORT_AI_ANALYSIS_CACHE = { e1: { source: 'ai', summary: 'ai summary' } };
html = context.reportCenterBuildStudentView('s1', 'exam-a.js');
assert.match(html, /문항 원문 로드 완료/);
assert.match(html, /서버 저장본 적용/);
assert.match(html, /프리미엄 분석 적용/);

const saved = await context.reportCenterSaveSchoolExamCounselReport('s1', 'exam-a.js');
assert.equal(saved.meaning, 'local meaning');
assert.equal(calls.at(-1).pathName, 'student-reports');
assert.equal(toasts.at(-1).type, 'success');

context.api.post = async () => { throw new Error('offline'); };
formFields = [['meaning', 'offline local']];
const offline = await context.reportCenterSaveSchoolExamCounselReport('s1', 'exam-a.js');
assert.equal(offline.meaning, 'offline local');
assert.equal(JSON.parse(context.state.db.exam_analysis_meta[0].counsel_reports).s1.meaning, 'offline local');
assert.equal(toasts.at(-1).type, 'warn');

console.log('report school exam status badges test passed');
