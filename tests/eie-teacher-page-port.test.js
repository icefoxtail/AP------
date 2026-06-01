const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8');
const router = fs.readFileSync(path.join(root, 'eie/js/eie-router.js'), 'utf8');
const management = fs.readFileSync(path.join(root, 'eie/js/views/eie-management.js'), 'utf8');
const teacherViewPath = path.join(root, 'eie/js/views/eie-teacher.js');

assert(fs.existsSync(teacherViewPath), 'EIE teacher view file should exist');
const teacherView = fs.readFileSync(teacherViewPath, 'utf8');

assert(index.includes('./js/views/eie-teacher.js'), 'EIE index should load teacher view before router');
assert(router.includes("teacher: () => EieTeacherView.render()"), 'EIE router should expose teacher route');
assert(management.includes('EieManagementView.openTeacherPage'), 'management should link teacher rows to teacher page');
assert(teacherView.includes('window.EieTeacherView'), 'teacher view should expose EieTeacherView');
assert(teacherView.includes('openTeacher'), 'teacher view should expose openTeacher');
assert(teacherView.includes('matchTeacherNamesForCell'), 'teacher view should expose shared teacher matching helper');

const context = {
  window: {},
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
  EieState: {
    get() {
      return {
        db: {
          timetable_cells: [
            { id: 'cell-1', teacher_name_raw: 'Zoe', class_name_raw: '중1-1 Laura zoe', assigned_students: [{ student_id: 's1', display_name: 'A' }] },
            { id: 'cell-2', teacher_name_raw: 'Carmen', class_name_raw: 'rs3-1 Carmen', assigned_students: [] }
          ]
        }
      };
    },
    setTimetableCells(rows) { context.cachedRows = rows; }
  },
  EieApi: {
    async getTimetable() {
      return {
        timetable_cells: [
          { id: 'cell-1', teacher_name_raw: 'Zoe', class_name_raw: '중1-1 Laura zoe', assigned_students: [{ student_id: 's1', display_name: 'A' }] },
          { id: 'cell-2', teacher_name_raw: 'Carmen', class_name_raw: 'rs3-1 Carmen', assigned_students: [] }
        ]
      };
    }
  },
  console
};
context.window.EieApp = context.EieApp;
context.window.EieRouter = context.EieRouter;
context.window.EieState = context.EieState;
context.window.EieApi = context.EieApi;
vm.createContext(context);
vm.runInContext(teacherView, context);

const matcher = context.window.EieTeacherView.matchTeacherNamesForCell;
const cell = { teacher_name_raw: 'Zoe', class_name_raw: '중1-1 Laura zoe' };
assert.deepStrictEqual(Array.from(matcher(cell, ['Zoe', 'Laura', 'Carmen'])).sort(), ['Laura', 'Zoe'], 'joint class should match both direct and class-name teachers');
assert.strictEqual(matcher({ teacher_name_raw: 'LT5', class_name_raw: 'LT5 zoe' }, ['Zoe']).includes('LT5'), false, 'unknown class tokens should not become teachers');

context.window.EieTeacherView.openTeacher('Laura');
assert.strictEqual(context.openedRoute, 'teacher', 'openTeacher should navigate to teacher route');

console.log('EIE teacher page port test passed');
