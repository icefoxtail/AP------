const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const stateSource = fs.readFileSync(path.join(root, 'eie/js/eie-state.js'), 'utf8');
const viewSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');

function makeContext() {
  const calls = [];
  const sessionsByDay = {
    월: [{
      source_cell_ids: ['mon_cell'],
      session_id: 'mon_session',
      teacherName: 'Carmen',
      teacher_key: 'carmen',
      material: 'Monday Class',
      periods: [{ source_cell_id: 'mon_cell', period_order: 1, period_label: '1교시', display_time_range: '오후 3:10~3:50' }],
      students: [{ student_id: 'stu1', name: '월학생', grade: '초3' }]
    }],
    화: [{
      source_cell_ids: ['tue_cell'],
      session_id: 'tue_session',
      teacherName: 'Zoe',
      teacher_key: 'zoe',
      material: 'Tuesday Class',
      periods: [{ source_cell_id: 'tue_cell', period_order: 2, period_label: '2교시', display_time_range: '오후 3:50~4:30' }],
      students: [{ student_id: 'stu2', name: '화학생', grade: '초4' }]
    }]
  };
  const context = {
    console, Promise, Date, Array, JSON, Number, String, Object, Math,
    setTimeout, clearTimeout, window: {}
  };
  context.window.EieApp = {
    escapeHtml: value => String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]))
  };
  context.window.EieClassroomScope = {
    teacherKey: value => String(value == null ? '' : value).replace(/\s+/g, '').toLowerCase(),
    currentSession: () => ({ teacherName: '', role: 'owner', loginId: 'admin' }),
    isDirector: () => true
  };
  context.window.EieApi = {
    getTimetable: async () => ({ timetable_cells: [{ id: 'raw_a' }, { id: 'raw_b' }] }),
    getAttendanceMonth: async () => ({ attendance_records: [] })
  };
  context.window.EieTimetableView = {
    _buildDisplaySessions(cells) {
      calls.push(['display', cells.length]);
      return [{ session_id: 'display' }];
    },
    _buildDayTeacherSessions(displaySessions, day) {
      calls.push(['day', day, displaySessions.length]);
      return (sessionsByDay[day] || []).map(session => ({ ...session }));
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
  context.window.EieState.setAttendanceViewDate('2026-06-09');
  const html = await context.window.EieAttendanceView.render();

  assert(calls.some(call => call[0] === 'day' && call[1] === '월'), 'monthly attendance should collect Monday helper sessions');
  assert(calls.some(call => call[0] === 'day' && call[1] === '화'), 'monthly attendance should collect Tuesday helper sessions');
  assert(html.includes('Monday Class') && html.includes('Tuesday Class'), 'monthly attendance should render classes from multiple weekdays together');

  assert(/data-date="2026-06-01"[\s\S]*data-date="2026-06-09"/.test(html), 'June 2026 date headers should include the baseline week');
  assert(html.includes('EieAttendanceView.openStudent(&quot;2026-06-01&quot;,&quot;mon_cell&quot;,&quot;stu1&quot;)'), 'Monday class should be editable from the 2026-06-01 baseline Monday');
  assert(html.includes('EieAttendanceView.openStudent(&quot;2026-06-08&quot;,&quot;mon_cell&quot;,&quot;stu1&quot;)'), 'Monday class should also be editable on the next Monday');
  assert(!html.includes('EieAttendanceView.openStudent(&quot;2026-06-02&quot;,&quot;mon_cell&quot;,&quot;stu1&quot;)'), 'Monday class should not be marked editable on Tuesday');
  assert(html.includes('EieAttendanceView.openStudent(&quot;2026-06-02&quot;,&quot;tue_cell&quot;,&quot;stu2&quot;)'), 'Tuesday class should be editable on the baseline Tuesday');
  assert(html.includes('EieAttendanceView.openStudent(&quot;2026-06-09&quot;,&quot;tue_cell&quot;,&quot;stu2&quot;)'), 'Tuesday class should be editable on the selected Tuesday');

  console.log('EIE attendance month weekday baseline test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
