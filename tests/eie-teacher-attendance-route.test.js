const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const teacherSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-teacher.js'), 'utf8');
const indexSource = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');

assert(
  teacherSource.includes('onclick="EieTeacherView.openAttendanceLedger()"') &&
    !/title="준비중"[\s\S]*출석부/.test(teacherSource),
  'teacher attendance shortcut should be enabled and call openAttendanceLedger'
);

assert(
  /openAttendanceLedger:\s*function\s*\(\s*\)\s*\{[\s\S]*EieAttendanceView\.openTeacher\(_teacherName\)/.test(teacherSource),
  'teacher attendance shortcut should open the teacher-scoped attendance ledger'
);

assert(
  indexSource.includes('./js/views/eie-timetable.js?v=20260609') &&
    indexSource.includes('./js/views/eie-attendance.js?v=20260609') &&
    indexSource.includes('./js/views/eie-teacher.js?v=20260609'),
  'EIE changed timetable/attendance/teacher scripts should have cache-busting versions'
);

function makeContext() {
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
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]))
  };
  context.window.EieClassroomScope = {
    teacherKey: value => String(value == null ? '' : value).replace(/\s+/g, '').toLowerCase()
  };
  context.window.localStorage = {
    getItem(key) {
      if (key === 'WANGJI_EIE_NAME') return 'Carmen';
      if (key === 'WANGJI_EIE_ROLE') return 'teacher';
      return '';
    }
  };
  context.window.EieState = {
    get: () => ({ db: {}, timetableCells: [] }),
    setTimetableCells() {}
  };
  context.window.EieApi = {
    getTimetable: async () => ({ timetable_cells: [{ id: 'raw_cell' }] })
  };
  context.window.EieRouter = {
    open(route) { calls.push(['route', route]); }
  };
  context.window.EieAttendanceView = {
    openTeacher(name) { calls.push(['attendanceTeacher', name]); }
  };
  const helperSession = {
    source_cell_ids: ['helper_cell'],
    session_id: 'helper_session',
    teacherName: 'Carmen',
    teacher_key: 'carmen',
    material: 'Helper Class',
    class_name: 'Helper Class',
    periods: [{ period_order: 2, period_label: '2교시', display_time_range: '오후 3:50~4:30' }],
    students: [{ student_id: 's1', display_name: 'Helper Student', grade: '초4' }]
  };
  context.window.EieTimetableView = {
    _buildDisplaySessions(cells) {
      calls.push(['display', cells.length]);
      return [{ session_id: 'display_session' }];
    },
    _buildDayTeacherSessions(displaySessions, day) {
      calls.push(['dayTeacher', day, displaySessions.length]);
      return [{ ...helperSession }];
    }
  };
  context.global = context;
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(teacherSource, context);
  ['EieTeacherView', 'EieAttendanceView', 'EieTimetableView', 'EieRouter', 'EieApi', 'EieState', 'EieClassroomScope', 'EieApp']
    .forEach(key => { context[key] = context.window[key]; });
  return { context, calls };
}

(async () => {
  const { context, calls } = makeContext();
  const view = context.window.EieTeacherView;
  view.openTeacher('Carmen');
  view.setDay('mon');
  let html = await view.render();

  assert(calls.some(call => call[0] === 'dayTeacher' && call[1] === '월'), 'teacher weekday schedule should call timetable day-teacher helper');
  assert(html.includes('Helper Class'), 'teacher weekday schedule should render helper sessions');
  assert(html.includes('재원1'), 'teacher weekday schedule should render helper session student counts');
  assert(!html.includes('raw_cell'), 'teacher weekday schedule should not render raw cells when helper results exist');

  view.openAttendanceLedger();
  assert(calls.some(call => call[0] === 'attendanceTeacher' && call[1] === 'Carmen'), 'teacher attendance action should pass teacher name to attendance view');

  console.log('EIE teacher attendance route test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
