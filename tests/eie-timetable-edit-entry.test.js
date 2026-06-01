const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const timetableSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const timetableV2Source = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable-v2.js'), 'utf8');

const state = {
  timetableCells: [],
  studentCandidatePanelMode: '',
  db: { timetable_cells: [] }
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
    },
    setTimetableBusy(value) {
      state.isTimetableBusy = !!value;
    },
    closeStudentCandidatePanel() {}
  },
  EieApi: {
    async getTimetable() {
      return {
        timetable_cells: [
          {
            id: 'cell_alpha',
            day_label: '월',
            period_label: '1교시',
            period_order: 1,
            column_index: 0,
            start_time: '15:00',
            end_time: '16:00',
            class_name_raw: 'A반',
            teacher_name_raw: 'Teacher A',
            status: 'active',
            assigned_students: [{ assignment_id: 'a1', student_id: 's1', name: 'Alpha' }]
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
vm.runInContext(timetableSource, context, { filename: 'eie-timetable.js' });
vm.runInContext(timetableV2Source, context, { filename: 'eie-timetable-v2.js' });

(async () => {
  const editHtml = await context.EieTimetableView.render();
  assert(editHtml.includes('시간표 편집'), 'legacy timetable route should be labeled as timetable editor');
  assert(editHtml.includes('편집 중'), 'legacy timetable route should enter edit mode immediately');
  assert(editHtml.includes('eie-edit-board'), 'editor should render the v2-style time-axis edit board');
  assert(editHtml.includes('eie-edit-session-card'), 'editor should render v2-style editable session cards');
  assert(editHtml.includes('data-eie-drop-slot="true"'), 'editor should keep editable drop slots for moving and creating classes');
  assert(editHtml.includes('draggable="true" data-eie-cell-card="true"'), 'editor should keep draggable timetable cards');
  assert(editHtml.includes('data-eie-timetable-action="prepare-save"'), 'editor should keep save validation controls');
  assert(!editHtml.includes('data-eie-timetable-action="start-edit"'), 'editor entry should not show a separate view-mode edit button');

  const v2Html = await context.EieTimetableV2View.render();
  assert(v2Html.includes('data-eie-route="timetable"'), 'v2 timetable should expose a route into timetable editing');
  assert(v2Html.includes('시간표'), 'v2 timetable should remain the main timetable view');

  console.log('EIE timetable edit entry regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
