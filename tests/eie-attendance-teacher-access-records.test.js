const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const stateSource = fs.readFileSync(path.join(root, 'eie/js/eie-state.js'), 'utf8');
const viewSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-attendance.js'), 'utf8');

function makeContext() {
  const sessionsByDay = {
    월: [{
      source_cell_ids: ['homeroom_cell'],
      session_id: 'homeroom_session',
      teacherName: 'Zoe',
      teacher_key: 'zoe',
      homeroom_teacher: 'Carmen',
      source_session: { homeroom_teacher: 'Carmen' },
      material: 'Carmen Homeroom',
      periods: [{ source_cell_id: 'homeroom_cell', period_order: 1, period_label: '1교시', display_time_range: '오후 3:10~3:50' }],
      students: [{ student_id: 'stu1', name: '담임반학생', grade: '초3' }]
    }, {
      source_cell_ids: ['shared_cell'],
      session_id: 'shared_session',
      teacherName: 'Zoe',
      teacher_key: 'zoe',
      material: 'Shared Carmen Class',
      periods: [{ source_cell_id: 'shared_cell', period_order: 1, period_label: '1교시', display_time_range: '오후 3:10~3:50' }],
      students: [{ student_id: 'stu3', name: '공유반학생', grade: '초5' }]
    }],
    화: [{
      source_cell_ids: ['record_cell'],
      session_id: 'record_session',
      teacherName: 'Zoe',
      teacher_key: 'zoe',
      material: 'Checked Other Teacher',
      periods: [{ source_cell_id: 'record_cell', period_order: 2, period_label: '2교시', display_time_range: '오후 3:50~4:30' }],
      students: [{ student_id: 'stu2', name: '기록학생', grade: '초4' }]
    }],
    목: [{
      source_cell_ids: ['shared_cell'],
      session_id: 'shared_session',
      teacherName: 'Carmen',
      teacher_key: 'carmen',
      material: 'Shared Carmen Class',
      periods: [{ source_cell_id: 'shared_cell', period_order: 1, period_label: '1교시', display_time_range: '오후 3:10~3:50' }],
      students: [{ student_id: 'stu3', name: '공유반학생', grade: '초5' }]
    }, {
      source_cell_ids: ['teaching_only_cell'],
      session_id: 'teaching_only_session',
      teacherName: 'Carmen',
      teacher_key: 'carmen',
      homeroom_teacher: 'Zoe',
      source_session: { homeroom_teacher: 'Zoe' },
      material: 'Carmen Teaching Only',
      periods: [{ source_cell_id: 'teaching_only_cell', period_order: 3, period_label: '3교시', display_time_range: '오후 4:30~5:10' }],
      students: [{ student_id: 'stu4', name: '수업반학생', grade: '초6' }]
    }, {
      source_cell_ids: ['slot_teacher_cell'],
      session_id: 'slot_teacher_session',
      teacherName: 'Carmen',
      teacher_key: 'carmen',
      source_session: { teacher_name_raw: 'Carmen' },
      material: 'Slot Teacher Not Homeroom',
      periods: [{ source_cell_id: 'slot_teacher_cell', period_order: 4, period_label: '4교시', display_time_range: '오후 5:10~5:50' }],
      students: [{ student_id: 'stu5', name: '비담임학생', grade: '초6' }]
    }, {
      source_cell_ids: ['inferred_homeroom_cell'],
      session_id: 'inferred_homeroom_session',
      teacherName: 'Carmen',
      teacher_key: 'carmen',
      homeroom_teacher: 'Carmen',
      source_session: {
        teacher_name_raw: 'Carmen',
        source_rows: [{
          teacher_name_raw: 'Carmen',
          class_name_raw: '3-2carmen',
          raw_meta_json: JSON.stringify({ original_class_title: '3-2carmen' })
        }]
      },
      material: 'Inferred Teacher Not Homeroom',
      periods: [{ source_cell_id: 'inferred_homeroom_cell', period_order: 5, period_label: '5교시', display_time_range: '오후 5:50~6:30' }],
      students: [{ student_id: 'stu6', name: '추론담임아님', grade: '중3' }]
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
    currentSession: () => ({ teacherName: 'Carmen', role: 'teacher', loginId: 'carmen' }),
    isDirector: () => false
  };
  context.window.EieApi = {
    getTimetable: async () => ({ timetable_cells: [] }),
    getAttendanceMonth: async () => ({
      attendance_records: [
        { id: 'r1', student_id: 'stu2', timetable_cell_id: 'record_cell', date: '2026-06-03', status: '등원', tags: '상담' },
        { id: 'r2', student_id: 'stu3', timetable_cell_id: 'shared_cell', date: '2026-06-04', status: '등원', tags: '상담' }
      ]
    })
  };
  context.window.EieTimetableView = {
    _buildDisplaySessions: () => [{ session_id: 'display' }],
    _buildDayTeacherSessions: (displaySessions, day) => (sessionsByDay[day] || []).map(session => ({ ...session }))
  };
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
  context.window.EieState.setAttendanceViewDate('2026-06-09');
  const view = context.window.EieAttendanceView;
  const html = await view.render();
  const body = html.split('eie-att-tbl-wrap')[1] || '';

  assert(!body.includes('Checked Other Teacher'), 'teacher scope should not show unrelated classes only because they have checked attendance records');
  assert(body.includes('Shared Carmen Class'), 'teacher should see every class they teach on at least one weekday');
  assert(body.includes('EieAttendanceView.openStudent(&quot;2026-06-01&quot;,&quot;shared_cell&quot;,&quot;stu3&quot;)'), 'a Carmen-taught class should keep non-Carmen weekday attendance cells visible');
  assert(body.includes('EieAttendanceView.openStudent(&quot;2026-06-04&quot;,&quot;shared_cell&quot;,&quot;stu3&quot;)'), 'a Carmen-taught class should keep Carmen weekday attendance cells visible');
  assert(body.includes('aria-label="상담"'), 'existing checked attendance marks should remain visible for classes inside the teacher scope');
  assert(html.includes('type="month"') && html.includes('value="2026-06"'), 'toolbar should expose a clickable month selector');
  assert(!html.includes('aria-label="선생님"'), 'teacher attendance view should not show the teacher picker');
  assert(!html.includes('aria-label="학년"'), 'teacher attendance view should not show the grade picker');
  assert(!html.includes('aria-label="반"'), 'teacher attendance view should not show the class picker');

  view.setScopeMode('homeroom');
  const homeroomBody = (await view.render()).split('eie-att-tbl-wrap')[1] || '';
  assert(homeroomBody.includes('Carmen Homeroom'), 'homeroom mode should keep homeroom classes');
  assert(!homeroomBody.includes('Carmen Teaching Only'), 'homeroom mode should hide teaching-only classes');
  assert(!homeroomBody.includes('Slot Teacher Not Homeroom'), 'homeroom mode should not treat teacher_name_raw as homeroom');
  assert(!homeroomBody.includes('Inferred Teacher Not Homeroom'), 'homeroom mode should not trust timetable-inferred homeroom_teacher without an explicit homeroom source field');

  view.setScopeMode('teaching');
  const teachingBody = (await view.render()).split('eie-att-tbl-wrap')[1] || '';
  assert(teachingBody.includes('Carmen Teaching Only'), 'teaching mode should keep classes taught by the teacher');
  assert(teachingBody.includes('Shared Carmen Class'), 'teaching mode should keep shared classes taught by the teacher');
  assert(teachingBody.includes('Inferred Teacher Not Homeroom'), 'teaching mode should still keep classes taught by teacher_name_raw');

  view.openTeacher('Zoe');
  const zoeBody = (await view.render()).split('eie-att-tbl-wrap')[1] || '';
  assert(zoeBody.includes('Shared Carmen Class'), 'every teacher should see shared monthly classes they teach on at least one weekday');
  assert(zoeBody.includes('EieAttendanceView.openStudent(&quot;2026-06-01&quot;,&quot;shared_cell&quot;,&quot;stu3&quot;)'), 'Zoe should keep her weekday attendance cells visible');
  assert(zoeBody.includes('EieAttendanceView.openStudent(&quot;2026-06-04&quot;,&quot;shared_cell&quot;,&quot;stu3&quot;)'), 'Zoe should also see the same shared class on another teacher weekday');

  view.setMonth('2026-07');
  assert.strictEqual(context.window.EieState.get().attendance.viewDate, '2026-07-01', 'month selector should move the attendance view to the first day of that month');

  console.log('EIE attendance teacher access records test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
