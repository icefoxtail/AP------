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
          { name: 'Carmen', role: 'teacher' }
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

  assert(html.includes('Lily'), 'owner dashboard should render a Lily teacher card');
  assert(html.includes('EieClassroomView.openTeacher'), 'teacher card should link to classroom teacher scope');
  assert(!html.includes('EIE 선생님 1'), 'owner dashboard should not keep teacher placeholder cards');
  assert(html.includes('오늘 수업') && html.includes('미확인'), 'teacher cards should expose classroom operation metrics');
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
