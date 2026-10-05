const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const stateSource = fs.readFileSync(path.join(root, 'eie/js/eie-state.js'), 'utf8');
const viewSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');

function makeContext() {
  const sourceSession = {
    source_cell_ids: ['raw_cell'],
    session_id: 'raw-session',
    period_order: 1,
    period_label: '1교시',
    display_time_range: '오후 3:10~3:50',
    material: 'Raw Class',
    day_teachers: { 월: ['Raw Teacher'] },
    students: [{ student_id: 'raw', name: 'Raw Student' }]
  };
  const helperSession = {
    source_cell_ids: ['helper_cell'],
    session_id: 'helper-session',
    teacherName: 'Helper Teacher',
    teacher_key: 'helperteacher',
    material: 'Helper Class',
    class_name: 'Helper Class',
    class_full_name: 'Helper Class',
    period_order: 2,
    period_label: '2교시',
    start_time: '15:50',
    end_time: '16:30',
    display_time_range: '오후 3:50~4:30',
    students: [{ student_id: 'helper', name: 'Helper Student' }],
    periods: [{
      source_cell_id: 'helper_cell',
      period_order: 2,
      period_label: '2교시',
      start_time: '15:50',
      end_time: '16:30',
      display_time_range: '오후 3:50~4:30'
    }]
  };
  const calls = [];
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
    getTimetable: async () => ({ timetable_cells: [{ id: 'raw_cell' }] }),
    getAttendanceMonth: async () => ({ attendance_records: [] })
  };
  context.window.EieTimetableView = {
    _buildDisplaySessions: () => [{ ...sourceSession }],
    _buildDayTeacherSessions: (sessions, day) => {
      calls.push({ sessions, day });
      return [{ ...helperSession }];
    }
  };
  context.window.EieRouter = { open() {} };
  context.global = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(stateSource, context);
  vm.runInContext(viewSource, context);
  ['EieState', 'EieApi', 'EieRouter', 'EieTimetableView', 'EieClassroomScope', 'EieApp', 'EieAttendanceView']
    .forEach(key => { context[key] = context.window[key]; });
  return { context, calls };
}

(async () => {
  const { context, calls } = makeContext();
  context.window.EieState.setAttendanceViewDate('2026-06-08');
  const html = await context.window.EieAttendanceView.render();

  assert.strictEqual(calls.length > 0, true, 'attendance should call timetable day-teacher helper');
  assert.strictEqual(calls[0].day, '월', 'attendance should pass the selected weekday to the helper');
  assert(html.includes('Helper Class'), 'attendance should render helper day-teacher sessions');
  assert(html.includes('Helper Student'), 'attendance should render helper students');
  assert(!html.includes('Raw Teacher · Raw Class'), 'attendance should not render its own raw session interpretation');
  assert(!html.includes('Raw Student'), 'attendance should not render raw-session-only students');

  console.log('EIE attendance uses day-teacher helper test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
