const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-classroom.js'), 'utf8');

let updatedCell = null;
let updatedStudent = null;

const context = {
  console,
  JSON,
  String,
  Array,
  Number,
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
      return {
        timetable_cells: [
          {
            id: 'cell_alpha',
            day_label: '월',
            period_label: '1교시',
            class_name_raw: '중2 EIE A반',
            teacher_name_raw: '김원장',
            raw_meta_json: JSON.stringify({ teacher_names: ['김원장', '이선생'] }),
            assigned_students: [
              {
                assignment_id: 'assign_alpha',
                student_id: 'student_alpha',
                display_name: '알파',
                grade: '중2'
              }
            ]
          }
        ]
      };
    },
    async getStudents() {
      return {
        students: [
          {
            id: 'student_alpha',
            display_name: '알파',
            grade: '중2',
            school_name: '테스트중',
            phone: '010-1111-2222',
            memo: '기존 메모',
            status: 'active',
            raw_meta_json: JSON.stringify({
              student_type: '신입',
              parent_phone: '010-3333-4444',
              guardian_relation: '모',
              student_address: '서울시 테스트구',
              vehicle_info: '셔틀',
              student_pin: '1234',
              teacher_names: ['김원장']
            })
          }
        ]
      };
    },
    async getTeachers() {
      return {
        teachers: [
          { id: 'teacher_1', name: '김원장', role: 'admin' },
          { id: 'teacher_2', name: '이선생', role: 'teacher' },
          { id: 'teacher_3', name: '박선생', role: 'teacher' }
        ]
      };
    },
    async updateTimetableCell(cellId, payload) {
      updatedCell = { cellId, payload };
      return {
        timetable_cell: {
          id: cellId,
          day_label: '월',
          period_label: '1교시',
          class_name_raw: '중2 EIE A반',
          teacher_name_raw: payload.teacher_name_raw,
          raw_meta_json: JSON.stringify({ teacher_names: payload.teacher_names }),
          assigned_students: []
        }
      };
    },
    async updateStudent(studentId, payload) {
      updatedStudent = { studentId, payload };
      return { student: { id: studentId, ...payload } };
    }
  },
  EieRouter: {
    open() {}
  },
  document: {
    getElementById(id) {
      const fields = {
        'cls-edit-name': { value: '알파수정' },
        'cls-edit-student-type': { value: '재등록' },
        'cls-edit-grade': { value: '중3' },
        'cls-edit-school': { value: '수정중' },
        'cls-edit-phone': { value: '010-9999-0000' },
        'cls-edit-parent-phone': { value: '010-8888-0000' },
        'cls-edit-guardian-relation': { value: '부' },
        'cls-edit-address': { value: '부산시' },
        'cls-edit-vehicle': { value: '도보' },
        'cls-edit-pin': { value: '4321' },
        'cls-edit-status': { value: 'inactive' },
        'cls-edit-memo': { value: '수정 메모' }
      };
      return fields[id] || null;
    },
    querySelectorAll(selector) {
      if (selector === 'input[name="cls-cell-teacher"]:checked') {
        return [{ value: '김원장' }, { value: '박선생' }];
      }
      if (selector === 'input[name="cls-edit-teacher"]:checked') {
        return [{ value: '김원장' }, { value: '이선생' }];
      }
      return [];
    }
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(source, context, { filename: 'eie-classroom.js' });

(async () => {
  await context.EieClassroomView.render();
  context.EieClassroomView.openDetail('cell_alpha');
  let html = await context.EieClassroomView.render();

  assert(
    html.includes('김원장, 이선생'),
    'classroom detail should display all teacher_names stored on the class'
  );
  assert(
    html.includes('담임 수정'),
    'classroom detail should expose a teacher edit action'
  );

  context.EieClassroomView.openStudentDetail('assign_alpha');
  html = await context.EieClassroomView.render();
  assert(
    html.includes('학생구분') && html.includes('학부모 연락처') && html.includes('서울시 테스트구') && html.includes('클래스 담임'),
    'classroom student detail should render AP-style student info fields'
  );

  context.EieClassroomView.startStudentEdit();
  html = await context.EieClassroomView.render();
  assert(
    html.includes('cls-edit-parent-phone') && html.includes('cls-edit-student-type') && html.includes('cls-edit-pin'),
    'classroom student edit should render AP-style student info inputs'
  );

  await context.EieClassroomView.submitStudentEdit('student_alpha');
  assert.strictEqual(
    JSON.stringify(updatedStudent),
    JSON.stringify({
      studentId: 'student_alpha',
      payload: {
        display_name: '알파수정',
        grade: '중3',
        school_name: '수정중',
        phone: '010-9999-0000',
        student_phone: '010-9999-0000',
        parent_phone: '010-8888-0000',
        guardian_relation: '부',
        student_address: '부산시',
        vehicle_info: '도보',
        student_pin: '4321',
        student_type: '재등록',
        teacher_names: ['김원장', '이선생'],
        status: 'inactive',
        memo: '수정 메모'
      }
    }),
    'classroom student edit should save the same AP-style student payload'
  );

  context.EieClassroomView.openDetail('cell_alpha');
  html = await context.EieClassroomView.render();

  context.EieClassroomView.startCellTeachersEdit();
  html = await context.EieClassroomView.render();
  assert(
    html.includes('name="cls-cell-teacher"') && html.includes('박선생'),
    'classroom teacher editor should render teacher account names as checkboxes'
  );

  await context.EieClassroomView.submitCellTeachers('cell_alpha');
  assert.strictEqual(
    JSON.stringify(updatedCell),
    JSON.stringify({
      cellId: 'cell_alpha',
      payload: {
        teacher_name_raw: '김원장',
        teacher_names: ['김원장', '박선생']
      }
    }),
    'classroom teacher save should persist primary teacher and full teacher_names list'
  );

  console.log('EIE classroom multi-teacher regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
