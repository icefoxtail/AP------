const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');

const state = {
  db: {
    students: [
      { id: 'eie_student_alpha', display_name: 'Alpha Student', status: 'active', grade: '중1' },
      { id: 'eie_student_beta', display_name: 'Beta Student', status: 'active', grade: '중2' }
    ],
    student_contacts: [],
    consultations: [],
    class_students: [
      { id: 'link_alpha', student_id: 'eie_student_alpha', timetable_cell_id: 'cell_a', status: 'active' }
    ],
    timetable_cells: [
      { id: 'cell_a', class_name_raw: 'LT1', teacher_name_raw: 'IVY', raw_meta_json: '{"teacher_names":["IVY","Lily"]}' }
    ],
    attendance: []
  },
  ui: { eieApmsCompat: { loadedAt: Date.now() } }
};

let createdPayload = null;
let borrowedPanelContext = null;
let routerOpenCount = 0;
let mountedHtml = '';

const context = {
  console,
  Date,
  JSON,
  String,
  Array,
  EieApp: {
    escapeHtml(value) {
      return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[ch]));
    },
    async mount(html) {
      mountedHtml = html;
    }
  },
  EieState: {
    get() {
      return state;
    },
    upsertStudent(row) {
      state.db.students.push(row);
    },
    mergeStudentConsultations(studentId, rows) {
      state.db.consultations = state.db.consultations
        .filter(row => String(row.student_id || '') !== String(studentId))
        .concat(rows);
    }
  },
  EieApi: {
    isAuthError() {
      return false;
    },
    async createStudent(payload) {
      createdPayload = payload;
      return {
        student_id: 'new_student',
        student: {
          id: 'new_student',
          display_name: payload.display_name,
          raw_meta_json: JSON.stringify({ teacher_names: payload.teacher_names })
        }
      };
    },
    async getConsultations() {
      return { consultations: [] };
    },
    async getTeachers() {
      return {
        teachers: [
          { id: 'teacher_carmen', name: 'Carmen', role: 'teacher' },
          { id: 'teacher_ivy', name: 'IVY', role: 'teacher' },
          { id: 'teacher_lily', name: 'Lily', role: 'teacher' },
          { id: 'teacher_stacy', name: 'Stacy', role: 'teacher' },
          { id: 'teacher_zoe', name: 'Zoe', role: 'teacher' },
          { id: 'teacher_laura', name: 'Laura', role: 'teacher' }
        ]
      };
    }
  },
  EieApmsState: {
    syncStudent() {},
    async loadFoundation() {
      return { success: true };
    }
  },
  EieRouter: {
    open() {
      routerOpenCount += 1;
    }
  },
  EieTimetableView: {
    async renderPanelOnlyWithContext(ctx) {
      borrowedPanelContext = ctx;
      return '<aside class="eie-v2-ap-profile-panel" data-test-borrowed-student-detail="1">'
        + '<button type="button" data-eie-v2-student-detail-tab="basic">기본</button>'
        + '<button type="button" data-eie-v2-student-detail-tab="consultation">상담</button>'
        + '<button type="button" data-eie-v2-student-detail-tab="grades">성적</button>'
        + '<button type="button" data-eie-v2-student-edit>수정</button>'
        + '</aside>';
    }
  },
  confirm() {
    return true;
  }
};
context.window = context;
context.location = { hash: '#students' };
// GET /teachers 로스터는 원장 전용 경로다. owner 세션을 모사해야 전체 교사 계정이 필터에 노출된다.
context.localStorage = {
  _data: { WANGJI_EIE_ROLE: 'owner', WANGJI_EIE_LOGIN_ID: 'admin' },
  getItem(key) { return Object.prototype.hasOwnProperty.call(this._data, key) ? this._data[key] : null; },
  setItem(key, value) { this._data[key] = String(value); },
  removeItem(key) { delete this._data[key]; }
};

vm.createContext(context);
vm.runInContext(source, context, { filename: 'eie-students.js' });

(async () => {
  const html = await context.EieStudentsView.render();

  for (const teacherName of ['Carmen', 'IVY', 'Lily', 'Stacy', 'Zoe', 'Laura']) {
    assert(
      html.includes(`<option value="${teacherName}"`),
      `student management teacher filter should include teacher account ${teacherName}`
    );
  }

  assert(
    html.includes('onclick="EieStudentsView.openDetail(&quot;eie_student_alpha&quot;)"'),
    'student row click handler should HTML-escape string ids inside onclick'
  );
  assert(
    !html.includes('onclick="EieStudentsView.openDetail("'),
    'student row click handler should not emit nested raw quotes'
  );
  assert(
    html.includes('onchange="EieStudentsView.setGradeFilter(this.value)"') &&
      html.includes('onchange="EieStudentsView.setTeacherFilter(this.value)"') &&
      !html.includes('EieStudentsView.selectGradeCard') &&
      !html.includes('EieStudentsView.selectTeacherCard'),
    'student management should use grade and teacher dropdown filters instead of breakdown card handlers'
  );

  context.EieStudentsView.setGradeFilter('중2');
  const gradeFilterHtml = await context.EieStudentsView.render();
  assert(
    gradeFilterHtml.includes('Beta Student') &&
      !gradeFilterHtml.includes('Alpha Student'),
    'selecting a grade should show students from that grade in the visible student list'
  );

  context.EieStudentsView.setGradeFilter('all');
  context.EieStudentsView.setTeacherFilter('IVY');
  const teacherFilterHtml = await context.EieStudentsView.render();
  assert(
    teacherFilterHtml.includes('Alpha Student') &&
      !teacherFilterHtml.includes('Beta Student'),
    'selecting a teacher should show students connected to that teacher'
  );
  routerOpenCount = 0;

  await context.EieStudentsView.openDetail('eie_student_alpha', null, 'consultation');
  assert.strictEqual(routerOpenCount, 0, 'student selection inside student management should not reopen the route and show the skeleton');
  assert(mountedHtml.includes('data-test-borrowed-student-detail="1"'), 'student selection should update the current student page in place');
  const consultationHtml = await context.EieStudentsView.render();
  assert(
    consultationHtml.includes('data-test-borrowed-student-detail="1"') &&
      consultationHtml.includes('eie-v2-ap-profile-panel'),
    'student management detail should reuse the timetable student detail panel'
  );
  assert.strictEqual(borrowedPanelContext.studentId, 'eie_student_alpha', 'borrowed student detail should receive the selected student id');
  assert.strictEqual(borrowedPanelContext.studentName, 'Alpha Student', 'borrowed student detail should receive the selected student name');
  assert.strictEqual(borrowedPanelContext.studentDetailTab, 'consultation', 'borrowed student detail should receive the requested tab');
  assert.strictEqual(borrowedPanelContext.route, 'students', 'borrowed student detail should mount from the students route');
  assert.strictEqual(borrowedPanelContext.cellId, 'cell_a', 'borrowed student detail should receive the first assigned class id');
  assert(
    !consultationHtml.includes('eie-apms-tabs eie-apms-header-tabs') &&
      !consultationHtml.includes('eie-exam-form-card') &&
      !consultationHtml.includes('새 기록 입력'),
    'old student-management detail UI should not render when a student is selected'
  );
  assert(
    consultationHtml.includes('onclick="EieStudentsView.setTab(\'basic\')"') &&
      consultationHtml.includes('onclick="EieStudentsView.setTab(\'consultation\')"') &&
      consultationHtml.includes('onclick="EieStudentsView.setTab(\'grades\')"') &&
      consultationHtml.includes('onclick="EieStudentsView.startEdit()"'),
    'borrowed student detail controls should be handled by student management'
  );
  assert(
    !consultationHtml.includes('data-eie-v2-student-detail-tab=') &&
      !consultationHtml.includes('data-eie-v2-student-edit'),
    'borrowed student detail should not keep timetable-only click hooks for student-management controls'
  );

  await context.EieStudentsView.setTab('grades');
  await context.EieStudentsView.render();
  assert.strictEqual(borrowedPanelContext.studentDetailTab, 'grades', 'student-management tab changes should pass through to the borrowed timetable detail');

  context.EieStudentsView.startCreate();
  const createHtml = await context.EieStudentsView.render();
  assert(createHtml.includes('name="create-teacher"'), 'student create form should still render teacher checkboxes');

  context.document = {
    querySelectorAll(selector) {
      if (selector === 'input[name="create-teacher"]:checked') return [{ value: 'IVY' }];
      return [];
    },
    getElementById(id) {
      return {
        'create-name': { value: 'New Student' },
        'create-student-type': { value: 'regular' },
        'create-grade': { value: '중1' },
        'create-school': { value: 'School' },
        'create-phone': { value: '010-0000-0000' },
        'create-parent-phone': { value: '010-1111-1111' },
        'create-address': { value: 'Address' },
        'create-vehicle': { value: '' },
        'create-guardian-relation': { value: '' },
        'create-memo': { value: '' }
      }[id] || { value: '' };
    }
  };

  await context.EieStudentsView.submitCreate();
  assert.strictEqual(createdPayload.display_name, 'New Student', 'student create should still submit the entered name');
  assert.deepStrictEqual(createdPayload.teacher_names, ['IVY'], 'student create should still submit selected teachers');

  console.log('EIE student click handler regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
