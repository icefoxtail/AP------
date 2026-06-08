const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const fixture = require('./fixtures/eie-classroom-scope.fixture');

const root = path.resolve(__dirname, '..');
const scopeSource = fs.readFileSync(path.join(root, 'eie/js/utils/eie-classroom-scope.js'), 'utf8');
const teacherSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-teacher.js'), 'utf8');

let openedCell = '';
let openedTodayTeacher = '';

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
  EieState: {
    get() {
      return {
        db: {
          timetable_cells: fixture.cells,
          attendance: [
            { student_id: 'student_alpha', date: fixture.WEDNESDAY, status: '등원' }
          ],
          attendance_records: []
        },
        timetableCells: fixture.cells
      };
    },
    setTimetableCells() {}
  },
  EieApi: {
    async getTimetable() {
      return { timetable_cells: fixture.cells };
    }
  },
  EieClassroomView: {
    openCell(cellId) {
      openedCell = cellId;
    },
    openTodayForTeacher(name) {
      openedTodayTeacher = name;
    }
  },
  EieRouter: {
    open() {}
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(scopeSource, context, { filename: 'eie-classroom-scope.js' });
vm.runInContext(teacherSource, context, { filename: 'eie-teacher.js' });

(async () => {
  const html = await context.EieTeacherView.render();

  assert(html.includes('클래스룸'), 'teacher dashboard should expose a classroom shortcut');
  assert(html.includes('Seungjae 5'), 'teacher dashboard should show day-teacher classes, not only homeroom classes');
  assert(!html.includes('Carmen Only'), 'teacher dashboard should hide unrelated teacher-only classes');
  assert(!html.includes('보강'), 'teacher dashboard should not port the makeup tag panel');

  context.EieTeacherView.openClassroom('cell_ivy_wed_lily');
  assert.strictEqual(openedCell, 'cell_ivy_wed_lily', 'class row should enter classroom through openCell');

  context.EieTeacherView.openTodayClassroom();
  assert.strictEqual(openedTodayTeacher, 'Lily', 'classroom shortcut should enter today classroom for the current teacher name');

  assert(
    teacherSource.includes('EieClassroomScope.cellsForTeacher') &&
      !teacherSource.includes('cell.homeroom_teacher ===') &&
      !teacherSource.includes('day_teachers?.'),
    'teacher dashboard must use EieClassroomScope instead of direct teacher comparisons'
  );

  console.log('EIE teacher dashboard AP port test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
