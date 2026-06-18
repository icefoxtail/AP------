const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const root = path.resolve(__dirname, '..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

function loadFrontendHarness() {
  const context = {
    console,
    setTimeout,
    localStorage: { getItem() { return 'admin'; } },
    window: {
      addEventListener() {},
      print() {}
    },
    document: {
      body: { classList: { add() {}, remove() {} } },
      getElementById() {
        return null;
      },
      querySelector() {
        return null;
      },
      querySelectorAll() {
        return [];
      }
    },
    EieApi: {}
  };
  context.window.document = context.document;
  context.window.localStorage = context.localStorage;
  vm.createContext(context);
  vm.runInContext(read('eie/js/views/eie-timetable-months.js'), context);
  return context;
}

(async () => {
  const route = read('workers/wangji-eie-worker/routes/eie.js');
  const api = read('eie/js/eie-api.js');
  const router = read('eie/js/eie-router.js');
  const view = read('eie/js/views/eie-timetable-months.js');
  const css = read('eie/css/eie-timetable-months.css');
  const html = read('eie/index.html');

  assert(route.includes('handleEieTimetableMonths'), 'EIE worker must route timetable-months');
  assert(route.includes('buildCurrentEieSnapshotRows'), 'EIE worker must build snapshots from current timetable rows');
  assert(route.includes('attachAssignedStudents'), 'EIE snapshot must reuse assigned-student source');
  assert(route.includes('buildEieTimetableMonthChangeSet'), 'EIE worker must expose grouped compare logic');
  assert(route.includes('snapshot already exists'), 'EIE duplicate insert guard missing');
  assert(route.includes('return `id:${sourceId}`'), 'EIE compare must prefer source_student_id before fallback identity');

  [
    'getTimetableMonths',
    'getTimetableMonth',
    'saveTimetableMonthSnapshot',
    'getTimetableMonthChanges'
  ].forEach(name => assert(api.includes(name), `EIE api missing ${name}`));

  assert(router.includes("'timetable-months'"), 'EIE router missing timetable-months route');
  assert(view.includes('window.print'), 'EIE monthly view must expose print');
  assert(view.includes('data-eie-month-compare'), 'EIE monthly view must expose compare button');
  assert(view.includes('eie-month-printing'), 'EIE print scope must require monthly print body class');
  assert(css.includes('body.eie-month-printing *'), 'EIE print CSS must be scoped behind body class');
  assert(!css.includes('@media print {\n    body *'), 'EIE print CSS must not globally hide all print content');
  assert(html.includes('eie-timetable-months.css'), 'EIE index must include monthly timetable css');
  assert(html.includes('eie-timetable-months.js'), 'EIE index must include monthly timetable js');

  const frontend = loadFrontendHarness();
  const monthEnd = frontend.window.__eieTimetableMonthsTest.monthEnd;
  assert.strictEqual(monthEnd('2026-06'), '2026-06-30');
  assert.strictEqual(monthEnd('2026-02'), '2026-02-28');
  assert.strictEqual(monthEnd('2028-02'), '2028-02-29');

  const mod = await import(pathToFileURL(path.join(root, 'workers/wangji-eie-worker/routes/eie.js')).href);
  const previous = {
    timetable_cells: [
      { id: 'eA', source_cell_id: 'cellA', day_label: 'Mon', period_label: '1', class_name_raw: 'A', teacher_name_raw: 'T', column_index: 1, slot_lane: 1 },
      { id: 'eB', source_cell_id: 'cellB', day_label: 'Tue', period_label: '2', class_name_raw: 'B', teacher_name_raw: 'T', column_index: 2, slot_lane: 1 }
    ],
    students: [
      { id: 's1a', snapshot_cell_id: 'eA', source_student_id: 'stu1', display_name: 'Kim' },
      { id: 's1b', snapshot_cell_id: 'eB', source_student_id: 'stu1', display_name: 'Kim' },
      { id: 'sLeft', snapshot_cell_id: 'eA', source_student_id: 'left1', display_name: 'Left' }
    ]
  };
  const current = {
    timetable_cells: [
      { id: 'eA', source_cell_id: 'cellA', day_label: 'Mon', period_label: '1', class_name_raw: 'A', teacher_name_raw: 'T', column_index: 1, slot_lane: 1 },
      { id: 'eC', source_cell_id: 'cellC', day_label: 'Wed', period_label: '3', class_name_raw: 'C', teacher_name_raw: 'T', column_index: 3, slot_lane: 2 }
    ],
    students: [
      { id: 's1a2', snapshot_cell_id: 'eA', source_student_id: 'stu1', display_name: 'Kim' },
      { id: 'sJoin', snapshot_cell_id: 'eC', source_student_id: 'join1', display_name: 'Join' }
    ]
  };
  const changes = mod.buildEieTimetableMonthChangeSet(previous, current);
  assert.strictEqual(changes.joined.length, 1, 'new EIE student should be joined');
  assert.strictEqual(changes.left.length, 1, 'fully removed EIE student should be left');
  assert.strictEqual(changes.moved.length, 1, 'partial EIE cell removal should be moved, not left');
  assert.strictEqual(changes.moved[0].removed_positions.length, 1);
  assert.strictEqual(changes.moved[0].added_positions.length, 0);

  const movedOnly = mod.buildEieTimetableMonthChangeSet(
    {
      timetable_cells: [
        { id: 'oldA', source_cell_id: 'cellA', day_label: 'Mon', period_label: '1', class_name_raw: 'A', teacher_name_raw: 'T', column_index: 1, slot_lane: 1 }
      ],
      students: [
        { id: 'sameOld', snapshot_cell_id: 'oldA', source_student_id: 'same1', display_name: 'Same' }
      ]
    },
    {
      timetable_cells: [
        { id: 'newB', source_cell_id: 'cellB', day_label: 'Tue', period_label: '2', class_name_raw: 'B', teacher_name_raw: 'T', column_index: 2, slot_lane: 1 }
      ],
      students: [
        { id: 'sameNew', snapshot_cell_id: 'newB', source_student_id: 'same1', display_name: 'Same' }
      ]
    }
  );
  assert.strictEqual(movedOnly.joined.length, 0, 'EIE A to B move must not be joined');
  assert.strictEqual(movedOnly.left.length, 0, 'EIE A to B move must not be left');
  assert.strictEqual(movedOnly.moved.length, 1, 'EIE A to B move should be moved');
  assert.strictEqual(movedOnly.moved[0].removed_positions.length, 1);
  assert.strictEqual(movedOnly.moved[0].added_positions.length, 1);

  console.log('EIE monthly timetable snapshot contract ok');
})();
