const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const scopeSource = fs.readFileSync(path.join(root, 'eie/js/utils/eie-classroom-scope.js'), 'utf8');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-classroom.js'), 'utf8');

let savedAttendance = null;
let consultationRequest = null;
let savedConsultation = null;

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
      return {
        timetable_cells: [
          {
            id: 'cell_ivy_wed_lily',
            day_label: '수',
            period_label: '4교시',
            start_time: '17:10',
            end_time: '17:50',
            class_name_raw: '승재5',
            teacher_name_raw: 'IVY',
            raw_meta_json: JSON.stringify({
              homeroom_teacher: 'IVY',
              teacher_names: ['IVY'],
              day_teachers: { 월: ['IVY'], 수: ['Lily'], 금: ['IVY'] }
            }),
            assigned_students: [
              {
                assignment_id: 'assign_alpha',
                student_id: 'student_alpha',
                display_name: '알파',
                grade: '초5'
              }
            ]
          },
          {
            id: 'cell_carmen_only',
            day_label: '월',
            period_label: '1교시',
            class_name_raw: 'Carmen only',
            teacher_name_raw: 'Carmen',
            raw_meta_json: JSON.stringify({
              homeroom_teacher: 'Carmen',
              day_teachers: { 월: ['Carmen'] }
            }),
            assigned_students: []
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
            grade: '초5',
            status: 'active'
          }
        ]
      };
    },
    async getTeachers() {
      return { teachers: [{ id: 'teacher_lily', name: 'Lily', role: 'teacher' }] };
    },
    async getAttendanceRecords() {
      return { attendance_records: [] };
    },
    async saveAttendanceRecord(payload) {
      savedAttendance = payload;
      return {
        attendance_record: {
          id: 'att_alpha',
          student_id: payload.student_id,
          timetable_cell_id: payload.timetable_cell_id,
          date: payload.date,
          status: payload.status
        },
        attendance_records: [
          {
            id: 'att_alpha',
            student_id: payload.student_id,
            timetable_cell_id: payload.timetable_cell_id,
            date: payload.date,
            status: payload.status
          }
        ]
      };
    },
    async getConsultations(studentId) {
      return {
        consultations: [
          {
            id: 'consultation_existing',
            student_id: studentId,
            date: '2026-06-01',
            type: '학습',
            content: '기존 상담',
            next_action: '숙제 확인'
          }
        ]
      };
    },
    async createConsultation(payload) {
      savedConsultation = payload;
      return {
        consultation: { id: 'consultation_new', created_at: '2026-06-06 10:00:00', ...payload },
        consultations: [{ id: 'consultation_new', created_at: '2026-06-06 10:00:00', ...payload }]
      };
    }
  },
  EieState: {
    get() {
      return { db: { attendance: [] } };
    },
    mergeStudentAttendance() {},
    mergeStudentConsultations() {}
  },
  EieStudentsView: {
    createConsultation(studentId, draft) {
      consultationRequest = { studentId, draft };
    }
  },
  EieRouter: {
    open() {}
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(scopeSource, context, { filename: 'eie-classroom-scope.js' });
vm.runInContext(source, context, { filename: 'eie-classroom.js' });

(async () => {
  let html = await context.EieClassroomView.render();

  assert(
    html.includes('승재5') && !html.includes('Carmen only'),
    'teacher classroom should include classes where the teacher is a weekday/day teacher, not only homeroom classes'
  );

  context.EieClassroomView.openDetail('cell_ivy_wed_lily');
  html = await context.EieClassroomView.render();

  assert(html.includes('data-eie-class-attendance'), 'classroom should render the AP-style attendance toggle beside each student');
  assert(html.includes('data-eie-class-consultation'), 'classroom should render the AP-style consultation button beside each student');

  context.EieClassroomView.openStudentDetail('assign_alpha');
  html = await context.EieClassroomView.render();
  assert(html.includes('eie-classroom-consultation-section'), 'timetable student detail should render a consultation section');
  assert(html.includes('상담 추가'), 'timetable student detail should expose one consultation add action inside the consultation section');
  assert.strictEqual((html.match(/상담 추가/g) || []).length, 1, 'consultation add action should not be duplicated');
  assert(!html.includes('EieStudentsView.createConsultation'), 'timetable student detail should not bounce to the separate students screen for consultation entry');

  context.EieClassroomView.openStudentConsultationForm();
  html = await context.EieClassroomView.render();
  for (const field of ['cls-consultation-date', 'cls-consultation-type', 'cls-consultation-content', 'cls-consultation-next-action']) {
    assert(html.includes(`id="${field}"`), `timetable consultation form should render ${field}`);
  }

  const documentValues = {
    'cls-consultation-date': { value: '2026-06-06' },
    'cls-consultation-type': { value: '학습' },
    'cls-consultation-content': { value: '시간표 상세 상담' },
    'cls-consultation-next-action': { value: '다음 수업 확인' }
  };
  context.document.getElementById = id => documentValues[id] || null;
  await context.EieClassroomView.saveStudentConsultation('student_alpha', 'cell_ivy_wed_lily');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(savedConsultation)), {
    student_id: 'student_alpha',
    date: '2026-06-06',
    type: '학습',
    content: '시간표 상세 상담',
    next_action: '다음 수업 확인',
    raw_meta_json: { source: 'classroom', timetable_cell_id: 'cell_ivy_wed_lily' }
  }, 'timetable consultation save payload should include student, date, type, content, next action, and classroom source');

  await context.EieClassroomView.toggleAttendance('student_alpha', 'cell_ivy_wed_lily', '2026-06-06');
  assert.strictEqual(savedAttendance.student_id, 'student_alpha');
  assert.strictEqual(savedAttendance.timetable_cell_id, 'cell_ivy_wed_lily');
  assert.strictEqual(savedAttendance.date, '2026-06-06');
  assert.strictEqual(savedAttendance.status, '결석', 'first AP-style attendance toggle should move default 등원 to 결석');

  context.EieClassroomView.openConsultation('student_alpha', 'cell_ivy_wed_lily', '2026-06-06');
  assert.strictEqual(consultationRequest, null, 'classroom consultation shortcut should stay in the timetable detail panel');
  html = await context.EieClassroomView.render();
  assert(html.includes('id="cls-consultation-content"'), 'classroom consultation shortcut should open the local consultation form');
  assert(html.includes('value="2026-06-06"'), 'classroom consultation shortcut should carry the selected class date into the local form');

  console.log('EIE classroom port regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
