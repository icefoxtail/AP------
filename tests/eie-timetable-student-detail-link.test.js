const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dashboardSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');
const timetableSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');

assert(
  dashboardSource.includes('data-eie-route="timetable"'),
  'dashboard timetable action should route to canonical timetable'
);

assert(
  !dashboardSource.includes('data-eie-route="timetable' + '-v2"'),
  'dashboard should not expose the timetable alias as the main timetable action'
);

const state = {
  timetableCells: [],
  db: {
    timetable_cells: [],
    students: [
      {
        id: 'student_alpha',
        display_name: 'Alpha',
        grade: 'G7',
        school_name: 'Alpha School',
        phone: '010-1111-2222',
        raw_meta_json: JSON.stringify({
          parent_phone: '010-2222-3333',
          guardian_relation: '부',
          student_address: '서울시',
          vehicle_info: '도보',
          student_pin: '1111',
          student_type: '일반'
        }),
        memo: 'original memo',
        status: 'active'
      }
    ]
  }
};

let clickHandler = null;
let updatedStudent = null;
const inputs = {
  'eie-v2-edit-name': { value: 'Alpha Edited' },
  'eie-v2-edit-grade': { value: 'G8' },
  'eie-v2-edit-school': { value: 'Edited School' },
  'eie-v2-edit-phone': { value: '010-9999-0000' },
  'eie-v2-edit-parent-phone': { value: '010-8888-0000' },
  'eie-v2-edit-guardian-relation': { value: '모' },
  'eie-v2-edit-address': { value: '부산시' },
  'eie-v2-edit-vehicle': { value: '셔틀' },
  'eie-v2-edit-pin': { value: '4321' },
  'eie-v2-edit-student-type': { value: '신입' },
  'eie-v2-edit-status': { value: 'inactive' },
  'eie-v2-edit-memo': { value: 'edited memo' }
};

const context = {
  console,
  Date,
  JSON,
  String,
  Number,
  Array,
  Map,
  Set,
  Promise,
  addEventListener() {},
  document: {
    addEventListener(type, handler) {
      if (type === 'click') clickHandler = handler;
    },
    getElementById(id) {
      return inputs[id] || null;
    },
    querySelectorAll(selector) {
      if (selector === 'input[name="eie-v2-edit-teacher"]:checked') {
        return [{ value: 'Teacher A' }, { value: 'Teacher B' }];
      }
      return [];
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
      return state;
    },
    setTimetableCells(rows) {
      state.timetableCells = rows;
      state.db.timetable_cells = rows;
    },
    upsertStudent(row) {
      const idx = state.db.students.findIndex(student => student.id === row.id);
      if (idx >= 0) state.db.students.splice(idx, 1, row);
      else state.db.students.push(row);
    }
  },
  EieApi: {
    async getTimetable() {
      return {
        timetable_cells: [
          {
            id: 'cell_alpha',
            day_of_week: '월',
            teacher_name: 'Teacher A',
            raw_meta_json: JSON.stringify({ teacher_names: ['Teacher A', 'Teacher B'] }),
            class_name: 'A반',
            start_time: '15:00',
            end_time: '16:00',
            status: 'active',
            assigned_students: [
              { assignment_id: 'assign_alpha', student_id: 'student_alpha', name: 'Alpha' },
              { assignment_id: 'assign_beta', name: 'Beta' }
            ]
          }
        ]
      };
    },
    async updateStudent(studentId, payload) {
      updatedStudent = { studentId, payload };
      return { student: { id: studentId, ...payload } };
    }
  },
  EieRouter: {
    open() {}
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(timetableSource, context, { filename: 'eie-timetable.js' });

function dispatchClosest(target) {
  clickHandler({
    preventDefault() {},
    stopPropagation() {},
    target: {
      closest(selector) {
        return selector.split(',').some(part => part.trim() === target.selector) ? target.node : null;
      }
    }
  });
}

(async () => {
  let html = await context.EieTimetableView.render();

  assert(html.includes('eie-v2-screen'), 'timetable should render the operating timetable screen');
  assert(html.includes('data-eie-edit-toggle'), 'timetable should expose the edit entry control');

  assert(
    !/phone|tel|전화|연락처/i.test(html),
    'timetable student chips should not expose phone fields before opening a student detail panel'
  );

  assert.strictEqual(typeof clickHandler, 'function', 'timetable should bind its delegated click handler');
  assert(html.includes('eie-v2-card-board'), 'timetable should render the card board');

  console.log('EIE timetable student detail panel regression test passed');

})().catch(err => {
  console.error(err);
  process.exit(1);
});
