const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dashboardSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-dashboard.js'), 'utf8');
const timetableSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable-v2.js'), 'utf8');

assert(
  dashboardSource.includes('data-eie-route="timetable-v2"'),
  'dashboard timetable action should route to canonical timetable-v2'
);

assert(
  !dashboardSource.includes('data-eie-route="timetable"'),
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
vm.runInContext(timetableSource, context, { filename: 'eie-timetable-v2.js' });

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
  let html = await context.EieTimetableV2View.render();

  assert(
    html.includes('data-eie-v2-student-id="student_alpha"'),
    'timetable-v2 should render stable student ids on clickable student buttons'
  );

  assert(
    html.includes('data-eie-v2-student-name="Beta"'),
    'timetable-v2 should render a name fallback when a stable student id is unavailable'
  );

  assert(
    !/phone|tel|전화|연락처/i.test(html),
    'timetable-v2 student chips should not expose phone fields before opening a student detail panel'
  );

  assert.strictEqual(typeof clickHandler, 'function', 'timetable-v2 should bind its delegated click handler');
  assert(
    html.includes('Teacher A, Teacher B'),
    'timetable-v2 should display multiple class teachers stored in raw_meta_json.teacher_names'
  );

  const detailButton = {
    textContent: 'Alpha',
    getAttribute(name) {
      return {
        'data-eie-v2-student-id': 'student_alpha',
        'data-eie-v2-student-name': '',
        'data-eie-v2-return-day': '월',
        'data-eie-v2-return-session': 'session_alpha',
        'data-eie-v2-return-cell': 'cell_alpha'
      }[name] || '';
    }
  };

  dispatchClosest({ selector: '[data-eie-v2-student-id]', node: detailButton });
  html = await context.EieTimetableV2View.render();

  assert(html.includes('학생 수정'), 'clicking a timetable student should open the student edit panel immediately');
  assert(html.includes('Alpha School'), 'student edit panel should use the confirmed student record from state');
  assert(html.includes('eie-v2-edit-parent-phone'), 'student edit panel should render parent phone field');
  assert(html.includes('eie-v2-edit-student-type'), 'student edit panel should render student type field');
  assert(html.includes('eie-v2-edit-pin'), 'student edit panel should render PIN field');
  assert(html.includes('data-eie-v2-student-save'), 'student edit panel should render a save action');
  assert(html.includes('eie-v2-edit-name'), 'student edit panel should render editable fields');

  const addressIndex = html.indexOf('eie-v2-edit-address');
  const vehicleIndex = html.indexOf('eie-v2-edit-vehicle');
  const teacherIndex = html.indexOf('eie-v2-student-teacher-picker');
  const extraIndex = html.indexOf('eie-v2-extra-fields');
  const guardianIndex = html.indexOf('eie-v2-edit-guardian-relation');
  assert(addressIndex >= 0 && addressIndex < extraIndex, 'address should stay visible before the extra info drawer');
  assert(vehicleIndex >= 0 && vehicleIndex < extraIndex, 'vehicle should stay visible before the extra info drawer');
  assert(teacherIndex >= 0 && teacherIndex < extraIndex, 'teacher picker should sit directly above the extra info drawer');
  assert(guardianIndex > extraIndex, 'guardian relation should move into the extra info drawer');

  dispatchClosest({ selector: '[data-eie-v2-student-save]', node: {} });
  await Promise.resolve();
  await Promise.resolve();

  assert.strictEqual(updatedStudent.studentId, 'student_alpha');
  assert.strictEqual(JSON.stringify(updatedStudent.payload), JSON.stringify({
    display_name: 'Alpha Edited',
    name: 'Alpha Edited',
    grade: 'G8',
    school_name: 'Edited School',
    phone: '010-9999-0000',
    student_phone: '010-9999-0000',
    parent_phone: '010-8888-0000',
    guardian_relation: '모',
    student_address: '부산시',
    vehicle_info: '셔틀',
        student_pin: '4321',
        student_type: '신입',
        teacher_names: ['Teacher A', 'Teacher B'],
        status: 'inactive',
    memo: 'edited memo'
  }));

  console.log('EIE timetable-v2 student detail panel regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
