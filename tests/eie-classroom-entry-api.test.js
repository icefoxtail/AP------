const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const fixture = require('./fixtures/eie-classroom-scope.fixture');

const root = path.resolve(__dirname, '..');
const scopeSource = fs.readFileSync(path.join(root, 'eie/js/utils/eie-classroom-scope.js'), 'utf8');
const classroomSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-classroom.js'), 'utf8');

const context = {
  console,
  JSON,
  String,
  Array,
  Number,
  Date,
  document: {
    getElementById() {
      return null;
    },
    querySelectorAll() {
      return [];
    }
  },
  localStorage: {
    getItem(key) {
      return {
        WANGJI_EIE_ROLE: 'teacher',
        WANGJI_EIE_LOGIN_ID: 'lily',
        WANGJI_EIE_NAME: 'Lily'
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
  EieApi: {
    async getTimetable() {
      return { timetable_cells: fixture.cells };
    },
    async getStudents() {
      return { students: [] };
    },
    async getTeachers() {
      return {
        teachers: Object.values(fixture.sessions).map(session => ({
          name: session.teacherName,
          role: session.role
        }))
      };
    },
    async getAttendanceRecords() {
      return { attendance_records: [] };
    }
  },
  EieState: {
    get() {
      return { db: { attendance: [] } };
    },
    mergeStudentAttendance() {}
  },
  EieRouter: {
    opened: [],
    open(route) {
      this.opened.push(route);
    }
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(scopeSource, context, { filename: 'eie-classroom-scope.js' });
vm.runInContext(classroomSource, context, { filename: 'eie-classroom.js' });

(async () => {
  assert.strictEqual(typeof context.EieClassroomView.openTeacher, 'function', 'openTeacher should be exposed');
  assert.strictEqual(typeof context.EieClassroomView.openCell, 'function', 'openCell should be exposed');
  assert.strictEqual(typeof context.EieClassroomView.openTodayForTeacher, 'function', 'openTodayForTeacher should be exposed');

  context.EieClassroomView.openTeacher('Lily');
  let html = await context.EieClassroomView.render();
  assert(html.includes('Seungjae 5'), 'openTeacher should filter classroom to the teacher access scope');
  assert(!html.includes('Carmen Only'), 'openTeacher should not show unrelated teacher classes');

  context.EieClassroomView.openCell('cell_ivy_wed_lily');
  html = await context.EieClassroomView.render();
  assert(html.includes('data-eie-class-attendance'), 'openCell should select the requested cell detail');

  context.EieClassroomView.openTodayForTeacher('Lily', fixture.SATURDAY);
  html = await context.EieClassroomView.render();
  assert(
    html.includes('data-eie-classroom-empty-today'),
    'openTodayForTeacher with no classes should open classroom and render an empty today state'
  );

  console.log('EIE classroom entry API test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
