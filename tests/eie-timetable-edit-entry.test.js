const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const timetableSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable.js'), 'utf8');
const editorSource = fs.readFileSync(path.join(root, 'eie/js/views/eie-timetable-editor.js'), 'utf8');
const cssSource = (function(){ const idx = fs.readFileSync(path.join(root, 'eie/index.html'), 'utf8'); const list = (idx.match(/href="\.\/css\/(eie[\w-]*\.css)"/g) || []).map(function(m){ return m.replace(/^.*\/css\//, '').replace(/".*$/, ''); }); return list.map(function(f){ return fs.readFileSync(path.join(root, 'eie/css', f), 'utf8'); }).join('\n'); })();

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
vm.runInContext(editorSource, context, { filename: 'eie-timetable-editor.js' });

(async () => {
  const editHtml = await context.EieTimetableEditorView.render();
  assert(editHtml.includes('eie-timetable-title'), 'legacy timetable route should be labeled as timetable editor');
  assert(editHtml.includes('eie-timetable-toolbar is-editing'), 'legacy timetable route should enter edit mode immediately');
  assert(editHtml.includes('eie-edit-board'), 'editor should render the v2-style time-axis edit board');
  assert(editHtml.includes('eie-edit-session-card'), 'editor should render v2-style editable session cards');
  assert(editHtml.includes('data-eie-drop-slot="true"'), 'editor should keep editable drop slots for moving and creating classes');
  assert(editHtml.includes('draggable="true" data-eie-cell-card="true"'), 'editor should keep draggable timetable cards');
  assert(editHtml.includes('data-eie-timetable-action="prepare-save"'), 'editor should keep save validation controls');
  assert(editHtml.includes('data-eie-timetable-action="print-edit"'), 'editor should expose a print button for manual timetable correction');
  assert(!editHtml.includes('data-eie-timetable-action="start-edit"'), 'editor entry should not show a separate view-mode edit button');

  const v2Html = await context.EieTimetableView.render();
  assert(v2Html.includes('data-eie-print-timetable'), 'operating timetable should expose a print button');
  assert(v2Html.includes('data-eie-edit-toggle'), 'operating timetable should keep an edit entry control');
  assert(v2Html.includes('eie-v2-title'), 'operating timetable should remain the main timetable view');
  assert(timetableSource.includes('window.print?.()'), 'timetable print button should call browser print');
  assert(editorSource.includes('printEditTimetable'), 'editor print button should call the editor print flow');
  assert(editorSource.includes('eie-printing-timetable-editor'), 'editor print flow should scope print mode on the body');
  assert(cssSource.includes('body.eie-printing-timetable'), 'print CSS should scope timetable print layout');
  assert(cssSource.includes('body.eie-printing-timetable-editor'), 'print CSS should scope timetable editor print layout');
  assert(cssSource.includes('@media print'), 'timetable print layout should use print media CSS');

  console.log('EIE timetable edit entry regression test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
