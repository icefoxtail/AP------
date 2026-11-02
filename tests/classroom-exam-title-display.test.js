const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'apmath/js/classroom-planner.js'), 'utf8');
// 원내평가·OMR 통합 작업 화면(2026-11-02): 시험 목록·상세는 이 두 파일이 그리고, classroom-planner.js의 옛 진입은 그 화면을 연다.
const wsData = fs.readFileSync(path.join(root, 'apmath/js/ws-exam-data.js'), 'utf8');
const wsWorkspace = fs.readFileSync(path.join(root, 'apmath/js/ws-exam-workspace.js'), 'utf8');
const manualTitle = 'student-manual-title';
const archiveA = 'archive/exams/original/middle/m3/1final/25_yeonhyang_m3_final.js';
const archiveB = 'archive/exams/original/middle/m3/1final/25_other_m3_final.js';

let lastModal = null;
let apiPayload = {};

function makeSession(overrides = {}) {
  return {
    id: 'sess-1',
    student_id: 's1',
    exam_title: manualTitle,
    exam_date: '2026-07-02',
    archive_file: archiveA,
    question_count: 25,
    score: 94,
    ...overrides
  };
}

function makeAssignment(overrides = {}) {
  return {
    id: 'assign-1',
    class_id: 'c1',
    exam_title: manualTitle,
    exam_date: '2026-07-02',
    archive_file: archiveA,
    question_count: 25,
    ...overrides
  };
}

const context = {
  console,
  Date,
  Set,
  Map,
  String,
  Number,
  Math,
  encodeURIComponent,
  state: {
    db: {
      class_students: [{ class_id: 'c1', student_id: 's1' }],
      students: [{ id: 's1', name: 'Student One', status: '?ъ썝' }],
      exam_sessions: [],
      wrong_answers: [],
      classes: [{ id: 'c1', name: 'Class One' }]
    }
  },
  api: {
    get: async () => ({
      success: true,
      wrong_answers: [],
      exclusions: [],
      blueprints: [],
      ...apiPayload
    })
  },
  apEscapeHtml: value => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;'),
  apJsArg: value => JSON.stringify(String(value ?? '')),
  setModalReturnView: () => {},
  showModal: (title, html) => { lastModal = { title, html }; },
  setExamBlueprintsForFiles: () => {},
  ensureBlueprintsForSessions: async () => {},
  computeClassWeakUnits: () => [],
  renderWeakUnitSummary: () => ''
};

context.window = context;
vm.createContext(context);
context.toast = () => {};
context.confirm = () => true;
vm.runInContext(source, context, { filename: 'classroom-planner.js' });
vm.runInContext(wsData, context, { filename: 'ws-exam-data.js' });
vm.runInContext(wsWorkspace, context, { filename: 'ws-exam-workspace.js' });

async function renderListWith({ sessions = [], assignments = [] } = {}) {
  apiPayload = { sessions, assignments };
  lastModal = null;
  await context.openExamGradeView('c1');
  assert(lastModal, 'exam grade modal should render');
  return lastModal.html;
}

(async () => {
  let html = await renderListWith({
    sessions: [makeSession()],
    assignments: [makeAssignment()]
  });
  assert(html.includes('25_yeonhyang_m3_final'), 'combined row should show archive file name first');
  assert(!html.includes(`wsx-exam-item__title">${manualTitle}<`), 'combined row should not show manual title in visible title slot');

  await context.openExamDetail('c1', manualTitle, '2026-07-02', archiveA);
  assert(lastModal.html.includes('wsx-detail__title">25_yeonhyang_m3_final'), 'detail heading should show archive file name first');

  html = await renderListWith({ assignments: [makeAssignment()] });
  assert(html.includes('25_yeonhyang_m3_final'), 'assignment-only row should show archive file name first');

  html = await renderListWith({ sessions: [makeSession()] });
  assert(html.includes('25_yeonhyang_m3_final'), 'session-only row should show archive file name first');

  html = await renderListWith({
    sessions: [makeSession({ archive_file: archiveA })],
    assignments: [makeAssignment({ archive_file: archiveB })]
  });
  assert(html.includes('25_yeonhyang_m3_final'), 'archive mismatch should keep the session archive display title');

  const unitPastAssignment = makeAssignment({
    exam_title: 'unitpast_h1-through-2final-v2_H22-C2-03_102fc077',
    archive_file: 'MIXED:unitpast_h1-through-2final-v2_H22-C2-03_102fc077',
    mixed_payload_json: JSON.stringify({ meta: { title: '원의 방정식', unitName: '원의 방정식' } })
  });
  html = await renderListWith({ assignments: [unitPastAssignment] });
  assert(html.includes('원의 방정식 · 단원별 기출'), 'unit-past assignment should show its human-readable unit title');
  assert(!html.includes('wsx-exam-item__title">unitpast_h1-through-2final-v2_H22-C2-03_102fc077'), 'unit-past internal snapshot key should not be shown as the card title');
  assert.strictEqual(
    context.getClassroomExamDisplayTitle({
      exam_title: unitPastAssignment.exam_title,
      archive_file: unitPastAssignment.archive_file
    }),
    '원의 방정식 · 단원별 기출',
    'unit-past title fallback should resolve the H22-C2-03 key without payload metadata'
  );

  html = await renderListWith({
    sessions: [makeSession({ archive_file: '', exam_title: 'fallback-title' })],
    assignments: []
  });
  assert(html.includes('fallback-title'), 'empty archive should fall back to exam title');

  assert.strictEqual(
    context.getClassroomExamDisplayTitle({ archive_file: 'MIXED:custom-pack.js', exam_title: manualTitle }),
    'custom-pack',
    'MIXED archive display should strip prefix and .js'
  );

  console.log('classroom exam title display test passed');
})();
