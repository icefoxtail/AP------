const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const timetableSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');

assert(!timetableSource.includes('EIE_TRUTH_TABLE'), 'timetable view should not keep the old hardcoded truth table');
assert(!timetableSource.includes('RS2-1'), 'timetable view should not keep old seed class rows in source');

const currentRows = [
  {
    id: 'current_rs3_1',
    day_label: '',
    period_label: '1교시',
    period_order: 1,
    column_index: 2,
    start_time: '15:10',
    end_time: '15:50',
    class_name_raw: 'rs3-1 Carmen',
    material_text: 'rs3-1',
    teacher_name_raw: 'Carmen',
    status: 'active',
    day_teachers: { 월: ['Carmen'], 화: ['Carmen'], 수: [], 목: [], 금: [] },
    assigned_students: [
      { student_id: 's1', name: '김채민' },
      { student_id: 's2', name: '김하연' }
    ]
  }
];

const state = {
  timetableCells: [],
  db: { timetable_cells: [], students: [] }
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
  localStorage: {
    getItem(key) {
      if (key === 'WANGJI_EIE_ROLE') return 'teacher';
      return '';
    }
  },
  document: {
    addEventListener() {}
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
    }
  },
  EieApi: {
    async getTimetable() {
      return { timetable_cells: currentRows };
    }
  },
  EieRouter: {
    open() {}
  }
};

context.window = context;
context.window.innerWidth = 1280;
context.window.addEventListener = function () {};

vm.createContext(context);
vm.runInContext(timetableSource, context, { filename: 'eie-timetable.js' });

(async () => {
  assert.strictEqual(
    typeof context.EieTimetableView._buildTimetableValidationPreview,
    'function',
    'timetable view should expose current timetable validation preview builder'
  );

  const sessions = context.EieTimetableView._buildDisplaySessions(currentRows);
  const preview = context.EieTimetableView._buildTimetableValidationPreview(sessions);
  const serialized = JSON.stringify(preview);

  assert.strictEqual(preview.length, 1, 'validation preview should be built from the one current timetable cell');
  assert(serialized.includes('rs3-1'), 'validation preview should include the currently saved material');
  assert(!serialized.includes('RS2-1'), 'validation preview should not inject old hardcoded truth rows');
  assert(!serialized.includes('truthRow'), 'validation preview should not carry truth-table repair data');

  const html = await context.EieTimetableView.render();
  assert(html.includes('rs3-1 Carmen'), 'rendered timetable should keep the current timetable cell');
  assert(!html.includes('RS2-1'), 'rendered timetable should not surface old truth-table classes');

  console.log('EIE timetable current validation test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
