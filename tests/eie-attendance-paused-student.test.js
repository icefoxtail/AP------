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
    day_teachers: { '\uC6D4': ['Carmen'] },
    students: [
      { student_id: 'active', name: 'Active Student', grade: '초3', status: 'active' },
      { student_id: 'paused', name: 'Paused Student', grade: '초4', status: 'paused' }
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

  const rows = html.match(/<tr>[\s\S]*?<\/tr>/g) || [];
  const activeRow = rows.find(row => row.includes('Active Student')) || '';
  const pausedRow = rows.find(row => row.includes('Paused Student')) || '';

  assert(activeRow.includes('eie-att-o-o'), 'active students should still default to ○ on class days');
  assert(pausedRow.includes('eie-att-no'), 'paused students should render a blank/no-class marker instead of attendance');
  assert(!pausedRow.includes('eie-att-o-o'), 'paused students should not show ○ in attendance cells');

  console.log('EIE attendance paused student test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
