const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/views/eie-students.js'), 'utf8');

const state = {
  db: {
    students: [
      { id: 'eie_student_alpha', display_name: '김테스트', status: 'active' },
      { id: 'eie_student_imported', display_name: '박임포트', status: 'imported', raw_meta_json: '{"school_name":"임포트중"}' }
    ],
    student_contacts: [],
    consultations: [],
    class_students: [
      { id: 'link_alpha', student_id: 'eie_student_alpha', timetable_cell_id: 'cell_a', status: 'active' }
    ],
    timetable_cells: [
      { id: 'cell_a', teacher_name_raw: '김원장', raw_meta_json: '{"teacher_names":["김원장","박선생"]}' },
      { id: 'cell_b', teacher_name_raw: '이선생' }
    ]
  },
  ui: { eieApmsCompat: { loadedAt: Date.now() } }
};
let createdPayload = null;

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
    }
  },
  EieState: {
    get() {
      return state;
    },
    upsertStudent(row) {
      state.db.students.push(row);
    }
  },
  EieApi: {
    isAuthError() {
      return false;
    },
    async createStudent(payload) {
      createdPayload = payload;
      return { student_id: 'new_student', student: { id: 'new_student', display_name: payload.display_name, raw_meta_json: JSON.stringify({ teacher_names: payload.teacher_names }) } };
    }
  },
  EieApmsState: {
    syncStudent() {},
    async loadFoundation() {
      return { success: true };
    }
  },
  EieRouter: {
    open() {}
  }
};
context.window = context;

vm.createContext(context);
vm.runInContext(source, context, { filename: 'eie-students.js' });

(async () => {
  const html = await context.EieStudentsView.render();

  assert(
    html.includes('onclick="EieStudentsView.openDetail(&quot;eie_student_alpha&quot;)"'),
    'student row click handler should HTML-escape string ids inside onclick'
  );

  assert(
    !html.includes('onclick="EieStudentsView.openDetail("'),
    'student row click handler should not emit nested raw quotes'
  );

  assert.strictEqual(
    (html.match(/class="eie-apms-student-row(?: is-selected)?"/g) || []).length,
    2,
    'imported confirmed students should be treated as active in the default list'
  );

  assert(
    html.includes('임포트중'),
    'student list should render school_name stored in raw_meta_json when the D1 schema has no school column'
  );

  assert(
    !html.includes('APMS 학생관리 흐름에 맞춰'),
    'student management header should not show the old APMS explanatory copy'
  );

  assert.strictEqual(
    (html.match(/\+ 신규 등록/g) || []).length,
    1,
    'student management should keep only one new-student button'
  );

  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    assert(html.includes(`>${grade}</button>`), `student management should render ${grade} grade filter`);
  }

  assert(
    html.includes('EieStudentsView.setTeacherFilter') && html.includes('박선생'),
    'student management should render teacher filters from class teacher_names'
  );

  context.EieStudentsView.setTeacherFilter('박선생');
  const teacherFilteredHtml = await context.EieStudentsView.render();
  assert(
    teacherFilteredHtml.includes('김테스트') && !teacherFilteredHtml.includes('박임포트'),
    'teacher filter should match students by assigned class teacher_names'
  );
  context.EieStudentsView.setTeacherFilter('all');

  context.EieStudentsView.startCreate();
  const createHtml = await context.EieStudentsView.render();
  assert(
    createHtml.includes('name="create-teacher"') && createHtml.includes('김원장') && createHtml.includes('이선생'),
    'student create form should render selectable teacher checkboxes from timetable roster'
  );

  assert(
    createHtml.includes('<select id="create-grade">') && createHtml.includes('<option value="중1"') && createHtml.includes('<option value="고3"'),
    'student create form should use a fixed grade select from 중1 to 고3'
  );

  assert(
    !createHtml.includes('id="create-grade" type="text"'),
    'student create form should not use a free-text grade input'
  );

  for (const field of [
    'create-student-type',
    'create-parent-phone',
    'create-guardian-relation',
    'create-address',
    'create-vehicle',
    'create-pin'
  ]) {
    assert(createHtml.includes(`id="${field}"`), `student create form should render ${field}`);
  }

  const fields = {
    'create-name': { value: '최신규' },
    'create-grade': { value: '초4' },
    'create-school': { value: '테스트초' },
    'create-phone': { value: '010-1111-2222' },
    'create-parent-phone': { value: '010-3333-4444' },
    'create-guardian-relation': { value: '모' },
    'create-address': { value: '서울시 테스트구' },
    'create-vehicle': { value: '등원차량' },
    'create-pin': { value: '1234' },
    'create-student-type': { value: '신입' },
    'create-status': { value: 'active' },
    'create-memo': { value: '담당 복수 선택' }
  };
  context.document = {
    getElementById(id) {
      return fields[id] || { value: '' };
    },
    querySelectorAll(selector) {
      if (selector === 'input[name="create-teacher"]:checked') {
        return [{ value: '김원장' }, { value: '이선생' }];
      }
      return [];
    }
  };
  await context.EieStudentsView.submitCreate();
  assert.deepStrictEqual(
    createdPayload.teacher_names,
    ['김원장', '이선생'],
    'student create payload should include multiple selected teacher names'
  );
  assert.strictEqual(createdPayload.student_phone, '010-1111-2222', 'student create payload should include student phone');
  assert.strictEqual(createdPayload.parent_phone, '010-3333-4444', 'student create payload should include parent phone separately');
  assert.strictEqual(createdPayload.guardian_relation, '모', 'student create payload should include guardian relation');
  assert.strictEqual(createdPayload.student_address, '서울시 테스트구', 'student create payload should include address');
  assert.strictEqual(createdPayload.vehicle_info, '등원차량', 'student create payload should include vehicle info');
  assert.strictEqual(createdPayload.student_pin, '1234', 'student create payload should include PIN');
  assert.strictEqual(createdPayload.student_type, '신입', 'student create payload should include student type');

  console.log('EIE student click handler regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
