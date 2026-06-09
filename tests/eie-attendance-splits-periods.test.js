const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const stateSource = fs.readFileSync(path.join(root, 'eie/js/eie-state.js'), 'utf8');
const viewSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');

function makeContext() {
  const session = {
    source_cell_ids: ['cell4', 'cell5'],
    session_id: 'merged-4-5',
    period_order: 4,
    period_label: '4~5\uAD50\uC2DC',
    display_time_range: '\uC624\uD6C4 5:10~6:30',
    material: 'Merged Class',
    class_full_name: 'Merged Class',
    day_teachers: { '\uC6D4': ['Carmen', 'Zoe'] },
    periods: [
      {
        source_cell_id: 'cell4',
        period_order: 4,
        period_label: '4\uAD50\uC2DC',
        start_time: '17:10',
        end_time: '17:50',
        display_time_range: '\uC624\uD6C4 5:10~5:50',
        day_teachers: { '\uC6D4': ['Carmen'] }
      },
      {
        source_cell_id: 'cell5',
        period_order: 5,
        period_label: '5\uAD50\uC2DC',
        start_time: '17:50',
        end_time: '18:30',
        display_time_range: '\uC624\uD6C4 5:50~6:30',
        day_teachers: { '\uC6D4': ['Zoe'] }
      }
    ],
    students: [{ student_id: 'stu1', name: 'Student One', grade: '\uCD083' }]
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
    getTimetable: async () => ({ timetable_cells: [{ id: 'cell4' }, { id: 'cell5' }] }),
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

  assert(html.includes('4\uAD50\uC2DC'), 'attendance grid should render the fourth period as its own block');
  assert(html.includes('5\uAD50\uC2DC'), 'attendance grid should render the fifth period as its own block');
  assert(html.includes('\uC624\uD6C4 5:10~5:50'), 'fourth period should keep its own time range');
  assert(html.includes('\uC624\uD6C4 5:50~6:30'), 'fifth period should keep its own time range');
  assert((html.match(/Merged Class/g) || []).length >= 2, 'each split period should keep the class label');
  assert(!html.includes('Carmen \u00B7 Merged Class') && !html.includes('Zoe \u00B7 Merged Class'),
    'period time cells should not repeat teacher names');
  assert(!html.includes('4~5\uAD50\uC2DC'), 'attendance grid should not render merged period labels as one block');

  console.log('EIE attendance splits periods test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
