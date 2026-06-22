const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dashboardPath = path.join(root, 'eie/js/views/eie-dashboard.js');
const cssPath = path.join(root, 'eie/css/eie-dashboard-classroom.css');
const source = fs.readFileSync(dashboardPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

assert(!source.includes('openDashboardTeacherClassroom'), 'teacher classroom click navigation should be removed');
assert(!source.includes('openDashboardTeacherStudents'), 'teacher student click navigation should be removed');
assert(
  source.includes('admin-teacher-card__quick-action--static') &&
    source.includes('admin-teacher-card__quick-action--hover') &&
    source.includes('tabindex="0"'),
  'teacher quick actions should render as static and keyboard-focusable hover labels'
);
assert(
  source.includes('담임반 재원 ${esc(homeroomStudentCount)}명'),
  'the enrollment hover should show only the homeroom student total'
);
assert(
  css.includes('.admin-teacher-card__quick-action--hover:hover .eie-owner-stat__tip') &&
    css.includes('.admin-teacher-card__quick-action--hover:focus-within .eie-owner-stat__tip') &&
    css.includes('min-width: max-content') &&
    css.includes('white-space: nowrap'),
  'hover tooltip CSS should support mouse, keyboard focus, and single-line overflow protection'
);

const instrumented = source.replace(
  'window.EieDashboardView = { render, openStudentStatusFilter };',
  `window.EieDashboardView = { render, openStudentStatusFilter };
   window.__dashboardTeacherTest = {
     primaryTeacherOfCell,
     homeroomStudentCountForTeacher
   };`
);
const context = {
  window: {},
  console,
  Date,
  JSON,
  String,
  Array,
  Number,
  Set,
  Promise
};
context.window = context;
vm.createContext(context);
vm.runInContext(instrumented, context, { filename: 'eie-dashboard.js' });

const helpers = context.__dashboardTeacherTest;
assert(helpers, 'dashboard teacher helpers should be available to the focused test');

const cells = [
  {
    class_name: 'IVY-A',
    homeroom_teacher: 'IVY',
    teacher_names: ['IVY', 'Lily'],
    assigned_students: [{ id: 1 }, { id: 2 }, { id: 3 }]
  },
  {
    class_name: 'IVY-A',
    homeroom_teacher: 'IVY',
    teacher_names: ['IVY', 'Carmen'],
    assigned_students: [{ id: 1 }, { id: 2 }, { id: 3 }]
  },
  {
    class_name: 'IVY-B',
    raw_meta_json: JSON.stringify({
      homeroom_teacher: 'Foreigner',
      teacher_names: ['Foreigner', 'IVY']
    }),
    student_count: 4
  },
  {
    class_name: 'LILY-A',
    homeroom_teacher: 'Lily',
    teacher_names: ['Lily', 'IVY'],
    student_count: 6
  },
  {
    class_name: 'CARMEN-A',
    raw_meta_json: JSON.stringify({
      homeroom_teacher: '원어민'
    }),
    teacher_name_raw: 'Carmen',
    student_count: 5
  }
];

assert.strictEqual(
  helpers.primaryTeacherOfCell(cells[2]),
  'IVY',
  'Foreigner homeroom values should fall back to the first non-foreigner teacher'
);
assert.strictEqual(
  helpers.primaryTeacherOfCell(cells[4]),
  'Carmen',
  'top-level teacher fields should provide the same non-foreigner fallback as the timetable'
);
assert.strictEqual(
  helpers.homeroomStudentCountForTeacher('IVY', cells),
  7,
  'homeroom totals should deduplicate repeated classes and exclude classes merely taught by the teacher'
);
assert.strictEqual(
  helpers.homeroomStudentCountForTeacher('Zoe', cells),
  0,
  'teachers without a homeroom should keep a zero total'
);

console.log('EIE dashboard teacher homeroom hover regression test passed');
