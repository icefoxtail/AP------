const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const fixture = require('./fixtures/eie-classroom-scope.fixture');

const root = path.resolve(__dirname, '..');
const scopeSource = fs.readFileSync(path.join(root, 'eie/js/utils/eie-classroom-scope.js'), 'utf8');
const dashboardSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');

const context = {
  console,
  JSON,
  String,
  Array,
  Number,
  Date,
  localStorage: {
    getItem(key) {
      return {
        WANGJI_EIE_ROLE: 'owner',
        WANGJI_EIE_LOGIN_ID: 'admin',
        WANGJI_EIE_NAME: 'Owner'
      }[key] || '';
    }
  },
  EieApp: {
    escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch]));
    }
  },
  EieState: {
    get() {
      return {
        timetableCells: [],
        studentSeeds: [],
        needsReview: []
      };
    },
    setTimetableCells() {},
    setStudentSeeds() {},
    setNeedsReview() {}
  },
  EieApi: {
    async getTimetable() {
      return { timetable_cells: fixture.cells };
    },
    async getStudentSeeds() {
      return { students: [] };
    },
    async getNeedsReview() {
      return { needs_review: [] };
    },
    async getTeachers() {
      return {
        teachers: [
          { name: 'IVY', role: 'teacher' },
          { name: 'Lily', role: 'teacher' },
          { name: 'Carmen', role: 'teacher' },
          { name: 'Laura', role: 'teacher' },
          { name: 'Foreigner', role: 'teacher' }
        ]
      };
    },
    async getAttendanceRecords() {
      return {
        attendance_records: [
          { student_id: 'student_alpha', timetable_cell_id: 'cell_ivy_wed_lily', date: fixture.WEDNESDAY, status: '등원' }
        ]
      };
    }
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(scopeSource, context, { filename: 'eie-classroom-scope.js' });
vm.runInContext(dashboardSource, context, { filename: 'eie-dashboard.js' });

(async () => {
  const html = await context.EieDashboardView.render();

  for (const teacherName of ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily', 'Foreigner']) {
    assert(html.includes(`>${teacherName}`), `owner dashboard should render the approved ${teacherName} teacher card`);
  }
  assert(html.includes('Lily'), 'owner dashboard should render a Lily teacher card');
  assert(!html.includes('>Laura'), 'owner dashboard should hide non-roster teacher Laura');
  for (const teacherName of ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily']) {
    assert(
      html.includes(`EieTeacherView.openTeacher(&quot;${teacherName}&quot;)`),
      `${teacherName} card should link to teacher dashboard scope`
    );
  }
  assert(!html.includes('EieTeacherView.openTeacher(&quot;Foreigner&quot;)'), 'Foreigner card should not link to a teacher dashboard');
  assert(!html.includes('클래스룸'), 'teacher cards should not render the classroom quick-action chip');
  assert(!html.includes('EIE 선생님 1'), 'owner dashboard should not keep teacher placeholder cards');
  assert(html.includes('eie-admin-teacher-periods'), 'teacher cards should render period rows');
  assert(html.includes('eie-admin-teacher-period-no'), 'teacher cards should render period numbers');
  assert(html.includes('eie-admin-teacher-period-class'), 'teacher cards should render period class names');
  assert((html.match(/eie-admin-teacher-period-row/g) || []).length >= 4, 'teacher cards should render visible period row HTML');
  assert(html.includes('Malformed Raw') || html.includes('Raw Meta Stacy'), 'teacher cards should show today class names');
  assert(html.includes('>1</span>'), 'teacher cards should show period numbers');
  assert(html.includes('eie-admin-teacher-period-class is-empty'), 'teacher cards should keep empty-period rows with a blank class cell');
  assert(!html.includes('>-</span>'), 'teacher cards should not render a dash for empty periods');
  assert(!html.includes('미확인'), 'teacher cards should not emphasize attendance metric counts');
  assert(!html.includes('담당/보조'), 'teacher cards should not emphasize assigned/support metric counts');
  assert(!html.includes('onclick="EieTeacherView.openTeacher("'), 'teacher cards should not render broken inline onclick quoting');
  assert(
    dashboardSource.includes('EieClassroomScope.cellsForTeacher') &&
      !dashboardSource.includes('homeroom_teacher ==='),
    'owner dashboard teacher metrics must use EieClassroomScope instead of direct teacher comparisons'
  );

  console.log('EIE owner dashboard classroom link test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
