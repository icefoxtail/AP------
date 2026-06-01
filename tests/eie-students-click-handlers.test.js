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
    class_students: [],
    timetable_cells: []
  },
  ui: { eieApmsCompat: { loadedAt: Date.now() } }
};

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
    }
  },
  EieApi: {
    isAuthError() {
      return false;
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

  console.log('EIE student click handler regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
