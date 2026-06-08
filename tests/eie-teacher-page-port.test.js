const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const router = fs.readFileSync(path.join(root, 'eie/js/eie-router.js'), 'utf8');
const management = fs.readFileSync(path.join(root, 'eie/js/views/eie-management.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'eie/js/eie-app.js'), 'utf8');
const scopeSource = fs.readFileSync(path.join(root, 'eie/js/utils/eie-classroom-scope.js'), 'utf8');
const teacherViewPath = path.join(root, 'eie/js/views/eie-teacher.js');

assert(fs.existsSync(teacherViewPath), 'EIE teacher view file should exist');
const teacherView = fs.readFileSync(teacherViewPath, 'utf8');

assert(index.includes('./js/views/eie-teacher.js'), 'EIE index should load teacher view before router');
assert(index.includes('./js/utils/eie-classroom-scope.js'), 'EIE index should load classroom scope before views');
assert(router.includes("teacher: () => EieTeacherView.render()"), 'EIE router should expose teacher route');
assert(management.includes('EieManagementView.openTeacherPage'), 'management should link teacher rows to teacher page');
assert(app.includes("window.location.hash = '#teacher'"), 'teacher sessions should default into #teacher instead of owner dashboard');

for (const token of [
  'window.EieTeacherView',
  'openTeacher',
  'matchTeacherNamesForCell',
  'ap-dashboard-shell',
  'ap-dashboard-action-grid--teacher-quick',
  '오늘일지',
  '오늘일정',
  '학급관리',
  '시간표',
  '출석부',
  '학생상담'
]) {
  assert(teacherView.includes(token), `teacher view should include ${token}`);
}

for (const forbidden of [
  'eie-apms-page-head',
  'eie-apms-summary-grid',
  'eie-apms-student-layout',
  'eie-admin-card-grid'
]) {
  assert(!teacherView.includes(forbidden), `teacher dashboard should not keep owner/student-management layout token ${forbidden}`);
}

const context = {
  window: {
    localStorage: {
      getItem(key) {
        if (key === 'WANGJI_EIE_NAME') return 'Laura';
        if (key === 'WANGJI_EIE_ROLE') return 'teacher';
        return '';
      }
    },
    alert(message) {
      context.alertMessage = message;
    }
  },
  document: undefined,
  EieApp: {
    escapeHtml(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  },
  EieRouter: { open(route) { context.openedRoute = route; } },
  EieClassroomView: {
    openCell(cellId) { context.openedClassroom = cellId; },
    openTodayForTeacher(teacherName) { context.openedTodayTeacher = teacherName; },
    openDetail(cellId) { context.openedClassroom = cellId; }
  },
  EieStudentsView: {
    openDetail(studentId, returnCtx, tab) {
      context.openedStudent = studentId;
      context.openedStudentReturnCtx = returnCtx;
      context.openedStudentTab = tab;
    },
    setTeacherFilter(teacherName) {
      context.teacherFilter = teacherName;
    }
  },
  EieState: {
    get() {
      return {
        db: {
          timetable_cells: [
            {
              id: 'cell-1',
              day_label: '오늘',
              period_label: '1교시',
              teacher_name_raw: 'Zoe',
              class_name_raw: '중1-1 Laura zoe',
              assigned_students: [{ student_id: 's1', display_name: 'A', grade: '중1' }]
            },
            {
              id: 'cell-2',
              day_label: '오늘',
              period_label: '2교시',
              teacher_name_raw: 'Carmen',
              class_name_raw: 'rs3-1 Carmen',
              assigned_students: []
            },
            {
              id: 'cell-3',
              day_label: '오늘',
              period_label: '3교시',
              teacher_name_raw: 'Laura',
              raw_meta_json: JSON.stringify({ teacher_names: ['Laura', 'Zoe'] }),
              class_name_raw: '고1 EIE A',
              assigned_students: [{ student_id: 's2', display_name: 'B', grade: '고1' }]
            }
          ],
          attendance: [
            { student_id: 's1', date: new Date().toLocaleDateString('sv-SE'), status: '등원' },
            { student_id: 's2', date: new Date().toLocaleDateString('sv-SE'), status: '결석' }
          ],
          attendance_records: []
        }
      };
    },
    setTimetableCells(rows) { context.cachedRows = rows; }
  },
  EieApi: {
    async getTimetable() {
      return { timetable_cells: [] };
    }
  },
  console
};
context.window.EieApp = context.EieApp;
context.window.EieRouter = context.EieRouter;
context.window.EieState = context.EieState;
context.window.EieApi = context.EieApi;
context.window.EieClassroomView = context.EieClassroomView;
context.window.EieStudentsView = context.EieStudentsView;
vm.createContext(context);
vm.runInContext(scopeSource, context, { filename: 'eie-classroom-scope.js' });
context.EieClassroomScope = context.window.EieClassroomScope;
vm.runInContext(teacherView, context, { filename: 'eie-teacher.js' });

const matcher = context.window.EieTeacherView.matchTeacherNamesForCell;
const cell = { teacher_name_raw: 'Zoe', class_name_raw: '중1-1 Laura zoe' };
assert.deepStrictEqual(Array.from(matcher(cell, ['Zoe', 'Laura', 'Carmen'])).sort(), ['Laura', 'Zoe'], 'joint class should match both direct and class-name teachers');
assert.strictEqual(matcher({ teacher_name_raw: 'LT5', class_name_raw: 'LT5 zoe' }, ['Zoe']).includes('LT5'), false, 'unknown class tokens should not become teachers');

(async () => {
  const html = await context.window.EieTeacherView.render();
  assert(html.includes('ap-dashboard-shell'), 'rendered teacher page should use AP dashboard shell');
  assert(html.includes('ap-dashboard-action-grid--teacher-quick'), 'rendered teacher page should keep AP quick-button layout');
  assert(html.includes('시간표') && html.includes('출석부') && html.includes('학생상담'), 'rendered quick actions should match requested EIE teacher actions');
  assert(html.includes('오늘일지') && html.includes('오늘일정') && html.includes('학급관리'), 'rendered page should copy AP teacher section order');
  assert(html.includes('전체') && html.includes('초등') && html.includes('중등'), 'class management should keep requested EIE teacher tab structure');
  assert(!html.includes('>고등<'), 'class management should not expose the removed high-school tab');
  assert(html.includes('중1-1 Laura zoe'), 'logged-in teacher should see joint assigned class');
  assert(html.includes('고1 EIE A'), 'logged-in teacher should see explicitly assigned class');
  assert(!html.includes('rs3-1 Carmen'), 'logged-in teacher should not see unrelated owner/other-teacher class');
  assert(html.includes('data-eie-teacher-empty-today') || html.includes('eie-teacher-schedule-row'), 'today schedule should render classroom-linked rows or a classroom empty state');
  assert(!html.includes('A 중1') && !html.includes('B 고1'), 'today schedule should not render arbitrary assigned students');
  assert(html.includes('등원 1'), 'class cards should use connected attendance data for present count');
  assert(html.includes('결석 1'), 'class cards should use connected attendance data for absent count');
  assert(!html.includes('eie-apms-page-head'), 'rendered teacher page should not contain owner/student-management page head');

  context.window.EieTeacherView.openTeacher('Laura');
  assert.strictEqual(context.openedRoute, 'teacher', 'openTeacher should navigate to teacher route');

  context.window.EieTeacherView.openTimetable();
  assert.strictEqual(context.openedRoute, 'timetable', 'time table button should open EIE timetable');

  context.window.EieTeacherView.openClassroom('cell-1');
  assert.strictEqual(context.openedClassroom, 'cell-1', 'class click should open classroom through openCell/openDetail');

  context.window.EieTeacherView.openTodayClassroom();
  assert.strictEqual(context.openedTodayTeacher, 'Laura', 'classroom shortcut should open today classroom for the logged-in teacher');

  context.window.EieTeacherView.openConsultations();
  assert.strictEqual(context.openedStudent, 's1', 'student consultation button should open the first assigned student');
  assert.strictEqual(context.openedStudentTab, 'consultation', 'student consultation button should open consultation tab');

  context.window.EieTeacherView.openAttendanceLedger();
  assert.strictEqual(context.openedStudent, 's1', 'attendance ledger button should open the first assigned student');
  assert.strictEqual(context.openedStudentTab, 'attendance', 'attendance ledger button should open attendance tab');

  console.log('EIE teacher page port test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
