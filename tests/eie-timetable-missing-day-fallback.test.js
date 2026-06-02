const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const timetableSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable-v2.js'), 'utf8');

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
      return {
        timetable_cells: [
          {
            id: 'cell_without_day',
            day_label: '',
            period_order: 1,
            column_index: 2,
            start_time: '15:10',
            end_time: '15:50',
            class_name_raw: 'RS3-1 Carmen',
            teacher_name_raw: 'Carmen',
            status: 'active',
            assigned_students: [{ student_id: 'student_alpha', name: 'Alpha' }]
          }
        ]
      };
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
vm.runInContext(timetableSource, context, { filename: 'eie-timetable-v2.js' });

(async () => {
  const html = await context.EieTimetableV2View.render();

  assert(html.includes('전체'), 'timetable-v2 should expose a fallback day tab when imported cells have no day label');
  assert(html.includes('data-eie-route="teacher"'), 'teacher sessions should return from timetable to the teacher dashboard');
  assert(html.includes('RS3-1 Carmen'), 'timetable-v2 should render classes even when day_label is blank');
  assert(html.includes('Carmen'), 'timetable-v2 should keep teacher columns for dayless imported cells');
  assert(!html.includes('선택한 요일에 표시할 수업이 없습니다.'), 'dayless imported cells should not be dropped into an empty-state board');

  console.log('EIE timetable missing day fallback test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
