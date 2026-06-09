const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const stateSource = fs.readFileSync(path.join(root, 'eie/js/eie-state.js'), 'utf8');
const viewSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');

function makeContext() {
  const session = {
    source_cell_ids: ['cellA'],
    session_id: 'sess-A',
    period_order: 1,
    period_label: '1교시',
    display_time_range: '오후 3:10~3:50',
    material: 'rs3-1',
    class_full_name: 'rs3-1 Carmen',
    day_teachers: { 월: ['Carmen'], 화: ['Carmen'] },
    students: [
      { student_id: 'stu1', name: '김채민', grade: '초3' },
      { student_id: 'stu2', name: '김하연', grade: '초4' }
    ]
  };
  const context = {
    console,
    Promise,
    Date,
    Array,
    JSON,
    Number,
    String,
    Object,
    Math,
    setTimeout,
    clearTimeout,
    window: {}
  };
  context.window.EieApp = {
    escapeHtml: value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]))
  };
  context.window.EieClassroomScope = {
    teacherKey: value => String(value == null ? '' : value).replace(/\s+/g, '').toLowerCase(),
    currentSession: () => ({ teacherName: '', role: 'owner', loginId: 'admin' }),
    isDirector: () => true
  };
  context.window.EieApi = {
    getTimetable: async () => ({ timetable_cells: [{ id: 'cellA' }] }),
    getAttendanceMonth: async () => ({ attendance_records: [] })
  };
  context.window.EieTimetableView = { _buildDisplaySessions: () => [{ ...session }] };
  context.window.EieRouter = { open() {} };
  context.global = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(stateSource, context);
  vm.runInContext(viewSource, context);
  ['EieState', 'EieApi', 'EieRouter', 'EieTimetableView', 'EieClassroomScope', 'EieApp', 'EieAttendanceView']
    .forEach(key => { context[key] = context.window[key]; });
  return context;
}

(async () => {
  const context = makeContext();
  context.window.EieState.setAttendanceViewDate('2026-06-08');
  const html = await context.window.EieAttendanceView.render();

  assert(html.includes('eie-att-time-corner'), 'attendance grid should add a left 교시/시간 header before 이름');
  assert(/eie-att-time-corner[\s\S]*eie-att-corner/.test(html), '교시/시간 header should render before the name header');
  assert(html.includes('eie-att-time-nc'), 'student rows should include a left time column');
  assert(html.includes('rowspan="2"'), 'one time cell should span the students in the class block');
  assert(/eie-att-time-nc[\s\S]*1교시[\s\S]*오후 3:10~3:50[\s\S]*김채민/.test(html), 'time cell should sit directly before the first student in the block');
  assert(!html.includes('1교시 오후 3:10~3:50 · Carmen'), 'time should not be rendered as a full-width group row above students');
  const timeCell = (html.match(/<td class="eie-att-time-nc"[\s\S]*?<\/td>/) || [''])[0];
  assert(timeCell.includes('rs3-1'), 'time cell should keep the class name');
  assert(!timeCell.includes('Carmen'), 'time cell should not repeat the teacher name');

  console.log('EIE attendance time column test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
