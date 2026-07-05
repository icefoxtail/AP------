import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

let currentFormFields = [
  ['summary', 'local summary'],
  ['meaning', 'local meaning'],
  ['cause', 'local cause'],
  ['counsel', 'local counsel'],
  ['action', 'local action'],
  ['parent', 'local parent']
];

const calls = [];
const context = {
  state: {
    db: {
      exam_analysis_meta: [],
      exam_student_reports: [],
      exam_sessions: [
        { id: 'session-1', student_id: 's1', archive_file: 'sync-exam.js', exam_title: '동기화 시험' }
      ],
      students: [{ id: 's1', name: '김가온' }],
      wrong_answers: [],
      exam_blueprints: []
    }
  },
  window: {},
  document: {
    querySelectorAll: selector => selector === '[data-report-counsel-field]'
      ? currentFormFields.map(([key, value]) => ({ getAttribute: () => key, value }))
      : []
  },
  api: {
    async post(pathName, body) {
      calls.push({ method: 'post', pathName, body });
      return { success: true };
    },
    async get(pathName) {
      calls.push({ method: 'get', pathName });
      return {
        success: true,
        rows: [
          {
            archive_file: 'exams/sync-exam.js',
            student_id: 's1',
            session_id: 'session-1',
            report_type: 'counsel',
            fields_json: JSON.stringify({ meaning: 'server meaning', parent: 'server parent' }),
            ai_json: JSON.stringify({ source: 'ai', summary: 'server ai summary' })
          }
        ]
      };
    }
  },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  toast: () => {},
  openReportCenterModal: () => {},
  console: { ...console, warn: () => {} },
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const saved = context.reportCenterSaveSchoolExamCounselReport('s1', 'sync-exam.js');
assert.equal(saved.meaning, 'local meaning');
assert.equal(calls[0].method, 'post');
assert.equal(calls[0].pathName, 'student-reports');
assert.equal(calls[0].body.archive_file, 'exams/sync-exam.js');
assert.equal(calls[0].body.student_id, 's1');
assert.equal(calls[0].body.session_id, 'session-1');
assert.equal(JSON.parse(calls[0].body.fields_json).meaning, 'local meaning');
assert.equal(context.reportCenterGetSavedCounselFields('s1', 'sync-exam.js').meaning, 'local meaning');

await context.reportCenterLoadStudentReportsFromServer('sync-exam.js');
assert.equal(calls.at(-1).method, 'get');
assert.match(calls.at(-1).pathName, /^student-reports\?archive_file=exams%2Fsync-exam\.js/);
assert.equal(context.reportCenterGetSavedCounselFields('s1', 'sync-exam.js').meaning, 'server meaning');
assert.equal(context.reportCenterGetCachedAiAnalysis('session-1').summary, 'server ai summary');

await context.reportCenterSyncStudentReportToServer('sync-exam.js', 's1', {
  report_type: 'counsel',
  session_id: 'session-1',
  ai_json: { source: 'ai', summary: 'fresh ai' }
});
assert.equal(calls.at(-1).method, 'post');
assert.equal(JSON.parse(calls.at(-1).body.ai_json).summary, 'fresh ai');

context.api.post = async () => { throw new Error('offline'); };
currentFormFields = [['meaning', 'offline local']];
const offline = context.reportCenterSaveSchoolExamCounselReport('s1', 'sync-exam.js');
assert.equal(offline.meaning, 'offline local');
assert.equal(
  JSON.parse(context.state.db.exam_analysis_meta[0].counsel_reports).s1.meaning,
  'offline local',
  'server sync failure must not break local persistence'
);

console.log('report student report sync test passed');
